#pragma once
struct WorldPrim {Prim *p;Q q;V c,axis[3],h,lo,hi;int body,index;int cacheIndex=-1;};
static WorldPrim uncachedWP(int body,int index){Body &b=bodies[body];Prim &p=prims[shapes[b.shape].start+index];WorldPrim w;w.p=&p;w.body=body;w.index=index;w.q=qm(b.q,p.q);w.c=b.p+rot(b.q,p.c-shapes[b.shape].center);w.h=p.h;w.axis[0]=rot(w.q,{1,0,0});w.axis[1]=rot(w.q,{0,1,0});w.axis[2]=rot(w.q,{0,0,1});V e;for(int k=0;k<3;k++)e[k]=p.kind==1?p.h.x:absf(w.axis[0][k])*p.h.x+absf(w.axis[1][k])*p.h.y+absf(w.axis[2][k])*p.h.z;w.lo=w.c-e;w.hi=w.c+e;return w;}
// World transforms are immutable while broad/narrow-phase and CCD run.
// Outside that phase (ray queries, walking, edits), always calculate fresh data.
constexpr int WORLD_PRIM_CACHE=16384;
static WorldPrim worldPrims[WORLD_PRIM_CACHE];
static int worldOffsets[MAX_B],worldEpochs[MAX_B],geometrySlots[WORLD_PRIM_CACHE];
static int worldEpoch=0,worldUsed=0;static bool useWorldCache=false;
static WorldPrim wp(int body,int index){
 if(!useWorldCache)return uncachedWP(body,index);
 if(worldEpochs[body]!=worldEpoch){
  worldEpochs[body]=worldEpoch;int count=shapes[bodies[body].shape].count;
  worldOffsets[body]=worldUsed+count<=WORLD_PRIM_CACHE?worldUsed:-1;
  if(worldOffsets[body]>=0)for(int i=0;i<count;i++){worldPrims[worldUsed]=uncachedWP(body,i);worldPrims[worldUsed].cacheIndex=worldUsed;geometrySlots[worldUsed]=-1;worldUsed++;}
 }
 return worldOffsets[body]>=0?worldPrims[worldOffsets[body]+index]:uncachedWP(body,index);
}
static V support(const WorldPrim&w,V n){V local=rot(conj(w.q),n);if(w.p->kind==1)return w.c+unit(n)*w.h.x;if(w.p->kind==0)return w.c+rot(w.q,{local.x>=0?w.h.x:-w.h.x,local.y>=0?w.h.y:-w.h.y,local.z>=0?w.h.z:-w.h.z});Geometry &g=geometries[w.p->g];float best=-1e30f;V out;for(int i=0;i<g.nv;i++){float d=dot(g.vertices[i],local);if(d>best){best=d;out=g.vertices[i];}}return w.c+rot(w.q,out);}
static float projectRadius(const WorldPrim &w,V n){if(w.p->kind==1)return w.h.x;if(w.p->kind==0)return absf(dot(w.axis[0],n))*w.h.x+absf(dot(w.axis[1],n))*w.h.y+absf(dot(w.axis[2],n))*w.h.z;Geometry &g=geometries[w.p->g];float radius=0;V axis=rot(conj(w.q),n);for(int i=0;i<g.nv;i++)radius=maxf(radius,absf(dot(g.vertices[i],axis)));return radius;}
// Same six comparisons, evaluated in parallel; padding lane never participates.
static bool aabb(V lo,V hi,V lo2,V hi2,float margin=.012f){
 const v128_t m=wasm_f32x4_splat(margin);
 const v128_t left=wasm_f32x4_le((v128_t)lo.lanes,wasm_f32x4_add((v128_t)hi2.lanes,m));
 const v128_t right=wasm_f32x4_ge(wasm_f32x4_add((v128_t)hi.lanes,m),(v128_t)lo2.lanes);
 return (wasm_i32x4_bitmask(wasm_v128_and(left,right))&7)==7;
}
static int clip(V *in,int count,V *out,V n,float d){if(!count)return 0;V prev=in[count-1];float dp=dot(prev,n)-d;int nc=0;for(int i=0;i<count;i++){V p=in[i];float dd=dot(p,n)-d;if((dd<=0)!=(dp<=0)){if(nc<20)out[nc++]=prev+(p-prev)*(dp/(dp-dd));}if(dd<=0&&nc<20)out[nc++]=p;prev=p;dp=dd;}return nc;}
static void edgeClosest(V p,V a,V q,V b,V &o1,V&o2){V d1=a-p,d2=b-q,r=p-q;float A=dot(d1,d1),E=dot(d2,d2),B=dot(d1,d2),C=dot(d1,r),F=dot(d2,r),den=A*E-B*B;float s=den>1e-15f?clampf((B*F-C*E)/den,0,1):0,t=E>1e-15f?(B*s+F)/E:0;if(t<0){t=0;s=A>0?clampf(-C/A,0,1):0;}else if(t>1){t=1;s=A>0?clampf((B-C)/A,0,1):0;}o1=p+d1*s;o2=q+d2*t;}
static inline float boxRadius(const WorldPrim&w,V n){return absf(dot(w.axis[0],n))*w.h.x+absf(dot(w.axis[1],n))*w.h.y+absf(dot(w.axis[2],n))*w.h.z;}
static void boxBox(const WorldPrim&a,const WorldPrim&b){V d=b.c-a.c;float best=1e30f;V n;int face=-1,ea=-1,eb=-1;for(int i=0;i<15;i++){V x=i<3?a.axis[i]:i<6?b.axis[i-3]:cross(a.axis[(i-6)/3],b.axis[(i-6)%3]);float l=len2(x);if(l<1e-8f)continue;x=x/sqrtf_(l);float dep=boxRadius(a,x)+boxRadius(b,x)-absf(dot(d,x));if(dep<-.012f)return;float favor=i>=6?.002f:0;if(dep+favor<best){best=dep;n=dot(d,x)>=0?x:-x;face=i;if(i>=6){ea=(i-6)/3;eb=(i-6)%3;}}}
 if(face<6){const WorldPrim&r=face<3?a:b,&inc=face<3?b:a;V rn=face<3?n:-n;int k=face%3,u=(k+1)%3,v=(k+2)%3;float s=dot(r.axis[k],rn)>=0?1:-1;V c=r.c+r.axis[k]*(r.h[k]*s);int ik=0;for(int i=1;i<3;i++)if(absf(dot(inc.axis[i],rn))>absf(dot(inc.axis[ik],rn)))ik=i;float is=dot(inc.axis[ik],rn)>0?-1:1;int iu=(ik+1)%3,iv=(ik+2)%3;V ic=inc.c+inc.axis[ik]*(inc.h[ik]*is),U=inc.axis[iu]*inc.h[iu],VV=inc.axis[iv]*inc.h[iv];V p[24]={ic-U-VV,ic+U-VV,ic+U+VV,ic-U+VV},t[24];int count=4;for(int axi=0;axi<2;axi++)for(int sign=-1;sign<=1;sign+=2){int ax=axi==0?u:v;V cn=r.axis[ax]*float(sign);count=clip(p,count,t,cn,dot(c,cn)+r.h[ax]);for(int i=0;i<count;i++)p[i]=t[i];}int used=0;for(int i=0;i<count;i++){float dep=dot(c-p[i],rn);if(dep>=-.012f){contact(a.body,b.body,a.index,b.index,p[i]+rn*(dep*.5f),n,dep);used++;if(used==4)break;}}if(!used)contact(a.body,b.body,a.index,b.index,(support(a,n)+support(b,-n))*.5f,n,best);
 }else{V ac=a.c,bc=b.c;for(int i=0;i<3;i++){if(i!=ea)ac+=a.axis[i]*(a.h[i]*(dot(a.axis[i],n)>=0?1:-1));if(i!=eb)bc+=b.axis[i]*(b.h[i]*(dot(b.axis[i],n)>=0?-1:1));}V p,q;edgeClosest(ac-a.axis[ea]*a.h[ea],ac+a.axis[ea]*a.h[ea],bc-b.axis[eb]*b.h[eb],bc+b.axis[eb]*b.h[eb],p,q);contact(a.body,b.body,a.index,b.index,(p+q)*.5f,n,best);}
}
static void sphereSphere(const WorldPrim&a,const WorldPrim&b){V d=b.c-a.c;float l=len(d),dep=a.h.x+b.h.x-l;if(dep<-.012f)return;V n=l>1e-8f?d/l:V(0,1,0);contact(a.body,b.body,a.index,b.index,a.c+n*(a.h.x-dep*.5f),n,dep);}
static void sphereBox(const WorldPrim &s,const WorldPrim &b,bool reverse){V p=rot(conj(b.q),s.c-b.c),cl;for(int i=0;i<3;i++)cl[i]=clampf(p[i],-b.h[i],b.h[i]);V diff=p-cl;float l=len(diff),dep;V n;if(l>1e-8f){dep=s.h.x-l;if(dep<-.012f)return;n=rot(b.q,diff/l);}else{int ax=0;for(int i=1;i<3;i++)if(b.h[i]-absf(p[i])<b.h[ax]-absf(p[ax]))ax=i;V nn;nn[ax]=p[ax]>=0?1:-1;n=rot(b.q,nn);dep=s.h.x+b.h[ax]-absf(p[ax]);cl=p;cl[ax]=nn[ax]*b.h[ax];}V cp=s.c-n*(s.h.x-dep*.5f);if(reverse)contact(b.body,s.body,b.index,s.index,cp,n,dep);else contact(s.body,b.body,s.index,b.index,cp,-n,dep);}
// Exact convex-polytope SAT: all face normals and cross products of hull edges.
// A hull may be clipped only by the original source's geometry vertex budget.
static int verts(const WorldPrim&w,V*out){if(w.p->kind==0){int c=0;for(int x=-1;x<=1;x+=2)for(int y=-1;y<=1;y+=2)for(int z=-1;z<=1;z+=2)out[c++]=w.c+w.axis[0]*(x*w.h.x)+w.axis[1]*(y*w.h.y)+w.axis[2]*(z*w.h.z);return c;}Geometry&g=geometries[w.p->g];for(int i=0;i<g.nv;i++)out[i]=w.c+rot(w.q,g.vertices[i]);return g.nv;}
static int normals(const WorldPrim&w,V*out){if(w.p->kind==0){for(int i=0;i<3;i++)out[i]=w.axis[i];return 3;}Geometry&g=geometries[w.p->g];for(int i=0;i<g.nf;i++)out[i]=rot(w.q,g.normals[i]);return g.nf;}
static int edges(const WorldPrim&w,V*out){if(w.p->kind==0){for(int i=0;i<3;i++)out[i]=w.axis[i];return 3;}Geometry&g=geometries[w.p->g];for(int i=0;i<g.ne;i++)out[i]=rot(w.q,g.edges[i]);return g.ne;}
constexpr int WORLD_GEOMETRY_CACHE=4096;
struct WorldGeometry {V av[40],an[48],ae[64];F4 px[10],py[10],pz[10];int nv,nn,ne,blocks;};
static WorldGeometry worldGeometry[WORLD_GEOMETRY_CACHE];static int geometryUsed=0;
static WorldGeometry* getWorldGeometry(const WorldPrim&w){
 if(!useWorldCache||w.cacheIndex<0)return nullptr;
 int slot=geometrySlots[w.cacheIndex];if(slot>=0)return &worldGeometry[slot];
 if(geometryUsed==WORLD_GEOMETRY_CACHE)return nullptr;
 slot=geometryUsed++;geometrySlots[w.cacheIndex]=slot;auto&g=worldGeometry[slot];g.nv=verts(w,g.av);g.nn=normals(w,g.an);g.ne=edges(w,g.ae);
 g.blocks=(g.nv+3)/4;for(int i=0;i<g.blocks;i++)for(int k=0;k<4;k++){int n=i*4+k;if(n>=g.nv)n=g.nv-1;g.px[i][k]=g.av[n].x;g.py[i][k]=g.av[n].y;g.pz[i][k]=g.av[n].z;}return &g;
}
// Project four actual vertices per SIMD instruction. Padding repeats a valid
// vertex; it cannot enlarge a hull. Each vertex uses the same xyz sum ordering.
static V packedProjection(const WorldGeometry&g,V axis){
 F4 lo={1e30f,1e30f,1e30f,1e30f},hi={-1e30f,-1e30f,-1e30f,-1e30f};
 for(int i=0;i<g.blocks;i++){F4 d=(g.px[i]*axis.x+g.py[i]*axis.y)+g.pz[i]*axis.z;lo=(F4)wasm_f32x4_min((v128_t)lo,(v128_t)d);hi=(F4)wasm_f32x4_max((v128_t)hi,(v128_t)d);}
 return {minf(minf(lo[0],lo[1]),minf(lo[2],lo[3])),maxf(maxf(hi[0],hi[1]),maxf(hi[2],hi[3])),0};
}
static bool insidePoly(const WorldPrim&w,V p,float margin){V l=rot(conj(w.q),p-w.c);if(w.p->kind==0)return absf(l.x)<=w.h.x+margin&&absf(l.y)<=w.h.y+margin&&absf(l.z)<=w.h.z+margin;Geometry&g=geometries[w.p->g];for(int i=0;i<g.nf;i++)if(dot(g.normals[i],l)>g.ds[i]+margin)return false;return true;}
static void polyPoly(const WorldPrim&a,const WorldPrim&b){V avLocal[40],bvLocal[40],anLocal[48],bnLocal[48],aeLocal[64],beLocal[64];
 auto*ga=getWorldGeometry(a);auto*gb=getWorldGeometry(b);
 V *av=ga?ga->av:avLocal,*bv=gb?gb->av:bvLocal,*an=ga?ga->an:anLocal,*bn=gb?gb->an:bnLocal,*ae=ga?ga->ae:aeLocal,*be=gb?gb->ae:beLocal;
 int na=ga?ga->nv:verts(a,av),nb=gb?gb->nv:verts(b,bv),nna=ga?ga->nn:normals(a,an),nnb=gb?gb->nn:normals(b,bn),nea=ga?ga->ne:edges(a,ae),neb=gb?gb->ne:edges(b,be);float best=1e30f;V normal;auto test=[&](V axis){float l=len2(axis);if(l<1e-8f)return true;axis=axis/sqrtf_(l);float amin=1e30f,amax=-1e30f,bmin=1e30f,bmax=-1e30f;if(ga){V r=packedProjection(*ga,axis);amin=r.x;amax=r.y;}else for(int i=0;i<na;i++){float d=dot(av[i],axis);amin=minf(amin,d);amax=maxf(amax,d);}
 if(gb){V r=packedProjection(*gb,axis);bmin=r.x;bmax=r.y;}else for(int i=0;i<nb;i++){float d=dot(bv[i],axis);bmin=minf(bmin,d);bmax=maxf(bmax,d);}float dep=minf(amax-bmin,bmax-amin);if(dep<-.012f)return false;if(dep<best){best=dep;normal=amax-bmin<bmax-amin?axis:-axis;}return true;};for(int i=0;i<nna;i++)if(!test(an[i]))return;for(int i=0;i<nnb;i++)if(!test(bn[i]))return;for(int i=0;i<nea;i++)for(int j=0;j<neb;j++)if(!test(cross(ae[i],be[j])))return;
 float da=dot(support(a,normal),normal),db=dot(support(b,-normal),normal);V points[80];int count=0;for(int i=0;i<na;i++)if(absf(dot(av[i],normal)-da)<.02f&&insidePoly(b,av[i],.025f))points[count++]=av[i]-normal*(best*.5f);for(int i=0;i<nb;i++)if(absf(dot(bv[i],normal)-db)<.02f&&insidePoly(a,bv[i],.025f))points[count++]=bv[i]+normal*(best*.5f);if(!count)points[count++]=(support(a,normal)+support(b,-normal))*.5f;
 int selected[4]={0,-1,-1,-1};int nc=1;while(nc<4&&nc<count){float far=-1;int chosen=-1;for(int i=0;i<count;i++){float d=1e30f;bool used=false;for(int j=0;j<nc;j++){if(i==selected[j])used=true;d=minf(d,len2(points[i]-points[selected[j]]));}if(!used&&d>far){far=d;chosen=i;}}if(chosen<0||far<.0001f)break;selected[nc++]=chosen;}for(int i=0;i<nc;i++)contact(a.body,b.body,a.index,b.index,points[selected[i]],normal,best);
}
static V closestSegment(V p,V a,V b){V d=b-a;float l=len2(d);return a+d*(l>1e-12f?clampf(dot(p-a,d)/l,0,1):0);}
static V closestTriangle(V p,V a,V b,V c){V ab=b-a,ac=c-a,ap=p-a;float d1=dot(ab,ap),d2=dot(ac,ap);if(d1<=0&&d2<=0)return a;V bp=p-b;float d3=dot(ab,bp),d4=dot(ac,bp);if(d3>=0&&d4<=d3)return b;float vc=d1*d4-d3*d2;if(vc<=0&&d1>=0&&d3<=0)return a+ab*(d1/(d1-d3));V cp=p-c;float d5=dot(ab,cp),d6=dot(ac,cp);if(d6>=0&&d5<=d6)return c;float vb=d5*d2-d1*d6;if(vb<=0&&d2>=0&&d6<=0)return a+ac*(d2/(d2-d6));float va=d3*d6-d5*d4;if(va<=0&&d4-d3>=0&&d5-d6>=0)return b+(c-b)*((d4-d3)/((d4-d3)+(d5-d6)));float den=1/(va+vb+vc);return a+ab*(vb*den)+ac*(vc*den);}
// Polytope closest point obtained by triangulating each convex face at creation.
static V closestPoly(const WorldPrim&w,V p,V &normal,float&signedDistance){V local=rot(conj(w.q),p-w.c);if(w.p->kind==0){V c;for(int i=0;i<3;i++)c[i]=clampf(local[i],-w.h[i],w.h[i]);V d=local-c;float l=len(d);if(l>1e-9f){normal=rot(w.q,d/l);signedDistance=l;return w.c+rot(w.q,c);}int k=0;for(int i=1;i<3;i++)if(w.h[i]-absf(local[i])<w.h[k]-absf(local[k]))k=i;V n;n[k]=local[k]>=0?1:-1;signedDistance=absf(local[k])-w.h[k];normal=rot(w.q,n);c=local;c[k]=n[k]*w.h[k];return w.c+rot(w.q,c);}
 Geometry&g=geometries[w.p->g];float maxDist=-1e30f;int face=0;for(int i=0;i<g.nf;i++){float d=dot(g.normals[i],local)-g.ds[i];if(d>maxDist){maxDist=d;face=i;}}if(maxDist<=0){normal=rot(w.q,g.normals[face]);signedDistance=maxDist;return p-normal*maxDist;}
 float best=1e30f;V bestP;for(int f=0;f<g.nf;f++){V vs[40];int nv=0;for(int i=0;i<g.nv;i++)if(absf(dot(g.normals[f],g.vertices[i])-g.ds[f])<.002f)vs[nv++]=g.vertices[i];if(nv<3)continue;V center;for(int i=0;i<nv;i++)center+=vs[i]/float(nv);for(int i=0;i<nv;i++)for(int j=i+1;j<nv;j++){V ab=vs[j]-vs[i];bool side=true;float sign=0;for(int k=0;k<nv;k++){float d=dot(cross(ab,vs[k]-vs[i]),g.normals[f]);if(absf(d)<.0001f)continue;if(sign==0)sign=d;else if(d*sign<0){side=false;break;}}if(!side)continue;V point=closestTriangle(local,center,vs[i],vs[j]);float dist=len2(local-point);if(dist<best){best=dist;bestP=point;}}}signedDistance=sqrtf_(best);normal=rot(w.q,unit(local-bestP));return w.c+rot(w.q,bestP);
}
static void spherePoly(const WorldPrim&s,const WorldPrim&b,bool reverse){V n;float d;V p=closestPoly(b,s.c,n,d);float depth=s.h.x-d;if(depth<-.012f)return;p=(p+s.c-n*s.h.x)*.5f;if(reverse)contact(b.body,s.body,b.index,s.index,p,n,depth);else contact(s.body,b.body,s.index,b.index,p,-n,depth);}
// Smooth cylindrical tread against a box face, retaining true rolling radius.
// Edge/corner cases use the convex support hull instead of a giant bounding box.
static bool cylinderFace(const WorldPrim&c,const WorldPrim&b,bool reverse){
 V delta=c.c-b.c;float best=1e30f;int ax=0;V n;for(int i=0;i<3;i++){V ni=b.axis[i];float d=absf(dot(ni,delta)),ad=dot(c.axis[1],ni),radius=c.h.y*absf(ad)+c.h.x*sqrtf_(maxf(0,1-ad*ad)),depth=b.h[i]+radius-d;if(depth<-.012f)return true;if(depth<best){best=depth;ax=i;n=ni*(dot(ni,delta)>=0?1.f:-1.f);}}
 // This specialized manifold is valid only when the tread's support is on the face.
 float axial=dot(c.axis[1],n);V radial=n-c.axis[1]*axial;float rlen=len(radial);if(rlen<1e-6f)return false;radial=radial/rlen;V cp=c.c-radial*c.h.x;V points[2];int count=0;
 if(absf(axial)<.08f){points[count++]=cp-c.axis[1]*c.h.y;points[count++]=cp+c.axis[1]*c.h.y;}else points[count++]=cp-c.axis[1]*(axial>0?c.h.y:-c.h.y);
 for(int k=0;k<count;k++)for(int i=0;i<3;i++)if(i!=ax&&absf(dot(points[k]-b.c,b.axis[i]))>b.h[i]-.003f)return false;
 float plane=dot(b.c,n)+b.h[ax];for(int k=0;k<count;k++){float dep=plane-dot(points[k],n);if(dep<-.012f)continue;V p=points[k]+n*(dep*.5f);if(reverse)contact(b.body,c.body,b.index,c.index,p,n,dep);else contact(c.body,b.body,c.index,b.index,p,-n,dep);}return true;
}
static void collidePrims(const WorldPrim&a,const WorldPrim&b){if(!aabb(a.lo,a.hi,b.lo,b.hi))return;if(a.p->kind==3&&b.p->kind==0&&cylinderFace(a,b,false))return;if(b.p->kind==3&&a.p->kind==0&&cylinderFace(b,a,true))return;if(a.p->kind==1&&b.p->kind==1)sphereSphere(a,b);else if(a.p->kind==1){if(b.p->kind==0)sphereBox(a,b,false);else spherePoly(a,b,false);}else if(b.p->kind==1){if(a.p->kind==0)sphereBox(b,a,true);else spherePoly(b,a,true);}else if(a.p->kind==0&&b.p->kind==0)boxBox(a,b);else polyPoly(a,b);}
static bool isDisabled(int a,int b){Body&A=bodies[a],&B=bodies[b];if(A.group!=B.group||A.filter!=B.filter||A.filter==0)return false;u32 bit=u32(a)*MAX_B+u32(b);return (disabled[bit>>5]>>(bit&31))&1;}
static void sortBodies(int l,int r){int i=l,j=r;float p=bodies[sorted[(l+r)/2]].lo.x;while(i<=j){while(bodies[sorted[i]].lo.x<p)i++;while(bodies[sorted[j]].lo.x>p)j--;if(i<=j){int t=sorted[i];sorted[i++]=sorted[j];sorted[j--]=t;}}if(l<j)sortBodies(l,j);if(i<r)sortBodies(i,r);}


