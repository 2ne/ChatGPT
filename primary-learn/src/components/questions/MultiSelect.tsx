import { useRef } from "react";
import { copy } from "../../data/copy";
import type { MultiSelectQuestion } from "../../types/activity";
import { ObjectGroup, OptionContent } from "./ObjectGroup";
import { choiceClass, markChoice, type Reveal } from "./choice";

type MultiSelectProps = {
  question: MultiSelectQuestion;
  answer: unknown;
  disabled?: boolean;
  reveal: Reveal;
  onChange: (value: unknown) => void;
};

export function MultiSelect({ question, answer, disabled, reveal, onChange }: MultiSelectProps) {
  const selected = Array.isArray(answer) ? (answer as string[]) : [];
  const selectedRef = useRef(selected);
  selectedRef.current = selected;

  function toggle(id: string) {
    const current = selectedRef.current;
    const next = current.includes(id) ? current.filter((item) => item !== id) : [...current, id];
    selectedRef.current = next;
    onChange(next);
  }

  const alreadySaysEvery = /\bevery\b/i.test(question.prompt);

  return (
    <div className="option-stack" role="group" aria-label={alreadySaysEvery ? question.prompt : copy.chooseAll}>
      {question.visual ? (
        <ObjectGroup
          visual={question.visual}
          extras={question.extras}
          layout={question.layout}
          flashMs={reveal ? undefined : question.flashMs}
        />
      ) : null}
      {alreadySaysEvery ? null : <p className="t-body">{copy.chooseAll}</p>}
      {question.options.map((option, slot) => {
        const isOn = selected.includes(option.id);
        const marked = markChoice(reveal, isOn, question.correctIds.includes(option.id));
        return (
          <button
            key={`${question.id}-${option.id}`}
            type="button"
            aria-pressed={isOn}
            disabled={disabled}
            onClick={() => toggle(option.id)}
            className={choiceClass(isOn, marked)}
          >
            <span className="option-letter" aria-hidden>
              {"ABCD"[slot] ?? "✓"}
            </span>
            <OptionContent
              label={option.label}
              visual={option.visual}
              layout={option.layout}
            />
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
  );
}
