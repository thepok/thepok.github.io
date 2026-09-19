// src/catalog.ts
var ends = [[0, 0, 0], [4, 0, 0]];
var deckPorts = [[0, 0, -2], [0, 0, 0], [0, 0, 2], [4, 0, -2], [4, 0, 0], [4, 0, 2], [2, 0, -2], [2, 0, 2], [2, 0, 0]];
var PARTS = {
  deck: { name: "Road deck", detail: "4 \xD7 4 m \xB7 reinforced steel", cost: 1200, mass: 1800, force: 1e5, torque: 85e3, color: "#65757a", icon: "route", ports: deckPorts, segments: [{ center: [2, -0.22, 0], size: [4, 0.44, 4] }] },
  girder: { name: "Steel girder", detail: "4 m \xB7 moment connection", cost: 420, mass: 400, force: 26e4, torque: 32e4, color: "#e4bb64", icon: "minus", ports: ends, segments: [{ center: [2, 0, 0], size: [4, 0.34, 0.3] }] },
  truss: { name: "Truss frame", detail: "4 \xD7 4 m \xB7 braced module", cost: 950, mass: 850, force: 44e4, torque: 68e4, color: "#e9b650", icon: "triangle", ports: [[0, 0, 0], [4, 0, 0], [0, 4, 0], [4, 4, 0]], segments: [{ center: [2, 0, 0], size: [4, 0.24, 0.24] }, { center: [2, 4, 0], size: [4, 0.24, 0.24] }, { center: [0, 2, 0], size: [0.24, 4, 0.24] }, { center: [4, 2, 0], size: [0.24, 4, 0.24] }, { center: [2, 2, 0], size: [Math.sqrt(32), 0.2, 0.2], tilt: Math.PI / 4 }] },
  column: { name: "Concrete column", detail: "4 m \xB7 high compression", cost: 650, mass: 1200, force: 4e5, torque: 21e4, color: "#b4b5ad", icon: "columns-2", ports: [[0, 0, 0], [0, 4, 0]], segments: [{ center: [0, 2, 0], size: [0.65, 4, 0.65] }] },
  brace: { name: "Diagonal brace", detail: "4 \xD7 4 m \xB7 lateral support", cost: 360, mass: 340, force: 28e4, torque: 24e4, color: "#cd9760", icon: "move-up-right", ports: [[0, 0, 0], [4, 4, 0]], segments: [{ center: [2, 2, 0], size: [Math.sqrt(32), 0.26, 0.26], tilt: Math.PI / 4 }] },
  slab: { name: "Floor slab", detail: "4 \xD7 4 m \xB7 reinforced concrete", cost: 900, mass: 2300, force: 23e4, torque: 19e4, color: "#b2bbb4", icon: "layers", ports: deckPorts, segments: [{ center: [2, -0.22, 0], size: [4, 0.44, 4] }] },
  wall: { name: "Retaining wall", detail: "4 \xD7 4 m \xB7 reinforced panel", cost: 1100, mass: 3800, force: 49e4, torque: 45e4, color: "#aaafa7", icon: "brick-wall", ports: [[0, 0, 0], [2, 0, 0], [4, 0, 0], [0, 4, 0], [2, 4, 0], [4, 4, 0]], segments: [{ center: [2, 2, 0], size: [4, 4, 0.55] }] },
  foundation: { name: "Foundation", detail: "4 \xD7 4 m \xB7 anchored at ground", cost: 1500, mass: 6500, force: 85e4, torque: 95e4, color: "#8c9993", icon: "box", ports: deckPorts, segments: [{ center: [2, -0.3, 0], size: [4, 0.6, 4] }] },
  facade: { name: "Glasfassade", detail: "4 \xD7 4 m \xB7 Verglasung im Metallrahmen", cost: 700, mass: 650, force: 95e3, torque: 8e4, color: "#80b5c8", icon: "panels-top-left", ports: [[0, 0, 0], [2, 0, 0], [4, 0, 0], [0, 4, 0], [2, 4, 0], [4, 4, 0]], segments: [{ center: [2, 2, 0], size: [3.84, 3.84, 0.08] }, { center: [0, 2, 0], size: [0.14, 4, 0.18] }, { center: [4, 2, 0], size: [0.14, 4, 0.18] }, { center: [2, 0, 0], size: [4, 0.14, 0.18] }, { center: [2, 4, 0], size: [4, 0.14, 0.18] }, { center: [2, 2, 0], size: [0.09, 4, 0.14] }, { center: [2, 2, 0], size: [4, 0.09, 0.14] }] },
  doorway: { name: "Walkable doorway", detail: "1.2 m clear opening \xB7 2.4 m head height", cost: 820, mass: 2200, force: 49e4, torque: 45e4, color: "#b68a5b", icon: "door-open", ports: [[0, 0, 0], [4, 0, 0], [0, 4, 0], [4, 4, 0]], segments: [{ center: [0.7, 2, 0], size: [1.4, 4, 0.55] }, { center: [3.3, 2, 0], size: [1.4, 4, 0.55] }, { center: [2, 3.2, 0], size: [1.2, 1.6, 0.55] }] },
  stairwell: { name: "Stairwell opening", detail: "4 \xD7 4 m floor module \xB7 2.8 m clear shaft", cost: 760, mass: 1450, force: 28e4, torque: 24e4, color: "#9aa69e", icon: "square-dashed", ports: deckPorts, segments: [{ center: [2, -0.22, -1.55], size: [4, 0.44, 0.5] }, { center: [2, -0.22, 1.55], size: [4, 0.44, 0.5] }] },
  core: { name: "Reinforced concrete core", detail: "4 \xD7 4 m hollow elevator and stair shaft \xB7 walkable entrance", cost: 4200, mass: 12800, force: 18e5, torque: 145e4, color: "#7f8e89", icon: "building-2", ports: [[0, 0, 0], [4, 0, 0], [0, 4, 0], [4, 4, 0], [0, 0, 4], [4, 0, 4], [0, 4, 4], [4, 4, 4], [2, 0, 0], [2, 4, 0], [0, 2, 0], [4, 2, 0]], segments: [{ center: [2, 2, 3.6], size: [4, 4, 0.8] }, { center: [0, 2, 3.7], size: [0.8, 4, 0.6] }, { center: [4.25, 2, 2], size: [0.5, 4, 4] }, { center: [0.7, 2, 0], size: [1.4, 4, 0.8] }, { center: [3.3, 2, 0], size: [1.4, 4, 0.8] }, { center: [2, 3.2, 0], size: [1.2, 1.6, 0.8] }] },
  stair: { name: "Continuous stair", detail: "4 m floor rise \xB7 20 risers at 0.20 m \xB7 1.2 m clear width", cost: 980, mass: 1800, force: 26e4, torque: 22e4, color: "#c2a477", icon: "stairs", ports: [...deckPorts, ...deckPorts.map((p) => [p[0], 4, p[2]])], segments: [{ center: [0.4, -0.1, 0], size: [0.8, 0.2, 2.6] }, ...Array.from({ length: 10 }, (_, i) => ({ center: [0.8 + (i + 0.5) * 0.24, (i + 1) * 0.1, -0.7], size: [0.24, (i + 1) * 0.2, 1.2] })), { center: [3.6, 1.9, 0], size: [0.8, 0.2, 2.6] }, ...Array.from({ length: 10 }, (_, i) => ({ center: [3.2 - (i + 0.5) * 0.24, 2 + (i + 1) * 0.1, 0.7], size: [0.24, (i + 1) * 0.2, 1.2] })), { center: [0.4, 3.9, 0], size: [0.8, 0.2, 2.6] }] }
};
var SCENARIOS = {
  bridge: { name: "01 / Alder crossing", label: "BRIDGE ENGINEERING", description: "Span the river. Carry a 12-tonne test truck safely to the opposite bank.", target: "Cross a 24 m span", budget: 36e3, duration: 22 },
  earthquake: { name: "02 / Fault line", label: "DISASTER LAB", description: "Build at least 8 m high. Keep your structure standing as the ground shakes.", target: "Survive 18 seconds \xB7 8 m minimum", budget: 65e3, duration: 18 },
  wind: { name: "03 / Storm front", label: "DISASTER LAB", description: "Build at least 8 m high. Brace the upper floors against increasing lateral wind.", target: "Survive 18 seconds \xB7 8 m minimum", budget: 65e3, duration: 18 },
  flood: { name: "04 / Rising water", label: "DISASTER LAB", description: "Build at least 8 m high. Withstand rising water, buoyancy, and a strong current.", target: "Survive 18 seconds \xB7 8 m minimum", budget: 65e3, duration: 18 },
  landslide: { name: "05 / Unstable ground", label: "DISASTER LAB", description: "Build a retaining wall across the slope. Stop the boulders before they hit the house.", target: "Protect the house downhill", budget: 55e3, duration: 18 },
  occupancy: { name: "06 / Full house", label: "LOAD CAPACITY LAB", description: "Build at least 8 m high. Keep the building standing as increasingly heavy inhabitants and contents move in.", target: "Reach 8 m \xB7 survive 30 seconds of increasing occupancy", budget: 65e3, duration: 30 },
  sandbox: { name: "07 / Demolition yard", label: "DEMOLITION SANDBOX", description: "Experiment with physical projectile impacts using editable mass and speed.", target: "Build, launch, repeat \xB7 free play", budget: 12e5, duration: 120 }
};
function rotate(p, r) {
  const a = r * Math.PI / 2;
  return [p[0] * Math.cos(a) + p[2] * Math.sin(a), p[1], -p[0] * Math.sin(a) + p[2] * Math.cos(a)];
}
function ports(piece) {
  return PARTS[piece.kind].ports.map((v) => {
    const q = rotate(v, piece.rotation);
    return [q[0] + piece.p[0], q[1] + piece.p[1], q[2] + piece.p[2]];
  });
}

// src/concrete-materials.ts
var CONCRETE = /* @__PURE__ */ new Set(["column", "slab", "wall", "doorway", "foundation", "core", "stair", "stairwell"]);
var isConcrete = (kind) => CONCRETE.has(kind);
function materialProperties(piece) {
  return { concreteStrength: Number.isFinite(piece.concreteStrength) ? Math.max(0.25, Math.min(2.5, piece.concreteStrength)) : 1, reinforcement: Number.isFinite(piece.reinforcement) ? Math.max(0, Math.min(2.5, piece.reinforcement)) : 1 };
}
var PROFILES = {
  "art-deco": [1.2, 0.8],
  refinery: [1.1, 0.65],
  triumph: [1.5, 0.25],
  brutalist: [1.35, 1.35],
  pagoda: [1, 0.55],
  skybridge: [1.25, 1.5],
  classic: [1.05, 1]
};
function applyBuildingMaterials(pieces, style, seed) {
  const [strength, steel] = PROFILES[style] ?? PROFILES.classic;
  const height = Math.max(4, ...pieces.map((p) => p.p[1]));
  return pieces.map((p) => {
    if (!isConcrete(p.kind)) return p;
    const floor = Math.floor(p.p[1] / 4), hash = Math.imul((seed | 0) ^ floor, 1664525) + 1013904223 >>> 0;
    const variation = 0.96 + hash % 1e3 / 1e3 * 0.08;
    const primary = ["foundation", "core", "column"].includes(p.kind);
    const baseBoost = primary ? 1 + 0.12 * (1 - p.p[1] / height) : 1;
    return { ...p, concreteStrength: +Math.min(2.5, Math.max(primary ? 1 : 0.25, strength * variation * baseBoost * (["wall", "doorway"].includes(p.kind) ? 0.85 : 1))).toFixed(2), reinforcement: +Math.min(2.5, steel * (p.kind === "core" ? 1.35 : 1) * variation).toFixed(2) };
  });
}

// src/structural-edit.ts
var HUB_PRIORITY = { foundation: 0, core: 1, column: 1, wall: 2, doorway: 2, deck: 3, slab: 4, stairwell: 4, stair: 5, truss: 5, girder: 6, brace: 7, facade: 8 };
function validateWorldPieceEdit(sim, pieces, removeIds = []) {
  const ids = /* @__PURE__ */ new Set(), removed = new Set(removeIds);
  if (!Array.isArray(pieces) || !Array.isArray(removeIds)) throw new Error("Ung\xFCltige Bauteil\xE4nderung.");
  for (const p of pieces) {
    if (!p || ids.has(p.id) || !Number.isSafeInteger(p.id) || p.id <= 0 || !PARTS[p.kind] || !Array.isArray(p.p) || p.p.length !== 3 || p.p.some((n) => !Number.isFinite(n) || Math.abs(n) > 490) || !Number.isInteger(p.rotation) || p.rotation < 0 || p.rotation > 3 || sim.items.some((i) => i.id === p.id && !removed.has(i.id))) throw new Error("Ung\xFCltige oder doppelte Bauteile.");
    ids.add(p.id);
  }
  if (new Set(removeIds).size !== removeIds.length || removeIds.some((id) => !Number.isSafeInteger(id) || id <= 0)) throw new Error("Ung\xFCltige L\xF6schliste.");
  if (!sim.ensureBodyCapacity(pieces.length)) throw new Error("Zu viele aktive Physikk\xF6rper. Bitte zuerst Objekte entfernen.");
  return true;
}
function addWorldPieces(sim, pieces, initial = false) {
  if (!pieces.length) return;
  const existing = sim.items, newIds = new Set(pieces.map((p) => p.id));
  validateWorldPieceEdit(sim, pieces);
  const J = sim.J, scenario2 = sim.scenario;
  const previous = new Map(sim.pieces.map((p) => [p.id, p]));
  const portMap = /* @__PURE__ */ new Map(), pieceById = new Map(pieces.map((piece) => [piece.id, piece])), portsById = new Map(pieces.map((piece) => [piece.id, ports(piece)])), shapeCache = /* @__PURE__ */ new Map();
  if (!initial) for (const item of existing) {
    const piece = previous.get(item.id);
    if (!piece || item.fractured || item.retired) continue;
    const angle = -piece.rotation * Math.PI / 2, c = Math.cos(angle), sn = Math.sin(angle);
    for (const port of ports(piece)) {
      const dx = port[0] - piece.p[0], dz = port[2] - piece.p[2];
      const world = sim.bodyWorldPoint(item, [c * dx + sn * dz, port[1] - piece.p[1], -sn * dx + c * dz]);
      const key3 = world.map((n) => Math.round(n * 100)).join(","), list = portMap.get(key3) ?? [];
      list.push(item);
      portMap.set(key3, list);
    }
  }
  for (const p of pieces) {
    const def = PARTS[p.kind];
    let shape = shapeCache.get(p.kind);
    if (!shape) {
      const cs = new J.StaticCompoundShapeSettings();
      for (const s of def.segments) {
        const half = new J.Vec3(...s.size.map((n) => n / 2)), partShape = new J.BoxShapeSettings(half, 0.02);
        J.destroy(half);
        const pos = new J.Vec3(...s.center), axis2 = new J.Vec3(0, 0, 1), partRotation = J.Quat.prototype.sRotation(axis2, s.tilt ?? 0);
        cs.AddShape(pos, partRotation, partShape);
        J.destroy(pos);
        J.destroy(partRotation);
        J.destroy(axis2);
      }
      const result = cs.Create();
      shape = result.Get();
      shape.AddRef();
      shapeCache.set(p.kind, shape);
      J.destroy(result);
      J.destroy(cs);
    }
    const axis = new J.Vec3(0, 1, 0);
    const q = J.Quat.prototype.sRotation(axis, p.rotation * Math.PI / 2);
    J.destroy(axis);
    const body = sim.makeBody(shape, p.p, q, def.mass);
    J.destroy(q);
    const material = materialProperties(p);
    const item = { body, id: p.id, kind: p.kind, initial: [...p.p], stress: 0, finish: p.finish, concreteStrength: material.concreteStrength, reinforcement: material.reinforcement };
    existing.push(item);
    for (const port of portsById.get(p.id)) {
      const key3 = port.map((n) => Math.round(n * 100)).join(",");
      const list = portMap.get(key3) ?? [];
      list.push(item);
      portMap.set(key3, list);
    }
  }
  for (const shape of shapeCache.values()) shape.Release();
  const connections = /* @__PURE__ */ new Map(), collisionPairs = /* @__PURE__ */ new Set();
  const facadeMounts = /* @__PURE__ */ new Map();
  for (const [key3, items] of portMap) {
    const p = key3.split(",").map((n) => Number(n) / 100);
    const ordered = [...new Map(items.map((item) => [item.id, item])).values()].sort((a, b) => (HUB_PRIORITY[a.kind] ?? 99) - (HUB_PRIORITY[b.kind] ?? 99) || a.id - b.id), hub = ordered[0];
    for (let i = 0; i < ordered.length; i++) for (let j = i + 1; j < ordered.length; j++) if (newIds.has(ordered[i].id) || newIds.has(ordered[j].id)) collisionPairs.add([ordered[i].id, ordered[j].id].sort((a, b) => a - b).join(":"));
    for (const panel of ordered.filter((item) => item.kind === "facade" && newIds.has(item.id))) {
      const candidates = facadeMounts.get(panel) ?? /* @__PURE__ */ new Map();
      facadeMounts.set(panel, candidates);
      for (const support of ordered.filter((item) => item.kind !== "facade")) {
        const points = candidates.get(support) ?? [];
        points.push(p);
        candidates.set(support, points);
      }
    }
    const connect = (a, b) => {
      if (!newIds.has(a.id) && !newIds.has(b.id) || a.kind === "facade" || b.kind === "facade") return;
      const k = [a.id, b.id].sort((x, y) => x - y).join(":"), connection = connections.get(k) ?? { a, b, points: [] };
      if (!connection.points.some((point) => point.every((v, i) => v === p[i]))) connection.points.push(p);
      connections.set(k, connection);
    };
    if ((initial ? pieces.length : previous.size + pieces.length) < 400) {
      for (let i = 0; i < ordered.length; i++) for (let j = i + 1; j < ordered.length; j++) connect(ordered[i], ordered[j]);
    } else {
      for (const item of ordered.slice(1)) connect(hub, item);
      const bearing = ordered.filter((item) => item.kind === "wall" || item.kind === "doorway" || item.kind === "column" || item.kind === "core");
      for (const below of bearing) if (Math.abs(below.initial[1] + 4 - p[1]) < 0.01) {
        for (const above of bearing) if (Math.abs(above.initial[1] - p[1]) < 0.01 && (below.kind === above.kind || ["wall", "doorway"].includes(below.kind) && ["wall", "doorway"].includes(above.kind)) && below.initial[0] === above.initial[0] && below.initial[2] === above.initial[2] && (pieceById.get(below.id) ?? previous.get(below.id)).rotation === (pieceById.get(above.id) ?? previous.get(above.id)).rotation) connect(below, above);
      }
    }
  }
  for (const [panel, candidates] of facadeMounts) {
    sim.glassFrames.set(panel, [...candidates].flatMap(([support, points]) => points.map((point) => ({ support, panelPoint: sim.bodyLocalPoint(panel, point), supportPoint: sim.bodyLocalPoint(support, point) }))));
    const mounts = [...candidates].map(([support, points]) => ({ support, points: points.filter((p) => Math.abs(p[1] - panel.initial[1]) < 0.01) })).filter((m) => m.points.length);
    if (!mounts.length) for (const [support, points] of candidates) mounts.push({ support, points });
    mounts.sort((a, b) => b.points.length - a.points.length || (HUB_PRIORITY[a.support.kind] ?? 99) - (HUB_PRIORITY[b.support.kind] ?? 99) || a.support.id - b.support.id);
    const mount = mounts[0];
    if (mount) {
      const k = [mount.support.id, panel.id].sort((a, b) => a - b).join(":");
      connections.set(k, { a: mount.support, b: panel, points: mount.points });
    }
  }
  for (const { a, b, points } of connections.values()) {
    const center = points.reduce((sum, p) => sum.map((v, i) => v + p[i] / points.length), [0, 0, 0]);
    if (a.kind === "deck" || b.kind === "deck") for (const p of points) sim.join(a, b, p, [p], true);
    else sim.join(a, b, center, points);
  }
  const structuralById = new Map(existing.filter((item) => item.id > 0).map((item) => [item.id, item]));
  for (const pair of collisionPairs) {
    const [a, b] = pair.split(":").map(Number), left = structuralById.get(a), right = structuralById.get(b);
    if (left && right) {
      sim.filter.DisableCollision(left.body.GetCollisionGroup().GetSubGroupID(), right.body.GetCollisionGroup().GetSubGroupID());
      if (!connections.has(pair) && (left.kind === "facade" || right.kind === "facade")) for (const [item, peer] of [[left, right], [right, left]]) {
        const peers = sim.facadeClearances.get(item.id) ?? /* @__PURE__ */ new Set();
        peers.add(peer);
        sim.facadeClearances.set(item.id, peers);
      }
    }
  }
  for (const item of existing) {
    if (!newIds.has(item.id)) continue;
    const p = pieceById.get(item.id);
    const anchors = portsById.get(item.id).filter((v) => Math.abs(v[1]) < 0.01 && (scenario2 === "bridge" ? Math.abs(v[0]) >= 11.99 && Math.abs(v[0]) <= 34 && Math.abs(v[2]) <= 14 : p.kind === "foundation" && Math.abs(v[0]) <= (sim.rules.sandbox ? 490 : 40) && Math.abs(v[2]) <= (sim.rules.sandbox ? 490 : 40)));
    if (anchors.length) {
      const center = anchors.reduce((sum, p2) => sum.map((v, i) => v + p2[i] / anchors.length), [0, 0, 0]);
      const support = scenario2 === "bridge" && center[0] > 0 ? sim.bodyList[1] : sim.ground;
      if (scenario2 === "bridge") for (const p2 of anchors) sim.join(item, void 0, p2, [p2], true, support);
      else sim.join(item, void 0, center, anchors);
      sim.filter.DisableCollision(item.body.GetCollisionGroup().GetSubGroupID(), support.GetCollisionGroup().GetSubGroupID());
    }
  }
  for (const item of structuralById.values()) sim.releaseFacadeClearance(item);
  if (!initial) sim.pieces.push(...structuredClone(pieces));
}

// src/fracture.ts
function facadeFan(random, segment, mass) {
  const axes = [0, 1, 2].sort((a, b) => segment.size[b] - segment.size[a]);
  const [u, v, n] = axes, halfX = segment.size[u] / 2, halfY = segment.size[v] / 2;
  const cx = (0.08 + random() * 0.1) * (random() < 0.5 ? -1 : 1) * segment.size[u], cy = (0.08 + random() * 0.1) * (random() < 0.5 ? -1 : 1) * segment.size[v], depth = segment.size[n] / 2;
  const map = (x, y, z) => {
    const p = [0, 0, 0];
    p[u] = x;
    p[v] = y;
    p[n] = z;
    return p;
  };
  const edgeA = -0.78 + random() * 0.46, edgeB = 0.54 + random() * 0.34;
  const boundary = [[-halfX, -halfY, 0], [edgeA * halfX, -halfY, 0], [halfX, -halfY, 0], [halfX, halfY, 0], [edgeB * halfX, halfY, 0], [-halfX, halfY, 0]];
  const result = [];
  for (let i = 0; i < boundary.length; i++) {
    const next = boundary[(i + 1) % boundary.length];
    const a = Math.abs((boundary[i][0] - cx) * (next[1] - cy) - (next[0] - cx) * (boundary[i][1] - cy)) / 2;
    const triangle = [[cx, cy], [boundary[i][0], boundary[i][1]], [next[0], next[1]]];
    const center = [triangle.reduce((sum, p) => sum + p[0], 0) / 3, triangle.reduce((sum, p) => sum + p[1], 0) / 3, 0], points = [];
    for (const z of [-depth, depth]) for (const p of triangle) points.push([p[0] - center[0], p[1] - center[1], z]);
    const xs = triangle.map((p) => Math.abs(p[0] - center[0])), ys = triangle.map((p) => Math.abs(p[1] - center[1]));
    result.push({ center: map(center[0], center[1], 0).map((x, i2) => x + segment.center[i2]), size: map(Math.max(...xs) * 2, Math.max(...ys) * 2, segment.size[n]), mass: mass * a / (segment.size[u] * segment.size[v]), kick: [(random() - 0.5) * 2, (random() - 0.25) * 1.5, (random() - 0.5) * 2], vertices: points.map((p) => map(...p)) });
  }
  result.at(-1).mass += mass - result.reduce((sum, part) => sum + part.mass, 0);
  const mean = result.reduce((sum, f) => sum.map((v2, a) => v2 + f.kick[a] * f.mass / mass), [0, 0, 0]);
  for (const f of result) f.kick = f.kick.map((v2, a) => v2 - mean[a]);
  return result;
}
function fractureShapes(piece, override) {
  if (!["column", "wall", "slab", "deck", "facade"].includes(piece.kind)) return [];
  const def = PARTS[piece.kind], segment = def.segments[0];
  const axes = [0, 1, 2].sort((a, b) => segment.size[b] - segment.size[a]);
  const cuts = [[0, 0.29, 0.64, 1], [0, 0.46, 1]];
  const result = [];
  let seed = piece.id * 7919 + 17;
  const random = () => {
    seed = Math.imul(seed, 1664525) + 1013904223 >>> 0;
    return seed / 4294967296;
  };
  if (piece.kind === "facade") return facadeFan(random, override ?? segment, override?.mass ?? def.mass);
  for (let i = 0; i < 3; i++) for (let j = 0; j < 2; j++) {
    const center = [...segment.center], size = [...segment.size];
    let fraction = 1;
    for (const [n, k] of [i, j].entries()) {
      const axis = axes[n], lo = cuts[n][k], hi = cuts[n][k + 1];
      center[axis] += (lo + (hi - lo) / 2 - 0.5) * segment.size[axis];
      size[axis] *= hi - lo;
      fraction *= hi - lo;
    }
    const speed = 1.8;
    const kick = [(random() - 0.5) * speed * 2, (random() - 0.25) * speed, (random() - 0.5) * speed * 2];
    result.push({ center, size: size.map((v) => v * 0.94), mass: def.mass * fraction, kick });
  }
  const mean = result.reduce((sum, f) => sum.map((v, a) => v + f.kick[a] * f.mass / def.mass), [0, 0, 0]);
  for (const f of result) f.kick = f.kick.map((v, a) => v - mean[a]);
  return result;
}
function rotateByQuaternion(v, q) {
  const [x, y, z] = v, [qx, qy, qz, qw] = q;
  const tx = 2 * (qy * z - qz * y), ty = 2 * (qz * x - qx * z), tz = 2 * (qx * y - qy * x);
  return [x + qw * tx + qy * tz - qz * ty, y + qw * ty + qz * tx - qx * tz, z + qw * tz + qx * ty - qy * tx];
}

