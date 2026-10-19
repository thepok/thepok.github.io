import React, { useState } from "react";
import { createRoot } from "react-dom/client";
import { Table, selfId } from "./network";
import { playing, minimumRaise, mayRaise } from "./engine";
import "./style.css";
function Card({ value, hidden = false }: { value?: number; hidden?: boolean }) {
  const suits = ["♠", "♥", "♣", "♦"];
  return (
    <span
      className={
        "card " +
        (hidden
          ? "back"
          : value === undefined
            ? "empty"
            : Math.floor(value / 13) % 2
              ? "red"
              : "")
      }
    >
      {hidden ? (
        "✦"
      ) : value === undefined ? (
        ""
      ) : (
        <>
          {
            ["2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K", "A"][
              value % 13
            ]
          }
          <small>{suits[Math.floor(value / 13)]}</small>
        </>
      )}
    </span>
  );
}
function App() {
  const [, refresh] = useState(0),
    [table, setTable] = useState<Table | null>(null),
    [name, setName] = useState(localStorage.getItem("poker-name") || ""),
    [amount, setAmount] = useState(30),
    [copied, setCopied] = useState(false);
  const params = new URLSearchParams(location.hash.slice(1)),
    invited = params.has("room");
  const start = () => {
    localStorage.setItem("poker-name", name);
    const room = params.get("room") || crypto.randomUUID().replaceAll("-", ""),
      host = params.get("host") || selfId;
    location.hash = new URLSearchParams({ room, host }).toString();
    setTable(
      new Table(room, name, !invited, () => refresh((n) => n + 1), host),
    );
  };
  if (!table)
    return (
      <main className="lobby">
        <div className="eyebrow">PRIVATE TISCHE / ECHTE FREUNDE</div>
        <h1>
          Eine gute
          <br />
          Freundesrunde<span>.</span>
        </h1>
        <p>
          Texas Hold’em. Sechs Plätze. Keine Anmeldung.
          <br />
          Starte mit Bots und hol deine Freunde an den Tisch.
        </p>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            start();
          }}
        >
          <label htmlFor="name">Dein Name</label>
          <input
            id="name"
            value={name}
            maxLength={24}
            onChange={(e) => setName(e.target.value)}
            placeholder="Wie heißt du?"
            required
          />
          <button className="gold" disabled={!name.trim()}>
            {invited ? "Am Tisch Platz nehmen" : "Privaten Tisch eröffnen"} ↗
          </button>
        </form>
        <div className="fine">5 / 10 BLINDS · 1.000 CHIPS · NUR ZUM SPASS</div>
        <div className="lobby-cards">
          <Card value={12} />
          <Card value={25} />
        </div>
      </main>
    );
  const s = table.state,
    p = s?.players.find((p) => p?.id === selfId),
    turn = s?.players[s.turn],
    mine =
      turn?.id === selfId &&
      (!table.creator ? table.peers.has(table.host) : true),
    active = s && playing(s),
    due = p && s ? Math.max(0, s.current - p.bet) : 0,
    max = p ? p.chips + p.bet : 0,
    min = s ? minimumRaise(s) : 10,
    to = Math.min(max, Math.max(min, amount));
  const act = (action: string, amount?: number) =>
    table.command({
      type: "act",
      id: selfId,
      version: s?.version,
      action,
      amount,
    });
  return (
    <main>
      <header>
        <a className="wordmark" href="./">
          Freundesrunde<span>♠</span>
        </a>
        <div className="connection">
          <i className={table.peers.size ? "online" : ""} />
          {table.status}
        </div>
        <button
          onClick={async () => {
            try {
              await navigator.clipboard.writeText(location.href);
              setCopied(true);
              setTimeout(() => setCopied(false), 2500);
            } catch {
              table.error = "Link aus der Adresszeile kopieren.";
              refresh((n) => n + 1);
            }
          }}
        >
          {copied ? "Link kopiert ✓" : "Freunde einladen ↗"}
        </button>
        <button
          onClick={() => {
            table.close();
            location.href = location.pathname;
          }}
        >
          Verlassen
        </button>
      </header>
      {table.error && (
        <div role="alert" className="alert">
          {table.error}
        </div>
      )}
      {!s ? (
        <section className="waiting">
          <h1>Dein Platz wird vorbereitet.</h1>
          <p>Die Verbindung zum Spielleiter wird aufgebaut …</p>
        </section>
      ) : (
        <>
          <div className="table-meta">
            <span>NO-LIMIT TEXAS HOLD’EM</span>
            <span>
              HAND {s.hand.toString().padStart(3, "0")} · BLINDS 5 / 10
            </span>
          </div>
          <section className="arena">
            <div className="felt">
              <div className="felt-brand">
                FREUNDESRUNDE <span>POKER CLUB</span>
              </div>
              <div className="center">
                <div className="pot">
                  POT{" "}
                  <b>
                    {s.players
                      .reduce((n, p) => n + (p?.total || 0), 0)
                      .toLocaleString("de-DE")}
                  </b>
                </div>
                <div className="board">
                  {Array.from({ length: 5 }, (_, i) => (
                    <Card key={i} value={s.board[i]} />
                  ))}
                </div>
                <div className="phase">{s.phase}</div>
              </div>
            </div>
            {s.players.map((q, i) => (
              <div
                key={i}
                className={`seat seat-${i} ${s.turn === i ? "current" : ""} ${q?.folded ? "folded" : ""}`}
              >
                {q ? (
                  <>
                    <div className="seat-heading">
                      <span className="avatar">
                        {q.name.slice(0, 2).toUpperCase()}
                      </span>
                      <div>
                        <b>
                          {q.name}
                          {q.id === selfId ? " · Du" : ""}
                        </b>
                        <small>
                          {q.bot
                            ? "BOT"
                            : table.peers.has(q.id) || q.id === selfId
                              ? "SPIELER"
                              : "OFFLINE"}
                        </small>
                      </div>
                      <span className="markers">
                        {s.dealer === i ? "D " : ""}
                        {s.sb === i ? "SB" : ""}
                        {s.bb === i ? "BB" : ""}
                      </span>
                    </div>
                    <div className="seat-bottom">
                      <span className="stack">
                        {q.chips.toLocaleString("de-DE")} <small>CHIPS</small>
                      </span>
                      {q.bot && (
                        <button
                          aria-label={`${q.name} entfernen`}
                          onClick={() =>
                            table.command({ type: "remove", seat: i })
                          }
                        >
                          − Bot
                        </button>
                      )}
                    </div>
                    <div className="hole">
                      {q.cards.map((c, j) => (
                        <Card
                          key={j}
                          value={c}
                          hidden={
                            q.id !== selfId &&
                            !(
                              s.phase === "Showdown" &&
                              !q.folded &&
                              s.board.length === 5
                            )
                          }
                        />
                      ))}
                      {q.label && (
                        <span className="bet">
                          {q.label} {q.bet || ""}
                        </span>
                      )}
                    </div>
                  </>
                ) : (
                  <button
                    className="empty-seat"
                    onClick={() => table.command({ type: "add", seat: i })}
                  >
                    ＋ Bot hinzufügen<small>PLATZ {i + 1}</small>
                  </button>
                )}
              </div>
            ))}
          </section>
          <section className="controls">
            <div className="turn-label">
              <small>{active ? "AM ZUG" : "DEIN TISCH"}</small>
              <b>
                {active
                  ? mine
                    ? "Du bist dran"
                    : turn?.name || "Auswertung"
                  : "Bereit für die nächste Hand?"}
              </b>
              {!p && <span>Du wartest auf die nächste Hand.</span>}
            </div>
            {active ? (
              <>
                <button disabled={!mine} onClick={() => act("fold")}>
                  Fold
                </button>
                <button
                  className="gold"
                  disabled={!mine}
                  onClick={() => act("call")}
                >
                  {due ? `Call ${Math.min(due, p?.chips || 0)}` : "Check"}
                </button>
                <div className="raise">
                  <label htmlFor="amount">Erhöhen auf</label>
                  <div>
                    <input
                      id="amount"
                      type="number"
                      min={Math.min(min, max)}
                      max={max}
                      value={to}
                      onChange={(e) => setAmount(Number(e.target.value))}
                    />
                    <input
                      aria-label="Einsatz"
                      type="range"
                      min={Math.min(min, max)}
                      max={max}
                      value={to}
                      onChange={(e) => setAmount(Number(e.target.value))}
                    />
                  </div>
                </div>
                <button
                  disabled={
                    !mine || max <= s.current || (!!p && !mayRaise(s, p))
                  }
                  onClick={() => act("raise", to)}
                >
                  Bet / Raise
                </button>
                <button
                  disabled={!mine}
                  onClick={() =>
                    max <= s.current ? act("call") : act("raise", max)
                  }
                >
                  All-in
                </button>
              </>
            ) : (
              <>
                <button
                  className="gold"
                  disabled={!p}
                  onClick={() => table.command({ type: "next" })}
                >
                  {s.hand ? "Nächste Hand →" : "Karten geben →"}
                </button>
                {p?.chips === 0 && (
                  <button
                    onClick={() => table.command({ type: "rebuy", id: selfId })}
                  >
                    1.000 Chips nachladen
                  </button>
                )}
              </>
            )}
          </section>
          <section className="history">
            <div>
              <h2>Tischgeschehen</h2>
              <span>
                {s.pending.length
                  ? `${s.pending.length} Sitzplatzänderung(en) nach dieser Hand`
                  : "Alle Menschen können Bots verwalten."}
              </span>
            </div>
            <ol>
              {s.log
                .slice(-7)
                .reverse()
                .map((l, i) => (
                  <li key={i}>{l}</li>
                ))}
            </ol>
          </section>
          <footer>
            RAUM {table.roomId.slice(0, 12)} · {table.peers.size}{" "}
            P2P-VERBINDUNG(EN) <span>Virtuelle Chips. Echte Gesellschaft.</span>
          </footer>
        </>
      )}
    </main>
  );
}
createRoot(document.getElementById("root")!).render(<App />);
