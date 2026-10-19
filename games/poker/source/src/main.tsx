import React, { useState, useEffect } from "react";
import { createRoot } from "react-dom/client";
import { Table, selfId } from "./network";
import { playing, minimumRaise, mayRaise } from "./engine";
import { Directory, type Listing } from "./directory";
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
  const [directory, setDirectory] = useState<Directory | null>(null),
    [listings, setListings] = useState<Listing[]>([]),
    [tableName, setTableName] = useState("Freundesrunde"),
    [password, setPassword] = useState(""),
    [listed, setListed] = useState(true),
    [starting, setStarting] = useState(false),
    [lobbyError, setLobbyError] = useState("");
  const [selected, setSelected] = useState<Listing | null>(() => {
    const p = new URLSearchParams(location.hash.slice(1));
    return p.has("room")
      ? {
          room: p.get("room")!,
          host: p.get("host") || "",
          title: p.get("title") || "Eingeladener Tisch",
          locked: p.get("locked") === "1",
          humans: 1,
          bots: 0,
          phase: "Bereit",
        }
      : null;
  });
  useEffect(() => {
    const d = new Directory(selfId, () => {
      setListings(d.listings());
      refresh((n) => n + 1);
    });
    setDirectory(d);
    return () => {
      void d.close();
    };
  }, []);
  const invited = !!selected;
  const start = () => {
    if (starting) return;
    if (
      selected &&
      (!/^[a-f0-9]{32}$/.test(selected.room) ||
        !/^[a-zA-Z0-9_-]{10,64}$/.test(selected.host))
    ) {
      setLobbyError(
        "Der Einladungslink ist unvollständig. Bitte den vollständigen Link verwenden.",
      );
      return;
    }
    setStarting(true);
    setLobbyError("");
    localStorage.setItem("poker-name", name);
    const room = selected?.room || crypto.randomUUID().replaceAll("-", ""),
      host = selected?.host || selfId,
      title = selected?.title || tableName.trim() || "Freundesrunde",
      locked = selected?.locked || (!selected && !!password);
    location.hash = new URLSearchParams({
      room,
      host,
      title,
      ...(locked ? { locked: "1" } : {}),
    }).toString();
    try {
      setTable(
        new Table(
          room,
          name.trim(),
          !invited,
          () => refresh((n) => n + 1),
          host,
          {
            title,
            password: locked ? password : "",
            directory: directory || undefined,
            listed: !invited && listed,
          },
        ),
      );
    } catch {
      setLobbyError(
        "Der Tisch konnte nicht geöffnet werden. Bitte einen aktuellen Browser verwenden.",
      );
      setStarting(false);
    }
  };
  if (!table)
    return (
      <main className="lobby lobby-browser">
        <div className="lobby-top">
          <a className="wordmark" href="./">
            Freundesrunde<span>♠</span>
          </a>
          <span>{directory?.status || "Suche offene Tische …"}</span>
        </div>
        <div className="lobby-layout">
          <section className="table-directory">
            <div className="eyebrow">TEXAS HOLD’EM / 5–10 BLINDS</div>
            <h1>
              Ein Tisch.
              <br />
              Gute Gesellschaft<span>.</span>
            </h1>
            <p>
              Setz dich dazu oder eröffne deine eigene Runde.
              <br />
              Keine Anmeldung. Nur virtuelle Chips.
            </p>
            <div className="directory-heading">
              <h2>Offene Tische</h2>
              <span>{listings.length} aktiv</span>
            </div>
            {listings.length ? (
              <div className="directory-list">
                {listings.map((t) => (
                  <article className="directory-row" key={t.room}>
                    <div className="table-symbol">{t.locked ? "🔒" : "♠"}</div>
                    <div className="directory-name">
                      <b>{t.title}</b>
                      <small>
                        {t.locked ? "Mit Passwort" : "Ohne Passwort"} ·{" "}
                        {t.phase === "Bereit" || t.phase === "Showdown"
                          ? "Zwischen den Händen"
                          : "Hand läuft · Einstieg danach"}
                      </small>
                    </div>
                    <span className="occupancy">
                      {t.humans} / 6 <small>Menschen · {t.bots} Bots</small>
                    </span>
                    <button
                      disabled={t.humans >= 6}
                      onClick={() => {
                        setSelected(t);
                        setPassword("");
                        setLobbyError("");
                        document
                          .getElementById("join-panel")
                          ?.scrollIntoView({
                            behavior: "smooth",
                            block: "nearest",
                          });
                      }}
                    >
                      {t.humans >= 6 ? "Voll" : "Beitreten →"}
                    </button>
                  </article>
                ))}
              </div>
            ) : (
              <div className="directory-empty">
                <span>♠</span>
                <b>Noch kein Tisch entdeckt</b>
                <p>
                  Eröffne die erste Runde. Aktive Tische erscheinen hier
                  automatisch, sobald ihre Meldung eintrifft.
                </p>
              </div>
            )}
            <p className="directory-note">
              Die Liste aktualisiert sich automatisch. Geschlossene Tische
              verschwinden spätestens nach etwa 35 Sekunden.
            </p>
          </section>
          <section id="join-panel" className="join-panel">
            <div className="eyebrow">
              {selected ? "DEIN PLATZ AM TISCH" : "DEINE EIGENE RUNDE"}
            </div>
            <h2>{selected ? selected.title : "Tisch eröffnen"}</h2>
            {selected && (
              <button
                className="back-to-create"
                onClick={() => {
                  setSelected(null);
                  setPassword("");
                  setLobbyError("");
                  history.replaceState(
                    null,
                    "",
                    location.pathname + location.search,
                  );
                }}
              >
                ← Eigenen Tisch erstellen
              </button>
            )}
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
              {!selected && (
                <>
                  <label htmlFor="table-name">Tischname</label>
                  <input
                    id="table-name"
                    value={tableName}
                    onChange={(e) => setTableName(e.target.value)}
                    maxLength={40}
                    required
                    placeholder="Zum Beispiel: Feierabendrunde"
                  />
                </>
              )}
              {(!selected || selected.locked) && (
                <>
                  <label htmlFor="table-password">
                    {selected ? "Tischpasswort" : "Passwort (optional)"}
                  </label>
                  <input
                    id="table-password"
                    type="password"
                    autoComplete={
                      selected ? "current-password" : "new-password"
                    }
                    maxLength={80}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required={!!selected?.locked}
                    placeholder={
                      selected
                        ? "Passwort der Runde"
                        : "Leer lassen für freien Beitritt"
                    }
                  />
                  <small className="password-note">
                    {selected
                      ? "Das Passwort erhältst du vom Ersteller."
                      : "Das Passwort wird nicht in der Tischliste oder im Link veröffentlicht."}
                  </small>
                </>
              )}
              {!selected && (
                <label className="listing-toggle">
                  <input
                    type="checkbox"
                    checked={listed}
                    onChange={(e) => setListed(e.target.checked)}
                  />{" "}
                  In der öffentlichen Tischliste anzeigen
                </label>
              )}
              {lobbyError && <p role="alert">{lobbyError}</p>}
              <button className="gold" disabled={!name.trim() || starting}>
                {invited ? "Am Tisch Platz nehmen" : "Tisch eröffnen"} ↗
              </button>
            </form>
            <div className="fine">1.000 CHIPS · BIS ZU 6 MENSCHEN</div>
            <p className="trust-note">
              Fünf Bots sind beim Start dabei und machen Platz für Menschen. Bei
              öffentlichen Tischen können Fremde mitspielen. Wir spielen im
              Vertrauensmodell.
            </p>
          </section>
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
          onClick={async () => {
            await table.close();
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
            <span>
              {table.options.title || "NO-LIMIT TEXAS HOLD’EM"}
              {table.options.password ? " · MIT PASSWORT" : ""}
            </span>
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
            RAUM {table.roomId.slice(0, 12)} · {table.peers.size} VERBINDUNG(EN){" "}
            <span>Virtuelle Chips. Echte Gesellschaft.</span>
          </footer>
        </>
      )}
    </main>
  );
}
createRoot(document.getElementById("root")!).render(<App />);
