import * as THREE from 'three';

/** Continuous, frame-timed movement; keyboard repeat never moves the camera. */
export class FreeCameraKeys {
 private keys=new Set<string>();
 private forward=new THREE.Vector3();
 private right=new THREE.Vector3();
 private delta=new THREE.Vector3();
 constructor(private scene:any,private enabled:()=>boolean){
  window.addEventListener('keydown',event=>{
   if(!['KeyW','KeyA','KeyS','KeyD'].includes(event.code)||!this.enabled())return;
   const target=event.target as HTMLElement|null;
   if(event.ctrlKey||event.metaKey||event.altKey||event.isComposing||target?.isContentEditable||target?.closest('input,textarea,select,dialog[open]')||document.querySelector('dialog[open]'))return;
   event.preventDefault();this.keys.add(event.code);
  });
  window.addEventListener('keyup',event=>this.keys.delete(event.code));
  window.addEventListener('blur',()=>this.keys.clear());
  document.addEventListener('visibilitychange',()=>this.keys.clear());
 }
 update(dt:number){
  this.scene.freeCameraLook=this.enabled();
  if(!this.enabled()||document.querySelector('dialog[open]')){this.keys.clear();return;}
  const f=Number(this.keys.has('KeyW'))-Number(this.keys.has('KeyS'));
  const r=Number(this.keys.has('KeyD'))-Number(this.keys.has('KeyA'));
  if(!f&&!r)return;
  this.scene.camera.getWorldDirection(this.forward);
  this.forward.y=0;
  if(this.forward.lengthSq()<.0001)this.forward.set(0,0,-1);
  this.forward.normalize();this.right.crossVectors(this.forward,this.scene.camera.up).normalize();
  this.delta.copy(this.forward).multiplyScalar(f).addScaledVector(this.right,r).normalize().multiplyScalar(18*Math.min(dt,.05));
  this.scene.camera.position.add(this.delta);this.scene.controls.target.add(this.delta);
 }
}
