import { WALKER_LOOK_LIMITS, walkerWeaponPitch } from './walker-aim';
import * as THREE from 'three';

export interface WalkerInput {
  forward: number;
  right: number;
  yaw: number;
  run: boolean;
  jump: boolean;
  fire: boolean;
  weapon: 'hammer' | 'cannon';
  pitch: number;
  trigger: number;
}

export interface WalkerHooks {
  send(input: WalkerInput): void;
  exit(): void;
  reset(): void;
}

export interface WalkerSnapshot {
  position: [number, number, number];
  velocity: [number, number, number];
  yaw: number;
  grounded: boolean;
  attackSequence?: number;
  attackTime?: number;
  weapon?: 'hammer'|'cannon';
}

/** Third-person presentation and input layer for WalkerPhysics. */
export class WalkerMode {
  public active = false;

  private readonly root = new THREE.Group();
  private readonly avatar = new THREE.Group();
  private readonly avatarBody: THREE.Mesh;private readonly limbs:THREE.Group[]=[];
  private readonly weaponRoot = new THREE.Group();
  private readonly hammer = new THREE.Group();
  private readonly cannon = new THREE.Group();
  private canvas: HTMLCanvasElement;
  private hud?: HTMLElement;
  private aimOverlay?: HTMLElement;
  private mobileUi?: HTMLElement;
  private joystick?: HTMLElement;
  private stick?: HTMLElement;
  private last?: WalkerSnapshot;
  private shown = new THREE.Vector3();
  private cameraPosition = new THREE.Vector3();
  private cameraTarget = new THREE.Vector3();
  private cameraRay = new THREE.Raycaster();
  private pointerId?: number;
  private lookPointerId?: number;
  private stickOrigin = new THREE.Vector2();
  private lookLast = new THREE.Vector2();
  private keys = new Set<string>();
  private forward = 0;
  private right = 0;
  private yaw = 0;
  private pitch = 0;private firstPerson=false;private savedFov=42;
  private jump = false;
  private run = false;
  private fire = false;
  private trigger = 0;
  private weapon: 'hammer'|'cannon' = 'hammer';
  private lastAttackSequence = 0;
  private attackAnimation = 0;
  private restoreControls?: { enabled: boolean };
  private handlers: Array<[EventTarget, string, EventListener, boolean?]> = [];
  private readonly materials: THREE.Material[] = [];

  constructor(private readonly scene: any, private readonly hooks: WalkerHooks) {
    this.canvas = scene.renderer.domElement as HTMLCanvasElement;
    this.avatarBody = new THREE.Mesh(
      new THREE.BoxGeometry(.5, .62, .3),
      this.track(new THREE.MeshStandardMaterial({ color: '#3f80a8', roughness: .72 })),
    );
    this.avatarBody.position.y = 1.02;
    this.avatarBody.castShadow = true;
    const head = new THREE.Mesh(new THREE.SphereGeometry(.23, 12, 8), this.track(new THREE.MeshStandardMaterial({ color: '#ffd0a6', roughness: .8 })));
    head.position.y = 1.49;
    head.castShadow = true;
    const footMaterial = this.track(new THREE.MeshStandardMaterial({ color: '#274b6e', roughness: .84 }));
    for(const side of [-1,1]){
      const leg=new THREE.Group();leg.position.set(side*.14,.72,0);
      const mesh=new THREE.Mesh(new THREE.BoxGeometry(.18,.59,.22),footMaterial);mesh.position.y=-.295;mesh.castShadow=true;leg.add(mesh);
      const foot=new THREE.Mesh(new THREE.BoxGeometry(.19,.14,.34),footMaterial);foot.position.set(0,-.62,-.06);foot.castShadow=true;leg.add(foot);this.avatar.add(leg);this.limbs.push(leg);
      const arm=new THREE.Group();arm.position.set(side*.35,1.29,0);const sleeve=new THREE.Mesh(new THREE.BoxGeometry(.15,.56,.19),this.avatarBody.material);sleeve.position.y=-.28;sleeve.castShadow=true;arm.add(sleeve);this.avatar.add(arm);this.limbs.push(arm);
    }
    this.avatar.add(this.avatarBody, head);
    this.buildWeapons();
    this.root.add(this.weaponRoot);
    this.root.add(this.avatar);
    this.root.visible = false;
  }

