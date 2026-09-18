# LOAD BEARING — Custom Engine Lab 0.1

A standalone, original JavaScript physics prototype. No Jolt, Rapier, Ammo,
Cannon, Three.js, external scripts, build step, or saved-game access.

Live: https://thepok.github.io/games/loadbearing-engine-lab/

## First test

Press **Neu + leichter Treffer oben**. The default 24-storey tower receives a
12-tonne projectile at 85 m/s, at 93% of the tower height. It oscillates and
recovers. Press **Neu + schwerer Treffer oben** for the same scene with a
400-tonne projectile. The intended regression is a remote base failure after
the upper impact, followed by toppling and ground-impact fragmentation.
Masses are deliberately adjustable game parameters, not realistic ball density.
The two preset buttons reset height and capacity to their test defaults.

Drag to orbit; wheel to zoom; right-drag or Shift-drag to pan. Touch supports
one-finger orbit. The camera reset button restores the overview. Lastfarben
shows **aggregate storey utilization**, not stress in every individual column.
The initial tower has 24 storeys, 72 m height and 1,152 logical/rendered parts.
Those are **24 reduced structural nodes**, not 1,152 independent rigid bodies.

## What is implemented

* Two Euler–Bernoulli beam planes with displacement and slope at each storey;
  separate axial and torsional spring systems. Gravity is initialized in axial
  equilibrium. A linearized compressive geometric-stiffness term models an
  approximation of P–delta amplification. This is not full nonlinear FEM.
* A global symmetric banded Cholesky solve, half-bandwidth three. Factorizations
  are reused until topology, mass or quantized damage stiffness changes. Backward
  Euler, fixed 1/120 s, mass/stiffness damping. No variable-quality timestep.
* End forces/moments drive a game-tuned axial/bending/shear/torsion capacity
  envelope and accumulated damage. Failure is not hard-coded to the base. There
  is no "top hit means base breaks" condition. A stronger-material regression
  survives the same projectile. Glass loss does not reduce column stiffness.
* Swept projectiles against individual attached-part bounds. Local removal
  reduces mass and, for columns, effective section stiffness. Rigid-body impulse
  response includes the point-of-impact rotational effective mass.
* Detached connected upper sections become compound rigid bodies. Their mass,
  centre of mass, full inertia tensor and total linear/angular momentum are
  computed from constituent part states. Hard ground contact releases storeys;
  splitting conserves mass and both momenta. No artificial scatter impulse.
* Original oriented-box contact solver, ground friction, sleeping, bounded
  contact penetration correction and sweep-and-prune broad phase. Web Worker
  physics and instanced WebGL2 rendering, with a Canvas2D software preview when
  WebGL2 is unavailable. The software preview is slower and lacks shadows.

## Important limitations

This is an **engine experiment, not a replacement for the complete game**.
The generator is a regular single tower, not the original arbitrary building
blueprint system. Intact storeys are assumed rigid. Large attached deflection,
rebar, local column buckling, general frame connectivity and detailed concrete
fracture are not modeled at the fidelity of the original game. Axial, bending
and torsional dynamics are reduced and mostly decoupled. Material values are
calibrated game values, not engineering-grade parameters.

Free storeys/sections use enclosing oriented boxes for mutual contact; their
hollow interiors are not collision meshes. Ground contact uses per-storey
proxies rather than a single loose hull around a bent tower. Contacts with the
remaining attached tower treat its storeys as static hulls: debris impact loads
are **not yet fed back into the beam equations**. Projectile loads are fed back.
The swept-sphere test expands boxes, which is conservative at corners. The
small-deformation structural model switches to rigid sections after failure;
it does not continue a geometrically exact deformable solve during toppling.
A bounded fragment budget retains larger aggregates instead of silently deleting
active mass. A removed part is currently one rigid shard, not a fractured mesh.
There are no vehicles, walking controls, water, campaign or blueprint imports.

## Performance and evidence

The UI reports rolling **worker step time**, its p95, separately measured
simulation/wall-clock rate, and render FPS. The 15-second / five-shot benchmark
runs 1,800 fixed steps in a separate fresh instance. JSON includes phase counts,
mean, p95, maximum, physics wall time, failure history and final body counts.
Initialization, snapshot serialization, rendering and OS scheduling are not in
its per-step timings. The benchmark temporarily blocks the live worker, then
resumes the existing scene. It is deliberately not an FPS benchmark.

**A lower step time here does not prove that this beats Jolt at equal quality.**
The degrees of freedom and collision model differ substantially. No matched
Jolt benchmark or full-game speedup is claimed. The next integration gate is
matched scenarios, destruction behavior and visual comparison in the original
building system, not a raw comparison to historical CI milliseconds.

## Run / test

Serve the repository with an HTTP server (ES modules/workers require HTTP(S)):

```sh
python3 -m http.server 8777
# Open /games/loadbearing-engine-lab/
node games/loadbearing-engine-lab/tests/engine.test.mjs
```

The dependency-free Node test suite checks analytical cantilever deflection
and base reaction, gravity equilibrium, elastic recovery, remote base failure,
a stronger surviving structure, momentum-preserving splits, settling/sleep,
deterministic fixed-tick replay, and invalid input rejection.

`tests/browser.mjs` additionally uses @playwright/test 1.55.0 to test actual
module workers, controls, the benchmark, WebGL errors and mobile layout. Its
screenshots and measured JSON are uploaded by the publication workflow. No
absolute timing thresholds are used, since CI hardware is not controlled.

## Formulation references

The implementation is original; standard beam equations are documented in:

* TU Delft, Euler–Bernoulli beam element stiffness and equivalent nodal forces:
  https://teachbooks.tudelft.nl/computational-modelling/structural_linear/euler_bernouilli.html
* Jolt architecture (comparison context, not a dependency):
  https://jrouwe.github.io/JoltPhysics/

This lab is for a destruction game, never structural safety assessment.
