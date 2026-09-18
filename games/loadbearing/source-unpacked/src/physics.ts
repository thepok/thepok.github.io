import { addWorldPieces } from './structural-edit';
import { ProjectileFlights } from './projectile-flights';
import { storeyProjectileLayout } from './storey-projectile';
import { blockProjectileLayout, normalizeBuildingProjectile, type BuildingProjectileOptions } from './block-projectile';
import { meteorFlight, meteorRandom, METEOR_MASS_FACTOR } from './meteor-flight';
import { AttackVehicle } from './attack-vehicle';
import initJolt from 'jolt-physics';
import { VehiclePhysics } from './vehicle-physics';
import type { VehiclePart } from './vehicle-blueprint';
import { PARTS, ports, SCENARIOS, type Piece, type Scenario, type V3 } from './catalog';
import { evaluateBuilding } from './building-objective';
import { rotateByQuaternion } from './fracture';
import { localFractureShapes } from './local-fracture';
import { PhysicalTrees, type TreeSpec } from './physical-trees';
import { OccupancyLoad } from './occupancy';
import { isConcrete, materialProperties } from './concrete-materials';
import { WorldVehicles, type WorldVehicleSpec, type WorldVehicleMode, type WorldVehicleState } from './world-vehicles';

// Keep the WASM boundary in one module; Jolt objects must be explicitly released.
let modulePromise: ReturnType<typeof initJolt> | undefined;
export const loadPhysics = () => modulePromise ??= initJolt();
export const HOUSE_DISPLACEMENT_LIMIT = .5;
const REINFORCED_KINDS=new Set(['foundation','column','slab','wall','deck','doorway','stairwell','stair','core']);
// Break points are in the surviving body's local space, matching Joint.localA/localB.
export interface BreakRemnant { point:V3; sourceKind:string; sourceFinish?:Piece['finish']; concreteStrength?:number; seed:number }
export interface ConcreteValues { concreteStrength:number; reinforcement:number }
export interface DynamicItem { body:any; id:number; kind:string; initial:V3; stress:number; vehicleId?:number; vehiclePart?:VehiclePart; concreteStrength?:number; reinforcement?:number; radius?:number; blockShot?:number; protectedProjectile?:boolean; flying?:boolean; impactMass?:number; fractured?:boolean; retired?:boolean; size?:V3; vertices?:V3[]; finish?:Piece['finish']; sourceKind?:string; rootPieceId?:number; structural?:boolean; sourceMass?:number; fractureDepth?:number; bornAt?:number; remnants?:BreakRemnant[]; rebarTo?:number; rebarLinks?:{id:number;to:number;localA:V3;localB:V3}[] }
export interface SimulationRules {
 vehicleParts?:VehiclePart[];
 vehicleMass?: number;
 duration?: number;
 minHeight?: number;
 minFloorArea?: number;
 rockCount?: number;
 rockInterval?: number;
 aftershock?: boolean;
 occupancy?: boolean;
 sandbox?: boolean;
 fragmentLimit?: number;
}
interface Joint { damageStage?:number; constraint:any; a:DynamicItem; b?:DynamicItem; force:number; torque:V3; pinned:boolean; broken:boolean; stress:number; overloadTime:number; localA:V3[]; localB?:V3[]; groupA?:number; groupB?:number }
interface RebarLink { constraint:any; a:DynamicItem; b:DynamicItem; id:number; localA:V3; localB:V3; limit:number; strength:number; broken:boolean; overloadTime:number }
export class Simulation {
 private concreteStrength(item:DynamicItem){return isConcrete(item.sourceKind??item.kind)?(item.concreteStrength??1):1;}
 private reinforcement(item:DynamicItem){return isConcrete(item.sourceKind??item.kind)?(item.reinforcement??1):1;}
 J:any; world:any; system:any; bodies:any; filter:any; items:DynamicItem[]=[]; joints:Joint[]=[]; rebars:RebarLink[]=[]; private nextRebarId=0; bodyList:any[]=[];
 vehicle?:VehiclePhysics;attacker?:AttackVehicle;
 worldVehicles:WorldVehicles;
 get worldVehicleStates():WorldVehicleState[]{return this.worldVehicles.states;}
 driveConstraints:any[]=[];
 trees?:PhysicalTrees;
 attachTrees(specs:TreeSpec[]){if(!this.trees)this.trees=new PhysicalTrees(this,specs);}
 private bodyPool:any[]=[];private pooledBodies=new Set<any>();private disposableCompounds=new Set<any>();private collisionPeers=new Map<number,Set<number>>();
 private collectAfter=0;
 fragments=0; private nextDynamicId=-1_000_000; fragmentLimit:number; removedBodies=new Set<any>();
 jointCounts=new Map<string,number>();attachmentCounts=new Map<number,number>();jointNeighbors=new Map<number,Joint[]>();
 pendingCollisions=new Map<string,{a:any;b:any}>();
 private facadeClearances=new Map<number,Set<DynamicItem>>();
 private glassFrames=new Map<DynamicItem,{support:DynamicItem;panelPoint:V3;supportPoint:V3}[]>();
 private glassStrain=new Map<number,number>();private nextGlassCheck=0;
 projectileHits=new Set<string>();
 private projectilePool:DynamicItem[]=[];
 sandboxHazards={wind:false,earthquake:false,flood:false,meteors:false,attack:false};
 meteors=0; meteorPool:DynamicItem[]=[]; private nextMeteorAt=0;
 private quakeResetSteps=0;
 private hazardStart={wind:0,earthquake:0,flood:0,meteors:0,attack:0};
 hazardAge(kind:'wind'|'earthquake'|'flood'|'meteors'|'attack'){return this.rules.sandbox?this.elapsed-this.hazardStart[kind]:this.elapsed;}
 hazardActive(kind:'wind'|'earthquake'|'flood'|'meteors'|'attack'){return this.rules.sandbox?this.sandboxHazards[kind]:this.scenario===kind;}
 setSandboxHazard(kind:'wind'|'earthquake'|'flood'|'meteors'|'attack',enabled:boolean){
  if(!this.rules.sandbox)return;
  if(enabled&&!this.sandboxHazards[kind])this.hazardStart[kind]=this.elapsed;
  if(kind==='earthquake'&&enabled)this.bodies.SetMotionType(this.ground.GetID(),this.J.EMotionType_Kinematic,this.J.EActivation_Activate);
  this.sandboxHazards[kind]=enabled;
  if(kind==='attack'){if(enabled&&!this.attacker)this.attacker=new AttackVehicle(this);this.attacker?.setEnabled(enabled);}
  if(kind==='meteors'&&enabled)this.nextMeteorAt=this.elapsed+.2;
  if(kind==='earthquake'&&!enabled)this.quakeResetSteps=2;
  for(const item of this.items)if(!item.fractured)this.bodies.ActivateBody(item.body.GetID());
 }

