import {chromium} from '@playwright/test';
import assert from 'node:assert/strict';
const browser=await chromium.launch(process.env.WEBGL ? {executablePath:process.env.LOCALAPPDATA+'/ms-playwright/chromium-1155/chrome-win/chrome.exe',headless:true,args:['--enable-unsafe-swiftshader']} : {channel:'chrome',headless:true});
const page=await browser.newPage({viewport:{width:1536,height:960}}),errors=[];
page.on('pageerror',e=>errors.push(e.message));
try {
 await page.goto(process.env.TEST_URL||'http://localhost:5174');await page.waitForFunction(()=>window.__loadBearing?.ready);
 await page.click('#workshop-mode');await page.click('#vehicle-mode');await page.click('#vehicle-drive');
 await page.selectOption('#showcase','orbit-exchange');await page.click('#load-showcase');
 await page.waitForFunction(()=>window.__loadBearing.simulation?.elapsed>1);
 await page.evaluate(()=>{const sim=window.__loadBearing.simulation;sim.setFragmentLimit(3000);for(const item of sim.items.filter(i=>i.kind==='column').slice(0,55)){const p=item.body.GetPosition();sim.launchProjectile([p.GetX(),p.GetY()+8,p.GetZ()],[0,-80,0],25000,.9)}});
 await page.waitForFunction(()=>window.__loadBearing.scene.fragmentBatches.refs.size>300,{timeout:30000});
 await page.keyboard.down('w');await page.waitForTimeout(1800);await page.keyboard.up('w');
 const result=await page.evaluate(()=>{
  const a=window.__loadBearing,s=a.scene,sim=a.simulation;
  s.updatePhysics(sim);
  const visible=sim.items.filter(i=>i.kind==='fragment'&&!i.fractured&&!i.retired),batch=s.fragmentBatches;
  return {backend:s.rendererBackend,physics:sim.fragments,visible:visible.length,batched:batch.refs.size,allMapped:visible.every(i=>batch.refs.has(i.id)),individualMeshes:visible.filter(i=>s.meshes.has(i.id)).length,glass:batch.pools.get(true).mesh.material.transparent,shadows:[...batch.pools.values()].every(p=>p.mesh.castShadow&&p.mesh.receiveShadow),fps:s.fps};
 });
 assert.ok(result.allMapped&&result.batched===result.visible&&result.individualMeshes===0,JSON.stringify(result));
 assert.ok(result.glass&&result.shadows);
 await page.screenshot({path:'artifacts/debris-batched-collapse.png'});
 await page.click('#restart');await page.waitForFunction(()=>window.__loadBearing.simulation.fragments===0&&window.__loadBearing.scene.fragmentBatches.refs.size===0);
 assert.ok(await page.evaluate(()=>window.__loadBearing.vehicleWorkshop.driving),'restart stays in car');
 assert.deepEqual(errors,[]);
 console.log('PASS physical collapse, batching, driving, shadows, glass and restart',result);
}finally{await browser.close()}
