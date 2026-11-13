/**
 * Defence Bay staged prep: footprint constants, exterior floor, room-2 outer shell,
 * mapview framing.
 */
import * as THREE from 'three';

/** Room 1 half-extent (matches game.js HALF). */
export const ROOM1_HALF = 10;

/** Room-1 north door span (game.js buildWall) — room-2 south door matches this. */
export const ROOM1_NORTH_DOOR = { u0: -5.8, u1: -4.2 };
/** Door centre on X (walk path stays on this line — clears the reactor at x≈5.3). */
export const BAY_DOOR_X = (ROOM1_NORTH_DOOR.u0 + ROOM1_NORTH_DOOR.u1) / 2;
/** Bay layout centre X — same as the walk / N–S door line. */
export const BAY_CX = BAY_DOOR_X;
/** Room-2 doorway clear width — three floor tiles (deck step 1.6). */
export const BAY_DOOR_GAP = 4.8;
export const BAY_DOOR_HALF = BAY_DOOR_GAP / 2;

/**
 * Room 2 half-extents about the bay centre (BAY_CX, ROOM2_CZ).
 * Width was previously ±24 about world x=0 (asymmetric about the walk line);
 * now walls sit at BAY_CX ± ROOM2_HX so the cross is perfectly symmetric.
 * 19 keeps the west wall (~−24) and narrows the east; still ~1.9× room-1 wide.
 */
export const ROOM2_HX = 19;
export const ROOM2_HZ = 22;
/**
 * Open exterior strip between room-1 north wall and room-2 south wall (~9–10
 * deck tiles → south wall ≈ z=-25). Bigger gap so gameplay only sees a faint
 * hint of room 2; reactor at z≈-13.6 stays in the strip outside room 2.
 */
export const ROOM2_THRESHOLD = 15;
export const ROOM2_CZ = -(ROOM1_HALF + ROOM2_THRESHOLD + ROOM2_HZ);
export const ROOM2_SOUTH = ROOM2_CZ + ROOM2_HZ;
export const ROOM2_NORTH = ROOM2_CZ - ROOM2_HZ;
export const ROOM2_WEST = BAY_CX - ROOM2_HX;
export const ROOM2_EAST = BAY_CX + ROOM2_HX;

/** Half-thickness pad for room-2 collision footprint (matches shell depth). */
export const ROOM2_COLLIDE_PAD = 0.28;

/** Axis-aligned footprint including walls — enemies must route around, never through. */
export function room2CollisionBoxes() {
  return [{
    minX: ROOM2_WEST - ROOM2_COLLIDE_PAD,
    maxX: ROOM2_EAST + ROOM2_COLLIDE_PAD,
    minZ: ROOM2_NORTH - ROOM2_COLLIDE_PAD,
    maxZ: ROOM2_SOUTH + ROOM2_COLLIDE_PAD,
  }];
}

/** True if (x,z) is inside room 2’s footprint (for spawn rejection). */
export function pointInRoom2(x, z, margin = 0.6) {
  return x >= ROOM2_WEST - margin && x <= ROOM2_EAST + margin
    && z <= ROOM2_SOUTH + margin && z >= ROOM2_NORTH - margin;
}

/**
 * How far inside room 2 the Stage-3 walk stops.
 * ≥ camera Z-offset (11) so the south wall sits behind the follow cam at rest
 * and no longer draws as mid-screen bars over the player.
 */
export const BAY_STOP_INSET = 14;

/** Exterior pad so a player hugging future room-2 walls still sees floor, not void. */
export const EXTERIOR_MARGIN = 22;

/** Original main deck grid: indices -19…19 on a 1.6u step (must stay untouched). */
export const DECK_STEP = 1.6;
export const ORIGINAL_DECK_INDEX = 19;
/** World half-extent of the original baked deck plates (centre of outer plate + half size). */
export const ORIGINAL_DECK_HALF = ORIGINAL_DECK_INDEX * DECK_STEP + 1.565 / 2;

/**
 * One flat floor mesh covering room-2 footprint + margin, with holes for:
 *  - the original deck AABB (room-1 plates)
 *  - the bay interior (bay deck tiles / channels / dais)
 * so nothing coplanar-overlaps those surfaces at y = -0.06.
 * Same dark exterior colour as room-1’s outside plates (0x1c2b37).
 */
