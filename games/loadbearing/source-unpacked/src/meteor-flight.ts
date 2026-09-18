import type { V3 } from './catalog';

export const METEOR_MASS_FACTOR = 1.5;
export function meteorRandom(index:number,salt:number){
 const value=Math.sin((index+1)*127.1+salt*311.7)*43758.5453;
 return value-Math.floor(value);
}

/** Aim an incoming ballistic arc at a live building part, from any compass direction. */
export function meteorFlight(index:number,target:V3,top:number,intensity:number){
 const random=(salt:number)=>meteorRandom(index,salt);
 const azimuth=random(3)*Math.PI*2,elevation=.3+random(4)*1.12;
 const oldVx=5+random(3)*5,oldVz=3+random(4)*5;
 const speed=Math.sqrt(oldVx**2+oldVz**2+(29+4*intensity)**2+2*9.81*Math.max(0,top+30-target[1]));
 const flightTime=1, horizontal=Math.cos(elevation)*speed;
 const impact:V3=[Math.cos(azimuth)*horizontal,-Math.sin(elevation)*speed,Math.sin(azimuth)*horizontal];
 const velocity:V3=[impact[0],impact[1]+9.81*flightTime,impact[2]];
 const position:V3=[target[0]-impact[0]*flightTime,target[1]-impact[1]*flightTime-4.905*flightTime**2,target[2]-impact[2]*flightTime];
 return {position,velocity,impact,flightTime};
}