 ground:any; truck?:DynamicItem; house?:DynamicItem; occupancy?:OccupancyLoad; elapsed=0; broken=0; maxStress=0; peakStress=0; duration:number; result:'passed'|'failed'|null=null; reason=''; water=-8; rocks=0; physicsMs=0; projectiles=0; readonly rules:SimulationRules; forceVector:any;
 constructor(J:any, public pieces:Piece[], public scenario:Scenario, public intensity=1, rules:SimulationRules = {}, workerThreads=0) {
  this.J=J; this.rules=rules;this.fragmentLimit=Math.max(24,Math.min(3000,Math.round(rules.fragmentLimit??156)));this.duration=rules.duration ?? SCENARIOS[scenario].duration; this.forceVector=new J.Vec3(0,0,0);
  this.worldVehicles=new WorldVehicles(this);
  const settings=new J.JoltSettings();settings.mMaxWorkerThreads=Math.max(0,Math.min(8,workerThreads));
  const pair=new J.ObjectLayerPairFilterTable(2); pair.EnableCollision(0,1); pair.EnableCollision(1,1);
  const broad=new J.BroadPhaseLayerInterfaceTable(2,2); const b0=new J.BroadPhaseLayer(0),b1=new J.BroadPhaseLayer(1); broad.MapObjectToBroadPhaseLayer(0,b0); broad.MapObjectToBroadPhaseLayer(1,b1);
  settings.mObjectLayerPairFilter=pair; settings.mBroadPhaseLayerInterface=broad;
  settings.mObjectVsBroadPhaseLayerFilter=new J.ObjectVsBroadPhaseLayerFilterTable(broad,2,pair,2);
  this.world=new J.JoltInterface(settings); J.destroy(settings); J.destroy(b0); J.destroy(b1);
  this.system=this.world.GetPhysicsSystem(); this.bodies=this.system.GetBodyInterface();
  const ps=this.system.GetPhysicsSettings(),large=pieces.length>=800,medium=pieces.length>=400;ps.mNumVelocitySteps=large?12:medium?16:48;ps.mNumPositionSteps=large?3:medium?4:12;this.system.SetPhysicsSettings(ps);
  this.filter=new J.GroupFilterTable(8192); this.filter.AddRef();
  const disable=this.filter.DisableCollision.bind(this.filter),enable=this.filter.EnableCollision.bind(this.filter);
  this.filter.DisableCollision=(a:number,b:number)=>{if(a>=8192||b>=8192)throw new Error('Collision group capacity exceeded');disable(a,b);for(const [x,y] of [[a,b],[b,a]]){const peers=this.collisionPeers.get(x)??new Set<number>();peers.add(y);this.collisionPeers.set(x,peers);}};
  this.filter.EnableCollision=(a:number,b:number)=>{enable(a,b);this.collisionPeers.get(a)?.delete(b);this.collisionPeers.get(b)?.delete(a);};
  if(scenario==='bridge') {
   this.ground=this.box([-23,-4,0],[22,8,28],0); this.box([23,-4,0],[22,8,28],0); this.box([0,-10,0],[100,2,100],0);
  } else {
   this.ground=this.box([0,-1,0],[1000,2,1000],0,scenario==='earthquake');
   if(rules.sandbox)for(const side of [-1,1]){this.box([0,1,side*498],[1000,4,3],0);this.box([side*498,1,0],[3,4,1000],0);}
   if(scenario==='landslide') { this.box([0,5,-19],[30,.8,24],0,false,.51); this.house=this.dynamicBox([-900,'house'],[0,1.6,5],[3.2,3.2,3.2],18000); }
  }
  addWorldPieces(this,pieces,true);
  if(rules.vehicleParts?.length&&rules.sandbox)this.vehicle=new VehiclePhysics(this,rules.vehicleParts);
  if(scenario==='bridge') this.createTruck((rules.vehicleMass ?? 12000)*intensity);
  if((scenario as string)==='occupancy' || rules.occupancy) this.occupancy=new OccupancyLoad(this);
 }
 private startupAwakeUntil=0;
 armStartupDamage(){
  if(this.pieces.length<400)return;
  this.startupAwakeUntil=1;
  for(const item of this.items)if(item.id>0){item.body.SetAllowSleeping(false);item.body.ResetSleepTimer();}
 }
 // Preload the unchanged structure under gravity before player actions and scenario clocks start.
 async settleStartup(){
  if(this.pieces.length<400||!this.rules.sandbox)return null;
  // Unsupported or disconnected blueprints must fall visibly in normal play.
  const supported=new Set<number>(),queue:DynamicItem[]=[];
  for(const joint of this.joints)if(!joint.b&&!supported.has(joint.a.id)){supported.add(joint.a.id);queue.push(joint.a);}
  while(queue.length){const item=queue.pop()!;for(const joint of this.jointNeighbors.get(item.id)??[]){const other=joint.a===item?joint.b:joint.a;if(other&&!supported.has(other.id)){supported.add(other.id);queue.push(other);}}}
  if(this.items.some(item=>item.id>0&&!supported.has(item.id)))return null;
  const J=this.J,settings=this.system.GetPhysicsSettings(),velocitySteps=settings.mNumVelocitySteps,positionSteps=settings.mNumPositionSteps;
  const g=this.system.GetGravity(),gravity=[g.GetX(),g.GetY(),g.GetZ()],ramped=new J.Vec3(0,0,0);
  const bodies=this.items.filter(item=>item.id>0).map(item=>{const motion=item.body.GetMotionProperties();return {body:item.body,motion,linear:motion.GetLinearDamping(),angular:motion.GetAngularDamping(),sleep:item.body.GetAllowSleeping()};});
  for(const state of bodies)state.body.SetAllowSleeping(false);
  let steps=0,quiet=0,maxSpeed=Infinity;const started=performance.now();
  try{
   for(let i=0;i<180;i++){
    const gravityScale=Math.min(1,(i+1)/30),extra=Math.max(0,1-(i-45)/45),damping=Math.max(0,1-(i-45)/60);
    ramped.Set(gravity[0]*gravityScale,gravity[1]*gravityScale,gravity[2]*gravityScale);this.system.SetGravity(ramped);
    settings.mNumVelocitySteps=Math.round(velocitySteps+(Math.max(32,velocitySteps)-velocitySteps)*extra);settings.mNumPositionSteps=Math.round(positionSteps+(Math.max(8,positionSteps)-positionSteps)*extra);this.system.SetPhysicsSettings(settings);
    for(const state of bodies){state.motion.SetLinearDamping(state.linear+3*damping);state.motion.SetAngularDamping(state.angular+3*damping);}
    this.world.Step(1/60,1);steps++;
    if(i>=105){maxSpeed=0;for(const state of bodies)maxSpeed=Math.max(maxSpeed,state.body.GetLinearVelocity().Length(),state.body.GetAngularVelocity().Length()*4);quiet=maxSpeed<.035?quiet+1:0;if(quiet>=15)break;}
    // Yield so commands can be queued while the render thread remains responsive.
    if(i%4===3)await new Promise<void>(resolve=>setTimeout(resolve,0));
   }
  }finally{
   ramped.Set(...gravity);this.system.SetGravity(ramped);J.destroy(ramped);settings.mNumVelocitySteps=velocitySteps;settings.mNumPositionSteps=positionSteps;this.system.SetPhysicsSettings(settings);
   for(const state of bodies){state.motion.SetLinearDamping(state.linear);state.motion.SetAngularDamping(state.angular);state.body.SetAllowSleeping(state.sleep);state.body.ResetSleepTimer();}
  }
  this.armStartupDamage();
  return {steps,quiet:quiet>=15,maxSpeed,milliseconds:performance.now()-started};
 }
 retireProjectileCompound(body:any){this.disposableCompounds.add(body);}
 private collectRetiredBodies(){
  // Keep off-world flight members and explicitly reusable shot pools reserved.
  const reserved=new Set(this.blockShots.flatMap(shot=>shot?[...shot.bodies,...(shot.compound?[shot.compound]:[])]:[]));
  const linked=new Set<any>();for(const j of this.joints)if(!j.broken){linked.add(j.a.body);if(j.b)linked.add(j.b.body);}for(const link of this.rebars)if(!link.broken){linked.add(link.a.body);linked.add(link.b.body);}
  const owners=new Map<any,DynamicItem[]>();
  for(const item of this.items){const rows=owners.get(item.body)??[];rows.push(item);owners.set(item.body,rows);}
  const candidates=[...this.removedBodies].filter(body=>!this.pooledBodies.has(body)&&!reserved.has(body)&&!linked.has(body)&&(this.disposableCompounds.has(body)||(owners.has(body)&&owners.get(body)!.every(item=>(item.fractured||item.retired)&&!item.flying))));
  if(!candidates.length)return;
  // Disabled constraints still own body references. Remove them before reuse.
  const reusable=new Set(candidates);
  this.joints=this.joints.filter(j=>{if(j.broken){this.system.RemoveConstraint(j.constraint);return false;}return true;});
  this.jointNeighbors.clear();this.jointCounts.clear();
  for(const j of this.joints){for(const item of j.b?[j.a,j.b]:[j.a]){const rows=this.jointNeighbors.get(item.id)??[];rows.push(j);this.jointNeighbors.set(item.id,rows);}const key=`${j.groupA}:${j.groupB}`;this.jointCounts.set(key,(this.jointCounts.get(key)??0)+1);}
  this.rebars=this.rebars.filter(link=>!link.broken);
  for(const [key,pair] of this.pendingCollisions)if(reusable.has(pair.a)||reusable.has(pair.b)){this.filter.EnableCollision(pair.a.GetCollisionGroup().GetSubGroupID(),pair.b.GetCollisionGroup().GetSubGroupID());this.pendingCollisions.delete(key);}
  for(const body of candidates){
   const group=body.GetCollisionGroup().GetSubGroupID();for(const peer of [...(this.collisionPeers.get(group)??[])])this.filter.EnableCollision(group,peer);this.collisionPeers.delete(group);
   const value=(v:any)=>{const x=v.GetX(),y=v.GetY(),z=v.GetZ(),w=typeof v.GetW==='function'?v.GetW():0;return {GetX:()=>x,GetY:()=>y,GetZ:()=>z,GetW:()=>w};};
   const p=value(body.GetPosition()),q=value(body.GetRotation()),com=value(body.GetCenterOfMassPosition()),zero={GetX:()=>0,GetY:()=>0,GetZ:()=>0};
   // Historic building/objective records keep immutable JS poses, never a reused WASM pointer.
   for(const item of owners.get(body)??[]){item.body={GetPosition:()=>p,GetCenterOfMassPosition:()=>com,GetRotation:()=>q,GetLinearVelocity:()=>zero,GetAngularVelocity:()=>zero,IsActive:()=>false};this.attachmentCounts.delete(item.id);}
   this.disposableCompounds.delete(body);this.bodyPool.push(body);this.pooledBodies.add(body);
  }
  this.items=this.items.filter(item=>item.id>0||!item.fractured&&!item.retired);
 }
 private ensureBodyCapacity(count:number){if(this.bodyPool.length<count&&this.bodyList.length+count>1024)this.collectRetiredBodies();return this.bodyPool.length+8192-this.bodyList.length>=count;}
 // Fixed scene objects (trees, vehicles, truck) occupy (-1_000_000, 0).
 // All unbounded streams share one allocator, including shot roots. Never reuse
 // a render ID when recycling a native body: old snapshots can still refer to it.
 allocateItemId(){return this.nextDynamicId--;}
 updateConcrete(ids:number[],values:ConcreteValues){const wanted=new Set(ids),strength=Math.max(.25,Math.min(2.5,values.concreteStrength)),reinforcement=Math.max(0,Math.min(2.5,values.reinforcement));for(const item of this.items){if(!wanted.has(item.id)||item.fractured||item.retired||item.id<=0)continue;const oldStrength=this.concreteStrength(item),oldReinforcement=this.reinforcement(item);item.concreteStrength=strength;item.reinforcement=reinforcement;const piece=this.pieces.find(p=>p.id===item.id);if(piece){piece.concreteStrength=strength;piece.reinforcement=reinforcement;}for(const joint of this.jointNeighbors.get(item.id)??[]){if(joint.broken)continue;const other=joint.a===item?joint.b:joint.a,oldFactor=Math.min(oldStrength,other?this.concreteStrength(other):oldStrength),newFactor=Math.min(this.concreteStrength(item),other?this.concreteStrength(other):this.concreteStrength(item)),ratio=oldFactor>0?newFactor/oldFactor:1;joint.force*=ratio;joint.torque=joint.torque.map(v=>v*ratio) as V3;}for(const link of this.rebars)if(!link.broken&&(link.a===item||link.b===item)){const other=link.a===item?link.b:link.a,oldFactor=Math.min(oldReinforcement,this.reinforcement(other)),newFactor=Math.min(this.reinforcement(item),this.reinforcement(other)),ratio=oldFactor>0?newFactor/oldFactor:1;link.strength*=ratio;link.limit*=ratio;}}}
 spawnWorldVehicle(spec:WorldVehicleSpec){return this.worldVehicles.spawn(spec);}
 removeWorldVehicle(id:number){return this.worldVehicles.remove(id);}
 replaceWorldVehicle(spec:WorldVehicleSpec){return this.worldVehicles.replace(spec);}
 setWorldVehicleMode(id:number,mode:WorldVehicleMode,target?:V3){return this.worldVehicles.setMode(id,mode,target);}
 worldVehicleInput(id:number,input:any){return this.worldVehicles.input(id,input);}
 removeVehicleBody(item:DynamicItem){if(this.removedBodies.has(item.body))return;for(const j of this.jointNeighbors.get(item.id)??[])if(!j.broken)this.breakJoint(j,true);this.removeRebars(item);this.bodies.RemoveBody(item.body.GetID());this.removedBodies.add(item.body);}
 makeBody(shape:any,p:V3,q:any,mass:number,kinematic=false,debris=false) {
  const J=this.J;
  if(mass>0&&!kinematic&&this.bodyPool.length){
   const body=this.bodyPool.pop()!;this.pooledBodies.delete(body);this.bodies.SetShape(body.GetID(),shape,true,J.EActivation_DontActivate);const motion=body.GetMotionProperties();motion.ScaleToMass(mass);motion.ResetForce();motion.ResetTorque();motion.SetLinearDamping(.08);motion.SetAngularDamping(.14);motion.SetGravityFactor(1);
   const position=new J.RVec3(...p),zero=new J.Vec3(0,0,0);this.bodies.SetPositionAndRotation(body.GetID(),position,q,J.EActivation_DontActivate);body.SetLinearVelocity(zero);body.SetAngularVelocity(zero);body.SetFriction(.55);body.SetRestitution(.03);body.SetAllowSleeping(!!this.rules.sandbox||debris);J.destroy(position);J.destroy(zero);this.bodies.AddBody(body.GetID(),J.EActivation_Activate);this.removedBodies.delete(body);return body;
  }
  if(this.bodyList.length>=8192)throw new Error('Physics body capacity reached');
  const pos=new J.RVec3(...p); const settings=new J.BodyCreationSettings(shape,pos,q,mass>0?J.EMotionType_Dynamic:kinematic?J.EMotionType_Kinematic:J.EMotionType_Static,mass>0||kinematic?1:0); J.destroy(pos);
  settings.mAllowDynamicOrKinematic=true;settings.mFriction=mass>0?.55:.7; settings.mRestitution=.03;
  if(mass>0) { settings.mOverrideMassProperties=J.EOverrideMassProperties_CalculateInertia; settings.mMassPropertiesOverride.mMass=mass; settings.mLinearDamping=.08; settings.mAngularDamping=.14; settings.mAllowSleeping=!!this.rules.sandbox||debris; settings.mMotionQuality=J.EMotionQuality_LinearCast;
  }
  settings.mCollisionGroup.SetGroupFilter(this.filter); settings.mCollisionGroup.SetGroupID(1); settings.mCollisionGroup.SetSubGroupID(this.bodyList.length);
  const body=this.bodies.CreateBody(settings);if(!body||!J.getPointer(body)){J.destroy(settings);throw new Error('Physics body allocation failed');} this.bodies.AddBody(body.GetID(),J.EActivation_Activate); J.destroy(settings); this.bodyList.push(body); return body;
 }
 box(p:V3,size:V3,mass:number,kinematic=false,tilt=0) { const J=this.J,half=new J.Vec3(...size.map(n=>n/2)),shape=new J.BoxShape(half,.03); J.destroy(half); shape.AddRef(); const ax=new J.Vec3(1,0,0),q=J.Quat.prototype.sRotation(ax,tilt); J.destroy(ax); const b=this.makeBody(shape,p,q,mass,kinematic); J.destroy(q); shape.Release(); return b; }
  dynamicBox([id,kind]:[number,string],p:V3,size:V3,mass:number) { const item:DynamicItem={body:this.box(p,size,mass),id,kind,initial:p,stress:0}; if(kind==='truck')item.body.SetFriction(.16); this.items.push(item); return item; }
 createTruck(mass:number) {
  const J=this.J,wheelMass=mass*.01;this.truck=this.dynamicBox([-800,'truck'],[-20,1,0],[3.6,.75,2.05],mass-wheelMass*4);
  for(const x of [-1.15,1.1])for(const z of [-1.1,1.1]){
   const p:V3=[-20+x,.65,z],shape=new J.CylinderShape(.13,.44,.02);shape.AddRef();const axis=new J.Vec3(1,0,0),q=J.Quat.prototype.sRotation(axis,Math.PI/2);J.destroy(axis);
   const wheel=this.makeBody(shape,p,q,wheelMass);J.destroy(q);shape.Release();wheel.SetFriction(1.1);
   this.filter.DisableCollision(this.truck.body.GetCollisionGroup().GetSubGroupID(),wheel.GetCollisionGroup().GetSubGroupID());
   const settings=new J.HingeConstraintSettings();settings.mPoint1.Set(...p);settings.mPoint2.Set(...p);settings.mHingeAxis1.Set(0,0,1);settings.mHingeAxis2.Set(0,0,1);settings.mNormalAxis1.Set(1,0,0);settings.mNormalAxis2.Set(1,0,0);
   settings.mMotorSettings.mMinTorqueLimit=-mass*.22;settings.mMotorSettings.mMaxTorqueLimit=mass*.22;
   const hinge=J.castObject(settings.Create(this.truck.body,wheel),J.HingeConstraint);this.system.AddConstraint(hinge);J.destroy(settings);hinge.SetMotorState(J.EMotorState_Velocity);hinge.SetTargetAngularVelocity(0);this.driveConstraints.push(hinge);
  }
 }
  join(a:DynamicItem,b:DynamicItem|undefined,p:V3,points:V3[]=[p],pinned=false,support=this.ground) {
  const J=this.J, settings=pinned?new J.PointConstraintSettings():new J.SixDOFConstraintSettings();
  if(pinned){settings.mPoint1.Set(...p);settings.mPoint2.Set(...p);}else{for(let axis=0;axis<6;axis++) settings.MakeFixedAxis(axis);settings.mPosition1.Set(...p);settings.mPosition2.Set(...p);}
  const constraint=J.castObject(settings.Create(a.body,b?.body??support),pinned?J.PointConstraint:J.SixDOFConstraint); this.system.AddConstraint(constraint); J.destroy(settings);
  const da=PARTS[(a.sourceKind??a.kind) as keyof typeof PARTS], db=b?PARTS[(b.sourceKind??b.kind) as keyof typeof PARTS]:da;
  const groupA=a.body.GetCollisionGroup().GetSubGroupID();
  const groupB=(b?.body??support).GetCollisionGroup().GetSubGroupID();
  // Distributed sockets resist moments through their actual lever arms.
  // Collinear contacts strengthen only the rotation axes they can resist.
  const materialStrength=b?Math.min(this.concreteStrength(a),this.concreteStrength(b)):this.concreteStrength(a);
  const socketForce=Math.min(da.force,db.force)*materialStrength,socketTorque=Math.min(da.torque,db.torque)*materialStrength;
  const torque=([0,1,2] as const).map(axis=>points.reduce((n,point)=>n+socketTorque+socketForce*Math.hypot(...point.map((v,i)=>i===axis?0:v-p[i])),0)) as V3;
  const joint:Joint={constraint,a,b,force:socketForce*points.length,torque,pinned,broken:false,stress:0,overloadTime:0,localA:points.map(point=>this.bodyLocalPoint(a,point)),localB:b?points.map(point=>this.bodyLocalPoint(b,point)):undefined,groupA,groupB};this.joints.push(joint);
  const key=`${groupA}:${groupB}`;this.jointCounts.set(key,(this.jointCounts.get(key)??0)+1);
  for(const item of b?[a,b]:[a]){this.attachmentCounts.set(item.id,(this.attachmentCounts.get(item.id)??0)+1);const neighbors=this.jointNeighbors.get(item.id)??[];neighbors.push(joint);this.jointNeighbors.set(item.id,neighbors);}

 }
 bodyLocalPoint(item:DynamicItem,point:V3):V3 {
  const p=item.body.GetPosition(),q=item.body.GetRotation();
  return rotateByQuaternion([point[0]-p.GetX(),point[1]-p.GetY(),point[2]-p.GetZ()],[-q.GetX(),-q.GetY(),-q.GetZ(),q.GetW()]);
 }
 addBreakRemnants(item:DynamicItem,points:V3[],source:DynamicItem){
  if(item.id<=0||item.fractured)return;
  const remnants=item.remnants??=[];
  for(const point of points){
   if(remnants.length>=4)break;
   if(remnants.some(remnant=>Math.hypot(remnant.point[0]-point[0],remnant.point[1]-point[1],remnant.point[2]-point[2])<.22))continue;
   remnants.push({point:[...point],sourceKind:source.kind,sourceFinish:source.finish,concreteStrength:source.concreteStrength,seed:Math.imul(item.id,73856093)^Math.imul(source.id,19349663)^remnants.length*83492791});
  }
 }
 force(item:DynamicItem,x:number,y:number,z:number) { if((x||y||z)&&!item.body.IsActive())this.bodies.ActivateBody(item.body.GetID());this.forceVector.Set(x,y,z); item.body.AddForce(this.forceVector); }
 spawnRock() {
  const J=this.J,n=this.rocks++,r=.65+(Math.sin(n*13.7)+1)*.36,x=Math.sin(n*4.17)*3.2;
  const shape=new J.SphereShape(r); shape.AddRef(); const q=new J.Quat(0,0,0,1); const body=this.makeBody(shape,[x,9+n%3,-20],q,2600*r*r*r*this.intensity); J.destroy(q); shape.Release();
  const vel=new J.Vec3(Math.sin(n)*.5,0,7*this.intensity); body.SetLinearVelocity(vel); J.destroy(vel); body.SetRestitution(.18);
  this.items.push({id:this.allocateItemId(),kind:'rock',body,initial:[x,9,-20],stress:0,radius:r});
 }
 spawnMeteor(){
  const J=this.J,n=this.meteors++,slot=n%24;
  const footprint=this.pieces.flatMap(p=>ports(p));
  const top=Math.max(8,...footprint.map(p=>p[1]));
  const targets=this.items.filter(item=>item.id>0&&!item.fractured&&!item.retired&&item.kind!=='foundation'&&item.body.GetCenterOfMassPosition().GetY()>.5);
  const chosen=targets[Math.floor(meteorRandom(n,2)*targets.length)];
  const center=chosen?.body.GetCenterOfMassPosition();
  const target:V3=center?[center.GetX(),center.GetY(),center.GetZ()]:[0,Math.max(2,top*.4),0];
  const {position,velocity:launchVelocity}=meteorFlight(n,target,top,this.intensity);
  let item=this.meteorPool[slot];
  if(!item){const radius=.55+(Math.sin(slot*4.17)+1)*.27,shape=new J.SphereShape(radius);shape.AddRef();const q=new J.Quat(0,0,0,1);const body=this.makeBody(shape,position,q,1800*METEOR_MASS_FACTOR*radius**3);J.destroy(q);shape.Release();body.SetRestitution(.08);item={id:this.allocateItemId(),kind:'meteor',body,initial:position,radius,stress:0};this.items.push(item);this.meteorPool.push(item);}
  else {const p=new J.RVec3(...position),q=new J.Quat(0,0,0,1);this.bodies.SetPositionAndRotation(item.body.GetID(),p,q,J.EActivation_Activate);J.destroy(p);J.destroy(q);}
  item.initial=position;item.bornAt=this.elapsed;const motion=item.body.GetMotionProperties();motion.SetLinearDamping(0);motion.ResetForce();motion.ResetTorque();const velocity=new J.Vec3(...launchVelocity);item.body.SetLinearVelocity(velocity);velocity.Set(0,0,0);item.body.SetAngularVelocity(velocity);J.destroy(velocity);
 }
 projectileFlights=new ProjectileFlights(this);
 private blockShots:{root:number;bodies:any[];compound?:any}[]=[];
 private blockShotSequence=0;
 launchBlockProjectile(position:V3,velocity:V3,mass:number,radius:number,recycle=false,storey=false,building?:BuildingProjectileOptions){
  const options=normalizeBuildingProjectile(building);
  const J=this.J,layout=storey?storeyProjectileLayout(options.parts):blockProjectileLayout(Math.max(.05,radius)),count=layout.cells.length,totalWeight=layout.cells.reduce((sum,cell)=>sum+(cell.massWeight??1),0);
  if(count>this.fragmentLimit)return undefined;
  // Optional recycling reuses a small assembly pool; otherwise shots stay until the debris budget needs space.
  const slot=recycle?this.blockShotSequence%4:-1;this.blockShotSequence++;const old=this.blockShots[slot];
  if(old){
   this.projectileFlights.retire(old.root);
   const members=this.items.filter(i=>i.rootPieceId===old.root),ids=new Set(members.map(i=>i.id));
   for(const joint of this.joints)if(ids.has(joint.a.id)||(joint.b&&ids.has(joint.b.id))){this.breakJoint(joint,true);this.system.RemoveConstraint(joint.constraint);}
   this.joints=this.joints.filter(j=>!ids.has(j.a.id)&&!(j.b&&ids.has(j.b.id)));
   for(const item of members){this.removeRebars(item);if(!item.fractured){if(!this.removedBodies.has(item.body)){this.bodies.RemoveBody(item.body.GetID());this.removedBodies.add(item.body);}this.fragments--;}item.fractured=true;item.retired=true;this.jointNeighbors.delete(item.id);this.attachmentCounts.delete(item.id);}
   for(const [key,pair] of this.pendingCollisions)if(old.bodies.includes(pair.a)||old.bodies.includes(pair.b)){this.filter.EnableCollision(pair.a.GetCollisionGroup().GetSubGroupID(),pair.b.GetCollisionGroup().GetSubGroupID());this.pendingCollisions.delete(key);}
  }
  if(!this.makeFragmentRoom(count,true)||!this.ensureBodyCapacity(count+(storey?1:0)))return undefined;
  this.projectiles++;
  const root=this.allocateItemId(),created:DynamicItem[]=[],pool:any[]=[],q=new J.Quat(0,0,0,1),v=new J.Vec3(...velocity);
  for(let index=0;index<count;index++){
   const cell=layout.cells[index],partMass=storey?cell.massWeight!:mass*(cell.massWeight??1)/totalWeight,p=position.map((n,i)=>n+cell.offset[i]) as V3;
   const half=new J.Vec3(...cell.size.map(n=>n/2)),shape=new J.BoxShape(half,Math.min(.02,Math.min(...cell.size)*.05));J.destroy(half);shape.AddRef();
   let body=old?.bodies[index];
   if(body){this.bodies.SetShape(body.GetID(),shape,true,J.EActivation_DontActivate);body.GetMotionProperties().ScaleToMass(partMass);const pos=new J.RVec3(...p);this.bodies.SetPositionAndRotation(body.GetID(),pos,q,J.EActivation_DontActivate);J.destroy(pos);this.bodies.AddBody(body.GetID(),J.EActivation_Activate);this.removedBodies.delete(body);}
   else body=this.makeBody(shape,p,q,partMass,false,true);
   shape.Release();body.GetMotionProperties().ResetForce();body.GetMotionProperties().ResetTorque();body.SetLinearVelocity(v);const zero=new J.Vec3(0,0,0);body.SetAngularVelocity(zero);J.destroy(zero);
   const item:DynamicItem={id:this.allocateItemId(),kind:'fragment',body,initial:p,stress:0,size:cell.size,sourceKind:cell.sourceKind??'slab',sourceMass:partMass,impactMass:partMass,radius:Math.min(...cell.size)/2,rootPieceId:root,structural:true,blockShot:root,protectedProjectile:!recycle,concreteStrength:storey&&cell.sourceKind!=='facade'?options.concreteStrength:1,reinforcement:storey?(cell.sourceKind==='facade'?1:options.reinforcement):.35,bornAt:this.elapsed};
   this.items.push(item);created.push(item);pool.push(body);this.fragments++;
  }
  J.destroy(q);J.destroy(v);if(recycle)this.blockShots[slot]={root,bodies:[...pool,...(old?.bodies.slice(count)??[])]};
  for(const [a,b] of layout.links){
   const left=created[a],right=created[b];
   const overlap=left.initial.map((n,i)=>Math.min(n+left.size![i]/2,right.initial[i]+right.size![i]/2)-Math.max(n-left.size![i]/2,right.initial[i]-right.size![i]/2));
   const axis=overlap.indexOf(Math.min(...overlap));
   const point=left.initial.map((n,i)=>(Math.min(n+left.size![i]/2,right.initial[i]+right.size![i]/2)+Math.max(n-left.size![i]/2,right.initial[i]-right.size![i]/2))/2) as V3;
   this.join(left,right,point);const joint=this.joints.at(-1)!;
   const area=storey?overlap.reduce((product,v,i)=>i===axis?product:product*Math.max(.001,v),1):layout.cells[a].size[0]**2;
   const glass=left.sourceKind==='facade'||right.sourceKind==='facade';if(!storey){joint.force=90000*area;joint.torque=[1,1,1].map(()=>joint.force*Math.min(...left.size!,...right.size!)*.35) as V3;}
   this.filter.DisableCollision(left.body.GetCollisionGroup().GetSubGroupID(),right.body.GetCollisionGroup().GetSubGroupID());
   if(storey&&glass){const panel=left.sourceKind==='facade'?left:right,support=panel===left?right:left;const edges=this.glassFrames.get(panel)??[];edges.push({support,panelPoint:this.bodyLocalPoint(panel,point),supportPoint:this.bodyLocalPoint(support,point)});this.glassFrames.set(panel,edges);}
  }
  if(storey){const compound=this.projectileFlights.start(root,created,position,old?.compound);if(recycle)this.blockShots[slot].compound=compound;}
  else if(recycle&&old?.compound)this.blockShots[slot].compound=old.compound;
  return created[0];
 }
 launchProjectile(position:V3, velocity:V3, mass:number, radius:number, projectileType:'solid'|'blocks'|'storey'='solid',recycle=false,building?:BuildingProjectileOptions):DynamicItem|undefined {
  if(projectileType==='blocks'||projectileType==='storey')return this.launchBlockProjectile(position,velocity,mass,radius,recycle,projectileType==='storey',building);
  if(!this.ensureBodyCapacity(1))return undefined;
  const J=this.J,n=this.projectiles++,slot=recycle?n%60:this.projectilePool.length,r=Number.isFinite(radius)?Math.max(.001,radius):.7,m=Math.max(.1,mass);
  const shape=new J.SphereShape(r);shape.AddRef();const q=new J.Quat(0,0,0,1);
  let item=this.projectilePool[slot];
  if(item){
   // Recycle the oldest shot's body and render ID; keep memory and collision groups bounded.
   this.bodies.SetShape(item.body.GetID(),shape,true,J.EActivation_Activate);
   const motion=item.body.GetMotionProperties();motion.ScaleToMass(m);motion.ResetForce();motion.ResetTorque();
   const p=new J.RVec3(...position);this.bodies.SetPositionAndRotation(item.body.GetID(),p,q,J.EActivation_Activate);J.destroy(p);
   for(const key of this.projectileHits)if(key.startsWith(item.id+':'))this.projectileHits.delete(key);
  }else{
   const body=this.makeBody(shape,position,q,m);item={id:this.allocateItemId(),kind:'projectile',body,initial:[...position],stress:0};this.items.push(item);this.projectilePool.push(item);
  }
  J.destroy(q);shape.Release();
  item.initial=[...position];item.radius=r;item.impactMass=m;item.bornAt=this.elapsed;
  const v=new J.Vec3(...velocity);item.body.SetLinearVelocity(v);v.Set(0,0,0);item.body.SetAngularVelocity(v);J.destroy(v);item.body.SetRestitution(.12);
  return item;
 }
 step(dt=1/120) {
  if(this.bodyList.length>1024&&this.elapsed>=this.collectAfter){this.collectAfter=this.elapsed+.5;this.collectRetiredBodies();}
  if(this.startupAwakeUntil&&this.elapsed>=this.startupAwakeUntil){this.startupAwakeUntil=0;for(const item of this.items)if(item.id>0&&!item.fractured)item.body.SetAllowSleeping(!!this.rules.sandbox);}
  if(this.result)return; const start=performance.now(); this.elapsed+=dt; const t=this.elapsed, J=this.J, ramp=Math.min(1,Math.max(0,(t-1)/3));
  if(this.hazardActive('earthquake')||this.quakeResetSteps>0) {
   if(this.quakeResetSteps>0)this.quakeResetSteps--;
   const aftershock=this.rules.aftershock && t>this.duration*.58;
   const shockEnvelope=aftershock ? 1.8*Math.max(0,1-(t-this.duration*.58)/2) : 0;
   const quakeRamp=Math.min(1,Math.max(0,(this.hazardAge('earthquake')-1)/3));const amp=this.hazardActive('earthquake')?.025*this.intensity*quakeRamp*(1+shockEnvelope):0; const p=new J.RVec3(amp*Math.sin(t*19)+amp*.4*Math.sin(t*31),-1,amp*.65*Math.sin(t*23)); const q=new J.Quat(0,0,0,1); this.bodies.MoveKinematic(this.ground.GetID(),p,q,dt); J.destroy(p); J.destroy(q);
  }
  // Wheel motors generate traction through contacts. The chassis receives no
  // artificial translation or mid-air driving force.
  if(this.truck)for(const hinge of this.driveConstraints)hinge.SetTargetAngularVelocity(t>1?-3.2/.44:0);
  if(this.scenario==='landslide' && t>1 && this.rocks<(this.rules.rockCount ?? 20) && t>1+this.rocks*(this.rules.rockInterval ?? .5)) this.spawnRock();
  if(this.hazardActive('meteors')&&t>=this.nextMeteorAt){this.spawnMeteor();this.nextMeteorAt=t+.85/Math.max(.5,this.intensity);}
  this.occupancy?.update(t);
  const floodRamp=Math.min(1,Math.max(0,(this.hazardAge('flood')-1)/3));
  const waterTarget=this.hazardActive('flood')?-1+floodRamp*6*this.intensity:-8;
  this.water=this.rules.sandbox?this.water+Math.max(-dt*2,Math.min(dt*2,waterTarget-this.water)):waterTarget;
  const wind=this.hazardActive('wind'), flood=this.hazardActive('flood')||(this.rules.sandbox&&this.water>0);
  const gust=wind ? 1+.3*Math.sin(t*3)+.2*Math.sin(t*7) : 0;
  const windForce=wind ? 58*this.intensity*Math.min(1,Math.max(0,(this.hazardAge('wind')-1)/3)) : 0;
  for(const item of this.items) {
   item.stress=0; if(item.fractured || item.id<0 || (!wind && !flood))continue;
   const def=PARTS[item.kind as keyof typeof PARTS];
   if(wind) { const area=((item.kind==='wall'||item.kind==='facade')?16:item.kind==='slab'?2:3); this.force(item,area*.65*windForce*windForce*gust,0,area*.15*windForce*windForce); }
   if(flood) { const p=item.body.GetCenterOfMassPosition(),v=item.body.GetLinearVelocity(); const submerged=Math.max(0,Math.min(1,(this.water-p.GetY()+1)/2)); const volume=def.segments.reduce((n,s)=>n+s.size[0]*s.size[1]*s.size[2],0); this.force(item,submerged*(14500*this.intensity-v.GetX()*1900),submerged*(volume*1000*9.81-v.GetY()*1500),submerged*1000); }
  }
  this.projectileFlights.beforeStep(dt);
  const projectileSweeps=this.rules.sandbox?this.captureProjectileSweeps():[];
  const groundImpacts=this.captureGroundImpacts();
  this.trees?.beforeStep(dt);
  this.vehicle?.step(dt);this.attacker?.step(dt);this.worldVehicles.step(dt);this.world.Step(dt,1);this.vehicle?.afterStep();this.attacker?.afterStep();this.worldVehicles.afterStep();this.trees?.afterStep(dt);
  this.projectileFlights.syncAll();
  this.updateRebars(dt);
  this.fractureProjectileImpacts(projectileSweeps);
  this.fractureGroundImpacts(groundImpacts);
  if(this.rules.sandbox&&!this.sandboxHazards.earthquake&&this.quakeResetSteps===0&&this.ground.GetMotionType()===J.EMotionType_Kinematic)this.bodies.SetMotionType(this.ground.GetID(),J.EMotionType_Static,J.EActivation_DontActivate);
  for(const [key,pair] of this.pendingCollisions){if(this.removedBodies.has(pair.a)||this.removedBodies.has(pair.b)){this.pendingCollisions.delete(key);continue;}if(!this.bodiesOverlap(pair.a,pair.b)){this.filter.EnableCollision(pair.a.GetCollisionGroup().GetSubGroupID(),pair.b.GetCollisionGroup().GetSubGroupID());this.pendingCollisions.delete(key);}}
  this.maxStress=0;
  const awake=new Set<number>();for(const item of this.items)if((item.id>0||item.structural)&&!item.fractured&&item.body.IsActive())awake.add(item.id);
  for(const j of this.joints) {
   if(j.broken)continue;
   if(!awake.has(j.a.id)&&(!j.b||!awake.has(j.b.id))){j.stress=0;j.overloadTime=Math.max(0,j.overloadTime-dt*.5);continue;}
   const f=j.constraint.GetTotalLambdaPosition().Length()/dt,torque=j.pinned?null:j.constraint.GetTotalLambdaRotation();
   const stress=torque?Math.max(f/j.force,Math.abs(torque.GetX())/(dt*j.torque[0]),Math.abs(torque.GetY())/(dt*j.torque[1]),Math.abs(torque.GetZ())/(dt*j.torque[2])):f/j.force;j.stress=stress;
   j.a.stress=Math.max(j.a.stress,stress); if(j.b)j.b.stress=Math.max(j.b.stress,stress); this.maxStress=Math.max(this.maxStress,stress);
   // Large impacts fail promptly; small transient solver peaks can settle.
   // Overload accumulation is a uniform game material model, not a mode bonus.
   if(t<.5&&!j.a.blockShot&&!j.b?.blockShot)j.overloadTime=0;else if(stress>1) j.overloadTime+=dt*(stress-1)*(stress-1); else j.overloadTime=Math.max(0,j.overloadTime-dt*.5);
   if(j.overloadTime>.08){if(!this.yieldJoint(j))this.breakJoint(j);}
  }
  this.updateGlassDamage(t);
  // Losing a support is not a material fracture for reinforced structural parts.
  // Detached assemblies keep their rigidity; brittle glazing follows its frame.
  this.peakStress=Math.max(this.peakStress,this.maxStress);
  if(this.truck) { const p=this.truck.body.GetPosition(); if(p.GetY()<-2) this.finish(false,'The truck fell below the road. Reinforce the span and try again.'); else if(p.GetX()>14) this.finish(true,'The test truck made it across. Your bridge carried the load.'); }
  if(this.house) { const p=this.house.body.GetPosition(); if(Math.hypot(p.GetX(),p.GetY()-1.6,p.GetZ()-5)>HOUSE_DISPLACEMENT_LIMIT) this.finish(false,'The house shifted more than 0.5 m. Widen the wall or add stronger buttresses.'); }
  if(!this.rules.sandbox && t>=this.duration && !this.result) {
   const structural=this.items.filter(i=>i.id>0); const moved=structural.filter(i=>{if(i.fractured)return true;const p=i.body.GetPosition();return Math.hypot(p.GetX()-i.initial[0],p.GetY()-i.initial[1],p.GetZ()-i.initial[2])>1.5}).length;
   const building=['earthquake','wind','flood','occupancy'].includes(this.scenario)||!!this.rules.occupancy?this.buildingStatus():null;
   const tall=building?.passed??false;
   const occupancyScenario=!!this.occupancy;
   const slabsAboveGround=this.pieces.some(p=>p.kind==='slab'&&p.p[1]>=4);
   const payload=this.items.filter(i=>i.kind==='payload');
   const retained=payload.length>0&&payload.filter(i=>i.body.GetPosition().GetY()>=i.initial[1]-1.5).length/payload.length>=.75;
   const pass=occupancyScenario ? tall&&slabsAboveGround&&retained&&moved/Math.max(1,structural.length)<.25 : this.scenario!=='bridge' && (this.scenario==='landslide'||tall) && structural.length>0 && moved/structural.length<.25;
   let reason:string;
   if(pass) reason=occupancyScenario?'The occupied floors held their live load and the tower remained stable.':this.scenario==='landslide'?'The barrier held. The house is safe.':'Your structure survived with less than 25% major displacement.';
   else if(building&&!building.passed) reason=building.reason;
   else if(occupancyScenario&&!slabsAboveGround) reason=`The structure must include an occupied floor above ground and reach at least ${this.rules.minHeight ?? 8} m.`;
   else if(occupancyScenario&&!payload.length) reason='No occupancy load was placed on a raised floor.';
   else if(occupancyScenario&&!retained) reason='Too much occupancy load fell from the floors. Add columns and lateral bracing.';
   else reason=this.scenario==='bridge'?'The truck did not reach the far bank.':!tall&&this.scenario!=='landslide'?`The structure must reach at least ${this.rules.minHeight ?? 8} m.`:'Too much of the structure moved or collapsed. Add foundations and lateral bracing.';
   this.finish(pass,reason);
  }
  this.physicsMs=performance.now()-start;
 }
 private updateGlassDamage(time:number){
  if(time<.5||time<this.nextGlassCheck)return;
  this.nextGlassCheck=time+.05;let budget=6;
  for(const [panel,edges] of this.glassFrames){
   if(panel.fractured||panel.retired){this.glassFrames.delete(panel);this.glassStrain.delete(panel.id);continue;}
   let failed=false,strained=false,point:V3|undefined;
   for(const edge of edges){
    if(edge.support.fractured||edge.support.retired){failed=true;point=this.bodyWorldPoint(panel,edge.panelPoint);break;}
    if(!panel.body.IsActive()&&!edge.support.body.IsActive())continue;
    const a=this.bodyWorldPoint(panel,edge.panelPoint),b=this.bodyWorldPoint(edge.support,edge.supportPoint);
    if(Math.hypot(a[0]-b[0],a[1]-b[1],a[2]-b[2])>.18){strained=true;point=a;break;}
   }
   const strain=strained?(this.glassStrain.get(panel.id)??0)+.05:0;this.glassStrain.set(panel.id,strain);
   const mounts=this.jointNeighbors.get(panel.id)??[];
   const detached=mounts.length>0&&mounts.every(j=>j.broken);
   if(budget&&(failed||detached||strain>=.1)){this.fracture(panel,point);budget--;}
  }
 }
 yieldJoint(j:Joint){
  if(j.pinned||!REINFORCED_KINDS.has(j.a.sourceKind??j.a.kind)||(j.b&&!REINFORCED_KINDS.has(j.b.sourceKind??j.b.kind))||this.reinforcement(j.a)<=0||(j.b&&this.reinforcement(j.b)<=0)||(j.damageStage??0)>=2)return false;
  j.damageStage=(j.damageStage??0)+1;j.overloadTime=0;
  const angle=j.damageStage===1?.07:.24,friction=j.damageStage===1?.45:.18;
  const lo=new this.J.Vec3(-angle,-angle,-angle),hi=new this.J.Vec3(angle,angle,angle);
  j.constraint.SetRotationLimits(lo,hi);this.J.destroy(lo);this.J.destroy(hi);
  for(let axis=0;axis<3;axis++)j.constraint.SetMaxFriction(axis+3,j.torque[axis]*friction);
  return true;
 }
 breakJoint(j:Joint,transfer=false){
  if(j.broken)return false;
  j.constraint.SetEnabled(false);j.broken=true;
  if(j.b&&!transfer){this.addBreakRemnants(j.a,j.localA,j.b);this.addBreakRemnants(j.b,j.localB??[],j.a);}
  const key=`${j.groupA}:${j.groupB}`,remaining=Math.max(0,(this.jointCounts.get(key)??1)-1);this.jointCounts.set(key,remaining);
  for(const item of j.b?[j.a,j.b]:[j.a])this.attachmentCounts.set(item.id,Math.max(0,(this.attachmentCounts.get(item.id)??1)-1));
  if(remaining===0&&j.groupA!==undefined&&j.groupB!==undefined)this.restoreCollisionWhenSeparate(j.a.body,j.b?.body??this.bodyList[j.groupB]);
  if(!transfer&&j.b&&remaining===0&&REINFORCED_KINDS.has(j.a.sourceKind??j.a.kind)&&REINFORCED_KINDS.has(j.b.sourceKind??j.b.kind)&&!j.a.fractured&&!j.b.fractured){
   const center=(points:V3[])=>points.reduce((out,p)=>out.map((v,i)=>v+p[i]/points.length) as V3,[0,0,0] as V3);
  this.createRebar(j.a,j.b,this.bodyWorldPoint(j.a,center(j.localA)),this.bodyWorldPoint(j.b,center(j.localB!)),.18,220000,true);
  }
  if(!transfer){this.broken++;this.releaseFacadeClearance(j.a);if(j.b)this.releaseFacadeClearance(j.b);}return true;
 }
 private releaseFacadeClearance(item:DynamicItem){
  if(this.attachmentCounts.get(item.id))return;
  const peers=this.facadeClearances.get(item.id);if(!peers)return;
  for(const peer of peers){if(!item.fractured&&!peer.fractured)this.restoreCollisionWhenSeparate(item.body,peer.body);this.facadeClearances.get(peer.id)?.delete(item);}
  this.facadeClearances.delete(item.id);
 }
 captureProjectileSweeps(){
  const sweeps:{item:DynamicItem;from:V3;speed:number;energy:number}[]=[];
  for(const item of this.items){
   if(item.flying||(item.kind!=='projectile'&&!item.blockShot)||item.fractured||!item.body.IsActive())continue;
   const p=item.body.GetPosition(),v=item.body.GetLinearVelocity(),speed=Math.hypot(v.GetX(),v.GetY(),v.GetZ());
   sweeps.push({item,from:[p.GetX(),p.GetY(),p.GetZ()],speed,energy:.5*(item.impactMass??0)*speed*speed});
  }
  return sweeps;
 }
 fractureProjectileImpacts(sweeps:{item:DynamicItem;from:V3;speed:number;energy:number}[]){
  // A fast heavy projectile can punch through a reinforced floor even while
  // other bearings still hold it. Ordinary gravity, occupancy and low-energy
  // bumps continue to use the joint fatigue model above.
  const active=sweeps.filter(sweep=>sweep.speed>=3&&sweep.energy>=5000);if(!active.length)return;
  // Read each target's WASM bounds once, then query only nearby spatial cells.
  // Previously every part in a flying assembly scanned every world body.
  type Entry={target:DynamicItem;min:V3;max:V3;order:number};
  const entries:Entry[]=[],oversized:Entry[]=[],grid=new Map<string,Entry[]>(),cellSize=8;
  let indexed=0,indexedItems=this.items;const indexedTargets=new Set<DynamicItem>();
  const indexNewTargets=()=>{if(indexedItems!==this.items){indexedItems=this.items;indexed=0;}while(indexed<this.items.length){
   const target=this.items[indexed++];if(indexedTargets.has(target))continue;indexedTargets.add(target);
   if((target.id<=0&&!target.structural)||!['column','slab','wall','deck','facade','doorway','stairwell','stair','core'].includes(target.sourceKind??target.kind)||target.fractured)continue;
   const bounds=target.body.GetWorldSpaceBounds(),lo=bounds.mMin,hi=bounds.mMax;
   const min:V3=[lo.GetX(),lo.GetY(),lo.GetZ()],max:V3=[hi.GetX(),hi.GetY(),hi.GetZ()],entry={target,min,max,order:indexed};entries.push(entry);
   const a=min.map(n=>Math.floor(n/cellSize)),b=max.map(n=>Math.floor(n/cellSize));
   if(b.some((n,i)=>!Number.isFinite(n-a[i]))||(b[0]-a[0]+1)*(b[1]-a[1]+1)*(b[2]-a[2]+1)>512){oversized.push(entry);continue;}
   for(let x=a[0];x<=b[0];x++)for(let y=a[1];y<=b[1];y++)for(let z=a[2];z<=b[2];z++){const key=`${x},${y},${z}`,rows=grid.get(key);if(rows)rows.push(entry);else grid.set(key,[entry]);}
  }};
  indexNewTargets();
  for(const sweep of active){
   const p=sweep.item.body.GetPosition(),to:[number,number,number]=[p.GetX(),p.GetY(),p.GetZ()];
   let hit:DynamicItem|undefined,first=Infinity;
   const margin=(sweep.item.radius??0)+.35,low=sweep.from.map((n,i)=>Math.floor((Math.min(n,to[i])-margin)/cellSize)),high=sweep.from.map((n,i)=>Math.floor((Math.max(n,to[i])+margin)/cellSize));
   const volume=(high[0]-low[0]+1)*(high[1]-low[1]+1)*(high[2]-low[2]+1);
   let candidates:Entry[];
   if(!Number.isFinite(volume)||volume>512)candidates=entries;
   else{const sameAssembly=(entry:Entry)=>!!sweep.item.blockShot&&entry.target.rootPieceId===sweep.item.rootPieceId;const nearby=new Set(oversized.filter(entry=>!sameAssembly(entry)));for(let x=low[0];x<=high[0];x++)for(let y=low[1];y<=high[1];y++)for(let z=low[2];z<=high[2];z++)for(const entry of grid.get(`${x},${y},${z}`)??[])if(!sameAssembly(entry))nearby.add(entry);candidates=[...nearby].sort((a,b)=>a.order-b.order);}
   for(const {target,min,max} of candidates){
    if(target===sweep.item||(sweep.item.blockShot&&target.rootPieceId===sweep.item.rootPieceId))continue;
    if((target.id<=0&&!target.structural)||!['column','slab','wall','deck','facade','doorway','stairwell','stair','core'].includes(target.sourceKind??target.kind)||target.fractured)continue;
    const glass=(target.sourceKind??target.kind)==='facade',strength=this.concreteStrength(target);if(sweep.speed<(glass?3:12*Math.sqrt(strength))||sweep.energy<(glass?5000:(sweep.item.blockShot?30000:750000)*strength))continue;
    const key=`${sweep.item.id}:${target.rootPieceId??target.id}`;if(this.projectileHits.has(key))continue;
    // Jolt resolves the contact and can move both bodies apart before we read
    // their post-step poses, so keep a small solver travel allowance here.
    let contact=this.segmentAabbHit(sweep.from,to,min,max,(sweep.item.radius??0)+.35);
    const segments=target.size?undefined:PARTS[(target.sourceKind??target.kind) as Piece['kind']]?.segments;
    if(Number.isFinite(contact)&&segments&&segments.length>1){
     const localFrom=this.bodyLocalPoint(target,sweep.from),localTo=this.bodyLocalPoint(target,to);contact=Infinity;
     for(const segment of segments){
      const c=Math.cos(segment.tilt??0),s=Math.sin(segment.tilt??0);
      const local=(v:V3):V3=>{const x=v[0]-segment.center[0],y=v[1]-segment.center[1];return [c*x+s*y,-s*x+c*y,v[2]-segment.center[2]];};
      contact=Math.min(contact,this.segmentAabbHit(local(localFrom),local(localTo),segment.size.map(v=>-v/2) as V3,segment.size.map(v=>v/2) as V3,(sweep.item.radius??0)+.35));
     }
    }
    if(contact<first){first=contact;hit=target;}
   }
   if(!hit)continue;
   this.projectileHits.add(`${sweep.item.id}:${hit.rootPieceId??hit.id}`);
   const point=sweep.from.map((v,i)=>v+(to[i]-v)*first) as V3;
   this.impactFracture(hit,point,sweep.energy);
   if(sweep.item.blockShot)this.impactFracture(sweep.item,point,sweep.energy,30000);
   indexNewTargets();
  }
 }
 segmentAabbHit(from:V3,to:V3,min:V3,max:V3,margin:number){
  let near=0,far=1;
  for(let axis=0;axis<3;axis++){
   const delta=to[axis]-from[axis],low=min[axis]-margin,high=max[axis]+margin;
   if(Math.abs(delta)<1e-9){if(from[axis]<low||from[axis]>high)return Infinity;continue;}
   let a=(low-from[axis])/delta,b=(high-from[axis])/delta;if(a>b)[a,b]=[b,a];
   near=Math.max(near,a);far=Math.min(far,b);if(near>far)return Infinity;
  }
  return near;
 }
 bodiesOverlap(a:any,b:any){
  // Jolt's returned value wrappers can share temporary storage: snapshot before the next call.
  const bounds=a.GetWorldSpaceBounds(),lo=bounds.mMin;
  const ax=lo.GetX(),ay=lo.GetY(),az=lo.GetZ(),hi=bounds.mMax;
  const bx=hi.GetX(),by=hi.GetY(),bz=hi.GetZ();
  const other=b.GetWorldSpaceBounds(),min=other.mMin;
  const cx=min.GetX(),cy=min.GetY(),cz=min.GetZ(),max=other.mMax;
  return ax<=max.GetX()&&bx>=cx&&ay<=max.GetY()&&by>=cy&&az<=max.GetZ()&&bz>=cz;
 }
 restoreCollisionWhenSeparate(a:any,b:any){
  const ga=a.GetCollisionGroup().GetSubGroupID(),gb=b.GetCollisionGroup().GetSubGroupID();
  const key=ga<gb?`${ga}:${gb}`:`${gb}:${ga}`;
  if(this.bodiesOverlap(a,b)){this.filter.DisableCollision(ga,gb);this.pendingCollisions.set(key,{a,b});}
  else this.filter.EnableCollision(ga,gb);
 }
 makeFragmentRoom(amount:number,forProjectile=false){
  if(amount>this.fragmentLimit)return false;
  let needed=Math.max(0,this.fragments+amount-this.fragmentLimit);if(!needed)return true;
  // New shots may retire the oldest debris, including previous shot parts.
  // Routine fracture cleanup still preserves active load-bearing remnants.
  const debris=this.items.filter(item=>item.kind==='fragment'&&!item.fractured&&(forProjectile||(!item.flying&&!item.protectedProjectile&&(!item.structural||(!(this.attachmentCounts.get(item.id)??0)&&!item.body.IsActive()))))).sort((a,b)=>(forProjectile?0:Number(a.body.IsActive())-Number(b.body.IsActive()))||((a.bornAt??0)-(b.bornAt??0)));
  for(const item of debris){
   if(needed<=0)break;
   // Off-world flight members must first leave their shared compound body.
   if(item.flying)this.projectileFlights.release(item.blockShot);
   for(const joint of this.jointNeighbors.get(item.id)??[])this.breakJoint(joint,true);
   this.removeRebars(item);this.bodies.RemoveBody(item.body.GetID());this.removedBodies.add(item.body);item.fractured=true;item.retired=true;this.fragments--;needed--;
  }
  return needed===0;
 }
 setFragmentLimit(value:number){this.fragmentLimit=Math.max(24,Math.min(3000,Math.round(value)));this.makeFragmentRoom(0);}
 captureGroundImpacts(){
  const falling:{item:DynamicItem;vy:number}[]=[];
  for(const item of this.items){
   if(item.fractured||(item.id<=0&&!item.structural)||!['column','slab','wall','deck','facade','doorway','stairwell','stair','core'].includes(item.sourceKind??item.kind)||!item.body.IsActive())continue;
   const vy=item.body.GetLinearVelocity().GetY();if(vy < -7*Math.sqrt(this.concreteStrength(item)))falling.push({item,vy});
  }
  return falling;
 }
 fractureGroundImpacts(falling:{item:DynamicItem;vy:number}[]){
  let budget=4;
  for(const {item,vy} of falling){
   if(!budget||item.fractured||item.body.GetLinearVelocity().GetY()-vy<5*Math.sqrt(this.concreteStrength(item)))continue;
   const bounds=item.body.GetWorldSpaceBounds();if(bounds.mMin.GetY()>.18)continue;
   const center=item.body.GetCenterOfMassPosition();this.fracture(item,[center.GetX(),0,center.GetZ()]);budget--;
  }
 }
 private coreImpactEnergy=new Map<number,number>();
 private materialImpactEnergy=new Map<number,number>();
 impactFracture(item:DynamicItem,point:V3,energy:number,baselineThreshold=750000){
  if((item.sourceKind??item.kind)==='core'){
   const accumulated=(this.coreImpactEnergy.get(item.id)??0)+Math.max(0,energy);
   // Core walls are thick, highly reinforced concrete, but repeated impacts
   // still break them locally instead of making an invulnerable anchor.
   const threshold=4500000*this.concreteStrength(item)*Math.max(.2,(item.sourceMass??PARTS.core.mass)/PARTS.core.mass);
   if(accumulated<threshold){this.coreImpactEnergy.set(item.id,accumulated);return;}
   this.coreImpactEnergy.delete(item.id);
  } else if(isConcrete(item.sourceKind??item.kind)) {
   const threshold=baselineThreshold*this.concreteStrength(item),accumulated=(this.materialImpactEnergy.get(item.id)??0)+Math.max(0,energy);
   if(accumulated<threshold){this.materialImpactEnergy.set(item.id,accumulated);return;}
   this.materialImpactEnergy.delete(item.id);
  }
  this.fracture(item,point);
 }
 fracture(item:DynamicItem,hitWorld?:V3){
  this.projectileFlights.release(item.blockShot);
  if(item.fractured)return;
  const piece=this.pieces.find(p=>p.id===item.id)??(item.structural?{id:item.id,kind:item.sourceKind as Piece['kind'],p:[0,0,0] as V3,rotation:0,finish:item.finish}:undefined);if(!piece)return;
  const hitLocal=hitWorld?this.bodyLocalPoint(item,hitWorld):item.size?[0,0,0] as V3:PARTS[piece.kind].segments[0].center;
  const chunks=localFractureShapes(piece,hitLocal,item.size?{center:[0,0,0],size:item.size,mass:item.sourceMass!}:undefined);if(!chunks.length)return;
  if(!this.ensureBodyCapacity(chunks.length)||!this.makeFragmentRoom(chunks.length-(item.kind==='fragment'?1:0))){
   if(item.protectedProjectile){for(const joint of this.jointNeighbors.get(item.id)??[])this.breakJoint(joint,true);this.removeRebars(item);item.structural=false;item.impactMass=0;return;}
   // A debris budget limits replacement bodies, never whether damage occurs.
   // Preserve other load-bearing remnants; represent this break with visual
   // debris when no safely reclaimable physical slots remain.
   for(const joint of this.jointNeighbors.get(item.id)??[])this.breakJoint(joint);
   this.removeRebars(item);this.bodies.RemoveBody(item.body.GetID());this.removedBodies.add(item.body);item.fractured=true;
   if(item.kind==='fragment')this.fragments--;
   return;
  }
  const attachments=(this.jointNeighbors.get(item.id)??[]).filter(j=>!j.broken).map(j=>({j,points:(j.a===item?j.localA:j.localB!).map(p=>this.bodyWorldPoint(item,p))}));
  for(const {j} of attachments)this.breakJoint(j,true);
  const J=this.J,p=item.body.GetPosition(),q=item.body.GetRotation(),v=item.body.GetLinearVelocity(),w=item.body.GetAngularVelocity();
  const origin:V3=[p.GetX(),p.GetY(),p.GetZ()],rotation=[q.GetX(),q.GetY(),q.GetZ(),q.GetW()];
  const velocity:V3=[v.GetX(),v.GetY(),v.GetZ()],angular:V3=[w.GetX(),w.GetY(),w.GetZ()];
  const com=item.body.GetCenterOfMassPosition(),center:V3=[com.GetX(),com.GetY(),com.GetZ()];
  const peers=new Set<any>();
  for(const joint of this.jointNeighbors.get(item.id)??[]){if(joint.a===item)peers.add(joint.b?.body??this.bodyList[joint.groupB!]);else if(joint.b===item)peers.add(joint.a.body);}
  for(const pair of this.pendingCollisions.values()){if(pair.a===item.body)peers.add(pair.b);else if(pair.b===item.body)peers.add(pair.a);}
  const energy=chunks.reduce((sum,c)=>sum+.5*c.mass*c.kick.reduce((n,v)=>n+v*v,0),0);
  const kinetic=.5*(item.sourceMass??PARTS[piece.kind].mass)*velocity.reduce((n,v)=>n+v*v,0);
  // Stylized scatter spends at most 2% of the source kinetic energy, capped at 750 J.
  const kickScale=Math.sqrt(Math.min(750,kinetic*.02)/Math.max(energy,.001));
  const transfers=this.rebars.filter(link=>!link.broken&&(link.a===item||link.b===item)).map(link=>({link,pa:this.bodyWorldPoint(link.a,link.localA),pb:this.bodyWorldPoint(link.b,link.localB)}));
  this.removeRebars(item);
  // Keep the removed body's last pose alive for objective/history readers until reset.
  this.bodies.RemoveBody(item.body.GetID());this.removedBodies.add(item.body);item.fractured=true;if(item.kind==='fragment')this.fragments--;
  const created:DynamicItem[]=[];
  for(const chunk of chunks){
   const offset=rotateByQuaternion(chunk.center,rotation),position=origin.map((v,a)=>v+offset[a]) as V3;
   let shape:any;
   if(chunk.vertices){
    if(!J.ConvexHullShapeSettings)throw new Error('Jolt ConvexHullShapeSettings is required for polygon fracture');
    const points=chunk.vertices.map(vertex=>new J.Vec3(...vertex)),settings=new J.ConvexHullShapeSettings();
    for(const point of points)settings.mPoints.push_back(point);
    const created=settings.Create();if(!created.IsValid?.())throw new Error('Jolt rejected polygon fracture hull');
    shape=created.Get();shape.AddRef();J.destroy(created);J.destroy(settings);for(const point of points)J.destroy(point);
   }
   if(!shape){const half=new J.Vec3(...chunk.size.map(v=>v/2));shape=new J.BoxShape(half,.015);J.destroy(half);shape.AddRef();}
   const quat=new J.Quat(...rotation),body=this.makeBody(shape,position,quat,chunk.mass,false,true);J.destroy(quat);shape.Release();
   const r=position.map((v,a)=>v-center[a]),cross=[angular[1]*r[2]-angular[2]*r[1],angular[2]*r[0]-angular[0]*r[2],angular[0]*r[1]-angular[1]*r[0]];
   const linear=new J.Vec3(...velocity.map((v,a)=>v+cross[a]+chunk.kick[a]*kickScale));body.SetLinearVelocity(linear);J.destroy(linear);
   const spin=new J.Vec3(...angular);body.SetAngularVelocity(spin);J.destroy(spin);
   for(const peer of peers)if(peer&&!this.removedBodies.has(peer))this.restoreCollisionWhenSeparate(body,peer);
   const fragment:DynamicItem={id:this.allocateItemId(),kind:'fragment',body,initial:position,stress:0,concreteStrength:item.concreteStrength,reinforcement:item.reinforcement,size:chunk.size,vertices:chunk.vertices,finish:piece.finish,sourceKind:piece.kind,rootPieceId:item.rootPieceId??item.id,structural:chunk.structural,sourceMass:chunk.mass,protectedProjectile:item.protectedProjectile,fractureDepth:(item.fractureDepth??0)+1,bornAt:this.elapsed};this.items.push(fragment);created.push(fragment);this.fragments++;
  }
  const containing=(point:V3)=>{const local=this.bodyLocalPoint(item,point);return created.find((child,i)=>child.structural&&chunks[i].size.every((size,axis)=>Math.abs(local[axis]-chunks[i].center[axis])<=size*.5+.04));};
  for(const {j,points} of attachments){
   const groups=new Map<DynamicItem,V3[]>();for(const point of points){const child=containing(point);if(child){const list=groups.get(child)??[];list.push(point);groups.set(child,list);}}
   if(!groups.size){this.broken++;continue;}
   for(const [child,ports] of groups){const center=ports.reduce((sum,p)=>sum.map((v,i)=>v+p[i]/ports.length) as V3,[0,0,0] as V3);
    const a=j.a===item?child:j.a,b=j.b===item?child:j.b;
    this.join(a,b,center,ports,j.pinned,j.b?undefined:this.bodyList[j.groupB!]);
    const replacement=this.joints.at(-1)!;replacement.force=j.force*ports.length/points.length;replacement.torque=j.torque.map(v=>v*ports.length/points.length) as V3;
    for(let stage=0;stage<(j.damageStage??0);stage++)this.yieldJoint(replacement);
    const groupA=a.body.GetCollisionGroup().GetSubGroupID(),groupB=(b?.body??this.bodyList[j.groupB!]).GetCollisionGroup().GetSubGroupID();
    this.filter.DisableCollision(groupA,groupB);this.pendingCollisions.delete(groupA<groupB?`${groupA}:${groupB}`:`${groupB}:${groupA}`);
   }
  }
  for(const {j} of attachments){this.releaseFacadeClearance(j.a);if(j.b)this.releaseFacadeClearance(j.b);}
  if(REINFORCED_KINDS.has(piece.kind))this.createLocalRebars(created,chunks,origin,rotation);
  for(const {link,pa,pb} of transfers){const point=link.a===item?pa:pb;const nearest=created.reduce((best,c)=>Math.hypot(...c.initial.map((v,i)=>v-point[i]))<Math.hypot(...best.initial.map((v,i)=>v-point[i]))?c:best);const a=link.a===item?nearest:link.a,b=link.b===item?nearest:link.b;if(!a.fractured&&!b.fractured)this.createRebar(a,b,pa,pb,link.limit,link.strength,false);}

 }
 bodyWorldPoint(item:DynamicItem,local:V3):V3{const q=item.body.GetRotation(),offset=rotateByQuaternion(local,[q.GetX(),q.GetY(),q.GetZ(),q.GetW()]),p=item.body.GetPosition();return [p.GetX()+offset[0],p.GetY()+offset[1],p.GetZ()+offset[2]];}
 createRebar(a:DynamicItem,b:DynamicItem,pa:V3,pb:V3,limit:number,strength=140000,scaleMaterials=true){
  if(this.reinforcement(a)<=0||this.reinforcement(b)<=0)return;
  if(scaleMaterials){const factor=Math.min(this.reinforcement(a),this.reinforcement(b));limit*=factor;strength*=factor;}
  const J=this.J,settings=new J.DistanceConstraintSettings();settings.mPoint1.Set(...pa);settings.mPoint2.Set(...pb);settings.mMinDistance=0;settings.mMaxDistance=limit;
  const constraint=J.castObject(settings.Create(a.body,b.body),J.DistanceConstraint);this.system.AddConstraint(constraint);J.destroy(settings);
  const id=this.nextRebarId++,localA=this.bodyLocalPoint(a,pa),localB=this.bodyLocalPoint(b,pb);this.rebars.push({id,constraint,a,b,localA,localB,limit,strength,broken:false,overloadTime:0});(a.rebarLinks??=[]).push({id,to:b.id,localA,localB});
 }
 createLocalRebars(fragments:DynamicItem[],chunks:{center:V3;size:V3}[],origin:V3,rotation:number[]){
  // Only neighboring fracture faces are tied. Never run a slack link between
  // centers spanning the length of an otherwise intact beam.
  for(let a=0;a<chunks.length;a++)for(let b=a+1;b<chunks.length;b++){
   const left=chunks[a],right=chunks[b];
   for(let axis=0;axis<3;axis++){
    const gap=Math.abs(left.center[axis]-right.center[axis])-(left.size[axis]+right.size[axis])*.5;
    if(Math.abs(gap)>.04)continue;
    const others=[0,1,2].filter(i=>i!==axis),point:[number,number,number]=[0,0,0];let adjacent=true;
    for(const i of others){const lo=Math.max(left.center[i]-left.size[i]*.5,right.center[i]-right.size[i]*.5),hi=Math.min(left.center[i]+left.size[i]*.5,right.center[i]+right.size[i]*.5);if(hi-lo<.025){adjacent=false;break;}point[i]=(lo+hi)*.5;}
    if(!adjacent)continue;
    const direction=Math.sign(right.center[axis]-left.center[axis]);point[axis]=left.center[axis]+direction*left.size[axis]*.5;
    const offset=rotateByQuaternion(point,rotation),world=origin.map((v,i)=>v+offset[i]) as V3;
    this.createRebar(fragments[a],fragments[b],world,world,.12,140000,true);break;
   }
  }
 }
 updateRebars(dt:number){
  for(const link of this.rebars){if(link.broken)continue;const tension=Math.abs(link.constraint.GetTotalLambdaPosition())/dt,ratio=tension/link.strength;if(ratio>1)link.overloadTime+=dt*(ratio-1)*(ratio-1);else link.overloadTime=Math.max(0,link.overloadTime-dt*.7);if(link.overloadTime>.065)this.breakRebar(link);}
 }
 breakRebar(link:RebarLink){if(link.broken)return;this.system.RemoveConstraint(link.constraint);link.broken=true;link.a.rebarLinks=link.a.rebarLinks?.filter(row=>row.id!==link.id);}
 removeRebars(item:DynamicItem){for(const link of this.rebars)if(!link.broken&&(link.a===item||link.b===item))this.breakRebar(link);}
 buildingStatus(){
  const positions=new Map<number,V3>(),upright=new Map<number,boolean>(),blueprint=new Map(this.pieces.map(p=>[p.id,p]));
  for(const item of this.items){if(item.id<0)continue;const p=item.body.GetPosition(),q=item.body.GetRotation();positions.set(item.id,[p.GetX(),p.GetY(),p.GetZ()]);const initialYaw=(blueprint.get(item.id)?.rotation??0)*Math.PI/4;const aligned=Math.abs(q.GetY()*Math.sin(initialYaw)+q.GetW()*Math.cos(initialYaw))>=Math.cos(Math.PI/24);upright.set(item.id,!item.fractured&&aligned&&1-2*(q.GetX()*q.GetX()+q.GetZ()*q.GetZ())>=Math.cos(Math.PI/18));}
  const intact=this.joints.filter(j=>!j.broken);
  return evaluateBuilding(this.pieces,{minHeight:this.rules.minHeight??8,minFloorArea:this.rules.minFloorArea??32},{positions,upright,links:intact.filter(j=>j.b).map(j=>[j.a.id,j.b!.id] as [number,number]),anchors:intact.filter(j=>!j.b).map(j=>j.a.id)});
 }
 finish(pass:boolean,reason:string) { this.result=pass?'passed':'failed'; this.reason=reason; }
  dispose() { this.worldVehicles.dispose();this.attacker?.dispose();this.vehicle?.dispose();this.trees?.dispose();for(const j of this.joints)this.system.RemoveConstraint(j.constraint);for(const link of this.rebars)if(!link.broken)this.system.RemoveConstraint(link.constraint);this.rebars=[];for(const c of this.driveConstraints)this.system.RemoveConstraint(c);this.driveConstraints=[]; this.joints=[]; for(const b of this.bodyList){const id=b.GetID();if(!this.removedBodies.has(b))this.bodies.RemoveBody(id);this.bodies.DestroyBody(id)} this.bodyList=[]; this.filter.Release(); this.J.destroy(this.forceVector); this.J.destroy(this.world); }
}
