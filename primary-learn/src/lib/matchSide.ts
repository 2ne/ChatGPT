import { describeVisual, visualKey } from "../data/objects";
import type { MatchSide, ObjectAsset } from "../types/activity";

export function matchSideVisual(side: MatchSide): ObjectAsset | undefined {
  if (typeof side === "string") return undefined;
  return side.visual;
}

export function matchSideLabel(side: MatchSide): string {
  if (typeof side === "string") return side;
  if (side.label) return side.label;
  if (side.visual) return describeVisual(side.visual);
  return "";
}

export function matchSideKey(side: MatchSide): string {
  if (typeof side === "string") return side;
  if (side.visual) return visualKey(side.visual);
  return side.label ?? "";
}
