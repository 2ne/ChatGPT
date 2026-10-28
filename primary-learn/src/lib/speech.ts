import { numberWord } from "../data/objects";

/** Browser speechSynthesis helper. Web Speech only. No generated audio. Cancel on every new play. */

const CHILD_RATE = 0.95;
const CHILD_PITCH = 1.1;

const FEMALE_NAMES =
  /\b(Sonia|Libby|Maisie|Serena|Kate|Stephanie|Martha)\b/i;
const MALE_NAMES =
  /\b(Daniel|Arthur|George|Ryan|Thomas|Oliver)\b/i;

let voices: SpeechSynthesisVoice[] = [];
let voicesBound = false;

function refreshVoices() {
  if (typeof speechSynthesis === "undefined") return;
  voices = speechSynthesis.getVoices();
}

export function speechSupported(): boolean {
  return typeof window !== "undefined" && "speechSynthesis" in window;
}

export function loadVoices(): SpeechSynthesisVoice[] {
  if (!speechSupported()) return [];
  refreshVoices();
  if (!voicesBound) {
    voicesBound = true;
    speechSynthesis.addEventListener("voiceschanged", refreshVoices);
  }
  return voices;
}

function isFemaleVoice(name: string): boolean {
  if (/\bfemale\b/i.test(name)) return true;
  return FEMALE_NAMES.test(name);
}

function isMaleVoice(name: string): boolean {
  if (isFemaleVoice(name)) return false;
  if (/\bmale\b/i.test(name)) return true;
  return MALE_NAMES.test(name);
}

function scoreVoice(voice: SpeechSynthesisVoice): number {
  const lang = voice.lang.replaceAll("_", "-");
  const name = voice.name;
  const hay = `${name} ${lang}`;
  const uk = lang === "en-GB" || lang.startsWith("en-GB") || /UK English|United Kingdom/i.test(hay);
  const female = isFemaleVoice(name);
  const male = isMaleVoice(name);
  let score = 0;

  if (lang === "en-GB") score += 100;
  else if (lang.startsWith("en-GB")) score += 90;
  else if (lang === "en-AU" || lang === "en-IE") score += 35;
  else if (lang.startsWith("en")) score += 15;
  else score -= 50;

  if (male) {
    score -= 250;
    return score;
  }

  if (female) {
    score += 80;
    if (uk) score += 50;
  } else {
    score -= 25;
  }

  if (/Google UK English Female/i.test(name)) score += 60;
  if (female && /Microsoft .+\(Natural\)/i.test(name) && uk) score += 55;
  if (female && /Online \(Natural\)/i.test(name) && uk) score += 40;
  if (female && /neural|natural/i.test(name)) score += 25;
  if (FEMALE_NAMES.test(name) && uk) score += 20;
  return score;
}

export function pickUkVoice(list = loadVoices()): SpeechSynthesisVoice | undefined {
  if (list.length === 0) return undefined;
  return [...list].sort((a, b) => scoreVoice(b) - scoreVoice(a))[0];
}

export function cancelSpeech() {
  if (!speechSupported()) return;
  speechSynthesis.cancel();
}

export type SpeakOptions = {
  text: string;
  onBoundary?: (charIndex: number) => void;
  onEnd?: () => void;
};

/** Spoken count word for tap-to-count. Does not read the pictured total up front. */
export function speakCount(count: number) {
  const text = numberWord(count);
  if (!text) return;
  speak({ text });
}

export function speak(options: SpeakOptions) {
  if (!speechSupported() || !options.text.trim()) {
    options.onEnd?.();
    return;
  }

  speechSynthesis.cancel();
  const utter = new SpeechSynthesisUtterance(options.text.trim());
  const voice = pickUkVoice();
  if (voice) {
    utter.voice = voice;
    utter.lang = voice.lang;
  } else {
    utter.lang = "en-GB";
  }
  utter.rate = CHILD_RATE;
  utter.pitch = CHILD_PITCH;

  utter.onboundary = (event) => {
    if (event.name && event.name !== "word") return;
    options.onBoundary?.(event.charIndex);
  };
  utter.onend = () => options.onEnd?.();
  utter.onerror = () => options.onEnd?.();

  speechSynthesis.speak(utter);
}

export type SpokenToken = {
  value: string;
  kind: "word" | "space";
  wordIndex: number;
  start: number;
  end: number;
};

export function tokenizeSpoken(text: string): SpokenToken[] {
  const tokens: SpokenToken[] = [];
  let wordIndex = -1;
  const matcher = /(\s+)|(\S+)/g;
  let match: RegExpExecArray | null;
  while ((match = matcher.exec(text))) {
    if (match[1] != null) {
      tokens.push({
        value: match[1],
        kind: "space",
        wordIndex,
        start: match.index,
        end: match.index + match[1].length,
      });
    } else {
      wordIndex += 1;
      const value = match[2];
      tokens.push({
        value,
        kind: "word",
        wordIndex,
        start: match.index,
        end: match.index + value.length,
      });
    }
  }
  return tokens;
}

export function wordIndexAt(text: string, charIndex: number): number {
  if (charIndex < 0) return -1;
  const tokens = tokenizeSpoken(text);
  const hit = tokens.find((token) => token.kind === "word" && charIndex >= token.start && charIndex < token.end);
  if (hit) return hit.wordIndex;
  const previous = [...tokens]
    .reverse()
    .find((token) => token.kind === "word" && token.start <= charIndex);
  return previous?.wordIndex ?? -1;
}
