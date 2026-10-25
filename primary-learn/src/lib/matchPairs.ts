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
