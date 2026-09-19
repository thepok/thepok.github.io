#pragma once
static void prepJoint(Joint&j,float dt){Body&A=bodies[j.a],&B=bodies[j.b];j.active=j.enabled&&A.added&&B.added&&(A.active||B.active)&&(A.invMass+B.invMass>0);if(!j.active)return;j.ra=rot(A.q,j.la);j.rb=rot(B.q,j.lb);V error=B.p+j.rb-A.p-j.ra;j.bias=error*0.f;j.angularBias={};j.limited=0;
 bool weld=j.kind==0&&len2(j.low)+len2(j.high)==0;
 if(weld){j.limited=2;j.n=j.ra-j.rb;if(A.invMass>0&&B.invMass>0){float mu=1/(A.invMass+B.invMass);j.distanceMass=mu;M tensor=diag(len2(j.n),len2(j.n),len2(j.n));for(int i=0;i<3;i++)for(int k=0;k<3;k++)tensor.a[i*3+k]-=j.n[i]*j.n[k];j.linearMass=inverse(A.worldI+B.worldI+tensor*mu);}}
 else {j.linearMass=inverse(diag(A.invMass+B.invMass,A.invMass+B.invMass,A.invMass+B.invMass)+momentMatrix(A.invI,j.ra)+momentMatrix(B.invI,j.rb));j.angularMass=inverse(A.invI+B.invI);}
 if(j.kind==2){float d=len(error);j.n=d>1e-8f?error/d:V(0,1,0);j.distanceMass=1/maxf(1e-15f,effective(A,B,j.ra,j.rb,j.n));float e=d>j.maxDist?d-j.maxDist:d<j.minDist?d-j.minDist:0;j.bias=j.n*clampf(.16f*e/dt,-3,3);j.limited=e>0?1:e<0?-1:0;if(!j.limited)j.distanceImpulse=0;V imp=j.n*j.distanceImpulse;applyImpulse(A,-imp,j.ra);applyImpulse(B,imp,j.rb);return;}
 Q fa=qm(A.q,j.qa),fb=qm(B.q,j.qb),err=qm(fb,conj(fa));float sign=err.w>=0?1:-1;V angular=V(err.x,err.y,err.z)*(2*sign);for(int i=0;i<3;i++)j.axes[i]=rot(fa,i==0?V(1,0,0):i==1?V(0,1,0):V(0,0,1));
 if(j.kind==3){j.motorImpulse=0;V a=rot(A.q,j.axisA),b=rot(B.q,j.axisB);j.n=unit(a+b);j.angularBias=cross(a,b)*0.f;j.angularImpulse-=j.n*dot(j.angularImpulse,j.n);}
 else if(j.kind==0){for(int i=0;i<3;i++){float e=dot(angular,j.axes[i]),lo=j.low[i],hi=j.high[i];if(lo==hi)j.angularBias+=j.axes[i]*e;else if(e<lo)j.angularBias+=j.axes[i]*(e-lo);else if(e>hi)j.angularBias+=j.axes[i]*(e-hi);}if(weldFrequency>0&&weld){float omega=6.28318530718f*weldFrequency,den=2.f*omega+dt*omega*omega;float beta=weldBeta;j.angularInv[0]=weldAlpha;j.angularBias=cap(j.angularBias,.3f)*(beta/dt);j.bias=cap(error,.5f)*(beta/dt);}else{j.angularInv[0]=0;j.angularBias={};}}
 if(cgEnabled&&weld){j.active=2;j.impulse*=.95f;j.angularImpulse*=.95f;applyImpulse(A,-j.impulse,j.ra);applyImpulse(B,j.impulse,j.rb);applyAngular(A,-j.angularImpulse);applyAngular(B,j.angularImpulse);return;}if(j.kind==1)j.angularImpulse={};j.impulse*=.85f;j.angularImpulse*=.85f;applyImpulse(A,-j.impulse,j.ra);applyImpulse(B,j.impulse,j.rb);applyAngular(A,-j.angularImpulse);applyAngular(B,j.angularImpulse);
}
static inline void solveJointBodies(Joint& __restrict j,float dt,Body* __restrict pa,Body* __restrict pb){if(!j.active||j.active==2)return;Body&A=*pa,&B=*pb;
 // Exact six-DOF pair projection: conserve pair momentum while matching both
 // endpoint velocities and angular velocities. No generic 6x6 inversion.
 if(j.kind==0&&j.limited==2){V impulse,angular;V bv=B.v+j.bias-cross(j.angularBias,j.rb),bw=B.w+j.angularBias;
  if(A.invMass>0&&B.invMass>0){float total=A.mass+B.mass,mu=j.distanceMass;V linear=(A.v*A.mass+bv*B.mass)/total;
   V omega=mv(j.linearMass,mv(A.worldI,A.w)+mv(B.worldI,bw)+cross(j.n,bv-A.v)*mu);
   impulse=(linear+cross(omega,j.n)*(A.mass/total)-bv)*B.mass;
   angular=mv(B.worldI,omega-bw)-cross(j.rb,impulse);
  }else if(B.invMass>0){impulse=(A.v+cross(A.w,j.n)-bv)*B.mass;angular=mv(B.worldI,A.w-bw)-cross(j.rb,impulse);}
  else {impulse=(bv-cross(bw,j.n)-A.v)*(-A.mass);angular=mv(A.worldI,bw-A.w)*(-1)-cross(j.ra,impulse);}
  float alpha=j.angularInv[0];impulse=(impulse-j.impulse*alpha)/(1+alpha);angular=(angular-j.angularImpulse*alpha)/(1+alpha);
  j.impulse+=impulse;j.angularImpulse+=angular;applyImpulse(A,-impulse,j.ra);applyImpulse(B,impulse,j.rb);applyAngular(A,-angular);applyAngular(B,angular);return;
 }
 V rv=pointV(B,j.rb)-pointV(A,j.ra);if(j.kind==2){if(!j.limited)return;float old=j.distanceImpulse,delta=-(dot(rv,j.n)+dot(j.bias,j.n))*j.distanceMass;j.distanceImpulse=j.limited>0?minf(0,old+delta):maxf(0,old+delta);V imp=j.n*(j.distanceImpulse-old);applyImpulse(A,-imp,j.ra);applyImpulse(B,imp,j.rb);return;}
 V impulse=mv(j.linearMass,-rv-j.bias);j.impulse+=impulse;applyImpulse(A,-impulse,j.ra);applyImpulse(B,impulse,j.rb);
 if(j.kind==1)return;V wr=B.w-A.w,angular;
 if(j.kind==3){V target=-wr-j.angularBias;target-=j.n*dot(target,j.n);angular=mv(j.angularMass,target);angular-=j.n*dot(angular,j.n);j.angularImpulse+=angular;applyAngular(A,-angular);applyAngular(B,angular);if(j.motorState){float den=dot(j.n,mv(A.invI+B.invI,j.n));float d=den>1e-12f?(j.motorTarget-dot(B.w-A.w,j.n))/den:0,old=j.motorImpulse;j.motorImpulse=clampf(old+d,j.motorMin*dt,j.motorMax*dt);V t=j.n*(j.motorImpulse-old);applyAngular(A,-t);applyAngular(B,t);}return;}
 // All three zero-limit axes use a block solve. Yielded axes retain finite limits/friction.
 bool fixed=j.low.x==0&&j.low.y==0&&j.low.z==0&&j.high.x==0&&j.high.y==0&&j.high.z==0;
 if(fixed){angular=mv(j.angularMass,-wr-j.angularBias);j.angularImpulse+=angular;applyAngular(A,-angular);applyAngular(B,angular);}else{Q fa=qm(A.q,j.qa),fb=qm(B.q,j.qb),qe=qm(fb,conj(fa));V err(qe.x,qe.y,qe.z);err*=qe.w<0?-2.f:2.f;for(int i=0;i<3;i++){V axis=j.axes[i];float den=dot(axis,mv(A.invI+B.invI,axis));if(den<1e-15f)continue;float e=dot(err,axis),old=dot(j.angularImpulse,axis),lambda=old-(dot(B.w-A.w,axis)+dot(j.angularBias,axis))/den;float limit=j.friction[i]*dt;if(e>=j.low[i]&&e<=j.high[i])lambda=clampf(lambda,-limit,limit);else if(e>j.high[i])lambda=minf(limit,lambda);else lambda=maxf(-limit,lambda);V delta=axis*(lambda-old);j.angularImpulse+=delta;applyAngular(A,-delta);applyAngular(B,delta);}}
}
static void solveJoint(Joint&j,float dt){solveJointBodies(j,dt,&bodies[j.a],&bodies[j.b]);}
static void poseImpulse(Body&b,V impulse,V r){if(b.invMass<=0)return;b.p+=impulse*b.invMass;V dq=cap(mv(b.invI,cross(r,impulse)),.12f);b.q=norm(qm(qdelta(dq),b.q));b.invI=rotated(b.localInvI,b.q);}
static void poseAngular(Body&b,V impulse){if(b.invMass<=0)return;b.q=norm(qm(qdelta(cap(mv(b.invI,impulse),.12f)),b.q));b.invI=rotated(b.localInvI,b.q);}
static void positionJoint(Joint&j){if(!j.active||(j.kind==0&&j.limited==2&&weldFrequency>0))return;Body&A=bodies[j.a],&B=bodies[j.b];V ra=rot(A.q,j.la),rb=rot(B.q,j.lb),error=B.p+rb-A.p-ra;if(j.kind==2){float d=len(error),e=d>j.maxDist?d-j.maxDist:d<j.minDist?d-j.minDist:0;if(absf(e)<.001f)return;V n=unit(error);float m=effective(A,B,ra,rb,n);V p=n*(-clampf(e*.2f,-.1f,.1f)/maxf(m,1e-12f));poseImpulse(A,-p,ra);poseImpulse(B,p,rb);return;}M K=diag(A.invMass+B.invMass,A.invMass+B.invMass,A.invMass+B.invMass)+momentMatrix(A.invI,ra)+momentMatrix(B.invI,rb);V p=mv(inverse(K),cap(error,.2f)*-.18f);poseImpulse(A,-p,ra);poseImpulse(B,p,rb);if(j.kind==1)return;V angular;if(j.kind==3){angular=cross(rot(A.q,j.axisA),rot(B.q,j.axisB));}else{Q fa=qm(A.q,j.qa),fb=qm(B.q,j.qb),q=qm(fb,conj(fa));V e=V(q.x,q.y,q.z)*(q.w>=0?2.f:-2.f);for(int i=0;i<3;i++){V ax=rot(fa,i==0?V(1,0,0):i==1?V(0,1,0):V(0,0,1));float v=dot(e,ax);angular+=ax*(v<j.low[i]?v-j.low[i]:v>j.high[i]?v-j.high[i]:0);}}V t=mv(inverse(A.invI+B.invI),cap(angular,.15f)*-.16f);poseAngular(A,-t);poseAngular(B,t);}
static void positionContact(Contact&c){Body&A=bodies[c.a],&B=bodies[c.b];
 // Contact anchors are advanced with the bodies, not reused as world-fixed springs.
 V pa=A.p+rot(A.q,c.localA);V pb=B.p+rot(B.q,c.localB);float error=c.depth-dot(pb-pa,c.n);if(error<=.004f)return;V ra=pa-A.p,rb=pb-B.p;float den=effective(A,B,ra,rb,c.n);V p=c.n*(clampf(error-.004f,0,.12f)*.22f/maxf(den,1e-12f));poseImpulse(A,-p,ra);poseImpulse(B,p,rb);}
