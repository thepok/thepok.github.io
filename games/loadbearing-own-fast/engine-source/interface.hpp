#pragma once
API int kinetic_version(){return 100;}
API int error(){return errorCode;}
API int scratch_ptr(){return int((u32)(unsigned long)scratch);}
API int body_ptr(int i){return int((u32)(unsigned long)bodies[i].out);}
API int joint_ptr(int i){return int((u32)(unsigned long)joints[i].out);}
API int shape_new(float cx,float cy,float cz){if(sCount>=MAX_S){errorCode=3;return -1;}int i=sCount++;shapes[i]={};shapes[i].start=pCount;shapes[i].center={cx,cy,cz};for(int k=0;k<9;k++)shapes[i].unitI.a[k]=scratch[k];return i;}
API int shape_primitive(int shape,int kind,int geometry,float cx,float cy,float cz,float qx,float qy,float qz,float qw,float hx,float hy,float hz){if(pCount>=MAX_P){errorCode=4;return -1;}if(shapes[shape].start+shapes[shape].count!=pCount){errorCode=4;return -1;}Prim&p=prims[pCount++];p.kind=kind;p.g=geometry;p.c={cx,cy,cz};p.q={qx,qy,qz,qw};p.h={hx,hy,hz};shapes[shape].count++;return pCount-1;}
API int geom_new(){if(gCount>=MAX_G){errorCode=5;return -1;}return gCount++;}
API int geom_vertex(int g,float x,float y,float z){Geometry&h=geometries[g];if(h.nv>=40){errorCode=5;return -1;}h.vertices[h.nv++]={x,y,z};return 0;}
API int geom_face(int g,float x,float y,float z,float d){Geometry&h=geometries[g];if(h.nf>=48){errorCode=5;return -1;}h.normals[h.nf]={x,y,z};h.ds[h.nf++]=d;return 0;}
API int geom_edge(int g,float x,float y,float z){Geometry&h=geometries[g];if(h.ne>=64){errorCode=5;return -1;}h.edges[h.ne++]={x,y,z};return 0;}
API int body_new(int shape,float x,float y,float z,float qx,float qy,float qz,float qw,float mass,int motion,int group,int filter,int layer){int id=-1;for(int i=0;i<bCount;i++)if(!bodies[i].exists){id=i;break;}if(id<0){if(bCount==MAX_B){errorCode=1;return -1;}id=bCount++;}int gen=bodies[id].generation+1;bodies[id]=Body{};Body&b=bodies[id];b.exists=1;b.shape=shape;b.mass=mass;b.motion=motion;b.group=group;b.filter=filter;b.layer=layer;b.generation=gen;b.invMass=motion==2&&mass>0?1/mass:0;b.q=norm({qx,qy,qz,qw});b.p=V(x,y,z)+rot(b.q,shapes[shape].center);b.localI=shapes[shape].unitI*maxf(mass,.001f);b.localInvI=inverse(b.localI);for(int i=0;i<MAX_B;i++){u32 a=u32(id)*MAX_B+i,c=u32(i)*MAX_B+id;disabled[a>>5]&=~(1u<<(a&31));disabled[c>>5]&=~(1u<<(c&31));}updateBody(id);bounds(id);return id;}
API void body_added(int i,int added){bodies[i].added=added;wake(i);updateBody(i);}
API void body_destroy(int i){bodies[i].exists=0;bodies[i].added=0;bodies[i].generation++;}
API void body_mass(int i,float mass){Body&b=bodies[i];b.mass=maxf(mass,.001f);b.invMass=b.motion==2?1/b.mass:0;b.localI=shapes[b.shape].unitI*b.mass;b.localInvI=inverse(b.localI);b.tensorValid=0;updateBody(i);}
API void body_shape(int i,int shape){Body&b=bodies[i];V origin(b.out[0],b.out[1],b.out[2]);b.shape=shape;b.p=origin+rot(b.q,shapes[shape].center);body_mass(i,b.mass);bounds(i);wake(i);}
API void body_pose(int i,float x,float y,float z,float qx,float qy,float qz,float qw,int activate){Body&b=bodies[i];b.q=norm({qx,qy,qz,qw});b.p=V(x,y,z)+rot(b.q,shapes[b.shape].center);if(activate)wake(i);updateBody(i);bounds(i);}
API void body_velocity(int i,float x,float y,float z,int angular){if(angular)bodies[i].w={x,y,z};else bodies[i].v={x,y,z};if(x||y||z)wake(i);updateBody(i);}
API void body_force(int i,float x,float y,float z,int angular){Body&b=bodies[i];if(angular)b.torque+=V(x,y,z);else b.force+=V(x,y,z);if(x||y||z)wake(i);}
API void body_impulse(int i,float x,float y,float z,float px,float py,float pz,int point){Body&b=bodies[i];applyImpulse(b,{x,y,z},point?V(px,py,pz)-b.p:V());wake(i);updateBody(i);}
API void body_option(int i,int opt,float value){Body&b=bodies[i];if(opt==0)b.friction=value;else if(opt==1)b.restitution=value;else if(opt==2)b.linearDamping=value;else if(opt==3)b.angularDamping=value;else if(opt==4){b.canSleep=value!=0;if(!b.canSleep)wake(i);}else if(opt==5)b.gravityFactor=value;else if(opt==6)b.ccd=value!=0;else if(opt==7){b.motion=int(value);b.invMass=b.motion==2&&b.mass>0?1/b.mass:0;wake(i);}else if(opt==8)b.force={};else if(opt==9)b.torque={};else if(opt==10)wake(i);else if(opt==11){b.active=0;b.v={};b.w={};}updateBody(i);}
API void collision_filter(int a,int b,int disable){u32 aa=u32(a)*MAX_B+b,bb=u32(b)*MAX_B+a;if(disable){disabled[aa>>5]|=1u<<(aa&31);disabled[bb>>5]|=1u<<(bb&31);}else{disabled[aa>>5]&=~(1u<<(aa&31));disabled[bb>>5]&=~(1u<<(bb&31));}}
API int joint_new(int a,int b,int kind,float x1,float y1,float z1,float x2,float y2,float z2){int id=-1;for(int i=0;i<jCount;i++)if(!joints[i].allocated){id=i;break;}if(id<0){if(jCount==MAX_J){errorCode=2;return -1;}id=jCount++;}Joint&j=joints[id];j=Joint{};j.allocated=1;j.enabled=0;j.a=a;j.b=b;j.kind=kind;Body&A=bodies[a],&B=bodies[b];j.la=rot(conj(A.q),V(x1,y1,z1)-A.p);j.lb=rot(conj(B.q),V(x2,y2,z2)-B.p);j.qa=conj(A.q);j.qb=conj(B.q);return id;}
API void joint_enable(int id,int enabled){Joint&j=joints[id];j.enabled=enabled;wake(j.a);wake(j.b);if(!enabled){j.impulse={};j.angularImpulse={};j.distanceImpulse=0;}}
API void joint_remove(int id){joint_enable(id,0);joints[id].allocated=0;}
API void joint_limits(int id,float lx,float ly,float lz,float hx,float hy,float hz){joints[id].low={lx,ly,lz};joints[id].high={hx,hy,hz};}
API void joint_friction(int id,int axis,float val){if(axis>=3&&axis<=5)joints[id].friction[axis-3]=val;}
API void joint_distance(int id,float lo,float hi){joints[id].minDist=lo;joints[id].maxDist=hi;}
API void joint_hinge(int id,float ax,float ay,float az,float bx,float by,float bz,float minTorque,float maxTorque){Joint&j=joints[id];j.axisA=rot(conj(bodies[j.a].q),unit({ax,ay,az}));j.axisB=rot(conj(bodies[j.b].q),unit({bx,by,bz}));j.motorMin=minTorque;j.motorMax=maxTorque;}
API void joint_motor(int id,int state,float target){joints[id].motorState=state;joints[id].motorTarget=target;}
API void set_gravity(float x,float y,float z){gravity={x,y,z};}
API void set_iterations(int v,int p){vIterations=v;pIterations=p;}

