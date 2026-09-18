import { VehiclePhysics } from './vehicle-physics';
import { assertVehicleParts } from './vehicle-blueprint';
import { demoVehicleControls } from './demo-driving';
import type { VehiclePart } from './vehicle-blueprint';
import type { V3 } from './catalog';

export interface WorldVehicleSpec { id:number; parts:VehiclePart[]; position:V3; rotation:number; name:string }
export type WorldVehicleMode='parked'|'drive'|'attack';
export interface WorldVehicleState { id:number; name:string; parts:VehiclePart[]; position:V3; rotation:number; chassisId:number; mode:WorldVehicleMode; target?:V3; yaw:number; pitch:number }
type Entry={spec:WorldVehicleSpec;vehicle:VehiclePhysics;mode:WorldVehicleMode;target?:V3};

export class WorldVehicles {
 private entries=new Map<number,Entry>();
 constructor(private sim:any){}
 get states():WorldVehicleState[]{return [...this.entries.values()].map(e=>{const p=e.vehicle.chassis.GetPosition(),q=e.vehicle.chassis.GetRotation();return {id:e.spec.id,name:e.spec.name,parts:e.spec.parts,position:[p.GetX(),p.GetY(),p.GetZ()],rotation:Math.atan2(2*(q.GetX()*q.GetZ()+q.GetW()*q.GetY()),1-2*(q.GetY()*q.GetY()+q.GetX()*q.GetX())),chassisId:e.vehicle.chassisItem.id,mode:e.mode,target:e.target,yaw:e.vehicle.controls.yaw,pitch:e.vehicle.controls.pitch};});}
 spawn(spec:WorldVehicleSpec){this.validate(spec);if(this.entries.has(spec.id))throw new Error(`World vehicle ${spec.id} already exists`);this.reserve(spec);const vehicle=new VehiclePhysics(this.sim,spec.parts,spec.position,undefined,spec.rotation,spec.id);vehicle.controls={...vehicle.controls,brake:true};this.entries.set(spec.id,{spec:{...spec,parts:spec.parts.map(p=>({...p,p:[...p.p] as V3}))},vehicle,mode:'parked'});return this.states.find(s=>s.id===spec.id)!;}
 remove(id:number){const entry=this.entries.get(id);if(!entry)return false;entry.vehicle.dispose();this.entries.delete(id);return true;}
 replace(spec:WorldVehicleSpec){this.validate(spec);if(!this.entries.has(spec.id))return this.spawn(spec);const old=this.entries.get(spec.id)!;const needed=this.bodyCount(spec);const available=this.sim.bodyPool?.length??0;if(this.sim.bodyList.length-old.vehicle.parts.filter(p=>p.kind==='wheel').length-1+needed>8192+available)throw new Error('Physics body capacity reached');old.vehicle.dispose();this.entries.delete(spec.id);const vehicle=new VehiclePhysics(this.sim,spec.parts,spec.position,undefined,spec.rotation,spec.id);this.entries.set(spec.id,{spec,vehicle,mode:'parked'});return this.states.find(s=>s.id===spec.id)!;}
 setMode(id:number,mode:WorldVehicleMode,target?:V3){const entry=this.entries.get(id);if(!entry)throw new Error(`Unknown world vehicle ${id}`);if(mode==='drive')for(const [otherId,other] of this.entries)if(otherId!==id&&other.mode==='drive'){other.mode='parked';other.vehicle.controls={...other.vehicle.controls,throttle:0,steer:0,brake:true,fire:false};}entry.mode=mode;entry.target=target;return this.states.find(s=>s.id===id)!;}
 input(id:number,input:any){const entry=this.entries.get(id);if(!entry)throw new Error(`Unknown world vehicle ${id}`);if(entry.mode!=='drive')return false;entry.vehicle.controls={...entry.vehicle.controls,...input};return true;}
 step(dt:number){for(const entry of this.entries.values()){if(entry.mode==='parked')entry.vehicle.controls={...entry.vehicle.controls,throttle:0,steer:0,brake:true,fire:false};else if(entry.mode==='attack'){const p=entry.vehicle.chassis.GetPosition(),q=entry.vehicle.chassis.GetRotation(),target=entry.target??[0,3,0];entry.vehicle.controls=demoVehicleControls([p.GetX(),p.GetY(),p.GetZ()],[q.GetX(),q.GetY(),q.GetZ(),q.GetW()],target,this.sim.elapsed,25,target);}entry.vehicle.step(dt);}}
 afterStep(){for(const entry of this.entries.values())entry.vehicle.afterStep();}
 dispose(){for(const id of [...this.entries.keys()])this.remove(id);}
 private validate(spec:WorldVehicleSpec){if(!Number.isInteger(spec.id)||spec.id<=0)throw new Error('World vehicle id must be a positive integer');if(!Number.isFinite(spec.rotation)||spec.position.length!==3||spec.position.some(v=>!Number.isFinite(v)))throw new Error('Invalid world vehicle pose');assertVehicleParts(spec.parts);}
 private bodyCount(spec:WorldVehicleSpec){return 1+spec.parts.filter(p=>p.kind==='wheel').length;}
 private reserve(spec:WorldVehicleSpec){const count=this.bodyCount(spec);if(count>81)throw new Error('Invalid world vehicle parts');if(this.sim.bodyList.length+count>8192&&!this.sim.ensureBodyCapacity?.(count))throw new Error('Physics body capacity reached');}
}
