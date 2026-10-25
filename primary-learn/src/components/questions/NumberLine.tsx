import type { NumberLineAsset } from "../../types/activity";
import { describeNumberLine } from "../../data/objects";

const WIDTH = 360;
const PAD = 18;
const INNER = WIDTH - PAD * 2;

function xAt(value: number, start: number, end: number) {
  return PAD + ((value - start) / (end - start)) * INNER;
}

export function NumberLine({ line }: { line: NumberLineAsset }) {
  const scale = line.scale ?? (line.end <= 20 ? "ones" : "tens");
  const step = scale === "tens" ? 10 : 1;
  const ticks: number[] = [];
  for (let n = line.start; n <= line.end; n += step) ticks.push(n);
  const flags = line.flags ?? [];
  const tall = flags.length > 0;
  const height = tall ? 118 : 92;
  const axisY = tall ? 52 : 36;
  const labelEvery = line.end === 20 ? 5 : step;
  return (
    <svg
      className="number-line"
      viewBox={`0 0 ${WIDTH} ${height}`}
      role="img"
      aria-label={describeNumberLine(line)}
    >
      <line
        x1={PAD}
        y1={axisY}
        x2={WIDTH - PAD}
        y2={axisY}
        stroke="var(--ink-soft)"
        strokeWidth="3"
        strokeLinecap="round"
      />
      {ticks.map((value) => {
        const x = xAt(value, line.start, line.end);
        const marked = line.marked === value;
        const major = value % labelEvery === 0 || marked;
        return (
          <g key={`t-${value}`}>
            <line
              x1={x}
              x2={x}
              y1={marked ? axisY - 12 : major ? axisY - 8 : axisY - 5}
              y2={axisY + 8}
              stroke={marked ? "var(--primary)" : "var(--ink-soft)"}
              strokeWidth={marked ? 4 : 3}
              strokeLinecap="round"
            />
            {major ? (
              <text
                className="number-line-label"
                x={x}
                y={axisY + 26}
                textAnchor="middle"
                fill={marked ? "var(--primary-deep)" : "var(--ink)"}
              >
                {marked ? "?" : value}
              </text>
            ) : null}
            {marked ? <path d={`M ${x - 5} ${axisY - 22} L ${x + 5} ${axisY - 22} L ${x} ${axisY - 14} Z`} fill="var(--primary)" /> : null}
          </g>
        );
      })}
      {line.marked != null && !ticks.includes(line.marked) ? (
        <g>
          <line
            x1={xAt(line.marked, line.start, line.end)}
            x2={xAt(line.marked, line.start, line.end)}
            y1={axisY - 12}
            y2={axisY + 8}
            stroke="var(--primary)"
            strokeWidth="4"
            strokeLinecap="round"
          />
          <path
            d={`M ${xAt(line.marked, line.start, line.end) - 5} ${axisY - 22} L ${xAt(line.marked, line.start, line.end) + 5} ${axisY - 22} L ${xAt(line.marked, line.start, line.end)} ${axisY - 14} Z`}
            fill="var(--primary)"
          />
          <text
            className="number-line-label"
            x={xAt(line.marked, line.start, line.end)}
            y={axisY + 26}
            textAnchor="middle"
            fill="var(--primary-deep)"
          >
            ?
          </text>
        </g>
      ) : null}
      {flags.map((flag) => {
        const x = xAt(flag.at, line.start, line.end);
        return (
          <g key={flag.letter} aria-hidden>
            <line x1={x} x2={x} y1={18} y2={axisY} stroke="var(--ink)" strokeWidth="2" />
            <path d={`M ${x} 8 L ${x + 16} 14 L ${x} 20 Z`} fill="var(--primary-soft)" stroke="var(--primary)" strokeWidth="1.5" />
            <text className="number-line-flag" x={x + 6} y={17} textAnchor="middle" fill="var(--ink)">
              {flag.letter}
            </text>
          </g>
        );
      })}
    </svg>
  );
}
