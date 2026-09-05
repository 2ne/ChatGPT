import type { WorkoutPhase } from "../types";
import { clamp, hype01, interpolate } from "./hype";

const PHASE_ENERGY: Record<WorkoutPhase, number> = {
  "warm-up": 0.30,
  build: 0.58,
  hard: 0.76,
  recovery: 0.28,
  peak: 0.92,
  "cool-down": 0.20,
};

export function getTargetMusicEnergy(input: {
  workoutIntensity: number;
  phase: WorkoutPhase;
  hype: number;
  upcomingIntensity?: number | null;
  secondsUntilUpcoming?: number | null;
}): number {
  const spread = interpolate(0.72, 1.18, hype01(input.hype));
  const mid = 0.46;
  const phaseEnergy = mid + (PHASE_ENERGY[input.phase] - mid) * spread;
  const intensityEnergy = mid + (input.workoutIntensity - mid) * spread;
  let target = phaseEnergy * 0.68 + intensityEnergy * 0.32;

  const upcoming = input.upcomingIntensity;
  const until = input.secondsUntilUpcoming;
  if (upcoming != null && until != null && until > 0 && until <= 40) {
    const upcomingEnergy = mid + (upcoming - mid) * spread;
    const blend =
      until <= 8 ? 0.72 : until <= 18 ? 0.46 : until <= 30 ? 0.22 : 0.1;
    target = interpolate(target, upcomingEnergy, blend);
  }

  if (input.phase === "warm-up") {
    target = Math.min(target, interpolate(0.42, 0.52, hype01(input.hype)));
  }

  if (input.phase === "recovery") {
    target = Math.min(target, interpolate(0.38, 0.46, hype01(input.hype)));
  }

  return clamp(target);
}
