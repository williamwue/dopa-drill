# Curriculum and skill catalog

`app/js/skills.js` defines 58 reusable calculation skills. A skill ID identifies its generator parameters, prerequisites, tree lane, localized display name key, and pedagogy timing. Existing progress remains keyed by these IDs; this change requires no saved data migration.

`app/js/curricula/general-calculation.js` assigns every skill to one unit and a grade. It preserves the app's original ordering and grade assignments. Its `status: 'app-defined'` and `source: 'original-app-order'` mean this is general calculation practice, not a Chinese national curriculum or a textbook edition. `term` is `null` because the original app did not establish semester placement. The `edition` value versions this app-defined mapping.

Each curriculum has `id`, `label`, `edition`, `status`, and `units`. A unit has `id`, `titleKey`, `grade`, `term`, `skills`, `source`, and `status`. `getCurriculum(id)`, `curriculumUnitForSkill(skillId, id)`, `curriculumGradeForSkill(skillId, id)`, and `curriculumSkillsOfGrade(grade, id)` in `app/js/curricula/index.js` read this mapping. These accessors also accept a curriculum object so a new mapping can be previewed independently. New curriculum claims need an explicit source and review of every placement; changing only a label is insufficient.

The `grade` property on `SKILL[id]` remains for current session, tree, record, and trophy consumers. It is derived from the default curriculum. `skillsOfGrade(grade, curriculumId)` accepts a curriculum ID or object and returns the corresponding skill definitions.

`SKILL[id].timing.comboGrade` holds the original numeric timing level. `comboWindowMs(grade, first)` remains available for compatibility. New skill-aware call sites should use `skillComboWindowMs(skillId, first)`, which reads that timing level. Moving a skill to another curriculum grade therefore does not silently change its combo window.

Skill names and lane labels use flat `skills.*` keys in `app/locales/skills.zh-CN.js` and `app/locales/skills.ja.js`. The `name` getter and lane array accessors call `t(key)` on access, so a locale change is reflected when the UI renders again.
