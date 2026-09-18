import {chromium} from '@playwright/test';
import assert from 'node:assert/strict';
const browser=await chromium.launch({channel:'chrome',headless:true});
const fixture={scenario:'sandbox',pieces:[{id:1,kind:'foundation',p:[0,0,2],rotation:0},{id:2,kind:'wall',p:[0,0,0],rotation:0},{id:3,kind:'girder',p:[0,4,0],rotation:0}]};
try{for(const mobile of [false,true]){
 const context=await browser.newContext({viewport:mobile?{width:412,height:915}:{width:1280,height:900},isMobile:mobile,hasTouch:mobile}),page=await context.newPage(),errors=[];page.on('pageerror',e=>errors.push(e.message));
 await page.addInitScript(f=>{if(!localStorage.getItem('material-test-init')){localStorage.setItem('loadbearing.demo-seen','1');localStorage.setItem('loadbearing.last-mode',JSON.stringify({challengeId:'sandbox-demolition-yard'}));localStorage.setItem('loadbearing.sandbox-demolition-yard',JSON.stringify(f));localStorage.setItem('material-test-init','1');}},fixture);
 await page.goto(process.env.TEST_URL||'http://localhost:5174/');await page.locator('#boot-screen').waitFor({state:'detached',timeout:60000});
 if(!await page.locator('#concrete-controls').isVisible())await page.locator('#toggle-panels').click();
 await page.locator('#concrete-controls summary').click();
 await page.locator('[data-concrete-preset="brittle"]').click();
 assert.equal(await page.locator('#concrete-reinforcement').inputValue(),'0');
 await page.locator('#concrete-apply-building').click();
 let ps=await page.evaluate(()=>window.__loadBearing.pieces);assert.equal(ps.find(p=>p.id===2).reinforcement,0);assert.equal(ps.find(p=>p.id===3).reinforcement,undefined);
 await page.evaluate(()=>window.__loadBearing.scene.onPick([0,0,0],2));
 await page.locator('[data-concrete-preset="rebar"]').click();await page.locator('#concrete-apply-selected').click();
 ps=await page.evaluate(()=>window.__loadBearing.pieces);assert.equal(ps.find(p=>p.id===2).reinforcement,1.75);assert.equal(ps.find(p=>p.id===1).reinforcement,0);
 await page.reload();await page.locator('#boot-screen').waitFor({state:'detached',timeout:60000});
 ps=await page.evaluate(()=>window.__loadBearing.pieces);assert.equal(ps.find(p=>p.id===2).reinforcement,1.75);assert.equal(ps.find(p=>p.id===1).reinforcement,0);
 if(!await page.locator('#concrete-controls').isVisible())await page.locator('#toggle-panels').click();await page.locator('#concrete-controls summary').click();
 assert.equal(await page.locator('#concrete-reinforcement').inputValue(),'0');
 await page.locator('#run').click();await page.waitForFunction(()=>window.__loadBearing.simulation?.elapsed>.1,null,{timeout:60000});
 if(!await page.locator('#concrete-controls').isVisible())await page.locator('#toggle-panels').click();
 if(!await page.locator('#concrete-strength').isVisible())await page.locator('#concrete-controls summary').click();
 await page.locator('[data-concrete-preset="standard"]').click();await page.locator('#concrete-apply-building').click();
 await page.waitForFunction(()=>window.__loadBearing.simulation?.elapsed>.1&&window.__loadBearing.pieces.find(p=>p.id===2)?.reinforcement===1,null,{timeout:60000});
 await page.locator('#concrete-controls').scrollIntoViewIfNeeded();await page.screenshot({path:`artifacts/concrete-ui-${mobile?'mobile':'desktop'}.png`});assert.deepEqual(errors,[]);console.log('PASS material UI',mobile?'mobile':'desktop');await context.close();
}}finally{await browser.close();}
