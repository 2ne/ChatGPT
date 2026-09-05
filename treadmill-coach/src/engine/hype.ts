import type { HypeLevel } from "../types";

export function clamp(value: number, min = 0, max = 1): number {
  return Math.min(max, Math.max(min, value));
}

export function hypeLevel(hype: number): HypeLevel {
  if (hype < 34) return "relaxed";
  if (hype < 67) return "balanced";
  return "hyped";
}

export function hype01(hype: number): number {
  return clamp(hype / 100);
}

export function interpolate(from: number, to: number, amount: number): number {
  return from + (to - from) * clamp(amount);
}

export function minTrackListenSeconds(hype: number): number {
  const t = hype01(hype);
  return interpolate(165, 105, t);
}

export function preferredTrackListenSeconds(hype: number): number {
  const t = hype01(hype);
  return interpolate(210, 150, t);
}

export function coachGapSeconds(hype: number): { min: number; max: number } {
  const t = hype01(hype);
  return {
    min: interpolate(75, 30, t),
    max: interpolate(90, 45, t),
  };
}

export function materialIntensityDelta(hype: number): number {
  return interpolate(0.18, 0.12, hype01(hype));
}

export function materialSpeedDelta(hype: number): number {
  return interpolate(1.1, 0.75, hype01(hype));
}
