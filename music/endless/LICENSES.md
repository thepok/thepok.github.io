# Endless Piano - licences

Everything in this folder is redistributed under the terms below.

## AgentSound (code)

`engine/agentsound.js`, `engine/agentsound.wasm` (the AgentSound engine compiled to WebAssembly),
`py/repo.zip` (the AgentSound Python composer and the sample-mapping text files it reads), `app.js`,
`compose-worker.js`, `engine-worker.js`, `index.html`, and `bank/` (set openings pre-composed by the same AgentSound
composer: note data and render settings, gzipped JSON; no audio).

AgentSound, https://github.com/thepok/AgentSound, MIT License (the full text is `LICENSE` inside `py/repo.zip`).
The engine bundles nlohmann/json (MIT) and the Music Synthesizer for Android DX7 core (Apache-2.0).

## Splendid Grand Piano (samples)

`samples/beste/*.opus` (every sample, Opus 160 kbps) and `samples/spar/*.opus` (3 of the 5 velocity layers and
every second sampled key, Opus 128 kbps), plus `Splendid Grand Piano.sfz` and `Data/*.txt` inside `py/repo.zip`.

Splendid Grand Piano: AKAI Steinway samples, released into the **public domain** by Akai; fixed and mapped to SFZ by
kinwie (sfzinstruments). https://github.com/sfzinstruments/SplendidGrandPiano. Converted here to Opus; no further
changes.

## Voxengo IM Reverbs (room impulse response)

`samples/ir/French 18th Century Salon.wav`, unaltered, with its licence `samples/ir/license.txt`.

Copyright Aleksey Vaneev (Voxengo), https://www.voxengo.com/impulses/. Royalty-free use for any purpose; the file
is redistributed unaltered, free of charge, with the copyright notice and conditions in `samples/ir/license.txt`.
Aleksey Vaneev retains exclusive ownership of the impulse file and all intellectual property rights in it.

## Pyodide (loaded from the jsDelivr CDN, not part of this folder)

Pyodide 314.0.7, https://pyodide.org, Mozilla Public License 2.0.

## Salamander Grand Piano V3 (mapping text only)

`assets/samples/salamander-grand/*.sfz` inside `py/repo.zip` (2 KB of SFZ mapping text the composer's patch table reads; no samples): Salamander Grand Piano V3 by Alexander Holm, CC-BY 3.0, https://sfzinstruments.github.io/pianos/salamander. The other `assets/samples` entries in the zip are licence metadata (SOURCE.json / INDEX.json) and empty placeholder files, no audio.

