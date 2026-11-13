/**
 * Defence Bay constants + decorative builders.
 * Door/wall collision stays in game.js (shared opening system).
 */
import * as THREE from 'three';

export const ROOM1_HALF = 10;
/** ~2.3× room-1 floor — at room-1 camera you only see part of the bay. */
export const BAY_HX = 24;
export const BAY_HZ = 22;
export const BAY_HALF = BAY_HX;
/** Short open threshold between room-1 north door and bay south door (no corridor). */
export const THRESHOLD = 2.2;
export const CORRIDOR_LEN = THRESHOLD; // compat alias
export const BAY_CZ = -(ROOM1_HALF + THRESHOLD + BAY_HZ);
/** Bay south wall Z (faces room 1). */
export const BAY_SOUTH = BAY_CZ + BAY_HZ;
/** Bay north wall Z. */
export const BAY_NORTH = BAY_CZ - BAY_HZ;
/** Camera is identical to room 1 — no bay zoom. */
export const bayCamScale = () => 1;

const STEEL = 0x3d5568;
const STEEL_DK = 0x1a2a38;
const CYAN = 0x62edff;
const HAZARD = 0xffa648;

/**
 * Build bay floor, walls shell, pillars, channels, pads, Tesla coil.
 * Cheap emissive accents only — no extra shadow-casting lights.
 */
