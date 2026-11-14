/**
 * Headless: coil rank table + wave-20 DPS vs bay HP (card is in the picker).
 */
import {
  COIL_MAX_RANK,
  COIL_UPGRADE,
  UPGRADES,
  coilStatsForRank,
} from '../upgrades.js';

const BOT = {
  cyan: 0.7, patrol: 1, mortar: 0.55, gunner: 1.25, heavy: 2.5,
};
const BAY_HP = 1.5;

function droneHp(n) { return 2 + (n - 1) * 0.4; }
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
assert(UPGRADES.includes(COIL_UPGRADE), 'coil card in UPGRADES picker catalog');
assert(COIL_UPGRADE.max === 3, 'COIL_UPGRADE max 3');

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

console.log('\n--- wave 20 bay HP vs coil ranks ---');
const w = 20;
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

const dmg3 = coilDmg(w, 3);
assert(dmg3 >= maxHp(w, BOT.cyan), 'r3 one-shots cyan @20');
assert(dmg3 >= maxHp(w, BOT.mortar), 'r3 one-shots mortar @20');
assert(dmg3 >= maxHp(w, BOT.gunner), 'r3 one-shots gunner @20');
assert(Math.ceil(maxHp(w, BOT.heavy) / dmg3) === 2, 'r3 heavy dies in 2 hits @20');

if (failed) {
  console.error(`\n${failed} check(s) failed`);
  process.exit(1);
}
console.log('\nAll coil-rank checks passed.');
