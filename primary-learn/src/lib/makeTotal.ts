import type { MakeTotalGap, MakeTotalOp, MakeTotalQuestion, ObjectItem } from "../types/activity";

export function makeTotalPart(question: MakeTotalQuestion): number {
  if (question.part != null) return question.part;
  return question.visual?.count ?? 0;
}

export function makeTotalOther(question: MakeTotalQuestion): number {
  if (question.other != null) return question.other;
  return question.extras?.[0]?.count ?? 0;
}

export function makeTotalGap(question: MakeTotalQuestion): MakeTotalGap {
  return question.gap ?? "right";
}

export function makeTotalOp(question: MakeTotalQuestion): MakeTotalOp {
  return question.operation ?? "add";
}

/** The number the child should give for the ? box. */
export function makeTotalMissing(question: MakeTotalQuestion): number {
  const part = makeTotalPart(question);
  const gap = makeTotalGap(question);
  if (makeTotalOp(question) === "subtract") {
    return question.total - part;
  }
  if (gap === "total") return question.total;
  return question.total - part;
}

export function makeTotalItem(question: MakeTotalQuestion): ObjectItem {
  return question.visual?.item ?? "star";
}

export function makeTotalOtherItem(question: MakeTotalQuestion): ObjectItem {
  return question.extras?.[0]?.item ?? makeTotalItem(question);
}

export function makeTotalKnownCount(question: MakeTotalQuestion): number {
  if (makeTotalOp(question) === "subtract") return question.total;
  if (makeTotalGap(question) === "total") return makeTotalPart(question);
  return makeTotalPart(question);
}

/** Addable slots in fill-slots. More than the answer so the child can overshoot. */
export function makeTotalSlotBank(question: MakeTotalQuestion): number {
  if (question.slotCount != null) return question.slotCount;
  const missing = makeTotalMissing(question);
  return Math.min(12, Math.max(missing + 2, 2));
}

export function optionNumber(label: string | undefined): number | null {
  if (label == null || label.trim() === "") return null;
  const value = Number(label);
  return Number.isInteger(value) ? value : null;
}
