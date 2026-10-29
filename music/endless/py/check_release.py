#!/usr/bin/env python3
"""Read-only release verification, including optional independent recipe replay.

  python music/endless/py/check_release.py --baseline-ref 5b44e517 --replay

Requires only Python and (with --baseline-ref) git. No downloads or audio renders.
The shipped archive supplies the exact render serializer. Temporary mirrors and
replay results are removed on exit; the checkout is never modified.
"""
import argparse
import copy
import gzip
import hashlib
import json
import os
from pathlib import Path
import subprocess
import sys
import tempfile
import zipfile

HERE = Path(__file__).resolve().parent
ROOT = HERE.parents[2]
WEB = HERE.parent
VERSION = 'web8-register-2bdc44ff'
PERFORM_SHA = '2bdc44ff99744e5b3703f8a550023e2153fc2435ca62f3226b0898cd45290991'
ARCHIVE_SHA = 'f7898db6b2368224b4daffc82b6c186871022c3804f51a66a928624818c5de78'


def require(condition, message):
    if not condition:
        raise RuntimeError(message)


def sha(data):
    return hashlib.sha256(data).hexdigest()


def git(*args):
    return subprocess.check_output(['git', '-C', str(ROOT), *args])


def baseline_files(ref, paths):
    """Read many blobs in one git process, preserving compressed/binary bytes."""
    requests = ''.join(f'{ref}:{p}\n' for p in paths).encode()
    data = subprocess.check_output(['git', '-C', str(ROOT), 'cat-file', '--batch'], input=requests)
    result, offset = {}, 0
    for path in paths:
        end = data.index(b'\n', offset)
        header = data[offset:end].split()
        require(len(header) == 3 and header[1] == b'blob', f'Baseline blob missing: {path}')
        length = int(header[2]); offset = end + 1
        result[path] = data[offset:offset + length]; offset += length + 1
    return result


