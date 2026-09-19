#pragma once
// Global sparse weld projection, in the original six degrees of freedom of
// every part. Matrix-free preconditioned conjugate gradients avoid slow force
// propagation and arbitrary accumulated self-stress around redundant loops.
// Contacts, yielded joints, pins, hinges and rebar remain unilateral/PGS solves.
struct Six {V t,r;};
static Six cx[MAX_J],cr[MAX_J],cz[MAX_J],cp[MAX_J],ca[MAX_J],cd[MAX_J];
static V cv[MAX_B],cw[MAX_B];static int cj[MAX_J],cn=0;
static double sixDot(Six*a,Six*b){double s=0;for(int i=0;i<cn;i++){s+=double(a[i].t.x)*b[i].t.x+double(a[i].t.y)*b[i].t.y+double(a[i].t.z)*b[i].t.z+double(a[i].r.x)*b[i].r.x+double(a[i].r.y)*b[i].r.y+double(a[i].r.z)*b[i].r.z;}return s;}
static Six precondition(int row,Six rhs){Joint&j=joints[cj[row]];Body&A=bodies[j.a],&B=bodies[j.b];V bv=rhs.t-cross(rhs.r,j.rb),bw=rhs.r,p,t;
 if(A.invMass>0&&B.invMass>0){float total=A.mass+B.mass;V v=bv*(B.mass/total),w=mv(j.linearMass,mv(B.worldI,bw)+cross(j.n,bv)*j.distanceMass);p=(v+cross(w,j.n)*(A.mass/total)-bv)*B.mass;t=mv(B.worldI,w-bw)-cross(j.rb,p);}
 else if(B.invMass>0){p=bv*(-B.mass);t=mv(B.worldI,-bw)-cross(j.rb,p);}else{p=(bv-cross(bw,j.n))*(-A.mass);t=mv(A.worldI,-bw)-cross(j.ra,p);}
 return {-p,-t};}

