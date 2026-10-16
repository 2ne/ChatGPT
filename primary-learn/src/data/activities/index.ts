import { validateActivity } from "../../lib/validateActivity";
import type { Activity } from "../../types/activity";
import countTo5 from "./count-to-5.json" with { type: "json" };
import countTo5Hard from "./count-to-5-hard.json" with { type: "json" };
import countTo5Medium from "./count-to-5-medium.json" with { type: "json" };
import numberBondsTo10 from "./number-bonds-to-10.json" with { type: "json" };
import seeNumbersTo5 from "./see-numbers-to-5.json" with { type: "json" };
import seeNumbersTo5Hard from "./see-numbers-to-5-hard.json" with { type: "json" };
import seeNumbersTo5Medium from "./see-numbers-to-5-medium.json" with { type: "json" };

/**
 * Master activity registry. Content is JSON only.
 * Agents: add `./<id>.json`, import it here, pass it through validateActivity.
 */
const files = [
  { name: "count-to-5.json", data: countTo5 },
  { name: "count-to-5-medium.json", data: countTo5Medium },
  { name: "count-to-5-hard.json", data: countTo5Hard },
  { name: "see-numbers-to-5.json", data: seeNumbersTo5 },
  { name: "see-numbers-to-5-medium.json", data: seeNumbersTo5Medium },
  { name: "see-numbers-to-5-hard.json", data: seeNumbersTo5Hard },
  { name: "number-bonds-to-10.json", data: numberBondsTo10 },
] as const;

export const activities: Activity[] = files.map((file) => validateActivity(file.data, file.name));

export const activitiesById: Record<string, Activity> = Object.fromEntries(
  activities.map((activity) => [activity.id, activity]),
);

export function getActivity(id: string): Activity | undefined {
  return activitiesById[id];
}
