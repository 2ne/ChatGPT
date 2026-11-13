/**
 * Stage 4 Defence Bay — room-1 material quality, concept layout.
 * Visuals + collision solids only (no waves / Tesla card logic).
 *
 * Floor + walls use the same BlockBatch / bevel / vertex-color pipeline as
 * room 1 so lighting response and panel read match. Static geometry is
 * merged into few draw calls; emissive accents only (no new lights).
 */
import * as THREE from 'three';
import {
  BAY_DOOR_X,
  ROOM1_NORTH_DOOR,
  ROOM2_CZ,
  ROOM2_HX,
  ROOM2_HZ,
  ROOM2_NORTH,
  ROOM2_SOUTH,
} from './facility-exterior.js';

const CYAN = 0x62edff;
const SHELL_H = 2.4;
const SHELL_T = 0.7;
const PANEL_H = 0.37;
const WALL_STEP = 0.4;
const PANEL_D = 0.65;
const PANELS = [0x425765, 0x364957, 0x3d5466, 0x344650];
const POST = 0x1c2d38;
const FRAME = 0x5b7182;
const DECK_PANELS = [0x263543, 0x2b3e4b, 0x314452, 0x223340, 0x384a58];
const DECK_STEP = 1.6;
const DECK_TILE = 1.565;
const DOOR_GAP = Math.abs(ROOM1_NORTH_DOOR.u1 - ROOM1_NORTH_DOOR.u0);
const CHANNEL_HALF = 0.72;
const OCT_R = 4.35;

/**
 * @param {THREE.Object3D} parent
 * @param {object} helpers
 */
