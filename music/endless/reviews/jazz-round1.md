# Independent musical review — round 1

Evidence: all 12 consecutive outputs of session seed100 (`round1/00..11.json`), compiled track notes, raw lead-sheet/performance records, and source. Metrics are in `round1-audit.json`. No claim of human listening; mix quality still requires rendered audio checks.

## Verdict

A coherent first quartet, but not yet a convincing varied endless programme. The existing tune composer provides motifs, harmonic movement and cadences. The new arrangement makes those playable by sax and gives piano real solo space. However its six-piece schedule and solo/reprise scaffold are too readily predictable. Do not describe this as mastery.

## What works

- Twelve distinct pieces, eight different tonic/mode combinations, AABA / ABAC / blues forms, actual bossa straight timing versus swung feels.
- Sax line is monophonic in compiled events: no overlap greater than 0.04 beats within inspected sections. Across 12 pieces only 10 sax intervals greater than nine semitones within sections, so excessive jumping is not the predominant defect.
- Heads have returning A material, bass two-feel changes into four-beat solo support, and piano/bass/drum roles coexist rather than all playing melody.
- Sax phrases include substantial rests. The sparse bass-feature accompaniment is a meaningful reduction in texture.

## Prioritized weaknesses: what is missing for mastery?

1. **Programme predictability / opening-bank homogeneity.** The exact sequence `straight, waltz, ballad, bossa, straight, shuffle` and corresponding `sax-piano, piano-sax, bass-dialogue, piano-sax, trading, sax-piano` occurs twice. The first slot of every newly seeded session is straight AABA sax-piano. Therefore random bank starts and user skipping would repeatedly sound like one format even if a full uninterrupted set varies. Constrained seeded permutations must vary openings too, preserving stylistic balance and avoiding adjacent duplicates.
2. **Development rather than repeated scaffolding.** Every song states sax head, plays two similarly sized solo blocks per voice, then returns its last two head parts. All 24 raw reprise sections are exact head melody copies. The solo generator receives the same motif probability and independent RNG at every section. Need differing song-level solo trajectory (fragment, answer, register/density growth), varied phrase returns and cadence paraphrase, retaining recognizable identity.
3. **Ballad pacing.** The two ballads last 329.55 and 294.4 seconds, carrying the same multi-block solo sequence as faster songs plus the extra bass feature. A shorter, lyrical development path would give the programme a real exhale.
4. **Unshaped entrance/exit.** Initial implementation has ensemble support under every piano intro and an ending comp pattern rather than a single intentional closing gesture. More varied piano/bass entrances and clear held/stop/tag departures can give pieces identities without simply adding density.
5. **Rare register fallback is not contour-safe.** `_fit` fallback chooses same-pitch-class notes inside bounds independently, despite the comment saying it does not octave-fold. That can create incorrect contours on wide heads. Prefer whole phrase transposition; if impossible use monotonic compression or compose in sax range.

Round2 should compare all12 songs, inspect multiple independently seeded opening slots, retain the monophony/breath properties, and require real PCM balance evidence before publishing. Remaining artistry—compelling phrase direction, nuanced articulation and mix—cannot be proven by counts alone.
