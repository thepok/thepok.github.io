import { chromium } from '@playwright/test';
import assert from 'node:assert/strict';
const browser=await chromium.launch({executablePath:process.env.LOCALAPPDATA+'/ms-playwright/chromium-1155/chrome-win/chrome.exe',headless:true,args:['--enable-unsafe-swiftshader']});
const page=await browser.newPage(),errors=[];page.on('pageerror',e=>errors.push(e.message));
try{
 await page.goto('http://127.0.0.1:5174');await page.waitForFunction(()=>window.__loadBearing?.ready);
 const result=await page.evaluate(async()=>{
  const s=window.__loadBearing.scene,T={Vector3:s.camera.position.constructor,Matrix4:s.camera.matrix.constructor};
  const pieces=[{id:101,kind:'slab',p:[10,16,6],rotation:1},{id:102,kind:'slab',p:[-10,8,6],rotation:0}];s.setPieces(pieces);
  const items=pieces.map(p=>{const g=s.meshes.get(p.id);return {id:p.id,kind:p.kind,stress:0,remnants:[{point:[1,0,0],sourceKind:'column',seed:77}],body:{GetPosition:()=>({GetX:()=>g.position.x,GetY:()=>g.position.y,GetZ:()=>g.position.z}),GetRotation:()=>({GetX:()=>g.quaternion.x,GetY:()=>g.quaternion.y,GetZ:()=>g.quaternion.z,GetW:()=>g.quaternion.w}),GetLinearVelocity:()=>({GetX:()=>0,GetY:()=>0,GetZ:()=>0})}}});
  const sim={items,elapsed:1,water:-8,hazardActive:()=>false};s.updatePhysics(sim);
  function error(id){const g=s.meshes.get(id),expected=new T.Vector3(1,0,0).applyMatrix4(g.matrix),m=new T.Matrix4();return Math.max(...s.remnantRefs.get(id).map(r=>{r.mesh.getMatrixAt(r.index,m);return new T.Vector3().setFromMatrixPosition(m).distanceTo(expected)}));}
  const initial=error(101),g=s.meshes.get(101);g.position.set(4,9,-3);g.rotation.set(.4,1.2,.8);g.userData.poseSynced=false;s.updatePhysics(sim);const moved=error(101);
  items[0].fractured=true;items[0].retired=true;s.updatePhysics(sim);
  function scales(id){const m=new T.Matrix4();return s.remnantRefs.get(id).map(r=>{r.mesh.getMatrixAt(r.index,m);return new T.Vector3().setFromMatrixScale(m).length()});}
  const hidden=scales(101),neighbor=scales(102);s.restorePieces(pieces);const afterRestart=[...s.remnantBatches.values()].flat().reduce((n,m)=>n+m.count,0);
  return {initial,moved,hidden,neighbor,afterRestart};
 });
 assert.ok(result.initial<.15&&result.moved<.15,JSON.stringify(result));assert.ok(result.hidden.every(n=>n===0));assert.ok(result.neighbor.every(n=>n>0));assert.equal(result.afterRestart,0);assert.deepEqual(errors,[]);console.log('PASS local attachment, rotated motion, parent fracture, neighboring instances and restart',result);
}finally{await browser.close();}

