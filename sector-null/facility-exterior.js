/**
 * Stage 1 Defence Bay prep: flat exterior floor tiles around room 1 only.
 * Room 2 footprint is reserved as the same flat tiles (no walls / no dressing).
 */
import * as THREE from 'three';

/** Room 1 half-extent (matches game.js HALF). */
export const ROOM1_HALF = 10;

/** Future room 2 (~2.3× room-1 floor). Door-to-door with room 1’s north wall. */
export const ROOM2_HX = 24;
export const ROOM2_HZ = 22;
/** Short open gap between room-1 north wall and room-2 south wall (no corridor). */
export const ROOM2_THRESHOLD = 2.2;
export const ROOM2_CZ = -(ROOM1_HALF + ROOM2_THRESHOLD + ROOM2_HZ);
export const ROOM2_SOUTH = ROOM2_CZ + ROOM2_HZ;
export const ROOM2_NORTH = ROOM2_CZ - ROOM2_HZ;

/** Exterior pad so a player hugging future room-2 walls still sees floor, not void. */
export const EXTERIOR_MARGIN = 22;

/**
 * Flat tiled floor only — same scale as room 1 deck plates (1.6u grid), slightly darker.
 * No pillars, machinery, pipes, grates, or any raised set dressing.
 */
export function buildFacilityExterior(batch, rng) {
  // Room-1 deck uses 1.565 boxes on a 1.6 grid at y=-0.06.
  const step = 1.6;
  const size = 1.565;
  const y = -0.06;
  const shadeA = 0x152028;
  const shadeB = 0x1a2834;

  const xMin = -(ROOM2_HX + EXTERIOR_MARGIN);
  const xMax = ROOM2_HX + EXTERIOR_MARGIN;
  const zMin = ROOM2_NORTH - EXTERIOR_MARGIN;
  const zMax = ROOM1_HALF + EXTERIOR_MARGIN;

  const i0 = Math.ceil(xMin / step);
  const i1 = Math.floor(xMax / step);
  const j0 = Math.ceil(zMin / step);
  const j1 = Math.floor(zMax / step);

  for (let j = j0; j <= j1; j++) {
    for (let i = i0; i <= i1; i++) {
      const x = i * step;
      const z = j * step;
      // Leave room 1’s own deck alone (including its existing outer plates).
      if (Math.abs(x) <= ROOM1_HALF + 0.9 && Math.abs(z) <= ROOM1_HALF + 0.9) continue;
      const shade = (i + j) & 1 ? shadeA : shadeB;
      batch.add([[size, 0.11, size, x, y, z, shade, 0, 0, 0, 0.024]], rng);
    }
  }
}

/** Map-view framing so James can see room 1 + reserved room-2 floor + exterior. */
export const MAPVIEW_CAM = {
  position: new THREE.Vector3(0, 110, -14),
  lookAt: new THREE.Vector3(0, 0, -14),
  fov: 48,
  fogNear: 70,
  fogFar: 220,
};
