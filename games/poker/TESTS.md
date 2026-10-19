# Ausgeführte Prüfungen

Stand: 19. Oktober 2026. Windows, Node.js 24.18.0, Microsoft Edge über Playwright. Keine Netzwerksimulation und kein eigener Signaling-Server.

## Automatisiert

`npm test`: **17 bestandene Unit-Tests**:

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
- Verlassener Peer wird als offline angezeigt.
- Der Host verlässt den Raum; ein verbleibender Client zeigt den Spielstopp an.
- Mobile Ansicht bei 390 Pixeln Breite ohne horizontalen Überlauf.
- Keine JavaScript-Page-Errors im Testlauf.

Desktop- und Mobil-Screenshots wurden tatsächlich gerendert und visuell geprüft. Eine mobile Überlappung wurde dabei korrigiert.

## Aussagegrenzen

Alle Browser liefen auf demselben Rechner und Internetanschluss. Unterschiedliche externe Netze, Mobilfunk, restriktive NAT-/Firewall-Kombinationen und Langzeitstabilität öffentlicher Relays wurden nicht getestet. Ein echter automatischer Reconnect nach Netzwerkausfall wurde nicht erzwungen; geprüft wurden Peer-Verlassen und Host-Verlust. Keine automatische Hostmigration, keine Wiederherstellung nach Tab-Refresh. Die Vollauswertung aller 2.598.960 Fünfkartenkombinationen ist nicht Teil dieser Tests.
