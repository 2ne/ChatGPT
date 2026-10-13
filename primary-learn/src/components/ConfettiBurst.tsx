import { useEffect, useMemo, useState } from "react";

type ConfettiBurstProps = {
  /** Bump this number to fire a new burst. */
  burstId: number;
};

const COLORS = ["#1865f2", "#14bf96", "#ffb100", "#f071a8", "#ff8a3d", "#5eb3d4", "#ffffff"];

type Piece = {
  id: number;
  color: string;
  size: number;
  height: number;
  delay: string;
  duration: string;
  /** Launch angle in degrees (0 = right, 90 = down). */
  angle: number;
  distance: number;
  spin: number;
  shape: "rect" | "square" | "circle";
};

export function ConfettiBurst({ burstId }: ConfettiBurstProps) {
  const [visible, setVisible] = useState(false);

  const pieces = useMemo<Piece[]>(() => {
    if (burstId <= 0) return [];
    return Array.from({ length: 36 }, (_, id) => {
      // Prefer upward / outward burst (not straight down)
      const base = -100 + (id / 35) * 200; // roughly -100° to +100° from up
      const jitter = ((id * 37) % 25) - 12;
      const angle = base + jitter;
      const shapeRoll = id % 5;
      return {
        id,
        color: COLORS[id % COLORS.length],
        size: 7 + (id % 6),
        height: shapeRoll === 0 ? 7 + (id % 6) : 4 + (id % 4),
        delay: `${(id % 6) * 0.012}s`,
        duration: `${0.75 + (id % 7) * 0.06}s`,
        angle,
        distance: 90 + ((id * 53) % 140),
        spin: (id % 2 === 0 ? 1 : -1) * (280 + (id % 5) * 90),
        shape: shapeRoll === 1 ? "circle" : shapeRoll === 2 ? "square" : "rect",
      };
    });
  }, [burstId]);

  useEffect(() => {
    if (burstId <= 0) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    setVisible(true);
    const timer = window.setTimeout(() => setVisible(false), 1100);
    return () => window.clearTimeout(timer);
  }, [burstId]);

  if (!visible || pieces.length === 0) return null;

  return (
    <div className="confetti-layer" aria-hidden>
      <div className="confetti-origin">
        {pieces.map((piece) => {
          const rad = (piece.angle * Math.PI) / 180;
          const x = Math.sin(rad) * piece.distance;
          const y = -Math.cos(rad) * piece.distance;
          return (
            <span
              key={`${burstId}-${piece.id}`}
              className={`confetti-piece is-${piece.shape}`}
              style={{
                width: piece.size,
                height: piece.height,
                background: piece.color,
                animationDelay: piece.delay,
                animationDuration: piece.duration,
                ["--burst-x" as string]: `${x}px`,
                ["--burst-y" as string]: `${y}px`,
                ["--burst-spin" as string]: `${piece.spin}deg`,
              }}
            />
          );
        })}
      </div>
    </div>
  );
}