// Swept sphere / rounded OBB by conservative advancement of exact distance.
static void continuousContacts(float dt){for(int a=0;a<bCount;a++){Body&A=bodies[a];if(!A.exists||!A.added||!A.active||!A.ccd||A.motion!=2)continue;Shape&s=shapes[A.shape];if(s.count!=1||prims[s.start].kind!=1)continue;WorldPrim sphere=wp(a,0);if(len2(A.v)*dt*dt<sphere.h.x*sphere.h.x*.16f)continue;V future=sphere.c+A.v*dt,lo,hi;for(int k=0;k<3;k++){lo[k]=minf(sphere.c[k],future[k])-sphere.h.x;hi[k]=maxf(sphere.c[k],future[k])+sphere.h.x;}for(int b=0;b<bCount;b++){Body&B=bodies[b];if(a==b||!B.exists||!B.added||isDisabled(a,b)||!aabb(lo,hi,B.lo,B.hi))continue;Shape&bs=shapes[B.shape];for(int i=0;i<bs.count;i++){WorldPrim target=wp(b,i);if(!aabb(lo,hi,target.lo,target.hi))continue;V relative=(A.v-B.v)*dt;if(len2(relative)<1e-10f)continue;float t=0,startDistance=0;V n,point;bool hit=false;for(int it=0;it<16;it++){V center=sphere.c+relative*t;float d;if(target.p->kind==1){n=unit(center-target.c);d=len(center-target.c)-target.h.x;point=target.c+n*target.h.x;}else point=closestPoly(target,center,n,d);float sep=d-sphere.h.x;if(it==0){startDistance=sep;if(sep<=.012f)break;}if(sep<.002f){hit=true;break;}float speed=-dot(relative,n);if(speed<=1e-8f)break;t+=sep/speed;if(t>1)break;}if(hit&&t>0&&startDistance>.012f){float sep=-dot(relative,n)*t;V cp=sphere.c-n*sphere.h.x;contact(a,b,0,i,cp,-n,-sep);}}}}
}

