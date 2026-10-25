import type { MatchPairsMode, MatchPairsQuestion } from "../types/activity";

/** Distinct fill and border colours for a found pair. No symbols. */
export const MATCH_PAIR_COLOURS = [
  { tint: "#fff4d6", ink: "#b45309" },
  { tint: "#ffe4e9", ink: "#be123c" },
  { tint: "#e0f2fe", ink: "#0369a1" },
  { tint: "#dcfce7", ink: "#047857" },
  { tint: "#f3e8ff", ink: "#6d28d9" },
  { tint: "#ffedd5", ink: "#c2410c" },
] as const;

export type MatchPairColour = (typeof MATCH_PAIR_COLOURS)[number];

export function matchPairsMode(question: MatchPairsQuestion): MatchPairsMode {
  return question.mode;
}

/** Set on a match-pairs answer when the child misses on the first try. */
export const MATCH_MISS_KEY = "_missed";

export function isMatchMissed(answer: unknown): boolean {
  return Boolean(answer && typeof answer === "object" && MATCH_MISS_KEY in (answer as object));
}

export function markMatchMissed(map: Record<string, string>): Record<string, string> {
  return { ...map, [MATCH_MISS_KEY]: "1" };
}

export function colourForPair(index: number): MatchPairColour {
  const colour = MATCH_PAIR_COLOURS[index % MATCH_PAIR_COLOURS.length];
  return colour ?? MATCH_PAIR_COLOURS[0]!;
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
