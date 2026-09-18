import assert from 'node:assert/strict';
import { mkdir } from 'node:fs/promises';
import { build } from 'esbuild';

await mkdir('artifacts', { recursive: true });
await build({
  stdin: {
    contents: "export { Simulation,loadPhysics } from './src/physics.ts'; export { sample, cost, ports } from './src/catalog.ts'; export { CAMPAIGN_LEVELS, starterPieces } from './src/campaign.ts';",
    resolveDir: process.cwd(),
  },
  bundle: true, platform: 'node', format: 'esm', external: ['jolt-physics'], outfile: 'artifacts/campaign-physics.mjs',
});
const { Simulation, loadPhysics, sample, cost, ports, CAMPAIGN_LEVELS, starterPieces } = await import('../artifacts/campaign-physics.mjs?' + Date.now());
const J = await loadPhysics();console.log('Engine ready');

function run(sim, seconds = sim.duration + .1) {
  for (let i = 0; i < Math.ceil(seconds * 120) && !sim.result; i++) sim.step();
  return sim;
}
function add(pieces, kind, p, rotation = 0) {
  pieces.push({ id: pieces.length + 1, kind, p, rotation });
}
function reference(level) {
  const pieces = sample(level.scenario);
  if (level.rules.minHeight === 16) {
    for (const x of [-4, 0, 4]) for (const z of [-4, 0, 4]) add(pieces, 'column', [x, 12, z]);
    for (const x of [-4, 0]) for (const z of [-2, 2]) add(pieces, 'slab', [x, 16, z]);
    for (const z of [-4, 4]) for (const x of [-4, 0]) add(pieces, 'brace', [x, 12, z]);
  }
  if(level.rules.minHeight===16){for(let y=0;y<16;y+=4)for(const x of [-4,4])for(const z of [0,4])add(pieces,'brace',[x,y,z],1)}
  if(level.scenario==='landslide'&&level.tier===3){for(const p of sample('landslide'))add(pieces,p.kind,[p.p[0],p.p[1],p.p[2]-4],p.rotation)}
  return pieces;
}
function check(level, pieces) {
  console.log('Checking',level.id);
  const result = run(new Simulation(J, pieces, level.scenario, level.intensity, level.rules));
  assert.equal(result.result, 'passed', `${level.id}: ${result.reason}; cost ${cost(pieces)} / ${level.budget}`);
  assert.ok(cost(pieces) <= level.budget, `${level.id}: cost exceeds budget`);
  result.dispose();console.log('PASS',level.id);
}

// The first level deliberately omits the centre deck; repairing that one gap restores the pass.
const selectedOrders=process.argv.slice(2).map(Number);
const levels=selectedOrders.length?CAMPAIGN_LEVELS.filter(l=>selectedOrders.includes(l.order)):CAMPAIGN_LEVELS;
if(!selectedOrders.length||selectedOrders.includes(1)){
const first = CAMPAIGN_LEVELS[0];
const missing = starterPieces(first);
console.log('Checking missing deck');
const failed = run(new Simulation(J, missing, first.scenario, first.intensity, first.rules));
assert.equal(failed.result, 'failed', 'campaign-01 starter must fail before the missing deck is repaired');
failed.dispose();console.log('Missing deck correctly fails');
const repaired = [...missing, { id: missing.length + 1, kind: 'deck', p: [0, 0, 0], rotation: 0 }];
check(first, repaired);

}
// Tower starters teach the first storey and must not already satisfy the height objective.
for (const level of CAMPAIGN_LEVELS.filter(item => item.scenario !== 'bridge' && item.scenario !== 'landslide')) {
  const starter = starterPieces(level);
  const highest = Math.max(...starter.flatMap(piece => ports(piece).map(point => point[1])), 0);
  assert.ok(highest < (level.rules.minHeight ?? 8), `${level.id}: starter already reaches target height`);
}

// Complete catalog references, with one extra 4 m tower storey where the 16 m target requires it.
for (const level of levels) check(level, reference(level));

console.log('Campaign physics feasibility passed:',levels.map(l=>l.order).join(', '));
