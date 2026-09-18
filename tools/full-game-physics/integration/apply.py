"""Strict backend-only patch against the published source archive. No solver/geometry changes."""
from pathlib import Path
import sys, shutil
root=Path(sys.argv[1]);helpers=Path(__file__).parent

def replace(s,old,new):
    if s.count(old)!=1:raise RuntimeError(f'Expected one patch location, got {s.count(old)}: {old[:100]}')
    return s.replace(old,new,1)

for name in ['fast-constraints.ts','native-query-cache.ts','native-loader.ts','physics-replay.ts']:
    shutil.copyfile(helpers/name,root/'src'/name)
p=root/'src/physics.ts';s=p.read_text()
s="import { createStructuralConstraint, prepareJointYield } from './fast-constraints';\nimport { NativeQueryCache } from './native-query-cache';\nimport { loadCompatibleJolt } from './native-loader';\n"+s
s=replace(s,"let modulePromise: ReturnType<typeof initJolt> | undefined;\nexport const loadPhysics = () => modulePromise ??= initJolt();","const modulePromises:Promise<any>[]=[];\nexport const loadPhysics = (reference=false) => modulePromises[+reference] ??= loadCompatibleJolt(0,!reference).then(loaded=>loaded.J);")
s=replace(s,'export interface SimulationRules {','export interface SimulationRules {\n optimizedPhysics?:boolean; fixedConstraints?:boolean; nativeQueries?:boolean;')
s=replace(s,'export class Simulation {','export class Simulation {\n nativeQueries:NativeQueryCache;fixedJointUpgrades=0;')
s=replace(s,'this.J=J; this.rules=rules;','this.J=J; this.rules=rules;this.nativeQueries=new NativeQueryCache(J,rules.optimizedPhysics!==false&&rules.nativeQueries!==false);')
old="""  const J=this.J, settings=pinned?new J.PointConstraintSettings():new J.SixDOFConstraintSettings();
  if(pinned){settings.mPoint1.Set(...p);settings.mPoint2.Set(...p);}else{for(let axis=0;axis<6;axis++) settings.MakeFixedAxis(axis);settings.mPosition1.Set(...p);settings.mPosition2.Set(...p);}
  const constraint=J.castObject(settings.Create(a.body,b?.body??support),pinned?J.PointConstraint:J.SixDOFConstraint); this.system.AddConstraint(constraint); J.destroy(settings);"""
s=replace(s,old,'  const constraint=createStructuralConstraint(this,a.body,b?.body??support,p,pinned);')
s=replace(s,'  j.damageStage=(j.damageStage??0)+1;j.overloadTime=0;','  prepareJointYield(this,j);\n  j.damageStage=(j.damageStage??0)+1;j.overloadTime=0;')
s=replace(s,'  for(const j of this.joints) {\n   if(j.broken)continue;','  const jointLambdas=this.nativeQueries.lambdas(this.joints);\n  for(let jointIndex=0;jointIndex<this.joints.length;jointIndex++) {\n   const j=this.joints[jointIndex];if(j.broken)continue;')
old="""   const f=j.constraint.GetTotalLambdaPosition().Length()/dt,torque=j.pinned?null:j.constraint.GetTotalLambdaRotation();
   const stress=torque?Math.max(f/j.force,Math.abs(torque.GetX())/(dt*j.torque[0]),Math.abs(torque.GetY())/(dt*j.torque[1]),Math.abs(torque.GetZ())/(dt*j.torque[2])):f/j.force;j.stress=stress;"""
new="""   const o=jointIndex*4;
   const f=(jointLambdas?jointLambdas[o]:j.constraint.GetTotalLambdaPosition().Length())/dt;
   const torque=j.pinned||jointLambdas?null:j.constraint.GetTotalLambdaRotation();
   const tx=jointLambdas?jointLambdas[o+1]:torque?.GetX()??0,ty=jointLambdas?jointLambdas[o+2]:torque?.GetY()??0,tz=jointLambdas?jointLambdas[o+3]:torque?.GetZ()??0;
   const stress=j.pinned?f/j.force:Math.max(f/j.force,Math.abs(tx)/(dt*j.torque[0]),Math.abs(ty)/(dt*j.torque[1]),Math.abs(tz)/(dt*j.torque[2]));j.stress=stress;"""
s=replace(s,old,new)
s=replace(s,'dispose() { this.worldVehicles.dispose();','dispose() { this.nativeQueries.dispose();this.worldVehicles.dispose();');p.write_text(s)

p=root/'src/physics-worker.ts';s=p.read_text()
s="import { loadCompatibleJolt } from './native-loader';\nimport { runPhysicsReplay } from './physics-replay';\n"+s
start=s.index('async function loadJolt(threads:number){');end=s.index('async function prepareStructure()',start)
s=s[:start]+"async function loadJolt(threads:number,optimized=true){return loadCompatibleJolt(threads,optimized);}\n"+s[end:]
s=replace(s,'const loaded=await loadJolt(c.threads);','const loaded=await loadJolt(c.threads,c.rules?.optimizedPhysics!==false);')
s=replace(s,'let snapshotInFlight:number|undefined;','let snapshotInFlight:number|undefined;\nlet recycledPoseBuffer:ArrayBuffer|undefined,recycledStressBuffer:ArrayBuffer|undefined;\nlet benchmarking=false;')
s=replace(s,'const poses=new Float32Array(sim.items.length*POSE_STRIDE);const stress=new Float32Array(sim.items.length);',"""const poseBytes=sim.items.length*POSE_STRIDE*4,stressBytes=sim.items.length*4;
 const poses=new Float32Array(recycledPoseBuffer?.byteLength===poseBytes?recycledPoseBuffer:new ArrayBuffer(poseBytes));
 const stress=new Float32Array(recycledStressBuffer?.byteLength===stressBytes?recycledStressBuffer:new ArrayBuffer(stressBytes));
 recycledPoseBuffer=undefined;recycledStressBuffer=undefined;sim.nativeQueries.writePoses(sim.items,poses);""")
