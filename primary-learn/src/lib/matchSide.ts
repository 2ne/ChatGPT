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

function isEquationLabel(label: string): boolean {
  return /^\d+\s*[+\u2212\-]\s*\d+$/.test(label.trim());
}

function sideLabel(side: MatchSide): string | undefined {
  if (typeof side === "string") return side;
  return side.label;
}

function labelRepresentation(label: string): string {
  if (isNumeralLabel(label)) return "numeral";
  if (isEquationLabel(label)) return "equation";
  return "word";
}

/** How this side shows the number. Matched pairs must use two different kinds. */
export function matchSideRepresentation(side: MatchSide): string {
  const label = sideLabel(side);
  if (typeof side === "string") return labelRepresentation(side);
  if (side.tenFrame) return "ten-frame";
  if (side.baseTen) return "base-ten";
  if (side.dice) return "dice";
  if (side.shape) return isRealObject(side.shape) ? "real-object" : "shape";
  if (side.visual) return `objects-${side.layout ?? "row"}`;
  if (label) return labelRepresentation(label);
  return "unknown";
}

/**
 * Match cards are 120px high. A picture must stay readable:
 * cells or counters at least 16px, or use a numeral or word instead.
 */
export function matchSideFitsCard(side: MatchSide): string | null {
  if (typeof side === "string") return null;
  if (side.baseTen) {
    return "tens and ones are too small on a match card. Use a numeral or a word";
  }
  if (side.tenFrame && side.tenFrame.count > 10) {
    return "a ten frame above 10 needs two frames and is too small on a match card. Use a numeral or a word";
  }
  if (side.visual && side.visual.count > 20) {
    return "more than 20 objects cannot stay 16px on a match card";
  }
  return null;
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
