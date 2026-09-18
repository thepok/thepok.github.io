import type {Piece} from './catalog';
import * as THREE from 'three';
const CONCRETE=new Set(['column','slab','wall','doorway','foundation','core','stair','stairwell']);
export const isConcrete=(kind:string)=>CONCRETE.has(kind);
const renderColorCache=new Map<string,number>();
export function concreteRenderColor(color:THREE.ColorRepresentation,strength=1):number{
 const s=Number.isFinite(strength)?Math.max(.25,Math.min(2.5,strength)):1;
 const key=`${String(color)}:${s}`,cached=renderColorCache.get(key);if(cached!==undefined)return cached;
 const c=new THREE.Color(color),hsl={h:0,s:0,l:0};c.getHSL(hsl);hsl.l=Math.max(0,Math.min(1,hsl.l*(1-.38*(s-1)/1.5)));c.setHSL(hsl.h,hsl.s,hsl.l);
 const result=c.getHex();renderColorCache.set(key,result);return result;
}
export interface ConcreteProperties {concreteStrength:number;reinforcement:number}
export function materialProperties(piece:{concreteStrength?:number;reinforcement?:number}):ConcreteProperties{
 return {concreteStrength:Number.isFinite(piece.concreteStrength)?Math.max(.25,Math.min(2.5,piece.concreteStrength!)):1,reinforcement:Number.isFinite(piece.reinforcement)?Math.max(0,Math.min(2.5,piece.reinforcement!)):1};
}
// Gameplay profiles, not engineering classes. No additional bodies or links.
const PROFILES:Record<string,[number,number]>={
 'art-deco':[1.2,.8],refinery:[1.1,.65],triumph:[1.5,.25],
 brutalist:[1.35,1.35],pagoda:[1,.55],skybridge:[1.25,1.5],classic:[1.05,1],
};
export function applyBuildingMaterials(pieces:Piece[],style:string,seed:number):Piece[]{
 const [strength,steel]=PROFILES[style]??PROFILES.classic;
 const height=Math.max(4,...pieces.map(p=>p.p[1]));
 return pieces.map(p=>{
  if(!isConcrete(p.kind))return p;
  // Small repeatable storey variation; load-bearing supports stay at least as
  // strong as legacy defaults. Lower supports and cores receive stronger mixes.
  const floor=Math.floor(p.p[1]/4),hash=(Math.imul((seed|0)^floor,1664525)+1013904223)>>>0;
  const variation=.96+(hash%1000)/1000*.08;
  const primary=['foundation','core','column'].includes(p.kind);
  const baseBoost=primary?1+.12*(1-p.p[1]/height):1;
  return {...p,concreteStrength:+Math.min(2.5,Math.max(primary?1:.25,strength*variation*baseBoost*(['wall','doorway'].includes(p.kind)?.85:1))).toFixed(2),reinforcement:+Math.min(2.5,steel*(p.kind==='core'?1.35:1)*variation).toFixed(2)};
 });
}
