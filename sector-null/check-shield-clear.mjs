/**
 * Headless checks for persistent wave-clear shield floor pickups.
 * Run: node check-shield-clear.mjs
 */
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.dirname(fileURLToPath(import.meta.url));
const html = readFileSync(path.join(root, 'index.html'), 'utf8');
const css = readFileSync(path.join(root, 'style.css'), 'utf8');
const game = readFileSync(path.join(root, 'game.js'), 'utf8');
const audio = readFileSync(path.join(root, 'audio.js'), 'utf8');

assert.doesNotMatch(html, /id="pickerHeal"/, 'pickerHeal markup should be removed');
assert.doesNotMatch(html, /\+1 SHIELD RESTORED/, 'overlay callout copy should be removed');
assert.doesNotMatch(css, /#picker #pickerHeal/, 'pickerHeal CSS should be removed');
assert.match(css, /shield-pip-refill/, 'pip refill animation should remain for pickups');
assert.match(audio, /heal\(\)\s*\{/, 'heal() SFX should remain for pickups');

assert.match(game, /spawnWaveClearShield/, 'persistent wave-clear shield spawn missing');
assert.match(game, /waveClearShield/, 'waveClearShield flag missing');
assert.match(game, /life:\s*Infinity/, 'persistent shield must not expire');
assert.match(game, /placeReachableDrop/, 'arena placement helper missing');
assert.match(game, /hasWaveClearShield/, 'single-pickup guard missing');
assert.match(game, /clearWaveClearShields/, 'replace-existing clear missing');
assert.doesNotMatch(game, /restoreShieldSegment\(\{\s*sfx:\s*true,\s*forPicker/, 'auto-refill forPicker path should be gone');
assert.doesNotMatch(game, /pickerHeal/, 'pickerHeal references should be gone');
assert.doesNotMatch(
  game,
  /pickerSub\.textContent = \(healed \? '\+1 SHIELD/,
  'subtitle shield prefix should stay gone',
);
assert.doesNotMatch(
  game,
  /if\s*\(!fromBoss\)\s*restoreShieldSegment/,
  'wave-clear auto-refill should be gone',
);
assert.match(game, /BOSS_FULL_SHIELD_GEMS/, 'full-shield boss gem burst should remain');
assert.match(game, /if \(state\.hp < state\.maxHp\) spawnWaveClearShield/, 'boss injured → shield');

// Rule table
function shouldSpawnClearShield(hp, maxHp, alreadyHas) {
  return hp < maxHp && !alreadyHas;
}
function bossDropKind(hp, maxHp) {
  return hp < maxHp ? 'shield' : 'gems';
}
function autoRefillOnClear() {
  return false;
}
assert.equal(shouldSpawnClearShield(2, 3, false), true);
assert.equal(shouldSpawnClearShield(3, 3, false), false);
assert.equal(shouldSpawnClearShield(2, 3, true), false);
assert.equal(bossDropKind(2, 3), 'shield');
assert.equal(bossDropKind(3, 3), 'gems');
assert.equal(autoRefillOnClear(), false);

console.log('check-shield-clear: ok');
