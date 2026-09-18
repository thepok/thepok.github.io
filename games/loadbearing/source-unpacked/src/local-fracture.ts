import { PARTS, type Piece, type V3 } from './catalog';
import { fractureShapes, type FragmentShape } from './fracture';

export interface LocalFragmentShape extends FragmentShape {
  /** True for the two load-bearing remnants; rubble is explicitly false. */
  structural?: boolean;
  /** Bounds of the source segment, retained for attachment transfer. */
  parent?: { center: V3; size: V3 };
}

type SegmentBounds = { center: V3; size: V3; mass: number };

const LOCAL_KINDS = new Set<Piece['kind']>(['column', 'wall', 'slab', 'deck', 'doorway', 'stairwell', 'stair', 'core']);

function finiteOr(value: number, fallback: number): number {
  return Number.isFinite(value) ? value : fallback;
}

function clamp(value: number, low: number, high: number): number {
  return Math.max(low, Math.min(high, value));
}

function axisFor(kind: Piece['kind'], size: V3, center: V3, hit: V3): number {
  // Columns break along their height. Panels use the in-plane direction nearest
  // the impact edge; this keeps a low wall hit from making a vertical sliver.
  const candidates = kind === 'column' ? [1] : kind === 'wall' || kind === 'doorway' || kind === 'core' ? [0, 1] : kind === 'stairwell' ? [0, 2] : kind === 'stair' ? [0, 1, 2] : [0, 2];
  return candidates.slice().sort((a, b) => {
    const edgeA = Math.abs(hit[a] - center[a]) / Math.max(size[a], 1e-6);
    const edgeB = Math.abs(hit[b] - center[b]) / Math.max(size[b], 1e-6);
    return edgeB - edgeA || a - b;
  })[0];
}

/**
 * Split one local segment around an impact while keeping the distant remainder
 * as a stiff structural body. Coordinates are in the piece's local frame.
 */
export function localFractureShapes(
  piece: Piece,
  hitLocal: V3,
  segmentOverride?: SegmentBounds,
): LocalFragmentShape[] {
  if (!segmentOverride && (piece.kind === 'doorway' || piece.kind === 'stairwell' || piece.kind === 'stair' || piece.kind === 'core')) return compoundFractureShapes(piece, hitLocal);
  if (piece.kind === 'facade') return fractureShapes(piece, segmentOverride);
  if (!LOCAL_KINDS.has(piece.kind)) return [];

  const def = PARTS[piece.kind];
  const source = segmentOverride ?? { ...def.segments[0], mass: def.mass };
  const center: V3 = [...source.center] as V3;
  const size: V3 = source.size.map(value => Math.max(1e-6, finiteOr(value, 1))) as V3;
  const mass = Math.max(0, finiteOr(source.mass, def.mass));
  const parent = { center: [...center] as V3, size: [...size] as V3 };
  const impact: V3 = hitLocal.map((value, axis) => finiteOr(value, center[axis])) as V3;
  const axis = axisFor(piece.kind, size, center, impact);
  const low = center[axis] - size[axis] / 2;
  const high = center[axis] + size[axis] / 2;
  const hit = clamp(impact[axis], low, high);

  // Recursive fracture should bottom out instead of creating unstable slivers.
  if (size[axis] < 0.45 || mass < 15) {
    return [{ center: [...center] as V3, size: [...size] as V3, mass, kick: [0, 0, 0], structural: false, parent }];
  }

  if(piece.kind==='slab'||piece.kind==='deck'){
    // Plate cracks spread in both plan directions. A one-axis damage band
    // produced full-width ribbons resembling wooden planks.
    const splitX=clamp(.5+(impact[0]-center[0])/size[0]*.3,.38,.62);
    const splitZ=clamp(.5+(impact[2]-center[2])/size[2]*.3,.38,.62);
    const xs=[0,splitX,1],zs=[0,splitZ,1],result:LocalFragmentShape[]=[];
    for(let x=0;x<2;x++)for(let z=0;z<2;z++){
      const dx=xs[x+1]-xs[x],dz=zs[z+1]-zs[z];
      const chunkSize:V3=[size[0]*dx,size[1],size[2]*dz];
      result.push({center:[center[0]+(xs[x]+dx*.5-.5)*size[0],center[1],center[2]+(zs[z]+dz*.5-.5)*size[2]],size:chunkSize,mass:mass*dx*dz,kick:[0,0,0],structural:Math.min(chunkSize[0],chunkSize[2])>=.75&&mass*dx*dz>=60,parent});
    }
    result.at(-1)!.mass+=mass-result.reduce((sum,chunk)=>sum+chunk.mass,0);
    return result;
  }

  // Keep the damage band narrow, but allow edge hits to produce a valid band.
  const band = Math.min(size[axis] * 0.2, Math.max(size[axis] * 0.08, 0.08));
  let bandLow = Math.max(low, hit - band / 2);
  let bandHigh = Math.min(high, hit + band / 2);
  // Never leave a convex-shape-incompatible structural tail at an edge hit.
  if (bandLow - low < 0.06) bandLow = low;
  if (high - bandHigh < 0.06) bandHigh = high;
  // Keep both rubble halves at least 3 cm thick where the source permits it.
  if (size[axis] >= 0.06 && bandHigh - bandLow < 0.06) {
    bandHigh = Math.min(high, bandLow + 0.06);
    bandLow = Math.max(low, bandHigh - 0.06);
  }
  const cuts: number[] = [low, bandLow, (bandLow + bandHigh) / 2, bandHigh, high];
  const ranges: Array<[number, number, boolean]> = [
    [cuts[0], cuts[1], true],
    [cuts[1], cuts[2], false],
    [cuts[2], cuts[3], false],
    [cuts[3], cuts[4], true],
  ];
  const result: LocalFragmentShape[] = [];
  const epsilon = Math.max(1e-7, size[axis] * 1e-7);
  let usedMass = 0;
  for (const [from, to, structural] of ranges) {
    const length = to - from;
    if (length <= epsilon) continue;
    const partCenter = [...center] as V3;
    const partSize = [...size] as V3;
    partCenter[axis] = (from + to) / 2;
    partSize[axis] = length;
    const partMass = mass * length / size[axis];
    usedMass += partMass;
    result.push({
      center: partCenter,
      size: partSize,
      mass: partMass,
      kick: [0, 0, 0],
      structural,
      parent: { center: [...parent.center] as V3, size: [...parent.size] as V3 },
    });
  }

  // Correct the final floating point residue so callers can conserve mass exactly.
  if (result.length) result[result.length - 1].mass += mass - usedMass;
  const rubble = result.filter(fragment => fragment.structural === false);
  const kickAxis = axis;
  const kickAmount = Math.min(1.25, Math.max(0.2, size[axis] * 0.16));
  if (rubble.length === 2) {
    rubble[0].kick[kickAxis] = -kickAmount;
    rubble[1].kick[kickAxis] = kickAmount;
  } else if (rubble.length === 1) {
    rubble[0].kick[kickAxis] = hit >= center[axis] ? kickAmount : -kickAmount;
  }
  return result.slice(0, 4);
}

