import type {
  CoachDebugEvent,
  MusicDecision,
  SessionSnapshot,
  SpeechProvider,
  Track,
  WorkoutEvent,
  WorkoutEventType,
  WorkoutPhase,
  WorkoutPlan,
} from "../types";
import { canSpeakNonCritical } from "./coaching";
import { hypeLevel } from "./hype";
import {
  chooseReplacementTrack,
  findSupportiveSection,
  seekOffsetForTransition,
  shouldChangeTrack,
} from "./shouldChangeTrack";
import { getTargetMusicEnergy } from "./targetEnergy";
import { buildMasterTimeline } from "./timeline";
import { musicStateFrom, timeRemaining } from "./tracks";
import { nextSectionAt, sectionAtTime } from "./workout";

export type TransportCommand =
  | { type: "play-track"; track: Track; offset: number; fade: boolean }
  | { type: "keep-track" }
  | {
      type: "speak";
      text: string;
      instructions: string;
      phase: WorkoutPhase;
      eventType: WorkoutEventType;
    };

export type TickResult = {
  snapshot: SessionSnapshot;
  commands: TransportCommand[];
  fired: WorkoutEvent[];
};

export class SessionEngine {
  readonly plan: WorkoutPlan;
  readonly tracks: Track[];
  events: WorkoutEvent[];
  elapsed = 0;
  paused = true;
  finished = false;
  currentTrack: Track;
  trackOffset = 0;
  trackElapsedAnchor = 0;
  lastCoachAt: number | null = null;
  lastCoachText = "";
  lastVoiceInstructions = "";
  speechProvider: SpeechProvider;
  decisions: MusicDecision[] = [];
  coachLog: CoachDebugEvent[] = [];
  private firedIds = new Set<string>();
  private musicEvaluated = new Set<string>();

  constructor(plan: WorkoutPlan, tracks: Track[], opening: Track, speechProvider: SpeechProvider) {
    this.plan = plan;
    this.tracks = tracks;
    this.events = buildMasterTimeline(plan);
    this.currentTrack = opening;
    this.speechProvider = speechProvider;
  }

  pause(): void {
    this.paused = true;
  }

  resume(): void {
    if (this.finished) return;
    this.paused = false;
  }

  currentTrackPosition(): number {
    return this.trackOffset + Math.max(0, this.elapsed - this.trackElapsedAnchor);
  }

  snapshot(): SessionSnapshot {
    const section = sectionAtTime(this.plan, this.elapsed);
    const next = nextSectionAt(this.plan, this.elapsed);
    const targetMusicEnergy = getTargetMusicEnergy({
      workoutIntensity: section.intensity,
      phase: section.phase,
      hype: this.plan.hype,
      upcomingIntensity: next?.intensity,
      secondsUntilUpcoming: next ? next.start - this.elapsed : null,
    });

    return {
      elapsed: this.elapsed,
      duration: this.plan.duration,
      paused: this.paused,
      finished: this.finished,
      section,
      nextSection: next,
      timeUntilNextSection: next ? Math.max(0, next.start - this.elapsed) : 0,
      speedKph: section.speedKph,
      targetMusicEnergy,
      music: musicStateFrom(this.currentTrack, this.currentTrackPosition()),
      lastCoach: this.lastCoachText,
      lastVoiceInstructions: this.lastVoiceInstructions,
      speechProvider: this.speechProvider,
    };
  }

  tick(seconds: number): TickResult {
    const commands: TransportCommand[] = [];
    const fired: WorkoutEvent[] = [];
    if (this.paused || this.finished) {
      return { snapshot: this.snapshot(), commands, fired };
    }

    this.elapsed = Math.min(this.plan.duration, this.elapsed + seconds);
    if (this.elapsed >= this.plan.duration) {
      this.finished = true;
      this.paused = true;
    }

    this.maybeEvaluateMusic(commands);

    for (const event of this.events) {
      if (this.firedIds.has(event.id) || event.timestamp > this.elapsed) continue;
      this.firedIds.add(event.id);
      const enriched = this.consumeEvent(event, commands);
      fired.push(enriched);
    }

    return { snapshot: this.snapshot(), commands, fired };
  }

  private consumeEvent(event: WorkoutEvent, commands: TransportCommand[]): WorkoutEvent {
    if (event.type === "music_transition" && event.musicDecision?.nextTrackId) {
      const nextTrack = this.tracks.find((track) => track.id === event.musicDecision?.nextTrackId);
      if (nextTrack) {
        this.changeTrack(nextTrack, event.musicDecision.targetEnergy, commands, true);
      }
    }

    if (event.text && event.voiceInstructions) {
      const purpose = event.purpose ?? "motivation";
      if (canSpeakNonCritical(this.lastCoachAt, this.elapsed, this.plan.hype, purpose)) {
        this.lastCoachAt = this.elapsed;
        this.lastCoachText = event.text;
        this.lastVoiceInstructions = event.voiceInstructions;
        commands.push({
          type: "speak",
          text: event.text,
          instructions: event.voiceInstructions,
          phase: event.phase,
          eventType: event.type,
        });
        this.coachLog.unshift({
          timestamp: this.elapsed,
          eventType: event.type,
          purpose,
          hype: this.plan.hype,
          hypeLevel: hypeLevel(this.plan.hype),
          phase: event.phase,
          currentIntensity: event.intensity,
          upcomingIntensity: event.upcomingIntensity ?? null,
          text: event.text,
          voiceInstructions: event.voiceInstructions,
          provider: this.speechProvider,
        });
      }
    }

    return event;
  }

