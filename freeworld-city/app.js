import * as THREE from "./vendor/three.module.js";
import { OrbitControls } from "./vendor/OrbitControls.js";

const DEFAULT_BLOCK_SIZE = 0.25;
const CHUNK_SIZE = 32;
const CHUNK_VOLUME = CHUNK_SIZE * CHUNK_SIZE * CHUNK_SIZE;
const WORLD_NAME = "leonardos-world";
const MESH_MIN_HEIGHT = -32768;
const IS_COARSE_POINTER = window.matchMedia && window.matchMedia("(pointer:coarse)").matches;
const MIN_VIEW_SCALE = 0.5;
const MAX_VIEW_SCALE = 10;
const DEFAULT_VIEW_SCALE = 0.75;
const CHUNK_FETCH_MAX_INFLIGHT = IS_COARSE_POINTER ? 4 : 6;
const GENERATED_WORKER_PHONE_COUNT = 2;
const GENERATED_WORKER_DESKTOP_COUNT = 4;
const SUPERCHUNK_SIZE = 2;
const GENERATED_INTERIOR_SPAWNS = {
  city: { x: 22, y: 5.8, z: 26, yawDeg: -144, pitchDeg: -12 },
  gigantic_caves: { x: -10.5, y: -4.0, z: -7.5, yawDeg: -54, pitchDeg: -9 },
};

const palette = [
  0xe9dec9, 0xd9593d, 0xf2994a, 0x2f8f83, 0x5f5d73, 0x2d4f8f, 0x6ea54b, 0x24211c,
  0xd98ab8, 0xc7efff, 0xffed98, 0xffffff,
  0x9c3b31, 0xc06b3e, 0xc9baa1, 0x58493f, 0x4f6d62, 0x46627a, 0x1d1f24, 0xd7d2c8,
  0xf4ead6, 0x6d2732, 0x4e6a3d, 0x23354a, 0x7e868d, 0x8db7a3, 0x73e0ff, 0xff5db1,
  0xf7c948, 0x7c4b2a, 0x8a6a4a, 0x3f5f35,
  0xe3b7ab, 0x2b6b57, 0xc89b3c, 0x6c586f, 0x9bc8c2, 0x162238, 0xbfc9d6, 0x313a46,
  0x4d7f73, 0xb88c2f, 0xd16f5c, 0x8c8fa6, 0xf8f5ee, 0x1f6a70, 0xa33c2e, 0x667248,
];
const paletteRgb = palette.map((hex) => [
  ((hex >> 16) & 0xff) / 255,
  ((hex >> 8) & 0xff) / 255,
  (hex & 0xff) / 255,
]);

const canvas = document.getElementById("world");
const flyToggleEl = document.getElementById("fly-toggle");
const settingsToggleEl = document.getElementById("settings-toggle");
const settingsPanelEl = document.getElementById("settings-panel");
const controlModeChipEl = document.getElementById("control-mode-chip");
const worldgenPresetEl = document.getElementById("worldgen-preset");
const objectFocusEl = document.getElementById("object-focus");
const viewScaleInputEl = document.getElementById("view-scale");
const viewScaleLabelEl = document.getElementById("view-scale-label");
const netStateEl = document.getElementById("net-state");
const loadedChunksEl = document.getElementById("loaded-chunks");
const doneChunksEl = document.getElementById("done-chunks");
const loadedBlocksEl = document.getElementById("loaded-blocks");
const summaryBuildingsEl = document.getElementById("summary-buildings");
const summaryFloorsEl = document.getElementById("summary-floors");
const summaryRoomsEl = document.getElementById("summary-rooms");
const summaryStationsEl = document.getElementById("summary-stations");
const validationStatusEl = document.getElementById("validation-status");
const validationErrorsEl = document.getElementById("validation-errors");
const validationWarningsEl = document.getElementById("validation-warnings");
const validationCopyEl = document.getElementById("validation-copy");
const queryParams = new URLSearchParams(window.location.search);
let focusObjectId = (queryParams.get("focus") || "").trim();

if (((queryParams.get("shot") || "").trim().toLowerCase()) === "1") {
  document.body.classList.add("screenshot-mode");
}

const scene = new THREE.Scene();
scene.background = new THREE.Color(0xd8ccb7);
scene.fog = new THREE.Fog(0xd8ccb7, 26, 180);

const camera = new THREE.PerspectiveCamera(68, 1, 0.05, 2000);
const renderer = new THREE.WebGLRenderer({
  canvas,
  antialias: !IS_COARSE_POINTER,
  powerPreference: "high-performance",
});
renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, IS_COARSE_POINTER ? 1.2 : 1.6));
renderer.outputColorSpace = THREE.SRGBColorSpace;

const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;
controls.dampingFactor = 0.08;
controls.screenSpacePanning = true;
controls.maxPolarAngle = Math.PI * 0.495;
controls.minDistance = 1.5;
controls.maxDistance = 120;

const clock = new THREE.Clock();
const lookDirection = new THREE.Vector3(0, 0, 1);
const moveDirection = new THREE.Vector3();
const moveRight = new THREE.Vector3();
const WORLD_UP = new THREE.Vector3(0, 1, 0);
const moveState = {
  forward: false,
  backward: false,
  left: false,
  right: false,
  up: false,
  down: false,
  fast: false,
};
let controlMode = "orbit";
let flyYaw = THREE.MathUtils.degToRad(-144);
let flyPitch = THREE.MathUtils.degToRad(-12);
let pointerLocked = false;

scene.add(new THREE.AmbientLight(0xf1e7d6, 0.9));
const keyLight = new THREE.DirectionalLight(0xfff2da, 1.08);
keyLight.position.set(14, 20, 10);
scene.add(keyLight);

