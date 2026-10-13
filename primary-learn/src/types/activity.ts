import type { AbilityBand, Subject, YearGroup } from "./curriculum";

/** Pedagogical activity kinds. Extend this union when introducing a new format. */
export const ACTIVITY_TYPES = [
  "number-bonds",
  "phonics",
  "times-tables",
  "spelling",
  "reading-comprehension",
  "fractions",
  "place-value",
  "grammar",
  "science-concepts",
  "reasoning",
] as const;

export type ActivityType = (typeof ACTIVITY_TYPES)[number];

export type QuestionOption = {
  id: string;
  label: string;
  /** Optional emoji or short visual cue shown beside the label. */
  visual?: string;
};

export type MultipleChoiceQuestion = {
  kind: "multiple-choice";
  id: string;
  prompt: string;
  options: QuestionOption[];
  correctId: string;
  explanation: string;
  hint?: string;
};

export type MultiSelectQuestion = {
  kind: "multi-select";
  id: string;
  prompt: string;
  options: QuestionOption[];
  correctIds: string[];
  explanation: string;
  hint?: string;
};

export type FillBlankQuestion = {
  kind: "fill-blank";
  id: string;
  prompt: string;
  /** Shown before the blank, e.g. "3 + 7 =" */
  prefix?: string;
  /** Shown after the blank */
  suffix?: string;
  /** Accepted answers after trim + lower-case (and numeric normalisation). */
  acceptedAnswers: string[];
  inputMode?: "numeric" | "text";
  explanation: string;
  hint?: string;
};

export type OrderedQuestion = {
  kind: "ordered";
  id: string;
  prompt: string;
  items: QuestionOption[];
  /** Correct order of option ids. */
  correctOrder: string[];
  explanation: string;
  hint?: string;
};

export type MatchPairsQuestion = {
  kind: "match-pairs";
  id: string;
  prompt: string;
  pairs: Array<{ id: string; left: string; right: string }>;
  explanation: string;
  hint?: string;
};

export type Question =
  | MultipleChoiceQuestion
  | MultiSelectQuestion
  | FillBlankQuestion
  | OrderedQuestion
  | MatchPairsQuestion;

export type Activity = {
  id: string;
  title: string;
  summary: string;
  subject: Subject;
  type: ActivityType;
  yearGroups: YearGroup[];
  ability: AbilityBand;
  estimatedMinutes: number;
  /** 0–1, typically 0.8 */
  masteryThreshold: number;
  curriculumRef: string;
  skills: string[];
  questions: Question[];
};
