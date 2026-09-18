import { PARTS, ports, type Piece, type Scenario, type V3 } from './catalog';
import { materialProperties } from './concrete-materials';
import type { DynamicItem } from './physics';
const HUB_PRIORITY:Record<string,number>={foundation:0,core:1,column:1,wall:2,doorway:2,deck:3,slab:4,stairwell:4,stair:5,truss:5,girder:6,brace:7,facade:8};

export function validateWorldPieceEdit(sim:any,pieces:Piece[],removeIds:number[]=[]){
 const ids=new Set<number>(),removed=new Set(removeIds);
 if(!Array.isArray(pieces)||!Array.isArray(removeIds))throw new Error('Ungültige Bauteiländerung.');
 for(const p of pieces){if(!p||ids.has(p.id)||!Number.isSafeInteger(p.id)||p.id<=0||!PARTS[p.kind]||!Array.isArray(p.p)||p.p.length!==3||p.p.some(n=>!Number.isFinite(n)||Math.abs(n)>490)||!Number.isInteger(p.rotation)||p.rotation<0||p.rotation>3||sim.items.some((i:any)=>i.id===p.id&&!removed.has(i.id)))throw new Error('Ungültige oder doppelte Bauteile.');ids.add(p.id);}
 if(new Set(removeIds).size!==removeIds.length||removeIds.some(id=>!Number.isSafeInteger(id)||id<=0))throw new Error('Ungültige Löschliste.');
 if(!sim.ensureBodyCapacity(pieces.length))throw new Error('Zu viele aktive Physikkörper. Bitte zuerst Objekte entfernen.');
 return true;
}