export function buildExtendedFloor(parent, material) {
  // Cover room 1 + bay + margin; bay is offset to BAY_CX so extents are not ±symmetric.
  const roomPad = ROOM1_HALF + EXTERIOR_MARGIN;
  const xMin = Math.min(-roomPad, ROOM2_WEST - EXTERIOR_MARGIN);
  const xMax = Math.max(roomPad, ROOM2_EAST + EXTERIOR_MARGIN);
  const zMin = ROOM2_NORTH - EXTERIOR_MARGIN;
  const zMax = ROOM1_HALF + EXTERIOR_MARGIN;
  const hole = ORIGINAL_DECK_HALF + 0.02;
  // Bay hole: inset slightly past the wall inner face so door thresholds stay on exterior.
  const bayPad = 0.35;
  const bayX0 = ROOM2_WEST + bayPad;
  const bayX1 = ROOM2_EAST - bayPad;
  const bayZ0 = ROOM2_NORTH + bayPad;
  const bayZ1 = ROOM2_SOUTH - bayPad;

  const shape = new THREE.Shape();
  shape.moveTo(xMin, zMin);
  shape.lineTo(xMax, zMin);
  shape.lineTo(xMax, zMax);
  shape.lineTo(xMin, zMax);
  shape.lineTo(xMin, zMin);

  // Opposite winding to the outer path (Three.js hole requirement).
  const cutDeck = new THREE.Path();
  cutDeck.moveTo(-hole, -hole);
  cutDeck.lineTo(hole, -hole);
  cutDeck.lineTo(hole, hole);
  cutDeck.lineTo(-hole, hole);
  cutDeck.lineTo(-hole, -hole);
  shape.holes.push(cutDeck);

  // Hole out the bay interior so the plane never sits under bay deck tiles.
  const cutBay = new THREE.Path();
  cutBay.moveTo(bayX0, bayZ0);
  cutBay.lineTo(bayX0, bayZ1);
  cutBay.lineTo(bayX1, bayZ1);
  cutBay.lineTo(bayX1, bayZ0);
  cutBay.lineTo(bayX0, bayZ0);
  shape.holes.push(cutBay);

  const geo = new THREE.ShapeGeometry(shape);
  geo.rotateX(-Math.PI / 2);
  const mesh = new THREE.Mesh(geo, material);
  mesh.position.y = -0.06;
  mesh.receiveShadow = true;
  mesh.castShadow = false;
  parent.add(mesh);
  return mesh;
}

const SHELL_H = 2.4;
const SHELL_T = 0.55;
const SHELL_PANELS = [0x425765, 0x364957, 0x3d5466, 0x344650];
const SHELL_POST = 0x1c2d38;
const SHELL_FRAME = 0x5b7182;
const FLOOR_IN = 0x263543;
const FLOOR_TRIM = 0x6f8a9e;

function shellMat(color, extras = {}) {
  return new THREE.MeshStandardMaterial({
    color, metalness: 0.38, roughness: 0.55, ...extras,
  });
}

function addBox(parent, mat, x, y, z, w, h, d) {
  const m = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), mat);
  m.position.set(x, y, z);
  m.castShadow = true;
  m.receiveShadow = true;
  parent.add(m);
  return m;
}

/** Horizontal wall run along X at fixed Z, optionally skipping [gap0, gap1]. */
function wallRunX(parent, mat, z, x0, x1, y, h, d) {
  const len = Math.abs(x1 - x0);
  if (len < 0.05) return;
  addBox(parent, mat, (x0 + x1) / 2, y, z, len, h, d);
}

/** Horizontal wall run along Z at fixed X. */
function wallRunZ(parent, mat, x, z0, z1, y, h, d) {
  const len = Math.abs(z1 - z0);
  if (len < 0.05) return;
  addBox(parent, mat, x, y, (z0 + z1) / 2, d, h, len);
}

/**
 * Stage 2: room-2 outer shell only (walls + floor/outline + south door gap).
 * Shell mesh is visual; collision boxes come from room2CollisionBoxes() (enemies
 * only — room-1 player clamp unchanged). South door X-aligned with room-1 north door.
 */
