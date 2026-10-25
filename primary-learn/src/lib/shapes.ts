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

export function isSolidShape(shape: ShapeAsset): boolean {
  return ["cube", "cuboid", "pyramid", "sphere"].includes(shape.name);
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
    cube: "A solid with six equal square faces.",
    cuboid: "A solid box with rectangular faces and unequal edge lengths.",
    pyramid: "A solid with triangular faces meeting at one point.",
    sphere: "A solid round shape with a curved surface and no flat faces.",
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
