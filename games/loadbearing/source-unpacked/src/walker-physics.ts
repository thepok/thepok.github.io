import { walkerWeaponPitch } from './walker-aim';
import type { V3 } from './catalog';

export interface WalkerControls {
  forward: number;
  right: number;
  yaw: number;
  run: boolean;
  jump: boolean;
  weapon?: 'hammer' | 'cannon';
  fire?: boolean;
  pitch?: number;
  /** Monotonic press sequence; supports taps that begin and end between steps. */
  trigger?: number;
}

export interface WalkerSnapshot {
  /** The character's feet position in world space. */
  position: V3;
  velocity: V3;
  yaw: number;
  grounded: boolean;
  weapon: 'hammer' | 'cannon';
  attackSequence: number;
  attackTime: number;
}

/**
 * A small gameplay wrapper around Jolt's CharacterVirtual. The wrapper owns
 * only the character and query filters; the simulation owns the physics world.
 */
export class WalkerPhysics {
  readonly controls: WalkerControls = { forward: 0, right: 0, yaw: 0, run: false, jump: false, weapon: 'hammer', fire: false, pitch: 0, trigger: 0 };

  private readonly J: any;
  private readonly character: any;
  private readonly shape: any;
  private readonly broadPhaseFilter: any;
  private readonly objectLayerFilter: any;
  private readonly bodyFilter: any;
  private readonly shapeFilter: any;
  private readonly extended: any;
  private readonly allocator: any;
  private readonly gravity: any;
  private readonly desired: any;
  private readonly raySettings: any;
  private readonly ray: any;
  private readonly rayCollector: any;
  private readonly jumpVelocity = 5.8;
  private readonly walkSpeed = 4.2;
  private readonly runSpeed = 7.0;
  private jumpLatch = false;
  private dead = false;
  private spawn: V3;
  private yaw = 0;
  private cooldown = 0;
  private attackSequence = 0;
  private attackTime = -Infinity;
  private weapon: 'hammer' | 'cannon' = 'hammer';
  private lastTrigger: number;
  private pendingTrigger = false;

  constructor(public readonly sim: any, spawn: V3) {
    this.J = sim.J;
    this.spawn = [...spawn] as V3;
    this.lastTrigger = Number.isFinite(this.controls.trigger) ? this.controls.trigger! : 0;
    const J = this.J;
    const system = sim.system;

    // Capsule total height is 2 * half-cylinder + 2 * radius = 1.75 m.
    // The shape offset makes CharacterVirtual's position the feet position.
    const radius = 0.28;
    const halfCylinder = 0.595;
    const capsuleSettings = new J.CapsuleShapeSettings(halfCylinder, radius);
    const shapeResult = capsuleSettings.Create();
    if (!shapeResult.IsValid?.()) {
      J.destroy(capsuleSettings);
      J.destroy(shapeResult);
      throw new Error('Unable to create walker capsule shape');
    }
    this.shape = shapeResult.Get();
    this.shape.AddRef();
    J.destroy(shapeResult);
    J.destroy(capsuleSettings);

    const settings = new J.CharacterVirtualSettings();
    settings.mShape = this.shape;
    settings.mShapeOffset.Set(0, 0.875, 0);
    settings.mUp.Set(0, 1, 0);
    settings.mMaxSlopeAngle = Math.PI / 3;
    settings.mMass = 80;
    settings.mMaxStrength = 1000;
    settings.mPredictiveContactDistance = 0.05;

    const position = new J.RVec3(...this.spawn);
    const rotation = new J.Quat(0, 0, 0, 1);
    this.character = new J.CharacterVirtual(settings, position, rotation, system);
    J.destroy(position);
    J.destroy(rotation);
    J.destroy(settings);

    const objectVsBroadPhase = sim.world.GetObjectVsBroadPhaseLayerFilter();
    const objectPair = sim.world.GetObjectLayerPairFilter();
    this.broadPhaseFilter = new J.DefaultBroadPhaseLayerFilter(objectVsBroadPhase, 1);
    this.objectLayerFilter = new J.DefaultObjectLayerFilter(objectPair, 1);
    this.bodyFilter = new J.BodyFilter();
    this.shapeFilter = new J.ShapeFilter();
    this.extended = new J.ExtendedUpdateSettings();
    this.extended.mStickToFloorStepDown.Set(0, -0.3, 0);
    this.extended.mWalkStairsStepUp.Set(0, 0.23, 0);
    this.extended.mWalkStairsMinStepForward = 0.02;
    this.extended.mWalkStairsStepForwardTest = 0.16;
    this.extended.mWalkStairsStepDownExtra.Set(0, -0.02, 0);
    this.allocator = sim.world.GetTempAllocator();
    this.gravity = new J.Vec3(0, 0, 0);
    this.desired = new J.Vec3(0, 0, 0);
    this.raySettings = new J.RayCastSettings();
    this.ray = new J.RRayCast(new J.RVec3(0, 0, 0), new J.Vec3(0, 0, 0));
    this.rayCollector = new J.CastRayClosestHitCollisionCollector();
  }

