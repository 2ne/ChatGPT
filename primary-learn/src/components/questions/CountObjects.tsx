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
  // A counting check tests number order rather than a pictured quantity.
  const countCheck = question.prompt.match(/^Pip counts ((?:\d+\s*,\s*)+\d+)\. Is that right\?$/);
  if (countCheck) {
    const numberSequence = countCheck[1].split(",").map(value => Number(value.trim()));
    return <MultipleChoice {...props} question={{ ...question, numberSequence }} />;
  }
  return (
    <div className="option-stack">
      <ObjectGroup
        visual={question.visual}
        extras={question.extras}
        layout={question.layout}
        interactive
      />
      <MultipleChoice {...props} />
    </div>
  );
}
