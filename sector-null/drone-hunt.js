/**
 * Shared chase goal for melee drones. Keeps the stand-point inside the room
 * footprint AND inside melee reach so corner / wall-hug poses never park a bot
 * short of a swing (the old 0.78 corner shrink left them ~2.8u away).
 */

export const Z_REACH = 1.2;

function clamp(v, lo, hi) {
  return Math.max(lo, Math.min(hi, v));
}

/**
 * @param {number} px player x
 * @param {number} pz player z
 * @param {number} droneX drone x
 * @param {number} droneZ drone z
 * @param {{ half?: number, radius?: number, seed?: number, style?: string, reach?: number }} [opts]
 */
export function huntPointToward(px, pz, droneX, droneZ, opts = {}) {
  const half = opts.half ?? 10;
  const radius = opts.radius ?? 0.4;
  const seed = opts.seed ?? 0;
  const style = opts.style ?? 'melee';
  const reach = opts.reach ?? Z_REACH;
  const margin = radius + 0.55;

  let tx = clamp(px, -half + margin, half - margin);
  let tz = clamp(pz, -half + margin, half - margin);

  // Light pack fan — chargers commit straight in. Keep the offset small and
  // re-clamp so a corner operator stays within melee of the stand point.
  if (style !== 'rusher') {
    const side = Math.sin(seed * 7.13);
    const dx = px - droneX, dz = pz - droneZ, d = Math.hypot(dx, dz) || 1;
    tx += (-dz / d) * side * 0.35;
    tz += (dx / d) * side * 0.35;
    tx = clamp(tx, -half + margin, half - margin);
    tz = clamp(tz, -half + margin, half - margin);
  }

  const maxStand = reach * 0.85;
  const ox = tx - px, oz = tz - pz, od = Math.hypot(ox, oz);
  if (od > maxStand) {
    const s = maxStand / od;
    tx = px + ox * s;
    tz = pz + oz * s;
    tx = clamp(tx, -half + margin, half - margin);
    tz = clamp(tz, -half + margin, half - margin);
  }

  return { x: tx, z: tz };
}

/**
 * Legacy corner shrink used before the melee-reach fix — parks ~2.8u short of a
 * tucked operator. Kept only so headless tests can prove the regression.
 */
export function huntPointTowardLegacy(px, pz, droneX, droneZ, opts = {}) {
  const half = opts.half ?? 10;
  const radius = opts.radius ?? 0.4;
  const seed = opts.seed ?? 0;
  const style = opts.style ?? 'melee';
  const margin = radius + 0.55;

  let tx = clamp(px, -half + margin, half - margin);
  let tz = clamp(pz, -half + margin, half - margin);
  const corner = (half - margin) * 0.7;
  if (Math.abs(tx) > corner && Math.abs(tz) > corner) {
    tx *= 0.78;
    tz *= 0.78;
  }
  if (style !== 'rusher') {
    const side = Math.sin(seed * 7.13);
    const dx = px - droneX, dz = pz - droneZ, d = Math.hypot(dx, dz) || 1;
    tx += (-dz / d) * side * 0.65;
    tz += (dx / d) * side * 0.65;
  }
  return { x: tx, z: tz };
}
