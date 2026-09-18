import type {Simulation} from './physics';
import type {V3} from './catalog';
/** Explicit fixed-tick diagnostic using the REAL complete simulation. */
export async function runPhysicsReplay(sim:Simulation,publish:()=>void){
 const pieces=sim.pieces,dt=pieces.length>=400?1/60:1/120;
 const xs=pieces.map(p=>p.p[0]),ys=pieces.map(p=>p.p[1]),zs=pieces.map(p=>p.p[2]);
 const minX=Math.min(...xs),maxX=Math.max(...xs),minZ=Math.min(...zs),top=Math.max(...ys);
 const shots=[{tick:30,p:[minX-18,6,0],v:[70,0,0]},{tick:105,p:[maxX+18,9,0],v:[-70,0,0]},{tick:180,p:[0,top+18,0],v:[0,-75,0]},{tick:240,p:[0,6,minZ-18],v:[0,0,70]}];
 for(let i=0;i<90;i++){sim.step(dt);if(i%10===9)await new Promise<void>(r=>setTimeout(r,0));}
 const samples:number[]=[],timeline:any[]=[];let snapshotMs=0;
 for(let tick=0;tick<600;tick++){
  for(const s of shots)if(tick===s.tick)sim.launchProjectile(s.p as V3,s.v as V3,45000,2);
  const t=performance.now();sim.step(dt);samples.push(performance.now()-t);
  if(tick%60===59){const alive=sim.items.filter(i=>i.id>0&&!i.fractured);timeline.push({tick,broken:sim.broken,fragments:sim.fragments,joints:sim.joints.filter(j=>!j.broken).length,bodies:sim.bodyList.length,active:sim.items.filter(i=>!i.fractured&&i.body.IsActive()).length,meanHeight:alive.reduce((sum,i)=>sum+i.body.GetPosition().GetY(),0)/Math.max(1,alive.length)});}
  if(tick%6===5){const t=performance.now();publish();snapshotMs+=performance.now()-t;await new Promise<void>(r=>setTimeout(r,0));}
 }
 const sorted=[...samples].sort((a,b)=>a-b),mean=samples.reduce((a,b)=>a+b,0)/samples.length;
 const rows=new Float32Array(sim.items.length*14);sim.nativeQueries.writePoses(sim.items,rows);
 return {name:'full-game-bombardment-v1',dt,ticks:600,parts:pieces.length,fragmentLimit:sim.fragmentLimit,core:sim.nativeQueries.enabled?'specialized-native':'original',meanMs:mean,p50Ms:sorted[300],p95Ms:sorted[570],maxMs:sorted.at(-1),physicsThroughput:dt*1000/mean,snapshotMs,upgradedJoints:sim.fixedJointUpgrades,finite:rows.every(Number.isFinite),timeline};
}
