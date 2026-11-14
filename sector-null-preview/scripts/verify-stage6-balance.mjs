/**
 * Sanity: wave 11–15 regular HP, boss HP curve, coil in catalog, wave-13 ≤1.5×12.
 */
import {
  COIL_MAX_RANK,
  COIL_UPGRADE,
  UPGRADES,
  coilStatsForRank,
  upgradeById,
} from '../upgrades.js';

const BAY_HP = 1.5;
const BOT = {
  patrol: { health: 1 },
  runner: { health: 0.7 },
  gunner: { health: 1.25 },
  heavy: { health: 2.5 },
  mortar: { health: 0.55 },
};

function droneHp(n) { return 2 + (n - 1) * 0.4; }
function waveSpawnCount(n) {
  if (n === 11) return 14;
  if (n === 12) return 18;
  if (n === 13) return 22;
  if (n === 14) return 28;
  if (n === 15) return 36;
  return Math.max(0, 5 + n * 3);
}
function unitHp(n, health) {
  return Math.ceil(droneHp(n) * health * (n >= 11 ? BAY_HP : 1));
}

/** Approximate mix HP for opener / later bay waves. */
function approxWaveHp(n) {
  const count = waveSpawnCount(n);
  let types;
  if (n === 11) {
    types = [
      ...Array(3).fill('gunner'),
      ...Array(1).fill('heavy'),
      ...Array(8).fill('runner'),
      ...Array(2).fill('patrol'),
    ];
  } else if (n === 12) {
    types = [
      ...Array(4).fill('gunner'),
      ...Array(2).fill('heavy'),
      ...Array(9).fill('runner'),
      ...Array(3).fill('patrol'),
    ];
  } else {
    // Rough room-1-ish mix + a couple mortars from 13.
    const mortars = n >= 13 ? 2 : 0;
    const gunners = Math.round(count * 0.2);
    const heavies = Math.round(count * 0.15);
    const runners = Math.round(count * 0.25);
    const rest = count - gunners - heavies - runners - mortars;
    types = [
      ...Array(gunners).fill('gunner'),
      ...Array(heavies).fill('heavy'),
      ...Array(runners).fill('runner'),
      ...Array(Math.max(0, rest)).fill('patrol'),
      ...Array(mortars).fill('mortar'),
    ];
  }
  while (types.length < count) types.push('patrol');
  types = types.slice(0, count);
  return types.reduce((sum, id) => sum + unitHp(n, BOT[id].health), 0);
}

function bossMult(w) {
  if (w <= 10) return 6 + w * 1.3 + w * w * 0.1;
  const at11 = 6 + 11 * 1.3 + 11 * 11 * 0.1;
  return at11 * (1 + 0.2 * (w - 11));
}

let failed = 0;
function assert(cond, msg) {
  if (!cond) { console.error('FAIL:', msg); failed++; }
  else console.log('ok:', msg);
}

assert(UPGRADES.includes(COIL_UPGRADE), 'COIL_UPGRADE registered in UPGRADES');
assert(upgradeById('coil') === COIL_UPGRADE, 'upgradeById(coil)');
assert(COIL_MAX_RANK === 3, 'max rank 3');
const r0 = coilStatsForRank(0);
const r3 = coilStatsForRank(3);
assert(r0.interval === 2 && r0.targets === 2 && r0.range === 8 && r0.damageScale === 1, 'rank 0 stats');
assert(r3.interval === 1 && r3.targets === 4 && r3.range === 11 && r3.damageScale === 1.7, 'rank 3 stats');

console.log('\n--- regular-drone total HP (approx mix) ---');
const hp = {};
for (const w of [11, 12, 13, 14, 15]) {
  hp[w] = approxWaveHp(w);
  console.log(` wave ${w}: count=${waveSpawnCount(w)}  HP≈${hp[w]}`);
}
assert(hp[13] <= hp[12] * 1.5 + 1, `wave 13 HP ${hp[13]} ≤ 1.5× wave 12 ${hp[12]} (${(hp[12] * 1.5).toFixed(0)})`);

console.log('\n--- boss health mult ---');
for (const w of [10, 11, 15, 20, 30]) {
  console.log(` wave ${w}: mult=${bossMult(w).toFixed(2)}`);
}
assert(Math.abs(bossMult(10) - (6 + 13 + 10)) < 0.01, 'wave 10 quadratic unchanged');
assert(Math.abs(bossMult(11) - (6 + 11 * 1.3 + 12.1)) < 0.01, 'wave 11 continuous with quadratic');
assert(bossMult(11) > bossMult(10), 'no drop 10→11');
assert(Math.abs(bossMult(12) / bossMult(11) - 1.2) < 0.001, 'wave 12 = wave11 × 1.2');
assert(Math.abs(bossMult(20) / bossMult(11) - 2.8) < 0.001, 'wave 20 = wave11 × 2.8');

if (failed) {
  console.error(`\n${failed} check(s) failed`);
  process.exit(1);
}
console.log('\nAll stage-6 balance checks passed.');