old="""  const p=item.body.GetPosition(),q=item.body.GetRotation(),v=item.body.GetLinearVelocity(),w=item.body.GetAngularVelocity(),o=i*POSE_STRIDE;
  poses.set([p.GetX(),p.GetY(),p.GetZ(),q.GetX(),q.GetY(),q.GetZ(),q.GetW(),v.GetX(),v.GetY(),v.GetZ(),(item.flying||item.body.IsActive?.())?1:0,w.GetX(),w.GetY(),w.GetZ()],o);
"""
s=replace(s,old,'')
s=replace(s,'if(c.seq===snapshotInFlight)snapshotInFlight=undefined;','if(c.seq===snapshotInFlight){snapshotInFlight=undefined;if(c.poseBuffer instanceof ArrayBuffer)recycledPoseBuffer=c.poseBuffer;if(c.stressBuffer instanceof ArrayBuffer)recycledStressBuffer=c.stressBuffer;}')
s=replace(s,'const meta={worldVehicles:',"const meta={core:sim.nativeQueries.enabled?'specialized-native':'original',fixedJointUpgrades:sim.fixedJointUpgrades,worldVehicles:")
s=replace(s,'function handle(c:WorkerCommand){if(handleWorld(c))return;',"function handle(c:WorkerCommand){if(benchmarking&&c.type!=='snapshot-consumed'&&c.type!=='stop'){if('requestId' in c)ack((c as any).requestId,new Error('Diagnostic replay is running'));return;}if(c.type==='benchmark'){if(!sim||!initConfig||!sim.rules.sandbox)return;benchmarking=true;void (async()=>{try{await restart(-1,{wind:false,earthquake:false,flood:false,meteors:false,attack:false});const result=await runPhysicsReplay(sim!,()=>snapshot());paused=true;snapshot();post({type:'benchmark-result',result:{...result,threads:engineThreads}});}catch(error){post({type:'benchmark-error',message:String(error)});}finally{benchmarking=false;last=performance.now();accumulator=0;}})();return;}if(handleWorld(c))return;")
s=replace(s,'if(sim&&!preparing&&!paused&&!sim.result){','if(sim&&!preparing&&!paused&&!benchmarking&&!sim.result){');p.write_text(s)
p=root/'src/simulation-protocol.ts';s=p.read_text()
s=replace(s,"{ type:'snapshot-consumed'; seq:number }","{ type:'snapshot-consumed'; seq:number; poseBuffer?:ArrayBuffer; stressBuffer?:ArrayBuffer }")
s=replace(s,'export type WorkerCommand =',"export type WorkerCommand =\n | { type:'benchmark' }");p.write_text(s)
p=root/'src/simulation-client.ts';s=p.read_text()
s=replace(s,"this.worker.postMessage({type:'init',pieces,scenario,intensity,rules,threads});","this.worker.postMessage({type:'init',pieces,scenario,intensity,rules:{...rules,optimizedPhysics:new URLSearchParams(typeof location==='undefined'?'':location.search).get('physics')!=='reference'},threads});")
s=replace(s,'this.poses=new Float32Array(m.poses);this.stress=new Float32Array(m.stress);','this.poses=m.poses instanceof Float32Array?m.poses:new Float32Array(m.poses);this.stress=m.stress instanceof Float32Array?m.stress:new Float32Array(m.stress);')
s=replace(s,"this.worker.postMessage({type:'snapshot-consumed',seq:m.seq});","const poseBuffer=this.poses.buffer as ArrayBuffer,stressBuffer=this.stress.buffer as ArrayBuffer;this.poses=new Float32Array();this.stress=new Float32Array();this.worker.postMessage({type:'snapshot-consumed',seq:m.seq,poseBuffer,stressBuffer},[poseBuffer,stressBuffer]);")
s=replace(s,'get startup(){return this.status.startup}',"get core(){return this.status.core}get fixedJointUpgrades(){return this.status.fixedJointUpgrades??0}get startup(){return this.status.startup}");p.write_text(s)
# Isolated saves, including modules that construct keys from a namespace argument.
for p in (root/'src').glob('*.ts'):
    s=p.read_text().replace('loadbearing.','loadbearing-fullfast.').replace("'loadbearing'","'loadbearing-fullfast'")
    # Create() returns a borrowed static ShapeResult. Clear its reference, do not delete it.
    for name in ['result','created','shapeResult']:s=s.replace(f'J.destroy({name});',f'{name}.Clear();')
    p.write_text(s)
(root/'src/native').mkdir(exist_ok=True)
for name in ['jolt-physics.wasm-compat','jolt-physics.multithread.wasm-compat']:
    (root/'src/native'/f'{name}.d.ts').write_text('declare const init:(settings?:any)=>Promise<any>; export default init;\n')
print('Applied full-game backend. UI, renderer, geometry, materials, timestep and solver counts preserved.')
