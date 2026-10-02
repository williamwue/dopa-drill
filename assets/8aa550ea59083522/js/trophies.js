// Trophies (id036): many small achievements, like the ones in mobile games.
// Each series is one measure with rising steps; every step is a trophy.
// Days and streaks get dense steps; volume series get wide ones so long
// sessions are not pushed too hard (docs/SPEC.md 14.7). Nothing is
// random, conditions are always shown (except a few secrets), and a trophy,
// once earned, is kept.
import { SKILLS, LANES } from './skills.js';
import { isUnlocked, isMastered, starsOf } from './session.js';
import { t } from './i18n.js';

export const CATS = ['つづける', 'たくさん', 'スキル', 'せいちょう', 'エクストラ', 'コンボ', 'せいかく', 'ドパ', 'ふくしゅう', 'がくねん', 'コレクション', 'ひみつ'];
export const CAT_LABEL = Object.fromEntries(CATS.map((cat, i) => [cat, t(`content.trophy.cat.${i}`)]));

const fmt = (n) => (n >= 10000 && n % 10000 === 0 ? `${n / 10000}万` : n.toLocaleString('ja-JP'));
const DOPA_LABEL = Object.fromEntries(Array.from({ length: 8 }, (_, i) => [i + 2, t(`content.trophy.dopaLevel.${i + 2}`)]));
const RANKS = ['bronze', 'silver', 'gold', 'rainbow'];
export const RANK_NAME = Object.fromEntries(['bronze', 'silver', 'gold', 'rainbow', 'secret'].map((rank) => [rank, t(`content.trophy.rank.${rank}`)]));

const trophyText = (key, part, value) => {
  const params = { value, formatted: fmt(value), hours: value / 60, dopa: DOPA_LABEL[value] };
  if (key === 'minutes') {
    const duration = t(`content.trophy.minutes.duration.${value >= 60 ? 'hours' : 'minutes'}`, params);
    return part === 'name' ? t(`content.trophy.minutes.name.${value >= 60 ? 'hours' : 'minutes'}`, params) : t('content.trophy.minutes.desc', { duration });
  }
  if (key === 'hammer' && part === 'name' && value === 1) return t('content.trophy.hammer.first');
  return t(`content.trophy.${key}.${part}`, params);
};

// Rank by position in its series: first ~30% bronze, then silver, gold, and the last step rainbow.
function rankAt(i, n) {
  if (n === 1) return 'gold';
  if (i === n - 1) return 'rainbow';
  return RANKS[Math.min(2, Math.floor((i / (n - 1)) * 3.3))];
}

