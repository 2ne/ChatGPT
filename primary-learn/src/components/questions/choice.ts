export type Reveal = "correct" | "incorrect" | null;

export function choiceClass(selected: boolean, marked: "correct" | "wrong" | null) {
  return [
    "option",
    selected ? "is-selected" : "",
    marked === "correct" ? "is-correct" : "",
    marked === "wrong" ? "is-wrong" : "",
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
