/**
 * Pedagogy lint for activity JSON. Called from check-activities.mjs.
 * Temporary allowlists are TODOs for later rewrites. Do not grow them.
 */

/** Later rewrite: none. Do not grow this list. */
const LATER_REWRITE = new Set([]);

/** Just shipped. Only narration and year-vocabulary apply. */
const JUST_SHIPPED = new Set([
  "show-and-compare-numbers",
  "show-and-compare-numbers-medium",
  "show-and-compare-numbers-hard",
]);

const CLOCK_WORDS = /\b(clockwise|anti-clockwise|anticlockwise)\b/i;
const HARD_THINKING =
  /\b(think|thinking|kind|mix|mixes|mixing|missing|reverse|famil|direct|represent|story|perform|structur|trap|spot|error|relation|without|not just|fact family|puppet|left|right)\b/i;

function skipContent(id) {
  return LATER_REWRITE.has(id) || JUST_SHIPPED.has(id);
}

function spokenLine(question) {
  const n = question.narration?.prompt;
  if (typeof n === "string") return n.trim();
  if (n && typeof n === "object" && typeof n.text === "string") return n.text.trim();
  return "";
}

function wordCount(text) {
  return String(text)
    .replace(/[−–—]/g, " ")
    .trim()
    .split(/\s+/)
    .filter(Boolean).length;
}

function stemNumbers(text) {
  const found = [];
  const re = /\d+/g;
  let match;
  while ((match = re.exec(String(text)))) found.push(Number(match[0]));
  return found;
}

function numericLabel(option) {
  if (!option || option.visual || option.tenFrame || option.baseTen || option.dice || option.shape) {
    return null;
  }
  if (option.label == null) return null;
  if (!/^-?\d+$/.test(String(option.label).trim())) return null;
  return Number(option.label);
}

function pickerOptions(question) {
  if (question.kind === "count-objects" || question.kind === "multiple-choice") {
    return question.options ?? [];
  }
  if (question.kind === "make-total" && question.mode === "sum-only") {
    return question.options ?? [];
  }
  return null;
}

function isNumericPicker(question) {
  const options = pickerOptions(question);
  if (!options || options.length < 3) return false;
  return options.every((option) => numericLabel(option) != null);
}

function makeTotalAnswer(question) {
  const part = question.part ?? question.visual?.count ?? 0;
  if (question.operation === "subtract") return (question.total ?? 0) - part;
  if ((question.gap ?? "right") === "total") return question.total ?? 0;
  return (question.total ?? 0) - part;
}

function correctNumeric(question) {
  const options = pickerOptions(question);
  if (!options) return null;
  if (question.kind === "make-total") {
    const missing = makeTotalAnswer(question);
    const hit = options.find((option) => numericLabel(option) === missing);
    return hit ? numericLabel(hit) : null;
  }
  const id = question.correctId;
  const hit = options.find((option) => option.id === id);
  return hit ? numericLabel(hit) : null;
}

function answerBand(values, answer) {
  const sorted = [...values].sort((a, b) => a - b);
  if (answer === sorted[0]) return "smallest";
  if (answer === sorted[sorted.length - 1]) return "largest";
  return "middle";
}

function compareNamesThing(prompt) {
  const text = String(prompt).trim();
  const isGroupCompare =
    (/\bwhich group (has|shows)\b/i.test(text) ||
      /\bput the groups\b/i.test(text) ||
      /\btap the two groups\b/i.test(text)) &&
    /\b(fewer|fewest|more|most|least|same|smaller|bigger|smallest|biggest)\b/i.test(text);
  if (!isGroupCompare) return true;
  if (/\b(smaller number|bigger number|smallest number|biggest number)\b/i.test(text)) return true;
  if (/\{items?\}/.test(text)) return true;
  if (/\bsame number of\b/i.test(text)) return true;
  if (
    /\b(fewer|more|fewest|most|least|same)\b(?:\s+than\s+\d+)?\s+(?!than|the|this|that|as|of|in|to)[a-z]{3,}\b/i.test(
      text,
    )
  ) {
    return true;
  }
  return false;
}

function stemShape(prompt) {
  return String(prompt)
    .toLowerCase()
    .replace(/\{[a-z0-9]+\}/gi, "{x}")
    .replace(/\d+/g, "n")
    .replace(/\s+/g, " ")
    .trim();
}

function optionFingerprint(question) {
  return JSON.stringify({
    prompt: question.prompt,
    options: question.options ?? null,
    items: question.items ?? null,
    choices: question.choices ?? null,
    visual: question.visual ?? null,
    tenFrame: question.tenFrame ?? null,
    baseTen: question.baseTen ?? null,
    part: question.part ?? null,
    other: question.other ?? null,
    total: question.total ?? null,
    whole: question.whole ?? null,
    parts: question.parts ?? null,
    tiles: question.tiles ?? null,
    numeral: question.numeral ?? null,
    turn: question.turn ?? null,
    numberLine: question.numberLine ?? null,
    hundredSquare: question.hundredSquare ?? null,
    pairs: question.pairs ?? null,
  });
}

