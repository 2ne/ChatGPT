/**
 * Kid SFX via the Web Audio API. No files. One shared context.
 * Play on pointerdown / touchstart (never click or touch-up) so iOS is instant.
 * Schedule at audio.currentTime. Do not use setTimeout. Mute does not touch speechSynthesis.
 */
import { loadSoundMuted, saveSoundMuted } from "../storage/localStore";

export type SoundCue = "tap" | "correct" | "wrong" | "fanfare" | "fanfareBig";

type Tone = {
  freq: number;
  t: number;
  dur: number;
  gain: number;
  type?: OscillatorType;
  slide?: number;
};

const AudioCtx = typeof window !== "undefined"
  ? window.AudioContext ||
    (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext
  : undefined;

let ctx: AudioContext | null = null;
let master: GainNode | null = null;
let muted = loadSoundMuted();
let uiBound = false;
let poked = false;
let lastToggle = 0;
const muteListeners = new Set<(muted: boolean) => void>();
const lastPlayed: Partial<Record<SoundCue, number>> = {};

function getCtx(): AudioContext | null {
  if (!AudioCtx) return null;
  if (!ctx) {
    ctx = new AudioCtx();
    master = ctx.createGain();
    master.gain.value = muted ? 0 : 1;
    master.connect(ctx.destination);
  }
  return ctx;
}

/** Create / resume the shared context. Call from the first pointerdown or touchstart. */
export function unlockSound() {
  const audio = getCtx();
  if (!audio) return;
  if (audio.state === "suspended") void audio.resume();
  if (poked) return;
  poked = true;
  const poke = audio.createBufferSource();
  poke.buffer = audio.createBuffer(1, 1, audio.sampleRate);
  poke.connect(audio.destination);
  poke.start(0);
}

export function isSoundMuted(): boolean {
  return muted;
}

export function setSoundMuted(next: boolean) {
  muted = next;
  saveSoundMuted(next);
  if (master) master.gain.setValueAtTime(next ? 0 : 1, master.context.currentTime);
  muteListeners.forEach((fn) => fn(next));
}

export function toggleSoundMuted() {
  const now = performance.now();
  if (now - lastToggle < 80) return;
  lastToggle = now;
  setSoundMuted(!muted);
}

export function subscribeSoundMuted(fn: (muted: boolean) => void): () => void {
  muteListeners.add(fn);
  return () => muteListeners.delete(fn);
}

function tone(audio: AudioContext, out: AudioNode, spec: Tone) {
  const osc = audio.createOscillator();
  const gain = audio.createGain();
  osc.type = spec.type ?? "sine";
  osc.frequency.setValueAtTime(spec.freq, spec.t);
  if (spec.slide) osc.frequency.exponentialRampToValueAtTime(spec.slide, spec.t + spec.dur);
  gain.gain.setValueAtTime(Math.max(0.0001, spec.gain), spec.t);
  gain.gain.exponentialRampToValueAtTime(0.0001, spec.t + spec.dur);
  osc.connect(gain);
  gain.connect(out);
  osc.start(spec.t);
  osc.stop(spec.t + spec.dur + 0.02);
}

function playNow(cue: SoundCue) {
  if (muted) return;
  const audio = getCtx();
  if (!audio || !master) return;
  if (audio.state === "suspended") void audio.resume();
  const t = audio.currentTime;
  const out = master;

  if (cue === "tap") {
    tone(audio, out, { freq: 1640, t, dur: 0.032, gain: 0.055, type: "triangle" });
    return;
  }

  if (cue === "correct") {
    tone(audio, out, { freq: 784, t, dur: 0.09, gain: 0.09, type: "triangle" });
    tone(audio, out, { freq: 1175, t: t + 0.07, dur: 0.16, gain: 0.1, type: "sine" });
    return;
  }

  if (cue === "wrong") {
    tone(audio, out, {
      freq: 262,
      t,
      dur: 0.2,
      gain: 0.07,
      type: "sine",
      slide: 185,
    });
    return;
  }

  if (cue === "fanfare") {
    const notes = [523, 659, 784];
    notes.forEach((freq, i) => {
      tone(audio, out, { freq, t: t + i * 0.09, dur: 0.16, gain: 0.08, type: "triangle" });
    });
    return;
  }

  const notes = [523, 659, 784, 1046, 1319];
  notes.forEach((freq, i) => {
    tone(audio, out, { freq, t: t + i * 0.08, dur: 0.18, gain: 0.09, type: "triangle" });
  });
}

export function playSound(cue: SoundCue) {
  const now = performance.now();
  const previous = lastPlayed[cue] ?? 0;
  if (now - previous < 50) return;
  lastPlayed[cue] = now;
  playNow(cue);
}

function isTapTarget(target: EventTarget | null): boolean {
  if (!(target instanceof Element)) return false;
  if (target.closest("[data-sfx='off']")) return false;
  if (target.closest("button:disabled, [aria-disabled='true']")) return false;
  return Boolean(target.closest("button, [role='button'], [role='radio']"));
}

/** Unlock on any press. Soft tap on buttons and answer taps, on pointerdown. */
export function installSoundUi() {
  if (typeof window === "undefined" || uiBound) return;
  uiBound = true;

  function onPress(event: Event) {
    unlockSound();
    if (!isTapTarget(event.target)) return;
    playSound("tap");
  }

  window.addEventListener("pointerdown", onPress, { capture: true });
  window.addEventListener(
    "touchstart",
    (event) => {
      unlockSound();
      if (typeof window.PointerEvent !== "undefined") return;
      onPress(event);
    },
    { capture: true, passive: true },
  );
}
