import * as THREE from 'three';

import '@fontsource/rajdhani/latin-600.css';
import '@fontsource/rajdhani/latin-700.css';
import '@fontsource/oxanium/latin-700.css';
import './style.css';
import './title.css';
import { enhanceScrollArea } from './scroll-area.js';
import { createAudio } from './audio.js';
import { WAVE_LEAD_IN } from './score.js';
import { createTitleScene } from './title-scene.js';
import { firstBlocker, resolveShotStart } from './shot-collision.js';
import {
  canSubmitScore,
  fetchScores,
  normalizeName,
  readPlayerName,
  rejectMessage,
  startRun,
  submitScore,
  writePlayerName,
} from './scores.js';

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
const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');
const finePointerUi = () => matchMedia('(hover: hover) and (pointer: fine)').matches;
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1.12;
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.65));
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;

const scene = new THREE.Scene();
scene.background = new THREE.Color(0x080e16);
scene.fog = new THREE.Fog(0x080e16, 26, 67);

const camera = new THREE.PerspectiveCamera(55, 1, 0.1, 200);
const CAM_OFFSET = new THREE.Vector3(0, 24, 11);

function pinViewport() {
  window.scrollTo(0, 0);
}

function layoutSize() {
  // Prefer visualViewport: iOS Home Screen standalone often reports a stale
  // innerHeight (status bar / Dynamic Island still opening) and may never
  // fire window.resize when it shrinks. Menu hit-testing then sits ~one
  // button above the painted buttons.
  const vv = window.visualViewport;
  const w = vv?.width || document.documentElement.clientWidth || window.innerWidth;
  const h = vv?.height || document.documentElement.clientHeight || window.innerHeight;
  return { w: Math.max(1, Math.round(w)), h: Math.max(1, Math.round(h)) };
}

function onResize() {
  pinViewport();
  const { w, h } = layoutSize();
  document.documentElement.style.setProperty('--vv-w', w + 'px');
  document.documentElement.style.setProperty('--vv-h', h + 'px');
  camera.aspect = w / h;
  camera.updateProjectionMatrix();
  // updateStyle=false: CSS owns the canvas box. Stamping innerWidth/innerHeight
  // as inline width/height overflows the visual viewport on standalone iOS.
  renderer.setSize(w, h, false);
  canvas.style.width = '100%';
  canvas.style.height = '100%';
}

function scheduleResize() {
  onResize();
  requestAnimationFrame(() => {
    onResize();
    setTimeout(onResize, 80);
    setTimeout(onResize, 300);
  });
}

window.addEventListener('resize', scheduleResize);
window.addEventListener('orientationchange', scheduleResize);
window.addEventListener('pageshow', scheduleResize);
if (window.visualViewport) {
  visualViewport.addEventListener('resize', scheduleResize);
  visualViewport.addEventListener('scroll', () => {
    pinViewport();
    onResize();
  });
}
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
  const milestone = state.running && drones.some(z => z.userData.type.milestone);
  const tint = new THREE.Color(milestone ? (Math.floor(state.wave / 5) % 2 ? 0xffb183 : 0xc4a0ff) : CYAN);
  coreLight.color.lerp(tint, Math.min(1, dt * 1.5));
  cyanLight.color.lerp(tint, Math.min(1, dt * 1.5));
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
const powerGlowMaterials = [M.suit, M.vest, M.vestDk, M.plating, M.helmet, M.pants, M.glove, M.module];
const powerOrange = new THREE.Color(0xffa64c), powerBlue = new THREE.Color(0x76bcf0), powerPink = new THREE.Color(0xff78b5);
const powerHot = new THREE.Color(0xffffff);
let healGlow = 0, powerGlowTime = 0;
function updatePowerGlow(dt) {
  if (state.running) { healGlow = Math.max(0, healGlow - dt); powerGlowTime += dt; }
  const orange = state.running && state.pDamage > 0, blue = state.running && state.pAmmo > 0;
  const healing = state.running && healGlow > 0;
  const t = powerGlowTime;
  // Clear beat + faster shimmer so an active buff reads as charged, not a flat recolour.
  const beat = 0.5 + 0.5 * Math.sin(t * Math.PI * 2 / 0.7);
  const shimmer = 0.5 + 0.5 * Math.sin(t * Math.PI * 2 / 0.22);
  const beatBlue = 0.5 + 0.5 * Math.sin(t * Math.PI * 2 / 0.7 + 1.15);
  const steady = reducedMotion.matches;
  powerGlowMaterials.forEach((material, i) => {
    const useOrange = !healing && orange && (!blue || i < 4);
    const useBlue = !healing && blue && (!orange || i >= 4);
    const color = healing ? powerPink : useOrange ? powerOrange : powerBlue;
    const wave = useBlue ? beatBlue : beat;
    const pulse = steady ? 0.55 : 0.28 + 0.52 * wave + 0.22 * shimmer;
    const time = useOrange ? state.pDamage / 10 : state.pAmmo / 8;
    const stacked = Math.min(1, Math.max(0, time - 1));
    material.emissive.copy(color).lerp(powerHot, steady ? 0.12 : 0.12 + 0.55 * wave);
    material.emissiveIntensity = healing
      ? 0.7 * Math.min(1, healGlow * 3) * (steady ? 1 : 0.75 + 0.25 * shimmer)
      : orange || blue ? pulse + stacked * 0.35 : 0;
  });
}

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

// Soft green floor aura — permanent Magnetic Gems tell (not a timed HUD line).
const magnetDiscMat = new THREE.MeshBasicMaterial({
  color: 0x7cff4a, transparent: true, opacity: 0.07,
  depthWrite: false, toneMapped: false, blending: THREE.AdditiveBlending, side: THREE.DoubleSide,
});
const magnetRingMat = new THREE.MeshBasicMaterial({
  color: 0x7cff4a, transparent: true, opacity: 0.28,
  depthWrite: false, toneMapped: false, blending: THREE.AdditiveBlending, side: THREE.DoubleSide,
});
const magnetAura = new THREE.Group();
magnetAura.add(new THREE.Mesh(new THREE.CircleGeometry(1.35, 48).rotateX(-Math.PI / 2), magnetDiscMat));
magnetAura.add(new THREE.Mesh(new THREE.RingGeometry(1.05, 1.32, 48).rotateX(-Math.PI / 2), magnetRingMat));
magnetAura.position.y = 0.05;
magnetAura.visible = false;
player.add(magnetAura);
function updateMagnetAura() {
  const on = state.running && !!state.upgrades.magnet;
  magnetAura.visible = on;
  if (!on) return;
  const pulse = reducedMotion.matches ? 0.26 : 0.2 + 0.12 * (0.5 + 0.5 * Math.sin(powerGlowTime * 2.1));
  magnetRingMat.opacity = pulse;
  magnetDiscMat.opacity = pulse * 0.28;
}

// --- shell casings, dropped magazines and gun smoke ---
const debris = [];
const casingGeo = bevelBox(0.05, 0.05, 0.12, 0.012);
const smokeMats = Array.from({ length: 24 }, () =>
  new THREE.MeshStandardMaterial({ color: 0x8d8f94, roughness: 1, transparent: true, opacity: 0, depthWrite: false }));
let smokeI = 0;
const DEBRIS_SOFT_CAP = 90;
function spawnDebris(mesh, vel, o) {
  // Late waves can dump hundreds of sparks — keep a soft ceiling.
  while (debris.length >= DEBRIS_SOFT_CAP) {
    const old = debris.shift();
    scene.remove(old);
  }
  mesh.userData = { vel, spin: o.spin || new THREE.Vector3(), life: o.life, max: o.life, bounce: o.bounce, smoke: o.smoke, size: mesh.scale.clone() };
  scene.add(mesh);
  debris.push(mesh);
}

