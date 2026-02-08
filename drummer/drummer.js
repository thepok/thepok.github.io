const STEPS = 16;
const STEPS_PER_BEAT = 4;

const SOUND_LABELS = {
  "classic:kick": "Classic — Kick",
  "classic:snare": "Classic — Snare",
  "classic:hat": "Classic — Hi‑Hat",
  "classic:perc": "Classic — Perc",
  "toy:kick": "Toy — Kick",
  "toy:snare": "Toy — Snare",
  "toy:hat": "Toy — Hi‑Hat",
  "toy:perc": "Toy — Perc",
  "arcade:kick": "Arcade — Kick",
  "arcade:snare": "Arcade — Snare",
  "arcade:hat": "Arcade — Hi‑Hat",
  "arcade:perc": "Arcade — Perc",
  "recorded:kick": "My Kit — Kick",
  "recorded:snare": "My Kit — Snare",
  "recorded:hat": "My Kit — Hi‑Hat",
  "recorded:perc": "My Kit — Perc",
};

const SOUND_OPTIONS = [
  {
    label: "Classic (Synth)",
    values: ["classic:kick", "classic:snare", "classic:hat", "classic:perc"],
  },
  { label: "Toy (Synth)", values: ["toy:kick", "toy:snare", "toy:hat", "toy:perc"] },
  {
    label: "Arcade (Synth)",
    values: ["arcade:kick", "arcade:snare", "arcade:hat", "arcade:perc"],
  },
  {
    label: "My Kit (Recorded)",
    values: ["recorded:kick", "recorded:snare", "recorded:hat", "recorded:perc"],
  },
];

function defaultTracks(preset = "classic") {
  const p = ["classic", "toy", "arcade", "recorded"].includes(preset) ? preset : "classic";
  return [
    { soundKey: `${p}:kick` },
    { soundKey: `${p}:snare` },
    { soundKey: `${p}:hat` },
    { soundKey: `${p}:perc` },
  ];
}

const state = {
  tracks: defaultTracks("classic"),
  pattern: defaultTracks("classic").map(() => Array.from({ length: STEPS }, () => false)),
  isPlaying: false,
  currentStep: 0,
  nextNoteTime: 0,
  timerId: null,
};

const el = {
  grid: document.getElementById("grid"),
  togglePlay: document.getElementById("togglePlay"),
  clear: document.getElementById("clear"),
  addRow: document.getElementById("addRow"),
  soundSet: document.getElementById("soundSet"),
  bps: document.getElementById("bps"),
  bpsNumber: document.getElementById("bpsNumber"),
  bpmLabel: document.getElementById("bpmLabel"),

  recStatus: document.getElementById("recStatus"),
  micEnable: document.getElementById("micEnable"),
  recStart: document.getElementById("recStart"),
  recStop: document.getElementById("recStop"),
  recPlay: document.getElementById("recPlay"),
  trimStart: document.getElementById("trimStart"),
  trimStartNum: document.getElementById("trimStartNum"),
  trimEnd: document.getElementById("trimEnd"),
  trimEndNum: document.getElementById("trimEndNum"),
  trimMeta: document.getElementById("trimMeta"),
  saveTo: document.getElementById("saveTo"),
  saveSample: document.getElementById("saveSample"),
  clearKit: document.getElementById("clearKit"),
};

let audioCtx = null;
let master = null;
let play = null;
let persistTimer = null;

const REC_INSTRUMENTS = ["kick", "snare", "hat", "perc"];
const kit = {
  kick: null,
  snare: null,
  hat: null,
  perc: null,
};

let recStream = null;
let recorder = null;
let recChunks = [];
let lastRecording = null; // { blob, mime, durationSec, buffer }

function clamp(n, a, b) {
  return Math.min(b, Math.max(a, n));
}

function getBps() {
  const raw = Number.parseFloat(el.bpsNumber.value);
  return clamp(Number.isFinite(raw) ? raw : 2, 0.5, 6);
}

function setBps(v) {
  const bps = clamp(v, 0.5, 6);
  el.bps.value = String(bps);
  el.bpsNumber.value = String(bps);
  el.bpmLabel.textContent = `${Math.round(bps * 60)} bpm`;
}

function stepDurationSec() {
  return 1 / (getBps() * STEPS_PER_BEAT);
}

function ensureAudio() {
  if (audioCtx) return;
  audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  master = audioCtx.createGain();
  master.gain.value = 0.65;
  master.connect(audioCtx.destination);
  play = makeSoundSet();
}

