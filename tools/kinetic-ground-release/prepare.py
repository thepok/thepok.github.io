"""Publish only the final mutually identical native binaries and their actual evidence."""
from pathlib import Path
import json,hashlib
root=Path('validated');sources={name:Path('measured')/name for name in ['art-deco','brutalist']}
for p in [root,*sources.values()]:
 if (p/'game/src').exists():
  outer=p.with_name(p.name+'-outer');p.rename(outer);(outer/'game').rename(p)
checks=['src/own-engine/kernel.wasm','src/own-engine/kernel-reference.wasm','src/physics.ts','src/benchmark/suite.ts']
for name in checks:
 for p in sources.values():assert (root/name).read_bytes()==(p/name).read_bytes(),(str(p),name)
reports={name:json.loads((p/'artifacts/benchmark/results.json').read_text()) for name,p in sources.items()}
merged={'environment':dict(reports['art-deco']['environment']),'results':[]}
merged['environment']['perPreset']={name:r['environment'] for name,r in reports.items()}
merged['environment']['cpu']=' / '.join(sorted({r['environment']['cpu'] for r in reports.values()}))
for name,r in reports.items():
 assert len(r['results'])==1
 result=r['results'][0];assert result['aggregateQualityPass'] and result['repeats']==3
 assert all(run['preset']==name for run in result['runs'])
 assert all('floorMotionClamps' in run for run in result['runs'])
 merged['results'].append(result)
(root/'artifacts/benchmark/results.json').write_text(json.dumps(merged,indent=2)+'\n')
visual=json.loads((root/'artifacts/speed-browser/verification.json').read_text())
assert visual['errors']==[] and len(visual['runs'])==2
for run in visual['runs']:
 live=run['live'];assert all(t['minY']>=-1 for t in live['traces'])
 assert live['final']['maxSpeed']<25 and live['final']['fragments']==1000
 assert 'floorMotionClamps' in live
# Reuse the existing strict source/geometry packaging checks, updating EVERY
# provenance field to the final run. There is no native rebuild at publication.
p=Path('tools/kinetic-speed-release/prepare.py');s=p.read_text()
for old,new in [('4eceeb8eae25eb402aef55bc7e9ad63381cc5178','2c23ca4efe339575c2105a8bef197a808aa38773'),('35425010992','35426888597'),('da87afd56d55478f287e24617a762d0be80d5028','2c23ca4efe339575c2105a8bef197a808aa38773'),('35425224196','35426888597')]:
 assert old in s;s=s.replace(old,new)
readme=Path('tools/kinetic-speed-release/README.md');text=readme.read_text()
anchor='## Qualität und Messgrenzen';assert text.count(anchor)==1
text=text.replace(anchor,'''### Zusätzliche Bodensicherheit

Konvexe Fragmente gegen große statische Bodenflächen verwenden einen eigenen,
geometrisch begrenzten Kontaktpfad. Fälle an Kanten oder anderen Flächen bleiben
bei der vollständigen Kollisionsprüfung. Für vollständige Durchtritte aus einer
Position oberhalb des Bodens gibt es außerdem eine Bewegungsbegrenzung mit
Kontaktimpulsen. Sie erhält das Fragment und seine tangentiale Bewegung, statt
es zu löschen. Der Zähler `floorMotionClamps` ist in jeder Messung enthalten.
Dies ist eine zusätzliche Spielphysik-Korrektur für die gröbere Zeitschrittweite,
kein Beweis eines identischen physikalischen Verlaufs.

Die abschließenden Live-Tests prüfen einzelne entkommene Trümmer zusätzlich zur
Gesamtschadensmenge. Die Bodenprüfung umfasst den ganzen aufgezeichneten Verlauf,
nicht nur den letzten Messpunkt.

'''+anchor)
readme.write_text(text)
exec(compile(s,str(p),'exec'),{'__name__':'__main__'})
print('Packaged final ground-safe native build and the matched three-pair measurements.')