// 0 before wave 12, ~1 by wave 25 — scales FX/gem load without touching early game.
function fxPressure() {
  if (!state.running) return 0;
  return Math.max(0, Math.min(1, (state.wave - 12) / 13));
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
    if (!state.choosing && p < leg.prev && drive > 0.3) audio.step(); // a footfall each time a boot lands
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
  score: 0,
  waveTime: 0,
  shotsFired: 0,
  shotsHit: 0,
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
const movementKeys = new Set(['KeyW', 'KeyA', 'KeyS', 'KeyD', 'ArrowUp', 'ArrowLeft', 'ArrowDown', 'ArrowRight']);
let movementPressOrder = 0;
function keyboardAxis(negativeKeys, positiveKeys) {
  const negative = Math.max(...negativeKeys.map(code => keys[code] || 0));
  const positive = Math.max(...positiveKeys.map(code => keys[code] || 0));
  return negative === positive ? 0 : positive > negative ? 1 : -1;
}
const mouse = new THREE.Vector2();
let mouseFire = false;
let padFire = false;
let firing = false;
const aimPoint = new THREE.Vector3();
const aimPlane = new THREE.Plane(new THREE.Vector3(0, 1, 0), -0.9);
const raycaster = new THREE.Raycaster();
const touchControls = document.getElementById('touchControls');
const STICK_RADIUS = 48;   // px to full deflection
const STICK_KNOB = 28;     // visual knob travel
const AIM_DEAD = 0.18;     // aim stick deadzone (normalized); fire still holds
const PAD_DEAD = 0.18;     // standard gamepad radial deadzone (move + Geometry Wars aim/fire)
const PAD_UI_DELAY = 0.32;
const PAD_UI_REPEAT = 0.16;
const moveStick = { dot: document.getElementById('moveStick'), delta: new THREE.Vector2(), id: null, x: 0, y: 0 };
const aimStick = { dot: document.getElementById('aimStick'), delta: new THREE.Vector2(), id: null, x: 0, y: 0 };
const touchDirection = new THREE.Vector2(0, -1);
let touchAiming = false;
let padAiming = false;
let touchYaw = 0; // smoothed facing while the aim stick is active
const padMove = new THREE.Vector2();
let padPrevButtons = [];
let padUiAxis = '';
let padUiTimer = 0;
let padPickerSel = 0;

function syncFiring() {
  firing = mouseFire || padFire || aimStick.id !== null;
}

function resetStick(stick) {
  const pointerId = stick.id;
  stick.id = null;
  stick.delta.set(0, 0);
  stick.dot.classList.remove('active', 'firing');
  if (pointerId !== null && canvas.hasPointerCapture(pointerId)) canvas.releasePointerCapture(pointerId);
}

function resetGameplayInput() {
  for (const k in keys) delete keys[k];
  resetStick(moveStick);
  resetStick(aimStick);
  mouseFire = false;
  padFire = false;
  padMove.set(0, 0);
  firing = false;
}

function padRadial(x, y, dead = PAD_DEAD) {
  const len = Math.hypot(x, y);
  if (len < dead) return { x: 0, y: 0, len: 0 };
  const scale = Math.min(1, (len - dead) / (1 - dead)) / len;
  return { x: x * scale, y: y * scale, len };
}

function readStandardPad() {
  if (!gamepadLive || typeof navigator.getGamepads !== 'function') return null;
  for (const pad of navigator.getGamepads()) {
    if (!pad) continue;
    if (pad.mapping === 'standard' || pad.axes.length >= 4) return pad;
  }
  return null;
}

function padBtnDown(pad, i) {
  const b = pad.buttons[i];
  return !!(b && (b.pressed || b.value >= 0.5));
}

function padJust(pad, i) {
  return padBtnDown(pad, i) && !padPrevButtons[i];
}

function snapPadButtons(pad) {
  padPrevButtons = pad.buttons.map((b) => !!(b && (b.pressed || b.value >= 0.5)));
}

function setPadAiming(on) {
  padAiming = on;
  document.body.classList.toggle('pad-aiming', on);
}

function gamepadRumble(duration = 90, weak = 0.35, strong = 0.65) {
  try {
    const pad = readStandardPad();
    const actuator = pad?.vibrationActuator;
    if (!actuator?.playEffect) return;
    actuator.playEffect('dual-rumble', {
      startDelay: 0,
      duration,
      weakMagnitude: weak,
      strongMagnitude: strong,
    });
  } catch { /* optional haptic */ }
}

function deathFocusables() {
  const list = [];
  if (deathPadEntry && !deathArcade.classList.contains('hidden')) {
    if (arcadeFocus >= 3) list.push(deathArcadeSubmit);
  } else if (!deathNameForm.classList.contains('hidden')) {
    list.push(deathNameInput, deathSubmitBtn);
  }
  if (!deathMenu.classList.contains('hidden')) {
    list.push(document.getElementById('retryBtn'), document.getElementById('deathQuitBtn'));
  }
  return list.filter((el) => el && !el.disabled && el.offsetParent !== null);
}

function deathArcadeLocked() {
  return deathPadEntry
    && !deathArcade.classList.contains('hidden')
    && !!pendingSubmit
    && deathMenu.classList.contains('hidden');
}

function clearDeathPadSel() {
  document.querySelectorAll('#death .pad-sel').forEach((el) => el.classList.remove('pad-sel'));
}

function setDeathPadFocus(el) {
  clearDeathPadSel();
  if (!el) return;
  el.classList.add('pad-sel');
  el.focus({ preventScroll: true });
}

function pauseFocusables() {
  return [document.getElementById('resumeBtn'), document.getElementById('quitBtn')].filter(Boolean);
}

function cycleFocus(list, dir) {
  if (!list.length) return;
  const ae = document.activeElement;
  let i = list.indexOf(ae);
  if (i < 0) i = dir > 0 ? -1 : 0;
  i = (i + dir + list.length) % list.length;
  list[i].focus({ preventScroll: true });
}

function activateFocusedUi() {
  const ae = document.activeElement;
  if (!ae) return false;
  if (deathPadEntry && !deathArcade.classList.contains('hidden')) {
    if (arcadeFocus < 3) {
      if (arcadeFocus >= 2) setArcadeFocus(3);
      else setArcadeFocus(arcadeFocus + 1);
      audio.ui('move');
      return true;
    }
    void submitArcadeCallsign();
    return true;
  }
  if (ae === deathNameInput) {
    if (normalizeName(deathNameInput.value)) setDeathPadFocus(deathSubmitBtn);
    return true;
  }
  if (ae === deathSubmitBtn) {
    deathNameForm.requestSubmit?.() || deathNameForm.dispatchEvent(new Event('submit', { cancelable: true, bubbles: true }));
    return true;
  }
  if (ae === deathArcadeSubmit) {
    void submitArcadeCallsign();
    return true;
  }
  if (typeof ae.click === 'function' && (ae.matches('button, .card, .srow, .close-panel') || ae.closest?.('#pauseMenu, #deathMenu, #menuList'))) {
    ae.click();
    return true;
  }
  return false;
}

function padUiDirection(pad) {
  // Left stick steers menus only when combat isn't reading it for movement.
  const stickNav = !(state.running && !state.paused && !state.choosing);
  const stick = stickNav ? padRadial(pad.axes[0] || 0, pad.axes[1] || 0, 0.45) : { x: 0, y: 0 };
  if (padBtnDown(pad, 12) || stick.y < -0.55) return 'up';
  if (padBtnDown(pad, 13) || stick.y > 0.55) return 'down';
  if (padBtnDown(pad, 14) || stick.x < -0.55) return 'left';
  if (padBtnDown(pad, 15) || stick.x > 0.55) return 'right';
  return '';
}

function handlePadUiNav(dir) {
  if (!dir) return;
  if (title.active && !menuEl.classList.contains('gone')) {
    menu.kbdHighlight = true;
    if (menuEl.classList.contains('splash')) {
      menu.leaveSplash();
      return;
    }
    const code = dir === 'up' ? 'ArrowUp' : dir === 'down' ? 'ArrowDown' : dir === 'left' ? 'ArrowLeft' : 'ArrowRight';
    menu.key({ code, shiftKey: false, preventDefault() {} });
    const focusBtn = menu.panel === 'settings' ? settingRows[menu.row] : menuButtons[menu.sel];
    focusBtn?.focus?.({ preventScroll: true });
    return;
  }
  if (state.choosing && !state.paused) {
    const cards = [...hud.cards.querySelectorAll('button.card')];
    if (!cards.length) return;
    const step = dir === 'left' || dir === 'up' ? -1 : 1;
    setPadPickerSel(padPickerSel + step);
    audio.ui('move');
    return;
  }
  if (state.paused) {
    cycleFocus(pauseFocusables(), dir === 'up' || dir === 'left' ? -1 : 1);
    audio.ui('move');
    return;
  }
  if (!document.getElementById('death').classList.contains('hidden')) {
    if (deathArcadeLocked() || (deathPadEntry && !deathArcade.classList.contains('hidden') && arcadeFocus < 3)) {
      handleArcadePadNav(dir);
      return;
    }
    if (deathPadEntry && !deathArcade.classList.contains('hidden') && arcadeFocus === 3) {
      if (dir === 'up' || dir === 'left') {
        setArcadeFocus(2);
        audio.ui('move');
        return;
      }
      if ((dir === 'down' || dir === 'right') && !deathMenu.classList.contains('hidden')) {
        arcadeFocus = 4;
        setDeathPadFocus(document.getElementById('retryBtn'));
        audio.ui('move');
        return;
      }
    }
    if (deathPadEntry && arcadeFocus >= 4 && (dir === 'up' || dir === 'left') && !deathArcade.classList.contains('hidden')) {
      const list = deathFocusables();
      if (document.activeElement === list[0]) {
        arcadeFocus = 3;
        setArcadeFocus(3);
        audio.ui('move');
        return;
      }
    }
    const step = dir === 'up' || dir === 'left' ? -1 : 1;
    cycleFocus(deathFocusables(), step);
    const ae = document.activeElement;
    if (gamepadLive && ae && deathFocusables().includes(ae)) setDeathPadFocus(ae);
    audio.ui('move');
  }
}

function handlePadUiConfirm() {
  if (title.active && !menuEl.classList.contains('gone')) {
    menu.kbdHighlight = true;
    if (menuEl.classList.contains('splash')) { menu.leaveSplash(); return; }
    if (menu.panel === 'settings') {
      const key = settingRows[menu.row]?.dataset.key;
      if (key === 'shake') menu.adjust(key, 0);
      else menu.adjust(key, 1);
      return;
    }
    if (menu.panel) { audio.ui('back'); menu.open(null); return; }
    menu.activate();
    return;
  }
  if (state.choosing && !state.paused) {
    const cards = [...hud.cards.querySelectorAll('button.card')];
    const card = cards[padPickerSel] || cards.find((c) => c.classList.contains('pad-sel')) || cards[0];
    if (card) choose(+card.dataset.i);
    return;
  }
  if (state.paused || !document.getElementById('death').classList.contains('hidden')) {
    if (!activateFocusedUi()) {
      if (state.paused) setPaused(false);
      else if (!deathArcadeLocked()) startGame();
    }
  }
}

function handlePadUiBack() {
  if (title.active && !menuEl.classList.contains('gone')) {
    if (menu.panel) { audio.ui('back'); menu.open(null); }
    return;
  }
  if (state.paused) { setPaused(false); return; }
  if (!document.getElementById('death').classList.contains('hidden')) {
    if (deathPadEntry && !deathArcade.classList.contains('hidden') && (deathArcadeLocked() || arcadeFocus <= 3)) {
      if (arcadeFocus > 0) {
        setArcadeFocus(arcadeFocus - 1);
        audio.ui('back');
      }
      return;
    }
    const ae = document.activeElement;
    if (ae === deathNameInput) {
      if (!deathMenu.classList.contains('hidden')) setDeathPadFocus(document.getElementById('retryBtn'));
      return;
    }
    if (!deathMenu.classList.contains('hidden')) setDeathPadFocus(document.getElementById('deathQuitBtn'));
  }
}

function setPadPickerSel(i) {
  const cards = [...hud.cards.querySelectorAll('button.card')];
  if (!cards.length) return;
  padPickerSel = ((i % cards.length) + cards.length) % cards.length;
  cards.forEach((c, k) => c.classList.toggle('pad-sel', k === padPickerSel));
  // Focus for a11y; visual selection is .pad-sel (programmatic focus is not :focus-visible).
  cards[padPickerSel].focus({ preventScroll: true });
}

function clearPadPickerSel() {
  hud.cards?.querySelectorAll('.pad-sel').forEach((c) => c.classList.remove('pad-sel'));
}

function pollGamepad(dt) {
  const pad = readStandardPad();
  if (!pad) {
    padMove.set(0, 0);
    if (padFire) {
      padFire = false;
      syncFiring();
    }
    return;
  }

  const move = padRadial(pad.axes[0] || 0, pad.axes[1] || 0);
  padMove.set(move.x, move.y);
  // Geometry Wars: right stick past deadzone aims and fires; release stops fire (keep last aim).
  const aim = padRadial(pad.axes[2] || 0, pad.axes[3] || 0);
  if (aim.len > 0) {
    touchDirection.set(aim.x, aim.y).normalize();
    touchAiming = true;
    setPadAiming(true);
    if (!padFire) {
      padFire = true;
      syncFiring();
    }
    notePlayInput('gamepad');
  } else if (padFire) {
    padFire = false;
    syncFiring();
  }
  if (padMove.lengthSq() > 0) notePlayInput('gamepad');

  const uiDir = padUiDirection(pad);
  if (uiDir) {
    if (uiDir !== padUiAxis) {
      padUiAxis = uiDir;
      padUiTimer = PAD_UI_DELAY;
      handlePadUiNav(uiDir);
      notePlayInput('gamepad');
    } else {
      padUiTimer -= dt;
      if (padUiTimer <= 0) {
        padUiTimer = PAD_UI_REPEAT;
        handlePadUiNav(uiDir);
        notePlayInput('gamepad');
      }
    }
  } else {
    padUiAxis = '';
    padUiTimer = 0;
  }

  if (padJust(pad, 0)) { handlePadUiConfirm(); notePlayInput('gamepad'); }
  if (padJust(pad, 1)) { handlePadUiBack(); notePlayInput('gamepad'); }
  if (padJust(pad, 2) || padJust(pad, 4)) {
    if (state.running && !state.paused && !state.choosing) startReload();
    notePlayInput('gamepad');
  }
  if (padJust(pad, 8)) {
    const m = audio.toggleMute();
    document.getElementById('reloadHint').textContent = m ? '[R] RELOAD   ·   [M] MUTED' : '[R] RELOAD';
    notePlayInput('gamepad');
  }
  if (padJust(pad, 9)) {
    if (state.running) setPaused(!state.paused);
    else if (title.active && menuEl.classList.contains('splash')) menu.leaveSplash();
    notePlayInput('gamepad');
  }

  snapPadButtons(pad);
}

// Lightweight run telemetry for the board (hidden columns). Last-used type + dt buckets only.
const playInputTime = { touch: 0, pointer: 0, gamepad: 0 };
let lastPlayInput = 'pointer';
let gamepadLive = !![...(navigator.getGamepads?.() || [])].some(Boolean);
const runDevice = (() => {
  const ua = navigator.userAgent || '';
  const touchPoints = navigator.maxTouchPoints || 0;
  const coarse = matchMedia('(pointer: coarse)').matches;
  const longEdge = Math.max(screen.width || 0, screen.height || 0);
  // iPadOS 13+ often reports as Macintosh with multi-touch.
  if (/Macintosh/i.test(ua) && touchPoints > 1) return 'tablet';
  if (/iPhone|iPod|Windows Phone/i.test(ua) || (/Android/i.test(ua) && /Mobile/i.test(ua))) return 'phone';
  if (/iPad/i.test(ua) || (/Android/i.test(ua) && !/Mobile/i.test(ua))) return 'tablet';
  if ((touchPoints > 0 || coarse) && longEdge > 0 && longEdge < 700) return 'phone';
  if ((touchPoints > 0 || coarse) && longEdge > 0 && longEdge < 1100) return 'tablet';
  return 'desktop';
})();

function notePlayInput(kind) {
  if (kind === 'touch' || kind === 'pointer' || kind === 'gamepad') lastPlayInput = kind;
}

function resetPlayInputStats() {
  playInputTime.touch = playInputTime.pointer = playInputTime.gamepad = 0;
  lastPlayInput = finePointerUi() ? 'pointer' : 'touch';
}

function tickPlayInput(dt) {
  if (!state.running || state.paused || state.choosing) return;
  if (gamepadLive && typeof navigator.getGamepads === 'function') {
    for (const pad of navigator.getGamepads()) {
      if (!pad) continue;
      let active = false;
      for (const button of pad.buttons) { if (button.pressed) { active = true; break; } }
      if (!active) for (const axis of pad.axes) { if (Math.abs(axis) > 0.25) { active = true; break; } }
      if (active) { lastPlayInput = 'gamepad'; break; }
    }
  }
  playInputTime[lastPlayInput] += dt;
}

function dominantPlayInput() {
  const total = playInputTime.touch + playInputTime.pointer + playInputTime.gamepad;
  if (total <= 0) return null;
  let best = 'pointer', bestT = -1;
  for (const key of ['touch', 'pointer', 'gamepad']) {
    if (playInputTime[key] > bestT) { best = key; bestT = playInputTime[key]; }
  }
  // Minority share ≥ ~25% of active play → mixed.
  if ((total - bestT) / total >= 0.25) return 'mixed';
  return best;
}

function focusGame() {
  canvas.focus({ preventScroll: true });
}

function paintStick(stick) {
  stick.dot.style.left = stick.x + 'px';
  stick.dot.style.top = stick.y + 'px';
  stick.dot.style.setProperty('--dx', stick.delta.x * STICK_KNOB + 'px');
  stick.dot.style.setProperty('--dy', stick.delta.y * STICK_KNOB + 'px');
}

// Twin-stick standard: thumb plants the base; if the thumb drifts past the rim,
// the base follows so full input never drops and quick 180° flicks stay possible.
function updateStick(stick, clientX, clientY) {
  let dx = clientX - stick.x;
  let dy = clientY - stick.y;
  const len = Math.hypot(dx, dy);
  if (len > STICK_RADIUS) {
    const follow = len - STICK_RADIUS;
    stick.x += (dx / len) * follow;
    stick.y += (dy / len) * follow;
    dx = clientX - stick.x;
    dy = clientY - stick.y;
  }
  stick.delta.set(dx / STICK_RADIUS, dy / STICK_RADIUS);
  paintStick(stick);
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

const HUD_CLAIM = '#touchPause, #ammoWrap';
const UI_ROOTS = '#menu, #pause, #death, #picker, #bootError';
function isMousePointer(e) {
  return e.pointerType === 'mouse';
}
function hudControlFromEvent(e) {
  const direct = e.target?.closest?.(HUD_CLAIM);
  if (direct) return direct.closest('#touchPause') ? 'pause' : 'reload';
  if (typeof document.elementsFromPoint !== 'function') return null;
  for (const el of document.elementsFromPoint(e.clientX, e.clientY)) {
    if (el.closest?.('#touchPause')) return 'pause';
    if (el.closest?.('#ammoWrap')) return 'reload';
  }
  return null;
}
function claimPointer(e) {
  e.stopPropagation();
  if (typeof e.stopImmediatePropagation === 'function') e.stopImmediatePropagation();
  if (e.cancelable) e.preventDefault();
}
// Overlay buttons must not wait for a synthesized click: html/body use
// touch-action:none, and iOS often drops click after the first audio unlock.
function bindTap(el, handler, opts = {}) {
  let last = 0;
  const run = e => {
    if (opts.filter && !opts.filter(e)) return false;
    const now = performance.now();
    if (now - last < 320) return false;
    last = now;
    handler(e);
    return true;
  };
  el.addEventListener('pointerdown', e => {
    if (isMousePointer(e)) return;
    if (typeof e.button === 'number' && e.button !== 0) return;
    if (opts.filter && !opts.filter(e)) return;
    if (opts.claim) claimPointer(e);
    run(e);
  }, { capture: !!opts.capture, passive: false });
  el.addEventListener('click', e => {
    if (opts.filter && !opts.filter(e)) return;
    run(e);
  }, { capture: !!opts.capture });
}

canvas.addEventListener('pointerdown', e => {
  if (isMousePointer(e) || !state.running || state.paused || state.choosing) return;
  if (e.target?.closest?.(UI_ROOTS) || hudControlFromEvent(e)) return;
  notePlayInput('touch');
  for (const k of movementKeys) delete keys[k];
  const stick = e.clientX < layoutSize().w / 2 ? moveStick : aimStick;
  if (stick.id !== null) return;
  stick.id = e.pointerId;
  stick.x = e.clientX;
  stick.y = e.clientY;
  stick.delta.set(0, 0);
  stick.dot.classList.add('active');
  paintStick(stick);
  // Right thumb down = shoot immediately in the current facing. Drag only steers aim.
  // This matches Geometry Wars / Minigore-style twin-stick expectations.
  if (stick === aimStick) {
    if (!touchAiming) {
      touchDirection.set(Math.sin(player.rotation.y), Math.cos(player.rotation.y));
      touchYaw = player.rotation.y;
    }
    touchAiming = true;
    setPadAiming(false);
    syncFiring();
    stick.dot.classList.add('firing');
  }
  canvas.setPointerCapture(e.pointerId);
  e.preventDefault();
});
canvas.addEventListener('pointermove', e => {
  const stick = [moveStick, aimStick].find(item => item.id === e.pointerId);
  if (!stick) return;
  updateStick(stick, e.clientX, e.clientY);
  if (stick === aimStick) {
    if (stick.delta.lengthSq() > AIM_DEAD * AIM_DEAD) {
      touchDirection.copy(stick.delta).normalize();
    }
    touchAiming = true;
    setPadAiming(false);
    syncFiring();
    stick.dot.classList.add('firing');
  }
});
function releaseStick(e) {
  if (e.pointerId === moveStick.id) resetStick(moveStick);
  if (e.pointerId === aimStick.id) resetStick(aimStick);
  syncFiring();
}
window.addEventListener('pointerup', releaseStick, true);
window.addEventListener('pointercancel', releaseStick, true);
canvas.addEventListener('lostpointercapture', releaseStick);
document.getElementById('touchReload').addEventListener('click', startReload);
window.addEventListener('pointerdown', e => {
  if (isMousePointer(e) || document.body.classList.contains('titling')) return;
  const which = hudControlFromEvent(e);
  if (!which) return;
  claimPointer(e);
  notePlayInput('touch');
  if (which === 'pause') setPaused(true);
  else startReload();
}, { capture: true, passive: false });

window.addEventListener('keydown', e => {
  if (menu.key(e)) { e.preventDefault(); return; }
  if (e.code === 'Enter' && !state.running && !document.getElementById('death').classList.contains('hidden')) {
    if (deathArcadeLocked()) return;
    return startGame();
  }
  if (movementKeys.has(e.code) && state.running) {
    e.preventDefault(); // Arrow keys control movement, never a focused UI panel.
    if (state.paused || state.choosing) return;
    resetStick(moveStick); // Keyboard movement must not cancel against a stale touch vector.
  }
  // OS key-repeat must not let an older held direction steal priority back.
  if (movementKeys.has(e.code)) {
    if (!keys[e.code]) keys[e.code] = ++movementPressOrder;
  } else keys[e.code] = true;
  if (state.running) notePlayInput('pointer');
  if (e.code === 'Escape' || e.code === 'KeyP') { if (!e.repeat) setPaused(!state.paused); return; }
  if (state.paused) return;
  if (e.code === 'KeyR') startReload();
  if (state.choosing && /^Digit[1-3]$/.test(e.code)) choose(+e.code.slice(5) - 1);
  if (e.code === 'KeyM') {
    const m = audio.toggleMute();
    document.getElementById('reloadHint').textContent = m ? '[R] RELOAD   ·   [M] MUTED' : '[R] RELOAD';
  }
});
window.addEventListener('keyup', e => { delete keys[e.code]; }, true);
window.addEventListener('mousemove', e => {
  touchAiming = false;
  setPadAiming(false);
  if (state.running) notePlayInput('pointer');
  const view = layoutSize();
  mouse.x = (e.clientX / view.w) * 2 - 1;
  mouse.y = -(e.clientY / view.h) * 2 + 1;
});
canvas.addEventListener('mousedown', e => {
  if (e.button === 0) {
    mouseFire = true;
    syncFiring();
    if (state.running) notePlayInput('pointer');
  }
});
window.addEventListener('mouseup', () => { mouseFire = false; syncFiring(); });
window.addEventListener('gamepadconnected', () => {
  gamepadLive = true;
  padPrevButtons = [];
});
window.addEventListener('gamepaddisconnected', () => {
  gamepadLive = !![...(navigator.getGamepads?.() || [])].some(Boolean);
  if (!gamepadLive) {
    padMove.set(0, 0);
    padFire = false;
    setPadAiming(false);
    syncFiring();
    padPrevButtons = [];
  }
});
window.addEventListener('contextmenu', e => e.preventDefault());
window.addEventListener('selectstart', e => e.preventDefault());
window.addEventListener('gesturestart', e => e.preventDefault());
window.addEventListener('gesturechange', e => e.preventDefault());
window.addEventListener('gestureend', e => e.preventDefault());

function pendingDeathCallsign() {
  if (deathPadEntry && !deathArcade.classList.contains('hidden')) return arcadeCallsign();
  return normalizeName(deathNameInput.value);
}

// the death screen: go again, or back to the title
bindTap(document.getElementById('retryBtn'), async () => {
  // Arcade entry locks the menu until submit; keyboard/touch can still auto-post on leave.
  if (!deathArcadeLocked() && pendingSubmit && pendingDeathCallsign()) {
    await publishRunScore(pendingDeathCallsign());
  }
  startGame();
});
bindTap(document.getElementById('deathQuitBtn'), async () => {
  if (!deathArcadeLocked() && pendingSubmit && pendingDeathCallsign()) {
    await publishRunScore(pendingDeathCallsign());
  }
  quitToTitle();
});
bindTap(document.getElementById('resumeBtn'), () => setPaused(false));
bindTap(document.getElementById('quitBtn'), () => quitToTitle());
// alt-tabbing away mid-run pauses (and would otherwise leave WASD stuck down)
window.addEventListener('blur', () => { resetGameplayInput(); setPaused(true); });
document.addEventListener('visibilitychange', () => {
  if (document.hidden) { resetGameplayInput(); setPaused(true); }
});
bindTap(document.getElementById('cards'), e => {
  const c = e.target.closest('.card');
  if (c) choose(+c.dataset.i);
}, { filter: e => e.target.closest('.card') });
document.getElementById('cards').addEventListener('mouseover', e => {
  if (!matchMedia('(hover: hover) and (pointer: fine)').matches) return;
  const c = e.target.closest('.card');
  if (c && !c.contains(e.relatedTarget) && state.choosing) audio.hover(+c.dataset.i);
});

// ===================================================================
// HUD
// ===================================================================
const hud = {
  wave: document.getElementById('waveNum'),
  score: document.getElementById('score'),
  highScore: document.getElementById('highScore'),
  health: document.getElementById('health'),
  shieldPips: document.getElementById('shieldPips'),
  shieldCount: document.getElementById('shieldCount'),
  powerups: document.getElementById('powerups'),
  toast: document.getElementById('toast'),
  toastIcon: document.getElementById('toastIcon'),
  toastTitle: document.getElementById('toastTitle'),
  toastDetail: document.getElementById('toastDetail'),
  picker: document.getElementById('picker'),
  pickerTitle: document.getElementById('pickerTitle'),
  pickerSub: document.getElementById('pickerSub'),
  cards: document.getElementById('cards'),
  weaponIcon: document.getElementById('weaponIcon'),
  weaponMods: document.getElementById('weaponMods'),
  mag: document.getElementById('mag'),
  bossPanel: document.getElementById('bossPanel'),
  bossName: document.getElementById('bossName'),
  bossHealth: document.getElementById('bossHealth'),
  ammoWrap: document.getElementById('ammoWrap'),
  cellStatus: document.getElementById('cellStatus'),
  reloadBar: document.getElementById('reloadBar'),
  reloadFill: document.getElementById('reloadFill'),
  flash: document.getElementById('flash'),
  banner: document.getElementById('banner'),
  bannerText: document.getElementById('bannerText'),
  bannerSub: document.getElementById('bannerSub'),
};

const formatScore = n => Math.max(0, Math.round(n)).toLocaleString('en-US');
function readHighScore() {
  return store.get('highscore', null) || { score: 0, wave: 0, kills: 0 };
}
function addScore(points) {
  if (!points) return;
  state.score += points;
  if (hud.score) hud.score.textContent = formatScore(state.score);
}

function updateWeaponIcon() {
  const { mag = 0, reload = 0, damage = 0, rate = 0, pierce = 0, spread = 0 } = state.upgrades;
  hud.weaponMods.innerHTML = [
    pierce && `<path d="M${22 - 4 * pierce} 27H35v6H${22 - 4 * pierce}z"/>`,
    spread && `<path d="M${42 - 5 * spread} 35H66v5H${42 - 5 * spread}z"/>`,
    damage && `<path d="M${80 - 5 * damage} 24l5-7h${8 + 5 * damage}l6 7z"/>`,
    rate && `<path d="M93 21v-${6 + 2 * rate}h34l5 ${6 + 2 * rate}z"/>`,
    mag && `<path d="M106 36h15l-5 ${10 + 2 * mag}h-13z"/>`,
    reload && `<path d="M134 30h${8 + 3 * reload}l-4 6h-${4 + 3 * reload}z"/>`,
  ].filter(Boolean).join('');
  const installed = UPGRADES
    .filter(u => (u.cat === 'firepower' || u.cat === 'handling') && state.upgrades[u.id])
    .map(u => `${u.name} level ${state.upgrades[u.id]}`);
  hud.weaponIcon.setAttribute('aria-label', ['Pulse rifle', ...installed].join(', '));
}

function updateHUD() {
  syncTouchControls();
  hud.wave.textContent = state.wave;
  hud.score.textContent = formatScore(state.score);
  hud.highScore.textContent = formatScore(readHighScore().score);
  const remaining = drones.length + state.toSpawn + (state.bossPending ? 1 : 0);
  const boss = drones.find(z => z.userData.boss);
  hud.bossPanel.hidden = !boss || !state.running;
  if (boss) {
    const u = boss.userData;
    hud.bossName.textContent = u.type.name;
    hud.bossHealth.max = u.maxHp;
    hud.bossHealth.value = Math.max(0, u.hp);
    hud.bossHealth.setAttribute('aria-label', `${u.type.name}: ${Math.ceil(u.hp)} of ${u.maxHp} health`);
  }
  checkBotMilestones(remaining);
  if (hud.shieldPips.children.length !== state.maxHp) {
    hud.shieldPips.innerHTML = '<span class="shield-pip"></span>'.repeat(state.maxHp);
  }
  const shieldLabel = `Shields: ${state.hp} of ${state.maxHp}`;
  if (hud.health.getAttribute('aria-label') !== shieldLabel) {
    hud.health.setAttribute('aria-label', shieldLabel);
    hud.shieldCount.textContent = `${state.hp} / ${state.maxHp}`;
    [...hud.shieldPips.children].forEach((pip, i) => pip.classList.toggle('dead', i >= state.hp));
  }
  // power-up time left as a clock: 0:10 … 0:01 (what they do was taught on first pickup)
  const clock = t => { const s = Math.ceil(t); return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`; };
  let pu = '';
  if (state.pDamage > 0) pu += `<div style="color:#ffa64c">OVERCHARGE ${clock(state.pDamage)}${state.pDamage > 10 ? ' · EXTENDED' : ''}</div>`;
  if (state.pAmmo > 0) pu += `<div style="color:#76bcf0">INFINITE CELL ${clock(state.pAmmo)}${state.pAmmo > 8 ? ' · EXTENDED' : ''}</div>`;
  if (healGlow > 0) pu += '<div style="color:#ff78b5">+1 SHIELD RESTORED</div>';
  hud.powerups.innerHTML = pu;
  const infinite = state.pAmmo > 0;
  const lastCharge = !infinite && !state.reloading && state.mag === 1;
  const cellStatus = state.reloading ? 'RECHARGING…' : infinite ? 'INFINITE CELL' : lastCharge ? 'LAST CHARGE' : 'CELL READY';
  if (hud.cellStatus.textContent !== cellStatus) hud.cellStatus.textContent = cellStatus;
  hud.ammoWrap.classList.toggle('low-charge', lastCharge);
  hud.ammoWrap.classList.toggle('recharging', state.reloading);
  const magLabel = infinite ? 'Unlimited charges' : `Cell: ${state.mag} of ${state.magSize} charges`;
  if (hud.mag.getAttribute('aria-label') !== magLabel) {
    hud.mag.setAttribute('aria-label', magLabel);
    hud.mag.innerHTML = '<span class="live"></span>'.repeat(state.mag)
      + '<span class="empty"></span>'.repeat(state.magSize - state.mag);
  }
  hud.reloadBar.classList.toggle('active', state.reloading);
  if (state.reloading) hud.reloadFill.style.width = (state.reloadT / state.reloadTime * 100) + '%';
}

let flashT = 0;
function damageFlash() { hud.flash.style.background = '#ff1e1e'; flashT = 0.4; state.shake = 0.5; }

const toastQueue = [];
let toastTime = 0;
let activePickupHint = null;
let toastIsBotsLeft = false;
// Shared read time for first power-up lessons and wave title/subtitle banners.
const NOTICE_READ_HOLD = 4.5;
// No "1 BOT LEFT" — that fires as the boss dies / wave clears and fights the picker.
const BOT_MILESTONES = [10, 5, 3];
const botMilestonesDone = new Set();

function botsLeftLabel(n) {
  return `${n} BOTS LEFT`;
}

function bannerShowing() {
  return hud.banner.style.opacity === '1';
}

function bossOnField() {
  return drones.some(z => z.userData.boss);
}

function clearBotsLeftToasts() {
  for (let i = toastQueue.length - 1; i >= 0; i--) {
    if (toastQueue[i].botsLeft) toastQueue.splice(i, 1);
  }
  if (toastIsBotsLeft) {
    hud.toast.style.opacity = 0;
    toastTime = 0.15;
    toastIsBotsLeft = false;
  }
}

function checkBotMilestones(remaining) {
  if (!state.running || state.choosing || state.intermission > 0 || state.paused) return;
  if (bossDeath.active || remaining <= 0) return;
  if (bannerShowing() || bossOnField()) return;
  // Mark every crossed threshold, but only announce the lowest new one so rapid
  // multi-kills do not stack 10 / 5 / 3 toasts back-to-back.
  let hit = null;
  for (const n of BOT_MILESTONES) {
    if (remaining <= n && !botMilestonesDone.has(n)) {
      botMilestonesDone.add(n);
      hit = n;
    }
  }
  if (hit === null) return;
  clearBotsLeftToasts();
  toastQueue.push({ text: botsLeftLabel(hit), color: '#82eaf5', botsLeft: true });
  if (!activePickupHint) toastTime = Math.min(toastTime, 0.12);
}

function updateToast(dt) {
  toastTime = Math.max(0, toastTime - dt);
  if (toastTime > 0) return;
  if (hud.toast.style.opacity === '1') {
    // Remember a lesson only after the player has had its full reading time.
    if (activePickupHint) {
      seenDrops.add(activePickupHint);
      activePickupHint = null;
    }
    hud.toast.style.opacity = 0;
    toastIsBotsLeft = false;
    toastTime = 0.25; // let the current notice fade before replacing it
    return;
  }

  // Teach new pickups before routine upgrade/repeat notices, in collection order.
  const lessonIndex = toastQueue.findIndex(notice => notice.pickup && !seenDrops.has(notice.pickup.id));
  const next = toastQueue.splice(lessonIndex < 0 ? 0 : lessonIndex, 1)[0];
  if (!next) return;
  if (next.botsLeft && (bannerShowing() || bossOnField())) {
    if (!bossOnField()) toastQueue.unshift(next);
    return;
  }
  const { text, color, pickup } = next;
  const firstPickup = pickup && !seenDrops.has(pickup.id);
  // Same glyph as the floor label so the notice matches what they just collected.
  hud.toastIcon.textContent = pickup ? pickup.icon : '';
  hud.toastTitle.textContent = text;
  hud.toastDetail.textContent = firstPickup ? pickup.detail : '';
  hud.toast.style.color = color;
  hud.toast.style.opacity = 1;
  toastTime = firstPickup ? NOTICE_READ_HOLD : 1.4;
  activePickupHint = firstPickup ? pickup.id : null;
  toastIsBotsLeft = !!next.botsLeft;
}

function showBanner(text, sub, dur = 1.6, kind = 'wave') {
  hud.banner.classList.toggle('boss', kind === 'boss');
  hud.bannerText.textContent = text;
  hud.bannerSub.textContent = sub || '';
  hud.banner.style.opacity = 1;
  if (toastIsBotsLeft) {
    hud.toast.style.opacity = 0;
    toastTime = 0.2;
    toastIsBotsLeft = false;
  }
  clearTimeout(showBanner._t);
  showBanner._t = setTimeout(() => { hud.banner.style.opacity = 0; }, dur * 1000);
}

// ===================================================================
// WEAPON
// ===================================================================
function startReload() {
  if (!state.running || state.reloading || state.pAmmo > 0 || state.mag === state.magSize) return;
  state.reloading = true;
  state.reloadT = 0;
  audio.reloadOut(state.reloadTime);
}
function finishReload() {
  state.reloading = false;
  state.mag = state.magSize;
  audio.reloadIn();
}

function shotWorld() {
  return { wallBoxes, solids: SOLIDS, openings };
}

function wallSpark(x, y, z, dir) {
  const origin = new THREE.Vector3(x, y, z);
  const sparks = Math.max(2, Math.round(7 * (1 - fxPressure() * 0.7)));
  for (let i = 0; i < sparks; i++) {
    const spark = new THREE.Mesh(BOX, sparkMat);
    spark.scale.set(0.03, 0.03, rnd(0.12, 0.3));
    spark.position.copy(origin);
    const vx = -dir.x * rnd(2.5, 6) + rnd(-2, 2);
    const vz = -dir.z * rnd(2.5, 6) + rnd(-2, 2);
    const velocity = new THREE.Vector3(vx, rnd(1.5, 5), vz);
    spark.quaternion.setFromUnitVectors(new THREE.Vector3(0, 0, 1), velocity.clone().normalize());
    spawnDebris(spark, velocity, { life: rnd(0.16, 0.34), bounce: 0.02 });
  }
  audio.bash(origin, 0.28);
}

function strikeShotBlock(hit, dir, y) {
  if (hit.kind === 'window' && hit.opening) {
    breakOpening(hit.opening);
    return false;
  }
  if (hit.kind === 'door' && hit.opening) {
    hit.opening.jolt = 0.4;
    burst(hit.opening, 1, metalChip, 0.08, 1.5);
    audio.bash(hit.opening, 0.4);
    return true;
  }
  wallSpark(hit.x, y, hit.z, dir);
  return true;
}

function spawnPulse(fromX, fromZ, muzzlePos, dir, userData, hot) {
  const start = resolveShotStart(fromX, fromZ, muzzlePos.x, muzzlePos.z, dir.x, dir.z, shotWorld());
  if (start.shatter) breakOpening(start.shatter);
  if (start.impact) {
    strikeShotBlock(start.impact, dir, muzzlePos.y);
    return;
  }
  const b = makeTracer(hot);
  b.position.set(start.x, muzzlePos.y, start.z);
  b.lookAt(b.position.clone().add(dir));
  b.userData = { dir, ...userData };
  scene.add(b);
  bullets.push(b);
}

function fire() {
  if (state.fireCd > 0 || state.reloading || state.mag <= 0 || !state.running) return;
  const aim = new THREE.Vector3(aimPoint.x - player.position.x, 0, aimPoint.z - player.position.z);
  if (aim.lengthSq() < 1e-4) return;
  aim.normalize();
  const charge = state.pAmmo > 0 ? 1 : (state.mag - 1) / Math.max(1, state.magSize - 1);
  if (state.pAmmo <= 0) state.mag--;
  state.fireCd = state.fireRate;

  // spawn at muzzle world position; SPLIT BEAM fans extra bullets around the aim line
  const mp = new THREE.Vector3();
  muzzle.getWorldPosition(mp);
  const count = 1 + state.spread;
  for (let k = 0; k < count; k++) {
    const a = (k - (count - 1) / 2) * 0.13;
    const c = Math.cos(a), s = Math.sin(a);
    const dir = new THREE.Vector3(aim.x * c - aim.z * s, 0, aim.x * s + aim.z * c);
    state.shotsFired++;
    spawnPulse(player.position.x, player.position.z, mp, dir, {
      life: 0.9, pierce: state.pierce, hits: new Set(),
    }, state.pDamage > 0);
  }

  muzzleFlash(state.pDamage > 0);
  state.shake = Math.max(state.shake, 0.12);
  audio.shot(state.pDamage > 0, state.spread, charge);
  if (state.pAmmo <= 0 && state.mag === 1) audio.lowCharge();
  if (state.mag <= 0) startReload();
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
  { plate: 0x187c92, joint: 0x16323b, trim: 0x79e8ed, optic: 0xafffff },
  { plate: 0x654080, joint: 0x242038, trim: 0xb87ee4, optic: 0xe396ff },
  { plate: 0x997124, joint: 0x342b20, trim: 0xffd177, optic: 0xffe6a0 },
  { plate: 0xa32e39, joint: 0x321c28, trim: 0xff8c75, optic: 0xffe4d1 },
  { plate: 0xf2f5f7, joint: 0x26313a, trim: 0xaab9c4, optic: 0xffc17b },
];
const BOT_TYPES = {
  patrol: { name: 'PATROL', kit: 0, health: 1, speed: 1, size: 1, style: 'melee', loco: 'walk' },
  runner: { name: 'FLANKER', kit: 1, health: 0.7, speed: 1.35, size: 0.88, style: 'flank', loco: 'roll' },
  gunner: { name: 'PULSE GUNNER', kit: 2, health: 1.25, speed: 0.8, size: 1, style: 'ranged', loco: 'walk' },
  heavy: { name: 'BULWARK', kit: 3, health: 2.5, speed: 0.62, size: 1.18, style: 'heavy', loco: 'stomp' },
  mortar: { name: 'BOMBARDIER', kit: 5, health: 0.55, speed: 1.05, size: 0.7, style: 'mortar', loco: 'tracks' },
};
function waveBotType() {
  // Guaranteed introduction, then a few replacements rather than extra enemies.
  const mortarLimit = state.wave === 10 ? 1 : 3;
  if (state.wave >= 10 && state.mortarsSpawned < mortarLimit
      && !drones.some(z => z.userData.type.style === 'mortar')
      && !equipment.zones.some(r => r.userData.mortar)
      && (state.mortarsSpawned === 0 || Math.random() < 0.08)) {
    state.mortarsSpawned++;
    return BOT_TYPES.mortar;
  }
  const r = Math.random();
  if (state.wave >= 2 && r < 0.25) return BOT_TYPES.runner;
  if (state.wave >= 3 && r >= 0.25 && r < 0.45) return BOT_TYPES.gunner;
  if (state.wave >= 4 && r >= 0.45 && r < 0.6) return BOT_TYPES.heavy;
  return BOT_TYPES.patrol;
}
function bossHealthMult() {
  // Patterns carry the challenge; avoid increasingly long health-only encounters.
  return 6 + state.wave * 1.3 + state.wave * state.wave * 0.1;
}

function spawnWaveBoss() {
  state.bossPending = false;
  clearEnemyBolts();
  for (let i = equipment.zones.length - 1; i >= 0; i--) {
    if (!equipment.zones[i].userData.mortar) continue;
    removeFieldObject(equipment.zones[i]);
    equipment.zones.splice(i, 1);
  }
  const hp = bossHealthMult();
  const volley = state.wave >= 6 ? 5 : 3;
  // Names mirror the trick: Slammer, Charger, Cannon/Skirmisher, Spawner.
  const kind = (state.wave - 1) % 4;
  let type;
  if (kind === 0) {
    type = {
      name: 'SLAMMER', kit: 4, health: hp, speed: 0.88, size: 1.42,
      style: 'heavy', boss: true, volley: 0, slam: true, loco: 'stomp',
    };
  } else if (kind === 1) {
    type = {
      name: 'CHARGER', kit: 4, health: hp * 0.92, speed: 1.4, size: 1.28,
      style: 'rusher', boss: true, volley: 0, loco: 'charge',
    };
  } else if (kind === 2) {
    const armed = state.wave >= 3;
    type = {
      name: armed ? 'CANNON' : 'SKIRMISHER',
      kit: 4, health: hp, speed: armed ? 0.78 : 1.1, size: 1.35,
      style: armed ? 'ranged' : 'flank', boss: true, volley: armed ? volley : 0,
      loco: armed ? 'stomp' : 'roll',
    };
  } else {
    type = {
      name: 'SPAWNER', kit: 4, health: hp * 1.08, speed: 0.85, size: 1.45,
      style: 'heavy', boss: true, volley: 0, split: true, loco: 'stomp',
    };
  }
  if (state.wave % 5 === 0) {
    type = { name: Math.floor(state.wave / 5) % 2 ? 'REACTOR WARDEN' : 'NULL OVERSEER', kit: 4, health: hp * 1.2, speed: 0.72, size: 1.55, style: 'heavy', boss: true, milestone: true, loco: 'stomp' };
  }
  spawnDrone(undefined, type);
  clearBotsLeftToasts();
  showBanner(type.name, '', 2.5, 'boss');
}

function maybeSplitBoss(z) {
  const ud = z.userData;
  if (ud.dying || !ud.type.split || !ud.boss || ud.splitsDone >= 2) return;
  const thresholds = [0.55, 0.28];
  const next = thresholds[ud.splitsDone];
  if (ud.hp / ud.maxHp > next) return;
  ud.splitsDone++;
  const count = 3 + ud.splitsDone;
  const fragment = {
    name: 'SPAWN', kit: 4, health: 0.85, speed: 1.45, size: 0.72,
    style: 'flank', fragment: true, loco: 'roll',
  };
  for (let i = 0; i < count; i++) {
    const ang = (i / count) * Math.PI * 2 + ud.seed;
    const pos = new THREE.Vector3(
      z.position.x + Math.cos(ang) * 1.35,
      0,
      z.position.z + Math.sin(ang) * 1.35,
    );
    pushOutOfSolids(pos, 0.35);
    spawnDrone(pos, fragment);
  }
  showBanner('SPAWNER', '', 1.6, 'boss');
  audio.explode(z.position);
}
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
// Low white hull, dark continuous tracks and a separate armoured turret.
const tankHullGeo = bakeBlocks([
  [0.9, 0.3, 1.05, 0, 0.38, 0, 0xf2f5f7],
  [0.3, 0.38, 1.2, -0.52, 0.24, 0, 0x26313a],
  [0.3, 0.38, 1.2, 0.52, 0.24, 0, 0x26313a],
  [0.32, 0.09, 1.18, -0.52, 0.46, 0, 0xf2f5f7],
  [0.32, 0.09, 1.18, 0.52, 0.46, 0, 0xf2f5f7],
  ...[-1, 1].flatMap(side => [-0.4, -0.2, 0, 0.2, 0.4].map(z =>
    [0.035, 0.22, 0.08, side * 0.68, 0.24, z, 0xaab9c4])),
], seeded(208));
const tankTurretGeo = bakeBlocks([
  [0.62, 0.28, 0.65, 0, 0.08, 0, 0xf2f5f7],
  [0.36, 0.1, 0.38, 0, 0.27, -0.08, 0xaab9c4],
], seeded(209));
const droneShell = new THREE.MeshStandardMaterial({ vertexColors: true, roughness: 0.48, metalness: 0.32 });
const droneHurt = new THREE.MeshStandardMaterial({ vertexColors: true, roughness: 0.48, metalness: 0.32, emissive: 0xffb64b, emissiveIntensity: 0.85 });
const enemyCannonGeo = new THREE.BoxGeometry(0.25, 0.25, 0.95);
const enemyCannonMat = new THREE.MeshStandardMaterial({ color: 0x252c42, metalness: 0.7, roughness: 0.3 });
const enemyMuzzleGeo = new THREE.BoxGeometry(0.18, 0.18, 0.06);
const enemyChargeGeo = new THREE.RingGeometry(0.7, 0.8, 32);
const enemyChargeMat = new THREE.MeshBasicMaterial({ color: 0xff708c, side: THREE.DoubleSide });
const enemyBoltGeo = new THREE.SphereGeometry(0.16, 8, 6);
const enemyBoltMat = new THREE.MeshBasicMaterial({ color: 0xff708c });
const enemyBolts = [];
function clearEnemyBolts() {
  for (const bolt of enemyBolts) scene.remove(bolt);
  enemyBolts.length = 0;
}
const ENEMY_BOLT_CAP = 36;
function fireEnemyVolley(z, target = null, countOverride = null) {
  const u = z.userData;
  const aim = target || u.shotTarget;
  const angle = Math.atan2(aim.x - z.position.x, aim.z - z.position.z);
  let count = countOverride ?? (u.type.volley || 1);
  // Trim volleys when the field is already packed with bolts.
  if (enemyBolts.length > ENEMY_BOLT_CAP * 0.7) count = Math.min(count, 2);
  for (let i = 0; i < count; i++) {
    if (enemyBolts.length >= ENEMY_BOLT_CAP) {
      const old = enemyBolts.shift();
      scene.remove(old);
    }
    const a = angle + (i - (count - 1) / 2) * 0.22;
    const bolt = new THREE.Mesh(enemyBoltGeo, enemyBoltMat);
    bolt.position.copy(z.position); bolt.position.y = 1.1;
    bolt.userData = { dir: new THREE.Vector3(Math.sin(a), 0, Math.cos(a)), life: 3 };
    scene.add(bolt); enemyBolts.push(bolt);
  }
  audio.enemyShot(z.position);
}

// Outside ranged bosses keep sprinting in — just spray warning bolts through their entry.
function fireEntryWarning(z, opening) {
  const jitter = (Math.random() - 0.5) * Math.min(1.1, opening.w * 0.45);
  const tx = opening.ix + (opening.axis === 'x' ? jitter : 0);
  const tz = opening.iz + (opening.axis === 'z' ? jitter : 0);
  fireEnemyVolley(z, new THREE.Vector3(tx, 0, tz), Math.min(2, z.userData.type.volley || 1));
}
const _boltFrom = new THREE.Vector3();
const _boltDelta = new THREE.Vector3();
const _boltClosest = new THREE.Vector3();
function updateEnemyBolts(dt) {
  for (let i = enemyBolts.length - 1; i >= 0; i--) {
    const b = enemyBolts[i];
    _boltFrom.copy(b.position);
    b.position.addScaledVector(b.userData.dir, 8 * dt);
    b.userData.life -= dt;
    const blocked = wallBetween(_boltFrom, b.position) || !clearPath(_boltFrom.x, _boltFrom.z, b.position.x, b.position.z);
    _boltDelta.subVectors(b.position, _boltFrom);
    const lenSq = _boltDelta.lengthSq() || 1;
    const t = THREE.MathUtils.clamp(
      ((player.position.x - _boltFrom.x) * _boltDelta.x + (player.position.z - _boltFrom.z) * _boltDelta.z) / lenSq,
      0,
      1,
    );
    _boltClosest.copy(_boltFrom).addScaledVector(_boltDelta, t);
    const hit = Math.hypot(_boltClosest.x - player.position.x, _boltClosest.z - player.position.z) < 0.55;
    if (hit && !blocked) hurtPlayer();
    if (blocked || hit || b.userData.life <= 0 || !state.running) {
      scene.remove(b); enemyBolts.splice(i, 1);
    }
  }
}

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
  spawnCam.aspect = layoutSize().w / layoutSize().h;
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

function spawnDrone(pos = spawnPoint(new THREE.Vector3()), type = BOT_TYPES.patrol) {
  const kit = DRONE_KITS[type.kit];
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
  const tank = type.style === 'mortar';
  const pelvis = mesh(tank ? tankHullGeo : kit.pelvis, z);
  const upper = new THREE.Group(); upper.rotation.order = 'YXZ'; upper.scale.setScalar(Z_UPPER); z.add(upper); // waist pivot
  mesh(tank ? tankTurretGeo : kit.torso, upper);
  if (tank) {
    const barrel = mesh(enemyCannonGeo, upper, enemyCannonMat);
    barrel.position.set(0, 0.43, 0.34);
    barrel.rotation.x = -0.85;
    const tip = mesh(enemyMuzzleGeo, upper, kit.optic);
    tip.position.set(0, 0.79, 0.66);
    tip.rotation.x = -0.85;
  }
  if (type.style === 'ranged') {
    // A visible shoulder cannon, aimed by the bot's facing direction.
    const cannon = new THREE.Mesh(enemyCannonGeo, enemyCannonMat);
    cannon.position.set(0.48, 0.48, 0.4);
    upper.add(cannon);
    const tip = new THREE.Mesh(enemyMuzzleGeo, kit.optic);
    tip.position.set(0.48, 0.48, 0.93);
    upper.add(tip);
  }
  const chargeRing = new THREE.Mesh(enemyChargeGeo, enemyChargeMat);
  chargeRing.rotation.x = -Math.PI / 2;
  chargeRing.position.y = 0.06;
  chargeRing.visible = false;
  z.add(chargeRing);
  const head = new THREE.Group(); head.position.set(0, 0.68, 0.06); head.rotation.order = 'YXZ'; upper.add(head);
  mesh(kit.head, head);
  mesh(kit.eyes, head, kit.optic);
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
  if (tank) {
    head.visible = false;
    for (const limb of limbs) {
      for (const part of ['upperArm', 'forearm', 'thigh', 'shin', 'foot']) limb[part].visible = false;
    }
  }

  z.position.set(pos.x, 0, pos.z);
  z.scale.setScalar(Z_SCALE * type.size);
  // Bosses (especially Charger) should not drag a bad leg — it reads as stupid walking.
  const limp = type.boss ? 0 : (Math.random() < 0.25 ? 0.2 + Math.random() * 0.55 : 0);
  const pace = type.speed;
  z.userData = {
    hp: Math.ceil(state.droneHp * type.health),
    maxHp: Math.ceil(state.droneHp * type.health),
    type, boss: !!type.boss, chargeRing, shotCd: 1.5, chargeT: 0, shotTarget: null,
    splitsDone: 0, mortarCd: 1.5, mortarRecoil: 0, mortarShots: 0,
    reformT: type.fragment ? 5.5 : 0,
    seekBoss: false,
    pace,                                               // its speed relative to the wave's
    speed: Math.min(5.5, state.droneSpeed * pace),
    hurt: 0, body, pelvis, upper, head, jaw, limbs,
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
  resolveBotPosition(z);
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
// pose a drone for this frame. Chase logic is shared; locomotion (walk / roll /
// skitter / stomp) changes how the rig reads while it moves.
function animateDrone(z, dt, near) {
  const u = z.userData;
  if (u.type.loco === 'tracks') {
    u.flinch *= Math.exp(-7 * dt);
    u.mortarRecoil = Math.max(0, u.mortarRecoil - dt * 3);
    u.pelvis.position.set(0, 0, 0);
    u.pelvis.rotation.set(0, 0, 0);
    u.upper.position.set(0, 0.62, -u.mortarRecoil * 0.12);
    const aim = Math.atan2(player.position.x - z.position.x, player.position.z - z.position.z);
    u.upper.rotation.set(-u.flinch * 0.12 - u.mortarRecoil * 0.16, wrapA(aim - u.heading), 0);
    return;
  }
  const loco = u.type.loco || 'walk';
  const Z_STRIKE = u.type.style === 'heavy' || u.type.slam ? 0.45 : 0.2;
  const gait = u.gait; // 0 when it's standing its ground
  const sp = u.speed * gait;
  const run = THREE.MathUtils.clamp((u.speed - 3) / 2, 0, 1);
  const freq = loco === 'skitter' ? 2.2 + sp * 0.35
    : loco === 'charge' ? 1.55 + sp * 0.28
    : loco === 'stomp' ? 0.75 + sp * 0.12
    : loco === 'roll' ? 1.6 + sp * 0.3
    : 1.1 + sp * 0.22;
  const beta = loco === 'roll' ? 0.5 : loco === 'charge' ? 0.42 : 0.6 - 0.18 * run;
  u.phase = (u.phase + freq * dt) % 1;
  const ph = u.phase * Math.PI * 2;
  const L = Math.min(loco === 'stomp' ? 0.55 : loco === 'charge' ? 0.85 : 0.7, sp * beta / Math.max(0.4, freq));
  const t = performance.now() / 1000 + u.seed;
  u.flinch *= Math.exp(-7 * dt);
  u.groan *= Math.exp(-2.5 * dt);
  u.attack = damp(u.attack, near < 2.4 && u.swing < 0 ? 1 : 0, 6, dt);
  // the swing: rear back with the arms up (-1), slam down and lunge (+1), recover
  const sw = u.swing, rec = Z_SWING - Z_STRIKE - 0.1;
  const blow = sw < 0 ? 0
    : sw < Z_STRIKE ? -ease(sw / Z_STRIKE)
    : sw < Z_STRIKE + 0.1 ? -1 + 2 * ease((sw - Z_STRIKE) / 0.1)
    : 1 - ease(Math.min(1, (sw - Z_STRIKE - 0.1) / rec));
  const rear = Math.max(0, -blow), slam = Math.max(0, blow);
  const clamber = u.climb >= 0 ? Math.sin(Math.PI * u.climb) : 0; // over a window sill

  // pelvis: dips on every step, and drops hard onto the bad leg
  const badStance = u.limp && loco === 'walk' ? Math.max(0, Math.sin(ph + (u.limpSide > 0 ? 0 : Math.PI))) : 0;
  const pelvisY = Z_HIP - 0.05
    - (loco === 'roll' ? 0.12 : loco === 'skitter' ? 0.1 : loco === 'charge' ? 0.04 : 0.06 * run)
    - (loco === 'roll' ? 0 : 0.05 * Math.abs(Math.sin(ph)) * gait)
    - 0.06 * slam - 0.08 * u.limp * badStance;
  u.pelvis.position.set(0, pelvisY, 0);
  u.pelvis.rotation.set(
    loco === 'roll' ? 0.08 * gait : loco === 'charge' ? 0.06 * gait : 0,
    loco === 'roll' ? u.phase * Math.PI * 2 * gait : 0.12 * Math.sin(ph) * (loco === 'charge' ? 0.35 : 1),
    loco === 'roll' ? 0 : 0.1 * Math.sin(ph) * (loco === 'charge' ? 0.4 : 1) + 0.12 * u.limp * badStance * u.limpSide,
  );
  u.pelvis.updateMatrix();

  // torso: hunched, lurching side to side against the hips, kicked back by hits
  u.upper.position.set(0, pelvisY + 0.08, 0);
  u.upper.rotation.set(
    u.hunch + (loco === 'charge' ? 0.22 : 0.12 * run) + 0.25 * u.attack - 0.55 * rear + 0.5 * slam - 0.6 * u.flinch,
    loco === 'roll' ? 0 : -0.15 * Math.sin(ph) * (loco === 'charge' ? 0.3 : 1),
    loco === 'skitter' ? 0.22 * Math.sin(ph * 2)
      : -0.14 * Math.sin(ph) * (loco === 'charge' ? 0.35 : 1) - 0.1 * u.limp * badStance * u.limpSide + 0.04 * Math.sin(t * 0.7));
  u.upper.updateMatrix();
  // head lolls, nods with each step, comes up to look at its meal, snaps back when shot
  u.head.rotation.set(
    -u.hunch * 0.7 + 0.12 * Math.abs(Math.sin(ph)) - 0.25 * u.attack - 0.2 * rear - 0.7 * u.flinch,
    0.25 * Math.sin(t * 0.9),
    u.tilt + 0.18 * Math.sin(t * 1.3 + 1));
  u.jaw.rotation.x = 0.12 + 0.12 * Math.abs(Math.sin(t * 2.3)) + 0.45 * u.groan + 0.35 * u.attack * Math.abs(Math.sin(t * 9)) + 0.5 * rear;

  for (const l of u.limbs) {
    // --- legs ---
    const bad = u.limp && l.side === u.limpSide && loco === 'walk';
    const p = (u.phase + (l.side > 0 ? 0 : 0.5 + 0.06 * u.limp)) % 1;
    if (loco === 'roll') {
      // Wheels: fixed stance, continuous spin on the shin axis.
      l.foot3.set(l.side * 0.18, Z_ANKLE * 0.55, 0);
      l.hipP.copy(l.hip).applyMatrix4(u.pelvis.matrix);
      ik2(l.hipP, l.foot3, Z_THIGH * 0.7, Z_SHIN * 0.7, Z_POLE_KNEE, l.knee);
      l.ankle.subVectors(l.foot3, l.knee).normalize().multiplyScalar(Z_SHIN * 0.7).add(l.knee);
      bone(l.thigh, l.hipP, l.knee, Z_POLE_KNEE);
      bone(l.shin, l.knee, l.ankle, Z_POLE_KNEE);
      l.foot.position.copy(l.ankle);
      l.foot.rotation.set(u.phase * Math.PI * 2 * gait, l.side * 0.2, Math.PI / 2);
      l.shin.rotation.x += u.phase * Math.PI * 2 * gait;
    } else {
      const { s, lift, pitch } = footCycle(p, beta);
      const liftMul = loco === 'stomp' ? 0.2
        : loco === 'skitter' ? 0.08
        : loco === 'charge' ? 0.16 + 0.08 * run
        : (bad ? 0.03 : 0.12 + 0.1 * run);
      const stride = loco === 'skitter' ? L * 0.65 : loco === 'charge' ? L : L;
      l.foot3.set(l.side * (loco === 'skitter' ? 0.2 : 0.15), Z_ANKLE + lift * liftMul * gait + 0.3 * clamber, s * stride - 0.2 * clamber);
      l.hipP.copy(l.hip).applyMatrix4(u.pelvis.matrix);
      ik2(l.hipP, l.foot3, Z_THIGH, Z_SHIN, Z_POLE_KNEE, l.knee);
      l.ankle.subVectors(l.foot3, l.knee).normalize().multiplyScalar(Z_SHIN).add(l.knee);
      bone(l.thigh, l.hipP, l.knee, Z_POLE_KNEE);
      bone(l.shin, l.knee, l.ankle, Z_POLE_KNEE);
      l.foot.position.copy(l.ankle);
      l.foot.rotation.set(bad ? 0.35 : pitch * (loco === 'stomp' ? 1.4 : 1), l.side * (bad ? 0.35 : 0.12), 0);
    }

    // --- arms: reaching ones grope ahead (and claw when close); the rest hang and swing ---
    l.sh.copy(l.shoulder).applyMatrix4(u.upper.matrix);
    const reaches = l.side > 0 ? u.arms >= 1 : u.arms >= 2;
    const k = l.side * 1.7;
    if (reaches) {
      const claw = u.attack * Math.sin(t * 9 + k);
      l.reach.set(-l.side * 0.08, -0.08 + 0.06 * Math.sin(ph + k) + 0.18 * u.attack + 0.12 * claw - 0.3 * u.flinch,
        0.72 + 0.07 * Math.sin(ph * 2 + k) + 0.2 * claw - 0.35 * u.flinch);
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

function nearestOpening(pos, skip, z = null) {
  // Large / boss bots jam in window frames — prefer doors when available.
  const preferDoor = z && (z.userData.boss || z.userData.type.size >= 1.25);
  let best = null, bd = Infinity;
  for (const o of openings) {
    if (o === skip) continue;
    if ((preferDoor || z?.userData.type.style === 'mortar') && o.kind !== 'door') continue;
    let d = (o.x - pos.x) ** 2 + (o.z - pos.z) ** 2;
    if (preferDoor && o.kind === 'window') d *= 3.5;
    if (preferDoor && o.kind === 'door') d *= 0.55;
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
  // Big bots get stuck in window frames — send them to a door instead.
  if ((ud.boss || ud.type.size >= 1.25) && o.kind === 'window') {
    const door = nearestOpening(z.position, o, z);
    if (door && door.kind === 'door') {
      ud.opening = door; ud.stage = 0; ud.via = -1;
      return;
    }
  }
  o.climber = z;
  ud.climb = 0; ud.climbO = o;
  ud.climbFrom = z.position.clone();
  ud.heading = Math.atan2(o.lx - z.position.x, o.lz - z.position.z);
  z.rotation.y = ud.heading;
}
function climbStep(z, dt) {
  const ud = z.userData, o = ud.climbO;
  // Bosses climb a touch faster so they spend less time wedged in the frame.
  const climbDur = ud.boss ? CLIMB_TIME * 0.75 : CLIMB_TIME;
  ud.climb = Math.min(1, ud.climb + dt / climbDur);
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
  // Bosses and heavies often finish inside the frame — shove them clear of the sill.
  if (!died) pushOutOfSolids(z.position, botRadius(z) + 0.08);
  ud.climb = -1; ud.climbO = null; ud.opening = null; ud.stage = 0; ud.via = -1; ud.navPlan = null;
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
function pushOutOfSolids(pos, radius = Z_RADIUS) {
  for (const b of SOLIDS) {
    const { x: lx, z: lz } = toLocal(b, pos.x, pos.z);
    const ex = b.hx + radius, ez = b.hz + radius;
    const px = ex - Math.abs(lx), pz = ez - Math.abs(lz);
    if (px <= 0 || pz <= 0) continue;
    // out through the nearest face, a hair clear of it so it doesn't read as still touching
    const nx = px < pz ? (Math.sign(lx) || 1) * (ex + 0.01) : lx, nz = px < pz ? lz : (Math.sign(lz) || 1) * (ez + 0.01);
    pos.x = b.x + nx * b.c + nz * b.s;
    pos.z = b.z - nx * b.s + nz * b.c;
  }
}
function resolveBotPosition(z) {
  const radius = botRadius(z) + 0.02, pos = z.position;
  for (let pass = 0; pass < 2; pass++) {
    pushOutOfSolids(pos, radius);
    for (const w of wallBoxes) {
      const cx = (w.minX + w.maxX) / 2, cz = (w.minZ + w.maxZ) / 2;
      const dx = pos.x - cx, dz = pos.z - cz;
      const hx = (w.maxX - w.minX) / 2 + radius, hz = (w.maxZ - w.minZ) / 2 + radius;
      if (Math.abs(dx) >= hx || Math.abs(dz) >= hz) continue;
      if (hx - Math.abs(dx) < hz - Math.abs(dz)) pos.x = cx + (Math.sign(dx) || 1) * (hx + 0.01);
      else pos.z = cz + (Math.sign(dz) || 1) * (hz + 0.01);
    }
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
// can a drone walk straight from a to b without going through a prop?
function clearPath(ax, az, bx, bz, radius = Z_RADIUS - SEE_SLOP) {
  for (const b of SOLIDS) {
    const p = toLocal(b, ax, az), px = p.x, pz = p.z, q = toLocal(b, bx, bz);
    if (segHitsBox(px, pz, q.x, q.z, b.hx + radius, b.hz + radius)) return false;
  }
  return true;
}
const navGraphs = new Map();
const navObstacles = [...SOLIDS, ...wallBoxes.map(w => ({
  x: (w.minX + w.maxX) / 2, z: (w.minZ + w.maxZ) / 2,
  hx: (w.maxX - w.minX) / 2, hz: (w.maxZ - w.minZ) / 2, c: 1, s: 0,
}))];
const botRadius = z => (z.userData.type.style === 'mortar' ? 0.74 : Z_RADIUS) * z.userData.type.size;
function navClear(ax, az, bx, bz, radius, entrances = false) {
  if (!clearPath(ax, az, bx, bz, radius)) return false;
  for (const w of wallBoxes) {
    const cx = (w.minX + w.maxX) / 2, cz = (w.minZ + w.maxZ) / 2;
    if (segHitsBox(ax - cx, az - cz, bx - cx, bz - cz,
      (w.maxX - w.minX) / 2 + radius, (w.maxZ - w.minZ) / 2 + radius)) return false;
  }
  if (entrances) for (const o of openings) {
    if (o.kind === 'door' && o.hp <= 0) continue;
    const w = o.box, cx = (w.minX + w.maxX) / 2, cz = (w.minZ + w.maxZ) / 2;
    if (segHitsBox(ax - cx, az - cz, bx - cx, bz - cz,
      (w.maxX - w.minX) / 2 + radius, (w.maxZ - w.minZ) / 2 + radius)) return false;
  }
  return true;
}
function navigationGraph(radius) {
  if (navGraphs.has(radius)) return navGraphs.get(radius);
  const nodes = navObstacles.flatMap(b => [[1, 1], [1, -1], [-1, -1], [-1, 1]].map(([sx, sz]) => {
    const x = sx * (b.hx + radius + ROUND_PAD), z = sz * (b.hz + radius + ROUND_PAD);
    return { x: b.x + x * b.c + z * b.s, z: b.z - x * b.s + z * b.c };
  })).filter(p => navClear(p.x, p.z, p.x, p.z, radius));
  const links = nodes.map(a => nodes.map(b => a !== b && navClear(a.x, a.z, b.x, b.z, radius)
    ? Math.hypot(a.x - b.x, a.z - b.z) : Infinity));
  const graph = { nodes, links };
  navGraphs.set(radius, graph);
  return graph;
}
const _goal = { x: 0, z: 0 };
// Where a drone should head to get to (tx, tz): straight there if nothing's in the way,
// otherwise the corner in sight that starts the shortest way round. It doesn't count a
// corner it's already standing at, and stays loyal to its last pick (ud.via) unless another
// way is clearly shorter, so it doesn't dither between two even routes.
function routeAround(z, tx, tz) {
  const ud = z.userData, radius = botRadius(z);
  if (inside(z.position) && !ud.opening) {
    tx = THREE.MathUtils.clamp(tx, -HALF + radius + 0.2, HALF - radius - 0.2);
    tz = THREE.MathUtils.clamp(tz, -HALF + radius + 0.2, HALF - radius - 0.2);
  }
  _goal.x = tx; _goal.z = tz;
  pushOutOfSolids(_goal, radius + 0.02); // player/flanking target may hug cover too closely
  tx = _goal.x; tz = _goal.z;
  resolveBotPosition(z);
  const { x, z: fz } = z.position;
  if (navClear(x, fz, tx, tz, radius)) { ud.via = -1; return _goal; }
  const { nodes, links } = navigationGraph(radius);
  // how far each corner is from the goal, going round (Dijkstra out from the goal)
  const n = nodes.length;
  const now = performance.now();
  let plan = ud.navPlan;
  if (!plan || now > plan.until || Math.hypot(tx - plan.x, tz - plan.z) > 0.8) {
    const dist = [], done = [];
    for (let i = 0; i < n; i++) {
      const k = nodes[i];
      dist[i] = navClear(k.x, k.z, tx, tz, radius) ? Math.hypot(tx - k.x, tz - k.z) : Infinity;
      done[i] = false;
    }
    for (let r = 0; r < n; r++) {
      let u = -1;
      for (let i = 0; i < n; i++) if (!done[i] && (u < 0 || dist[i] < dist[u])) u = i;
      if (u < 0 || dist[u] === Infinity) break;
      done[u] = true;
      for (let i = 0; i < n; i++) dist[i] = Math.min(dist[i], dist[u] + links[u][i]);
    }
    plan = ud.navPlan = { x: tx, z: tz, until: now + 300 + ud.seed, dist };
  }
  let best = -1, bestCost = Infinity;
  for (let i = 0; i < n; i++) {
    const k = nodes[i], d = Math.hypot(k.x - x, k.z - fz);
    if (d < 0.12 || !navClear(x, fz, k.x, k.z, radius)) continue;
    const cost = d + plan.dist[i] - (ud.via === i ? 0.5 : 0);
    if (cost < bestCost) { bestCost = cost; best = i; }
  }
  // Don't fall back to walking straight through the obstacle when no route exists.
  if (best < 0) { _goal.x = x; _goal.z = fz; return _goal; }
  ud.via = best;
  _goal.x = nodes[best].x; _goal.z = nodes[best].z;
  return _goal;
}

function killPoints(type) {
  if (type.boss) return 800 + 150 * state.wave;
  if (type.style === 'flank') return 125;
  if (type.style === 'ranged') return 150;
  if (type.style === 'heavy') return 200;
  return 100;
}

function finishWaveClear() {
  clearBotsLeftToasts();
  clearEnemyBolts();
  awardWaveBonuses();
  // Victory banks the reward, including gems from the final boss.
  for (const gem of emeralds) collectEmerald();
  clearEmeralds();
  clearEquipmentField();
  const healed = state.hp < state.maxHp;
  state.hp = Math.min(state.maxHp, state.hp + 1);
  audio.waveClear();
  openPicker(healed);
}

function killDrone(z, idx, allowShieldDrop = true) {
  const type = z.userData.type;
  z.userData.allowShieldDrop = allowShieldDrop;
  if (type.boss && state.running && !bossDeath.active && !z.userData.dying) {
    beginBossDeath(z);
    return;
  }
  explodeDrone(z);
  if (z.userData.climb >= 0) endClimb(z, true);
  maybeDrop(z.position, allowShieldDrop);
  scene.remove(z);
  drones.splice(idx, 1);
  state.kills++;
  if (state.running) addScore(killPoints(type));
  if (state.running && !state.choosing && state.intermission <= 0 && !state.toSpawn && !drones.length) {
    if (state.bossPending) { spawnWaveBoss(); return; }
    finishWaveClear();
  }
}

// ===================================================================
// DROPS — supplies drones sometimes leave behind
// ===================================================================
const DROP_TYPES = [
  // Name already carries the +; an icon of '+' made the toast read "++1 SHIELD".
  { id: 'med',  name: '+1 SHIELD',     detail: 'Restores one shield', icon: '', color: 0xff78b5, weight: 0 },
  { id: 'dmg',  name: 'OVERCHARGE',    detail: 'Double damage for 10 seconds', icon: '↑', color: 0xffa64c, weight: 25 },
  { id: 'ammo', name: 'INFINITE CELL', detail: 'Unlimited ammo for 8 seconds', icon: '∞', color: 0x76bcf0, weight: 25 },
];
// Teach each item once per run; saved browser history must not suppress a lesson.
const seenDrops = new Set();
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
  ctx.fillStyle = '#f3fbff';
  ctx.font = 'bold 29px sans-serif';
  if (type.icon) {
    ctx.fillStyle = type.tint;
    ctx.font = 'bold 36px sans-serif';
    ctx.fillText(type.icon, 15, 33);
    ctx.fillStyle = '#f3fbff';
    ctx.font = 'bold 29px sans-serif';
    ctx.fillText(type.name, 61, 33);
  } else {
    ctx.fillText(type.name, 24, 33);
  }
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
const SHIELD_DROP_CHANCE = 0.005; // independent roll; no scanner or pity bonus
const DROP_PITY = 30;     // guaranteed drop after this many dry kills
const DROP_LIFE = 6;      // seconds of active play before an uncollected drop vanishes
const DROP_WARNING = 2;   // final seconds blink to warn that the pickup is expiring
const drops = [];

function supplyDropScale() {
  // Keep roughly wave 5's supply budget as the regular enemy count grows.
  return Math.min(1, 20 / (5 + Math.max(1, state.wave) * 3));
}

function maybeDrop(pos, allowShieldDrop = true) {
  state.sinceDrop++;
  const scale = supplyDropScale();
  // Damage-triggered blasts cannot refund their shield cost. Limit healing even
  // when late waves contain hundreds of kills; missing HP never boosts the odds.
  if (allowShieldDrop && state.hp < state.maxHp && state.shieldDropsThisWave < 1
      && Math.random() < SHIELD_DROP_CHANCE * scale) {
    state.shieldDropsThisWave++;
    state.sinceDrop = 0;
    spawnDrop(DROP_TYPES.find(t => t.id === 'med'), pos);
    return;
  }
  const chance = (DROP_CHANCE + state.dropBonus) * scale;
  const pityKills = Math.ceil(DROP_PITY / scale);
  if (Math.random() >= chance && state.sinceDrop < pityKills) return;
  state.sinceDrop = 0;
  const pool = DROP_TYPES.filter(t => t.id !== 'med');
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
  d.userData = { type, item, ring, life: DROP_LIFE, t: Math.random() * 6 };
  scene.add(d);
  drops.push(d);
}

function collect(type) {
  audio.pickup(type.id);
  toastQueue.push({ text: type.name, color: type.tint, pickup: type });
  if (!seenDrops.has(type.id) && !activePickupHint) {
    // Let a routine notice yield promptly, but never cut another lesson short.
    toastTime = Math.min(toastTime, 0.15);
  }
  if (type.id === 'med') { state.hp = Math.min(state.maxHp, state.hp + 1); healGlow = 1; }
  else if (type.id === 'dmg') state.pDamage += 10;
  else if (type.id === 'ammo') { audio.cancelReload(); state.pAmmo += 8; state.reloading = false; state.mag = state.magSize; }
}

function updateDrops(dt) {
  const lim = HALF - 0.9;
  for (let i = drops.length - 1; i >= 0; i--) {
    const d = drops[i], ud = d.userData;
    ud.life -= dt; ud.t += dt;
    if (ud.life <= 0) { scene.remove(d); drops.splice(i, 1); continue; }
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
    const warning = ud.life <= DROP_WARNING;
    // Two blinks per second, synchronised to expiry rather than random bobbing phase.
    d.visible = !warning || reducedMotion.matches || Math.floor((DROP_WARNING - ud.life) * 4) % 2 === 0;
    // A shrinking ground ring also communicates expiry without flashing in reduced motion.
    ud.ring.scale.setScalar(warning ? Math.max(0.15, ud.life / DROP_WARNING) : 1);
  }
}

// ===================================================================
// EMERALDS — Geometry Wars–style score gems (see SCORING.md)
// ===================================================================
const EMERALD_LIFE = 2.2;
const EMERALD_WARN = 0.6;
const EMERALD_MAGNET = 5.5;
// With Magnetic Gems, pull reaches past the deck walls to off-map kills.
const EMERALD_MAGNET_ABILITY = 72;
const EMERALD_PICK = 0.75;
const EMERALD_VALUE = 40;
const EMERALD_CHAIN_MS = 750;
const emeraldGeo = new THREE.OctahedronGeometry(0.11, 0).scale(0.72, 1.2, 0.72);
const emeraldMat = new THREE.MeshBasicMaterial({ color: 0x7cff4a, toneMapped: false });
const emeraldGlowMap = glowTexture();
// Shared glow — per-gem materials used to thrash GC when dozens are alive.
const emeraldGlowMat = new THREE.SpriteMaterial({
  map: emeraldGlowMap, color: 0x6dff55, transparent: true, opacity: 0.85,
  blending: THREE.AdditiveBlending, depthWrite: false, toneMapped: false,
});
const EMERALD_SOFT_CAP = 56;
const emeralds = [];
let emeraldChain = 0;
let lastEmeraldAt = -Infinity;
let emeraldGlowPulse = 0;

function spawnEmeralds(origin, count) {
  const pressure = fxPressure();
  // Late waves spawn fewer meshes; overflow still scores so farming isn't lost.
  let n = Math.max(1, Math.round(count * (1 - pressure * 0.6)));
  const room = Math.max(0, EMERALD_SOFT_CAP - emeralds.length);
  const bank = Math.max(0, n - room);
  if (bank) addScore(EMERALD_VALUE * bank);
  n = Math.min(n, room);
  for (let i = 0; i < n; i++) {
    const gem = new THREE.Mesh(emeraldGeo, emeraldMat);
    const glow = new THREE.Sprite(emeraldGlowMat);
    glow.scale.setScalar(0.55);
    gem.add(glow);
    const ang = rnd(0, Math.PI * 2), dist = rnd(0.15, 0.7);
    gem.position.set(origin.x + Math.cos(ang) * dist, 0.35, origin.z + Math.sin(ang) * dist);
    gem.rotation.set(rnd(0, 1), rnd(0, Math.PI * 2), rnd(0, 1));
    gem.userData = { life: EMERALD_LIFE, t: rnd(0, Math.PI * 2), glow };
    scene.add(gem);
    emeralds.push(gem);
  }
}

function disposeEmerald(e) {
  scene.remove(e);
  // Shared glow material — do not dispose.
}

function clearEmeralds() {
  for (const e of emeralds) disposeEmerald(e);
  emeralds.length = 0;
  emeraldChain = 0;
}

function collectEmerald() {
  const now = performance.now();
  emeraldChain = now - lastEmeraldAt <= EMERALD_CHAIN_MS ? Math.min(emeraldChain + 1, 8) : 0;
  lastEmeraldAt = now;
  addScore(EMERALD_VALUE * (emeraldChain + 1));
  audio.emerald(emeraldChain);
}

function updateEmeralds(dt) {
  const magnetRange = state.upgrades.magnet ? EMERALD_MAGNET_ABILITY : EMERALD_MAGNET;
  const surge = !!state.upgrades.magnet;
  emeraldGlowPulse += dt;
  if (emeralds.length) emeraldGlowMat.opacity = 0.55 + 0.35 * Math.sin(emeraldGlowPulse * 8);
  for (let i = emeralds.length - 1; i >= 0; i--) {
    const e = emeralds[i], ud = e.userData;
    ud.life -= dt; ud.t += dt;
    if (ud.life <= 0) { disposeEmerald(e); emeralds.splice(i, 1); continue; }
    const dx = player.position.x - e.position.x, dz = player.position.z - e.position.z;
    const dist = Math.hypot(dx, dz);
    if (dist < EMERALD_PICK) { collectEmerald(); disposeEmerald(e); emeralds.splice(i, 1); continue; }
    if (dist < magnetRange && dist > 1e-4) {
      // Ability pull reaches through walls, but stays slow enough to watch the stream.
      const pull = surge
        ? 8 + (1 - dist / magnetRange) * 13
        : 9 + (1 - dist / magnetRange) * 10;
      e.position.x += (dx / dist) * pull * dt;
      e.position.z += (dz / dist) * pull * dt;
    }
    e.position.y = 0.32 + Math.sin(ud.t * 5) * 0.08;
    e.rotation.y += dt * 4.5;
    e.rotation.x = 0.35 + Math.sin(ud.t * 3) * 0.15;
    const warning = ud.life <= EMERALD_WARN;
    e.visible = !warning || reducedMotion.matches || Math.floor((EMERALD_WARN - ud.life) * 6) % 2 === 0;
  }
}

function accuracyBonus() {
  const rate = state.shotsHit / Math.max(1, state.shotsFired);
  return Math.round(rate * 400 * Math.max(1, state.wave));
}

function waveSpeedBonus() {
  const par = 12 + state.wave * 4;
  return Math.round(Math.max(0, par - state.waveTime) * 35);
}

function awardWaveBonuses() {
  addScore(accuracyBonus());
  addScore(waveSpeedBonus());
  state.shotsFired = 0;
  state.shotsHit = 0;
  state.waveTime = 0;
}

// ===================================================================
// AUTOMATIC EQUIPMENT — active-play timers, no additional touch buttons.
const helper = new THREE.Group();
const helperShell = new THREE.MeshStandardMaterial({ color: 0xf5f7fa, metalness: 0.12, roughness: 0.32 });
model(helper, new THREE.SphereGeometry(0.36, 24, 16), helperShell, 0, 0, 0);
// Small dark socket and centred gun keep the white spherical silhouette clear.
model(helper, new THREE.SphereGeometry(0.12, 12, 8), carbon, 0, 0, 0.33);
const helperBarrels = [0, 0.065].map(x => box(helper, alloy, x, 0, 0.45, 0.085, 0.085, 0.28));
scene.add(helper); helper.visible = false;
let helperOrbit = 0; // radians around the operator — keeps the bot off the head
const helperDesired = new THREE.Vector3();
const HELPER_ORBIT_R = 1.35;
const HELPER_ORBIT_H = 1.12; // shoulder height, not through the helmet
const HELPER_ORBIT_SPEED = 0.95;
const fieldRing = new THREE.RingGeometry(0.9, 1, 40).rotateX(-Math.PI / 2);
const mineGeo = new THREE.CylinderGeometry(0.25, 0.32, 0.12, 8);
const mineMat = new THREE.MeshBasicMaterial({ color: 0xa7a1ff });
const equipment = { shot: 0, mine: 0, safe: 0, pulse: false, mines: [], blasts: [], zones: [], effects: [] };
const helperDamage = rank => 0.8 + rank * 0.7;
// Fire speed is Twin Guns rank 2 only — Helper Bot ranks are damage, not cadence.
const helperShotInterval = upgrades => upgrades.botBomb ? 1.7 : 0.65 / (1 + (upgrades.botGun === 2 ? 0.35 : 0));

function removeFieldObject(o) {
  scene.remove(o);
  if (o.userData.shell) scene.remove(o.userData.shell);
  if (o.geometry === fieldRing) o.material.dispose();
}
function clearEquipmentField() {
  for (const list of [equipment.mines, equipment.zones, equipment.effects]) {
    list.forEach(removeFieldObject); list.length = 0;
  }
  equipment.blasts.length = 0; equipment.pulse = false;
}
function groundRing(position, radius, color, life, list) {
  const ring = new THREE.Mesh(fieldRing, new THREE.MeshBasicMaterial({ color, transparent: true, opacity: 0.9, depthWrite: false, side: THREE.DoubleSide }));
  ring.position.copy(position); ring.position.y = 0.06;
  ring.scale.setScalar(radius);
  ring.userData = { life, maxLife: life, radius };
  scene.add(ring); list.push(ring);
  return ring;
}

function fireMortar(z) {
  // An off-screen tank's opening shot needs time to announce the new threat.
  const warningTime = z.userData.mortarShots === 0 ? 3 : 1.6;
  z.userData.mortarShots++;
  const ring = groundRing(player.position.clone(), 1.8, 0xffc17b, warningTime, equipment.zones);
  const origin = z.userData.upper.getWorldPosition(new THREE.Vector3());
  origin.y += 0.6;
  const shell = new THREE.Mesh(enemyBoltGeo, DRONE_KITS[5].optic);
  shell.position.copy(origin);
  scene.add(shell);
  Object.assign(ring.userData, { mortar: true, shell, origin });
  z.userData.mortarRecoil = 1;
  // Sound the warning at the impact marker so an off-screen launch is audible.
  audio.enemyCharge(ring.position);
}

function detonateMortarZone(ring) {
  const pos = ring.position.clone();
  const origin = pos.clone(); origin.y = 0.3;
  audio.explode(origin);
  spawnBlastFlare(origin, 0.9, 0xffc17b);
  spawnBlastSparks(origin, 12);
  spawnShockwave(pos, ring.userData.radius, 0xffc17b);
  if (Math.hypot(player.position.x - pos.x, player.position.z - pos.z) < ring.userData.radius + 0.2) hurtPlayer();
}

// Milestone boss strike — warning rings must resolve into a real blast, not a silent fade.
function detonateReactorZone(ring) {
  const pos = ring.position.clone();
  const radius = ring.userData.radius;
  const origin = pos.clone(); origin.y = 1.15;
  audio.explode(origin);
  spawnBlastFlare(origin, 1.7, 0xff708c);
  spawnBlastSparks(origin, 26, 1.25, 1.35);
  spawnShockwave(pos, radius * 1.75, 0xff7098);
  if (!reducedMotion.matches) {
    const bolt = new THREE.Mesh(BOX, new THREE.MeshBasicMaterial({
      color: 0xffc0d4, transparent: true, opacity: 0.95, depthWrite: false,
      blending: THREE.AdditiveBlending, toneMapped: false,
    }));
    bolt.scale.set(0.28, 4.6, 0.28);
    bolt.position.set(pos.x, 2.3, pos.z);
    spawnDebris(bolt, new THREE.Vector3(0, 0.4, 0), { life: 0.32, bounce: 0, spin: new THREE.Vector3(0, 14, 0) });
  }
  state.shake = Math.max(state.shake, 0.5);
  if (Math.hypot(player.position.x - pos.x, player.position.z - pos.z) < radius + 0.2) hurtPlayer();
}
function equipmentBlast(position, radius, damage, slow = false, allowShieldDrop = true) {
  groundRing(position, radius, slow ? 0x7cefff : 0xffc17b, 0.35, equipment.effects);
  audio.hit(position);
  for (let i = drones.length - 1; i >= 0; i--) {
    const z = drones[i];
    if (Math.hypot(z.position.x - position.x, z.position.z - position.z) > radius || wallBetween(position, z.position) || !clearPath(position.x, position.z, z.position.x, z.position.z, 0.05)) continue;
    z.userData.hp -= damage * (z.userData.recovery > 0 ? 1.75 : 1);
    if (slow) z.userData.slow = 3;
    if (z.userData.hp <= 0) killDrone(z, i, allowShieldDrop);
    else { hitDrone(z); maybeSplitBoss(z); }
    if (state.choosing) break;
  }
}
function updateEquipment(dt) {
  helper.visible = !!state.upgrades.bot && state.running;
  if (!state.running || state.choosing || state.intermission > 0) return;
  const u = state.upgrades;
  equipment.safe += dt;
  if (u.regen && equipment.safe >= (u.regen === 2 ? 8 : 12) && state.hp < state.maxHp) {
    state.hp++; equipment.safe = 0;
    groundRing(player.position, 1.5, 0x70dfb8, 0.5, equipment.effects);
  }
  if (equipment.pulse) {
    equipment.pulse = false;
    equipmentBlast(player.position.clone(), 2.8 + u.pulse * 0.4, 2 + u.pulse * 2, true, false);
  }
  while (equipment.blasts.length && !state.choosing) {
    const blast = equipment.blasts.shift();
    equipmentBlast(blast.position, blast.radius, blast.damage);
  }
  if (state.choosing) return;
  if (u.bot) {
    // Orbit the operator at shoulder height so the sphere never sits inside the head.
    helperOrbit += dt * (reducedMotion.matches ? HELPER_ORBIT_SPEED * 0.45 : HELPER_ORBIT_SPEED);
    const bob = reducedMotion.matches ? 0 : Math.sin(helperOrbit * 2.2) * 0.08;
    helperDesired.set(
      player.position.x + Math.cos(helperOrbit) * HELPER_ORBIT_R,
      HELPER_ORBIT_H + bob,
      player.position.z + Math.sin(helperOrbit) * HELPER_ORBIT_R,
    );
    helper.position.lerp(helperDesired, Math.min(1, dt * 8));
    helperBarrels[1].visible = !!u.botGun;
    helperBarrels[0].position.x = u.botGun ? -0.065 : 0;
    equipment.shot -= dt;
    const target = drones.filter(z => inside(z.position) && !wallBetween(helper.position, z.position) && clearPath(helper.position.x, helper.position.z, z.position.x, z.position.z, 0.05)).sort((a, b) => a.position.distanceToSquared(helper.position) - b.position.distanceToSquared(helper.position))[0];
    if (target) {
      helper.lookAt(target.position.x, helper.position.y, target.position.z);
      if (equipment.shot <= 0) {
        helper.updateWorldMatrix(true, true);
        equipment.shot = helperShotInterval(u);
        for (let k = 0; k < (u.botGun ? 2 : 1); k++) {
          const muzzlePos = new THREE.Vector3();
          helperBarrels[k].getWorldPosition(muzzlePos);
          const dir = target.position.clone().sub(muzzlePos); dir.y = 0; dir.normalize();
          spawnPulse(helper.position.x, helper.position.z, muzzlePos, dir, {
            life: 0.7, pierce: 0, hits: new Set(), helper: true,
            damage: helperDamage(u.bot), blast: u.botBomb ? 2.4 + 0.5 * u.botBomb : 0,
          }, !!u.botBomb);
        }
      }
    } else {
      // Drift facing along the orbit tangent when idle so it doesn't stare through the operator.
      helper.lookAt(
        player.position.x - Math.sin(helperOrbit) * 2,
        helper.position.y,
        player.position.z + Math.cos(helperOrbit) * 2,
      );
    }
  }
  equipment.mine -= dt;
  if (u.mine && equipment.mine <= 0 && equipment.mines.length < 3) {
    equipment.mine = 8; // Ranks improve each trap, not passive deployment frequency.
    const m = new THREE.Mesh(mineGeo, mineMat);
    m.position.copy(player.position); m.position.y = 0.12;
    m.userData = { life: 18, armed: 0.6 };
    scene.add(m); equipment.mines.push(m);
  }
  for (let i = equipment.mines.length - 1; i >= 0; i--) {
    const m = equipment.mines[i]; m.userData.life -= dt; m.userData.armed -= dt;
    const triggered = m.userData.armed <= 0 && drones.some(z => Math.hypot(z.position.x - m.position.x, z.position.z - m.position.z) < 1.5 && !wallBetween(m.position, z.position));
    if (triggered || m.userData.life <= 0) {
      scene.remove(m); equipment.mines.splice(i, 1);
      if (triggered) equipmentBlast(m.position, 1.8 + u.mine * 0.2, 3 + u.mine, !!u.shock);
      if (state.choosing) return;
    }
  }
  for (let i = equipment.zones.length - 1; i >= 0; i--) {
    const ring = equipment.zones[i]; ring.userData.life -= dt;
    const warn = Math.max(0.05, ring.userData.maxLife || 1.4);
    // Pulse harder as the strike lands so the warning reads as an incoming blast.
    const u = 1 - ring.userData.life / warn;
    if (ring.userData.shell) {
      const progress = THREE.MathUtils.clamp(u, 0, 1);
      ring.userData.shell.position.lerpVectors(ring.userData.origin, ring.position, progress);
      ring.userData.shell.position.y += 4 * Math.sin(Math.PI * progress);
    }
    ring.material.opacity = ring.userData.mortar
      ? 0.7 + 0.25 * u + (reducedMotion.matches ? 0 : 0.05 * Math.sin(u * Math.PI * 8))
      : 0.35 + 0.55 * u + (reducedMotion.matches ? 0 : 0.2 * Math.sin(u * Math.PI * 8));
    if (ring.userData.life <= 0) {
      if (ring.userData.mortar) detonateMortarZone(ring);
      else detonateReactorZone(ring);
      removeFieldObject(ring); equipment.zones.splice(i, 1);
    }
  }
  for (let i = equipment.effects.length - 1; i >= 0; i--) {
    const ring = equipment.effects[i]; ring.userData.life -= dt;
    ring.material.opacity = Math.max(0, ring.userData.life * 2);
    if (ring.userData.life <= 0) { removeFieldObject(ring); equipment.effects.splice(i, 1); }
  }
}

// UPGRADES — pick one of three after every cleared wave
// ===================================================================
// Each card can be taken up to `max` times per run. `ok` (optional) hides a
// card while it would do nothing. `stat` returns [now, after] for the card.
const UPGRADES = [
  { id: 'bot', cat: 'engineer', name: 'HELPER BOT', desc: 'Deploy one automatic companion', max: 3, stat: s => [s.upgrades.bot ? helperDamage(s.upgrades.bot).toFixed(1) : 'Shot damage', `${helperDamage((s.upgrades.bot || 0) + 1).toFixed(1)} damage`], apply: () => {} },
  { id: 'botGun', cat: 'engineer', name: 'TWIN GUNS', desc: 'Double bot fire • locks out bombs', max: 2, ok: s => s.upgrades.bot && !s.upgrades.botBomb, stat: s => [s.upgrades.botGun ? 'Twin' : 'Single', s.upgrades.botGun ? 'Rapid twin' : 'Twin guns'], apply: () => {} },
  { id: 'botBomb', cat: 'engineer', name: 'BOMB LAUNCHER', desc: 'Area blasts • locks out twin guns', max: 2, ok: s => s.upgrades.bot && !s.upgrades.botGun, stat: s => ['1 shot / 1.7s', `${s.upgrades.botBomb ? 'Wider' : 'Area'} bombs`], apply: () => {} },
  { id: 'mine', cat: 'engineer', name: 'TRAIL MINES', desc: 'One trap every 8s • max 3 active', max: 3, stat: s => ['Blast damage', `${4 + (s.upgrades.mine || 0)}`], apply: () => {} },
  { id: 'shock', cat: 'engineer', name: 'SHOCK MINES', desc: 'Mine blasts slow survivors for 3s', max: 1, ok: s => s.upgrades.mine, stat: () => ['Explosive', '+60% slow'], apply: () => {} },
  { id: 'regen', cat: 'survival', name: 'SHIELD REGEN', desc: 'Recover 1 shield after avoiding hits', max: 2, stat: s => ['No damage for', s.upgrades.regen ? '8 seconds' : '12 seconds'], apply: () => {} },
  { id: 'pulse', cat: 'survival', name: 'EMERGENCY PULSE', desc: 'Shield loss blasts enemies', max: 3, stat: s => [s.upgrades.pulse || 0, `Rank ${(s.upgrades.pulse || 0) + 1}`], apply: () => {} },
  { id: 'mag',    cat: 'handling',  name: 'CELL CAPACITY',  desc: '+4 pulses per cell',     max: 5, stat: s => [s.magSize, s.magSize + 4 + ' pulses'],                            apply: s => { s.magSize += 4; s.mag = s.magSize; } },
  { id: 'reload', cat: 'handling',  name: 'HOT SWAP',   desc: 'reload 25% faster',          max: 4, stat: s => [s.reloadTime.toFixed(2), (s.reloadTime * 0.75).toFixed(2) + 's'], apply: s => { s.reloadTime *= 0.75; } },
  { id: 'damage', cat: 'firepower', name: 'PULSE AMPLIFIER', desc: '+50% pulse damage',         max: 6, stat: s => [s.damage + '×', s.damage + 0.5 + '×'],                       apply: s => { s.damage += 0.5; } },
  { id: 'rate',   cat: 'firepower', name: 'RAPID CYCLER',  desc: 'fire 20% faster',            max: 4, stat: s => [(1 / s.fireRate).toFixed(1), (1 / (s.fireRate * 0.8)).toFixed(1) + '/s'], apply: s => { s.fireRate *= 0.8; } },
  { id: 'pierce', cat: 'firepower', name: 'PIERCING',      desc: 'shots pierce +1 drone', max: 3, stat: s => [s.pierce, s.pierce + 1 + ' thru'],                     apply: s => { s.pierce++; } },
  { id: 'spread', cat: 'firepower', name: 'SPLIT BEAM',      desc: '+1 pulse per shot', max: 3, stat: s => [1 + s.spread, 2 + s.spread + ' per shot'],             apply: s => { s.spread++; } },
  { id: 'hp',     cat: 'survival',  name: 'SHIELD ARRAY',    desc: '+1 shield and recharge it', max: 3, stat: s => [s.maxHp, s.maxHp + 1 + ' max hp'],                         apply: s => { s.maxHp++; s.hp++; } },
  { id: 'speed',  cat: 'survival',  name: 'MOTION SERVO',    desc: 'move 12% faster',            max: 3, stat: s => [Math.round(s.speed / 6.2 * 100) + '%', Math.round(s.speed * 1.12 / 6.2 * 100) + '%'], apply: s => { s.speed *= 1.12; } },
  { id: 'luck',   cat: 'fortune',   name: 'SALVAGE SCANNER',     desc: 'More Overcharge / Infinite Cell drops', max: 3, stat: s => [((DROP_CHANCE + s.dropBonus) * supplyDropScale() * 100).toFixed(1) + '%', ((DROP_CHANCE + s.dropBonus + 0.03) * supplyDropScale() * 100).toFixed(1) + '% drops'], apply: s => { s.dropBonus += 0.03; } },
  { id: 'heal',   cat: 'survival',  name: 'SHIELD RESET',      desc: 'restore all shield segments',         max: Infinity, ok: s => s.hp < s.maxHp, stat: s => [s.hp, s.maxHp + ' hp'], apply: s => { s.hp = s.maxHp; } },
  // Score path: pick this instead of another gun / gear upgrade and vacuum every emerald.
  { id: 'magnet', cat: 'ability', name: 'MAGNETIC GEMS', desc: 'Gems surge toward you', max: 1, stat: () => ['Short pull', 'Through walls'], apply: () => {} },
];
const UPGRADE_CATS = {
  engineer: '#a7a1ff',
  firepower: '#ffad61',
  handling:  '#76bcf0',
  survival:  '#70dfb8',
  fortune:   '#bdadfa',
  ability:   '#7cff4a',
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
  magnet: ['...XX...', '..XXXX..', '.XX..XX.', 'XX....XX', '.XX..XX.', '..XXXX..', '...XX...', '........'],
};
function pixelIcon(rows, cls = 'cicon') {
  rows ||= ['..XXXX..', '.XXXXXX.', 'XX.XX.XX', 'XXXXXXXX', '..XXXX..', '.X.XX.X.', 'XX....XX', '........'];
  let r = '';
  rows.forEach((row, y) => [...row].forEach((c, x) => {
    if (c !== '.') r += `<rect x="${x}" y="${y}" width="1" height="1"${c === 'o' ? ' opacity=".35"' : ''}/>`;
  }));
  return `<svg class="${cls}" viewBox="0 0 8 8" shape-rendering="crispEdges" fill="currentColor">${r}</svg>`;
}
let offered = [];
const PICK_LOCKOUT_MS = 650; // ~ when the last card finishes dealing in

function upgradeWeight(u) {
  let w = 1;
  if (u.cat === 'engineer') w += 2;
  if (state.upgrades[u.id]) w += 2;
  if (u.ok && u.cat === 'engineer') w += 3;
  // Early waves lean hard into firepower so weapon progress comes online faster.
  if (u.cat === 'firepower') w += state.wave <= 3 ? 2.8 : 1.2;
  if (u.cat === 'handling') w += state.wave <= 3 ? 1.2 : 0.6;
  if (u.id === 'spread') w += (state.upgrades.spread || 0) === 0 ? (state.wave <= 3 ? 5 : 2) : 0.8;
  if (u.id === 'damage' && !(state.upgrades.damage)) w += 1.4;
  if (u.id === 'rate' && !(state.upgrades.rate)) w += 1.2;
  if (u.id === 'luck' && state.wave <= 2) w *= 0.35;
  if (u.id === 'heal') w *= state.hp < state.maxHp ? 1 : 0;
  // Ability path: a real alternative to stacking firepower once you can stay alive.
  if (u.cat === 'ability') w += state.wave >= 2 ? 2.2 : 1.1;
  return Math.max(0.05, w);
}

function pickUpgradeOffers(count = 3) {
  const pool = UPGRADES.filter(u => (state.upgrades[u.id] || 0) < u.max && (!u.ok || u.ok(state)));
  const picks = [];
  // Keep an equipment path available, including follow-up modules once owned.
  const equipment = pool.filter(u => u.cat === 'engineer');
  if (equipment.length) {
    const weighted = equipment.flatMap(u => Array(Math.ceil(upgradeWeight(u))).fill(u));
    const u = weighted[Math.floor(Math.random() * weighted.length)];
    picks.push(u); pool.splice(pool.indexOf(u), 1);
  }
  // Guarantee Split Beam on the first couple of clears if it still hasn't shown up.
  if ((state.upgrades.spread || 0) === 0 && state.wave <= 2) {
    const spread = pool.find(u => u.id === 'spread');
    if (spread) {
      picks.push(spread);
      pool.splice(pool.indexOf(spread), 1);
    }
  }
  while (picks.length < count && pool.length) {
    const total = pool.reduce((sum, u) => sum + upgradeWeight(u), 0);
    let roll = Math.random() * total;
    let idx = 0;
    for (let i = 0; i < pool.length; i++) {
      roll -= upgradeWeight(pool[i]);
      if (roll <= 0) { idx = i; break; }
    }
    picks.push(pool.splice(idx, 1)[0]);
  }
  // Shuffle display order so the guaranteed card isn't always slot 1.
  for (let i = picks.length - 1; i > 0; i--) {
    const j = (Math.random() * (i + 1)) | 0;
    [picks[i], picks[j]] = [picks[j], picks[i]];
  }
  picks.sort((a, b) => recommendationScore(b) - recommendationScore(a));
  const magnetIndex = picks.findIndex(u => u.id === 'magnet');
  if (magnetIndex >= 0) {
    const [magnet] = picks.splice(magnetIndex, 1);
    // Preserve slot 3 and its keyboard shortcut even near the end of the pool.
    while (picks.length < 2) picks.push(null);
    picks.push(magnet);
  }
  return picks;
}

function recommendationScore(u) {
  if (u.id === 'magnet') return -Infinity;
  if (state.hp <= 1 && (u.id === 'heal' || u.id === 'hp')) return 100;
  if (u.id === 'spread' && !state.spread) return 20;
  return (state.upgrades[u.id] ? 10 : 0) + upgradeWeight(u);
}

function upgradePreview(u) {
  const paths = {
    bot: '<circle cx="48" cy="29" r="19" fill="#eef3f7" stroke="#fff"/><circle cx="48" cy="29" r="6" fill="#172733" stroke="#172733"/><path d="M48 29h19" stroke="#506375" stroke-width="6"/>',
    mine: '<path d="M20 42h60M36 38l5-12h18l5 12zM50 18v-8M25 20l8 6m42-6-8 6"/>',
    shield: '<path d="M50 8l23 8v14c0 12-23 23-23 23S27 42 27 30V16zM40 30h20m-10-10v20"/>',
    rifle: '<path d="M10 28h25m-6-7 8 7-8 7"/>',
    gems: '<path d="M50 8l10 14-10 30L40 22zM28 20l8 10-6 18-10-12zM72 18l8 12-8 16-8-10z"/><path class="preview-shot" d="M20 48h60"/>',
  };
  let art = u.cat === 'engineer' ? paths[u.id === 'mine' || u.id === 'shock' ? 'mine' : 'bot']
    : u.cat === 'survival' ? paths.shield
    : u.cat === 'ability' ? paths.gems
    : paths.rifle;
  if (u.id === 'spread') art += Array.from({ length: 2 + state.spread }, (_, i) => `<path class="preview-shot" d="M45 28L90 ${10 + i * 36 / (1 + state.spread)}"/>`).join('');
  else if (u.cat === 'firepower' || u.cat === 'handling') art += '<path class="preview-shot" d="M48 28h14m9 0h14"/><path d="M92 14v28"/>';
  if (u.id === 'botBomb') art += '<circle class="preview-shot" cx="83" cy="28" r="7"/>';
  if (u.id === 'botGun') art += '<path class="preview-shot" d="M74 22h20m-20 12h20"/>';
  // Rank is already shown by the pip row under the card; NEW/UPGRADE is
  // obvious from empty vs filled pips and the card name.
  return `<svg class="upgrade-preview" viewBox="0 0 100 60" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round">${art}</svg>`;
}

function openPicker(healed) {
  offered = pickUpgradeOffers(3);
  if (!offered.length) { queueWave(3.2); return; } // everything maxed out
  state.choosing = true;
  resetGameplayInput();
  clearTimeout(choose._t);
  clearTimeout(openPicker._t);
  hud.pickerTitle.textContent = 'WAVE ' + state.wave + ' CLEARED';
  hud.pickerSub.textContent = (healed ? '+1 SHIELD  ·  ' : '') + 'CHOOSE YOUR NEXT UPGRADE';
  hud.cards.innerHTML = offered.map((u, i) => {
    if (!u) return '<div aria-hidden="true"></div>';
    const recommended = i === 0 && u.id !== 'magnet';
    const owned = state.upgrades[u.id] || 0;
    const botUpgrade = u.id === 'bot' && owned > 0;
    const name = botUpgrade ? 'UPGRADE HELPER BOT' : u.name;
    const desc = botUpgrade ? 'Stronger companion shots' : u.desc;
    const [now, after] = u.stat(state);
    // Helper Bot uses the same rank pips as every other capped upgrade
    // (max 3); only infinite cards like Shield Reset skip the row.
    const pips = u.max === Infinity ? '' :
      Array.from({ length: u.max }, (_, k) => `<i class="${k < owned ? 'own' : k === owned ? 'next' : ''}"></i>`).join('');
    return `<button type="button" class="card ${recommended ? 'recommended' : ''}" data-i="${i}" style="--accent:${UPGRADE_CATS[u.cat]};animation-delay:${i * 90}ms">` +
      `<div class="ctop"><span>${recommended ? 'RECOMMENDED' : u.cat.toUpperCase()}</span><span class="ckey">${i + 1}</span></div>` +
      upgradePreview(u) +
      `<div class="cname">${name}</div><div class="cdesc">${desc}</div>` +
      `<div class="cstat">${now} → <b>${after}</b></div>` +
      `<div class="clvl" aria-hidden="true">${pips}</div></button>`;
  }).join('');
  hud.picker.classList.remove('shown');
  hud.picker.classList.remove('hidden');
  // Double rAF so the opacity transition starts from 0 after display flips on.
  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      if (!hud.picker.classList.contains('hidden')) hud.picker.classList.add('shown');
    });
  });
  if (reducedMotion.matches) hud.picker.classList.add('shown');
  hud.cards.classList.remove('ready');
  audio.deal(offered.filter(Boolean).length);
  openPicker._t = setTimeout(() => {
    hud.cards.classList.add('ready');
    if (!state.choosing || state.paused) return;
    if (gamepadLive) setPadPickerSel(0);
    else if (finePointerUi()) hud.cards.querySelector('button')?.focus({ preventScroll: true });
  }, PICK_LOCKOUT_MS);
}

