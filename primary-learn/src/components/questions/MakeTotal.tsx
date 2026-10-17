import type { MouseEvent, PointerEvent } from "react";
import { copy } from "../../data/copy";
import { OBJECT_GLYPH, OBJECT_WORDS } from "../../data/objects";
import {
  makeTotalEmptyCount,
  makeTotalGap,
  makeTotalItem,
  makeTotalKnownCount,
  makeTotalMissing,
  makeTotalOp,
  makeTotalOther,
  makeTotalOtherItem,
  makeTotalPart,
  optionNumber,
} from "../../lib/makeTotal";
import { speakCount } from "../../lib/speech";
import type { MakeTotalQuestion, ObjectItem } from "../../types/activity";
import { choiceClass, markChoice, type Reveal } from "./choice";

type MakeTotalProps = {
  question: MakeTotalQuestion;
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

function SumBox({
  value,
  tone,
  label,
}: {
  value: number | null;
  tone: "part" | "gap" | "whole";
  label: string;
}) {
  return (
    <span className={`make-total-box is-${tone}`} aria-label={label}>
      {value == null ? "?" : value}
    </span>
  );
}

function Slot({
  item,
  filled,
  tappable = false,
  disabled,
  index,
  onToggle,
}: {
  item: ObjectItem;
  filled: boolean;
  tappable?: boolean;
  disabled?: boolean;
  index: number;
  onToggle?: () => void;
}) {
  const words = OBJECT_WORDS[item];
  const glyph = OBJECT_GLYPH[item];
  if (!tappable || !onToggle) {
    return (
      <span className={`make-total-slot${filled ? " is-filled" : " is-empty"}`} aria-hidden>
        {filled ? <span className="object-glyph">{glyph}</span> : null}
      </span>
    );
  }
  return (
    <button
      type="button"
      className={`make-total-slot is-tap${filled ? " is-filled" : " is-empty"}`}
      disabled={disabled}
      aria-label={
        filled
          ? `${words.singular} ${index + 1}. Tap to take it out.`
          : `Empty space ${index + 1}. Tap to add a ${words.singular}.`
      }
      onPointerDown={(event) => activate(onToggle, event)}
      onClick={(event) => {
        if (event.detail === 0) activate(onToggle, event);
      }}
    >
      {filled ? <span className="object-glyph is-drop">{glyph}</span> : null}
    </button>
  );
}

export function MakeTotal({ question, answer, disabled, reveal, onChange }: MakeTotalProps) {
  const part = makeTotalPart(question);
  const other = makeTotalOther(question);
  const gap = makeTotalGap(question);
  const op = makeTotalOp(question);
  const missing = makeTotalMissing(question);
  const selected = typeof answer === "number" ? answer : null;
  const item = makeTotalItem(question);
  const otherItem = makeTotalOtherItem(question);
  const showSlots = question.mode !== "sum-only";
  const canFill = question.mode === "fill-slots" && !disabled;
  const subtract = op === "subtract";
  const sign = subtract ? "−" : "+";
  const signWord = subtract ? "take away" : "plus";

  const leftValue = gap === "left" ? selected : part;
  const rightValue = gap === "right" ? selected : gap === "total" ? other : part;
  const resultValue = gap === "total" ? selected : question.total;

  const filledMissing =
    question.mode === "fill-slots"
      ? (selected ?? 0)
      : question.mode === "pick" && selected != null
        ? Math.max(0, Math.min(selected, makeTotalEmptyCount(question)))
        : 0;

  function setFilled(next: number) {
    const max = subtract ? question.total : makeTotalEmptyCount(question);
    const clamped = Math.max(0, Math.min(max, next));
    if (subtract && gap === "total") {
      onChange(question.total - clamped);
      if (clamped > 0) speakCount(question.total - clamped);
      return;
    }
    onChange(clamped);
    if (clamped > 0) speakCount(clamped);
  }

  function toggleEmpty(index: number) {
    if (!canFill) return;
    if (subtract) {
      const remaining = question.total - (selected ?? 0);
      if (index < remaining) setFilled((selected ?? 0) + 1);
      else setFilled((selected ?? 0) - 1);
      return;
    }
    if (index < filledMissing) setFilled(filledMissing - 1);
    else setFilled(filledMissing + 1);
  }

  const showButtons = question.mode !== "fill-slots" && question.options;

  return (
    <div className="make-total">
      {showSlots ? (
        <div
          className="make-total-slots"
          role="group"
          aria-label={
            gap === "total"
              ? `${part} ${OBJECT_WORDS[item].plural} and ${other} ${OBJECT_WORDS[otherItem].plural}`
              : `${question.total} ${OBJECT_WORDS[item].plural}`
          }
        >
          {gap === "total" ? (
            <>
              <span className="make-total-part" aria-hidden>
                {Array.from({ length: part }, (_, index) => (
                  <Slot key={`a-${index}`} item={item} filled index={index} />
                ))}
              </span>
              <span className="make-total-part" aria-hidden>
                {Array.from({ length: other }, (_, index) => (
                  <Slot key={`b-${index}`} item={otherItem} filled index={index} />
                ))}
              </span>
            </>
          ) : subtract ? (
            Array.from({ length: question.total }, (_, index) => {
              const remaining = question.total - (selected ?? 0);
              return (
                <Slot
                  key={index}
                  item={item}
                  filled={index < remaining}
                  tappable={canFill}
                  disabled={disabled}
                  index={index}
                  onToggle={() => toggleEmpty(index)}
                />
              );
            })
          ) : (
            <>
              {Array.from({ length: makeTotalKnownCount(question) }, (_, index) => (
                <Slot key={`k-${index}`} item={item} filled index={index} />
              ))}
              {Array.from({ length: makeTotalEmptyCount(question) }, (_, index) => (
                <Slot
                  key={`e-${index}`}
                  item={item}
                  filled={index < filledMissing}
                  tappable={canFill}
                  disabled={disabled}
                  index={makeTotalKnownCount(question) + index}
                  onToggle={() => toggleEmpty(index)}
                />
              ))}
            </>
          )}
        </div>
      ) : null}

      {canFill ? (
        <p className="t-meta make-total-coach">
          {subtract ? copy.tapToTakeAway : copy.tapASpace}
        </p>
      ) : null}

      <div
        className={`make-total-sum${reveal === "correct" ? " is-correct" : ""}${
          reveal === "incorrect" ? " is-wrong" : ""
        }`}
        aria-label={`${leftValue ?? "what"} ${signWord} ${rightValue ?? "what"} equals ${resultValue ?? "what"}`}
      >
        <SumBox
          value={leftValue}
          tone={gap === "left" ? "gap" : "part"}
          label={gap === "left" ? copy.missingNumber : copy.knownPart}
        />
        <span className="make-total-sign" aria-hidden>
          {sign}
        </span>
        <SumBox
          value={rightValue}
          tone={gap === "right" ? "gap" : "part"}
          label={gap === "right" ? copy.missingNumber : copy.knownPart}
        />
        <span className="make-total-sign" aria-hidden>
          =
        </span>
        <SumBox
          value={resultValue}
          tone={gap === "total" ? "gap" : "whole"}
          label={gap === "total" ? copy.missingNumber : copy.wholeNumber}
        />
      </div>

      {showButtons ? (
        <div role="radiogroup" aria-label={copy.pickOne} className="option-stack">
          {question.options!.map((option, slot) => {
            const value = optionNumber(option.label);
            const isOn = value != null && selected === value;
            const marked = markChoice(reveal, isOn, value === missing);
            return (
              <button
                key={option.id}
                type="button"
                role="radio"
                aria-checked={isOn}
                disabled={disabled}
                onClick={() => {
                  if (value != null) onChange(value);
                }}
                className={choiceClass(isOn, marked)}
              >
                <span className="option-letter" aria-hidden>
                  {"ABCD"[slot] ?? "•"}
                </span>
                <span>{option.label}</span>
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
      ) : null}

      {canFill && selected != null && selected > 0 ? (
        <button type="button" className="btn-text" onClick={() => onChange(null)}>
          {copy.startSlotsAgain}
        </button>
      ) : null}
    </div>
  );
}
