import type { NarrationLine, Question } from "../types/activity";

export function narrationText(line: NarrationLine | undefined, fallback: string): string {
  if (line == null) return fallback;
  return typeof line === "string" ? line : line.text;
}

export function narrationAudio(line: NarrationLine | undefined): string | undefined {
  if (line && typeof line !== "string") return line.audioSrc;
  return undefined;
}

export function spokenPrompt(question: Question): string {
  return narrationText(question.narration?.prompt, question.prompt);
}

export function spokenHint(question: Question): string {
  return narrationText(question.narration?.hint, question.hint ?? "");
}

export function spokenExplanation(question: Question): string {
  return narrationText(question.narration?.explanation, question.explanation);
}

const LETTERS = ["A", "B", "C", "D", "E", "F"];

export function spokenChoices(question: Question): string {
  if (question.kind === "multiple-choice" || question.kind === "multi-select") {
    const parts = question.options.map((option, index) => {
      const spoken = narrationText(question.narration?.options?.[option.id], option.label);
      return `${LETTERS[index] ?? "next"}, ${spoken}`;
    });
    const lead = question.kind === "multi-select" ? "Choose all that apply." : "The choices are.";
    return [lead, ...parts].join(" ");
  }

  if (question.kind === "fill-blank") {
    const prefix = narrationText(question.narration?.prefix, question.prefix ?? "");
    const suffix = narrationText(question.narration?.suffix, question.suffix ?? "");
    const bits = [prefix, prefix || suffix ? "blank" : "", suffix].filter((part) => part.trim());
    return bits.join(" ");
  }

  if (question.kind === "ordered") {
    const items = question.items.map((item) =>
      narrationText(question.narration?.items?.[item.id], item.label),
    );
    return `The pieces are. ${items.join(". ")}.`;
  }

  if (question.kind === "match-pairs") {
    const lefts = question.pairs.map((pair) =>
      narrationText(question.narration?.pairs?.[pair.id]?.left, pair.left),
    );
    const rights = question.pairs.map((pair) =>
      narrationText(question.narration?.pairs?.[pair.id]?.right, pair.right),
    );
    return `Match each one. ${lefts.join(". ")}. To. ${rights.join(". ")}.`;
  }

  return "";
}
