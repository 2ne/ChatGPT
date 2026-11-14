/**
 * Headless check: bay-dev loadout uses 10 picks (one per wave clear 1–10),
 * respects rank caps / prerequisites, and is deterministic per seed.
 */
import {
  BASE_STATS,
  UPGRADES,
  upgradeById,
} from '../upgrades.js';

const BAY_DEV_PICKS = 10;
const BAY_DEV_CHOICE_LEAN = {
  spread: 5.0, damage: 4.0, rate: 3.6, reload: 3.4,
  mag: 2.4, pierce: 2.2, speed: 2.0, hp: 2.0,
  bot: 2.2, botGun: 1.8, botBomb: 1.5, mine: 1.6, shock: 1.3,
  pulse: 1.6, regen: 1.5, luck: 1.1, magnet: 1.4, heal: 0.5,
};

function mulberry32(seed) {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6D2B79F5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function upgradeWeight(u, state) {
  let w = 1;
  if (u.cat === 'engineer') w += 2;
  if (state.upgrades[u.id]) w += 2;
  if (u.ok && u.cat === 'engineer') w += 3;
  if (u.cat === 'firepower') w += state.wave <= 3 ? 2.8 : 1.2;
  if (u.cat === 'handling') w += state.wave <= 3 ? 1.2 : 0.6;
  if (u.id === 'spread') w += (state.upgrades.spread || 0) === 0 ? (state.wave <= 3 ? 5 : 2) : 0.8;
  if (u.id === 'damage' && !(state.upgrades.damage)) w += 1.4;
  if (u.id === 'rate' && !(state.upgrades.rate)) w += 1.2;
  if (u.id === 'luck' && state.wave <= 2) w *= 0.35;
  if (u.id === 'heal') w *= state.hp < state.maxHp ? 1 : 0;
  if (u.cat === 'ability') w += state.wave >= 2 ? 2.2 : 1.1;
  return Math.max(0.05, w);
}

function pickWeighted(candidates, state, rng) {
  const total = candidates.reduce((sum, u) => sum + upgradeWeight(u, state), 0);
  let roll = rng() * total;
  for (const u of candidates) {
    roll -= upgradeWeight(u, state);
    if (roll <= 0) return u;
  }
  return candidates[candidates.length - 1];
}

const HELPER_FAMILY = new Set(['bot', 'botGun', 'botBomb']);

function pickUpgradeOffers(state, rng, count = 3) {
  const pool = UPGRADES.filter(u => (state.upgrades[u.id] || 0) < u.max && (!u.ok || u.ok(state)));
  const picks = [];
  const take = (u) => {
    if (!u) return;
    picks.push(u);
    const i = pool.indexOf(u);
    if (i >= 0) pool.splice(i, 1);
  };
  const candidates = () => {
    if (!picks.some((u) => HELPER_FAMILY.has(u.id))) return pool.slice();
    const others = pool.filter((u) => !HELPER_FAMILY.has(u.id));
    return others.length ? others : pool.slice();
  };
  const equipment = pool.filter(u => u.cat === 'engineer');
  if (equipment.length) take(pickWeighted(equipment, state, rng));
  if ((state.upgrades.spread || 0) === 0 && state.wave <= 2) {
    take(pool.find(u => u.id === 'spread'));
  }
  while (picks.length < count && pool.length) {
    const u = pickWeighted(candidates(), state, rng);
    if (!u) break;
    take(u);
  }
  return picks;
}

function choiceWeight(u, state) {
  const owned = state.upgrades[u.id] || 0;
  let w = (BAY_DEV_CHOICE_LEAN[u.id] ?? 1) * (1 + upgradeWeight(u, state) * 0.15);
  if (owned && ['spread', 'damage', 'rate', 'reload', 'mag', 'pierce'].includes(u.id)) w *= 1.55;
  if (owned >= 2 && ['spread', 'damage', 'rate'].includes(u.id)) w *= 0.72;
  return Math.max(0.05, w);
}

function pickChoice(offers, state, rng) {
  const pool = offers.filter(Boolean);
  const total = pool.reduce((s, u) => s + choiceWeight(u, state), 0);
  let roll = rng() * total;
  for (const u of pool) {
    roll -= choiceWeight(u, state);
    if (roll <= 0) return u;
  }
  return pool[pool.length - 1];
}

function simulate(seed) {
  const rng = mulberry32(seed);
  const state = {
    ...BASE_STATS,
    wave: 0,
    hp: BASE_STATS.maxHp,
    mag: BASE_STATS.magSize,
    upgrades: {},
  };
  const history = [];
  for (let wave = 1; wave <= BAY_DEV_PICKS; wave++) {
    state.wave = wave;
    state.hp = state.maxHp;
    const offers = pickUpgradeOffers(state, rng);
    const pick = pickChoice(offers, state, rng);
    if (!pick) break;
    // Prerequisites / caps must hold.
    if ((state.upgrades[pick.id] || 0) >= pick.max) throw new Error(`cap broken ${pick.id}`);
    if (pick.ok && !pick.ok(state)) throw new Error(`prereq broken ${pick.id}`);
    state.upgrades[pick.id] = (state.upgrades[pick.id] || 0) + 1;
    pick.apply(state);
    history.push(pick.id);
  }
  return { history, upgrades: { ...state.upgrades }, damage: state.damage, magSize: state.magSize };
}

let failed = 0;
function assert(cond, msg) {
  if (!cond) { console.error('FAIL:', msg); failed++; }
  else console.log('ok:', msg);
}

assert(BAY_DEV_PICKS === 10, '10 picks = one per wave clear 1–10');
assert(BAY_DEV_CHOICE_LEAN.spread > BAY_DEV_CHOICE_LEAN.luck, 'spread weighted above luck');
assert(BAY_DEV_CHOICE_LEAN.damage > BAY_DEV_CHOICE_LEAN.mine, 'damage weighted above mines');
assert(BAY_DEV_CHOICE_LEAN.rate > BAY_DEV_CHOICE_LEAN.regen, 'rate weighted above regen');
assert(BAY_DEV_CHOICE_LEAN.reload > BAY_DEV_CHOICE_LEAN.luck, 'reload weighted above luck');

const a = simulate(42);
const b = simulate(42);
const c = simulate(99);
assert(a.history.length === 10, `seed 42 applied 10 picks (got ${a.history.length})`);
assert(JSON.stringify(a.history) === JSON.stringify(b.history), 'same seed → same path');
assert(JSON.stringify(a.history) !== JSON.stringify(c.history), 'different seed → different path');

// Caps respected
for (const [id, rank] of Object.entries(a.upgrades)) {
  const u = upgradeById(id);
  assert(rank <= u.max, `${id} rank ${rank} ≤ max ${u.max}`);
}
if (a.upgrades.botGun) assert(!!a.upgrades.bot, 'botGun requires bot');
if (a.upgrades.botBomb) assert(!!a.upgrades.bot, 'botBomb requires bot');
if (a.upgrades.shock) assert(!!a.upgrades.mine, 'shock requires mine');
assert(!(a.upgrades.botGun && a.upgrades.botBomb), 'botGun and botBomb mutually exclusive');

// Typical lean: most seeds take at least one of spread/damage/rate/reload
let gunish = 0;
for (let seed = 1; seed <= 30; seed++) {
  const s = simulate(seed);
  if (s.upgrades.spread || s.upgrades.damage || s.upgrades.rate || s.upgrades.reload) gunish++;
}
assert(gunish >= 28, `≥28/30 seeds take a core gun card (got ${gunish})`);

console.log('\nexample seed=42:', a.upgrades, `dmg=${a.damage} mag=${a.magSize}`);
console.log('example seed=99:', c.upgrades);

if (failed) {
  console.error(`\n${failed} check(s) failed`);
  process.exit(1);
}
console.log('\nAll bay-dev loadout checks passed.');
