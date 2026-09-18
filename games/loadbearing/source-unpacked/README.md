# Load Bearing

A playable 3D construction sandbox inspired by Pontifex, built with Three.js and Jolt Physics WebAssembly. Construct solid modular structures, apply loads, inspect connection stress, and rebuild after failure.

## Play locally

```sh
npm install
npm run dev -- --port 5173
```

Open http://localhost:5173. For the production build, run `npm run build` then `npm run preview -- --port 5174`.

## Included

- **Bridges:** 24 m crossing, a physical truck with four motorized wheel hinges, heavy freight, and a restricted steel budget.
- **Resilience:** earthquake and aftershock towers, windstorms with gust-driven leaves and bending trees, rising water/current, and retaining walls that protect a house from physical rockfalls.
- **Occupancy:** six waves of floor contents, totaling 50.4 tonnes on the reference building at standard intensity. Cargo actually rests on the slabs. Warehouse variant increases the load.
- **Glass fracture:** six irregular triangular prisms tile each original pane without losing glass area. The renderer and convex collision shapes share the same vertices.
- **Demolition:** free play with aimed heavy projectiles, adjustable mass/radius/speed, and continuous physics without a time limit. Independently toggle wind, earthquakes, rising water and meteor showers during sandbox play, including combined disasters. Meteors have glowing trails and physical impacts; a 24-body pool bounds long-running showers. Trees have physical trunks and crowns with breakable roots, respond to wind and water, and can be toppled by impacts.
- **Campaign:** 18 sequential levels in three tiers, saved unlocks and best construction costs. Start with a bridge repair; later levels increase truck weight, tower height and disaster loads. Campaign intensity is fixed. Building goals require a connected, anchored building with usable floor slabs at every 4 m storey: 32 / 48 / 64 m² per storey by tier. Final scoring checks surviving support joints, floor height and orientation; a tall column or fallen roof cannot satisfy the goal. The sidebar shows missing storeys and area. Every untouched campaign starter must lose, including easy levels.
- **Five reusable assemblies:** column walls, supported floors, braced frames, retaining modules and bridge spans. Place/rotate a whole group; shared columns are reused, and undo removes the placement as one action.
- **Seven demolition buildings:** Maison Azur terraced villa, Aurora glass tower, Hafenwerft industrial hall, stepped highrise, braced tower, grand hall and twin towers, selectable under Sandbox → Gebäude. All remain ordinary breakable physical elements.
- **15 workshop challenge presets**, 9 volumetric building elements (including breakable framed glass facades), reference designs, empty blueprints, undo/redo, stress overlay, camera views, and local saves plus JSON import/export.

## Shared sandbox world

Sandbox combines construction, demolition and vehicles in one persistent scene. The toolbar offers Bauen, Gebäude, Fahrzeuge, Beschuss and Naturkräfte; the other top-level modes are Herausforderungen and Demo.

Buildings and vehicle presets first show a placement preview. Place multiple vehicles, click one to drive (`E` enters/exits), edit its blueprint, duplicate it or assign a building as an autonomous attack target. Editing pauses the world and replaces only the selected vehicle. Adding structures, changing concrete properties and entering/exiting vehicles preserve existing destruction. `R` resets the whole world and retains the current driver; while placing a part or assembly, `R` rotates the preview instead.

In Beschuss, click (or briefly tap on mobile) to fire; `F` fires from the free camera on desktop. Other tools use world clicks for selection or placement. On touch devices, tap to position a preview, then press Setzen; drags and multi-touch gestures do not fire. Vehicle blueprints and their placement are saved on this browser and included in sandbox JSON exports.

## Controls

| Action | Control |
| --- | --- |
| Place a part | Pick a palette element, then left-click the 2 m grid |
| Select / pan | Escape to selection; click a part / drag empty space |
| Orbit / zoom | Right-drag / mouse wheel |
| Raise or lower the construction plane | `[` / `]`, or the build-level buttons |
| Rotate | `R` |
| Remove | `Delete` |
| Undo / redo | `Ctrl+Z` / `Ctrl+Y` |
| Part shortcuts | `1`–`9` |
| Test / pause / resume | `Space` |
| Throw objects | Sandbox → Beschuss → click the building / `F` |

