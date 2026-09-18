import { PARTS, rotate, type Piece, type V3 } from './catalog';

/**
 * Accessibility geometry is deliberately made from catalog parts so the same
 * conversion works for hand-authored showcases and procedural buildings.
 * A stair is a 4 m rise: twenty 200 mm risers, 1.2 m clear width.  The
 * stairwell replaces its slab, leaving a real shaft instead of putting stairs
 * through a solid collider.
 */
export const ACCESSIBILITY = {
  stairRise: 4,
  risers: 20,
  riserHeight: .2,
  clearWidth: 1.2,
  headroom: 1.8,
} as const;

const clone = (p: Piece): Piece => ({ ...p, p: [...p.p] as V3 });
const samePlace = (a: Piece, b: Piece) => a.kind === b.kind && a.p.every((v, i) => v === b.p[i]) && a.rotation === b.rotation;

export interface AccessibilityOptions {
  /** Add one exterior entrance when a lower-storey facade/wall is available. */
  entrance?: boolean;
  /** Add one stair run for each occupied upper floor, by default true. */
  stairs?: boolean;
  /** Limit extra stair runs for very small budget previews. */
  maxStairs?: number;
  maxPieces?: number;
}

/**
 * Convert a finished layout into a walkable one. Existing slabs are removed at
 * stair locations and replaced with a framed opening plus the matching stair;
 * facade/wall panels are replaced by a doorway, so neither opening is blocked.
 */
export function withBuildingAccessibility(input: Piece[], options: AccessibilityOptions = {}): Piece[] {
  const entrance = options.entrance !== false;
  const stairs = options.stairs !== false;
  const maxStairs = options.maxStairs ?? Infinity;
  if(input.some(p=>p.kind==='stair'))return input.map(clone);
  const pieces = input.map(clone);

  if (entrance) {
    const candidates = pieces
      .filter(p => (p.kind === 'facade' || p.kind === 'wall') && p.p[1] === 0)
      .sort((a, b) => (a.kind === 'facade' ? -1 : 1) - (b.kind === 'facade' ? -1 : 1));
    const panel = candidates[0];
    if (panel) {
      const index = pieces.indexOf(panel);
      pieces.splice(index, 1, { ...panel, id: panel.id, kind: 'doorway', p: [...panel.p] as V3, rotation: panel.rotation, finish: panel.finish });
    } else {
      // Small generated budgets may omit optional facade panels. Still create
      // a real front door against the footprint rather than silently producing
      // an inaccessible shell.
      const lower = pieces.filter(p => p.p[1] === 0);
      if (lower.length) {
        const minX = Math.min(...lower.map(p => p.p[0]));
        const minZ = Math.min(...lower.map(p => p.p[2]));
        pieces.push({ id: Math.max(0, ...pieces.map(p => p.id)) + 1, kind: 'doorway', p: [minX, 0, minZ], rotation: 0, finish: 'sandstone' });
      }
    }
  }

  if (stairs) {
    // One run per floor level. Prefer the slab nearest the building's centre,
    // which keeps the shaft away from edge cantilevers and facade geometry.
    const slabs = pieces.filter(p => p.kind === 'slab' || p.kind === 'deck');
    const levels = [...new Set(slabs.map(p => p.p[1]).filter(y => y > 0))].sort((a, b) => a - b);
    let made = 0;let previous:Piece[]=[];
    for (const level of levels) {
      if (made >= maxStairs) break;
      const atLevel = slabs.filter(p => p.p[1] === level);
      if (!atLevel.length) continue;
      const unseen=new Set(atLevel),components:Piece[][]=[];
      while(unseen.size){const group=[unseen.values().next().value!];unseen.delete(group[0]);for(let i=0;i<group.length;i++)for(const q of unseen){if(Math.abs(q.p[0]-group[i].p[0])+Math.abs(q.p[2]-group[i].p[2])<4.01){unseen.delete(q);group.push(q);}}components.push(group);}
      const next:Piece[]=[];
      for(const component of components){
      const atLevel=component;
      const cx = atLevel.reduce((sum, p) => sum + p.p[0], 0) / atLevel.length;
      const cz = atLevel.reduce((sum, p) => sum + p.p[2], 0) / atLevel.length;
      const slab = atLevel.find(p=>previous.some(q=>p.p[0]===q.p[0]&&p.p[2]===q.p[2]&&p.rotation===q.rotation))??atLevel.slice().sort((a, b) => (a.p[0] - cx) ** 2 + (a.p[2] - cz) ** 2 - ((b.p[0] - cx) ** 2 + (b.p[2] - cz) ** 2))[0];
      const index = pieces.findIndex(p => samePlace(p, slab));
      if (index < 0) continue;
      // A core partition at the selected bay would seal the shaft. Remove
      // only coincident interior wall/brace pieces; perimeter facade remains.
      for (let i = pieces.length - 1; i >= 0; i--) {
        const q = pieces[i];
        if ((q.kind === 'wall' || q.kind === 'brace') && q.p[0] === slab.p[0] && q.p[2] === slab.p[2] && q.p[1] >= level - 4 && q.p[1] <= level) pieces.splice(i, 1);
      }
      const slabIndex = pieces.findIndex(p => samePlace(p, slab));
      if (slabIndex < 0) continue;
      // Stairwell's side beams are at z=±1.55, leaving a 2.6 m shaft for the
      // two 1.2 m switchback flights and their 1 m intermediate landing.
      pieces.splice(slabIndex, 1, { ...slab, id: slab.id, kind: 'stairwell', p: [...slab.p] as V3, rotation: slab.rotation, finish: slab.finish });
      const stairId = Math.max(0, ...pieces.map(p => p.id)) + 1;
      pieces.push({ ...slab, id: stairId, kind: 'stair', p: [slab.p[0], level - 4, slab.p[2]], rotation: slab.rotation, finish: slab.finish });
      next.push(slab);made++;
      }
      previous=next;
    }
  }
  // Interior partitions need doors as well; otherwise a closed concrete core
  // can contain a staircase that nobody can reach from the occupied floor.
  for(const piece of pieces){
    if(piece.kind!=='wall')continue;
    const floors=pieces.filter(p=>(p.kind==='slab'||p.kind==='stairwell'||p.kind==='foundation')&&Math.abs(p.p[1]-piece.p[1])<.01);
    if(!floors.length)continue;
    const corners=floors.flatMap(p=>[[0,0,-2],[4,0,-2],[0,0,2],[4,0,2]].map(v=>{const q=rotate(v as V3,p.rotation);return [p.p[0]+q[0],p.p[2]+q[2]];}));
    const c=rotate([2,0,0],piece.rotation),x=piece.p[0]+c[0],z=piece.p[2]+c[2];
    if(x>Math.min(...corners.map(p=>p[0]))+.1&&x<Math.max(...corners.map(p=>p[0]))-.1&&z>Math.min(...corners.map(p=>p[1]))+.1&&z<Math.max(...corners.map(p=>p[1]))-.1)piece.kind='doorway';
  }
  if (options.maxPieces !== undefined && pieces.length > options.maxPieces) {
    const removable = new Set(['facade', 'brace', 'girder', 'truss', 'wall']);
    for (let i = pieces.length - 1; i >= 0 && pieces.length > options.maxPieces; i--) {
      if (removable.has(pieces[i].kind)) pieces.splice(i, 1);
    }
    // If a tiny custom layout still exceeds the cap, preserve every access
    // part and remove the least structural tail as a final deterministic pass.
    for (let i = pieces.length - 1; i >= 0 && pieces.length > options.maxPieces; i--) {
      if (!['doorway', 'stairwell', 'stair'].includes(pieces[i].kind)) pieces.splice(i, 1);
    }
  }
  return pieces.map((p, i) => ({ ...p, id: i + 1 }));
}

