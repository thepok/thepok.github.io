import { build } from 'esbuild';
await build({stdin:{contents:"export { Simulation, loadPhysics } from './src/physics.ts'; export { sample } from './src/catalog.ts';",resolveDir:process.cwd()},bundle:true,platform:'node',format:'esm',external:['jolt-physics'],outfile:'artifacts/diagnostic.mjs'});
const {Simulation,loadPhysics,sample}=await import('../artifacts/diagnostic.mjs?'+Date.now());const J=await loadPhysics();
for(const scenario of (process.argv.slice(2).length?process.argv.slice(2):['bridge','earthquake','wind','flood','landslide','occupancy'])){
 const sim=new Simulation(J,sample(scenario),scenario,1);let firstBreak=null;
 for(let i=0;i<4000&&!sim.result;i++){sim.step();if(!firstBreak&&sim.broken){firstBreak={time:sim.elapsed,pair:sim.joints.filter(j=>j.broken).map(j=>[j.a.kind,j.b?.kind,j.stress])}}}
 const truck=sim.truck?.body.GetPosition();console.log(JSON.stringify({scenario,result:sim.result,reason:sim.reason,t:sim.elapsed,broken:sim.broken,peak:sim.peakStress,firstBreak,truck:truck?[truck.GetX(),truck.GetY(),truck.GetZ()]:null,payload:sim.occupancy?.tonnes}));sim.dispose();
}
