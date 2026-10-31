import type { MeasureAsset } from "../types/activity";

export function describeMeasure(measure: MeasureAsset): string {
  const { kind, values, units, labels, gaps } = measure;
  if (kind === "mass") {
    if (units) return `A level balance. One bag balances ${values[1]} identical blocks.`;
    const relation = values[0]! === values[1]! ? "Both pans are level." : values[0]! > values[1]! ? "The left pan is lower." : "The right pan is lower.";
    return `A balance with ${labels?.[0] ?? "bag A"} on the left and ${labels?.[1] ?? "bag B"} on the right. ${relation}`;
  }
  if (kind === "capacity" && units) return `${values[0]} identical full small cups fill the jug.`;
  if (kind === "capacity") return values.map((value, i) => `${labels?.[i] ?? "The cup"} is ${["empty", "a quarter full", "half full", "three quarters full", "full"][value]}.`).join(" ");
  if (kind === "time") return values.map((value, i) => `${labels?.[i] ?? `Child ${i + 1}`} takes ${value} seconds.`).join(" ");
  if (units) return `A strip with ${values[0]} identical blocks ${gaps ? "separated by gaps" : "touching end to end"} alongside it.`;
  return values.map((value, i) => `${labels?.[i] ?? "The strip"} is ${value} equal steps ${kind === "height" ? "tall" : "long"}${measure.offsets?.[i] ? ", with its start shifted to the right" : ""}.`).join(" ");
}
