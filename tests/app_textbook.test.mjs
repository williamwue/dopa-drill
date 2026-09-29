import test from 'node:test';
import assert from 'node:assert/strict';
import { CURRICULA, curriculumUnitsForSkill, curriculumSkillsOfGrade } from '../app/js/curricula/index.js';
import { TEXTBOOK_SKILLS, SKILL, SKILLS } from '../app/js/skills.js';
import { rational, calculate } from '../app/js/rational.js';
import { makeRng, makeProblem, localizeProblem, signature } from '../app/js/problems.js';
import { emptyProgress, recordResult, levelPlan, pickCapsule } from '../app/js/session.js';
import { catalogs } from '../app/js/i18n.js';

test('textbook mappings declare partial coverage and support shared review skills', () => {
  const books = Object.values(CURRICULA).filter(c => c.id !== 'general-calculation');
  const mapped = books.flatMap(c => c.units.flatMap(u => u.skills));
  assert.equal(mapped.length, 21);
  assert.deepEqual(new Set(mapped), new Set(TEXTBOOK_SKILLS.map(s => s.id)));
  for (const c of books) {
    assert.ok(c.sources.length >= 2);
    assert.equal(c.status, 'public-index-cross-checked');
    for (const u of c.units) {
      assert.equal(u.term, 'upper');
      assert.equal(u.status, u.skills.length ? 'partial' : 'uncovered');
      for (const id of u.skills) assert.ok(SKILL[id]);
    }
  }
  for (const s of TEXTBOOK_SKILLS) {
    assert.ok(!SKILLS.some(old => old.id === s.id));
    assert.ok(catalogs['zh-CN'][s.nameKey] && catalogs.ja[s.nameKey]);
  }
  const shared = { units: [{grade: 3, skills: ['sj3-mul-carry']}, {grade: 3, skills: ['sj3-mul-carry']}] };
  assert.equal(curriculumUnitsForSkill('sj3-mul-carry', shared).length, 2);
  assert.deepEqual(curriculumSkillsOfGrade(3, shared), ['sj3-mul-carry']);
});

test('exact fractions normalize sign and zero, reject zero division and preserve large integers', () => {
  assert.deepEqual(rational(-6, -8), {n: '3', d: '4'});
  assert.deepEqual(rational(0, -8), {n: '0', d: '1'});
  assert.deepEqual(calculate(rational(1, 3), 'add', rational(1, 6)), rational(1, 2));
  assert.deepEqual(calculate(rational(-1, 3), 'sub', rational(-1, 3)), rational(0));
  assert.deepEqual(calculate(rational(-2, 3), 'mul', rational(-9, 4)), rational(3, 2));
  assert.deepEqual(calculate(rational(-2, 3), 'div', rational(4, 5)), rational(-5, 6));
  assert.deepEqual(calculate(rational('9007199254740993'), 'add', rational(1)), rational('9007199254740994'));
  assert.throws(() => rational(1, 0), RangeError);
  assert.throws(() => rational(Number.MAX_SAFE_INTEGER + 1), RangeError);
  assert.throws(() => calculate(rational(1), 'div', rational(0)), RangeError);
});

test('primary subskills guarantee their advertised constraints, including carry and zero quotient', () => {
  const rng = makeRng(9030);
  let zeroFactor = false, oneFactor = false;
  let short2 = false, long2 = false, short3 = false, long3 = false, middleQ = false, endQ = false;
  for (const skill of TEXTBOOK_SKILLS.filter(s => s.id.startsWith('sj3-'))) {
    for (let i = 0; i < 500; i++) {
      const p = makeProblem(skill.id, rng), mode = skill.gen[1].mode;
      if (skill.gen[0] === 'textbookOrder') {
        const expression = p.text.replaceAll('×', '*').replaceAll('÷', '/').replaceAll('−', '-');
        assert.match(expression, /^[\d ()+*/-]+$/);
        assert.equal(Number(p.answer), Function(`return (${expression})`)());
        assert.ok(Number.isInteger(Number(p.answer)) && Number(p.answer) >= 0);
      } else if (skill.gen[0] === 'textbookMul') {
        assert.equal(Number(p.answer), p.a * p.b);
        zeroFactor ||= p.b === 0; oneFactor ||= p.b === 1;
        if (mode === 'hundreds') assert.equal(p.a % 100, 0);
        if (mode === 'middle-zero') assert.match(String(p.a), /^[1-9]0[1-9]$/);
        if (mode === 'end-zero') assert.equal(p.a % 10, 0);
        if (mode === '2digit') assert.ok(p.a >= 10 && p.a < 100);
        if (mode === '3digit') assert.ok(p.a >= 100 && p.a < 1000);
        if (mode === 'carry') {
          const first = (p.a % 10) * p.b;
          assert.ok(first >= 10);
          assert.ok((Math.floor(p.a / 10) % 10) * p.b + Math.floor(first / 10) >= 10);
        }
      } else {
        const q = Math.floor(p.a / p.b);
        assert.equal(p.rem, p.a % p.b);
        assert.ok(p.rem >= 0 && p.rem < p.b);
        if (mode !== 'remainder') assert.equal(p.rem, 0);
        else assert.ok(p.rem > 0);
        if (mode === '2digit-exact') { assert.ok(p.a < 100); short2 ||= q < 10; long2 ||= q >= 10; }
        if (mode === '3digit-exact') { assert.ok(p.a >= 100); short3 ||= q < 100; long3 ||= q >= 100; }
        if (mode === 'short-quotient') assert.ok(p.a >= 100 && q < 100);
        if (mode === 'zero-quotient') { assert.match(String(q), /0/); middleQ ||= /^[1-9]0[1-9]$/.test(String(q)); endQ ||= q % 10 === 0; }
      }
    }
  }
  assert.ok(short2 && long2 && short3 && long3 && middleQ && endQ && zeroFactor && oneFactor);
});