const ground = new THREE.Mesh(
  new THREE.PlaneGeometry(600, 600),
  new THREE.MeshBasicMaterial({ transparent: true, opacity: 0.0 }),
);
ground.rotation.x = -Math.PI / 2;
scene.add(ground);

const chunkMaterial = new THREE.MeshLambertMaterial({ vertexColors: true });

const chunkMeshes = new Map();
const chunkLoaded = new Set();
const chunkQueued = new Set();
const chunkFetching = new Set();
const chunkFetchQueue = [];
const chunkHeightIndex = new Map();
const chunkColumnHeights = new Map();
const chunkQuadCounts = new Map();
const chunkRevisions = new Map();
let loadedQuadCount = 0;
let chunkFetchPumpScheduled = false;
let chunkBatchJobsInFlight = 0;
let chunkFetchEpoch = 1;
let generatedSpawnAppliedKey = "";
let lastCameraChunkKey = "";
let viewDistanceScale = DEFAULT_VIEW_SCALE;
let worldgenPreset = "";
let worldgenPresets = [];
let activeBlockSize = DEFAULT_BLOCK_SIZE;
let focusChunkBounds = null;
let inspectableObjects = [];

const worldgenPresetConfigs = new Map();
const worldgenPresetSeedParts = new Map();
const worldgenPresetHotspots = new Map();
let worldgenModule = null;
let worldgenModulePromise = null;
let generatedChunkWorkerPool = null;
let generatedChunkWorkerPoolPromise = null;
let generatedChunkWorkerPoolUnavailable = false;
let generatedChunkWorkerJobSeq = 1;

function chunkKey(cx, cy, cz) {
  return `${cx}:${cy}:${cz}`;
}

function parseChunkKey(key) {
  const [cx, cy, cz] = key.split(":").map(Number);
  return { cx, cy, cz };
}

function chunkColumnKey(cx, cz) {
  return `${cx}:${cz}`;
}

function chunkInFocusBounds(cx, cy, cz, padding = 0) {
  if (!focusChunkBounds) return true;
  return cx >= (focusChunkBounds.min[0] - padding)
    && cx <= (focusChunkBounds.max[0] + padding)
    && cy >= (focusChunkBounds.min[1] - padding)
    && cy <= (focusChunkBounds.max[1] + padding)
    && cz >= (focusChunkBounds.min[2] - padding)
    && cz <= (focusChunkBounds.max[2] + padding);
}

function chunkFromWorld(value) {
  return Math.floor(value / CHUNK_SIZE);
}

function localCoord(value) {
  return ((value % CHUNK_SIZE) + CHUNK_SIZE) % CHUNK_SIZE;
}

function getCameraChunkCoords() {
  return {
    cx: chunkFromWorld(camera.position.x / activeBlockSize),
    cy: chunkFromWorld(camera.position.y / activeBlockSize),
    cz: chunkFromWorld(camera.position.z / activeBlockSize),
  };
}

function chunkSpanMeters() {
  return CHUNK_SIZE * activeBlockSize;
}

function chunkRadiusForMeters(targetMeters, minimumChunks = 1) {
  const meters = Math.max(0.1, Number(targetMeters) || 0.1);
  return Math.max(minimumChunks, Math.ceil(meters / Math.max(0.001, chunkSpanMeters())));
}

function baseChunkRadiusXZ() {
  if (activeBlockSize <= 0.051) return chunkRadiusForMeters(IS_COARSE_POINTER ? 5.5 : 8.0, IS_COARSE_POINTER ? 3 : 4);
  return 2;
}

function baseChunkRadiusY() {
  if (activeBlockSize <= 0.051) return chunkRadiusForMeters(IS_COARSE_POINTER ? 2.8 : 4.2, 2);
  return 2;
}

function getChunkRadiusXZ() {
  return Math.max(1, Math.round(baseChunkRadiusXZ() * viewDistanceScale));
}

function getChunkRadiusY() {
  return Math.max(1, Math.round(baseChunkRadiusY() * viewDistanceScale));
}

function updateViewScaleLabel() {
  viewScaleLabelEl.textContent = `${viewDistanceScale.toFixed(2)}x`;
  scene.fog.near = 24 + ((viewDistanceScale - 1) * 20);
  scene.fog.far = 150 + ((viewDistanceScale - 1) * 80);
}

function detachChunkHeight(cKey) {
  const entry = chunkHeightIndex.get(cKey);
  if (!entry) return;
  const column = chunkColumnHeights.get(entry.columnKey);
  if (column) {
    column.delete(entry.cy);
    if (column.size === 0) chunkColumnHeights.delete(entry.columnKey);
  }
  chunkHeightIndex.delete(cKey);
}

function setChunkHeight(cKey, cx, cy, cz, heights) {
  detachChunkHeight(cKey);
  const colKey = chunkColumnKey(cx, cz);
  let byY = chunkColumnHeights.get(colKey);
  if (!byY) {
    byY = new Map();
    chunkColumnHeights.set(colKey, byY);
  }
  byY.set(cy, heights);
  chunkHeightIndex.set(cKey, { columnKey: colKey, cy });
}

function clearChunkVisual(cKey) {
  const oldQuads = chunkQuadCounts.get(cKey) || 0;
  if (oldQuads > 0) {
    loadedQuadCount = Math.max(0, loadedQuadCount - oldQuads);
  }
  chunkQuadCounts.delete(cKey);
  const mesh = chunkMeshes.get(cKey);
  if (!mesh) return;
  scene.remove(mesh);
  mesh.geometry.dispose();
  chunkMeshes.delete(cKey);
}

function clearChunkData(cKey) {
  clearChunkVisual(cKey);
  detachChunkHeight(cKey);
  chunkRevisions.delete(cKey);
}

