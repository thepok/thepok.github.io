#!/usr/bin/env python3
"""Rebuild new-age bank with the shipped browser composer; restamp other genres.

Example (backup must be outside the checkout and is never overwritten):
  python music/endless/py/rebuild_bank.py --backup /tmp/endless-bank-before --jobs 4

Uses each existing entry's original session seed and best-of-eight policy. An
entry is the FIRST session piece; its `n` is a bank index, not a stream offset.
No reseeding or relaxed checks: failures abort publication of bank/index.json.
Audio is not rendered. Both piano modes are recipe-replayed and the compact
spar zone replacement is verified against the complete compiled document.
New compose_s is zero (wall-clock timing is not reproducible); gzip mtime is zero.
"""
import argparse
import concurrent.futures
import copy
import gzip
import hashlib
import json
import multiprocessing
import os
from pathlib import Path
import shutil
import sys
import tempfile
import zipfile

WEB = None


def read(path):
    return json.loads(gzip.decompress(Path(path).read_bytes()))


def write(path, data):
    path = Path(path)
    raw = json.dumps(data, ensure_ascii=False, separators=(',', ':')).encode()
    temporary = path.with_suffix(path.suffix + '.tmp')
    temporary.write_bytes(gzip.compress(raw, compresslevel=9, mtime=0))
    temporary.replace(path)


def initialize(mirror):
    global WEB
    os.environ['AGENTSOUND_WEB_REPO'] = mirror
    os.environ['AGENTSOUND_ASSETS'] = str(Path(mirror) / 'assets')
    os.environ['AGENTSOUND_SAMPLES'] = str(Path(mirror) / 'assets/samples')
    sys.path.insert(0, mirror)
    import compose_web
    WEB = compose_web


