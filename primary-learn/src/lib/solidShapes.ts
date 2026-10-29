import * as THREE from "three";
import type { ShapeAsset } from "../types/shapes";
import { SHAPE_COLOUR_VALUES } from "./shapes";

const CAMERA_POSITION = new THREE.Vector3(3, 2.2, 4);

function startingRotation(shape: ShapeAsset): number {
  const requested = (shape.rotation ?? 0) * Math.PI / 180;
  if (shape.name !== "pyramid") return requested;

  // A face-on pyramid can look like a flat triangle. Centre the initial view
  // around a base vertex, with enough of both neighbouring faces visible.
  // Keep free dragging unrestricted once the child starts exploring.
  const sides = shape.variant === "triangular" ? 3 : 4;
  const period = 2 * Math.PI / sides;
  const cornerView = Math.atan2(CAMERA_POSITION.x, CAMERA_POSITION.z);
  const offset = ((requested - cornerView + period / 2) % period + period) % period - period / 2;
  const limit = 20 * Math.PI / 180;
  return cornerView + Math.max(-limit, Math.min(limit, offset));
}

function model(shape: ShapeAsset) {
  const variant = shape.variant ?? "standard";
  let geometry: THREE.BufferGeometry;
  switch (shape.name) {
    case "dice":
    case "cube": geometry = new THREE.BoxGeometry(1.3, 1.3, 1.3); break;
    case "cuboid": geometry = variant === "tall" ? new THREE.BoxGeometry(0.9, 1.9, 0.9) : new THREE.BoxGeometry(1.9, 0.95, 0.95); break;
    case "pyramid": geometry = new THREE.ConeGeometry(1.05, variant === "tall" ? 2 : 1.65, variant === "triangular" ? 3 : 4); break;
    default: geometry = new THREE.SphereGeometry(0.86, 40, 28);
  }
  const material = new THREE.MeshPhysicalMaterial({
    color: SHAPE_COLOUR_VALUES[shape.colour ?? "purple"],
    metalness: 0,
    roughness: 0.28,
    clearcoat: 0.65,
    clearcoatRoughness: 0.2,
    flatShading: shape.name !== "sphere",
  });
  const group = new THREE.Group();
  group.add(new THREE.Mesh(geometry, material));
  if (shape.name !== "sphere") {
    group.add(new THREE.LineSegments(new THREE.EdgesGeometry(geometry), new THREE.LineBasicMaterial({ color: "#343568" })));
  }
  if (shape.name === "dice") {
    // Opposite faces total seven. Each pip sits just above its square face.
    const patterns: [number, number][][] = [
      [[0, 0]],
      [[-1, 1], [1, -1]],
      [[-1, 1], [0, 0], [1, -1]],
      [[-1, -1], [-1, 1], [1, -1], [1, 1]],
      [[-1, -1], [-1, 1], [0, 0], [1, -1], [1, 1]],
      [[-1, -1], [-1, 0], [-1, 1], [1, -1], [1, 0], [1, 1]],
    ];
    const faces: { value: number; normal: THREE.Vector3 }[] = [
      { value: 1, normal: new THREE.Vector3(0, 1, 0) },
      { value: 6, normal: new THREE.Vector3(0, -1, 0) },
      { value: 2, normal: new THREE.Vector3(0, 0, 1) },
      { value: 5, normal: new THREE.Vector3(0, 0, -1) },
      { value: 3, normal: new THREE.Vector3(1, 0, 0) },
      { value: 4, normal: new THREE.Vector3(-1, 0, 0) },
    ];
    for (const { value, normal } of faces) {
      const face = new THREE.Group();
      face.quaternion.setFromUnitVectors(new THREE.Vector3(0, 0, 1), normal);
      face.position.copy(normal).multiplyScalar(0.652);
      for (const [x, y] of patterns[value - 1]) {
        const pip = new THREE.Mesh(
          new THREE.CircleGeometry(0.085, 24),
          new THREE.MeshStandardMaterial({ color: "#ffffff", roughness: 0.5 }),
        );
        pip.position.set(x * 0.31, y * 0.31, 0);
        face.add(pip);
      }
      group.add(face);
    }
  }
  group.rotation.y = startingRotation(shape);
  group.scale.setScalar(shape.scale ?? 1);
  return group;
}

function disposeModel(group: THREE.Group) {
  group.traverse((object) => {
    if (object instanceof THREE.Mesh || object instanceof THREE.LineSegments) {
      object.geometry.dispose();
      const materials = Array.isArray(object.material) ? object.material : [object.material];
      materials.forEach((material) => material.dispose());
    }
  });
}

function sceneFor(shape: ShapeAsset) {
  const scene = new THREE.Scene();
  const camera = new THREE.OrthographicCamera(-1.65, 1.65, 1.65, -1.65, 0.1, 30);
  camera.position.copy(CAMERA_POSITION);
  camera.lookAt(0, 0, 0);
  // Keep the ambient fill below the key light so neighbouring faces retain
  // contrast. The glossy non-metallic surface gives spheres a clear highlight.
  scene.add(new THREE.HemisphereLight(0xffffff, 0x686587, 1.2));
  const light = new THREE.DirectionalLight(0xffffff, 3);
  light.position.set(-3, 5, 4);
  scene.add(light);
  const rim = new THREE.DirectionalLight(0xe3eaff, 0.7);
  rim.position.set(4, 2, -3);
  scene.add(rim);
  const group = model(shape);
  scene.add(group);
  return { scene, camera, group };
}

let snapshotRenderer: THREE.WebGLRenderer | undefined;
let snapshotsUnavailable = false;
const snapshots = new Map<string, string>();

/** One shared offscreen context for every answer card, never one per card. */
export function solidSnapshot(shape: ShapeAsset): string | undefined {
  const key = JSON.stringify(shape);
  if (snapshots.has(key)) return snapshots.get(key);
  if (snapshotsUnavailable) return undefined;
  let group: THREE.Group | undefined;
  try {
    snapshotRenderer ??= new THREE.WebGLRenderer({ alpha: true, antialias: true });
    snapshotRenderer.setSize(256, 256, false);
    const view = sceneFor(shape);
    group = view.group;
    snapshotRenderer.render(view.scene, view.camera);
    const image = snapshotRenderer.domElement.toDataURL("image/png");
    if (snapshots.size >= 64) snapshots.delete(snapshots.keys().next().value!);
    snapshots.set(key, image);
    return image;
  } catch {
    snapshotsUnavailable = true;
    snapshotRenderer?.dispose();
    snapshotRenderer = undefined;
    return undefined;
  } finally {
    if (group) disposeModel(group);
  }
}

/** Render only on interaction. No idle animation or continuous render loop. */
export function mountSolid(host: HTMLElement, shape: ShapeAsset) {
  const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
  renderer.setSize(256, 256, false);
  const { scene, camera, group } = sceneFor(shape);
  const draw = () => renderer.render(scene, camera);
  draw();
  host.appendChild(renderer.domElement);
  return {
    rotate(x: number, y: number) {
      group.rotation.x += x;
      group.rotation.y += y;
      draw();
    },
    reset() { group.rotation.set(0, startingRotation(shape), 0); draw(); },
    dispose() {
      disposeModel(group);
      renderer.dispose();
      renderer.forceContextLoss();
      renderer.domElement.remove();
    },
  };
}
