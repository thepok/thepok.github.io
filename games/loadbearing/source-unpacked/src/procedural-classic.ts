import { FINISHES, PARTS, type Kind, type Piece, type V3 } from './catalog';
import {withBuildingAccessibility} from './building-accessibility';
import {applyBuildingMaterials} from './concrete-materials';

export interface GeneratedBuilding { pieces:Piece[]; name:string; style:string; target:number; cost:number; height:number; seed:number }

type Cell={x:number;z:number};
const clamp=(n:number,a:number,b:number)=>Math.max(a,Math.min(b,n));
function randomFor(seed:number){let state=(seed||1)>>>0;return()=>{state=(Math.imul(state,1664525)+1013904223)>>>0;return state/4294967296;};}
function shuffled<T>(values:T[],random:()=>number){const copy=[...values];for(let i=copy.length-1;i>0;i--){const j=Math.floor(random()*(i+1));[copy[i],copy[j]]=[copy[j],copy[i]];}return copy;}

export function generateDemolitionBuilding(requested:number,seed=Date.now()):GeneratedBuilding{
 const target=clamp(Math.round(requested),24,1000),random=randomFor(seed),styles=['Kaskaden-Palast','Kristall-Zitadelle','Skygarden-Turm','Terrassen-Megabau'] as const,style=styles[Math.floor(random()*styles.length)];
 const palettes=(
  [['ivory','teal','terracotta','graphite'],['sandstone','teal','ivory','graphite'],['graphite','teal','sandstone','terracotta'],['ivory','sandstone','teal','terracotta']] as (keyof typeof FINISHES)[][]
 ),palette=palettes[Math.floor(random()*palettes.length)];
 const nx=target>=850?6:target>=650?5:target>=400?4:target>=190?3:2,nz=target>=850?5:target>=650?4:target>=330?3:target>=90?2:1,baseCells=nx*nz,fullPerFloor=(nx+1)*(nz+1)+baseCells;
 const floors=clamp(Math.floor((target*.64-baseCells)/fullPerFloor),2,12),xStart=-nx*2,zStart=-nz*2;
 const cellsByFloor:Cell[][]=[];
 for(let floor=0;floor<floors;floor++){
  let left=0,right=0,front=0,back=0;
  const upper=floor-Math.floor(floors*.62);
  if(upper>=0&&nx>=3){if(style==='Kaskaden-Palast'||style==='Terrassen-Megabau')left=Math.min(nx-2,1+Math.floor(upper/3));else right=Math.min(nx-2,1+Math.floor(upper/3));}
  if(upper>=2&&nz>=3){if(style==='Kristall-Zitadelle')front=1;else back=1;}
  const cells:Cell[]=[];for(let ix=left;ix<nx-right;ix++)for(let iz=front;iz<nz-back;iz++)cells.push({x:ix,z:iz});cellsByFloor.push(cells.length?cells:[{x:Math.floor(nx/2),z:Math.floor(nz/2)}]);
 }
 const mandatory:Piece[]=[],skin:Piece[]=[],interior:Piece[]=[],beams:Piece[]=[],crown:Piece[]=[],occupied=new Set<string>();
 const add=(list:Piece[],kind:Kind,p:V3,rotation=0,finish?:keyof typeof FINISHES)=>{const key=`${kind}:${p.join(',')}:${rotation}`;if(occupied.has(key))return;occupied.add(key);list.push({id:0,kind,p,rotation,...(finish?{finish}:{})});};
 const slabFinish=palette[1],frameFinish=palette[0],accentFinish=palette[2];
 for(let ix=0;ix<nx;ix++)for(let iz=0;iz<nz;iz++)add(mandatory,'foundation',[xStart+ix*4,0,zStart+iz*4+2],0,frameFinish);
 for(let floor=0;floor<floors;floor++){
  const y=floor*4,cells=cellsByFloor[floor],vertices=new Set<string>();
  for(const cell of cells){const x=xStart+cell.x*4,z=zStart+cell.z*4;add(mandatory,'slab',[x,y+4,z+2],0,slabFinish);for(const dx of [0,1])for(const dz of [0,1])vertices.add(`${cell.x+dx}:${cell.z+dz}`);}
  for(const vertex of vertices){const [ix,iz]=vertex.split(':').map(Number);add(mandatory,'column',[xStart+ix*4,y,zStart+iz*4],0,frameFinish);}
  const cellKeys=new Set(cells.map(cell=>`${cell.x}:${cell.z}`));
  // Keep a spanning tree of open passages: partitions cannot seal a room off.
  const parent=new Map(cells.map(c=>[c.x+':'+c.z,c.x+':'+c.z]));
  const find=(key:string):string=>{while(parent.get(key)!==key)key=parent.get(key)!;return key;};
  const shared:{a:string;b:string;p:V3;rotation:number}[]=[];
  for(const c of cells){const a=c.x+':'+c.z,x=xStart+c.x*4,z=zStart+c.z*4;
   if(cellKeys.has((c.x+1)+':'+c.z))shared.push({a,b:(c.x+1)+':'+c.z,p:[x+4,y,z],rotation:3});
   if(cellKeys.has(c.x+':'+(c.z+1)))shared.push({a,b:c.x+':'+(c.z+1),p:[x,y,z+4],rotation:0});
  }
  for(const edge of shuffled(shared,random)){const a=find(edge.a),b=find(edge.b);if(a!==b){parent.set(a,b);continue;}
   add(interior,random()<.8?'wall':'facade',edge.p,edge.rotation,frameFinish);
  }
  for(const cell of cells){const x=xStart+cell.x*4,z=zStart+cell.z*4,edges:[number,number,number][]=[];if(!cellKeys.has(`${cell.x}:${cell.z-1}`))edges.push([x,z,0]);if(!cellKeys.has(`${cell.x}:${cell.z+1}`))edges.push([x,z+4,0]);if(!cellKeys.has(`${cell.x-1}:${cell.z}`))edges.push([x,z,3]);if(!cellKeys.has(`${cell.x+1}:${cell.z}`))edges.push([x+4,z,3]);
   for(const [ex,ez,rotation] of edges){const roll=random(),kind:Kind=roll<.62?'facade':roll<.78?'wall':'brace',finish=kind==='facade'?palette[(floor+cell.x+cell.z)%3+1]:kind==='wall'?accentFinish:palette[3];add(skin,kind,[ex,y,ez],rotation,finish);}
   const top=y+4;add(beams,'girder',[x,top,z],0,palette[3]);add(beams,'girder',[x,top,z+4],0,palette[3]);add(beams,'girder',[x,top,z],3,palette[3]);add(beams,'girder',[x+4,top,z],3,palette[3]);
  }
 }
 const roofCells=cellsByFloor.at(-1)!,roofY=floors*4,roofKeys=new Set(roofCells.map(cell=>`${cell.x}:${cell.z}`));
 for(const cell of roofCells){const x=xStart+cell.x*4,z=zStart+cell.z*4;if(!roofKeys.has(`${cell.x}:${cell.z-1}`))add(crown,'truss',[x,roofY,z],0,accentFinish);if(!roofKeys.has(`${cell.x}:${cell.z+1}`))add(crown,'truss',[x,roofY,z+4],0,accentFinish);if(!roofKeys.has(`${cell.x-1}:${cell.z}`))add(crown,'truss',[x,roofY,z],3,accentFinish);if(!roofKeys.has(`${cell.x+1}:${cell.z}`))add(crown,'truss',[x+4,roofY,z],3,accentFinish);}
 const partitions=shuffled(interior,random),reserved=partitions.splice(0,Math.min(partitions.length,Math.round(target*.08),Math.max(0,target-mandatory.length)));
 const optional=[...reserved,...shuffled(skin,random),...shuffled(beams,random),...shuffled(crown,random),...partitions],pieces=[...mandatory];for(const piece of optional){if(pieces.length>=target)break;pieces.push(piece);}
 // Every normal layout has surplus connected detail slots. This fallback only
 // matters at unusual low counts after future catalog changes.
 for(let level=0;pieces.length<target;level++)for(const cell of roofCells){if(pieces.length>=target)break;add(pieces,'column',[xStart+cell.x*4,roofY+level*4,zStart+cell.z*4],0,accentFinish);}
 const accessible=withBuildingAccessibility(pieces, { maxStairs: Infinity, maxPieces: target });
 pieces.splice(0, pieces.length, ...accessible.slice(0, 1000));
 pieces.forEach((piece,index)=>piece.id=index+1);
 const height=Math.max(...pieces.map(piece=>piece.p[1]+(piece.kind==='column'||piece.kind==='wall'||piece.kind==='facade'||piece.kind==='truss'||piece.kind==='brace'?4:0)));
 return {pieces:applyBuildingMaterials(pieces,'classic',seed),name:style,style,target,cost:pieces.reduce((sum,piece)=>sum+PARTS[piece.kind].cost,0),height,seed};
}
