import assert from 'node:assert/strict';
import { build } from 'esbuild';
import { rm } from 'node:fs/promises';
import { join } from 'node:path';
import { pathToFileURL } from 'node:url';

const bundlePath = join(process.cwd(), 'tests', '.glass-breakage-fresh.mjs');
await build({ stdin: { contents: "export { Simulation, loadPhysics } from './src/physics.ts'; export { generateDemolitionBuilding } from './src/procedural-buildings.ts';", resolveDir: process.cwd() }, bundle: true, platform: 'node', format: 'esm', external: ['jolt-physics'], outfile: bundlePath });
try {
  const { Simulation, loadPhysics, generateDemolitionBuilding } = await import(`${pathToFileURL(bundlePath).href}?fresh=${Date.now()}`);
  const J = await loadPhysics();
  const dt = 1 / 60;
  const facade = { id: 2, kind: 'facade', p: [0, 0, 0], rotation: 0 };
  const foundation = { id: 1, kind: 'foundation', p: [0, 0, 0], rotation: 0 };
  const frameColumn = { id: 3, kind: 'column', p: [0, 0, 0], rotation: 0 };

  const stableSim = new Simulation(J, [foundation, facade], 'sandbox', 1, { sandbox: true });
  try {
    const stablePanel = stableSim.items.find(item => item.id === 2);
    assert.ok(stableSim.glassFrames?.get(stablePanel)?.length, 'facade has concrete glass frame edge references');
    for (let i = 0; i < 120; i++) stableSim.step(dt);
    assert.ok(!stableSim.items.find(item => item.id === 2)?.fractured, 'supported stationary glass remains intact');
  } finally { stableSim.dispose(); }

  const translateSim = new Simulation(J, [foundation, frameColumn, facade], 'sandbox', 1, { sandbox: true });
  try {
    const panel = translateSim.items.find(item => item.id === 2);
    const edges = translateSim.glassFrames.get(panel);
    assert.ok(edges?.length, 'translated panel has frame edges');
    const moved = new Set([panel, ...edges.map(edge => edge.support)]);
    for (const item of moved) {
      const p = item.body.GetPosition(), q = item.body.GetRotation();
      const next = new J.RVec3(p.GetX() + .35, p.GetY(), p.GetZ());
      translateSim.bodies.SetPositionAndRotation(item.body.GetID(), next, q, J.EActivation_Activate);
      J.destroy(next);
    }
    translateSim.updateGlassDamage(1);
    assert.ok(!panel.fractured, 'rigidly translating glass and its frame together does not fracture it');
  } finally { translateSim.dispose(); }

  const rackSim = new Simulation(J, [foundation, frameColumn, facade], 'sandbox', 1, { sandbox: true });
  try {
    const panel = rackSim.items.find(item => item.id === 2);
    const edge = rackSim.glassFrames.get(panel)?.find(candidate => candidate.support.kind === 'column');
    assert.ok(edge, 'racked panel has a frame edge');
    const p = edge.support.body.GetPosition(), q = edge.support.body.GetRotation();
    const next = new J.RVec3(p.GetX() + .35, p.GetY(), p.GetZ());
    rackSim.bodies.SetPositionAndRotation(edge.support.body.GetID(), next, q, J.EActivation_Activate);
    J.destroy(next);
    rackSim.updateGlassDamage(1);
    rackSim.updateGlassDamage(2);
    assert.ok(panel.fractured, 'displacing one frame support fractures strained glass');
  } finally { rackSim.dispose(); }

  const freefallSim = new Simulation(J, [{ id: 2, kind: 'facade', p: [0, 8, 0], rotation: 0 }], 'sandbox', 1, { sandbox: true });
  try {
    for (let i = 0; i < 240; i++) freefallSim.step(dt);
    assert.ok(freefallSim.items.find(item => item.id === 2)?.fractured, 'unsupported falling glass breaks at ground impact');
  } finally { freefallSim.dispose(); }

  const frameSim = new Simulation(J, [foundation, { id: 3, kind: 'column', p: [0, 0, 0], rotation: 0 }, facade], 'sandbox', 1, { sandbox: true });
  try {
    const column = frameSim.items.find(item => item.id === 3);
    const panel = frameSim.items.find(item => item.id === 2);
    assert.ok(column && panel);
    frameSim.impactFracture(column, [0, 2, 0], 900000);
    for (let i = 0; i < 120; i++) frameSim.step(dt);
    console.log(JSON.stringify({ frameCollapseGlassFractured: !!panel.fractured, broken: frameSim.broken, fragments: frameSim.fragments }));
    assert.ok(panel.fractured, 'glass fractures after its supporting frame collapses');
  } finally { frameSim.dispose(); }

  const glassImpact = new Simulation(J, [{ id: 2, kind: 'facade', p: [0, 0, -3], rotation: 0 }], 'sandbox', 1, { sandbox: true });
  try {
    glassImpact.launchProjectile([2, 2, 2], [0, 0, -100], 2, .1);
    for (let i = 0; i < 8; i++) glassImpact.step(dt);
    assert.ok(glassImpact.items.find(item => item.id === 2)?.fractured, '10 kJ projectile breaks fragile glass');
  } finally { glassImpact.dispose(); }

  const concreteImpact = new Simulation(J, [{ id: 2, kind: 'wall', p: [0, 0, -3], rotation: 0 }], 'sandbox', 1, { sandbox: true });
  try {
    concreteImpact.launchProjectile([2, 2, 2], [0, 0, -100], 2, .1);
    for (let i = 0; i < 8; i++) concreteImpact.step(dt);
    assert.ok(!concreteImpact.items.find(item => item.id === 2)?.fractured, '10 kJ projectile does not break concrete');
  } finally { concreteImpact.dispose(); }

  const generated = generateDemolitionBuilding(1000, 72000, 'art-deco');
  const generatedSim = new Simulation(J, generated.pieces, 'sandbox', 1, { sandbox: true, fragmentLimit: 156 });
  try {
    const settle = await generatedSim.settleStartup();
    for (let i = 0; i < 300; i++) generatedSim.step(dt);
    const brokenGlass = generatedSim.items.filter(item => item.kind === 'facade' && item.fractured).length;
    console.log(JSON.stringify({ generatedParts: generated.pieces.length, settleSteps: settle?.steps ?? null, quiet: settle?.quiet ?? false, brokenGlass }));
    assert.ok(settle?.quiet, 'generated art-deco fixture settles quietly');
    assert.equal(brokenGlass, 0, 'generated art-deco glass remains intact without impact');
  } finally { generatedSim.dispose(); }
  console.log('glass breakage: support, frame collapse, fragile energy threshold, and generated stability passed');
} finally { await rm(bundlePath, { force: true }); }
