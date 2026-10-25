import type { DiceAsset } from "../../types/activity";

const PIPS: Record<number, number[]> = {
  1: [5],
  2: [1, 9],
  3: [1, 5, 9],
  4: [1, 3, 7, 9],
  5: [1, 3, 5, 7, 9],
  6: [1, 3, 4, 6, 7, 9],
};

type DiceFaceProps = {
  face: DiceAsset;
  compact?: boolean;
};

export function DiceFace({ face, compact }: DiceFaceProps) {
  const count = Math.max(1, Math.min(6, Math.floor(face.count)));
  const lit = new Set(PIPS[count] ?? PIPS[1]);
  return (
    <span className={`dice-face${compact ? " is-compact" : ""}`} aria-label={`dice showing ${count}`}>
      {Array.from({ length: 9 }, (_, index) => (
        <span
          key={index}
          className={`dice-pip${lit.has(index + 1) ? " is-on" : ""}`}
          aria-hidden
        />
      ))}
    </span>
  );
}
