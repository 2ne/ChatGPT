/**
 * Headless check: bay wave counts, opener mix quotas, 1.5× HP, coil vs types.
 */
const BOT = {
  patrol: { health: 1, name: 'patrol' },
  runner: { health: 0.7, name: 'cyan' },
  gunner: { health: 1.25, name: 'gunner' },
  heavy: { health: 2.5, name: 'heavy' },
  mortar: { health: 0.55, name: 'mortar' },
};
const BAY_HP = 1.5;
const OPENER = { 11: { gunner: 3, heavy: 1 }, 12: { gunner: 4, heavy: 2 } };

function droneHp(n) { return 2 + (n - 1) * 0.4; }
function waveSpawnCount(n) {
  if (n === 11) return 14;
  if (n === 12) return 18;
  if (n === 13) return 29;
  if (n === 14) return 38;
  if (n === 15) return 46;
  return Math.max(0, 5 + n * 3);
}
function maxHp(n, type) {
  return Math.ceil(droneHp(n) * type.health * BAY_HP);
}
function coilDmg(n) {
  return Math.ceil(maxHp(n, BOT.runner) * 1); // damageScale 1
}

let failed = 0;
function assert(cond, msg) {
  if (!cond) { console.error('FAIL:', msg); failed++; }
  else console.log('ok:', msg);
}

assert(waveSpawnCount(11) === 14, 'wave 11 count 14');
assert(waveSpawnCount(12) === 18, 'wave 12 count 18');
assert(waveSpawnCount(13) === 29, 'wave 13 soft-land 29');
assert(waveSpawnCount(13) < 5 + 13 * 3, 'wave 13 below room-1 curve (44)');
assert(waveSpawnCount(14) === 38, 'wave 14 ramp 38');
assert(waveSpawnCount(15) === 46, 'wave 15 ramp 46');
assert(waveSpawnCount(16) === 5 + 16 * 3, 'wave 16 joins room-1 curve');

// Simulate opener mix forcing across a full wave (deterministic late fill).
function simOpener(wave, seed = 1) {
  let rng = seed;
  const rand = () => { rng = (rng * 1664525 + 1013904223) >>> 0; return rng / 4294967296; };
  const want = OPENER[wave];
  let toSpawn = waveSpawnCount(wave);
  let gunners = 0, heavies = 0, cyan = 0, patrol = 0;
  while (toSpawn > 0) {
    const needH = want.heavy - heavies;
    const needG = want.gunner - gunners;
    let pick;
    if (needH > 0 && needH >= toSpawn) pick = 'heavy';
    else if (needG > 0 && needG + Math.max(0, needH) >= toSpawn) pick = 'gunner';
    else if (needH > 0 && rand() < 0.22) pick = 'heavy';
    else if (needG > 0 && rand() < 0.3) pick = 'gunner';
    else pick = rand() < 0.78 ? 'cyan' : 'patrol';
    if (pick === 'heavy') heavies++;
    else if (pick === 'gunner') gunners++;
    else if (pick === 'cyan') cyan++;
    else patrol++;
    toSpawn--;
  }
  return { gunners, heavies, cyan, patrol, total: gunners + heavies + cyan + patrol };
}

for (const wave of [11, 12]) {
  for (let seed = 1; seed <= 40; seed++) {
    const m = simOpener(wave, seed);
    assert(m.total === waveSpawnCount(wave), `w${wave} seed${seed} total`);
    assert(m.gunners === OPENER[wave].gunner, `w${wave} seed${seed} gunners=${m.gunners}`);
    assert(m.heavies === OPENER[wave].heavy, `w${wave} seed${seed} heavies=${m.heavies}`);
    if (failed > 5) break;
  }
}

console.log('\n--- coil vs HP (bay 1.5×) ---');
for (const w of [11, 12, 13, 14, 15]) {
  const dmg = coilDmg(w);
  const rows = Object.values(BOT).map((t) => {
    const hp = maxHp(w, t);
    const dead = dmg >= hp;
    return `${t.name} hp=${hp} ${dead ? 'DEAD' : `lives@${hp - dmg}`}`;
  });
  console.log(`wave ${w} droneHp=${droneHp(w).toFixed(1)} coil=${dmg} | ${rows.join(' · ')}`);
  assert(dmg >= maxHp(w, BOT.runner), `w${w} coil one-shots cyan`);
  assert(dmg >= maxHp(w, BOT.mortar), `w${w} coil one-shots mortar`);
  assert(dmg < maxHp(w, BOT.gunner), `w${w} gunner survives coil`);
  assert(dmg < maxHp(w, BOT.heavy), `w${w} heavy survives coil`);
}

if (failed) {
  console.error(`\n${failed} check(s) failed`);
  process.exit(1);
}
console.log('\nAll bay wave-balance checks passed.');
