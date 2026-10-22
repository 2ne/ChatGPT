import { OBJECT_ITEMS, type ObjectAsset, type ObjectItem } from "../types/activity";

/** Grammar for object assets. Pictures are drawn by ObjectGroup, not stored in quest JSON. */
export const OBJECT_GLYPH: Record<ObjectItem, string> = {
  apple: "🍎",
  banana: "🍌",
  star: "⭐",
  balloon: "🎈",
  car: "🚗",
  duck: "🦆",
  ladybird: "🐞",
  frog: "🐸",
  fish: "🐟",
  strawberry: "🍓",
  sparkle: "🌟",
};

export function objectGlyph(item: ObjectItem): string {
  return OBJECT_GLYPH[item];
}

export const OBJECT_WORDS: Record<ObjectItem, { singular: string; plural: string }> = {
  apple: { singular: "apple", plural: "apples" },
  banana: { singular: "banana", plural: "bananas" },
  star: { singular: "star", plural: "stars" },
  balloon: { singular: "balloon", plural: "balloons" },
  car: { singular: "car", plural: "cars" },
  duck: { singular: "duck", plural: "ducks" },
  ladybird: { singular: "ladybird", plural: "ladybirds" },
  frog: { singular: "frog", plural: "frogs" },
  fish: { singular: "fish", plural: "fish" },
  strawberry: { singular: "strawberry", plural: "strawberries" },
  sparkle: { singular: "star", plural: "stars" },
};

export const NUMBER_WORDS = [
  "zero",
  "one",
  "two",
  "three",
  "four",
  "five",
  "six",
  "seven",
  "eight",
  "nine",
  "ten",
  "eleven",
  "twelve",
  "thirteen",
  "fourteen",
  "fifteen",
  "sixteen",
  "seventeen",
  "eighteen",
  "nineteen",
  "twenty",
] as const;

export function numberWord(count: number): string {
  return NUMBER_WORDS[count] ?? String(count);
}

export function isObjectItem(value: string): value is ObjectItem {
  return (OBJECT_ITEMS as readonly string[]).includes(value);
}

export function describeVisual(visual: ObjectAsset): string {
  const words = OBJECT_WORDS[visual.item];
  const noun = visual.count === 1 ? words.singular : words.plural;
  if (visual.added == null) return `${visual.count} ${noun}`;
  const addedNoun = visual.added === 1 ? words.singular : words.plural;
  return `${visual.count} ${noun} plus ${visual.added} ${addedNoun}`;
}

export function visualKey(visual: ObjectAsset): string {
  return visual.added == null
    ? `${visual.item}:${visual.count}`
    : `${visual.item}:${visual.count}+${visual.added}`;
}