/** The same assembly path serves initial blueprints and live sandbox additions. */
export function addWorldPieces(sim:any,pieces:Piece[],initial=false){
 if(!pieces.length)return;
 const existing:DynamicItem[]=sim.items,newIds=new Set(pieces.map(p=>p.id));
 validateWorldPieceEdit(sim,pieces);
 const J=sim.J,scenario:Scenario=sim.scenario;
 const previous=new Map<number,Piece>((sim.pieces as Piece[]).map(p=>[p.id,p]));
  const portMap=new Map<string,DynamicItem[]>(),pieceById=new Map(pieces.map(piece=>[piece.id,piece])),portsById=new Map(pieces.map(piece=>[piece.id,ports(piece)])),shapeCache=new Map<string,any>();
  // Reuse only sockets that still exist at their current physical positions.
  if(!initial)for(const item of existing){
   const piece=previous.get(item.id);if(!piece||item.fractured||item.retired)continue;
   const angle=-piece.rotation*Math.PI/2,c=Math.cos(angle),sn=Math.sin(angle);
   for(const port of ports(piece)){
    const dx=port[0]-piece.p[0],dz=port[2]-piece.p[2];
    const world:V3=sim.bodyWorldPoint(item,[c*dx+sn*dz,port[1]-piece.p[1],-sn*dx+c*dz]);
    const key=world.map(n=>Math.round(n*100)).join(','),list=portMap.get(key)??[];list.push(item);portMap.set(key,list);
   }
  }
  for(const p of pieces) {
   const def=PARTS[p.kind];let shape=shapeCache.get(p.kind);
   if(!shape){const cs=new J.StaticCompoundShapeSettings();for(const s of def.segments){const half=new J.Vec3(...s.size.map(n=>n/2)),partShape=new J.BoxShapeSettings(half,.02);J.destroy(half);const pos=new J.Vec3(...s.center),axis=new J.Vec3(0,0,1),partRotation=J.Quat.prototype.sRotation(axis,s.tilt??0);cs.AddShape(pos,partRotation,partShape);J.destroy(pos);J.destroy(partRotation);J.destroy(axis);}const result=cs.Create();shape=result.Get();shape.AddRef();shapeCache.set(p.kind,shape);J.destroy(result);J.destroy(cs);}
   const axis=new J.Vec3(0,1,0); const q=J.Quat.prototype.sRotation(axis,p.rotation*Math.PI/2); J.destroy(axis);
   const body=sim.makeBody(shape,p.p,q,def.mass); J.destroy(q);
   const material=materialProperties(p); const item:DynamicItem={body,id:p.id,kind:p.kind,initial:[...p.p],stress:0,finish:p.finish,concreteStrength:material.concreteStrength,reinforcement:material.reinforcement}; existing.push(item);
   for(const port of portsById.get(p.id)!) { const key=port.map(n=>Math.round(n*100)).join(','); const list=portMap.get(key)??[]; list.push(item); portMap.set(key,list); }
  }
  for(const shape of shapeCache.values())shape.Release();
  const connections=new Map<string,{a:DynamicItem;b:DynamicItem;points:V3[]}>(),collisionPairs=new Set<string>();
  const facadeMounts=new Map<DynamicItem,Map<DynamicItem,V3[]>>();
  for(const [key,items] of portMap) {
   const p=key.split(',').map(n=>Number(n)/100) as V3;
   const ordered=[...new Map(items.map(item=>[item.id,item])).values()].sort((a,b)=>(HUB_PRIORITY[a.kind]??99)-(HUB_PRIORITY[b.kind]??99)||a.id-b.id),hub=ordered[0];
   for(let i=0;i<ordered.length;i++)for(let j=i+1;j<ordered.length;j++)if(newIds.has(ordered[i].id)||newIds.has(ordered[j].id))collisionPairs.add([ordered[i].id,ordered[j].id].sort((a,b)=>a-b).join(':'));
   // Curtainwall panels belong to one supporting member, not the vertical load path.
   for(const panel of ordered.filter(item=>item.kind==='facade'&&newIds.has(item.id))){
    const candidates=facadeMounts.get(panel)??new Map<DynamicItem,V3[]>();facadeMounts.set(panel,candidates);
    for(const support of ordered.filter(item=>item.kind!=='facade')){const points=candidates.get(support)??[];points.push(p);candidates.set(support,points);}
   }
   const connect=(a:DynamicItem,b:DynamicItem)=>{if((!newIds.has(a.id)&&!newIds.has(b.id))||a.kind==='facade'||b.kind==='facade')return;const k=[a.id,b.id].sort((x,y)=>x-y).join(':'),connection=connections.get(k)??{a,b,points:[]};if(!connection.points.some(point=>point.every((v,i)=>v===p[i])))connection.points.push(p);connections.set(k,connection);};
   if((initial?pieces.length:previous.size+pieces.length)<400){for(let i=0;i<ordered.length;i++)for(let j=i+1;j<ordered.length;j++)connect(ordered[i],ordered[j]);}
   else {
    for(const item of ordered.slice(1))connect(hub,item);
    // Sparse hubs must not remove the direct bearing sockets between stacked
    // walls/columns and route their weight through a weaker floor panel instead.
    const bearing=ordered.filter(item=>item.kind==='wall'||item.kind==='doorway'||item.kind==='column'||item.kind==='core');
    for(const below of bearing)if(Math.abs(below.initial[1]+4-p[1])<.01)for(const above of bearing)if(Math.abs(above.initial[1]-p[1])<.01&&(below.kind===above.kind||(['wall','doorway'].includes(below.kind)&&['wall','doorway'].includes(above.kind)))&&below.initial[0]===above.initial[0]&&below.initial[2]===above.initial[2]&&(pieceById.get(below.id)??previous.get(below.id))!.rotation===(pieceById.get(above.id)??previous.get(above.id))!.rotation)connect(below,above);
   }
  }
  for(const [panel,candidates] of facadeMounts){
   // Glazing does not carry the building, but its edges still follow the
   // surrounding frame. Track those edges separately from load-bearing joints.
   sim.glassFrames.set(panel,[...candidates].flatMap(([support,points])=>points.map(point=>({support,panelPoint:sim.bodyLocalPoint(panel,point),supportPoint:sim.bodyLocalPoint(support,point)}))));
   const mounts=[...candidates].map(([support,points])=>({support,points:points.filter(p=>Math.abs(p[1]-panel.initial[1])<.01)})).filter(m=>m.points.length);
   // Top-hung panels remain possible when no bottom socket has a support.
   if(!mounts.length)for(const [support,points] of candidates)mounts.push({support,points});
   mounts.sort((a,b)=>b.points.length-a.points.length||(HUB_PRIORITY[a.support.kind]??99)-(HUB_PRIORITY[b.support.kind]??99)||a.support.id-b.support.id);
   const mount=mounts[0];if(mount){const k=[mount.support.id,panel.id].sort((a,b)=>a-b).join(':');connections.set(k,{a:mount.support,b:panel,points:mount.points});}
  }
  for(const {a,b,points} of connections.values()) {
   const center=points.reduce((sum,p)=>sum.map((v,i)=>v+p[i]/points.length) as V3,[0,0,0] as V3);
   // Road panels attach through bearings rather than moment welds. Multiple
   // pins preserve panel width while allowing each support to carry its load.
   if(a.kind==='deck'||b.kind==='deck')for(const p of points)sim.join(a,b,p,[p],true);
   else sim.join(a,b,center,points);
  }
  const structuralById=new Map(existing.filter(item=>item.id>0).map(item=>[item.id,item]));for(const pair of collisionPairs){const [a,b]=pair.split(':').map(Number),left=structuralById.get(a),right=structuralById.get(b);if(left&&right){sim.filter.DisableCollision(left.body.GetCollisionGroup().GetSubGroupID(),right.body.GetCollisionGroup().GetSubGroupID());
    if(!connections.has(pair)&&(left.kind==='facade'||right.kind==='facade'))for(const [item,peer] of [[left,right],[right,left]]){const peers=sim.facadeClearances.get(item.id)??new Set<DynamicItem>();peers.add(peer);sim.facadeClearances.set(item.id,peers);}
   }}
  for(const item of existing) {
   if(!newIds.has(item.id))continue; const p=pieceById.get(item.id)!;
   const anchors=portsById.get(item.id)!.filter(v=>Math.abs(v[1])<.01 && (scenario==='bridge'?Math.abs(v[0])>=11.99&&Math.abs(v[0])<=34&&Math.abs(v[2])<=14:p.kind==='foundation'&&Math.abs(v[0])<=(sim.rules.sandbox?490:40)&&Math.abs(v[2])<=(sim.rules.sandbox?490:40)));
   if(anchors.length){const center=anchors.reduce((sum,p)=>sum.map((v,i)=>v+p[i]/anchors.length) as V3,[0,0,0] as V3);const support=scenario==='bridge'&&center[0]>0?sim.bodyList[1]:sim.ground;if(scenario==='bridge')for(const p of anchors)sim.join(item,undefined,p,[p],true,support);else sim.join(item,undefined,center,anchors);
    // Embedded bearings and foundations intentionally overlap their support.
    // Contact resolution must not fight the attachment holding them there.
    sim.filter.DisableCollision(item.body.GetCollisionGroup().GetSubGroupID(),support.GetCollisionGroup().GetSubGroupID());
   }
  }
  for(const item of structuralById.values())sim.releaseFacadeClearance(item);
  if(!initial)sim.pieces.push(...structuredClone(pieces));
}

export function removeWorldPieces(sim:any,ids:number[]){
 const remove=new Set(ids),items:DynamicItem[]=sim.items;
 for(const item of items){
  if(!remove.has(item.id))continue;
  // Unpack lab clusters before touching member bodies.
  sim.clusters?.release(item);
  for(const joint of sim.jointNeighbors.get(item.id)??[])sim.breakJoint(joint,true);
  sim.removeRebars(item);
  if(!item.fractured&&!item.retired&&!sim.removedBodies.has(item.body)){sim.bodies.RemoveBody(item.body.GetID());sim.removedBodies.add(item.body);}
  item.fractured=true;item.retired=true;
  sim.glassFrames.delete(item);sim.glassStrain.delete(item.id);sim.facadeClearances.delete(item.id);
 }
 sim.pieces=sim.pieces.filter((p:Piece)=>!remove.has(p.id));
}
