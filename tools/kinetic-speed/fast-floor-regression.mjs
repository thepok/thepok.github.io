import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import load from '../src/own-engine/compatibility.mjs';
const J=await load({wasmBinary:readFileSync('src/own-engine/kernel.wasm'),variant:'optimized'});
const world=new J.JoltInterface(new J.JoltSettings()),ps=world.GetPhysicsSettings();ps.mNumVelocitySteps=12;ps.mNumPositionSteps=3;world.SetPhysicsSettings(ps);
function box(position,size,mass){const shape=new J.BoxShape(new J.Vec3(...size.map(x=>x/2))),s=new J.BodyCreationSettings(shape,new J.RVec3(...position),new J.Quat(),mass?J.EMotionType_Dynamic:J.EMotionType_Static,mass?1:0);s.mMassPropertiesOverride.mMass=mass||1;s.mAllowSleeping=false;const b=world.CreateBody(s);world.AddBody(b.GetID(),J.EActivation_Activate);return b;}
box([0,-1,0],[1000,2,1000],0);
const fragment=box([0,1,0],[2,.12,1],500);fragment.SetLinearVelocity(new J.Vec3(4,-150,2));
let min=Infinity;for(let i=0;i<120;i++){world.Step(1/60,1);min=Math.min(min,fragment.GetPosition().GetY());}
assert.ok(min>-.15,`Thin fast debris tunneled through static ground: y=${min}`);
assert.equal(world.k.substeps_total(),120,'Test must exercise the large-world 60 Hz path');
assert.ok(fragment.GetPosition().GetX()>0,'Floor protection must not freeze tangential motion');
console.log('PASS thin fast debris stays above ground at 60 Hz',{minY:min,position:[fragment.GetPosition().GetX(),fragment.GetPosition().GetY(),fragment.GetPosition().GetZ()]});world.dispose();
