import assert from 'node:assert/strict';
import { build } from 'esbuild';
import initJolt from 'jolt-physics';

const bundle = async entry => (await build({ entryPoints: [entry], bundle: true, platform: 'node', format: 'esm', write: false })).outputFiles[0].text;
const [physicsCode, walkerCode, accessCode, catalogCode, generatedCode, showcasesCode] = await Promise.all([
  bundle('src/physics.ts'), bundle('src/walker-physics.ts'), bundle('src/building-accessibility.ts'), bundle('src/catalog.ts'), bundle('src/procedural-buildings.ts'), bundle('src/showcases.ts'),
]);
const importBundle = code => import(`data:text/javascript;base64,${Buffer.from(code).toString('base64')}`);
const [{ Simulation }, { WalkerPhysics }, accessibility, { PARTS }, generatedApi, showcasesApi] = await Promise.all([
  importBundle(physicsCode), importBundle(walkerCode), importBundle(accessCode), importBundle(catalogCode), importBundle(generatedCode), importBundle(showcasesCode),
]);
const J = await initJolt();

function baseBuilding() {
  const pieces = [];
  let id = 1;
  const add = (kind, p) => pieces.push({ id: id++, kind, p, rotation: 0 });
  for (const z of [-2, 2]) for (const x of [0, 4]) add('foundation', [x, 0, z]);
  for (const p of [[0, 0, -2], [4, 0, -2], [0, 0, 2], [4, 0, 2]]) add('column', p);
  for (const p of [[0, 4, -2], [4, 4, -2], [0, 4, 2], [4, 4, 2]]) add('column', p);
  add('slab', [0, 4, 0]); add('slab', [0, 8, 0]);
  add('wall', [0, 0, -4]);
  return pieces;
}

function runWorld(pieces, spawn, targets, label) {
  const sim = new Simulation(J, pieces, 'sandbox', 1, { sandbox: true });
  const walker = new WalkerPhysics(sim, spawn);
  const dt = 1 / 60;
  for (let i = 0; i < 180; i++) { walker.step(dt); sim.step(dt); }
  let previous = walker.snapshot().position;
  for (const target of targets) {
    for (let i = 0; i < 300; i++) {
      const p = walker.snapshot().position;
      const dx = target[0] - p[0], dz = target[2] - p[2];
      if (Math.hypot(dx, dz) < .3 && Math.abs(target[1] - p[1]) < .45) break;
      const yaw = Math.atan2(dx, -dz);
      walker.controls.yaw = yaw; walker.controls.forward = 1;
      walker.step(dt); sim.step(dt);
      const now = walker.snapshot().position;
      assert.ok(Math.hypot(...now.map((v, axis) => v - previous[axis])) < 1.1, `${label}: no ghost teleport`);
      previous = now;
    }
    walker.controls.forward = 0;
    const reached = walker.snapshot().position;
    if (Math.hypot(reached[0] - target[0], reached[2] - target[2]) >= .65) console.log('waypoint failure', label, target, reached);
    assert.ok(Math.abs(reached[1]-target[1])<.5&&Math.hypot(reached[0] - target[0], reached[2] - target[2]) < .65, `${label}: reached waypoint ${target}`);
  }
  const result = walker.snapshot();
  walker.dispose(); sim.dispose();
  return result;
}

const accessible = accessibility.withBuildingAccessibility(baseBuilding(), { entrance: true, stairs: true, maxStairs: Infinity });
const route = accessible.filter(p=>p.kind==='stair').flatMap(accessibility.stairWalkingRoute);
assert.ok(accessible.some(piece => piece.kind === 'stair'), 'two story building receives a stair');
assert.ok(route.length >= 3, 'accessibility route has entry and stair waypoints');
// Explicit U route follows the actual two switchback flights and landing.
const simpleResult = runWorld(accessible, [.8, .1, -.7], [[3.2, 2, -.7], [3.5, 2, .7], [.8, 4, .7], [.4, 4, -.7], [3.2, 6, -.7], [3.5, 6, .7], [.8, 8, .7]], 'two-story U stair');
assert.ok(simpleResult.position[1] > 7, 'walker reaches second upper stair flight');

for(const [label,pieces] of [['generated classic',generatedApi.generateDemolitionBuilding(100,424242,'classic').pieces],['Maison Azur',showcasesApi.showcasePieces('maison-azur')]]){
 const entry=accessibility.walkingEntry(pieces);assert.ok(entry,`${label} has entrance`);
 runWorld(pieces,entry.spawn,[entry.inside],`${label} entrance`);
 const stair=pieces.filter(p=>p.kind==='stair').sort((a,b)=>a.p[1]-b.p[1])[0];
 const route=accessibility.stairWalkingRoute(stair);
 const result=runWorld(pieces,route[0].map((v,i)=>v+(i===1?.05:0)),route.slice(1),`${label} stairs`);
 assert.ok(result.position[1]>3.7,`${label} climbs actual first floor`);
}
console.log('PASS actual two-story stairs and generated/premade doorway and stair traversal');
