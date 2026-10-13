import type { ActivityType } from "../types/activity";
import type { AbilityBand, Subject, YearGroup } from "../types/curriculum";

export const SUBJECT_LABELS: Record<Subject, string> = {
  maths: "Maths",
};

export const YEAR_GROUP_LABELS: Record<YearGroup, string> = {
  Reception: "Reception",
  Year1: "Year 1",
  Year2: "Year 2",
  Year3: "Year 3",
  Year4: "Year 4",
  Year5: "Year 5",
  Year6: "Year 6",
};

export const ABILITY_LABELS: Record<AbilityBand, string> = {
  emerging: "Emerging",
  expected: "Expected",
  "greater-depth": "Greater depth",
};

export const ACTIVITY_TYPE_LABELS: Record<ActivityType, string> = {
  "number-bonds": "Number bonds",
  "times-tables": "Times tables",
  fractions: "Fractions",
  "place-value": "Place value",
  reasoning: "Reasoning",
};

export function formatYearGroups(years: YearGroup[]): string {
  return years.map((y) => YEAR_GROUP_LABELS[y]).join(" · ");
}
