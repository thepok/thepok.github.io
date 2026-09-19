# KINETIC 0.2.1 — zusätzliche Qualitätshinweise

Diese Hinweise ergänzen `BUILD.json` und den erfolgreichen CI-Lauf 35464183880.
Ein erfolgreicher Funktionscheck ist **kein** Beweis fehlerfreier Physik.

## Unterschied zwischen Messreihe und Browser-Einzelmessung

Die isolierten Node-Messreihen enthalten drei abwechselnde A/B-Paare pro Gebäude:
Art déco erreicht im Median 2,038×, Brutalismus 2,184× gegenüber KINETIC 0.1.
Der zusätzliche einzelne A/B-Durchlauf im Chrome-Bedienungstest erreichte dagegen
1,985× (98,5 Prozent mehr), nicht Faktor 2. Browser, Umgebung und Einzelmessungen
können abweichen. Die vollständigen Werte stehen in
`evidence/cache/art-deco/benchmark.json`, `evidence/cache/brutalist/benchmark.json`
und `evidence/speed-browser/verification.json`.

## Bekannter Fehler im sichtbaren Zusatztest

Im optimierten Live-Replay des Browserchecks trat ein einzelnes Fragment durch
den Boden. Es ist in `runs[1].live.outliers` der Browser-Prüfdatei aufgezeichnet:
ID -1002222, Position am Ende ungefähr [-14,30; -598,42; 20,05] m.
Das Testgebäude kollabiert sichtbar; 1.000 Trümmer sind vorhanden. Der Fehler
bleibt dennoch ein Fehler, nicht ein erlaubtes Qualitätsmerkmal.

Die beiden isolierten Beschuss-Presets bestehen ihre definierten Prüfungen auf
Bodenunterschreitung, Schadensmenge, Trümmer, Höhenverlauf und Geschwindigkeit.
Der sichtbare Test läuft dagegen im vollständigen Spiel mit vorhandenen Bäumen;
er ist deshalb als abweichendes Szenario protokolliert. Seine bisherigen
Assertions prüfen Steuerung, endliche Werte, Trümmerzahl und mittlere Resthöhe,
aber **nicht**, dass jeder einzelne Trümmerkörper oberhalb des Bodens bleibt.
Darum kann der Workflow erfolgreich sein und zugleich diesen Fehler enthalten.

## Reichweite der exakten Vergleichsprüfung

Die neuen Cache- und SIMD-Vergleichsänderungen liefern in den drei geprüften
Szenen nach jedem der 1.200 Schritte exakt dieselben erfassten Zustände wie
KINETIC 0.2. Das beweist, dass diese Änderungen dort keine neue Abweichung
hinzufügen; es beweist nicht, dass das Ausgangsmodell selbst fehlerfrei ist.

Gegenüber der vom Nutzer freigegebenen KINETIC 0.1 bleibt der dokumentierte
Zeitschrittkompromiss: große gewöhnliche Welten intern 60 statt 120 Hz;
Startup, kleine Welten und aktivierte Fahrzeugmotoren weiterhin 120 Hz.
Das ursprüngliche Spiel und die bisher freigegebene KINETIC-Version bleiben
unverändert. Diese Vorschau ist eine testbare Beschleunigung, keine universelle
Garantie doppelter Geschwindigkeit bei identischer Physikqualität.
