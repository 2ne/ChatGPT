import { useEffect, useRef } from "react";
import { usePrefersReducedMotion } from "../hooks/usePrefersReducedMotion";

type ConfettiBurstProps = {
  /** Bump this number to fire a new burst. */
  burstId: number;
  /** Short pop from the question, or a fuller fall on mastery. */
  intensity?: "pop" | "shower";
};

const COLORS = ["#4F46E5", "#7C3AED", "#FFC93C", "#FF6B6B", "#10B981", "#0EA5E9"];

type Shape = "rect" | "square" | "circle";

type Particle = {
  x: number;
  y: number;
  vx: number;
  vy: number;
  w: number;
  h: number;
  rot: number;
  vr: number;
  color: string;
  shape: Shape;
  life: number;
  age: number;
};

export function ConfettiBurst({ burstId, intensity = "pop" }: ConfettiBurstProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const reduced = usePrefersReducedMotion();

  useEffect(() => {
    if (burstId <= 0 || reduced) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const context = canvas.getContext("2d");
    if (!context) return;

    canvas.hidden = false;
    let frame = 0;
    let stopped = false;

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const width = Math.max(1, window.innerWidth - 2);
      const height = Math.max(1, window.innerHeight - 2);
      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      context.setTransform(dpr, 0, 0, dpr, 0, 0);
      return { width, height };
    };

    let view = resize();
    const particles = spawn(view.width, view.height, intensity);
    let last = performance.now();

    const onResize = () => {
      view = resize();
    };
    window.addEventListener("resize", onResize);

    const tick = (now: number) => {
      if (stopped) return;
      const dt = Math.min(0.032, (now - last) / 1000);
      last = now;
      context.clearRect(0, 0, view.width, view.height);

      let alive = 0;
      for (const piece of particles) {
        piece.age += dt * 1000;
        if (piece.age >= piece.life) continue;
        alive += 1;
        piece.vy += 980 * dt;
        piece.vx += Math.sin(piece.age * 0.012 + piece.rot) * 18 * dt;
        piece.x += piece.vx * dt;
        piece.y += piece.vy * dt;
        piece.rot += piece.vr * dt;

        const fadeIn = Math.min(1, piece.age / 90);
        const fadeOut = Math.min(1, (piece.life - piece.age) / (piece.life * 0.35));
        context.save();
        context.translate(piece.x, piece.y);
        context.rotate(piece.rot);
        context.globalAlpha = Math.max(0, fadeIn * fadeOut);
        context.fillStyle = piece.color;
        if (piece.shape === "circle") {
          context.beginPath();
          context.arc(0, 0, piece.w / 2, 0, Math.PI * 2);
          context.fill();
        } else {
          context.fillRect(-piece.w / 2, -piece.h / 2, piece.w, piece.h);
        }
        context.restore();
      }

      if (alive === 0) {
        // An empty fixed canvas can still affect Safari toolbar colour sampling.
        canvas.hidden = true;
        window.removeEventListener("resize", onResize);
        return;
      }
      frame = window.requestAnimationFrame(tick);
    };

    frame = window.requestAnimationFrame(tick);

    return () => {
      stopped = true;
      window.cancelAnimationFrame(frame);
      window.removeEventListener("resize", onResize);
    };
  }, [burstId, intensity, reduced]);

  if (burstId <= 0 || reduced) return null;

  return <canvas ref={canvasRef} className="confetti-layer" aria-hidden />;
}

function spawn(width: number, height: number, intensity: "pop" | "shower"): Particle[] {
  const popCount = intensity === "shower" ? 36 : 28;
  const pieces = Array.from({ length: popCount }, () =>
    burstPiece(width / 2, height * 0.4, 460, 980),
  );
  if (intensity === "shower") {
    for (let i = 0; i < 48; i += 1) {
      pieces.push(fallPiece(width, height));
    }
  }
  return pieces;
}

function burstPiece(originX: number, originY: number, minSpeed: number, maxSpeed: number): Particle {
  const angle = -Math.PI / 2 + (Math.random() - 0.5) * Math.PI * 1.2;
  const speed = minSpeed + Math.random() * (maxSpeed - minSpeed);
  return {
    x: originX + (Math.random() - 0.5) * 16,
    y: originY,
    vx: Math.cos(angle) * speed,
    vy: Math.sin(angle) * speed,
    ...look(0.85 + Math.random() * 0.35),
  };
}

function fallPiece(width: number, height: number): Particle {
  return {
    x: Math.random() * width,
    y: -20 - Math.random() * height * 0.25,
    vx: (Math.random() - 0.5) * 160,
    vy: 40 + Math.random() * 180,
    ...look(1.3 + Math.random() * 0.5),
  };
}

function look(lifeScale: number): Pick<Particle, "w" | "h" | "rot" | "vr" | "color" | "shape" | "life" | "age"> {
  const shapeRoll = Math.floor(Math.random() * 5);
  const shape: Shape = shapeRoll === 0 ? "circle" : shapeRoll === 1 ? "square" : "rect";
  const size = 7 + Math.random() * 7;
  return {
    w: size,
    h: shape === "rect" ? 4 + Math.random() * 4 : size,
    rot: Math.random() * Math.PI,
    vr: (Math.random() < 0.5 ? -1 : 1) * (4 + Math.random() * 8),
    color: COLORS[Math.floor(Math.random() * COLORS.length)],
    shape,
    life: (900 + Math.random() * 500) * lifeScale,
    age: 0,
  };
}
