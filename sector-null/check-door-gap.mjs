/**
 * Headless checks: drones must not deadlock when the operator stands in (or
 * hugs the wall beside) a door/window gap. Compares main-style blocking against
 * the Stage-1 fix (plane-crossing + tighter clamp).
 *
 * Run: node check-door-gap.mjs
 */
import assert from 'node:assert/strict';
import {
  PLAYER_WALL_INSET,
  sameSideOfOpening,
  shutBlocksWallSample,
} from './door-gap-nav.js';

const HALF = 10;
const WALL_T = 0.7;
const ht = WALL_T / 2;
const Z_RADIUS = 0.4;
const Z_REACH = 1.2;

function segHitsBox(ax, az, bx, bz, hx, hz) {
  let t0 = 0, t1 = 1;
  const dx = bx - ax, dz = bz - az;
  if (Math.abs(dx) < 1e-9) { if (Math.abs(ax) >= hx) return false; }
  else {
    const ta = (-hx - ax) / dx, tb = (hx - ax) / dx;
    t0 = Math.max(t0, Math.min(ta, tb)); t1 = Math.min(t1, Math.max(ta, tb));
  }
  if (Math.abs(dz) < 1e-9) { if (Math.abs(az) >= hz) return false; }
  else {
    const ta = (-hz - az) / dz, tb = (hz - az) / dz;
    t0 = Math.max(t0, Math.min(ta, tb)); t1 = Math.min(t1, Math.max(ta, tb));
  }
  return t0 < t1;
}

function makeOpening(axis, fixed, u0, u1, kind, name) {
  const c = (u0 + u1) / 2;
  const box = axis === 'x'
    ? { minX: u0, maxX: u1, minZ: fixed - ht, maxZ: fixed + ht }
    : { minX: fixed - ht, maxX: fixed + ht, minZ: u0, maxZ: u1 };
  return {
    name, kind, axis, u0, u1, x: axis === 'x' ? c : fixed, z: axis === 'x' ? fixed : c,
    box, hp: kind === 'door' ? 12 : 2,
  };
}

/** Room-1 openings matching game.js buildWall calls. */
const openings = [
  makeOpening('x', HALF, -0.8, 0.8, 'door', 'south-door'),
  makeOpening('x', -HALF, -5.8, -4.2, 'door', 'north-door'),
  makeOpening('x', -HALF, 4, 6, 'window', 'north-window'),
  makeOpening('z', -HALF, -1.5, 0.5, 'window', 'west-window'),
  makeOpening('z', HALF, 1.5, 3.5, 'window', 'east-window'),
];

/** Main / pre-fix: intact openings always block nav when the segment hits the box. */
function mainNavClear(ax, az, bx, bz, radius, o) {
  if (o.kind === 'door' && o.hp <= 0) return true;
  const w = o.box;
  const cx = (w.minX + w.maxX) / 2, cz = (w.minZ + w.maxZ) / 2;
  return !segHitsBox(ax - cx, az - cz, bx - cx, bz - cz,
    (w.maxX - w.minX) / 2 + radius, (w.maxZ - w.minZ) / 2 + radius);
}

/** Fixed: same-side skims ignore the opening. */
function fixedNavClear(ax, az, bx, bz, radius, o) {
  if (o.hp <= 0) return true;
  if (sameSideOfOpening(o, ax, az, bx, bz)) return true;
  const w = o.box;
  const cx = (w.minX + w.maxX) / 2, cz = (w.minZ + w.maxZ) / 2;
  return !segHitsBox(ax - cx, az - cz, bx - cx, bz - cz,
    (w.maxX - w.minX) / 2 + radius, (w.maxZ - w.minZ) / 2 + radius);
}

function mainWallBetween(a, b, o) {
  for (let i = 1; i < 4; i++) {
    const x = a.x + (b.x - a.x) * i / 4, z = a.z + (b.z - a.z) * i / 4;
    if (o.hp > 0 && x >= o.box.minX && x <= o.box.maxX && z >= o.box.minZ && z <= o.box.maxZ) {
      return true;
    }
  }
  return false;
}

