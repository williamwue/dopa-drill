import test from 'node:test';
import assert from 'node:assert/strict';
import ja from '../app/locales/content.ja.js';
import zh from '../app/locales/content.zh-CN.js';

const placeholders = (message) => [...message.matchAll(/\{([a-zA-Z]\w*)\}/g)].map((m) => m[1]).sort();

test('content catalogs have the same keys and matching placeholders', () => {
  assert.deepEqual(Object.keys(zh).sort(), Object.keys(ja).sort());
  for (const key of Object.keys(ja)) {
    assert.match(key, /^content\./);
    assert.equal(typeof ja[key], 'string', key);
    assert.equal(typeof zh[key], 'string', key);
    assert.ok(ja[key].length && zh[key].length, key);
    assert.deepEqual(placeholders(zh[key]), placeholders(ja[key]), key);
  }
});

test('content catalogs cover every static key used by content modules', async () => {
  const { readFile } = await import('node:fs/promises');
  const modules = ['problems', 'session', 'quests', 'trophies', 'unlocks'];
  for (const name of modules) {
    const source = await readFile(new URL(`../app/js/${name}.js`, import.meta.url), 'utf8');
    for (const [, key] of source.matchAll(/(?:\bt\(['"])(content\.[\w.]+)(?:['"])/g)) {
      assert.ok(Object.hasOwn(zh, key), `${name}: ${key}`);
    }
  }
});

test('display translations leave answer separators in the Japanese machine format', () => {
  assert.equal(ja['content.problem.remainderAnswer'], '{quotient} あまり {remainder}');
  assert.equal(zh['content.problem.remainderAnswer'], '商 {quotient}，余 {remainder}');
  assert.equal(ja['content.problem.mixedNumber'], '{whole}と{fraction}');
  assert.equal(zh['content.problem.mixedNumber'], '{whole}又{fraction}');
});

test('saved problems refresh their display text without changing answer or signature', async () => {
  const { localizeProblem, signature } = await import('../app/js/problems.js');
  const { t } = await import('../app/js/i18n.js');
  const old = {
    kind: 'h', title: 'あまりのあるわりざん', text: '20 ÷ 8', answer: '2 あまり 4',
    cells: [{ id: 'word', kind: 'word', r: 0, c: 0, rs: 1, cs: 2, text: 'あまり' }, { id: 'input', kind: 'input', r: 0, c: 2, text: '4' }],
    lines: [], steps: [{ label: '商', hint: '20の中に8はいくつ', help: { text: '8のだん 8 16 24' } }],
  };
  localizeProblem(old);
  assert.equal(old.title, t('content.problem.title.divRemainder'));
  assert.equal(old.answer, '2 あまり 4');
  assert.equal(signature(old), 'あまりのあるわりざん|20 ÷ 8');
  assert.equal(old.cells[0].text, t('content.problem.word.remainder'));
  assert.equal(old.steps[0].hint, t('content.problem.howMany', { total: 20, number: 8 }));
  assert.match(old.answerText, new RegExp(t('content.problem.remainderAnswer', { quotient: 2, remainder: 4 })));
});