export function buildRoom2Shell(parent) {
  const group = new THREE.Group();
  group.name = 'room2Shell';
  parent.add(group);

  // South wall on the room-2 boundary (clear exterior strip south of here to room 1).
  const southZ = ROOM2_SOUTH;
  const northZ = ROOM2_NORTH;
  const westX = ROOM2_WEST;
  const eastX = ROOM2_EAST;
  const doorU0 = BAY_DOOR_X - BAY_DOOR_HALF;
  const doorU1 = BAY_DOOR_X + BAY_DOOR_HALF;
  const panelMat = shellMat(SHELL_PANELS[1]);
  const postMat = shellMat(SHELL_POST);
  const frameMat = shellMat(SHELL_FRAME);
  const floorMat = shellMat(FLOOR_IN, { metalness: 0.32, roughness: 0.62 });
  const trimMat = shellMat(FLOOR_TRIM, { metalness: 0.45, roughness: 0.4 });

  // Interior floor (above the exterior plane) + edge outline.
  const floorW = ROOM2_HX * 2 - 0.15;
  const floorD = Math.abs(northZ - southZ) - SHELL_T * 0.2;
  const floor = new THREE.Mesh(new THREE.BoxGeometry(floorW, 0.1, floorD), floorMat);
  floor.position.set(BAY_CX, -0.04, (southZ + northZ) / 2);
  floor.receiveShadow = true;
  floor.castShadow = false;
  group.add(floor);

  // Thin outline trim on the floor edge (reads as room footprint).
  const inset = 0.35;
  const fz0 = southZ + inset, fz1 = northZ - inset;
  const fx0 = westX + inset, fx1 = eastX - inset;
  const tw = 0.12, th = 0.04;
  wallRunX(group, trimMat, fz0, fx0, fx1, 0.02, th, tw);
  wallRunX(group, trimMat, fz1, fx0, fx1, 0.02, th, tw);
  wallRunZ(group, trimMat, fx0, fz0, fz1, 0.02, th, tw);
  wallRunZ(group, trimMat, fx1, fz0, fz1, 0.02, th, tw);

  // Panel bands (visual match to room-1 bulkheads — no collision).
  const bandH = 0.37;
  const band0 = 0.21;
  for (let k = 0; k < 6; k++) {
    const y = band0 + k * 0.4;
    const mat = shellMat(SHELL_PANELS[k % SHELL_PANELS.length]);
    // South wall with three-tile door gap
    wallRunX(group, mat, southZ, westX, doorU0 - 0.05, y, bandH, SHELL_T);
    wallRunX(group, mat, southZ, doorU1 + 0.05, eastX, y, bandH, SHELL_T);
    // North / west / east solid
    wallRunX(group, mat, northZ, westX, eastX, y, bandH, SHELL_T);
    wallRunZ(group, mat, westX, southZ, northZ, y, bandH, SHELL_T);
    wallRunZ(group, mat, eastX, southZ, northZ, y, bandH, SHELL_T);
  }

  // Cap rail
  wallRunX(group, frameMat, southZ, westX, doorU0 - 0.05, SHELL_H, 0.06, SHELL_T + 0.08);
  wallRunX(group, frameMat, southZ, doorU1 + 0.05, eastX, SHELL_H, 0.06, SHELL_T + 0.08);
  wallRunX(group, frameMat, northZ, westX, eastX, SHELL_H, 0.06, SHELL_T + 0.08);
  wallRunZ(group, frameMat, westX, southZ, northZ, SHELL_H, 0.06, SHELL_T + 0.08);
  wallRunZ(group, frameMat, eastX, southZ, northZ, SHELL_H, 0.06, SHELL_T + 0.08);

  // South door frame (outline only — Stage 4 defence-bay owns the real doors).
  const jamb = 0.14;
  const doorTop = 2.03;
  const dw = BAY_DOOR_GAP;
  addBox(group, postMat, doorU0 + jamb / 2, (doorTop + 0.1) / 2, southZ, jamb, doorTop + 0.1, SHELL_T + 0.1);
  addBox(group, postMat, doorU1 - jamb / 2, (doorTop + 0.1) / 2, southZ, jamb, doorTop + 0.1, SHELL_T + 0.1);
  addBox(group, postMat, BAY_DOOR_X, doorTop + 0.02, southZ, dw + 0.1, 0.14, SHELL_T + 0.12);
  wallRunX(group, panelMat, southZ, doorU0, doorU1, (doorTop + SHELL_H) / 2 + 0.05, SHELL_H - doorTop - 0.05, SHELL_T);

  // Placeholder leaf (shell-only path); Stage 4 uses defence-bay slide doors.
  const leafW = dw - 2 * jamb - 0.02;
  const leafH = 1.92;
  const leaf = new THREE.Mesh(
    new THREE.BoxGeometry(leafW, leafH, 0.16),
    shellMat(SHELL_POST),
  );
  leaf.castShadow = true;
  leaf.receiveShadow = true;
  const hinge = new THREE.Group();
  hinge.name = 'room2SouthDoor';
  hinge.position.set(doorU0 + jamb + 0.01, 0.02, southZ);
  leaf.position.set(leafW / 2, leafH / 2, 0);
  hinge.add(leaf);
  hinge.rotation.y = -Math.PI * 0.92;
  group.add(hinge);
  group.userData.southDoor = {
    hinge,
    open() { hinge.rotation.y = -Math.PI * 0.92; },
    shut() { hinge.rotation.y = 0; },
    x: BAY_DOOR_X,
    z: southZ,
  };

  return group;
}