// Refit BVH over complete body bounds. It rejects only impossible pairs;
// candidates are sorted back into the legacy sweep order before contact tests.
struct BroadNode {V lo,hi;int left=-1,right=-1,body=-1,maxRank=-1;};
static BroadNode broadNodes[MAX_B*2];static int broadIDs[MAX_B],broadMembers[MAX_B],broadRanks[MAX_B],broadCandidates[MAX_B];
static int broadCount=0,broadMemberCount=-1,broadFrame=0;
static float centroid(int body,int axis){return (bodies[body].lo[axis]+bodies[body].hi[axis])*.5f;}
static bool broadLess(int a,int b,int axis){float x=centroid(a,axis),y=centroid(b,axis);return x<y||(x==y&&a<b);}
static void broadSort(int l,int r,int axis){int i=l,j=r,p=broadIDs[(l+r)/2];while(i<=j){while(broadLess(broadIDs[i],p,axis))i++;while(broadLess(p,broadIDs[j],axis))j--;if(i<=j){int t=broadIDs[i];broadIDs[i++]=broadIDs[j];broadIDs[j--]=t;}}if(l<j)broadSort(l,j,axis);if(i<r)broadSort(i,r,axis);}
static int broadBuild(int l,int r){int n=broadCount++;BroadNode&node=broadNodes[n];node.body=-1;
 if(l==r){node.body=broadIDs[l];return n;}
 V lo(1e30f,1e30f,1e30f),hi(-1e30f,-1e30f,-1e30f);
 for(int i=l;i<=r;i++)for(int k=0;k<3;k++){float c=centroid(broadIDs[i],k);lo[k]=minf(lo[k],c);hi[k]=maxf(hi[k],c);}
 V span=hi-lo;int axis=span.y>span.x?1:0;if(span.z>span[axis])axis=2;
 broadSort(l,r,axis);int mid=(l+r)/2;node.left=broadBuild(l,mid);node.right=broadBuild(mid+1,r);return n;
}
static void broadPrepare(){
 int n=0;bool changed=false;
 for(int i=0;i<bCount;i++)if(bodies[i].exists&&bodies[i].added){if(n>=broadMemberCount||broadMembers[n]!=i)changed=true;broadMembers[n++]=i;}
 changed=changed||n!=broadMemberCount;broadMemberCount=n;
 if(changed||broadFrame++%32==0){for(int i=0;i<n;i++)broadIDs[i]=broadMembers[i];broadCount=0;if(n)broadBuild(0,n-1);}
 for(int i=0;i<sortedN;i++)broadRanks[sorted[i]]=i;
 for(int i=broadCount-1;i>=0;i--){BroadNode&node=broadNodes[i];if(node.body>=0){node.lo=bodies[node.body].lo;node.hi=bodies[node.body].hi;node.maxRank=broadRanks[node.body];}
 else{const auto&a=broadNodes[node.left];const auto&b=broadNodes[node.right];for(int k=0;k<3;k++){node.lo[k]=minf(a.lo[k],b.lo[k]);node.hi[k]=maxf(a.hi[k],b.hi[k]);}node.maxRank=a.maxRank>b.maxRank?a.maxRank:b.maxRank;}}
}
static void rankSort(int *a,int l,int r){int i=l,j=r,p=a[(l+r)/2];while(i<=j){while(a[i]<p)i++;while(a[j]>p)j--;if(i<=j){int t=a[i];a[i++]=a[j];a[j--]=t;}}if(l<j)rankSort(a,l,j);if(i<r)rankSort(a,i,r);}
static void broadQuery(int nodeIndex,int rank,const Body&A,int &count){const auto&node=broadNodes[nodeIndex];
 if(node.maxRank<=rank||!aabb(A.lo,A.hi,node.lo,node.hi))return;
 if(node.body>=0){broadCandidates[count++]=broadRanks[node.body];return;}
 broadQuery(node.left,rank,A,count);broadQuery(node.right,rank,A,count);
}
static void collisions(){
 worldEpoch++;worldUsed=geometryUsed=0;useWorldCache=true;cCount=0;sortedN=0;
 for(int i=0;i<bCount;i++)if(bodies[i].exists&&bodies[i].added)sorted[sortedN++]=i;
 if(sortedN>1)sortBodies(0,sortedN-1);
 if(sortedN>128)broadPrepare();
 for(int i=0;i<sortedN;i++){
  int a=sorted[i];Body&A=bodies[a];int count=0;
  if(sortedN>128){broadQuery(0,i,A,count);if(count>1)rankSort(broadCandidates,0,count-1);}
  else for(int j=i+1;j<sortedN;j++){if(bodies[sorted[j]].lo.x>A.hi.x+.012f)break;broadCandidates[count++]=j;}
  for(int k=0;k<count;k++){
   int b=sorted[broadCandidates[k]];Body&B=bodies[b];
   if(A.invMass+B.invMass==0||((!A.active||A.motion==0)&&(!B.active||B.motion==0))||isDisabled(a,b)||!aabb(A.lo,A.hi,B.lo,B.hi))continue;
   int start=cCount;Shape&as=shapes[A.shape],&bs=shapes[B.shape];
   for(int m=0;m<as.count;m++){WorldPrim pa=wp(a,m);if(!aabb(pa.lo,pa.hi,B.lo,B.hi))continue;for(int n=0;n<bs.count;n++)collidePrims(pa,wp(b,n));}
   if(cCount>start&&touchCount<MAX_C){touchesA[touchCount]=a;touchesB[touchCount++]=b;}
  }
 }
}
static void prepContact(Contact&c,float dt){Body&A=bodies[c.a],&B=bodies[c.b];c.ra=c.p-A.p;c.rb=c.p-B.p;c.localA=rot(conj(Q{A.out[3],A.out[4],A.out[5],A.out[6]}),c.ra);c.localB=rot(conj(Q{B.out[3],B.out[4],B.out[5],B.out[6]}),c.rb);c.t1=unit(cross(c.n,absf(c.n.y)<.8f?V(0,1,0):V(1,0,0)));c.t2=cross(c.n,c.t1);
 c.angularNA=mv(A.invI,cross(c.ra,c.n));c.angularNB=mv(B.invI,cross(c.rb,c.n));
 c.angular1A=mv(A.invI,cross(c.ra,c.t1));c.angular1B=mv(B.invI,cross(c.rb,c.t1));
 c.angular2A=mv(A.invI,cross(c.ra,c.t2));c.angular2B=mv(B.invI,cross(c.rb,c.t2));
 c.nmass=1/maxf(1e-12f,effective(A,B,c.ra,c.rb,c.n));c.t1mass=1/maxf(1e-12f,effective(A,B,c.ra,c.rb,c.t1));c.t2mass=1/maxf(1e-12f,effective(A,B,c.ra,c.rb,c.t2));float vn=dot(pointV(B,c.rb)-pointV(A,c.ra),c.n);c.target=maxf(0,-minf(A.restitution,B.restitution)*minf(0,vn+1));if(c.depth<0)c.target=c.depth/dt; // speculative separation, no premature stopping
 c.friction=sqrtf_(maxf(0,A.friction*B.friction));Cache*old=getCache(c.key);if(old&&old->key==c.key&&old->tick==tickNo-1&&old->used!=tickNo){old->used=tickNo;c.normal=old->normal*.8f;c.f1=dot(old->friction,c.t1)*.8f;c.f2=dot(old->friction,c.t2)*.8f;V j=c.n*c.normal+c.t1*c.f1+c.t2*c.f2;applyImpulse(A,-j,c.ra);applyImpulse(B,j,c.rb);}}
