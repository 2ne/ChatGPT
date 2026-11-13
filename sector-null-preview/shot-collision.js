// 2D shot traces against walls, cover and shut openings.
// t is 0 at the start of a segment and 1 at the end.

export function segEnterAabb(ax, az, bx, bz, minX, maxX, minZ, maxZ) {
  const dx = bx - ax, dz = bz - az;
  let t0 = 0, t1 = 1;
  if (Math.abs(dx) < 1e-9) {
    if (ax < minX || ax > maxX) return null;
  } else {
    let ta = (minX - ax) / dx, tb = (maxX - ax) / dx;
    if (ta > tb) [ta, tb] = [tb, ta];
    t0 = Math.max(t0, ta);
    t1 = Math.min(t1, tb);
    if (t0 > t1) return null;
  }
  if (Math.abs(dz) < 1e-9) {
    if (az < minZ || az > maxZ) return null;
  } else {
    let ta = (minZ - az) / dz, tb = (maxZ - az) / dz;
    if (ta > tb) [ta, tb] = [tb, ta];
    t0 = Math.max(t0, ta);
    t1 = Math.min(t1, tb);
    if (t0 > t1) return null;
  }
  return t0 <= t1 ? t0 : null;
}

export function toLocal(solid, x, z) {
  const dx = x - solid.x, dz = z - solid.z;
  return { x: dx * solid.c - dz * solid.s, z: dx * solid.s + dz * solid.c };
}

export function pointBlocked(x, z, wallBoxes, solids, openings) {
  for (const w of wallBoxes) {
    if (x >= w.minX && x <= w.maxX && z >= w.minZ && z <= w.maxZ) return true;
  }
  for (const s of solids) {
    const p = toLocal(s, x, z);
    if (Math.abs(p.x) <= s.hx && Math.abs(p.z) <= s.hz) return true;
  }
  for (const o of openings) {
    if (o.hp <= 0) continue;
    const b = o.box;
    if (x >= b.minX && x <= b.maxX && z >= b.minZ && z <= b.maxZ) return true;
  }
  return false;
}

export function firstBlocker(ax, az, bx, bz, wallBoxes, solids, openings) {
  let bestT = Infinity, kind = null, opening = null;
  const consider = (t, k, o = null) => {
    if (t == null || t < 0 || t > 1 || t >= bestT) return;
    bestT = t;
    kind = k;
    opening = o;
  };
  for (const w of wallBoxes) {
    consider(segEnterAabb(ax, az, bx, bz, w.minX, w.maxX, w.minZ, w.maxZ), 'wall');
  }
  for (const s of solids) {
    const a = toLocal(s, ax, az), b = toLocal(s, bx, bz);
    consider(segEnterAabb(a.x, a.z, b.x, b.z, -s.hx, s.hx, -s.hz, s.hz), 'cover');
  }
  for (const o of openings) {
    if (o.hp <= 0) continue;
    const box = o.box;
    consider(segEnterAabb(ax, az, bx, bz, box.minX, box.maxX, box.minZ, box.maxZ), o.kind, o);
  }
  if (bestT === Infinity) return null;
  return {
    t: bestT,
    x: ax + (bx - ax) * bestT,
    z: az + (bz - az) * bestT,
    kind,
    opening,
  };
}

// If the muzzle is inside or past a solid, start the pulse from the body instead
// of beyond the wall. Returns an immediate impact when that ray hits in front
// of the muzzle (a shot into the wall you're hugging).
export function resolveShotStart(fromX, fromZ, muzzleX, muzzleZ, dirX, dirZ, world) {
  const { wallBoxes, solids, openings } = world;
  const occluded = pointBlocked(muzzleX, muzzleZ, wallBoxes, solids, openings)
    || firstBlocker(fromX, fromZ, muzzleX, muzzleZ, wallBoxes, solids, openings);
  if (!occluded) return { x: muzzleX, z: muzzleZ, impact: null, shatter: null };

  const look = 12;
  const hit = firstBlocker(fromX, fromZ, fromX + dirX * look, fromZ + dirZ * look, wallBoxes, solids, openings);
  const muzzleDist = Math.hypot(muzzleX - fromX, muzzleZ - fromZ);
  if (hit && hit.kind === 'window') {
    return { x: muzzleX, z: muzzleZ, impact: null, shatter: hit.opening };
  }
  if (hit && hit.t * look <= muzzleDist + 0.2) {
    const back = 0.04;
    return {
      x: hit.x - dirX * back,
      z: hit.z - dirZ * back,
      impact: hit,
      shatter: null,
    };
  }
  return { x: fromX + dirX * 0.35, z: fromZ + dirZ * 0.35, impact: null, shatter: null };
}
