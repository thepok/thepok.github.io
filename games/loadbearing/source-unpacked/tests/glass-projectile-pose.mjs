import assert from 'node:assert/strict';
import {build} from 'esbuild';
await build({stdin:{contents:"export {localFractureShapes} from './src/local-fracture'; export {Simulation,loadPhysics} from './src/physics';",resolveDir:process.cwd()},bundle:true,platform:'node',format:'esm',external:['jolt-physics'],outfile:'artifacts/glass-pose-test.mjs'});
const {localFractureShapes,Simulation,loadPhysics}=await import('../artifacts/glass-pose-test.mjs');
for(const size of [[.12,2,1],[1,2,.12],[2,.12,1]]){
 const center=[1,2,3],mass=17;
 const chunks=localFractureShapes({id:42,kind:'facade',p:[0,0,0],rotation:0},[0,0,0],{size,center,mass});
 assert.ok(Math.abs(chunks.reduce((s,c)=>s+c.mass,0)-mass)<1e-8);
 for(let a=0;a<3;a++){const coords=chunks.flatMap(c=>c.vertices.map(v=>c.center[a]+v[a]));assert.ok(Math.abs(Math.min(...coords)-(center[a]-size[a]/2))<1e-8);assert.ok(Math.abs(Math.max(...coords)-(center[a]+size[a]/2))<1e-8);}
}
const J=await loadPhysics(),sim=new Simulation(J,[],'sandbox',1,{sandbox:true,fragmentLimit:500});
try{
 const shot=sim.launchProjectile([0,40,0],[0,0,0],1,1,'storey');
 sim.projectileFlights.release(shot.blockShot);
 const panels=sim.items.filter(i=>i.blockShot===shot.blockShot&&i.sourceKind==='facade');
 for(const panel of panels){
  const q=new J.Quat(0,Math.sin(.37),0,Math.cos(.37));sim.bodies.SetRotation(panel.body.GetID(),q,J.EActivation_Activate);J.destroy(q);
  const before=sim.items.length;sim.fracture(panel);
  const shards=sim.items.slice(before);assert.equal(shards.length,6);
  assert.ok(Math.abs(shards.reduce((s,c)=>s+c.sourceMass,0)-panel.sourceMass)<1e-7);
  for(const shard of shards){assert.ok(Math.abs(shard.body.GetRotation().GetY()-Math.sin(.37))<1e-6);}
 }
 console.log('PASS actual glass bounds, all pane axes, mass and rotated projectile shard poses');
}finally{sim.dispose();}
