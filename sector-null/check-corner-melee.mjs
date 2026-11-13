/**
 * Headless grid: every reachable room-1 operator pose × several drone spawns
 * must close to melee and "deal damage" within N seconds.
 *
 * Root cause this guards: huntPoint's old corner shrink parked drones ~2.8u
 * short of a tucked operator (outside Z_REACH), so they stood next to them
 * and never swung.
 *
 * Run: node check-corner-melee.mjs
 */
import assert from 'node:assert/strict';
import {
  Z_REACH,
  huntPointToward,
  huntPointTowardLegacy,
} from './drone-hunt.js';

const HALF = 10;
const WALL_T = 0.7;
const EDGE = HALF + WALL_T / 2;
const ht = WALL_T / 2;
const Z_RADIUS = 0.4;
const Z_CLOSE = 0.95;
const DRONE_SPEED = 3.2;
const TIMEOUT = 8;
const DT = 1 / 30;
/** Matches live player clamp in game.js (HALF - 0.7). */
const PLAYER_WALL_INSET = 0.7;

const wallBoxes = [];
const openings = [];

function sameSideOfOpening(o, ax, az, bx, bz) {
  const plane = o.axis === 'x' ? o.z : o.x;
  const aCoord = o.axis === 'x' ? az : ax;
  const bCoord = o.axis === 'x' ? bz : bx;
  return (aCoord - plane) * (bCoord - plane) > 0;
}

function makeOpening(axis, fixed, u0, u1, kind) {
  const c = (u0 + u1) / 2;
  const box = axis === 'x'
    ? { minX: u0, maxX: u1, minZ: fixed - ht, maxZ: fixed + ht }
    : { minX: fixed - ht, maxX: fixed + ht, minZ: u0, maxZ: u1 };
  return {
    kind, axis, u0, u1,
    x: axis === 'x' ? c : fixed,
    z: axis === 'x' ? fixed : c,
    box, hp: kind === 'door' ? 12 : 2,
  };
}

function buildWall(axis, fixed, gaps) {
  let cursor = -EDGE;
  const segs = [];
  for (const [gs, ge, kind] of gaps.slice().sort((a, b) => a[0] - b[0])) {
    if (gs > cursor) segs.push([cursor, gs]);
    cursor = Math.max(cursor, ge);
    openings.push(makeOpening(axis, fixed, gs, ge, kind));
  }
  if (cursor < EDGE) segs.push([cursor, EDGE]);
  for (const [a, b] of segs) {
    const hw = (axis === 'x' ? b - a : WALL_T) / 2;
    const hd = (axis === 'x' ? WALL_T : b - a) / 2;
    const cx = axis === 'x' ? (a + b) / 2 : fixed;
    const cz = axis === 'x' ? fixed : (a + b) / 2;
    wallBoxes.push({ minX: cx - hw, maxX: cx + hw, minZ: cz - hd, maxZ: cz + hd });
  }
}

buildWall('x', HALF, [[-0.8, 0.8, 'door']]);
buildWall('x', -HALF, [[-5.8, -4.2, 'door'], [4, 6, 'window']]);
buildWall('z', -HALF, [[-1.5, 0.5, 'window']]);
buildWall('z', HALF, [[1.5, 3.5, 'window']]);

function shutAt(x, z) {
  for (const o of openings) {
    if (o.hp > 0 && x >= o.box.minX && x <= o.box.maxX && z >= o.box.minZ && z <= o.box.maxZ) {
      return o;
    }
  }
  return null;
}

/** Live main wallBetween: intact opening samples always count as blocked. */
function wallBetween(a, b) {
  for (let i = 1; i < 4; i++) {
    const x = a.x + (b.x - a.x) * i / 4;
    const z = a.z + (b.z - a.z) * i / 4;
    for (const w of wallBoxes) {
      if (x >= w.minX && x <= w.maxX && z >= w.minZ && z <= w.maxZ) return true;
    }
    if (shutAt(x, z)) return true;
  }
  return false;
}

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

