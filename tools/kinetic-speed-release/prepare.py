"""Package the measured native core and the subsequently browser-validated UI."""
from pathlib import Path
import hashlib,json,zipfile,shutil,statistics,os
source=Path('validated');target=Path('/tmp/loadbearing-own-fast');target.mkdir(parents=True,exist_ok=True)
base=Path('games/loadbearing-own/source.zip')
bench=json.loads((source/'artifacts/benchmark/results.json').read_text())
quiet=json.loads((source/'artifacts/benchmark/quiet.json').read_text())
visual=json.loads((source/'artifacts/speed-browser/verification.json').read_text())
audit=json.loads((source/'artifacts/speed-audit.json').read_text())
assert audit['baselineSha256']=='037176c75c5d5800e2a6600e8468c5592d57d2431aff889e92a3ce1eca2084ed'
assert audit['runtimeImports']==[]
assert hashlib.sha256((source/'src/own-engine/kernel.wasm').read_bytes()).hexdigest()==audit['optimizedSha256']
assert visual['errors']==[] and len(visual['runs'])==2
assert visual['benchmark']['aggregateQualityPass']
for run in visual['runs']:
 live=run['live'];variant=run['variant']
 assert live['ticks']==1200 and live['final']['finite'] and live['final']['fragments']==1000
 assert live['final']['meanHeight']<10
 assert live['controlled']==(len(live['interventions'])==0)
 assert all(n=='trees-present' for n in live['interventions'])
 assert live['internalSubsteps']==(2400 if variant=='reference' else 1200)
rows=[]
for result in bench['results']:
 assert result['aggregateQualityPass'] and result['repeats']==3
 refs=[r for r in result['runs'] if r['variant']=='reference']
 opts=[r for r in result['runs'] if r['variant']=='optimized']
 assert len(refs)==len(opts)==3
 for r in result['runs']:
  assert r['parts']==1000 and r['fragmentLimit']==1000 and r['ticks']==1200
  assert r['kernel']['sha256']==audit['baselineSha256' if r['variant']=='reference' else 'optimizedSha256']
  assert r['internalSubsteps']==(2400 if r['variant']=='reference' else 1200)
 median=lambda runs,key:statistics.median(r['stats'][key] for r in runs)
 rows.append({'preset':refs[0]['preset'],'pairs':3,'speedup':result['medianSpeedup'],'range':[result['minimumSpeedup'],result['maximumSpeedup']],'targetMet':result['doubleSpeedTargetMet'],'referenceMeanMs':median(refs,'meanMs'),'optimizedMeanMs':median(opts,'meanMs'),'referenceP95Ms':median(refs,'p95Ms'),'optimizedP95Ms':median(opts,'p95Ms'),'referenceFinal':refs[-1]['final'],'optimizedFinal':opts[-1]['final'],'quality':result['pairs'][-1]['quality']})
assert {r['preset'] for r in rows}=={'art-deco','brutalist'}
assert all(r['aggregateQualityPass'] for r in quiet['results'])
shutil.copytree(source/'dist',target,dirs_exist_ok=True)
for part in ['benchmark','regressions','speed-browser']:
 src=source/'artifacts'/part
 for p in src.rglob('*'):
  if p.is_file() and (part!='benchmark' or p.suffix=='.json'):
   dst=target/'evidence'/part/p.relative_to(src);dst.parent.mkdir(parents=True,exist_ok=True);shutil.copyfile(p,dst)
for name in ['engine-audit.json','speed-audit.json']:
 shutil.copyfile(source/'artifacts'/name,target/'evidence'/name)
unchanged=['src/scene.ts','src/catalog.ts','src/procedural-buildings.ts','src/local-fracture.ts','src/concrete-materials.ts','src/building-objective.ts','src/building-accessibility.ts','src/vehicle-blueprint.ts','src/rebar-markings.ts']
with zipfile.ZipFile(base) as z:
 unchanged += [n for n in z.namelist() if n.startswith('src/') and n.endswith('.css')]
 for name in unchanged:
  assert z.read(name).decode().replace('\r\n','\n')==(source/name).read_text(),name
 native=source/'src/own-engine'
 shutil.copytree(native,target/'engine-source',dirs_exist_ok=True)
 reference={n:z.read(n) for n in z.namelist() if n.startswith('src/own-engine/') and not n.endswith('/')}
