import type { ClockAsset } from "../types/activity";

export function clockLabel(clock: ClockAsset): string {
  return clock.minute === 30 ? `Half past ${clock.hour}` : `${clock.hour} o'clock`;
}
export function isClockAnswer(answer: unknown): answer is ClockAsset {
  if (!answer || typeof answer !== "object") return false;
  const value = answer as ClockAsset;
  return Number.isInteger(value.hour) && value.hour >= 1 && value.hour <= 12 && (value.minute === 0 || value.minute === 30);
}
