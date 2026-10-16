// Endless Piano worker: Pyodide composes (the AgentSound endless set loop), the AgentSound engine (WASM) renders.
// The main thread decodes the Opus samples (decodeAudioData is not available in workers) and plays the stream.
import createEngine from './engine/agentsound.js';

const PYODIDE = 'https://cdn.jsdelivr.net/npm/pyodide@314.0.7/';
let py = null, engine = null, irLoaded = false;
let stream = null;
const waiting = new Map();          // need id -> resolve
let needId = 0;

const post = (m, t) => postMessage(m, t || []);
const status = (text, extra) => post({ type: 'status', text, ...extra });

async function initPython() {
  const { loadPyodide } = await import(PYODIDE + 'pyodide.mjs');
  const p = await loadPyodide({ indexURL: PYODIDE });
  const zip = await (await fetch('py/repo.zip')).arrayBuffer();
  p.unpackArchive(zip, 'zip', { extractDir: '/repo' });
  p.runPython("import sys; sys.dont_write_bytecode = True; sys.path.insert(0, '/repo'); import compose_web");
  return p;
}

async function initEngine() {
  return createEngine({
    print: () => {}, printErr: (s) => { if (!/^render \d+%/.test(s)) console.warn('[engine]', s); },
    onStream: (l, r, done) => stream && stream(l, r, done),
  });
}

const ready = (async () => {
  status('Lade Komponist und Klangerzeuger…');
  [py, engine] = await Promise.all([initPython(), initEngine()]);
  post({ type: 'ready' });
})().catch((e) => post({ type: 'error', message: 'Laden fehlgeschlagen: ' + e }));

function toInt16(f) {
  const out = new Int16Array(f.length);
  for (let i = 0; i < f.length; i++) {
    const v = Math.max(-1, Math.min(1, f[i]));
    out[i] = Math.round(v * 32767);
  }
  return out;
}

// a sample path from the composer -> the site's file name (no spaces / '#')
const safe = (base) => base.replace(/ /g, '_').replace(/#/g, 's');

function rm(path) { try { engine.FS.unlink(path); } catch (e) { /* gone */ } }
function mkdir(path) { try { engine.FS.mkdir(path); } catch (e) { /* exists */ } }

async function renderNext(gen, id) {
  await ready;
  const FS = engine.FS;
  const t0 = performance.now();
  status('Komponiere…', { gen, id });
  const out = JSON.parse(py.runPython('compose_web.next_piece()'));
  const info = out.info;
  const song = JSON.parse(out.render);
  out.render = null;
  // the sample files this piece plays: the main thread fetches + decodes them into 16-bit WAVs
  const names = new Set();
  for (const tr of song.tracks) for (const z of (tr.instrument.params.samples || [])) {
    const base = z.file.split('/').pop().replace(/\.wav$/i, '');
    names.add(safe(base));
    z.file = `s/${safe(base)}.wav`;
  }
  for (const b of song.buses) for (const f of (b.fx || [])) if (f.params && f.params.ir) f.params.ir = 'ir/room.wav';
  mkdir('/assets'); mkdir('/assets/s'); mkdir('/assets/ir'); mkdir('/out');
  if (!irLoaded) {
    FS.writeFile('/assets/ir/room.wav', new Uint8Array(await (await fetch('samples/ir/French%2018th%20Century%20Salon.wav')).arrayBuffer()));
    irLoaded = true;
  }
  const nid = ++needId;
  const files = await new Promise((resolve) => { waiting.set(nid, resolve); post({ type: 'need', gen, id, nid, names: [...names] }); });
  if (!files) { status('', { gen, id }); return; }                   // stale: a new start came in
  for (const [name, buf] of Object.entries(files)) FS.writeFile(`/assets/s/${name}.wav`, new Uint8Array(buf));
  FS.writeFile('/song.json', JSON.stringify(song));
  rm('/out/mix.wav');
  FS.symlink('/dev/null', '/out/mix.wav');          // the stream is the output: no WAV in memory
  post({ type: 'piece', gen, id, info, sampleRate: song.sampleRate, compose_s: +((performance.now() - t0) / 1000).toFixed(2) });
  let frames = 0, firstChunk = null, tR = performance.now();
  stream = (l, r) => {
    if (firstChunk === null) firstChunk = (performance.now() - tR) / 1000;
    frames += l.length;
    const a = toInt16(l), b = toInt16(r);
    post({ type: 'chunk', gen, id, l: a, r: b }, [a.buffer, b.buffer]);
  };
  engine._as_clear_sample_cache();                  // only this piece's samples in memory
  tR = performance.now();
  const rc = engine.callMain(['render', '/song.json', '--assets', '/assets', '--out', '/out', '--no-png', '--no-analysis', '--quiet']);
  const renderS = (performance.now() - tR) / 1000;
  stream = null;
  for (const name of Object.keys(files)) rm(`/assets/s/${name}.wav`);
  rm('/song.json');
  let fails = ['render failed'], tune = null, lufs = null;
  if (rc === 0) {
    // no render gate here: the native gate's report checks (clicks, flat lead, silent notes, loudness) need the
    // engine's analysis (+40 % time, +110 MB) and its verdicts command; the compose-time checks (arc, breath) ran
    tune = py.runPython('compose_web.tune_json()');
    fails = JSON.parse(py.runPython('compose_web.verdict(None)'));
  }
  engine._as_clear_sample_cache();
  py.runPython('import gc; gc.collect()');
  post({ type: 'done', gen, id, ok: fails.length === 0, fails, tune, lufs, frames,
         render_s: +renderS.toFixed(1), first_chunk_s: +(firstChunk || 0).toFixed(2), realtime_x: +((frames / song.sampleRate) / renderS).toFixed(2),
         heapMB: Math.round(engine.HEAPU8.length / 1048576) });
}

let queue = Promise.resolve();
onmessage = (e) => {
  const m = e.data;
  if (m.cmd === 'files') { const r = waiting.get(m.nid); waiting.delete(m.nid); if (r) r(m.files); return; }
  queue = queue.then(async () => {
    try {
      if (m.cmd === 'start') {
        await ready;
        py.runPython(`compose_web.start(${JSON.stringify(m.genre)}, ${m.seed | 0}, ${JSON.stringify(m.piano)}, ${m.first | 0}, ${m.candidates | 0})`);
      } else if (m.cmd === 'next') {
        await renderNext(m.gen, m.id);
      }
    } catch (err) {
      post({ type: 'error', gen: m.gen, id: m.id, message: String(err && err.message || err) });
    }
  });
};
