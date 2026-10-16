import { activities } from "../data/activities";
import { PATH_CATEGORIES } from "../data/path.generated";
import { STARS_PER_NODE, type StarCount } from "./mastery";
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
 * done: easy has at least one star. current: the one level to play next.
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
  bestCorrectCount: number;
  bestTotalCount: number;
  bestStars: StarCount;
};

export type LevelState = {
  node: PathNode;
  category: PathCategory;
  categoryIndex: number;
  status: LevelStatus;
  /** Stars earned across Easy / Medium / Hard, out of 9. */
  stars: number;
  /** All 9 stars. This node gets a gold cup. */
  cup: boolean;
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
        const mark = activity ? progress.byActivity[activity.id] : undefined;
        const bestStars = (mark?.bestStars ?? 0) as StarCount;
        return {
          difficulty,
          activity,
          done: bestStars >= 1,
          bestCorrectCount: mark?.bestCorrectCount ?? 0,
          bestTotalCount: mark?.bestTotalCount ?? 0,
          bestStars,
        };
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
        playable: open && Boolean(entry.activity) && (i === 0 || raw[i - 1].done),
      }));

      const stars = difficulties.reduce((sum, entry) => sum + entry.bestStars, 0);

      levels.push({
        node,
        category,
        categoryIndex,
        status,
        stars,
        cup: stars >= STARS_PER_NODE,
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
