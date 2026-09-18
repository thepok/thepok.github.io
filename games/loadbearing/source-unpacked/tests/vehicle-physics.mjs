import {build} from 'esbuild';import assert from 'node:assert/strict';
await build({stdin:{contents:"export {Simulation,loadPhysics} from './src/physics.ts';export {VEHICLE_PRESETS,validateVehicle} from './src/vehicle-blueprint.ts';",resolveDir:process.cwd()},bundle:true,platform:'node',format:'esm',external:['jolt-physics'],outfile:'artifacts/vehicle-test.mjs'});
const {Simulation,loadPhysics,VEHICLE_PRESETS,validateVehicle}=await import('../artifacts/vehicle-test.mjs?'+Date.now());const J=await loadPhysics();
for(const preset of VEHICLE_PRESETS){assert.equal(validateVehicle(preset.parts),'');const sim=new Simulation(J,[],'sandbox',1,{sandbox:true,vehicleParts:preset.parts});try{const v=sim.vehicle;for(let i=0;i<120;i++)sim.step();const p=v.chassis.GetPosition(),start=[p.GetX(),p.GetY(),p.GetZ()];v.controls.throttle=1;for(let i=0;i<240;i++)sim.step();const now=v.chassis.GetPosition(),position=[now.GetX(),now.GetY(),now.GetZ()];console.log(preset.id,start,position);assert.ok(position[2]<start[2]-2,'W should drive forward -Z');assert.ok(Math.abs(position[1])<3,'vehicle stays grounded');v.controls.throttle=0;v.controls.brake=true;for(let i=0;i<480;i++)sim.step();const velocity=v.chassis.GetLinearVelocity();console.log('brake',velocity.GetX(),velocity.GetZ());assert.ok(Math.hypot(velocity.GetX(),velocity.GetZ())<2,'brakes stop vehicle');v.controls.brake=false;v.controls.steer=1;for(let i=0;i<120;i++)sim.step();const q=v.chassis.GetRotation();assert.ok(Math.abs(q.GetY())>.05,'steering changes heading');v.controls.fire=true;sim.step();assert.equal(sim.projectiles,preset.parts.some(p=>p.kind==='cannon')?1:0);}finally{sim.dispose()}}
console.log('PASS all presets: gravity, physical drive, braking, steering, cannon and disposal');



const target=new Simulation(J,[{id:1,kind:'foundation',p:[-2,0,0],rotation:0},{id:2,kind:'wall',p:[-2,0,0],rotation:0}],'sandbox',1,{sandbox:true,vehicleParts:VEHICLE_PRESETS[2].parts});try{for(let i=0;i<120;i++)target.step();target.vehicle.controls.fire=true;target.vehicle.controls.brake=true;for(let i=0;i<700;i++)target.step();assert.ok(target.broken>0&&target.fragments>0,'mounted cannon must physically break the concrete target');console.log('PASS cannon breaks concrete wall',target.broken,target.fragments);}finally{target.dispose()}

const world=new Simulation(J,[],'sandbox',1,{sandbox:true});try{const box=world.dynamicBox([-90000,'test'],[120,3,120],[1,1,1],800);for(let i=0;i<240;i++)world.step();assert.ok(Math.abs(box.body.GetPosition().GetY()-.5)<.1,'terrain must support vehicles far beyond old 40m edge');const rim=world.dynamicBox([-90001,'test'],[0,1,495],[1,1,1],800),v=new J.Vec3(0,0,25);rim.body.SetLinearVelocity(v);J.destroy(v);for(let i=0;i<120;i++)world.step();assert.ok(rim.body.GetPosition().GetZ()<498,'physical outer rim stops a vehicle from falling out');console.log('PASS expanded world support and physical perimeter');}finally{world.dispose()}

const cannon=new Simulation(J,[{id:1,kind:'foundation',p:[-2,0,0],rotation:0},{id:2,kind:'wall',p:[-2,0,0],rotation:0}],'sandbox',1,{sandbox:true,vehicleParts:VEHICLE_PRESETS[2].parts});try{for(let i=0;i<120;i++)cannon.step();const startZ=cannon.vehicle.chassis.GetPosition().GetZ();cannon.vehicle.controls.fire=true;cannon.step();cannon.vehicle.controls.fire=false;const recoilSpeed=cannon.vehicle.chassis.GetLinearVelocity().Length();assert.ok(recoilSpeed<1.2,'one shot must not launch the car backwards');for(let i=0;i<120;i++)cannon.step();assert.equal(cannon.projectiles,1);assert.ok(cannon.items.find(i=>i.id===2).fractured,'a single cannon shell should break the concrete wall');const drift=cannon.vehicle.chassis.GetPosition().GetZ()-startZ;assert.ok(Math.abs(drift)<1.5,'recoil should remain manageable without brakes');console.log('PASS stronger single shot and low recoil',{recoilSpeed,drift,fragments:cannon.fragments});}finally{cannon.dispose()}


const recycling=new Simulation(J,[],'sandbox',1,{sandbox:true});try{
 const initialBodies=recycling.bodyList.length;
 for(let i=0;i<180;i++){
  const mass=i%2?900:12000,radius=i%2?.3:1.5;
  const shot=recycling.launchProjectile([0,10,20],[0,-1,-10],mass,radius);
  assert.ok(shot,'every shot must launch beyond the former limit');
  assert.ok(Math.abs(1/shot.body.GetMotionProperties().GetInverseMass()-mass)<.01,'recycled mass updated');
  assert.ok(Math.abs(J.castObject(shot.body.GetShape(),J.SphereShape).GetRadius()-radius)<1e-6,'recycled collision radius updated');
  recycling.step();
 }
 assert.equal(recycling.projectiles,180);assert.equal(recycling.items.filter(i=>i.kind==='projectile').length,60);
 assert.equal(recycling.bodyList.length,initialBodies+60,'old shots must reuse bodies without leaking');
 console.log('PASS 180 shots with 60 reusable bodies and changing mass/radius');
}finally{recycling.dispose()}
