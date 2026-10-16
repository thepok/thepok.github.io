// Endless Piano: the AgentSound engine (WebAssembly) renders one piece at a time and streams it as 16-bit PCM.
// The main thread sends the render JSON and the piece's samples (decoded from Opus into 16-bit WAVs).
import createEngine from './engine/agentsound.js';

let engine = null, irLoaded = false, stream = null;
const ready = createEngine({
  print: () => {}, printErr: (s) => { if (!/^render \d+%/.test(s)) console.warn('[engine]', s); },
  onStream: (l, r) => stream && stream(l, r),
}).then((m) => { engine = m; postMessage({ type: 'ready' }); });

const safe = (base) => base.replace(/ /g, '_').replace(/#/g, 's');
function rm(p) { try { engine.FS.unlink(p); } catch (e) { /* gone */ } }
function mkdir(p) { try { engine.FS.mkdir(p); } catch (e) { /* exists */ } }

async function render(m) {
  await ready;
  const FS = engine.FS;
  const song = JSON.parse(m.render);
  for (const tr of song.tracks) for (const z of (tr.instrument.params.samples || [])) {
    z.file = `s/${safe(z.file.split('/').pop().replace(/\.wav$/i, ''))}.wav`;
  }
  for (const b of song.buses) for (const f of (b.fx || [])) if (f.params && f.params.ir) f.params.ir = 'ir/room.wav';
  mkdir('/assets'); mkdir('/assets/s'); mkdir('/assets/ir'); mkdir('/out');
  if (!irLoaded) {
    const r = await fetch('samples/ir/French%2018th%20Century%20Salon.wav');
    FS.writeFile('/assets/ir/room.wav', new Uint8Array(await r.arrayBuffer()));
    irLoaded = true;
  }
  for (const [name, buf] of Object.entries(m.files)) FS.writeFile(`/assets/s/${name}.wav`, new Uint8Array(buf));
  FS.writeFile('/song.json', JSON.stringify(song));
  rm('/out/mix.wav');
  FS.symlink('/dev/null', '/out/mix.wav');            // the stream is the output: no WAV in memory
  let frames = 0, first = null;
  const t0 = performance.now();
  stream = (l, r) => {
    if (first === null) first = (performance.now() - t0) / 1000;
    const n = l.length, pcm = new Int16Array(2 * n);
    for (let i = 0, o = 0; i < n; i++) {
      pcm[o++] = Math.max(-32768, Math.min(32767, Math.round(l[i] * 32767)));
      pcm[o++] = Math.max(-32768, Math.min(32767, Math.round(r[i] * 32767)));
    }
    frames += n;
    postMessage({ type: 'chunk', job: m.job, pcm, frames: n }, [pcm.buffer]);
  };
  engine._as_clear_sample_cache();                    // only this piece's samples in memory
  const rc = engine.callMain(['render', '/song.json', '--assets', '/assets', '--out', '/out', '--no-png', '--no-analysis', '--quiet']);
  const secs = (performance.now() - t0) / 1000;
  stream = null;
  engine._as_clear_sample_cache();
  for (const name of Object.keys(m.files)) rm(`/assets/s/${name}.wav`);
  rm('/song.json');
  postMessage({ type: 'done', job: m.job, ok: rc === 0, frames, render_s: +secs.toFixed(1), first_chunk_s: +(first || 0).toFixed(2),
                realtime_x: +((frames / song.sampleRate) / secs).toFixed(2), heapMB: Math.round(engine.HEAPU8.length / 1048576) });
}

let queue = Promise.resolve();
onmessage = (e) => {
  const m = e.data;
  queue = queue.then(() => render(m)).catch((err) => postMessage({ type: 'error', job: m.job, message: String(err && err.message || err) }));
};