function noiseBuffer(seconds = 0.25) {
  const sr = audioCtx.sampleRate;
  const length = Math.floor(seconds * sr);
  const buffer = audioCtx.createBuffer(1, length, sr);
  const data = buffer.getChannelData(0);
  for (let i = 0; i < length; i++) data[i] = Math.random() * 2 - 1;
  return buffer;
}

function playKickClassic(time) {
  const osc = audioCtx.createOscillator();
  const gain = audioCtx.createGain();
  osc.type = "sine";

  osc.frequency.setValueAtTime(170, time);
  osc.frequency.exponentialRampToValueAtTime(52, time + 0.12);

  gain.gain.setValueAtTime(0.0001, time);
  gain.gain.exponentialRampToValueAtTime(0.95, time + 0.01);
  gain.gain.exponentialRampToValueAtTime(0.0001, time + 0.18);

  osc.connect(gain).connect(master);
  osc.start(time);
  osc.stop(time + 0.22);
}

function playSnareClassic(time) {
  const noise = audioCtx.createBufferSource();
  noise.buffer = noiseBuffer(0.2);
  const noiseFilter = audioCtx.createBiquadFilter();
  noiseFilter.type = "highpass";
  noiseFilter.frequency.value = 900;

  const noiseGain = audioCtx.createGain();
  noiseGain.gain.setValueAtTime(0.0001, time);
  noiseGain.gain.exponentialRampToValueAtTime(0.6, time + 0.01);
  noiseGain.gain.exponentialRampToValueAtTime(0.0001, time + 0.14);

  const tone = audioCtx.createOscillator();
  tone.type = "triangle";
  tone.frequency.setValueAtTime(190, time);

  const toneGain = audioCtx.createGain();
  toneGain.gain.setValueAtTime(0.0001, time);
  toneGain.gain.exponentialRampToValueAtTime(0.28, time + 0.005);
  toneGain.gain.exponentialRampToValueAtTime(0.0001, time + 0.08);

  noise.connect(noiseFilter).connect(noiseGain).connect(master);
  tone.connect(toneGain).connect(master);

  noise.start(time);
  noise.stop(time + 0.2);
  tone.start(time);
  tone.stop(time + 0.12);
}

function playHatClassic(time) {
  const src = audioCtx.createBufferSource();
  src.buffer = noiseBuffer(0.08);

  const hp = audioCtx.createBiquadFilter();
  hp.type = "highpass";
  hp.frequency.value = 7000;

  const gain = audioCtx.createGain();
  gain.gain.setValueAtTime(0.0001, time);
  gain.gain.exponentialRampToValueAtTime(0.25, time + 0.004);
  gain.gain.exponentialRampToValueAtTime(0.0001, time + 0.055);

  src.connect(hp).connect(gain).connect(master);
  src.start(time);
  src.stop(time + 0.09);
}

function playPercClassic(time) {
  const osc = audioCtx.createOscillator();
  osc.type = "square";

  const filter = audioCtx.createBiquadFilter();
  filter.type = "lowpass";
  filter.frequency.setValueAtTime(1600, time);

  const gain = audioCtx.createGain();
  gain.gain.setValueAtTime(0.0001, time);
  gain.gain.exponentialRampToValueAtTime(0.22, time + 0.006);
  gain.gain.exponentialRampToValueAtTime(0.0001, time + 0.075);

  osc.frequency.setValueAtTime(420, time);
  osc.frequency.exponentialRampToValueAtTime(260, time + 0.08);

  osc.connect(filter).connect(gain).connect(master);
  osc.start(time);
  osc.stop(time + 0.1);
}

function playKickToy(time) {
  const osc = audioCtx.createOscillator();
  osc.type = "triangle";

  const gain = audioCtx.createGain();
  gain.gain.setValueAtTime(0.0001, time);
  gain.gain.exponentialRampToValueAtTime(0.55, time + 0.01);
  gain.gain.exponentialRampToValueAtTime(0.0001, time + 0.12);

  const filter = audioCtx.createBiquadFilter();
  filter.type = "lowpass";
  filter.frequency.setValueAtTime(900, time);
  filter.frequency.exponentialRampToValueAtTime(220, time + 0.12);

  osc.frequency.setValueAtTime(220, time);
  osc.frequency.exponentialRampToValueAtTime(85, time + 0.13);

  osc.connect(filter).connect(gain).connect(master);
  osc.start(time);
  osc.stop(time + 0.16);
}

