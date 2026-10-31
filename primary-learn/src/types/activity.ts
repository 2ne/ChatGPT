import type { AbilityBand, Subject, YearGroup } from "./curriculum";
import type { Difficulty } from "./path";
import type { ShapeAsset } from "./shapes";

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
  /** Starting group, or the whole group when `added` / `removed` is omitted. */
  count: number;
  /**
   * Join stories only. Extra group of the same `item`.
   * Stem shows `count` cream tiles, a purple +, then `added` light-blue tiles.
   * Totals over 10 use rows of 10. Look-only. Not tappable.
   */
  added?: number;
  /**
   * Take-away pictures only. How many of the last objects are taken away.
   * Stem shows `count` objects in one cream strip; the last `removed` sit on
   * light red tiles. Totals over 10 use rows of 10. Look-only. Not tappable.
   */
  removed?: number;
};

/**
 * How object pictures are laid out.
 * Picture groups (`row`, `scatter`, `dice`, `five-frame`, `tens-frame`) all draw
 * the same cream tiles with no empty cells. `scatter` messes the group.
 * `fingers` is a cartoon hand with 0 to 5 raised fingers (index first, thumb last).
 * `hidden` is a cup cover (pair with `flashMs`).
 */
export const OBJECT_LAYOUTS = [
  "row",
  "scatter",
  "dice",
  "five-frame",
  "tens-frame",
  "fingers",
  "hidden",
] as const;
export type ObjectLayout = (typeof OBJECT_LAYOUTS)[number];

/**
 * Structured ten frame. 1 frame for 0 to 10, 2 frames for 11 to 20.
 * Empty cells are shown. Filled cells use the object colour.
 * Not tappable. Fixed 2-frame footprint so options stay the same size.
 */
export type TenFrameAsset = {
  count: number;
  item?: ObjectItem;
  /**
   * Two-colour split that must add to `count`.
   * The second part uses a stripe pattern and an outline, not colour alone.
   */
  parts?: [number, number];
  /** Fill down columns so pairs sit together (odd and even). */
  pairs?: boolean;
};

/**
 * Separate clusters of the same object. Equal groups are [2, 2, 2].
 * Unequal groups are [2, 2, 3]. Look-only. Not tappable.
 */
export type GroupsAsset = {
  sizes: number[];
  item?: ObjectItem;
};

/**
 * Equal rows of the same object. 3 rows of 5 is the same total as 5 rows of 3.
 * Look-only. Not tappable.
 */
export type ArrayAsset = {
  rows: number;
  columns: number;
  item?: ObjectItem;
};

/** Pictorial comparison or recording in equal non-standard units. */
export type MeasureAsset = {
  kind: "length" | "height" | "mass" | "capacity" | "time";
  values: number[];
  labels?: string[];
  units?: boolean;
  gaps?: boolean;
  offsets?: number[];
};

/** A whole shape partitioned into halves or quarters. Look-only. */
export type FractionAsset = {
  shape: "rectangle" | "square" | "circle";
  parts: 2 | 4;
  shaded: number[];
  equal?: boolean;
  layout?: "vertical" | "horizontal" | "grid" | "diagonal";
};

/**
 * Structured tens and ones for 21 to 99.
 * Rods are neutral, not the question objects. Segmented on Easy, plain on Medium.
 */
export const BASE_TEN_STYLES = ["segmented", "plain"] as const;
export type BaseTenStyle = (typeof BASE_TEN_STYLES)[number];

export type BaseTenAsset = {
  tens: number;
  ones: number;
  style?: BaseTenStyle;
};

/** Standard dice face. 1 to 6 pips. Not tappable. */
export type DiceAsset = {
  count: number;
};

/**
 * Real number line. 0 to 10 or 0 to 20 with a tick every one.
 * 0 to 100 is stored as the full line, then shown as a zoomed window
 * (0 to 50, 50 to 100, or two tens either side of flags). Ticks every one,
 * tens labelled. A marked tick shows ? above the line. Labels stay below.
 * Flags A to D sit on an unmarked line and are not tappable.
 */
export const NUMBER_LINE_SCALES = ["ones", "tens"] as const;
export type NumberLineScale = (typeof NUMBER_LINE_SCALES)[number];

export type NumberLineFlag = {
  letter: "A" | "B" | "C" | "D";
  at: number;
};

/** Skip-count hops on a marked line. Omit to keep the ordinary labelled line. */
export type NumberLineJumps = {
  step: 2 | 5 | 10;
  /** Where the hops start. Default 0. */
  from?: number;
};

export type NumberLineAsset = {
  start: number;
  end: number;
  scale?: NumberLineScale;
  marked?: number;
  flags?: NumberLineFlag[];
  jumps?: NumberLineJumps;
};

/**
 * A 3 or 4 row window of a 1 to 100 square. Numerals only. Not tappable.
 * `start` is the first cell (1, 11, 21...). `missing` is the ? cell.
 */
