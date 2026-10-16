// Endless Piano: the player. The worker composes + renders piece n+1 while piece n plays.
const $ = (id) => document.getElementById(id);
const params = new URLSearchParams(location.search);
const MUTE = params.has('mute');
const GAP = 2.5;                    // seconds of silence between pieces (the render already ends in its reverb tail)
const LEAD = 2.0;                   // seconds of audio scheduled ahead
const FIRST_CANDIDATES = 1, CANDIDATES = 8;   // piece 1 starts fast; later pieces are the best of 8 (the endless default)

const GENRES = ['new-age', 'klassik', 'walzer'];
const PIANOS = ['beste', 'spar'];
const FEEL = { flowing: 'fließend', gentle: 'sanft', bright: 'hell', waltz: 'Walzer', nocturne: 'Nocturne' };
const KEYS = { major: 'Dur', minor: 'Moll' };

const state = {
  genre: GENRES.includes(params.get('genre')) ? params.get('genre') : 'new-age',
  piano: PIANOS.includes(params.get('piano')) ? params.get('piano') : 'beste',
  seed: params.has('seed') ? Math.abs(parseInt(params.get('seed'), 10) || 0) % 1000000 : Math.floor(Math.random() * 1000000),
  gen: 0, ready: false, started: false, playing: false,
};
$('genre').value = state.genre; $('piano').value = state.piano; $('seed').value = state.seed;
window.__metrics = { events: [], errors: [] };
const mark = (name, extra) => window.__metrics.events.push({ name, t: +(performance.now() / 1000).toFixed(2), ...extra });

// ---------------------------------------------------------------- audio
let ctx = null, out = null, decoder = null;
const sources = new Set();
let pieces = [];          // {id, info, sr, chunks: [{l, r}], frames, done, ok, fails, tune, next: chunk index, t0, t1}
let cur = 0;              // index into pieces of the piece playing (or about to)
let until = 0;            // ctx time up to which audio is scheduled
let nextId = 1, busy = false;
const compressed = new Map();     // sample url -> ArrayBuffer (the Opus files, kept once per session)

function ensureAudio() {
  if (ctx) return;
  ctx = new AudioContext({ latencyHint: 'playback' });
  out = ctx.createGain(); out.gain.value = MUTE ? 0 : 1; out.connect(ctx.destination);
  decoder = new OfflineAudioContext(2, 1, 48000);
}

function schedule() {
  if (!ctx || !state.playing) return;
  const now = ctx.currentTime;
  if (until < now) until = now + 0.1;
  let guard = 0;
  while (until < now + LEAD && guard++ < 64) {
    const p = pieces[cur];
    if (!p) { maybeRequest(); break; }
    if (p.next < p.chunks.length) {
      const c = p.chunks[p.next++];
      const n = c.l.length;
      const buf = ctx.createBuffer(2, n, p.sr);
      const L = buf.getChannelData(0), R = buf.getChannelData(1);
      for (let i = 0; i < n; i++) { L[i] = c.l[i] / 32768; R[i] = c.r[i] / 32768; }
      const src = ctx.createBufferSource(); src.buffer = buf; src.connect(out);
      src.onended = () => { sources.delete(src); src.disconnect(); };
      if (p.t0 === undefined) { p.t0 = until; onPieceStart(p); }
      src.start(until); sources.add(src);
      until += n / p.sr;
    } else if (p.done) {
      p.t1 = until;
      until += GAP;
      advance();
    } else {
      break;                        // still rendering: wait for the stream
    }
  }
}

function advance() {
  cur += 1;
  // keep the piece before (its tail may still sound; its chunks serve the download) - drop everything older
  const drop = Math.max(0, cur - 1);
  for (let i = 0; i < drop; i++) pieces[i].chunks = null;
  pieces = pieces.slice(drop);
  cur -= drop;
  maybeRequest();
}

function onPieceStart(p) {
  mark('piece-start', { id: p.id, title: p.info.title, at: +(p.t0 - ctx.currentTime).toFixed(2) });
  if (p.id === 1 && window.__metrics.firstSound === undefined && state.clickAt) {
    window.__metrics.firstSound = +((performance.now() - state.clickAt) / 1000 + (p.t0 - ctx.currentTime)).toFixed(2);
  }
  maybeRequest();
}

