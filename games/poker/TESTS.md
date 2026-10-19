# Ausgeführte Prüfungen

Stand: 19. Oktober 2026. Windows, Node.js 24.18.0, Microsoft Edge über Playwright. Keine Netzwerksimulation und kein eigener Signaling-Server.

## Automatisiert

`npm test`: **26 bestandene Unit-Tests**:

- Alle neun Handkategorien, Wheel, beste fünf von sieben, zwei Drillinge als Full House, Kicker.
- 52 unterschiedliche Karten im gemischten Deck.
- Heads-up Dealer/Small Blind, Preflop-/Postflop-Reihenfolge und Dealer-Wechsel.
- Fold-Sieg und Chip-Auszahlung.
- Ungültige Beträge, Mindest-Raise, falscher Spieler, veraltete Version.
- All-in mit automatischem Board-Runout.
- Unvollständiges All-in, nicht wiedereröffnetes Raise-Recht, Check vor kurzem Eröffnungseinsatz.
- Sehr kurze Blind-Stacks ohne künstliche Zusatzaktion.
- Side Pots, ungerufene Überschüsse, Split Pots und ungerader Chip.
- Menschen und Bot-Änderungen erst an der Handgrenze; maximal sechs reservierte menschliche Plätze.
- Bot-Verwaltung entfernt keine Menschen und füllt freie Plätze nicht automatisch.
- Eine lokale Bot-Partie über bis zu 100 Hände mit Chip-Erhalt und begrenzter Zugzahl pro Hand.
- Freigabe freiwillig verlassener menschlicher Sitze, bei laufender Hand erst an der Handgrenze.
- AES-GCM-Raumtrennung, frische Nonces, manipulierte Pakete, Deduplizierung und Empfängerfilter des Relay-Transports.
- Verzeichnis-Metadaten, Kapazitätsgrenzen, Updates und Abmeldung durch denselben Host sowie Ablauf nach fehlendem Lebenszeichen.
- Geschützte Relay-Spielstände können mit dem richtigen Passwort entschlüsselt werden; falsches und fehlendes Passwort werden zurückgewiesen.

`npm run build`: TypeScript-Prüfung und Vite-Produktionsbuild erfolgreich.

`npm audit`: **0 bekannte Schwachstellen** im installierten Dependency-Baum.

## Browserprüfung

`node browser-test.mjs` mit drei unabhängigen Browser-Kontexten:

- Solo-Raum öffnet mit einem Menschen und fünf Bots.
- Zweiter Mensch verbindet sich über die öffentlichen Nostr-Relays und einen echten WebRTC DataChannel; ersetzt einen Bot.
- Beide Menschen können Bots entfernen und hinzufügen; Änderungen werden auf dem anderen Client sichtbar.
- Bot-Entfernung während einer Hand wird vorgemerkt und nach der Hand angewendet.
- Dritter Mensch tritt während einer Hand bei, wartet und sitzt erst in der nächsten Hand am Tisch.
- Eine vollständige Hand wird über Check/Call-Aktionen der Menschen und autonome Bot-Züge abgeschlossen.
- Freiwilliges Verlassen gibt den eigenen Sitz frei.
- Der Host verlässt den Raum; ein verbleibender Client zeigt den Spielstopp an.
- Mobile Ansicht bei 390 Pixeln Breite ohne horizontalen Überlauf.
- Keine JavaScript-Page-Errors im Testlauf.

Desktop- und Mobil-Screenshots wurden tatsächlich gerendert und visuell geprüft. Eine mobile Überlappung wurde dabei korrigiert.

## Verbindungsfehler und zusätzlicher Fallback

