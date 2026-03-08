import * as THREE from "./vendor/three.module.js";

const CHUNK_SIZE = 32;
const WORLD_NAME = "leonardos-world";
const params = new URLSearchParams(window.location.search);
const shotMode = (params.get("shot") || "").trim() === "1";

const canvas = document.getElementById("preview-canvas");
const titleEl = document.getElementById("preview-title");
const assetSelectEl = document.getElementById("asset-select");
const viewSelectEl = document.getElementById("view-select");

const scene = new THREE.Scene();
scene.background = new THREE.Color(0xd8ccb7);
scene.fog = new THREE.Fog(0xd8ccb7, 18, 120);

const camera = new THREE.PerspectiveCamera(58, 1, 0.05, 2000);
const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, powerPreference: "high-performance" });
renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.6));
renderer.outputColorSpace = THREE.SRGBColorSpace;

scene.add(new THREE.AmbientLight(0xf1e7d6, 0.95));
const keyLight = new THREE.DirectionalLight(0xfff2da, 1.08);
keyLight.position.set(14, 20, 10);
scene.add(keyLight);
const fillLight = new THREE.DirectionalLight(0xbad0ee, 0.45);
fillLight.position.set(-10, 16, -8);
scene.add(fillLight);

const ground = new THREE.Mesh(
  new THREE.PlaneGeometry(800, 800),
  new THREE.MeshBasicMaterial({ transparent: true, opacity: 0.0 }),
);
ground.rotation.x = -Math.PI / 2;
scene.add(ground);

const chunkMaterial = new THREE.MeshLambertMaterial({ vertexColors: true });

let assetLibrary = [];
let presetsByName = new Map();
let currentAssetId = "";
let currentView = params.get("view") || "hero";
let assetGroup = null;
let previewState = {
  ready: false,
  complete: false,
  asset: "",
  view: "",
  loaded: 0,
  target: 0,
};
let chunkWorkersPromise = null;

function resizeRenderer() {
  const rect = canvas.parentElement.getBoundingClientRect();
  renderer.setSize(rect.width, rect.height, false);
  camera.aspect = rect.width / Math.max(rect.height, 1);
  camera.updateProjectionMatrix();
}

function normalizePreset(entry) {
  if (!entry || typeof entry !== "object") return null;
  const name = typeof entry.name === "string" ? entry.name.trim() : "";
  if (!name) return null;
  const toInt = (value, fallback = 0) => {
    const parsed = Number(value);
    return Number.isFinite(parsed) ? Math.trunc(parsed) : fallback;
  };
  const rawSeed = entry.seed_u64 ?? entry.seed;
  const seed = typeof rawSeed === "string" ? rawSeed.trim() : String(Math.trunc(Number(rawSeed) || 0));
  return {
    name,
    kind: typeof entry.kind === "string" && entry.kind.trim() ? entry.kind.trim() : "terrain",
    seed,
    baseHeight: toInt(entry.base_height),
    hillAmp: toInt(entry.hill_amp),
    roughAmp: toInt(entry.rough_amp),
    biomeScale: toInt(entry.biome_scale, 64),
    caveScale: toInt(entry.cave_scale, 48),
    caveThreshold: toInt(entry.cave_threshold, 800),
    lifeScale: toInt(entry.life_scale, 1),
    blockSizeM: Number(entry.block_size_m) > 0 ? Number(entry.block_size_m) : 0.25,
  };
}

