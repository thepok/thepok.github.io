# Endless browser build

Current release: `web8-register-2bdc44ff`, page revision `p12`.

New Age piano now alternates complete tenor statements, full answer phrases and
restrained accompaniment across a set. The first theme and signature material
remain intact. Answers fit short chord spans, and passages outside the selected
window retain their original two-hand performance and controls.

The port changes only three files in the historical composer archive. It keeps
the WASM engine, samples, lookup tables, classical/waltz and orchestra composition
unchanged. New Age openings are regenerated using their original set seeds and
best-of-eight selection; other opening pieces keep their exact render hashes.
The code/recipe version changes together with the opening bank and cache key.
Old shared recipes follow the existing migration behavior: they are recomposed
with the current generator and identified as another version.

Rebuild the archive and opening bank from this repository root:

```sh
python3 music/endless/py/rebuild.py
python3 music/endless/py/rebuild_bank.py --backup /tmp/endless-bank-before --jobs 4
python3 music/endless/py/check_release.py --baseline-ref 5b44e517 --replay
```

The archive builder checks the pinned baseline and reviewed performer hash. The bank
builder documents its arguments and records changed candidate choices. Neither
tool publishes the site. `source-version.json` records the final source hashes.

The browser uses Splendid Grand samples; native review audio used Salamander.
The composition and replay checks therefore do not establish identical timbre.

## Previous composer release (web7)


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


## Playback reliability (p10)

Mobile MediaSource playback waits for a piece to finish rendering before starting it: locking the screen can throttle the render worker, invalidating its foreground speed estimate. Initial startup may take longer. Desktop progressive playback is unchanged. The Web Audio fallback and operating-system audio interruptions remain separate limitations.

A persistent error panel shows a readable explanation and the last 20 technical messages. Worker errors and encoder completion failures are surfaced; failed render completion is no longer accepted as a complete song. Recovery is manual via Skip, not an automatic repair guarantee.

Validation: mobile readiness cases, injected failure handling, JavaScript syntax and error-panel rendering at 420px width passed. A live desktop run started four pieces with three transitions over approximately 16 minutes of media time (first four minutes normal speed, then accelerated), without playback errors. Actual phone lock-screen behavior still needs device testing.


## Progressive mobile playback restored (p11)

At user request, mobile once again uses the original render-ahead speed estimate instead of waiting for complete rendering. A MediaSource buffer underrun during a started song now appears in the persistent GUI error panel. Startup, seeks and completed-song gaps are excluded; repeated waiting events are deduplicated until playback recovers. The panel records recovery without erasing the technical history. Background rendering can still be throttled by the phone OS.

The imported `AgentSound/web` runtime remains a separate, hash-pinned historical
release. Updating that lock requires the published Pages commit; this local
upgrade does not point it at an unpublished revision.

## Validation of web8

The independent `check_release.py --baseline-ref 5b44e517 --replay` audit passes:
all 700 entries, both piano-mode hashes, sample references, unchanged engine and
sample inventory, exact preservation of the other 500 bank payloads apart from
version labels, and deterministic cross-version recipe checks. The archive also
rebuilds byte-for-byte from the pinned baseline and checked-in patch.

The native/browser parity check covers three consecutive New Age pieces from
set seed 4242, with statement, lyrical and answer profiles. Full and compact
piano modes and recipe replay produce exact matching hashes in CPython and
Chromium/Pyodide. The real best-of-eight continuation after bank entry 0 also
matches native Python.

All 200 New Age openings are rebuilt with their original session seeds and
best-of-eight selection. The selected candidate changed for 36 openings, as
expected after composition/scoring changes; this is recorded by the builder.
No thresholds are relaxed and no session seed is replaced. Full/compact recipes
and sample-zone substitution are verified for every generated opening.

Full-page muted playback also passed in Chromium: desktop full-piano shared
recipe replay and a 375×812 mobile viewport starting compact-piano bank entry 0.
Both rendered non-silent PCM, matched their expected recipe/bank hashes, and
started playback without app errors.

Browser tests use the pinned Pyodide runtime fetched with verified TLS through
a local test cache because Chromium does not trust this cloud's proxy CA.
Certificate checks are not disabled. These checks do not establish real-phone
background or lock-screen playback reliability.
