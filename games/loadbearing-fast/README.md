# LOAD BEARING — vollständige Performance-Vorschau

[Optimiertes vollständiges Spiel](https://thepok.github.io/games/loadbearing-fast/)

[Identische Oberfläche mit Referenzphysik](https://thepok.github.io/games/loadbearing-fast/?physics=reference)

[Unveränderte veröffentlichte Originalversion](https://thepok.github.io/games/loadbearing/)

Dies ist das vollständige Originalspiel, **nicht** der vereinfachte Turm-Prototyp.
GUI, Renderer, Gebäudeerzeugung, Bauteilgeometrien und Materialmodell bleiben erhalten.
Keine starren Ersatzstockwerke, kein kleineres Trümmerlimit, keine geringere
Simulationsfrequenz und keine reduzierten Solver-Iterationen.

## Änderungen unter der Haube

Der bewährte Jolt-Kontaktsolver bleibt die Grundlage. Dazu kommen ein angepasster
nativer Build (Distribution/SIMD, optimierte Bindings), gemeinsame native Abfragen
von Posen und Verbindungsimpulsen sowie wiederverwendete Transferpuffer. Vollständig
starre Verbindungen in großen Sandbox-Gebäuden verwenden einen spezialisierten
Fixed-Constraint. Bei plastischem Nachgeben wechselt jede solche Verbindung zurück
zum vollständigen SixDOF-Constraint mit ihren ursprünglichen Anschlusskoordinaten.
Alle einzelnen Bauteile und der vollständige Verbindungsgraph bleiben bestehen.
Kleine Gebäude und Herausforderungen behalten ihre bisherigen Constraint-Typen.

Die Umschaltung verliert einmalig einen Solver-Warmstart. Deshalb können sich
Bruchreihenfolge und einzelne Trümmerbahnen etwas unterscheiden; mathematische
Identität wird nicht behauptet. Falls der optimierte native Build im Browser nicht
startet, bleibt die vollständige Originalphysik als Fallback verfügbar.

Außerdem wurde ein bestehender Speicherlebensdauerfehler bei ausgeliehenen nativen
ShapeResult-Objekten korrigiert. Diese Korrektur ist auch im Referenzmodus aktiv.

## Gemessener Vergleich

1.000 Originalbauteile, jeweils derselbe Bauplan und vier fest getaktete Einschläge,
600 Schritte zu 1/60 s, gleiches Trümmerlimit 500. Chrome mit drei Physikthreads,
AMD EPYC 7763 auf einem GitHub-Runner; WebGL2-Rendering war aktiv.

| Gebäude | Referenz ms/Schritt | Optimiert ms/Schritt | Physikdurchsatz |
|---|---:|---:|---:|
| brutalist | 26.73 | 21.58 | 1.24× |
| art-deco | 29.30 | 22.59 | 1.30× |

Das sind Einzelmessungen desselben CI-Laufs, keine garantierten FPS-Gewinne und
keine Statistik über verschiedene PCs. Der Vorteil kann je nach Browser, Hardware,
Bauwerk und Einsturzphase anders ausfallen. Die maximal mögliche Gesamtbeschleunigung
hängt außerdem vom Rendering ab. Kein universeller Sieg über Jolt wird behauptet.

Vollständige Rohwerte, Schadensverläufe, identische Baupläne, Screenshots und
Regressionsergebnisse liegen unter `evidence/`; die Metadaten unter `BUILD.json`.

## Funktionsprüfungen

Geprüft wurden das vollständige Original-GUI im Desktopbrowser, großer Beschuss,
Glasbruch, Beton/Bewehrung, lokale Bruchkörper, Werkzeuge und Begehung, Fahrzeuge,
Neustart, Materialänderungen, Bauen im laufenden Betrieb, Speicherwiederverwendung,
bewegte Gebäudegeschosse als Projektile sowie die mobile Darstellung. Native
Posen und Impulsabfragen wurden gegen die ursprünglichen Float32-Getter verglichen.
Nicht jede denkbare Kombination wurde getestet.

Ein alter Fahrzeugtest musste Recycling ausdrücklich einschalten, weil das
veröffentlichte Spiel es bereits optional macht. Einige weitere ältere, außerhalb
dieses Prüfpakets liegende Tests sind auch im unveränderten Original fehlerhaft
(z. B. veraltete Fragmenterwartungen und ein bereits scheiterndes Steinschlag-
Kampagnenlayout). Diese Vorschau repariert nicht die gesamte historische Testsuite.

## Spielstände und Vergleich

Die Vorschau schreibt ausschließlich eigene Spielstände unter
`loadbearing-fullfast.*`; `loadbearing.*` bleibt unberührt. Vorhandene Bauten
lassen sich mit dem unveränderten Export/Import übertragen. Optimierter und
Referenzmodus teilen die Vorschau-Spielstände, nicht die des Originalspiels.
Zum fairen Vergleich denselben Bauplan, dieselbe Trümmergrenze und dieselben
Geschossparameter verwenden. Referenz- und optimierte Version nacheinander
laufen lassen, nicht gleichzeitig um CPU-Zeit konkurrieren lassen.

## Quellcode und reproduzierbarer Build

`source.zip` enthält das komplette bearbeitbare Spiel, die eingebundenen nativen
Module und ursprüngliche Lockdatei. Node.js 22+, `npm ci`, `npm run build`.
Die nativen Erweiterungen und ihr gepinnter CI-Build liegen unter
`native-build/` im Archiv. Die binären Module wurden mit JoltPhysics.js 1.1.0
(c9c122bcd48e92885fbee7d267c928c3781d581c), Jolt 5.6.0 und Emscripten 6.0.2
gebaut. Drittanbieterhinweise sind in `THIRD-PARTY-LICENSES.txt` enthalten.
