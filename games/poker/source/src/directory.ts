import { Relay } from "./relay";
export type Listing = {
  room: string;
  host: string;
  title: string;
  locked: boolean;
  humans: number;
  bots: number;
  phase: string;
};
export const TABLE_TTL = 35000;
export function validListing(value: any, from: string): value is Listing {
  return (
    !!value &&
    typeof value.room === "string" &&
    /^[a-f0-9]{32}$/.test(value.room) &&
    value.host === from &&
    typeof value.host === "string" &&
    /^[a-zA-Z0-9_-]{10,64}$/.test(value.host) &&
    typeof value.title === "string" &&
    value.title.trim().length > 0 &&
    value.title.length <= 40 &&
    typeof value.locked === "boolean" &&
    Number.isInteger(value.humans) &&
    value.humans >= 1 &&
    value.humans <= 6 &&
    Number.isInteger(value.bots) &&
    value.bots >= 0 &&
    value.humans + value.bots <= 6 &&
    typeof value.phase === "string" &&
    value.phase.length < 30
  );
}
export class Directory {
  relay: Relay;
  tables = new Map<string, { listing: Listing; seen: number }>();
  timer: ReturnType<typeof setInterval>;
  lastAnnouncement = 0;
  closed = false;
  provider: (() => Listing) | null = null;
  constructor(
    public self: string,
    public changed: () => void,
  ) {
    this.relay = new Relay(
      "public-directory-v1",
      self,
      (m, from) => this.receive(m, from),
      () => {
        if (!this.closed) {
          void this.relay.send({ kind: "list" });
          this.announce();
          this.changed();
        }
      },
      { publicChannel: true },
    );
    this.timer = setInterval(() => this.tick(), 1000);
  }
  get status() {
    return this.relay.ready.size
      ? "Tischliste verbunden"
      : "Verbinde mit Tischverzeichnis …";
  }
  listings() {
    return [...this.tables.values()]
      .map((t) => t.listing)
      .sort((a, b) => a.title.localeCompare(b.title, "de"));
  }
  receive(message: any, from: string) {
    if (this.closed || !message) return;
    if (message.kind === "list") {
      this.announce();
      return;
    }
    if (message.kind === "withdraw") {
      const entry = this.tables.get(message.room);
      if (entry?.listing.host === from) {
        this.tables.delete(message.room);
        this.changed();
      }
      return;
    }
    if (message.kind === "table" && validListing(message.table, from)) {
      this.tables.set(message.table.room, {
        listing: message.table,
        seen: Date.now(),
      });
      if (this.tables.size > 200)
        this.tables.delete(this.tables.keys().next().value!);
      this.changed();
    }
  }
  advertise(provider: () => Listing) {
    this.provider = provider;
    this.announce();
  }
  announce() {
    if (!this.provider || this.closed) return;
    const listing = this.provider();
    this.tables.set(listing.room, { listing, seen: Date.now() });
    void this.relay.send({ kind: "table", table: listing });
    this.lastAnnouncement = Date.now();
    this.changed();
  }
  async withdraw() {
    const listing = this.provider?.();
    this.provider = null;
    if (listing) {
      this.tables.delete(listing.room);
      await this.relay.send({ kind: "withdraw", room: listing.room });
      this.changed();
    }
  }
  tick() {
    let changed = false;
    for (const [key, value] of this.tables)
      if (Date.now() - value.seen > TABLE_TTL) {
        this.tables.delete(key);
        changed = true;
      }
    if (this.provider && Date.now() - this.lastAnnouncement > 8000)
      this.announce();
    if (changed) this.changed();
  }
  async close() {
    this.closed = true;
    clearInterval(this.timer);
    const listing = this.provider?.();
    if (listing)
      await this.relay.send({ kind: "withdraw", room: listing.room });
    this.relay.close();
  }
}
