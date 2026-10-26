import { OBJECT_WORDS, numberWord } from "../data/objects";
import type {
  Activity,
  ActivityRandomise,
  MatchSide,
  NarrationLine,
  ObjectAsset,
  ObjectItem,
  Question,
  TenFrameAsset,
  QuestionNarration,
  QuestionOption,
  RandomiseSpec,
} from "../types/activity";
import { applyStemPromptDefaults } from "./fillBlank";
import { applyMakeTotalDefaults } from "./makeTotal";
import { applyPartWholeDefaults } from "./partWhole";
import { drawPickPairTiles } from "./pickPair";

type Rng = () => number;

/** Deterministic 0…1 RNG from a 32-bit seed (Mulberry32). */
export function mulberry32(seed: number): Rng {
  let t = seed >>> 0;
  return () => {
    t += 0x6d2b79f5;
    let r = Math.imul(t ^ (t >>> 15), t | 1);
    r ^= r + Math.imul(r ^ (r >>> 7), r | 61);
    return ((r ^ (r >>> 14)) >>> 0) / 4294967296;
  };
}

export function hashString(value: string): number {
  let hash = 2166136261;
  for (let i = 0; i < value.length; i += 1) {
    hash ^= value.charCodeAt(i);
    hash = Math.imul(hash, 16777619);
  }
  return hash >>> 0;
}

function uniqueItems(items: ObjectItem[]): ObjectItem[] {
  return [...new Set(items)];
}

function shuffle<T>(list: T[], rng: Rng): T[] {
  const next = [...list];
  for (let i = next.length - 1; i > 0; i -= 1) {
    const j = Math.floor(rng() * (i + 1));
    const a = next[i];
    const b = next[j];
    if (a === undefined || b === undefined) continue;
    next[i] = b;
    next[j] = a;
  }
  return next;
}

function pickInt(rng: Rng, min: number, max: number): number {
  return min + Math.floor(rng() * (max - min + 1));
}

function capitalize(value: string): string {
  if (!value) return value;
  return value.charAt(0).toUpperCase() + value.slice(1);
}

function sideItem(side: MatchSide): ObjectItem | undefined {
  if (typeof side === "string") return undefined;
  return side.visual?.item ?? side.tenFrame?.item;
}

/** Distinct object items that appear on a question, in first-seen order. */
export function collectItems(question: Question): ObjectItem[] {
  const found: ObjectItem[] = [];
  const add = (item?: ObjectItem) => {
    if (item && !found.includes(item)) found.push(item);
  };
  if (question.visual) add(question.visual.item);
  if (question.tenFrame?.item) add(question.tenFrame.item);
  if (question.extras) {
    for (const extra of question.extras) add(extra.item);
  }
  if ("options" in question && question.options) {
    for (const option of question.options) {
      add(option.visual?.item);
      add(option.tenFrame?.item);
    }
  }
  if (question.kind === "ordered") {
    for (const item of question.items) {
      add(item.visual?.item);
      add(item.tenFrame?.item);
    }
  }
  if (question.kind === "match-pairs") {
    for (const pair of question.pairs) {
      add(sideItem(pair.left));
      add(sideItem(pair.right));
    }
    if (question.choices) {
      for (const side of question.choices) add(sideItem(side));
    }
  }
  return found;
}

function mapItems(
  originals: ObjectItem[],
  pool: ObjectItem[],
  rng: Rng,
): Map<ObjectItem, ObjectItem> {
  const map = new Map<ObjectItem, ObjectItem>();
  if (originals.length === 0) return map;
  const source = uniqueItems(pool.length > 0 ? pool : originals);
  const picks = shuffle(source, rng);
  originals.forEach((original, index) => {
    map.set(original, picks[index % picks.length] ?? original);
  });
  return map;
}

function remapVisual(
  visual: ObjectAsset | undefined,
  itemMap: Map<ObjectItem, ObjectItem>,
  count?: number,
): ObjectAsset | undefined {
  if (!visual) return undefined;
  const next: ObjectAsset = {
    item: itemMap.get(visual.item) ?? visual.item,
    count: count ?? visual.count,
  };
  if (visual.added != null) next.added = visual.added;
  if (visual.removed != null) next.removed = visual.removed;
  return next;
}

function remapTenFrame(
  frame: TenFrameAsset | undefined,
  itemMap: Map<ObjectItem, ObjectItem>,
): TenFrameAsset | undefined {
  if (!frame) return undefined;
  const item = frame.item ?? "apple";
  return { ...frame, item: itemMap.get(item) ?? item };
}

function remapSide(side: MatchSide, itemMap: Map<ObjectItem, ObjectItem>): MatchSide {
  if (typeof side === "string") return side;
  return {
    ...side,
    visual: remapVisual(side.visual, itemMap),
    tenFrame: remapTenFrame(side.tenFrame, itemMap),
  };
}

