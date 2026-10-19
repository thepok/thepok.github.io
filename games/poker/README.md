# Freundesrunde · Texas Hold’em

Live: https://thepok.github.io/games/poker/

Die Startseite zeigt **Offene Tische**. Einen Tisch auswählen, Spielernamen und gegebenenfalls das Tischpasswort eingeben und beitreten. Alternativ einen eigenen Tisch mit frei wählbarem **Tischnamen** und **optionalem Passwort** eröffnen. Standardmäßig erscheint er im öffentlichen Verzeichnis; die Checkbox **In der öffentlichen Tischliste anzeigen** kann für eine private Einladungsrunde deaktiviert werden.

Fünf Bots sitzen sofort bereit. **Karten geben** startet die Runde. **Freunde einladen** kopiert weiterhin einen vollständigen Link inklusive Raum, Host, Titel und Passwort-Markierung; **das Passwort selbst steht niemals im Link** und muss separat mitgeteilt werden. Ein Gast ersetzt einen Bot (oder nimmt einen freien Platz). Während einer Hand werden alle Sitzplatzänderungen bis **Nächste Hand** vorgemerkt. Jeder sitzende Mensch kann Bots hinzufügen und entfernen; entfernte Bots werden nicht automatisch aufgefüllt.

## Tischliste und Passwörter

- `source/src/directory.ts` verwaltet ein gemeinsames öffentliches Verzeichnis über die bereits verwendeten Relays. Hosts melden alle acht Sekunden Tischname, Raum-/Hostkennung, Passwortpflicht, reservierte menschliche Plätze, Bots und Spielphase. Neue Besucher fragen nach aktiven Tischen. Ohne frische Meldung wird ein Eintrag nach etwa 35 Sekunden aus dem lokalen Browser-Verzeichnis entfernt; freiwilliges Schließen sendet zusätzlich eine Abmeldung. Es gibt keine eigene Datenbank, keinen Registrierungsschritt und keine gespeicherte Tischliste auf GitHub Pages.
- Die Ankündigungen sind bewusst öffentlich. **Keine Passwörter, Spielernamen einzelner Teilnehmer, Karten, Decks oder Chipstände** werden angekündigt. Spieler- und Spielnachrichten bleiben vom Verzeichnis getrennt. Ungültige Meldungen werden verworfen; die Anzeige ist auf 200 Einträge begrenzt. Öffentliche Meldungen sind kein verifiziertes Identitätsverzeichnis und können durch Fremde erzeugt werden.
- Ein Passwort wird bei Trystero für den Zugang zum P2P-Raum verwendet. Zusätzlich wird der Schlüssel des verschlüsselten Daten-Fallbacks mit **PBKDF2-SHA256, 120.000 Iterationen**, getrenntem raumspezifischem Salt und AES-256-GCM aus dem Passwort abgeleitet. Nur die Kennzeichnung **Mit Passwort** ist öffentlich. Ohne korrektes Passwort werden auch im Relay-Fallback keine Spielstände entschlüsselt. Kurze, leicht erratbare Passwörter bleiben leicht erratbar; das bisherige Vertrauensmodell zwischen zugelassenen Spielern bleibt bestehen.
- Das Tischverzeichnis ist eine flüchtige Live-Liste. Öffentliche Relay-Ausfälle, unterschiedliche erreichbare Anbieter oder stark gedrosselte Hintergrund-Tabs können Einträge verzögern oder zeitweise verschwinden lassen. Der Einladungslink bleibt als Alternative vorhanden. Ein alter Eintrag kann kurz nach dem Schließen noch sichtbar sein, bis die Abmeldung oder das Zeitlimit greift.
- Nach diesem Update alle Browser neu laden und neue Tische eröffnen. Die neue App verwendet einen getrennten P2P-Namensraum für passwortfähige Tische; vorher laufende Tische werden nicht nachträglich öffentlich gemacht.

## Architektur

