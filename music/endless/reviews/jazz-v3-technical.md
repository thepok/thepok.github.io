# Independent technical review: quartet-3 composition evolution

## Scope and earlier findings

This review checks actual composed note events, replay compatibility, sampled coverage, section timing, intended cadence closures and real rendered audio. The user-selected original Hero Sax preset remains fixed; its intended compression is not an optimization target.

Round 1's twelve matched pieces had complete sections, finite playable notes, available samples and no sustained polyphonic sax overlap. A cadence audit found that the branch named `depart-resolve` did not actually guarantee its claimed harmonic destination. Some resulting sixths/extensions could be valid jazz, so this was not treated as a rule to eliminate every non-chord tone. The composer corrected explicitly authored closures while preserving open handovers. Subsequent revisions also bounded remembered phrase context; the final review measures actual attack density rather than accepting a declared phrase length.

## Final frozen candidate

`jazz_web.py` final SHA256: `2b3953a046261d7c2e023b09ef58389b5b2aec41ef4a791f6d7ef7a1c8aac36d` (including the bank-wide regression fix below).

Portable checker: `music/endless/py/check_jazz_evolution.py`. It supersedes the tone-only checker for the new quartet-3 bank; the older checker describes a historical release where composition was deliberately unchanged.

Command used:

```
python music/endless/py/check_jazz_evolution.py \
  --mirror /workspace/jazz-work/composition-v3/mirror \
  --matched-dir /workspace/jazz-work/composition-v3/round6 \
  --out /workspace/jazz-work/composition-v3/evolution-check.json
```

**PASS:**

- Twelve historical recipes reproduce their published render hashes exactly: releases `9d4de59e` and `498d071b`, each with straight swing, ballad and bossa in both piano modes. Render bytes in both modes are also compared exactly (compact-mode documents are reconstructed from the published sample-zone substitutions).
- All twelve new matched pieces have nonempty roles, finite notes of valid pitch/velocity/duration, contiguous complete sections and consistent duration metadata. Every note has real sampled coverage after stack velocity remapping; breath noise cannot disguise an absent sax sample. Every referenced audio asset is available.
- Default Hero Sax FX exactly match the chosen `498d071b` release; its plate and echo sends remain unchanged.
- Maximum sax overlap is 0.030001 beat, consistent with deliberate legato rather than unintended polyphony. Maximum attack density is six notes in one second. The twelve pieces span 104.62–240 seconds before reverb tails.
- All 29 explicitly resolved phrase endings reach their active chord. Open handovers and other jazz tensions remain unrestricted.
- Ten new recipes double-replay deterministically: all five feels in both piano modes. Stored full-quality renders match their recipes.
- Seven consecutive pieces reproduce through the bank-resume path, including the transition to a new six-piece set.

## Matched native audio

Three before/after pairs use the same session seeds and the exact-default-Hero baseline `498d071b`. The original tone is held constant. All six complete native renders have zero clipped samples, zero clicks and no analysis errors.

| Pair | Before duration | After duration | After LUFS-I | After dBTP |
|---|---:|---:|---:|---:|
| Ballad / entry 00 | 233.58 s | 220.25 s | -17.4 | -3.25 |
| Swing / entry 01 | 113.27 s | 107.11 s | -13.9 | -2.46 |
| Bossa / entry 03 | 174.97 s | 132.81 s | -14.3 | -1.50 |

`listening/` contains a standalone comparison page and six 160 kbps MP3s. Each pair is matched using constant gain only, with no extra compression or limiting; `comparison.json` records the gain factors. These are listening examples for user judgment, not a claim of human-rated superiority.

No remaining technical blocker was found in the frozen candidate. Musical and ensemble reviews are documented separately; the checks here do not claim that every future infinite-stream piece is masterful.

Encoded MP3 verification: the three pairs differ by at most 0.1 LU in measured integrated loudness; all encoded true peaks remain below -2.8 dBTP. The six MP3s total approximately 19 MB. These are constant-gain comparisons, not newly mastered performances.

## Full 48-piece gate and inherited head-overlap correction

The twelve-piece review subset was insufficient to expose one existing native head defect. The full shipped-bank gate rejected entry 38, seed 947886, “The Folded Harbor”: a three-beat written note at beat 19 continued two beats past the next attack at beat 20. The same overlap already exists in both historical releases; the stricter new release gate exposed it. It occurs when a piano-style sustained head is transferred to a monophonic sax.

An independent all-48 diagnostic collected every contract violation without changing the release gate. Entry 38 was the only offender. All 113 explicitly resolved cadences, sample mappings, note ranges, section timings and density checks passed.

The fix is a generic quartet-3 sax projection: preserve melodic attacks, pitches and velocities, release each written note by the next attack, and select the upper melody for simultaneous chord tones. Hornist then supplies its short intentional legato. Existing monophonic lines and both legacy builders remain unchanged. A portable regression covers the original crossing sustain, ordinary monophonic lines and simultaneous chords. The overlap gate was not weakened.

Fresh composition changed only entry 38 (new hash `56ee0eba016d1277`); all other 47 bank hashes are unchanged. The three published listening pairs therefore still represent the exact final source. Independent structural/sample/tone/cadence checks on all 48 corrected outputs pass, with maximum sax overlap 0.030001 beat and all 113 explicitly resolved cadences intact.

Corrected entry 38 was also rendered in full: 164.14 seconds, -14.9 LUFS-I, -2.08 dBTP; zero clipped samples, zero clicks and no analysis errors. The parent performs the final packaged-bank replay, complete release validation and browser transport checks.
