import type { WorkoutEvent, WorkoutPlan } from "../types";
import { isMaterialWorkoutChange } from "./shouldChangeTrack";
import { lineForEvent } from "./coaching";

export function buildMasterTimeline(plan: WorkoutPlan): WorkoutEvent[] {
  const events: WorkoutEvent[] = [];

  plan.sections.forEach((section, index) => {
    const next = plan.sections[index + 1] ?? null;
    const material = isMaterialWorkoutChange(section, next, plan.hype);

    events.push({
      id: `phase-${section.id}`,
      timestamp: section.start,
      type: section.start === 0 ? "phase_start" : "speed_change",
      phase: section.phase,
      speedKph: section.speedKph,
      nextSpeedKph: next?.speedKph,
      intensity: section.intensity,
      upcomingIntensity: next?.intensity,
    });

    if (section.phase === "recovery") {
      events.push({
        id: `recovery-${section.id}`,
        timestamp: section.start,
        type: "recovery",
        phase: section.phase,
        speedKph: section.speedKph,
        intensity: section.intensity,
        upcomingIntensity: next?.intensity,
      });
    }

    if (section.phase === "peak") {
      events.push({
        id: `peak-${section.id}`,
        timestamp: section.start,
        type: "peak",
        phase: section.phase,
        speedKph: section.speedKph,
        intensity: section.intensity,
      });
    }

    if (next && material) {
      const warningAt = Math.max(section.start + 8, next.start - 10);
      const buildAt = Math.max(section.start + 6, next.start - 30);
      if (buildAt < warningAt - 6) {
        events.push({
          id: `build-${section.id}`,
          timestamp: buildAt,
          type: "music_build",
          phase: section.phase,
          speedKph: section.speedKph,
          nextSpeedKph: next.speedKph,
          intensity: section.intensity,
          upcomingIntensity: next.intensity,
        });
      }
      events.push({
        id: `warn-${section.id}`,
        timestamp: warningAt,
        type: "speed_warning",
        phase: section.phase,
        speedKph: section.speedKph,
        nextSpeedKph: next.speedKph,
        intensity: section.intensity,
        upcomingIntensity: next.intensity,
      });
    }

    if (section.phase === "hard" && section.end - section.start >= 50) {
      events.push({
        id: `hold-${section.id}`,
        timestamp: section.start + Math.min(32, (section.end - section.start) / 2),
        type: "coach",
        purpose: "motivation",
        phase: section.phase,
        speedKph: section.speedKph,
        intensity: section.intensity,
        upcomingIntensity: next?.intensity,
      });
    }

    if (section.phase === "warm-up" && section.end - section.start >= 90) {
      events.push({
        id: `wu-check-${section.id}`,
        timestamp: section.start + 55,
        type: "coach",
        purpose: "reassurance",
        phase: section.phase,
        speedKph: section.speedKph,
        intensity: section.intensity,
        upcomingIntensity: next?.intensity,
      });
    }
  });

  return events
    .map((event) => {
      const current =
        plan.sections.find((section) => event.timestamp >= section.start && event.timestamp < section.end) ??
        plan.sections[0];
      const next =
        plan.sections.find((section) => section.start > event.timestamp) ??
        plan.sections[plan.sections.findIndex((section) => section.id === current.id) + 1] ??
        null;
      const line = lineForEvent({
        eventType: event.type,
        phase: event.phase,
        current,
        next,
        secondsUntilChange: next ? next.start - event.timestamp : null,
        hype: plan.hype,
        elapsed: event.timestamp,
        remaining: plan.duration - event.timestamp,
      });
      return {
        ...event,
        purpose: line?.purpose ?? event.purpose,
        text: line?.text,
        voiceInstructions: line?.voiceInstructions,
      };
    })
    .sort((a, b) => a.timestamp - b.timestamp || a.id.localeCompare(b.id));
}

export function alignEvent(events: WorkoutEvent[], eventId: string, timestamp: number): WorkoutEvent[] {
  return events
    .map((event) => (event.id === eventId ? { ...event, timestamp } : event))
    .sort((a, b) => a.timestamp - b.timestamp);
}
