# Grenzwacht — Schlacht an der Grenze

Statisches Echtzeit-Strategiespiel, Menschen oder Orks, gegen KI oder einen zweiten Spieler. Kein Backend, kein Build-Schritt, kein Account. `index.html`, ES-Module und `assets/` können direkt auf GitHub Pages oder einem anderen statischen Webserver liegen. Dateien wegen ES-Modulen über HTTP öffnen, nicht per `file://`.

## Spielen

Gebäude wählen und auf einen eigenen Bauplatz tippen. Truppen laufen und kämpfen automatisch auf zwei oder drei Wegen. Banken verzinsen vorhandenes Gold, Türme schützen einen Weg, Katapulte verursachen dreifachen Gebäudeschaden. Ein Schloss hat 6000 LP und eine eigene Verteidigung. Ziel ist das gegnerische Schloss.

Im Schloss gibt es neun Forschungen mit Voraussetzungen und Forschungszeit. Bogenschießen, Steinbau und Belagerung schalten Gebäude frei; Waffen, Rüstung und Logistik verbessern Einheiten/Produktion; Veteranen und Meister erlauben Stufe 2/3; Bankwesen hebt die Zinsobergrenze. Beide Seiten bezahlen dieselben Kosten. Die KI erhält keinen versteckten Geldbonus.

Jede Forschung hat ein großes eigenes Bildsymbol. Voraussetzungen verwenden dieselben Bilder, erledigte Forschungen zeigen einen Haken, gesperrte ein Schloss. Die Lautsprechertaste erklärt die Wirkung mit einfachen deutschen Sätzen, ohne Forschung zu kaufen. Dafür wird die Vorlesestimme des Browsers genutzt; die Verfügbarkeit und Offlinefähigkeit hängt von Browser und installierter Stimme ab. Erwachsene können die Beschreibungen weiterhin lesen.

Vor Beginn sind Schwierigkeit und Einkommensfaktoren (50–150 %) einstellbar. Jede Partie würfelt Einheit-LP, Schaden, Tempo sowie Gebäude-LP und Produktionsintervalle innerhalb ±15 %. Die Werte sind für beide Fraktionen gleich und bleiben fest. Tatsächliche Werte stehen in den Gebäude-Beschreibungen; die Schlachtkennung steht in der Hilfe. Kosten, Reichweiten und Forschung sind konstant. Eine typische aktive Partie dauert etwa 5–10 Minuten; frühe Niederlagen sind möglich. Nach 10 Minuten beginnt Schlossverfall.

Am Handy: kurzer Tipp zum Bauen/Auswählen, Ziehen zum Verschieben, zwei Finger zum Zoomen. Am PC: Ziehen und Mausrad. +/− und Übersicht funktionieren auf beiden. Ein Gebäudetipp erlaubt Upgrades oder Verkauf mit Bestätigung. Pause: Schaltfläche/Leertaste. Tab-Wechsel pausiert automatisch. Hochformat zeigt das eigene Gebiet unten.

## Technik und Prüfung

`engine.js` ist eine feste 20-Hz-Simulation mit serialisierbarem Zustand und geprüften Befehlen. `renderer.js` zeichnet die Karte und Sprites; `app.js` übernimmt Bedienung und Taktung. Native Canvas/WebCrypto/Pointer-APIs. Keine Laufzeitbibliotheken. Google Fonts sind optional; lokale Schrift-Fallbacks bleiben nutzbar. Imagegen-Sprites samt Prompts liegen unter `assets/`.

`npm ci` installiert ausschließlich Testwerkzeuge. `npm test` prüft Spielregeln, Forschung, Zufallswerte, Formationen und komplette KI-Partien. `node tests/browser.mjs` prüft einen bereits laufenden statischen Server (Standard `http://127.0.0.1:5192/`, überschreibbar mit `TEST_URL`) mit installiertem Microsoft Edge. Browserprüfung umfasst tatsächliche Touch-/Pinch-Ereignisse, Bauen, Forschung, Verkauf, Pause, Zoom, Neustart und eine komplette Partie. Ergebnisse liegen im ignorierten Verzeichnis `evidence/`.

Testzugriff auf Zustand und Zeitfortschritt wird nur mit `?test=1` aktiviert. Multiplayer verwendet die getrennte Befehlssimulation und die unten beschriebene Verbindungstechnik. Kein Speichern/Fortsetzen nach Neuladen. Das Balancing ist eine erste spielbare Fassung.

Die Karte umfasst 3420 × 2280 Weltpunkte (rund zehnfache ursprüngliche Fläche) und je Seite 20 Bauplätze bei zwei Wegen (Standard) oder 30 bei drei Wegen. Alle Bedienelemente liegen über der Karte. Minikarte, Heimat-Taste und Übersicht helfen bei der Navigation. Die äußeren Wege münden vor dem Schloss in echte Angriffswege; Treffer benötigen tatsächliche Reichweite. Gebäude der Stufen 2 und 3 besitzen eigene Grafiken, die Landschaft verschiedene Baumarten, Felsen und Büsche. Der Forschungsbutton öffnet den Baum jederzeit; erfolgreicher Forschungsstart schließt ihn automatisch.


## Multiplayer

