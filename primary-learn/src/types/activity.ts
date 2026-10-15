import type { AbilityBand, Subject, YearGroup } from "./curriculum";
import type { Difficulty } from "./path";

/** Pedagogical activity kinds. Extend this union when introducing a new format. */
export const ACTIVITY_TYPES = [
  "counting",
  "number-bonds",
  "times-tables",
  "fractions",
  "place-value",
  "reasoning",
] as const;

export type ActivityType = (typeof ACTIVITY_TYPES)[number];

export type QuestionOption = {
  id: string;
  label: string;
  /** Optional emoji or short visual cue shown beside the label. */
  visual?: string;
};

/**
 * Spoken copy for the Web Speech API.
 * A string is the spoken text. An object lets us later attach a pre-generated audio file.
 */
export type NarrationLine = string | { text: string; audioSrc?: string };

/**
 * Optional spoken versions of on-screen copy.
 * The runner falls back to the visible `prompt` / option labels / hint / explanation.
 * Write numbers, operators and emoji as words so a pre-reader hears the question.
 */
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
  /** Shown before the blank, e.g. "3 + 7 =" */
  prefix?: string;
  /** Shown after the blank */
  suffix?: string;
  /** Accepted answers after trim + lower-case (and numeric normalisation). */
  acceptedAnswers: string[];
  inputMode?: "numeric" | "text";
};

export type OrderedQuestion = QuestionCore & {
  kind: "ordered";
  items: QuestionOption[];
  /** Correct order of option ids. */
  correctOrder: string[];
};

export type MatchPairsQuestion = QuestionCore & {
  kind: "match-pairs";
  pairs: Array<{ id: string; left: string; right: string }>;
};

export type Question =
  | MultipleChoiceQuestion
  | MultiSelectQuestion
  | FillBlankQuestion
  | OrderedQuestion
  | MatchPairsQuestion;

/** How this quest sits on Easy / Medium / Hard, and how its own questions climb. */
export type DifficultyRamp = {
  /** First question → last question inside this quest. Must climb with no spikes. */
  within: string;
  /** How Easy / Medium / Hard differ on this same node. Write the missing levels as intent. */
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
  /** 0–1, typically 0.8 */
  masteryThreshold: number;
  curriculumRef: string;
  /** Map level this quest belongs to: a node id from curriculum/maths.md. */
  pathNode: string;
  /** 1 easy, 2 medium, 3 hard. Each level has at most one quest per difficulty. */
  difficulty: Difficulty;
  /** Required. Agents must describe the ramp before writing questions. */
  difficultyRamp: DifficultyRamp;
  skills: string[];
  questions: Question[];
};