// A series: { key, cat, title, metric, steps, name(v), desc(v) } or explicit items.
const SERIES_DEFS = [
  { key: 'streak', cat: 'つづける', title: t('content.trophy.streak.title'), metric: 'bestStreak', steps: [3, 5, 7, 10, 14, 21, 30, 50, 75, 100, 150, 200, 365], name: (v) => trophyText('streak', 'name', v), desc: (v) => trophyText('streak', 'desc', v) },
  { key: 'days', cat: 'つづける', title: t('content.trophy.days.title'), metric: 'days', steps: [1, 3, 5, 7, 10, 15, 20, 30, 40, 50, 75, 100, 150, 200, 300, 365, 500, 730, 1000], name: (v) => trophyText('days', 'name', v), desc: (v) => trophyText('days', 'desc', v) },
  { key: 'stickers', cat: 'つづける', title: t('content.trophy.stickers.title'), metric: 'stickers', steps: [1, 7, 14, 30, 50, 100, 200, 365], name: (v) => trophyText('stickers', 'name', v), desc: (v) => trophyText('stickers', 'desc', v) },
  { key: 'crowns', cat: 'つづける', title: t('content.trophy.crowns.title'), metric: 'crowns', steps: [1, 3, 5, 10, 20, 52], name: (v) => trophyText('crowns', 'name', v), desc: (v) => trophyText('crowns', 'desc', v) },
  { key: 'problems', cat: 'たくさん', title: t('content.trophy.problems.title'), metric: 'problems', steps: [10, 30, 50, 100, 200, 300, 500, 750, 1000, 1500, 2000, 3000, 5000, 7500, 10000, 20000, 30000, 50000, 100000], name: (v) => trophyText('problems', 'name', v), desc: (v) => trophyText('problems', 'desc', v) },
  { key: 'cells', cat: 'たくさん', title: t('content.trophy.cells.title'), metric: 'cells', steps: [100, 500, 1000, 3000, 5000, 10000, 30000, 50000, 100000, 300000], name: (v) => trophyText('cells', 'name', v), desc: (v) => trophyText('cells', 'desc', v) },
  { key: 'plays', cat: 'たくさん', title: t('content.trophy.plays.title'), metric: 'plays', steps: [1, 3, 5, 10, 20, 30, 50, 100, 200, 300, 500, 1000, 2000], name: (v) => trophyText('plays', 'name', v), desc: (v) => trophyText('plays', 'desc', v) },
  { key: 'minutes', cat: 'たくさん', title: t('content.trophy.minutes.title'), metric: 'minutes', steps: [10, 30, 60, 120, 300, 600, 1200, 3000], name: (v) => trophyText('minutes', 'name', v), desc: (v) => trophyText('minutes', 'desc', v) },
  { key: 'unlocked', cat: 'スキル', title: t('content.trophy.unlocked.title'), metric: 'unlocked', steps: [3, 5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55, 58], name: (v) => trophyText('unlocked', 'name', v), desc: (v) => trophyText('unlocked', 'desc', v) },
  { key: 'mastered', cat: 'スキル', title: t('content.trophy.mastered.title'), metric: 'mastered', steps: [1, 3, 5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55, 58], name: (v) => trophyText('mastered', 'name', v), desc: (v) => trophyText('mastered', 'desc', v) },
  { key: 'gradeDone', cat: 'スキル', title: t('content.trophy.gradeDone.title'), items: [1, 2, 3, 4, 5, 6].map((g) => ({ id: `gradeDone-${g}`, metric: `gradeDone${g}`, need: 1, name: t('content.trophy.gradeDone.name', { grade: g }), desc: t('content.trophy.gradeDone.desc', { grade: g }) })) },
  { key: 'laneDone', cat: 'スキル', title: t('content.trophy.laneDone.title'), items: LANES.map((l, i) => ({ id: `laneDone-${i}`, metric: `laneDone${i}`, need: 1, name: t('content.trophy.laneDone.name', { name: l }), desc: t('content.trophy.laneDone.desc', { name: l }) })) },
  { key: 'extras', cat: 'エクストラ', title: t('content.trophy.extras.title'), metric: 'extras', steps: [1, 3, 5, 10, 20, 30, 50, 100, 200, 300], name: (v) => trophyText('extras', 'name', v), desc: (v) => trophyText('extras', 'desc', v) },
  { key: 'extraBest', cat: 'エクストラ', title: t('content.trophy.extraBest.title'), metric: 'extraBest', steps: [3, 5, 7, 10, 12, 15, 18, 20, 23, 25, 30], name: (v) => trophyText('extraBest', 'name', v), desc: (v) => trophyText('extraBest', 'desc', v) },
  { key: 'extraSolved', cat: 'エクストラ', title: t('content.trophy.extraSolved.title'), metric: 'extraSolved', steps: [10, 30, 50, 100, 200, 300, 500, 1000, 2000, 3000], name: (v) => trophyText('extraSolved', 'name', v), desc: (v) => trophyText('extraSolved', 'desc', v) },
  { key: 'combo', cat: 'コンボ', title: t('content.trophy.combo.title'), metric: 'maxCombo', steps: [5, 10, 15, 20, 30, 40, 50, 75, 100, 150, 200, 300], name: (v) => trophyText('combo', 'name', v), desc: (v) => trophyText('combo', 'desc', v) },
  { key: 'perfects', cat: 'せいかく', title: t('content.trophy.perfects.title'), metric: 'perfects', steps: [1, 3, 5, 10, 20, 30, 50, 100, 200, 300], name: (v) => trophyText('perfects', 'name', v), desc: (v) => trophyText('perfects', 'desc', v) },
  { key: 'firstTry', cat: 'せいかく', title: t('content.trophy.firstTry.title'), metric: 'firstTry', steps: [10, 50, 100, 300, 500, 1000, 3000, 5000, 10000, 30000], name: (v) => trophyText('firstTry', 'name', v), desc: (v) => trophyText('firstTry', 'desc', v) },
  { key: 'dopa', cat: 'ドパ', title: t('content.trophy.dopa.title'), metric: 'bestDopaL', steps: [2, 3, 4, 5, 6, 7, 8, 9], name: (v) => trophyText('dopa', 'name', v), desc: (v) => trophyText('dopa', 'desc', v) },
  { key: 'review', cat: 'ふくしゅう', title: t('content.trophy.review.title'), metric: 'reviewSolved', steps: [1, 5, 10, 30, 50, 100, 200, 300], name: (v) => trophyText('review', 'name', v), desc: (v) => trophyText('review', 'desc', v) },
  ...[1, 2, 3, 4, 5, 6].map((g) => ({ key: `grade${g}`, cat: 'がくねん', title: t('content.trophy.grade.title', { grade: g }), metric: `gradePlays${g}`, steps: [1, 10, 30], name: (v) => t('content.trophy.grade.name', { grade: g, value: v }), desc: (v) => t('content.trophy.grade.desc', { grade: g, value: v }) })),
  { key: 'secret', cat: 'ひみつ', title: t('content.trophy.secret.title'), items: [
    { id: 'secret-perfect14', metric: 'flag:perfect14', need: 1, name: t('content.trophy.secret.perfect14.name'), desc: t('content.trophy.secret.perfect14.desc'), secret: true },
    { id: 'secret-extraClean', metric: 'flag:extraClean', need: 1, name: t('content.trophy.secret.extraClean.name'), desc: t('content.trophy.secret.extraClean.desc'), secret: true },
    { id: 'secret-sunday', metric: 'flag:sunday', need: 1, name: t('content.trophy.secret.sunday.name'), desc: t('content.trophy.secret.sunday.desc'), secret: true },
    { id: 'secret-newyear', metric: 'flag:newyear', need: 1, name: t('content.trophy.secret.newyear.name'), desc: t('content.trophy.secret.newyear.desc'), secret: true },
    { id: 'secret-comeback', metric: 'flag:comeback', need: 1, name: t('content.trophy.secret.comeback.name'), desc: t('content.trophy.secret.comeback.desc'), secret: true },
    { id: 'secret-allmodes', metric: 'allModes', need: 1, name: t('content.trophy.secret.allmodes.name'), desc: t('content.trophy.secret.allmodes.desc'), secret: true },
  ] },
];