// src/projectile-flights.ts
var xyz = (v) => [v.GetX(), v.GetY(), v.GetZ()];
var ProjectileFlights = class {
  constructor(sim) {
    this.sim = sim;
  }
  sim;
  flights = /* @__PURE__ */ new Map();
  has(root) {
    return this.flights.has(root);
  }
  start(root, parts, position, reuse) {
    const { J, bodies } = this.sim, settings = new J.StaticCompoundShapeSettings(), q = new J.Quat(0, 0, 0, 1);
    const offsets = parts.map((p) => p.initial.map((v, a) => v - position[a]));
    for (let i = 0; i < parts.length; i++) {
      const part = parts[i], size = part.size, half = new J.Vec3(...size.map((v) => v / 2)), shape2 = new J.BoxShapeSettings(half, Math.min(0.02, Math.min(...size) * 0.05)), offset = new J.Vec3(...offsets[i]);
      shape2.mDensity = part.sourceMass / (size[0] * size[1] * size[2]);
      settings.AddShape(offset, q, shape2, i);
      J.destroy(half);
      J.destroy(offset);
    }
    const result = settings.Create();
    if (!result.IsValid()) throw new Error("Invalid projectile compound");
    const shape = result.Get();
    shape.AddRef();
    J.destroy(result);
    J.destroy(settings);
    const mass = parts.reduce((sum, p) => sum + p.sourceMass, 0);
    let body = reuse;
    if (body) {
      bodies.SetShape(body.GetID(), shape, true, J.EActivation_DontActivate);
      body.GetMotionProperties().ScaleToMass(mass);
      const p = new J.RVec3(...position);
      bodies.SetPositionAndRotation(body.GetID(), p, q, J.EActivation_DontActivate);
      J.destroy(p);
      bodies.AddBody(body.GetID(), J.EActivation_Activate);
      this.sim.removedBodies.delete(body);
    } else body = this.sim.makeBody(shape, position, q, mass, false, true);
    body.GetMotionProperties().ResetForce();
    body.GetMotionProperties().ResetTorque();
    body.SetLinearVelocity(parts[0].body.GetLinearVelocity());
    const zero = new J.Vec3(0, 0, 0);
    body.SetAngularVelocity(zero);
    J.destroy(zero);
    J.destroy(q);
    shape.Release();
    const joints = this.sim.joints.filter((j) => j.a.blockShot === root && j.b?.blockShot === root);
    for (const joint of joints) joint.constraint.SetEnabled(false);
    for (const part of parts) {
      bodies.RemoveBody(part.body.GetID());
      this.sim.removedBodies.add(part.body);
      part.flying = true;
    }
    this.flights.set(root, { body, parts, offsets, joints });
    return body;
  }
  sync(flight) {
    const { J, bodies } = this.sim, body = flight.body, p = xyz(body.GetPosition()), q = body.GetRotation(), rotation = [q.GetX(), q.GetY(), q.GetZ(), q.GetW()], com = xyz(body.GetCenterOfMassPosition()), v = xyz(body.GetLinearVelocity()), w = xyz(body.GetAngularVelocity());
    const position = new J.RVec3(0, 0, 0), velocity = new J.Vec3(0, 0, 0);
    flight.parts.forEach((part, i) => {
      const offset = rotateByQuaternion(flight.offsets[i], rotation), point = p.map((n, a) => n + offset[a]), r = point.map((n, a) => n - com[a]);
      position.Set(...point);
      bodies.SetPositionAndRotation(part.body.GetID(), position, q, J.EActivation_DontActivate);
      velocity.Set(v[0] + w[1] * r[2] - w[2] * r[1], v[1] + w[2] * r[0] - w[0] * r[2], v[2] + w[0] * r[1] - w[1] * r[0]);
      part.body.SetLinearVelocity(velocity);
      part.body.SetAngularVelocity(body.GetAngularVelocity());
    });
    J.destroy(position);
    J.destroy(velocity);
  }
  syncAll() {
    for (const flight of this.flights.values()) this.sync(flight);
  }
  release(root) {
    if (root === void 0) return;
    const flight = this.flights.get(root);
    if (!flight) return;
    this.sync(flight);
    const { J, bodies } = this.sim;
    bodies.RemoveBody(flight.body.GetID());
    this.sim.removedBodies.add(flight.body);
    this.sim.retireProjectileCompound(flight.body);
    this.flights.delete(root);
    for (const part of flight.parts) {
      part.flying = false;
      bodies.AddBody(part.body.GetID(), J.EActivation_Activate);
      this.sim.removedBodies.delete(part.body);
    }
    for (const joint of flight.joints) if (!joint.broken) joint.constraint.SetEnabled(true);
  }
  retire(root) {
    const flight = this.flights.get(root);
    if (!flight) return;
    this.sim.bodies.RemoveBody(flight.body.GetID());
    this.sim.removedBodies.add(flight.body);
    this.sim.retireProjectileCompound(flight.body);
    for (const part of flight.parts) part.flying = false;
    this.flights.delete(root);
  }
  /** Conservative swept bounds include motion of both bodies and rotational travel.
   * Expand before stepping so normal per-part CCD and damage handle the impact. */
  beforeStep(dt) {
    if (!this.flights.size) return;
    const horizon = dt * 2, rows = [];
    for (const body of this.sim.bodyList) {
      if (this.sim.removedBodies.has(body)) continue;
      const bounds = body.GetWorldSpaceBounds(), min = xyz(bounds.mMin), max = xyz(bounds.mMax), v = xyz(body.GetLinearVelocity()), w = xyz(body.GetAngularVelocity());
      const radius = Math.hypot(...max.map((n, a) => (n - min[a]) / 2)), pad = 0.15 + Math.min(2 * radius, Math.hypot(...w) * radius * horizon) + 10 * horizon * horizon;
      rows.push({ body, min: min.map((n, a) => n + Math.min(0, v[a] * horizon) - pad), max: max.map((n, a) => n + Math.max(0, v[a] * horizon) + pad) });
    }
    const release = [];
    for (const [root, flight] of this.flights) {
      const own = rows.find((r) => r.body === flight.body);
      if (own && rows.some((r) => r.body !== flight.body && r.min.every((n, a) => n <= own.max[a] && r.max[a] >= own.min[a]))) release.push(root);
    }
    for (const root of release) this.release(root);
  }
};

// src/storey-projectile.ts
var ROOM_PARTS = 16;
var WIDTH = 2.8;
var DEPTH = 2.2;
var HEIGHT = 2.8;
var density = (kind) => {
  const part = PARTS[kind];
  return part.mass / part.segments.reduce((sum, segment) => sum + segment.size[0] * segment.size[1] * segment.size[2], 0);
};
function roomAt(origin) {
  const wall = 0.18, column = 0.32, floorThickness = 0.22, roofThickness = 0.22;
  const floorTop = -HEIGHT / 2 + floorThickness, roofBottom = HEIGHT / 2 - roofThickness;
  const clearHeight = roofBottom - floorTop, interiorDepth = DEPTH - 2 * column, interiorWidth = WIDTH - 2 * column;
  const cells2 = [];
  const add2 = (local, size, sourceKind) => {
    const offset = [local[0] + origin[0], local[1] + origin[1], local[2] + origin[2]];
    cells2.push({ offset, size, sourceKind, massWeight: size[0] * size[1] * size[2] * density(sourceKind) });
    return cells2.length - 1;
  };
  const floor = add2([0, -HEIGHT / 2 + floorThickness / 2, 0], [WIDTH, floorThickness, DEPTH], "slab");
  const roof = add2([0, HEIGHT / 2 - roofThickness / 2, 0], [WIDTH, roofThickness, DEPTH], "slab");
  const columnY = (floorTop + roofBottom) / 2;
  const frontLeft = add2([-WIDTH / 2 + column / 2, columnY, -DEPTH / 2 + column / 2], [column, clearHeight, column], "column");
  const frontRight = add2([WIDTH / 2 - column / 2, columnY, -DEPTH / 2 + column / 2], [column, clearHeight, column], "column");
  const backLeft = add2([-WIDTH / 2 + column / 2, columnY, DEPTH / 2 - column / 2], [column, clearHeight, column], "column");
  const backRight = add2([WIDTH / 2 - column / 2, columnY, DEPTH / 2 - column / 2], [column, clearHeight, column], "column");
  const backWall = add2([0, columnY, DEPTH / 2 - wall / 2], [interiorWidth, clearHeight, wall], "wall");
  const parapetHeight = 0.55, parapetY = floorTop + parapetHeight / 2;
  const leftParapet = add2([-WIDTH / 2 + wall / 2, parapetY, 0], [wall, parapetHeight, interiorDepth], "wall");
  const rightParapet = add2([WIDTH / 2 - wall / 2, parapetY, 0], [wall, parapetHeight, interiorDepth], "wall");
  const sideWindowHeight = clearHeight - parapetHeight, sideWindowY = floorTop + parapetHeight + sideWindowHeight / 2;
  const paneDepth = interiorDepth / 2, sidePaneZ = interiorDepth / 4;
  const leftWindowA = add2([-WIDTH / 2 + wall / 2, sideWindowY, -sidePaneZ], [wall * 0.34, sideWindowHeight, paneDepth], "facade");
  const leftWindowB = add2([-WIDTH / 2 + wall / 2, sideWindowY, sidePaneZ], [wall * 0.34, sideWindowHeight, paneDepth], "facade");
  const rightWindowA = add2([WIDTH / 2 - wall / 2, sideWindowY, -sidePaneZ], [wall * 0.34, sideWindowHeight, paneDepth], "facade");
  const rightWindowB = add2([WIDTH / 2 - wall / 2, sideWindowY, sidePaneZ], [wall * 0.34, sideWindowHeight, paneDepth], "facade");
  const doorWidth = 0.86, headerHeight = 0.45;
  const header = add2([0, roofBottom - headerHeight / 2, -DEPTH / 2 + wall / 2], [interiorWidth, headerHeight, wall], "wall");
  const frontWindowHeight = roofBottom - headerHeight - floorTop, frontWindowY = floorTop + frontWindowHeight / 2;
  const sideOpeningWidth = (interiorWidth - doorWidth) / 2;
  const frontLeftWindow = add2([-doorWidth / 2 - sideOpeningWidth / 2, frontWindowY, -DEPTH / 2 + wall / 2], [sideOpeningWidth, frontWindowHeight, wall * 0.34], "facade");
  const frontRightWindow = add2([doorWidth / 2 + sideOpeningWidth / 2, frontWindowY, -DEPTH / 2 + wall / 2], [sideOpeningWidth, frontWindowHeight, wall * 0.34], "facade");
  const links = [];
  const link = (a, b) => links.push(a < b ? [a, b] : [b, a]);
  for (const c of [frontLeft, frontRight, backLeft, backRight]) {
    link(floor, c);
    link(roof, c);
  }
  link(backWall, backLeft);
  link(backWall, backRight);
  link(backWall, floor);
  link(backWall, roof);
  link(leftParapet, floor);
  link(rightParapet, floor);
  link(leftParapet, leftWindowA);
  link(leftParapet, leftWindowB);
  link(rightParapet, rightWindowA);
  link(rightParapet, rightWindowB);
  link(leftWindowA, leftWindowB);
  link(rightWindowA, rightWindowB);
  link(leftWindowA, frontLeft);
  link(leftWindowB, backLeft);
  link(rightWindowA, frontRight);
  link(rightWindowB, backRight);
  link(frontLeftWindow, floor);
  link(frontRightWindow, floor);
  link(frontLeftWindow, frontLeft);
  link(frontRightWindow, frontRight);
  link(frontLeftWindow, header);
  link(frontRightWindow, header);
  link(header, roof);
  return { cells: cells2, links };
}
function storeyProjectileLayout(requestedParts = ROOM_PARTS) {
  const requested = Number.isFinite(requestedParts) ? requestedParts : ROOM_PARTS;
  const modules = Math.max(1, Math.min(20, Math.round(requested / ROOM_PARTS)));
  const coordinates = [];
  for (let x = -4; x <= 4; x++) for (let y = -2; y <= 2; y++) for (let z = -4; z <= 4; z++)
    if (x || y || z) coordinates.push([x, y, z]);
  coordinates.sort((a, b) => {
    const da = Math.abs(a[0]) + Math.abs(a[1]) + Math.abs(a[2]), db = Math.abs(b[0]) + Math.abs(b[1]) + Math.abs(b[2]);
    return da - db || Math.abs(a[1]) - Math.abs(b[1]) || a[1] - b[1] || a[2] - b[2] || a[0] - b[0];
  });
  const chosen = [[0, 0, 0], ...coordinates.slice(0, modules - 1)];
  const minX = Math.min(...chosen.map((p) => p[0])), maxX = Math.max(...chosen.map((p) => p[0]));
  const minY = Math.min(...chosen.map((p) => p[1])), maxY = Math.max(...chosen.map((p) => p[1]));
  const minZ = Math.min(...chosen.map((p) => p[2])), maxZ = Math.max(...chosen.map((p) => p[2]));
  const center = [(minX + maxX) * WIDTH / 2, (minY + maxY) * HEIGHT / 2, (minZ + maxZ) * DEPTH / 2];
  const cells2 = [], links = [];
  const moduleIndex = new Map(chosen.map((p, i) => [p.join(","), i]));
  for (const [x, y, z] of chosen) {
    const room = roomAt([x * WIDTH - center[0], y * HEIGHT - center[1], z * DEPTH - center[2]]);
    const base2 = cells2.length;
    cells2.push(...room.cells);
    links.push(...room.links.map(([a, b]) => [a + base2, b + base2]));
    for (const [dx, dy, dz] of [[1, 0, 0], [0, 1, 0], [0, 0, 1]]) {
      const neighbor = moduleIndex.get([x + dx, y + dy, z + dz].join(","));
      if (neighbor === void 0) continue;
      const otherBase = neighbor * ROOM_PARTS;
      if (dy === 0) {
        links.push([base2, otherBase]);
        links.push([base2 + 1, otherBase + 1]);
      } else links.push([base2 + 1, otherBase]);
    }
  }
  let radius = 0, mass = 0;
  for (const cell of cells2) {
    for (const sx of [-1, 1]) for (const sy of [-1, 1]) for (const sz of [-1, 1])
      radius = Math.max(radius, Math.hypot(cell.offset[0] + sx * cell.size[0] / 2, cell.offset[1] + sy * cell.size[1] / 2, cell.offset[2] + sz * cell.size[2] / 2));
    mass += cell.massWeight;
  }
  return { cells: cells2, links, radius, mass, count: cells2.length };
}

// src/block-projectile.ts
function blockProjectileLayout(radius) {
  const pitch = radius / Math.sqrt(2 * 1.5 ** 2 + 0.5 ** 2), size = pitch * 0.96;
  const cells2 = [];
  for (let x = -1; x <= 1; x++) for (let y = -1; y <= 1; y++) for (let z = -1; z <= 1; z++) {
    if (x * x + y * y + z * z > 2) continue;
    cells2.push({ grid: [x, y, z], offset: [x * pitch, y * pitch, z * pitch], size: [size, size, size] });
  }
  const links = [];
  for (let a = 0; a < cells2.length; a++) for (let b = a + 1; b < cells2.length; b++) if (cells2[a].grid.reduce((n, v, i) => n + Math.abs(v - cells2[b].grid[i]), 0) === 1) links.push([a, b]);
  return { cells: cells2, links };
}
function normalizeBuildingProjectile(value) {
  const number = (v, fallback, min, max) => typeof v === "number" && Number.isFinite(v) ? Math.max(min, Math.min(max, v)) : fallback;
  return { parts: Math.round(number(value?.parts, 16, 16, 320) / 16) * 16, concreteStrength: number(value?.concreteStrength, 1, 0.25, 2.5), reinforcement: number(value?.reinforcement, 1, 0, 2.5) };
}

// src/meteor-flight.ts
var METEOR_MASS_FACTOR = 1.5;
function meteorRandom(index, salt) {
  const value = Math.sin((index + 1) * 127.1 + salt * 311.7) * 43758.5453;
  return value - Math.floor(value);
}
function meteorFlight(index, target, top, intensity) {
  const random = (salt) => meteorRandom(index, salt);
  const azimuth = random(3) * Math.PI * 2, elevation = 0.3 + random(4) * 1.12;
  const oldVx = 5 + random(3) * 5, oldVz = 3 + random(4) * 5;
  const speed = Math.sqrt(oldVx ** 2 + oldVz ** 2 + (29 + 4 * intensity) ** 2 + 2 * 9.81 * Math.max(0, top + 30 - target[1]));
  const flightTime = 1, horizontal = Math.cos(elevation) * speed;
  const impact = [Math.cos(azimuth) * horizontal, -Math.sin(elevation) * speed, Math.sin(azimuth) * horizontal];
  const velocity = [impact[0], impact[1] + 9.81 * flightTime, impact[2]];
  const position = [target[0] - impact[0] * flightTime, target[1] - impact[1] * flightTime - 4.905 * flightTime ** 2, target[2] - impact[2] * flightTime];
  return { position, velocity, impact, flightTime };
}

// src/vehicle-blueprint.ts
var VEHICLE_SPAWN = [0, 0, 20];
var VEHICLE_PARTS = { frame: { size: [0.95, 0.24, 0.95], mass: 180, color: "#416579" }, wheel: { size: [0.36, 1.1, 1.1], mass: 85, color: "#26343c" }, engine: { size: [0.8, 0.65, 0.8], mass: 400, color: "#bc783e" }, cannon: { size: [0.8, 0.5, 0.8], mass: 800, color: "#385a6b" }, armor: { size: [0.95, 0.25, 0.95], mass: 350, color: "#88b3c5" } };
var make = (rows) => rows.map(([kind, x, y, z], i) => ({ id: i + 1, kind, p: [x, y, z] }));
var base = [["frame", 0, 0.8, -1], ["frame", 0, 0.8, 0], ["frame", 0, 0.8, 1], ["engine", 0, 1.8, 1], ["wheel", -1, 0.8, -1], ["wheel", 1, 0.8, -1], ["wheel", -1, 0.8, 1], ["wheel", 1, 0.8, 1]];
var VEHICLE_PRESETS = [{ id: "buggy", name: "Scout \xB7 leichter Buggy", parts: make(base) }, { id: "rammer", name: "Bison \xB7 gepanzerter Rammer", parts: make([...base, ["frame", 0, 0.8, -2], ["armor", 0, 0.8, -3], ["armor", -1, 0.8, -2], ["armor", 1, 0.8, -2]]) }, { id: "cannon-truck", name: "Atlas \xB7 Kanonenwagen", parts: make([...base, ["cannon", 0, 1.8, -1], ["armor", 0, 1.8, 0]]) }];
var DEFAULT_VEHICLE_PARTS = VEHICLE_PRESETS[2].parts;
function validateVehicleParts(parts) {
  if (!Array.isArray(parts) || !parts.length || parts.length > 80) return ["Baue ein Fahrzeug aus 1 bis 80 Teilen."];
  const ids = /* @__PURE__ */ new Set(), positions = /* @__PURE__ */ new Set();
  for (const p of parts) {
    if (!p || !VEHICLE_PARTS[p.kind] || !Number.isInteger(p.id) || ids.has(p.id) || !Array.isArray(p.p) || p.p.length !== 3 || p.p.some((v) => !Number.isFinite(v) || Math.abs(v) > 10)) return ["Ung\xFCltiger Fahrzeugbauplan."];
    ids.add(p.id);
    const key3 = p.p.join(",");
    if (positions.has(key3)) return ["Bauteile d\xFCrfen nicht denselben Platz belegen."];
    positions.add(key3);
  }
  if (!parts.some((p) => p.kind === "frame")) return ["Mindestens ein Rahmenteil wird ben\xF6tigt."];
  if (!parts.some((p) => p.kind === "engine")) return ["Ein Motor fehlt."];
  const wheels = parts.filter((p) => p.kind === "wheel");
  if (wheels.length < 4 || !wheels.some((p) => p.p[0] < 0) || !wheels.some((p) => p.p[0] > 0) || new Set(wheels.map((p) => p.p[2])).size < 2) return ["Mindestens vier R\xE4der: links und rechts an zwei Achsen."];
  const connected = /* @__PURE__ */ new Set([parts.find((p) => p.kind === "frame").id]);
  let changed = true;
  while (changed) {
    changed = false;
    for (const p of parts) if (!connected.has(p.id) && parts.some((other) => connected.has(other.id) && Math.hypot(...p.p.map((v, i) => v - other.p[i])) <= 1.05)) {
      connected.add(p.id);
      changed = true;
    }
  }
  if (connected.size !== parts.length) return ["Alle Teile m\xFCssen an benachbarte Teile anschlie\xDFen (1 m Raster)."];
  return [];
}
var validateVehicle = (parts) => validateVehicleParts(parts).join(" ");
function assertVehicleParts(parts) {
  const error = validateVehicle(parts);
  if (error) throw new Error(error);
}
function vehiclePower(parts) {
  const engines = parts.filter((p) => p.kind === "engine"), visited = /* @__PURE__ */ new Set();
  let connected = 0;
  for (const engine of engines) {
    if (visited.has(engine.id)) continue;
    const queue = [engine];
    visited.add(engine.id);
    for (let i = 0; i < queue.length; i++) for (const next of engines) if (!visited.has(next.id) && Math.hypot(...next.p.map((n, a) => n - queue[i].p[a])) <= 1.05) {
      visited.add(next.id);
      queue.push(next);
    }
    connected = Math.max(connected, queue.length);
  }
  const count = Math.max(1, connected);
  return { engines: engines.length, connected, torque: 2400 * (1 + 0.2 * (count - 1)), wheelSpeed: 24 * (1 + 0.35 * Math.log2(count)) };
}

// src/cannon-ballistics.ts
var CANNON_BALLISTICS = { speed: 110, mass: 900, radius: 0.3, linearDamping: 0.08, gravity: 9.81 };
function cannonLaunch(local, position, rotation, vehicleVelocity, yaw, pitch) {
  const direction = rotateByQuaternion([-Math.sin(yaw) * Math.cos(pitch), Math.sin(pitch), -Math.cos(yaw) * Math.cos(pitch)], rotation), offset = rotateByQuaternion(local, rotation);
  const muzzle = position.map((v, i) => v + offset[i] + direction[i] * 2.1 + (i === 1 ? 0.23 : 0));
  const velocity = direction.map((v, i) => v * CANNON_BALLISTICS.speed + vehicleVelocity[i]);
  return { muzzle, velocity, direction };
}

// src/vehicle-physics.ts
var VehiclePhysics = class {
  constructor(sim, parts, origin = VEHICLE_SPAWN, baseId, rotation = 0, vehicleId) {
    this.sim = sim;
    this.parts = parts;
    this.vehicleId = vehicleId;
    assertVehicleParts(parts);
    const power = vehiclePower(parts);
    this.driveSpeed = power.wheelSpeed;
    this.ramMass = parts.reduce((sum, p) => sum + VEHICLE_PARTS[p.kind].mass, 0);
    this.ramStrength = 1.5 + Math.min(2, parts.filter((p) => p.kind === "armor").length * 0.5);
    const J = sim.J, compound = new J.StaticCompoundShapeSettings();
    for (const part of parts.filter((p) => p.kind !== "wheel")) {
      const def = VEHICLE_PARTS[part.kind], half = new J.Vec3(...def.size.map((n) => n / 2)), shape2 = new J.BoxShapeSettings(half, 0.02), pos = new J.Vec3(...part.p), q2 = new J.Quat(0, 0, 0, 1);
      compound.AddShape(pos, q2, shape2);
      J.destroy(half);
      J.destroy(pos);
      J.destroy(q2);
    }
    const result = compound.Create(), shape = result.Get(), axis = new J.Vec3(0, 1, 0), q = J.Quat.prototype.sRotation(axis, rotation);
    J.destroy(axis);
    this.chassis = sim.makeBody(shape, origin, q, parts.filter((p) => p.kind !== "wheel").reduce((n, p) => n + VEHICLE_PARTS[p.kind].mass, 0));
    J.destroy(q);
    J.destroy(result);
    J.destroy(compound);
    const ids = [];
    for (let i = 0; i < parts.length; i++) ids.push(baseId === void 0 ? sim.allocateItemId() : baseId - i);
    this.chassisItem = { id: ids[0], kind: "vehicle-chassis", body: this.chassis, initial: origin, stress: 0, vehicleParts: parts, vehicleId };
    sim.items.push(this.chassisItem);
    this.ownedItems.push(this.chassisItem);
    for (const part of parts.filter((p) => p.kind === "wheel")) {
      const c = Math.cos(rotation), sn = Math.sin(rotation), offset = [c * part.p[0] + sn * part.p[2], part.p[1], -sn * part.p[0] + c * part.p[2]], pos = origin.map((v, i) => v + offset[i]), shape2 = new J.CylinderShape(0.18, 0.55, 0.02);
      shape2.AddRef();
      const half = rotation * 0.5, roll = Math.SQRT1_2, q2 = new J.Quat(Math.sin(half) * roll, Math.sin(half) * roll, Math.cos(half) * roll, Math.cos(half) * roll), body = sim.makeBody(shape2, pos, q2, VEHICLE_PARTS.wheel.mass);
      shape2.Release();
      J.destroy(q2);
      body.SetFriction(1);
      sim.filter.DisableCollision(this.chassis.GetCollisionGroup().GetSubGroupID(), body.GetCollisionGroup().GetSubGroupID());
      const s = new J.HingeConstraintSettings();
      s.mPoint1.Set(...pos);
      s.mPoint2.Set(...pos);
      s.mHingeAxis1.Set(c, 0, -sn);
      s.mHingeAxis2.Set(c, 0, -sn);
      s.mNormalAxis1.Set(0, 1, 0);
      s.mNormalAxis2.Set(0, 1, 0);
      s.mMotorSettings.mMinTorqueLimit = -power.torque;
      s.mMotorSettings.mMaxTorqueLimit = power.torque;
      const motor = J.castObject(s.Create(this.chassis, body), J.HingeConstraint);
      sim.system.AddConstraint(motor);
      J.destroy(s);
      this.constraints.push(motor);
      this.wheels.push({ body, motor, side: Math.sign(part.p[0]) });
      const item = { id: ids[this.wheels.length], kind: "vehicle-wheel", body, initial: pos, stress: 0, vehiclePart: part, vehicleId };
      sim.items.push(item);
      this.ownedItems.push(item);
    }
  }
  sim;
  parts;
  vehicleId;
  controls = { throttle: 0, steer: 0, brake: false, fire: false, yaw: 0, pitch: 0.08 };
  chassis;
  chassisItem;
  fireCooldown = 0;
  ownedItems = [];
  driveSpeed = 24;
  ramCooldown = 0;
  impactVelocity = [0, 0, 0];
  ramMass = 0;
  ramStrength = 1;
  wheels = [];
  constraints = [];
  step(dt) {
    this.ramCooldown = Math.max(0, this.ramCooldown - dt);
    const velocity = this.chassis.GetLinearVelocity();
    this.impactVelocity = [velocity.GetX(), velocity.GetY(), velocity.GetZ()];
    const J = this.sim.J, c = this.controls, throttle = Math.max(-1, Math.min(1, c.throttle)), steer = Math.max(-1, Math.min(1, c.steer));
    for (const wheel of this.wheels) {
      if (throttle || steer || c.brake) this.sim.bodies.ActivateBody(wheel.body.GetID());
      wheel.motor.SetMotorState(throttle || steer || c.brake ? J.EMotorState_Velocity : J.EMotorState_Off);
      wheel.motor.SetTargetAngularVelocity(c.brake ? 0 : -(throttle * this.driveSpeed + steer * wheel.side * 14));
    }
    if (steer && this.wheels.some((w) => this.sim.system.WereBodiesInContact(w.body.GetID(), this.sim.ground.GetID()))) {
      this.sim.bodies.ActivateBody(this.chassis.GetID());
      const torque = new J.Vec3(0, steer * 23e3, 0);
      this.chassis.AddTorque(torque);
      J.destroy(torque);
    }
    this.fireCooldown = Math.max(0, this.fireCooldown - dt);
    if (c.fire && this.fireCooldown === 0) this.fire();
  }
  // Real chassis contacts can fracture material, not just loosen its joints.
  afterStep() {
    if (this.ramCooldown > 0 || Math.hypot(...this.impactVelocity) < 3) return;
    const p = this.chassis.GetCenterOfMassPosition(), position = [p.GetX(), p.GetY(), p.GetZ()];
    let hits = 0;
    for (const target of this.sim.items) {
      if (target.fractured || target.retired || target.id <= 0 && !target.structural || !["column", "wall", "slab", "deck", "facade", "girder", "doorway", "stairwell", "stair", "core"].includes(target.sourceKind ?? target.kind)) continue;
      if (!this.sim.system.WereBodiesInContact(this.chassis.GetID(), target.body.GetID()) && !this.wheels.some((w) => this.sim.system.WereBodiesInContact(w.body.GetID(), target.body.GetID()))) continue;
      const relative = this.impactVelocity;
      const bounds = target.body.GetWorldSpaceBounds(), lo = bounds.mMin, min = [lo.GetX(), lo.GetY(), lo.GetZ()], hi = bounds.mMax, max = [hi.GetX(), hi.GetY(), hi.GetZ()];
      const point = position.map((n, i) => Math.max(min[i], Math.min(max[i], n)));
      const normal = point.map((n, i) => n - position[i]), distance = Math.hypot(...normal);
      const closing = distance > 0.01 ? Math.max(0, relative.reduce((sum, n, i) => sum + n * normal[i] / distance, 0)) : Math.hypot(...relative);
      if (closing < 2.5 || 0.5 * this.ramMass * closing * closing * this.ramStrength < 25e3) continue;
      this.sim.impactFracture(target, point, 0.5 * this.ramMass * closing * closing * this.ramStrength, 25e3);
      if (++hits >= 2) break;
    }
    if (hits) this.ramCooldown = 0.18;
  }
  // Gameplay recoil is capped independently of shell momentum to keep the vehicle controllable.
  fire() {
    for (const cannon of this.parts.filter((p) => p.kind === "cannon")) {
      const rotation = this.chassis.GetRotation(), q = [rotation.GetX(), rotation.GetY(), rotation.GetZ(), rotation.GetW()], p = this.chassis.GetPosition(), v = this.chassis.GetLinearVelocity();
      const { muzzle, velocity, direction } = cannonLaunch(cannon.p, [p.GetX(), p.GetY(), p.GetZ()], q, [v.GetX(), v.GetY(), v.GetZ()], this.controls.yaw, this.controls.pitch);
      const shot = this.sim.launchProjectile(muzzle, velocity, CANNON_BALLISTICS.mass, CANNON_BALLISTICS.radius);
      if (shot) {
        shot.body.GetMotionProperties().SetLinearDamping(CANNON_BALLISTICS.linearDamping);
        const J = this.sim.J, impulse = new J.Vec3(...direction.map((n) => -n * 2e3));
        this.sim.bodies.ActivateBody(this.chassis.GetID());
        this.chassis.AddImpulse(impulse);
        J.destroy(impulse);
      }
      this.fireCooldown = 1.1;
    }
  }
  dispose() {
    for (const c of this.constraints) this.sim.system.RemoveConstraint(c);
    this.constraints = [];
    for (const item of this.ownedItems) if (!item.fractured && !item.retired) {
      this.sim.removeVehicleBody?.(item);
      item.retired = true;
      item.fractured = true;
    }
    this.ownedItems = [];
    this.wheels = [];
  }
};

