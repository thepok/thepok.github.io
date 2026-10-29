# Professional-gap review: ensemble, groove and phrasing

Evidence: deployed `web9-jazz-1`, actual compiled notes of bank entries 0–11 (all five feels), all 11 trading layouts in the 48-piece bank, `jazz_web.py`, and underlying `agentsound/jazz.py` / `patterns.py`. `ensemble-audit.json` and `counterfactual.json` contain the event-level evidence. I have not listened to or performed an audio A/B against professional recordings. Comparisons below concern professional ensemble practices, which differ between traditions; they are not universal rules every jazz recording must obey.

## Main finding

This behaves more like several competent generators sharing chords and an energy setting than like players sharing a developing musical intention. There is already real sax expression, a swing framework, phrase rests, live sampler variation and some comping response. Adding more generic timing noise or expression automation would miss the main deficit.

Professional rhythm sections often repeat a stable pattern for a long time. Stable timekeeping is desirable, and a repeated bar or an unchanged bass line is not proof of bad music. The gap here is the lack of *selective, causally planned exceptions* at meaningful phrases and formal landmarks: an answer that remembers the question, a held silence that the ensemble protects, a drummer preparing the actual return, or a bass transition motivated by the soloist's trajectory. Current variation mostly changes local details without giving the listener a reason to care what happens next.

## Concrete evidence

### 1. The band has little shared phrase information

In `jazz_web.py:118–156`, melody is passed to `jazz.comp(answer=melody)`, but bass and drums receive progression/length, seed and energy. They do not receive the phrase's accents, silence, tension or destination. The following piano solo is separately generated with another seed.

Controlled counterfactual: bank 0, **A Postcard for Grove**, first sax solo at **120.00 s**. Retain only every third generated note of that solo while holding seed, harmony and layout constant. Recompile without changing production sources:

| Track | Original events | Counterfactual events | Notes identical? |
|---|---:|---:|---|
| Sax | 146 | 130 | No |
| Piano comp | 304 | 312 | No |
| Bass | 195 | 195 | Yes |
| Drums | 865 | 865 | Yes |
| Piano melody | 107 | 107 | Yes |

This confirms that comping has a real limited response; saying “nothing interacts” would be wrong. It also establishes the architectural limit: drastically changed phrasing cannot influence the rest of the ensemble through these APIs. It does **not** establish that a professional bassist or drummer should change whenever a saxophonist drops notes. The proposed improvement is planned responsiveness at selected high-value landmarks, not constant reactive busyness.

In all 12 inspected songs, every measured bar after the intro contains drum attacks. Some bass features reduce the kit, but none of these songs uses a whole-bar ensemble drum break as part of its story. This is an observation about one missing arranging option, not a proposed quota of silent bars. “More drum fills everywhere” would be worse than the current stable bed.

### 2. Named trading sections are not consistently the promised exchange

The source comment describes four-bar question/answer trading over eight bars, but `jazz_web.py:183–197` takes the first four bars and gives the entire remaining chart to the piano. Of 11 actual bank trading pieces, **five are not 4+4**:

- Bank 6, **Leroy Snowfall** (jazz waltz): sax question **113.21 s**, four bars; piano answer **117.74 s**, **twelve bars**.
- Banks 9, 12, 29, 43 (blues/shuffle): four bars sax, **eight bars piano**. Bank 9 **Sunday Ticket Blues** starts these at **153.28 s / 161.34 s**.

Asymmetrical dialogue can be an excellent intentional composition. Here it is accidental chart slicing, inconsistent with the stated four-bar design. More fundamentally, the piano answer does not receive the actual sax question: it receives the old song motif and another random seed. Shared harmonic language can make the result compatible, but “compatible successor” is weaker than “audible reply.”

### 3. Drum phrase landmarks can disagree with the song's form

`phrase=8` is fixed for every call, and each section restarts the drum generator. The generic helper fills at bar 8 of each section, irrespective of a 12-bar blues turnaround or the end of a shorter trading segment.

Actual examples: bank 2 **Hudson Kettle Blues**, first sax solo begins **58.43 s**; bank 9 **Sunday Ticket Blues**, first sax solo begins **56.47 s**. In both 12-bar solo sections, bar 8 has a triplet fill (15 attacks; taps at 2, 2⅓, 2⅔, 3, 3⅓, then slap at 3⅔); bars 11 and 12 retain the same ordinary 11-event pattern. A fill at bar 8 is musically legal. The defect is that the system cannot *choose* the real turnaround as its destination; the default eighth-bar clock chooses for it.

