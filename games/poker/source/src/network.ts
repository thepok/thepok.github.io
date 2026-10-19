import { joinRoom, selfId } from "trystero";
import {
  initial,
  transition,
  playing,
  type State,
  type Command,
} from "./engine";
import { botAction } from "./bots";
import { Relay } from "./relay";
export { selfId };
export class Table {
  state: State | null = null;
  status = "Suche Spielleiter …";
  error = "";
  peers = new Set<string>();
  direct = new Set<string>();
  lastSeen = new Map<string, number>();
  leftAt = new Map<string, number>();
  departed = new Set<string>();
  host: string;
  room;
  wire;
  relay: Relay;
  timer: ReturnType<typeof setInterval>;
  botTimer: ReturnType<typeof setTimeout> | undefined;
  closed = false;
  lastBot = -1;
  began = Date.now();
  lastHeartbeat = 0;
  constructor(
    public roomId: string,
    public name: string,
    public creator: boolean,
    public update: () => void,
    host: string,
  ) {
    this.host = creator ? selfId : host;
    if (creator) this.state = initial(selfId, name);
    this.room = joinRoom({ appId: "thepok.github.io.poker.v1" }, roomId, {
      onJoinError: ({ peerId }) => {
        if (!creator && peerId === this.host && !this.state) {
          this.status =
            "Direkte Verbindung gescheitert · versuche verschlüsselten Relay-Fallback …";
          this.pulse();
          this.update();
        }
      },
    });
    this.wire = this.room.makeAction<any>("poker");
    this.wire.onMessage = (m, { peerId }) => this.receive(m, peerId, false);
    this.relay = new Relay(
      roomId,
      selfId,
      (m, from) => this.receive(m, from, true),
      () => {
        if (!this.closed) {
          this.pulse();
          this.describe();
          this.update();
        }
      },
    );
    this.room.onPeerJoin = (peer) => {
      this.direct.add(peer);
      this.touch(peer);
      if (peer === this.host && !creator)
        void this.send({ kind: "hello", name }, peer);
      if (creator) this.sendState(peer);
      this.describe();
      this.update();
    };
    this.room.onPeerLeave = (peer) => {
      this.direct.delete(peer);
      if (Date.now() - (this.lastSeen.get(peer) || 0) > 18000)
        this.offline(peer);
      this.describe();
      this.update();
    };
    this.timer = setInterval(() => this.tick(), 500);
    this.describe();
    this.update();
  }
  touch(peer: string) {
    this.peers.add(peer);
    this.leftAt.delete(peer);
  }
  offline(peer: string) {
    if (this.peers.delete(peer)) this.leftAt.set(peer, Date.now());
  }
  describe() {
    if (!this.creator && !this.peers.has(this.host)) {
      this.status = this.state
        ? "Spielleiter getrennt · Spiel pausiert. Auf Rückkehr warten oder neuen Raum erstellen."
        : this.relay?.ready.size
          ? "Relay erreichbar · suche Spielleiter …"
          : "Verbinde mit öffentlichen Relays …";
      return;
    }
    const fallback = [...this.peers].some((p) => !this.direct.has(p));
    this.status = fallback
      ? this.direct.size
        ? "P2P + Relay · verschlüsselt"
        : "Relay-Verbindung · verschlüsselt"
      : this.direct.size
        ? "P2P verbunden"
        : "Solo bereit · warte auf Freunde";
  }
  receive(m: any, peer: string, viaRelay: boolean) {
    if (this.closed || !m || typeof m.kind !== "string") return;
    if (this.departed.has(peer)) return;
    if (viaRelay) this.lastSeen.set(peer, Date.now());
    this.touch(peer);
    if (m.kind === "bye") {
      this.departed.add(peer);
      this.direct.delete(peer);
      this.lastSeen.delete(peer);
      this.offline(peer);
      if (
        this.creator &&
        (this.state?.players.some((p) => p?.id === peer) ||
          this.state?.pending.some((c) => c.type === "join" && c.id === peer))
      )
        this.command({ type: "leave", id: peer }, "system");
      this.describe();
      this.update();
      return;
    }
    if (m.kind === "state" && peer === this.host && m.state) {
      if (!this.state || m.state.version > this.state.version)
        this.state = m.state;
      if (
        this.state?.players.some((p) => p?.id === selfId) ||
        this.state?.pending.some((c) => c.type === "join" && c.id === selfId)
      )
        this.error = "";
    }
    if (m.kind === "hello" && this.creator) {
      this.command(
        { type: "join", id: peer, name: String(m.name || "Gast") },
        peer,
      );
      this.sendState(peer);
    }
    if (m.kind === "sync" && this.creator) this.sendState(peer);
    if (m.kind === "command" && this.creator) this.command(m.command, peer);
    if (m.kind === "error" && peer === this.host) this.error = String(m.text);
    if (m.kind === "heartbeat" && peer === this.host && !this.creator) {
      if (!this.state) void this.send({ kind: "hello", name: this.name }, peer);
      else if (m.version > this.state.version)
        void this.send({ kind: "sync" }, peer);
    }
    this.describe();
    this.update();
  }
  async send(m: any, target: string) {
    if (this.direct.has(target)) {
      try {
        await this.wire.send(m, { target });
        return;
      } catch {
        /* Use encrypted relay if the data channel just closed. */
      }
    }
    const sent = await this.relay.send(m, target);
    if (!sent && m.kind === "command") {
      this.error =
        "Keine Verbindung zum Spielleiter. Aktion wurde nicht gesendet; bitte erneut versuchen.";
      this.update();
    }
  }
  sendState(target?: string) {
    if (target) void this.send({ kind: "state", state: this.state }, target);
    else
      for (const peer of this.peers)
        void this.send({ kind: "state", state: this.state }, peer);
  }
  pulse() {
    if (this.closed || !this.relay?.ready.size) return;
    void this.relay.send({
      kind: "heartbeat",
      version: this.creator ? this.state?.version : undefined,
    });
    if (
      !this.creator &&
      Date.now() - this.began > 5000 &&
      (!this.state || !this.state.players.some((p) => p?.id === selfId))
    )
      void this.relay.send({ kind: "hello", name: this.name }, this.host);
  }
  tick() {
    if (this.closed) return;
    const now = Date.now();
    if (this.creator && this.state)
      for (const [peer, left] of this.leftAt) {
        if (
          now - left > 90000 &&
          this.state.players.some((p) => p?.id === peer) &&
          !this.state.pending.some((c) => c.type === "leave" && c.id === peer)
        )
          this.command({ type: "leave", id: peer }, "system");
      }
    for (const peer of this.peers)
      if (
        !this.direct.has(peer) &&
        now - (this.lastSeen.get(peer) || 0) > 18000
      )
        this.offline(peer);
    if (now - this.lastHeartbeat > 4000) {
      this.lastHeartbeat = now;
      this.pulse();
    }
    this.describe();
    if (!this.creator && !this.peers.has(this.host) && now - this.began > 30000)
      this.error = this.relay.ready.size
        ? "Der Spielleiter antwortet nicht. Laptop-Tisch geöffnet lassen und auf beiden Geräten die aktuelle Seite laden."
        : "Keine Relay-Verbindung. Prüfe Internetzugang und öffne den Link in Chrome oder Firefox statt im eingebauten Messenger-Browser.";
    if (this.creator && this.state) {
      const p = this.state.players[this.state.turn];
      if (
        playing(this.state) &&
        p &&
        (p.bot ||
          (this.leftAt.has(p.id) && now - this.leftAt.get(p.id)! > 20000)) &&
        this.lastBot !== this.state.version
      ) {
        const version = this.state.version;
        this.lastBot = version;
        this.botTimer = setTimeout(
          () => {
            if (
              !this.closed &&
              this.state?.version === version &&
              (p.bot || !this.peers.has(p.id))
            )
              this.command(
                p.bot
                  ? botAction(this.state)
                  : { type: "act", id: p.id, version, action: "fold" },
                "system",
              );
            else if (this.state?.version === version) this.lastBot = -1;
          },
          700 + Math.random() * 600,
        );
      }
    }
    this.update();
  }
  command(c: Command, source = selfId) {
    if (c.type === "next" && c.version === undefined)
      c = { ...c, version: this.state?.version };
    if (!this.creator) {
      if (this.peers.has(this.host))
        void this.send({ kind: "command", command: c }, this.host);
      else this.error = "Spielleiter nicht verbunden.";
      this.update();
      return;
    }
    try {
      if (!this.state) return;
      if (source !== "system") {
        if (c.type === "act" || c.type === "rebuy" || c.type === "leave")
          c = { ...c, id: source };
        if (
          c.type !== "join" &&
          !this.state.players.some((p) => p?.id === source)
        )
          throw Error("Du wartest noch auf deinen Sitzplatz.");
      }
      this.state = transition(this.state, c);
      this.error = "";
      this.sendState();
    } catch (e) {
      const text = (e as Error).message;
      if (source === selfId || source === "system") this.error = text;
      else void this.send({ kind: "error", text }, source);
    }
    this.update();
  }
  async close() {
    this.closed = true;
    clearInterval(this.timer);
    clearTimeout(this.botTimer);
    await Promise.allSettled([
      this.wire.send({ kind: "bye" }),
      this.relay.send({ kind: "bye" }),
    ]);
    this.relay.close();
    await this.room.leave();
  }
}
