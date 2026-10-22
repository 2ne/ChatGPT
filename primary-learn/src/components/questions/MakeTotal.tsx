import type { MouseEvent, PointerEvent } from "react";
import { copy } from "../../data/copy";
import { OBJECT_GLYPH, OBJECT_WORDS } from "../../data/objects";
import {
  makeTotalGap,
  makeTotalItem,
  makeTotalKnownCount,
  makeTotalMissing,
  makeTotalOp,
  makeTotalOther,
  makeTotalPart,
  makeTotalSlotBank,
  optionNumber,
} from "../../lib/makeTotal";
import type { MakeTotalQuestion, ObjectItem } from "../../types/activity";
import { choiceClass, markChoice, type Reveal } from "./choice";
import { OptionContent } from "./ObjectGroup";

type MakeTotalProps = {
  question: MakeTotalQuestion;
  answer: unknown;
  disabled?: boolean;
  reveal: Reveal;
  onChange: (value: unknown) => void;
};

type SlotKind = "known" | "added" | "add" | "empty";

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
  kind,
  tappable = false,
  disabled,
  index,
  onToggle,
}: {
  item: ObjectItem;
  kind: SlotKind;
  tappable?: boolean;
  disabled?: boolean;
  index: number;
  onToggle?: () => void;
}) {
  const words = OBJECT_WORDS[item];
  const glyph = OBJECT_GLYPH[item];
  const filled = kind === "known" || kind === "added";
  const className = [
    "make-total-slot",
    kind === "known" ? "is-filled" : "",
    kind === "added" ? "is-added" : "",
    kind === "add" ? "is-add" : "",
    kind === "empty" ? "is-empty" : "",
    tappable ? "is-tap" : "",
  ]
    .filter(Boolean)
    .join(" ");

  const inner =
    filled ? (
      <span className="object-glyph is-drop">{glyph}</span>
    ) : kind === "add" ? (
      <>
        <span className="make-total-add-icon" aria-hidden>
          +
        </span>
        <span className="make-total-add-label">{copy.addSlot}</span>
      </>
    ) : null;

  if (!tappable || !onToggle) {
    return (
      <span className={className} aria-hidden>
        {inner}
      </span>
    );
  }

  return (
    <button
      type="button"
      className={className}
      disabled={disabled}
      aria-label={
        kind === "added"
          ? `${words.singular} ${index + 1}. Tap to take it out.`
          : kind === "add"
            ? copy.addSlot
            : `Make ${index + 1}`
      }
      onPointerDown={(event) => activate(onToggle, event)}
      onClick={(event) => {
        if (event.detail === 0) activate(onToggle, event);
      }}
    >
      {inner}
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
  const fillMode = question.mode === "fill-slots";
  const canFill = fillMode && !disabled;
  const subtract = op === "subtract";
  const sign = subtract ? "−" : "+";
  const signWord = subtract ? "take away" : "plus";
  const known = makeTotalKnownCount(question);
  const bank = makeTotalSlotBank(question);

  const leftValue = gap === "left" ? selected : part;
  const rightValue = gap === "right" ? selected : gap === "total" ? other : part;
  const resultValue = gap === "total" ? selected : question.total;

  const filledMissing = selected ?? 0;

  function setFilled(next: number) {
    const max = subtract ? question.total : bank;
    const clamped = Math.max(0, Math.min(max, next));
    if (subtract && gap === "total") {
      onChange(question.total - clamped);
      return;
    }
    onChange(clamped);
  }

  function toggleSubtractSlot(index: number) {
    if (!canFill) return;
    const remaining = question.total - (selected ?? 0);
    // Tap a kept tile to take away through that place. Tap a removed tile to put keepers back.
    if (index < remaining) setFilled(question.total - index);
    else setFilled(question.total - (index + 1));
  }

  const showButtons = question.mode !== "fill-slots" && question.options;
  const itemWords = OBJECT_WORDS[item];
  const canAddMore = filledMissing < bank;

  return (
    <div className="make-total">
      {fillMode && !subtract ? (
        <div className="make-total-fill">
          <p className="make-total-group-label">{copy.startingGroup}</p>
          <div
            className="make-total-known-row"
            aria-label={`${known} ${known === 1 ? itemWords.singular : itemWords.plural}`}
          >
            <span className="make-total-known" aria-hidden>
              {Array.from({ length: known }, (_, index) => (
                <Slot key={`k-${index}`} item={item} kind="known" index={index} />
              ))}
            </span>
          </div>
          <span className="make-total-join" aria-hidden>+</span>
          <p className="make-total-group-label">{copy.addedGroup}</p>
          <div className="make-total-workspace">
          <div
            className="make-total-add-row"
            style={{ minHeight: `calc(${Math.ceil(bank / 5)} * var(--make-total-tile) + ${Math.max(0, Math.ceil(bank / 5) - 1) * 8}px)` }}
            role="group"
            aria-label={`Add ${itemWords.plural}`}
          >
            {Array.from({ length: filledMissing }, (_, index) => (
              <Slot
                key={`a-${index}`}
                item={item}
                kind="added"
                tappable={canFill}
                disabled={disabled}
                index={index}
                onToggle={() => setFilled(index)}
              />
            ))}
          </div>
              <Slot
                key="add"
                item={item}
                kind="add"
                tappable={canFill && canAddMore}
                disabled={disabled || !canAddMore}
                index={filledMissing}
                onToggle={() => setFilled(filledMissing + 1)}
              />
          </div>
        </div>
      ) : null}

      {fillMode && subtract ? (
        <div
          className="make-total-slots"
          role="group"
          aria-label={`${question.total} ${itemWords.plural}`}
        >
          {Array.from({ length: question.total }, (_, index) => {
            const remaining = question.total - (selected ?? 0);
            return (
              <Slot
                key={index}
                item={item}
                kind={index < remaining ? "known" : "empty"}
                tappable={canFill}
                disabled={disabled}
                index={index}
                onToggle={() => toggleSubtractSlot(index)}
              />
            );
          })}
        </div>
      ) : null}

      {question.mode !== "fill-slots" ? (
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
      ) : null}

      {showButtons ? (
        <div role="radiogroup" aria-label={copy.pickOne} className="option-stack">
          {question.options!.map((option, slot) => {
            const value = optionNumber(option.label);
            const isOn = value != null && selected === value;
            const marked = markChoice(reveal, isOn, value === missing);
            return (
              <button
                key={`${question.id}-${option.id}`}
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
      ) : null}

      {fillMode ? (
        <button
          type="button"
          className="btn-text make-total-reset"
          disabled={!canFill || selected == null || selected <= 0}
          onClick={(event) => {
            onChange(null);
            event.currentTarget.blur();
          }}
        >
          {copy.startSlotsAgain}
        </button>
      ) : null}
    </div>
  );
}
