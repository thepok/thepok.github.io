# Orchestra mechanisms worth transferring to the jazz quartet

This is a focused source/architecture review of the existing orchestra system and quartet-3, updated after the R6 identity-memory change. It does not assert that orchestral forms or orchestral density belong in jazz, nor claim a listening comparison. No production source was changed for this review.

## 1. Preserve a stable musical identity alongside the latest phrase

**Existing mechanism:** `agentsound/endless/symphony.py:921–1024`, `Kernel`. A kernel stores its original rhythm, scale-step intervals, landing and accent signature. `steps()` and `apply()` derive transformations afresh from that stored cell. `Kernel.line()` (934–951) extracts a bounded head, expands the extraction window if fewer than three notes are available, and declines material that still cannot define a kernel. `motto_character()` (1091+) checks the original idea's contour and repeated-note character.

**Why it matters here:** Quartet R1 compressed an entire preceding section into a short response; later candidates corrected that. R2 then exposed cumulative stretching and erosion of the surviving phrase. A memory consisting only of the latest transformed/cadential fragment can progressively forget the identity that made the solo recognizable.

**Transfer:** Keep two distinct memories: an immutable short identity cell and the actual latest utterance. Immediate answers should respond to the latter; selected development and recall should derive from the former, carrying an explicit transform history. Do not repeatedly augment an already augmented fragment by accident. This does not require importing the symphonic engine: a small jazz phrase record is sufficient.

**V3 / R6 status — implemented:** `solo_story()` now keeps `previous`, the actual latest utterance, separate from an immutable `identity`. The section passes the original tune motif as `kernel=motif`; longer solos use that identity as the departure/recall motif, while immediate handovers and answers continue to use the preceding utterance. Audit records distinguish `recall-depart-resolve` and its actual source. This implements the relevant orchestra-inspired principle without importing the full symphonic transform algebra. Bounded utterance extraction and non-compounding stretching remain in place. Short solos need not force an additional recall episode; a deliberately expressive one-note answer is still valid. The code establishes the dependency, while recognizability remains a musical/listening judgment.

## 2. Give the ensemble a shared event with differentiated responsibilities

**Existing mechanism:** `symphony.py:12–25` describes the actual material→shared score→orchestration pipeline. `_summit()` (7905+) examines what was heard before the peak before allocating the summit's register/texture; it does not treat every block as independently maximal. `_theme_accents()` (9186+) allocates one leading arrival, modest supporting offsets and a deliberate tutti only at the marked peak. It explicitly avoids making every doubling copy the same heavy envelope.

**Transfer:** A jazz phrase-level event should identify its question/arrival/space/turnaround and who owns it. Sax can state it, piano can answer or leave room, bass can preserve the harmonic path, and drums can prepare the real boundary. Stable timekeeping remains valuable; shared intent does not mean all four players must react to every note or hit together.

**V3 status:** Native levels/climax/solo shape now affect the arrangement. Shared protected gaps and cadence-aware fills are meaningful steps toward this architecture. Continue judging actual performed events and their timing, not just event names or metadata. In particular, an early peak should leave another valid trajectory than the universal upward build, and a chosen space should remain intact after piano realization.

## 3. Remember audible families and realized shapes across pieces

**Existing mechanisms:**

- `endless/composer.py:255–315`, `set_draws()`: excludes recent choices by **group**, with a least-recent fallback. Different motto labels in the same short-short-long rhythm family count as related.
- `composer.py:546–581`, `_set_shape()`: avoids repeating a combination for the same feel.
- `composer.py:623–668`, `_bar_sim()` / `_set_bars()`: compares **realized section-length vectors** with previous pieces, redraws permitted candidates and keeps the least similar. This catches two differently labelled plans that still realize the same proportions.
- `symphony.py:9433+`, `shape_slot()`: checks whether the selected macro plan can realize its intended peak position.
- `symphony.py:9464+`, `_shape2_extras()`: counts motive rhythm families, theme textures and bass figures over the whole set, preferring unheard/least-heard choices.

**Important fact checked directly:** The current `jazz-trio` genre has no `set`, `set_memory`, `set_groups`, `set_shape`, `set_bars` or `set_macro` configuration. Calling the generic `set_plan()` does **not** automatically inherit these orchestra protections.

**V3 status and transfer:** The quartet currently varies feels, keys, layouts and several arrangement options, but it does not maintain comparable history of actual motif families or realized form/phrase fingerprints. A bounded future addition could pin a rhythmic-kernel family, solo trajectory and section-length fingerprint in each saved slot; avoid recent semantic duplicates and preserve deterministic recipe replay. Audit two consecutive sets, not only 48 independent openings. Do not transplant the orchestral sonata/fugato machinery or add instruments merely to obtain diversity.

## Suggested priority

The current candidate now contains stable-kernel-plus-latest-utterance memory; its phrase-identity and cadence regression checks belong to the ongoing final review. Realized cross-piece fingerprints and constrained reuse remain a subsequent improvement, distinct from this implemented within-piece memory. Keep the exact default Hero Sax tone separate from these composition decisions.

The useful inheritance is musical identity, coordinated intent and memory of what the listener actually hears. More orchestral complexity is not itself the goal.

R6 source inspected: `jazz_web.py` SHA-256 `4e9379f3a7086623f3cd8926ccc8741b2c48eaa88cb1c09e381c5e41d6921b50`; relevant implementation: `solo_story()` around lines 294–333 and `kernel=motif` at 427. No additional implementation requirements were introduced by this status update.