Auf dem Startbildschirm „Gegen Freunde“ wählen. Beide Spieler wählen ihr Volk unabhängig: Menschen/Menschen, Menschen/Orks, Orks/Menschen und Orks/Orks. Völker verwenden dieselben Spielregeln; Team Blau/Rot, Flaggen und Einheitenringe unterscheiden die Seiten. Der Gastgeber steuert links/Blau, der Gast rechts/Rot. Die Heimat-Taste führt zum eigenen Gebiet, auch auf dem Handy. Die Einkommensregler auf dem Startbildschirm bestimmen die Faktoren beider Spieler.

Eine Partie erhält einen Namen, optional ein Passwort und kann öffentlich gelistet oder nur per Einladungslink erreichbar sein. Passwörter stehen niemals im Link oder Verzeichnis. Der Gastgeber wählt zwei oder drei Wege. Der Gast wählt sein Volk; ein Klick auf eine offene Partie verbindet direkt, bei geschützten Partien wird zuerst das Passwort abgefragt; danach startet die Runde automatisch. Eine volle Partie verschwindet aus der Liste. Verwaiste Anzeigen laufen nach 35 Sekunden ab. Die öffentliche Liste liegt kurzzeitig bei den verbundenen Browsern und wird durch öffentliche Relays verteilt; kein eigener Server und keine dauerhafte Datenbank.

Trystero 0.26.0 baut einen WebRTC-Datenkanal auf. Falls dieser scheitert oder ausfällt, nutzen dieselben Spielnachrichten den AES-GCM-verschlüsselten Relay-Fallback aus der Poker-App mit eigenem Grenzwacht-Namensraum. Öffentliche Dienste: MQTT über `broker.emqx.io:8084/mqtt`, `test.mosquitto.org:8081/mqtt`, außerdem Nostr `nostr-relay.corb.net` und `nos.lol`. Ihre Verfügbarkeit und Laufzeiten sind nicht garantiert. Ohne Passwort liefert die Raumkennung das Schlüsselmaterial; bei öffentlichen Partien ist diese öffentlich. Ein Passwort schützt den Raum über PBKDF2. Das ist ein Freundschaftsspiel mit vertrauenswürdigem Gastgeber, kein manipulationssicheres Wettkampf-System.

`net-core.js` verarbeitet autorisierte Befehle beider Seiten in einer festen 20-Hz-Simulation, ohne KI. Der Gastgeber sendet alle 200 ms kleine nummerierte Schrittfolgen mit Befehlen; keine permanenten großen Vollbilder. Der Gast bestätigt die empfangene Simulationsposition. Wiederholte und umsortierte Pakete werden abgeglichen, doppelte Befehle nicht doppelt berechnet. Bei größeren Lücken oder einer Abweichung der sekündlichen Prüfsummen erfolgt ein vollständiger Spielstandsabgleich. Angezeigte Millisekunden sind gemessene Rundlaufzeit; die Befehls- und Darstellungslatenz enthält zusätzlich den Simulationspuffer.

Beide Spieler können pausieren. Tabwechsel pausiert die gemeinsame Partie. Ein Verbindungsverlust wird nach ungefähr fünf Sekunden erkannt; danach bleibt sie bis zur Wiederverbindung und manuellen Fortsetzung pausiert. Der Gastgeber muss seinen Tab geöffnet lassen. Kein Gastgeberwechsel, keine Wiederaufnahme nach Neuladen oder Schließen eines Tabs. Verlassen und neue Partie sind über den Verbindungsbutton erreichbar. Solo bleibt ohne Verbindungsaufbau spielbar.

Die Quellen der aus Poker übernommenen Transporthelfer liegen in `network-source/`; `npm run build:network` erzeugt die mitgelieferten statischen ES-Module in `vendor/`. Zum Spielen ist kein Build erforderlich. Nach Änderungen an den Netzwerkquellen müssen diese Dateien neu erzeugt werden. `node tests/multiplayer.mjs` prüft zwei getrennte Browser-Kontexte mit öffentlichen Relays, öffentlicher Spielliste, Passwortschutz, gleichen Völkern, beidseitigen Befehlen, identischen Spielständen, P2P-Ausfall mit Relay-Fallback, Pause und Fortsetzung. `RELAY_ONLY=1` erzwingt im Test den Relay-Pfad. `TEST_URL` kann auf die veröffentlichte Seite zeigen.

## Bildgrößen

Zur Laufzeit werden ausschließlich WebP-Bilder geladen (Qualität 82, originale Pixelabmessungen, unveränderter verlustfreier Alphakanal). Die Bilddaten sinken dadurch von 15,91 MB auf 2,96 MB (81,4 % weniger). PNG-Dateien bleiben als Bearbeitungsoriginale erhalten, werden vom Spiel aber nicht angefordert. Die Sprite-Koordinaten und Animationen bleiben dadurch unverändert. Neue Bildfassungen lassen sich mit Pillow über `Image.open(source).convert("RGBA").save(target, "WEBP", quality=82, method=6, exact=True)` erzeugen.

Nahkämpfer wählen freie Positionen am Ziel und weichen dicht stehenden Einheiten seitlich aus. Die gleiche deterministische Bewegung gilt für beide Seiten. Multiplayer-Protokoll 2 verlangt auf beiden Geräten dieselbe Spielversion; nach einem Update beide Seiten neu laden.

Während ein Menü geöffnet ist, bleibt die verdeckte Kartenzeichnung stehen. Die Simulation sowie Gold und Forschung laufen weiter. Das Forschungsfenster verzichtet auf den Hintergrund-Weichzeichner, damit Scrollen auf Mobilgeräten weniger Zeichenarbeit auslöst.
