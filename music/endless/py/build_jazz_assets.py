#!/usr/bin/env python3
"""Build the web jazz sample set from installed, licensed AgentSound packs.

No waveform is placed in the Python mirror. Original SFZ text and empty audio
placeholders support the composer; measured WAV metadata prevents audio reads.
All sample zones supported by the three patches are published, so new melodies
and velocity choices require no asset changes. Opus conversion preserves duration
and WAV loop/unity metadata; no trimming or normalization is applied.
"""
import argparse, concurrent.futures, hashlib, json, math, shutil, subprocess, sys
from pathlib import Path

def main():
 p=argparse.ArgumentParser(description=__doc__)
 p.add_argument('--native',type=Path,required=True)
 p.add_argument('--mirror',type=Path,required=True)
 p.add_argument('--page',type=Path,required=True)
 p.add_argument('--jobs',type=int,default=4)
 a=p.parse_args();sys.path.insert(0,str(a.native))
 from agentsound import Song, Clip, hero, sfz
 from agentsound.kits import wav_header
 packs=('meatbass','swirly-drums','karoryfer-weresax')
 tables_path=a.mirror/'agentsound_web_tables.json'
 tables=json.loads(tables_path.read_text())
 for pack in packs:
  source=a.native/'assets/samples'/pack
  assert (source/'SOURCE.json').exists(),f'Missing installed pack: {pack}'
  for file in sorted(source.rglob('*')):
   if not file.is_file():continue
   rel=file.relative_to(a.native/'assets'); dest=a.mirror/'assets'/rel
   if file.suffix.lower() in ('.wav','.ogg','.flac','.wv'):
    info=sfz.wav_info(str(file))
    if info is not None:tables['wav_info'][str(rel)]=info
    dest.parent.mkdir(parents=True,exist_ok=True);dest.touch()
   elif file.suffix.lower() in ('.sfz','.txt','.json') or file.name.lower()=='license':
    dest.parent.mkdir(parents=True,exist_ok=True);shutil.copyfile(file,dest)
 tables_path.write_text(json.dumps(tables,ensure_ascii=False,separators=(',',':'))+'\n')
 s=Song('Jazz asset inventory',tempo=100)
 for name,patch in [('bass','sampled/upright_bass'),('drums','sampled/brush_kit'),('sax','hero/sax')]:
  t=s.track(name,patch)
  if name=='sax':t=hero(t,family='sax',double=False,octave=False)
  # The compiler prunes zones per played velocity: cover EVERY value (brush bands can be six values wide).
  t.play(Clip([(i*.01,1,pitch,vel) for i,(pitch,vel) in enumerate((pitch,vel) for pitch in range(128) for vel in range(1,128))],length=16),0)
 files=set()
 def walk(inst):
  for zone in inst['params'].get('samples',[]):
   if not zone['file'].startswith('*'):files.add(zone['file'])
  for layer in inst['params'].get('layers',[]):walk(layer['instrument'])
 for t in s.compile()['tracks']:walk(t['instrument'])
 out=a.page/'samples/jazz';out.mkdir(parents=True,exist_ok=True)
 def convert(file):
  file=Path(file);rel=str(file.relative_to(a.native/'assets'));h=wav_header(str(file));assert h
  name=hashlib.sha256(rel.encode()).hexdigest()[:12]+'-'+file.stem.replace(' ','_').replace('#','s')
  target=out/(name+'.opus')
  if not target.exists():
   subprocess.run(['ffmpeg','-v','error','-y','-i',str(file),'-map_metadata','-1','-c:a','libopus','-b:a','112k','-vbr','on',str(target)],check=True)
  unity=h['unity'];unity=None if unity is None else [math.floor(unity),round((unity%1)*2**32)]
  return rel,[name,h['rate'],h['frames'],h['loop'],unity]
 with concurrent.futures.ThreadPoolExecutor(max_workers=a.jobs) as executor:
  idx=dict(executor.map(convert,sorted(files)))
 (out/'index.json').write_text(json.dumps(idx,ensure_ascii=False,separators=(',',':'))+'\n')
 for pack in packs:
  source=a.native/'assets/samples'/pack
  shutil.copyfile(source/'SOURCE.json',out/(pack+'-SOURCE.json'))
  shutil.copyfile(source/('LICENSE' if (source/'LICENSE').exists() else 'license'),out/(pack+'-LICENSE.txt'))
 hp=a.page/'samples/index.json';hashes=json.loads(hp.read_text());hashes['jazz']={f.name:hashlib.sha1(f.read_bytes()).hexdigest()[:8] for f in sorted(out.iterdir()) if f.is_file()}
 hp.write_text(json.dumps(hashes,ensure_ascii=False,separators=(',',':'))+'\n')
 print(json.dumps({'samples':len(idx),'bytes':sum(f.stat().st_size for f in out.iterdir()),'sample_index_version':hashlib.sha1(hp.read_bytes()).hexdigest()[:10]},indent=2))
if __name__=='__main__':main()
