import test from "node:test";
import assert from "node:assert/strict";
import {
  createGame,
  command,
  step,
  income,
  upgradeCost,
  slots,
  TYPES,
  UNIT,
  STEP,
  LANES,
  RESEARCH,
  researchStatus,
  buildingUnlocked,
  upgradeUnlocked,
  buildingStats,
  unitStats,
  CASTLE,
} from "../engine.js";

const run = (s, seconds, options = { aiEnabled: false }) => {
  for (let i = 0; i < Math.round(seconds / STEP); i++) step(s, options);
  return s;
};
const build = (s, side, type, slot = `${side}-0-1`) =>
  command(s, side, { type: "build", building: type, slot });
const unit = (id, side, kind = "soldier", x = 500, lane = 1) => ({
  id,
  side,
  kind,
  x,
  y: LANES[lane],
  lane,
  ...UNIT[kind],
  maxHp: UNIT[kind].hp,
  cooldown: 0,
  attack: 0,
  moving: true,
});
const empty = () => {
  const s = createGame();
  s.buildings = [];
  return s;
};
const near = (a, b) => assert.ok(Math.abs(a - b) < 1e-7, `${a} != ${b}`);

test("equal opening armies and distinct legal construction slots", () => {
  const s = createGame();
  assert.deepEqual(s.gold, [420, 420]);
  assert.equal(s.buildings.length, 6);
  assert.equal(new Set([...slots(0), ...slots(1)].map((p) => p.id)).size, 24);
  for (let side = 0; side < 2; side++)
    assert.deepEqual(
      s.buildings.filter((b) => b.side === side).map((b) => b.lane),
      [0, 1, 2],
    );
});

test("commands enforce ownership, occupied slots, money and known types without mutation", () => {
  const s = createGame();
  for (const [side, c] of [
    [2, { type: "build" }],
    [0, null],
    [0, { type: "build", building: "bank", slot: "1-0-1" }],
    [0, { type: "build", building: "bank", slot: "0-0-0" }],
    [0, { type: "build", building: "toString", slot: "0-0-1" }],
    [0, { type: "sell", id: s.buildings[3].id }],
    [0, { type: "upgrade", id: s.buildings[3].id }],
  ]) {
    const before = structuredClone(s);
    assert.equal(command(s, side, c).ok, false);
    assert.deepEqual(s, before);
  }
  s.research[0].push("engineering");
  assert.equal(build(s, 0, "workshop").ok, true);
  assert.equal(s.gold[0], 160);
  const before = structuredClone(s);
  assert.equal(build(s, 0, "bank", "0-0-2").ok, false);
  assert.deepEqual(s, before);
});

test("upgrades have bounded levels, real costs and proportional HP restoration; selling refunds investment", () => {
  const s = createGame();
  s.research[0].push("veteran", "mastery");
  s.gold[0] = 2000;
  const b = s.buildings[0];
  b.hp = 300;
  const base = buildingStats(s, "barracks").hp;
  assert.equal(upgradeCost(b), 108);
  assert.equal(command(s, 0, { type: "upgrade", id: b.id }).ok, true);
  assert.equal(b.level, 2);
  assert.equal(b.maxHp, Math.round(base * 1.4));
  near(b.hp, 300 + base * 0.4);
  assert.equal(s.gold[0], 1892);
  assert.equal(command(s, 0, { type: "upgrade", id: b.id }).ok, true);
  assert.equal(b.level, 3);
  const before = structuredClone(s);
  assert.equal(command(s, 0, { type: "upgrade", id: b.id }).ok, false);
  assert.deepEqual(s, before);
  const refund = Math.floor((b.paid * 0.6 * b.hp) / b.maxHp),
    gold = s.gold[0];
  assert.equal(command(s, 0, { type: "sell", id: b.id }).ok, true);
  assert.equal(s.gold[0], gold + refund);
  assert.equal(s.buildings.includes(b), false);
});

test("handicap applies to continuous base income and is clamped to 50–150%", () => {
  const s = empty();
  s.handicap = createGame({ handicap: 50, enemyHandicap: 150 }).handicap;
  run(s, 10);
  near(s.gold[0], 450);
  near(s.gold[1], 510);
  near(s.stats.earned[0], 30);
  near(s.stats.earned[1], 90);
  assert.deepEqual(
    createGame({ handicap: -1, enemyHandicap: 10000 }).handicap,
    [0.5, 1.5],
  );
});

