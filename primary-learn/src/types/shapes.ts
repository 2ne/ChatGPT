export const SHAPE_NAMES = [
  "circle",
  "triangle",
  "square",
  "rectangle",
  "cube",
  "cuboid",
  "pyramid",
  "sphere",
  "kite",
  "pentagon",
  "wonky",
  "ball",
  "box",
  "tin",
  "cone-hat",
  "dice",
] as const;
export const REAL_OBJECT_NAMES = ["ball", "box", "tin", "cone-hat", "dice"] as const;
export const SHAPE_COLOURS = ["purple", "blue", "green", "orange"] as const;
export type ShapeName = (typeof SHAPE_NAMES)[number];
export type RealObjectName = (typeof REAL_OBJECT_NAMES)[number];
export type ShapeAsset = {
  name: ShapeName;
  variant?: "standard" | "wide" | "tall" | "right" | "scalene" | "triangular" | "squashed";
  colour?: (typeof SHAPE_COLOURS)[number];
  rotation?: number;
  scale?: number;
};
