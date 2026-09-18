import assert from 'node:assert/strict';
import { mkdir } from 'node:fs/promises';
import { build } from 'esbuild';

await mkdir('artifacts', { recursive: true });
await build({ stdin: { contents: "export { Simulation,loadPhysics } from './src/physics.ts';", resolveDir: process.cwd() }, bundle: true, platform: 'node', format: 'esm', external: ['jolt-physics'], outfile: 'artifacts/fracture-hazards.mjs' });
const { Simulation, loadPhysics } = await import('../artifacts/fracture-hazards.mjs?' + Date.now());
const J = await loadPhysics();

function advance(sim, seconds) {
  for (let i = 0; i < Math.ceil(seconds * 120); i++) sim.step();
}
function finiteBody(item) {
  const p = item.body.GetPosition();
  return [p.GetX(), p.GetY(), p.GetZ()].every(Number.isFinite);
}
function test(name, fn) { try { fn(); console.log('PASS:', name); } catch (error) { console.error('FAIL:', name); throw error; } }

test('a projectile detaches a facade into six finite, mass-conserving chunks', () => {
  const pieces = [
    { id: 1, kind: 'foundation', p: [0, 0, 0], rotation: 0 },
    { id: 2, kind: 'facade', p: [0, 0, 0], rotation: 0 },
  ];
  const sim = new Simulation(J, pieces, 'sandbox', 1, { sandbox: true, duration: 4 });
  const facade = sim.items.find(item => item.id === 2);
  const originalMass = 650;
  const shot = sim.launchProjectile([-7, 2, 0], [34, 0, 0], 12000, 0.8);
  assert.ok(shot);
  advance(sim, 1.5);
  assert.equal(facade.fractured, true, 'projectile should break the facade joints');
  const chunks = sim.items.filter(item => item.kind === 'fragment' && item.sourceKind === 'facade');
  assert.equal(chunks.length, 6);
  const chunkMass = chunks.reduce((sum, item) => sum + item.body.GetMotionProperties().GetInverseMass() ** -1, 0);
  assert.ok(Math.abs(chunkMass - originalMass) < 1e-3);
  assert.ok(sim.removedBodies.has(facade.body));
  assert.equal(sim.bodies.IsAdded(facade.body.GetID()), false, 'removed body must not remain in collision world');
  assert.ok(chunks.every(finiteBody));
  advance(sim, 4);
  assert.ok(chunks.every(finiteBody));
  sim.dispose();
});

test('a heavy direct hit shatters an attached floor slab but a light bump does not', () => {
  const pieces = [
    { id: 1, kind: 'foundation', p: [0, 0, 0], rotation: 0 },
    { id: 2, kind: 'column', p: [0, 0, 0], rotation: 0 },
    { id: 3, kind: 'slab', p: [0, 4, 0], rotation: 0 },
  ];
  const heavy = new Simulation(J, pieces, 'sandbox', 1, { sandbox: true, duration: 4 });
  const slab = heavy.items.find(item => item.id === 3);
  assert.ok(heavy.launchProjectile([-7, 3.78, 0], [34, 0, 0], 12000, 0.8));
  advance(heavy, 1);
  assert.equal(slab.fractured, true, 'the attached slab should break at high impact energy');
  assert.equal(heavy.items.filter(item => item.kind === 'fragment' && item.sourceKind === 'slab').length, 6);
  assert.ok((heavy.attachmentCounts.get(3) ?? 1) === 0, 'no live slab joint may remain after shattering');
  heavy.dispose();

  const light = new Simulation(J, pieces, 'sandbox', 1, { sandbox: true, duration: 4 });
  const lightSlab = light.items.find(item => item.id === 3);
  assert.ok(light.launchProjectile([-7, 3.78, 0], [5, 0, 0], 250, 0.8));
  advance(light, 2);
  assert.notEqual(lightSlab.fractured, true, 'a low-energy bump should not make floors brittle');
  light.dispose();
});

