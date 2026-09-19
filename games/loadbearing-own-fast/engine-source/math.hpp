#pragma once
#include <wasm_simd128.h>
// LOAD BEARING / KINETIC — original rigid-body kernel, 2026.
// No Jolt, Bullet, Box2D, Rapier, PhysX, or other physics implementation.
// Freestanding C++17 -> WebAssembly. Public algorithms: rigid body impulse
// constraints, SAT/manifold clipping, conservative advancement, island sleeping.
// Copyright the LOAD BEARING project contributors. SPDX-License-Identifier: MIT
using u32=unsigned int;
using u64=unsigned long long;
#define API extern "C" __attribute__((visibility("default")))
static inline float minf(float a,float b){return a<b?a:b;}
static inline float maxf(float a,float b){return a>b?a:b;}
static inline float absf(float a){return __builtin_fabsf(a);}
static inline float sqrtf_(float a){return __builtin_sqrtf(a);}
static inline float clampf(float a,float l,float h){return maxf(l,minf(a,h));}
// Explicit 128-bit lanes; xyz use the original scalar operation ordering.
// The fourth lane is padding and never participates in a scalar norm/dot.
typedef float F4 __attribute__((ext_vector_type(4)));
struct alignas(16) V {union {F4 lanes;struct{float x,y,z,pad;};};
 V():lanes{0,0,0,0}{} V(float a,float b,float c):lanes{a,b,c,0}{}
 explicit V(F4 a):lanes(a){} float &operator[](int i){return (&x)[i];}float operator[](int i)const{return (&x)[i];}};
inline V operator+(V a,V b){return V(a.lanes+b.lanes);}inline V operator-(V a,V b){return V(a.lanes-b.lanes);}inline V operator-(V a){return V(-a.lanes);}inline V operator*(V a,float s){return V(a.lanes*s);}inline V operator*(float s,V a){return a*s;}inline V operator/(V a,float s){return a*(1/s);}inline V &operator+=(V &a,V b){a=a+b;return a;}inline V &operator-=(V &a,V b){a=a-b;return a;}inline V &operator*=(V &a,float s){a=a*s;return a;}
inline float dot(V a,V b){return a.x*b.x+a.y*b.y+a.z*b.z;}inline V cross(V a,V b){return V(__builtin_shufflevector(a.lanes,a.lanes,1,2,0,3)*__builtin_shufflevector(b.lanes,b.lanes,2,0,1,3)-__builtin_shufflevector(a.lanes,a.lanes,2,0,1,3)*__builtin_shufflevector(b.lanes,b.lanes,1,2,0,3));}inline float len2(V a){return dot(a,a);}inline float len(V a){return sqrtf_(dot(a,a));}inline V unit(V a){float l=len(a);return l>1e-12f?a/l:V(1,0,0);}inline V cap(V a,float n){float l=len2(a);return l>n*n?a*(n/sqrtf_(l)):a;}
struct Q {float x=0,y=0,z=0,w=1;};
inline Q qm(Q a,Q b){return {a.w*b.x+a.x*b.w+a.y*b.z-a.z*b.y,a.w*b.y-a.x*b.z+a.y*b.w+a.z*b.x,a.w*b.z+a.x*b.y-a.y*b.x+a.z*b.w,a.w*b.w-a.x*b.x-a.y*b.y-a.z*b.z};}inline Q conj(Q a){return {-a.x,-a.y,-a.z,a.w};}inline Q norm(Q a){float d=1/sqrtf_(a.x*a.x+a.y*a.y+a.z*a.z+a.w*a.w);return {a.x*d,a.y*d,a.z*d,a.w*d};}
inline V rot(Q q,V v){V a(q.x,q.y,q.z),t=cross(a,v)*2;return v+t*q.w+cross(a,t);}inline Q qdelta(V a){float l2=len2(a);if(l2>1.f)a=cap(a,1.f);return norm({a.x*.5f,a.y*.5f,a.z*.5f,1.f});}
struct M {float a[9]{};};
inline M diag(float a,float b,float c){M m;m.a[0]=a;m.a[4]=b;m.a[8]=c;return m;}inline V mv(const M &m,V v){const F4 a={m.a[0],m.a[3],m.a[6],0},b={m.a[1],m.a[4],m.a[7],0},c={m.a[2],m.a[5],m.a[8],0};return V((a*v.x+b*v.y)+c*v.z);}inline M operator+(M a,const M&b){for(int i=0;i<9;i++)a.a[i]+=b.a[i];return a;}inline M operator*(M a,float s){for(float &v:a.a)v*=s;return a;}
inline M inverse(M m){const float *a=m.a;M r;r.a[0]=a[4]*a[8]-a[5]*a[7];r.a[1]=a[2]*a[7]-a[1]*a[8];r.a[2]=a[1]*a[5]-a[2]*a[4];r.a[3]=a[5]*a[6]-a[3]*a[8];r.a[4]=a[0]*a[8]-a[2]*a[6];r.a[5]=a[2]*a[3]-a[0]*a[5];r.a[6]=a[3]*a[7]-a[4]*a[6];r.a[7]=a[1]*a[6]-a[0]*a[7];r.a[8]=a[0]*a[4]-a[1]*a[3];float det=a[0]*r.a[0]+a[1]*r.a[3]+a[2]*r.a[6];return absf(det)>1e-30f?r*(1/det):diag(0,0,0);}
// Two 3x3 products, instead of a four-deep scalar tensor contraction.
// Same R*I*R^T tensor; operation association may change the final rounding bits.
inline M rotated(M m,Q q){
 const V x=rot(q,{1,0,0}),y=rot(q,{0,1,0}),z=rot(q,{0,0,1});
 const V a=x*m.a[0]+y*m.a[3]+z*m.a[6],b=x*m.a[1]+y*m.a[4]+z*m.a[7],c=x*m.a[2]+y*m.a[5]+z*m.a[8];
 const V r=a*x.x+b*y.x+c*z.x,s=a*x.y+b*y.y+c*z.y,t=a*x.z+b*y.z+c*z.z;
 M out;out.a[0]=r.x;out.a[1]=s.x;out.a[2]=t.x;out.a[3]=r.y;out.a[4]=s.y;out.a[5]=t.y;out.a[6]=r.z;out.a[7]=s.z;out.a[8]=t.z;return out;
}
inline M momentMatrix(M i,V r){M out;for(int k=0;k<3;k++){V a;a[k]=1;V v=cross(mv(i,cross(r,a)),r);for(int j=0;j<3;j++)out.a[3*j+k]=v[j];}return out;}
constexpr int MAX_B=8192,MAX_J=50000,MAX_S=16384,MAX_P=65536,MAX_G=8192,MAX_C=50000,MAX_CACHE=131072;
