# Grenzwacht — Chronik der drei Brücken

Statisches Echtzeit-Strategiespiel, Menschen gegen Orks (KI). Kein Backend, kein Build-Schritt, kein Account. `index.html`, ES-Module und `assets/` können direkt auf GitHub Pages oder einem anderen statischen Webserver liegen. Dateien wegen ES-Modulen über HTTP öffnen, nicht per `file://`.

## Spielen

Gebäude wählen und auf einen eigenen Bauplatz tippen. Truppen laufen und kämpfen automatisch auf drei Wegen. Banken verzinsen vorhandenes Gold, Türme schützen einen Weg, Katapulte verursachen dreifachen Gebäudeschaden. Ein Schloss hat 6000 LP und eine eigene Verteidigung. Ziel ist das gegnerische Schloss.

Im Schloss gibt es neun Forschungen mit Voraussetzungen und Forschungszeit. Bogenschießen, Steinbau und Belagerung schalten Gebäude frei; Waffen, Rüstung und Logistik verbessern Einheiten/Produktion; Veteranen und Meister erlauben Stufe 2/3; Bankwesen hebt die Zinsobergrenze. Beide Seiten bezahlen dieselben Kosten. Die KI erhält keinen versteckten Geldbonus.

Vor Beginn sind Schwierigkeit und Einkommensfaktoren (50–150 %) einstellbar. Jede Partie würfelt Einheit-LP, Schaden, Tempo sowie Gebäude-LP und Produktionsintervalle innerhalb ±15 %. Die Werte sind für beide Fraktionen gleich und bleiben fest. Tatsächliche Werte stehen in den Gebäude-Beschreibungen; die Schlachtkennung steht in der Hilfe. Kosten, Reichweiten und Forschung sind konstant. Eine typische aktive Partie dauert etwa 5–10 Minuten; frühe Niederlagen sind möglich. Nach 10 Minuten beginnt Schlossverfall.

Am Handy: kurzer Tipp zum Bauen/Auswählen, Ziehen zum Verschieben, zwei Finger zum Zoomen. Am PC: Ziehen und Mausrad. +/− und Übersicht funktionieren auf beiden. Ein Gebäudetipp erlaubt Upgrades oder Verkauf mit Bestätigung. Pause: Schaltfläche/Leertaste. Tab-Wechsel pausiert automatisch. Hochformat zeigt das eigene Gebiet unten.

## Technik und Prüfung

`engine.js` ist eine feste 20-Hz-Simulation mit serialisierbarem Zustand und geprüften Befehlen. `renderer.js` zeichnet die Karte und Sprites; `app.js` übernimmt Bedienung und Taktung. Native Canvas/WebCrypto/Pointer-APIs. Keine Laufzeitbibliotheken. Google Fonts sind optional; lokale Schrift-Fallbacks bleiben nutzbar. Imagegen-Sprites samt Prompts liegen unter `assets/`.

`npm ci` installiert ausschließlich Testwerkzeuge. `npm test` prüft Spielregeln, Forschung, Zufallswerte, Formationen und komplette KI-Partien. `node tests/browser.mjs` prüft einen bereits laufenden statischen Server (Standard `http://127.0.0.1:5192/`, überschreibbar mit `TEST_URL`) mit installiertem Microsoft Edge. Browserprüfung umfasst tatsächliche Touch-/Pinch-Ereignisse, Bauen, Forschung, Verkauf, Pause, Zoom, Neustart und eine komplette Partie. Ergebnisse liegen im ignorierten Verzeichnis `evidence/`.

Testzugriff auf Zustand und Zeitfortschritt wird nur mit `?test=1` aktiviert. Multiplayer/Relays sind bewusst noch nicht enthalten; Befehle und Simulation sind dafür getrennt. Kein Speichern/Fortsetzen nach Neuladen. Das Balancing ist eine erste spielbare Fassung.
