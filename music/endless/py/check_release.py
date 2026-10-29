#!/usr/bin/env python3
"""Read-only release verification, including optional independent recipe replay.

  python music/endless/py/check_release.py --baseline-ref 801f7765 --replay

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
VERSION = 'web9-jazz-2'
PERFORM_SHA = '2bdc44ff99744e5b3703f8a550023e2153fc2435ca62f3226b0898cd45290991'
BASE_ARCHIVE_SHA = 'f7898db6b2368224b4daffc82b6c186871022c3804f51a66a928624818c5de78'


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


def sample_zones(instrument):
    """All real-file zones, including sampler layers of Hero Sax stacks."""
    for zone in instrument.get('params', {}).get('samples', []):
        if isinstance(zone.get('file'), str) and not zone['file'].startswith('*'):
            yield zone
    if instrument.get('type') == 'stack':
        for layer in instrument.get('params', {}).get('layers', []):
            yield from sample_zones(layer['instrument'])


def real_sample_covers(instrument, pitch, velocity):
    """Check quartet coverage after stack velocity remapping, excluding breath oscillators."""
    params = instrument.get('params', {})
    if instrument['type'] == 'stack':
        for layer in params.get('layers', []):
            if not (layer.get('keylo', 0) <= pitch <= layer.get('keyhi', 127) and
                    layer.get('vello', 0) <= velocity <= layer.get('velhi', 127)):
                continue
            transformed = max(1 / 127, min(1, (velocity / 127) ** layer.get('velcurve', 1) * layer.get('velscale', 1)))
            if real_sample_covers(layer['instrument'], pitch + layer.get('transpose', 0), round(127 * transformed)):
                return True
        return False
    pitch += params.get('transpose', 0)
    return any(z.get('lo', 0) <= pitch <= z.get('hi', 127) and
               z.get('vello', 0) <= velocity <= z.get('velhi', 127)
               for z in sample_zones(instrument))


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
    manifest = json.loads((WEB / 'source-version.json').read_text())
    require(manifest['version'] == VERSION, 'Source manifest version differs')
    require(sha(archive) == manifest['archive_sha256'], 'Archive differs from source manifest')
    index = json.loads((WEB / 'bank/index.json').read_text())
    require(index['v'] == VERSION, 'Bank manifest version differs from archive')
    samples = json.loads((WEB / 'samples/index.json').read_text())
    orchestra = json.loads((WEB / 'samples/orch/index.json').read_text())
    jazz = json.loads((WEB / 'samples/jazz/index.json').read_text())
    for group, files in samples.items():
        for name, digest in files.items():
            path = WEB / 'samples' / group / name
            require(path.is_file(), f'Manifest sample missing: {group}/{name}')
            require(hashlib.sha1(path.read_bytes()).hexdigest()[:len(digest)] == digest,
                    f'Manifest sample hash differs: {group}/{name}')
    paths = [f'music/endless/bank/{g}/{n}.json.gz' for g, count in index['counts'].items() for n in range(count)]
    old_paths = [p for p in paths if '/jazz/' not in p]
    baseline = baseline_files(args.baseline_ref, old_paths) if args.baseline_ref else {}
    require(set(index['counts']) == {'new-age', 'klassik', 'walzer', 'orchester', 'jazz'}, 'Unexpected genres')
    require(index['counts']['jazz'] > 0, 'Jazz bank is empty')
    recipes, expected, old_recipes, old_expected = [], [], [], []
    jazz_values = {key: [] for key in ('hash', 'feel', 'layout', 'form', 'key', 'tempo')}
    with tempfile.TemporaryDirectory(prefix='endless-release-check-') as temporary:
        temporary = Path(temporary); mirror = temporary / 'current'
        with zipfile.ZipFile(HERE / 'repo.zip') as z:
            require(sha(z.read('agentsound/endless/perform.py')) == PERFORM_SHA, 'Performer source differs')
            for name, digest in manifest['changed_source_sha256'].items():
                require(sha(z.read(name)) == digest, f'Source manifest hash differs: {name}')
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
                        for zone in sample_zones(track['instrument']):
                            file = zone['file']
                            if genre == 'orchester':
                                require(file in orchestra, f'{label}: missing orchestra mapping {file}')
                                group, name = 'orch', orchestra[file][0] + '.opus'
                            elif genre == 'jazz' and not file.startswith('samples/splendid-grand-piano/'):
                                require(file in jazz, f'{label}: missing jazz mapping {file}')
                                group, name = 'jazz', jazz[file][0] + '.opus'
                            else:
                                group = mode
                                name = Path(file).stem.replace(' ', '_').replace('#', 's') + '.opus'
                            require(name in samples[group] and (WEB / 'samples' / group / name).is_file(),
                                    f'{label}: unavailable sample {group}/{name}')
                if genre == 'jazz':
                    for key in jazz_values:
                        jazz_values[key].append(entry['hash'] if key == 'hash' else entry['info'][key])
                    require({t['id'] for t in doc['tracks']} == {'comp', 'piano', 'bass', 'drums', 'sax'},
                            f'{label}: quartet roles differ')
                    for track in doc['tracks']:
                        require(bool(track['notes']), f'{label}: empty {track["id"]} part')
                        require(all(real_sample_covers(track['instrument'], n[2], n[3]) for n in track['notes']),
                                f'{label}: note without real sample coverage in {track["id"]}')
                if genre == 'new-age':
                    require(entry['recipe']['slot'].get('register_texture') in ('statement', 'answer', 'lyrical'),
                            f'{label}: missing profile pin')
                    require(entry['n_first'] == 8 and entry['info']['compose_s'] == 0, f'{label}: build policy')
                if baseline and genre != 'jazz':
                    old = json.loads(gzip.decompress(baseline[path]))
                    require(entry['S'] == old['S'] and entry['n'] == old['n'], f'{label}: reseeded')
                    normalized = dict(entry, v=old['v'], recipe=dict(entry['recipe'], v=old['recipe']['v']))
                    require(normalized == old, f'{label}: existing payload changed')
                    if n == 0:
                        old_recipes.append(old['recipe']); old_expected.append(old['hash'])
                if n == 0:
                    for mode in (('beste', 'spar') if genre in ('new-age', 'jazz') else ('beste',)):
                        recipes.append(dict(entry['recipe'], p=mode))
                        expected.append(entry['hash_spar' if mode == 'spar' else 'hash'])
        require(len(set(jazz_values['hash'])) == index['counts']['jazz'], 'Jazz bank contains duplicate renders')
        require(len(set(jazz_values['feel'])) == 5, 'Jazz opening bank lacks feel diversity')
        require(len(set(jazz_values['layout'])) >= 4, 'Jazz opening bank lacks arrangement diversity')
        require(len(set(jazz_values['form'])) == 3, 'Jazz opening bank lacks form diversity')
        if args.baseline_ref:
            tree = git('ls-tree', '-r', '--format=%(objectname) %(path)', args.baseline_ref,
                       'music/endless/engine', 'music/endless/samples').decode().splitlines()
            objects = [line.split(' ', 1) for line in tree]
            objects = [(digest, path) for digest, path in objects if path != 'music/endless/samples/index.json']
            names = [path for _, path in objects]
            actual_hashes = subprocess.check_output(
                ['git', '-C', str(ROOT), 'hash-object', '--stdin-paths'],
                input=''.join(str(ROOT / path) + '\n' for path in names).encode()).decode().splitlines()
            require(actual_hashes == [digest for digest, _ in objects], 'Engine/sample asset changed')
            current_names = {str(p.relative_to(ROOT)) for directory in ('engine', 'samples')
                             for p in (WEB / directory).rglob('*') if p.is_file()}
            added = current_names - set(names) - {'music/endless/samples/index.json'}
            require(set(names).issubset(current_names), 'Existing engine/sample asset removed')
            require(all(p.startswith('music/endless/samples/jazz/') for p in added),
                    'New assets outside jazz sample set')
            old_samples = json.loads(git('show', f'{args.baseline_ref}:music/endless/samples/index.json'))
            require({k: v for k, v in samples.items() if k != 'jazz'} == old_samples,
                    'Existing sample manifest changed')
            old_index = json.loads(git('show', f'{args.baseline_ref}:music/endless/bank/index.json'))
            require({k: v for k, v in index['counts'].items() if k != 'jazz'} == old_index['counts'],
                    'Existing bank inventory changed')
            old_archive = git('show', f'{args.baseline_ref}:music/endless/py/repo.zip')
            require(sha(old_archive) == BASE_ARCHIVE_SHA, 'Unexpected baseline archive')
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
                      'jazz_diversity': {k: len(set(v)) for k, v in jazz_values.items()},
                      'baseline_compared': args.baseline_ref, 'recipe_replay': args.replay, 'status': 'passed'}))


if __name__ == '__main__':
    main()