/**
 * Room-2 wall AABBs for player/shot collision once inside the bay.
 * Four door gaps match the concept doors (N/S on BAY_DOOR_X, E/W on ROOM2_CZ).
 * South door gap stays open when `southDoorOpen` is true (walk-in); closed after slam.
 */
export function room2WallBoxes({ southDoorOpen = false } = {}) {
  const pad = ROOM2_COLLIDE_PAD;
  const t = SHELL_T / 2 + pad;
  const gap = BAY_DOOR_HALF;
  const boxes = [];

  // North wall with centred door gap (three-tile clear)
  boxes.push(
    {
      minX: ROOM2_WEST - pad, maxX: BAY_DOOR_X - gap,
      minZ: ROOM2_NORTH - t, maxZ: ROOM2_NORTH + t,
    },
    {
      minX: BAY_DOOR_X + gap, maxX: ROOM2_EAST + pad,
      minZ: ROOM2_NORTH - t, maxZ: ROOM2_NORTH + t,
    },
  );
  // West / east with centred door gaps (doors on ROOM2_CZ / dais Z)
  boxes.push(
    {
      minX: ROOM2_WEST - t, maxX: ROOM2_WEST + t,
      minZ: ROOM2_NORTH - pad, maxZ: ROOM2_CZ - gap,
    },
    {
      minX: ROOM2_WEST - t, maxX: ROOM2_WEST + t,
      minZ: ROOM2_CZ + gap, maxZ: ROOM2_SOUTH + pad,
    },
    {
      minX: ROOM2_EAST - t, maxX: ROOM2_EAST + t,
      minZ: ROOM2_NORTH - pad, maxZ: ROOM2_CZ - gap,
    },
    {
      minX: ROOM2_EAST - t, maxX: ROOM2_EAST + t,
      minZ: ROOM2_CZ + gap, maxZ: ROOM2_SOUTH + pad,
    },
  );
  if (southDoorOpen) {
    boxes.push(
      {
        minX: ROOM2_WEST - pad, maxX: BAY_DOOR_X - gap,
        minZ: ROOM2_SOUTH - t, maxZ: ROOM2_SOUTH + t,
      },
      {
        minX: BAY_DOOR_X + gap, maxX: ROOM2_EAST + pad,
        minZ: ROOM2_SOUTH - t, maxZ: ROOM2_SOUTH + t,
      },
    );
  } else {
    boxes.push({
      minX: ROOM2_WEST - pad, maxX: ROOM2_EAST + pad,
      minZ: ROOM2_SOUTH - t, maxZ: ROOM2_SOUTH + t,
    });
  }
  return boxes;
}

/** Player clamp limits inside room 2 (south door shut). */
export function room2PlayerClamp(inset = 1.05) {
  return {
    minX: ROOM2_WEST + inset,
    maxX: ROOM2_EAST - inset,
    minZ: ROOM2_NORTH + inset,
    maxZ: ROOM2_SOUTH - inset,
  };
}

/** Stage-3 auto-walk waypoints: room-1 north door → gap (past reactor) → room-2 stop. */
export function bayWalkWaypoints(room1Half = ROOM1_HALF) {
  const x = BAY_DOOR_X;
  return [
    { x, z: -room1Half + 2.4 },           // approach room-1 north door
    { x, z: -room1Half - 0.45 },          // through the frame
    { x, z: -18.2 },                      // gap strip west of reactor (reactor ≈ x 5.3)
    { x, z: ROOM2_SOUTH + 0.9 },          // square up on room-2 south door
    { x, z: ROOM2_SOUTH - BAY_STOP_INSET }, // a few tiles inside
  ];
}

/** Map-view framing: both rooms + the open strip between them (no fog in mapview). */
export const MAPVIEW_CAM = {
  position: new THREE.Vector3(BAY_CX * 0.45, 145, -28),
  lookAt: new THREE.Vector3(BAY_CX * 0.45, 0, -28),
  fov: 48,
  near: 14,
  far: 360,
};
