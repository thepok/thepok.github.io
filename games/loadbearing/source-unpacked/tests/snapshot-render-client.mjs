import assert from 'node:assert/strict';
import {build} from 'esbuild';
await build({entryPoints:['src/simulation-client.ts'],bundle:true,platform:'node',format:'esm',outfile:'artifacts/snapshot-render-client.mjs'});
let now=0;Object.defineProperty(globalThis,'performance',{value:{now:()=>now,timeOrigin:0},configurable:true});
globalThis.Worker=class{postMessage(){}terminate(){}};
globalThis.window={dispatchEvent(){}};
const {Simulation}=await import('../artifacts/snapshot-render-client.mjs'),s=new Simulation({},[],'sandbox');s.ready.catch(()=>{});
let next=0,previous=-Infinity,oldPrevious=-Infinity,oldBacksteps=0,lastArrival=0,lastPosition=0;
const packets=Array.from({length:60},(_,i)=>({at:i*100,arrival:i*100+[0,20,5,35][i%4],x:i/6}));
for(now=0;now<5900;now+=1000/120){
 while(next<packets.length&&packets[next].arrival<=now){
  const packet=packets[next],poses=new Float32Array(14);poses[0]=packet.x;poses[6]=1;poses[7]=10;poses[10]=1;
  s.onMessage({type:'snapshot',seq:next,sentAt:packet.at,records:next===0?[{id:-1000000,kind:'fragment'}]:undefined,poses,stress:new Float32Array(1),meta:{elapsed:next/60,rate:.8,paused:false}});
  lastArrival=now;lastPosition=packet.x;next++;
 }
 s.step();if(!s.items.length)continue;
 const body=s.items[0].body,p=body.GetRenderPosition().GetX(),old=lastPosition+10*Math.min(.05,(now-lastArrival)/1000)*.8;
 assert.ok(p>=previous-1e-8,'Confirmed forward movement must never visibly snap backwards');
 assert.ok(p<=body.GetPosition().GetX()+1e-8,'Do not render beyond confirmed physics');
 assert.equal(body.GetRenderPosition().GetX(),p,'Repeated lookups in one frame share one pose');
 if(old<oldPrevious-.03)oldBacksteps++;oldPrevious=old;previous=p;
}
assert.ok(oldBacksteps>20,'Replay reproduces the old speculative render bug');
const frozen=s.items[0].body.GetRenderPosition().GetX();s.pause(true);now+=1000;s.step();assert.equal(s.items[0].body.GetRenderPosition().GetX(),frozen);
s.pause(false);
s.onMessage({type:'snapshot',seq:100,sentAt:now,records:[],poses:new Float32Array(),stress:new Float32Array(),meta:{paused:false}});s.step();assert.equal(s.bodies.size,0,'Retired histories released');
s.dispose();console.log('PASS overloaded/jittered snapshots: '+oldBacksteps+' old backsteps, zero interpolated backsteps; frame coherence, pause and cleanup');
