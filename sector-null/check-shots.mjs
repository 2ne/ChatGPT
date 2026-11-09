import assert from 'node:assert/strict';
import {
  firstBlocker, pointBlocked, resolveShotStart, segEnterAabb,
} from './shot-collision.js';

const southWall = { minX: 0.8, maxX: 10.35, minZ: 9.65, maxZ: 10.35 };
const northWall = { minX: -10.35, maxX: 10.35, minZ: -10.35, maxZ: -9.65 };
const walls = [southWall, northWall];
const cover = [{ x: 0, z: 0, hx: 1, hz: 0.4, c: 1, s: 0 }];
const door = { kind: 'door', hp: 12, box: { minX: -0.8, maxX: 0.8, minZ: 9.65, maxZ: 10.35 } };
const window = { kind: 'window', hp: 2, box: { minX: 4, maxX: 6, minZ: -10.35, maxZ: -9.65 } };
const world = { wallBoxes: walls, solids: cover, openings: [door, window] };

function almost(a, b, msg) {
  assert.ok(Math.abs(a - b) < 0.08, msg || `${a} ≉ ${b}`);
}

{
  const t = segEnterAabb(2, 9.3, 2, 11, southWall.minX, southWall.maxX, southWall.minZ, southWall.maxZ);
  assert.ok(t !== null && t > 0 && t < 1, 'segment into south wall should enter');
}

{
  const t = segEnterAabb(2, 9.3, 6, 9.3, southWall.minX, southWall.maxX, southWall.minZ, southWall.maxZ);
  assert.equal(t, null, 'path along the inside of a wall should not hit it');
}

{
  assert.equal(pointBlocked(2, 10, walls, [], []), true);
  assert.equal(pointBlocked(2, 9.3, walls, [], []), false);
  assert.equal(pointBlocked(2, 10.8, walls, [], []), false, 'past the wall is not inside the box');
}

{
  const hit = firstBlocker(2, 9.3, 2, 10.8, walls, [], []);
  assert.ok(hit, 'body-to-muzzle through a wall is blocked');
  almost(hit.z, 9.65);
}

{
  const start = resolveShotStart(2, 9.3, 2, 10.77, 0, 1, world);
  assert.ok(start.impact, 'flush shot into a wall impacts the wall');
  almost(start.impact.z, 9.65);
  assert.equal(start.impact.kind, 'wall');
}

{
  const start = resolveShotStart(2, 9.3, 3.47, 9.3, 1, 0, world);
  assert.equal(start.impact, null, 'shot along a wall keeps the muzzle spawn');
  almost(start.x, 3.47);
  almost(start.z, 9.3);
}

{
  const start = resolveShotStart(0, 0, 0, 1.47, 0, 1, { wallBoxes: walls, solids: [], openings: [] });
  assert.equal(start.impact, null, 'open-floor shot spawns at the muzzle');
  almost(start.x, 0);
  almost(start.z, 1.47);
}

{
  const aim = 0.13;
  const dirX = Math.sin(aim), dirZ = Math.cos(aim);
  const start = resolveShotStart(2, 9.3, 2 + 1.47 * dirX, 9.3 + 1.47 * dirZ, dirX, dirZ, world);
  assert.ok(start.impact, 'split-beam pulse into a wall still impacts');
}

{
  const start = resolveShotStart(0, -0.2, 0, 0.2, 0, 1, world);
  assert.ok(start.impact, 'muzzle inside cover impacts');
  assert.equal(start.impact.kind, 'cover');
}

{
  const start = resolveShotStart(0, 9.3, 0, 10.77, 0, 1, {
    wallBoxes: walls, solids: [], openings: [door],
  });
  assert.ok(start.impact, 'flush shot into a shut door impacts');
  assert.equal(start.impact.kind, 'door');
}

{
  const broken = { ...door, hp: 0 };
  const start = resolveShotStart(0, 9.3, 0, 10.77, 0, 1, {
    wallBoxes: [], solids: [], openings: [broken],
  });
  assert.equal(start.impact, null, 'broken opening does not block');
}

{
  const start = resolveShotStart(5, -9.3, 5, -10.77, 0, -1, {
    wallBoxes: [], solids: [], openings: [window],
  });
  assert.ok(start.shatter, 'window at point-blank shatters instead of stopping the pulse');
  assert.equal(start.impact, null);
}

{
  const flight = firstBlocker(2, 8, 2, 12, walls, [], []);
  assert.ok(flight, 'in-flight segment cannot skip a wall');
  almost(flight.z, 9.65);
}

{
  const rot = { x: 2, z: 2, hx: 1, hz: 0.3, c: Math.cos(Math.PI / 4), s: Math.sin(Math.PI / 4) };
  const hit = firstBlocker(0, 2, 4, 2, [], [rot], []);
  assert.ok(hit, 'rotated cover still stops a shot');
}

console.log('check-shots: all cases passed');
