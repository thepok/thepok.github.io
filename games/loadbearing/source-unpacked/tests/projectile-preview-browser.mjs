import {chromium} from '@playwright/test';import assert from 'node:assert/strict';
const b=await chromium.launch({channel:'chrome',headless:true});
try{for(const mobile of [false,true]){
 const p=await b.newPage({viewport:mobile?{width:412,height:915}:{width:1400,height:950},isMobile:mobile,hasTouch:mobile}),errors=[];p.on('pageerror',e=>errors.push(e.message));
 await p.addInitScript(()=>{localStorage.setItem('loadbearing.demo-seen','1');localStorage.setItem('loadbearing.last-mode',JSON.stringify({challengeId:'sandbox-demolition-yard'}));});
 await p.goto(process.env.TEST_URL||'http://127.0.0.1:5174/');await p.locator('#boot-screen').waitFor({state:'detached',timeout:60000});
 if(!await p.locator('[data-sandbox-tab="projectiles"]').isVisible())await p.locator('#toggle-panels').click();await p.locator('[data-sandbox-tab="projectiles"]').click();await p.locator('#projectile-type').selectOption('storey');
 const canvas=p.locator('.projectile-preview canvas');await canvas.waitFor({state:'visible'});await p.waitForFunction(()=>document.querySelector('.projectile-preview canvas')?.dataset.parts==='16');const before=await canvas.evaluate(c=>c.toDataURL());
 await p.evaluate(()=>{for(const [id,value] of [['projectile-building-parts','64'],['projectile-building-strength','2.5'],['projectile-building-rebar','2']]){const input=document.getElementById(id);input.value=value;input.dispatchEvent(new Event('input'));}});
 await p.waitForFunction(()=>document.querySelector('.projectile-preview canvas')?.dataset.reinforcement==='2');assert.notEqual(await canvas.evaluate(c=>c.toDataURL()),before);assert.equal(await canvas.getAttribute('data-parts'),'64');assert.equal(await canvas.getAttribute('data-strength'),'2.5');assert.ok((await p.locator('.projectile-preview figcaption').textContent()).includes('64 Teile'));
 const image=await canvas.evaluate(c=>c.toDataURL());const box=await canvas.boundingBox();await p.mouse.move(box.x+box.width/2,box.y+box.height/2);await p.mouse.down();await p.mouse.move(box.x+box.width/2+50,box.y+box.height/2,{steps:5});await p.mouse.up();await p.waitForTimeout(100);assert.notEqual(await canvas.evaluate(c=>c.toDataURL()),image);
 await p.locator('.projectile-preview').screenshot({path:`artifacts/projectile-preview-${mobile?'mobile':'desktop'}.png`});assert.deepEqual(errors,[]);await p.locator('#projectile-type').selectOption('solid');assert.equal(await canvas.isVisible(),false);console.log('PASS preview config, rotation and visibility',mobile?'mobile':'desktop');await p.close();
}}finally{await b.close()}
