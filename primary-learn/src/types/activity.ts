import type { AbilityBand, Subject, YearGroup } from "./curriculum";
import type { Difficulty } from "./path";

/** Pedagogical activity kinds (topic), not question UI. */
export const ACTIVITY_TYPES = [
  "counting",
  "number-bonds",
  "times-tables",
  "fractions",
  "place-value",
  "reasoning",
] as const;

export type ActivityType = (typeof ACTIVITY_TYPES)[number];

/** Interaction kinds. One reusable component each. Content never embeds UI. */
export const QUESTION_KINDS = [
  "count-objects",
  "multiple-choice",
  "multi-select",
  "fill-blank",
  "ordered",
  "match-pairs",
] as const;

export type QuestionKind = (typeof QUESTION_KINDS)[number];

/** Named picture used by the object renderer. Glyphs live in the UI, not in content. */
export const OBJECT_ITEMS = [
  "apple",
  "star",
  "balloon",
  "duck",
  "ladybird",
  "frog",
  "fish",
  "strawberry",
  "sparkle",
] as const;

export type ObjectItem = (typeof OBJECT_ITEMS)[number];

export type ObjectAsset = {
  item: ObjectItem;
  count: number;
};

export type QuestionOption = {
  id: string;
  label?: string;
  visual?: ObjectAsset;
};

/**
 * Spoken copy for the Web Speech API.
 * A string is the spoken text. An object lets us later attach a pre-generated audio file.
 */
export type NarrationLine = string | { text: string; audioSrc?: string };

export type QuestionNarration = {
  prompt?: NarrationLine;
  options?: Record<string, NarrationLine>;
  items?: Record<string, NarrationLine>;
  pairs?: Record<string, { left?: NarrationLine; right?: NarrationLine }>;
  prefix?: NarrationLine;
  suffix?: NarrationLine;
  hint?: NarrationLine;
  explanation?: NarrationLine;
};

type QuestionCore = {
  id: string;
  prompt: string;
  explanation: string;
  hint?: string;
  narration?: QuestionNarration;
  /** Optional object picture above the answers (also required on count-objects). */
  visual?: ObjectAsset;
};

export type CountObjectsQuestion = QuestionCore & {
  kind: "count-objects";
  visual: ObjectAsset;
  options: QuestionOption[];
  correctId: string;
};

export type MultipleChoiceQuestion = QuestionCore & {
  kind: "multiple-choice";
  options: QuestionOption[];
  correctId: string;
};

export type MultiSelectQuestion = QuestionCore & {
  kind: "multi-select";
  options: QuestionOption[];
  correctIds: string[];
};

export type FillBlankQuestion = QuestionCore & {
  kind: "fill-blank";
  prefix?: string;
  suffix?: string;
  acceptedAnswers: string[];
  inputMode?: "numeric" | "text";
};

export type OrderedQuestion = QuestionCore & {
  kind: "ordered";
  items: QuestionOption[];
  correctOrder: string[];
};

/** A match side is a label, or a picture, or both. */
export type MatchSide = string | { label?: string; visual?: ObjectAsset };

export type MatchPairsQuestion = QuestionCore & {
  kind: "match-pairs";
  pairs: Array<{ id: string; left: MatchSide; right: MatchSide }>;
};

export type Question =
  | CountObjectsQuestion
  | MultipleChoiceQuestion
  | MultiSelectQuestion
  | FillBlankQuestion
  | OrderedQuestion
  | MatchPairsQuestion;

export type DifficultyRamp = {
  within: string;
  versus: string;
};

export type Activity = {
  id: string;
  title: string;
  summary: string;
  subject: Subject;
  type: ActivityType;
  yearGroups: YearGroup[];
  ability: AbilityBand;
  estimatedMinutes: number;
  masteryThreshold: number;
  curriculumRef: string;
  pathNode: string;
  /** 1 easy, 2 medium, 3 hard. */
  difficulty: Difficulty;
  /** Must equal `questions.length`. Listed so a catalogue edit is obvious. */
  questionCount: number;
  difficultyRamp: DifficultyRamp;
  skills: string[];
  questions: Question[];
};
