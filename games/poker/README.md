# Freundesrunde · Texas Hold’em

Live: https://thepok.github.io/games/poker/

Privaten Tisch eröffnen, Namen eingeben und **Karten geben** anklicken. Fünf Bots sitzen sofort bereit. Über **Freunde einladen** den vollständigen Link inklusive `#room=…&host=…` teilen. Ein Gast ersetzt einen Bot (oder nimmt einen freien Platz). Während einer Hand werden alle Sitzplatzänderungen bis **Nächste Hand** vorgemerkt. Jeder sitzende Mensch kann Bots hinzufügen und entfernen; entfernte Bots werden nicht automatisch aufgefüllt.

## Architektur

- `source/src/engine.ts`: unveränderlich verarbeitete Zustandsmaschine, 52 Karten, kryptografisch gleichverteiltes Mischen, Dealer/Blinds, Heads-up, Setzrunden, Mindest-Raises und kurze All-ins, vollständige beste 5-aus-7-Bewertung, Side Pots und Restchipvergabe links vom Button.
- `source/src/bots.ts`: lokale Heuristik mit eigener Hand, öffentlichem Board, Pot Odds und unterschiedlicher Aggressivität. Keine gegnerischen Hole Cards und kein LLM. Verzögerung etwa 0,7–1,3 Sekunden.
- `source/src/network.ts`: Trystero **0.25.4**, WebRTC DataChannels und öffentliche Nostr-Relays (Standardstrategie). Aktuelle objektbasierte API mit `makeAction().send()` / `onMessage` und `onPeerJoin` / `onPeerLeave` als Callback-Eigenschaften. Siehe [Trystero-Dokumentation](https://trystero.dev/docs/getting-started/).
- `source/src/main.tsx`, `style.css`: React, deutsche Oberfläche, responsiver Sechsertisch, Karten, Aktionen, Einsatzregler, Verlauf und Verbindungsstatus.

Nur der Raumersteller verarbeitet Befehle und führt Bots aus. Befehle werden seriell verarbeitet, Pokeraktionen müssen die aktuelle Zustandsversion und die richtige Spieleridentität enthalten. Snapshots sind monoton versioniert; ältere Snapshots werden verworfen. Bei neuer P2P-Verbindung wird der vollständige aktuelle Zustand angefordert/übertragen. Jeder Raum besitzt eine kryptografisch zufällige UUID (122 zufällige Bits). Der Host-Peer steht ebenfalls im URL-Fragment; Fragmente werden nicht an GitHub Pages übertragen.

**Vertrauensmodell:** private Freundesrunde mit virtuellen Chips. Vollständige Zustände einschließlich Deck und verdeckter Karten werden repliziert. Die reguläre Oberfläche verdeckt gegnerische Karten bis zum Showdown und zeigt keine gefoldeten Gegnerkarten. Mit Entwicklertools lassen sich Karten auslesen; das ist ausdrücklich kein Echtgeld- oder Anti-Cheat-System. Keine Accounts, Datenbank, eigene Signaling- oder TURN-Infrastruktur.

## Entwicklung und Tests

Node.js 22.12+ (hier mit Node 24 getestet):

```sh
cd games/poker/source
npm ci
npm run dev
```

Öffnen: `http://127.0.0.1:5173/games/poker/`.

```sh
npm test
npm run build
```

Der Build schreibt `../index.html` und `../assets/`. `emptyOutDir: false` schützt den daneben liegenden Quellcode. `base: /games/poker/` und Fragment-Links benötigen keine serverseitigen SPA-Rewrites. Das Root-Repository besitzt bereits `.nojekyll`. Das Deployment verwendet dessen bestehende GitHub-Pages-Veröffentlichung; keine Workflow-Änderung nötig.

Browserprüfung bei laufendem Devserver:

```sh
node browser-test.mjs
```

Das Skript verwendet den installierten Microsoft Edge über Playwright. Für andere Systeme `channel: 'msedge'` anpassen oder Chromium über Playwright installieren. `TEST_URL` kann auf die Live-URL zeigen. Screenshots und JSON-Ergebnisse landen in `source/evidence/` (nicht eingecheckt). Tests verwenden unabhängige Browser-Kontexte und echte öffentliche Signaling-Relays, keinen simulierten Netzwerktransport.

## Regeln und Bedienung

1.000 Chips Startstack, Blinds 5/10. Einsätze sind Gesamtbeträge der laufenden Setzrunde, **Raise auf 40** bedeutet insgesamt 40, nicht zusätzlich 40. **Call** wird auf den verfügbaren Stack begrenzt und kann daher All-in bedeuten. Ein kurzer All-in eröffnet bereits ausgeübte Raise-Rechte nicht erneut. Side Pots werden separat ausgewertet. Nicht gecallte Überschüsse gehen an ihren einzigen Berechtigten zurück. Bei geteilten Pots geht ein ungerader Chip zuerst an den nächsten Gewinner links vom Dealer. Nach jeder Hand startet ein beliebiger Mensch mit **Nächste Hand** die nächste Runde. Spieler ohne Chips sitzen aus und können zwischen Händen 1.000 Chips nachladen; Bots lassen sich entfernen und neu hinzufügen.

## Bekannte Grenzen

- **Keine automatische Hostmigration.** Ist der Spielleiter getrennt, pausieren Clients nachvollziehbar. Bei Rückkehr desselben Peers kann die Verbindung wiederhergestellt werden. Schließt/aktualisiert der Host den Tab, muss ein neuer Raum eröffnet werden. Es wird niemals ein zweiter Dealer automatisch gewählt.
- Keine dauerhafte Speicherung oder Wiederaufnahme nach Browser-Neustart. Ein Refresh erzeugt eine neue Peer-Identität. Ein kurz getrenntes Peer kann mit derselben Identität wieder verbinden. Ein verlassener menschlicher Sitz bleibt offline bestehen; nach 20 Sekunden wird an seinem Zug automatisch gefoldet. Für eine vollständig neue Besetzung gegebenenfalls einen neuen Raum eröffnen. Bots können keine Menschen entfernen.
- Öffentliche Relays können ausfallen oder Verbindungen verzögert herstellen. Ohne TURN sind manche NAT-/Firewall-Kombinationen nicht erreichbar. Nach 25 Sekunden ohne Host wird ein verständlicher Fehler angezeigt; die Hintergrundsuche läuft weiter. **Solo bereit** bestätigt ausschließlich lokales Spielen. **P2P verbunden** erscheint erst nach tatsächlichem Peer-/Snapshot-Ereignis.
- Keine Garantie für Verfügbarkeit öffentlicher Signaling-Dienste. Bis zu sechs sitzende Spieler; zusätzliche Gäste erhalten bei voller Belegung eine Fehlermeldung.
- Die Browser-Kontexte der Tests laufen auf einem Rechner/Internetanschluss. Verbindungen zwischen verschiedenen Internetanschlüssen, Mobilfunk und restriktiven Firmennetzen sind damit nicht bewiesen.
- Google Fonts sind optional; bei Nichterreichbarkeit greift ein lokaler Serif-/Sans-Serif-Fallback. Der Spielcode wird lokal von Pages ausgeliefert.

Testdetails und tatsächlich ausgeführte Prüfungen: [TESTS.md](TESTS.md).
