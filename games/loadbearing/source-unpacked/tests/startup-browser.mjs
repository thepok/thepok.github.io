import {chromium} from '@playwright/test';
import assert from 'node:assert/strict';
const browser=await chromium.launch({channel:'chrome',headless:true}),page=await browser.newPage({viewport:{width:1280,height:850}}),errors=[];
page.on('pageerror',e=>errors.push(e.message));
try{
 await page.addInitScript(()=>{localStorage.setItem('loadbearing.demo-seen','1');localStorage.setItem('loadbearing.last-mode',JSON.stringify({challengeId:'sandbox-demolition-yard'}));});
 await page.goto(process.env.TEST_URL||'http://localhost:5174');await page.locator('#boot-screen').waitFor({state:'detached',timeout:60000});
 await page.selectOption('#procedural-style','art-deco');await page.locator('#procedural-count-number').fill('1000');
 await page.evaluate(()=>{const real=Date.now;Date.now=()=>72000;document.querySelector('#generate-building').click();Date.now=real;});
 if(await page.evaluate(()=>!window.__loadBearing.simulation))await page.click('#run');
 await page.waitForFunction(()=>window.__loadBearing.pieces.length>=850&&window.__loadBearing.pieces.length<=1000&&window.__loadBearing.simulation?.startup,{},{timeout:120000});
 await page.waitForFunction(()=>window.__loadBearing.simulation?.elapsed>3,{},{timeout:90000});
 const initial=await page.evaluate(()=>{const s=window.__loadBearing.simulation;return {parts:window.__loadBearing.pieces.length,broken:s.broken,startup:s.startup,mode:s.mode,threads:s.threads}});assert.equal(initial.broken,0,'large building broke before any action');
 await page.mouse.move(800,330);await page.keyboard.press('f');await page.waitForFunction(()=>window.__loadBearing.simulation?.projectiles===1);
 const start=performance.now();await page.click('#restart');await page.waitForFunction(()=>window.__loadBearing.simulation?.startup?.cached&&window.__loadBearing.simulation?.projectiles===0,{},{timeout:60000});const restartMs=performance.now()-start;
 await page.waitForFunction(()=>window.__loadBearing.simulation?.elapsed>2,{},{timeout:60000});assert.equal(await page.evaluate(()=>window.__loadBearing.simulation.broken),0);
 assert.deepEqual(errors,[]);console.log('PASS browser large-building preparation, F, cached world restart',JSON.stringify({initial,restartMs}));
}finally{await browser.close();}
