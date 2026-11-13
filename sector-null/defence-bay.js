/**
 * Defence Bay constants + decorative builders.
 * Door/wall collision stays in game.js (shared opening system).
 */
import * as THREE from 'three';

export const ROOM1_HALF = 10;
export const BAY_HALF = 14;
export const CORRIDOR_LEN = 5.5;
export const BAY_CZ = -(ROOM1_HALF + CORRIDOR_LEN + BAY_HALF);
/** Camera / fog scale vs reactor deck. */
export const bayCamScale = (half) => half / ROOM1_HALF;

const STEEL = 0x3d5568;
const STEEL_LT = 0x5a7388;
const CYAN = 0x62edff;
const HAZARD = 0xffa648;

/**
 * Build bay floor, pillars, channels, pads, and Tesla coil into `group`.
 * Returns { solids, coil, tip } for collision + combat hooks.
 */
export function buildBayDecor(group, { box, model, halo, alloy, carbon, cyanLight, amberLight }) {
  const solids = [];
  const addSolid = (x, z, hx, hz, rotation = 0) => {
    solids.push({ x, z, hx, hz, c: Math.cos(rotation), s: Math.sin(rotation) });
  };

  // Raised steel deck inset
  const floor = new THREE.Mesh(
    new THREE.BoxGeometry(BAY_HALF * 2 - 0.4, 0.08, BAY_HALF * 2 - 0.4),
    new THREE.MeshStandardMaterial({ color: 0x1a2a38, metalness: 0.55, roughness: 0.48 }),
  );
  floor.position.set(0, -0.02, BAY_CZ);
  floor.receiveShadow = true;
  group.add(floor);

  // Cross channels from centre toward each door
  const channelMat = new THREE.MeshStandardMaterial({ color: 0x243848, metalness: 0.4, roughness: 0.55 });
  for (const [dx, dz, w, d] of [
    [0, 0, 1.1, BAY_HALF * 1.7],
    [0, 0, BAY_HALF * 1.7, 1.1],
  ]) {
    const ch = new THREE.Mesh(new THREE.BoxGeometry(w, 0.04, d), channelMat);
    ch.position.set(dx, 0.01, BAY_CZ + dz);
    ch.receiveShadow = true;
    group.add(ch);
  }
  // Cyan inlay strips down the channels
  for (const side of [-1, 1]) {
    box(group, cyanLight, side * 0.42, 0.025, BAY_CZ, 0.04, 0.01, BAY_HALF * 1.55);
    box(group, cyanLight, 0, 0.025, BAY_CZ + side * 0.42, BAY_HALF * 1.55, 0.01, 0.04);
  }

  // Four cover pillars in a square around centre
  const pillarR = 5.2;
  for (const [sx, sz] of [[-1, -1], [1, -1], [-1, 1], [1, 1]]) {
    const x = sx * pillarR;
    const z = BAY_CZ + sz * pillarR;
    const pillar = new THREE.Group();
    pillar.position.set(x, 0, z);
    group.add(pillar);
    model(pillar, new THREE.BoxGeometry(1.35, 2.35, 1.35), carbon, 0, 1.15, 0);
    model(pillar, new THREE.BoxGeometry(1.5, 0.18, 1.5), alloy, 0, 2.35, 0);
    box(pillar, cyanLight, 0, 1.4, 0.7, 0.7, 0.05, 0.04);
    box(pillar, amberLight, 0.55, 0.35, 0.55, 0.12, 0.08, 0.12);
    addSolid(x, z, 0.78, 0.78);
  }

  // Four decorative empty pads (between pillars and doors)
  const padMat = new THREE.MeshStandardMaterial({ color: STEEL, metalness: 0.6, roughness: 0.4 });
  const padRing = new THREE.MeshStandardMaterial({ color: STEEL_LT, metalness: 0.5, roughness: 0.35 });
  for (const [sx, sz] of [[0, -1], [0, 1], [-1, 0], [1, 0]]) {
    const x = sx * 9.2;
    const z = BAY_CZ + sz * 9.2;
    const pad = new THREE.Mesh(new THREE.CylinderGeometry(1.35, 1.45, 0.08, 20), padMat);
    pad.position.set(x, 0.02, z);
    pad.receiveShadow = true;
    group.add(pad);
    const ring = new THREE.Mesh(new THREE.TorusGeometry(1.2, 0.04, 6, 28), padRing);
    ring.rotation.x = Math.PI / 2;
    ring.position.set(x, 0.07, z);
    group.add(ring);
  }

  // Raised octagonal central platform + Tesla coil
  const platform = new THREE.Group();
  platform.position.set(0, 0, BAY_CZ);
  group.add(platform);
  const oct = new THREE.Mesh(
    new THREE.CylinderGeometry(2.4, 2.55, 0.28, 8),
    new THREE.MeshStandardMaterial({ color: 0x2a3f52, metalness: 0.62, roughness: 0.38 }),
  );
  oct.position.y = 0.14;
  oct.receiveShadow = true;
  oct.castShadow = true;
  platform.add(oct);
  model(platform, new THREE.CylinderGeometry(2.15, 2.15, 0.06, 8), alloy, 0, 0.3, 0);
  for (let i = 0; i < 8; i++) {
    const a = (i / 8) * Math.PI * 2 + Math.PI / 8;
    box(platform, i % 2 ? amberLight : cyanLight, Math.cos(a) * 2.15, 0.32, Math.sin(a) * 2.15, 0.18, 0.04, 0.08)
      .rotation.y = a;
  }
  addSolid(0, BAY_CZ, 2.35, 2.35);

  const coil = new THREE.Group();
  coil.position.set(0, 0.3, BAY_CZ);
  group.add(coil);
  const socket = model(coil, new THREE.CylinderGeometry(0.55, 0.7, 0.22, 16), carbon, 0, 0.12, 0);
  const socketGlow = model(
    coil,
    new THREE.CylinderGeometry(0.42, 0.48, 0.08, 16),
    new THREE.MeshStandardMaterial({
      color: CYAN, emissive: CYAN, emissiveIntensity: 0.35, metalness: 0.2, roughness: 0.4,
    }),
    0, 0.24, 0,
  );
  const mast = model(coil, new THREE.CylinderGeometry(0.16, 0.22, 1.55, 10), alloy, 0, 1.05, 0);
  const cage = model(coil, new THREE.CylinderGeometry(0.55, 0.55, 0.9, 8, 1, true),
    new THREE.MeshStandardMaterial({
      color: 0x4a6578, metalness: 0.55, roughness: 0.35, transparent: true, opacity: 0.45, side: THREE.DoubleSide,
    }),
    0, 1.15, 0,
  );
  const ball = model(
    coil,
    new THREE.SphereGeometry(0.38, 16, 14),
    new THREE.MeshStandardMaterial({
      color: 0x3a5568, emissive: CYAN, emissiveIntensity: 0.15, metalness: 0.35, roughness: 0.3,
    }),
    0, 1.95, 0,
  );
  const tipHalo = halo(coil, CYAN, 0, 1.95, 0, 2.2, 0.15);
  // Hazard accent only
  box(coil, amberLight, 0.48, 0.18, 0.48, 0.1, 0.06, 0.1);

  coil.userData = { socket, socketGlow, mast, cage, ball, tipHalo, powered: false };

  return {
    solids,
    coil,
    tip: new THREE.Vector3(0, 2.25, BAY_CZ),
    setCoilPower(rank) {
      const on = rank > 0;
      coil.userData.powered = on;
      ball.material.emissiveIntensity = on ? 0.55 + rank * 0.25 : 0.15;
      ball.material.color.setHex(on ? 0x9af5ff : 0x3a5568);
      socketGlow.material.emissiveIntensity = on ? 0.9 + rank * 0.2 : 0.35;
      tipHalo.material.opacity = on ? 0.28 + rank * 0.06 : 0.12;
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
