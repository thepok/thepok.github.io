import * as E from "./engine.js?v=6";
import { Renderer } from "./renderer.js?v=6";
import { icon, spoken } from "./icons.js?v=6";
const $ = (s) => document.querySelector(s),
  canvas = $("#map"),
  renderer = new Renderer(canvas),
  types = Object.keys(E.TYPES);
let localSide = 0,
  duel = null,
  directory = null,
  networkModule = null;
let initialSeed = crypto.getRandomValues(new Uint32Array(1))[0],
  game = E.createGame({ seed: initialSeed }),
  running = false,
  paused = false,
  selected = null,
  building = "barracks",
  last = 0,
  acc = 0,
  lastUi = 0,
  ended = false,
  sellConfirm = null,
  sound = false,
  audio,
  toastTimer,
  detailKey = "";
let paletteManifest;
function refreshPalette() {
  if (!paletteManifest || !icons.naturalWidth) return;
  const manifest = paletteManifest;
  const faction = game.factions?.[localSide] || "human";
  for (const [type, t] of Object.entries(E.TYPES)) {
    const b = (manifest.rows || manifest)[faction === "orc" ? 1 : 0][t.icon],
      c = document.createElement("canvas");
    c.width = c.height = 64;
    const ctx = c.getContext("2d"),
      ratio = 60 / Math.max(b.w, b.h);
    ctx.drawImage(
      icons,
      b.x,
      b.y,
      b.w,
      b.h,
      (64 - b.w * ratio) / 2,
      (64 - b.h * ratio) / 2,
      b.w * ratio,
      b.h * ratio,
    );
    $(`[data-build="${type}"] img`).src = c.toDataURL();
  }
}
const icons = new Image();
icons.src = "assets/buildings.webp";
Promise.all([
  new Promise((resolve) => {
    icons.onload = resolve;
    if (icons.complete && icons.naturalWidth) resolve();
  }),
  fetch("assets/building-manifest.json").then((r) => r.json()),
])
  .then(([, manifest]) => {
    paletteManifest = manifest;
    refreshPalette();
  })
  .catch(() => {});
$("#palette").innerHTML = types
  .map(
    (type, i) =>
      `<button class="build-card" data-build="${type}" title="${E.TYPES[type].desc}"><img class="build-icon" alt=""><span><span class="key">${i + 1}</span><strong>${E.TYPES[type].name}</strong><small>${E.TYPES[type].cost} Gold</small></span></button>`,
  )
  .join("");
function beep(freq = 360) {
  if (!sound) return;
  try {
    audio ??= new AudioContext();
    audio.resume();
    const o = audio.createOscillator(),
      g = audio.createGain();
    o.type = "triangle";
    o.frequency.value = freq;
    g.gain.setValueAtTime(0.04, audio.currentTime);
    g.gain.exponentialRampToValueAtTime(0.001, audio.currentTime + 0.15);
    o.connect(g);
    g.connect(audio.destination);
    o.start();
    o.stop(audio.currentTime + 0.16);
  } catch {}
}
function toast(s) {
  $("#toast").textContent = s;
  $("#toast").classList.add("show");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => $("#toast").classList.remove("show"), 2800);
}
function submit(c) {
  const result = duel ? duel.command(c) : E.command(game, localSide, c);
  if (!result.ok) {
    toast(result.error);
    beep(130);
  } else beep(520);
  detailKey = "";
  updateUI();
  renderer.draw(game, selected, building);
  return result;
}
function choose(type) {
  sellConfirm = null;
  building = type;
  selected = null;
  detailKey = "";
  updateUI();
}
$("#palette").addEventListener("click", (e) => {
  const b = e.target.closest("[data-build]");
  if (b) choose(b.dataset.build);
});
function mapTap(e) {
  if (!running || paused || game.winner !== null) return;
  const rect = canvas.getBoundingClientRect(),
    x = e.clientX - rect.left,
    y = e.clientY - rect.top,
    slot = renderer.slotAt(x, y);
  if (renderer.scale < 0.4) {
    const p = renderer.world(x, y);
    renderer.focusWorld(p.x, p.y, true);
    return;
  }
  if (building && slot) {
    const r = submit({ type: "build", slot, building });
    if (r.ok) toast(`${E.TYPES[building].name} errichtet`);
    return;
  }
  if (renderer.castleAt(x, y) === localSide) {
    showResearch();
    return;
  }
  const hit = renderer.buildingAt(x, y);
  if (hit !== undefined) {
    selected = hit;
    building = null;
    sellConfirm = null;
    detailKey = "";
    updateUI();
    return;
  }
  toast(
    building
      ? "Tippe auf einen freien blauen Bauplatz."
      : "Wähle ein Gebäude im Baumenü.",
  );
}
const pointers = new Map();
let gesture = null,
  pinch = null;
