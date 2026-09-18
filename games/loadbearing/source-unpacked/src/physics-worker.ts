import { WalkerPhysics } from './walker-physics';
import { Simulation } from './physics';
import type { WorkerCommand } from './simulation-protocol';
import { POSE_STRIDE } from './simulation-protocol';
import type { WorldVehicleSpec, WorldVehicleState } from './world-vehicles';
import { addWorldPieces, removeWorldPieces, validateWorldPieceEdit } from './structural-edit';

let walker:WalkerPhysics|undefined, walkerSpawn:[number,number,number]|undefined;
let startupState:any, startupInfo:any, preparing=true;
let sim:Simulation|undefined, paused=false, speed=1, alive=true, last=performance.now(), accumulator=0, seq=0;
let engine:any, engineThreads=0, initConfig:Extract<WorkerCommand,{type:'init'}>|undefined, treeSpecs:any[]=[];
let previousRecords='', lastGoalAt=-Infinity, cachedBuildingStatus:any, rate=1, rateWall=performance.now(), rateElapsed=0;
// Only one unconsumed snapshot: an overloaded renderer must not accumulate stale poses.
let snapshotInFlight:number|undefined;
const pending:WorkerCommand[]=[];
const worldBlueprints=new Map<number,WorldVehicleSpec>();
const worldModes=new Map<number,{mode:WorldVehicleState['mode'];target?:[number,number,number]}>();
const worldInputs=new Map<number,string>();
const post=(message:any, transfer:ArrayBuffer[]=[])=>(self as any).postMessage(message, transfer);

function snapshot(force=false){
 if(!sim||preparing||(!force&&snapshotInFlight!==undefined))return;
 const recordKey=sim.items.map(item=>`${item.id}:${item.fractured?1:0}:${item.retired?1:0}:${item.remnants?.length??0}:${item.bornAt??''}:${item.radius??''}:${item.rebarLinks?.map(link=>link.id).join(',')??''}`).join('|'),records:any[]|undefined=force||recordKey!==previousRecords?[]:undefined;const poses=new Float32Array(sim.items.length*POSE_STRIDE);const stress=new Float32Array(sim.items.length);
  sim.items.forEach((item,i)=>{
  const p=item.body.GetPosition(),q=item.body.GetRotation(),v=item.body.GetLinearVelocity(),w=item.body.GetAngularVelocity(),o=i*POSE_STRIDE;
  poses.set([p.GetX(),p.GetY(),p.GetZ(),q.GetX(),q.GetY(),q.GetZ(),q.GetW(),v.GetX(),v.GetY(),v.GetZ(),(item.flying||item.body.IsActive?.())?1:0,w.GetX(),w.GetY(),w.GetZ()],o);
  stress[i]=item.stress;
  records?.push({id:item.id,vehicleId:(item as any).vehicleId,kind:item.kind,initial:item.initial,radius:item.radius,fractured:item.fractured,retired:item.retired,size:item.size,vertices:item.vertices,finish:item.finish,sourceKind:item.sourceKind,structural:item.structural,blockShot:item.blockShot,concreteStrength:item.concreteStrength,reinforcement:item.reinforcement,bornAt:item.bornAt,remnants:item.remnants,rebarLinks:item.rebarLinks,vehicleParts:(item as any).vehicleParts,vehiclePart:(item as any).vehiclePart});
 });
 const now=performance.now(),wallDelta=(now-rateWall)/1000,elapsedDelta=sim.elapsed-rateElapsed;
 if(wallDelta>=.25){rate=rate*.7+(elapsedDelta/wallDelta)*.3;rateWall=now;rateElapsed=sim.elapsed;}
 if(sim.elapsed-lastGoalAt>=.5||!cachedBuildingStatus){cachedBuildingStatus=sim.buildingStatus();lastGoalAt=sim.elapsed;}
 const ages:any={};for(const kind of ['wind','earthquake','flood','meteors','attack'] as const)ages[kind]=sim.hazardAge(kind);
 const treeState=sim.trees&&{broken:sim.trees.broken,trees:sim.trees.trees.map(t=>({itemId:t.item.id,spec:t.spec,broken:t.broken}))};
 const attacker=sim.attacker?.vehicle;const attackerState=attacker?{id:attacker.chassisItem.id,yaw:attacker.controls.yaw,pitch:attacker.controls.pitch}:null;
 const meta={worldVehicles:sim.worldVehicleStates??[],attacker:attackerState,walker:walker?.snapshot()??null,elapsed:sim.elapsed,duration:sim.duration,broken:sim.broken,maxStress:sim.maxStress,peakStress:sim.peakStress,physicsMs:sim.physicsMs,rate,paused,water:sim.water,rocks:sim.rocks,meteors:sim.meteors,projectiles:sim.projectiles,fragments:sim.fragments,fragmentLimit:sim.fragmentLimit,result:sim.result,reason:sim.reason,sandboxHazards:sim.sandboxHazards,ages,trees:treeState,buildingStatus:cachedBuildingStatus,occupancy:sim.occupancy&&{tonnes:sim.occupancy.tonnes,wave:sim.occupancy.wave,count:sim.occupancy.count}};
 snapshotInFlight=seq++;post({type:'snapshot',seq:snapshotInFlight,sentAt:performance.timeOrigin+performance.now(),records,poses,stress,meta},[poses.buffer,stress.buffer]);previousRecords=recordKey;
}

