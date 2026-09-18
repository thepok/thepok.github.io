import * as THREE from 'three';
import { PARTS, type Piece, type Kind, type Segment } from './catalog.ts';

const CONCRETE_KINDS = new Set<Kind>([
  'column', 'slab', 'wall', 'foundation', 'doorway', 'stair', 'stairwell', 'core',
]);

/** Convert the material's reinforcement scale into the visible marking tier. */
export function reinforcementMarkLevel(value?: number): 0 | 1 | 2 | 3 {
  const reinforcement = Number.isFinite(value) ? Math.max(0, value as number) : 1;
  if (reinforcement <= 0) return 0;
  if (reinforcement <= .65) return 1;
  if (reinforcement <= 1.3) return 2;
  return 3;
}

type Axis = [number, number, number];
type Face = { normal: Axis; u: Axis; v: Axis; width: number; height: number; depth: number };

const dot = (a: Axis, b: Axis) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2];
const add = (a: Axis, b: Axis): Axis => [a[0] + b[0], a[1] + b[1], a[2] + b[2]];
const scale = (a: Axis, n: number): Axis => [a[0] * n, a[1] * n, a[2] * n];

function faces(size: Axis): Face[] {
  const [x, y, z] = size.map(Math.abs) as Axis;
  return [
    { normal:[1,0,0], u:[0,1,0], v:[0,0,1], width:y, height:z, depth:x },
    { normal:[-1,0,0], u:[0,0,1], v:[0,1,0], width:z, height:y, depth:x },
    { normal:[0,1,0], u:[0,0,1], v:[1,0,0], width:z, height:x, depth:y },
    { normal:[0,-1,0], u:[1,0,0], v:[0,0,1], width:x, height:z, depth:y },
    { normal:[0,0,1], u:[1,0,0], v:[0,1,0], width:x, height:y, depth:z },
    { normal:[0,0,-1], u:[0,1,0], v:[1,0,0], width:y, height:x, depth:z },
  ] as Face[];
}

// Keep the sparse accents on a sound catalog segment. This avoids crossing stair voids
// and the core's entrance opening while still giving every orientation a visible face.
function markingSegments(piece: Piece): Segment[] {
  const segments = PARTS[piece.kind].segments;
  if (piece.kind === 'stair') return segments.length ? [segments[0]] : [];
  if (piece.kind === 'stairwell') return segments.length ? [segments[0]] : [];
  if (piece.kind === 'core') return segments.length > 1 ? [segments[1]] : segments.slice(0, 1);
  return segments.slice(0, 1);
}

function point(center: Axis, u: Axis, v: Axis, du: number, dv: number, normal: Axis, lift: number): Axis {
  return add(add(add(center, scale(u, du)), scale(v, dv)), scale(normal, lift));
}

function quad(
  positions: number[], normals: number[], center: Axis, face: Face,
  du: number, dv: number, width: number, height: number, lift: number,
) {
  const hw = width / 2, hh = height / 2;
  const a = point(center, face.u, face.v, du - hw, dv - hh, face.normal, lift);
  const b = point(center, face.u, face.v, du + hw, dv - hh, face.normal, lift);
  const c = point(center, face.u, face.v, du + hw, dv + hh, face.normal, lift);
  const d = point(center, face.u, face.v, du - hw, dv + hh, face.normal, lift);
  for (const p of [a, b, c, a, c, d]) {
    positions.push(...p); normals.push(...face.normal);
  }
}

function hexDot(
  positions: number[], normals: number[], center: Axis, face: Face,
  du: number, dv: number, radius: number, lift: number,
) {
  const origin = point(center, face.u, face.v, du, dv, face.normal, lift);
  for (let i = 0; i < 6; i++) {
    const a = (i / 6) * Math.PI * 2;
    const b = ((i + 1) / 6) * Math.PI * 2;
    const p1 = add(add(origin, scale(face.u, Math.cos(a) * radius)), scale(face.v, Math.sin(a) * radius));
    const p2 = add(add(origin, scale(face.u, Math.cos(b) * radius)), scale(face.v, Math.sin(b) * radius));
    for (const p of [origin, p1, p2]) {
      positions.push(...p); normals.push(...face.normal);
    }
  }
}

/**
 * Build owned, flat triangles for the restrained charcoal/steel edge accents on one piece.
 * The returned geometry is local to the catalog piece and intentionally has no material.
 */
export function createRebarMarkings(piece: Piece): THREE.BufferGeometry | null {
  if (!CONCRETE_KINDS.has(piece.kind)) return null;
  const level = reinforcementMarkLevel(piece.reinforcement);
  if (level === 0) return null;

  const positions: number[] = [], normals: number[] = [];
  const stripeGroups: { start: number; count: number }[] = [];
  const dotGroups: { start: number; count: number }[] = [];
  const stripeCount = level;
  const dotCount = level * 2;
  const lift = .008;
  for (const segment of markingSegments(piece)) {
    const center = segment.center as Axis;
    for (const face of faces(segment.size as Axis)) {
      // The tiny inset keeps accents on the clean concrete face, including side faces.
      const inset = Math.min(face.width, face.height) * .16;
      const usableW = Math.max(face.width - inset * 2, face.width * .25);
      const usableH = Math.max(face.height - inset * 2, face.height * .25);
      const stripeWidth = Math.min(usableW * .34, Math.max(.035, usableW * .14));
      const stripeHeight = Math.min(usableH * .045, Math.max(.012, usableH * .045));
      for (let i = 0; i < stripeCount; i++) {
        const t = stripeCount === 1 ? 0 : (i / (stripeCount - 1) - .5) * usableH * .72;
        const start = positions.length / 3;
        quad(positions, normals, center, face, 0, t, stripeWidth, stripeHeight, face.depth / 2 + lift);
        stripeGroups.push({ start, count: positions.length / 3 - start });
      }

      const radius = Math.min(.035, usableW * .055, usableH * .11);
      const corners: [number, number][] = [
        [-usableW / 2, -usableH / 2], [usableW / 2, usableH / 2],
        [usableW / 2, -usableH / 2], [-usableW / 2, usableH / 2],
        [0, -usableH / 2], [0, usableH / 2],
      ];
      for (let i = 0; i < dotCount; i++) {
        const [du, dv] = corners[i];
        const start = positions.length / 3;
        hexDot(positions, normals, center, face, du, dv, radius, face.depth / 2 + lift);
        dotGroups.push({ start, count: positions.length / 3 - start });
      }
    }
  }
  if (!positions.length) return null;
  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
  geometry.setAttribute('normal', new THREE.Float32BufferAttribute(normals, 3));
  for (const group of stripeGroups) geometry.addGroup(group.start, group.count, 0);
  for (const group of dotGroups) geometry.addGroup(group.start, group.count, 1);
  geometry.computeBoundingSphere();
  return geometry;
}
