import type { Question } from "../types/activity";
import { matchSideBaseTen } from "./matchSide";

/** True if this question shows tens and ones anywhere. */
export function questionUsesBaseTen(question: Question): boolean {
  if (question.baseTen) return true;
  for (const option of "options" in question ? question.options ?? [] : []) {
    if (option.baseTen) return true;
  }
  for (const item of "items" in question ? question.items ?? [] : []) {
    if (item.baseTen) return true;
  }
  if (question.kind !== "match-pairs") return false;
  for (const pair of question.pairs) {
    if (matchSideBaseTen(pair.left) || matchSideBaseTen(pair.right)) return true;
  }
  return question.choices.some((side) => Boolean(matchSideBaseTen(side)));
}