function navClear(ax, az, bx, bz, radius) {
  for (const w of wallBoxes) {
    const cx = (w.minX + w.maxX) / 2, cz = (w.minZ + w.maxZ) / 2;
    if (segHitsBox(ax - cx, az - cz, bx - cx, bz - cz,
      (w.maxX - w.minX) / 2 + radius, (w.maxZ - w.minZ) / 2 + radius)) return false;
  }
  for (const o of openings) {
    if (o.hp <= 0) continue;
    if (sameSideOfOpening(o, ax, az, bx, bz)) continue;
    const w = o.box, cx = (w.minX + w.maxX) / 2, cz = (w.minZ + w.maxZ) / 2;
    if (segHitsBox(ax - cx, az - cz, bx - cx, bz - cz,
      (w.maxX - w.minX) / 2 + radius, (w.maxZ - w.minZ) / 2 + radius)) return false;
  }
  return true;
}

function pushFromPlayer(drone, player) {
  const dx = drone.x - player.x, dz = drone.z - player.z, d = Math.hypot(dx, dz);
  if (d < Z_CLOSE && d > 1e-6) {
    drone.x += dx / d * (Z_CLOSE - d);
    drone.z += dz / d * (Z_CLOSE - d);
  }
}

function simulateChase(player, spawn, huntFn, seed = 0.31) {
  const drone = { x: spawn.x, z: spawn.z };
  let damaged = false;
  let t = 0;
  for (; t < TIMEOUT; t += DT) {
    const pd = Math.hypot(player.x - drone.x, player.z - drone.z);
    const los = !wallBetween(drone, player);
    if (pd < Z_REACH && los) {
      damaged = true;
      break;
    }
    const hunt = huntFn(player.x, player.z, drone.x, drone.z, {
      half: HALF, radius: Z_RADIUS, seed, style: 'melee', reach: Z_REACH,
    });
    const lim = HALF - Z_RADIUS - 0.2;
    let tx = Math.max(-lim, Math.min(lim, hunt.x));
    let tz = Math.max(-lim, Math.min(lim, hunt.z));
    const gx = tx - drone.x, gz = tz - drone.z, gd = Math.hypot(gx, gz);
    if (gd < 0.03) continue;
    const sx = gx / gd, sz = gz / gd;
    const look = Math.min(gd, 0.25);
    if (!navClear(drone.x, drone.z, drone.x + sx * look, drone.z + sz * look, Z_RADIUS)) {
      const side = Math.sin(seed * 3.7) >= 0 ? 1 : -1;
      const ax = drone.x + side * 0.35, az = drone.z + side * 0.2;
      if (navClear(drone.x, drone.z, ax, az, Z_RADIUS)) {
        drone.x = ax; drone.z = az;
      }
      continue;
    }
    const step = Math.min(gd, DRONE_SPEED * DT);
    drone.x += sx * step;
    drone.z += sz * step;
    pushFromPlayer(drone, player);
  }
  return { damaged, t, drone, dist: Math.hypot(player.x - drone.x, player.z - drone.z) };
}

function playerPoses() {
  const lim = HALF - PLAYER_WALL_INSET;
  const poses = [];
  const seen = new Set();
  const add = (x, z, label) => {
    const cx = Math.max(-lim, Math.min(lim, x));
    const cz = Math.max(-lim, Math.min(lim, z));
    const key = `${cx.toFixed(2)},${cz.toFixed(2)}`;
    if (seen.has(key)) return;
    seen.add(key);
    poses.push({ x: cx, z: cz, label });
  };

  for (let ix = -9; ix <= 9; ix++) {
    for (let iz = -9; iz <= 9; iz++) add(ix, iz, `grid:${ix},${iz}`);
  }
  add(-lim, lim, 'corner:SW');
  add(lim, lim, 'corner:SE');
  add(-lim, -lim, 'corner:NW');
  add(lim, -lim, 'corner:NE');
  add(0, lim, 'wall:S');
  add(0, -lim, 'wall:N');
  add(-lim, 0, 'wall:W');
  add(lim, 0, 'wall:E');
  add(0, lim, 'gap:south-door');
  add(-5, -lim, 'gap:north-door');
  add(5, -lim, 'gap:north-window');
  add(-lim, -0.5, 'gap:west-window');
  add(lim, 2.5, 'gap:east-window');
  add(-1.2, lim, 'beside:south-door');
  add(-6.2, -lim, 'beside:north-door');
  add(-lim, -2.0, 'beside:west-window');

  return poses;
}

