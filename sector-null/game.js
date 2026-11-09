import * as THREE from 'three';

import '@fontsource/rajdhani/latin-600.css';
import '@fontsource/rajdhani/latin-700.css';
import '@fontsource/oxanium/latin-700.css';
import './style.css';
import './title.css';
import { createAudio } from './audio.js';
import { createTitleScene } from './title-scene.js';

// Sector Null. Gameplay and animation adapted from Abandon All Hope by Josh Werner.
const canvas = document.getElementById('game');
function createRenderer() {
  try {
    return new THREE.WebGLRenderer({ canvas, antialias: true });
  } catch (error) {
    document.getElementById('menu').hidden = true;
    document.getElementById('bootError').classList.remove('hidden');
    throw error;
  }
}
const renderer = createRenderer();
const titleScene = createTitleScene();
const titleMotion = matchMedia('(prefers-reduced-motion: reduce)');
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1.12;
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.65));
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;

const scene = new THREE.Scene();
scene.background = new THREE.Color(0x080e16);
scene.fog = new THREE.Fog(0x080e16, 26, 67);

const camera = new THREE.PerspectiveCamera(55, window.innerWidth / window.innerHeight, 0.1, 200);
const CAM_OFFSET = new THREE.Vector3(0, 24, 11);

function onResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
}
window.addEventListener('resize', onResize);
onResize();

// ---------- shared geometry / materials ----------
const BOX = new THREE.BoxGeometry(1, 1, 1);

// ---------- block building: everything in the game is made of these ----------
// chamfered box: every edge is cut at 45° so it catches a thin highlight,
// which keeps the blocks reading as separate shapes at gameplay distance.
// Built at its real size (not scaled) so the bevels stay even, with UVs
// box-projected in world units so a texture keeps one scale on every part.
const UV_UNIT = 0.32; // world units per texture repeat
const bevelCache = new Map();
function bevelBox(w, h, d, r = 0.03) {
  const key = `${w},${h},${d},${r}`;
  if (bevelCache.has(key)) return bevelCache.get(key);
  const e = [w / 2, h / 2, d / 2];
  r = Math.min(r, e[0] * 0.45, e[1] * 0.45, e[2] * 0.45);
  // corner `s` (a sign per axis), pulled in by r on every axis except `a`
  const V = (s, a) => e.map((v, i) => s[i] * (i === a ? v : v - r));
  const sg = (a, sa, b, sb, c, sc) => { const s = []; s[a] = sa; s[b] = sb; s[c] = sc; return s; };
  const pos = [], nrm = [], uv = [];
  const p0 = new THREE.Vector3(), n = new THREE.Vector3(), q = new THREE.Vector3();
  const face = pts => {
    p0.fromArray(pts[0]);
    n.fromArray(pts[1]).sub(p0).cross(q.fromArray(pts[2]).sub(p0)).normalize();
    if (n.dot(p0) < 0) { pts = pts.slice().reverse(); n.negate(); } // wind outward (the box is convex)
    const ax = Math.abs(n.x), ay = Math.abs(n.y), az = Math.abs(n.z);
    const [u, v] = ax >= ay && ax >= az ? [2, 1] : ay >= az ? [0, 2] : [0, 1];
    for (let i = 1; i < pts.length - 1; i++) {
      for (const p of [pts[0], pts[i], pts[i + 1]]) {
        pos.push(p[0], p[1], p[2]); nrm.push(n.x, n.y, n.z); uv.push(p[u] / UV_UNIT, p[v] / UV_UNIT);
      }
    }
  };
  for (let a = 0; a < 3; a++) {
    const b = (a + 1) % 3, c = (a + 2) % 3;
    for (const sa of [1, -1]) {
      face([[1, 1], [1, -1], [-1, -1], [-1, 1]].map(([sb, sc]) => V(sg(a, sa, b, sb, c, sc), a))); // flat face
      for (const sb of [1, -1]) {                                                                  // bevel strip a|b
        face([V(sg(a, sa, b, sb, c, 1), a), V(sg(a, sa, b, sb, c, -1), a),
              V(sg(a, sa, b, sb, c, -1), b), V(sg(a, sa, b, sb, c, 1), b)]);
      }
    }
  }
  for (const x of [1, -1]) for (const y of [1, -1]) for (const z of [1, -1]) {
    face([0, 1, 2].map(a => V([x, y, z], a)));                                                     // corner
  }
  const g = new THREE.BufferGeometry();
  g.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3));
  g.setAttribute('normal', new THREE.Float32BufferAttribute(nrm, 3));
  g.setAttribute('uv', new THREE.Float32BufferAttribute(uv, 2));
  bevelCache.set(key, g);
  return g;
}
// Collects colored blocks into one vertex-colored geometry, so a whole wall, prop or
// body part is a single draw call. A block: [w, h, d, x, y, z, color, rx, ry, rz, bevel]
// (turned by ry, then tilted by rx and rz).
// `parent` (optional Matrix4) places a whole group of blocks, e.g. a prop in the world.
const _bkM = new THREE.Matrix4(), _bkN = new THREE.Matrix3(), _bkQ = new THREE.Quaternion(), _bkE = new THREE.Euler();
const _bkP = new THREE.Vector3(), _bkS = new THREE.Vector3(1, 1, 1), _bkV = new THREE.Vector3(), _bkC = new THREE.Color();
// `flat` (or a bevel of 0) uses plain 12-triangle boxes: for blades of grass and far-off
// trees, where a chamfer wouldn't be seen but would cost 44 triangles a block.
const plainCache = new Map();
const plainBox = (w, h, d) => {
  const key = `${w},${h},${d}`;
  if (!plainCache.has(key)) plainCache.set(key, new THREE.BoxGeometry(w, h, d).toNonIndexed());
  return plainCache.get(key);
};
class BlockBatch {
  constructor() { this.pos = []; this.nrm = []; this.col = []; }
  add(blocks, rng, parent, flat = false) {
    for (const [w, h, d, x, y, z, hex, rx = 0, ry = 0, rz = 0, r = 0.025] of blocks) {
      const g = flat || r <= 0 ? plainBox(w, h, d) : bevelBox(w, h, d, r);
      _bkM.compose(_bkP.set(x, y, z), _bkQ.setFromEuler(_bkE.set(rx, ry, rz, 'YXZ')), _bkS);
      if (parent) _bkM.premultiply(parent);
      _bkN.getNormalMatrix(_bkM);
      // each block a shade lighter or darker, for a hand-painted look
      _bkC.setHex(hex).multiplyScalar(0.9 + rng() * 0.2);
      const P = g.attributes.position.array, N = g.attributes.normal.array;
      for (let i = 0; i < P.length; i += 3) {
        _bkV.fromArray(P, i).applyMatrix4(_bkM); this.pos.push(_bkV.x, _bkV.y, _bkV.z);
        _bkV.fromArray(N, i).applyMatrix3(_bkN).normalize(); this.nrm.push(_bkV.x, _bkV.y, _bkV.z);
        this.col.push(_bkC.r, _bkC.g, _bkC.b);
      }
    }
    return this;
  }
  build() {
    const g = new THREE.BufferGeometry();
    g.setAttribute('position', new THREE.Float32BufferAttribute(this.pos, 3));
    g.setAttribute('normal', new THREE.Float32BufferAttribute(this.nrm, 3));
    g.setAttribute('color', new THREE.Float32BufferAttribute(this.col, 3));
    return g;
  }
}
const bakeBlocks = (blocks, rng, flat) => new BlockBatch().add(blocks, rng, null, flat).build();
// small seeded RNG so baked models come out the same every load
function seeded(n) {
  return () => ((n = (n * 1664525 + 1013904223) >>> 0) / 4294967296);
}

const rnd = (a, b) => a + Math.random() * (b - a);
const store = {
  get(k, fallback) { try { return JSON.parse(localStorage.getItem('sector-null-' + k)) ?? fallback; } catch { return fallback; } },
  set(k, v) { try { localStorage.setItem('sector-null-' + k, JSON.stringify(v)); } catch { /* storage is optional */ } },
};
const settings = Object.assign({ master: 8, music: 7, shake: !matchMedia('(prefers-reduced-motion: reduce)').matches }, store.get('settings', {}));
const audio = createAudio(settings, () => player.position);

// Reactor deck. Collision footprints stay independent of the decorative geometry.
const HALF = 10;
const WALL_H = 2.4;
const WALL_T = 0.7;
const EDGE = HALF + WALL_T / 2;
const world = new THREE.Group();
scene.add(world);
const worldMat = new THREE.MeshStandardMaterial({ vertexColors: true, roughness: 0.58, metalness: 0.38 });
const _place = new THREE.Matrix4();
const at = (x, z, ry = 0, y = 0) => _place.makeRotationY(ry).setPosition(x, y, z);
function bakedMesh(batch, cast = true) {
  const mesh = new THREE.Mesh(batch.build(), worldMat);
  mesh.castShadow = cast;
  mesh.receiveShadow = true;
  world.add(mesh);
  return mesh;
}

const CYAN = 0x62edff;
const AMBER = 0xffa648;
const carbon = new THREE.MeshStandardMaterial({ color: 0x172733, metalness: 0.48, roughness: 0.42 });
const alloy = new THREE.MeshStandardMaterial({ color: 0x506375, metalness: 0.55, roughness: 0.35 });
const cyanLight = new THREE.MeshBasicMaterial({ color: CYAN, toneMapped: false });
const amberLight = new THREE.MeshBasicMaterial({ color: AMBER, toneMapped: false });
function model(parent, geometry, material, x, y, z) {
  const mesh = new THREE.Mesh(geometry, material);
  mesh.position.set(x, y, z);
  parent.add(mesh);
  return mesh;
}
function box(parent, material, x, y, z, w, h, d) {
  const mesh = model(parent, BOX, material, x, y, z);
  mesh.scale.set(w, h, d);
  return mesh;
}

const deck = new BlockBatch();
const deckRandom = seeded(87);
const panels = [0x263543, 0x2b3e4b, 0x314452, 0x223340, 0x384a58];
for (let z = -19; z <= 19; z++) {
  for (let x = -19; x <= 19; x++) {
    const insideDeck = x >= -6 && x <= 6 && z >= -6 && z <= 6;
    deck.add([[1.565, 0.11, 1.565, x * 1.6, -0.06, z * 1.6,
      insideDeck ? panels[Math.floor(deckRandom() * panels.length)] : 0x1c2b37, 0, 0, 0, 0.024]], deckRandom, undefined, !insideDeck);
  }
}
for (const side of [-1, 1]) {
  for (let n = -8; n <= 8; n += 0.45) {
    deck.add([[0.11, 0.013, 0.34, side * 8.8, 0.006, n, 0x6f8a9e, 0, 0, 0, 0]], deckRandom);
  }
  for (const x of [-6.4, 6.4]) {
    box(world, cyanLight, x, 0.007, side * 8.3, 2.8, 0.014, 0.035);
    box(world, cyanLight, x, 0.007, side * 7.9, 0.035, 0.014, 0.8);
  }
}
bakedMesh(deck, false);
const underdeck = model(world, new THREE.PlaneGeometry(180, 180), carbon, 0, -0.13, 0);
underdeck.rotation.x = -Math.PI / 2;
underdeck.receiveShadow = true;
for (const radius of [2.85, 3.02, 5.8]) {
  model(world, new THREE.RingGeometry(radius, radius + 0.027, 96), alloy, 0, 0.009, 0).rotation.x = -Math.PI / 2;
}
for (let i = 0; i < 24; i++) {
  const a = i * Math.PI / 12;
  const marker = box(world, i % 6 === 0 ? cyanLight : alloy, Math.sin(a) * 3.16, 0.012, Math.cos(a) * 3.16,
    0.035, 0.015, i % 6 === 0 ? 0.38 : 0.16);
  marker.rotation.y = a;
}
const stencil = document.createElement('canvas');
stencil.width = 256;
stencil.height = 96;
const ink = stencil.getContext('2d');
ink.textAlign = 'center';
ink.fillStyle = '#99bed3';
ink.font = 'bold 49px monospace';
ink.fillText('07', 128, 56);
ink.font = 'bold 13px monospace';
ink.fillText('REACTOR ACCESS', 128, 81);
const stencilMap = new THREE.CanvasTexture(stencil);
stencilMap.colorSpace = THREE.SRGBColorSpace;
const deckMark = model(world, new THREE.PlaneGeometry(3.8, 1.425), new THREE.MeshBasicMaterial({
  map: stencilMap, transparent: true, opacity: 0.52, depthWrite: false,
}), 0, 0.013, -5.8);
deckMark.rotation.x = -Math.PI / 2;

// Bulkhead spans and destructible access points.
const openings = [];
const wallBoxes = [];
const wallB = new BlockBatch(), wrng = seeded(23);
const WALL_STEP = 0.4, PANEL_H = 0.37, PANEL_D = 0.65;
const PANELS = [0x425765, 0x364957, 0x3d5466, 0x344650];
const POST = 0x1c2d38, FRAME = 0x5b7182;
function wallBlock(axis, fixed, u0, u1, y, h, d, color, bevel, n = 0, tilt = 0) {
  const len = Math.abs(u1 - u0), c = (u0 + u1) / 2;
  return axis === 'x'
    ? [len, h, d, c, y, fixed + n, color, 0, 0, tilt, bevel]
    : [d, h, len, fixed + n, y, c, color, -tilt, 0, 0, bevel];
}

// builds a wall along an axis. `fixed` = the constant coord, `axis` = 'x' or 'z';
// `gaps` = [start, end, 'door' | 'window'] along the moving axis (world units)
const OPENING_INSET = 1.5; // how far in/out the entry waypoints sit from the wall plane
const SILL = { x: 0.83, z: 0.83 }, HEAD = { x: 1.61, z: 1.61 };
const DOOR_TOP = 2.03, JAMB = 0.14;
const DOOR_HP = 12, WINDOW_HP = 2; // blows it takes to break one in
function buildWall(axis, fixed, gaps) {
  const min = -EDGE, max = EDGE, mine = [];
  const segs = [];
  let cursor = min;
  for (const [gs, ge, kind] of gaps.slice().sort((a, b) => a[0] - b[0])) {
    if (gs > cursor) segs.push([cursor, gs]);
    cursor = Math.max(cursor, ge);
    mine.push(makeOpening(axis, fixed, gs, ge, kind));
  }
  if (cursor < max) segs.push([cursor, max]);
  const layer0 = 0.21;
  for (const [a, b] of segs) {
    const hw = (axis === 'x' ? b - a : WALL_T) / 2, hd = (axis === 'x' ? WALL_T : b - a) / 2;
    const cx = axis === 'x' ? (a + b) / 2 : fixed, cz = axis === 'x' ? fixed : (a + b) / 2;
    wallBoxes.push({ minX: cx - hw, maxX: cx + hw, minZ: cz - hd, maxZ: cz + hd });
    panelRun(axis, fixed, a, b, layer0, () => true);
  }
  // across each opening: a lintel over a door; logs under the sill and over the head of a window
  for (const o of mine) {
    const keep = o.kind === 'door'
      ? y => y - PANEL_H / 2 >= DOOR_TOP - 0.01
      : y => y + PANEL_H / 2 <= o.sill + 0.01 || y - PANEL_H / 2 >= o.head - 0.01;
    panelRun(axis, fixed, o.u0, o.u1, layer0, keep);
    fitOpening(o);
    openings.push(o);
  }
}

function panelRun(axis, fixed, a, b, layer0, keep) {
  for (let k = 0; k < 6; k++) {
    const y = layer0 + k * WALL_STEP;
    if (!keep(y)) continue;
    const count = Math.ceil((b - a) / 2.4);
    for (let i = 0; i < count; i++) {
      const left = a + (b - a) * i / count;
      const right = a + (b - a) * (i + 1) / count;
      wallB.add([wallBlock(axis, fixed, left + 0.022, right - 0.022, y, PANEL_H, PANEL_D, PANELS[(i + k) % PANELS.length], 0.035)], wrng);
    }
    if (k === 5) wallB.add([wallBlock(axis, fixed, a, b, WALL_H, 0.055, PANEL_D + 0.07, FRAME, 0.01)], wrng);
  }
}

// An opening's geometry and waypoints. Drones come in via the OUTER waypoint, stand at
// the FRONT to break it, then go through to the INNER one (or climb to the LANDING).
// Its parts are modeled in a local frame: x along the wall, +z out of the deck.
function makeOpening(axis, fixed, u0, u1, kind) {
  const c = (u0 + u1) / 2, s = Math.sign(fixed), ht = WALL_T / 2;
  const p = out => axis === 'x' ? [c, fixed + s * out] : [fixed + s * out, c]; // world x, z at `out` from the wall
  const [x, z] = p(0), [ox, oz] = p(OPENING_INSET), [ix, iz] = p(-OPENING_INSET), [fx, fz] = p(0.85), [lx, lz] = p(-0.95);
  return {
    kind, axis, u0, u1, w: u1 - u0, x, z, ox, oz, ix, iz, fx, fz, lx, lz,
    sill: SILL[axis], head: HEAD[axis],
    rotY: axis === 'x' ? (s > 0 ? 0 : Math.PI) : s * Math.PI / 2,
    box: axis === 'x' ? { minX: u0, maxX: u1, minZ: fixed - ht, maxZ: fixed + ht } : { minX: fixed - ht, maxX: fixed + ht, minZ: u0, maxZ: u1 },
    maxHp: kind === 'door' ? DOOR_HP : WINDOW_HP, hp: 0,
    climber: null, // the drone clambering through a broken window (one at a time)
    jolt: 0, fallT: -1,
  };
}

const glassMat = new THREE.MeshStandardMaterial({ color: 0x5fbed1, roughness: 0.08, metalness: 0.4, transparent: true, opacity: 0.3, depthWrite: false });
const glassCracked = new THREE.MeshStandardMaterial({ color: 0x9de9f1, roughness: 0.45, metalness: 0.2, transparent: true, opacity: 0.55, depthWrite: false });
// frame it in the baked walls, and build the parts that move or break
function fitOpening(o) {
  const place = at(o.x, o.z, o.rotY), hw = o.w / 2, frng = seeded(Math.round(o.x * 7 + o.z * 13) + 99);
  const root = new THREE.Group();
  root.position.set(o.x, 0, o.z); root.rotation.y = o.rotY;
  world.add(root);
  if (o.kind === 'door') {
    wallB.add([
      [JAMB, DOOR_TOP + 0.1, PANEL_D + 0.1, -hw + JAMB / 2, (DOOR_TOP + 0.1) / 2, 0, POST, 0, 0, 0, 0.03],  // posts
      [JAMB, DOOR_TOP + 0.1, PANEL_D + 0.1, hw - JAMB / 2, (DOOR_TOP + 0.1) / 2, 0, POST, 0, 0, 0, 0.03],
      [o.w + 0.1, 0.14, PANEL_D + 0.12, 0, DOOR_TOP + 0.02, 0, POST, 0, 0, 0, 0.03],                     // header
      [o.w - 0.1, 0.05, PANEL_D, 0, 0.0, 0, POST, 0, 0, 0, 0.02],                                       // threshold
    ], wrng, place);
    const lw = o.w - 2 * JAMB - 0.02, lh = 1.92;
    const blocks = [
      [lw, lh, 0.16, lw / 2, lh / 2, 0, POST, 0, 0, 0, 0.06],
      [lw - 0.17, lh - 0.2, 0.08, lw / 2, lh / 2, 0.09, FRAME, 0, 0, 0, 0.04],
      [lw - 0.24, 0.23, 0.09, lw / 2, 1.17, 0.138, POST, 0, 0, 0, 0.012],
      [0.19, 0.08, 0.07, lw / 2, 1.17, 0.19, 0xffab5b, 0, 0, 0, 0.01],
    ];
    for (let i = 0; i < 4; i++) {
      blocks.push([0.08, 0.25, 0.065, lw / 2 + (i - 1.5) * 0.12, 0.45, 0.15, POST, 0, 0, -0.45, 0.008]);
    }
    const leafMesh = new THREE.Mesh(bakeBlocks(blocks, frng), worldMat);
    leafMesh.castShadow = true; leafMesh.receiveShadow = true;
    o.fall = new THREE.Group(); o.fall.position.z = -0.02; root.add(o.fall);                   // pivot it falls in about
    o.leaf = new THREE.Group(); o.leaf.position.set(-hw + JAMB + 0.01, 0.02, 0); o.fall.add(o.leaf); // hinge line
    o.leaf.add(leafMesh);
  } else {
    const h = o.head - o.sill, mid = (o.sill + o.head) / 2, iw = o.w - 0.2;
    wallB.add([
      [0.1, h + 0.1, PANEL_D + 0.06, -hw + 0.05, mid, 0, POST, 0, 0, 0, 0.02],              // jambs
      [0.1, h + 0.1, PANEL_D + 0.06, hw - 0.05, mid, 0, POST, 0, 0, 0, 0.02],
      [o.w + 0.12, 0.08, PANEL_D + 0.08, 0, o.head, 0, POST, 0, 0, 0, 0.02],              // head
      [o.w + 0.3, 0.07, PANEL_D + 0.24, 0, o.sill, 0.05, FRAME, 0, 0, 0, 0.02],        // sill board, lipped outside
    ], wrng, place);
    o.pane = new THREE.Group(); o.pane.position.y = mid; root.add(o.pane);
    o.glass = new THREE.Mesh(new THREE.BoxGeometry(iw, h - 0.08, 0.02), glassMat);
    const bars = new THREE.Mesh(bakeBlocks([[0.05, h - 0.08, 0.05, 0, 0, 0, POST], [iw, 0.05, 0.05, 0, 0, 0, POST]], frng), worldMat);
    bars.castShadow = true;
    o.bars = bars;
    o.pane.add(o.glass, bars);
    // what's left in the frame once it's smashed: jagged teeth round the edges
    const teeth = [];
    for (let i = 0; i < 9; i++) {
      const side = i % 3, t = frng() - 0.5, len = 0.12 + frng() * 0.2;
      const [px, py] = side === 0 ? [t * iw, -(h - 0.1) / 2 + 0.05] : side === 1 ? [-iw / 2 + 0.05, t * (h - 0.1)] : [iw / 2 - 0.05, t * (h - 0.1)];
      teeth.push([0.03 + frng() * 0.06, len, 0.015, px, py, 0, 0xffffff, 0, 0, (frng() - 0.5) * 1.6, 0]);
    }
    for (let i = 0; i < 3; i++) teeth.push([0.04 + frng() * 0.05, 0.1 + frng() * 0.12, 0.015, (frng() - 0.5) * iw, (h - 0.1) / 2 - 0.04, 0, 0xffffff, 0, 0, Math.PI + (frng() - 0.5) * 1.2, 0]);
    o.shards = new THREE.Mesh(bakeBlocks(teeth, frng, true), glassMat);
    o.pane.add(o.shards);
  }
}