Matching module sockets connect automatically. Deck bearings permit rotation; structural frame connections transfer forces and moments. Foundations anchor when they touch the terrain at ground level. Bridge supports anchor only on the physical banks. Changing the build plane lets you place upper stories and braces. Translucent previews and visible sockets help alignment.

On a first visit, an automatic live-physics demo shows projectile demolition and a driving cannon vehicle. Skip with Escape or “Selbst spielen”; replay from “Demo” in the mode selector. Returning visits restore the last game mode. An inline loading screen appears before the game bundle downloads. “Alle Levels” shows completed and locked levels; each successful test unlocks the next. “Sandbox” combines construction, demolition and editable vehicles.

Blueprints and load intensity save separately for each challenge on the current browser/device. Export JSON to move them between devices. Camera and projectile controls remain interactive during simulation; reset restores the original blueprint.

## Physics model and level design

One Jolt world handles the structure, its supports, wheels, debris, cargo, and projectiles in a dedicated worker. Small blueprints use a 1/120 s timestep and 48/12 velocity/position solver iterations; blueprints with at least 400 parts use 1/60 s and 16/4 iterations, or 12/3 from 800 parts. The renderer remains separate and receives bounded, acknowledged snapshots. Sleeping debris wakes on physical contact, and CCD is enabled for dynamic bodies.

Material mass and connection capacities live in `src/catalog.ts`. Matching structural sockets form joints at their actual positions; the sparse large-building graph retains direct bearing sockets between stacked walls and columns; distributed sockets resist moments through their lever arms. Glass facade panels mount to one supporting member on one floor, so glazing does not become a load-bearing connection between floors. Their neighboring contact exclusions are released when the panel becomes detached. Overload damage uses solver impulses divided by the timestep, with the same capacities in every mode.

Ground-connected sandbox blueprints with at least 400 parts settle under gradually applied gravity before the scenario clock or player actions begin. Solver accuracy and damping are temporarily increased and then restored before readiness; damage is evaluated under normal settings afterwards, with bodies kept awake initially for overload checks before normal sandbox sleeping resumes. Tall procedural towers reserve continuous reinforced cores within the requested part budget. A Jolt state checkpoint stores the prepared bodies, contacts and constraints for subsequent world restarts. Unsupported blueprints skip preparation and fall visibly. Small blueprints and challenge timing retain their existing behavior.

Challenges in `src/challenges.ts` specify budgets, objectives and load-source parameters. Their consequences come from the resulting physical scene: boulders roll and collide, wheels load the road, water applies buoyancy/drag, moving ground excites the structure, and crates bear on floors. Adding a challenge should mean composing these inputs and objectives, not adding special collapse behavior.

Brittle modules that lose their final connection split into six smaller physical blocks with inherited momentum and a small balanced scattering impulse, limited to 2% of the source kinetic energy and at most 750 J. Formerly connected overlapping bodies regain mutual collisions after separating, preventing artificial separation impulses. Up to 156 fragments are created per run; beyond that limit, detached modules stay whole to bound the physics cost. Steel frames remain whole.

This version uses rigid prefabricated modules with breakable connections and stylized block fracture. It does **not** simulate beam plasticity, internal cracking, continuous soil mechanics, full fluid dynamics, or human occupants; cargo represents occupants and contents. Terrain uses predefined sites rather than a terrain-sculpting editor. Material strengths are game parameters, not certified engineering values. The current limits are 350 editable modules and 60 launched sandbox objects.

## Verification

```sh
npm test
npm run build
node tests/ui.mjs
```

The physics suite runs real Jolt worlds to verify supported versus unsupported bridge behavior, protection versus unprotected rockfall, all building hazards, cargo retention, and projectile collisions. The browser test exercises editing, simulation controls, occupancy, demolition, and challenge selection. It reads an installed Chromium from the Windows Playwright cache; override `PLAYWRIGHT_CHROMIUM_EXECUTABLE` if necessary. Set `TEST_URL` to test a production preview. Screenshots go into the ignored `artifacts/` directory.

## References

