import {DestructionAudio} from './destruction-audio';
import * as THREE from 'three';
import {VEHICLE_SPAWN,VEHICLE_SPAWN_CLEARANCE} from './vehicle-blueprint';
import {cannonLaunch,cannonTrajectory} from './cannon-ballistics';
import { vehicleVisual, vehicleAssembly } from './vehicle-workshop';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { mergeGeometries } from 'three/addons/utils/BufferGeometryUtils.js';
import { PARTS, FINISHES, ports, type Piece, type Scenario, type V3 } from './catalog';
import { concreteRenderColor, isConcrete } from './concrete-materials';
import {createRebarMarkings,reinforcementMarkLevel} from './rebar-markings';
import type { SimulationView as Simulation } from './simulation-view';
import { FragmentBatches } from './fragment-batches';
import { MeshStandardNodeMaterial } from 'three/webgpu';
import { dot, materialColor, mix, oneMinus, positionWorld, smoothstep, uniform, vec3, vec4 } from 'three/tsl';

const mat=(color:THREE.ColorRepresentation,roughness=.82)=>new THREE.MeshStandardMaterial({color,roughness});
function box(size:V3,p:V3,material:THREE.Material,parent:THREE.Object3D) { const m=new THREE.Mesh(new THREE.BoxGeometry(...size),material);m.position.set(...p); m.castShadow=true;m.receiveShadow=true;parent.add(m);return m; }
function concreteRenderInset(kind:Piece['kind']) { return ({column:.002,slab:.004,stairwell:.006,wall:.008,doorway:.010,core:.012,stair:.014,foundation:.016} as Partial<Record<Piece['kind'],number>>)[kind]??0; }
function structuralFragmentGeometry(size:V3,kind:string,seed:number){if(kind==='slab'||kind==='deck')return concretePlateGeometry(size,seed);const source=new THREE.BoxGeometry(...size),geometry=source.toNonIndexed();source.dispose();return geometry;}
function fragmentRandom(seed:number,salt=0){let state=(Math.imul(Math.abs(seed)+1,2654435761)^salt^0x9e3779b9)>>>0;return()=>{state=(Math.imul(state,1664525)+1013904223)>>>0;return state/4294967296;};}
function facetedGeometry(vertices:number[],indices:number[]){const geometry=new THREE.BufferGeometry();geometry.setAttribute('position',new THREE.Float32BufferAttribute(vertices,3));geometry.setIndex(indices);const faceted=geometry.toNonIndexed();geometry.dispose();faceted.computeVertexNormals();return faceted;}
function partitionGeometry(points:V3[]){
 const vertices=points.flatMap(point=>point), indices=[0,2,1,3,4,5,0,3,4,0,4,1,1,4,5,1,5,2,2,5,3,2,3,0];
 return facetedGeometry(vertices,indices);
}
function jaggedBlockGeometry(size:V3,seed:number){
 const random=fragmentRandom(seed,11);
 const signs:V3[]=[[-1,-1,1],[1,-1,1],[1,1,1],[-1,1,1],[-1,-1,-1],[1,-1,-1],[1,1,-1],[-1,1,-1]];
 const vertices:number[]=[];
 for(const sign of signs)for(let axis=0;axis<3;axis++)vertices.push(sign[axis]*size[axis]*.5*(.82+random()*.2)+(random()-.5)*size[axis]*.08);
 const indices=[0,1,2,0,2,3,1,5,6,1,6,2,5,4,7,5,7,6,4,0,3,4,3,7,3,2,6,3,6,7,4,5,1,4,1,0];
 return facetedGeometry(vertices,indices);
}
// Six irregular perimeter corners, at most 60 vertices: fits the existing debris batch.
// Keep the inexpensive box collider; only the fractured concrete silhouette changes.
function concretePlateGeometry(size:V3,seed:number){
 const random=fragmentRandom(seed,109),thin=size.indexOf(Math.min(...size)),axes=[0,1,2].filter(a=>a!==thin);
 const count=random()<.45?5:6,phase=random()*Math.PI*2,outline:number[][]=[];
 for(let i=0;i<count;i++){const angle=phase+(i+(random()-.5)*.38)*Math.PI*2/count,radius=.47+random()*.2;outline.push([Math.max(-.5,Math.min(.5,Math.cos(angle)*radius)),Math.max(-.5,Math.min(.5,Math.sin(angle)*radius))]);}
 const vertices:number[]=[],indices:number[]=[];
 for(const side of [-1,1])for(const [x,z] of outline){const v=[0,0,0];v[axes[0]]=x*size[axes[0]];v[axes[1]]=z*size[axes[1]];v[thin]=side*size[thin]*(.35+random()*.15);vertices.push(...v);}
 for(let i=1;i<count-1;i++)indices.push(0,i+1,i,count,count+i,count+i+1);
 for(let i=0;i<count;i++){const j=(i+1)%count;indices.push(i,j,j+count,i,j+count,i+count);}
 // X/Z ordering has the opposite handedness to X/Y and Y/Z.
 if(thin===1)for(let i=0;i<indices.length;i+=3)[indices[i+1],indices[i+2]]=[indices[i+2],indices[i+1]];
 return facetedGeometry(vertices,indices);
}
function triangularShardGeometry(size:V3,seed:number){
 const random=fragmentRandom(seed,23),thin=size.indexOf(Math.min(...size)),plane=[0,1,2].filter(axis=>axis!==thin),a=plane[0],b=plane[1],half=size.map(n=>n*.5) as V3;
 const triangle=[[-half[a],-half[b]],[half[a]*(.75+random()*.2),-half[b]*(.8+random()*.18)],[(random()-.5)*half[a],half[b]]];
 const vertices:number[]=[];
 for(const side of [-1,1])for(const point of triangle){const v:V3=[0,0,0];v[thin]=side*half[thin]*(.84+random()*.14);v[a]=point[0]+(random()-.5)*size[a]*.05;v[b]=point[1]+(random()-.5)*size[b]*.05;vertices.push(...v);}
 return facetedGeometry(vertices,[0,2,1,3,4,5,0,1,4,0,4,3,1,2,5,1,5,4,2,0,3,2,3,5]);
}
function tetraShardGeometry(size:V3,seed:number){
 const random=fragmentRandom(seed,37),base:V3[]=[[-.5,-.5,-.5],[.5,-.42,.34],[-.36,.5,.42],[.34,.28,-.5]],vertices:number[]=[];
 for(const point of base)for(let axis=0;axis<3;axis++)vertices.push((point[axis]+(random()-.5)*.12)*size[axis]);
 return facetedGeometry(vertices,[0,2,1,0,1,3,0,3,2,1,2,3]);
}
function roundedRubbleGeometry(size:V3,seed:number){
 const random=fragmentRandom(seed,51),geometry=new THREE.IcosahedronGeometry(.5,0);geometry.scale(size[0]*(.78+random()*.18),size[1]*(.78+random()*.18),size[2]*(.78+random()*.18));geometry.rotateX((random()-.5)*1.2);geometry.rotateY((random()-.5)*1.2);geometry.computeVertexNormals();return geometry;
}
function fractureGeometry(size:V3,seed:number,sourceKind:string){
 const pick=fragmentRandom(seed,73)();
 if(sourceKind==='slab'||sourceKind==='deck')return concretePlateGeometry(size,seed);
 if(sourceKind==='facade')return pick<.72?triangularShardGeometry(size,seed):jaggedBlockGeometry(size,seed);
 if(pick<.34)return triangularShardGeometry(size,seed);
 if(pick<.54)return tetraShardGeometry(size,seed);
 if(pick<.74)return roundedRubbleGeometry(size,seed);
 return jaggedBlockGeometry(size,seed);
}
function remnantSize(kind:string):V3 {
 if(kind==='column')return [.4,.64,.4];
 if(kind==='slab'||kind==='deck'||kind==='foundation')return [.82,.18,.62];
 if(kind==='wall'||kind==='facade')return [.62,.58,.16];
 if(kind==='girder')return [.68,.24,.3];
 return [.5,.31,.29];
}
function beam(a:V3,b:V3,width:number,material:THREE.Material,parent:THREE.Object3D){const v1=new THREE.Vector3(...a),v2=new THREE.Vector3(...b),dir=v2.clone().sub(v1);const m=box([width,dir.length(),width],[...v1.add(v2).multiplyScalar(.5).toArray()] as V3,material,parent);m.quaternion.setFromUnitVectors(new THREE.Vector3(0,1,0),dir.normalize());return m;}
interface PieceInstanceRef { mesh:THREE.InstancedMesh; index:number; local:THREE.Matrix4; baseColor:number }
interface RemnantInstanceRef { mesh:THREE.InstancedMesh; index:number; local:THREE.Matrix4 }
export class GameScene {
 freeCameraLook=false;
 private fragmentBatches = new FragmentBatches();
 private fragmentsPrepared = false;
 renderer:any; rendererBackend:'initializing'|'webgpu'|'webgl'='initializing'; readonly ready:Promise<void>; scene=new THREE.Scene(); camera=new THREE.PerspectiveCamera(42,1,.1,1700); controls:OrbitControls;
 terrain=new THREE.Group(); structure=new THREE.Group(); extras=new THREE.Group(); grid=new THREE.Group(); sockets=new THREE.Group(); ghost?:THREE.Group; selection?:THREE.BoxHelper;
  readonly audio=new DestructionAudio();
  meshes=new Map<number,THREE.Group>(); private instanceRefs=new Map<number,PieceInstanceRef[]>();private remnantRefs=new Map<number,RemnantInstanceRef[]>();private remnantBatches=new Map<string,THREE.InstancedMesh[]>();private instanceMatrix=new THREE.Matrix4();private instanceColor=new THREE.Color(); water:THREE.Mesh; ray=new THREE.Raycaster(); pointer=new THREE.Vector2(); level=0; scenario:Scenario='bridge'; stress=false; hoverId:number|null=null;hoverVehicleId:number|null=null;hoverPoint:V3|null=null; onPick?:(p:V3,id:number|null)=>void; lastDown=[0,0]; fps=60; frame=0;
  private focusHeight=uniform(0);private focusAmount=uniform(1);
  windGroup=new THREE.Group(); windTrees:{root:THREE.Group;trunk:THREE.Mesh;canopy:THREE.Mesh[];height:number}[]=[]; windLeaves?:THREE.InstancedMesh; windLeafBases:THREE.Vector3[]=[]; windLeafPhases:number[]=[]; private fracturedSeen=new Set<number>();private rebarBatches:THREE.InstancedMesh[]=[];
 private cannonArcs=new THREE.Group();
 effectsReady=false;private warmingEffects=false;private effectWarmup?:THREE.Group;
 buildHeight={value:0}; buildFocus={value:1};
 constructor(public container:HTMLElement) {
  this.renderer=new THREE.WebGLRenderer({antialias:true,powerPreference:'high-performance'});this.renderer.setPixelRatio(Math.min(devicePixelRatio,2));this.renderer.shadowMap.enabled=true;this.renderer.shadowMap.type=THREE.PCFSoftShadowMap;this.renderer.outputColorSpace=THREE.SRGBColorSpace;this.renderer.toneMapping=THREE.ACESFilmicToneMapping;this.renderer.toneMappingExposure=1.25;container.append(this.renderer.domElement);
  this.scene.background=new THREE.Color('#b6cbc7');this.scene.fog=new THREE.Fog('#b6cbc7',180,850);
  this.scene.add(new THREE.HemisphereLight('#e6f0e1','#546c66',2.4));
  const sun=new THREE.DirectionalLight('#fff0d0',3.3);sun.position.set(-26,46,24);sun.castShadow=true;sun.shadow.mapSize.set(2048,2048);sun.shadow.camera.left=-45;sun.shadow.camera.right=45;sun.shadow.camera.top=38;sun.shadow.camera.bottom=-38;sun.shadow.normalBias=.08;sun.shadow.bias=-.0002;this.scene.add(sun);
  this.scene.add(this.terrain,this.structure,this.extras,this.grid,this.sockets,this.windGroup,this.cannonArcs,this.fragmentBatches.root);
  this.water=new THREE.Mesh(new THREE.PlaneGeometry(1100,1100,16,30),new THREE.MeshStandardMaterial({color:'#4b9192',roughness:.26,metalness:.24,transparent:true,opacity:.87}));this.water.rotation.x=-Math.PI/2;this.water.position.y=-6;this.scene.add(this.water);
  this.controls=new OrbitControls(this.camera,this.renderer.domElement);this.controls.enableDamping=true;this.controls.dampingFactor=.08;this.controls.minDistance=10;this.controls.maxDistance=100;this.controls.maxPolarAngle=Math.PI/2-.02;this.controls.mouseButtons={LEFT:THREE.MOUSE.PAN,MIDDLE:THREE.MOUSE.DOLLY,RIGHT:THREE.MOUSE.ROTATE};this.resetCamera();
  new ResizeObserver(()=>this.resize()).observe(container);
  this.bindPointerEvents();
  this.resize();
  this.ready=this.initializeRenderer();
 }
 async initializeRenderer(){
  try {
   if(!(navigator as any).gpu) throw new Error('WebGPU unavailable');
   const mod=await import('three/webgpu'); const gpu=new mod.WebGPURenderer({antialias:true,powerPreference:'high-performance'});
   await gpu.init();const backend=((gpu.backend as any)?.isWebGPUBackend||(gpu.backend as any)?.constructor?.name?.includes('WebGPU'))?'webgpu':'webgl';if(backend!=='webgpu'){gpu.dispose();throw new Error('WebGPU adapter did not provide a WebGPU backend');}const oldRenderer=this.renderer,old=oldRenderer.domElement;this.renderer=gpu;this.renderer.setPixelRatio(Math.min(devicePixelRatio,2));this.renderer.shadowMap.enabled=true;this.renderer.shadowMap.type=THREE.PCFShadowMap;this.renderer.outputColorSpace=THREE.SRGBColorSpace;this.renderer.toneMapping=THREE.ACESFilmicToneMapping;this.renderer.toneMappingExposure=1.25;this.rendererBackend='webgpu';
   old.replaceWith(gpu.domElement);oldRenderer.dispose(); this.controls.dispose(); this.controls=new OrbitControls(this.camera,gpu.domElement);this.controls.enableDamping=true;this.controls.dampingFactor=.08;this.controls.minDistance=10;this.controls.maxDistance=100;this.controls.maxPolarAngle=Math.PI/2-.02;this.controls.mouseButtons={LEFT:THREE.MOUSE.PAN,MIDDLE:THREE.MOUSE.DOLLY,RIGHT:THREE.MOUSE.ROTATE};this.resize(); this.upgradeFocusMaterials();
  } catch(error) { console.warn('WebGPU renderer unavailable; using WebGL.',error);this.rendererBackend='webgl'; }
  this.normalizeNodeMaterials();
  this.effectsReady=true;
 }
 private async prepareImpactEffects(){
  // Keep these tiny exemplars alive so the renderer retains their compiled programs.
  // Use the real lighting/fog and screen output to match the later impact variants.
  this.warmingEffects=true;const reuse=!!this.effectWarmup,warm=this.effectWarmup??=new THREE.Group();
  // Node shader caches include light/fog identity, not just equivalent settings.
  // Compile in the actual scene with its actual lights and shadow passes.
  const hidden=this.scene.children.filter(o=>!(o instanceof THREE.Light)).map(o=>({o,visible:o.visible}));
  for(const {o} of hidden)o.visible=false;this.scene.add(warm);
  const camera=this.camera;warm.position.copy(this.controls.target);
  if(!reuse){
  for(const sourceKind of ['slab','facade'])for(const id of [-10001,-10002,-10003,-10004,-10005,-10006]){const g=this.fragment({sourceKind,size:[1,.3,1],id});warm.add(g);}
  warm.add(this.rock({kind:'projectile',radius:.7}));
  warm.add(this.meteor({radius:.7}));
  const leaves=new THREE.InstancedMesh(new THREE.PlaneGeometry(.24,.12),new THREE.MeshStandardMaterial({color:'#a5b86f',roughness:.9,side:THREE.DoubleSide,transparent:true,opacity:.82,depthWrite:false}),144);leaves.count=1;leaves.setMatrixAt(0,new THREE.Matrix4());leaves.frustumCulled=false;warm.add(leaves);
  warm.add(new THREE.Line(new THREE.BufferGeometry().setFromPoints([new THREE.Vector3(),new THREE.Vector3(1,1,1)]),new THREE.LineBasicMaterial({color:'#ffd34e',transparent:true,opacity:.95,depthWrite:false,depthTest:true,fog:false})));

  // WebGPU embeds instance buffer capacity in WGSL: match live 128-slot batches.
  // Warm both fracture vertex layouts (with and without UVs), plus rebar.
  for(const variant of ['rebar','jagged','rounded']){const flat=variant!=='rebar';const material=new THREE.MeshStandardMaterial({color:'#aaa999',flatShading:flat,side:flat?THREE.DoubleSide:THREE.FrontSide});const mesh=new THREE.InstancedMesh(flat?(variant==='rounded'?roundedRubbleGeometry([1,.3,1],1):jaggedBlockGeometry([1,.3,1],1)):new THREE.CylinderGeometry(.035,.035,1,7),material,128);mesh.count=1;mesh.setMatrixAt(0,new THREE.Matrix4());mesh.castShadow=true;mesh.receiveShadow=flat;mesh.frustumCulled=false;warm.add(mesh);}
  warm.traverse(o=>{o.frustumCulled=false;if(this.rendererBackend==='webgl'&&o instanceof THREE.Mesh&&o.castShadow)o.customDepthMaterial=new THREE.MeshDepthMaterial({depthPacking:THREE.RGBADepthPacking});});
  }
  try{
   await this.renderer.compileAsync(this.scene,camera);

   this.renderer.render(this.scene,camera); // also initialize shadow passes and GPU buffers
  }catch(error){console.warn('Impact shader preparation unavailable',error);}
  finally{warm.removeFromParent();for(const {o,visible} of hidden)o.visible=visible;this.renderer.render(this.scene,this.camera);this.warmingEffects=false;this.effectsReady=true;}
 }
 private nodeFocusMaterial(old:THREE.MeshStandardMaterial){
  if((old as any).isMeshStandardNodeMaterial&&old.userData.nodeFocus)return old;
  const node=(old as any).isMeshStandardNodeMaterial?(old as unknown as MeshStandardNodeMaterial):new MeshStandardNodeMaterial({
   color:old.color,roughness:old.roughness,metalness:old.metalness,emissive:old.emissive,emissiveIntensity:old.emissiveIntensity,
   transparent:old.transparent,opacity:old.opacity,depthWrite:old.depthWrite,depthTest:old.depthTest,side:old.side,
   flatShading:old.flatShading,vertexColors:old.vertexColors,alphaTest:old.alphaTest,map:old.map,normalMap:old.normalMap,
   roughnessMap:old.roughnessMap,metalnessMap:old.metalnessMap,emissiveMap:old.emissiveMap
  });node.userData={...old.userData,nodeFocus:true,buildFocus:true};
  const below=oneMinus(smoothstep(this.focusHeight.sub(.25),this.focusHeight.sub(.05),positionWorld.y));
  const rgb=(materialColor as any).rgb,lum=dot(rgb,vec3(.2126,.7152,.0722)),subdued=mix(vec3(lum),vec3(.62,.74,.70),.72);
  node.colorNode=vec4(mix(rgb,subdued,below.mul(this.focusAmount).mul(.35)),(materialColor as any).a);return node;
 }
 private upgradeFocusMaterials(){this.scene.traverse(o=>{if(!(o instanceof THREE.Mesh))return;const materials=Array.isArray(o.material)?o.material:[o.material];const next=materials.map(m=>(m as any).isMeshStandardMaterial||m instanceof MeshStandardNodeMaterial?this.nodeFocusMaterial(m as THREE.MeshStandardMaterial):m);o.material=Array.isArray(o.material)?next:next[0];});}
 private normalizeNodeMaterials(){this.scene.traverse((o:any)=>{for(const m of (Array.isArray(o.material)?o.material:[o.material]))if(m?.isNodeMaterial&&m.fragmentNode===undefined){console.warn('Normalized invalid node material',m.type);m.fragmentNode=null;}});}
 private bindPointerEvents(){
  this.container.oncontextmenu=e=>e.preventDefault();
  this.container.onpointerdown=e=>{this.lastDown=[e.clientX,e.clientY]};
  this.container.onpointermove=e=>{if(e.pointerType!=='touch'&&this.controls.enabled)this.pick(e,false);};
  this.container.onpointerup=e=>{if(!document.body.classList.contains('mobile-ui')&&e.pointerType!=='touch'&&e.button===0&&Math.hypot(e.clientX-this.lastDown[0],e.clientY-this.lastDown[1])<5)this.pick(e,true)};
 }
 followVehicle(item:any,dt:number,yaw=0,pitch=0,worldAim=false){const body=this.meshes.get(item.id);if(!body)return;const locked=worldAim||document.pointerLockElement===this.container,q=body.quaternion,heading=Math.atan2(2*(q.x*q.z+q.w*q.y),1-2*(q.x*q.x+q.y*q.y));const look=locked?new THREE.Quaternion().setFromEuler(new THREE.Euler(pitch,heading+yaw,0,'YXZ')):body.quaternion.clone().multiply(new THREE.Quaternion().setFromEuler(new THREE.Euler(pitch,yaw,0,'YXZ')));const target=body.position.clone().add(new THREE.Vector3(0,1.5,0)).add(new THREE.Vector3(0,0,-5).applyQuaternion(look)),behind=new THREE.Vector3(0,5.5,12).applyQuaternion(look),desired=body.position.clone().add(behind);desired.y=Math.max(desired.y,2);this.camera.position.lerp(desired,1-Math.exp(-dt*6));if(locked)target.copy(this.camera.position).add(new THREE.Vector3(0,-4,-17).applyQuaternion(look));this.controls.target.copy(target);this.camera.lookAt(target);this.fadeVehicleOccluders(body.position.clone().add(new THREE.Vector3(0,1,0)));}
 fadeVehicleOccluders(target?:THREE.Vector3){const line=target?new THREE.Line3(this.camera.position,target):undefined;for(const tree of this.windTrees){const center=tree.root.position.clone().add(new THREE.Vector3(0,tree.height*.65,0)),point=new THREE.Vector3(),faded=!!line&&line.closestPointToPoint(center,true,point).distanceTo(center)<tree.height*.48;for(const mesh of tree.canopy){const material=mesh.material as THREE.MeshStandardMaterial;if(material.userData.cameraFaded===faded)continue;material.userData.cameraFaded=faded;material.transparent=faded;material.opacity=faded?.15:1;material.depthWrite=!faded;material.needsUpdate=true;}}}
 aimAutonomousVehicle(id:number,yaw:number,pitch:number){const chassis=this.meshes.get(id);if(chassis)for(const child of chassis.children)if(child.userData.vehicleKind==='cannon')child.rotation.set(pitch,yaw,0,'YXZ');}
 hideCannonTrajectory(){this.cannonArcs.visible=false;}
 aimVehicle(yaw:number,pitch:number,item:any){
  const chassis=this.meshes.get(item.id);this.cannonArcs.visible=!!chassis;if(!chassis)return;
  const v=item.body.GetLinearVelocity(),rotation=[chassis.quaternion.x,chassis.quaternion.y,chassis.quaternion.z,chassis.quaternion.w];let index=0;
  for(const child of chassis.children)if(child.userData.vehicleKind==='cannon'){
   child.rotation.set(pitch,yaw,0,'YXZ');let arc=this.cannonArcs.children[index++] as THREE.Line;
   if(!arc){const geometry=new THREE.BufferGeometry();geometry.setAttribute('position',new THREE.BufferAttribute(new Float32Array(241*3),3).setUsage(THREE.DynamicDrawUsage));arc=new THREE.Line(geometry,new THREE.LineBasicMaterial({color:'#ffd34e',transparent:true,opacity:.95,depthWrite:false,depthTest:true,fog:false}));arc.frustumCulled=false;arc.renderOrder=30;this.cannonArcs.add(arc);}
   const launch=cannonLaunch(child.position.toArray() as V3,chassis.position.toArray() as V3,rotation,[v.GetX(),v.GetY(),v.GetZ()],yaw,pitch),attribute=arc.geometry.getAttribute('position') as THREE.BufferAttribute;
   const count=cannonTrajectory(launch.muzzle,launch.velocity,attribute.array as Float32Array);arc.geometry.setDrawRange(0,count);attribute.needsUpdate=true;arc.visible=true;
  }
  for(let i=index;i<this.cannonArcs.children.length;i++)this.cannonArcs.children[i].visible=false;
 }

