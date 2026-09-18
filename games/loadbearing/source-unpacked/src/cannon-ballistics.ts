import type { V3 } from './catalog';
import { rotateByQuaternion } from './fracture';

export const CANNON_BALLISTICS={speed:110,mass:900,radius:.3,linearDamping:.08,gravity:9.81};
export function cannonLaunch(local:V3,position:V3,rotation:number[],vehicleVelocity:V3,yaw:number,pitch:number){
 const direction=rotateByQuaternion([-Math.sin(yaw)*Math.cos(pitch),Math.sin(pitch),-Math.cos(yaw)*Math.cos(pitch)],rotation),offset=rotateByQuaternion(local,rotation);
 const muzzle=position.map((v,i)=>v+offset[i]+direction[i]*2.1+(i===1?.23:0)) as V3;
 const velocity=direction.map((v,i)=>v*CANNON_BALLISTICS.speed+vehicleVelocity[i]) as V3;
 return {muzzle,velocity,direction};
}
/** Free-flight prediction. The visible arc never snaps to scene intersections. */
export function cannonTrajectory(muzzle:V3,velocity:V3,output:Float32Array){
 const p=[...muzzle],v=[...velocity],dt=1/120,drag=1-CANNON_BALLISTICS.linearDamping*dt;let count=1;output.set(p,0);
 for(let step=1;step<=960&&count<output.length/3;step++){
  v[1]-=CANNON_BALLISTICS.gravity*dt;for(let axis=0;axis<3;axis++){v[axis]*=drag;p[axis]+=v[axis]*dt;}
  if(p[1]<=CANNON_BALLISTICS.radius){p[1]=CANNON_BALLISTICS.radius;output.set(p,count++*3);break;}
  if(step%4===0)output.set(p,count++*3);
 }
 return count;
}