test("bank interest uses saved gold with an independent cap per bank level", () => {
  const s = createGame();
  s.research[0].push("veteran");
  build(s, 0, "bank");
  s.gold[0] = 100;
  near(income(s, 0).bank, 0.3);
  s.gold[0] = 10000;
  near(income(s, 0).bank, 2);
  const b = s.buildings.find((b) => b.type === "bank");
  command(s, 0, { type: "upgrade", id: b.id });
  near(income(s, 0).bank, 4);
  build(s, 0, "bank", "0-1-1");
  near(income(s, 0).bank, 6);
});

test("identical seed, commands and steps produce serializable identical simulation", () => {
  const a = createGame({ seed: 123 }),
    b = createGame({ seed: 123 });
  for (const s of [a, b]) {
    build(s, 0, "range");
    run(s, 45, { aiEnabled: true });
    command(s, 0, { type: "upgrade", id: s.buildings[0].id });
    run(s, 20, { aiEnabled: true });
  }
  assert.deepEqual(a, b);
  assert.deepEqual(JSON.parse(JSON.stringify(a)), a);
  const other = createGame({ seed: 124 });
  run(other, 2);
  assert.notEqual(other.seed, a.seed);
});

test("a moving soldier advances then stops and attacks a nearby enemy", () => {
  const s = empty();
  s.units = [unit(100, 0, "soldier", 400), unit(101, 1, "soldier", 470)];
  step(s, { aiEnabled: false });
  assert.ok(s.units[0].x > 400);
  assert.equal(s.units[0].moving, true);
  run(s, 1);
  assert.ok(s.units.some((u) => u.hp < UNIT.soldier.hp));
  assert.ok(s.units.some((u) => !u.moving));
});

test("ranged damage lands only after projectile travel and awards each kill once", () => {
  const s = empty();
  s.units = [unit(100, 0, "archer", 400), unit(101, 1, "soldier", 500)];
  s.units[1].speed = 0;
  s.units[1].hp = 10;
  step(s, { aiEnabled: false });
  assert.equal(s.units[1].hp, 10);
  assert.ok(s.shots.length > 0);
  run(s, 0.4);
  assert.equal(s.units.length, 1);
  assert.equal(s.stats.kills[0], 1);
  const earned = s.stats.earned[0];
  near(s.gold[0], 420 + earned + 3);
});

test("siege projectile triples structure damage and can end the game", () => {
  const s = empty();
  s.units = [unit(100, 0, "siege", 900)];
  s.castles[1].hp = 90;
  run(s, 2);
  assert.equal(s.winner, 0);
  assert.ok(s.castles[1].hp <= 0);
  const before = structuredClone(s);
  step(s);
  assert.deepEqual(s, before);
  assert.equal(build(s, 0, "bank").ok, false);
});

test("tower shoots enemies in range but does not hit friendly units", () => {
  const s = empty();
  s.research[0].push("masonry");
  s.gold[0] = 500;
  assert.equal(build(s, 0, "tower", "0-1-3").ok, true);
  s.units = [unit(100, 0, "soldier", 450), unit(101, 1, "soldier", 480)];
  s.units.forEach((u) => {
    u.speed = 0;
    u.damage = 0;
  });
  run(s, 1);
  assert.equal(s.units[0].hp, 110);
  assert.equal(s.units[1].hp, 86);
});

test("production respects a hard cap of 90 units per side and resumes after losses", () => {
  const s = createGame();
  s.units = Array.from({ length: 90 }, (_, i) =>
    unit(100 + i, 0, "soldier", 155, 0),
  );
  s.nextId = 200;
  s.units.forEach((u) => (u.speed = 0));
  s.buildings.forEach((b) => (b.spawnLeft = 0));
  step(s, { aiEnabled: false });
  assert.equal(s.units.filter((u) => u.side === 0).length, 90);
  assert.equal(s.stats.spawned[0], 0);
  s.units.pop();
  s.units = s.units.filter((u, i) => i !== 0);
  step(s, { aiEnabled: false });
  assert.equal(s.units.filter((u) => u.side === 0).length, 90);
  assert.equal(s.stats.spawned[0], 1);
});

test("a passive match has a finite draw and stops updating after completion", () => {
  const s = empty();
  run(s, 730);
  assert.equal(s.winner, 2);
  assert.ok(s.time <= 720.1);
  const before = structuredClone(s);
  step(s);
  assert.deepEqual(s, before);
});