// Other features add their own series (id045). Keep this list append-only.
export const SERIES = [];
export const TROPHIES = [];
export const TROPHY = {};
export function addSeries(def) {
  const items = def.items
    ? def.items.map((it, i, a) => ({ rank: it.secret ? 'secret' : rankAt(i, a.length), ...it }))
    : def.steps.map((v, i, a) => ({ id: `${def.key}-${v}`, metric: def.metric, need: v, name: def.name(v), desc: def.desc(v), rank: rankAt(i, a.length) }));
  const series = { key: def.key, cat: def.cat, title: def.title, items: items.map((it) => ({ ...it, series: def.key, cat: def.cat, reward: it.reward || null })) };
  SERIES.push(series);
  for (const it of series.items) { TROPHIES.push(it); TROPHY[it.id] = it; }
  return series;
}
SERIES_DEFS.forEach(addSeries);

// id045: the features added after id036 (stars, quests, hammer, rust,
// time capsule, "のびたよ", collection).
[
  { key: 'questDays', cat: 'つづける', title: t('content.trophy.questDays.title'), metric: 'questDays', steps: [1, 3, 7, 14, 30, 50, 100, 200, 365], name: (v) => trophyText('questDays', 'name', v), desc: (v) => trophyText('questDays', 'desc', v) },
  { key: 'questRun', cat: 'つづける', title: t('content.trophy.questRun.title'), metric: 'questRun', steps: [2, 3, 5, 7, 14, 30], name: (v) => trophyText('questRun', 'name', v), desc: (v) => trophyText('questRun', 'desc', v) },
  { key: 'hammer', cat: 'つづける', title: t('content.trophy.hammer.title'), metric: 'hammerUsed', steps: [1, 3, 10], name: (v) => trophyText('hammer', 'name', v), desc: (v) => trophyText('hammer', 'desc', v) },
  { key: 'starsTotal', cat: 'スキル', title: t('content.trophy.starsTotal.title'), metric: 'starsTotal', steps: [5, 10, 25, 50, 75, 100, 150, 200, 250, 290], name: (v) => trophyText('starsTotal', 'name', v), desc: (v) => trophyText('starsTotal', 'desc', v) },
  { key: 'star5', cat: 'スキル', title: t('content.trophy.star5.title'), metric: 'star5', steps: [1, 3, 5, 10, 20, 30, 58], name: (v) => trophyText('star5', 'name', v), desc: (v) => trophyText('star5', 'desc', v) },
  { key: 'gradeStar3', cat: 'スキル', title: t('content.trophy.gradeStar3.title'), items: [1, 2, 3, 4, 5, 6].map((g) => ({ id: `gradeStar3-${g}`, metric: `gradeStar3${g}`, need: 1, name: t('content.trophy.gradeStar3.name', { grade: g }), desc: t('content.trophy.gradeStar3.desc', { grade: g }) })) },
  { key: 'polished', cat: 'せいちょう', title: t('content.trophy.polished.title'), metric: 'polished', steps: [1, 3, 5, 10, 30, 50], name: (v) => trophyText('polished', 'name', v), desc: (v) => trophyText('polished', 'desc', v) },
  { key: 'capsules', cat: 'せいちょう', title: t('content.trophy.capsules.title'), metric: 'capsules', steps: [1, 3, 5, 10, 30], name: (v) => trophyText('capsules', 'name', v), desc: (v) => trophyText('capsules', 'desc', v) },
  { key: 'capsuleFaster', cat: 'せいちょう', title: t('content.trophy.capsuleFaster.title'), metric: 'capsuleFaster', steps: [1, 5, 10], name: (v) => trophyText('capsuleFaster', 'name', v), desc: (v) => trophyText('capsuleFaster', 'desc', v) },
  { key: 'grew', cat: 'せいちょう', title: t('content.trophy.grew.title'), metric: 'grew', steps: [1, 5, 10, 30, 50, 100], name: (v) => trophyText('grew', 'name', v), desc: (v) => trophyText('grew', 'desc', v) },
  { key: 'items', cat: 'コレクション', title: t('content.trophy.items.title'), metric: 'itemsOwned', steps: [10, 20, 30, 40, 47], name: (v) => trophyText('items', 'name', v), desc: (v) => trophyText('items', 'desc', v) },
  { key: 'catComplete', cat: 'コレクション', title: t('content.trophy.catComplete.title'), metric: 'catComplete', steps: [1, 3, 5, 8], name: (v) => trophyText('catComplete', 'name', v), desc: (v) => trophyText('catComplete', 'desc', v) },
].forEach(addSeries);

