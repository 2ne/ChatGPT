import { copy } from "../data/copy";
import { describeVisual } from "../data/objects";
import type { NarrationLine, Question, QuestionOption } from "../types/activity";
import { matchSideLabel } from "./matchSide";

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

function optionSpoken(question: Question, option: QuestionOption): string {
  const fromNarration = question.narration?.options?.[option.id];
  if (fromNarration) return narrationText(fromNarration, option.label ?? "");
  if (option.visual) return describeVisual(option.visual);
  return option.label ?? "";
}

const LETTERS = ["A", "B", "C", "D", "E", "F"];

export function spokenChoices(question: Question): string {
  if (
    question.kind === "count-objects" ||
    question.kind === "multiple-choice" ||
    question.kind === "multi-select"
  ) {
    const parts = question.options.map((option, index) => {
      return `${LETTERS[index] ?? "next"}, ${optionSpoken(question, option)}`;
    });
    const lead = question.kind === "multi-select" ? copy.chooseAll : copy.spokenChoicesLead;
    return [lead, ...parts].join(" ");
  }

  if (question.kind === "fill-blank") {
    const prefix = narrationText(question.narration?.prefix, question.prefix ?? "");
    const suffix = narrationText(question.narration?.suffix, question.suffix ?? "");
    const bits = [prefix, prefix || suffix ? copy.spokenBlank : "", suffix].filter((part) =>
      part.trim(),
    );
    return bits.join(" ");
  }

  if (question.kind === "ordered") {
    const items = question.items.map((item) =>
      narrationText(question.narration?.items?.[item.id], item.label ?? ""),
    );
    return `${copy.spokenPiecesLead} ${items.join(". ")}.`;
  }

  if (question.kind === "match-pairs") {
    const lefts = question.pairs.map((pair) =>
      narrationText(question.narration?.pairs?.[pair.id]?.left, matchSideLabel(pair.left)),
    );
    const rights = question.pairs.map((pair) =>
      narrationText(question.narration?.pairs?.[pair.id]?.right, matchSideLabel(pair.right)),
    );
    return `${copy.spokenMatchLead} ${lefts.join(". ")}. To. ${rights.join(". ")}.`;
  }

  return "";
}
