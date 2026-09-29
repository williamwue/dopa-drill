import generalCalculation from './general-calculation.js';

export const DEFAULT_CURRICULUM_ID = generalCalculation.id;
export const CURRICULA = Object.freeze({ [generalCalculation.id]: generalCalculation });

// Callers may pass a curriculum object to preview a future mapping without
// changing the default curriculum or the skill's pedagogy timing.
export function getCurriculum(id = DEFAULT_CURRICULUM_ID) {
  if (typeof id === 'object' && id !== null) return id;
  const curriculum = CURRICULA[id];
  if (!curriculum) throw new RangeError(`Unknown curriculum: ${id}`);
  return curriculum;
}

export function curriculumUnitForSkill(skillId, curriculumId = DEFAULT_CURRICULUM_ID) {
  return getCurriculum(curriculumId).units.find((unit) => unit.skills.includes(skillId)) ?? null;
}

export function curriculumGradeForSkill(skillId, curriculumId = DEFAULT_CURRICULUM_ID) {
  return curriculumUnitForSkill(skillId, curriculumId)?.grade ?? null;
}

export function curriculumSkillsOfGrade(grade, curriculumId = DEFAULT_CURRICULUM_ID) {
  return getCurriculum(curriculumId).units.filter((unit) => unit.grade === grade).flatMap((unit) => unit.skills);
}
