export function formatClock(totalSeconds: number): string {
  const safe = Math.max(0, Math.round(totalSeconds));
  const minutes = Math.floor(safe / 60);
  const seconds = safe % 60;
  return `${minutes}:${seconds.toString().padStart(2, "0")}`;
}

export function formatSpeed(speed: number): string {
  return speed.toFixed(1);
}

export function formatPhase(phase: string): string {
  return phase.replace("-", " ");
}
