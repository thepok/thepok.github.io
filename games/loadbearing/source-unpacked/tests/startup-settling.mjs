import assert from 'node:assert/strict';
import { mkdir } from 'node:fs/promises';
import { build } from 'esbuild';

await mkdir('artifacts',{recursive:true});
await build({stdin:{contents:"export {generateDemolitionBuilding} from './src/procedural-buildings.ts'; export {Simulation,loadPhysics} from './src/physics.ts';",resolveDir:process.cwd()},bundle:true,platform:'node',format:'esm',external:['jolt-physics'],outfile:'artifacts/startup-settling-bundle.mjs'});
const {generateDemolitionBuilding,Simulation,loadPhysics}=await import('../artifacts/startup-settling-bundle.mjs?'+Date.now());
const J=await loadPhysics(),pieces=generateDemolitionBuilding(1000,72000,'art-deco').pieces,rules={sandbox:true,fragmentLimit:156};
const run=(sim,steps)=>{for(let i=0;i<steps;i++)sim.step(1/60);};
const first=new Simulation(J,pieces,'sandbox',1,rules),startup=await first.settleStartup();
assert.ok(startup);assert.equal(first.elapsed,0,'preparation must not advance scenario clocks');assert.equal(first.broken,0);
const checkpoint=new J.StateRecorderImpl();first.system.SaveState(checkpoint);
run(first,600);assert.equal(first.broken,0,'structure broke after preparation');first.dispose();

const restore=()=>{const sim=new Simulation(J,pieces,'sandbox',1,rules);checkpoint.Rewind();assert.equal(sim.system.RestoreState(checkpoint),true,'checkpoint restore failed');sim.armStartupDamage();assert.equal(sim.elapsed,0);return sim;};
const restored=restore();run(restored,600);assert.equal(restored.broken,0,'restored structure broke');restored.dispose();
const weakened=restore();for(const joint of weakened.joints){joint.force*=.001;joint.torque=joint.torque.map(v=>v*.001);}run(weakened,72);assert.ok(weakened.broken>0,'persistent overload did not break weakened joints');weakened.dispose();
const shot=restore(),target=shot.items.find(item=>item.id>0&&item.kind==='slab');assert.ok(target);const p=target.body.GetPosition();assert.ok(shot.launchProjectile([p.GetX()+2,p.GetY()+10,p.GetZ()],[0,-65,0],20000,.7));run(shot,120);assert.ok(shot.broken>0||shot.fragments>0,'immediate post-preparation impact caused no fracture');shot.dispose();
J.destroy(checkpoint);
console.log('PASS startup settling, checkpoint restore, overload, and immediate impact',JSON.stringify(startup));
