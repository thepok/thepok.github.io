import assert from 'node:assert/strict';
import {build} from 'esbuild';
await build({stdin:{contents:"export {Simulation,loadPhysics} from './src/physics.ts';export {CAMPAIGN_LEVELS,starterPieces} from './src/campaign.ts';export {evaluateBuilding} from './src/building-objective.ts';",resolveDir:process.cwd()},bundle:true,platform:'node',format:'esm',external:['jolt-physics'],outfile:'artifacts/campaign-starts.mjs'});
const {Simulation,loadPhysics,CAMPAIGN_LEVELS,starterPieces,evaluateBuilding}=await import('../artifacts/campaign-starts.mjs?'+Date.now());const J=await loadPhysics();
for(const level of CAMPAIGN_LEVELS){const pieces=starterPieces(level);if(level.rules.minHeight){
 // No qualifying slab exists at the target level. Movement cannot change its intended floor.
 assert.equal(pieces.some(p=>p.kind==='slab'&&p.p[1]>=level.rules.minHeight),false);assert.equal(evaluateBuilding(pieces,level.rules).passed,false);console.log('PASS unchanged starter cannot satisfy building goal:',level.id);continue;
 }
 const sim=new Simulation(J,pieces,level.scenario,level.intensity,level.rules);while(!sim.result)sim.step();assert.equal(sim.result,'failed',level.id+' starter unexpectedly won');if(sim.house){const p=sim.house.body.GetPosition();assert.ok(Math.hypot(p.GetX(),p.GetY()-1.6,p.GetZ()-5)>.5,level.id+' must physically damage the unprotected house')};console.log('PASS unchanged starter loses physical test:',level.id,sim.reason);sim.dispose();
}
console.log('All 18 untouched campaign starts are losing states.');