async function loadJolt(threads:number){
 if(threads>0){
  try{const init=(await import('jolt-physics/wasm-compat-multithread')).default;return {J:await init(),threads,mode:'multithread' as const};}
  catch(error){post({type:'warning',message:`Multithread physics unavailable; using single-thread Jolt (${error instanceof Error?error.message:String(error)})`});}
 }
 const init=(await import('jolt-physics')).default;return {J:await init(),threads:0,mode:'single-thread' as const};
}
async function prepareStructure(){
 if(!sim||sim.pieces.length<400||!sim.rules.sandbox)return;
 post({type:'preparing'});
 startupInfo=await sim.settleStartup();
 if(!startupInfo)return;
 if(startupState)engine.destroy(startupState);
 startupState=new engine.StateRecorderImpl();sim.system.SaveState(startupState);
}
function applyWorldState(){
 if(!sim)return;
 for(const spec of worldBlueprints.values())sim.spawnWorldVehicle(structuredClone(spec));
 for(const [id,state] of worldModes)sim.setWorldVehicleMode(id,state.mode,state.target);
}
function ack(requestId:number,error?:unknown){if(!error)snapshot(true);post({type:'ack',requestId,...(error?{error:error instanceof Error?error.message:String(error)}:{})});}
async function init(c:Extract<WorkerCommand,{type:'init'}>){
 try{const loaded=await loadJolt(c.threads);if(!alive)return;engine=loaded.J;engineThreads=loaded.threads;initConfig={...c,pieces:structuredClone(c.pieces)};worldBlueprints.clear();worldModes.clear();for(const spec of c.rules?.worldVehicles??[])worldBlueprints.set(spec.id,structuredClone(spec));sim=new Simulation(engine,structuredClone(initConfig.pieces),c.scenario,c.intensity,c.rules,engineThreads);await prepareStructure();applyWorldState();preparing=false;snapshot(true);last=performance.now();rateWall=last;rateElapsed=sim.elapsed;post({type:'ready',mode:loaded.mode,threads:engineThreads,startup:startupInfo});drainPending();loop();}
 catch(error){post({type:'error',message:error instanceof Error?error.message:String(error)});}
}
async function restart(requestId:number,hazards:Partial<Record<'wind'|'earthquake'|'flood'|'meteors'|'attack',boolean>>={}){
 if(!sim||!engine||!initConfig)return;
 try{
  preparing=true;worldInputs.clear();const fragmentLimit=sim.fragmentLimit,walkerControls=walker?{...walker.controls,forward:0,right:0,jump:false,fire:false}:undefined;walker?.dispose();walker=undefined;sim.dispose();
  const rules={...initConfig.rules,fragmentLimit};sim=new Simulation(engine,structuredClone(initConfig.pieces),initConfig.scenario,initConfig.intensity,rules,engineThreads);
  let restored=false;
  if(startupState){startupState.Rewind();restored=sim.system.RestoreState(startupState);if(!restored){sim.dispose();sim=new Simulation(engine,structuredClone(initConfig.pieces),initConfig.scenario,initConfig.intensity,rules,engineThreads);}}
  if(!restored)await prepareStructure();else sim.armStartupDamage();
  applyWorldState();if(treeSpecs.length)sim.attachTrees(treeSpecs);if(walkerSpawn){walker=new WalkerPhysics(sim,walkerSpawn);if(walkerControls){Object.assign(walker.controls,walkerControls);walker.reset(walkerSpawn);}}for(const kind of ['wind','earthquake','flood','meteors','attack'] as const)if(hazards[kind])sim.setSandboxHazard(kind,true);paused=false;accumulator=0;last=performance.now();rateWall=last;rateElapsed=0;lastGoalAt=-Infinity;cachedBuildingStatus=undefined;previousRecords='';preparing=false;snapshot(true);post({type:'restarted',requestId,startup:{...startupInfo,cached:restored}});drainPending();
 }catch(error){preparing=false;post({type:'error',message:error instanceof Error?error.message:String(error),requestId});}
}
function drainPending(){while(!preparing&&pending.length)handle(pending.shift()!);}
function handleWorld(c:WorkerCommand):boolean{
 try{
  if(c.type==='world-vehicle-spawn'){if(worldBlueprints.has(c.spec.id))throw new Error('World vehicle '+c.spec.id+' already exists');sim?.spawnWorldVehicle(structuredClone(c.spec));worldBlueprints.set(c.spec.id,structuredClone(c.spec));ack(c.requestId);return true;}
  if(c.type==='world-vehicle-remove'){sim?.removeWorldVehicle(c.id);worldBlueprints.delete(c.id);worldModes.delete(c.id);worldInputs.delete(c.id);ack(c.requestId);return true;}
  if(c.type==='world-vehicle-replace'){sim?.replaceWorldVehicle(structuredClone(c.spec));worldBlueprints.set(c.spec.id,structuredClone(c.spec));worldModes.set(c.spec.id,{mode:'parked'});worldInputs.delete(c.spec.id);ack(c.requestId);return true;}
  if(c.type==='world-pieces-edit'){if(!sim||!initConfig)throw new Error('Simulation is not ready');validateWorldPieceEdit(sim,c.add,c.remove);if(c.remove.length)removeWorldPieces(sim,c.remove);if(c.add.length)addWorldPieces(sim,c.add);initConfig.pieces=[...initConfig.pieces.filter(p=>!c.remove.includes(p.id)),...structuredClone(c.add)];if(startupState){engine.destroy(startupState);startupState=undefined;}ack(c.requestId);return true;}
  if(c.type==='concrete-update'){if(!sim||!initConfig)throw new Error('Simulation is not ready');const ids=[...new Set(c.ids)];if(ids.some(id=>!Number.isSafeInteger(id)||id<=0)||!Number.isFinite(c.values.concreteStrength)||!Number.isFinite(c.values.reinforcement))throw new Error('Invalid concrete update');sim.updateConcrete(ids,c.values);initConfig.pieces=initConfig.pieces.map(p=>ids.includes(p.id)?{...p,concreteStrength:c.values.concreteStrength,reinforcement:c.values.reinforcement}:p);if(startupState){engine.destroy(startupState);startupState=undefined;}ack(c.requestId);return true;}
  if(c.type==='world-vehicle-mode'){sim?.setWorldVehicleMode(c.id,c.mode,c.target);if(c.mode==='drive')for(const [otherId,other] of worldModes)if(otherId!==c.id&&other.mode==='drive')worldModes.set(otherId,{mode:'parked'});worldModes.set(c.id,{mode:c.mode,target:c.target});worldInputs.delete(c.id);return true;}
  if(c.type==='world-vehicle-input'){const key=JSON.stringify(c.input);if(worldInputs.get(c.id)!==key){worldInputs.set(c.id,key);sim?.worldVehicleInput(c.id,c.input);}return true;}
 }catch(error){if('requestId' in c)ack((c as any).requestId,error);return true;} return false;
}function handle(c:WorkerCommand){if(handleWorld(c))return;if(c.type==='walker'){walker?.dispose();walker=undefined;walkerSpawn=c.spawn??undefined;if(sim&&walkerSpawn)walker=new WalkerPhysics(sim,walkerSpawn);return;}if(c.type==='walker-input'){if(walker)Object.assign(walker.controls,c.input);return;}if(c.type==='snapshot-consumed'){if(c.seq===snapshotInFlight)snapshotInFlight=undefined;return;}if(c.type==='vehicle-input'){if(sim?.vehicle)Object.assign(sim.vehicle.controls,c.input);return;}if(c.type==='pause'){paused=c.value;rateWall=performance.now();rateElapsed=sim?.elapsed??0;post({type:'ack',command:'pause',value:paused});}else if(c.type==='speed')speed=Math.max(.1,Math.min(4,c.value));else if(c.type==='hazard')sim?.setSandboxHazard(c.kind,c.enabled);else if(c.type==='trees'){treeSpecs=structuredClone(c.specs);sim?.attachTrees(c.specs);}else if(c.type==='volley'){
 // One command: every muzzle fires before the next physics step. Multi-shot
 // salvos use the regular debris budget, not the optional four-shot reuse ring.
 let failed=0;for(const shot of c.shots)if(sim&&!sim.launchProjectile(shot.position,shot.velocity,c.mass,c.radius,c.projectileType,c.recycle&&c.shots.length===1,c.building))failed++;
 if(failed)post({type:'warning',message:`${failed} Geschosse konnten nicht erzeugt werden. Bitte das Trümmerlimit erhöhen.`});
 }else if(c.type==='projectile'){if(sim&&!sim.launchProjectile(c.position,c.velocity,c.mass,c.radius,c.projectileType,c.recycle,c.building))post({type:'warning',message:'Für die Bauteilkugel fehlen freie Trümmerplätze. Bitte das Trümmerlimit erhöhen oder die Welt zurücksetzen.'});}else if(c.type==='fragment-limit'){sim?.setFragmentLimit(c.value);if(initConfig)initConfig.rules={...initConfig.rules,fragmentLimit:c.value};}else if(c.type==='restart')void restart(c.requestId,c.hazards);else if(c.type==='stop'){alive=false;walker?.dispose();walker=undefined;sim?.dispose();sim=undefined;close();}}
function loop(){if(!alive)return;const now=performance.now(),dt=Math.min(.1,(now-last)/1000);last=now;if(sim&&!preparing&&!paused&&!sim.result){const quantum=sim.pieces.length>=400?1/60:1/120;accumulator=Math.min(.25,accumulator+dt*speed);const started=performance.now();let n=0;while(accumulator>=quantum&&n++<12&&!sim.result&&performance.now()-started<10){walker?.step(quantum);sim.step(quantum);accumulator-=quantum;}if(accumulator>=quantum)accumulator%=quantum;}if(sim&&performance.now()-(loop as any).lastSnapshot>33){(loop as any).lastSnapshot=performance.now();snapshot();}setTimeout(loop,4);}(loop as any).lastSnapshot=0;
(self as any).onmessage=(e:MessageEvent<WorkerCommand>)=>{const c=e.data;if(c.type==='init')void init(c);else if(sim&&!preparing)handle(c);else pending.push(c);};
