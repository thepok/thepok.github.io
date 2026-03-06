import { WorldgenRuntime } from "./worldgen-runtime.js";

const DEFAULT_BLOCK_SIZE = 0.25;
const CHUNK_SIZE = 32;
const CHUNK_VOLUME = CHUNK_SIZE * CHUNK_SIZE * CHUNK_SIZE;
const MESH_MIN_HEIGHT = -32768;

const FACE_NORMALS = [
  [1, 0, 0],
  [-1, 0, 0],
  [0, 1, 0],
  [0, -1, 0],
  [0, 0, 1],
  [0, 0, -1],
];

const FACE_VERTS = [
  [[1, 0, 0], [1, 1, 0], [1, 1, 1], [1, 0, 1]],
  [[0, 0, 1], [0, 1, 1], [0, 1, 0], [0, 0, 0]],
  [[0, 1, 1], [1, 1, 1], [1, 1, 0], [0, 1, 0]],
  [[0, 0, 0], [1, 0, 0], [1, 0, 1], [0, 0, 1]],
  [[1, 0, 1], [1, 1, 1], [0, 1, 1], [0, 0, 1]],
  [[0, 0, 0], [0, 1, 0], [1, 1, 0], [1, 0, 0]],
];

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

let runtimePromise = null;

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

function decodeGeneratedChunkColors(colors, cx, cy, cz, blockSize = DEFAULT_BLOCK_SIZE) {
  if (!(colors instanceof Uint8Array) || colors.length !== CHUNK_VOLUME) {
    return emptyGeneratedMeshData();
  }

  const heights = new Int16Array(CHUNK_SIZE * CHUNK_SIZE);
  heights.fill(MESH_MIN_HEIGHT);
  const positions = [];
  const indices = [];
  const normals = [];
  const outColors = [];
  const faceXYZ = [];
  const faceIds = [];
  const baseX = cx * CHUNK_SIZE;
  const baseY = cy * CHUNK_SIZE;
  const baseZ = cz * CHUNK_SIZE;

  for (let lz = 0; lz < CHUNK_SIZE; lz += 1) {
    for (let ly = 0; ly < CHUNK_SIZE; ly += 1) {
      for (let lx = 0; lx < CHUNK_SIZE; lx += 1) {
        const idx = lx + (ly * CHUNK_SIZE) + (lz * CHUNK_SIZE * CHUNK_SIZE);
        const colorIndex = colors[idx] & 0xff;
        if (colorIndex === 0) continue;

        const heightIdx = lx + (lz * CHUNK_SIZE);
        const worldY = baseY + ly;
        if (worldY > heights[heightIdx]) heights[heightIdx] = worldY;

        const wx = baseX + lx;
        const wy = worldY;
        const wz = baseZ + lz;
        const rgb = paletteRgb[colorIndex] || paletteRgb[0];

        for (let face = 0; face < 6; face += 1) {
          const normal = FACE_NORMALS[face];
          const nx = lx + normal[0];
          const ny = ly + normal[1];
          const nz = lz + normal[2];
          const inChunk = nx >= 0 && nx < CHUNK_SIZE && ny >= 0 && ny < CHUNK_SIZE && nz >= 0 && nz < CHUNK_SIZE;
          if (inChunk) {
            const neighborIdx = nx + (ny * CHUNK_SIZE) + (nz * CHUNK_SIZE * CHUNK_SIZE);
            if ((colors[neighborIdx] & 0xff) !== 0) continue;
          }

          const base = positions.length / 3;
          for (const vertex of FACE_VERTS[face]) {
            positions.push(
              (wx + vertex[0]) * blockSize,
              (wy + vertex[1]) * blockSize,
              (wz + vertex[2]) * blockSize,
            );
            normals.push(normal[0], normal[1], normal[2]);
            outColors.push(rgb[0], rgb[1], rgb[2]);
          }

          indices.push(base, base + 1, base + 2, base, base + 2, base + 3);
          faceXYZ.push(wx, wy, wz);
          faceIds.push(face);
        }
      }
    }
  }

  return {
    rev: 0,
    nbrev: 0,
    positions: new Float32Array(positions),
    indices: new Uint32Array(indices),
    normals: new Int8Array(normals),
    colors: new Float32Array(outColors),
    faceXYZ: new Int32Array(faceXYZ),
    faceIds: new Uint8Array(faceIds),
    heights,
    quadCount: faceIds.length,
  };
}

async function ensureRuntime() {
  if (!runtimePromise) {
    runtimePromise = WorldgenRuntime.create();
  }
  return runtimePromise;
}

self.addEventListener("message", async (event) => {
  const message = event.data || {};
  if (message.type !== "generate_chunk_mesh") return;

  const jobId = message.jobId;
  try {
    const runtime = await ensureRuntime();
    const params = message.params || {};
    const colors = runtime.generateChunkColors(params);
    const meshData = decodeGeneratedChunkColors(
      colors,
      params.cx | 0,
      params.cy | 0,
      params.cz | 0,
      Number(params.blockSize) || DEFAULT_BLOCK_SIZE,
    );

    self.postMessage(
      {
        ok: true,
        jobId,
        meshData,
      },
      [
        meshData.positions.buffer,
        meshData.indices.buffer,
        meshData.normals.buffer,
        meshData.colors.buffer,
        meshData.faceXYZ.buffer,
        meshData.faceIds.buffer,
        meshData.heights.buffer,
      ],
    );
  } catch (error) {
    self.postMessage({
      ok: false,
      jobId,
      error: error instanceof Error ? error.message : String(error),
    });
  }
});
