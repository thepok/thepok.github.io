import { FINISHES, PARTS, type Kind, type Piece, type V3 } from './catalog';
import {generateDemolitionBuilding as generateClassic} from './procedural-classic';
import {withBuildingAccessibility} from './building-accessibility';
import {applyBuildingMaterials} from './concrete-materials';
export type BuildingStyle='art-deco'|'refinery'|'triumph'|'brutalist'|'pagoda'|'skybridge'|'classic';
export const BUILDING_STYLES:{id:BuildingStyle;name:string;description:string}[]=[
 {id:'art-deco',name:'Art déco',description:'Symmetrische Hochhäuser mit gestaffelten Schultern, hellen Pfeilern und goldener Krone. Fester Beton, mittlere Bewehrung.'},
 {id:'refinery',name:'Raffinerie',description:'Offene Industrietürme, verkleidete Prozessbehälter, Stahlstege und Leitungsbrücken. Robuster Beton, leichte Bewehrung.'},
 {id:'triumph',name:'Triumphbogen',description:'Zwei massive Pfeiler, eine freie Durchfahrt und ein breiter, gestufter Monumentaufsatz. Sehr fester Beton mit wenig Bewehrung: spröde Brüche.'},
 {id:'brutalist',name:'Brutalismus',description:'Schwere Betonblöcke mit asymmetrischen Rücksprüngen und tiefen Fensterbändern. Fester Beton mit starker Bewehrung.'},
 {id:'pagoda',name:'Pagodenturm',description:'Gestaffelte, breite Dachebenen mit roten Stützen und einer schlanken Turmspitze. Normaler Beton mit leichter Bewehrung.'},
 {id:'skybridge',name:'Skybridge-Türme',description:'Gläserne Zwillingstürme mit erhöhten Verbindungsbrücken und freiem Raum darunter. Fester Beton mit besonders starker Bewehrung.'},
 {id:'classic',name:'Klassisch',description:'Die bisherigen Terrassenhäuser und Hochhäuser mit zufälligen Innenwänden. Ausgewogener Beton und Bewehrung.'},
];
export interface GeneratedBuilding{pieces:Piece[];name:string;style:BuildingStyle;target:number;cost:number;height:number;seed:number}
type Cell={x:number;z:number};type Finish=keyof typeof FINISHES;
const key=(c:Cell)=>`${c.x}:${c.z}`;
const rect=(w:number,d:number,x=0,z=0):Cell[]=>Array.from({length:w*d},(_,i)=>({x:x+Math.floor(i/d),z:z+i%d}));
function rng(seed:number){let s=seed>>>0;return()=>((s=(Math.imul(s,1664525)+1013904223)>>>0)/4294967296);}
function shuffle<T>(a:T[],r:()=>number){for(let i=a.length-1;i>0;i--){const j=Math.floor(r()*(i+1));[a[i],a[j]]=[a[j],a[i]];}return a;}
function layout(style:BuildingStyle,size:number,seed:number):Cell[][]{
 const random=rng(seed),rows:Cell[][]=[],variation=random();
 if(style==='triumph'||style==='skybridge'){
  // Tall twin towers need broad piers; glazing does not carry upper-storey weight.
  const pier=size<6?1:size>=12&&style==='skybridge'?3:2,depth=size<4?1:style==='triumph'&&size>=15?3:style==='skybridge'&&size>=12?3:2,gap=size<4?1:size<10?2:variation<.5?2:3,w=2*pier+gap;
  const floors=2+Math.floor(size*(style==='triumph'?.45:.6)),bridge=style==='triumph'?floors-1:Math.max(1,Math.floor(floors*(.55+variation*.2)));
  const piers=[...rect(pier,depth),...rect(pier,depth,pier+gap)];
  for(let f=0;f<floors;f++)rows.push(style==='triumph'&&f>=bridge?rect(w,depth):style==='skybridge'&&(f===bridge||(size>10&&f===bridge-3))?[...piers,...rect(gap,1,pier,Math.floor((depth-1)/2))]:piers);
 }else if(style==='refinery'){
  const w=size<3?1:size<7?3:5,d=size<5?1:3,floors=2+Math.floor(size*.7),heights=new Map<string,number>();
  for(const c of rect(w,d))heights.set(key(c),c.x%2===0&&c.z%2===0?Math.max(2,floors-Math.floor(random()*3)):1);
  for(let f=0;f<floors;f++)rows.push(rect(w,d).filter(c=>heights.get(key(c))!>f||(f===Math.floor(floors/2)&&c.z===0)));
 }else{
  const w=size<3?1:size<7?3:style==='pagoda'&&size>=14?7:5,d=style==='pagoda'?w:size<5?1:3,floors=style==='pagoda'?2+Math.floor(size*.6):2+Math.floor(size*(style==='brutalist'?.6:style==='art-deco'?.65:.8));
  const alternate=random()<.5;
  for(let f=0;f<floors;f++){
   let cells=rect(w,d);
   if(style==='art-deco'||style==='pagoda'){
    const stage=style==='pagoda'?Math.floor(f/(variation<.5?3:4)):f>=floors-2?2:f>=Math.floor(floors*(.45+variation*.2))?1:0;
    const ix=Math.min(Math.floor((w-1)/2),stage),iz=Math.min(Math.floor((d-1)/2),style==='pagoda'?stage:Math.max(0,stage-1));cells=rect(w-ix*2,d-iz*2,ix,iz);
   }else if(style==='brutalist'&&w>1){const inset=f>=Math.floor(floors*.55)?1:0;cells=rect(w-inset,d,alternate?inset:0);if(d>1&&f>=floors-2)cells=cells.filter(c=>c.z<(alternate?2:1));}
   rows.push(cells);
  }
 }
 return rows.filter(c=>c.length);
}
function assemble(style:BuildingStyle,rows:Cell[][],seed:number,budget:number){
 const random=rng(seed),base:Piece[]=[],signature:Piece[]=[],skin:Piece[]=[],interior:Piece[]=[],details:Piece[]=[],seen=new Set<string>();
 const warm=random()<.5;
 const frame:Finish=style==='pagoda'?'terracotta':style==='refinery'?'graphite':style==='brutalist'?'graphite':warm?'ivory':'sandstone';
 const surface:Finish=style==='pagoda'?'graphite':style==='triumph'?'sandstone':style==='refinery'?'graphite':style==='brutalist'?'ivory':'teal';
 const accent:Finish=style==='pagoda'?'sandstone':style==='refinery'?'terracotta':'sandstone';
 const add=(list:Piece[],kind:Kind,p:V3,rotation=0,finish:Finish=frame)=>{const k=`${kind}:${p.join(',')}:${rotation}`;if(seen.has(k))return;seen.add(k);list.push({id:0,kind,p,rotation,finish});};
 const floorKind:Kind=style==='refinery'?'deck':'slab';
 const coreCells:Cell[]=[];
 if(rows.length>=10&&['art-deco','brutalist','skybridge'].includes(style)){
  const permanent=rows[0].filter(c=>rows.every(row=>row.some(cell=>key(cell)===key(c))));
  if(style==='skybridge'){
   const middle=(Math.min(...permanent.map(c=>c.x))+Math.max(...permanent.map(c=>c.x)))/2;
   for(const group of [permanent.filter(c=>c.x<middle),permanent.filter(c=>c.x>middle)])if(group.length)coreCells.push(group[Math.floor(group.length/2)]);
  }else if(permanent.length)coreCells.push(permanent[Math.floor(permanent.length/2)]);
 }
 // Wide Art deco podiums carry three continuous core lines. Side cores end
 // at the first setback; the permanent central shaft continues to the crown.
 const podiumCores:Cell[]=[];
 let podiumFloors=0;
 if(style==='art-deco'&&budget>750&&coreCells.length){
  const footprint=rows[0],xs=footprint.map(c=>c.x),minX=Math.min(...xs),maxX=Math.max(...xs);
  const centreZ=coreCells[0].z;
  if(maxX-minX>=2){
   for(const x of [minX,maxX]){
    const cell=footprint.find(c=>c.x===x&&c.z===centreZ);
    if(cell&&!coreCells.some(core=>key(core)===key(cell)))podiumCores.push(cell);
   }
   podiumFloors=rows.findIndex(row=>row.length!==footprint.length||!footprint.every(c=>row.some(q=>key(q)===key(c))));
   if(podiumFloors<0)podiumFloors=rows.length;
  }
 }
 for(const c of rows[0])add(base,'foundation',[c.x*4,0,c.z*4+2],0,frame);
 rows.forEach((cells,f)=>{
  const keys=new Set(cells.map(key)),previous=new Set((rows[f-1]??[]).map(key)),previousVertices=new Set((rows[f-1]??[]).flatMap(c=>[key(c),key({x:c.x+1,z:c.z}),key({x:c.x,z:c.z+1}),key({x:c.x+1,z:c.z+1})])),y=f*4;
  // A newly introduced bridge bay rests on a continuous deck and full-height side trusses.
  if(f)for(const c of cells)if(!previous.has(key(c))&&![key(c),key({x:c.x+1,z:c.z}),key({x:c.x,z:c.z+1}),key({x:c.x+1,z:c.z+1})].every(k=>previousVertices.has(k))){add(base,floorKind,[c.x*4,y,c.z*4+2],0,surface);for(const z of [c.z*4,c.z*4+4])add(base,'truss',[c.x*4,y,z],0,accent);}
  const vertices=new Set(cells.flatMap(c=>[key(c),key({x:c.x+1,z:c.z}),key({x:c.x,z:c.z+1}),key({x:c.x+1,z:c.z+1})]));
  for(const v of vertices){const [x,z]=v.split(':').map(Number);add(base,'column',[x*4,y,z*4],0,frame);}
  for(const c of cells)add(base,floorKind,[c.x*4,y+4,c.z*4+2],0,surface);
  // Continuous elevator cores are primary structure, so random cladding cannot
  // leave upper-storey loads resting on isolated floor panels or glass frames.
  // Permanent cores use one hollow, reinforced part per storey. Its front
  // opening keeps the stair and elevator shaft reachable while the continuous
  // side and rear walls tie the floor loads together.
  for(const core of coreCells)add(base,'core',[core.x*4,y,core.z*4],0,frame);
  if(f<podiumFloors)for(const core of podiumCores)add(base,'core',[core.x*4,y,core.z*4],0,frame);
  for(const c of cells){const x=c.x*4,z=c.z*4,edges:[number,number,number][]=[];
   if(!keys.has(key({x:c.x,z:c.z-1})))edges.push([x,z,0]);if(!keys.has(key({x:c.x,z:c.z+1})))edges.push([x,z+4,0]);
   if(!keys.has(key({x:c.x-1,z:c.z})))edges.push([x,z,3]);if(!keys.has(key({x:c.x+1,z:c.z})))edges.push([x+4,z,3]);
   for(const [ex,ez,rot] of edges){
    const roll=random();let kind:Kind=style==='refinery'?'truss':style==='triumph'?'wall':style==='brutalist'?(roll<.78?'wall':'facade'):style==='pagoda'?(roll<.3?'wall':'truss'):'facade';
    // Clad a few industrial lower bays as process vessels, leaving the upper frames open.
    if(style==='refinery'&&f<2&&(c.x+c.z)%4===0)kind='wall';
    add(skin,kind,[ex,y,ez],rot,kind==='wall'?(style==='triumph'?frame:style==='refinery'?'ivory':surface):frame);
    const next=rows[f+1]??[],setback=!next.some(n=>key(n)===key(c));
    if(style==='pagoda'&&(f%3===2||setback))add(signature,'truss',[ex,y+4,ez],rot,accent);
    if(style==='art-deco'&&setback)add(signature,'girder',[ex,y+4,ez],rot,accent);
    add(details,'girder',[ex,y+4,ez],rot,accent);
   }
   for(const [ex,ez,rot] of [[x,z,0],[x,z+4,0],[x,z,3],[x+4,z,3]])add(details,'girder',[ex,y+4,ez],rot,accent);
  }
  if(['art-deco','brutalist','skybridge'].includes(style)){
   const parent=new Map(cells.map(c=>[key(c),key(c)]));const find=(k:string):string=>{while(parent.get(k)!==k)k=parent.get(k)!;return k;};
   const edges:{a:string;b:string;p:V3;r:number}[]=[];
   for(const c of cells){if(keys.has(key({x:c.x+1,z:c.z})))edges.push({a:key(c),b:key({x:c.x+1,z:c.z}),p:[c.x*4+4,y,c.z*4],r:3});if(keys.has(key({x:c.x,z:c.z+1})))edges.push({a:key(c),b:key({x:c.x,z:c.z+1}),p:[c.x*4,y,c.z*4+4],r:0});}
   for(const edge of shuffle(edges,random)){const a=find(edge.a),b=find(edge.b);if(a!==b){parent.set(a,b);continue;}add(interior,random()<.8?'wall':'facade',edge.p,edge.r,frame);}
  }
 });
 const roof=rows.at(-1)!,y=rows.length*4;
 if(style==='triumph'){
  const below=rows[rows.length-2],xs=[...new Set(below.map(c=>c.x))].sort((a,b)=>a-b),left=xs.find((x,i)=>i<xs.length-1&&xs[i+1]>x+1);
  if(left!==undefined){const right=xs.find(x=>x>left+1)!,front=Math.min(...below.map(c=>c.z))*4,back=(Math.max(...below.map(c=>c.z))+1)*4;
   for(const z of [front,back]){add(signature,'brace',[(left+1)*4,y-8,z],0,accent);add(signature,'brace',[right*4,y-8,z],2,accent);}
   for(let x=left+1;x<right;x++){for(const z of [front,back])add(signature,'wall',[x*4,y,z],0,accent);for(let z=front;z<back;z+=4)add(signature,'slab',[x*4,y+4,z+2],0,accent);}
  }
 }

 if(style==='art-deco'||style==='pagoda'){
  const c=roof[Math.floor(roof.length/2)];for(const z of [c.z*4,c.z*4+4])add(signature,'truss',[c.x*4,y,z],0,accent);
  add(signature,'column',[c.x*4,y,c.z*4],0,accent);
 }
 // Interior pieces share the budget; primary structure is never truncated.
 if(style==='triumph'&&budget>=100){base.push(...signature.splice(0),...skin.splice(0));}
 const partitions=shuffle(interior,random),reserved=partitions.splice(0,Math.round(base.length*.125));
 return {base,optional:[...signature,...reserved,...shuffle(skin,random),...shuffle(details,random),...partitions]};
}
export function generateDemolitionBuilding(requested:number,seed=Date.now(),requestedStyle:BuildingStyle|'random'='random'):GeneratedBuilding{
 const target=Math.max(24,Math.min(1000,Math.round(Number.isFinite(requested)?requested:500)));
 const ids=BUILDING_STYLES.map(s=>s.id),random=rng(seed),style=ids.includes(requestedStyle as BuildingStyle)?requestedStyle as BuildingStyle:ids[Math.floor(random()*6)];
 if(style==='classic')return {...generateClassic(target,seed),style};
 let selected:ReturnType<typeof assemble>|undefined,score=Infinity;
 for(let size=0;size<=20;size++){
  const built=assemble(style,layout(style,size,seed),seed,target);if(built.base.length>target)continue;
  const total=built.base.length+built.optional.length,shortfall=Math.max(0,target-total)/target,cost=shortfall*4+Math.abs(built.base.length/target-.64);
  if(cost<score){score=cost;selected=built;}
 }
 if(!selected)throw new Error('No complete structural layout fits this budget');
 const pieces=withBuildingAccessibility([...selected.base,...selected.optional.slice(0,Math.max(0,target-selected.base.length))], { maxStairs: Infinity, maxPieces: target });
 // Center the entire assembly without changing port alignment.
 const xs=pieces.map(p=>p.p[0]),zs=pieces.map(p=>p.p[2]),dx=(Math.min(...xs)+Math.max(...xs))/2,dz=(Math.min(...zs)+Math.max(...zs))/2;
 pieces.forEach((p,i)=>{p.id=i+1;p.p=[p.p[0]-dx,p.p[1],p.p[2]-dz];});
 const height=Math.max(...pieces.map(p=>p.p[1]+(['column','wall','facade','truss','brace'].includes(p.kind)?4:0)));
 return {pieces:applyBuildingMaterials(pieces,style,seed),name:BUILDING_STYLES.find(s=>s.id===style)!.name,style,target,cost:pieces.reduce((n,p)=>n+PARTS[p.kind].cost,0),height,seed};
}

