"""Finish coarse-step ground collision handling, preserving the frozen reference."""
from pathlib import Path
import hashlib,sys
root=Path(sys.argv[1])
assert hashlib.sha256((root/'src/own-engine/kernel.wasm').read_bytes()).hexdigest()=='f81ef353179dbb726c388f586e609293cb14f0f2d119579769b22f0058a36ad5'
def replace(path,old,new):
 p=root/path;s=p.read_text();assert s.count(old)==1,(path,old[:80],s.count(old));p.write_text(s.replace(old,new))
p=root/'src/own-engine/constraints.hpp';s=p.read_text();s+='''
// Time-of-impact motion clamp for COMPLETE crossings of a broad static floor.
// A body that came from above cannot escape to the other side. Bodies already
// below a raised platform, outside its face, or collision-filtered are untouched.
static float floorStartHi[MAX_B];static unsigned floorClamps=0;
static void clampFloorCrossings(){
 for(int b=0;b<bCount;b++){
  Body&B=bodies[b];if(!B.exists||!B.added||B.motion!=0)continue;
  Shape&bs=shapes[B.shape];if(bs.count!=1)continue;WorldPrim floor=wp(b,0);
  if(floor.p->kind!=0||floor.h.x<10||floor.h.z<10||absf(floor.axis[1].y)<.99999f)continue;
  const float top=floor.c.y+floor.h.y;
  for(int a=0;a<bCount;a++){
   Body&A=bodies[a];if(!A.exists||!A.added||A.motion!=2||!A.active||A.hi.y>=top||floorStartHi[a]<top-.012f||isDisabled(a,b))continue;
   if(A.lo.x<floor.lo.x+.01f||A.hi.x>floor.hi.x-.01f||A.lo.z<floor.lo.z+.01f||A.hi.z>floor.hi.z-.01f)continue;
   const float lift=top+.002f-A.lo.y;A.p.y+=lift;floorClamps++;
   Shape&as=shapes[A.shape];V supportPoints[4];int count=0;
   // Use actual lowest vertices as contact lever arms, never distant floor corners.
   for(int k=0;k<as.count&&count<4;k++){
    WorldPrim w=wp(a,k);V points[40];int n;
    if(w.p->kind==1){points[0]=w.c-V(0,w.h.x,0);n=1;}else n=verts(w,points);
    for(int i=0;i<n&&count<4;i++)if(points[i].y<=top+.006f)supportPoints[count++]=points[i];
   }
   if(!count)supportPoints[count++]=V(A.p.x,top,A.p.z);
   for(int pass=0;pass<4;pass++)for(int i=0;i<count;i++){
    V r=supportPoints[i]-A.p,n(0,1,0);float vn=pointV(A,r).y;
    if(vn<0){float den=A.invMass+dot(n,cross(mv(A.invI,cross(r,n)),r));if(den>1e-12f)applyImpulse(A,n*(-vn/den),r);}
   }
   wake(a);updateBody(a);bounds(a);
  }
 }
}
API unsigned floor_clamps(){return floorClamps;}
''';p.write_text(s)
replace('src/own-engine/projection.hpp','static void substep(float dt){tickNo++;touchCount=0;','static void substep(float dt){tickNo++;touchCount=0;for(int i=0;i<bCount;i++)floorStartHi[i]=bodies[i].hi.y;')
replace('src/own-engine/projection.hpp','updateBody(i);bounds(i);}lastDt=dt;','updateBody(i);bounds(i);}clampFloorCrossings();lastDt=dt;')
p=root/'src/own-engine/collisions.hpp';s=p.read_text();where='static void collidePrims(const WorldPrim&a,const WorldPrim&b){'
fast='''// Specialize the convex/top-face case only when its deepest vertex has at
// least that penetration distance to EVERY other box face. The top plane is
// then the minimum separating feature; no general SAT projection is necessary.
static bool convexFloor(const WorldPrim&w,const WorldPrim&floor,bool floorFirst){
 if(w.p->kind!=2||floor.p->kind!=0||bodies[floor.body].motion!=0||floor.h.x<10||floor.h.z<10)return false;
 if(absf(floor.axis[0].x)<.99999f||absf(floor.axis[1].y)<.99999f||absf(floor.axis[2].z)<.99999f)return false;
 if(w.lo.x<floor.lo.x+.05f||w.hi.x>floor.hi.x-.05f||w.lo.z<floor.lo.z+.05f||w.hi.z>floor.hi.z-.05f||w.c.y<floor.c.y)return false;
 V local[40];auto*g=getWorldGeometry(w);V*vs=g?g->av:local;int nv=g?g->nv:verts(w,vs);
 float low=1e30f;for(int i=0;i<nv;i++)low=minf(low,vs[i].y);
 const float top=floor.hi.y,depth=top-low;
 if(low<floor.lo.y+.025f)return false;
 if(depth<-.012f)return true;
 const float clearance=minf(minf(w.lo.x-floor.lo.x,floor.hi.x-w.hi.x),minf(w.lo.z-floor.lo.z,floor.hi.z-w.hi.z));
 if(clearance<maxf(0,depth)+.025f||low-floor.lo.y<depth+.025f)return false;
 V points[40];int count=0;for(int i=0;i<nv;i++)if(absf(vs[i].y-low)<.02f&&vs[i].y<=top+.025f)points[count++]=vs[i]+V(0,depth*.5f,0);
 if(!count)return false;
 int chosen[4]={0,-1,-1,-1},n=1;
 while(n<4&&n<count){float far=-1;int pick=-1;for(int i=0;i<count;i++){float d=1e30f;bool used=false;for(int j=0;j<n;j++){if(i==chosen[j])used=true;d=minf(d,len2(points[i]-points[chosen[j]]));}if(!used&&d>far){far=d;pick=i;}}if(pick<0||far<.0001f)break;chosen[n++]=pick;}
 for(int i=0;i<n;i++){if(floorFirst)contact(floor.body,w.body,floor.index,w.index,points[chosen[i]],V(0,1,0),depth);else contact(w.body,floor.body,w.index,floor.index,points[chosen[i]],V(0,-1,0),depth);}
 return true;
}
'''
assert s.count(where)==1;s=s.replace(where,fast+where);old=where+'if(!aabb(a.lo,a.hi,b.lo,b.hi))return;';assert s.count(old)==1;s=s.replace(old,old+'if(convexFloor(a,b,false)||convexFloor(b,a,true))return;');p.write_text(s)
replace('src/benchmark/suite.ts','private initialSubsteps:number;','private initialSubsteps:number;private initialFloorClamps=0;')
replace('src/benchmark/suite.ts','if(this.tick===0)this.initialSubsteps=this.sim.world.k?.substeps_total?.()??0;','if(this.tick===0){this.initialSubsteps=this.sim.world.k?.substeps_total?.()??0;this.initialFloorClamps=this.sim.world.k?.floor_clamps?.()??0;}')
replace('src/benchmark/suite.ts','stats:statistics(all),phases:','floorMotionClamps:(this.sim.world.k?.floor_clamps?.()??0)-this.initialFloorClamps,stats:statistics(all),phases:')
replace('src/benchmark/suite.ts','ground:b.final.minY>=Math.min(-1,a.final.minY-1),','ground:b.final.minY>=Math.min(-1,a.final.minY-1)&&b.traces.every((t,i)=>t.minY>=Math.min(-1,a.traces[i].minY-1)),')
replace('tests/speed-browser.mjs','assert.ok(live.final.meanHeight<10);',"assert.ok(live.final.meanHeight<10);assert.ok(live.traces.every(t=>t.minY>=-1),'A live-scene fragment crossed the ground');assert.ok(live.final.maxSpeed<25,'Unbounded residual debris velocity');")
print('Added guarded convex-floor fast path, complete-crossing motion clamp and strict live-ground gates.')
