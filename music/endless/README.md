# Endless browser build

Current release: `web7-925b025c26`, page revision `p9`.

The symphonic generator includes reduced automatic phrase shaping, role-aware
theme accents, and foreground dynamics for counter-lines answering during the
melody's rests. Soloists remain enabled. Written rests, subito dynamics and
deliberate climax accents remain part of the music.

The Python source snapshot is identified in `source-version.json` and shipped
in `py/repo.zip`. The WASM audio engine and sample assets are unchanged. All 100
orchestral opening pieces were regenerated; the 600 piano opening pieces retain
their render hashes and only receive the new recipe version.

Validation: 18 pieces (three each for orchestra set seeds 4242, 7, 123456 and
piano sets new-age/4242, klassik/77, walzer/78) match between native Python,
the browser mirror and Pyodide after normalizing the local sample-root path.
Recipe replay and continuation after the bank opening pass. All opening pieces
reference available sample assets, with no missing composer lookup tables.
Muted Chrome playback was checked on desktop and a 375x812 mobile viewport;
the repeat visit used all 502 required samples from cache with no app errors.
