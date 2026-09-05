import { describe, expect, it } from "vitest";
import { TRACKS, openingTrackFor } from "../data/catalog";
import { coachGapSeconds, hypeLevel, minTrackListenSeconds } from "./hype";
import { SessionEngine } from "./session";
import {
  findSupportiveSection,
  isMaterialWorkoutChange,
  shouldChangeTrack,
} from "./shouldChangeTrack";
import { getTargetMusicEnergy } from "./targetEnergy";
import { buildMasterTimeline } from "./timeline";
import { getVoiceDirection } from "./voiceDirection";
import { generateWorkout, nextSectionAt, sectionAtTime } from "./workout";

function runFor(engine: SessionEngine, seconds: number, step = 0.5) {
  engine.resume();
  let acceptedChanges = 0;
  for (let elapsed = 0; elapsed < seconds; elapsed += step) {
    engine.tick(step);
  }
  acceptedChanges = engine.decisions.filter((decision) => decision.accepted).length;
  return acceptedChanges;
}

describe("relaxed warm-up continuity", () => {
  it("keeps one song while the treadmill stays at the opening speed", () => {
    const plan = generateWorkout(18, 16);
    const opening = openingTrackFor(0.3);
    const engine = new SessionEngine(plan, TRACKS, opening, "browser");
    const warm = plan.sections[0];
    const sameSpeedSpan = plan.sections
      .filter((section) => Math.abs(section.speedKph - warm.speedKph) < 0.15)
      .reduce((sum, section) => sum + (section.end - section.start), 0);

    expect(sameSpeedSpan).toBeGreaterThan(180);
    const changes = runFor(engine, Math.min(150, sameSpeedSpan - 20));
    expect(engine.currentTrack.id).toBe(opening.id);
    expect(changes).toBe(0);
    expect(engine.coachLog.length).toBeLessThan(4);
    expect(engine.coachLog.every((entry) => entry.phase === "warm-up" || entry.eventType === "phase_start")).toBe(true);
  });
});

describe("hyped warm-up delivery", () => {
  it("is anticipatory rather than flat or like a sprint", () => {
    const direction = getVoiceDirection({
      hype: 90,
      phase: "warm-up",
      currentIntensity: 0.28,
      upcomingIntensity: 0.56,
      eventType: "phase_start",
    });
    expect(direction).toMatch(/upbeat|welcoming|looking forward/i);
    expect(direction).toMatch(/no urgency yet/i);
    expect(direction).not.toMatch(/highly energetic|immediate delivery|this is the moment/i);
    expect(direction.length).toBeGreaterThan(80);

    const plan = generateWorkout(90, 16);
    expect(plan.sections[0].phase).toBe("warm-up");
    expect(plan.sections[0].intensity).toBeLessThan(0.45);
    const openingEnergy = getTargetMusicEnergy({
      workoutIntensity: plan.sections[0].intensity,
      phase: "warm-up",
      hype: 90,
      upcomingIntensity: plan.sections[1]?.intensity,
      secondsUntilUpcoming: plan.sections[1]?.start,
    });
    expect(openingEnergy).toBeLessThan(0.56);
  });
});

describe("no pace change", () => {
  it("does not treat an internal section change as a music change", () => {
    const plan = generateWorkout(20, 16);
    const first = plan.sections[0];
    const second = plan.sections[1];
    expect(second.phase).toBe("warm-up");
    expect(Math.abs(second.speedKph - first.speedKph)).toBeLessThan(0.15);
    expect(isMaterialWorkoutChange(first, second, 20)).toBe(false);

    const decision = shouldChangeTrack({
      currentTrack: TRACKS.find((track) => track.id === "easy-miles")!,
      currentTrackPosition: 40,
      currentWorkoutSection: first,
      nextWorkoutSection: second,
      timeUntilNextSection: first.end - 40,
      hype: 20,
      listenedFor: 40,
      targetEnergy: 0.3,
    });
    expect(decision.accepted).toBe(false);
    expect(decision.reason).toBe("continuity_preferred");
  });
});

describe("hard interval approaching", () => {
  it("prefers an upcoming chorus or build in the current track", () => {
    const track = TRACKS.find((item) => item.id === "rising-cadence")!;
    const chorus = track.sections.find((section) => section.type === "chorus")!;
    const plan = generateWorkout(70, 16);
    const hard = plan.sections.find((section) => section.phase === "hard")!;
    const before = sectionAtTime(plan, hard.start - 28);

    const supportive = findSupportiveSection(track, chorus.start - 25, hard, 30, 0.72);
    expect(supportive?.type).toMatch(/build|chorus|drop/);

    const decision = shouldChangeTrack({
      currentTrack: track,
      currentTrackPosition: chorus.start - 25,
      currentWorkoutSection: before,
      nextWorkoutSection: hard,
      timeUntilNextSection: 30,
      hype: 70,
      listenedFor: 160,
      targetEnergy: 0.7,
    });
    expect(decision.accepted).toBe(false);
    expect(decision.reason).toBe("continuity_preferred");
    expect(decision.keepSection).toMatch(/build|chorus|drop/);
  });
});