static void cgMatrix(Six*in,Six*out){
 for(int i=0;i<bCount;i++){cv[i]={};cw[i]={};}
 for(int i=0;i<cn;i++){Joint&j=joints[cj[i]];Body&A=bodies[j.a],&B=bodies[j.b];V p=in[i].t,t=in[i].r;
 cv[j.a]-=p*A.invMass;cv[j.b]+=p*B.invMass;cw[j.a]-=mv(A.invI,cross(j.ra,p)+t);cw[j.b]+=mv(B.invI,cross(j.rb,p)+t);}
 for(int i=0;i<cn;i++){Joint&j=joints[cj[i]];out[i]={cv[j.b]+cross(cw[j.b],j.rb)-cv[j.a]-cross(cw[j.a],j.ra),cw[j.b]-cw[j.a]};}
}
static int pgsJoints[MAX_J],positionJoints[MAX_J],pgsCount=0,positionCount=0;
static void prepareGlobalWelds(){cn=pgsCount=positionCount=0;for(int i=0;i<jCount;i++){if(joints[i].active==2)cj[cn++]=i;else if(joints[i].active)pgsJoints[pgsCount++]=i;if(joints[i].active)positionJoints[positionCount++]=i;}}
static void globalWelds(){if(!cgEnabled)return;
 for(int n=0;n<cn;n++){Joint&j=joints[cj[n]];Body&A=bodies[j.a],&B=bodies[j.b];cx[n]={};cr[n]={pointV(A,j.ra)-pointV(B,j.rb),A.w-B.w};cz[n]=precondition(n,cr[n]);cp[n]=cz[n];}
 double rho=sixDot(cr,cz),initial=rho;if(rho<1e-14)return;
 for(int iter=0;iter<48;iter++){cgMatrix(cp,ca);double den=sixDot(cp,ca);if(den<=1e-22)break;float a=float(rho/den);if(absf(a)>1e8f)break;
 for(int i=0;i<cn;i++){cx[i].t+=cp[i].t*a;cx[i].r+=cp[i].r*a;cr[i].t-=ca[i].t*a;cr[i].r-=ca[i].r*a;cz[i]=precondition(i,cr[i]);}
 double next=sixDot(cr,cz);if(next<maxf(float(initial*1e-8),1e-10f))break;float beta=float(next/rho);rho=next;
 for(int i=0;i<cn;i++){cp[i].t=cz[i].t+cp[i].t*beta;cp[i].r=cz[i].r+cp[i].r*beta;}}
 for(int i=0;i<cn;i++){Joint&j=joints[cj[i]];Body&A=bodies[j.a],&B=bodies[j.b];j.impulse+=cx[i].t;j.angularImpulse+=cx[i].r;applyImpulse(A,-cx[i].t,j.ra);applyImpulse(B,cx[i].t,j.rb);applyAngular(A,-cx[i].r);applyAngular(B,cx[i].r);}
}
static void substep(float dt){tickNo++;touchCount=0;for(int i=0;i<bCount;i++){Body&b=bodies[i];parents[i]=i;sizes[i]=1;rootActive[i]=0;rootStill[i]=1;rootSleep[i]=1e30f;if(!b.exists||!b.added)continue;if(b.motion==2&&b.active){b.v+=(gravity*b.gravityFactor+b.force*b.invMass)*dt;b.w+=mv(b.invI,b.torque)*dt;b.v*=1/(1+b.linearDamping*dt);b.w*=1/(1+b.angularDamping*dt);}updateBody(i);}
 for(int i=0;i<jCount;i++){Joint&j=joints[i];if(j.enabled&&bodies[j.a].added&&bodies[j.b].added)unite(j.a,j.b);}collisions();continuousContacts(dt);sweptFloorContacts(dt);useWorldCache=false;
 for(int i=0;i<bCount;i++)if(bodies[i].exists&&bodies[i].added&&bodies[i].motion==2&&bodies[i].active)rootActive[root(i)]=1;
 for(int i=0;i<bCount;i++)if(bodies[i].exists&&bodies[i].added&&bodies[i].motion==2&&rootActive[root(i)])bodies[i].active=1;
 int weldCount=0;for(int i=0;i<jCount;i++){Joint&j=joints[i];if(j.enabled&&j.kind==0&&len2(j.low)+len2(j.high)==0&&bodies[j.a].added&&bodies[j.b].added&&(bodies[j.a].active||bodies[j.b].active))weldCount++;}cgEnabled=weldCount>128;
 for(int i=0;i<jCount;i++)prepJoint(joints[i],dt);prepareGlobalWelds();for(int i=0;i<cCount;i++)prepContact(contacts[i],dt);
 for(int it=0;it<vIterations;it++){if(it&1){for(int i=pgsCount-1;i>=0;i--)solveJoint(joints[pgsJoints[i]],dt);}else for(int i=0;i<pgsCount;i++)solveJoint(joints[pgsJoints[i]],dt);for(int i=0;i<cCount;i++)solveContact(contacts[i]);if(it%4==3||it==vIterations-1)globalWelds();}
 for(int i=0;i<jCount;i++){Joint&j=joints[i];if(!j.active)continue;V linear=j.kind==2?j.n*j.distanceImpulse:j.impulse;for(int k=0;k<3;k++){j.out[k]+=linear[k];j.out[3+k]+=j.angularImpulse[k];}j.out[6]+=j.distanceImpulse;}
 for(int i=0;i<bCount;i++){Body&b=bodies[i];if(!b.exists||!b.added||b.motion==0||!b.active)continue;b.v=cap(b.v,500);b.w=cap(b.w,100);V L=mv(rotated(b.localI,b.q),b.w);b.p+=b.v*dt;b.q=norm(qm(qdelta(b.w*dt),b.q));b.invI=b.invMass>0?rotated(b.localInvI,b.q):diag(0,0,0);if(b.motion==2)b.w=mv(b.invI,L);}
 for(int it=0;it<pIterations;it++){for(int i=0;i<cCount;i++)positionContact(contacts[i]);for(int i=0;i<positionCount;i++)positionJoint(joints[positionJoints[i]]);}
 for(int i=0;i<cCount;i++){Contact&c=contacts[i];Cache*cc=getCache(c.key);if(cc){cc->key=c.key;cc->tick=tickNo;cc->normal=c.normal;cc->friction=c.t1*c.f1+c.t2*c.f2;}}
 for(int i=0;i<bCount;i++){Body&b=bodies[i];if(!b.exists||!b.added||b.motion!=2)continue;int r=root(i);if(!b.canSleep||len2(b.v)>.0036f||len2(b.w)>.0016f||len2(b.force)>0||len2(b.torque)>0)rootStill[r]=0;rootSleep[r]=minf(rootSleep[r],b.sleepTime);}
 for(int i=0;i<bCount;i++){Body&b=bodies[i];if(!b.exists||!b.added)continue;if(b.motion==2){int r=root(i);b.sleepTime=rootStill[r]?rootSleep[r]+dt:0;if(b.sleepTime>.65f){b.active=0;b.v={};b.w={};}}if(!(absf(b.p.x)<1e8f&&absf(b.p.y)<1e8f&&absf(b.p.z)<1e8f)){errorCode=7;return;}updateBody(i);bounds(i);}lastDt=dt;
}
