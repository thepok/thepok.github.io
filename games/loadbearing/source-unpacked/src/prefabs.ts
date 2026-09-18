import { PARTS, rotate, type Piece, type V3 } from './catalog';

/** A small, reusable assembly made from the ordinary catalogue pieces. */
export interface Prefab {
  id: string;
  name: string;
  detail: string;
  count: number;
  cost: number;
}

type TemplatePiece = Omit<Piece, 'id'>;

const templates: Record<string, TemplatePiece[]> = {
  // One 4 m wall panel supported by its two end columns.
  'column-wall-bay': [
    { kind: 'wall', p: [0, 0, 0], rotation: 0 },
    { kind: 'column', p: [0, 0, 0], rotation: 0 },
    { kind: 'column', p: [4, 0, 0], rotation: 0 },
  ],
  // A raised 4 × 4 m floor module. The slab's ports at z ±2 meet the columns.
  'floor-bay': [
    { kind: 'slab', p: [0, 4, 0], rotation: 0 },
    { kind: 'column', p: [0, 0, -2], rotation: 0 },
    { kind: 'column', p: [4, 0, -2], rotation: 0 },
    { kind: 'column', p: [0, 0, 2], rotation: 0 },
    { kind: 'column', p: [4, 0, 2], rotation: 0 },
  ],
  // A complete lateral frame with one connected diagonal in one 4 m bay.
  'braced-frame': [
    { kind: 'column', p: [0, 0, 0], rotation: 0 },
    { kind: 'column', p: [4, 0, 0], rotation: 0 },
    { kind: 'girder', p: [0, 4, 0], rotation: 0 },
    { kind: 'brace', p: [0, 0, 0], rotation: 0 },
  ],
  // A grounded retaining module: the foundation and wall share their six ports.
  'retaining-module': [
    { kind: 'foundation', p: [0, 0, 0], rotation: 0 },
    { kind: 'wall', p: [0, 0, 0], rotation: 0 },
  ],
  // A short bridge starter: two deck modules and side trusses, all on the 4 m grid.
  'bridge-span': [
    { kind: 'deck', p: [0, 0, 0], rotation: 0 },
    { kind: 'deck', p: [4, 0, 0], rotation: 0 },
    { kind: 'truss', p: [0, 0, -2], rotation: 0 },
    { kind: 'truss', p: [4, 0, -2], rotation: 0 },
    { kind: 'truss', p: [0, 0, 2], rotation: 0 },
    { kind: 'truss', p: [4, 0, 2], rotation: 0 },
    { kind: 'girder', p: [0, 4, 2], rotation: 1 },
    { kind: 'girder', p: [4, 4, 2], rotation: 1 },
  ],
};

const details: Record<string, { name: string; detail: string }> = {
  'column-wall-bay': { name: 'Stützenwand', detail: '4 m Betonwand zwischen zwei Stützen' },
  'floor-bay': { name: 'Deckenfeld', detail: '4 × 4 m Decke auf vier Stützen' },
  'braced-frame': { name: 'Verbandsrahmen', detail: '4 m Rahmen mit Diagonalverband' },
  'retaining-module': { name: 'Hangmodul', detail: 'Verankerte 4 m Stützwand' },
  'bridge-span': { name: 'Brückenfeld', detail: '8 m Fahrbahn mit zwei Fachwerkseiten' },
};

export const PREFABS: Prefab[] = Object.keys(templates).map(id => ({
  id,
  ...details[id],
  count: templates[id].length,
  cost: templates[id].reduce((sum, piece) => sum + PARTS[piece.kind].cost, 0),
}));

/** Expand a prefab into normal pieces; startId is the first allocated piece id. */
export function expandPrefab(id: string, position: V3, rotation = 0, startId = 1): Piece[] {
  const source = templates[id];
  if (!source) return [];
  const quarterTurn = ((rotation % 4) + 4) % 4;
  const seen = new Set<string>();
  const pieces: Piece[] = [];
  for (const template of source) {
    const offset = rotate(template.p, quarterTurn);
    // Quarter-turns can produce values such as 4.898e-16; normalize those so
    // adjacent prefab placements share exactly the same socket coordinates.
    const p: V3 = [
      Math.round((position[0] + offset[0]) * 1e6) / 1e6,
      Math.round((position[1] + offset[1]) * 1e6) / 1e6,
      Math.round((position[2] + offset[2]) * 1e6) / 1e6,
    ];
    const pieceRotation = (template.rotation + quarterTurn) % 4;
    const key = `${template.kind}:${p.map(n => Math.round(n * 100) / 100).join(',')}:${pieceRotation}`;
    if (seen.has(key)) continue;
    seen.add(key);
    pieces.push({ id: startId + pieces.length, kind: template.kind, p, rotation: pieceRotation });
  }
  return pieces;
}
