const STEPS = 16;
const STEPS_PER_BEAT = 4;

const tracks = [
  { id: "kick", name: "Kick", colorVar: "--kick" },
  { id: "snare", name: "Snare", colorVar: "--snare" },
  { id: "hat", name: "Hi‑Hat", colorVar: "--hat" },
  { id: "perc", name: "Perc", colorVar: "--perc" },
];

const state = {
  pattern: tracks.map(() => Array.from({ length: STEPS }, () => false)),
  isPlaying: false,
  currentStep: 0,
  nextNoteTime: 0,
  timerId: null,
};

const el = {
  grid: document.getElementById("grid"),
  togglePlay: document.getElementById("togglePlay"),
  clear: document.getElementById("clear"),
  bps: document.getElementById("bps"),
  bpsNumber: document.getElementById("bpsNumber"),
  bpmLabel: document.getElementById("bpmLabel"),
};

let audioCtx = null;
let master = null;

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
}

function noiseBuffer(seconds = 0.25) {
  const sr = audioCtx.sampleRate;
  const length = Math.floor(seconds * sr);
  const buffer = audioCtx.createBuffer(1, length, sr);
  const data = buffer.getChannelData(0);
  for (let i = 0; i < length; i++) data[i] = Math.random() * 2 - 1;
  return buffer;
}

function playKick(time) {
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

function playSnare(time) {
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

function playHat(time) {
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

function playPerc(time) {
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

const player = {
  kick: playKick,
  snare: playSnare,
  hat: playHat,
  perc: playPerc,
};

function scheduleStep(stepIndex, time) {
  for (let t = 0; t < tracks.length; t++) {
    if (!state.pattern[t][stepIndex]) continue;
    player[tracks[t].id]?.(time);
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

  for (let t = 0; t < tracks.length; t++) {
    const track = tracks[t];
    const tr = document.createElement("tr");

    const rowHead = document.createElement("th");
    rowHead.className = "rowHead";
    rowHead.scope = "row";

    const label = document.createElement("div");
    label.className = "trackLabel";
    const tag = document.createElement("span");
    tag.className = "tag";
    tag.style.background = css.getPropertyValue(track.colorVar).trim();
    const name = document.createElement("span");
    name.textContent = track.name;
    label.append(tag, name);
    rowHead.appendChild(label);

    const trackColor = css.getPropertyValue(track.colorVar).trim();

    for (let s = 0; s < STEPS; s++) {
      const td = document.createElement("td");
      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = "cell";
      btn.style.setProperty("--trackColor", trackColor);
      btn.dataset.track = String(t);
      btn.dataset.step = String(s);
      btn.setAttribute("aria-label", `${track.name}, step ${s + 1}`);
      btn.setAttribute("aria-pressed", "false");
      btn.addEventListener("click", () => {
        const next = !state.pattern[t][s];
        state.pattern[t][s] = next;
        btn.classList.toggle("on", next);
        btn.setAttribute("aria-pressed", next ? "true" : "false");
        if (!state.isPlaying) {
          ensureAudio();
          audioCtx.resume?.();
          player[track.id]?.(audioCtx.currentTime + 0.005);
        }
      });

      td.appendChild(btn);
      tr.appendChild(td);
    }

    tr.prepend(rowHead);
    tbody.appendChild(tr);
  }

  el.grid.appendChild(tbody);
}

function clearPattern() {
  for (let t = 0; t < tracks.length; t++) {
    for (let s = 0; s < STEPS; s++) state.pattern[t][s] = false;
  }
  document.querySelectorAll(".cell.on").forEach((c) => {
    c.classList.remove("on");
    c.setAttribute("aria-pressed", "false");
  });
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
}

buildGrid();
bindUI();
