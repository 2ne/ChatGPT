import type { ShapeAsset } from "../../types/shapes";
import { SHAPE_COLOUR_VALUES } from "../../lib/shapes";

/** Crisp flat 2D geometry. Solid shapes are rendered by Three.js. */
export function ShapeSvg({ shape }: { shape: ShapeAsset }) {
  const colour = SHAPE_COLOUR_VALUES[shape.colour ?? "purple"];
  const variant = shape.variant ?? "standard";
  let drawing;
  switch (shape.name) {
    case "circle": drawing = <circle cx="80" cy="80" r="51" />; break;
    case "square": drawing = <rect x="37" y="37" width="86" height="86" />; break;
    case "rectangle": drawing = variant === "tall" ? <rect x="49" y="22" width="62" height="116" /> : <rect x={variant === "wide" ? 20 : 29} y="49" width={variant === "wide" ? 120 : 102} height="62" />; break;
    case "triangle": {
      const points = variant === "right" ? "29,28 29,132 132,132" : variant === "scalene" ? "24,116 110,27 139,130" : variant === "wide" ? "15,113 110,43 145,113" : variant === "tall" ? "50,137 81,20 110,137" : "80,25 24,128 136,128";
      drawing = <polygon points={points} />; break;
    }

  }
  return (
    <svg viewBox="0 0 160 160" className="shape-svg" aria-hidden="true" focusable="false">
      <g transform={`translate(80 80) rotate(${shape.rotation ?? 0}) scale(${shape.scale ?? 1}) translate(-80 -80)`} fill={colour} stroke="#343568" strokeWidth="2.6" strokeLinejoin="round">{drawing}</g>
    </svg>
  );
}