function clearAllLoadedChunks() {
  for (const cKey of chunkMeshes.keys()) clearChunkData(cKey);
  chunkLoaded.clear();
  chunkQueued.clear();
  chunkFetching.clear();
  chunkFetchQueue.length = 0;
  chunkBatchJobsInFlight = 0;
  lastCameraChunkKey = "";
  updateStats();
}

function getVisibleChunkProgress() {
  const radiusXZ = getChunkRadiusXZ();
  const radiusY = getChunkRadiusY();
  const center = getCameraChunkCoords();
  const target = ((radiusXZ * 2) + 1) * ((radiusY * 2) + 1) * ((radiusXZ * 2) + 1);
  let done = 0;
  for (const cKey of chunkLoaded) {
    const { cx, cy, cz } = parseChunkKey(cKey);
    if (Math.abs(cx - center.cx) <= radiusXZ && Math.abs(cy - center.cy) <= radiusY && Math.abs(cz - center.cz) <= radiusXZ) {
      done += 1;
    }
  }
  return { done, target };
}

function updateStats() {
  loadedChunksEl.textContent = String(chunkLoaded.size);
  const progress = getVisibleChunkProgress();
  doneChunksEl.textContent = `${progress.done} / ${progress.target}`;
  loadedBlocksEl.textContent = String(Math.max(0, Math.round(loadedQuadCount / 6)));
}

function normalizeWorldgenPreset(entry) {
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
    blockSizeM: Number(entry.block_size_m) > 0 ? Number(entry.block_size_m) : DEFAULT_BLOCK_SIZE,
  };
}

function pickDefaultGeneratedPreset(candidates) {
  if (!Array.isArray(candidates) || candidates.length === 0) return "";
  if (candidates.includes("city")) return "city";
  return candidates[0];
}

function updateNetStateLabel(text = "") {
  netStateEl.textContent = text || (worldgenPreset ? `Generated Local: ${worldgenPreset}` : "Generated Local");
}

function syncQueryParams() {
  const params = new URLSearchParams(window.location.search);
  if (focusObjectId) params.set("focus", focusObjectId);
  else params.delete("focus");
  const next = `${window.location.pathname}?${params.toString()}`;
  window.history.replaceState({}, "", next);
}

function activeCityHotspot(label = "default_spawn") {
  const presetHotspots = worldgenPresetHotspots.get(worldgenPreset);
  if (presetHotspots && typeof presetHotspots === "object" && presetHotspots[label]) {
    return presetHotspots[label];
  }
  return null;
}

function updateControlModeUi() {
  if (controlModeChipEl) {
    controlModeChipEl.textContent = controlMode === "fly" ? "Mode: Fly" : "Mode: Orbit";
  }
  if (flyToggleEl) {
    flyToggleEl.textContent = controlMode === "fly" ? "Exit Fly Mode" : "Enter Fly Mode";
  }
}

async function ensureWorldgenModule() {
  if (worldgenModule) return worldgenModule;
  if (!worldgenModulePromise) {
    worldgenModulePromise = import("./worldgen-runtime.js").then((module) => {
      worldgenModule = module;
      return module;
    });
  }
  return worldgenModulePromise;
}

function seedPartsForPreset(presetConfig) {
  const existing = worldgenPresetSeedParts.get(presetConfig.name);
  if (existing) return existing;
  const seed = worldgenModule.deriveWorldSeed(WORLD_NAME, presetConfig.seed);
  const parts = worldgenModule.splitSeed(seed);
  worldgenPresetSeedParts.set(presetConfig.name, parts);
  return parts;
}

function desiredGeneratedWorkerCount() {
  const hardware = Math.max(1, Number(navigator.hardwareConcurrency) || 2);
  const reserve = IS_COARSE_POINTER ? 2 : 1;
  const available = Math.max(1, hardware - reserve);
  const cap = IS_COARSE_POINTER ? GENERATED_WORKER_PHONE_COUNT : GENERATED_WORKER_DESKTOP_COUNT;
  return Math.max(1, Math.min(cap, available));
}

function releaseWorkerSlot(pool, slot) {
  slot.busy = false;
  const waiter = pool.waiters.shift();
  if (!waiter) return;
  slot.busy = true;
  waiter.resolve(slot);
}

function teardownWorkerPool(error) {
  if (!generatedChunkWorkerPool) return;
  for (const slot of generatedChunkWorkerPool.slots) {
    try {
      slot.worker.terminate();
    } catch (_error) {
      // ignore worker termination errors
    }
    for (const pending of slot.pending.values()) {
      pending.reject(error);
    }
    slot.pending.clear();
  }
  generatedChunkWorkerPool = null;
}

async function ensureGeneratedChunkWorkerPool() {
  if (generatedChunkWorkerPool) return generatedChunkWorkerPool;
  if (generatedChunkWorkerPoolUnavailable) throw new Error("generated chunk worker pool unavailable");
  if (!generatedChunkWorkerPoolPromise) {
    generatedChunkWorkerPoolPromise = (async () => {
      const workerCount = desiredGeneratedWorkerCount();
      const slots = [];
      for (let index = 0; index < workerCount; index += 1) {
        const worker = new Worker("./worldgen-worker.js?v=5", { type: "module" });
        const slot = { worker, pending: new Map(), busy: false };
        worker.addEventListener("message", (event) => {
          const message = event.data || {};
          const pending = slot.pending.get(message.jobId);
          if (!pending) return;
          slot.pending.delete(message.jobId);
          releaseWorkerSlot(generatedChunkWorkerPool, slot);
          if (message.ok) pending.resolve(message.meshData ?? message.results);
          else pending.reject(new Error(message.error || "worker failed"));
        });
        worker.addEventListener("error", (event) => {
          generatedChunkWorkerPoolUnavailable = true;
          const reason = new Error(event?.message || "generated chunk worker crashed");
          teardownWorkerPool(reason);
        });
        slots.push(slot);
      }
      generatedChunkWorkerPool = { slots, waiters: [] };
      return generatedChunkWorkerPool;
    })().catch((error) => {
      generatedChunkWorkerPoolUnavailable = true;
      generatedChunkWorkerPoolPromise = null;
      throw error;
    });
  }
  return generatedChunkWorkerPoolPromise;
}

