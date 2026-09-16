# LOAD BEARING

Play at https://thepok.github.io/games/loadbearing/

This is a standalone static browser game. Buildings, campaign progress, vehicle
designs and debris preferences are saved in this browser's local storage under
`loadbearing.*`. Use Export/Import to move blueprints between browsers or from
the localhost development version. Clearing site data removes local saves.

Jolt physics runs in a worker with up to eight additional physics threads.
On HTTPS static hosts, the game-scoped `isolation-sw.js` service worker supplies
the COOP/COEP headers required by SharedArrayBuffer. First launch may reload once.
Browsers without shared-memory support use the single-thread physics fallback.
The service worker does not cache the game or store save data.

`source.zip` contains the editable source and package lock. Extract it, install
Node.js 22 or newer, run `npm ci` and `npm run build`, and publish the contents of
`dist/` to any static HTTPS host. Node is only needed to build, not to play.
All game asset paths are relative so subfolder hosting works.

Third-party notices are in THIRD-PARTY-LICENSES.txt.

## Explore on foot

Sandbox → Bauwerke → Gebäude erkunden starts the Jolt walking character. Newly loaded showcases and generated houses have destructible doorways, open stairwells and switchback stairs. Old custom blueprints are preserved.

WASD moves, Shift runs, Space jumps, V switches shoulder/first-person views, and R restores the whole world while remaining in walking mode. Click the view for mouse look; Escape releases it. Touch devices have a movement stick, drag look, jump and world-reset buttons. Beenden returns to the free Sandbox camera and projectile controls.

This is the exploration foundation for an interior bombardment survival mode. Health and survival scoring are future work.

## Attacks, equipment and reinforced cores

Naturkräfte now includes an autonomous attack car: it circles the building and fires while you walk inside or drive your own vehicle. It can be combined with other hazards and switched off. Meteorites strike from varied compass directions and slopes with 50% more mass.

On foot, 1 selects the demolition hammer and 2 the shoulder ball cannon. F or captured left-click attacks; hold to repeat. Touch devices have an attack button. Short taps survive worker timing, and world reset does not replay old shots. In ordinary Sandbox view, WASD moves the free camera relative to its view.

The catalog now includes a hollow reinforced concrete core with stronger connections and impact resistance. Large Art deco, Brutalist and Skybridge generators build continuous core stacks; reload or generate a new building to use them. Existing saved blueprints remain unchanged. Cores remain locally destructible.

Public Chrome checks cover desktop and Android-style touch controls, quick taps, held fire, weapon switching, world reset, camera focus isolation, autonomous driving and combined hazards. Source archives include these checks; camera comparisons allow normal floating-point rounding.

Free look reaches almost vertically upward independently of weapon limits. The hammer stops at its maximum elevation while the camera continues; mouse and touch use the same limits.

Held-fire regression checks follow simulation ticks rather than wall-clock delays, including under browser rendering load.


## Frame-aware glass and uninterrupted exploration

Glass shatters when its surrounding frame fractures, loses its mounts, or deforms at the corners. Low-energy projectiles can break glass without breaking concrete. Sleeping frames skip transform checks, and shattering is bounded per update. Regression checks cover quiet startup of a 1,000-part building, rigid frame movement, distorted frames, falling panes and material-specific impacts.

Gebäude erkunden now enters the existing running world without resetting damage, debris, hazards or the player vehicle. The vehicle parks when switching to walking. Opening world controls releases mouse capture; returning to Sandbox and entering walking again preserve the same physics worker. Desktop browser checks verify these transitions.

## Art deco podium cores

New Art deco buildings requested with more than 750 pieces have three reinforced core columns through their broad base. The two side columns rise continuously from the foundation to the first setback; the central core continues through the upper tower. Structural cores count toward the requested piece budget. Generate a new building to use the layout; existing saved blueprints are preserved. The same layout is available in the structural lab.
