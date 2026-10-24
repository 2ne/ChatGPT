import type { MatchPairsMode, MatchPairsQuestion } from "../types/activity";

export const MATCH_PAIR_MARKS = [
  { id: "star", word: "star", tint: "#fff4d6", ink: "#b45309" },
  { id: "heart", word: "heart", tint: "#ffe4e9", ink: "#be123c" },
  { id: "moon", word: "moon", tint: "#e0f2fe", ink: "#0369a1" },
  { id: "sun", word: "sun", tint: "#fef3c7", ink: "#d97706" },
  { id: "leaf", word: "leaf", tint: "#dcfce7", ink: "#047857" },
  { id: "drop", word: "drop", tint: "#e0e7ff", ink: "#4338ca" },
] as const;

export type MatchPairMark = (typeof MATCH_PAIR_MARKS)[number];

export function matchPairsMode(question: MatchPairsQuestion): MatchPairsMode {
  return question.mode;
}

export function markForPair(index: number): MatchPairMark {
  const mark = MATCH_PAIR_MARKS[index % MATCH_PAIR_MARKS.length];
  return mark ?? MATCH_PAIR_MARKS[0]!;
}

/** Deterministic shuffle, same family as the old match-pairs bank order. */
export function seededOrder<T>(items: T[], seed: string): T[] {
  let hash = 2166136261;
  for (let i = 0; i < seed.length; i += 1) {
    hash ^= seed.charCodeAt(i);
    hash = Math.imul(hash, 16777619);
  }
  const next = [...items];
  for (let i = next.length - 1; i > 0; i -= 1) {
    hash = Math.imul(hash ^ (hash >>> 16), 2246822507);
    const j = (hash >>> 0) % (i + 1);
    const swap = next[i];
    next[i] = next[j] ?? swap;
    next[j] = swap;
  }
  if (next.length > 1 && next.every((item, index) => item === items[index])) {
    const first = next[0];
    const second = next[1];
    if (first !== undefined && second !== undefined) {
      next[0] = second;
      next[1] = first;
    }
  }
  return next;
}