- `source/src/engine.ts`: unveränderlich verarbeitete Zustandsmaschine, 52 Karten, kryptografisch gleichverteiltes Mischen, Dealer/Blinds, Heads-up, Setzrunden, Mindest-Raises und kurze All-ins, vollständige beste 5-aus-7-Bewertung, Side Pots und Restchipvergabe links vom Button.
- `source/src/bots.ts`: lokale Heuristik mit eigener Hand, öffentlichem Board, Pot Odds und unterschiedlicher Aggressivität. Keine gegnerischen Hole Cards und kein LLM. Verzögerung etwa 0,7–1,3 Sekunden.
- `source/src/network.ts`: Trystero **0.26.0**, WebRTC DataChannels und öffentliche Nostr-Relays (Standardstrategie). Objektbasierte API mit `makeAction().send()` / `onMessage` und `onPeerJoin` / `onPeerLeave` als Callback-Eigenschaften. Das Update behebt unter anderem [veraltete Verbindungsangebote nach längerer Wartezeit](https://github.com/dmotz/trystero/issues/204). **Alle Teilnehmer müssen die neue Seite laden und einen neuen Raum verwenden**, da sich das Signaling-Protokoll geändert hat.
- `source/src/relay.ts`: zusätzlicher, vom Nutzer genehmigter **Daten-Fallback**, wenn keine direkte WebRTC-Verbindung möglich ist. Öffentliche Nostr-Relays auf Port **443** und öffentliche MQTT-Broker über WSS dienen als Transport. Alle Nutzdaten werden vor dem Versand mit AES-GCM verschlüsselt; Schlüssel und nicht erratbarer Topic-Name werden mit getrennten SHA-256-Ableitungen aus der zufälligen Raum-ID erzeugt. Pro Nachricht frischer 96-Bit-Nonce, keine Klartextkarten oder Spielernamen auf den Relays. Signaturvalidierung für Nostr-Ereignisse durch `nostr-tools`. Keine öffentlich gespeicherten/retained Spielstände; Nostr-Ereignisse verwenden die ephemere Kategorie 20001. Öffentliche Betreiber können trotzdem verschlüsselte Daten protokollieren.
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

Die Anzeige unterscheidet **P2P verbunden**, **Relay-Verbindung · verschlüsselt** und **P2P + Relay · verschlüsselt**. Relay-Verbindungen werden erst als Spieler-Verbindung gewertet, wenn tatsächlich Nachrichten des anderen Peers empfangen wurden. Heartbeats erkennen Verbindungsverlust; neuere Host-Versionen lösen Snapshot-Anfragen aus. Identische Relay-Nachrichten werden über alle Fallback-Wege dedupliziert. Direkte DataChannels werden bevorzugt. Es gibt weiterhin keinen eigenen Backend-, Signaling- oder TURN-Server und keinen Anbieter-Account.

Browserprüfung bei laufendem Devserver:

```sh
node browser-test.mjs
```

Das Skript verwendet den installierten Microsoft Edge über Playwright. Für andere Systeme `channel: 'msedge'` anpassen oder Chromium über Playwright installieren. `TEST_URL` kann auf die Live-URL zeigen. Screenshots und JSON-Ergebnisse landen in `source/evidence/` (nicht eingecheckt). Tests verwenden unabhängige Browser-Kontexte und echte öffentliche Signaling-Relays, keinen simulierten Netzwerktransport.

Zusätzliche Testoptionen als Umgebungsvariablen: `BLOCK_WEBRTC=1` entfernt alle ICE-Kandidaten des zweiten Clients und prüft den echten Relay-Fallback. `NOSTR_ONLY=1` blockiert zusätzlich die MQTT-WebSockets und prüft Datenübertragung ausschließlich über Port 443. `JOIN_DELAY_MS=65000` verzögert den zweiten Beitritt; mit `NO_RELAY=1` wird der direkte Beitritt ohne Daten-Fallback geprüft.

`node lobby-test.mjs` prüft zusätzlich Entdeckung ohne Einladungslink, Passwortschutz, offene und nicht gelistete Tische, Abmeldung und mobile Darstellung. Bei diesem Test blockiert `BLOCK_WEBRTC=1` die direkten Verbindungen aller Teilnehmer; `NOSTR_ONLY=1` erzwingt zusätzlich Port-443-Relays.

## Regeln und Bedienung

1.000 Chips Startstack, Blinds 5/10. Einsätze sind Gesamtbeträge der laufenden Setzrunde, **Raise auf 40** bedeutet insgesamt 40, nicht zusätzlich 40. **Call** wird auf den verfügbaren Stack begrenzt und kann daher All-in bedeuten. Ein kurzer All-in eröffnet bereits ausgeübte Raise-Rechte nicht erneut. Side Pots werden separat ausgewertet. Nicht gecallte Überschüsse gehen an ihren einzigen Berechtigten zurück. Bei geteilten Pots geht ein ungerader Chip zuerst an den nächsten Gewinner links vom Dealer. Nach jeder Hand startet ein beliebiger Mensch mit **Nächste Hand** die nächste Runde. Spieler ohne Chips sitzen aus und können zwischen Händen 1.000 Chips nachladen; Bots lassen sich entfernen und neu hinzufügen.

## Bekannte Grenzen

- **Keine automatische Hostmigration.** Ist der Spielleiter getrennt, pausieren Clients nachvollziehbar. Bei Rückkehr desselben Peers kann die Verbindung wiederhergestellt werden. Schließt/aktualisiert der Host den Tab, muss ein neuer Raum eröffnet werden. Es wird niemals ein zweiter Dealer automatisch gewählt.
- Keine dauerhafte Speicherung oder Wiederaufnahme nach Browser-Neustart. Ein Refresh erzeugt eine neue Peer-Identität. Ein kurz getrenntes Peer kann mit derselben Identität wieder verbinden. Bei **Verlassen** wird der eigene Sitz frei (bei laufender Hand erst danach). Ein abrupt getrennter menschlicher Sitz bleibt zunächst offline; nach 20 Sekunden wird an seinem Zug automatisch gefoldet und nach 90 Sekunden wird die Freigabe für die nächste Hand vorgemerkt. Bots können keine Menschen entfernen.
- Öffentliche Relays können ausfallen oder Verbindungen verzögert herstellen. Ohne TURN sind manche NAT-/Firewall-Kombinationen für direkte Verbindungen nicht erreichbar; dann wird der verschlüsselte Daten-Fallback verwendet. Falls auch dessen öffentliche WebSockets gesperrt sind oder beide Teilnehmer keinen gemeinsamen erreichbaren Dienst besitzen, kann kein Beitritt garantiert werden. Nach 30 Sekunden ohne Host wird ein verständlicher Fehler angezeigt; die Hintergrundsuche läuft weiter. **Solo bereit** bestätigt ausschließlich lokales Spielen.
- Keine Garantie für Verfügbarkeit öffentlicher Dienste. Die MQTT-Endpunkte ([EMQX](https://www.emqx.com/en/mqtt/public-mqtt5-broker), [Mosquitto](https://test.mosquitto.org/)) sind öffentliche Testdienste. Die Nostr-Endpunkte auf 443 bieten einen zusätzlichen Weg bei gesperrten MQTT-Ports 8081/8084. Bis zu sechs sitzende Spieler; zusätzliche Gäste erhalten bei voller Belegung eine Fehlermeldung.
- Die Browser-Kontexte der Tests laufen auf einem Rechner/Internetanschluss. Verbindungen zwischen verschiedenen Internetanschlüssen, Mobilfunk und restriktiven Firmennetzen sind damit nicht bewiesen.
- Google Fonts sind optional; bei Nichterreichbarkeit greift ein lokaler Serif-/Sans-Serif-Fallback. Der Spielcode wird lokal von Pages ausgeliefert.

Testdetails und tatsächlich ausgeführte Prüfungen: [TESTS.md](TESTS.md).
