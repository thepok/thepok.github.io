import {chromium} from '@playwright/test';import assert from 'node:assert/strict';
const b=await chromium.launch({channel:'chrome',headless:true}),p=await b.newPage();
try{
 await p.addInitScript(()=>{localStorage.setItem('loadbearing.demo-seen','1');localStorage.setItem('loadbearing.last-mode',JSON.stringify({challengeId:'sandbox-demolition-yard'}));});
 await p.goto(process.env.TEST_URL||'http://127.0.0.1:5174/');await p.locator('#boot-screen').waitFor({state:'detached',timeout:60000});await p.locator('#run').click();await p.waitForFunction(()=>window.__loadBearing.simulation?.elapsed>.2);
 await p.evaluate(()=>{window.resetCount=0;const s=window.__loadBearing.simulation,original=s.restart.bind(s);s.restart=(...args)=>{window.resetCount++;return original(...args)};document.querySelector('[data-tab="projectiles"]')?.click();});
 // Focus via DOM also works when tools were collapsed; the actual key goes to the range.
 await p.evaluate(()=>{document.getElementById('projectile-speed').focus()});await p.keyboard.press('r');await p.waitForFunction(()=>window.resetCount===1);await p.waitForFunction(()=>!document.getElementById('restart').disabled);
 await p.locator('#open-options').click();await p.locator('#game-options-sensitivity').focus();await p.keyboard.press('r');await p.waitForFunction(()=>window.resetCount===2);await p.waitForFunction(()=>!document.getElementById('restart').disabled);
 await p.locator('.projectile-ranges summary').click();await p.getByRole('spinbutton',{name:'Durchmesser (m): Bis',exact:true}).focus();await p.keyboard.press('r');assert.equal(await p.evaluate(()=>window.resetCount),2);
 console.log('PASS R with slider focus, options slider focus, and number-entry protection');
}finally{await b.close()}