function hidePicker() {
  hud.picker.classList.remove('shown');
  hud.picker.classList.add('hidden');
  clearPadPickerSel();
  const ae = document.activeElement;
  if (ae && typeof ae.blur === 'function' && ae.closest?.('#picker')) ae.blur();
}

function choose(i) {
  const u = offered[i];
  if (!state.choosing || !u || state.paused || !hud.cards.classList.contains('ready')) return;
  state.upgrades[u.id] = (state.upgrades[u.id] || 0) + 1;
  u.apply(state);
  if (u.cat === 'firepower' || u.cat === 'handling') updateWeaponIcon();
  state.choosing = false;
  resetGameplayInput();
  focusGame();
  // brief beat so the pick registers visually before the picker closes
  [...hud.cards.children].forEach((c, k) => c.classList.add(k === i ? 'picked' : 'dropped'));
  clearTimeout(choose._t);
  choose._t = setTimeout(hidePicker, 320);
  queueWave(2.0);
  toastQueue.push({ text: u.id === 'bot' ? (state.upgrades.bot === 1 ? 'HELPER BOT DEPLOYED' : `HELPER BOT UPGRADED · RANK ${state.upgrades.bot}`) : u.name, color: UPGRADE_CATS[u.cat] });
  audio.upgrade(u.cat);
}

