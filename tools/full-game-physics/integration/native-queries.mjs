import {build} from 'esbuild';import assert from 'node:assert/strict';
await build({stdin:{contents:"export {Simulation,loadPhysics} from './src/physics.ts';export {sample} from './src/catalog.ts';",resolveDir:process.cwd()},bundle:true,platform:'node',format:'esm',external:['jolt-physics'],outfile:'artifacts/native-queries.mjs'});
const {Simulation,loadPhysics,sample}=await import('../artifacts/native-queries.mjs');const J=await loadPhysics();assert.ok(J.LoadBearingQueries);assert.ok(J.FixedConstraint);
for(let cycle=0;cycle<3;cycle++){
 const sim=new Simulation(J,sample('wind'),'sandbox',1,{sandbox:true,fragmentLimit:500});assert.equal(sim.nativeQueries.enabled,true);
 for(let tick=0;tick<240;tick++){
  if(tick===40)sim.launchProjectile([-16,6,0],[65,0,0],40000,2);sim.step(1/60);if(tick%10)continue;
  const rows=new Float32Array(sim.items.length*14);sim.nativeQueries.writePoses(sim.items,rows);
  for(let index=0;index<sim.items.length;index++){
   const i=sim.items[index],p=i.body.GetPosition(),q=i.body.GetRotation(),v=i.body.GetLinearVelocity(),w=i.body.GetAngularVelocity();
   const ref=new Float32Array([p.GetX(),p.GetY(),p.GetZ(),q.GetX(),q.GetY(),q.GetZ(),q.GetW(),v.GetX(),v.GetY(),v.GetZ(),(i.flying||i.body.IsActive?.())?1:0,w.GetX(),w.GetY(),w.GetZ()]);
   assert.deepEqual(rows.slice(index*14,index*14+14),ref,'Every pose field equals the original getters');
  }
  const lambdas=sim.nativeQueries.lambdas(sim.joints);assert.ok(lambdas);
  for(let index=0;index<sim.joints.length;index++){
   const j=sim.joints[index],l=j.constraint.GetTotalLambdaPosition().Length(),r=j.pinned?null:j.constraint.GetTotalLambdaRotation();
   assert.deepEqual(lambdas.slice(index*4,index*4+4),new Float32Array([l,r?.GetX()??0,r?.GetY()??0,r?.GetZ()??0]));
  }
 }
 sim.dispose();
}
console.log('PASS exact Float32 pose and impulse batches throughout fracture, disposal and recreation');
