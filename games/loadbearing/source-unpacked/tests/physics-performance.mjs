import { performance } from 'node:perf_hooks';
import { mkdir } from 'node:fs/promises';
import { build } from 'esbuild';

await mkdir('artifacts',{recursive:true});
await build({
  stdin:{contents:"export { Simulation,loadPhysics } from './src/physics.ts';export { generateDemolitionBuilding } from './src/procedural-buildings.ts';",resolveDir:process.cwd()},
  bundle:true,platform:'node',format:'esm',external:['jolt-physics'],outfile:'artifacts/physics-performance.mjs'
});
const {Simulation,loadPhysics,generateDemolitionBuilding}=await import('../artifacts/physics-performance.mjs?'+Date.now());
const J=await loadPhysics();

function piecesFor(count){
  const base=generateDemolitionBuilding(Math.min(1000,count),0x51a7,'brutalist').pieces;
  const pieces=[];
  let id=1;
  for(let cluster=0;pieces.length<count;cluster++){
    for(const piece of base){
      if(pieces.length>=count)break;
      pieces.push({...piece,id:id++,p:[piece.p[0]+cluster*72,piece.p[1],piece.p[2]]});
    }
  }
  return pieces;
}
function percentile(values,p){
  const a=[...values].sort((x,y)=>x-y);
  return a[Math.min(a.length-1,Math.floor((a.length-1)*p))];
}
async function measure(count,active){
  const pieces=piecesFor(count);
  const initAt=performance.now();
  const sim=new Simulation(J,pieces,'sandbox',1,{sandbox:true,fragmentLimit:156},0);
  const initMs=performance.now()-initAt;
  const settle=await sim.settleStartup();
  for(let i=0;i<75;i++)sim.step(1/60);
  if(active){sim.setSandboxHazard('wind',true);for(let i=0;i<75;i++)sim.step(1/60);}
  const samples=[];
  for(let i=0;i<180;i++){
    const at=performance.now();
    sim.step(1/60);
    samples.push(performance.now()-at);
  }
  const result={
    pieces:count,
    mode:active?'wind':'quiet',
    initMs:+initMs.toFixed(2),
    settleMs:+((settle?.milliseconds)??0).toFixed(2),
    meanStepMs:+(samples.reduce((a,b)=>a+b,0)/samples.length).toFixed(3),
    medianStepMs:+percentile(samples,.5).toFixed(3),
    p95StepMs:+percentile(samples,.95).toFixed(3),
    maxStepMs:+Math.max(...samples).toFixed(3),
    bodies:sim.bodyList.length,
    joints:sim.joints.length,
    rebars:sim.rebars.length
  };
  sim.dispose();
  return result;
}
for(const count of [1000,2000]){
  console.log('BENCH '+JSON.stringify(await measure(count,false)));
  console.log('BENCH '+JSON.stringify(await measure(count,true)));
}
