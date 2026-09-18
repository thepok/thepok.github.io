import type { BuildingProjectileOptions } from './block-projectile';
import type { Piece, Scenario, V3 } from './catalog';
import type { WorldVehicleSpec, WorldVehicleState } from './world-vehicles';
import type { ConcreteValues } from './physics';
export type Hazard = 'wind'|'earthquake'|'flood'|'meteors'|'attack';
export const POSE_STRIDE = 14; // position, quaternion, linear velocity, active, angular velocity
export type WorkerCommand =
 | { type:'init'; pieces:Piece[]; scenario:Scenario; intensity:number; rules:any; threads:number }
 | { type:'snapshot-consumed'; seq:number }
 | { type:'walker'; spawn:V3|null }
 | { type:'walker-input'; input:any }
 | { type:'vehicle-input'; input:any }
 | { type:'world-vehicle-spawn'; requestId:number; spec:WorldVehicleSpec }
 | { type:'world-vehicle-remove'; requestId:number; id:number }
 | { type:'world-vehicle-replace'; requestId:number; spec:WorldVehicleSpec }
 | { type:'world-vehicle-mode'; id:number; mode:WorldVehicleState['mode']; target?:V3 }
 | { type:'world-vehicle-input'; id:number; input:any }
 | { type:'world-pieces-edit'; requestId:number; add:Piece[]; remove:number[] }
 | { type:'concrete-update'; requestId:number; ids:number[]; values:ConcreteValues }
 | { type:'pause'; value:boolean } | { type:'speed'; value:number } | { type:'hazard'; kind:Hazard; enabled:boolean }
 | { type:'trees'; specs:any[] } | { type:'projectile'; position:V3; velocity:V3; mass:number; radius:number; projectileType?:'solid'|'blocks'|'storey'; recycle?:boolean; building?:BuildingProjectileOptions } | { type:'fragment-limit'; value:number }
 | { type:'volley'; shots:{position:V3;velocity:V3}[]; mass:number; radius:number; projectileType:'solid'|'blocks'|'storey'; recycle:boolean; building?:BuildingProjectileOptions }
 | { type:'restart'; requestId:number; hazards?:Partial<Record<Hazard,boolean>> } | { type:'stop' };
