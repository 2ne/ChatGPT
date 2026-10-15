import type { CountObjectsQuestion } from "../../types/activity";
import { MultipleChoice } from "./MultipleChoice";
import type { Reveal } from "./choice";

type CountObjectsProps = {
  question: CountObjectsQuestion;
  answer: unknown;
  disabled?: boolean;
  reveal: Reveal;
  onChange: (value: unknown) => void;
};

/** How-many pictures: same answers as multiple-choice, objects drawn from `visual`. */
export function CountObjects(props: CountObjectsProps) {
  return <MultipleChoice {...props} />;
}