function applyText(text: string, vars: Record<string, string>): string {
  return text.replace(/\{([A-Za-z0-9]+)\}/g, (all, key: string) => vars[key] ?? all);
}

function applyOptional(text: string | undefined, vars: Record<string, string>): string | undefined {
  return text == null ? text : applyText(text, vars);
}

function applyLine(line: NarrationLine | undefined, vars: Record<string, string>): NarrationLine | undefined {
  if (line == null) return line;
  if (typeof line === "string") return applyText(line, vars);
  return { ...line, text: applyText(line.text, vars) };
}

function applyNarration(
  narration: QuestionNarration | undefined,
  vars: Record<string, string>,
): QuestionNarration | undefined {
  if (!narration) return narration;
  return { prompt: applyLine(narration.prompt, vars) };
}

function templateVars(
  primary: ObjectItem | undefined,
  secondary: ObjectItem | undefined,
  count: number | undefined,
): Record<string, string> {
  const first = primary ? OBJECT_WORDS[primary] : undefined;
  const second = secondary ? OBJECT_WORDS[secondary] : first;
  const vars: Record<string, string> = {};
  if (first) {
    vars.item = first.singular;
    vars.items = first.plural;
    vars.Item = capitalize(first.singular);
    vars.Items = capitalize(first.plural);
  }
  if (second) {
    vars.item2 = second.singular;
    vars.items2 = second.plural;
  }
  if (count != null) {
    vars.count = String(count);
    vars.word = numberWord(count);
    vars.seq = Array.from({ length: count }, (_, index) => String(index + 1)).join(", ");
  }
  return vars;
}

function isNumericOptions(options: QuestionOption[]): boolean {
  return options.every(
    (option) =>
      option.label != null &&
      !option.visual &&
      Number.isInteger(Number(option.label)),
  );
}

function nearbyCounts(correct: number, need: number, min: number, max: number): number[] {
  const found: number[] = [];
  for (let delta = 1; found.length < need && delta < 24; delta += 1) {
    const below = correct - delta;
    const above = correct + delta;
    if (below >= min) found.push(below);
    if (found.length >= need) break;
    if (above <= max) found.push(above);
  }
  return found.slice(0, need);
}

function retargetNumericOptions(
  options: QuestionOption[],
  correctId: string,
  count: number,
  min: number,
  max: number,
): QuestionOption[] {
  const extras = nearbyCounts(count, options.length - 1, min, max);
  const next: QuestionOption[] = [];
  for (const option of options) {
    if (option.id === correctId) {
      next.push({ ...option, label: String(count) });
      continue;
    }
    const label = extras.shift();
    // Band may be too tight for 4 unique numbers — drop leftover slots rather than duplicate.
    if (label == null) continue;
    next.push({ ...option, label: String(label) });
  }
  return next;
}

function applyStrings(question: Question, vars: Record<string, string>): Question {
  const next = structuredClone(question);
  next.prompt = applyText(next.prompt, vars);
  next.explanation = applyText(next.explanation, vars);
  next.hint = applyOptional(next.hint, vars);
  next.narration = applyNarration(next.narration, vars);

  if ("options" in next && next.options) {
    next.options = next.options.map((option) => ({
      ...option,
      label: applyOptional(option.label, vars),
    }));
  }
  if (next.kind === "fill-blank") {
    next.prefix = applyOptional(next.prefix, vars);
    next.suffix = applyOptional(next.suffix, vars);
    next.acceptedAnswers = next.acceptedAnswers.map((answer) => applyText(answer, vars));
  }
  if (next.kind === "ordered") {
    next.items = next.items.map((item) => ({
      ...item,
      label: applyOptional(item.label, vars),
    }));
  }
  if (next.kind === "match-pairs") {
    next.pairs = next.pairs.map((pair) => ({
      ...pair,
      left: typeof pair.left === "string" ? applyText(pair.left, vars) : {
        ...pair.left,
        label: applyOptional(pair.left.label, vars),
      },
      right: typeof pair.right === "string" ? applyText(pair.right, vars) : {
        ...pair.right,
        label: applyOptional(pair.right.label, vars),
      },
    }));
    if (next.choices) {
      next.choices = next.choices.map((side) =>
        typeof side === "string"
          ? applyText(side, vars)
          : { ...side, label: applyOptional(side.label, vars) },
      );
    }
  }
  return next;
}

function realizePickPair(question: Question, rng: Rng): Question {
  if (question.kind !== "pick-pair") return question;
  const next = structuredClone(question);
  if (!next.tiles?.length && next.tileRange) {
    next.tiles = drawPickPairTiles(next, rng);
  }
  if (next.randomise?.shuffleOptions && next.tiles) {
    next.tiles = shuffle(next.tiles, rng);
  }
  return next;
}

