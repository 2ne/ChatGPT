/**
 * Defence Bay constants + decorative builders.
 * Door/wall collision stays in game.js (shared opening system).
 */
import * as THREE from 'three';

export const ROOM1_HALF = 10;
export const BAY_HALF = 14;
export const CORRIDOR_LEN = 5.5;
export const BAY_CZ = -(ROOM1_HALF + CORRIDOR_LEN + BAY_HALF);
/** Camera / fog scale vs reactor deck — same pitch, pulled back for the larger room. */
export const bayCamScale = (half) => half / ROOM1_HALF;

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

  // Dark tiled floor (concept: charcoal steel plates)
  const tileMat = new THREE.MeshStandardMaterial({ color: STEEL_DK, metalness: 0.55, roughness: 0.48 });
  const tileAlt = new THREE.MeshStandardMaterial({ color: 0x203040, metalness: 0.52, roughness: 0.5 });
  const tileSpan = BAY_HALF * 2 - 1.2;
  const tileN = 10;
  const tileSize = tileSpan / tileN;
  for (let iz = 0; iz < tileN; iz++) {
    for (let ix = 0; ix < tileN; ix++) {
      const tile = new THREE.Mesh(
        new THREE.BoxGeometry(tileSize - 0.06, 0.07, tileSize - 0.06),
        (ix + iz) % 2 ? tileAlt : tileMat,
      );
      tile.position.set(
        -tileSpan / 2 + tileSize * (ix + 0.5),
        -0.02,
        BAY_CZ - tileSpan / 2 + tileSize * (iz + 0.5),
      );
      tile.receiveShadow = true;
      group.add(tile);
    }
  }

  // Solid inner wall shell so the bay reads as chunky from above (panel bake alone can silhouette).
  const shellMat = new THREE.MeshStandardMaterial({ color: 0x2a4052, metalness: 0.48, roughness: 0.42 });
  const shellH = 2.35;
  const shellT = 0.55;
  const doorGap = 2.95; // match wider bay blast doors
  const half = BAY_HALF - 0.15;
  for (const [axis, fixed] of [['x', BAY_CZ + half], ['x', BAY_CZ - half], ['z', -half], ['z', half]]) {
    // Two runs either side of the centred door
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
      else mesh.position.set(fixed, shellH / 2, (a + b) / 2);
      mesh.castShadow = true;
      mesh.receiveShadow = true;
      group.add(mesh);
    }
    // Lintel over the door
    const lintel = new THREE.Mesh(
      axis === 'x'
        ? new THREE.BoxGeometry(doorGap + 0.3, 0.35, shellT + 0.08)
        : new THREE.BoxGeometry(shellT + 0.08, 0.35, doorGap + 0.3),
      shellMat,
    );
    if (axis === 'x') lintel.position.set(0, shellH - 0.15, fixed);
    else lintel.position.set(fixed, shellH - 0.15, BAY_CZ);
    lintel.castShadow = true;
    group.add(lintel);
  }

  // Cross channels from centre toward each door
  const channelMat = new THREE.MeshStandardMaterial({ color: 0x243848, metalness: 0.4, roughness: 0.55 });
  for (const [w, d] of [[1.15, BAY_HALF * 1.65], [BAY_HALF * 1.65, 1.15]]) {
    const ch = new THREE.Mesh(new THREE.BoxGeometry(w, 0.045, d), channelMat);
    ch.position.set(0, 0.015, BAY_CZ);
    ch.receiveShadow = true;
    group.add(ch);
  }
  for (const side of [-1, 1]) {
    box(group, cyanLight, side * 0.42, 0.03, BAY_CZ, 0.04, 0.012, BAY_HALF * 1.5);
    box(group, cyanLight, 0, 0.03, BAY_CZ + side * 0.42, BAY_HALF * 1.5, 0.012, 0.04);
  }

  // Four cover pillars in a square around centre (concept: cyan bands)
  const pillarR = 5.4;
  for (const [sx, sz] of [[-1, -1], [1, -1], [-1, 1], [1, 1]]) {
    const x = sx * pillarR;
    const z = BAY_CZ + sz * pillarR;
    const pillar = new THREE.Group();
    pillar.position.set(x, 0, z);
    group.add(pillar);
    model(pillar, new THREE.BoxGeometry(1.45, 2.45, 1.45), carbon, 0, 1.2, 0).castShadow = true;
    model(pillar, new THREE.BoxGeometry(1.6, 0.2, 1.6), alloy, 0, 2.45, 0);
    box(pillar, cyanLight, 0, 2.15, 0.74, 1.0, 0.06, 0.05);
    box(pillar, cyanLight, 0, 0.35, 0.74, 1.0, 0.06, 0.05);
    box(pillar, amberLight, 0.58, 0.28, 0.58, 0.12, 0.08, 0.12);
    addSolid(x, z, 0.82, 0.82);
  }

  // Four dashed square pads with centre + (decorative)
  const dashMat = new THREE.MeshBasicMaterial({
    color: 0xc5d6e4, transparent: true, opacity: 0.55, depthWrite: false, toneMapped: false,
  });
  for (const [sx, sz] of [[0, -1], [0, 1], [-1, 0], [1, 0]]) {
    const x = sx * 9.0;
    const z = BAY_CZ + sz * 9.0;
    const pad = new THREE.Group();
    pad.position.set(x, 0.04, z);
    group.add(pad);
    const plate = new THREE.Mesh(
      new THREE.BoxGeometry(2.6, 0.05, 2.6),
      new THREE.MeshStandardMaterial({ color: STEEL, metalness: 0.58, roughness: 0.4 }),
    );
    plate.receiveShadow = true;
    pad.add(plate);
    const halfPad = 1.15;
    const dashLen = 0.42;
    const gap = 0.22;
    for (const side of [-1, 1]) {
      for (let t = -halfPad; t < halfPad - 0.01; t += dashLen + gap) {
        const len = Math.min(dashLen, halfPad - t);
        // Horizontal edges (const z)
        const hDash = new THREE.Mesh(new THREE.BoxGeometry(len, 0.02, 0.06), dashMat);
        hDash.position.set(t + len / 2, 0.04, side * halfPad);
        pad.add(hDash);
        // Vertical edges (const x)
        const vDash = new THREE.Mesh(new THREE.BoxGeometry(0.06, 0.02, len), dashMat);
        vDash.position.set(side * halfPad, 0.04, t + len / 2);
        pad.add(vDash);
      }
    }
    box(pad, dashMat, 0, 0.05, 0, 0.55, 0.02, 0.07);
    box(pad, dashMat, 0, 0.05, 0, 0.07, 0.02, 0.55);
  }

  // Raised octagonal central platform + Tesla coil
  const platform = new THREE.Group();
  platform.position.set(0, 0, BAY_CZ);
  group.add(platform);
  const oct = new THREE.Mesh(
    new THREE.CylinderGeometry(2.55, 2.7, 0.32, 8),
    new THREE.MeshStandardMaterial({ color: 0x2a3f52, metalness: 0.62, roughness: 0.38 }),
  );
  oct.position.y = 0.16;
  oct.receiveShadow = true;
  oct.castShadow = true;
  platform.add(oct);
  model(platform, new THREE.CylinderGeometry(2.25, 2.25, 0.06, 8), alloy, 0, 0.34, 0);
  for (let i = 0; i < 8; i++) {
    const a = (i / 8) * Math.PI * 2 + Math.PI / 8;
    box(platform, i % 2 ? amberLight : cyanLight, Math.cos(a) * 2.25, 0.36, Math.sin(a) * 2.25, 0.2, 0.04, 0.09)
      .rotation.y = a;
  }
  addSolid(0, BAY_CZ, 2.45, 2.45);

  const coil = new THREE.Group();
  coil.position.set(0, 0.34, BAY_CZ);
  group.add(coil);
  const socket = model(coil, new THREE.CylinderGeometry(0.6, 0.78, 0.26, 16), carbon, 0, 0.14, 0);
  const socketGlow = model(
    coil,
    new THREE.CylinderGeometry(0.45, 0.52, 0.1, 16),
    new THREE.MeshStandardMaterial({
      color: CYAN, emissive: CYAN, emissiveIntensity: 0.45, metalness: 0.2, roughness: 0.4,
    }),
    0, 0.28, 0,
  );
  // Ribbed coil neck
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

  // Door hazard stripes (concept orange accents) on the floor just inside each door
  for (const [x, z, rot] of [
    [0, BAY_CZ + BAY_HALF - 0.85, 0],
    [0, BAY_CZ - BAY_HALF + 0.85, 0],
    [-BAY_HALF + 0.85, BAY_CZ, Math.PI / 2],
    [BAY_HALF - 0.85, BAY_CZ, Math.PI / 2],
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
    tip: new THREE.Vector3(0, 2.35, BAY_CZ),
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
