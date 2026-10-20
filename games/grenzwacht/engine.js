// Fixed-step, serializable simulation. UI and transport submit commands; neither owns game rules.
export const STEP = 0.05;
export const W = 1080,
  H = 720,
  LANES = [170, 360, 550];
export const TYPES = {
  barracks: {
    name: "Kaserne",
    cost: 120,
    hp: 600,
    spawn: 10,
    unit: "soldier",
    icon: 1,
    desc: "Ein Schwertkämpfer alle 10 s. Hält die Front.",
  },
  range: {
    name: "Schießstand",
    cost: 160,
    hp: 450,
    spawn: 13,
    unit: "archer",
    icon: 2,
    desc: "Ein Bogenschütze alle 13 s. Stark hinter Nahkämpfern.",
  },
  workshop: {
    name: "Werkstatt",
    cost: 260,
    hp: 550,
    spawn: 24,
    unit: "siege",
    icon: 3,
    desc: "Ein Katapult alle 24 s. Dreifacher Gebäudeschaden.",
  },
  tower: {
    name: "Pfeilturm",
    cost: 180,
    hp: 850,
    icon: 4,
    desc: "Schützt seinen Weg. Reichweite 175, feuert alle 1,3 s.",
  },
  bank: {
    name: "Bank",
    cost: 200,
    hp: 400,
    icon: 5,
    desc: "0,3 % Zinsen pro Sekunde auf dein Gold. Max. 2 Gold/s je Stufe.",
  },
};
export const UNIT = {
  soldier: { hp: 110, damage: 18, speed: 32, range: 27, cooldown: 1, icon: 0 },
  archer: { hp: 65, damage: 13, speed: 30, range: 135, cooldown: 1.3, icon: 1 },
  siege: { hp: 150, damage: 32, speed: 21, range: 185, cooldown: 3, icon: 2 },
};
export const CASTLE = { hp: 6000, range: 260, damage: 32, cooldown: 1.4 };
export const RESEARCH = {
  archery: {
    name: "Bogenschießen",
    cost: 120,
    duration: 18,
    requires: [],
    desc: "Schaltet den Schießstand frei.",
  },
  masonry: {
    name: "Steinbau",
    cost: 100,
    duration: 15,
    requires: [],
    desc: "Schaltet Pfeiltürme frei.",
  },
  weapons: {
    name: "Geschmiedete Waffen",
    cost: 140,
    duration: 20,
    requires: [],
    desc: "Alle bestehenden und neuen Einheiten verursachen 20 % mehr Schaden.",
  },
  armor: {
    name: "Verstärkte Rüstung",
    cost: 140,
    duration: 20,
    requires: [],
    desc: "Alle bestehenden und neuen Einheiten erhalten 20 % mehr Lebenspunkte.",
  },
  engineering: {
    name: "Belagerungstechnik",
    cost: 220,
    duration: 30,
    requires: ["archery", "masonry"],
    desc: "Schaltet Werkstätten und Katapulte frei.",
  },
  veteran: {
    name: "Veteranenausbildung",
    cost: 180,
    duration: 25,
    requires: ["weapons"],
    desc: "Gebäude können auf Stufe 2 ausgebaut werden.",
  },
  mastery: {
    name: "Meisterausbildung",
    cost: 280,
    duration: 35,
    requires: ["veteran", "engineering"],
    desc: "Gebäude können auf Stufe 3 ausgebaut werden.",
  },
  logistics: {
    name: "Logistik",
    cost: 200,
    duration: 25,
    requires: ["veteran"],
    desc: "Alle Produktionsgebäude erzeugen 20 % mehr Einheiten pro Zeit.",
  },
  banking: {
    name: "Bankwesen",
    cost: 160,
    duration: 25,
    requires: [],
    desc: "Erhöht die Zinsobergrenze jeder Bank um 50 %.",
  },
};
const BUILD_RESEARCH = {
  range: "archery",
  tower: "masonry",
  workshop: "engineering",
};
export const unitStats = (s, kind) => s.rules.units[kind];
export const buildingStats = (s, type) => s.rules.buildings[type];
export const buildingUnlocked = (s, side, type) =>
  Object.hasOwn(TYPES, type) &&
  (!BUILD_RESEARCH[type] || s.research[side].includes(BUILD_RESEARCH[type]));