// ===================================================================
// DRONE EXPLOSIONS
// ===================================================================
const droneBlasts = [];
const shockwaves = [];
const blastGlow = glowTexture();
const sparkForward = new THREE.Vector3(0, 0, 1);
const BLAST_TIME = 0.22;
const shockwaveGeo = new THREE.RingGeometry(0.55, 0.72, 48).rotateX(-Math.PI / 2);

function spawnBlastFlare(origin, scale = 1, color = 0xff9b42) {
  if (reducedMotion.matches) return;
  const flare = new THREE.Sprite(new THREE.SpriteMaterial({
    map: blastGlow, color, transparent: true, opacity: 0.95, depthWrite: false,
    blending: THREE.AdditiveBlending, toneMapped: false,
  }));
  flare.position.copy(origin);
  flare.scale.setScalar(1.8 * scale);
  scene.add(flare);
  droneBlasts.push({ flare, time: 0, life: BLAST_TIME * (0.85 + scale * 0.25), base: 1.8 * scale, grow: 2.8 * scale });
}

function spawnBlastSparks(origin, count, speedMul = 1, sizeMul = 1) {
  const trimmed = Math.max(2, Math.round(count * (1 - fxPressure() * 0.7)));
  const n = reducedMotion.matches ? Math.max(2, (trimmed / 3) | 0) : trimmed;
  for (let i = 0; i < n; i++) {
    const spark = new THREE.Mesh(BOX, sparkMat);
    spark.scale.set(0.035 * sizeMul, 0.035 * sizeMul, rnd(0.2, 0.45) * sizeMul);
    spark.position.copy(origin);
    const angle = rnd(0, Math.PI * 2), speed = rnd(4, 9) * speedMul;
    const velocity = new THREE.Vector3(Math.cos(angle) * speed, rnd(1, 5) * speedMul, Math.sin(angle) * speed);
    spark.quaternion.setFromUnitVectors(sparkForward, velocity.clone().normalize());
    spawnDebris(spark, velocity, { life: rnd(0.18, 0.55) * (0.8 + sizeMul * 0.3), bounce: 0.025 });
  }
}

