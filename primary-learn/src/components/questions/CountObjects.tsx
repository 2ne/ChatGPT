import type { CountObjectsQuestion } from "../../types/activity";
import { MultipleChoice } from "./MultipleChoice";
import { ObjectGroup } from "./ObjectGroup";
import type { Reveal } from "./choice";

type CountObjectsProps = {
  question: CountObjectsQuestion;
  answer: unknown;
  disabled?: boolean;
  reveal: Reveal;
  onChange: (value: unknown) => void;
};

/** How-many pictures: tap each object to count it, then pick the number. */
export function CountObjects(props: CountObjectsProps) {
  const { question } = props;
  return (
    <div className="option-stack">
      <ObjectGroup
        visual={question.visual}
        extras={question.extras}
        layout={question.layout}
        interactive
      />
      <MultipleChoice {...props} hideVisual />
    </div>
  );
}
