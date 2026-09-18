import assert from 'node:assert/strict';import {build} from 'esbuild';
await build({stdin:{contents:"export {fractureShapes,rotateByQuaternion} from './src/fracture';export {Simulation,loadPhysics} from './src/physics';export {PARTS} from './src/catalog';",resolveDir:process.cwd()},bundle:true,platform:'node',format:'esm',external:['jolt-physics'],outfile:'artifacts/glass-test.mjs'});
const {fractureShapes,Simulation,loadPhysics,PARTS}=await import('../artifacts/glass-test.mjs?'+Date.now());
for(let id=1;id<=100;id++){
 const chunks=fractureShapes({id,kind:'facade',p:[0,0,0],rotation:0});assert.equal(chunks.length,6);let area=0,mass=0;const momentum=[0,0,0];
 for(const chunk of chunks){const [a,b,c]=chunk.vertices;area+=Math.abs((b[0]-a[0])*(c[1]-a[1])-(b[1]-a[1])*(c[0]-a[0]))/2;mass+=chunk.mass;
  for(let axis=0;axis<3;axis++){assert.ok(Math.abs(chunk.vertices.reduce((sum,v)=>sum+v[axis],0))<1e-8,'centroid at body origin');momentum[axis]+=chunk.mass*chunk.kick[axis];}
  for(const v of chunk.vertices){for(let axis=0;axis<2;axis++)assert.ok(v[axis]+chunk.center[axis]>=.08-1e-8&&v[axis]+chunk.center[axis]<=3.92+1e-8);}
 }
 assert.ok(Math.abs(area-3.84*3.84)<1e-8);assert.ok(Math.abs(mass-PARTS.facade.mass)<1e-8);assert.ok(momentum.every(v=>Math.abs(v)<1e-8));
}
const J=await loadPhysics(),sim=new Simulation(J,[{id:11,kind:'facade',p:[0,4,0],rotation:0}],'sandbox',1,{sandbox:true,fragmentLimit:24});
try{
 sim.fracture(sim.items.find(i=>i.id===11));const shards=sim.items.filter(i=>i.kind==='fragment');assert.equal(shards.length,6);
 for(const item of shards){assert.equal(item.body.GetShape().GetSubType(),J.EShapeSubType_ConvexHull);const p=item.body.GetPosition(),c=item.body.GetCenterOfMassPosition();assert.ok(Math.hypot(p.GetX()-c.GetX(),p.GetY()-c.GetY(),p.GetZ()-c.GetZ())<1e-5);}
 for(let i=0;i<120;i++)sim.step();for(const item of shards){assert.ok(item.body.GetPosition().GetY()<8);assert.ok(item.body.GetLinearVelocity().Length()<30,'no overlapping sibling explosion');}
 console.log('PASS 100 pane partitions conserve area, mass and centroid; six actual convex Jolt hulls fall stably');
}finally{sim.dispose();}
