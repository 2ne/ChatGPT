import { numberWord } from "../data/objects";
import type { FillBlankQuestion, Question } from "../types/activity";

const OP = "([+\\u2212\\-])";
const RESULT_EQ = new RegExp(`^(\\d+)\\s*${OP}\\s*(\\d+)\\s*=\\s*$`);
const BARE_EQ = new RegExp(`^(\\d+)\\s*${OP}\\s*(\\d+)\\s*=\\s*$`);
const ADD_KNOWN = /^(\d+)\s*\+\s*$/;
const ADD_TOTAL = /^=\s*(\d+)\s*$/;
const RESULT_PROMPT = /^What is \d+ (?:[+\u2212\-]|take away) \d+\?$/;
const RESULT_SPOKEN =
  /^What is (?:zero|one|two|three|four|five|six|seven|eight|nine|ten|eleven|twelve|thirteen|fourteen|fifteen|sixteen|seventeen|eighteen|nineteen|twenty|\d+) (?:plus|take away) (?:zero|one|two|three|four|five|six|seven|eight|nine|ten|eleven|twelve|thirteen|fourteen|fifteen|sixteen|seventeen|eighteen|nineteen|twenty|\d+)\?$/;
const BOND_PROMPT = /^What do you need to add to \d+ to make \d+\?$/;
const BOND_SPOKEN =
  /^What do you need to add to (?:zero|one|two|three|four|five|six|seven|eight|nine|ten|eleven|twelve|thirteen|fourteen|fifteen|sixteen|seventeen|eighteen|nineteen|twenty|\d+) to make (?:zero|one|two|three|four|five|six|seven|eight|nine|ten|eleven|twelve|thirteen|fourteen|fifteen|sixteen|seventeen|eighteen|nineteen|twenty|\d+)\?$/;

export type FillBlankEquation =
  | { shape: "result"; a: number; b: number; op: "add" | "subtract" }
  | { shape: "add-part"; known: number; total: number };

function readOp(symbol: string): "add" | "subtract" {
  return symbol === "+" ? "add" : "subtract";
}

function signFor(op: "add" | "subtract"): string {
  return op === "subtract" ? "take away" : "+";
}

function spokenOp(op: "add" | "subtract"): string {
  return op === "subtract" ? "take away" : "plus";
}

/** Blank at the end of `a + b =` / `a − b =`, or a missing addend in `n + = total`. */
export function parseFillBlankEquation(
  prefix: string | undefined,
  suffix: string | undefined,
): FillBlankEquation | null {
  const pre = (prefix ?? "").trim();
  const suf = (suffix ?? "").trim();
  const result = pre.match(RESULT_EQ);
  if (result && suf === "" && result[1] && result[2] && result[3]) {
    return {
      shape: "result",
      a: Number(result[1]),
      b: Number(result[3]),
      op: readOp(result[2]),
    };
  }
  const known = pre.match(ADD_KNOWN);
  const total = suf.match(ADD_TOTAL);
  if (known && total && known[1] && total[1]) {
    return { shape: "add-part", known: Number(known[1]), total: Number(total[1]) };
  }
  return null;
}

export function isResultBlank(prefix: string | undefined, suffix: string | undefined): boolean {
  return parseFillBlankEquation(prefix, suffix)?.shape === "result";
}

export function defaultFillBlankPrompt(question: FillBlankQuestion): string | null {
  const parsed = parseFillBlankEquation(question.prefix, question.suffix);
  if (!parsed) return null;
  if (parsed.shape === "result") {
    return `What is ${parsed.a} ${signFor(parsed.op)} ${parsed.b}?`;
  }
  return `What do you need to add to ${parsed.known} to make ${parsed.total}?`;
}

export function defaultFillBlankSpoken(question: FillBlankQuestion): string | null {
  const parsed = parseFillBlankEquation(question.prefix, question.suffix);
  if (!parsed) return null;
  if (parsed.shape === "result") {
    return `What is ${numberWord(parsed.a)} ${spokenOp(parsed.op)} ${numberWord(parsed.b)}?`;
  }
  return `What do you need to add to ${numberWord(parsed.known)} to make ${numberWord(parsed.total)}?`;
}

export function parseBareEquation(
  prompt: string,
): Extract<FillBlankEquation, { shape: "result" }> | null {
  const match = prompt.trim().match(BARE_EQ);
  if (!match || !match[1] || !match[2] || !match[3]) return null;
  return { shape: "result", a: Number(match[1]), b: Number(match[3]), op: readOp(match[2]) };
}

function promptFromResult(parsed: Extract<FillBlankEquation, { shape: "result" }>): string {
  return `What is ${parsed.a} ${signFor(parsed.op)} ${parsed.b}?`;
}

function spokenFromResult(parsed: Extract<FillBlankEquation, { shape: "result" }>): string {
  return `What is ${numberWord(parsed.a)} ${spokenOp(parsed.op)} ${numberWord(parsed.b)}?`;
}

function shouldReplaceResultPrompt(prompt: string): boolean {
  return (
    /missing number/i.test(prompt) ||
    RESULT_PROMPT.test(prompt.trim()) ||
    BARE_EQ.test(prompt.trim())
  );
}

function shouldReplaceSpoken(spoken: string | undefined, prompt: string): boolean {
  if (
    spoken == null ||
    spoken === "" ||
    spoken === prompt ||
    /missing number/i.test(spoken) ||
    /equals what/i.test(spoken) ||
    BARE_EQ.test(spoken.trim())
  ) {
    return true;
  }
  return RESULT_SPOKEN.test(spoken) || BOND_SPOKEN.test(spoken);
}

function withPrompt(question: Question, prompt: string, spoken: string | null): Question {
  const writtenSpoken =
    typeof question.narration?.prompt === "string" ? question.narration.prompt : undefined;
  const nextSpoken =
    spoken && shouldReplaceSpoken(writtenSpoken, question.prompt) ? spoken : writtenSpoken;
  return {
    ...question,
    prompt,
    narration: nextSpoken ? { ...question.narration, prompt: nextSpoken } : question.narration,
  };
}

function applyFillBlankDefaults(question: FillBlankQuestion): Question {
  const prompt = defaultFillBlankPrompt(question);
  if (!prompt) return question;
  const parsed = parseFillBlankEquation(question.prefix, question.suffix);
  const replace =
    parsed?.shape === "result"
      ? shouldReplaceResultPrompt(question.prompt)
      : /missing number/i.test(question.prompt) || BOND_PROMPT.test(question.prompt);
  if (!replace) return question;
  return withPrompt(question, prompt, defaultFillBlankSpoken(question));
}

function applyBareEquationDefaults(question: Question): Question {
  const parsed = parseBareEquation(question.prompt);
  if (!parsed) return question;
  return withPrompt(question, promptFromResult(parsed), spokenFromResult(parsed));
}

/**
 * Fill `What is a + b?` / bond wording from the equation on screen.
 * JSON can still override with any other prompt.
 */
export function applyStemPromptDefaults(question: Question): Question {
  if (question.kind === "fill-blank") return applyFillBlankDefaults(question);
  return applyBareEquationDefaults(question);
}
