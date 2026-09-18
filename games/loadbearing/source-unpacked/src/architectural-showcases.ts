import { type Piece, type V3, type Kind } from './catalog';

export interface ArchitecturalShowcase {
  id: string;
  name: string;
  detail: string;
  height: number;
  pieces: Piece[];
}

function build(make: (add: (kind: Kind, p: V3, rotation?: number, finish?: Piece['finish']) => void) => void): Piece[] {
  const pieces: Piece[] = [];
  const occupied = new Set<string>();
  const add = (kind: Kind, p: V3, rotation = 0, finish?: Piece['finish']) => {
    const key = `${kind}:${p[0]},${p[1]},${p[2]}:${kind === 'column' ? 0 : rotation}`;
    if (occupied.has(key)) throw new Error(`Duplicate showcase piece ${key}`);
    occupied.add(key);
    pieces.push({ id: pieces.length + 1, kind, p, rotation, ...(finish ? { finish } : {}) });
  };
  make(add);
  return pieces;
}

function maisonAzur(): Piece[] {
  return build(add => {
    // Four-by-two raft of foundations carries the full 16 × 8 m lower grid.
    for (const x of [-8, -4, 0, 4]) for (const z of [-2, 2]) add('foundation', [x, 0, z], 0, 'ivory');
    const lowerX = [-8, -4, 0, 4, 8];
    const lowerZ = [-4, 0, 4];
    for (const y of [0, 4]) {
      for (const x of lowerX) for (const z of lowerZ) add('column', [x, y, z], 0, 'ivory');
      for (const x of [-8, -4, 0, 4]) for (const z of [-2, 2]) add('slab', [x, y + 4, z], 0, 'ivory');
      // Continuous glazed street and garden elevations.
      for (const x of [-8, -4, 0, 4]) {
        add('facade', [x, y, -4], 0, 'ivory');
        add('facade', [x, y, 4], 0, 'teal');
      }
      add('facade', [-8, y, 0], 1, 'sandstone');
      add('facade', [8, y, 0], 1, 'ivory');
    }
    // Solid end walls give the villa a warm, weighty spine.
    for (const y of [0, 4]) {
      add('wall', [-8, y, 4], 1, 'terracotta');
      add('wall', [8, y, 4], 1, 'sandstone');
    }
    // The top floor retreats to a single two-bay terrace volume.
    for (const x of [-4, 0, 4]) for (const z of [-2, 2]) add('column', [x, 8, z], 0, 'ivory');
    for (const x of [-4, 0]) for (const z of [0]) add('slab', [x, 12, z], 0, 'ivory');
    for (const x of [-4, 0]) {
      add('facade', [x, 8, -2], 0, 'ivory');
      add('facade', [x, 8, 2], 0, 'teal');
    }
    add('facade', [-4, 8, 2], 1, 'sandstone');
    add('wall', [4, 8, 2], 1, 'terracotta');
    // A low parapet and a diagonal canopy complete the stepped silhouette.
    add('girder', [-4, 12, 0], 0, 'graphite');
    add('girder', [0, 12, 0], 0, 'graphite');
    add('brace', [-4, 8, -2], 0, 'graphite');
  });
}

function auroraTower(): Piece[] {
  return build(add => {
    for (const x of [-4, 0]) for (const z of [-2, 2]) add('foundation', [x, 0, z], 0, 'sandstone');
    const broadX = [-4, 0, 4], broadZ = [-4, 0, 4];
    for (const y of [0, 4]) {
      for (const x of broadX) for (const z of broadZ) add('column', [x, y, z], 0, 'sandstone');
      for (const x of [-4, 0]) for (const z of [-2, 2]) add('slab', [x, y + 4, z], 0, 'sandstone');
      for (const x of [-4, 0]) {
        add('facade', [x, y, -4], 0, 'teal');
        add('facade', [x, y, 4], 0, 'teal');
      }
      add('facade', [-4, y, 0], 1, 'teal');
      add('facade', [4, y, 0], 1, 'teal');
      add('wall', [-4, y, 4], 1, 'sandstone');
      add('facade', [4, y, 4], 1, 'teal');
    }
    // The setback upper shaft is a two-by-two glazed core.
    for (const y of [8, 12, 16, 20]) {
      for (const x of [-4, 0]) for (const z of [-2, 2]) add('column', [x, y, z], 0, 'sandstone');
      add('slab', [-4, y + 4, 0], 0, 'sandstone');
      add('facade', [-4, y, -2], 0, 'teal');
      add('facade', [-4, y, 2], 0, 'teal');
      add('facade', [-4, y, 2], 1, 'teal');
      // The stone side bay is a deliberate solid accent in the setback.
      add('facade', [0, y, 2], 1, 'sandstone');
    }
    // Art Deco ribs and a gold crown tie the stepped mass together.
    for (const z of [-2, 2]) add('girder', [-4, 24, z]);
    for (const x of [-4, 0]) add('girder', [x, 24, 2], 1);
  });
}

function hafenwerft(): Piece[] {
  return build(add => {
    const xs = [-12, -8, -4, 0, 4, 8];
    for (const x of xs) for (const z of [-2, 2]) add('foundation', [x, 0, z], 0, 'graphite');
    for (const y of [0, 4]) {
      for (const x of [-12, -8, -4, 0, 4, 8, 12]) for (const z of [-4, 0, 4]) add('column', [x, y, z], 0, 'graphite');
      // Solid lower panels alternate with translucent clerestory panels.
      for (const x of xs) {
        add('wall', [x, y, -4], 0, y === 8 ? 'sandstone' : 'terracotta');
        add('facade', [x, y, 4], 0, y === 8 ? 'teal' : 'sandstone');
      }
      for (const z of [0, 4]) {
        add('wall', [-12, y, z], 1, 'terracotta');
        add('facade', [12, y, z], 1, 'teal');
      }
    }
    // Paired Warren trusses make a true 24 m long industrial roof frame.
    for (const x of xs) {
      add('truss', [x, 8, -4], 0, 'graphite');
      add('truss', [x, 8, 4], 0, 'graphite');
      for (const z of [-2, 2]) add('slab', [x, 12, z], 0, 'ivory');
    }
    for (const x of [-12, -8, -4, 0, 4, 8, 12]) {
      add('column', [x, 8, 0], 0, 'graphite');
      for (const z of [0, 4]) add('girder', [x, 12, z], 1, 'graphite');
    }
    for (const x of [-12, 12]) for (const z of [0, 4]) add('facade', [x, 8, z], 1, 'teal');
  });
}

export const ARCHITECTURAL_SHOWCASES: ArchitecturalShowcase[] = [
  { id: 'maison-azur', name: 'Maison Azur', detail: 'Terrassenvilla mit zurückgesetztem Penthouse, hellen Decken, Glasfronten und warmen Akzentwänden.', height: 12, pieces: maisonAzur() },
  { id: 'aurora-tower', name: 'Aurora Tower', detail: 'Schlanker Glasturm auf Sandsteinsockel mit zurückgesetzten Obergeschossen und goldenem Dachabschluss.', height: 24, pieces: auroraTower() },
  { id: 'hafenwerft', name: 'Hafenwerft', detail: 'Industriehalle mit Ziegelwänden, hoher Glasfront und offenem Fachwerkband unter dem Dach.', height: 12, pieces: hafenwerft() },
];