export function accessibilityCost(pieces: Piece[]): number {
  return pieces.reduce((sum, piece) => sum + PARTS[piece.kind].cost, 0);
}

export interface WalkingEntry {
  doorway: Piece;
  spawn: V3;
  inside: V3;
}

/** Find the outside face of the generated doorway and return a feet-position spawn. */
export function walkingEntry(pieces: Piece[]): WalkingEntry | undefined {
  const doorway = pieces.find(p => p.kind === 'doorway');
  if (!doorway) return undefined;
  const panels = pieces.filter(p => (p.kind === 'facade' || p.kind === 'wall' || p.kind === 'doorway') && p.p[1] === 0);
  const minX = Math.min(...panels.map(p => p.p[0]), doorway.p[0]);
  const maxX = Math.max(...panels.map(p => p.p[0]), doorway.p[0]);
  const minZ = Math.min(...panels.map(p => p.p[2]), doorway.p[2]);
  const maxZ = Math.max(...panels.map(p => p.p[2]), doorway.p[2]);
  const rotatedNormal = rotate([0, 0, 1], doorway.rotation);
  const edge = Math.abs(rotatedNormal[0]) > .5
    ? (doorway.p[0] <= (minX + maxX) / 2 ? -1 : 1)
    : (doorway.p[2] <= (minZ + maxZ) / 2 ? -1 : 1);
  const normal: V3 = Math.abs(rotatedNormal[0])>.5?[edge,0,0]:[0,0,edge];
  const localCenter = rotate([2, 0, 0], doorway.rotation);
  const center: V3 = [doorway.p[0] + localCenter[0], .1, doorway.p[2] + localCenter[2]];
  return { doorway, spawn: [center[0] + normal[0] * 1.25, .1, center[2] + normal[2] * 1.25], inside: [center[0] - normal[0] * 1, .1, center[2] - normal[2] * 1] };
}

export function walkingSpawn(pieces: Piece[]): V3 {
  return walkingEntry(pieces)?.spawn ?? [Math.min(0,...pieces.map(p=>p.p[0]))-3,.1,Math.max(0,...pieces.map(p=>p.p[2]))+5];
}

/** Walkable center-line of one switchback, excluding structural ports. */
export function stairWalkingRoute(stair:Piece):V3[]{
 return [[.4,0,-.7],[.85,.2,-.7],[3.55,2,-.7],[3.55,2,.7],[.4,4,.7],[.4,4,-.7]].map(v=>{const q=rotate(v as V3,stair.rotation);return q.map((n,i)=>n+stair.p[i]) as V3;});
}

