import { chromium } from "@playwright/test";
import assert from "node:assert/strict";
import fs from "node:fs/promises";
const browser = await chromium.launch({ channel: "msedge", headless: true });
const base = process.env.TEST_URL || "http://127.0.0.1:5192/";
const relay = process.env.RELAY_ONLY === "1";
const errors = [];
const faction = process.env.FACTION === "human" ? "human" : "orc";
async function page(mobile = false) {
  const ctx = await browser.newContext({
    viewport: mobile
      ? { width: 390, height: 844 }
      : { width: 1440, height: 1000 },
    isMobile: mobile,
    hasTouch: mobile,
  });
  const p = await ctx.newPage();
  p.on("pageerror", (e) => errors.push(e.message));
  return p;
}
const url =
  base +
  (base.includes("?") ? "&" : "?") +
  "test=1" +
  (relay ? "&relayOnly=1" : "");
const report = { mode: relay ? "relay-only" : "p2p-preferred" };
try {
  const a = await page(),
    b = await page(true);
  await a.goto(url);
  await a.locator("#multiplayer").click();
  await a.waitForFunction(
    () =>
      document
        .querySelector("#lobby-status")
        .textContent.includes("Spielliste verbunden"),
    {},
    { timeout: 60000 },
  );
  await a.locator("#multiplayer-faction").selectOption(faction);
  await a.locator("#room-title").fill("Testduell " + Date.now());
  await a.locator("#room-password").fill("test-ork-42");
  await a.locator("#host-form button").click();
  const invite = await a.locator("#invite-link").inputValue();
  console.log("Host ready", invite);
  await b.goto(url);
  await b.locator("#multiplayer").click();
  const roomId = new URLSearchParams(new URL(invite).hash.slice(1)).get("room");
  await b.locator(`[data-room="${roomId}"]`).waitFor({ timeout: 60000 });
  await b.locator(`[data-room="${roomId}"]`).click();
  report.publicListing = true;
  await b.locator("#multiplayer-faction").selectOption(faction);
  await b.locator("#join-password").fill("test-ork-42");
  await b.locator("#join-duel").click();
  await b.waitForFunction(
    () => window.__duel?.state?.tick > 10,
    {},
    { timeout: 60000 },
  );
  await a.waitForFunction(() => window.__duel?.state?.tick > 10);
  report.host = await a.evaluate(() => __duel.status);
  report.guest = await b.evaluate(() => __duel.status);
  console.log(report);
  assert.deepEqual(await b.evaluate(() => __game.factions), [faction, faction]);
  const intruder = await page();
  await intruder.goto(url + new URL(invite).hash);
  await intruder.locator("#join-password").fill("wrong-password");
  await intruder.locator("#join-duel").click();
  await intruder.waitForTimeout(2500);
  assert.equal(await intruder.evaluate(() => __duel.state), null);
  await intruder.locator("#leave-duel").click();
  await intruder.close();
  report.wrongPasswordBlocked = true;
  if (!relay) {
    await a.evaluate(() => {
      __duel.room.leave();
      __duel.direct.clear();
    });
    await b.waitForFunction(() => __duel.direct.size === 0);
    await b.waitForTimeout(1000);
    report.fallback = await b.evaluate(() => __duel.status);
    assert.match(report.fallback, /Relay/);
  }
  assert.equal(await b.evaluate(() => __view.localSide), 1);
  // Guests cannot choose a sender side or alter an opponent's buildings.
  await b.evaluate(() =>
    __command({
      type: "sell",
      id: __game.buildings.find((x) => x.side === 0).id,
    }),
  );
  await b.waitForTimeout(800);
  assert.equal(
    await a.evaluate(() => __game.buildings.filter((x) => x.side === 0).length),
    3,
  );
  assert.equal(
    (
      await a.evaluate(() =>
        __command({ type: "build", slot: "0-1-1", building: "bank" }),
      )
    ).ok,
    true,
  );
  await b.locator('[data-build="bank"]').click();
  const slotPoint = await b.evaluate(async () => {
    const E = await import("./engine.js?v=6");
    const slot = E.SLOTS.find((s) => s.id === "1-1-1");
    const p = __view.point(slot.x, slot.y);
    return { x: p.x, y: p.y - 8 };
  });
  await b.touchscreen.tap(slotPoint.x, slotPoint.y);
  await b.waitForFunction(
    () => __game.buildings.filter((x) => x.type === "bank").length === 2,
  );
  await b.locator("#research-button").click();
  await b.locator('[data-research="archery"]').click();
  await a.waitForFunction(() => __game.researching[1]?.id === "archery");
  await b.locator("#pause").click();
  await a.waitForFunction(() => __duel.paused);
  await b.waitForFunction(() => __duel.paused);
  const target = await a.evaluate(() => __game.tick);
  await b.waitForFunction((t) => __game.tick === t, target);
  assert.deepEqual(
    await b.evaluate(() => __game),
    await a.evaluate(() => __game),
  );
  await a.screenshot({ path: "evidence/multiplayer-host.png" });
  await b.screenshot({ path: "evidence/multiplayer-mobile.png" });
  report.equalStateAtTick = target;
  // Drop all guest packets during an active match, then restore the same session.
  await a.locator("#pause").click();
  await b.waitForFunction((t) => __game.tick > t, target);
  await b.evaluate(() => {
    const send = __duel.send,
      receive = __duel.receive;
    window.__restoreNetwork = () => {
      __duel.send = send;
      __duel.receive = receive;
    };
    __duel.send = async () => false;
    __duel.receive = () => {};
  });
  await a.waitForFunction(() => __duel.paused, {}, { timeout: 12000 });
  const frozen = await a.evaluate(() => __game.tick);
  await a.waitForTimeout(1000);
  assert.equal(await a.evaluate(() => __game.tick), frozen);
  await b.evaluate(() => window.__restoreNetwork());
  await a.waitForFunction(() => __duel.connected);
  await b.waitForFunction((t) => __game.tick === t, frozen, { timeout: 15000 });
  assert.deepEqual(
    await b.evaluate(() => __game),
    await a.evaluate(() => __game),
  );
  await a.locator("#pause").click();
  await a.waitForFunction((t) => __game.tick > t, frozen);
  await b.waitForFunction((t) => __game.tick > t, frozen);
  report.disconnectPauses = true;
  report.resume = true;
  await a.locator("#network-status").click();
  await a.locator("#leave-duel").click();
  await b.waitForFunction(() => __duel?.error.includes("verlassen"));
  assert.deepEqual(errors, []);
  report.errors = errors;
  console.log(JSON.stringify(report, null, 2));
  await fs.writeFile(
    "evidence/multiplayer-" + (relay ? "relay" : "p2p") + ".json",
    JSON.stringify(report, null, 2),
  );
} finally {
  await browser.close();
}