async function acquireWorkerSlot(pool) {
  const free = pool.slots.find((slot) => !slot.busy);
  if (free) {
    free.busy = true;
    return free;
  }
  return new Promise((resolve) => pool.waiters.push({ resolve }));
}

async function generateGeneratedChunkMeshWithWorkers(params) {
  const pool = await ensureGeneratedChunkWorkerPool();
  const slot = await acquireWorkerSlot(pool);
  const jobId = generatedChunkWorkerJobSeq++;
  return new Promise((resolve, reject) => {
    slot.pending.set(jobId, { resolve, reject });
    slot.worker.postMessage({ type: "generate_chunk_mesh", jobId, params });
  });
}

async function generateGeneratedChunkMeshesWithWorkers(batchParams) {
  const pool = await ensureGeneratedChunkWorkerPool();
  const slot = await acquireWorkerSlot(pool);
  const jobId = generatedChunkWorkerJobSeq++;
  return new Promise((resolve, reject) => {
    slot.pending.set(jobId, { resolve, reject });
    slot.worker.postMessage({ type: "generate_chunk_mesh_batch", jobId, batchParams });
  });
}

function emptyGeneratedMeshData() {
  const heights = new Int16Array(CHUNK_SIZE * CHUNK_SIZE);
  heights.fill(MESH_MIN_HEIGHT);
  return {
    rev: 0,
    nbrev: 0,
    positions: new Float32Array(0),
    indices: new Uint32Array(0),
    normals: new Int8Array(0),
    colors: new Float32Array(0),
    faceXYZ: new Int32Array(0),
    faceIds: new Uint8Array(0),
    heights,
    quadCount: 0,
  };
}

function decodeGeneratedChunkPayload(payload, cx, cy, cz, blockSize = activeBlockSize) {
  const blocks = Array.isArray(payload?.blocks) ? payload.blocks : [];
  if (blocks.length === 0) return emptyGeneratedMeshData();
  const filled = new Map();
  for (const entry of blocks) {
    if (!Array.isArray(entry) || entry.length < 3) continue;
    filled.set(Number(entry[0]), entry[2]);
  }

  const faceNormals = [
    [1, 0, 0], [-1, 0, 0], [0, 1, 0], [0, -1, 0], [0, 0, 1], [0, 0, -1],
  ];
  const faceVerts = [
    [[1, 0, 0], [1, 1, 0], [1, 1, 1], [1, 0, 1]],
    [[0, 0, 1], [0, 1, 1], [0, 1, 0], [0, 0, 0]],
    [[0, 1, 1], [1, 1, 1], [1, 1, 0], [0, 1, 0]],
    [[0, 0, 0], [1, 0, 0], [1, 0, 1], [0, 0, 1]],
    [[1, 0, 1], [1, 1, 1], [0, 1, 1], [0, 0, 1]],
    [[0, 0, 0], [0, 1, 0], [1, 1, 0], [1, 0, 0]],
  ];

  const heights = new Int16Array(CHUNK_SIZE * CHUNK_SIZE);
  heights.fill(MESH_MIN_HEIGHT);
  const positions = [];
  const indices = [];
  const normals = [];
  const colors = [];
  const faceXYZ = [];
  const faceIds = [];
  const baseX = cx * CHUNK_SIZE;
  const baseY = cy * CHUNK_SIZE;
  const baseZ = cz * CHUNK_SIZE;

  for (const [idx, faceColors] of filled) {
    const lx = idx % CHUNK_SIZE;
    const ly = Math.floor(idx / CHUNK_SIZE) % CHUNK_SIZE;
    const lz = Math.floor(idx / (CHUNK_SIZE * CHUNK_SIZE));
    const wx = baseX + lx;
    const wy = baseY + ly;
    const wz = baseZ + lz;
    const heightIdx = lx + (lz * CHUNK_SIZE);
    if (wy > heights[heightIdx]) heights[heightIdx] = wy;

    for (let face = 0; face < 6; face += 1) {
      const [nx, ny, nz] = faceNormals[face];
      const nlx = lx + nx;
      const nly = ly + ny;
      const nlz = lz + nz;
      if (nlx >= 0 && nlx < CHUNK_SIZE && nly >= 0 && nly < CHUNK_SIZE && nlz >= 0 && nlz < CHUNK_SIZE) {
        const neighborIdx = nlx + (nly * CHUNK_SIZE) + (nlz * CHUNK_SIZE * CHUNK_SIZE);
        if (filled.has(neighborIdx)) continue;
      }

      const colorIndex = Array.isArray(faceColors) ? (Number(faceColors[face]) & 0xff) : 1;
      const rgb = paletteRgb[colorIndex] || paletteRgb[0];
      const base = positions.length / 3;
      for (const vertex of faceVerts[face]) {
        positions.push((wx + vertex[0]) * blockSize, (wy + vertex[1]) * blockSize, (wz + vertex[2]) * blockSize);
        normals.push(nx, ny, nz);
        colors.push(rgb[0], rgb[1], rgb[2]);
      }
      indices.push(base, base + 1, base + 2, base, base + 2, base + 3);
      faceXYZ.push(wx, wy, wz);
      faceIds.push(face);
    }
  }

  return {
    rev: 0,
    nbrev: 0,
    positions: new Float32Array(positions),
    indices: new Uint32Array(indices),
    normals: new Int8Array(normals),
    colors: new Float32Array(colors),
    faceXYZ: new Int32Array(faceXYZ),
    faceIds: new Uint8Array(faceIds),
    heights,
    quadCount: faceIds.length,
  };
}

