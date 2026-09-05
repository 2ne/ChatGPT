import type { Track, TrackSection } from "../types";

type CatalogDraft = {
  id: string;
  title: string;
  bpm: number;
  baseEnergy: number;
  sections: Array<Omit<TrackSection, "start" | "end"> & { bars: number }>;
};

const DRAFTS: CatalogDraft[] = [
  {
    id: "easy-miles",
    title: "Easy Miles",
    bpm: 96,
    baseEnergy: 0.31,
    sections: [
      { type: "intro", bars: 8, energy: 0.22 },
      { type: "verse", bars: 20, energy: 0.3 },
      { type: "chorus", bars: 12, energy: 0.4 },
      { type: "verse", bars: 16, energy: 0.32 },
      { type: "chorus", bars: 12, energy: 0.42 },
      { type: "outro", bars: 8, energy: 0.2 },
    ],
  },
  {
    id: "steady-horizon",
    title: "Steady Horizon",
    bpm: 108,
    baseEnergy: 0.43,
    sections: [
      { type: "intro", bars: 8, energy: 0.28 },
      { type: "verse", bars: 16, energy: 0.4 },
      { type: "build", bars: 8, energy: 0.5 },
      { type: "chorus", bars: 16, energy: 0.58 },
      { type: "verse", bars: 16, energy: 0.42 },
      { type: "chorus", bars: 12, energy: 0.56 },
      { type: "outro", bars: 8, energy: 0.26 },
    ],
  },
  {
    id: "rising-cadence",
    title: "Rising Cadence",
    bpm: 118,
    baseEnergy: 0.54,
    sections: [
      { type: "intro", bars: 8, energy: 0.32 },
      { type: "verse", bars: 16, energy: 0.44 },
      { type: "build", bars: 8, energy: 0.6 },
      { type: "chorus", bars: 16, energy: 0.74 },
      { type: "verse", bars: 12, energy: 0.46 },
      { type: "build", bars: 8, energy: 0.64 },
      { type: "chorus", bars: 16, energy: 0.78 },
      { type: "outro", bars: 8, energy: 0.3 },
    ],
  },
  {
    id: "night-stride",
    title: "Night Stride",
    bpm: 122,
    baseEnergy: 0.56,
    sections: [
      { type: "intro", bars: 8, energy: 0.34 },
      { type: "verse", bars: 16, energy: 0.48 },
      { type: "build", bars: 8, energy: 0.62 },
      { type: "chorus", bars: 16, energy: 0.8 },
      { type: "breakdown", bars: 8, energy: 0.4 },
      { type: "build", bars: 8, energy: 0.66 },
      { type: "drop", bars: 16, energy: 0.86 },
      { type: "outro", bars: 8, energy: 0.32 },
    ],
  },
  {
    id: "push-window",
    title: "Push Window",
    bpm: 128,
    baseEnergy: 0.63,
    sections: [
      { type: "intro", bars: 8, energy: 0.4 },
      { type: "verse", bars: 12, energy: 0.54 },
      { type: "build", bars: 8, energy: 0.7 },
      { type: "drop", bars: 16, energy: 0.88 },
      { type: "breakdown", bars: 8, energy: 0.48 },
      { type: "build", bars: 8, energy: 0.74 },
      { type: "chorus", bars: 16, energy: 0.9 },
      { type: "outro", bars: 8, energy: 0.36 },
    ],
  },
  {
    id: "summit-drive",
    title: "Summit Drive",
    bpm: 136,
    baseEnergy: 0.68,
    sections: [
      { type: "intro", bars: 8, energy: 0.46 },
      { type: "verse", bars: 12, energy: 0.6 },
      { type: "build", bars: 8, energy: 0.76 },
      { type: "drop", bars: 16, energy: 0.94 },
      { type: "breakdown", bars: 8, energy: 0.5 },
      { type: "build", bars: 8, energy: 0.8 },
      { type: "chorus", bars: 16, energy: 0.96 },
      { type: "outro", bars: 8, energy: 0.38 },
    ],
  },
  {
    id: "cool-current",
    title: "Cool Current",
    bpm: 92,
    baseEnergy: 0.24,
    sections: [
      { type: "intro", bars: 8, energy: 0.18 },
      { type: "verse", bars: 20, energy: 0.28 },
      { type: "chorus", bars: 12, energy: 0.36 },
      { type: "verse", bars: 16, energy: 0.26 },
      { type: "breakdown", bars: 12, energy: 0.22 },
      { type: "outro", bars: 8, energy: 0.16 },
    ],
  },
];

function withTimes(draft: CatalogDraft): Track {
  const bar = 240 / draft.bpm;
  let cursor = 0;
  const sections = draft.sections.map((section) => {
    const start = cursor;
    const end = cursor + section.bars * bar;
    cursor = end;
    return {
      type: section.type,
      start: Number(start.toFixed(3)),
      end: Number(end.toFixed(3)),
      energy: section.energy,
    };
  });

  return {
    id: draft.id,
    title: draft.title,
    bpm: draft.bpm,
    duration: Number(cursor.toFixed(3)),
    baseEnergy: draft.baseEnergy,
    src: `music/${draft.id}.mp3`,
    sections,
  };
}

export const TRACKS: Track[] = DRAFTS.map(withTimes);

export function trackById(id: string): Track | undefined {
  return TRACKS.find((track) => track.id === id);
}

export function openingTrackFor(targetEnergy: number): Track {
  const ranked = [...TRACKS].sort(
    (a, b) => Math.abs(a.baseEnergy - targetEnergy) - Math.abs(b.baseEnergy - targetEnergy),
  );
  const preferred =
    targetEnergy <= 0.4
      ? ranked.find((track) => track.id === "easy-miles" || track.id === "cool-current")
      : ranked[0];
  return preferred ?? ranked[0];
}