export function buildBayDecor(group, { box, model, halo, alloy, carbon, cyanLight, amberLight }) {
  const solids = [];
  const addSolid = (x, z, hx, hz, rotation = 0) => {
    solids.push({ x, z, hx, hz, c: Math.cos(rotation), s: Math.sin(rotation) });
  };

  const tileMat = new THREE.MeshStandardMaterial({ color: 0x2c4254, metalness: 0.48, roughness: 0.42 });
  const tileAlt = new THREE.MeshStandardMaterial({ color: 0x355064, metalness: 0.46, roughness: 0.44 });
  const inset = 1.0;
  const tileSpanX = BAY_HX * 2 - inset;
  const tileSpanZ = BAY_HZ * 2 - inset;
  const tileNx = 14;
  const tileNz = 13;
  const tileWx = tileSpanX / tileNx;
  const tileWz = tileSpanZ / tileNz;
  for (let iz = 0; iz < tileNz; iz++) {
    for (let ix = 0; ix < tileNx; ix++) {
      const tile = new THREE.Mesh(
        new THREE.BoxGeometry(tileWx - 0.08, 0.07, tileWz - 0.08),
        (ix + iz) % 2 ? tileAlt : tileMat,
      );
      tile.position.set(
        -tileSpanX / 2 + tileWx * (ix + 0.5),
        -0.02,
        BAY_CZ - tileSpanZ / 2 + tileWz * (iz + 0.5),
      );
      tile.receiveShadow = true;
      group.add(tile);
    }
  }

  const shellMat = new THREE.MeshStandardMaterial({ color: 0x3d586c, metalness: 0.45, roughness: 0.38 });
  const shellH = 2.45;
  const shellT = 0.7;
  const doorGap = 3.1;
  const walls = [
    ['x', BAY_SOUTH - 0.15, BAY_HX - 0.15],
    ['x', BAY_NORTH + 0.15, BAY_HX - 0.15],
    ['z', -(BAY_HX - 0.15), BAY_HZ - 0.15],
    ['z', BAY_HX - 0.15, BAY_HZ - 0.15],
  ];
  for (const [axis, fixed, half] of walls) {
    for (const [a, b] of [[-half, -doorGap / 2], [doorGap / 2, half]]) {
      const len = b - a;
      if (len < 0.2) continue;
      const mesh = new THREE.Mesh(
        axis === 'x' ? new THREE.BoxGeometry(len, shellH, shellT) : new THREE.BoxGeometry(shellT, shellH, len),
        shellMat,
      );
      if (axis === 'x') mesh.position.set((a + b) / 2, shellH / 2, fixed);
      else mesh.position.set(fixed, shellH / 2, BAY_CZ + (a + b) / 2);
      mesh.castShadow = true;
      mesh.receiveShadow = true;
      group.add(mesh);
      if (axis === 'x') box(group, cyanLight, (a + b) / 2, shellH - 0.06, fixed, len * 0.96, 0.05, 0.08);
      else box(group, cyanLight, fixed, shellH - 0.06, BAY_CZ + (a + b) / 2, 0.08, 0.05, len * 0.96);
    }
    const lintel = new THREE.Mesh(
      axis === 'x'
        ? new THREE.BoxGeometry(doorGap + 0.4, 0.4, shellT + 0.12)
        : new THREE.BoxGeometry(shellT + 0.12, 0.4, doorGap + 0.4),
      shellMat,
    );
    if (axis === 'x') lintel.position.set(0, shellH - 0.16, fixed);
    else lintel.position.set(fixed, shellH - 0.16, BAY_CZ);
    lintel.castShadow = true;
    group.add(lintel);
    if (axis === 'x') box(group, cyanLight, 0, shellH - 0.05, fixed, doorGap * 0.85, 0.06, 0.1);
    else box(group, cyanLight, fixed, shellH - 0.05, BAY_CZ, 0.1, 0.06, doorGap * 0.85);
  }

  // Cross channels
  const channelMat = new THREE.MeshStandardMaterial({ color: 0x2a4052, metalness: 0.4, roughness: 0.52 });
  const chX = new THREE.Mesh(new THREE.BoxGeometry(1.4, 0.05, BAY_HZ * 1.7), channelMat);
  chX.position.set(0, 0.015, BAY_CZ);
  chX.receiveShadow = true;
  group.add(chX);
  const chZ = new THREE.Mesh(new THREE.BoxGeometry(BAY_HX * 1.7, 0.05, 1.4), channelMat);
  chZ.position.set(0, 0.015, BAY_CZ);
  chZ.receiveShadow = true;
  group.add(chZ);
  for (const side of [-1, 1]) {
    box(group, cyanLight, side * 0.5, 0.03, BAY_CZ, 0.06, 0.014, BAY_HZ * 1.55);
    box(group, cyanLight, 0, 0.03, BAY_CZ + side * 0.5, BAY_HX * 1.55, 0.014, 0.06);
  }

  // Pillars toward corners (scaled with room)
  const pillarRx = BAY_HX * 0.55;
  const pillarRz = BAY_HZ * 0.55;
  for (const [sx, sz] of [[-1, -1], [1, -1], [-1, 1], [1, 1]]) {
    const x = sx * pillarRx;
    const z = BAY_CZ + sz * pillarRz;
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

  // Dashed pads in quadrants between centre and pillars
  const dashMat = new THREE.MeshBasicMaterial({
    color: 0xd0e4f2, transparent: true, opacity: 0.72, depthWrite: false, toneMapped: false,
  });
  const padRx = BAY_HX * 0.36;
  const padRz = BAY_HZ * 0.36;
  for (const [sx, sz] of [[-1, -1], [1, -1], [-1, 1], [1, 1]]) {
    const x = sx * padRx;
    const z = BAY_CZ + sz * padRz;
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

  // Raised octagon + tall Tesla coil
  const platform = new THREE.Group();
  platform.position.set(0, 0, BAY_CZ);
  group.add(platform);
  const oct = new THREE.Mesh(
    new THREE.CylinderGeometry(4.2, 4.5, 0.55, 8),
    new THREE.MeshStandardMaterial({ color: 0x31485c, metalness: 0.58, roughness: 0.36 }),
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
  addSolid(0, BAY_CZ, 4.1, 4.1);

  const coil = new THREE.Group();
  coil.position.set(0, 0.58, BAY_CZ);
  group.add(coil);
  const socket = model(coil, new THREE.CylinderGeometry(0.95, 1.15, 0.4, 16), carbon, 0, 0.2, 0);
  const socketGlow = model(
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
  }
  const mast = model(coil, new THREE.CylinderGeometry(0.22, 0.35, 3.4, 12), alloy, 0, 2.3, 0);
  mast.castShadow = true;
  const ball = model(
    coil,
    new THREE.SphereGeometry(0.85, 20, 16),
    new THREE.MeshStandardMaterial({
      color: 0x4a6a7e, emissive: CYAN, emissiveIntensity: 0.45, metalness: 0.28, roughness: 0.22,
    }),
    0, 4.35, 0,
  );
  ball.castShadow = true;
  const tipHalo = halo(coil, CYAN, 0, 4.35, 0, 4.8, 0.34);
  box(coil, amberLight, 0.85, 0.25, 0.85, 0.15, 0.09, 0.15);
  box(coil, cyanLight, 0, 0.85, 0, 0.12, 1.4, 0.12);
  coil.userData = { socket, socketGlow, mast, ball, tipHalo, powered: false };

  for (const [x, z, rot] of [
    [0, BAY_SOUTH - 1.1, 0],
    [0, BAY_NORTH + 1.1, 0],
    [-BAY_HX + 1.1, BAY_CZ, Math.PI / 2],
    [BAY_HX - 1.1, BAY_CZ, Math.PI / 2],
  ]) {
    const stripe = new THREE.Group();
    stripe.position.set(x, 0.03, z);
    stripe.rotation.y = rot;
    group.add(stripe);
    for (let i = 0; i < 6; i++) {
      box(stripe, i % 2 ? amberLight : carbon, (i - 2.5) * 0.3, 0, 0, 0.24, 0.02, 0.6);
    }
  }

  // Threshold floor strip (room1 north → bay south)
  const gapMid = ( -ROOM1_HALF + BAY_SOUTH) / 2;
  const gapLen = Math.abs(BAY_SOUTH - (-ROOM1_HALF));
  const thresh = new THREE.Mesh(
    new THREE.BoxGeometry(3.2, 0.06, gapLen + 0.3),
    new THREE.MeshStandardMaterial({ color: 0x1e2e3c, metalness: 0.5, roughness: 0.5 }),
  );
  thresh.position.set(0, -0.02, gapMid);
  thresh.receiveShadow = true;
  group.add(thresh);
  box(group, cyanLight, 0, 0.02, gapMid, 0.06, 0.02, gapLen * 0.7);

  return {
    solids,
    coil,
    tip: new THREE.Vector3(0, 4.8, BAY_CZ),
    setCoilPower(rank) {
      const on = rank > 0;
      coil.userData.powered = on;
      ball.material.emissiveIntensity = on ? 0.75 + rank * 0.18 : 0.45;
      ball.material.color.setHex(on ? 0x9af5ff : 0x4a6a7e);
      socketGlow.material.emissiveIntensity = on ? 1.1 + rank * 0.15 : 0.75;
      tipHalo.material.opacity = on ? 0.4 + rank * 0.05 : 0.3;
    },
  };
}

/**
 * Cheap continuous exterior filler so room-1 camera never shows black void.
 * Merged into one BlockBatch mesh — no lights, no shadows.
 */
export function buildFacilityFiller(batch, rng, { room1Half = ROOM1_HALF, bayCz = BAY_CZ, bayHx = BAY_HX, bayHz = BAY_HZ } = {}) {
  const baySouth = bayCz + bayHz;
  const bayNorth = bayCz - bayHz;
  const dark = 0x152028;
  const mid = 0x1c2a36;
  const lit = 0x243440;

  // Extended floor plates around both rooms (skip interiors)
  const step = 2.4;
  for (let z = -70; z <= 40; z += step) {
    for (let x = -55; x <= 55; x += step) {
      const inRoom1 = Math.abs(x) < room1Half + 0.8 && Math.abs(z) < room1Half + 0.8;
      const inBay = Math.abs(x) < bayHx + 0.8 && z < baySouth + 0.8 && z > bayNorth - 0.8;
      const inThreshold = Math.abs(x) < 2.2 && z < -room1Half + 0.5 && z > baySouth - 0.5;
      if (inRoom1 || inBay || inThreshold) continue;
      const shade = ((Math.abs(x) + Math.abs(z)) / 8 | 0) % 2 ? dark : mid;
      batch.add([[step - 0.12, 0.08, step - 0.12, x, -0.05, z, shade, 0, 0, 0, 0.02]], rng);
    }
  }

  // Machinery blocks hugging both room perimeters (reads as reactor exterior from room-1 cam)
  const rings = [
    { r: room1Half + 3.2, n: 14, h: 2.4 },
    { r: room1Half + 7.5, n: 16, h: 3.6 },
    { r: Math.max(bayHx, bayHz) + 3.5, n: 22, h: 3.8 },
    { r: Math.max(bayHx, bayHz) + 8, n: 26, h: 4.6 },
    { r: Math.max(bayHx, bayHz) + 14, n: 24, h: 5.2 },
  ];
  for (const { r, n, h } of rings) {
    for (let i = 0; i < n; i++) {
      const a = (i / n) * Math.PI * 2 + rng() * 0.15;
      // Ellipse biased around bay + room1
      const x = Math.cos(a) * r * (0.85 + 0.25 * Math.abs(Math.cos(a)));
      const z = Math.sin(a) * r * 0.9 + bayCz * 0.35;
      if (Math.abs(x) < room1Half + 1.4 && Math.abs(z) < room1Half + 1.4) continue;
      if (Math.abs(x) < bayHx + 1.4 && z < baySouth + 1.4 && z > bayNorth - 1.4) continue;
      if (Math.abs(x) < 2.4 && z < -room1Half + 0.6 && z > baySouth - 0.6) continue;
      const hh = h * (0.5 + rng() * 0.6);
      const w = 1.0 + rng() * 1.6;
      const d = 1.0 + rng() * 1.4;
      batch.add([
        [w, 0.22, d, x, 0.11, z, mid],
        [w * 0.55, hh, d * 0.55, x, hh / 2, z, dark],
        [w * 0.72, 0.26, d * 0.72, x, hh + 0.04, z, lit],
      ], rng);
      if (rng() > 0.45) {
        batch.add([[0.2, 0.2, 3.2 + rng() * 5, x, 1.1 + rng(), z, 0x1a2834]], rng);
      }
    }
  }
  // Dense belt just outside bay walls so corners never read as void
  for (const side of [-1, 1]) {
    for (let t = -bayHx + 2; t <= bayHx - 2; t += 3.1) {
      const zS = baySouth + 2.8 + rng();
      const zN = bayNorth - 2.8 - rng();
      for (const z of [zS, zN]) {
        const x = t + (rng() - 0.5);
        const hh = 2.2 + rng() * 2.4;
        batch.add([
          [1.3, 0.2, 1.1, x, 0.1, z, mid],
          [0.7, hh, 0.7, x, hh / 2, z, dark],
          [1.0, 0.25, 0.9, x, hh + 0.05, z, lit],
        ], rng);
      }
    }
    for (let t = bayNorth + 2; t <= baySouth - 2; t += 3.1) {
      const x = side * (bayHx + 2.8 + rng());
      const z = t + (rng() - 0.5);
      const hh = 2.4 + rng() * 2.6;
      batch.add([
        [1.2, 0.2, 1.3, x, 0.1, z, mid],
        [0.75, hh, 0.75, x, hh / 2, z, dark],
        [1.05, 0.25, 1.0, x, hh + 0.05, z, lit],
      ], rng);
    }
  }

  // Low grate / conduit strips along cardinal axes outside rooms
  for (const x of [-room1Half - 3, room1Half + 3, -bayHx - 3, bayHx + 3]) {
    for (let z = -65; z <= 35; z += 3.2) {
      if (Math.abs(z) < room1Half + 1 && Math.abs(x) < room1Half + 4) continue;
      if (z < baySouth + 1 && z > bayNorth - 1 && Math.abs(x) < bayHx + 4) continue;
      batch.add([[0.55, 0.06, 2.6, x, 0.02, z, 0x1a2834]], rng);
    }
  }
  for (const z of [-room1Half - 3, room1Half + 3, baySouth + 3, bayNorth - 3]) {
    for (let x = -50; x <= 50; x += 3.2) {
      if (Math.abs(x) < room1Half + 1 && Math.abs(z) < room1Half + 4) continue;
      if (Math.abs(x) < bayHx + 1 && z < baySouth + 4 && z > bayNorth - 4) continue;
      batch.add([[2.6, 0.06, 0.55, x, 0.02, z, 0x1a2834]], rng);
    }
  }
}

/** Cheap pooled lightning arcs (line segments). */
export function createCoilArcPool(scene, max = 8) {
  const pool = [];
  const active = [];
  const mat = new THREE.LineBasicMaterial({
    color: 0x9af5ff, transparent: true, opacity: 0.95, depthWrite: false, toneMapped: false,
  });

  function jagged(from, to, midJitter = 0.45) {
    const pts = [];
    const n = 5;
    for (let i = 0; i <= n; i++) {
      const t = i / n;
      const p = new THREE.Vector3().lerpVectors(from, to, t);
      if (i > 0 && i < n) {
        p.x += (Math.random() - 0.5) * midJitter;
        p.y += (Math.random() - 0.5) * midJitter * 0.6;
        p.z += (Math.random() - 0.5) * midJitter;
      }
      pts.push(p);
    }
    return pts;
  }

  function acquire() {
    let line = pool.pop();
    if (!line) {
      const geo = new THREE.BufferGeometry().setFromPoints([new THREE.Vector3(), new THREE.Vector3()]);
      line = new THREE.Line(geo, mat.clone());
      line.frustumCulled = false;
    }
    scene.add(line);
    return line;
  }

  function release(line) {
    scene.remove(line);
    pool.push(line);
  }

  return {
    spawn(from, to, life = 0.18) {
      if (active.length >= max) {
        const old = active.shift();
        release(old.line);
      }
      const line = acquire();
      line.geometry.setFromPoints(jagged(from, to));
      line.material.opacity = 0.95;
      active.push({ line, life, max: life });
    },
    update(dt) {
      for (let i = active.length - 1; i >= 0; i--) {
        const a = active[i];
        a.life -= dt;
        a.line.material.opacity = Math.max(0, a.life / a.max);
        if (a.life <= 0) {
          release(a.line);
          active.splice(i, 1);
        }
      }
    },
    clear() {
      while (active.length) {
        const a = active.pop();
        release(a.line);
      }
    },
  };
}

export { STEEL, CYAN as BAY_CYAN, HAZARD };
