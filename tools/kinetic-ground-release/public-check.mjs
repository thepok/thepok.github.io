import{chromium}from'@playwright/test';import assert from'node:assert/strict';import{mkdir,writeFile}from'node:fs/promises';
await mkdir('artifacts/public',{recursive:true});const browser=await chromium.launch({channel:'chrome',headless:true,args:['--enable-unsafe-swiftshader','--disable-dev-shm-usage']}),errors=[],report={};
const root='https://thepok.github.io/games/loadbearing-own-fast/';
try{
 const page=await browser.newPage({viewport:{width:1440,height:1000}});page.on('pageerror',e=>errors.push(e.message));
 await page.addInitScript(()=>{localStorage.setItem('loadbearing-own-fast.demo-seen','1');localStorage.setItem('loadbearing-own-fast.last-mode',JSON.stringify({challengeId:'sandbox-demolition-yard'}));localStorage.setItem('loadbearing-own-fast.fragment-limit','1000');});
 const wasm=[];page.context().on('request',r=>{if(r.url().endsWith('.wasm'))wasm.push(r.url());});
 await page.goto(root);await page.waitForFunction(()=>window.__loadBearing?.ready,{},{timeout:120000});
 await page.evaluate(()=>{document.getElementById('workshop-mode').click();document.getElementById('sandbox-mode').click();document.getElementById('clear').click();document.getElementById('procedural-style').value='art-deco';document.getElementById('procedural-count-number').value='1000';const old=Date.now;Date.now=()=>0x51a7;try{document.getElementById('generate-building').click();}finally{Date.now=old;}__loadBearing.scene.onPick([0,0,0],null);__loadBearing.scene.fitStructure();document.getElementById('run').click();});
 await page.waitForFunction(()=>__loadBearing.simulation?.elapsed>.2,{},{timeout:120000});
 await page.click('#kinetic-benchmark');await page.click('#kb-start');await page.waitForFunction(()=>__loadBearing.simulation.paused,{},{timeout:15000});await page.click('#kb-cancel');await page.waitForFunction(()=>!__loadBearing.simulation.paused);
 await page.screenshot({path:'artifacts/public/benchmark-controls.png'});await page.click('#kb-live');
 await page.waitForFunction(()=>window.__kineticLiveBenchmark,{},{timeout:300000});const live=await page.evaluate(()=>window.__kineticLiveBenchmark);
 assert.equal(live.ticks,1200);assert.equal(live.internalSubsteps,1200);assert.equal(live.final.finite,true);assert.equal(live.final.fragments,1000);assert.ok(live.final.meanHeight<10);assert.ok(live.traces.every(t=>t.minY>=-1));assert.ok(live.final.maxSpeed<25);assert.ok(live.interventions.every(i=>i==='trees-present'));
 await page.evaluate(()=>__loadBearing.simulation.pause(true));await page.screenshot({path:'artifacts/public/collapse.png'});await page.click('#kinetic-benchmark');await page.setViewportSize({width:390,height:844});await page.screenshot({path:'artifacts/public/mobile.png'});
 const build=await (await page.request.get(root+'BUILD.json')).json();
 const crypto=await import('node:crypto');const kernel=wasm.find(u=>/kernel-[^/]+\.wasm$/.test(u)&&!u.includes('reference'));assert.ok(kernel);const data=await(await page.request.get(kernel)).body();assert.equal(crypto.createHash('sha256').update(data).digest('hex'),build.kernel.optimizedSha256);
 assert.deepEqual(errors,[]);Object.assign(report,{url:root,browser:browser.version(),live,kernelUrl:kernel,verifiedKernelSha256:build.kernel.optimizedSha256,errors});console.log('PUBLIC_GROUND_PASS '+JSON.stringify({browser:report.browser,final:live.final,floorMotionClamps:live.floorMotionClamps}));
}finally{await writeFile('artifacts/public/verification.json',JSON.stringify({...report,errors},null,2));await browser.close();}
