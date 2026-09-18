import assert from 'node:assert/strict';
import { mkdir } from 'node:fs/promises';
import { build } from 'esbuild';

await mkdir('artifacts',{recursive:true});
await build({stdin:{contents:"export {Simulation,loadPhysics} from './src/physics.ts'; export {generateDemolitionBuilding} from './src/procedural-buildings.ts';",resolveDir:process.cwd()},bundle:true,platform:'node',format:'esm',external:['jolt-physics'],outfile:'artifacts/procedural-physics.mjs'});
const {Simulation,loadPhysics,generateDemolitionBuilding}=await import('../artifacts/procedural-physics.mjs?'+Date.now()),J=await loadPhysics();
for(const target of [500,1000]){
 const generated=generateDemolitionBuilding(target,90210+target,'classic'),sim=new Simulation(J,generated.pieces,'sandbox',1,{sandbox:true,fragmentLimit:156});
 const started=performance.now();for(let i=0;i<240;i++)sim.step();const elapsed=performance.now()-started,moved=sim.items.filter(item=>item.id>0&&(()=>{const p=item.body.GetPosition();return Math.hypot(p.GetX()-item.initial[0],p.GetY()-item.initial[1],p.GetZ()-item.initial[2])>.35})()).length;
 assert.equal(sim.broken,0,`${target}-part generated building broke under its own weight`);assert.equal(moved,0,`${target}-part generated building moved under its own weight`);assert.ok(sim.items.every(item=>{const p=item.body.GetPosition();return [p.GetX(),p.GetY(),p.GetZ()].every(Number.isFinite)}));
 console.log('PASS procedural physics',target,'parts',sim.joints.length,'joints',(elapsed/240).toFixed(2),'ms/step');sim.dispose();
}