test('a broken connection leaves a jagged piece of each neighbor on the other part', () => {
  const pieces = [
    { id: 1, kind: 'foundation', p: [0, 0, 0], rotation: 0 },
    { id: 2, kind: 'column', p: [0, 0, 0], rotation: 0 },
  ];
  const sim = new Simulation(J, pieces, 'sandbox', 1, { sandbox: true });
  const joint = sim.joints.find(candidate => candidate.b);
  assert.ok(joint, 'the two parts should have a connection');
  assert.equal(sim.breakJoint(joint), true);
  const foundation = sim.items.find(item => item.id === 1);
  const column = sim.items.find(item => item.id === 2);
  assert.ok(foundation.remnants?.some(remnant => remnant.sourceKind === 'column'));
  assert.ok(column.remnants?.some(remnant => remnant.sourceKind === 'foundation'));
  assert.ok([...foundation.remnants, ...column.remnants].every(remnant => remnant.point.every(Number.isFinite)));
  const counts = [foundation.remnants.length, column.remnants.length];
  assert.equal(sim.breakJoint(joint), false, 'breaking the same joint twice must not duplicate remnants');
  assert.deepEqual([foundation.remnants.length, column.remnants.length], counts);
  sim.dispose();
});

test('a heavy ball dropped vertically shatters a flat road deck', () => {
  const pieces = [
    { id: 1, kind: 'foundation', p: [0, 0, 0], rotation: 0 },
    { id: 2, kind: 'column', p: [0, 0, 0], rotation: 0 },
    { id: 3, kind: 'deck', p: [0, 4, 0], rotation: 0 },
  ];
  const sim = new Simulation(J, pieces, 'sandbox', 1, { sandbox: true, duration: 4 });
  const deck = sim.items.find(item => item.id === 3);
  assert.ok(sim.launchProjectile([2, 12, 0], [0, -25, 0], 5000, 0.7));
  advance(sim, 1);
  assert.equal(deck.fractured, true, 'a vertical high-energy hit should break a road panel');
  assert.equal(sim.items.filter(item => item.kind === 'fragment' && item.sourceKind === 'deck').length, 6);
  sim.dispose();
});

test('a heavy ball dropped onto one floor slab at ground level shatters it', () => {
  const pieces = [{ id: 1, kind: 'slab', p: [0, 0, 0], rotation: 0 }];
  const sim = new Simulation(J, pieces, 'sandbox', 1, { sandbox: true, duration: 4 });
  const slab = sim.items.find(item => item.id === 1);
  assert.ok(sim.launchProjectile([2, 8, 0], [0, -35, 0], 5000, 0.7));
  advance(sim, 1);
  assert.equal(slab.fractured, true, 'one floor slab on the ground should fracture from a vertical impact');
  assert.equal(sim.items.filter(item => item.kind === 'fragment' && item.sourceKind === 'slab').length, 6);
  sim.dispose();
});

test('a whole floor slab that fell during a collapse can still be shattered', () => {
  const pieces = [{ id: 1, kind: 'slab', p: [0, 8, 0], rotation: 0 }];
  const sim = new Simulation(J, pieces, 'sandbox', 1, { sandbox: true, duration: 10 });
  const slab = sim.items.find(item => item.id === 1);
  advance(sim, 3);
  assert.notEqual(slab.fractured, true);
  const p = slab.body.GetPosition();
  assert.ok(p.GetY() < 1, 'the intact slab should have fallen onto the ground');
  assert.ok(sim.launchProjectile([p.GetX(), p.GetY() + 8, p.GetZ()], [0, -35, 0], 5000, 0.7));
  advance(sim, 1);
  assert.equal(slab.fractured, true, 'a fallen whole slab must remain destructible');
  sim.dispose();
});