  private buildWeapons(): void {
    const wood = this.track(new THREE.MeshStandardMaterial({color:'#704d39', roughness:.78}));
    const steel = this.track(new THREE.MeshStandardMaterial({color:'#687783', metalness:.55, roughness:.3}));
    const handle = new THREE.Mesh(new THREE.CylinderGeometry(.045,.06,.9,8), wood); handle.rotation.x = -.5; handle.position.set(.32,-.27,-.28); this.hammer.add(handle);
    const head = new THREE.Mesh(new THREE.BoxGeometry(.5,.3,.3), steel); head.position.set(.32,.1,-.48); this.hammer.add(head);
    const tube = new THREE.Mesh(new THREE.CylinderGeometry(.12,.16,.72,12), steel); tube.rotation.x = Math.PI/2; tube.position.set(.32,0,-.32); this.cannon.add(tube);
    const stock = new THREE.Mesh(new THREE.BoxGeometry(.3,.2,.25), wood); stock.position.set(.32,-.04,.08); this.cannon.add(stock);
    this.weaponRoot.add(this.hammer, this.cannon);this.weaponRoot.traverse(o=>{if(o instanceof THREE.Mesh)o.castShadow=true;}); this.setWeaponVisual();
  }
  private setWeaponVisual(): void { this.hammer.visible = this.weapon === 'hammer'; this.cannon.visible = this.weapon === 'cannon'; }

  private track<T extends THREE.Material>(material: T): T { this.materials.push(material); return material; }
  private get camera(): THREE.Camera { return this.scene.camera as THREE.Camera; }
  private get controls(): any { return this.scene.controls; }

  setHeading(yaw:number):void { this.yaw=yaw;this.send(); }

  enter(): void {
    if (this.active) return;
    this.canvas=this.scene.renderer.domElement;this.trigger=0;this.fire=false;
    this.active = true; this.root.visible = true;document.body.classList.add('walker-active');
    this.scene.scene.add(this.root);
    this.restoreControls = { enabled: !!this.controls?.enabled };
    if (this.controls) this.controls.enabled = false;
    this.savedFov=this.scene.camera.fov;this.scene.camera.fov=65;this.scene.camera.updateProjectionMatrix();this.makeHud(); this.bind(); this.send();
  }

  leave(): void {
    if (!this.active) return;
    this.active = false;document.body.classList.remove('walker-active'); this.keys.clear(); this.forward = this.right = 0; this.jump = false; this.run = false; this.fire = false;
    this.send(); this.unbind();this.aimOverlay?.remove();this.aimOverlay=undefined;this.lookPointerId=this.pointerId=undefined;this.attackAnimation=0;this.lastAttackSequence=0;
    if (document.pointerLockElement === this.canvas) document.exitPointerLock();
    this.root.visible = false; this.root.removeFromParent();if(this.controls){this.controls.target.copy(this.shown).add(new THREE.Vector3(0,1,0));}
    if (this.hud) this.hud.remove(); this.hud = undefined; this.joystick = this.stick = undefined;
    if (this.mobileUi) this.mobileUi.remove(); this.mobileUi = undefined;
    if (this.controls && this.restoreControls) this.controls.enabled = this.restoreControls.enabled;
    this.scene.camera.fov=this.savedFov;this.scene.camera.updateProjectionMatrix();this.restoreControls = undefined; this.last = undefined;this.cameraPosition.set(0,0,0);
  }

