import type { Question } from "../types/activity";
import { matchSideKey } from "./matchSide";

function normaliseText(value: string): string {
  return value.trim().toLowerCase().replace(/\s+/g, " ");
}

function normaliseNumeric(value: string): string {
  const trimmed = value.trim().replace(/,/g, "");
  if (trimmed === "") return "";
  const asNumber = Number(trimmed);
  if (!Number.isFinite(asNumber)) return normaliseText(trimmed);
  return String(asNumber);
}

export function isAnswerCorrect(question: Question, answer: unknown): boolean {
  switch (question.kind) {
    case "count-objects":
    case "multiple-choice":
      return answer === question.correctId;
    case "multi-select": {
      if (!Array.isArray(answer)) return false;
      const selected = [...answer].map(String).sort();
      const correct = [...question.correctIds].sort();
      return (
        selected.length === correct.length &&
        selected.every((id, index) => id === correct[index])
      );
    }
    case "fill-blank": {
      if (typeof answer !== "string") return false;
      const candidates =
        question.inputMode === "text"
          ? [normaliseText(answer)]
          : [normaliseNumeric(answer), normaliseText(answer)];
      return question.acceptedAnswers.some((accepted) => {
        const normalisedAccepted =
          question.inputMode === "text"
            ? normaliseText(accepted)
            : normaliseNumeric(accepted);
        return candidates.includes(normalisedAccepted);
      });
    }
    case "ordered": {
      if (!Array.isArray(answer)) return false;
      return (
        answer.length === question.correctOrder.length &&
        answer.every((id, index) => id === question.correctOrder[index])
      );
    }
    case "match-pairs": {
      if (!answer || typeof answer !== "object") return false;
      const map = answer as Record<string, string>;
      return question.pairs.every((pair) => map[pair.id] === matchSideKey(pair.right));
    }
    default:
      return false;
  }
}

export function emptyAnswerFor(question: Question): unknown {
  switch (question.kind) {
    case "count-objects":
    case "multiple-choice":
      return null;
    case "multi-select":
      return [] as string[];
    case "fill-blank":
      return "";
    case "ordered":
      return question.items.map((item) => item.id);
    case "match-pairs":
      return Object.fromEntries(question.pairs.map((pair) => [pair.id, ""])) as Record<
        string,
        string
      >;
    default:
      return null;
  }
}

export function hasProvidedAnswer(question: Question, answer: unknown): boolean {
  switch (question.kind) {
    case "count-objects":
    case "multiple-choice":
      return typeof answer === "string" && answer.length > 0;
    case "multi-select":
      return Array.isArray(answer) && answer.length > 0;
    case "fill-blank":
      return typeof answer === "string" && answer.trim().length > 0;
    case "ordered":
      return Array.isArray(answer) && answer.length === question.items.length;
    case "match-pairs": {
      if (!answer || typeof answer !== "object") return false;
      const map = answer as Record<string, string>;
      return question.pairs.every((pair) => Boolean(map[pair.id]));
    }
    default:
      return false;
  }
}
