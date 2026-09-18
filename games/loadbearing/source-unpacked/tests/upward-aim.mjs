import {chromium} from '@playwright/test';
import assert from 'node:assert/strict';
const browser=await chromium.launch({channel:'chrome',headless:true}),page=await browser.newPage({viewport:{width:1280,height:900}}),errors=[];
page.on('pageerror',e=>errors.push(e.message));
try{
 await page.addInitScript(()=>{localStorage.setItem('loadbearing.demo-seen','1');localStorage.setItem('loadbearing.last-mode',JSON.stringify({challengeId:'sandbox-demolition-yard'}));localStorage.setItem('loadbearing.sandbox-demolition-yard',JSON.stringify({scenario:'sandbox',pieces:[{id:1,kind:'foundation',p:[0,0,0],rotation:0}]}));});
 await page.goto(process.env.TEST_URL||'http://localhost:5174/');await page.locator('#boot-screen').waitFor({state:'detached',timeout:60000});
 await page.click('#run');await page.waitForFunction(()=>window.__loadBearing.simulation?.elapsed>.1,null,{timeout:60000});
 await page.evaluate(()=>{const d=window.__loadBearing,s=d.scene;s.controls.target.set(0,2,0);s.camera.position.set(0,10,30);s.controls.update();const launch=d.simulation.launchProjectile.bind(d.simulation);d.simulation.launchProjectile=(...args)=>{window.__shot=args;return launch(...args);};});
 await page.mouse.move(800,750);await page.mouse.down({button:'right'});await page.mouse.move(800,350,{steps:30});await page.mouse.up({button:'right'});await page.waitForTimeout(1200);
 const aim=await page.evaluate(()=>{const s=window.__loadBearing.scene;return {polar:s.controls.getPolarAngle(),height:s.camera.position.y,enabled:s.freeCameraLook};});
 assert.ok(aim.polar>Math.PI/2+.5,JSON.stringify(aim));assert.ok(aim.height>=1);
 await page.mouse.move(640,450);await page.keyboard.press('f');await page.waitForFunction(()=>window.__shot);
 const shot=await page.evaluate(()=>window.__shot);assert.ok(shot[1][1]>0,'F must launch upward');
 await page.screenshot({path:'artifacts/upward-aim.png'});assert.deepEqual(errors,[]);console.log({aim,velocity:shot[1]});
}finally{await browser.close();}