function playSnareToy(time) {
  const click = audioCtx.createOscillator();
  click.type = "square";
  click.frequency.setValueAtTime(980, time);

  const clickGain = audioCtx.createGain();
  clickGain.gain.setValueAtTime(0.0001, time);
  clickGain.gain.exponentialRampToValueAtTime(0.25, time + 0.002);
  clickGain.gain.exponentialRampToValueAtTime(0.0001, time + 0.03);

  const noise = audioCtx.createBufferSource();
  noise.buffer = noiseBuffer(0.12);
  const bp = audioCtx.createBiquadFilter();
  bp.type = "bandpass";
  bp.frequency.value = 2200;
  bp.Q.value = 0.9;

  const noiseGain = audioCtx.createGain();
  noiseGain.gain.setValueAtTime(0.0001, time);
  noiseGain.gain.exponentialRampToValueAtTime(0.25, time + 0.004);
  noiseGain.gain.exponentialRampToValueAtTime(0.0001, time + 0.09);

  click.connect(clickGain).connect(master);
  noise.connect(bp).connect(noiseGain).connect(master);

  click.start(time);
  click.stop(time + 0.04);
  noise.start(time);
  noise.stop(time + 0.13);
}

function playHatToy(time) {
  const src = audioCtx.createBufferSource();
  src.buffer = noiseBuffer(0.06);

  const hp = audioCtx.createBiquadFilter();
  hp.type = "highpass";
  hp.frequency.value = 9500;

  const gain = audioCtx.createGain();
  gain.gain.setValueAtTime(0.0001, time);
  gain.gain.exponentialRampToValueAtTime(0.15, time + 0.003);
  gain.gain.exponentialRampToValueAtTime(0.0001, time + 0.035);

  src.connect(hp).connect(gain).connect(master);
  src.start(time);
  src.stop(time + 0.07);
}

function playPercToy(time) {
  const osc = audioCtx.createOscillator();
  osc.type = "sine";
  osc.frequency.setValueAtTime(660, time);
  osc.frequency.exponentialRampToValueAtTime(440, time + 0.09);

  const gain = audioCtx.createGain();
  gain.gain.setValueAtTime(0.0001, time);
  gain.gain.exponentialRampToValueAtTime(0.18, time + 0.004);
  gain.gain.exponentialRampToValueAtTime(0.0001, time + 0.1);

  osc.connect(gain).connect(master);
  osc.start(time);
  osc.stop(time + 0.12);
}

function playKickArcade(time) {
  const osc = audioCtx.createOscillator();
  osc.type = "square";
  osc.frequency.setValueAtTime(180, time);
  osc.frequency.exponentialRampToValueAtTime(65, time + 0.14);

  const gain = audioCtx.createGain();
  gain.gain.setValueAtTime(0.0001, time);
  gain.gain.exponentialRampToValueAtTime(0.7, time + 0.008);
  gain.gain.exponentialRampToValueAtTime(0.0001, time + 0.16);

  const filter = audioCtx.createBiquadFilter();
  filter.type = "lowpass";
  filter.frequency.setValueAtTime(2400, time);
  filter.frequency.exponentialRampToValueAtTime(700, time + 0.13);

  osc.connect(filter).connect(gain).connect(master);
  osc.start(time);
  osc.stop(time + 0.18);
}

function playSnareArcade(time) {
  const noise = audioCtx.createBufferSource();
  noise.buffer = noiseBuffer(0.16);
  const hp = audioCtx.createBiquadFilter();
  hp.type = "highpass";
  hp.frequency.value = 1400;

  const noiseGain = audioCtx.createGain();
  noiseGain.gain.setValueAtTime(0.0001, time);
  noiseGain.gain.exponentialRampToValueAtTime(0.42, time + 0.008);
  noiseGain.gain.exponentialRampToValueAtTime(0.0001, time + 0.11);

  const tone = audioCtx.createOscillator();
  tone.type = "square";
  tone.frequency.setValueAtTime(240, time);

  const toneGain = audioCtx.createGain();
  toneGain.gain.setValueAtTime(0.0001, time);
  toneGain.gain.exponentialRampToValueAtTime(0.22, time + 0.004);
  toneGain.gain.exponentialRampToValueAtTime(0.0001, time + 0.06);

  noise.connect(hp).connect(noiseGain).connect(master);
  tone.connect(toneGain).connect(master);

  noise.start(time);
  noise.stop(time + 0.17);
  tone.start(time);
  tone.stop(time + 0.09);
}

function playHatArcade(time) {
  const osc1 = audioCtx.createOscillator();
  const osc2 = audioCtx.createOscillator();
  osc1.type = "square";
  osc2.type = "square";
  osc1.frequency.setValueAtTime(8200, time);
  osc2.frequency.setValueAtTime(12200, time);

  const hp = audioCtx.createBiquadFilter();
  hp.type = "highpass";
  hp.frequency.value = 6500;

  const gain = audioCtx.createGain();
  gain.gain.setValueAtTime(0.0001, time);
  gain.gain.exponentialRampToValueAtTime(0.12, time + 0.002);
  gain.gain.exponentialRampToValueAtTime(0.0001, time + 0.04);

  osc1.connect(hp);
  osc2.connect(hp);
  hp.connect(gain).connect(master);
  osc1.start(time);
  osc2.start(time);
  osc1.stop(time + 0.06);
  osc2.stop(time + 0.06);
}

