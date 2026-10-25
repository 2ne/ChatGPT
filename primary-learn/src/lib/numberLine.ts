import type { NumberLineAsset } from "../types/activity";

/** Visible stretch of a 0 to 100 line. Shorter lines keep their written start and end. */
export function visibleNumberLine(line: NumberLineAsset): { start: number; end: number } {
  if (line.start !== 0 || line.end !== 100) {
    return { start: line.start, end: line.end };
  }
  const points = line.flags?.length ? line.flags.map((flag) => flag.at) : [line.marked ?? 0];
  const lo = Math.min(...points);
  const hi = Math.max(...points);
  if (line.flags?.length) {
    if (hi <= 50) return { start: 0, end: 50 };
    const start = Math.max(50, Math.floor(lo / 10) * 10 - 20);
    const end = Math.min(100, Math.ceil(hi / 10) * 10 + 20);
    return { start, end };
  }
  return (line.marked ?? 0) >= 50 ? { start: 50, end: 100 } : { start: 0, end: 50 };
}