test('sandbox hazards are independently toggled and earthquake ground stops moving', () => {
  const pieces = [
    { id: 1, kind: 'foundation', p: [0, 0, 0], rotation: 0 },
    { id: 2, kind: 'column', p: [0, 0, 0], rotation: 0 },
  ];
  const sim = new Simulation(J, pieces, 'sandbox', 1, { sandbox: true, duration: 20 });
  const initialWater = sim.water;
  sim.setSandboxHazard('wind', true);
  sim.setSandboxHazard('flood', true);
  advance(sim, 3);
  assert.equal(sim.hazardActive('wind'), true);
  assert.equal(sim.hazardActive('flood'), true);
  assert.equal(sim.hazardActive('earthquake'), false);
  assert.ok(sim.water > initialWater, 'flood water should rise');
  assert.ok(sim.items.find(item => item.id === 2).stress > 0, 'wind should load the anchored column');
  sim.setSandboxHazard('earthquake', true);
  advance(sim, 3);
  const movingPosition = sim.ground.GetPosition();
  const moving = [movingPosition.GetX(), movingPosition.GetY(), movingPosition.GetZ()];
  assert.ok(Math.hypot(moving[0], moving[2]) > 1e-5, 'earthquake should move the ground');
  sim.setSandboxHazard('earthquake', false);
  advance(sim, 2);
  const stoppedPosition = sim.ground.GetPosition();
  const stopped = [stoppedPosition.GetX(), stoppedPosition.GetY(), stoppedPosition.GetZ()];
  assert.ok(Math.hypot(stopped[0], stopped[2]) < 1e-9, 'disabling earthquake should return ground to origin');
  const stoppedVelocity = sim.ground.GetLinearVelocity();
  assert.ok(Math.hypot(stoppedVelocity.GetX(), stoppedVelocity.GetZ()) < 1e-9, 'ground should have zero velocity');
  advance(sim, 1);
  const afterPosition = sim.ground.GetPosition();
  const after = [afterPosition.GetX(), afterPosition.GetY(), afterPosition.GetZ()];
  assert.deepEqual(after, stopped);
  assert.equal(sim.hazardActive('wind'), true);
  assert.equal(sim.hazardActive('flood'), true);
  sim.setSandboxHazard('wind', false);
  assert.equal(sim.hazardActive('wind'), false);
  assert.equal(sim.hazardActive('flood'), true);
  sim.dispose();
});

test('a whole slab remains destructible after a large collapse fills the debris budget', () => {
  const pieces = [
    ...Array.from({ length: 26 }, (_, i) => ({ id: i + 1, kind: 'facade', p: [i * 6, 0, 0], rotation: 0 })),
    { id: 27, kind: 'slab', p: [160, 0, 0], rotation: 0 },
  ];
  const sim = new Simulation(J, pieces, 'sandbox', 1, { sandbox: true, duration: 4 });
  const originals = sim.items.filter(item => item.kind === 'facade');
  for (let i = 0; i < 26; i++) sim.fracture(originals[i]);
  assert.equal(sim.fragments, 156);
  const slab = sim.items.find(item => item.id === 27);
  assert.ok(sim.launchProjectile([162, 8, 0], [0, -35, 0], 5000, 0.7));
  advance(sim, 1);
  assert.equal(slab.fractured, true, 'the debris cap must not make a whole slab indestructible');
  assert.equal(sim.fragments, 156);
  assert.equal(sim.items.filter(item => item.kind === 'fragment' && item.retired).length, 6);
  sim.dispose();
});

test('the active debris limit can be changed while the simulation is running', () => {
  const pieces = Array.from({ length: 13 }, (_, i) => ({ id: i + 1, kind: 'facade', p: [i * 6, 0, 0], rotation: 0 }));
  const sim = new Simulation(J, pieces, 'sandbox', 1, { sandbox: true, fragmentLimit: 120 });
  for (let i = 0; i < 12; i++) sim.fracture(sim.items.find(item => item.id === i + 1));
  assert.equal(sim.fragments, 72);
  sim.setFragmentLimit(24);
  assert.equal(sim.fragmentLimit, 24);
  assert.equal(sim.fragments, 24);
  assert.equal(sim.items.filter(item => item.kind === 'fragment' && item.retired).length, 48);
  sim.setFragmentLimit(48);
  sim.fracture(sim.items.find(item => item.id === 13));
  assert.equal(sim.fragments, 30);
  sim.setFragmentLimit(3000);
  assert.equal(sim.fragmentLimit, 3000);
  sim.dispose();
});

test('overlapping former neighbors regain collision only after separation', () => {
 const sim=new Simulation(J,[],'sandbox',1,{sandbox:true});
 const a=sim.dynamicBox([-101,'test'],[0,10,0],[2,2,2],100).body;
 const b=sim.dynamicBox([-102,'test'],[1,10,0],[2,2,2],100).body;
 sim.restoreCollisionWhenSeparate(a,b);
 assert.equal(sim.pendingCollisions.size,1);
 const target=new J.RVec3(5,10,0);sim.bodies.SetPosition(b.GetID(),target,J.EActivation_Activate);J.destroy(target);
 sim.step();assert.equal(sim.pendingCollisions.size,0);
 sim.dispose();
});
console.log('Fracture hazard checks passed.');
