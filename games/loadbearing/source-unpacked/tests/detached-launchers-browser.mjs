import {chromium} from '@playwright/test';import assert from 'node:assert/strict';
const browser=await chromium.launch({channel:'chrome',headless:true});
try{for(const mobile of [false,true]){
 const page=await browser.newPage({viewport:mobile?{width:412,height:915}:{width:1440,height:1000},isMobile:mobile,hasTouch:mobile});const errors=[];page.on('pageerror',e=>errors.push(e.message));
 await page.addInitScript(()=>{localStorage.setItem('loadbearing.demo-seen','1');localStorage.setItem('loadbearing.last-mode',JSON.stringify({challengeId:'sandbox-demolition-yard'}));});
 await page.goto('http://127.0.0.1:5174/');await page.locator('#boot-screen').waitFor({state:'detached',timeout:60000});
 // Regression: closing the vehicle editor must release the sandbox keys.
 await page.evaluate(()=>document.querySelector('#vehicle-mode').click());await page.locator('#vehicle-dialog').waitFor({state:'visible'});
 if(mobile)await page.locator('#vehicle-close').tap();else await page.keyboard.press('Escape');
 await page.waitForFunction(()=>!__loadBearing.vehicleWorkshop.enabled);
 assert.equal(await page.evaluate(()=>JSON.parse(localStorage.getItem('loadbearing.last-mode')).vehicle),false);
 if(!await page.locator('[data-sandbox-tab="projectiles"]').isVisible())await page.locator('#toggle-panels').click();await page.locator('[data-sandbox-tab="projectiles"]').click();
 await page.locator('#pin-launcher').click();assert.match(await page.locator('#launcher-count').textContent(),/1 feste/);
 // Rotate/move the observer before placing the second fixed muzzle.
 await page.evaluate(()=>{const s=__loadBearing.scene;s.camera.position.set(40,25,0);s.controls.target.set(0,12,0);s.controls.update();});
 if(mobile)await page.locator('#pin-launcher').tap();else await page.keyboard.press('k');
 assert.match(await page.locator('#launcher-count').textContent(),/2 feste/);
 await page.evaluate(()=>{const s=__loadBearing.scene;s.camera.position.set(55,32,45);s.controls.target.set(0,12,0);s.controls.update();});await page.waitForTimeout(150);
 await page.screenshot({path:`artifacts/detached-${mobile?'mobile':'desktop'}.png`});
 // Moving camera again must not change either saved launch transform.
 await page.evaluate(()=>{const s=__loadBearing.scene;s.camera.position.set(-40,30,30);s.controls.target.set(0,0,0);s.controls.update();document.querySelector('#aim-launch').click();});
 await page.waitForFunction(()=>__loadBearing.simulation?.mode&&__loadBearing.simulation.mode!=='starting',{},{timeout:60000});
 await page.evaluate(()=>{const sim=__loadBearing.simulation;window.sentVolleys=[];const post=sim.worker.postMessage.bind(sim.worker);sim.worker.postMessage=(message,...rest)=>{if(message.type==='volley')window.sentVolleys.push(structuredClone(message));return post(message,...rest);};});
 if(mobile){await page.locator('#mobile-tools-close').tap();await page.locator('#viewport').tap({position:{x:200,y:200}});}else{await page.locator('#projectile-speed').focus();await page.keyboard.press('f');}
 await page.waitForFunction(()=>window.sentVolleys.length===1);const first=await page.evaluate(()=>window.sentVolleys[0]);assert.equal(first.shots.length,2);assert.notDeepEqual(first.shots[0].position,first.shots[1].position);
 await page.waitForFunction(()=>__loadBearing.simulation.projectiles>=2,{},{timeout:20000});
 await page.evaluate(()=>{const s=__loadBearing.scene;s.camera.position.set(65,45,65);s.controls.update();});
 if(mobile)await page.locator('#viewport').tap({position:{x:220,y:190}});else await page.keyboard.press('f');
 await page.waitForFunction(()=>window.sentVolleys.length===2);assert.deepEqual(await page.evaluate(()=>window.sentVolleys[1].shots),first.shots);
 await page.evaluate(()=>document.querySelector('#restart').click());await page.waitForFunction(()=>document.querySelector('#status').textContent==='SIMULATING',{},{timeout:60000});assert.match(await page.locator('#launcher-count').textContent(),/2 feste/);
 if(mobile){await page.locator('#toggle-panels').tap();await page.locator('#clear-launchers').tap();}else await page.keyboard.press('Shift+k');
 assert.match(await page.locator('#launcher-count').textContent(),/Kamera-Schuss/);if(mobile){await page.locator('#mobile-tools-close').tap();await page.locator('#viewport').tap({position:{x:220,y:190}});}else await page.keyboard.press('f');await page.waitForFunction(()=>window.sentVolleys.length===3);assert.equal(await page.evaluate(()=>window.sentVolleys[2].shots.length),1);assert.deepEqual(errors,[]);console.log('PASS',mobile?'touch':'desktop','two fixed muzzles, camera independence, atomic volley, reset, clear');await page.close();
}}finally{await browser.close();}
