"""Strict, numerical-quality-preserving optimization of the pinned KINETIC 0.2 source."""
from pathlib import Path
import sys,shutil,hashlib
root=Path(sys.argv[1]);engine=root/'src/own-engine'
assert hashlib.sha256((engine/'kernel.wasm').read_bytes()).hexdigest()=='f81ef353179dbb726c388f586e609293cb14f0f2d119579769b22f0058a36ad5'
shutil.copyfile(engine/'kernel.wasm',engine/'kernel-v02.wasm')
def patch(name,old,new):
 p=engine/name;s=p.read_text();assert s.count(old)==1,(name,old[:100],s.count(old));p.write_text(s.replace(old,new,1))
patch('bodies.hpp','float angularInv[3]{};V axes[3];','float angularInv[3]{};V axes[3];V velocityAngleError,velocityAngularDenominator;float pairInvTotal=0,pairFractionA=0,pairFractionB=0;')
patch('constraints.hpp',' if(cgEnabled&&weld)', ''' // Orientations and inertia remain constant during the velocity iterations.
 // Compute the same quantities once, without caching positional projection.
 if(j.kind==0&&!weld){
  Q a=qm(A.q,j.qa),b=qm(B.q,j.qb),qe=qm(b,conj(a));
  V err(qe.x,qe.y,qe.z);err*=qe.w<0?-2.f:2.f;
  for(int i=0;i<3;i++){
   V axis=j.axes[i];j.velocityAngleError[i]=dot(err,axis);
   j.velocityAngularDenominator[i]=dot(axis,mv(A.invI+B.invI,axis));
  }
 }
 if(cgEnabled&&weld)''')
patch('constraints.hpp','else{Q fa=qm(A.q,j.qa),fb=qm(B.q,j.qb),qe=qm(fb,conj(fa));V err(qe.x,qe.y,qe.z);err*=qe.w<0?-2.f:2.f;for(int i=0;i<3;i++){V axis=j.axes[i];float den=dot(axis,mv(A.invI+B.invI,axis));if(den<1e-15f)continue;float e=dot(err,axis),old=','else{for(int i=0;i<3;i++){V axis=j.axes[i];float den=j.velocityAngularDenominator[i];if(den<1e-15f)continue;float e=j.velocityAngleError[i],old=')
patch('constraints.hpp','if(weld){j.limited=2;j.n=j.ra-j.rb;','if(weld){j.limited=2;j.n=j.ra-j.rb;const float total=A.mass+B.mass;j.pairInvTotal=1/total;j.pairFractionA=A.mass/total;j.pairFractionB=B.mass/total;')
patch('projection.hpp','float total=A.mass+B.mass;V v=bv*(B.mass/total)','V v=bv*j.pairFractionB')
patch('projection.hpp','(A.mass/total)-bv','j.pairFractionA-bv')
patch('projection.hpp','static void cgMatrix(Six*in,Six*out)','static void cgMatrix(Six* __restrict in,Six* __restrict out)')
patch('collisions.hpp','static bool aabb(V lo,V hi,V lo2,V hi2,float margin=.012f){return lo.x<=hi2.x+margin&&hi.x+margin>=lo2.x&&lo.y<=hi2.y+margin&&hi.y+margin>=lo2.y&&lo.z<=hi2.z+margin&&hi.z+margin>=lo2.z;}', '''// Same six comparisons, evaluated in parallel; padding lane never participates.
static bool aabb(V lo,V hi,V lo2,V hi2,float margin=.012f){
 const v128_t m=wasm_f32x4_splat(margin);
 const v128_t left=wasm_f32x4_le((v128_t)lo.lanes,wasm_f32x4_add((v128_t)hi2.lanes,m));
 const v128_t right=wasm_f32x4_ge(wasm_f32x4_add((v128_t)hi.lanes,m),(v128_t)lo2.lanes);
 return (wasm_i32x4_bitmask(wasm_v128_and(left,right))&7)==7;
}''')
patch('compatibility.mjs',"engineVersion:'0.2.0'","engineVersion:'0.2.1'")
# Keep optimization_version=200: its documented meaning is the unchanged substep policy.
print('Cached yielded-joint geometry and weld mass fractions; exact SIMD AABB comparisons. No solver, timestep, geometry, material or fragment-budget changes versus 0.2.')