// src/demo-driving.ts
var TAU = Math.PI * 2;
var ORBIT_RADIUS = 25;
var ORBIT_RATE = 0.16;
var GRAVITY = CANNON_BALLISTICS.gravity;
var MUZZLE_SPEED = CANNON_BALLISTICS.speed;
var clamp = (value, min, max) => Math.max(min, Math.min(max, value));
var wrapAngle = (angle) => Math.atan2(Math.sin(angle), Math.cos(angle));
function demoVehicleControls(position, quaternion, target, elapsed, orbitRadius = ORBIT_RADIUS, aimTarget = target) {
  const [x, , z] = position;
  const [qx, qy, qz, qw] = quaternion;
  const bodyYaw = Math.atan2(2 * (qx * qz + qw * qy), 1 - 2 * (qx * qx + qy * qy));
  const phase = 0.45 + elapsed * ORBIT_RATE;
  const waypoint = [target[0] + Math.sin(phase) * orbitRadius, 0, target[2] + Math.cos(phase) * orbitRadius];
  let dx = waypoint[0] - x;
  let dz = waypoint[2] - z;
  const distance = Math.hypot(dx, dz);
  const radialX = x - target[0], radialZ = z - target[2], radialDistance = Math.hypot(radialX, radialZ);
  if (radialDistance < orbitRadius - 4) {
    const outward = Math.max(0, orbitRadius - 4 - radialDistance);
    const invRadius = radialDistance > 1e-3 ? 1 / radialDistance : 0;
    dx += radialX * invRadius * outward * 1.8;
    dz += radialZ * invRadius * outward * 1.8;
  }
  const desiredYaw = Math.atan2(-dx, -dz);
  const headingError = wrapAngle(desiredYaw - bodyYaw);
  const steer = clamp(headingError * 1.8, -1, 1);
  const throttle = clamp(0.88 - Math.abs(headingError) * 0.62 - Math.max(0, 8 - distance) * 0.015, 0.24, 0.9);
  const aimX = aimTarget[0] - x;
  const aimY = aimTarget[1] - position[1];
  const aimZ = aimTarget[2] - z;
  const horizontal = Math.hypot(aimX, aimZ);
  const ballisticRise = horizontal > 1e-3 ? GRAVITY * horizontal * horizontal / (2 * MUZZLE_SPEED * MUZZLE_SPEED) : 0;
  const aimPitch = Math.atan2(aimY + ballisticRise, Math.max(horizontal, 1e-3));
  const flatDirection = horizontal > 1e-3 ? [aimX / horizontal * Math.cos(aimPitch), Math.sin(aimPitch), aimZ / horizontal * Math.cos(aimPitch)] : [0, Math.sin(aimPitch), -Math.cos(aimPitch)];
  const localDirection = rotateByQuaternion(flatDirection, [-qx, -qy, -qz, qw]);
  const yaw = Math.atan2(-localDirection[0], -localDirection[2]);
  const pitch = Math.asin(clamp(localDirection[1], -1, 1));
  return {
    throttle,
    steer,
    brake: false,
    fire: elapsed >= 3,
    yaw: clamp(yaw, -Math.PI, Math.PI),
    pitch: clamp(pitch, -0.35, 0.7)
  };
}

// src/attack-vehicle.ts
var STRUCTURAL = /* @__PURE__ */ new Set(["foundation", "column", "wall", "doorway", "deck", "slab", "stairwell", "stair", "truss", "girder", "brace", "facade", "core"]);
var AttackVehicle = class {
  constructor(sim) {
    this.sim = sim;
    const structural = (sim.items ?? []).filter((item) => item.id > 0 && STRUCTURAL.has(item.sourceKind ?? item.kind));
    this.center = structural.length ? structural.reduce((out, item) => out.map((v, i) => v + item.initial[i] / structural.length), [0, 0, 0]) : [0, 0, 0];
    let footprint = 0;
    for (const item of structural) {
      footprint = Math.max(footprint, Math.hypot(item.initial[0] - this.center[0], item.initial[2] - this.center[2]));
      const bounds = item.body.GetWorldSpaceBounds?.();
      if (bounds) {
        const lo = bounds.mMin, hi = bounds.mMax;
        for (const x of [lo.GetX(), hi.GetX()]) for (const z of [lo.GetZ(), hi.GetZ()]) footprint = Math.max(footprint, Math.hypot(x - this.center[0], z - this.center[2]));
      }
    }
    this.orbitRadius = Math.max(25, footprint + 12);
    const origin = this.safeSpawn();
    this.vehicle = new VehiclePhysics(sim, VEHICLE_PRESETS[2].parts, origin, -6e4);
  }
  sim;
  vehicle;
  center;
  orbitRadius;
  enabled = true;
  shots = 0;
  elapsed = 0;
  targetIndex = 0;
  safeSpawn() {
    const trees = simTrees(this.sim);
    for (let n = 0; n < 16; n++) {
      const angle = 0.45 + n * Math.PI * 2 / 16;
      const candidate = [this.center[0] + Math.sin(angle) * this.orbitRadius, 0, this.center[2] + Math.cos(angle) * this.orbitRadius];
      const player = this.sim.vehicle?.chassis?.GetPosition?.();
      if (player && Math.hypot(candidate[0] - player.GetX(), candidate[2] - player.GetZ()) < 18) continue;
      if (trees.some((tree) => Math.hypot(candidate[0] - tree.spec.x, candidate[2] - tree.spec.z) < 5)) continue;
      return candidate;
    }
    return [this.center[0], 0, this.center[2] + this.orbitRadius];
  }
  target() {
    const targets = (this.sim.items ?? []).filter((item2) => item2.id > 0 && !item2.fractured && !item2.retired && item2.kind !== "foundation" && STRUCTURAL.has(item2.sourceKind ?? item2.kind) && item2.body.GetCenterOfMassPosition().GetY() > 0.5);
    if (!targets.length) return [this.center[0], 3, this.center[2]];
    const item = targets[this.targetIndex % targets.length];
    const p = item.body.GetCenterOfMassPosition();
    return [p.GetX(), p.GetY(), p.GetZ()];
  }
  step(dt) {
    this.elapsed += dt;
    if (!this.enabled) {
      this.vehicle.controls = { ...this.vehicle.controls, throttle: 0, steer: 0, brake: true, fire: false };
      this.vehicle.step(dt);
      return;
    }
    const p = this.vehicle.chassis.GetPosition(), q = this.vehicle.chassis.GetRotation();
    const aim = this.target();
    const controls = demoVehicleControls([p.GetX(), p.GetY(), p.GetZ()], [q.GetX(), q.GetY(), q.GetZ(), q.GetW()], this.center, this.elapsed, this.orbitRadius, aim);
    this.vehicle.controls = controls;
    const projectilesBefore = this.sim.projectiles ?? 0;
    this.vehicle.step(dt);
    const projectilesAfter = this.sim.projectiles ?? 0;
    if (projectilesAfter > projectilesBefore) {
      this.shots += projectilesAfter - projectilesBefore;
      this.targetIndex++;
    }
  }
  afterStep() {
    this.vehicle.afterStep();
  }
  setEnabled(enabled) {
    this.enabled = !!enabled;
    if (!this.enabled) this.vehicle.controls.fire = false;
  }
  dispose() {
    this.vehicle.dispose();
  }
};
function simTrees(sim) {
  return sim.trees?.trees ?? [];
}

// src/own-engine/compatibility.mjs
var compiled;
var nextPointer = 1;
var kernelModules = /* @__PURE__ */ new Map();
var selectedInfo = {};
var dot = (a, b) => a.reduce((s, v, i) => s + v * b[i], 0);
var add = (a, b) => a.map((v, i) => v + b[i]);
var sub = (a, b) => a.map((v, i) => v - b[i]);
var mul = (a, k) => a.map((v) => v * k);
var cross = (a, b) => [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]];
var unit = (a) => mul(a, 1 / (Math.hypot(...a) || 1));
var qmul = (a, b) => [a[3] * b[0] + a[0] * b[3] + a[1] * b[2] - a[2] * b[1], a[3] * b[1] - a[0] * b[2] + a[1] * b[3] + a[2] * b[0], a[3] * b[2] + a[0] * b[1] - a[1] * b[0] + a[2] * b[3], a[3] * b[3] - a[0] * b[0] - a[1] * b[1] - a[2] * b[2]];
var rotate2 = (q, v) => {
  const t = mul(cross(q, v), 2);
  return add(v, add(mul(t, q[3]), cross(q, t)));
};
var qinv = (q) => [-q[0], -q[1], -q[2], q[3]];
var xyz2 = (v) => [v.GetX(), v.GetY(), v.GetZ()];
var xyzw = (v) => [v.GetX(), v.GetY(), v.GetZ(), v.GetW()];
var eye = [1, 0, 0, 0, 1, 0, 0, 0, 1];
var zeros = () => Array(9).fill(0);
var matrixAdd = (a, b) => a.map((v, i) => v + b[i]);
var tensorOffset = (m, r) => Array.from({ length: 9 }, (_, k) => m * ((Math.floor(k / 3) === k % 3 ? dot(r, r) : 0) - r[Math.floor(k / 3)] * r[k % 3]));
function tensorRotate(I, q) {
  const axes = [[1, 0, 0], [0, 1, 0], [0, 0, 1]].map((v) => rotate2(q, v));
  return Array.from({ length: 9 }, (_, k) => axes.reduce((s, a, i) => s + axes.reduce((t, b, j) => t + a[Math.floor(k / 3)] * I[i * 3 + j] * b[k % 3], 0), 0));
}
var Owned = class {
  constructor() {
    this.ptr = nextPointer++;
  }
  AddRef() {
  }
  Release() {
  }
};
var Vec3 = class extends Owned {
  constructor(x = 0, y = 0, z = 0) {
    super();
    this.Set(x, y, z);
  }
  GetX() {
    return this.x;
  }
  GetY() {
    return this.y;
  }
  GetZ() {
    return this.z;
  }
  Set(x, y, z) {
    this.x = x;
    this.y = y;
    this.z = z;
    return this;
  }
  Length() {
    return Math.hypot(this.x, this.y, this.z);
  }
  LengthSq() {
    return this.x * this.x + this.y * this.y + this.z * this.z;
  }
};
var Quat = class _Quat extends Vec3 {
  constructor(x = 0, y = 0, z = 0, w = 1) {
    super(x, y, z);
    this.w = w;
  }
  GetW() {
    return this.w;
  }
  Set(x, y, z, w = 1) {
    super.Set(x, y, z);
    this.w = w;
    return this;
  }
  sRotation(axis, angle) {
    const a = unit(xyz2(axis)), s = Math.sin(angle * 0.5);
    return new _Quat(...mul(a, s), Math.cos(angle * 0.5));
  }
  sIdentity() {
    return new _Quat();
  }
};
var ReadVec = class {
  constructor(array, start, w = false) {
    this.a = array;
    this.o = start;
    this.q = w;
  }
  GetX() {
    return this.a[this.o];
  }
  GetY() {
    return this.a[this.o + 1];
  }
  GetZ() {
    return this.a[this.o + 2];
  }
  GetW() {
    return this.q ? this.a[this.o + 3] : 0;
  }
  Length() {
    return Math.hypot(this.GetX(), this.GetY(), this.GetZ());
  }
  LengthSq() {
    return this.GetX() ** 2 + this.GetY() ** 2 + this.GetZ() ** 2;
  }
};
function hull(points) {
  const vs = points.map((p) => [...p]);
  if (vs.length < 4 || vs.length > 40) throw Error(`KINETIC: convex hull requires 4..40 vertices (got ${vs.length})`);
  const faces = [], edges = [];
  for (let i = 0; i < vs.length; i++) for (let j = i + 1; j < vs.length; j++) for (let k = j + 1; k < vs.length; k++) {
    let normal = cross(sub(vs[j], vs[i]), sub(vs[k], vs[i]));
    if (Math.hypot(...normal) < 1e-8) continue;
    normal = unit(normal);
    let d = dot(normal, vs[i]), pos = false, neg = false;
    for (const v2 of vs) {
      const e = dot(normal, v2) - d;
      if (e > 1e-5) pos = true;
      else if (e < -1e-5) neg = true;
    }
    if (pos && neg) continue;
    if (pos) {
      normal = mul(normal, -1);
      d = -d;
    }
    if (faces.some((f) => dot(f.n, normal) > 0.99999 && Math.abs(f.d - d) < 1e-4)) continue;
    const ids = vs.map((v2, id) => ({ v: v2, id })).filter(({ v: v2 }) => Math.abs(dot(normal, v2) - d) < 1e-4), center2 = ids.reduce((s, a) => add(s, mul(a.v, 1 / ids.length)), [0, 0, 0]), u = unit(sub(ids[0].v, center2)), v = cross(normal, u);
    ids.sort((a, b) => Math.atan2(dot(sub(a.v, center2), v), dot(sub(a.v, center2), u)) - Math.atan2(dot(sub(b.v, center2), v), dot(sub(b.v, center2), u)));
    faces.push({ n: normal, d, ids: ids.map((a) => a.id) });
  }
  let volume = 0, first = [0, 0, 0], raw = zeros();
  for (const face of faces) {
    const ids = face.ids;
    for (let i = 1; i + 1 < ids.length; i++) {
      const a = vs[ids[0]], b = vs[ids[i]], c = vs[ids[i + 1]], vol = dot(a, cross(b, c)) / 6;
      volume += vol;
      first = add(first, mul(add(add(a, b), c), vol / 4));
      const square = (axis) => vol / 10 * (a[axis] ** 2 + b[axis] ** 2 + c[axis] ** 2 + a[axis] * b[axis] + a[axis] * c[axis] + b[axis] * c[axis]);
      const product = (x2, y2) => vol / 20 * (2 * (a[x2] * a[y2] + b[x2] * b[y2] + c[x2] * c[y2]) + a[x2] * b[y2] + a[y2] * b[x2] + a[x2] * c[y2] + a[y2] * c[x2] + b[x2] * c[y2] + b[y2] * c[x2]);
      const [x, y, z] = [square(0), square(1), square(2)], xy = -product(0, 1), xz = -product(0, 2), yz = -product(1, 2);
      raw = matrixAdd(raw, [y + z, xy, xz, xy, x + z, yz, xz, yz, x + y]);
    }
  }
  if (!(volume > 1e-10)) throw Error("KINETIC: degenerate or nonconvex hull");
  const center = mul(first, 1 / volume), I = sub(raw, tensorOffset(volume, center)).map((n) => n / volume);
  for (const f of faces) for (let i = 0; i < f.ids.length; i++) {
    const e = unit(sub(vs[f.ids[(i + 1) % f.ids.length]], vs[f.ids[i]]));
    if (!edges.some((x) => Math.abs(dot(x, e)) > 0.99999)) edges.push(e);
  }
  if (faces.length > 48 || edges.length > 64) throw Error("KINETIC: hull plane/edge capacity exceeded");
  return { vs, faces, edges, volume, center, I };
}
var Shape = class extends Owned {
  constructor(primitives) {
    super();
    this.primitives = primitives;
    this.massProperties = properties(primitives);
    this.native = /* @__PURE__ */ new WeakMap();
  }
  GetCenterOfMass() {
    return new Vec3(...this.massProperties.center);
  }
  GetSubType() {
    return this.primitives[0]?.kind ?? 0;
  }
  GetRadius() {
    return this.primitives[0].h[0];
  }
  GetMassProperties() {
    return { mMass: this.massProperties.mass };
  }
};
function properties(parts) {
  let total = 0, center = [0, 0, 0];
  const entries = parts.map((p) => {
    let volume, c = [0, 0, 0], I2 = zeros();
    if (p.kind === 0) {
      const [x, y, z] = p.h.map((x2) => x2 * 2);
      volume = x * y * z;
      I2 = [(y * y + z * z) / 12, 0, 0, 0, (x * x + z * z) / 12, 0, 0, 0, (x * x + y * y) / 12];
    } else if (p.kind === 1) {
      volume = 4 / 3 * Math.PI * p.h[0] ** 3;
      I2 = eye.map((v) => v * 0.4 * p.h[0] ** 2);
    } else {
      ({ volume, center: c, I: I2 } = p.hull);
      if (p.cylinder) {
        const { r, h } = p.cylinder;
        I2 = [(3 * r * r + 4 * h * h) / 12, 0, 0, 0, r * r / 2, 0, 0, 0, (3 * r * r + 4 * h * h) / 12];
      }
    }
    const m = volume * (p.density ?? 1e3), pos = add(p.c, rotate2(p.q, c));
    total += m;
    center = add(center, mul(pos, m));
    return { m, c: pos, I: tensorRotate(I2, p.q).map((v) => v * m) };
  });
  if (!(total > 0)) throw Error("KINETIC: shape mass must be positive");
  center = mul(center, 1 / total);
  let I = zeros();
  for (const e of entries) I = matrixAdd(I, matrixAdd(e.I, tensorOffset(e.m, sub(e.c, center))));
  return { mass: total, center, I: I.map((v) => v / total) };
}
var BoxShape = class extends Shape {
  constructor(half, _margin = 0) {
    super([{ kind: 0, h: xyz2(half), c: [0, 0, 0], q: [0, 0, 0, 1] }]);
  }
};
var SphereShape = class extends Shape {
  constructor(radius) {
    if (!(Number.isFinite(radius) && radius > 0)) throw Error("Invalid sphere radius");
    super([{ kind: 1, h: [radius, radius, radius], c: [0, 0, 0], q: [0, 0, 0, 1] }]);
  }
};
var CylinderShape = class extends Shape {
  constructor(halfHeight, radius, _margin) {
    const vs = [];
    for (const y of [-halfHeight, halfHeight]) for (let i = 0; i < 16; i++) {
      const a = i * 2 * Math.PI / 16;
      vs.push([radius * Math.cos(a), y, radius * Math.sin(a)]);
    }
    super([{ kind: 3, h: [radius, halfHeight, radius], hull: hull(vs), c: [0, 0, 0], q: [0, 0, 0, 1], cylinder: { r: radius, h: halfHeight } }]);
  }
};
var ShapeResult = class extends Owned {
  constructor(shape, error) {
    super();
    this.shape = shape;
    this.error = error;
  }
  IsValid() {
    return !!this.shape;
  }
  Get() {
    if (!this.shape) throw Error(this.error || "Invalid shape");
    return this.shape;
  }
  Clear() {
    this.shape = void 0;
  }
};
var BoxShapeSettings = class extends Owned {
  constructor(half, margin = 0) {
    super();
    this.half = xyz2(half);
    this.margin = margin;
    this.mDensity = 1e3;
  }
  Create() {
    const shape = new BoxShape(new Vec3(...this.half), this.margin);
    shape.primitives[0].density = this.mDensity;
    shape.massProperties = properties(shape.primitives);
    return new ShapeResult(shape);
  }
};
var ConvexHullShapeSettings = class extends Owned {
  constructor() {
    super();
    this.mPoints = { data: [], push_back: (v) => this.mPoints.data.push(xyz2(v)) };
  }
  Create() {
    try {
      const h = hull(this.mPoints.data), bounds = [0, 1, 2].map((i) => Math.max(...h.vs.map((v) => Math.abs(v[i]))));
      return new ShapeResult(new Shape([{ kind: 2, h: bounds, hull: h, c: [0, 0, 0], q: [0, 0, 0, 1] }]));
    } catch (e) {
      return new ShapeResult(void 0, e.message);
    }
  }
};
var StaticCompoundShapeSettings = class extends Owned {
  constructor() {
    super();
    this.children = [];
  }
  AddShape(p, q, shape) {
    const source = shape instanceof Shape ? shape : shape.Create().Get();
    this.children.push({ p: xyz2(p), q: xyzw(q), shape: source });
  }
  Create() {
    const parts = this.children.flatMap((s) => s.shape.primitives.map((p) => ({ ...p, c: add(s.p, rotate2(s.q, p.c)), q: qmul(s.q, p.q) })));
    return new ShapeResult(new Shape(parts));
  }
};
var CapsuleShapeSettings = class extends Owned {
  constructor(half, radius) {
    super();
    this.half = half;
    this.radius = radius;
  }
  Create() {
    const s = new Owned();
    s.half = this.half;
    s.radius = this.radius;
    return new ShapeResult(s);
  }
};
var CollisionGroup = class {
  constructor() {
    this.filter = null;
    this.group = 0;
    this.sub = 0;
  }
  SetGroupFilter(f) {
    this.filter = f;
  }
  SetGroupID(id) {
    this.group = id;
  }
  SetSubGroupID(id) {
    this.sub = id;
  }
  GetSubGroupID() {
    return this.sub;
  }
  GetGroupID() {
    return this.group;
  }
};
var GroupFilterTable = class extends Owned {
  constructor(capacity) {
    super();
    this.capacity = capacity;
    this.worlds = /* @__PURE__ */ new Set();
    this.disabled = /* @__PURE__ */ new Set();
  }
  DisableCollision(a, b) {
    const k = a < b ? `${a}:${b}` : `${b}:${a}`;
    this.disabled.add(k);
    for (const w of this.worlds) {
      const A = w.byGroup.get(a), B = w.byGroup.get(b);
      if (A && B) w.k.collision_filter(A.id, B.id, 1);
    }
  }
  EnableCollision(a, b) {
    this.disabled.delete(a < b ? `${a}:${b}` : `${b}:${a}`);
    for (const w of this.worlds) {
      const A = w.byGroup.get(a), B = w.byGroup.get(b);
      if (A && B) w.k.collision_filter(A.id, B.id, 0);
    }
  }
};
var BodyCreationSettings = class extends Owned {
  constructor(shape, p, q, motion, layer) {
    super();
    this.shape = shape;
    this.position = xyz2(p);
    this.rotation = xyzw(q);
    this.motion = motion;
    this.layer = layer;
    this.mMassPropertiesOverride = { mMass: shape.massProperties?.mass ?? 1 };
    this.mCollisionGroup = new CollisionGroup();
    this.mFriction = 0.55;
    this.mRestitution = 0.03;
    this.mLinearDamping = 0.08;
    this.mAngularDamping = 0.14;
    this.mAllowSleeping = true;
    this.mMotionQuality = 0;
  }
};
var BodyID = class {
  constructor(b) {
    this.body = b;
  }
  GetIndex() {
    return this.body.id;
  }
  GetIndexAndSequenceNumber() {
    return this.body.id + this.body.generation * 8192;
  }
};
var Body = class extends Owned {
  constructor(world, settings, id) {
    super();
    this.world = world;
    this.id = id;
    this.generation = world.serial++;
    this.settings = settings;
    this.group = settings.mCollisionGroup;
    this.state = new Float32Array(world.k.memory.buffer, world.k.body_ptr(id), 32);
    this.position = new ReadVec(this.state, 0);
    this.rotation = new ReadVec(this.state, 3, true);
    this.linear = new ReadVec(this.state, 7);
    this.angular = new ReadVec(this.state, 10);
    this.com = new ReadVec(this.state, 19);
    this.bounds = { mMin: new ReadVec(this.state, 13), mMax: new ReadVec(this.state, 16) };
    this.nativeID = new BodyID(this);
    this.linearDamping = settings.mLinearDamping;
    this.angularDamping = settings.mAngularDamping;
  }
  GetID() {
    return this.nativeID;
  }
  GetShape() {
    return this.settings.shape;
  }
  GetPosition() {
    return this.position;
  }
  GetRotation() {
    return this.rotation;
  }
  GetLinearVelocity() {
    return this.linear;
  }
  GetAngularVelocity() {
    return this.angular;
  }
  GetCenterOfMassPosition() {
    return this.com;
  }
  GetWorldSpaceBounds() {
    return this.bounds;
  }
  GetCollisionGroup() {
    return this.group;
  }
  GetMotionType() {
    return this.state[23];
  }
  IsActive() {
    return !!this.state[22];
  }
  GetAllowSleeping() {
    return !!this.state[25];
  }
  GetMotionProperties() {
    return this;
  }
  SetLinearVelocity(v) {
    this.world.k.body_velocity(this.id, ...xyz2(v), 0);
  }
  SetAngularVelocity(v) {
    this.world.k.body_velocity(this.id, ...xyz2(v), 1);
  }
  AddForce(v) {
    this.world.k.body_force(this.id, ...xyz2(v), 0);
  }
  AddTorque(v) {
    this.world.k.body_force(this.id, ...xyz2(v), 1);
  }
  AddImpulse(v, p) {
    this.world.k.body_impulse(this.id, ...xyz2(v), ...p ? xyz2(p) : [0, 0, 0], p ? 1 : 0);
  }
  SetFriction(v) {
    this.world.k.body_option(this.id, 0, v);
  }
  SetRestitution(v) {
    this.world.k.body_option(this.id, 1, v);
  }
  SetAllowSleeping(v) {
    this.world.k.body_option(this.id, 4, +v);
  }
  ResetSleepTimer() {
    this.world.k.body_option(this.id, 10, 0);
  }
  SetGravityFactor(v) {
    this.world.k.body_option(this.id, 5, v);
  }
  SetLinearDamping(v) {
    this.linearDamping = v;
    this.world.k.body_option(this.id, 2, v);
  }
  SetAngularDamping(v) {
    this.angularDamping = v;
    this.world.k.body_option(this.id, 3, v);
  }
  GetLinearDamping() {
    return this.linearDamping;
  }
  GetAngularDamping() {
    return this.angularDamping;
  }
  ScaleToMass(v) {
    this.world.k.body_mass(this.id, v);
  }
  ResetForce() {
    this.world.k.body_option(this.id, 8, 0);
  }
  ResetTorque() {
    this.world.k.body_option(this.id, 9, 0);
  }
  GetInverseMass() {
    return this.GetMotionType() === 2 ? 1 / this.state[24] : 0;
  }
};
var Joint = class extends Owned {
  constructor(world, id, kind) {
    super();
    this.world = world;
    this.id = id;
    this.kind = kind;
    this.state = new Float32Array(world.k.memory.buffer, world.k.joint_ptr(id), 8);
    this.linear = new ReadVec(this.state, 0);
    this.angular = new ReadVec(this.state, 3);
    this.motor = 0;
    this.target = 0;
  }
  SetEnabled(v) {
    this.world.k.joint_enable(this.id, +v);
  }
  GetTotalLambdaPosition() {
    return this.kind === 2 ? this.state[6] : this.linear;
  }
  GetTotalLambdaRotation() {
    return this.angular;
  }
  SetRotationLimits(lo, hi) {
    this.world.k.joint_limits(this.id, ...xyz2(lo), ...xyz2(hi));
  }
  SetMaxFriction(axis, f) {
    this.world.k.joint_friction(this.id, axis, f);
  }
  SetMotorState(v) {
    this.motor = v;
    this.world.k.joint_motor(this.id, v, this.target);
  }
  SetTargetAngularVelocity(v) {
    this.target = v;
    this.world.k.joint_motor(this.id, this.motor, v);
  }
  GetMinDistance() {
    return this.minDistance ?? 0;
  }
  GetMaxDistance() {
    return this.maxDistance ?? 1;
  }
  GetSubType() {
    return this.kind;
  }
  SetConstraintPriority() {
  }
  GetConstraintPriority() {
    return 0;
  }
};
var ConstraintSettings = class extends Owned {
  constructor(kind) {
    super();
    this.kind = kind;
    this.mPoint1 = this.mPosition1 = new Vec3();
    this.mPoint2 = this.mPosition2 = new Vec3();
    this.mHingeAxis1 = new Vec3(1, 0, 0);
    this.mHingeAxis2 = new Vec3(1, 0, 0);
    this.mNormalAxis1 = new Vec3(0, 1, 0);
    this.mNormalAxis2 = new Vec3(0, 1, 0);
    this.mMotorSettings = { mMinTorqueLimit: -1e3, mMaxTorqueLimit: 1e3 };
    this.mMinDistance = 0;
    this.mMaxDistance = 1;
  }
  MakeFixedAxis() {
  }
  Create(a, b) {
    if (a.world !== b.world) throw Error("KINETIC: cross-world constraint");
    const world = a.world, id = world.k.joint_new(a.id, b.id, this.kind, ...xyz2(this.mPoint1), ...xyz2(this.mPoint2));
    world.check();
    const j = new Joint(world, id, this.kind);
    if (this.kind === 2) {
      world.k.joint_distance(id, this.mMinDistance, this.mMaxDistance);
      j.minDistance = this.mMinDistance;
      j.maxDistance = this.mMaxDistance;
    }
    if (this.kind === 3) world.k.joint_hinge(id, ...xyz2(this.mHingeAxis1), ...xyz2(this.mHingeAxis2), this.mMotorSettings.mMinTorqueLimit, this.mMotorSettings.mMaxTorqueLimit);
    world.joints.add(j);
    return j;
  }
};
var PointConstraintSettings = class extends ConstraintSettings {
  constructor() {
    super(1);
  }
};
var SixDOFConstraintSettings = class extends ConstraintSettings {
  constructor() {
    super(0);
  }
};
var DistanceConstraintSettings = class extends ConstraintSettings {
  constructor() {
    super(2);
  }
};
var HingeConstraintSettings = class extends ConstraintSettings {
  constructor() {
    super(3);
  }
};
var WorldSettings = class extends Owned {
  constructor() {
    super();
    this.mMaxWorkerThreads = 0;
  }
};
var StateRecorderImpl = class extends Owned {
  Rewind() {
  }
};
var KineticWorld = class extends Owned {
  constructor(settings) {
    super();
    if (!compiled) throw Error("KINETIC is not loaded");
    this.instance = new WebAssembly.Instance(compiled, {});
    this.k = this.instance.exports;
    const mem = this.k.memory.buffer;
    this.k.__wasm_call_ctors();
    this.bodies = /* @__PURE__ */ new Map();
    this.byGroup = /* @__PURE__ */ new Map();
    this.joints = /* @__PURE__ */ new Set();
    this.geometries = /* @__PURE__ */ new WeakMap();
    this.shapes = /* @__PURE__ */ new WeakMap();
    this.serial = 1;
    this.gravity = new Vec3(0, -9.81, 0);
    this.settings = { mNumVelocitySteps: 24, mNumPositionSteps: 3 };
    this.filters = settings;
    this.scratch = new Float32Array(mem, this.k.scratch_ptr(), 512);
  }
  check() {
    const code = this.k.error();
    if (code) throw Error(`KINETIC kernel error ${code}: ${["", "body capacity", "joint capacity", "shape capacity", "primitive capacity", "convex geometry capacity", "contact capacity", "non-finite simulation"][code] ?? "unknown"}`);
  }
  compileShape(shape) {
    if (this.k.counts(3) + 1 >= 16384 || this.k.counts(4) + shape.primitives.length >= 65536 || this.k.geometry_count() + shape.primitives.length >= 8192) {
      this.k.compact_shapes();
      this.shapes = /* @__PURE__ */ new WeakMap();
      this.geometries = /* @__PURE__ */ new WeakMap();
    }
    let id = this.shapes.get(shape);
    if (id !== void 0) return id;
    const m = shape.massProperties;
    this.scratch.set(m.I, 0);
    id = this.k.shape_new(...m.center);
    for (const p of shape.primitives) {
      let g = -1;
      if (p.kind === 2 || p.kind === 3) {
        g = this.geometries.get(p.hull);
        if (g === void 0) {
          g = this.k.geom_new();
          for (const v of p.hull.vs) this.k.geom_vertex(g, ...v);
          for (const f of p.hull.faces) this.k.geom_face(g, ...f.n, f.d);
          for (const e of p.hull.edges) this.k.geom_edge(g, ...e);
          this.geometries.set(p.hull, g);
        }
      }
      this.k.shape_primitive(id, p.kind, g, ...p.c, ...p.q, ...p.h);
    }
    this.check();
    this.shapes.set(shape, id);
    return id;
  }
  GetPhysicsSystem() {
    return this;
  }
  GetBodyInterface() {
    return this;
  }
  GetObjectVsBroadPhaseLayerFilter() {
    return this.filters.mObjectVsBroadPhaseLayerFilter;
  }
  GetObjectLayerPairFilter() {
    return this.filters.mObjectLayerPairFilter;
  }
  GetTempAllocator() {
    return null;
  }
  GetPhysicsSettings() {
    return { ...this.settings };
  }
  SetPhysicsSettings(p) {
    this.settings = { ...p };
    this.k.set_iterations(p.mNumVelocitySteps, p.mNumPositionSteps);
  }
  GetGravity() {
    return this.gravity;
  }
  SetGravity(v) {
    this.gravity.Set(...xyz2(v));
    this.k.set_gravity(...xyz2(v));
  }
  CreateBody(s) {
    const shape = this.compileShape(s.shape), mass = s.mMassPropertiesOverride.mMass, id = this.k.body_new(shape, ...s.position, ...s.rotation, mass, s.motion, s.mCollisionGroup.group, s.mCollisionGroup.filter?.ptr ?? 0, s.layer);
    this.check();
    const body = new Body(this, s, id);
    this.bodies.set(id, body);
    this.byGroup.set(s.mCollisionGroup.sub, body);
    s.mCollisionGroup.filter?.worlds.add(this);
    for (const [opt, val] of [[0, s.mFriction], [1, s.mRestitution], [2, s.mLinearDamping], [3, s.mAngularDamping], [4, +s.mAllowSleeping], [6, s.mMotionQuality]]) this.k.body_option(id, opt, val);
    return body;
  }
  AddBody(id, activate) {
    this.k.body_added(id.body.id, 1);
    if (!activate) this.k.body_option(id.body.id, 11, 0);
  }
  RemoveBody(id) {
    this.k.body_added(id.body.id, 0);
  }
  DestroyBody(id) {
    this.k.body_destroy(id.body.id);
    this.bodies.delete(id.body.id);
    this.byGroup.delete(id.body.group.sub);
  }
  ActivateBody(id) {
    this.k.body_option(id.body.id, 10, 0);
  }
  DeactivateBody(id) {
    this.k.body_option(id.body.id, 11, 0);
  }
  SetPositionAndRotation(id, p, q, activate) {
    this.k.body_pose(id.body.id, ...xyz2(p), ...xyzw(q), +activate);
  }
  SetPosition(id, p, activate) {
    this.SetPositionAndRotation(id, p, id.body.GetRotation(), activate);
  }
  SetRotation(id, q, activate) {
    this.SetPositionAndRotation(id, id.body.GetPosition(), q, activate);
  }
  IsAdded(id) {
    return !!id.body.state[26];
  }
  SetShape(id, shape, _mass, activate) {
    id.body.settings.shape = shape;
    this.k.body_shape(id.body.id, this.compileShape(shape));
    if (activate) this.ActivateBody(id);
  }
  SetMotionType(id, type, activate) {
    this.k.body_option(id.body.id, 7, type);
    if (activate) this.ActivateBody(id);
  }
  MoveKinematic(id, p, q, dt) {
    const body = id.body, d = mul(sub(xyz2(p), xyz2(body.GetPosition())), 1 / dt), rotation = qmul(xyzw(q), qinv(xyzw(body.GetRotation()))), sign = rotation[3] >= 0 ? 1 : -1;
    body.SetLinearVelocity(new Vec3(...d));
    body.SetAngularVelocity(new Vec3(...mul(rotation.slice(0, 3), 2 * sign / dt)));
    this.ActivateBody(id);
  }
  AddConstraint(c) {
    c.SetEnabled(true);
  }
  RemoveConstraint(c) {
    if (!this.joints.has(c)) return;
    this.k.joint_remove(c.id);
    this.joints.delete(c);
  }
  WereBodiesInContact(a, b) {
    return !!this.k.were_contact(a.body.id, b.body.id);
  }
  Step(dt, _steps) {
    const err = this.k.step(dt);
    if (err) this.check();
  }
  GetNarrowPhaseQuery() {
    return this;
  }
  CastRay(ray, _settings, collector) {
    const id = this.k.raycast(...xyz2(ray.mOrigin), ...xyz2(ray.mDirection));
    collector.hit = id >= 0 ? { mBodyID: this.bodies.get(id).GetID(), mFraction: this.scratch[0] } : null;
  }
  SaveState(recorder) {
    recorder.signature = this.signature();
    recorder.bodyBytes = new Uint8Array(this.k.memory.buffer, this.k.state_start(), this.k.state_size()).slice();
    recorder.jointBytes = new Uint8Array(this.k.memory.buffer, this.k.joints_start(), this.k.joints_size()).slice();
    recorder.gravity = xyz2(this.gravity);
  }
  RestoreState(recorder) {
    if (!recorder.bodyBytes || recorder.signature !== this.signature()) return false;
    new Uint8Array(this.k.memory.buffer, this.k.state_start(), this.k.state_size()).set(recorder.bodyBytes);
    new Uint8Array(this.k.memory.buffer, this.k.joints_start(), this.k.joints_size()).set(recorder.jointBytes);
    this.SetGravity(new Vec3(...recorder.gravity));
    return true;
  }
  signature() {
    return JSON.stringify([...this.bodies.values()].map((b) => [b.settings.shape.primitives.length, b.state[24], b.group.sub])) + JSON.stringify([...this.joints].map((j) => j.kind));
  }
  dispose() {
    for (const b of this.bodies.values()) b.group.filter?.worlds.delete(this);
    this.bodies.clear();
    this.joints.clear();
    this.byGroup.clear();
  }
};
var CharacterVirtualSettings = class extends Owned {
  constructor() {
    super();
    this.mShapeOffset = new Vec3();
    this.mUp = new Vec3(0, 1, 0);
    this.mMass = 80;
    this.mMaxStrength = 1e3;
    this.mMaxSlopeAngle = Math.PI / 3;
  }
};
var ExtendedUpdateSettings = class extends Owned {
  constructor() {
    super();
    this.mStickToFloorStepDown = new Vec3(0, -0.3, 0);
    this.mWalkStairsStepUp = new Vec3(0, 0.23, 0);
    this.mWalkStairsStepDownExtra = new Vec3(0, -0.02, 0);
  }
};
var CharacterVirtual = class extends Owned {
  constructor(s, p, q, world) {
    super();
    this.settings = s;
    this.world = world;
    this.position = new Vec3(...xyz2(p));
    this.velocity = new Vec3();
    this.supported = false;
    this.ground = new Vec3();
    this.groundID = -1;
  }
  GetPosition() {
    return this.position;
  }
  SetPosition(p) {
    this.position.Set(...xyz2(p));
    this.supported = false;
  }
  GetLinearVelocity() {
    return this.velocity;
  }
  SetLinearVelocity(v) {
    this.velocity.Set(...xyz2(v));
  }
  IsSupported() {
    return this.supported;
  }
  GetGroundVelocity() {
    return this.ground;
  }
  UpdateGroundVelocity() {
    const body = this.world.bodies.get(this.groundID);
    if (body) {
      const v = add(xyz2(body.GetLinearVelocity()), cross(xyz2(body.GetAngularVelocity()), sub(xyz2(this.position), xyz2(body.GetCenterOfMassPosition()))));
      this.ground.Set(...v);
    } else this.ground.Set(0, 0, 0);
  }
  ExtendedUpdate(dt, _g, settings) {
    const k = this.world.k, s = this.settings;
    k.character_move(...xyz2(this.position), ...xyz2(this.velocity), dt, s.mShape.radius, s.mShape.half, settings.mWalkStairsStepUp.GetY(), this.supported ? 1 : 0, s.mMass);
    const out = this.world.scratch;
    this.position.Set(out[0], out[1], out[2]);
    this.velocity.Set(out[3], out[4], out[5]);
    this.supported = !!out[6];
    this.groundID = out[7];
    this.UpdateGroundVelocity();
  }
};
var RRayCast = class extends Owned {
  constructor(origin, dir) {
    super();
    this.mOrigin = new Vec3(...xyz2(origin));
    this.mDirection = new Vec3(...xyz2(dir));
  }
};
var CastRayClosestHitCollisionCollector = class extends Owned {
  Reset() {
    this.hit = null;
  }
  HadHit() {
    return !!this.hit;
  }
  get_mHit() {
    return this.hit;
  }
};
var Empty = class extends Owned {
};
var LayerPair = class extends Owned {
  constructor(n) {
    super();
    this.n = n;
    this.pairs = /* @__PURE__ */ new Set();
  }
  EnableCollision(a, b) {
    this.pairs.add(`${Math.min(a, b)}:${Math.max(a, b)}`);
  }
};
var BroadLayers = class extends Owned {
  MapObjectToBroadPhaseLayer() {
  }
};
var API = { Vec3, RVec3: Vec3, Quat, BoxShape, SphereShape, CylinderShape, BoxShapeSettings, ConvexHullShapeSettings, StaticCompoundShapeSettings, CapsuleShapeSettings, BodyCreationSettings, GroupFilterTable, PointConstraintSettings, SixDOFConstraintSettings, DistanceConstraintSettings, HingeConstraintSettings, PointConstraint: Joint, SixDOFConstraint: Joint, DistanceConstraint: Joint, HingeConstraint: Joint, JoltSettings: WorldSettings, JoltInterface: KineticWorld, StateRecorderImpl, CharacterVirtualSettings, CharacterVirtual, ExtendedUpdateSettings, RRayCast, CastRayClosestHitCollisionCollector, RayCastSettings: Empty, BodyFilter: Empty, ShapeFilter: Empty, DefaultBroadPhaseLayerFilter: Empty, DefaultObjectLayerFilter: Empty, ObjectLayerPairFilterTable: LayerPair, BroadPhaseLayerInterfaceTable: BroadLayers, BroadPhaseLayer: Empty, ObjectVsBroadPhaseLayerFilterTable: Empty, EActivation_Activate: 1, EActivation_DontActivate: 0, EMotionType_Static: 0, EMotionType_Kinematic: 1, EMotionType_Dynamic: 2, EMotionQuality_LinearCast: 1, EMotorState_Off: 0, EMotorState_Velocity: 1, EOverrideMassProperties_CalculateInertia: 1, castObject: (o) => o, getPointer: (o) => o?.ptr ?? 0, destroy: (o) => o?.dispose?.(), EShapeSubType_ConvexHull: 2, engineName: "KINETIC \u2014 own C++/WASM", engineVersion: "0.2.1" };
async function loadOwnPhysics(options = {}) {
  const variant = options.variant === "reference" ? "reference" : "optimized";
  let entry = kernelModules.get(variant);
  if (!entry) {
    let data = options.wasmBinary ?? (variant === "reference" ? globalThis.__KINETIC_WASM_REFERENCE__ : globalThis.__KINETIC_WASM__);
    if (!data) {
      const url = variant === "reference" ? new URL("./kernel-reference.wasm", import.meta.url) : new URL("./kernel.wasm", import.meta.url);
      const response = await fetch(url);
      if (!response.ok) throw Error(`KINETIC WASM load failed: ${response.status}`);
      data = await response.arrayBuffer();
    }
    const module = await WebAssembly.compile(data);
    if (WebAssembly.Module.imports(module).length) throw Error("Unexpected dependency in own physics kernel");
    const digest = globalThis.crypto?.subtle ? Array.from(new Uint8Array(await crypto.subtle.digest("SHA-256", data)), (n) => n.toString(16).padStart(2, "0")).join("") : null;
    entry = { module, variant, sha256: digest, wasmBytes: data.byteLength };
    kernelModules.set(variant, entry);
  }
  compiled = entry.module;
  selectedInfo = { variant: entry.variant, sha256: entry.sha256, wasmBytes: entry.wasmBytes, thirdPartyPhysics: false };
  return API;
}

