import * as THREE from 'three';
import { UPGRADE_CATS } from './upgrades.js';
import { createHelperBotMesh } from './helper-bot-mesh.js';

const CAT_COLORS = UPGRADE_CATS;

// Full orbit hides the face of these icons — sway ±20° instead.
const SWAY_IDS = new Set(['bot', 'botGun', 'botBomb', 'magnet', 'luck', 'mag', 'coil']);
const SWAY_ANGLE = 20 * Math.PI / 180;

// Same basis as game.js tracers: lookAt aims local -Z forward.
const _aimFwd = new THREE.Vector3(0, 0, -1);
const _tmpDir = new THREE.Vector3();

function hex(c) {
  return new THREE.Color(c);
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

function addBox(parent, mat, w, h, d, x = 0, y = 0, z = 0) {
  const m = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), mat);
  m.position.set(x, y, z);
  m.castShadow = true;
  parent.add(m);
  return m;
}

function addShadowGround(root) {
  const ground = new THREE.Mesh(
    new THREE.PlaneGeometry(4.5, 4.5),
    new THREE.ShadowMaterial({ opacity: 0.28 })
  );
  ground.rotation.x = -Math.PI / 2;
  ground.position.y = -0.5;
  ground.receiveShadow = true;
  root.add(ground);
  return ground;
}

/** Soft radial falloff matching ShadowMaterial + VSM dither (shared by gem blobs). */
let _softShadowMap = null;
function softShadowMap() {
  if (_softShadowMap) return _softShadowMap;
  const size = 64;
  const c = document.createElement('canvas');
  c.width = c.height = size;
  const ctx = c.getContext('2d');
  const g = ctx.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2);
  // Peak ~halfway between barely-there map shadows and solid black discs.
  g.addColorStop(0, 'rgba(0,0,0,0.40)');
  g.addColorStop(0.35, 'rgba(0,0,0,0.28)');
  g.addColorStop(0.7, 'rgba(0,0,0,0.10)');
  g.addColorStop(1, 'rgba(0,0,0,0)');
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, size, size);
  _softShadowMap = new THREE.CanvasTexture(c);
  _softShadowMap.colorSpace = THREE.NoColorSpace;
  _softShadowMap.userData.shared = true;
  return _softShadowMap;
}

function enableCast(root) {
  root.traverse(obj => {
    if (obj.isMesh) {
      obj.castShadow = true;
      obj.receiveShadow = false;
    }
  });
}

/** Card-icon Helper Bot — shared mesh with the in-game companion. */
function helperBot(variant = 'base', owned = 0) {
  const g = createHelperBotMesh(variant, { rank: owned + 1, detail: 'card' });
  g.scale.setScalar(0.95 + (owned + 1) * 0.04);
  return g;
}

function mineBody(shock = false, owned = 0) {
  const g = new THREE.Group();
  const accent = shock ? 0x70dfb8 : 0xa7a1ff;
  const next = owned + 1;
  const body = new THREE.Mesh(
    new THREE.CylinderGeometry(0.38 + next * 0.04, 0.5 + next * 0.05, 0.22, 8),
    glow(accent, shock ? 1.3 : 0.55 + next * 0.2)
  );
  g.add(body);
  const cap = new THREE.Mesh(new THREE.CylinderGeometry(0.22, 0.28, 0.1, 8), std(0x1a2230, { metalness: 0.7 }));
  cap.position.y = 0.14;
  g.add(cap);
  for (let i = 0; i < 4; i++) {
    const fin = addBox(g, std(0x2a3344), 0.08, 0.06, 0.55, 0, 0.02, 0);
    fin.rotation.y = (i / 4) * Math.PI * 2;
    fin.position.set(Math.sin(fin.rotation.y) * 0.35, 0.02, Math.cos(fin.rotation.y) * 0.35);
  }
  if (shock) {
    const arcs = new THREE.Group();
    for (let i = 0; i < 3; i++) {
      const arc = new THREE.Mesh(
        new THREE.TorusGeometry(0.55 + i * 0.12, 0.018, 6, 24, Math.PI * 1.2),
        glow(0x9af5ff, 2)
      );
      arc.rotation.set(0.4 + i * 0.3, i * 1.1, i * 0.5);
      arcs.add(arc);
    }
    g.add(arcs);
    g.userData.arcs = arcs;
  }
  const spike = addBox(g, std(0xd8dee8, { metalness: 0.8 }), 0.06, 0.45, 0.06, 0, 0.35, 0);
  g.userData.spike = spike;
  return g;
}

