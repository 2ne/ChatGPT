import { copy } from "../../data/copy";
import type { ReactNode } from "react";
import type { MeasureAsset } from "../../types/activity";
import { describeMeasure } from "../../lib/measures";

export function MeasurePicture({ measure, compact }: { measure: MeasureAsset; compact?: boolean }) {
  const { kind, values, labels, units, gaps, offsets } = measure;
  let height = 160;
  let drawing: ReactNode;
  const label = (text: string, x: number, y: number) => <text x={x} y={y} textAnchor="middle" className="measure-label">{text}</text>;
  const block = (x: number, y: number, w: number, h: number, key: number) => <rect key={key} x={x} y={y} width={w} height={h} rx="1" className="measure-unit" />;
  const cup = (x: number, y: number, w: number, h: number, fill: number, key: number) => <g key={key}>
    <rect x={x + 2} y={y + h * (1 - fill / 4)} width={w - 4} height={h * fill / 4} className="measure-water" />
    {fill > 0 ? <path d={`M${x + 2} ${y + h * (1 - fill / 4)} H${x + w - 2}`} className="measure-water-line" /> : null}
    <path d={`M${x} ${y} V${y + h} H${x + w} V${y}`} className="measure-outline" />
  </g>;
  if (kind === "length") {
    height = values.length * (units ? 85 : 62) + 15;
    drawing = values.map((value, i) => {
      const top = i * (units ? 85 : 62) + 22;
      const start = 22 + (offsets?.[i] ?? 0) * 24;
      const width = value * 24;
      const unitWidth = gaps ? (width - (value - 1) * 6) / value : 24;
      return <g key={i}>
        {labels?.[i] ? label(labels[i]!, 150, top - 7) : null}
        <rect x={start} y={top} width={width} height="18" rx="3" className="measure-strip" />
        {units ? Array.from({ length: value }, (_, j) => block(start + j * (unitWidth + (gaps ? 6 : 0)), top + 26, unitWidth, 20, j)) : null}
      </g>;
    });
  } else if (kind === "height") {
    drawing = values.map((value, i) => {
      const x = (i + 1) * 300 / (values.length + 1);
      return <g key={i}>
        <path d={`M${x - 28} 140 H${x + (units ? 50 : 28)}`} className="measure-baseline" />
        <rect x={x - 18} y={140 - value * 12} width="36" height={value * 12} className="measure-strip" />
        {units ? Array.from({ length: value }, (_, j) => block(x + 26, 140 - (j + 1) * 12, 18, 12, j)) : null}
        {labels?.[i] ? label(labels[i]!, x, 158) : null}
      </g>;
    });
  } else if (kind === "mass") {
    height = 180;
    const tilt = Math.sign(values[0]! - values[1]!) * 18;
    const left = 62 + tilt, right = 62 - tilt;
    drawing = <>
      <path d="M150 62 L130 140 H170 Z" className="measure-stand" />
      <path d="M120 144 H180" className="measure-outline" />
      <path d={`M65 ${left} L235 ${right}`} className="measure-outline" />
      {[65, 235].map((x, i) => {
        const beam = i === 0 ? left : right, pan = beam + 34;
        return <g key={x}>
          <path d={`M${x - 35} ${pan} L${x} ${beam} L${x + 35} ${pan}`} className="measure-outline" />
          <path d={`M${x - 35} ${pan} Q${x} ${pan + 18} ${x + 35} ${pan} Z`} className="measure-pan" />
          {units && i === 1 ? Array.from({ length: values[1]! }, (_, j) => block(x - 29 + (j % 4) * 15, pan - 17 * (Math.floor(j / 4) + 1), 14, 16, j)) : <>
            <path d={`M${x - 10} ${pan - 34} Q${x - 28} ${pan - 13} ${x - 18} ${pan} H${x + 18} Q${x + 28} ${pan - 13} ${x + 10} ${pan - 34} Z`} className="measure-bag" />
            <path d={`M${x - 12} ${pan - 34} H${x + 12}`} className="measure-outline" />
          </>}
          {label(units ? (i === 0 ? "Bag" : "Blocks") : labels?.[i] ?? `Bag ${"AB"[i]}`, x, pan + 34)}
        </g>;
      })}
    </>;
  } else if (kind === "capacity") {
    if (units) {
      height = values[0]! > 4 ? 220 : 174;
      drawing = <>
        {cup(120, 10, 60, 72, 4, 0)}
        <path d="M184 22 Q211 22 211 48 Q211 64 184 64" className="measure-outline" />
        {Array.from({ length: values[0]! }, (_, j) => cup((300 - (Math.min(4, values[0]! - Math.floor(j / 4) * 4) * 37 - 12)) / 2 + (j % 4) * 37, 110 + Math.floor(j / 4) * 46, 25, 30, 4, j + 1))}
      </>;
    } else {
      drawing = values.map((value, i) => {
        const x = (i + 1) * 300 / (values.length + 1);
        return <g key={i}>{cup(x - 30, 24, 60, 100, value, i)}{labels?.[i] ? label(labels[i]!, x, 149) : null}</g>;
      });
    }
  } else {
    height = values.length * 48 + 6;
    drawing = values.map((value, i) => <g key={i}>
      <text x="16" y={i * 48 + 30} className="measure-label">{labels?.[i] ?? `Child ${i + 1}`}</text>
      <text x="280" y={i * 48 + 30} textAnchor="end" className="measure-label">{value} seconds</text>
      <path d={`M16 ${i * 48 + 41} H284`} className="measure-baseline" />
    </g>);
  }
  return <span className={`measure-picture${compact ? " is-option" : ""}`}>
    <svg viewBox={`0 0 300 ${height}`} role="img" aria-label={describeMeasure(measure)} focusable="false">{drawing}</svg>
    {kind === "mass" && !units ? <span className="measure-key">{copy.measureLowerPan}</span> : null}
    {kind === "capacity" && units ? <span className="measure-key">{copy.measureCupsFillJug}</span> : null}
  </span>;
}