  update(dt: number, snapshot?: WalkerSnapshot): void {
    if (!this.active) return;
    this.send();
    if (!snapshot) { this.last = undefined;this.cameraPosition.set(0,0,0); return; }
    if(document.querySelector('dialog[open]'))this.onBlur();
    const first = !this.last; this.last = snapshot;
    if (snapshot.attackSequence !== undefined && snapshot.attackSequence !== this.lastAttackSequence) { this.lastAttackSequence = snapshot.attackSequence; this.attackAnimation = .35; }
    const target = new THREE.Vector3(...snapshot.position);
    if (first || !Number.isFinite(this.shown.x)) this.shown.copy(target);
    const distance = this.shown.distanceTo(target);
    if (distance > 3) this.shown.copy(target);
    else this.shown.lerp(target.clone().add(new THREE.Vector3(...snapshot.velocity).multiplyScalar(Math.min(dt, .08) * .18)), 1 - Math.exp(-dt * 14));
    this.root.position.copy(this.shown); this.avatar.rotation.y = -snapshot.yaw;
    const moving = Math.hypot(this.forward, this.right) > .05 && snapshot.grounded;
    if (moving) this.avatarBody.rotation.z = Math.sin(performance.now() * .012) * .035;
    else this.avatarBody.rotation.z *= Math.exp(-dt * 8);
    const swing=moving?Math.sin(performance.now()*.014)*.45:0;this.limbs.forEach((limb,i)=>limb.rotation.x=swing*(i===0||i===3?1:-1));
    if (this.attackAnimation > 0) this.attackAnimation = Math.max(0, this.attackAnimation - dt);
    const attack = this.attackAnimation > 0 ? 1 - this.attackAnimation / .35 : 0;
    this.weaponRoot.rotation.y = -this.yaw;
    this.weaponRoot.rotation.set(walkerWeaponPitch(this.weapon,this.pitch)+(this.weapon === 'hammer' ? Math.sin(attack*Math.PI*2) * 1.15 : -Math.sin(attack*Math.PI) * .14),-this.yaw,0,'YXZ');
    this.weaponRoot.position.set(this.firstPerson?Math.sin(this.yaw)*.25:0,this.firstPerson?1.1:1.25,this.firstPerson?-Math.cos(this.yaw)*.25:0);this.limbs[3].rotation.x=1.15;this.limbs[1].rotation.x=this.weapon==='cannon'?1.15:0;
    this.updateCamera(dt);
    this.updateAim();
    const status = this.hud?.querySelector('[data-walker-status]');
    if (status) status.textContent = snapshot.grounded ? '' : ' · in der Luft';
  }

  private updateAim():void {
    if(!this.aimOverlay)return;
    const pitch=walkerWeaponPitch(this.weapon,this.pitch),cp=Math.cos(pitch),sp=Math.sin(pitch),sy=Math.sin(this.yaw),cy=Math.cos(this.yaw);
    const distance=this.weapon==='hammer'?2.8:30;
    const point=this.shown.clone().add(new THREE.Vector3(.32*cy+sy*cp*distance,1.25+sp*distance-(this.weapon==='cannon'?4.905*(distance/125)**2:0),.32*sy-cy*cp*distance));
    point.project(this.camera);const rect=this.canvas.getBoundingClientRect();
    this.aimOverlay.hidden=point.z>1||point.z< -1||!this.active;
    this.aimOverlay.style.left=`${rect.left+(point.x+1)*rect.width*.5}px`;
    this.aimOverlay.style.top=`${rect.top+(1-point.y)*rect.height*.5}px`;
  }

  private updateCamera(dt: number): void {
    const eye = this.shown.clone().add(new THREE.Vector3(0, 1.35, 0));
    const look = new THREE.Vector3(Math.sin(this.yaw) * Math.cos(this.pitch), Math.sin(this.pitch), -Math.cos(this.yaw) * Math.cos(this.pitch));
    this.cameraTarget.copy(eye).add(look.multiplyScalar(100));
    if(this.firstPerson){this.camera.position.copy(eye);this.camera.lookAt(this.cameraTarget);this.camera.updateMatrixWorld();this.avatar.visible=false;return;}
    const desired = this.firstPerson?eye.clone():eye.clone().add(new THREE.Vector3(-Math.sin(this.yaw) * 4.2, 1.25, Math.cos(this.yaw) * 4.2));
    const direction = desired.clone().sub(eye); const distance = direction.length(); direction.normalize();
    const world = this.worldMeshes();
    this.cameraRay.set(eye, direction); this.cameraRay.far = distance;
    const hit = this.cameraRay.intersectObjects(world, true).find(h => h.distance > .18);
    if (hit) desired.copy(eye).add(direction.multiplyScalar(Math.max(.12, hit.distance - .2)));
    
    if (this.firstPerson || !this.last || this.cameraPosition.lengthSq() < .001) this.cameraPosition.copy(desired);
    else this.cameraPosition.lerp(desired, 1 - Math.exp(-dt * 12));
    if (hit) this.cameraPosition.copy(desired);
    this.camera.position.copy(this.cameraPosition); this.camera.lookAt(this.cameraTarget);this.camera.updateMatrixWorld();
    this.avatar.visible = this.camera.position.distanceTo(eye) > .9;
  }

