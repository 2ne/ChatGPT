/**
 * Headless checks for Helper Bot orbit clearance and aim alignment.
 * Run: node check-helper.mjs
 */
import assert from 'node:assert/strict';
import {
  HELPER_AIM_FIRE,
  HELPER_MIN_R,
  HELPER_ORBIT_R,
  enforceMinRadius,
  forwardFromYaw,
  helperAligned,
  stepHelperOrbit,
  stepHelperYaw,
  wrapAngle,
  yawToPoint,
} from './helper-motion.js';

const DT = 1 / 60;

function simulate(frames, start, movePlayer = null) {
  let s = { ...start };
  let minDist = Infinity;
  const path = [];
  for (let i = 0; i < frames; i++) {
    if (movePlayer) movePlayer(s, i * DT, DT);
    s = { ...s, ...stepHelperOrbit(s, DT) };
    // Wall shove toward the player (worst case), then clearance.
    if (i % 17 === 0) {
      s.x = (s.x + s.px) * 0.5;
      s.z = (s.z + s.pz) * 0.5;
    }
    const cleared = enforceMinRadius(s.px, s.pz, s.x, s.z, HELPER_MIN_R, s.orbit);
    s.x = cleared.x;
    s.z = cleared.z;
    const dist = Math.hypot(s.x - s.px, s.z - s.pz);
    minDist = Math.min(minDist, dist);
    path.push(dist);
  }
  return { s, minDist, path };
}

{
  // Chord lerp from opposite sides collapses through the player — polar must not.
  const start = {
    px: 0, pz: 0,
    x: HELPER_ORBIT_R, y: 1.12, z: 0,
    orbit: Math.PI, // desire the far side
  };
  const { minDist, s } = simulate(180, start);
  assert.ok(minDist + 1e-6 >= HELPER_MIN_R, `orbit dipped to ${minDist}, min is ${HELPER_MIN_R}`);
  assert.ok(Math.hypot(s.x - s.px, s.z - s.pz) >= HELPER_MIN_R - 1e-6, 'final distance under min');
}

{
  // Player walks into the bot — polar follow must stay clear.
  const start = {
    px: 0, pz: 0,
    x: HELPER_ORBIT_R, y: 1.12, z: 0,
    orbit: 0,
  };
  const { minDist } = simulate(240, start, (s, _t, dt) => {
    s.px += 6.2 * dt; // operator sprint into the companion
  });
  assert.ok(minDist + 1e-6 >= HELPER_MIN_R, `player rush overlapped bot (${minDist})`);
}

{
  // Steady orbit settles near the comfortable radius.
  const start = {
    px: 0, pz: 0,
    x: HELPER_MIN_R, y: 1.12, z: 0,
    orbit: 0,
  };
  const { s } = simulate(300, start);
  const dist = Math.hypot(s.x - s.px, s.z - s.pz);
  assert.ok(Math.abs(dist - HELPER_ORBIT_R) < 0.2, `settled radius ${dist}, want ~${HELPER_ORBIT_R}`);
}

{
  // Aim slerps toward a target and only reports aligned inside the fire cone.
  let yaw = 0;
  const want = Math.PI; // 180° flip
  let alignedEarly = false;
  for (let i = 0; i < 4; i++) {
    yaw = stepHelperYaw(yaw, want, DT);
    if (helperAligned(yaw, want)) alignedEarly = true;
  }
  assert.equal(alignedEarly, false, 'should not be aligned after a few frames of a 180° turn');
  for (let i = 0; i < 30; i++) yaw = stepHelperYaw(yaw, want, DT);
  assert.ok(helperAligned(yaw, want), 'should finish a 180° turn within ~0.5s');
  assert.ok(Math.abs(wrapAngle(yaw - want)) <= HELPER_AIM_FIRE);
}

{
  // Shots leave along barrel +Z for the current yaw.
  const yaw = yawToPoint(0, 0, 3, 4);
  const fwd = forwardFromYaw(yaw);
  const len = Math.hypot(fwd.x, fwd.z);
  assert.ok(Math.abs(len - 1) < 1e-9, 'forward is unit length');
  // Direction toward the point matches barrel forward.
  const dx = 3 / Math.hypot(3, 4);
  const dz = 4 / Math.hypot(3, 4);
  assert.ok(Math.abs(fwd.x - dx) < 1e-9 && Math.abs(fwd.z - dz) < 1e-9);
}

{
  // Idle facing uses the operator yaw directly (no orbit-tangent hack).
  const playerYaw = 1.2;
  let yaw = 0;
  for (let i = 0; i < 40; i++) yaw = stepHelperYaw(yaw, playerYaw, DT);
  assert.ok(helperAligned(yaw, playerYaw));
}

console.log('check-helper: ok');
