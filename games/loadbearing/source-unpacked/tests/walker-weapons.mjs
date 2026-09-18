import assert from 'node:assert/strict';
import { build } from 'esbuild';
import { rm } from 'node:fs/promises';
import { join } from 'node:path';
import { pathToFileURL } from 'node:url';

const bundlePath = join(process.cwd(), 'tests', '.walker-weapons-fresh.mjs');
await build({ stdin: { contents: "export { Simulation, loadPhysics } from './src/physics.ts'; export { WalkerPhysics } from './src/walker-physics.ts';", resolveDir: process.cwd() }, bundle: true, platform: 'node', format: 'esm', external: ['jolt-physics'], outfile: bundlePath });
const { Simulation, loadPhysics, WalkerPhysics } = await import(`${pathToFileURL(bundlePath).href}?fresh=${Date.now()}`);
const J = await loadPhysics();
const dt = 1 / 60;
const piece = { id: 1, kind: 'wall', p: [0, 0, -2], rotation: 0 };

function make(pieces = [piece]) { return new Simulation(J, pieces, 'sandbox', 1, { sandbox: true }); }

try {
const hammerSim = make([piece, { id: 2, kind: 'wall', p: [0, 0, -4], rotation: 0 }]);
const hammer = new WalkerPhysics(hammerSim, [0, 0, 1]);
// A tap can begin and end before the next simulation step; trigger preserves it.
hammer.controls.trigger = 1;
hammer.step(dt);
const hammerSnapshot = hammer.snapshot();
assert.equal(hammerSnapshot.weapon, 'hammer');
assert.equal(hammerSnapshot.attackSequence, 1, 'hammer attack sequence increments');
assert.ok(hammerSim.items.find(item => item.id === 1)?.fractured, 'hammer damages the closest visible structure');
assert.ok(!hammerSim.items.find(item => item.id === 2)?.fractured, 'aligned wall blocks damage through it');
hammer.step(dt); assert.equal(hammer.snapshot().attackSequence, 1, 'hammer cooldown prevents immediate repeat');
hammer.controls.fire = true;
for (let i = 0; i < 30; i++) hammer.step(dt);
assert.ok(hammer.snapshot().attackSequence >= 2, 'holding fire repeats after simulation-time cooldown');
hammer.controls.fire = false; hammer.reset([0, 0, 1]); hammer.step(dt);
assert.equal(hammer.snapshot().attackSequence, 2, 'reset does not replay an old trigger');
hammer.dispose(); hammerSim.dispose();

const doorwaySim = make([{ id: 1, kind: 'doorway', p: [0, 0, -1], rotation: 0 }, { id: 2, kind: 'wall', p: [0, 0, -1.8], rotation: 0 }]);
const doorwayWalker = new WalkerPhysics(doorwaySim, [2, 0, .5]);
doorwayWalker.controls.fire = true; doorwayWalker.step(dt);
assert.ok(doorwaySim.items.find(item => item.id === 2)?.fractured, 'hammer ray passes through doorway opening');
doorwayWalker.dispose(); doorwaySim.dispose();

const foundationSim = make([{ id: 1, kind: 'foundation', p: [0, 2, -2], rotation: 0 }, { id: 2, kind: 'wall', p: [0, 0, -4], rotation: 0 }]);
const foundationWalker = new WalkerPhysics(foundationSim, [0, 0, 1]);
foundationWalker.controls.fire = true; foundationWalker.step(dt);
assert.ok(!foundationSim.items.find(item => item.id === 2)?.fractured, 'static foundation blocks hammer damage behind it');
foundationWalker.dispose(); foundationSim.dispose();

const cannonSim = make();
const cannon = new WalkerPhysics(cannonSim, [0, 0, 1]);
cannon.controls.weapon = 'cannon'; cannon.controls.fire = true;
cannon.step(dt); cannon.controls.fire = false;
assert.equal(cannon.snapshot().weapon, 'cannon');
assert.equal(cannon.snapshot().attackSequence, 1, 'cannon attack sequence increments');
for (let i = 0; i < 45; i++) cannonSim.step(dt);
assert.ok(cannonSim.items.some(item => item.fractured), 'cannon projectile reaches and damages the wall');
cannon.dispose(); cannonSim.dispose();
console.log('walker weapons: hammer impact, cannon projectile, visibility, and cooldown passed');
} finally { await rm(bundlePath, { force: true }); }
