import { describeVisual } from "../../data/objects";
import type { ObjectAsset, ObjectItem } from "../../types/activity";

const GLYPH: Record<ObjectItem, string> = {
  apple: "🍎",
  banana: "🍌",
  star: "⭐",
  balloon: "🎈",
  car: "🚗",
  duck: "🦆",
  ladybird: "🐞",
  frog: "🐸",
  fish: "🐟",
  strawberry: "🍓",
  sparkle: "🌟",
};

type ObjectGroupProps = {
  visual: ObjectAsset;
  compact?: boolean;
};

export function ObjectGroup({ visual, compact }: ObjectGroupProps) {
  const glyph = GLYPH[visual.item];
  return (
    <span
      className={`object-group${compact ? " is-compact" : ""}`}
      aria-label={describeVisual(visual)}
    >
      {Array.from({ length: visual.count }, (_, index) => (
        <span key={index} aria-hidden>
          {glyph}
        </span>
      ))}
    </span>
  );
}

export function OptionContent({
  label,
  visual,
}: {
  label?: string;
  visual?: ObjectAsset;
}) {
  return (
    <span className="option-content">
      {visual ? <ObjectGroup visual={visual} compact /> : null}
      {label ? <span>{label}</span> : null}
    </span>
  );
}
