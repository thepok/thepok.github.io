"""Publish only the already compiled and validated full-game bytes."""
from pathlib import Path
import json,hashlib,shutil,zipfile,statistics,os
root=Path('validated');game=root/'game';out=Path('/tmp/kinetic-release');out.mkdir(parents=True,exist_ok=True)
audit=json.loads((game/'artifacts/speed-audit.json').read_text())
assert audit['runtimeImports']==[] and audit['baselineSha256']=='037176c75c5d5800e2a6600e8468c5592d57d2431aff889e92a3ce1eca2084ed'
assert audit['optimizedSha256']==hashlib.sha256((game/'src/own-engine/kernel.wasm').read_bytes()).hexdigest()
browser=json.loads((game/'artifacts/speed-browser/verification.json').read_text());assert browser['errors']==[] and len(browser['runs'])==2
results=[];environments={};allEquality=[]
for preset in ['art-deco','brutalist']:
 folder=root/preset/'artifacts/cache';doc=json.loads((folder/'benchmark.json').read_text());run=doc['results'][0]
 assert run['repeats']==3 and run['aggregateQualityPass'] and run['doubleSpeedTargetMet'] and run['medianSpeedup']>=2
 assert len(run['runs'])==6 and len(run['pairs'])==3
 assert all(r['kernel']['sha256']==audit['optimizedSha256'] for r in run['runs'] if r['variant']=='optimized')
 equal=json.loads((folder/f'equality-{preset}.json').read_text());assert equal['identicalEveryStep'] and equal['steps']==1200 and equal['candidateSha256']==audit['optimizedSha256'];allEquality.append({k:v for k,v in equal.items() if k!='hashes'})
 med=lambda variant,key:statistics.median(r['stats'][key] for r in run['runs'] if r['variant']==variant)
 results.append({'preset':preset,'pairs':3,'speedup':run['medianSpeedup'],'range':[run['minimumSpeedup'],run['maximumSpeedup']],'referenceMeanMs':med('reference','meanMs'),'optimizedMeanMs':med('optimized','meanMs'),'referenceP95Ms':med('reference','p95Ms'),'optimizedP95Ms':med('optimized','p95Ms'),'quality':run['pairs'][0]['quality'],'final':next(r['final'] for r in run['runs'] if r['variant']=='optimized')})
 environments[preset]=doc['environment']
quiet=json.loads((game/'artifacts/cache/equality-quiet.json').read_text());assert quiet['identicalEveryStep'] and quiet['final']['broken']==0 and quiet['final']['fragments']==0;allEquality.append({k:v for k,v in quiet.items() if k!='hashes'})
shutil.copytree(game/'dist',out,dirs_exist_ok=True)
for preset in ['art-deco','brutalist']:shutil.copytree(root/preset/'artifacts/cache',out/'evidence/cache'/preset,dirs_exist_ok=True)
shutil.copytree(game/'artifacts/cache',out/'evidence/cache/game',dirs_exist_ok=True)
shutil.copytree(game/'artifacts/speed-browser',out/'evidence/speed-browser',dirs_exist_ok=True)
shutil.copyfile(game/'artifacts/speed-audit.json',out/'evidence/speed-audit.json')
# Runtime/editor/renderer code is not modified by this refinement.
unchanged=[]
with zipfile.ZipFile('games/loadbearing-own-fast/source.zip') as z:
 for name in z.namelist():
  if name.startswith('src/') and not name.startswith('src/own-engine/') and name.endswith(('.ts','.css')):
   assert z.read(name).decode().replace('\r\n','\n')==(game/name).read_text(),name
   unchanged.append(name)
manifest={'engine':'KINETIC 0.2.1','physicsLibrary':'none','baselineMain':'07452976f74b6f1328a1e3d69112a55c5e13b6d0','validatedSourceCommit':'b700204a4564db8645700c93895db168fa124c55','validationRun':35464183880,'kernel':audit,'benchmarks':results,'environmentByPreset':environments,'perStepEqualityAgainstV02':allEquality,'doubleSpeedTargetAllPresets':True,'allAggregateQualityGatesPass':True,'unchangedGameFiles':unchanged,'qualityScope':'Exact output equality with KINETIC 0.2 after all 1200 steps in both collapse scenes and quiet scene. Versus user-approved KINETIC 0.1, aggregate quality gates, not identical motion.','timestepTradeoff':'Inherited 0.2 policy: large ordinary worlds internal 60Hz versus 0.1 internal 120Hz. Startup, small scenes and enabled vehicle motors remain 120Hz. Cache optimization makes no additional quality reduction.','timingScope':'Median of 3 alternating paired ratios per scene, same machine within every pair; physics computation including projectile creation, excluding rendering/setup/warmup/tracing. Not an FPS guarantee.'}
(out/'BUILD.json').write_text(json.dumps(manifest,indent=2)+'\n')
old=Path('games/loadbearing-own-fast/README.md').read_text().replace('# KINETIC 0.2 —','# KINETIC 0.2.1 —',1)
start=old.index('## Nachprüfbare Ergebnisse');end=old.index('## Spielstände und Quellcode',start)
text='''## Neue Optimierungen ohne weitere Qualitätsreduktion

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
'''
for r in results:text+=f"| {r['preset']} | {r['referenceMeanMs']:.2f} | {r['optimizedMeanMs']:.2f} | {r['speedup']:.2f}× | {r['range'][0]:.2f}–{r['range'][1]:.2f}× |\n"
text+='''
Zeiten sind Mediane der drei Laufmittel; der Faktor ist der Median der gepaarten
Verhältnisse. Beide getesteten Presets überschreiten Faktor 2 im Median. Keine
Garantie für jedes Gerät, aktive Fahrzeuge, jedes Gebäude oder die Render-FPS.

`BUILD.json` nennt die getesteten Kerne und Prüfläufe. `evidence/cache/` enthält
alle Einzelzeiten, Phasen, Konfigurationen und die exakten Schrittvergleiche.
`evidence/speed-browser/` enthält Tests und Screenshots der echten Benutzeroberfläche,
Abbruch, Export, Mobilansicht und sichtbaren Einstürze. Ausgeliefert werden dieselben
WASM-Bytes, die gemessen wurden.

'''
readme=old[:start]+text+old[end:];(out/'README.md').write_text(readme)
shutil.copytree(game/'src/own-engine',out/'engine-source',dirs_exist_ok=True)
with zipfile.ZipFile(out/'source.zip','w',zipfile.ZIP_DEFLATED) as z:
 for part in ['src','tests','public']:
  for p in (game/part).rglob('*'):
   if p.is_file() and p.relative_to(game).as_posix()!='public/README.md':z.write(p,p.relative_to(game))
 for name in ['package.json','package-lock.json','tsconfig.json','vite.config.ts','index.html']:z.write(game/name,name)
 z.writestr('README.md',readme);z.writestr('public/README.md',readme);z.write('tools/kinetic-cache-speed/build.sh','build-own-kernel.sh')
 with zipfile.ZipFile('games/loadbearing-own-fast/source.zip') as baseline:
  for name in baseline.namelist():
   if name.startswith('reference-engine/') and not name.endswith('/'):z.writestr(name,baseline.read(name))
print(json.dumps(manifest,indent=2))
