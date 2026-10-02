import test from 'node:test';
import assert from 'node:assert/strict';
import { rational, power } from '../app/js/rational.js';
import { evaluateExpression, expressionText } from '../app/js/rational-expression.js';
import { makeRng, makeProblem, signature, localizeProblem } from '../app/js/problems.js';
import { emptyProgress, recordResult, levelPlan, pickCapsule } from '../app/js/session.js';
import { SKILLS } from '../app/js/skills.js';

const value = (n, d = 1) => ({ type: 'value', value: rational(n, d) });
const pow = (base, exponent) => ({ type: 'power', base, exponent });
const neg = operand => ({ type: 'negate', operand });
const op = (type, left, right) => ({ type, left, right });

// Parse the displayed equation independently, using unreduced integer pairs.
// This catches precedence and parenthesis errors as well as wrong answers.
function readEquation(text) {
  const plain = text.replace(/[⁰¹²³⁴⁵⁶⁷⁸⁹]+/g, s => '^' + [...s].map(c => '⁰¹²³⁴⁵⁶⁷⁸⁹'.indexOf(c)).join(''))
    .replaceAll('＋', '+').replaceAll('−', '-').replaceAll('×', '*').replaceAll('÷', '/');
  const tokens = plain.match(/\d+|[()+*/^\-]/g) || [];
  assert.equal(tokens.join(''), plain);
  let at = 0;
  const calc = (a, kind, b) => kind === '+' ? [a[0] * b[1] + b[0] * a[1], a[1] * b[1]]
    : kind === '-' ? [a[0] * b[1] - b[0] * a[1], a[1] * b[1]]
    : kind === '*' ? [a[0] * b[0], a[1] * b[1]] : [a[0] * b[1], a[1] * b[0]];
  function atom() {
    if (tokens[at] === '(') {
      at++;
      const answer = sum();
      assert.equal(tokens[at++], ')');
      return answer;
    }
    assert.match(tokens[at] || '', /^\d+$/);
    return [BigInt(tokens[at++]), 1n];
  }
  function raised() {
    let base = atom();
    if (tokens[at] === '^') {
      at++;
      const exponent = Number(tokens[at++]);
      assert.ok(Number.isInteger(exponent) && exponent > 0 && exponent <= 4);
      let answer = [1n, 1n];
      for (let i = 0; i < exponent; i++) answer = calc(answer, '*', base);
      base = answer;
    }
    return base;
  }
  function unary() {
    if (tokens[at] === '-') { at++; const a = unary(); return [-a[0], a[1]]; }
    return raised();
  }
  function product() {
    let a = unary();
    while (['*', '/'].includes(tokens[at])) { const kind = tokens[at++]; a = calc(a, kind, unary()); }
    return a;
  }
  function sum() {
    let a = product();
    while (['+', '-'].includes(tokens[at])) { const kind = tokens[at++]; a = calc(a, kind, product()); }
    return a;
  }
  const answer = sum();
  assert.equal(at, tokens.length);
  assert.notEqual(answer[1], 0n);
  return answer;
}

test('powers preserve exact large fractions and reject exponents outside positive integers', () => {
  assert.deepEqual(power(rational(-2, 3), 3), { n: '-8', d: '27' });
  assert.deepEqual(power(rational(-2, 3), 4), { n: '16', d: '81' });
  assert.deepEqual(power(rational(0), 4), { n: '0', d: '1' });
  assert.deepEqual(power(rational('9007199254740993'), 2), { n: '81129638414606699710187514626049', d: '1' });
  for (const exponent of [0, -1, 1.5, NaN, Infinity, '2', Number.MAX_SAFE_INTEGER + 1]) {
    assert.throws(() => power(rational(0), exponent), RangeError);
  }
});

