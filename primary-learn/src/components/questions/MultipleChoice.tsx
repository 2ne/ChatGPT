import { copy } from "../../data/copy";
import type { CountObjectsQuestion, MultipleChoiceQuestion } from "../../types/activity";
import { ObjectGroup, OptionContent } from "./ObjectGroup";
import { choiceClass, markChoice, type Reveal } from "./choice";

type MultipleChoiceProps = {
  question: MultipleChoiceQuestion | CountObjectsQuestion;
  answer: unknown;
  disabled?: boolean;
  reveal: Reveal;
  onChange: (value: unknown) => void;
};

export function MultipleChoice({
  question,
  answer,
  disabled,
  reveal,
  onChange,
}: MultipleChoiceProps) {
  const showStem = question.kind !== "count-objects" && Boolean(question.visual);
  return (
    <div className="option-stack">
      {showStem && question.visual ? (
        <ObjectGroup
          visual={question.visual}
          extras={question.extras}
          layout={question.layout}
        />
      ) : null}
      <div role="radiogroup" aria-label={copy.pickOne} className="option-stack">
        {question.options.map((option, slot) => {
          const selected = answer === option.id;
          const marked = markChoice(reveal, selected, option.id === question.correctId);
          return (
            <button
              key={option.id}
              type="button"
              role="radio"
              aria-checked={selected}
              disabled={disabled}
              onClick={() => onChange(option.id)}
              className={choiceClass(selected, marked)}
            >
              <span className="option-letter" aria-hidden>
                {"ABCD"[slot] ?? "•"}
              </span>
              <OptionContent label={option.label} visual={option.visual} />
              {marked === "correct" ? (
                <span className="option-check" aria-hidden>
                  ✓
                </span>
              ) : marked === "wrong" ? (
                <span className="option-cross" aria-hidden>
                  ✕
                </span>
              ) : null}
            </button>
          );
        })}
      </div>
    </div>
  );
}
