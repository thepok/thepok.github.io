# Final browser checks — web10-jazz-1 / p17

Actual Chromium with shipped Pyodide and WASM engine. The compact-mode check
uses a touch/mobile viewport, not a physical phone. Runtime CDN files were
retrieved with verified TLS and served through the test route; TLS was not disabled.

- Full and compact piano modes render complete, non-silent bank 0 audio, with no
  application/page errors. Playback advances after three rapid skips in each mode.
- Two newly generated continuation pieces and their recipe replays match CPython.
- The final repaired bank 38 renders and plays successfully, including rapid skips.
  Its Pyodide recipe replay matches `56ee0eba016d1277`.
- Bank 0 full-mode PCM peak/RMS: 27664 / 3360; compact mode: 28409 / 3348.
  Repaired bank 38: 29431 / 4479. No zero-output or full-scale signal occurred.
- The six comparison MP3s are accessible, playback advances, and the comparison
  page fits a 375-pixel viewport. Playing one comparison pauses the other players.
- Sample-stack traversal and existing quota/deferred-seek regression tests pass.
- The reviewed twelve render hashes remain exactly those shipped. The final
  monophonic sax-transfer repair changes only bank 38 among all 48 openings.

Final composer archive SHA-256:
`b2f1c587417adc654fbda66246932490af80dc170b18699f6b57ce320c55cc27`.

The complete bank validator passes 748 entries; the evolution checker passes
48 new pieces, 12 historical recipes, 10 double replays and seven continuations
across a set boundary. Technical and structural checks do not replace the
listener's preference in the supplied full-piece comparisons.
