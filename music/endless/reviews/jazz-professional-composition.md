# Composition review: why this quartet is functional but not yet compelling

Reviewed the deployed `web9-jazz-1` / `quartet-2` sources, all 48 opening-bank performance plans, and detailed actual notes/charts for eight pieces (0, 1, 2, 3, 4, 6, 10, 13). Evidence is reproducible with `composition_audit.py`; exact charts, times and counts are in `composition-audit.json`. Times below are seconds from the composed start, rounded. This is a composition/score review, not a claim of listening to these recordings or to a matched professional reference set.

## Verdict

The listener's dissatisfaction is compatible with everything the earlier reviews measured. The system produces plausible jazz material and changes the order and surface style of that material. It does not yet reliably make a compelling musical argument. Much of the apparent development is metadata or independent regeneration rather than a consequence of what was just played.

A professional performance need not have more notes, more chords, more surprises, or less repetition. It makes the listener recognize an idea, anticipate a consequence, and experience a satisfying or deliberately surprising answer. Here, section boundaries and random seeds often decide what happens next. Valid local phrases can therefore accumulate into a piece that is polite, fluent, and forgettable.

## Strongest concrete findings

### 1. The advertised developmental direction frequently does nothing

`section()` only applies `space`, `answer` or `rise` when `solo_count[lead]` is already nonzero. **26 of 48 pieces give each soloist only one solo section. In 21 non-trading pieces the developmental transform is never reached at all.** The per-piece field still looks diverse in recipe audits.

Example: **1 — Early Spring Bridge**, 0:52–1:05 piano solo, 1:05–1:17 sax solo. Its plan says `development='answer'`, but each voice is at stage zero; both get a freshly generated line over A1. Nothing in that plan makes the sax answer the piano's actual line. **4 — Perry Window**, 1:10–1:25 piano and 1:25–1:41 sax, similarly advertises `rise` without reaching a second per-voice stage. **10 — Other Doorway Ballad**, 2:02–2:30 sax and 2:30–2:59 piano, advertises `space` with the same inactive mechanism.

Even where active, the transform is chosen from three operations on the original head motif, not an evolving idea remembered from the previous phrase. `jazz.solo_line` itself is documented as a seeded starting point to edit or keep. It lays out random phrase lengths, inserts the motif probabilistically at the start of a phrase, then fills the rest. Repeated calls reset that local process.

### 2. Solos and returns are assembled from chart prefixes, not a whole-piece argument

The wrapper uses `tune.parts[:solo_span]` for non-blues solo sections. With one section, both voices improvise on A1; with two, they take the first two named parts. It ignores the native composer's `solo_changes`, `solo_shape`, `solo_charts`, and `out_parts` plans. Those fields contain more sophisticated choices than the new wrapper uses.

In **1 — Early Spring Bridge**, the head explores ABAC until 0:52; both solos then repeat A1 harmony, followed by A2/C at 1:17. In **3 — Grove Doorway**, 1:10–1:43 comprises two A1 solos, then the entire head returns for roughly 66 seconds. In **4 — Perry Window**, the bridge's contrasting harmony occurs only once at 0:39–0:54; the last 46 seconds are A1, A1, A3. These are different labels around a much narrower harmonic experience.

Short solos and edited choruses are legitimate professional arrangements. The defect is not that every solo must traverse a complete standard form. The system does not plan *why* this truncation, turnaround and return belong together, nor whether the shortened path preserves a meaningful harmonic destination. More substitutions are not the remedy; meaningful contrast and arrival are.

### 3. Section energy is nearly the same story in every song

All **39 non-blues pieces** use the head energy sequence **0.42, 0.46, 0.50, 0.54**. The nine blues use **0.42, 0.54**. First soloist starts at 0.55 and second at 0.83 regardless of the tune's intended narrative. The wrapper does not route the existing native `levels`, `climax`, `dynamics` and `solo_shape` into this arrangement.

**13 — The Quiet Matchbook** has its composed head climax in B, but head energy still rises into the final A, then follows the same sax→piano escalation as **0 — A Postcard for Grove**, whose melodic climax is in C. Distinct notes have been placed inside essentially the same dramatic container. A peak note alone is not an earned ensemble climax: the bass, comping, rhythmic space and approach need to participate.

Register also has a strong shared fingerprint: **36/48 heads peak at MIDI 77 (F5), 11 at E5, one at E-flat5**, across 14 keys. This is not proof that those notes are wrong; it shows why counting keys does not establish distinct melodic character or register narratives.

### 4. The named dialogue does not actually hear its question

`Sax Frage` and `Piano Antwort` call the same section generator independently. The piano receives neither the sax rhythm nor its ending pitches, contour or tension. Both can be related to the original tune, but that is not the same as a response to each other.

**0 — A Postcard for Grove**, 2:53–3:07 sax question, 3:07–3:20 piano answer: the program has no mechanism requiring a recognizable answer. **6 — Leroy Snowfall**, 1:53–1:58 question is **four bars**, while 1:58–2:11 answer is **twelve bars**. The implementation takes the first four bars of a sixteen-bar waltz part, then calls the whole remainder the answer. On blues parts the same mechanism produces four plus eight. Asymmetric exchanges can be excellent music; here the proportions arise from an assumed eight-bar chart that does not exist, not an expressive design.

### 5. A memorable head is present as a possibility, but it is not an evaluated objective

