/**
 * Defence Bay constants + decorative builders.
 * Door/wall collision stays in game.js (shared opening system).
 */
import * as THREE from 'three';

export const ROOM1_HALF = 10;
/**
 * Half-extents — wider than deep like the concept, but close to room-1 scale so
 * the follow-cam can put walls near the screen edges at a playable size.
 */
export const BAY_HX = 13;
export const BAY_HZ = 10.5;
/** @deprecated use BAY_HX / BAY_HZ — kept as max half for cam/fog helpers. */
export const BAY_HALF = BAY_HX;
/** Longer link so room 1 and the bay read as separate spaces with a clear corridor. */
export const CORRIDOR_LEN = 9;
export const BAY_CZ = -(ROOM1_HALF + CORRIDOR_LEN + BAY_HZ);
/** Near room-1 framing — walls near edges, operators stay readable. */
export const bayCamScale = () => 1.06;

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

  // Floor tiles — room-1 contrast (lighter charcoal steel plates).
  const tileMat = new THREE.MeshStandardMaterial({ color: 0x2c4254, metalness: 0.48, roughness: 0.42 });
  const tileAlt = new THREE.MeshStandardMaterial({ color: 0x355064, metalness: 0.46, roughness: 0.44 });
  const inset = 0.85;
  const tileSpanX = BAY_HX * 2 - inset;
  const tileSpanZ = BAY_HZ * 2 - inset;
  const tileNx = 11;
  const tileNz = 8;
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

  // Solid inner wall shell + cyan crown strip (room-1 style accents).
  const shellMat = new THREE.MeshStandardMaterial({ color: 0x3d586c, metalness: 0.45, roughness: 0.38 });
  const shellH = 2.45;
  const shellT = 0.62;
  const doorGap = 2.95;
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
      // Cyan crown along the wall top
      if (axis === 'x') box(group, cyanLight, (a + b) / 2, shellH - 0.06, fixed, len * 0.96, 0.05, 0.08);
      else box(group, cyanLight, fixed, shellH - 0.06, BAY_CZ + (a + b) / 2, 0.08, 0.05, len * 0.96);
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
    // Cyan bar over each door
    if (axis === 'x') box(group, cyanLight, 0, shellH - 0.05, fixed, doorGap * 0.85, 0.06, 0.1);
    else box(group, cyanLight, fixed, shellH - 0.05, BAY_CZ, 0.1, 0.06, doorGap * 0.85);
  }

  // Cross channels from centre toward each door
  const channelMat = new THREE.MeshStandardMaterial({ color: 0x2a4052, metalness: 0.4, roughness: 0.52 });
  const chX = new THREE.Mesh(new THREE.BoxGeometry(1.15, 0.045, BAY_HZ * 1.65), channelMat);
  chX.position.set(0, 0.015, BAY_CZ);
  chX.receiveShadow = true;
  group.add(chX);
  const chZ = new THREE.Mesh(new THREE.BoxGeometry(BAY_HX * 1.65, 0.045, 1.15), channelMat);
  chZ.position.set(0, 0.015, BAY_CZ);
  chZ.receiveShadow = true;
  group.add(chZ);
  for (const side of [-1, 1]) {
    box(group, cyanLight, side * 0.42, 0.03, BAY_CZ, 0.05, 0.014, BAY_HZ * 1.5);
    box(group, cyanLight, 0, 0.03, BAY_CZ + side * 0.42, BAY_HX * 1.5, 0.014, 0.05);
  }

  // Pillars further out toward corners; cyan bands on all four faces
  const pillarRx = BAY_HX * 0.58;
  const pillarRz = BAY_HZ * 0.58;
  for (const [sx, sz] of [[-1, -1], [1, -1], [-1, 1], [1, 1]]) {
    const x = sx * pillarRx;
    const z = BAY_CZ + sz * pillarRz;
    const pillar = new THREE.Group();
    pillar.position.set(x, 0, z);
    group.add(pillar);
    model(pillar, new THREE.BoxGeometry(1.55, 2.7, 1.55), carbon, 0, 1.35, 0).castShadow = true;
    // Cap stays dark so top-down doesn't read as a floating white cube.
    model(pillar, new THREE.BoxGeometry(1.72, 0.24, 1.72), carbon, 0, 2.7, 0);
    box(pillar, cyanLight, 0, 2.82, 0, 1.2, 0.05, 1.2);
    for (const face of [
      [0, 0.82], [0, -0.82], [0.82, 0], [-0.82, 0],
    ]) {
      box(pillar, cyanLight, face[0], 2.35, face[1], face[0] ? 0.06 : 1.1, 0.07, face[0] ? 1.1 : 0.06);
      box(pillar, cyanLight, face[0], 0.4, face[1], face[0] ? 0.06 : 1.1, 0.07, face[0] ? 1.1 : 0.06);
    }
    box(pillar, amberLight, 0.55, 0.32, 0.55, 0.14, 0.09, 0.14);
    addSolid(x, z, 0.88, 0.88);
  }

  // Dashed pads in the four quadrants BETWEEN centre and pillars (no solid plate — concept is outline only).
  const dashMat = new THREE.MeshBasicMaterial({
    color: 0xd0e4f2, transparent: true, opacity: 0.7, depthWrite: false, toneMapped: false,
  });
  const padRx = BAY_HX * 0.38;
  const padRz = BAY_HZ * 0.38;
  for (const [sx, sz] of [[-1, -1], [1, -1], [-1, 1], [1, 1]]) {
    const x = sx * padRx;
    const z = BAY_CZ + sz * padRz;
    const pad = new THREE.Group();
    pad.position.set(x, 0.05, z);
    group.add(pad);
    const halfPad = 1.25;
    const dashLen = 0.4;
    const gap = 0.2;
    for (const side of [-1, 1]) {
      for (let t = -halfPad; t < halfPad - 0.01; t += dashLen + gap) {
        const len = Math.min(dashLen, halfPad - t);
        const hDash = new THREE.Mesh(new THREE.BoxGeometry(len, 0.025, 0.07), dashMat);
        hDash.position.set(t + len / 2, 0.02, side * halfPad);
        pad.add(hDash);
        const vDash = new THREE.Mesh(new THREE.BoxGeometry(0.07, 0.025, len), dashMat);
        vDash.position.set(side * halfPad, 0.02, t + len / 2);
        pad.add(vDash);
      }
    }
    // Centre +
    box(pad, dashMat, 0, 0.03, 0, 0.6, 0.025, 0.08);
    box(pad, dashMat, 0, 0.03, 0, 0.08, 0.025, 0.6);
  }

  // Raised octagon + tall readable Tesla coil (dormant but clear from follow-cam)
  const platform = new THREE.Group();
  platform.position.set(0, 0, BAY_CZ);
  group.add(platform);
  const oct = new THREE.Mesh(
    new THREE.CylinderGeometry(3.5, 3.75, 0.5, 8),
    new THREE.MeshStandardMaterial({ color: 0x31485c, metalness: 0.58, roughness: 0.36 }),
  );
  oct.position.y = 0.25;
  oct.receiveShadow = true;
  oct.castShadow = true;
  platform.add(oct);
  model(platform, new THREE.CylinderGeometry(3.15, 3.15, 0.08, 8), alloy, 0, 0.52, 0);
  for (let i = 0; i < 8; i++) {
    const a = (i / 8) * Math.PI * 2 + Math.PI / 8;
    box(platform, i % 2 ? amberLight : cyanLight, Math.cos(a) * 3.15, 0.54, Math.sin(a) * 3.15, 0.26, 0.05, 0.12)
      .rotation.y = a;
  }
  addSolid(0, BAY_CZ, 3.4, 3.4);

  const coil = new THREE.Group();
  coil.position.set(0, 0.52, BAY_CZ);
  group.add(coil);
  const socket = model(coil, new THREE.CylinderGeometry(0.85, 1.05, 0.36, 16), carbon, 0, 0.18, 0);
  const socketGlow = model(
    coil,
    new THREE.CylinderGeometry(0.62, 0.72, 0.12, 16),
    new THREE.MeshStandardMaterial({
      color: CYAN, emissive: CYAN, emissiveIntensity: 0.7, metalness: 0.15, roughness: 0.35,
    }),
    0, 0.36, 0,
  );
  // Ribbed coil column — taller than cover pillars so it reads as a tower from follow-cam
  for (let i = 0; i < 11; i++) {
    const ring = model(
      coil,
      new THREE.TorusGeometry(0.42 + (i % 2) * 0.07, 0.06, 6, 18),
      alloy,
      0, 0.65 + i * 0.24, 0,
    );
    ring.rotation.x = Math.PI / 2;
  }
  const mast = model(coil, new THREE.CylinderGeometry(0.2, 0.32, 3.0, 12), alloy, 0, 2.0, 0);
  mast.castShadow = true;
  const ball = model(
    coil,
    new THREE.SphereGeometry(0.72, 20, 16),
    new THREE.MeshStandardMaterial({
      color: 0x4a6a7e, emissive: CYAN, emissiveIntensity: 0.42, metalness: 0.28, roughness: 0.22,
    }),
    0, 3.85, 0,
  );
  ball.castShadow = true;
  const tipHalo = halo(coil, CYAN, 0, 3.85, 0, 4.2, 0.32);
  box(coil, amberLight, 0.75, 0.22, 0.75, 0.14, 0.08, 0.14);
  box(coil, cyanLight, 0, 0.7, 0, 0.1, 1.2, 0.1);

  coil.userData = { socket, socketGlow, mast, ball, tipHalo, powered: false };

  // Door hazard stripes just inside each blast door
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

  // Local fill so the bay matches room-1 brightness (follows bayGroup visibility).
  const fill = new THREE.PointLight(0xb8e6ff, 140, 40, 2);
  fill.position.set(0, 8.5, BAY_CZ);
  group.add(fill);
  const rim = new THREE.PointLight(CYAN, 55, 24, 2);
  rim.position.set(0, 4.2, BAY_CZ);
  group.add(rim);

  return {
    solids,
    coil,
    tip: new THREE.Vector3(0, 4.25, BAY_CZ),
    setCoilPower(rank) {
      const on = rank > 0;
      coil.userData.powered = on;
      ball.material.emissiveIntensity = on ? 0.7 + rank * 0.2 : 0.35;
      ball.material.color.setHex(on ? 0x9af5ff : 0x4a6a7e);
      socketGlow.material.emissiveIntensity = on ? 1.1 + rank * 0.15 : 0.7;
      tipHalo.material.opacity = on ? 0.38 + rank * 0.05 : 0.28;
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
