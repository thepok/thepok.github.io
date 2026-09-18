import {chromium} from '@playwright/test';import assert from 'node:assert/strict';
const b=await chromium.launch({channel:'chrome',headless:true}),p=await b.newPage({viewport:{width:1280,height:800}});
try{
 await p.goto(process.env.TEST_URL||'http://localhost:5174');await p.locator('#boot-screen').waitFor({state:'detached'});assert.equal(await p.locator('#fragment-limit').inputValue(),'1000');
 await p.waitForFunction(()=>window.__loadBearing.demo.phase===1&&!window.__loadBearing.demo.loading,{},{timeout:45000});await p.waitForFunction(()=>window.__loadBearing.scene.cannonArcs.visible);
 await p.waitForFunction(()=>window.__loadBearing.demo.phase===0&&!window.__loadBearing.demo.loading,{},{timeout:45000});assert.equal(await p.evaluate(()=>window.__loadBearing.scene.cannonArcs.visible),false);await p.screenshot({path:'artifacts/demo-second-cycle.png'});
 await p.keyboard.press('Escape');assert.equal(await p.evaluate(()=>window.__loadBearing.scene.cannonArcs.visible),false);
 assert.ok(await p.evaluate(()=>window.__loadBearing.pieces.every(p=>window.__loadBearing.scene.meshes.has(p.id))));
 await p.evaluate(()=>localStorage.setItem('loadbearing.fragment-limit','1500'));await p.reload();await p.locator('#boot-screen').waitFor({state:'detached'});assert.equal(await p.locator('#fragment-limit').inputValue(),'1500');
 console.log('PASS default 1000, saved 1500 retained, demo car-to-ball cycle and exit clear trajectory and restore blueprint meshes');
}finally{await b.close();}
