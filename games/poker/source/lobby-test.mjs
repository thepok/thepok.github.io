import { chromium } from "@playwright/test";
import assert from "node:assert/strict";
import fs from "node:fs/promises";
const browser = await chromium.launch({ channel: "msedge", headless: true }),
  errors = [];
const base = process.env.TEST_URL || "http://127.0.0.1:5180/games/poker/";
const make = async () => {
  const c = await browser.newContext({
    viewport: { width: 1400, height: 1000 },
  });
  if (process.env.BLOCK_WEBRTC === "1")
    await c.addInitScript(() => {
      const Native = window.RTCPeerConnection;
      window.RTCPeerConnection = class extends Native {
        constructor(config) {
          super({ ...config, iceTransportPolicy: "relay", iceServers: [] });
        }
      };
    });
  if (process.env.NOSTR_ONLY === "1")
    await c.routeWebSocket(/(broker\.emqx\.io|test\.mosquitto\.org)/, (s) =>
      s.close(),
    );
  const p = await c.newPage();
  p.on("pageerror", (e) => errors.push(e.message));
  await p.goto(base);
  return p;
};
const row = (p, title) =>
  p.locator(".directory-row").filter({ hasText: title });
await fs.mkdir("evidence", { recursive: true });
try {
  const suffix = crypto.randomUUID().slice(0, 6),
    title = "Feierabend " + suffix,
    host = await make();
  await host.locator("#name").fill("Gastgeber");
  await host.locator("#table-name").fill(title);
  await host.locator("#table-password").fill("runde42");
  await host
    .getByRole("button", { name: "Tisch eröffnen", exact: false })
    .click();
  await host.getByRole("button", { name: "Karten geben" }).waitFor();
  assert(!host.url().includes("runde42"));
  const visitor = await make();
  await row(visitor, title).waitFor({ timeout: 45000 });
  assert((await row(visitor, title).innerText()).includes("Mit Passwort"));
  await visitor.screenshot({
    path: "evidence/lobby-desktop.png",
    fullPage: true,
  });
  await visitor.locator("#name").fill("Gast");
  await row(visitor, title).getByRole("button", { name: "Beitreten" }).click();
  await visitor.locator("#table-password").fill("falsch");
  await visitor.getByRole("button", { name: "Am Tisch Platz nehmen" }).click();
  await visitor
    .getByRole("alert")
    .filter({ hasText: /passwort/i })
    .waitFor({ timeout: 30000 });
  assert.equal(await visitor.locator(".seat").count(), 0);
  assert.equal(
    await host.locator(".seat b").filter({ hasText: "Gast · Du" }).count(),
    0,
  );
  await visitor.getByRole("button", { name: "Verlassen", exact: true }).click();
  await row(visitor, title).waitFor({ timeout: 45000 });
  await row(visitor, title).getByRole("button", { name: "Beitreten" }).click();
  await visitor.locator("#table-password").fill("runde42");
  await visitor.getByRole("button", { name: "Am Tisch Platz nehmen" }).click();
  await visitor
    .locator(".seat b")
    .filter({ hasText: "Gast · Du" })
    .waitFor({ timeout: 45000 });
  await host
    .locator(".seat b")
    .filter({ hasText: /^Gast$/ })
    .waitFor();
  const watcher = await make();
  await row(watcher, title).waitFor({ timeout: 45000 });
  await host.getByRole("button", { name: "Verlassen", exact: true }).click();
  await row(watcher, title).waitFor({ state: "detached", timeout: 40000 });
  const privateHost = await make(),
    privateTitle = "Nur Freunde " + suffix;
  await privateHost.locator("#name").fill("Privat");
  await privateHost.locator("#table-name").fill(privateTitle);
  await privateHost.getByRole("checkbox").uncheck();
  await privateHost
    .getByRole("button", { name: "Tisch eröffnen", exact: false })
    .click();
  await privateHost.getByRole("button", { name: "Karten geben" }).waitFor();
  await watcher.waitForTimeout(5000);
  assert.equal(await row(watcher, privateTitle).count(), 0);
  const openHost = await make(),
    openTitle = "Offene Runde " + suffix;
  await openHost.locator("#name").fill("Offener Host");
  await openHost.locator("#table-name").fill(openTitle);
  await openHost
    .getByRole("button", { name: "Tisch eröffnen", exact: false })
    .click();
  await row(watcher, openTitle).waitFor({ timeout: 45000 });
  await watcher.setViewportSize({ width: 390, height: 844 });
  await watcher.screenshot({
    path: "evidence/lobby-mobile.png",
    fullPage: true,
  });
  assert(
    await watcher.evaluate(
      () => document.documentElement.scrollWidth <= innerWidth,
    ),
  );
  await watcher.locator("#name").fill("Offener Gast");
  await row(watcher, openTitle)
    .getByRole("button", { name: "Beitreten" })
    .click();
  assert.equal(await watcher.locator("#table-password").count(), 0);
  await watcher.getByRole("button", { name: "Am Tisch Platz nehmen" }).click();
  await watcher
    .locator(".seat b")
    .filter({ hasText: "Offener Gast · Du" })
    .waitFor({ timeout: 45000 });
  const report = {
    discoveredWithoutInvite: true,
    tableName: true,
    passwordNotInURL: true,
    wrongPasswordDenied: true,
    correctPasswordJoined: true,
    closedTableRemoved: true,
    unlistedTableHidden: true,
    openTableJoined: true,
    mobileNoOverflow: true,
    transport: await watcher.locator(".connection").innerText(),
    errors,
  };
  assert.deepEqual(errors, []);
  console.log(JSON.stringify(report, null, 2));
  await fs.writeFile(
    "evidence/lobby-report.json",
    JSON.stringify(report, null, 2),
  );
  for (const p of [privateHost, openHost, watcher])
    if (await p.getByRole("button", { name: "Verlassen", exact: true }).count())
      await p.getByRole("button", { name: "Verlassen", exact: true }).click();
} catch (error) {
  for (const c of browser.contexts())
    for (const p of c.pages()) {
      console.log(
        "FAILED PAGE",
        p.url(),
        (await p.locator("body").innerText()).slice(0, 3500),
      );
    }
  throw error;
} finally {
  await browser.close();
}