canvas.addEventListener("pointerdown", (e) => {
  if (e.button !== 0) return;
  canvas.setPointerCapture(e.pointerId);
  pointers.set(e.pointerId, { x: e.clientX, y: e.clientY });
  if (pointers.size === 1) {
    gesture = {
      x: e.clientX,
      y: e.clientY,
      lastX: e.clientX,
      lastY: e.clientY,
      moved: false,
      pinched: false,
    };
  } else if (pointers.size === 2) {
    gesture.pinched = true;
    const [a, b] = [...pointers.values()];
    pinch = {
      distance: Math.hypot(a.x - b.x, a.y - b.y),
      x: (a.x + b.x) / 2,
      y: (a.y + b.y) / 2,
    };
  }
});
canvas.addEventListener("pointermove", (e) => {
  if (!pointers.has(e.pointerId) || !gesture) return;
  pointers.set(e.pointerId, { x: e.clientX, y: e.clientY });
  if (pointers.size >= 2) {
    const [a, b] = [...pointers.values()],
      distance = Math.hypot(a.x - b.x, a.y - b.y),
      x = (a.x + b.x) / 2,
      y = (a.y + b.y) / 2,
      rect = canvas.getBoundingClientRect();
    if (pinch && pinch.distance > 0) {
      renderer.zoomAt(
        (renderer.zoom * distance) / pinch.distance,
        x - rect.left,
        y - rect.top,
      );
      renderer.pan(x - pinch.x, y - pinch.y);
    }
    pinch = { distance, x, y };
    gesture.pinched = true;
    return;
  }
  if (Math.hypot(e.clientX - gesture.x, e.clientY - gesture.y) > 8)
    gesture.moved = true;
  if (gesture.moved && !gesture.pinched)
    renderer.pan(e.clientX - gesture.lastX, e.clientY - gesture.lastY);
  gesture.lastX = e.clientX;
  gesture.lastY = e.clientY;
});
function endPointer(e) {
  pointers.delete(e.pointerId);
  if (!pointers.size) {
    if (gesture && !gesture.moved && !gesture.pinched && e.type === "pointerup")
      mapTap(e);
    gesture = null;
    pinch = null;
  } else pinch = null;
}
canvas.addEventListener("pointerup", endPointer);
canvas.addEventListener("pointercancel", endPointer);
canvas.addEventListener(
  "wheel",
  (e) => {
    e.preventDefault();
    const r = canvas.getBoundingClientRect();
    renderer.zoomAt(
      renderer.zoom * Math.exp(-e.deltaY * 0.0015),
      e.clientX - r.left,
      e.clientY - r.top,
    );
  },
  { passive: false },
);
$("#zoom-in").onclick = () => renderer.zoomAt(renderer.zoom * 1.3);
$("#zoom-out").onclick = () => renderer.zoomAt(renderer.zoom / 1.3);
$("#overview").onclick = () => renderer.overview();
$("#home-view").onclick = () =>
  renderer.focusWorld(localSide ? E.W - 450 : 450, E.H / 2, true);