Nach einem fehlgeschlagenen Android-Beitritt wurden offizielle Trystero-Issues recherchiert und der Code zusätzlich über die Claude-CLI durch **Claude Opus 5.5** gegengeprüft. [Issue #204](https://github.com/dmotz/trystero/issues/204) beschreibt einen zu diesem Ablauf passenden Fehler in 0.25.4: veraltete Offers nach rund einer Minute können ohne ICE-Kandidaten bleiben. Auch [verzögerte Nostr-Beitritte](https://github.com/dmotz/trystero/issues/196) sind bekannt. Beide sind laut Maintainer in **0.26.0** behoben. Die Library wurde entsprechend aktualisiert. Ob genau dieser Fehler auf dem betroffenen Handy auftrat, ist nicht bewiesen; NAT-/Firewall-Probleme bleiben möglich.

Der Daten-Fallback wurde mit echten öffentlichen Diensten geprüft: Für einen Client wurden per Playwright sämtliche ICE-Kandidaten verhindert, zusätzlich wurden MQTT-WebSockets blockiert. Damit konnten Beitritt und eine komplette Hand inklusive synchronisierter Botverwaltung ausschließlich über verschlüsselte **Nostr-Datennachrichten auf Port 443** ausgeführt werden. Angezeigter Modus: **Relay-Verbindung · verschlüsselt**. Der Test lief ohne JavaScript-Page-Errors. Das ist kein bloßer Wechsel der Signaling-Relays: Tatsächlich die Spielnachrichten verwenden hier den alternativen Transport.

Ein vorheriger Lauf mit blockiertem WebRTC, aber erlaubten MQTT-WebSockets, bestand ebenfalls. Das absichtliche Blockieren des WebRTC-Transports wird im Testskript durch `iceTransportPolicy: relay` bei gleichzeitig leerer ICE-Serverliste erzwungen; eine lokale direkte Loopback-Verbindung ist damit nicht möglich.

Ein weiterer vollständiger Browserlauf verzögerte den zweiten Beitritt um **65 Sekunden** und blockierte beim beitretenden Client die Daten-Fallback-Endpunkte. Ergebnis: **P2P verbunden**, erfolgreiche gemeinsame Botverwaltung und abgeschlossene Hand, keine JavaScript-Page-Errors. Damit wurde der verzögerte Direktbeitritt mit 0.26.0 tatsächlich ausgeführt.

## Öffentliche Tischliste und optionale Passwörter

`node lobby-test.mjs` bestand mit unabhängigen Browser-Kontexten und echten öffentlichen Relays:

- Ein benannter Tisch wird auf der Startseite eines zweiten Browsers ohne Einladungslink gefunden.
- Passwortpflicht ist sichtbar; das Passwort erscheint nicht im URL-Fragment.
- Ein falsches Passwort erhält keinen Spielzustand; das richtige Passwort ermöglicht den Beitritt und ersetzt einen Bot.
- Freiwillig geschlossene Tische verschwinden aus einem zuschauenden Browser.
- Ein nicht gelisteter Tisch wird nicht öffentlich angezeigt.
- Ein offener Tisch kann ohne Passwort über die Liste betreten werden.
- Desktop und 390-Pixel-Mobilansicht wurden gerendert und visuell geprüft, ohne horizontalen Überlauf.
- Keine JavaScript-Page-Errors.

Der Ablauf bestand sowohl mit **P2P verbunden** als auch mit **Relay-Verbindung · verschlüsselt**. Für den zweiten Lauf waren WebRTC-Kandidaten bei allen Teilnehmern verhindert und MQTT-WebSockets blockiert; Tischliste, Passwortprüfung und Spielzustände liefen damit über die öffentlichen Port-443-Relays. Der bestehende vollständige Hand-/Botverwaltungs-Browsertest bestand ebenfalls erneut mit dem neuen Startbildschirm und blockiertem WebRTC.

## Aussagegrenzen

Alle automatisierten Browser liefen auf demselben Rechner und Internetanschluss. Ein Beitritt zum konkret vom Nutzer bereitgestellten Laptop-Raum war erfolgreich; der Nutzer bestätigte außerdem einen erfolgreichen Beitritt von einem weiteren PC. Das Android-Handy selbst ist nicht steuerbar und muss den veröffentlichten Fix noch praktisch bestätigen. Echte Mobilfunk-/Firewall-Kombinationen und Langzeitstabilität öffentlicher Relays wurden nicht getestet. Ein automatischer Reconnect nach echtem Netzwerkausfall wurde nicht erzwungen; geprüft wurden Peer-Verlassen und Host-Verlust. Keine automatische Hostmigration, keine Wiederherstellung nach Tab-Refresh. Die Vollauswertung aller 2.598.960 Fünfkartenkombinationen ist nicht Teil dieser Tests.
