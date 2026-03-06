const CHUNK_SIZE = 32;
const CHUNK_VOLUME = CHUNK_SIZE * CHUNK_SIZE * CHUNK_SIZE;
const FNV64_OFFSET = 0xcbf29ce484222325n;
const FNV64_PRIME = 0x100000001b3n;

export function worldgenKindCode(kind) {
  return kind === "city" ? 1 : 0;
}

export function fnv1a64(text) {
  let h = FNV64_OFFSET;
  const enc = new TextEncoder();
  for (const byte of enc.encode(text)) {
    h ^= BigInt(byte);
    h = (h * FNV64_PRIME) & 0xffffffffffffffffn;
  }
  return h;
}

export function deriveWorldSeed(worldName, presetSeed) {
  return (BigInt(presetSeed) ^ fnv1a64(worldName)) & 0xffffffffffffffffn;
}

export function splitSeed(seed) {
  const value = BigInt.asUintN(64, BigInt(seed));
  const lo = Number(value & 0xffffffffn) >>> 0;
  const hi = Number((value >> 32n) & 0xffffffffn) >>> 0;
  return { lo, hi };
}

export class WorldgenRuntime {
  constructor(instance) {
    this.instance = instance;
    this.memory = instance.exports.memory;
    this.generateChunk = instance.exports.generate_chunk;
    this.bufferPtr = instance.exports.chunk_buffer_ptr;
    this.bufferLen = instance.exports.chunk_buffer_len;
  }

  static async create(wasmUrl = "./wasm/worldgen.wasm") {
    const response = await fetch(wasmUrl);
    if (!response.ok) {
      throw new Error(`Failed to fetch worldgen wasm: ${response.status}`);
    }
    const wasm = await response.arrayBuffer();
    const { instance } = await WebAssembly.instantiate(wasm, {});
    return new WorldgenRuntime(instance);
  }

  generateChunkColors(params) {
    const {
      seedLo,
      seedHi,
      cx,
      cy,
      cz,
      kindCode,
      baseHeight,
      hillAmp,
      roughAmp,
      biomeScale,
      caveScale,
      caveThreshold,
      lifeScale,
    } = params;

    this.generateChunk(
      seedLo >>> 0,
      seedHi >>> 0,
      cx | 0,
      cy | 0,
      cz | 0,
      kindCode | 0,
      baseHeight | 0,
      hillAmp | 0,
      roughAmp | 0,
      biomeScale | 0,
      caveScale | 0,
      caveThreshold | 0,
      lifeScale | 0,
    );

    const ptr = this.bufferPtr() >>> 0;
    const len = this.bufferLen() | 0;
    if (len !== CHUNK_VOLUME) {
      throw new Error(`Unexpected chunk buffer length: ${len}`);
    }

    const mem = new Uint8Array(this.memory.buffer, ptr, len);
    return Uint8Array.from(mem);
  }
}