function applyChunkMesh(cx, cy, cz, meshData) {
  const cKey = chunkKey(cx, cy, cz);
  clearChunkData(cKey);
  setChunkHeight(cKey, cx, cy, cz, meshData.heights);
  chunkRevisions.set(cKey, `${meshData.rev}:${meshData.nbrev}`);
  chunkQuadCounts.set(cKey, meshData.quadCount || 0);
  loadedQuadCount += meshData.quadCount || 0;
  if (!meshData.positions.length) {
    updateStats();
    return;
  }

  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute("position", new THREE.BufferAttribute(meshData.positions, 3));
  geometry.setAttribute("normal", new THREE.BufferAttribute(meshData.normals, 3, true));
  geometry.setAttribute("color", new THREE.BufferAttribute(meshData.colors, 3));
  geometry.setIndex(new THREE.BufferAttribute(meshData.indices, 1));
  const mesh = new THREE.Mesh(geometry, chunkMaterial);
  mesh.matrixAutoUpdate = false;
  mesh.updateMatrix();
  scene.add(mesh);
  chunkMeshes.set(cKey, mesh);
  updateStats();
}

function chunkWithinRange(cx, cy, cz, padding = 0) {
  if (focusChunkBounds) return chunkInFocusBounds(cx, cy, cz, padding);
  const center = getCameraChunkCoords();
  return Math.abs(cx - center.cx) <= (getChunkRadiusXZ() + padding)
    && Math.abs(cz - center.cz) <= (getChunkRadiusXZ() + padding)
    && Math.abs(cy - center.cy) <= (getChunkRadiusY() + padding);
}

function useSuperchunkBatching() {
  return activeBlockSize <= 0.051;
}

function superchunkCoord(value) {
  return Math.floor(value / SUPERCHUNK_SIZE);
}

function superchunkKeyForChunk(cx, cy, cz) {
  return `${superchunkCoord(cx)}:${superchunkCoord(cy)}:${superchunkCoord(cz)}`;
}

function enqueueChunkFetch(cx, cy, cz, priority) {
  const cKey = chunkKey(cx, cy, cz);
  if (chunkFetching.has(cKey) || chunkLoaded.has(cKey) || chunkQueued.has(cKey)) return;
  chunkQueued.add(cKey);
  chunkFetchQueue.push({ cx, cy, cz, cKey, priority });
}

function scheduleChunkFetchPump() {
  if (chunkFetchPumpScheduled) return;
  chunkFetchPumpScheduled = true;
  queueMicrotask(() => {
    chunkFetchPumpScheduled = false;
    void pumpChunkFetchQueue();
  });
}

async function fetchChunkNow(cx, cy, cz, cKey, epoch) {
  try {
    const presetConfig = worldgenPresetConfigs.get(worldgenPreset);
    if (!presetConfig) throw new Error("unknown preset");
    await ensureWorldgenModule();
    if (epoch !== chunkFetchEpoch) return;
    const seedParts = seedPartsForPreset(presetConfig);

    let meshData = null;
    if (!generatedChunkWorkerPoolUnavailable) {
      try {
        meshData = await generateGeneratedChunkMeshWithWorkers({
          seedLo: seedParts.lo,
          seedHi: seedParts.hi,
          cx,
          cy,
          cz,
          kindCode: worldgenModule.worldgenKindCode(presetConfig.kind),
          baseHeight: presetConfig.baseHeight,
          hillAmp: presetConfig.hillAmp,
          roughAmp: presetConfig.roughAmp,
          biomeScale: presetConfig.biomeScale,
          caveScale: presetConfig.caveScale,
          caveThreshold: presetConfig.caveThreshold,
          lifeScale: presetConfig.lifeScale,
          blockSize: presetConfig.blockSizeM,
        });
      } catch (_error) {
        generatedChunkWorkerPoolUnavailable = true;
        teardownWorkerPool(new Error("generated chunk worker pool unavailable"));
      }
    }

    if (!meshData) throw new Error("generated chunk worker unavailable");

    if (epoch !== chunkFetchEpoch) return;
    if (!chunkWithinRange(cx, cy, cz, 1)) return;
    applyChunkMesh(cx, cy, cz, meshData);
    chunkLoaded.add(cKey);
  } catch (_error) {
    console.error("chunk generation failed", _error);
    updateNetStateLabel("Chunk generation failed");
    chunkLoaded.delete(cKey);
  } finally {
    chunkBatchJobsInFlight = Math.max(0, chunkBatchJobsInFlight - 1);
    chunkFetching.delete(cKey);
    if (chunkFetchQueue.length) scheduleChunkFetchPump();
  }
}

