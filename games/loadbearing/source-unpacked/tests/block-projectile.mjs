import assert from 'node:assert/strict';
import {build} from 'esbuild';
await build({stdin:{contents:"export {Simulation,loadPhysics} from './src/physics.ts';export {blockProjectileLayout} from './src/block-projectile.ts';",resolveDir:process.cwd()},bundle:true,platform:'node',format:'esm',external:['jolt-physics'],outfile:'artifacts/block-projectile-test.mjs'});
const {Simulation,loadPhysics,blockProjectileLayout}=await import('../artifacts/block-projectile-test.mjs?'+Date.now());
const layout=blockProjectileLayout(3);assert.equal(layout.cells.length,19);assert.equal(layout.links.length,30);
for(const c of layout.cells)assert.ok(Math.hypot(...c.offset.map((v,i)=>Math.abs(v)+c.size[i]/2))<=3);
const J=await loadPhysics();
const sim=new Simulation(J,[],'sandbox',1,{sandbox:true,fragmentLimit:300});
try{
 const shot=sim.launchProjectile([0,40,0],[20,0,0],19000,3,'blocks',true);assert.ok(shot);
 const parts=sim.items.filter(i=>i.blockShot===shot.blockShot);assert.equal(parts.length,19);assert.equal(sim.joints.length,30);assert.equal(parts.reduce((n,i)=>n+i.sourceMass,0),19000);
 for(let i=0;i<30;i++)sim.step();assert.equal(sim.broken,0,'Assembly stays intact in free flight');
 const distances=parts.map(i=>{const p=i.body.GetPosition();return Math.hypot(p.GetX()-parts[0].body.GetPosition().GetX(),p.GetY()-parts[0].body.GetPosition().GetY(),p.GetZ()-parts[0].body.GetPosition().GetZ())});assert.ok(distances.every(Number.isFinite));
 for(let i=0;i<20;i++)assert.ok(sim.launchProjectile([i*10,40,0],[0,0,0],19000,3,'blocks',true));
 assert.equal(sim.bodyList.length,5+4*19,'Original block bodies are reused');assert.equal(sim.fragments,76);assert.equal(sim.joints.length,120);
 console.log('PASS flight, mass, links and bounded shot-body recycling');
}finally{sim.dispose()}
const impact=new Simulation(J,[],'sandbox',1,{sandbox:true,fragmentLimit:300});
try{
 const shot=impact.launchProjectile([0,9,0],[0,-45,0],19000,3,'blocks');
 for(let i=0;i<120;i++)impact.step();
 assert.ok(impact.broken>0,'Ground impact breaks connections');assert.ok(impact.items.some(i=>i.blockShot===shot.blockShot&&i.fractured),'Building blocks themselves fracture');
 console.log('PASS destructible ground impact',{broken:impact.broken,fragments:impact.fragments});
}finally{impact.dispose()}

const retained=new Simulation(J,[],'sandbox',1,{sandbox:true,fragmentLimit:300});
try{for(let i=0;i<7;i++)retained.launchProjectile([i*10,30,0],[0,0,0],19000,3,'blocks');assert.equal(retained.fragments,7*19);assert.equal(retained.items.filter(i=>i.blockShot&&!i.fractured).length,133);retained.setFragmentLimit(24);assert.equal(retained.fragments,133,'Default does not delete existing shots when budget is reduced');assert.equal(retained.launchProjectile([0,40,0],[0,0,0],19000,3,'blocks'),undefined);console.log('PASS default retains all assemblies and rejects shots when budget exhausted');}finally{retained.dispose()}
const house=new Simulation(J,[{id:1,kind:'wall',p:[0,0,0],rotation:0}],'sandbox',1,{sandbox:true,fragmentLimit:300});
try{house.launchProjectile([0,2,-9],[0,0,40],38000,2,'blocks');for(let i=0;i<90;i++)house.step();assert.ok(house.items.find(i=>i.id===1).fractured,'Block shot damages house');assert.ok(house.items.some(i=>i.blockShot&&i.fractured),'Shot breaks too');console.log('PASS reciprocal house and projectile damage');}finally{house.dispose()}