function maybeRequest() {
  // render ahead: one piece after the one playing
  if (busy || !state.started) return;
  if (pieces.some((q, i) => i >= cur && q.t0 === undefined)) return;
  busy = true;
  const id = nextId++;
  pieces.push({ id, info: null, sr: 48000, chunks: [], frames: 0, done: false, next: 0 });
  worker.postMessage({ cmd: 'next', gen: state.gen, id });
}

function stopAll() {
  for (const s of sources) { try { s.stop(); } catch (e) { /* stopped */ } s.disconnect(); }
  sources.clear();
}

// ---------------------------------------------------------------- samples: Opus -> 16-bit WAV for the engine
function wav16(ab) {
  const n = ab.length, ch = 2, sr = ab.sampleRate;
  const buf = new ArrayBuffer(44 + n * ch * 2), v = new DataView(buf);
  const w = (o, s) => { for (let i = 0; i < s.length; i++) v.setUint8(o + i, s.charCodeAt(i)); };
  w(0, 'RIFF'); v.setUint32(4, 36 + n * ch * 2, true); w(8, 'WAVE'); w(12, 'fmt ');
  v.setUint32(16, 16, true); v.setUint16(20, 1, true); v.setUint16(22, ch, true); v.setUint32(24, sr, true);
  v.setUint32(28, sr * ch * 2, true); v.setUint16(32, ch * 2, true); v.setUint16(34, 16, true);
  w(36, 'data'); v.setUint32(40, n * ch * 2, true);
  const a = ab.getChannelData(0), b = ab.numberOfChannels > 1 ? ab.getChannelData(1) : a;
  const pcm = new Int16Array(buf, 44);
  for (let i = 0, o = 0; i < n; i++) {
    pcm[o++] = Math.max(-32768, Math.min(32767, Math.round(a[i] * 32767)));
    pcm[o++] = Math.max(-32768, Math.min(32767, Math.round(b[i] * 32767)));
  }
  return buf;
}

async function provide(m) {
  ensureAudio();
  const t0 = performance.now();
  const files = {};
  let fetched = 0, bytes = 0;
  const queue = m.names.slice();
  async function one() {
    while (queue.length) {
      const name = queue.shift();
      const url = `samples/${state.piano}/${name}.opus`;
      let data = compressed.get(url);
      if (!data) {
        const r = await fetch(url);
        if (!r.ok) throw new Error(`${url}: HTTP ${r.status}`);
        data = await r.arrayBuffer();
        compressed.set(url, data); fetched++; bytes += data.byteLength;
      }
      const ab = await decoder.decodeAudioData(data.slice(0));
      files[name] = wav16(ab);
    }
  }
  try {
    await Promise.all(Array.from({ length: 6 }, one));
  } catch (e) {
    showState('Die Klavierklänge konnten nicht geladen werden: ' + e.message);
    window.__metrics.errors.push(String(e));
    throw e;
  }
  mark('samples', { id: m.id, n: m.names.length, fetched, MB: +(bytes / 1e6).toFixed(2), s: +((performance.now() - t0) / 1000).toFixed(2) });
  worker.postMessage({ cmd: 'files', nid: m.nid, files }, Object.values(files));
}

