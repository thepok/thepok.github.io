import { build } from 'esbuild';
import assert from 'node:assert/strict';

await build({ stdin: { contents: "export {Simulation,loadPhysics} from './src/physics.ts'; export {WalkerPhysics} from './src/walker-physics.ts'; export {generateDemolitionBuilding} from './src/procedural-buildings.ts'; export {stairWalkingRoute} from './src/building-accessibility.ts'; export {PARTS} from './src/catalog.ts';", resolveDir: process.cwd() }, bundle: true, platform: 'node', format: 'esm', external: ['jolt-physics'], outfile: 'artifacts/core-building-test.mjs' });
const { Simulation, loadPhysics, WalkerPhysics, generateDemolitionBuilding, stairWalkingRoute, PARTS } = await import('../artifacts/core-building-test.mjs?' + Date.now());
const J = await loadPhysics();
for (const style of ['art-deco', 'brutalist', 'skybridge']) {
  const generated = generateDemolitionBuilding(1000, 90210, style);
  // Keep this startup/impact regression on the legacy material baseline;
  // material-profile behavior is covered by concrete-materials-physics.mjs.
  for (const piece of generated.pieces) if (['foundation','core','column','wall','doorway','stair','stairwell','slab'].includes(piece.kind)) { piece.concreteStrength = 1; piece.reinforcement = 1; }
  const cores = generated.pieces.filter(p => p.kind === 'core');
  const stairs = generated.pieces.filter(p => p.kind === 'stair');
  assert.ok(cores.length > 0, `${style} should include a reinforced core`);
  assert.ok(stairs.length > 0, `${style} should retain an accessible stair route`);
  assert.ok(cores.every(p => PARTS[p.kind].mass > PARTS.wall.mass * 2 && PARTS[p.kind].force > PARTS.wall.force * 2), `${style} core should materially exceed wall strength`);
  for (const stair of stairs) {
    const route = stairWalkingRoute(stair);
    for (const point of route) {
      // The route must stay clear of the core's side walls: the opening edge
      // is x=.4 and the opposite stair landing ends before x=3.6.
      assert.ok(point[0] >= stair.p[0] + .38 && point[0] <= stair.p[0] + 3.62, `${style} stair route leaves its shaft`);
    }
  }
  const sim = new Simulation(J, generated.pieces, 'sandbox', 1, { sandbox: true, fragmentLimit: 6000 });
  try {
    await sim.settleStartup();
    for (let i = 0; i < 150; i++) sim.step(1 / 30);
    assert.equal(sim.broken, 0, `${style} core must not break joints during the first 5 seconds`);
    const core = sim.items.find(i => i.kind === 'core');
    const wall = sim.items.find(i => i.kind === 'wall') ?? sim.items.find(i => i.kind === 'facade') ?? sim.items.find(i => i.kind === 'column');
    assert.ok(core && wall, `${style} should expose core and ordinary structural bodies`);
    const stair = stairs.find(s => cores.some(c => c.p[0] === s.p[0] && c.p[2] + 2 === s.p[2] && c.p[1] === s.p[1])) ?? stairs[0];
    const route = stairWalkingRoute(stair);
    const walker = new WalkerPhysics(sim, [route[0][0], .1, route[0][2]]);
    try {
      for (let i = 1; i < route.length; i++) {
        const target = route[i];
        for (let step = 0; step < 300; step++) {
          const p = walker.snapshot().position, dx = target[0] - p[0], dz = target[2] - p[2];
          if (Math.hypot(dx, dz) < .35 && Math.abs(target[1] - p[1]) < .45) break;
          walker.controls.forward = 1; walker.controls.yaw = Math.atan2(dx, -dz);
          walker.step(1 / 30); sim.step(1 / 30);
        }
        walker.controls.forward = 0;
        const reached = walker.snapshot().position;
        assert.ok(Math.abs(reached[1] - target[1]) < .55 && Math.hypot(reached[0] - target[0], reached[2] - target[2]) < .75, `${style} walker should reach stair waypoint ${i}`);
      }
      const walked = walker.snapshot();
      assert.ok(walked.position[1] > 3.7, `${style} walker should climb the first floor; reached ${walked.position[1]}`);
      console.log('walker climbed', style, walked.position[1]);
    } finally { walker.dispose(); }
    const cp = core.body.GetCenterOfMassPosition();
    const corePoint = [cp.GetX(), cp.GetY(), cp.GetZ()];
    const wp = wall.body.GetCenterOfMassPosition();
    const wallPoint = [wp.GetX(), wp.GetY(), wp.GetZ()];
    sim.impactFracture(wall, wallPoint, 900000);
    assert.equal(wall.fractured, true, `${style} ordinary wall should fracture at 900 kJ`);
    sim.impactFracture(core, corePoint, 900000);
    assert.equal(core.fractured, undefined, `${style} core should absorb the first 900 kJ impact`);
    sim.impactFracture(core, corePoint, 4500000);
    assert.equal(core.fractured, true, `${style} core should fracture after 4.5 MJ accumulated impact`);
    console.log('core startup', style, { pieces: generated.pieces.length, cores: cores.length, stairs: stairs.length, broken: sim.broken });
  } finally { sim.dispose(); }
}
console.log('PASS reinforced hollow cores preserve stair access and startup stability');
