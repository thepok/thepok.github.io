import { chromium } from "@playwright/test";
import assert from "node:assert/strict";
import fs from "node:fs/promises";
const base = process.env.TEST_URL || "http://127.0.0.1:5192/";
const browser = await chromium.launch({ channel: "msedge", headless: true });
const errors = [],
  report = {};
await fs.mkdir("evidence", { recursive: true });
async function open(mobile = false) {
  const context = await browser.newContext({
    viewport: mobile
      ? { width: 390, height: 844 }
      : { width: 1440, height: 1000 },
    isMobile: mobile,
    hasTouch: mobile,
  });
  const p = await context.newPage();
  p.on("pageerror", (e) => errors.push(e.message));
  await p.goto(base + (base.includes("?") ? "&" : "?") + "test=1");
  await p.locator("#setup[open]").waitFor();
  await p.locator("#setup-form button").click();
  await p.waitForFunction(
    () =>
      Object.keys(window.__view.sheets).length === 6 &&
      Object.values(window.__view.sheets).every(
        (x) => x.img.complete && x.img.naturalWidth,
      ) &&
      window.__view.buildingRects,
  );
  return { context, p };
}
async function tapWorld(p, x, y, touch = false) {
  const pos = await p.evaluate(
    ({ x, y }) => {
      const b = document.querySelector("#map").getBoundingClientRect(),
        v = window.__view.point(x, y);
      return { x: b.x + v.x, y: b.y + v.y };
    },
    { x, y },
  );
  if (touch) await p.touchscreen.tap(pos.x, pos.y);
  else await p.mouse.click(pos.x, pos.y);
}
try {
  const { context, p } = await open();
  await p.locator('[data-build="bank"]').click();
  await tapWorld(p, 241, 222);
  assert.equal(
    await p.evaluate(
      () =>
        window.__game.buildings.filter((x) => x.side === 0 && x.type === "bank")
          .length,
    ),
    1,
  );
  await tapWorld(p, 241, 222);
  assert.match(await p.locator("#detail h3").innerText(), /Bank/);
  await p.locator("[data-sell]").click();
  assert.equal(
    await p.evaluate(
      () =>
        window.__game.buildings.filter((x) => x.side === 0 && x.type === "bank")
          .length,
    ),
    1,
  );
  await p.locator("[data-sell]").click();
  assert.equal(
    await p.evaluate(
      () =>
        window.__game.buildings.filter((x) => x.side === 0 && x.type === "bank")
          .length,
    ),
    0,
  );
  await p.locator("#research-button").click();
  assert.equal(
    await p.locator(".research-picture > .research-icon").count(),
    9,
  );
  assert.ok((await p.locator(".research-needs .needs-icon").count()) >= 4);
  await p.evaluate(() => {
    window.speechSynthesis.speak = (u) => {
      window.__spoken = { text: u.text, lang: u.lang };
    };
    window.speechSynthesis.cancel = () => {};
  });
  const goldBeforeVoice = await p.evaluate(() => window.__game.gold[0]);
  await p.locator('[data-speak="archery"]').click();
  assert.match(
    await p.evaluate(() => window.__spoken.text),
    /Haus für Bogenschützen/,
  );
  assert.equal(await p.evaluate(() => window.__spoken.lang), "de-DE");
  assert.equal(await p.evaluate(() => window.__game.researching[0]), null);
  assert.ok((await p.evaluate(() => window.__game.gold[0])) >= goldBeforeVoice);
  report.childResearch = {
    ninePictograms: true,
    picturePrerequisites: true,
    germanReadAloud: true,
    listenDoesNotSpend: true,
  };
  await p.locator('[data-research="archery"]').click();
  assert.equal(
    await p.evaluate(() => window.__game.researching[0].id),
    "archery",
  );
  await p.locator("#research-close").click();
  await p.evaluate(() => window.__advance(19));
  assert.equal(
    await p.evaluate(() => window.__game.research[0].includes("archery")),
    true,
  );
  await p.locator('[data-build="range"]').click();
  await tapWorld(p, 241, 222);
  assert.equal(
    await p.evaluate(
      () =>
        window.__game.buildings.filter(
          (x) => x.side === 0 && x.type === "range",
        ).length,
    ),
    1,
  );
  await p.locator("#pause").click();
  const tick = await p.evaluate(() => window.__game.tick);
  await p.waitForTimeout(250);
  assert.equal(await p.evaluate(() => window.__game.tick), tick);
  await p.locator("#pause").click();
  await p.locator("#help").click();
  assert.equal(await p.locator("#help-dialog").evaluate((x) => x.open), true);
  await p.locator("#help-close").click();
  await p.locator("#zoom-in").click();
  assert.ok(await p.evaluate(() => window.__view.zoom > 1));
  await p.locator("#overview").click();
  assert.equal(await p.evaluate(() => window.__view.zoom), 1);
  await p.screenshot({ path: "evidence/desktop.png", fullPage: true });
  // Complete a legal match using only affordable build/research/upgrade commands, no state edits.
  const result = await p.evaluate(async () => {
    const E = await import("./engine.js");
    const research = [
      "archery",
      "masonry",
      "weapons",
      "armor",
      "engineering",
      "veteran",
      "logistics",
      "mastery",
      "banking",
    ];
    let actions = 0;
    while (window.__game.winner === null && window.__game.time < 730) {
      const s = window.__game;
      let acted = false;
      for (const id of research)
        if (E.researchStatus(s, 0, id).canStart) {
          window.__command({ type: "research", research: id });
          actions++;
          acted = true;
          break;
        }
      if (!acted) {
        for (const slot of E.slots(0)) {
          if (s.buildings.some((b) => b.slot === slot.id)) continue;
          const type =
            slot.col === 1 ? "range" : slot.col === 2 ? "workshop" : "tower";
          if (
            E.buildingUnlocked(s, 0, type) &&
            s.gold[0] >= E.TYPES[type].cost
          ) {
            window.__command({ type: "build", slot: slot.id, building: type });
            actions++;
            acted = true;
            break;
          }
        }
      }
      if (!acted)
        for (const b of s.buildings.filter((b) => b.side === 0)) {
          if (E.upgradeUnlocked(s, 0, b) && s.gold[0] >= E.upgradeCost(b)) {
            window.__command({ type: "upgrade", id: b.id });
            actions++;
            break;
          }
        }
      window.__advance(4);
    }
    return {
      winner: window.__game.winner,
      time: window.__game.time,
      actions,
      research: window.__game.research[0],
    };
  });
  assert.notEqual(result.winner, null);
  assert.ok(result.actions > 0);
  await p.locator("#result[open]").waitFor();
  report.match = result;
  await p.locator("#restart").click();
  await p.locator("#setup[open]").waitFor();
  report.desktop = {
    build: true,
    research: true,
    sellConfirmation: true,
    pause: true,
    help: true,
    zoom: true,
    completeMatch: true,
    restart: true,
  };
  await context.close();
  const mobile = await open(true),
    m = mobile.p;
  assert.ok(await m.evaluate(() => window.__view.zoom > 1));
  const bounds = await m.locator("#map").boundingBox();
  const count = await m.evaluate(
      () => window.__game.buildings.filter((x) => x.side === 0).length,
    ),
    before = await m.evaluate(() => window.__view.panY);
  const cdp = await mobile.context.newCDPSession(m),
    cx = bounds.x + bounds.width / 2,
    cy = bounds.y + bounds.height / 2;
  await cdp.send("Input.dispatchTouchEvent", {
    type: "touchStart",
    touchPoints: [{ x: cx, y: cy, id: 1 }],
  });
  await cdp.send("Input.dispatchTouchEvent", {
    type: "touchMove",
    touchPoints: [{ x: cx, y: cy + 80, id: 1 }],
  });
  await cdp.send("Input.dispatchTouchEvent", {
    type: "touchEnd",
    touchPoints: [],
  });
  assert.notEqual(await m.evaluate(() => window.__view.panY), before);
  assert.equal(
    await m.evaluate(
      () => window.__game.buildings.filter((x) => x.side === 0).length,
    ),
    count,
  );
  const zoom = await m.evaluate(() => window.__view.zoom);
  await cdp.send("Input.dispatchTouchEvent", {
    type: "touchStart",
    touchPoints: [
      { x: cx - 35, y: cy, id: 1 },
      { x: cx + 35, y: cy, id: 2 },
    ],
  });
  await cdp.send("Input.dispatchTouchEvent", {
    type: "touchMove",
    touchPoints: [
      { x: cx - 65, y: cy, id: 1 },
      { x: cx + 65, y: cy, id: 2 },
    ],
  });
  await cdp.send("Input.dispatchTouchEvent", {
    type: "touchEnd",
    touchPoints: [],
  });
  assert.ok((await m.evaluate(() => window.__view.zoom)) > zoom);
  assert.equal(
    await m.evaluate(
      () => window.__game.buildings.filter((x) => x.side === 0).length,
    ),
    count,
  );
  await m.locator("#overview").tap();
  await m.locator('[data-build="bank"]').tap();
  await tapWorld(m, 241, 222, true);
  assert.equal(
    await m.evaluate(
      () =>
        window.__game.buildings.filter((x) => x.side === 0 && x.type === "bank")
          .length,
    ),
    1,
  );
  await m.locator("#research-button").tap();
  assert.equal(
    await m.locator("#research-dialog").evaluate((x) => x.open),
    true,
  );
  assert.equal(
    await m.evaluate(
      () =>
        document.querySelector("#research-dialog").scrollWidth <=
        document.querySelector("#research-dialog").clientWidth + 1,
    ),
    true,
  );
  await m.screenshot({ path: "evidence/mobile-research.png", fullPage: true });
  await m.locator("#research-close").tap();
  assert.equal(
    await m.evaluate(() => document.documentElement.scrollWidth <= innerWidth),
    true,
  );
  await m.evaluate(() => window.__advance(25));
  await m.locator("#zoom-in").tap();
  await m.screenshot({ path: "evidence/mobile.png", fullPage: true });
  await m.setViewportSize({ width: 844, height: 390 });
  await m.waitForTimeout(100);
  assert.equal(
    await m.evaluate(() => document.documentElement.scrollWidth <= innerWidth),
    true,
  );
  report.mobile = {
    touchBuild: true,
    drag: true,
    pinch: true,
    noAccidentalBuild: true,
    overview: true,
    research: true,
    noOverflow: true,
    landscape: true,
  };
  await mobile.context.close();
  assert.deepEqual(errors, []);
  report.errors = errors;
  await fs.writeFile(
    "evidence/browser-report.json",
    JSON.stringify(report, null, 2),
  );
  console.log(JSON.stringify(report, null, 2));
} finally {
  await browser.close();
}
