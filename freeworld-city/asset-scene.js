import * as THREE from "./vendor/three.module.js";

const params = new URLSearchParams(window.location.search);
const shotMode = (params.get("shot") || "").trim() === "1";
const canvas = document.getElementById("preview-canvas");
const titleEl = document.getElementById("preview-title");
const assetSelectEl = document.getElementById("asset-select");
const viewSelectEl = document.getElementById("view-select");

const scene = new THREE.Scene();
scene.background = new THREE.Color(0xded3bf);

const camera = new THREE.PerspectiveCamera(48, 1, 0.1, 400);
const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, powerPreference: "high-performance" });
renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.6));
renderer.outputColorSpace = THREE.SRGBColorSpace;

scene.add(new THREE.AmbientLight(0xf8eedf, 1.2));
const sun = new THREE.DirectionalLight(0xfff0d4, 1.6);
sun.position.set(28, 42, 20);
scene.add(sun);
const rim = new THREE.DirectionalLight(0xc2d5eb, 0.7);
rim.position.set(-18, 20, -26);
scene.add(rim);

const ground = new THREE.Mesh(
  new THREE.CylinderGeometry(28, 32, 2, 10),
  new THREE.MeshLambertMaterial({ color: 0xc7b89f }),
);
ground.position.y = -1;
scene.add(ground);

const palette = {
  stone: 0xc9b69f,
  darkStone: 0x544c40,
  brick: 0x8a4637,
  terracotta: 0xbc6b44,
  steel: 0x586777,
  glass: 0x86a9c1,
  concrete: 0xb6aea0,
  asphalt: 0x3a342f,
  bronze: 0x9e7a39,
  gold: 0xc8a249,
  green: 0x4a6c52,
  cream: 0xe9dfcc,
  awning: 0x7f2534,
  signage: 0xe78959,
  rail: 0x7d848c,
  roof: 0x2b2e34,
  plaza: 0xd8cfbf,
  neon: 0xcf4c7c,
  tree: 0x587545,
  trunk: 0x6d4b31,
};

const viewConfigs = {
  hero: { azimuthDeg: -36, elevationDeg: 22, distanceFactor: 1.38 },
  corner: { azimuthDeg: 118, elevationDeg: 28, distanceFactor: 1.26 },
  reverse: { azimuthDeg: 205, elevationDeg: 18, distanceFactor: 1.52 },
};

let assetLibrary = [];
let currentAssetId = "";
let currentView = params.get("view") || "hero";
let assetGroup = null;
let previewReady = false;

function resizeRenderer() {
  const rect = canvas.parentElement.getBoundingClientRect();
  renderer.setSize(rect.width, rect.height, false);
  camera.aspect = rect.width / Math.max(rect.height, 1);
  camera.updateProjectionMatrix();
}

function makeMaterial(color) {
  return new THREE.MeshLambertMaterial({ color });
}

function addBox(group, x, y, z, w, h, d, color) {
  const mesh = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), makeMaterial(color));
  mesh.position.set(x, y + (h / 2), z);
  group.add(mesh);
  return mesh;
}

function addCylinder(group, x, y, z, r, h, color, sides = 10) {
  const mesh = new THREE.Mesh(new THREE.CylinderGeometry(r, r, h, sides), makeMaterial(color));
  mesh.position.set(x, y + (h / 2), z);
  group.add(mesh);
  return mesh;
}

function addWindows(group, x0, x1, y0, floors, z, color, depth = 0.2) {
  for (let floor = 0; floor < floors; floor += 1) {
    for (let x = x0; x <= x1; x += 2.2) {
      addBox(group, x, y0 + (floor * 2.9), z, 1.1, 1.5, depth, color);
    }
  }
}

function addStreetTrees(group, xStart, count, z) {
  for (let index = 0; index < count; index += 1) {
    const x = xStart + (index * 4.4);
    addCylinder(group, x, 0, z, 0.18, 1.8, palette.trunk, 8);
    addCylinder(group, x, 1.6, z, 0.95, 2.2, palette.tree, 9);
  }
}

function buildOfficeTower(group) {
  addBox(group, 0, 0, 0, 18, 4, 14, palette.stone);
  addBox(group, 0, 4, 0, 11, 36, 10, palette.steel);
  addBox(group, 0, 40, 0, 8.5, 6, 8, palette.roof);
  addBox(group, 0, 46, 0, 4.8, 2, 4.8, palette.gold);
  addBox(group, 0, 0, 7.2, 7.5, 3.2, 1.4, palette.glass);
  addBox(group, -5.4, 0, 7.25, 2.2, 3.2, 0.6, palette.cream);
  addBox(group, 5.4, 0, 7.25, 2.2, 3.2, 0.6, palette.cream);
  addWindows(group, -4.2, 4.2, 5, 10, 5.12, palette.glass);
  addWindows(group, -4.2, 4.2, 5, 10, -5.12, palette.glass);
  addStreetTrees(group, -5.8, 3, 11.4);
}

