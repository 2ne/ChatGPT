import type { ShapeAsset } from "../../types/shapes";
import { SHAPE_COLOUR_VALUES } from "../../lib/shapes";

/** Crisp flat 2D geometry, near misses, and everyday object pictures. */
export function ShapeSvg({ shape }: { shape: ShapeAsset }) {
  const colour = SHAPE_COLOUR_VALUES[shape.colour ?? "purple"];
  const variant = shape.variant ?? "standard";
  let drawing;
  switch (shape.name) {
    case "circle":
      drawing = <circle cx="80" cy="80" r="51" />;
      break;
    case "square":
      drawing = <rect x="37" y="37" width="86" height="86" />;
      break;
    case "rectangle":
      drawing =
        variant === "squashed" ? (
          <rect x="18" y="66" width="124" height="28" />
        ) : variant === "tall" ? (
          <rect x="49" y="22" width="62" height="116" />
        ) : (
          <rect x={variant === "wide" ? 20 : 29} y="49" width={variant === "wide" ? 120 : 102} height="62" />
        );
      break;
    case "triangle": {
      const points =
        variant === "squashed"
          ? "16,98 144,98 80,68"
          : variant === "right"
            ? "29,28 29,132 132,132"
            : variant === "scalene"
              ? "24,116 110,27 139,130"
              : variant === "wide"
                ? "15,113 110,43 145,113"
                : variant === "tall"
                  ? "50,137 81,20 110,137"
                  : "80,25 24,128 136,128";
      drawing = <polygon points={points} />;
      break;
    }
    case "kite":
      drawing = <polygon points="80,16 128,68 80,148 32,68" />;
      break;
    case "pentagon":
      drawing = <polygon points="80,20 132,58 112,128 48,128 28,58" />;
      break;
    case "wonky":
      drawing = (
        <path d="M42 46 C22 70 30 112 58 128 C86 146 128 132 138 96 C148 60 118 28 86 26 C68 24 54 32 42 46 Z" />
      );
      break;
    case "ball":
      drawing = (
        <>
          <circle cx="80" cy="80" r="48" />
          <path d="M36 62 C58 50 102 50 124 62" fill="none" stroke="#fff" strokeWidth="3" />
          <path d="M80 32 V128 M42 80 C62 98 98 98 118 80" fill="none" stroke="#343568" strokeWidth="2.4" />
        </>
      );
      break;
    case "box":
      drawing = (
        <>
          <polygon points="40,70 80,48 120,70 80,92" />
          <polygon points="40,70 40,118 80,140 80,92" />
          <polygon points="80,92 80,140 120,118 120,70" />
          <path d="M80 48 V92 M40 70 L80 92 L120 70" fill="none" stroke="#343568" strokeWidth="2.2" />
        </>
      );
      break;
    case "tin":
      drawing = (
        <>
          <path d="M46 52 V112 C46 128 114 128 114 112 V52 C114 36 46 36 46 52 Z" />
          <ellipse cx="80" cy="52" rx="34" ry="14" />
          <ellipse cx="80" cy="52" rx="18" ry="7" fill="#fff" opacity="0.35" />
        </>
      );
      break;
    case "cone-hat":
      drawing = (
        <>
          <polygon points="80,22 28,118 132,118" />
          <ellipse cx="80" cy="118" rx="52" ry="12" />
          <circle cx="80" cy="22" r="8" />
        </>
      );
      break;
    case "dice":
      drawing = (
        <>
          <rect x="36" y="36" width="88" height="88" rx="14" />
          <circle cx="58" cy="58" r="7" fill="#fff" />
          <circle cx="102" cy="58" r="7" fill="#fff" />
          <circle cx="80" cy="80" r="7" fill="#fff" />
          <circle cx="58" cy="102" r="7" fill="#fff" />
          <circle cx="102" cy="102" r="7" fill="#fff" />
        </>
      );
      break;
    default:
      drawing = null;
  }
  return (
    <svg viewBox="0 0 160 160" className="shape-svg" aria-hidden="true" focusable="false">
      <g
        transform={`translate(80 80) rotate(${shape.rotation ?? 0}) scale(${shape.scale ?? 1}) translate(-80 -80)`}
        fill={colour}
        stroke="#343568"
        strokeWidth="2.6"
        strokeLinejoin="round"
      >
        {drawing}
      </g>
    </svg>
  );
}
