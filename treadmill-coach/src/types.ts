export type HypeLevel = "relaxed" | "balanced" | "hyped";

export type WorkoutPhase =
  | "warm-up"
  | "build"
  | "hard"
  | "recovery"
  | "peak"
  | "cool-down";

export type SectionType =
  | "intro"
  | "verse"
  | "build"
  | "chorus"
  | "drop"
  | "breakdown"
  | "outro";

export type WorkoutEventType =
  | "phase_start"
  | "speed_warning"
  | "speed_change"
  | "music_build"
  | "music_transition"
  | "coach"
  | "recovery"
  | "peak";

export type CoachPurpose =
  | "instruction"
  | "preparation"
  | "reassurance"
  | "motivation"
  | "milestone";

export type TransitionReason =
  | "track_ending"
  | "large_intensity_change"
  | "recovery_transition"
  | "peak_transition"
  | "unsuitable_section"
  | "better_upcoming_drop"
  | "continuity_preferred";

export type SpeechProvider = "openai" | "browser";

export type MusicState = {
  trackId: string;
  trackPosition: number;
  sectionType: SectionType;
  sectionEnergy: number;
  currentEnergy: number;
};

export type TrackSection = {
  type: SectionType;
  start: number;
  end: number;
  energy: number;
};

export type Track = {
  id: string;
  title: string;
  bpm: number;
  duration: number;
  baseEnergy: number;
  src: string;
  sections: TrackSection[];
};

export type WorkoutSection = {
  id: string;
  phase: WorkoutPhase;
  start: number;
  end: number;
  speedKph: number;
  intensity: number;
  label: string;
};

export type WorkoutPlan = {
  duration: number;
  hype: number;
  hypeLevel: HypeLevel;
  sections: WorkoutSection[];
};

export type WorkoutEvent = {
  id: string;
  timestamp: number;
  type: WorkoutEventType;
  purpose?: CoachPurpose;
  text?: string;
  voiceInstructions?: string;
  phase: WorkoutPhase;
  speedKph: number;
  nextSpeedKph?: number;
  intensity: number;
  upcomingIntensity?: number;
  alignedSection?: SectionType;
  musicDecision?: MusicDecision;
};

export type MusicDecision = {
  considered: boolean;
  accepted: boolean;
  reason: TransitionReason;
  currentTrackId: string;
  currentTrackPosition: number;
  currentSection: SectionType;
  currentEnergy: number;
  targetEnergy: number;
  treadmillSpeed: number;
  upcomingTreadmillSpeed: number | null;
  timeUntilSpeedChange: number | null;
  keepSection?: SectionType;
  nextTrackId?: string;
};

export type CoachDebugEvent = {
  timestamp: number;
  eventType: WorkoutEventType;
  purpose: CoachPurpose;
  hype: number;
  hypeLevel: HypeLevel;
  phase: WorkoutPhase;
  currentIntensity: number;
  upcomingIntensity: number | null;
  text: string;
  voiceInstructions: string;
  provider: SpeechProvider;
};

export type SessionSnapshot = {
  elapsed: number;
  duration: number;
  paused: boolean;
  finished: boolean;
  section: WorkoutSection;
  nextSection: WorkoutSection | null;
  timeUntilNextSection: number;
  speedKph: number;
  targetMusicEnergy: number;
  music: MusicState | null;
  lastCoach: string;
  lastVoiceInstructions: string;
  speechProvider: SpeechProvider;
};

export type ShouldChangeTrackInput = {
  currentTrack: Track;
  currentTrackPosition: number;
  currentWorkoutSection: WorkoutSection;
  nextWorkoutSection: WorkoutSection | null;
  timeUntilNextSection: number;
  hype: number;
  listenedFor: number;
  targetEnergy: number;
};
