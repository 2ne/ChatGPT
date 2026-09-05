import type { WorkoutEventType, WorkoutPhase } from "../types";
import { hype01, hypeLevel } from "./hype";

export function getVoiceDirection(input: {
  hype: number;
  phase: WorkoutPhase;
  currentIntensity: number;
  upcomingIntensity?: number | null;
  eventType: WorkoutEventType;
  secondsUntilChange?: number | null;
}): string {
  const level = hypeLevel(input.hype);
  const t = hype01(input.hype);
  const upcoming = input.upcomingIntensity ?? input.currentIntensity;
  const rising = upcoming - input.currentIntensity >= 0.16;
  const until = input.secondsUntilChange;

  if (input.eventType === "recovery" || input.phase === "recovery") {
    return [
      "Speak like the same coach immediately after a hard physical effort.",
      "Reduce the energy noticeably. Slow the delivery slightly.",
      "Sound warm, reassuring and controlled.",
      "Help the runner relax and settle their breathing. Remove urgency.",
      level === "hyped"
        ? "Even though this is a high-hype session, recovery must feel like relief, not another push."
        : "Keep the tone intimate and easy, as if you are jogging beside them.",
    ].join(" ");
  }

  if (input.phase === "cool-down" || input.eventType === "coach" && input.currentIntensity < 0.28) {
    return [
      "Speak like a coach closing a completed session.",
      "Stay warm, clear and quietly proud. Slow the pace a little.",
      "Do not sound sleepy or meditative. Keep a human smile in the voice.",
      "No urgency, no hype, no shouting.",
    ].join(" ");
  }

  if (input.phase === "warm-up") {
    return [
      "Sound upbeat, confident and welcoming, like a running coach starting a session they are looking forward to.",
      "There is no urgency yet, but make the runner feel energised and ready to begin.",
      "Do not sound like meditation or relaxation audio.",
      level === "relaxed"
        ? "Keep the energy awake and friendly rather than intense."
        : "Lean into positive anticipation. The work is coming, and that should feel good.",
      "Use a natural conversational pace with bright emphasis on the first few words.",
    ].join(" ");
  }

  if (input.eventType === "music_build" || (input.eventType === "speed_warning" && rising)) {
    if (until != null && until <= 12) {
      return [
        "Speak like a focused running coach ten seconds before a hard interval.",
        "Be focused and urgent. Shorten the phrases. Keep the voice tight and ready.",
        "Sound confident, not panicked. The runner should feel the effort arriving now.",
        t >= 0.67
          ? "Raise the energy clearly, with immediate delivery and strong emphasis."
          : "Increase focus without shouting.",
      ].join(" ");
    }
    return [
      "Speak like a running coach thirty seconds before a harder effort.",
      "Sound positive and anticipatory. The energy should be building, not already at a sprint.",
      "Use a quickening but still natural pace. Warm, confident and forward-looking.",
      "Make the next interval feel programmed and worth preparing for.",
    ].join(" ");
  }

  if (
    input.eventType === "speed_change" ||
    input.eventType === "peak" ||
    input.phase === "peak" ||
    (input.phase === "hard" && input.eventType === "phase_start")
  ) {
    if (input.phase === "peak" || input.eventType === "peak") {
      return [
        "Speak like a focused running coach during a peak effort.",
        "Be highly energetic, confident and encouraging.",
        "Use a quick but natural pace, strong emphasis and immediate delivery.",
        "Sound genuinely excited about the effort without shouting, sounding theatrical or becoming cartoonish.",
        "Keep sentences short. This is the moment.",
      ].join(" ");
    }
    return [
      "Speak like a focused running coach during a hard interval.",
      "Be highly energetic, confident and encouraging.",
      "Use a quick but natural pace, strong emphasis and immediate delivery.",
      "Sound genuinely excited about the effort without shouting, sounding theatrical or becoming cartoonish.",
      level === "relaxed"
        ? "Stay strong and clear, but do not oversell the moment."
        : "Let the runner hear that this change matters.",
    ].join(" ");
  }

  if (input.eventType === "coach" && input.phase === "hard") {
    return [
      "Speak like the same coach mid-interval, keeping the runner honest.",
      "Be compact, confident and present. No speeches.",
      t >= 0.67
        ? "Keep the energy high and the emphasis sharp, but stay human."
        : "Encourage without adding drama.",
    ].join(" ");
  }

  return [
    "Speak like a capable running coach who is present and paying attention.",
    "Natural pace, clear diction, grounded confidence.",
    "Match the current effort: awake in the warm-up, focused when the work starts, calm when it eases.",
    "Never sound flat, bored or automated.",
  ].join(" ");
}
