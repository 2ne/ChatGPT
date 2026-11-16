import * as THREE from 'three';

const UV_UNIT = 0.32; // world units per texture repeat
const bevelCache = new Map();
export function bevelBox(w, h, d, r = 0.03) {
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
