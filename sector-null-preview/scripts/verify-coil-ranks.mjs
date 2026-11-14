/**
 * Headless: coil rank table, QA coil schedule, wave-20 DPS vs bay HP.
 */
import {
  COIL_MAX_RANK,
  COIL_UPGRADE,
  QA_COIL_RANK_AFTER_CLEAR,
  UPGRADES,
  coilStatsForRank,
} from '../upgrades.js';

const BOT = {
  cyan: 0.7, patrol: 1, mortar: 0.55, gunner: 1.25, heavy: 2.5,
};
const BAY_HP = 1.5;

function droneHp(n) { return 2 + (n - 1) * 0.4; }
function waveSpawnCount(n) {
  if (n === 11) return 14;
  if (n === 12) return 18;
  if (n === 13) return 29;
  if (n === 14) return 38;
  if (n === 15) return 46;
  return Math.max(0, 5 + n * 3);
}
function maxHp(n, health) {
  return Math.ceil(droneHp(n) * health * BAY_HP);
}
function cyanHp(n) { return maxHp(n, BOT.cyan); }
function coilDmg(n, rank) {
  return Math.ceil(cyanHp(n) * coilStatsForRank(rank).damageScale);
}

let failed = 0;
function assert(cond, msg) {
  if (!cond) { console.error('FAIL:', msg); failed++; }
  else console.log('ok:', msg);
}

assert(COIL_MAX_RANK === 3, 'max rank 3');
assert(!UPGRADES.some((u) => u.id === 'coil'), 'coil card not in picker yet');
assert(COIL_UPGRADE.id === 'coil' && COIL_UPGRADE.max === 3, 'COIL_UPGRADE ready for Stage 6');

const expected = [
  { interval: 2.0, range: 8, targets: 2, damageScale: 1.0 },
  { interval: 1.6, range: 8, targets: 3, damageScale: 1.0 },
  { interval: 1.3, range: 9.5, targets: 3, damageScale: 1.3 },
  { interval: 1.0, range: 11, targets: 4, damageScale: 1.7 },
];
for (let r = 0; r <= 3; r++) {
  const s = coilStatsForRank(r);
  assert(s.interval === expected[r].interval, `r${r} interval ${s.interval}`);
  assert(s.range === expected[r].range, `r${r} range ${s.range}`);
  assert(s.targets === expected[r].targets, `r${r} targets ${s.targets}`);
  assert(s.damageScale === expected[r].damageScale, `r${r} damageScale ${s.damageScale}`);
}

assert(QA_COIL_RANK_AFTER_CLEAR[11] === 1, 'clear 11 → coil rank 1');
assert(QA_COIL_RANK_AFTER_CLEAR[12] === 2, 'clear 12 → coil rank 2');
assert(QA_COIL_RANK_AFTER_CLEAR[13] === 3, 'clear 13 → coil rank 3');

// Simulate QA forced coil picks counting against total.
function simQaCoilPicks(startWave) {
  const cleared = startWave - 1;
  let coil = 0;
  let other = 0;
  const history = [];
  for (let wave = 1; wave <= cleared; wave++) {
    const want = QA_COIL_RANK_AFTER_CLEAR[wave] || 0;
    if (want && coil < want) {
      coil++;
      history.push('coil');
    } else {
      other++;
      history.push('other');
    }
  }
  return { coil, other, total: history.length, history };
}

const w12 = simQaCoilPicks(12);
assert(w12.total === 11 && w12.coil === 1, 'wave 12 start: 11 picks, coil×1');
const w14 = simQaCoilPicks(14);
assert(w14.total === 13 && w14.coil === 3, 'wave 14 start: 13 picks, coil×3');
const w20 = simQaCoilPicks(20);
assert(w20.total === 19 && w20.coil === 3 && w20.other === 16, 'wave 20: 19 picks = 3 coil + 16 other');

console.log('\n--- wave 20 bay HP vs coil ranks ---');
const w = 20;
const count = waveSpawnCount(w);
console.log(`wave ${w}: ${count} regulars · droneHp=${droneHp(w).toFixed(1)}`);
for (let r = 0; r <= 3; r++) {
  const dmg = coilDmg(w, r);
  const s = coilStatsForRank(r);
  const rows = Object.entries(BOT).map(([name, h]) => {
    const hp = maxHp(w, h);
    const hits = Math.ceil(hp / dmg);
    return `${name} hp=${hp} ${hits === 1 ? '1-shot' : `${hits} hits`}`;
  });
  console.log(` rank ${r}: ${s.targets}tgt/${s.interval}s/r${s.range} dmg=${dmg} | ${rows.join(' · ')}`);
}

const r3 = coilStatsForRank(3);
const dmg3 = coilDmg(w, 3);
assert(dmg3 >= maxHp(w, BOT.cyan), 'r3 one-shots cyan @20');
assert(dmg3 >= maxHp(w, BOT.mortar), 'r3 one-shots mortar @20');
assert(dmg3 >= maxHp(w, BOT.gunner), 'r3 one-shots gunner @20');
assert(dmg3 < maxHp(w, BOT.heavy), 'r3 does not one-shot heavy @20');
assert(Math.ceil(maxHp(w, BOT.heavy) / dmg3) === 2, 'r3 heavy dies in 2 hits @20');

// Clear-time: optimistic DPS assumes targets stay in range; real fights spend time
// on door bash, spawn cadence and boss. Use a conservative in-range factor.
const inRange = Math.min(r3.targets, 2.4);
const coilDps = (inRange * dmg3) / r3.interval;
const totalHp = count * (
  0.35 * maxHp(w, BOT.cyan)
  + 0.25 * maxHp(w, BOT.patrol)
  + 0.2 * maxHp(w, BOT.gunner)
  + 0.12 * maxHp(w, BOT.heavy)
  + 0.08 * maxHp(w, BOT.mortar)
);
const coilOnlySec = totalHp / coilDps;
const playerDps = 22; // rough fully-upgraded pulse, after reloads / movement
const togetherSec = totalHp / (coilDps + playerDps);
const bossHp = Math.ceil((6 + w * 1.3 + w * w * 0.1) * droneHp(w)); // ballpark from bossHealthMult
console.log(`\nwave-20 estimate: ~${Math.round(totalHp)} HP pool (+ boss ~${bossHp})`);
console.log(` coil DPS≈${coilDps.toFixed(0)} (~${inRange} in range) → coil-alone regs ~${coilOnlySec.toFixed(0)}s`);
console.log(` + player DPS≈${playerDps} → regs ~${togetherSec.toFixed(0)}s; density ${count} still the pressure`);
assert(togetherSec < 120, 'rank-3 coil + build can chew regs in under ~2 min');
assert(count >= 60, 'wave 20 still fields a large pack (density is the remaining hardness)');

if (failed) {
  console.error(`\n${failed} check(s) failed`);
  process.exit(1);
}
console.log('\nAll coil-rank checks passed.');
