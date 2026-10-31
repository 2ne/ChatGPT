import type { FractionAsset } from "../types/activity";

export function describeFraction(fraction: FractionAsset): string {
  const equality = fraction.equal === false ? "unequal" : "equal";
  const coloured = fraction.shaded.length;
  return `A ${fraction.shape} split into ${fraction.parts} ${equality} parts. ${coloured} ${coloured === 1 ? "part is" : "parts are"} coloured.`;
}
