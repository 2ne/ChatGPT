/**
 * Stage 1 Defence Bay prep: footprint constants + mapview framing + exterior
 * floor extension (single flat mesh outside the original deck AABB).
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

/** Original main deck grid: indices -19…19 on a 1.6u step (must stay untouched). */
export const DECK_STEP = 1.6;
export const ORIGINAL_DECK_INDEX = 19;
/** World half-extent of the original baked deck plates (centre of outer plate + half size). */
export const ORIGINAL_DECK_HALF = ORIGINAL_DECK_INDEX * DECK_STEP + 1.565 / 2;

/**
 * One flat floor mesh covering room-2 footprint + margin, with a hole for the
 * original deck AABB so it never coplanar-overlaps those plates.
 * Same dark exterior colour as room-1’s outside plates (0x1c2b37).
 */
export function buildExtendedFloor(parent, material) {
  const xMax = ROOM2_HX + EXTERIOR_MARGIN;
  const zMin = ROOM2_NORTH - EXTERIOR_MARGIN;
  const zMax = ROOM1_HALF + EXTERIOR_MARGIN;
  const hole = ORIGINAL_DECK_HALF + 0.02;

  const shape = new THREE.Shape();
  shape.moveTo(-xMax, zMin);
  shape.lineTo(xMax, zMin);
  shape.lineTo(xMax, zMax);
  shape.lineTo(-xMax, zMax);
  shape.lineTo(-xMax, zMin);

  // Opposite winding to the outer path (Three.js hole requirement).
  const cut = new THREE.Path();
  cut.moveTo(-hole, -hole);
  cut.lineTo(hole, -hole);
  cut.lineTo(hole, hole);
  cut.lineTo(-hole, hole);
  cut.lineTo(-hole, -hole);
  shape.holes.push(cut);

  const geo = new THREE.ShapeGeometry(shape);
  // Shape is in XY; rotate into XZ. Match deck plate centres (y = -0.06).
  geo.rotateX(-Math.PI / 2);
  const mesh = new THREE.Mesh(geo, material);
  mesh.position.y = -0.06;
  mesh.receiveShadow = true;
  mesh.castShadow = false;
  parent.add(mesh);
  return mesh;
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
