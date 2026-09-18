import {chromium} from '@playwright/test';
import assert from 'node:assert/strict';
const browser=await chromium.launch({executablePath:process.env.LOCALAPPDATA+'/ms-playwright/chromium-1155/chrome-win/chrome.exe',headless:true,args:['--enable-unsafe-swiftshader']});
const page=await browser.newPage({viewport:{width:1536,height:960}}),errors=[];
page.on('pageerror',e=>errors.push(e.message));
try{
 await page.goto(process.env.TEST_URL||'http://127.0.0.1:5174');await page.waitForFunction(()=>window.__loadBearing?.ready,{},{timeout:60000});
 await page.click('#workshop-mode');await page.click('#vehicle-mode');await page.click('#vehicle-drive');await page.waitForFunction(()=>window.__loadBearing.simulation?.items.some(i=>i.kind==='vehicle-chassis'));
 const clearing=await page.evaluate(()=>window.__loadBearing.scene.windTrees.map(t=>Math.hypot(t.root.userData.baseX,t.root.userData.baseZ-20)-t.height*.31));assert.ok(clearing.length>0&&clearing.every(d=>d>16),'vehicle spawn and canopy clearance must be free of visual and physical trees');
 await page.waitForTimeout(1500);await page.keyboard.down('d');await page.waitForTimeout(500);
 const sample=await page.evaluate(()=>new Promise(resolve=>{
  let frames=0,rawChanges=0,renderChanges=0,previousRaw,previousRender;const start=performance.now();
  function frame(){const app=window.__loadBearing,body=app.simulation.items.find(i=>i.kind==='vehicle-chassis').body;
   const raw=body.GetRotation(),render=app.scene.meshes.get(-50000).quaternion;
   const a=[raw.GetX(),raw.GetY(),raw.GetZ(),raw.GetW()],b=render.toArray();
   if(previousRaw){frames++;if(a.some((n,i)=>Math.abs(n-previousRaw[i])>1e-6))rawChanges++;if(b.some((n,i)=>Math.abs(n-previousRender[i])>1e-6))renderChanges++;}
   previousRaw=a;previousRender=b;if(performance.now()-start<2000)requestAnimationFrame(frame);else resolve({frames,rawChanges,renderChanges});
  }requestAnimationFrame(frame);
 }));
 await page.keyboard.up('d');console.log('D-only rotation updates',sample);
 assert.ok(sample.frames>30);assert.ok(sample.renderChanges>sample.rawChanges*1.25,'rotation must advance between worker snapshots');
 await page.keyboard.down('w');await page.keyboard.down('d');await page.waitForTimeout(2000);await page.keyboard.up('w');await page.keyboard.up('d');
 await page.screenshot({path:'artifacts/steering-smooth.png'});assert.deepEqual(errors,[]);
 console.log('PASS D-only smooth rotation and W+D driving');
}finally{await browser.close();}

