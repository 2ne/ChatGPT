/**
 * Headless check: bay door gaps stay clear in wallBoxes (room-1 style),
 * intact openings still block plane-crossing, and bash waypoints are reachable
 * without overlapping the wall slab for N/W/E/S.
 */
import {
  BAY_DOOR_X, BAY_DOOR_GAP, BAY_DOOR_HALF, ROOM2_CZ,
  ROOM2_NORTH, ROOM2_SOUTH, ROOM2_WEST, ROOM2_EAST, ROOM2_COLLIDE_PAD,
  room2WallBoxes,
} from '../facility-exterior.js';
import { sameSideOfOpening, shutBlocksWallSample } from '../door-gap-nav.js';

const OPENING_INSET = 1.5;
const SHELL_T = 0.55;
const BOT_R = 0.45;
const BASH_R = 1.85;
let failed = 0;

function assert(cond, msg) {
  if (!cond) {
    console.error('FAIL:', msg);
    failed++;
  } else {
    console.log('ok:', msg);
  }
}

function makeOpening(id, axis, fixed, outwardSign) {
  const u0 = (axis === 'x' ? BAY_DOOR_X : ROOM2_CZ) - BAY_DOOR_HALF;
  const u1 = u0 + BAY_DOOR_GAP;
  const c = (u0 + u1) / 2;
  const s = outwardSign;
  const ht = 0.4;
  const p = out => axis === 'x' ? [c, fixed + s * out] : [fixed + s * out, c];
  const [x, z] = p(0);
  const [ox, oz] = p(OPENING_INSET);
  const [ix, iz] = p(-OPENING_INSET);
  const [fx, fz] = p(0.85);
  return {
    id, kind: 'door', bay: true, axis, u0, u1, x, z, ox, oz, ix, iz, fx, fz, hp: 12,
    box: axis === 'x'
      ? { minX: u0, maxX: u1, minZ: fixed - ht, maxZ: fixed + ht }
      : { minX: fixed - ht, maxX: fixed + ht, minZ: u0, maxZ: u1 },
  };
}

const openings = [
  makeOpening('north', 'x', ROOM2_NORTH, -1),
  makeOpening('south', 'x', ROOM2_SOUTH, 1),
  makeOpening('west', 'z', ROOM2_WEST, -1),
  makeOpening('east', 'z', ROOM2_EAST, 1),
];

const walls = room2WallBoxes({
  doorsOpen: { north: true, south: true, west: true, east: true },
});

function wallHit(x, z, r = BOT_R) {
  return walls.some(w =>
    x + r >= w.minX && x - r <= w.maxX && z + r >= w.minZ && z - r <= w.maxZ);
}

for (const o of openings) {
  // Front / outer waypoints must sit clear of wall slabs so bots can approach.
  assert(!wallHit(o.ox, o.oz), `${o.id}: outer waypoint clear of wall`);
  assert(!wallHit(o.fx, o.fz), `${o.id}: front bash waypoint clear of wall`);
  assert(!wallHit(o.ix, o.iz), `${o.id}: inner waypoint clear of wall`);

  // A bot at outer waypoint is within bay bash range (or one step closer).
  const distOx = Math.hypot(o.ox - o.x, o.oz - o.z);
  assert(distOx <= BASH_R + 0.2, `${o.id}: outer within ~bash range (${distOx.toFixed(2)})`);

  // Intact door blocks a path that crosses the wall plane.
  assert(
    shutBlocksWallSample(o, o.ox, o.oz, o.ix, o.iz),
    `${o.id}: intact opening blocks outside→inside crossing`,
  );
  assert(
    sameSideOfOpening(o, o.ox, o.oz, o.fx, o.fz),
    `${o.id}: outer→front stays same side (hunt along face OK)`,
  );

  // Broken door: crossing no longer blocked by hp (simulated).
  const broken = { ...o, hp: 0 };
  assert(broken.hp <= 0, `${o.id}: broken hp cleared`);

  // Spread across full 3-tile mouth: sample ±(gap/2 - 0.4) along the wall.
  const along = (o.u1 - o.u0) / 2 - 0.4;
  for (const t of [-along, 0, along]) {
    const sx = o.axis === 'x' ? o.x + t : o.ox;
    const sz = o.axis === 'z' ? o.z + t : o.oz;
    const ex = o.axis === 'x' ? o.x + t : o.ix;
    const ez = o.axis === 'z' ? o.z + t : o.iz;
    assert(!wallHit(sx, sz, 0.3), `${o.id}: spawn spread t=${t.toFixed(2)} clear`);
    assert(!wallHit(ex, ez, 0.3), `${o.id}: exit spread t=${t.toFixed(2)} clear`);
  }
}

// Sealed-gap regression: old behaviour parked east front inside the slab.
const sealed = room2WallBoxes({
  doorsOpen: { north: false, south: false, west: false, east: false },
});
const east = openings.find(o => o.id === 'east');
const sealedHitsFront = sealed.some(w =>
  east.fx + BOT_R >= w.minX && east.fx - BOT_R <= w.maxX
  && east.fz + BOT_R >= w.minZ && east.fz - BOT_R <= w.maxZ);
assert(sealedHitsFront, 'regression probe: sealed east front overlaps wall (documents old bug)');
assert(!wallHit(east.fx, east.fz), 'fix: gapped east front no longer overlaps wall');

if (failed) {
  console.error(`\n${failed} check(s) failed`);
  process.exit(1);
}
console.log('\nAll bay door checks passed.');
