import type { BuildingProjectileOptions } from './block-projectile';
import type { Piece, Scenario, V3 } from './catalog';
export interface SimulationView {
  items: any[]; pieces: Piece[]; scenario: Scenario; intensity: number; elapsed: number; duration: number;
  broken: number; maxStress: number; peakStress: number; physicsMs: number; rate: number; water: number; rocks: number; meteors: number; projectiles: number; fragments: number; fragmentLimit:number;
  result: 'passed'|'failed'|null; reason: string; sandboxHazards: Record<'wind'|'earthquake'|'flood'|'meteors'|'attack', boolean>;
  occupancy?: { tonnes:number; wave:number; count:number };
  hazardAge(kind:'wind'|'earthquake'|'flood'|'meteors'|'attack'): number;
  hazardActive(kind:'wind'|'earthquake'|'flood'|'meteors'|'attack'): boolean;
  setSandboxHazard(kind:'wind'|'earthquake'|'flood'|'meteors'|'attack', enabled:boolean): void;
  attachTrees(specs:any[]): void; setFragmentLimit(value:number):void; restart(hazards?:Partial<Record<'wind'|'earthquake'|'flood'|'meteors'|'attack',boolean>>):Promise<void>; buildingStatus(): any; launchProjectile(position:V3, velocity:V3, mass:number, radius:number, projectileType?:'solid'|'blocks'|'storey',recycle?:boolean,building?:BuildingProjectileOptions): any; step(): void; dispose(): void;
}
