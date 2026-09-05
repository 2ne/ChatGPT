import type { CoachPurpose, WorkoutEventType, WorkoutPhase, WorkoutSection } from "../types";
import { coachGapSeconds, hype01 } from "./hype";
import { getVoiceDirection } from "./voiceDirection";

export type CoachLine = {
  text: string;
  purpose: CoachPurpose;
  eventType: WorkoutEventType;
  voiceInstructions: string;
};

function speedWords(speed: number): string {
  const rounded = Math.round(speed);
  if (Math.abs(speed - rounded) < 0.05) return String(rounded);
  return speed.toFixed(1);
}

export function lineForEvent(input: {
  eventType: WorkoutEventType;
  phase: WorkoutPhase;
  current: WorkoutSection;
  next: WorkoutSection | null;
  secondsUntilChange?: number | null;
  hype: number;
  elapsed: number;
  remaining: number;
}): CoachLine | null {
  const { eventType, phase, current, next, secondsUntilChange, hype, elapsed, remaining } = input;
  const upcoming = next?.intensity ?? current.intensity;
  const voice = getVoiceDirection({
    hype,
    phase,
    currentIntensity: current.intensity,
    upcomingIntensity: upcoming,
    eventType,
    secondsUntilChange,
  });

  if (eventType === "phase_start" && phase === "warm-up" && elapsed < 8) {
    return {
      text: hype01(hype) < 0.34
        ? "Easy start. Settle in and find your rhythm."
        : "Good. We are underway. Easy now, and get ready to work.",
      purpose: "instruction",
      eventType,
      voiceInstructions: voice,
    };
  }

  if (eventType === "music_build" || (eventType === "speed_warning" && (secondsUntilChange ?? 99) > 16)) {
    if (!next) return null;
    return {
      text: next.phase === "recovery"
        ? "Thirty seconds. Then we bring it back."
        : "Thirty seconds. We go again.",
      purpose: "preparation",
      eventType: "music_build",
      voiceInstructions: voice,
    };
  }

  if (eventType === "speed_warning") {
    if (!next) return null;
    return {
      text: next.phase === "recovery" ? "Ten seconds. Then easier." : "Ten seconds. Hold your form.",
      purpose: "preparation",
      eventType,
      voiceInstructions: voice,
    };
  }

  if (eventType === "speed_change" || eventType === "phase_start") {
    if (phase === "recovery") {
      return {
        text: "Bring it back now. Nice and easy.",
        purpose: "instruction",
        eventType: "recovery",
        voiceInstructions: getVoiceDirection({
          hype,
          phase: "recovery",
          currentIntensity: current.intensity,
          upcomingIntensity: current.intensity,
          eventType: "recovery",
        }),
      };
    }
    if (phase === "peak") {
      return {
        text: `Go. ${speedWords(current.speedKph)} kilometres an hour.`,
        purpose: "instruction",
        eventType: "peak",
        voiceInstructions: getVoiceDirection({
          hype,
          phase: "peak",
          currentIntensity: current.intensity,
          upcomingIntensity: current.intensity,
          eventType: "peak",
        }),
      };
    }
    if (phase === "hard") {
      return {
        text: `Here we go. Take it to ${speedWords(current.speedKph)}.`,
        purpose: "instruction",
        eventType: "speed_change",
        voiceInstructions: voice,
      };
    }
    if (phase === "cool-down") {
      return {
        text: "Last stretch. Easy now. You have done the work.",
        purpose: "reassurance",
        eventType: "coach",
        voiceInstructions: voice,
      };
    }
    if (phase === "build") {
      return {
        text: "Building now. Stay smooth.",
        purpose: "preparation",
        eventType: "phase_start",
        voiceInstructions: voice,
      };
    }
  }

  if (eventType === "recovery") {
    return {
      text: "Let your breathing settle.",
      purpose: "reassurance",
      eventType: "recovery",
      voiceInstructions: voice,
    };
  }

  if (eventType === "coach" && phase === "hard") {
    const held = elapsed - current.start;
    if (held > 18 && remaining > 28) {
      return {
        text: "Stay with it. Thirty seconds.",
        purpose: "motivation",
        eventType,
        voiceInstructions: voice,
      };
    }
    if (current.end - elapsed <= 12) {
      return {
        text: "Ten seconds. Hold it.",
        purpose: "motivation",
        eventType,
        voiceInstructions: voice,
      };
    }
    return {
      text: "Good. Keep pushing.",
      purpose: "motivation",
      eventType,
      voiceInstructions: voice,
    };
  }

  if (eventType === "coach" && phase === "warm-up" && elapsed > 40) {
    return {
      text: "Still easy. Use this to get loose.",
      purpose: "reassurance",
      eventType,
      voiceInstructions: voice,
    };
  }

  if (eventType === "coach" && remaining <= 20 && phase === "cool-down") {
    return {
      text: "Session done. Walk it out.",
      purpose: "milestone",
      eventType,
      voiceInstructions: voice,
    };
  }

  return null;
}

export function canSpeakNonCritical(
  lastCoachAt: number | null,
  elapsed: number,
  hype: number,
  purpose: CoachPurpose,
): boolean {
  if (purpose === "instruction" || purpose === "preparation") return true;
  if (lastCoachAt == null) return true;
  const gap = elapsed - lastCoachAt;
  return gap >= coachGapSeconds(hype).min;
}
