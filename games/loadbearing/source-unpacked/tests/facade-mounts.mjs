import assert from 'node:assert/strict';import {build} from 'esbuild';
await build({stdin:{contents:"export {Simulation,loadPhysics} from './src/physics.ts';",resolveDir:process.cwd()},bundle:true,platform:'node',format:'esm',external:['jolt-physics'],outfile:'artifacts/facade-mounts.mjs'});
const {Simulation,loadPhysics}=await import('../artifacts/facade-mounts.mjs'),J=await loadPhysics();
const p=(id,kind,x,y,z)=>({id,kind,p:[x,y,z],rotation:0});
const s=new Simulation(J,[p(1,'foundation',0,0,2),p(2,'column',0,0,0),p(3,'column',4,0,0),p(4,'slab',0,4,2),p(5,'facade',0,0,0),p(6,'facade',0,4,0)],'sandbox',1,{sandbox:true});
const panels=s.items.filter(i=>i.kind==='facade');for(const panel of panels){const mounts=s.joints.filter(j=>j.a===panel||j.b===panel);assert.equal(mounts.length,1,'facade should not bridge multiple structural members');assert.equal(mounts[0].a.kind,panel.id===5?'foundation':'slab');}
for(let i=0;i<120;i++)s.step();assert.equal(s.broken,0);
const upper=panels[1],support=s.items.find(i=>i.id===4),lower=panels[0],joint=s.joints.find(j=>j.b===upper);
s.breakJoint(joint);assert.ok(s.pendingCollisions.size>0,'detached panel must regain neighbor collisions after separating');
assert.equal(s.attachmentCounts.get(upper.id),0);s.dispose();
// The large-building hub optimization must retain the same vertical wall bearings.
const stack=[p(1,'foundation',0,0,2),p(2,'wall',0,0,0),p(3,'wall',0,4,0),p(4,'slab',0,4,2),p(5,'column',0,0,0),p(6,'column',4,0,0)];
for(const count of [6,400]){const blueprint=[...stack,...Array.from({length:count-stack.length},(_,i)=>p(i+7,'column',100+i*4,0,100))],world=new Simulation(J,blueprint,'sandbox',1,{sandbox:true}),bearing=world.joints.find(j=>j.a.id===2&&j.b?.id===3);assert.equal(bearing?.localA.length,3,'vertical wall bearing sockets were dropped by sparse hubs');world.dispose();}
// An unsupportable loose blueprint must not be dropped invisibly during preparation.
const loose=new Simulation(J,Array.from({length:400},(_,i)=>p(i+1,'column',(i%20)*2,20,Math.floor(i/20)*2)),'sandbox',1,{sandbox:true});assert.equal(await loose.settleStartup(),null);assert.equal(loose.elapsed,0);assert.equal(loose.items[0].body.GetPosition().GetY(),20);loose.dispose();
console.log('PASS nonbearing facade mounts, detached collision release, unsupported startup guard');
