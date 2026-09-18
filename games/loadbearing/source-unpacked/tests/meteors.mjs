import assert from 'node:assert/strict';
import { build } from 'esbuild';
import { rm } from 'node:fs/promises';
import { join } from 'node:path';
import { pathToFileURL } from 'node:url';

const bundlePath = join(process.cwd(), 'tests', '.meteors-fresh.mjs');
await build({
  stdin: { contents: "export { meteorFlight, METEOR_MASS_FACTOR } from './src/meteor-flight.ts'; export { Simulation, loadPhysics } from './src/physics.ts';", resolveDir: process.cwd() },
  bundle: true, platform: 'node', format: 'esm', external: ['jolt-physics'], outfile: bundlePath,
});
try {
  const { meteorFlight, METEOR_MASS_FACTOR, Simulation, loadPhysics } = await import(`${pathToFileURL(bundlePath).href}?fresh=${Date.now()}`);
  const target = [3.5, 7.25, -4.25];
  const signs = new Set(), elevations = new Set();
  for (let index = 0; index < 48; index++) {
    const flight = meteorFlight(index, target, 12, 1.5);
    const atImpact = flight.position.map((value, axis) => value + flight.velocity[axis] * flight.flightTime + (axis === 1 ? -.5 * 9.81 * flight.flightTime ** 2 : 0));
    assert.ok(atImpact.every((value, axis) => Math.abs(value - target[axis]) < 1e-6), 'meteor arc reaches the selected target');
    signs.add(`${Math.sign(flight.impact[0])}:${Math.sign(flight.impact[2])}`);
    elevations.add(Math.round(Math.atan2(-flight.impact[1], Math.hypot(flight.impact[0], flight.impact[2])) * 100));
  }
  assert.equal(signs.size, 4, 'meteor directions cover all four horizontal quadrants');
  assert.ok(elevations.size > 8, 'meteor elevations vary across launches');

  const J = await loadPhysics();
  const pieces = [{ id: 1, kind: 'wall', p: [0, 0, 0], rotation: 0 }];
  const sim = new Simulation(J, pieces, 'sandbox', 1, { sandbox: true });
  try {
    for (let i = 0; i < 29; i++) sim.spawnMeteor();
    assert.equal(sim.meteorPool.length, 24, 'meteor pool is capped at 24 bodies');
    assert.equal(new Set(sim.meteorPool.map(item => item.id)).size, 24, 'meteor pool IDs remain unique');
    for (const item of sim.meteorPool) {
      const radius = item.radius;
      const inverseMass = item.body.GetMotionProperties().GetInverseMass();
      assert.ok(Math.abs(inverseMass - 1 / (1800 * METEOR_MASS_FACTOR * radius ** 3)) < 1e-8, 'recycled meteor preserves exact mass');
    }
    console.log(JSON.stringify({ pool: sim.meteorPool.length, uniqueIds: new Set(sim.meteorPool.map(item => item.id)).size, meteorCount: sim.meteors, signs: signs.size, elevations: elevations.size }));
  } finally { sim.dispose(); }
} finally { await rm(bundlePath, { force: true }); }
console.log('meteors: analytical arcs, quadrant/elevation variation, pooling, IDs, and mass passed');