// ---------------------------------------------------------------- worker
const worker = new Worker(new URL('./worker.js', import.meta.url), { type: 'module' });
worker.onmessage = (e) => {
  const m = e.data;
  if (m.gen !== undefined && m.gen !== state.gen) {                // a stream of an earlier start
    if (m.type === 'need') worker.postMessage({ cmd: 'files', nid: m.nid, files: null });   // (the worker drops it)
    return;
  }
  const p = m.id !== undefined ? pieces.find((q) => q.id === m.id) : null;
  if (m.type === 'ready') {
    state.ready = true; mark('ready');
    $('play').disabled = false; $('play').textContent = 'Abspielen';
    showState('');
  } else if (m.type === 'status') {
    if (!state.playing || !pieces[cur] || pieces[cur].t0 === undefined) showState(m.text);
  } else if (m.type === 'need') {
    provide(m).catch(() => {});
  } else if (m.type === 'piece' && p) {
    p.info = m.info; p.sr = m.sampleRate; p.pending = false;
    mark('composed', { id: m.id, title: m.info.title, compose_s: m.info.compose_s, candidates: m.info.candidates });
    schedule();
  } else if (m.type === 'chunk' && p && p.chunks) {
    p.chunks.push({ l: m.l, r: m.r }); p.frames += m.l.length;
    schedule();
  } else if (m.type === 'done' && p) {
    busy = false;
    p.done = true; p.ok = m.ok; p.fails = m.fails; p.tune = m.tune;
    mark('rendered', { id: m.id, ok: m.ok, fails: m.fails, render_s: m.render_s, first_chunk_s: m.first_chunk_s, realtime_x: m.realtime_x, heapMB: m.heapMB, lufs: m.lufs });
    if (!m.ok && p.t0 === undefined) {          // the gate rejected it before it was heard: the slot's next candidate
      const j = pieces.indexOf(p);
      pieces.splice(j, 1);
      if (j < cur) cur -= 1;
    }
    maybeRequest(); schedule(); render();
  } else if (m.type === 'error') {
    busy = false;
    window.__metrics.errors.push(m.message);
    showState('Fehler: ' + m.message);
  }
};

// ---------------------------------------------------------------- controls
function restart() {
  stopAll();
  state.gen += 1;
  pieces = []; cur = 0; until = 0; busy = false; nextId = 1; shownId = null;
  state.genre = $('genre').value; state.piano = $('piano').value;
  state.seed = Math.abs(parseInt($('seed').value, 10) || 0) % 1000000; $('seed').value = state.seed;
  state.started = true;
  worker.postMessage({ cmd: 'start', gen: state.gen, genre: state.genre, seed: state.seed, piano: state.piano,
                       first: FIRST_CANDIDATES, candidates: CANDIDATES });
  maybeRequest();
  render();
}

$('play').onclick = async () => {
  ensureAudio();
  if (!state.started) {
    state.clickAt = performance.now();
    state.playing = true;
    await ctx.resume();
    restart();
  } else if (state.playing) {
    state.playing = false; await ctx.suspend();
  } else {
    state.playing = true; await ctx.resume(); schedule();
  }
  render();
};

$('skip').onclick = () => {
  if (!state.started || !ctx) return;
  const heard = playingPiece();
  stopAll();
  const h = pieces.indexOf(heard);
  pieces.forEach((q, i) => { if (i > h && q.t0 !== undefined) { q.t0 = undefined; q.next = 0; } });   // re-schedule
  if (heard && heard === pieces[cur]) advance();
  until = ctx.currentTime + 0.15;
  mark('skip', { from: heard && heard.id });
  schedule(); render();
};

for (const id of ['genre', 'piano']) $(id).onchange = () => { if (state.started) restart(); };
$('restart').onclick = () => { if (!state.ready) return; ensureAudio(); state.playing = true; ctx.resume(); restart(); };

$('share').onclick = async () => {
  const u = new URL(location.href);
  u.search = ''; u.hash = '';
  u.searchParams.set('seed', $('seed').value); u.searchParams.set('genre', $('genre').value);
  if ($('piano').value !== 'beste') u.searchParams.set('piano', $('piano').value);
  const link = u.toString();
  try { await navigator.clipboard.writeText(link); $('share-out').textContent = 'Link kopiert: ' + link; }
  catch (e) { $('share-out').textContent = link; }
};

function download(blob, name) {
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob); a.download = name;
  document.body.appendChild(a); a.click(); a.remove();
  setTimeout(() => URL.revokeObjectURL(a.href), 10000);
}
const fileName = (p, ext) => `${(p.info.title || 'stueck').replace(/[^\w\- äöüÄÖÜß]+/g, '').trim().replace(/\s+/g, '-')}-${p.info.seed}.${ext}`;

