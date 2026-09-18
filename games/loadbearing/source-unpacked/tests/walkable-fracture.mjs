import assert from 'node:assert/strict';
import { build } from 'esbuild';

const bundled = await build({ entryPoints: ['src/local-fracture.ts'], bundle: true, format: 'esm', write: false });
const mod = await import(`data:text/javascript;base64,${Buffer.from(bundled.outputFiles[0].text).toString('base64')}`);
const { PARTS } = await import(`data:text/javascript;base64,${Buffer.from((await build({ entryPoints: ['src/catalog.ts'], bundle: true, format: 'esm', write: false })).outputFiles[0].text).toString('base64')}`);

const doorway = { id: 1, kind: 'doorway', p: [0, 0, 0], rotation: 0 };
const doorwayChunks = mod.localFractureShapes(doorway, [2, 2, 0]);
const doorwayMass = doorwayChunks.reduce((sum, chunk) => sum + chunk.mass, 0);
assert.ok(Math.abs(doorwayMass - PARTS.doorway.mass) < 1e-6, 'doorway conserves mass across compound fracture');
assert.ok(doorwayChunks.some(chunk => chunk.structural), 'doorway retains unhit structural segments');
// The opening is x=1.4..2.6, y=0..1.8. No replacement chunk may fill it.
for (const chunk of doorwayChunks) {
  const overlapsOpening = chunk.center[0] - chunk.size[0] / 2 < 2.6 - 1e-5 && chunk.center[0] + chunk.size[0] / 2 > 1.4 + 1e-5 &&
    chunk.center[1] - chunk.size[1] / 2 < 1.8 && chunk.center[1] + chunk.size[1] / 2 > 0;
  assert.ok(!overlapsOpening || chunk.center[1] - chunk.size[1] / 2 >= 1.8 - 1e-5, 'doorway opening remains clear');
}
const target = doorwayChunks.find(chunk => !chunk.structural && chunk.parent);
assert.ok(target, 'doorway impact produces a recursive target chunk');
const recursive = mod.localFractureShapes(doorway, target.parent.center, { center: target.parent.center, size: target.parent.size, mass: target.mass });
assert.ok(recursive.length >= 1 && recursive.every(chunk => chunk.mass >= 0), 'recursive segment fracture remains valid');

const stair = { id: 2, kind: 'stair', p: [0, 0, 0], rotation: 0 };
const stairChunks = mod.localFractureShapes(stair, [1.1, .25, 0]);
assert.ok(stairChunks.length >= PARTS.stair.segments.length, 'stair fracture retains its riser compound');
assert.ok(Math.abs(stairChunks.reduce((sum, chunk) => sum + chunk.mass, 0) - PARTS.stair.mass) < 1e-6, 'stair fracture conserves mass');
assert.ok(stairChunks.filter(chunk => chunk.structural).length >= PARTS.stair.segments.length - 1, 'stair risers remain structural');
console.log('walkable fracture: doorway opening, stair compound, mass conservation, and recursion passed');
