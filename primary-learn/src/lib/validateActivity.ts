import { ABILITY_BANDS, SUBJECTS, YEAR_GROUPS } from "../types/curriculum";
import {
  ACTIVITY_TYPES,
  BASE_TEN_STYLES,
  MAKE_TOTAL_GAPS,
  MAKE_TOTAL_MODES,
  MAKE_TOTAL_OPS,
  MATCH_PAIRS_MODES,
  OBJECT_ITEMS,
  OBJECT_LAYOUTS,
  PART_WHOLE_MISSING,
  QUESTION_KINDS,
  type Activity,
  type ActivityRandomise,
  type BaseTenAsset,
  type DiceAsset,
  type MakeTotalGap,
  type MakeTotalMode,
  type MakeTotalOp,
  type MatchPairsMode,
  type MatchSide,
  type ObjectAsset,
  type ObjectItem,
  type PartWholeMissing,
  type Question,
  type QuestionOption,
  type RandomiseSpec,
  type TenFrameAsset,
} from "../types/activity";
import { isResultBlank, parseBareEquation } from "./fillBlank";
import { makeTotalMissing, makeTotalOther, makeTotalPart, optionNumber } from "./makeTotal";
import { matchSideKey, matchSideRepresentation } from "./matchSide";
import { defaultPartWholeChoices, partWholeAnswer } from "./partWhole";
import { canDrawPickPair } from "./pickPair";
import { SHAPE_NAMES, SHAPE_COLOURS, type ShapeAsset } from "../types/shapes";
import { SHAPE_VARIANTS } from "./shapes";

function parseShape(value: unknown, path: string): ShapeAsset | undefined {
  if (value == null) return undefined;
  if (!isRecord(value)) fail(path, "shape must be an object");
  const name = expectString(value, "name", path) as ShapeAsset["name"];
  if (!(SHAPE_NAMES as readonly string[]).includes(name)) fail(path, "unknown shape name");
  const variant = value.variant == null ? undefined : expectString(value, "variant", path);
  if (variant && !SHAPE_VARIANTS[name].includes(variant)) fail(path, `unsupported variant for ${name}`);
  const colour = value.colour == null ? undefined : expectString(value, "colour", path);
  if (colour && !(SHAPE_COLOURS as readonly string[]).includes(colour)) fail(path, "unknown shape colour");
  const rotation = value.rotation == null ? undefined : expectNumber(value, "rotation", path);
  if (rotation != null && (rotation < 0 || rotation >= 360)) fail(path, "shape rotation must be from 0 up to 360");
  const scale = value.scale == null ? undefined : expectNumber(value, "scale", path);
  if (scale != null && (scale < 0.6 || scale > 1)) fail(path, "shape scale must be from 0.6 to 1");
  return { name, variant: variant as ShapeAsset["variant"], colour: colour as ShapeAsset["colour"], rotation, scale };
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return Boolean(value) && typeof value === "object" && !Array.isArray(value);
}

function isString(value: unknown): value is string {
  return typeof value === "string";
}

function fail(path: string, message: string): never {
  throw new Error(`Activity ${path}: ${message}`);
}

/** Sam/Mia stories that name one object must not mix a second emoji in extras. */
function storyNamesOneObject(prompt: string): boolean {
  if (!/\b(Sam|Mia)\b/.test(prompt)) return false;
  if (!/\{items?\}/.test(prompt)) return false;
  if (/\{items?2\}/.test(prompt)) return false;
  if (/only wants|can he take/i.test(prompt)) return false;
  return true;
}

const STORY_OBJECT = String.raw`(?:\{items?\}|[A-Za-z]+)`;
const STORY_COUNT_MAX = 20;

/** Start-plus-more stories. Pictured ones need visual.added of the same item. */
function storyIsJoin(prompt: string): boolean {
  return /\b(gives (him|her)|gets) \d+ more\b/i.test(prompt);
}

function parseJoinAmounts(prompt: string): { start: number; added: number } | null {
  const story = prompt.match(
    new RegExp(
      String.raw`\b(?:has|have) (\d+) ${STORY_OBJECT}\b[\s\S]{0,48}?\b(?:gives (?:him|her)|gets) (\d+) more\b`,
      "i",
    ),
  );
  if (!story) return null;
  return { start: Number(story[1]), added: Number(story[2]) };
}

/** Give-away or eat stories. Sum-only “What is n take away m?” is not a story. */
function parseTakeAwayStory(prompt: string): { start: number; taken: number } | null {
  const allAway = prompt.match(
    new RegExp(String.raw`\b(?:has|have) (\d+) ${STORY_OBJECT} and gives them all away\b`, "i"),
  );
  if (allAway) {
    const start = Number(allAway[1]);
    return { start, taken: start };
  }
  const story = prompt.match(
    new RegExp(
      String.raw`\b(?:has|have) (\d+) ${STORY_OBJECT}(?: and|\.)?(?: (?:He|She))? (?:gives away|eats) (\d+)\b`,
      "i",
    ),
  );
  if (story) return { start: Number(story[1]), taken: Number(story[2]) };
  return null;
}

/** Take-away amounts from a pictured sum or give-away/eat story. */
function parseTakeAwayAmounts(prompt: string): { start: number; taken: number } | null {
  const sum = prompt.match(/^What is (\d+) take away (\d+)\?$/i);
  if (sum) return { start: Number(sum[1]), taken: Number(sum[2]) };
  return parseTakeAwayStory(prompt);
}

function assertNoFactTrueWording(text: string, path: string, field: string) {
  if (/\b(fact|true)\b/i.test(text)) {
    fail(
      path,
      `${field} must not say fact or true to a child. For number sentences use Select every correct sum.`,
    );
  }
}

function expectString(record: Record<string, unknown>, key: string, path: string): string {
  const value = record[key];
  if (!isString(value) || value.trim() === "") fail(path, `${key} must be a non-empty string`);
  return value;
}

function expectNumber(record: Record<string, unknown>, key: string, path: string): number {
  const value = record[key];
  if (typeof value !== "number" || !Number.isFinite(value)) fail(path, `${key} must be a number`);
  return value;
}

function expectArray(record: Record<string, unknown>, key: string, path: string): unknown[] {
  const value = record[key];
  if (!Array.isArray(value)) fail(path, `${key} must be an array`);
  return value;
}