test('signed generators cover zero and all sign pairs with independently verified rational identities', () => {
  const rng = makeRng(7100), signPairs = new Set();
  let zero = false, negativeFraction = false, negativeInteger = false;
  for (const skill of TEXTBOOK_SKILLS.filter(s => s.id.startsWith('sk7-'))) {
    for (let i = 0; i < 500; i++) {
      const p = makeProblem(skill.id, rng);
      const [a, b] = p.operands.map(v => ({n: BigInt(v.n), d: BigInt(v.d)}));
      const n = BigInt(p.exactAnswer.n), d = BigInt(p.exactAnswer.d);
      assert.ok(d > 0n);
      if (p.operation === 'add') assert.equal(n * a.d * b.d, (a.n * b.d + b.n * a.d) * d);
      if (p.operation === 'sub') assert.equal(n * a.d * b.d, (a.n * b.d - b.n * a.d) * d);
      if (p.operation === 'mul') assert.equal(n * a.d * b.d, a.n * b.n * d);
      if (p.operation === 'div') { assert.notEqual(b.n, 0n); assert.equal(n * a.d * b.n, a.n * b.d * d); }
      if (p.operation === 'opposite') {
        assert.equal(n * a.d, -a.n * d);
        assert.deepEqual(p.cells.filter(c => c.kind === 'op').map(c => c.text), ['−', '(', ')', '＝']);
      }
      if (p.operation === 'absolute') {
        assert.equal(n * a.d, (a.n < 0n ? -a.n : a.n) * d);
        assert.deepEqual(p.cells.filter(c => c.kind === 'op').map(c => c.text), ['|', '|', '＝']);
      }
      signPairs.add(`${Math.sign(Number(a.n))},${Math.sign(Number(b.n))}`);
      zero ||= n === 0n; negativeFraction ||= n < 0n && d > 1n; negativeInteger ||= n < 0n && d === 1n;
      const typed = p.steps.map(s => s.digit).join('');
      assert.equal(typed, d === 1n ? String(n) : `${d}${n}`);
      const copy = JSON.parse(JSON.stringify(p));
      copy.title = 'old-language-title';
      assert.equal(signature(copy), signature(p));
      assert.deepEqual(localizeProblem(copy), p);
    }
  }
  assert.ok(zero && negativeFraction && negativeInteger);
  for (const pair of ['1,1', '1,-1', '-1,1', '-1,-1']) assert.ok(signPairs.has(pair));
});

test('new skill progress and saved review survive JSON without changing old records or general placement', () => {
  const prog = emptyProgress(), rng = makeRng(20);
  prog.skills['g1-compose10'] = {n: 2, hist: [1,0], mastered: false, recent: ['legacy']};
  const old = structuredClone(prog.skills['g1-compose10']);
  const p = makeProblem('sk7-div', rng);
  recordResult(prog, p.skill, false, signature(p), {problem: p, at: 1, day: '2026-08-01', ms: 8000, cells: p.steps.length, misses: 1});
  prog.review.push({skill: p.skill, problem: p});
  const saved = JSON.parse(JSON.stringify(prog));
  assert.deepEqual(saved.skills['g1-compose10'], old);
  assert.deepEqual(localizeProblem(saved.review[0].problem), p);
  saved.placed = true;
  saved.skills[p.skill].mastered = true;
  saved.skills[p.skill].lastOk = 1;
  const plan = levelPlan(saved, 10, rng);
  assert.ok(plan.basic.every(id => !id.startsWith('sk7-')));
  assert.equal(pickCapsule(saved, Date.now(), new Set(SKILLS.map(s => s.id))), null);
  assert.equal(pickCapsule(saved, Date.now(), new Set([p.skill])).skill, p.skill);
});
