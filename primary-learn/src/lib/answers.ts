import { describeMeasure } from "./measures";
import { describeFraction } from "./fractions";
import { describeArray, describeBaseTen, describeGroups, describeTenFrame, describeVisual } from "../data/objects";
import type { MeasureAsset, FractionAsset, ArrayAsset, BaseTenAsset, BuildSetQuestion, GroupsAsset, Question, TenFrameAsset } from "../types/activity";
import { shapeName } from "./shapes";

function optionLabel(
  option:
    | {
        label?: string;
        shape?: import("../types/shapes").ShapeAsset;
        visual?: import("../types/activity").ObjectAsset;
        tenFrame?: TenFrameAsset;
        baseTen?: BaseTenAsset;
        dice?: { count: number };
        groups?: GroupsAsset;
        array?: ArrayAsset;
        fraction?: FractionAsset;
        measure?: MeasureAsset;
      }
    | undefined,
  slot: number,
): string | null {
  if (!option) return null;
  if (option.label) return option.label;
  if (option.shape) return `${shapeName(option.shape)} (${"ABCD"[slot]})`;
  if (option.tenFrame) return describeTenFrame(option.tenFrame);
  if (option.baseTen) return describeBaseTen(option.baseTen);
  if (option.dice) return `dice showing ${option.dice.count}`;
  if (option.groups) return describeGroups(option.groups);
  if (option.array) return describeArray(option.array);
  if (option.measure) return `${"ABCD"[slot]}. ${describeMeasure(option.measure)}`;
  if (option.fraction) return `${"ABCD"[slot]}. ${describeFraction(option.fraction)}`;
  if (option.visual) return describeVisual(option.visual);
  return null;
}

export type BuildGroupsAnswer = { groups: string[][] };

export function isBuildGroupsAnswer(value: unknown): value is BuildGroupsAnswer {
  return Boolean(value && typeof value === "object" && Array.isArray((value as BuildGroupsAnswer).groups));
}

function emptyBuildSetAnswer(question: BuildSetQuestion): unknown {
  if (question.groupCount) {
    return { groups: Array.from({ length: question.groupCount }, () => [] as string[]) };
  }
  return [] as string[];
}

function correctBuildSetAnswer(question: BuildSetQuestion): unknown {
  if (question.groupCount && question.groupSize) {
    const ids = Array.from({ length: question.visual.count }, (_, index) => String(index));
    const groups: string[][] = [];
    for (let g = 0; g < question.groupCount; g += 1) {
      groups.push(ids.slice(g * question.groupSize, (g + 1) * question.groupSize));
    }
    return { groups };
  }
  return Array.from({ length: question.visual.count }, (_, index) => String(index));
}
import { makeTotalMissing } from "./makeTotal";
import { matchSideKey, matchSideLabel } from "./matchSide";
import { partWholeAnswer } from "./partWhole";
import {
  emptyPickPairAnswer,
  isCompletePickPair,
  isPickPairAnswer,
  pickPairTiles,
  requiredTilePairs,
  uniquePairLabels,
} from "./pickPair";

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
    case "build-set": {
      if (question.groupCount && question.groupSize) {
        if (!isBuildGroupsAnswer(answer)) return false;
        if (answer.groups.length !== question.groupCount) return false;
        return answer.groups.every((group) => group.length === question.groupSize);
      }
      if (!Array.isArray(answer)) return false;
      return answer.length === question.visual.count;
    }
    case "make-total":
      return typeof answer === "number" && answer === makeTotalMissing(question);
    case "pick-pair":
      return isPickPairAnswer(answer) && isCompletePickPair(question, answer);
    case "part-whole":
      return typeof answer === "number" && answer === partWholeAnswer(question);
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
    case "build-set":
      return emptyBuildSetAnswer(question);
    case "make-total":
      return makeTotalMissing(question) === 0 && question.mode === "fill-slots" ? 0 : null;
    case "pick-pair":
      return emptyPickPairAnswer();
    case "part-whole":
      return null;
    default:
      return null;
  }
}

/** Correct answer value for pre-filling QuestionView (teacher review, reveal). */
export function correctAnswerFor(question: Question): unknown {
  switch (question.kind) {
    case "count-objects":
    case "multiple-choice":
      return question.correctId;
    case "multi-select":
      return [...question.correctIds];
    case "fill-blank":
      return question.acceptedAnswers[0] ?? "";
    case "ordered":
      return [...question.correctOrder];
    case "match-pairs":
      return Object.fromEntries(
        question.pairs.map((pair) => [pair.id, matchSideKey(pair.right)]),
      );
    case "build-set":
      return correctBuildSetAnswer(question);
    case "make-total":
      return makeTotalMissing(question);
    case "pick-pair": {
      const tiles = pickPairTiles(question);
      const pair = requiredTilePairs(tiles, question.total)[0];
      return pair ? { picked: [pair[0], pair[1]] } : emptyPickPairAnswer();
    }
    case "part-whole":
      return partWholeAnswer(question);
    default:
      return null;
  }
}

/** Correct answer text for the labelled feedback reveal and question bank. */
export function correctAnswerLabel(question: Question): string | null {
  switch (question.kind) {
    case "count-objects":
    case "multiple-choice":
      return optionLabel(question.options.find((option) => option.id === question.correctId), question.options.findIndex((option) => option.id === question.correctId));
    case "fill-blank":
      return question.acceptedAnswers[0] ?? null;
    case "multi-select": {
      const labels = question.correctIds
        .map((id) => optionLabel(question.options.find((option) => option.id === id), question.options.findIndex((option) => option.id === id)))
        .filter((label): label is string => Boolean(label));
      return labels.length ? labels.join(", ") : null;
    }
    case "build-set":
      return question.groupCount && question.groupSize
        ? `${question.groupCount} groups of ${question.groupSize}`
        : String(question.visual.count);
    case "make-total":
      return String(makeTotalMissing(question));
    case "part-whole":
      return String(partWholeAnswer(question));
    case "pick-pair": {
      const labels = uniquePairLabels(pickPairTiles(question), question.total);
      if (labels.length === 0) return null;
      return labels.join(" or ");
    }
    case "ordered": {
      const labels = question.correctOrder.map(
        (id) => question.items.find((item) => item.id === id)?.label ?? id,
      );
      return labels.length ? labels.join(", ") : null;
    }
    case "match-pairs": {
      const labels = question.pairs.map(
        (pair) => `${matchSideLabel(pair.left)} with ${matchSideLabel(pair.right)}`,
      );
      return labels.length ? labels.join(". ") : null;
    }
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
    case "build-set":
      if (isBuildGroupsAnswer(answer)) {
        return answer.groups.some((group) => group.length > 0);
      }
      return Array.isArray(answer) && answer.length > 0;
    case "make-total":
      return typeof answer === "number";
    case "pick-pair":
      return isPickPairAnswer(answer) && answer.picked.length === 2;
    case "part-whole":
      return typeof answer === "number";
    default:
      return false;
  }
}
