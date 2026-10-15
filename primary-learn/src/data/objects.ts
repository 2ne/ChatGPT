import { OBJECT_ITEMS, type ObjectAsset, type ObjectItem } from "../types/activity";

/** Grammar for object assets. Pictures are drawn by ObjectGroup, not stored in quest JSON. */
export const OBJECT_WORDS: Record<ObjectItem, { singular: string; plural: string }> = {
  apple: { singular: "apple", plural: "apples" },
  star: { singular: "star", plural: "stars" },
  balloon: { singular: "balloon", plural: "balloons" },
  duck: { singular: "duck", plural: "ducks" },
  ladybird: { singular: "ladybird", plural: "ladybirds" },
  frog: { singular: "frog", plural: "frogs" },
  fish: { singular: "fish", plural: "fish" },
  strawberry: { singular: "strawberry", plural: "strawberries" },
  sparkle: { singular: "star", plural: "stars" },
};

export function isObjectItem(value: string): value is ObjectItem {
  return (OBJECT_ITEMS as readonly string[]).includes(value);
}

export function describeVisual(visual: ObjectAsset): string {
  const words = OBJECT_WORDS[visual.item];
  const noun = visual.count === 1 ? words.singular : words.plural;
  return `${visual.count} ${noun}`;
}

export function visualKey(visual: ObjectAsset): string {
  return `${visual.item}:${visual.count}`;
}
