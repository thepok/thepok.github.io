#!/usr/bin/env python3
"""Build deterministic jazz openings and migrate existing bank version stamps only.

python music/endless/py/rebuild_jazz_bank.py --count 48
Reads the shipped archive. No downloads or audio renders. All pieces must replay
exactly in both piano modes; publish the bank manifest after all entries validate.
"""
import argparse
import copy
import gzip
import hashlib
import json
import os
from pathlib import Path
import sys
import tempfile
import zipfile

HERE = Path(__file__).resolve().parent

def write(path, data):
    path.parent.mkdir(parents=True, exist_ok=True)
    raw = json.dumps(data, ensure_ascii=False, separators=(',', ':')).encode()
    tmp = path.with_suffix(path.suffix + '.tmp')
    tmp.write_bytes(gzip.compress(raw, compresslevel=9, mtime=0))
    tmp.replace(path)

def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--count', type=int, default=48)
    parser.add_argument('--bank', type=Path, default=HERE.parent / 'bank')
    parser.add_argument('--archive', type=Path, default=HERE / 'repo.zip')
    args = parser.parse_args()
    if args.count < 1:
        parser.error('count must be positive')
    index = json.loads((args.bank / 'index.json').read_text())
    existing = list((args.bank / 'jazz').glob('*.json.gz'))
    if any(int(p.name.split('.')[0]) >= args.count for p in existing):
        parser.error('Refusing to shrink an existing jazz bank')
    with tempfile.TemporaryDirectory(prefix='jazz-bank-') as directory:
        with zipfile.ZipFile(args.archive) as archive:
            archive.extractall(directory)
        os.environ['AGENTSOUND_WEB_REPO'] = directory
        os.environ['AGENTSOUND_ASSETS'] = str(Path(directory) / 'assets')
        os.environ['AGENTSOUND_SAMPLES'] = str(Path(directory) / 'assets/samples')
        sys.path.insert(0, directory)
        import compose_web as web
        for n in range(args.count):
            seed = 910000 + n * 997
            web.MISSING.clear()
            session = web.Session('jazz', seed, 'beste')
            out = session.next()
            replay = web.compose_recipe(out['recipe'])
            assert replay['render'] == out['render'], 'Recipe mismatch'
            spar = web.compose_recipe(dict(out['recipe'], p='spar'))
            best_doc, spar_doc = json.loads(out['render']), json.loads(spar['render'])
            zones = {t['id']: t['instrument']['params']['samples'] for t in spar_doc['tracks']
                     if 'samples' in t.get('instrument', {}).get('params', {})}
            swapped = copy.deepcopy(best_doc)
            for track in swapped['tracks']:
                if track['id'] in zones:
                    track['instrument']['params']['samples'] = zones[track['id']]
            assert swapped == spar_doc, 'Spar differs beyond sample zones'
            assert not web.MISSING, sorted(web.MISSING)
            assert not out['info'].get('web_missing')
            for result in (out, spar):
                assert result['hash'] == hashlib.sha1(result['render'].encode()).hexdigest()[:16]
            out['info']['compose_s'] = 0
            entry = dict(v=web.VERSION, S=seed, n=n, **out, hash_spar=spar['hash'],
                         spar_samples=zones, spar_ok=True, n_first=session.n_first)
            write(args.bank / 'jazz' / f'{n}.json.gz', entry)
            print(f"{n+1}/{args.count} {out['hash']} {out['info']['feel']}", flush=True)
        for genre, count in index['counts'].items():
            if genre == 'jazz':
                continue
            for n in range(count):
                path = args.bank / genre / f'{n}.json.gz'
                entry = json.loads(gzip.decompress(path.read_bytes()))
                entry['v'] = entry['recipe']['v'] = web.VERSION
                write(path, entry)
        index['v'] = web.VERSION
        index['counts']['jazz'] = args.count
        (args.bank / 'index.json').write_text(json.dumps(index, separators=(',', ':')) + '\n')
        print('Bank complete:', index, flush=True)

if __name__ == '__main__':
    main()