// south wall (+Z, nearest the camera): the back door
buildWall('x',  HALF, [[-0.8, 0.8, 'door']]);
// north wall (-Z): the front door on the left, a window on the right
buildWall('x', -HALF, [[-5.8, -4.2, 'door'], [4, 6, 'window']]);
// west and east walls: a window each
buildWall('z', -HALF, [[-1.5, 0.5, 'window']]);
buildWall('z',  HALF, [[1.5, 3.5, 'window']]);

bakedMesh(wallB);
const SOLIDS = [];
function addSolid(x, z, hx, hz, rotation = 0) {
  SOLIDS.push({ x, z, hx, hz, c: Math.cos(rotation), s: Math.sin(rotation) });
}

const ambient = new THREE.HemisphereLight(0xc1e9ff, 0x586878, 1.85);
scene.add(ambient);
const key = new THREE.DirectionalLight(0xd3eaff, 2.2);
key.position.set(-14, 28, 18);
key.castShadow = true;
key.shadow.mapSize.set(1536, 1536);
Object.assign(key.shadow.camera, { left: -24, right: 24, top: 24, bottom: -24, near: 1, far: 72 });
key.shadow.normalBias = 0.045;
scene.add(key);

const haloMap = glowTexture();
function halo(parent, color, x, y, z, size, opacity) {
  const sprite = new THREE.Sprite(new THREE.SpriteMaterial({
    map: haloMap, color, opacity, transparent: true, depthWrite: false, blending: THREE.AdditiveBlending,
  }));
  sprite.position.set(x, y, z);
  sprite.scale.setScalar(size);
  parent.add(sprite);
  return sprite;
}

const gates = openings.map(o => {
  o.indicator = cyanLight.clone();
  const root = new THREE.Group();
  root.position.set(o.x, 0, o.z);
  root.rotation.y = o.rotY;
  world.add(root);
  for (const side of [-1, 1]) {
    box(root, alloy, side * (o.w / 2 + 0.13), 1.24, 0, 0.22, 2.48, 0.92);
    for (let i = 0; i < 4; i++) {
      box(root, carbon, side * (o.w / 2 + 0.18), 0.37, (i - 1.5) * 0.16, 0.2, 0.12, 0.07);
    }
    const strip = box(root, o.indicator, side * (o.w / 2 + 0.13), 1.4, 0.47, 0.05, 0.84, 0.03);
    box(root, strip.material, side * (o.w / 2 + 0.13), 1.4, -0.47, 0.05, 0.84, 0.03);
  }
  const light = new THREE.PointLight(CYAN, 12, 8, 2);
  light.position.set(0, 2.7, 0);
  root.add(light);
  const glow = halo(root, CYAN, 0, 2.42, 0, 3.6, 0.22);
  box(root, o.indicator, 0, 2.43, 0, o.w * 0.62, 0.055, 0.72);
  return { o, light, glow };
});

const reactor = new THREE.Group();
reactor.position.set(5.3, 0, -13.6);
world.add(reactor);
addSolid(5.3, -13.6, 2.8, 2.5);
model(reactor, new THREE.CylinderGeometry(3.25, 3.6, 0.75, 12), carbon, 0, 0.34, 0);
model(reactor, new THREE.CylinderGeometry(2.65, 2.85, 0.36, 12), alloy, 0, 0.86, 0);
const core = model(reactor, new THREE.IcosahedronGeometry(1.25, 1), cyanLight, 0, 4.05, 0);
core.scale.y = 1.28;
const chamber = new THREE.MeshPhysicalMaterial({
  color: 0x19495d, transparent: true, opacity: 0.24, metalness: 0.26, roughness: 0.19,
  side: THREE.DoubleSide, depthWrite: false,
});
model(reactor, new THREE.CylinderGeometry(2.11, 2.11, 5.65, 12, 1, true), chamber, 0, 3.95, 0);
const rings = [3.5, 4.05, 4.6].map((y, i) => {
  const ring = model(reactor, new THREE.TorusGeometry(1.74 + 0.16 * i, 0.055, 8, 80), i === 1 ? amberLight : cyanLight, 0, y, 0);
  return ring;
});
for (const y of [1.18, 6.75, 7.13]) {
  model(reactor, new THREE.CylinderGeometry(2.37, 2.37, 0.27, 12), carbon, 0, y, 0);
  model(reactor, new THREE.TorusGeometry(2.27, 0.035, 6, 72), cyanLight, 0, y + 0.14, 0).rotation.x = Math.PI / 2;
}
for (let i = 0; i < 6; i++) {
  const a = i * Math.PI / 3;
  const x = Math.cos(a) * 2.38, z = Math.sin(a) * 2.38;
  box(reactor, alloy, x, 3.97, z, 0.19, 5.65, 0.22);
  box(reactor, amberLight, x * 1.02, 6.1, z * 1.02, 0.1, 0.42, 0.11);
}
const coreHalo = halo(reactor, CYAN, 0, 4.05, 0, 11.5, 0.57);
const coreLight = new THREE.PointLight(CYAN, 150, 26, 2);
coreLight.position.set(0, 4.3, 1.2);
reactor.add(coreLight);

const perimeter = new BlockBatch();
const perimeterRandom = seeded(17);
for (const [x, z, rotation] of [[-6.5, 14, 0.26], [12.8, -6.5, -0.18]]) {
  perimeter.add([
    [1.9, 0.78, 1.1, 0, 0.4, 0, 0x354b5b, 0, 0, 0, 0.075],
    [1.82, 0.13, 1.13, 0, 0.74, 0, 0x53697b],
    [1.58, 0.045, 0.023, 0, 0.49, 0.558, 0xffa648],
    [0.24, 0.25, 0.04, -0.52, 0.34, 0.563, 0x152430],
    [0.24, 0.25, 0.04, 0.52, 0.34, 0.563, 0x152430],
  ], perimeterRandom, at(x, z, rotation));
  addSolid(x, z, 0.95, 0.57, rotation);
}
for (const x of [-24, -16, -12.6, 12.6, 16, 24]) {
  for (const z of [-21, -13, 9, 18]) {
    const h = 4.3 + perimeterRandom() * 3;
    perimeter.add([
      [1.7, 0.3, 1.45, x, 0.13, z, 0x304453],
      [0.85, h, 0.9, x, h / 2, z, 0x233542],
      [1.1, 0.35, 1.15, x, h + 0.05, z, 0x4b6174],
    ], perimeterRandom);
    box(world, x < 0 ? amberLight : cyanLight, x, h - 0.46, z + 0.46, 0.42, 0.09, 0.04);
    if (z !== 9 && z !== 18) box(world, alloy, x, h + 0.23, z, 0.7, 0.12, 6.5);
  }
}
for (const x of [-14.5, 14.5]) {
  for (let z = -17; z <= 20; z += 2.3) {
    box(world, amberLight, x, 0.01, z, 0.095, 0.022, 0.54);
  }
}
for (const z of [-25, -31]) {
  perimeter.add([[68, 0.36, 1.2, 0, 7.6, z, 0x263947], [68, 0.21, 0.42, 0, 6.9, z, 0x3e5467]], perimeterRandom);
}
bakedMesh(perimeter, false);

const dustRandom = seeded(1027);
const dustPoints = new Float32Array(510 * 3);
for (let i = 0; i < dustPoints.length; i += 3) {
  dustPoints[i] = (dustRandom() - 0.5) * 80;
  dustPoints[i + 1] = dustRandom() * 19;
  dustPoints[i + 2] = (dustRandom() - 0.5) * 72;
}
const dustGeometry = new THREE.BufferGeometry();
dustGeometry.setAttribute('position', new THREE.BufferAttribute(dustPoints, 3));
const dust = new THREE.Points(dustGeometry, new THREE.PointsMaterial({
  map: haloMap, color: 0x7fb6cf, transparent: true, opacity: 0.55, size: 0.16,
  depthWrite: false, blending: THREE.AdditiveBlending,
}));
world.add(dust);
const pressure = {
  level: 0, target: 0, time: 0, nextAlarm: 0,
  set(level) { this.level = this.target = level; this.nextAlarm = 0; },
};
function updateWorld(dt) {
  pressure.time += dt;
  pressure.level = THREE.MathUtils.damp(pressure.level, pressure.target, 0.42, dt);
  const t = pressure.time;
  const warning = pressure.level;
  if (warning > 0.45 && state.running && (pressure.nextAlarm -= dt) <= 0) {
    audio.alarm(warning);
    pressure.nextAlarm = 14 - warning * 6;
  }
  core.rotation.set(t * 0.24, t * 0.49, t * 0.13);
  rings.forEach((ring, i) => {
    ring.rotation.set(t * (i % 2 ? -0.42 : 0.38) + i, t * 0.16 + i * 0.8, i * 0.7);
  });
  coreHalo.material.opacity = 0.48 + 0.06 * Math.sin(t * 2.8) + warning * 0.1;
  coreLight.intensity = 135 + 12 * Math.sin(t * 2.8) + warning * 35;
  dust.position.y = Math.sin(t * 0.18) * 0.7;
  dust.rotation.y = t * 0.01;
  for (const { o, light, glow } of gates) {
    const risk = o.hp <= 0 || o.hp < o.maxHp;
    const colour = risk ? AMBER : CYAN;
    const intensity = risk ? 0.75 + 0.25 * Math.sin(t * 6 + o.x) : 1;
    light.color.setHex(colour);
    light.intensity = 12 * intensity;
    glow.material.color.setHex(colour);
    glow.material.opacity = 0.2 * intensity;
    o.indicator.color.setHex(colour);
  }
}

// ===================================================================
// PLAYER — a blocky operator rig. Arms and legs are two-bone IK chains:
// both hands stay locked onto the rifle (so recoil and the reload carry
// the arms with them) and the feet follow a procedural run cycle that
// plants each boot while it's on the ground.
// ===================================================================
const player = new THREE.Group();

// one rig block, sized in world units
function blk(mat, w, h, d, x, y, z, parent, r) {
  const m = new THREE.Mesh(bevelBox(w, h, d, r), mat);
  m.position.set(x, y, z);
  m.castShadow = true;
  parent.add(m);
  return m;
}

const mat = (color, options) => new THREE.MeshStandardMaterial({ color, roughness: 0.47, metalness: 0.3, ...options });
const M = {
  suit: mat(0x536d80),
  lining: mat(0x192835),
  vest: mat(0x293e4e),
  vestDk: mat(0x172530),
  pants: mat(0x43576b),
  plating: mat(0x243341),
  sole: mat(0x101820),
  glove: mat(0x253849),
  helmet: mat(0x668393),
  visor: mat(0x102c3d, { roughness: 0.14, metalness: 0.65 }),
  status: cyanLight,
  module: mat(0x547384),
  trim: mat(0x9d7d4e),
  metal: mat(0x334957, { roughness: 0.38, metalness: 0.62 }),
  gunBody: mat(0x536d7e),
  rubber: mat(0x151f27),
  lens: mat(0x2c8399, { emissive: 0x36dcff, emissiveIntensity: 0.9 }),
};

// rig proportions (world units; the operator stands ~2.6 tall)
const THIGH = 0.44, SHIN = 0.42, ANKLE_H = 0.15, HIP_H = 0.97;
const UPPER_ARM = 0.42, FOREARM = 0.42;

// --- lower body: `lower` turns with the legs, `pelvis` bobs/rolls/twists with the stride ---
const lower = new THREE.Group(); player.add(lower);
const pelvis = new THREE.Group(); lower.add(pelvis);
blk(M.pants, 0.62, 0.3, 0.4, 0, 0.02, 0, pelvis);              // hips
blk(M.plating, 0.66, 0.08, 0.43, 0, 0.12, 0, pelvis, 0.02);    // belt
blk(M.trim, 0.1, 0.07, 0.03, 0, 0.12, 0.22, pelvis, 0.01);    // buckle
blk(M.vestDk, 0.12, 0.17, 0.17, 0.36, 0.02, 0.04, pelvis);     // hip pouch (left)
blk(M.plating, 0.07, 0.28, 0.1, -0.35, -0.04, -0.03, pelvis);  // knife sheath (right)

// +X is the operator's left (they face +Z)
const legs = [1, -1].map((side, i) => {
  const thigh = blk(M.pants, 0.26, THIGH + 0.08, 0.29, 0, 0, 0, lower);
  const shin = blk(M.pants, 0.24, SHIN + 0.06, 0.27, 0, 0, 0, lower);
  blk(M.vestDk, 0.2, 0.17, 0.07, 0, SHIN / 2 - 0.03, 0.15, shin);  // knee pad
  const boot = new THREE.Group(); lower.add(boot);                  // origin at the ankle
  blk(M.plating, 0.27, 0.17, 0.29, 0, 0, -0.01, boot);              // shaft
  blk(M.plating, 0.27, 0.1, 0.42, 0, -0.08, 0.06, boot);            // foot
  blk(M.sole, 0.29, 0.05, 0.45, 0, -0.13, 0.06, boot, 0.015);       // sole
  return {
    side, thigh, shin, boot, phase: i * 0.5, prev: 0,
    hip: new THREE.Vector3(side * 0.16, 0, 0),
    hipP: new THREE.Vector3(), foot: new THREE.Vector3(), knee: new THREE.Vector3(), ankle: new THREE.Vector3(),
  };
});

// --- upper body (origin at the waist) ---
const upper = new THREE.Group(); upper.rotation.order = 'YXZ'; player.add(upper);
blk(M.suit, 0.74, 0.6, 0.42, 0, 0.36, 0, upper);             // jacket
blk(M.suit, 0.84, 0.26, 0.46, 0, 0.62, 0, upper);            // shoulder yoke
blk(M.lining, 0.5, 0.1, 0.4, 0, 0.78, -0.02, upper);            // suit collar
blk(M.vest, 0.6, 0.4, 0.07, 0, 0.38, 0.22, upper);              // chest rig
for (const x of [-0.17, 0, 0.17]) blk(M.vestDk, 0.15, 0.17, 0.08, x, 0.33, 0.28, upper); // mag pouches
blk(M.vest, 0.6, 0.48, 0.06, 0, 0.42, -0.23, upper);            // rig back panel
for (const x of [-0.21, 0.21]) blk(M.vest, 0.12, 0.05, 0.5, x, 0.77, 0, upper); // shoulder straps
blk(M.module, 0.48, 0.42, 0.18, 0, 0.36, -0.33, upper);         // pack
blk(M.vestDk, 0.3, 0.14, 0.06, 0, 0.27, -0.44, upper);          // pack pocket
blk(M.trim, 0.68, 0.17, 0.17, 0, 0.66, -0.36, upper);        // power pack
for (const x of [-0.2, 0.2]) blk(M.plating, 0.05, 0.19, 0.19, x, 0.66, -0.36, upper, 0.01); // module clamps

const head = new THREE.Group();
head.position.set(0, 0.8, 0.02);
head.rotation.order = 'YXZ';
upper.add(head);
blk(M.lining, 0.24, 0.18, 0.25, 0, 0.05, 0, head);
blk(M.helmet, 0.59, 0.53, 0.56, 0, 0.34, 0, head, 0.11);
blk(M.visor, 0.49, 0.25, 0.11, 0, 0.32, 0.246, head, 0.045);
blk(M.status, 0.41, 0.047, 0.023, 0, 0.365, 0.306, head, 0.012);
blk(M.plating, 0.39, 0.1, 0.1, 0, 0.15, 0.221, head, 0.028);
for (const side of [-1, 1]) {
  blk(M.plating, 0.1, 0.27, 0.28, side * 0.293, 0.34, -0.02, head, 0.035);
  blk(M.status, 0.024, 0.16, 0.028, side * 0.28, 0.32, -0.284, head, 0.005);
}
blk(M.status, 0.29, 0.047, 0.04, 0, 0.49, -0.46, upper, 0.009);

// --- rifle: origin at the butt plate, barrel along +Z ---
const gun = new THREE.Group(); gun.rotation.order = 'YXZ'; player.add(gun);
blk(M.rubber, 0.13, 0.19, 0.04, 0, -0.02, 0.02, gun, 0.01);     // butt pad
blk(M.gunBody, 0.12, 0.17, 0.24, 0, -0.02, 0.15, gun);             // stock
blk(M.gunBody, 0.1, 0.2, 0.1, 0, -0.11, 0.29, gun).rotation.x = 0.35; // pistol grip
blk(M.metal, 0.14, 0.15, 0.4, 0, 0.03, 0.44, gun);              // receiver
blk(M.metal, 0.04, 0.03, 0.12, 0, -0.07, 0.37, gun, 0.01);      // trigger guard
const mag = blk(M.metal, 0.09, 0.24, 0.12, 0, -0.14, 0.52, gun); mag.rotation.x = -0.12;
blk(M.gunBody, 0.13, 0.13, 0.36, 0, 0.01, 0.8, gun);               // handguard
blk(M.metal, 0.06, 0.06, 0.46, 0, 0.03, 1.18, gun, 0.015);      // barrel
blk(M.metal, 0.085, 0.085, 0.08, 0, 0.03, 1.42, gun, 0.015);    // muzzle brake
blk(M.metal, 0.03, 0.07, 0.03, 0, 0.09, 1.34, gun, 0.008);      // front sight
blk(M.rubber, 0.075, 0.075, 0.4, 0, 0.17, 0.46, gun, 0.02);     // scope tube
blk(M.rubber, 0.1, 0.1, 0.08, 0, 0.17, 0.28, gun, 0.02);        // eyepiece
blk(M.rubber, 0.11, 0.11, 0.09, 0, 0.17, 0.66, gun, 0.02);      // objective bell
blk(M.lens, 0.08, 0.08, 0.01, 0, 0.17, 0.706, gun, 0.004);      // lens glint
for (const z of [0.38, 0.56]) blk(M.metal, 0.04, 0.07, 0.04, 0, 0.11, z, gun, 0.01); // scope rings
for (const x of [-0.071, 0.071]) {
  blk(M.status, 0.022, 0.035, 0.46, x, 0.052, 0.86, gun, 0.006);
}
const GRIP_R = new THREE.Vector3(0, -0.1, 0.3);    // firing hand on the pistol grip
const GRIP_L = new THREE.Vector3(0, -0.07, 0.74);  // support hand under the handguard
const MAG_Y = mag.position.y;
const MAG_BASE = new THREE.Vector3(0, -0.29, 0.53); // bottom of the seated magazine
const EJECT = new THREE.Vector3(-0.08, 0.06, 0.48); // ejection port (right side)
// the fresh magazine the support hand brings up from the chest rig
const spareMag = new THREE.Mesh(mag.geometry, M.metal); spareMag.castShadow = true; player.add(spareMag);
// bullets spawn here
const muzzle = new THREE.Object3D(); muzzle.position.set(0, 0.03, 1.47); gun.add(muzzle);

