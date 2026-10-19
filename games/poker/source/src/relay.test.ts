import { describe, it, expect, vi } from "vitest";
import { roomCrypto, Relay } from "./relay";
describe("Verschlüsselter Relay-Transport", () => {
  it("schützt geschützte Räume auch im Relay-Fallback mit dem Tischpasswort", async () => {
    const host = await roomCrypto("public-room", "richtig"),
      right = await roomCrypto("public-room", "richtig"),
      wrong = await roomCrypto("public-room", "falsch"),
      open = await roomCrypto("public-room");
    const message = await host.seal({ cards: [12, 25] });
    expect(await right.open(message)).toEqual({ cards: [12, 25] });
    await expect(wrong.open(message)).rejects.toThrow();
    await expect(open.open(message)).rejects.toThrow();
    expect(host.topic).toBe(wrong.topic);
  });
  it("verschlüsselt Nachrichten und trennt Räume kryptografisch", async () => {
    const a = await roomCrypto("room-a"),
      b = await roomCrypto("room-b");
    const data = { cards: [12, 25], name: "Privat" };
    const packet = await a.seal(data);
    expect(packet).not.toContain("Privat");
    expect(await a.open(packet)).toEqual(data);
    await expect(b.open(packet)).rejects.toThrow();
    expect(a.topic).not.toEqual(b.topic);
    expect(a.topic).not.toContain("room-a");
    expect(await a.seal(data)).not.toEqual(packet);
  });
  it("weist veränderte Nachrichten zurück", async () => {
    const c = await roomCrypto("room-a");
    const p = JSON.parse(await c.seal({ secret: true }));
    p.data = (p.data[0] === "A" ? "B" : "A") + p.data.slice(1);
    await expect(c.open(JSON.stringify(p))).rejects.toThrow();
  });
  it("entfernt Duplikate und Nachrichten an andere Empfänger", async () => {
    const receive = vi.fn(),
      r = Object.create(Relay.prototype) as Relay;
    r.closed = false;
    r.self = "me";
    r.seen = new Set();
    r.receive = receive;
    r.codec = await roomCrypto("room-a");
    const message = {
      id: "unique",
      from: "other",
      to: "me",
      body: { kind: "command" },
    };
    const data = await r.codec.seal(message);
    await Promise.all([r.onMessage(data), r.onMessage(data)]);
    expect(receive).toHaveBeenCalledTimes(1);
    await r.onMessage(
      await r.codec.seal({ ...message, id: "elsewhere", to: "third" }),
    );
    expect(receive).toHaveBeenCalledTimes(1);
    await r.onMessage("kaputt");
    expect(receive).toHaveBeenCalledTimes(1);
  });
});
