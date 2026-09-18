import {chromium} from '@playwright/test';
import assert from 'node:assert/strict';
const browser=await chromium.launch({channel:'chrome',headless:true});
const url=process.env.TEST_URL||'http://localhost:5174';
async function setup(mobile=false){
 const page=await browser.newPage(mobile?{viewport:{width:412,height:915},isMobile:true,hasTouch:true}:{viewport:{width:1280,height:850}});
 const errors=[];page.on('pageerror',e=>errors.push(e.message));
 await page.addInitScript(()=>{localStorage.setItem('loadbearing.demo-seen','1');localStorage.setItem('loadbearing.last-mode',JSON.stringify({challengeId:'sandbox-demolition-yard'}));});
 await page.goto(url);await page.locator('#boot-screen').waitFor({state:'detached',timeout:60000});
 return {page,errors};
}
try{
 const {page,errors}=await setup();
 const pose=()=>page.evaluate(()=>({p:window.__loadBearing.scene.camera.position.toArray(),t:window.__loadBearing.scene.controls.target.toArray()}));
 const before=await pose();await page.keyboard.down('w');await page.waitForTimeout(500);await page.keyboard.up('w');const after=await pose();
 const delta=after.p.map((v,i)=>v-before.p[i]);assert.ok(Math.hypot(...delta)>2,'W moves free camera');assert.ok(Math.abs(delta[1])<.01,'free movement preserves altitude');
 for(let i=0;i<3;i++)assert.ok(Math.abs(delta[i]-(after.t[i]-before.t[i]))<.05,'camera and orbit target translate together');
 await page.locator('#procedural-count-number').focus();const typingBefore=await pose();await page.keyboard.press('w');await page.waitForTimeout(150);const typingAfter=await pose();for(const field of ['p','t'])assert.ok(Math.hypot(...typingAfter[field].map((v,i)=>v-typingBefore[field][i]))<.000001,'focused numeric inputs do not move camera');
 await page.selectOption('#showcase','maison-azur');await page.click('#load-showcase');await page.click('#walk-mode');await page.waitForFunction(()=>window.__loadBearing.simulation?.walker,{},{timeout:60000});
 await page.keyboard.press('2');await page.waitForFunction(()=>window.__loadBearing.simulation.walker.weapon==='cannon');
 await page.keyboard.press('f');await page.waitForFunction(()=>window.__loadBearing.simulation.projectiles===1,{},{timeout:15000});
 await page.waitForTimeout(600);assert.equal(await page.evaluate(()=>window.__loadBearing.simulation.projectiles),1,'short tap fires exactly once');
 const sequence=await page.evaluate(()=>window.__loadBearing.simulation.walker.attackSequence);await page.keyboard.down('f');await page.waitForFunction(n=>window.__loadBearing.simulation.walker.attackSequence>=n+2,sequence,{timeout:15000});await page.keyboard.up('f');
 await page.keyboard.press('1');await page.waitForFunction(()=>window.__loadBearing.simulation.walker.weapon==='hammer');
 const shotCount=await page.evaluate(()=>window.__loadBearing.simulation.projectiles);await page.keyboard.press('f');await page.waitForTimeout(250);assert.equal(await page.evaluate(()=>window.__loadBearing.simulation.projectiles),shotCount,'hammer does not leak a sandbox shot');
 await page.keyboard.press('2');await page.waitForTimeout(100);await page.keyboard.press('r');await page.waitForFunction(()=>{const s=window.__loadBearing.simulation;return s?.walker&&s.elapsed<1&&s.projectiles===0;},{},{timeout:30000});await page.waitForTimeout(700);assert.equal(await page.evaluate(()=>window.__loadBearing.simulation.projectiles),0,'reset does not replay trigger');
 await page.screenshot({path:'artifacts/walker-weapons-desktop.png'});await page.keyboard.press('v');await page.waitForTimeout(200);await page.screenshot({path:'artifacts/walker-weapons-first-person.png'});
 await page.click('#leave-walk');assert.equal(await page.locator('[data-walker-aim]').count(),0,'leaving removes weapon aim');assert.deepEqual(errors,[]);await page.close();
 const mobile=await setup(true),p=mobile.page;
 await p.evaluate(()=>{document.querySelector('#showcase').value='maison-azur';document.querySelector('#load-showcase').click();document.querySelector('#walk-mode').click();});
 await p.waitForFunction(()=>window.__loadBearing.simulation?.walker,{},{timeout:60000});await p.locator('[data-weapon="cannon"]').tap();await p.waitForFunction(()=>window.__loadBearing.simulation.walker.weapon==='cannon');
 const button=p.getByRole('button',{name:'Angriff',exact:true}).last();await button.tap();await p.waitForFunction(()=>window.__loadBearing.simulation.projectiles===1,{},{timeout:15000});
 await p.locator('[data-weapon="hammer"]').tap();
 const canvas=p.locator('#viewport canvas');await canvas.dispatchEvent('pointerdown',{pointerId:71,pointerType:'touch',clientX:270,clientY:650});await canvas.dispatchEvent('pointermove',{pointerId:71,pointerType:'touch',clientX:270,clientY:50});await canvas.dispatchEvent('pointerup',{pointerId:71,pointerType:'touch',clientX:270,clientY:50});await p.waitForTimeout(500);
 const looking=await p.evaluate(()=>{const d=window.__loadBearing;return {look:d.walkerMode.pitch,hammer:d.walkerMode.weaponRoot.rotation.x,cameraY:d.scene.camera.getWorldDirection(d.scene.camera.position.clone()).y};});assert.ok(looking.look>1.4&&looking.cameraY>.94,'camera can look almost straight up');assert.ok(Math.abs(looking.hammer-.65)<.001,'hammer stays at its maximum pitch');
 await p.screenshot({path:'artifacts/walker-weapons-mobile.png'});assert.deepEqual(mobile.errors,[]);await p.close();
 console.log('PASS desktop/mobile weapons, quick F/touch, held fire, weapon switch, reset, free camera and focus isolation');
}finally{await browser.close();}
