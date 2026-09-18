import assert from 'node:assert/strict';
import {build} from 'esbuild';
await build({stdin:{contents:"export {Simulation,loadPhysics} from './src/physics'",resolveDir:process.cwd()},bundle:true,platform:'node',format:'esm',external:['jolt-physics'],outfile:'artifacts/projectile-debris-budget.mjs'});
const {Simulation,loadPhysics}=await import('../artifacts/projectile-debris-budget.mjs'),J=await loadPhysics();
const sim=new Simulation(J,[{id:1,kind:'column',p:[200,0,200],rotation:0}],'sandbox',1,{sandbox:true,fragmentLimit:64});
try {
 for(let n=0;n<40;n++){
  const shot=sim.launchProjectile([0,100,0],[0,0,10],1,1,'storey',false,{parts:64,concreteStrength:1,reinforcement:1});
  assert.ok(shot,'New shot replaces old debris even without four-shot recycling');
  assert.equal(sim.fragments,64);
  assert.equal(sim.items.filter(i=>i.kind==='fragment'&&!i.fractured).length,64);
  assert.ok(sim.joints.every(j=>j.broken||(!j.a.retired&&!j.b?.retired)),'No live joints to retired bodies');
  assert.ok(sim.rebars.every(r=>r.broken||(!r.a.retired&&!r.b.retired)));
  assert.equal(sim.projectileFlights.flights.size,1,'No orphan flight compounds');
  assert.equal(sim.items.find(i=>i.id===1).fractured,undefined,'Building retained');
  sim.step();
 }
 console.log('PASS 40 full-budget shots, flying compound cleanup, live links and building preserved');
}finally{sim.dispose()}
const order=new Simulation(J,[],'sandbox',1,{sandbox:true,fragmentLimit:48});
try {
 const shoot=parts=>order.launchProjectile([0,100,0],[0,0,0],1,1,'storey',false,{parts,concreteStrength:1,reinforcement:1});
 const old=shoot(32);order.elapsed=1;const newer=shoot(16);order.elapsed=2;
 assert.ok(shoot(16));assert.equal(order.fragments,48);
 assert.equal(order.items.filter(i=>i.blockShot===old.blockShot&&i.retired).length,16);
 assert.equal(order.items.filter(i=>i.blockShot===newer.blockShot&&i.retired).length,0);
 assert.equal(order.makeFragmentRoom(64,true),false,'Impossible request must not erase the world');
 assert.equal(order.fragments,48);
 console.log('PASS oldest-first eviction, partial flight release and impossible-budget preservation');
}finally{order.dispose()}