export type HundredSquareAsset = {
  start: number;
  rows: 3 | 4;
  missing: number;
  highlight?: number;
};

export type QuestionOption = {
  id: string;
  shape?: ShapeAsset;
  label?: string;
  visual?: ObjectAsset;
  tenFrame?: TenFrameAsset;
  baseTen?: BaseTenAsset;
  dice?: DiceAsset;
  groups?: GroupsAsset;
  array?: ArrayAsset;
  fraction?: FractionAsset;
  measure?: MeasureAsset;
  /** Layout for option pictures (e.g. dice on “which group” so kids glance, not count). */
  layout?: ObjectLayout;
};

/**
 * Spoken copy for the Web Speech API.
 * Only `prompt` is read aloud on the question. Never answers, options, or pictured counts.
 * After a mark, the feedback speaker may read `explanation`.
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

export type PositionScene = { object: "tree" | "box" | "kite" | "bird"; relation: "behind" | "in-front" | "above" | "below" | "left" | "right" };

export type TurnDiagram = { start: 0 | 1 | 2 | 3; quarters: 1 | 2 | 3 | 4; clockwise: boolean; showEnd: boolean; interactive?: boolean };

type QuestionCore = {
  numberSequence?: (number | null)[];
  numberLine?: NumberLineAsset;
  hundredSquare?: HundredSquareAsset;
  position?: PositionScene;
  turn?: TurnDiagram;
  id: string;
  shape?: ShapeAsset;
  prompt: string;
  explanation: string;
  hint?: string;
  narration?: QuestionNarration;
  /** Optional object picture above the answers (also required on count-objects). */
  visual?: ObjectAsset;
  /** Optional ten frame above the answers. Do not mix with visual. */
  tenFrame?: TenFrameAsset;
  /** Optional tens-and-ones picture. Do not mix with visual or tenFrame. */
  baseTen?: BaseTenAsset;
  /** Optional equal or unequal clusters. Do not mix with visual, tenFrame or array. */
  groups?: GroupsAsset;
  /** Optional equal-row grid. Do not mix with visual, tenFrame or groups. */
  array?: ArrayAsset;
  fraction?: FractionAsset;
  measure?: MeasureAsset;
  /** Extra pictures mixed in. The child counts `visual`, not these. */
  extras?: ObjectAsset[];
  /** Object layout. Omit for a tidy row. */
  layout?: ObjectLayout;
  /**
   * Brief stem reveal in ms, then hide. Stops one-by-one counting on subitise items.
   * Child can tap Look again. Prefer 1200–2000 Easy, 800–1200 Medium, 500–800 Hard.
   */
  flashMs?: number;
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
  /**
   * Make this many equal groups. `visual.count` must be groupCount × groupSize.
   * Omit for a single group.
   */
  groupCount?: number;
  /** How many objects belong in each group when `groupCount` is set. */
  groupSize?: number;
};

export type MultipleChoiceQuestion = QuestionCore & {
  kind: "multiple-choice";
  options: QuestionOption[];
  correctId: string;
  /**
   * Number-to-amount pick. Shows this count in a lavender card and a 2x2
   * grid of picture groups. The correct option’s visual.count must match.
   */
  numeral?: number;
  /** Optional word on the number card. Omit to show the digit. */
  numeralLabel?: string;
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
  numericChoices?: number[];
  inputMode?: "numeric" | "text";
};

export type OrderedQuestion = QuestionCore & {
  kind: "ordered";
  items: QuestionOption[];
  correctOrder: string[];
};

/** A match side is a label, or a picture, or both. Optional layout for glanceable amounts. */
export type MatchSide =
  | string
  | {
      label?: string;
      visual?: ObjectAsset;
      tenFrame?: TenFrameAsset;
      baseTen?: BaseTenAsset;
      dice?: DiceAsset;
      groups?: GroupsAsset;
      array?: ArrayAsset;
      shape?: ShapeAsset;
      layout?: ObjectLayout;
    };

/** Single-pair matching. The only matching mode. */
export const MATCH_PAIRS_MODES = ["one-at-a-time"] as const;
export type MatchPairsMode = (typeof MATCH_PAIRS_MODES)[number];

export type MatchPairsQuestion = QuestionCore & {
  kind: "match-pairs";
  pairs: Array<{ id: string; left: MatchSide; right: MatchSide }>;
  /** Always one-at-a-time. Kept so existing JSON stays valid. */
  mode: MatchPairsMode;
  /** Easy and Medium: 3 sides. Hard: 4 sides. Must include the pair's right side. */
  choices: MatchSide[];
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
 * Tap two number tiles that add to `total`. Quantity dots on every level.
 * Always four tiles and one pair. Finding every pair is match-pairs.
 * Medium and Hard raise difficulty with the numbers, not by hiding dots.
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
  /** Quantity dots on each tile. Default true. Keep true on Hard too. */
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
