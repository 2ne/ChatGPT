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

function hopStarts(from: number, step: number, marked: number): number[] {
  const starts: number[] = [];
  for (let value = from; value < marked; value += step) starts.push(value);
  return starts;
}

/** Labels the child can read. Skip-count hops only name 0 and the end, never the mark. */
function shownLabels(
  view: { start: number; end: number },
  hundred: boolean,
  labelEvery: number,
  marked: number | undefined,
  withHops: boolean,
): Set<number> {
  if (withHops) {
    return new Set([view.start, view.end].filter((value) => value !== marked));
  }
  const labels = new Set<number>();
  for (let value = view.start; value <= view.end; value += 1) {
    const major = hundred ? value % 10 === 0 : value % labelEvery === 0;
    if (major && value !== marked) labels.add(value);
  }
  return labels;
}

function lineAria(line: NumberLineAsset): string {
  const base = describeNumberLine(line);
  if (!line.jumps || line.marked == null) return base;
  const from = line.jumps.from ?? 0;
  return `${base} Hops of ${line.jumps.step} from ${from} to the mark.`;
}

export function NumberLine({ line }: { line: NumberLineAsset }) {
  const view = visibleNumberLine(line);
  const hundred = line.start === 0 && line.end === 100;
  const labelEvery = hundred ? 10 : line.end === 20 ? 5 : 1;
  const ticks: number[] = [];
  for (let n = view.start; n <= view.end; n += 1) ticks.push(n);
  const flags = line.flags ?? [];
  const marked = line.marked;
  const jumps = line.jumps;
  const hopFrom = jumps?.from ?? 0;
  const hops =
    jumps && marked != null ? hopStarts(hopFrom, jumps.step, marked) : [];
  const tall = flags.length > 0;
  const withHops = Boolean(jumps);
  const labels = shownLabels(view, hundred, labelEvery, marked, withHops);
  const height = tall ? 132 : withHops ? 128 : 112;
  const axisY = tall ? 68 : withHops ? 64 : 52;
  return (
    <svg
      className="number-line"
      viewBox={`0 0 ${WIDTH} ${height}`}
      role="img"
      aria-label={lineAria(line)}
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
      {hops.map((start) => {
        const x1 = xAt(start, view.start, view.end);
        const x2 = xAt(start + (jumps?.step ?? 0), view.start, view.end);
        const mid = (x1 + x2) / 2;
        return (
          <path
            key={`hop-${start}`}
            className="number-line-hop"
            d={`M ${x1} ${axisY} Q ${mid} ${axisY - 18} ${x2} ${axisY}`}
          />
        );
      })}
      {ticks.map((value) => {
        const x = xAt(value, view.start, view.end);
        const isMark = marked === value;
        const kind = tickKind(value, hundred, labelEvery);
        const up = isMark ? 10 : kind === "major" ? 8 : kind === "mid" ? 6 : 4;
        const showLabel = labels.has(value);
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
            y={withHops ? axisY - 36 : axisY - 28}
            textAnchor="middle"
            fill="var(--primary-deep)"
          >
            ?
          </text>
          <path
            d={`M ${xAt(marked, view.start, view.end) - 6} ${withHops ? axisY - 28 : axisY - 20} L ${xAt(marked, view.start, view.end) + 6} ${withHops ? axisY - 28 : axisY - 20} L ${xAt(marked, view.start, view.end)} ${withHops ? axisY - 20 : axisY - 12} Z`}
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
