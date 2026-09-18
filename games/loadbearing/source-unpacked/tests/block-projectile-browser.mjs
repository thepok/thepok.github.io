import {chromium} from '@playwright/test';
import assert from 'node:assert/strict';
const b=await chromium.launch({channel:'chrome',headless:true}),p=await b.newPage({viewport:{width:1400,height:950}}),errors=[];
p.on('pageerror',e=>errors.push(e.message));
try{
 await p.addInitScript(()=>{localStorage.setItem('loadbearing.demo-seen','1');localStorage.setItem('loadbearing.last-mode',JSON.stringify({challengeId:'sandbox-demolition-yard'}));});
 await p.goto(process.env.TEST_URL||'http://127.0.0.1:5174/');await p.locator('#boot-screen').waitFor({state:'detached',timeout:60000});
 await p.evaluate(()=>{const select=document.getElementById('projectile-type');select.value='blocks';select.dispatchEvent(new Event('change'));const r=document.getElementById('projectile-radius');r.value='3';r.dispatchEvent(new Event('input'));});
 assert.equal(await p.locator('#game-options-recycle-projectiles').isChecked(),false);
 await p.locator('#run').click();await p.waitForFunction(()=>window.__loadBearing.simulation?.elapsed>.1);
 await p.mouse.move(740,350);await p.keyboard.press('f');
 await p.waitForFunction(()=>window.__loadBearing.simulation.items.filter(i=>i.blockShot).length===19);
 await p.keyboard.press('f');await p.waitForFunction(()=>window.__loadBearing.simulation.items.filter(i=>i.blockShot).length===38);
 await p.screenshot({path:'artifacts/block-projectile-browser.png'});
 await p.locator('#open-options').click();await p.locator('#game-options-recycle-projectiles').check();await p.locator('[data-options-close]').click();
 await p.reload();await p.locator('#boot-screen').waitFor({state:'detached',timeout:60000});assert.equal(await p.locator('#projectile-type').inputValue(),'blocks');assert.equal(await p.locator('#game-options-recycle-projectiles').isChecked(),true);
 assert.deepEqual(errors,[]);console.log('PASS F launches compound shots, accumulation, preference persistence, no rendering errors');
}finally{await b.close()}