export function buildDefenceBay(parent, helpers) {
  const {
    box, model, halo, alloy, carbon, cyanLight, amberLight,
    BlockBatch, seeded, worldMat,
  } = helpers;

  const group = new THREE.Group();
  group.name = 'defenceBay';
  parent.add(group);

  const solids = [];
  const addSolid = (x, z, hx, hz, rotation = 0) => {
    solids.push({ x, z, hx, hz, c: Math.cos(rotation), s: Math.sin(rotation) });
  };

  const bake = (batch, cast = true) => {
    const mesh = new THREE.Mesh(batch.build(), worldMat);
    mesh.castShadow = cast;
    mesh.receiveShadow = true;
    group.add(mesh);
    return mesh;
  };

  // ── Floor: same bevelled deck plates as room 1 (1.6 spacing, panel palette) ──
  const floorB = new BlockBatch();
  const floorRng = seeded(401);
  const xMin = Math.ceil((-ROOM2_HX + 0.9) / DECK_STEP);
  const xMax = Math.floor((ROOM2_HX - 0.9) / DECK_STEP);
  const zMin = Math.ceil((ROOM2_NORTH + 0.9) / DECK_STEP);
  const zMax = Math.floor((ROOM2_SOUTH - 0.9) / DECK_STEP);
  for (let iz = zMin; iz <= zMax; iz++) {
    for (let ix = xMin; ix <= xMax; ix++) {
      const x = ix * DECK_STEP;
      const z = iz * DECK_STEP;
      // Leave trenches + dais footprint clear for recessed channels / platform.
      if (Math.abs(x) < CHANNEL_HALF + 0.35) continue;
      if (Math.abs(z - ROOM2_CZ) < CHANNEL_HALF + 0.35) continue;
      if (Math.hypot(x, z - ROOM2_CZ) < OCT_R + 0.35) continue;
      floorB.add([[
        DECK_TILE, 0.11, DECK_TILE, x, -0.06, z,
        DECK_PANELS[Math.floor(floorRng() * DECK_PANELS.length)],
        0, 0, 0, 0.024,
      ]], floorRng);
    }
  }
  // Cyan edge ticks along the trench lips (room-1 style floor accents)
  for (let z = ROOM2_NORTH + 2; z < ROOM2_SOUTH - 2; z += 0.55) {
    if (Math.abs(z - ROOM2_CZ) < OCT_R) continue;
    floorB.add([
      [0.11, 0.013, 0.28, CHANNEL_HALF + 0.2, 0.006, z, 0x6f8a9e, 0, 0, 0, 0],
      [0.11, 0.013, 0.28, -(CHANNEL_HALF + 0.2), 0.006, z, 0x6f8a9e, 0, 0, 0, 0],
    ], floorRng);
  }
  for (let x = -ROOM2_HX + 2; x < ROOM2_HX - 2; x += 0.55) {
    if (Math.abs(x) < OCT_R) continue;
    floorB.add([
      [0.28, 0.013, 0.11, x, 0.006, ROOM2_CZ + CHANNEL_HALF + 0.2, 0x6f8a9e, 0, 0, 0, 0],
      [0.28, 0.013, 0.11, x, 0.006, ROOM2_CZ - CHANNEL_HALF - 0.2, 0x6f8a9e, 0, 0, 0, 0],
    ], floorRng);
  }
  bake(floorB, false);

  // Bright cyan corner ticks near doors (match room-1 floor light lines)
  for (const [dx, dz] of [
    [BAY_DOOR_X - 1.4, ROOM2_SOUTH - 1.2], [BAY_DOOR_X + 1.4, ROOM2_SOUTH - 1.2],
    [BAY_DOOR_X - 1.4, ROOM2_NORTH + 1.2], [BAY_DOOR_X + 1.4, ROOM2_NORTH + 1.2],
    [-(ROOM2_HX - 1.2), ROOM2_CZ - 1.4], [-(ROOM2_HX - 1.2), ROOM2_CZ + 1.4],
    [ROOM2_HX - 1.2, ROOM2_CZ - 1.4], [ROOM2_HX - 1.2, ROOM2_CZ + 1.4],
  ]) {
    box(group, cyanLight, dx, 0.007, dz, 0.9, 0.014, 0.035);
    box(group, cyanLight, dx, 0.007, dz, 0.035, 0.014, 0.55);
  }

  // ── Walls: room-1 segmented panel stacks with door gaps ──
  const wallB = new BlockBatch();
  const wallRng = seeded(23);

  function wallBlock(axis, fixed, u0, u1, y, h, d, color, bevel, n = 0) {
    const len = Math.abs(u1 - u0);
    const c = (u0 + u1) / 2;
    return axis === 'x'
      ? [len, h, d, c, y, fixed + n, color, 0, 0, 0, bevel]
      : [d, h, len, fixed + n, y, c, color, 0, 0, 0, bevel];
  }

  function panelRun(axis, fixed, a, b, keep) {
    const layer0 = 0.21;
    for (let k = 0; k < 6; k++) {
      const y = layer0 + k * WALL_STEP;
      if (!keep(y)) continue;
      const count = Math.max(1, Math.ceil((b - a) / 2.4));
      for (let i = 0; i < count; i++) {
        const left = a + (b - a) * i / count;
        const right = a + (b - a) * (i + 1) / count;
        wallB.add([wallBlock(
          axis, fixed, left + 0.022, right - 0.022, y, PANEL_H, PANEL_D,
          PANELS[(i + k) % PANELS.length], 0.035,
        )], wallRng);
      }
      if (k === 5) {
        wallB.add([wallBlock(axis, fixed, a, b, SHELL_H, 0.055, PANEL_D + 0.07, FRAME, 0.01)], wallRng);
      }
    }
  }

  function wallWithDoor(axis, fixed, doorU, doorHalf) {
    const min = axis === 'x' ? -ROOM2_HX : -ROOM2_HZ;
    const max = axis === 'x' ? ROOM2_HX : ROOM2_HZ;
    const gaps = [[doorU - doorHalf, doorU + doorHalf]];
    let cursor = min;
    const segs = [];
    for (const [gs, ge] of gaps) {
      if (gs > cursor) segs.push([cursor, gs]);
      cursor = Math.max(cursor, ge);
    }
    if (cursor < max) segs.push([cursor, max]);
    for (const [a, b] of segs) panelRun(axis, fixed, a, b, () => true);
    // Lintel fill above door
    panelRun(axis, fixed, doorU - doorHalf, doorU + doorHalf, y => y - PANEL_H / 2 >= 2.03);
    // Jambs + header (room-1 door framing)
    const jamb = 0.14;
    const hw = doorHalf;
    const placeY = 0;
    if (axis === 'x') {
      wallB.add([
        [jamb, 2.13, PANEL_D + 0.1, doorU - hw + jamb / 2, 1.065, fixed, POST, 0, 0, 0, 0.03],
        [jamb, 2.13, PANEL_D + 0.1, doorU + hw - jamb / 2, 1.065, fixed, POST, 0, 0, 0, 0.03],
        [doorHalf * 2 + 0.1, 0.14, PANEL_D + 0.12, doorU, 2.05, fixed, POST, 0, 0, 0, 0.03],
        [doorHalf * 2 - 0.1, 0.05, PANEL_D, doorU, placeY, fixed, POST, 0, 0, 0, 0.02],
      ], wallRng);
    } else {
      wallB.add([
        [PANEL_D + 0.1, 2.13, jamb, fixed, 1.065, doorU - hw + jamb / 2, POST, 0, 0, 0, 0.03],
        [PANEL_D + 0.1, 2.13, jamb, fixed, 1.065, doorU + hw - jamb / 2, POST, 0, 0, 0, 0.03],
        [PANEL_D + 0.12, 0.14, doorHalf * 2 + 0.1, fixed, 2.05, doorU, POST, 0, 0, 0, 0.03],
        [PANEL_D, 0.05, doorHalf * 2 - 0.1, fixed, placeY, doorU, POST, 0, 0, 0, 0.02],
      ], wallRng);
    }
  }

  const doorHalf = DOOR_GAP / 2;
  wallWithDoor('x', ROOM2_SOUTH, BAY_DOOR_X, doorHalf);
  wallWithDoor('x', ROOM2_NORTH, BAY_DOOR_X, doorHalf);
  wallWithDoor('z', -ROOM2_HX, ROOM2_CZ, doorHalf);
  wallWithDoor('z', ROOM2_HX, ROOM2_CZ, doorHalf);

  // Chunky corner blocks + cyan caps
  for (const [sx, sz] of [[-1, -1], [1, -1], [-1, 1], [1, 1]]) {
    const x = sx * (ROOM2_HX - 0.45);
    const z = ROOM2_CZ + sz * (ROOM2_HZ - 0.45);
    wallB.add([
      [1.35, SHELL_H + 0.12, 1.35, x, (SHELL_H + 0.12) / 2, z, 0x2a3d4c, 0, 0, 0, 0.05],
      [1.05, 0.08, 1.05, x, SHELL_H + 0.02, z, FRAME, 0, 0, 0, 0.02],
    ], wallRng);
  }
  bake(wallB, true);

  // Cyan light strips along wall tops (between door gaps)
  function cyanCapX(z, a, b) {
    const len = b - a;
    if (len < 0.4) return;
    box(group, cyanLight, (a + b) / 2, SHELL_H - 0.04, z, len * 0.96, 0.05, 0.08);
  }
  cyanCapX(ROOM2_SOUTH, -ROOM2_HX, BAY_DOOR_X - doorHalf);
  cyanCapX(ROOM2_SOUTH, BAY_DOOR_X + doorHalf, ROOM2_HX);
  cyanCapX(ROOM2_NORTH, -ROOM2_HX, BAY_DOOR_X - doorHalf);
  cyanCapX(ROOM2_NORTH, BAY_DOOR_X + doorHalf, ROOM2_HX);
  for (const x of [-ROOM2_HX, ROOM2_HX]) {
    const z0 = ROOM2_NORTH + 0.3;
    const z1 = ROOM2_CZ - doorHalf - 0.05;
    const z2 = ROOM2_CZ + doorHalf + 0.05;
    const z3 = ROOM2_SOUTH - 0.3;
    if (z1 > z0) box(group, cyanLight, x, SHELL_H - 0.04, (z0 + z1) / 2, 0.08, 0.05, (z1 - z0) * 0.96);
    if (z3 > z2) box(group, cyanLight, x, SHELL_H - 0.04, (z2 + z3) / 2, 0.08, 0.05, (z3 - z2) * 0.96);
  }

  // ── Powerful blast doors (tall frames, thick slabs, cyan pylons) ──
  const DOOR_H = 2.45;
  const DOOR_W = DOOR_GAP + 0.35;
  const pulseHalos = [];
  const pulseStrips = [];

  function addDoorFrame(root, kind) {
    const w = DOOR_W;
    const h = DOOR_H;
    const doorB = new BlockBatch();
    const drng = seeded(Math.round(root.position.x * 11 + root.position.z * 17) + 9);
    // Chunky outer frame + header
    doorB.add([
      [0.42, h + 0.25, 0.55, -w / 2 - 0.15, (h + 0.25) / 2, 0.05, 0x1a2a36, 0, 0, 0, 0.05],
      [0.42, h + 0.25, 0.55, w / 2 + 0.15, (h + 0.25) / 2, 0.05, 0x1a2a36, 0, 0, 0, 0.05],
      [w + 0.85, 0.38, 0.6, 0, h + 0.12, 0.05, 0x243440, 0, 0, 0, 0.05],
      [w + 0.55, 0.12, 0.42, 0, 0.05, 0.08, POST, 0, 0, 0, 0.02],
    ], drng);
    // Armoured double slabs
    for (const side of [-1, 1]) {
      const cx = side * (w / 4);
      doorB.add([
        [w / 2 - 0.06, h - 0.08, 0.28, cx, h / 2 - 0.02, 0, POST, 0, 0, 0, 0.055],
        [w / 2 - 0.2, h - 0.32, 0.12, cx, h / 2, 0.14, FRAME, 0, 0, 0, 0.035],
        [w / 2 - 0.28, 0.22, 0.1, cx, h * 0.62, 0.2, 0x2a3d4c, 0, 0, 0, 0.02],
        [w * 0.26, 0.09, 0.07, cx, h * 0.52, 0.22, 0x4a6070, 0, 0, side * 0.72, 0.012],
        [w * 0.26, 0.09, 0.07, cx, h * 0.52, 0.22, 0x4a6070, 0, 0, -side * 0.72, 0.012],
      ], drng);
    }
    if (kind === 'ns') {
      for (let i = 0; i < 11; i++) {
        const hx = (i - 5) * 0.22;
        doorB.add([
          [0.18, 0.09, 0.1, hx, 0.14, 0.18, i % 2 ? 0xffa648 : POST, 0, 0, 0, 0.01],
          [0.18, 0.09, 0.1, hx, h - 0.14, 0.18, i % 2 ? 0xffa648 : POST, 0, 0, 0, 0.01],
        ], drng);
      }
    } else {
      for (const side of [-1, 1]) {
        for (let i = 0; i < 7; i++) {
          doorB.add([[
            0.12, 0.26, 0.08, side * (w / 2 - 0.12), 0.32 + i * 0.28, 0.18,
            i % 2 ? 0xffa648 : POST, 0, 0, 0, 0.01,
          ]], drng);
        }
      }
    }
    const mesh = new THREE.Mesh(doorB.build(), worldMat);
    mesh.castShadow = true;
    mesh.receiveShadow = true;
    root.add(mesh);
    // Glowing cyan side pylons + header bar
    const pylonL = box(root, cyanLight, -w / 2 - 0.15, h / 2, 0.32, 0.14, h * 0.92, 0.14);
    const pylonR = box(root, cyanLight, w / 2 + 0.15, h / 2, 0.32, 0.14, h * 0.92, 0.14);
    const header = box(root, cyanLight, 0, h + 0.02, 0.28, w * 0.78, 0.1, 0.12);
    pulseStrips.push(pylonL, pylonR, header);
    const hl = halo(root, CYAN, 0, h * 0.55, 0.4, 3.6, 0.28);
    pulseHalos.push(hl);
    halo(root, CYAN, -w / 2 - 0.15, h / 2, 0.35, 2.2, 0.22);
    halo(root, CYAN, w / 2 + 0.15, h / 2, 0.35, 2.2, 0.22);
    return root;
  }

  function makeStaticDoor(x, z, rotY, kind) {
    const root = new THREE.Group();
    root.position.set(x, 0, z);
    root.rotation.y = rotY;
    group.add(root);
    return addDoorFrame(root, kind);
  }

  makeStaticDoor(BAY_DOOR_X, ROOM2_NORTH + 0.05, Math.PI, 'ns');
  makeStaticDoor(-(ROOM2_HX - 0.05), ROOM2_CZ, Math.PI / 2, 'ew');
  makeStaticDoor(ROOM2_HX - 0.05, ROOM2_CZ, -Math.PI / 2, 'ew');

  // South slam door — thick armoured leaf + frame; animates shut with weight
  const southDoorRoot = new THREE.Group();
  southDoorRoot.position.set(BAY_DOOR_X, 0, ROOM2_SOUTH);
  group.add(southDoorRoot);
  // Static frame / pylons (leaf swings separately)
  {
    const frameB = new BlockBatch();
    const frng = seeded(88);
    const w = DOOR_W;
    const h = DOOR_H;
    frameB.add([
      [0.42, h + 0.25, 0.55, -w / 2 - 0.15, (h + 0.25) / 2, 0.05, 0x1a2a36, 0, 0, 0, 0.05],
      [0.42, h + 0.25, 0.55, w / 2 + 0.15, (h + 0.25) / 2, 0.05, 0x1a2a36, 0, 0, 0, 0.05],
      [w + 0.85, 0.38, 0.6, 0, h + 0.12, 0.05, 0x243440, 0, 0, 0, 0.05],
      [w + 0.55, 0.12, 0.42, 0, 0.05, 0.08, POST, 0, 0, 0, 0.02],
    ], frng);
    const frameMesh = new THREE.Mesh(frameB.build(), worldMat);
    frameMesh.castShadow = true;
    southDoorRoot.add(frameMesh);
    const pylonL = box(southDoorRoot, cyanLight, -w / 2 - 0.15, h / 2, 0.32, 0.14, h * 0.92, 0.14);
    const pylonR = box(southDoorRoot, cyanLight, w / 2 + 0.15, h / 2, 0.32, 0.14, h * 0.92, 0.14);
    const header = box(southDoorRoot, cyanLight, 0, h + 0.02, 0.28, w * 0.78, 0.1, 0.12);
    pulseStrips.push(pylonL, pylonR, header);
    pulseHalos.push(halo(southDoorRoot, CYAN, 0, h * 0.55, 0.4, 3.8, 0.3));
  }
  const jamb = 0.18;
  const leafW = DOOR_GAP - 2 * jamb + 0.15;
  const leafH = DOOR_H - 0.12;
  const hinge = new THREE.Group();
  hinge.position.set(-DOOR_GAP / 2 + jamb + 0.02, 0.02, 0);
  southDoorRoot.add(hinge);
  const leafB = new BlockBatch();
  const leafRng = seeded(77);
  leafB.add([
    [leafW, leafH, 0.3, leafW / 2, leafH / 2, 0, POST, 0, 0, 0, 0.055],
    [leafW - 0.2, leafH - 0.28, 0.12, leafW / 2, leafH / 2, 0.14, FRAME, 0, 0, 0, 0.035],
    [leafW - 0.32, 0.24, 0.1, leafW / 2, leafH * 0.62, 0.2, 0x2a3d4c, 0, 0, 0, 0.02],
    [leafW * 0.32, 0.09, 0.07, leafW / 2, leafH * 0.52, 0.22, 0x4a6070, 0, 0, 0.7, 0.012],
    [leafW * 0.32, 0.09, 0.07, leafW / 2, leafH * 0.52, 0.22, 0x4a6070, 0, 0, -0.7, 0.012],
  ], leafRng);
  for (let i = 0; i < 9; i++) {
    leafB.add([[
      0.17, 0.08, 0.09, leafW / 2 + (i - 4) * 0.2, 0.14, 0.18,
      i % 2 ? 0xffa648 : POST, 0, 0, 0, 0.01,
    ]], leafRng);
  }
  const leafMesh = new THREE.Mesh(leafB.build(), worldMat);
  leafMesh.castShadow = true;
  hinge.add(leafMesh);
  const OPEN_Y = -Math.PI * 0.92;
  const SHUT_Y = 0;
  hinge.rotation.y = OPEN_Y;
  let slamming = false;
  let slamAnimT = 0;
  const SLAM_DUR = 0.42;
  const southDoor = {
    hinge,
    open() { slamming = false; slamAnimT = 0; hinge.rotation.y = OPEN_Y; },
    shut() { slamming = true; slamAnimT = 0; },
    /** True once the animated slam has hit the frame. */
    get slammed() { return !slamming && slamAnimT >= SLAM_DUR; },
    x: BAY_DOOR_X,
    z: ROOM2_SOUTH,
  };

  // ── Cross channels: recessed grated trenches + cyan ticks ──
  const chB = new BlockBatch();
  const chRng = seeded(55);
  const trenchY = -0.08;
  // Trench beds
  chB.add([
    [CHANNEL_HALF * 2, 0.06, ROOM2_HZ * 1.85, 0, trenchY, ROOM2_CZ, 0x1a2834, 0, 0, 0, 0.015],
    [ROOM2_HX * 1.85, 0.06, CHANNEL_HALF * 2, 0, trenchY, ROOM2_CZ, 0x1a2834, 0, 0, 0, 0.015],
  ], chRng);
  // Grate bars N-S
  for (let z = ROOM2_NORTH + 1.2; z < ROOM2_SOUTH - 1.2; z += 0.38) {
    if (Math.hypot(0, z - ROOM2_CZ) < OCT_R - 0.2) continue;
    chB.add([[CHANNEL_HALF * 1.85, 0.04, 0.07, 0, trenchY + 0.04, z, 0x3a5060, 0, 0, 0, 0.01]], chRng);
  }
  // Grate bars E-W
  for (let x = -ROOM2_HX + 1.2; x < ROOM2_HX - 1.2; x += 0.38) {
    if (Math.hypot(x, 0) < OCT_R - 0.2) continue;
    chB.add([[0.07, 0.04, CHANNEL_HALF * 1.85, x, trenchY + 0.04, ROOM2_CZ, 0x3a5060, 0, 0, 0, 0.01]], chRng);
  }
  bake(chB, false);
  // Cyan light ticks along channels (brighter + denser)
  const channelTicks = [];
  for (let z = ROOM2_NORTH + 2.2; z < ROOM2_SOUTH - 2.2; z += 0.95) {
    if (Math.abs(z - ROOM2_CZ) < OCT_R) continue;
    channelTicks.push(box(group, cyanLight, 0.42, 0.012, z, 0.1, 0.028, 0.22));
    channelTicks.push(box(group, cyanLight, -0.42, 0.012, z, 0.1, 0.028, 0.22));
  }
  for (let x = -ROOM2_HX + 2.2; x < ROOM2_HX - 2.2; x += 0.95) {
    if (Math.abs(x) < OCT_R) continue;
    channelTicks.push(box(group, cyanLight, x, 0.012, ROOM2_CZ + 0.42, 0.22, 0.028, 0.1));
    channelTicks.push(box(group, cyanLight, x, 0.012, ROOM2_CZ - 0.42, 0.22, 0.028, 0.1));
  }
  pulseStrips.push(...channelTicks);

  // ── Four pillars (chamfered, cyan base/top bands) ──
  const pillarRx = ROOM2_HX * 0.52;
  const pillarRz = ROOM2_HZ * 0.52;
  const pillB = new BlockBatch();
  const pillRng = seeded(91);
  for (const [sx, sz] of [[-1, -1], [1, -1], [-1, 1], [1, 1]]) {
    const x = sx * pillarRx;
    const z = ROOM2_CZ + sz * pillarRz;
    pillB.add([
      [1.9, 2.85, 1.9, x, 1.42, z, 0x1a2a36, 0, 0, 0, 0.06],
      [2.15, 0.22, 2.15, x, 0.12, z, 0x243440, 0, 0, 0, 0.04],
      [2.1, 0.28, 2.1, x, 2.95, z, 0x2c4050, 0, 0, 0, 0.05],
      [1.7, 0.14, 1.7, x, 3.12, z, FRAME, 0, 0, 0, 0.02],
    ], pillRng);
    addSolid(x, z, 1.05, 1.05);
  }
  bake(pillB, true);
  for (const [sx, sz] of [[-1, -1], [1, -1], [-1, 1], [1, 1]]) {
    const x = sx * pillarRx;
    const z = ROOM2_CZ + sz * pillarRz;
    const baseBand = box(group, cyanLight, x, 0.38, z, 1.55, 0.09, 1.55);
    const topBand = box(group, cyanLight, x, 3.18, z, 1.35, 0.08, 1.35);
    pulseStrips.push(baseBand, topBand);
    for (const face of [[0, 0.98], [0, -0.98], [0.98, 0], [-0.98, 0]]) {
      box(group, cyanLight, x + face[0], 2.55, z + face[1], face[0] ? 0.07 : 1.35, 0.08, face[0] ? 1.35 : 0.07);
      box(group, cyanLight, x + face[0], 0.55, z + face[1], face[0] ? 0.07 : 1.35, 0.08, face[0] ? 1.35 : 0.07);
    }
    pulseHalos.push(halo(group, CYAN, x, 1.6, z, 4.2, 0.26));
    pulseHalos.push(halo(group, CYAN, x, 3.2, z, 2.8, 0.22));
  }

  // ── Raised octagon dais (multi-tier, hazard edge, vent grates) ──
  const platform = new THREE.Group();
  platform.position.set(0, 0, ROOM2_CZ);
  group.add(platform);

  const metalA = new THREE.MeshStandardMaterial({ color: 0x31485c, metalness: 0.62, roughness: 0.34 });
  const metalB = new THREE.MeshStandardMaterial({ color: 0x243848, metalness: 0.58, roughness: 0.38 });
  const metalTop = new THREE.MeshStandardMaterial({ color: 0x3a5568, metalness: 0.55, roughness: 0.32 });

  // Lower tier
  const tier1 = new THREE.Mesh(new THREE.CylinderGeometry(4.55, 4.75, 0.42, 8), metalA);
  tier1.position.y = 0.22;
  tier1.castShadow = true;
  tier1.receiveShadow = true;
  platform.add(tier1);
  // Upper tier
  const tier2 = new THREE.Mesh(new THREE.CylinderGeometry(3.95, 4.15, 0.32, 8), metalB);
  tier2.position.y = 0.55;
  tier2.castShadow = true;
  tier2.receiveShadow = true;
  platform.add(tier2);
  // Top deck plate
  const deckPlate = new THREE.Mesh(new THREE.CylinderGeometry(3.7, 3.7, 0.1, 8), metalTop);
  deckPlate.position.y = 0.72;
  deckPlate.receiveShadow = true;
  platform.add(deckPlate);

  // Hazard edging on lower rim + cyan accents
  for (let i = 0; i < 8; i++) {
    const a = (i / 8) * Math.PI * 2 + Math.PI / 8;
    const c = Math.cos(a);
    const s = Math.sin(a);
    box(platform, i % 2 ? amberLight : carbon, c * 4.45, 0.42, s * 4.45, 1.05, 0.07, 0.14)
      .rotation.y = a;
    const rim = box(platform, i % 2 ? cyanLight : amberLight, c * 3.85, 0.74, s * 3.85, 0.38, 0.06, 0.14);
    rim.rotation.y = a;
    pulseStrips.push(rim);
    // Vent grate panels on vertical faces
    const grate = box(platform, carbon, c * 4.35, 0.22, s * 4.35, 1.15, 0.32, 0.06);
    grate.rotation.y = a;
    for (let g = -2; g <= 2; g++) {
      box(platform, alloy, c * 4.38, 0.22, s * 4.38, 0.04, 0.28, 0.04)
        .position.set(c * 4.38 + Math.cos(a + Math.PI / 2) * g * 0.18, 0.22, s * 4.38 + Math.sin(a + Math.PI / 2) * g * 0.18);
    }
  }
  pulseHalos.push(halo(platform, CYAN, 0, 0.9, 0, 7.5, 0.22));
  pulseHalos.push(halo(platform, 0xffa648, 0, 0.45, 0, 6.2, 0.14));
  addSolid(0, ROOM2_CZ, 4.15, 4.15);

  // ── Tesla coil (stacked rings, column, polished sphere) ──
  const coil = new THREE.Group();
  coil.position.set(0, 0.78, ROOM2_CZ);
  group.add(coil);

  // Base housing
  const baseB = new BlockBatch();
  const baseRng = seeded(33);
  baseB.add([
    [1.55, 0.35, 1.55, 0, 0.18, 0, 0x1a2834, 0, 0, 0, 0.05],
    [1.25, 0.22, 1.25, 0, 0.42, 0, 0x243440, 0, 0, 0, 0.04],
    [0.95, 0.16, 0.95, 0, 0.58, 0, FRAME, 0, 0, 0, 0.025],
  ], baseRng);
  const baseMesh = new THREE.Mesh(baseB.build(), worldMat);
  baseMesh.castShadow = true;
  coil.add(baseMesh);
  box(coil, cyanLight, 0, 0.52, 0, 1.05, 0.06, 1.05);

  // Ribbed column with alternating metal + cyan glow rings
  const ringGlowMats = [];
  for (let i = 0; i < 14; i++) {
    const y = 0.78 + i * 0.22;
    const r = 0.42 + (i % 2) * 0.07;
    if (i % 2 === 0) {
      const mat = new THREE.MeshStandardMaterial({
        color: CYAN, emissive: CYAN, emissiveIntensity: 0.85,
        metalness: 0.2, roughness: 0.3, toneMapped: false,
      });
      ringGlowMats.push(mat);
      const ring = model(coil, new THREE.TorusGeometry(r, 0.055, 8, 24), mat, 0, y, 0);
      ring.rotation.x = Math.PI / 2;
    } else {
      const ring = model(coil, new THREE.TorusGeometry(r, 0.07, 8, 24), alloy, 0, y, 0);
      ring.rotation.x = Math.PI / 2;
      ring.castShadow = true;
    }
  }
  const mast = model(coil, new THREE.CylinderGeometry(0.2, 0.32, 3.55, 16), alloy, 0, 2.35, 0);
  mast.castShadow = true;
  // Collar under sphere
  model(coil, new THREE.CylinderGeometry(0.38, 0.28, 0.18, 16), carbon, 0, 4.05, 0);

  const ballMat = new THREE.MeshStandardMaterial({
    color: 0xd4e0e8, emissive: CYAN, emissiveIntensity: 0.28,
    metalness: 0.85, roughness: 0.12,
  });
  const ball = model(coil, new THREE.SphereGeometry(0.82, 28, 22), ballMat, 0, 4.55, 0);
  ball.castShadow = true;
  const tipHalo = halo(coil, CYAN, 0, 4.55, 0, 6.4, 0.42);
  const tipHalo2 = halo(coil, CYAN, 0, 4.55, 0, 3.2, 0.5);
  // Arc stubs (subtle animated later)
  const arcMats = [];
  for (let i = 0; i < 5; i++) {
    const a = (i / 5) * Math.PI * 2;
    const mat = new THREE.MeshBasicMaterial({
      color: CYAN, transparent: true, opacity: 0.4, toneMapped: false, fog: false, depthWrite: false,
    });
    arcMats.push(mat);
    const stub = model(coil, new THREE.CylinderGeometry(0.028, 0.01, 0.7, 6), mat,
      Math.cos(a) * 0.6, 5.05, Math.sin(a) * 0.6);
    stub.rotation.z = Math.cos(a) * 0.45;
    stub.rotation.x = Math.sin(a) * 0.45;
  }

  // ── Cheap coloured light pools (no shadow casting) ──
  const poolLights = [];
  function poolLight(color, x, y, z, intensity, distance) {
    const pl = new THREE.PointLight(color, intensity, distance, 2);
    pl.castShadow = false;
    pl.position.set(x, y, z);
    group.add(pl);
    poolLights.push({ light: pl, base: intensity });
    return pl;
  }
  poolLight(CYAN, 0, 3.8, ROOM2_CZ, 55, 22);
  poolLight(0xffa648, 0, 1.4, ROOM2_CZ, 22, 12);
  poolLight(CYAN, BAY_DOOR_X, 2.2, ROOM2_SOUTH - 3.5, 28, 14);
  poolLight(CYAN, BAY_DOOR_X, 2.2, ROOM2_NORTH + 3.5, 24, 14);
  poolLight(CYAN, pillarRx * 0.7, 2.0, ROOM2_CZ - pillarRz * 0.7, 18, 11);
  poolLight(CYAN, -pillarRx * 0.7, 2.0, ROOM2_CZ + pillarRz * 0.7, 18, 11);

  // Soft additive floor glow discs under coil + doors
  const floorGlow = (x, z, size, opacity, color = CYAN) => {
    const s = halo(group, color, x, 0.08, z, size, opacity);
    s.material.rotation = 0;
    pulseHalos.push(s);
  };
  floorGlow(0, ROOM2_CZ, 9.5, 0.2);
  floorGlow(BAY_DOOR_X, ROOM2_SOUTH - 1.5, 4.5, 0.18);
  floorGlow(BAY_DOOR_X, ROOM2_NORTH + 1.5, 4.5, 0.16);

  // Wall-top glow along cyan caps
  for (const z of [ROOM2_SOUTH, ROOM2_NORTH]) {
    pulseHalos.push(halo(group, CYAN, BAY_DOOR_X - 8, SHELL_H, z, 3.5, 0.16));
    pulseHalos.push(halo(group, CYAN, BAY_DOOR_X + 8, SHELL_H, z, 3.5, 0.16));
  }

  coil.userData = {
    ballMat,
    ringGlowMats,
    tipHalo,
    tipHalo2,
    arcMats,
    t: 0,
  };

  return {
    group,
    southDoor,
    solids,
    coil,
    update(dt) {
      // Weighty slam: ease-in so the leaf accelerates into the frame
      if (slamming) {
        slamAnimT += dt;
        const k = Math.min(1, slamAnimT / SLAM_DUR);
        const e = k * k * k;
        hinge.rotation.y = OPEN_Y + (SHUT_Y - OPEN_Y) * e;
        if (k >= 1) slamming = false;
      }

      const ud = coil.userData;
      ud.t += dt;
      const t = ud.t;
      const flicker = 0.95 + Math.sin(t * 7.3) * 0.18 + Math.sin(t * 19.1) * 0.1;
      for (const m of ud.ringGlowMats) m.emissiveIntensity = flicker;
      ud.ballMat.emissiveIntensity = 0.35 + Math.sin(t * 5.1) * 0.14;
      if (ud.tipHalo?.material) {
        ud.tipHalo.material.opacity = 0.36 + Math.sin(t * 4.2) * 0.12;
        ud.tipHalo.scale.setScalar(6.4 * (0.92 + 0.08 * Math.sin(t * 3.3)));
      }
      if (ud.tipHalo2?.material) {
        ud.tipHalo2.material.opacity = 0.42 + Math.sin(t * 6.1) * 0.15;
      }
      for (let i = 0; i < ud.arcMats.length; i++) {
        ud.arcMats[i].opacity = 0.18 + (Math.sin(t * 13 + i * 1.7) * 0.5 + 0.5) * 0.5;
      }

      // Gentle pulse across bay emissives / halos / light pools
      const pulse = 0.85 + Math.sin(t * 2.4) * 0.15;
      for (const h of pulseHalos) {
        if (h?.material) h.material.opacity = (h.userData.baseOp ?? (h.userData.baseOp = h.material.opacity)) * pulse;
      }
      for (let i = 0; i < poolLights.length; i++) {
        const { light, base } = poolLights[i];
        light.intensity = base * (0.88 + Math.sin(t * 2.1 + i) * 0.12);
      }
    },
  };
}
