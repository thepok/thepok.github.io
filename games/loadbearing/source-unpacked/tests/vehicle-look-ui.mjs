import { chromium } from '@playwright/test';
import assert from 'node:assert/strict';

const browser = await chromium.launch({ channel: 'chrome', headless: true });
const page = await browser.newPage({ viewport: { width: 1536, height: 960 } });
try {
  await page.goto(process.env.TEST_URL || 'http://localhost:5174');
  await page.waitForFunction(() => window.__loadBearing?.ready);
  await page.click('#workshop-mode');
  await page.click('#vehicle-mode');
  await page.click('#vehicle-drive');
  await page.waitForFunction(() => window.__loadBearing.simulation?.elapsed > 1);
  const cameraChecks = await page.evaluate(() => {
    const app = window.__loadBearing, scene = app.scene;
    const chassis = app.simulation.items.find(item => item.kind === 'vehicle-chassis');
    return [0, .35, .7].map(pitch => {
      for (let i = 0; i < 80; i++) scene.followVehicle(chassis, 1 / 60, .3, pitch);
      const position = scene.camera.position.clone(), rotation = scene.camera.quaternion.clone();
      scene.render(1 / 60);
      return { pitch, moved: position.distanceTo(scene.camera.position), rotated: rotation.angleTo(scene.camera.quaternion), orbitEnabled: scene.controls.enabled };
    });
  });
  for (const check of cameraChecks) {
    assert.equal(check.orbitEnabled, false);
    assert.ok(check.moved < 1e-6 && check.rotated < 1e-6, JSON.stringify(check));
  }
  await page.click('#viewport', { position: { x: 600, y: 300 } });
  await page.waitForFunction(() => !!document.pointerLockElement);
  for (const key of ['w', 's']) {
    await page.keyboard.down(key);
    for (let i = 0; i < 4; i++) {
      await page.keyboard.down(key);
      const before = await page.evaluate(() => window.__loadBearing.vehicleWorkshop.yaw);
      await page.mouse.move(700 + i * 25, 350 + i * 10);
      await page.waitForFunction(yaw => window.__loadBearing.vehicleWorkshop.yaw !== yaw, before);
    }
    await page.keyboard.up(key);
  }
  console.log('PASS driving camera survives rendering at all aim pitches; mouse-look receives input during held/repeating W and S', cameraChecks);
} finally {
  await browser.close();
}
