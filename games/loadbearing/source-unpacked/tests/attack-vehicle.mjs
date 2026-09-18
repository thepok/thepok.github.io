import { build } from 'esbuild';
import assert from 'node:assert/strict';

await build({ stdin: { contents: "export {Simulation,loadPhysics} from './src/physics.ts'; export {AttackVehicle} from './src/attack-vehicle.ts'; export {VEHICLE_PRESETS} from './src/vehicle-blueprint.ts'; export {showcasePieces} from './src/showcases.ts';", resolveDir: process.cwd() }, bundle: true, platform: 'node', format: 'esm', external: ['jolt-physics'], outfile: 'artifacts/attack-vehicle-test.mjs' });
const { Simulation, loadPhysics, AttackVehicle, VEHICLE_PRESETS, showcasePieces } = await import('../artifacts/attack-vehicle-test.mjs?' + Date.now());
const J = await loadPhysics();
const sim = new Simulation(J, showcasePieces('grand-hall'), 'sandbox', 1, { sandbox: true, vehicleParts: VEHICLE_PRESETS[2].parts, fragmentLimit: 6000 });
const attacker = new AttackVehicle(sim); sim.attacker = attacker;
sim.setSandboxHazard?.('attack', true);
const run = (seconds) => { const dt = 1 / 30; for (let i = 0; i < Math.round(seconds / dt); i++) sim.step(dt); };
try {
  const playerStart = sim.vehicle.chassis.GetPosition(), playerStartXZ = [playerStart.GetX(), playerStart.GetZ()];
  const attackerStart = attacker.vehicle.chassis.GetPosition(), attackerStartXZ = [attackerStart.GetX(), attackerStart.GetZ()];
  const structural = sim.items.filter(i => i.id > 0 && i.kind !== 'foundation');
  run(12);
  const playerEnd = sim.vehicle.chassis.GetPosition(), playerEndXZ = [playerEnd.GetX(), playerEnd.GetZ()];
  const attackerEnd = attacker.vehicle.chassis.GetPosition(), attackerEndXZ = [attackerEnd.GetX(), attackerEnd.GetZ()];
  const drive = Math.hypot(attackerEndXZ[0] - attackerStartXZ[0], attackerEndXZ[1] - attackerStartXZ[1]);
  const playerDrive = Math.hypot(playerEndXZ[0] - playerStartXZ[0], playerEndXZ[1] - playerStartXZ[1]);
  const damaged = structural.filter(i => i.fractured).length;
  const av=attacker.vehicle.chassis.GetLinearVelocity(); console.log('attacker active', { shots: attacker.shots, projectiles: sim.projectiles, drive, playerDrive, damaged, broken: sim.broken, start:attackerStartXZ, end:attackerEndXZ, velocity:[av.GetX(),av.GetY(),av.GetZ()], controls:attacker.vehicle.controls });
  assert.ok(drive > 2, `attacker must drive; moved ${drive}`);
  assert.ok(attacker.shots >= 2, `attacker must fire at least twice; shots ${attacker.shots}`);
  assert.ok(damaged > 0 || sim.broken > 0, 'attacker fire should damage the showcase');

  attacker.setEnabled(false);
  const offProjectiles = sim.projectiles;
  run(2);
  assert.equal(sim.projectiles, offProjectiles, 'disabled attacker must stop firing');
  const afterOff = attacker.vehicle.chassis.GetPosition();
  assert.equal(attacker.vehicle.controls.brake, true, 'disabled attacker should apply brakes');
  const bodyCount = sim.bodyList.length;

  for (let i = 0; i < 10; i++) { attacker.setEnabled(true); attacker.setEnabled(false); }
  assert.equal(sim.bodyList.length, bodyCount, 'toggling must not spawn bodies');
  const ids = sim.items.filter(i => i.id <= -50000).map(i => i.id);
  assert.equal(new Set(ids).size, ids.length, 'player and attacker vehicle IDs must remain unique');
  console.log('PASS autonomous attacker coexistence, drive/fire/damage, disable braking, and toggle stability');
} finally { sim.dispose(); }