async function fetchChunkBatchNow(batch, epoch) {
  if (!Array.isArray(batch) || batch.length === 0) return;
  if (batch.length === 1) {
    const single = batch[0];
    await fetchChunkNow(single.cx, single.cy, single.cz, single.cKey, epoch);
    return;
  }

  try {
    const presetConfig = worldgenPresetConfigs.get(worldgenPreset);
    if (!presetConfig) throw new Error("unknown preset");
    await ensureWorldgenModule();
    if (epoch !== chunkFetchEpoch) return;
    const seedParts = seedPartsForPreset(presetConfig);

    const batchParams = batch.map(({ cx, cy, cz }) => ({
      seedLo: seedParts.lo,
      seedHi: seedParts.hi,
      cx,
      cy,
      cz,
      kindCode: worldgenModule.worldgenKindCode(presetConfig.kind),
      baseHeight: presetConfig.baseHeight,
      hillAmp: presetConfig.hillAmp,
      roughAmp: presetConfig.roughAmp,
      biomeScale: presetConfig.biomeScale,
      caveScale: presetConfig.caveScale,
      caveThreshold: presetConfig.caveThreshold,
      lifeScale: presetConfig.lifeScale,
      blockSize: presetConfig.blockSizeM,
    }));

    const results = await generateGeneratedChunkMeshesWithWorkers(batchParams);
    const byKey = new Map();
    for (const result of (Array.isArray(results) ? results : [])) {
      const key = chunkKey(result.cx, result.cy, result.cz);
      byKey.set(key, result.meshData);
    }

    for (const entry of batch) {
      if (epoch !== chunkFetchEpoch) break;
      if (!chunkWithinRange(entry.cx, entry.cy, entry.cz, 1)) continue;
      const meshData = byKey.get(entry.cKey);
      if (!meshData) continue;
      applyChunkMesh(entry.cx, entry.cy, entry.cz, meshData);
      chunkLoaded.add(entry.cKey);
    }
  } catch (error) {
    console.error("superchunk generation failed", error);
    updateNetStateLabel("Superchunk generation failed");
    for (const entry of batch) chunkLoaded.delete(entry.cKey);
  } finally {
    chunkBatchJobsInFlight = Math.max(0, chunkBatchJobsInFlight - 1);
    for (const entry of batch) chunkFetching.delete(entry.cKey);
    if (chunkFetchQueue.length) scheduleChunkFetchPump();
  }
}

async function pumpChunkFetchQueue() {
  if (!chunkFetchQueue.length) return;
  chunkFetchQueue.sort((a, b) => a.priority - b.priority);
  while (chunkFetchQueue.length && chunkBatchJobsInFlight < CHUNK_FETCH_MAX_INFLIGHT) {
    const next = chunkFetchQueue.shift();
    chunkQueued.delete(next.cKey);
    if (!chunkWithinRange(next.cx, next.cy, next.cz, 1)) continue;
    const batch = [next];
    if (useSuperchunkBatching()) {
      const targetSuperchunkKey = superchunkKeyForChunk(next.cx, next.cy, next.cz);
      for (let index = chunkFetchQueue.length - 1; index >= 0; index -= 1) {
        const candidate = chunkFetchQueue[index];
        if (superchunkKeyForChunk(candidate.cx, candidate.cy, candidate.cz) !== targetSuperchunkKey) continue;
        if (!chunkWithinRange(candidate.cx, candidate.cy, candidate.cz, 1)) continue;
        batch.push(candidate);
        chunkQueued.delete(candidate.cKey);
        chunkFetchQueue.splice(index, 1);
      }
    }
    for (const entry of batch) chunkFetching.add(entry.cKey);
    chunkBatchJobsInFlight += 1;
    void fetchChunkBatchNow(batch, chunkFetchEpoch);
  }
}

function pruneFarChunks() {
  const keep = new Set();
  for (const cKey of chunkMeshes.keys()) {
    const { cx, cy, cz } = parseChunkKey(cKey);
    if (chunkWithinRange(cx, cy, cz, 1)) {
      keep.add(cKey);
      continue;
    }
    clearChunkData(cKey);
    chunkLoaded.delete(cKey);
  }
  updateStats();
}

function fetchVisibleChunks(force = false) {
  if (focusChunkBounds) {
    for (let cy = focusChunkBounds.min[1]; cy <= focusChunkBounds.max[1]; cy += 1) {
      for (let cz = focusChunkBounds.min[2]; cz <= focusChunkBounds.max[2]; cz += 1) {
        for (let cx = focusChunkBounds.min[0]; cx <= focusChunkBounds.max[0]; cx += 1) {
          enqueueChunkFetch(cx, cy, cz, 0);
        }
      }
    }
    scheduleChunkFetchPump();
    updateStats();
    return;
  }
  const center = getCameraChunkCoords();
  const centerKey = chunkKey(center.cx, center.cy, center.cz);
  if (!force && centerKey === lastCameraChunkKey) return;
  lastCameraChunkKey = centerKey;
  const radiusXZ = getChunkRadiusXZ();
  const radiusY = getChunkRadiusY();
  for (let cy = center.cy - radiusY; cy <= center.cy + radiusY; cy += 1) {
    for (let cz = center.cz - radiusXZ; cz <= center.cz + radiusXZ; cz += 1) {
      for (let cx = center.cx - radiusXZ; cx <= center.cx + radiusXZ; cx += 1) {
        const dx = cx - center.cx;
        const dy = cy - center.cy;
        const dz = cz - center.cz;
        enqueueChunkFetch(cx, cy, cz, (dx * dx) + (dy * dy * 1.3) + (dz * dz));
      }
    }
  }
  scheduleChunkFetchPump();
  updateStats();
}

function updateLookTarget() {
  const cosPitch = Math.cos(flyPitch);
  lookDirection.set(
    Math.sin(flyYaw) * cosPitch,
    Math.sin(flyPitch),
    Math.cos(flyYaw) * cosPitch,
  ).normalize();
  const tx = camera.position.x + lookDirection.x;
  const ty = camera.position.y + lookDirection.y;
  const tz = camera.position.z + lookDirection.z;
  controls.target.set(tx, ty, tz);
  if (controlMode === "orbit") controls.update();
}

function syncFlyAnglesFromView() {
  const offset = controls.target.clone().sub(camera.position);
  if (offset.lengthSq() <= 1e-8) return;
  offset.normalize();
  flyPitch = THREE.MathUtils.clamp(Math.asin(offset.y), -1.42, 1.42);
  flyYaw = Math.atan2(offset.x, offset.z);
}

function applyCameraOrientation(yawDeg, pitchDeg) {
  flyYaw = THREE.MathUtils.degToRad(Number(yawDeg) || 0);
  flyPitch = THREE.MathUtils.clamp(THREE.MathUtils.degToRad(Number(pitchDeg) || 0), -1.42, 1.42);
  updateLookTarget();
}