function expectVisual(
  value: unknown,
  path: string,
  allowAdded = false,
  allowZero = false,
): ObjectAsset {
  if (!isRecord(value)) fail(path, "visual must be { item, count }");
  const item = value.item;
  const count = value.count;
  if (!isString(item) || !(OBJECT_ITEMS as readonly string[]).includes(item)) {
    fail(path, `visual.item must be one of ${OBJECT_ITEMS.join(", ")}`);
  }
  const min = allowZero ? 0 : 1;
  if (typeof count !== "number" || !Number.isInteger(count) || count < min || count > STORY_COUNT_MAX) {
    fail(path, `visual.count must be a whole number from ${min} to ${STORY_COUNT_MAX}`);
  }
  if (value.added != null && value.removed != null) {
    fail(path, "visual cannot use added and removed together");
  }
  if (value.added == null && value.removed == null) {
    return { item: item as ObjectAsset["item"], count };
  }
  if (!allowAdded) {
    fail(path, "visual.added and visual.removed are only for look-only story stems, not options or extras");
  }
  if (value.added != null) {
    const added = value.added;
    if (typeof added !== "number" || !Number.isInteger(added) || added < 1 || added > STORY_COUNT_MAX) {
      fail(path, `visual.added must be a whole number from 1 to ${STORY_COUNT_MAX}`);
    }
    if (count + added > STORY_COUNT_MAX) {
      fail(path, `visual.count plus visual.added must be at most ${STORY_COUNT_MAX}`);
    }
    return { item: item as ObjectAsset["item"], count, added };
  }
  const removed = value.removed;
  if (typeof removed !== "number" || !Number.isInteger(removed) || removed < 1 || removed > count) {
    fail(path, "visual.removed must be a whole number from 1 to visual.count");
  }
  return { item: item as ObjectAsset["item"], count, removed };
}

/** Part-whole pictures may be empty (0) and can grow to 20 for later tens. */
function parseMakeTotalVisual(value: unknown, path: string): ObjectAsset | undefined {
  if (value == null) return undefined;
  if (!isRecord(value)) fail(path, "visual must be { item, count }");
  if (value.added != null || value.removed != null) {
    fail(path, "make-total cannot use visual.added or visual.removed. Story pictures use look-only stems.");
  }
  const item = value.item;
  const count = value.count;
  if (!isString(item) || !(OBJECT_ITEMS as readonly string[]).includes(item)) {
    fail(path, `visual.item must be one of ${OBJECT_ITEMS.join(", ")}`);
  }
  if (typeof count !== "number" || !Number.isInteger(count) || count < 0 || count > 20) {
    fail(path, "visual.count must be a whole number from 0 to 20");
  }
  return { item: item as ObjectAsset["item"], count };
}

function optionalVisual(
  record: Record<string, unknown>,
  path: string,
  allowAdded = false,
  allowZero = false,
): ObjectAsset | undefined {
  if (record.visual == null) return undefined;
  return expectVisual(record.visual, `${path}.visual`, allowAdded, allowZero);
}

function assertFingersVisual(visual: ObjectAsset | undefined, path: string) {
  if (!visual) fail(path, "fingers layout needs a visual");
  if (visual.count < 0 || visual.count > 5) {
    fail(path, "fingers layout needs visual.count from 0 to 5");
  }
  if (visual.added != null || visual.removed != null) {
    fail(path, "fingers cannot use visual.added or visual.removed");
  }
}

function parseExtras(record: Record<string, unknown>, path: string): ObjectAsset[] | undefined {
  if (record.extras == null) return undefined;
  const list = expectArray(record, "extras", path);
  if (list.length === 0) fail(path, "extras must not be empty if set");
  return list.map((asset, index) => expectVisual(asset, `${path}.extras[${index}]`));
}

function parseMakeTotalExtras(record: Record<string, unknown>, path: string): ObjectAsset[] | undefined {
  if (record.extras == null) return undefined;
  const list = expectArray(record, "extras", path);
  if (list.length === 0) fail(path, "extras must not be empty if set");
  return list.map((asset, index) => {
    const parsed = parseMakeTotalVisual(asset, `${path}.extras[${index}]`);
    if (!parsed) fail(`${path}.extras[${index}]`, "visual must be { item, count }");
    return parsed;
  });
}

function parseTenFrame(value: unknown, path: string): TenFrameAsset {
  if (!isRecord(value)) fail(path, "tenFrame must be { count }");
  const count = expectNumber(value, "count", path);
  if (!Number.isInteger(count) || count < 0 || count > 20) {
    fail(path, "tenFrame.count must be a whole number from 0 to 20");
  }
  let item: ObjectItem | undefined;
  if (value.item != null) {
    if (!isString(value.item) || !(OBJECT_ITEMS as readonly string[]).includes(value.item)) {
      fail(path, `tenFrame.item must be one of ${OBJECT_ITEMS.join(", ")}`);
    }
    item = value.item as ObjectItem;
  }
  let parts: [number, number] | undefined;
  if (value.parts != null) {
    const list = expectArray(value, "parts", path);
    if (list.length !== 2) fail(path, "tenFrame.parts must be two whole numbers");
    const a = list[0];
    const b = list[1];
    if (typeof a !== "number" || typeof b !== "number" || !Number.isInteger(a) || !Number.isInteger(b) || a < 0 || b < 0) {
      fail(path, "tenFrame.parts must be two whole numbers from 0");
    }
    if (a + b !== count) fail(path, "tenFrame.parts must add to count");
    parts = [a, b];
  }
  let pairs: boolean | undefined;
  if (value.pairs != null) {
    if (typeof value.pairs !== "boolean") fail(path, "tenFrame.pairs must be boolean");
    pairs = value.pairs;
  }
  return { count, item, parts, pairs };
}

function optionalTenFrame(record: Record<string, unknown>, path: string): TenFrameAsset | undefined {
  if (record.tenFrame == null) return undefined;
  return parseTenFrame(record.tenFrame, `${path}.tenFrame`);
}

function parseBaseTen(value: unknown, path: string): BaseTenAsset {
  if (!isRecord(value)) fail(path, "baseTen must be { tens, ones }");
  const tens = expectNumber(value, "tens", path);
  const ones = expectNumber(value, "ones", path);
  if (!Number.isInteger(tens) || tens < 0 || tens > 9) {
    fail(path, "baseTen.tens must be a whole number from 0 to 9");
  }
  if (!Number.isInteger(ones) || ones < 0 || ones > 9) {
    fail(path, "baseTen.ones must be a whole number from 0 to 9");
  }
  let style: BaseTenAsset["style"];
  if (value.style != null) {
    if (typeof value.style !== "string" || !(BASE_TEN_STYLES as readonly string[]).includes(value.style)) {
      fail(path, "baseTen.style must be segmented or plain");
    }
    style = value.style as BaseTenAsset["style"];
  }
  return style ? { tens, ones, style } : { tens, ones };
}