function spawnShockwave(origin, maxRadius = 4.5, color = 0xffc17b) {
  if (reducedMotion.matches) return;
  const ring = new THREE.Mesh(shockwaveGeo, new THREE.MeshBasicMaterial({
    color, transparent: true, opacity: 0.85, depthWrite: false, side: THREE.DoubleSide,
  }));
  ring.position.copy(origin);
  ring.position.y = 0.08;
  ring.scale.setScalar(0.35);
  scene.add(ring);
  shockwaves.push({ ring, time: 0, life: 0.55, maxRadius });
}

function explodeDrone(drone) {
  const origin = drone.userData.upper.getWorldPosition(new THREE.Vector3());
  origin.y += 0.35;
  audio.explode(origin);
  // Skip the flash when the field is already saturated with FX.
  if (fxPressure() < 0.85 || droneBlasts.length < 10) spawnBlastFlare(origin, 1);
  spawnBlastSparks(origin, 16);

  // Score gems replace lasting body-part debris (see SCORING.md).
  if (state.running) {
    const type = drone.userData.type;
    const count = type.boss ? (8 + ((Math.random() * 5) | 0)) : Math.round(3 + type.size * 2);
    spawnEmeralds(origin, count);
  }
}

function removeDroneBlast(flare) {
  scene.remove(flare);
  flare.material.dispose();
}