def build(job):
    source, destination = map(Path, job)
    old = read(source)
    assert old['info']['index'] == 1, 'Bank entry is not a first session piece'
    assert old['n_first'] == 8, 'Unexpected best-of-N policy'
    WEB.MISSING.clear()
    session = WEB.Session('new-age', old['S'], 'beste', first_candidates=8, candidates=8)
    out = session.next()
    replay = WEB.compose_recipe(out['recipe'])
    assert out['render'] == replay['render'] and out['hash'] == replay['hash'], 'beste recipe mismatch'
    spar_recipe = dict(out['recipe'], p='spar')
    spar = WEB.compose_recipe(spar_recipe)
    best_doc, spar_doc = json.loads(out['render']), json.loads(spar['render'])
    zones = {t['id']: t['instrument']['params']['samples'] for t in spar_doc['tracks']
             if 'samples' in t.get('instrument', {}).get('params', {})}
    swapped = copy.deepcopy(best_doc)
    for track in swapped['tracks']:
        if track['id'] in zones:
            track['instrument']['params']['samples'] = zones[track['id']]
    assert swapped == spar_doc, 'spar differs beyond sample zones'
    assert hashlib.sha1(WEB.dumps(swapped).encode()).hexdigest()[:16] == spar['hash'], 'spar swap hash mismatch'
    assert not WEB.MISSING, f'Missing sample tables: {sorted(WEB.MISSING)}'
    for result in (out, spar):
        assert result['hash'] == hashlib.sha1(result['render'].encode()).hexdigest()[:16]
        assert not result['info'].get('web_missing')
    out['info']['compose_s'] = 0
    data = dict(v=WEB.VERSION, S=old['S'], n=old['n'], **out,
                hash_spar=spar['hash'], spar_samples=zones, spar_ok=True, n_first=8)
    write(destination, data)
    return {'entry': source.name, 'S': old['S'], 'n': old['n'],
            'old_winning_seed': old['recipe']['s'], 'winning_seed': out['recipe']['s'],
            'hash': out['hash'], 'hash_spar': spar['hash'],
            'register_texture': out['recipe']['slot'].get('register_texture'),
            'candidate_log': session.log}


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--bank', type=Path, default=Path(__file__).resolve().parent.parent / 'bank')
    parser.add_argument('--archive', type=Path, default=Path(__file__).resolve().parent / 'repo.zip')
    parser.add_argument('--backup', type=Path, required=True)
    parser.add_argument('--jobs', type=int, default=4)
    parser.add_argument('--audit', type=Path, help='default: <backup parent>/bank-rebuild-audit.json')
    args = parser.parse_args()
    bank, backup = args.bank.resolve(), args.backup.resolve()
    if bank == backup or bank in backup.parents:
        parser.error('Backup must be outside the bank directory')
    if not backup.exists():
        shutil.copytree(bank, backup)
    index = json.loads((backup / 'index.json').read_text())
    for genre, count in index['counts'].items():
        expected = {f'{n}.json.gz' for n in range(count)}
        assert {p.name for p in (backup / genre).glob('*.json.gz')} == expected
        (bank / genre).mkdir(exist_ok=True)
    audit_path = args.audit or backup.parent / 'bank-rebuild-audit.json'
    audit_path.parent.mkdir(parents=True, exist_ok=True)
    archive_hash = hashlib.sha256(args.archive.read_bytes()).hexdigest()
    records = []
    with tempfile.TemporaryDirectory(prefix='endless-bank-') as directory:
        with zipfile.ZipFile(args.archive) as archive:
            archive.extractall(directory)
        initialize(directory)
        version = WEB.VERSION
        assert version != index['v'], 'Archive version must differ from source bank'
        tasks = [(str(backup / 'new-age' / f'{n}.json.gz'), str(bank / 'new-age' / f'{n}.json.gz'))
                 for n in range(index['counts']['new-age'])]
        with concurrent.futures.ProcessPoolExecutor(max_workers=args.jobs,
                mp_context=multiprocessing.get_context('spawn'), initializer=initialize,
                initargs=(directory,)) as pool:
            futures = [pool.submit(build, task) for task in tasks]
            for future in concurrent.futures.as_completed(futures):
                record = future.result()
                records.append(record)
                audit_path.write_text(json.dumps({'version': version, 'complete': False,
                    'archive_sha256': archive_hash,
                    'entries': sorted(records, key=lambda x: x['n'])}, indent=2))
                print(f"{len(records)}/{len(tasks)} {record['entry']}: {record['old_winning_seed']} -> {record['winning_seed']}", flush=True)
        for genre, count in index['counts'].items():
            if genre == 'new-age':
                continue
            for n in range(count):
                old = read(backup / genre / f'{n}.json.gz')
                data = copy.deepcopy(old)
                data['v'] = data['recipe']['v'] = version
                check = copy.deepcopy(data)
                check['v'], check['recipe']['v'] = old['v'], old['recipe']['v']
                assert check == old, 'Unrelated genre changed'
                write(bank / genre / f'{n}.json.gz', data)
        for genre, count in index['counts'].items():
            assert len(list((bank / genre).glob('*.json.gz'))) == count
            for n in range(count):
                data = read(bank / genre / f'{n}.json.gz')
                assert data['v'] == data['recipe']['v'] == version
                assert data['hash'] == hashlib.sha1(data['render'].encode()).hexdigest()[:16]
                assert data['S'] == read(backup / genre / f'{n}.json.gz')['S']
        # Publish the manifest only after the entire bank has validated.
        assert hashlib.sha256(args.archive.read_bytes()).hexdigest() == archive_hash, 'Archive changed during build'
        (bank / 'index.json').write_text(json.dumps(dict(index, v=version), separators=(',', ':')) + '\n')
        audit = json.loads(audit_path.read_text())
        audit.update(complete=True, counts=index['counts'], other_genres_unchanged=True)
        audit_path.write_text(json.dumps(audit, indent=2))
        print('Complete:', version, index['counts'], flush=True)


if __name__ == '__main__':
    main()
