import { mkdir, writeFile } from 'node:fs/promises';
import { build } from 'esbuild';

await mkdir('artifacts',{recursive:true});
await build({stdin:{contents:"export {generateDemolitionBuilding} from './src/procedural-buildings.ts'; export {Simulation,loadPhysics} from './src/physics.ts';",resolveDir:process.cwd()},bundle:true,platform:'node',format:'esm',external:['jolt-physics'],outfile:'artifacts/startup-baseline-bundle.mjs'});
const {generateDemolitionBuilding,Simulation,loadPhysics}=await import('../artifacts/startup-baseline-bundle.mjs?'+Date.now());
const J=await loadPhysics(),results=[];
for(const style of ['art-deco','pagoda','classic']){
 const sim=new Simulation(J,generateDemolitionBuilding(1000,72000,style).pieces,'sandbox',1,{sandbox:true,fragmentLimit:156});
 let firstBroken=null,maxDisplacement=0,peakStress=0,wallMs=0;
 for(let tick=1;tick<=600;tick++){
  const start=performance.now();sim.step(1/60);wallMs+=performance.now()-start;peakStress=Math.max(peakStress,sim.peakStress);
  for(const item of sim.items.filter(i=>i.id>0&&!i.fractured)){const p=item.body.GetPosition();maxDisplacement=Math.max(maxDisplacement,Math.hypot(p.GetX()-item.initial[0],p.GetY()-item.initial[1],p.GetZ()-item.initial[2]));}
  if(firstBroken===null&&sim.broken>0)firstBroken=tick;
 }
 results.push({style,parts:sim.pieces.length,firstBrokenTick:firstBroken,peakStress,maxDisplacement,endBroken:sim.broken,wallMs});
 console.log(JSON.stringify(results.at(-1)));sim.dispose();
}
await writeFile('artifacts/startup-baseline.json',JSON.stringify({steps:600,dt:1/60,seed:72000,results},null,2));
console.log('wrote artifacts/startup-baseline.json');