function rifleBase() {
  const g = new THREE.Group();
  // Card-only mesh (not the in-game rifle) — lifted steel so it reads on dark card backs.
  const body = std(0x8aa4b6, { emissive: 0x243848, emissiveIntensity: 0.22 });
  const metal = std(0xc2d4e0, { metalness: 0.62, roughness: 0.34, emissive: 0x2a4050, emissiveIntensity: 0.12 });
  addBox(g, body, 0.22, 0.28, 0.55, 0, 0, -0.15);
  addBox(g, metal, 0.16, 0.18, 0.7, 0, 0.04, 0.35);
  addBox(g, metal, 0.1, 0.1, 0.55, 0, 0.05, 0.9);
  addBox(g, body, 0.18, 0.16, 0.32, 0, -0.05, 0.55);
  const grip = addBox(g, body, 0.14, 0.32, 0.16, 0, -0.22, 0.05);
  grip.rotation.x = 0.35;
  return g;
}

function makeTracer() {
  const g = new THREE.Group();
  const core = new THREE.Mesh(
    new THREE.BoxGeometry(1, 1, 1),
    new THREE.MeshBasicMaterial({
      color: 0xe1fcff, transparent: true, opacity: 1,
      blending: THREE.AdditiveBlending, depthWrite: false, toneMapped: false,
    })
  );
  core.scale.set(0.05, 0.05, 0.9);
  core.position.z = -0.35;
  const aura = new THREE.Mesh(
    new THREE.BoxGeometry(1, 1, 1),
    new THREE.MeshBasicMaterial({
      color: 0x62edff, transparent: true, opacity: 0.45,
      blending: THREE.AdditiveBlending, depthWrite: false, toneMapped: false,
    })
  );
  aura.scale.set(0.15, 0.15, 1.05);
  aura.position.z = -0.42;
  g.add(aura, core);
  g.userData.aura = aura;
  return g;
}

function shieldPlate(color, scale = 1) {
  const shape = new THREE.Shape();
  shape.moveTo(0, 0.9);
  shape.lineTo(0.62, 0.55);
  shape.lineTo(0.55, -0.35);
  shape.quadraticCurveTo(0, -0.85, -0.55, -0.35);
  shape.lineTo(-0.62, 0.55);
  shape.closePath();
  const geo = new THREE.ExtrudeGeometry(shape, {
    depth: 0.12, bevelEnabled: true, bevelThickness: 0.03, bevelSize: 0.03, bevelSegments: 2,
  });
  geo.center();
  const mesh = new THREE.Mesh(geo, std(color, {
    metalness: 0.55, roughness: 0.25,
    emissive: hex(color), emissiveIntensity: 0.35,
    transparent: true, opacity: 0.92,
  }));
  mesh.scale.setScalar(scale);
  return mesh;
}

function gemCrystal(color = 0x7cff4a, s = 1) {
  const mesh = new THREE.Mesh(
    new THREE.OctahedronGeometry(0.28, 0).scale(0.72, 1.25, 0.72),
    new THREE.MeshPhysicalMaterial({
      color, emissive: color, emissiveIntensity: 0.55,
      metalness: 0.15, roughness: 0.12, transmission: 0.35,
      thickness: 0.4, transparent: true, opacity: 0.95,
    })
  );
  mesh.scale.multiplyScalar(s);
  return mesh;
}

