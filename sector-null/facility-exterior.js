/**
 * Stage 1 Defence Bay prep: cheap reactor-facility exterior around room 1.
 * Room 2 footprint is reserved as plain open floor (no walls yet).
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

function inRoom1(x, z, pad = 0.9) {
  return Math.abs(x) < ROOM1_HALF + pad && Math.abs(z) < ROOM1_HALF + pad;
}

function inRoom2Footprint(x, z, pad = 0.6) {
  return Math.abs(x) < ROOM2_HX + pad && z < ROOM2_SOUTH + pad && z > ROOM2_NORTH - pad;
}

function inThreshold(x, z) {
  return Math.abs(x) < 2.4 && z < -ROOM1_HALF + 0.4 && z > ROOM2_SOUTH - 0.4;
}

/**
 * Merged BlockBatch filler: tiled floor + dim machinery outside both rooms.
 * Room-2 footprint stays plain floor only. No lights, no shadow casters.
 */
export function buildFacilityExterior(batch, rng) {
  const dark = 0x121c24;
  const mid = 0x182430;
  const lit = 0x1e2c38;
  const grate = 0x152028;

  const xMin = -(ROOM2_HX + EXTERIOR_MARGIN);
  const xMax = ROOM2_HX + EXTERIOR_MARGIN;
  const zMin = ROOM2_NORTH - EXTERIOR_MARGIN;
  const zMax = ROOM1_HALF + EXTERIOR_MARGIN;
  const step = 2.6;

  // Continuous exterior tiles (room 1 + room 2 footprints get quieter plates)
  for (let z = zMin; z <= zMax; z += step) {
    for (let x = xMin; x <= xMax; x += step) {
      if (inRoom1(x, z, 0.5)) continue;
      const room2 = inRoom2Footprint(x, z, 0.3);
      const thresh = inThreshold(x, z);
      // Skip overlapping the baked room-1 deck ring already present near the walls
      if (!room2 && !thresh && Math.abs(x) < ROOM1_HALF + 3.2 && Math.abs(z) < ROOM1_HALF + 3.2) {
        // keep a thin collar of exterior tiles just outside the walls
        if (Math.abs(x) < ROOM1_HALF + 1.1 && Math.abs(z) < ROOM1_HALF + 1.1) continue;
      }
      const shade = room2 || thresh
        ? (((Math.abs(x * 3) + Math.abs(z * 3)) | 0) % 2 ? 0x1a2834 : 0x1e2e3a)
        : (((Math.abs(x) + Math.abs(z)) / 8 | 0) % 2 ? dark : mid);
      const h = room2 || thresh ? 0.06 : 0.08;
      batch.add([[step - 0.14, h, step - 0.14, x, -0.05, z, shade, 0, 0, 0, 0.015]], rng);
    }
  }

  // Soft edge outline of future room 2 (floor mark only — no walls)
  const outline = 0x243440;
  const t = 0.55;
  batch.add([
    [ROOM2_HX * 2, 0.04, t, 0, 0.01, ROOM2_SOUTH, outline],
    [ROOM2_HX * 2, 0.04, t, 0, 0.01, ROOM2_NORTH, outline],
    [t, 0.04, ROOM2_HZ * 2, -ROOM2_HX, 0.01, ROOM2_CZ, outline],
    [t, 0.04, ROOM2_HZ * 2, ROOM2_HX, 0.01, ROOM2_CZ, outline],
  ], rng);

  // Machinery / pipes / conduits — outside room 1 and outside room-2 footprint
  const placeBlock = (x, z, hScale = 1) => {
    if (inRoom1(x, z, 1.6)) return;
    if (inRoom2Footprint(x, z, 1.2)) return;
    if (inThreshold(x, z)) return;
    const hh = (2.0 + rng() * 3.2) * hScale;
    const w = 0.95 + rng() * 1.5;
    const d = 0.95 + rng() * 1.35;
    batch.add([
      [w, 0.2, d, x, 0.1, z, mid],
      [w * 0.55, hh, d * 0.55, x, hh / 2, z, dark],
      [w * 0.7, 0.24, d * 0.7, x, hh + 0.04, z, lit],
    ], rng);
    if (rng() > 0.5) {
      batch.add([[0.18, 0.18, 2.8 + rng() * 4.5, x, 1.0 + rng() * 0.8, z, grate]], rng);
    }
  };

  // Rings around room 1 (S/E/W — north is mostly room 2)
  for (const r of [ROOM1_HALF + 4.5, ROOM1_HALF + 9, ROOM1_HALF + 14]) {
    const n = Math.round(10 + r * 0.55);
    for (let i = 0; i < n; i++) {
      const a = (i / n) * Math.PI * 2 + rng() * 0.12;
      placeBlock(Math.cos(a) * r, Math.sin(a) * r, 0.85 + rng() * 0.35);
    }
  }

  // Belt around future room 2 — leave the interior clear
  for (const r of [Math.max(ROOM2_HX, ROOM2_HZ) + 4, Math.max(ROOM2_HX, ROOM2_HZ) + 9, Math.max(ROOM2_HX, ROOM2_HZ) + 15]) {
    const n = Math.round(14 + r * 0.45);
    for (let i = 0; i < n; i++) {
      const a = (i / n) * Math.PI * 2 + rng() * 0.1;
      const x = Math.cos(a) * r * (0.9 + 0.15 * Math.abs(Math.cos(a)));
      const z = ROOM2_CZ + Math.sin(a) * r * 0.85;
      placeBlock(x, z, 0.9 + rng() * 0.4);
    }
  }

  // Cardinal grate runs (cheap linear dressing)
  for (const x of [-ROOM1_HALF - 3.5, ROOM1_HALF + 3.5, -ROOM2_HX - 4, ROOM2_HX + 4]) {
    for (let z = zMin + 2; z <= zMax - 2; z += 3.4) {
      if (inRoom1(x, z, 2) || inRoom2Footprint(x, z, 1.5)) continue;
      batch.add([[0.5, 0.05, 2.8, x, 0.015, z, grate]], rng);
    }
  }
  for (const z of [ROOM1_HALF + 3.5, -ROOM1_HALF - 3.5, ROOM2_SOUTH + 4, ROOM2_NORTH - 4]) {
    for (let x = xMin + 2; x <= xMax - 2; x += 3.4) {
      if (inRoom1(x, z, 2) || inRoom2Footprint(x, z, 1.5)) continue;
      batch.add([[2.8, 0.05, 0.5, x, 0.015, z, grate]], rng);
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
