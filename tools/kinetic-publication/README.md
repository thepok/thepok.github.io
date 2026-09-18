# LOAD BEARING / KINETIC — eigene Physik im vollständigen Spiel

[Spiel mit eigenem Physikkern öffnen](https://thepok.github.io/games/loadbearing-own/)

**Experimentelle Vollspiel-Integration, kein Jolt-Tuning und keine separate Turm-Demo.**
KINETIC ist eine neue C++17/WebAssembly-Implementierung. Das Spiel lädt weder Jolt
noch Rapier, Bullet, Ammo, Cannon oder einen anderen Physiksolver. Es gibt keinen
versteckten Rückfall auf Jolt. Three.js bleibt ausschließlich der bisherige Renderer.
Der Physikkern hat keinerlei WebAssembly-Imports und wird ohne Physikbibliotheken
mit Clang gebaut. `evidence/engine-audit.json` dokumentiert das tatsächlich gebaute
Modul, seinen Hash, die Imports und ausgelieferten Assets.

## Was erhalten bleibt

Die ursprüngliche GUI und das ursprüngliche Rendering, Gebäudeeditor und
Baupläne, Gebäudegeneratoren, Material- und Bruchgeometrien, Glas, Bewehrung,
Geschosse, Fahrzeuge, Gehmodus, Naturkräfte und Spielaufgaben sind weiterhin im
vollständigen Spiel enthalten. Die Testauswahl in `evidence/regressions/` und der
Browsertest dokumentieren die konkret überprüften Funktionen; nicht jede mögliche
Kombination ist bereits geprüft. Sämtliche ursprünglichen Bauteile bleiben eigene
Physikkörper mit sechs Freiheitsgraden. Es gibt keine starren Ersatzgeschosse.

## Was neu geschrieben wurde

* Starrkörperintegration mit Masse, Schwerpunkt, Trägheit, Impulsen und Drehung.
* Kollisionserkennung für Boxen, Kugeln, konvexe Fragmente und zusammengesetzte
  Bauteile; Kontaktpunkte, Reibung und Rückprall; räumliche Vorauswahl und Ruheinseln.
* Eigene Gelenke, Motoren, feste Verbindungen, nachgebende Winkelgrenzen und
  Distanzverbindungen. Größere starre Verbindungsgraphen werden gemeinsam durch
  einen matrixfreien vorkonditionierten iterativen Solver gelöst, ohne Bauteile
  zusammenzufassen. Kontakte und nichtlineare Verbindungen werden gekoppelt iteriert.
* Schnelle Kugelkontakte entlang des Flugwegs, Strahlenabfragen, ein eigener
  Geh-/Treppen-Kollisionskörper mit Reaktionsimpulsen sowie Zustandswiederherstellung.

Das vorhandene Spiel entscheidet weiterhin über Betonbruch, Materialschäden und
Bewehrung, jetzt anhand der Ergebnisse des eigenen Solvers. Trümmer sind dynamische
Körper, die andere Körper berühren und Lasten in den Verbindungsgraphen auslösen.
Die Unterteilung der originalen Bruchgeometrien wurde nicht ersetzt.

Die Kompatibilitätsschicht verwendet an einigen Stellen Methodennamen wie
`JoltInterface` oder `SixDOFConstraint`, weil das Spiel diese Schnittstelle aufruft.
Diese Namen zeigen auf **eigene Klassen**, nicht auf eine eingebundene Fremdengine.
Der eigenständige Kern ist unter `engine-source/` und im vollständigen `source.zip`
lesbar. Der Shader-/Renderingcode ist nicht Bestandteil der Physik-Eigenentwicklung.

## Stand und Grenzen

**Noch keine Behauptung gleicher Qualität oder eines allgemeinen Geschwindigkeits-
Sieges über Jolt.** Die Eigenentwicklung hat andere numerische Eigenschaften;
Bruchreihenfolge, Schadensmenge, Kontaktreaktion und Fahrzeugbewegung können abweichen.
In den bisherigen lokalen gepaarten Versuchen war die mittlere Rechenzeit etwas
niedriger, die p95-Schrittzeit jedoch höher und die Zerstörung teilweise deutlich
stärker. Solche Werte sind kein qualitätsgleicher Benchmark. Die veröffentlichten
Tests sind eine funktionale Freigabe zur Erprobung, kein Nachweis vollständiger
Gleichwertigkeit oder physikalischer Genauigkeit.

Der Kern läuft derzeit in **einem** Physik-Worker ohne zusätzliche Solverthreads,
mit maximal 1/120 s großen internen Teilschritten. Sein linearer Speicher ist
auf 128 MiB pro Welt festgelegt. Geometrie- und Kontaktkapazitätsüberschreitungen
lösen Fehler aus, statt still Bauteile zu entfernen. Räder haben einen glatten
Laufflächenkontakt auf ebenen Flächen, aber eine polygonale Randdarstellung.
Kontinuierliche native Kollisionsprüfung ist auf Kugeln spezialisiert; die
bestehende vorgelagerte Entkopplung von Gebäudegeschossen als Projektil bleibt.
Beliebige extreme Bauwerke, Kontaktstapel und alle mobilen Geräte benötigen weitere
Prüfungen. Diese erste Integration ist **nicht die stabile Standardversion**.

## Spielstände und Bedienung

Bedienung wie im ursprünglichen Spiel. Das vorhandene Engine-Label zeigt
`KINETIC · own WASM`. Die Vorschau verwendet eigene Schlüssel `loadbearing-own.*`.
Die Originalspielstände unter `loadbearing.*` bleiben unberührt; eigene Gebäude
können mit dem bestehenden Export/Import übertragen werden.

[Unverändertes Originalspiel](https://thepok.github.io/games/loadbearing/)

## Tests / reproduzierbarer Build

`BUILD.json` nennt den geprüften Commit und CI-Lauf. `evidence/browser/` enthält
Screenshots, angeforderte URLs und das Ergebnis des echten Browsertests mit
1.000 Bauteilen, Begehung, Fahrzeugen, Neustart und einem vollständigen Einsturz.
`evidence/regressions/` enthält die ausgeführten ursprünglichen Spieltests.

Die Fahrzeugprüfungen korrigieren zwei veraltete Annahmen: Recycling muss explizit
aktiviert sein; der Kanonentest prüft den tatsächlich zerbrochenen Wandkörper und
physische Fragmente, statt verlorene Verbindungen zu verlangen. Verbindungen können
beim lokalen Bruch vollständig auf überlebende Fragmente übertragen werden. Der
separate Test auf einen einzelnen erfolgreichen Kanonenschuss bleibt erhalten.

Im vollständigen Quellarchiv:

```sh
npm ci
npm run build
npm test
# Eigene native Engine neu bauen: Clang/LLD 18 erforderlich.
bash build-own-kernel.sh
```

Original-Quellarchiv und Renderer bleiben getrennt von dieser Vorschau erhalten.
Ein Browser ohne WebAssembly/SIMD kann diese experimentelle Engine nicht starten;
er erhält ausdrücklich keine als Eigenentwicklung ausgegebene Ersatzengine.