function childFacingText(question) {
  const parts = [
    question.prompt,
    question.explanation,
    question.hint,
    spokenLine(question),
  ];
  for (const option of question.options ?? []) {
    if (option?.label) parts.push(option.label);
  }
  return parts.filter(Boolean).join("\n");
}

function checkActivity(activity) {
  const errors = [];
  const id = activity.id;
  const year = activity.yearGroups?.[0] ?? "";
  const reception = year === "Reception";
  const year1 = year === "Year1";
  const content = !skipContent(id);

  const shapes = [];
  const fingerprints = new Map();
  const bands = { smallest: 0, middle: 0, largest: 0 };
  let numericPickers = 0;

  if (activity.difficulty === 3 && !HARD_THINKING.test(`${activity.difficultyRamp?.versus ?? ""} ${activity.difficultyRamp?.within ?? ""}`)) {
    errors.push(`${id}: Hard difficultyRamp must name a new kind of thinking, not only bigger numbers`);
  }

  for (const question of activity.questions ?? []) {
    const path = `${id}/${question.id}`;

    if (!spokenLine(question)) {
      errors.push(`${path}: every question needs narration.prompt`);
    }

    if (year1 && CLOCK_WORDS.test(childFacingText(question))) {
      errors.push(`${path}: Year 1 must not say clockwise or anti-clockwise`);
    }

    if (!compareNamesThing(question.prompt)) {
      errors.push(`${path}: compare questions must name what is compared`);
    }

    if (question.kind === "multi-select" && !/\b(select|tap|choose)\b/i.test(question.prompt)) {
      errors.push(`${path}: multi-select must say what to do in the question`);
    }

    const expl = String(question.explanation ?? "").trim();
    if (content) {
      const words = wordCount(expl);
      if (words > 20) {
        errors.push(`${path}: explanation is ${words} words (max 20)`);
      }
      const restatesOnly =
        /^(the answer is|it is)\b/i.test(expl) ||
        (words > 0 &&
          words <= 4 &&
          !/\b(not|once|each|tens|ones|after|before|more|less|left|full|half)\b/i.test(expl));
      if (restatesOnly) {
        errors.push(`${path}: explanation only restates the answer`);
      }
    }

    const options = pickerOptions(question);
    if (content && options && !question.turn?.interactive && question.numeral == null) {
      if (options.length > 4) {
        errors.push(`${path}: never more than 4 options`);
      } else if (reception && options.length !== 3) {
        errors.push(`${path}: Reception pickers need 3 options`);
      } else if (year1 && options.length !== 4) {
        errors.push(`${path}: Year 1 pickers need 4 options`);
      }
    }
    if (options && options.length > 4 && !question.turn?.interactive) {
      errors.push(`${path}: never more than 4 options`);
    }
    if (question.turn?.interactive && options && options.length > 4) {
      errors.push(`${path}: never more than 4 options`);
    }

    if (content && isNumericPicker(question) && options) {
      const stemNums = new Set(stemNumbers(question.prompt));
      const correct = correctNumeric(question);
      let copied = 0;
      const values = [];
      for (const option of options) {
        const n = numericLabel(option);
        if (n == null) continue;
        values.push(n);
        const isCorrect =
          question.kind === "make-total" ? n === correct : option.id === question.correctId;
        if (!isCorrect && stemNums.has(n)) copied += 1;
      }
      if (copied > 1) {
        errors.push(`${path}: at most one distractor may copy a stem number (found ${copied})`);
      }
      if (correct != null && values.length >= 3) {
        bands[answerBand(values, correct)] += 1;
        numericPickers += 1;
      }
    }

    const shape = stemShape(question.prompt);
    shapes.push(shape);
    const fp = `${shape}::${optionFingerprint(question)}`;
    if (content) {
      const prev = fingerprints.get(fp);
      if (prev) errors.push(`${path}: identical stem and options as ${prev}`);
      fingerprints.set(fp, path);
    }
  }

  if (content && numericPickers >= 4) {
    const midRate = bands.middle / numericPickers;
    if (midRate > 0.6 || bands.smallest === 0 || bands.largest === 0) {
      errors.push(
        `${id}: numeric answers must mix smallest, middle and largest (now ${bands.smallest} min, ${bands.middle} mid, ${bands.largest} max)`,
      );
    }
  }

  if (content) {
    const counts = new Map();
    let run = 1;
    for (let i = 0; i < shapes.length; i += 1) {
      const shape = shapes[i];
      counts.set(shape, (counts.get(shape) ?? 0) + 1);
      if (i > 0 && shapes[i] === shapes[i - 1]) run += 1;
      else run = 1;
      if (run >= 4) {
        errors.push(`${id}: never 4 of the same stem shape in a row (${shape})`);
      }
    }
    for (const [shape, count] of counts) {
      if (count > 3) {
        errors.push(`${id}: no more than 3 questions with the same stem shape (${count}× ${shape})`);
      }
    }
  }

  return errors;
}

export function lintActivities(activities) {
  const errors = [];
  for (const activity of activities) {
    errors.push(...checkActivity(activity));
  }
  return errors;
}

export const pedagogyAllowlistNote =
  "Just-shipped allowlist: show-and-compare-numbers.";
