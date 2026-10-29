# Endless browser build

Current release: `web10-jazz-1`, page revision `p18`.

The new quartet composition develops phrases inside short solos, retains an
original theme kernel alongside the latest utterance, and makes piano replies
use the actual sax question. Solo routes use the native harmony/climax plan;
trading is deliberately 4+4 bars, and selected ensemble pauses and drum fills
follow the phrase and cadence. The original Hero Sax tone stays unchanged.

[Listen to three matched before/after pairs](compare/jazz-v3/) (same starting
material and Hero sound; constant-gain loudness matching only).
Independent reviews covered twelve pieces and multiple revisions:
[composition](reviews/jazz-v3-composition.md), [ensemble](reviews/jazz-v3-ensemble.md),
[orchestra inspiration](reviews/jazz-v3-orchestra.md), [technical verification](reviews/jazz-v3-technical.md), [browser checks](reviews/jazz-v3-browser.md).
The failed intermediate density/phrase-erosion candidates were corrected before
release. Existing groove/set variety remains; orchestra-style memory of motif
families and realized forms **across separate pieces** is still future work.

The quartet now uses the original **Hero Sax default tone**: original compressor,
tube/tape stages, plate and quiet echo. The earlier jazz-specific tone reductions
are removed. Existing air, microphone motion, vibrato, notes and backing parts
are preserved. New recipes pin `sax_sound: hero-default-1`; older shared recipes
retain their original sound. [Exact preset verification](reviews/jazz-default-hero.md).

A stricter follow-up review identified remaining compositional weaknesses:
inactive short-solo development, independently generated question/answer passages,
and repetitive dramatic planning. [Findings and priorities](reviews/jazz-professional.md).
The composition revision above addresses the concrete phrase, form and response
issues; the earlier diagnosis remains available as the comparison baseline.

## Endless Jazz quartet

Select Jazz, or open `?genre=jazz`. Hero Sax (Weresax alto), Splendid piano,
Meatbass upright bass and Swirly brush drums share composed themes, solo
exchanges and cadences. Six-song sets balance swing, shuffle, bossa, ballad and
jazz waltz; independently seeded openings vary too. Recipes retain the complete
arrangement plan. Both full and compact piano modes work with the quartet.

New CC0 samples load only for the notes/instruments used by a piece. The offline
button downloads the complete quartet plus the chosen piano. Nested Hero Sax
samplers are loaded recursively; synthetic breath sources remain in the engine.
The existing piano/orchestra composition and render hashes are preserved.

Independent musical reviews compared twelve consecutive pieces before and after
revision, plus 48 opening plans: [round 1](reviews/jazz-round1.md),
[round 2](reviews/jazz-round2.md). These score/structure reviews found stronger
programme diversity and development; they do not claim human listening or certify
mastery. [Technical review and three final audio analyses](reviews/jazz-technical.md)
and [Chromium playback checks](reviews/jazz-browser.md) complement them.

Reproduce the **current** release:

```sh
python3 music/endless/py/rebuild.py
python3 music/endless/py/rebuild_jazz_bank.py --count 48
python3 music/endless/py/check_release.py --baseline-ref 801f7765 --replay
python3 music/endless/py/check_jazz_evolution.py --bank music/endless/bank/jazz
```

`py/jazz-overlay/` contains readable jazz sources and sample lookup tables;
`py/jazz-assets.zip` contains SFZ text and empty WAV placeholders. Their exact
contents are checked against `py/jazz-overlay.json` when rebuilding, after the
previously reviewed piano patch. Actual audio is in `samples/jazz/`; rebuild it
with `py/build_jazz_assets.py --help` and installed licensed source packs.

## Previous piano upgrade (web8)

The following documents the preceding piano release and its historical commands.

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

Historical web8 rebuild commands (checkout `497f216a`; use the current-release commands above for jazz):

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

## Buffer-full recovery (p13)

A MediaSource quota failure now pauses append attempts until the scheduled retry,
while allowing old buffered audio to be removed. Previously `run -> evict -> run`
could immediately retry the same full-buffer append indefinitely, overflowing
the JavaScript stack. Empty removals and failed operations now advance iteratively.
The composer, opening bank, recipes and samples are unchanged.

Regression check: `node music/endless/tests/mse-quota.test.cjs`. This reproduces
the previous overflow and checks delayed retry, eviction ordering and a long
queue of empty removals.

Chromium playback also passed with an injected `QuotaExceededError` on the
second SourceBuffer append: the deferred append recovered and playback continued
without app errors. The rendered recipe hash and non-silent PCM remained unchanged.

## Repeated skip recovery (p14)

Skipping an empty queue now reserves a new bank piece instead of leaving the
current selection null while future pieces render unused. MSE cuts and jumps
to prequeued pieces keep their requested position until the matching audio has
actually been appended and the target is buffered. Completion callbacks from
superseded skips cannot reposition the new selection. Seeking within already
buffered audio remains immediate.

Regression checks:

```sh
node music/endless/tests/skip.test.cjs
node music/endless/tests/mse-quota.test.cjs
```

Chromium tests cover repeated early skips with an empty queue, repeated skips
while subsequent music is being composed/rendered, and forward/backward seeks.
Playback resumes without moving the timeline as a workaround.
A second Chromium run also verifies triple skipping after the next piece is
fully rendered and already present in the MSE stream, followed by both seek
directions, with advancing playback and no application errors.

Page revision p18 reduces the jazz sax plate send and its performance automation by 3 dB at playback. Composition recipes remain unchanged.
