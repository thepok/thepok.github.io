# Independent technical review: Endless Jazz

## Round 1 findings

- **Blocked publication:** the first waltz reached a final `jazz.comp(style='ballad')` call that only accepts 4/4. Reproduced in seed 182's second generated piece. The composer replaced the cadence with an explicit final sonority and made meter-specific accompaniment selection consistent.
- Native render of initial seed 182: true peak +0.10 dBTP, one clipped sample, zero clicks. Master peak protection was missing.
- Sax performance had only 3.9 dB median phrase-level spread; the inherited Hero compression restricted its articulation.

## Round 2 technical evidence

`audit_sequence.py`: **16 pieces passed**, two independent eight-piece streams (seeds 182 and 731). Each stream crosses its six-piece set boundary. Every piece was recipe-replayed exactly, and the bank-start `skip_first` path reproduced subsequent stream renders exactly. No missing WAV tables, invalid notes, empty instrument parts, or notes without real sampled coverage. Coverage follows stack velocity curves; synthetic breath noise cannot falsely count as sax coverage.

`check_pruning.py`: **six pieces passed**, all five feels. For every played note, all eligible samples and round robins are identical with and without browser sample pruning. Stack velocity remapping is included. Piano compact-mode swapping remains separate.

Three native renders (straight, ballad, bossa) with real Weresax/Meatbass/Swirly samples and decoded published piano samples had no clipping, clicks, or analysis errors after peak protection. However the new sax chain was too quiet: active RMS around -32.6 dB against bass -25.5 and piano -23.7 in the straight example. This was an actual mix defect, despite structural tests passing.

An exact-render A/B variant bypassed the sax compressor and raised the track 8 dB. Sax active RMS became -25.9 dB; phrase spread increased from 3.5 to 4.7 dB, removing the flat-dynamics warning. Peak remained -1.20 dBTP, with zero clipping/clicks. Recommended final gain is +10 dB above round 2 for non-ballads and +7 dB for ballads, to align the lead with piano while keeping ballads softer. Do not chase a rigid streaming loudness target by compressing away this recovered expression.

The native engine validates the current browser render schema, including layered Hero Sax. Browser/WASM playback and published Opus decoding are independently tested by the parent agent. These are analysis and score-based reviews, not human listening claims.

## Pending final release evidence

Final gain-adjusted native renders and packaged `check_release.py --baseline-ref 801f7765 --replay` will be appended after freeze. The release validator now checks the pinned old archive, all existing 700 bank payloads unchanged except version, all asset hashes, additive jazz-only samples, recursive sampler stacks, and deterministic current/old-version recipe replay.

## Final audio verification

Frozen jazz_web.py SHA256 `b9c9875abb7e8983f0076140efb592d21fe4a49f9b0f344ca531c0843b10c0fb`. All three complete native renders succeeded with zero clipped samples, zero clicks and no analysis errors.

| Feel | LUFS-I | dBTP | Sax RMS | Piano RMS | Bass RMS | Sax phrase spread |
|---|---:|---:|---:|---:|---:|---:|
| straight | -19.7 | -1.2 | -24.3 | -23.7 | -25.5 | 4.4 |
| ballad | -23.0 | -3.57 | -27.0 | -27.1 | -29.9 | 5.8 |
| bossa | -20.3 | -3.11 | -24.3 | -24.3 | -26.4 | 5.0 |

Final sax level now matches piano and sits above bass in these examples. The ballad remains deliberately softer. Generic loudness/balance warnings are not all removed; there is no evidence-based reason to flatten the performance to hit a fixed LUFS target.

## Final packaged release verdict: PASS

`python music/endless/py/check_release.py --baseline-ref 801f7765 --replay` passed on the frozen archive SHA256 `dce1c4455efd166826fe92194909f44ee779d2402207f57c801996af96871e01`.

- 748 bank entries: all 700 existing entries unchanged except version; their old and migrated recipes reproduce the original render hashes.
- Every existing engine/sample asset unchanged; only the new jazz set and its manifest added. All sample content hashes validated.
- All 48 jazz openings have distinct renders, five feels, four solo layouts, three forms, 14 keys and 30 tempi. Every bank track is nonempty and every jazz note has a real sample after stack velocity remapping.
- Current recipes double-replayed deterministically in both piano modes where relevant. Archive/source hashes match the release manifest.

No remaining technical release blocker found. This review does not certify every future generated piece as masterful; the measured evidence supports publishing the improved generator for listening.