function mixedPolicy(s) {
  const research = Object.keys(RESEARCH).find(
    (id) => researchStatus(s, 0, id).canStart,
  );
  if (research) {
    command(s, 0, { type: "research", research });
    return;
  }
  const free = slots(0)
    .filter((p) => !s.buildings.some((b) => b.slot === p.id))
    .sort((a, b) => a.col - b.col);
  const p = free[0],
    type = ["barracks", "range", "workshop", "tower"][p?.col || 0];
  if (p && buildingUnlocked(s, 0, type))
    command(s, 0, { type: "build", slot: p.id, building: type });
  else {
    const b = s.buildings
      .filter((b) => b.side === 0 && upgradeUnlocked(s, 0, b))
      .sort((a, b) => a.level - b.level)[0];
    if (b) command(s, 0, { type: "upgrade", id: b.id });
  }
}
test("normal AI completes legal matches; an active player can beat it", (t) => {
  for (const active of [false, true]) {
    const s = createGame();
    const start = performance.now();
    let peak = 0;
    while (s.winner === null && s.time < 730) {
      if (active && s.tick % 40 === 0) mixedPolicy(s);
      step(s);
      peak = Math.max(peak, s.units.length);
      assert.ok(s.gold.every((g) => g >= 0 && Number.isFinite(g)));
    }
    assert.equal(s.winner, active ? 0 : 1);
    assert.ok(peak <= 180);
    const spent =
      s.buildings.filter((b) => b.side === 1).reduce((n, b) => n + b.paid, 0) +
      s.research[1].reduce((n, id) => n + RESEARCH[id].cost, 0) +
      (s.researching[1] ? RESEARCH[s.researching[1].id].cost : 0);
    assert.ok(spent <= 420 + 360 + s.stats.earned[1] + s.stats.kills[1] * 8);
    t.diagnostic(
      `${active ? "Mixed army with research" : "Idle player"}: winner ${s.winner}, ${s.time.toFixed(1)} game seconds, ${peak} peak units, ${(performance.now() - start).toFixed(0)} ms simulation`,
    );
  }
});

test("random match stats stay within ±15%, are seeded and are shared by both factions", () => {
  for (const seed of [0, 1, 42, 123456, 0xffffffff]) {
    const s = createGame({ seed });
    assert.deepEqual(s.rules, createGame({ seed }).rules);
    for (const [kind, base] of Object.entries(UNIT))
      for (const key of ["hp", "damage", "speed"])
        assert.ok(
          unitStats(s, kind)[key] >= base[key] * 0.85 - 1e-8 &&
            unitStats(s, kind)[key] <= base[key] * 1.15 + 1e-8,
        );
    for (const [type, base] of Object.entries(TYPES))
      for (const key of ["hp", ...(base.spawn ? ["spawn"] : [])])
        assert.ok(
          buildingStats(s, type)[key] >= base[key] * 0.85 - 1e-8 &&
            buildingStats(s, type)[key] <= base[key] * 1.15 + 1e-8,
        );
    const rules = structuredClone(s.rules);
    run(s, 3);
    assert.deepEqual(s.rules, rules);
    const pair = s.units.filter((u) => u.lane === 0);
    assert.equal(pair.length, 2);
    assert.equal(pair[0].maxHp, pair[1].maxHp);
    assert.equal(pair[0].damage, pair[1].damage);
    assert.equal(pair[0].speed, pair[1].speed);
    const barracks = s.buildings.filter((b) => b.lane === 0);
    assert.equal(barracks[0].maxHp, barracks[1].maxHp);
  }
  assert.notDeepEqual(
    createGame({ seed: 1 }).rules,
    createGame({ seed: 2 }).rules,
  );
});

test("research validates prerequisites, gold, single queue and exact completion before unlocking", () => {
  const s = empty();
  assert.equal(build(s, 0, "range").ok, false);
  assert.equal(researchStatus(s, 0, "engineering").state, "locked");
  assert.equal(
    command(s, 0, { type: "research", research: "engineering" }).ok,
    false,
  );
  assert.equal(
    command(s, 0, { type: "research", research: "constructor" }).ok,
    false,
  );
  assert.equal(
    command(s, 0, { type: "research", research: "archery" }).ok,
    true,
  );
  assert.equal(s.gold[0], 300);
  assert.equal(
    command(s, 0, { type: "research", research: "masonry" }).ok,
    false,
  );
  run(s, 17.95);
  assert.equal(buildingUnlocked(s, 0, "range"), false);
  step(s, { aiEnabled: false });
  assert.equal(researchStatus(s, 0, "archery").state, "done");
  assert.equal(s.researching[0], null);
  assert.equal(build(s, 0, "range").ok, true);
  assert.equal(
    command(s, 0, { type: "research", research: "archery" }).ok,
    false,
  );
  assert.equal(buildingUnlocked(s, 1, "range"), false);
  s.gold[0] = 0;
  assert.equal(
    command(s, 0, { type: "research", research: "masonry" }).ok,
    false,
  );
  s.gold[0] = 1000;
  command(s, 0, { type: "research", research: "masonry" });
  run(s, 15);
  assert.equal(researchStatus(s, 0, "engineering").canStart, true);
});

