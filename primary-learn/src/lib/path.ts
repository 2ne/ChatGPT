import { activities } from "../data/activities";
import { PATH_CATEGORIES } from "../data/path.generated";
import { LEVELS_PER_NODE, STARS_PER_DIFFICULTY, type StarCount } from "./mastery";
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
 * done: every existing Easy / Medium / Hard has at least one star.
 * current: first node in path order with any level below 1 star (You are here).
 * open: has a quest, playable, not the suggested stop.
 * soon: no Easy quest written yet.
 * Nothing is gated. Map stars still need 3 stars on a level.
 */
export type LevelStatus = "done" | "current" | "open" | "soon";

export type DifficultyState = {
  difficulty: Difficulty;
  activity?: Activity;
  done: boolean;
  /** True when this row has a quest. Nothing is gated. */
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
  /** Stars earned across Easy / Medium / Hard, out of 9. Detail for the level sheet. */
  stars: number;
  /** How many of Easy / Medium / Hard have all three stars. This is what the map node shows (max 3). */
  cleared: number;
  /** All three levels have three stars. This node gets a gold cup. */
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
  let suggested = false;

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
          playable: Boolean(activity),
          bestCorrectCount: mark?.bestCorrectCount ?? 0,
          bestTotalCount: mark?.bestTotalCount ?? 0,
          bestStars,
        };
      });

      const easy = raw[0];
      const hasUnpassedLevel = raw.some((entry) => entry.activity && !entry.done);
      let status: LevelStatus;
      if (!easy.activity) {
        status = "soon";
      } else if (hasUnpassedLevel && !suggested) {
        status = "current";
        suggested = true;
      } else if (!hasUnpassedLevel) {
        status = "done";
      } else {
        status = "open";
      }

      const stars = raw.reduce((sum, entry) => sum + entry.bestStars, 0);
      const cleared = raw.filter((entry) => entry.bestStars >= STARS_PER_DIFFICULTY).length;

      levels.push({
        node,
        category,
        categoryIndex,
        status,
        stars,
        cleared,
        cup: cleared >= LEVELS_PER_NODE,
        difficulties: raw,
      });
    }
  });

  if (!suggested) {
    const nextSoon = levels.find((level) => level.status === "soon");
    if (nextSoon) nextSoon.status = "current";
  }

  return levels;
}
