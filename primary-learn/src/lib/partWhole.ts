import { numberWord } from "../data/objects";
import type { PartWholeMissing, PartWholeQuestion, Question } from "../types/activity";

export function partWholeMissing(question: PartWholeQuestion): PartWholeMissing {
  return question.missing;
}

/** The number the child should put in the empty circle. */
export function partWholeAnswer(question: PartWholeQuestion): number {
  if (question.missing === "left") return question.parts[0];
  if (question.missing === "right") return question.parts[1];
  return question.whole;
}

export function partWholeKnown(question: PartWholeQuestion): number | null {
  if (question.missing === "left") return question.parts[1];
  if (question.missing === "right") return question.parts[0];
  return null;
}

/** Cherry geometry in px. SVG lines and CSS layout both use this. */
export const PART_WHOLE_LAYOUT = {
  whole: 96,
  part: 80,
  gap: 40,
  join: 36,
  stroke: 4,
} as const;

export type PartWholeTreeMetrics = {
  width: number;
  height: number;
  stroke: number;
  wholeCx: number;
  wholeBottom: number;
  leftCx: number;
  rightCx: number;
  partTop: number;
};

export function partWholeTreeMetrics(): PartWholeTreeMetrics {
  const { whole, part, gap, join, stroke } = PART_WHOLE_LAYOUT;
  const width = Math.max(whole, part * 2 + gap);
  const height = whole + join + part;
  const partsWidth = part * 2 + gap;
  const partsLeft = (width - partsWidth) / 2;
  return {
    width,
    height,
    stroke,
    wholeCx: width / 2,
    wholeBottom: whole,
    leftCx: partsLeft + part / 2,
    rightCx: partsLeft + part + gap + part / 2,
    partTop: whole + join,
  };
}

/**
 * Three nearby options: the answer plus close misses (correct ±1, then ±2…).
 * Clamped to 0…20 with no duplicates. May go one past `whole` so 1+2 can offer 4.
 */
export function defaultPartWholeChoices(correct: number, whole: number): number[] {
  const min = 0;
  const max = Math.min(20, Math.max(whole + 1, correct + 1, 2));
  const found: number[] = [correct];
  for (let delta = 1; found.length < 3 && delta <= 20; delta += 1) {
    const below = correct - delta;
    const above = correct + delta;
    if (below >= min && !found.includes(below)) found.push(below);
    if (found.length >= 3) break;
    if (above <= max && !found.includes(above)) found.push(above);
  }
  for (let n = 0; found.length < 3 && n <= 20; n += 1) {
    if (!found.includes(n)) found.push(n);
  }
  return found.slice(0, 3);
}

/** Number pad. Default three nearby values. JSON may set exactly three. */
export function partWholeChoices(question: PartWholeQuestion): number[] {
  if (question.choices && question.choices.length === 3) return question.choices;
  return defaultPartWholeChoices(partWholeAnswer(question), question.whole);
}

const PART_PROMPT = /^What goes with \d+ to make \d+\?$/;
const WHOLE_PROMPT = /^What do \d+ and \d+ make\?$/;
const PART_SPOKEN =
  /^What goes with (?:zero|one|two|three|four|five|six|seven|eight|nine|ten|eleven|twelve|thirteen|fourteen|fifteen|sixteen|seventeen|eighteen|nineteen|twenty|\d+) to make (?:zero|one|two|three|four|five|six|seven|eight|nine|ten|eleven|twelve|thirteen|fourteen|fifteen|sixteen|seventeen|eighteen|nineteen|twenty|\d+)\?$/;
const WHOLE_SPOKEN =
  /^What do (?:zero|one|two|three|four|five|six|seven|eight|nine|ten|eleven|twelve|thirteen|fourteen|fifteen|sixteen|seventeen|eighteen|nineteen|twenty|\d+) and (?:zero|one|two|three|four|five|six|seven|eight|nine|ten|eleven|twelve|thirteen|fourteen|fifteen|sixteen|seventeen|eighteen|nineteen|twenty|\d+) make\?$/;

/** Visible stem from the numbers on screen. */
export function defaultPartWholePrompt(question: PartWholeQuestion): string {
  if (question.missing === "whole") {
    return `What do ${question.parts[0]} and ${question.parts[1]} make?`;
  }
  const known = partWholeKnown(question);
  return `What goes with ${known} to make ${question.whole}?`;
}

/** Spoken stem: numbers as words. */
export function defaultPartWholeSpoken(question: PartWholeQuestion): string {
  if (question.missing === "whole") {
    const a = numberWord(question.parts[0]);
    const b = numberWord(question.parts[1]);
    return `What do ${a} and ${b} make?`;
  }
  const known = partWholeKnown(question) ?? 0;
  return `What goes with ${numberWord(known)} to make ${numberWord(question.whole)}?`;
}

function shouldReplacePrompt(prompt: string): boolean {
  return PART_PROMPT.test(prompt) || WHOLE_PROMPT.test(prompt);
}

function shouldReplaceSpoken(spoken: string | undefined, prompt: string): boolean {
  if (spoken == null || spoken === "" || spoken === prompt) return true;
  return PART_SPOKEN.test(spoken) || WHOLE_SPOKEN.test(spoken);
}

/**
 * Fill the default cherry stem, spoken words, and 3 nearby choices.
 * JSON can still override the prompt. Choice order is shuffled in realize.
 */
export function applyPartWholeDefaults(question: Question): Question {
  if (question.kind !== "part-whole") return question;
  const nextChoices = partWholeChoices(question);
  const prompt = defaultPartWholePrompt(question);
  const keepPrompt = !shouldReplacePrompt(question.prompt);
  const spoken = defaultPartWholeSpoken(question);
  const writtenSpoken =
    typeof question.narration?.prompt === "string" ? question.narration.prompt : undefined;
  const nextSpoken =
    !keepPrompt && shouldReplaceSpoken(writtenSpoken, question.prompt) ? spoken : writtenSpoken;
  return {
    ...question,
    prompt: keepPrompt ? question.prompt : prompt,
    choices: nextChoices,
    narration: nextSpoken ? { ...question.narration, prompt: nextSpoken } : question.narration,
  };
}
