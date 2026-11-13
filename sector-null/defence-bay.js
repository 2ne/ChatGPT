/**
 * Defence Bay constants + decorative builders.
 * Door/wall collision stays in game.js (shared opening system).
 */
import * as THREE from 'three';

export const ROOM1_HALF = 10;
/** Half-extents — wider than deep so landscape framing matches the concept. */
export const BAY_HX = 21;
export const BAY_HZ = 11;
/** @deprecated use BAY_HX / BAY_HZ — kept as max half for cam/fog helpers. */
export const BAY_HALF = BAY_HX;
/** Longer link so room 1 and the bay read as separate spaces with a clear corridor. */
export const CORRIDOR_LEN = 9;
export const BAY_CZ = -(ROOM1_HALF + CORRIDOR_LEN + BAY_HZ);
/** Camera / fog scale vs reactor deck — pull back for the wider bay. */
export const bayCamScale = (hx = BAY_HX) => hx / ROOM1_HALF;

const STEEL = 0x3d5568;
const STEEL_DK = 0x1a2a38;
const STEEL_LT = 0x5a7388;
const CYAN = 0x62edff;
const HAZARD = 0xffa648;

/**
 * Build bay floor, solid inner wall shell, pillars, channels, pads, and Tesla coil.
 * Returns { solids, coil, tip } for collision + combat hooks.
 */
