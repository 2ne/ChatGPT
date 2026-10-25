import {
  baseTenKey,
  describeBaseTen,
  describeTenFrame,
  describeVisual,
  tenFrameKey,
  visualKey,
} from "../data/objects";
import type { BaseTenAsset, DiceAsset, MatchSide, ObjectAsset, TenFrameAsset } from "../types/activity";
import { isRealObject, shapeName } from "./shapes";

export function matchSideVisual(side: MatchSide): ObjectAsset | undefined {
  if (typeof side === "string") return undefined;
  return side.visual;
}

export function matchSideTenFrame(side: MatchSide): TenFrameAsset | undefined {
  if (typeof side === "string") return undefined;
  return side.tenFrame;
}

export function matchSideBaseTen(side: MatchSide): BaseTenAsset | undefined {
  if (typeof side === "string") return undefined;
  return side.baseTen;
}

export function matchSideDice(side: MatchSide): DiceAsset | undefined {
  if (typeof side === "string") return undefined;
  return side.dice;
}

function isNumeralLabel(label: string): boolean {
  return /^\d+$/.test(label.trim());
}

/** How this side shows the number. Matched pairs must use two different kinds. */
export function matchSideRepresentation(side: MatchSide): string {
  if (typeof side === "string") return isNumeralLabel(side) ? "numeral" : "word";
  if (side.tenFrame) return "ten-frame";
  if (side.baseTen) return "base-ten";
  if (side.dice) return "dice";
  if (side.shape) return isRealObject(side.shape) ? "real-object" : "shape";
  if (side.visual) return `objects-${side.layout ?? "row"}`;
  if (side.label) return isNumeralLabel(side.label) ? "numeral" : "word";
  return "unknown";
}

export function matchSideLabel(side: MatchSide): string {
  if (typeof side === "string") return side;
  if (side.label) return side.label;
  if (side.shape) return shapeName(side.shape);
  if (side.tenFrame) return describeTenFrame(side.tenFrame);
  if (side.baseTen) return describeBaseTen(side.baseTen);
  if (side.dice) return `dice showing ${side.dice.count}`;
  if (side.visual) return describeVisual(side.visual);
  return "";
}

export function matchSideKey(side: MatchSide): string {
  if (typeof side === "string") return side;
  if (side.shape) return `shape:${JSON.stringify(side.shape)}`;
  if (side.tenFrame) return tenFrameKey(side.tenFrame);
  if (side.baseTen) return baseTenKey(side.baseTen);
  if (side.dice) return `dice:${side.dice.count}`;
  if (side.visual) return visualKey(side.visual);
  return side.label ?? "";
}