The 12-song audit also finds many solo sections where one quantized drum-bar skeleton accounts for 5–7 of eight bars (e.g. bank 1 sax solo at 64.62 s: seven of eight bars). That kind of repetition is common in good jazz. It becomes limiting when the only departure is a periodic fill with no relationship to the soloist or form.

### 4. Different feel labels do not yet imply sufficiently different ensemble grammar

Bossa genuinely changes swing to straight, comp style to bossa and bass to push. It is not merely a renamed swing piece. But its drummer remains the generic straight-brush pattern: snare/foot-hat backbeats, stirs and optional ghosts, rather than a planned two-bar bossa relationship among bass, cross-stick/brush and piano.

Bank 3 **Grove Doorway** has 160 foot-hat events, 160 stirs and only eight kick hits across its 80 post-intro bars; those kicks arise in periodic fills, not a consistent bossa bass-drum foundation. Bank 4 has 112 hats, 112 stirs and seven fill kicks across 56 bars. Sparse kick is not inherently wrong in brush bossa; the issue is that there is no explicit stylistic arrangement choice controlling the relationship. The available native `bandlib/jazz.py:bossa_groove` demonstrates that more style-specific machinery already exists.

Shuffle similarly has no separate drum grammar in the quartet: it mainly selects blues form and a slower tempo; swung timing still comes from the same tempo-based swing ratio. The palette therefore varies less in rhythmic identity than “five feels” suggests. A restrained brush quartet need not impersonate five radically different bands, but each advertised feel should have a deliberate identity.

### 5. Sax expression is richer than sax rhetoric

`hornist.arrange` and Hero Sax already supply articulation, dynamics and movement; previous audio tests verify non-flat phrase dynamics. Yet the solo's underlying phrase plan is freshly generated per section (`solo_line` resets its phrase plan and pitch history), with the same phrase-length/rest ranges. Its continuation is shaped mostly by a three-choice register/motif transformation and section energy, not by an unanswered musical question or a planned climax that changes the ensemble.

A professional line can make a repeated rhythm compelling by postponing its resolution, answering it at a different scale, or withholding the expected final note. That requires compositional intent before the articulation layer. Better microphone motion, vibrato or random accents cannot substitute for it.

## Ranked improvement experiments

1. **A shared phrase/form plan with sparse ensemble cues.** Store a few meaningful targets per chorus: statement, protected gap, response, tension peak, return. Pass those to comp, bass and drums. Mostly preserve stable time; make two or three unmistakable coordinated decisions per song. A/B against identical harmony/melody and equal mix level; ask listeners which version feels like players listening to each other. Guard against excessive synchronized accents and constant fills.
2. **Actual call-and-response.** Generate the question first and derive the answer from its rhythm/contour and unresolved target, transformed rather than copied. Implement intentional 4+4 or explicitly designed asymmetrical exchanges. Check motif provenance and chart continuity, then use blind listening to assess whether the reply is perceptible without the section label.
3. **Form-aware drum/bass transitions.** Replace unconditional eight-bar fill scheduling with cadence/chorus annotations. A 12-bar blues can prepare bar 12; a four-bar trading slot can remain open for its answer. Include restrained breaks, cymbal/touch changes and bass pickup choices rather than only more notes. Compare full choruses, not isolated “interesting” fills.
4. **Deepen two grooves before claiming broad stylistic mastery.** Implement a convincing medium swing quartet and a coherent bossa quartet with distinct rhythm-section relationships, then transfer the architecture to ballad/waltz/shuffle. Compare several songs per groove so a single attractive seed cannot mask a generic accompaniment template. Keep the existing sample palette unless an actual missing articulation is demonstrated.
5. **Extend solo memory across players and sections.** Preserve one meaningful rhythmic or interval idea, develop it toward a destination, and let the next player choose to answer, interrupt or leave it unresolved. Keep space and restraint. The tradeoff is less nominal randomness but stronger identity; judge this by memorable moments and musical anticipation, not event count.

## Why the previous review did not answer the user's question

It established technical usability, basic phrase coherence, variety of metadata/plans, absence of overlap, and improved mix. Those are worthwhile release checks. They did not establish compelling ensemble conversation, genre-specific groove identity, long-range rhetoric or memorable phrasing. Forty-eight different hashes and five feel labels are not forty-eight distinct musical personalities. No-clipping and sample coverage are prerequisites, not evidence of artistic quality. The next round needs genuinely comparative musical judgments over whole songs/sets, with the current release retained as the control, and must allow the result “technically different but still not more compelling.”
