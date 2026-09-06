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
