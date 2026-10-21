import { joinRoom, selfId, Relay, Directory } from "./vendor/transport.js";
import {
  HostSimulation,
  GuestSimulation,
  PROTOCOL,
  cleanCommand,
} from "./net-core.js?v=8";
export { Directory, selfId };
export class Duel {
  constructor({
    room,
    host,
    password = "",
    options = {},
    changed = () => {},
    result = () => {},
    forceRelay = false,
  }) {
    this.roomId = room;
    this.host = host || selfId;
    this.creator = !host;
    this.side = this.creator ? 0 : 1;
    this.options = options;
    this.lobby = this.creator
      ? {
          revision: 0,
          factions: [...this.stateFactions(options)],
          handicaps: [options.handicap || 100, options.enemyHandicap || 100],
          laneCount: options.laneCount === 3 ? 3 : 2,
          ready: [false, false],
          guestSeq: 0,
        }
      : null;
    this.lobbySeq = 0;
    this.faction = options.faction === "orc" ? "orc" : "human";
    this.changed = changed;
    this.result = result;
    this.direct = new Set();
    this.pending = new Map();
    this.ack = 0;
    this.lastSeen = 0;
    this.lastSnapshot = 0;
    this.started = false;
    this.paused = true;
    this.closed = false;
    this.peer = null;
    this.rtt = null;
    this.error = "";
    this.revision = 0;
    this.remoteRevision = -1;
    this.sim = this.creator
      ? new HostSimulation(options)
      : new GuestSimulation();
    if (!forceRelay) {
      try {
        this.room = joinRoom(
          {
            appId: "thepok.github.io.grenzwacht.v1",
            password: password || undefined,
          },
          room,
          { onJoinError: () => this.changed() },
        );
        this.wire = this.room.makeAction("duel");
        this.wire.onMessage = (m, { peerId }) => this.receive(m, peerId);
        this.room.onPeerJoin = (p) => {
          this.direct.add(p);
          this.heartbeat();
          this.changed();
        };
        this.room.onPeerLeave = (p) => {
          this.direct.delete(p);
          this.changed();
        };
      } catch {
        this.room = null;
        this.wire = null;
      }
    }
    this.relay = new Relay(
      room,
      selfId,
      (m, p) => this.receive(m, p),
      () => {
        if (!this.closed) {
          this.heartbeat();
          this.changed();
        }
      },
      { password },
    );
    this.timer = setInterval(() => this.tick(), 50);
    this.beat = setInterval(() => this.heartbeat(), 500);
  }
  stateFactions(options) {
    return [0, 1].map((i) =>
      options.factions?.[i] === "orc" ? "orc" : "human",
    );
  }
  sendLobby() {
    if (this.creator && this.peer)
      void this.send({
        kind: "lobby",
        serial: ++this.revision,
        lobby: this.lobby,
      });
  }
  configure(patch) {
    if (this.started || this.error || !this.lobby) return;
    if (this.creator) {
      this.applyLobby(0, patch, this.lobby.revision);
      this.sendLobby();
    } else {
      this.lobbyPending = {
        kind: "lobby-edit",
        seq: ++this.lobbySeq,
        revision: this.lobby.revision,
        patch,
      };
      void this.send(this.lobbyPending);
    }
    this.changed();
  }
  applyLobby(side, patch, revision) {
    if (!patch || typeof patch !== "object" || this.started) return;
    const l = this.lobby;
    let changed = false;
    if (
      ["human", "orc"].includes(patch.faction) &&
      patch.faction !== l.factions[side]
    ) {
      l.factions[side] = patch.faction;
      changed = true;
    }
    if (
      Number.isInteger(patch.handicap) &&
      patch.handicap >= 50 &&
      patch.handicap <= 150 &&
      patch.handicap % 10 === 0 &&
      patch.handicap !== l.handicaps[side]
    ) {
      l.handicaps[side] = patch.handicap;
      changed = true;
    }
    if (
      side === 0 &&
      [2, 3].includes(patch.laneCount) &&
      patch.laneCount !== l.laneCount
    ) {
      l.laneCount = patch.laneCount;
      changed = true;
    }
    if (changed) {
      l.ready = [false, false];
      l.revision++;
    } else if (
      typeof patch.ready === "boolean" &&
      revision === l.revision &&
      this.connected
    ) {
      l.ready[side] = patch.ready;
      // Readiness does not change the settings revision: simultaneous ready clicks are valid.
    }
    if (this.peer && this.connected && l.ready.every(Boolean)) {
      this.sim = new HostSimulation({
        ...this.options,
        factions: l.factions,
        handicap: l.handicaps[0],
        enemyHandicap: l.handicaps[1],
        laneCount: l.laneCount,
      });
      this.started = true;
      this.paused = false;
      this.snapshot();
    }
  }
  get state() {
    return this.sim.state;
  }
  get connected() {
    return !!this.lastSeen && Date.now() - this.lastSeen < 5000;
  }
  get status() {
    if (this.error) return this.error;
    if (!this.peer && this.creator) return "Warte auf einen Mitspieler …";
    if (!this.connected)
      return this.started
        ? "Verbindung unterbrochen · Partie pausiert"
        : "Verbinde … Passwort und Einladung prüfen, falls dies anhält.";
    const mode = this.direct.has(this.creator ? this.peer : this.host)
      ? "P2P verbunden"
      : "Relay-Verbindung · verschlüsselt";
    return (
      mode +
      (this.rtt !== null ? ` · ${this.rtt} ms` : "") +
      (!this.started ? " · Lobby" : this.paused ? " · Pause" : "")
    );
  }
  async send(m, target = this.creator ? this.peer : this.host) {
    if (!target || this.closed) return false;
    m = { protocol: PROTOCOL, ...m };
    if (this.direct.has(target))
      try {
        await this.wire.send(m, { target });
        return true;
      } catch {
        this.direct.delete(target);
      }
    return this.relay.send(m, target);
  }
  snapshot() {
    if (!this.creator || !this.peer) return;
    this.lastSnapshot = Date.now();
    void this.send({
      kind: "snapshot",
      revision: ++this.revision,
      state: this.state,
      paused: this.paused,
      started: this.started,
    });
  }
  receive(m, from) {
    if (!this.closed && m?.protocol && m.protocol !== PROTOCOL) {
      const text =
        "Unterschiedliche Spielversionen. Bitte beide Seiten neu laden.";
      if (!this.creator && from === this.host) {
        this.error = text;
        this.paused = true;
        this.changed();
      } else if (this.creator && m.kind === "hello")
        void this.send({ kind: "error", protocol: m.protocol, text }, from);
      return;
    }
    if (this.closed || this.error || !m || m.protocol !== PROTOCOL) return;
    if (this.creator) {
      if (m.kind === "hello") {
        if (this.peer && this.peer !== from) {
          void this.send(
            { kind: "error", text: "Diese Partie ist bereits belegt." },
            from,
          );
          return;
        }
        if (!this.peer) {
          this.peer = from;
          this.lobby.factions[1] = m.faction === "orc" ? "orc" : "human";
          this.lobby.ready = [false, false];
          this.lobby.revision++;
        }
        this.lastSeen = Date.now();
        if (this.started) this.snapshot();
        else this.sendLobby();
        this.changed();
        return;
      }
      if (from !== this.peer) return;
    } else if (from !== this.host) return;
    this.lastSeen = Date.now();
    if (m.kind === "bye") {
      this.paused = true;
      this.error = "Mitspieler hat die Partie verlassen.";
      this.changed();
      return;
    }
    if (m.kind === "ping") {
      void this.send({ kind: "pong", sent: m.sent }, from);
    }
    if (m.kind === "pong" && Number.isFinite(m.sent))
      this.rtt = Math.max(0, Math.round(Date.now() - m.sent));
    if (this.creator) {
      if (
        m.kind === "lobby-edit" &&
        !this.started &&
        Number.isSafeInteger(m.seq) &&
        m.seq > this.lobby.guestSeq
      ) {
        this.lobby.guestSeq = m.seq;
        this.applyLobby(1, m.patch, m.revision);
        this.sendLobby();
      }
      if (
        m.kind === "ack" &&
        Number.isSafeInteger(m.tick) &&
        m.tick >= 0 &&
        m.tick <= this.state.tick
      )
        this.ack = Math.max(this.ack, m.tick);
      if (m.kind === "sync" && Date.now() - this.lastSnapshot > 1000)
        this.snapshot();
      if (m.kind === "pause") this.setPaused(!!m.value);
      if (m.kind === "command" && typeof m.id === "string") {
        if (this.paused || !this.connected || this.state.winner !== null)
          void this.send({
            kind: "receipt",
            id: m.id,
            result: { ok: false, error: "Partie pausiert oder beendet." },
          });
        else {
          const r = this.sim.enqueue(1, m.id, m.command);
          if (r) void this.send({ kind: "receipt", id: m.id, result: r });
        }
      }
    } else {
      if (
        m.kind === "lobby" &&
        !this.started &&
        m.lobby &&
        Number.isSafeInteger(m.serial) &&
        m.serial > (this.lobbySerial || 0)
      ) {
        this.lobbySerial = m.serial;
        this.lobby = m.lobby;
        if (this.lobbyPending?.seq <= this.lobby.guestSeq)
          this.lobbyPending = null;
      }
      if (m.kind === "error") {
        this.error = String(m.text).slice(0, 140);
      }
      if (
        m.kind === "snapshot" &&
        m.state &&
        Number.isSafeInteger(m.state.tick) &&
        Array.isArray(m.state.buildings) &&
        Array.isArray(m.state.castles)
      ) {
        if (!this.state || m.state.tick >= this.state.tick) {
          this.sim.snapshot(m.state);
          this.started = !!m.started;
          if (this.started) this.lobbyPending = null;
          if (
            Number.isSafeInteger(m.revision) &&
            m.revision >= this.remoteRevision
          ) {
            this.remoteRevision = m.revision;
            this.paused = !!m.paused;
          }
        }
      }
      if (m.kind === "frames") {
        this.sim.receive(m.frames);
        if (
          Number.isSafeInteger(m.revision) &&
          m.revision >= this.remoteRevision
        ) {
          this.remoteRevision = m.revision;
          this.paused = !!m.paused;
        }
        this.started = true;
      }
      if (m.kind === "receipt" && this.pending.has(m.id)) {
        this.pending.delete(m.id);
        this.result(m.result);
      }
    }
    this.changed();
  }
  command(command) {
    if (!cleanCommand(command))
      return { ok: false, error: "Ungültige Aktion." };
    if (
      !this.started ||
      !this.connected ||
      this.paused ||
      this.state?.winner !== null
    )
      return {
        ok: false,
        error: "Partie ist noch nicht bereit oder pausiert.",
      };
    const id = crypto.randomUUID();
    if (this.creator) this.sim.enqueue(0, id, command);
    else {
      if (this.pending.size >= 8)
        return {
          ok: false,
          error: "Warte auf die Bestätigung deiner Aktionen.",
        };
      this.pending.set(id, { command, time: Date.now() });
      void this.send({ kind: "command", id, command });
    }
    return { ok: true, pending: true };
  }
  setPaused(value) {
    if (!this.started) return;
    if (this.creator) {
      this.paused = !!value || !this.connected || !!this.error;
      this.broadcast();
    } else void this.send({ kind: "pause", value: !!value });
    this.changed();
  }
  broadcast() {
    if (!this.peer || !this.started) return;
    if (this.ack < this.state.tick - 200) {
      if (Date.now() - this.lastSnapshot > 1500) this.snapshot();
      return;
    }
    void this.send({
      kind: "frames",
      revision: ++this.revision,
      frames: this.sim.frames(this.ack),
      paused: this.paused,
    });
  }
  tick() {
    if (this.closed) return;
    if (this.creator) {
      if (this.started && !this.connected) this.paused = true;
      if (this.started && !this.paused && this.connected) {
        for (const receipt of this.sim.advance()) {
          if (receipt.side === 1)
            void this.send({
              kind: "receipt",
              id: receipt.id,
              result: receipt.result,
            });
          else this.result(receipt.result);
        }
      }
      if ((this.clock = (this.clock || 0) + 1) % 4 === 0) this.broadcast();
    } else if (this.state && this.connected) {
      try {
        const n = this.sim.frames.size > 8 ? 4 : 1;
        for (let i = 0; i < n; i++) if (!this.sim.advance()) break;
      } catch {
        void this.send({ kind: "sync" });
        this.sim.frames.clear();
      }
    }
    this.changed();
  }
  heartbeat() {
    if (this.closed) return;
    if (this.creator && !this.started) {
      if (!this.connected && this.lobby.ready.some(Boolean)) {
        this.lobby.ready = [false, false];
        this.lobby.revision++;
      }
      this.sendLobby();
    }
    if (!this.creator) {
      if (this.lobbyPending) void this.send(this.lobbyPending);
      if (!this.state) void this.send({ kind: "hello", faction: this.faction });
      else void this.send({ kind: "ack", tick: this.state.tick });
      for (const [id, p] of this.pending)
        if (Date.now() - p.time > 1000) {
          p.time = Date.now();
          void this.send({ kind: "command", id, command: p.command });
        }
    }
    void this.send({ kind: "ping", sent: Date.now() });
    this.changed();
  }
  async close() {
    if (this.closed) return;
    clearInterval(this.timer);
    clearInterval(this.beat);
    this.paused = true;
    await this.send({ kind: "bye" });
    this.closed = true;
    this.room?.leave();
    this.relay.close();
  }
}
