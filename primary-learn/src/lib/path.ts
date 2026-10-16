import { activities } from "../data/activities";
import { PATH_CATEGORIES } from "../data/path.generated";
import type { Activity } from "../types/activity";
import type { Difficulty, PathCategory, PathNode } from "../types/path";
import type { ProgressState } from "../types/progress";

export const DIFFICULTIES: Difficulty[] = [1, 2, 3];

export const DIFFICULTY_LABELS: Record<Difficulty, string> = {
  1: "Easy",
  2: "Medium",
  3: "Hard",
};

/**
 * done: easy is mastered. current: the one level to play next.
 * locked: has a quest, but an earlier level is not done.
 * soon: no easy quest written for this level yet.
 */
export type LevelStatus = "done" | "current" | "locked" | "soon";

export type DifficultyState = {
  difficulty: Difficulty;
  activity?: Activity;
  done: boolean;
  /** Can be started now. Medium needs easy done; hard needs medium done. */
  playable: boolean;
};

export type LevelState = {
  node: PathNode;
  category: PathCategory;
  categoryIndex: number;
  status: LevelStatus;
  stars: number;
  difficulties: DifficultyState[];
};

const questByLevel = new Map<string, Activity>();
for (const activity of activities) {
  questByLevel.set(`${activity.pathNode}:${activity.difficulty}`, activity);
}

export function questFor(nodeId: string, difficulty: Difficulty): Activity | undefined {
  return questByLevel.get(`${nodeId}:${difficulty}`);
}

export function buildLevels(progress: ProgressState): LevelState[] {
  const levels: LevelState[] = [];
  let blocked = false;

  PATH_CATEGORIES.forEach((category, categoryIndex) => {
    for (const node of category.nodes) {
      const raw = DIFFICULTIES.map((difficulty) => {
        const activity = questFor(node.id, difficulty);
        const done = activity ? Boolean(progress.byActivity[activity.id]?.mastered) : false;
        return { difficulty, activity, done };
      });

      const easy = raw[0];
      let status: LevelStatus;
      if (!easy.activity) {
        status = "soon";
      } else if (easy.done) {
        status = "done";
      } else if (!blocked) {
        status = "current";
        blocked = true;
      } else {
        status = "locked";
      }

      const open = status === "done" || status === "current";
      const difficulties = raw.map((entry, i) => ({
        ...entry,
        playable:
          open && Boolean(entry.activity) && (i === 0 || raw[i - 1].done),
      }));

      levels.push({
        node,
        category,
        categoryIndex,
        status,
        stars: difficulties.filter((d) => d.done).length,
        difficulties,
      });
    }
  });

  return levels;
}

export function isActivityPlayable(activityId: string, progress: ProgressState): boolean {
  return buildLevels(progress).some((level) =>
    level.difficulties.some((entry) => entry.activity?.id === activityId && entry.playable),
  );
}
