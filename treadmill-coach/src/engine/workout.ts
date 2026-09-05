import type { HypeLevel, WorkoutPhase, WorkoutPlan, WorkoutSection } from "../types";
import { clamp, hype01, hypeLevel, interpolate } from "./hype";

function section(
  id: string,
  phase: WorkoutPhase,
  start: number,
  duration: number,
  speedKph: number,
  label: string,
): WorkoutSection {
  const intensity = intensityFrom(phase, speedKph);
  return {
    id,
    phase,
    start,
    end: start + duration,
    speedKph,
    intensity,
    label,
  };
}

export function intensityFrom(phase: WorkoutPhase, speedKph: number): number {
  const speedComponent = clamp((speedKph - 5) / 7);
  const phaseComponent =
    phase === "warm-up"
      ? 0.28
      : phase === "build"
        ? 0.56
        : phase === "hard"
          ? 0.78
          : phase === "recovery"
            ? 0.3
            : phase === "peak"
              ? 0.94
              : 0.2;
  return clamp(phaseComponent * 0.7 + speedComponent * 0.3);
}

export function generateWorkout(hype: number, durationMinutes: number): WorkoutPlan {
  const level = hypeLevel(hype);
  const t = hype01(hype);
  const total = durationMinutes * 60;

  const warm = interpolate(240, 105, t);
  const cool = interpolate(180, 90, t);
  const build = interpolate(40, 22, t);
  const hard = interpolate(150, 70, t);
  const recover = interpolate(150, 70, t);
  const peak = interpolate(70, 45, t);

  const easySpeed = interpolate(5.5, 6.0, t);
  const buildSpeed = interpolate(6.4, 7.2, t);
  const hardSpeed = interpolate(8.2, 9.4, t);
  const recoverSpeed = interpolate(5.6, 6.2, t);
  const peakSpeed = interpolate(9.6, 11.2, t);
  const secondHard = hardSpeed + interpolate(0.4, 0.8, t);

  const sections: WorkoutSection[] = [];
  let cursor = 0;
  let index = 0;

  const push = (
    phase: WorkoutPhase,
    duration: number,
    speed: number,
    label: string,
  ) => {
    const clipped = Math.max(18, Math.min(duration, total - cursor - 12));
    if (clipped < 18 || cursor >= total - 12) return;
    sections.push(section(`${phase}-${index++}`, phase, cursor, clipped, roundSpeed(speed), label));
    cursor += clipped;
  };

  push("warm-up", warm * 0.62, easySpeed, "Easy opening");
  if (level === "relaxed") {
    push("warm-up", Math.max(70, warm * 0.38), easySpeed, "Keep it easy");
  }

  const remainingForWork = Math.max(0, total - cursor - cool - peak);
  const cycle = build + hard + recover;
  const cycles = Math.max(1, Math.min(level === "relaxed" ? 2 : level === "balanced" ? 3 : 4, Math.floor(remainingForWork / cycle)));

  for (let cycleIndex = 0; cycleIndex < cycles; cycleIndex += 1) {
    const effort = cycleIndex === 0 ? hardSpeed : secondHard;
    push("build", build, buildSpeed, cycleIndex === 0 ? "First lift" : "Build again");
    push("hard", hard, effort, cycleIndex === 0 ? "Hold the pace" : "Stronger interval");
    if (cycleIndex < cycles - 1 || remainingForWork - (cycleIndex + 1) * cycle > 40) {
      push("recovery", recover, recoverSpeed, "Settle");
    }
  }

  push("build", build, buildSpeed + 0.3, "Last build");
  push("peak", peak, peakSpeed, "Peak effort");
  push("cool-down", Math.max(cool, total - cursor), interpolate(5.2, 5.6, 1 - t), "Bring it home");

  if (sections.length > 0) {
    const last = sections[sections.length - 1];
    last.end = total;
  }

  return {
    duration: total,
    hype,
    hypeLevel: level,
    sections,
  };
}

export function sectionAtTime(plan: WorkoutPlan, elapsed: number): WorkoutSection {
  return (
    plan.sections.find((section) => elapsed >= section.start && elapsed < section.end) ??
    plan.sections[plan.sections.length - 1]
  );
}

export function nextSectionAt(plan: WorkoutPlan, elapsed: number): WorkoutSection | null {
  const current = sectionAtTime(plan, elapsed);
  const index = plan.sections.findIndex((section) => section.id === current.id);
  return plan.sections[index + 1] ?? null;
}

export function workoutLabel(level: HypeLevel): string {
  if (level === "relaxed") return "Relaxed";
  if (level === "hyped") return "Hyped";
  return "Balanced";
}

function roundSpeed(speed: number): number {
  return Math.round(speed * 10) / 10;
}
