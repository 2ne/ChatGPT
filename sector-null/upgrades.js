/** Shared upgrade catalog + helpers used by the game and the 3D preview page. */

export const DROP_CHANCE = 0.05; // per kill, before SALVAGE SCANNER

/** Shots/sec at Rapid Cycler ranks 0–4 (fireRate = 1 / value). */
export const FIRE_RATE_SPS = [8, 10, 12, 15, 20];

export const BASE_STATS = {
  maxHp: 3,
  magSize: 8,
  reloadTime: 1.2,
  fireRate: 1 / FIRE_RATE_SPS[0],
  damage: 1,
  pierce: 0,
  spread: 0,
  speed: 6.2,
  dropBonus: 0,
};

export const UPGRADE_CATS = {
  engineer: '#a7a1ff',
  firepower: '#ffad61',
  handling: '#76bcf0',
  survival: '#70dfb8',
  fortune: '#bdadfa',
  ability: '#7cff4a',
};

export const UPGRADE_CAT_ORDER = ['engineer', 'firepower', 'handling', 'survival', 'fortune', 'ability'];

/** Per-rank helper shot damage (index = owned bot rank). */
export const HELPER_DAMAGE = [0, 1.5, 2.5, 3];
export const helperDamage = (rank) => HELPER_DAMAGE[rank] ?? 0;

/** Absolute damage for the stat pill: trim trailing .0, keep one decimal otherwise. */
export function dmgLabel(n) {
  const t = Math.round(n * 10) / 10;
  return Number.isInteger(t) ? String(t) : t.toFixed(1);
}

function reloadPct(time) {
  return Math.round((time / BASE_STATS.reloadTime) * 100);
}

export function fireRateForRank(rank) {
  return 1 / (FIRE_RATE_SPS[rank] ?? FIRE_RATE_SPS[0]);
}

/** Keep roughly wave 5's supply budget as the regular drone count grows. */
export function supplyDropScale(wave) {
  return Math.min(1, 20 / (5 + Math.max(1, wave) * 3));
}

