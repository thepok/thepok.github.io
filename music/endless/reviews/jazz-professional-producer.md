# Produzenten-Review: Weshalb die Veröffentlichung funktioniert, aber noch nicht fesseln muss

Untersucht: veröffentlichte 48 Jazz-Bankeinträge aus `web9-jazz-1`, deren Noten, Form- und Performance-Daten; `jazz_web.py`, `agentsound/jazz.py`, Hero-Sax-Patch und Hornist; finale Audio-Analyse für Swing/Ballade/Bossa. Detaillierte Beispiele unten: Bank 0, 1, 2, 3, 6 und 10. Keine Behauptung, diese Aufnahmen oder professionelle Referenzaufnahmen subjektiv angehört zu haben. Dies ist ein anspruchsvolles Produktionsreview anhand der tatsächlichen Partituren, Render-Dokumente und Signalberichte. Hörwirkungen sind als Hypothesen markiert.

## Urteil

Die bisherige Freigabe beantwortete vor allem: Ist das System reproduzierbar, klanglich unbeschädigt, spielbar und vielfältiger als seine erste Fassung? Sie beantwortete nicht: Ist ein Thema nach einem Durchlauf erinnerbar? Baut ein Solo eine unwiderstehliche Erwartung auf? Klingt die Band, als würde sie sich gegenseitig zuhören? Würde jemand freiwillig das Stück erneut hören?

Der wichtigste Abstand zur professionellen Aufnahme ist hier **zu wenig musikalische Hierarchie und Absicht**, nicht zu wenig Zufall oder Humanisierung. Viele Parameter wechseln; die Funktion der Ereignisse wechselt weniger. Ein professionelles Stück braucht keineswegs mehr Formen, Tempi oder Instrumente. Auch dieselbe Form, derselbe Brush-Klang und derselbe Chorus können faszinieren, wenn die Entscheidungen einen erkennbaren Gedanken verfolgen. Die aktuellen Diversitätszahlen messen unterschiedliche Ausprägungen, nicht diese Qualität.

## Tatsächliche Befunde

### 1. Dramaturgie folgt einem Bauplan, nicht dem konkreten Stück

39 von 48 Stücken haben dieselbe Themen-Energiefolge `0.42, 0.46, 0.50, 0.54`; die neun Blues dieselbe Folge `0.42, 0.54`. Das Solo der zuerst zugeteilten Stimme beginnt bei `0.55`, das zweite bei `0.83`, unabhängig davon, wo Harmonie oder Thema ihren eigentlichen Höhepunkt anbieten. Die zugrunde liegende Tune-Struktur enthält bereits `climax`, `dynamics`, `solo_shape`, `solo_changes` und `solo_charts`; der Quartet-Performer übernimmt diese dramatischen Informationen nicht als Gesamtregie, sondern baut seinen eigenen festen Ablauf.

Das ist nicht automatisch falsche Musik. Aber die Höherpriorisierung der zweiten Solostimme ist ein Verwaltungsentscheid. Eine professionelle Interpretation würde beispielsweise einen leisen zweiten Chorus gerade deshalb wählen, weil der erste schon alles gesagt hat; einen Höhepunkt verzögern; eine harmonische Wendung durch ein Ensemble-Break vorbereiten; oder mit einem unscheinbaren Thema ein überraschendes Ende begründen.

### 2. Manche Diversität ist nur Metadatenvielfalt

26 von 48 Stücken besitzen genau einen Soloabschnitt pro Solostimme. Bei 21 davon gibt es auch kein zusätzliches Trading. Die Optionen `development=rise|space|answer` greifen erst bei `stage > 0`; für diese 21 Stücke entwickeln sie die Hauptsoli deshalb überhaupt nicht unterschiedlich. Drei Labels können denselben funktionalen Ablauf beschreiben.

Auch `layout='bass-dialogue'` bedeutet zunächst reguläre Sax- und Piano-Soli plus angehängten Bassabschnitt. Es entsteht dadurch nicht automatisch ein musikalischer Dialog. Mehr Layout-Namen würden das Problem verdecken.

### 3. Das klangliche Bild bleibt stark vereinheitlicht

In allen sechs detailliert geprüften Stücken: gleiche Besen-Drums, derselbe Flügel, derselbe Bass, gleiches Grundpanning, gleicher Raum mit 1,2 s Nachhall, dieselbe 1,9-s-Platte und für den Saxofonisten dieselbe 3,6-s-Hero-Platte. Die Sax-Spur erhält keine gemeinsame Room-Zuweisung, sondern hauptsächlich ihre eigene Hero-Platte. Das kann eine bewusst reizvolle 70er-Jahre-Produktion sein; es ist aber kein neutraler Quartett-Raum und bleibt auch beim schnellen Swing, Bossa und der Ballade gleich.

Der Hero-Sax-Sound ist ausdrücklich gewünscht und muss erhalten bleiben. Dennoch sollte getestet werden, ob seine lange Effektfahne kurze artikulierte Phrasen nivelliert und das Sax räumlich von der Rhythmusgruppe trennt. Das ist eine **Hörhypothese**, kein aus Decay-Zahlen bewiesener Fehler. Ein trockeneres gemeinsames Ensemblebild könnte Kommunikation verständlicher machen, ohne das Sax-Instrument auszutauschen.

