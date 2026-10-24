# Endless Piano / Orchester - licences

Everything in this folder is redistributed under the terms below. The page is non-commercial (no ads, no fees, no
sales).

## AgentSound (code)

`engine/agentsound.js`, `engine/agentsound.wasm` (the AgentSound engine compiled to WebAssembly),
`py/repo.zip` (the AgentSound Python composer and the sample-mapping text files it reads), `app.js`,
`compose-worker.js`, `engine-worker.js`, `index.html`, and `bank/` (pieces pre-composed by the same AgentSound
composer: note data and render settings, gzipped JSON; no audio).

AgentSound, https://github.com/thepok/AgentSound, MIT License (the full text is `LICENSE` inside `py/repo.zip`).
The engine bundles nlohmann/json (MIT) and the Music Synthesizer for Android DX7 core (Apache-2.0).

## Splendid Grand Piano (samples)

`samples/beste/*.opus` (every sample, Opus 160 kbps) and `samples/spar/*.opus` (3 of the 5 velocity layers and
every second sampled key, Opus 128 kbps), plus `Splendid Grand Piano.sfz` and `Data/*.txt` inside `py/repo.zip`.

Splendid Grand Piano: AKAI Steinway samples, released into the **public domain** by Akai; fixed and mapped to SFZ by
kinwie (sfzinstruments). https://github.com/sfzinstruments/SplendidGrandPiano. Converted here to Opus; no further
changes.

## The orchestra (samples)

`samples/orch/*.opus` (656 files) and `samples/orch/index.json`. Each file is one sample of the packs below, converted
to Opus (96-112 kbps stereo); looped sustains end shortly after their loop, one-shots lose the tail below -66 dB of
their peak (with a 30 ms fade). The file name is a short hash of the original path plus the original file name. The
SFZ mapping text of the same packs is inside `py/repo.zip` (`assets/samples/...`, text only, no audio).

| Pack | Licence | Used for | Attribution |
|---|---|---|---|
| Sonatina Symphonic Orchestra 4.0 (`sso`) | Creative Commons Sampling Plus 1.0 (non-commercial redistribution of the whole work allowed; no advertising use) | violins 1 + 2, violas, cellos, basses (SSO part), flutes, clarinets, bassoons, horns, trumpets, trombones, tuba; the SFZ mappings | Sonatina Symphonic Orchestra by Mattias Westlund, SFZ v4.0 by Peter Eastman - https://github.com/peastman/sso, https://creativecommons.org/licenses/sampling+/1.0/ |
| Virtual Playing Orchestra 3.2 wave files (`vpo-wav`) + 3.3 standard scripts | VPO terms: free redistribution, credit the creators / link virtualplaying.com, no sale; its parts: | the string sections' sustains (basses, cellos, violas) | Virtual Playing Orchestra by Paul Battersby, http://virtualplaying.com/virtual-playing-orchestra/ |
| - VPO `libs/SSO` (basses) | CC Sampling Plus 1.0 | basses sustain | Mattias Westlund (Sonatina Symphonic Orchestra), loops by Paul Battersby |
| - VPO `libs/NoBudgetOrch/CelloSect` | CC BY-SA 4.0 | cellos sustain | Jeff Glatt (No Budget Orchestra), loops by Paul Battersby - https://creativecommons.org/licenses/by-sa/4.0/ |
| - VPO `libs/Mattias-Westlund/ViolaSect` | CC BY-SA 4.0 (its readme; Mattias Westlund's samples are CC BY-SA 3.0 elsewhere) | violas sustain | Mattias Westlund (www.mattiaswestlund.net), from the bandshed.net viola samples and FluidGM - https://creativecommons.org/licenses/by-sa/4.0/ |
| - VPO `libs/VSCO2-CE` (violas) | CC0 1.0 | violas | Versilian Studios |
| VSCO 2 Community Edition 1.1.0 (`vsco2-ce`) | CC0 1.0 (public domain dedication) | oboes, harp, timpani, percussion (cymbals) | Versilian Studios, https://github.com/sgossner/VSCO-2-CE |

ShareAlike: the converted BY-SA samples (`samples/orch/*` from `vpo-wav/libs/NoBudgetOrch` and
`vpo-wav/libs/Mattias-Westlund`; `index.json` names the original path of every file) are offered under the same
licence, CC BY-SA 4.0.

## Voxengo IM Reverbs (room impulse responses)

`samples/ir/French 18th Century Salon.wav` (the piano) and `samples/ir/Musikvereinsaal.wav` (the orchestra),
unaltered, with their licence `samples/ir/license.txt`.

Copyright Aleksey Vaneev (Voxengo), https://www.voxengo.com/impulses/. Royalty-free use for any purpose; the files
are redistributed unaltered, free of charge, with the copyright notice and conditions in `samples/ir/license.txt`.
Aleksey Vaneev retains exclusive ownership of the impulse files and all intellectual property rights in them.

## Pyodide (loaded from the jsDelivr CDN, not part of this folder)

Pyodide 314.0.7, https://pyodide.org, Mozilla Public License 2.0.

## Mapping text and placeholders inside `py/repo.zip`

`assets/samples/*/SOURCE.json` (licence metadata of every pack AgentSound knows), the SFZ mapping text of the packs
above, `assets/samples/salamander-grand/*.sfz` (2 KB of SFZ mapping text the composer's patch table reads: Salamander
Grand Piano V3 by Alexander Holm, CC-BY 3.0, https://sfzinstruments.github.io/pianos/salamander), and EMPTY placeholder
files (0 bytes, names only) for sample files the composer checks or lists. `agentsound_web_tables.json`: numbers the
composer reads from the samples (length, rate, channels; the RMS level of a zone's first 1.5 s), measured from the
original files - no audio.

## Audit (2026-10-24): what the orchestra uses and whether it may be published

Every zone of orchestra-symphonic over ~1200 composed pieces (all feels, moods, sizes; 656 files, the set stopped
growing after the first ~100 pieces) comes from the packs in the table above, plus the Voxengo `Musikvereinsaal` IR.
All of them allow free, non-commercial redistribution with credit (CC0, CC BY-SA, CC Sampling Plus, the VPO and
Voxengo terms) - nothing had to be substituted. Not used and not published: the No Budget Orchestra 2 choir (only
with the film orchestra's choir='oh'; its terms are unclear), the SSO chorus, MuseScore General taikos, the bass
trombone (film orchestra only), and every other pack.