// Speculative contacts for thin, fast debris crossing broad static floor faces.
// Actual fragment vertices/radii are used; no collision hull or debris is removed.
// Merely constrains the approaching normal velocity at the time of impact.
static void sweptFloorContacts(float dt){
 for(int b=0;b<bCount;b++){
  Body&B=bodies[b];if(!B.exists||!B.added||B.motion!=0)continue;
  Shape&bs=shapes[B.shape];if(bs.count!=1)continue;WorldPrim floor=wp(b,0);
  if(floor.p->kind!=0||floor.h.x<10||floor.h.z<10||absf(floor.axis[1].y)<.99999f)continue;
  const float top=floor.c.y+floor.h.y;
  for(int a=0;a<bCount;a++){
   Body&A=bodies[a];if(!A.exists||!A.added||A.motion!=2||!A.active||isDisabled(a,b))continue;
   float radius=len(A.hi-A.lo)*.5f,travel=(maxf(0,-A.v.y)+len(A.w)*radius)*dt;
   if(A.lo.y<=top+.012f||A.lo.y-top>travel+.012f||A.lo.x>floor.hi.x||A.hi.x<floor.lo.x||A.lo.z>floor.hi.z||A.hi.z<floor.lo.z)continue;
   Shape&as=shapes[A.shape];
   for(int i=0;i<as.count;i++){
    WorldPrim w=wp(a,i);V points[40];int count;
    if(w.p->kind==1){points[0]=w.c-V(0,w.h.x,0);count=1;}else count=verts(w,points);
    // Use the earliest support points, not the first four vertices in storage
    // order (which may all lie on one side and introduce an artificial torque).
    V candidate[40];float when[40];int found=0;
    for(int k=0;k<count;k++){
     V p=points[k];float sep=p.y-top;V velocity=pointV(A,p-A.p);
     if(sep<=.012f||sep+velocity.y*dt>.002f)continue;
     float t=sep/maxf(.001f,-velocity.y);V at=p+velocity*t;
     if(at.x<floor.lo.x+.01f||at.x>floor.hi.x-.01f||at.z<floor.lo.z+.01f||at.z>floor.hi.z-.01f)continue;
     int insert=found++;while(insert>0&&when[insert-1]>t){when[insert]=when[insert-1];candidate[insert]=candidate[insert-1];insert--;}
     when[insert]=t;candidate[insert]=p;
    }
    for(int k=0;k<found&&k<4;k++){V p=candidate[k];contact(a,b,i,0,p,V(0,-1,0),top-p.y);}
   }
  }
 }
}
