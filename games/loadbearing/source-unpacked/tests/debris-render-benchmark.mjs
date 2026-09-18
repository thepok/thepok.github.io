import {chromium} from '@playwright/test';
const browser=await chromium.launch({channel:'chrome',headless:true});
const page=await browser.newPage({viewport:{width:1536,height:960}});
try {
 await page.goto('http://localhost:5174');await page.waitForFunction(()=>window.__loadBearing?.ready);
 await page.click('#workshop-mode');await page.click('#vehicle-mode');await page.click('#vehicle-drive');
 await page.waitForFunction(()=>window.__loadBearing.simulation?.elapsed>1);
 console.log(await page.evaluate(async()=>{
  const a=window.__loadBearing,s=a.scene,sim=a.simulation;sim.pause(true);
  const original=s.updatePhysics,render=s.render,base=sim.items.filter(x=>x.kind!=='fragment');
  const items=Array.from({length:3000},(_,i)=>{const p={GetX:()=>((i%30)-15)*1.3,GetY:()=>.6+Math.floor(i/900)*2,GetZ:()=>-5-Math.floor(i/30)%30*1.3},q={GetX:()=>0,GetY:()=>0,GetZ:()=>0,GetW:()=>1};return {id:-100000-i,kind:'fragment',sourceKind:i%5===0?'facade':'slab',size:[.8,.3,.7],body:{GetPosition:()=>p,GetRotation:()=>q,GetLinearVelocity:()=>p,IsActive:()=>false}}});
  const view=new Proxy(sim,{get:(o,k)=>k==='items'?[...base,...items]:Reflect.get(o,k)});
  s.updatePhysics=function(){return original.call(this,view)};
  s.camera.position.set(45,40,50);s.controls.target.set(0,2,-20);s.controls.enabled=false;a.vehicleWorkshop.driving=false;s.camera.lookAt(s.controls.target);
  let measuring=false,previous=0,rows=[];
  s.render=function(dt){const t=performance.now();const result=render.call(this,dt);if(measuring){rows.push({render:performance.now()-t,gap:t-previous});previous=t}return result};
  await new Promise(r=>setTimeout(r,3500));measuring=true;previous=performance.now();await new Promise(r=>setTimeout(r,3500));
  const stats=key=>{const v=rows.slice(1).map(r=>r[key]).sort((a,b)=>a-b);return {mean:v.reduce((a,b)=>a+b,0)/v.length,p95:v[Math.floor(v.length*.95)]}};
  return {backend:s.rendererBackend,count:items.length,frames:rows.length,render:stats('render'),frame:stats('gap'),drawCalls:s.renderer.info.render.drawCalls,triangles:s.renderer.info.render.triangles};
 }));await page.screenshot({path:process.env.SHOT||'artifacts/debris-benchmark.png'});
}finally{await browser.close()}
