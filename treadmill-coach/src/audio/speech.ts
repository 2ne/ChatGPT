import type { SpeechProvider, WorkoutEventType, WorkoutPhase } from "../types";
import { hype01 } from "../engine/hype";

export function defaultSpeechProvider(): SpeechProvider {
  return import.meta.env.PROD ? "browser" : "openai";
}

export function browserVoiceParams(input: {
  phase: WorkoutPhase;
  eventType: WorkoutEventType;
  hype: number;
}): SpeechSynthesisUtterance {
  const utterance = new SpeechSynthesisUtterance();
  const t = hype01(input.hype);
  let rate = 1;
  let pitch = 1;
  let volume = 1;

  if (input.phase === "recovery" || input.eventType === "recovery") {
    rate = 0.88;
    pitch = 0.92;
    volume = 0.86;
  } else if (input.phase === "cool-down") {
    rate = 0.94;
    pitch = 0.96;
    volume = 0.9;
  } else if (input.phase === "warm-up") {
    rate = 1.04 + t * 0.04;
    pitch = 1.04;
    volume = 0.96;
  } else if (input.phase === "build" || input.eventType === "music_build" || input.eventType === "speed_warning") {
    rate = input.eventType === "speed_warning" ? 1.12 : 1.06;
    pitch = 1.05;
  } else if (input.phase === "peak" || input.eventType === "peak") {
    rate = 1.16 + t * 0.04;
    pitch = 1.08;
    volume = 1;
  } else if (input.phase === "hard") {
    rate = 1.12 + t * 0.05;
    pitch = 1.06;
  }

  utterance.rate = rate;
  utterance.pitch = pitch;
  utterance.volume = volume;
  return utterance;
}

function pickVoice(): SpeechSynthesisVoice | null {
  const voices = window.speechSynthesis.getVoices();
  const preferred = voices.find((voice) => /en-GB|en-US/i.test(voice.lang) && /male|daniel|arthur|google uk/i.test(voice.name))
    ?? voices.find((voice) => /en-GB/i.test(voice.lang))
    ?? voices.find((voice) => /en/i.test(voice.lang));
  return preferred ?? null;
}

export async function speakWithBrowser(
  text: string,
  phase: WorkoutPhase,
  eventType: WorkoutEventType,
  hype: number,
): Promise<void> {
  window.speechSynthesis.cancel();
  await voicesReady();
  const utterance = browserVoiceParams({ phase, eventType, hype });
  utterance.text = text;
  const voice = pickVoice();
  if (voice) utterance.voice = voice;
  window.speechSynthesis.speak(utterance);
}

export async function speakWithOpenAI(text: string, instructions: string): Promise<boolean> {
  try {
    const response = await fetch("/api/speech", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text, instructions }),
    });
    if (!response.ok) return false;
    const blob = await response.blob();
    const url = URL.createObjectURL(blob);
    await playBlob(url);
    URL.revokeObjectURL(url);
    return true;
  } catch {
    return false;
  }
}

export async function speakCoach(input: {
  text: string;
  instructions: string;
  provider: SpeechProvider;
  phase: WorkoutPhase;
  eventType: WorkoutEventType;
  hype: number;
}): Promise<SpeechProvider> {
  if (input.provider === "openai") {
    const ok = await speakWithOpenAI(input.text, input.instructions);
    if (ok) return "openai";
  }
  await speakWithBrowser(input.text, input.phase, input.eventType, input.hype);
  return "browser";
}

function playBlob(url: string): Promise<void> {
  return new Promise((resolve, reject) => {
    const audio = new Audio(url);
    audio.onended = () => resolve();
    audio.onerror = () => reject(new Error("Unable to play speech"));
    void audio.play().catch(reject);
  });
}

function voicesReady(): Promise<void> {
  if (window.speechSynthesis.getVoices().length > 0) return Promise.resolve();
  return new Promise((resolve) => {
    const done = () => resolve();
    window.speechSynthesis.addEventListener("voiceschanged", done, { once: true });
    window.setTimeout(done, 400);
  });
}
