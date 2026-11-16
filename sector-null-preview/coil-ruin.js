import * as THREE from 'three';

// A bounded, reusable set of meshes: no particles or lights accumulate over waves.
export function createCoilRuin({ scene, bay, reducedMotion, onWarning, onImpact, onDestroyed, hurt }) {
  const centre = bay.coil.position.clone();
  const radius = 3.8;
  const root = new THREE.Group();
  root.position.copy(centre);
  scene.add(root);
  const ring = new THREE.Mesh(new THREE.RingGeometry(radius - 0.12, radius, 64),
    new THREE.MeshBasicMaterial({ color: 0xffb347, side: THREE.DoubleSide, transparent: true, opacity: 0.9, depthWrite: false }));
  ring.rotation.x = -Math.PI / 2; ring.position.y = 0.32; root.add(ring);
  const burn = new THREE.Mesh(new THREE.CircleGeometry(radius - 0.12, 48),
    new THREE.MeshBasicMaterial({ color: 0x521c0b, transparent: true, opacity: 0.8, depthWrite: false }));
  burn.rotation.x = -Math.PI / 2; burn.position.y = 0.31; root.add(burn);
  const flames = new THREE.Group(); root.add(flames);
  const flameGeo = new THREE.ConeGeometry(0.4, 1, 5);
  const flameMat = new THREE.MeshBasicMaterial({ color: 0xff8b26, transparent: true, opacity: 0.8 });
  for (let i = 0; i < 22; i++) {
    const angle = i * 2.39996, r = 0.65 + (i % 6) * 0.48;
    const flame = new THREE.Mesh(flameGeo, flameMat);
    flame.position.set(Math.cos(angle) * r, 0.5, Math.sin(angle) * r);
    flames.add(flame);
  }
  const wreck = new THREE.Group(); root.add(wreck);
  const scrapMat = new THREE.MeshStandardMaterial({ color: 0x282a2b, roughness: 1 });
  for (let i = 0; i < 6; i++) {
    const scrap = new THREE.Mesh(new THREE.BoxGeometry(0.45, 0.45, 1.5), scrapMat);
    scrap.position.set(Math.cos(i) * 1.5, 0.3, Math.sin(i) * 1.5);
    scrap.rotation.set(0.25 * i, i, 0.3); wreck.add(scrap);
  }
  const rockets = [];
  for (let i = 0; i < 3; i++) {
    const mesh = new THREE.Group();
    const body = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.12, 0.7, 8), scrapMat);
    body.rotation.x = Math.PI / 2; mesh.add(body);
    const tip = new THREE.Mesh(new THREE.ConeGeometry(0.13, 0.3, 8), flameMat);
    tip.rotation.x = Math.PI / 2; tip.position.z = 0.5; mesh.add(tip);
    scene.add(mesh); mesh.visible = false;
    rockets.push({ mesh, from: new THREE.Vector3(), hit: false });
  }
  let phase = 'idle', t = 0, heat = 0, cooldown = 0;
  function reset() {
    phase = 'idle'; t = heat = cooldown = 0; root.visible = false;
    bay.coil.visible = true; bay.coilWeapon.destroyed = false;
    for (const rocket of rockets) { rocket.mesh.visible = false; rocket.hit = false; }
  }
  function destroy(silent = false) {
    phase = 'burning'; heat = 1.2; t = 0;
    root.visible = burn.visible = flames.visible = wreck.visible = true;
    bay.coil.visible = false; bay.coilWeapon.destroyed = true;
    bay.coilWeapon.setCharge(0);
    rockets.forEach(r => { r.mesh.visible = false; });
    if (!silent) onDestroyed(centre.clone());
  }
  function start(boss) {
    if (phase !== 'idle') return;
    phase = 'volley'; t = 0; root.visible = true;
    burn.visible = flames.visible = wreck.visible = false;
    rockets.forEach((r, i) => {
      r.from.copy(boss.position); r.from.y = 2.4;
      r.from.x += (i - 1) * 0.35;
    });
    onWarning();
  }
  function update(dt, active, player) {
    if (!active || phase === 'idle') return;
    t += dt;
    if (phase === 'volley') {
      ring.material.opacity = reducedMotion.matches ? 0.9 : 0.65 + Math.sin(t * 8) * 0.25;
      rockets.forEach((r, i) => {
        const progress = (t - 1.0 - i * 0.28) / 1.0;
        if (progress < 0 || r.hit) return;
        if (progress >= 1) {
          r.hit = true; r.mesh.visible = false; onImpact(bay.coilTip.clone()); return;
        }
        r.mesh.visible = true;
        r.mesh.position.lerpVectors(r.from, bay.coilTip, progress);
        r.mesh.position.y += Math.sin(progress * Math.PI) * 2;
        r.mesh.lookAt(bay.coilTip);
      });
      if (t >= 3.1) destroy();
    } else {
      ring.material.opacity = 0.95;
      heat = Math.max(0, heat - dt); cooldown = Math.max(0, cooldown - dt);
      flames.children.forEach((flame, i) => {
        const h = reducedMotion.matches ? 1.5 : 1.4 + 0.65 * Math.sin(t * 4 + i * 1.7);
        flame.scale.y = h; flame.position.y = 0.3 + h * 0.5;
      });
      if (heat <= 0 && cooldown <= 0 && Math.hypot(player.position.x - centre.x, player.position.z - centre.z) < radius) {
        if (hurt()) cooldown = 1.5;
      }
    }
  }
  reset();
  return { reset, start, destroy, update, get phase() { return phase; } };
}