function updateDroneBlasts(dt) {
  for (let i = droneBlasts.length - 1; i >= 0; i--) {
    const blast = droneBlasts[i];
    blast.time += dt;
    const life = blast.life || BLAST_TIME;
    const progress = blast.time / life;
    if (progress >= 1) {
      removeDroneBlast(blast.flare);
      droneBlasts.splice(i, 1);
    } else {
      const base = blast.base ?? 1.8;
      const grow = blast.grow ?? 2.8;
      blast.flare.scale.setScalar(base + grow * progress);
      blast.flare.material.opacity = 0.95 * (1 - progress) ** 2;
    }
  }
  for (let i = shockwaves.length - 1; i >= 0; i--) {
    const wave = shockwaves[i];
    wave.time += dt;
    const progress = wave.time / wave.life;
    if (progress >= 1) {
      scene.remove(wave.ring);
      wave.ring.material.dispose();
      shockwaves.splice(i, 1);
    } else {
      wave.ring.scale.setScalar(0.35 + wave.maxRadius * progress);
      wave.ring.material.opacity = 0.85 * (1 - progress) ** 1.4;
    }
  }
}

// ===================================================================
// BOSS DEATH SEQUENCE
// Staggered body blasts (~1.2s) → final burst → short hold → fade to picker.
// ===================================================================
const bossDeath = {
  active: false,
  t: 0,
  boss: null,
  nextBlastAt: 0,
  blasts: 0,
  phase: 'stagger', // stagger | final | hold
  hold: 0,
};

function bossOrigin(z) {
  const origin = z.userData.upper?.getWorldPosition(new THREE.Vector3()) || z.position.clone();
  origin.y += 0.35;
  return origin;
}

function bumpShake(amount) {
  if (!settings.shake || reducedMotion.matches) return;
  state.shake = Math.max(state.shake, amount);
}

function beginBossDeath(z) {
  const ud = z.userData;
  ud.dying = true;
  ud.hp = 0;
  if (ud.chargeRing) ud.chargeRing.visible = false;
  if (ud.climb >= 0) endClimb(z, true);
  clearEnemyBolts();
  clearBotsLeftToasts();
  bossDeath.active = true;
  bossDeath.t = 0;
  bossDeath.boss = z;
  bossDeath.nextBlastAt = 0.05;
  bossDeath.blasts = 0;
  bossDeath.phase = 'stagger';
  bossDeath.hold = 0;
  bumpShake(0.28);
  // Freeze the body in a hurt glow so the blasts read against a lit silhouette.
  for (const m of ud.body || []) m.material = droneHurt;
}

function clearBossDeath() {
  bossDeath.active = false;
  bossDeath.boss = null;
  bossDeath.phase = 'stagger';
  bossDeath.t = 0;
  bossDeath.hold = 0;
}

function spawnBossBodyBlast(z, scale = 1) {
  const origin = bossOrigin(z);
  const size = z.userData.type?.size || 1.4;
  origin.x += (Math.random() - 0.5) * 1.5 * size;
  origin.y += rnd(-0.15, 0.9) * size;
  origin.z += (Math.random() - 0.5) * 1.5 * size;
  spawnBlastFlare(origin, scale, Math.random() < 0.35 ? 0xffe0a0 : 0xff9b42);
  spawnBlastSparks(origin, Math.round(10 * scale), 0.85 + scale * 0.2, 0.85 + scale * 0.15);
  audio.explode(origin);
  bumpShake(0.16 + scale * 0.08);
}

function finalizeBossDeath(z) {
  const origin = bossOrigin(z);
  const type = z.userData.type;
  audio.bossExplode(origin);
  audio.explode(origin);
  spawnBlastFlare(origin, 3.2, 0xfff0d0);
  spawnBlastFlare(origin.clone().add(new THREE.Vector3(0, 0.6, 0)), 2.2, 0xff9b42);
  spawnBlastSparks(origin, reducedMotion.matches ? 14 : 42, 1.7, 1.45);
  spawnShockwave(origin, 5.5 + type.size, 0xffe0a8);
  spawnShockwave(origin, 3.2 + type.size * 0.5, 0xff9b42);
  hud.flash.style.background = '#fff4e4';
  flashT = reducedMotion.matches ? 0.18 : 0.38;
  bumpShake(0.85);

  if (state.running) {
    const count = 8 + ((Math.random() * 5) | 0);
    spawnEmeralds(origin, count);
  }
  maybeDrop(z.position, z.userData.allowShieldDrop !== false);
  scene.remove(z);
  const idx = drones.indexOf(z);
  if (idx >= 0) drones.splice(idx, 1);
  state.kills++;
  if (state.running) addScore(killPoints(type));
  bossDeath.boss = null;
}

function updateBossDeath(dt) {
  if (!bossDeath.active) return;
  bossDeath.t += dt;

  if (bossDeath.phase === 'stagger') {
    const z = bossDeath.boss;
    if (!z) { clearBossDeath(); return; }
    // Keep remaining shots from landing during the show.
    if (enemyBolts.length) clearEnemyBolts();
    const reduced = reducedMotion.matches;
    const maxBlasts = reduced ? 3 : 6;
    const staggerEnd = reduced ? 0.55 : 1.15;
    if (bossDeath.t >= bossDeath.nextBlastAt && bossDeath.blasts < maxBlasts) {
      spawnBossBodyBlast(z, 0.85 + bossDeath.blasts * 0.12);
      bossDeath.blasts++;
      bossDeath.nextBlastAt = bossDeath.t + (reduced ? 0.14 : 0.17);
    }
    if (bossDeath.blasts >= maxBlasts || bossDeath.t >= staggerEnd) {
      bossDeath.phase = 'final';
    }
    return;
  }

  if (bossDeath.phase === 'final') {
    if (bossDeath.boss) finalizeBossDeath(bossDeath.boss);
    bossDeath.phase = 'hold';
    bossDeath.hold = reducedMotion.matches ? 0.35 : 0.7;
    return;
  }

  if (bossDeath.phase === 'hold') {
    bossDeath.hold -= dt;
    if (bossDeath.hold > 0) return;
    clearBossDeath();
    if (state.running && !state.choosing && state.intermission <= 0 && !state.toSpawn && !drones.length) {
      if (state.bossPending) spawnWaveBoss();
      else finishWaveClear();
    }
  }
}

// ===================================================================
// WAVES
// ===================================================================
let waveAt = null;

function queueWave(delay) {
  state.intermission = delay;
  waveAt = audio.queueWave(state.wave + 1, delay);
}

function startWave(n) {
  state.wave = n;
  state.shieldDropsThisWave = 0;
  state.mortarsSpawned = 0;
  state.bossPending = true;
  state.waveTime = 0;
  state.shotsFired = 0;
  state.shotsHit = 0;
  botMilestonesDone.clear();
  // Drones toughen steadily but slower than upgrades let the player scale, so
  // runs can go long; speed caps below the player's so kiting always works.
  state.droneSpeed = Math.min(5.2, 2.3 + n * 0.18);
  state.droneHp = 2 + (n - 1) * 0.4;
  // anything already up counts toward the wave (the yard's shamblers when you leave the title)
  state.toSpawn = Math.max(0, 5 + n * 3 - drones.length);
  for (const z of drones) {
    const u = z.userData;
    u.speed = Math.min(5.5, state.droneSpeed * u.pace);
    u.hp = u.maxHp = Math.ceil(state.droneHp * u.type.health);
  }
  state.spawnTimer = 0;
  state.intermission = 0;
  pressure.target = Math.min(1, Math.max(0, (n - 2) / 10));
  const omens = { 1: 'Grey patrols · Defeat the red boss last', 2: 'Cyan flankers · Fast, lightly armoured', 3: 'Purple gunners · Dodge charged shots', 4: 'Gold bulwarks · Slow, armoured, heavy strikes', 7: 'Containment warning', 12: 'Reactor at critical load' };
  showBanner(
    'WAVE ' + n,
    n === 10 ? 'Mortar tanks incoming · Dodge the orange blast zones' : omens[n] || 'Hostile signatures detected',
    NOTICE_READ_HOLD,
  );
}

// ===================================================================
// GAME FLOW
// ===================================================================
// clear everything a run leaves lying around
function clearRun() {
  clearEquipmentField();
  equipment.shot = equipment.mine = equipment.safe = 0;
  helper.visible = false;
  helperOrbit = Math.PI * 0.75;
  helper.position.set(
    player.position.x + Math.cos(helperOrbit) * HELPER_ORBIT_R,
    HELPER_ORBIT_H,
    player.position.z + Math.sin(helperOrbit) * HELPER_ORBIT_R,
  );
  audio.cancelReload();
  clearEnemyBolts();
  state.bossPending = false;
  for (const b of bullets) scene.remove(b);
  for (const z of drones) scene.remove(z);
  for (const d of drops) scene.remove(d);
  for (const d of debris) scene.remove(d);
  for (const { flare } of droneBlasts) removeDroneBlast(flare);
  for (const wave of shockwaves) { scene.remove(wave.ring); wave.ring.material.dispose(); }
  clearEmeralds();
  bullets.length = 0; drones.length = 0; drops.length = 0; debris.length = 0; droneBlasts.length = 0;
  shockwaves.length = 0;
  clearBossDeath();
  toastQueue.length = 0;
  toastTime = 0;
  activePickupHint = null;
  hud.toastIcon.textContent = '';
  hud.toastTitle.textContent = '';
  hud.toastDetail.textContent = '';
  hud.toast.style.opacity = 0;
  toastIsBotsLeft = false;
  hidePicker();
}

// the operator's stats before any upgrades
const BASE_STATS = { maxHp: 3, magSize: 8, reloadTime: 1.2, fireRate: 0.13, damage: 1, pierce: 0, spread: 0, speed: 6.2, dropBonus: 0 };

