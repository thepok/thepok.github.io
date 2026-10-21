import type { MqttClient } from "mqtt";
export const BROKERS = [
  "wss://broker.emqx.io:8084/mqtt",
  "wss://test.mosquitto.org:8081/mqtt",
];
const encoder = new TextEncoder(),
  decoder = new TextDecoder();
export const NOSTR_RELAYS = ["wss://nostr-relay.corb.net", "wss://nos.lol"];
type NostrChannel = {
  nostr: true;
  url: string;
  send: (data: string) => Promise<unknown>;
  close: () => void;
};
const base64 = (data: Uint8Array) =>
  btoa(Array.from(data, (b) => String.fromCharCode(b)).join(""));
const bytes = (data: string) =>
  Uint8Array.from(atob(data), (c) => c.charCodeAt(0));
export async function roomCrypto(room: string, password = "") {
  const digest = async (s: string) =>
    new Uint8Array(await crypto.subtle.digest("SHA-256", encoder.encode(s)));
  const topic =
    "thepok/grenzwacht/v1/" +
    Array.from(await digest("grenzwacht:topic:v1:" + room), (b) =>
      b.toString(16).padStart(2, "0"),
    ).join("");
  const key = password
    ? await crypto.subtle.deriveKey(
        {
          name: "PBKDF2",
          salt: encoder.encode("grenzwacht:password:v1:" + room),
          iterations: 120000,
          hash: "SHA-256",
        },
        await crypto.subtle.importKey(
          "raw",
          encoder.encode(password),
          "PBKDF2",
          false,
          ["deriveKey"],
        ),
        { name: "AES-GCM", length: 256 },
        false,
        ["encrypt", "decrypt"],
      )
    : await crypto.subtle.importKey(
        "raw",
        await digest("grenzwacht:key:v1:" + room),
        "AES-GCM",
        false,
        ["encrypt", "decrypt"],
      );
  return {
    topic,
    async seal(value: unknown) {
      const iv = crypto.getRandomValues(new Uint8Array(12));
      const data = await crypto.subtle.encrypt(
        { name: "AES-GCM", iv },
        key,
        encoder.encode(JSON.stringify(value)),
      );
      return JSON.stringify({
        iv: base64(iv),
        data: base64(new Uint8Array(data)),
      });
    },
    async open(payload: string) {
      const p = JSON.parse(payload);
      return JSON.parse(
        decoder.decode(
          await crypto.subtle.decrypt(
            { name: "AES-GCM", iv: bytes(p.iv) },
            key,
            bytes(p.data),
          ),
        ),
      );
    },
  };
}
type Envelope = { id: string; from: string; to?: string; body: any };
export class Relay {
  clients: MqttClient[] = [];
  ready = new Set<MqttClient | NostrChannel>();
  nostrClosers: (() => void)[] = [];
  retryTimers = new Set<ReturnType<typeof setTimeout>>();
  seen = new Set<string>();
  closed = false;
  codec: Awaited<ReturnType<typeof roomCrypto>> | undefined;
  constructor(
    public room: string,
    public self: string,
    public receive: (body: any, from: string) => void,
    public changed: () => void,
    public options: { password?: string; publicChannel?: boolean } = {},
  ) {
    void this.start();
  }
  async start() {
    try {
      this.codec = this.options.publicChannel
        ? {
            topic: "thepok/grenzwacht/directory/v1",
            seal: async (value: unknown) => JSON.stringify(value),
            open: async (value: string) => JSON.parse(value),
          }
        : await roomCrypto(this.room, this.options.password);
      void this.startNostr();
      const { default: mqtt } = await import("mqtt");
      if (this.closed) return;
      for (const url of BROKERS) {
        const client = mqtt.connect(url, {
          clientId: "grw-" + crypto.randomUUID(),
          clean: true,
          keepalive: 15,
          reconnectPeriod: 4000,
          connectTimeout: 10000,
          queueQoSZero: false,
          resubscribe: true,
        });
        this.clients.push(client);
        client.on("connect", () => {
          client.subscribe(this.codec!.topic, { qos: 1 }, (error, granted) => {
            if (!error && granted?.every((g) => g.qos !== 128)) {
              this.ready.add(client);
              this.changed();
            }
          });
        });
        client.on("close", () => {
          this.ready.delete(client);
          this.changed();
        });
        client.on("error", () => {
          this.ready.delete(client);
          this.changed();
        });
        client.on("message", (_topic, data) => {
          void this.onMessage(data.toString());
        });
      }
    } catch {
      this.changed();
    }
  }
  async startNostr() {
    try {
      const [{ Relay: NostrRelay }, { finalizeEvent, generateSecretKey }] =
        await Promise.all([
          import("nostr-tools/relay"),
          import("nostr-tools/pure"),
        ]);
      const secret = generateSecretKey();
      for (const url of NOSTR_RELAYS) {
        const open = async () => {
          if (this.closed) return;
          const relay = new NostrRelay(url);
          let retrying = false,
            closing = false;
          // Flush subscription CLOSE frames before closing the WebSocket. The SDK
          // queues those sends in microtasks; closing immediately races them.
          const safeClose = () => {
            if (closing) return;
            closing = true;
            for (const sub of [...relay.openSubs.values()]) sub.close();
            queueMicrotask(() => relay.close());
          };
          const channel: NostrChannel = {
            nostr: true,
            url,
            send: (data) =>
              !relay.connected
                ? Promise.reject(new Error("Relay getrennt"))
                : relay.publish(
                    finalizeEvent(
                      {
                        kind: 20001,
                        created_at: Math.floor(Date.now() / 1000),
                        tags: [["d", this.codec!.topic]],
                        content: data,
                      },
                      secret,
                    ),
                  ),
            close: () => relay.close(),
          };
          const retry = () => {
            if (retrying) return;
            retrying = true;
            this.ready.delete(channel);
            safeClose();
            this.changed();
            if (!this.closed) {
              const timer = setTimeout(() => {
                this.retryTimers.delete(timer);
                void open();
              }, 5000);
              this.retryTimers.add(timer);
            }
          };
          this.nostrClosers.push(safeClose);
          relay.onclose = retry;
          try {
            await relay.connect({ timeout: 10000 });
            if (this.closed) {
              relay.close();
              return;
            }
            relay.subscribe(
              [
                {
                  kinds: [20001],
                  "#d": [this.codec!.topic],
                  since: Math.floor(Date.now() / 1000) - 5,
                },
              ],
              {
                oneose: () => {
                  if (!this.closed && !retrying && relay.connected) {
                    this.ready.add(channel);
                    this.changed();
                  }
                },
                onevent: (event) => {
                  void this.onMessage(event.content);
                },
                onclose: retry,
              },
            );
          } catch {
            retry();
          }
        };
        void open();
      }
    } catch {
      /* MQTT remains available if this optional transport cannot load. */
    }
  }
  async onMessage(data: string) {
    try {
      if (this.closed || data.length > 200000) return;
      const p: Envelope = await this.codec!.open(data);
      if (
        !p ||
        typeof p.from !== "string" ||
        typeof p.id !== "string" ||
        p.from === this.self ||
        (p.to && p.to !== this.self) ||
        this.seen.has(p.id)
      )
        return;
      this.seen.add(p.id);
      if (this.seen.size > 512)
        this.seen.delete(this.seen.values().next().value!);
      this.receive(p.body, p.from);
    } catch {
      /* Invalid ciphertext is ignored. */
    }
  }
  async send(body: any, to?: string) {
    if (this.closed || !this.codec || !this.ready.size) return false;
    const data = await this.codec.seal({
      id: crypto.randomUUID(),
      from: this.self,
      to,
      body,
    });
    await Promise.all(
      [...this.ready].map(
        (c) =>
          new Promise<void>((resolve) => {
            const timer = setTimeout(resolve, 1500);
            if ("nostr" in c) {
              void c
                .send(data)
                .catch(() => {})
                .finally(() => {
                  clearTimeout(timer);
                  resolve();
                });
              return;
            }
            c.publish(
              this.codec!.topic,
              data,
              { qos: 1, retain: false },
              () => {
                clearTimeout(timer);
                resolve();
              },
            );
          }),
      ),
    );
    return true;
  }
  close() {
    this.closed = true;
    this.ready.clear();
    for (const timer of this.retryTimers) clearTimeout(timer);
    for (const close of this.nostrClosers) close();
    for (const c of this.clients) c.end(true);
  }
}
