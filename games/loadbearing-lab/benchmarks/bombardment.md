# Sustained building bombardment — 2026-09-15

The realistic rubble workload does not benefit from the experimental rigid clusters: no cluster formed, no bodies were saved, and both variants failed after 105 shots. This is a failed stress test, not a completed 120-shot pass.

## Reproduction

Run `node tests/bombardment-benchmark.mjs` from the structural lab. It generates a fixed, anchored 1,000-part Art deco building (seed 72000, height 64 m), waits for startup settling, and launches up to 120 balls: 10 tonnes, 100 m/s, radius 0.75 m, one every 0.15 simulated seconds. Shots target lower supports, the structure, then its rubble footprint. Fragment limit: 3,000. Requested duration: 25 simulated seconds, fixed 1/60 step. Fixtures, shots, per-step records and results are saved beside this report.

Native comparison: Node 24.18.0, single-thread Jolt WASM package 1.1.0, Intel i7-9850H. Separate OFF and ON processes. These timings exclude rendering and worker transport and are not browser FPS. One pair is insufficient to claim a relative timing improvement.

| Recorded result | Clusters OFF | Clusters ON |
|---|---:|---:|
| Shots launched before failure | 105 | 105 |
| Peak fragments | 3,000 | 3,000 |
| Peak active bodies | 3,620 | 3,620 |
| Maximum bodies saved by clusters | 0 | 0 |
| Rubble phase median step | 353 ms | 303 ms |
| Rubble phase p95 step | 516 ms | 411 ms |
| Rubble mean Jolt step | 276 ms | 248 ms |
| Rubble mean projectile damage checks | 79 ms | 66 ms |

All 1,000 successfully recorded steps match on fragment count, broken links, fractured original parts, allocated/live/awake bodies, live rebars and shots. Last successful step: t=16.667, 591 original parts fractured, 2,171 links broken, 3,474 live bodies. Timing differences are not evidence of cluster benefit because clusters never activated.

## Failure

Both runs fail at t=16.683 with 8,367 cumulatively allocated bodies. A WASM `null function or function signature mismatch` occurs while reading a body's position in projectile damage checks; cleanup subsequently reports an out-of-bounds memory access.

The game assigns each new body a collision sub-group ID equal to `bodyList.length`, but its collision group table has only 8,192 entries. Removed bodies remain in that list until reset. The first recorded allocation count beyond capacity occurs at t=16.517 in both runs, shortly before failure. This is a concrete invalid-ID bug and the leading explanation for the later memory corruption; confirming causality requires fixing it and rerunning this exact test. The 3,000-fragment cap does not bound cumulative allocation. Jolt's GroupFilterTable requires sub-group IDs within its configured capacity.

## Actual browser cross-check

`node tests/bombardment-browser.mjs`: production preview, headless Chrome at 1440×900, actual multithread worker with eight threads, clusters OFF. Reuses the fixture and shot schedule, but sends shots at client snapshots rather than exact native steps, so outcomes are not a deterministic A/B comparison.

It completes 10 simulated seconds in 91.3 wall seconds with 61 balls launched, 3,000 fragments and 1,793 broken links. No page errors. At the final snapshot the physics step is 204 ms: 79 ms Jolt, 123 ms game damage checks, 2 ms other work. Reported render rate is about 11 FPS on this headless test machine, not a measurement of the user's browser. The shorter browser run does not establish long-run stability.

## Next priorities

1. Safely reclaim retired body resources and collision IDs; merely increasing the limit postpones failure.
2. Narrow projectile damage candidate searches. With eight engine workers, these serial game checks can exceed Jolt's step cost.
3. Repeat this benchmark after either change, comparing destruction outcomes as well as timings. Existing intact-section clustering does not address this fragmented, rebar-connected rubble case.

No engine or stable-game changes were made for this benchmark.
