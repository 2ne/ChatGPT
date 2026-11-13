import * as THREE from 'three';

/**
 * Shared Helper Bot mesh for upgrade-card icons and the in-game companion.
 * Barrels aim along local +Z. Card icons face the camera; in-game callers should
 * aim +Z at the target (lookAt then rotateY(π), since Object3D.lookAt uses −Z).
 *
 * @param {'base'|'twin'|'bomb'} variant
 * @param {{ rank?: number, detail?: 'card'|'game' }} [opts]
 *   rank — visual growth (1+); detail — poly budget (game is leaner for mobile)
 * @returns {THREE.Group} root with userData.muzzles (Object3D[]), .pulse, .variant
 */
export function createHelperBotMesh(variant = 'base', opts = {}) {
  const rank = Math.max(1, opts.rank ?? 1);
  const owned = rank - 1;
  const detail = opts.detail === 'card' ? 'card' : 'game';
  const coreSeg = detail === 'card' ? [20, 16] : [14, 12];
  const plateSeg = detail === 'card' ? [16, 10] : [12, 8];
  const cylSeg = detail === 'card' ? 10 : 8;

  const g = new THREE.Group();
  const lav = std(0xe6dced, {
    metalness: 0.12, roughness: 0.38, emissive: 0xb8a8c8, emissiveIntensity: 0.08,
  });
  const coreMat = std(0x2a323c, { metalness: 0.72, roughness: 0.32 });
  const violet = glow(0xb44fff, 1.35);
  const cyan = glow(0x45ecff, 1.55);
  const blue = glow(0x4aa8ff, 1.4);
  const gun = std(0x3a4450, { metalness: 0.78, roughness: 0.28 });

  g.add(new THREE.Mesh(new THREE.SphereGeometry(0.42, ...coreSeg), coreMat));
  const band = new THREE.Mesh(
    new THREE.TorusGeometry(0.4, 0.035, 6, detail === 'card' ? 28 : 20),
    std(0x1c222a, { metalness: 0.65, roughness: 0.4 })
  );
  band.rotation.x = Math.PI / 2;
  g.add(band);

  const R = 0.56;
  const gapPhi = 0.36;
  const gapTheta = 0.1;
  const halves = [
    { phi: Math.PI * 0.5 + gapPhi * 0.5, phiLen: Math.PI - gapPhi },
    { phi: Math.PI * 1.5 + gapPhi * 0.5, phiLen: Math.PI - gapPhi },
  ];
  const bands = [
    { theta: gapTheta, thetaLen: Math.PI * 0.5 - gapTheta * 1.15, top: true },
    { theta: Math.PI * 0.5 + gapTheta * 0.15, thetaLen: Math.PI * 0.5 - gapTheta * 1.15, top: false },
  ];
  halves.forEach((h) => {
    bands.forEach((b) => {
      g.add(new THREE.Mesh(
        new THREE.SphereGeometry(R, plateSeg[0], plateSeg[1], h.phi, h.phiLen, b.theta, b.thetaLen),
        lav
      ));
      const midPhi = h.phi + h.phiLen * 0.5;
      const midTheta = b.theta + b.thetaLen * (b.top ? 0.55 : 0.72);
      const pr = R * 0.94;
      const inset = new THREE.Mesh(
        b.top ? new THREE.BoxGeometry(0.15, 0.11, 0.028) : new THREE.BoxGeometry(0.17, 0.04, 0.028),
        violet
      );
      inset.position.set(
        -Math.cos(midPhi) * Math.sin(midTheta) * pr,
        Math.cos(midTheta) * pr,
        Math.sin(midPhi) * Math.sin(midTheta) * pr,
      );
      inset.lookAt(0, 0, 0);
      g.add(inset);
    });
  });

  const topLight = new THREE.Mesh(new THREE.BoxGeometry(0.07, 0.07, 0.04), blue);
  topLight.position.set(0, 0.48, 0.06);
  g.add(topLight);

  const muzzles = [];

  if (variant === 'twin') {
    [-0.11, 0.11].forEach((x) => {
      const barrel = new THREE.Mesh(
        new THREE.CylinderGeometry(0.055, 0.065, 0.38 + owned * 0.04, cylSeg),
        gun
      );
      barrel.rotation.x = Math.PI / 2;
      barrel.position.set(x, 0.02, 0.58);
      g.add(barrel);
      const tip = new THREE.Mesh(
        new THREE.SphereGeometry(0.035, 8, 6),
        cyan
      );
      tip.position.set(x, 0.02, 0.79 + owned * 0.02);
      g.add(tip);
      muzzles.push(tip);
      if (!g.userData.pulse) g.userData.pulse = tip;
    });
    [-0.08, 0.08].forEach((x) => {
      const led = new THREE.Mesh(new THREE.BoxGeometry(0.05, 0.025, 0.02), cyan);
      led.position.set(x, 0.14, 0.5);
      g.add(led);
    });
    g.userData.rapid = owned >= 1;
  } else if (variant === 'bomb') {
    const bore = 0.14 + owned * 0.03;
    const barrel = new THREE.Mesh(
      new THREE.CylinderGeometry(bore, bore + 0.02, 0.42, detail === 'card' ? 14 : 10),
      gun
    );
    barrel.rotation.x = Math.PI / 2;
    barrel.position.set(0, 0.02, 0.58);
    g.add(barrel);
    for (const z of [0.48, 0.62]) {
      const ring = new THREE.Mesh(new THREE.TorusGeometry(bore + 0.04, 0.018, 6, 14), violet);
      ring.position.set(0, 0.02, z);
      g.add(ring);
    }
    const tip = new THREE.Mesh(
      new THREE.SphereGeometry(0.08 + owned * 0.02, 10, 8),
      violet
    );
    tip.position.set(0, 0.02, 0.82);
    g.add(tip);
    muzzles.push(tip);
    g.userData.pulse = tip;
  } else {
    const barrel = new THREE.Mesh(
      new THREE.CylinderGeometry(0.055, 0.07, 0.4, cylSeg),
      gun
    );
    barrel.rotation.x = Math.PI / 2;
    barrel.position.set(0, 0.02, 0.58);
    g.add(barrel);
    const tip = new THREE.Mesh(
      new THREE.SphereGeometry(0.045 + rank * 0.01, 8, 6),
      cyan
    );
    tip.position.set(0, 0.02, 0.81);
    g.add(tip);
    muzzles.push(tip);
    g.userData.pulse = tip;
  }

  g.userData.muzzles = muzzles;
  g.userData.variant = variant;
  g.userData.rank = rank;
  return g;
}

/** Dispose geometries/materials under a helper mesh (safe to call on swap). */
export function disposeHelperBotMesh(root) {
  if (!root) return;
  root.traverse((obj) => {
    if (obj.geometry) obj.geometry.dispose();
    const mats = obj.material;
    if (!mats) return;
    for (const m of Array.isArray(mats) ? mats : [mats]) m.dispose();
  });
}

function std(color, opts = {}) {
  return new THREE.MeshStandardMaterial({
    color, roughness: 0.42, metalness: 0.45, ...opts,
  });
}

function glow(color, intensity = 1.2) {
  return new THREE.MeshStandardMaterial({
    color, emissive: color, emissiveIntensity: intensity,
    roughness: 0.25, metalness: 0.15,
  });
}
