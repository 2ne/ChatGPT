import { numberWord } from "../data/objects";

/** Browser speechSynthesis helper. Web Speech only. No generated audio. Cancel on every new play. */

const CHILD_RATE = 0.95;
const CHILD_PITCH = 1.1;

const FEMALE_NAMES =
  /\b(Sonia|Libby|Maisie|Serena|Kate|Stephanie|Martha|Flo|Shelley|Sandy|Grandma|Samantha)\b/i;
const MALE_NAMES =
  /\b(Daniel|Arthur|George|Ryan|Thomas|Oliver|Eddy|Reed|Rocko|Grandpa)\b/i;

let voices: SpeechSynthesisVoice[] = [];
// Keep the utterance alive until the browser finishes speaking.
let activeUtterance: SpeechSynthesisUtterance | null = null;
let pendingSpeech: SpeakOptions | null = null;
let retryBound = false;
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
  // Prefer a recognised female UK voice, then a female English fallback.
  // Never explicitly select a recognised male voice.
  const ukVoices = list.filter(voice => {
    const lang = voice.lang.replaceAll("_", "-").toLowerCase();
    return lang === "en-gb" || lang.startsWith("en-gb-") ||
      (/^en(?:-|$)/.test(lang) && /UK English|United Kingdom/i.test(voice.name));
  });
  const femaleUk = ukVoices.filter(voice => isFemaleVoice(voice.name));
  const femaleEnglish = list.filter(voice =>
    /^en(?:-|$)/i.test(voice.lang.replaceAll("_", "-")) && isFemaleVoice(voice.name));
  const unclassifiedUk = ukVoices.filter(voice => !isMaleVoice(voice.name));
  const candidates = femaleUk.length ? femaleUk : femaleEnglish.length ? femaleEnglish : unclassifiedUk;
  return [...candidates].sort((a, b) => scoreVoice(b) - scoreVoice(a))[0];
}

export function cancelSpeech() {
  if (!speechSupported()) return;
  pendingSpeech = null;
  activeUtterance = null;
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

  if (!retryBound) {
    retryBound = true;
    // Retry a browser-blocked initial read inside a real interaction.
    document.addEventListener("pointerup", () => {
      if (pendingSpeech && !speechSynthesis.speaking) speak(pendingSpeech);
    });
    document.addEventListener("keydown", () => {
      if (pendingSpeech && !speechSynthesis.speaking) speak(pendingSpeech);
    });
  }
  activeUtterance = null;
  speechSynthesis.cancel();
  pendingSpeech = options;
  const text = options.text.trim();
  const positiveFeedback = /^Correct[.!]\s*Nice!$/i.test(text);
  const negativeFeedback = /^Not quite[.!]?$/i.test(text);
  const utter = new SpeechSynthesisUtterance(positiveFeedback ? "Correct! Nice!" : text);
  activeUtterance = utter;
  const voice = pickUkVoice();
  if (voice) {
    utter.voice = voice;
    utter.lang = voice.lang;
  } else {
    utter.lang = "en-GB";
  }
  utter.rate = positiveFeedback ? 1.02 : negativeFeedback ? 0.92 : CHILD_RATE;
  utter.pitch = positiveFeedback ? 1.15 : negativeFeedback ? 1.04 : CHILD_PITCH;

  utter.onstart = () => { if (activeUtterance === utter) pendingSpeech = null; };
  utter.onboundary = (event) => {
    if (event.name && event.name !== "word") return;
    options.onBoundary?.(event.charIndex);
  };
  const finish = () => {
    if (activeUtterance !== utter) return;
    activeUtterance = null;
    options.onEnd?.();
  };
  utter.onend = () => {
    if (activeUtterance === utter) pendingSpeech = null;
    finish();
  };
  utter.onerror = finish;

  if (speechSynthesis.paused) speechSynthesis.resume();
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