function setControlMode(nextMode) {
  controlMode = nextMode === "fly" ? "fly" : "orbit";
  controls.enabled = controlMode === "orbit";
  if (controlMode === "orbit") {
    if (document.pointerLockElement === canvas) document.exitPointerLock();
    syncFlyAnglesFromView();
  } else {
    updateLookTarget();
  }
  updateControlModeUi();
}

function handlePointerLockChange() {
  pointerLocked = document.pointerLockElement === canvas;
  if (!pointerLocked && controlMode === "fly") {
    setControlMode("orbit");
  }
}

function handleFlyMouseMove(event) {
  if (controlMode !== "fly" || !pointerLocked) return;
  flyYaw -= event.movementX * 0.0024;
  flyPitch = THREE.MathUtils.clamp(flyPitch - (event.movementY * 0.0024), -1.42, 1.42);
  updateLookTarget();
}

function requestFlyMode() {
  setControlMode("fly");
  if (!IS_COARSE_POINTER && document.pointerLockElement !== canvas && canvas.requestPointerLock) {
    canvas.requestPointerLock();
  }
}

function setMoveKey(code, pressed) {
  switch (code) {
    case "KeyW": moveState.forward = pressed; break;
    case "KeyS": moveState.backward = pressed; break;
    case "KeyA": moveState.left = pressed; break;
    case "KeyD": moveState.right = pressed; break;
    case "Space": moveState.up = pressed; break;
    case "ShiftLeft":
    case "ShiftRight": moveState.down = pressed; break;
    case "ControlLeft":
    case "ControlRight": moveState.fast = pressed; break;
    case "KeyQ": moveState.down = pressed; break;
    case "KeyE": moveState.up = pressed; break;
    default: return false;
  }
  return true;
}

function clearMoveState() {
  for (const key of Object.keys(moveState)) moveState[key] = false;
}

function updateFlyMovement(deltaSec) {
  if (controlMode !== "fly") return;
  moveDirection.set(0, 0, 0);
  const forwardFlat = lookDirection.clone();
  const hasVerticalIntent = moveState.up || moveState.down;
  if (!hasVerticalIntent) forwardFlat.y = 0;
  if (forwardFlat.lengthSq() > 1e-6) forwardFlat.normalize();
  moveRight.crossVectors(WORLD_UP, forwardFlat.lengthSq() > 1e-6 ? forwardFlat : lookDirection).normalize();
  if (moveState.forward) moveDirection.add(forwardFlat.lengthSq() > 1e-6 ? forwardFlat : lookDirection);
  if (moveState.backward) moveDirection.sub(forwardFlat.lengthSq() > 1e-6 ? forwardFlat : lookDirection);
  if (moveState.right) moveDirection.add(moveRight);
  if (moveState.left) moveDirection.sub(moveRight);
  if (moveState.up) moveDirection.y += 1;
  if (moveState.down) moveDirection.y -= 1;
  if (moveDirection.lengthSq() <= 1e-6) return;
  moveDirection.normalize();
  const speed = moveState.fast ? 18 : 8;
  camera.position.addScaledVector(moveDirection, deltaSec * speed);
  updateLookTarget();
}

function applyGeneratedSpawn(force = false) {
  if (focusObjectId) return false;
  const spawn = activeCityHotspot("default_spawn") || GENERATED_INTERIOR_SPAWNS[worldgenPreset];
  if (!spawn) return false;
  const spawnKey = `generated:${worldgenPreset}`;
  if (!force && generatedSpawnAppliedKey === spawnKey) return false;
  camera.position.set(spawn.x, spawn.y, spawn.z);
  applyCameraOrientation(spawn.yawDeg, spawn.pitchDeg);
  generatedSpawnAppliedKey = spawnKey;
  return true;
}

async function loadSemanticData() {
  worldgenPresetHotspots.delete(worldgenPreset);
  focusChunkBounds = null;
  inspectableObjects = [];
  focusObjectId = "";
  if (objectFocusEl) {
    objectFocusEl.innerHTML = '<option value="">Whole City</option>';
    objectFocusEl.value = "";
    objectFocusEl.disabled = true;
  }
  summaryBuildingsEl.textContent = "-";
  summaryFloorsEl.textContent = "-";
  summaryRoomsEl.textContent = "-";
  summaryStationsEl.textContent = "-";
  validationStatusEl.textContent = "local";
  validationErrorsEl.textContent = "-";
  validationWarningsEl.textContent = "-";
  validationCopyEl.textContent = "Static build active. Semantic metadata and validation endpoints are disabled.";
}

async function loadWorldgenPresets() {
  updateNetStateLabel("Loading presets...");
  const response = await fetch("./presets.json");
  if (!response.ok) throw new Error(`preset fetch failed: ${response.status}`);
  const payload = await response.json();
  const presets = Object.entries(payload || {}).map(([name, value]) => ({ name, ...(value || {}) }));
  worldgenPresetConfigs.clear();
  worldgenPresetSeedParts.clear();
  worldgenPresetEl.innerHTML = "";
  for (const raw of presets) {
    const entry = normalizeWorldgenPreset(raw);
    if (!entry) continue;
    worldgenPresetConfigs.set(entry.name, entry);
    const option = document.createElement("option");
    option.value = entry.name;
    option.textContent = entry.name;
    worldgenPresetEl.appendChild(option);
  }
  worldgenPresets = [...worldgenPresetConfigs.keys()];
  worldgenPreset = pickDefaultGeneratedPreset(worldgenPresets);
  worldgenPresetEl.disabled = false;
  worldgenPresetEl.value = worldgenPreset;
  updateNetStateLabel();
  await loadSemanticData();
}

