import {build} from 'esbuild';
import assert from 'node:assert/strict';
await build({stdin:{contents:"export {generateDemolitionBuilding} from './src/procedural-buildings';export {Simulation,loadPhysics} from './src/physics';",resolveDir:process.cwd()},bundle:true,platform:'node',format:'esm',external:['jolt-physics'],outfile:'artifacts/concrete-startup.mjs'});
const {generateDemolitionBuilding,Simulation,loadPhysics}=await import('../artifacts/concrete-startup.mjs');
const J=await loadPhysics();
for(const style of ['art-deco','brutalist','skybridge']){
 const b=generateDemolitionBuilding(1000,90210,style),sim=new Simulation(J,b.pieces,'sandbox',1,{sandbox:true,fragmentLimit:1000});
 try{const startup=await sim.settleStartup();for(let i=0;i<60;i++)sim.step(1/60);console.log({style,startup,broken:sim.broken,fragments:sim.fragments});assert.equal(sim.broken,0,style+' must not start collapsing');assert.equal(sim.fragments,0);}finally{sim.dispose();}
}
