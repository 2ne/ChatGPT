/**
 * Stage 3 path sanity: walk waypoints stay clear of the reactor solid and
 * enter room 2 through the aligned south door.
 *
 * Run: node check-bay-walk.mjs
 */
import assert from 'node:assert/strict';
import {
  BAY_DOOR_X,
  ROOM2_SOUTH,
  BAY_STOP_INSET,
  bayWalkWaypoints,
  room2PlayerClamp,
} from './facility-exterior.js';

const HALF = 10;
const reactor = { x: 5.3, z: -13.6, hx: 2.8, hz: 2.5 };

function hitsReactor(x, z, pad = 0.45) {
  return Math.abs(x - reactor.x) < reactor.hx + pad
    && Math.abs(z - reactor.z) < reactor.hz + pad;
}

const wps = bayWalkWaypoints(HALF);
assert.ok(wps.length >= 4, 'need approach + gap + entry + stop');
assert.ok(Math.abs(BAY_DOOR_X - (-5)) < 0.05, `door x should be -5, got ${BAY_DOOR_X}`);

for (const wp of wps) {
  assert.ok(Math.abs(wp.x - BAY_DOOR_X) < 1e-6, `waypoint must stay on door line (${wp.x})`);
  assert.equal(hitsReactor(wp.x, wp.z), false, `waypoint hits reactor ${JSON.stringify(wp)}`);
}

const stop = wps[wps.length - 1];
assert.ok(stop.z < ROOM2_SOUTH, 'stop must be north of room-2 south wall');
assert.ok(Math.abs(stop.z - (ROOM2_SOUTH - BAY_STOP_INSET)) < 0.05, 'stop inset mismatch');
assert.ok(BAY_STOP_INSET >= 11, 'stop must clear camera Z-offset so south wall is behind cam');

const lim = room2PlayerClamp(1.05);
assert.ok(stop.x >= lim.minX && stop.x <= lim.maxX);
assert.ok(stop.z >= lim.minZ && stop.z <= lim.maxZ);

// Segment samples along the polyline must clear the reactor.
for (let i = 0; i < wps.length - 1; i++) {
  const a = wps[i], b = wps[i + 1];
  for (let s = 0; s <= 20; s++) {
    const t = s / 20;
    const x = a.x + (b.x - a.x) * t;
    const z = a.z + (b.z - a.z) * t;
    assert.equal(hitsReactor(x, z), false, `path clips reactor at ${x.toFixed(2)},${z.toFixed(2)}`);
  }
}

console.log(`check-bay-walk: ok (${wps.length} waypoints, door x=${BAY_DOOR_X})`);
