import assert from 'node:assert/strict';
import { build } from 'esbuild';
import { rm } from 'node:fs/promises';
import { join } from 'node:path';
import { pathToFileURL } from 'node:url';

const bundlePath = join(process.cwd(), 'tests', '.walker-startup-fresh.mjs');
await build({
  stdin: { contents: "export { generateDemolitionBuilding } from './src/procedural-buildings.ts'; export { Simulation, loadPhysics } from './src/physics.ts';", resolveDir: process.cwd() },
  bundle: true, platform: 'node', format: 'esm', external: ['jolt-physics'], outfile: bundlePath,
});
const { generateDemolitionBuilding, Simulation, loadPhysics } = await import(`${pathToFileURL(bundlePath).href}?fresh=${Date.now()}`);
const J = await loadPhysics();

async function run(style, seed) {
  const generated = generateDemolitionBuilding(1000, seed, style);
  const sim = new Simulation(J, generated.pieces, 'sandbox', 1, { sandbox: true, fragmentLimit: 156 });
  try {
    const settle = await sim.settleStartup();
    for (let i = 0; i < 600; i++) sim.step(1 / 60);
    const broken = sim.joints.filter(j => j.broken).slice(0, 8).map(j => {
      const position = body => { const p = body?.GetPosition(); return p ? [p.GetX(), p.GetY(), p.GetZ()] : null; };
      return { a: j.a.kind, b: j.b?.kind ?? 'ground', aPosition: position(j.a.body), bPosition: position(j.b?.body), force: j.force, stress: j.stress };
    });
    const result = { style, seed, parts: generated.pieces.length, settleSteps: settle?.steps ?? null, quiet: settle?.quiet ?? false, broken: sim.broken, brokenJoints: broken, peakStress: sim.peakStress, finalStress: sim.maxStress };
    console.log(JSON.stringify(result));
    assert.ok(settle?.quiet, `${style}/${seed} did not settle`);
    return result;
  } finally { sim.dispose(); }
}

try {
  const first = await run('brutalist', 72000);
  assert.equal(first.broken, 0, 'specified brutalist/72000 startup regression');
  for (const style of ['brutalist', 'skybridge']) for (const seed of [72000, 12345, 54321]) {
    const result = style === 'brutalist' && seed === 72000 ? first : await run(style, seed);
    assert.equal(result.broken, 0, `${style}/${seed} startup broken joints`);
  }
  console.log('walker startup: brutalist and skybridge 1000-part fixtures settled without broken joints');
} finally {
  await rm(bundlePath, { force: true });
}
