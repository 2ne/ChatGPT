import {
  OBJECT_ITEMS,
  type BaseTenAsset,
  type HundredSquareAsset,
  type NumberLineAsset,
  type ObjectAsset,
  type ObjectItem,
  type TenFrameAsset,
} from "../types/activity";

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

/** Fill colour for ten-frame cells. Keep these vivid and distinct. */
export const OBJECT_FILL: Record<ObjectItem, string> = {
  apple: "#e03131",
  banana: "#f4c430",
  star: "#ffb100",
  balloon: "#e64980",
  car: "#228be6",
  duck: "#f08c00",
  ladybird: "#c92a2a",
  frog: "#2f9e44",
  fish: "#0c8599",
  strawberry: "#f03e3e",
  sparkle: "#fab005",
};

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
  if (visual.added != null) {
    const addedNoun = visual.added === 1 ? words.singular : words.plural;
    return `${visual.count} ${noun} plus ${visual.added} ${addedNoun}`;
  }
  if (visual.removed != null) {
    const takenNoun = visual.removed === 1 ? words.singular : words.plural;
    return `${visual.count} ${noun}, ${visual.removed} ${takenNoun} taken away`;
  }
  return `${visual.count} ${noun}`;
}

export function describeTenFrame(frame: TenFrameAsset): string {
  const item = frame.item ?? "apple";
  const words = OBJECT_WORDS[item];
  const noun = frame.count === 1 ? words.singular : words.plural;
  const parts = frame.parts ? ` in two parts, ${frame.parts[0]} and ${frame.parts[1]}` : "";
  const pairs = frame.pairs ? " grouped in pairs" : "";
  return `ten frame showing ${frame.count} ${noun}${parts}${pairs}`;
}

export function tenFrameKey(frame: TenFrameAsset): string {
  const parts = frame.parts ? `:${frame.parts[0]}-${frame.parts[1]}` : "";
  const pairs = frame.pairs ? ":pairs" : "";
  return `ten-frame:${frame.count}:${frame.item ?? "apple"}${parts}${pairs}`;
}

export function describeBaseTen(model: BaseTenAsset): string {
  const tens = model.tens === 1 ? "1 ten" : `${model.tens} tens`;
  const ones = model.ones === 1 ? "1 one" : `${model.ones} ones`;
  if (model.tens === 0) return ones;
  if (model.ones === 0) return tens;
  return `${tens} and ${ones}`;
}

export function baseTenKey(model: BaseTenAsset): string {
  return `base-ten:${model.tens}:${model.ones}:${model.style ?? "segmented"}`;
}

export function describeNumberLine(line: NumberLineAsset): string {
  const scale = line.scale ?? (line.end <= 20 ? "ones" : "tens");
  const ticks = scale === "tens" ? "a tick every ten" : "a tick every one";
  if (line.flags?.length) {
    const flags = line.flags.map((flag) => `flag ${flag.letter}`).join(", ");
    return `Number line from ${line.start} to ${line.end} with ${ticks}. ${flags}. The flags are not buttons.`;
  }
  return `Number line from ${line.start} to ${line.end} with ${ticks}. One mark is a question mark.`;
}

export function describeHundredSquare(square: HundredSquareAsset): string {
  const last = square.start + square.rows * 10 - 1;
  const extra = square.highlight != null ? " One cell is highlighted." : "";
  return `A hundred square from ${square.start} to ${last}. One cell is a question mark.${extra}`;
}

export function visualKey(visual: ObjectAsset): string {
  if (visual.added != null) return `${visual.item}:${visual.count}+${visual.added}`;
  if (visual.removed != null) return `${visual.item}:${visual.count}-${visual.removed}`;
  return `${visual.item}:${visual.count}`;
}
