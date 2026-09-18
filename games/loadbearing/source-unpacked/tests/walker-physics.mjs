import assert from 'node:assert/strict';
import { build } from 'esbuild';
import initJolt from 'jolt-physics';

const bundled = await build({ entryPoints: ['src/walker-physics.ts'], bundle: true, format: 'esm', write: false });
const WalkerPhysics = (await import(`data:text/javascript;base64,${Buffer.from(bundled.outputFiles[0].text).toString('base64')}`)).WalkerPhysics;
const J = await initJolt();

const settings = new J.JoltSettings();
const pair = new J.ObjectLayerPairFilterTable(2); pair.EnableCollision(0, 1); pair.EnableCollision(1, 1);
const broad = new J.BroadPhaseLayerInterfaceTable(2, 2);
const b0 = new J.BroadPhaseLayer(0), b1 = new J.BroadPhaseLayer(1);
broad.MapObjectToBroadPhaseLayer(0, b0); broad.MapObjectToBroadPhaseLayer(1, b1);
settings.mBroadPhaseLayerInterface = broad;
settings.mObjectLayerPairFilter = pair;
settings.mObjectVsBroadPhaseLayerFilter = new J.ObjectVsBroadPhaseLayerFilterTable(broad, 2, pair, 2);
const world = new J.JoltInterface(settings);
J.destroy(settings); J.destroy(b0); J.destroy(b1);
const system = world.GetPhysicsSystem();
const bodies = system.GetBodyInterface();
const groupFilter = new J.GroupFilterTable(256); groupFilter.AddRef();

function box(position, size) {
  const half = new J.Vec3(size[0] / 2, size[1] / 2, size[2] / 2), shape = new J.BoxShape(half, .02);
  shape.AddRef();
  const p = new J.RVec3(...position), q = new J.Quat(0, 0, 0, 1);
  const s = new J.BodyCreationSettings(shape, p, q, J.EMotionType_Static, 0);
  s.mCollisionGroup.SetGroupFilter(groupFilter); s.mCollisionGroup.SetGroupID(1); s.mCollisionGroup.SetSubGroupID(Math.random() * 100000 | 0);
  const body = bodies.CreateBody(s); bodies.AddBody(body.GetID(), J.EActivation_DontActivate);
  J.destroy(half); J.destroy(p); J.destroy(q); J.destroy(s); shape.Release();
  return body;
}

const ground = box([0, -.5, 0], [20, 1, 20]);
// A .22 m stair is below the walker's configured .23 m step-up limit.
box([0, .11, -1.2], [3, .22, .8]);
box([0, .33, -2.0], [3, .22, .8]);
box([0, 1.0, -4.0], [3, 2, .25]);
const sim = { J, world, system };
const walker = new WalkerPhysics(sim, [0, 0, 1]);
const dt = 1 / 60;
const falling = new WalkerPhysics(sim, [5, 10, 1]);
for (let i = 0; i < 60; i++) falling.step(dt);
const fallState = falling.snapshot();
console.log('gravity audit', fallState.position, fallState.velocity, fallState.grounded);
assert.ok(fallState.position[1] < 8, 'walker falls under integrated gravity');
for (let i = 0; i < 120; i++) falling.step(dt);
assert.ok(falling.snapshot().grounded, 'falling walker lands on the ground');
falling.dispose();
for (let i = 0; i < 30; i++) walker.step(dt);
assert.ok(walker.snapshot().grounded, 'walker settles onto the ground');

walker.controls.forward = 1;
for (let i = 0; i < 120; i++) walker.step(dt);
const stepped = walker.snapshot();
assert.ok(stepped.position[2] < -2.45, `walker climbs .22 m stairs (z=${stepped.position[2]})`);
assert.ok(stepped.grounded && stepped.position[1] > -.01, 'walker remains supported while ascending the stairs');

walker.controls.forward = 0;
walker.reset([0, 0, 1]);
for (let i = 0; i < 30; i++) walker.step(dt);
walker.controls.forward = 1;
for (let i = 0; i < 120; i++) walker.step(dt);
assert.ok(walker.snapshot().position[2] > -3.7, 'wall blocks forward movement');

const jumper = new WalkerPhysics(sim, [5, 0, 1]);
for (let i = 0; i < 30; i++) jumper.step(dt);
jumper.controls.jump = true; jumper.step(dt); jumper.controls.jump = false;
const jumpStart = jumper.snapshot().position[1];
for (let i = 0; i < 15; i++) jumper.step(dt);
assert.ok(jumper.snapshot().position[1] > jumpStart + .15, 'jump raises the walker');
for (let i = 0; i < 120; i++) jumper.step(dt);
assert.ok(jumper.snapshot().grounded, 'jumping walker lands');
jumper.dispose();

walker.dispose();
bodies.RemoveBody(ground.GetID()); bodies.DestroyBody(ground.GetID());
groupFilter.Release(); J.destroy(world);
console.log('walker physics: grounded walk, stair ascent, wall blocking, and jump passed');




