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
 * Living logo. A small WebGL Pip (gem, orbit ring, face) for the header,
 * welcome, and finish screen. Question cards stay flat — this canvas is the
 * mark, not a backdrop. Falls back to the SVG if WebGL or motion is unavailable.
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
  const camera = new THREE.PerspectiveCamera(32, 1, 0.1, 20);
  camera.position.set(0, 0.05, 3.55);

  scene.add(new THREE.AmbientLight(0xffffff, 0.85));
  const key = new THREE.DirectionalLight(0xffffff, 1.7);
  key.position.set(2.2, 3, 4);
  scene.add(key);
  const rim = new THREE.DirectionalLight(0x5eb3d4, 0.45);
  rim.position.set(-2.5, -0.5, 2);
  scene.add(rim);

  const geometries: BufferGeometry[] = [];
  const materials: Material[] = [];

  function addMesh(geometry: BufferGeometry, material: Material) {
    geometries.push(geometry);
    materials.push(material);
    return new THREE.Mesh(geometry, material);
  }

  const blue = new THREE.MeshStandardMaterial({
    color: 0x1865f2,
    roughness: 0.38,
    metalness: 0.04,
  });
  const deep = new THREE.MeshStandardMaterial({
    color: 0x2f6fed,
    roughness: 0.5,
    metalness: 0.02,
  });
  const ringMat = new THREE.MeshStandardMaterial({
    color: 0x5eb3d4,
    roughness: 0.25,
    metalness: 0.12,
  });
  const white = new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.4 });
  const ink = new THREE.MeshStandardMaterial({ color: 0x0b2149, roughness: 0.45 });

  const root = new THREE.Group();
  scene.add(root);

  const ring = addMesh(new THREE.TorusGeometry(1.12, 0.045, 10, 56), ringMat);
  ring.rotation.x = 1.15;
  ring.rotation.y = -0.42;
  root.add(ring);

  const body = new THREE.Group();
  body.rotation.y = 0.42;
  root.add(body);

  const back = addMesh(gemGeometry(THREE, 0.78), deep);
  back.position.z = -0.05;
  body.add(back);
  body.add(addMesh(gemGeometry(THREE, 0.68), blue));

  const detailed = size >= 80;
  const eyePivots: Group[] = [];
  if (detailed) {
    for (const x of [-0.2, 0.2]) {
      const pivot = new THREE.Group();
      pivot.position.set(x, 0.08, 0.28);
      const eye = addMesh(new THREE.SphereGeometry(0.12, 18, 18), white);
      const pupil = addMesh(new THREE.SphereGeometry(0.05, 12, 12), ink);
      pupil.position.set(0.03, -0.02, 0.1);
      pivot.add(eye, pupil);
      eyePivots.push(pivot);
      body.add(pivot);
    }
    const smile = addMesh(
      new THREE.TorusGeometry(0.15, 0.018, 6, 14, Math.PI * 0.7),
      ink,
    );
    smile.rotation.z = Math.PI;
    smile.position.set(0.01, -0.16, 0.32);
    body.add(smile);
  }

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
    root.rotation.z = mood === "think" ? 0.22 : Math.sin(t * 0.45) * 0.04;

    const ringSpeed = mood === "cheer" ? 0.9 : mood === "think" ? 0.18 : 0.4;
    ring.rotation.z = t * ringSpeed;

    if (detailed) {
      const blink = Math.sin(t * 1.15) > 0.985 ? 0.08 : 1;
      eyePivots.forEach((pivot) => {
        pivot.scale.y = blink;
      });
    }

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
