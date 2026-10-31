import { useId } from "react";
import type { FractionAsset } from "../../types/activity";
import { describeFraction } from "../../lib/fractions";

/** Exact equal areas, with deliberately unequal near misses supplied by content. */
export function FractionPicture({ fraction, compact }: { fraction: FractionAsset; compact?: boolean }) {
  const pattern = `fraction-${useId().replace(/:/g, "")}`;
  const { shape, parts, shaded } = fraction;
  const equal = fraction.equal !== false;
  const layout = fraction.layout ?? (parts === 4 ? "grid" : "vertical");
  const weights = equal ? Array(parts).fill(1 / parts) as number[] : parts === 2 ? [.3, .7] : [.1, .2, .3, .4];
  let regions: string[];
  if (shape === "circle") {
    let angle = -Math.PI / 2;
    regions = weights.map((weight) => {
      const end = angle + weight * 2 * Math.PI;
      const x1 = 90 + 50 * Math.cos(angle), y1 = 60 + 50 * Math.sin(angle);
      const x2 = 90 + 50 * Math.cos(end), y2 = 60 + 50 * Math.sin(end);
      angle = end;
      return `M90 60 L${x1} ${y1} A50 50 0 ${weight > .5 ? 1 : 0} 1 ${x2} ${y2} Z`;
    });
  } else {
    const x = shape === "square" ? 40 : 10;
    const y = shape === "square" ? 10 : 20;
    const w = shape === "square" ? 100 : 160;
    const h = shape === "square" ? 100 : 80;
    const box = (a: number, b: number, width: number, height: number) => `M${a} ${b} h${width} v${height} h${-width} Z`;
    if (layout === "diagonal") {
      const corners = [[x, y], [x + w, y], [x + w, y + h], [x, y + h]];
      regions = parts === 2 ? [
        `M${x} ${y} L${x + w} ${y} L${x + w} ${y + h} Z`,
        `M${x} ${y} L${x + w} ${y + h} L${x} ${y + h} Z`,
      ] : corners.map((corner, index) => `M${x + w / 2} ${y + h / 2} L${corner.join(" ")} L${corners[(index + 1) % 4]!.join(" ")} Z`);
    } else if (layout === "grid") {
      regions = [box(x, y, w / 2, h / 2), box(x + w / 2, y, w / 2, h / 2), box(x, y + h / 2, w / 2, h / 2), box(x + w / 2, y + h / 2, w / 2, h / 2)];
    } else {
      let offset = 0;
      regions = weights.map(weight => {
        const region = layout === "horizontal" ? box(x, y + offset * h, w, weight * h) : box(x + offset * w, y, weight * w, h);
        offset += weight;
        return region;
      });
    }
  }
  return (
    <svg className={`fraction-picture${compact ? " is-option" : ""}`} viewBox="0 0 180 120" role="img" aria-label={describeFraction(fraction)} focusable="false">
      <defs>
        <pattern id={pattern} width="8" height="8" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
          <rect width="8" height="8" fill="var(--fraction-fill)" />
          <path d="M0 0 V8" stroke="var(--fraction-hatch)" strokeWidth="2" />
        </pattern>
      </defs>
      {regions.map((d, index) => <path key={index} d={d} fill={shaded.includes(index) ? `url(#${pattern})` : "var(--paper)"} stroke="var(--ink-soft)" strokeWidth="2" strokeLinejoin="round" />)}
    </svg>
  );
}
