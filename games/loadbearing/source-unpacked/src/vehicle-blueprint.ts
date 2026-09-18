import type {V3} from './catalog';
export const VEHICLE_SPAWN:V3=[0,0,20];
export const VEHICLE_SPAWN_CLEARANCE=16;
export type VehiclePartKind='frame'|'wheel'|'engine'|'cannon'|'armor';
export interface VehiclePart{id:number;kind:VehiclePartKind;p:V3}
export const VEHICLE_PARTS:Record<VehiclePartKind,{size:V3;mass:number;color:string}>={frame:{size:[.95,.24,.95],mass:180,color:'#416579'},wheel:{size:[.36,1.1,1.1],mass:85,color:'#26343c'},engine:{size:[.8,.65,.8],mass:400,color:'#bc783e'},cannon:{size:[.8,.5,.8],mass:800,color:'#385a6b'},armor:{size:[.95,.25,.95],mass:350,color:'#88b3c5'}};
const make=(rows:[VehiclePartKind,number,number,number][]):VehiclePart[]=>rows.map(([kind,x,y,z],i)=>({id:i+1,kind,p:[x,y,z]}));
const base:[VehiclePartKind,number,number,number][]=[['frame',0,.8,-1],['frame',0,.8,0],['frame',0,.8,1],['engine',0,1.8,1],['wheel',-1,.8,-1],['wheel',1,.8,-1],['wheel',-1,.8,1],['wheel',1,.8,1]];
export const VEHICLE_PRESETS=[{id:'buggy',name:'Scout · leichter Buggy',parts:make(base)},{id:'rammer',name:'Bison · gepanzerter Rammer',parts:make([...base,['frame',0,.8,-2],['armor',0,.8,-3],['armor',-1,.8,-2],['armor',1,.8,-2]])},{id:'cannon-truck',name:'Atlas · Kanonenwagen',parts:make([...base,['cannon',0,1.8,-1],['armor',0,1.8,0]])}];
export const DEFAULT_VEHICLE_PARTS=VEHICLE_PRESETS[2].parts;
export function validateVehicleParts(parts:VehiclePart[]):string[]{
 if(!Array.isArray(parts)||!parts.length||parts.length>80)return ['Baue ein Fahrzeug aus 1 bis 80 Teilen.'];
 const ids=new Set<number>(),positions=new Set<string>();
 for(const p of parts){if(!p||!VEHICLE_PARTS[p.kind]||!Number.isInteger(p.id)||ids.has(p.id)||!Array.isArray(p.p)||p.p.length!==3||p.p.some(v=>!Number.isFinite(v)||Math.abs(v)>10))return ['Ungültiger Fahrzeugbauplan.'];ids.add(p.id);const key=p.p.join(',');if(positions.has(key))return ['Bauteile dürfen nicht denselben Platz belegen.'];positions.add(key);}
 if(!parts.some(p=>p.kind==='frame'))return ['Mindestens ein Rahmenteil wird benötigt.'];if(!parts.some(p=>p.kind==='engine'))return ['Ein Motor fehlt.'];
 const wheels=parts.filter(p=>p.kind==='wheel');if(wheels.length<4||!wheels.some(p=>p.p[0]<0)||!wheels.some(p=>p.p[0]>0)||new Set(wheels.map(p=>p.p[2])).size<2)return ['Mindestens vier Räder: links und rechts an zwei Achsen.'];
 const connected=new Set([parts.find(p=>p.kind==='frame')!.id]);let changed=true;while(changed){changed=false;for(const p of parts)if(!connected.has(p.id)&&parts.some(other=>connected.has(other.id)&&Math.hypot(...p.p.map((v,i)=>v-other.p[i]))<=1.05)){connected.add(p.id);changed=true;}}
 if(connected.size!==parts.length)return ['Alle Teile müssen an benachbarte Teile anschließen (1 m Raster).'];return [];
}
export const validateVehicle=(parts:VehiclePart[])=>validateVehicleParts(parts).join(' ');
export function assertVehicleParts(parts:VehiclePart[]){const error=validateVehicle(parts);if(error)throw new Error(error);}

/** Only directly adjoining engine blocks combine into one power unit. */
export function vehiclePower(parts:VehiclePart[]){
 const engines=parts.filter(p=>p.kind==='engine'),visited=new Set<number>();let connected=0;
 for(const engine of engines){if(visited.has(engine.id))continue;const queue=[engine];visited.add(engine.id);
  for(let i=0;i<queue.length;i++)for(const next of engines)if(!visited.has(next.id)&&Math.hypot(...next.p.map((n,a)=>n-queue[i].p[a]))<=1.05){visited.add(next.id);queue.push(next);}
  connected=Math.max(connected,queue.length);
 }
 const count=Math.max(1,connected);
 return {engines:engines.length,connected,torque:2400*(1+.2*(count-1)),wheelSpeed:24*(1+.35*Math.log2(count))};
}
