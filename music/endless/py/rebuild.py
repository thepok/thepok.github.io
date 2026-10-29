#!/usr/bin/env python3
"""Reproduce the browser piano and jazz release from pinned baseline plus overlays.

Run `python music/endless/py/rebuild.py` from a checkout with baseline commit
5b44e517 available. Alternatively pass --baseline path/to/original/repo.zip.
The reviewed piano patch is applied first, then the checked jazz overlay.
The WASM engine and existing composition modules remain pinned.
"""
from __future__ import annotations

import argparse
import hashlib
import io
import json
from pathlib import Path
import subprocess
import tempfile
import zipfile

HERE = Path(__file__).resolve().parent
ROOT = HERE.parents[2]
BASE_COMMIT = '5b44e5175ba86d72a59b2aa46ce6c011d7befeb2'
BASE_SHA256 = '24158ca3d9b3a4ffc34f9d55d5338bb1b51b7ea65f3ead850b00a973ef0c80a4'
PERFORM_SHA256 = '2bdc44ff99744e5b3703f8a550023e2153fc2435ca62f3226b0898cd45290991'
VERSION = 'web8-register-2bdc44ff'
FILES = ('agentsound/endless/perform.py', 'agentsound/endless/composer.py', 'compose_web.py')


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--baseline', type=Path, help='Original pinned archive; hash must match')
    parser.add_argument('--out', type=Path, default=HERE / 'repo.zip')
    args = parser.parse_args()
    baseline = args.baseline.read_bytes() if args.baseline else subprocess.run(
        ['git', '-C', str(ROOT), 'show', f'{BASE_COMMIT}:music/endless/py/repo.zip'],
        check=True, capture_output=True).stdout
    if hashlib.sha256(baseline).hexdigest() != BASE_SHA256:
        parser.error('Baseline archive differs from the reviewed pinned release')
    with zipfile.ZipFile(io.BytesIO(baseline)) as source, tempfile.TemporaryDirectory(prefix='piano-web-') as work:
        work = Path(work)
        for name in FILES:
            path = work / name
            path.parent.mkdir(parents=True, exist_ok=True)
            path.write_text(source.read(name).decode('utf-8-sig').replace('\r\n', '\n'), encoding='utf-8', newline='\n')
        subprocess.run(['git', 'apply', '--check', str(HERE / 'register-dialogue.patch')], cwd=work, check=True)
        subprocess.run(['git', 'apply', str(HERE / 'register-dialogue.patch')], cwd=work, check=True)
        changed = {name: (work / name).read_bytes() for name in FILES}
        if hashlib.sha256(changed[FILES[0]]).hexdigest() != PERFORM_SHA256:
            raise RuntimeError('Patched performer no longer matches the reviewed piano implementation')
        if f"VERSION = '{VERSION}'".encode() not in changed['compose_web.py']:
            raise RuntimeError('Browser adapter version mismatch')
        overlay = HERE / 'jazz-overlay'
        if overlay.exists():
            manifest = json.loads((HERE / 'jazz-overlay.json').read_text())
            with zipfile.ZipFile(HERE / 'jazz-assets.zip') as assets:
                payload = {name: assets.read(name) for name in assets.namelist()}
            payload.update({p.relative_to(overlay).as_posix(): p.read_bytes()
                            for p in overlay.rglob('*') if p.is_file()})
            actual = set(payload)
            if actual != set(manifest):
                raise RuntimeError('Jazz overlay inventory differs from its manifest')
            for name, digest in manifest.items():
                data = payload[name]
                if hashlib.sha256(data).hexdigest() != digest:
                    raise RuntimeError('Jazz overlay hash differs: ' + name)
                changed[name] = data
        args.out.parent.mkdir(parents=True, exist_ok=True)
        temporary = args.out.with_name(args.out.name + '.tmp')
        with zipfile.ZipFile(temporary, 'w', zipfile.ZIP_DEFLATED, compresslevel=9) as target:
            for entry in source.infolist():
                target.writestr(entry, changed.get(entry.filename, source.read(entry)))
            for name in sorted(set(changed) - set(source.namelist())):
                entry = zipfile.ZipInfo(name, date_time=(2026, 1, 1, 0, 0, 0))
                entry.compress_type = zipfile.ZIP_DEFLATED
                entry.external_attr = 0o100644 << 16
                target.writestr(entry, changed[name])
        temporary.replace(args.out)
    print(f'{args.out}: {hashlib.sha256(args.out.read_bytes()).hexdigest()}')


if __name__ == '__main__':
    main()