function playPercArcade(time) {
  const osc = audioCtx.createOscillator();
  osc.type = "triangle";
  osc.frequency.setValueAtTime(520, time);
  osc.frequency.exponentialRampToValueAtTime(320, time + 0.07);

  const gain = audioCtx.createGain();
  gain.gain.setValueAtTime(0.0001, time);
  gain.gain.exponentialRampToValueAtTime(0.16, time + 0.004);
  gain.gain.exponentialRampToValueAtTime(0.0001, time + 0.08);

  const lp = audioCtx.createBiquadFilter();
  lp.type = "lowpass";
  lp.frequency.setValueAtTime(1600, time);

  osc.connect(lp).connect(gain).connect(master);
  osc.start(time);
  osc.stop(time + 0.1);
}

function makeSoundSet() {
  return {
    "classic:kick": playKickClassic,
    "classic:snare": playSnareClassic,
    "classic:hat": playHatClassic,
    "classic:perc": playPercClassic,
    "toy:kick": playKickToy,
    "toy:snare": playSnareToy,
    "toy:hat": playHatToy,
    "toy:perc": playPercToy,
    "arcade:kick": playKickArcade,
    "arcade:snare": playSnareArcade,
    "arcade:hat": playHatArcade,
    "arcade:perc": playPercArcade,
    "recorded:kick": (time) => playRecorded("kick", time),
    "recorded:snare": (time) => playRecorded("snare", time),
    "recorded:hat": (time) => playRecorded("hat", time),
    "recorded:perc": (time) => playRecorded("perc", time),
  };
}

function recordedAvailable(soundKey) {
  const [set, inst] = String(soundKey || "").split(":");
  if (set !== "recorded") return true;
  return Boolean(kit?.[inst]?.blob);
}

function playRecorded(inst, time) {
  const entry = kit?.[inst];
  if (!entry?.blob) return;
  if (!audioCtx) return;

  if (!entry.buffer && !entry.decodePromise) {
    entry.decodePromise = entry.blob
      .arrayBuffer()
      .then((ab) => audioCtx.decodeAudioData(ab))
      .then((buf) => {
        entry.buffer = buf;
        return buf;
      })
      .catch(() => null);
  }

  const schedule = (buffer) => {
    if (!buffer) return;
    const start = clamp(Number(entry.startSec ?? 0), 0, buffer.duration);
    const end = clamp(Number(entry.endSec ?? buffer.duration), 0, buffer.duration);
    const dur = Math.max(0.02, end - start);

    const src = audioCtx.createBufferSource();
    src.buffer = buffer;
    const g = audioCtx.createGain();
    g.gain.setValueAtTime(0.0001, time);
    g.gain.exponentialRampToValueAtTime(1.0, time + 0.008);
    g.gain.exponentialRampToValueAtTime(0.0001, time + dur);
    src.connect(g).connect(master);
    try {
      src.start(time, start, dur);
    } catch {
      // ignore
    }
  };

  if (entry.buffer) schedule(entry.buffer);
  else entry.decodePromise?.then((buf) => schedule(buf));
}

function scheduleStep(stepIndex, time) {
  for (let t = 0; t < state.tracks.length; t++) {
    if (!state.pattern[t][stepIndex]) continue;
    const soundKey = state.tracks[t]?.soundKey;
    play?.[soundKey]?.(time);
  }

  const delayMs = Math.max(0, (time - audioCtx.currentTime) * 1000);
  window.setTimeout(() => setPlayhead(stepIndex), delayMs);
}

function nextNote() {
  state.nextNoteTime += stepDurationSec();
  state.currentStep = (state.currentStep + 1) % STEPS;
}

function scheduler() {
  const scheduleAheadTime = 0.12;
  const lookaheadMs = 25;

  while (state.nextNoteTime < audioCtx.currentTime + scheduleAheadTime) {
    scheduleStep(state.currentStep, state.nextNoteTime);
    nextNote();
  }

  state.timerId = window.setTimeout(scheduler, lookaheadMs);
}

function setPlayButton(isPlaying) {
  const icon = el.togglePlay.querySelector(".btnIcon");
  const text = el.togglePlay.querySelector(".btnText");
  icon.textContent = isPlaying ? "⏸" : "▶";
  text.textContent = isPlaying ? "Stop" : "Start";
}

