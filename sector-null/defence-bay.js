/**
 * Stage 4 Defence Bay interior (concept match).
 * Visuals + collision solids only — no waves / Tesla card logic.
 *
 * Built as merged/instanced-friendly meshes with emissive accents (no extra
 * shadow-casting lights). South wall lives in its own group so it can be
 * hidden when it would sit between the follow camera and the player.
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
const HAZARD = 0xffa648;
const SHELL_H = 2.45;
const SHELL_T = 0.7;
/** Door clear width (centred on each wall). */
const DOOR_GAP = Math.abs(ROOM1_NORTH_DOOR.u1 - ROOM1_NORTH_DOOR.u0);

function shellMat(color, extras = {}) {
  return new THREE.MeshStandardMaterial({
    color, metalness: 0.45, roughness: 0.38, ...extras,
  });
}

/**
 * @param {THREE.Object3D} parent
 * @param {{ box: Function, model: Function, halo: Function, alloy: THREE.Material, carbon: THREE.Material, cyanLight: THREE.Material, amberLight: THREE.Material }} helpers
 */
export function buildDefenceBay(parent, helpers) {
  const { box, model, halo, alloy, carbon, cyanLight, amberLight } = helpers;
  const group = new THREE.Group();
  group.name = 'defenceBay';
  parent.add(group);

  const solids = [];
  const addSolid = (x, z, hx, hz, rotation = 0) => {
    solids.push({ x, z, hx, hz, c: Math.cos(rotation), s: Math.sin(rotation) });
  };

  // --- Floor tiles ---
  const tileMat = shellMat(0x2c4254, { metalness: 0.48, roughness: 0.42 });
  const tileAlt = shellMat(0x355064, { metalness: 0.46, roughness: 0.44 });
  const inset = 1.0;
  const tileSpanX = ROOM2_HX * 2 - inset;
  const tileSpanZ = ROOM2_HZ * 2 - inset;
  const tileNx = 14;
  const tileNz = 13;
  const tileWx = tileSpanX / tileNx;
  const tileWz = tileSpanZ / tileNz;
  const floorBatch = new THREE.Group();
  floorBatch.name = 'bayFloor';
  group.add(floorBatch);
  for (let iz = 0; iz < tileNz; iz++) {
    for (let ix = 0; ix < tileNx; ix++) {
      const tile = new THREE.Mesh(
        new THREE.BoxGeometry(tileWx - 0.08, 0.07, tileWz - 0.08),
        (ix + iz) % 2 ? tileAlt : tileMat,
      );
      tile.position.set(
        -tileSpanX / 2 + tileWx * (ix + 0.5),
        -0.02,
        ROOM2_CZ - tileSpanZ / 2 + tileWz * (iz + 0.5),
      );
      tile.receiveShadow = true;
      tile.castShadow = false;
      floorBatch.add(tile);
    }
  }

  const wallMat = shellMat(0x3d586c);
  const southWall = new THREE.Group();
  southWall.name = 'baySouthWall';
  group.add(southWall);
  const otherWalls = new THREE.Group();
  otherWalls.name = 'bayOtherWalls';
  group.add(otherWalls);

  function wallSeg(target, axis, fixed, a, b) {
    const len = b - a;
    if (len < 0.2) return;
    const mesh = new THREE.Mesh(
      axis === 'x'
        ? new THREE.BoxGeometry(len, SHELL_H, SHELL_T)
        : new THREE.BoxGeometry(SHELL_T, SHELL_H, len),
      wallMat,
    );
    if (axis === 'x') mesh.position.set((a + b) / 2, SHELL_H / 2, fixed);
    else mesh.position.set(fixed, SHELL_H / 2, ROOM2_CZ + (a + b) / 2);
    mesh.castShadow = true;
    mesh.receiveShadow = true;
    target.add(mesh);
    // Cyan cap strip
    if (axis === 'x') box(target, cyanLight, (a + b) / 2, SHELL_H - 0.06, fixed, len * 0.96, 0.05, 0.08);
    else box(target, cyanLight, fixed, SHELL_H - 0.06, ROOM2_CZ + (a + b) / 2, 0.08, 0.05, len * 0.96);
  }

  function lintel(target, axis, fixed) {
    const mesh = new THREE.Mesh(
      axis === 'x'
        ? new THREE.BoxGeometry(DOOR_GAP + 0.4, 0.4, SHELL_T + 0.12)
        : new THREE.BoxGeometry(SHELL_T + 0.12, 0.4, DOOR_GAP + 0.4),
      wallMat,
    );
    if (axis === 'x') mesh.position.set(BAY_DOOR_X, SHELL_H - 0.16, fixed);
    else mesh.position.set(fixed, SHELL_H - 0.16, ROOM2_CZ);
    mesh.castShadow = true;
    target.add(mesh);
    if (axis === 'x') box(target, cyanLight, BAY_DOOR_X, SHELL_H - 0.05, fixed, DOOR_GAP * 0.85, 0.06, 0.1);
    else box(target, cyanLight, fixed, SHELL_H - 0.05, ROOM2_CZ, 0.1, 0.06, DOOR_GAP * 0.85);
  }

  // South wall (hideable) — door gap aligned with room-1 north door.
  const halfX = ROOM2_HX - 0.15;
  const doorHalf = DOOR_GAP / 2;
  const southZ = ROOM2_SOUTH - 0.15;
  wallSeg(southWall, 'x', southZ, -halfX, BAY_DOOR_X - doorHalf);
  wallSeg(southWall, 'x', southZ, BAY_DOOR_X + doorHalf, halfX);
  lintel(southWall, 'x', southZ);

  // North / west / east
  const northZ = ROOM2_NORTH + 0.15;
  wallSeg(otherWalls, 'x', northZ, -halfX, BAY_DOOR_X - doorHalf);
  wallSeg(otherWalls, 'x', northZ, BAY_DOOR_X + doorHalf, halfX);
  lintel(otherWalls, 'x', northZ);
  const halfZ = ROOM2_HZ - 0.15;
  wallSeg(otherWalls, 'z', -(ROOM2_HX - 0.15), -halfZ, -doorHalf);
  wallSeg(otherWalls, 'z', -(ROOM2_HX - 0.15), doorHalf, halfZ);
  lintel(otherWalls, 'z', -(ROOM2_HX - 0.15));
  wallSeg(otherWalls, 'z', ROOM2_HX - 0.15, -halfZ, -doorHalf);
  wallSeg(otherWalls, 'z', ROOM2_HX - 0.15, doorHalf, halfZ);
  lintel(otherWalls, 'z', ROOM2_HX - 0.15);

  // --- Four concept doors (N/S hazard double doors; E/W hazard panels) ---
  function makeDoor(x, z, rotY, kind) {
    const root = new THREE.Group();
    root.position.set(x, 0, z);
    root.rotation.y = rotY;
    group.add(root);
    const w = DOOR_GAP - 0.15;
    const h = 2.05;
    // Leaf pair
    for (const side of [-1, 1]) {
      const leaf = new THREE.Mesh(
        new THREE.BoxGeometry(w / 2 - 0.04, h, 0.14),
        shellMat(0x1c2d38),
      );
      leaf.position.set(side * (w / 4), h / 2, 0);
      leaf.castShadow = true;
      root.add(leaf);
      // X emboss
      box(root, alloy, side * (w / 4), h * 0.55, 0.08, w * 0.18, 0.06, 0.04)
        .rotation.z = side * 0.7;
      box(root, alloy, side * (w / 4), h * 0.55, 0.08, w * 0.18, 0.06, 0.04)
        .rotation.z = -side * 0.7;
    }
    // Hazard stripes top + bottom (N/S) or side panels (E/W)
    if (kind === 'ns') {
      for (let i = 0; i < 8; i++) {
        box(root, i % 2 ? amberLight : carbon, (i - 3.5) * 0.22, 0.08, 0.1, 0.18, 0.05, 0.08);
        box(root, i % 2 ? amberLight : carbon, (i - 3.5) * 0.22, h - 0.08, 0.1, 0.18, 0.05, 0.08);
      }
    } else {
      for (const side of [-1, 1]) {
        for (let i = 0; i < 5; i++) {
          box(root, i % 2 ? amberLight : carbon, side * (w / 2 - 0.08), 0.35 + i * 0.32, 0.1, 0.1, 0.26, 0.06);
        }
      }
    }
    // Cyan jamb lights
    box(root, cyanLight, -w / 2 - 0.06, h / 2, 0.05, 0.07, h * 0.92, 0.07);
    box(root, cyanLight, w / 2 + 0.06, h / 2, 0.05, 0.07, h * 0.92, 0.07);
    return root;
  }

  makeDoor(BAY_DOOR_X, ROOM2_NORTH + 0.2, Math.PI, 'ns');
  makeDoor(-(ROOM2_HX - 0.2), ROOM2_CZ, Math.PI / 2, 'ew');
  makeDoor(ROOM2_HX - 0.2, ROOM2_CZ, -Math.PI / 2, 'ew');
  // South door: slam leaf (starts open). Lives on the main group so it stays
  // visible even when the south wall is hidden to stop camera occlusion.
  const southDoorRoot = new THREE.Group();
  southDoorRoot.position.set(BAY_DOOR_X, 0, ROOM2_SOUTH);
  group.add(southDoorRoot);
  const jamb = 0.14;
  const leafW = DOOR_GAP - 2 * jamb - 0.05;
  const leafH = 1.92;
  const hinge = new THREE.Group();
  hinge.position.set(-DOOR_GAP / 2 + jamb + 0.02, 0.02, 0);
  southDoorRoot.add(hinge);
  const leaf = new THREE.Mesh(new THREE.BoxGeometry(leafW, leafH, 0.16), shellMat(0x1c2d38));
  leaf.position.set(leafW / 2, leafH / 2, 0);
  leaf.castShadow = true;
  hinge.add(leaf);
  // Hazard strip on the slam leaf
  for (let i = 0; i < 6; i++) {
    box(hinge, i % 2 ? amberLight : carbon, leafW / 2 + (i - 2.5) * 0.2, 0.1, 0.1, 0.16, 0.05, 0.05);
  }
  box(southDoorRoot, cyanLight, -DOOR_GAP / 2 - 0.05, 1.1, 0.05, 0.07, 1.9, 0.07);
  box(southDoorRoot, cyanLight, DOOR_GAP / 2 + 0.05, 1.1, 0.05, 0.07, 1.9, 0.07);
  hinge.rotation.y = -Math.PI * 0.92;
  const southDoor = {
    hinge,
    open() { hinge.rotation.y = -Math.PI * 0.92; },
    shut() { hinge.rotation.y = 0; },
    x: BAY_DOOR_X,
    z: ROOM2_SOUTH,
  };

  // --- Cross channels ---
  const channelMat = shellMat(0x2a4052, { metalness: 0.4, roughness: 0.52 });
  const chX = new THREE.Mesh(new THREE.BoxGeometry(1.4, 0.05, ROOM2_HZ * 1.7), channelMat);
  chX.position.set(0, 0.015, ROOM2_CZ);
  chX.receiveShadow = true;
  group.add(chX);
  const chZ = new THREE.Mesh(new THREE.BoxGeometry(ROOM2_HX * 1.7, 0.05, 1.4), channelMat);
  chZ.position.set(0, 0.015, ROOM2_CZ);
  chZ.receiveShadow = true;
  group.add(chZ);
  for (const side of [-1, 1]) {
    box(group, cyanLight, side * 0.5, 0.03, ROOM2_CZ, 0.06, 0.014, ROOM2_HZ * 1.55);
    box(group, cyanLight, 0, 0.03, ROOM2_CZ + side * 0.5, ROOM2_HX * 1.55, 0.014, 0.06);
  }

  // --- Pillars ---
  const pillarRx = ROOM2_HX * 0.55;
  const pillarRz = ROOM2_HZ * 0.55;
  for (const [sx, sz] of [[-1, -1], [1, -1], [-1, 1], [1, 1]]) {
    const x = sx * pillarRx;
    const z = ROOM2_CZ + sz * pillarRz;
    const pillar = new THREE.Group();
    pillar.position.set(x, 0, z);
    group.add(pillar);
    model(pillar, new THREE.BoxGeometry(1.85, 2.9, 1.85), carbon, 0, 1.45, 0).castShadow = true;
    model(pillar, new THREE.BoxGeometry(2.05, 0.26, 2.05), carbon, 0, 2.9, 0);
    box(pillar, cyanLight, 0, 3.02, 0, 1.4, 0.05, 1.4);
    for (const face of [[0, 0.96], [0, -0.96], [0.96, 0], [-0.96, 0]]) {
      box(pillar, cyanLight, face[0], 2.5, face[1], face[0] ? 0.07 : 1.3, 0.08, face[0] ? 1.3 : 0.07);
      box(pillar, cyanLight, face[0], 0.42, face[1], face[0] ? 0.07 : 1.3, 0.08, face[0] ? 1.3 : 0.07);
    }
    box(pillar, amberLight, 0.65, 0.35, 0.65, 0.15, 0.1, 0.15);
    addSolid(x, z, 1.05, 1.05);
  }

  // --- Dashed pads ---
  const dashMat = new THREE.MeshBasicMaterial({
    color: 0xd0e4f2, transparent: true, opacity: 0.72, depthWrite: false, toneMapped: false, fog: false,
  });
  const padRx = ROOM2_HX * 0.36;
  const padRz = ROOM2_HZ * 0.36;
  for (const [sx, sz] of [[-1, -1], [1, -1], [-1, 1], [1, 1]]) {
    const x = sx * padRx;
    const z = ROOM2_CZ + sz * padRz;
    const pad = new THREE.Group();
    pad.position.set(x, 0.05, z);
    group.add(pad);
    const halfPad = 1.55;
    const dashLen = 0.45;
    const gap = 0.22;
    for (const side of [-1, 1]) {
      for (let t = -halfPad; t < halfPad - 0.01; t += dashLen + gap) {
        const len = Math.min(dashLen, halfPad - t);
        const hDash = new THREE.Mesh(new THREE.BoxGeometry(len, 0.025, 0.08), dashMat);
        hDash.position.set(t + len / 2, 0.02, side * halfPad);
        pad.add(hDash);
        const vDash = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.025, len), dashMat);
        vDash.position.set(side * halfPad, 0.02, t + len / 2);
        pad.add(vDash);
      }
    }
    box(pad, dashMat, 0, 0.03, 0, 0.7, 0.025, 0.09);
    box(pad, dashMat, 0, 0.03, 0, 0.09, 0.025, 0.7);
  }

  // --- Raised octagon + Tesla coil ---
  const platform = new THREE.Group();
  platform.position.set(0, 0, ROOM2_CZ);
  group.add(platform);
  const oct = new THREE.Mesh(
    new THREE.CylinderGeometry(4.2, 4.5, 0.55, 8),
    shellMat(0x31485c, { metalness: 0.58, roughness: 0.36 }),
  );
  oct.position.y = 0.28;
  oct.receiveShadow = true;
  oct.castShadow = true;
  platform.add(oct);
  model(platform, new THREE.CylinderGeometry(3.8, 3.8, 0.09, 8), alloy, 0, 0.58, 0);
  for (let i = 0; i < 8; i++) {
    const a = (i / 8) * Math.PI * 2 + Math.PI / 8;
    box(platform, i % 2 ? amberLight : cyanLight, Math.cos(a) * 3.75, 0.6, Math.sin(a) * 3.75, 0.28, 0.05, 0.13)
      .rotation.y = a;
  }
  // Vent grates on octagon sides
  for (let i = 0; i < 8; i++) {
    const a = (i / 8) * Math.PI * 2;
    box(platform, carbon, Math.cos(a) * 4.0, 0.28, Math.sin(a) * 4.0, 0.9, 0.35, 0.08)
      .rotation.y = a;
  }
  addSolid(0, ROOM2_CZ, 4.1, 4.1);

  const coil = new THREE.Group();
  coil.position.set(0, 0.58, ROOM2_CZ);
  group.add(coil);
  model(coil, new THREE.CylinderGeometry(0.95, 1.15, 0.4, 16), carbon, 0, 0.2, 0);
  model(
    coil,
    new THREE.CylinderGeometry(0.7, 0.8, 0.14, 16),
    new THREE.MeshStandardMaterial({
      color: CYAN, emissive: CYAN, emissiveIntensity: 0.75, metalness: 0.15, roughness: 0.35,
    }),
    0, 0.4, 0,
  );
  for (let i = 0; i < 12; i++) {
    const ring = model(
      coil,
      new THREE.TorusGeometry(0.48 + (i % 2) * 0.08, 0.065, 6, 18),
      alloy,
      0, 0.75 + i * 0.26, 0,
    );
    ring.rotation.x = Math.PI / 2;
    if (i % 2 === 0) {
      box(coil, cyanLight, 0, 0.75 + i * 0.26, 0, 0.08, 0.04, 0.08);
    }
  }
  const mast = model(coil, new THREE.CylinderGeometry(0.22, 0.35, 3.4, 12), alloy, 0, 2.3, 0);
  mast.castShadow = true;
  const ball = model(
    coil,
    new THREE.SphereGeometry(0.85, 20, 16),
    new THREE.MeshStandardMaterial({
      color: 0xc5d4de, emissive: CYAN, emissiveIntensity: 0.35, metalness: 0.72, roughness: 0.18,
    }),
    0, 4.35, 0,
  );
  ball.castShadow = true;
  halo(coil, CYAN, 0, 4.35, 0, 4.8, 0.34);

  // Corner blocks on perimeter (concept chunky corners)
  for (const [sx, sz] of [[-1, -1], [1, -1], [-1, 1], [1, 1]]) {
    const x = sx * (ROOM2_HX - 0.55);
    const z = ROOM2_CZ + sz * (ROOM2_HZ - 0.55);
    const block = new THREE.Mesh(new THREE.BoxGeometry(1.3, SHELL_H + 0.15, 1.3), wallMat);
    block.position.set(x, (SHELL_H + 0.15) / 2, z);
    block.castShadow = true;
    (sz > 0 ? southWall : otherWalls).add(block);
    box(sz > 0 ? southWall : otherWalls, cyanLight, x, SHELL_H, z, 0.9, 0.06, 0.9);
  }

  return {
    group,
    southWall,
    otherWalls,
    southDoor,
    solids,
    coil,
  };
}
