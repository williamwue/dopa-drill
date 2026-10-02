// Unlockable show (id041): backgrounds, correct marks, particles, music,
// Dopakichi's costume and colour, the crowd and the finale. Each item is the
// reward of one trophy (never random), so what is unlocked follows from the
// trophies earned; only the player's choice per category is saved.
import { TROPHY } from './trophies.js';
import { t } from './i18n.js';

export const CATS = [
  { key: 'bg', name: t('content.unlock.cat.bg') },
  { key: 'mark', name: t('content.unlock.cat.mark') },
  { key: 'particle', name: t('content.unlock.cat.particle') },
  { key: 'music', name: t('content.unlock.cat.music') },
  { key: 'costume', name: t('content.unlock.cat.costume') },
  { key: 'color', name: t('content.unlock.cat.color') },
  { key: 'crowd', name: t('content.unlock.cat.crowd') },
  { key: 'finale', name: t('content.unlock.cat.finale') },
];

// base: available from the start. trophy: the trophy whose reward it is.
export const ITEMS = [];
export const ITEM = {};
export function addItems(list) {
  for (const it of list) {
    ITEMS.push(it); ITEM[it.id] = it;
    if (it.trophy && TROPHY[it.trophy]) TROPHY[it.trophy].reward = it.id;
  }
}
addItems([
  { id: 'bg:classic', cat: 'bg', name: t('content.unlock.item.bg.classic'), base: true },
  { id: 'mark:hanamaru', cat: 'mark', name: t('content.unlock.item.mark.hanamaru'), base: true },
  { id: 'particle:classic', cat: 'particle', name: t('content.unlock.item.particle.classic'), base: true },
  { id: 'music:classic', cat: 'music', name: t('content.unlock.item.music.classic'), base: true },
  { id: 'costume:none', cat: 'costume', name: t('content.unlock.item.costume.none'), base: true },
  { id: 'color:pink', cat: 'color', name: t('content.unlock.item.color.pink'), base: true },
  { id: 'crowd:classic', cat: 'crowd', name: t('content.unlock.item.crowd.classic'), base: true },
  { id: 'finale:classic', cat: 'finale', name: t('content.unlock.item.finale.classic'), base: true },
]);
// id041: one sample per category, to prove the pipeline end to end.
// Rewards follow effort and coming back (plays, days, streaks, stars earned by
// practice), not the placement check, which can master many skills at once.
addItems([
  { id: 'costume:cap', cat: 'costume', name: t('content.unlock.item.costume.cap'), trophy: 'days-1' },
  { id: 'particle:note', cat: 'particle', name: t('content.unlock.item.particle.note'), trophy: 'days-3' },
  { id: 'mark:stamp', cat: 'mark', name: t('content.unlock.item.mark.stamp'), trophy: 'plays-3' },
  { id: 'bg:night', cat: 'bg', name: t('content.unlock.item.bg.night'), trophy: 'streak-3' },
  { id: 'color:blue', cat: 'color', name: t('content.unlock.item.color.blue'), trophy: 'plays-5' },
  { id: 'finale:fireworks', cat: 'finale', name: t('content.unlock.item.finale.fireworks'), trophy: 'extras-5' },
  { id: 'music:chip', cat: 'music', name: t('content.unlock.item.music.chip'), trophy: 'plays-10' },
  { id: 'crowd:costume', cat: 'crowd', name: t('content.unlock.item.crowd.costume'), trophy: 'firstTry-50' },
]);
// id042: backgrounds, correct marks and particles.
addItems([
  { id: 'bg:sea', cat: 'bg', name: t('content.unlock.item.bg.sea'), trophy: 'problems-100' },
  { id: 'bg:festival', cat: 'bg', name: t('content.unlock.item.bg.festival'), trophy: 'days-15' },
  { id: 'bg:paper', cat: 'bg', name: t('content.unlock.item.bg.paper'), trophy: 'problems-200' },
  { id: 'bg:space', cat: 'bg', name: t('content.unlock.item.bg.space'), trophy: 'extras-10' },
  { id: 'mark:medal', cat: 'mark', name: t('content.unlock.item.mark.medal'), trophy: 'streak-7' },
  { id: 'mark:crown', cat: 'mark', name: t('content.unlock.item.mark.crown'), trophy: 'perfects-3' },
  { id: 'mark:ring', cat: 'mark', name: t('content.unlock.item.mark.ring'), trophy: 'combo-30' },
  { id: 'particle:petal', cat: 'particle', name: t('content.unlock.item.particle.petal'), trophy: 'stickers-7' },
  { id: 'particle:digit', cat: 'particle', name: t('content.unlock.item.particle.digit'), trophy: 'cells-1000' },
  { id: 'particle:bubble', cat: 'particle', name: t('content.unlock.item.particle.bubble'), trophy: 'review-10' },
  { id: 'particle:candy', cat: 'particle', name: t('content.unlock.item.particle.candy'), trophy: 'extraBest-10' },
]);
// id043: songs (8ビット is the id041 sample).
addItems([
  { id: 'music:matsuri', cat: 'music', name: t('content.unlock.item.music.matsuri'), trophy: 'streak-5' },
  { id: 'music:brass', cat: 'music', name: t('content.unlock.item.music.brass'), trophy: 'days-5' },
  { id: 'music:electro', cat: 'music', name: t('content.unlock.item.music.electro'), trophy: 'extras-3' },
]);
// id044: costumes, colours, crowd and finales (id045 moved three rewards to the new series).
addItems([
  { id: 'costume:hachimaki', cat: 'costume', name: t('content.unlock.item.costume.hachimaki'), trophy: 'problems-50' },
  { id: 'costume:cape', cat: 'costume', name: t('content.unlock.item.costume.cape'), trophy: 'combo-20' },
  { id: 'costume:glasses', cat: 'costume', name: t('content.unlock.item.costume.glasses'), trophy: 'firstTry-100' },
  { id: 'costume:ribbon', cat: 'costume', name: t('content.unlock.item.costume.ribbon'), trophy: 'stickers-14' },
  { id: 'costume:crown', cat: 'costume', name: t('content.unlock.item.costume.crown'), trophy: 'streak-14' },
  { id: 'costume:wizard', cat: 'costume', name: t('content.unlock.item.costume.wizard'), trophy: 'star5-1' },
  { id: 'costume:headphones', cat: 'costume', name: t('content.unlock.item.costume.headphones'), trophy: 'capsules-1' },
  { id: 'color:mint', cat: 'color', name: t('content.unlock.item.color.mint'), trophy: 'days-7' },
  { id: 'color:snow', cat: 'color', name: t('content.unlock.item.color.snow'), trophy: 'questDays-7' },
  { id: 'color:yellow', cat: 'color', name: t('content.unlock.item.color.yellow'), trophy: 'problems-300' },
  { id: 'color:violet', cat: 'color', name: t('content.unlock.item.color.violet'), trophy: 'extraSolved-100' },
  { id: 'color:gold', cat: 'color', name: t('content.unlock.item.color.gold'), trophy: 'streak-30' },
  { id: 'color:rainbow', cat: 'color', name: t('content.unlock.item.color.rainbow'), trophy: 'days-100' },
  { id: 'crowd:rainbow', cat: 'crowd', name: t('content.unlock.item.crowd.rainbow'), trophy: 'days-30' },
  { id: 'crowd:twins', cat: 'crowd', name: t('content.unlock.item.crowd.twins'), trophy: 'starsTotal-100' },
  { id: 'finale:parade', cat: 'finale', name: t('content.unlock.item.finale.parade'), trophy: 'streak-10' },
  { id: 'finale:rocket', cat: 'finale', name: t('content.unlock.item.finale.rocket'), trophy: 'extras-20' },
]);

export const isUnlocked = (it, got = {}) => !!(it && (it.base || (it.trophy && got[it.trophy])));
export const unlockedIn = (cat, got) => ITEMS.filter((it) => it.cat === cat && isUnlocked(it, got));
export const defaultEquip = () => Object.fromEntries(CATS.map((c) => [c.key, 'auto']));

// The look for one play: fixed choices stay; "auto" picks among the unlocked
// ones so every play can look and sound a little different.
export function pickLook(equip = {}, got = {}, rng = Math.random) {
  const look = {};
  for (const { key } of CATS) {
    const want = equip[key];
    const own = unlockedIn(key, got);
    if (want && want !== 'auto' && own.some((it) => it.id === want)) look[key] = want;
    else look[key] = own[Math.floor(rng() * own.length)].id;
  }
  return look;
}
// The part after "cat:" (what the show modules switch on).
export const variant = (id) => (id ? id.split(':')[1] : 'classic');