// src/building-objective.ts
var near = (a, b, e = 0.06) => Math.abs(a - b) <= e;
var key = (v) => v.map((n) => Math.round(n * 1e3)).join(",");
function components(pieces, state) {
  const ids = pieces.map((p) => p.id), parent = new Map(ids.map((id) => [id, id]));
  const find = (id) => {
    const p = parent.get(id);
    if (p === void 0) return id;
    if (p === id) return id;
    const r = find(p);
    parent.set(id, r);
    return r;
  };
  const join = (a, b) => {
    if (parent.has(a) && parent.has(b)) parent.set(find(a), find(b));
  };
  if (state) for (const [a, b] of state.links) join(a, b);
  else {
    const socket = /* @__PURE__ */ new Map();
    for (const piece of pieces) for (const point of ports(piece)) {
      const k = key(point), other = socket.get(k);
      if (other !== void 0) join(piece.id, other);
      else socket.set(k, piece.id);
    }
  }
  const anchors = state ? state.anchors : pieces.filter((p) => p.kind === "foundation" && near(p.p[1], 0, 0.01) && Math.abs(p.p[0]) <= 40 && Math.abs(p.p[2]) <= 40).map((p) => p.id);
  const anchored = new Set(anchors.filter((id) => parent.has(id)).map(find));
  return { find, anchored };
}
function cells(floor) {
  const r = floor.piece.rotation & 3, result = [];
  for (const x of [1, 3]) for (const z of [-1, 1]) {
    let dx = x, dz = z;
    if (r === 1) [dx, dz] = [z, -x];
    else if (r === 2) [dx, dz] = [-x, -z];
    else if (r === 3) [dx, dz] = [-z, x];
    result.push(`${Math.floor((floor.piece.p[0] + dx) / 2)},${Math.floor((floor.piece.p[2] + dz) / 2)}`);
  }
  return result;
}
function contiguousArea(all) {
  let best = 0;
  const visited = /* @__PURE__ */ new Set();
  for (const start of all) {
    if (visited.has(start)) continue;
    const seen = /* @__PURE__ */ new Set([start]), queue = [start];
    visited.add(start);
    while (queue.length) {
      const [x, z] = queue.shift().split(",").map(Number);
      for (const n of [`${x + 1},${z}`, `${x - 1},${z}`, `${x},${z + 1}`, `${x},${z - 1}`]) {
        if (all.has(n) && !visited.has(n)) {
          seen.add(n);
          visited.add(n);
          queue.push(n);
        }
      }
    }
    best = Math.max(best, seen.size * 4);
  }
  return best;
}
function evaluateBuilding(pieces, objective, state) {
  const minFloorArea = objective.minFloorArea ?? 32;
  const levels = Array.from({ length: Math.floor(Math.max(0, objective.minHeight) / 4) }, (_, i) => (i + 1) * 4);
  const graph = components(pieces, state), floors = /* @__PURE__ */ new Map();
  for (const piece of pieces) if (piece.kind === "slab") {
    const position = state ? state.positions.get(piece.id) : piece.p;
    if (!position) continue;
    const intended = Math.round(piece.p[1] / 4) * 4;
    const level = Math.round(position[1] / 4) * 4;
    const valid = Number.isFinite(position[0]) && Number.isFinite(position[1]) && Number.isFinite(position[2]) && near(piece.p[1], intended, 0.06) && level === intended && Math.abs(position[1] - intended) <= 0.5 && (!state || state.upright.get(piece.id) === true && Math.hypot(position[0] - piece.p[0], position[2] - piece.p[2]) <= 1);
    if (valid) (floors.get(intended) ?? (floors.set(intended, []), floors.get(intended))).push({ id: piece.id, piece, position });
  }
  const roots = [.../* @__PURE__ */ new Set([...graph.anchored])];
  let bestCompleted = 0, bestReason = roots.length ? "Geb\xE4udeziel nicht erreicht." : "Kein verankertes Tragwerk gefunden.";
  for (const root of roots) {
    let completed = 0, reason = "";
    for (const level of levels) {
      const candidates = (floors.get(level) ?? []).filter((f) => graph.find(f.id) === root);
      const connected = candidates;
      const usable = /* @__PURE__ */ new Set();
      for (const floor of connected) for (const cell of cells(floor)) usable.add(cell);
      const area = contiguousArea(usable);
      if (area >= minFloorArea) completed++;
      else if (!candidates.length) {
        reason = `Boden bei ${level} m fehlt oder ist nicht mit demselben verankerten Tragwerk verbunden.`;
        break;
      } else if (area < minFloorArea) {
        reason = `Boden bei ${level} m hat nur ${area} m\xB2 nutzbare Fl\xE4che (mindestens ${minFloorArea} m\xB2 erforderlich).`;
        break;
      }
    }
    if (completed > bestCompleted || bestReason === "Geb\xE4udeziel nicht erreicht.") {
      bestCompleted = completed;
      bestReason = reason || `Geb\xE4udeziel erreicht: ${completed}/${levels.length} B\xF6den.`;
    }
    if (completed === levels.length) return { passed: true, reason: `Geb\xE4udeziel erreicht: ${completed}/${levels.length} B\xF6den.`, completedFloors: completed, requiredFloors: levels.length, minFloorArea };
  }
  return { passed: false, reason: bestReason, completedFloors: bestCompleted, requiredFloors: levels.length, minFloorArea };
}

// src/local-fracture.ts
var LOCAL_KINDS = /* @__PURE__ */ new Set(["column", "wall", "slab", "deck", "doorway", "stairwell", "stair", "core"]);
function finiteOr(value, fallback) {
  return Number.isFinite(value) ? value : fallback;
}
function clamp2(value, low, high) {
  return Math.max(low, Math.min(high, value));
}
function axisFor(kind, size, center, hit) {
  const candidates = kind === "column" ? [1] : kind === "wall" || kind === "doorway" || kind === "core" ? [0, 1] : kind === "stairwell" ? [0, 2] : kind === "stair" ? [0, 1, 2] : [0, 2];
  return candidates.slice().sort((a, b) => {
    const edgeA = Math.abs(hit[a] - center[a]) / Math.max(size[a], 1e-6);
    const edgeB = Math.abs(hit[b] - center[b]) / Math.max(size[b], 1e-6);
    return edgeB - edgeA || a - b;
  })[0];
}
function localFractureShapes(piece, hitLocal, segmentOverride) {
  if (!segmentOverride && (piece.kind === "doorway" || piece.kind === "stairwell" || piece.kind === "stair" || piece.kind === "core")) return compoundFractureShapes(piece, hitLocal);
  if (piece.kind === "facade") return fractureShapes(piece, segmentOverride);
  if (!LOCAL_KINDS.has(piece.kind)) return [];
  const def = PARTS[piece.kind];
  const source = segmentOverride ?? { ...def.segments[0], mass: def.mass };
  const center = [...source.center];
  const size = source.size.map((value) => Math.max(1e-6, finiteOr(value, 1)));
  const mass = Math.max(0, finiteOr(source.mass, def.mass));
  const parent = { center: [...center], size: [...size] };
  const impact = hitLocal.map((value, axis2) => finiteOr(value, center[axis2]));
  const axis = axisFor(piece.kind, size, center, impact);
  const low = center[axis] - size[axis] / 2;
  const high = center[axis] + size[axis] / 2;
  const hit = clamp2(impact[axis], low, high);
  if (size[axis] < 0.45 || mass < 15) {
    return [{ center: [...center], size: [...size], mass, kick: [0, 0, 0], structural: false, parent }];
  }
  if (piece.kind === "slab" || piece.kind === "deck") {
    const splitX = clamp2(0.5 + (impact[0] - center[0]) / size[0] * 0.3, 0.38, 0.62);
    const splitZ = clamp2(0.5 + (impact[2] - center[2]) / size[2] * 0.3, 0.38, 0.62);
    const xs = [0, splitX, 1], zs = [0, splitZ, 1], result2 = [];
    for (let x = 0; x < 2; x++) for (let z = 0; z < 2; z++) {
      const dx = xs[x + 1] - xs[x], dz = zs[z + 1] - zs[z];
      const chunkSize = [size[0] * dx, size[1], size[2] * dz];
      result2.push({ center: [center[0] + (xs[x] + dx * 0.5 - 0.5) * size[0], center[1], center[2] + (zs[z] + dz * 0.5 - 0.5) * size[2]], size: chunkSize, mass: mass * dx * dz, kick: [0, 0, 0], structural: Math.min(chunkSize[0], chunkSize[2]) >= 0.75 && mass * dx * dz >= 60, parent });
    }
    result2.at(-1).mass += mass - result2.reduce((sum, chunk) => sum + chunk.mass, 0);
    return result2;
  }
  const band = Math.min(size[axis] * 0.2, Math.max(size[axis] * 0.08, 0.08));
  let bandLow = Math.max(low, hit - band / 2);
  let bandHigh = Math.min(high, hit + band / 2);
  if (bandLow - low < 0.06) bandLow = low;
  if (high - bandHigh < 0.06) bandHigh = high;
  if (size[axis] >= 0.06 && bandHigh - bandLow < 0.06) {
    bandHigh = Math.min(high, bandLow + 0.06);
    bandLow = Math.max(low, bandHigh - 0.06);
  }
  const cuts = [low, bandLow, (bandLow + bandHigh) / 2, bandHigh, high];
  const ranges = [
    [cuts[0], cuts[1], true],
    [cuts[1], cuts[2], false],
    [cuts[2], cuts[3], false],
    [cuts[3], cuts[4], true]
  ];
  const result = [];
  const epsilon = Math.max(1e-7, size[axis] * 1e-7);
  let usedMass = 0;
  for (const [from, to, structural] of ranges) {
    const length = to - from;
    if (length <= epsilon) continue;
    const partCenter = [...center];
    const partSize = [...size];
    partCenter[axis] = (from + to) / 2;
    partSize[axis] = length;
    const partMass = mass * length / size[axis];
    usedMass += partMass;
    result.push({
      center: partCenter,
      size: partSize,
      mass: partMass,
      kick: [0, 0, 0],
      structural,
      parent: { center: [...parent.center], size: [...parent.size] }
    });
  }
  if (result.length) result[result.length - 1].mass += mass - usedMass;
  const rubble = result.filter((fragment) => fragment.structural === false);
  const kickAxis = axis;
  const kickAmount = Math.min(1.25, Math.max(0.2, size[axis] * 0.16));
  if (rubble.length === 2) {
    rubble[0].kick[kickAxis] = -kickAmount;
    rubble[1].kick[kickAxis] = kickAmount;
  } else if (rubble.length === 1) {
    rubble[0].kick[kickAxis] = hit >= center[axis] ? kickAmount : -kickAmount;
  }
  return result.slice(0, 4);
}
function compoundFractureShapes(piece, hitLocal) {
  const segments = PARTS[piece.kind]?.segments ?? [];
  if (segments.length < 2) return localFractureShapes(piece, hitLocal);
  const totalVolume = segments.reduce((sum, segment) => sum + Math.max(1e-9, segment.size[0] * segment.size[1] * segment.size[2]), 0);
  const masses = segments.map((segment) => PARTS[piece.kind].mass * Math.max(1e-9, segment.size[0] * segment.size[1] * segment.size[2]) / totalVolume);
  const target = segments.reduce((best, segment, index) => {
    const distance = segment.size.map((size, axis) => Math.max(0, Math.abs(hitLocal[axis] - segment.center[axis]) - size / 2));
    const score = distance.reduce((sum, value) => sum + value * value, 0);
    return score < best.score ? { index, score } : best;
  }, { index: 0, score: Infinity }).index;
  const result = [];
  for (let index = 0; index < segments.length; index++) {
    const segment = segments[index];
    if (index !== target) {
      result.push({ center: [...segment.center], size: [...segment.size], mass: masses[index], kick: [0, 0, 0], structural: true, parent: { center: [...segment.center], size: [...segment.size] } });
      continue;
    }
    result.push(...localFractureShapes(piece, hitLocal, { center: segment.center, size: segment.size, mass: masses[index] }));
  }
  if (result.length) result.at(-1).mass += PARTS[piece.kind].mass - result.reduce((sum, chunk) => sum + chunk.mass, 0);
  return result;
}

// src/physical-trees.ts
var PhysicalTrees = class {
  constructor(sim, specs) {
    this.sim = sim;
    const J = sim.J;
    for (const [index, raw] of specs.slice(0, 40).entries()) {
      const spec = {
        x: Number.isFinite(raw.x) ? raw.x : 0,
        y: Number.isFinite(raw.y) ? Math.max(0, raw.y) : 0,
        z: Number.isFinite(raw.z) ? raw.z : 0,
        height: Number.isFinite(raw.height) ? Math.max(1, Math.min(24, raw.height)) : 1
      };
      const h = spec.height;
      const trunkHeight = Math.max(0.45, h * 0.56);
      const trunkWidth = Math.max(0.12, Math.min(0.48, h * 0.075));
      const canopyWidth = Math.max(0.55, h * 0.52);
      const compound = new J.StaticCompoundShapeSettings();
      this.addBox(J, compound, [trunkWidth, trunkHeight, trunkWidth], [0, trunkHeight / 2, 0]);
      for (let tier = 0; tier < 3; tier++) {
        const width = canopyWidth * (1 - tier * 0.18);
        const boxHeight = Math.max(0.3, h * 0.22);
        const centerY = h * (0.59 + tier * 0.13);
        this.addBox(J, compound, [width, boxHeight, width * 0.86], [0, centerY, 0]);
      }
      const result = compound.Create();
      const shape = result.Get();
      const q = new J.Quat(0, 0, 0, 1);
      const root = [spec.x, spec.y, spec.z];
      const mass = Math.max(18, h * h * h * 5.5);
      const body = sim.makeBody(shape, root, q, mass);
      J.destroy(q);
      J.destroy(result);
      J.destroy(compound);
      const item = { body, id: -2e4 - index, kind: "tree", initial: [root[0], root[1], root[2]], stress: 0 };
      sim.items.push(item);
      const settings = new J.SixDOFConstraintSettings();
      for (let axis = 0; axis < 6; axis++) settings.MakeFixedAxis(axis);
      settings.mPosition1.Set(spec.x, spec.y, spec.z);
      settings.mPosition2.Set(spec.x, spec.y, spec.z);
      const constraint = J.castObject(settings.Create(body, sim.ground), J.SixDOFConstraint);
      sim.system.AddConstraint(constraint);
      J.destroy(settings);
      this.trees.push({ item, spec, constraint, broken: false, overloadTime: 0, forceLimit: Math.max(900, mass * 9.81 * 1.35) });
    }
  }
  sim;
  trees = [];
  broken = 0;
  disposed = false;
  addBox(J, compound, size, center) {
    const half = new J.Vec3(size[0] / 2, size[1] / 2, size[2] / 2);
    const box = new J.BoxShapeSettings(half, 0.02);
    const position = new J.Vec3(...center);
    const axis = new J.Vec3(0, 1, 0);
    const rotation = J.Quat.prototype.sRotation(axis, 0);
    compound.AddShape(position, rotation, box);
    J.destroy(half);
    J.destroy(position);
    J.destroy(axis);
    J.destroy(rotation);
  }
  /** Apply wind loads immediately before Simulation.step(). */
  beforeStep(dt) {
    if (this.disposed) return;
    const wind = this.sim.hazardActive("wind"), flood = this.sim.water > 0;
    if (!wind && !flood) return;
    const age = this.sim.hazardAge("wind");
    const ramp = Math.min(1, Math.max(0, (age - 1) / 3));
    const gust = 1 + 0.24 * Math.sin(age * 3) + 0.12 * Math.sin(age * 7);
    const speed = 58 * this.sim.intensity * ramp * gust;
    const direction = [1, 0, 0.28];
    for (const tree of this.trees) {
      const h = tree.spec.height;
      const area = Math.PI * Math.pow(Math.max(0.35, h * 0.24), 2);
      const force = area * 0.62 * speed * speed * (1 + h / 18);
      if (wind) this.sim.force(tree.item, direction[0] * force * (tree.broken ? 0.25 : 1), 0, direction[2] * force * (tree.broken ? 0.25 : 1));
      if (flood) {
        const body = tree.item.body, p = body.GetCenterOfMassPosition(), submerged = Math.max(0, Math.min(1, (this.sim.water - p.GetY() + h * 0.4) / (h * 0.8))), v = body.GetLinearVelocity();
        const mass = Math.max(18, h * h * h * 5.5);
        this.sim.force(tree.item, submerged * (1800 * this.sim.intensity - v.GetX() * 250), submerged * (mass / 650 * 1e3 * 9.81 - v.GetY() * 250), submerged * 300);
      }
    }
    void dt;
  }
  /** Evaluate root constraint impulses after Simulation.step(). */
  afterStep(dt) {
    if (this.disposed || dt <= 0) return;
    const elapsed = this.sim.elapsed;
    for (const tree of this.trees) {
      if (tree.broken || elapsed < 0.5) continue;
      const positionLambdaValue = tree.constraint.GetTotalLambdaPosition();
      const positionLambda = Math.hypot(positionLambdaValue.GetX(), positionLambdaValue.GetZ()) / dt;
      const rotationLambda = tree.constraint.GetTotalLambdaRotation();
      const moment = rotationLambda ? rotationLambda.Length() / dt / Math.max(tree.spec.height, 1) : 0;
      const load = Math.max(positionLambda, moment);
      tree.item.stress = Math.max(tree.item.stress, load / tree.forceLimit);
      if (load > tree.forceLimit) tree.overloadTime += dt * Math.min(8, load / tree.forceLimit - 1);
      else tree.overloadTime = Math.max(0, tree.overloadTime - dt * 0.5);
      if (tree.overloadTime > 0.08) {
        this.sim.system.RemoveConstraint(tree.constraint);
        tree.constraint = void 0;
        tree.broken = true;
        this.broken++;
      }
    }
  }
  /** Convenience hook for callers that own neither side of the world step. */
  update(dt) {
    this.beforeStep(dt);
    this.afterStep(dt);
  }
  dispose() {
    if (this.disposed) return;
    this.disposed = true;
    for (const tree of this.trees) if (!tree.broken) this.sim.system.RemoveConstraint(tree.constraint);
    this.trees.length = 0;
  }
};

