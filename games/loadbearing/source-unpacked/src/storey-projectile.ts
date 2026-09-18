import { PARTS, type V3 } from './catalog';

type StoreyKind = 'slab' | 'column' | 'wall' | 'facade';
type StoreyCell = { offset: V3; size: V3; sourceKind: StoreyKind; massWeight: number };
type Room = { cells: StoreyCell[]; links: [number, number][] };

const ROOM_PARTS = 16;
const WIDTH = 2.8, DEPTH = 2.2, HEIGHT = 2.8;
const density = (kind: StoreyKind) => {
  const part = PARTS[kind];
  return part.mass / part.segments.reduce((sum, segment) => sum + segment.size[0] * segment.size[1] * segment.size[2], 0);
};

function roomAt(origin: V3): Room {
  const wall = 0.18, column = 0.32, floorThickness = 0.22, roofThickness = 0.22;
  const floorTop = -HEIGHT / 2 + floorThickness, roofBottom = HEIGHT / 2 - roofThickness;
  const clearHeight = roofBottom - floorTop, interiorDepth = DEPTH - 2 * column, interiorWidth = WIDTH - 2 * column;
  const cells: StoreyCell[] = [];
  const add = (local: V3, size: V3, sourceKind: StoreyKind) => {
    const offset: V3 = [local[0] + origin[0], local[1] + origin[1], local[2] + origin[2]];
    cells.push({ offset, size, sourceKind, massWeight: size[0] * size[1] * size[2] * density(sourceKind) });
    return cells.length - 1;
  };
  const floor = add([0, -HEIGHT / 2 + floorThickness / 2, 0], [WIDTH, floorThickness, DEPTH], 'slab');
  const roof = add([0, HEIGHT / 2 - roofThickness / 2, 0], [WIDTH, roofThickness, DEPTH], 'slab');
  const columnY = (floorTop + roofBottom) / 2;
  const frontLeft = add([-WIDTH / 2 + column / 2, columnY, -DEPTH / 2 + column / 2], [column, clearHeight, column], 'column');
  const frontRight = add([WIDTH / 2 - column / 2, columnY, -DEPTH / 2 + column / 2], [column, clearHeight, column], 'column');
  const backLeft = add([-WIDTH / 2 + column / 2, columnY, DEPTH / 2 - column / 2], [column, clearHeight, column], 'column');
  const backRight = add([WIDTH / 2 - column / 2, columnY, DEPTH / 2 - column / 2], [column, clearHeight, column], 'column');
  const backWall = add([0, columnY, DEPTH / 2 - wall / 2], [interiorWidth, clearHeight, wall], 'wall');
  const parapetHeight = 0.55, parapetY = floorTop + parapetHeight / 2;
  const leftParapet = add([-WIDTH / 2 + wall / 2, parapetY, 0], [wall, parapetHeight, interiorDepth], 'wall');
  const rightParapet = add([WIDTH / 2 - wall / 2, parapetY, 0], [wall, parapetHeight, interiorDepth], 'wall');
  const sideWindowHeight = clearHeight - parapetHeight, sideWindowY = floorTop + parapetHeight + sideWindowHeight / 2;
  const paneDepth = interiorDepth / 2, sidePaneZ = interiorDepth / 4;
  const leftWindowA = add([-WIDTH / 2 + wall / 2, sideWindowY, -sidePaneZ], [wall * 0.34, sideWindowHeight, paneDepth], 'facade');
  const leftWindowB = add([-WIDTH / 2 + wall / 2, sideWindowY, sidePaneZ], [wall * 0.34, sideWindowHeight, paneDepth], 'facade');
  const rightWindowA = add([WIDTH / 2 - wall / 2, sideWindowY, -sidePaneZ], [wall * 0.34, sideWindowHeight, paneDepth], 'facade');
  const rightWindowB = add([WIDTH / 2 - wall / 2, sideWindowY, sidePaneZ], [wall * 0.34, sideWindowHeight, paneDepth], 'facade');
  const doorWidth = 0.86, headerHeight = 0.45;
  const header = add([0, roofBottom - headerHeight / 2, -DEPTH / 2 + wall / 2], [interiorWidth, headerHeight, wall], 'wall');
  const frontWindowHeight = roofBottom - headerHeight - floorTop, frontWindowY = floorTop + frontWindowHeight / 2;
  const sideOpeningWidth = (interiorWidth - doorWidth) / 2;
  const frontLeftWindow = add([-doorWidth / 2 - sideOpeningWidth / 2, frontWindowY, -DEPTH / 2 + wall / 2], [sideOpeningWidth, frontWindowHeight, wall * 0.34], 'facade');
  const frontRightWindow = add([doorWidth / 2 + sideOpeningWidth / 2, frontWindowY, -DEPTH / 2 + wall / 2], [sideOpeningWidth, frontWindowHeight, wall * 0.34], 'facade');
  const links: [number, number][] = [];
  const link = (a: number, b: number) => links.push(a < b ? [a, b] : [b, a]);
  for (const c of [frontLeft, frontRight, backLeft, backRight]) { link(floor, c); link(roof, c); }
  link(backWall, backLeft); link(backWall, backRight); link(backWall, floor); link(backWall, roof);
  link(leftParapet, floor); link(rightParapet, floor);
  link(leftParapet, leftWindowA); link(leftParapet, leftWindowB); link(rightParapet, rightWindowA); link(rightParapet, rightWindowB);
  link(leftWindowA, leftWindowB); link(rightWindowA, rightWindowB);
  link(leftWindowA, frontLeft); link(leftWindowB, backLeft); link(rightWindowA, frontRight); link(rightWindowB, backRight);
  link(frontLeftWindow, floor); link(frontRightWindow, floor); link(frontLeftWindow, frontLeft); link(frontRightWindow, frontRight);
  link(frontLeftWindow, header); link(frontRightWindow, header); link(header, roof);
  return { cells, links };
}