test("building upgrade levels require completed veteran and mastery research", () => {
  const s = createGame();
  s.gold[0] = 5000;
  const b = s.buildings[0];
  assert.equal(command(s, 0, { type: "upgrade", id: b.id }).ok, false);
  command(s, 0, { type: "research", research: "weapons" });
  run(s, 20);
  command(s, 0, { type: "research", research: "veteran" });
  run(s, 25);
  assert.equal(command(s, 0, { type: "upgrade", id: b.id }).ok, true);
  assert.equal(command(s, 0, { type: "upgrade", id: b.id }).ok, false);
  assert.equal(researchStatus(s, 0, "mastery").state, "locked");
  s.research[0].push("engineering");
  command(s, 0, { type: "research", research: "mastery" });
  run(s, 35);
  assert.equal(command(s, 0, { type: "upgrade", id: b.id }).ok, true);
});

test("weapon and armor research affect old and new troops once and preserve damage fraction", () => {
  const s = createGame();
  s.gold[0] = 5000;
  s.buildings = s.buildings.filter((b) => b.side === 0 && b.lane === 0);
  s.units = [unit(100, 0, "soldier", 52)];
  s.units[0].speed = 0;
  s.units[0].hp = 55;
  s.nextId = 101;
  const original = s.units[0];
  command(s, 0, { type: "research", research: "weapons" });
  run(s, 20);
  near(original.damage, 18 * 1.2);
  command(s, 0, { type: "research", research: "armor" });
  run(s, 20);
  near(original.hp, 66);
  near(original.maxHp, 132);
  near(original.damage, 21.6);
  s.buildings[0].spawnLeft = 0;
  step(s, { aiEnabled: false });
  const newest = s.units.at(-1);
  near(newest.damage, unitStats(s, "soldier").damage * 1.2);
  near(newest.maxHp, unitStats(s, "soldier").hp * 1.2);
  run(s, 1);
  near(original.damage, 21.6);
  near(original.maxHp, 132);
});

test("banking increases caps only; logistics speeds existing production timers and future intervals", () => {
  const s = createGame();
  s.gold[0] = 10000;
  s.research[0].push("veteran");
  build(s, 0, "bank");
  command(s, 0, { type: "research", research: "banking" });
  run(s, 25);
  near(income(s, 0).bank, 3);
  command(s, 0, { type: "research", research: "logistics" });
  run(s, 24.95);
  const b = s.buildings[0];
  b.spawnLeft = 6.05;
  step(s, { aiEnabled: false });
  near(b.spawnLeft, 6.05 / 1.2 - STEP);
  b.spawnLeft = 0;
  step(s, { aiEnabled: false });
  near(b.spawnLeft, buildingStats(s, "barracks").spawn / 1.2);
});

test("castle defensive arrows cover each lane and leave distant armies alone", () => {
  const s = empty();
  s.units = [
    unit(100, 1, "soldier", 200, 0),
    unit(101, 1, "soldier", 200, 2),
    unit(102, 1, "soldier", 500, 1),
  ];
  s.units.forEach((u) => (u.speed = 0));
  run(s, 1);
  assert.equal(s.units[0].hp, 110 - CASTLE.damage);
  assert.equal(s.units[1].hp, 110 - CASTLE.damage);
  assert.equal(s.units[2].hp, 110);
});

test("infantry can pass friendly archers; same-kind troops preserve frontage", () => {
  const s = empty();
  s.units = [
    unit(100, 0, "soldier", 400),
    unit(101, 0, "archer", 410),
    unit(102, 1, "soldier", 530),
  ];
  s.units[1].speed = 0;
  s.units[2].speed = 0;
  run(s, 1);
  assert.ok(s.units[0].x > 410);
  const t = empty();
  t.units = [unit(100, 0, "soldier", 400), unit(101, 0, "soldier", 417)];
  t.units[1].speed = 0;
  run(t, 1);
  assert.ok(t.units[0].x <= 400.01);
});
