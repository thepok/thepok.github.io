import assert from 'node:assert/strict';
import {build} from 'esbuild';
await build({stdin:{contents:"export {Simulation,loadPhysics} from './src/physics';export {rotateByQuaternion} from './src/fracture';",resolveDir:process.cwd()},bundle:true,platform:'node',format:'esm',external:['jolt-physics'],outfile:'artifacts/projectile-flight-regression.mjs'});
const {Simulation,loadPhysics,rotateByQuaternion}=await import('../artifacts/projectile-flight-regression.mjs'),J=await loadPhysics();
const vec=v=>[v.GetX(),v.GetY(),v.GetZ()],near=(a,b,message)=>assert.ok(a.every((v,i)=>Math.abs(v-b[i])<.0002),message+': '+a+' / '+b);
const fresh=pieces=>new Simulation(J,pieces??[],'sandbox',1,{sandbox:true,fragmentLimit:1500});
const sim=fresh();
try{
 const shot=sim.launchProjectile([5,100,8],[3,2,20],1,1,'storey',false,{parts:64,concreteStrength:1,reinforcement:1});
 const flight=sim.projectileFlights.flights.get(shot.blockShot),parts=flight.parts;
 assert.equal(parts.length,64);assert.ok(parts.every(p=>p.flying&&sim.removedBodies.has(p.body)));
 const pos=new J.RVec3(10,100,20),q=new J.Quat(0,Math.sin(.41),0,Math.cos(.41)),w=new J.Vec3(.2,.7,-.1);
 sim.bodies.SetPositionAndRotation(flight.body.GetID(),pos,q,J.EActivation_Activate);flight.body.SetAngularVelocity(w);J.destroy(pos);J.destroy(q);J.destroy(w);
 sim.projectileFlights.syncAll();
 const com=vec(flight.body.GetCenterOfMassPosition()),mass=parts.reduce((s,p)=>s+p.sourceMass,0),weighted=[0,0,0];
 for(const part of parts){const p=vec(part.body.GetPosition());for(let i=0;i<3;i++)weighted[i]+=p[i]*part.sourceMass/mass;}
 near(weighted,com,'Physical centre of mass includes differing glass/concrete density');
 const poses=parts.map(p=>({p:vec(p.body.GetPosition()),v:vec(p.body.GetLinearVelocity()),w:vec(p.body.GetAngularVelocity()),q:[p.body.GetRotation().GetX(),p.body.GetRotation().GetY(),p.body.GetRotation().GetZ(),p.body.GetRotation().GetW()]}));
 const velocity=vec(flight.body.GetLinearVelocity()),omega=vec(flight.body.GetAngularVelocity());
 for(let i=0;i<parts.length;i++){const r=poses[i].p.map((n,a)=>n-com[a]);near(poses[i].v,[velocity[0]+omega[1]*r[2]-omega[2]*r[1],velocity[1]+omega[2]*r[0]-omega[0]*r[2],velocity[2]+omega[0]*r[1]-omega[1]*r[0]],'Rigid rotational velocity');}
 sim.projectileFlights.release(shot.blockShot);
 assert.ok(sim.removedBodies.has(flight.body));assert.ok(parts.every(p=>!p.flying&&!sim.removedBodies.has(p.body)));
 for(let i=0;i<parts.length;i++){near(vec(parts[i].body.GetPosition()),poses[i].p,'Position continuity');near(vec(parts[i].body.GetLinearVelocity()),poses[i].v,'Velocity continuity');near(vec(parts[i].body.GetAngularVelocity()),poses[i].w,'Spin continuity');}
 for(let i=0;i<15;i++)sim.step();assert.equal(sim.broken,0,'No artificial breakage from expansion');
 console.log('PASS one compound, mass/COM, rotation, momentum and continuous expansion');
}finally{sim.dispose()}
for(const obstacle of ['ground','wall','incoming-ball','other-storey']){
 const s=fresh(obstacle==='wall'?[{id:1,kind:'wall',p:[0,0,0],rotation:0}]:[]);
 try{
 const ground=obstacle==='ground',wall=obstacle==='wall';const shot=s.launchProjectile(ground?[0,5,0]:wall?[0,2,-20]:[0,100,0],ground?[0,-160,0]:wall?[0,0,160]:[0,0,0],1,1,'storey');
 if(obstacle==='incoming-ball')s.launchProjectile([0,100,-20],[0,0,1000],5000,.5);
 if(obstacle==='other-storey')s.launchProjectile([0,100,-20],[0,0,1000],1,1,'storey');
 let released=false;
 for(let i=0;i<30;i++){s.step(1/120);if(!s.projectileFlights.has(shot.blockShot))released=true;}
 assert.ok(released,obstacle+' triggers expansion');
 if(wall)assert.ok(s.items.find(p=>p.id===1).fractured||s.broken>0,'Wall collision causes damage');
 if(ground)assert.ok(s.items.some(p=>p.rootPieceId===shot.blockShot&&p.fractured),'Ground impact breaks shot');
 console.log('PASS swept pre-contact release:',obstacle);
 }finally{s.dispose()}
}
const recycling=fresh();try{let size;
for(let i=0;i<16;i++){recycling.launchProjectile([i*30,100,0],[0,0,1],1,1,i>=4&&i%3===0?'blocks':'storey',true,{parts:64,concreteStrength:1,reinforcement:1});if(i===3)size=recycling.bodyList.length;assert.ok(i<4||recycling.bodyList.length===size,'Recycle compound bodies as well as children');}
assert.ok(recycling.projectileFlights.flights.size<=4);recycling.step();console.log('PASS recycling and disposal while shots are in flight');
}finally{recycling.dispose()}
