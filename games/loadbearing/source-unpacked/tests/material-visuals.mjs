import {chromium} from '@playwright/test';
import assert from 'node:assert/strict';
const browser=await chromium.launch({channel:'chrome',headless:true}),page=await browser.newPage({viewport:{width:1600,height:1000}}),errors=[];
page.on('pageerror',e=>errors.push(e.message));
try{
 await page.addInitScript(()=>{localStorage.setItem('loadbearing.demo-seen','1');localStorage.setItem('loadbearing.last-mode',JSON.stringify({challengeId:'sandbox-demolition-yard'}));});
 await page.goto(process.env.TEST_URL||'http://localhost:5174/');await page.locator('#boot-screen').waitFor({state:'detached',timeout:60000});
 const result=await page.evaluate(()=>{
  const s=window.__loadBearing.scene,kinds=['column','slab','wall','foundation','doorway','stair','stairwell','core'];
  const pieces=kinds.flatMap((kind,i)=>[.4,1,2.5].map((reinforcement,j)=>({id:i*3+j+1,kind,p:[(i%4)*18+j*5-34,1,Math.floor(i/4)*12-5],rotation:0,finish:'ivory',concreteStrength:j===0?.25:j===1?1:2.5,reinforcement})));
  s.setPieces(pieces);s.grid.visible=false;s.sockets.visible=false;s.controls.target.set(0,2,2);s.camera.position.set(34,36,55);s.camera.lookAt(s.controls.target);s.controls.update();
  document.body.classList.add('demo-running');
  const colors=[1,2,3].map(id=>s.instanceRefs.get(id).find(r=>!r.mesh.userData.rebarMarking).baseColor);
  const batches=new Set([1,2,3].map(id=>s.instanceRefs.get(id).find(r=>!r.mesh.userData.rebarMarking).mesh.uuid));
  return {colors,batches:batches.size,marks:pieces.map(p=>({kind:p.kind,n:s.meshes.get(p.id).children.filter(m=>m.userData.rebarMarking).length})),drawBatches:s.structure.children.filter(o=>o.isInstancedMesh&&o.userData.rebarMarking).length};
 });
 assert.equal(result.batches,1,'Concrete strength must not split render batches');assert.ok(result.colors[0]>result.colors[1]&&result.colors[1]>result.colors[2]);assert.ok(result.marks.every(p=>p.n===1));assert.ok(result.drawBatches<=24);
 await page.waitForTimeout(500);await page.screenshot({path:'artifacts/material-visuals.png'});
 await page.evaluate(()=>{const s=window.__loadBearing.scene;s.camera.position.set(-34,27,-50);s.camera.lookAt(s.controls.target);s.controls.update();});await page.waitForTimeout(500);await page.screenshot({path:'artifacts/material-visuals-reverse.png'});
 assert.deepEqual(errors,[]);console.log('PASS material appearance and shared instance batches',result);
}finally{await browser.close();}