describe("hyped recovery", () => {
  it("drops musical energy and calms the voice even at maximum hype", () => {
    const peakEnergy = getTargetMusicEnergy({
      workoutIntensity: 0.9,
      phase: "peak",
      hype: 100,
    });
    const recoveryEnergy = getTargetMusicEnergy({
      workoutIntensity: 0.3,
      phase: "recovery",
      hype: 100,
    });
    expect(recoveryEnergy).toBeLessThan(peakEnergy - 0.25);
    expect(recoveryEnergy).toBeLessThan(0.5);

    const recoveryVoice = getVoiceDirection({
      hype: 100,
      phase: "recovery",
      currentIntensity: 0.3,
      upcomingIntensity: 0.3,
      eventType: "recovery",
    });
    const peakVoice = getVoiceDirection({
      hype: 100,
      phase: "peak",
      currentIntensity: 0.94,
      upcomingIntensity: 0.94,
      eventType: "peak",
    });
    expect(recoveryVoice).toMatch(/reduce the energy|reassuring|remove urgency/i);
    expect(peakVoice).toMatch(/highly energetic|genuinely excited/i);
    expect(recoveryVoice).not.toEqual(peakVoice);
  });
});

describe("existing chorus is not replaced for a slightly better score", () => {
  it("keeps the current track when a suitable chorus is already coming", () => {
    const track = TRACKS.find((item) => item.id === "night-stride")!;
    const chorus = track.sections.find((section) => section.type === "chorus")!;
    const current = generateWorkout(80, 16).sections.find((section) => section.phase === "build")!;
    const next = generateWorkout(80, 16).sections.find((section) => section.phase === "hard")!;

    const decision = shouldChangeTrack({
      currentTrack: track,
      currentTrackPosition: chorus.start - 20,
      currentWorkoutSection: current,
      nextWorkoutSection: next,
      timeUntilNextSection: 22,
      hype: 80,
      listenedFor: 200,
      targetEnergy: 0.78,
    });

    expect(decision.accepted).toBe(false);
    expect(decision.reason).toBe("continuity_preferred");
  });
});

describe("voice directions are distinct", () => {
  it("generates four representative deliveries that do not collapse together", () => {
    const clips = {
      hypedPeak: getVoiceDirection({
        hype: 92,
        phase: "peak",
        currentIntensity: 0.94,
        eventType: "peak",
      }),
      hypedRecovery: getVoiceDirection({
        hype: 92,
        phase: "recovery",
        currentIntensity: 0.3,
        eventType: "recovery",
      }),
      balancedWarmup: getVoiceDirection({
        hype: 50,
        phase: "warm-up",
        currentIntensity: 0.28,
        eventType: "phase_start",
      }),
      relaxedRecovery: getVoiceDirection({
        hype: 18,
        phase: "recovery",
        currentIntensity: 0.28,
        eventType: "recovery",
      }),
    };

    const unique = new Set(Object.values(clips));
    expect(unique.size).toBe(4);
    expect(clips.hypedPeak).toMatch(/peak effort|highly energetic/i);
    expect(clips.balancedWarmup).toMatch(/welcoming|looking forward/i);
    expect(clips.hypedRecovery).toMatch(/relief|reduce the energy/i);
    expect(clips.relaxedRecovery).toMatch(/warm|settle/i);
  });
});

describe("master timeline and pause sync", () => {
  it("derives speed, coaching and music from one clock", () => {
    const plan = generateWorkout(55, 16);
    const engine = new SessionEngine(plan, TRACKS, openingTrackFor(0.35), "browser");
    const timeline = buildMasterTimeline(plan);
    expect(timeline.some((event) => event.type === "speed_change")).toBe(true);
    expect(timeline.some((event) => event.type === "music_build")).toBe(true);
    expect(timeline.some((event) => event.text && event.voiceInstructions)).toBe(true);

    engine.resume();
    engine.tick(12);
    const before = engine.elapsed;
    const trackBefore = engine.currentTrackPosition();
    engine.pause();
    engine.tick(8);
    expect(engine.elapsed).toBe(before);
    expect(engine.currentTrackPosition()).toBeCloseTo(trackBefore, 5);
    engine.resume();
    engine.tick(5);
    expect(engine.elapsed).toBeCloseTo(before + 5, 5);
    expect(sectionAtTime(plan, engine.elapsed).speedKph).toBe(engine.snapshot().speedKph);
    expect(nextSectionAt(plan, engine.elapsed)?.id).toBe(engine.snapshot().nextSection?.id);
  });
});

describe("hype controls intervention, not constant switching", () => {
  it("keeps hyped sessions more compact without making continuity optional", () => {
    const relaxed = generateWorkout(15, 16);
    const hyped = generateWorkout(90, 16);
    const relaxedHard = relaxed.sections.find((section) => section.phase === "hard")!;
    const hypedHard = hyped.sections.find((section) => section.phase === "hard")!;
    expect(hypedHard.end - hypedHard.start).toBeLessThan(relaxedHard.end - relaxedHard.start);
    expect(minTrackListenSeconds(90)).toBeLessThan(minTrackListenSeconds(15));
    expect(coachGapSeconds(90).min).toBeLessThan(coachGapSeconds(15).min);
    expect(hypeLevel(90)).toBe("hyped");
  });
});