function buildMixedUseMidrise(group) {
  addBox(group, 0, 0, 0, 18, 20, 14, palette.brick);
  addBox(group, 0, 0, 7.2, 18, 4.2, 1.2, palette.cream);
  addBox(group, 0, 20, -0.2, 12, 2.4, 10, palette.roof);
  for (let bay = -6.6; bay <= 6.6; bay += 3.3) {
    addBox(group, bay, 0, 7.35, 2.1, 3.1, 0.45, palette.glass);
    addBox(group, bay, 4.8, 7.1, 1.3, 1.6, 0.3, palette.cream);
    addBox(group, bay, 8.0, 7.1, 1.3, 1.6, 0.3, palette.cream);
    addBox(group, bay, 11.2, 7.1, 1.3, 1.6, 0.3, palette.cream);
    addBox(group, bay, 14.4, 7.1, 1.3, 1.6, 0.3, palette.cream);
  }
  addBox(group, -4.4, 0, 8.1, 3.6, 0.4, 1.6, palette.awning);
  addBox(group, 4.4, 0, 8.1, 3.6, 0.4, 1.6, palette.awning);
  addBox(group, 0, 17.2, 0, 4.6, 2.4, 4.6, palette.steel);
}

function buildApartmentMidrise(group) {
  addBox(group, 0, 0, 0, 20, 18, 12, palette.terracotta);
  addBox(group, 0, 0, 6.2, 5.2, 3.4, 1.0, palette.cream);
  for (let floor = 0; floor < 5; floor += 1) {
    const y = 4 + (floor * 2.8);
    for (let bay = -7; bay <= 7; bay += 3.5) {
      addBox(group, bay, y, 6.1, 1.6, 1.45, 0.28, palette.cream);
      addBox(group, bay, y - 0.2, 6.8, 2.0, 0.18, 1.4, palette.rail);
    }
  }
  addBox(group, 0, 18.2, 0, 12, 1.8, 9.5, palette.roof);
  addStreetTrees(group, -6.2, 3, 9.2);
}

function buildShopRow(group) {
  addBox(group, 0, 0, 0, 24, 14, 10, palette.stone);
  for (let bay = -9; bay <= 9; bay += 6) {
    addBox(group, bay, 0, 5.2, 4.6, 3.8, 0.8, palette.glass);
    addBox(group, bay, 3.5, 5.4, 5, 0.6, 0.7, palette.awning);
    addBox(group, bay, 4.3, 5.4, 4.5, 0.6, 0.35, palette.signage);
  }
  for (let floor = 0; floor < 3; floor += 1) {
    for (let bay = -9; bay <= 9; bay += 3) {
      addBox(group, bay, 5.3 + (floor * 2.7), 4.9, 1.4, 1.4, 0.25, palette.cream);
    }
  }
  addStreetTrees(group, -8.5, 4, 8.4);
}

function buildWarehouse(group) {
  addBox(group, 0, 0, 0, 26, 9, 18, palette.darkStone);
  addBox(group, 0, 9, 0, 24, 1.2, 16, palette.roof);
  for (let bay = -8; bay <= 8; bay += 8) {
    addBox(group, bay, 0, 9.2, 4.2, 4.2, 0.6, palette.concrete);
    addBox(group, bay, 0, -9.2, 4.2, 4.2, 0.6, palette.concrete);
  }
  addBox(group, -7, 10.2, -4, 4.5, 1.2, 3.5, palette.steel);
  addBox(group, 4, 10.2, 3, 6.0, 1.2, 4.0, palette.steel);
  addBox(group, 0, 0, 12.2, 28, 0.6, 0.8, palette.rail);
}

function buildTownhouseRow(group) {
  const colors = [palette.brick, palette.terracotta, 0x6b3a31, 0x9b6d4b];
  for (let index = 0; index < 4; index += 1) {
    const x = -9 + (index * 6);
    addBox(group, x, 0, 0, 5.2, 13.5, 8.5, colors[index % colors.length]);
    addBox(group, x, 0, 4.5, 2.0, 2.8, 1.0, palette.cream);
    addBox(group, x, 0, 5.2, 3.2, 0.4, 1.4, palette.stone);
    addBox(group, x, 1.2, 5.4, 3.5, 0.18, 2.0, palette.rail);
    for (let floor = 0; floor < 3; floor += 1) {
      addBox(group, x, 4 + (floor * 2.8), 4.4, 1.2, 1.5, 0.2, palette.cream);
    }
    addBox(group, x, 13.5, 0, 4.8, 1.1, 7.8, palette.roof);
  }
  addStreetTrees(group, -8.6, 4, 8.4);
}

function buildTransitStation(group) {
  addBox(group, 0, 0, 0, 20, 0.8, 16, palette.plaza);
  addBox(group, -5, 0, 0, 5, 2.4, 6, palette.concrete);
  addBox(group, 5, 0, 0, 5, 2.4, 6, palette.concrete);
  addBox(group, 0, 2.4, 0, 8, 0.5, 3.5, palette.roof);
  addBox(group, 0, 2.9, 0, 2.8, 0.4, 1.8, palette.neon);
  addBox(group, 0, -3.0, 0, 6, 6, 4, palette.darkStone);
  addBox(group, -3.8, 0, 6.4, 0.3, 2.4, 5.2, palette.rail);
  addBox(group, 3.8, 0, 6.4, 0.3, 2.4, 5.2, palette.rail);
  addStreetTrees(group, -6.5, 3, 10.4);
  addBox(group, 7.2, 0, -5.6, 2.2, 2.4, 2.2, palette.signage);
}