  step(dt: number): void {
    if (this.dead) return;
    const c = this.controls;
    const forward = Math.max(-1, Math.min(1, c.forward));
    const right = Math.max(-1, Math.min(1, c.right));
    const length = Math.hypot(forward, right);
    const scale = length > 1 ? 1 / length : 1;
    const f = forward * scale;
    const r = right * scale;
    const sy = Math.sin(c.yaw), cy = Math.cos(c.yaw);
    const speed = c.run ? this.runSpeed : this.walkSpeed;
    const g = this.sim.system.GetGravity();
    this.gravity.Set(g.GetX(), g.GetY(), g.GetZ());
    // CharacterVirtual expects the caller to integrate gravity into its
    // velocity before ExtendedUpdate. Keep support contacts stable by
    // clearing downward velocity while grounded.
    this.character.UpdateGroundVelocity?.();
    const velocity = this.character.GetLinearVelocity();
    const grounded = this.character.IsSupported();
    const support=this.character.GetGroundVelocity();const gx=grounded?support.GetX():0,gz=grounded?support.GetZ():0;
    let vertical = grounded ? support.GetY() : velocity.GetY() + this.gravity.GetY() * dt;
    if (c.jump && !this.jumpLatch && grounded) vertical = this.jumpVelocity;
    this.jumpLatch = c.jump;
    this.desired.Set((sy * f + cy * r) * speed+gx, vertical, (-cy * f + sy * r) * speed+gz);
    this.character.SetLinearVelocity(this.desired);

    this.character.ExtendedUpdate(dt, this.gravity, this.extended, this.broadPhaseFilter,
      this.objectLayerFilter, this.bodyFilter, this.shapeFilter, this.allocator);
    this.yaw = c.yaw;
    this.weapon = c.weapon === 'cannon' ? 'cannon' : 'hammer';
    this.cooldown = Math.max(0, this.cooldown - dt);
    // Fire is level triggered: holding the button repeats after the weapon's
    // simulation-time cooldown, which keeps input handling deterministic.
    const trigger = Number.isFinite(c.trigger) ? c.trigger! : this.lastTrigger;
    if (trigger > this.lastTrigger) { this.lastTrigger = trigger; this.pendingTrigger = true; }
    if ((c.fire || this.pendingTrigger) && this.cooldown === 0) { this.attack(); this.pendingTrigger = false; }
  }

  snapshot(): WalkerSnapshot {
    const p = this.character.GetPosition();
    const v = this.character.GetLinearVelocity();
    return {
      position: [p.GetX(), p.GetY(), p.GetZ()],
      velocity: [v.GetX(), v.GetY(), v.GetZ()],
      yaw: this.yaw,
      grounded: this.character.IsSupported(),
      weapon: this.weapon,
      attackSequence: this.attackSequence,
      attackTime: this.attackTime,
    };
  }