export function storeyProjectileLayout(requestedParts = ROOM_PARTS): {
  cells: StoreyCell[]; links: [number, number][]; radius: number; mass: number; count: number;
} {
  const requested = Number.isFinite(requestedParts) ? requestedParts : ROOM_PARTS;
  const modules = Math.max(1, Math.min(20, Math.round(requested / ROOM_PARTS)));
  const coordinates: [number, number, number][] = [];
  for (let x = -4; x <= 4; x++) for (let y = -2; y <= 2; y++) for (let z = -4; z <= 4; z++)
    if (x || y || z) coordinates.push([x, y, z]);
  coordinates.sort((a, b) => {
    const da = Math.abs(a[0]) + Math.abs(a[1]) + Math.abs(a[2]), db = Math.abs(b[0]) + Math.abs(b[1]) + Math.abs(b[2]);
    return da - db || Math.abs(a[1]) - Math.abs(b[1]) || a[1] - b[1] || a[2] - b[2] || a[0] - b[0];
  });
  const chosen: [number, number, number][] = [[0, 0, 0], ...coordinates.slice(0, modules - 1)];
  const minX = Math.min(...chosen.map(p => p[0])), maxX = Math.max(...chosen.map(p => p[0]));
  const minY = Math.min(...chosen.map(p => p[1])), maxY = Math.max(...chosen.map(p => p[1]));
  const minZ = Math.min(...chosen.map(p => p[2])), maxZ = Math.max(...chosen.map(p => p[2]));
  const center: V3 = [(minX + maxX) * WIDTH / 2, (minY + maxY) * HEIGHT / 2, (minZ + maxZ) * DEPTH / 2];
  const cells: StoreyCell[] = [], links: [number, number][] = [];
  const moduleIndex = new Map(chosen.map((p, i) => [p.join(','), i]));
  for (const [x, y, z] of chosen) {
    const room = roomAt([x * WIDTH - center[0], y * HEIGHT - center[1], z * DEPTH - center[2]]);
    const base = cells.length;
    cells.push(...room.cells);
    links.push(...room.links.map(([a, b]) => [a + base, b + base] as [number, number]));
    for (const [dx, dy, dz] of [[1, 0, 0], [0, 1, 0], [0, 0, 1]] as const) {
      const neighbor = moduleIndex.get([x + dx, y + dy, z + dz].join(','));
      if (neighbor === undefined) continue;
      const otherBase = neighbor * ROOM_PARTS;
      if (dy === 0) { links.push([base, otherBase]); links.push([base + 1, otherBase + 1]); }
      else links.push([base + 1, otherBase]);
    }
  }
  let radius = 0, mass = 0;
  for (const cell of cells) {
    for (const sx of [-1, 1]) for (const sy of [-1, 1]) for (const sz of [-1, 1])
      radius = Math.max(radius, Math.hypot(cell.offset[0] + sx * cell.size[0] / 2, cell.offset[1] + sy * cell.size[1] / 2, cell.offset[2] + sz * cell.size[2] / 2));
    mass += cell.massWeight;
  }
  return { cells, links, radius, mass, count: cells.length };
}