// src/occupancy.ts
var OccupancyLoad = class {
  constructor(sim) {
    this.sim = sim;
    this.slabs = sim.pieces.filter((piece) => piece.kind === "slab").map((piece) => ({ piece, item: sim.items.find((item) => item.id === piece.id && item.kind === "slab") })).filter((slab) => !!slab.item).sort((a, b) => b.piece.p[1] - a.piece.p[1]).slice(0, 12);
  }
  sim;
  tonnes = 0;
  wave = 0;
  count = 0;
  slabs;
  slots = [
    [-1, 0, -1],
    [0, 0, -1],
    [1, 0, -1],
    [-1, 0, 1],
    [0, 0, 1],
    [1, 0, 1]
  ];
  update(time) {
    while (this.wave < 6 && time >= 2 + this.wave * 4) {
      this.spawnWave(this.wave);
      this.wave++;
    }
  }
  spawnWave(wave) {
    const mass = 200 * (wave + 1) * Math.max(0, this.sim.intensity);
    for (const slab of this.slabs) {
      const body = slab.item.body;
      const bodyPosition = body.GetPosition();
      const floorY = bodyPosition.GetY();
      if (slab.item.fractured || floorY < slab.item.initial[1] - 1.5) continue;
      const slot = this.slots[wave % this.slots.length];
      const local = [slot[0], 0, slot[2]];
      const offset = this.currentYawOffset(body, local);
      const p = [
        bodyPosition.GetX() + offset[0],
        bodyPosition.GetY() + offset[1],
        bodyPosition.GetZ() + offset[2]
      ];
      const id = this.sim.allocateItemId();
      this.sim.dynamicBox([id, "payload"], p, [0.9, 0.9, 0.9], mass);
      this.count++;
      this.tonnes += mass / 1e3;
    }
  }
  currentYawOffset(body, local) {
    const localPoint = [2 + local[0], 0.45, local[2]];
    const q = body.GetRotation();
    const qx = q.GetX(), qy = q.GetY(), qz = q.GetZ(), qw = q.GetW();
    const [x, y, z] = localPoint;
    const tx = 2 * (qy * z - qz * y);
    const ty = 2 * (qz * x - qx * z);
    const tz = 2 * (qx * y - qy * x);
    return [x + qw * tx + qy * tz - qz * ty, y + qw * ty + qz * tx - qx * tz, z + qw * tz + qx * ty - qy * tx];
  }
};

// src/world-vehicles.ts
var WorldVehicles = class {
  constructor(sim) {
    this.sim = sim;
  }
  sim;
  entries = /* @__PURE__ */ new Map();
  get states() {
    return [...this.entries.values()].map((e) => {
      const p = e.vehicle.chassis.GetPosition(), q = e.vehicle.chassis.GetRotation();
      return { id: e.spec.id, name: e.spec.name, parts: e.spec.parts, position: [p.GetX(), p.GetY(), p.GetZ()], rotation: Math.atan2(2 * (q.GetX() * q.GetZ() + q.GetW() * q.GetY()), 1 - 2 * (q.GetY() * q.GetY() + q.GetX() * q.GetX())), chassisId: e.vehicle.chassisItem.id, mode: e.mode, target: e.target, yaw: e.vehicle.controls.yaw, pitch: e.vehicle.controls.pitch };
    });
  }
  spawn(spec) {
    this.validate(spec);
    if (this.entries.has(spec.id)) throw new Error(`World vehicle ${spec.id} already exists`);
    this.reserve(spec);
    const vehicle = new VehiclePhysics(this.sim, spec.parts, spec.position, void 0, spec.rotation, spec.id);
    vehicle.controls = { ...vehicle.controls, brake: true };
    this.entries.set(spec.id, { spec: { ...spec, parts: spec.parts.map((p) => ({ ...p, p: [...p.p] })) }, vehicle, mode: "parked" });
    return this.states.find((s) => s.id === spec.id);
  }
  remove(id) {
    const entry = this.entries.get(id);
    if (!entry) return false;
    entry.vehicle.dispose();
    this.entries.delete(id);
    return true;
  }
  replace(spec) {
    this.validate(spec);
    if (!this.entries.has(spec.id)) return this.spawn(spec);
    const old = this.entries.get(spec.id);
    const needed = this.bodyCount(spec);
    const available = this.sim.bodyPool?.length ?? 0;
    if (this.sim.bodyList.length - old.vehicle.parts.filter((p) => p.kind === "wheel").length - 1 + needed > 8192 + available) throw new Error("Physics body capacity reached");
    old.vehicle.dispose();
    this.entries.delete(spec.id);
    const vehicle = new VehiclePhysics(this.sim, spec.parts, spec.position, void 0, spec.rotation, spec.id);
    this.entries.set(spec.id, { spec, vehicle, mode: "parked" });
    return this.states.find((s) => s.id === spec.id);
  }
  setMode(id, mode, target) {
    const entry = this.entries.get(id);
    if (!entry) throw new Error(`Unknown world vehicle ${id}`);
    if (mode === "drive") {
      for (const [otherId, other] of this.entries) if (otherId !== id && other.mode === "drive") {
        other.mode = "parked";
        other.vehicle.controls = { ...other.vehicle.controls, throttle: 0, steer: 0, brake: true, fire: false };
      }
    }
    entry.mode = mode;
    entry.target = target;
    return this.states.find((s) => s.id === id);
  }
  input(id, input) {
    const entry = this.entries.get(id);
    if (!entry) throw new Error(`Unknown world vehicle ${id}`);
    if (entry.mode !== "drive") return false;
    entry.vehicle.controls = { ...entry.vehicle.controls, ...input };
    return true;
  }
  step(dt) {
    for (const entry of this.entries.values()) {
      if (entry.mode === "parked") entry.vehicle.controls = { ...entry.vehicle.controls, throttle: 0, steer: 0, brake: true, fire: false };
      else if (entry.mode === "attack") {
        const p = entry.vehicle.chassis.GetPosition(), q = entry.vehicle.chassis.GetRotation(), target = entry.target ?? [0, 3, 0];
        entry.vehicle.controls = demoVehicleControls([p.GetX(), p.GetY(), p.GetZ()], [q.GetX(), q.GetY(), q.GetZ(), q.GetW()], target, this.sim.elapsed, 25, target);
      }
      entry.vehicle.step(dt);
    }
  }
  afterStep() {
    for (const entry of this.entries.values()) entry.vehicle.afterStep();
  }
  dispose() {
    for (const id of [...this.entries.keys()]) this.remove(id);
  }
  validate(spec) {
    if (!Number.isInteger(spec.id) || spec.id <= 0) throw new Error("World vehicle id must be a positive integer");
    if (!Number.isFinite(spec.rotation) || spec.position.length !== 3 || spec.position.some((v) => !Number.isFinite(v))) throw new Error("Invalid world vehicle pose");
    assertVehicleParts(spec.parts);
  }
  bodyCount(spec) {
    return 1 + spec.parts.filter((p) => p.kind === "wheel").length;
  }
  reserve(spec) {
    const count = this.bodyCount(spec);
    if (count > 81) throw new Error("Invalid world vehicle parts");
    if (this.sim.bodyList.length + count > 8192 && !this.sim.ensureBodyCapacity?.(count)) throw new Error("Physics body capacity reached");
  }
};

