/**
 * Headless check: QA wave jump loadout — picks = N-1, deterministic seeds,
 * room routing, rank caps / prerequisites, scales past wave 10.
 */
import {
  BASE_STATS,
  UPGRADES,
  upgradeById,
} from '../upgrades.js';

function picksBeforeWave(n) { return Math.max(0, n - 1); }
function roomForWave(n) { return n >= 11 ? 'bay' : 'room1'; }

const DEV_CHOICE_LEAN = {
  spread: 5.0, damage: 4.0, rate: 3.6, reload: 3.4,
  mag: 2.4, pierce: 2.2, speed: 2.0, hp: 2.0,
  bot: 2.2, botGun: 1.8, botBomb: 1.5, mine: 1.6, shock: 1.3,
  pulse: 1.6, regen: 1.5, luck: 1.1, magnet: 1.4, heal: 0.5,
  coil: 2.6,
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
  // Mirror live picker: pin coil into the offer after wave 11 until maxed.
  if ((state.upgrades.coil || 0) < 3 && (state.bayActive || state.wave >= 11)) {
    take(pool.find(u => u.id === 'coil'));
  }
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
  const coilIndex = picks.findIndex(u => u?.id === 'coil');
  if (coilIndex > 0) {
    const [coil] = picks.splice(coilIndex, 1);
    picks.unshift(coil);
  }
  return picks;
}

function choiceWeight(u, state) {
  const owned = state.upgrades[u.id] || 0;
  let w = (DEV_CHOICE_LEAN[u.id] ?? 1) * (1 + upgradeWeight(u, state) * 0.15);
  if (owned && ['spread', 'damage', 'rate', 'reload', 'mag', 'pierce'].includes(u.id)) w *= 1.55;
  if (owned >= 2 && ['spread', 'damage', 'rate'].includes(u.id)) w *= 0.72;
  if (u.id === 'coil') {
    if (owned === 0) w *= 3.8;
    else if (owned === 1) w *= 2.8;
    else w *= 2.2;
  }
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

function simulate(seed, startWave) {
  const rng = mulberry32(seed);
  const cleared = picksBeforeWave(startWave);
  const state = {
    ...BASE_STATS,
    wave: 0,
    hp: BASE_STATS.maxHp,
    mag: BASE_STATS.magSize,
    upgrades: {},
  };
  const history = [];
  for (let wave = 1; wave <= cleared; wave++) {
    state.wave = wave;
    if (wave >= 11) state.bayActive = true;
    state.hp = state.maxHp;
    const offers = pickUpgradeOffers(state, rng);
    if (!offers.length) break;
    const pick = pickChoice(offers, state, rng);
    if (!pick) break;
    if ((state.upgrades[pick.id] || 0) >= pick.max) throw new Error(`cap broken ${pick.id}`);
    if (pick.ok && !pick.ok(state)) throw new Error(`prereq broken ${pick.id}`);
    state.upgrades[pick.id] = (state.upgrades[pick.id] || 0) + 1;
    pick.apply(state);
    history.push(pick.id);
  }
  return { history, upgrades: { ...state.upgrades }, cleared, room: roomForWave(startWave) };
}

/** Mirror parseQaWaveTarget URL schemes. */
function parseQaWaveTarget(search) {
  const params = new URLSearchParams(search);
  const dev = params.get('dev');
  if (!dev) return null;
  const clamp = (n) => Math.max(1, Math.min(999, n));
  if (dev === 'bay') {
    const override = Number.parseInt(params.get('wave') || '', 10);
    return clamp(Number.isFinite(override) ? override : 11);
  }
  if (dev === 'wave') {
    const n = Number.parseInt(params.get('wave') || '', 10);
    return Number.isFinite(n) ? clamp(n) : null;
  }
  const m = /^wave[=:_-]?(\d+)$/i.exec(dev);
  if (m) return clamp(Number.parseInt(m[1], 10));
  return null;
}

let failed = 0;
function assert(cond, msg) {
  if (!cond) { console.error('FAIL:', msg); failed++; }
  else console.log('ok:', msg);
}

assert(picksBeforeWave(1) === 0, 'wave 1 → 0 picks');
assert(picksBeforeWave(11) === 10, 'wave 11 → 10 picks');
assert(picksBeforeWave(20) === 19, 'wave 20 → 19 picks');
assert(picksBeforeWave(50) === 49, 'wave 50 → 49 picks');
assert(roomForWave(10) === 'room1', 'wave 10 → room1');
assert(roomForWave(11) === 'bay', 'wave 11 → bay');
assert(roomForWave(50) === 'bay', 'wave 50 → bay');

assert(parseQaWaveTarget('dev=bay') === 11, 'dev=bay → 11');
assert(parseQaWaveTarget('dev=bay&wave=30') === 30, 'dev=bay&wave=30 → 30');
assert(parseQaWaveTarget('dev=wave=20') === 20, 'dev=wave=20 → 20');
assert(parseQaWaveTarget('dev=wave&wave=15') === 15, 'dev=wave&wave=15 → 15');
assert(parseQaWaveTarget('dev=mapview') == null, 'mapview ignored');

const a11 = simulate(42, 11);
const b11 = simulate(42, 11);
assert(a11.history.length === 10, `wave 11 applied 10 picks (got ${a11.history.length})`);
assert(JSON.stringify(a11.history) === JSON.stringify(b11.history), 'same seed+wave → same path');

const a20 = simulate(42, 20);
assert(a20.history.length === 19, `wave 20 applied 19 picks (got ${a20.history.length})`);
assert(a20.history.slice(0, 10).join() === a11.history.join(), 'wave 20 prefix matches wave 11 path (same seed)');

const a50 = simulate(7, 50);
assert(a50.history.length === 49, `wave 50 applied 49 picks (got ${a50.history.length})`);
assert(a50.room === 'bay', 'wave 50 room bay');

for (const [id, rank] of Object.entries(a50.upgrades)) {
  const u = upgradeById(id);
  assert(rank <= u.max, `${id} rank ${rank} ≤ max ${u.max}`);
}
if (a50.upgrades.botGun) assert(!!a50.upgrades.bot, 'botGun requires bot');
if (a50.upgrades.shock) assert(!!a50.upgrades.mine, 'shock requires mine');
assert(!(a50.upgrades.botGun && a50.upgrades.botBomb), 'botGun xor botBomb');

assert(DEV_CHOICE_LEAN.coil > 1, 'coil lean present');
assert(!!upgradeById('coil'), 'coil card in catalog');

// Coil is offered after wave 11 but not forced — ranks vary by seed early on.
let maxBy14 = 0;
let anyBy14 = 0;
let rankSum14 = 0;
for (let seed = 1; seed <= 40; seed++) {
  const s14 = simulate(seed, 14);
  const r = s14.upgrades.coil || 0;
  if (r >= 3) maxBy14++;
  if (r > 0) anyBy14++;
  rankSum14 += r;
}
assert(maxBy14 < 40, `not every seed maxes coil by wave 14 (${maxBy14}/40)`);
assert(anyBy14 >= 20, `many seeds take coil by wave 14 (${anyBy14}/40)`);
assert(rankSum14 / 40 < 2.8, `avg coil rank at wave 14 < 2.8 (${(rankSum14 / 40).toFixed(2)})`);

console.log('\nexample seed=42 wave=11:', a11.upgrades);
console.log('example seed=42 wave=20 ranks:', a20.upgrades);

if (failed) {
  console.error(`\n${failed} check(s) failed`);
  process.exit(1);
}
console.log('\nAll QA wave-jump checks passed.');
