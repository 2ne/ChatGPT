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
  "build-set",
  "multiple-choice",
  "multi-select",
  "fill-blank",
  "ordered",
  "match-pairs",
  "make-total",
  "pick-pair",
  "part-whole",
] as const;

export type QuestionKind = (typeof QUESTION_KINDS)[number];

/** Named picture used by the object renderer. Glyphs live in the UI, not in content. */
export const OBJECT_ITEMS = [
  "apple",
  "banana",
  "star",
  "balloon",
  "car",
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

/** How object pictures are laid out. `row` is tidy one-to-one; `scatter` is a messier group; `dice` is a glance pattern to 6. */
export const OBJECT_LAYOUTS = ["row", "scatter", "dice"] as const;
export type ObjectLayout = (typeof OBJECT_LAYOUTS)[number];

export type QuestionOption = {
  id: string;
  label?: string;
  visual?: ObjectAsset;
};

/**
 * Spoken copy for the Web Speech API.
 * Only `prompt` is read aloud — never answers, options, pictured counts, or feedback.
 * A string is the spoken text. An object lets us later attach a pre-generated audio file.
 */
export type NarrationLine = string | { text: string; audioSrc?: string };

export type QuestionNarration = {
  /** Spoken question only. Same meaning as `prompt`; say `+` / `−` in words. Must not hint the answer. */
  prompt?: NarrationLine;
};

/**
 * Optional per-question (or activity-default) freshness.
 * Must not widen the difficulty band — counts stay inside `count.min`…`count.max`.
 */
export type RandomiseSpec = {
  /** Object pool. One item is picked per play (or mapped per original item). */
  items?: ObjectItem[];
  /** Inclusive count range. Omit to keep the written `visual.count`. */
  count?: { min: number; max: number };
  /** Shuffle multiple-choice / multi-select option order. */
  shuffleOptions?: boolean;
};

export type ActivityRandomise = {
  /** attempt = new draws each Start quest. seeded = stable (activity.seed or id). */
  mode?: "attempt" | "seeded";
  seed?: string;
  /** Default object pool for questions that set `randomise` without their own `items`. */
  items?: ObjectItem[];
};

type QuestionCore = {
  id: string;
  prompt: string;
  explanation: string;
  hint?: string;
  narration?: QuestionNarration;
  /** Optional object picture above the answers (also required on count-objects). */
  visual?: ObjectAsset;
  /** Extra pictures mixed in. The child counts `visual`, not these. */
  extras?: ObjectAsset[];
  /** Object layout. Omit for a tidy row. */
  layout?: ObjectLayout;
  randomise?: RandomiseSpec;
};

export type CountObjectsQuestion = QuestionCore & {
  kind: "count-objects";
  visual: ObjectAsset;
  options: QuestionOption[];
  correctId: string;
};

/** Tap objects from a tray to build a group of `visual.count`. */
export type BuildSetQuestion = QuestionCore & {
  kind: "build-set";
  visual: ObjectAsset;
  /** How many objects sit in the tray. Must be >= visual.count. Default is count + 2. */
  bank?: number;
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

/** How the child answers a part-whole sum. */
export const MAKE_TOTAL_MODES = ["fill-slots", "sum-only"] as const;
export type MakeTotalMode = (typeof MAKE_TOTAL_MODES)[number];

/** add: part + ? = total. subtract is reserved for tap-to-remove later. */
export const MAKE_TOTAL_OPS = ["add", "subtract"] as const;
export type MakeTotalOp = (typeof MAKE_TOTAL_OPS)[number];

/** Which box is the question mark. Default right (known + ? = total). */
export const MAKE_TOTAL_GAPS = ["left", "right", "total"] as const;
export type MakeTotalGap = (typeof MAKE_TOTAL_GAPS)[number];

/**
 * Part-whole sum. Easy (`fill-slots`) adds extra green tiles to the known part.
 * Medium may mix fill-slots and sum-only. Hard is the sum line only.
 * `total` may be 1–20 so later bonds to 10/20 reuse this.
 */
export type MakeTotalQuestion = QuestionCore & {
  kind: "make-total";
  /** The whole. 1–20. */
  total: number;
  /** Known addend. Defaults to `visual.count`. 0 is allowed (5 is 0 and 5). */
  part?: number;
  /** Second known addend when `gap` is `total`. Defaults to `extras[0].count`. */
  other?: number;
  gap?: MakeTotalGap;
  operation?: MakeTotalOp;
  mode: MakeTotalMode;
  /** How many addable slots in `fill-slots`. Default is the missing part plus 2. */
  slotCount?: number;
  /** Number buttons. Required for `sum-only`. */
  options?: QuestionOption[];
};

/**
 * Tap two number tiles that add to `total`. Easy shows quantity dots.
 * Hard hides the dots. Always four tiles and one pair. Finding every
 * pair is match-pairs. Medium difficulty is the numbers, not tile count.
 */
export type PickPairQuestion = QuestionCore & {
  kind: "pick-pair";
  /** The whole. 1–20 so later bonds to 10/20 reuse this. */
  total: number;
  /** Four unique numbers with exactly one pair that makes `total`. */
  tiles?: number[];
  /** Inclusive range used when `tiles` is omitted. */
  tileRange?: { min: number; max: number };
  /** How many tiles to draw from `tileRange`. Default 4, max 4. */
  tileCount?: number;
  /** Quantity dots on each tile. Default true. Hard sets false. */
  showDots?: boolean;
};

/** Which cherry circle is empty. */
export const PART_WHOLE_MISSING = ["left", "right", "whole"] as const;
export type PartWholeMissing = (typeof PART_WHOLE_MISSING)[number];

/**
 * Cherry number-bond model. One missing circle, three nearby number buttons.
 * Prompt is generated from `whole` / `parts` / `missing` unless JSON overrides.
 */
export type PartWholeQuestion = QuestionCore & {
  kind: "part-whole";
  /** The whole. 1–20. */
  whole: number;
  /** The two parts. They must add to `whole`. 0 is allowed. */
  parts: [number, number];
  missing: PartWholeMissing;
  /** Three number buttons. Default is the answer plus two nearby misses. */
  choices?: number[];
};

export type Question =
  | CountObjectsQuestion
  | BuildSetQuestion
  | MultipleChoiceQuestion
  | MultiSelectQuestion
  | FillBlankQuestion
  | OrderedQuestion
  | MatchPairsQuestion
  | MakeTotalQuestion
  | PickPairQuestion
  | PartWholeQuestion;

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
  /** Must equal `questions.length`. Default length is 10. */
  questionCount: number;
  /** Required to ship more than 10 questions. Say why the extra items are needed. */
  extraQuestions?: { reason: string };
  difficultyRamp: DifficultyRamp;
  skills: string[];
  randomise?: ActivityRandomise;
  questions: Question[];
};