export const upgradeUnlocked = (s, side, b) =>
  b.level < 3 &&
  s.research[side].includes(b.level === 1 ? "veteran" : "mastery");
export function researchStatus(s, side, id) {
  const r = Object.hasOwn(RESEARCH, id) ? RESEARCH[id] : null;
  if (!r)
    return {
      state: "locked",
      reason: "Unbekannte Forschung.",
      canStart: false,
      remaining: 0,
    };
  if (s.research[side].includes(id))
    return {
      state: "done",
      reason: "Erforscht.",
      canStart: false,
      remaining: 0,
    };
  if (s.researching[side]?.id === id)
    return {
      state: "active",
      reason: "Wird erforscht.",
      canStart: false,
      remaining: s.researching[side].remaining,
    };
  const missing = r.requires.filter((x) => !s.research[side].includes(x));
  if (missing.length)
    return {
      state: "locked",
      reason:
        "Benötigt " + missing.map((x) => RESEARCH[x].name).join(" und ") + ".",
      canStart: false,
      remaining: 0,
    };
  const reason = s.researching[side]
    ? "Eine Forschung läuft bereits."
    : s.gold[side] < r.cost
      ? "Nicht genug Gold."
      : "";
  return {
    state: "available",
    reason,
    canStart: !reason && s.winner === null,
    remaining: 0,
  };
}
export function slots(side) {
  return LANES.flatMap((y, lane) =>
    [0, 1, 2, 3].map((col) => ({
      id: `${side}-${lane}-${col}`,
      side,
      lane,
      col,
      x: side === 0 ? 155 + col * 86 : 925 - col * 86,
      y: y + 52,
    })),
  );
}
export const SLOTS = [...slots(0), ...slots(1)];
export function createGame({
  handicap = 100,
  enemyHandicap = 100,
  difficulty = "normal",
  seed = 42,
} = {}) {
  const state = {
    version: 1,
    tick: 0,
    time: 0,
    nextId: 1,
    seed: seed >>> 0,
    handicap: [
      Math.max(50, Math.min(150, Number(handicap) || 100)) / 100,
      Math.max(50, Math.min(150, Number(enemyHandicap) || 100)) / 100,
    ],
    difficulty,
    gold: [420, 420],
    castles: [
      {
        id: "castle0",
        side: 0,
        x: 52,
        y: 360,
        hp: CASTLE.hp,
        maxHp: CASTLE.hp,
        cooldown: 0,
      },
      {
        id: "castle1",
        side: 1,
        x: 1028,
        y: 360,
        hp: CASTLE.hp,
        maxHp: CASTLE.hp,
        cooldown: 0,
      },
    ],
    buildings: [],
    units: [],
    shots: [],
    effects: [],
    research: [[], []],
    researching: [null, null],
    rules: { units: {}, buildings: {} },
    winner: null,
    aiNext: 2,
    stats: { spawned: [0, 0], kills: [0, 0], earned: [0, 0], built: [0, 0] },
    log: [],
  };
  // One roll per type and stat, shared by both factions for the entire match.
  const roll = (n) => Math.round(n * (0.85 + rand(state) * 0.3) * 100) / 100;
  for (const [kind, stats] of Object.entries(UNIT))
    state.rules.units[kind] = {
      ...stats,
      hp: roll(stats.hp),
      damage: roll(stats.damage),
      speed: roll(stats.speed),
    };
  for (const [type, stats] of Object.entries(TYPES))
    state.rules.buildings[type] = {
      ...stats,
      hp: roll(stats.hp),
      ...(stats.spawn ? { spawn: roll(stats.spawn) } : {}),
    };
  // Equal opening armies; construction choices are immediately available.
  for (let side = 0; side < 2; side++)
    for (let lane = 0; lane < 3; lane++) {
      const slot = SLOTS.find(
        (s) => s.side === side && s.lane === lane && s.col === 0,
      );
      addBuilding(state, side, "barracks", slot);
    }
  return state;
}
function rand(s) {
  s.seed = (Math.imul(s.seed, 1664525) + 1013904223) >>> 0;
  return s.seed / 4294967296;
}
function addBuilding(s, side, type, slot) {
  const t = buildingStats(s, type);
  s.buildings.push({
    id: s.nextId++,
    side,
    type,
    slot: slot.id,
    lane: slot.lane,
    x: slot.x,
    y: slot.y,
    hp: t.hp,
    maxHp: t.hp,
    level: 1,
    paid: t.cost,
    spawnLeft: t.spawn ? 2 + slot.lane * 1.5 : 0,
    cooldown: 0,
  });
  s.stats.built[side]++;
}
export function upgradeCost(b) {
  return Math.round(TYPES[b.type].cost * (0.7 + b.level * 0.2));
}
export function income(s, side) {
  let bank = 0;
  for (const b of s.buildings)
    if (b.side === side && b.type === "bank")
      bank += Math.min(
        s.gold[side] * 0.003,
        2 * b.level * (s.research[side].includes("banking") ? 1.5 : 1),
      );
  return {
    base: 6 * s.handicap[side],
    bank,
    total: 6 * s.handicap[side] + bank,
  };
}
export function command(s, side, c) {
  if (s.winner !== null)
    return { ok: false, error: "Die Schlacht ist beendet." };
  if (side !== 0 && side !== 1) return { ok: false, error: "Ungültige Seite." };
  if (!c || typeof c !== "object")
    return { ok: false, error: "Ungültiger Befehl." };
  if (c.type === "research") {
    const status = researchStatus(s, side, c.research);
    if (!status.canStart) return { ok: false, error: status.reason };
    const r = RESEARCH[c.research];
    s.gold[side] -= r.cost;
    s.researching[side] = { id: c.research, remaining: r.duration };
    return { ok: true };
  }
  if (c.type === "build") {
    const slot = SLOTS.find((x) => x.id === c.slot),
      t = Object.hasOwn(TYPES, c.building) ? TYPES[c.building] : null;
    if (!slot || slot.side !== side || !t)
      return {
        ok: false,
        error: "Baue auf einem freien Platz in deinem Gebiet.",
      };
    if (!buildingUnlocked(s, side, c.building))
      return {
        ok: false,
        error: "Benötigt " + RESEARCH[BUILD_RESEARCH[c.building]].name + ".",
      };
    if (s.buildings.some((b) => b.slot === slot.id))
      return { ok: false, error: "Dieser Bauplatz ist belegt." };
    if (s.gold[side] < t.cost) return { ok: false, error: "Nicht genug Gold." };
    s.gold[side] -= t.cost;
    addBuilding(s, side, c.building, slot);
    return { ok: true };
  }
  const b = s.buildings.find((b) => b.id === c.id && b.side === side);
  if (!b) return { ok: false, error: "Wähle ein eigenes Gebäude." };
  if (c.type === "upgrade") {
    if (b.level >= 3) return { ok: false, error: "Maximale Stufe erreicht." };
    if (!upgradeUnlocked(s, side, b))
      return {
        ok: false,
        error:
          "Benötigt " +
          RESEARCH[b.level === 1 ? "veteran" : "mastery"].name +
          ".",
      };
    const cost = upgradeCost(b);
    if (s.gold[side] < cost) return { ok: false, error: "Nicht genug Gold." };
    const base = buildingStats(s, b.type).hp;
    s.gold[side] -= cost;
    b.paid += cost;
    b.level++;
    b.maxHp = Math.round(base * (1 + 0.4 * (b.level - 1)));
    b.hp = Math.min(b.maxHp, b.hp + base * 0.4);
    return { ok: true };
  }
  if (c.type === "sell") {
    s.gold[side] += Math.floor((b.paid * 0.6 * b.hp) / b.maxHp);
    s.buildings = s.buildings.filter((x) => x !== b);
    return { ok: true };
  }
  return { ok: false, error: "Unbekannter Befehl." };
}
function effect(s, x, y, type, side = 0) {
  s.effects.push({ x, y, type, side, age: 0 });
}
function damage(s, target, n, side) {
  if (target.hp <= 0) return;
  target.hp -= n;
  effect(s, target.x, target.y, "hit", side);
  if (target.hp <= 0) {
    effect(s, target.x, target.y, target.type ? "ruin" : "burst", side);
    if (typeof target.id === "number" && !target.slot) {
      s.stats.kills[side]++;
      s.gold[side] += target.kind === "siege" ? 8 : 3;
    }
  }
}
function fire(s, from, target, amount, kind) {
  s.shots.push({
    id: s.nextId++,
    side: from.side,
    x: from.x,
    y: from.y - 12,
    originX: from.x,
    originY: from.y - 12,
    target: target.id,
    damage: amount,
    kind,
    life: 0,
  });
}
function findTarget(s, u) {
  const enemies = s.units.filter(
    (e) => e.side !== u.side && e.lane === u.lane && e.hp > 0,
  );
  let target = null,
    best = Infinity;
  for (const e of enemies) {
    const d = Math.hypot(e.x - u.x, e.y - u.y);
    if (d < best) {
      best = d;
      target = e;
    }
  }
  // Defenders take priority nearby; otherwise attack the closest enemy structure in this lane.
  if (best < 240) return target;
  for (const b of s.buildings) {
    if (b.side === u.side || b.lane !== u.lane || b.hp <= 0) continue;
    const d = Math.hypot(b.x - u.x, b.y - u.y);
    if (d < best) {
      best = d;
      target = b;
    }
  }
  const castle = s.castles[1 - u.side],
    d = Math.abs(castle.x - u.x) + 25;
  if (d < best) target = castle;
  return target || castle;
}
function ai(s) {
  if (s.time < s.aiNext) return;
  const cadence = { easy: 12, normal: 7, hard: 4 }[s.difficulty] || 7;
  s.aiNext = s.time + cadence + rand(s) * 2;
  const researchPlan = [
    ["archery", 0],
    ["masonry", 25],
    ["weapons", 55],
    ["armor", 90],
    ["engineering", 120],
    ["veteran", 160],
    ["banking", 200],
    ["logistics", 240],
    ["mastery", 300],
  ];
  for (const [id, time] of researchPlan)
    if (s.time >= time && researchStatus(s, 1, id).canStart) {
      command(s, 1, { type: "research", research: id });
      return;
    }
  const own = s.buildings.filter((b) => b.side === 1),
    free = slots(1).filter((x) => !own.some((b) => b.slot === x.id));
  const threat = LANES.map(
    (_, lane) =>
      s.units.filter((u) => u.side === 0 && u.lane === lane && u.x > 540)
        .length *
        2 +
      s.buildings.filter(
        (b) => b.side === 0 && b.lane === lane && TYPES[b.type].unit,
      ).length,
  );
  let lane = threat.indexOf(Math.max(...threat));
  if (rand(s) < 0.45) lane = Math.floor(rand(s) * 3);
  let type;
  if (
    buildingUnlocked(s, 1, "range") &&
    !own.some((b) => b.type === "range" && b.lane === lane)
  )
    type = "range";
  else if (
    buildingUnlocked(s, 1, "tower") &&
    threat[lane] > 5 &&
    !own.some((b) => b.type === "tower" && b.lane === lane)
  )
    type = "tower";
  else if (
    buildingUnlocked(s, 1, "workshop") &&
    !own.some((b) => b.type === "workshop" && b.lane === lane)
  )
    type = "workshop";
  else if (
    s.time > 40 &&
    own.filter((b) => b.type === "bank").length < 2 &&
    rand(s) < 0.3
  )
    type = "bank";
  else
    type =
      rand(s) < 0.55 || !buildingUnlocked(s, 1, "range") ? "barracks" : "range";
  const choices = free.filter((x) => x.lane === lane);
  const slot = (type === "tower" ? choices.at(-1) : choices[0]) || free[0];
  if (slot && s.gold[1] >= TYPES[type].cost) {
    command(s, 1, { type: "build", building: type, slot: slot.id });
    return;
  }
  const up = own
    .filter((b) => upgradeUnlocked(s, 1, b) && b.type !== "bank")
    .sort((a, b) => a.level - b.level);
  if (up.length && (!slot || s.gold[1] > 400))
    command(s, 1, {
      type: "upgrade",
      id: up[Math.floor(rand(s) * Math.min(3, up.length))].id,
    });
}
export function step(s, { aiEnabled = true } = {}) {
  if (s.winner !== null) return;
  s.tick++;
  s.time = s.tick * STEP;
  for (let side = 0; side < 2; side++) {
    const n = income(s, side).total * STEP;
    s.gold[side] += n;
    s.stats.earned[side] += n;
  }
  for (let side = 0; side < 2; side++) {
    const r = s.researching[side];
    if (!r) continue;
    r.remaining = Math.max(0, r.remaining - STEP);
    if (r.remaining < 1e-8) {
      s.research[side].push(r.id);
      s.researching[side] = null;
      for (const u of s.units.filter((u) => u.side === side)) {
        if (r.id === "weapons") u.damage *= 1.2;
        if (r.id === "armor") {
          u.hp *= 1.2;
          u.maxHp *= 1.2;
        }
      }
      if (r.id === "logistics")
        for (const b of s.buildings.filter((b) => b.side === side))
          b.spawnLeft /= 1.2;
    }
  }
  if (aiEnabled) ai(s);
  // One defensive arrow per lane. Even isolated raiders must overcome the castle guard.
  for (const c of s.castles) {
    c.cooldown = Math.max(0, c.cooldown - STEP);
    if (c.cooldown > 0 || c.hp <= 0) continue;
    let fired = false;
    for (let lane = 0; lane < 3; lane++) {
      const target = s.units
        .filter(
          (u) =>
            u.side !== c.side &&
            u.lane === lane &&
            u.hp > 0 &&
            Math.abs(u.x - c.x) < CASTLE.range,
        )
        .sort((a, b) => Math.abs(a.x - c.x) - Math.abs(b.x - c.x))[0];
      if (target) {
        fire(
          s,
          { side: c.side, x: c.x, y: LANES[lane] },
          target,
          CASTLE.damage,
          "arrow",
        );
        fired = true;
      }
    }
    if (fired) c.cooldown = CASTLE.cooldown;
  }
  const count = [0, 0];
  for (const u of s.units) count[u.side]++;
  for (const b of s.buildings) {
    b.cooldown = Math.max(0, b.cooldown - STEP);
    const t = buildingStats(s, b.type);
    if (t.unit) {
      b.spawnLeft -= STEP;
      if (b.spawnLeft <= 0 && count[b.side] < 90) {
        const stats = unitStats(s, t.unit),
          multi = 1 + 0.28 * (b.level - 1),
          hp =
            stats.hp * multi * (s.research[b.side].includes("armor") ? 1.2 : 1);
        s.units.push({
          id: s.nextId++,
          side: b.side,
          kind: t.unit,
          lane: b.lane,
          x: b.x,
          y: LANES[b.lane] + ((s.nextId % 3) - 1) * 24,
          formation: ((s.nextId % 3) - 1) * 24,
          hp,
          maxHp: hp,
          damage:
            stats.damage *
            multi *
            (s.research[b.side].includes("weapons") ? 1.2 : 1),
          speed: stats.speed,
          range: stats.range,
          cooldown: 0,
          attack: 0,
          moving: true,
        });
        count[b.side]++;
        s.stats.spawned[b.side]++;
        b.spawnLeft =
          t.spawn /
          (1 + 0.18 * (b.level - 1)) /
          (s.research[b.side].includes("logistics") ? 1.2 : 1);
      }
    }
    if (b.type === "tower" && b.cooldown <= 0) {
      const target = s.units
        .filter(
          (u) =>
            u.side !== b.side &&
            u.hp > 0 &&
            Math.hypot(u.x - b.x, u.y - b.y) < 175,
        )
        .sort((a, c) => Math.abs(a.x - b.x) - Math.abs(c.x - b.x))[0];
      if (target) {
        fire(s, b, target, 24 * (1 + 0.4 * (b.level - 1)), "arrow");
        b.cooldown = 1.3;
      }
    }
  }
  for (const u of s.units) {
    if (u.hp <= 0) continue;
    u.cooldown = Math.max(0, u.cooldown - STEP);
    u.attack = Math.max(0, u.attack - STEP);
    const target = findTarget(s, u),
      castle = typeof target.id === "string";
    const tx = target.x,
      ty = castle ? LANES[u.lane] : target.y;
    const dx = tx - u.x,
      dy = ty - u.y,
      dist = Math.hypot(dx, dy),
      range = u.range + (target.slot ? 20 : castle ? 30 : 0);
    u.moving = dist > range;
    if (u.moving) {
      const goalY =
          Math.abs(dx) > 210
            ? LANES[u.lane] + (u.formation || 0)
            : ty + (u.formation || 0) * 0.6,
        vy = goalY - u.y,
        len = Math.hypot(dx, vy) || 1;
      let mx = (dx / len) * u.speed * STEP,
        my = (vy / len) * u.speed * STEP;
      // Friendly troops keep a small frontage instead of stacking unlimited melee damage.
      for (const ally of s.units) {
        if (
          ally === u ||
          ally.side !== u.side ||
          ally.kind !== u.kind ||
          ally.lane !== u.lane ||
          ally.hp <= 0
        )
          continue;
        const ax = ally.x - u.x,
          ay = ally.y - u.y,
          d = Math.hypot(ax, ay);
        if (d < 19 && ax * mx + ay * my > 0) {
          const scale = Math.max(
            0,
            Math.min(1, (d - 17) / (Math.hypot(mx, my) || 1)),
          );
          mx *= scale;
          my *= scale;
        }
      }
      u.x += mx;
      u.y += my;
      u.moving = Math.hypot(mx, my) > 0.01;
    } else if (u.cooldown <= 0) {
      u.cooldown = UNIT[u.kind].cooldown;
      u.attack = 0.3;
      const power =
        u.damage * (u.kind === "siege" && (target.slot || castle) ? 3 : 1);
      if (u.kind === "soldier") damage(s, target, power, u.side);
      else fire(s, u, target, power, u.kind === "siege" ? "stone" : "arrow");
    }
  }
  const targets = new Map(
    [...s.units, ...s.buildings, ...s.castles].map((x) => [x.id, x]),
  );
  s.shots = s.shots.filter((p) => {
    p.life += STEP;
    const target = targets.get(p.target);
    if (!target || target.hp <= 0 || p.life > 5) return false;
    const ty =
      typeof target.id === "string"
        ? Math.max(130, Math.min(590, p.originY))
        : target.y;
    const dx = target.x - p.x,
      dy = ty - p.y,
      dist = Math.hypot(dx, dy),
      speed = p.kind === "stone" ? 205 : 360;
    if (dist < speed * STEP + 8) {
      damage(s, target, p.damage, p.side);
      return false;
    }
    p.x += (dx / dist) * speed * STEP;
    p.y += (dy / dist) * speed * STEP;
    return true;
  });
  s.units = s.units.filter((u) => u.hp > 0);
  s.buildings = s.buildings.filter((b) => b.hp > 0);
  for (const e of s.effects) e.age += STEP;
  s.effects = s.effects.filter((e) => e.age < (e.type === "ruin" ? 3 : 0.45));
  // Castle decay after ten minutes gives even a completely passive match an end.
  if (s.time > 600) for (const c of s.castles) c.hp -= (STEP * c.maxHp) / 120;
  const dead = s.castles.map((c) => c.hp <= 0);
  if (dead[0] || dead[1]) s.winner = dead[0] && dead[1] ? 2 : dead[0] ? 1 : 0;
}