const droneSpawns = [
  { x: 0, z: 0, label: 'center' },
  { x: 0, z: 6, label: 'south-in' },
  { x: 0, z: -6, label: 'north-in' },
  { x: -6, z: 0, label: 'west-in' },
  { x: 6, z: 0, label: 'east-in' },
  { x: -7, z: 7, label: 'near-SW' },
  { x: 7, z: 7, label: 'near-SE' },
  { x: -7, z: -7, label: 'near-NW' },
  { x: 7, z: -7, label: 'near-NE' },
  { x: 0, z: 12, label: 'outside-south' },
  { x: -12, z: 0, label: 'outside-west' },
  { x: 0, z: -12, label: 'outside-north' },
];

{
  const lim = HALF - PLAYER_WALL_INSET;
  const sw = { x: -lim, z: lim };
  const legacy = huntPointTowardLegacy(sw.x, sw.z, 0, 0, { seed: 0.3 });
  const legacyDist = Math.hypot(legacy.x - sw.x, legacy.z - sw.z);
  assert.ok(legacyDist > Z_REACH,
    `legacy hunt must park beyond melee (got ${legacyDist.toFixed(2)})`);
  const fixed = huntPointToward(sw.x, sw.z, 0, 0, { seed: 0.3 });
  const fixedDist = Math.hypot(fixed.x - sw.x, fixed.z - sw.z);
  assert.ok(fixedDist <= Z_REACH * 0.85 + 1e-6,
    `fixed hunt must stay in melee (got ${fixedDist.toFixed(2)})`);
  const legChase = simulateChase(sw, { x: -7, z: 7 }, huntPointTowardLegacy);
  assert.equal(legChase.damaged, false,
    'legacy chase from near-SW must fail to damage a tucked SW player');
}

const poses = playerPoses();
let cases = 0;
const failures = [];

for (const player of poses) {
  for (const seed of [0.1, 0.31, 0.77, 1.4]) {
    const h = huntPointToward(player.x, player.z, 0, 0, { seed });
    const d = Math.hypot(h.x - player.x, h.z - player.z);
    if (d > Z_REACH + 1e-6) {
      failures.push(`hunt-reach ${player.label} seed=${seed} d=${d.toFixed(3)}`);
    }
  }

  for (const spawn of droneSpawns) {
    let start = spawn;
    if (Math.abs(spawn.x) >= HALF - 0.3 || Math.abs(spawn.z) >= HALF - 0.3) {
      const ix = Math.max(-HALF + 1.2, Math.min(HALF - 1.2, spawn.x));
      const iz = Math.max(-HALF + 1.2, Math.min(HALF - 1.2, spawn.z));
      start = { x: ix, z: iz, label: `${spawn.label}->in` };
    }
    cases++;
    const result = simulateChase(player, start, huntPointToward, 0.31 + cases * 0.017);
    if (!result.damaged) {
      failures.push(
        `${player.label} ← ${start.label || spawn.label}: `
        + `no damage in ${TIMEOUT}s (final dist=${result.dist.toFixed(2)} at `
        + `${result.drone.x.toFixed(2)},${result.drone.z.toFixed(2)})`,
      );
    }
  }
}

assert.equal(
  failures.length, 0,
  `corner-melee failures (${failures.length}/${cases}):\n${failures.slice(0, 25).join('\n')}`,
);

console.log(`check-corner-melee: ok (${cases} chase cases, ${poses.length} player poses)`);
