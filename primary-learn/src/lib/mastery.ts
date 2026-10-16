import type { ActivityAttempt, ActivityProgress, ProgressState } from "../types/progress";

/**
 * Star bands for a 10-question quest. Change these numbers to move the bar.
 * 6–7 = 1 star, 8–9 = 2 stars, 10 = 3 stars. Below 6 = 0 stars.
 * Longer quests scale to this 10-question ruler.
 */
export const STAR_SCORE = {
  one: 6,
  two: 8,
  three: 10,
} as const;

export const STARS_PER_DIFFICULTY = 3;
export const LEVELS_PER_NODE = 3;
export const STARS_PER_NODE = 9;

export type StarCount = 0 | 1 | 2 | 3;

export function attemptStars(correctCount: number, totalCount: number): StarCount {
  if (totalCount <= 0) return 0;
  const onTen =
    totalCount === STAR_SCORE.three ? correctCount : (correctCount / totalCount) * STAR_SCORE.three;
  if (onTen >= STAR_SCORE.three) return 3;
  if (onTen >= STAR_SCORE.two) return 2;
  if (onTen >= STAR_SCORE.one) return 1;
  return 0;
}

/** One or more stars unlocks the next level. */
export function passedScore(correctCount: number, totalCount: number): boolean {
  return attemptStars(correctCount, totalCount) >= 1;
}

export function scoreAttempt(
  activityId: string,
  correctCount: number,
  totalCount: number,
  missedQuestionIds: string[],
  startedAt: string,
  finishedAt: string,
): ActivityAttempt {
  const stars = attemptStars(correctCount, totalCount);
  const percent = totalCount === 0 ? 0 : Math.round((correctCount / totalCount) * 100);

  return {
    activityId,
    startedAt,
    finishedAt,
    correctCount,
    totalCount,
    percent,
    stars,
    mastered: stars >= 1,
    missedQuestionIds,
  };
}

function isBetterScore(next: { stars: number; correct: number }, best: { stars: number; correct: number }) {
  if (next.stars !== best.stars) return next.stars > best.stars;
  return next.correct > best.correct;
}

export function mergeAttempt(
  existing: ActivityProgress | undefined,
  attempt: ActivityAttempt,
): ActivityProgress {
  const attempts = [...(existing?.attempts ?? []), attempt].slice(-20);
  const nextStars = attempt.stars ?? attemptStars(attempt.correctCount, attempt.totalCount);
  const useNew =
    !existing ||
    isBetterScore(
      { stars: nextStars, correct: attempt.correctCount },
      { stars: existing.bestStars ?? 0, correct: existing.bestCorrectCount ?? 0 },
    );

  return hydrateProgress({
    activityId: attempt.activityId,
    attempts,
    bestPercent: useNew ? attempt.percent : existing.bestPercent,
    bestCorrectCount: useNew ? attempt.correctCount : existing.bestCorrectCount,
    bestTotalCount: useNew ? attempt.totalCount : existing.bestTotalCount,
    bestStars: useNew ? nextStars : existing.bestStars,
    lastAttemptAt: attempt.finishedAt,
  });
}

type ProgressRecord = {
  activityId: string;
  attempts?: ActivityAttempt[];
  bestPercent?: number;
  bestCorrectCount?: number;
  bestTotalCount?: number;
  bestStars?: number;
  lastAttemptAt?: string | null;
};

function hydrateProgress(entry: ProgressRecord): ActivityProgress {
  const attempts = entry.attempts ?? [];
  let bestCorrect = entry.bestCorrectCount ?? 0;
  let bestTotal = entry.bestTotalCount ?? 0;
  let bestPercent = entry.bestPercent ?? 0;
  let bestStars = entry.bestStars ?? 0;

  for (const attempt of attempts) {
    const stars = attempt.stars ?? attemptStars(attempt.correctCount, attempt.totalCount);
    if (isBetterScore({ stars, correct: attempt.correctCount }, { stars: bestStars, correct: bestCorrect })) {
      bestCorrect = attempt.correctCount;
      bestTotal = attempt.totalCount;
      bestPercent = attempt.percent;
      bestStars = stars;
    }
  }

  if (bestTotal <= 0 && bestPercent > 0) {
    bestTotal = STAR_SCORE.three;
    bestCorrect = Math.round((bestPercent / 100) * bestTotal);
  }

  if (bestStars <= 0 && bestTotal > 0) {
    bestStars = attemptStars(bestCorrect, bestTotal);
  }

  return {
    activityId: entry.activityId,
    attempts,
    bestPercent,
    bestCorrectCount: bestCorrect,
    bestTotalCount: bestTotal,
    bestStars,
    mastered: bestStars >= 1,
    lastAttemptAt: entry.lastAttemptAt ?? null,
  };
}

export function normalizeProgress(raw: ProgressState | null | undefined): ProgressState {
  const byActivity: Record<string, ActivityProgress> = {};
  for (const [id, entry] of Object.entries(raw?.byActivity ?? {})) {
    if (!entry) continue;
    byActivity[id] = hydrateProgress({ ...entry, activityId: entry.activityId ?? id });
  }
  return { byActivity };
}
