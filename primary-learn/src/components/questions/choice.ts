export type Reveal = "correct" | "incorrect" | null;

type ChoiceOption = {
  label?: string;
  visual?: unknown;
};

/** Digit-only answers: big centred numbers, no A–D badge. */
export function optionsAreNumerals(options: ChoiceOption[]): boolean {
  return (
    options.length > 0 &&
    options.every((option) => !option.visual && option.label != null && /^\d+$/.test(option.label.trim()))
  );
}

export function choiceClass(
  selected: boolean,
  marked: "correct" | "wrong" | null,
  extras: string[] = [],
) {
  return [
    "option",
    selected ? "is-selected" : "",
    marked === "correct" ? "is-correct" : "",
    marked === "wrong" ? "is-wrong" : "",
    ...extras,
  ]
    .filter(Boolean)
    .join(" ");
}

export function markChoice(
  reveal: Reveal,
  selected: boolean,
  isCorrectOption: boolean,
): "correct" | "wrong" | null {
  if (!reveal) return null;
  if (isCorrectOption) return "correct";
  if (selected) return "wrong";
  return null;
}
