import { ABILITY_BANDS, SUBJECTS, YEAR_GROUPS } from "../types/curriculum";
import {
  ACTIVITY_TYPES,
  MAKE_TOTAL_GAPS,
  MAKE_TOTAL_MODES,
  MAKE_TOTAL_OPS,
  OBJECT_ITEMS,
  OBJECT_LAYOUTS,
  PART_WHOLE_MISSING,
  QUESTION_KINDS,
  type Activity,
  type ActivityRandomise,
  type MakeTotalGap,
  type MakeTotalMode,
  type MakeTotalOp,
  type MatchSide,
  type ObjectAsset,
  type ObjectItem,
  type PartWholeMissing,
  type Question,
  type QuestionOption,
  type RandomiseSpec,
} from "../types/activity";
import { isResultBlank, parseBareEquation } from "./fillBlank";
import { makeTotalMissing, makeTotalOther, makeTotalPart, optionNumber } from "./makeTotal";
import { defaultPartWholeChoices, partWholeAnswer } from "./partWhole";
import { canDrawPickPair } from "./pickPair";

function isRecord(value: unknown): value is Record<string, unknown> {
  return Boolean(value) && typeof value === "object" && !Array.isArray(value);
}

function isString(value: unknown): value is string {
  return typeof value === "string";
}

function fail(path: string, message: string): never {
  throw new Error(`Activity ${path}: ${message}`);
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

function expectVisual(value: unknown, path: string): ObjectAsset {
  if (!isRecord(value)) fail(path, "visual must be { item, count }");
  const item = value.item;
  const count = value.count;
  if (!isString(item) || !(OBJECT_ITEMS as readonly string[]).includes(item)) {
    fail(path, `visual.item must be one of ${OBJECT_ITEMS.join(", ")}`);
  }
  if (typeof count !== "number" || !Number.isInteger(count) || count < 1 || count > 12) {
    fail(path, "visual.count must be a whole number from 1 to 12");
  }
  return { item: item as ObjectAsset["item"], count };
}

/** Part-whole pictures may be empty (0) and can grow to 20 for later tens. */
function parseMakeTotalVisual(value: unknown, path: string): ObjectAsset | undefined {
  if (value == null) return undefined;
  if (!isRecord(value)) fail(path, "visual must be { item, count }");
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

function optionalVisual(record: Record<string, unknown>, path: string): ObjectAsset | undefined {
  if (record.visual == null) return undefined;
  return expectVisual(record.visual, `${path}.visual`);
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

function parseLayout(record: Record<string, unknown>, path: string): Question["layout"] {
  if (record.layout == null) return undefined;
  if (typeof record.layout !== "string" || !(OBJECT_LAYOUTS as readonly string[]).includes(record.layout)) {
    fail(path, "layout must be row, scatter or dice");
  }
  return record.layout as Question["layout"];
}

function parseOption(value: unknown, path: string): QuestionOption {
  if (!isRecord(value)) fail(path, "option must be an object");
  const id = expectString(value, "id", path);
  const label = value.label == null ? undefined : expectString(value, "label", path);
  const visual = optionalVisual(value, path);
  if (!label && !visual) fail(path, "option needs a label or a visual");
  return { id, label, visual };
}

function parseMatchSide(value: unknown, path: string): MatchSide {
  if (isString(value)) {
    if (value.trim() === "") fail(path, "match side cannot be empty");
    return value;
  }
  if (!isRecord(value)) fail(path, "match side must be a string or { label, visual }");
  const label = value.label == null ? undefined : expectString(value, "label", path);
  const visual = optionalVisual(value, path);
  if (!label && !visual) fail(path, "match side needs a label or a visual");
  return { label, visual };
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
  const visual =
    kind === "make-total"
      ? parseMakeTotalVisual(value.visual, `${path}.visual`)
      : optionalVisual(value, path);
  const extras =
    kind === "make-total" ? parseMakeTotalExtras(value, path) : parseExtras(value, path);
  const layout = parseLayout(value, path);
  if (visual && extras) {
    for (const extra of extras) {
      if (extra.item === visual.item) {
        fail(path, "extras.item must be a different object from visual.item");
      }
    }
  }
  const randomise = parseRandomiseSpec(value.randomise, `${path}.randomise`);
  const core = { id, prompt, explanation, hint, narration, visual, extras, layout, randomise };
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
        parseOption(option, `${path}.options[${i}]`),
      );
      const correctId = expectString(value, "correctId", path);
      if (!options.some((option) => option.id === correctId)) {
        fail(path, "correctId must match an option id");
      }
      return { ...core, kind, options, correctId };
    }
    case "multi-select": {
      const options = expectArray(value, "options", path).map((option, i) =>
        parseOption(option, `${path}.options[${i}]`),
      );
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
      if (pairs.length < 2) fail(path, "match-pairs needs at least two pairs");
      return { ...core, kind, pairs };
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
