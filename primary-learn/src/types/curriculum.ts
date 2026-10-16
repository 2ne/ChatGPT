/** UK primary year groups (EYFS Reception + KS1/KS2). */
export const YEAR_GROUPS = [
  "Reception",
  "Year1",
  "Year2",
  "Year3",
  "Year4",
  "Year5",
  "Year6",
] as const;

export type YearGroup = (typeof YEAR_GROUPS)[number];

/** Ability band within the chosen year group(s). */
export const ABILITY_BANDS = ["emerging", "expected", "greater-depth"] as const;

export type AbilityBand = (typeof ABILITY_BANDS)[number];

/** This product is primary maths. Other subjects are not in this app. */
export const SUBJECTS = ["maths"] as const;

export type Subject = (typeof SUBJECTS)[number];
