// Reusable calculation skills. Placement belongs to the selected curriculum;
// timing is a separate pedagogy setting preserved from the original game.
import { t } from './i18n.js';
import { curriculumGradeForSkill, curriculumSkillsOfGrade } from './curricula/index.js';

const LANE_KEYS = ['skills.lane.addSub', 'skills.lane.mulDiv', 'skills.lane.decFrac', 'skills.lane.other'];
export const LANES = Array.from({ length: LANE_KEYS.length });
LANE_KEYS.forEach((key, index) => Object.defineProperty(LANES, index, { get: () => t(key), enumerable: true }));

// Mastery / unlock rule (provisional): 5 first-try clears in the last 6 attempts.
export const MASTERY = { window: 6, need: 5 };

const DEFINITIONS = [
  // ---------------------------------------------------------------- grade 1
  { id: 'g1-compose10', nameKey: 'skills.g1-compose10', timing: { comboGrade: 1 }, lane: 0, req: [], gen: ['compose', { total: 10 }] },
  { id: 'g1-add-nc', nameKey: 'skills.g1-add-nc', timing: { comboGrade: 1 }, lane: 0, req: [], gen: ['hadd', { a: [1, 9], b: [1, 9], carry: 'none' }] },
  { id: 'g1-sub-nb', nameKey: 'skills.g1-sub-nb', timing: { comboGrade: 1 }, lane: 0, req: ['g1-add-nc'], gen: ['hsub', { a: [2, 10], b: [1, 9], borrow: 'none' }] },
  { id: 'g1-add-c', nameKey: 'skills.g1-add-c', timing: { comboGrade: 1 }, lane: 0, req: ['g1-compose10', 'g1-add-nc'], gen: ['hadd', { a: [2, 9], b: [2, 9], carry: 'yes' }] },
  { id: 'g1-sub-b', nameKey: 'skills.g1-sub-b', timing: { comboGrade: 1 }, lane: 0, req: ['g1-add-c', 'g1-sub-nb'], gen: ['hsub', { a: [11, 18], b: [2, 9], borrow: 'yes' }] },
  { id: 'g1-add3', nameKey: 'skills.g1-add3', timing: { comboGrade: 1 }, lane: 0, req: ['g1-sub-b'], gen: ['add3', {}] },
  { id: 'g1-add-2d1', nameKey: 'skills.g1-add-2d1', timing: { comboGrade: 1 }, lane: 0, req: ['g1-add-c'], gen: ['hadd', { a: [11, 89], b: [1, 9], carry: 'none', tensToo: true }] },
  { id: 'g1-sub-2d1', nameKey: 'skills.g1-sub-2d1', timing: { comboGrade: 1 }, lane: 0, req: ['g1-sub-b', 'g1-add-2d1'], gen: ['hsub', { a: [11, 99], b: [1, 9], borrow: 'none', tensToo: true }] },

  // ---------------------------------------------------------------- grade 2
  { id: 'g2-vadd2-nc', nameKey: 'skills.g2-vadd2-nc', timing: { comboGrade: 2 }, lane: 0, req: ['g1-add-2d1'], gen: ['vadd', { da: 2, db: 2, carry: 'none', maxDigits: 2 }] },
  { id: 'g2-vadd2-c', nameKey: 'skills.g2-vadd2-c', timing: { comboGrade: 2 }, lane: 0, req: ['g2-vadd2-nc', 'g1-add-c'], gen: ['vadd', { da: 2, db: [1, 2], carry: 'some', maxDigits: 2 }] },
  { id: 'g2-vsub2-nb', nameKey: 'skills.g2-vsub2-nb', timing: { comboGrade: 2 }, lane: 0, req: ['g1-sub-2d1'], gen: ['vsub', { da: 2, db: 2, borrow: 'none' }] },
  { id: 'g2-vsub2-b', nameKey: 'skills.g2-vsub2-b', timing: { comboGrade: 2 }, lane: 0, req: ['g2-vsub2-nb', 'g1-sub-b'], gen: ['vsub', { da: 2, db: [1, 2], borrow: 'some' }] },
  { id: 'g2-vadd3s', nameKey: 'skills.g2-vadd3s', timing: { comboGrade: 2 }, lane: 0, req: ['g2-vadd2-c'], gen: ['vadd', { da: 2, db: 2, carry: 'many', maxDigits: 3 }] },
  { id: 'g2-vsub3s', nameKey: 'skills.g2-vsub3s', timing: { comboGrade: 2 }, lane: 0, req: ['g2-vsub2-b', 'g2-vadd3s'], gen: ['vsub', { da: 3, db: 2, borrow: 'some', aMax: 199 }] },
  { id: 'g2-kuku25', nameKey: 'skills.g2-kuku25', timing: { comboGrade: 2 }, lane: 1, req: ['g1-add-c'], gen: ['kuku', { dans: [5, 2] }] },
  { id: 'g2-kuku34', nameKey: 'skills.g2-kuku34', timing: { comboGrade: 2 }, lane: 1, req: ['g2-kuku25'], gen: ['kuku', { dans: [3, 4] }] },
  { id: 'g2-kuku67', nameKey: 'skills.g2-kuku67', timing: { comboGrade: 2 }, lane: 1, req: ['g2-kuku34'], gen: ['kuku', { dans: [6, 7] }] },
  { id: 'g2-kuku891', nameKey: 'skills.g2-kuku891', timing: { comboGrade: 2 }, lane: 1, req: ['g2-kuku67'], gen: ['kuku', { dans: [8, 9, 1] }] },
  { id: 'g2-kuku-mix', nameKey: 'skills.g2-kuku-mix', timing: { comboGrade: 2 }, lane: 1, req: ['g2-kuku891'], gen: ['kuku', { dans: [1, 2, 3, 4, 5, 6, 7, 8, 9] }] },
  { id: 'g2-mul-tens', nameKey: 'skills.g2-mul-tens', timing: { comboGrade: 2 }, lane: 1, req: ['g2-kuku-mix'], gen: ['mulTens', {}] },
  { id: 'g2-frac-of', nameKey: 'skills.g2-frac-of', timing: { comboGrade: 2 }, lane: 2, req: ['g2-kuku25'], gen: ['fracOf', { dens: [2, 4] }] },

  // ---------------------------------------------------------------- grade 3
  { id: 'g3-vadd3', nameKey: 'skills.g3-vadd3', timing: { comboGrade: 3 }, lane: 0, req: ['g2-vadd3s'], gen: ['vadd', { da: 3, db: 3, carry: 'some', maxDigits: 3 }] },
  { id: 'g3-vsub3', nameKey: 'skills.g3-vsub3', timing: { comboGrade: 3 }, lane: 0, req: ['g2-vsub3s'], gen: ['vsub', { da: 3, db: [2, 3], borrow: 'some' }] },
  { id: 'g3-vadd4', nameKey: 'skills.g3-vadd4', timing: { comboGrade: 3 }, lane: 0, req: ['g3-vadd3'], gen: ['vadd', { da: 4, db: [3, 4], carry: 'many', maxDigits: 4 }] },
  { id: 'g3-vsub4', nameKey: 'skills.g3-vsub4', timing: { comboGrade: 3 }, lane: 0, req: ['g3-vsub3'], gen: ['vsub', { da: 4, db: [3, 4], borrow: 'zero' }] },
  { id: 'g3-div-basic', nameKey: 'skills.g3-div-basic', timing: { comboGrade: 3 }, lane: 1, req: ['g2-kuku-mix'], gen: ['div', { exact: true }] },
  { id: 'g3-div-rem', nameKey: 'skills.g3-div-rem', timing: { comboGrade: 3 }, lane: 1, req: ['g3-div-basic'], gen: ['divRem', {}] },
  { id: 'g3-div-tens', nameKey: 'skills.g3-div-tens', timing: { comboGrade: 3 }, lane: 1, req: ['g3-div-basic'], gen: ['divTens', {}] },
  { id: 'g3-vmul-2x1', nameKey: 'skills.g3-vmul-2x1', timing: { comboGrade: 3 }, lane: 1, req: ['g2-mul-tens'], gen: ['vmul', { da: 2, db: 1 }] },
  { id: 'g3-vmul-3x1', nameKey: 'skills.g3-vmul-3x1', timing: { comboGrade: 3 }, lane: 1, req: ['g3-vmul-2x1'], gen: ['vmul', { da: 3, db: 1 }] },
  { id: 'g3-vmul-2x2', nameKey: 'skills.g3-vmul-2x2', timing: { comboGrade: 3 }, lane: 1, req: ['g3-vmul-2x1'], gen: ['vmul', { da: 2, db: 2 }] },
  { id: 'g3-vmul-3x2', nameKey: 'skills.g3-vmul-3x2', timing: { comboGrade: 3 }, lane: 1, req: ['g3-vmul-2x2', 'g3-vmul-3x1'], gen: ['vmul', { da: 3, db: 2 }] },
  { id: 'g3-dec-add1', nameKey: 'skills.g3-dec-add1', timing: { comboGrade: 3 }, lane: 2, req: ['g2-vadd2-c'], gen: ['vdec', { op: 'add', places: 1 }] },
  { id: 'g3-dec-sub1', nameKey: 'skills.g3-dec-sub1', timing: { comboGrade: 3 }, lane: 2, req: ['g3-dec-add1', 'g2-vsub2-b'], gen: ['vdec', { op: 'sub', places: 1 }] },
  { id: 'g3-frac-same', nameKey: 'skills.g3-frac-same', timing: { comboGrade: 3 }, lane: 2, req: ['g2-frac-of'], gen: ['frac', { op: 'addsub', same: true, maxOne: true }] },

  // ---------------------------------------------------------------- grade 4
  { id: 'g4-vdiv-2d1', nameKey: 'skills.g4-vdiv-2d1', timing: { comboGrade: 4 }, lane: 1, req: ['g3-div-rem', 'g3-div-tens'], gen: ['vdiv', { dd: 2, ds: 1 }] },
  { id: 'g4-vdiv-3d1', nameKey: 'skills.g4-vdiv-3d1', timing: { comboGrade: 4 }, lane: 1, req: ['g4-vdiv-2d1'], gen: ['vdiv', { dd: 3, ds: 1 }] },
  { id: 'g4-vdiv-2d2', nameKey: 'skills.g4-vdiv-2d2', timing: { comboGrade: 4 }, lane: 1, req: ['g4-vdiv-2d1', 'g3-vmul-2x1'], gen: ['vdiv', { dd: 2, ds: 2 }] },
  { id: 'g4-vdiv-3d2', nameKey: 'skills.g4-vdiv-3d2', timing: { comboGrade: 4 }, lane: 1, req: ['g4-vdiv-2d2', 'g4-vdiv-3d1'], gen: ['vdiv', { dd: 3, ds: 2 }] },
  { id: 'g4-order', nameKey: 'skills.g4-order', timing: { comboGrade: 4 }, lane: 3, req: ['g2-kuku-mix', 'g2-vsub2-b'], gen: ['order', {}] },
  { id: 'g4-round', nameKey: 'skills.g4-round', timing: { comboGrade: 4 }, lane: 3, req: ['g3-vadd4'], gen: ['round', {}] },
  { id: 'g4-dec-add2', nameKey: 'skills.g4-dec-add2', timing: { comboGrade: 4 }, lane: 2, req: ['g3-dec-sub1'], gen: ['vdec', { op: 'addsub', places: 2 }] },
  { id: 'g4-dec-mul', nameKey: 'skills.g4-dec-mul', timing: { comboGrade: 4 }, lane: 2, req: ['g4-dec-add2', 'g3-vmul-2x1'], gen: ['vmul', { da: 2, db: 1, pa: 1 }] },
  { id: 'g4-dec-div', nameKey: 'skills.g4-dec-div', timing: { comboGrade: 4 }, lane: 2, req: ['g4-dec-mul', 'g4-vdiv-2d1'], gen: ['decDivInt', {}] },
  { id: 'g4-frac-mixed', nameKey: 'skills.g4-frac-mixed', timing: { comboGrade: 4 }, lane: 2, req: ['g3-frac-same'], gen: ['frac', { op: 'addsub', same: true, mixed: true }] },

  // ---------------------------------------------------------------- grade 5
  { id: 'g5-dec-mul', nameKey: 'skills.g5-dec-mul', timing: { comboGrade: 5 }, lane: 2, req: ['g4-dec-mul'], gen: ['vmul', { da: 2, db: 2, pa: 1, pb: 1 }] },
  { id: 'g5-dec-div', nameKey: 'skills.g5-dec-div', timing: { comboGrade: 5 }, lane: 2, req: ['g4-dec-div', 'g5-dec-mul'], gen: ['decDivDec', {}] },
  { id: 'g5-gcd', nameKey: 'skills.g5-gcd', timing: { comboGrade: 5 }, lane: 3, req: ['g3-div-basic'], gen: ['gcdlcm', { kind: 'gcd' }] },
  { id: 'g5-lcm', nameKey: 'skills.g5-lcm', timing: { comboGrade: 5 }, lane: 3, req: ['g5-gcd'], gen: ['gcdlcm', { kind: 'lcm' }] },
  { id: 'g5-frac-reduce', nameKey: 'skills.g5-frac-reduce', timing: { comboGrade: 5 }, lane: 2, req: ['g5-gcd', 'g4-frac-mixed'], gen: ['frac', { op: 'reduce' }] },
  { id: 'g5-frac-diff', nameKey: 'skills.g5-frac-diff', timing: { comboGrade: 5 }, lane: 2, req: ['g5-frac-reduce', 'g5-lcm'], gen: ['frac', { op: 'addsub', same: false }] },
  { id: 'g5-frac-int', nameKey: 'skills.g5-frac-int', timing: { comboGrade: 5 }, lane: 2, req: ['g5-frac-reduce'], gen: ['frac', { op: 'muldivInt' }] },
  { id: 'g5-percent', nameKey: 'skills.g5-percent', timing: { comboGrade: 5 }, lane: 3, req: ['g4-dec-mul'], gen: ['percent', {}] },

  // ---------------------------------------------------------------- grade 6
  { id: 'g6-frac-mul', nameKey: 'skills.g6-frac-mul', timing: { comboGrade: 6 }, lane: 2, req: ['g5-frac-int'], gen: ['frac', { op: 'mul' }] },
  { id: 'g6-frac-div', nameKey: 'skills.g6-frac-div', timing: { comboGrade: 6 }, lane: 2, req: ['g6-frac-mul'], gen: ['frac', { op: 'div' }] },
  { id: 'g6-frac-dec', nameKey: 'skills.g6-frac-dec', timing: { comboGrade: 6 }, lane: 2, req: ['g6-frac-div', 'g5-dec-div'], gen: ['frac', { op: 'decimal' }] },
  { id: 'g6-ratio', nameKey: 'skills.g6-ratio', timing: { comboGrade: 6 }, lane: 3, req: ['g5-lcm'], gen: ['ratio', {}] },
  { id: 'g6-letter', nameKey: 'skills.g6-letter', timing: { comboGrade: 6 }, lane: 3, req: ['g4-order'], gen: ['letter', {}] },
];

// Keep the grade field for current consumers while placement is read from the
// default curriculum. Names resolve on access so changing locale updates UI.
export const SKILLS = DEFINITIONS.map((definition) => ({
  ...definition,
  grade: curriculumGradeForSkill(definition.id),
  get name() { return t(this.nameKey); },
}));

export const SKILL = Object.fromEntries(SKILLS.map((s) => [s.id, s]));

// Depth in the tree = longest prerequisite chain (roots are 0).
export const DEPTH = (() => {
  const memo = {};
  const d = (id) => memo[id] ?? (memo[id] = SKILL[id].req.length ? 1 + Math.max(...SKILL[id].req.map(d)) : 0);
  for (const s of SKILLS) d(s.id);
  return memo;
})();

export const skillsOfGrade = (grade, curriculumId) => curriculumSkillsOfGrade(grade, curriculumId).map((id) => SKILL[id]);