// src/physics.ts
var HOUSE_DISPLACEMENT_LIMIT = 0.5;
var REINFORCED_KINDS = /* @__PURE__ */ new Set(["foundation", "column", "slab", "wall", "deck", "doorway", "stairwell", "stair", "core"]);
var Simulation = class {
  constructor(J, pieces, scenario2, intensity = 1, rules = {}, workerThreads = 0) {
    this.pieces = pieces;
    this.scenario = scenario2;
    this.intensity = intensity;
    this.J = J;
    this.rules = rules;
    this.fragmentLimit = Math.max(24, Math.min(3e3, Math.round(rules.fragmentLimit ?? 156)));
    this.duration = rules.duration ?? SCENARIOS[scenario2].duration;
    this.forceVector = new J.Vec3(0, 0, 0);
    this.worldVehicles = new WorldVehicles(this);
    const settings = new J.JoltSettings();
    settings.mMaxWorkerThreads = Math.max(0, Math.min(8, workerThreads));
    const pair = new J.ObjectLayerPairFilterTable(2);
    pair.EnableCollision(0, 1);
    pair.EnableCollision(1, 1);
    const broad = new J.BroadPhaseLayerInterfaceTable(2, 2);
    const b0 = new J.BroadPhaseLayer(0), b1 = new J.BroadPhaseLayer(1);
    broad.MapObjectToBroadPhaseLayer(0, b0);
    broad.MapObjectToBroadPhaseLayer(1, b1);
    settings.mObjectLayerPairFilter = pair;
    settings.mBroadPhaseLayerInterface = broad;
    settings.mObjectVsBroadPhaseLayerFilter = new J.ObjectVsBroadPhaseLayerFilterTable(broad, 2, pair, 2);
    this.world = new J.JoltInterface(settings);
    J.destroy(settings);
    J.destroy(b0);
    J.destroy(b1);
    this.system = this.world.GetPhysicsSystem();
    this.bodies = this.system.GetBodyInterface();
    const ps = this.system.GetPhysicsSettings(), large = pieces.length >= 800, medium = pieces.length >= 400;
    ps.mNumVelocitySteps = large ? 12 : medium ? 16 : 48;
    ps.mNumPositionSteps = large ? 3 : medium ? 4 : 12;
    this.system.SetPhysicsSettings(ps);
    this.filter = new J.GroupFilterTable(8192);
    this.filter.AddRef();
    const disable = this.filter.DisableCollision.bind(this.filter), enable = this.filter.EnableCollision.bind(this.filter);
    this.filter.DisableCollision = (a, b) => {
      if (a >= 8192 || b >= 8192) throw new Error("Collision group capacity exceeded");
      disable(a, b);
      for (const [x, y] of [[a, b], [b, a]]) {
        const peers = this.collisionPeers.get(x) ?? /* @__PURE__ */ new Set();
        peers.add(y);
        this.collisionPeers.set(x, peers);
      }
    };
    this.filter.EnableCollision = (a, b) => {
      enable(a, b);
      this.collisionPeers.get(a)?.delete(b);
      this.collisionPeers.get(b)?.delete(a);
    };
    if (scenario2 === "bridge") {
      this.ground = this.box([-23, -4, 0], [22, 8, 28], 0);
      this.box([23, -4, 0], [22, 8, 28], 0);
      this.box([0, -10, 0], [100, 2, 100], 0);
    } else {
      this.ground = this.box([0, -1, 0], [1e3, 2, 1e3], 0, scenario2 === "earthquake");
      if (rules.sandbox) for (const side of [-1, 1]) {
        this.box([0, 1, side * 498], [1e3, 4, 3], 0);
        this.box([side * 498, 1, 0], [3, 4, 1e3], 0);
      }
      if (scenario2 === "landslide") {
        this.box([0, 5, -19], [30, 0.8, 24], 0, false, 0.51);
        this.house = this.dynamicBox([-900, "house"], [0, 1.6, 5], [3.2, 3.2, 3.2], 18e3);
      }
    }
    addWorldPieces(this, pieces, true);
    if (rules.vehicleParts?.length && rules.sandbox) this.vehicle = new VehiclePhysics(this, rules.vehicleParts);
    if (scenario2 === "bridge") this.createTruck((rules.vehicleMass ?? 12e3) * intensity);
    if (scenario2 === "occupancy" || rules.occupancy) this.occupancy = new OccupancyLoad(this);
  }
  pieces;
  scenario;
  intensity;
  concreteStrength(item) {
    return isConcrete(item.sourceKind ?? item.kind) ? item.concreteStrength ?? 1 : 1;
  }
  reinforcement(item) {
    return isConcrete(item.sourceKind ?? item.kind) ? item.reinforcement ?? 1 : 1;
  }
  J;
  world;
  system;
  bodies;
  filter;
  items = [];
  joints = [];
  rebars = [];
  nextRebarId = 0;
  bodyList = [];
  vehicle;
  attacker;
  worldVehicles;
  get worldVehicleStates() {
    return this.worldVehicles.states;
  }
  driveConstraints = [];
  trees;
  attachTrees(specs) {
    if (!this.trees) this.trees = new PhysicalTrees(this, specs);
  }
  bodyPool = [];
  pooledBodies = /* @__PURE__ */ new Set();
  disposableCompounds = /* @__PURE__ */ new Set();
  collisionPeers = /* @__PURE__ */ new Map();
  collectAfter = 0;
  fragments = 0;
  nextDynamicId = -1e6;
  fragmentLimit;
  removedBodies = /* @__PURE__ */ new Set();
  jointCounts = /* @__PURE__ */ new Map();
  attachmentCounts = /* @__PURE__ */ new Map();
  jointNeighbors = /* @__PURE__ */ new Map();
  pendingCollisions = /* @__PURE__ */ new Map();
  facadeClearances = /* @__PURE__ */ new Map();
  glassFrames = /* @__PURE__ */ new Map();
  glassStrain = /* @__PURE__ */ new Map();
  nextGlassCheck = 0;
  projectileHits = /* @__PURE__ */ new Set();
  projectilePool = [];
  sandboxHazards = { wind: false, earthquake: false, flood: false, meteors: false, attack: false };
  meteors = 0;
  meteorPool = [];
  nextMeteorAt = 0;
  quakeResetSteps = 0;
  hazardStart = { wind: 0, earthquake: 0, flood: 0, meteors: 0, attack: 0 };
  hazardAge(kind) {
    return this.rules.sandbox ? this.elapsed - this.hazardStart[kind] : this.elapsed;
  }
  hazardActive(kind) {
    return this.rules.sandbox ? this.sandboxHazards[kind] : this.scenario === kind;
  }
  setSandboxHazard(kind, enabled) {
    if (!this.rules.sandbox) return;
    if (enabled && !this.sandboxHazards[kind]) this.hazardStart[kind] = this.elapsed;
    if (kind === "earthquake" && enabled) this.bodies.SetMotionType(this.ground.GetID(), this.J.EMotionType_Kinematic, this.J.EActivation_Activate);
    this.sandboxHazards[kind] = enabled;
    if (kind === "attack") {
      if (enabled && !this.attacker) this.attacker = new AttackVehicle(this);
      this.attacker?.setEnabled(enabled);
    }
    if (kind === "meteors" && enabled) this.nextMeteorAt = this.elapsed + 0.2;
    if (kind === "earthquake" && !enabled) this.quakeResetSteps = 2;
    for (const item of this.items) if (!item.fractured) this.bodies.ActivateBody(item.body.GetID());
  }
  ground;
  truck;
  house;
  occupancy;
  elapsed = 0;
  broken = 0;
  maxStress = 0;
  peakStress = 0;
  duration;
  result = null;
  reason = "";
  water = -8;
  rocks = 0;
  physicsMs = 0;
  projectiles = 0;
  rules;
  forceVector;
  startupAwakeUntil = 0;
  armStartupDamage() {
    if (this.pieces.length < 400) return;
    this.startupAwakeUntil = 1;
    for (const item of this.items) if (item.id > 0) {
      item.body.SetAllowSleeping(false);
      item.body.ResetSleepTimer();
    }
  }
  // Preload the unchanged structure under gravity before player actions and scenario clocks start.
  async settleStartup() {
    if (this.pieces.length < 400 || !this.rules.sandbox) return null;
    const supported = /* @__PURE__ */ new Set(), queue = [];
    for (const joint of this.joints) if (!joint.b && !supported.has(joint.a.id)) {
      supported.add(joint.a.id);
      queue.push(joint.a);
    }
    while (queue.length) {
      const item = queue.pop();
      for (const joint of this.jointNeighbors.get(item.id) ?? []) {
        const other = joint.a === item ? joint.b : joint.a;
        if (other && !supported.has(other.id)) {
          supported.add(other.id);
          queue.push(other);
        }
      }
    }
    if (this.items.some((item) => item.id > 0 && !supported.has(item.id))) return null;
    const J = this.J, settings = this.system.GetPhysicsSettings(), velocitySteps = settings.mNumVelocitySteps, positionSteps = settings.mNumPositionSteps;
    const g = this.system.GetGravity(), gravity = [g.GetX(), g.GetY(), g.GetZ()], ramped = new J.Vec3(0, 0, 0);
    const bodies = this.items.filter((item) => item.id > 0).map((item) => {
      const motion = item.body.GetMotionProperties();
      return { body: item.body, motion, linear: motion.GetLinearDamping(), angular: motion.GetAngularDamping(), sleep: item.body.GetAllowSleeping() };
    });
    for (const state of bodies) state.body.SetAllowSleeping(false);
    let steps = 0, quiet = 0, maxSpeed = Infinity;
    const started = performance.now();
    try {
      for (let i = 0; i < 180; i++) {
        const gravityScale = Math.min(1, (i + 1) / 30), extra = Math.max(0, 1 - (i - 45) / 45), damping = Math.max(0, 1 - (i - 45) / 60);
        ramped.Set(gravity[0] * gravityScale, gravity[1] * gravityScale, gravity[2] * gravityScale);
        this.system.SetGravity(ramped);
        settings.mNumVelocitySteps = Math.round(velocitySteps + (Math.max(32, velocitySteps) - velocitySteps) * extra);
        settings.mNumPositionSteps = Math.round(positionSteps + (Math.max(8, positionSteps) - positionSteps) * extra);
        this.system.SetPhysicsSettings(settings);
        for (const state of bodies) {
          state.motion.SetLinearDamping(state.linear + 3 * damping);
          state.motion.SetAngularDamping(state.angular + 3 * damping);
        }
        this.world.Step(1 / 60, 1);
        steps++;
        if (i >= 105) {
          maxSpeed = 0;
          for (const state of bodies) maxSpeed = Math.max(maxSpeed, state.body.GetLinearVelocity().Length(), state.body.GetAngularVelocity().Length() * 4);
          quiet = maxSpeed < 0.035 ? quiet + 1 : 0;
          if (quiet >= 15) break;
        }
        if (i % 4 === 3) await new Promise((resolve) => setTimeout(resolve, 0));
      }
    } finally {
      ramped.Set(...gravity);
      this.system.SetGravity(ramped);
      J.destroy(ramped);
      settings.mNumVelocitySteps = velocitySteps;
      settings.mNumPositionSteps = positionSteps;
      this.system.SetPhysicsSettings(settings);
      for (const state of bodies) {
        state.motion.SetLinearDamping(state.linear);
        state.motion.SetAngularDamping(state.angular);
        state.body.SetAllowSleeping(state.sleep);
        state.body.ResetSleepTimer();
      }
    }
    this.armStartupDamage();
    return { steps, quiet: quiet >= 15, maxSpeed, milliseconds: performance.now() - started };
  }
  retireProjectileCompound(body) {
    this.disposableCompounds.add(body);
  }
  collectRetiredBodies() {
    const reserved = new Set(this.blockShots.flatMap((shot) => shot ? [...shot.bodies, ...shot.compound ? [shot.compound] : []] : []));
    const linked = /* @__PURE__ */ new Set();
    for (const j of this.joints) if (!j.broken) {
      linked.add(j.a.body);
      if (j.b) linked.add(j.b.body);
    }
    for (const link of this.rebars) if (!link.broken) {
      linked.add(link.a.body);
      linked.add(link.b.body);
    }
    const owners = /* @__PURE__ */ new Map();
    for (const item of this.items) {
      const rows = owners.get(item.body) ?? [];
      rows.push(item);
      owners.set(item.body, rows);
    }
    const candidates = [...this.removedBodies].filter((body) => !this.pooledBodies.has(body) && !reserved.has(body) && !linked.has(body) && (this.disposableCompounds.has(body) || owners.has(body) && owners.get(body).every((item) => (item.fractured || item.retired) && !item.flying)));
    if (!candidates.length) return;
    const reusable = new Set(candidates);
    this.joints = this.joints.filter((j) => {
      if (j.broken) {
        this.system.RemoveConstraint(j.constraint);
        return false;
      }
      return true;
    });
    this.jointNeighbors.clear();
    this.jointCounts.clear();
    for (const j of this.joints) {
      for (const item of j.b ? [j.a, j.b] : [j.a]) {
        const rows = this.jointNeighbors.get(item.id) ?? [];
        rows.push(j);
        this.jointNeighbors.set(item.id, rows);
      }
      const key3 = `${j.groupA}:${j.groupB}`;
      this.jointCounts.set(key3, (this.jointCounts.get(key3) ?? 0) + 1);
    }
    this.rebars = this.rebars.filter((link) => !link.broken);
    for (const [key3, pair] of this.pendingCollisions) if (reusable.has(pair.a) || reusable.has(pair.b)) {
      this.filter.EnableCollision(pair.a.GetCollisionGroup().GetSubGroupID(), pair.b.GetCollisionGroup().GetSubGroupID());
      this.pendingCollisions.delete(key3);
    }
    for (const body of candidates) {
      const group = body.GetCollisionGroup().GetSubGroupID();
      for (const peer of [...this.collisionPeers.get(group) ?? []]) this.filter.EnableCollision(group, peer);
      this.collisionPeers.delete(group);
      const value = (v) => {
        const x = v.GetX(), y = v.GetY(), z = v.GetZ(), w = typeof v.GetW === "function" ? v.GetW() : 0;
        return { GetX: () => x, GetY: () => y, GetZ: () => z, GetW: () => w };
      };
      const p = value(body.GetPosition()), q = value(body.GetRotation()), com = value(body.GetCenterOfMassPosition()), zero = { GetX: () => 0, GetY: () => 0, GetZ: () => 0 };
      for (const item of owners.get(body) ?? []) {
        item.body = { GetPosition: () => p, GetCenterOfMassPosition: () => com, GetRotation: () => q, GetLinearVelocity: () => zero, GetAngularVelocity: () => zero, IsActive: () => false };
        this.attachmentCounts.delete(item.id);
      }
      this.disposableCompounds.delete(body);
      this.bodyPool.push(body);
      this.pooledBodies.add(body);
    }
    this.items = this.items.filter((item) => item.id > 0 || !item.fractured && !item.retired);
  }
  ensureBodyCapacity(count) {
    if (this.bodyPool.length < count && this.bodyList.length + count > 1024) this.collectRetiredBodies();
    return this.bodyPool.length + 8192 - this.bodyList.length >= count;
  }
  // Fixed scene objects (trees, vehicles, truck) occupy (-1_000_000, 0).
  // All unbounded streams share one allocator, including shot roots. Never reuse
  // a render ID when recycling a native body: old snapshots can still refer to it.
  allocateItemId() {
    return this.nextDynamicId--;
  }
  updateConcrete(ids, values) {
    const wanted = new Set(ids), strength = Math.max(0.25, Math.min(2.5, values.concreteStrength)), reinforcement = Math.max(0, Math.min(2.5, values.reinforcement));
    for (const item of this.items) {
      if (!wanted.has(item.id) || item.fractured || item.retired || item.id <= 0) continue;
      const oldStrength = this.concreteStrength(item), oldReinforcement = this.reinforcement(item);
      item.concreteStrength = strength;
      item.reinforcement = reinforcement;
      const piece = this.pieces.find((p) => p.id === item.id);
      if (piece) {
        piece.concreteStrength = strength;
        piece.reinforcement = reinforcement;
      }
      for (const joint of this.jointNeighbors.get(item.id) ?? []) {
        if (joint.broken) continue;
        const other = joint.a === item ? joint.b : joint.a, oldFactor = Math.min(oldStrength, other ? this.concreteStrength(other) : oldStrength), newFactor = Math.min(this.concreteStrength(item), other ? this.concreteStrength(other) : this.concreteStrength(item)), ratio = oldFactor > 0 ? newFactor / oldFactor : 1;
        joint.force *= ratio;
        joint.torque = joint.torque.map((v) => v * ratio);
      }
      for (const link of this.rebars) if (!link.broken && (link.a === item || link.b === item)) {
        const other = link.a === item ? link.b : link.a, oldFactor = Math.min(oldReinforcement, this.reinforcement(other)), newFactor = Math.min(this.reinforcement(item), this.reinforcement(other)), ratio = oldFactor > 0 ? newFactor / oldFactor : 1;
        link.strength *= ratio;
        link.limit *= ratio;
      }
    }
  }
  spawnWorldVehicle(spec) {
    return this.worldVehicles.spawn(spec);
  }
  removeWorldVehicle(id) {
    return this.worldVehicles.remove(id);
  }
  replaceWorldVehicle(spec) {
    return this.worldVehicles.replace(spec);
  }
  setWorldVehicleMode(id, mode, target) {
    return this.worldVehicles.setMode(id, mode, target);
  }
  worldVehicleInput(id, input) {
    return this.worldVehicles.input(id, input);
  }
  removeVehicleBody(item) {
    if (this.removedBodies.has(item.body)) return;
    for (const j of this.jointNeighbors.get(item.id) ?? []) if (!j.broken) this.breakJoint(j, true);
    this.removeRebars(item);
    this.bodies.RemoveBody(item.body.GetID());
    this.removedBodies.add(item.body);
  }
  makeBody(shape, p, q, mass, kinematic = false, debris = false) {
    const J = this.J;
    if (mass > 0 && !kinematic && this.bodyPool.length) {
      const body2 = this.bodyPool.pop();
      this.pooledBodies.delete(body2);
      this.bodies.SetShape(body2.GetID(), shape, true, J.EActivation_DontActivate);
      const motion = body2.GetMotionProperties();
      motion.ScaleToMass(mass);
      motion.ResetForce();
      motion.ResetTorque();
      motion.SetLinearDamping(0.08);
      motion.SetAngularDamping(0.14);
      motion.SetGravityFactor(1);
      const position = new J.RVec3(...p), zero = new J.Vec3(0, 0, 0);
      this.bodies.SetPositionAndRotation(body2.GetID(), position, q, J.EActivation_DontActivate);
      body2.SetLinearVelocity(zero);
      body2.SetAngularVelocity(zero);
      body2.SetFriction(0.55);
      body2.SetRestitution(0.03);
      body2.SetAllowSleeping(!!this.rules.sandbox || debris);
      J.destroy(position);
      J.destroy(zero);
      this.bodies.AddBody(body2.GetID(), J.EActivation_Activate);
      this.removedBodies.delete(body2);
      return body2;
    }
    if (this.bodyList.length >= 8192) throw new Error("Physics body capacity reached");
    const pos = new J.RVec3(...p);
    const settings = new J.BodyCreationSettings(shape, pos, q, mass > 0 ? J.EMotionType_Dynamic : kinematic ? J.EMotionType_Kinematic : J.EMotionType_Static, mass > 0 || kinematic ? 1 : 0);
    J.destroy(pos);
    settings.mAllowDynamicOrKinematic = true;
    settings.mFriction = mass > 0 ? 0.55 : 0.7;
    settings.mRestitution = 0.03;
    if (mass > 0) {
      settings.mOverrideMassProperties = J.EOverrideMassProperties_CalculateInertia;
      settings.mMassPropertiesOverride.mMass = mass;
      settings.mLinearDamping = 0.08;
      settings.mAngularDamping = 0.14;
      settings.mAllowSleeping = !!this.rules.sandbox || debris;
      settings.mMotionQuality = J.EMotionQuality_LinearCast;
    }
    settings.mCollisionGroup.SetGroupFilter(this.filter);
    settings.mCollisionGroup.SetGroupID(1);
    settings.mCollisionGroup.SetSubGroupID(this.bodyList.length);
    const body = this.bodies.CreateBody(settings);
    if (!body || !J.getPointer(body)) {
      J.destroy(settings);
      throw new Error("Physics body allocation failed");
    }
    this.bodies.AddBody(body.GetID(), J.EActivation_Activate);
    J.destroy(settings);
    this.bodyList.push(body);
    return body;
  }
  box(p, size, mass, kinematic = false, tilt = 0) {
    const J = this.J, half = new J.Vec3(...size.map((n) => n / 2)), shape = new J.BoxShape(half, 0.03);
    J.destroy(half);
    shape.AddRef();
    const ax = new J.Vec3(1, 0, 0), q = J.Quat.prototype.sRotation(ax, tilt);
    J.destroy(ax);
    const b = this.makeBody(shape, p, q, mass, kinematic);
    J.destroy(q);
    shape.Release();
    return b;
  }
  dynamicBox([id, kind], p, size, mass) {
    const item = { body: this.box(p, size, mass), id, kind, initial: p, stress: 0 };
    if (kind === "truck") item.body.SetFriction(0.16);
    this.items.push(item);
    return item;
  }
  createTruck(mass) {
    const J = this.J, wheelMass = mass * 0.01;
    this.truck = this.dynamicBox([-800, "truck"], [-20, 1, 0], [3.6, 0.75, 2.05], mass - wheelMass * 4);
    for (const x of [-1.15, 1.1]) for (const z of [-1.1, 1.1]) {
      const p = [-20 + x, 0.65, z], shape = new J.CylinderShape(0.13, 0.44, 0.02);
      shape.AddRef();
      const axis = new J.Vec3(1, 0, 0), q = J.Quat.prototype.sRotation(axis, Math.PI / 2);
      J.destroy(axis);
      const wheel = this.makeBody(shape, p, q, wheelMass);
      J.destroy(q);
      shape.Release();
      wheel.SetFriction(1.1);
      this.filter.DisableCollision(this.truck.body.GetCollisionGroup().GetSubGroupID(), wheel.GetCollisionGroup().GetSubGroupID());
      const settings = new J.HingeConstraintSettings();
      settings.mPoint1.Set(...p);
      settings.mPoint2.Set(...p);
      settings.mHingeAxis1.Set(0, 0, 1);
      settings.mHingeAxis2.Set(0, 0, 1);
      settings.mNormalAxis1.Set(1, 0, 0);
      settings.mNormalAxis2.Set(1, 0, 0);
      settings.mMotorSettings.mMinTorqueLimit = -mass * 0.22;
      settings.mMotorSettings.mMaxTorqueLimit = mass * 0.22;
      const hinge = J.castObject(settings.Create(this.truck.body, wheel), J.HingeConstraint);
      this.system.AddConstraint(hinge);
      J.destroy(settings);
      hinge.SetMotorState(J.EMotorState_Velocity);
      hinge.SetTargetAngularVelocity(0);
      this.driveConstraints.push(hinge);
    }
  }
  join(a, b, p, points = [p], pinned = false, support = this.ground) {
    const J = this.J, settings = pinned ? new J.PointConstraintSettings() : new J.SixDOFConstraintSettings();
    if (pinned) {
      settings.mPoint1.Set(...p);
      settings.mPoint2.Set(...p);
    } else {
      for (let axis = 0; axis < 6; axis++) settings.MakeFixedAxis(axis);
      settings.mPosition1.Set(...p);
      settings.mPosition2.Set(...p);
    }
    const constraint = J.castObject(settings.Create(a.body, b?.body ?? support), pinned ? J.PointConstraint : J.SixDOFConstraint);
    this.system.AddConstraint(constraint);
    J.destroy(settings);
    const da = PARTS[a.sourceKind ?? a.kind], db = b ? PARTS[b.sourceKind ?? b.kind] : da;
    const groupA = a.body.GetCollisionGroup().GetSubGroupID();
    const groupB = (b?.body ?? support).GetCollisionGroup().GetSubGroupID();
    const materialStrength = b ? Math.min(this.concreteStrength(a), this.concreteStrength(b)) : this.concreteStrength(a);
    const socketForce = Math.min(da.force, db.force) * materialStrength, socketTorque = Math.min(da.torque, db.torque) * materialStrength;
    const torque = [0, 1, 2].map((axis) => points.reduce((n, point) => n + socketTorque + socketForce * Math.hypot(...point.map((v, i) => i === axis ? 0 : v - p[i])), 0));
    const joint = { constraint, a, b, force: socketForce * points.length, torque, pinned, broken: false, stress: 0, overloadTime: 0, localA: points.map((point) => this.bodyLocalPoint(a, point)), localB: b ? points.map((point) => this.bodyLocalPoint(b, point)) : void 0, groupA, groupB };
    this.joints.push(joint);
    const key3 = `${groupA}:${groupB}`;
    this.jointCounts.set(key3, (this.jointCounts.get(key3) ?? 0) + 1);
    for (const item of b ? [a, b] : [a]) {
      this.attachmentCounts.set(item.id, (this.attachmentCounts.get(item.id) ?? 0) + 1);
      const neighbors = this.jointNeighbors.get(item.id) ?? [];
      neighbors.push(joint);
      this.jointNeighbors.set(item.id, neighbors);
    }
  }
  bodyLocalPoint(item, point) {
    const p = item.body.GetPosition(), q = item.body.GetRotation();
    return rotateByQuaternion([point[0] - p.GetX(), point[1] - p.GetY(), point[2] - p.GetZ()], [-q.GetX(), -q.GetY(), -q.GetZ(), q.GetW()]);
  }
  addBreakRemnants(item, points, source) {
    if (item.id <= 0 || item.fractured) return;
    const remnants = item.remnants ??= [];
    for (const point of points) {
      if (remnants.length >= 4) break;
      if (remnants.some((remnant) => Math.hypot(remnant.point[0] - point[0], remnant.point[1] - point[1], remnant.point[2] - point[2]) < 0.22)) continue;
      remnants.push({ point: [...point], sourceKind: source.kind, sourceFinish: source.finish, concreteStrength: source.concreteStrength, seed: Math.imul(item.id, 73856093) ^ Math.imul(source.id, 19349663) ^ remnants.length * 83492791 });
    }
  }
  force(item, x, y, z) {
    if ((x || y || z) && !item.body.IsActive()) this.bodies.ActivateBody(item.body.GetID());
    this.forceVector.Set(x, y, z);
    item.body.AddForce(this.forceVector);
  }
  spawnRock() {
    const J = this.J, n = this.rocks++, r = 0.65 + (Math.sin(n * 13.7) + 1) * 0.36, x = Math.sin(n * 4.17) * 3.2;
    const shape = new J.SphereShape(r);
    shape.AddRef();
    const q = new J.Quat(0, 0, 0, 1);
    const body = this.makeBody(shape, [x, 9 + n % 3, -20], q, 2600 * r * r * r * this.intensity);
    J.destroy(q);
    shape.Release();
    const vel = new J.Vec3(Math.sin(n) * 0.5, 0, 7 * this.intensity);
    body.SetLinearVelocity(vel);
    J.destroy(vel);
    body.SetRestitution(0.18);
    this.items.push({ id: this.allocateItemId(), kind: "rock", body, initial: [x, 9, -20], stress: 0, radius: r });
  }
  spawnMeteor() {
    const J = this.J, n = this.meteors++, slot = n % 24;
    const footprint = this.pieces.flatMap((p) => ports(p));
    const top = Math.max(8, ...footprint.map((p) => p[1]));
    const targets = this.items.filter((item2) => item2.id > 0 && !item2.fractured && !item2.retired && item2.kind !== "foundation" && item2.body.GetCenterOfMassPosition().GetY() > 0.5);
    const chosen = targets[Math.floor(meteorRandom(n, 2) * targets.length)];
    const center = chosen?.body.GetCenterOfMassPosition();
    const target = center ? [center.GetX(), center.GetY(), center.GetZ()] : [0, Math.max(2, top * 0.4), 0];
    const { position, velocity: launchVelocity } = meteorFlight(n, target, top, this.intensity);
    let item = this.meteorPool[slot];
    if (!item) {
      const radius = 0.55 + (Math.sin(slot * 4.17) + 1) * 0.27, shape = new J.SphereShape(radius);
      shape.AddRef();
      const q = new J.Quat(0, 0, 0, 1);
      const body = this.makeBody(shape, position, q, 1800 * METEOR_MASS_FACTOR * radius ** 3);
      J.destroy(q);
      shape.Release();
      body.SetRestitution(0.08);
      item = { id: this.allocateItemId(), kind: "meteor", body, initial: position, radius, stress: 0 };
      this.items.push(item);
      this.meteorPool.push(item);
    } else {
      const p = new J.RVec3(...position), q = new J.Quat(0, 0, 0, 1);
      this.bodies.SetPositionAndRotation(item.body.GetID(), p, q, J.EActivation_Activate);
      J.destroy(p);
      J.destroy(q);
    }
    item.initial = position;
    item.bornAt = this.elapsed;
    const motion = item.body.GetMotionProperties();
    motion.SetLinearDamping(0);
    motion.ResetForce();
    motion.ResetTorque();
    const velocity = new J.Vec3(...launchVelocity);
    item.body.SetLinearVelocity(velocity);
    velocity.Set(0, 0, 0);
    item.body.SetAngularVelocity(velocity);
    J.destroy(velocity);
  }
  projectileFlights = new ProjectileFlights(this);
  blockShots = [];
  blockShotSequence = 0;
  launchBlockProjectile(position, velocity, mass, radius, recycle = false, storey = false, building) {
    const options = normalizeBuildingProjectile(building);
    const J = this.J, layout2 = storey ? storeyProjectileLayout(options.parts) : blockProjectileLayout(Math.max(0.05, radius)), count = layout2.cells.length, totalWeight = layout2.cells.reduce((sum, cell) => sum + (cell.massWeight ?? 1), 0);
    if (count > this.fragmentLimit) return void 0;
    const slot = recycle ? this.blockShotSequence % 4 : -1;
    this.blockShotSequence++;
    const old = this.blockShots[slot];
    if (old) {
      this.projectileFlights.retire(old.root);
      const members = this.items.filter((i) => i.rootPieceId === old.root), ids = new Set(members.map((i) => i.id));
      for (const joint of this.joints) if (ids.has(joint.a.id) || joint.b && ids.has(joint.b.id)) {
        this.breakJoint(joint, true);
        this.system.RemoveConstraint(joint.constraint);
      }
      this.joints = this.joints.filter((j) => !ids.has(j.a.id) && !(j.b && ids.has(j.b.id)));
      for (const item of members) {
        this.removeRebars(item);
        if (!item.fractured) {
          if (!this.removedBodies.has(item.body)) {
            this.bodies.RemoveBody(item.body.GetID());
            this.removedBodies.add(item.body);
          }
          this.fragments--;
        }
        item.fractured = true;
        item.retired = true;
        this.jointNeighbors.delete(item.id);
        this.attachmentCounts.delete(item.id);
      }
      for (const [key3, pair] of this.pendingCollisions) if (old.bodies.includes(pair.a) || old.bodies.includes(pair.b)) {
        this.filter.EnableCollision(pair.a.GetCollisionGroup().GetSubGroupID(), pair.b.GetCollisionGroup().GetSubGroupID());
        this.pendingCollisions.delete(key3);
      }
    }
    if (!this.makeFragmentRoom(count, true) || !this.ensureBodyCapacity(count + (storey ? 1 : 0))) return void 0;
    this.projectiles++;
    const root = this.allocateItemId(), created = [], pool = [], q = new J.Quat(0, 0, 0, 1), v = new J.Vec3(...velocity);
    for (let index = 0; index < count; index++) {
      const cell = layout2.cells[index], partMass = storey ? cell.massWeight : mass * (cell.massWeight ?? 1) / totalWeight, p = position.map((n, i) => n + cell.offset[i]);
      const half = new J.Vec3(...cell.size.map((n) => n / 2)), shape = new J.BoxShape(half, Math.min(0.02, Math.min(...cell.size) * 0.05));
      J.destroy(half);
      shape.AddRef();
      let body = old?.bodies[index];
      if (body) {
        this.bodies.SetShape(body.GetID(), shape, true, J.EActivation_DontActivate);
        body.GetMotionProperties().ScaleToMass(partMass);
        const pos = new J.RVec3(...p);
        this.bodies.SetPositionAndRotation(body.GetID(), pos, q, J.EActivation_DontActivate);
        J.destroy(pos);
        this.bodies.AddBody(body.GetID(), J.EActivation_Activate);
        this.removedBodies.delete(body);
      } else body = this.makeBody(shape, p, q, partMass, false, true);
      shape.Release();
      body.GetMotionProperties().ResetForce();
      body.GetMotionProperties().ResetTorque();
      body.SetLinearVelocity(v);
      const zero = new J.Vec3(0, 0, 0);
      body.SetAngularVelocity(zero);
      J.destroy(zero);
      const item = { id: this.allocateItemId(), kind: "fragment", body, initial: p, stress: 0, size: cell.size, sourceKind: cell.sourceKind ?? "slab", sourceMass: partMass, impactMass: partMass, radius: Math.min(...cell.size) / 2, rootPieceId: root, structural: true, blockShot: root, protectedProjectile: !recycle, concreteStrength: storey && cell.sourceKind !== "facade" ? options.concreteStrength : 1, reinforcement: storey ? cell.sourceKind === "facade" ? 1 : options.reinforcement : 0.35, bornAt: this.elapsed };
      this.items.push(item);
      created.push(item);
      pool.push(body);
      this.fragments++;
    }
    J.destroy(q);
    J.destroy(v);
    if (recycle) this.blockShots[slot] = { root, bodies: [...pool, ...old?.bodies.slice(count) ?? []] };
    for (const [a, b] of layout2.links) {
      const left = created[a], right = created[b];
      const overlap = left.initial.map((n, i) => Math.min(n + left.size[i] / 2, right.initial[i] + right.size[i] / 2) - Math.max(n - left.size[i] / 2, right.initial[i] - right.size[i] / 2));
      const axis = overlap.indexOf(Math.min(...overlap));
      const point = left.initial.map((n, i) => (Math.min(n + left.size[i] / 2, right.initial[i] + right.size[i] / 2) + Math.max(n - left.size[i] / 2, right.initial[i] - right.size[i] / 2)) / 2);
      this.join(left, right, point);
      const joint = this.joints.at(-1);
      const area = storey ? overlap.reduce((product, v2, i) => i === axis ? product : product * Math.max(1e-3, v2), 1) : layout2.cells[a].size[0] ** 2;
      const glass = left.sourceKind === "facade" || right.sourceKind === "facade";
      if (!storey) {
        joint.force = 9e4 * area;
        joint.torque = [1, 1, 1].map(() => joint.force * Math.min(...left.size, ...right.size) * 0.35);
      }
      this.filter.DisableCollision(left.body.GetCollisionGroup().GetSubGroupID(), right.body.GetCollisionGroup().GetSubGroupID());
      if (storey && glass) {
        const panel = left.sourceKind === "facade" ? left : right, support = panel === left ? right : left;
        const edges = this.glassFrames.get(panel) ?? [];
        edges.push({ support, panelPoint: this.bodyLocalPoint(panel, point), supportPoint: this.bodyLocalPoint(support, point) });
        this.glassFrames.set(panel, edges);
      }
    }
    if (storey) {
      const compound = this.projectileFlights.start(root, created, position, old?.compound);
      if (recycle) this.blockShots[slot].compound = compound;
    } else if (recycle && old?.compound) this.blockShots[slot].compound = old.compound;
    return created[0];
  }
  launchProjectile(position, velocity, mass, radius, projectileType = "solid", recycle = false, building) {
    if (projectileType === "blocks" || projectileType === "storey") return this.launchBlockProjectile(position, velocity, mass, radius, recycle, projectileType === "storey", building);
    if (!this.ensureBodyCapacity(1)) return void 0;
    const J = this.J, n = this.projectiles++, slot = recycle ? n % 60 : this.projectilePool.length, r = Number.isFinite(radius) ? Math.max(1e-3, radius) : 0.7, m = Math.max(0.1, mass);
    const shape = new J.SphereShape(r);
    shape.AddRef();
    const q = new J.Quat(0, 0, 0, 1);
    let item = this.projectilePool[slot];
    if (item) {
      this.bodies.SetShape(item.body.GetID(), shape, true, J.EActivation_Activate);
      const motion = item.body.GetMotionProperties();
      motion.ScaleToMass(m);
      motion.ResetForce();
      motion.ResetTorque();
      const p = new J.RVec3(...position);
      this.bodies.SetPositionAndRotation(item.body.GetID(), p, q, J.EActivation_Activate);
      J.destroy(p);
      for (const key3 of this.projectileHits) if (key3.startsWith(item.id + ":")) this.projectileHits.delete(key3);
    } else {
      const body = this.makeBody(shape, position, q, m);
      item = { id: this.allocateItemId(), kind: "projectile", body, initial: [...position], stress: 0 };
      this.items.push(item);
      this.projectilePool.push(item);
    }
    J.destroy(q);
    shape.Release();
    item.initial = [...position];
    item.radius = r;
    item.impactMass = m;
    item.bornAt = this.elapsed;
    const v = new J.Vec3(...velocity);
    item.body.SetLinearVelocity(v);
    v.Set(0, 0, 0);
    item.body.SetAngularVelocity(v);
    J.destroy(v);
    item.body.SetRestitution(0.12);
    return item;
  }
  step(dt = 1 / 120) {
    if (this.bodyList.length > 1024 && this.elapsed >= this.collectAfter) {
      this.collectAfter = this.elapsed + 0.5;
      this.collectRetiredBodies();
    }
    if (this.startupAwakeUntil && this.elapsed >= this.startupAwakeUntil) {
      this.startupAwakeUntil = 0;
      for (const item of this.items) if (item.id > 0 && !item.fractured) item.body.SetAllowSleeping(!!this.rules.sandbox);
    }
    if (this.result) return;
    const start = performance.now();
    this.elapsed += dt;
    const t = this.elapsed, J = this.J, ramp = Math.min(1, Math.max(0, (t - 1) / 3));
    if (this.hazardActive("earthquake") || this.quakeResetSteps > 0) {
      if (this.quakeResetSteps > 0) this.quakeResetSteps--;
      const aftershock = this.rules.aftershock && t > this.duration * 0.58;
      const shockEnvelope = aftershock ? 1.8 * Math.max(0, 1 - (t - this.duration * 0.58) / 2) : 0;
      const quakeRamp = Math.min(1, Math.max(0, (this.hazardAge("earthquake") - 1) / 3));
      const amp = this.hazardActive("earthquake") ? 0.025 * this.intensity * quakeRamp * (1 + shockEnvelope) : 0;
      const p = new J.RVec3(amp * Math.sin(t * 19) + amp * 0.4 * Math.sin(t * 31), -1, amp * 0.65 * Math.sin(t * 23));
      const q = new J.Quat(0, 0, 0, 1);
      this.bodies.MoveKinematic(this.ground.GetID(), p, q, dt);
      J.destroy(p);
      J.destroy(q);
    }
    if (this.truck) for (const hinge of this.driveConstraints) hinge.SetTargetAngularVelocity(t > 1 ? -3.2 / 0.44 : 0);
    if (this.scenario === "landslide" && t > 1 && this.rocks < (this.rules.rockCount ?? 20) && t > 1 + this.rocks * (this.rules.rockInterval ?? 0.5)) this.spawnRock();
    if (this.hazardActive("meteors") && t >= this.nextMeteorAt) {
      this.spawnMeteor();
      this.nextMeteorAt = t + 0.85 / Math.max(0.5, this.intensity);
    }
    this.occupancy?.update(t);
    const floodRamp = Math.min(1, Math.max(0, (this.hazardAge("flood") - 1) / 3));
    const waterTarget = this.hazardActive("flood") ? -1 + floodRamp * 6 * this.intensity : -8;
    this.water = this.rules.sandbox ? this.water + Math.max(-dt * 2, Math.min(dt * 2, waterTarget - this.water)) : waterTarget;
    const wind = this.hazardActive("wind"), flood = this.hazardActive("flood") || this.rules.sandbox && this.water > 0;
    const gust = wind ? 1 + 0.3 * Math.sin(t * 3) + 0.2 * Math.sin(t * 7) : 0;
    const windForce = wind ? 58 * this.intensity * Math.min(1, Math.max(0, (this.hazardAge("wind") - 1) / 3)) : 0;
    for (const item of this.items) {
      item.stress = 0;
      if (item.fractured || item.id < 0 || !wind && !flood) continue;
      const def = PARTS[item.kind];
      if (wind) {
        const area = item.kind === "wall" || item.kind === "facade" ? 16 : item.kind === "slab" ? 2 : 3;
        this.force(item, area * 0.65 * windForce * windForce * gust, 0, area * 0.15 * windForce * windForce);
      }
      if (flood) {
        const p = item.body.GetCenterOfMassPosition(), v = item.body.GetLinearVelocity();
        const submerged = Math.max(0, Math.min(1, (this.water - p.GetY() + 1) / 2));
        const volume = def.segments.reduce((n, s) => n + s.size[0] * s.size[1] * s.size[2], 0);
        this.force(item, submerged * (14500 * this.intensity - v.GetX() * 1900), submerged * (volume * 1e3 * 9.81 - v.GetY() * 1500), submerged * 1e3);
      }
    }
    this.projectileFlights.beforeStep(dt);
    const projectileSweeps = this.rules.sandbox ? this.captureProjectileSweeps() : [];
    const groundImpacts = this.captureGroundImpacts();
    this.trees?.beforeStep(dt);
    this.vehicle?.step(dt);
    this.attacker?.step(dt);
    this.worldVehicles.step(dt);
    this.world.Step(dt, 1);
    this.vehicle?.afterStep();
    this.attacker?.afterStep();
    this.worldVehicles.afterStep();
    this.trees?.afterStep(dt);
    this.projectileFlights.syncAll();
    this.updateRebars(dt);
    this.fractureProjectileImpacts(projectileSweeps);
    this.fractureGroundImpacts(groundImpacts);
    if (this.rules.sandbox && !this.sandboxHazards.earthquake && this.quakeResetSteps === 0 && this.ground.GetMotionType() === J.EMotionType_Kinematic) this.bodies.SetMotionType(this.ground.GetID(), J.EMotionType_Static, J.EActivation_DontActivate);
    for (const [key3, pair] of this.pendingCollisions) {
      if (this.removedBodies.has(pair.a) || this.removedBodies.has(pair.b)) {
        this.pendingCollisions.delete(key3);
        continue;
      }
      if (!this.bodiesOverlap(pair.a, pair.b)) {
        this.filter.EnableCollision(pair.a.GetCollisionGroup().GetSubGroupID(), pair.b.GetCollisionGroup().GetSubGroupID());
        this.pendingCollisions.delete(key3);
      }
    }
    this.maxStress = 0;
    const awake = /* @__PURE__ */ new Set();
    for (const item of this.items) if ((item.id > 0 || item.structural) && !item.fractured && item.body.IsActive()) awake.add(item.id);
    for (const j of this.joints) {
      if (j.broken) continue;
      if (!awake.has(j.a.id) && (!j.b || !awake.has(j.b.id))) {
        j.stress = 0;
        j.overloadTime = Math.max(0, j.overloadTime - dt * 0.5);
        continue;
      }
      const f = j.constraint.GetTotalLambdaPosition().Length() / dt, torque = j.pinned ? null : j.constraint.GetTotalLambdaRotation();
      const stress = torque ? Math.max(f / j.force, Math.abs(torque.GetX()) / (dt * j.torque[0]), Math.abs(torque.GetY()) / (dt * j.torque[1]), Math.abs(torque.GetZ()) / (dt * j.torque[2])) : f / j.force;
      j.stress = stress;
      j.a.stress = Math.max(j.a.stress, stress);
      if (j.b) j.b.stress = Math.max(j.b.stress, stress);
      this.maxStress = Math.max(this.maxStress, stress);
      if (t < 0.5 && !j.a.blockShot && !j.b?.blockShot) j.overloadTime = 0;
      else if (stress > 1) j.overloadTime += dt * (stress - 1) * (stress - 1);
      else j.overloadTime = Math.max(0, j.overloadTime - dt * 0.5);
      if (j.overloadTime > 0.08) {
        if (!this.yieldJoint(j)) this.breakJoint(j);
      }
    }
    this.updateGlassDamage(t);
    this.peakStress = Math.max(this.peakStress, this.maxStress);
    if (this.truck) {
      const p = this.truck.body.GetPosition();
      if (p.GetY() < -2) this.finish(false, "The truck fell below the road. Reinforce the span and try again.");
      else if (p.GetX() > 14) this.finish(true, "The test truck made it across. Your bridge carried the load.");
    }
    if (this.house) {
      const p = this.house.body.GetPosition();
      if (Math.hypot(p.GetX(), p.GetY() - 1.6, p.GetZ() - 5) > HOUSE_DISPLACEMENT_LIMIT) this.finish(false, "The house shifted more than 0.5 m. Widen the wall or add stronger buttresses.");
    }
    if (!this.rules.sandbox && t >= this.duration && !this.result) {
      const structural = this.items.filter((i) => i.id > 0);
      const moved = structural.filter((i) => {
        if (i.fractured) return true;
        const p = i.body.GetPosition();
        return Math.hypot(p.GetX() - i.initial[0], p.GetY() - i.initial[1], p.GetZ() - i.initial[2]) > 1.5;
      }).length;
      const building = ["earthquake", "wind", "flood", "occupancy"].includes(this.scenario) || !!this.rules.occupancy ? this.buildingStatus() : null;
      const tall = building?.passed ?? false;
      const occupancyScenario = !!this.occupancy;
      const slabsAboveGround = this.pieces.some((p) => p.kind === "slab" && p.p[1] >= 4);
      const payload = this.items.filter((i) => i.kind === "payload");
      const retained = payload.length > 0 && payload.filter((i) => i.body.GetPosition().GetY() >= i.initial[1] - 1.5).length / payload.length >= 0.75;
      const pass = occupancyScenario ? tall && slabsAboveGround && retained && moved / Math.max(1, structural.length) < 0.25 : this.scenario !== "bridge" && (this.scenario === "landslide" || tall) && structural.length > 0 && moved / structural.length < 0.25;
      let reason;
      if (pass) reason = occupancyScenario ? "The occupied floors held their live load and the tower remained stable." : this.scenario === "landslide" ? "The barrier held. The house is safe." : "Your structure survived with less than 25% major displacement.";
      else if (building && !building.passed) reason = building.reason;
      else if (occupancyScenario && !slabsAboveGround) reason = `The structure must include an occupied floor above ground and reach at least ${this.rules.minHeight ?? 8} m.`;
      else if (occupancyScenario && !payload.length) reason = "No occupancy load was placed on a raised floor.";
      else if (occupancyScenario && !retained) reason = "Too much occupancy load fell from the floors. Add columns and lateral bracing.";
      else reason = this.scenario === "bridge" ? "The truck did not reach the far bank." : !tall && this.scenario !== "landslide" ? `The structure must reach at least ${this.rules.minHeight ?? 8} m.` : "Too much of the structure moved or collapsed. Add foundations and lateral bracing.";
      this.finish(pass, reason);
    }
    this.physicsMs = performance.now() - start;
  }
  updateGlassDamage(time) {
    if (time < 0.5 || time < this.nextGlassCheck) return;
    this.nextGlassCheck = time + 0.05;
    let budget = 6;
    for (const [panel, edges] of this.glassFrames) {
      if (panel.fractured || panel.retired) {
        this.glassFrames.delete(panel);
        this.glassStrain.delete(panel.id);
        continue;
      }
      let failed = false, strained = false, point;
      for (const edge of edges) {
        if (edge.support.fractured || edge.support.retired) {
          failed = true;
          point = this.bodyWorldPoint(panel, edge.panelPoint);
          break;
        }
        if (!panel.body.IsActive() && !edge.support.body.IsActive()) continue;
        const a = this.bodyWorldPoint(panel, edge.panelPoint), b = this.bodyWorldPoint(edge.support, edge.supportPoint);
        if (Math.hypot(a[0] - b[0], a[1] - b[1], a[2] - b[2]) > 0.18) {
          strained = true;
          point = a;
          break;
        }
      }
      const strain = strained ? (this.glassStrain.get(panel.id) ?? 0) + 0.05 : 0;
      this.glassStrain.set(panel.id, strain);
      const mounts = this.jointNeighbors.get(panel.id) ?? [];
      const detached = mounts.length > 0 && mounts.every((j) => j.broken);
      if (budget && (failed || detached || strain >= 0.1)) {
        this.fracture(panel, point);
        budget--;
      }
    }
  }
  yieldJoint(j) {
    if (j.pinned || !REINFORCED_KINDS.has(j.a.sourceKind ?? j.a.kind) || j.b && !REINFORCED_KINDS.has(j.b.sourceKind ?? j.b.kind) || this.reinforcement(j.a) <= 0 || j.b && this.reinforcement(j.b) <= 0 || (j.damageStage ?? 0) >= 2) return false;
    j.damageStage = (j.damageStage ?? 0) + 1;
    j.overloadTime = 0;
    const angle = j.damageStage === 1 ? 0.07 : 0.24, friction = j.damageStage === 1 ? 0.45 : 0.18;
    const lo = new this.J.Vec3(-angle, -angle, -angle), hi = new this.J.Vec3(angle, angle, angle);
    j.constraint.SetRotationLimits(lo, hi);
    this.J.destroy(lo);
    this.J.destroy(hi);
    for (let axis = 0; axis < 3; axis++) j.constraint.SetMaxFriction(axis + 3, j.torque[axis] * friction);
    return true;
  }
  breakJoint(j, transfer = false) {
    if (j.broken) return false;
    j.constraint.SetEnabled(false);
    j.broken = true;
    if (j.b && !transfer) {
      this.addBreakRemnants(j.a, j.localA, j.b);
      this.addBreakRemnants(j.b, j.localB ?? [], j.a);
    }
    const key3 = `${j.groupA}:${j.groupB}`, remaining = Math.max(0, (this.jointCounts.get(key3) ?? 1) - 1);
    this.jointCounts.set(key3, remaining);
    for (const item of j.b ? [j.a, j.b] : [j.a]) this.attachmentCounts.set(item.id, Math.max(0, (this.attachmentCounts.get(item.id) ?? 1) - 1));
    if (remaining === 0 && j.groupA !== void 0 && j.groupB !== void 0) this.restoreCollisionWhenSeparate(j.a.body, j.b?.body ?? this.bodyList[j.groupB]);
    if (!transfer && j.b && remaining === 0 && REINFORCED_KINDS.has(j.a.sourceKind ?? j.a.kind) && REINFORCED_KINDS.has(j.b.sourceKind ?? j.b.kind) && !j.a.fractured && !j.b.fractured) {
      const center = (points) => points.reduce((out, p) => out.map((v, i) => v + p[i] / points.length), [0, 0, 0]);
      this.createRebar(j.a, j.b, this.bodyWorldPoint(j.a, center(j.localA)), this.bodyWorldPoint(j.b, center(j.localB)), 0.18, 22e4, true);
    }
    if (!transfer) {
      this.broken++;
      this.releaseFacadeClearance(j.a);
      if (j.b) this.releaseFacadeClearance(j.b);
    }
    return true;
  }
  releaseFacadeClearance(item) {
    if (this.attachmentCounts.get(item.id)) return;
    const peers = this.facadeClearances.get(item.id);
    if (!peers) return;
    for (const peer of peers) {
      if (!item.fractured && !peer.fractured) this.restoreCollisionWhenSeparate(item.body, peer.body);
      this.facadeClearances.get(peer.id)?.delete(item);
    }
    this.facadeClearances.delete(item.id);
  }
  captureProjectileSweeps() {
    const sweeps = [];
    for (const item of this.items) {
      if (item.flying || item.kind !== "projectile" && !item.blockShot || item.fractured || !item.body.IsActive()) continue;
      const p = item.body.GetPosition(), v = item.body.GetLinearVelocity(), speed = Math.hypot(v.GetX(), v.GetY(), v.GetZ());
      sweeps.push({ item, from: [p.GetX(), p.GetY(), p.GetZ()], speed, energy: 0.5 * (item.impactMass ?? 0) * speed * speed });
    }
    return sweeps;
  }
  fractureProjectileImpacts(sweeps) {
    const active = sweeps.filter((sweep) => sweep.speed >= 3 && sweep.energy >= 5e3);
    if (!active.length) return;
    const entries = [], oversized = [], grid = /* @__PURE__ */ new Map(), cellSize = 8, useGrid = this.rules.kineticVariant === "reference" || active.length > 8;
    let indexed = 0, indexedItems = this.items;
    const indexedTargets = /* @__PURE__ */ new Set();
    const indexNewTargets = () => {
      if (indexedItems !== this.items) {
        indexedItems = this.items;
        indexed = 0;
      }
      while (indexed < this.items.length) {
        const target = this.items[indexed++];
        if (indexedTargets.has(target)) continue;
        indexedTargets.add(target);
        if (target.id <= 0 && !target.structural || !["column", "slab", "wall", "deck", "facade", "doorway", "stairwell", "stair", "core"].includes(target.sourceKind ?? target.kind) || target.fractured) continue;
        const bounds = target.body.GetWorldSpaceBounds(), lo = bounds.mMin, hi = bounds.mMax;
        const min = [lo.GetX(), lo.GetY(), lo.GetZ()], max = [hi.GetX(), hi.GetY(), hi.GetZ()], entry = { target, min, max, order: indexed };
        entries.push(entry);
        if (!useGrid) continue;
        const a = min.map((n) => Math.floor(n / cellSize)), b = max.map((n) => Math.floor(n / cellSize));
        if (b.some((n, i) => !Number.isFinite(n - a[i])) || (b[0] - a[0] + 1) * (b[1] - a[1] + 1) * (b[2] - a[2] + 1) > 512) {
          oversized.push(entry);
          continue;
        }
        for (let x = a[0]; x <= b[0]; x++) for (let y = a[1]; y <= b[1]; y++) for (let z = a[2]; z <= b[2]; z++) {
          const key3 = `${x},${y},${z}`, rows = grid.get(key3);
          if (rows) rows.push(entry);
          else grid.set(key3, [entry]);
        }
      }
    };
    indexNewTargets();
    for (const sweep of active) {
      const p = sweep.item.body.GetPosition(), to = [p.GetX(), p.GetY(), p.GetZ()];
      let hit, first = Infinity;
      const margin = (sweep.item.radius ?? 0) + 0.35, low = sweep.from.map((n, i) => Math.floor((Math.min(n, to[i]) - margin) / cellSize)), high = sweep.from.map((n, i) => Math.floor((Math.max(n, to[i]) + margin) / cellSize));
      const volume = (high[0] - low[0] + 1) * (high[1] - low[1] + 1) * (high[2] - low[2] + 1);
      let candidates;
      if (!useGrid || !Number.isFinite(volume) || volume > 512) candidates = entries;
      else {
        const sameAssembly = (entry) => !!sweep.item.blockShot && entry.target.rootPieceId === sweep.item.rootPieceId;
        const nearby = new Set(oversized.filter((entry) => !sameAssembly(entry)));
        for (let x = low[0]; x <= high[0]; x++) for (let y = low[1]; y <= high[1]; y++) for (let z = low[2]; z <= high[2]; z++) for (const entry of grid.get(`${x},${y},${z}`) ?? []) if (!sameAssembly(entry)) nearby.add(entry);
        candidates = [...nearby].sort((a, b) => a.order - b.order);
      }
      for (const { target, min, max } of candidates) {
        if (!useGrid && (Math.max(sweep.from[0], to[0]) + margin < min[0] || Math.min(sweep.from[0], to[0]) - margin > max[0] || Math.max(sweep.from[1], to[1]) + margin < min[1] || Math.min(sweep.from[1], to[1]) - margin > max[1] || Math.max(sweep.from[2], to[2]) + margin < min[2] || Math.min(sweep.from[2], to[2]) - margin > max[2])) continue;
        if (target === sweep.item || sweep.item.blockShot && target.rootPieceId === sweep.item.rootPieceId) continue;
        if (target.id <= 0 && !target.structural || !["column", "slab", "wall", "deck", "facade", "doorway", "stairwell", "stair", "core"].includes(target.sourceKind ?? target.kind) || target.fractured) continue;
        const glass = (target.sourceKind ?? target.kind) === "facade", strength = this.concreteStrength(target);
        if (sweep.speed < (glass ? 3 : 12 * Math.sqrt(strength)) || sweep.energy < (glass ? 5e3 : (sweep.item.blockShot ? 3e4 : 75e4) * strength)) continue;
        const key3 = `${sweep.item.id}:${target.rootPieceId ?? target.id}`;
        if (this.projectileHits.has(key3)) continue;
        let contact = this.segmentAabbHit(sweep.from, to, min, max, (sweep.item.radius ?? 0) + 0.35);
        const segments = target.size ? void 0 : PARTS[target.sourceKind ?? target.kind]?.segments;
        if (Number.isFinite(contact) && segments && segments.length > 1) {
          const localFrom = this.bodyLocalPoint(target, sweep.from), localTo = this.bodyLocalPoint(target, to);
          contact = Infinity;
          for (const segment of segments) {
            const c = Math.cos(segment.tilt ?? 0), s = Math.sin(segment.tilt ?? 0);
            const local = (v) => {
              const x = v[0] - segment.center[0], y = v[1] - segment.center[1];
              return [c * x + s * y, -s * x + c * y, v[2] - segment.center[2]];
            };
            contact = Math.min(contact, this.segmentAabbHit(local(localFrom), local(localTo), segment.size.map((v) => -v / 2), segment.size.map((v) => v / 2), (sweep.item.radius ?? 0) + 0.35));
          }
        }
        if (contact < first) {
          first = contact;
          hit = target;
        }
      }
      if (!hit) continue;
      this.projectileHits.add(`${sweep.item.id}:${hit.rootPieceId ?? hit.id}`);
      const point = sweep.from.map((v, i) => v + (to[i] - v) * first);
      this.impactFracture(hit, point, sweep.energy);
      if (sweep.item.blockShot) this.impactFracture(sweep.item, point, sweep.energy, 3e4);
      indexNewTargets();
    }
  }
  segmentAabbHit(from, to, min, max, margin) {
    let near2 = 0, far = 1;
    for (let axis = 0; axis < 3; axis++) {
      const delta = to[axis] - from[axis], low = min[axis] - margin, high = max[axis] + margin;
      if (Math.abs(delta) < 1e-9) {
        if (from[axis] < low || from[axis] > high) return Infinity;
        continue;
      }
      let a = (low - from[axis]) / delta, b = (high - from[axis]) / delta;
      if (a > b) [a, b] = [b, a];
      near2 = Math.max(near2, a);
      far = Math.min(far, b);
      if (near2 > far) return Infinity;
    }
    return near2;
  }
  bodiesOverlap(a, b) {
    const bounds = a.GetWorldSpaceBounds(), lo = bounds.mMin;
    const ax = lo.GetX(), ay = lo.GetY(), az = lo.GetZ(), hi = bounds.mMax;
    const bx = hi.GetX(), by = hi.GetY(), bz = hi.GetZ();
    const other = b.GetWorldSpaceBounds(), min = other.mMin;
    const cx = min.GetX(), cy = min.GetY(), cz = min.GetZ(), max = other.mMax;
    return ax <= max.GetX() && bx >= cx && ay <= max.GetY() && by >= cy && az <= max.GetZ() && bz >= cz;
  }
  restoreCollisionWhenSeparate(a, b) {
    const ga = a.GetCollisionGroup().GetSubGroupID(), gb = b.GetCollisionGroup().GetSubGroupID();
    const key3 = ga < gb ? `${ga}:${gb}` : `${gb}:${ga}`;
    if (this.bodiesOverlap(a, b)) {
      this.filter.DisableCollision(ga, gb);
      this.pendingCollisions.set(key3, { a, b });
    } else this.filter.EnableCollision(ga, gb);
  }
  makeFragmentRoom(amount, forProjectile = false) {
    if (amount > this.fragmentLimit) return false;
    let needed = Math.max(0, this.fragments + amount - this.fragmentLimit);
    if (!needed) return true;
    const debris = this.items.filter((item) => item.kind === "fragment" && !item.fractured && (forProjectile || !item.flying && !item.protectedProjectile && (!item.structural || !(this.attachmentCounts.get(item.id) ?? 0) && !item.body.IsActive()))).sort((a, b) => (forProjectile ? 0 : Number(a.body.IsActive()) - Number(b.body.IsActive())) || (a.bornAt ?? 0) - (b.bornAt ?? 0));
    for (const item of debris) {
      if (needed <= 0) break;
      if (item.flying) this.projectileFlights.release(item.blockShot);
      for (const joint of this.jointNeighbors.get(item.id) ?? []) this.breakJoint(joint, true);
      this.removeRebars(item);
      this.bodies.RemoveBody(item.body.GetID());
      this.removedBodies.add(item.body);
      item.fractured = true;
      item.retired = true;
      this.fragments--;
      needed--;
    }
    return needed === 0;
  }
  setFragmentLimit(value) {
    this.fragmentLimit = Math.max(24, Math.min(3e3, Math.round(value)));
    this.makeFragmentRoom(0);
  }
  captureGroundImpacts() {
    const falling = [];
    for (const item of this.items) {
      if (item.fractured || item.id <= 0 && !item.structural || !["column", "slab", "wall", "deck", "facade", "doorway", "stairwell", "stair", "core"].includes(item.sourceKind ?? item.kind) || !item.body.IsActive()) continue;
      const vy = item.body.GetLinearVelocity().GetY();
      if (vy < -7 * Math.sqrt(this.concreteStrength(item))) falling.push({ item, vy });
    }
    return falling;
  }
  fractureGroundImpacts(falling) {
    let budget = 4;
    for (const { item, vy } of falling) {
      if (!budget || item.fractured || item.body.GetLinearVelocity().GetY() - vy < 5 * Math.sqrt(this.concreteStrength(item))) continue;
      const bounds = item.body.GetWorldSpaceBounds();
      if (bounds.mMin.GetY() > 0.18) continue;
      const center = item.body.GetCenterOfMassPosition();
      this.fracture(item, [center.GetX(), 0, center.GetZ()]);
      budget--;
    }
  }
  coreImpactEnergy = /* @__PURE__ */ new Map();
  materialImpactEnergy = /* @__PURE__ */ new Map();
  impactFracture(item, point, energy, baselineThreshold = 75e4) {
    if ((item.sourceKind ?? item.kind) === "core") {
      const accumulated = (this.coreImpactEnergy.get(item.id) ?? 0) + Math.max(0, energy);
      const threshold = 45e5 * this.concreteStrength(item) * Math.max(0.2, (item.sourceMass ?? PARTS.core.mass) / PARTS.core.mass);
      if (accumulated < threshold) {
        this.coreImpactEnergy.set(item.id, accumulated);
        return;
      }
      this.coreImpactEnergy.delete(item.id);
    } else if (isConcrete(item.sourceKind ?? item.kind)) {
      const threshold = baselineThreshold * this.concreteStrength(item), accumulated = (this.materialImpactEnergy.get(item.id) ?? 0) + Math.max(0, energy);
      if (accumulated < threshold) {
        this.materialImpactEnergy.set(item.id, accumulated);
        return;
      }
      this.materialImpactEnergy.delete(item.id);
    }
    this.fracture(item, point);
  }
  fracture(item, hitWorld) {
    this.projectileFlights.release(item.blockShot);
    if (item.fractured) return;
    const piece = this.pieces.find((p2) => p2.id === item.id) ?? (item.structural ? { id: item.id, kind: item.sourceKind, p: [0, 0, 0], rotation: 0, finish: item.finish } : void 0);
    if (!piece) return;
    const hitLocal = hitWorld ? this.bodyLocalPoint(item, hitWorld) : item.size ? [0, 0, 0] : PARTS[piece.kind].segments[0].center;
    const chunks = localFractureShapes(piece, hitLocal, item.size ? { center: [0, 0, 0], size: item.size, mass: item.sourceMass } : void 0);
    if (!chunks.length) return;
    if (!this.ensureBodyCapacity(chunks.length) || !this.makeFragmentRoom(chunks.length - (item.kind === "fragment" ? 1 : 0))) {
      if (item.protectedProjectile) {
        for (const joint of this.jointNeighbors.get(item.id) ?? []) this.breakJoint(joint, true);
        this.removeRebars(item);
        item.structural = false;
        item.impactMass = 0;
        return;
      }
      for (const joint of this.jointNeighbors.get(item.id) ?? []) this.breakJoint(joint);
      this.removeRebars(item);
      this.bodies.RemoveBody(item.body.GetID());
      this.removedBodies.add(item.body);
      item.fractured = true;
      if (item.kind === "fragment") this.fragments--;
      return;
    }
    const attachments = (this.jointNeighbors.get(item.id) ?? []).filter((j) => !j.broken).map((j) => ({ j, points: (j.a === item ? j.localA : j.localB).map((p2) => this.bodyWorldPoint(item, p2)) }));
    for (const { j } of attachments) this.breakJoint(j, true);
    const J = this.J, p = item.body.GetPosition(), q = item.body.GetRotation(), v = item.body.GetLinearVelocity(), w = item.body.GetAngularVelocity();
    const origin = [p.GetX(), p.GetY(), p.GetZ()], rotation = [q.GetX(), q.GetY(), q.GetZ(), q.GetW()];
    const velocity = [v.GetX(), v.GetY(), v.GetZ()], angular = [w.GetX(), w.GetY(), w.GetZ()];
    const com = item.body.GetCenterOfMassPosition(), center = [com.GetX(), com.GetY(), com.GetZ()];
    const peers = /* @__PURE__ */ new Set();
    for (const joint of this.jointNeighbors.get(item.id) ?? []) {
      if (joint.a === item) peers.add(joint.b?.body ?? this.bodyList[joint.groupB]);
      else if (joint.b === item) peers.add(joint.a.body);
    }
    for (const pair of this.pendingCollisions.values()) {
      if (pair.a === item.body) peers.add(pair.b);
      else if (pair.b === item.body) peers.add(pair.a);
    }
    const energy = chunks.reduce((sum, c) => sum + 0.5 * c.mass * c.kick.reduce((n, v2) => n + v2 * v2, 0), 0);
    const kinetic = 0.5 * (item.sourceMass ?? PARTS[piece.kind].mass) * velocity.reduce((n, v2) => n + v2 * v2, 0);
    const kickScale = Math.sqrt(Math.min(750, kinetic * 0.02) / Math.max(energy, 1e-3));
    const transfers = this.rebars.filter((link) => !link.broken && (link.a === item || link.b === item)).map((link) => ({ link, pa: this.bodyWorldPoint(link.a, link.localA), pb: this.bodyWorldPoint(link.b, link.localB) }));
    this.removeRebars(item);
    this.bodies.RemoveBody(item.body.GetID());
    this.removedBodies.add(item.body);
    item.fractured = true;
    if (item.kind === "fragment") this.fragments--;
    const created = [];
    for (const chunk of chunks) {
      const offset = rotateByQuaternion(chunk.center, rotation), position = origin.map((v2, a) => v2 + offset[a]);
      let shape;
      if (chunk.vertices) {
        if (!J.ConvexHullShapeSettings) throw new Error("Jolt ConvexHullShapeSettings is required for polygon fracture");
        const points = chunk.vertices.map((vertex) => new J.Vec3(...vertex)), settings = new J.ConvexHullShapeSettings();
        for (const point of points) settings.mPoints.push_back(point);
        const created2 = settings.Create();
        if (!created2.IsValid?.()) throw new Error("Jolt rejected polygon fracture hull");
        shape = created2.Get();
        shape.AddRef();
        J.destroy(created2);
        J.destroy(settings);
        for (const point of points) J.destroy(point);
      }
      if (!shape) {
        const half = new J.Vec3(...chunk.size.map((v2) => v2 / 2));
        shape = new J.BoxShape(half, 0.015);
        J.destroy(half);
        shape.AddRef();
      }
      const quat = new J.Quat(...rotation), body = this.makeBody(shape, position, quat, chunk.mass, false, true);
      J.destroy(quat);
      shape.Release();
      const r = position.map((v2, a) => v2 - center[a]), cross2 = [angular[1] * r[2] - angular[2] * r[1], angular[2] * r[0] - angular[0] * r[2], angular[0] * r[1] - angular[1] * r[0]];
      const linear = new J.Vec3(...velocity.map((v2, a) => v2 + cross2[a] + chunk.kick[a] * kickScale));
      body.SetLinearVelocity(linear);
      J.destroy(linear);
      const spin = new J.Vec3(...angular);
      body.SetAngularVelocity(spin);
      J.destroy(spin);
      for (const peer of peers) if (peer && !this.removedBodies.has(peer)) this.restoreCollisionWhenSeparate(body, peer);
      const fragment = { id: this.allocateItemId(), kind: "fragment", body, initial: position, stress: 0, concreteStrength: item.concreteStrength, reinforcement: item.reinforcement, size: chunk.size, vertices: chunk.vertices, finish: piece.finish, sourceKind: piece.kind, rootPieceId: item.rootPieceId ?? item.id, structural: chunk.structural, sourceMass: chunk.mass, protectedProjectile: item.protectedProjectile, fractureDepth: (item.fractureDepth ?? 0) + 1, bornAt: this.elapsed };
      this.items.push(fragment);
      created.push(fragment);
      this.fragments++;
    }
    const containing = (point) => {
      const local = this.bodyLocalPoint(item, point);
      return created.find((child, i) => child.structural && chunks[i].size.every((size, axis) => Math.abs(local[axis] - chunks[i].center[axis]) <= size * 0.5 + 0.04));
    };
    for (const { j, points } of attachments) {
      const groups = /* @__PURE__ */ new Map();
      for (const point of points) {
        const child = containing(point);
        if (child) {
          const list = groups.get(child) ?? [];
          list.push(point);
          groups.set(child, list);
        }
      }
      if (!groups.size) {
        this.broken++;
        continue;
      }
      for (const [child, ports2] of groups) {
        const center2 = ports2.reduce((sum, p2) => sum.map((v2, i) => v2 + p2[i] / ports2.length), [0, 0, 0]);
        const a = j.a === item ? child : j.a, b = j.b === item ? child : j.b;
        this.join(a, b, center2, ports2, j.pinned, j.b ? void 0 : this.bodyList[j.groupB]);
        const replacement = this.joints.at(-1);
        replacement.force = j.force * ports2.length / points.length;
        replacement.torque = j.torque.map((v2) => v2 * ports2.length / points.length);
        for (let stage = 0; stage < (j.damageStage ?? 0); stage++) this.yieldJoint(replacement);
        const groupA = a.body.GetCollisionGroup().GetSubGroupID(), groupB = (b?.body ?? this.bodyList[j.groupB]).GetCollisionGroup().GetSubGroupID();
        this.filter.DisableCollision(groupA, groupB);
        this.pendingCollisions.delete(groupA < groupB ? `${groupA}:${groupB}` : `${groupB}:${groupA}`);
      }
    }
    for (const { j } of attachments) {
      this.releaseFacadeClearance(j.a);
      if (j.b) this.releaseFacadeClearance(j.b);
    }
    if (REINFORCED_KINDS.has(piece.kind)) this.createLocalRebars(created, chunks, origin, rotation);
    for (const { link, pa, pb } of transfers) {
      const point = link.a === item ? pa : pb;
      const nearest = created.reduce((best, c) => Math.hypot(...c.initial.map((v2, i) => v2 - point[i])) < Math.hypot(...best.initial.map((v2, i) => v2 - point[i])) ? c : best);
      const a = link.a === item ? nearest : link.a, b = link.b === item ? nearest : link.b;
      if (!a.fractured && !b.fractured) this.createRebar(a, b, pa, pb, link.limit, link.strength, false);
    }
  }
  bodyWorldPoint(item, local) {
    const q = item.body.GetRotation(), offset = rotateByQuaternion(local, [q.GetX(), q.GetY(), q.GetZ(), q.GetW()]), p = item.body.GetPosition();
    return [p.GetX() + offset[0], p.GetY() + offset[1], p.GetZ() + offset[2]];
  }
  createRebar(a, b, pa, pb, limit, strength = 14e4, scaleMaterials = true) {
    if (this.reinforcement(a) <= 0 || this.reinforcement(b) <= 0) return;
    if (scaleMaterials) {
      const factor = Math.min(this.reinforcement(a), this.reinforcement(b));
      limit *= factor;
      strength *= factor;
    }
    const J = this.J, settings = new J.DistanceConstraintSettings();
    settings.mPoint1.Set(...pa);
    settings.mPoint2.Set(...pb);
    settings.mMinDistance = 0;
    settings.mMaxDistance = limit;
    const constraint = J.castObject(settings.Create(a.body, b.body), J.DistanceConstraint);
    this.system.AddConstraint(constraint);
    J.destroy(settings);
    const id = this.nextRebarId++, localA = this.bodyLocalPoint(a, pa), localB = this.bodyLocalPoint(b, pb);
    this.rebars.push({ id, constraint, a, b, localA, localB, limit, strength, broken: false, overloadTime: 0 });
    (a.rebarLinks ??= []).push({ id, to: b.id, localA, localB });
  }
  createLocalRebars(fragments, chunks, origin, rotation) {
    for (let a = 0; a < chunks.length; a++) for (let b = a + 1; b < chunks.length; b++) {
      const left = chunks[a], right = chunks[b];
      for (let axis = 0; axis < 3; axis++) {
        const gap = Math.abs(left.center[axis] - right.center[axis]) - (left.size[axis] + right.size[axis]) * 0.5;
        if (Math.abs(gap) > 0.04) continue;
        const others = [0, 1, 2].filter((i) => i !== axis), point = [0, 0, 0];
        let adjacent = true;
        for (const i of others) {
          const lo = Math.max(left.center[i] - left.size[i] * 0.5, right.center[i] - right.size[i] * 0.5), hi = Math.min(left.center[i] + left.size[i] * 0.5, right.center[i] + right.size[i] * 0.5);
          if (hi - lo < 0.025) {
            adjacent = false;
            break;
          }
          point[i] = (lo + hi) * 0.5;
        }
        if (!adjacent) continue;
        const direction = Math.sign(right.center[axis] - left.center[axis]);
        point[axis] = left.center[axis] + direction * left.size[axis] * 0.5;
        const offset = rotateByQuaternion(point, rotation), world = origin.map((v, i) => v + offset[i]);
        this.createRebar(fragments[a], fragments[b], world, world, 0.12, 14e4, true);
        break;
      }
    }
  }
  updateRebars(dt) {
    for (const link of this.rebars) {
      if (link.broken) continue;
      const tension = Math.abs(link.constraint.GetTotalLambdaPosition()) / dt, ratio = tension / link.strength;
      if (ratio > 1) link.overloadTime += dt * (ratio - 1) * (ratio - 1);
      else link.overloadTime = Math.max(0, link.overloadTime - dt * 0.7);
      if (link.overloadTime > 0.065) this.breakRebar(link);
    }
  }
  breakRebar(link) {
    if (link.broken) return;
    this.system.RemoveConstraint(link.constraint);
    link.broken = true;
    link.a.rebarLinks = link.a.rebarLinks?.filter((row) => row.id !== link.id);
  }
  removeRebars(item) {
    for (const link of this.rebars) if (!link.broken && (link.a === item || link.b === item)) this.breakRebar(link);
  }
  buildingStatus() {
    const positions = /* @__PURE__ */ new Map(), upright = /* @__PURE__ */ new Map(), blueprint = new Map(this.pieces.map((p) => [p.id, p]));
    for (const item of this.items) {
      if (item.id < 0) continue;
      const p = item.body.GetPosition(), q = item.body.GetRotation();
      positions.set(item.id, [p.GetX(), p.GetY(), p.GetZ()]);
      const initialYaw = (blueprint.get(item.id)?.rotation ?? 0) * Math.PI / 4;
      const aligned = Math.abs(q.GetY() * Math.sin(initialYaw) + q.GetW() * Math.cos(initialYaw)) >= Math.cos(Math.PI / 24);
      upright.set(item.id, !item.fractured && aligned && 1 - 2 * (q.GetX() * q.GetX() + q.GetZ() * q.GetZ()) >= Math.cos(Math.PI / 18));
    }
    const intact = this.joints.filter((j) => !j.broken);
    return evaluateBuilding(this.pieces, { minHeight: this.rules.minHeight ?? 8, minFloorArea: this.rules.minFloorArea ?? 32 }, { positions, upright, links: intact.filter((j) => j.b).map((j) => [j.a.id, j.b.id]), anchors: intact.filter((j) => !j.b).map((j) => j.a.id) });
  }
  finish(pass, reason) {
    this.result = pass ? "passed" : "failed";
    this.reason = reason;
  }
  dispose() {
    this.worldVehicles.dispose();
    this.attacker?.dispose();
    this.vehicle?.dispose();
    this.trees?.dispose();
    for (const j of this.joints) this.system.RemoveConstraint(j.constraint);
    for (const link of this.rebars) if (!link.broken) this.system.RemoveConstraint(link.constraint);
    this.rebars = [];
    for (const c of this.driveConstraints) this.system.RemoveConstraint(c);
    this.driveConstraints = [];
    this.joints = [];
    for (const b of this.bodyList) {
      const id = b.GetID();
      if (!this.removedBodies.has(b)) this.bodies.RemoveBody(id);
      this.bodies.DestroyBody(id);
    }
    this.bodyList = [];
    this.filter.Release();
    this.J.destroy(this.forceVector);
    this.J.destroy(this.world);
  }
};