function optionalBaseTen(record: Record<string, unknown>, path: string): BaseTenAsset | undefined {
  if (record.baseTen == null) return undefined;
  return parseBaseTen(record.baseTen, `${path}.baseTen`);
}

function parseDice(value: unknown, path: string): DiceAsset {
  if (!isRecord(value)) fail(path, "dice must be { count }");
  const count = expectNumber(value, "count", path);
  if (!Number.isInteger(count) || count < 1 || count > 6) {
    fail(path, "dice.count must be a whole number from 1 to 6");
  }
  return { count };
}

function optionalDice(record: Record<string, unknown>, path: string): DiceAsset | undefined {
  if (record.dice == null) return undefined;
  return parseDice(record.dice, `${path}.dice`);
}

function parseLayout(record: Record<string, unknown>, path: string): Question["layout"] {
  if (record.layout == null) return undefined;
  if (typeof record.layout !== "string" || !(OBJECT_LAYOUTS as readonly string[]).includes(record.layout)) {
    fail(
      path,
      "layout must be row, scatter, dice, five-frame, tens-frame, fingers or hidden",
    );
  }
  return record.layout as Question["layout"];
}

function parseFlashMs(record: Record<string, unknown>, path: string): number | undefined {
  if (record.flashMs == null) return undefined;
  const flashMs = expectNumber(record, "flashMs", path);
  if (!Number.isInteger(flashMs) || flashMs < 300 || flashMs > 4000) {
    fail(path, "flashMs must be a whole number from 300 to 4000");
  }
  return flashMs;
}

function parseOption(value: unknown, path: string, allowShape = false): QuestionOption {
  if (!isRecord(value)) fail(path, "option must be an object");
  const id = expectString(value, "id", path);
  const label = value.label == null ? undefined : expectString(value, "label", path);
  const layout = parseLayout(value, path);
  if (layout === "hidden") {
    fail(path, "option layout cannot be hidden");
  }
  const visual = optionalVisual(value, path, false, layout === "fingers");
  if (layout === "fingers") assertFingersVisual(visual, path);
  const tenFrame = optionalTenFrame(value, path);
  const baseTen = optionalBaseTen(value, path);
  const dice = optionalDice(value, path);
  const shape = parseShape(value.shape, `${path}.shape`);
  if (shape && !allowShape) fail(path, "shape options use multiple-choice or multi-select");
  if (shape && visual) fail(path, "option cannot mix object and shape pictures");
  if (tenFrame && (visual || shape || baseTen || dice)) fail(path, "option cannot mix a ten frame with another picture");
  if (baseTen && (visual || shape || dice)) fail(path, "option cannot mix tens and ones with another picture");
  if (dice && (visual || shape)) fail(path, "option cannot mix a dice face with another picture");
  if (tenFrame && layout) fail(path, "ten frames do not use layout");
  if (baseTen && layout) fail(path, "tens and ones do not use layout");
  if (dice && layout) fail(path, "dice faces do not use layout");
  if (!label && !visual && !shape && !tenFrame && !baseTen && !dice) fail(path, "option needs a label or a picture");
  return { id, label, visual, tenFrame, baseTen, dice, shape, layout };
}

function parseMatchSide(value: unknown, path: string): MatchSide {
  if (isString(value)) {
    if (value.trim() === "") fail(path, "match side cannot be empty");
    return value;
  }
  if (!isRecord(value)) fail(path, "match side must be a string or { label, visual }");
  const label = value.label == null ? undefined : expectString(value, "label", path);
  const layout = parseLayout(value, path);
  if (layout === "hidden") {
    fail(path, "match side layout cannot be hidden");
  }
  const visual = optionalVisual(value, path, false, layout === "fingers");
  if (layout === "fingers") assertFingersVisual(visual, path);
  const tenFrame = optionalTenFrame(value, path);
  const baseTen = optionalBaseTen(value, path);
  const dice = optionalDice(value, path);
  const shape = parseShape(value.shape, `${path}.shape`);
  if (shape && visual) fail(path, "match side cannot mix object and shape pictures");
  if (tenFrame && (visual || shape || baseTen || dice)) fail(path, "match side cannot mix a ten frame with another picture");
  if (baseTen && (visual || shape || dice)) fail(path, "match side cannot mix tens and ones with another picture");
  if (dice && (visual || shape)) fail(path, "match side cannot mix a dice face with another picture");
  if (tenFrame && layout) fail(path, "ten frames do not use layout");
  if (baseTen && layout) fail(path, "tens and ones do not use layout");
  if (dice && layout) fail(path, "dice faces do not use layout");
  if (!label && !visual && !shape && !tenFrame && !baseTen && !dice) fail(path, "match side needs a label or a picture");
  return { label, visual, tenFrame, baseTen, dice, shape, layout };
}

function parseNarration(value: unknown, path: string): Question["narration"] {
  if (value == null) return undefined;
  if (!isRecord(value)) fail(path, "narration must be an object");
  return value as Question["narration"];
}

function parseObjectItems(value: unknown, path: string): ObjectItem[] {
  if (!Array.isArray(value) || value.length === 0) {
    fail(path, "items must be a non-empty array of object names");
  }
  for (const item of value) {
    if (!isString(item) || !(OBJECT_ITEMS as readonly string[]).includes(item)) {
      fail(path, `unknown item "${String(item)}". Use one of ${OBJECT_ITEMS.join(", ")}`);
    }
  }
  return value as ObjectItem[];
}

function parseRandomiseSpec(value: unknown, path: string): RandomiseSpec | undefined {
  if (value == null) return undefined;
  if (!isRecord(value)) fail(path, "randomise must be an object");
  const spec: RandomiseSpec = {};
  if (value.items != null) spec.items = parseObjectItems(value.items, `${path}.items`);
  if (value.count != null) {
    if (!isRecord(value.count)) fail(`${path}.count`, "must be { min, max }");
    const min = expectNumber(value.count, "min", `${path}.count`);
    const max = expectNumber(value.count, "max", `${path}.count`);
    if (!Number.isInteger(min) || !Number.isInteger(max) || min < 1 || max > 12 || min > max) {
      fail(`${path}.count`, "min and max must be whole numbers 1–12 with min ≤ max");
    }
    spec.count = { min, max };
  }
  if (value.shuffleOptions != null) {
    if (typeof value.shuffleOptions !== "boolean") fail(path, "shuffleOptions must be true or false");
    spec.shuffleOptions = value.shuffleOptions;
  }
  return spec;
}

