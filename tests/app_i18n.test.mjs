import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import { catalogs, translate, resolveLocale } from '../app/js/i18n.js';
const placeholders = (s) => [...new Set([...s.matchAll(/\{([a-zA-Z][\w]*)\}/g)].map(m => m[1]))].sort();

test('Chinese and Japanese catalogs have identical keys and interpolation contracts', () => {
  assert.deepEqual(Object.keys(catalogs['zh-CN']).sort(), Object.keys(catalogs.ja).sort());
  for (const [key, value] of Object.entries(catalogs['zh-CN'])) {
    assert.deepEqual(placeholders(value), placeholders(catalogs.ja[key]), key);
    assert.ok(value.trim(), key);
    assert.ok(!/[\u3040-\u30ff]/u.test(value), `Japanese kana in Chinese message ${key}: ${value}`);
    const params = Object.fromEntries(placeholders(value).map(k => [k, '3']));
    assert.doesNotThrow(() => translate('zh-CN', key, params), key);
  }
});

test('Chinese defaults, supported language URLs, and unsupported input are deterministic', () => {
  assert.equal(resolveLocale(), 'zh-CN');
  assert.equal(resolveLocale('?lang=ja'), 'ja');
  assert.equal(resolveLocale('?lang=zh-CN&demo'), 'zh-CN');
  assert.equal(resolveLocale('?lang=unknown'), 'zh-CN');
  assert.equal(translate('zh-CN', 'ui.level'), '适合我的练习');
  assert.equal(translate('ja', 'ui.level'), 'じぶんレベル');
  assert.equal(translate('zh-CN', 'ui.main.message001', { value1: '{literal}' }), '掌握{literal}后即可解锁');
  assert.throws(() => translate('zh-CN', 'ui.main.message001'), /Missing value1/);
});

test('all static HTML translation bindings resolve without replacing interactive subtrees', () => {
  const html = fs.readFileSync(new URL('../app/index.html', import.meta.url), 'utf8');
  for (const [, key] of html.matchAll(/data-i18n(?:-aria-label|-content)?="([^"]+)"/g)) {
    assert.ok(catalogs['zh-CN'][key], key);
    assert.equal(placeholders(catalogs['zh-CN'][key]).length, 0, key);
  }
  assert.match(html, /<html lang="zh-CN">/);
  assert.match(html, /非官方中文体验版/);
  assert.match(html, /教材适配中/);
  assert.match(html, /id="language"/);
});

test('Japanese saved problems retain math and identity when reopened in Chinese', async () => {
  const { localizeProblem, signature } = await import('../app/js/problems.js');
  const fixtures = JSON.parse(fs.readFileSync(new URL('./fixtures/upstream-saved-problems.json', import.meta.url), 'utf8'));
  for (const fixture of fixtures) {
    const source = fixture.problem;
    const localized = localizeProblem(structuredClone(source));
    assert.equal(signature(localized), fixture.signature);
    assert.equal(localized.answer, source.answer);
    assert.equal(localized.text, source.text);
    assert.deepEqual(localized.steps.map(s => s.digit), source.steps.map(s => s.digit));
    for (const text of [localized.title, localized.answerText, ...localized.steps.flatMap(s => [s.label, s.help?.text || ''])]) {
      assert.doesNotMatch(text, /[\u3040-\u30ff]/u, fixture.skill);
    }
    assert.deepEqual(localizeProblem(structuredClone(localized)), localized);
  }
});