function realizeQuestion(
  question: Question,
  activityRandomise: ActivityRandomise | undefined,
  rng: Rng,
): Question {
  const spec: RandomiseSpec | undefined = question.randomise;
  if (!spec || question.kind === "pick-pair") {
    const items = collectItems(question);
    const next = question.kind === "pick-pair" ? realizePickPair(question, rng) : question;
    return applyStrings(next, templateVars(items[0], items[1], question.visual?.count));
  }

  const pool = spec.items ?? activityRandomise?.items ?? [];
  const originals = collectItems(question);
  const itemMap = mapItems(originals, pool, rng);

  let primary = originals[0] ? itemMap.get(originals[0]) : undefined;
  let secondary = originals[1] ? itemMap.get(originals[1]) : undefined;
  if (!primary && pool.length > 0) {
    const picks = shuffle(uniqueItems(pool), rng);
    primary = picks[0];
    secondary = picks[1] ?? picks[0];
  }
  if (!secondary) secondary = primary;

  const writtenCount = question.visual?.count;
  const count = spec.count
    ? pickInt(rng, spec.count.min, spec.count.max)
    : writtenCount;
  const countChanged = spec.count != null && count !== writtenCount;

  let next: Question = structuredClone(question);
  next.visual = remapVisual(
    next.visual,
    itemMap,
    question.kind === "make-total" ? undefined : count,
  );
  next.tenFrame = remapTenFrame(next.tenFrame, itemMap);
  if (next.extras) {
    next.extras = next.extras.map((asset) => remapVisual(asset, itemMap) ?? asset);
  }

  if ("options" in next && next.options) {
    next.options = next.options.map((option) => ({
      ...option,
      visual: remapVisual(option.visual, itemMap),
      tenFrame: remapTenFrame(option.tenFrame, itemMap),
    }));
  }
  if (next.kind === "ordered") {
    next.items = next.items.map((item) => ({
      ...item,
      visual: remapVisual(item.visual, itemMap),
      tenFrame: remapTenFrame(item.tenFrame, itemMap),
    }));
  }
  if (next.kind === "match-pairs") {
    next.pairs = next.pairs.map((pair) => ({
      ...pair,
      left: remapSide(pair.left, itemMap),
      right: remapSide(pair.right, itemMap),
    }));
    if (next.choices) {
      next.choices = next.choices.map((side) => remapSide(side, itemMap));
    }
  }

  if (
    countChanged &&
    count != null &&
    (next.kind === "count-objects" || next.kind === "multiple-choice") &&
    isNumericOptions(next.options)
  ) {
    const min = spec.count?.min ?? 1;
    const max = spec.count?.max ?? 12;
    next.options = retargetNumericOptions(next.options, next.correctId, count, min, max);
  }

  if (countChanged && count != null && next.kind === "fill-blank") {
    const word = numberWord(count);
    next.acceptedAnswers = word && word !== String(count) ? [String(count), word] : [String(count)];
  }

  if (countChanged && count != null && next.kind === "build-set") {
    const written = question.visual?.count ?? count;
    const extraSlots = (next.bank ?? Math.min(12, written + 2)) - written;
    next.bank = Math.min(12, Math.max(count, count + extraSlots));
  }

  const vars = templateVars(primary, secondary, count);
  next = applyStrings(next, vars);

  if (
    spec.shuffleOptions &&
    (next.kind === "count-objects" ||
      next.kind === "multiple-choice" ||
      next.kind === "multi-select" ||
      next.kind === "make-total")
  ) {
    if (next.options) next.options = shuffle(next.options, rng);
  }
  return next;
}

/** Seed used for this play. `seeded` is stable; `attempt` (default) is fresh each Start. */
export function playSeed(activity: Activity): string {
  const spec = activity.randomise;
  if (spec?.mode === "seeded") return spec.seed ?? activity.id;
  return `${activity.id}:${Date.now().toString(36)}:${Math.random().toString(36).slice(2, 10)}`;
}

/**
 * Apply optional `randomise` draws. The source activity is not mutated.
 * Retries should reuse this result so the child sees the same apples/count.
 */
export function realizeActivity(activity: Activity, seed?: string): Activity {
  const resolved = seed ?? playSeed(activity);
  const rng = mulberry32(hashString(resolved));
  return {
    ...activity,
    questions: activity.questions.map((question) => {
      const realized = applyStemPromptDefaults(
        applyPartWholeDefaults(
          applyMakeTotalDefaults(realizeQuestion(question, activity.randomise, rng)),
        ),
      );
      if (realized.kind !== "part-whole" || !realized.choices) return realized;
      return { ...realized, choices: shuffle(realized.choices, rng) };
    }),
  };
}
