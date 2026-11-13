/** Preview-only Defence Bay. Architecture is batched; only doors and coil animate.
 * The walkable dais and existing cover footprints are retained. */
import * as THREE from 'three';
import { BAY_CX, BAY_DOOR_GAP, BAY_DOOR_X, ROOM2_CZ, ROOM2_HX, ROOM2_HZ,
  ROOM2_NORTH, ROOM2_SOUTH, ROOM2_WEST, ROOM2_EAST } from './facility-exterior.js';

const C = { deck: 0x243744, panel: 0x304756, edge: 0x536b7c, dark: 0x111e29,
  shell: 0x293e4f, cyan: 0x62edff, amber: 0xe5a044 };
const OCT_R = 5.35;
const CHANNEL = 0.72;
// Each pocket holds an entire leaf, including its raised braces on both faces.
const DOOR_HALF = BAY_DOOR_GAP / 2;
const POCKET_WIDTH = 2.8;
const PORTAL_HALF = DOOR_HALF + POCKET_WIDTH;

export function buildDefenceBay(parent, { box, model, halo, cyanLight,
  BlockBatch, seeded, worldMat, reducedMotion }) {
  const group = new THREE.Group();
  group.name = 'defenceBay';
  parent.add(group);
  const solids = [];
  const material = worldMat.clone();
  material.roughness = 0.78;
  material.metalness = 0.22;
  const glowMaterial = new THREE.MeshBasicMaterial({ vertexColors: true, toneMapped: false });
  const architecture = new BlockBatch();
  const lamps = new BlockBatch();
  const rng = seeded(237);
  const fixedTint = () => 0.5;
  function block(batch, w, h, d, x, y, z, color, ry = 0, rz = 0, bevel = 0.035) {
    batch.add([[w, h, d, x, y, z, color, 0, ry, rz, bevel]], fixedTint);
  }
  const metal = (...args) => block(architecture, ...args);
  const lamp = (...args) => block(lamps, ...args, 0, 0, 0.008);
  function bake(batch, target = group, mat = material, shadow = true) {
    const mesh = new THREE.Mesh(batch.build(), mat);
    mesh.castShadow = shadow;
    mesh.receiveShadow = mat !== glowMaterial;
    target.add(mesh);
    return mesh;
  }
  // Soft floor reflections from the existing glow texture: no extra lights.
  function lightPool(x, z, size, opacity) {
    const glow = halo(group, C.cyan, x, 0.3, z, size * 0.5, opacity * 0.6);
    const pool = model(group, new THREE.PlaneGeometry(size, size), new THREE.MeshBasicMaterial({
      map: glow.material.map, color: C.cyan, transparent: true, opacity,
      depthWrite: false, blending: THREE.AdditiveBlending,
    }), x, 0.012, z);
    pool.rotation.x = -Math.PI / 2;
  }

  // Trim plates against the cross instead of omitting whole tiles. The dais
  // sits above continuous decking: no ragged holes or coplanar surfaces.
  const deck = new BlockBatch();
  for (let z0 = ROOM2_NORTH + 0.35; z0 < ROOM2_SOUTH - 0.35; z0 += 1.6) {
    for (let x0 = ROOM2_WEST + 0.35; x0 < ROOM2_EAST - 0.35; x0 += 1.6) {
      const x1 = Math.min(x0 + 1.6, ROOM2_EAST - 0.35);
      const z1 = Math.min(z0 + 1.6, ROOM2_SOUTH - 0.35);
      const xs = [[x0, Math.min(x1, BAY_CX - CHANNEL - 0.08)], [Math.max(x0, BAY_CX + CHANNEL + 0.08), x1]];
      const zs = [[z0, Math.min(z1, ROOM2_CZ - CHANNEL - 0.08)], [Math.max(z0, ROOM2_CZ + CHANNEL + 0.08), z1]];
      const tint = new THREE.Color(C.deck).multiplyScalar(0.96 + rng() * 0.08).getHex();
      for (const [a, b] of xs) for (const [c, d] of zs) {
        if (b - a < 0.07 || d - c < 0.07) continue;
        block(deck, b - a - 0.025, 0.1, d - c - 0.025, (a + b) / 2, -0.055, (c + d) / 2, tint, 0, 0, 0.014);
      }
    }
  }
  bake(deck, group, material, false);

  // Recessed grilles: quiet rails lead to concentrated banks of light.
  for (const axis of ['x', 'z']) {
    const extent = axis === 'x' ? ROOM2_HX : ROOM2_HZ;
    const place = (u, v) => axis === 'x' ? [BAY_CX + u, ROOM2_CZ + v] : [BAY_CX + v, ROOM2_CZ + u];
    const strip = (u, v, length, width, y, h, color, glowing = false) => {
      const [x, z] = place(u, v);
      (glowing ? lamp : metal)(axis === 'x' ? length : width, h, axis === 'x' ? width : length, x, y, z, color);
    };
    for (const side of [-1, 1]) {
      const length = extent - OCT_R - 0.5;
      strip(side * (OCT_R + length / 2), 0, length, CHANNEL * 2, -0.065, 0.035, C.dark);
      for (const edge of [-1, 1]) strip(side * (OCT_R + length / 2), edge * (CHANNEL + 0.015), length, 0.085, 0.002, 0.045, C.edge);
      for (let u = OCT_R; u < extent - 0.5; u += 0.24) strip(side * u, 0, 0.045, 1.3, -0.02, 0.04, C.panel);
      for (let i = 0; i < 5; i++) strip(side * (OCT_R + length * 0.52 + i * 0.19), 0, 0.065, 0.85, 0.012, 0.025, axis === 'z' && side > 0 ? C.amber : C.cyan, true);
    }
  }

  // Inset vent panels, deep rails and wide structural ribs. Lamps face inward.
  function wall(axis, fixed, a, b, inward) {
    const put = (u, y, n, w, h, d, color) => {
      if (axis === 'x') metal(w, h, d, u, y, fixed + inward * n, color);
      else metal(d, h, w, fixed + inward * n, y, u, color);
    };
    const light = (u, y, n, w, h, d) => {
      if (axis === 'x') lamp(w, h, d, u, y, fixed + inward * n, C.cyan);
      else lamp(d, h, w, fixed + inward * n, y, u, C.cyan);
    };
    const count = Math.ceil((b - a) / 4.2);
    const step = (b - a) / count;
    put((a + b) / 2, 1.42, 0, b - a, 2.84, 0.72, C.dark);
    put((a + b) / 2, 2.78, 0.04, b - a, 0.32, 0.94, C.edge);
    put((a + b) / 2, 0.24, 0.08, b - a, 0.38, 0.94, C.shell);
    for (let i = 0; i < count; i++) {
      const u = a + step * (i + 0.5);
      put(u, 1.52, 0.32, step - 0.35, 2.15, 0.16, C.shell);
      put(u, 1.44, 0.44, step - 0.85, 0.96, 0.1, C.dark);
      for (let j = 0; j < 5; j++) put(u, 1.08 + j * 0.17, 0.51, step - 0.96, 0.055, 0.09, C.panel);
      light(u, 0.72, 0.55, Math.min(1.35, step - 1), 0.075, 0.1);
      put(u, 0.85, 0.52, 1.6, 0.11, 0.26, C.edge);
      if (i > 0) put(a + step * i, 1.5, 0.08, 0.48, 3, 1.22, C.edge);
    }
  }
  for (const z of [ROOM2_NORTH, ROOM2_SOUTH]) {
    const inward = z === ROOM2_NORTH ? 1 : -1;
    wall('x', z, ROOM2_WEST, BAY_CX - PORTAL_HALF, inward);
    wall('x', z, BAY_CX + PORTAL_HALF, ROOM2_EAST, inward);
  }
  for (const x of [ROOM2_WEST, ROOM2_EAST]) {
    const inward = x === ROOM2_WEST ? 1 : -1;
    wall('z', x, ROOM2_NORTH, ROOM2_CZ - PORTAL_HALF, inward);
    wall('z', x, ROOM2_CZ + PORTAL_HALF, ROOM2_SOUTH, inward);
  }
  for (const x of [ROOM2_WEST, ROOM2_EAST]) for (const z of [ROOM2_NORTH, ROOM2_SOUTH]) {
    metal(1.35, 3.15, 1.35, x, 1.575, z, C.shell);
    metal(1.5, 0.24, 1.5, x, 3.15, z, C.edge);
  }

  // Taller dark capacitor pylons with metal caps and thin luminous collars.
  for (const sx of [-1, 1]) for (const sz of [-1, 1]) {
    const x = BAY_CX + sx * ROOM2_HX * 0.52;
    const z = ROOM2_CZ + sz * ROOM2_HZ * 0.52;
    metal(2.2, 0.19, 2.2, x, 0.095, z, C.shell);
    metal(1.82, 3.65, 1.82, x, 2.02, z, C.dark);
    metal(1.96, 0.35, 1.96, x, 4.02, z, C.panel);
    metal(2.12, 0.16, 2.12, x, 4.25, z, C.edge);
    for (const side of [-1, 1]) {
      lamp(1.88, 0.075, 0.055, x, 0.27, z + side * 0.96, C.cyan);
      lamp(0.055, 0.075, 1.88, x + side * 0.96, 0.27, z, C.cyan);
      lamp(1.72, 0.095, 0.06, x, 3.67, z + side * 0.925, C.cyan);
      lamp(0.06, 0.095, 1.72, x + side * 0.925, 3.67, z, C.cyan);
      metal(0.1, 2.65, 0.08, x + side * 0.74, 1.95, z + 0.93, C.panel);
    }
    lightPool(x, z, 5, 0.24);
    solids.push({ x, z, hx: 1.1, hz: 1.1, c: 1, s: 0 });
  }

  // Armoured portals detailed on both faces for approach and arrival.
  const doors = [];
  function door(x, z, rotation, animated = false) {
    const root = new THREE.Group();
    root.position.set(x, 0, z);
    root.rotation.y = rotation;
    group.add(root);
    const frame = new BlockBatch(), lit = new BlockBatch();
    const fb = (...args) => block(frame, ...args);
    const fl = (...args) => block(lit, ...args, 0, 0, 0.008);
    for (const side of [-1, 1]) {
      const pocketX = side * (DOOR_HALF + POCKET_WIDTH / 2);
      // Hollow cassette: front/back skins, a roof and an outer end cap.
      // The mouth at the jamb is open; walls begin beyond the cassette.
      // Moving leaves are naturally occluded, including from the overhead view.
      for (const face of [-1, 1]) {
        fb(POCKET_WIDTH, 3.9, 0.18, pocketX, 1.95, face * 0.76, C.shell);
        fb(1.25, 2.65, 0.08, side * 4.35, 1.62, face * 0.89, C.dark);
        for (let i = 0; i < 3; i++) {
          fb(0.85, 0.055, 0.055, side * 4.35, 0.75 + i * 0.2, face * 0.96, C.panel);
        }
      }
      fb(POCKET_WIDTH, 0.22, 1.79, pocketX, 4.01, 0, C.edge);
      fb(0.22, 3.9, 1.79, side * (PORTAL_HALF - 0.11), 1.95, 0, C.shell);
      fb(0.22, 3.65, 1.85, side * (PORTAL_HALF - 0.12), 1.84, 0, C.edge);
      // Sloped shoulder skins stay outside the cavity too; a solid crosspiece
      // here would intersect the upper corners of a retracting leaf.
      for (const face of [-1, 1]) {
        fb(1.8, 0.62, 0.12, side * 2.85, 3.92, face * 0.87, C.edge, 0, side * -0.42);
        fb(0.4, 2.75, 0.13, side * 3.02, 1.65, face * 0.87, C.dark);
        fl(0.13, 2.35, 0.08, side * 3.02, 1.65, face * 0.95, C.cyan);
      }
    }
    fb(4.8, 0.65, 1.6, 0, 4.12, 0, C.shell);
    fb(4.5, 0.17, 1.7, 0, 4.53, 0, C.edge);
    fb(BAY_DOOR_GAP, 0.04, 1.7, 0, 0.015, 0, C.dark);
    // Continuous inset guide tracks connect the opening to both cassettes.
    for (const railZ of [-0.6, 0.6]) {
      fb(PORTAL_HALF * 2 - 0.3, 0.025, 0.055, 0, 0.038, railZ, C.edge);
    }
    for (const face of [-1, 1]) {
      fl(2.9, 0.1, 0.07, 0, 4.08, face * 0.84, C.cyan);
      fl(2.9, 0.08, 0.07, 0, 4.34, face * 0.84, C.cyan);
      for (let i = -4; i <= 4; i++) fl(0.16, 0.025, 0.22, i * 0.31, 0.085, face * 0.68, C.amber);
    }
    bake(frame, root);
    bake(lit, root, glowMaterial, false);
    const leaves = [];
    const leafW = BAY_DOOR_GAP / 2 - 0.05;
    for (const side of [-1, 1]) {
      const leaf = new THREE.Group(), batch = new BlockBatch();
      const lb = (...args) => block(batch, ...args);
      lb(leafW, 3.72, 0.44, 0, 1.91, 0, C.dark);
      for (const face of [-1, 1]) {
        lb(leafW - 0.18, 3.42, 0.12, 0, 1.93, face * 0.27, C.panel);
        // Layer the crossing braces, with the centre fastener above both.
        // Mirror the depth ordering on the rear face too.
        for (const slope of [-1, 1]) lb(2.05, 0.16, 0.09, 0, 1.94,
          face * (slope < 0 ? 0.39 : 0.45), C.edge, 0, slope * 0.64);
        lb(0.34, 0.48, 0.12, 0, 1.94, face * 0.55, C.shell);
        for (const y of [0.4, 3.45]) {
          lb(leafW - 0.24, 0.24, 0.09, 0, y, face * 0.36, C.dark);
          for (let i = 0; i < 7; i++) lb(0.14, 0.24, 0.025, -0.91 + i * 0.3, y, face * 0.42, C.amber, 0, -0.55, 0);
        }
      }
      bake(batch, leaf);
      root.add(leaf);
      leaves.push({ leaf, side });
    }
    // Travel only far enough to clear the mouth, with room inside the end cap.
    const travel = DOOR_HALF + 0.12;
    let phase = 'shut', t = 0, openness = 0, startAmount = 0;
    function amount(k) {
      openness = k;
      for (const { leaf, side } of leaves) {
        leaf.position.x = side * (BAY_DOOR_GAP / 4 + k * travel);
      }
    }
    amount(0);
    const ctrl = {
      root, x, z,
      open() { if (animated && phase !== 'open' && phase !== 'opening') { startAmount = openness; phase = 'opening'; t = 0; } },
      shut() { if (animated && phase !== 'shut' && phase !== 'slamming') { startAmount = openness; phase = 'slamming'; t = 0; } },
      snapShut() { phase = 'shut'; t = 0; amount(0); },
      get slammed() { return phase === 'shut'; },
      get isOpen() { return phase === 'open'; },
      get raising() { return phase === 'opening'; },
      get slamming() { return phase === 'slamming'; },
      update(dt) {
        if (phase !== 'opening' && phase !== 'slamming') return;
        t += dt;
        const opening = phase === 'opening';
        const k = Math.min(1, t / (opening ? 1.05 : 0.4));
        // Smooth acceleration and braking when opening; a heavier closing stroke.
        const eased = opening ? k * k * (3 - 2 * k) : k ** 3;
        amount(THREE.MathUtils.lerp(startAmount, opening ? 1 : 0, eased));
        if (k === 1) phase = opening ? 'open' : 'shut';
      },
    };
    doors.push(ctrl);
    return ctrl;
  }
  door(BAY_DOOR_X, ROOM2_NORTH, 0);
  door(ROOM2_WEST, ROOM2_CZ, Math.PI / 2);
  door(ROOM2_EAST, ROOM2_CZ, -Math.PI / 2);
  const southDoor = door(BAY_DOOR_X, ROOM2_SOUTH, 0, true);
  lightPool(BAY_CX, ROOM2_NORTH + 0.7, 5, 0.2);
  lightPool(BAY_CX, ROOM2_SOUTH - 0.7, 5, 0.2);
  lightPool(ROOM2_WEST + 0.7, ROOM2_CZ, 5, 0.2);
  lightPool(ROOM2_EAST - 0.7, ROOM2_CZ, 5, 0.2);

  // Machined octagonal dais. Dark reveals separate nested plates. Edge details
  // follow the actual chords (the old circular dashes floated off the corners).
  const platform = new THREE.Group();
  platform.position.set(BAY_CX, 0, ROOM2_CZ);
  group.add(platform);
  const matte = hex => new THREE.MeshStandardMaterial({ color: hex, roughness: 0.8, metalness: 0.22 });
  const plate = matte(C.panel), edge = matte(C.edge), dark = matte(C.dark);
  function oct(r, h, y, mat) {
    const m = model(platform, new THREE.CylinderGeometry(r, r, h, 8), mat, 0, y, 0);
    m.rotation.y = Math.PI / 8;
    m.receiveShadow = true;
    return m;
  }
  oct(OCT_R, 0.08, 0.04, dark);
  oct(OCT_R - 0.1, 0.045, 0.1, edge);
  oct(OCT_R - 0.22, 0.035, 0.14, plate);
  oct(4.3, 0.035, 0.175, dark);
  oct(4.16, 0.035, 0.21, plate);
  oct(3.67, 0.025, 0.24, dark);
  oct(3.61, 0.025, 0.265, matte(0x2b404f));
  const apothem = (OCT_R - 0.18) * Math.cos(Math.PI / 8);
  for (let i = 0; i < 8; i++) {
    const a = i * Math.PI / 4, dx = Math.cos(a), dz = Math.sin(a);
    for (let j = -4; j <= 4; j++) {
      const along = j * 0.34;
      metal(0.2, 0.018, 0.1, BAY_CX + dx * apothem - dz * along, 0.169,
        ROOM2_CZ + dz * apothem + dx * along, j % 2 ? C.dark : C.amber, -a + Math.PI / 2, 0, 0);
    }
  }
  for (const side of [-1, 1]) {
    const x = BAY_CX + side * 4.35;
    metal(0.78, 0.06, 1.9, x, 0.18, ROOM2_CZ, C.dark);
    for (let i = -5; i <= 5; i++) metal(0.64, 0.025, 0.045, x, 0.225, ROOM2_CZ + i * 0.15, C.edge);
    lamp(0.065, 0.025, 1.4, BAY_CX + side * 4.9, 0.17, ROOM2_CZ, C.cyan);
    lamp(1.6, 0.025, 0.07, BAY_CX, 0.17, ROOM2_CZ + side * 4.9, C.cyan);
  }

  // Six windings, dark insulated mast and a steel terminal sphere.
  const coil = new THREE.Group();
  coil.position.set(BAY_CX, 0, ROOM2_CZ);
  group.add(coil);
  const coilMetal = new THREE.MeshStandardMaterial({ color: 0x718b9c, metalness: 0.65, roughness: 0.32 });
  const base = model(coil, new THREE.CylinderGeometry(1.16, 1.3, 0.38, 8), dark, 0, 0.47, 0);
  base.rotation.y = Math.PI / 8;
  base.castShadow = true;
  model(coil, new THREE.CylinderGeometry(0.72, 0.92, 0.28, 12), coilMetal, 0, 0.79, 0);
  const mast = model(coil, new THREE.CylinderGeometry(0.38, 0.46, 2.65, 20), dark, 0, 2.22, 0);
  mast.castShadow = true;
  const winding = new THREE.MeshStandardMaterial({ color: 0x135968, emissive: 0x29d6e9,
    emissiveIntensity: 0.65, roughness: 0.4, metalness: 0.35 });
  for (let i = 0; i < 6; i++) {
    const y = 1.15 + i * 0.39;
    const collar = model(coil, new THREE.TorusGeometry(0.54, 0.075, 8, 32), coilMetal, 0, y - 0.06, 0);
    collar.rotation.x = Math.PI / 2;
    const ring = model(coil, new THREE.TorusGeometry(0.55, 0.035, 6, 32), winding, 0, y, 0);
    ring.rotation.x = Math.PI / 2;
  }
  model(coil, new THREE.CylinderGeometry(0.39, 0.52, 0.25, 16), coilMetal, 0, 3.55, 0);
  const ballMat = new THREE.MeshStandardMaterial({ color: 0x9eb6c7, metalness: 0.6, roughness: 0.25 });
  const ball = model(coil, new THREE.SphereGeometry(0.83, 28, 20), ballMat, 0, 4.08, 0);
  ball.castShadow = true;
  for (let i = 0; i < 8; i++) {
    const a = i * Math.PI / 4;
    const accent = box(coil, cyanLight, Math.cos(a) * 1.13, 0.52, Math.sin(a) * 1.13, 0.45, 0.1, 0.05);
    accent.rotation.y = Math.PI / 2 - a;
  }
  solids.push({ x: BAY_CX, z: ROOM2_CZ, hx: 1.3, hz: 1.3, c: 1, s: 0 });
  const coilGlow = halo(coil, C.cyan, 0, 2.4, 0, 3, 0.13);
  model(platform, new THREE.RingGeometry(0.23, 0.29, 32), cyanLight, 0, 0.29, 1.75).rotation.x = -Math.PI / 2;

  const stencil = document.createElement('canvas');
  stencil.width = 1024; stencil.height = 256;
  const ctx = stencil.getContext('2d');
  ctx.fillStyle = '#8299a6'; ctx.textAlign = 'center';
  ctx.font = '600 130px monospace'; ctx.fillText('02', 512, 135);
  ctx.font = '500 36px monospace'; ctx.fillText('D E F E N C E   B A Y', 512, 208);
  const tex = new THREE.CanvasTexture(stencil);
  tex.colorSpace = THREE.SRGBColorSpace;
  const label = model(group, new THREE.PlaneGeometry(7.5, 1.875), new THREE.MeshBasicMaterial({
    map: tex, transparent: true, opacity: 0.52, depthWrite: false }), BAY_CX + 5.5, 0.008, ROOM2_SOUTH - 4.6);
  label.rotation.x = -Math.PI / 2;

  bake(architecture);
  bake(lamps, group, glowMaterial, false);
  // Two local lights instead of the previous six; no added shadow maps.
  const coreLight = new THREE.PointLight(C.cyan, 30, 10, 2);
  coreLight.position.set(BAY_CX, 2.4, ROOM2_CZ);
  const entryLight = new THREE.PointLight(C.cyan, 22, 10, 2);
  entryLight.position.set(BAY_CX, 2, ROOM2_SOUTH - 1.4);
  group.add(coreLight, entryLight);
  let time = 0;
  return { group, solids, coil, southDoor,
    update(dt) {
      for (const d of doors) d.update(dt);
      time += dt;
      const pulse = reducedMotion?.matches ? 0 : Math.sin(time * 1.8);
      winding.emissiveIntensity = 0.65 + pulse * 0.12;
      coilGlow.material.opacity = 0.13 + pulse * 0.025;
      coreLight.intensity = 30 + pulse * 3;
    },
  };
}
