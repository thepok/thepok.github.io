import { Box3, Vector3 } from 'three';
import { VEHICLE_PRESETS, VEHICLE_PARTS, validateVehicle, type VehiclePart } from './vehicle-blueprint';
import type { WorldVehicleSpec, WorldVehicleState } from './world-vehicles';
import type { V3 } from './catalog';
import type { GameScene } from './scene';
import type { Simulation } from './simulation-client';
import type { VehicleWorkshop } from './vehicle-workshop';
import { installWorldVehicleUI } from './world-vehicle-ui';

type Hooks={simulation:()=>Simulation|null;ensureSimulation:()=>Promise<Simulation|null>;workshop:()=>VehicleWorkshop;isSandbox:()=>boolean;isPaused:()=>boolean;pause:(value:boolean)=>void;leaveWalker:()=>void;changed:()=>void;toast:(message:string)=>void;clearTools:()=>void};

/** Vehicles are world objects; driving is only an input/camera attachment. */
export class SandboxWorld {
 specs:WorldVehicleSpec[]=[];
 selectedId:number|null=null;
 drivenId:number|null=null;
 placement:{parts:VehiclePart[];name:string;rotation:number}|null=null;
 choosingTarget=false;
 busy=false;
 private nextId=1;
 private ui:ReturnType<typeof installWorldVehicleUI>;
 private previewPosition:V3=[0,0,0];
 private pendingEdit=false;
 constructor(private scene:GameScene,private hooks:Hooks,private storagePrefix:string){
  try{this.importVehicles(JSON.parse(localStorage.getItem(storagePrefix+'.world-vehicles')??'[]'));}catch{}
  this.ui=installWorldVehicleUI({placePreset:id=>this.placePreset(id),create:()=>this.create(),enter:()=>void this.enter(),exit:()=>this.exit(),attack:()=>this.chooseTarget(),park:()=>this.park(),edit:()=>this.edit(),duplicate:()=>this.duplicate(),remove:()=>void this.remove(),cancelPlacement:()=>this.cancelPlacement()});
  window.addEventListener('keydown',event=>{
   if(!this.hooks.isSandbox()||document.querySelector('dialog[open]')||event.ctrlKey||event.altKey||event.metaKey||event.repeat)return;
   const target=event.target as HTMLElement|null;if(target?.isContentEditable||target instanceof HTMLInputElement||target instanceof HTMLTextAreaElement)return;
   if(event.code==='KeyE'){event.preventDefault();if(this.drivenId!==null)this.exit();else void this.enter();}
   if(event.code==='Escape'&&(this.placement||this.choosingTarget)){event.preventDefault();this.cancelPlacement();}
  });
 }
 importVehicles(value:unknown){
  if(!Array.isArray(value))return;
  const ids=new Set<number>();
  this.specs=value.filter(v=>v&&Number.isSafeInteger(v.id)&&v.id>0&&!ids.has(v.id)&&ids.add(v.id)&&Array.isArray(v.parts)&&!validateVehicle(v.parts)&&Array.isArray(v.position)&&v.position.length===3&&v.position.every((n:number)=>Number.isFinite(n)&&Math.abs(n)<490)&&Number.isFinite(v.rotation)&&typeof v.name==='string').map(v=>structuredClone(v));
  this.nextId=Math.max(0,...this.specs.map(v=>v.id))+1;
 }
 save(){try{localStorage.setItem(this.storagePrefix+'.world-vehicles',JSON.stringify(this.specs));}catch{this.hooks.toast('Fahrzeuge konnten nicht gespeichert werden.');}}
 get selected(){return this.hooks.simulation()?.worldVehicles.find(v=>v.id===this.selectedId)??null;}
 get driven(){return this.hooks.simulation()?.worldVehicles.find(v=>v.id===this.drivenId)??null;}
 select(id:number|null){if(this.busy)return;this.selectedId=id;this.choosingTarget=false;this.refresh();}
 refresh(){this.ui.refresh(this.selected,this.drivenId!==null,!!this.placement||this.choosingTarget);}
 placePreset(id:string){const preset=VEHICLE_PRESETS.find(p=>p.id===id);if(preset)this.beginPlacement(preset.parts,preset.name);}
 beginPlacement(parts:VehiclePart[],name:string){
  this.exit();this.hooks.leaveWalker();this.hooks.clearTools();this.choosingTarget=false;
  this.placement={parts:structuredClone(parts),name,rotation:0};this.selectedId=null;
  this.previewPosition=this.scene.controls.target.toArray() as V3;this.previewPosition[1]=0;this.updateGhost(this.previewPosition);
  this.hooks.toast('Fahrzeug platzieren: Boden anklicken · R drehen · Esc abbrechen.');this.refresh();this.hooks.changed();
 }
 updateGhost(point:V3){this.previewPosition=[point[0],0,point[2]];if(this.placement)this.scene.setVehicleGhost(this.placement.parts,this.previewPosition,this.placement.rotation);}
 moveGhost(point:V3){this.previewPosition=[point[0],0,point[2]];if(this.placement&&this.scene.ghost)this.scene.ghost.position.set(...this.previewPosition);}
 rotate(){if(!this.placement)return;this.placement.rotation+=Math.PI/2;this.updateGhost(this.previewPosition);}
 cancelPlacement(){this.placement=null;this.choosingTarget=false;this.scene.setGhost(null);this.refresh();this.hooks.changed();}
 async place(point:V3){
  if(!this.placement||this.busy)return;
  const placement=this.placement,position:V3=[point[0],0,point[2]];
  if(Math.abs(position[0])>475||Math.abs(position[2])>475){this.hooks.toast('Bitte innerhalb des Geländes platzieren.');return;}
  const bounds=new Box3();for(const part of placement.parts){const size=VEHICLE_PARTS[part.kind].size;for(const x of [-.5,.5])for(const z of [-.5,.5]){const p=new Vector3(part.p[0]+x*size[0],part.p[1],part.p[2]+z*size[2]).applyAxisAngle(new Vector3(0,1,0),placement.rotation).add(new Vector3(...position));bounds.expandByPoint(p);}}bounds.min.y=0;bounds.max.y+=1;
  const blocked=[...this.scene.meshes.values()].some(mesh=>mesh.visible&&!mesh.userData.instanceHidden&&!mesh.userData.vehiclePreview&&bounds.intersectsBox(new Box3().setFromObject(mesh)));
  const treeBlocked=this.scene.windTrees.some(tree=>bounds.distanceToPoint(new Vector3(tree.root.position.x,.8,tree.root.position.z))<1.2);
  if(blocked||treeBlocked){this.hooks.toast('Hier ist kein Platz. Wähle eine freie Stelle neben Gebäuden und Bäumen.');return;}
  this.busy=true;
  try{
   const sim=await this.hooks.ensureSimulation();if(!sim)return;
   const spec:WorldVehicleSpec={id:this.nextId++,parts:structuredClone(placement.parts),position,rotation:placement.rotation,name:placement.name};
   await sim.spawnWorldVehicle(spec);this.specs.push(spec);this.save();this.placement=null;this.scene.setGhost(null);this.scene.updatePhysics(sim);this.selectedId=spec.id;this.hooks.toast('Fahrzeug gesetzt. Anklicken: fahren, umbauen oder angreifen lassen.');
  }catch(error){this.hooks.toast(error instanceof Error?error.message:String(error));if(this.placement)this.updateGhost(position);}
  finally{this.busy=false;this.refresh();this.hooks.changed();}
 }
 async enter(){
  if(this.busy||this.selectedId===null)return;
  const id=this.selectedId;this.hooks.leaveWalker();this.cancelPlacement();
  const sim=await this.hooks.ensureSimulation();if(!sim)return;
  const state=sim.worldVehicles.find(v=>v.id===id);if(!state)return;
  if(this.drivenId!==null&&this.drivenId!==id)this.exit();
  this.drivenId=id;sim.setWorldVehicleMode(id,'drive');this.hooks.workshop().startDriving();this.scene.controls.enabled=false;this.scene.grid.visible=false;this.hooks.pause(false);this.refresh();this.hooks.changed();
 }
 exit(){
  if(this.drivenId===null)return;
  this.hooks.simulation()?.setWorldVehicleMode(this.drivenId,'parked');this.drivenId=null;this.hooks.workshop().stopDriving();this.scene.controls.enabled=true;this.scene.hideCannonTrajectory();this.scene.fadeVehicleOccluders();this.refresh();this.hooks.changed();
 }
 send(input:unknown){if(this.drivenId!==null)this.hooks.simulation()?.worldVehicleInput(this.drivenId,input);}
 chooseTarget(){if(!this.selected)return;this.exit();this.choosingTarget=true;this.hooks.toast('Ein Gebäude anklicken: Dieses Fahrzeug greift es an. Esc bricht ab.');this.refresh();}
 target(point:V3){if(!this.choosingTarget||this.selectedId===null)return;this.hooks.simulation()?.setWorldVehicleMode(this.selectedId,'attack',point);this.choosingTarget=false;this.hooks.pause(false);this.refresh();this.hooks.toast('Autonomer Angriff gestartet.');}
 park(){if(this.selectedId!==null)this.hooks.simulation()?.setWorldVehicleMode(this.selectedId,'parked');this.refresh();}
 create(){this.openEditor([{id:1,kind:'frame',p:[0,.8,0]}],'Eigenes Fahrzeug');}
 edit(){const current=this.selected;if(current)this.openEditor(current.parts,current.name,current);}
 private openEditor(parts:VehiclePart[],name:string,current?:WorldVehicleState){
  if(this.pendingEdit)return;this.exit();this.hooks.leaveWalker();const wasPaused=this.hooks.isPaused();this.hooks.pause(true);this.pendingEdit=true;
  const finish=()=>{this.pendingEdit=false;this.hooks.pause(wasPaused);this.refresh();};
  this.hooks.workshop().editBlueprint(structuredClone(parts),name,async updated=>{
   if(current){const sim=this.hooks.simulation();if(!sim)throw new Error('Die Welt ist nicht aktiv.');const spec={id:current.id,name,parts:structuredClone(updated),position:current.position,rotation:current.rotation};await sim.replaceWorldVehicle(spec);this.specs=this.specs.map(v=>v.id===spec.id?spec:v);this.save();this.scene.updatePhysics(sim);finish();}
   else{finish();this.beginPlacement(updated,name);}
  },finish);
 }
 duplicate(){const state=this.selected;if(state)this.beginPlacement(state.parts,state.name);}
 async remove(){const id=this.selectedId;if(id===null||this.busy)return;if(id===this.drivenId)this.exit();this.busy=true;try{await this.hooks.simulation()?.removeWorldVehicle(id);this.specs=this.specs.filter(v=>v.id!==id);this.save();this.selectedId=null;}catch(error){this.hooks.toast(String(error));}finally{this.busy=false;this.refresh();}}
 leave(){this.exit();this.cancelPlacement();this.selectedId=null;this.refresh();}
}
