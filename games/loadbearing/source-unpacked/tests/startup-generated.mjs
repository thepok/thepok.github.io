import assert from 'node:assert/strict';
import { build } from 'esbuild';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
const bundle='artifacts/startup-generated-bundle.mjs';
if(!process.argv[2]){
 await build({stdin:{contents:"export {generateDemolitionBuilding} from './src/procedural-buildings.ts'; export {Simulation,loadPhysics} from './src/physics.ts';",resolveDir:process.cwd()},bundle:true,platform:'node',format:'esm',external:['jolt-physics'],outfile:bundle});
 let failures=0;
 for(const style of ['art-deco','skybridge','brutalist','classic'])for(const seed of style==='classic'?[72000]:[72000,12345,54321]){const r=spawnSync(process.execPath,[fileURLToPath(import.meta.url),style,String(seed)],{encoding:'utf8'});process.stdout.write(r.stdout);if(r.status){failures++;process.stderr.write(r.stderr);}}
 assert.equal(failures,0,'generated building startup regressions');
}else{
 const {generateDemolitionBuilding,Simulation,loadPhysics}=await import('../artifacts/startup-generated-bundle.mjs?'+Date.now()),J=await loadPhysics(),style=process.argv[2],seed=Number(process.argv[3]);
 const generated=generateDemolitionBuilding(1000,seed,style),sim=new Simulation(J,generated.pieces,'sandbox',1,{sandbox:true,fragmentLimit:156}),settle=await sim.settleStartup();for(let i=0;i<600;i++)sim.step(1/60);
 console.log(JSON.stringify({style,seed,parts:generated.pieces.length,joints:sim.joints.length,settleSteps:settle?.steps??null,quiet:settle?.quiet??false,broken:sim.broken,peakStress:sim.peakStress,finalStress:sim.maxStress,overloaded:sim.joints.filter(j=>j.stress>1&&!j.broken).slice(0,5).map(j=>({a:j.a.kind,b:j.b?.kind,p:j.a.initial,stress:j.stress}))}));assert.ok(settle?.quiet,`${style}/${seed} did not settle`);assert.equal(sim.broken,0,`${style}/${seed} broke at startup`);assert.ok(sim.maxStress<=1,`${style}/${seed} retains a persistent overload`);sim.dispose();
}