const builders = {
  bot: (owned = 0) => helperBot('base', owned),
  botGun: (owned = 0) => helperBot('twin', owned),
  botBomb: (owned = 0) => helperBot('bomb', owned),
  mine: (owned = 0) => mineBody(false, owned),
  shock: () => mineBody(true, 0),
  damage(owned = 0) {
    const g = rifleBase();
    const next = owned + 1;
    const amp = new THREE.Mesh(new THREE.SphereGeometry(0.18 + next * 0.035, 16, 12), glow(0xffad61, 1.4 + next * 0.2));
    amp.position.set(0, 0.08, 1.15);
    g.add(amp);
    const ring = new THREE.Mesh(new THREE.TorusGeometry(0.26 + next * 0.03, 0.035, 8, 24), glow(0xffad61, 1.2));
    ring.position.copy(amp.position);
    ring.rotation.y = Math.PI / 2;
    g.add(ring);
    g.userData.pulse = amp;
    g.userData.ring = ring;
    return g;
  },
  rate(owned = 0) {
    const g = rifleBase();
    const rotor = new THREE.Group();
    rotor.position.set(0, 0.05, 0.95);
    for (let i = 0; i < 4; i++) {
      const barrel = addBox(rotor, std(0x9ab0c0, { metalness: 0.8 }), 0.09, 0.09, 0.55, 0, 0.16, 0.1);
      barrel.rotation.z = (i / 4) * Math.PI * 2;
      barrel.position.set(Math.sin(barrel.rotation.z) * 0.16, Math.cos(barrel.rotation.z) * 0.16, 0.1);
    }
    g.add(rotor);
    g.userData.rotor = rotor;
    g.userData.rotorSpeed = 5 + owned * 3;
    return g;
  },
  pierce(owned = 0) {
    const g = new THREE.Group();
    const plateColors = [0x334455, 0x3a4d60, 0x455868, 0x506375];
    const plates = [];
    for (let i = 0; i <= owned; i++) {
      plates.push(addBox(g, std(plateColors[i] || 0x506375), 0.08, 0.7, 0.55, -0.45 + i * 0.35, 0, 0.05 + i * 0.12));
    }
    const spike = new THREE.Mesh(new THREE.ConeGeometry(0.12, 1.5 + owned * 0.15, 6), glow(0xffad61, 1.5));
    spike.rotation.z = -Math.PI / 2;
    spike.position.set(0.05, 0, 0.2);
    g.add(spike);
    g.userData.spike = spike;
    g.userData.plates = plates;
    return g;
  },
  spread(owned = 0) {
    const g = rifleBase();
    const muzzle = new THREE.Object3D();
    muzzle.position.set(0, 0.05, 1.18);
    g.add(muzzle);
    const flash = new THREE.Mesh(
      new THREE.SphereGeometry(0.08, 10, 8),
      new THREE.MeshBasicMaterial({
        color: 0xe1fcff, transparent: true, opacity: 0,
        blending: THREE.AdditiveBlending, depthWrite: false, toneMapped: false,
      })
    );
    muzzle.add(flash);
    const count = 2 + owned;
    const beams = [];
    for (let k = 0; k < count; k++) {
      const a = (k - (count - 1) / 2) * 0.13;
      const dir = new THREE.Vector3(-Math.sin(a), 0, Math.cos(a));
      const beam = makeTracer();
      g.add(beam);
      beams.push({ mesh: beam, dir });
    }
    g.userData.split = { muzzle, flash, beams, cycle: 0 };
    return g;
  },
  mag(owned = 0) {
    const g = new THREE.Group();
    addBox(g, std(0x2a3d4c, { metalness: 0.6 }), 0.55, 0.95, 0.35);
    const lit = Math.min(5, owned + 1);
    for (let i = 0; i < 5; i++) {
      const on = i < lit;
      addBox(
        g,
        on ? glow(0x76bcf0, 0.9 + i * 0.15) : std(0x1a2430),
        0.42, 0.09, 0.08, 0, -0.32 + i * 0.18, 0.2
      );
    }
    addBox(g, std(0x8aa0b0, { metalness: 0.8 }), 0.58, 0.1, 0.38, 0, 0.52, 0);
    return g;
  },
  reload() {
    const g = new THREE.Group();
    const cradle = addBox(g, std(0x314455), 0.9, 0.18, 0.45, 0, -0.35, 0);
    const cellA = addBox(g, glow(0x76bcf0, 1), 0.32, 0.55, 0.22, -0.28, 0.05, 0);
    const cellB = addBox(g, std(0x1c2a36), 0.32, 0.55, 0.22, 0.35, 0.35, 0);
    cellB.rotation.z = 0.5;
    g.userData.swap = { cellA, cellB, cradle };
    return g;
  },
  regen() {
    const g = new THREE.Group();
    const shield = shieldPlate(0x70dfb8, 0.95);
    g.add(shield);
    const ring = new THREE.Mesh(new THREE.TorusGeometry(0.95, 0.04, 8, 40), glow(0x70dfb8, 1.4));
    ring.rotation.x = Math.PI / 2;
    g.add(ring);
    g.userData.ring = ring;
    g.userData.shield = shield;
    return g;
  },
  pulse(owned = 0) {
    const g = new THREE.Group();
    g.add(shieldPlate(0x70dfb8, 0.85));
    const count = owned + 1;
    const waves = Array.from({ length: count }, (_, i) => {
      const ring = new THREE.Mesh(
        new THREE.TorusGeometry(0.65 + i * 0.28, 0.03, 6, 40),
        new THREE.MeshBasicMaterial({ color: 0x9af5ff, transparent: true, opacity: 0.55 - i * 0.12 })
      );
      ring.rotation.x = Math.PI / 2;
      g.add(ring);
      return ring;
    });
    g.userData.waves = waves;
    return g;
  },
  hp(owned = 0) {
    const g = new THREE.Group();
    const layers = Math.min(4, owned + 2);
    for (let i = 0; i < layers; i++) {
      const p = shieldPlate(i === layers - 1 ? 0x9af5ff : 0x70dfb8, 0.8 - i * 0.04);
      p.position.z = -0.22 + i * 0.18;
      p.position.x = i * 0.06;
      g.add(p);
    }
    return g;
  },
  speed(owned = 0) {
    const g = new THREE.Group();
    const hub = new THREE.Mesh(new THREE.CylinderGeometry(0.28, 0.34, 0.35, 12), std(0x3a5162, { metalness: 0.7 }));
    hub.rotation.z = Math.PI / 2;
    g.add(hub);
    const jets = [-0.28, 0.28].map(y => {
      const jet = new THREE.Mesh(new THREE.ConeGeometry(0.16, 0.55, 10), glow(0x70dfb8, 1.6));
      jet.rotation.z = Math.PI / 2;
      jet.position.set(-0.45, y, 0);
      g.add(jet);
      return jet;
    });
    const flame = new THREE.Mesh(new THREE.ConeGeometry(0.18 + owned * 0.04, 0.65 + owned * 0.12, 10), glow(0x9af5ff, 2));
    flame.rotation.z = -Math.PI / 2;
    flame.position.set(0.55, 0, 0);
    g.add(flame);
    g.userData.jets = jets;
    g.userData.flame = flame;
    return g;
  },
  heal() {
    const g = new THREE.Group();
    const shield = shieldPlate(0xff708c, 0.9);
    g.add(shield);
    const plus = new THREE.Group();
    addBox(plus, glow(0xffb0c4, 1.8), 0.16, 0.55, 0.12);
    addBox(plus, glow(0xffb0c4, 1.8), 0.55, 0.16, 0.12);
    plus.position.z = 0.2;
    g.add(plus);
    g.userData.plus = plus;
    return g;
  },
  luck(owned = 0) {
    const g = new THREE.Group();
    const count = owned + 1;
    const metal = std(0xd8dee8, { metalness: 0.9, roughness: 0.18 });
    const slots = [
      { x: 0, y: 0.08, z: 0, rz: 0.12 },
      { x: 0.58, y: 0.02, z: 0.1, rz: -0.28 },
      { x: -0.58, y: 0.04, z: 0.08, rz: 0.32 },
    ];

    function powerDots() {
      const charge = new THREE.Group();
      const specs = [
        [0, 0.02, 0, 0.028],
        [0.07, 0.12, 0.04, 0.018],
        [-0.06, 0.1, -0.03, 0.016],
        [0.05, -0.1, -0.04, 0.02],
        [-0.07, -0.12, 0.03, 0.015],
        [0.02, 0.18, -0.02, 0.014],
        [-0.03, -0.18, 0.02, 0.014],
        [0.08, 0, -0.05, 0.013],
        [-0.08, 0.02, 0.05, 0.013],
        [0.04, 0.06, -0.06, 0.011],
        [-0.05, -0.05, 0.06, 0.011],
        [0.01, -0.14, -0.05, 0.01],
        [-0.02, 0.15, 0.05, 0.01],
        [0.06, 0.2, 0.02, 0.012],
        [-0.04, 0.22, -0.04, 0.011],
        [0.09, 0.08, 0.01, 0.012],
        [-0.09, 0.14, 0.02, 0.01],
        [0.03, -0.02, 0.07, 0.013],
        [-0.01, 0.05, -0.08, 0.012],
        [0.1, -0.08, 0.03, 0.011],
        [-0.1, -0.06, -0.02, 0.012],
        [0.06, -0.2, 0.04, 0.011],
        [-0.05, -0.22, -0.03, 0.01],
        [0.0, 0.09, 0.06, 0.012],
        [0.0, -0.08, -0.06, 0.011],
        [0.05, 0.0, 0.0, 0.01],
        [-0.04, 0.0, 0.0, 0.01],
        [0.02, 0.25, 0.0, 0.009],
        [-0.02, -0.25, 0.0, 0.009],
        [0.07, -0.15, -0.05, 0.01],
        [-0.08, 0.18, 0.04, 0.01],
      ];
      const fizzColors = [0x76bcf0, 0xffa64c, 0xff78b5];
      const dots = specs.map(([x, y, z, r], i) => {
        const mat = new THREE.MeshBasicMaterial({
          color: fizzColors[i % 3],
          transparent: true,
          opacity: 0.95,
          blending: THREE.AdditiveBlending,
          depthWrite: false,
          depthTest: false,
          toneMapped: false,
        });
        const dot = new THREE.Mesh(new THREE.SphereGeometry(r, 10, 8), mat);
        dot.position.set(x, y, z);
        dot.userData.phase = i * 0.7;
        dot.userData.base = r;
        charge.add(dot);
        return dot;
      });
      charge.userData.dots = dots;
      return charge;
    }

    function powerCell() {
      const cell = new THREE.Group();
      const glass = new THREE.MeshPhysicalMaterial({
        color: 0xc8b8ff,
        emissive: 0xbdadfa,
        emissiveIntensity: 0.3,
        metalness: 0.05,
        roughness: 0.08,
        transmission: 0.55,
        thickness: 0.35,
        transparent: true,
        opacity: 0.5,
        clearcoat: 1,
        clearcoatRoughness: 0.05,
        ior: 1.45,
        side: THREE.DoubleSide,
      });
      const body = new THREE.Mesh(new THREE.CylinderGeometry(0.22, 0.22, 0.58, 28), glass);
      const capGeo = new THREE.CylinderGeometry(0.235, 0.235, 0.1, 28);
      const top = new THREE.Mesh(capGeo, metal);
      top.position.y = 0.34;
      const bot = new THREE.Mesh(capGeo, metal);
      bot.position.y = -0.34;
      const charge = powerDots();
      cell.add(body, top, bot, charge);
      cell.userData.charge = charge;
      return cell;
    }

    const cells = [];
    for (let i = 0; i < count; i++) {
      const cell = powerCell();
      const S = slots[i];
      cell.position.set(S.x, S.y, S.z);
      cell.rotation.z = S.rz;
      cell.userData.phase = i * 1.3;
      cell.userData.baseY = S.y;
      g.add(cell);
      cells.push(cell);
    }
    g.userData.cells = cells;
    return g;
  },
  magnet() {
    const g = new THREE.Group();
    const defs = [
      [0, 0.35, 0, 1],
      [-0.7, 0.05, 0.2, 0.62],
      [0.7, 0.05, 0.2, 0.62],
    ];
    const gems = defs.map(([x, y, z, s]) => {
      const gem = gemCrystal(0x7cff4a, s);
      gem.position.set(x, y, z);
      gem.userData.gemScale = s;
      g.add(gem);
      return gem;
    });
    // Soft feathered blobs per gem (map shadows only read the centre clearly).
    const map = softShadowMap();
    const gemShadows = defs.map(([x, , z, s]) => {
      const disc = new THREE.Mesh(
        new THREE.CircleGeometry(0.42 * s, 24),
        new THREE.MeshBasicMaterial({
          map,
          transparent: true,
          opacity: 0.9,
          depthWrite: false,
          toneMapped: false,
        })
      );
      disc.rotation.x = -Math.PI / 2;
      disc.position.set(x, -0.58, z);
      disc.renderOrder = -1;
      g.add(disc);
      return disc;
    });
    g.userData.gems = gems;
    g.userData.gemShadows = gemShadows;
    return g;
  },
  /** Defence Bay Tesla coil — silhouette matches room-2 (defence-bay.js), simplified for card size. */
  coil(owned = 0) {
    const g = new THREE.Group();
    const next = Math.min(3, (owned | 0) + 1);
    const dark = std(0x111e29, { metalness: 0.55, roughness: 0.55 });
    const metal = std(0x718b9c, { metalness: 0.7, roughness: 0.32 });
    const windingMat = new THREE.MeshStandardMaterial({
      color: 0x135968,
      emissive: 0x29d6e9,
      emissiveIntensity: 0.65 + next * 0.22,
      roughness: 0.4,
      metalness: 0.35,
    });

    // Octagonal-ish foot + metal collar (real coil base / first band).
    const base = new THREE.Mesh(new THREE.CylinderGeometry(0.52, 0.58, 0.16, 8), dark);
    base.position.y = -0.42;
    base.rotation.y = Math.PI / 8;
    g.add(base);
    const foot = new THREE.Mesh(new THREE.CylinderGeometry(0.34, 0.44, 0.11, 12), metal);
    foot.position.y = -0.28;
    g.add(foot);
    // Cyan accent pips around the base — simplified from the bay’s eight strips.
    for (let i = 0; i < 4; i++) {
      const a = i * Math.PI / 2 + Math.PI / 4;
      addBox(g, glow(0x62edff, 1.1), 0.2, 0.045, 0.04,
        Math.cos(a) * 0.5, -0.4, Math.sin(a) * 0.5);
    }

    // Insulated mast.
    const mast = new THREE.Mesh(new THREE.CylinderGeometry(0.15, 0.19, 1.05, 14), dark);
    mast.position.y = 0.32;
    g.add(mast);

    // Winding stack (5 rings — reads clearly at icon size; bay uses six).
    const rings = new THREE.Group();
    const ringCount = 4 + (next >= 3 ? 1 : 0);
    for (let i = 0; i < ringCount; i++) {
      const y = -0.08 + i * (0.9 / Math.max(1, ringCount - 1));
      const collar = new THREE.Mesh(new THREE.TorusGeometry(0.26, 0.032, 8, 24), metal);
      collar.rotation.x = Math.PI / 2;
      collar.position.y = y - 0.025;
      rings.add(collar);
      const glowRing = new THREE.Mesh(new THREE.TorusGeometry(0.27, 0.018, 6, 24), windingMat);
      glowRing.rotation.x = Math.PI / 2;
      glowRing.position.y = y;
      rings.add(glowRing);
    }
    g.add(rings);

    // Terminal collar + steel ball.
    const topCollar = new THREE.Mesh(new THREE.CylinderGeometry(0.17, 0.22, 0.09, 12), metal);
    topCollar.position.y = 0.98;
    g.add(topCollar);
    const ballMat = std(0x9eb6c7, {
      metalness: 0.65, roughness: 0.25,
      emissive: 0x29d6e9, emissiveIntensity: 0.12 + next * 0.1,
    });
    const ball = new THREE.Mesh(new THREE.SphereGeometry(0.3, 20, 16), ballMat);
    ball.position.y = 1.22;
    g.add(ball);

    // Soft cyan bloom around the windings (matches bay coilGlow).
    const halo = new THREE.Mesh(
      new THREE.SphereGeometry(0.5, 16, 12),
      new THREE.MeshBasicMaterial({
        color: 0x62edff,
        transparent: true,
        opacity: 0.11 + next * 0.03,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
        toneMapped: false,
      }),
    );
    halo.position.y = 0.35;
    g.add(halo);

    // Tip spark — flickers in animateIcon when motion is allowed.
    const spark = new THREE.Mesh(
      new THREE.SphereGeometry(0.055, 8, 6),
      new THREE.MeshBasicMaterial({
        color: 0xd8fbff,
        transparent: true,
        opacity: 0,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
        toneMapped: false,
      }),
    );
    spark.position.y = 1.42;
    g.add(spark);

    g.userData.coilRings = rings;
    g.userData.coilHalo = halo;
    g.userData.coilBall = ball;
    g.userData.coilSpark = spark;
    g.userData.coilOwned = next;
    g.userData.coilWinding = windingMat;
    return g;
  },
};