function parseActivityRandomise(value: unknown, path: string): ActivityRandomise | undefined {
  if (value == null) return undefined;
  if (!isRecord(value)) fail(path, "randomise must be an object");
  const spec: ActivityRandomise = {};
  if (value.mode != null) {
    if (value.mode !== "attempt" && value.mode !== "seeded") {
      fail(path, "mode must be attempt or seeded");
    }
    spec.mode = value.mode;
  }
  if (value.seed != null) spec.seed = expectString(value, "seed", path);
  if (value.items != null) spec.items = parseObjectItems(value.items, `${path}.items`);
  return spec;
}

function parseQuestion(value: unknown, path: string): Question {
  if (!isRecord(value)) fail(path, "question must be an object");
  const kind = expectString(value, "kind", path);
  if (!(QUESTION_KINDS as readonly string[]).includes(kind)) {
    fail(path, `unknown kind "${kind}". Add a component + schema entry first.`);
  }
  const id = expectString(value, "id", path);
  const prompt = expectString(value, "prompt", path);
  const explanation = expectString(value, "explanation", path);
  const hint = value.hint == null ? undefined : expectString(value, "hint", path);
  const narration = parseNarration(value.narration, `${path}.narration`);
  assertNoFactTrueWording(prompt, path, "prompt");
  assertNoFactTrueWording(explanation, path, "explanation");
  if (hint) assertNoFactTrueWording(hint, path, "hint");
  const spokenLine =
    narration && typeof narration.prompt === "string"
      ? narration.prompt
      : narration && typeof narration.prompt === "object"
        ? narration.prompt.text
        : "";
  if (spokenLine) assertNoFactTrueWording(spokenLine, path, "narration");
  const extras =
    kind === "make-total" ? parseMakeTotalExtras(value, path) : parseExtras(value, path);
  const layout = parseLayout(value, path);
  const visual =
    kind === "make-total"
      ? parseMakeTotalVisual(value.visual, `${path}.visual`)
      : optionalVisual(value, path, true, layout === "fingers");
  const tenFrame = optionalTenFrame(value, path);
  const baseTen = optionalBaseTen(value, path);
  const flashMs = parseFlashMs(value, path);
  if (layout === "hidden" && flashMs == null) {
    fail(path, "layout hidden needs flashMs so the child can peek");
  }
  if (layout === "fingers") {
    assertFingersVisual(visual, path);
  }
  if ((layout === "five-frame" || layout === "tens-frame") && visual) {
    const max = layout === "five-frame" ? 5 : 10;
    if (visual.count < 1 || visual.count > max) {
      fail(path, `${layout} needs visual.count from 1 to ${max}`);
    }
  }
  if (visual?.added != null) {
    if (kind === "count-objects" || kind === "build-set" || kind === "make-total") {
      fail(path, "visual.added is for look-only join stories, not tap-to-count or make-total");
    }
    if (extras) {
      fail(path, "join pictures use visual.added of the same item. Do not set extras.");
    }
    if (layout && layout !== "row") {
      fail(path, "join pictures use a row. Do not set dice, scatter or other layouts.");
    }
    if (flashMs != null) {
      fail(path, "join pictures cannot use flashMs");
    }
  }
  if (visual?.removed != null) {
    if (kind === "count-objects" || kind === "build-set" || kind === "make-total") {
      fail(path, "visual.removed is for look-only take-away pictures, not tap-to-count or make-total");
    }
    if (extras) {
      fail(path, "take-away pictures use visual.removed of the same item. Do not set extras.");
    }
    if (layout && layout !== "row") {
      fail(path, "take-away pictures use a cream strip. Do not set dice, scatter or other layouts.");
    }
    if (flashMs != null) {
      fail(path, "take-away pictures cannot use flashMs");
    }
  }
  const takeAway = parseTakeAwayAmounts(prompt);
  if (takeAway && visual) {
    if (visual.removed == null) {
      fail(path, "take-away pictures need visual.removed for how many are taken away");
    }
    if (visual.count !== takeAway.start || visual.removed !== takeAway.taken) {
      fail(
        path,
        `take-away pictures must match the sum. visual.count is the start (${takeAway.start}) and visual.removed is taken away (${takeAway.taken})`,
      );
    }
  }
  if (visual && extras) {
    for (const extra of extras) {
      if (extra.item === visual.item) {
        fail(path, "extras.item must be a different object from visual.item");
      }
    }
    if (storyNamesOneObject(prompt)) {
      fail(
        path,
        "story pictures must show the object named in the text. Do not use extras of a different item when the prompt names only one object. Use visual.count and visual.added of the same item for a join story.",
      );
    }
  }
  const joinStory = parseJoinAmounts(prompt);
  if (storyIsJoin(prompt)) {
    if (!visual) {
      fail(path, "join stories need a look-only picture of the named object");
    }
    if (visual.added == null) {
      fail(
        path,
        "join story pictures need visual.added for the extra group of the same item",
      );
    }
    if (joinStory && (visual.count !== joinStory.start || visual.added !== joinStory.added)) {
      fail(
        path,
        `join pictures must match the story. visual.count is the start (${joinStory.start}) and visual.added is the extra group (${joinStory.added})`,
      );
    }
  }
  const takeAwayStory = parseTakeAwayStory(prompt);
  if (takeAwayStory && !visual) {
    fail(path, "take-away stories need a look-only picture of the named object");
  }
  const randomise = parseRandomiseSpec(value.randomise, `${path}.randomise`);
  if (visual?.added != null && randomise?.count) {
    fail(path, "do not randomise count on a join story");
  }
  if (visual?.removed != null && randomise?.count) {
    fail(path, "do not randomise count on a take-away picture");
  }
  const shape = parseShape(value.shape, `${path}.shape`);
  if (shape && (visual || extras || layout || flashMs != null || tenFrame || baseTen)) fail(path, "shape stems cannot mix object picture fields");
  if (shape && kind !== "multiple-choice" && kind !== "multi-select") fail(path, "shape stems use choice questions");
  if (tenFrame && (visual || extras || layout || flashMs != null || baseTen)) {
    fail(path, "ten frame stems cannot mix object picture fields");
  }
  if (tenFrame && kind !== "multiple-choice" && kind !== "multi-select" && kind !== "fill-blank") {
    fail(path, "ten frame stems use choice or fill-blank questions");
  }
  if (baseTen && (visual || extras || layout || flashMs != null)) {
    fail(path, "tens and ones stems cannot mix object picture fields");
  }
  if (baseTen && kind !== "multiple-choice" && kind !== "multi-select" && kind !== "fill-blank") {
    fail(path, "tens and ones stems use choice or fill-blank questions");
  }
  let turn: import("../types/activity").TurnDiagram | undefined;
  if (value.turn != null) {
    const t = value.turn;
    if (!isRecord(t) || ![0, 1, 2, 3].includes(t.start as number) || ![1, 2, 3, 4].includes(t.quarters as number) || typeof t.clockwise !== "boolean" || typeof t.showEnd !== "boolean") fail(path, "invalid turn diagram");
    if (kind !== "multiple-choice" || visual || shape || extras || layout || flashMs != null || tenFrame || baseTen) fail(path, "turn diagrams use multiple-choice without other stem pictures");
    turn = { start: t.start as 0 | 1 | 2 | 3, quarters: t.quarters as 1 | 2 | 3 | 4, clockwise: t.clockwise, showEnd: t.showEnd, interactive: t.interactive === true };
    if (t.interactive != null && typeof t.interactive !== "boolean") fail(path, "interactive must be boolean");
    if (t.interactive && t.showEnd) fail(path, "interactive turns must not show the answer");
  }
  let position: import("../types/activity").PositionScene | undefined;
  if (value.position != null) {
    const p = value.position;
    if (!isRecord(p) || !["tree", "box", "kite", "bird"].includes(p.object as string) || !["behind", "in-front", "above", "below", "left", "right"].includes(p.relation as string)) fail(path, "invalid position scene");
    if (kind !== "multiple-choice" || turn || shape || visual || extras || layout || flashMs != null || tenFrame || baseTen) fail(path, "position scenes use choice questions without other pictures");
    position = p as unknown as typeof position;
  }
  let numberLine: import("../types/activity").NumberLineAsset | undefined;
  if (value.numberLine != null) {
    const n = value.numberLine;
    if (!isRecord(n) || !Number.isInteger(n.start) || !Number.isInteger(n.end)) fail(path, "number line needs whole numbers");
    const start = n.start as number;
    const end = n.end as number;
    if (start !== 0 || (end !== 10 && end !== 20 && end !== 100)) fail(path, "number line is 0 to 10, 0 to 20 or 0 to 100");
    const scale = n.scale == null ? (end <= 20 ? "ones" : "tens") : n.scale;
    if (scale !== "ones" && scale !== "tens") fail(path, "number line scale must be ones or tens");
    if (end <= 20 && scale !== "ones") fail(path, "0 to 10 and 0 to 20 use a tick every one");
    if (end === 100 && scale !== "tens") fail(path, "0 to 100 uses a tick every ten");
    let marked: number | undefined;
    if (n.marked != null) {
      marked = expectNumber(n, "marked", `${path}.numberLine`);
      if (!Number.isInteger(marked) || marked < start || marked > end) fail(path, "marked tick must sit on the line");
    }
    let flags: import("../types/activity").NumberLineFlag[] | undefined;
    if (n.flags != null) {
      const list = expectArray(n, "flags", `${path}.numberLine`);
      if (list.length !== 4) fail(path, "number line flags need A, B, C and D");
      const letters = new Set<string>();
      flags = list.map((flag, i) => {
        const fp = `${path}.numberLine.flags[${i}]`;
        if (!isRecord(flag) || !["A", "B", "C", "D"].includes(flag.letter as string) || !Number.isInteger(flag.at)) {
          fail(fp, "flag needs letter A to D and a whole number");
        }
        if (letters.has(flag.letter as string)) fail(fp, "flag letters must be unique");
        letters.add(flag.letter as string);
        if ((flag.at as number) < start || (flag.at as number) > end) fail(fp, "flag must sit on the line");
        return { letter: flag.letter as "A" | "B" | "C" | "D", at: flag.at as number };
      });
      if (letters.size !== 4) fail(path, "number line flags need A, B, C and D");
    }
    if (marked == null && !flags) fail(path, "number line needs a marked tick or flags");
    if (kind !== "multiple-choice" && kind !== "fill-blank") fail(path, "number lines use choice or fill-blank questions");
    if (visual || extras || layout || flashMs != null || tenFrame || baseTen || shape || turn || position) {
      fail(path, "number lines cannot mix with other stem pictures");
    }
    numberLine = { start, end, scale, marked, flags };
  }
  let hundredSquare: import("../types/activity").HundredSquareAsset | undefined;
  if (value.hundredSquare != null) {
    const s = value.hundredSquare;
    if (!isRecord(s) || !Number.isInteger(s.start) || !Number.isInteger(s.rows) || !Number.isInteger(s.missing)) {
      fail(path, "hundred square needs start, rows and missing");
    }
    const start = s.start as number;
    const rows = s.rows as number;
    const missing = s.missing as number;
    if (start < 1 || start > 91 || (start - 1) % 10 !== 0) fail(path, "hundred square start must be 1, 11, 21...");
    if (rows !== 3 && rows !== 4) fail(path, "hundred square shows 3 or 4 rows");
    const last = start + rows * 10 - 1;
    if (last > 100) fail(path, "hundred square window must stay inside 1 to 100");
    if (missing < start || missing > last) fail(path, "missing cell must sit in the window");
    let highlight: number | undefined;
    if (s.highlight != null) {
      highlight = expectNumber(s, "highlight", `${path}.hundredSquare`);
      if (!Number.isInteger(highlight) || highlight < start || highlight > last) fail(path, "highlight must sit in the window");
      if (highlight === missing) fail(path, "highlight cannot be the missing cell");
    }
    if (kind !== "multiple-choice" && kind !== "fill-blank") fail(path, "hundred squares use choice or fill-blank questions");
    if (numberLine || visual || extras || layout || flashMs != null || tenFrame || baseTen || shape || turn || position) {
      fail(path, "hundred squares cannot mix with other stem pictures");
    }
    hundredSquare = { start, rows: rows as 3 | 4, missing, highlight };
  }
  const core = { numberLine, hundredSquare, id, prompt, explanation, hint, narration, visual, tenFrame, baseTen, shape, turn, position, extras, layout, flashMs, randomise };
  if (parseBareEquation(prompt)) {
    fail(
      path,
      "do not use a bare equation as the prompt when the answer is the result. Use What is {a} + {b}? or What is {a} − {b}?.",
    );
  }

  switch (kind) {
    case "count-objects": {
      if (!visual) fail(path, "count-objects needs visual { item, count }");
      const options = expectArray(value, "options", path).map((option, i) =>
        parseOption(option, `${path}.options[${i}]`),
      );
      const correctId = expectString(value, "correctId", path);
      if (!options.some((option) => option.id === correctId)) {
        fail(path, "correctId must match an option id");
      }
      return { ...core, kind, visual, options, correctId };
    }
    case "build-set": {
      if (!visual) fail(path, "build-set needs visual { item, count }");
      let bank: number | undefined;
      if (value.bank != null) {
        bank = expectNumber(value, "bank", path);
        if (!Number.isInteger(bank) || bank < visual.count || bank > 12) {
          fail(path, "bank must be a whole number from visual.count to 12");
        }
      }
      return { ...core, kind, visual, bank };
    }
    case "multiple-choice": {
      const options = expectArray(value, "options", path).map((option, i) =>
        parseOption(option, `${path}.options[${i}]`, true),
      );
      if (options.some((option) => option.shape) && options.some((option) => option.visual)) fail(path, "shape choices cannot mix in object pictures");
      const correctId = expectString(value, "correctId", path);
      if (!options.some((option) => option.id === correctId)) {
        fail(path, "correctId must match an option id");
      }
      if (turn?.interactive) {
        const expected = String((turn.clockwise ? 1 : -1) * turn.quarters);
        const ids = options.map((option) => option.id);
        const signed = new Set(["-4", "-3", "-2", "-1", "1", "2", "3", "4"]);
        if (
          correctId !== expected ||
          options.length < 3 ||
          options.length > 4 ||
          new Set(ids).size !== options.length ||
          !ids.includes(expected) ||
          options.some((option) => !signed.has(option.id))
        ) {
          fail(path, "interactive turn options must encode 3 or 4 signed movements including the requested correct movement");
        }
      }
      if (storyNamesOneObject(prompt)) {
        const items = options.flatMap((option) => (option.visual ? [option.visual.item] : []));
        if (new Set(items).size > 1) {
          fail(
            path,
            "story pictures must show the object named in the text. All groups must use the same item.",
          );
        }
      }
      let numeral: number | undefined;
      let numeralLabel: string | undefined;
      if (value.numeral != null) {
        numeral = expectNumber(value, "numeral", path);
        if (!Number.isInteger(numeral) || numeral < 1 || numeral > 12) {
          fail(path, "numeral must be a whole number from 1 to 12");
        }
        if (prompt !== "Tap the {items} that match the number below.") {
          fail(path, 'numeral picture picks use prompt Tap the {items} that match the number below.');
        }
        if (visual) fail(path, "numeral picture picks show the number card, not a stem picture");
        if (options.length !== 4) fail(path, "numeral picture picks need exactly 4 picture options");
        const items = new Set<string>();
        const counts = new Set<number>();
        for (const option of options) {
          if (!option.visual || option.label) {
            fail(path, "numeral options must be a picture with no label");
          }
          if (option.layout && option.layout !== "row") {
            fail(path, "numeral picture groups use a tidy row");
          }
          items.add(option.visual.item);
          counts.add(option.visual.count);
        }
        if (items.size !== 1) fail(path, "all picture groups must use the same item");
        if (counts.size !== 4) fail(path, "each picture group needs a different count");
        const correct = options.find((option) => option.id === correctId);
        if (correct?.visual?.count !== numeral) {
          fail(path, "the correct group must have visual.count equal to numeral");
        }
        if (core.randomise?.count) fail(path, "do not randomise count on a numeral picture pick");
        if (value.numeralLabel != null) {
          numeralLabel = expectString(value, "numeralLabel", path);
        }
      }
      return { ...core, kind, options, correctId, numeral, numeralLabel };
    }
    case "multi-select": {
      const options = expectArray(value, "options", path).map((option, i) =>
        parseOption(option, `${path}.options[${i}]`, true),
      );
      if (options.some((option) => option.shape) && options.some((option) => option.visual)) fail(path, "shape choices cannot mix in object pictures");
      const correctIds = expectArray(value, "correctIds", path);
      if (!correctIds.every(isString) || correctIds.length === 0) {
        fail(path, "correctIds must be a non-empty string array");
      }
      for (const id of correctIds) {
        if (!options.some((option) => option.id === id)) fail(path, `correctIds unknown id ${id}`);
      }
      return { ...core, kind, options, correctIds: correctIds as string[] };
    }
    case "fill-blank": {
      const acceptedAnswers = expectArray(value, "acceptedAnswers", path);
      if (!acceptedAnswers.every(isString) || acceptedAnswers.length === 0) {
        fail(path, "acceptedAnswers must be a non-empty string array");
      }
      const prefix = value.prefix == null ? undefined : expectString(value, "prefix", path);
      const suffix = value.suffix == null ? undefined : expectString(value, "suffix", path);
      const inputMode = value.inputMode;
      if (inputMode != null && inputMode !== "numeric" && inputMode !== "text") {
        fail(path, "inputMode must be numeric or text");
      }
      if (isResultBlank(prefix, suffix) && /missing number/i.test(prompt)) {
        fail(
          path,
          "result blank must not say 'missing number'. Use What is {a} + {b}? or What is {a} − {b}?.",
        );
      }
      const spoken =
        narration && typeof narration.prompt === "string"
          ? narration.prompt
          : narration && typeof narration.prompt === "object"
            ? narration.prompt.text
            : "";
      if (isResultBlank(prefix, suffix) && spoken && /missing number/i.test(spoken)) {
        fail(
          path,
          "result blank narration must not say 'missing number'. Speak What is five take away two?.",
        );
      }
      return {
        ...core,
        kind,
        acceptedAnswers: acceptedAnswers as string[],
        prefix,
        suffix,
        inputMode: inputMode === "text" || inputMode === "numeric" ? inputMode : undefined,
      };
    }
    case "ordered": {
      const items = expectArray(value, "items", path).map((item, i) =>
        parseOption(item, `${path}.items[${i}]`),
      );
      const correctOrder = expectArray(value, "correctOrder", path);
      if (!correctOrder.every(isString) || correctOrder.length !== items.length) {
        fail(path, "correctOrder must list every item id once");
      }
      return { ...core, kind, items, correctOrder: correctOrder as string[] };
    }
    case "match-pairs": {
      const pairs = expectArray(value, "pairs", path).map((pair, i) => {
        const pairPath = `${path}.pairs[${i}]`;
        if (!isRecord(pair)) fail(pairPath, "pair must be an object");
        return {
          id: expectString(pair, "id", pairPath),
          left: parseMatchSide(pair.left, `${pairPath}.left`),
          right: parseMatchSide(pair.right, `${pairPath}.right`),
        };
      });
      const writtenMode = expectString(value, "mode", path);
      if (!(MATCH_PAIRS_MODES as readonly string[]).includes(writtenMode)) {
        fail(path, "mode must be one-at-a-time");
      }
      if (pairs.length !== 1) {
        fail(path, "matching needs exactly 1 pair");
      }
      const choices = expectArray(value, "choices", path).map((side, i) =>
        parseMatchSide(side, `${path}.choices[${i}]`),
      );
      if (choices.length !== 3 && choices.length !== 4) {
        fail(path, "matching needs 3 or 4 choices");
      }
      const keys = choices.map((side) => matchSideKey(side));
      if (new Set(keys).size !== keys.length) {
        fail(path, "choices must be unique");
      }
      const rightKey = matchSideKey(pairs[0]!.right);
      if (!keys.includes(rightKey)) {
        fail(path, "choices must include the pair's right side");
      }
      const leftKind = matchSideRepresentation(pairs[0]!.left);
      const rightKind = matchSideRepresentation(pairs[0]!.right);
      if (leftKind === rightKind) {
        fail(
          path,
          `matching sides must use two different representations, not ${leftKind} with ${rightKind}`,
        );
      }
      return { ...core, kind, pairs, mode: writtenMode as MatchPairsMode, choices };
    }
    case "make-total": {
      const total = expectNumber(value, "total", path);
      if (!Number.isInteger(total) || total < 1 || total > 20) {
        fail(path, "total must be a whole number from 1 to 20");
      }
      let part: number | undefined;
      if (value.part != null) {
        part = expectNumber(value, "part", path);
        if (!Number.isInteger(part) || part < 0 || part > total) {
          fail(path, "part must be a whole number from 0 to total");
        }
      }
      let other: number | undefined;
      if (value.other != null) {
        other = expectNumber(value, "other", path);
        if (!Number.isInteger(other) || other < 0 || other > total) {
          fail(path, "other must be a whole number from 0 to total");
        }
      }
      const mode = expectString(value, "mode", path);
      if (!(MAKE_TOTAL_MODES as readonly string[]).includes(mode)) {
        fail(path, "mode must be fill-slots or sum-only");
      }
      let gap: MakeTotalGap | undefined;
      if (value.gap != null) {
        const written = expectString(value, "gap", path);
        if (!(MAKE_TOTAL_GAPS as readonly string[]).includes(written)) {
          fail(path, "gap must be left, right or total");
        }
        gap = written as MakeTotalGap;
      }
      let operation: MakeTotalOp | undefined;
      if (value.operation != null) {
        const written = expectString(value, "operation", path);
        if (!(MAKE_TOTAL_OPS as readonly string[]).includes(written)) {
          fail(path, "operation must be add or subtract");
        }
        operation = written as MakeTotalOp;
      }
      if (mode === "fill-slots" && !visual) {
        fail(path, "fill-slots needs visual { item, count }");
      }
      let options: QuestionOption[] | undefined;
      if (value.options != null) {
        options = expectArray(value, "options", path).map((option, i) =>
          parseOption(option, `${path}.options[${i}]`),
        );
      }
      if (mode === "sum-only") {
        if (!options || options.length < 3) fail(path, "sum-only needs at least 3 number options");
      }
      if (mode === "fill-slots" && (gap ?? "right") === "total" && (operation ?? "add") === "add") {
        fail(path, "fill-slots cannot use gap total (there are no object tiles for both parts). Use sum-only.");
      }
      let slotCount: number | undefined;
      if (value.slotCount != null) {
        slotCount = expectNumber(value, "slotCount", path);
        if (!Number.isInteger(slotCount) || slotCount < 2 || slotCount > 12) {
          fail(path, "slotCount must be a whole number from 2 to 12");
        }
      }
      const draft = {
        ...core,
        kind: "make-total" as const,
        total,
        part,
        other,
        gap,
        operation,
        mode: mode as MakeTotalMode,
        slotCount,
        visual,
        options,
      };
      const missing = makeTotalMissing(draft);
      if (!Number.isInteger(missing) || missing < 0 || missing > total) {
        fail(path, "part / other / total do not make a whole number missing part");
      }
      if ((gap ?? "right") === "total" && makeTotalPart(draft) + makeTotalOther(draft) !== total) {
        fail(path, "when gap is total, part + other must equal total");
      }
      if ((gap ?? "right") === "total" && /missing number/i.test(prompt)) {
        fail(
          path,
          "result blank must not say 'missing number'. Use What is {a} + {b}? or What is {a} − {b}?.",
        );
      }
      if (part != null && visual && visual.count !== part) {
        fail(path, "part must match visual.count when both are set");
      }
      if (mode === "fill-slots") {
        const bank = slotCount ?? Math.min(12, Math.max(missing + 2, 2));
        if (bank <= missing && missing < 12) {
          fail(path, "slotCount must be more than the missing part so the child can overshoot");
        }
      }
      if (options) {
        const hits = options.filter((option) => optionNumber(option.label) === missing);
        if (mode === "sum-only" && hits.length !== 1) {
          fail(path, "exactly one option label must be the missing number");
        }
      }
      return draft;
    }
    case "pick-pair": {
      const total = expectNumber(value, "total", path);
      if (!Number.isInteger(total) || total < 1 || total > 20) {
        fail(path, "total must be a whole number from 1 to 20");
      }
      let tiles: number[] | undefined;
      if (value.tiles != null) {
        const list = expectArray(value, "tiles", path);
        if (list.length < 2 || list.length > 4) fail(path, "tiles must have 2 to 4 numbers");
        tiles = list.map((entry, index) => {
          if (typeof entry !== "number" || !Number.isInteger(entry) || entry < 0 || entry > 20) {
            fail(`${path}.tiles[${index}]`, "tile must be a whole number from 0 to 20");
          }
          return entry;
        });
      }
      let tileRange: { min: number; max: number } | undefined;
      if (value.tileRange != null) {
        if (!isRecord(value.tileRange)) fail(path, "tileRange must be { min, max }");
        const min = expectNumber(value.tileRange, "min", `${path}.tileRange`);
        const max = expectNumber(value.tileRange, "max", `${path}.tileRange`);
        if (!Number.isInteger(min) || !Number.isInteger(max) || min < 0 || max > 20 || min > max) {
          fail(`${path}.tileRange`, "min and max must be whole numbers 0–20 with min ≤ max");
        }
        tileRange = { min, max };
      }
      let tileCount: number | undefined;
      if (value.tileCount != null) {
        tileCount = expectNumber(value, "tileCount", path);
        if (!Number.isInteger(tileCount) || tileCount < 2 || tileCount > 4) {
          fail(path, "tileCount must be a whole number from 2 to 4");
        }
      }
      if (value.showDots != null && typeof value.showDots !== "boolean") {
        fail(path, "showDots must be true or false");
      }
      const draft = {
        ...core,
        kind: "pick-pair" as const,
        total,
        tiles,
        tileRange,
        tileCount,
        showDots: value.showDots === undefined ? undefined : Boolean(value.showDots),
      };
      const check = canDrawPickPair(draft);
      if (!check.ok) fail(path, check.reason);
      return draft;
    }
    case "part-whole": {
      const whole = expectNumber(value, "whole", path);
      if (!Number.isInteger(whole) || whole < 1 || whole > 20) {
        fail(path, "whole must be a whole number from 1 to 20");
      }
      const partsRaw = expectArray(value, "parts", path);
      if (partsRaw.length !== 2) fail(path, "parts must be [a, b]");
      const parts = partsRaw.map((entry, index) => {
        if (typeof entry !== "number" || !Number.isInteger(entry) || entry < 0 || entry > whole) {
          fail(`${path}.parts[${index}]`, "part must be a whole number from 0 to whole");
        }
        return entry;
      }) as [number, number];
      if (parts[0] + parts[1] !== whole) fail(path, "parts must add to whole");
      const missingRaw = expectString(value, "missing", path);
      if (!(PART_WHOLE_MISSING as readonly string[]).includes(missingRaw)) {
        fail(path, "missing must be left, right or whole");
      }
      const missing = missingRaw as PartWholeMissing;
      let choices: number[] | undefined;
      if (value.choices != null) {
        const list = expectArray(value, "choices", path);
        if (list.length !== 3) fail(path, "choices must be exactly 3 numbers");
        choices = list.map((entry, index) => {
          if (typeof entry !== "number" || !Number.isInteger(entry) || entry < 0 || entry > 20) {
            fail(`${path}.choices[${index}]`, "choice must be a whole number from 0 to 20");
          }
          return entry;
        });
        if (new Set(choices).size !== choices.length) fail(path, "choices must be unique");
      }
      const draft = {
        ...core,
        kind: "part-whole" as const,
        whole,
        parts,
        missing,
        choices,
      };
      const answer = partWholeAnswer(draft);
      const pad = choices ?? defaultPartWholeChoices(answer, whole);
      if (pad.filter((value) => value === answer).length !== 1) {
        fail(path, "exactly one choice must be the missing number");
      }
      return draft;
    }
    default:
      fail(path, `unhandled kind ${kind}`);
  }
}