function start() {
  ensureAudio();
  audioCtx.resume?.();

  state.isPlaying = true;
  state.currentStep = 0;
  state.nextNoteTime = audioCtx.currentTime + 0.05;
  setPlayButton(true);
  scheduler();
}

function stop() {
  state.isPlaying = false;
  setPlayButton(false);
  if (state.timerId) window.clearTimeout(state.timerId);
  state.timerId = null;
  clearPlayhead();
}

function toggle() {
  if (state.isPlaying) stop();
  else start();
}

function buildGrid() {
  el.grid.innerHTML = "";
  const css = getComputedStyle(document.documentElement);

  const caption = document.createElement("caption");
  caption.className = "srOnly";
  caption.textContent = "Step sequencer grid";
  el.grid.appendChild(caption);

  const thead = document.createElement("thead");
  const headRow = document.createElement("tr");

  const corner = document.createElement("th");
  corner.className = "rowHead";
  corner.scope = "col";
  headRow.appendChild(corner);

  for (let s = 0; s < STEPS; s++) {
    const th = document.createElement("th");
    th.className = "stepHead";
    th.scope = "col";
    th.textContent = String(s + 1);
    headRow.appendChild(th);
  }

  thead.appendChild(headRow);
  el.grid.appendChild(thead);

  const tbody = document.createElement("tbody");

  for (let t = 0; t < state.tracks.length; t++) {
    const track = state.tracks[t];
    const tr = document.createElement("tr");

    const rowHead = document.createElement("th");
    rowHead.className = "rowHead";
    rowHead.scope = "row";

    const controls = document.createElement("div");
    controls.className = "trackControls";

    const top = document.createElement("div");
    top.className = "trackTop";

    const remove = document.createElement("button");
    remove.type = "button";
    remove.className = "rowRemove";
    remove.textContent = "×";
    remove.title = "Remove row";
    remove.setAttribute("aria-label", "Remove row");
    remove.disabled = state.tracks.length <= 1;
    remove.addEventListener("click", () => {
      removeRow(t);
    });

    const tag = document.createElement("span");
    tag.className = "tag";

    const name = document.createElement("span");
    name.className = "trackName";
    name.textContent = SOUND_LABELS[track.soundKey] || track.soundKey;

    top.append(remove, tag, name);

    const select = document.createElement("select");
    select.className = "rowSelect";
    select.setAttribute("aria-label", "Row sound");
    for (const group of SOUND_OPTIONS) {
      const og = document.createElement("optgroup");
      og.label = group.label;
      for (const v of group.values) {
        const opt = document.createElement("option");
        opt.value = v;
        const ok = recordedAvailable(v);
        opt.disabled = !ok;
        opt.textContent = ok ? SOUND_LABELS[v] || v : `${SOUND_LABELS[v] || v} (record first)`;
        og.appendChild(opt);
      }
      select.appendChild(og);
    }
    select.value = track.soundKey;
    select.addEventListener("change", () => {
      state.tracks[t].soundKey = select.value;
      name.textContent = SOUND_LABELS[select.value] || select.value;
      updateRowVisuals(t, select.value);
      schedulePersist();
    });

    controls.append(top, select);
    rowHead.appendChild(controls);

    const trackColor = trackColorFromSoundKey(css, track.soundKey);
    tag.style.background = trackColor;

    for (let s = 0; s < STEPS; s++) {
      const td = document.createElement("td");
      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = "cell";
      btn.style.setProperty("--trackColor", trackColor);
      btn.dataset.track = String(t);
      btn.dataset.step = String(s);
      btn.setAttribute("aria-label", `${SOUND_LABELS[track.soundKey] || track.soundKey}, step ${s + 1}`);
      const isOn = Boolean(state.pattern[t]?.[s]);
      btn.classList.toggle("on", isOn);
      btn.setAttribute("aria-pressed", isOn ? "true" : "false");
      btn.addEventListener("click", () => {
        const next = !state.pattern[t][s];
        state.pattern[t][s] = next;
        btn.classList.toggle("on", next);
        btn.setAttribute("aria-pressed", next ? "true" : "false");
        if (!state.isPlaying) {
          ensureAudio();
          audioCtx.resume?.();
          play?.[state.tracks[t]?.soundKey]?.(audioCtx.currentTime + 0.005);
        }
        schedulePersist();
      });

      td.appendChild(btn);
      tr.appendChild(td);
    }

    tr.prepend(rowHead);
    tbody.appendChild(tr);
  }

  el.grid.appendChild(tbody);
}