// --- arms: built along local Y, laid between the joints every frame ---
const arms = [1, -1].map(side => {
  const up = blk(M.suit, 0.2, UPPER_ARM + 0.1, 0.21, 0, 0, 0, player);
  blk(M.suit, 0.25, 0.24, 0.25, 0, UPPER_ARM / 2, 0, up);         // shoulder
  const fore = blk(M.suit, 0.18, FOREARM + 0.08, 0.19, 0, 0, 0, player);
  blk(M.module, 0.21, 0.08, 0.22, 0, -FOREARM / 2 + 0.05, 0, fore);  // rolled cuff
  const hand = blk(M.glove, 0.14, 0.15, 0.17, 0, 0, 0, player);
  return {
    side, up, fore, hand,
    shoulder: new THREE.Vector3(side * 0.41, 0.7, 0),
    pole: side > 0 ? new THREE.Vector3(0.5, -1, -0.1) : new THREE.Vector3(-0.8, -1, -0.5), // elbows down & out
    sh: new THREE.Vector3(), elbow: new THREE.Vector3(), wrist: new THREE.Vector3(),
  };
});

// --- muzzle flash: a real light (with shadows) plus an additive star of blocks and a soft glow ---
const FLASH_COLOR = CYAN, FLASH_HOT = AMBER; // normal / OVERCHARGE
const muzzleLight = new THREE.PointLight(FLASH_COLOR, 0, 14, 2);
muzzleLight.castShadow = true;
muzzleLight.shadow.mapSize.set(512, 512);
muzzleLight.shadow.camera.near = 0.1;
muzzleLight.shadow.bias = -0.004;
// only re-rendered on frames the flash is lit, so an idle gun costs no shadow passes
muzzleLight.shadow.autoUpdate = false;
muzzleLight.shadow.needsUpdate = true;
scene.add(muzzleLight);

function glowTexture() {
  const c = document.createElement('canvas');
  c.width = c.height = 64;
  const g = c.getContext('2d');
  const grad = g.createRadialGradient(32, 32, 0, 32, 32, 32);
  grad.addColorStop(0, 'rgba(255,255,255,1)');
  grad.addColorStop(0.25, 'rgba(255,255,255,0.45)');
  grad.addColorStop(1, 'rgba(255,255,255,0)');
  g.fillStyle = grad;
  g.fillRect(0, 0, 64, 64);
  const t = new THREE.CanvasTexture(c);
  t.colorSpace = THREE.SRGBColorSpace;
  return t;
}
const additive = color => new THREE.MeshBasicMaterial({
  color, transparent: true, opacity: 0, blending: THREE.AdditiveBlending, depthWrite: false,
});
const flashCoreMat = additive(0xe1fcff), flashFireMat = additive(FLASH_COLOR);
// four-sided cone, base at the origin, tip at +Z: a faceted tongue of flame
const FLAME = new THREE.ConeGeometry(0.5, 1, 4).rotateX(Math.PI / 2).translate(0, 0, 0.5);
const flash = new THREE.Group(); flash.visible = false; muzzle.add(flash);
const flashCore = new THREE.Mesh(new THREE.OctahedronGeometry(0.5), flashCoreMat); flash.add(flashCore);
const flashSpikes = [];
for (let i = 0; i < 6; i++) {
  // 0: white-hot core jet, 1: the orange jet around it, 2-5: petals fanning out to the sides
  const pivot = new THREE.Group();
  pivot.rotation.z = i * Math.PI / 2 + Math.PI / 4;
  const tilt = new THREE.Group(); tilt.rotation.x = i > 1 ? -1.05 : 0; pivot.add(tilt);
  const spike = new THREE.Mesh(FLAME, i ? flashFireMat : flashCoreMat); tilt.add(spike);
  flash.add(pivot);
  flashSpikes.push(spike);
}
const flashGlow = new THREE.Sprite(new THREE.SpriteMaterial({
  map: glowTexture(), color: FLASH_COLOR, transparent: true, opacity: 0,
  blending: THREE.AdditiveBlending, depthWrite: false,
}));
flashGlow.position.z = 0.15;
flash.add(flashGlow);
scene.add(player);

// --- shell casings, dropped magazines and gun smoke ---
const debris = [];
const casingGeo = bevelBox(0.05, 0.05, 0.12, 0.012);
const smokeMats = Array.from({ length: 24 }, () =>
  new THREE.MeshStandardMaterial({ color: 0x8d8f94, roughness: 1, transparent: true, opacity: 0, depthWrite: false }));
let smokeI = 0;
function spawnDebris(mesh, vel, o) {
  mesh.userData = { vel, spin: o.spin || new THREE.Vector3(), life: o.life, max: o.life, bounce: o.bounce, smoke: o.smoke, size: mesh.scale.clone() };
  scene.add(mesh);
  debris.push(mesh);
}
function updateDebris(dt) {
  for (let i = debris.length - 1; i >= 0; i--) {
    const d = debris[i], u = d.userData;
    u.life -= dt;
    if (u.smoke) {
      // puffs swell, rise and thin out
      const k = 1 - u.life / u.max;
      d.scale.setScalar(u.smoke * (1 + k * 2.5));
      d.material.opacity = 0.32 * (1 - k) * (1 - k);
      u.vel.multiplyScalar(Math.exp(-3 * dt));
      d.position.addScaledVector(u.vel, dt);
      d.position.y += 0.5 * dt;
    } else {
      u.vel.y -= 16 * dt;
      d.position.addScaledVector(u.vel, dt);
      d.rotation.x += u.spin.x * dt; d.rotation.y += u.spin.y * dt; d.rotation.z += u.spin.z * dt;
      if (d.position.y < u.bounce) {
        // clatter on the boards, then lie flat
        d.position.y = u.bounce;
        u.vel.set(u.vel.x * 0.45, Math.abs(u.vel.y) > 1.5 ? -u.vel.y * 0.35 : 0, u.vel.z * 0.45);
        u.spin.multiplyScalar(0.4);
        if (u.vel.y === 0) { u.spin.set(0, 0, 0); d.rotation.x = 0; d.rotation.z = Math.round(d.rotation.z / Math.PI) * Math.PI; }
      }
      if (u.life < 0.4) d.scale.copy(u.size).multiplyScalar(Math.max(0.01, u.life / 0.4)); // shrink away
    }
    if (u.life <= 0) { scene.remove(d); debris.splice(i, 1); }
  }
}

// --- animation state ---
const rig = {
  phase: 0,      // gait cycle, 0..1
  gait: 0,       // 0 standing .. 1 full stride
  turnW: 0,      // stepping in place while turning on the spot
  turning: false,
  hipYaw: 0,     // lower body's world yaw
  back: false,   // backpedaling (hips face away from the travel direction)
  stride: new THREE.Vector3(0, 0, 1), // travel direction in hip space
  leanF: 0, leanS: 0,
  kick: 0,       // recoil, 1 on the shot
  flash: 0,      // muzzle flash, 1 on the shot
  flashPeak: 0,
  reload: 0,     // reload pose weight
  magDropped: false,
  t: 0,
};
const BETA = 0.38;      // fraction of the gait cycle each boot spends planted (under half: a run)
const HIP_MAX = 1.0;    // furthest the hips turn away from the aim (rad)
const IDLE_HIP = -0.35; // standing: hips bladed, left foot leading
const BLADE = -0.62;    // torso turned so the left shoulder leads toward the target
const POCKET = new THREE.Vector3(-0.13, 0.6, 0.22);   // right shoulder pocket the stock sits in (upper-local)
const POUCH = new THREE.Vector3(0.17, 0.33, 0.36);    // chest-rig pouch the spare mag comes from (upper-local)
const KNEE_POLE = new THREE.Vector3(0, 0, 1);

const wrapA = a => a - Math.round(a / (Math.PI * 2)) * Math.PI * 2;
const damp = (a, b, k, dt) => a + (b - a) * (1 - Math.exp(-k * dt));
const ease = t => t * t * (3 - 2 * t);

// where one foot is in its gait cycle p (0..1): planted for the first `beta` of it,
// sliding back under the body (s: 0.5 -> -0.5 of the stride), then lifted and
// carried forward. Shared by the operator and the drones.
const _foot = { s: 0, lift: 0, pitch: 0 };
function footCycle(p, beta) {
  if (p < beta) {
    _foot.s = 0.5 - p / beta; _foot.lift = 0; _foot.pitch = 0;
  } else {
    const t = (p - beta) / (1 - beta);
    _foot.s = -0.5 + ease(t);
    _foot.lift = Math.sin(Math.PI * t);
    _foot.pitch = 0.6 * (1 - t) * (1 - t) - 0.3 * t * t; // toe-off, then heel first
  }
  return _foot;
}

const _ikD = new THREE.Vector3(), _ikP = new THREE.Vector3();
// two-bone IK: from joint `a`, reach toward `t` with bones l1 then l2, bending
// the middle joint toward `pole`. Writes the middle joint into `out`.
function ik2(a, t, l1, l2, pole, out) {
  _ikD.subVectors(t, a);
  const d = THREE.MathUtils.clamp(_ikD.length(), Math.abs(l1 - l2) + 1e-3, l1 + l2 - 1e-3);
  _ikD.normalize();
  const x = (l1 * l1 - l2 * l2 + d * d) / (2 * d); // law of cosines: distance along the reach
  _ikP.copy(pole).addScaledVector(_ikD, -pole.dot(_ikD)).normalize();
  return out.copy(a).addScaledVector(_ikD, x).addScaledVector(_ikP, Math.sqrt(Math.max(0, l1 * l1 - x * x)));
}
const _bx = new THREE.Vector3(), _by = new THREE.Vector3(), _bz = new THREE.Vector3(), _bm = new THREE.Matrix4();
// lay a limb block (built along local Y) from joint `a` to joint `b`, front toward `face`
function bone(mesh, a, b, face) {
  _by.subVectors(a, b).normalize();
  _bz.copy(face).addScaledVector(_by, -face.dot(_by));
  if (_bz.lengthSq() < 1e-6) _bz.set(0, 0, 1);
  _bz.normalize();
  _bx.crossVectors(_by, _bz);
  mesh.quaternion.setFromRotationMatrix(_bm.makeBasis(_bx, _by, _bz));
  mesh.position.addVectors(a, b).multiplyScalar(0.5);
}

// called by fire(): kick the rifle back, light the flash, spit a casing and some smoke
function muzzleFlash(hot) {
  rig.kick = 1;
  rig.flash = 1;
  rig.flashPeak = 40 + Math.random() * 20;
  const color = hot ? FLASH_HOT : FLASH_COLOR;
  muzzleLight.color.setHex(color);
  flashFireMat.color.setHex(color);
  flashGlow.material.color.setHex(color);
  // a different star every shot
  flash.rotation.z = Math.random() * Math.PI;
  flash.scale.setScalar(0.85 + Math.random() * 0.4);
  flashCore.scale.setScalar(0.16 + Math.random() * 0.06);
  flashSpikes.forEach((s, i) => {
    const len = i > 1 ? 0.2 + Math.random() * 0.22 : (i ? 0.65 : 0.4) + Math.random() * 0.35;
    const w = i > 1 ? 0.09 : i ? 0.24 : 0.13;
    s.scale.set(w, w, len);
  });
  flashGlow.scale.setScalar(2 + Math.random() * 0.6);

  gun.updateWorldMatrix(true, false);
  // brass flips out of the ejection port to the right
  const casing = new THREE.Mesh(casingGeo, M.trim);
  casing.position.copy(EJECT).applyMatrix4(gun.matrixWorld);
  casing.quaternion.setFromRotationMatrix(gun.matrixWorld);
  const right = new THREE.Vector3(-1, 0, 0).transformDirection(gun.matrixWorld);
  const back = new THREE.Vector3(0, 0, -1).transformDirection(gun.matrixWorld);
  const vel = right.multiplyScalar(2.4 + Math.random() * 1.2).addScaledVector(back, 0.6).add(new THREE.Vector3(0, 3 + Math.random(), 0));
  spawnDebris(casing, vel, {
    life: 2.5, bounce: 0.025,
    spin: new THREE.Vector3(Math.random() * 20 - 10, Math.random() * 20 - 10, Math.random() * 20 - 10),
  });
  // a puff of smoke from the muzzle
  const smoke = new THREE.Mesh(BOX, smokeMats[smokeI++ % smokeMats.length]);
  muzzle.getWorldPosition(smoke.position);
  smoke.rotation.set(Math.random() * 3, Math.random() * 3, 0);
  const fwd = new THREE.Vector3(0, 0, 1).transformDirection(gun.matrixWorld);
  spawnDebris(smoke, fwd.multiplyScalar(1.6), { life: 0.55, smoke: 0.14 + Math.random() * 0.06 });
}

const _v = new THREE.Vector3(), _w = new THREE.Vector3(), _gR = new THREE.Vector3(), _gL = new THREE.Vector3();
// the support hand's path through a reload: [u (0..1 of the reload), point, its space]
const MAG_OUT = MAG_BASE.clone().setY(MAG_BASE.y - 0.24), MAG_LINEUP = MAG_BASE.clone().setY(MAG_BASE.y - 0.2);
const RELOAD_PATH = [
  [0, GRIP_L, 'gun'],       // on the handguard
  [0.12, MAG_BASE, 'gun'],  // grab the mag
  [0.22, MAG_OUT, 'gun'],   // rip it out
  [0.45, POUCH, 'upper'],   // fresh one off the chest rig
  [0.55, POUCH, 'upper'],
  [0.78, MAG_LINEUP, 'gun'], // line it up under the magwell
  [0.95, MAG_BASE, 'gun'],  // seat it
];
const _ra = new THREE.Vector3(), _rb = new THREE.Vector3();
function reloadHand(u, out) {
  const at = (k, v) => v.copy(RELOAD_PATH[k][1]).applyMatrix4(RELOAD_PATH[k][2] === 'gun' ? gun.matrix : upper.matrix);
  let i = RELOAD_PATH.length - 1;
  while (i > 0 && u < RELOAD_PATH[i][0]) i--;
  if (i === RELOAD_PATH.length - 1) return at(i, out);
  const t = (u - RELOAD_PATH[i][0]) / (RELOAD_PATH[i + 1][0] - RELOAD_PATH[i][0]);
  return out.copy(at(i, _ra)).lerp(at(i + 1, _rb), ease(t));
}

// pose the whole rig for this frame. (mx, mz) is the operator's world velocity.
function animatePlayer(dt, mx, mz) {
  const pace = Math.min(1, Math.hypot(mx, mz) / state.speed);
  const moving = pace > 0.05;
  const aim = player.rotation.y;
  rig.t += dt;
  rig.gait = damp(rig.gait, pace, moving ? 9 : 7, dt);

  // --- lower-body heading: the hips turn toward the travel direction (or away
  // from it when backpedaling) but never more than HIP_MAX off the aim, and the
  // feet step along whatever direction is left over ---
  const moveYaw = Math.atan2(mx, mz);
  let hipTarget = rig.hipYaw;
  if (moving) {
    const rel = wrapA(moveYaw - aim);
    if (rig.back ? Math.abs(rel) < 1.25 : Math.abs(rel) > 1.9) rig.back = !rig.back; // hysteresis
    hipTarget = aim + THREE.MathUtils.clamp(rig.back ? wrapA(rel - Math.PI) : rel, -HIP_MAX, HIP_MAX);
    rig.turning = false;
  } else {
    // standing: feet stay planted until the aim twists the hips too far, then step around
    const idle = aim + IDLE_HIP;
    if (Math.abs(wrapA(idle - rig.hipYaw)) > 0.8) rig.turning = true;
    if (rig.turning) {
      hipTarget = idle;
      if (Math.abs(wrapA(idle - rig.hipYaw)) < 0.06) rig.turning = false;
    }
  }
  rig.hipYaw = wrapA(rig.hipYaw + wrapA(hipTarget - rig.hipYaw) * (1 - Math.exp(-10 * dt)));
  const hipRel = wrapA(rig.hipYaw - aim);
  lower.rotation.y = hipRel;
  if (moving) { const s = moveYaw - rig.hipYaw; rig.stride.set(Math.sin(s), 0, Math.cos(s)); }

  // --- gait clock: cadence rises gently with speed (MOTION SERVO) ---
  rig.turnW = damp(rig.turnW, rig.turning ? 1 : 0, 12, dt);
  const drive = Math.max(rig.gait, rig.turnW * 0.7);
  const freq = 2.45 * Math.sqrt(state.speed / PLAYER_SPEED); // strides per second
  if (drive > 0.02) rig.phase = (rig.phase + freq * dt) % 1;
  const ph = rig.phase * Math.PI * 2;
  // stride length is what the speed asks for, capped at what the legs can reach
  const L = Math.min(0.86, state.speed * BETA / freq) * rig.gait;
  const liftH = 0.2 * rig.gait + 0.1 * rig.turnW;

  // --- pelvis: lowest as each boot takes the weight, highest in between ---
  const bob = -0.04 * rig.gait * Math.cos(2 * (ph - Math.PI * BETA));
  const pelvisY = HIP_H - 0.11 * rig.gait + bob; // runners sit lower, which buys the legs reach
  pelvis.position.y = pelvisY;
  pelvis.rotation.y = 0.14 * rig.gait * Math.sin(ph) * rig.stride.z; // hips swing with the legs
  pelvis.rotation.z = 0.05 * rig.gait * Math.sin(ph);                // hip drop
  pelvis.updateMatrix();

  // --- legs: each boot is planted for BETA of the cycle, then arcs forward ---
  for (const leg of legs) {
    const p = (rig.phase + leg.phase) % 1;
    const { s, lift, pitch } = footCycle(p, BETA);
    if (p < leg.prev && drive > 0.3) audio.step();    // a footfall each time a boot lands
    leg.prev = p;
    const restZ = leg.side > 0 ? 0.12 : -0.1;          // standing: left foot leads
    leg.foot.set(leg.side * (0.17 + 0.03 * (1 - rig.gait)), ANKLE_H + lift * liftH, restZ * (1 - rig.gait))
      .addScaledVector(rig.stride, s * L);
    leg.hipP.copy(leg.hip).applyMatrix4(pelvis.matrix);
    ik2(leg.hipP, leg.foot, THIGH, SHIN, KNEE_POLE, leg.knee);
    leg.ankle.subVectors(leg.foot, leg.knee).normalize().multiplyScalar(SHIN).add(leg.knee);
    bone(leg.thigh, leg.hipP, leg.knee, KNEE_POLE);
    bone(leg.shin, leg.knee, leg.ankle, KNEE_POLE);
    leg.boot.position.copy(leg.ankle);
    leg.boot.rotation.set(pitch * rig.gait * Math.sign(rig.stride.z || 1), leg.side * 0.08, 0);
  }

  // --- upper body: bladed toward the gun, half-following the hips, leaning into the run ---
  const breathe = Math.sin(rig.t * 2.1) * (1 - rig.gait);
  const tw = BLADE + 0.3 * (hipRel - BLADE) - 0.07 * rig.gait * Math.sin(ph) * rig.stride.z;
  const travel = moveYaw - (aim + tw);
  rig.leanF = damp(rig.leanF, moving ? Math.cos(travel) : 0, 8, dt);
  rig.leanS = damp(rig.leanS, moving ? Math.sin(travel) : 0, 8, dt);
  rig.kick *= Math.exp(-14 * dt);
  upper.position.set(0, pelvisY + 0.1 + 0.006 * breathe, 0);
  upper.rotation.set(0.05 + 0.1 * rig.leanF * rig.gait - 0.08 * rig.kick, tw, -0.07 * rig.leanS * rig.gait);
  upper.updateMatrix();

  // --- reload: tip the rifle in, strip the mag, pull a fresh one off the chest rig ---
  rig.reload = damp(rig.reload, state.reloading ? 1 : 0, state.reloading ? 14 : 9, dt);
  const rl = ease(rig.reload);
  const u = state.reloading ? state.reloadT / state.reloadTime : 1;
  head.rotation.set(0.1 + 0.32 * rl, -tw * 0.85 + 0.25 * rl, 0);

  // --- rifle: butt in the shoulder pocket, barrel down the aim line ---
  _v.copy(POCKET).applyMatrix4(upper.matrix);
  gun.position.set(_v.x + 0.1 * rl, _v.y - 0.1 * rl + 0.012 * breathe, _v.z - 0.11 * rig.kick - 0.08 * rl);
  gun.rotation.set(-0.16 * rig.kick - 0.35 * rl + 0.01 * Math.sin(rig.t * 1.3), 0.15 * rl, 0.65 * rl);
  gun.updateMatrix();

  // magazine: rides out with the hand, drops free, the spare rides in from the pouch
  if (!state.reloading || u < 0.12) rig.magDropped = false;
  let magDrop = 0;
  if (state.reloading && u >= 0.12 && u < 0.22) magDrop = 0.24 * ease((u - 0.12) / 0.1);
  if (state.reloading && u >= 0.78) magDrop = 0.2 * (1 - ease(Math.min(1, (u - 0.78) / 0.17)));
  mag.position.y = MAG_Y - magDrop;
  mag.visible = !state.reloading || u < 0.22 || u >= 0.78;
  if (state.reloading && u >= 0.22 && !rig.magDropped) {
    rig.magDropped = true;
    const old = new THREE.Mesh(mag.geometry, M.metal);
    mag.getWorldPosition(old.position); mag.getWorldQuaternion(old.quaternion);
    spawnDebris(old, new THREE.Vector3(0, -1, 0), { life: 4, bounce: 0.05, spin: new THREE.Vector3(3, 0, 2) });
  }

  // hands: the firing hand never leaves the grip; the support hand works the reload
  _gR.copy(GRIP_R).applyMatrix4(gun.matrix);
  _gL.copy(GRIP_L).applyMatrix4(gun.matrix);
  if (rig.reload > 0.001) _gL.lerp(reloadHand(u, _w), rl);
  for (const arm of arms) {
    arm.sh.copy(arm.shoulder).applyMatrix4(upper.matrix);
    const target = arm.side < 0 ? _gR : _gL;
    ik2(arm.sh, target, UPPER_ARM, FOREARM, arm.pole, arm.elbow);
    arm.wrist.subVectors(target, arm.elbow).normalize().multiplyScalar(FOREARM).add(arm.elbow);
    bone(arm.up, arm.sh, arm.elbow, arm.pole);
    bone(arm.fore, arm.elbow, arm.wrist, arm.pole);
    arm.hand.position.copy(arm.wrist);
    arm.hand.quaternion.copy(gun.quaternion);
  }
  spareMag.visible = state.reloading && u >= 0.45 && u < 0.78;
  if (spareMag.visible) {
    spareMag.quaternion.copy(gun.quaternion);
    spareMag.position.copy(arms[0].wrist).add(_w.set(0, 0.13, 0).applyQuaternion(gun.quaternion));
  }

  // --- muzzle flash: a few frames of fire, a real light with a fast falloff ---
  rig.flash = Math.max(0, rig.flash - dt / 0.07);
  const f = rig.flash;
  flash.visible = f > 0.3;
  flashCoreMat.opacity = Math.min(1, f * 1.4);
  flashFireMat.opacity = Math.min(1, f * 1.2);
  flashGlow.material.opacity = 0.85 * f;
  muzzleLight.intensity = rig.flashPeak * f * f;
  if (f > 0) {
    muzzle.getWorldPosition(muzzleLight.position);
    muzzleLight.position.x += Math.sin(aim) * 0.4; // just ahead of the brake, so the barrel
    muzzleLight.position.z += Math.cos(aim) * 0.4; // doesn't shadow the shooter
    muzzleLight.shadow.needsUpdate = true;
  }
}

