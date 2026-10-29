#!/usr/bin/env python3
"""Verify the standard Hero Sax update preserves composition and legacy shared pieces.
Run after rebuilding the bank: python music/endless/py/check_jazz_tone.py
"""
import argparse,gzip,json,os,subprocess,sys,tempfile,zipfile
from pathlib import Path
HERE=Path(__file__).resolve().parent
ROOT=HERE.parents[2]

def main():
    ap=argparse.ArgumentParser(description=__doc__)
    ap.add_argument('--baseline-ref',default='9d4de59e')
    args=ap.parse_args()
    count=json.loads((HERE.parent/'bank/index.json').read_text())['counts']['jazz']
    selected=[]
    for n in range(count):
        rel=f'music/endless/bank/jazz/{n}.json.gz'
        old=json.loads(gzip.decompress(subprocess.check_output(['git','-C',str(ROOT),'show',f'{args.baseline_ref}:{rel}'])))
        new=json.loads(gzip.decompress((ROOT/rel).read_bytes()))
        a,b=json.loads(old['render']),json.loads(new['render'])
        assert new['recipe']['slot'].get('sax_sound')=='hero-default-1',f'{n}: tone not pinned'
        for key in ('tempo','lengthBeats','sections','seed','title'):
            assert a[key]==b[key],f'{n}: changed {key}'
        assert [t['id']for t in a['tracks']]==[t['id']for t in b['tracks']]
        for x,y in zip(a['tracks'],b['tracks']):
            if x['id']!='sax':assert x==y,f'{n}: changed backing track {x["id"]}'
            else:
                assert x['notes']==y['notes'],f'{n}: sax notes changed'
                assert x['instrument']==y['instrument'],f'{n}: sax sample source changed'
                ax={r['target']:r['points']for r in x['automation']}
                ay={r['target']:r['points']for r in y['automation']}
                assert set(ax)==set(ay),f'{n}: expression target changed'
                for target,points in ax.items():
                    assert points==ay[target],f'{n}: expression changed: {target}'
        if n in (0,1,3):selected.append(old)
    with tempfile.TemporaryDirectory(prefix='jazz-tone-check-') as directory:
        with zipfile.ZipFile(HERE/'repo.zip') as z:z.extractall(directory)
        os.environ['AGENTSOUND_WEB_REPO']=directory
        os.environ['AGENTSOUND_ASSETS']=str(Path(directory)/'assets')
        os.environ['AGENTSOUND_SAMPLES']=str(Path(directory)/'assets/samples')
        sys.path.insert(0,directory)
        import compose_web
        for old in selected:
            result=compose_web.compose_recipe(old['recipe'])
            assert result['render']==old['render'],'Legacy recipe tone changed'
            assert result['hash']==old['hash'],'Legacy hash changed'
    print(json.dumps(dict(status='passed',unchanged_compositions=count,legacy_recipes=len(selected))))

if __name__=='__main__':main()