function trackColorFromSoundKey(css, soundKey) {
  const instrument = String(soundKey || "").split(":")[1] || "kick";
  if (instrument === "snare") return css.getPropertyValue("--snare").trim();
  if (instrument === "hat") return css.getPropertyValue("--hat").trim();
  if (instrument === "perc") return css.getPropertyValue("--perc").trim();
  return css.getPropertyValue("--kick").trim();
}

function updateRowVisuals(trackIndex, soundKey) {
  const css = getComputedStyle(document.documentElement);
  const trackColor = trackColorFromSoundKey(css, soundKey);
  document.querySelectorAll(`.cell[data-track="${trackIndex}"]`).forEach((cell) => {
    cell.style.setProperty("--trackColor", trackColor);
    const step = Number.parseInt(cell.dataset.step || "0", 10) + 1;
    cell.setAttribute("aria-label", `${SOUND_LABELS[soundKey] || soundKey}, step ${step}`);
  });
  const tag = el.grid.querySelectorAll("tbody tr")[trackIndex]?.querySelector(".tag");
  if (tag) tag.style.background = trackColor;
}

function addRow() {
  const preset = el.soundSet?.value || "classic";
  const soundKey = ["classic", "toy", "arcade", "recorded"].includes(preset)
    ? `${preset}:kick`
    : "classic:kick";
  state.tracks.push({ soundKey });
  state.pattern.push(Array.from({ length: STEPS }, () => false));
  buildGrid();
  schedulePersist();
}

function removeRow(index) {
  if (state.tracks.length <= 1) return;
  state.tracks.splice(index, 1);
  state.pattern.splice(index, 1);
  buildGrid();
  schedulePersist();
}

function clearPattern() {
  for (let t = 0; t < state.tracks.length; t++) {
    for (let s = 0; s < STEPS; s++) state.pattern[t][s] = false;
  }
  buildGrid();
  schedulePersist();
}

function clearPlayhead() {
  document.querySelectorAll(".cell.playhead").forEach((c) => c.classList.remove("playhead"));
}

function setPlayhead(step) {
  clearPlayhead();
  document.querySelectorAll(`.cell[data-step="${step}"]`).forEach((c) => c.classList.add("playhead"));
}

function bindUI() {
  setBps(Number.parseFloat(el.bps.value));

  el.togglePlay.addEventListener("click", toggle);
  el.clear.addEventListener("click", () => {
    stop();
    clearPattern();
  });

  const savedSet = window.localStorage?.getItem("drummer.preset");
  if (el.soundSet && savedSet) el.soundSet.value = savedSet;
  if (el.soundSet) {
    el.soundSet.addEventListener("change", () => {
      window.localStorage?.setItem("drummer.preset", el.soundSet.value);
    });
  }

  el.addRow?.addEventListener("click", () => {
    stop();
    addRow();
  });

  const syncTempo = (value) => setBps(Number.parseFloat(value));
  el.bps.addEventListener("input", (e) => syncTempo(e.target.value));
  el.bpsNumber.addEventListener("input", (e) => syncTempo(e.target.value));

  window.addEventListener("keydown", (e) => {
    if (e.code === "Space") {
      e.preventDefault();
      toggle();
    }
  });

  document.addEventListener("visibilitychange", () => {
    if (document.hidden && state.isPlaying) stop();
  });

  bindRecorderUI();
}

function schedulePersist() {
  if (!window.localStorage) return;
  if (persistTimer) window.clearTimeout(persistTimer);
  persistTimer = window.setTimeout(persistState, 120);
}

function persistState() {
  try {
    window.localStorage.setItem(
      "drummer.state.v1",
      JSON.stringify({
        tracks: state.tracks,
        pattern: state.pattern,
        bps: getBps(),
      }),
    );
  } catch {
    // ignore
  }
}

function loadState() {
  const raw = window.localStorage?.getItem("drummer.state.v1");
  if (!raw) return;
  try {
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed.tracks) && Array.isArray(parsed.pattern)) {
      state.tracks = parsed.tracks
        .map((t) => ({ soundKey: typeof t?.soundKey === "string" ? t.soundKey : "classic:kick" }))
        .filter((t) => Boolean(SOUND_LABELS[t.soundKey]));
      if (state.tracks.length === 0) state.tracks = defaultTracks("classic");

      state.pattern = state.tracks.map((_, idx) => {
        const row = Array.isArray(parsed.pattern[idx]) ? parsed.pattern[idx] : [];
        return Array.from({ length: STEPS }, (_, s) => Boolean(row[s]));
      });
    }
    if (typeof parsed.bps === "number") setBps(parsed.bps);
  } catch {
    // ignore
  }
}

loadState();
buildGrid();
bindUI();

