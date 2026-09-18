import assert from 'node:assert/strict';
import { build } from 'esbuild';

await build({
  stdin: { contents: "export { localFractureShapes } from './src/local-fracture.ts'; export { PARTS } from './src/catalog.ts';", resolveDir: process.cwd() },
  bundle: true, platform: 'node', format: 'esm', outfile: 'artifacts/local-fracture.mjs',
});
const { localFractureShapes, PARTS } = await import('../artifacts/local-fracture.mjs?' + Date.now());

const piece = (kind) => ({ id: 3, kind, p: [0, 0, 0], rotation: 0 });
const massOf = shapes => shapes.reduce((sum, shape) => sum + shape.mass, 0);
const extent = (shapes, axis) => shapes.reduce((sum, shape) => sum + shape.size[axis], 0);

const centerHit = localFractureShapes(piece('column'), [0, 2, 0]);
assert.ok(centerHit.length <= 4);
assert.equal(centerHit.filter(shape => shape.structural).length, 2);
assert.ok(Math.abs(massOf(centerHit) - PARTS.column.mass) < 1e-9);
assert.ok(Math.abs(extent(centerHit, 1) - PARTS.column.segments[0].size[1]) < 1e-9);
assert.ok(centerHit.every(shape => shape.parent?.size.every((value, axis) => value === PARTS.column.segments[0].size[axis])));

const lowHit = localFractureShapes(piece('wall'), [0.2, 0.2, 0]);
const highHit = localFractureShapes(piece('wall'), [3.8, 3.8, 0]);
assert.notDeepEqual(lowHit.map(shape => shape.center), highHit.map(shape => shape.center));
assert.ok(lowHit.some(shape => shape.structural && shape.size[0] > 2), 'far wall remainder should stay large');
const bottomWall = localFractureShapes(piece('wall'), [2, 0.1, 0]);
assert.ok(bottomWall.every(shape => shape.size[0] === 4), 'bottom wall impact should cut across Y');
const nearHighEdge = localFractureShapes(piece('wall'), [3.59999, 2, 0]);
const nearLowEdge = localFractureShapes(piece('wall'), [0.40001, 2, 0]);
assert.ok(nearHighEdge.every(shape => !shape.structural || shape.size[0] >= 0.06), 'high edge must not retain a thin structural tail');
assert.ok(nearLowEdge.every(shape => !shape.structural || shape.size[0] >= 0.06), 'low edge must not retain a thin structural tail');
assert.ok(nearHighEdge.filter(shape => shape.structural === false).every(shape => shape.size[0] >= 0.03));
assert.ok(nearLowEdge.filter(shape => shape.structural === false).every(shape => shape.size[0] >= 0.03));

const slab = localFractureShapes(piece('slab'), [3.6, 0, 0]);
assert.ok(slab.some(shape => shape.structural && shape.size[0] > 2), 'slab uses plan axis, not thickness');
assert.ok(Math.abs(massOf(slab) - PARTS.slab.mass) < 1e-9);
assert.equal(slab.length,4);assert.ok(slab.every(s=>Math.max(s.size[0],s.size[2])/Math.min(s.size[0],s.size[2])<1.7),'plate pieces should be compact across their surface, not full-width ribbons');

const child = localFractureShapes(piece('column'), [0, 0.1, 0], { center: [0, 0, 0], size: [0.3, 1.2, 0.3], mass: 90 });
assert.ok(Math.abs(massOf(child) - 90) < 1e-9);
assert.ok(child.every(shape => shape.parent?.center.every(value => value === 0)));
const tiny = localFractureShapes(piece('column'), [0, 0, 0], { center: [0, 0, 0], size: [0.3, 0.4, 0.3], mass: 12 });
assert.equal(tiny.length, 1);
assert.equal(tiny[0].structural, false);
assert.equal(tiny[0].mass, 12);

assert.equal(localFractureShapes(piece('facade'), [2, 2, 0]).length, 6);
console.log('Local fracture checks passed.');
