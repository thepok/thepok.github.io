# Jazz: Abstand zu professioneller musikalischer Wirkung

Geprüfter Stand: veröffentlichter Commit 9d4de59e, web9-jazz-1/quartet-2.
Drei unabhängige Reviews untersuchten Komposition, Ensemble und Produktion.
Grundlage: alle 48 Startpläne, vertiefte Noten-/Formanalysen mehrerer Stücke,
gezielte Änderungen als Abhängigkeitstest und vorhandene Audio-Renderanalysen.
Es wurde kein direkter Hörvergleich mit professionellen Aufnahmen durchgeführt.

## Hero Sax ist bereits ausdrucksvoll angesteuert

In allen 48 Startstücken sind Automationsspuren für Luft/Lautstärke, Mikrofon-
Klangfarbe, Nahbesprechung, Hallanteil, Pan, Pitchbend und Vibrato vorhanden.
Der Spieler verwendet Atempausen, Legato und Timing-Abweichungen. Die Bewegung
wird klanglich simuliert, nicht als vollständiges physikalisches Mikrofonmodell.
Dopplung, automatische Ducking-/Carving-/Ride-Effekte und Echo-Throws sind im
Quartett ausgeschaltet; die Spiel- und Mikrofonbewegungen bleiben aktiv.
Nachweis: humanization-audit.json und tatsächlich kompilierte Bankdateien.

## Die wichtigsten Unterschiede

1. **Entwicklung bleibt häufig ein ungenutzter Plan.** In 21/48 Stücken erreichen
   die Soli nie die zweite Stufe, auf der rise/space/answer umgesetzt wird.
   Entwicklung muss innerhalb einer Phrase bzw. eines kurzen Solos stattfinden.
2. **Wenig gemeinsamer musikalischer Verlauf.** Alle 39 Nicht-Blues-Stücke
   verwenden dieselbe Themen-Energietreppe. Bereits vorhandene native Pläne für
   Höhepunkte, Solobögen, Harmoniewechsel und Rückkehr werden nicht ausgeschöpft.
3. **Benannter Dialog ist noch kein tatsächlicher Dialog.** Die Piano-Antwort
   erhält die Sax-Frage nicht. Fünf von elf Trading-Stücken enthalten durch die
   Abschnittsteilung 4+8 oder 4+12 Takte. In Leroy Snowfall liegt ein Beispiel
   bei ungefähr 1:53–2:11.
4. **Übergänge werden nicht gemeinsam vorbereitet.** Beispielsweise setzen
   Drums Fills nach acht Takten, auch in Zwölftakt-Blues. Stabile Begleitung ist
   sinnvoll; gezielte Reaktionen, Pausen und Übergänge brauchen gemeinsame Ziele.
5. **Klangästhetik verlangt einen Hörvergleich.** Die bestehende Hall-/Hero-Kette
   kann stilistisch zu einheitlich wirken. Das ist eine Hörhypothese, kein durch
   RMS-Werte bewiesener Fehler. Zusätzliche Samples sind nicht die erste Priorität.

## Nächste Verbesserung mit Vergleich

- Bestehenden Stand als Kontrolle erhalten, dieselben Seeds und mehrere komplette
  Stücke vergleichen; keine einzelne besonders gelungene Passage als Beleg wählen.
- Zuerst funktionierende Entwicklung in kurzen Soli, tatsächliche Frage/Antwort
  und korrekte Trading-Längen herstellen.
- Danach native Form-/Solo-/Höhepunktplanung ins Quartett übernehmen, mit wenigen
  gemeinsam vorbereiteten Wendepunkten für alle vier Stimmen.
- Dann stilgerechte Drum-/Bass-/Comping-Muster und deren Übergänge abstimmen.
- Raum und Hero-Kette separat und pegelangepasst vergleichen, damit Klangfarbe
  nicht mit Kompositionsqualität verwechselt wird.
- Hörabnahme: Welches Motiv bleibt hängen? Ist ein Höhepunkt spürbar vorbereitet?
  Klingt eine Antwort verbunden? Welches ganze Stück möchte man erneut hören?
  Zusätzlich die Vielfalt über mehrere Stücke beurteilen.

Die frühere Freigabe belegte technische Funktion und Verbesserung gegenüber dem
Prototyp. Sie gewichtete Varianten-Zähler zu stark und prüfte musikalische
Abhängigkeiten zu wenig. Diese Diagnose wurde ohne Änderung der Liveversion erstellt.

Details: [Komposition](jazz-professional-composition.md), [Ensemble](jazz-professional-ensemble.md), [Produktion](jazz-professional-producer.md).