$("#minimap").onclick = (e) => {
  const r = e.currentTarget.getBoundingClientRect(),
    u = (e.clientX - r.left) / r.width,
    v = (e.clientY - r.top) / r.height;
  renderer.focusWorld(
    renderer.portrait ? E.W * (1 - v) : E.W * u,
    renderer.portrait ? E.H * u : E.H * v,
    true,
  );
};
$("#minimap").onkeydown = (e) => {
  if (e.key === "Enter" || e.key === " ") {
    e.preventDefault();
    renderer.focusWorld(localSide ? E.W - 450 : 450, E.H / 2, true);
  }
};
$("#detail").addEventListener("click", (e) => {
  if (e.target.closest("[data-upgrade]"))
    submit({ type: "upgrade", id: selected });
  if (e.target.closest("[data-sell]")) {
    const b = game.buildings.find((x) => x.id === selected);
    if (!b) return;
    if (sellConfirm !== selected) {
      sellConfirm = selected;
      detailKey = "";
      updateUI();
      return;
    }
    submit({ type: "sell", id: selected });
    selected = null;
    detailKey = "";
    updateUI();
  }
});
function time(t) {
  return `${String(Math.floor(t / 60)).padStart(2, "0")}:${String(Math.floor(t % 60)).padStart(2, "0")}`;
}
function updateUI() {
  updateResearch();
  const inc = E.income(game, localSide);
  $("#human-label").textContent =
    (game.factions?.[0] === "orc" ? "ORKS" : "MENSCHEN") +
    (localSide === 0 ? " · DU" : "");
  $("#orc-label").textContent =
    (game.factions?.[1] === "human" ? "MENSCHEN" : "ORKS") +
    (localSide === 1 ? " · DU" : "");
  $("#gold").textContent = Math.floor(game.gold[localSide]);
  $("#income").textContent = `+${inc.total.toFixed(1).replace(".", ",")}/s`;
  $("#clock").textContent = time(game.time);
  $("#human-hp").max = game.castles[0].maxHp;
  $("#orc-hp").max = game.castles[1].maxHp;
  $("#human-hp").value = Math.max(0, game.castles[0].hp);
  $("#orc-hp").value = Math.max(0, game.castles[1].hp);
  $("#army").textContent =
    `${game.units.filter((u) => u.side === localSide).length} Truppen`;
  for (const b of document.querySelectorAll("[data-build]")) {
    b.classList.toggle("active", b.dataset.build === building);
    b.style.opacity =
      game.gold[localSide] < E.TYPES[b.dataset.build].cost ? ".55" : "";
    const locked =
      E.buildingUnlocked &&
      !E.buildingUnlocked(game, localSide, b.dataset.build);
    b.classList.toggle("locked", !!locked);
    b.querySelector("small").textContent = locked
      ? "🔒 Forschung"
      : `${E.TYPES[b.dataset.build].cost} Gold`;
  }
  const b = game.buildings.find((b) => b.id === selected);
  if (selected && !b) {
    selected = null;
    detailKey = "";
  }
  const key =
    (b ? `${b.id}-${b.level}` : building || "none") +
    "-" +
    (game.research?.[localSide] || []).join(",");
  if (key !== detailKey) {
    detailKey = key;
    if (b) {
      const t = E.TYPES[b.type],
        cost = E.upgradeCost(b),
        sell = Math.floor((b.paid * 0.6 * b.hp) / b.maxHp);
      $("#detail").innerHTML =
        `<h3>${t.name} · Stufe ${b.level}</h3><p>${describe(b.type, b.level)}</p><progress max="${b.maxHp}" value="${b.hp}"></progress><small data-building-health>${Math.ceil(b.hp)} / ${b.maxHp} LP${b.level < 3 && E.upgradeUnlocked && !E.upgradeUnlocked(game, localSide, b) ? " · Benötigt " + (b.level === 1 ? "Veteranenausbildung" : "Meisterausbildung") : ""}</small><div class="actions"><button data-upgrade ${b.level >= 3 || game.gold[localSide] < cost || (E.upgradeUnlocked && !E.upgradeUnlocked(game, localSide, b)) ? "disabled" : ""}>${b.level >= 3 ? "Max. Stufe" : `Aufwerten<br>${cost} Gold`}</button><button data-sell>${sellConfirm === selected ? "Bestätigen?" : "Verkaufen"}<br><span data-sale-value>+${sell} Gold</span></button></div>`;
    } else if (building) {
      const t = E.TYPES[building];
      $("#detail").innerHTML =
        `<h3>${t.name}</h3><p>${describe(building)}</p><small>${E.buildingUnlocked && !E.buildingUnlocked(game, localSide, building) ? "Erst im Schloss erforschen." : "Wähle einen blauen Bauplatz."}</small>`;
    } else
      $("#detail").innerHTML =
        "<h3>Dein Reich wächst.</h3><p>Wähle ein Gebäude, um es aufzuwerten, oder errichte Verstärkung auf einem freien Bauplatz.</p>";
  }
  if (b) {
    const progress = $("#detail progress");
    progress.max = b.maxHp;
    progress.value = b.hp;
    const health = `${Math.ceil(b.hp)} / ${b.maxHp} LP${b.level < 3 && !E.upgradeUnlocked(game, localSide, b) ? " · Benötigt " + (b.level === 1 ? "Veteranenausbildung" : "Meisterausbildung") : ""}`;
    const healthNode = $("[data-building-health]");
    if (healthNode.textContent !== health) healthNode.textContent = health;
    $("[data-upgrade]").disabled =
      b.level >= 3 ||
      game.gold[localSide] < E.upgradeCost(b) ||
      !E.upgradeUnlocked(game, localSide, b);
    const sale = `+${Math.floor((b.paid * 0.6 * b.hp) / b.maxHp)} Gold`;
    const saleNode = $("[data-sale-value]");
    if (saleNode.textContent !== sale) saleNode.textContent = sale;
  }
  if (game.winner !== null && !ended) {
    ended = true;
    running = false;
    $("#result-title").textContent =
      game.winner === localSide
        ? "Die Grenze hält."
        : game.winner === 2
          ? "Kein Reich bleibt."
          : "Die Krone ist gefallen.";
    $("#result-text").textContent =
      game.winner === localSide
        ? "Das gegnerische Schloss liegt in Trümmern. Dein Reich ist gerettet."
        : game.winner === 2
          ? "Beide Schlösser sind gefallen. Die nächste Chronik wartet."
          : "Dein Schloss ist gefallen. Eine neue Strategie kann alles ändern.";
    $("#stats").innerHTML =
      `<div><strong>${time(game.time)}</strong>Schlachtdauer</div><div><strong>${game.stats.kills[localSide]}</strong>Besiegte Gegner</div><div><strong>${game.stats.spawned[localSide]}</strong>Ausgebildete Truppen</div><div><strong>${Math.floor(game.stats.earned[localSide])}</strong>Verdientes Gold</div>`;
    $("#result").showModal();
    beep(game.winner === localSide ? 660 : 170);
  }
}
function setPause(value, fromNetwork = false) {
  if (duel && !fromNetwork) {
    duel.setPaused(value);
    return;
  }
  paused = value;
  acc = 0;
  $("#paused").hidden = !paused;
  $("#pause").textContent = paused ? "▶" : "Ⅱ";
  $("#pause").setAttribute(
    "aria-label",
    paused ? "Spiel fortsetzen" : "Spiel pausieren",
  );
}
$("#pause").onclick = () => {
  if (running) setPause(!paused);
};
$("#sound").onclick = () => {
  sound = !sound;
  $("#sound").classList.toggle("active", sound);
  $("#sound").setAttribute(
    "aria-label",
    sound ? "Ton ausschalten" : "Ton einschalten",
  );
  beep();
};
let priorPause = false;
$("#help").onclick = () => {
  priorPause = paused;
  if (!duel) setPause(true);
  $("#help-dialog").showModal();
};
$("#help-close").onclick = () => $("#help-dialog").close();
$("#help-dialog").addEventListener("close", () => {
  if (!duel) setPause(priorPause);
});
document.addEventListener("visibilitychange", () => {
  if (document.hidden && running) setPause(true);
});
for (const [id, out] of [
  ["handicap", "player-factor"],
  ["enemy-handicap", "enemy-factor"],
])
  $(`#${id}`).oninput = () => {
    $(`#${out}`).textContent = $(`#${id}`).value + " %";
  };
