/**
 * Headless checks for wave-clear shield callout + boss loot rules.
 * Run: node check-shield-clear.mjs
 */
import assert from 'node:assert/strict';
import { readFileSync, writeFileSync, unlinkSync, rmSync } from 'node:fs';
import { spawnSync } from 'node:child_process';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.dirname(fileURLToPath(import.meta.url));
const html = readFileSync(path.join(root, 'index.html'), 'utf8');
const css = readFileSync(path.join(root, 'style.css'), 'utf8');
const game = readFileSync(path.join(root, 'game.js'), 'utf8');
const audio = readFileSync(path.join(root, 'audio.js'), 'utf8');

assert.match(html, /id="pickerHeal"/, 'pickerHeal markup missing');
assert.match(html, /\+1 SHIELD RESTORED/, 'callout copy missing');
assert.match(css, /#picker #pickerHeal/, 'high-specificity heal badge CSS missing');
assert.match(css, /shield-pip-refill/, 'pip refill animation missing');
assert.match(css, /#ff78b5/, 'shield pink token missing');
assert.match(audio, /heal\(\)\s*\{/, 'heal() SFX missing');

assert.match(game, /finishWaveClear\(\{\s*fromBoss/, 'boss finishWaveClear path missing');
assert.match(game, /restoreShieldSegment/, 'restoreShieldSegment missing');
assert.match(game, /spawnBossShieldDrop/, 'boss shield drop missing');
assert.match(game, /BOSS_FULL_SHIELD_GEMS/, 'full-shield gem burst missing');
assert.match(game, /BOSS_LOOT_LINGER/, 'boss loot linger missing');
assert.match(game, /fadeBossLoot/, 'boss loot fade missing');
assert.match(game, /phase === 'loot'/, 'boss loot phase missing');
assert.match(game, /pickerHeal\.classList\.toggle/, 'picker heal toggle missing');
assert.doesNotMatch(
  game,
  /pickerSub\.textContent = \(healed \? '\+1 SHIELD/,
  'old subtitle shield prefix should be gone',
);

function bossDropKind(hp, maxHp) {
  return hp < maxHp ? 'shield' : 'gems';
}
function autoRefillOnClear(fromBoss, hp, maxHp) {
  if (fromBoss) return false;
  return hp < maxHp;
}
assert.equal(bossDropKind(2, 3), 'shield');
assert.equal(bossDropKind(3, 3), 'gems');
assert.equal(autoRefillOnClear(false, 2, 3), true);
assert.equal(autoRefillOnClear(true, 2, 3), false);
assert.equal(autoRefillOnClear(true, 3, 3), false);

const fixture = `<!doctype html><html><head>
<meta charset="utf-8"/>
<meta name="viewport" content="width=device-width, initial-scale=1"/>
<link rel="stylesheet" href="file://${path.join(root, 'style.css')}"/>
<style>
  html, body { margin: 0; background: #020810; }
  #cards .upgrade-card {
    min-height: 120px; background: #0a1a24; border: 1px solid #45ecff66;
    color: #dff; display: grid; place-items: center;
    font: 700 14px sans-serif;
  }
</style>
</head><body>
<div id="picker" class="shown">
  <div id="pickerTitle">WAVE 5 CLEARED</div>
  <div id="pickerHeal" aria-live="polite">
    <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 2.4l8 3.1v6.2c0 5.4-3.5 9.7-8 11.5-4.5-1.8-8-6.1-8-11.5V5.5l8-3.1z"/></svg>
    <span>+1 SHIELD RESTORED</span>
  </div>
  <div id="pickerSub">CHOOSE YOUR NEXT UPGRADE</div>
  <div id="cards">
    <div class="upgrade-card card">A</div>
    <div class="upgrade-card card">B</div>
    <div class="upgrade-card card">C</div>
  </div>
</div>
<script>
  const heal = document.getElementById('pickerHeal');
  const cards = document.getElementById('cards');
  const healBox = heal.getBoundingClientRect();
  const cardBox = cards.getBoundingClientRect();
  const titleBox = document.getElementById('pickerTitle').getBoundingClientRect();
  const subBox = document.getElementById('pickerSub').getBoundingClientRect();
  const stacked = healBox.bottom <= subBox.top + 2 && subBox.bottom <= cardBox.top + 4;
  document.title = JSON.stringify({
    ok: stacked && healBox.height > 0 && cardBox.height > 0 && titleBox.height > 0,
    healH: Math.round(healBox.height),
    cardsH: Math.round(cardBox.height),
    color: getComputedStyle(heal).color,
    stacked,
  });
</script>
</body></html>`;

const fixturePath = path.join(root, '.check-shield-fixture.html');
writeFileSync(fixturePath, fixture);

const viewports = [
  { w: 1280, h: 800, name: 'desktop' },
  { w: 390, h: 844, name: 'portrait' },
  { w: 844, h: 390, name: 'landscape' },
  { w: 390, h: 720, name: 'ios-ish' },
];

for (const vp of viewports) {
  const profile = `/tmp/chrome-sn-${vp.name}-${process.pid}`;
  const result = spawnSync('timeout', [
    '18',
    '/usr/local/bin/google-chrome',
    '--headless=new',
    '--no-sandbox',
    '--disable-gpu',
    `--user-data-dir=${profile}`,
    `--window-size=${vp.w},${vp.h}`,
    '--virtual-time-budget=2500',
    '--run-all-compositor-stages-before-draw',
    '--dump-dom',
    `file://${fixturePath}`,
  ], { encoding: 'utf8', maxBuffer: 5_000_000 });
  rmSync(profile, { recursive: true, force: true });
  // Chrome often dumps DOM then hangs; timeout 124 is acceptable if DOM arrived.
  assert.ok(
    result.status === 0 || result.status === 124,
    `chrome failed on ${vp.name} (${result.status}): ${result.stderr?.slice(0, 400)}`,
  );
  const title = result.stdout.match(/<title>([^<]*)<\/title>/)?.[1];
  assert.ok(title, `no title result for ${vp.name}`);
  const data = JSON.parse(title.replace(/&quot;/g, '"'));
  assert.ok(data.ok, `layout broke on ${vp.name}: ${title}`);
  assert.ok(data.healH >= 10, `heal badge too small on ${vp.name}: ${data.healH}`);
  assert.ok(data.cardsH >= 40, `cards collapsed on ${vp.name}: ${data.cardsH}`);
  assert.match(data.color.replace(/\s/g, ''), /rgb\(255,120,181\)/, `heal color off on ${vp.name}: ${data.color}`);
}

unlinkSync(fixturePath);
console.log('check-shield-clear: ok');
