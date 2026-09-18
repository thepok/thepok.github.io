import assert from 'node:assert/strict';
import { mkdir } from 'node:fs/promises';
import { build } from 'esbuild';

await mkdir('artifacts', { recursive: true });
await build({
  stdin: {
    contents: "export { Simulation, loadPhysics } from './src/physics.ts'; export { sample, cost } from './src/catalog.ts'; export { CAMPAIGN_LEVELS, starterPieces } from './src/campaign.ts';",
    resolveDir: process.cwd(),
  },
  bundle: true,
  platform: 'node',
  format: 'esm',
  external: ['jolt-physics'],
  outfile: 'artifacts/landslide-challenges.mjs',
});

const { Simulation, loadPhysics, sample, cost, CAMPAIGN_LEVELS, starterPieces } =
  await import('../artifacts/landslide-challenges.mjs?' + Date.now());
const J = await loadPhysics();

function run(pieces, level) {
  const sim = new Simulation(J, pieces, level.scenario, level.intensity, level.rules);
  for (let i = 0; i < Math.ceil((sim.duration + 0.1) * 120) && !sim.result; i++) sim.step();
  const p = sim.house.body.GetPosition();
  const displacement = Math.hypot(p.GetX(), p.GetY() - 1.6, p.GetZ() - 5);
  return { sim, displacement };
}

const levels = CAMPAIGN_LEVELS.filter(level => level.scenario === 'landslide');
assert.equal(levels.length, 3, 'campaign must contain one landslide challenge per tier');

for (const level of levels) {
  const starter = starterPieces(level);
  assert.ok(starter.length > 0 && starter.every(piece => piece.kind === 'foundation'), `${level.id}: expected foundation-only starter`);

  const empty = run([], level);
  assert.equal(empty.sim.result, 'failed', `${level.id}: an empty site must fail`);
  assert.ok(empty.displacement>.5,`${level.id}: empty site must physically damage house`);empty.sim.dispose();

  const unprotected = run(starter, level);
  assert.equal(unprotected.sim.result, 'failed', `${level.id}: foundation-only starter must fail`);
  assert.ok(unprotected.displacement >= 0.5, `${level.id}: starter house displacement ${unprotected.displacement.toFixed(3)} m must reach the physical failure threshold`);
  unprotected.sim.dispose();

  const design=sample('landslide');if(level.tier===3)for(const p of sample('landslide'))design.push({...p,id:design.length+1,p:[p.p[0],p.p[1],p.p[2]-4]});
  const reference = run(design, level);
  assert.equal(reference.sim.result, 'passed', `${level.id}: retaining-wall reference failed: ${reference.sim.reason}`);
  assert.ok(reference.displacement < 0.5, `${level.id}: retaining-wall reference moved ${reference.displacement.toFixed(3)} m`);
  assert.ok(cost(design) <= level.budget, `${level.id}: reference exceeds budget`);
  reference.sim.dispose();
  console.log(`PASS ${level.id}: empty/starter fail physically; reference passes (${level.rules.rockCount} rocks, intensity ${level.intensity})`);
}

console.log('Landslide challenge calibration passed.');
