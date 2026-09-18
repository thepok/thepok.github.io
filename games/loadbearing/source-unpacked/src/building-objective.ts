import { ports, type Piece, type V3 } from './catalog';

export interface BuildingObjective { minHeight: number; minFloorArea: number }
export interface BuildingState {
  positions: Map<number, V3>
  upright: Map<number, boolean>
  links: Array<[number, number]>
  anchors: number[]
}

type Floor = { id: number; piece: Piece; position: V3 }
const near = (a: number, b: number, e = .06) => Math.abs(a - b) <= e;
const key = (v: V3) => v.map(n => Math.round(n * 1000)).join(',');

function components(pieces: Piece[], state?: BuildingState) {
  const ids = pieces.map(p => p.id), parent = new Map(ids.map(id => [id, id]));
  const find = (id: number): number => {
    const p = parent.get(id);
    if (p === undefined) return id;
    if (p === id) return id;
    const r = find(p); parent.set(id, r); return r;
  };
  const join = (a: number, b: number) => { if (parent.has(a) && parent.has(b)) parent.set(find(a), find(b)); };
  if (state) for (const [a, b] of state.links) join(a, b);
  else {
    const socket = new Map<string, number>();
    for (const piece of pieces) for (const point of ports(piece)) {
      const k = key(point), other = socket.get(k);
      if (other !== undefined) join(piece.id, other); else socket.set(k, piece.id);
    }
  }
  const anchors = state ? state.anchors : pieces.filter(p => p.kind === 'foundation' && near(p.p[1], 0, .01) && Math.abs(p.p[0]) <= 40 && Math.abs(p.p[2]) <= 40).map(p => p.id);
  const anchored = new Set(anchors.filter(id => parent.has(id)).map(find));
  return { find, anchored };
}

function cells(floor: Floor) {
  const r = floor.piece.rotation & 3, result: string[] = [];
  // A slab is four 2m cells. Its origin and quarter-turn are catalog coordinates.
  for (const x of [1, 3]) for (const z of [-1, 1]) {
    let dx = x, dz = z;
    if (r === 1) [dx, dz] = [z, -x];
    else if (r === 2) [dx, dz] = [-x, -z];
    else if (r === 3) [dx, dz] = [-z, x];
    result.push(`${Math.floor((floor.piece.p[0] + dx) / 2)},${Math.floor((floor.piece.p[2] + dz) / 2)}`);
  }
  return result;
}

function contiguousArea(all: Set<string>) {
  let best = 0;
  const visited = new Set<string>();
  for (const start of all) {
    if (visited.has(start)) continue;
    const seen = new Set([start]), queue = [start]; visited.add(start);
    while (queue.length) {
      const [x, z] = queue.shift()!.split(',').map(Number);
      for (const n of [`${x + 1},${z}`, `${x - 1},${z}`, `${x},${z + 1}`, `${x},${z - 1}`]) {
        if (all.has(n) && !visited.has(n)) { seen.add(n); visited.add(n); queue.push(n); }
      }
    }
    best = Math.max(best, seen.size * 4);
  }
  return best;
}

export function evaluateBuilding(
  pieces: Piece[], objective: BuildingObjective | { minHeight: number; minFloorArea?: number }, state?: BuildingState,
): { passed: boolean; reason: string; completedFloors: number; requiredFloors: number; minFloorArea: number } {
  const minFloorArea = objective.minFloorArea ?? 32;
  const levels = Array.from({ length: Math.floor(Math.max(0, objective.minHeight) / 4) }, (_, i) => (i + 1) * 4);
  const graph = components(pieces, state), floors = new Map<number, Floor[]>();
  for (const piece of pieces) if (piece.kind === 'slab') {
    const position = state ? state.positions.get(piece.id) : piece.p;
    if (!position) continue;
    const intended = Math.round(piece.p[1] / 4) * 4;
    const level = Math.round(position[1] / 4) * 4;
    const valid = Number.isFinite(position[0]) && Number.isFinite(position[1]) && Number.isFinite(position[2]) &&
      near(piece.p[1], intended, .06) && level === intended && Math.abs(position[1] - intended) <= .5 &&
      (!state || (state.upright.get(piece.id) === true && Math.hypot(position[0] - piece.p[0], position[2] - piece.p[2]) <= 1));
    if (valid) (floors.get(intended) ?? (floors.set(intended, []), floors.get(intended)!)).push({ id: piece.id, piece, position });
  }
  const roots = [...new Set([...graph.anchored])];
  let bestCompleted = 0, bestReason = roots.length ? 'Gebäudeziel nicht erreicht.' : 'Kein verankertes Tragwerk gefunden.';
  for (const root of roots) {
    let completed = 0, reason = '';
    for (const level of levels) {
    const candidates = (floors.get(level) ?? []).filter(f => graph.find(f.id) === root);
    const connected = candidates;
    const usable = new Set<string>();
    for (const floor of connected) for (const cell of cells(floor)) usable.add(cell);
    const area = contiguousArea(usable);
    if (area >= minFloorArea) completed++;
    else if (!candidates.length) { reason = `Boden bei ${level} m fehlt oder ist nicht mit demselben verankerten Tragwerk verbunden.`; break; }
    else if (area < minFloorArea) { reason = `Boden bei ${level} m hat nur ${area} m² nutzbare Fläche (mindestens ${minFloorArea} m² erforderlich).`; break; }
    }
    if (completed > bestCompleted || bestReason === 'Gebäudeziel nicht erreicht.') { bestCompleted = completed; bestReason = reason || `Gebäudeziel erreicht: ${completed}/${levels.length} Böden.`; }
    if (completed === levels.length) return { passed: true, reason: `Gebäudeziel erreicht: ${completed}/${levels.length} Böden.`, completedFloors: completed, requiredFloors: levels.length, minFloorArea };
  }
  return { passed: false, reason: bestReason, completedFloors: bestCompleted, requiredFloors: levels.length, minFloorArea };
}
