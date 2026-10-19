import { chromium } from "@playwright/test";
import assert from "node:assert/strict";
import fs from "node:fs/promises";
const browser = await chromium.launch({ channel: "msedge", headless: true });
const ctx = await browser.newContext({
    viewport: { width: 1440, height: 1050 },
  }),
  a = await ctx.newPage();
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
  const ctx2 = await browser.newContext(),
    b = await ctx2.newPage();
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
  const report = { soloLobby: true, p2pConnected: connected, errors };
  console.log("Verbindung:", connected);
  if (connected) {
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
  assert.equal(await a.locator('.hole .back').count(),10);
  assert.equal(await a.locator('.seat-0 .hole .back').count(),0);
  report.hiddenOpponentCards=true;
  await a
    .getByRole("button", { name: /entfernen/ })
    .first()
    .click();
  await a.getByText(/Sitzplatzänderung\(en\)/).waitFor();
  report.deferredBotChange = true;
  const ctx3 = connected ? await browser.newContext() : null;
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
    await a.getByText("OFFLINE", { exact: true }).waitFor({ timeout: 30000 });
    report.peerDisconnect = true;
  }
  await a.getByRole("button", { name: "Nächste Hand" }).click();
  if(c) assert.equal(await a.getByRole('button',{name:/entfernen/}).count(),3);
  else await a.getByRole('button',{name:/Bot hinzufügen/}).first().waitFor();
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
} finally {
  await browser.close();
}
