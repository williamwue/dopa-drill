#!/usr/bin/env python3
"""Build a static Pages release with one content-addressed module graph.

GitHub Pages ignores app/_headers. Versioning only main.js does not invalidate
its relative imports, so each release gives the entire graph a new base path.
The source remains directly runnable and testable without a bundler.
"""
import hashlib
import json
from pathlib import Path
import shutil
import sys


def build(destination, source=None):
    source = (source or Path(__file__).resolve().parents[1] / 'app').resolve()
    destination = Path(destination).resolve()
    if destination == source or source in destination.parents:
        raise ValueError('Release output must be outside app/')
    if destination.exists() and any(destination.iterdir()):
        raise ValueError('Release output must be empty')
    files = sorted((p for p in source.rglob('*') if p.is_file() and p.name != '.DS_Store'),
                   key=lambda p: p.relative_to(source).as_posix())
    digest = hashlib.sha256()
    for path in files:
        digest.update(path.relative_to(source).as_posix().encode() + b'\0')
        digest.update(hashlib.sha256(path.read_bytes()).digest())
    revision = digest.hexdigest()[:16]
    destination.mkdir(parents=True, exist_ok=True)
    # Retain the unversioned paths for visitors finishing an older loaded page.
    for path in files:
        target = destination / path.relative_to(source)
        target.parent.mkdir(parents=True, exist_ok=True)
        shutil.copyfile(path, target)
    asset_root = destination / 'assets' / revision
    asset_root.mkdir(parents=True)
    for name in ('js', 'locales', 'fonts'):
        shutil.copytree(source / name, asset_root / name)
    shutil.copyfile(source / 'style.css', asset_root / 'style.css')
    html = (source / 'index.html').read_text(encoding='utf-8')
    for name in ('style.css', 'js/main.js'):
        old = f'"{name}"'
        if old not in html:
            raise ValueError(f'Missing entry reference: {name}')
        html = html.replace(old, f'"assets/{revision}/{name}"')
    (destination / 'index.html').write_text(html, encoding='utf-8', newline='\n')
    (destination / 'release.json').write_text(json.dumps({'revision': revision}, indent=2) + '\n', encoding='utf-8', newline='\n')
    return revision


if __name__ == '__main__':
    if len(sys.argv) != 2:
        raise SystemExit('Usage: python3 tools/build_preview.py EMPTY_OUTPUT_DIRECTORY')
    print(build(sys.argv[1]))
