import {chromium} from '@playwright/test';
import {build} from 'esbuild';
import assert from 'node:assert/strict';
await build({stdin:{contents:"export {fractureShapes} from './src/fracture.ts';",resolveDir:process.cwd()},bundle:true,platform:'node',format:'esm',outfile:'artifacts/glass-preview-shapes.mjs'});
const {fractureShapes}=await import('../artifacts/glass-preview-shapes.mjs?'+Date.now());
const chunks=fractureShapes({id:41,kind:'facade',p:[0,0,0],rotation:0});
const browser=await chromium.launch({channel:'chrome',headless:true}),page=await browser.newPage({viewport:{width:1280,height:800}}),errors=[];
page.on('pageerror',e=>errors.push(e.message));
try{
 await page.addInitScript(()=>{
  localStorage.setItem('loadbearing.demo-seen','1');localStorage.setItem('loadbearing.last-mode',JSON.stringify({challengeId:'sandbox-demolition-yard'}));
  localStorage.setItem('loadbearing.sandbox-demolition-yard',JSON.stringify({scenario:'sandbox',pieces:[{id:41,kind:'facade',p:[-2,0,0],rotation:0}]}));
 });
 await page.goto(process.env.TEST_URL||'http://localhost:5174');await page.locator('#boot-screen').waitFor({state:'detached'});
 await page.click('#run');await page.waitForFunction(()=>window.__loadBearing.simulation?.elapsed>.1);
 await page.evaluate(()=>window.__loadBearing.simulation.launchProjectile([0,2,8],[0,0,-60],5000,.5));
 await page.waitForFunction(()=>window.__loadBearing.simulation.items.filter(i=>i.kind==='fragment'&&i.vertices).length===6);
 await page.evaluate(()=>window.__loadBearing.simulation.pause(true));
 const state=await page.evaluate(()=>{const d=window.__loadBearing;return d.simulation.items.filter(i=>i.kind==='fragment').map(i=>({vertices:i.vertices?.length,rendered:d.scene.fragmentBatches.refs.has(i.id)}));});
 assert.ok(state.every(i=>i.vertices===6&&i.rendered));await page.click('#stop');
 await page.evaluate(chunks=>{
  const s=window.__loadBearing.scene;document.body.classList.add('demo-running');
  s.setPieces([{id:1,kind:'facade',p:[-5,0,0],rotation:0}]);s.grid.visible=false;s.controls.target.set(0,2,0);s.camera.position.set(0,4,16);s.camera.lookAt(0,2,0);
  for(const [i,chunk] of chunks.entries()){const g=s.fragment({...chunk,id:-11000-i,sourceKind:'facade'});g.position.set(chunk.center[0]+1+(chunk.center[0]-2)*.12,chunk.center[1]+(chunk.center[1]-2)*.12,0);}
  s.resize();s.render(.016);
 },chunks);
 await page.screenshot({path:'artifacts/glass-partition.png'});assert.deepEqual(errors,[]);
 console.log('PASS six convex glass fragments reach worker snapshots and batched renderer');
}finally{await browser.close();}
