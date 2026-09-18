import assert from 'node:assert/strict';
import { build } from 'esbuild';

await build({
  stdin: {
    contents: "export { Simulation, loadPhysics } from './src/physics.ts'; export { SHOWCASES, showcasePieces } from './src/showcases.ts';",
    resolveDir: process.cwd(),
  },
  bundle: true,
  platform: 'node',
  format: 'esm',
  external: ['jolt-physics'],
  outfile: 'artifacts/showcases-test.mjs',
});

const { Simulation, loadPhysics } = await import('../artifacts/showcases-test.mjs?' + Date.now());
const { SHOWCASES, showcasePieces } = await import('../artifacts/showcases-test.mjs?' + Date.now());
const J = await loadPhysics();

function run(pieces, seconds = 8) {
  const sim = new Simulation(J, pieces, 'sandbox', 1, { sandbox: true, duration: seconds });
  for (let i = 0; i < seconds * 120; i++) sim.step();
  const moved = sim.items.filter(item => item.id > 0 && (() => {
    const p = item.body.GetPosition();
    return Math.hypot(p.GetX() - item.initial[0], p.GetY() - item.initial[1], p.GetZ() - item.initial[2]) > 1.5;
  })()).length;
  const structural = sim.items.filter(item => item.id > 0).length;
  const result = { broken: sim.broken, moved, structural, fraction: moved / structural };
  sim.dispose();
  return result;
}

for (const showcase of SHOWCASES) {
  const pieces = showcasePieces(showcase.id);
  assert.equal(pieces.length, showcase.count, `${showcase.id}: metadata count`);
  assert.ok(pieces.length < 350, `${showcase.id}: piece budget`);
  const state = run(pieces);
  assert.equal(state.broken, 0, `${showcase.id}: ${state.broken} joints broke`);
  assert.ok(state.fraction < 0.25, `${showcase.id}: ${(state.fraction * 100).toFixed(1)}% moved`);
  console.log(`PASS: ${showcase.id} (${pieces.length} pieces, ${showcase.height} m, ${state.broken} broken joints, ${(state.fraction * 100).toFixed(1)}% moved)`);
}

console.log('All showcase gravity checks passed.');

