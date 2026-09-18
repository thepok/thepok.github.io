"""Package the exact tested game bytes. Never rebuild or change its physics here."""
from pathlib import Path
import json, shutil, hashlib, zipfile, html
source=Path('validated/game'); target=Path('/tmp/loadbearing-fast'); target.mkdir(parents=True,exist_ok=True)
report=json.loads((source/'artifacts/browser/results.json').read_text())
assert report['errors']==[] and len(report['results'])==4
rows=[]
for style in ['brutalist','art-deco']:
    base=next(r for r in report['results'] if r['style']==style and r['mode']=='reference')
    fast=next(r for r in report['results'] if r['style']==style and r['mode']=='optimized')
    for r in [base,fast]:
        assert r['info']['mode']=='multithread' and r['info']['threads']>0
        assert r['replay']['finite'] and r['replay']['parts']==1000 and r['replay']['fragmentLimit']==500
    assert fast['info']['core']=='specialized-native'
    folder=source/'artifacts/browser'
    assert json.loads((folder/f'{style}-reference-blueprint.json').read_text())==json.loads((folder/f'{style}-optimized-blueprint.json').read_text())
    a,b=base['replay'],fast['replay']; rows.append({'style':style,'referenceMeanMs':a['meanMs'],'optimizedMeanMs':b['meanMs'],'speedup':a['meanMs']/b['meanMs'],'referenceP95Ms':a['p95Ms'],'optimizedP95Ms':b['p95Ms'],'referenceFinal':a['timeline'][-1],'optimizedFinal':b['timeline'][-1]})
shutil.copytree(source/'dist',target,dirs_exist_ok=True)
shutil.copytree(source/'artifacts/browser',target/'evidence/browser',dirs_exist_ok=True)
shutil.copytree(source/'artifacts/regressions',target/'evidence/regressions',dirs_exist_ok=True)
# Assert original rendering / structural geometry after normalizing only line endings.
unchanged=['src/scene.ts','src/procedural-buildings.ts','src/catalog.ts','src/local-fracture.ts','src/building-objective.ts','src/building-accessibility.ts','src/concrete-materials.ts','src/rebar-markings.ts','src/vehicle-blueprint.ts','src/world-vehicles.ts']
with zipfile.ZipFile('games/loadbearing/source.zip') as z:
    unchanged += [name for name in z.namelist() if name.startswith('src/') and name.endswith('.css')]
    for name in unchanged:
        assert z.read(name).decode().replace('\r\n','\n')==(source/name).read_text(),f'Unexpected gameplay/render change: {name}'
manifest={'variant':'complete-game-specialized-native','validatedSourceCommit':'cc01e982faeb6a87edc134538429e05bcd474300','validationRun':35369938820,'validationArtifact':10558571626,'originalMainCommit':'69e167362ef354806e156cc2ba0206458c24b0d3','nativeBuildCommit':'cd9ccb1f4fb8fb0fc62ccfc4d223351a27c4dfbd','nativeBuildRun':35367229979,'originalSourceSha256':hashlib.sha256(Path('games/loadbearing/source.zip').read_bytes()).hexdigest(),'unchangedAfterLineEndingNormalization':unchanged,'benchmarks':rows,'note':'One paired run per style, same Chrome and runner. Worker simulation throughput, not render FPS. Reference has the same ownership safety fixes and transport, but original packaged Jolt, individual getters and SixDOF joints. Fixed-joint specialization can produce small numerical differences.'}
(target/'BUILD.json').write_text(json.dumps(manifest,indent=2)+'\n')
readme='''# LOAD BEARING — vollständige Performance-Vorschau

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
'''
for r in rows:readme+=f"| {r['style']} | {r['referenceMeanMs']:.2f} | {r['optimizedMeanMs']:.2f} | {r['speedup']:.2f}× |\n"
readme+='''
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
'''
(target/'README.md').write_text(readme)
with zipfile.ZipFile(target/'source.zip','w',zipfile.ZIP_DEFLATED) as z:
    for part in ['src','tests','public']:
        for p in (source/part).rglob('*'):
            if p.is_file():z.write(p,p.relative_to(source))
    for name in ['package.json','package-lock.json','tsconfig.json','vite.config.ts','index.html']:z.write(source/name,name)
    z.writestr('README.md',readme)
    for p in Path('tools/full-game-physics/native').rglob('*'):
        if p.is_file():z.write(p,'native-build/'+p.name)
    z.write('.github/workflows/full-game-native.yml','native-build/full-game-native.yml')
    z.write(target/'THIRD-PARTY-LICENSES.txt','THIRD-PARTY-LICENSES.txt')
print(json.dumps(manifest,indent=2))
