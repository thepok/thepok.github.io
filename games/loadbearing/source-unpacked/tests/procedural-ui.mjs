import { chromium } from '@playwright/test';
import assert from 'node:assert/strict';

const browser=await chromium.launch({executablePath:process.env.LOCALAPPDATA+'/ms-playwright/chromium-1155/chrome-win/chrome.exe',headless:true,args:['--enable-unsafe-swiftshader']});
const page=await browser.newPage({viewport:{width:1536,height:960}}),errors=[];page.on('pageerror',error=>errors.push(error.message));
try{
 await page.goto('http://127.0.0.1:5174');await page.waitForFunction(()=>window.__loadBearing?.ready);
 await page.click('#workshop-mode');await page.click('#sandbox-mode');assert.equal(await page.locator('#procedural-count').getAttribute('max'),'1000');
 await page.locator('#procedural-count').fill('1000');await page.click('#generate-building');await page.waitForFunction(()=>window.__loadBearing.pieces.length===1000);
 const built=await page.evaluate(()=>({pieces:window.__loadBearing.pieces.length,meshes:[...window.__loadBearing.scene.meshes.keys()].filter(id=>id>0).length,heading:document.querySelector('#scene-name')?.textContent,meta:document.querySelector('#procedural-meta')?.textContent}));assert.equal(built.pieces,1000);assert.equal(built.meshes,1000);assert.match(built.meta,/1\.000 Teile/);await page.screenshot({path:'artifacts/procedural-1000.png'});
 await page.click('#run');await page.waitForFunction(()=>window.__loadBearing.simulation?.elapsed>.5,{},{timeout:120000});await page.waitForTimeout(1500);
 const running=await page.evaluate(()=>({items:window.__loadBearing.simulation.items.filter(i=>i.id>0).length,broken:window.__loadBearing.simulation.broken,fps:window.__loadBearing.scene.fps,rate:window.__loadBearing.simulation.rate,physicsMs:window.__loadBearing.simulation.physicsMs}));assert.equal(running.items,1000);assert.equal(running.broken,0);assert.ok(running.fps>20);assert.deepEqual(errors,[]);console.log('PASS procedural 1000-part UI and physics',built,running);
}finally{await browser.close();}
