/** Browser speechSynthesis helper. No network. Cancel on every new play. */

const CHILD_RATE = 0.9;
const CHILD_PITCH = 1.05;

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

function scoreVoice(voice: SpeechSynthesisVoice): number {
  const lang = voice.lang.replaceAll("_", "-");
  const name = voice.name;
  let score = 0;
  if (lang === "en-GB") score += 100;
  else if (lang.startsWith("en-GB")) score += 90;
  else if (lang === "en-AU" || lang === "en-IE") score += 35;
  else if (lang.startsWith("en")) score += 15;
  else score -= 50;
  if (/Google UK English/i.test(name)) score += 55;
  if (/Microsoft .+\(Natural\)/i.test(name) && /en-GB/i.test(`${name} ${lang}`)) score += 50;
  if (/Online \(Natural\)/i.test(name)) score += 35;
  if (/neural|natural/i.test(name)) score += 25;
  if (/UK English Female|en-GB-.*Female|Daniel|Kate|Serena/i.test(name)) score += 8;
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