function disposeObject(root) {
  root.traverse(obj => {
    if (obj.geometry) obj.geometry.dispose();
    const mats = obj.material;
    if (!mats) return;
    for (const m of Array.isArray(mats) ? mats : [mats]) {
      if (m.map && !m.map.userData?.shared) m.map.dispose();
      m.dispose();
    }
  });
}

function makeScene(upgrade) {
  const scene = new THREE.Scene();
  const root = new THREE.Group();
  scene.add(root);
  addShadowGround(root);

  const key = new THREE.DirectionalLight(0xffffff, 1.7);
  key.position.set(0.15, 5.5, 0.35);
  key.target.position.set(0, 0, 0);
  scene.add(key.target);
  key.castShadow = true;
  key.shadow.mapSize.set(256, 256);
  key.shadow.radius = 6;
  key.shadow.camera.near = 0.5;
  key.shadow.camera.far = 14;
  key.shadow.camera.left = -2.2;
  key.shadow.camera.right = 2.2;
  key.shadow.camera.top = 2.2;
  key.shadow.camera.bottom = -2.2;
  key.shadow.bias = -0.003;
  key.shadow.normalBias = 0.02;
  scene.add(key);
  scene.add(new THREE.AmbientLight(0x8aa4b8, 0.75));
  const rim = new THREE.PointLight(hex(CAT_COLORS[upgrade.cat] || '#9af5ff'), 2.0, 9);
  rim.position.set(-1.4, 1.2, -1.2);
  scene.add(rim);
  const fill = new THREE.PointLight(0x9af5ff, 0.65, 7);
  fill.position.set(1.2, 0.4, 1.8);
  scene.add(fill);

  const owned = upgrade.owned || 0;
  const subject = (builders[upgrade.id] || builders.bot)(owned);
  subject.position.y = 0.08;
  subject.scale.multiplyScalar(0.64);
  // Mag cells sit on +Z — keep them facing the camera (sway only; no full spin).
  if (upgrade.id === 'mag') subject.rotation.y = -0.28;
  else if (upgrade.cat === 'firepower' || upgrade.cat === 'handling') subject.rotation.y = -0.55;
  enableCast(subject);
  // Magnet uses painted blob shadows under each gem; skip map casts so they don't double.
  if (subject.userData.gemShadows) {
    subject.userData.gems?.forEach((gem) => { gem.castShadow = false; });
    subject.userData.gemShadows.forEach((disc) => {
      disc.castShadow = false;
      disc.receiveShadow = false;
    });
  }
  root.add(subject);
  root.userData.subject = subject;

  const camera = new THREE.PerspectiveCamera(32, 1, 0.1, 40);
  camera.position.set(0, 1.05, 4.35);
  camera.lookAt(0, 0.05, 0);

  return { scene, camera, root };
}

