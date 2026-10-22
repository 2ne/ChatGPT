import type { NarrationLine, Question } from "../types/activity";
import { defaultFillBlankSpoken } from "./fillBlank";
import { defaultSumOnlySpoken } from "./makeTotal";
import { defaultPartWholeSpoken } from "./partWhole";

export function narrationText(line: NarrationLine | undefined, fallback: string): string {
  if (line == null) return fallback;
  return typeof line === "string" ? line : line.text;
}

export function narrationAudio(line: NarrationLine | undefined): string | undefined {
  if (line && typeof line !== "string") return line.audioSrc;
  return undefined;
}

/**
 * Spoken question only. Never options, pictured counts, hints, or explanations —
 * those give the answer away to pre-readers.
 */
export function spokenPrompt(question: Question): string {
  if (question.kind === "make-total") {
    const spoken = defaultSumOnlySpoken(question);
    if (spoken) {
      const written = narrationText(question.narration?.prompt, "");
      if (
        !written ||
        written === "How many in all?" ||
        written === "How many can you see in all?" ||
        written === question.prompt
      ) {
        return spoken;
      }
    }
  }
  if (question.kind === "part-whole") {
    const spoken = defaultPartWholeSpoken(question);
    const written = narrationText(question.narration?.prompt, "");
    if (!written || written === question.prompt) return spoken;
  }
  if (question.kind === "fill-blank") {
    const spoken = defaultFillBlankSpoken(question);
    if (spoken) {
      const written = narrationText(question.narration?.prompt, "");
      if (!written || written === question.prompt || /missing number/i.test(written)) {
        return spoken;
      }
    }
  }
  return narrationText(question.narration?.prompt, question.prompt);
}
