import { build } from 'esbuild';
await build({stdin:{contents:"export {generateDemolitionBuilding} from './src/procedural-buildings.ts';export {Simulation,loadPhysics} from './src/physics.ts';export {addWorldPieces} from './src/structural-edit.ts';",resolveDir:process.cwd()},bundle:true,platform:'node',format:'esm',external:['jolt-physics'],outfile:'artifacts/live-added-startup.mjs'});
const {generateDemolitionBuilding,Simulation,loadPhysics,addWorldPieces}=await import('../artifacts/live-added-startup.mjs?'+Date.now()),J=await loadPhysics(),pieces=generateDemolitionBuilding(800,72000,'art-deco').pieces,rules={sandbox:true,fragmentLimit:1000};
const run=sim=>{for(let i=0;i<600;i++)sim.step(1/60);return {broken:sim.broken,fragments:sim.fragments};};
const initial=new Simulation(J,pieces,'sandbox',1,rules),a=run(initial);initial.dispose();const live=new Simulation(J,[],'sandbox',1,rules);addWorldPieces(live,pieces);const b=run(live);live.dispose();console.log({initial:a,live:b});
