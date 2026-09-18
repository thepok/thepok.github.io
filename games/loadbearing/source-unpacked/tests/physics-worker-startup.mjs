import {chromium} from '@playwright/test';
import assert from 'node:assert/strict';
const browser=await chromium.launch({channel:'chrome',headless:true});
const page=await browser.newPage(),errors=[],failed=[],iconWarnings=[];
page.on('pageerror',e=>errors.push(e.message));
page.on('requestfailed',r=>{if(r.url().includes('jolt'))failed.push(r.url())});
page.on('console',m=>{if(m.text().includes('icon name was not found'))iconWarnings.push(m.text())});
try {
 await page.addInitScript(()=>{
  localStorage.setItem('loadbearing.demo-seen','1');
  localStorage.setItem('loadbearing.last-mode',JSON.stringify({challengeId:'sandbox-demolition-yard'}));
  localStorage.setItem('loadbearing.sandbox-demolition-yard',JSON.stringify({scenario:'sandbox',pieces:[{id:1,kind:'foundation',p:[0,0,0],rotation:0},{id:2,kind:'column',p:[0,1,0],rotation:0}]}));
 });
 await page.goto(process.env.TEST_URL||'http://127.0.0.1:5174/');
 for(let pass=0;pass<2;pass++) {
  await page.locator('#boot-screen').waitFor({state:'detached',timeout:60000});
  await page.locator('#run').click();
  await page.waitForFunction(()=>window.__loadBearing.simulation?.elapsed>.2,null,{timeout:60000});
  const status=await page.evaluate(()=>({mode:window.__loadBearing.simulation.mode,threads:window.__loadBearing.simulation.threads}));
  assert.equal(status.mode,'multithread');assert.ok(status.threads>0);
  await page.locator('#restart').click();
  await page.waitForFunction(()=>window.__loadBearing.simulation?.elapsed>.2,null,{timeout:60000});
  console.log('PASS start and restart',pass,status);
  if(pass===0)await page.reload();
 }
 assert.deepEqual(errors,[]);assert.deepEqual(failed,[]);assert.deepEqual(iconWarnings,[]);
}finally{await browser.close()}
