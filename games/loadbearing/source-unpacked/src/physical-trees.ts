import type { Simulation, DynamicItem } from './physics';
import type { V3 } from './catalog';

export interface TreeSpec { x: number; y: number; z: number; height: number }

export interface PhysicalTree {
  item: DynamicItem;
  spec: TreeSpec;
  constraint: any;
  broken: boolean;
  overloadTime: number;
  forceLimit: number;
}

/** Small, deliberately bounded physical stand-ins for the decorative trees. */
export class PhysicalTrees {
  public readonly trees: PhysicalTree[] = [];
  public broken = 0;
  private disposed = false;

  constructor(public readonly sim: Simulation, specs: TreeSpec[]) {
    const J = sim.J;
    for (const [index, raw] of specs.slice(0, 40).entries()) {
      const spec: TreeSpec = {
        x: Number.isFinite(raw.x) ? raw.x : 0,
        y: Number.isFinite(raw.y) ? Math.max(0, raw.y) : 0,
        z: Number.isFinite(raw.z) ? raw.z : 0,
        height: Number.isFinite(raw.height) ? Math.max(1, Math.min(24, raw.height)) : 1,
      };
      const h = spec.height;
      const trunkHeight = Math.max(.45, h * .56);
      const trunkWidth = Math.max(.12, Math.min(.48, h * .075));
      const canopyWidth = Math.max(.55, h * .52);
      const compound = new J.StaticCompoundShapeSettings();
      this.addBox(J, compound, [trunkWidth, trunkHeight, trunkWidth], [0, trunkHeight / 2, 0]);
      // Three overlapping-free tiers approximate the visual canopy without
      // spawning dozens of foliage bodies.
      for (let tier = 0; tier < 3; tier++) {
        const width = canopyWidth * (1 - tier * .18);
        const boxHeight = Math.max(.3, h * .22);
        const centerY = h * (.59 + tier * .13);
        this.addBox(J, compound, [width, boxHeight, width * .86], [0, centerY, 0]);
      }
      const result = compound.Create();
      const shape = result.Get();
      const q = new J.Quat(0, 0, 0, 1);
      const root: V3 = [spec.x, spec.y, spec.z];
      const mass = Math.max(18, h * h * h * 5.5);
      const body = sim.makeBody(shape, root, q, mass);
      J.destroy(q); J.destroy(result); J.destroy(compound);

      const item: DynamicItem = { body, id: -20000 - index, kind: 'tree', initial: [root[0], root[1], root[2]], stress: 0 };
      sim.items.push(item);
      const settings = new J.SixDOFConstraintSettings();
      for (let axis = 0; axis < 6; axis++) settings.MakeFixedAxis(axis);
      // Jolt constraint positions use world space for both bodies. The tree
      // body is rooted at its spec position, while the ground is the support.
      settings.mPosition1.Set(spec.x, spec.y, spec.z);
      settings.mPosition2.Set(spec.x, spec.y, spec.z);
      const constraint = J.castObject(settings.Create(body, sim.ground), J.SixDOFConstraint);
      sim.system.AddConstraint(constraint);
      J.destroy(settings);
      this.trees.push({ item, spec, constraint, broken: false, overloadTime: 0, forceLimit: Math.max(900, mass * 9.81 * 1.35) });
    }
  }

  private addBox(J: any, compound: any, size: V3, center: V3) {
    const half = new J.Vec3(size[0] / 2, size[1] / 2, size[2] / 2);
    const box = new J.BoxShapeSettings(half, .02);
    const position = new J.Vec3(...center);
    const axis = new J.Vec3(0, 1, 0);
    const rotation = J.Quat.prototype.sRotation(axis, 0);
    compound.AddShape(position, rotation, box);
    J.destroy(half); J.destroy(position); J.destroy(axis); J.destroy(rotation);
  }

  /** Apply wind loads immediately before Simulation.step(). */
  beforeStep(dt: number) {
    if (this.disposed) return;
    const wind=this.sim.hazardActive('wind'),flood=this.sim.water>0;
    if(!wind&&!flood)return;
    const age = this.sim.hazardAge('wind');
    const ramp = Math.min(1, Math.max(0, (age - 1) / 3));
    const gust = 1 + .24 * Math.sin(age * 3) + .12 * Math.sin(age * 7);
    const speed = 58 * this.sim.intensity * ramp * gust;
    const direction = [1, 0, .28] as const;
    for (const tree of this.trees) {
      const h = tree.spec.height;
      const area = Math.PI * Math.pow(Math.max(.35, h * .24), 2);
      const force = area * .62 * speed * speed * (1 + h / 18);
      if(wind)this.sim.force(tree.item, direction[0] * force * (tree.broken?.25:1), 0, direction[2] * force * (tree.broken?.25:1));
      if(flood){const body=tree.item.body,p=body.GetCenterOfMassPosition(),submerged=Math.max(0,Math.min(1,(this.sim.water-p.GetY()+h*.4)/(h*.8))),v=body.GetLinearVelocity();const mass=Math.max(18,h*h*h*5.5);this.sim.force(tree.item,submerged*(1800*this.sim.intensity-v.GetX()*250),submerged*(mass/650*1000*9.81-v.GetY()*250),submerged*300);}

    }
    void dt;
  }

  /** Evaluate root constraint impulses after Simulation.step(). */
  afterStep(dt: number) {
    if (this.disposed || dt <= 0) return;
    const elapsed = this.sim.elapsed;
    for (const tree of this.trees) {
      if (tree.broken || elapsed < .5) continue;
      const positionLambdaValue = tree.constraint.GetTotalLambdaPosition();
      // Vertical lambda mostly counters gravity at the root. Wind and impact
      // loads are measured in the horizontal plane so a calm tree stays put.
      const positionLambda = Math.hypot(positionLambdaValue.GetX(), positionLambdaValue.GetZ()) / dt;
      const rotationLambda = tree.constraint.GetTotalLambdaRotation();
      const moment = rotationLambda ? rotationLambda.Length() / dt / Math.max(tree.spec.height, 1) : 0;
      const load = Math.max(positionLambda, moment);
      tree.item.stress = Math.max(tree.item.stress, load / tree.forceLimit);
      if (load > tree.forceLimit) tree.overloadTime += dt * Math.min(8, load / tree.forceLimit - 1);
      else tree.overloadTime = Math.max(0, tree.overloadTime - dt * .5);
      if (tree.overloadTime > .08) {
        this.sim.system.RemoveConstraint(tree.constraint);tree.constraint=undefined;
        tree.broken = true;
        this.broken++;
      }
    }
  }

  /** Convenience hook for callers that own neither side of the world step. */
  update(dt: number) { this.beforeStep(dt); this.afterStep(dt); }

  dispose() {
    if (this.disposed) return;
    this.disposed = true;
    for (const tree of this.trees) if(!tree.broken)this.sim.system.RemoveConstraint(tree.constraint);
    this.trees.length = 0;
  }
}
