import {chromium} from '@playwright/test';import assert from 'node:assert/strict';
const b=await chromium.launch({channel:'chrome',headless:true}),p=await b.newPage({viewport:{width:1280,height:850}});
try{await p.addInitScript(()=>{localStorage.setItem('loadbearing.demo-seen','1');localStorage.setItem('loadbearing.last-mode',JSON.stringify({challengeId:'sandbox-demolition-yard'}));});await p.goto(process.env.TEST_URL||'http://localhost:5174');await p.locator('#boot-screen').waitFor({state:'detached'});await p.mouse.move(800,330);
 const shots=()=>p.evaluate(()=>window.__loadBearing.simulation?.projectiles??0);
 async function shot(action){const n=await shots();await action();await p.waitForFunction(n=>window.__loadBearing.simulation?.projectiles===n+1,n);await p.waitForTimeout(150);assert.equal(await shots(),n+1);}
 // A focused control that consumes bubbling events must not swallow the game hotkey.
 await p.evaluate(()=>{const s=document.querySelector('#procedural-style');s.addEventListener('keydown',e=>e.stopPropagation());s.focus();});await shot(()=>p.keyboard.press('f'));
 await shot(()=>p.evaluate(()=>document.activeElement.dispatchEvent(new KeyboardEvent('keydown',{key:'f',bubbles:true,cancelable:true}))));
 await p.setViewportSize({width:390,height:844});await p.waitForFunction(()=>document.body.classList.contains('mobile-ui'));const cdp=await p.context().newCDPSession(p);await shot(async()=>{await cdp.send('Input.dispatchTouchEvent',{type:'touchStart',touchPoints:[{id:1,x:190,y:330}]});await cdp.send('Input.dispatchTouchEvent',{type:'touchEnd',touchPoints:[]});});
 await p.setViewportSize({width:1280,height:850});await p.waitForFunction(()=>!document.body.classList.contains('mobile-ui'));await p.mouse.move(800,330);await p.locator('#procedural-count-number').focus();await shot(()=>p.keyboard.press('f'));
 await p.selectOption('#procedural-style','triumph');await p.locator('#procedural-count-number').fill('100');await p.click('#generate-building');await p.waitForFunction(()=>window.__loadBearing.pieces.length<=100&&window.__loadBearing.simulation?.elapsed>.05);await p.mouse.move(800,330);await shot(()=>p.keyboard.press('f'));
 await p.click('#open-options');let n=await shots();await p.keyboard.press('f');await p.waitForTimeout(150);assert.equal(await shots(),n);await p.keyboard.press('Escape');
 await p.evaluate(()=>{const t=document.createElement('input');t.id='fire-typing';document.body.append(t);t.focus();});n=await shots();await p.keyboard.press('f');assert.equal(await p.locator('#fire-typing').inputValue(),'f');assert.equal(await shots(),n);
 console.log('PASS focused controls, key-only F, PC/mobile/PC, new building, exactly one shot, dialog and text guards');
}finally{await b.close()}
