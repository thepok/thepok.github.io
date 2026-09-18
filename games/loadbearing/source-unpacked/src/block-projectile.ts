import type { V3 } from './catalog';

// Nineteen face-connected cells: a compact sphere with the eight cube corners removed.
export function blockProjectileLayout(radius:number) {
 const pitch=radius/Math.sqrt(2*1.5**2+.5**2),size=pitch*.96;
 const cells:{grid:V3;offset:V3;size:V3;sourceKind?:'slab'|'column'|'wall'|'facade';massWeight?:number}[]=[];
 for(let x=-1;x<=1;x++)for(let y=-1;y<=1;y++)for(let z=-1;z<=1;z++){
  if(x*x+y*y+z*z>2)continue;
  cells.push({grid:[x,y,z],offset:[x*pitch,y*pitch,z*pitch],size:[size,size,size]});
 }
 const links:[number,number][]=[];
 for(let a=0;a<cells.length;a++)for(let b=a+1;b<cells.length;b++)if(cells[a].grid.reduce((n,v,i)=>n+Math.abs(v-cells[b].grid[i]),0)===1)links.push([a,b]);
 return {cells,links};
}

export type BuildingProjectileOptions={parts:number;concreteStrength:number;reinforcement:number};
export function normalizeBuildingProjectile(value?:Partial<BuildingProjectileOptions>|null):BuildingProjectileOptions{
 const number=(v:unknown,fallback:number,min:number,max:number)=>typeof v==='number'&&Number.isFinite(v)?Math.max(min,Math.min(max,v)):fallback;
 return {parts:Math.round(number(value?.parts,16,16,320)/16)*16,concreteStrength:number(value?.concreteStrength,1,.25,2.5),reinforcement:number(value?.reinforcement,1,0,2.5)};
}
