/**
 * Stage 1 Defence Bay prep: flat exterior floor tiles around room 1 only.
 * Room 2 footprint is reserved as the same flat tiles (no walls / no dressing).
 *
 * Must not coplanar-overlap room 1’s deck plates or the underdeck plane
 * (z-fighting is severe on mobile / mapview).
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
 * Existing room-1 deck in game.js places plates at i,j ∈ [-19, 19] on a 1.6 grid
 * (centres out to ±30.4, plate half-size 0.7825 → edge ≈ 31.18).
 * Exterior tiles must stay outside that AABB so they never share the deck’s y.
 */
export const EXISTING_DECK_HALF = 19 * 1.6 + 1.565 / 2 + 0.08; // ~31.26

/**
 * Flat tiled floor only — same 1.6u grid as room 1, slightly darker.
 * Clear vertical separation from the underdeck plane (y=-0.13).
 */
export function buildFacilityExterior(batch, rng) {
  const step = 1.6;
  const size = 1.565;
  // Deck plates: centre -0.06, height 0.11 → top ≈ -0.005.
  // Sit exterior slightly lower so tops don’t fight deck edges, but bottoms
  // stay well clear of underdeck (-0.13): centre -0.045, h 0.09 → bottom -0.09.
  const y = -0.045;
  const h = 0.09;
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
  const deckCut = EXISTING_DECK_HALF;

  for (let j = j0; j <= j1; j++) {
    for (let i = i0; i <= i1; i++) {
      const x = i * step;
      const z = j * step;
      // No overlap with the existing baked deck (same grid, was coplanar at y=-0.06).
      if (Math.abs(x) <= deckCut && Math.abs(z) <= deckCut) continue;
      const shade = (i + j) & 1 ? shadeA : shadeB;
      batch.add([[size, h, size, x, y, z, shade, 0, 0, 0, 0.024]], rng);
    }
  }
}

/** Map-view framing so James can see room 1 + reserved room-2 floor + exterior. */
export const MAPVIEW_CAM = {
  position: new THREE.Vector3(0, 110, -14),
  lookAt: new THREE.Vector3(0, 0, -14),
  fov: 48,
  // Tight near/far for mobile depth precision (default 0.1…320 z-fights badly).
  near: 12,
  far: 260,
  fogNear: 70,
  fogFar: 220,
};