// src/building-accessibility.ts
var clone = (p) => ({ ...p, p: [...p.p] });
var samePlace = (a, b) => a.kind === b.kind && a.p.every((v, i) => v === b.p[i]) && a.rotation === b.rotation;
function withBuildingAccessibility(input, options = {}) {
  const entrance = options.entrance !== false;
  const stairs = options.stairs !== false;
  const maxStairs = options.maxStairs ?? Infinity;
  if (input.some((p) => p.kind === "stair")) return input.map(clone);
  const pieces = input.map(clone);
  if (entrance) {
    const candidates = pieces.filter((p) => (p.kind === "facade" || p.kind === "wall") && p.p[1] === 0).sort((a, b) => (a.kind === "facade" ? -1 : 1) - (b.kind === "facade" ? -1 : 1));
    const panel = candidates[0];
    if (panel) {
      const index = pieces.indexOf(panel);
      pieces.splice(index, 1, { ...panel, id: panel.id, kind: "doorway", p: [...panel.p], rotation: panel.rotation, finish: panel.finish });
    } else {
      const lower = pieces.filter((p) => p.p[1] === 0);
      if (lower.length) {
        const minX = Math.min(...lower.map((p) => p.p[0]));
        const minZ = Math.min(...lower.map((p) => p.p[2]));
        pieces.push({ id: Math.max(0, ...pieces.map((p) => p.id)) + 1, kind: "doorway", p: [minX, 0, minZ], rotation: 0, finish: "sandstone" });
      }
    }
  }
  if (stairs) {
    const slabs = pieces.filter((p) => p.kind === "slab" || p.kind === "deck");
    const levels = [...new Set(slabs.map((p) => p.p[1]).filter((y) => y > 0))].sort((a, b) => a - b);
    let made = 0;
    let previous = [];
    for (const level of levels) {
      if (made >= maxStairs) break;
      const atLevel = slabs.filter((p) => p.p[1] === level);
      if (!atLevel.length) continue;
      const unseen = new Set(atLevel), components2 = [];
      while (unseen.size) {
        const group = [unseen.values().next().value];
        unseen.delete(group[0]);
        for (let i = 0; i < group.length; i++) for (const q of unseen) {
          if (Math.abs(q.p[0] - group[i].p[0]) + Math.abs(q.p[2] - group[i].p[2]) < 4.01) {
            unseen.delete(q);
            group.push(q);
          }
        }
        components2.push(group);
      }
      const next = [];
      for (const component of components2) {
        const atLevel2 = component;
        const cx = atLevel2.reduce((sum, p) => sum + p.p[0], 0) / atLevel2.length;
        const cz = atLevel2.reduce((sum, p) => sum + p.p[2], 0) / atLevel2.length;
        const slab = atLevel2.find((p) => previous.some((q) => p.p[0] === q.p[0] && p.p[2] === q.p[2] && p.rotation === q.rotation)) ?? atLevel2.slice().sort((a, b) => (a.p[0] - cx) ** 2 + (a.p[2] - cz) ** 2 - ((b.p[0] - cx) ** 2 + (b.p[2] - cz) ** 2))[0];
        const index = pieces.findIndex((p) => samePlace(p, slab));
        if (index < 0) continue;
        for (let i = pieces.length - 1; i >= 0; i--) {
          const q = pieces[i];
          if ((q.kind === "wall" || q.kind === "brace") && q.p[0] === slab.p[0] && q.p[2] === slab.p[2] && q.p[1] >= level - 4 && q.p[1] <= level) pieces.splice(i, 1);
        }
        const slabIndex = pieces.findIndex((p) => samePlace(p, slab));
        if (slabIndex < 0) continue;
        pieces.splice(slabIndex, 1, { ...slab, id: slab.id, kind: "stairwell", p: [...slab.p], rotation: slab.rotation, finish: slab.finish });
        const stairId = Math.max(0, ...pieces.map((p) => p.id)) + 1;
        pieces.push({ ...slab, id: stairId, kind: "stair", p: [slab.p[0], level - 4, slab.p[2]], rotation: slab.rotation, finish: slab.finish });
        next.push(slab);
        made++;
      }
      previous = next;
    }
  }
  for (const piece of pieces) {
    if (piece.kind !== "wall") continue;
    const floors = pieces.filter((p) => (p.kind === "slab" || p.kind === "stairwell" || p.kind === "foundation") && Math.abs(p.p[1] - piece.p[1]) < 0.01);
    if (!floors.length) continue;
    const corners = floors.flatMap((p) => [[0, 0, -2], [4, 0, -2], [0, 0, 2], [4, 0, 2]].map((v) => {
      const q = rotate(v, p.rotation);
      return [p.p[0] + q[0], p.p[2] + q[2]];
    }));
    const c = rotate([2, 0, 0], piece.rotation), x = piece.p[0] + c[0], z = piece.p[2] + c[2];
    if (x > Math.min(...corners.map((p) => p[0])) + 0.1 && x < Math.max(...corners.map((p) => p[0])) - 0.1 && z > Math.min(...corners.map((p) => p[1])) + 0.1 && z < Math.max(...corners.map((p) => p[1])) - 0.1) piece.kind = "doorway";
  }
  if (options.maxPieces !== void 0 && pieces.length > options.maxPieces) {
    const removable = /* @__PURE__ */ new Set(["facade", "brace", "girder", "truss", "wall"]);
    for (let i = pieces.length - 1; i >= 0 && pieces.length > options.maxPieces; i--) {
      if (removable.has(pieces[i].kind)) pieces.splice(i, 1);
    }
    for (let i = pieces.length - 1; i >= 0 && pieces.length > options.maxPieces; i--) {
      if (!["doorway", "stairwell", "stair"].includes(pieces[i].kind)) pieces.splice(i, 1);
    }
  }
  return pieces.map((p, i) => ({ ...p, id: i + 1 }));
}