def replay_worker(mirror, request):
    os.environ['AGENTSOUND_WEB_REPO'] = str(mirror)
    os.environ['AGENTSOUND_ASSETS'] = str(mirror / 'assets')
    os.environ['AGENTSOUND_SAMPLES'] = str(mirror / 'assets/samples')
    sys.path.insert(0, str(mirror))
    import compose_web
    rows = []
    for recipe in json.loads(request.read_text()):
        first = compose_web.compose_recipe(recipe)
        second = compose_web.compose_recipe(recipe)
        require(first['render'] == second['render'], 'Recipe is not deterministic')
        require(first['recipe']['slot'] == recipe['slot'], 'Replay changed slot pins')
        require(not compose_web.MISSING, f'Missing sample table: {compose_web.MISSING}')
        rows.append({'hash': first['hash'], 'old_version': first['info'].get('other_version'),
                     'version': first['recipe']['v']})
    print(json.dumps(rows))


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--baseline-ref', help='Compare unchanged assets/genres with this local git revision')
    parser.add_argument('--replay', action='store_true', help='Double-replay selected recipes in isolated processes')
    parser.add_argument('--_worker', nargs=2, help=argparse.SUPPRESS)
    args = parser.parse_args()
    if args._worker:
        replay_worker(*(Path(x) for x in args._worker)); return
    archive = (HERE / 'repo.zip').read_bytes()
    require(sha(archive) == ARCHIVE_SHA, 'Archive is not the reviewed release')
    index = json.loads((WEB / 'bank/index.json').read_text())
    require(index['v'] == VERSION, 'Bank manifest version differs from archive')
    samples = json.loads((WEB / 'samples/index.json').read_text())
    orchestra = json.loads((WEB / 'samples/orch/index.json').read_text())
    paths = [f'music/endless/bank/{g}/{n}.json.gz' for g, count in index['counts'].items() for n in range(count)]
    baseline = baseline_files(args.baseline_ref, paths) if args.baseline_ref else {}
    recipes, expected, old_recipes, old_expected = [], [], [], []
    with tempfile.TemporaryDirectory(prefix='endless-release-check-') as temporary:
        temporary = Path(temporary); mirror = temporary / 'current'
        with zipfile.ZipFile(HERE / 'repo.zip') as z:
            require(sha(z.read('agentsound/endless/perform.py')) == PERFORM_SHA, 'Performer source differs')
            require(f"VERSION = '{VERSION}'" in z.read('compose_web.py').decode(), 'Adapter version differs')
            z.extractall(mirror)
        sys.path.insert(0, str(mirror))
        from agentsound.song import dumps
        for genre, count in index['counts'].items():
            actual = {p.name for p in (WEB / 'bank' / genre).glob('*.json.gz')}
            require(actual == {f'{n}.json.gz' for n in range(count)}, f'{genre}: bank inventory differs')
            for n in range(count):
                path = f'music/endless/bank/{genre}/{n}.json.gz'
                raw = (ROOT / path).read_bytes(); entry = json.loads(gzip.decompress(raw))
                label = f'{genre}/{n}'
                require(entry['v'] == entry['recipe']['v'] == VERSION, f'{label}: stale version')
                require(int.from_bytes(raw[4:8], 'little') == 0, f'{label}: nondeterministic gzip timestamp')
                require(not entry['info'].get('web_missing'), f'{label}: missing sample tables')
                require(entry['hash'] == hashlib.sha1(entry['render'].encode()).hexdigest()[:16], f'{label}: render hash')
                doc = json.loads(entry['render']); spar = copy.deepcopy(doc)
                for track in spar['tracks']:
                    if track['id'] in entry['spar_samples']:
                        track['instrument']['params']['samples'] = entry['spar_samples'][track['id']]
                require(hashlib.sha1(dumps(spar).encode()).hexdigest()[:16] == entry['hash_spar'], f'{label}: spar hash')
                for mode, document in (('beste', doc), ('spar', spar)):
                    for track in document['tracks']:
                        for zone in track['instrument'].get('params', {}).get('samples', []):
                            file = zone['file']
                            if genre == 'orchester':
                                require(file in orchestra, f'{label}: missing orchestra mapping {file}')
                                group, name = 'orch', orchestra[file][0] + '.opus'
                            else:
                                group = mode
                                name = Path(file).stem.replace(' ', '_').replace('#', 's') + '.opus'
                            require(name in samples[group] and (WEB / 'samples' / group / name).is_file(),
                                    f'{label}: unavailable sample {group}/{name}')
                if genre == 'new-age':
                    require(entry['recipe']['slot'].get('register_texture') in ('statement', 'answer', 'lyrical'),
                            f'{label}: missing profile pin')
                    require(entry['n_first'] == 8 and entry['info']['compose_s'] == 0, f'{label}: build policy')
                if baseline:
                    old = json.loads(gzip.decompress(baseline[path]))
                    require(entry['S'] == old['S'] and entry['n'] == old['n'], f'{label}: reseeded')
                    if genre != 'new-age':
                        normalized = dict(entry, v=old['v'], recipe=dict(entry['recipe'], v=old['recipe']['v']))
                        require(normalized == old, f'{label}: unrelated payload changed')
                        if n == 0:
                            old_recipes.append(old['recipe']); old_expected.append(old['hash'])
                if n == 0:
                    for mode in (('beste', 'spar') if genre == 'new-age' else ('beste',)):
                        recipes.append(dict(entry['recipe'], p=mode))
                        expected.append(entry['hash_spar' if mode == 'spar' else 'hash'])
        if args.baseline_ref:
            tree = git('ls-tree', '-r', '--format=%(objectname) %(path)', args.baseline_ref,
                       'music/endless/engine', 'music/endless/samples').decode().splitlines()
            objects = [line.split(' ', 1) for line in tree]
            names = [path for _, path in objects]
            actual_hashes = subprocess.check_output(
                ['git', '-C', str(ROOT), 'hash-object', '--stdin-paths'],
                input=''.join(str(ROOT / path) + '\n' for path in names).encode()).decode().splitlines()
            require(actual_hashes == [digest for digest, _ in objects], 'Engine/sample asset changed')
            current_names = {str(p.relative_to(ROOT)) for directory in ('engine', 'samples')
                             for p in (WEB / directory).rglob('*') if p.is_file()}
            require(current_names == set(names), 'Engine/sample inventory changed')
        if args.replay:
            def run(mirror_path, request):
                request_path = temporary / 'recipes.json'; request_path.write_text(json.dumps(request))
                return json.loads(subprocess.check_output([sys.executable, str(Path(__file__).resolve()),
                                  '--_worker', str(mirror_path), str(request_path)]))
            replayed = run(mirror, recipes)
            require([x['hash'] for x in replayed] == expected, 'Current recipe differs from bank')
            require(all(x['old_version'] is None and x['version'] == VERSION for x in replayed), 'Current recipe version')
            if args.baseline_ref:
                old_zip = temporary / 'old.zip'; old_zip.write_bytes(git('show', f'{args.baseline_ref}:music/endless/py/repo.zip'))
                old_mirror = temporary / 'old'
                with zipfile.ZipFile(old_zip) as z:
                    z.extractall(old_mirror)
                require([x['hash'] for x in run(old_mirror, old_recipes)] == old_expected, 'Baseline recipe mismatch')
                migrated = run(mirror, old_recipes)
                require([x['hash'] for x in migrated] == old_expected, 'Unrelated genre replay changed')
                require(all(x['old_version'] == r['v'] for x, r in zip(migrated, old_recipes)), 'Old-version warning missing')
    print(json.dumps({'version': VERSION, 'bank_entries': sum(index['counts'].values()),
                      'baseline_compared': args.baseline_ref, 'recipe_replay': args.replay, 'status': 'passed'}))


if __name__ == '__main__':
    main()
