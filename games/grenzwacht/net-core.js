import * as E from "./engine.js?v=5";
export const PROTOCOL = "grenzwacht-1";
export function cleanCommand(c) {
  if (!c || typeof c !== "object") return null;
  if (
    c.type === "build" &&
    typeof c.slot === "string" &&
    c.slot.length < 30 &&
    typeof c.building === "string" &&
    Object.hasOwn(E.TYPES, c.building)
  )
    return { type: "build", slot: c.slot, building: c.building };
  if (
    c.type === "research" &&
    typeof c.research === "string" &&
    Object.hasOwn(E.RESEARCH, c.research)
  )
    return { type: "research", research: c.research };
  if (["upgrade", "sell"].includes(c.type) && Number.isSafeInteger(c.id))
    return { type: c.type, id: c.id };
  return null;
}
export function checksum(state) {
  const text = JSON.stringify(state);
  let hash = 2166136261;
  for (let i = 0; i < text.length; i++)
    hash = Math.imul(hash ^ text.charCodeAt(i), 16777619);
  return hash >>> 0;
}
// The sender chooses a command, never their faction or the simulation tick.
export class HostSimulation {
  constructor(options) {
    this.state = E.createGame(options);
    this.queue = [];
    this.history = [];
    this.receipts = new Map();
  }
  enqueue(side, id, command) {
    const key = side + ":" + id;
    if (this.receipts.has(key)) return this.receipts.get(key);
    if (this.queue.some((x) => x.key === key)) return null;
    const c = cleanCommand(command);
    if (
      ![0, 1].includes(side) ||
      typeof id !== "string" ||
      id.length > 80 ||
      !c ||
      this.queue.length >= 32
    )
      return { ok: false, error: "Ungültige oder zu viele Aktionen." };
    this.queue.push({ side, id, key, command: c });
    return null;
  }
  advance() {
    if (this.state.winner !== null) return [];
    const commands = [],
      receipts = [];
    for (const item of this.queue.splice(0)) {
      const result = E.command(this.state, item.side, item.command);
      this.receipts.set(item.key, result);
      receipts.push({ ...item, result });
      if (result.ok) commands.push({ side: item.side, command: item.command });
    }
    while (this.receipts.size > 512)
      this.receipts.delete(this.receipts.keys().next().value);
    E.step(this.state, { aiEnabled: false });
    this.history.push({
      tick: this.state.tick,
      commands,
      ...(this.state.tick % 20 === 0 ? { checksum: checksum(this.state) } : {}),
    });
    if (this.history.length > 200) this.history.shift();
    return receipts;
  }
  frames(after) {
    return this.history.filter((f) => f.tick > after);
  }
}
export class GuestSimulation {
  constructor() {
    this.state = null;
    this.frames = new Map();
  }
  snapshot(state) {
    this.state = structuredClone(state);
    this.frames.clear();
  }
  receive(frames) {
    if (!this.state || !Array.isArray(frames) || frames.length > 200) return;
    for (const f of frames)
      if (
        Number.isSafeInteger(f.tick) &&
        f.tick > this.state.tick &&
        f.tick <= this.state.tick + 240 &&
        Array.isArray(f.commands) &&
        f.commands.length <= 32
      )
        this.frames.set(f.tick, f);
  }
  advance() {
    if (!this.state || this.state.winner !== null) return false;
    const f = this.frames.get(this.state.tick + 1);
    if (!f) return false;
    for (const item of f.commands) {
      const c = cleanCommand(item.command);
      if (
        !c ||
        ![0, 1].includes(item.side) ||
        !E.command(this.state, item.side, c).ok
      )
        throw new Error("Spielstand muss abgeglichen werden.");
    }
    this.frames.delete(f.tick);
    E.step(this.state, { aiEnabled: false });
    if (f.checksum !== undefined && f.checksum !== checksum(this.state))
      throw new Error("Spielstand muss abgeglichen werden.");
    return true;
  }
}
