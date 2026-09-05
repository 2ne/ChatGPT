import type { MusicState, SectionType, Track, TrackSection } from "../types";

export function sectionAt(track: Track, position: number): TrackSection {
  return (
    track.sections.find((section) => position >= section.start && position < section.end) ??
    track.sections[track.sections.length - 1]
  );
}

export function upcomingSections(track: Track, position: number): TrackSection[] {
  return track.sections.filter((section) => section.end > position);
}

export function timeRemaining(track: Track, position: number): number {
  return Math.max(0, track.duration - position);
}

export function musicStateFrom(track: Track, position: number): MusicState {
  const section = sectionAt(track, position);
  const progress = (position - section.start) / Math.max(0.01, section.end - section.start);
  const currentEnergy = section.energy * (0.92 + progress * 0.08);
  return {
    trackId: track.id,
    trackPosition: position,
    sectionType: section.type,
    sectionEnergy: section.energy,
    currentEnergy,
  };
}

export function sectionSupportsEnergy(
  sectionType: SectionType,
  targetEnergy: number,
): boolean {
  if (targetEnergy >= 0.72) {
    return sectionType === "chorus" || sectionType === "drop" || sectionType === "build";
  }
  if (targetEnergy <= 0.38) {
    return sectionType === "verse" || sectionType === "intro" || sectionType === "breakdown" || sectionType === "outro";
  }
  return sectionType !== "outro" && sectionType !== "drop";
}

export function usefulLiftSection(sectionType: SectionType): boolean {
  return sectionType === "build" || sectionType === "chorus" || sectionType === "drop";
}

export function usefulEaseSection(sectionType: SectionType): boolean {
  return sectionType === "verse" || sectionType === "breakdown" || sectionType === "outro" || sectionType === "intro";
}
