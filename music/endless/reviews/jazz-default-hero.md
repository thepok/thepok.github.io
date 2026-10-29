# Independent review: exact default Hero Sax in the quartet

The user explicitly selected the original Hero Sax sound. The review scope is therefore exact preset restoration, correct expression routing and clean rendering. The preset's intended compression is retained; the previous moderated comparison is not the selected release.

Frozen `jazz_web.py` SHA256: `30dc359de46cef3c3f75f5fcfcbbf900857c95a493dc663b4e828dae467b7921`.

## Preset and composition contracts: PASS

`review/check_default.py` independently constructs a fresh canonical `hero(... 'hero/sax' ...)` track and compares it with three generated quartet pieces (straight swing, ballad and bossa).

- All nine original preset FX and their parameters match the factory output exactly, including the original compressor, saturation and tape stages.
- Both factory sends are restored exactly: Hero plate at -14 dB and constant echo at -24 dB. The existing plate/echo buses and their parameters are unchanged. No reduced room send or changed predelay remains.
- The compatibility EQ at 3.3 kHz is flat (0 dB), preserving published automation indices without altering the preset tone. The additional Hornist microphone stage remains as before.
- Every note, section, tempo, sample instrument, backing track and every expressive automation point matches the prior quartet output exactly. Air, proximity, pitch bends, vibrato and pan gestures retain their destinations. The only added routing is the factory's constant echo send.
- The new sound is pinned by `slot.sax_sound = 'hero-default-1'`; the producer's replay checks preserve older unpinned recipes exactly.

Full machine-readable contract evidence is in `review/default-contracts.json`.

## Audio verification

Three full renders of the restored core preset, before adding its quiet constant echo send, completed with zero clipped samples, clicks or analysis errors. They verify the restored tone across straight swing, ballad and bossa. The final echo-inclusive source is separately rendered on the complete straight-swing piece; its result is appended below. The earlier ballad/bossa audio must not be described as exact final echo-inclusive renders.

The original preset compresses the sax more than the previous softened version. This is consistent with the user's explicit sound preference and is not a reason to replace it with a moderated preset. The review does not claim human listening or identity with a named commercial recording.

### Final echo-inclusive render: PASS

Complete 150.5-second straight-swing piece: -14.8 LUFS-I, -1.2 dBTP; zero clipped samples, zero clicks, no analysis errors. Sax active RMS -17.6 dB; phrase-level spread 3.1 dB with the intentionally restored original compression.

No technical blocker found for this exact factory-preset release.