// Each card can be taken up to `max` times per run. `ok` (optional) hides a
// card while it would do nothing. `stat` returns [now, after] or a single-value
// [label] (no arrow) for the card.
export const UPGRADES = [
  { id: 'bot', cat: 'engineer', name: 'HELPER BOT', desc: 'Deploy one automatic companion', max: 3, stat: (s) => {
    const owned = s.upgrades.bot || 0;
    const next = helperDamage(owned + 1);
    if (!owned) return [`Single gun · ${dmgLabel(next)} dmg`];
    return [dmgLabel(helperDamage(owned)), `${dmgLabel(next)} dmg`];
  }, apply: () => {} },
  { id: 'botGun', cat: 'engineer', name: 'TWIN GUNS', desc: 'Double bot fire • locks out bombs', max: 2, ok: (s) => s.upgrades.bot && !s.upgrades.botBomb, stat: (s) => [s.upgrades.botGun ? 'Twin' : 'Single', s.upgrades.botGun ? 'Rapid twin' : 'Twin guns'], apply: () => {} },
  { id: 'botBomb', cat: 'engineer', name: 'BOMB LAUNCHER', desc: 'Area blasts • locks out twin guns', max: 2, ok: (s) => s.upgrades.bot && !s.upgrades.botGun, stat: (s) => [s.upgrades.botBomb ? 'Area bombs' : 'Single shots', s.upgrades.botBomb ? 'Wider bombs' : 'Area bombs'], apply: () => {} },
  { id: 'mine', cat: 'engineer', name: 'TRAIL MINES', desc: 'One trap every 8s • max 3 active', max: 3, stat: (s) => {
    // Matches equipmentBlast(..., 3 + u.mine, ...)
    const owned = s.upgrades.mine || 0;
    const next = 3 + owned + 1;
    return [owned ? dmgLabel(3 + owned) : 'Off', `${dmgLabel(next)} dmg`];
  }, apply: () => {} },
  { id: 'shock', cat: 'engineer', name: 'SHOCK MINES', desc: 'Mine blasts slow survivors for 3s', max: 1, ok: (s) => s.upgrades.mine, stat: () => ['Explosive', '+60% slow'], apply: () => {} },
  { id: 'regen', cat: 'survival', name: 'SHIELD REGEN', desc: 'Recover 1 shield after avoiding hits', max: 2, stat: (s) => ['No damage for', s.upgrades.regen ? '8 seconds' : '12 seconds'], apply: () => {} },
  { id: 'pulse', cat: 'survival', name: 'EMERGENCY PULSE', desc: 'Shield loss blasts and slows drones', max: 3, stat: (s) => {
    const owned = s.upgrades.pulse || 0;
    const nextDmg = 2 + (owned + 1) * 2; // matches equipmentBlast(..., 2 + u.pulse * 2, ...)
    return [owned ? dmgLabel(2 + owned * 2) : 'Off', `${dmgLabel(nextDmg)} dmg`];
  }, apply: () => {} },
  { id: 'mag', cat: 'handling', name: 'CELL CAPACITY', desc: '+4 pulses per cell', max: 5, stat: (s) => [s.magSize, `${s.magSize + 4} pulses`], apply: (s) => { s.magSize += 4; s.mag = s.magSize; } },
  { id: 'reload', cat: 'handling', name: 'HOT SWAP', desc: 'Reload 25% faster', max: 4, stat: (s) => {
    const now = reloadPct(s.reloadTime);
    const after = reloadPct(s.reloadTime * 0.75);
    return [`${now}%`, `${after}% reload`];
  }, apply: (s) => { s.reloadTime *= 0.75; } },
  { id: 'damage', cat: 'firepower', name: 'PULSE AMPLIFIER', desc: '+0.5 pulse damage', max: 6, stat: (s) => [dmgLabel(s.damage), `${dmgLabel(s.damage + 0.5)} dmg`], apply: (s) => { s.damage += 0.5; } },
  { id: 'rate', cat: 'firepower', name: 'RAPID CYCLER', desc: 'Fire faster', max: 4, stat: (s) => {
    const owned = s.upgrades.rate || 0;
    return [String(FIRE_RATE_SPS[owned]), `${FIRE_RATE_SPS[owned + 1]}/s`];
  }, apply: (s) => { s.fireRate = fireRateForRank(s.upgrades.rate || 0); } },
  { id: 'pierce', cat: 'firepower', name: 'PIERCING', desc: 'Shots pierce +1 drone', max: 3, stat: (s) => [s.pierce, `${s.pierce + 1} thru`], apply: (s) => { s.pierce++; } },
  { id: 'spread', cat: 'firepower', name: 'SPLIT BEAM', desc: '+1 pulse per shot', max: 3, stat: (s) => [1 + s.spread, `${2 + s.spread} per shot`], apply: (s) => { s.spread++; } },
  { id: 'hp', cat: 'survival', name: 'SHIELD ARRAY', desc: '+1 shield and recharge it', max: 3, stat: (s) => [s.maxHp, `${s.maxHp + 1} max hp`], apply: (s) => { s.maxHp++; s.hp++; } },
  { id: 'speed', cat: 'survival', name: 'MOTION SERVO', desc: 'Move 12% faster', max: 3, stat: (s) => [`${Math.round(s.speed / 6.2 * 100)}%`, `${Math.round(s.speed * 1.12 / 6.2 * 100)}%`], apply: (s) => { s.speed *= 1.12; } },
  { id: 'luck', cat: 'fortune', name: 'SALVAGE SCANNER', desc: 'More Overcharge / Infinite Cell drops', max: 3, stat: (s) => {
    const scale = supplyDropScale(s.wave);
    return [
      `${((DROP_CHANCE + s.dropBonus) * scale * 100).toFixed(1)}%`,
      `${((DROP_CHANCE + s.dropBonus + 0.03) * scale * 100).toFixed(1)}% drops`,
    ];
  }, apply: (s) => { s.dropBonus += 0.03; } },
  { id: 'heal', cat: 'survival', name: 'SHIELD RESET', desc: 'Restore all shield segments', max: Infinity, ok: (s) => s.hp < s.maxHp, stat: (s) => [s.hp, `${s.maxHp} hp`], apply: (s) => { s.hp = s.maxHp; } },
  // Score path: pick this instead of another gun / gear upgrade and vacuum every emerald.
  { id: 'magnet', cat: 'ability', name: 'MAGNETIC GEMS', desc: 'Gems surge toward you', max: 1, stat: () => ['Short pull', 'Through walls'], apply: () => {} },
];

export function upgradeById(id) {
  return UPGRADES.find((u) => u.id === id);
}

/**
 * Simulated run state for previewing a card at a given owned rank.
 * Applies real apply() for prior ranks so stat() matches the in-game picker.
 */
export function previewStateFor(u, owned, opts = {}) {
  const wave = opts.wave ?? 5; // Salvage Scanner preview uses wave ≤5 baseline
  const s = {
    ...BASE_STATS,
    wave,
    hp: opts.hp ?? BASE_STATS.maxHp,
    mag: BASE_STATS.magSize,
    upgrades: {},
  };

  // Prerequisites so ok()-gated modules render with a valid baseline.
  if (u.id === 'botGun' || u.id === 'botBomb') s.upgrades.bot = 1;
  if (u.id === 'shock') s.upgrades.mine = 1;
  if (u.id === 'heal') {
    s.hp = opts.hp ?? 2;
    s.maxHp = opts.maxHp ?? BASE_STATS.maxHp;
  }

  for (let i = 0; i < owned; i++) {
    s.upgrades[u.id] = (s.upgrades[u.id] || 0) + 1;
    u.apply(s);
  }
  return s;
}
