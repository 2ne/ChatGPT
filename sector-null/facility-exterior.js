/**
 * Stage 1 Defence Bay prep: footprint constants + mapview framing.
 * The exterior floor is the existing room-1 deck mesh, extended in game.js —
 * there is no second floor layer.
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

/** Deck plate grid step used by room 1 (world units). */
export const DECK_STEP = 1.6;

/** Inclusive grid index range that covers room 2 + margin + room-1 margin. */
export function deckGridExtents() {
  const xMax = ROOM2_HX + EXTERIOR_MARGIN;
  const zMin = ROOM2_NORTH - EXTERIOR_MARGIN;
  const zMax = ROOM1_HALF + EXTERIOR_MARGIN;
  return {
    i0: Math.ceil((-xMax) / DECK_STEP),
    i1: Math.floor(xMax / DECK_STEP),
    j0: Math.ceil(zMin / DECK_STEP),
    j1: Math.floor(zMax / DECK_STEP),
  };
}

/** Map-view framing so James can see room 1 + reserved room-2 floor + exterior. */
export const MAPVIEW_CAM = {
  position: new THREE.Vector3(0, 110, -14),
  lookAt: new THREE.Vector3(0, 0, -14),
  fov: 48,
  near: 12,
  far: 260,
  fogNear: 70,
  fogFar: 220,
};
