import { chromium } from '@playwright/test';
import assert from 'node:assert/strict';

const browser=await chromium.launch({executablePath:process.env.LOCALAPPDATA+'/ms-playwright/chromium-1155/chrome-win/chrome.exe',headless:true,args:['--enable-unsafe-swiftshader']});
const page=await browser.newPage({viewport:{width:1536,height:960}}),errors=[];page.on('pageerror',error=>errors.push(error.message));
try{
 await page.goto('http://127.0.0.1:5174');await page.waitForFunction(()=>window.__loadBearing?.ready);
 await page.click('#workshop-mode');await page.click('#sandbox-mode');await page.selectOption('#showcase','rheinwerk-terminal');await page.click('#load-showcase');
 await page.click('#run');await page.waitForFunction(()=>window.__loadBearing.simulation?.elapsed>.5,{},{timeout:60000});
 await page.click('[data-hazard="wind"]');await page.evaluate(()=>window.__restartIdentity=window.__loadBearing.simulation);
 const started=Date.now();await page.click('#restart');
 await page.waitForFunction(()=>window.__loadBearing.simulation===window.__restartIdentity&&window.__loadBearing.simulation.elapsed<.75&&document.querySelector('#status')?.textContent==='SIMULATING',{},{timeout:60000});
 const elapsedMs=Date.now()-started,state=await page.evaluate(()=>({sameClient:window.__loadBearing.simulation===window.__restartIdentity,hazards:window.__loadBearing.simulation.sandboxHazards,fragments:window.__loadBearing.simulation.fragments,visible:window.__loadBearing.pieces.every(p=>window.__loadBearing.scene.meshes.get(p.id)?.visible),remnants:[...window.__loadBearing.scene.structure.children].reduce((n,g)=>n+(g.userData.remnantCount??0),0)}));
 assert.equal(state.sameClient,true,'restart must reuse the warm worker client');assert.equal(state.hazards.wind,true,'active hazards should survive restart');assert.equal(state.fragments,0);assert.equal(state.visible,true);assert.equal(state.remnants,0);assert.deepEqual(errors,[]);
 console.log('PASS warm restart',elapsedMs+' ms',state);
}finally{await browser.close();}
