export const WALKER_LOOK_LIMITS = { min: -1.3, max: 1.45 };

/** Looking around is independent of the physical reach of the equipped tool. */
export function walkerWeaponPitch(weapon:'hammer'|'cannon',lookPitch:number){
 const pitch=Number.isFinite(lookPitch)?lookPitch:0;
 return weapon==='hammer'?Math.max(-.55,Math.min(.65,pitch)):Math.max(-1.2,Math.min(1.2,pitch));
}
