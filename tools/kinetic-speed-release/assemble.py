from pathlib import Path
import json,hashlib
for name in ['validated','second']:
 p=Path(name)
 if (p/'game/src').exists():
  q=Path(name+'-outer');p.rename(q);(q/'game').rename(p)
a=Path('validated');b=Path('second')
assert (a/'src/own-engine/kernel.wasm').read_bytes()==(b/'src/own-engine/kernel.wasm').read_bytes()
assert (a/'src/physics.ts').read_bytes()==(b/'src/physics.ts').read_bytes()
one=json.loads((a/'artifacts/benchmark/results.json').read_text());two=json.loads((b/'artifacts/benchmark/results.json').read_text())
assert one['results'][0]['runs'][0]['preset']=='art-deco'
assert two['results'][0]['runs'][0]['preset']=='brutalist'
for data in [one,two]:
 assert len(data['results'])==1
 assert data['results'][0]['aggregateQualityPass'] and data['results'][0]['repeats']==3
one['environment']['perPreset']={'art-deco':dict(one['environment']),'brutalist':dict(two['environment'])}
one['environment']['cpu']=' / '.join(sorted({one['environment']['cpu'],two['environment']['cpu']}))
one['results']+=two['results'];(a/'artifacts/benchmark/results.json').write_text(json.dumps(one,indent=2)+'\n')
print('Merged independently run scenes; every A/B pair remains from the same runner.')
