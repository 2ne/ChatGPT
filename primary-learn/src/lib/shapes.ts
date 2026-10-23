import type { ShapeAsset, ShapeName } from "../types/shapes";

export const SHAPE_COLOUR_VALUES = { purple: "#7567e8", blue: "#469ad4", green: "#40a784", orange: "#e9a34c" };
export const SHAPE_VARIANTS: Record<ShapeName, readonly string[]> = {
  circle: ["standard"], triangle: ["standard", "wide", "tall", "right", "scalene"],
  square: ["standard"], rectangle: ["standard", "wide", "tall"],
  cube: ["standard"], cuboid: ["standard", "wide", "tall"],
  pyramid: ["standard", "tall", "triangular"], sphere: ["standard"],
};

export function isSolidShape(shape: ShapeAsset): boolean {
  return ["cube", "cuboid", "pyramid", "sphere"].includes(shape.name);
}

export function shapeName(shape: ShapeAsset): string {
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
  };
  return descriptions[shape.name];
}
