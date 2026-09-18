import {build} from 'esbuild';
import assert from 'node:assert/strict';
await build({stdin:{contents:"export {Simulation,loadPhysics} from './src/physics.ts';export {showcasePieces} from './src/showcases.ts'",resolveDir:process.cwd()},bundle:true,platform:'node',format:'esm',external:['jolt-physics'],outfile:'artifacts/stability-bundle.mjs'});
const {Simulation,loadPhysics,showcasePieces}=await import('../artifacts/stability-bundle.mjs?'+Date.now());const J=await loadPhysics();
const sim=new Simulation(J,showcasePieces(process.argv[2]??'aurora-tower'),'sandbox',1,{sandbox:true});
if(process.argv.includes('--no-fracture'))sim.fracture=()=>{};
for(let i=0;i<240;i++)sim.step();
sim.launchProjectile([10,18,0],[-Number(process.argv[4]??15),0,0],Number(process.argv[3]??1000),.7);
const samples=[];
for(let sec=0;sec<8;sec++){
 for(let i=0;i<120;i++)sim.step();
 let kinetic=0,potential=0,maxSpeed=0,moved=0;
 for(const item of sim.items){if(item.fractured)continue;const p=item.body.GetCenterOfMassPosition(),v=item.body.GetLinearVelocity(),mass=1/item.body.GetMotionProperties().GetInverseMass(),speed=v.Length();kinetic+=.5*mass*speed*speed;potential+=mass*9.81*p.GetY();maxSpeed=Math.max(maxSpeed,speed);if(item.id>0&&Math.hypot(p.GetX()-item.initial[0],p.GetZ()-item.initial[2])>3)moved++;}
 samples.push({kinetic,broken:sim.broken});
 console.log(JSON.stringify({t:sim.elapsed.toFixed(1),broken:sim.broken,fragments:sim.fragments,kinetic:Math.round(kinetic),potential:Math.round(potential),maxSpeed:Math.round(maxSpeed),moved,ms:sim.physicsMs.toFixed(1)}));
}
if(process.argv.includes('--assert-decay')){assert.ok(samples[7].kinetic<samples[0].kinetic*.1,'Post-impact motion must decay');assert.equal(samples[7].broken,samples[6].broken,'New failures must settle');console.log('PASS bounded post-impact motion and settled damage');}
sim.dispose();