async function loadPresets() {
  const response = await fetch("./presets.json");
  if (!response.ok) throw new Error(`preset fetch failed: ${response.status}`);
  const payload = await response.json();
  const entries = Array.isArray(payload?.presets)
    ? payload.presets
    : Object.entries(payload || {}).map(([name, entry]) => ({ name, ...(entry || {}) }));
  presetsByName = new Map();
  for (const entry of entries) {
    const preset = normalizePreset(entry);
    if (preset) presetsByName.set(preset.name, preset);
  }
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

function fnv1a64(text) {
  let h = 0xcbf29ce484222325n;
  const enc = new TextEncoder();
  for (const byte of enc.encode(text)) {
    h ^= BigInt(byte);
    h = (h * 0x100000001b3n) & 0xffffffffffffffffn;
  }
  return h;
}

function deriveWorldSeed(worldName, presetSeed) {
  return (BigInt(presetSeed) ^ fnv1a64(worldName)) & 0xffffffffffffffffn;
}

function splitSeed(seed) {
  const value = BigInt.asUintN(64, BigInt(seed));
  return {
    lo: Number(value & 0xffffffffn) >>> 0,
    hi: Number((value >> 32n) & 0xffffffffn) >>> 0,
  };
}

function worldgenKindCode(kind) {
  return kind === "city" ? 1 : 0;
}

async function ensureChunkWorkers() {
  if (!chunkWorkersPromise) {
    const workerCount = Math.max(2, Math.min(4, (navigator.hardwareConcurrency || 4) - 1));
    chunkWorkersPromise = Promise.resolve(
      Array.from({ length: workerCount }, () => new Worker("./worldgen-worker.js?v=5", { type: "module" })),
    );
  }
  return chunkWorkersPromise;
}

async function generateChunkBatchOnWorker(worker, batchParams) {
  const jobId = `job-${Date.now()}-${Math.random().toString(16).slice(2)}`;
  return new Promise((resolve, reject) => {
    const onMessage = (event) => {
      const message = event.data || {};
      if (message.jobId !== jobId) return;
      worker.removeEventListener("message", onMessage);
      worker.removeEventListener("error", onError);
      if (message.ok) resolve(Array.isArray(message.results) ? message.results : []);
      else reject(new Error(message.error || "chunk worker failed"));
    };
    const onError = (event) => {
      worker.removeEventListener("message", onMessage);
      worker.removeEventListener("error", onError);
      reject(new Error(event?.message || "chunk worker crashed"));
    };
    worker.addEventListener("message", onMessage);
    worker.addEventListener("error", onError);
    worker.postMessage({ type: "generate_chunk_mesh_batch", jobId, batchParams });
  });
}

async function generateChunkBatch(batchParams) {
  const workers = await ensureChunkWorkers();
  const shards = workers.map(() => []);
  for (let index = 0; index < batchParams.length; index += 1) {
    shards[index % workers.length].push(batchParams[index]);
  }
  const jobs = [];
  for (let index = 0; index < workers.length; index += 1) {
    if (shards[index].length === 0) continue;
    jobs.push(generateChunkBatchOnWorker(workers[index], shards[index]));
  }
  const settled = await Promise.all(jobs);
  return settled.flat();
}

function buildChunkParams(asset) {
  const preset = presetsByName.get(asset.preset || "city");
  if (!preset) throw new Error(`unknown preset for asset ${asset.id}: ${asset.preset}`);
  const seed = deriveWorldSeed(WORLD_NAME, preset.seed);
  const parts = splitSeed(seed);
  const bounds = asset.chunkBounds;
  const batchParams = [];
  for (let cy = bounds.min[1]; cy <= bounds.max[1]; cy += 1) {
    for (let cz = bounds.min[2]; cz <= bounds.max[2]; cz += 1) {
      for (let cx = bounds.min[0]; cx <= bounds.max[0]; cx += 1) {
        batchParams.push({
          seedLo: parts.lo,
          seedHi: parts.hi,
          cx,
          cy,
          cz,
          kindCode: worldgenKindCode(preset.kind),
          baseHeight: preset.baseHeight,
          hillAmp: preset.hillAmp,
          roughAmp: preset.roughAmp,
          biomeScale: preset.biomeScale,
          caveScale: preset.caveScale,
          caveThreshold: preset.caveThreshold,
          lifeScale: preset.lifeScale,
          blockSize: preset.blockSizeM,
        });
      }
    }
  }
  return batchParams;
}

function buildChunkMesh(meshData) {
  if (!meshData?.positions?.length) return null;
  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute("position", new THREE.BufferAttribute(meshData.positions, 3));
  geometry.setAttribute("normal", new THREE.BufferAttribute(meshData.normals, 3, true));
  geometry.setAttribute("color", new THREE.BufferAttribute(meshData.colors, 3));
  geometry.setIndex(new THREE.BufferAttribute(meshData.indices, 1));
  geometry.computeBoundingSphere();
  return new THREE.Mesh(geometry, chunkMaterial);
}

function clearAssetGroup() {
  if (!assetGroup) return;
  for (const child of assetGroup.children) {
    if (child.geometry) child.geometry.dispose();
  }
  scene.remove(assetGroup);
  assetGroup = null;
}

function applyView(asset, viewName) {
  currentView = viewName;
  if (viewSelectEl) viewSelectEl.value = currentView;
  if (!assetGroup) return;
  const bounds = new THREE.Box3().setFromObject(assetGroup);
  const center = bounds.getCenter(new THREE.Vector3());
  const size = bounds.getSize(new THREE.Vector3());
  const target = new THREE.Vector3(center.x, bounds.min.y + (size.y * 0.24), center.z);
  const baseAzimuthDeg = Number(asset.baseAzimuthDeg) || -144;
  const viewConfig = {
    hero: { azimuthOffsetDeg: 0, elevationDeg: 6, distanceFactor: 1.12 },
    corner: { azimuthOffsetDeg: 74, elevationDeg: 12, distanceFactor: 1.02 },
    reverse: { azimuthOffsetDeg: 180, elevationDeg: 8, distanceFactor: 1.18 },
  }[viewName] || { azimuthOffsetDeg: 0, elevationDeg: 6, distanceFactor: 1.12 };
  const radius = Math.max(6, Math.max(size.x, size.y * 0.7, size.z) * viewConfig.distanceFactor);
  const azimuth = THREE.MathUtils.degToRad(baseAzimuthDeg + viewConfig.azimuthOffsetDeg);
  const elevation = THREE.MathUtils.degToRad(viewConfig.elevationDeg);
  camera.position.set(
    center.x + (Math.sin(azimuth) * Math.cos(elevation) * radius),
    target.y + (Math.sin(elevation) * radius),
    center.z + (Math.cos(azimuth) * Math.cos(elevation) * radius),
  );
  camera.lookAt(target);
  camera.updateProjectionMatrix();
}

async function rebuildAsset(assetId) {
  const asset = assetLibrary.find((entry) => entry.id === assetId);
  if (!asset) throw new Error(`unknown asset: ${assetId}`);
  previewState = { ready: false, complete: false, asset: assetId, view: currentView, loaded: 0, target: 0 };
  titleEl.textContent = asset.label;
  clearAssetGroup();
  assetGroup = new THREE.Group();
  scene.add(assetGroup);

  const batchParams = buildChunkParams(asset);
  previewState.target = batchParams.length;
  const results = await generateChunkBatch(batchParams);
  for (const item of results) {
    const mesh = buildChunkMesh(item.meshData);
    if (mesh) assetGroup.add(mesh);
    previewState.loaded += 1;
  }
  currentAssetId = assetId;
  applyView(asset, currentView);
  previewState = {
    ready: true,
    complete: true,
    asset: assetId,
    view: currentView,
    loaded: batchParams.length,
    target: batchParams.length,
  };
}

function animate() {
  requestAnimationFrame(animate);
  renderer.render(scene, camera);
}

window.__assetPreviewCapture = {
  getState() {
    return { ...previewState };
  },
  async setAsset(assetId) {
    if (!assetId) return this.getState();
    if (assetId !== currentAssetId) await rebuildAsset(assetId);
    return this.getState();
  },
  setView(viewName) {
    const asset = assetLibrary.find((entry) => entry.id === currentAssetId);
    currentView = asset?.views?.[viewName] ? viewName : "hero";
    if (asset) applyView(asset, currentView);
    previewState = { ...previewState, view: currentView, ready: true, complete: true };
    return this.getState();
  },
};

assetSelectEl?.addEventListener("change", () => {
  rebuildAsset(assetSelectEl.value).catch((error) => {
    console.error(error);
    titleEl.textContent = "Preview Error";
  });
});

viewSelectEl?.addEventListener("change", () => {
  window.__assetPreviewCapture.setView(viewSelectEl.value);
});

window.addEventListener("resize", resizeRenderer);

if (shotMode) document.body.classList.add("screenshot-mode");

async function bootstrap() {
  resizeRenderer();
  await Promise.all([loadPresets(), loadAssetLibrary()]);
  currentView = ["hero", "corner", "reverse"].includes(currentView) ? currentView : "hero";
  viewSelectEl.value = currentView;
  const requestedAsset = params.get("asset") || assetLibrary[0]?.id || "";
  assetSelectEl.value = requestedAsset;
  if (requestedAsset) await rebuildAsset(requestedAsset);
  animate();
}

bootstrap().catch((error) => {
  console.error(error);
  titleEl.textContent = "Preview Error";
});