function openDb() {
  if (!("indexedDB" in window)) return Promise.resolve(null);
  return new Promise((resolve) => {
    const req = indexedDB.open("drummer", 1);
    req.onupgradeneeded = () => {
      const db = req.result;
      if (!db.objectStoreNames.contains("kit")) db.createObjectStore("kit", { keyPath: "key" });
    };
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => resolve(null);
  });
}

async function idbGet(key) {
  const db = await dbPromise;
  if (!db) return null;
  return new Promise((resolve) => {
    const tx = db.transaction("kit", "readonly");
    const store = tx.objectStore("kit");
    const req = store.get(key);
    req.onsuccess = () => resolve(req.result || null);
    req.onerror = () => resolve(null);
  });
}

async function idbPut(value) {
  const db = await dbPromise;
  if (!db) return false;
  return new Promise((resolve) => {
    const tx = db.transaction("kit", "readwrite");
    const store = tx.objectStore("kit");
    const req = store.put(value);
    req.onsuccess = () => resolve(true);
    req.onerror = () => resolve(false);
  });
}

async function idbDelete(key) {
  const db = await dbPromise;
  if (!db) return false;
  return new Promise((resolve) => {
    const tx = db.transaction("kit", "readwrite");
    const store = tx.objectStore("kit");
    const req = store.delete(key);
    req.onsuccess = () => resolve(true);
    req.onerror = () => resolve(false);
  });
}

async function initKit() {
  for (const inst of REC_INSTRUMENTS) {
    const saved = await idbGet(inst);
    if (saved?.blob) {
      kit[inst] = {
        key: inst,
        blob: saved.blob,
        mime: saved.mime || "",
        startSec: typeof saved.startSec === "number" ? saved.startSec : 0,
        endSec: typeof saved.endSec === "number" ? saved.endSec : 0,
        buffer: null,
        decodePromise: null,
      };
    }
  }
}

// Recorder + IndexedDB (simple, local only)
const dbPromise = openDb();

initKit().then(() => {
  buildGrid();
  updateRecorderUI();
});

function setRecStatus(text) {
  if (el.recStatus) el.recStatus.textContent = text;
}

function updateRecorderUI() {
  const has = Boolean(lastRecording?.buffer);
  const dur = lastRecording?.durationSec || 0;

  for (const e of [el.trimStart, el.trimStartNum, el.trimEnd, el.trimEndNum, el.saveTo, el.saveSample]) {
    if (!e) continue;
    e.disabled = !has;
  }
  if (el.recPlay) el.recPlay.disabled = !has;
  if (el.trimMeta) el.trimMeta.textContent = has ? `Recording length: ${dur.toFixed(2)} sec` : "No recording yet";

  if (has) {
    const max = Math.max(0.01, dur);
    el.trimStart.max = String(max);
    el.trimStartNum.max = String(max);
    el.trimEnd.max = String(max);
    el.trimEndNum.max = String(max);
  } else {
    el.trimStart.max = "1";
    el.trimEnd.max = "1";
  }
}

function syncTrim(which, value) {
  if (!lastRecording?.buffer) return;
  const dur = lastRecording.durationSec;
  const v = clamp(Number.parseFloat(value), 0, dur);
  const start = clamp(Number.parseFloat(el.trimStartNum.value), 0, dur);
  const end = clamp(Number.parseFloat(el.trimEndNum.value), 0, dur);

  let nextStart = start;
  let nextEnd = end;
  if (which === "start") nextStart = v;
  else nextEnd = v;

  if (nextEnd <= nextStart + 0.02) {
    if (which === "start") nextEnd = clamp(nextStart + 0.1, 0, dur);
    else nextStart = clamp(nextEnd - 0.1, 0, dur);
  }

  el.trimStart.value = String(nextStart);
  el.trimStartNum.value = String(nextStart);
  el.trimEnd.value = String(nextEnd);
  el.trimEndNum.value = String(nextEnd);
}

function getTrim() {
  if (!lastRecording?.buffer) return { startSec: 0, endSec: 0 };
  const dur = lastRecording.durationSec;
  const startSec = clamp(Number.parseFloat(el.trimStartNum.value), 0, dur);
  const endSec = clamp(Number.parseFloat(el.trimEndNum.value), 0, dur);
  return { startSec, endSec: Math.max(startSec + 0.02, endSec) };
}

async function enableMic() {
  if (!navigator.mediaDevices?.getUserMedia) {
    setRecStatus("Mic: not supported in this browser");
    return false;
  }
  try {
    recStream = await navigator.mediaDevices.getUserMedia({ audio: true });
    setRecStatus("Mic: ready");
    return true;
  } catch {
    setRecStatus("Mic: permission denied");
    return false;
  }
}