  private maybeEvaluateMusic(commands: TransportCommand[]): void {
    const section = sectionAtTime(this.plan, this.elapsed);
    const next = nextSectionAt(this.plan, this.elapsed);
    const position = this.currentTrackPosition();
    const remaining = timeRemaining(this.currentTrack, position);
    const until = next ? next.start - this.elapsed : Number.POSITIVE_INFINITY;
    const lookaheadKey = next ? `${next.id}:${Math.round(until / 5)}` : `end:${Math.round(remaining)}`;
    const shouldLook =
      remaining <= 16 ||
      (next != null && until <= 36 && until >= 0 && !this.musicEvaluated.has(next.id));

    if (!shouldLook) return;
    if (this.musicEvaluated.has(lookaheadKey) && remaining > 16) return;
    this.musicEvaluated.add(lookaheadKey);
    if (next) this.musicEvaluated.add(next.id);

    const targetEnergy = getTargetMusicEnergy({
      workoutIntensity: section.intensity,
      phase: section.phase,
      hype: this.plan.hype,
      upcomingIntensity: next?.intensity,
      secondsUntilUpcoming: next ? until : null,
    });

    const decision = shouldChangeTrack({
      currentTrack: this.currentTrack,
      currentTrackPosition: position,
      currentWorkoutSection: section,
      nextWorkoutSection: next,
      timeUntilNextSection: Number.isFinite(until) ? until : 0,
      hype: this.plan.hype,
      listenedFor: this.elapsed - this.trackElapsedAnchor,
      targetEnergy,
    });

    if (!decision.accepted) {
      const supportive = findSupportiveSection(
        this.currentTrack,
        position,
        next,
        Number.isFinite(until) ? until : 0,
        targetEnergy,
      );
      if (supportive && next) {
        this.alignSpeedChange(next.start, supportive.start - position + this.elapsed);
        decision.keepSection = supportive.type;
      }
      this.decisions.unshift(decision);
      commands.push({ type: "keep-track" });
      return;
    }

    if (decision.reason === "track_ending") {
      const replacement =
        chooseReplacementTrack({
          tracks: this.tracks,
          currentTrackId: this.currentTrack.id,
          targetEnergy,
          nextPhase: next,
          reason: decision.reason,
        }) ?? this.currentTrack;
      this.decisions.unshift({ ...decision, nextTrackId: replacement.id });
      this.changeTrack(replacement, targetEnergy, commands, replacement.id !== this.currentTrack.id);
      return;
    }

    const replacement = chooseReplacementTrack({
      tracks: this.tracks,
      currentTrackId: this.currentTrack.id,
      targetEnergy,
      nextPhase: next,
      reason: decision.reason,
    });

    if (!replacement) {
      this.decisions.unshift({ ...decision, accepted: false, reason: "continuity_preferred" });
      return;
    }

    const accepted = { ...decision, accepted: true, nextTrackId: replacement.id };
    this.decisions.unshift(accepted);
    const transitionAt = next ? Math.max(this.elapsed, next.start - 8) : this.elapsed;
    this.events.push({
      id: `music-transition-${next?.id ?? "end"}-${Math.round(this.elapsed)}`,
      timestamp: transitionAt,
      type: "music_transition",
      phase: section.phase,
      speedKph: section.speedKph,
      nextSpeedKph: next?.speedKph,
      intensity: section.intensity,
      upcomingIntensity: next?.intensity,
      musicDecision: accepted,
    });
    this.events.sort((a, b) => a.timestamp - b.timestamp);
  }

  private changeTrack(
    track: Track,
    targetEnergy: number,
    commands: TransportCommand[],
    fade: boolean,
  ): void {
    const offset = seekOffsetForTransition(track, targetEnergy);
    this.currentTrack = track;
    this.trackOffset = offset;
    this.trackElapsedAnchor = this.elapsed;
    commands.push({ type: "play-track", track, offset, fade });
  }

  private alignSpeedChange(plannedStart: number, musicalTime: number): void {
    const delta = musicalTime - plannedStart;
    if (Math.abs(delta) > 8) return;
    this.events = this.events.map((event) => {
      if (Math.abs(event.timestamp - plannedStart) < 0.6 && event.type === "speed_change") {
        return { ...event, timestamp: musicalTime, alignedSection: "chorus" };
      }
      return event;
    });
  }
}