// src/procedural-classic.ts
var clamp3 = (n, a, b) => Math.max(a, Math.min(b, n));
function randomFor(seed) {
  let state = (seed || 1) >>> 0;
  return () => {
    state = Math.imul(state, 1664525) + 1013904223 >>> 0;
    return state / 4294967296;
  };
}
function shuffled(values, random) {
  const copy = [...values];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}
function generateDemolitionBuilding(requested, seed = Date.now()) {
  const target = clamp3(Math.round(requested), 24, 1e3), random = randomFor(seed), styles = ["Kaskaden-Palast", "Kristall-Zitadelle", "Skygarden-Turm", "Terrassen-Megabau"], style = styles[Math.floor(random() * styles.length)];
  const palettes = [["ivory", "teal", "terracotta", "graphite"], ["sandstone", "teal", "ivory", "graphite"], ["graphite", "teal", "sandstone", "terracotta"], ["ivory", "sandstone", "teal", "terracotta"]], palette = palettes[Math.floor(random() * palettes.length)];
  const nx = target >= 850 ? 6 : target >= 650 ? 5 : target >= 400 ? 4 : target >= 190 ? 3 : 2, nz = target >= 850 ? 5 : target >= 650 ? 4 : target >= 330 ? 3 : target >= 90 ? 2 : 1, baseCells = nx * nz, fullPerFloor = (nx + 1) * (nz + 1) + baseCells;
  const floors = clamp3(Math.floor((target * 0.64 - baseCells) / fullPerFloor), 2, 12), xStart = -nx * 2, zStart = -nz * 2;
  const cellsByFloor = [];
  for (let floor = 0; floor < floors; floor++) {
    let left = 0, right = 0, front = 0, back = 0;
    const upper = floor - Math.floor(floors * 0.62);
    if (upper >= 0 && nx >= 3) {
      if (style === "Kaskaden-Palast" || style === "Terrassen-Megabau") left = Math.min(nx - 2, 1 + Math.floor(upper / 3));
      else right = Math.min(nx - 2, 1 + Math.floor(upper / 3));
    }
    if (upper >= 2 && nz >= 3) {
      if (style === "Kristall-Zitadelle") front = 1;
      else back = 1;
    }
    const cells2 = [];
    for (let ix = left; ix < nx - right; ix++) for (let iz = front; iz < nz - back; iz++) cells2.push({ x: ix, z: iz });
    cellsByFloor.push(cells2.length ? cells2 : [{ x: Math.floor(nx / 2), z: Math.floor(nz / 2) }]);
  }
  const mandatory = [], skin = [], interior = [], beams = [], crown = [], occupied = /* @__PURE__ */ new Set();
  const add2 = (list, kind, p, rotation = 0, finish) => {
    const key3 = `${kind}:${p.join(",")}:${rotation}`;
    if (occupied.has(key3)) return;
    occupied.add(key3);
    list.push({ id: 0, kind, p, rotation, ...finish ? { finish } : {} });
  };
  const slabFinish = palette[1], frameFinish = palette[0], accentFinish = palette[2];
  for (let ix = 0; ix < nx; ix++) for (let iz = 0; iz < nz; iz++) add2(mandatory, "foundation", [xStart + ix * 4, 0, zStart + iz * 4 + 2], 0, frameFinish);
  for (let floor = 0; floor < floors; floor++) {
    const y = floor * 4, cells2 = cellsByFloor[floor], vertices = /* @__PURE__ */ new Set();
    for (const cell of cells2) {
      const x = xStart + cell.x * 4, z = zStart + cell.z * 4;
      add2(mandatory, "slab", [x, y + 4, z + 2], 0, slabFinish);
      for (const dx of [0, 1]) for (const dz of [0, 1]) vertices.add(`${cell.x + dx}:${cell.z + dz}`);
    }
    for (const vertex of vertices) {
      const [ix, iz] = vertex.split(":").map(Number);
      add2(mandatory, "column", [xStart + ix * 4, y, zStart + iz * 4], 0, frameFinish);
    }
    const cellKeys = new Set(cells2.map((cell) => `${cell.x}:${cell.z}`));
    const parent = new Map(cells2.map((c) => [c.x + ":" + c.z, c.x + ":" + c.z]));
    const find = (key3) => {
      while (parent.get(key3) !== key3) key3 = parent.get(key3);
      return key3;
    };
    const shared = [];
    for (const c of cells2) {
      const a = c.x + ":" + c.z, x = xStart + c.x * 4, z = zStart + c.z * 4;
      if (cellKeys.has(c.x + 1 + ":" + c.z)) shared.push({ a, b: c.x + 1 + ":" + c.z, p: [x + 4, y, z], rotation: 3 });
      if (cellKeys.has(c.x + ":" + (c.z + 1))) shared.push({ a, b: c.x + ":" + (c.z + 1), p: [x, y, z + 4], rotation: 0 });
    }
    for (const edge of shuffled(shared, random)) {
      const a = find(edge.a), b = find(edge.b);
      if (a !== b) {
        parent.set(a, b);
        continue;
      }
      add2(interior, random() < 0.8 ? "wall" : "facade", edge.p, edge.rotation, frameFinish);
    }
    for (const cell of cells2) {
      const x = xStart + cell.x * 4, z = zStart + cell.z * 4, edges = [];
      if (!cellKeys.has(`${cell.x}:${cell.z - 1}`)) edges.push([x, z, 0]);
      if (!cellKeys.has(`${cell.x}:${cell.z + 1}`)) edges.push([x, z + 4, 0]);
      if (!cellKeys.has(`${cell.x - 1}:${cell.z}`)) edges.push([x, z, 3]);
      if (!cellKeys.has(`${cell.x + 1}:${cell.z}`)) edges.push([x + 4, z, 3]);
      for (const [ex, ez, rotation] of edges) {
        const roll = random(), kind = roll < 0.62 ? "facade" : roll < 0.78 ? "wall" : "brace", finish = kind === "facade" ? palette[(floor + cell.x + cell.z) % 3 + 1] : kind === "wall" ? accentFinish : palette[3];
        add2(skin, kind, [ex, y, ez], rotation, finish);
      }
      const top = y + 4;
      add2(beams, "girder", [x, top, z], 0, palette[3]);
      add2(beams, "girder", [x, top, z + 4], 0, palette[3]);
      add2(beams, "girder", [x, top, z], 3, palette[3]);
      add2(beams, "girder", [x + 4, top, z], 3, palette[3]);
    }
  }
  const roofCells = cellsByFloor.at(-1), roofY = floors * 4, roofKeys = new Set(roofCells.map((cell) => `${cell.x}:${cell.z}`));
  for (const cell of roofCells) {
    const x = xStart + cell.x * 4, z = zStart + cell.z * 4;
    if (!roofKeys.has(`${cell.x}:${cell.z - 1}`)) add2(crown, "truss", [x, roofY, z], 0, accentFinish);
    if (!roofKeys.has(`${cell.x}:${cell.z + 1}`)) add2(crown, "truss", [x, roofY, z + 4], 0, accentFinish);
    if (!roofKeys.has(`${cell.x - 1}:${cell.z}`)) add2(crown, "truss", [x, roofY, z], 3, accentFinish);
    if (!roofKeys.has(`${cell.x + 1}:${cell.z}`)) add2(crown, "truss", [x + 4, roofY, z], 3, accentFinish);
  }
  const partitions = shuffled(interior, random), reserved = partitions.splice(0, Math.min(partitions.length, Math.round(target * 0.08), Math.max(0, target - mandatory.length)));
  const optional = [...reserved, ...shuffled(skin, random), ...shuffled(beams, random), ...shuffled(crown, random), ...partitions], pieces = [...mandatory];
  for (const piece of optional) {
    if (pieces.length >= target) break;
    pieces.push(piece);
  }
  for (let level = 0; pieces.length < target; level++) for (const cell of roofCells) {
    if (pieces.length >= target) break;
    add2(pieces, "column", [xStart + cell.x * 4, roofY + level * 4, zStart + cell.z * 4], 0, accentFinish);
  }
  const accessible = withBuildingAccessibility(pieces, { maxStairs: Infinity, maxPieces: target });
  pieces.splice(0, pieces.length, ...accessible.slice(0, 1e3));
  pieces.forEach((piece, index) => piece.id = index + 1);
  const height = Math.max(...pieces.map((piece) => piece.p[1] + (piece.kind === "column" || piece.kind === "wall" || piece.kind === "facade" || piece.kind === "truss" || piece.kind === "brace" ? 4 : 0)));
  return { pieces: applyBuildingMaterials(pieces, "classic", seed), name: style, style, target, cost: pieces.reduce((sum, piece) => sum + PARTS[piece.kind].cost, 0), height, seed };
}

// src/procedural-buildings.ts
var BUILDING_STYLES = [
  { id: "art-deco", name: "Art d\xE9co", description: "Symmetrische Hochh\xE4user mit gestaffelten Schultern, hellen Pfeilern und goldener Krone. Fester Beton, mittlere Bewehrung." },
  { id: "refinery", name: "Raffinerie", description: "Offene Industriet\xFCrme, verkleidete Prozessbeh\xE4lter, Stahlstege und Leitungsbr\xFCcken. Robuster Beton, leichte Bewehrung." },
  { id: "triumph", name: "Triumphbogen", description: "Zwei massive Pfeiler, eine freie Durchfahrt und ein breiter, gestufter Monumentaufsatz. Sehr fester Beton mit wenig Bewehrung: spr\xF6de Br\xFCche." },
  { id: "brutalist", name: "Brutalismus", description: "Schwere Betonbl\xF6cke mit asymmetrischen R\xFCckspr\xFCngen und tiefen Fensterb\xE4ndern. Fester Beton mit starker Bewehrung." },
  { id: "pagoda", name: "Pagodenturm", description: "Gestaffelte, breite Dachebenen mit roten St\xFCtzen und einer schlanken Turmspitze. Normaler Beton mit leichter Bewehrung." },
  { id: "skybridge", name: "Skybridge-T\xFCrme", description: "Gl\xE4serne Zwillingst\xFCrme mit erh\xF6hten Verbindungsbr\xFCcken und freiem Raum darunter. Fester Beton mit besonders starker Bewehrung." },
  { id: "classic", name: "Klassisch", description: "Die bisherigen Terrassenh\xE4user und Hochh\xE4user mit zuf\xE4lligen Innenw\xE4nden. Ausgewogener Beton und Bewehrung." }
];
var key2 = (c) => `${c.x}:${c.z}`;
var rect = (w, d, x = 0, z = 0) => Array.from({ length: w * d }, (_, i) => ({ x: x + Math.floor(i / d), z: z + i % d }));
function rng(seed) {
  let s = seed >>> 0;
  return () => (s = Math.imul(s, 1664525) + 1013904223 >>> 0) / 4294967296;
}
function shuffle(a, r) {
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(r() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}
function layout(style, size, seed) {
  const random = rng(seed), rows = [], variation = random();
  if (style === "triumph" || style === "skybridge") {
    const pier = size < 6 ? 1 : size >= 12 && style === "skybridge" ? 3 : 2, depth = size < 4 ? 1 : style === "triumph" && size >= 15 ? 3 : style === "skybridge" && size >= 12 ? 3 : 2, gap = size < 4 ? 1 : size < 10 ? 2 : variation < 0.5 ? 2 : 3, w = 2 * pier + gap;
    const floors = 2 + Math.floor(size * (style === "triumph" ? 0.45 : 0.6)), bridge = style === "triumph" ? floors - 1 : Math.max(1, Math.floor(floors * (0.55 + variation * 0.2)));
    const piers = [...rect(pier, depth), ...rect(pier, depth, pier + gap)];
    for (let f = 0; f < floors; f++) rows.push(style === "triumph" && f >= bridge ? rect(w, depth) : style === "skybridge" && (f === bridge || size > 10 && f === bridge - 3) ? [...piers, ...rect(gap, 1, pier, Math.floor((depth - 1) / 2))] : piers);
  } else if (style === "refinery") {
    const w = size < 3 ? 1 : size < 7 ? 3 : 5, d = size < 5 ? 1 : 3, floors = 2 + Math.floor(size * 0.7), heights = /* @__PURE__ */ new Map();
    for (const c of rect(w, d)) heights.set(key2(c), c.x % 2 === 0 && c.z % 2 === 0 ? Math.max(2, floors - Math.floor(random() * 3)) : 1);
    for (let f = 0; f < floors; f++) rows.push(rect(w, d).filter((c) => heights.get(key2(c)) > f || f === Math.floor(floors / 2) && c.z === 0));
  } else {
    const w = size < 3 ? 1 : size < 7 ? 3 : style === "pagoda" && size >= 14 ? 7 : 5, d = style === "pagoda" ? w : size < 5 ? 1 : 3, floors = style === "pagoda" ? 2 + Math.floor(size * 0.6) : 2 + Math.floor(size * (style === "brutalist" ? 0.6 : style === "art-deco" ? 0.65 : 0.8));
    const alternate = random() < 0.5;
    for (let f = 0; f < floors; f++) {
      let cells2 = rect(w, d);
      if (style === "art-deco" || style === "pagoda") {
        const stage = style === "pagoda" ? Math.floor(f / (variation < 0.5 ? 3 : 4)) : f >= floors - 2 ? 2 : f >= Math.floor(floors * (0.45 + variation * 0.2)) ? 1 : 0;
        const ix = Math.min(Math.floor((w - 1) / 2), stage), iz = Math.min(Math.floor((d - 1) / 2), style === "pagoda" ? stage : Math.max(0, stage - 1));
        cells2 = rect(w - ix * 2, d - iz * 2, ix, iz);
      } else if (style === "brutalist" && w > 1) {
        const inset = f >= Math.floor(floors * 0.55) ? 1 : 0;
        cells2 = rect(w - inset, d, alternate ? inset : 0);
        if (d > 1 && f >= floors - 2) cells2 = cells2.filter((c) => c.z < (alternate ? 2 : 1));
      }
      rows.push(cells2);
    }
  }
  return rows.filter((c) => c.length);
}
function assemble(style, rows, seed, budget) {
  const random = rng(seed), base2 = [], signature = [], skin = [], interior = [], details = [], seen = /* @__PURE__ */ new Set();
  const warm = random() < 0.5;
  const frame = style === "pagoda" ? "terracotta" : style === "refinery" ? "graphite" : style === "brutalist" ? "graphite" : warm ? "ivory" : "sandstone";
  const surface = style === "pagoda" ? "graphite" : style === "triumph" ? "sandstone" : style === "refinery" ? "graphite" : style === "brutalist" ? "ivory" : "teal";
  const accent = style === "pagoda" ? "sandstone" : style === "refinery" ? "terracotta" : "sandstone";
  const add2 = (list, kind, p, rotation = 0, finish = frame) => {
    const k = `${kind}:${p.join(",")}:${rotation}`;
    if (seen.has(k)) return;
    seen.add(k);
    list.push({ id: 0, kind, p, rotation, finish });
  };
  const floorKind = style === "refinery" ? "deck" : "slab";
  const coreCells = [];
  if (rows.length >= 10 && ["art-deco", "brutalist", "skybridge"].includes(style)) {
    const permanent = rows[0].filter((c) => rows.every((row) => row.some((cell) => key2(cell) === key2(c))));
    if (style === "skybridge") {
      const middle = (Math.min(...permanent.map((c) => c.x)) + Math.max(...permanent.map((c) => c.x))) / 2;
      for (const group of [permanent.filter((c) => c.x < middle), permanent.filter((c) => c.x > middle)]) if (group.length) coreCells.push(group[Math.floor(group.length / 2)]);
    } else if (permanent.length) coreCells.push(permanent[Math.floor(permanent.length / 2)]);
  }
  const podiumCores = [];
  let podiumFloors = 0;
  if (style === "art-deco" && budget > 750 && coreCells.length) {
    const footprint = rows[0], xs = footprint.map((c) => c.x), minX = Math.min(...xs), maxX = Math.max(...xs);
    const centreZ = coreCells[0].z;
    if (maxX - minX >= 2) {
      for (const x of [minX, maxX]) {
        const cell = footprint.find((c) => c.x === x && c.z === centreZ);
        if (cell && !coreCells.some((core) => key2(core) === key2(cell))) podiumCores.push(cell);
      }
      podiumFloors = rows.findIndex((row) => row.length !== footprint.length || !footprint.every((c) => row.some((q) => key2(q) === key2(c))));
      if (podiumFloors < 0) podiumFloors = rows.length;
    }
  }
  for (const c of rows[0]) add2(base2, "foundation", [c.x * 4, 0, c.z * 4 + 2], 0, frame);
  rows.forEach((cells2, f) => {
    const keys = new Set(cells2.map(key2)), previous = new Set((rows[f - 1] ?? []).map(key2)), previousVertices = new Set((rows[f - 1] ?? []).flatMap((c) => [key2(c), key2({ x: c.x + 1, z: c.z }), key2({ x: c.x, z: c.z + 1 }), key2({ x: c.x + 1, z: c.z + 1 })])), y2 = f * 4;
    if (f) {
      for (const c of cells2) if (!previous.has(key2(c)) && ![key2(c), key2({ x: c.x + 1, z: c.z }), key2({ x: c.x, z: c.z + 1 }), key2({ x: c.x + 1, z: c.z + 1 })].every((k) => previousVertices.has(k))) {
        add2(base2, floorKind, [c.x * 4, y2, c.z * 4 + 2], 0, surface);
        for (const z of [c.z * 4, c.z * 4 + 4]) add2(base2, "truss", [c.x * 4, y2, z], 0, accent);
      }
    }
    const vertices = new Set(cells2.flatMap((c) => [key2(c), key2({ x: c.x + 1, z: c.z }), key2({ x: c.x, z: c.z + 1 }), key2({ x: c.x + 1, z: c.z + 1 })]));
    for (const v of vertices) {
      const [x, z] = v.split(":").map(Number);
      add2(base2, "column", [x * 4, y2, z * 4], 0, frame);
    }
    for (const c of cells2) add2(base2, floorKind, [c.x * 4, y2 + 4, c.z * 4 + 2], 0, surface);
    for (const core of coreCells) add2(base2, "core", [core.x * 4, y2, core.z * 4], 0, frame);
    if (f < podiumFloors) for (const core of podiumCores) add2(base2, "core", [core.x * 4, y2, core.z * 4], 0, frame);
    for (const c of cells2) {
      const x = c.x * 4, z = c.z * 4, edges = [];
      if (!keys.has(key2({ x: c.x, z: c.z - 1 }))) edges.push([x, z, 0]);
      if (!keys.has(key2({ x: c.x, z: c.z + 1 }))) edges.push([x, z + 4, 0]);
      if (!keys.has(key2({ x: c.x - 1, z: c.z }))) edges.push([x, z, 3]);
      if (!keys.has(key2({ x: c.x + 1, z: c.z }))) edges.push([x + 4, z, 3]);
      for (const [ex, ez, rot] of edges) {
        const roll = random();
        let kind = style === "refinery" ? "truss" : style === "triumph" ? "wall" : style === "brutalist" ? roll < 0.78 ? "wall" : "facade" : style === "pagoda" ? roll < 0.3 ? "wall" : "truss" : "facade";
        if (style === "refinery" && f < 2 && (c.x + c.z) % 4 === 0) kind = "wall";
        add2(skin, kind, [ex, y2, ez], rot, kind === "wall" ? style === "triumph" ? frame : style === "refinery" ? "ivory" : surface : frame);
        const next = rows[f + 1] ?? [], setback = !next.some((n) => key2(n) === key2(c));
        if (style === "pagoda" && (f % 3 === 2 || setback)) add2(signature, "truss", [ex, y2 + 4, ez], rot, accent);
        if (style === "art-deco" && setback) add2(signature, "girder", [ex, y2 + 4, ez], rot, accent);
        add2(details, "girder", [ex, y2 + 4, ez], rot, accent);
      }
      for (const [ex, ez, rot] of [[x, z, 0], [x, z + 4, 0], [x, z, 3], [x + 4, z, 3]]) add2(details, "girder", [ex, y2 + 4, ez], rot, accent);
    }
    if (["art-deco", "brutalist", "skybridge"].includes(style)) {
      const parent = new Map(cells2.map((c) => [key2(c), key2(c)]));
      const find = (k) => {
        while (parent.get(k) !== k) k = parent.get(k);
        return k;
      };
      const edges = [];
      for (const c of cells2) {
        if (keys.has(key2({ x: c.x + 1, z: c.z }))) edges.push({ a: key2(c), b: key2({ x: c.x + 1, z: c.z }), p: [c.x * 4 + 4, y2, c.z * 4], r: 3 });
        if (keys.has(key2({ x: c.x, z: c.z + 1 }))) edges.push({ a: key2(c), b: key2({ x: c.x, z: c.z + 1 }), p: [c.x * 4, y2, c.z * 4 + 4], r: 0 });
      }
      for (const edge of shuffle(edges, random)) {
        const a = find(edge.a), b = find(edge.b);
        if (a !== b) {
          parent.set(a, b);
          continue;
        }
        add2(interior, random() < 0.8 ? "wall" : "facade", edge.p, edge.r, frame);
      }
    }
  });
  const roof = rows.at(-1), y = rows.length * 4;
  if (style === "triumph") {
    const below = rows[rows.length - 2], xs = [...new Set(below.map((c) => c.x))].sort((a, b) => a - b), left = xs.find((x, i) => i < xs.length - 1 && xs[i + 1] > x + 1);
    if (left !== void 0) {
      const right = xs.find((x) => x > left + 1), front = Math.min(...below.map((c) => c.z)) * 4, back = (Math.max(...below.map((c) => c.z)) + 1) * 4;
      for (const z of [front, back]) {
        add2(signature, "brace", [(left + 1) * 4, y - 8, z], 0, accent);
        add2(signature, "brace", [right * 4, y - 8, z], 2, accent);
      }
      for (let x = left + 1; x < right; x++) {
        for (const z of [front, back]) add2(signature, "wall", [x * 4, y, z], 0, accent);
        for (let z = front; z < back; z += 4) add2(signature, "slab", [x * 4, y + 4, z + 2], 0, accent);
      }
    }
  }
  if (style === "art-deco" || style === "pagoda") {
    const c = roof[Math.floor(roof.length / 2)];
    for (const z of [c.z * 4, c.z * 4 + 4]) add2(signature, "truss", [c.x * 4, y, z], 0, accent);
    add2(signature, "column", [c.x * 4, y, c.z * 4], 0, accent);
  }
  if (style === "triumph" && budget >= 100) {
    base2.push(...signature.splice(0), ...skin.splice(0));
  }
  const partitions = shuffle(interior, random), reserved = partitions.splice(0, Math.round(base2.length * 0.125));
  return { base: base2, optional: [...signature, ...reserved, ...shuffle(skin, random), ...shuffle(details, random), ...partitions] };
}
function generateDemolitionBuilding2(requested, seed = Date.now(), requestedStyle = "random") {
  const target = Math.max(24, Math.min(1e3, Math.round(Number.isFinite(requested) ? requested : 500)));
  const ids = BUILDING_STYLES.map((s) => s.id), random = rng(seed), style = ids.includes(requestedStyle) ? requestedStyle : ids[Math.floor(random() * 6)];
  if (style === "classic") return { ...generateDemolitionBuilding(target, seed), style };
  let selected, score = Infinity;
  for (let size = 0; size <= 20; size++) {
    const built = assemble(style, layout(style, size, seed), seed, target);
    if (built.base.length > target) continue;
    const total = built.base.length + built.optional.length, shortfall = Math.max(0, target - total) / target, cost = shortfall * 4 + Math.abs(built.base.length / target - 0.64);
    if (cost < score) {
      score = cost;
      selected = built;
    }
  }
  if (!selected) throw new Error("No complete structural layout fits this budget");
  const pieces = withBuildingAccessibility([...selected.base, ...selected.optional.slice(0, Math.max(0, target - selected.base.length))], { maxStairs: Infinity, maxPieces: target });
  const xs = pieces.map((p) => p.p[0]), zs = pieces.map((p) => p.p[2]), dx = (Math.min(...xs) + Math.max(...xs)) / 2, dz = (Math.min(...zs) + Math.max(...zs)) / 2;
  pieces.forEach((p, i) => {
    p.id = i + 1;
    p.p = [p.p[0] - dx, p.p[1], p.p[2] - dz];
  });
  const height = Math.max(...pieces.map((p) => p.p[1] + (["column", "wall", "facade", "truss", "brace"].includes(p.kind) ? 4 : 0)));
  return { pieces: applyBuildingMaterials(pieces, style, seed), name: BUILDING_STYLES.find((s) => s.id === style).name, style, target, cost: pieces.reduce((n, p) => n + PARTS[p.kind].cost, 0), height, seed };
}

// src/benchmark/suite.ts
var DEFAULT_SEED = 20903;
var SECONDS = 20;
function scenario(spec) {
  const seed = Number.isSafeInteger(spec.seed) ? spec.seed >>> 0 : DEFAULT_SEED;
  let pieces;
  if (spec.preset === "current") {
    if (!spec.pieces?.length || spec.pieces.length > 2500) throw Error("F\xFCr eigene Baupl\xE4ne sind 1\u20132500 Bauteile erlaubt.");
    pieces = structuredClone(spec.pieces);
  } else {
    if (!["art-deco", "brutalist", "quiet"].includes(spec.preset)) throw Error("Unbekanntes Benchmark-Szenario.");
    pieces = generateDemolitionBuilding2(1e3, seed, spec.preset === "quiet" ? "art-deco" : spec.preset).pieces;
  }
  const dt = pieces.length >= 400 ? 1 / 60 : 1 / 120;
  const limit = spec.fragmentLimit ?? 1e3;
  if (!Number.isSafeInteger(limit) || limit < 24 || limit > 3e3) throw Error("Ung\xFCltige Tr\xFCmmergrenze.");
  return { pieces, seed, dt, ticks: Math.round(SECONDS / dt), fragmentLimit: limit, preset: spec.preset };
}
function shotPlan(pieces, dt) {
  const xs = pieces.map((p) => p.p[0]), ys = pieces.map((p) => p.p[1]), zs = pieces.map((p) => p.p[2]);
  const a = Math.min(...xs), b = Math.max(...xs), c = Math.min(...zs), d = Math.max(...zs), cx = (a + b) / 2, cz = (c + d) / 2, h = Math.max(...ys);
  return [
    { time: 1, position: [a - 20, 5, cz], velocity: [70, 0, 0] },
    { time: 3, position: [b + 20, 5, cz], velocity: [-70, 0, 0] },
    { time: 5, position: [cx, 5, c - 20], velocity: [0, 0, 70] },
    { time: 7, position: [cx, 5, d + 20], velocity: [0, 0, -70] },
    { time: 10, position: [cx, h + 20, cz], velocity: [0, -80, 0] }
  ].map((s) => ({ tick: Math.round(s.time / dt), position: s.position, velocity: s.velocity, mass: 5e5, radius: 5 }));
}
var float = new Float32Array(1);
var word = new Uint32Array(float.buffer);
export {
  Simulation,
  loadOwnPhysics as init,
  scenario,
  shotPlan
};