$("#setup-form").onsubmit = (e) => {
  e.preventDefault();
  localSide = 0;
  renderer.localSide = 0;
  initialSeed = crypto.getRandomValues(new Uint32Array(1))[0];
  game = E.createGame({
    handicap: +$("#handicap").value,
    enemyHandicap: +$("#enemy-handicap").value,
    difficulty: $("#difficulty").value,
    seed: initialSeed,
    factions: [$("#faction").value, $("#enemy-faction").value],
  });
  refreshPalette();
  renderer.focusWorld(localSide ? E.W - 450 : 450, E.H / 2, true);
  running = true;
  ended = false;
  selected = null;
  building = "barracks";
  detailKey = "";
  setPause(false);
  $("#setup").close();
  $("#seed-label").textContent = "Schlachtkennung: " + initialSeed;
  updateUI();
  toast("Wähle ein Gebäude und tippe auf einen blauen Bauplatz.");
};
$("#setup").addEventListener("cancel", (e) => e.preventDefault());
$("#restart").onclick = () => {
  $("#result").close();
  if (duel) leaveMultiplayer();
  else $("#setup").showModal();
};
document.addEventListener("keydown", (e) => {
  if (
    e.target.matches("input,select") ||
    document.querySelector("dialog[open]")
  )
    return;
  if (e.code === "Space") {
    e.preventDefault();
    if (running) setPause(!paused);
  }
  if (types[+e.key - 1]) choose(types[+e.key - 1]);
  if (e.key === "Escape") {
    selected = null;
    building = null;
    detailKey = "";
    updateUI();
  }
});
let menuWasOpen = false;
function frame(now) {
  const dt = Math.min(0.2, (now - last) / 1000 || 0);
  last = now;
  if (running && !paused && !duel) {
    acc += dt;
    while (acc >= E.STEP) {
      E.step(game);
      acc -= E.STEP;
    }
  }
  const menuOpen = !!document.querySelector("dialog[open]");
  // Keep simulation and income live, but do not repaint an obscured battlefield.
  if (!menuOpen || !menuWasOpen) renderer.draw(game, selected, building);
  menuWasOpen = menuOpen;
  if (now - lastUi > 120) {
    updateUI();
    lastUi = now;
  }
  requestAnimationFrame(frame);
}
queueMicrotask(() => {
  updateUI();
  $("#setup").showModal();
  requestAnimationFrame(frame);
});
if (new URLSearchParams(location.search).has("test")) {
  Object.defineProperty(window, "__view", { get: () => renderer });
  Object.defineProperty(window, "__game", { get: () => game });
  window.__advance = (seconds) => {
    for (let n = 0; n < seconds / E.STEP; n++) E.step(game);
    updateUI();
  };
  window.__command = (c) => submit(c);
}
function describe(type, level = 1) {
  const t = E.buildingStats ? E.buildingStats(game, type) : E.TYPES[type];
  if (t.unit) {
    const u = E.unitStats ? E.unitStats(game, t.unit) : E.UNIT[t.unit];
    const mult = 1 + 0.28 * (level - 1),
      done = game.research?.[localSide] || [];
    return `${Math.round(t.hp * (1 + 0.4 * (level - 1)))} Gebäude-LP · eine Einheit alle ${(t.spawn / (1 + 0.18 * (level - 1)) / (done.includes("logistics") ? 1.2 : 1)).toFixed(1)} s. Einheit: ${Math.round(u.hp * mult * (done.includes("armor") ? 1.2 : 1))} LP · ${(u.damage * mult * (done.includes("weapons") ? 1.2 : 1)).toFixed(1)} Schaden · ${u.speed.toFixed(1)} Tempo.${type === "workshop" ? " Dreifacher Gebäudeschaden." : ""}`;
  }
  return `${Math.round(t.hp * (1 + 0.4 * (level - 1)))} Gebäude-LP. ${type === "bank" ? `0,3 % Zinsen pro Sekunde. Obergrenze: ${2 * level * (game.research?.[localSide].includes("banking") ? 1.5 : 1)} Gold/s.` : t.desc}`;
}
function showResearch() {
  if (!E.RESEARCH) return;
  $("#research-dialog").showModal();
  researchKey = "";
  updateResearch();
}
let researchKey = "";
function updateResearch() {
  if (!E.RESEARCH) return;
  const active = game.researching?.[localSide];
  const label = active
    ? `FORSCHUNG · ${E.RESEARCH[active.id].name} · ${Math.ceil(active.remaining)} s`
    : "FORSCHUNG";
  const labelNode = researchButton.querySelector("span");
  if (labelNode.textContent !== label) labelNode.textContent = label;
  if (!$("#research-dialog").open) return;
  const goldText = String(Math.floor(game.gold[localSide]));
  const incomeText = `+${E.income(game, localSide).total.toFixed(1).replace(".", ",")}/s`;
  if ($("#research-gold").textContent !== goldText)
    $("#research-gold").textContent = goldText;
  if ($("#research-income").textContent !== incomeText)
    $("#research-income").textContent = incomeText;
  const key = JSON.stringify([
    game.research,
    active && [active.id, Math.ceil(active.remaining)],
    Object.keys(E.RESEARCH).map((id) => {
      const s = E.researchStatus(game, localSide, id);
      return [s.state, s.reason, s.canStart, Math.ceil(s.remaining)];
    }),
  ]);
  if (key === researchKey) return;
  researchKey = key;
  const markup = Object.entries(E.RESEARCH)
    .map(([id, r]) => {
      const status = E.researchStatus(game, localSide, id);
      const badge =
        status.state === "done"
          ? "check"
          : status.state === "active"
            ? "clock"
            : status.state === "locked"
              ? "lock"
              : null;
      const needs = r.requires
        .map(
          (k) =>
            `<span class="needs-icon ${game.research[localSide].includes(k) ? "met" : ""}" title="${E.RESEARCH[k].name}">${icon(k, "mini-icon")}${game.research[localSide].includes(k) ? icon("check", "tiny-check") : ""}</span>`,
        )
        .join('<span aria-hidden="true">+</span>');
      return `<article class="research-card ${status.state}"><button class="research-node ${status.state}" data-research="${id}" aria-label="${r.name}: ${r.desc} ${status.reason || r.cost + " Gold, " + r.duration + " Sekunden"}" ${status.canStart ? "" : "disabled"}><span class="research-picture">${icon(id)}${badge ? icon(badge, "research-badge") : ""}</span><span class="research-name">${r.name}</span><span class="research-description">${r.desc}</span>${needs ? `<span class="research-needs" aria-label="Benötigt: ${r.requires.map((k) => E.RESEARCH[k].name).join(", ")}">${needs}<span aria-hidden="true">→</span>${icon(id, "mini-icon")}</span>` : ""}<span class="research-price">${status.state === "done" ? icon("check", "mini-icon") : status.state === "active" ? `${icon("clock", "mini-icon")} ${Math.ceil(status.remaining)}` : `${icon("coin", "mini-icon")} ${r.cost} <span>·</span> ${icon("clock", "mini-icon")} ${r.duration}`}</span><span class="research-reason">${status.reason || "Bereit zum Forschen"}</span></button><button class="speak-research" data-speak="${id}" aria-label="${r.name} vorlesen" title="Vorlesen">${icon("speaker", "speaker-icon")}</button></article>`;
    })
    .join("");
  const tree = $("#research-tree");
  if (!tree.children.length) tree.innerHTML = markup;
  else {
    const template = document.createElement("template");
    template.innerHTML = markup;
    for (const fresh of template.content.children) {
      const next = fresh.querySelector("[data-research]");
      const current = tree.querySelector(
        `[data-research="${next.dataset.research}"]`,
      );
      current.className = next.className;
      current.parentElement.className = fresh.className;
      current.disabled = next.disabled;
      current.setAttribute("aria-label", next.getAttribute("aria-label"));
      for (const selector of [
        ".research-picture",
        ".research-needs",
        ".research-price",
        ".research-reason",
      ]) {
        const target = current.querySelector(selector),
          source = next.querySelector(selector);
        if (target && source && target.innerHTML !== source.innerHTML)
          target.innerHTML = source.innerHTML;
      }
    }
  }
}
const researchButton = document.createElement("button");
researchButton.id = "research-button";
researchButton.type = "button";
researchButton.setAttribute("aria-label", "Forschung öffnen");
researchButton.innerHTML = `${icon("research", "research-entry-icon")}<span>FORSCHUNG</span>`;
researchButton.onclick = showResearch;
$(".command").insertBefore(researchButton, $("#palette"));
const researchDialog = document.createElement("dialog");
researchDialog.id = "research-dialog";
researchDialog.innerHTML = `<div class="research-wallet">${icon("coin", "inline-icon")} <strong id="research-gold">0</strong> <span>Gold</span><span id="research-income"></span></div><span class="eyebrow">DAS WISSEN DEINES REICHES</span><h2>Schloss & Forschung</h2><p>Bild antippen zum Forschen. ${icon("speaker", "inline-icon")} erklärt dir die Wirkung. Eine Forschung zur Zeit.</p><div id="research-tree"></div><button class="primary" id="research-close">${icon("back", "inline-icon")} ZURÜCK ZUR SCHLACHT</button>`;
document.body.append(researchDialog);
$("#research-close").onclick = () => researchDialog.close();
researchDialog.addEventListener("click", (e) => {
  const speak = e.target.closest("[data-speak]");
  if (speak) {
    if (!("speechSynthesis" in window)) {
      toast("Dein Browser kann leider nicht vorlesen.");
      return;
    }
    const id = speak.dataset.speak,
      r = E.RESEARCH[id],
      status = E.researchStatus(game, localSide, id);
    const needs = r.requires.filter(
      (k) => !game.research[localSide].includes(k),
    );
    const text = `${r.name}. ${spoken[id]} ${status.state === "done" ? "Das hast du schon erforscht." : status.state === "active" ? "Das wird gerade erforscht." : `Das kostet ${r.cost} Gold und dauert ${r.duration} Sekunden.`} ${needs.length ? "Erforsche zuerst: " + needs.map((k) => E.RESEARCH[k].name).join(" und ") + "." : ""}`;
    speechSynthesis.cancel();
    const line = new SpeechSynthesisUtterance(text);
    line.lang = "de-DE";
    line.rate = 0.9;
    const voice = speechSynthesis
      .getVoices()
      .find((v) => v.lang.startsWith("de"));
    if (voice) line.voice = voice;
    speechSynthesis.speak(line);
    return;
  }
  const b = e.target.closest("[data-research]");
  if (b) {
    const result = submit({ type: "research", research: b.dataset.research });
    researchKey = "";
    updateResearch();
    if (result.ok) researchDialog.close();
  }
});
let invitation = null,
  enteredDuel = false,
  wasListed = false;
