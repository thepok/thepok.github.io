# Browser release verification — web9-jazz-1 / p15

Actual Chromium, actual shipped Pyodide composer and WASM audio engine. The mobile
check uses a 375×812 touch viewport, not a physical phone. CDN runtime files were
fetched with verified TLS and supplied through Playwright routing because Chromium
does not trust this environment's proxy certificate; TLS verification was not disabled.

- Seven consecutive newly composed pieces after bank opening 0 crossed the six-song
  set boundary. Every render hash and complete recipe matched CPython. Each piece
  also replayed through the browser worker with the same hash.
- Full piano mode: bank 0 hash `0bc68edb4d28dd0d`; decoded PCM peak 28,505/32,768,
  RMS 2,505, approximately 234 seconds including tail. Samples fetched: 23.5 MB.
- Compact piano mode: hash `f82dc9e4bea59ef7`; peak 25,692/32,768, RMS 2,482.
  Samples fetched: 20.6 MB. Both modes produced non-silent complete audio.
- Playback advanced after three rapid skips in each mode without moving the timeline.
  No application or page errors were recorded.
- Existing MediaSource quota/backpressure and deferred-seek regression tests pass.
  New sample traversal test covers nested Hero Sax layers and preserves synthetic noise.
- Rebuilt composer archive is byte-identical: SHA-256
  `dce1c4455efd166826fe92194909f44ee779d2402207f57c801996af96871e01`.

These checks establish playback, reproducibility and measured signal behavior;
no claim of human listening or universal browser/device compatibility is made.