// Inertia and contact axes stay fixed throughout the velocity iterations.
// Cache their response once, rather than repeating six matrix-vector products
// per contact per iteration. Equivalent equations; roundoff can differ.
static inline void solveContactBodies(Contact& __restrict c,Body* __restrict pa,Body* __restrict pb){
 Body&A=*pa,&B=*pb;V rv=pointV(B,c.rb)-pointV(A,c.ra);
 float old=c.normal;c.normal=maxf(0,old+(c.target-dot(rv,c.n))*c.nmass);float d=c.normal-old;
 V j=c.n*d;
 if(d!=0){if(A.invMass>0){A.v-=j*A.invMass;A.w-=c.angularNA*d;}if(B.invMass>0){B.v+=j*B.invMass;B.w+=c.angularNB*d;}rv=pointV(B,c.rb)-pointV(A,c.ra);}
 float f1=c.normal==0?0:c.f1-dot(rv,c.t1)*c.t1mass,f2=c.normal==0?0:c.f2-dot(rv,c.t2)*c.t2mass,l=sqrtf_(f1*f1+f2*f2),lim=c.friction*c.normal;
 if(l>lim&&l>0){f1*=lim/l;f2*=lim/l;}
 float d1=f1-c.f1,d2=f2-c.f2;if(d1==0&&d2==0)return;j=c.t1*d1+c.t2*d2;c.f1=f1;c.f2=f2;
 if(A.invMass>0){A.v-=j*A.invMass;A.w-=c.angular1A*d1+c.angular2A*d2;}
 if(B.invMass>0){B.v+=j*B.invMass;B.w+=c.angular1B*d1+c.angular2B*d2;}
}

static void solveContact(Contact&c){solveContactBodies(c,&bodies[c.a],&bodies[c.b]);}
