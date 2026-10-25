import { REAL_OBJECT_NAMES, type ShapeAsset, type ShapeName } from "../types/shapes";

export const SHAPE_COLOUR_VALUES = { purple: "#7567e8", blue: "#469ad4", green: "#40a784", orange: "#e9a34c" };
export const SHAPE_VARIANTS: Record<ShapeName, readonly string[]> = {
  circle: ["standard"],
  triangle: ["standard", "wide", "tall", "right", "scalene", "squashed"],
  square: ["standard"],
  rectangle: ["standard", "wide", "tall", "squashed"],
  cube: ["standard"],
  cuboid: ["standard", "wide", "tall"],
  pyramid: ["standard", "tall", "triangular"],
  sphere: ["standard"],
  kite: ["standard"],
  pentagon: ["standard"],
  wonky: ["standard"],
  ball: ["standard"],
  box: ["standard"],
  tin: ["standard"],
  "cone-hat": ["standard"],
  dice: ["standard"],
};

export const THREE_SOLID_NAMES = ["cube", "cuboid", "pyramid", "sphere"] as const;

/** Everyday object pictures and the solid they really are. */
export const REAL_OBJECT_SOLID: Record<string, string> = {
  ball: "sphere",
  box: "cuboid",
  dice: "cube",
  "cone-hat": "cone",
  tin: "cylinder",
};

const SHAPE_LABEL_FAMILY: Record<string, string> = {
  circle: "circle",
  triangle: "triangle",
  square: "square",
  rectangle: "rectangle",
  cube: "cube",
  cuboid: "cuboid",
  pyramid: "pyramid",
  sphere: "sphere",
  cone: "cone",
  cylinder: "cylinder",
  prism: "prism",
  kite: "kite",
  pentagon: "pentagon",
  ball: "sphere",
  box: "cuboid",
  dice: "cube",
  tin: "cylinder",
  "cone-hat": "cone",
  "party hat": "cone",
};

export function isSolidShape(shape: ShapeAsset): boolean {
  return (THREE_SOLID_NAMES as readonly string[]).includes(shape.name);
}

/** The solid or flat family this picture belongs to. */
export function shapeFamily(name: string): string {
  return REAL_OBJECT_SOLID[name] ?? name;
}

export function shapeLabelFamily(label: string): string | null {
  return SHAPE_LABEL_FAMILY[label.trim().toLowerCase()] ?? null;
}

/**
 * A picture must not be labelled as a different solid.
 * Cube may be called a cuboid. Square may be called a rectangle.
 */
export function shapeLabelMatchesPicture(shapeName: string, label: string): boolean {
  const named = shapeLabelFamily(label);
  if (!named) return true;
  const picture = shapeFamily(shapeName);
  if (picture === named) return true;
  if (picture === "cube" && named === "cuboid") return true;
  if (picture === "square" && named === "rectangle") return true;
  return false;
}

export function isRealObject(shape: ShapeAsset): boolean {
  return (REAL_OBJECT_NAMES as readonly string[]).includes(shape.name);
}

export function shapeName(shape: ShapeAsset): string {
  if (shape.name === "cone-hat") return "Party hat";
  if (shape.name === "wonky") return "Odd shape";
  return shape.name.charAt(0).toUpperCase() + shape.name.slice(1);
}

// Describe geometry rather than reveal the name during a naming question.
export function describeShape(shape: ShapeAsset): string {
  const descriptions: Record<ShapeName, string> = {
    circle: "A flat round shape with a curved edge.",
    triangle: "A flat shape with three straight sides.",
    square: "A flat shape with four equal sides and four square corners.",
    rectangle: "A flat shape with four square corners and two longer sides.",
    cube: "A 3D shape with six equal square faces.",
    cuboid: "A 3D box with rectangular faces and sides that are not all the same.",
    pyramid: "A 3D shape with flat sides that meet at a point.",
    sphere: "A 3D round shape that can roll.",
    kite: "A flat shape with two pairs of equal sides that meet at points.",
    pentagon: "A flat shape with five straight sides.",
    wonky: "A flat shape with curved sides that is not a circle.",
    ball: "A ball.",
    box: "A box.",
    tin: "A tin.",
    "cone-hat": "A party hat.",
    dice: "A dice.",
  };
  return descriptions[shape.name];
}
