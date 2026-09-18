import assert from 'node:assert/strict';
import { mkdir } from 'node:fs/promises';
import { build } from 'esbuild';
await mkdir('artifacts',{recursive:true});
await build({stdin:{contents:"export { Simulation,loadPhysics } from './src/physics.ts';export { sample,validateBlueprint } from './src/catalog.ts';",resolveDir:process.cwd()},bundle:true,platform:'node',format:'esm',external:['jolt-physics'],outfile:'artifacts/physics-test.mjs'});
const {Simulation,loadPhysics,sample,validateBlueprint}=await import('../artifacts/physics-test.mjs?'+Date.now());
const J=await loadPhysics();
function run(sim,seconds=sim.duration+.1){for(let i=0;i<Math.ceil(seconds*120)&&!sim.result;i++)sim.step();for(const item of sim.items){const p=item.body.GetPosition();assert.ok([p.GetX(),p.GetY(),p.GetZ()].every(Number.isFinite),'nonfinite body state')}return sim;}
function test(name,fn){fn();console.log('PASS:',name)}

test('Reference bridge carries the full truck across on motorized wheels',()=>{
 const s=run(new Simulation(J,sample('bridge'),'bridge'));
 assert.equal(s.result,'passed',s.reason);assert.ok(s.truck.body.GetPosition().GetX()>14);assert.equal(s.broken,0,'reference design should remain intact');assert.equal(s.driveConstraints.length,4);s.dispose();
});
test('Removing the trusses makes the same deck fail under real gravity',()=>{
 const s=run(new Simulation(J,sample('bridge').filter(p=>p.kind==='deck'),'bridge'));
 assert.equal(s.result,'failed');assert.ok(s.truck.body.GetPosition().GetY()<-2);s.dispose();
});
test('A physical retaining wall protects the house; the same rockfall hits an unprotected house',()=>{
 const wall=run(new Simulation(J,sample('landslide'),'landslide'));
 assert.equal(wall.result,'passed',wall.reason);assert.equal(wall.rocks,20);const pos=wall.house.body.GetPosition();const protectedMove=Math.hypot(pos.GetX(),pos.GetY()-1.6,pos.GetZ()-5);assert.ok(protectedMove<.5);wall.dispose();
 const open=run(new Simulation(J,[],'landslide'));assert.equal(open.result,'failed');const p=open.house.body.GetPosition();assert.ok(Math.hypot(p.GetX(),p.GetY()-1.6,p.GetZ()-5)>.5,'rockfall must actually move the house');open.dispose();
});
for(const scenario of ['earthquake','wind','flood'])test(scenario+' applies physical loads for the full challenge',()=>{
 const s=run(new Simulation(J,sample(scenario),scenario));assert.equal(s.result,'passed',s.reason);assert.ok(s.elapsed>=18);assert.ok(s.peakStress>0);s.dispose();
});
test('All six occupancy waves add 50.4 tonnes and remain supported',()=>{
 const s=run(new Simulation(J,sample('occupancy'),'occupancy'));assert.equal(s.result,'passed',s.reason);assert.equal(s.occupancy.wave,6);assert.equal(s.occupancy.count,72);assert.ok(Math.abs(s.occupancy.tonnes-50.4)<.01);assert.ok(s.items.filter(i=>i.kind==='payload').every(i=>i.body.GetPosition().GetY()>2));s.dispose();
});
test('An empty frame cannot pass the occupancy objective without floors',()=>{
 const s=run(new Simulation(J,sample('occupancy').filter(p=>p.kind!=='slab'),'occupancy',1,{duration:3}));assert.equal(s.result,'failed');assert.equal(s.occupancy.count,0);s.dispose();
});
test('A launched object collides with a wall, and sandbox does not auto-finish',()=>{
 const pieces=[{id:1,kind:'foundation',p:[0,0,0],rotation:0},{id:2,kind:'wall',p:[0,0,0],rotation:0}];
 const s=new Simulation(J,pieces,'sandbox',1,{sandbox:true,duration:1});const shot=s.launchProjectile([-6,2,0],[12,0,0],2500,.5);run(s,2);assert.equal(s.result,null);const blockedX=shot.body.GetPosition().GetX();
 const open=new Simulation(J,[],'sandbox',1,{sandbox:true});const freeShot=open.launchProjectile([-6,2,0],[12,0,0],2500,.5);run(open,2);assert.ok(freeShot.body.GetPosition().GetX()>blockedX+2,'wall must alter the projectile trajectory');open.dispose();
 for(let i=1;i<60;i++)s.launchProjectile([-6,2,0],[12,0,0],2500,.5);assert.ok(s.launchProjectile([-6,2,0],[12,0,0],2500,.5),'default shots keep accumulating beyond the optional recycle pool');assert.equal(s.items.filter(i=>i.kind==='projectile').length,61);s.dispose();
});
test('Blueprint validation rejects invalid parts and nonfinite positions',()=>{
 assert.ok(validateBlueprint({scenario:'bridge',pieces:sample('bridge')}));assert.equal(validateBlueprint({scenario:'bridge',pieces:[{id:1,kind:'unknown',p:[0,0,0],rotation:0}]}),false);assert.equal(validateBlueprint({scenario:'bridge',pieces:[{id:1,kind:'deck',p:[0,Infinity,0],rotation:0}]}),false);
});
console.log('All physical and blueprint checks passed.');
