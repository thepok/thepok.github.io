import {build} from 'esbuild';
await build({stdin:{contents:"export {Simulation,loadPhysics} from './src/physics';export {generateDemolitionBuilding} from './src/procedural-buildings';",resolveDir:process.cwd()},bundle:true,platform:'node',format:'esm',external:['jolt-physics'],outfile:'artifacts/projectile-flight-benchmark.mjs'});
const {Simulation,loadPhysics,generateDemolitionBuilding}=await import('../artifacts/projectile-flight-benchmark.mjs?'+Date.now()),J=await loadPhysics();
const sim=new Simulation(J,generateDemolitionBuilding(750,90210,'art-deco').pieces,'sandbox',1,{sandbox:true,fragmentLimit:1500});
try{
 await sim.settleStartup();
 const timings={sweep:0,jolt:0,bounds:0},rows=[];
 const wrap=(object,name,key)=>{const original=object[name].bind(object);object[name]=(...args)=>{const start=performance.now();try{return original(...args)}finally{timings[key]+=performance.now()-start}}};
 wrap(sim,'fractureProjectileImpacts','sweep');wrap(sim.world,'Step','jolt');
 for(const item of sim.items){const original=item.body.GetWorldSpaceBounds.bind(item.body);item.body.GetWorldSpaceBounds=()=>{timings.bounds++;return original()};}
 for(const phase of ['baseline','flight']){
  if(phase==='flight')sim.launchProjectile([0,80,-100],[0,0,35],1,1,'storey',false,{parts:320,concreteStrength:1,reinforcement:1});
  for(let i=0;i<20;i++)sim.step(1/60);
  timings.sweep=timings.jolt=timings.bounds=0;const samples=[];
  for(let i=0;i<90;i++){const start=performance.now();sim.step(1/60);samples.push(performance.now()-start)}
  samples.sort((a,b)=>a-b);rows.push({phase,medianMs:+samples[45].toFixed(2),p95Ms:+samples[85].toFixed(2),sweepMs:+(timings.sweep/90).toFixed(2),joltMs:+(timings.jolt/90).toFixed(2),boundsPerStep:Math.round(timings.bounds/90),broken:sim.broken});
 }
 console.log(JSON.stringify(rows,null,2));
}finally{sim.dispose()}
