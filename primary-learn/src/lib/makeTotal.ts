import { numberWord } from "../data/objects";
import type { MakeTotalGap, MakeTotalOp, MakeTotalQuestion, ObjectItem, Question } from "../types/activity";

export function makeTotalPart(question: MakeTotalQuestion): number {
  if (question.part != null) return question.part;
  return question.visual?.count ?? 0;
}

export function makeTotalOther(question: MakeTotalQuestion): number {
  if (question.other != null) return question.other;
  return question.extras?.[0]?.count ?? 0;
}

export function makeTotalGap(question: MakeTotalQuestion): MakeTotalGap {
  return question.gap ?? "right";
}

export function makeTotalOp(question: MakeTotalQuestion): MakeTotalOp {
  return question.operation ?? "add";
}

/** The number the child should give for the ? box. */
export function makeTotalMissing(question: MakeTotalQuestion): number {
  const part = makeTotalPart(question);
  const gap = makeTotalGap(question);
  if (makeTotalOp(question) === "subtract") {
    return question.total - part;
  }
  if (gap === "total") return question.total;
  return question.total - part;
}

export function makeTotalItem(question: MakeTotalQuestion): ObjectItem {
  return question.visual?.item ?? "star";
}

export function makeTotalOtherItem(question: MakeTotalQuestion): ObjectItem {
  return question.extras?.[0]?.item ?? makeTotalItem(question);
}

export function makeTotalKnownCount(question: MakeTotalQuestion): number {
  if (makeTotalOp(question) === "subtract") return question.total;
  if (makeTotalGap(question) === "total") return makeTotalPart(question);
  return makeTotalPart(question);
}

/** Addable slots in fill-slots. More than the answer so the child can overshoot. */
export function makeTotalSlotBank(question: MakeTotalQuestion): number {
  if (question.slotCount != null) return question.slotCount;
  const missing = makeTotalMissing(question);
  return Math.min(12, Math.max(missing + 2, 2));
}

export function optionNumber(label: string | undefined): number | null {
  if (label == null || label.trim() === "") return null;
  const value = Number(label);
  return Number.isInteger(value) ? value : null;
}

const SUM_ONLY_TOTAL_PROMPT = /^What is \d+ [+\u2212\-] \d+\?$/;
const SUM_ONLY_TOTAL_SPOKEN =
  /^What is (?:zero|one|two|three|four|five|six|seven|eight|nine|ten|eleven|twelve|thirteen|fourteen|fifteen|sixteen|seventeen|eighteen|nineteen|twenty|\d+) (?:plus|take away) (?:zero|one|two|three|four|five|six|seven|eight|nine|ten|eleven|twelve|thirteen|fourteen|fifteen|sixteen|seventeen|eighteen|nineteen|twenty|\d+)\?$/;

function isSumOnlyBothAddends(question: MakeTotalQuestion): boolean {
  return question.mode === "sum-only" && makeTotalGap(question) === "total";
}

/** Visible stem for sum-only `a + b = ?` (or take-away). Null if this kind should keep its JSON prompt. */
export function defaultSumOnlyPrompt(question: MakeTotalQuestion): string | null {
  if (!isSumOnlyBothAddends(question)) return null;
  const a = makeTotalPart(question);
  const b = makeTotalOther(question);
  const sign = makeTotalOp(question) === "subtract" ? "−" : "+";
  return `What is ${a} ${sign} ${b}?`;
}

/** Spoken stem: numbers and operators as words. */
export function defaultSumOnlySpoken(question: MakeTotalQuestion): string | null {
  if (!isSumOnlyBothAddends(question)) return null;
  const a = numberWord(makeTotalPart(question));
  const b = numberWord(makeTotalOther(question));
  const op = makeTotalOp(question) === "subtract" ? "take away" : "plus";
  return `What is ${a} ${op} ${b}?`;
}

function isPicturedTotalPlaceholder(prompt: string): boolean {
  return prompt === "How many in all?" || prompt === "How many can you see in all?";
}

function shouldReplacePrompt(prompt: string): boolean {
  return (
    isPicturedTotalPlaceholder(prompt) ||
    SUM_ONLY_TOTAL_PROMPT.test(prompt) ||
    /missing number/i.test(prompt)
  );
}

function shouldReplaceSpoken(spoken: string | undefined, prompt: string): boolean {
  if (spoken == null || spoken === "" || isPicturedTotalPlaceholder(spoken) || spoken === prompt) {
    return true;
  }
  return SUM_ONLY_TOTAL_SPOKEN.test(spoken);
}

/**
 * Fill the default `What is a + b?` stem (and spoken words) from the numbers
 * on screen. JSON can still override with any other prompt.
 */
export function applyMakeTotalDefaults(question: Question): Question {
  if (question.kind !== "make-total") return question;
  const prompt = defaultSumOnlyPrompt(question);
  if (!prompt || !shouldReplacePrompt(question.prompt)) return question;
  const spoken = defaultSumOnlySpoken(question);
  const writtenSpoken =
    typeof question.narration?.prompt === "string" ? question.narration.prompt : undefined;
  const nextSpoken =
    spoken && shouldReplaceSpoken(writtenSpoken, question.prompt) ? spoken : writtenSpoken;
  return {
    ...question,
    prompt,
    narration: nextSpoken ? { ...question.narration, prompt: nextSpoken } : question.narration,
  };
}
