import {build} from 'esbuild';
import {mkdir,writeFile,readFile} from 'node:fs/promises';
import {pathToFileURL} from 'node:url';
import {resolve} from 'node:path';
import os from 'node:os';
const root=process.cwd(),out=resolve(root,'../../evidence');await mkdir(out,{recursive:true});
await build({stdin:{contents:"export {Simulation,loadPhysics} from './src/physics.ts';export {generateDemolitionBuilding} from './src/procedural-buildings.ts';",resolveDir:root},bundle:true,platform:'node',format:'esm',external:['jolt-physics'],outfile:'artifacts/profile-bundle.mjs'});
const {Simulation,loadPhysics,generateDemolitionBuilding}=await import(pathToFileURL(resolve('artifacts/profile-bundle.mjs')));
const J=await loadPhysics();
const APIs={};for(const name of ['FixedConstraintSettings','FixedConstraint','SixDOFConstraintSettings','SixDOFConstraint','Body','BodyInterface','PhysicsSystem','StateRecorderJS'])APIs[name]=J[name]?Object.getOwnPropertyNames(J[name].prototype):null;
console.log('JOLT_APIS '+JSON.stringify(APIs));await writeFile(resolve(out,'jolt-api.json'),JSON.stringify(APIs,null,2));
console.log('PACKAGE '+await readFile('node_modules/jolt-physics/package.json','utf8'));
const all=[];
for(const style of ['brutalist','art-deco']){
 const pieces=generateDemolitionBuilding(1000,0x51a7,style).pieces,sim=new Simulation(J,pieces,'sandbox',1,{sandbox:true,fragmentLimit:500},0);
 const solver=sim.system.GetPhysicsSettings();console.log('SOLVER '+JSON.stringify({velocity:solver.mNumVelocitySteps,position:solver.mNumPositionSteps}));
 await sim.settleStartup();for(let i=0;i<90;i++)sim.step(1/60);
 const profile={};for(const [obj,key,label] of [[sim.world,'Step','jolt'],...['captureProjectileSweeps','captureGroundImpacts','updateRebars','fractureProjectileImpacts','fractureGroundImpacts','updateGlassDamage','collectRetiredBodies','fracture','yieldJoint','bodiesOverlap'].filter(k=>typeof sim[k]==='function').map(k=>[sim,k,k])]){const old=obj[key].bind(obj);profile[label]={ms:0,calls:0};obj[key]=(...args)=>{const t=performance.now();try{return old(...args);}finally{profile[label].ms+=performance.now()-t;profile[label].calls++;}};}
 const xs=pieces.map(p=>p.p[0]),ys=pieces.map(p=>p.p[1]),zs=pieces.map(p=>p.p[2]),minX=Math.min(...xs),maxX=Math.max(...xs),maxY=Math.max(...ys),minZ=Math.min(...zs);
 const plan=[{tick:30,p:[minX-18,6,0],v:[70,0,0]},{tick:105,p:[maxX+18,9,0],v:[-70,0,0]},{tick:180,p:[0,maxY+18,0],v:[0,-75,0]},{tick:240,p:[0,6,minZ-18],v:[0,0,70]}];
 const samples=[],timeline=[];for(let tick=0;tick<360;tick++){for(const shot of plan)if(tick===shot.tick)sim.launchProjectile(shot.p,shot.v,45000,2);const at=performance.now();sim.step(1/60);samples.push(performance.now()-at);if(tick%60===59)timeline.push({tick,broken:sim.broken,fragments:sim.fragments,joints:sim.joints.filter(j=>!j.broken).length,bodyCount:sim.bodyList.length,active:sim.items.filter(i=>!i.fractured&&i.body.IsActive()).length});}
 samples.sort((a,b)=>a-b);const row={style,pieces:pieces.length,meanMs:samples.reduce((a,b)=>a+b,0)/samples.length,p50:samples[179],p95:samples[341],profile,timeline};all.push(row);console.log('PROFILE '+JSON.stringify(row));sim.dispose();
}
await writeFile(resolve(out,'profile.json'),JSON.stringify({node:process.version,cpu:os.cpus()[0]?.model,arch:os.arch(),results:all},null,2));
