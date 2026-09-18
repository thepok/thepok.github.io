import assert from 'node:assert/strict';
import {build} from 'esbuild';
await build({stdin:{contents:"export {Simulation,loadPhysics} from './src/physics.ts'",resolveDir:process.cwd()},bundle:true,platform:'node',format:'esm',external:['jolt-physics'],outfile:'artifacts/rebar-test.mjs'});
const {Simulation,loadPhysics}=await import('../artifacts/rebar-test.mjs?'+Date.now());const J=await loadPhysics();
const pieces=[{id:1,kind:'foundation',p:[0,0,0],rotation:0},{id:2,kind:'column',p:[0,0,0],rotation:0},{id:3,kind:'slab',p:[0,4,0],rotation:0}];
console.log("engine ready");const sim=new Simulation(J,pieces,'sandbox',1,{sandbox:true});
try{
 const joint=sim.joints.find(j=>j.b&&[j.a.id,j.b.id].includes(2)&&[j.a.id,j.b.id].includes(3));assert.ok(joint);sim.breakJoint(joint);
 const link=sim.rebars.find(l=>!l.broken);assert.ok(link);assert.equal(link.constraint.GetMinDistance(),0);assert.equal(link.a.rebarLinks[0].to,link.b.id);
 const slab=sim.items.find(i=>i.id===3);sim.fracture(slab);
 const transferred=sim.rebars.find(l=>!l.broken&&((l.a.id===2&&l.b.kind==='fragment')||(l.b.id===2&&l.a.kind==='fragment')));assert.ok(transferred,'column must retain a physical attachment to the fractured slab');
 for(let i=0;i<120;i++)sim.step();assert.ok(sim.rebars.some(l=>!l.broken&&(l.a.id===2||l.b.id===2)),'rebar must survive ordinary gravity');
 console.log("gravity passed");const column=sim.items.find(i=>i.id===2);sim.fracture(column);assert.ok(sim.rebars.filter(l=>!l.broken).every(l=>!l.a.fractured&&!l.b.fractured),'no constraint may retain a removed body');
 const active=sim.rebars.find(l=>!l.broken);active.strength=.001;const v=new J.Vec3(100,100,100);active.b.body.SetLinearVelocity(v);J.destroy(v);for(let i=0;i<60;i++)sim.step();assert.ok(active.broken,'extreme tension must tear steel');
 sim.setFragmentLimit(24);assert.ok(sim.rebars.filter(l=>!l.broken).every(l=>!l.a.retired&&!l.b.retired));
 console.log('PASS cross-part reinforcement, gravity, fragment transfer, tensile failure and cleanup');
}finally{sim.dispose()}