// ===================================================================
// STATE
// ===================================================================
const state = {
  running: false,
  paused: false,
  hp: 3,
  maxHp: 3,
  kills: 0,
  wave: 0,
  mag: 8,
  magSize: 8,
  reloading: false,
  reloadT: 0,
  reloadTime: 1.2,
  fireCd: 0,
  fireRate: 0.13,
  dmgCd: 0,
  // upgradeable stats (see UPGRADES)
  damage: 1,
  pierce: 0,     // extra drones each bullet passes through
  spread: 0,     // extra bullets per shot
  speed: 6.2,
  dropBonus: 0,
  upgrades: {},  // upgrade id -> times taken this run
  // timed power-ups from drops (seconds remaining)
  pDamage: 0,
  pAmmo: 0,
  sinceDrop: 0,  // kills since the last drop (pity timer)
  // wave control
  toSpawn: 0,
  spawnTimer: 0,
  intermission: 0,
  choosing: false, // wave cleared, waiting on an upgrade pick
  droneSpeed: 2.2,
  droneHp: 2,
  shake: 0,
};

const bullets = [];
const drones = [];
const particles = [];

// reusable materials for spawned objects
// tracers: a white-hot core inside a softer colored streak, both additive so they glow
const glowMat = (color, opacity) => new THREE.MeshBasicMaterial({ color, transparent: true, opacity, blending: THREE.AdditiveBlending, depthWrite: false });
const tracerCore = glowMat(0xe1fcff, 1), tracerGlow = glowMat(CYAN, 0.45), tracerGlowHot = glowMat(0xff5a1e, 0.6); // hot: OVERCHARGE
function makeTracer(hot) {
  const b = new THREE.Group(); // +Z is the direction of travel; the streak trails behind the head
  const core = new THREE.Mesh(BOX, tracerCore); core.scale.set(0.05, 0.05, 0.9); core.position.z = -0.35;
  const glow = new THREE.Mesh(BOX, hot ? tracerGlowHot : tracerGlow); glow.scale.set(0.15, 0.15, 1.05); glow.position.z = -0.42;
  b.add(core, glow);
  return b;
}
const sparkMat = new THREE.MeshBasicMaterial({ color: AMBER, toneMapped: false });

// ===================================================================
// INPUT
// ===================================================================
const keys = {};
const mouse = new THREE.Vector2();
let firing = false;
const aimPoint = new THREE.Vector3();
const aimPlane = new THREE.Plane(new THREE.Vector3(0, 1, 0), -0.9);
const raycaster = new THREE.Raycaster();
const touchControls = document.getElementById('touchControls');
const moveStick = { dot: document.getElementById('moveStick'), delta: new THREE.Vector2(), id: null };
const aimStick = { dot: document.getElementById('aimStick'), delta: new THREE.Vector2(), id: null };
const touchDirection = new THREE.Vector2(0, -1);
let touchAiming = false;

function resetStick(stick) {
  stick.id = null;
  stick.delta.set(0, 0);
  stick.dot.classList.remove('active');
}

function syncTouchControls() {
  const active = state.running && !state.paused && !state.choosing;
  if (touchControls.classList.contains('hidden') === !active) return;
  touchControls.classList.toggle('hidden', !active);
  if (!active) {
    resetStick(moveStick);
    resetStick(aimStick);
    firing = false;
  }
}

canvas.addEventListener('pointerdown', e => {
  if (e.pointerType === 'mouse' || !state.running || state.paused || state.choosing) return;
  const stick = e.clientX < window.innerWidth / 2 ? moveStick : aimStick;
  if (stick.id !== null) return;
  stick.id = e.pointerId;
  stick.x = e.clientX;
  stick.y = e.clientY;
  stick.dot.style.left = e.clientX + 'px';
  stick.dot.style.top = e.clientY + 'px';
  stick.dot.style.setProperty('--dx', '0px');
  stick.dot.style.setProperty('--dy', '0px');
  stick.dot.classList.add('active');
  canvas.setPointerCapture(e.pointerId);
  e.preventDefault();
});
canvas.addEventListener('pointermove', e => {
  const stick = [moveStick, aimStick].find(item => item.id === e.pointerId);
  if (!stick) return;
  stick.delta.set((e.clientX - stick.x) / 46, (e.clientY - stick.y) / 46).clampLength(0, 1);
  stick.dot.style.setProperty('--dx', stick.delta.x * 34 + 'px');
  stick.dot.style.setProperty('--dy', stick.delta.y * 34 + 'px');
  if (stick === aimStick && stick.delta.lengthSq() > 0.025) {
    touchDirection.copy(stick.delta).normalize();
    touchAiming = true;
    firing = true;
  }
});
function releaseStick(e) {
  if (e.pointerId === moveStick.id) resetStick(moveStick);
  if (e.pointerId === aimStick.id) {
    resetStick(aimStick);
    firing = false;
  }
}
canvas.addEventListener('lostpointercapture', releaseStick);
document.getElementById('touchReload').addEventListener('click', startReload);
document.getElementById('touchPause').addEventListener('click', () => setPaused(true));

window.addEventListener('keydown', e => {
  if (menu.key(e)) { e.preventDefault(); return; }
  if (e.code === 'Enter' && !state.running && !document.getElementById('death').classList.contains('hidden')) return startGame();
  keys[e.code] = true;
  if (e.code === 'Escape' || e.code === 'KeyP') { if (!e.repeat) setPaused(!state.paused); return; }
  if (state.paused) return;
  if (e.code === 'KeyR') startReload();
  if (state.choosing && /^Digit[1-3]$/.test(e.code)) choose(+e.code.slice(5) - 1);
  if (e.code === 'KeyM') {
    const m = audio.toggleMute();
    document.getElementById('reloadHint').textContent = m ? '[R] RELOAD   ·   [M] MUTED' : '[R] RELOAD';
  }
});
window.addEventListener('keyup', e => { keys[e.code] = false; });
window.addEventListener('mousemove', e => {
  touchAiming = false;
  mouse.x = (e.clientX / window.innerWidth) * 2 - 1;
  mouse.y = -(e.clientY / window.innerHeight) * 2 + 1;
});
canvas.addEventListener('mousedown', e => { if (e.button === 0) firing = true; });
window.addEventListener('mouseup', () => { firing = false; });
window.addEventListener('contextmenu', e => e.preventDefault());

// the death screen: go again, or back to the title
document.getElementById('retryBtn').addEventListener('click', () => startGame());
document.getElementById('deathQuitBtn').addEventListener('click', quitToTitle);
document.getElementById('resumeBtn').addEventListener('click', () => setPaused(false));
document.getElementById('quitBtn').addEventListener('click', quitToTitle);
// alt-tabbing away mid-run pauses (and would otherwise leave WASD stuck down)
window.addEventListener('blur', () => setPaused(true));
document.getElementById('cards').addEventListener('click', e => {
  const c = e.target.closest('.card');
  if (c) choose(+c.dataset.i);
});
document.getElementById('cards').addEventListener('mouseover', e => {
  const c = e.target.closest('.card');
  if (c && !c.contains(e.relatedTarget) && state.choosing) audio.hover(+c.dataset.i);
});

// ===================================================================
// HUD
// ===================================================================
const hud = {
  wave: document.getElementById('waveNum'),
  kills: document.getElementById('kills'),
  zleft: document.getElementById('zleft'),
  remainingStat: document.getElementById('remainingStat'),
  health: document.getElementById('health'),
  shieldPips: document.getElementById('shieldPips'),
  shieldCount: document.getElementById('shieldCount'),
  powerups: document.getElementById('powerups'),
  toast: document.getElementById('toast'),
  toastTitle: document.getElementById('toastTitle'),
  toastDetail: document.getElementById('toastDetail'),
  picker: document.getElementById('picker'),
  pickerTitle: document.getElementById('pickerTitle'),
  pickerSub: document.getElementById('pickerSub'),
  cards: document.getElementById('cards'),
  mag: document.getElementById('mag'),
  reloadBar: document.getElementById('reloadBar'),
  reloadFill: document.getElementById('reloadFill'),
  flash: document.getElementById('flash'),
  banner: document.getElementById('banner'),
  bannerText: document.getElementById('bannerText'),
  bannerSub: document.getElementById('bannerSub'),
};

