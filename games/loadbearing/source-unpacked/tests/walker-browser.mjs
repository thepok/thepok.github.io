import {chromium} from '@playwright/test';
import assert from 'node:assert/strict';
const browser=await chromium.launch({channel:'chrome',headless:true});const page=await browser.newPage({viewport:{width:1280,height:850}}),errors=[];page.on('pageerror',e=>errors.push(e.message));
try{
await page.addInitScript(()=>{localStorage.setItem('loadbearing.demo-seen','1');localStorage.setItem('loadbearing.last-mode',JSON.stringify({challengeId:'sandbox-demolition-yard'}));});
await page.goto(process.env.TEST_URL||'http://localhost:5174');await page.locator('#boot-screen').waitFor({state:'detached',timeout:60000});
await page.selectOption('#showcase','maison-azur');await page.click('#load-showcase');await page.click('#walk-mode');
await page.waitForFunction(()=>window.__loadBearing.simulation?.walker,{},{timeout:60000});
await page.waitForTimeout(600);
const start=await page.evaluate(()=>window.__loadBearing.simulation.walker);console.log('start',start);
await page.keyboard.down('w');await page.waitForTimeout(1200);await page.keyboard.up('w');
const end=await page.evaluate(()=>window.__loadBearing.simulation.walker);console.log('walk',end);
assert.ok(Math.hypot(end.position[0]-start.position[0],end.position[2]-start.position[2])>.5,'W walks');
await page.keyboard.press('v');await page.waitForTimeout(120);assert.ok(await page.evaluate(()=>{const d=window.__loadBearing;const p=d.simulation.walker.position;return Math.hypot(d.scene.camera.position.x-p[0],d.scene.camera.position.z-p[2])<.8;}),'first person camera follows feet');await page.keyboard.press('v');
await page.keyboard.press('f');assert.equal(await page.evaluate(()=>window.__loadBearing.simulation.projectiles),0,'F does not fire while walking');
await page.keyboard.press('r');await page.waitForFunction(()=>window.__loadBearing.simulation?.walker&&window.__loadBearing.simulation.elapsed<1);
assert.ok(await page.evaluate(()=>window.__loadBearing.walkerMode.active),'reset stays walking');
await page.waitForTimeout(700);await page.mouse.move(800,400);await page.screenshot({path:'artifacts/walker-desktop.png'});await page.click('#leave-walk');await page.keyboard.press('f');await page.waitForFunction(()=>window.__loadBearing.simulation.projectiles===1);
assert.deepEqual(errors,[]);console.log('PASS browser walking, no projectile, reset');
}finally{await browser.close()}
