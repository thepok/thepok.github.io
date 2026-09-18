import assert from 'node:assert/strict';
import {build} from 'esbuild';
const source=`import {Simulation} from './src/physics';
export function run(J,threads=0){
 const sim=new Simulation(J,[],'sandbox',1,{sandbox:true,fragmentLimit:1000},threads);
 sim.attachTrees([{x:100,y:0,z:100,height:4},{x:110,y:0,z:100,height:5}]);
 try{
 for(let n=0;n<220;n++){
  const shot=sim.launchProjectile([n%4*10,40,0],[0,0,0],1,1,'storey',true,{parts:16,concreteStrength:1,reinforcement:0});
  if(!shot)throw Error('Unexpected shot refusal');
  for(const part of sim.items.filter(p=>p.blockShot===shot.blockShot))sim.fracture(part);
  if(n%5===0)sim.step();
  for(const item of sim.items){const p=item.body.GetPosition();if(!Number.isFinite(p.GetX()))throw Error('Invalid snapshot position');}
  if(new Set(sim.items.map(item=>item.id)).size!==sim.items.length)throw Error('Duplicate render IDs after destruction cycle '+n);
  if(sim.bodyList.length>1200)throw Error('Historic bodies grow without bound: '+sim.bodyList.length);
 }
 return {cycles:220,slots:sim.bodyList.length,items:sim.items.length,fragments:sim.fragments,threads};
 }finally{sim.dispose()}
}`;
await build({stdin:{contents:source,resolveDir:process.cwd()},bundle:true,platform:'neutral',format:'esm',plugins:[{name:'omit-unused-jolt-loader',setup(b){b.onResolve({filter:/^jolt-physics$/},()=>({path:'jolt-physics',external:true,sideEffects:false}));}}],outfile:'artifacts/physics-capacity-module.mjs'});
if(!process.argv.includes('--browser-module')){const {run}=await import('../artifacts/physics-capacity-module.mjs?'+Date.now());const init=(await import('jolt-physics')).default;console.log('PASS repeated destruction without historic body growth',run(await init()));}
