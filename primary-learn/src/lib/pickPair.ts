import type { PickPairQuestion } from "../types/activity";

export type PickPairTile = {
  id: string;
  value: number;
};

export type PickPairAnswer = {
  picked: string[];
};

type Rng = () => number;

export function isPickPairAnswer(value: unknown): value is PickPairAnswer {
  if (!value || typeof value !== "object") return false;
  const record = value as PickPairAnswer;
  return Array.isArray(record.picked);
}

export function emptyPickPairAnswer(): PickPairAnswer {
  return { picked: [] };
}

export function pickPairShowDots(question: PickPairQuestion): boolean {
  return question.showDots !== false;
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

/** How many unordered tile pairs add to total, including overlapping pairs. */
export function pickPairMatchCount(values: number[], total: number): number {
  let count = 0;
  for (let i = 0; i < values.length; i += 1) {
    for (let j = i + 1; j < values.length; j += 1) {
      if ((values[i] ?? 0) + (values[j] ?? 0) === total) count += 1;
    }
  }
  return count;
}

export function togglePickPairTile(answer: PickPairAnswer, id: string): PickPairAnswer {
  if (answer.picked.includes(id)) {
    return { picked: answer.picked.filter((item) => item !== id) };
  }
  if (answer.picked.length >= 2) return answer;
  return { picked: [...answer.picked, id] };
}

export function isCompletePickPair(question: PickPairQuestion, answer: PickPairAnswer): boolean {
  const tiles = pickPairTiles(question);
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

/** Draw tiles from `tileRange` so exactly one valid pair is present. */
export function drawPickPairTiles(question: PickPairQuestion, rng: Rng): number[] {
  const range = question.tileRange;
  if (!range) return question.tiles ?? [];
  const count = Math.min(question.tileCount ?? 4, 4);
  const pool: number[] = [];
  for (let value = range.min; value <= range.max; value += 1) pool.push(value);
  const complements = possibleComplements(range.min, range.max, question.total);
  const chosen = shuffleIn(complements, rng)[0];
  if (!chosen) return [];
  const tiles = [chosen[0], chosen[1]];
  const used = new Set(tiles);
  const blocked = new Set(tiles.map((value) => question.total - value));
  const candidates = shuffleIn(
    pool.filter((value) => !used.has(value) && !blocked.has(value)),
    rng,
  );
  for (const value of candidates) {
    if (tiles.length >= count) break;
    tiles.push(value);
    used.add(value);
    blocked.add(question.total - value);
  }
  return shuffleIn(tiles.slice(0, count), rng);
}

export function canDrawPickPair(question: PickPairQuestion): { ok: true } | { ok: false; reason: string } {
  const total = question.total;
  if (question.tiles && question.tiles.length > 0) {
    if (pickPairMatchCount(question.tiles, total) !== 1) {
      return { ok: false, reason: "tiles must include exactly one pair that makes total" };
    }
    return { ok: true };
  }
  const range = question.tileRange;
  if (!range) return { ok: false, reason: "set tiles or tileRange" };
  const complements = possibleComplements(range.min, range.max, total);
  if (complements.length === 0) {
    return { ok: false, reason: "tileRange must contain two numbers that add to total" };
  }
  return { ok: true };
}
