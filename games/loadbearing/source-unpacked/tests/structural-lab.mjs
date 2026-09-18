import assert from 'node:assert/strict';
import {build} from 'esbuild';
await build({stdin:{contents:"export {Simulation,loadPhysics} from './src/physics.ts';export {PARTS} from './src/catalog.ts';",resolveDir:process.cwd()},bundle:true,platform:'node',format:'esm',external:['jolt-physics'],outfile:'artifacts/structural-lab.mjs'});
const {Simulation,loadPhysics,PARTS}=await import('../artifacts/structural-lab.mjs?'+Date.now());
const J=await loadPhysics(),rules={sandbox:true,fragmentLimit:3000};
const part=(id,kind,p)=>({id,kind,p,rotation:0});
function advance(s,n){for(let i=0;i<n;i++)s.step();for(const item of s.items){const p=item.body.GetPosition();assert.ok([p.GetX(),p.GetY(),p.GetZ()].every(Number.isFinite));}}

// A support connection can fail without the suspended concrete disintegrating.
{
 const s=new Simulation(J,[part(1,'column',[0,12,0])],'sandbox',1,rules),column=s.items.find(i=>i.id===1);
 s.join(column,undefined,[0,12,0]);const j=s.joints.at(-1);advance(s,65);j.force=1;j.torque=[1,1,1];s.bodies.ActivateBody(column.body.GetID());
 advance(s,45);assert.ok(j.broken);assert.equal(column.fractured,undefined);assert.equal(s.fragments,0);
 console.log('PASS detached concrete remains whole in the air');s.dispose();
}
// Damage at the foot of a column retains the top port and the floor above.
{
 const s=new Simulation(J,[part(1,'foundation',[0,0,0]),part(2,'column',[0,0,0]),part(3,'slab',[0,4,0])],'sandbox',1,rules);
 const column=s.items.find(i=>i.id===2),slab=s.items.find(i=>i.id===3);s.fracture(column,[0,.6,0]);
 const fragments=s.items.filter(i=>i.kind==='fragment'&&!i.fractured),upper=fragments.find(i=>i.structural&&i.size[1]>2);
 assert.ok(upper);assert.ok(s.joints.some(j=>!j.broken&&((j.a===upper&&j.b===slab)||(j.a===slab&&j.b===upper))),'top attachment transferred to stiff remainder');
 assert.ok(s.rebars.filter(r=>!r.broken).every(r=>r.limit<=.18),'no full-length loose rebar chain');
 assert.ok(fragments.length<=4);assert.ok(Math.abs(fragments.reduce((v,f)=>v+f.sourceMass,0)-PARTS.column.mass)<1e-6);
 const joint=s.joints.find(j=>!j.broken&&j.a===upper||!j.broken&&j.b===upper);
 if(joint&&!joint.pinned){const count=s.joints.length;assert.equal(s.yieldJoint(joint),true);assert.equal(joint.damageStage,1);assert.equal(s.joints.length,count);assert.ok(joint.constraint.GetLimitsMax(3)>.05);assert.ok(joint.constraint.GetMaxFriction(3)>0);}
 s.fracture(upper,[0,2,0]);assert.ok(upper.fractured,'retained sections can fracture again');advance(s,90);assert.equal(s.fragments,s.items.filter(i=>i.kind==='fragment'&&!i.fractured).length,'recursive replacements conserve fragment budget');
 console.log('PASS local break, mass, surviving floor attachment, short rebar, progressive yield and recursive fracture', {fragments:s.fragments,bodies:s.bodyList.length});s.dispose();
}
// Detached floor slabs still break on a sufficiently hard ground collision.
{
 const s=new Simulation(J,[part(1,'slab',[0,12,0])],'sandbox',1,rules);advance(s,240);
 assert.ok(s.items.find(i=>i.id===1).fractured);assert.ok(s.fragments>0);
 console.log('PASS falling concrete breaks on ground impact');s.dispose();
}
// A controlled loss of three lower supports must permit coherent overturning.
{
 let id=1;const pieces=[part(id++,'foundation',[0,0,2])];
 for(let y=0;y<20;y+=4){for(const x of [0,4])for(const z of [0,4])pieces.push(part(id++,'column',[x,y,z]));pieces.push(part(id++,'slab',[0,y+4,2]));}
 const s=new Simulation(J,pieces,'sandbox',1,rules);advance(s,120);
 const upper=s.items.filter(i=>i.id>0&&i.initial[1]>=12);
 for(const column of s.items.filter(i=>i.kind==='column'&&i.initial[1]===0).slice(0,3))s.fracture(column,[column.initial[0],2.5,column.initial[2]]);
 // Remove only the severed lower support sections to represent a cleared breach.
 for(const f of s.items.filter(i=>i.kind==='fragment'&&!i.fractured&&i.body.GetCenterOfMassPosition().GetY()<3)){
  for(const j of s.jointNeighbors.get(f.id)??[])s.breakJoint(j,true);s.removeRebars(f);s.bodies.RemoveBody(f.body.GetID());s.removedBodies.add(f.body);f.fractured=true;f.retired=true;s.fragments--;
 }
 for(const item of s.items)if(!item.fractured)s.bodies.ActivateBody(item.body.GetID());
 advance(s,360);
 const intact=upper.filter(i=>!i.fractured),tilts=intact.map(i=>{const q=i.body.GetRotation();return Math.acos(Math.max(-1,Math.min(1,1-2*(q.GetX()**2+q.GetZ()**2))))});
 assert.equal(intact.length,upper.length,'upper building survives until ground impact');
 assert.ok(Math.max(...tilts)>.6,'gravity must overturn the supported assembly');
 console.log('PASS upper assembly tips while intact',{upper:intact.length,degrees:Math.max(...tilts)*180/Math.PI});s.dispose();
}
