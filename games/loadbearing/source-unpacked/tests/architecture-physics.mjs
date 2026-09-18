import assert from 'node:assert/strict';import {build} from 'esbuild';
await build({stdin:{contents:"export {ARCHITECTURAL_SHOWCASES} from './src/architectural-showcases.ts';export {Simulation,loadPhysics} from './src/physics.ts';export {cost,validateBlueprint,ports} from './src/catalog.ts';",resolveDir:process.cwd()},bundle:true,platform:'node',format:'esm',external:['jolt-physics'],outfile:'artifacts/architecture-test.mjs'});
const {ARCHITECTURAL_SHOWCASES,Simulation,loadPhysics,cost,validateBlueprint,ports}=await import('../artifacts/architecture-test.mjs?'+Date.now());const J=await loadPhysics();
for(const model of ARCHITECTURAL_SHOWCASES){const pieces=model.pieces;assert.ok(validateBlueprint({scenario:'sandbox',pieces}));assert.ok(pieces.length<=180);assert.ok(cost(pieces)<=250000);const maxHeight=Math.max(...pieces.flatMap(p=>ports(p).map(v=>v[1])));assert.equal(maxHeight,model.height);const sim=new Simulation(J,pieces,'sandbox',1,{sandbox:true});for(let i=0;i<8*120;i++)sim.step();const moved=sim.items.filter(i=>i.id>0&&(()=>{const p=i.body.GetPosition();return Math.hypot(p.GetX()-i.initial[0],p.GetY()-i.initial[1],p.GetZ()-i.initial[2])>.5})()).length;console.log(model.id,pieces.length,'parts',cost(pieces),'cost',sim.broken,'broken',moved,'moved',sim.physicsMs.toFixed(2),'ms');assert.equal(sim.broken,0,model.id+' broke without impact');assert.equal(moved,0,model.id+' moved without impact');sim.dispose();}
console.log('PASS architecture budgets, real heights, blueprint format and 8s gravity stability');

const panel={id:2,kind:'facade',p:[0,0,0],rotation:0,finish:'teal'};
assert.ok(validateBlueprint(JSON.parse(JSON.stringify({scenario:'sandbox',pieces:[panel]}))));
assert.equal(validateBlueprint({scenario:'sandbox',pieces:[{...panel,finish:'invalid'}]}),false);
const sim=new Simulation(J,[{id:1,kind:'foundation',p:[0,0,0],rotation:0},panel],'sandbox',1,{sandbox:true});
for(let i=0;i<240;i++)sim.step();
sim.launchProjectile([2,2,10],[0,0,-35],20000,.7);
for(let i=0;i<360;i++)sim.step();
assert.ok(sim.broken>0,'Glass facade must detach under a heavy impact');
console.log('PASS glass facade physical impact and finish JSON validation',sim.broken,'broken');sim.dispose();
