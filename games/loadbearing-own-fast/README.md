# KINETIC 0.2.1 — Physik-Benchmark und Performance-Vorschau

[Optimiertes vollständiges Spiel](https://thepok.github.io/games/loadbearing-own-fast/)

[Referenzmodus mit eingefrorenem KINETIC-0.1-Kern](https://thepok.github.io/games/loadbearing-own-fast/?kernel=reference)

[Unveränderte, bisherige KINETIC-Version](https://thepok.github.io/games/loadbearing-own/)

Es ist weiterhin das vollständige LOAD BEARING mit eigener C++/WebAssembly-Physik.
Keine Jolt-Abhängigkeit, kein Jolt-Fallback und keine vereinfachte Turm-Demo.

## Den Benchmark bedienen

Oben im bestehenden Spiel **Benchmark** öffnen; auf schmalen Displays befindet
sich die Schaltfläche im vorhandenen Aktionsmenü. Szene und Wiederholungen wählen,
dann **A/B-Test starten**. Angeboten werden Art déco, Brutalismus, ein unbelastetes
Referenzgebäude und der aktuelle Bauplan. Drei Wiederholungen wechseln A/B, B/A,
A/B ab. Ein einzelner Vergleich eignet sich zum Ausprobieren, nicht zur Bestimmung
kleiner Leistungsunterschiede.

Jeder Lauf erstellt eine neue Physikwelt. Für die beiden Einsturz-Presets sind
Bauplan, Seed, 1.000 Bauteile, 1.000 physische Trümmerplätze und fünf Schüsse fest.
Nach Vorbereitung und Aufwärmen werden 20 simulierte Sekunden gemessen, inklusive
Einschlägen, Einsturz und anschließender Trümmerbewegung. Die laufende Spielwelt
und ihr Renderer werden für die isolierte Messung pausiert und danach — auch bei
Abbruch — wieder freigegeben. Ein bereits pausiertes Spiel bleibt pausiert.

Das Ergebnis zeigt mittlere und p95-Schrittzeiten, Median und Spannweite des
gepaarten Durchsatzverhältnisses, getrennte Phasen, Schäden, Trümmer und tatsächlich
ausgeführte interne Schritte. **Messdaten exportieren** liefert JSON mit allen
Einzelschrittzeiten, Konfiguration, Kern-Hashes und Zustandsverläufen.

**Aktuelles Gebäude zurücksetzen + beschießen** ist die sichtbare Variante im
normalen Spiel. Sie benötigt eine laufende Sandbox. Sie setzt diese Welt zurück,
verwendet den vorhandenen Bauplan und die gleiche Schussfolge und lässt anschließend
normales Weiterspielen zu. Zusätzliche Eingriffe, vorhandene Fahrzeuge, Spieler
oder Bäume werden als Abweichungen vom kontrollierten Szenario protokolliert.
Dieser sichtbare Test ist keine isolierte A/B-Zeitmessung.

## Was schneller gemacht wurde

* Explizite SIMD-Vektorrechnung und parallele konvexe Projektionen in WebAssembly.
* Zwischenspeicherung von transformierten Kollisionsformen und Kontaktantworten,
  statt derselben Rechnungen in jeder Solveriteration.
* Eine aktualisierte räumliche Suchhierarchie für Körperpaare; gleiche relevante
  Kollisionsformen und weiterhin Kontakte zwischen einzelnen Bauteilen.
* Kompakte Listen aktiver Verbindungen, günstigere Trägheitsrechnung und weniger
  unnötige JavaScript-Arbeit bei wenigen Geschossen.

**Der Qualitätskompromiss ist ausdrücklich Teil dieser Version:** Große normale
Welten laufen intern mit maximal 1/60 s pro Teilschritt statt zuvor 1/120 s.
Vorbereitung, kleine präzise Szenen und aktivierte Fahrzeugmotor-Gelenke verwenden
weiterhin 1/120 s. Das ist nicht ausschließlich eine mathematisch identische
Codeoptimierung. Die externen Spielschritte bleiben unverändert. Der Benchmark
weist die tatsächliche interne Schrittzahl beider Kerne aus.

Bauteilanzahl, individuelle sechs Freiheitsgrade, ursprüngliche Bruchgeometrien,
Materialparameter, Trümmerlimit und eingestellte Solver-Iterationszahlen wurden
nicht verringert. Die Kollisionsprüfung berücksichtigt schnelle, dünne Trümmer
vor ihrem Durchtritt durch große statische Bodenflächen. Andere extreme Szenen
sind damit nicht automatisch bewiesen fehlerfrei.

## Qualität und Messgrenzen

Die Vergleichsprüfung verlangt identische Eingangskonfigurationen und ausschließlich
endliche Zustände. Zusätzlich gelten für Einsturz-Presets: höchstens 15 Prozent
Abweichung der abschließenden Bruchzahl, 5 Prozent bei Trümmern, 2 m bei mittlerer
Resthöhe und 6 m maximaler Differenz des mittleren Höhenverlaufs. Bodenunterschreitung
und verbleibende Geschwindigkeiten haben gesonderte Grenzwerte. Ein unbelastetes
Referenzgebäude darf sich nicht selbst zerstören. Grenzen und Einzelentscheidungen
stehen im exportierten JSON und im lesbaren `src/benchmark/suite.ts`.

Diese **Aggregat-Prüfungen beweisen keine visuell identischen Einstürze**. Der
60-Hz-Modus kann Bruchreihenfolge, Lastspitzen und Trümmerbahnen ändern. Die beiden
Kerne bleiben deshalb direkt auswählbar. Vergleiche auch den sichtbaren Einsturz
mit dem alten Kern und deinen eigenen Gebäuden.

Die Zeiten umfassen `Simulation.step` und Geschosserzeugung; Initialisierung,
Vorspannen, Aufwärmen, Messprotokollierung, Snapshots, Rendering und Wartezeit sind
nicht Teil der einzelnen Schrittzeiten. Der ausgewiesene Faktor betrifft den
**Physikdurchsatz, nicht die Render-FPS oder eine garantierte Gesamtspielrate**.
Er gilt für die angegebenen Szenen und das jeweilige Gerät. Bei aktiven Fahrzeugen
bleibt der feinere Teilschritt erhalten; dort ist derselbe Faktor nicht zugesichert.

## Neue Optimierungen ohne weitere Qualitätsreduktion

Die Version 0.2.1 berechnet unveränderte Winkel, Trägheitsterme und Massenverhältnisse
innerhalb der Geschwindigkeitsiteration nur einmal. Die sechs Bounding-Box-
Vergleiche laufen parallel in SIMD, mit denselben Ungleichungen und Rundungen.
Zeitschritt, Iterationszahlen, Material, Einzelkörper, Geometrie und Trümmergrenzen
werden gegenüber Version 0.2 nicht verändert.

Zusätzlich zur Qualitätsprüfung gegen die ursprüngliche KINETIC-Version wurde
Version 0.2.1 gegen Version 0.2 nach **jedem einzelnen Simulationsschritt** geprüft:
Positionen, Drehungen, lineare/Winkelgeschwindigkeiten, Aktivität, Bruchzustände,
Spannungen und Schadensakkumulatoren sind in beiden Einsturzszenen und der
Ruheprobe exakt gleich. Das gilt für diese geprüften Szenen, nicht pauschal für
alle möglichen Gebäude. Der bereits beschriebene 60/120-Hz-Unterschied zur
ursprünglichen Version 0.1 bleibt ausdrücklich bestehen.

## Nachprüfbare Ergebnisse

Drei abwechselnde A/B-Paare pro Szene, 1.000 Originalteile, 1.000 Trümmerplätze,
fünf feste Schüsse, 20 simulierte Sekunden. Referenz ist der eingefrorene,
zuvor freigegebene KINETIC-0.1-Kern, nicht Jolt. Jeder Vergleich läuft auf demselben
Rechner. Unterschiedliche Szenen können unterschiedliche CI-Rechner verwenden.

| Gebäude | Referenz ms/Schritt | Optimiert ms/Schritt | Median Durchsatz | Spanne |
|---|---:|---:|---:|---:|
| art-deco | 29.01 | 14.02 | 2.04× | 2.03–2.07× |
| brutalist | 41.03 | 18.61 | 2.18× | 2.10–2.21× |

Zeiten sind Mediane der drei Laufmittel; der Faktor ist der Median der gepaarten
Verhältnisse. Beide getesteten Presets überschreiten Faktor 2 im Median. Keine
Garantie für jedes Gerät, aktive Fahrzeuge, jedes Gebäude oder die Render-FPS.

`BUILD.json` nennt die getesteten Kerne und Prüfläufe. `evidence/cache/` enthält
alle Einzelzeiten, Phasen, Konfigurationen und die exakten Schrittvergleiche.
`evidence/speed-browser/` enthält Tests und Screenshots der echten Benutzeroberfläche,
Abbruch, Export, Mobilansicht und sichtbaren Einstürze. Ausgeliefert werden dieselben
WASM-Bytes, die gemessen wurden.

## Spielstände und Quellcode

Diese Vorschau schreibt ausschließlich unter `loadbearing-own-fast.*`. Deine
bisherigen KINETIC-Spielstände und die alte Jolt-Version bleiben unberührt. Bauten
lassen sich mit dem vorhandenen Export/Import übernehmen. Die beiden Kernmodi
innerhalb dieser Vorschau teilen deren eigene Spielstände.

`source.zip` enthält das komplette bearbeitbare Spiel, beide Physikkerne, lesbare
C++-/TypeScript-Quellen, Tests und Lockdatei. Der Referenzkern ist die unveränderte
WASM-Datei der freigegebenen Version; die Referenzquellen liegen zusätzlich unter
`reference-engine/`. Der optimierte Kern lässt sich ohne Fremdphysik neu bauen:

```sh
npm ci
npm run build
npm test
npm run bench:physics -- --repeats 3 --presets art-deco,brutalist --out artifacts/results.json
# Optional: Fehlerstatus, wenn ein Preset den Faktor 2 im Median nicht erreicht.
npm run bench:physics -- --repeats 3 --presets art-deco,brutalist --require-2x
# Clang/LLD 18: nur den eigenen optimierten WASM-Kern neu kompilieren.
bash build-own-kernel.sh
```

Die native Engine benötigt WebAssembly/SIMD und reserviert 128 MiB pro Welt.
Benchmark und Spiel verwenden getrennte Worker. Beide native Module haben keine
WebAssembly-Runtime-Imports und laden keine andere Physikengine.
