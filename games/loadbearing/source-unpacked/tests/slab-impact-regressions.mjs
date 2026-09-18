import assert from 'node:assert/strict';
import {build} from 'esbuild';
await build({stdin:{contents:"export {Simulation,loadPhysics} from './src/physics.ts';",resolveDir:process.cwd()},bundle:true,platform:'node',format:'esm',external:['jolt-physics'],outfile:'artifacts/slab-impact-regressions.mjs'});
const {Simulation,loadPhysics}=await import('../artifacts/slab-impact-regressions.mjs?'+Date.now()),J=await loadPhysics();
const part=(id,kind,p)=>({id,kind,p,rotation:0});
for(const height of [.44,5]){
 const s=new Simulation(J,[part(1,'slab',[0,height,0])],'sandbox',1,{sandbox:true,fragmentLimit:3000});
 const slab=s.items.find(i=>i.id===1);s.launchProjectile([2,height+5,0],[0,-110,0],900,.3);
 for(let n=0;n<90&&!slab.fractured;n++)s.step();assert.ok(slab.fractured,`direct cannon hit at height ${height}`);
 const child=s.items.find(i=>i.structural&&!i.fractured),p=child.body.GetPosition();s.launchProjectile([p.GetX(),p.GetY()+5,p.GetZ()],[0,-110,0],900,.3);
 for(let n=0;n<90&&!child.fractured;n++)s.step();assert.ok(child.fractured,'a new shot fractures the retained plate again');
 assert.equal(s.fragments,s.items.filter(i=>i.kind==='fragment'&&!i.fractured).length);s.dispose();
}
let id=1;const pieces=[];
for(let n=0;n<16;n++){const x=(n%4)*8,z=Math.floor(n/4)*8;pieces.push(part(id++,'foundation',[x,0,z]),part(id++,'column',[x,0,z]),part(id++,'slab',[x,4,z]));}
const s=new Simulation(J,pieces,'sandbox',1,{sandbox:true,fragmentLimit:24});
for(const column of s.items.filter(i=>i.kind==='column'))s.fracture(column,[column.initial[0],2,column.initial[2]]);
const protectedRemnants=s.items.filter(i=>i.structural&&!i.fractured),slab=s.items.find(i=>i.kind==='slab'&&!i.fractured);
assert.ok(protectedRemnants.length>20,'fill the budget with real connected structural remnants');
assert.equal(s.makeFragmentRoom(4),false,'fixture must exhaust safely reclaimable debris slots');
s.fracture(slab,[slab.initial[0]+2,slab.initial[1],slab.initial[2]]);
assert.ok(slab.fractured,'budget exhaustion cannot make a slab invulnerable');
assert.ok(protectedRemnants.every(i=>!i.fractured),'other load-bearing pieces are not deleted to make room');
assert.ok(s.fragments<=24);s.dispose();
console.log('PASS ground/elevated slabs, repeated cannon shots and structural debris budget saturation');
