import {
  evaluate,
  minimumRaise,
  mayRaise,
  type State,
  type Command,
} from "./engine";
// Only own cards and public board enter the heuristic. No opponent hole cards.
export function botAction(s: State): Command {
  const p = s.players[s.turn]!;
  const ranks = p.cards.map((c) => (c % 13) + 2);
  const suited = ((p.cards[0] / 13) | 0) === ((p.cards[1] / 13) | 0);
  const strength = s.board.length
    ? Math.min(0.98, 0.18 + evaluate([...p.cards, ...s.board])[0] * 0.13)
    : ranks[0] === ranks[1]
      ? 0.65 + (ranks[0] / 14) * 0.25
      : 0.12 + Math.max(...ranks) / 28 + (suited ? 0.08 : 0);
  const pot = s.players.reduce((n, q) => n + (q?.total || 0), 0),
    due = s.current - p.bet,
    odds = due / (pot + due || 1),
    noise = Math.random() * 0.22,
    aggression = 0.15 + (p.name.charCodeAt(0) % 5) * 0.06;
  const base = { type: "act" as const, id: p.id, version: s.version };
  if (due > 0 && strength + noise < odds + 0.15)
    return { ...base, action: "fold" };
  const max = p.bet + p.chips,
    min = minimumRaise(s);
  if (
    strength + noise > 0.7 - aggression &&
    max >= min &&
    mayRaise(s, p) &&
    Math.random() < 0.38
  ) {
    return {
      ...base,
      action: "raise",
      amount: Math.min(
        max,
        Math.max(min, s.current + Math.round((pot * 0.5) / 10) * 10),
      ),
    };
  }
  return { ...base, action: "call" };
}