// Preserve 120 Hz for startup, high-precision small scenes and driven hinges.
// Large ordinary worlds use 60 Hz; this is an explicit quality/performance tradeoff.
// No body, collision shape, constraint or debris record is removed by this policy.
static bool needsFineStep(float dt){if(vIterations>16||pIterations>4)return true;for(int i=0;i<jCount;i++)if(joints[i].enabled&&joints[i].kind==3&&joints[i].motorState)return true;return false;}
API int step(float dt){
 if(!(dt>0&&dt<=.1f))return -1;
 for(int i=0;i<jCount;i++)for(float &v:joints[i].out)v=0;
 bool fine=needsFineStep(minf(dt,1.f/60));
 int sub=int(__builtin_ceilf(dt*(fine?120.f:60.f)-1e-5f));if(sub<1)sub=1;
 for(int i=0;i<sub;i++){substep(dt/sub);if(errorCode)return errorCode;}
 for(int i=0;i<bCount;i++){bodies[i].force={};bodies[i].torque={};}return errorCode;
}
API int substeps_total(){return tickNo;}
API int optimization_version(){return 200;}
API int were_contact(int a,int b){for(int i=0;i<touchCount;i++)if((touchesA[i]==a&&touchesB[i]==b)||(touchesA[i]==b&&touchesB[i]==a))return 1;return 0;}
// Closest ray hit against complete compound geometry. scratch: fraction,id,normal.
API int raycast(float ox,float oy,float oz,float dx,float dy,float dz){V origin(ox,oy,oz),direction(dx,dy,dz);float best=1;int body=-1;V normal;for(int i=0;i<bCount;i++){Body&b=bodies[i];if(!b.exists||!b.added)continue;Shape&s=shapes[b.shape];for(int p=0;p<s.count;p++){WorldPrim w=wp(i,p);V from=rot(conj(w.q),origin-w.c),d=rot(conj(w.q),direction),n;float near=0,far=best;if(w.p->kind==1){float A=len2(d),B=dot(from,d),C=len2(from)-w.h.x*w.h.x,disc=B*B-A*C;if(A<=0||disc<0)continue;near=(-B-sqrtf_(disc))/A;if(near<0)near=0;if(near>best)continue;n=unit(from+d*near);}else{int nf=w.p->kind==0?6:geometries[w.p->g].nf;bool miss=false;for(int f=0;f<nf;f++){V nn;float plane;if(w.p->kind==0){nn[f/2]=(f&1)?-1:1;plane=w.h[f/2];}else{nn=geometries[w.p->g].normals[f];plane=geometries[w.p->g].ds[f];}float sep=plane-dot(nn,from),dd=dot(nn,d);if(absf(dd)<1e-12f){if(sep<0){miss=true;break;}continue;}float t=sep/dd;if(dd<0){if(t>near){near=t;n=nn;}}else far=minf(far,t);if(near>far){miss=true;break;}}if(miss||near<0||near>best)continue;}best=near;body=i;normal=rot(w.q,n);}}
 scratch[0]=best;scratch[1]=body;scratch[2]=normal.x;scratch[3]=normal.y;scratch[4]=normal.z;return body;}