  private worldMeshes(): THREE.Object3D[] {
    const meshes: THREE.Object3D[] = [];
    for (const group of [this.scene.structure, this.scene.terrain, this.scene.extras].filter(Boolean)) {
      group.traverse((object: THREE.Object3D) => {
        if (!(object as THREE.Mesh).isMesh || !object.visible) return;
        let parent: THREE.Object3D | null = object.parent;
        while (parent) { if (!parent.visible) return; parent = parent.parent; }
        meshes.push(object);
      });
    }
    return meshes;
  }

  private send(): void {
    this.hooks.send({ forward: this.forward, right: this.right, yaw: this.yaw, run: this.run, jump: this.jump, fire: this.fire, weapon: this.weapon, pitch: this.pitch, trigger: this.trigger });
  }

  private bind(): void {
    const on = (target: EventTarget, type: string, fn: EventListener, capture = true) => { target.addEventListener(type, fn, capture); this.handlers.push([target, type, fn, capture]); };
    on(window, 'keydown', this.onKey as EventListener);
    on(window, 'keyup', this.onKey as EventListener);
    on(window, 'blur', this.onBlur as EventListener);
    on(document, 'pointerlockchange', this.onLock as EventListener, false);
    on(window, 'mousemove', this.onMouse as EventListener, false);
    on(this.canvas, 'pointerdown', this.onPointerDown as EventListener);
    on(this.canvas, 'pointermove', this.onPointerMove as EventListener);
    on(this.canvas, 'pointerup', this.onPointerUp as EventListener);
    on(this.canvas, 'pointercancel', this.onPointerUp as EventListener);
  }
  private unbind(): void { for (const [t, type, fn, capture] of this.handlers) t.removeEventListener(type, fn, capture); this.handlers = []; }
  private editable(target: EventTarget | null): boolean { const el = target as HTMLElement | null; return !!el && ((el instanceof HTMLInputElement&&!['range','checkbox','radio','button'].includes(el.type))||el.tagName==='TEXTAREA'||el.tagName==='SELECT'||!!el.isContentEditable||!!el.closest('dialog[open]')); }
  private onKey = (event: Event): void => {
    if (!this.active) return; const e = event as KeyboardEvent;
    if (e.type==='keydown'&&(e.ctrlKey||e.metaKey||e.altKey||this.editable(e.target)||document.querySelector('dialog[open]'))) return;
    const movement = ['KeyW','KeyA','KeyS','KeyD','ShiftLeft','ShiftRight','Space','KeyF','KeyR','KeyV','Digit1','Digit2'];
    if (!movement.includes(e.code)) return;
    e.preventDefault(); e.stopImmediatePropagation();
    if (e.type === 'keydown') {
      if (e.code === 'KeyR' && !e.repeat) { this.onBlur(); this.hooks.reset(); return; }
      if(e.code==='KeyV'){if(!e.repeat)this.firstPerson=!this.firstPerson;return;}
      if(e.code==='Digit1'||e.code==='Digit2'){if(!e.repeat){this.weapon=e.code==='Digit1'?'hammer':'cannon';this.setWeaponVisual();this.updateWeaponHud();this.send();}return;}
      if (e.code === 'KeyF') { this.startFire(); return; }
      this.keys.add(e.code);
    } else { this.keys.delete(e.code); if(e.code==='KeyF') this.stopFire(); }
    this.recompute();
  };
  private recompute(): void { this.forward = Number(this.keys.has('KeyW')) - Number(this.keys.has('KeyS')); this.right = Number(this.keys.has('KeyD')) - Number(this.keys.has('KeyA')); this.run = this.keys.has('ShiftLeft') || this.keys.has('ShiftRight'); this.jump = this.keys.has('Space'); this.send(); }
  private onBlur = (): void => { this.keys.clear(); this.fire = false; this.recompute(); };
  private onLock = (): void => { if (!this.active) return; this.keys.clear(); this.fire=false; this.recompute(); };
  private onMouse = (event: Event): void => { if (!this.active || document.pointerLockElement !== this.canvas) return; const e = event as MouseEvent; this.yaw += e.movementX * .0024; this.pitch = Math.max(WALKER_LOOK_LIMITS.min, Math.min(WALKER_LOOK_LIMITS.max, this.pitch - e.movementY * .0018)); this.send(); };
  private onPointerDown = (event: Event): void => {
    if (!this.active) return; const e = event as PointerEvent; if (this.editable(e.target)||document.querySelector('dialog[open]')) return;
    e.preventDefault(); e.stopImmediatePropagation();
    if (e.pointerType === 'touch') { this.lookPointerId = e.pointerId; this.lookLast.set(e.clientX, e.clientY); }
    else if (document.pointerLockElement !== this.canvas) this.canvas.requestPointerLock?.();
    else if (e.button === 0) this.startFire();
  };
  private startFire = (): void => { if (!this.active || this.fire) return; this.fire=true; this.trigger++; this.send(); };
  private stopFire = (): void => { if (!this.fire) return; this.fire=false; this.send(); };
  private onPointerMove = (event: Event): void => { if (!this.active) return; const e = event as PointerEvent; if (e.pointerId !== this.lookPointerId) return; const dx = e.clientX - this.lookLast.x, dy = e.clientY - this.lookLast.y; this.lookLast.set(e.clientX, e.clientY); this.yaw += dx * .004; this.pitch = Math.max(WALKER_LOOK_LIMITS.min, Math.min(WALKER_LOOK_LIMITS.max, this.pitch - dy * .003)); this.send(); e.preventDefault(); e.stopImmediatePropagation(); };
  private onPointerUp = (event: Event): void => { const e = event as PointerEvent; if (e.pointerId === this.lookPointerId) this.lookPointerId = undefined; if (e.pointerType !== 'touch' && e.button === 0) this.stopFire(); e.preventDefault(); e.stopImmediatePropagation(); };

