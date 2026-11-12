/**
 * Helper Bot orbit + aim math (pure). Keeps the companion on a polar path around
 * the operator so lerp chords never cut through the player model.
 */

export const HELPER_ORBIT_R = 1.5;
export const HELPER_MIN_R = 1.12;
export const HELPER_BOT_R = 0.38;
export const HELPER_ORBIT_H = 1.12;
export const HELPER_ORBIT_SPEED = 0.95;
/** World scale for the shared card/game mesh. */
export const HELPER_WORLD_SCALE = 0.62;
/** Yaw catch-up rate (rad/s) — near-instant turn onto a new target. */
export const HELPER_AIM_RATE = 22;
/** Fire once facing is within this many radians of the aim yaw. */
export const HELPER_AIM_FIRE = 0.4;

export function wrapAngle(a) {
  return Math.atan2(Math.sin(a), Math.cos(a));
}

export function yawToPoint(fromX, fromZ, toX, toZ) {
  return Math.atan2(toX - fromX, toZ - fromZ);
}

/** Local +Z after rotation.y = yaw (Three.js Y-up). */
export function forwardFromYaw(yaw) {
  return { x: Math.sin(yaw), y: 0, z: Math.cos(yaw) };
}

export function stepHelperYaw(current, want, dt, rate = HELPER_AIM_RATE) {
  const err = wrapAngle(want - current);
  const step = Math.max(0, rate) * Math.max(0, dt);
  if (Math.abs(err) <= step) return want;
  return current + Math.sign(err) * step;
}

export function helperAligned(current, want, tol = HELPER_AIM_FIRE) {
  return Math.abs(wrapAngle(want - current)) <= tol;
}

/**
 * Advance orbit phase and place the bot in polar coords around the player.
 * Never moves along a chord through the player — only angle + radius.
 */
export function stepHelperOrbit(state, dt, opts = {}) {
  const R = opts.orbitR ?? HELPER_ORBIT_R;
  const minR = opts.minR ?? HELPER_MIN_R;
  const orbitSpeed = opts.orbitSpeed ?? HELPER_ORBIT_SPEED;
  const height = opts.height ?? HELPER_ORBIT_H;
  const bob = opts.bob ?? 0;
  const px = state.px;
  const pz = state.pz;
  let { x, z, y, orbit } = state;

  orbit += dt * orbitSpeed;
  const targetY = height + bob;

  let dx = x - px;
  let dz = z - pz;
  let dist = Math.hypot(dx, dz);
  let ang = dist > 1e-5 ? Math.atan2(dz, dx) : orbit;

  let angErr = wrapAngle(orbit - ang);
  const maxAng = Math.max(orbitSpeed * 2.5, 4) * dt;
  if (Math.abs(angErr) <= maxAng) ang = orbit;
  else ang += Math.sign(angErr) * maxAng;

  // Reel the desired phase in if we were blocked / lagged far behind it.
  angErr = wrapAngle(orbit - ang);
  if (Math.abs(angErr) > 2.1) orbit = ang + Math.sign(angErr) * 2.1;

  let r = dist < 1e-5 ? minR : dist;
  r += (R - r) * Math.min(1, dt * 7);
  if (r < minR) r = minR;

  x = px + Math.cos(ang) * r;
  z = pz + Math.sin(ang) * r;
  y += (targetY - y) * Math.min(1, dt * 10);

  return { x, y, z, orbit, ang, r };
}

/** Push out radially so the bot never sits inside the operator. */
export function enforceMinRadius(px, pz, x, z, minR = HELPER_MIN_R, fallbackAng = 0) {
  let dx = x - px;
  let dz = z - pz;
  let dist = Math.hypot(dx, dz);
  if (dist >= minR) return { x, z, dist };
  if (dist < 1e-5) {
    dx = Math.cos(fallbackAng);
    dz = Math.sin(fallbackAng);
    dist = 1;
  }
  const s = minR / dist;
  return { x: px + dx * s, z: pz + dz * s, dist: minR };
}