API int counts(int what){return what==0?bCount:what==1?jCount:what==2?cCount:what==3?sCount:pCount;}
// State snapshots are serialized by the compatibility facade; the kernel has no heap-owned references.
API int state_start(){return int((u32)(unsigned long)bodies);}
API int state_size(){return sizeof(bodies);}
API int joints_start(){return int((u32)(unsigned long)joints);}
API int joints_size(){return sizeof(joints);}
// Capsule movement shares the exact same compound shapes and reaction impulses.
// The segment/convex closest point is minimized in 1D; no collision-only storey boxes.
static float capsuleDistance(const WorldPrim&w,V feet,float radius,float half,V&n,V&point){V bottom=feet+V(0,radius,0),top=bottom+V(0,2*half,0);float best=1e30f;V center=bottom;auto test=[&](float t){V p=bottom+(top-bottom)*t,normal,closest;float d;if(w.p->kind==1){normal=unit(p-w.c);d=len(p-w.c)-w.h.x;closest=w.c+normal*w.h.x;}else closest=closestPoly(w,p,normal,d);if(d<best){best=d;n=normal;point=closest;center=p;}return d;};
 float lo=0,hi=1;test(0);test(1);for(int i=0;i<14;i++){float a=(2*lo+hi)/3,b=(lo+2*hi)/3;float da=test(a),db=test(b);if(da<db)hi=b;else lo=a;}return best-radius;
}
static bool capsuleClear(V feet,float radius,float half){V lo=feet-V(radius,0,radius),hi=feet+V(radius,2*(half+radius),radius);for(int i=0;i<bCount;i++){Body&b=bodies[i];if(!b.exists||!b.added||!aabb(lo,hi,b.lo,b.hi))continue;Shape&s=shapes[b.shape];for(int k=0;k<s.count;k++){WorldPrim w=wp(i,k);if(!aabb(lo,hi,w.lo,w.hi))continue;V n,p;if(capsuleDistance(w,feet,radius,half,n,p)<-.008f)return false;}}return true;}
API int character_move(float px,float py,float pz,float vx,float vy,float vz,float dt,float radius,float half,float stair,int wasGrounded,float mass){V feet(px,py,pz),v(vx,vy,vz);int grounded=0,groundID=-1;int sub=4;float h=dt/sub;for(int st=0;st<sub;st++){V before=feet;feet+=v*h;for(int it=0;it<5;it++){bool changed=false;V lo=feet-V(radius,.025f,radius),hi=feet+V(radius,2*(half+radius),radius);for(int i=0;i<bCount;i++){Body&body=bodies[i];if(!body.exists||!body.added||!aabb(lo,hi,body.lo,body.hi))continue;Shape&s=shapes[body.shape];for(int k=0;k<s.count;k++){WorldPrim w=wp(i,k);if(!aabb(lo,hi,w.lo,w.hi))continue;V n,p;float d=capsuleDistance(w,feet,radius,half,n,p);if(d>.012f)continue;if(n.y>.5f&&v.y<=pointV(body,p-body.p).y+.2f){grounded=1;groundID=i;}if(d<0){
 if(absf(n.y)<.25f&&(wasGrounded||grounded)&&v.y<=.2f&&stair>0&&w.hi.y-before.y<=stair+.015f){V raised=feet;raised.y=w.hi.y+.003f;if(capsuleClear(raised,radius,half)){feet=raised;grounded=1;groundID=i;changed=true;continue;}}
 feet+=n*minf(.3f,-d+.001f);V surface=pointV(body,p-body.p);float vn=dot(v-surface,n);if(vn<0){v-=n*vn;if(body.invMass>0){float impulse=minf(1000*h,mass*(-vn));applyImpulse(body,-n*impulse,p-body.p);wake(i);updateBody(i);}}changed=true;
 }}}if(!changed)break;}}
 if(!grounded&&wasGrounded&&v.y<=.2f){int hit=raycast(feet.x,feet.y+.04f,feet.z,0,-.34f,0);if(hit>=0&&scratch[3]>.5f){feet.y=feet.y+.04f-.34f*scratch[0]+.001f;grounded=1;groundID=hit;v.y=pointV(bodies[hit],feet-bodies[hit].p).y;}}
 scratch[0]=feet.x;scratch[1]=feet.y;scratch[2]=feet.z;scratch[3]=v.x;scratch[4]=v.y;scratch[5]=v.z;scratch[6]=grounded;scratch[7]=groundID;return grounded;
}
// No libc dependency. LLVM emits bulk-memory instructions from these loops.
extern "C" void *memset(void *ptr,int value,unsigned long count){volatile unsigned char*p=(volatile unsigned char*)ptr;for(unsigned long i=0;i<count;i++)p[i]=(unsigned char)value;return ptr;}
extern "C" void *memcpy(void *dest,const void *source,unsigned long count){volatile unsigned char*d=(volatile unsigned char*)dest;const volatile unsigned char*s=(const volatile unsigned char*)source;for(unsigned long i=0;i<count;i++)d[i]=s[i];return dest;}