function animateIcon(entry, t, dt, hot, reducedMotion) {
  const { root, id } = entry;
  const subject = root.userData.subject;
  if (!subject) return;
  const idle = reducedMotion.matches ? 0 : 1;
  const spin = entry.dragging ? 0 : (0.35 + (hot ? 0.55 : 0)) * idle;

  if (!entry.dragging) {
    if (SWAY_IDS.has(id) && idle) {
      entry.yaw = entry.baseYaw + Math.sin(t * 1.15 + entry.phase) * SWAY_ANGLE;
    } else if (!SWAY_IDS.has(id)) {
      entry.yaw += spin * dt;
    }
  }

  root.rotation.y = entry.yaw;
  subject.position.y = idle ? Math.sin(t * 1.6 + entry.phase) * 0.06 : 0;

  const ud = subject.userData;
  if (ud.pulse) ud.pulse.scale.setScalar(1 + 0.12 * Math.sin(t * 6));
  if (ud.rotor) ud.rotor.rotation.z += dt * (hot ? (ud.rotorSpeed || 5) * 1.8 : (ud.rotorSpeed || 5)) * idle;
  if (ud.ring) ud.ring.rotation.z += dt * 1.5 * idle;
  if (ud.arcs) ud.arcs.rotation.y += dt * 2.2 * idle;
  if (ud.waves) {
    ud.waves.forEach((w, i) => {
      const u = (t * 0.9 + i * 0.25) % 1;
      w.scale.setScalar(0.7 + u * 0.9);
      w.material.opacity = (1 - u) * 0.5;
    });
  }
  if (ud.split) {
    const period = 0.55;
    const travel = 3.4;
    ud.split.cycle = (ud.split.cycle + dt) % period;
    const u = ud.split.cycle / period;
    ud.split.flash.material.opacity = u < 0.12 ? (1 - u / 0.12) * 0.9 : 0;
    ud.split.flash.scale.setScalar(0.8 + u * 1.2);
    const mz = ud.split.muzzle.position;
    ud.split.beams.forEach(b => {
      const dist = u * travel;
      const fade = u < 0.78 ? 1 : 1 - (u - 0.78) / 0.22;
      b.mesh.position.copy(b.dir).multiplyScalar(dist).add(mz);
      b.mesh.quaternion.setFromUnitVectors(_aimFwd, _tmpDir.copy(b.dir));
      b.mesh.visible = fade > 0.02;
      if (b.mesh.userData.aura) b.mesh.userData.aura.material.opacity = 0.45 * fade;
    });
  }
  if (ud.spike && id === 'pierce') {
    ud.spike.position.x = -0.35 + ((t * 0.7) % 1) * 1.1 * idle;
  }
  if (ud.flame) ud.flame.scale.set(1, 1, 0.85 + 0.25 * Math.sin(t * 12));
  if (ud.jets) ud.jets.forEach((j, i) => j.scale.setScalar(0.9 + 0.15 * Math.sin(t * 9 + i)));
  if (ud.cells) {
    ud.cells.forEach(c => {
      c.position.y = c.userData.baseY + Math.sin(t * 1.6 + c.userData.phase) * 0.05 * idle;
      const dots = c.userData.charge?.userData?.dots;
      if (!dots) return;
      dots.forEach(d => {
        const wave = 0.55 + 0.45 * Math.sin(t * 4.5 + d.userData.phase);
        d.scale.setScalar(0.65 + wave * 0.7);
        d.material.opacity = 0.4 + wave * 0.6;
      });
    });
  }
  if (ud.gems) {
    ud.gems.forEach((gem, i) => {
      gem.rotation.y += dt * (1.2 + i * 0.3);
      gem.rotation.x = 0.25 + Math.sin(t * 1.8 + i) * 0.15;
      const pull = 0.55 + 0.35 * Math.sin(t * 2 + i);
      if (i > 0) {
        const side = i === 1 ? -1 : 1;
        gem.position.x = side * (0.35 + pull * 0.45);
        gem.position.y = 0.05 + (1 - pull) * 0.25;
      } else {
        gem.position.y = 0.25 + Math.sin(t * 2.4) * 0.08;
      }
      const shadow = ud.gemShadows?.[i];
      if (!shadow) return;
      // Sit on the shared ground plane (root y=-0.5) while the subject bobs.
      shadow.position.x = gem.position.x;
      shadow.position.z = gem.position.z;
      shadow.position.y = -0.5 - subject.position.y - 0.01;
      const lift = Math.max(0, gem.position.y);
      const shrink = 1 / (1 + lift * 0.55);
      shadow.scale.setScalar(0.94 + shrink * 0.14);
      shadow.material.opacity = 0.72 + shrink * 0.2;
    });
  }
  if (ud.coilHalo) {
    const base = 0.1 + (ud.coilOwned || 1) * 0.03;
    ud.coilHalo.material.opacity = base * (0.7 + 0.3 * Math.sin(t * 2.8 + entry.phase) * idle);
  }
  if (ud.coilWinding) {
    ud.coilWinding.emissiveIntensity = (0.55 + (ud.coilOwned || 1) * 0.2)
      * (0.85 + 0.15 * Math.sin(t * 3.4 + entry.phase) * idle);
  }
  if (ud.coilBall?.material) {
    ud.coilBall.material.emissiveIntensity = (0.1 + (ud.coilOwned || 1) * 0.08)
      * (0.75 + 0.25 * Math.sin(t * 4.2 + entry.phase) * idle);
  }
  if (ud.coilSpark) {
    // Brief tip flickers — same spirit as shock arcs / damage pulse; off under reduced motion.
    const flick = idle && Math.sin(t * 9.5 + entry.phase * 2) > 0.72;
    ud.coilSpark.material.opacity = flick ? 0.9 : 0;
    ud.coilSpark.scale.setScalar(flick ? 0.85 + 0.35 * Math.abs(Math.sin(t * 17)) : 1);
  }
  if (ud.swap) {
    const u = (Math.sin(t * 1.5) + 1) * 0.5;
    ud.swap.cellA.position.y = 0.05 + u * 0.25;
    ud.swap.cellB.position.y = 0.35 - u * 0.25;
    ud.swap.cellB.rotation.z = 0.5 - u * 0.5;
  }
}