async function setWorldgenPreset(nextPreset) {
  if (!nextPreset || !worldgenPresetConfigs.has(nextPreset)) return;
  worldgenPreset = nextPreset;
  activeBlockSize = worldgenPresetConfigs.get(worldgenPreset)?.blockSizeM || DEFAULT_BLOCK_SIZE;
  worldgenPresetEl.value = worldgenPreset;
  worldgenPresetSeedParts.clear();
  chunkFetchEpoch += 1;
  clearAllLoadedChunks();
  await loadSemanticData();
  if (!focusObjectId) applyGeneratedSpawn(true);
  fetchVisibleChunks(true);
  updateNetStateLabel();
}

async function setFocusObject(nextObjectId = "") {
  focusObjectId = "";
  if (objectFocusEl) objectFocusEl.value = "";
  syncQueryParams();
}

function resizeRenderer() {
  const viewport = canvas.parentElement.getBoundingClientRect();
  renderer.setSize(viewport.width, viewport.height, false);
  camera.aspect = viewport.width / Math.max(viewport.height, 1);
  camera.updateProjectionMatrix();
}

function animate() {
  requestAnimationFrame(animate);
  const deltaSec = Math.min(clock.getDelta(), 0.05);
  if (controlMode === "orbit") {
    controls.update();
    syncFlyAnglesFromView();
  } else {
    updateFlyMovement(deltaSec);
  }
  fetchVisibleChunks();
  pruneFarChunks();
  renderer.render(scene, camera);
}

flyToggleEl?.addEventListener("click", () => {
  if (controlMode === "fly") setControlMode("orbit");
  else requestFlyMode();
});

settingsToggleEl?.addEventListener("click", () => {
  const hidden = settingsPanelEl.hasAttribute("hidden");
  if (hidden) settingsPanelEl.removeAttribute("hidden");
  else settingsPanelEl.setAttribute("hidden", "");
});

worldgenPresetEl?.addEventListener("change", async () => {
  await setWorldgenPreset(worldgenPresetEl.value);
});

objectFocusEl?.addEventListener("change", async () => {
  await setFocusObject(objectFocusEl.value);
});

viewScaleInputEl?.addEventListener("input", () => {
  const next = Math.max(MIN_VIEW_SCALE, Math.min(MAX_VIEW_SCALE, Number(viewScaleInputEl.value) || DEFAULT_VIEW_SCALE));
  viewDistanceScale = next;
  updateViewScaleLabel();
  fetchVisibleChunks(true);
  pruneFarChunks();
});

window.addEventListener("resize", resizeRenderer);
window.addEventListener("blur", () => {
  clearMoveState();
});
document.addEventListener("pointerlockchange", handlePointerLockChange);
document.addEventListener("mousemove", handleFlyMouseMove);
window.addEventListener("keydown", (event) => {
  if (event.code === "KeyF") {
    event.preventDefault();
    if (controlMode === "fly") setControlMode("orbit");
    else requestFlyMode();
    return;
  }
  if (event.code === "Escape" && controlMode === "fly") {
    clearMoveState();
    setControlMode("orbit");
    return;
  }
  if (controlMode !== "fly") return;
  if (setMoveKey(event.code, true)) {
    event.preventDefault();
  }
});
window.addEventListener("keyup", (event) => {
  if (setMoveKey(event.code, false)) {
    event.preventDefault();
  }
});
canvas.addEventListener("click", () => {
  if (controlMode === "fly" && !pointerLocked && !IS_COARSE_POINTER) {
    canvas.requestPointerLock?.();
  }
});

window.__lwCapture = {
  setWorldSource(_mode) {
    return this.stats();
  },
  async setPreset(name) {
    await setWorldgenPreset(typeof name === "string" ? name : worldgenPreset);
    return this.stats();
  },
  setViewScale(scale) {
    viewDistanceScale = Math.max(MIN_VIEW_SCALE, Math.min(MAX_VIEW_SCALE, Number(scale) || DEFAULT_VIEW_SCALE));
    viewScaleInputEl.value = String(viewDistanceScale);
    updateViewScaleLabel();
    fetchVisibleChunks(true);
    pruneFarChunks();
    return this.stats();
  },
  setCamera(config = {}) {
    const x = Number(config.x);
    const y = Number(config.y);
    const z = Number(config.z);
    if (Number.isFinite(x) && Number.isFinite(y) && Number.isFinite(z)) {
      camera.position.set(x, y, z);
    }
    if (Number.isFinite(Number(config.fov))) {
      camera.fov = THREE.MathUtils.clamp(Number(config.fov), 38, 118);
      camera.updateProjectionMatrix();
    }
    applyCameraOrientation(config.yawDeg, config.pitchDeg);
    setControlMode("orbit");
    fetchVisibleChunks(true);
    return this.stats();
  },
  stats() {
    const progress = getVisibleChunkProgress();
    return {
      preset: worldgenPreset,
      loaded: chunkLoaded.size,
      done: progress.done,
      total: progress.target,
      position: {
        x: camera.position.x,
        y: camera.position.y,
        z: camera.position.z,
      },
    };
  },
};

async function bootstrap() {
  updateViewScaleLabel();
  viewScaleInputEl.value = String(DEFAULT_VIEW_SCALE);
  resizeRenderer();
  await ensureWorldgenModule();
  await loadWorldgenPresets();
  activeBlockSize = worldgenPresetConfigs.get(worldgenPreset)?.blockSizeM || DEFAULT_BLOCK_SIZE;
  if (!focusObjectId) applyGeneratedSpawn(true);
  updateControlModeUi();
  fetchVisibleChunks(true);
  animate();
}

bootstrap().catch((error) => {
  console.error(error);
  updateNetStateLabel("Viewer init error");
});