API int contact_debug(int index){if(index<0||index>=cCount)return 0;Contact&c=contacts[index];scratch[0]=c.a;scratch[1]=c.b;scratch[2]=c.depth;for(int i=0;i<3;i++){scratch[3+i]=c.n[i];scratch[6+i]=c.p[i];}return 1;}

API void set_weld_frequency(float f){weldFrequency=f;}

API void set_weld_params(float beta,float alpha){weldBeta=beta;weldAlpha=alpha;}

// Reclaim unreferenced shape storage between steps. Retired bodies still keep
// their shapes until the game's existing body pool reuses or destroys them.
API void compact_shapes(){
 static int usedS[MAX_S],remapS[MAX_S],usedG[MAX_G],remapG[MAX_G];
 for(int i=0;i<sCount;i++)usedS[i]=0;
 for(int i=0;i<bCount;i++)if(bodies[i].exists)usedS[bodies[i].shape]=1;
 int ns=0,np=0;
 for(int i=0;i<sCount;i++)if(usedS[i]){Shape old=shapes[i];remapS[i]=ns;shapes[ns]=old;shapes[ns].start=np;
  for(int j=0;j<old.count;j++)prims[np++]=prims[old.start+j];ns++;}
 for(int i=0;i<bCount;i++)if(bodies[i].exists)bodies[i].shape=remapS[bodies[i].shape];
 sCount=ns;pCount=np;
 for(int i=0;i<gCount;i++)usedG[i]=0;
 for(int i=0;i<pCount;i++)if(prims[i].g>=0)usedG[prims[i].g]=1;
 int ng=0;for(int i=0;i<gCount;i++)if(usedG[i]){remapG[i]=ng;geometries[ng++]=geometries[i];}
 for(int i=0;i<pCount;i++)if(prims[i].g>=0)prims[i].g=remapG[prims[i].g];gCount=ng;
}
API int geometry_count(){return gCount;}
