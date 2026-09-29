# Curriculum and skill catalog

`app/js/skills.js` defines 58 reusable calculation skills. A skill ID identifies its generator parameters, prerequisites, tree lane, localized display name key, and pedagogy timing. Existing progress remains keyed by these IDs; this change requires no saved data migration.

`app/js/curricula/general-calculation.js` assigns every skill to one unit and a grade. It preserves the app's original ordering and grade assignments. Its `status: 'app-defined'` and `source: 'original-app-order'` mean this is general calculation practice, not a Chinese national curriculum or a textbook edition. `term` is `null` because the original app did not establish semester placement. The `edition` value versions this app-defined mapping.

Each curriculum has `id`, `label`, `edition`, `status`, and `units`. A unit has `id`, `titleKey`, `grade`, `term`, `skills`, `source`, and `status`. `getCurriculum(id)`, `curriculumUnitForSkill(skillId, id)`, `curriculumGradeForSkill(skillId, id)`, and `curriculumSkillsOfGrade(grade, id)` in `app/js/curricula/index.js` read this mapping. These accessors also accept a curriculum object so a new mapping can be previewed independently. New curriculum claims need an explicit source and review of every placement; changing only a label is insufficient.

The `grade` property on `SKILL[id]` remains for current session, tree, record, and trophy consumers. It is derived from the default curriculum. `skillsOfGrade(grade, curriculumId)` accepts a curriculum ID or object and returns the corresponding skill definitions.

`SKILL[id].timing.comboGrade` holds the original numeric timing level. `comboWindowMs(grade, first)` remains available for compatibility. New skill-aware call sites should use `skillComboWindowMs(skillId, first)`, which reads that timing level. Moving a skill to another curriculum grade therefore does not silently change its combo window.

Skill names and lane labels use flat `skills.*` keys in `app/locales/skills.zh-CN.js` and `app/locales/skills.ja.js`. The `name` getter and lane array accessors call `t(key)` on access, so a locale change is reflected when the UI renders again.

## Suzhou textbook practice

`curricula/suzhou.js` adds `suzhou-g3-upper` (2025 autumn directory) and `suzhou-g7-upper` (2024 revised directory). Metadata records public index sources; `partial` means only the listed calculation skills, while `uncovered` units have no entry buttons. Textbook units use `title` for the original Chinese directory title. `curriculumUnitsForSkill` returns all matching units; grade skill lists deduplicate shared review items. The singular unit accessor remains compatible and returns the first match.

`textbook-skills.js` defines 21 new IDs (15 primary, 6 secondary). `TEXTBOOK_SKILLS` exposes these definitions and `ALL_SKILLS` combines both catalogs. `SKILL` indexes all 79 skills; `SKILLS`, default placement, the general tree and existing skill-count trophies retain their original 58-skill scope. New skills have no general grade; curriculum placement remains separate from timing. Textbook entry buttons show their own saved count and stars. They use the normal practice, score, growth, review and extra-round paths, keyed by the new IDs. General refresh practice excludes textbook skills, and time capsules are constrained to the selected practice skill or general catalog.

`rational.js` uses BigInt arithmetic and stores reduced `{ n, d }` strings, with positive denominator and canonical zero `0/1`. New signed problems store this exact answer alongside the existing answer string, so localStorage never receives a BigInt. Integer answers are entered left to right, including a minus when needed; reduced fractions use the existing denominator-then-numerator cells. The minus key is visible throughout signed practice, including positive answers, and does not add a keypad row. Non-reduced equivalent fractions are not free-form submissions: the UI explicitly requests a reduced fraction in the guided cells. A `titleKey` keeps new problem signatures stable across languages. Original answer strings, signatures, storage version and IDs are unchanged.

The homepage selection is stored separately as `dopa-curriculum`; invalid or missing values fall back to general practice. Textbook selection does not change the saved general placement. There is no account or per-child profile in this release.

## Static release cache isolation

`tools/build_preview.py` copies the complete browser resource graph into `assets/<content hash>/` and rewrites the two HTML entry URLs. Relative imports then inherit the same versioned base, including locale modules and CSS font paths. This is required for GitHub Pages, which does not apply the `_headers` file. Source modules stay directly testable; only the published artifact has versioned paths. The release directory also contains `release.json` for checking the live revision. Publishing copies the built files into the existing Pages branch without dropping previous immutable asset directories.
