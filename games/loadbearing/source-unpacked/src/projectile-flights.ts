import type { DynamicItem, Simulation } from './physics';
import type { V3 } from './catalog';
import { rotateByQuaternion } from './fracture';

type Flight = {body:any; parts:DynamicItem[]; offsets:V3[]; joints:{constraint:any;broken:boolean}[]};
const xyz=(v:any):V3=>[v.GetX(),v.GetY(),v.GetZ()];

/** Intact projectiles need only one rigid body until their first encounter. */
export class ProjectileFlights {
 private flights=new Map<number,Flight>();
 constructor(private sim:Simulation){}
 has(root:number){return this.flights.has(root);}
 start(root:number,parts:DynamicItem[],position:V3,reuse?:any){
  const {J,bodies}=this.sim,settings=new J.StaticCompoundShapeSettings(),q=new J.Quat(0,0,0,1);
  const offsets=parts.map(p=>p.initial.map((v,a)=>v-position[a]) as V3);
  for(let i=0;i<parts.length;i++){
   const part=parts[i],size=part.size!,half=new J.Vec3(...size.map(v=>v/2)),shape=new J.BoxShapeSettings(half,Math.min(.02,Math.min(...size)*.05)),offset=new J.Vec3(...offsets[i]);
   shape.mDensity=part.sourceMass!/(size[0]*size[1]*size[2]);settings.AddShape(offset,q,shape,i);J.destroy(half);J.destroy(offset);
  }
  const result=settings.Create();if(!result.IsValid())throw new Error('Invalid projectile compound');const shape=result.Get();shape.AddRef();J.destroy(result);J.destroy(settings);
  const mass=parts.reduce((sum,p)=>sum+p.sourceMass!,0);let body=reuse;
  if(body){bodies.SetShape(body.GetID(),shape,true,J.EActivation_DontActivate);body.GetMotionProperties().ScaleToMass(mass);const p=new J.RVec3(...position);bodies.SetPositionAndRotation(body.GetID(),p,q,J.EActivation_DontActivate);J.destroy(p);bodies.AddBody(body.GetID(),J.EActivation_Activate);this.sim.removedBodies.delete(body);}
  else body=this.sim.makeBody(shape,position,q,mass,false,true);
  body.GetMotionProperties().ResetForce();body.GetMotionProperties().ResetTorque();body.SetLinearVelocity(parts[0].body.GetLinearVelocity());const zero=new J.Vec3(0,0,0);body.SetAngularVelocity(zero);J.destroy(zero);J.destroy(q);shape.Release();
  const joints=this.sim.joints.filter(j=>j.a.blockShot===root&&j.b?.blockShot===root);
  for(const joint of joints)joint.constraint.SetEnabled(false);
  for(const part of parts){bodies.RemoveBody(part.body.GetID());this.sim.removedBodies.add(part.body);part.flying=true;}
  this.flights.set(root,{body,parts,offsets,joints});return body;
 }
 private sync(flight:Flight){
  const {J,bodies}=this.sim,body=flight.body,p=xyz(body.GetPosition()),q=body.GetRotation(),rotation=[q.GetX(),q.GetY(),q.GetZ(),q.GetW()],com=xyz(body.GetCenterOfMassPosition()),v=xyz(body.GetLinearVelocity()),w=xyz(body.GetAngularVelocity());
  const position=new J.RVec3(0,0,0),velocity=new J.Vec3(0,0,0);
  flight.parts.forEach((part,i)=>{
   const offset=rotateByQuaternion(flight.offsets[i],rotation),point=p.map((n,a)=>n+offset[a]) as V3,r=point.map((n,a)=>n-com[a]);
   position.Set(...point);bodies.SetPositionAndRotation(part.body.GetID(),position,q,J.EActivation_DontActivate);
   velocity.Set(v[0]+w[1]*r[2]-w[2]*r[1],v[1]+w[2]*r[0]-w[0]*r[2],v[2]+w[0]*r[1]-w[1]*r[0]);part.body.SetLinearVelocity(velocity);part.body.SetAngularVelocity(body.GetAngularVelocity());
  });J.destroy(position);J.destroy(velocity);
 }
 syncAll(){for(const flight of this.flights.values())this.sync(flight);}
 release(root:number|undefined){
  if(root===undefined)return;const flight=this.flights.get(root);if(!flight)return;
  this.sync(flight);const {J,bodies}=this.sim;
  bodies.RemoveBody(flight.body.GetID());this.sim.removedBodies.add(flight.body);this.sim.retireProjectileCompound(flight.body);this.flights.delete(root);
  for(const part of flight.parts){part.flying=false;bodies.AddBody(part.body.GetID(),J.EActivation_Activate);this.sim.removedBodies.delete(part.body);}
  for(const joint of flight.joints)if(!joint.broken)joint.constraint.SetEnabled(true);
 }
 retire(root:number){
  const flight=this.flights.get(root);if(!flight)return;
  this.sim.bodies.RemoveBody(flight.body.GetID());this.sim.removedBodies.add(flight.body);this.sim.retireProjectileCompound(flight.body);for(const part of flight.parts)part.flying=false;this.flights.delete(root);
 }
 /** Conservative swept bounds include motion of both bodies and rotational travel.
  * Expand before stepping so normal per-part CCD and damage handle the impact. */
 beforeStep(dt:number){
  if(!this.flights.size)return;
  const horizon=dt*2,rows:{body:any;min:V3;max:V3}[]=[];
  for(const body of this.sim.bodyList){
   if(this.sim.removedBodies.has(body))continue;
   const bounds=body.GetWorldSpaceBounds(),min=xyz(bounds.mMin),max=xyz(bounds.mMax),v=xyz(body.GetLinearVelocity()),w=xyz(body.GetAngularVelocity());
   const radius=Math.hypot(...max.map((n,a)=>(n-min[a])/2)),pad=.15+Math.min(2*radius,Math.hypot(...w)*radius*horizon)+10*horizon*horizon;
   rows.push({body,min:min.map((n,a)=>n+Math.min(0,v[a]*horizon)-pad) as V3,max:max.map((n,a)=>n+Math.max(0,v[a]*horizon)+pad) as V3});
  }
  const release:number[]=[];
  for(const [root,flight] of this.flights){const own=rows.find(r=>r.body===flight.body);if(own&&rows.some(r=>r.body!==flight.body&&r.min.every((n,a)=>n<=own.max[a]&&r.max[a]>=own.min[a])))release.push(root);}
  for(const root of release)this.release(root);
 }
}
