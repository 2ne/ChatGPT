import type { Activity } from "../../types/activity";
import { numberBondsTo10 } from "./number-bonds-to-10";

/**
 * Master activity registry.
 * Agents: add new activities here after creating `./<id>.ts`. See AGENTS.md.
 */
export const activities: Activity[] = [numberBondsTo10];

export const activitiesById: Record<string, Activity> = Object.fromEntries(
  activities.map((activity) => [activity.id, activity]),
);

export function getActivity(id: string): Activity | undefined {
  return activitiesById[id];
}
