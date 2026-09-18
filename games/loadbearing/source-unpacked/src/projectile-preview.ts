import { PARTS, type V3 } from './catalog';
import { concreteRenderColor } from './concrete-materials';
import { storeyProjectileLayout } from './storey-projectile';
import type { BuildingProjectileOptions } from './block-projectile';

/** Demand-rendered isometric view; shares the physical layout without another WebGL context. */
export function installProjectilePreview(host:HTMLElement){
 const figure=document.createElement('figure');figure.className='projectile-preview';
 figure.innerHTML='<canvas tabindex="0" role="img" aria-label="Vorschau des Hausgeschosses" title="Vorschau des tatsächlichen Hausgeschosses. Ziehen dreht die Ansicht."></canvas><figcaption></figcaption><small>Ziehen zum Drehen · Bewehrung <span></span></small>';
 host.prepend(figure);
 const canvas=figure.querySelector('canvas')!,caption=figure.querySelector('figcaption')!,steel=figure.querySelector('span')!,ctx=canvas.getContext('2d')!;
 let options:BuildingProjectileOptions={parts:16,concreteStrength:1,reinforcement:1},layout=storeyProjectileLayout(16),yaw=-.65,pending=false,drag:{id:number;x:number;yaw:number}|undefined;
 const projection=(point:V3)=>{
  const [x,y,z]=point,c=Math.cos(yaw),s=Math.sin(yaw),rx=c*x+s*z,rz=-s*x+c*z;
  return [rx,-y*.88-rz*.48,-y*.48+rz*.88] as V3;
 };
 const faces=[[0,1,3,2],[4,6,7,5],[0,4,5,1],[2,3,7,6],[0,2,6,4],[1,5,7,3]];
 const draw=()=>{
  pending=false;const width=Math.max(180,Math.round(figure.clientWidth||220)),height=Math.round(width*.76),dpr=Math.min(devicePixelRatio||1,2);
  canvas.width=Math.round(width*dpr);canvas.height=Math.round(height*dpr);ctx.setTransform(dpr,0,0,dpr,0,0);ctx.clearRect(0,0,width,height);
  const polygons:{points:V3[];depth:number;color:string;glass:boolean;shade:number}[]=[],all:V3[]=[];
  for(const cell of layout.cells){
   const vertices:V3[]=[];for(const x of [-1,1])for(const y of [-1,1])for(const z of [-1,1])vertices.push(projection(cell.offset.map((v,i)=>v+[x,y,z][i]*cell.size[i]/2) as V3));
   all.push(...vertices);const glass=cell.sourceKind==='facade',hex=glass?0x84c1cb:concreteRenderColor(PARTS[cell.sourceKind].color,options.concreteStrength),color='#'+hex.toString(16).padStart(6,'0');
   faces.forEach(indices=>{const points=indices.map(i=>vertices[i]);const a=points[0],b=points[1],c=points[2];if((b[0]-a[0])*(c[1]-a[1])-(b[1]-a[1])*(c[0]-a[0])<=0)return;polygons.push({points,depth:points.reduce((n,p)=>n+p[2],0)/4,color,glass,shade:Math.min(.23,Math.abs(b[1]-a[1])*.035)});});
  }
  const minX=Math.min(...all.map(p=>p[0])),maxX=Math.max(...all.map(p=>p[0])),minY=Math.min(...all.map(p=>p[1])),maxY=Math.max(...all.map(p=>p[1]));
  const scale=Math.min((width-24)/(maxX-minX),(height-22)/(maxY-minY));
  const screen=(p:V3)=>[(p[0]-(minX+maxX)/2)*scale+width/2,(p[1]-(minY+maxY)/2)*scale+height/2];
  polygons.sort((a,b)=>b.depth-a.depth);
  for(const face of polygons){const points=face.points.map(screen);ctx.beginPath();points.forEach(([x,y],i)=>i?ctx.lineTo(x,y):ctx.moveTo(x,y));ctx.closePath();ctx.fillStyle=face.color;ctx.globalAlpha=face.glass?.55:1;ctx.fill();ctx.globalAlpha=1;if(!face.glass){ctx.fillStyle=`rgba(20,40,48,${face.shade})`;ctx.fill();}ctx.strokeStyle=face.glass?'rgba(93,144,159,.5)':'rgba(73,89,94,.25)';ctx.lineWidth=.5;ctx.stroke();}
  const level=options.reinforcement<=0?0:options.reinforcement<=.65?1:options.reinforcement<=1.3?2:3;
  steel.textContent=`${'▰'.repeat(level)||'—'} ${options.reinforcement.toFixed(2)}×`;
  caption.textContent=`${layout.count} Teile · ${(layout.mass/1000).toFixed(2)} t · Beton ${options.concreteStrength.toFixed(2)}×`;
  canvas.setAttribute('aria-label',`${caption.textContent}; Bewehrung ${options.reinforcement.toFixed(2)}×. Ziehen zum Drehen.`);
  canvas.dataset.parts=String(layout.count);canvas.dataset.strength=String(options.concreteStrength);canvas.dataset.reinforcement=String(options.reinforcement);
 };
 const schedule=()=>{if(!pending){pending=true;requestAnimationFrame(draw)}};
 canvas.addEventListener('pointerdown',event=>{if(event.button!==0)return;event.stopPropagation();drag={id:event.pointerId,x:event.clientX,yaw};canvas.setPointerCapture(event.pointerId)});
 canvas.addEventListener('pointermove',event=>{if(drag?.id!==event.pointerId)return;event.preventDefault();event.stopPropagation();yaw=drag.yaw+(event.clientX-drag.x)*.012;schedule()});
 const release=(event:PointerEvent)=>{if(drag?.id===event.pointerId){drag=undefined;event.stopPropagation();}};
 canvas.addEventListener('pointerup',release);canvas.addEventListener('pointercancel',release);canvas.addEventListener('lostpointercapture',()=>drag=undefined);
 new ResizeObserver(schedule).observe(figure);
 return {update(next:BuildingProjectileOptions){if(next.parts!==options.parts)layout=storeyProjectileLayout(next.parts);options={...next};schedule();}};
}
