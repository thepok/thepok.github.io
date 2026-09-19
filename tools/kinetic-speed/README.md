# KINETIC speed and benchmark integration

Base: user-approved full-game KINETIC 0.1 at main 7e800f9fbdb862083aac6dc02ea2334ebecd97af.

This is the same original engine and complete game, not Jolt. The native code
uses explicit WebAssembly SIMD vectors/projections, cached world primitives and
convex data, cached contact impulse responses, active joint lists, a refitted
body BVH with original candidate ordering, and a cheaper inertia rotation.

**Quality tradeoff is explicit:** large ordinary worlds use 60 Hz internal
substeps, versus the reference kernel's 120 Hz. Startup, small precise scenes,
and enabled vehicle motor hinges retain 120 Hz. The solver iteration settings,
individual rigid bodies, geometry, materials, and physical debris limits are
not reduced. The coarser timestep is not claimed to be a free exact optimization.
Speculative contacts prevent fast thin debris from crossing broad static floors.

The Benchmark button is added to the existing GUI. It launches a dedicated
worker for alternating A/B and B/A runs, pausing the existing game and rendering
to avoid CPU competition. It restores both on finish/cancel. Art-deco, brutalist,
quiet and current-blueprint presets are supported; runs use a fresh world, fixed
shot ticks, warmup and complete destruction/debris phases. JSON contains all raw
step times, kernel hashes, blueprint hash, internal substep count, per-phase
statistics, damage/height/motion traces and aggregate quality gates.

The visible replay uses the original game world and renderer, not a synthetic
demo. It resets the current sandbox, executes the same shot clock and then lets
normal play continue. Additional gameplay inputs are reported as interventions;
only the dedicated A/B worker is the controlled speed measurement.

Readable patched source is produced by apply.py, included in the validation
artifact, and published in source.zip. The compact delta transport is hash-checked
before application and checks each input/output text file. Build uses Clang18,
no fast-math, no foreign physics libraries and zero WASM runtime imports.

Target: >=2x median physics throughput in both 1000-part collapse presets. This
is measured, not assumed. Performance and aggregate checks do not establish
identical trajectories or substitute for looking at the resulting crashes.