function buildCivicHall(group) {
  addBox(group, 0, 0, 0, 22, 12, 14, palette.cream);
  addBox(group, 0, 12, 0, 12, 2.5, 9, palette.roof);
  addBox(group, 0, 14.5, 0, 4.5, 2.2, 4.5, palette.gold);
  for (let x = -7.5; x <= 7.5; x += 3.0) {
    addCylinder(group, x, 0, 6.2, 0.42, 6.5, palette.stone, 8);
  }
  addBox(group, 0, 0, 7.3, 6, 5, 1.0, palette.glass);
  addBox(group, 0, 0, 10.4, 12, 0.6, 5.5, palette.plaza);
  addStreetTrees(group, -4.2, 2, 13.2);
}

const assetBuilders = {
  office_tower: buildOfficeTower,
  mixed_use_midrise: buildMixedUseMidrise,
  apartment_midrise: buildApartmentMidrise,
  shop_row: buildShopRow,
  warehouse: buildWarehouse,
  townhouse_row: buildTownhouseRow,
  transit_station: buildTransitStation,
  civic_hall: buildCivicHall,
};

function fitCameraToAsset(viewName = "hero") {
  if (!assetGroup) return;
  const bounds = new THREE.Box3().setFromObject(assetGroup);
  const size = bounds.getSize(new THREE.Vector3());
  const center = bounds.getCenter(new THREE.Vector3());
  const config = viewConfigs[viewName] || viewConfigs.hero;
  const radius = Math.max(size.x, size.y, size.z) * config.distanceFactor;
  const azimuth = THREE.MathUtils.degToRad(config.azimuthDeg);
  const elevation = THREE.MathUtils.degToRad(config.elevationDeg);
  camera.position.set(
    center.x + (Math.sin(azimuth) * Math.cos(elevation) * radius),
    center.y + (Math.sin(elevation) * radius),
    center.z + (Math.cos(azimuth) * Math.cos(elevation) * radius),
  );
  camera.lookAt(center.x, center.y + (size.y * 0.18), center.z);
  camera.updateProjectionMatrix();
}

function rebuildAsset(assetId) {
  previewReady = false;
  if (assetGroup) scene.remove(assetGroup);
  assetGroup = new THREE.Group();
  const builder = assetBuilders[assetId] || assetBuilders.office_tower;
  builder(assetGroup);
  scene.add(assetGroup);
  fitCameraToAsset(currentView);
  const picked = assetLibrary.find((entry) => entry.id === assetId);
  titleEl.textContent = picked?.label || assetId;
  currentAssetId = assetId;
  previewReady = true;
}

function animate() {
  requestAnimationFrame(animate);
  renderer.render(scene, camera);
}

async function loadAssetLibrary() {
  const response = await fetch("./asset-library.json");
  if (!response.ok) throw new Error(`asset library fetch failed: ${response.status}`);
  const payload = await response.json();
  assetLibrary = Array.isArray(payload.assets) ? payload.assets : [];
  assetSelectEl.innerHTML = "";
  for (const item of assetLibrary) {
    const option = document.createElement("option");
    option.value = item.id;
    option.textContent = item.label;
    assetSelectEl.appendChild(option);
  }
}

window.__assetPreviewCapture = {
  getState() {
    return {
      ready: previewReady,
      asset: currentAssetId,
      view: currentView,
    };
  },
  setAsset(assetId) {
    if (!assetId || assetId === currentAssetId) return this.getState();
    assetSelectEl.value = assetId;
    rebuildAsset(assetId);
    return this.getState();
  },
  setView(viewName) {
    currentView = viewConfigs[viewName] ? viewName : "hero";
    viewSelectEl.value = currentView;
    fitCameraToAsset(currentView);
    previewReady = true;
    return this.getState();
  },
};

assetSelectEl?.addEventListener("change", () => {
  rebuildAsset(assetSelectEl.value);
});

viewSelectEl?.addEventListener("change", () => {
  currentView = viewSelectEl.value;
  fitCameraToAsset(currentView);
});

window.addEventListener("resize", resizeRenderer);

if (shotMode) document.body.classList.add("screenshot-mode");

async function bootstrap() {
  resizeRenderer();
  await loadAssetLibrary();
  currentView = viewConfigs[currentView] ? currentView : "hero";
  viewSelectEl.value = currentView;
  const requestedAsset = params.get("asset") || assetLibrary[0]?.id || "office_tower";
  assetSelectEl.value = requestedAsset;
  rebuildAsset(requestedAsset);
  animate();
}

bootstrap().catch((error) => {
  console.error(error);
  titleEl.textContent = "Preview Error";
});
