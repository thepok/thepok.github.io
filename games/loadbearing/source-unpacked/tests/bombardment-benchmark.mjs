import { performance } from 'node:perf_hooks';
import assert from 'node:assert/strict';
import { mkdir } from 'node:fs/promises';
import { build } from 'esbuild';

await mkdir('artifacts',{recursive:true});
await build({
  stdin:{contents:"export { Simulation,loadPhysics } from './src/physics.ts';export { generateDemolitionBuilding } from './src/procedural-buildings.ts';",resolveDir:process.cwd()},
  bundle:true,platform:'node',format:'esm',external:['jolt-physics'],outfile:'artifacts/bombardment-benchmark.mjs'
});
const {Simulation,loadPhysics,generateDemolitionBuilding}=await import('../artifacts/bombardment-benchmark.mjs?'+Date.now());
const J=await loadPhysics();
const count=Number(process.env.BENCH_PARTS||1000),seed=Number(process.env.BENCH_SEED||0x51a7),style=process.env.BENCH_STYLE||'brutalist';
const solverMode=process.env.BENCH_SOLVER||'current';
const pieces=generateDemolitionBuilding(count,seed,style).pieces;
const pct=(a,p)=>[...a].sort((x,y)=>x-y)[Math.floor((a.length-1)*p)];
const bounds={
 minX:Math.min(...pieces.map(p=>p.p[0])),maxX:Math.max(...pieces.map(p=>p.p[0])),
 minZ:Math.min(...pieces.map(p=>p.p[2])),maxZ:Math.max(...pieces.map(p=>p.p[2])),
 maxY:Math.max(...pieces.map(p=>p.p[1]))
};
const sim=new Simulation(J,structuredClone(pieces),'sandbox',1,{sandbox:true,fragmentLimit:300},0);
const physicsSettings=sim.system.GetPhysicsSettings();
if(solverMode==='legacy'){physicsSettings.mNumVelocitySteps=12;physicsSettings.mNumPositionSteps=3;sim.system.SetPhysicsSettings(physicsSettings);}
else if(solverMode==='aggressive'){physicsSettings.mNumVelocitySteps=8;physicsSettings.mNumPositionSteps=2;sim.system.SetPhysicsSettings(physicsSettings);}
else assert.equal(solverMode,'current','BENCH_SOLVER must be current, legacy or aggressive');
const velocitySteps=physicsSettings.mNumVelocitySteps,positionSteps=physicsSettings.mNumPositionSteps;
await sim.settleStartup();
for(let i=0;i<90;i++)sim.step(1/60);

const shots=[
 [[bounds.minX-22,Math.max(6,bounds.maxY*.28),0],[52,0,0],11000,1.5],
 [[bounds.maxX+22,Math.max(8,bounds.maxY*.48),-3],[-56,0,3],13000,1.7],
 [[0,Math.max(10,bounds.maxY*.68),bounds.minZ-22],[2,-1,54],15000,1.8],
 [[-5,bounds.maxY+18,bounds.maxZ*.25],[3,-58,-2],18000,1.9],
 [[bounds.minX-24,Math.max(7,bounds.maxY*.38),bounds.maxZ*.45],[60,1,-7],16000,1.8],
];
let worldMs=0;const worldStep=sim.world.Step.bind(sim.world);sim.world.Step=(...args)=>{const at=performance.now(),result=worldStep(...args);worldMs+=performance.now()-at;return result;};
const samples=[],timeline=[];
for(let frame=0;frame<480;frame++){
  const shotIndex=[20,105,190,275,360].indexOf(frame);
  if(shotIndex>=0){const [p,v,m,r]=shots[shotIndex];sim.launchProjectile(p,v,m,r);}
  const at=performance.now();sim.step(1/60);samples.push(performance.now()-at);
  if(frame%60===59)timeline.push({second:(frame+1)/60,broken:sim.broken,fragments:sim.fragments,bodies:sim.bodyList.length,peakStress:+sim.peakStress.toFixed(3)});
}
const mean=samples.reduce((a,b)=>a+b,0)/samples.length,status=sim.buildingStatus();
const structural=sim.items.filter(i=>i.id>0);
const fractured=structural.filter(i=>i.fractured).length;
const moved=structural.filter(i=>{if(i.fractured)return true;const p=i.body.GetPosition();return Math.hypot(p.GetX()-i.initial[0],p.GetY()-i.initial[1],p.GetZ()-i.initial[2])>1.5}).length;
const result={
 pieces:count,style,seed,shots:shots.length,simulatedSeconds:8,solverMode,solver:{velocitySteps,positionSteps},
 meanStepMs:+mean.toFixed(3),medianStepMs:+pct(samples,.5).toFixed(3),p95StepMs:+pct(samples,.95).toFixed(3),maxStepMs:+Math.max(...samples).toFixed(3),
 worldMeanStepMs:+(worldMs/samples.length).toFixed(3),wrapperMeanStepMs:+(mean-worldMs/samples.length).toFixed(3),realtimeFactor:+((1000/60)/mean).toFixed(3),
 broken:sim.broken,fragments:sim.fragments,fractured,moved,bodies:sim.bodyList.length,joints:sim.joints.length,rebars:sim.rebars.length,
 buildingPassed:status.passed,completedFloors:status.completedFloors,peakStress:+sim.peakStress.toFixed(3),timeline
};
assert.equal(pieces.length,count);
assert.ok(sim.broken>0,'bombardment must damage the structure');
assert.ok(sim.fragments>0,'bombardment must create physical debris');
assert.ok(Number.isFinite(result.meanStepMs)&&result.meanStepMs>0);
console.log('BOMBARDMENT '+JSON.stringify(result));
sim.dispose();
