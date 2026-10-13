import type { Activity } from "../types/activity";
import type { ActivityAttempt, ActivityProgress } from "../types/progress";

export function scoreAttempt(
  activity: Activity,
  correctCount: number,
  totalCount: number,
  missedQuestionIds: string[],
  startedAt: string,
  finishedAt: string,
): ActivityAttempt {
  const percent = totalCount === 0 ? 0 : Math.round((correctCount / totalCount) * 100);
  const mastered = percent / 100 >= activity.masteryThreshold;

  return {
    activityId: activity.id,
    startedAt,
    finishedAt,
    correctCount,
    totalCount,
    percent,
    mastered,
    missedQuestionIds,
  };
}

export function mergeAttempt(
  existing: ActivityProgress | undefined,
  attempt: ActivityAttempt,
): ActivityProgress {
  const attempts = [...(existing?.attempts ?? []), attempt].slice(-20);
  const bestPercent = Math.max(existing?.bestPercent ?? 0, attempt.percent);
  const mastered = Boolean(existing?.mastered) || attempt.mastered;

  return {
    activityId: attempt.activityId,
    attempts,
    bestPercent,
    mastered,
    lastAttemptAt: attempt.finishedAt,
  };
}

export function masteryLabel(progress: ActivityProgress | undefined, threshold: number): string {
  if (!progress || progress.attempts.length === 0) return "Not started";
  if (progress.mastered) return "Mastered";
  if (progress.bestPercent / 100 >= threshold * 0.75) return "Almost there";
  return "Keep practising";
}
