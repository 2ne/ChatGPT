import {
  baseTenKey,
  describeBaseTen,
  describeTenFrame,
  describeVisual,
  tenFrameKey,
  visualKey,
} from "../data/objects";
import type { BaseTenAsset, MatchSide, ObjectAsset, TenFrameAsset } from "../types/activity";
import { shapeName } from "./shapes";

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

export function matchSideLabel(side: MatchSide): string {
  if (typeof side === "string") return side;
  if (side.label) return side.label;
  if (side.shape) return shapeName(side.shape);
  if (side.tenFrame) return describeTenFrame(side.tenFrame);
  if (side.baseTen) return describeBaseTen(side.baseTen);
  if (side.visual) return describeVisual(side.visual);
  return "";
}

export function matchSideKey(side: MatchSide): string {
  if (typeof side === "string") return side;
  if (side.shape) return `shape:${JSON.stringify(side.shape)}`;
  if (side.tenFrame) return tenFrameKey(side.tenFrame);
  if (side.baseTen) return baseTenKey(side.baseTen);
  if (side.visual) return visualKey(side.visual);
  return side.label ?? "";
}
