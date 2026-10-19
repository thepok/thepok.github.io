import { joinRoom, selfId } from "trystero";
import {
  initial,
  transition,
  playing,
  type State,
  type Command,
} from "./engine";
import { botAction } from "./bots";
export { selfId };
export class Table {
  state: State | null = null;
  status = "Verbinde mit öffentlichen Relays …";
  error = "";
  peers = new Set<string>();
  host: string;
  room;
  wire;
  timer: ReturnType<typeof setInterval>;
  botTimer: ReturnType<typeof setTimeout> | undefined;
  closed = false;
  lastBot = -1;
  leftAt = new Map<string, number>();
  constructor(
    public roomId: string,
    public name: string,
    public creator: boolean,
    public update: () => void,
    host: string,
  ) {
    this.host = host;
    this.room = joinRoom({ appId: "thepok.github.io.poker.v1" }, roomId, {
      onJoinError: ({ error }) => {
        this.error = `WebRTC-Verbindung fehlgeschlagen: ${error}. Anderes Netzwerk versuchen.`;
        this.update();
      },
    });
    this.wire = this.room.makeAction<any>("poker");
    if (creator) {
      this.host = selfId;
      this.state = initial(selfId, name);
      this.status = "Solo bereit · warte auf Freunde";
    }
    this.wire.onMessage = (m, { peerId }) => {
      if (m.kind === "state" && peerId === this.host) {
        if (!this.state || m.state.version > this.state.version)
          this.state = m.state;
        this.status = "P2P verbunden";
        this.error = "";
        this.update();
      }
      if (m.kind === "hello" && this.creator) {
        this.command(
          { type: "join", id: peerId, name: String(m.name || "Gast") },
          peerId,
        );
        this.sendState(peerId);
      }
      if (m.kind === "command" && this.creator) this.command(m.command, peerId);
      if (m.kind === "error" && peerId === this.host) {
        this.error = m.text;
        this.update();
      }
    };
    this.room.onPeerJoin = (peer) => {
      this.peers.add(peer);
      this.leftAt.delete(peer);
      if (creator) this.status = "P2P verbunden";
      if (peer === this.host && !creator)
        this.wire.send({ kind: "hello", name }, { target: peer });
      if (creator) this.sendState(peer);
      this.update();
    };
    this.room.onPeerLeave = (peer) => {
      this.peers.delete(peer);
      this.leftAt.set(peer, Date.now());
      if (peer === this.host) {
        this.status =
          "Spielleiter getrennt · Spiel pausiert. Auf Rückkehr warten oder neuen Raum erstellen.";
      }
      if (creator && !this.peers.size)
        this.status = "Solo bereit · warte auf Freunde";
      this.update();
    };
    const began = Date.now();
    this.timer = setInterval(() => {
      if (
        !creator &&
        !this.peers.has(this.host) &&
        Date.now() - began > 25000
      ) {
        this.error =
          "Keine Verbindung zum Spielleiter. Prüft, ob der Raum noch offen ist. NAT, Firewall oder öffentliche Relays können WebRTC verhindern. Anderes Netzwerk versuchen.";
        this.update();
      }
      if (creator && this.state) {
        const p = this.state.players[this.state.turn];
        if (
          playing(this.state) &&
          p &&
          (p.bot ||
            (this.leftAt.has(p.id) &&
              Date.now() - this.leftAt.get(p.id)! > 20000)) &&
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
            },
            700 + Math.random() * 600,
          );
        }
      }
    }, 500);
    this.update();
  }
  sendState(target?: string) {
    this.wire
      .send(
        { kind: "state", state: this.state },
        target ? { target } : undefined,
      )
      .catch(() => {});
  }
  command(c: Command, source = selfId) {
    if (!this.creator) {
      if (this.peers.has(this.host))
        this.wire.send({ kind: "command", command: c }, { target: this.host });
      else this.error = "Spielleiter nicht verbunden.";
      this.update();
      return;
    }
    try {
      if (!this.state) return;
      if (source !== "system") {
        if (c.type === "act" || c.type === "rebuy") c = { ...c, id: source };
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
      else this.wire.send({ kind: "error", text }, { target: source });
    }
    this.update();
  }
  close() {
    this.closed = true;
    clearInterval(this.timer);
    clearTimeout(this.botTimer);
    this.room.leave();
  }
}
