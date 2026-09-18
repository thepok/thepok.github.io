import {chromium} from '@playwright/test';
import assert from 'node:assert/strict';
const browser=await chromium.launch({channel:'chrome',headless:true}),page=await browser.newPage({viewport:{width:1280,height:800}});
try{
 let release;const gate=new Promise(resolve=>release=resolve);
 await page.route('**/assets/index-*.js*',async route=>{await gate;await route.continue();});
 await page.addInitScript(()=>{localStorage.setItem('loadbearing.demo-seen','1');localStorage.setItem('loadbearing-lab.demo-seen','1');});
 await page.goto(process.env.TEST_URL||'http://localhost:5174',{waitUntil:'commit'});
 await page.locator('#boot-screen').waitFor({state:'visible'});
 assert.equal(await page.locator('#boot-status').textContent(),'Spiel wird geladen …');
 assert.equal(await page.locator('#run').count(),0,'loading UI precedes game bundle');
 await page.screenshot({path:'artifacts/loading-screen.png'});release();
 await page.locator('#boot-screen').waitFor({state:'detached',timeout:45000});
 await page.locator('#run').waitFor({state:'visible'});
 console.log('PASS static loading screen visible before JavaScript download and removed when renderer ready');
}finally{await browser.close();}