$('wav').onclick = () => {
  const p = playingPiece();
  if (!p || !p.done || !p.chunks) return;
  const n = p.frames, sr = p.sr;
  const buf = new ArrayBuffer(44 + n * 4), v = new DataView(buf);
  const w = (o, s) => { for (let i = 0; i < s.length; i++) v.setUint8(o + i, s.charCodeAt(i)); };
  w(0, 'RIFF'); v.setUint32(4, 36 + n * 4, true); w(8, 'WAVE'); w(12, 'fmt ');
  v.setUint32(16, 16, true); v.setUint16(20, 1, true); v.setUint16(22, 2, true); v.setUint32(24, sr, true);
  v.setUint32(28, sr * 4, true); v.setUint16(32, 4, true); v.setUint16(34, 16, true); w(36, 'data'); v.setUint32(40, n * 4, true);
  const pcm = new Int16Array(buf, 44);
  let o = 0;
  for (const c of p.chunks) for (let i = 0; i < c.l.length; i++) { pcm[o++] = c.l[i]; pcm[o++] = c.r[i]; }
  download(new Blob([buf], { type: 'audio/wav' }), fileName(p, 'wav'));
};
$('notes').onclick = () => {
  const p = playingPiece();
  if (p && p.tune) download(new Blob([p.tune], { type: 'application/json' }), fileName(p, 'json'));
};

// ---------------------------------------------------------------- display
function showState(t) { $('state').textContent = t; }
function playingPiece() {
  if (!ctx) return null;
  const now = ctx.currentTime;
  let best = null;
  for (const p of pieces) if (p.t0 !== undefined && p.t0 <= now + 0.05) best = p;
  return best;
}
const fmt = (s) => `${Math.floor(s / 60)}:${String(Math.floor(s % 60)).padStart(2, '0')}`;
function keyName(k) { const [n, q] = (k || '').split(' '); return `${n}-${KEYS[q] || q || ''}`; }
const SECTION = { intro: 'Intro', coda: 'Coda', interlude: 'Zwischenspiel', climax: 'Höhepunkt', build: 'Steigerung' };
let shownId = null;

function render() {
  $('play').textContent = !state.ready ? 'Lade…' : (state.playing ? 'Pause' : (state.started ? 'Weiter' : 'Abspielen'));
  $('skip').disabled = !state.started;
  const p = playingPiece();
  if (!p || !p.info) {
    if (state.started && state.playing) showState('Das erste Stück wird komponiert…');
    return;
  }
  const i = p.info;
  if (shownId !== p.id) {
    shownId = p.id;
    $('title').textContent = i.title;
    $('meta').textContent = `${keyName(i.key)} · ${i.tempo} BPM · ${i.meter} · ${FEEL[i.feel] || i.feel} · Stück ${i.index}` +
      (i.candidates > 1 ? ` · bestes von ${i.candidates}` : '');
    const form = $('form');
    form.querySelectorAll('div').forEach((d) => d.remove());
    const total = i.sections.length ? i.sections[i.sections.length - 1].end : i.seconds;
    for (const s of i.sections) {
      const d = document.createElement('div');
      d.style.flex = `${Math.max(0.001, s.end - s.start)} 1 0`;
      d.textContent = SECTION[s.name] || s.name; d.title = `${s.name} ${fmt(s.start)}`;
      d.dataset.start = s.start; d.dataset.end = s.end;
      form.appendChild(d);
    }
    form.dataset.total = total;
    $('playhead').style.display = 'block';
  }
  const t = Math.max(0, ctx.currentTime - p.t0);
  const total = +$('form').dataset.total || i.seconds;
  $('time').textContent = `${fmt(Math.min(t, total))} / ${fmt(total)}`;
  $('playhead').style.left = `${Math.min(100, 100 * t / total)}%`;
  $('form').querySelectorAll('div').forEach((d) => d.classList.toggle('now', t >= +d.dataset.start && t < +d.dataset.end));
  $('wav').disabled = !(p.done && p.chunks);
  $('notes').disabled = !p.tune;
  const next = pieces.find((q) => q.t0 === undefined);
  showState(state.playing ? (next && !next.done ? 'Das nächste Stück entsteht…' : (next && next.done ? `Als Nächstes: ${next.info.title}` : '')) : 'Pausiert');
}

setInterval(() => { schedule(); render(); }, 250);
