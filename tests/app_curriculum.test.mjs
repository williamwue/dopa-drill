import test from 'node:test';
import assert from 'node:assert/strict';
import { SKILLS, SKILL, LANES, skillsOfGrade } from '../app/js/skills.js';
import { DEFAULT_CURRICULUM_ID, getCurriculum, curriculumGradeForSkill, curriculumSkillsOfGrade, curriculumUnitForSkill } from '../app/js/curricula/index.js';
import { comboWindowMs, skillComboWindowMs } from '../app/js/scoring.js';
import zh from '../app/locales/skills.zh-CN.js';
import ja from '../app/locales/skills.ja.js';

test('the general calculation curriculum maps exactly 58 unique, valid skills once', () => {
  const curriculum = getCurriculum();
  assert.equal(DEFAULT_CURRICULUM_ID, 'general-calculation');
  assert.equal(curriculum.id, DEFAULT_CURRICULUM_ID);
  assert.equal(SKILLS.length, 58);
  assert.equal(new Set(SKILLS.map((skill) => skill.id)).size, 58);
  const mapped = curriculum.units.flatMap((unit) => unit.skills);
  assert.equal(mapped.length, 58);
  assert.equal(new Set(mapped).size, 58);
  assert.deepEqual(new Set(mapped), new Set(SKILLS.map((skill) => skill.id)));
  for (const unit of curriculum.units) {
    assert.equal(unit.term, null);
    assert.ok(unit.titleKey && unit.source && unit.status);
    for (const id of unit.skills) {
      assert.ok(SKILL[id], id);
      assert.equal(curriculumUnitForSkill(id), unit);
      assert.equal(curriculumGradeForSkill(id), unit.grade);
      assert.equal(SKILL[id].grade, unit.grade);
      assert.equal(SKILL[id].timing.comboGrade, unit.grade);
    }
  }
  for (let grade = 1; grade <= 6; grade++) {
    const ids = curriculumSkillsOfGrade(grade);
    assert.deepEqual(skillsOfGrade(grade).map((skill) => skill.id), ids);
  }
});

test('prerequisites, timing, and translations refer to the same reusable skill catalog', () => {
  assert.equal(LANES.length, 4);
  for (const skill of SKILLS) {
    for (const prerequisite of skill.req) assert.ok(SKILL[prerequisite], `${skill.id}: ${prerequisite}`);
    assert.equal(skillComboWindowMs(skill.id), comboWindowMs(skill.timing.comboGrade));
    assert.equal(skillComboWindowMs(skill.id, true), comboWindowMs(skill.timing.comboGrade, true));
    assert.ok(zh[skill.nameKey] && ja[skill.nameKey], skill.nameKey);
  }
  for (const key of ['addSub', 'mulDiv', 'decFrac', 'other']) {
    assert.ok(zh[`skills.lane.${key}`] && ja[`skills.lane.${key}`]);
  }
});

test('alternate curriculum placement leaves the skill timing unchanged', () => {
  const original = getCurriculum();
  const movedId = 'g1-compose10';
  const alternate = {
    ...original,
    id: 'test-alternate',
    units: original.units.map((unit) => ({
      ...unit,
      grade: unit.id === 'general-g1' ? 6 : unit.grade,
    })),
  };
  assert.equal(curriculumGradeForSkill(movedId, alternate), 6);
  assert.equal(curriculumGradeForSkill(movedId), 1);
  assert.equal(SKILL[movedId].grade, 1);
  assert.equal(skillComboWindowMs(movedId), comboWindowMs(1));
  assert.deepEqual(curriculumSkillsOfGrade(6, alternate).slice(0, 8), original.units[0].skills);
});

test('general calculation metadata makes no textbook or national standards claim', () => {
  const curriculum = getCurriculum();
  const metadata = JSON.stringify({ id: curriculum.id, label: curriculum.label, edition: curriculum.edition, status: curriculum.status, units: curriculum.units });
  assert.doesNotMatch(metadata, /textbook|教材|教科书|課程標準|课程标准|中国|china|人教版|苏教版/i);
});
