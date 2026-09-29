// The app's existing practice order. It is not a mapping to any country's textbook.
export default {
  id: 'general-calculation',
  label: 'General calculation practice',
  edition: '1',
  status: 'app-defined',
  units: [
    { id: 'general-g1', titleKey: 'curricula.generalCalculation.grade1', grade: 1, term: null, skills: ['g1-compose10', 'g1-add-nc', 'g1-sub-nb', 'g1-add-c', 'g1-sub-b', 'g1-add3', 'g1-add-2d1', 'g1-sub-2d1'], source: 'original-app-order', status: 'app-defined' },
    { id: 'general-g2', titleKey: 'curricula.generalCalculation.grade2', grade: 2, term: null, skills: ['g2-vadd2-nc', 'g2-vadd2-c', 'g2-vsub2-nb', 'g2-vsub2-b', 'g2-vadd3s', 'g2-vsub3s', 'g2-kuku25', 'g2-kuku34', 'g2-kuku67', 'g2-kuku891', 'g2-kuku-mix', 'g2-mul-tens', 'g2-frac-of'], source: 'original-app-order', status: 'app-defined' },
    { id: 'general-g3', titleKey: 'curricula.generalCalculation.grade3', grade: 3, term: null, skills: ['g3-vadd3', 'g3-vsub3', 'g3-vadd4', 'g3-vsub4', 'g3-div-basic', 'g3-div-rem', 'g3-div-tens', 'g3-vmul-2x1', 'g3-vmul-3x1', 'g3-vmul-2x2', 'g3-vmul-3x2', 'g3-dec-add1', 'g3-dec-sub1', 'g3-frac-same'], source: 'original-app-order', status: 'app-defined' },
    { id: 'general-g4', titleKey: 'curricula.generalCalculation.grade4', grade: 4, term: null, skills: ['g4-vdiv-2d1', 'g4-vdiv-3d1', 'g4-vdiv-2d2', 'g4-vdiv-3d2', 'g4-order', 'g4-round', 'g4-dec-add2', 'g4-dec-mul', 'g4-dec-div', 'g4-frac-mixed'], source: 'original-app-order', status: 'app-defined' },
    { id: 'general-g5', titleKey: 'curricula.generalCalculation.grade5', grade: 5, term: null, skills: ['g5-dec-mul', 'g5-dec-div', 'g5-gcd', 'g5-lcm', 'g5-frac-reduce', 'g5-frac-diff', 'g5-frac-int', 'g5-percent'], source: 'original-app-order', status: 'app-defined' },
    { id: 'general-g6', titleKey: 'curricula.generalCalculation.grade6', grade: 6, term: null, skills: ['g6-frac-mul', 'g6-frac-div', 'g6-frac-dec', 'g6-ratio', 'g6-letter'], source: 'original-app-order', status: 'app-defined' },
  ],
};
