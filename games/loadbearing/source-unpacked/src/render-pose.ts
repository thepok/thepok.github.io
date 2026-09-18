type Vector={x:number;y:number;z:number;set:(x:number,y:number,z:number)=>any};
type Rotation={x:number;y:number;z:number;w:number;set:(x:number,y:number,z:number,w:number)=>any};
type Pose={at:number;x:number;y:number;z:number;qx:number;qy:number;qz:number;qw:number};
/** All bodies sample confirmed poses on one delayed clock; no speculative overshoot under physics load. */
export class RenderPoseBuffer{
 private poses:Pose[]=[];
 constructor(private teleportDistance=Infinity){}
 push(at:number,p:Vector,q:Rotation){
  const last=this.poses.at(-1);
  if(last&&Math.hypot(p.x-last.x,p.y-last.y,p.z-last.z)>this.teleportDistance)this.poses=[];
  if(last&&at<last.at)return;
  const same=this.poses.at(-1)?.at===at;
  // Reuse the oldest storage after warm-up: thousands of debris bodies do not
  // allocate a new history object for every physics packet.
  const pose=same?this.poses[this.poses.length-1]:this.poses.length===12?this.poses.shift()!:{at:0,x:0,y:0,z:0,qx:0,qy:0,qz:0,qw:1};
  pose.at=at;pose.x=p.x;pose.y=p.y;pose.z=p.z;pose.qx=q.x;pose.qy=q.y;pose.qz=q.z;pose.qw=q.w;
  if(!same)this.poses.push(pose);
 }
 sample(at:number,p:Vector,q:Rotation){
  const poses=this.poses;if(!poses.length)return;
  let a=poses[0],b=a;
  for(let i=1;i<poses.length;i++){b=poses[i];if(b.at>=at)break;a=b;}
  const t=a===b?0:Math.max(0,Math.min(1,(at-a.at)/(b.at-a.at)));
  p.set(a.x+(b.x-a.x)*t,a.y+(b.y-a.y)*t,a.z+(b.z-a.z)*t);
  let dot=a.qx*b.qx+a.qy*b.qy+a.qz*b.qz+a.qw*b.qw;const sign=dot<0?-1:1;dot=Math.min(1,Math.abs(dot));
  let wa=1-t,wb=t;if(dot<.9995){const angle=Math.acos(dot),sin=Math.sin(angle);wa=Math.sin((1-t)*angle)/sin;wb=Math.sin(t*angle)/sin;}
  const x=a.qx*wa+b.qx*wb*sign,y=a.qy*wa+b.qy*wb*sign,z=a.qz*wa+b.qz*wb*sign,w=a.qw*wa+b.qw*wb*sign,len=Math.hypot(x,y,z,w)||1;
  q.set(x/len,y/len,z/len,w/len);
 }
}
