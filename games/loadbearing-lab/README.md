# LOAD BEARING

Play the stable game at https://thepok.github.io/games/loadbearing/.
The experimental structural lab is at https://thepok.github.io/games/loadbearing-lab/.

This is a standalone static browser game. Buildings, campaign progress, vehicle
designs and debris preferences are saved in this browser's local storage under
`loadbearing.*` (stable) or `loadbearing-lab.*` (experimental lab). The lab's
saves are isolated from the stable game. Use Export/Import to move blueprints between browsers or from
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


## Reversible rigid-cluster experiment

Use the top-bar Clusters ON/OFF switch, or ?clusters=0 for the original solver. Switching reloads the lab world. The stable game is unchanged and uses separate browser storage.

Detached, still-rigid sections can share one compound physics body until damage or a hard impact releases their original parts. Supported structures, yielded joints and reinforcement cables retain the original solver. Exact part geometry and per-part rendering remain; gentle contact does not calculate internal cluster stress. This is a targeted experiment, not a full replacement physics engine.

Development checks cover mass and motion preservation, release and local fracture, ground impacts, threaded browser snapshots, restart and the OFF baseline. An isolated 985-part free-fall benchmark measured about 81 ms per step normally versus 7.6 ms clustered; this favorable result is not a whole-game speedup. The source archive includes regression tests and a repeatable profile script.

Rollback checkpoint: codex/pre-cluster-checkpoint at b6169721171deaf0b90941cf53e94b25f592365c. To revert the publication, restore only games/loadbearing-lab from that commit. To compare immediately, select Clusters OFF. The small stats line reports grouped sections and saved physics bodies.
