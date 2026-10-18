import type { MouseEvent, PointerEvent } from "react";
import { copy } from "../../data/copy";
import {
  partWholeAnswer,
  partWholeChoices,
} from "../../lib/partWhole";
import type { PartWholeMissing, PartWholeQuestion } from "../../types/activity";
import type { Reveal } from "./choice";

type PartWholeProps = {
  question: PartWholeQuestion;
  answer: unknown;
  disabled?: boolean;
  reveal: Reveal;
  onChange: (value: unknown) => void;
};

function activate(
  handler: () => void,
  event: PointerEvent<HTMLButtonElement> | MouseEvent<HTMLButtonElement>,
) {
  if (event.type === "pointerdown" && "button" in event && event.button !== 0) return;
  if (event.type === "pointerdown") event.preventDefault();
  handler();
}

function Circle({
  slot,
  value,
  missing,
  reveal,
  picked,
  label,
}: {
  slot: PartWholeMissing;
  value: number | null;
  missing: PartWholeMissing;
  reveal: Reveal;
  picked: boolean;
  label: string;
}) {
  const isGap = slot === missing;
  const size = slot === "whole" ? "is-whole-slot" : "is-part-slot";
  let tone = slot === "whole" ? "is-whole" : "is-part";
  if (isGap) {
    if (reveal === "correct") tone = "is-correct";
    else if (reveal === "incorrect") tone = "is-revealed";
    else if (picked) tone = "is-picked";
    else tone = "is-gap";
  }
  return (
    <span className={`part-whole-circle ${size} ${tone}`} aria-label={label}>
      {value == null ? "?" : value}
    </span>
  );
}

export function PartWhole({ question, answer, disabled, reveal, onChange }: PartWholeProps) {
  const selected = typeof answer === "number" ? answer : null;
  const missing = question.missing;
  const correct = partWholeAnswer(question);
  const choices = partWholeChoices(question);
  const gapValue =
    reveal === "incorrect" ? correct : selected;
  const wholeValue = missing === "whole" ? gapValue : question.whole;
  const leftValue = missing === "left" ? gapValue : question.parts[0];
  const rightValue = missing === "right" ? gapValue : question.parts[1];

  return (
    <div className="part-whole">
      <div className="part-whole-tree">
        <Circle
          slot="whole"
          value={wholeValue}
          missing={missing}
          reveal={reveal}
          picked={selected != null}
          label={
            missing === "whole"
              ? selected == null
                ? copy.missingNumber
                : `${copy.wholeNumber} ${wholeValue}`
              : `${copy.wholeNumber} ${question.whole}`
          }
        />
        <svg className="part-whole-lines" viewBox="0 0 240 48" aria-hidden>
          <line x1="120" y1="2" x2="52" y2="46" />
          <line x1="120" y1="2" x2="188" y2="46" />
        </svg>
        <div className="part-whole-row">
          <Circle
            slot="left"
            value={leftValue}
            missing={missing}
            reveal={reveal}
            picked={selected != null}
            label={
              missing === "left"
                ? selected == null
                  ? copy.missingNumber
                  : `${copy.knownPart} ${leftValue}`
                : `${copy.knownPart} ${question.parts[0]}`
            }
          />
          <Circle
            slot="right"
            value={rightValue}
            missing={missing}
            reveal={reveal}
            picked={selected != null}
            label={
              missing === "right"
                ? selected == null
                  ? copy.missingNumber
                  : `${copy.knownPart} ${rightValue}`
                : `${copy.knownPart} ${question.parts[1]}`
            }
          />
        </div>
      </div>

      <div role="radiogroup" aria-label={copy.pickOne} className="part-whole-pad">
        {choices.map((value) => {
          const isOn = selected === value;
          return (
            <button
              key={`${question.id}-${value}`}
              type="button"
              role="radio"
              aria-checked={isOn}
              disabled={disabled}
              className={`part-whole-choice${isOn ? " is-selected" : ""}`}
              onPointerDown={(event) => activate(() => onChange(value), event)}
              onClick={(event) => {
                if (event.detail === 0) activate(() => onChange(value), event);
              }}
            >
              {value}
            </button>
          );
        })}
      </div>
    </div>
  );
}
