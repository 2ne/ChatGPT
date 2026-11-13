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
  BAY_CX,
  BAY_DOOR_GAP,
  BAY_DOOR_HALF,
  BAY_DOOR_X,
  ROOM2_CZ,
  ROOM2_EAST,
  ROOM2_HX,
  ROOM2_HZ,
  ROOM2_NORTH,
  ROOM2_SOUTH,
  ROOM2_WEST,
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
/** Room-2 clear opening — three floor tiles (not room-1’s single-tile gap). */
const DOOR_GAP = BAY_DOOR_GAP;
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
  const xMin = Math.ceil((ROOM2_WEST + 0.9) / DECK_STEP);
  const xMax = Math.floor((ROOM2_EAST - 0.9) / DECK_STEP);
  const zMin = Math.ceil((ROOM2_NORTH + 0.9) / DECK_STEP);
  const zMax = Math.floor((ROOM2_SOUTH - 0.9) / DECK_STEP);
  for (let iz = zMin; iz <= zMax; iz++) {
    for (let ix = xMin; ix <= xMax; ix++) {
      const x = ix * DECK_STEP;
      const z = iz * DECK_STEP;
      // Leave trenches + dais footprint clear for recessed channels / platform.
      if (Math.abs(x - BAY_CX) < CHANNEL_HALF + 0.35) continue;
      if (Math.abs(z - ROOM2_CZ) < CHANNEL_HALF + 0.35) continue;
      if (Math.hypot(x - BAY_CX, z - ROOM2_CZ) < OCT_R + 0.35) continue;
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
      [0.11, 0.013, 0.28, BAY_CX + CHANNEL_HALF + 0.2, 0.006, z, 0x6f8a9e, 0, 0, 0, 0],
      [0.11, 0.013, 0.28, BAY_CX - (CHANNEL_HALF + 0.2), 0.006, z, 0x6f8a9e, 0, 0, 0, 0],
    ], floorRng);
  }
  for (let x = ROOM2_WEST + 2; x < ROOM2_EAST - 2; x += 0.55) {
    if (Math.abs(x - BAY_CX) < OCT_R) continue;
    floorB.add([
      [0.28, 0.013, 0.11, x, 0.006, ROOM2_CZ + CHANNEL_HALF + 0.2, 0x6f8a9e, 0, 0, 0, 0],
      [0.28, 0.013, 0.11, x, 0.006, ROOM2_CZ - CHANNEL_HALF - 0.2, 0x6f8a9e, 0, 0, 0, 0],
    ], floorRng);
  }
  bake(floorB, false);

  // Bright cyan corner ticks near doors (match room-1 floor light lines)
  const doorTick = BAY_DOOR_HALF + 0.55;
  for (const [dx, dz] of [
    [BAY_DOOR_X - doorTick, ROOM2_SOUTH - 1.2], [BAY_DOOR_X + doorTick, ROOM2_SOUTH - 1.2],
    [BAY_DOOR_X - doorTick, ROOM2_NORTH + 1.2], [BAY_DOOR_X + doorTick, ROOM2_NORTH + 1.2],
    [ROOM2_WEST + 1.2, ROOM2_CZ - doorTick], [ROOM2_WEST + 1.2, ROOM2_CZ + doorTick],
    [ROOM2_EAST - 1.2, ROOM2_CZ - doorTick], [ROOM2_EAST - 1.2, ROOM2_CZ + doorTick],
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
    // N/S walls span west→east; E/W walls span north→south (world Z).
    const min = axis === 'x' ? ROOM2_WEST : ROOM2_NORTH;
    const max = axis === 'x' ? ROOM2_EAST : ROOM2_SOUTH;
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
  wallWithDoor('z', ROOM2_WEST, ROOM2_CZ, doorHalf);
  wallWithDoor('z', ROOM2_EAST, ROOM2_CZ, doorHalf);

  // Chunky corner blocks + cyan caps (mirrored about BAY_CX / ROOM2_CZ)
  for (const [sx, sz] of [[-1, -1], [1, -1], [-1, 1], [1, 1]]) {
    const x = BAY_CX + sx * (ROOM2_HX - 0.45);
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
  cyanCapX(ROOM2_SOUTH, ROOM2_WEST, BAY_DOOR_X - doorHalf);
  cyanCapX(ROOM2_SOUTH, BAY_DOOR_X + doorHalf, ROOM2_EAST);
  cyanCapX(ROOM2_NORTH, ROOM2_WEST, BAY_DOOR_X - doorHalf);
  cyanCapX(ROOM2_NORTH, BAY_DOOR_X + doorHalf, ROOM2_EAST);
  for (const x of [ROOM2_WEST, ROOM2_EAST]) {
    const z0 = ROOM2_NORTH + 0.3;
    const z1 = ROOM2_CZ - doorHalf - 0.05;
    const z2 = ROOM2_CZ + doorHalf + 0.05;
    const z3 = ROOM2_SOUTH - 0.3;
    if (z1 > z0) box(group, cyanLight, x, SHELL_H - 0.04, (z0 + z1) / 2, 0.08, 0.05, (z1 - z0) * 0.96);
    if (z3 > z2) box(group, cyanLight, x, SHELL_H - 0.04, (z2 + z3) / 2, 0.08, 0.05, (z3 - z2) * 0.96);
  }

  // ── Massive blast doors — three-tile clear, Star Trek split panels ──
  // Frame is wider than the clear gap so doors read huge from above;
  // collision / wall gaps use DOOR_GAP (= BAY_DOOR_GAP = 3 tiles).
  const DOOR_H = 3.55; // well above SHELL_H (2.4)
  const DOOR_W_NS = DOOR_GAP + 2.8;
  const DOOR_W_EW = DOOR_GAP + 2.4;
  const pulseHalos = [];
  const pulseStrips = [];
  const slideDoors = []; // tick open/shut each frame

  function easeOutBack(t) {
    const c1 = 1.70158, c3 = c1 + 1;
    return 1 + c3 * (t - 1) ** 3 + c1 * (t - 1) ** 2;
  }
  function easeInCubic(t) { return t * t * t; }

  /** Frame + buttresses + header light (no baked slabs — panels are separate). */
  function buildBlastFrame(root, kind) {
    const w = kind === 'ns' ? DOOR_W_NS : DOOR_W_EW;
    const h = DOOR_H;
    const doorB = new BlockBatch();
    const drng = seeded(Math.round(root.position.x * 11 + root.position.z * 17) + 41);
    const buttW = 1.05;
    const buttD = 1.25;
    const postX = w / 2 + buttW * 0.32;
    doorB.add([
      [buttW, h + 0.55, buttD, -postX, (h + 0.55) / 2, 0.35, 0x1a2a36, 0, 0, 0, 0.06],
      [buttW, h + 0.55, buttD, postX, (h + 0.55) / 2, 0.35, 0x1a2a36, 0, 0, 0, 0.06],
      [buttW * 0.7, h + 0.35, buttD * 0.55, -postX - 0.28, (h + 0.35) / 2, 0.55, 0x152430, 0, 0.18, 0, 0.05],
      [buttW * 0.7, h + 0.35, buttD * 0.55, postX + 0.28, (h + 0.35) / 2, 0.55, 0x152430, 0, -0.18, 0, 0.05],
      [w + buttW * 2.2, 0.72, 0.95, 0, h + 0.28, 0.25, 0x243440, 0, 0, 0, 0.06],
      [w + buttW * 1.6, 0.22, 0.7, 0, h + 0.58, 0.35, 0x2c4050, 0, 0, 0, 0.04],
      [w + 0.6, 0.14, 0.7, 0, 0.06, 0.45, POST, 0, 0, 0, 0.025],
    ], drng);
    const mesh = new THREE.Mesh(doorB.build(), worldMat);
    mesh.castShadow = true;
    mesh.receiveShadow = true;
    root.add(mesh);

    const pylonL = box(root, cyanLight, -postX, h / 2 + 0.1, 0.75, 0.22, h * 0.95, 0.22);
    const pylonR = box(root, cyanLight, postX, h / 2 + 0.1, 0.75, 0.22, h * 0.95, 0.22);
    const header = box(root, cyanLight, 0, h + 0.42, 0.55, w * 0.88, 0.16, 0.2);
    pulseStrips.push(pylonL, pylonR, header);
    box(root, amberLight, 0, 0.09, 0.72, w * 0.72, 0.04, 0.1);
    pulseHalos.push(halo(root, CYAN, 0, h * 0.6, 0.7, 5.2, 0.26));
    halo(root, CYAN, -postX, h / 2, 0.8, 2.8, 0.2);
    halo(root, CYAN, postX, h / 2, 0.8, 2.8, 0.2);
    return { w, h, postX, buttW, buttD };
  }

  /** One sliding half-panel (geometry local, centred on group origin). */
  function buildSlidePanel(side, leafW, leafH, rng) {
    const g = new THREE.Group();
    const leafB = new BlockBatch();
    leafB.add([
      [leafW, leafH, 0.4, 0, leafH / 2, 0, POST, 0, 0, 0, 0.06],
      [leafW - 0.16, leafH - 0.36, 0.16, 0, leafH / 2, 0.18, FRAME, 0, 0, 0, 0.04],
      [leafW * 0.55, 0.14, 0.1, 0, leafH * 0.5, 0.28, 0x4a6070, 0, 0, side * 0.7, 0.015],
      [leafW * 0.55, 0.14, 0.1, 0, leafH * 0.5, 0.28, 0x4a6070, 0, 0, -side * 0.7, 0.015],
      [0.2, leafH - 0.55, 0.12, side * (leafW * 0.28), leafH / 2, 0.3, 0x2a3d4c, 0, 0, 0, 0.02],
    ], rng);
    const stripeW = 0.24;
    const nStripe = Math.max(4, Math.floor(leafW / (stripeW + 0.03)));
    for (let i = 0; i < nStripe; i++) {
      const hx = -leafW / 2 + stripeW / 2 + 0.03 + i * (leafW - 0.06) / nStripe;
      leafB.add([
        [stripeW, 0.15, 0.12, hx, 0.22, 0.26, i % 2 ? 0xffa648 : POST, 0, 0, 0, 0.012],
        [stripeW, 0.15, 0.12, hx, leafH - 0.22, 0.26, i % 2 ? 0xffa648 : POST, 0, 0, 0, 0.012],
      ], rng);
    }
    const mesh = new THREE.Mesh(leafB.build(), worldMat);
    mesh.castShadow = true;
    g.add(mesh);
    return g;
  }

  /**
   * Star Trek split door: two panels slide sideways into the buttresses.
   * When fully open, panels are hidden (no poke-through / z-fight).
   */
  function makeSlideDoor(x, z, rotY, kind, { animated = false } = {}) {
    const root = new THREE.Group();
    root.position.set(x, 0, z);
    root.rotation.y = rotY;
    group.add(root);
    const dims = buildBlastFrame(root, kind);
    const jamb = 0.14;
    const clear = DOOR_GAP - 2 * jamb;
    const leafW = clear / 2 - 0.04;
    const leafH = dims.h - 0.22;
    const rng = seeded(Math.round(x * 13 + z * 19) + 90);
    const panelL = buildSlidePanel(-1, leafW, leafH, rng);
    const panelR = buildSlidePanel(1, leafW, leafH, rng);
    // Closed centres: meet at the middle of the clear opening
    const xShutL = -leafW / 2 - 0.02;
    const xShutR = leafW / 2 + 0.02;
    // Open: fully past the jamb into the buttress pocket, then hidden
    const travel = leafW + jamb + dims.buttW * 0.55;
    const xOpenL = xShutL - travel;
    const xOpenR = xShutR + travel;
    panelL.position.set(xShutL, 0.04, 0.04);
    panelR.position.set(xShutR, 0.04, 0.04);
    root.add(panelL, panelR);

    let phase = 'shut'; // shut | opening | open | slamming
    let animT = 0;
    const OPEN_DUR = 0.9;
    const SLAM_DUR = 0.48;

    function applyOpenAmount(u) {
      // u=0 shut, u=1 fully open
      const k = Math.max(0, Math.min(1, u));
      panelL.position.x = xShutL + (xOpenL - xShutL) * k;
      panelR.position.x = xShutR + (xOpenR - xShutR) * k;
      // Hide once recessed into the wall pocket — no poking / z-fight
      const show = k < 0.92;
      panelL.visible = show;
      panelR.visible = show;
    }

    const ctrl = {
      root,
      open() {
        if (!animated) return;
        if (phase === 'open' || phase === 'opening') return;
        phase = 'opening';
        animT = 0;
        panelL.visible = true;
        panelR.visible = true;
      },
      shut() {
        if (!animated) return;
        if (phase === 'shut' || phase === 'slamming') return;
        phase = 'slamming';
        animT = 0;
        panelL.visible = true;
        panelR.visible = true;
      },
      snapShut() {
        phase = 'shut';
        animT = 0;
        applyOpenAmount(0);
      },
      get slammed() { return phase === 'shut'; },
      get isOpen() { return phase === 'open'; },
      get raising() { return phase === 'opening'; }, // compat with walk wait
      get slamming() { return phase === 'slamming'; },
      x, z,
      update(dt) {
        if (!animated) return;
        if (phase === 'opening') {
          animT += dt;
          const k = Math.min(1, animT / OPEN_DUR);
          applyOpenAmount(Math.min(easeOutBack(k), 1.04));
          if (k >= 1) { applyOpenAmount(1); phase = 'open'; }
        } else if (phase === 'slamming') {
          animT += dt;
          const k = Math.min(1, animT / SLAM_DUR);
          // Ease-in meet + tiny settle overshoot
          let u;
          if (k < 0.82) u = 1 - easeInCubic(k / 0.82);
          else {
            const s = (k - 0.82) / 0.18;
            u = -0.04 * Math.sin(s * Math.PI) * (1 - s);
          }
          applyOpenAmount(Math.max(0, u));
          if (k >= 1) { applyOpenAmount(0); phase = 'shut'; }
        }
      },
    };
    if (animated) slideDoors.push(ctrl);
    return ctrl;
  }

  // N / E / W — split panels, permanently shut (same look as the entry door)
  makeSlideDoor(BAY_DOOR_X, ROOM2_NORTH + 0.08, Math.PI, 'ns');
  makeSlideDoor(ROOM2_WEST + 0.08, ROOM2_CZ, Math.PI / 2, 'ew');
  makeSlideDoor(ROOM2_EAST - 0.08, ROOM2_CZ, -Math.PI / 2, 'ew');
  // South — animated open on approach / slam after entry
  const southDoor = makeSlideDoor(BAY_DOOR_X, ROOM2_SOUTH, 0, 'ns', { animated: true });

  // ── Cross channels: recessed grated trenches + cyan ticks ──
  const chB = new BlockBatch();
  const chRng = seeded(55);
  const trenchY = -0.08;
  // Trench beds — equal arms about BAY_CX / ROOM2_CZ (walls are now symmetric).
  chB.add([
    [CHANNEL_HALF * 2, 0.06, ROOM2_HZ * 1.85, BAY_CX, trenchY, ROOM2_CZ, 0x1a2834, 0, 0, 0, 0.015],
  ], chRng);
  {
    const span = ROOM2_HX * 1.85;
    const gap = CHANNEL_HALF * 2 + 0.04;
    const arm = (span - gap) / 2;
    if (arm > 0.2) {
      chB.add([
        [arm, 0.06, CHANNEL_HALF * 2, BAY_CX - (gap + arm) / 2, trenchY, ROOM2_CZ, 0x1a2834, 0, 0, 0, 0.015],
        [arm, 0.06, CHANNEL_HALF * 2, BAY_CX + (gap + arm) / 2, trenchY, ROOM2_CZ, 0x1a2834, 0, 0, 0, 0.015],
      ], chRng);
    }
  }
  // Grate bars N-S
  for (let z = ROOM2_NORTH + 1.2; z < ROOM2_SOUTH - 1.2; z += 0.38) {
    if (Math.abs(z - ROOM2_CZ) < OCT_R - 0.2) continue;
    chB.add([[CHANNEL_HALF * 1.85, 0.04, 0.07, BAY_CX, trenchY + 0.04, z, 0x3a5060, 0, 0, 0, 0.01]], chRng);
  }
  // Grate bars E-W
  for (let x = ROOM2_WEST + 1.2; x < ROOM2_EAST - 1.2; x += 0.38) {
    if (Math.abs(x - BAY_CX) < OCT_R - 0.2) continue;
    chB.add([[0.07, 0.04, CHANNEL_HALF * 1.85, x, trenchY + 0.04, ROOM2_CZ, 0x3a5060, 0, 0, 0, 0.01]], chRng);
  }
  bake(chB, false);
  // Cyan light ticks along channels (brighter + denser)
  const channelTicks = [];
  for (let z = ROOM2_NORTH + 2.2; z < ROOM2_SOUTH - 2.2; z += 0.95) {
    if (Math.abs(z - ROOM2_CZ) < OCT_R) continue;
    channelTicks.push(box(group, cyanLight, BAY_CX + 0.42, 0.012, z, 0.1, 0.028, 0.22));
    channelTicks.push(box(group, cyanLight, BAY_CX - 0.42, 0.012, z, 0.1, 0.028, 0.22));
  }
  for (let x = ROOM2_WEST + 2.2; x < ROOM2_EAST - 2.2; x += 0.95) {
    if (Math.abs(x - BAY_CX) < OCT_R) continue;
    channelTicks.push(box(group, cyanLight, x, 0.012, ROOM2_CZ + 0.42, 0.22, 0.028, 0.1));
    channelTicks.push(box(group, cyanLight, x, 0.012, ROOM2_CZ - 0.42, 0.22, 0.028, 0.1));
  }
  pulseStrips.push(...channelTicks);

  // ── Four pillars (chamfered, cyan base/top bands) ──
  // Pillars symmetric about BAY_CX (not world 0) so the cross stays centred on the doors.
  const pillarRx = ROOM2_HX * 0.52;
  const pillarRz = ROOM2_HZ * 0.52;
  const pillB = new BlockBatch();
  const pillRng = seeded(91);
  for (const [sx, sz] of [[-1, -1], [1, -1], [-1, 1], [1, 1]]) {
    const x = BAY_CX + sx * pillarRx;
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
    const x = BAY_CX + sx * pillarRx;
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
  platform.position.set(BAY_CX, 0, ROOM2_CZ);
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

  // Continuous octagonal light rings from the same 8-gon as the dais cylinders
  // (RingGeometry radialSegments=8). Inset inside the top bevel so nothing pokes out.
  const DAIS_R1 = 4.55; // tier1 top radius (matches CylinderGeometry above)
  const DAIS_R2 = 3.95; // tier2 top radius
  function octRing(inner, outer, y, mat) {
    // RingGeometry(…, 8) and CylinderGeometry(…, 8) both place vertices at i·π/4,
    // so the octagon outlines coincide with no extra Z rotation.
    const ring = new THREE.Mesh(new THREE.RingGeometry(inner, outer, 8), mat);
    ring.rotation.x = -Math.PI / 2;
    ring.position.y = y;
    platform.add(ring);
    return ring;
  }
  const hazardRing = octRing(DAIS_R1 - 0.22, DAIS_R1 - 0.06, 0.44, amberLight);
  pulseStrips.push(hazardRing);
  octRing(DAIS_R1 - 0.28, DAIS_R1 - 0.22, 0.435, carbon);
  const upperRing = octRing(DAIS_R2 - 0.18, DAIS_R2 - 0.04, 0.73, cyanLight);
  pulseStrips.push(upperRing);

  // Cyan inset lights + vent grates on vertical faces (inset, tangent-aligned)
  const FACE_CHORD = 2 * DAIS_R1 * Math.tan(Math.PI / 8);
  for (let i = 0; i < 8; i++) {
    const a = (i / 8) * Math.PI * 2 + Math.PI / 8;
    const c = Math.cos(a);
    const s = Math.sin(a);
    const tangent = a + Math.PI / 2;
    const rInset = DAIS_R1 - 0.12;
    const cyanInset = box(platform, cyanLight, c * rInset, 0.28, s * rInset, 0.5, 0.14, 0.06);
    cyanInset.rotation.y = tangent;
    if (i % 2 === 0) pulseStrips.push(cyanInset);
    const grate = box(platform, carbon, c * (DAIS_R1 - 0.02), 0.22, s * (DAIS_R1 - 0.02), FACE_CHORD * 0.62, 0.3, 0.05);
    grate.rotation.y = tangent;
    for (let g = -2; g <= 2; g++) {
      const bar = box(platform, alloy, 0, 0.22, 0, 0.04, 0.26, 0.04);
      bar.position.set(
        c * DAIS_R1 + Math.cos(tangent) * g * 0.18,
        0.22,
        s * DAIS_R1 + Math.sin(tangent) * g * 0.18,
      );
    }
  }
  pulseHalos.push(halo(platform, CYAN, 0, 0.85, 0, 6.5, 0.14));
  addSolid(BAY_CX, ROOM2_CZ, 4.15, 4.15);

  // ── Tesla coil (stacked rings, column, polished sphere) ──
  const coil = new THREE.Group();
  coil.position.set(BAY_CX, 0.78, ROOM2_CZ);
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
  // Soft tip glow only — keep the sphere/rings readable (no blown-out blob).
  const tipHalo = halo(coil, CYAN, 0, 4.55, 0, 2.8, 0.22);
  const tipHalo2 = halo(coil, CYAN, 0, 4.55, 0, 1.6, 0.28);
  // Short arc stubs near the sphere
  const arcMats = [];
  for (let i = 0; i < 4; i++) {
    const a = (i / 4) * Math.PI * 2;
    const mat = new THREE.MeshBasicMaterial({
      color: CYAN, transparent: true, opacity: 0.32, toneMapped: false, fog: false, depthWrite: false,
    });
    arcMats.push(mat);
    const stub = model(coil, new THREE.CylinderGeometry(0.022, 0.008, 0.45, 6), mat,
      Math.cos(a) * 0.55, 4.95, Math.sin(a) * 0.55);
    stub.rotation.z = Math.cos(a) * 0.35;
    stub.rotation.x = Math.sin(a) * 0.35;
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
  poolLight(CYAN, BAY_CX, 3.8, ROOM2_CZ, 38, 18);
  poolLight(0xffa648, BAY_CX, 1.4, ROOM2_CZ, 16, 11);
  poolLight(CYAN, BAY_DOOR_X, 2.2, ROOM2_SOUTH - 3.5, 28, 14);
  poolLight(CYAN, BAY_DOOR_X, 2.2, ROOM2_NORTH + 3.5, 24, 14);
  poolLight(CYAN, BAY_CX + pillarRx * 0.7, 2.0, ROOM2_CZ - pillarRz * 0.7, 18, 11);
  poolLight(CYAN, BAY_CX - pillarRx * 0.7, 2.0, ROOM2_CZ + pillarRz * 0.7, 18, 11);

  // Soft additive floor glow discs under coil + doors
  const floorGlow = (x, z, size, opacity, color = CYAN) => {
    const s = halo(group, color, x, 0.08, z, size, opacity);
    s.material.rotation = 0;
    pulseHalos.push(s);
  };
  floorGlow(BAY_CX, ROOM2_CZ, 7.5, 0.14);
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
      for (let i = 0; i < slideDoors.length; i++) slideDoors[i].update(dt);

      const ud = coil.userData;
      ud.t += dt;
      const t = ud.t;
      const flicker = 0.8 + Math.sin(t * 6.2) * 0.12 + Math.sin(t * 15.1) * 0.06;
      for (const m of ud.ringGlowMats) m.emissiveIntensity = flicker;
      ud.ballMat.emissiveIntensity = 0.22 + Math.sin(t * 4.4) * 0.08;
      if (ud.tipHalo?.material) {
        ud.tipHalo.material.opacity = 0.18 + Math.sin(t * 3.6) * 0.06;
        ud.tipHalo.scale.setScalar(2.8 * (0.95 + 0.05 * Math.sin(t * 2.8)));
      }
      if (ud.tipHalo2?.material) {
        ud.tipHalo2.material.opacity = 0.22 + Math.sin(t * 5.2) * 0.08;
      }
      for (let i = 0; i < ud.arcMats.length; i++) {
        ud.arcMats[i].opacity = 0.12 + (Math.sin(t * 11 + i * 1.7) * 0.5 + 0.5) * 0.28;
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