/**
 * Shared WebGL blit host for upgrade icon canvases (.icon-stage).
 * Options:
 *  - allowDrag: orbit on pointer drag (preview page)
 *  - reducedMotion: MediaQueryList
 */
export function createUpgradeIconHost({
  reducedMotion = matchMedia('(prefers-reduced-motion: reduce)'),
  allowDrag = false,
  parent = document.body,
} = {}) {
  const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'low-power' });
  renderer.setPixelRatio(Math.min(devicePixelRatio, 1.75));
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.setClearColor(0x000000, 0);
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.VSMShadowMap;
  renderer.domElement.style.cssText = 'position:fixed;left:-9999px;top:0;pointer-events:none;opacity:0';
  parent.appendChild(renderer.domElement);

  let stages = [];
  let raf = 0;
  let t0 = performance.now();
  let io = null;

  function clearStages() {
    for (const entry of stages) {
      entry.cleanup?.();
      disposeObject(entry.scene);
    }
    stages = [];
    if (io) {
      io.disconnect();
      io = null;
    }
  }

  function stop() {
    if (raf) cancelAnimationFrame(raf);
    raf = 0;
  }

  function frame(now) {
    raf = requestAnimationFrame(frame);
    const dt = Math.min(0.05, (now - t0) / 1000);
    t0 = now;
    const t = now / 1000;

    for (const entry of stages) {
      if (!entry.visible) continue;
      const { canvas, ctx, scene, camera, card } = entry;
      const w = canvas.clientWidth || 256;
      const h = canvas.clientHeight || 160;
      const pr = renderer.getPixelRatio();
      if (canvas.width !== Math.floor(w * pr) || canvas.height !== Math.floor(h * pr)) {
        canvas.width = Math.max(1, Math.floor(w * pr));
        canvas.height = Math.max(1, Math.floor(h * pr));
      }
      camera.aspect = w / Math.max(1, h);
      const topPad = Math.round(h * 0.28);
      camera.setViewOffset(w, h + topPad, 0, topPad, w, h);
      camera.updateProjectionMatrix();
      const hot = entry.hot || entry.dragging
        || !!(card && card.matches(':hover, :focus-visible, .pad-sel, .picked'));
      animateIcon(entry, t, dt, hot, reducedMotion);
      renderer.setSize(w, h, false);
      renderer.render(scene, camera);
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(renderer.domElement, 0, 0, canvas.width, canvas.height);
    }
  }

  function clear() {
    stop();
    clearStages();
  }

  function mount(root) {
    clear();
    if (!root) return;

    const canvases = [...root.querySelectorAll('canvas.icon-stage')];
    io = new IntersectionObserver(entries => {
      for (const e of entries) {
        const stage = stages.find(s => s.canvas === e.target);
        if (stage) stage.visible = e.isIntersecting;
      }
    }, { rootMargin: '80px' });

    stages = canvases.map((canvas, i) => {
      const id = canvas.dataset.id;
      const owned = Number(canvas.dataset.owned || 0);
      const cat = canvas.dataset.cat || 'engineer';
      const { scene, camera, root: group } = makeScene({ id, cat, owned });
      const ctx = canvas.getContext('2d');
      const card = canvas.closest('.card');
      const baseYaw = -0.35 + (i % 5) * 0.08;
      const entry = {
        canvas, ctx, scene, camera, root: group, id, card,
        yaw: baseYaw,
        baseYaw,
        phase: i * 0.7,
        visible: true,
        dragging: false,
        lastX: 0,
        hot: false,
        cleanup: null,
      };

      const onEnter = () => { entry.hot = true; };
      const onLeave = () => { entry.hot = false; entry.dragging = false; };
      card?.addEventListener('pointerenter', onEnter);
      card?.addEventListener('pointerleave', onLeave);

      const listeners = [];
      if (allowDrag) {
        const onDown = e => {
          entry.dragging = true;
          entry.lastX = e.clientX;
          canvas.setPointerCapture(e.pointerId);
        };
        const onMove = e => {
          if (!entry.dragging) return;
          entry.yaw += (e.clientX - entry.lastX) * 0.01;
          entry.lastX = e.clientX;
        };
        const endDrag = () => {
          entry.dragging = false;
          if (SWAY_IDS.has(id)) entry.baseYaw = entry.yaw;
        };
        canvas.addEventListener('pointerdown', onDown);
        canvas.addEventListener('pointermove', onMove);
        canvas.addEventListener('pointerup', endDrag);
        canvas.addEventListener('pointercancel', endDrag);
        listeners.push(
          ['pointerdown', onDown],
          ['pointermove', onMove],
          ['pointerup', endDrag],
          ['pointercancel', endDrag],
        );
      }

      entry.cleanup = () => {
        card?.removeEventListener('pointerenter', onEnter);
        card?.removeEventListener('pointerleave', onLeave);
        for (const [type, fn] of listeners) canvas.removeEventListener(type, fn);
      };

      io.observe(canvas);
      return entry;
    });

    t0 = performance.now();
    raf = requestAnimationFrame(frame);
  }

  function dispose() {
    clear();
    renderer.dispose();
    renderer.domElement.remove();
  }

  return { mount, clear, dispose, CAT_COLORS };
}

export { CAT_COLORS, builders, makeScene, animateIcon, SWAY_IDS };
