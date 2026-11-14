import * as THREE from 'three';
import { mergeGeometries } from 'three/addons/utils/BufferGeometryUtils.js';

// Visual dressing only: deliberately independent of solids, navigation and spawns.
// All boxes share one geometry; pipe runs merge into one static mesh.
export function buildIndustrialExterior(world) {
  const blocks = [], indicators = [], pipes = [];
  const steel = 0x243746, edge = 0x304756, dark = 0x101e29;
  const add = (x, y, z, w, h, d, color = steel) => blocks.push({ x, y, z, w, h, d, color });
  function cabinet(x, z, sideways = false) {
    const w = sideways ? 0.65 : 1.05, d = sideways ? 1.05 : 0.65;
    add(x, 0.36, z, w, 0.7, d);
    add(x, 0.73, z, w + 0.06, 0.06, d + 0.06, edge);
    add(x, 0.36, z + d / 2 + 0.013, w * 0.78, 0.48, 0.025, dark);
    for (let i = 0; i < 3; i++) indicators.push({ x: x - 0.11 + i * 0.11,
      y: 0.4, z: z + d / 2 + 0.03, w: 0.035, h: 0.13, d: 0.02 });
  }
  function crate(x, z, y = 0) {
    add(x, y + 0.28, z, 0.65, 0.55, 0.65);
    add(x, y + 0.56, z, 0.68, 0.05, 0.68, edge);
    add(x, y + 0.59, z, 0.5, 0.02, 0.5, dark);
    add(x, y + 0.27, z + 0.33, 0.47, 0.35, 0.025, dark);
  }
  function cover(x, z, grate = false) {
    add(x, 0.018, z, 1.25, 0.032, 0.9, edge);
    add(x, 0.037, z, 1.12, 0.012, 0.77, dark);
    if (grate) {
      for (let i = 0; i < 11; i++) add(x - 0.49 + i * 0.098, 0.049, z, 0.035, 0.018, 0.73, steel);
    } else {
      add(x, 0.05, z, 1.03, 0.015, 0.68, steel);
      for (const dx of [-0.48, 0.48]) for (const dz of [-0.3, 0.3])
        add(x + dx, 0.063, z + dz, 0.045, 0.015, 0.045, edge);
    }
  }
  function pipe(points, offset = 0) {
    const vertices = points.map(([x, z]) => new THREE.Vector3(x + offset, 0.16, z + offset));
    const path = new THREE.CurvePath();
    let start = vertices[0];
    for (let i = 1; i < vertices.length - 1; i++) {
      const corner = vertices[i];
      const before = corner.clone().addScaledVector(start.clone().sub(corner).normalize(), 0.4);
      const after = corner.clone().addScaledVector(vertices[i + 1].clone().sub(corner).normalize(), 0.4);
      path.add(new THREE.LineCurve3(start, before));
      path.add(new THREE.QuadraticBezierCurve3(before, corner, after));
      start = after;
    }
    path.add(new THREE.LineCurve3(start, vertices.at(-1)));
    pipes.push(new THREE.TubeGeometry(path, Math.ceil(path.getLength() * 4), 0.095, 6, false));
    for (const p of [vertices[0], vertices.at(-1)]) add(p.x, 0.1, p.z, 0.31, 0.17, 0.31, edge);
  }
  // Short paired service runs, never continuous barriers or doorway crossings.
  const routes = [
    [[-12.2, 7], [-13.2, 7], [-13.2, 2], [-14.2, 2]],
    [[-12.2, -7], [-13.2, -7], [-13.2, -11], [-18, -11]],
    [[11.8, 2], [12.5, 2], [12.5, 7], [13, 7]],
    [[-9, 12], [-9, 13], [-2, 13]],
    [[-21, -23.6], [-21, -22.8], [-13, -22.8]],
    [[2, -23.6], [2, -22.8], [10, -22.8]],
    [[-25.5, -30], [-26.3, -30], [-26.3, -40], [-27, -40]],
    [[-25.5, -54], [-26.3, -54], [-26.3, -63]],
    [[15.5, -31], [16.3, -31], [16.3, -40]],
    [[15.5, -54], [16.3, -54], [16.3, -63]],
    [[-20, -70.5], [-20, -71.3], [-12, -71.3]],
    [[2, -70.5], [2, -71.3], [10, -71.3]],
  ];
  for (const route of routes) { pipe(route); pipe(route, 0.28); }
  for (const [x, z, side] of [[-14.5, 2, true], [-18.4, -11, false], [13.2, 7, true],
    [-1.5, 13, false], [-12.4, -22.6, false], [10.6, -22.6, false],
    [-27, -40.8, true], [-26.2, -63.6, true], [16.4, -40.6, true],
    [16.4, -63.6, true], [-11.4, -71.2, false], [10.6, -71.2, false]]) cabinet(x, z, side);
  for (const [x, z] of [[-18, 8], [8, 15], [-19, -18], [13, -18], [-30, -35],
    [20, -58], [-17, -75]]) { crate(x, z); crate(x + 0.75, z - 0.12); }
  crate(-17.25, 7.88, 0.61);
  for (const [x, z, grate] of [[-17, -3, true], [-11.8, 16, false], [17, 4, true],
    [-11, -17, true], [1, -19, false], [-28, -44, true], [-29, -57, false],
    [18, -44, true], [20, -65, false], [-16, -73, true], [4, -74, false]]) cover(x, z, grate);
  // Recessed-looking channels: surface detail only, aligned to service clusters.
  for (const [x, z, length] of [[-16, 3, 7], [17.8, -35, 7], [-28, -58, 6], [12, -17, 3]]) {
    add(x, 0.018, z, 0.32, 0.025, length, dark);
    for (const dx of [-0.18, 0.18]) add(x + dx, 0.037, z, 0.035, 0.035, length, edge);
    for (let dz = -length / 2; dz < length / 2; dz += 0.22) add(x, 0.039, z + dz, 0.3, 0.024, 0.035, steel);
    for (let i = 0; i < 3; i++) add(x + 0.38, 0.028, z - length / 2 + i * 0.19, 0.17, 0.02, 0.07, 0x72522b);
  }
  const geometry = new THREE.BoxGeometry(1, 1, 1);
  function instances(items, material, colored) {
    const mesh = new THREE.InstancedMesh(geometry, material, items.length);
    const matrix = new THREE.Matrix4(), color = new THREE.Color();
    items.forEach((b, i) => {
      matrix.makeScale(b.w, b.h, b.d).setPosition(b.x, b.y, b.z);
      mesh.setMatrixAt(i, matrix);
      if (colored) mesh.setColorAt(i, color.setHex(b.color));
    });
    mesh.receiveShadow = true;
    mesh.name = 'Exterior factory dressing (visual only)';
    world.add(mesh);
  }
  instances(blocks, new THREE.MeshStandardMaterial({ roughness: 0.85, metalness: 0.35 }), true);
  instances(indicators, new THREE.MeshStandardMaterial({ color: 0x46b6bd, emissive: 0x27aab5,
    emissiveIntensity: 0.65, roughness: 0.6 }), false);
  const pipeMesh = new THREE.Mesh(mergeGeometries(pipes), new THREE.MeshStandardMaterial({
    color: 0x253946, roughness: 0.72, metalness: 0.5 }));
  pipeMesh.receiveShadow = true;
  world.add(pipeMesh);
  pipes.forEach(g => g.dispose());
}
