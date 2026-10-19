import { describe, it, expect } from "vitest";
import {
  initial,
  transition,
  evaluate,
  compare,
  settle,
  playing,
  shuffled,
  type State,
} from "./engine";
import { botAction } from "./bots";
const cards = (s: string) =>
  s
    .split(" ")
    .map(
      (c) => "shcd".indexOf(c.slice(-1)) * 13 + "23456789TJQKA".indexOf(c[0]),
    );
function heads() {
  let s = initial("me", "Ich");
  for (let i = 2; i < 6; i++) s = transition(s, { type: "remove", seat: i });
  return transition(s, { type: "next" });
}
function action(s: State, action: string, amount?: number) {
  return transition(s, {
    type: "act",
    id: s.players[s.turn]!.id,
    version: s.version,
    action,
    amount,
  });
}
describe("Handbewertung", () => {
  it("ordnet alle Kategorien", () => {
    const hands = [
      "As Jd 9h 6c 3s",
      "As Ad 9h 6c 3s",
      "As Ad 9h 9c 3s",
      "As Ad Ah 6c 3s",
      "As 2d 3h 4c 5s",
      "As Js 9s 6s 3s",
      "As Ad Ah 6c 6s",
      "As Ad Ah Ac 3s",
      "As Ks Qs Js Ts",
    ];
    hands.forEach((h, i) => expect(evaluate(cards(h))[0]).toBe(i));
  });
  it("vergleicht Kicker und die besten fünf aus sieben", () => {
    expect(
      compare(
        evaluate(cards("As Ad Kh 8c 3s 2h 4d")),
        evaluate(cards("Ah Ac Qh 8d 3h 2s 4c")),
      ),
    ).toBeGreaterThan(0);
    expect(evaluate(cards("As Ks Qs Js Ts 2d 2c"))).toEqual([8, 14]);
  });
  it("erkennt Wheel und doppelten Drilling als Full House", () => {
    expect(evaluate(cards("As 2h 3d 4c 5h 9d Td"))).toEqual([4, 5]);
    expect(evaluate(cards("As Ah Ad Ks Kh Kd 2c"))).toEqual([6, 14, 13]);
  });
});
describe("Spielablauf", () => {
  it("gibt freiwillig verlassene Plätze zwischen Händen frei", () => {
    let s = initial("me", "Ich");
    s = transition(s, { type: "join", id: "friend", name: "Freund" });
    s = transition(s, { type: "leave", id: "friend" });
    expect(s.players.some((p) => p?.id === "friend")).toBe(false);
    expect(s.players.filter((p) => !p)).toHaveLength(1);
  });
  it("entfernt Menschen während einer Hand erst an der Handgrenze", () => {
    let s = transition(initial("me", "Ich"), { type: "next" });
    s = transition(s, { type: "leave", id: "me" });
    expect(s.players[0]?.id).toBe("me");
    while (playing(s)) s = action(s, "fold");
    s = transition(s, { type: "next" });
    expect(s.players[0]).toBeNull();
  });
  it("kurzes All-in öffnet abgeschlossene Raises nicht erneut", () => {
    let s = initial("me", "Ich");
    s = transition(s, { type: "next" });
    s = action(s, "raise", 40);
    const short = s.players[s.turn]!;
    short.chips = 45 - short.bet;
    s = action(s, "raise", 45);
    while (s.players[s.turn]!.id !== "bot-2") s = action(s, "call");
    expect(() => action(s, "raise", 75)).toThrow(/Erhöhungsrecht/);
    s = action(s, "call");
    expect(s.phase).toBe("Flop");
  });
  it("Check behält Erhöhungsrecht bei unvollständigem Eröffnungseinsatz", () => {
    let s = initial("me", "Ich");
    for (let i = 3; i < 6; i++) s = transition(s, { type: "remove", seat: i });
    s = transition(s, { type: "next" });
    for (let i = 0; i < 3; i++) s = action(s, "call");
    s = action(s, "call");
    s.players[s.turn]!.chips = 5;
    s = action(s, "raise", 5);
    s = action(s, "call");
    expect(s.players[s.turn]!.last).toBe(-1);
    s = action(s, "raise", 10);
    expect(s.current).toBe(10);
  });
  it("zu kurze Blinds laufen ohne künstliche Zusatzaktion aus", () => {
    let s = initial("me", "Ich");
    for (let i = 2; i < 6; i++) s = transition(s, { type: "remove", seat: i });
    s.players[1]!.chips = 3;
    s = transition(s, { type: "next" });
    expect(s.phase).toBe("Showdown");
    expect(s.board).toHaveLength(5);
  });
  it("reserviert maximal sechs menschliche Plätze", () => {
    let s = transition(initial("me", "Ich"), { type: "next" });
    for (let i = 1; i < 6; i++)
      s = transition(s, { type: "join", id: "p" + i, name: "Gast" });
    expect(() =>
      transition(s, { type: "join", id: "p7", name: "Voll" }),
    ).toThrow(/voll/);
  });
  it("mischt 52 unterschiedliche Karten", () => {
    expect(new Set(shuffled()).size).toBe(52);
  });
  it("setzt Heads-up Button/SB und Reihenfolge korrekt", () => {
    let s = heads();
    expect(s.dealer).toBe(0);
    expect(s.sb).toBe(0);
    expect(s.bb).toBe(1);
    expect(s.turn).toBe(0);
    s = action(s, "call");
    s = action(s, "call");
    expect(s.phase).toBe("Flop");
    expect(s.turn).toBe(1);
    while (playing(s)) s = action(s, "call");
    s = transition(s, { type: "next" });
    expect(s.dealer).toBe(1);
    expect(s.sb).toBe(1);
    expect(s.turn).toBe(1);
  });
  it("zahlt Fold-Sieg und erhält Chips", () => {
    const s = action(heads(), "fold");
    expect(s.phase).toBe("Showdown");
    expect(s.players[1]!.chips).toBe(1005);
    expect(s.players[0]!.chips).toBe(995);
  });
  it("validiert Beträge, Identität, Version und Mindest-Raise", () => {
    const s = heads();
    expect(() => action(s, "raise", 19)).toThrow();
    expect(() => action(s, "raise", NaN)).toThrow();
    expect(() => action(s, "raise", 1001)).toThrow();
    expect(() =>
      transition(s, {
        type: "act",
        id: "falsch",
        version: s.version,
        action: "call",
      }),
    ).toThrow();
    expect(() =>
      transition(s, { type: "act", id: "me", version: 0, action: "call" }),
    ).toThrow();
    expect(action(s, "raise", 20).current).toBe(20);
  });
  it("führt All-in bis Showdown aus", () => {
    let s = heads();
    s = action(s, "raise", 1000);
    s = action(s, "call");
    expect(s.phase).toBe("Showdown");
    expect(s.board).toHaveLength(5);
    expect(s.players.reduce((n, p) => n + (p?.chips || 0), 0)).toBe(2000);
  });
  it("verschiebt Menschen und Botverwaltung bis nächste Hand", () => {
    let s = transition(initial("me", "Ich"), { type: "next" });
    s = transition(s, { type: "join", id: "friend", name: "Freund" });
    s = transition(s, { type: "remove", seat: 5 });
    expect(s.players.some((p) => p?.id === "friend")).toBe(false);
    expect(s.pending).toHaveLength(2);
    while (playing(s)) s = action(s, "fold");
    s = transition(s, { type: "next" });
    expect(s.players[1]?.id).toBe("friend");
    expect(s.players[5]).toBeNull();
    expect(s.pending).toHaveLength(0);
  });
  it("entfernt keine Menschen und füllt nicht automatisch auf", () => {
    let s = initial("me", "Ich");
    s = transition(s, { type: "remove", seat: 0 });
    expect(s.players[0]?.id).toBe("me");
    s = transition(s, { type: "remove", seat: 3 });
    s = transition(s, { type: "next" });
    expect(s.players[3]).toBeNull();
  });
  it("berechnet Side Pots und ungerufene Einsätze", () => {
    const s = initial("me", "Ich");
    s.players = s.players.map((p, i) => (i < 3 ? p : null));
    s.board = cards("2s 3h 7d 8c 9s");
    const holes = ["As Ah", "Ks Kh", "Qs Qh"];
    [100, 200, 300].forEach((n, i) =>
      Object.assign(s.players[i]!, {
        chips: 0,
        total: n,
        cards: cards(holes[i]),
      }),
    );
    settle(s);
    expect(s.players.slice(0, 3).map((p) => p?.chips)).toEqual([300, 200, 100]);
  });
  it("teilt Pots und vergibt ungeraden Chip links vom Button", () => {
    const s = heads();
    s.board = cards("As Ks Qs Js Ts");
    Object.assign(s.players[0]!, { cards: cards("2h 3h"), total: 5, chips: 0 });
    Object.assign(s.players[1]!, { cards: cards("4h 5h"), total: 5, chips: 0 });
    s.players[2] = { ...s.players[0]!, id: "fold", folded: true, total: 1 };
    settle(s);
    expect(s.players[0]!.chips + s.players[1]!.chips).toBe(11);
    expect(s.players[1]!.chips).toBe(6);
  });
  it("spielt 100 Bot-Hände ohne Chips zu verlieren oder hängen zu bleiben", () => {
    let s = initial("me", "Ich");
    s.players.forEach((p) => {
      if (p) p.bot = true;
    });
    for (let h = 0; h < 100; h++) {
      if (s.players.filter((p) => p && p.chips > 0).length < 2) break;
      s = transition(s, { type: "next" });
      let turns = 0;
      while (playing(s)) {
        s = transition(s, botAction(s));
        expect(++turns).toBeLessThan(300);
        expect(
          s.players.reduce((n, p) => n + (p ? p.chips + p.total : 0), 0),
        ).toBe(6000);
      }
      expect(s.phase).toBe("Showdown");
    }
  });
});