// Numbers every trophy is measured against, from the saved state.
// snap: { stats, prog, bestStreak, stickers, crowns, ...extra metrics }
export function trophyMetrics(snap) {
  const s = snap.stats || {};
  const prog = snap.prog || { skills: {} };
  const m = {
    bestStreak: snap.bestStreak || 0, days: s.days || 0, stickers: snap.stickers || 0, crowns: snap.crowns || 0,
    problems: s.problems || 0, cells: s.cells || 0, plays: s.plays || 0, minutes: Math.floor((s.playMs || 0) / 60000),
    unlocked: SKILLS.filter((x) => isUnlocked(prog, x.id)).length, mastered: SKILLS.filter((x) => isMastered(prog, x.id)).length,
    extras: s.extras || 0, extraBest: s.extraBest || 0, extraSolved: s.extraSolved || 0, maxCombo: s.maxCombo || 0,
    perfects: s.perfects || 0, firstTry: s.firstTry || 0, bestDopaL: Math.floor((s.bestDopaL || 0) + 1e-9), reviewSolved: s.reviewSolved || 0,
  };
  const stars = Object.fromEntries(SKILLS.map((x) => [x.id, starsOf(prog, x.id)]));
  m.starsTotal = Object.values(stars).reduce((a, b) => a + b, 0);
  m.star5 = Object.values(stars).filter((n) => n >= 5).length;
  m.polished = s.polished || 0; m.capsules = s.capsules || 0; m.capsuleFaster = s.capsuleFaster || 0; m.grew = s.grew || 0;
  for (let g = 1; g <= 6; g++) {
    m[`gradeStar3${g}`] = SKILLS.filter((x) => x.grade === g).every((x) => stars[x.id] >= 3) ? 1 : 0;
    m[`gradeDone${g}`] = SKILLS.filter((x) => x.grade === g).every((x) => isMastered(prog, x.id)) ? 1 : 0;
    m[`gradePlays${g}`] = (s.grades || {})[g] || 0;
  }
  LANES.forEach((_, i) => { m[`laneDone${i}`] = SKILLS.filter((x) => x.lane === i).every((x) => isMastered(prog, x.id)) ? 1 : 0; });
  for (const [k, v] of Object.entries(s.flags || {})) if (v) m[`flag:${k}`] = 1;
  const modes = s.modes || {};
  m.allModes = ['level', 'grade', 'practice', 'review'].every((k) => modes[k]) ? 1 : 0;
  Object.assign(m, snap.extra || {});
  return m;
}
export const valueOf = (m, metric) => m[metric] || 0;

// Earn every trophy whose condition is met. Returns the new ones (in list order).
// `state` is the saved { got: { id: time } }; the first call earns what the
// existing records already reach and marks them as a batch.
export function evaluate(state, metrics, at = Date.now()) {
  state.got = state.got || {};
  const fresh = [];
  for (const t of TROPHIES) {
    if (state.got[t.id]) continue;
    if (valueOf(metrics, t.metric) >= t.need) { state.got[t.id] = at; fresh.push(t); }
  }
  if (!state.init) { state.init = true; state.batch = fresh.map((t) => t.id); return []; }
  return fresh;
}

export const earnedCount = (state) => TROPHIES.filter((t) => state.got && state.got[t.id]).length;

// Progress of one series for the list screen.
export function seriesView(series, state, metrics) {
  const got = series.items.filter((t) => state.got && state.got[t.id]);
  const next = series.items.find((t) => !(state.got && state.got[t.id]));
  const top = got[got.length - 1] || null;
  return { series, got, next, top, value: next ? valueOf(metrics, next.metric) : null };
}
