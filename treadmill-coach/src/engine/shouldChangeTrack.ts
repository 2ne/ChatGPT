import type {
  MusicDecision,
  ShouldChangeTrackInput,
  Track,
  TrackSection,
  TransitionReason,
  WorkoutSection,
} from "../types";
import {
  hype01,
  materialIntensityDelta,
  materialSpeedDelta,
  minTrackListenSeconds,
} from "./hype";
import {
  musicStateFrom,
  sectionSupportsEnergy,
  timeRemaining,
  upcomingSections,
  usefulEaseSection,
  usefulLiftSection,
} from "./tracks";

const ENDING_SOON = 14;
const ALIGN_WINDOW = 36;

export function intensityGap(current: WorkoutSection, next: WorkoutSection | null): number {
  if (!next) return 0;
  return Math.abs(next.intensity - current.intensity);
}

export function speedGap(current: WorkoutSection, next: WorkoutSection | null): number {
  if (!next) return 0;
  return Math.abs(next.speedKph - current.speedKph);
}

export function isMaterialWorkoutChange(
  current: WorkoutSection,
  next: WorkoutSection | null,
  hype: number,
): boolean {
  if (!next) return false;
  return (
    intensityGap(current, next) >= materialIntensityDelta(hype) ||
    speedGap(current, next) >= materialSpeedDelta(hype)
  );
}

export function findSupportiveSection(
  track: Track,
  position: number,
  next: WorkoutSection | null,
  timeUntilNextSection: number,
  targetEnergy: number,
): TrackSection | null {
  const windowEnd = position + Math.min(ALIGN_WINDOW, Math.max(8, timeUntilNextSection + 8));
  const wantedLift = next != null && next.intensity - targetEnergy > -0.05 && next.intensity >= 0.62;
  const wantedEase = next != null && next.intensity <= 0.42;

  return (
    upcomingSections(track, position).find((section) => {
      if (section.start > windowEnd) return false;
      if (section.end <= position + 4) return false;
      if (wantedLift) return usefulLiftSection(section.type);
      if (wantedEase) return usefulEaseSection(section.type);
      return sectionSupportsEnergy(section.type, targetEnergy);
    }) ?? null
  );
}

export function isClearlyUnsuitable(
  track: Track,
  position: number,
  current: WorkoutSection,
  next: WorkoutSection | null,
  timeUntilNextSection: number,
  targetEnergy: number,
): boolean {
  const state = musicStateFrom(track, position);
  const remaining = timeRemaining(track, position);
  if (remaining <= ENDING_SOON && state.sectionType === "outro") return true;

  if (current.phase === "recovery" || current.phase === "cool-down") {
    return (
      (state.sectionType === "drop" || state.sectionType === "chorus") &&
      state.sectionEnergy - targetEnergy > 0.34 &&
      !findSupportiveSection(track, position, next, timeUntilNextSection, targetEnergy)
    );
  }

  if (current.phase === "peak" || current.phase === "hard") {
    return (
      (state.sectionType === "outro" || state.sectionType === "intro") &&
      targetEnergy - state.sectionEnergy > 0.28 &&
      !findSupportiveSection(track, position, next, timeUntilNextSection, targetEnergy)
    );
  }

  return false;
}

