// An additional, strict quality gate: compare KINETIC 0.2 and this optimization
// after EVERY game step, separately from all timing measurements.
import {build} from 'esbuild';import assert from 'node:assert/strict';import {readFileSync,writeFileSync,mkdirSync} from 'node:fs';import {createHash} from 'node:crypto';
const preset=process.argv[2]??'art-deco';assert(['art-deco','brutalist','quiet'].includes(preset));
globalThis.__KINETIC_WASM__=readFileSync('src/own-engine/kernel.wasm');globalThis.__KINETIC_WASM_REFERENCE__=readFileSync('src/own-engine/kernel-v02.wasm');
mkdirSync('artifacts/cache',{recursive:true});
await build({stdin:{contents:"export {scenario,shotPlan} from './src/benchmark/suite.ts';export {Simulation} from './src/physics.ts';export {default as init} from './src/own-engine/compatibility.mjs';",resolveDir:process.cwd()},bundle:true,platform:'node',format:'esm',outfile:'artifacts/cache/equality-bundle.mjs'});
const {scenario,shotPlan,Simulation,init}=await import('../artifacts/cache/equality-bundle.mjs');
const cfg=scenario({preset,seed:0x51a7,fragmentLimit:1000}),worlds=[];
function fingerprint(s){
 const values=[s.elapsed,s.broken,s.fragments,s.items.length,s.joints.length,s.rebars.length];
 for(const i of s.items){const p=i.body.GetPosition(),q=i.body.GetRotation(),v=i.body.GetLinearVelocity(),w=i.body.GetAngularVelocity();values.push(i.id,+!!i.fractured,+!!i.retired,i.stress,p.GetX(),p.GetY(),p.GetZ(),q.GetX(),q.GetY(),q.GetZ(),q.GetW(),v.GetX(),v.GetY(),v.GetZ(),w.GetX(),w.GetY(),w.GetZ(),+!!i.body.IsActive());}
 for(const j of s.joints)values.push(+!!j.broken,j.damageStage??0,j.stress,j.overloadTime);
 for(const r of s.rebars)values.push(+!!r.broken,r.overloadTime);
 assert(values.every(Number.isFinite),'Non-finite physics state');
 return createHash('sha256').update(new Uint8Array(Float64Array.from(values).buffer)).digest('hex');
}
try{
 for(const variant of ['reference','optimized']){const J=await init({variant});const s=new Simulation(J,structuredClone(cfg.pieces),'sandbox',1,{sandbox:true,fragmentLimit:cfg.fragmentLimit,kineticVariant:variant},0);worlds.push(s);await s.settleStartup();}
 assert.equal(fingerprint(worlds[0]),fingerprint(worlds[1]),'Startup differs');
 for(let tick=0;tick<90;tick++){for(const s of worlds)s.step(cfg.dt);assert.equal(fingerprint(worlds[0]),fingerprint(worlds[1]),`Warmup differs: ${tick}`);}
 const plan=preset==='quiet'?[]:shotPlan(cfg.pieces,cfg.dt),hashes=[];
 for(let tick=0;tick<cfg.ticks;tick++){
  for(const s of worlds){for(const shot of plan)if(shot.tick===tick)assert(s.launchProjectile(shot.position,shot.velocity,shot.mass,shot.radius));s.step(cfg.dt);}
  const a=fingerprint(worlds[0]),b=fingerprint(worlds[1]);assert.equal(b,a,`${preset}: states differ after tick ${tick+1}`);hashes.push(b);
 }
 const result={preset,seed:cfg.seed,steps:cfg.ticks,warmupSteps:90,identicalEveryStep:true,baseline:'KINETIC 0.2',baselineSha256:createHash('sha256').update(globalThis.__KINETIC_WASM_REFERENCE__).digest('hex'),candidateSha256:createHash('sha256').update(globalThis.__KINETIC_WASM__).digest('hex'),final:{broken:worlds[1].broken,fragments:worlds[1].fragments},hashes,scope:'Exact IEEE-754 output states, damage accumulators and joint stages after every measured step. This establishes equality on these scenes, not all possible inputs.'};
 writeFileSync(`artifacts/cache/equality-${preset}.json`,JSON.stringify(result,null,2));console.log('CACHE_EQUALITY_PASS '+JSON.stringify({...result,hashes:undefined}));
}finally{for(const s of worlds)s.dispose();}
