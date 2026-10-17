import type { PickPairQuestion } from "../types/activity";

export type PickPairTile = {
  id: string;
  value: number;
};

export type PickPairAnswer = {
  picked: string[];
  found: string[][];
};

type Rng = () => number;

export function isPickPairAnswer(value: unknown): value is PickPairAnswer {
  if (!value || typeof value !== "object") return false;
  const record = value as PickPairAnswer;
  return Array.isArray(record.picked) && Array.isArray(record.found);
}

export function emptyPickPairAnswer(): PickPairAnswer {
  return { picked: [], found: [] };
}

export function pickPairShowDots(question: PickPairQuestion): boolean {
  return question.showDots !== false;
}

export function pickPairRequireAll(question: PickPairQuestion): boolean {
  return question.requireAllPairs === true;
}

export function pickPairTiles(question: PickPairQuestion): PickPairTile[] {
  return (question.tiles ?? []).map((value, index) => ({
    id: `t${index}`,
    value,
  }));
}

export function pairValuesKey(a: number, b: number): string {
  return a <= b ? `${a}+${b}` : `${b}+${a}`;
}

function tilePairKey(a: string, b: string): string {
  return a < b ? `${a}|${b}` : `${b}|${a}`;
}

/** Largest set of disjoint tile pairs that add to total. */
export function requiredTilePairs(tiles: PickPairTile[], total: number): [string, string][] {
  const unused = [...tiles].sort((left, right) => left.value - right.value);
  const used = new Set<string>();
  const pairs: [string, string][] = [];
  for (const tile of unused) {
    if (used.has(tile.id)) continue;
    const partner = unused.find(
      (other) =>
        !used.has(other.id) && other.id !== tile.id && other.value + tile.value === total,
    );
    if (!partner) continue;
    used.add(tile.id);
    used.add(partner.id);
    pairs.push([tile.id, partner.id]);
  }
  return pairs;
}

export function uniquePairLabels(tiles: PickPairTile[], total: number): string[] {
  const labels = new Set<string>();
  for (const pair of requiredTilePairs(tiles, total)) {
    const left = tiles.find((tile) => tile.id === pair[0]);
    const right = tiles.find((tile) => tile.id === pair[1]);
    if (left && right) labels.add(pairValuesKey(left.value, right.value).replace("+", " + "));
  }
  return [...labels];
}

export function valuesSumToTotal(left: number, right: number, total: number): boolean {
  return left + right === total;
}

export function foundPairSet(found: string[][]): Set<string> {
  return new Set(found.map((pair) => tilePairKey(pair[0] ?? "", pair[1] ?? "")));
}

export function isFoundPair(found: string[][], a: string, b: string): boolean {
  return foundPairSet(found).has(tilePairKey(a, b));
}

export function togglePickPairTile(
  question: PickPairQuestion,
  answer: PickPairAnswer,
  id: string,
): PickPairAnswer {
  const tiles = pickPairTiles(question);
  const foundIds = new Set(answer.found.flat());
  if (foundIds.has(id)) return answer;
  if (answer.picked.includes(id)) {
    return { ...answer, picked: answer.picked.filter((item) => item !== id) };
  }
  if (answer.picked.length >= 2) return answer;
  const nextPicked = [...answer.picked, id];
  if (pickPairRequireAll(question) && nextPicked.length === 2) {
    const left = tiles.find((tile) => tile.id === nextPicked[0]);
    const right = tiles.find((tile) => tile.id === nextPicked[1]);
    if (left && right && valuesSumToTotal(left.value, right.value, question.total)) {
      return { picked: [], found: [...answer.found, nextPicked] };
    }
  }
  return { ...answer, picked: nextPicked };
}

export function isCompletePickPair(question: PickPairQuestion, answer: PickPairAnswer): boolean {
  const tiles = pickPairTiles(question);
  const need = requiredTilePairs(tiles, question.total);
  if (pickPairRequireAll(question)) {
    if (answer.found.length !== need.length) return false;
    const got = foundPairSet(answer.found);
    return need.every((pair) => got.has(tilePairKey(pair[0], pair[1])));
  }
  if (answer.picked.length !== 2) return false;
  const first = tiles.find((tile) => tile.id === answer.picked[0]);
  const second = tiles.find((tile) => tile.id === answer.picked[1]);
  return Boolean(first && second && valuesSumToTotal(first.value, second.value, question.total));
}

function possibleComplements(min: number, max: number, total: number): [number, number][] {
  const pairs: [number, number][] = [];
  for (let value = min; value <= max; value += 1) {
    const other = total - value;
    if (other < min || other > max || value > other) continue;
    pairs.push([value, other]);
  }
  return pairs;
}

function shuffleIn<T>(list: T[], rng: Rng): T[] {
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

/** Draw tiles from `tileRange` so at least one valid pair is present. */
export function drawPickPairTiles(question: PickPairQuestion, rng: Rng): number[] {
  const range = question.tileRange;
  if (!range) return question.tiles ?? [];
  const count = question.tileCount ?? 4;
  const pool: number[] = [];
  for (let value = range.min; value <= range.max; value += 1) pool.push(value);
  const complements = possibleComplements(range.min, range.max, question.total);
  const need = pickPairRequireAll(question) ? Math.min(2, complements.length) : 1;
  const chosen = shuffleIn(complements, rng).slice(0, need);
  const tiles: number[] = [];
  for (const [left, right] of chosen) {
    tiles.push(left, right);
  }
  while (tiles.length < count && pool.length > 0) {
    tiles.push(pool[Math.floor(rng() * pool.length)] ?? range.min);
  }
  return shuffleIn(tiles.slice(0, count), rng);
}

export function canDrawPickPair(question: PickPairQuestion): { ok: true } | { ok: false; reason: string } {
  const total = question.total;
  if (question.tiles && question.tiles.length > 0) {
    const tiles = pickPairTiles(question);
    const pairs = requiredTilePairs(tiles, total);
    if (pairs.length === 0) return { ok: false, reason: "tiles must include at least one pair that makes total" };
    if (pickPairRequireAll(question) && pairs.length < 2) {
      return { ok: false, reason: "requireAllPairs needs at least two pairs in tiles" };
    }
    return { ok: true };
  }
  const range = question.tileRange;
  if (!range) return { ok: false, reason: "set tiles or tileRange" };
  const complements = possibleComplements(range.min, range.max, total);
  if (complements.length === 0) {
    return { ok: false, reason: "tileRange must contain two numbers that add to total" };
  }
  const count = question.tileCount ?? 4;
  if (pickPairRequireAll(question) && complements.length < 2) {
    return { ok: false, reason: "requireAllPairs needs two different pairs in tileRange" };
  }
  if (pickPairRequireAll(question) && count < 4) {
    return { ok: false, reason: "requireAllPairs needs at least 4 tiles" };
  }
  return { ok: true };
}