/**
 * Fracture a multi-segment part without collapsing its compound geometry.
 * Only the segment nearest the impact is split; every other segment remains a
 * structural chunk so openings (doorways/stairwells) and stair profiles stay
 * physically represented.
 */
export function compoundFractureShapes(piece: Piece, hitLocal: V3): LocalFragmentShape[] {
  const segments = PARTS[piece.kind]?.segments ?? [];
  if (segments.length < 2) return localFractureShapes(piece, hitLocal);
  const totalVolume = segments.reduce((sum, segment) => sum + Math.max(1e-9, segment.size[0] * segment.size[1] * segment.size[2]), 0);
  const masses = segments.map(segment => PARTS[piece.kind].mass * Math.max(1e-9, segment.size[0] * segment.size[1] * segment.size[2]) / totalVolume);
  const target = segments.reduce((best, segment, index) => {
    const distance = segment.size.map((size, axis) => Math.max(0, Math.abs(hitLocal[axis] - segment.center[axis]) - size / 2));
    const score = distance.reduce((sum, value) => sum + value * value, 0);
    return score < best.score ? { index, score } : best;
  }, { index: 0, score: Infinity }).index;
  const result: LocalFragmentShape[] = [];
  for (let index = 0; index < segments.length; index++) {
    const segment = segments[index];
    if (index !== target) {
      result.push({ center: [...segment.center] as V3, size: [...segment.size] as V3, mass: masses[index], kick: [0, 0, 0], structural: true, parent: { center: [...segment.center] as V3, size: [...segment.size] as V3 } });
      continue;
    }
    result.push(...localFractureShapes(piece, hitLocal, { center: segment.center, size: segment.size, mass: masses[index] }));
  }
  // Keep mass conservation exact after segment-volume weighting and splits.
  if (result.length) result.at(-1)!.mass += PARTS[piece.kind].mass - result.reduce((sum, chunk) => sum + chunk.mass, 0);
  return result;
}
