import { useRef } from "react";
import type { MultipleChoiceQuestion, MultiSelectQuestion } from "../../types/activity";
import { copy } from "../../data/copy";
import { ShapePicture } from "./ShapePicture";
import { choiceClass, markChoice, type Reveal } from "./choice";

export function ShapeChoices({ question, answer, disabled, reveal, onChange }: {
  question: MultipleChoiceQuestion | MultiSelectQuestion;
  answer: unknown; disabled?: boolean; reveal: Reveal; onChange: (value: unknown) => void;
}) {
  const multi = question.kind === "multi-select";
  const selected = useRef<string[]>([]);
  selected.current = multi && Array.isArray(answer) ? answer as string[] : [];
  const pictures = question.options.every((option) => Boolean(option.shape));
  return (
    <div className="option-stack">
      {question.shape ? <div className="shape-stem"><ShapePicture shape={question.shape} interactive /></div> : null}
      <div className={pictures ? "shape-choice-grid" : "option-stack"} role={multi ? "group" : "radiogroup"} aria-label={multi ? question.prompt : copy.pickOne}>
        {question.options.map((option, slot) => {
          const isOn = multi ? selected.current.includes(option.id) : answer === option.id;
          const correct = question.kind === "multi-select" ? question.correctIds.includes(option.id) : question.correctId === option.id;
          const marked = markChoice(reveal, isOn, correct);
          return (
            <button
              key={option.id} type="button" disabled={disabled}
              role={multi ? undefined : "radio"}
              aria-checked={multi ? undefined : isOn}
              aria-pressed={multi ? isOn : undefined}
              className={choiceClass(isOn, marked, pictures ? ["shape-choice"] : [])}
              onClick={() => {
                if (!multi) { onChange(option.id); return; }
                const next = selected.current.includes(option.id) ? selected.current.filter((id) => id !== option.id) : [...selected.current, option.id];
                selected.current = next;
                onChange(next);
              }}
            >
              <span className="option-letter" aria-hidden>{"ABCD"[slot]}</span>
              {option.shape ? <ShapePicture shape={option.shape} compact /> : null}
              {option.label ? <span>{option.label}</span> : null}
              {marked ? <span className={marked === "correct" ? "option-check" : "option-cross"} aria-hidden>{marked === "correct" ? "✓" : "✕"}</span> : null}
            </button>
          );
        })}
      </div>
    </div>
  );
}
