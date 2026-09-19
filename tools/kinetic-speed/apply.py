"""Apply a hash-checked textual delta to the exact user-approved KINETIC source.
The split xz contains JSON text edits, not executable patch hooks. Resulting
readable native/TypeScript sources are included in CI artifacts and source.zip.
"""
from pathlib import Path
import hashlib,json,lzma,shutil,sys
root=Path(sys.argv[1]).resolve();here=Path(__file__).parent
blob=b''.join((here/'payload'/f'delta.xz.{i}').read_bytes() for i in range(4))
assert hashlib.sha256(blob).hexdigest()=='b8ce3ffaaae3a484e7c3189702f4fe210d9f53390b9d16fd336ce549e70eaa7c'
engine=root/'src/own-engine'
assert hashlib.sha256((engine/'kernel.wasm').read_bytes()).hexdigest()=='037176c75c5d5800e2a6600e8468c5592d57d2431aff889e92a3ce1eca2084ed'
shutil.copyfile(engine/'kernel.wasm',engine/'kernel-reference.wasm')
for entry in json.loads(lzma.decompress(blob)):
 p=(root/entry['path']).resolve();assert p.is_relative_to(root)
 if 'edits' in entry:
  text=p.read_text();assert hashlib.sha256(text.encode()).hexdigest()==entry['before'],entry['path']
  previous=len(text)
  for a,b,value in reversed(entry['edits']):
   assert 0<=a<=b<=previous;previous=a;text=text[:a]+value+text[b:]
 else:
  assert not p.exists();text=entry['content']
 assert hashlib.sha256(text.encode()).hexdigest()==entry['after'],entry['path']
 p.parent.mkdir(parents=True,exist_ok=True);p.write_text(text)
print('Applied checked KINETIC speed/benchmark integration; reference WASM frozen unchanged.')