export function buildBayDecor(group, { box, model, halo, alloy, carbon, cyanLight, amberLight }) {
  const solids = [];
  const addSolid = (x, z, hx, hz, rotation = 0) => {
    solids.push({ x, z, hx, hz, c: Math.cos(rotation), s: Math.sin(rotation) });
  };

  // Dark tiled floor — clipped inside the wall shell (no exterior bleed).
  const tileMat = new THREE.MeshStandardMaterial({ color: STEEL_DK, metalness: 0.55, roughness: 0.48 });
  const tileAlt = new THREE.MeshStandardMaterial({ color: 0x203040, metalness: 0.52, roughness: 0.5 });
  const inset = 0.85;
  const tileSpanX = BAY_HX * 2 - inset;
  const tileSpanZ = BAY_HZ * 2 - inset;
  const tileNx = 12;
  const tileNz = 9;
  const tileWx = tileSpanX / tileNx;
  const tileWz = tileSpanZ / tileNz;
  for (let iz = 0; iz < tileNz; iz++) {
    for (let ix = 0; ix < tileNx; ix++) {
      const tile = new THREE.Mesh(
        new THREE.BoxGeometry(tileWx - 0.06, 0.07, tileWz - 0.06),
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

  // Solid inner wall shell so the bay reads as chunky from above (panel bake alone can silhouette).
  const shellMat = new THREE.MeshStandardMaterial({ color: 0x2a4052, metalness: 0.48, roughness: 0.42 });
  const shellH = 2.45;
  const shellT = 0.62;
  const doorGap = 2.95; // match wider bay blast doors (all four sides)
  const walls = [
    ['x', BAY_CZ + BAY_HZ - 0.15, BAY_HX - 0.15],
    ['x', BAY_CZ - BAY_HZ + 0.15, BAY_HX - 0.15],
    ['z', -(BAY_HX - 0.15), BAY_HZ - 0.15],
    ['z', BAY_HX - 0.15, BAY_HZ - 0.15],
  ];
  for (const [axis, fixed, half] of walls) {
    for (const [a, b] of [[-half, -doorGap / 2], [doorGap / 2, half]]) {
      const len = b - a;
      if (len < 0.2) continue;
      const mesh = new THREE.Mesh(
        axis === 'x'
          ? new THREE.BoxGeometry(len, shellH, shellT)
          : new THREE.BoxGeometry(shellT, shellH, len),
        shellMat,
      );
      if (axis === 'x') mesh.position.set((a + b) / 2, shellH / 2, fixed);
      else mesh.position.set(fixed, shellH / 2, BAY_CZ + (a + b) / 2);
      mesh.castShadow = true;
      mesh.receiveShadow = true;
      group.add(mesh);
    }
    const lintel = new THREE.Mesh(
      axis === 'x'
        ? new THREE.BoxGeometry(doorGap + 0.35, 0.38, shellT + 0.1)
        : new THREE.BoxGeometry(shellT + 0.1, 0.38, doorGap + 0.35),
      shellMat,
    );
    if (axis === 'x') lintel.position.set(0, shellH - 0.16, fixed);
    else lintel.position.set(fixed, shellH - 0.16, BAY_CZ);
    lintel.castShadow = true;
    group.add(lintel);
  }

  // Cross channels from centre toward each door (pads stay off these in the quadrants)
  const channelMat = new THREE.MeshStandardMaterial({ color: 0x243848, metalness: 0.4, roughness: 0.55 });
  const chX = new THREE.Mesh(new THREE.BoxGeometry(1.2, 0.045, BAY_HZ * 1.7), channelMat);
  chX.position.set(0, 0.015, BAY_CZ);
  chX.receiveShadow = true;
  group.add(chX);
  const chZ = new THREE.Mesh(new THREE.BoxGeometry(BAY_HX * 1.7, 0.045, 1.2), channelMat);
  chZ.position.set(0, 0.015, BAY_CZ);
  chZ.receiveShadow = true;
  group.add(chZ);
  for (const side of [-1, 1]) {
    box(group, cyanLight, side * 0.44, 0.03, BAY_CZ, 0.04, 0.012, BAY_HZ * 1.55);
    box(group, cyanLight, 0, 0.03, BAY_CZ + side * 0.44, BAY_HX * 1.55, 0.012, 0.04);
  }

  // Cover pillars toward the four corners (concept: well outside centre, inside the pads)
  const pillarRx = BAY_HX * 0.60;
  const pillarRz = BAY_HZ * 0.60;
  for (const [sx, sz] of [[-1, -1], [1, -1], [-1, 1], [1, 1]]) {
    const x = sx * pillarRx;
    const z = BAY_CZ + sz * pillarRz;
    const pillar = new THREE.Group();
    pillar.position.set(x, 0, z);
    group.add(pillar);
    model(pillar, new THREE.BoxGeometry(1.5, 2.55, 1.5), carbon, 0, 1.25, 0).castShadow = true;
    model(pillar, new THREE.BoxGeometry(1.68, 0.22, 1.68), alloy, 0, 2.55, 0);
    box(pillar, cyanLight, 0, 2.25, 0.78, 1.05, 0.06, 0.05);
    box(pillar, cyanLight, 0, 0.38, 0.78, 1.05, 0.06, 0.05);
    box(pillar, amberLight, 0.6, 0.3, 0.6, 0.12, 0.08, 0.12);
    addSolid(x, z, 0.85, 0.85);
  }

  // Dashed pads in the four quadrants (between pillars and walls — not on the cross channels)
  const dashMat = new THREE.MeshBasicMaterial({
    color: 0xc5d6e4, transparent: true, opacity: 0.55, depthWrite: false, toneMapped: false,
  });
  // Pads in the four quadrants — further out than pillars, clear of the cross channels
  const padRx = BAY_HX * 0.82;
  const padRz = BAY_HZ * 0.82;
  for (const [sx, sz] of [[-1, -1], [1, -1], [-1, 1], [1, 1]]) {
    const x = sx * padRx;
    const z = BAY_CZ + sz * padRz;
    const pad = new THREE.Group();
    pad.position.set(x, 0.04, z);
    group.add(pad);
    const plate = new THREE.Mesh(
      new THREE.BoxGeometry(2.7, 0.05, 2.7),
      new THREE.MeshStandardMaterial({ color: STEEL, metalness: 0.58, roughness: 0.4 }),
    );
    plate.receiveShadow = true;
    pad.add(plate);
    const halfPad = 1.2;
    const dashLen = 0.42;
    const gap = 0.22;
    for (const side of [-1, 1]) {
      for (let t = -halfPad; t < halfPad - 0.01; t += dashLen + gap) {
        const len = Math.min(dashLen, halfPad - t);
        const hDash = new THREE.Mesh(new THREE.BoxGeometry(len, 0.02, 0.06), dashMat);
        hDash.position.set(t + len / 2, 0.04, side * halfPad);
        pad.add(hDash);
        const vDash = new THREE.Mesh(new THREE.BoxGeometry(0.06, 0.02, len), dashMat);
        vDash.position.set(side * halfPad, 0.04, t + len / 2);
        pad.add(vDash);
      }
    }
    box(pad, dashMat, 0, 0.05, 0, 0.55, 0.02, 0.07);
    box(pad, dashMat, 0, 0.05, 0, 0.07, 0.02, 0.55);
  }

  // Larger raised octagonal central platform + Tesla coil
  const platform = new THREE.Group();
  platform.position.set(0, 0, BAY_CZ);
  group.add(platform);
  const oct = new THREE.Mesh(
    new THREE.CylinderGeometry(4.05, 4.3, 0.48, 8),
    new THREE.MeshStandardMaterial({ color: 0x2a3f52, metalness: 0.62, roughness: 0.38 }),
  );
  oct.position.y = 0.24;
  oct.receiveShadow = true;
  oct.castShadow = true;
  platform.add(oct);
  model(platform, new THREE.CylinderGeometry(3.65, 3.65, 0.08, 8), alloy, 0, 0.5, 0);
  for (let i = 0; i < 8; i++) {
    const a = (i / 8) * Math.PI * 2 + Math.PI / 8;
    box(platform, i % 2 ? amberLight : cyanLight, Math.cos(a) * 3.6, 0.52, Math.sin(a) * 3.6, 0.24, 0.04, 0.11)
      .rotation.y = a;
  }
  addSolid(0, BAY_CZ, 3.85, 3.85);

  const coil = new THREE.Group();
  coil.position.set(0, 0.5, BAY_CZ);
  group.add(coil);
  const socket = model(coil, new THREE.CylinderGeometry(0.65, 0.85, 0.28, 16), carbon, 0, 0.14, 0);
  const socketGlow = model(
    coil,
    new THREE.CylinderGeometry(0.48, 0.55, 0.1, 16),
    new THREE.MeshStandardMaterial({
      color: CYAN, emissive: CYAN, emissiveIntensity: 0.45, metalness: 0.2, roughness: 0.4,
    }),
    0, 0.28, 0,
  );
  for (let i = 0; i < 7; i++) {
    const ring = model(
      coil,
      new THREE.TorusGeometry(0.28 + (i % 2) * 0.04, 0.045, 6, 16),
      alloy,
      0, 0.55 + i * 0.16, 0,
    );
    ring.rotation.x = Math.PI / 2;
  }
  const mast = model(coil, new THREE.CylinderGeometry(0.14, 0.2, 1.35, 10), alloy, 0, 1.15, 0);
  const ball = model(
    coil,
    new THREE.SphereGeometry(0.42, 18, 14),
    new THREE.MeshStandardMaterial({
      color: 0x3a5568, emissive: CYAN, emissiveIntensity: 0.18, metalness: 0.35, roughness: 0.28,
    }),
    0, 2.05, 0,
  );
  const tipHalo = halo(coil, CYAN, 0, 2.05, 0, 2.4, 0.18);
  box(coil, amberLight, 0.52, 0.2, 0.52, 0.1, 0.06, 0.1);

  coil.userData = { socket, socketGlow, mast, ball, tipHalo, powered: false };

  // Door hazard stripes just inside each blast door (all four sides)
  for (const [x, z, rot] of [
    [0, BAY_CZ + BAY_HZ - 0.9, 0],
    [0, BAY_CZ - BAY_HZ + 0.9, 0],
    [-BAY_HX + 0.9, BAY_CZ, Math.PI / 2],
    [BAY_HX - 0.9, BAY_CZ, Math.PI / 2],
  ]) {
    const stripe = new THREE.Group();
    stripe.position.set(x, 0.03, z);
    stripe.rotation.y = rot;
    group.add(stripe);
    for (let i = 0; i < 5; i++) {
      box(stripe, i % 2 ? amberLight : carbon, (i - 2) * 0.28, 0, 0, 0.22, 0.02, 0.55);
    }
  }

  return {
    solids,
    coil,
    tip: new THREE.Vector3(0, 2.45, BAY_CZ),
    setCoilPower(rank) {
      const on = rank > 0;
      coil.userData.powered = on;
      ball.material.emissiveIntensity = on ? 0.55 + rank * 0.25 : 0.18;
      ball.material.color.setHex(on ? 0x9af5ff : 0x3a5568);
      socketGlow.material.emissiveIntensity = on ? 0.95 + rank * 0.2 : 0.45;
      tipHalo.material.opacity = on ? 0.3 + rank * 0.06 : 0.14;
    },
  };
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

export { STEEL, STEEL_LT, CYAN as BAY_CYAN, HAZARD };
