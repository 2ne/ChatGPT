import { validateActivity } from "../../lib/validateActivity";
import type { Activity } from "../../types/activity";

/**
 * Master activity registry. Content is JSON only.
 * Agents: drop `./<id>.json` here. Every quest JSON is loaded and validated.
 * `activity.schema.json` is excluded.
 */
const modules = import.meta.glob("./*.json", { eager: true, import: "default" }) as Record<
  string,
  unknown
>;

function fileName(path: string): string {
  const slash = path.lastIndexOf("/");
  return slash >= 0 ? path.slice(slash + 1) : path;
}

const loaded = Object.entries(modules)
  .filter(([path]) => !fileName(path).startsWith("activity.schema"))
  .map(([path, data]) => validateActivity(data, fileName(path)));

/** Stable order: path node, then Easy→Hard, then id. */
loaded.sort((a, b) => {
  if (a.pathNode !== b.pathNode) return a.pathNode.localeCompare(b.pathNode);
  if (a.difficulty !== b.difficulty) return a.difficulty - b.difficulty;
  return a.id.localeCompare(b.id);
});

export const activities: Activity[] = loaded;

export const activitiesById: Record<string, Activity> = Object.fromEntries(
  activities.map((activity) => [activity.id, activity]),
);

export function getActivity(id: string): Activity | undefined {
  return activitiesById[id];
}
