import {assertVehicleParts,vehiclePower,VEHICLE_PARTS,VEHICLE_SPAWN,type VehiclePart} from './vehicle-blueprint';
import {cannonLaunch,CANNON_BALLISTICS} from './cannon-ballistics';
import type {V3} from './catalog';
export class VehiclePhysics{
 controls={throttle:0,steer:0,brake:false,fire:false,yaw:0,pitch:.08};chassis:any;chassisItem:any;fireCooldown=0;
 private ownedItems:any[]=[];
 private driveSpeed=24;private ramCooldown=0;private impactVelocity:V3=[0,0,0];private ramMass=0;private ramStrength=1;
 private wheels:{body:any;motor:any;side:number}[]=[];private constraints:any[]=[];
 constructor(public sim:any,public parts:VehiclePart[],origin:V3=VEHICLE_SPAWN,baseId?:number,rotation=0,public vehicleId?:number){
  assertVehicleParts(parts);const power=vehiclePower(parts);this.driveSpeed=power.wheelSpeed;this.ramMass=parts.reduce((sum,p)=>sum+VEHICLE_PARTS[p.kind].mass,0);this.ramStrength=1.5+Math.min(2,parts.filter(p=>p.kind==='armor').length*.5);const J=sim.J,compound=new J.StaticCompoundShapeSettings();
  for(const part of parts.filter(p=>p.kind!=='wheel')){const def=VEHICLE_PARTS[part.kind],half=new J.Vec3(...def.size.map(n=>n/2)),shape=new J.BoxShapeSettings(half,.02),pos=new J.Vec3(...part.p),q=new J.Quat(0,0,0,1);compound.AddShape(pos,q,shape);J.destroy(half);J.destroy(pos);J.destroy(q);}
  const result=compound.Create(),shape=result.Get(),axis=new J.Vec3(0,1,0),q=J.Quat.prototype.sRotation(axis,rotation);J.destroy(axis);this.chassis=sim.makeBody(shape,origin,q,parts.filter(p=>p.kind!=='wheel').reduce((n,p)=>n+VEHICLE_PARTS[p.kind].mass,0));J.destroy(q);J.destroy(result);J.destroy(compound);
  const ids:number[]=[];for(let i=0;i<parts.length;i++)ids.push(baseId===undefined?sim.allocateItemId():baseId-i);
  this.chassisItem={id:ids[0],kind:'vehicle-chassis',body:this.chassis,initial:origin,stress:0,vehicleParts:parts,vehicleId};sim.items.push(this.chassisItem);this.ownedItems.push(this.chassisItem);
  for(const part of parts.filter(p=>p.kind==='wheel')){
   const c=Math.cos(rotation),sn=Math.sin(rotation),offset:[number,number,number]=[c*part.p[0]+sn*part.p[2],part.p[1],-sn*part.p[0]+c*part.p[2]],pos=origin.map((v,i)=>v+offset[i]) as V3,shape=new J.CylinderShape(.18,.55,.02);shape.AddRef();const half=rotation*.5,roll=Math.SQRT1_2,q=new J.Quat(Math.sin(half)*roll,Math.sin(half)*roll,Math.cos(half)*roll,Math.cos(half)*roll),body=sim.makeBody(shape,pos,q,VEHICLE_PARTS.wheel.mass);shape.Release();J.destroy(q);body.SetFriction(1.0);
   sim.filter.DisableCollision(this.chassis.GetCollisionGroup().GetSubGroupID(),body.GetCollisionGroup().GetSubGroupID());
   const s=new J.HingeConstraintSettings();s.mPoint1.Set(...pos);s.mPoint2.Set(...pos);s.mHingeAxis1.Set(c,0,-sn);s.mHingeAxis2.Set(c,0,-sn);s.mNormalAxis1.Set(0,1,0);s.mNormalAxis2.Set(0,1,0);s.mMotorSettings.mMinTorqueLimit=-power.torque;s.mMotorSettings.mMaxTorqueLimit=power.torque;
   const motor=J.castObject(s.Create(this.chassis,body),J.HingeConstraint);sim.system.AddConstraint(motor);J.destroy(s);this.constraints.push(motor);this.wheels.push({body,motor,side:Math.sign(part.p[0])});const item={id:ids[this.wheels.length],kind:'vehicle-wheel',body,initial:pos,stress:0,vehiclePart:part,vehicleId};sim.items.push(item);this.ownedItems.push(item);
  }
 }
 step(dt:number){this.ramCooldown=Math.max(0,this.ramCooldown-dt);const velocity=this.chassis.GetLinearVelocity();this.impactVelocity=[velocity.GetX(),velocity.GetY(),velocity.GetZ()];const J=this.sim.J,c=this.controls,throttle=Math.max(-1,Math.min(1,c.throttle)),steer=Math.max(-1,Math.min(1,c.steer));
  for(const wheel of this.wheels){if(throttle||steer||c.brake)this.sim.bodies.ActivateBody(wheel.body.GetID());wheel.motor.SetMotorState(throttle||steer||c.brake?J.EMotorState_Velocity:J.EMotorState_Off);wheel.motor.SetTargetAngularVelocity(c.brake?0:-(throttle*this.driveSpeed+steer*wheel.side*14));}
  if(steer&&this.wheels.some(w=>this.sim.system.WereBodiesInContact(w.body.GetID(),this.sim.ground.GetID()))){this.sim.bodies.ActivateBody(this.chassis.GetID());const torque=new J.Vec3(0,steer*23000,0);this.chassis.AddTorque(torque);J.destroy(torque);}
  this.fireCooldown=Math.max(0,this.fireCooldown-dt);if(c.fire&&this.fireCooldown===0)this.fire();
 }
 // Real chassis contacts can fracture material, not just loosen its joints.
 afterStep(){
  if(this.ramCooldown>0||Math.hypot(...this.impactVelocity)<3)return;
  const p=this.chassis.GetCenterOfMassPosition(),position:V3=[p.GetX(),p.GetY(),p.GetZ()];let hits=0;
  for(const target of this.sim.items){
   if(target.fractured||target.retired||(target.id<=0&&!target.structural)||!['column','wall','slab','deck','facade','girder','doorway','stairwell','stair','core'].includes(target.sourceKind??target.kind))continue;
   if(!this.sim.system.WereBodiesInContact(this.chassis.GetID(),target.body.GetID())&&!this.wheels.some(w=>this.sim.system.WereBodiesInContact(w.body.GetID(),target.body.GetID())))continue;
   const relative=this.impactVelocity; // Use incoming motion, before the solver transfers it to the wall.
   const bounds=target.body.GetWorldSpaceBounds(),lo=bounds.mMin,min=[lo.GetX(),lo.GetY(),lo.GetZ()],hi=bounds.mMax,max=[hi.GetX(),hi.GetY(),hi.GetZ()];
   const point=position.map((n,i)=>Math.max(min[i],Math.min(max[i],n))) as V3;
   const normal=point.map((n,i)=>n-position[i]),distance=Math.hypot(...normal);
   const closing=distance>.01?Math.max(0,relative.reduce((sum,n,i)=>sum+n*normal[i]/distance,0)):Math.hypot(...relative);
   if(closing<2.5||.5*this.ramMass*closing*closing*this.ramStrength<25000)continue;
   this.sim.impactFracture(target,point,.5*this.ramMass*closing*closing*this.ramStrength,25000);if(++hits>=2)break;
  }
  if(hits)this.ramCooldown=.18;
 }
 // Gameplay recoil is capped independently of shell momentum to keep the vehicle controllable.
 private fire(){for(const cannon of this.parts.filter(p=>p.kind==='cannon')){
  const rotation=this.chassis.GetRotation(),q=[rotation.GetX(),rotation.GetY(),rotation.GetZ(),rotation.GetW()],p=this.chassis.GetPosition(),v=this.chassis.GetLinearVelocity();
  const {muzzle,velocity,direction}=cannonLaunch(cannon.p,[p.GetX(),p.GetY(),p.GetZ()],q,[v.GetX(),v.GetY(),v.GetZ()],this.controls.yaw,this.controls.pitch);
  const shot=this.sim.launchProjectile(muzzle,velocity,CANNON_BALLISTICS.mass,CANNON_BALLISTICS.radius);if(shot){shot.body.GetMotionProperties().SetLinearDamping(CANNON_BALLISTICS.linearDamping);const J=this.sim.J,impulse=new J.Vec3(...direction.map(n=>-n*2000));this.sim.bodies.ActivateBody(this.chassis.GetID());this.chassis.AddImpulse(impulse);J.destroy(impulse);}this.fireCooldown=1.1;}
 }

 dispose(){for(const c of this.constraints)this.sim.system.RemoveConstraint(c);this.constraints=[];for(const item of this.ownedItems)if(!item.fractured&&!item.retired){this.sim.removeVehicleBody?.(item);item.retired=true;item.fractured=true;}this.ownedItems=[];this.wheels=[];}
}
