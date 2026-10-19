import { describe, it, expect, vi } from "vitest";
import { Directory, validListing, TABLE_TTL, type Listing } from "./directory";
const table: Listing = {
  room: "a".repeat(32),
  host: "owner1234567890",
  title: "Feierabend",
  locked: true,
  humans: 1,
  bots: 5,
  phase: "Bereit",
};
describe("Öffentliches Tischverzeichnis", () => {
  it("validiert Metadaten und Kapazitäten", () => {
    expect(validListing(table, table.host)).toBe(true);
    expect(validListing({ ...table, humans: 7 }, table.host)).toBe(false);
    expect(validListing({ ...table, room: "../falsch" }, table.host)).toBe(
      false,
    );
    expect(validListing(table, "anderer")).toBe(false);
    expect(validListing({ ...table, title: "x".repeat(41) }, table.host)).toBe(
      false,
    );
  });
  it("zeigt Meldungen, aktualisiert sie und entfernt nur Meldungen desselben Hosts", () => {
    const d = Object.create(Directory.prototype) as Directory;
    d.tables = new Map();
    d.changed = vi.fn();
    d.closed = false;
    d.provider = null;
    d.receive({ kind: "table", table }, table.host);
    expect(d.listings()).toEqual([table]);
    d.receive(
      { kind: "table", table: { ...table, humans: 2, bots: 4 } },
      table.host,
    );
    expect(d.listings()[0].humans).toBe(2);
    d.receive({ kind: "withdraw", room: table.room }, "fremd");
    expect(d.listings()).toHaveLength(1);
    d.receive({ kind: "withdraw", room: table.room }, table.host);
    expect(d.listings()).toHaveLength(0);
  });
  it("entfernt abgelaufene Tische ohne weitere Netzwerknachricht", () => {
    const d = Object.create(Directory.prototype) as Directory;
    d.tables = new Map([
      [table.room, { listing: table, seen: Date.now() - TABLE_TTL - 1 }],
    ]);
    d.changed = vi.fn();
    d.provider = null;
    d.tick();
    expect(d.listings()).toHaveLength(0);
    expect(d.changed).toHaveBeenCalledOnce();
  });
});
