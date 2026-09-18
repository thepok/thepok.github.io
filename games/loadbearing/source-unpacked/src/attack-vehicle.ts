import { VEHICLE_PRESETS } from './vehicle-blueprint';
import type { V3 } from './catalog';
import { VehiclePhysics } from './vehicle-physics';
import { demoVehicleControls } from './demo-driving';

const STRUCTURAL = new Set(['foundation', 'column', 'wall', 'doorway', 'deck', 'slab', 'stairwell', 'stair', 'truss', 'girder', 'brace', 'facade', 'core']);

/** Autonomous bombardment vehicle. It borrows the real vehicle/cannon path and
 * deliberately does not become Simulation.vehicle (the player's vehicle). */
export class AttackVehicle {
  readonly vehicle: VehiclePhysics;
  readonly center: V3;
  readonly orbitRadius: number;
  enabled = true;
  shots = 0;
  private elapsed = 0;
  private targetIndex = 0;

  constructor(public readonly sim: any) {
    const structural = (sim.items ?? []).filter((item: any) => item.id > 0 && STRUCTURAL.has(item.sourceKind ?? item.kind));
    this.center = structural.length ? structural.reduce((out: V3, item: any) => out.map((v, i) => v + item.initial[i] / structural.length) as V3, [0, 0, 0]) : [0, 0, 0];
    let footprint = 0;
    for (const item of structural) {
      footprint = Math.max(footprint, Math.hypot(item.initial[0] - this.center[0], item.initial[2] - this.center[2]));
      const bounds = item.body.GetWorldSpaceBounds?.();
      if (bounds) {
        const lo = bounds.mMin, hi = bounds.mMax;
        for (const x of [lo.GetX(), hi.GetX()]) for (const z of [lo.GetZ(), hi.GetZ()]) footprint = Math.max(footprint, Math.hypot(x - this.center[0], z - this.center[2]));
      }
    }
    this.orbitRadius = Math.max(25, footprint + 12);
    const origin = this.safeSpawn();
    this.vehicle = new VehiclePhysics(sim, VEHICLE_PRESETS[2].parts, origin, -60000);
  }

  private safeSpawn(): V3 {
    // Start outside the building and choose the first clear point away from
    // the player vehicle and physical tree roots.
    const trees = simTrees(this.sim);
    for (let n = 0; n < 16; n++) {
      const angle = .45 + n * Math.PI * 2 / 16;
      const candidate: V3 = [this.center[0] + Math.sin(angle) * this.orbitRadius, 0, this.center[2] + Math.cos(angle) * this.orbitRadius];
      const player = this.sim.vehicle?.chassis?.GetPosition?.();
      if (player && Math.hypot(candidate[0] - player.GetX(), candidate[2] - player.GetZ()) < 18) continue;
      if (trees.some((tree: any) => Math.hypot(candidate[0] - tree.spec.x, candidate[2] - tree.spec.z) < 5)) continue;
      return candidate;
    }
    return [this.center[0], 0, this.center[2] + this.orbitRadius];
  }

  private target(): V3 {
    const targets = (this.sim.items ?? []).filter((item: any) => item.id > 0 && !item.fractured && !item.retired && item.kind !== 'foundation' && STRUCTURAL.has(item.sourceKind ?? item.kind) && item.body.GetCenterOfMassPosition().GetY() > .5);
    if (!targets.length) return [this.center[0], 3, this.center[2]];
    const item = targets[this.targetIndex % targets.length];
    const p = item.body.GetCenterOfMassPosition();
    return [p.GetX(), p.GetY(), p.GetZ()];
  }

  step(dt: number) {
    this.elapsed += dt;
    if (!this.enabled) {
      this.vehicle.controls = { ...this.vehicle.controls, throttle: 0, steer: 0, brake: true, fire: false };
      this.vehicle.step(dt);
      return;
    }
    const p = this.vehicle.chassis.GetPosition(), q = this.vehicle.chassis.GetRotation();
    const aim = this.target();
    const controls = demoVehicleControls([p.GetX(), p.GetY(), p.GetZ()], [q.GetX(), q.GetY(), q.GetZ(), q.GetW()], this.center, this.elapsed, this.orbitRadius, aim);
    this.vehicle.controls = controls;
    const projectilesBefore = this.sim.projectiles ?? 0;
    this.vehicle.step(dt);
    const projectilesAfter = this.sim.projectiles ?? 0;
    if (projectilesAfter > projectilesBefore) {
      this.shots += projectilesAfter - projectilesBefore;
      this.targetIndex++;
    }
  }

  afterStep() { this.vehicle.afterStep(); }
  setEnabled(enabled: boolean) { this.enabled = !!enabled; if (!this.enabled) this.vehicle.controls.fire = false; }
  dispose() { this.vehicle.dispose(); }
}

function simTrees(sim: any): any[] { return sim.trees?.trees ?? []; }
