from pathlib import Path
import json,zipfile,shutil,hashlib,os
source=Path('validated');target=Path('/tmp/loadbearing-own');target.mkdir(parents=True,exist_ok=True)
audit=json.loads((source/'artifacts/engine-audit.json').read_text())
report=json.loads((source/'artifacts/browser/verification.json').read_text())
assert audit['wasmImports']==[] and audit['thirdPartyPhysicsDependency'] is False
assert report['errors']==[] and report['info']['mode']=='own-wasm'
assert report['info']['parts']==1000 and report['walkerVehicle']
assert report['collapse']['finite'] and report['collapse']['broken']>1000 and report['collapse']['fragments']>400 and report['collapse']['meanHeight']<12
shutil.copytree(source/'dist',target,dirs_exist_ok=True)
for part in ['browser','regressions']:shutil.copytree(source/'artifacts'/part,target/'evidence'/part,dirs_exist_ok=True)
shutil.copyfile(source/'artifacts/engine-audit.json',target/'evidence/engine-audit.json')
original=Path('games/loadbearing/source.zip')
unchanged=['src/scene.ts','src/catalog.ts','src/procedural-buildings.ts','src/local-fracture.ts','src/vehicle-blueprint.ts','src/concrete-materials.ts','src/building-accessibility.ts','src/building-objective.ts','src/rebar-markings.ts']
with zipfile.ZipFile(original) as z:
 unchanged += [n for n in z.namelist() if n.startswith('src/') and n.endswith('.css')]
 for name in unchanged:assert z.read(name).decode().replace('\r\n','\n')==(source/name).read_text(),name
manifest={'engine':'KINETIC','status':'experimental full-game integration','thirdPartyPhysics':False,'joltFallback':False,'sourceCommit':os.environ['VALIDATED_SHA'],'validationRun':int(os.environ['VALIDATED_RUN']),'originalSourceSha256':hashlib.sha256(original.read_bytes()).hexdigest(),'wasm':audit,'unchangedSourceFiles':unchanged,'browser':report,'performanceClaim':'No matched-quality speedup claim. Different destruction and worse p95 in initial local tests.'}
(target/'BUILD.json').write_text(json.dumps(manifest,indent=2)+'\n')
readme=Path('tools/kinetic-publication/README.md').read_text();(target/'README.md').write_text(readme)
engine=source/'src/own-engine';shutil.copytree(engine,target/'engine-source',dirs_exist_ok=True)
build='''#!/usr/bin/env bash
set -euo pipefail
clang++-18 --target=wasm32 -std=c++17 -O3 -msimd128 -mbulk-memory -ffreestanding -nostdlib -fno-exceptions -fno-rtti -Wl,--no-entry -Wl,--export-all -Wl,--export-memory -Wl,--initial-memory=134217728 -Wl,--max-memory=134217728 -Wl,-z,stack-size=2097152 src/own-engine/kernel.cpp -o src/own-engine/kernel.wasm
'''
with zipfile.ZipFile(target/'source.zip','w',zipfile.ZIP_DEFLATED) as z:
 for part in ['src','tests','public']:
  for p in (source/part).rglob('*'):
   if p.is_file() and p.relative_to(source).as_posix()!='public/README.md':z.write(p,p.relative_to(source))
 for name in ['package.json','package-lock.json','tsconfig.json','vite.config.ts','index.html']:z.write(source/name,name)
 z.writestr('README.md',readme);z.writestr('public/README.md',readme);z.writestr('build-own-kernel.sh',build)
print(json.dumps({'engine':audit,'collapse':report['collapse'],'unchangedFiles':len(unchanged)},indent=2))