 resize(){const w=this.container.clientWidth,h=this.container.clientHeight;this.renderer.setSize(w,h);this.camera.aspect=w/h;this.camera.updateProjectionMatrix();}
 clear(group:THREE.Group){if(group===this.extras)this.rebarBatches=this.rebarBatches.filter(mesh=>mesh.parent!==group);group.traverse(o=>{if(o instanceof THREE.Mesh||o instanceof THREE.LineSegments){o.geometry.dispose();if(Array.isArray(o.material))o.material.forEach(m=>m.dispose());else o.material.dispose()}});group.clear();}
 resetWindEffects(clearTrees=false,resetRoots=true){
  this.windTrees.forEach(({root,canopy})=>{if(resetRoots){root.userData.physical=false;root.rotation.set(0,0,0);root.position.x=root.userData.baseX??root.position.x;root.position.y=root.userData.baseY??root.position.y;root.position.z=root.userData.baseZ??root.position.z;}canopy.forEach(cone=>cone.rotation.set(0,0,0));});
  if(clearTrees)this.windTrees=[];this.windLeafBases=[];this.windLeafPhases=[];
  if(this.windLeaves){this.windLeaves.dispose();this.windLeaves.geometry.dispose();(this.windLeaves.material as THREE.Material).dispose();this.windLeaves=undefined;}
  this.windGroup.clear();
 }
 resetCamera(view='perspective') { const center=this.scenario==='bridge'?new THREE.Vector3(0,0,0):new THREE.Vector3(0,4,-2); this.controls?.target.copy(center);const p=view==='top'?[0,62,.1]:view==='front'?[0,10,52]:view==='side'?[52,10,0]:this.scenario==='bridge'?[36,30,43]:[32,28,39];this.camera.position.set(...p as V3);this.camera.lookAt(center);this.controls?.update(); }
 fitStructure(){const bounds=new THREE.Box3().setFromObject(this.structure);if(bounds.isEmpty())return;const center=bounds.getCenter(new THREE.Vector3()),size=bounds.getSize(new THREE.Vector3());const span=Math.max(size.x,size.y,size.z,12);const distance=Math.min(95,Math.max(35,span*1.9));this.controls.target.copy(center);this.camera.position.copy(center).add(new THREE.Vector3(.72,.5,.85).normalize().multiplyScalar(distance));this.camera.lookAt(center);this.controls.update();}
 setLevel(n:number){this.level=n;this.grid.position.y=n+.18;this.buildHeight.value=n;this.focusHeight.value=n;}
 applyBuildFocus(root:THREE.Object3D){
  if(this.rendererBackend==='webgpu'){root.traverse(object=>{if(!(object instanceof THREE.Mesh))return;const materials=Array.isArray(object.material)?object.material:[object.material];const next=materials.map(m=>(m as any).isMeshStandardMaterial||m instanceof MeshStandardNodeMaterial?this.nodeFocusMaterial(m as THREE.MeshStandardMaterial):m);object.material=Array.isArray(object.material)?next:next[0];});return;}
  root.traverse(object=>{if(!(object instanceof THREE.Mesh))return;for(const material of Array.isArray(object.material)?object.material:[object.material]){if(!(material instanceof THREE.MeshStandardMaterial)||material.userData.buildFocus)continue;material.userData.buildFocus=true;material.onBeforeCompile=shader=>{shader.uniforms.uBuildHeight=this.buildHeight;shader.uniforms.uBuildFocus=this.buildFocus;shader.vertexShader='varying float vBuildHeight;\n'+shader.vertexShader;shader.vertexShader=shader.vertexShader.replace('#include <begin_vertex>','#include <begin_vertex>\nvBuildHeight = (modelMatrix * vec4(transformed, 1.0)).y;');shader.fragmentShader='uniform float uBuildHeight;\nuniform float uBuildFocus;\nvarying float vBuildHeight;\n'+shader.fragmentShader;shader.fragmentShader=shader.fragmentShader.replace('#include <opaque_fragment>',`float belowBuildPlane=1.0-smoothstep(uBuildHeight-.25,uBuildHeight-.05,vBuildHeight);float luminance=dot(outgoingLight,vec3(.2126,.7152,.0722));vec3 subdued=mix(vec3(luminance),vec3(.62,.74,.70),.72);outgoingLight=mix(outgoingLight,subdued,belowBuildPlane*uBuildFocus*.35);\n#include <opaque_fragment>`);};material.customProgramCacheKey=()=> 'build-level-focus-v1';material.needsUpdate=true;}});
 } buildEnvironment(scenario:Scenario) {
  this.fragmentBatches.reset();
  this.scenario=scenario;this.resetWindEffects(true);this.clear(this.terrain);this.clear(this.extras);this.rebarBatches=[];this.clear(this.grid);this.clear(this.sockets);this.setGhost(null);this.meshes.clear();this.fracturedSeen.clear();
  const grass=mat('#88997a'),earth=mat('#697264'),stone=mat('#8b9585'),asphalt=mat('#515f5c');
  if(scenario==='bridge') {
   for(const side of [-1,1]) {box([31,7.8,42],[side*27.5,-4,0],earth,this.terrain);box([31,.25,42],[side*27.5,-.06,0],grass,this.terrain);box([26,.08,4.4],[side*25,.08,0],asphalt,this.terrain);
    for(let x=14;x<43;x+=3)box([1.3,.025,.08],[side*x,.13,0],mat('#bec5ac'),this.terrain);
    for(const y of [-1.7,-3.4,-5.1])box([.016,.035,42],[side*12,y,0],mat('#859079'),this.terrain);
    box([1,3,5],[side*12.4,-1.4,0],stone,this.terrain);
    for(const z of [-2.4,2.4]){box([.32,.3,.32],[side*12,.15,z],mat('#d4b360'),this.terrain);}
   }
   for(let i=0;i<40;i++){const side=i%2?1:-1;const x=side*(15+(Math.sin(i*13.34)+1)*11),z=Math.cos(i*7.23)*18;if(Math.abs(z)>4)this.tree(x,0,z,2+(i%4)*.5);}
   for(let i=0;i<18;i++){const rock=new THREE.Mesh(new THREE.DodecahedronGeometry(1+(i%3)*.5,0),stone.clone());rock.position.set(Math.sin(i*2.4)*11,-7,Math.cos(i*2.14)*24);rock.scale.set(1,.5,1.3);rock.rotation.set(i,i*.7,0);this.terrain.add(rock)}
   this.water.position.y=-6;
  } else {
   box([1000,2,1000],[0,-1.05,0],earth,this.terrain);box([1000,.1,1000],[0,-.04,0],grass,this.terrain);
   for(const side of [-1,1]){box([1000,4,3],[0,1,side*498],earth,this.terrain);box([3,4,1000],[side*498,1,0],earth,this.terrain);}
   box([24,.07,20],[0,.015,0],mat('#8b9685'),this.terrain);
   for(let i=0;i<35;i++){const x=Math.sin(i*6.83)*34,z=Math.cos(i*4.33)*34;const height=2+i%3;const clearSpawn=scenario!=='sandbox'||Math.hypot(x-VEHICLE_SPAWN[0],z-VEHICLE_SPAWN[2])>VEHICLE_SPAWN_CLEARANCE+height*.31;if(clearSpawn&&(Math.abs(x)>14||z>16))this.tree(x,0,z,height);}
   if(scenario==='landslide') {const slope=box([30,.8,24],[0,5,-19],stone,this.terrain);slope.rotation.x=.51;for(let i=0;i<15;i++){const r=new THREE.Mesh(new THREE.DodecahedronGeometry(.7+i%3*.3),stone.clone());r.position.set(Math.sin(i*7)*13,7+Math.cos(i)*2,-21-Math.cos(i)*4);r.castShadow=true;this.terrain.add(r)}this.addHouse();}
   this.water.position.y=-2;
  }
  const minorGrid=new THREE.GridHelper(48,24,'#34594b','#456b5c');minorGrid.material.transparent=true;minorGrid.material.opacity=.65;minorGrid.material.depthWrite=false;
  const majorGrid=new THREE.GridHelper(48,12,'#163e30','#254d3d');majorGrid.material.transparent=true;majorGrid.material.opacity=.95;majorGrid.material.depthWrite=false;majorGrid.renderOrder=1;
  this.grid.add(minorGrid,majorGrid);this.applyBuildFocus(this.terrain);this.applyBuildFocus(this.extras);this.applyBuildFocus(this.water);this.setLevel(0);this.resetCamera();
 }
 tree(x:number,y:number,z:number,h:number){const group=new THREE.Group(),trunk=box([.22,h*.4,.22],[0,h*.2,0],mat('#716449'),group),canopy:THREE.Mesh[]=[];for(let i=0;i<3;i++){const cone=new THREE.Mesh(new THREE.ConeGeometry(h*(.31-i*.055),h*.62,5),mat(i===2?'#526f5c':'#4d6755'));cone.position.y=h*(.45+i*.19);cone.castShadow=true;group.add(cone);canopy.push(cone)}group.position.set(x,y,z);group.userData.baseX=x;group.userData.baseY=y;group.userData.baseZ=z;this.terrain.add(group);this.windTrees.push({root:group,trunk,canopy,height:h});}
 piece(p:Piece,ghost=false) {
  const def=PARTS[p.kind],g=new THREE.Group(),baseColor=p.finish?FINISHES[p.finish]:p.kind==='facade'?'#d6dedb':def.color;
  const material=new THREE.MeshStandardMaterial({color:ghost?'#a7f5c5':baseColor,roughness:.68,metalness:['girder','truss','brace'].includes(p.kind)?.42:.07,transparent:ghost,opacity:ghost?.45:1,depthWrite:!ghost});
  if(p.kind==='facade'){
   const pane=def.segments[0],glass=ghost?material.clone():new THREE.MeshStandardMaterial({color:p.finish==='teal'?'#649fa8':'#92c8d9',roughness:.16,metalness:.28,transparent:true,opacity:.46,depthWrite:false});
   const glazing=box(pane.size,pane.center,glass,g);glazing.castShadow=false;glazing.userData.partId=p.id;
   const geometry=def.segments.slice(1).map(s=>new THREE.BoxGeometry(...s.size).translate(...s.center));const merged=mergeGeometries(geometry)!;geometry.forEach(g=>g.dispose());const frame=new THREE.Mesh(merged,material);frame.castShadow=true;frame.receiveShadow=true;frame.userData.partId=p.id;g.add(frame);
  }else for(const s of def.segments){
   // Keep adjacent concrete/plate render faces from landing on the exact same
   // depth sample. This is visual-only; the catalog size still drives physics.
   const renderSize=isConcrete(p.kind)?s.size.map(n=>Math.max(.001,n-concreteRenderInset(p.kind))) as V3:s.size;
   const m=box(renderSize,s.center,material.clone(),g);m.rotation.z=s.tilt??0;m.userData.partId=p.id;
  }
  if(!ghost) {
   if(p.kind==='deck'){for(const z of [-1.8,1.8])box([3.85,.012,.045],[2,.008,z],mat('#c2c5af'),g);box([1.6,.012,.08],[2,.012,0],mat('#dedbc4'),g);for(const z of [-1.94,1.94])box([4,.13,.13],[2,.04,z],mat('#b8aa77'),g);}
   if(p.kind==='girder'){for(const y of [-.2,.2])box([4,.08,.52],[2,y,0],material.clone(),g);}
   if(p.kind==='wall'){for(const y of [1,2,3]){const seam=material.clone();seam.color.multiplyScalar(.82);box([3.98,.015,.558],[2,y,0],seam,g);}}
   if(p.kind==='truss'){for(const x of [0,4])for(const y of [0,4]) {const plate=box([.42,.42,.3],[x,y,0],mat('#cea052'),g);plate.userData.partId=p.id; for(const dx of [-.12,.12]){const rivet=new THREE.Mesh(new THREE.SphereGeometry(.038,6,4),mat('#5b665c'));rivet.position.set(x+dx,y,.165);g.add(rivet)}}}
  }
  g.traverse(o=>{if(o instanceof THREE.Mesh)o.userData.originalColor=(o.material as THREE.MeshStandardMaterial).color.getHex();});
  // Compact same-material segments per piece while retaining one selectable parent.
  if(!ghost){const groups=new Map<string,THREE.Mesh[]>();g.children.filter(o=>o instanceof THREE.Mesh).forEach(o=>{const m=o as THREE.Mesh,material=(Array.isArray(m.material)?m.material[0]:m.material) as THREE.MeshStandardMaterial;const key=[material.type,material.color?.getHexString(),material.roughness,material.metalness,material.transparent,material.opacity,material.depthWrite,material.side].join(':');(groups.get(key)??groups.set(key,[]).get(key)!).push(m);});for(const list of groups.values())if(list.length>1){const material=list[0].material;const geoms=list.map(m=>{m.updateMatrix();return m.geometry.clone().applyMatrix4(m.matrix)});const merged=mergeGeometries(geoms);geoms.forEach(x=>x.dispose());if(merged){const mesh=new THREE.Mesh(merged,material);mesh.castShadow=true;mesh.receiveShadow=true;mesh.userData.partId=p.id;mesh.userData.originalColor=(material as THREE.MeshStandardMaterial).color.getHex();list.forEach((x,index)=>{x.parent?.remove(x);x.geometry.dispose();if(index>0)(x.material as THREE.Material).dispose();});g.add(mesh);}}
  }
  if(!ghost&&isConcrete(p.kind)){
   g.traverse(o=>{if(o instanceof THREE.Mesh){const m=o.material as THREE.MeshStandardMaterial;o.userData.baseMaterialColor=m.color.getHex();m.color.setHex(concreteRenderColor(m.color.getHex(),p.concreteStrength));o.userData.originalColor=m.color.getHex();}});
   const geometry=createRebarMarkings(p);
   if(geometry){const marks=new THREE.Mesh(geometry,new THREE.MeshStandardMaterial({color:'#414b4d',roughness:.85,side:THREE.DoubleSide}));marks.userData.partId=p.id;marks.userData.rebarMarking=true;marks.userData.ignoreStress=true;marks.userData.originalColor=0x414b4d;marks.userData.baseMaterialColor=0xffffff;g.add(marks);}
  }
  // The decorative yard reaches y=.05. Keep the visible footing (including
  // its steel marks) above that layer; the anchored physics body stays at y=0.
  if(p.kind==='foundation')for(const child of g.children)child.position.y+=.10;
  g.position.set(...p.p);g.rotation.y=p.rotation*Math.PI/2;g.userData.partId=p.id;if(!ghost){this.buildFocus.value=1;this.focusAmount.value=1;this.applyBuildFocus(g);}return g;
 }
 setPieces(pieces:Piece[]){
  this.audio.reset();
  this.hideCannonTrajectory();  this.resetWindEffects();this.clear(this.structure);this.clear(this.sockets);this.meshes.clear();this.instanceRefs.clear();this.remnantRefs.clear();this.remnantBatches.clear();const seen=new Set<string>(),positions:V3[]=[];
  for(const p of pieces){const g=this.piece(p);this.structure.add(g);this.meshes.set(p.id,g);for(const v of ports(p)){const key=v.map(n=>Math.round(n*100)).join(',');if(!seen.has(key)){seen.add(key);positions.push(v)}}}
  this.buildPieceInstances(pieces);
  if(positions.length){const dots=new THREE.InstancedMesh(new THREE.SphereGeometry(.11,8,6),new THREE.MeshBasicMaterial({color:'#d6f4c1',depthTest:false,transparent:true,opacity:.7}),positions.length);const matrix=new THREE.Matrix4();positions.forEach((p,i)=>{matrix.makeTranslation(...p);dots.setMatrixAt(i,matrix)});dots.renderOrder=10;this.sockets.add(dots)}this.sockets.visible=!!this.ghost;this.select(null);
 }
 async prepareDestruction(pieces:Piece[]){
  await this.ready;
  await this.prepareImpactEffects();
  if(!this.fragmentsPrepared){this.warmingEffects=true;try{await this.fragmentBatches.prepare(this.renderer,this.scene,this.camera);this.fragmentsPrepared=true;}finally{this.warmingEffects=false;}}
  if(this.rendererBackend!=='webgpu'||(this.remnantBatches.size&&this.rebarBatches.length))return;
  // Three keys instanced node builders by object UUID. Prepare the actual batches,
  // not lookalike meshes whose compiled node graphs cannot be reused.
  this.warmingEffects=true;
  const parent=new THREE.Group(),seen=new Set<string>();
  for(const piece of pieces){const key=piece.kind+':'+(piece.finish??'');if(seen.has(key))continue;seen.add(key);
   parent.userData.remnantCount=0;
   this.syncBreakRemnants(parent,{id:-999999,remnants:Array.from({length:4},(_,seed)=>({seed,sourceKind:piece.kind,sourceFinish:piece.finish,point:[0,0,0]}))});
  }
  const batches=[...this.remnantBatches.values()].flat();
  if(!this.rebarBatches.length){const mesh=new THREE.InstancedMesh(new THREE.CylinderGeometry(.035,.035,1,7),new THREE.MeshStandardMaterial({color:'#765b42',roughness:.62,metalness:.72}),128);mesh.castShadow=true;mesh.frustumCulled=false;mesh.userData.rebar=true;this.extras.add(mesh);this.rebarBatches.push(mesh);}
  const objects=[...batches,...this.rebarBatches];
  for(const mesh of objects){mesh.count=1;mesh.setMatrixAt(0,new THREE.Matrix4());mesh.instanceMatrix.needsUpdate=true;}
  try{await this.renderer.compileAsync(this.scene,this.camera);this.renderer.render(this.scene,this.camera);}
  finally{for(const mesh of objects)mesh.count=0;this.resetBreakRemnants();this.warmingEffects=false;this.renderer.render(this.scene,this.camera);}
 }
 private buildPieceInstances(pieces:Piece[]){
  const buckets=new Map<string,{id:number;group:THREE.Group;source:THREE.Mesh;local:THREE.Matrix4;baseColor:number}[]>();
  for(const piece of pieces){const group=this.meshes.get(piece.id);if(!group)continue;const meshes=group.children.filter(child=>child instanceof THREE.Mesh) as THREE.Mesh[];meshes.forEach((source,slot)=>{source.updateMatrix();const material=(Array.isArray(source.material)?source.material[0]:source.material) as THREE.MeshStandardMaterial,key=source.userData.rebarMarking?`rebar:${piece.kind}:${reinforcementMarkLevel(piece.reinforcement)}`:`${piece.kind}:${piece.finish??'default'}:${slot}`,rows=buckets.get(key)??[];rows.push({id:piece.id,group,source,local:source.matrix.clone(),baseColor:this.instanceColor.setHex(source.userData.originalColor??material.color.getHex()).multiplyScalar(1+(fragmentRandom(piece.id,slot)()-.5)*(piece.kind==='facade'?.025:.09)).getHex()});buckets.set(key,rows);source.visible=false;});}
  for(const rows of buckets.values()){const source=rows[0].source,material=(Array.isArray(source.material)?source.material[0]:source.material).clone(),mesh=new THREE.InstancedMesh(source.geometry.clone(),material,rows.length);if(source.userData.baseMaterialColor!==undefined)(material as THREE.MeshStandardMaterial).color.setHex(source.userData.baseMaterialColor);mesh.userData.rebarMarking=source.userData.rebarMarking;mesh.castShadow=source.castShadow;mesh.receiveShadow=source.receiveShadow;mesh.frustumCulled=false;mesh.userData.instancePartIds=rows.map(row=>row.id);rows.forEach((row,index)=>{row.group.updateMatrix();this.instanceMatrix.multiplyMatrices(row.group.matrix,row.local);mesh.setMatrixAt(index,this.instanceMatrix);mesh.setColorAt(index,this.instanceColor.setHex(row.baseColor));const refs=this.instanceRefs.get(row.id)??[];refs.push({mesh,index,local:row.local,baseColor:row.baseColor});this.instanceRefs.set(row.id,refs);});mesh.instanceMatrix.needsUpdate=true;if(mesh.instanceColor)mesh.instanceColor.needsUpdate=true;this.structure.add(mesh);}
 }
 private syncPieceInstances(id:number,group:THREE.Group,visible=true){const refs=this.instanceRefs.get(id);if(!refs)return;group.updateMatrix();for(const ref of refs){this.instanceMatrix.multiplyMatrices(group.matrix,ref.local);if(!visible)this.instanceMatrix.scale(new THREE.Vector3(0,0,0));ref.mesh.setMatrixAt(ref.index,this.instanceMatrix);ref.mesh.instanceMatrix.needsUpdate=true;}}
 private colorPieceInstances(id:number,stress:number){const refs=this.instanceRefs.get(id),group=this.meshes.get(id);if(!refs||!group)return false;const previous=group.userData.instanceStress as number|undefined,mode=group.userData.instanceStressMode as boolean|undefined;if(mode===this.stress&&previous!==undefined&&Math.abs(previous-stress)<.004)return true;for(const ref of refs){if(ref.mesh.userData.rebarMarking)continue;if(this.stress)this.instanceColor.setHSL(Math.max(0,.34-Math.min(1,stress)*.34),.64,.51);else this.instanceColor.setHex(ref.baseColor);ref.mesh.setColorAt(ref.index,this.instanceColor);if(ref.mesh.instanceColor)ref.mesh.instanceColor.needsUpdate=true;}group.userData.instanceStress=stress;group.userData.instanceStressMode=this.stress;return true;}
 restorePieces(pieces:Piece[]){
  this.audio.reset();
  this.hideCannonTrajectory();this.fragmentBatches.reset();
  this.resetWindEffects();this.fracturedSeen.clear();this.resetBreakRemnants();this.resetRebars();
  for(const id of this.meshes.keys())if(id<0)this.meshes.delete(id);
  for(const piece of pieces){const group=this.meshes.get(piece.id);if(!group)continue;group.userData.remnantCount=0;group.userData.instanceStress=undefined;group.userData.instanceStressMode=undefined;group.userData.instanceHidden=false;group.userData.poseSynced=true;group.visible=true;group.position.set(...piece.p);group.rotation.set(0,piece.rotation*Math.PI/2,0);this.syncPieceInstances(piece.id,group,true);this.colorPieceInstances(piece.id,0);}
  this.select(null);
 }
 addWorldPieces(pieces:Piece[]){for(const p of pieces){const group=this.piece(p);this.structure.add(group);this.meshes.set(p.id,group);}this.buildPieceInstances(pieces);}
 removeWorldPieces(ids:number[]){for(const id of ids){const group=this.meshes.get(id);if(group){this.syncPieceInstances(id,group,false);this.syncRemnantInstances(id,group,false);group.removeFromParent();this.clear(group);this.meshes.delete(id);}this.instanceRefs.delete(id);this.remnantRefs.delete(id);}this.select(null);}
 setVehicleGhost(parts:import('./vehicle-blueprint').VehiclePart[],position:V3,rotation:number){this.setGhost(null);const group=vehicleAssembly(parts);group.position.set(...position);group.rotation.y=rotation;group.traverse(object=>{if(object instanceof THREE.Mesh){const material=(object.material as THREE.MeshStandardMaterial).clone();material.transparent=true;material.opacity=.45;material.depthWrite=false;object.material=material;}});this.ghost=group;this.scene.add(group);}
 setGhost(p:Piece|null){if(this.ghost){this.scene.remove(this.ghost);this.clear(this.ghost)}this.ghost=p?this.piece(p,true):undefined;if(this.ghost)this.scene.add(this.ghost);this.sockets.visible=!!p;}
 setGhostAssembly(pieces:Piece[],position:V3){this.setGhost(null);this.ghost=new THREE.Group();for(const p of pieces)this.ghost.add(this.piece(p,true));this.ghost.position.set(...position);this.scene.add(this.ghost);this.sockets.visible=true;}
 select(id:number|null){if(this.selection){this.scene.remove(this.selection);this.selection.geometry.dispose();(this.selection.material as THREE.Material).dispose();this.selection=undefined;}const m=id!==null?this.meshes.get(id):null;if(m){this.selection=new THREE.BoxHelper(m,'#b1f6c4');this.scene.add(this.selection)}}
 pick(e:PointerEvent,click:boolean){const rect=this.container.getBoundingClientRect();this.pointer.set((e.clientX-rect.left)/rect.width*2-1,-(e.clientY-rect.top)/rect.height*2+1);this.ray.setFromCamera(this.pointer,this.camera);const hits=this.ray.intersectObjects([...this.structure.children.filter(m=>m.visible&&!m.userData.instanceHidden),...[...this.meshes.values()].filter(m=>m.visible&&m.userData.vehicleId!==undefined)],true);this.hoverVehicleId=null;this.hoverPoint=hits[0]?.point.toArray() as V3??null;let id:number|null=null;if(hits.length){const first=hits[0],ids=first.object.userData.instancePartIds as number[]|undefined;if(ids&&first.instanceId!==undefined)id=ids[first.instanceId]??null;else{let m:THREE.Object3D|null=first.object;while(m&&m.userData.partId===undefined&&m.userData.vehicleId===undefined)m=m.parent;id=m?.userData.partId??null;this.hoverVehicleId=m?.userData.vehicleId??null}}const target=new THREE.Vector3();const hit=this.ray.ray.intersectPlane(new THREE.Plane(new THREE.Vector3(0,1,0),-this.level),target);if(hit){const p:V3=[Math.round(target.x/2)*2,this.level,Math.round(target.z/2)*2];this.hoverId=id;this.container.dispatchEvent(new CustomEvent('aim',{detail:{p,id}}));if(click)this.onPick?.(p,id)}else if(click&&(this.hoverVehicleId!==null||this.container.classList.contains('aiming')))this.onPick?.([0,this.level,0],id)}
 addTruck(){const g=new THREE.Group();box([3.6,.65,2.05],[0,.15,0],mat('#d7d9c1'),g);box([1.1,1.1,2],[1.1,.85,0],mat('#e8b65d'),g);box([1.15,.52,1.83],[1.13,1.12,0],mat('#375557'),g);box([2.1,.85,1.9],[-.7,.8,0],mat('#baaa85'),g);for(const x of [-1.15,1.1])for(const z of [-1.1,1.1]) {const wheel=new THREE.Mesh(new THREE.CylinderGeometry(.44,.44,.23,14),mat('#2f3a38'));wheel.rotation.x=Math.PI/2;wheel.position.set(x,-.35,z);g.add(wheel);const hub=new THREE.Mesh(new THREE.CylinderGeometry(.19,.19,.245,12),mat('#a5aea3'));hub.rotation.x=Math.PI/2;hub.position.copy(wheel.position);g.add(hub)}this.extras.add(g);this.meshes.set(-800,g);return g;}
 addHouse(){const g=new THREE.Group();box([3.2,3.2,3.2],[0,0,0],mat('#ded3b5'),g);const roof=new THREE.Mesh(new THREE.CylinderGeometry(0,2.85,1.5,4),mat('#526b66'));roof.rotation.y=Math.PI/4;roof.position.y=2.15;roof.castShadow=true;g.add(roof);for(const x of [-.9,.9])box([.65,.8,.05],[x,.2,1.63],mat('#51777b'),g);box([.65,1.3,.05],[0,-.93,1.63],mat('#876d50'),g);g.position.set(0,1.6,5);this.extras.add(g);this.meshes.set(-900,g);this.applyBuildFocus(g);}
 beginSimulation(){this.audio.reset();this.hideCannonTrajectory();this.fragmentBatches.reset();this.buildFocus.value=0;this.focusAmount.value=0;this.setGhost(null);this.select(null);for(const mesh of this.rebarBatches)mesh.removeFromParent();this.clear(this.extras);for(const mesh of this.rebarBatches){mesh.count=0;this.extras.add(mesh);}this.fracturedSeen.clear();for(const id of this.meshes.keys())if(id<0)this.meshes.delete(id);if(this.scenario==='bridge')this.addTruck();if(this.scenario==='landslide')this.addHouse();this.grid.visible=false;this.resetWindEffects();if(this.scenario==='wind')this.createWindLeaves();this.windTrees.slice(0,40).forEach((tree,i)=>{tree.root.userData.physical=true;this.meshes.set(-20000-i,tree.root);});}
 createWindLeaves(){const count=144,geometry=new THREE.PlaneGeometry(.24,.12),material=new THREE.MeshStandardMaterial({color:'#a5b86f',roughness:.9,side:THREE.DoubleSide,transparent:true,opacity:.82,depthWrite:false});this.windLeaves=new THREE.InstancedMesh(geometry,material,count);this.windLeaves.frustumCulled=false;this.windLeaves.renderOrder=3;const matrix=new THREE.Matrix4(),position=new THREE.Vector3();for(let i=0;i<count;i++){const angle=i*2.39996,radius=8+(i%12)*1.55;position.set(Math.cos(angle)*radius-5+(i%5)*2,1.5+(i%9)*1.25,Math.sin(angle)*radius+(i%7)*1.8);this.windLeafBases.push(position.clone());this.windLeafPhases.push((i*1.731)%Math.PI*2);matrix.makeTranslation(position.x,position.y,position.z);this.windLeaves.setMatrixAt(i,matrix);}this.windLeaves.instanceMatrix.needsUpdate=true;this.windGroup.add(this.windLeaves);}
 updateWind(sim:Simulation){if(!sim.hazardActive('wind')){if(this.windLeaves)this.resetWindEffects(false,false);return;}if(!this.windLeaves)this.createWindLeaves();const t=sim.hazardAge('wind'),ramp=Math.min(1,Math.max(0,(t-1)/3)),gust=1+.3*Math.sin(t*3)+.2*Math.sin(t*7),strength=Math.max(0,ramp*sim.intensity*gust);for(const tree of this.windTrees){const sway=.014*strength*(.65+tree.height/8),lean=-.035*strength*(.65+tree.height/8);if(!tree.root.userData.physical){tree.root.rotation.z=lean+Math.sin(t*1.7+tree.root.userData.baseX*.06)*sway;tree.root.rotation.x=Math.sin(t*1.25+tree.root.userData.baseZ*.05)*sway*.55;}tree.canopy.forEach((cone,i)=>{const canopyStrength=(i+1)/3;cone.rotation.z=lean*canopyStrength+Math.sin(t*2.1+i+tree.root.userData.baseX*.04)*sway*canopyStrength;cone.rotation.x=Math.cos(t*1.8+i+tree.root.userData.baseZ*.04)*sway*.45*canopyStrength;});}if(!this.windLeaves)return;this.windLeaves.visible=ramp>0;if(!this.windLeaves.visible)return;const matrix=new THREE.Matrix4(),position=new THREE.Vector3(),wind=new THREE.Vector3(1,0,.28).normalize();for(let i=0;i<this.windLeafBases.length;i++){const base=this.windLeafBases[i],phase=this.windLeafPhases[i],distance=Math.max(0,(t-1)+.1*(Math.cos(3)-Math.cos(t*3))+(0.2/7)*(Math.cos(7)-Math.cos(t*7)))*(1.5+.35*Math.sin(phase))*Math.max(.2,sim.intensity);position.copy(base).addScaledVector(wind,distance);position.x=((position.x+28)%56+56)%56-28;position.z=((position.z+30)%60+60)%60-30;position.y=base.y+.45*Math.sin(t*3+phase)+.18*Math.cos(t*5+phase);matrix.makeRotationY(phase+t*2.4);matrix.setPosition(position);this.windLeaves.setMatrixAt(i,matrix);}this.windLeaves.instanceMatrix.needsUpdate=true;}
 updatePhysics(sim:Simulation){
  const vehicleIds=new Set(sim.items.filter(item=>item.kind?.startsWith('vehicle-')&&!item.retired).map(item=>item.id));for(const [id,mesh] of this.meshes)if(mesh.userData.vehicleBody&&!vehicleIds.has(id)){mesh.removeFromParent();this.clear(mesh);this.meshes.delete(id);}
  this.fragmentBatches.begin(sim.items);
  for(const item of sim.items){
   if(item.kind==='fragment'){
    if(item.fractured&&!item.retired&&!this.fracturedSeen.has(item.id)){this.fracturedSeen.add(item.id);this.fractureSound(item);}
    if(!item.fractured&&!item.retired){const sourceColor=item.sourceKind==='facade'?'#84c1cb':item.finish?FINISHES[item.finish as keyof typeof FINISHES]:PARTS[item.sourceKind as keyof typeof PARTS].color;const color=isConcrete(item.sourceKind)?concreteRenderColor(sourceColor,item.concreteStrength):sourceColor;this.fragmentBatches.update(item,()=>item.blockShot?new THREE.BoxGeometry(...item.size).toNonIndexed():item.vertices?partitionGeometry(item.vertices):item.structural?structuralFragmentGeometry(item.size!,item.sourceKind,item.id):fractureGeometry(item.size!,item.id,item.sourceKind),color);}
    continue;
   }
   let m=this.meshes.get(item.id);if(!m&&item.kind?.startsWith('vehicle-')){m=new THREE.Group();if(item.kind==='vehicle-chassis'){const assembly=vehicleAssembly(item.vehicleParts??[],false);while(assembly.children.length)m.add(assembly.children[0]);}else{const v=vehicleVisual('wheel');v.rotation.z=-Math.PI/2;m.add(v);}m.userData.vehicleId=item.vehicleId;m.userData.vehicleBody=true;this.extras.add(m);this.meshes.set(item.id,m);}if(!m&&['rock','payload','projectile','fragment','meteor'].includes(item.kind)){m=item.kind==='meteor'?this.meteor(item):item.kind==='fragment'?this.fragment(item):item.kind==='payload'?this.payload(item):this.rock(item);this.meshes.set(item.id,m)}if(!m)continue;
   const p=item.body.GetRenderPosition?.()??item.body.GetPosition(),q=item.body.GetRenderRotation?.()??item.body.GetRotation(),px=p.GetX(),py=p.GetY(),pz=p.GetZ(),qx=q.GetX(),qy=q.GetY(),qz=q.GetZ(),qw=q.GetW();
   if(item.kind==='projectile')m.scale.setScalar(item.radius/m.userData.projectileRadius);
   if(item.fractured){if(!item.retired&&!this.fracturedSeen.has(item.id)){this.fracturedSeen.add(item.id);this.fractureSound(item);}if(item.id>0&&!m.userData.instanceHidden){this.syncPieceInstances(item.id,m,false);this.syncRemnantInstances(item.id,m,false);m.userData.instanceHidden=true;}m.visible=false;continue;}
   const changed=!m.userData.poseSynced||Math.abs(m.position.x-px)+Math.abs(m.position.y-py)+Math.abs(m.position.z-pz)+Math.abs(m.quaternion.x-qx)+Math.abs(m.quaternion.y-qy)+Math.abs(m.quaternion.z-qz)+Math.abs(m.quaternion.w-qw)>1e-6;
   if(changed){m.position.set(px,py,pz);m.quaternion.set(qx,qy,qz,qw);m.userData.poseSynced=true;if(item.id>0){this.syncPieceInstances(item.id,m,true);this.syncRemnantInstances(item.id,m);}}
   if(item.kind==='meteor')this.updateMeteor(m,item,sim.elapsed);if(item.id>0){this.syncBreakRemnants(m,item);if(!this.colorPieceInstances(item.id,item.stress))this.color(m,item.kind,item.stress)}
  }
  this.fragmentBatches.end();this.updateRebars(sim);this.water.position.y=sim.water;this.updateWind(sim);
 }
 private fractureSound(item:any){
  const kind=item.sourceKind??item.kind,p=item.body.GetRenderPosition?.()??item.body.GetPosition(),position={x:p.GetX(),y:p.GetY(),z:p.GetZ()},concrete=['column','slab','wall','foundation'].includes(kind),material=kind==='facade'?'glass':concrete?'concrete':kind==='tree'?'wood':'metal';
  const strength=item.kind==='fragment'?.6:1.4;
  this.audio.emit(material,position,this.camera,strength);
 }
 private updateRebars(sim:Simulation){
  for(const mesh of this.rebarBatches)mesh.count=0;const items=new Map(sim.items.map(item=>[item.id,item])),up=new THREE.Vector3(0,1,0),from=new THREE.Vector3(),to=new THREE.Vector3(),mid=new THREE.Vector3(),dir=new THREE.Vector3(),quaternion=new THREE.Quaternion(),scale=new THREE.Vector3();let count=0;
  for(const item of sim.items){if(item.fractured)continue;for(const link of item.rebarLinks??[]){const target=items.get(link.to);if(!target||target.fractured)continue;const a=target.body.GetRenderPosition?.()??target.body.GetPosition(),b=item.body.GetRenderPosition?.()??item.body.GetPosition();const qa=item.body.GetRenderRotation?.()??item.body.GetRotation(),qb=target.body.GetRenderRotation?.()??target.body.GetRotation();from.set(...link.localA as V3).applyQuaternion(new THREE.Quaternion(qa.GetX(),qa.GetY(),qa.GetZ(),qa.GetW())).add(new THREE.Vector3(b.GetX(),b.GetY(),b.GetZ()));to.set(...link.localB as V3).applyQuaternion(new THREE.Quaternion(qb.GetX(),qb.GetY(),qb.GetZ(),qb.GetW())).add(new THREE.Vector3(a.GetX(),a.GetY(),a.GetZ()));dir.subVectors(to,from);const length=dir.length();if(length<.03)continue;const batchIndex=Math.floor(count/128);let mesh=this.rebarBatches[batchIndex];if(!mesh){mesh=new THREE.InstancedMesh(new THREE.CylinderGeometry(.035,.035,1,7),new THREE.MeshStandardMaterial({color:'#765b42',roughness:.62,metalness:.72}),128);mesh.castShadow=true;mesh.frustumCulled=false;mesh.userData.rebar=true;this.extras.add(mesh);this.rebarBatches.push(mesh);}const index=count%128;mid.addVectors(from,to).multiplyScalar(.5);quaternion.setFromUnitVectors(up,dir.normalize());scale.set(1,length,1);this.instanceMatrix.compose(mid,quaternion,scale);mesh.setMatrixAt(index,this.instanceMatrix);mesh.count=index+1;mesh.instanceMatrix.needsUpdate=true;count++;}}
 }
 private resetRebars(){for(const mesh of this.rebarBatches){mesh.count=0;mesh.instanceMatrix.needsUpdate=true;}}
 syncBreakRemnants(parent:THREE.Group,item:any){
  const remnants=item.remnants??[],start=parent.userData.remnantCount??0;if(start>=remnants.length)return;
  for(let index=start;index<remnants.length;index++){
   const remnant=remnants[index],size=remnantSize(remnant.sourceKind),random=fragmentRandom(remnant.seed,91),root=new THREE.Group();root.position.set(...remnant.point as V3);root.rotation.set((random()-.5)*.22,(random()-.5)*.45,(random()-.5)*.22);
   const darkOffset=new THREE.Object3D();darkOffset.position.set((random()-.5)*size[0]*.08,-size[1]*.08,(random()-.5)*size[2]*.08);root.updateMatrix();darkOffset.updateMatrix();const darkColor=isConcrete(remnant.sourceKind)?concreteRenderColor('#59635e',remnant.concreteStrength):'#59635e';this.addRemnantInstance(item.id,parent,root.matrix.clone().multiply(darkOffset.matrix),remnant,'dark',size.map(n=>n*.68) as V3,darkColor);
   const baseColor=remnant.sourceFinish?FINISHES[remnant.sourceFinish as keyof typeof FINISHES]:(PARTS[remnant.sourceKind as keyof typeof PARTS]?.color??'#aeb5af'),color=isConcrete(remnant.sourceKind)?concreteRenderColor(baseColor,remnant.concreteStrength):baseColor;
   const chunkOffset=new THREE.Object3D();chunkOffset.position.set((random()-.5)*size[0]*.08,size[1]*.07,(random()-.5)*size[2]*.08);chunkOffset.rotation.set((random()-.5)*.12,(random()-.5)*.18,(random()-.5)*.12);chunkOffset.scale.set(.88+random()*.24,.88+random()*.24,.88+random()*.24);chunkOffset.updateMatrix();this.addRemnantInstance(item.id,parent,root.matrix.clone().multiply(chunkOffset.matrix),remnant,'chunk',size.map(n=>n*.92) as V3,remnant.sourceKind==='facade'?'#75aeb8':color);
  }
  parent.userData.remnantCount=remnants.length;
 }
 private addRemnantInstance(id:number,parent:THREE.Group,local:THREE.Matrix4,remnant:any,layer:'dark'|'chunk',size:V3,color:THREE.ColorRepresentation){
  const variant=Math.abs(remnant.seed+(layer==='dark'?41:0))%4,key=[layer,remnant.sourceKind,remnant.sourceFinish??'',variant].join(':'),batches=this.remnantBatches.get(key)??[];
  let mesh=batches.at(-1);if(!mesh||mesh.count>=128){const material=new THREE.MeshStandardMaterial({color:0xffffff,roughness:layer==='dark'?1:remnant.sourceKind==='facade'?.28:.9,metalness:layer==='chunk'&&['girder','truss','brace'].includes(remnant.sourceKind)?.28:0,flatShading:true,side:THREE.DoubleSide});mesh=new THREE.InstancedMesh(fractureGeometry(size,variant*7919+remnant.sourceKind.length*101,remnant.sourceKind),material,128);mesh.count=0;mesh.castShadow=true;mesh.receiveShadow=true;mesh.frustumCulled=false;mesh.userData.breakRemnant=true;mesh.userData.breakRemnantBatch=true;mesh.userData.instancePartIds=[];this.structure.add(mesh);batches.push(mesh);this.remnantBatches.set(key,batches);}
  const index=mesh.count++;mesh.setColorAt(index,this.instanceColor.set(color));if(mesh.instanceColor)mesh.instanceColor.needsUpdate=true;(mesh.userData.instancePartIds as number[])[index]=id;const refs=this.remnantRefs.get(id)??[];refs.push({mesh,index,local});this.remnantRefs.set(id,refs);parent.updateMatrix();this.instanceMatrix.multiplyMatrices(parent.matrix,local);mesh.setMatrixAt(index,this.instanceMatrix);mesh.instanceMatrix.needsUpdate=true;
 }
 private syncRemnantInstances(id:number,parent:THREE.Group,visible=true){const refs=this.remnantRefs.get(id);if(!refs)return;parent.updateMatrix();for(const ref of refs){if(visible)this.instanceMatrix.multiplyMatrices(parent.matrix,ref.local);else this.instanceMatrix.makeScale(0,0,0);ref.mesh.setMatrixAt(ref.index,this.instanceMatrix);ref.mesh.instanceMatrix.needsUpdate=true;}}
 private resetBreakRemnants(){this.remnantRefs.clear();for(const batches of this.remnantBatches.values())for(const mesh of batches){mesh.count=0;mesh.instanceMatrix.needsUpdate=true;(mesh.userData.instancePartIds as number[]).length=0;}}
 meteor(item:any){
  const g=new THREE.Group(),core=new THREE.Mesh(new THREE.IcosahedronGeometry(item.radius!,1),new THREE.MeshStandardMaterial({color:'#56372a',roughness:.9,emissive:'#ff6a13',emissiveIntensity:2}));core.castShadow=true;g.add(core);
  const tail=new THREE.Mesh(new THREE.ConeGeometry(item.radius!*.75,1,7),new THREE.MeshBasicMaterial({color:'#ffab38',transparent:true,opacity:.55,depthWrite:false,blending:THREE.AdditiveBlending}));tail.geometry.translate(0,.5,0);g.add(tail);g.userData.meteorCore=core;g.userData.meteorTail=tail;this.extras.add(g);return g;
 }
 updateMeteor(g:THREE.Group,item:any,time:number){
  const v=item.body.GetLinearVelocity(),velocity=new THREE.Vector3(v.GetX(),v.GetY(),v.GetZ()),age=time-(item.bornAt??0),heat=Math.max(0,1-age/4);
  const core=g.userData.meteorCore as THREE.Mesh<THREE.BufferGeometry,THREE.MeshStandardMaterial>,tail=g.userData.meteorTail as THREE.Mesh;core.material.emissiveIntensity=heat*2;
  tail.visible=heat>0&&velocity.length()>12&&velocity.y<-5;
  if(tail.visible){tail.scale.y=velocity.length()*.16;tail.quaternion.setFromUnitVectors(new THREE.Vector3(0,1,0),velocity.normalize().negate().applyQuaternion(g.quaternion.clone().invert()));}
 }
 fragment(item:any){const g=new THREE.Group(),glass=item.sourceKind==='facade',baseColor=item.finish?FINISHES[item.finish as keyof typeof FINISHES]:PARTS[item.sourceKind as keyof typeof PARTS].color,color=isConcrete(item.sourceKind)?concreteRenderColor(baseColor,item.concreteStrength):baseColor;const material=new THREE.MeshStandardMaterial({color:glass?'#84c1cb':color,roughness:glass?.18:.95,metalness:glass?.25:0,transparent:glass,opacity:glass?.72:1,flatShading:true,side:THREE.DoubleSide});const mesh=new THREE.Mesh(item.vertices?partitionGeometry(item.vertices):fractureGeometry(item.size!,item.id,item.sourceKind),material);mesh.castShadow=true;mesh.receiveShadow=true;g.add(mesh);this.extras.add(g);return g;}
 rock(item:any){const g=new THREE.Group();g.userData.projectileRadius=item.radius;const m=new THREE.Mesh(item.kind==='projectile'?new THREE.SphereGeometry(item.radius!,20,14):new THREE.IcosahedronGeometry(item.radius!,1),mat(item.kind==='projectile'?'#a15035':'#8b8d7c',item.kind==='projectile'?.3:.82));m.castShadow=true;m.receiveShadow=true;g.add(m);this.extras.add(g);return g;}
 payload(item:any){const g=new THREE.Group();const color=Math.abs(item.id)%3===0?'#759a93':Math.abs(item.id)%3===1?'#be985f':'#aeb697';box([.9,.9,.9],[0,0,0],mat(color),g);for(const x of [-.27,.27])box([.06,.92,.92],[x,0,0],mat('#526556'),g);this.extras.add(g);return g;}
 color(g:THREE.Group,_kind:string,stress:number){g.traverse(o=>{if(o instanceof THREE.Mesh&&!o.userData.ignoreStress){const m=o.material as THREE.MeshStandardMaterial;if(this.stress)m.color.setHSL(Math.max(0,.34-Math.min(1,stress)*.34),.64,.51);else if(o.userData.originalColor!==undefined)m.color.set(o.userData.originalColor)}})}
 render(dt:number){if(this.rendererBackend==='initializing'||this.warmingEffects)return;this.frame++;if(dt>0)this.fps=this.fps*.97+Math.min(144,1/dt)*.03;
  this.controls.maxPolarAngle=this.freeCameraLook?Math.PI-.05:Math.PI/2-.02;
  if(this.controls.enabled){
   this.controls.update();
   // Allow steep upward aim without orbiting beneath the terrain. Translating
   // camera and pivot together preserves both aim and orbit distance.
   if(this.freeCameraLook&&this.camera.position.y<1){const lift=1-this.camera.position.y;this.camera.position.y+=lift;this.controls.target.y+=lift;}
  }
  this.selection?.update();this.renderer.render(this.scene,this.camera);
 }
}