manifest={'engine':'KINETIC 0.2','physicsLibrary':'none','baselineMain':'7e800f9fbdb862083aac6dc02ea2334ebecd97af','nativeSourceCommit':'4eceeb8eae25eb402aef55bc7e9ad63381cc5178','nativeValidationRun':35425010992,'browserGateCommit':'da87afd56d55478f287e24617a762d0be80d5028','browserGateRun':35425224196,'publicationSourceCommit':os.environ['GITHUB_SHA'],'sourceArchiveBaselineSha256':hashlib.sha256(base.read_bytes()).hexdigest(),'kernel':audit,'environment':bench['environment'],'benchmarks':rows,'allAggregateQualityGatesPass':True,'doubleSpeedTargetAllPresets':all(r['targetMet'] for r in rows),'unchangedGameFiles':unchanged,'timestepTradeoff':'Large ordinary worlds: 60 Hz internal instead of 120 Hz. Startup/small/activated motor hinges retain 120 Hz. External timestep, solver iteration parameters, shapes, bodies, materials and debris caps are unchanged.','scope':'Physics computation, not frame rate. Three alternating paired runs per collapse preset; each pair runs on one machine, different scenes may use different runners. Quality gates and visual A/B are not identical-trajectory guarantees.'}
(target/'BUILD.json').write_text(json.dumps(manifest,indent=2)+'\n')
lines=['| Gebäude | Referenz ms/Schritt | Optimiert ms/Schritt | Median Physikdurchsatz | Spanne der 3 Paare |','|---|---:|---:|---:|---:|']
for r in rows:lines.append(f"| {r['preset']} | {r['referenceMeanMs']:.2f} | {r['optimizedMeanMs']:.2f} | {r['speedup']:.2f}× | {r['range'][0]:.2f}–{r['range'][1]:.2f}× |")
lines+=['',f"Gemessen unter {bench['environment']['node']} auf {bench['environment']['cpu']}. Jeder A/B-Vergleich läuft auf demselben Rechner; die beiden Gebäudetypen wurden auf getrennten CI-Runnern geprüft. Schrittzeiten: Median der drei Laufmittel. Durchsatzfaktor: Median der gepaarten Verhältnisse.",'Die native WASM-Datei der Messungen ist identisch mit der hier ausgelieferten.']
readme=Path('tools/kinetic-speed-release/README.md').read_text().replace('<!-- RESULTS -->','\n'.join(lines))
(target/'README.md').write_text(readme)
with zipfile.ZipFile(target/'source.zip','w',zipfile.ZIP_DEFLATED) as z:
 for part in ['src','tests','public']:
  for p in (source/part).rglob('*'):
   if p.is_file() and p.relative_to(source).as_posix()!='public/README.md':z.write(p,p.relative_to(source))
 for name in ['package.json','package-lock.json','tsconfig.json','vite.config.ts','index.html','compiler.txt']:z.write(source/name,name)
 for name,data in reference.items():z.writestr('reference-engine/'+name.removeprefix('src/own-engine/'),data)
 z.writestr('README.md',readme);z.writestr('public/README.md',readme)
 z.writestr('build-own-kernel.sh','''#!/usr/bin/env bash
set -euo pipefail
clang++-18 --target=wasm32 -std=c++17 -O3 -msimd128 -mbulk-memory -ffreestanding -nostdlib -fno-exceptions -fno-rtti -Wl,--no-entry -Wl,--export-all -Wl,--export-memory -Wl,--initial-memory=134217728 -Wl,--max-memory=134217728 -Wl,-z,stack-size=2097152 src/own-engine/kernel.cpp -o src/own-engine/kernel.wasm
''')
print(json.dumps(manifest,indent=2))
