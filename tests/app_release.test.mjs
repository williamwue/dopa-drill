import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdtemp, readFile, access, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { execFileSync } from 'node:child_process';

test('Pages release isolates all imports and fonts under the same deterministic asset revision', async () => {
  const root = await mkdtemp(join(tmpdir(), 'dopa-release-test-'));
  try {
    const script = new URL('../tools/build_preview.py', import.meta.url);
    const build = (out) => execFileSync('python3', [script.pathname, out], {encoding: 'utf8'}).trim();
    const a = join(root, 'a'), b = join(root, 'b');
    const revision = build(a);
    assert.equal(build(b), revision);
    assert.match(revision, /^[0-9a-f]{16}$/);
    const html = await readFile(join(a, 'index.html'), 'utf8');
    assert.ok(html.includes(`src="assets/${revision}/js/main.js"`));
    assert.ok(html.includes(`href="assets/${revision}/style.css"`));
    const base = new URL(`file://${a}/assets/${revision}/`);
    const visited = new Set();
    async function imports(url) {
      if (visited.has(url.href)) return;
      visited.add(url.href);
      assert.ok(url.href.startsWith(base.href), url.href);
      const source = await readFile(url, 'utf8');
      for (const [, relative] of source.matchAll(/(?:from\s+|import\s*)['"]([^'"]+)['"]/g)) {
        await imports(new URL(relative, url));
      }
    }
    await imports(new URL('js/main.js', base));
    assert.ok(visited.size > 20);
    const css = await readFile(new URL('style.css', base), 'utf8');
    for (const [, path] of css.matchAll(/url\("([^"]+)"\)/g)) await access(new URL(path, base));
    await access(join(a, '.nojekyll'));
    assert.deepEqual(JSON.parse(await readFile(join(a, 'release.json'), 'utf8')), {revision});
    assert.throws(() => build(a)); // Never overwrite an existing directory.
  } finally { await rm(root, {recursive: true, force: true}); }
});