// `keep` carries over what's on the field (coming from the title: the operator stays where
// they are and the yard's drones join wave 1, which starts once the camera is down)
function resetGame(keep = false) {
  resetGameplayInput();
  resetPlayInputStats();
  if (!keep) { clearRun(); resetOpenings(); }
  seenDrops.clear();
  healGlow = 0; powerGlowTime = 0;
  pressure.set(0);
  Object.assign(state, {
    ...BASE_STATS, running: true, hp: BASE_STATS.maxHp, kills: 0, score: 0, wave: 0,
    waveTime: 0, shotsFired: 0, shotsHit: 0,
    mag: BASE_STATS.magSize, reloading: false, reloadT: 0,
    fireCd: 0, dmgCd: 0, toSpawn: 0, spawnTimer: 0, bossPending: false,
    intermission: 0, choosing: false, shake: 0, upgrades: {},
    pDamage: 0, pAmmo: 0, sinceDrop: 0, shieldDropsThisWave: 0,
  });
  emeraldChain = 0;
  botMilestonesDone.clear();
  updateWeaponIcon();
  if (keep) {
    queueWave(SWOOP_TIME * 0.85);
    for (const z of drones) Object.assign(z.userData, { cross: null, idle: 0, via: -1 });
  } else {
    player.position.set(0, 0, 0);
    queueWave(WAVE_LEAD_IN);
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
  beginScoreRun();
  focusGame();
}

function setPaused(on) {
  if (on && !state.running) return; // only a live run can pause
  if (on === state.paused) return;
  state.paused = on;
  audio.setPaused(on);
  document.body.classList.toggle('paused', on);
  syncTouchControls();
  resetGameplayInput();
  document.getElementById('pauseStat').textContent =
    `WAVE ${state.wave} · ${formatScore(state.score)} PTS`;
  document.getElementById('pause').classList.toggle('hidden', !on);
  if (on) {
    if (finePointerUi() || gamepadLive) document.getElementById('resumeBtn').focus({ preventScroll: true });
  } else if (state.choosing) {
    if (gamepadLive) setPadPickerSel(padPickerSel);
    else if (finePointerUi()) hud.cards.querySelector('button')?.focus({ preventScroll: true });
  } else {
    const ae = document.activeElement;
    if (ae && typeof ae.blur === 'function' && ae.closest?.('#pause')) ae.blur();
    focusGame();
  }
}

function quitToTitle() {
  setPaused(false);
  state.running = false;
  document.getElementById('death').classList.add('hidden');
  enterTitle(false);
}

const deathPanel = document.getElementById('deathPanel');
const deathNameForm = document.getElementById('deathNameForm');
const deathNameInput = document.getElementById('deathName');
const deathSubmitBtn = document.getElementById('deathSubmit');
const deathSubmitStatus = document.getElementById('deathSubmitStatus');
const deathArcade = document.getElementById('deathArcade');
const deathArcadeSubmit = document.getElementById('deathArcadeSubmit');
const deathArcadeStatus = document.getElementById('deathArcadeStatus');
const deathReels = [...document.querySelectorAll('#deathReels .death-reel')];
const deathSubmitted = document.getElementById('deathSubmitted');
const deathScoreBox = document.getElementById('deathScoreBox');
const deathCallsignPill = document.getElementById('deathCallsignPill');
const deathMenu = document.getElementById('deathMenu');
const deathTitleWord = document.querySelector('#deathTitle .death-word');
const CALLSIGN_CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
let pendingSubmit = null;
let submittingScore = false;
let activeRunId = null;
let deathPadEntry = false;
let arcadeChars = [0, 0, 0];
let arcadeFocus = 0;

function setDeathSubmitBusy(busy) {
  submittingScore = busy;
  for (const btn of [deathSubmitBtn, deathArcadeSubmit]) {
    if (!btn) continue;
    btn.classList.toggle('busy', busy);
    btn.disabled = busy;
    btn.setAttribute('aria-busy', busy ? 'true' : 'false');
  }
}

function setDeathTitle(text) {
  if (!deathTitleWord) return;
  deathTitleWord.textContent = text;
  deathTitleWord.setAttribute('data-text', text);
}

function arcadeCallsign() {
  return arcadeChars.map((i) => CALLSIGN_CHARS[i] || 'A').join('');
}

function setArcadeFromName(name) {
  const clean = normalizeName(name);
  const padded = (clean + 'AAA').slice(0, 3);
  arcadeChars = [...padded].map((ch) => {
    const idx = CALLSIGN_CHARS.indexOf(ch);
    return idx >= 0 ? idx : 0;
  });
}

function renderArcadeReels() {
  const n = CALLSIGN_CHARS.length;
  deathReels.forEach((reel, i) => {
    const cur = arcadeChars[i] || 0;
    const prev = (cur - 1 + n) % n;
    const next = (cur + 1) % n;
    reel.querySelector('.prev').textContent = CALLSIGN_CHARS[prev];
    reel.querySelector('.cur').textContent = CALLSIGN_CHARS[cur];
    reel.querySelector('.next').textContent = CALLSIGN_CHARS[next];
    const focused = arcadeFocus === i;
    reel.classList.toggle('is-focused', focused);
    reel.classList.toggle('pad-sel', focused);
    reel.setAttribute('aria-pressed', focused ? 'true' : 'false');
  });
  deathArcadeSubmit.classList.toggle('pad-sel', arcadeFocus === 3);
}

function setArcadeFocus(i) {
  arcadeFocus = Math.max(0, Math.min(3, i));
  renderArcadeReels();
  if (arcadeFocus === 3) deathArcadeSubmit.focus({ preventScroll: true });
  else deathReels[arcadeFocus]?.focus({ preventScroll: true });
}

function nudgeArcadeChar(dir) {
  if (arcadeFocus > 2) return;
  const n = CALLSIGN_CHARS.length;
  arcadeChars[arcadeFocus] = (arcadeChars[arcadeFocus] + dir + n) % n;
  renderArcadeReels();
  audio.ui('move');
}

function handleArcadePadNav(dir) {
  if (arcadeFocus < 3) {
    if (dir === 'up') { nudgeArcadeChar(-1); return; }
    if (dir === 'down') { setArcadeFocus(3); audio.ui('move'); return; }
    if (dir === 'left') {
      if (arcadeFocus > 0) { setArcadeFocus(arcadeFocus - 1); audio.ui('move'); }
      return;
    }
    if (dir === 'right') {
      setArcadeFocus(arcadeFocus + 1);
      audio.ui('move');
    }
    return;
  }
  if (dir === 'up' || dir === 'left') {
    setArcadeFocus(2);
    audio.ui('move');
  }
}

async function submitArcadeCallsign() {
  await publishRunScore(arcadeCallsign());
}

function showDeathSubmitted({ name, score, wave, kills }) {
  deathPadEntry = false;
  deathNameForm.classList.add('hidden');
  deathArcade.classList.add('hidden');
  deathArcade.setAttribute('aria-hidden', 'true');
  deathSubmitted.classList.remove('hidden');
  deathSubmitted.setAttribute('aria-hidden', 'false');
  deathPanel.classList.add('is-submitted');
  setDeathTitle('SCORE SUBMITTED');
  document.getElementById('deathStat').textContent =
    `Wave ${wave} · ${kills} bots down`;
  document.getElementById('deathBest').textContent = '';
  document.getElementById('deathBest').classList.remove('record');
  deathScoreBox.textContent = formatScore(score);
  deathCallsignPill.textContent = `Callsign ${name}`;
  deathMenu.classList.remove('hidden');
  clearDeathPadSel();
  if (finePointerUi() || gamepadLive) setDeathPadFocus(document.getElementById('retryBtn'));
}

function resetDeathSubmit() {
  pendingSubmit = null;
  deathPadEntry = false;
  arcadeFocus = 0;
  setDeathSubmitBusy(false);
  deathSubmitStatus.textContent = '';
  deathSubmitStatus.className = '';
  deathArcadeStatus.textContent = '';
  deathArcadeStatus.className = '';
  deathNameForm.classList.add('hidden');
  deathArcade.classList.add('hidden');
  deathArcade.setAttribute('aria-hidden', 'true');
  deathSubmitted.classList.add('hidden');
  deathSubmitted.setAttribute('aria-hidden', 'true');
  deathPanel.classList.remove('is-submitted');
  deathMenu.classList.remove('hidden');
  setDeathTitle('GAME OVER');
  clearDeathPadSel();
}

function beginScoreRun() {
  activeRunId = null;
  // Fire-and-forget: never block gameplay if the board is offline.
  startRun().then((id) => { activeRunId = id; }).catch(() => { activeRunId = null; });
}

async function publishRunScore(name) {
  const clean = writePlayerName(name);
  if (!clean || !pendingSubmit || submittingScore) return null;
  setDeathSubmitBusy(true);
  deathSubmitStatus.textContent = '';
  deathSubmitStatus.className = '';
  deathArcadeStatus.textContent = '';
  deathArcadeStatus.className = '';
  const snapshot = {
    name: clean,
    score: pendingSubmit.score,
    wave: pendingSubmit.wave,
    kills: pendingSubmit.kills,
  };
  try {
    const result = await submitScore({
      runId: activeRunId || pendingSubmit.runId,
      name: clean,
      score: snapshot.score,
      wave: snapshot.wave,
      kills: snapshot.kills,
      build: BUILD_VERSION,
      input: pendingSubmit.input || dominantPlayInput(),
      device: pendingSubmit.device || runDevice,
    });
    if (result.offline || result.rejected || result.error) {
      const msg = rejectMessage(result.error || 'offline');
      deathSubmitStatus.textContent = msg;
      deathSubmitStatus.className = 'err';
      deathArcadeStatus.textContent = msg;
      deathArcadeStatus.className = 'err';
      if (deathPadEntry) {
        deathMenu.classList.remove('hidden');
        setDeathPadFocus(document.getElementById('retryBtn'));
      }
      return result;
    }
    pendingSubmit = null;
    activeRunId = null;
    showDeathSubmitted(snapshot);
    return result;
  } catch {
    const msg = rejectMessage('offline');
    deathSubmitStatus.textContent = msg;
    deathSubmitStatus.className = 'err';
    deathArcadeStatus.textContent = msg;
    deathArcadeStatus.className = 'err';
    if (deathPadEntry) {
      deathMenu.classList.remove('hidden');
      setDeathPadFocus(document.getElementById('retryBtn'));
    }
    return null;
  } finally {
    setDeathSubmitBusy(false);
  }
}

function die() {
  state.running = false;
  mouseFire = false;
  padFire = false;
  firing = false;
  setPadAiming(false);
  // Bank a partial accuracy bonus for the unfinished wave.
  addScore(accuracyBonus());
  document.getElementById('deathStat').textContent =
    `Score ${formatScore(state.score)} · Wave ${state.wave} · ${state.kills} bots down`;
  const best = readHighScore();
  const record = state.score > 0 && state.score > best.score;
  if (record) store.set('highscore', { score: state.score, wave: state.wave, kills: state.kills });
  const db = document.getElementById('deathBest');
  const shown = record ? readHighScore() : best;
  db.textContent = record
    ? 'New high score'
    : shown.score > 0 ? `High score ${formatScore(shown.score)} · Wave ${shown.wave}` : '';
  db.classList.toggle('record', record);

  resetDeathSubmit();
  // Hide callsign/submit when the server would reject as too_short (wave < 2).
  if (canSubmitScore(state.wave, state.score)) {
    pendingSubmit = {
      runId: activeRunId,
      score: state.score,
      wave: state.wave,
      kills: state.kills,
      input: dominantPlayInput(),
      device: runDevice,
    };
    const saved = readPlayerName();
    deathPadEntry = lastPlayInput === 'gamepad';
    if (deathPadEntry) {
      setArcadeFromName(saved || 'AAA');
      deathArcade.classList.remove('hidden');
      deathArcade.setAttribute('aria-hidden', 'false');
      deathMenu.classList.add('hidden');
      setArcadeFocus(0);
    } else {
      deathNameInput.value = saved;
      deathNameForm.classList.remove('hidden');
    }
  }

  document.getElementById('death').classList.remove('hidden');
  if (deathPadEntry) {
    setArcadeFocus(0);
  } else if (!deathNameForm.classList.contains('hidden')) {
    // Callsign field still needs caret focus on touch; buttons must not.
    deathNameInput.focus({ preventScroll: true });
    deathNameInput.select();
  } else if (finePointerUi() || gamepadLive) {
    setDeathPadFocus(document.getElementById('retryBtn'));
  }
  audio.death();
  updateHUD();
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
    walking = walkToward(z, g.x - z.position.x, g.z - z.position.z, ud.speed, 1.5, dt);
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
for (const area of document.querySelectorAll('#menu .mpanel, #scoresList')) enhanceScrollArea(area);
function blurMenuFocus() {
  const ae = document.activeElement;
  if (ae && typeof ae.blur === 'function' && menuEl.contains(ae)) ae.blur();
}
const menu = {
  sel: 0, panel: null, row: 0, ignoreUntil: 0, kbdHighlight: false,
  select(i, quiet) {
    i = (i + menuButtons.length) % menuButtons.length;
    if (i !== this.sel && !quiet) audio.ui('move');
    this.sel = i;
    this.paintSel();
  },
  paintSel() {
    // Touch taps still track sel for confirm/back, but only paint cyan when a
    // panel is open, a keyboard/gamepad path asked for it, or fine pointer UI.
    const show = finePointerUi() || this.kbdHighlight || !!this.panel;
    menuButtons.forEach((b, k) => b.classList.toggle('sel', show && k === this.sel));
  },
  open(panel) {
    this.panel = panel;
    document.getElementById('howPanel').classList.toggle('open', panel === 'how');
    document.getElementById('scoresPanel').classList.toggle('open', panel === 'scores');
    document.getElementById('settingsPanel').classList.toggle('open', panel === 'settings');
    if (panel === 'settings') this.selectRow(this.row, true);
    else settingRows.forEach(r => r.classList.remove('sel'));
    if (panel === 'scores') loadScoresBoard();
    if (!panel && !finePointerUi()) {
      this.kbdHighlight = false;
      blurMenuFocus();
    }
    this.paintSel();
    this.hints();
  },
  activate(i = this.sel) {
    // Start's pointerdown reveals the list; the leftover click retargets onto
    // whichever button now sits under that point (How, on landscape).
    if (performance.now() < this.ignoreUntil) return;
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
      if (up) { this.kbdHighlight = true; this.selectRow(this.row - 1); }
      else if (down) { this.kbdHighlight = true; this.selectRow(this.row + 1); }
      else if (left || right) this.adjust(key, left ? -1 : 1);
      else if (ok && key === 'shake') this.adjust(key, 0);
      else if (back) { audio.ui('back'); this.open(null); }
    } else if (this.panel) {
      if (this.panel === 'scores') {
        const list = document.getElementById('scoresList');
        const page = Math.max(42, list.clientHeight * 0.85);
        if (up || down || ['PageUp', 'PageDown', 'Home', 'End', 'Space'].includes(c)) {
          if (c === 'Home') list.scrollTop = 0;
          else if (c === 'End') list.scrollTop = list.scrollHeight;
          else list.scrollTop += up ? -49 : down ? 49 : c === 'PageUp' || (c === 'Space' && e.shiftKey) ? -page : page;
          return true;
        }
      }
      if (back || ok) { audio.ui('back'); this.open(null); }
    } else if (up) { this.kbdHighlight = true; this.select(this.sel - 1); }
    else if (down) { this.kbdHighlight = true; this.select(this.sel + 1); }
    else if (ok) this.activate();
    return true;
  },
  leaveSplash() {
    if (!menuEl.classList.contains('splash')) return;
    audio.ensure();
    audio.ui('select');
    menuEl.classList.remove('splash');
    this.kbdHighlight = finePointerUi();
    this.select(0, true);
    this.hints();
    this.ignoreUntil = performance.now() + 120;
  },
};
menu.drawSettings();
for (const button of document.querySelectorAll('.close-panel')) {
  bindTap(button, () => {
    audio.ui('back');
    menu.open(null);
    // Desktop keeps keyboard focus on the opener; touch must not leave it lit.
    if (finePointerUi()) menuButtons[menu.sel].focus({ preventScroll: true });
  });
}
const BUILD_VERSION = typeof __BUILD_VERSION__ !== 'undefined' ? __BUILD_VERSION__ : 'dev';

let scoresLoadToken = 0;

function measureScoresBody() {
  const body = document.getElementById('scoresBody');
  const prev = body.style.height;
  body.style.height = 'auto';
  const height = body.scrollHeight;
  body.style.height = prev;
  return height;
}

function lockScoresBodyHeight(px, animate) {
  const body = document.getElementById('scoresBody');
  if (!animate) {
    body.style.transition = 'none';
    body.style.height = `${Math.max(1, Math.round(px))}px`;
    void body.offsetHeight;
    body.style.transition = '';
    return;
  }
  body.style.height = `${Math.max(1, Math.round(px))}px`;
}

function setScoresStatus(text, { loading = false, hidden = false } = {}) {
  const status = document.getElementById('scoresStatus');
  const label = status.querySelector('.scores-status-text');
  status.hidden = hidden;
  status.classList.toggle('loading', loading && !hidden);
  if (label) label.textContent = text;
  else status.textContent = text;
}

async function loadScoresBoard() {
  const token = ++scoresLoadToken;
  const list = document.getElementById('scoresList');
  const head = document.querySelector('#scoresPanel .scores-head');
  const body = document.getElementById('scoresBody');

  list.innerHTML = '';
  list.scrollTop = 0;
  if (head) head.hidden = true;
  setScoresStatus('Loading board…', { loading: true });
  lockScoresBodyHeight(measureScoresBody(), false);

  const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
  let data = null;
  let failed = false;
  try {
    [data] = await Promise.all([
      fetchScores(),
      wait(2000),
    ]);
  } catch {
    failed = true;
    await wait(2000);
  }
  if (token !== scoresLoadToken) return;

  const finish = (render) => {
    render();
    const next = measureScoresBody();
    requestAnimationFrame(() => {
      if (token !== scoresLoadToken) return;
      lockScoresBodyHeight(next, true);
      const onEnd = (e) => {
        if (e.target !== body || e.propertyName !== 'height') return;
        body.removeEventListener('transitionend', onEnd);
        if (token === scoresLoadToken) body.style.height = '';
      };
      body.addEventListener('transitionend', onEnd);
    });
  };

  if (failed) {
    finish(() => setScoresStatus('Board unreachable'));
    return;
  }
  const scores = data?.scores || [];
  if (data?.offline) {
    finish(() => setScoresStatus('Board offline'));
    return;
  }
  if (!scores.length) {
    finish(() => setScoresStatus('No scores recorded yet'));
    return;
  }
  finish(() => {
    if (head) head.hidden = false;
    list.innerHTML = scores.map((row) => {
      const top = Number(row.rank) === 1;
      return `<div class="scores-row${top ? ' top' : ''}" role="listitem">
        <span class="scores-rank"><b>${row.rank}</b></span>
        <span class="scores-score">${formatScore(row.score)}</span>
        <span class="scores-wave">${row.wave}</span>
        <span class="scores-name">${row.name}</span>
      </div>`;
    }).join('');
    setScoresStatus('', { hidden: true });
  });
}

deathNameInput.addEventListener('input', () => {
  const start = deathNameInput.selectionStart;
  deathNameInput.value = normalizeName(deathNameInput.value);
  deathNameInput.setSelectionRange(start, start);
});
deathNameForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  const name = normalizeName(deathNameInput.value);
  if (name.length < 1) {
    deathSubmitStatus.textContent = 'Enter a callsign';
    deathSubmitStatus.className = 'err';
    deathNameInput.focus();
    return;
  }
  await publishRunScore(name);
});
deathReels.forEach((reel) => {
  reel.addEventListener('click', () => {
    if (deathArcade.classList.contains('hidden')) return;
    const i = +reel.dataset.reel;
    if (arcadeFocus === i) nudgeArcadeChar(1);
    else setArcadeFocus(i);
  });
});
bindTap(deathArcadeSubmit, () => { void submitArcadeCallsign(); });
menuButtons.forEach((b, i) => {
  b.addEventListener('mouseenter', () => {
    if (!finePointerUi()) return;
    if (!menu.panel || menu.panel !== b.dataset.act) menu.select(i);
  });
  // Tap :focus must not light the cyan selection; keyboard :focus-visible may.
  b.addEventListener('focus', () => {
    if (finePointerUi() || b.matches(':focus-visible')) {
      menu.kbdHighlight = true;
      menu.select(i, true);
    }
  });
  bindTap(b, () => menu.activate(i));
});
settingRows.forEach((r, i) => {
  r.addEventListener('mouseenter', () => {
    if (!finePointerUi()) return;
    menu.selectRow(i);
  });
  bindTap(r, e => {
    const v = e.target.dataset.v, key = r.dataset.key;
    if (v === undefined) { if (key === 'shake') menu.adjust(key, 0); return; }
    if (key === 'shake') menu.adjust(key, v === '1' ? 1 : -1);
    else menu.adjust(key, +v - settings[key]);
  });
});
bindTap(menuEl, e => {
  if (menuEl.classList.contains('splash')) {
    if (e.cancelable) e.preventDefault();
    e.stopPropagation();
    return menu.leaveSplash();
  }
  if (e.target.closest('#menuList button, .close-panel, .srow')) return;
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
const Z_SWING = 0.85;     // seconds from wind-up to recovered
const Z_HIT_RANGE = 1.65; // the blow connects if you're still this close
const Z_TRACK = 7;        // rad/s a drone turns to keep facing you while it stands and swings
const Z_SHOT_MAX = 11;    // gunner engagement distance
const Z_BOSS_SHOT_MAX = 18; // bosses reach across most of the deck
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
function walkToward(z, dx, dz, speed, turn, dt, precise = false) {
  if (z.userData.slow > 0) speed *= 0.4;
  const distance = Math.hypot(dx, dz);
  if (distance < 0.03) return false;
  const ud = z.userData, off = faceToward(z, dx, dz, turn, dt);
  // Turn on the spot for sharp corners instead of grinding forward into cover.
  if (off > (precise ? 0.1 : 0.9)) return false;
  const step = Math.min(distance, speed * Math.cos(off) ** 2 * dt);
  const sx = precise ? dx / distance : Math.sin(ud.heading);
  const sz = precise ? dz / distance : Math.cos(ud.heading);
  const look = Math.min(distance, Math.max(step, 0.25));
  if (!navClear(z.position.x, z.position.z, z.position.x + sx * look, z.position.z + sz * look, botRadius(z), true)) {
    ud.navPlan = null;
    ud.blockedFor = (ud.blockedFor || 0) + dt;
    if (ud.blockedFor > 1.2) {
      ud.via = -1; ud.blockedFor = 0;
      if (ud.opening && !inside(z.position) && ud.stage === 0) {
        ud.opening = nearestOpening(z.position, ud.opening, z);
      } else if (ud.boss && ud.opening?.kind === 'door') {
        // Re-align outside the frame after knockback or a blocked crossing.
        ud.stage = 0;
      }
    }
    return false;
  }
  ud.blockedFor = 0;
  z.position.x += sx * step;
  z.position.z += sz * step;
  return step > 0.001;
}

function hurtPlayer(damage = 1) {
  if (bossDeath.active || state.dmgCd > 0) return false;
  equipment.safe = 0;
  if (state.upgrades.pulse) equipment.pulse = true;
  state.hp = Math.max(0, state.hp - damage);
  state.dmgCd = HURT_IFRAMES;
  damageFlash();
  audio.hurt();
  gamepadRumble(state.hp <= 0 ? 220 : 90, state.hp <= 0 ? 0.55 : 0.3, state.hp <= 0 ? 0.95 : 0.6);
  if (state.hp <= 0) die();
  return true;
}

// Shared hunt point: same pursuit for every bot, with a soft inward pull near
// corners so packs do not freeze when the operator stands in a pocket.
function huntPoint(z, px, pz) {
  const radius = botRadius(z);
  const margin = radius + 0.55;
  let tx = THREE.MathUtils.clamp(px, -HALF + margin, HALF - margin);
  let tz = THREE.MathUtils.clamp(pz, -HALF + margin, HALF - margin);
  const corner = (HALF - margin) * 0.7;
  if (Math.abs(tx) > corner && Math.abs(tz) > corner) {
    tx *= 0.78;
    tz *= 0.78;
  }
  // Chargers commit straight in; everyone else fans slightly so packs don't stack.
  if (z.userData.type.style !== 'rusher') {
    const side = Math.sin(z.userData.seed * 7.13);
    const dx = px - z.position.x, dz = pz - z.position.z, d = Math.hypot(dx, dz) || 1;
    tx += (-dz / d) * side * 0.65;
    tz += (dx / d) * side * 0.65;
  }
  return { x: tx, z: tz };
}

function chaseDrone(z, dt) {
  const ud = z.userData, p = player.position;
  if (ud.dying || bossDeath.active && ud.boss) return;
  ud.slow = Math.max(0, (ud.slow || 0) - dt);
  const clearance = WALL_T / 2 + botRadius(z) + 0.15;
  const bossEntering = ud.boss && (!inside(z.position) || (ud.opening && (
    Math.abs(z.position.x) >= HALF - clearance || Math.abs(z.position.z) >= HALF - clearance
    || (ud.stage === 1 && Math.hypot(z.position.x - ud.opening.ix, z.position.z - ud.opening.iz) > 0.12))));
  const onDeck = inside(z.position) && !bossEntering;
  if (ud.boss && onDeck) { ud.opening = null; ud.stage = 0; }
  if (ud.type.milestone && onDeck && ud.climb < 0) {
    if (ud.recovery > 0) {
      ud.recovery -= dt;
      ud.chargeRing.visible = true;
      ud.chargeRing.material = mineMat;
      return;
    }
    ud.chargeRing.visible = false;
    ud.patternTimer = (ud.patternTimer ?? 2) - dt;
    if (ud.patternTimer <= 0) {
      const count = state.wave >= 10 ? 4 : 3;
      for (let i = 0; i < count; i++) {
        const angle = i * Math.PI * 2 / count;
        const position = p.clone();
        if (i) { position.x += Math.cos(angle) * 3.8; position.z += Math.sin(angle) * 3.8; }
        position.x = THREE.MathUtils.clamp(position.x, -HALF + 2, HALF - 2);
        position.z = THREE.MathUtils.clamp(position.z, -HALF + 2, HALF - 2);
        groundRing(position, 2.1, 0xff708c, 1.4, equipment.zones);
      }
      ud.patternTimer = 3.6;
      ud.recovery = 3.2;
      showBanner('REACTOR SURGE', '', 1.6, 'boss');
      audio.enemyCharge(z.position);
      return;
    }
  }
  const rusher = ud.type.style === 'rusher';
  const slammer = !!ud.type.slam;
  const Z_STRIKE = ud.type.style === 'heavy' || slammer ? 0.42 : rusher ? 0.28 : 0.2;
  const reach = rusher ? Z_REACH * 1.2 : slammer ? Z_REACH * 1.25 : Z_REACH;
  const letGo = rusher ? Z_LET_GO * 1.15 : slammer ? Z_LET_GO * 1.2 : Z_LET_GO;
  const hitRange = slammer ? Z_HIT_RANGE * 1.45 : Z_HIT_RANGE;
  const pdx = p.x - z.position.x, pdz = p.z - z.position.z, pd = Math.hypot(pdx, pdz);
  ud.shotCd = Math.max(0, ud.shotCd - dt);
  const shotMax = ud.boss ? Z_BOSS_SHOT_MAX : Z_SHOT_MAX;
  // Artillery fires independently of driving, door breaking and line of sight.
  // Keep the normal entry navigation running while shells travel over outer walls.
  if (ud.type.style === 'mortar') {
    ud.mortarCd = Math.max(0, ud.mortarCd - dt);
    if (ud.mortarCd <= 0 && !equipment.zones.some(r => r.userData.mortar)) {
      fireMortar(z);
      ud.mortarCd = 5;
    }
  }
  const fullyOnDeck = Math.abs(z.position.x) < HALF - botRadius(z) - 0.2
    && Math.abs(z.position.z) < HALF - botRadius(z) - 0.2;
  if (ud.type.style === 'mortar' && fullyOnDeck && ud.climb < 0 && ud.swing < 0) {
    let moving = false;
    if (pd >= 4.5 && pd <= 22) {
      faceToward(z, pdx, pdz, Z_TRACK, dt);
    } else {
      // Reposition without interrupting the independent mortar firing cycle.
      const direction = pd < 4.5 ? -1 : 1;
      const distance = pd || 1;
      const target = routeAround(z, z.position.x + pdx / distance * direction * 3,
        z.position.z + pdz / distance * direction * 3);
      moving = walkToward(z, target.x - z.position.x, target.z - z.position.z, ud.speed, ud.turn, dt);
    }
    ud.gait = damp(ud.gait, moving ? 1 : 0, 8, dt);
    animateDrone(z, dt, pd);
    return;
  }
  // Full aimed volleys only on the deck — outside Cannon uses entry warning shots instead.
  const canShoot = ud.type.style === 'ranged' && ud.climb < 0 && ud.swing < 0
    && onDeck && pd > 2.5 && pd < shotMax && !wallBetween(z.position, p)
    && clearPath(z.position.x, z.position.z, p.x, p.z);
  if (canShoot) {
    let moving = false;
    if (ud.chargeT > 0) {
      ud.chargeT -= dt;
      faceToward(z, ud.shotTarget.x - z.position.x, ud.shotTarget.z - z.position.z, Z_TRACK, dt);
      ud.chargeRing.scale.setScalar(1 + Math.max(0, ud.chargeT) * 0.5);
      if (ud.chargeT <= 0) {
        fireEnemyVolley(z); ud.shotCd = ud.boss ? 2.2 : 2.8;
        ud.chargeRing.visible = false;
      }
    } else if (ud.shotCd <= 0) {
      ud.chargeT = ud.boss ? 1 : 0.8;
      ud.shotTarget = p.clone(); // aim locks before firing, so the volley can be dodged
      ud.chargeRing.visible = true;
      audio.enemyCharge(z.position);
    } else {
      const side = Math.sin(ud.seed) > 0 ? 1 : -1;
      // Bosses hold a longer standoff so their extended range actually gets used.
      const near = ud.boss ? 7 : 5, far = ud.boss ? 14 : 8;
      const retreat = pd < near ? -0.7 : pd > far ? 0.7 : 0;
      const g = routeAround(z, z.position.x + pdx * retreat + pdz * side * 0.45, z.position.z + pdz * retreat - pdx * side * 0.45);
      moving = walkToward(z, g.x - z.position.x, g.z - z.position.z, ud.speed * 0.7, ud.turn * 2, dt);
    }
    ud.gait = damp(ud.gait, moving ? 1 : 0, 8, dt);
    animateDrone(z, dt, pd);
    return;
  }
  ud.chargeT = 0; ud.chargeRing.visible = false;
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
      else if (!(pd < hitRange && !wallBetween(z.position, p) && clearPath(z.position.x, z.position.z, p.x, p.z, 0.05) && hurtPlayer((ud.type.style === 'heavy' && !ud.boss) || slammer ? 2 : 1))) {
        audio.swipe(z.position);
      } else if (slammer) {
        state.shake = Math.max(state.shake, 0.55);
      }
    }
    if (ud.swing >= Z_SWING) { ud.swing = -1; ud.swingCd = rnd(0.25, 0.6); }
  } else if (!bossEntering && pd < (ud.standing ? letGo : reach) && !wallBetween(z.position, p) && clearPath(z.position.x, z.position.z, p.x, p.z, 0.05)) {
    // at arm's length: stand, square up, and swing as soon as it's facing you (no
    // cooldown left over from battering its way in)
    if (!ud.standing) ud.swingCd = 0;
    ud.standing = true;
    const off = faceToward(z, pdx, pdz, Z_TRACK * (rusher ? 1.35 : 1), dt);
    ud.swingCd -= dt * (rusher ? 1.45 : 1);
    if (ud.swingCd <= 0 && off < (rusher ? 0.7 : 0.5)) { ud.swing = 0; ud.struck = false; ud.swingAt = null; }
  } else {
    ud.standing = false;
    // steer toward nearest opening if outside, else toward player
    let tx = p.x, tz = p.z;
    if (ud.type.fragment) {
      ud.reformT = Math.max(0, ud.reformT - dt);
      if (ud.reformT <= 0) {
        const core = drones.find(d => d !== z && d.userData.boss && d.userData.type.split);
        if (core) {
          const bx = core.position.x - z.position.x, bz = core.position.z - z.position.z;
          const bd = Math.hypot(bx, bz);
          if (bd < 1) {
            core.userData.hp = Math.min(core.userData.maxHp, core.userData.hp + Math.max(1, Math.ceil(ud.hp * 0.5)));
            ud.mergeAway = true;
            return;
          }
          tx = core.position.x; tz = core.position.z;
        }
      }
    }
    if (onDeck) {
      ud.opening = null; ud.stage = 0; // through the wall — re-pick if knocked back out
      if (!(ud.type.fragment && ud.reformT <= 0)) {
        // Same pursuit for every role: hunt the operator (with corner-safe offset).
        const hunt = huntPoint(z, p.x, p.z);
        tx = hunt.x; tz = hunt.z;
      }
    } else {
      // Commit to one opening (no per-frame re-pick): walk up via its outer waypoint so
      // it comes at the door or window square-on, then break it and go through
      if (!ud.opening) { ud.opening = nearestOpening(z.position, null, z); ud.stage = 0; }
      const o = ud.opening;
      if (ud.stage === 0) {
        tx = o.ox; tz = o.oz;
        const alignment = ud.boss ? 0.1 ** 2 : 1.4;
        if ((o.ox - z.position.x) ** 2 + (o.oz - z.position.z) ** 2 < alignment) ud.stage = 1;
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
      // Cannon keeps moving in; warning bolts spray through the entry, not aimed at you.
      if (ud.boss && ud.type.style === 'ranged' && ud.climb < 0 && ud.swing < 0 && ud.shotCd <= 0) {
        const faceOpen = Math.abs(wrapA(Math.atan2(o.x - z.position.x, o.z - z.position.z) - ud.heading));
        if (faceOpen < 1.0) {
          fireEntryWarning(z, o);
          ud.shotCd = 1.35;
        }
      }
    }
    if (tx !== null) {
      const g = routeAround(z, tx, tz);
      // turn harder up close so the last few steps home in on you
      const rush = rusher && onDeck ? 1.2 : 1;
      // Bosses close the outside gap fast — they were lingering too long past the walls.
      const approach = ud.boss && !onDeck ? 2.8 : rush;
      walking = walkToward(z, g.x - z.position.x, g.z - z.position.z, ud.speed * approach, ud.turn * (pd < 4 ? 2.5 : 1) * (rusher ? 1.4 : 1) * (ud.boss && !onDeck ? 1.35 : 1), dt, bossEntering && ud.opening?.kind === 'door');
    }
  }
  // progress check: jammed bots (corner packs, window frames, doors) forget their plan
  if ((walking || ud.climb >= 0) && (ud.stuckT += dt) > 1.4) {
    const moved = Math.hypot(z.position.x - ud.stuckX, z.position.z - ud.stuckZ);
    if (moved < 0.55) {
      ud.via = -1;
      ud.navPlan = null;
      ud.blockedFor = 0;
      if (ud.climb >= 0 && ud.climb > 0.15) endClimb(z); // abort a wedged window climb
      else if (ud.opening && !inside(z.position)) {
        ud.opening = nearestOpening(z.position, ud.opening, z);
        ud.stage = 0;
      } else if (inside(z.position)) {
        // Sidestep out of a corner jam, then re-hunt next frame.
        const side = Math.sin(ud.seed * 3.7) >= 0 ? 1 : -1;
        z.position.x += side * 0.35;
        z.position.z += side * 0.2;
        pushOutOfSolids(z.position, botRadius(z));
      }
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
      const spacing = botRadius(drones[i]) + botRadius(drones[k]) + 0.08;
      if (d2 >= spacing * spacing || d2 < 1e-6) continue;
      const d = Math.sqrt(d2), push = Math.min(0.15, (spacing - d) / 2) / d;
      if (drones[i].userData.climb < 0 && navClear(a.x, a.z, a.x - dx * push, a.z - dz * push, botRadius(drones[i]), true)) {
        a.x -= dx * push; a.z -= dz * push;
      }
      if (drones[k].userData.climb < 0 && navClear(b.x, b.z, b.x + dx * push, b.z + dz * push, botRadius(drones[k]), true)) {
        b.x += dx * push; b.z += dz * push;
      }
    }
  }
  for (const z of drones) {
    if (z.userData.climb >= 0) continue; // on the sill: the climb places it
    if (state.running) {
      const dx = z.position.x - player.position.x, dz = z.position.z - player.position.z, d = Math.hypot(dx, dz);
      if (d < Z_CLOSE && d > 1e-6) { z.position.x += dx / d * (Z_CLOSE - d); z.position.z += dz / d * (Z_CLOSE - d); }
    }
    resolveBotPosition(z);
  }
}

function update(dt, lightFrame = false) {
  const px = player.position.x, pz = player.position.z;
  tickPlayInput(dt);
  if (state.running && !state.choosing) {
    // --- movement (always first, even on hitch frames) ---
    let mx = keyboardAxis(['KeyA', 'ArrowLeft'], ['KeyD', 'ArrowRight']);
    let mz = keyboardAxis(['KeyW', 'ArrowUp'], ['KeyS', 'ArrowDown']);
    mx += moveStick.delta.x + padMove.x;
    mz += moveStick.delta.y + padMove.y;
    const moving = !!(mx || mz);
    if (moving) {
      const l = Math.max(1, Math.hypot(mx, mz));
      // Cap the move step so a hitch can't shove the operator a huge distance.
      const stepDt = Math.min(dt, 0.04);
      player.position.x += (mx / l) * state.speed * stepDt;
      player.position.z += (mz / l) * state.speed * stepDt;
    }
    // clamp inside deck
    const lim = HALF - 0.7;
    player.position.x = Math.max(-lim, Math.min(lim, player.position.x));
    player.position.z = Math.max(-lim, Math.min(lim, player.position.z));
    // --- aim ---
    raycaster.setFromCamera(mouse, camera);
    // Right stick / pad steers aim when deflected; otherwise the gun follows the move stick
    // so walking up also points the rifle up until you override with the right thumb.
    const aimSteer = aimStick.id !== null && aimStick.delta.lengthSq() > AIM_DEAD * AIM_DEAD;
    const moveSteer = moveStick.id !== null && moveStick.delta.lengthSq() > AIM_DEAD * AIM_DEAD;
    if (aimSteer) {
      touchDirection.copy(aimStick.delta).normalize();
      touchAiming = true;
      setPadAiming(false);
    } else if (padAiming) {
      touchAiming = true;
    } else if (moveSteer) {
      touchDirection.copy(moveStick.delta).normalize();
      touchAiming = true;
    } else if (padMove.lengthSq() > PAD_DEAD * PAD_DEAD && !padAiming) {
      // Left stick alone turns the gun the way you walk until right stick aims.
      touchDirection.copy(padMove).normalize();
      touchAiming = true;
    }
    if (touchAiming) {
      const targetYaw = Math.atan2(touchDirection.x, touchDirection.y);
      touchYaw += wrapA(targetYaw - touchYaw) * (1 - Math.exp(-18 * dt));
      player.rotation.y = touchYaw;
      aimPoint.set(player.position.x + Math.sin(touchYaw) * 8, 0.9, player.position.z + Math.cos(touchYaw) * 8);
    } else if (raycaster.ray.intersectPlane(aimPlane, aimPoint)) {
      const a = Math.atan2(aimPoint.x - player.position.x, aimPoint.z - player.position.z);
      player.rotation.y = a;
      touchYaw = a;
    }
  }

  if (state.running) {
    // --- weapon ---
    state.fireCd -= dt;
    if (firing && !state.choosing) fire();
    if (state.reloading) {
      state.reloadT += dt;
      if (state.reloadT >= state.reloadTime) finishReload();
    }
    state.pDamage = Math.max(0, state.pDamage - dt);
    state.pAmmo = Math.max(0, state.pAmmo - dt);
    if (!state.choosing) {
      updateDrops(dt);
      updateEmeralds(dt);
      if (state.intermission <= 0) state.waveTime += dt;
    }

    // --- waves ---
    if (state.choosing) {
      // wave cleared — waiting on the upgrade pick
    } else if (state.intermission > 0) {
      const scoreTime = audio.scoreTime();
      state.intermission = waveAt !== null && scoreTime !== null ? waveAt - scoreTime : state.intermission - dt;
      if (state.intermission <= 0) startWave(state.wave + 1);
    } else if (!bossDeath.active) {
      if (state.toSpawn > 0) {
        state.spawnTimer -= dt;
        if (state.spawnTimer <= 0 && drones.length < MAX_ALIVE) {
          // spawn 1-2 at a time, faster on higher waves
          const burst = 1 + (Math.random() < Math.min(0.6, state.wave * 0.08) ? 1 : 0);
          for (let i = 0; i < burst && state.toSpawn > 0; i++) { spawnDrone(undefined, waveBotType()); state.toSpawn--; }
          if (state.wave === 4 && drones.length >= 8) audio.intensify();
          state.spawnTimer = Math.max(0.35, 1.4 - state.wave * 0.08);
        }
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
    const block = firstBlocker(px, pz, b.position.x, b.position.z, wallBoxes, SOLIDS, openings);
    if (block) {
      if (strikeShotBlock(block, b.userData.dir, b.position.y)) {
        b.position.x = block.x;
        b.position.z = block.z;
        hit = true;
      }
    }
    for (let j = drones.length - 1; j >= 0 && !hit; j--) {
      const z = drones[j];
      if (z.userData.dying) continue;
      if (b.userData.hits.has(z)) continue; // a piercing bullet already went through this one
      // distance from the drone to the path traveled this frame (not just the
      // end point), so bullets can't skip past drones at low frame rates
      const sx = b.position.x - px, sz = b.position.z - pz;
      const t = Math.max(0, Math.min(1, ((z.position.x - px) * sx + (z.position.z - pz) * sz) / (sx * sx + sz * sz || 1)));
      const dx = z.position.x - (px + sx * t), dz = z.position.z - (pz + sz * t);
      if (dx * dx + dz * dz < 0.55 * z.userData.type.size ** 2) {
        z.userData.hp -= (b.userData.damage ?? state.damage * (state.pDamage > 0 ? 2 : 1)) * (z.userData.recovery > 0 ? 1.75 : 1);
        if (!b.userData.helper) state.shotsHit++;
        if (b.userData.blast) equipment.blasts.push({ position: z.position.clone(), radius: b.userData.blast, damage: b.userData.damage * 2 });
        // small knockback
        z.position.addScaledVector(b.userData.dir, z.userData.boss ? 0.04 : z.userData.type.style === 'heavy' ? 0.08 : 0.25);
        if (z.userData.hp <= 0) killDrone(z, j);
        else {
          hitDrone(z);
          audio.hit(z.position);
          maybeSplitBoss(z);
        }
        b.userData.hits.add(z);
        if (b.userData.pierce > 0) b.userData.pierce--;
        else hit = true; // ends the loop; a piercing bullet keeps checking the rest
      }
    }
    if (hit || b.userData.life <= 0) { scene.remove(b); bullets.splice(i, 1); }
  }

  if (state.running && !state.choosing && !bossDeath.active) updateEnemyBolts(dt);

  // --- drones ---
  for (let j = drones.length - 1; j >= 0; j--) {
    const z = drones[j];
    const ud = z.userData;
    if (ud.mergeAway) {
      scene.remove(z);
      drones.splice(j, 1);
      continue;
    }
    // hurt flash recover
    if (ud.hurt > 0) {
      ud.hurt -= dt;
      if (ud.hurt <= 0) for (const m of ud.body) m.material = droneShell;
    }
    if (state.running) chaseDrone(z, dt);
    else if (title.active) wanderDrone(z, dt);
  }
  // Crowd separation is expensive with a full field — thin it out during hitch recovery.
  if (state.running || title.active) {
    if (!lightFrame || ((performance.now() / 90) | 0) % 2 === 0) separateDrones();
  }
  updateEquipment(dt);

  updateBossDeath(dt);
  updateDroneBlasts(dt);
  updateOpenings(dt);
  if (!lightFrame) updateWorld(dt);

  // --- operator rig, driven by how far the operator actually moved (so pushing into a
  // wall doesn't run in place). Runs on the title and death screens too, so the pose settles ---
  const inv = dt > 0 ? 1 / dt : 0;
  animatePlayer(dt, (player.position.x - px) * inv, (player.position.z - pz) * inv);
  updatePowerGlow(dt);
  updateMagnetAura();
  // flicker while the post-hit grace period lasts
  player.visible = !state.running || state.dmgCd <= 0 || Math.floor(state.dmgCd * 12) % 2 === 0;
  // Debris is pure cosmetics — drop updates briefly after a hitch so movement recovers first.
  if (!lightFrame || debris.length < 40) updateDebris(dt);

  // damage flash fade
  if (flashT > 0) { flashT -= dt; hud.flash.style.opacity = Math.max(0, flashT) * 0.6; }

  updateCamera(dt);

  if (state.running && !state.choosing && hud.picker.classList.contains('hidden')) updateToast(dt);
  updateHUD();
}

// ===================================================================
// LOOP
// ===================================================================
let last = performance.now();
let hitchCool = 0;
function loop(now) {
  const raw = (now - last) / 1000;
  last = now;
  // A long frame means the last tick blocked the main thread — don't chain more heavy work.
  if (raw > 0.085) hitchCool = 0.28;
  const lightFrame = hitchCool > 0 || fxPressure() > 0.75;
  const dt = Math.min(raw > 0.085 ? 0.033 : 0.05, raw);
  if (gamepadLive) pollGamepad(dt);
  if (!state.paused) update(dt, lightFrame);
  hitchCool = Math.max(0, hitchCool - dt);
  if (title.active) {
    titleScene.render(renderer, title.t, dt, menuEl.classList.contains('splash'), camera.aspect, reducedMotion.matches);
  } else {
    renderer.render(scene, camera);
  }
  requestAnimationFrame(loop);
}

enterTitle(true);
updateCamera(0);
requestAnimationFrame(loop);

function whenViewportSettled(done) {
  const started = performance.now();
  let prev = '';
  let same = 0;
  const tick = () => {
    pinViewport();
    onResize();
    const { w, h } = layoutSize();
    const key = w + 'x' + h;
    if (key === prev) same += 1;
    else { prev = key; same = 0; }
    const elapsed = performance.now() - started;
    // Two matching frames after a short wait, or give up around 1s so a
    // late iOS safe-area/visualViewport jump is included when it happens.
    if ((same >= 2 && elapsed >= 240) || elapsed > 900) {
      onResize();
      done();
      return;
    }
    requestAnimationFrame(tick);
  };
  requestAnimationFrame(tick);
}
whenViewportSettled(() => {
  document.body.classList.remove('viewport-pending');
  onResize();
  // ?demo=boss-death — auto-plays the finale for capture / QA.
  if (new URLSearchParams(location.search).get('demo') === 'boss-death') {
    setTimeout(() => {
      startGame(true);
      state.intermission = 0;
      waveAt = null;
      state.toSpawn = 0;
      state.bossPending = false;
      state.wave = 1;
      for (let i = drones.length - 1; i >= 0; i--) {
        scene.remove(drones[i]);
        drones.splice(i, 1);
      }
      const type = {
        name: 'SLAMMER', kit: 4, health: 1, speed: 0.88, size: 1.5,
        style: 'heavy', boss: true, volley: 0, slam: true, loco: 'stomp',
      };
      const z = spawnDrone(new THREE.Vector3(0, 0, 5.2), type);
      player.position.set(0, 0, 0);
      player.rotation.y = 0;
      beginBossDeath(z);
    }, 350);
  }
});
