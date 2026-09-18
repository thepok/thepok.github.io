import assert from 'node:assert/strict';import {build} from 'esbuild';
await build({stdin:{contents:"export {Simulation,loadPhysics} from './src/physics.ts';export {storeyProjectileLayout} from './src/storey-projectile.ts';",resolveDir:process.cwd()},bundle:true,platform:'node',format:'esm',external:['jolt-physics'],outfile:'artifacts/storey-projectile-test.mjs'});
const {Simulation,loadPhysics,storeyProjectileLayout}=await import('../artifacts/storey-projectile-test.mjs?'+Date.now());
const layout=storeyProjectileLayout(4),count=layout.cells.length;
assert.ok(count>=12&&count<=24);assert.deepEqual(new Set(layout.cells.map(c=>c.sourceKind)),new Set(['slab','column','wall','facade']));
const reached=new Set([0]);for(let pass=0;pass<count;pass++)for(const [a,b] of layout.links){if(reached.has(a))reached.add(b);if(reached.has(b))reached.add(a)}assert.equal(reached.size,count);
for(const cell of layout.cells)assert.ok(Math.hypot(...cell.offset.map((v,i)=>Math.abs(v)+cell.size[i]/2))<=4.00001);
for(let a=0;a<count;a++)for(let b=a+1;b<count;b++)assert.ok(layout.cells[a].offset.some((n,i)=>Math.abs(n-layout.cells[b].offset[i])>=((layout.cells[a].size[i]+layout.cells[b].size[i])/2)-1e-6),'Parts must not overlap');
for(const [a,b] of layout.links){const overlaps=layout.cells[a].offset.map((n,i)=>Math.min(n+layout.cells[a].size[i]/2,layout.cells[b].offset[i]+layout.cells[b].size[i]/2)-Math.max(n-layout.cells[a].size[i]/2,layout.cells[b].offset[i]-layout.cells[b].size[i]/2));assert.ok(overlaps.every(n=>n>=-1e-6)&&overlaps.filter(n=>n>1e-6).length>=2,'Links must join touching faces');}
const J=await loadPhysics();const sim=new Simulation(J,[],'sandbox',1,{sandbox:true,fragmentLimit:500});
try{
 const shot=sim.launchProjectile([0,40,0],[15,0,0],15000,4,'storey');const members=sim.items.filter(i=>i.blockShot===shot.blockShot);assert.equal(members.length,count);assert.ok(Math.abs(members.reduce((n,i)=>n+i.sourceMass,0)-layout.cells.reduce((n,c)=>n+c.massWeight,0))<1e-6);
 const other=sim.launchProjectile([20,40,0],[15,0,0],999999,4,'storey');assert.deepEqual(sim.items.filter(i=>i.blockShot===other.blockShot).map(i=>i.sourceMass),members.map(i=>i.sourceMass),'Mass slider does not alter storey parts');
 for(let i=0;i<90;i++)sim.step();assert.ok(members.every(i=>!i.fractured),'Storey stays intact in free flight');assert.equal(sim.broken,0);
 for(let n=0;n<12;n++){sim.launchProjectile([n*12,40,0],[0,0,0],15000,4,n%2?'blocks':'storey',true);sim.step();}assert.ok(sim.items.every(i=>Number.isFinite(i.body.GetPosition().GetX())));console.log('PASS floor structure, bounds, flight, mass and mixed recycling',count);
}finally{sim.dispose()}
const impact=new Simulation(J,[],'sandbox',1,{sandbox:true,fragmentLimit:500});
try{const shot=impact.launchProjectile([0,10,0],[0,-40,0],15000,4,'storey');for(let i=0;i<160;i++)impact.step();assert.ok(impact.broken>0);assert.ok(impact.items.some(i=>i.rootPieceId===shot.rootPieceId&&i.fractured));assert.ok(impact.items.some(i=>i.sourceKind==='facade'&&i.fractured));console.log('PASS floor impact and glass shattering');}finally{impact.dispose()}

for(const count of [16,32,64,160,320]){
 const design=storeyProjectileLayout(count);assert.equal(design.count,count);const connected=new Set([0]);for(let i=0;i<count;i++)for(const [a,b] of design.links){if(connected.has(a))connected.add(b);if(connected.has(b))connected.add(a)}assert.equal(connected.size,count,'All generated rooms connected');
 assert.deepEqual(design.cells[0].size,layout.cells[0].size,'Part sizes stay fixed');assert.ok(Math.abs(design.mass-layout.mass*count/16)<1e-6);for(let a=0;a<count;a++)for(let b=a+1;b<count;b++)assert.ok(design.cells[a].offset.some((v,i)=>Math.abs(v-design.cells[b].offset[i])>=(design.cells[a].size[i]+design.cells[b].size[i])/2-1e-6),'Rooms do not overlap');
}
const material=new Simulation(J,[],'sandbox',1,{sandbox:true,fragmentLimit:500});
try{
 const a=material.launchProjectile([0,40,0],[0,0,0],1,.01,'storey',false,{parts:64,concreteStrength:2,reinforcement:0});
 const b=material.launchProjectile([30,40,0],[0,0,0],999999,100,'storey',false,{parts:64,concreteStrength:1,reinforcement:2});
 const ap=material.items.filter(i=>i.blockShot===a.blockShot),bp=material.items.filter(i=>i.blockShot===b.blockShot);assert.equal(ap.length,64);assert.deepEqual(ap.map(i=>[i.sourceMass,i.size]),bp.map(i=>[i.sourceMass,i.size]));assert.ok(ap.filter(i=>i.sourceKind!=='facade').every(i=>i.concreteStrength===2&&i.reinforcement===0));assert.ok(ap.filter(i=>i.sourceKind==='facade').every(i=>i.concreteStrength===1));const ja=material.joints.find(j=>j.a===ap[0]&&j.b?.sourceKind==='column'),jb=material.joints.find(j=>j.a===bp[0]&&j.b?.sourceKind==='column');assert.equal(ja.force,jb.force*2);assert.equal(material.yieldJoint(ja),false);assert.equal(material.yieldJoint(jb),true);console.log('PASS fixed part sizes, connected generation, automatic mass, concrete and reinforcement controls');
}finally{material.dispose()}
