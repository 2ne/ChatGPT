/**
 * Intact door/window openings must not freeze drones that hunt on the same side
 * of the wall as the operator (e.g. player nestled in a gap, drones along the
 * inside face). Only paths that CROSS the wall plane are blocked by the opening.
 */

/** Player clamp inset from HALF so the operator can't sit inside an opening slab. */
export const PLAYER_WALL_INSET = 1.05;

/** True when a→b stays entirely on one side of the opening's wall plane. */
export function sameSideOfOpening(o, ax, az, bx, bz) {
  const plane = o.axis === 'x' ? o.z : o.x;
  const aCoord = o.axis === 'x' ? az : ax;
  const bCoord = o.axis === 'x' ? bz : bx;
  return (aCoord - plane) * (bCoord - plane) > 0;
}

/**
 * wallBetween sample: intact opening only counts when the segment crosses its plane.
 * `shut` is the opening returned by shutAt at the sample point.
 */
export function shutBlocksWallSample(shut, ax, az, bx, bz) {
  if (!shut) return false;
  const plane = shut.axis === 'x' ? shut.z : shut.x;
  const aCoord = shut.axis === 'x' ? az : ax;
  const bCoord = shut.axis === 'x' ? bz : bx;
  return (aCoord - plane) * (bCoord - plane) <= 0;
}
