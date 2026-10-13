import { useEffect, useMemo, useState } from "react";

type ConfettiBurstProps = {
  /** Bump this number to fire a new burst. */
  burstId: number;
};

const COLORS = ["#1865f2", "#14bf96", "#ffb100", "#f071a8", "#ff8a3d", "#5eb3d4"];

type Piece = {
  id: number;
  left: string;
  delay: string;
  duration: string;
  color: string;
  rotate: string;
  size: number;
  drift: string;
};

export function ConfettiBurst({ burstId }: ConfettiBurstProps) {
  const [visible, setVisible] = useState(false);

  const pieces = useMemo<Piece[]>(() => {
    if (burstId <= 0) return [];
    return Array.from({ length: 28 }, (_, id) => ({
      id,
      left: `${6 + ((id * 17) % 88)}%`,
      delay: `${(id % 8) * 0.03}s`,
      duration: `${0.9 + (id % 5) * 0.08}s`,
      color: COLORS[id % COLORS.length],
      rotate: `${(id * 47) % 360}deg`,
      size: 6 + (id % 5),
      drift: `${(id % 2 === 0 ? -1 : 1) * (12 + (id % 6) * 6)}px`,
    }));
  }, [burstId]);

  useEffect(() => {
    if (burstId <= 0) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    setVisible(true);
    const timer = window.setTimeout(() => setVisible(false), 1400);
    return () => window.clearTimeout(timer);
  }, [burstId]);

  if (!visible || pieces.length === 0) return null;

  return (
    <div className="confetti-layer" aria-hidden>
      {pieces.map((piece) => (
        <span
          key={`${burstId}-${piece.id}`}
          className="confetti-piece"
          style={{
            left: piece.left,
            width: piece.size,
            height: piece.size * 0.55,
            background: piece.color,
            animationDelay: piece.delay,
            animationDuration: piece.duration,
            ["--confetti-rotate" as string]: piece.rotate,
            ["--confetti-drift" as string]: piece.drift,
          }}
        />
      ))}
    </div>
  );
}
