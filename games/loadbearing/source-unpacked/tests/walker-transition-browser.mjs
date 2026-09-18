import {chromium} from '@playwright/test';
import assert from 'node:assert/strict';
const browser=await chromium.launch({channel:'chrome',headless:true}),page=await browser.newPage({viewport:{width:1280,height:850}}),errors=[];page.on('pageerror',e=>errors.push(e.message));
try{
 await page.addInitScript(()=>{localStorage.setItem('loadbearing.demo-seen','1');localStorage.setItem('loadbearing.last-mode',JSON.stringify({challengeId:'sandbox-demolition-yard'}));});
 await page.goto(process.env.TEST_URL||'http://localhost:5174');await page.locator('#boot-screen').waitFor({state:'detached',timeout:60000});
 await page.selectOption('#showcase','maison-azur');await page.click('#load-showcase');await page.click('#vehicle-mode');await page.selectOption('#vehicle-preset','cannon-truck');await page.click('#vehicle-drive');
 await page.waitForFunction(()=>window.__loadBearing.vehicleWorkshop.driving&&window.__loadBearing.simulation?.elapsed>1,{},{timeout:60000});
 await page.evaluate(()=>{const s=window.__loadBearing.simulation,c=s.items.find(i=>i.kind==='column'),p=c.body.GetPosition();s.launchProjectile([p.GetX(),p.GetY()+2,p.GetZ()-6],[0,0,100],10000,.4);s.setSandboxHazard('wind',true);});
 await page.waitForFunction(()=>window.__loadBearing.simulation.items.some(i=>i.id>0&&i.fractured),{},{timeout:15000});
 await page.evaluate(()=>{const s=window.__loadBearing.simulation;window.__transition={sim:s,worker:s.worker,time:s.elapsed,shots:s.projectiles,broken:s.broken,damaged:s.items.filter(i=>i.id>0&&i.fractured).map(i=>i.id)};});
 if(await page.evaluate(()=>!!document.pointerLockElement))await page.keyboard.press('Escape');await page.click('#world-controls');await page.click('[data-sandbox-tab="buildings"]');await page.click('#walk-mode',{timeout:5000});
 await page.waitForFunction(()=>window.__loadBearing.walkerMode.active&&window.__loadBearing.simulation.walker,{},{timeout:15000});
 async function preserved(){return page.evaluate(()=>{const s=window.__loadBearing.simulation,b=window.__transition;return {same:s===b.sim&&s.worker===b.worker,time:s.elapsed>=b.time,shots:s.projectiles>=b.shots,damage:s.broken>=b.broken&&b.damaged.every(id=>s.items.find(i=>i.id===id)?.fractured),wind:s.sandboxHazards.wind,car:s.items.some(i=>i.id===-50000),driving:window.__loadBearing.vehicleWorkshop.driving};});}
 let state=await preserved();assert.deepEqual(state,{same:true,time:true,shots:true,damage:true,wind:true,car:true,driving:false});
 await page.click('#leave-walk');await page.click('#sandbox-mode');assert.equal((await preserved()).same,true,'same Sandbox navigation preserves the world');await page.click('#walk-mode',{timeout:5000});await page.waitForFunction(()=>window.__loadBearing.simulation.walker);state=await preserved();assert.ok(state.same&&state.damage&&state.time&&state.wind,'re-enter walking retains damaged world');
 await page.click('#leave-walk');assert.ok(await page.evaluate(()=>window.__loadBearing.scene.controls.enabled),'free camera restored after leaving character');
 assert.deepEqual(errors,[]);console.log('PASS car-to-walker, leave/re-enter, Sandbox navigation: same worker, damage, shots, hazards and parked car');
}catch(error){console.log(await page.evaluate(()=>({state:document.body.dataset.gameState,classes:document.body.className,walker:window.__loadBearing.walkerMode.active,rects:['#walk-mode','.sidebar','.stage','#viewport'].map(sel=>({sel,rect:document.querySelector(sel).getBoundingClientRect().toJSON()}))})));await page.screenshot({path:'artifacts/walker-transition-failure.png'});throw error;}finally{await browser.close();}