  reset(spawn: V3): void {
    if (this.dead) return;
    this.spawn = [...spawn] as V3;
    const p = new this.J.RVec3(...spawn);
    this.character.SetPosition(p);
    this.J.destroy(p);
    this.desired.Set(0, 0, 0);
    this.character.SetLinearVelocity(this.desired);
    this.jumpLatch = false;
    this.cooldown = 0;
    this.lastTrigger = Number.isFinite(this.controls.trigger) ? this.controls.trigger! : 0;
    this.pendingTrigger = false;
  }

  dispose(): void {
    if (this.dead) return;
    this.dead = true;
    const J = this.J;
    J.destroy(this.character);
    J.destroy(this.extended);
    J.destroy(this.broadPhaseFilter);
    J.destroy(this.objectLayerFilter);
    J.destroy(this.bodyFilter);
    J.destroy(this.shapeFilter);
    J.destroy(this.gravity);
    J.destroy(this.desired);
    J.destroy(this.raySettings);
    J.destroy(this.ray);
    J.destroy(this.rayCollector);
    this.shape.Release();
  }

  private attack(): void {
    const pitch = walkerWeaponPitch(this.weapon,this.controls.pitch ?? 0);
    const cp = Math.cos(pitch), sp = Math.sin(pitch), sy = Math.sin(this.controls.yaw), cy = Math.cos(this.controls.yaw);
    const direction: V3 = [sy * cp, sp, -cy * cp];
    const position = this.character.GetPosition();
    const origin: V3 = [position.GetX()+.32*cy, position.GetY() + 1.25, position.GetZ()+.32*sy];
    if (this.weapon === 'cannon') {
      const muzzle: V3 = origin.map((v, axis) => v + direction[axis] * .65) as V3;
      // Do not spawn a projectile beyond a nearby obstruction.
      if (!this.rayHit(origin, direction, .65)) this.sim.launchProjectile(muzzle, direction.map(v => v * 125) as V3, 100, .12);
      this.cooldown = .35;
    } else {
      this.hammerHit(origin, direction);
      this.cooldown = .45;
    }
    this.attackSequence++;
    this.attackTime = this.sim.elapsed ?? 0;
  }

  private hammerHit(origin: V3, direction: V3): void {
    const hit = this.rayHit(origin, direction, 2.8);
    const closest = hit?.item;
    if (!closest) return;
    const point = origin.map((v, axis) => v + direction[axis] * 2.8 * hit!.fraction) as V3;
    if (closest.body.GetMotionType?.() === this.J.EMotionType_Dynamic) {
      const impulse = new this.J.Vec3(...direction.map(v => v * 6000));
      closest.body.AddImpulse(impulse);
      this.J.destroy(impulse);
    }
    if (typeof this.sim.impactFracture === 'function') this.sim.impactFracture(closest, point, 900000);
    else if (typeof this.sim.fracture === 'function') this.sim.fracture(closest, point);
  }

  private rayHit(origin: V3, direction: V3, distance: number): { item: any; fraction: number } | undefined {
    const J = this.J, start = this.ray.mOrigin, vector = this.ray.mDirection;
    start.Set(...origin); vector.Set(...direction.map(value => value * distance));
    this.rayCollector.Reset();
    this.sim.system.GetNarrowPhaseQuery().CastRay(this.ray, this.raySettings, this.rayCollector,
      this.broadPhaseFilter, this.objectLayerFilter, this.bodyFilter, this.shapeFilter);
    if (!this.rayCollector.HadHit()) return undefined;
    const result = this.rayCollector.get_mHit();
    const hitBodyId = result.mBodyID ?? result.GetBodyID?.();
    const bodyId = hitBodyId?.GetIndexAndSequenceNumber?.() ?? hitBodyId?.GetIndex?.();
    const item = (this.sim.items ?? []).find((candidate: any) => {
      const id = candidate.body?.GetID?.();
      return id && (id.GetIndexAndSequenceNumber?.() ?? id.GetIndex?.()) === bodyId;
    });
    return { item, fraction: result.mFraction ?? result.GetFraction?.() ?? 0 };
  }
}


