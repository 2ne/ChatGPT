import { useEffect, useRef, useState } from "react";
import type { BufferGeometry, Group, Material } from "three";
import { usePrefersReducedMotion } from "../../hooks/usePrefersReducedMotion";
import { Pip, type PipMood } from "./Pip";

type PipSceneProps = {
  size?: number;
  mood?: PipMood;
  className?: string;
};

type ThreeModule = typeof import("three");

/**
 * Living logo. A small WebGL Pip (gem and a face) for the header and the
 * finish screen. Eyes are drawn at every size so the header mark still reads.
 * Falls back to the SVG if WebGL or motion is unavailable.
 */
export function PipScene({ size = 40, mood = "happy", className }: PipSceneProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const moodRef = useRef(mood);
  const reduced = usePrefersReducedMotion();
  const [ready, setReady] = useState(false);
  const [failed, setFailed] = useState(false);

  moodRef.current = mood;

  useEffect(() => {
    if (reduced) return;
    const canvas = canvasRef.current;
    if (!canvas) return;

    let alive = true;
    let dispose = () => {};

    import("three")
      .then((THREE) => {
        if (!alive) return;
        const cleanup = mountPip(THREE, canvas, size, moodRef, () => {
          if (alive) setReady(true);
        });
        if (!cleanup) {
          if (alive) setFailed(true);
          return;
        }
        dispose = cleanup;
      })
      .catch(() => {
        if (alive) setFailed(true);
      });

    return () => {
      alive = false;
      dispose();
    };
  }, [reduced, size]);

  if (reduced || failed) {
    return <Pip size={size} mood={mood} className={className} />;
  }

  return (
    <span className={`pip-slot ${className ?? ""}`} style={{ width: size, height: size }}>
      {ready ? null : <Pip size={size} mood={mood} className="pip-alive" />}
      <canvas
        ref={canvasRef}
        width={size}
        height={size}
        aria-hidden
        style={{ width: size, height: size, opacity: ready ? 1 : 0 }}
      />
    </span>
  );
}

function mountPip(
  THREE: ThreeModule,
  canvas: HTMLCanvasElement,
  size: number,
  moodRef: { current: PipMood },
  onReady: () => void,
) {
  const renderer = new THREE.WebGLRenderer({
    canvas,
    alpha: true,
    antialias: true,
    powerPreference: "low-power",
  });
  if (!renderer.getContext()) {
    renderer.dispose();
    return null;
  }

  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
  renderer.setSize(size, size, false);
  renderer.setClearColor(0x000000, 0);

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(28, 1, 0.1, 20);
  camera.position.set(0, 0.02, 2.35);

  scene.add(new THREE.AmbientLight(0xffffff, 1.15));
  const key = new THREE.DirectionalLight(0xffffff, 1.35);
  key.position.set(0.2, 1.4, 4);
  scene.add(key);

  const geometries: BufferGeometry[] = [];
  const materials: Material[] = [];

  function addMesh(geometry: BufferGeometry, material: Material) {
    geometries.push(geometry);
    materials.push(material);
    return new THREE.Mesh(geometry, material);
  }

  const blue = new THREE.MeshStandardMaterial({
    color: 0x1865f2,
    roughness: 0.42,
    metalness: 0,
  });
  const white = new THREE.MeshBasicMaterial({ color: 0xffffff });
  const ink = new THREE.MeshBasicMaterial({ color: 0x21242c });

  const root = new THREE.Group();
  scene.add(root);

  const body = new THREE.Group();
  root.add(body);
  body.add(addMesh(gemGeometry(THREE, 0.82), blue));

  const eyePivots: Group[] = [];
  for (const x of [-0.28, 0.28]) {
    const pivot = new THREE.Group();
    pivot.position.set(x, 0.16, 0.2);
    const eye = addMesh(new THREE.SphereGeometry(0.2, 18, 18), white);
    const pupil = addMesh(new THREE.SphereGeometry(0.09, 14, 14), ink);
    pupil.position.set(0.04, -0.02, 0.15);
    pivot.add(eye, pupil);
    eyePivots.push(pivot);
    body.add(pivot);
  }

  const smile = addMesh(
    new THREE.TorusGeometry(0.22, 0.035, 8, 16, Math.PI * 0.72),
    ink,
  );
  smile.rotation.z = Math.PI;
  smile.position.set(0.02, -0.22, 0.28);
  body.add(smile);

  let frame = 0;
  let pauseOffset = 0;
  let hiddenAt = 0;
  const clock = new THREE.Clock();
  let lastMood: PipMood = "happy";
  let cheerStart = -10;

  const onVisibility = () => {
    if (document.hidden) {
      hiddenAt = clock.getElapsedTime();
      window.cancelAnimationFrame(frame);
      return;
    }
    pauseOffset += clock.getElapsedTime() - hiddenAt;
    frame = window.requestAnimationFrame(tick);
  };

  function elapsed() {
    return clock.getElapsedTime() - pauseOffset;
  }

  function tick() {
    const t = elapsed();
    const mood = moodRef.current;
    if (mood === "cheer" && lastMood !== "cheer") cheerStart = t;
    lastMood = mood;

    const sinceCheer = t - cheerStart;
    const hopping = mood === "cheer" && sinceCheer >= 0 && sinceCheer < 0.7;
    const hop = hopping ? Math.sin((sinceCheer / 0.7) * Math.PI) * 0.16 : 0;
    const drift = mood === "think" ? 0 : Math.sin(t * 1.4) * 0.02;

    root.position.y = hop + drift;
    root.rotation.z = mood === "think" ? 0.12 : 0;

    const blink = Math.sin(t * 1.15) > 0.985 ? 0.12 : 1;
    eyePivots.forEach((pivot) => {
      pivot.scale.y = blink;
    });

    renderer.render(scene, camera);
    frame = window.requestAnimationFrame(tick);
  }

  document.addEventListener("visibilitychange", onVisibility);
  frame = window.requestAnimationFrame(tick);
  onReady();

  return () => {
    window.cancelAnimationFrame(frame);
    document.removeEventListener("visibilitychange", onVisibility);
    geometries.forEach((geometry) => geometry.dispose());
    new Set(materials).forEach((material) => material.dispose());
    renderer.dispose();
  };
}

function gemGeometry(THREE: ThreeModule, radius: number) {
  const shape = new THREE.Shape();
  for (let i = 0; i < 6; i += 1) {
    const angle = -Math.PI / 2 + (i * Math.PI) / 3;
    const x = Math.cos(angle) * radius;
    const y = Math.sin(angle) * radius;
    if (i === 0) shape.moveTo(x, y);
    else shape.lineTo(x, y);
  }
  shape.closePath();
  const geometry = new THREE.ExtrudeGeometry(shape, {
    depth: 0.28,
    bevelEnabled: true,
    bevelThickness: 0.05,
    bevelSize: 0.04,
    bevelSegments: 1,
  });
  geometry.center();
  return geometry;
}