function fixedWallBetween(a, b, o) {
  for (let i = 1; i < 4; i++) {
    const x = a.x + (b.x - a.x) * i / 4, z = a.z + (b.z - a.z) * i / 4;
    if (!(o.hp > 0 && x >= o.box.minX && x <= o.box.maxX && z >= o.box.minZ && z <= o.box.maxZ)) {
      continue;
    }
    if (shutBlocksWallSample(o, a.x, a.z, b.x, b.z)) return true;
  }
  return false;
}

function playerInGap(o, inset) {
  if (o.axis === 'x') return { x: o.x, z: Math.sign(o.z) * (HALF - inset) };
  return { x: Math.sign(o.x) * (HALF - inset), z: o.z };
}

function playerBesideGap(o, inset) {
  if (o.axis === 'x') {
    return { x: o.box.minX - 0.35, z: Math.sign(o.z) * (HALF - inset) };
  }
  return { x: Math.sign(o.x) * (HALF - inset), z: o.box.minZ - 0.35 };
}

/** Drone hunting along the inside face toward the player (the deadlock pose). */
function alongWallDrone(player, o) {
  if (o.axis === 'x') {
    const side = player.x >= o.x ? 1 : -1;
    return { x: player.x + side * 1.45, z: player.z };
  }
  const side = player.z >= o.z ? 1 : -1;
  return { x: player.x, z: player.z + side * 1.45 };
}

function lookStep(from, to) {
  const sx = to.x - from.x, sz = to.z - from.z, dist = Math.hypot(sx, sz) || 1;
  const look = Math.min(dist, 0.25);
  return { x: from.x + sx / dist * look, z: from.z + sz / dist * look, dist };
}

function isFrozen(navClear, wallBetween, drone, player, o) {
  const step = lookStep(drone, player);
  const canWalk = navClear(drone.x, drone.z, step.x, step.z, Z_RADIUS, o);
  const meleeBlocked = wallBetween(drone, player, o);
  const canMelee = step.dist < Z_REACH && !meleeBlocked;
  return !canWalk && !canMelee;
}

let mainFreezes = 0;
let fixedFreezes = 0;

for (const o of openings) {
  for (const place of ['in-gap', 'beside']) {
    const loose = place === 'in-gap' ? playerInGap(o, 0.7) : playerBesideGap(o, 0.7);
    const drone = alongWallDrone(loose, o);
    const freezeMain = isFrozen(mainNavClear, mainWallBetween, drone, loose, o);
    const freezeFix = isFrozen(fixedNavClear, fixedWallBetween, drone, loose, o);
    if (freezeMain) mainFreezes++;
    if (freezeFix) fixedFreezes++;
    assert.equal(
      freezeFix, false,
      `${o.name} ${place}: fixed nav still freezes (player ${JSON.stringify(loose)}, drone ${JSON.stringify(drone)})`,
    );

    // Tighter clamp: player pulled clear of the slab; fixed pathing still must work.
    const tight = place === 'in-gap' ? playerInGap(o, PLAYER_WALL_INSET) : playerBesideGap(o, PLAYER_WALL_INSET);
    const droneT = alongWallDrone(tight, o);
    assert.equal(
      isFrozen(fixedNavClear, fixedWallBetween, droneT, tight, o), false,
      `${o.name} ${place} @clamp: fixed nav freezes`,
    );
  }
}

assert.ok(mainFreezes > 0, 'expected main-style nav to deadlock in at least one gap pose');
assert.equal(fixedFreezes, 0, 'fixed nav must not deadlock');

// Crossing the wall plane (inside → outside through an intact door) must still block.
{
  const o = openings.find(x => x.name === 'south-door');
  const inside = { x: 0, z: 8.5 };
  const outside = { x: 0, z: 11.2 };
  assert.equal(fixedNavClear(inside.x, inside.z, outside.x, outside.z, Z_RADIUS, o), false,
    'crossing an intact door must stay blocked');
  assert.equal(fixedWallBetween(inside, outside, o), true,
    'wallBetween must still see an intact door when crossing');
}

// Broken openings never block.
{
  const o = { ...openings[0], hp: 0 };
  const a = { x: 0, z: 8.5 }, b = { x: 0, z: 11.2 };
  assert.equal(fixedNavClear(a.x, a.z, b.x, b.z, Z_RADIUS, o), true);
  assert.equal(fixedWallBetween(a, b, o), false);
}

console.log(`check-door-gap: ok (main freezes=${mainFreezes}, fixed freezes=0)`);
