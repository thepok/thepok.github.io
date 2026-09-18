import {chromium} from '@playwright/test';
import assert from 'node:assert/strict';
import {mkdir,writeFile} from 'node:fs/promises';
import os from 'node:os';
await mkdir('artifacts/browser',{recursive:true});
const browser=await chromium.launch({channel:'chrome',headless:true,args:['--enable-unsafe-swiftshader','--disable-dev-shm-usage']});
const results=[],allErrors=[];
const root=process.env.TEST_URL||'http://127.0.0.1:5174/';
try{
 for(const style of ['brutalist','art-deco'])for(const mode of ['reference','optimized']){
  const page=await browser.newPage({viewport:{width:1440,height:1000}}),warnings=[];
  page.on('pageerror',e=>{allErrors.push(e.message);console.log('PAGE_ERROR',e.message)});
  page.on('console',m=>{if(m.type()==='warning'||m.type()==='error'){warnings.push(m.text());console.log(m.type(),m.text().slice(0,250));}});
  await page.addInitScript(()=>{localStorage.setItem('loadbearing-fullfast.demo-seen','1');localStorage.setItem('loadbearing-fullfast.last-mode',JSON.stringify({challengeId:'sandbox-demolition-yard'}));localStorage.setItem('loadbearing-fullfast.fragment-limit','500');});
  await page.goto(root+(mode==='reference'?'?physics=reference':''));
  await page.waitForFunction(()=>window.__loadBearing?.ready,{},{timeout:120000});
  await page.evaluate(style=>{document.getElementById('workshop-mode').click();document.getElementById('sandbox-mode').click();document.getElementById('clear').click();document.getElementById('procedural-style').value=style;document.getElementById('procedural-count-number').value='1000';const now=Date.now;Date.now=()=>0x51a7;try{document.getElementById('generate-building').click();}finally{Date.now=now;}__loadBearing.scene.onPick([0,0,0],null);},style);
  assert.equal(await page.evaluate(()=>__loadBearing.pieces.length),1000);
  const blueprint=await page.evaluate(()=>__loadBearing.pieces);await writeFile(`artifacts/browser/${style}-${mode}-blueprint.json`,JSON.stringify(blueprint));
  await page.screenshot({path:`artifacts/browser/${style}-${mode}-gui.png`});
  await page.evaluate(()=>document.getElementById('run').click());
  await page.waitForFunction(()=>__loadBearing.simulation?.elapsed>.1,{},{timeout:120000});
  const info=await page.evaluate(()=>({mode:__loadBearing.simulation.mode,threads:__loadBearing.simulation.threads,core:__loadBearing.simulation.core,renderer:__loadBearing.scene.rendererBackend,isolation:crossOriginIsolated}));
  console.log('ENGINE_INFO',style,mode,info);assert.equal(info.core,mode==='reference'?'original':'specialized-native');assert.equal(info.mode,'multithread');assert.ok(info.threads>0);
  const replay=await page.evaluate(()=>new Promise((resolve,reject)=>{const w=__loadBearing.simulation.worker,t=setTimeout(()=>reject(Error('Replay timed out')),180000);const listener=e=>{if(e.data.type==='benchmark-error'){clearTimeout(t);w.removeEventListener('message',listener);reject(Error(e.data.message));}else if(e.data.type==='benchmark-result'){clearTimeout(t);w.removeEventListener('message',listener);resolve(e.data.result);}};w.addEventListener('message',listener);w.postMessage({type:'benchmark'});}));
  assert.equal(replay.parts,1000);assert.equal(replay.finite,true);assert.equal(replay.fragmentLimit,500);assert.ok(replay.timeline.at(-1).broken>100);assert.ok(replay.timeline.at(-1).fragments>50);
  await page.waitForTimeout(300);await page.screenshot({path:`artifacts/browser/${style}-${mode}-destruction.png`});
  if(mode==='optimized'){
   await page.evaluate(()=>__loadBearing.simulation.restart());
   await page.waitForFunction(()=>__loadBearing.simulation.elapsed>.1,{},{timeout:60000});
   await page.evaluate(()=>{const a=__loadBearing;window.workerBeforeWalk=a.simulation.worker;a.simulation.setSandboxHazard('wind',true);document.querySelector('[data-sandbox-tab=buildings]').click();document.getElementById('walk-mode').click();});
   await page.waitForFunction(()=>__loadBearing.walkerMode.active&&__loadBearing.simulation.walker,{},{timeout:30000});
   assert.equal(await page.evaluate(()=>__loadBearing.simulation.worker===window.workerBeforeWalk),true);
   await page.evaluate(()=>document.getElementById('leave-walk').click());
   await page.waitForFunction(()=>!__loadBearing.walkerMode.active);
   await page.evaluate(()=>{document.querySelector('[data-sandbox-tab=vehicles]').click();document.querySelector('[data-vehicle-preset=cannon-truck]').click();__loadBearing.scene.onPick([60,0,60],null);});
   await page.waitForFunction(()=>__loadBearing.simulation.worldVehicles.length===1,{},{timeout:30000});
   await page.evaluate(()=>{const s=__loadBearing.simulation;window.car=s.worldVehicles[0].id;s.setWorldVehicleMode(window.car,'drive');s.worldVehicleInput(window.car,{throttle:1,steer:.25,brake:0,yaw:0,pitch:0,fire:true});});
   const before=await page.evaluate(()=>__loadBearing.simulation.elapsed);
   await page.waitForFunction(t=>__loadBearing.simulation.elapsed>t+1,before,{timeout:30000});
   await page.evaluate(()=>__loadBearing.simulation.worldVehicleInput(window.car,{throttle:0,steer:0,brake:1,yaw:0,pitch:0,fire:false}));
   await page.screenshot({path:`artifacts/browser/${style}-vehicle-walker.png`});
   assert.equal(await page.evaluate(()=>Object.keys(localStorage).some(k=>k.startsWith('loadbearing.'))),false,'Preview must not touch stable saves');
   await page.setViewportSize({width:390,height:844});await page.waitForTimeout(250);await page.screenshot({path:`artifacts/browser/${style}-mobile.png`});
  }
  results.push({style,mode,info,replay,warnings});console.log('BROWSER_AB '+JSON.stringify({style,mode,info,replay}));
  await writeFile('artifacts/browser/results.json',JSON.stringify({cpu:os.cpus()[0]?.model,node:process.version,browser:browser.version(),results,errors:allErrors},null,2));await page.close();
 }
 assert.deepEqual(allErrors,[]);
}finally{await browser.close();}
