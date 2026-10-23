export const SHAPE_NAMES = ["circle", "triangle", "square", "rectangle", "cube", "cuboid", "pyramid", "sphere"] as const;
export const SHAPE_COLOURS = ["purple", "blue", "green", "orange"] as const;
export type ShapeName = (typeof SHAPE_NAMES)[number];
export type ShapeAsset = {
  name: ShapeName;
  variant?: "standard" | "wide" | "tall" | "right" | "scalene" | "triangular";
  colour?: (typeof SHAPE_COLOURS)[number];
  rotation?: number;
  scale?: number;
};
