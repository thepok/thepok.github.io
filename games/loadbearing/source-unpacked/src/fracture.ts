import { PARTS, type Piece, type V3 } from './catalog';

export interface FragmentShape { center:V3; size:V3; mass:number; kick:V3; /** Optional local convex prism vertices, centered at center. */ vertices?:V3[] }

function facadeFan(random:()=>number, segment: {center:V3;size:V3}, mass:number):FragmentShape[] {
 // Tile the actual pane in its two wide local axes, including side windows.
 const axes=[0,1,2].sort((a,b)=>segment.size[b]-segment.size[a]);
 const [u,v,n]=axes, halfX=segment.size[u]/2, halfY=segment.size[v]/2;
 const cx=(.08+random()*.1)*(random()<.5?-1:1)*segment.size[u], cy=(.08+random()*.1)*(random()<.5?-1:1)*segment.size[v], depth=segment.size[n]/2;
 const map=(x:number,y:number,z:number):V3=>{const p:V3=[0,0,0];p[u]=x;p[v]=y;p[n]=z;return p;};
 const edgeA=-.78+random()*.46, edgeB=.54+random()*.34;
 const boundary:V3[]=[[-halfX,-halfY,0],[edgeA*halfX,-halfY,0],[halfX,-halfY,0],[halfX,halfY,0],[edgeB*halfX,halfY,0],[-halfX,halfY,0]];
 const result:FragmentShape[]=[];
 for(let i=0;i<boundary.length;i++){
  const next=boundary[(i+1)%boundary.length];
  const a=Math.abs((boundary[i][0]-cx)*(next[1]-cy)-(next[0]-cx)*(boundary[i][1]-cy))/2;
  const triangle:[[number,number],[number,number],[number,number]]=[[cx,cy],[boundary[i][0],boundary[i][1]],[next[0],next[1]]];
  const center:V3=[triangle.reduce((sum,p)=>sum+p[0],0)/3,triangle.reduce((sum,p)=>sum+p[1],0)/3,0], points:V3[]=[];
  // Store a closed triangular prism around the centroid. Physics and rendering
  // can therefore use the exact same convex footprint.
  for(const z of [-depth,depth])for(const p of triangle)points.push([p[0]-center[0],p[1]-center[1],z]);
  const xs=triangle.map(p=>Math.abs(p[0]-center[0])),ys=triangle.map(p=>Math.abs(p[1]-center[1]));
  result.push({center:map(center[0],center[1],0).map((x,i)=>x+segment.center[i]) as V3,size:map(Math.max(...xs)*2,Math.max(...ys)*2,segment.size[n]),mass:mass*a/(segment.size[u]*segment.size[v]),kick:[(random()-.5)*2,(random()-.25)*1.5,(random()-.5)*2],vertices:points.map(p=>map(...p))});
 }
 // Correct floating-point mass residue without changing the tile.
 result.at(-1)!.mass+=mass-result.reduce((sum,part)=>sum+part.mass,0);
 const mean=result.reduce((sum,f)=>sum.map((v,a)=>v+f.kick[a]*f.mass/mass) as V3,[0,0,0] as V3);
 for(const f of result)f.kick=f.kick.map((v,a)=>v-mean[a]) as V3;
 return result;
}

/** Six uneven blocks fill the original brittle panel/column. Steel bends apart as a module. */
export function fractureShapes(piece:Piece, override?:{center:V3;size:V3;mass:number}):FragmentShape[] {
 if(!['column','wall','slab','deck','facade'].includes(piece.kind))return [];
 const def=PARTS[piece.kind],segment=def.segments[0];
 const axes=[0,1,2].sort((a,b)=>segment.size[b]-segment.size[a]);
 const cuts=[[0,.29,.64,1],[0,.46,1]];
 const result:FragmentShape[]=[];
 let seed=piece.id*7919+17;
 const random=()=>{seed=(Math.imul(seed,1664525)+1013904223)>>>0;return seed/4294967296;};
 if(piece.kind==='facade')return facadeFan(random,override??segment,override?.mass??def.mass);
 for(let i=0;i<3;i++)for(let j=0;j<2;j++){
  const center=[...segment.center] as V3,size=[...segment.size] as V3;
  let fraction=1;
  for(const [n,k] of [i,j].entries()){
   const axis=axes[n],lo=cuts[n][k],hi=cuts[n][k+1];
   center[axis]+=(lo+(hi-lo)/2-.5)*segment.size[axis];size[axis]*=(hi-lo);fraction*=hi-lo;
  }
  const speed=1.8;
  const kick:[number,number,number]=[(random()-.5)*speed*2,(random()-.25)*speed,(random()-.5)*speed*2];
  result.push({center,size:size.map(v=>v*.94) as V3,mass:def.mass*fraction,kick});
 }
 // Opposing impulses scatter debris without adding net linear momentum.
 const mean=result.reduce((sum,f)=>sum.map((v,a)=>v+f.kick[a]*f.mass/def.mass) as V3,[0,0,0] as V3);
 for(const f of result)f.kick=f.kick.map((v,a)=>v-mean[a]) as V3;
 return result;
}

export function rotateByQuaternion(v:V3,q:number[]):V3 {
 const [x,y,z]=v,[qx,qy,qz,qw]=q;
 const tx=2*(qy*z-qz*y),ty=2*(qz*x-qx*z),tz=2*(qx*y-qy*x);
 return [x+qw*tx+qy*tz-qz*ty,y+qw*ty+qz*tx-qx*tz,z+qw*tz+qx*ty-qy*tx];
}