function pickMimeType() {
  const types = ["audio/webm;codecs=opus", "audio/ogg;codecs=opus", "audio/webm", "audio/ogg"];
  if (!window.MediaRecorder) return "";
  for (const t of types) if (MediaRecorder.isTypeSupported(t)) return t;
  return "";
}

async function startRecording() {
  const ok = recStream ? true : await enableMic();
  if (!ok) return;
  if (!window.MediaRecorder) {
    setRecStatus("Recorder: not supported in this browser");
    return;
  }

  const mimeType = pickMimeType();
  recChunks = [];
  recorder = new MediaRecorder(recStream, mimeType ? { mimeType } : undefined);
  recorder.ondataavailable = (e) => {
    if (e.data && e.data.size > 0) recChunks.push(e.data);
  };
  recorder.onstop = () => void onRecordingStopped(mimeType);
  recorder.start();

  setRecStatus("Recording…");
  el.recStart.disabled = true;
  el.recStop.disabled = false;
}

async function stopRecording() {
  if (!recorder || recorder.state === "inactive") return;
  recorder.stop();
  el.recStop.disabled = true;
}

async function onRecordingStopped(mimeType) {
  const blob = new Blob(recChunks, { type: mimeType || recChunks?.[0]?.type || "audio/webm" });
  ensureAudio();
  try {
    const ab = await blob.arrayBuffer();
    const buffer = await audioCtx.decodeAudioData(ab);
    lastRecording = { blob, mime: blob.type, buffer, durationSec: buffer.duration };
    syncTrim("start", 0);
    syncTrim("end", buffer.duration);
    updateRecorderUI();
    setRecStatus("Recording ready");
  } catch {
    lastRecording = null;
    setRecStatus("Could not decode recording (try another browser)");
  } finally {
    el.recStart.disabled = false;
    el.recStop.disabled = true;
    el.recPlay.disabled = !lastRecording;
  }
}

function playTrimPreview() {
  if (!lastRecording?.buffer) return;
  ensureAudio();
  audioCtx.resume?.();
  const { startSec, endSec } = getTrim();
  const dur = Math.max(0.02, endSec - startSec);
  const time = audioCtx.currentTime + 0.01;

  const src = audioCtx.createBufferSource();
  src.buffer = lastRecording.buffer;
  const g = audioCtx.createGain();
  g.gain.setValueAtTime(0.0001, time);
  g.gain.exponentialRampToValueAtTime(1.0, time + 0.01);
  g.gain.exponentialRampToValueAtTime(0.0001, time + dur);
  src.connect(g).connect(master);
  try {
    src.start(time, startSec, dur);
  } catch {
    // ignore
  }
}

async function saveTrimToKit() {
  if (!lastRecording?.blob) return;
  const inst = el.saveTo.value;
  const { startSec, endSec } = getTrim();
  const value = {
    key: inst,
    blob: lastRecording.blob,
    mime: lastRecording.mime,
    startSec,
    endSec,
    savedAt: Date.now(),
  };
  const ok = await idbPut(value);
  if (ok) {
    kit[inst] = { ...value, buffer: null, decodePromise: null };
    setRecStatus(`Saved: ${SOUND_LABELS[`recorded:${inst}`]}`);
    buildGrid();
  } else {
    setRecStatus("Save failed (storage blocked?)");
  }
}

async function clearMyKit() {
  for (const inst of REC_INSTRUMENTS) {
    await idbDelete(inst);
    kit[inst] = null;
  }
  setRecStatus("My Kit cleared");
  buildGrid();
}

function bindRecorderUI() {
  if (!el.micEnable) return;

  el.micEnable.addEventListener("click", async () => {
    await enableMic();
  });
  el.recStart.addEventListener("click", async () => {
    stop();
    await startRecording();
  });
  el.recStop.addEventListener("click", async () => {
    await stopRecording();
  });
  el.recPlay.addEventListener("click", () => {
    stop();
    playTrimPreview();
  });

  const onStart = (v) => syncTrim("start", v);
  const onEnd = (v) => syncTrim("end", v);
  el.trimStart.addEventListener("input", (e) => onStart(e.target.value));
  el.trimStartNum.addEventListener("input", (e) => onStart(e.target.value));
  el.trimEnd.addEventListener("input", (e) => onEnd(e.target.value));
  el.trimEndNum.addEventListener("input", (e) => onEnd(e.target.value));

  el.saveSample.addEventListener("click", async () => {
    await saveTrimToKit();
  });
  el.clearKit.addEventListener("click", async () => {
    stop();
    await clearMyKit();
  });

  updateRecorderUI();
}