function updateHUD() {
  syncTouchControls();
  hud.wave.textContent = state.wave;
  hud.kills.textContent = state.kills;
  const remaining = drones.length + state.toSpawn;
  hud.remainingStat.hidden = state.intermission > 0 || state.choosing;
  hud.zleft.textContent = remaining;
  if (hud.shieldPips.children.length !== state.maxHp) {
    hud.shieldPips.innerHTML = '<span class="shield-pip"></span>'.repeat(state.maxHp);
  }
  const shieldLabel = `Shields: ${state.hp} of ${state.maxHp}`;
  if (hud.health.getAttribute('aria-label') !== shieldLabel) {
    hud.health.setAttribute('aria-label', shieldLabel);
    hud.shieldCount.textContent = `${state.hp} / ${state.maxHp}`;
    [...hud.shieldPips.children].forEach((pip, i) => pip.classList.toggle('dead', i >= state.hp));
  }
  // power-up time left as a clock: 0:10 … 0:01
  const clock = t => { const s = Math.ceil(t); return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`; };
  let pu = '';
  if (state.pDamage > 0) pu += `<div style="color:#ff7a2e">OVERCHARGE ${clock(state.pDamage)}</div>`;
  if (state.pAmmo > 0) pu += `<div style="color:#76bcf0">INFINITE CELL ${clock(state.pAmmo)}</div>`;
  hud.powerups.innerHTML = pu;
  let m = '';
  for (let i = 0; i < state.magSize; i++) {
    m += `<span class="${i < state.mag ? 'live' : 'empty'}">▮</span>`;
  }
  hud.mag.innerHTML = m;
  hud.reloadBar.classList.toggle('active', state.reloading);
  if (state.reloading) hud.reloadFill.style.width = (state.reloadT / state.reloadTime * 100) + '%';
}

let flashT = 0;
function damageFlash() { hud.flash.style.background = '#ff1e1e'; flashT = 0.4; state.shake = 0.5; }

const toastQueue = [];
let toastTime = 0;

function updateToast(dt) {
  toastTime = Math.max(0, toastTime - dt);
  if (toastTime > 0) return;
  if (hud.toast.style.opacity === '1') {
    hud.toast.style.opacity = 0;
    toastTime = 0.25; // let the current notice fade before replacing it
    return;
  }

  const next = toastQueue.shift();
  if (!next) return;
  const { text, color, pickup } = next;
  const firstPickup = pickup && !seenDrops.has(pickup.id);
  hud.toastTitle.textContent = text;
  hud.toastDetail.textContent = firstPickup ? pickup.detail : '';
  hud.toast.style.color = color;
  hud.toast.style.opacity = 1;
  toastTime = firstPickup ? 2.2 : 1.4;
  if (firstPickup) {
    seenDrops.add(pickup.id);
    store.set('seen-drops', [...seenDrops]);
  }
}

function showBanner(text, sub, dur = 1.6) {
  hud.bannerText.textContent = text;
  hud.bannerSub.textContent = sub || '';
  hud.banner.style.opacity = 1;
  clearTimeout(showBanner._t);
  showBanner._t = setTimeout(() => { hud.banner.style.opacity = 0; }, dur * 1000);
}

// ===================================================================
// WEAPON
// ===================================================================
function startReload() {
  if (!state.running || state.reloading || state.mag === state.magSize) return;
  state.reloading = true;
  state.reloadT = 0;
  audio.reloadOut();
}
function finishReload() {
  state.reloading = false;
  state.mag = state.magSize;
  audio.reloadIn();
}

function fire() {
  if (state.fireCd > 0 || state.reloading || state.mag <= 0 || !state.running) return;
  if (state.pAmmo <= 0) {
    state.mag--;
    if (state.mag <= 0) startReload();
  }
  state.fireCd = state.fireRate;

  const aim = new THREE.Vector3(aimPoint.x - player.position.x, 0, aimPoint.z - player.position.z);
  if (aim.lengthSq() < 1e-4) return;
  aim.normalize();

  // spawn at muzzle world position; SPLIT BEAM fans extra bullets around the aim line
  const mp = new THREE.Vector3();
  muzzle.getWorldPosition(mp);
  const count = 1 + state.spread;
  for (let k = 0; k < count; k++) {
    const a = (k - (count - 1) / 2) * 0.13;
    const c = Math.cos(a), s = Math.sin(a);
    const dir = new THREE.Vector3(aim.x * c - aim.z * s, 0, aim.x * s + aim.z * c);
    const b = makeTracer(state.pDamage > 0);
    b.position.copy(mp);
    b.lookAt(mp.clone().add(dir));
    b.userData = { dir, life: 0.9, pierce: state.pierce, hits: new Set() };
    scene.add(b);
    bullets.push(b);
  }

  muzzleFlash(state.pDamage > 0);
  state.shake = Math.max(state.shake, 0.12);
  audio.shot(state.pDamage > 0, state.spread);
}

// ===================================================================
// DRONES
// ===================================================================
// Built like the operator (chamfered blocks, IK limbs, planted feet), but
// each body part is baked into one vertex-colored mesh so a horde of 30
// stays cheap: every drone shares a handful of geometries and two materials.

const Z_THIGH = 0.42, Z_SHIN = 0.4, Z_ANKLE = 0.11, Z_HIP = 0.9;
const Z_UPPER_ARM = 0.4, Z_FOREARM = 0.39;
// the rig is modeled in slightly smaller units than the operator's: Z_SCALE brings its legs and
// height to his, and Z_UPPER widens the torso and head to his shoulders, so they stand eye to eye
const Z_SCALE = 1.08, Z_UPPER = 1.1;
const DRONE_PALETTES = [
  { plate: 0x405565, joint: 0x1c2630, trim: 0xaf793a, optic: 0xff9749 },
  { plate: 0x68747e, joint: 0x26313b, trim: 0x9b5148, optic: 0xff6e62 },
  { plate: 0x384956, joint: 0x19242c, trim: 0x8c5fa2, optic: 0xe396ff },
];
function bakeDrone({ plate, joint, trim, optic }, seed) {
  const rng = seeded(seed);
  const b = parts => bakeBlocks(parts, rng);
  const boot = b([[0.26, 0.16, 0.34, 0, -0.05, 0.05, joint], [0.23, 0.07, 0.21, 0, 0.015, 0.11, plate]]);
  return {
    head: b([
      [0.48, 0.41, 0.48, 0, 0.24, -0.025, plate, 0, 0, 0, 0.096],
      [0.38, 0.19, 0.1, 0, 0.265, 0.221, joint],
      [0.1, 0.33, 0.25, -0.235, 0.24, -0.07, trim],
      [0.1, 0.33, 0.25, 0.235, 0.24, -0.07, trim],
      [0.036, 0.18, 0.04, 0.16, 0.49, -0.16, joint, -0.26],
    ]),
    jaw: b([[0.26, 0.075, 0.16, 0, 0.042, 0.21, joint], [0.17, 0.04, 0.04, 0, 0.055, 0.293, trim]]),
    eyes: b([[0.28, 0.05, 0.025, 0, 0.27, 0.274, 0xffffff], [0.065, 0.09, 0.027, 0, 0.27, 0.278, 0xffffff]]),
    torso: b([
      [0.55, 0.61, 0.42, 0, 0.32, 0, joint, 0, 0, 0, 0.06],
      [0.69, 0.38, 0.25, 0, 0.43, 0.115, plate, 0, 0, 0, 0.066],
      [0.2, 0.08, 0.048, 0, 0.46, 0.248, trim],
      [0.28, 0.36, 0.19, 0, 0.42, -0.23, plate],
      [0.17, 0.09, 0.055, 0, 0.5, -0.346, trim],
    ]),
    pelvis: b([[0.52, 0.26, 0.32, 0, 0.02, 0, joint], [0.58, 0.09, 0.35, 0, 0.13, 0, plate]]),
    upperArm: b([[0.13, Z_UPPER_ARM, 0.14, 0, 0, 0, joint], [0.25, 0.26, 0.29, 0, 0.11, 0, plate, 0, 0, 0, 0.06]]),
    forearm: b([
      [0.19, Z_FOREARM + 0.045, 0.21, 0, 0, 0, plate],
      [0.19, 0.065, 0.24, 0, -0.13, 0, trim],
      [0.07, 0.16, 0.09, -0.066, -0.27, 0, joint],
      [0.07, 0.16, 0.09, 0.066, -0.27, 0, joint],
    ]),
    thigh: b([[0.22, Z_THIGH + 0.05, 0.23, 0, 0, 0, plate], [0.11, 0.3, 0.07, 0, 0, 0.12, joint]]),
    shin: b([[0.17, Z_SHIN + 0.04, 0.19, 0, 0, 0, joint], [0.23, 0.23, 0.1, 0, 0.04, 0.11, plate]]),
    feet: [boot, boot],
    optic: new THREE.MeshBasicMaterial({ color: optic, toneMapped: false }),
  };
}
const DRONE_KITS = DRONE_PALETTES.map((palette, i) => bakeDrone(palette, 7 + i * 31));
const droneShell = new THREE.MeshStandardMaterial({ vertexColors: true, roughness: 0.48, metalness: 0.32 });
const droneHurt = new THREE.MeshStandardMaterial({ vertexColors: true, roughness: 0.48, metalness: 0.32, emissive: 0xffb64b, emissiveIntensity: 0.85 });
const scorchMat = new THREE.MeshStandardMaterial({ color: 0x111b24, roughness: 0.9 });

// Spawn points sit just past the edge of the gameplay view (worked out from where the
// follow camera will be, whatever the window's shape), so nothing pops in on screen.
const spawnCam = new THREE.PerspectiveCamera(55, 1, 0.1, 200);
const _sp = new THREE.Vector3();
function offscreen(x, z) {
  for (const y of [0, 2.2]) { // feet and head both out of frame
    _sp.set(x, y, z).project(spawnCam);
    if (_sp.z < 1 && Math.abs(_sp.x) < 1.08 && Math.abs(_sp.y) < 1.08) return false;
  }
  return true;
}
function spawnPoint(out) {
  spawnCam.aspect = window.innerWidth / window.innerHeight;
  spawnCam.updateProjectionMatrix();
  spawnCam.position.copy(player.position).add(CAM_OFFSET);
  spawnCam.lookAt(player.position.x, 0, player.position.z);
  spawnCam.updateMatrixWorld();
  const ang = Math.random() * Math.PI * 2, cx = Math.sin(ang), cz = Math.cos(ang);
  let r = 12;
  const along = r => [player.position.x + cx * r, player.position.z + cz * r];
  // walk out along a random bearing until it's off screen and clear of the deck
  for (; r < 70; r += 1) {
    const [x, z] = along(r);
    if (offscreen(x, z) && (Math.abs(x) > EDGE + 1.5 || Math.abs(z) > EDGE + 1.5)) break;
  }
  [out.x, out.z] = along(r + 1.5 + Math.random() * 3);
  out.y = 0;
  pushOutOfSolids(out);
  return out;
}

function spawnDrone(pos = spawnPoint(new THREE.Vector3())) {
  const kit = DRONE_KITS[(Math.random() * DRONE_KITS.length) | 0];
  const z = new THREE.Group();
  z.rotation.order = 'YXZ';
  const body = [];
  const mesh = (geo, parent, mat = droneShell) => {
    const m = new THREE.Mesh(geo, mat);
    m.castShadow = mat !== kit.optic;
    parent.add(m);
    if (mat === droneShell) body.push(m);
    return m;
  };
  const pelvis = mesh(kit.pelvis, z);
  const upper = new THREE.Group(); upper.rotation.order = 'YXZ'; upper.scale.setScalar(Z_UPPER); z.add(upper); // waist pivot
  mesh(kit.torso, upper);
  const head = new THREE.Group(); head.position.set(0, 0.68, 0.06); head.rotation.order = 'YXZ'; upper.add(head);
  mesh(kit.head, head);
  const eyes = mesh(kit.eyes, head, kit.optic);
  const jaw = new THREE.Group(); jaw.position.set(0, 0, -0.06); head.add(jaw);
  mesh(kit.jaw, jaw);
  const side = s => ({
    side: s,
    upperArm: mesh(kit.upperArm, z), forearm: mesh(kit.forearm, z),
    thigh: mesh(kit.thigh, z), shin: mesh(kit.shin, z), foot: mesh(kit.feet[s > 0 ? 0 : 1], z),
    shoulder: new THREE.Vector3(s * 0.36, 0.58, 0), hip: new THREE.Vector3(s * 0.14, 0, 0),
    sh: new THREE.Vector3(), elbow: new THREE.Vector3(), wrist: new THREE.Vector3(), reach: new THREE.Vector3(),
    hipP: new THREE.Vector3(), knee: new THREE.Vector3(), ankle: new THREE.Vector3(), foot3: new THREE.Vector3(),
  });
  const limbs = [side(1), side(-1)];

  z.position.set(pos.x, 0, pos.z);
  z.scale.setScalar(Z_SCALE * (0.94 + Math.random() * 0.12));
  const limp = Math.random() < 0.25 ? 0.2 + Math.random() * 0.55 : 0;
  const pace = 0.85 + Math.random() * 0.3;
  z.userData = {
    hp: state.droneHp,
    pace,                                               // its speed relative to the wave's
    speed: state.droneSpeed * pace,
    hurt: 0, body, eyes, pelvis, upper, head, jaw, limbs,
    // gait personality
    phase: Math.random(),
    seed: Math.random() * 100,
    limp,                                               // 0 = sound legs; else how badly one drags
    limpSide: Math.random() < 0.5 ? 1 : -1,
    hunch: 0.08 + Math.random() * 0.16,
    tilt: (Math.random() - 0.5) * 0.12,                  // head lolls to one side
    arms: Math.random() < 0.18 ? 1 : 0, // how many arms reach (the rest hang)
    flinch: 0, attack: 0, groan: 0,
    gait: 1,       // 1 = walking, 0 = feet planted
    swing: -1,     // seconds into a swing at the operator; -1 = not swinging
    swingCd: 0.15, struck: false, standing: false, swingAt: null, // swingAt: a door/window it's battering, else you
    climb: -1,     // 0..1 through clambering in a window; -1 = not climbing
    via: -1,       // which prop corner it's heading round (see routeAround)
    stuckT: 0, stuckX: pos.x, stuckZ: pos.z, // progress check (see chaseDrone)
    opening: null, // committed entry opening; null = re-pick on next outside frame
    stage: 0,      // 0 = heading to outer waypoint, 1 = heading through the gap
    heading: Math.atan2(-z.position.x, -z.position.z), // current facing, starts toward deck
    turn: 3.0 + Math.random() * 2.0,                   // max turn rate (rad/s), varied per drone
  };
  z.rotation.y = z.userData.heading;
  scene.add(z);
  drones.push(z);
  return z;
}

// on a bullet hit: flash, flinch back, and snap the head
function hitDrone(z) {
  const u = z.userData;
  u.hurt = 0.12;
  u.flinch = 1;
  for (const m of u.body) m.material = droneHurt;
}

const Z_POLE_KNEE = new THREE.Vector3(0, 0, 1);
const _zPole = new THREE.Vector3(), _zReach = new THREE.Vector3();
// pose a drone for this frame: a lurching, uneven shamble that turns into a
// loping run on later waves, arms groping toward the operator or hanging dead.
// `dead` (0..1) goes limp as it dies; `sag` buckles the knees.
function animateDrone(z, dt, near, dead = 0, sag = dead) {
  const u = z.userData;
  const fall = dead ? u.fallDir : 0; // +1 toppling forward, -1 backward
  const live = 1 - dead;
  const gait = u.gait * live; // 0 when it's standing its ground
  const sp = u.speed * gait;
  const run = THREE.MathUtils.clamp((u.speed - 3) / 2, 0, 1); // later waves lope instead of shamble
  const freq = 1.1 + sp * 0.22;
  const beta = 0.6 - 0.18 * run;
  u.phase = (u.phase + freq * dt * live) % 1;
  const ph = u.phase * Math.PI * 2;
  const L = Math.min(0.7, sp * beta / freq);
  const t = performance.now() / 1000 + u.seed;
  u.flinch *= Math.exp(-7 * dt);
  u.groan *= Math.exp(-2.5 * dt);
  u.attack = damp(u.attack, near < 2.4 && u.swing < 0 ? live : 0, 6, dt);
  // the swing: rear back with the arms up (-1), slam down and lunge (+1), recover
  const sw = u.swing, rec = Z_SWING - Z_STRIKE - 0.1;
  const blow = sw < 0 || dead ? 0
    : sw < Z_STRIKE ? -ease(sw / Z_STRIKE)
    : sw < Z_STRIKE + 0.1 ? -1 + 2 * ease((sw - Z_STRIKE) / 0.1)
    : 1 - ease(Math.min(1, (sw - Z_STRIKE - 0.1) / rec));
  const rear = Math.max(0, -blow), slam = Math.max(0, blow);
  const clamber = u.climb >= 0 && !dead ? Math.sin(Math.PI * u.climb) : 0; // over a window sill

  // pelvis: dips on every step, and drops hard onto the bad leg
  const badStance = u.limp ? Math.max(0, Math.sin(ph + (u.limpSide > 0 ? 0 : Math.PI))) : 0;
  const pelvisY = Z_HIP - 0.05 - 0.06 * run - 0.05 * Math.abs(Math.sin(ph)) * gait - 0.06 * slam - 0.08 * u.limp * badStance - 0.3 * sag;
  u.pelvis.position.set(0, pelvisY, 0);
  u.pelvis.rotation.set(0, 0.12 * Math.sin(ph) * live, (0.1 * Math.sin(ph) + 0.12 * u.limp * badStance * u.limpSide) * live);
  u.pelvis.updateMatrix();

  // torso: hunched, lurching side to side against the hips, kicked back by hits
  u.upper.position.set(0, pelvisY + 0.08, 0);
  u.upper.rotation.set(
    (u.hunch + 0.12 * run + 0.25 * u.attack - 0.55 * rear + 0.5 * slam) * live - 0.6 * u.flinch + 0.35 * fall * dead, // goes over with the fall
    -0.15 * Math.sin(ph) * live,
    (-0.14 * Math.sin(ph) - 0.1 * u.limp * badStance * u.limpSide) * live + 0.04 * Math.sin(t * 0.7));
  u.upper.updateMatrix();
  // head lolls, nods with each step, comes up to look at its meal, snaps back when shot
  u.head.rotation.set(
    (-u.hunch * 0.7 + 0.12 * Math.abs(Math.sin(ph)) - 0.25 * u.attack - 0.2 * rear) * live - 0.7 * u.flinch + (fall > 0 ? 0.3 : -0.6) * dead,
    0.25 * Math.sin(t * 0.9) * live,
    u.tilt + 0.18 * Math.sin(t * 1.3 + 1) * live);
  u.jaw.rotation.x = (0.12 + 0.12 * Math.abs(Math.sin(t * 2.3)) + 0.45 * u.groan + 0.35 * u.attack * Math.abs(Math.sin(t * 9)) + 0.5 * rear) * live + 0.5 * dead;

  for (const l of u.limbs) {
    // --- legs: the good leg steps through, the bad one drags its toe ---
    const bad = u.limp && l.side === u.limpSide;
    const p = (u.phase + (l.side > 0 ? 0 : 0.5 + 0.06 * u.limp)) % 1;
    const { s, lift, pitch } = footCycle(p, beta);
    l.foot3.set(l.side * (0.15 + 0.06 * dead), Z_ANKLE + lift * (bad ? 0.03 : 0.12 + 0.1 * run) * gait + 0.3 * clamber, s * L - 0.2 * clamber);
    l.hipP.copy(l.hip).applyMatrix4(u.pelvis.matrix);
    ik2(l.hipP, l.foot3, Z_THIGH, Z_SHIN, Z_POLE_KNEE, l.knee);
    l.ankle.subVectors(l.foot3, l.knee).normalize().multiplyScalar(Z_SHIN).add(l.knee);
    bone(l.thigh, l.hipP, l.knee, Z_POLE_KNEE);
    bone(l.shin, l.knee, l.ankle, Z_POLE_KNEE);
    l.foot.position.copy(l.ankle);
    l.foot.rotation.set(bad ? 0.35 : pitch * live, l.side * (bad ? 0.35 : 0.12), 0);

    // --- arms: reaching ones grope ahead (and claw when close); the rest hang and swing ---
    l.sh.copy(l.shoulder).applyMatrix4(u.upper.matrix);
    const reaches = (l.side > 0 ? u.arms >= 1 : u.arms >= 2) && !dead;
    const k = l.side * 1.7;
    if (reaches) {
      const claw = u.attack * Math.sin(t * 9 + k);
      l.reach.set(-l.side * 0.08, -0.08 + 0.06 * Math.sin(ph + k) + 0.18 * u.attack + 0.12 * claw - 0.3 * u.flinch,
        0.72 + 0.07 * Math.sin(ph * 2 + k) + 0.2 * claw - 0.35 * u.flinch);
    } else if (dead) {
      l.reach.set(l.side * 0.45 * dead, -0.7, -0.15 * fall * dead); // limp, flung out to the sides
    } else {
      // dangling: a loose pendulum against the stride
      l.reach.set(l.side * 0.1, -0.84, 0.1 + 0.16 * Math.sin(ph + (l.side > 0 ? Math.PI : 0)) * gait + 0.25 * u.flinch);
    }
    // every arm joins the swing: raised overhead, then clubbed down in front
    if (rear) l.reach.lerp(_zReach.set(l.side * 0.22, 0.5, 0.18), rear);
    if (slam) l.reach.lerp(_zReach.set(-l.side * 0.06, -0.3, 0.78), slam);
    if (clamber) l.reach.lerp(_zReach.set(l.side * 0.24, -0.6, 0.45), clamber); // hands planted on the sill
    l.reach.add(l.sh);
    ik2(l.sh, l.reach, Z_UPPER_ARM, Z_FOREARM, _zPole.set(l.side * 0.6, -1, -0.3), l.elbow);
    l.wrist.subVectors(l.reach, l.elbow).normalize().multiplyScalar(Z_FOREARM).add(l.elbow);
    bone(l.upperArm, l.sh, l.elbow, _zPole);
    bone(l.forearm, l.elbow, l.wrist, _zPole);
  }
}

// --- the dead: crumple, topple onto the floor (or the pile), power down, and stay
// there CORPSE_LIFE seconds before sinking into the boards ---
const corpses = [];
const CORPSE_LIFE = 20;   // seconds a body stays down
const MAX_CORPSES = 120;  // past this the oldest start sinking early
const BODY_THICK = 0.3;   // how much each body lying underneath raises the next
function updateCorpses(dt) {
  let bakes = 0;
  for (let i = corpses.length - 1; i >= 0; i--) {
    const z = corpses[i], u = z.userData;
    u.deadT += dt;
    if (!u.sinking && (u.deadT > CORPSE_LIFE || corpses.length - i > MAX_CORPSES)) sinkCorpse(z);
    if (u.baked) {
      if (u.sinking) {
        u.sinkT += dt;
        u.baked.position.y = -u.sinkT * (0.6 + u.restY * 0.5);
        u.pool.position.y = 0.045 - u.sinkT * 0.04;
        if (u.baked.position.y < -1.1 - u.restY) {
          scene.remove(u.baked, u.pool);
          u.baked.geometry.dispose();
          corpses.splice(i, 1);
        }
      }
      continue;
    }
    const crumple = Math.min(1, u.deadT / 0.25);
    const fall = Math.min(1, Math.max(0, (u.deadT - 0.1) / 0.45));
    animateDrone(z, dt, 99, crumple, crumple * (1 - 0.85 * fall)); // knees buckle, then straighten as it goes over
    // topple: accelerate like a falling body, with a small bounce at the bottom
    const f = fall * fall;
    z.rotation.x = u.fallDir * (f * 1.42 - (fall >= 1 ? 0.06 * Math.exp(-(u.deadT - 0.55) * 9) * Math.sin((u.deadT - 0.55) * 30) : 0));
    z.position.y = (0.12 + u.restY) * f;
    // the pool spreads out from under the body
    u.pool.scale.setScalar(Math.min(1, Math.max(0.05, (u.deadT - 0.4) / 1.4)) * u.poolSize);
    // settled: freeze it into one static mesh (a few per frame, so a crowd dropping at once doesn't hitch)
    if (u.deadT > 1.0 && bakes < 4) { bakeCorpse(z); bakes++; }
  }
}
// a body and everything piled on top of it go down together
function sinkCorpse(z) {
  const u = z.userData;
  if (u.sinking) return;
  u.sinking = true; u.sinkT = 0;
  for (const c of corpses) if (c.userData.under.includes(z)) sinkCorpse(c);
}
// merge a settled body's parts, in world space, into one mesh: a pile of a hundred
// is a hundred draw calls instead of fifteen hundred
function bakeCorpse(z) {
  const u = z.userData;
  z.updateMatrixWorld(true);
  let n = 0;
  for (const m of u.body) n += m.geometry.attributes.position.count;
  const pos = new Float32Array(n * 3), nrm = new Float32Array(n * 3), col = new Float32Array(n * 3);
  let o = 0;
  for (const m of u.body) {
    const g = m.geometry, P = g.attributes.position.array, N = g.attributes.normal.array, C = g.attributes.color.array;
    _bkN.getNormalMatrix(m.matrixWorld);
    for (let i = 0; i < P.length; i += 3, o += 3) {
      _bkV.fromArray(P, i).applyMatrix4(m.matrixWorld).toArray(pos, o);
      _bkV.fromArray(N, i).applyMatrix3(_bkN).normalize().toArray(nrm, o);
      col[o] = C[i]; col[o + 1] = C[i + 1]; col[o + 2] = C[i + 2];
    }
  }
  const g = new THREE.BufferGeometry();
  g.setAttribute('position', new THREE.BufferAttribute(pos, 3));
  g.setAttribute('normal', new THREE.BufferAttribute(nrm, 3));
  g.setAttribute('color', new THREE.BufferAttribute(col, 3));
  u.baked = new THREE.Mesh(g, droneShell);
  u.baked.castShadow = u.baked.receiveShadow = true;
  scene.remove(z);
  scene.add(u.baked);
}
function removeCorpses() {
  for (const c of corpses) {
    const u = c.userData;
    scene.remove(c, u.pool);
    if (u.baked) { scene.remove(u.baked); u.baked.geometry.dispose(); }
  }
  corpses.length = 0;
}
// three points along a body lying from (x, z) in direction (dx, dz)
const bodyPoints = (x, z, dx, dz, s) => [0.5, 1.1, 1.7].map(t => [x + dx * t * s, z + dz * t * s]);
// a scorch mark of overlapping slabs, so it doesn't read as a square rug
const poolGeo = (() => {
  const rng = seeded(99), slabs = [[0.8, 0.02, 0.8, 0, 0, 0, 0xffffff, 0, 0.3, 0, 0.008]];
  for (let i = 0; i < 6; i++) {
    const a = i * 1.1 + rng(), r = 0.3 + rng() * 0.25, s = 0.25 + rng() * 0.3;
    slabs.push([s, 0.02, s * (0.6 + rng() * 0.6), Math.cos(a) * r, 0.003 * i, Math.sin(a) * r, 0xffffff, 0, rng() * 3, 0, 0.008]);
  }
  return bakeBlocks(slabs, rng);
})();
// `dir` (world, optional): the shot that killed it, which it falls along
function droneDies(z, dir) {
  const u = z.userData;
  u.deadT = 0;
  u.hurt = 0;
  for (const m of u.body) m.material = droneShell;
  u.eyes.visible = false; // the light goes out
  // fall along the shot (or away from the operator) — forward if hit from behind
  const fx = dir ? dir.x : z.position.x - player.position.x, fz = dir ? dir.z : z.position.z - player.position.z;
  u.fallDir = fx * Math.sin(u.heading) + fz * Math.cos(u.heading) >= 0 ? 1 : -1;
  // land on top of any bodies already lying where this one falls
  const dx = Math.sin(u.heading) * u.fallDir, dz = Math.cos(u.heading) * u.fallDir;
  u.points = bodyPoints(z.position.x, z.position.z, dx, dz, z.scale.x);
  u.restY = 0; u.under = []; u.sinking = false; u.baked = null;
  for (const c of corpses) {
    const cu = c.userData;
    if (cu.sinking || !cu.points.some(([ax, az]) => u.points.some(([bx, bz]) => (ax - bx) ** 2 + (az - bz) ** 2 < 0.36))) continue;
    u.under.push(c);
    u.restY = Math.max(u.restY, cu.restY + BODY_THICK);
  }
  u.restY = Math.min(u.restY, 1.5);
  const pool = new THREE.Mesh(poolGeo, scorchMat);
  pool.receiveShadow = true;
  pool.position.set(z.position.x + Math.sin(u.heading) * u.fallDir * 0.9, 0.045, z.position.z + Math.cos(u.heading) * u.fallDir * 0.9);
  pool.rotation.y = Math.random() * Math.PI;
  u.pool = pool; u.poolSize = 1.1 + Math.random() * 0.6;
  pool.scale.setScalar(0.05);
  scene.add(pool);
  corpses.push(z);
}

function nearestOpening(pos, skip) {
  let best = null, bd = Infinity;
  for (const o of openings) {
    if (o === skip) continue;
    const d = (o.x - pos.x) ** 2 + (o.z - pos.z) ** 2;
    if (d < bd) { bd = d; best = o; }
  }
  return best;
}

function inside(pos) {
  return Math.abs(pos.x) < HALF - 0.3 && Math.abs(pos.z) < HALF - 0.3;
}

// --- doors and windows: shut at the start of a run, and stay broken once broken ---
const CLIMB_TIME = 1.1; // seconds to clamber in over a sill
const metalChip = new THREE.MeshStandardMaterial({ color: 0x53697b, roughness: 0.46, metalness: 0.4 });
function resetOpenings() {
  for (const o of openings) {
    Object.assign(o, { hp: o.maxHp, climber: null, jolt: 0, fallT: -1 });
    if (o.kind === 'door') {
      o.leaf.rotation.y = 0;
      o.fall.rotation.x = 0; o.fall.position.set(0, 0, -0.02);
    } else {
      o.glass.visible = true; o.glass.material = glassMat;
      o.bars.visible = true;
      o.shards.visible = false;
    }
  }
}
// bits flying off a door or window, into the deck
function burst(o, n, mat, size, speed) {
  const sx = o.ix - o.x, sz = o.iz - o.z, l = Math.hypot(sx, sz);
  for (let i = 0; i < n; i++) {
    const m = new THREE.Mesh(BOX, mat);
    m.scale.set(size * rnd(0.4, 1), size * rnd(0.2, 0.6), size * rnd(1, 2.5));
    const along = rnd(-0.5, 0.5) * (o.w - 0.3);
    m.position.set(o.x + (o.axis === 'x' ? along : 0), o.kind === 'door' ? rnd(0.3, 1.8) : rnd(o.sill + 0.05, o.head - 0.05), o.z + (o.axis === 'z' ? along : 0));
    m.rotation.set(Math.random() * 3, Math.random() * 3, Math.random() * 3);
    const v = speed * rnd(0.5, 1.2);
    spawnDebris(m, new THREE.Vector3(sx / l * v + rnd(-1, 1), rnd(0.5, 2.5), sz / l * v + rnd(-1, 1)),
      { life: rnd(2, 3.5), bounce: 0.02, spin: new THREE.Vector3(rnd(-12, 12), rnd(-12, 12), rnd(-12, 12)) });
  }
}
// a drone's blow (or the operator's bullet, for glass) lands on a door or window
function hitOpening(o) {
  if (o.hp <= 0) return;
  o.hp--;
  o.jolt = 1;
  if (o.kind === 'door') {
    audio.bash(o);
    burst(o, 2, metalChip, 0.12, 2);
  } else if (o.hp > 0) {
    audio.crack(o);
    o.glass.material = glassCracked;
  }
  if (o.hp <= 0) breakOpening(o);
}
function breakOpening(o) {
  o.hp = 0;
  if (o.kind === 'door') {
    // off its hinges and down onto the floor
    o.fallT = 0;
    o.leaf.rotation.y = 0;
    audio.doorBreak(o);
    burst(o, 9, metalChip, 0.16, 3.5);
  } else {
    o.glass.visible = false;
    o.bars.visible = false;
    o.shards.visible = true;
    audio.shatter(o);
    burst(o, 16, glassMat, 0.09, 4);
  }
}
// does an unbroken door or window stand at (x, z)? (they stop bullets and blows)
function shutAt(x, z) {
  for (const o of openings) {
    if (o.hp > 0 && x >= o.box.minX && x <= o.box.maxX && z >= o.box.minZ && z <= o.box.maxZ) return o;
  }
  return null;
}
function updateOpenings(dt) {
  for (const o of openings) {
    o.jolt *= Math.exp(-9 * dt);
    if (o.kind === 'window') { o.pane.position.z = -0.03 * o.jolt; continue; }
    if (o.fallT >= 0) {
      // topples in like a slab: speeds up, slaps flat with a little bounce
      o.fallT += dt;
      const k = Math.min(1, o.fallT / 0.5), slap = k >= 1 ? 0.05 * Math.exp(-(o.fallT - 0.5) * 10) * Math.sin((o.fallT - 0.5) * 30) : 0;
      o.fall.rotation.x = -(Math.PI / 2 - 0.02) * k * k + slap;
      o.fall.position.set(0, 0.08 * k, -0.02 - 0.35 * k);
      continue;
    }
    if (o.hp <= 0) continue;
    // kicked inward on each blow
    o.leaf.rotation.y = o.jolt * 0.07;
  }
}
// start a drone clambering in through a broken window
function startClimb(z, o) {
  const ud = z.userData;
  o.climber = z;
  ud.climb = 0; ud.climbO = o;
  ud.climbFrom = z.position.clone();
  ud.heading = Math.atan2(o.lx - z.position.x, o.lz - z.position.z);
  z.rotation.y = ud.heading;
}
function climbStep(z, dt) {
  const ud = z.userData, o = ud.climbO;
  ud.climb = Math.min(1, ud.climb + dt / CLIMB_TIME);
  const k = ud.climb, e = ease(k);
  z.position.x = ud.climbFrom.x + (o.lx - ud.climbFrom.x) * e;
  z.position.z = ud.climbFrom.z + (o.lz - ud.climbFrom.z) * e;
  // up onto the sill, over on its belly, and down inside
  z.position.y = (o.sill - 0.15) * Math.min(1, Math.sin(Math.PI * k) * 1.4);
  z.rotation.x = 0.75 * Math.sin(Math.PI * k);
  if (k >= 1) endClimb(z);
}
function endClimb(z, died) {
  const ud = z.userData, o = ud.climbO;
  if (o.climber === z) o.climber = null;
  if (died && ud.climb < 0.5) z.position.copy(ud.climbFrom); // falls back out
  else z.position.set(o.lx, 0, o.lz);
  z.position.y = 0; z.rotation.x = 0;
  ud.climb = -1; ud.climbO = null; ud.opening = null; ud.stage = 0;
}

// --- solid props (see SOLIDS): drones are shoved out of them and plan a way round them ---
const Z_RADIUS = 0.4;   // a drone's footprint
const ROUND_PAD = 0.35; // how wide of a corner they swing
const _local = { x: 0, z: 0 };
function toLocal(b, x, z) {
  const dx = x - b.x, dz = z - b.z;
  _local.x = dx * b.c - dz * b.s; _local.z = dx * b.s + dz * b.c;
  return _local;
}
function pushOutOfSolids(pos) {
  for (const b of SOLIDS) {
    const { x: lx, z: lz } = toLocal(b, pos.x, pos.z);
    const ex = b.hx + Z_RADIUS, ez = b.hz + Z_RADIUS;
    const px = ex - Math.abs(lx), pz = ez - Math.abs(lz);
    if (px <= 0 || pz <= 0) continue;
    // out through the nearest face, a hair clear of it so it doesn't read as still touching
    const nx = px < pz ? Math.sign(lx) * (ex + 0.01) : lx, nz = px < pz ? lz : Math.sign(lz) * (ez + 0.01);
    pos.x = b.x + nx * b.c + nz * b.s;
    pos.z = b.z - nx * b.s + nz * b.c;
  }
}
// does the segment a→b (prop-local) cross the box ±hx, ±hz? (slab test)
function segHitsBox(ax, az, bx, bz, hx, hz) {
  let t0 = 0, t1 = 1;
  const dx = bx - ax, dz = bz - az;
  if (Math.abs(dx) < 1e-9) { if (Math.abs(ax) >= hx) return false; }
  else {
    const ta = (-hx - ax) / dx, tb = (hx - ax) / dx;
    t0 = Math.max(t0, Math.min(ta, tb)); t1 = Math.min(t1, Math.max(ta, tb));
  }
  if (Math.abs(dz) < 1e-9) { if (Math.abs(az) >= hz) return false; }
  else {
    const ta = (-hz - az) / dz, tb = (hz - az) / dz;
    t0 = Math.max(t0, Math.min(ta, tb)); t1 = Math.min(t1, Math.max(ta, tb));
  }
  return t0 < t1;
}
// --- finding a way round the props: a shortest path over their corners (padded out so a
// drone clears them), searched whenever a prop blocks the straight line to the target ---
const SEE_SLOP = 0.05; // a drone pressed against a prop can still see along its side
const ROUND_NODES = SOLIDS.flatMap(b => [[1, 1], [1, -1], [-1, -1], [-1, 1]].map(([sx, sz]) => {
  const kx = sx * (b.hx + Z_RADIUS + ROUND_PAD), kz = sz * (b.hz + Z_RADIUS + ROUND_PAD);
  return { x: b.x + kx * b.c + kz * b.s, z: b.z - kx * b.s + kz * b.c };
}));
// can a drone walk straight from a to b without going through a prop?
function clearPath(ax, az, bx, bz) {
  for (const b of SOLIDS) {
    const p = toLocal(b, ax, az), px = p.x, pz = p.z, q = toLocal(b, bx, bz);
    if (segHitsBox(px, pz, q.x, q.z, b.hx + Z_RADIUS - SEE_SLOP, b.hz + Z_RADIUS - SEE_SLOP)) return false;
  }
  return true;
}
// which corners can see each other, and how far apart they are (props don't move)
const NODE_LINKS = ROUND_NODES.map(a => ROUND_NODES.map(b =>
  a !== b && clearPath(a.x, a.z, b.x, b.z) ? Math.hypot(a.x - b.x, a.z - b.z) : Infinity));
const _goal = { x: 0, z: 0 }, _from = { x: 0, z: 0 }, _toGoal = [], _done = [];
// Where a drone should head to get to (tx, tz): straight there if nothing's in the way,
// otherwise the corner in sight that starts the shortest way round. It doesn't count a
// corner it's already standing at, and stays loyal to its last pick (ud.via) unless another
// way is clearly shorter, so it doesn't dither between two even routes.
function routeAround(z, tx, tz) {
  const ud = z.userData;
  _goal.x = tx; _goal.z = tz;
  _from.x = z.position.x; _from.z = z.position.z;
  pushOutOfSolids(_from); // plan from where it'll be once it's been shoved clear
  const { x, z: fz } = _from;
  if (clearPath(x, fz, tx, tz)) { ud.via = -1; return _goal; }
  // how far each corner is from the goal, going round (Dijkstra out from the goal)
  const n = ROUND_NODES.length, dist = _toGoal;
  for (let i = 0; i < n; i++) {
    const k = ROUND_NODES[i];
    dist[i] = clearPath(k.x, k.z, tx, tz) ? Math.hypot(tx - k.x, tz - k.z) : Infinity;
    _done[i] = false;
  }
  for (let r = 0; r < n; r++) {
    let u = -1;
    for (let i = 0; i < n; i++) if (!_done[i] && (u < 0 || dist[i] < dist[u])) u = i;
    if (dist[u] === Infinity) break;
    _done[u] = true;
    for (let i = 0; i < n; i++) dist[i] = Math.min(dist[i], dist[u] + NODE_LINKS[u][i]);
  }
  let best = -1, bestCost = Infinity, near = -1, nearD = Infinity;
  for (let i = 0; i < n; i++) {
    const k = ROUND_NODES[i], d = Math.hypot(k.x - x, k.z - fz);
    if (d < 0.45 || !clearPath(x, fz, k.x, k.z)) continue;
    if (d < nearD) { nearD = d; near = i; }
    const cost = d + dist[i] - (ud.via === i ? 1 : 0);
    if (cost < bestCost) { bestCost = cost; best = i; }
  }
  if (best < 0) best = near; // no way through from here: at least get round the nearest corner
  if (best < 0) return _goal;
  ud.via = best;
  _goal.x = ROUND_NODES[best].x; _goal.z = ROUND_NODES[best].z;
  return _goal;
}

function killDrone(z, idx, dir) {
  if (z.userData.climb >= 0) endClimb(z, true);
  spawnSparks(z.position);
  maybeDrop(z.position);
  droneDies(z, dir);
  drones.splice(idx, 1);
  state.kills++;
}

// ===================================================================
// DROPS — supplies drones sometimes leave behind
// ===================================================================
const DROP_TYPES = [
  { id: 'med',  name: '+1 SHIELD',     detail: 'Restores 1 shield', icon: '+', color: 0xff78b5, weight: 40 },
  { id: 'dmg',  name: 'OVERCHARGE',    detail: 'Double damage',    icon: '↑', color: 0xffa64c, weight: 25 },
  { id: 'ammo', name: 'INFINITE CELL', detail: 'Unlimited ammo',   icon: '∞', color: 0x76bcf0, weight: 25 },
];
const seenDrops = new Set(store.get('seen-drops', []));
const DROP_MODELS = {
  med: [  // first-aid case, crosses on top and front
    [0.52, 0.34, 0.36, 0, 0, 0, 0xe6e2da, 0, 0, 0, 0.05],
    [0.3, 0.02, 0.1, 0, 0.175, 0, 0xc8302a, 0, 0, 0, 0.006], [0.1, 0.022, 0.3, 0, 0.176, 0, 0xc8302a, 0, 0, 0, 0.006],
    [0.24, 0.08, 0.02, 0, 0, 0.185, 0xc8302a, 0, 0, 0, 0.006], [0.08, 0.22, 0.022, 0, 0, 0.186, 0xc8302a, 0, 0, 0, 0.006],
  ],
  dmg: [  // a pair of hot rounds
    [0.13, 0.3, 0.13, -0.09, -0.06, 0, 0xc9a14a, 0, 0, 0, 0.03], [0.13, 0.3, 0.13, 0.09, -0.06, 0, 0xc9a14a, 0, 0, 0, 0.03],
    [0.11, 0.16, 0.11, -0.09, 0.17, 0, 0xff5a1e, 0, 0, 0, 0.04], [0.11, 0.16, 0.11, 0.09, 0.17, 0, 0xff5a1e, 0, 0, 0, 0.04],
    [0.06, 0.07, 0.06, -0.09, 0.27, 0, 0xff9a5a, 0, 0, 0, 0.02], [0.06, 0.07, 0.06, 0.09, 0.27, 0, 0xff9a5a, 0, 0, 0, 0.02],
  ],
  ammo: [ // ammo can with a stenciled band
    [0.52, 0.3, 0.28, 0, 0, 0, 0x33566f, 0, 0, 0, 0.04], [0.54, 0.06, 0.3, 0, 0.17, 0, 0x243d55, 0, 0, 0, 0.02],
    [0.24, 0.04, 0.06, 0, 0.215, 0, 0x2a2c24, 0, 0, 0, 0.01], [0.3, 0.06, 0.006, 0, 0, 0.143, 0x76bcf0, 0, 0, 0, 0.002],
  ],
};
const dropGlow = glowTexture();
const dropRing = new THREE.RingGeometry(0.65, 0.73, 40).rotateX(-Math.PI / 2);

function pickupLabel(type) {
  const canvas = document.createElement('canvas');
  canvas.width = 320;
  canvas.height = 64;
  const ctx = canvas.getContext('2d');
  ctx.beginPath();
  ctx.roundRect(3, 3, 314, 58, 9);
  ctx.fillStyle = '#071520';
  ctx.fill();
  ctx.strokeStyle = type.tint;
  ctx.lineWidth = 3;
  ctx.stroke();
  ctx.textBaseline = 'middle';
  ctx.fillStyle = type.tint;
  ctx.font = 'bold 36px sans-serif';
  ctx.fillText(type.icon, 15, 33);
  ctx.fillStyle = '#f3fbff';
  ctx.font = 'bold 29px sans-serif';
  ctx.fillText(type.name, 61, 33);
  const map = new THREE.CanvasTexture(canvas);
  map.colorSpace = THREE.SRGBColorSpace;
  return new THREE.SpriteMaterial({ map, transparent: true, depthWrite: false, toneMapped: false });
}

for (const t of DROP_TYPES) {
  t.tint = '#' + t.color.toString(16).padStart(6, '0');
  t.geo = bakeBlocks(DROP_MODELS[t.id], seeded(3));
  t.item = new THREE.MeshStandardMaterial({
    vertexColors: true, roughness: 0.5, emissive: t.color, emissiveIntensity: 0.28,
  });
  t.ring = new THREE.MeshBasicMaterial({ color: t.color, toneMapped: false });
  t.glow = new THREE.SpriteMaterial({
    map: dropGlow, color: t.color, transparent: true, opacity: 0.9,
    blending: THREE.AdditiveBlending, depthWrite: false, toneMapped: false,
  });
  t.label = pickupLabel(t);
}
const DROP_CHANCE = 0.05; // per kill, before SALVAGE SCANNER
const DROP_PITY = 30;     // guaranteed drop after this many dry kills
const DROP_LIFE = 12;     // seconds before an uncollected drop vanishes
const drops = [];

function maybeDrop(pos) {
  state.sinceDrop++;
  if (Math.random() > DROP_CHANCE + state.dropBonus && state.sinceDrop < DROP_PITY) return;
  state.sinceDrop = 0;
  // no medkits at full health — they'd be a wasted drop
  const pool = DROP_TYPES.filter(t => t.id !== 'med' || state.hp < state.maxHp);
  let r = Math.random() * pool.reduce((a, t) => a + t.weight, 0);
  spawnDrop(pool.find(t => (r -= t.weight) < 0) || pool[0], pos);
}

function spawnDrop(type, pos) {
  const d = new THREE.Group();
  const item = new THREE.Mesh(type.geo, type.item);
  item.position.y = 0.68;
  item.scale.setScalar(1.45);
  item.castShadow = true;
  const ring = new THREE.Mesh(dropRing, type.ring);
  const glow = new THREE.Sprite(type.glow);
  glow.position.y = 0.56;
  glow.scale.setScalar(3.3);
  const label = new THREE.Sprite(type.label);
  label.position.y = 1.52;
  label.scale.set(3.2, 0.64, 1);
  label.renderOrder = 1;
  d.add(ring, glow, item, label);
  d.position.set(pos.x, 0.035, pos.z);
  d.userData = { type, item, life: DROP_LIFE, t: Math.random() * 6 };
  scene.add(d);
  drops.push(d);
}

function collect(type) {
  audio.pickup(type.id);
  toastQueue.push({ text: type.name, color: type.tint, pickup: type });
  if (type.id === 'med') state.hp = Math.min(state.maxHp, state.hp + 1);
  else if (type.id === 'dmg') state.pDamage = 10;
  else if (type.id === 'ammo') { state.pAmmo = 8; state.reloading = false; state.mag = state.magSize; }
}

function updateDrops(dt) {
  const lim = HALF - 0.9;
  for (let i = drops.length - 1; i >= 0; i--) {
    const d = drops[i], ud = d.userData;
    ud.life -= dt; ud.t += dt;
    const p = d.position;
    const dx = player.position.x - p.x, dz = player.position.z - p.z;
    const dist = Math.hypot(dx, dz);
    if (dist < 0.9) { collect(ud.type); scene.remove(d); drops.splice(i, 1); continue; }
    if (dist < 2.5) {
      // magnet: close drops fly to the player
      p.x += (dx / dist) * 10 * dt; p.z += (dz / dist) * 10 * dt;
    } else {
      // the player can't leave the deck, so drops that land outside slide in
      const cx = Math.max(-lim, Math.min(lim, p.x)), cz = Math.max(-lim, Math.min(lim, p.z));
      const ox = cx - p.x, oz = cz - p.z, od = Math.hypot(ox, oz);
      if (od > 0.01) { const st = Math.min(od, 6 * dt); p.x += (ox / od) * st; p.z += (oz / od) * st; }
    }
    ud.item.position.y = 0.68 + Math.sin(ud.t * 3) * 0.15;
    ud.item.rotation.y += dt * 2;
    d.visible = ud.life > 3 || ((ud.t * 8) | 0) % 2 === 0; // blink before vanishing
    if (ud.life <= 0) { scene.remove(d); drops.splice(i, 1); }
  }
}

// ===================================================================
// UPGRADES — pick one of three after every cleared wave
// ===================================================================
// Each card can be taken up to `max` times per run. `ok` (optional) hides a
// card while it would do nothing. `stat` returns [now, after] for the card.
const UPGRADES = [
  { id: 'mag',    cat: 'handling',  name: 'HIGH-CAP CELL',  desc: '+4 pulses per cell',     max: 5, stat: s => [s.magSize, s.magSize + 4 + ' pulses'],                            apply: s => { s.magSize += 4; s.mag = s.magSize; } },
  { id: 'reload', cat: 'handling',  name: 'HOT SWAP',   desc: 'reload 25% faster',          max: 4, stat: s => [s.reloadTime.toFixed(2), (s.reloadTime * 0.75).toFixed(2) + 's'], apply: s => { s.reloadTime *= 0.75; } },
  { id: 'damage', cat: 'firepower', name: 'PULSE AMPLIFIER', desc: '+50% pulse damage',         max: 6, stat: s => [s.damage + '×', s.damage + 0.5 + '×'],                       apply: s => { s.damage += 0.5; } },
  { id: 'rate',   cat: 'firepower', name: 'RAPID CYCLER',  desc: 'fire 20% faster',            max: 4, stat: s => [(1 / s.fireRate).toFixed(1), (1 / (s.fireRate * 0.8)).toFixed(1) + '/s'], apply: s => { s.fireRate *= 0.8; } },
  { id: 'pierce', cat: 'firepower', name: 'PIERCING',      desc: 'shots pierce +1 drone', max: 3, stat: s => [s.pierce, s.pierce + 1 + ' thru'],                     apply: s => { s.pierce++; } },
  { id: 'spread', cat: 'firepower', name: 'SPLIT BEAM',      desc: '+1 pulse per shot', max: 3, stat: s => [1 + s.spread, 2 + s.spread + ' per shot'],             apply: s => { s.spread++; } },
  { id: 'hp',     cat: 'survival',  name: 'SHIELD ARRAY',    desc: '+1 shield and recharge it', max: 3, stat: s => [s.maxHp, s.maxHp + 1 + ' max hp'],                         apply: s => { s.maxHp++; s.hp++; } },
  { id: 'speed',  cat: 'survival',  name: 'MOTION SERVO',    desc: 'move 12% faster',            max: 3, stat: s => [Math.round(s.speed / 6.2 * 100) + '%', Math.round(s.speed * 1.12 / 6.2 * 100) + '%'], apply: s => { s.speed *= 1.12; } },
  { id: 'luck',   cat: 'fortune',   name: 'SALVAGE SCANNER',     desc: 'more supply drops', max: 3, stat: s => [Math.round((DROP_CHANCE + s.dropBonus) * 100) + '%', Math.round((DROP_CHANCE + s.dropBonus + 0.03) * 100) + '% drops'], apply: s => { s.dropBonus += 0.03; } },
  { id: 'heal',   cat: 'survival',  name: 'SHIELD RESET',      desc: 'restore all shield segments',         max: Infinity, ok: s => s.hp < s.maxHp, stat: s => [s.hp, s.maxHp + ' hp'], apply: s => { s.hp = s.maxHp; } },
];
const UPGRADE_CATS = {
  firepower: '#ffad61',
  handling:  '#76bcf0',
  survival:  '#70dfb8',
  fortune:   '#bdadfa',
};
// 8x8 pixel icons in the game's blocky style: X = solid, o = dim
const UPGRADE_ICONS = {
  mag:    ['XX.XX.XX', 'XX.XX.XX', 'oo.oo.oo', 'oo.oo.oo', 'oo.oo.oo', 'oo.oo.oo', 'XX.XX.XX', '........'],
  reload: ['..XXXX..', '.X....XX', 'X....XXX', 'X.......', 'X......X', 'X......X', '.X....X.', '..XXXX..'],
  damage: ['.XXXXXX.', 'XXXXXXXX', 'X..XX..X', 'X..XX..X', 'XXXXXXXX', '.XXX.XX.', '..XXXX..', '..X.X.X.'],
  rate:   ['....XXX.', '...XXX..', '..XXX...', '.XXXXXX.', '...XXX..', '..XXX...', '.XX.....', '.X......'],
  pierce: ['.o..o...', '.o..o.X.', '.o..o..X', 'XXXXXXXX', '.o..o..X', '.o..o.X.', '.o..o...', '........'],
  spread: ['......XX', '....oo..', '..oo....', 'XXooooXX', '..oo....', '....oo..', '......XX', '........'],
  hp:     ['XXXXXXXX', 'XooooooX', 'XoooXooX', 'XooXXXoX', '.XooXoX.', '.XooooX.', '..XooX..', '...XX...'],
  speed:  ['........', 'XX..XX..', '.XX..XX.', '..XX..XX', '.XX..XX.', 'XX..XX..', '........', '........'],
  luck:   ['XXXXXXXX', 'XX....XX', 'X.X..X.X', 'X..XX..X', 'X..XX..X', 'X.X..X.X', 'XX....XX', 'XXXXXXXX'],
  heal:   ['.XX..XX.', 'XXXXXXXX', 'XXXXXXXX', 'XXXXXXXX', '.XXXXXX.', '..XXXX..', '...XX...', '........'],
};
function pixelIcon(rows, cls = 'cicon') {
  let r = '';
  rows.forEach((row, y) => [...row].forEach((c, x) => {
    if (c !== '.') r += `<rect x="${x}" y="${y}" width="1" height="1"${c === 'o' ? ' opacity=".35"' : ''}/>`;
  }));
  return `<svg class="${cls}" viewBox="0 0 8 8" shape-rendering="crispEdges" fill="currentColor">${r}</svg>`;
}
let offered = [];
const PICK_LOCKOUT_MS = 650; // ~ when the last card finishes dealing in

function openPicker(healed) {
  const pool = UPGRADES.filter(u => (state.upgrades[u.id] || 0) < u.max && (!u.ok || u.ok(state)));
  for (let i = pool.length - 1; i > 0; i--) { const j = (Math.random() * (i + 1)) | 0; [pool[i], pool[j]] = [pool[j], pool[i]]; }
  offered = pool.slice(0, 3);
  if (!offered.length) { state.intermission = 3.2; return; } // everything maxed out
  state.choosing = true;
  clearTimeout(choose._t);
  clearTimeout(openPicker._t);
  hud.pickerTitle.textContent = 'WAVE ' + state.wave + ' CLEARED';
  hud.pickerSub.textContent = (healed ? '+1 SHIELD  ·  ' : '') + 'CHOOSE ONE';
  hud.cards.innerHTML = offered.map((u, i) => {
    const owned = state.upgrades[u.id] || 0;
    const [now, after] = u.stat(state);
    const pips = u.max === Infinity ? '' :
      Array.from({ length: u.max }, (_, k) => `<i class="${k < owned ? 'own' : k === owned ? 'next' : ''}"></i>`).join('');
    return `<div class="card" data-i="${i}" style="--accent:${UPGRADE_CATS[u.cat]};animation-delay:${i * 90}ms">` +
      `<div class="ctop"><span>${u.cat.toUpperCase()}</span><span class="ckey">${i + 1}</span></div>` +
      pixelIcon(UPGRADE_ICONS[u.id]) +
      `<div class="cname">${u.name}</div><div class="cdesc">${u.desc}</div>` +
      `<div class="cstat">${now} → <b>${after}</b></div>` +
      `<div class="clvl">${pips}</div></div>`;
  }).join('');
  hud.picker.classList.remove('hidden');
  hud.cards.classList.remove('ready');
  audio.deal(offered.length);
  openPicker._t = setTimeout(() => hud.cards.classList.add('ready'), PICK_LOCKOUT_MS);
}

function choose(i) {
  const u = offered[i];
  if (!state.choosing || !u) return;
  state.upgrades[u.id] = (state.upgrades[u.id] || 0) + 1;
  u.apply(state);
  state.choosing = false;
  // brief beat so the pick registers visually before the picker closes
  [...hud.cards.children].forEach((c, k) => c.classList.add(k === i ? 'picked' : 'dropped'));
  clearTimeout(choose._t);
  choose._t = setTimeout(() => hud.picker.classList.add('hidden'), 320);
  state.intermission = 2.0;
  toastQueue.push({ text: u.name, color: UPGRADE_CATS[u.cat] });
  audio.upgrade(u.cat);
}

// ===================================================================
// METAL SPARKS
// ===================================================================
function spawnSparks(pos) {
  for (let i = 0; i < 12; i++) {
    const p = new THREE.Mesh(BOX, sparkMat);
    const s = 0.12 + Math.random() * 0.18;
    p.scale.set(s * 0.34, s * 0.34, s * 2.2);
    p.rotation.set(Math.random() * 6, Math.random() * 6, Math.random() * 6);
    p.position.set(pos.x, 0.8, pos.z);
    p.userData = {
      v: new THREE.Vector3((Math.random() - 0.5) * 5, 3 + Math.random() * 4, (Math.random() - 0.5) * 5),
      life: 0.6 + Math.random() * 0.4,
    };
    scene.add(p);
    particles.push(p);
  }
}

// ===================================================================
// WAVES
// ===================================================================
function startWave(n) {
  state.wave = n;
  // Drones toughen steadily but slower than upgrades let the player scale, so
  // runs can go long; speed caps below the player's so kiting always works.
  state.droneSpeed = Math.min(5.2, 2.3 + n * 0.18);
  state.droneHp = 2 + (n - 1) * 0.4;
  // anything already up counts toward the wave (the yard's shamblers when you leave the title)
  state.toSpawn = Math.max(0, 5 + n * 3 - drones.length);
  for (const z of drones) { z.userData.speed = state.droneSpeed * z.userData.pace; z.userData.hp = state.droneHp; }
  state.spawnTimer = 0;
  state.intermission = 0;
  pressure.target = Math.min(1, Math.max(0, (n - 2) / 10));
  const omens = { 1: 'Rogue security units inbound', 3: 'Reactor load rising', 7: 'Containment warning', 12: 'Reactor at critical load' };
  showBanner('WAVE ' + n, omens[n] || 'Hostile signatures detected');
  audio.waveStart(n);
}

// ===================================================================
// GAME FLOW
// ===================================================================
// clear everything a run leaves lying around
function clearRun() {
  for (const b of bullets) scene.remove(b);
  for (const z of drones) scene.remove(z);
  for (const p of particles) scene.remove(p);
  for (const d of drops) scene.remove(d);
  for (const d of debris) scene.remove(d);
  removeCorpses();
  bullets.length = 0; drones.length = 0; particles.length = 0; drops.length = 0; debris.length = 0;
  toastQueue.length = 0;
  toastTime = 0;
  hud.toast.style.opacity = 0;
  hud.picker.classList.add('hidden');
}

// the operator's stats before any upgrades
const BASE_STATS = { maxHp: 3, magSize: 8, reloadTime: 1.2, fireRate: 0.13, damage: 1, pierce: 0, spread: 0, speed: 6.2, dropBonus: 0 };

// `keep` carries over what's on the field (coming from the title: the operator stays where
// they are and the yard's drones join wave 1, which starts once the camera is down)
function resetGame(keep = false) {
  if (!keep) { clearRun(); resetOpenings(); }
  pressure.set(0);
  Object.assign(state, {
    ...BASE_STATS, running: true, hp: BASE_STATS.maxHp, kills: 0, wave: 0,
    mag: BASE_STATS.magSize, reloading: false, reloadT: 0,
    fireCd: 0, dmgCd: 0, toSpawn: 0, spawnTimer: 0,
    intermission: 0, choosing: false, shake: 0, upgrades: {},
    pDamage: 0, pAmmo: 0, sinceDrop: 0,
  });
  if (keep) {
    state.intermission = SWOOP_TIME * 0.85;
    for (const z of drones) Object.assign(z.userData, { cross: null, idle: 0, via: -1 });
  } else {
    player.position.set(0, 0, 0);
    startWave(1);
  }
  updateHUD();
}

function startGame(fromTitle = false) {
  audio.setTitleMusic(false);
  audio.ensure(); // create/resume AudioContext within the click gesture
  document.getElementById('death').classList.add('hidden');
  title.active = false;
  document.body.classList.remove('titling');
  menuEl.classList.add('gone');
  menuEl.inert = true;
  resetGame(fromTitle);
}

function setPaused(on) {
  if (on && !state.running) return; // only a live run can pause
  if (on === state.paused) return;
  state.paused = on;
  document.body.classList.toggle('paused', on);
  syncTouchControls();
  firing = false;
  for (const k in keys) keys[k] = false; // keyups are missed while the menu is up
  document.getElementById('pauseStat').textContent = `WAVE ${state.wave} · ${state.kills} UNITS DOWN`;
  document.getElementById('pause').classList.toggle('hidden', !on);
  if (on) document.getElementById('resumeBtn').focus({ preventScroll: true });
}

function quitToTitle() {
  setPaused(false);
  state.running = false;
  document.getElementById('death').classList.add('hidden');
  enterTitle(false);
}

function die() {
  state.running = false;
  firing = false;
  document.getElementById('deathStat').textContent =
    `YOU REACHED WAVE ${state.wave} · ${state.kills} UNITS DOWN`;
  // the local best run is ranked by units disabled
  const best = store.get('best', null), record = state.kills > 0 && (!best || state.kills > best.kills);
  if (record) store.set('best', { wave: state.wave, kills: state.kills });
  const db = document.getElementById('deathBest');
  db.textContent = record ? 'NEW BEST RUN' : best ? `BEST: WAVE ${best.wave} · ${best.kills} UNITS DOWN` : '';
  db.classList.toggle('record', record);
  document.getElementById('death').classList.remove('hidden');
  audio.death();
}

// ===================================================================
// TITLE SCREEN — the menu sits over a live shot of the deck: the door shut, the operator
// out of sight inside, a few of the dead shambling across the yard, the camera on a slow drift.
// PLAY swoops the camera down into the gameplay view and those drones become wave 1.
// ===================================================================
const TITLE_DRONES = 4;
const SWOOP_TIME = 1.8;
const title = { active: true, t: 0, groan: 3 };
const menuEl = document.getElementById('menu');
const TITLE_CAM = new THREE.Vector3(0.8, 0, 24); // roughly where the title camera stands

// The dead cross the yard between the back wall and the camera, side to side through the
// shot, some each way so neither side empties. Past crossX() they're out of frame (wider
// screens see more of the yard); there they wait a beat and come back in from the far edge.
const CROSS_Z = [11.5, 15.5];
const crossX = () => 2 + 5 * camera.aspect;
function crossYard(z, dir, x = -dir * crossX()) {
  const ud = z.userData, lz = rnd(...CROSS_Z);
  z.position.set(x, 0, lz);
  pushOutOfSolids(z.position);
  Object.assign(ud, {
    cross: { x: dir * (crossX() + 1), z: THREE.MathUtils.clamp(lz + rnd(-2, 2), ...CROSS_Z) },
    // now and then one stops partway to sway a while before carrying on
    stopX: Math.random() < 0.35 ? rnd(-5, 5) : null,
    speed: rnd(0.7, 1.05), heading: dir * Math.PI / 2, idle: 0, via: -1,
  });
  z.rotation.y = ud.heading;
}

function enterTitle(splash) {
  title.active = true;
  audio.setTitleMusic(true);
  clearRun();
  resetOpenings();
  pressure.set(0); // reset reactor load on the title screen
  state.running = false;
  state.dmgCd = 0;
  player.position.set(0, 0, 0); // in the middle of the deck, below the line of the walls
  player.rotation.y = 0;
  // the first crowd starts spread along the way, alternating directions
  for (let i = 0; i < TITLE_DRONES; i++) {
    const x = crossX() * (2 * (i + rnd(0.2, 0.8)) / TITLE_DRONES - 1);
    crossYard(spawnDrone(new THREE.Vector3()), i % 2 ? 1 : -1, x);
  }
  document.body.classList.add('titling');
  menuEl.classList.remove('gone');
  menuEl.inert = false;
  menuEl.classList.toggle('splash', splash);
  menu.open(null);
  menu.select(0, true);
  showBest();
}

function wanderDrone(z, dt) {
  const ud = z.userData, c = ud.cross, dir = Math.sign(c.x);
  let walking = false;
  if (ud.idle > 0) ud.idle -= dt; // stand and sway a while
  else if (ud.stopX !== null && (z.position.x - ud.stopX) * dir > 0) {
    ud.stopX = null;
    ud.idle = rnd(1.5, 3.5);
  } else if (z.position.x * dir > crossX()) { // out of shot: round again after a beat
    crossYard(z, dir);
    ud.idle = rnd(0, 1);
  } else {
    const g = routeAround(z, c.x, c.z);
    walkToward(z, g.x - z.position.x, g.z - z.position.z, ud.speed, 1.5, dt);
    walking = true;
  }
  ud.gait = damp(ud.gait, walking ? 1 : 0, 4, dt);
  animateDrone(z, dt, 99);
}

function updateTitle(dt) {
  title.t += dt;
  // the odd groan from out in the dark
  if ((title.groan -= dt) <= 0 && drones.length) {
    const gz = drones[(Math.random() * drones.length) | 0];
    audio.servo(gz.position);
    gz.userData.groan = 1;
    title.groan = rnd(3, 7);
  }
}

// --- camera: a slow cinematic drift on the title, the follow cam in a run, a swoop between ---
const TITLE_FOV = 42, GAME_FOV = 55;
const followPos = new THREE.Vector3();
const titlePos = new THREE.Vector3(), titleLook = new THREE.Vector3(), camLook = new THREE.Vector3();
let camMix = 0; // 0 = title shot, 1 = follow cam
const swoop = t => t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2; // ease in-out cubic
function updateCamera(dt) {
  tmp.copy(player.position).add(CAM_OFFSET);
  if (state.shake > 0) {
    state.shake = Math.max(0, state.shake - dt * 2.2);
    const s = settings.shake ? state.shake : 0;
    tmp.x += (Math.random() - 0.5) * s;
    tmp.z += (Math.random() - 0.5) * s;
    tmp.y += (Math.random() - 0.5) * s;
  }
  if (camMix === 0) followPos.copy(tmp);
  else followPos.lerp(tmp, 1 - Math.pow(0.001, dt));
  camMix = THREE.MathUtils.clamp(camMix + (title.active ? -1 : 1) * dt / SWOOP_TIME, 0, 1);

  // title shot: low in the yard, drifting side to side and breathing like a handheld
  const t = title.t;
  titlePos.set(TITLE_CAM.x + 1.4 * Math.sin(t * 0.045), 3.15 + 0.22 * Math.sin(t * 0.07) + 0.03 * Math.sin(t * 1.3), TITLE_CAM.z - 1.2 * Math.sin(t * 0.031));
  titleLook.set(-1.8 + 0.7 * Math.sin(t * 0.045 + 0.6), 3.05, 8);

  const e = swoop(camMix);
  camera.position.lerpVectors(titlePos, followPos, e);
  camLook.lerpVectors(titleLook, player.position, e);
  camera.lookAt(camLook);
  const fov = THREE.MathUtils.lerp(TITLE_FOV, GAME_FOV, e);
  if (Math.abs(camera.fov - fov) > 1e-3) { camera.fov = fov; camera.updateProjectionMatrix(); }
}

// --- the menu itself: keyboard (arrows/WASD, enter, esc) and mouse both drive it ---
const menuButtons = [...document.querySelectorAll('#menuList button')];
const settingRows = [...document.querySelectorAll('#settingRows .srow')];
const menu = {
  sel: 0, panel: null, row: 0,
  select(i, quiet) {
    i = (i + menuButtons.length) % menuButtons.length;
    if (i !== this.sel && !quiet) audio.ui('move');
    this.sel = i;
    menuButtons.forEach((b, k) => b.classList.toggle('sel', k === i));
  },
  open(panel) {
    this.panel = panel;
    document.getElementById('howPanel').classList.toggle('open', panel === 'how');
    document.getElementById('settingsPanel').classList.toggle('open', panel === 'settings');
    if (panel === 'settings') this.selectRow(this.row, true);
    this.hints();
  },
  activate(i = this.sel) {
    const act = menuButtons[i].dataset.act;
    this.select(i, true);
    if (act === 'play') { this.open(null); startGame(true); return; }
    audio.ui(this.panel === act ? 'back' : 'select');
    this.open(this.panel === act ? null : act);
  },
  selectRow(i, quiet) {
    i = (i + settingRows.length) % settingRows.length;
    if (i !== this.row && !quiet) audio.ui('move');
    this.row = i;
    settingRows.forEach((r, k) => r.classList.toggle('sel', k === i));
  },
  adjust(key, dir) {
    if (key === 'shake') settings.shake = dir === 0 ? !settings.shake : dir > 0;
    else settings[key] = THREE.MathUtils.clamp(settings[key] + dir, 0, 10);
    store.set('settings', settings);
    audio.applyVolume();
    audio.ui('move');
    this.drawSettings();
  },
  drawSettings() {
    for (const r of settingRows) {
      const k = r.dataset.key, v = settings[k];
      if (k === 'shake') {
        r.querySelector('.toggle').innerHTML = `<i class="${v ? 'on' : ''}" data-v="1">ON</i><i class="${v ? '' : 'on'}" data-v="0">OFF</i>`;
        r.querySelector('em').textContent = '';
      } else {
        r.querySelector('.meter').innerHTML = Array.from({ length: 10 }, (_, n) => `<i class="${n < v ? 'on' : ''}" data-v="${n + 1}"></i>`).join('');
        r.querySelector('em').textContent = v * 10;
      }
    }
  },
  hints() {
    const keys = this.panel === 'settings'
      ? [['↑', '↓', 'SELECT'], ['←', '→', 'ADJUST'], ['ESC', 'BACK']]
      : this.panel ? [['ESC', 'BACK']]
      : [['↑', '↓', 'SELECT'], ['ENTER', 'CONFIRM']];
    document.getElementById('menuHints').innerHTML = keys.map(k =>
      `<span>${k.slice(0, -1).map(c => `<kbd>${c}</kbd>`).join('')}${k[k.length - 1]}</span>`).join('');
  },
  // keyboard: returns true if the title used the key
  key(e) {
    if (!title.active || menuEl.classList.contains('gone')) return false;
    if (e.code === 'KeyM') return false; // mute works everywhere
    if (e.code === 'Tab') return false;
    if (menuEl.classList.contains('splash')) { this.leaveSplash(); return true; }
    const c = e.code, up = c === 'ArrowUp' || c === 'KeyW', down = c === 'ArrowDown' || c === 'KeyS';
    const left = c === 'ArrowLeft' || c === 'KeyA', right = c === 'ArrowRight' || c === 'KeyD';
    const ok = c === 'Enter' || c === 'Space', back = c === 'Escape' || c === 'Backspace';
    if (this.panel === 'settings') {
      const key = settingRows[this.row].dataset.key;
      if (up) this.selectRow(this.row - 1);
      else if (down) this.selectRow(this.row + 1);
      else if (left || right) this.adjust(key, left ? -1 : 1);
      else if (ok && key === 'shake') this.adjust(key, 0);
      else if (back) { audio.ui('back'); this.open(null); }
    } else if (this.panel) {
      if (back || ok) { audio.ui('back'); this.open(null); }
    } else if (up) this.select(this.sel - 1);
    else if (down) this.select(this.sel + 1);
    else if (ok) this.activate();
    return true;
  },
  leaveSplash() {
    if (!menuEl.classList.contains('splash')) return;
    audio.ensure();
    audio.ui('select');
    menuEl.classList.remove('splash');
    this.select(0, true);
    this.hints();
  },
};
menu.drawSettings();
for (const button of document.querySelectorAll('.close-panel')) {
  button.addEventListener('click', () => {
    audio.ui('back');
    menu.open(null);
    menuButtons[menu.sel].focus();
  });
}
function showBest() {
  const b = store.get('best', null);
  document.getElementById('bestRun').innerHTML = b
    ? `<span class="lbl">BEST RUN</span>WAVE <b>${b.wave}</b> · <b>${b.kills}</b> UNITS DOWN`
    : '';
}
menuButtons.forEach((b, i) => {
  b.addEventListener('mouseenter', () => { if (!menu.panel || menu.panel !== b.dataset.act) menu.select(i); });
  b.addEventListener('focus', () => menu.select(i, true));
  b.addEventListener('click', () => menu.activate(i));
});
settingRows.forEach((r, i) => {
  r.addEventListener('mouseenter', () => menu.selectRow(i));
  r.addEventListener('click', e => {
    const v = e.target.dataset.v, key = r.dataset.key;
    if (v === undefined) { if (key === 'shake') menu.adjust(key, 0); return; }
    if (key === 'shake') menu.adjust(key, v === '1' ? 1 : -1);
    else menu.adjust(key, +v - settings[key]);
  });
});
menuEl.addEventListener('click', e => {
  if (menuEl.classList.contains('splash')) return menu.leaveSplash();
  // clicking the open scene (not the column or a panel) closes a panel
  if (menu.panel && !e.target.closest('.mpanel, #menuList')) { audio.ui('back'); menu.open(null); }
});

// ===================================================================
// UPDATE
// ===================================================================
const PLAYER_SPEED = 6.2; // base pace — MOTION SERVO scales state.speed; the run cadence follows it gently
const MAX_ALIVE = 30;     // spawning pauses while this many drones are up
const tmp = new THREE.Vector3();
let groanT = 1;

// --- drone melee: walk up, stop at arm's length, rear back and swing. The blow lands
// partway through, and only if you're still in range, so a step back dodges it ---
const Z_REACH = 1.2;      // stops and swings when this close (center to center)
const Z_LET_GO = 1.5;     // ...and only gives chase again once you're this far off
const Z_CLOSE = 0.95;     // never gets nearer than this (no standing inside the operator)
const Z_SPACE = 0.8;      // drones keep this far apart, so a crowd fans out around you
const Z_SWING = 0.85;     // seconds from wind-up to recovered
const Z_STRIKE = 0.2;     // the moment in the swing the blow lands
const Z_HIT_RANGE = 1.65; // the blow connects if you're still this close
const Z_TRACK = 7;        // rad/s a drone turns to keep facing you while it stands and swings
const HURT_IFRAMES = 1.5; // after a hit, the operator can't be hit again for this long (and flickers)

// is there a wall (or a shut door or window) between two points? (samples the line)
function wallBetween(a, b) {
  for (let i = 1; i < 4; i++) {
    const x = a.x + (b.x - a.x) * i / 4, z = a.z + (b.z - a.z) * i / 4;
    for (const w of wallBoxes) if (x >= w.minX && x <= w.maxX && z >= w.minZ && z <= w.maxZ) return true;
    if (shutAt(x, z)) return true;
  }
  return false;
}

// turn toward (dx, dz) at up to `rate` rad/s; returns how far off it's still facing
function faceToward(z, dx, dz, rate, dt) {
  const ud = z.userData, dA = wrapA(Math.atan2(dx, dz) - ud.heading);
  ud.heading += Math.max(-rate * dt, Math.min(rate * dt, dA));
  z.rotation.y = ud.heading;
  return Math.abs(dA) - Math.min(Math.abs(dA), rate * dt);
}

// Ease the heading toward the target instead of snapping, so drones arc into their
// turns, and slow down while facing well off it: a drone that overshoots turns round
// and comes back instead of orbiting.
function walkToward(z, dx, dz, speed, turn, dt) {
  const ud = z.userData, off = faceToward(z, dx, dz, turn, dt);
  const v = speed * Math.max(0.15, Math.cos(Math.min(off, Math.PI / 2)));
  z.position.x += Math.sin(ud.heading) * v * dt;
  z.position.z += Math.cos(ud.heading) * v * dt;
}

function hurtPlayer() {
  if (state.dmgCd > 0) return false;
  state.hp--;
  state.dmgCd = HURT_IFRAMES;
  damageFlash();
  audio.hurt();
  if (state.hp <= 0) die();
  return true;
}

function chaseDrone(z, dt) {
  const ud = z.userData, p = player.position;
  const pdx = p.x - z.position.x, pdz = p.z - z.position.z, pd = Math.hypot(pdx, pdz);
  let walking = false;
  if (ud.climb >= 0) {
    climbStep(z, dt);
  } else if (ud.swing >= 0) {
    // committed to the blow: feet planted, tracking its target through the wind-up
    const o = ud.swingAt;
    ud.swing += dt;
    if (ud.swing < Z_STRIKE) faceToward(z, o ? o.x - z.position.x : pdx, o ? o.z - z.position.z : pdz, Z_TRACK, dt);
    if (!ud.struck && ud.swing >= Z_STRIKE) {
      ud.struck = true;
      if (o) hitOpening(o);
      else if (!(pd < Z_HIT_RANGE && !wallBetween(z.position, p) && hurtPlayer())) audio.swipe(z.position);
    }
    if (ud.swing >= Z_SWING) { ud.swing = -1; ud.swingCd = rnd(0.25, 0.6); }
  } else if (pd < (ud.standing ? Z_LET_GO : Z_REACH) && !wallBetween(z.position, p)) {
    // at arm's length: stand, square up, and swing as soon as it's facing you (no
    // cooldown left over from battering its way in)
    if (!ud.standing) ud.swingCd = 0;
    ud.standing = true;
    const off = faceToward(z, pdx, pdz, Z_TRACK, dt);
    ud.swingCd -= dt;
    if (ud.swingCd <= 0 && off < 0.5) { ud.swing = 0; ud.struck = false; ud.swingAt = null; }
  } else {
    ud.standing = false;
    // steer toward nearest opening if outside, else toward player
    let tx = p.x, tz = p.z;
    if (inside(z.position)) {
      ud.opening = null; ud.stage = 0; // through the wall — re-pick if knocked back out
    } else {
      // Commit to one opening (no per-frame re-pick): walk up via its outer waypoint so
      // it comes at the door or window square-on, then break it and go through
      if (!ud.opening) { ud.opening = nearestOpening(z.position); ud.stage = 0; }
      const o = ud.opening;
      if (ud.stage === 0) {
        tx = o.ox; tz = o.oz;
        if ((o.ox - z.position.x) ** 2 + (o.oz - z.position.z) ** 2 < 1.4) ud.stage = 1;
      }
      if (ud.stage === 1) {
        if (o.kind === 'door' && o.hp <= 0) { tx = o.ix; tz = o.iz; } // broken down: straight through
        else if ((o.x - z.position.x) ** 2 + (o.z - z.position.z) ** 2 > 1.45 ** 2) { tx = o.fx; tz = o.fz; }
        else {
          // at it: batter it in, or take a turn climbing through the broken window
          tx = null;
          const off = faceToward(z, o.x - z.position.x, o.z - z.position.z, Z_TRACK, dt);
          ud.swingCd -= dt;
          if (o.hp > 0) { if (ud.swingCd <= 0 && off < 0.5) { ud.swing = 0; ud.struck = false; ud.swingAt = o; } }
          else if (!o.climber) startClimb(z, o);
        }
      }
    }
    if (tx !== null) {
      const g = routeAround(z, tx, tz);
      // turn harder up close so the last few steps home in on you
      walkToward(z, g.x - z.position.x, g.z - z.position.z, ud.speed, ud.turn * (pd < 4 ? 2.5 : 1), dt);
      walking = true;
    }
  }
  // progress check: a drone that's been trying to walk for 2s but has barely moved (jammed
  // in a crowd at a door, say) forgets its plan and makes for the next-nearest way in
  if (walking && (ud.stuckT += dt) > 2) {
    if (Math.hypot(z.position.x - ud.stuckX, z.position.z - ud.stuckZ) < 0.6 && ud.opening && !inside(z.position)) {
      ud.opening = nearestOpening(z.position, ud.opening);
      ud.stage = 0; ud.via = -1;
    }
    ud.stuckT = 0;
  }
  if (!walking || ud.stuckT === 0) { ud.stuckX = z.position.x; ud.stuckZ = z.position.z; if (!walking) ud.stuckT = 0; }
  ud.gait = damp(ud.gait, walking ? 1 : 0, 8, dt);
  animateDrone(z, dt, pd);
}

// keep the crowd from stacking into one body, out of the operator, and out of the props
function separateDrones() {
  for (let i = 0; i < drones.length; i++) {
    const a = drones[i].position;
    for (let k = i + 1; k < drones.length; k++) {
      const b = drones[k].position, dx = b.x - a.x, dz = b.z - a.z, d2 = dx * dx + dz * dz;
      if (d2 >= Z_SPACE * Z_SPACE || d2 < 1e-6) continue;
      const d = Math.sqrt(d2), push = (Z_SPACE - d) / 2 / d;
      a.x -= dx * push; a.z -= dz * push;
      b.x += dx * push; b.z += dz * push;
    }
  }
  for (const z of drones) {
    if (z.userData.climb >= 0) continue; // on the sill: the climb places it
    if (state.running) {
      const dx = z.position.x - player.position.x, dz = z.position.z - player.position.z, d = Math.hypot(dx, dz);
      if (d < Z_CLOSE && d > 1e-6) { z.position.x += dx / d * (Z_CLOSE - d); z.position.z += dz / d * (Z_CLOSE - d); }
    }
    pushOutOfSolids(z.position);
  }
}

function update(dt) {
  const px = player.position.x, pz = player.position.z;
  if (state.running) {
    // --- movement ---
    let mx = 0, mz = 0;
    if (keys['KeyW'] || keys['ArrowUp']) mz -= 1;
    if (keys['KeyS'] || keys['ArrowDown']) mz += 1;
    if (keys['KeyA'] || keys['ArrowLeft']) mx -= 1;
    if (keys['KeyD'] || keys['ArrowRight']) mx += 1;
    mx += moveStick.delta.x;
    mz += moveStick.delta.y;
    const moving = !!(mx || mz);
    if (moving) {
      const l = Math.max(1, Math.hypot(mx, mz));
      player.position.x += (mx / l) * state.speed * dt;
      player.position.z += (mz / l) * state.speed * dt;
    }
    // clamp inside deck
    const lim = HALF - 0.7;
    player.position.x = Math.max(-lim, Math.min(lim, player.position.x));
    player.position.z = Math.max(-lim, Math.min(lim, player.position.z));
    // --- aim ---
    raycaster.setFromCamera(mouse, camera);
    if (touchAiming) {
      aimPoint.set(player.position.x + touchDirection.x * 8, 0.9, player.position.z + touchDirection.y * 8);
      player.rotation.y = Math.atan2(touchDirection.x, touchDirection.y);
    } else if (raycaster.ray.intersectPlane(aimPlane, aimPoint)) {
      const a = Math.atan2(aimPoint.x - player.position.x, aimPoint.z - player.position.z);
      player.rotation.y = a;
    }

    // --- weapon ---
    state.fireCd -= dt;
    if (firing && !state.choosing) fire();
    if (state.reloading) {
      state.reloadT += dt;
      if (state.reloadT >= state.reloadTime) finishReload();
    }
    state.pDamage = Math.max(0, state.pDamage - dt);
    state.pAmmo = Math.max(0, state.pAmmo - dt);
    updateDrops(dt);

    // --- waves ---
    if (state.choosing) {
      // wave cleared — waiting on the upgrade pick
    } else if (state.intermission > 0) {
      state.intermission -= dt;
      if (state.intermission <= 0) startWave(state.wave + 1);
    } else {
      if (state.toSpawn > 0) {
        state.spawnTimer -= dt;
        if (state.spawnTimer <= 0 && drones.length < MAX_ALIVE) {
          // spawn 1-2 at a time, faster on higher waves
          const burst = 1 + (Math.random() < Math.min(0.6, state.wave * 0.08) ? 1 : 0);
          for (let i = 0; i < burst && state.toSpawn > 0; i++) { spawnDrone(); state.toSpawn--; }
          state.spawnTimer = Math.max(0.35, 1.4 - state.wave * 0.08);
        }
      } else if (drones.length === 0) {
        // wave cleared
        const healed = state.hp < state.maxHp;
        state.hp = Math.min(state.maxHp, state.hp + 1);
        audio.waveClear();
        openPicker(healed);
      }
    }

    state.dmgCd -= dt;

    // --- drone groans: more of them up = a busier, closer chorus ---
    if (drones.length) {
      groanT -= dt;
      if (groanT <= 0) {
        const gz = drones[(Math.random() * drones.length) | 0];
        audio.servo(gz.position);
        gz.userData.groan = 1; // the faceplate flexes with the servo
        groanT = rnd(0.5, 1.6) * 4 / Math.min(8, 2 + drones.length * 0.5);
      }
    }
  }
  if (title.active) updateTitle(dt);

  // --- bullets ---
  for (let i = bullets.length - 1; i >= 0; i--) {
    const b = bullets[i];
    const px = b.position.x, pz = b.position.z;
    b.position.addScaledVector(b.userData.dir, 38 * dt);
    b.userData.life -= dt;
    let hit = false;
    // wall collision: sample the path traveled this frame so fast bullets
    // can't tunnel through the thin walls (openings have no wall box; shut ones are checked below)
    const steps = Math.max(1, Math.ceil(Math.hypot(b.position.x - px, b.position.z - pz) / (WALL_T * 0.5)));
    for (let s = 1; s <= steps && !hit; s++) {
      const t = s / steps;
      const sx = px + (b.position.x - px) * t, sz = pz + (b.position.z - pz) * t;
      for (const w of wallBoxes) {
        if (sx >= w.minX && sx <= w.maxX && sz >= w.minZ && sz <= w.maxZ) { hit = true; break; }
      }
      // a shut door stops the round; glass shatters and lets it through
      const o = !hit && shutAt(sx, sz);
      if (o?.kind === 'door') { hit = true; o.jolt = 0.4; burst(o, 1, metalChip, 0.08, 1.5); audio.bash(o, 0.4); }
      else if (o) breakOpening(o);
    }
    for (let j = drones.length - 1; j >= 0 && !hit; j--) {
      const z = drones[j];
      if (b.userData.hits.has(z)) continue; // a piercing bullet already went through this one
      // distance from the drone to the path traveled this frame (not just the
      // end point), so bullets can't skip past drones at low frame rates
      const sx = b.position.x - px, sz = b.position.z - pz;
      const t = Math.max(0, Math.min(1, ((z.position.x - px) * sx + (z.position.z - pz) * sz) / (sx * sx + sz * sz || 1)));
      const dx = z.position.x - (px + sx * t), dz = z.position.z - (pz + sz * t);
      if (dx * dx + dz * dz < 0.55) {
        z.userData.hp -= state.damage * (state.pDamage > 0 ? 2 : 1);
        hitDrone(z);
        // small knockback
        z.position.addScaledVector(b.userData.dir, 0.25);
        if (z.userData.hp <= 0) { audio.shutdown(z.position); killDrone(z, j, b.userData.dir); }
        else audio.hit(z.position);
        b.userData.hits.add(z);
        if (b.userData.pierce > 0) b.userData.pierce--;
        else hit = true; // ends the loop; a piercing bullet keeps checking the rest
      }
    }
    if (hit || b.userData.life <= 0) { scene.remove(b); bullets.splice(i, 1); }
  }

  // --- drones ---
  for (let j = drones.length - 1; j >= 0; j--) {
    const z = drones[j];
    const ud = z.userData;
    // hurt flash recover
    if (ud.hurt > 0) {
      ud.hurt -= dt;
      if (ud.hurt <= 0) for (const m of ud.body) m.material = droneShell;
    }
    if (state.running) chaseDrone(z, dt);
    else if (title.active) wanderDrone(z, dt);
  }
  if (state.running || title.active) separateDrones();

  // --- particles ---
  for (let i = particles.length - 1; i >= 0; i--) {
    const p = particles[i];
    p.userData.life -= dt;
    p.scale.multiplyScalar(Math.exp(-2.5 * dt));
    p.userData.v.y -= 16 * dt;
    p.position.addScaledVector(p.userData.v, dt);
    if (p.position.y < 0.05) { p.position.y = 0.05; p.userData.v.set(0, 0, 0); }
    if (p.userData.life <= 0) { scene.remove(p); particles.splice(i, 1); }
  }

  updateCorpses(dt);
  updateOpenings(dt);
  updateWorld(dt);

  // --- operator rig, driven by how far the operator actually moved (so pushing into a
  // wall doesn't run in place). Runs on the title and death screens too, so the pose settles ---
  const inv = dt > 0 ? 1 / dt : 0;
  animatePlayer(dt, (player.position.x - px) * inv, (player.position.z - pz) * inv);
  // flicker while the post-hit grace period lasts
  player.visible = !state.running || state.dmgCd <= 0 || Math.floor(state.dmgCd * 12) % 2 === 0;
  updateDebris(dt);

  // damage flash fade
  if (flashT > 0) { flashT -= dt; hud.flash.style.opacity = Math.max(0, flashT) * 0.6; }

  updateCamera(dt);

  if (state.running && !state.choosing) updateToast(dt);
  updateHUD();
}

// ===================================================================
// LOOP
// ===================================================================
let last = performance.now();
function loop(now) {
  const dt = Math.min(0.05, (now - last) / 1000);
  last = now;
  if (!state.paused) update(dt);
  if (title.active) {
    titleScene.render(renderer, title.t, dt, menuEl.classList.contains('splash'), camera.aspect, titleMotion.matches);
  } else {
    renderer.render(scene, camera);
  }
  requestAnimationFrame(loop);
}

enterTitle(true);
updateCamera(0);
requestAnimationFrame(loop);