The inherited tune composer does give returning A material, contrasting bridge/C sections and a selected melodic peak. It would be inaccurate to say the songs have no themes. However, the release process never asked whether a listener could remember the hook, recognize its significant return, or name the piece's strongest moment after hearing a set. It mostly counted diversity and correctness.

The solo generator's high motif insertion probability can produce lots of thematic tokens without stronger development. Conversely, randomly paraphrasing a return can weaken identity: literal repetition is often exactly what makes a return satisfying. The earlier metric “fewer exact reprises” was not an aesthetic success criterion by itself.

## Eight-piece evidence ledger

| Bank | Piece / feel | Concrete compositional concern |
|---|---|---|
| 0 | A Postcard for Grove / ballad | Two A1 solos at 2:00–2:53; independent so-called question/answer at 2:53–3:20; only C returns at 3:20. |
| 1 | Early Spring Bridge / swing | `answer` development inactive; two short A1 solos at 0:52–1:17, no cross-solo response memory. |
| 2 | Hudson Kettle Blues / shuffle | Long fixed procession: sax 0:58–1:49, piano 1:49–2:39, bass 2:39–3:04, head return; native `solo_shape='sparse'`, `solo_charts` and plink ending are bypassed. |
| 3 | Grove Doorway / bossa | Full four-part return 1:43–2:50 repeats the head after only two A1 solo blocks; mechanical descending reprise energy substitutes for a return-specific design. |
| 4 | Perry Window / bossa | Bridge 0:39–0:54 is isolated; final 1:10–1:56 narrows to repeated A harmony; `rise` field never activates. |
| 6 | Leroy Snowfall / waltz | Trading passage is four-bar question plus twelve-bar answer; native early solo shape and cadenza ending unused. |
| 10 | Other Doorway Ballad / ballad | `space` inactive, standard fixed solo escalation despite native sparse shape; final return C 2:59–3:28 is not a planned response to previous solo content. |
| 13 | The Quiet Matchbook / ballad | Native chords solo shape and bridge climax do not govern the wrapper; same generic energy ladder and separate regeneration for traded phrases. |

## What distinguishes professional writing and playing here?

Useful standards of craft include the identity carried by a small rhythmic/pitch cell (a blues head can achieve this with very little material), large-scale harmonic expectation and resolution, a solo that remembers its previous statement, accompaniment reacting to a specific lead gesture, and a return whose meaning has changed because of the intervening music. These are professional practices, not claims of a measured A/B comparison with particular commercial recordings.

The generator currently has local plausibility and stylistic vocabulary. It needs **causal continuity and editorial selection**. More random options would increase the number of possible outputs without necessarily increasing the chance of a compelling one.

## Prioritized improvement programme

1. **Create one phrase-level story shared by all four players.** Choose the hook's identity, tension destination, one principal peak, a contrasting episode and a meaningful return before filling notes. Reuse the native form/level/climax plans rather than discard them. Counterexample: an early peak followed by increasingly spacious resolution must remain possible; do not replace today's fixed rise with another universal rise. Test whether reviewer listeners identify the intended arrival and whether matched-seed pieces actually use different trajectories. Tradeoff: fewer independently randomized options, more arrangement code.
2. **Make improvisation retain and transform actual previous phrases.** Maintain a phrase memory across sections and across lead handovers, with explicit statement, continuation, interruption and resolution. Fix the inactive-development path by developing *within* one short solo, not simply adding length. Counterexample: not every phrase should quote the hook; intentional departure must exist. Test blind hook recognition and whether listeners perceive a connected argument rather than a string of licks. Tradeoff: excessively strict memory can become repetitive; keep selective forgetting.
3. **Design coherent solo charts and cadences.** Support full choruses where appropriate and deliberately composed short forms elsewhere. Treat transitions as authored musical events; use native `solo_changes`/reharm plans and voice-led destinations. Counterexample: full 32-bar solos in every ballad would worsen pacing. Test whole-piece preference and perceived form, not chord count. Tradeoff: richer form increases duration unless other material is edited out.
4. **Implement genuine response and phrase-aware accompaniment.** Pass the actual question to its answer; choose a rhythmic echo, contour inversion, tension resolution or deliberate contrast. Make trading lengths explicit in the current meter; add accompaniment decisions around the same phrase landmarks. Counterexample: constant imitation and synchronized ensemble hits become another formula. Test whether changing the question changes the answer meaningfully with the same other conditions. Tradeoff: stronger interaction needs controlled sparsity so parts do not crowd one another.
5. **Change the quality review and selection objective.** Compare a matched set of several pieces, using blinded before/after examples and actual human judgments of hook memorability, direction, conversational response, strongest moment and desire to hear again. Score correctness and signal integrity remain gates, not proxies for fascination. Consider generating multiple candidates and editorially selecting against these goals, but do not optimize only the new numerical proxies. Tradeoff: subjective judgments are slower and disagree; the user's listening response is decisive evidence.

## Why the earlier review was too permissive

It demonstrated improvement over the first prototype and technical readiness. It did not establish proximity to professional composition. It counted feel/layout labels even when a developmental field was inactive; treated altered reprises as inherently useful; accepted names such as question/answer as evidence of conversation; and did not trace the native composer's richer planning into the quartet performance. Those are material blind spots. A more demanding next review must demonstrate actual musical dependency and compare entire experiences, while retaining useful technical gates.

No production files were changed for this review. Recommendation: prototype the first two priorities and real response on a small matched set before rebuilding/publishing another full bank. Do not promise mastery from score statistics.