Die finalen Analysen zeigen beim Swing Sax/Piano ungefähr −24 dB aktiven RMS, aber Comp −35,2 und Drums −37,1 dB; beim Bossa entsprechend etwa −24,3 gegenüber −36,3/−36,6 dB. Das sind keine Lautheitsempfehlungen und keine Maskierungsdiagnose: perkussive und tonale Signale sind anhand RMS nicht direkt vergleichbar. Es ist aber ein konkreter Anlass, die wichtigen Antworten und Akzente der Begleitung im Kontext zu hören. Eine interaktive Partitur nützt wenig, wenn ihre entscheidenden Gesten untergehen.

### 4. Ausdruck ist vorhanden; seine Bedeutung muss präziser werden

**Keinesfalls fehlt grundsätzlich der volle Hero/Hornist-Ausdruck.** Der veröffentlichte Render enthält Luft-/Lautstärkekurven, Pitchbend, Vibrato, proximity-/Höhen-EQ, Pan- und Hall-Send-Bewegungen. Der Parent-Agent hat die tatsächlichen Automationswerte geprüft. `hornist.Memory` wird verwendet. Atempausen und Legato sind ebenfalls vorhanden. Eine Empfehlung „füge Humanisierung oder Mikrofonbewegung hinzu“ wäre hier sachlich falsch.

Der kritische Unterschied ist: Ein professioneller Spieler entscheidet *warum gerade diese Note* wächst, rau wird, verspätet beginnt oder abbricht. Eine allgemeine Erkennungsregel wie „höchster gehaltener Ton bekommt Ausdruck“ ist nicht dasselbe wie eine harmonisch oder motivisch wichtige Zielnote. Die vielen Ausdruckskurven können eine schwache Aussage glaubhafter vortragen, aber nicht in eine starke Aussage verwandeln.

Außerdem bleibt ein kontinuierlicher 10-Hz-Tremolo-/Flutter-Effekt im Hero-Grundklang. Seine Tiefe und Zufallsmodulation sind beabsichtigt; das ist nicht schlicht eine konstante Lautstärkeschwingung. Trotzdem sollte geprüft werden, ob der generelle „Hero“-Charakter im intimen Jazz zu jedem Satz passt oder die Unterschiede zwischen zurückhaltender Aussage, Antwort und Höhepunkt verkleinert. Kontrollierter A/B-Test, keine pauschale Entfernung.

## Sechs konkrete Einstiege für die nächste Runde

Zeitangaben sind Sekunden im veröffentlichten Bank-Render, gerundet.

| Bank / Stück | Konkrete Stelle | Produzentenfrage / gewünschte Änderung |
|---|---|---|
| 0, **A Postcard for Grove**, Ballade | Thema 13–120; Saxsolo 120–147; Pianosolo 147–173; Trading 173–200; Reprise C 200–227 | Vier vollständige Themenblöcke verbrauchen vor dem ersten Solo fast zwei Minuten. Das stärkere zweite Solo und das Trading sind automatisch eingesetzt. Welcher kurze Gedanke bleibt im Gedächtnis, und welches Ereignis macht den langen Anlauf notwendig? Eine reduzierte, motivisch deutlichere Eröffnung gegen die vollständige Form testen. |
| 1, **Early Spring Bridge**, Swing | Piano 52–65, Sax 65–77, Reprise 77–102 | Beide Soli dauern nur etwa zwölf Sekunden. `development='answer'` ist bei diesen ersten Soloabschnitten wirkungslos. Statt zwei kurzen Pflichtsoli: eine Stimme mit zwei kausal verbundenen Phrasen und eine echte Antwort der anderen vergleichen. |
| 2, **Hudson Kettle Blues**, Shuffle | Sax 58–109; Piano 109–159; Bass 159–184 | Das nominelle Bass-Dialog-Layout ist eine Abfolge abgegrenzter Soloblocks. Den Bass zuvor als antwortenden Charakter etablieren, damit sein Feature 159 s eine Konsequenz statt ein neuer Programmpunkt wird. |
| 3, **Grove Doorway**, Bossa | Soli 70–103; vollständige Reprise 103–170 | Die Reprise dauert rund doppelt so lang wie beide Soli zusammen. Ihr Energieabstieg `.6,.5,.4,.3` folgt dem Blockindex. Eine auf den Hook verdichtete Rückkehr mit einer hörbaren neuen harmonischen oder rhythmischen Perspektive gegen die vollständige Wiederholung testen. |
| 6, **Leroy Snowfall**, Jazzwalzer | Sax 77–95; Piano 95–113; Trading 113–131 | Dieselbe Solo-Energie-Hierarchie wie in Ballade und Swing. Das Trading ist nach Formplan eingefügt. Entsteht wirklich eine Fortsetzung der unmittelbar vorherigen Phrase, oder starten neue generische Phrasen? Phrasenende der einen Stimme muss Material der nächsten liefern. |
| 10, **Other Doorway Ballad** | Thema 7–122; Sax 122–150; Piano 150–179; Reprise 179–208 | `development='space'`, aber nur je ein Soloabschnitt und kein Trading: Die nominelle Entwicklungsoption erreicht die Soli nicht. Ein tatsächlich raumlassendes Konzept braucht weniger Antworten, verlängerte Spannungsnoten und ein bewusst vorbereitetes Schweigen – nicht nur einen Parameterwert. |

