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

/** Number pad. Default 0…whole. When the whole is missing, still 0…whole. */
export function partWholeChoices(question: PartWholeQuestion): number[] {
  if (question.choices && question.choices.length > 0) return question.choices;
  return Array.from({ length: question.whole + 1 }, (_, index) => index);
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
 * Fill the default cherry stem (and spoken words) from the numbers on screen.
 * JSON can still override with any other prompt.
 */
export function applyPartWholeDefaults(question: Question): Question {
  if (question.kind !== "part-whole") return question;
  const nextChoices =
    question.choices && question.choices.length > 0 ? question.choices : partWholeChoices(question);
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