const multiplayerName = (f) => (f === "orc" ? "Orks" : "Menschen");
function duelChanged() {
  if (!duel) return;
  const text = duel.status;
  if ($("#lobby-status").textContent !== text)
    $("#lobby-status").textContent = text;
  $("#network-status").textContent =
    (duel.side === 0 ? "Blau · " : "Rot · ") + text;
  if (duel.state) {
    game = duel.state;
    setPause(duel.paused || !duel.connected, true);
    if (duel.started && !enteredDuel) {
      enteredDuel = true;
      running = true;
      ended = false;
      selected = null;
      building = "barracks";
      detailKey = "";
      researchKey = "";
      refreshPalette();
      renderer.focusWorld(localSide ? E.W - 450 : 450, E.H / 2, true);
      $("#lobby-dialog").close();
      $("#setup").close();
      toast(
        `Du führst ${multiplayerName(game.factions[localSide])} · Team ${localSide ? "Rot" : "Blau"}.`,
      );
      $("#seed-label").textContent =
        "Multiplayer · gleiche Zufallswerte für beide Seiten";
    }
    if (duel.started && wasListed) {
      wasListed = false;
      void directory?.withdraw();
    }
  }
}
function displayRooms() {
  if (!directory) return;
  if (!duel) $("#lobby-status").textContent = directory.status;
  const list = $("#room-list");
  // Stable entries prevent incoming announcements from stealing a click.
  const entries = directory
    .listings()
    .filter((x) => x.humans === 1 && x.host !== networkModule.selfId);
  for (const old of list.querySelectorAll("[data-room]"))
    if (!entries.some((e) => e.room === old.dataset.room)) old.remove();
  list.querySelector("p")?.remove();
  for (const item of entries) {
    let button = [...list.querySelectorAll("[data-room]")].find(
      (b) => b.dataset.room === item.room,
    );
    if (!button) {
      button = document.createElement("button");
      button.dataset.room = item.room;
      list.append(button);
    }
    const label = `${item.locked ? "🔒" : "⚔"} ${item.title} · ${item.phase}`;
    if (button.textContent !== label) button.textContent = label;
    button.onclick = () => selectInvitation(item);
  }
  if (!entries.length) {
    const p = document.createElement("p");
    p.textContent =
      "Noch keine offene Partie gefunden. Erstelle eine und teile den Link.";
    list.append(p);
  }
}
async function openMultiplayer() {
  $("#setup").close();
  $("#multiplayer-faction").value = $("#faction").value;
  $("#duel-handicap").textContent =
    `Einkommen: Gastgeber ${$("#handicap").value} %, Gast ${$("#enemy-handicap").value} %. Einstellbar auf dem Startbildschirm.`;
  if (!$("#lobby-dialog").open) $("#lobby-dialog").showModal();
  try {
    networkModule ||= await import("./network.js?v=6");
    directory ||= new networkModule.Directory(
      networkModule.selfId,
      displayRooms,
    );
    displayRooms();
  } catch {
    $("#lobby-status").textContent =
      "Verbindungstechnik konnte nicht geladen werden. Bitte erneut laden.";
  }
}
function selectInvitation(item) {
  invitation = item;
  $("#join-invitation").hidden = false;
  $("#join-description").textContent =
    `${item.title || "Eingeladene Partie"}${item.locked ? " · Passwort benötigt" : ""}. Wähle dein Volk und tritt bei.`;
  $("#join-password").value = "";
  $("#join-invitation").scrollIntoView({ block: "nearest" });
}
async function startDuel(item = null) {
  if (!networkModule || duel) return;
  const room = item?.room || crypto.randomUUID().replaceAll("-", "");
  const password = item ? $("#join-password").value : $("#room-password").value;
  const faction = $("#multiplayer-faction").value;
  enteredDuel = false;
  localSide = item ? 1 : 0;
  renderer.localSide = localSide;
  const options = {
    seed: crypto.getRandomValues(new Uint32Array(1))[0],
    handicap: +$("#handicap").value,
    enemyHandicap: +$("#enemy-handicap").value,
    factions: [faction, "orc"],
    faction,
  };
  duel = new networkModule.Duel({
    room,
    host: item?.host,
    password,
    options,
    changed: duelChanged,
    result: (r) => {
      if (!r?.ok) toast(r?.error || "Aktion abgelehnt.");
    },
    forceRelay: new URLSearchParams(location.search).has("relayOnly"),
  });
  const hash = new URLSearchParams({
    room,
    host: duel.host,
    locked: String(!!password),
  });
  history.replaceState(null, "", "#" + hash);
  $("#invite-link").value = location.origin + location.pathname + "#" + hash;
  $("#room-info").textContent =
    `Du: ${multiplayerName(faction)} · Team ${localSide ? "Rot" : "Blau"}. Die Schlacht beginnt, sobald beide verbunden sind.`;
  $("#lobby-options").hidden = true;
  $("#room-active").hidden = false;
  $("#network-status").hidden = false;
  if (!item && $("#room-listed").checked) {
    wasListed = true;
    directory.advertise(() => ({
      room,
      host: duel.host,
      title: $("#room-title").value.trim().slice(0, 40) || "Grenzwacht",
      locked: !!password,
      humans: duel.peer ? 2 : 1,
      bots: 0,
      phase: multiplayerName(faction) + " wartet",
    }));
  }
  duelChanged();
}
async function leaveMultiplayer() {
  const old = duel;
  duel = null;
  enteredDuel = false;
  wasListed = false;
  running = false;
  void old?.close();
  void directory?.withdraw();
  localSide = 0;
  renderer.localSide = 0;
  setPause(false, true);
  $("#network-status").hidden = true;
  $("#room-active").hidden = true;
  $("#lobby-options").hidden = false;
  $("#lobby-dialog").close();
  $("#result").close();
  $("#research-dialog").close();
  history.replaceState(null, "", location.pathname + location.search);
  $("#setup").showModal();
}
$("#multiplayer").onclick = openMultiplayer;
$("#network-status").onclick = () => {
  if (!$("#lobby-dialog").open) $("#lobby-dialog").showModal();
};
$("#host-form").onsubmit = (e) => {
  e.preventDefault();
  void startDuel();
};
$("#join-duel").onclick = () => {
  if (invitation) void startDuel(invitation);
};
$("#leave-duel").onclick = leaveMultiplayer;
$("#lobby-close").onclick = () => {
  if (duel && !enteredDuel) void leaveMultiplayer();
  else {
    $("#lobby-dialog").close();
    if (!duel) $("#setup").showModal();
  }
};
$("#lobby-dialog").addEventListener("cancel", (e) => {
  e.preventDefault();
  $("#lobby-close").click();
});
$("#copy-invite").onclick = async () => {
  try {
    await navigator.clipboard.writeText($("#invite-link").value);
    $("#copy-invite").textContent = "KOPIERT";
  } catch {
    $("#invite-link").select();
    $("#copy-invite").textContent = "LINK MARKIERT · KOPIEREN";
  }
};
window.addEventListener("pagehide", () => {
  void duel?.close();
  void directory?.close();
});
if (new URLSearchParams(location.search).has("test"))
  Object.defineProperty(window, "__duel", { get: () => duel });
queueMicrotask(async () => {
  const hash = new URLSearchParams(location.hash.slice(1)),
    room = hash.get("room"),
    host = hash.get("host");
  if (
    room &&
    /^[a-f0-9]{32}$/.test(room) &&
    host &&
    /^[a-zA-Z0-9_-]{10,64}$/.test(host)
  ) {
    await openMultiplayer();
    selectInvitation({ room, host, locked: hash.get("locked") === "true" });
  }
});