export function validateActivity(raw: unknown, file: string): Activity {
  if (!isRecord(raw)) fail(file, "root must be an object");
  const id = expectString(raw, "id", file);
  const title = expectString(raw, "title", file);
  const summary = expectString(raw, "summary", file);
  const subject = expectString(raw, "subject", file);
  if (!(SUBJECTS as readonly string[]).includes(subject)) fail(file, `unknown subject ${subject}`);
  const type = expectString(raw, "type", file);
  if (!(ACTIVITY_TYPES as readonly string[]).includes(type)) fail(file, `unknown type ${type}`);
  const yearGroups = expectArray(raw, "yearGroups", file);
  if (
    yearGroups.length === 0 ||
    !yearGroups.every((year) => isString(year) && (YEAR_GROUPS as readonly string[]).includes(year))
  ) {
    fail(file, "yearGroups must be Reception…Year6");
  }
  const ability = expectString(raw, "ability", file);
  if (!(ABILITY_BANDS as readonly string[]).includes(ability)) fail(file, `unknown ability ${ability}`);
  const estimatedMinutes = expectNumber(raw, "estimatedMinutes", file);
  const masteryThreshold = expectNumber(raw, "masteryThreshold", file);
  if (masteryThreshold <= 0 || masteryThreshold > 1) fail(file, "masteryThreshold must be 0–1");
  const curriculumRef = expectString(raw, "curriculumRef", file);
  const pathNode = expectString(raw, "pathNode", file);
  const difficulty = expectNumber(raw, "difficulty", file);
  if (difficulty !== 1 && difficulty !== 2 && difficulty !== 3) {
    fail(file, "difficulty must be 1, 2 or 3");
  }
  const questionCount = expectNumber(raw, "questionCount", file);
  let extraQuestions: Activity["extraQuestions"];
  if (raw.extraQuestions != null) {
    if (!isRecord(raw.extraQuestions)) fail(file, "extraQuestions must be { reason }");
    const reason = expectString(raw.extraQuestions, "reason", `${file}.extraQuestions`);
    if (reason.trim().length < 12) {
      fail(file, "extraQuestions.reason must say why this quest needs more than 10 items");
    }
    extraQuestions = { reason };
  }
  if (!isRecord(raw.difficultyRamp)) fail(file, "difficultyRamp must be { within, versus }");
  const within = expectString(raw.difficultyRamp, "within", `${file}.difficultyRamp`);
  const versus = expectString(raw.difficultyRamp, "versus", `${file}.difficultyRamp`);
  const skills = expectArray(raw, "skills", file);
  if (!skills.every(isString) || skills.length < 2 || skills.length > 6) {
    fail(file, "skills must be 2–6 strings");
  }
  const randomise = parseActivityRandomise(raw.randomise, `${file}.randomise`);
  const questions = expectArray(raw, "questions", file).map((question, i) =>
    parseQuestion(question, `${file}.questions[${i}]`),
  );
  if (questions.length !== questionCount) {
    fail(file, `questionCount is ${questionCount} but questions.length is ${questions.length}`);
  }
  if (extraQuestions) {
    if (questions.length <= 10) {
      fail(file, "extraQuestions is only for sets longer than 10");
    }
    if (questions.length > 20) fail(file, "even with extraQuestions, 20 questions is the max");
  } else if (questions.length !== 10) {
    fail(file, "need exactly 10 questions (or set extraQuestions.reason to go longer)");
  }
  const ids = questions.map((question) => question.id);
  if (new Set(ids).size !== ids.length) fail(file, "duplicate question ids");

  return {
    id,
    title,
    summary,
    subject: subject as Activity["subject"],
    type: type as Activity["type"],
    yearGroups: yearGroups as Activity["yearGroups"],
    ability: ability as Activity["ability"],
    estimatedMinutes,
    masteryThreshold,
    curriculumRef,
    pathNode,
    difficulty: difficulty as Activity["difficulty"],
    questionCount,
    extraQuestions,
    difficultyRamp: { within, versus },
    skills: skills as string[],
    randomise,
    questions,
  };
}
