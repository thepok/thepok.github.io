#pragma once
static float weldFrequency=0.f,weldBeta=.05f,weldAlpha=.005f;
static int cgEnabled=0;
static int errorCode=0; // 1 bodies,2 joints,3 shapes,4 primitives,5 geometry,6 contacts,7 invalid numeric
struct Geometry {int nv=0,nf=0,ne=0;V vertices[40];V normals[48];float ds[48];V edges[64];};
struct Prim {int kind=0,g=-1;V c,h;Q q;}; // 0 box,1 sphere,2 convex
struct Shape {int start=0,count=0;V center;M unitI;float radius=0;};
struct Body {
 float out[32]{}; // Stable JS read-only ABI, see compatibility.mjs.
 V p,v,w,force,torque;Q q;M localI,localInvI,invI,worldI;V lo,hi;
 int exists=0,added=0,motion=0,shape=-1,group=0,filter=0,layer=0,generation=0;
 float mass=0,invMass=0,friction=.55f,restitution=.03f,linearDamping=.08f,angularDamping=.14f,gravityFactor=1,sleepTime=0;
 int active=1,canSleep=1,ccd=0;V beforeV;Q tensorQ;float tensorMass=-1;int tensorValid=0;
};
struct Joint {float out[8]{};int allocated=0,enabled=0,a=0,b=0,kind=0;V la,lb;Q qa,qb;V low,high,friction;V axisA,axisB;float minDist=0,maxDist=0,motorTarget=0,motorMin=0,motorMax=0;int motorState=0;
 V impulse,angularImpulse,ra,rb,bias,angularBias,n;M linearMass,angularMass;float distanceImpulse=0,motorImpulse=0,distanceMass=0;int active=0,limited=0;float angularInv[3]{};V axes[3];V velocityAngleError,velocityAngularDenominator;float pairInvTotal=0,pairFractionA=0,pairFractionB=0;
};
struct Contact {int a,b;V p,n,t1,t2,ra,rb,localA,localB,angularNA,angularNB,angular1A,angular1B,angular2A,angular2B;float depth=0,nmass=0,t1mass=0,t2mass=0,normal=0,f1=0,f2=0,target=0,friction=0;u64 key=0;};
struct Cache {u64 key=0;int tick=0,used=0;float normal=0;V friction;};
static Body bodies[MAX_B];static Joint joints[MAX_J];static Shape shapes[MAX_S];static Prim prims[MAX_P];static Geometry geometries[MAX_G];static Contact contacts[MAX_C];static Cache cache[MAX_CACHE];
static u32 disabled[(MAX_B*MAX_B)/32];static int bCount=0,jCount=0,sCount=0,pCount=0,gCount=0,cCount=0,tickNo=0;
static V gravity(0,-9.81f,0);static int vIterations=20,pIterations=3;static int sorted[MAX_B],sortedN=0,parents[MAX_B],sizes[MAX_B],rootActive[MAX_B],rootStill[MAX_B];static float rootSleep[MAX_B];static int touchesA[MAX_C],touchesB[MAX_C],touchCount=0;static float lastDt=1.f/120;static float scratch[512];
static void updateBody(int id){Body &b=bodies[id];Shape &s=shapes[b.shape];if(!b.tensorValid||b.tensorMass!=b.invMass||b.tensorQ.x!=b.q.x||b.tensorQ.y!=b.q.y||b.tensorQ.z!=b.q.z||b.tensorQ.w!=b.q.w){b.invI=b.invMass>0?rotated(b.localInvI,b.q):diag(0,0,0);b.worldI=rotated(b.localI,b.q);b.tensorQ=b.q;b.tensorMass=b.invMass;b.tensorValid=1;}V origin=b.p-rot(b.q,s.center);float *o=b.out;o[0]=origin.x;o[1]=origin.y;o[2]=origin.z;o[3]=b.q.x;o[4]=b.q.y;o[5]=b.q.z;o[6]=b.q.w;o[7]=b.v.x;o[8]=b.v.y;o[9]=b.v.z;o[10]=b.w.x;o[11]=b.w.y;o[12]=b.w.z;o[19]=b.p.x;o[20]=b.p.y;o[21]=b.p.z;o[22]=b.active&&b.motion!=0&&b.added;o[23]=b.motion;o[24]=b.mass;o[25]=b.canSleep;o[26]=b.added;
}
static void bounds(int id){Body &b=bodies[id];Shape &s=shapes[b.shape];V origin=b.p-rot(b.q,s.center);b.lo={1e30f,1e30f,1e30f};b.hi={-1e30f,-1e30f,-1e30f};for(int j=0;j<s.count;j++){Prim &p=prims[s.start+j];Q q=qm(b.q,p.q);V c=origin+rot(b.q,p.c),e;if(p.kind==1)e=p.h;else{V x=rot(q,{1,0,0}),y=rot(q,{0,1,0}),z=rot(q,{0,0,1});for(int k=0;k<3;k++)e[k]=absf(x[k])*p.h.x+absf(y[k])*p.h.y+absf(z[k])*p.h.z;}for(int k=0;k<3;k++){b.lo[k]=minf(b.lo[k],c[k]-e[k]);b.hi[k]=maxf(b.hi[k],c[k]+e[k]);}}for(int k=0;k<3;k++){b.out[13+k]=b.lo[k];b.out[16+k]=b.hi[k];}}
static int root(int a){while(parents[a]!=a){parents[a]=parents[parents[a]];a=parents[a];}return a;}
static void unite(int a,int b){if(bodies[a].motion!=2||bodies[b].motion!=2)return;a=root(a);b=root(b);if(a==b)return;if(sizes[a]<sizes[b]){int t=a;a=b;b=t;}parents[b]=a;sizes[a]+=sizes[b];}
static void wake(int id){Body &b=bodies[id];if(b.motion==0)return;b.active=1;b.sleepTime=0;b.out[22]=b.added;}
static void applyImpulse(Body &b,V j,V r){if(b.invMass<=0)return;b.v+=j*b.invMass;b.w+=mv(b.invI,cross(r,j));}
static void applyAngular(Body &b,V j){if(b.invMass<=0)return;b.w+=mv(b.invI,j);}
static V pointV(Body &b,V r){return b.v+cross(b.w,r);}
static float effective(Body&a,Body&b,V ra,V rb,V n){return a.invMass+b.invMass+dot(n,cross(mv(a.invI,cross(ra,n)),ra)+cross(mv(b.invI,cross(rb,n)),rb));}
static u64 hashContact(int a,int b,int pa,int pb,V point){V local=rot(conj(bodies[a].q),point-bodies[a].p);int x=int(__builtin_floorf(local.x*128)),y=int(__builtin_floorf(local.y*128)),z=int(__builtin_floorf(local.z*128));u64 h=1469598103934665603ull;int values[9]={a,b,bodies[a].generation,bodies[b].generation,pa,pb,x,y,z};for(int i:values){h^=u32(i);h*=1099511628211ull;}return h?h:1;}
static Cache* getCache(u64 key){u32 start=u32(key^(key>>32))&(MAX_CACHE-1);for(int i=0;i<8;i++){Cache &r=cache[(start+i)&(MAX_CACHE-1)];if(r.key==key||r.tick<tickNo-1)return &r;}return nullptr;}
static void contact(int a,int b,int pa,int pb,V p,V n,float depth){if(cCount>=MAX_C){errorCode=6;return;}if(bodies[a].invMass+bodies[b].invMass==0)return;Contact &c=contacts[cCount++];c={};c.a=a;c.b=b;c.p=p;c.n=n;c.depth=depth;c.key=hashContact(a,b,pa,pb,p);unite(a,b);if(bodies[a].active&&bodies[a].motion!=0&&!bodies[b].active)wake(b);if(bodies[b].active&&bodies[b].motion!=0&&!bodies[a].active)wake(a);}
