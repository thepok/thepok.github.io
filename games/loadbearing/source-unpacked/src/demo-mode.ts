import * as THREE from 'three';
import {Simulation} from './simulation-client';
import {showcasePieces} from './showcases';
import {VEHICLE_PRESETS} from './vehicle-blueprint';
import {demoVehicleControls} from './demo-driving';
import type {V3} from './catalog';
import './demo-mode.css';

export class DemoMode{
 active=false;private sim:Simulation|null=null;private generation=0;private phase=0;private loading=false;private shots=0;private nextShot=2;private center=new THREE.Vector3();private cameraState:any;private overlay:HTMLElement;
 constructor(private scene:any,private hooks:{enter:()=>void;restore:()=>void},private prefix:string){
  this.overlay=document.createElement('section');this.overlay.id='demo-overlay';this.overlay.hidden=true;this.overlay.setAttribute('aria-label','Automatische Spielvorführung');this.overlay.innerHTML='<header><b>LOAD BEARING</b><span>LIVE-DEMO · ECHTE PHYSIK</span><button id="demo-skip">Selbst spielen →</button></header><footer><div><span id="demo-chapter">DEMO WIRD VORBEREITET</span><h2 id="demo-title">Bauen. Testen. Zerstören.</h2><p id="demo-description">Einen Moment – die Physik wird geladen.</p></div><span class="demo-exit-hint">ESC · Demo beenden</span></footer>';document.body.append(this.overlay);
  document.getElementById('demo-skip')!.onclick=()=>this.stop();
  const button=document.createElement('button');button.id='show-demo';button.textContent='Demo';button.onclick=()=>{document.querySelectorAll<HTMLDialogElement>('dialog[open]').forEach(d=>d.close());void this.start();};document.querySelector('.primary-modes')!.append(button);
  window.addEventListener('keydown',e=>{if(!this.active)return;e.preventDefault();e.stopImmediatePropagation();if(e.code==='Escape')this.stop();},true);
  document.addEventListener('visibilitychange',()=>{if(this.active)this.sim?.pause(document.hidden);});
 }
 async start(){
  if(this.active)return;this.active=true;const generation=++this.generation;
  try{localStorage.setItem(this.prefix+'.demo-seen','1');}catch{}
  if(document.pointerLockElement)document.exitPointerLock();
  this.hooks.enter();const s=this.scene;this.cameraState={position:s.camera.position.clone(),quaternion:s.camera.quaternion.clone(),target:s.controls.target.clone(),enabled:s.controls.enabled,grid:s.grid.visible,stress:s.stress};
  document.body.classList.add('demo-running');document.getElementById('app')!.inert=true;this.overlay.hidden=false;document.getElementById('demo-skip')!.focus();
  this.loading=true;
  try{await s.ready;if(!this.active||generation!==this.generation)return;await this.loadPhase(0,generation);}catch(error){if(this.active&&generation===this.generation){console.error('Demo initialization failed',error);this.stop();}}
 }
 private async loadPhase(phase:number,generation=this.generation){
  if(!this.active||generation!==this.generation)return;this.loading=true;this.phase=phase;this.sim?.dispose();this.sim=null;
  const s=this.scene,pieces=showcasePieces('maison-azur');s.setGhost(null);s.select(null);s.stress=false;s.buildEnvironment('sandbox');s.setPieces(pieces);s.controls.enabled=false;s.grid.visible=false;
  new THREE.Box3().setFromObject(s.structure).getCenter(this.center);s.camera.position.copy(this.center).add(new THREE.Vector3(30,18,34));s.camera.lookAt(this.center);s.controls.target.copy(this.center);
  const sim=new Simulation({},pieces,'sandbox',1,{sandbox:true,fragmentLimit:600,vehicleParts:phase===1?structuredClone(VEHICLE_PRESETS[2].parts):undefined});this.sim=sim;
  document.getElementById('demo-chapter')!.textContent=phase===0?'01 / SCHWERE TREFFER':'02 / FAHREN & FEUERN';
  document.getElementById('demo-title')!.textContent=phase===0?'Jeder Treffer verändert das Haus.':'Dein Fahrzeug. Deine Abrissmaschine.';
  document.getElementById('demo-description')!.textContent=phase===0?'Kugeln brechen Beton auf. Bauteile kippen, fallen und reißen andere mit.':'Aus Einzelteilen gebaut – mit echten Rädern, Motor und Kanone.';
  const bootStatus=document.getElementById('boot-status');if(bootStatus)bootStatus.textContent='Physik und Demo werden vorbereitet …';
  try{await Promise.all([sim.ready,s.prepareDestruction(pieces)]);if(!this.active||generation!==this.generation||this.sim!==sim)return;s.beginSimulation();s.grid.visible=false;s.updatePhysics(sim);sim.pause(document.hidden);this.nextShot=2;this.shots=0;this.loading=false;}catch(error){if(this.active&&generation===this.generation){console.error('Demo scene failed',error);this.stop();}}
 }
 update(dt:number){
  if(!this.active)return;const s=this.scene,sim=this.sim;
  if(!sim||this.loading){s.render(dt);return;}
  sim.step();s.updatePhysics(sim);const t=sim.elapsed;
  if(this.phase===0){
   const angle=.8+t*.08;s.camera.position.set(this.center.x+Math.cos(angle)*40,this.center.y+19,this.center.z+Math.sin(angle)*40);s.camera.lookAt(this.center);
   if(t>=this.nextShot){this.nextShot=t+1.7;const targets=sim.items.filter(i=>i.id>0&&!i.fractured&&['column','wall','slab'].includes(i.kind));const target=targets[(this.shots*7)%Math.max(1,targets.length)];if(target){const p=target.body.GetCenterOfMassPosition(),point=new THREE.Vector3(p.GetX(),p.GetY(),p.GetZ());const a=this.shots*.95;const from=new THREE.Vector3(this.center.x+Math.cos(a)*30,12+(this.shots%3)*5,this.center.z+Math.sin(a)*30),velocity=point.sub(from).normalize().multiplyScalar(55);sim.launchProjectile(from.toArray() as V3,velocity.toArray() as V3,6500,.8);}this.shots++;}
   if(t>18){void this.loadPhase(1);return;}
  }else{
   const chassis=sim.items.find(i=>i.kind==='vehicle-chassis');if(chassis){const p=chassis.body.GetPosition(),q=chassis.body.GetRotation();const aim:[number,number,number]=[this.center.x,4+(Math.floor(t/3)%3)*2,this.center.z];const input=demoVehicleControls([p.GetX(),p.GetY(),p.GetZ()],[q.GetX(),q.GetY(),q.GetZ(),q.GetW()],aim,t);sim.vehicleInput(input);s.aimVehicle(input.yaw,input.pitch,chassis);
    const car=s.meshes.get(chassis.id);if(car){const focus=this.center.clone().lerp(car.position,.3);const desired=focus.clone().add(new THREE.Vector3(30,22,34));s.camera.position.lerp(desired,1-Math.exp(-dt*2));s.camera.lookAt(focus);}
   }
   if(t>30){void this.loadPhase(0);return;}
  }
  s.render(dt);
 }
 stop(){
  if(!this.active)return;this.active=false;++this.generation;this.sim?.dispose();this.sim=null;this.loading=false;
  this.overlay.hidden=true;document.body.classList.remove('demo-running');document.getElementById('app')!.inert=false;
  this.hooks.restore();const s=this.scene,state=this.cameraState;if(state){s.camera.position.copy(state.position);s.camera.quaternion.copy(state.quaternion);s.controls.target.copy(state.target);s.controls.enabled=state.enabled;s.grid.visible=state.grid;s.stress=state.stress;}s.resize();document.getElementById('show-demo')?.focus();
 }
 get diagnostics(){return {active:this.active,phase:this.phase,loading:this.loading,elapsed:this.sim?.elapsed??0,shots:this.shots,projectiles:this.sim?.projectiles??0,fragments:this.sim?.fragments??0,items:this.sim?.items??[]};}
}
