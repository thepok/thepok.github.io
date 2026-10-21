import test from "node:test";
import assert from "node:assert/strict";
import { HostSimulation, GuestSimulation, cleanCommand } from "../net-core.js";
import * as E from "../engine.js";
test("all faction combinations keep teams and shared randomized rules independent", () => {
  for (const a of ["human", "orc"])
    for (const b of ["human", "orc"]) {
      const s = E.createGame({ seed: 19, factions: [a, b] });
      assert.deepEqual(s.factions, [a, b]);
      assert.equal(s.buildings.filter((x) => x.side === 0).length, 2);
      assert.equal(s.buildings.filter((x) => x.side === 1).length, 2);
      assert.deepEqual(s.rules, E.createGame({ seed: 19 }).rules);
    }
});
test("duplicate, reordered and lost frames converge without duplicate spending or AI actions", () => {
  const host = new HostSimulation({ seed: 42, factions: ["orc", "orc"] }),
    guest = new GuestSimulation();
  guest.snapshot(host.state);
  for (let tick = 0; tick < 1600; tick++) {
    if (tick === 20) {
      host.enqueue(0, "bank", {
        type: "build",
        slot: "0-1-1",
        building: "bank",
      });
      host.enqueue(0, "bank", {
        type: "build",
        slot: "0-1-1",
        building: "bank",
      });
      host.enqueue(1, "bank", {
        type: "build",
        slot: "1-1-1",
        building: "bank",
      });
    }
    if (tick === 80) {
      host.enqueue(0, "research", { type: "research", research: "archery" });
      host.enqueue(1, "research", { type: "research", research: "archery" });
    }
    if (tick === 500) {
      host.enqueue(1, "range", {
        type: "build",
        slot: "1-1-2",
        building: "range",
      });
      host.enqueue(0, "range", {
        type: "build",
        slot: "0-1-2",
        building: "range",
      });
    }
    host.advance();
    if (tick % 19 === 0) {
      const frames = host.frames(guest.state.tick);
      guest.receive(frames.toReversed());
      guest.receive(frames);
      while (guest.advance());
    }
  }
  guest.receive(host.frames(guest.state.tick));
  while (guest.advance());
  assert.deepEqual(guest.state, host.state);
  assert.equal(host.state.aiNext, 2);
  assert.equal(host.state.buildings.filter((x) => x.type === "bank").length, 2);
  assert.equal(
    host.state.buildings.filter((x) => x.type === "range").length,
    2,
  );
});
test("sender cannot override faction or sell opposing buildings; malformed commands rejected", () => {
  const host = new HostSimulation({ seed: 42 });
  assert.equal(
    cleanCommand({ type: "build", slot: "0-1-1", building: "__proto__" }),
    null,
  );
  host.enqueue(1, "cheat", {
    type: "sell",
    id: host.state.buildings.find((x) => x.side === 0).id,
    side: 0,
  });
  const replies = host.advance();
  assert.equal(replies[0].result.ok, false);
  assert.equal(host.state.buildings.length, 4);
  assert.equal(host.enqueue(1, "bad", { type: "teleport" }).ok, false);
});
test("snapshot repairs a gap beyond retained history, and replay of acknowledged input is idempotent", () => {
  const host = new HostSimulation({ seed: 3 }),
    guest = new GuestSimulation();
  guest.snapshot(host.state);
  host.enqueue(1, "one", { type: "research", research: "archery" });
  host.advance();
  const gold = host.state.gold[1];
  assert.equal(
    host.enqueue(1, "one", { type: "research", research: "archery" }).ok,
    true,
  );
  assert.equal(host.state.gold[1], gold);
  for (let i = 0; i < 240; i++) host.advance();
  guest.receive(host.frames(0));
  assert.equal(guest.advance(), false);
  guest.snapshot(host.state);
  host.advance();
  guest.receive(host.frames(guest.state.tick));
  guest.advance();
  assert.deepEqual(guest.state, host.state);
});

test("periodic checksum detects divergent simulation and a snapshot repairs it", () => {
  const host = new HostSimulation({ seed: 5 }),
    guest = new GuestSimulation();
  guest.snapshot(host.state);
  guest.state.gold[0] += 1;
  for (let i = 0; i < 20; i++) host.advance();
  guest.receive(host.frames(0));
  assert.throws(() => {
    while (guest.advance());
  }, /abgeglichen/);
  guest.snapshot(host.state);
  host.advance();
  guest.receive(host.frames(20));
  guest.advance();
  assert.deepEqual(guest.state, host.state);
});

for (const laneCount of [2, 3]) test(`host transfers ${laneCount}-lane layout to guest`, () => {
  const host = new HostSimulation({laneCount});
  const guest = new GuestSimulation();
  guest.snapshot(host.state);
  for (let i = 0; i < 200; i++) host.advance();
  guest.receive(host.frames(guest.state.tick));
  while (guest.advance());
  assert.equal(guest.state.lanes.length, laneCount);
  assert.deepEqual(guest.state, host.state);
});
