import type { MouseEvent, PointerEvent } from "react";
import { copy } from "../../data/copy";
import {
  PART_WHOLE_LAYOUT,
  partWholeAnswer,
  partWholeChoices,
  partWholeTreeMetrics,
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

function dotRows(count: number): number[][] {
  if (count <= 0) return [];
  if (count <= 3) return [Array.from({ length: count }, (_, index) => index)];
  if (count === 4) return [[0, 1], [2, 3]];
  if (count === 5) return [[0, 1, 2], [3, 4]];
  const top = Math.ceil(count / 2);
  return [
    Array.from({ length: top }, (_, index) => index),
    Array.from({ length: count - top }, (_, index) => index + top),
  ];
}

function DotCount({ count }: { count: number }) {
  const rows = dotRows(count);
  if (rows.length === 0) return null;
  return (
    <span className="part-whole-dots" aria-hidden>
      {rows.map((row) => (
        <span key={row[0]} className="part-whole-dots-row">
          {row.map((id) => (
            <span key={id} className="part-whole-dot" />
          ))}
        </span>
      ))}
    </span>
  );
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
  const showDots =
    value != null && value > 0 && (!isGap || reveal === "correct");
  return (
    <span className={`part-whole-circle ${size} ${tone}`} aria-label={label}>
      <span className="part-whole-num">{value == null ? "?" : value}</span>
      {showDots ? <DotCount count={value} /> : null}
    </span>
  );
}

export function PartWhole({ question, answer, disabled, reveal, onChange }: PartWholeProps) {
  const selected = typeof answer === "number" ? answer : null;
  const missing = question.missing;
  const correct = partWholeAnswer(question);
  const choices = partWholeChoices(question);
  const gapValue = reveal === "incorrect" ? correct : selected;
  const wholeValue = missing === "whole" ? gapValue : question.whole;
  const leftValue = missing === "left" ? gapValue : question.parts[0];
  const rightValue = missing === "right" ? gapValue : question.parts[1];
  const tree = partWholeTreeMetrics();
  const layout = PART_WHOLE_LAYOUT;

  return (
    <div className="part-whole">
      <div
        className="part-whole-tree"
        style={{ width: tree.width, height: tree.height }}
      >
        <svg
          className="part-whole-lines"
          viewBox={`0 0 ${tree.width} ${tree.height}`}
          preserveAspectRatio="xMidYMid meet"
          aria-hidden
        >
          <line
            x1={tree.wholeCx}
            y1={tree.wholeBottom}
            x2={tree.leftCx}
            y2={tree.partTop}
            strokeWidth={tree.stroke}
            strokeLinecap="round"
          />
          <line
            x1={tree.wholeCx}
            y1={tree.wholeBottom}
            x2={tree.rightCx}
            y2={tree.partTop}
            strokeWidth={tree.stroke}
            strokeLinecap="round"
          />
        </svg>
        <div
          className="part-whole-whole"
          style={{ width: layout.whole, height: layout.whole }}
        >
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
        </div>
        <div className="part-whole-row" style={{ gap: layout.gap }}>
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
