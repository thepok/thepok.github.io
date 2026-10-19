import { chromium } from "@playwright/test";
import assert from "node:assert/strict";
import fs from "node:fs/promises";
const browser = await chromium.launch({ channel: "msedge", headless: true });
const ctx = await browser.newContext({
    viewport: { width: 1440, height: 1050 },
  }),
  a = await ctx.newPage();
const blockMqtt = async (context) =>
  context.routeWebSocket(/(broker\.emqx\.io|test\.mosquitto\.org)/, (ws) =>
    ws.close(),
  );
if (process.env.NOSTR_ONLY === "1") await blockMqtt(ctx);
const errors = [];
a.on("pageerror", (e) => errors.push(e.message));
const base = process.env.TEST_URL || "http://127.0.0.1:5173/games/poker/";
await fs.mkdir("evidence", { recursive: true });
try {
  await a.goto(base);
  await a.locator("#name").fill("Marcel");
  await a.getByRole("button", { name: "Privaten Tisch eröffnen" }).click();
  await a.getByRole("button", { name: "Karten geben" }).waitFor();
  assert.equal(await a.locator(".seat").count(), 6);
  assert.equal(await a.getByRole("button", { name: /entfernen/ }).count(), 5);
  await a.screenshot({ path: "evidence/desktop.png", fullPage: true });
  const link = a.url();
  if (process.env.JOIN_DELAY_MS)
    await a.waitForTimeout(Number(process.env.JOIN_DELAY_MS));
  const ctx2 = await browser.newContext();
  if (process.env.NOSTR_ONLY === "1") await blockMqtt(ctx2);
  if (process.env.NO_RELAY === "1")
    for (const context of [ctx, ctx2])
      await context.routeWebSocket(
        /(broker\.emqx\.io|test\.mosquitto\.org|nostr-relay\.corb\.net|nos\.lol)/,
        (ws) => ws.close(),
      );
  if (process.env.BLOCK_WEBRTC === "1")
    await ctx2.addInitScript(() => {
      const Native = window.RTCPeerConnection;
      window.RTCPeerConnection = class extends Native {
        constructor(config) {
          super({ ...config, iceTransportPolicy: "relay", iceServers: [] });
        }
      };
    });
  const b = await ctx2.newPage();
  b.on("pageerror", (e) => errors.push(e.message));
  await b.goto(link);
  await b.locator("#name").fill("Freund");
  await b.getByRole("button", { name: "Am Tisch Platz nehmen" }).click();
  let connected = false;
  try {
    await a
      .locator(".seat b")
      .filter({ hasText: "Freund" })
      .waitFor({ timeout: 45000 });
    connected = true;
  } catch {}
  assert.equal(connected, true, "Multiplayer-Beitritt fehlgeschlagen");
  const report = { soloLobby: true, multiplayerConnected: connected, errors };
  console.log("Verbindung:", connected);
  if (connected) {
    await b
      .locator(".seat b")
      .filter({ hasText: "Freund · Du" })
      .waitFor({ timeout: 15000 });
    report.initialTransport = await b.locator(".connection").innerText();
    if (process.env.BLOCK_WEBRTC === "1") {
      await b
        .locator(".connection")
        .filter({ hasText: /Relay-Verbindung/ })
        .waitFor();
      report.relayFallbackWithBlockedWebRTC = true;
    }
    assert.equal(await b.getByRole("button", { name: /entfernen/ }).count(), 4);
    await b
      .getByRole("button", { name: /entfernen/ })
      .first()
      .click();
    await a
      .getByRole("button", { name: /Bot hinzufügen/ })
      .first()
      .waitFor();
    await a
      .getByRole("button", { name: /Bot hinzufügen/ })
      .first()
      .click();
    await b
      .getByRole("button", { name: /entfernen/ })
      .nth(3)
      .waitFor();
    await a
      .getByRole("button", { name: /entfernen/ })
      .first()
      .click();
    await b
      .getByRole("button", { name: /Bot hinzufügen/ })
      .first()
      .waitFor();
    await b
      .getByRole("button", { name: /Bot hinzufügen/ })
      .first()
      .click();
    await a
      .getByRole("button", { name: /entfernen/ })
      .nth(3)
      .waitFor();
    report.sharedBotManagement = true;
  }
  await a.getByRole("button", { name: "Karten geben" }).click();
  assert.equal(await a.locator(".hole .back").count(), 10);
  assert.equal(await a.locator(".seat-0 .hole .back").count(), 0);
  report.hiddenOpponentCards = true;
  await a
    .getByRole("button", { name: /entfernen/ })
    .first()
    .click();
  await a.getByText(/Sitzplatzänderung\(en\)/).waitFor();
  report.deferredBotChange = true;
  const ctx3 = connected ? await browser.newContext() : null;
  if (ctx3 && process.env.NOSTR_ONLY === "1") await blockMqtt(ctx3);
  const c = ctx3 ? await ctx3.newPage() : null;
  if (c) {
    await c.goto(link);
    await c.locator("#name").fill("Später Gast");
    await c.getByRole("button", { name: "Am Tisch Platz nehmen" }).click();
    await c
      .getByText(/Du wartest auf die nächste Hand/)
      .waitFor({ timeout: 45000 });
    assert.equal(
      await a.locator(".seat b").filter({ hasText: "Später Gast" }).count(),
      0,
    );
    report.deferredHumanJoin = true;
  }
  const deadline = Date.now() + 100000;
  while (Date.now() < deadline) {
    if (await a.getByRole("button", { name: "Nächste Hand" }).count()) break;
    for (const page of connected ? [a, b] : [a]) {
      const call = page.getByRole("button", { name: /^(Check|Call \d+)$/ });
      if ((await call.count()) && (await call.isEnabled())) await call.click();
    }
    await a.waitForTimeout(250);
  }
  await a
    .getByRole("button", { name: "Nächste Hand" })
    .waitFor({ timeout: 1000 });
  report.completeHand = true;
  if (connected) {
    await a.screenshot({ path: "evidence/p2p.png", fullPage: true });
    await b.getByRole("button", { name: "Verlassen", exact: true }).click();
    await a.waitForFunction(
      () =>
        !Array.from(document.querySelectorAll(".seat b")).some((e) =>
          e.textContent?.includes("Freund"),
        ),
      {},
      { timeout: 30000 },
    );
    report.voluntaryLeaveReleasesSeat = true;
  }
  await a.getByRole("button", { name: "Nächste Hand" }).click();
  if (c)
    await a.waitForFunction(
      () =>
        document.querySelectorAll('button[aria-label$="entfernen"]').length ===
        3,
      {},
      { timeout: 10000 },
    );
  else
    await a
      .getByRole("button", { name: /Bot hinzufügen/ })
      .first()
      .waitFor();
  report.deferredBotApplied = true;
  if (c) {
    await a.locator(".seat b").filter({ hasText: "Später Gast" }).waitFor();
    await c.locator(".seat b").filter({ hasText: "Später Gast" }).waitFor();
    report.deferredHumanApplied = true;
  }
  await a.setViewportSize({ width: 390, height: 844 });
  await a.screenshot({ path: "evidence/mobile.png", fullPage: true });
  assert.equal(
    await a.evaluate(() => document.documentElement.scrollWidth <= innerWidth),
    true,
  );
  report.mobileNoOverflow = true;
  if (c) {
    await a.getByRole("button", { name: "Verlassen", exact: true }).click();
    await c.getByText(/Spielleiter getrennt/).waitFor({ timeout: 30000 });
    report.hostLossPaused = true;
  }
  assert.deepEqual(errors, []);
  await fs.writeFile("evidence/report.json", JSON.stringify(report, null, 2));
  console.log(JSON.stringify(report, null, 2));
} catch (error) {
  await a.screenshot({ path: "evidence/failure.png", fullPage: true });
  await fs.writeFile(
    "evidence/failure.txt",
    await a.locator("body").innerText(),
  );
  throw error;
} finally {
  await browser.close();
}