  private makeHud(): void {
    const hud = document.createElement('div'); this.hud = hud; hud.dataset.walkerHud = 'true';
    Object.assign(hud.style, { position:'fixed', left:'50%', top:'70px',transform:'translateX(-50%)', zIndex:'30', width:'590px', maxWidth:'calc(100vw - 24px)', color:'#15384b', background:'rgba(207,239,249,.9)', border:'1px solid #8fc5d7', borderRadius:'9px', padding:'9px 12px', font:'600 12px system-ui', pointerEvents:'none', boxShadow:'0 4px 16px #16384b22', textAlign:'center' });
    hud.innerHTML = '<b>ERKUNDEN</b> <span data-walker-status></span><small class="walker-key-help">WASD · Shift: rennen · Space: springen · 1/2: Werkzeug · F/Linksklick: Angriff · V: Ansicht · R: Weltreset</small>';
    const leave=document.createElement('button');leave.id='leave-walk';leave.textContent='Beenden';leave.title='Zur freien Sandbox-Kamera zurückkehren; die Simulation läuft weiter.';leave.dataset.help=leave.title;leave.style.pointerEvents='auto';leave.onclick=()=>this.hooks.exit();hud.append(leave);const view=document.createElement('button');view.textContent='Ansicht · V';view.title='Zwischen Schulterkamera und Ich-Perspektive umschalten.';view.dataset.help=view.title;view.style.pointerEvents='auto';view.onclick=()=>this.firstPerson=!this.firstPerson;hud.append(view);
    const hammer=document.createElement('button');hammer.textContent='1 Hammer';hammer.title='Großen Vorschlaghammer wählen; Angriff gedrückt halten';hammer.dataset.weapon='hammer';hammer.style.pointerEvents='auto';hammer.onclick=()=>{this.weapon='hammer';this.setWeaponVisual();this.updateWeaponHud();this.send();};
    const cannon=document.createElement('button');cannon.textContent='2 Kanone';cannon.title='Schultergestützte Kugelkanone wählen; Angriff gedrückt halten';cannon.dataset.weapon='cannon';cannon.style.pointerEvents='auto';cannon.onclick=()=>{this.weapon='cannon';this.setWeaponVisual();this.updateWeaponHud();this.send();};
    const attack=document.createElement('button');attack.textContent='ANGRIFF';attack.title='Gedrückt halten: Hammer schwingen oder Kugelkanone abfeuern';attack.style.pointerEvents='auto';attack.onpointerdown=e=>{e.preventDefault();attack.setPointerCapture(e.pointerId);this.startFire();};for(const type of ['pointerup','pointercancel','lostpointercapture'])attack.addEventListener(type,()=>this.stopFire());hud.append(hammer,cannon,attack); this.updateWeaponHud();
    const aim=document.createElement('span'); this.aimOverlay=aim; aim.dataset.walkerAim='true'; aim.textContent='•'; Object.assign(aim.style,{position:'fixed',left:'50%',top:'50%',transform:'translate(-50%,-50%)',fontSize:'24px',lineHeight:'1',color:'#fff',textShadow:'0 1px 3px #000',pointerEvents:'none',zIndex:'40'}); document.body.append(aim); document.body.append(hud);
    if (matchMedia('(pointer: coarse)').matches || 'ontouchstart' in window) this.makeMobileHud();
  }
  private makeMobileHud(): void {
    const ui = document.createElement('div'); this.mobileUi = ui;
    const pad = document.createElement('div'); this.joystick = pad; pad.title = 'Drag to move';
    Object.assign(pad.style, { position:'fixed', left:'18px', bottom:'92px', width:'112px', height:'112px', borderRadius:'50%', background:'rgba(185,226,240,.72)', border:'2px solid #79b5c9', zIndex:'31', touchAction:'none' });
    const stick = document.createElement('div'); this.stick = stick; Object.assign(stick.style, { position:'absolute', left:'32px', top:'32px', width:'44px', height:'44px', borderRadius:'50%', background:'#4a95b3', border:'2px solid #d9f5ff' }); pad.append(stick); document.body.append(pad);
    const jump = this.mobileButton('Sprung', 'Springen'); const attack=this.mobileButton('Angriff','Werkzeug einsetzen'); const exit = this.mobileButton('Welt ↻', 'Setzt die Welt zurück und startet wieder als Figur.'); Object.assign(jump.style,{right:'82px'}); Object.assign(attack.style,{right:'18px',bottom:'155px'}); Object.assign(exit.style,{right:'18px',bottom:'210px'}); ui.append(pad, jump, attack, exit); document.body.append(ui);
    const down = (e: PointerEvent) => { e.preventDefault(); pad.setPointerCapture(e.pointerId); this.pointerId=e.pointerId; this.stickOrigin.set(e.clientX,e.clientY); };
    const move = (e: PointerEvent) => { if (e.pointerId!==this.pointerId)return; const dx=e.clientX-this.stickOrigin.x,dy=e.clientY-this.stickOrigin.y,len=Math.min(40,Math.hypot(dx,dy)),a=Math.atan2(dy,dx); this.right=Math.cos(a)*len/40; this.forward=-Math.sin(a)*len/40; Object.assign(stick.style,{transform:`translate(${Math.cos(a)*len}px,${Math.sin(a)*len}px)`}); this.send(); };
    const up = () => { this.pointerId=undefined; this.forward=this.right=0; stick.style.transform=''; this.send(); };
    pad.addEventListener('pointerdown',down); pad.addEventListener('pointermove',move); pad.addEventListener('pointerup',up); pad.addEventListener('pointercancel',up);
    jump.addEventListener('pointerdown',e=>{e.preventDefault();jump.setPointerCapture(e.pointerId);this.jump=true;this.send();}); for(const type of ['pointerup','pointercancel','lostpointercapture'])jump.addEventListener(type,()=>{this.jump=false;this.send();}); exit.addEventListener('click',()=>this.hooks.reset());
    attack.addEventListener('pointerdown',e=>{e.preventDefault();attack.setPointerCapture(e.pointerId);this.startFire();}); for(const type of ['pointerup','pointercancel','lostpointercapture'])attack.addEventListener(type,()=>this.stopFire());
  }
  private updateWeaponHud(): void { this.hud?.querySelectorAll<HTMLElement>('[data-weapon]').forEach(b=>b.style.fontWeight=b.dataset.weapon===this.weapon?'800':'500'); }
  private mobileButton(label: string, title: string): HTMLButtonElement { const b=document.createElement('button'); b.type='button'; b.textContent=label; b.title=title; Object.assign(b.style,{position:'fixed',right:'18px',bottom:'100px',zIndex:'31',width:'56px',height:'42px',borderRadius:'8px',border:'1px solid #79b5c9',background:'#c8edf7',color:'#15384b',font:'700 11px system-ui',touchAction:'none'}); return b; }

  dispose(): void { this.leave(); this.root.traverse(o=>{if(o instanceof THREE.Mesh)o.geometry.dispose();}); for(const material of this.materials) material.dispose(); }
}

export default WalkerMode;
