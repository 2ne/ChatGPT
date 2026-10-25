import type { NumberLineAsset } from "../../types/activity";
import { describeNumberLine } from "../../data/objects";
import { visibleNumberLine } from "../../lib/numberLine";

const WIDTH = 400;
const PAD = 24;

function xAt(value: number, start: number, end: number) {
  return PAD + ((value - start) / (end - start)) * (WIDTH - PAD * 2);
}

function tickKind(value: number, hundred: boolean, labelEvery: number): "major" | "mid" | "minor" {
  if (hundred) {
    if (value % 10 === 0) return "major";
    if (value % 5 === 0) return "mid";
    return "minor";
  }
  return value % labelEvery === 0 ? "major" : "minor";
}

export function NumberLine({ line }: { line: NumberLineAsset }) {
  const view = visibleNumberLine(line);
  const hundred = line.start === 0 && line.end === 100;
  const labelEvery = hundred ? 10 : line.end === 20 ? 5 : 1;
  const ticks: number[] = [];
  for (let n = view.start; n <= view.end; n += 1) ticks.push(n);
  const flags = line.flags ?? [];
  const marked = line.marked;
  const tall = flags.length > 0;
  const height = tall ? 132 : 112;
  const axisY = tall ? 68 : 52;
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
        const x = xAt(value, view.start, view.end);
        const isMark = marked === value;
        const kind = tickKind(value, hundred, labelEvery);
        const up = isMark ? 10 : kind === "major" ? 8 : kind === "mid" ? 6 : 4;
        const showLabel = kind === "major" && marked !== value;
        return (
          <g key={`t-${value}`}>
            <line
              x1={x}
              x2={x}
              y1={axisY - up}
              y2={axisY + 8}
              stroke={isMark ? "var(--primary)" : "var(--ink-soft)"}
              strokeWidth={isMark || kind === "major" ? 3 : 2}
              strokeLinecap="round"
            />
            {showLabel ? (
              <text
                className="number-line-label"
                x={x}
                y={axisY + 28}
                textAnchor="middle"
                fill="var(--ink)"
              >
                {value}
              </text>
            ) : null}
          </g>
        );
      })}
      {marked != null && marked >= view.start && marked <= view.end ? (
        <g>
          {ticks.includes(marked) ? null : (
            <line
              x1={xAt(marked, view.start, view.end)}
              x2={xAt(marked, view.start, view.end)}
              y1={axisY - 10}
              y2={axisY + 8}
              stroke="var(--primary)"
              strokeWidth="3"
              strokeLinecap="round"
            />
          )}
          <text
            className="number-line-mark"
            x={xAt(marked, view.start, view.end)}
            y={axisY - 28}
            textAnchor="middle"
            fill="var(--primary-deep)"
          >
            ?
          </text>
          <path
            d={`M ${xAt(marked, view.start, view.end) - 6} ${axisY - 20} L ${xAt(marked, view.start, view.end) + 6} ${axisY - 20} L ${xAt(marked, view.start, view.end)} ${axisY - 12} Z`}
            fill="var(--primary)"
          />
        </g>
      ) : null}
      {flags.map((flag) => {
        const x = xAt(flag.at, view.start, view.end);
        return (
          <g key={flag.letter} aria-hidden>
            <line x1={x} x2={x} y1={22} y2={axisY} stroke="var(--ink)" strokeWidth="2" />
            <path
              d={`M ${x} 10 L ${x + 16} 16 L ${x} 22 Z`}
              fill="var(--primary-soft)"
              stroke="var(--primary)"
              strokeWidth="1.5"
            />
            <text className="number-line-flag" x={x + 6} y={19} textAnchor="middle" fill="var(--ink)">
              {flag.letter}
            </text>
          </g>
        );
      })}
    </svg>
  );
}