export function shouldChangeTrack(input: ShouldChangeTrackInput): MusicDecision {
  const {
    currentTrack,
    currentTrackPosition,
    currentWorkoutSection,
    nextWorkoutSection,
    timeUntilNextSection,
    hype,
    listenedFor,
    targetEnergy,
  } = input;

  const state = musicStateFrom(currentTrack, currentTrackPosition);
  const remaining = timeRemaining(currentTrack, currentTrackPosition);
  const upcomingSpeed = nextWorkoutSection?.speedKph ?? null;
  const materialChange = isMaterialWorkoutChange(
    currentWorkoutSection,
    nextWorkoutSection,
    hype,
  );
  const supportive = findSupportiveSection(
    currentTrack,
    currentTrackPosition,
    nextWorkoutSection,
    timeUntilNextSection,
    targetEnergy,
  );
  const unsuitable = isClearlyUnsuitable(
    currentTrack,
    currentTrackPosition,
    currentWorkoutSection,
    nextWorkoutSection,
    timeUntilNextSection,
    targetEnergy,
  );
  const ending = remaining <= ENDING_SOON;
  const minListen = minTrackListenSeconds(hype);
  const samePace =
    !materialChange &&
    (nextWorkoutSection == null ||
      Math.abs(nextWorkoutSection.speedKph - currentWorkoutSection.speedKph) < 0.35);

  const base = {
    considered: true,
    accepted: false,
    reason: "continuity_preferred" as TransitionReason,
    currentTrackId: currentTrack.id,
    currentTrackPosition,
    currentSection: state.sectionType,
    currentEnergy: state.currentEnergy,
    targetEnergy,
    treadmillSpeed: currentWorkoutSection.speedKph,
    upcomingTreadmillSpeed: upcomingSpeed,
    timeUntilSpeedChange: nextWorkoutSection ? timeUntilNextSection : null,
    keepSection: supportive?.type,
  };

  if (ending) {
    return { ...base, accepted: true, reason: "track_ending" };
  }

  if (samePace && !unsuitable) {
    return base;
  }

  if (supportive && materialChange) {
    return base;
  }

  if (!unsuitable && listenedFor < minListen && !ending) {
    return base;
  }

  if (unsuitable) {
    return { ...base, accepted: true, reason: "unsuitable_section", keepSection: undefined };
  }

  if (materialChange && !supportive) {
    const next = nextWorkoutSection;
    if (next?.phase === "recovery") {
      return { ...base, accepted: true, reason: "recovery_transition" };
    }
    if (next?.phase === "peak" || currentWorkoutSection.phase === "peak") {
      return { ...base, accepted: true, reason: "peak_transition" };
    }
    if (intensityGap(currentWorkoutSection, next) >= 0.28 || speedGap(currentWorkoutSection, next) >= 1.8) {
      return { ...base, accepted: true, reason: "large_intensity_change" };
    }
    if (
      hype01(hype) >= 0.72 &&
      next &&
      next.phase === "hard" &&
      targetEnergy - state.currentEnergy > 0.22
    ) {
      return { ...base, accepted: true, reason: "better_upcoming_drop" };
    }
  }

  return base;
}

export function chooseReplacementTrack(input: {
  tracks: Track[];
  currentTrackId: string;
  targetEnergy: number;
  nextPhase: WorkoutSection | null;
  reason: TransitionReason;
}): Track | null {
  const candidates = input.tracks.filter((track) => track.id !== input.currentTrackId);
  if (candidates.length === 0) return null;

  const scored = candidates.map((track) => {
    const opening = track.sections.slice(0, 4);
    const hasDrop = opening.some((section) => section.type === "drop" || section.type === "chorus");
    const hasEase = opening.some((section) => usefulEaseSection(section.type));
    const openingEnergy =
      opening.reduce((sum, section) => sum + section.energy, 0) / Math.max(1, opening.length);
    const energyScore = 1 - Math.abs(openingEnergy - input.targetEnergy);
    let bonus = 0;
    if (input.reason === "peak_transition" && hasDrop) bonus += 0.28;
    if (input.reason === "better_upcoming_drop" && hasDrop) bonus += 0.3;
    if (input.reason === "recovery_transition" && hasEase) bonus += 0.28;
    if (input.nextPhase?.phase === "hard" && hasDrop) bonus += 0.12;
    return { track, score: energyScore + bonus };
  });

  scored.sort((a, b) => b.score - a.score);
  const best = scored[0];
  if (!best) return null;
  if (best.score < 0.55) return null;
  return best.track;
}

export function seekOffsetForTransition(track: Track, targetEnergy: number): number {
  const useful = track.sections.find((section) => {
    if (targetEnergy >= 0.68) return usefulLiftSection(section.type) && section.start < 48;
    if (targetEnergy <= 0.4) return usefulEaseSection(section.type) && section.start < 40;
    return section.type === "verse" && section.start < 36;
  });
  return useful?.start ?? 0;
}
