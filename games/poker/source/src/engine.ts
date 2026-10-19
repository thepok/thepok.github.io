export type Player = {
  id: string;
  name: string;
  bot: boolean;
  chips: number;
  cards: number[];
  bet: number;
  total: number;
  folded: boolean;
  acted: boolean;
  last: number;
  label: string;
};
export type State = {
  version: number;
  hand: number;
  players: (Player | null)[];
  dealer: number;
  sb: number;
  bb: number;
  turn: number;
  phase: string;
  board: number[];
  deck: number[];
  current: number;
  raise: number;
  log: string[];
  pending: Command[];
  waiting: string[];
};
export type Command = {
  type: "join" | "remove" | "add" | "next" | "rebuy" | "act";
  id?: string;
  name?: string;
  seat?: number;
  action?: string;
  amount?: number;
  version?: number;
};
export const playing = (s: State) =>
  ["Preflop", "Flop", "Turn", "River"].includes(s.phase);
export const player = (id: string, name: string, bot = false): Player => ({
  id,
  name,
  bot,
  chips: 1000,
  cards: [],
  bet: 0,
  total: 0,
  folded: false,
  acted: false,
  last: 0,
  label: "",
});
const names = ["Ada", "Bruno", "Cleo", "Dario", "Emmy", "Felix"];
export function initial(id: string, name: string): State {
  return {
    version: 0,
    hand: 0,
    players: [
      player(id, name),
      ...names.slice(0, 5).map((n, i) => player("bot-" + i, n, true)),
    ],
    dealer: -1,
    sb: -1,
    bb: -1,
    turn: -1,
    phase: "Bereit",
    board: [],
    deck: [],
    current: 0,
    raise: 10,
    log: ["Willkommen in der Freundesrunde."],
    pending: [],
    waiting: [],
  };
}
export function note(s: State, t: string) {
  s.log = [...s.log, t].slice(-60);
}
export function shuffled() {
  const d = Array.from({ length: 52 }, (_, i) => i);
  for (let i = 51; i > 0; i--) {
    const limit = Math.floor(4294967296 / (i + 1)) * (i + 1);
    let n;
    do {
      n = crypto.getRandomValues(new Uint32Array(1))[0];
    } while (n >= limit);
    const j = n % (i + 1);
    [d[i], d[j]] = [d[j], d[i]];
  }
  return d;
}
const rank = (c: number) => (c % 13) + 2;
export const handNames = [
  "Hohe Karte",
  "Ein Paar",
  "Zwei Paare",
  "Drilling",
  "Straße",
  "Flush",
  "Full House",
  "Vierling",
  "Straight Flush",
];
function five(cards: number[]): number[] {
  const rs = cards.map(rank).sort((a, b) => b - a),
    counts = new Map<number, number>();
  rs.forEach((r) => counts.set(r, (counts.get(r) || 0) + 1));
  const groups = [...counts].sort((a, b) => b[1] - a[1] || b[0] - a[0]);
  const u = [...new Set(rs)];
  if (u[0] === 14) u.push(1);
  let straight = 0;
  for (let i = 0; i <= u.length - 5; i++)
    if (u[i] - u[i + 4] === 4) {
      straight = u[i];
      break;
    }
  const flush = cards.every(
    (c) => Math.floor(c / 13) === Math.floor(cards[0] / 13),
  );
  if (flush && straight) return [8, straight];
  if (groups[0][1] === 4) return [7, groups[0][0], groups[1][0]];
  if (groups[0][1] === 3 && groups[1][1] === 2)
    return [6, groups[0][0], groups[1][0]];
  if (flush) return [5, ...rs];
  if (straight) return [4, straight];
  if (groups[0][1] === 3) return [3, ...groups.map((g) => g[0])];
  if (groups[0][1] === 2 && groups[1][1] === 2)
    return [2, ...groups.map((g) => g[0])];
  if (groups[0][1] === 2) return [1, ...groups.map((g) => g[0])];
  return [0, ...rs];
}
export function compare(a: number[], b: number[]) {
  for (let i = 0; i < Math.max(a.length, b.length); i++) {
    const d = (a[i] || 0) - (b[i] || 0);
    if (d) return d;
  }
  return 0;
}
export function evaluate(cards: number[]): number[] {
  let best: number[] = [];
  for (let a = 0; a < cards.length - 4; a++)
    for (let b = a + 1; b < cards.length - 3; b++)
      for (let c = b + 1; c < cards.length - 2; c++)
        for (let d = c + 1; d < cards.length - 1; d++)
          for (let e = d + 1; e < cards.length; e++) {
            const v = five([cards[a], cards[b], cards[c], cards[d], cards[e]]);
            if (!best.length || compare(v, best) > 0) best = v;
          }
  return best;
}
function next(s: State, from: number, predicate: (p: Player) => boolean) {
  for (let k = 1; k <= 6; k++) {
    const i = (from + k + 6) % 6,
      p = s.players[i];
    if (p && predicate(p)) return i;
  }
  return -1;
}
const live = (p: Player) => p.cards.length > 0 && !p.folded;
const can = (p: Player) => live(p) && p.chips > 0;
function pay(p: Player, amount: number) {
  const n = Math.min(p.chips, amount);
  p.chips -= n;
  p.bet += n;
  p.total += n;
}
export function settle(s: State) {
  const levels = [
    ...new Set(
      s.players
        .filter((p): p is Player => !!p && p.total > 0)
        .map((p) => p.total),
    ),
  ].sort((a, b) => a - b);
  let prev = 0;
  for (const level of levels) {
    const contributors = s.players.filter(
      (p): p is Player => !!p && p.total >= level,
    );
    const amount = (level - prev) * contributors.length;
    prev = level;
    const eligible = contributors.filter(live);
    if (!eligible.length) throw Error("Pot ohne berechtigten Spieler");
    let winners = [eligible[0]];
    for (const p of eligible.slice(1)) {
      const c = compare(
        evaluate([...p.cards, ...s.board]),
        evaluate([...winners[0].cards, ...s.board]),
      );
      if (c > 0) winners = [p];
      else if (c === 0) winners.push(p);
    }
    winners.sort(
      (a, b) =>
        ((s.players.indexOf(a) - s.dealer + 5) % 6) -
        ((s.players.indexOf(b) - s.dealer + 5) % 6),
    );
    winners.forEach((p, i) => {
      const n =
        Math.floor(amount / winners.length) +
        (i < amount % winners.length ? 1 : 0);
      p.chips += n;
      note(
        s,
        `${p.name} gewinnt ${n}${eligible.length > 1 ? " · " + handNames[evaluate([...p.cards, ...s.board])[0]] : ""}.`,
      );
    });
  }
  s.players.forEach((p) => {
    if (p) {
      p.total = 0;
      p.bet = 0;
    }
  });
  s.phase = "Showdown";
  s.turn = -1;
}
function progress(s: State, after: number) {
  const remaining = s.players.filter((p): p is Player => !!p && live(p));
  if (remaining.length === 1) {
    settle(s);
    return;
  }
  const actors = s.players.filter((p): p is Player => !!p && can(p));
  // No further wagering is possible against only all-in opponents.
  const effectiveCurrent =
    actors.length === 1
      ? Math.max(
          ...remaining.filter((p) => p !== actors[0]).map((p) => p.bet),
          0,
        )
      : s.current;
  const needs = (p: Player) => can(p) && (!p.acted || p.bet < s.current);
  if (
    actors.some(needs) &&
    !(actors.length === 1 && actors[0].bet >= effectiveCurrent)
  ) {
    s.turn = next(s, after, needs);
    return;
  }
  if (s.phase === "River") {
    settle(s);
    return;
  }
  s.phase =
    s.phase === "Preflop" ? "Flop" : s.phase === "Flop" ? "Turn" : "River";
  s.deck.pop();
  const n = s.phase === "Flop" ? 3 : 1;
  for (let i = 0; i < n; i++) s.board.push(s.deck.pop()!);
  s.current = 0;
  s.raise = 10;
  s.players.forEach((p) => {
    if (p) {
      p.bet = 0;
      p.acted = false;
      p.last = 0;
    }
  });
  note(s, s.phase);
  if (actors.length <= 1) progress(s, s.dealer);
  else s.turn = next(s, s.dealer, can);
}
function seats(s: State, c: Command) {
  if (c.type === "join") {
    if (s.players.some((p) => p?.id === c.id)) return;
    let i = s.players.findIndex((p) => !p);
    if (i < 0) i = s.players.findIndex((p) => p?.bot);
    if (i < 0) throw Error("Der Tisch ist voll.");
    s.players[i] = player(c.id!, c.name!.slice(0, 24));
    note(s, `${c.name} ist am Tisch.`);
  }
  if (c.type === "remove") {
    const p = s.players[c.seat!];
    if (p?.bot) {
      s.players[c.seat!] = null;
      note(s, `${p.name} verlässt den Tisch.`);
    }
  }
  if (c.type === "add") {
    if (s.players[c.seat!]) return;
    s.players[c.seat!] = player(
      "bot-" + crypto.randomUUID(),
      names[c.seat!],
      true,
    );
  }
  if (c.type === "rebuy") {
    const p = s.players.find((p) => p?.id === c.id);
    if (p && p.chips === 0) p.chips = 1000;
  }
}
export function transition(original: State, c: Command): State {
  const s = structuredClone(original);
  if (c.type === "add" || c.type === "remove") {
    if (!Number.isInteger(c.seat) || c.seat! < 0 || c.seat! > 5)
      throw Error("Ungültiger Sitzplatz.");
  }
  if (["join", "remove", "add", "rebuy"].includes(c.type)) {
    if (playing(s)) {
      if (c.type === "join" && s.players.some((p) => p?.id === c.id))
        return original;
      if (
        c.type === "join" &&
        s.pending.some((p) => p.type === "join" && p.id === c.id)
      )
        return original;
      const projected = structuredClone(s);
      for (const pending of s.pending) seats(projected, pending);
      seats(projected, c);
      s.pending.push(c);
      note(s, "Sitzplatzänderung für die nächste Hand vorgemerkt.");
    } else seats(s, c);
  } else if (c.type === "next") {
    if (playing(s)) throw Error("Die Hand läuft noch.");
    for (const p of s.pending) seats(s, p);
    s.pending = [];
    const active = s.players.filter((p) => p && p.chips > 0);
    if (active.length < 2)
      throw Error("Mindestens zwei Spieler mit Chips erforderlich.");
    s.dealer = next(s, s.dealer, (p) => p.chips > 0);
    s.hand++;
    s.board = [];
    s.deck = shuffled();
    s.phase = "Preflop";
    s.current = 10;
    s.raise = 10;
    s.players.forEach((p) => {
      if (p) {
        p.cards = p.chips > 0 ? [s.deck.pop()!, s.deck.pop()!] : [];
        p.folded = false;
        p.acted = false;
        p.bet = 0;
        p.total = 0;
        p.last = 0;
        p.label = "";
      }
    });
    s.sb =
      active.length === 2 ? s.dealer : next(s, s.dealer, (p) => p.chips > 0);
    s.bb = next(s, s.sb, (p) => p.chips > 0);
    pay(s.players[s.sb]!, 5);
    pay(s.players[s.bb]!, 10);
    s.turn = next(s, s.bb, can);
    note(s, `Hand ${s.hand} · Blinds 5 / 10`);
    progress(s, s.bb);
  } else if (c.type === "act") {
    if (!playing(s) || s.turn < 0) throw Error("Keine laufende Aktion.");
    const p = s.players[s.turn]!;
    if (p.id !== c.id || c.version !== s.version)
      throw Error("Aktion veraltet oder anderer Spieler am Zug.");
    const due = s.current - p.bet;
    if (c.action === "fold") {
      p.folded = true;
      p.label = "Fold";
    } else if (c.action === "call") {
      pay(p, Math.max(0, due));
      p.label = due ? "Call" : "Check";
    } else if (c.action === "raise") {
      const to = c.amount!;
      const max = p.bet + p.chips;
      if (!Number.isSafeInteger(to) || to <= s.current || to > max)
        throw Error("Ungültiger Einsatz.");
      if (!mayRaise(s, p))
        throw Error("Ein kurzer All-in erhöht dein Erhöhungsrecht nicht.");
      if (to < minimumRaise(s) && to !== max)
        throw Error("Erhöhung unter dem Minimum.");
      const increment = to - s.current;
      const completeOpening = s.current < 10 && to >= 10;
      pay(p, to - p.bet);
      if (increment >= s.raise || completeOpening) {
        s.raise = completeOpening ? to : increment;
        s.players.forEach((q) => {
          if (q && q !== p) q.acted = false;
        });
      }
      s.current = to;
      p.label = p.chips ? "Raise" : "All-in";
    } else throw Error("Unbekannte Aktion");
    p.acted = true;
    p.last = c.action === "call" && s.current === 0 ? -1 : s.current;
    note(s, `${p.name}: ${p.label}${p.bet ? " " + p.bet : ""}`);
    progress(s, s.turn);
  }
  s.version++;
  return s;
}
export const minimumRaise = (s: State) =>
  s.current < 10 ? 10 : s.current + s.raise;
export const mayRaise = (s: State, p: Player) =>
  s.players.some((q) => q && q !== p && can(q)) &&
  (!p.acted || p.last < 0 || s.current - p.last >= s.raise);