- [Pontifex and Bridge Construction Set manual](https://www.chroniclogic.com/pontifex2/pfx2manual/basic.html)
- [Jolt Physics architecture and constraints](https://jrouwe.github.io/JoltPhysics/)
- [JoltPhysics.js bindings and examples](https://github.com/jrouwe/JoltPhysics.js)

The game art and interface are original procedural assets; no Pontifex game assets are included.

## Phone controls

On touch screens, the tool list folds away so the world stays visible. Drag one finger to orbit; use two fingers to zoom and pan, or switch the one-finger tool to pan. Tap a build location for a preview, then confirm with Setzen. Choose the build level with +/−. In the sandbox, a short single-finger tap fires toward the touched location; dragging, holding and multi-finger gestures do not fire.

In a vehicle, the left thumbstick controls throttle and steering; swipe the world to aim independently, and hold Feuer or Bremse on the right. Welt resets the entire scene and returns you to the vehicle. In the vehicle workshop, tap to place parts and enable Löschen to remove them. Controls support simultaneous fingers and release safely on touch cancellation, focus loss, or opening a dialog.

The ? button arms help: tap any control to read its explanation without activating it. Portrait and landscape layouts include safe-area spacing, scrollable menus, and accessible options. Desktop mouse and keyboard controls remain available. Verify touch workflows with `node tests/mobile-ui.mjs` against a production preview (TEST_URL may override port 5174).

Destruction uses physical fragments without additional dust or spark particles. Material audio is generated locally, capped at 8 sound sources, and adjustable in Options. Resting fragment poses are cached so unchanged parts skip GPU matrix uploads; actual physics and wake-up behavior are unchanged. Intact parts and fragments receive deterministic subtle color variation without extra materials.

## Walking through buildings

In Sandbox, choose **Gebäude erkunden** under Bauwerke. WASD moves the character, Shift runs, Space jumps, V switches between shoulder and first-person views, and R restores the whole world while retaining walking mode. Click the viewport for mouse capture; Escape releases it. On touch devices use the thumbstick, drag the world to look around, and use the jump and world-reset buttons. Beenden returns to the Sandbox camera.

The character uses Jolt CharacterVirtual in the physics worker, after building settling. Showcases and generated layouts receive physical doorways, open stairwell floors, and switchback stairs; these remain destructible. Old saved custom blueprints are preserved: reload a showcase or generate a new layout to get its entrances and stairs. This is the movement/exploration foundation; health and survival scoring are not yet implemented.

Walking validation: `node tests/walker-physics.mjs`, `node tests/walker-building.mjs`, `node tests/walkable-fracture.mjs`; browser checks against the production preview: `node tests/walker-browser.mjs` and `node tests/walker-mobile.mjs`.

## Sandbox attacks, weapons and reinforced cores

Naturkräfte includes an autonomous attack vehicle which drives around the building and fires its cannon independently of walking or the player vehicle. Toggle it off to brake and stop new shots; it can run alongside other hazards. World reset preserves the enabled hazards.

Meteorites approach surviving building parts from changing compass directions and slopes, including facade impacts. Their mass is increased by 50 percent; a fixed 24-body pool keeps their cost bounded.

While walking, choose the demolition hammer with 1 or the shoulder ball cannon with 2. Click after capturing the mouse, press F, or use the touch attack button; hold to repeat. The hammer respects real openings and intervening objects. The cannon uses physical projectiles in the existing reusable projectile pool. A short tap is latched across worker updates. R resets the world without replaying an old shot. In ordinary Sandbox view, WASD moves the free camera horizontally, relative to its viewing direction.

The build catalog includes a hollow reinforced concrete core with stronger floor connections and resistance to repeated impacts. Large Art deco, Brutalist and Skybridge generators include continuous core stacks. Reload or generate a building to get the new structure; saved custom designs are preserved. Cores break locally and remain destructible. This is still a sandbox; character health and survival scoring are not implemented.

Validation: `node tests/attack-vehicle.mjs`, `node tests/meteors.mjs`, `node tests/walker-weapons.mjs`, `node tests/core-building.mjs`; production browser flows: `node tests/attack-vehicle-browser.mjs` and `node tests/walker-weapons-browser.mjs`.

Entering Gebäude erkunden reuses a running world, preserving damage, debris, hazards and the parked player vehicle. Sandbox navigation also keeps the running world. Opening world controls releases mouse capture. Validate with `node tests/walker-transition-browser.mjs`.

Glass monitors its surrounding frame: fractured supports, lost mounts and sustained corner deformation cause shattering. Glass also breaks at much lower projectile energy than concrete. Checks run at 20 Hz with a bounded fracture budget and skip sleeping frame transforms. `node tests/glass-breakage.mjs` covers intact and collapsing frames, impacts, falling panes and quiet startup of a 1,000-part building.