test('displayed signs, parentheses and equal-priority operations have their mathematical meaning', () => {
  const examples = [
    [pow(value(-2), 2), '(-2)²', '4'],
    [neg(pow(value(2), 2)), '−2²', '-4'],
    [pow(value(-2), 3), '(-2)³', '-8'],
    [pow(value(-2, 3), 2), '(-2/3)²', '4/9'],
    [pow(value(0), 3), '0³', '0'],
    [op('add', value(-2), op('mul', value(3), value(4))), '(-2)＋3×4', '10'],
    [op('mul', op('div', value(8), value(2)), value(3)), '8÷2×3', '12'],
    [op('div', value(8), op('mul', value(2), value(3))), '8÷(2×3)', '4/3'],
    [op('sub', value(5), op('sub', value(3), value(1))), '5−(3−1)', '3'],
    [op('sub', pow(op('add', value(-2), value(5)), 2), value(4)), '((-2)＋5)²−4', '5'],
    [op('div', value(0), value(-3)), '0÷(-3)', '0'],
  ];
  for (const [expression, text, expected] of examples) {
    assert.equal(expressionText(expression), text);
    const answer = evaluateExpression(expression);
    assert.equal(answer.d === '1' ? answer.n : `${answer.n}/${answer.d}`, expected);
    const [n, d] = readEquation(text);
    assert.equal(BigInt(answer.n) * d, n * BigInt(answer.d));
  }
  assert.throws(() => evaluateExpression(op('div', value(1), op('sub', value(2), value(2)))), RangeError);
});

test('new generated equations independently validate exact answers, notation, input and save round-trips', () => {
  const rng = makeRng(20261002), variants = new Set(), exponents = new Set();
  let negativeBase = false, zeroBase = false, fractionBase = false;
  const results = new Set();
  for (const id of ['sk7-power', 'sk7-mixed']) {
    for (let i = 0; i < 1000; i++) {
      const p = makeProblem(id, rng), [n, d] = readEquation(p.displayText);
      assert.ok(p.cols <= 13 && p.rows <= 6, p.text);
      assert.equal(BigInt(p.exactAnswer.n) * d, n * BigInt(p.exactAnswer.d), p.text);
      assert.ok(BigInt(p.exactAnswer.d) > 0n);
      const gcd = (a, b) => b ? gcd(b, a % b) : a < 0n ? -a : a;
      assert.equal(gcd(BigInt(p.exactAnswer.n), BigInt(p.exactAnswer.d)), 1n);
      assert.equal(p.steps.map(s => s.digit).join(''), p.exactAnswer.d === '1'
        ? p.exactAnswer.n : p.exactAnswer.d + p.exactAnswer.n);
      variants.add(p.variant);
      results.add(p.exactAnswer.n === '0' ? 'zero' : BigInt(p.exactAnswer.n) < 0n ? 'negative' : 'positive');
      if (p.exactAnswer.d !== '1') results.add('fraction');
      if (id === 'sk7-power') {
        const powered = p.expression.type === 'negate' ? p.expression.operand : p.expression;
        exponents.add(powered.exponent);
        negativeBase ||= BigInt(powered.base.value.n) < 0n;
        zeroBase ||= powered.base.value.n === '0';
        fractionBase ||= powered.base.value.d !== '1';
      }
      const copy = JSON.parse(JSON.stringify(p));
      assert.equal(signature(copy), signature(p));
      assert.deepEqual(localizeProblem(copy), p);
    }
  }
  assert.deepEqual(exponents, new Set([2, 3, 4]));
  assert.ok(negativeBase && zeroBase && fractionBase);
  assert.deepEqual(results, new Set(['positive', 'negative', 'zero', 'fraction']));
  for (const kind of ['outside-minus', 'base-power', 'precedence', 'brackets', 'power-first', 'power-brackets', 'left-to-right']) assert.ok(variants.has(kind));
});

test('power and mixed practice integrate with progress and review without changing old skills or placement', () => {
  const rng = makeRng(102), prog = emptyProgress();
  prog.skills['g1-compose10'] = { n: 2, hist: [1, 0], mastered: false, recent: ['legacy'] };
  const old = structuredClone(prog.skills['g1-compose10']);
  for (const id of ['sk7-power', 'sk7-mixed']) {
    const p = makeProblem(id, rng);
    recordResult(prog, id, false, signature(p), { problem: p, at: 1, day: '2026-08-01', ms: 8000, cells: p.steps.length, misses: 1 });
    prog.review.push({ skill: id, problem: p });
    const restored = JSON.parse(JSON.stringify(prog));
    assert.deepEqual(localizeProblem(restored.review.at(-1).problem), p);
    assert.equal(restored.skills[id].n, 1);
    assert.deepEqual(restored.skills['g1-compose10'], old);
    restored.skills[id].mastered = true;
    restored.skills[id].lastOk = 1;
    assert.equal(pickCapsule(restored, Date.now(), new Set([id])).skill, id);
    restored.placed = true;
    assert.ok(levelPlan(restored, 10, rng).basic.every(skill => !skill.startsWith('sk7-')));
    assert.equal(pickCapsule(restored, Date.now(), new Set(SKILLS.map(s => s.id))), null);
  }
});