## Prioritäten für eine echte Qualitätsrunde

1. **Einen musikalischen Hauptgedanken je Stück festlegen und durchkomponieren** — Aufwand mittel bis hoch, höchster Nutzen. Vor dem Arrangieren: singbare Kernphrase, eine charakteristische rhythmische Signatur, eine konkrete Spannung/Zielnote und ein plausibles Ende. Bei der Rückkehr muss dieselbe Idee etwas bedeuten, das sie zuvor noch nicht bedeutete. Nicht pauschal jede Wiederholung verändern: ein unveränderter Hook kann der stärkste Moment sein. Test: nach kurzer Pause lässt sich der Hook wiedererkennen oder ansingen; Original und neue Fassung bei gleichen Seeds blind vergleichen.
2. **Rhythmusgruppe und Solisten an gemeinsame musikalische Ereignisse binden** — Aufwand hoch. Eine Pianoantwort referenziert die tatsächliche vorherige Saxphrase, der Bass antizipiert deren Zielharmonie, der Drummer reagiert auf eine reale Phrase und bereitet die nächste vor. Nicht alle zugleich. Solisten brauchen Alternativen: fortführen, widersprechen, verdichten, schweigen. Trade-off: weniger zuverlässig gleichmäßiger Hintergrundfluss, dafür mehr Aufmerksamkeit und Richtung. Test: dieselbe Melodie mit bisheriger Begleitung vs reagierender Begleitung; ohne Lautheitsvorteil.
3. **Satzweises Arrangieren statt zufälliger Slot-Kombinationen** — Aufwand mittel. Zwei oder drei zunächst klar ausgearbeitete Stückkonzepte, etwa kompaktes Hook-Stück, echtes langsames Gespräch und sich steigernder Blues. Form, Dichte, Begleitmuster, Soloanzahl und Ende müssen jeweils zusammenpassen. Diese Konzepte dürfen unterschiedlich lang sein. Nicht „mehr Formen“ als Selbstzweck. Test: sechs Stücke hintereinander; erkennt man unterschiedliche Charaktere bereits ohne Titel und Tempoanzeige?
4. **Hero-Expressivität musikalisch priorisieren und Raum kontrolliert vergleichen** — Aufwand klein bis mittel. Vorhandene Mic-/Air-/Pitch-/Vibrato-Engine behalten; Ausdrucksintensität an Zielnoten, Phrasenfunktion und Antwortbeziehung binden. Gleiches Stück als aktuelle Raumfassung und trockenere, gemeinsamere Quartettfassung rendern; Flutter unverändert, reduziert und phraseabhängig vergleichen. Nachhall und Ornament dürfen Kontur nicht verschlucken. Risiko: zu viel Zurücknahme verliert den ausdrücklich gewünschten Hero-Charakter; deshalb nie allein nach RMS optimieren.
5. **Auswahl nach überzeugenden musikalischen Entwürfen statt sofortiger Erstkandidat** — Aufwand mittel, Browserkosten beachten. Aktuell `n_first=n=1`. Mehr Kandidaten allein lösen nichts; Auswahlkriterien müssen die obigen Ziele ausdrücken, und kleine, blind verglichene Hörsets müssen sie kalibrieren. Billige Entwurfsprüfung vor Rendern, optional im Browser begrenztes Best-of. Gefahr: ein starrer Qualitätswert bevorzugt wieder ein und denselben „sicheren“ Stil. Qualität und Set-Charakter getrennt bewerten.

## Ein angemessener Abnahmetest

Nicht noch einmal nur „keine Fehler + mehr Labels = besser“. Sechs bis acht feste Seeds über mehrere Charaktere, unveränderte alte Vergleichsfassung aufheben. Zuerst gleiche 45–75-s-Ausschnitte zufällig A/B anordnen und wahrgenommene Lautheit ausgleichen; dann zwei vollständige Stücke und ein zusammenhängendes kleines Set prüfen. Fragen: *Welche Phrase blieb hängen? Wo wollte ich weiterhören? Wo reagierte die Band glaubhaft? Welchen Moment würde ich vermissen? Welches Stück würde ich wieder wählen?* Auch „keine Präferenz“ zulassen. Die menschliche Präferenz ist ein praktisches Urteil, kein statistischer Meisterschaftsnachweis.

Automatische Kontrollen bleiben wichtig: korrekte Noten/Assets, Atemfähigkeit, sinnvolle Register, Klick-/Clipfreiheit, Reproduzierbarkeit. Sie sind der Boden. Das neue Freigabekriterium muss sein, dass die neue Fassung bei mehreren Stücken als musikalisch zwingender empfunden wird und der Gewinn nicht nur aus mehr Lautstärke oder mehr Ereignissen stammt.
