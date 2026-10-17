import type { MouseEvent, PointerEvent } from "react";
import { copy } from "../../data/copy";
import {
  emptyPickPairAnswer,
  isPickPairAnswer,
  pickPairRequireAll,
  pickPairShowDots,
  pickPairTiles,
  requiredTilePairs,
  togglePickPairTile,
  type PickPairAnswer,
} from "../../lib/pickPair";
import type { PickPairQuestion } from "../../types/activity";
import type { Reveal } from "./choice";

type PickPairProps = {
  question: PickPairQuestion;
  answer: unknown;
  disabled?: boolean;
  reveal: Reveal;
  onChange: (value: unknown) => void;
};

const DICE_SLOTS: Record<number, number[]> = {
  1: [4],
  2: [0, 8],
  3: [0, 4, 8],
  4: [0, 2, 6, 8],
  5: [0, 2, 4, 6, 8],
  6: [0, 2, 3, 5, 6, 8],
};

function activate(
  handler: () => void,
  event: PointerEvent<HTMLButtonElement> | MouseEvent<HTMLButtonElement>,
) {
  if (event.type === "pointerdown" && "button" in event && event.button !== 0) return;
  if (event.type === "pointerdown") event.preventDefault();
  handler();
}

function QuantityDots({ count, selected }: { count: number; selected: boolean }) {
  if (count <= 0) return null;
  const slots = DICE_SLOTS[count];
  if (slots) {
    return (
      <span className={`pick-pair-dots is-dice${selected ? " is-on" : ""}`} aria-hidden>
        {Array.from({ length: 9 }, (_, cell) => (
          <span key={cell} className={slots.includes(cell) ? "is-dot" : undefined} />
        ))}
      </span>
    );
  }
  return (
    <span className={`pick-pair-dots is-many${selected ? " is-on" : ""}`} aria-hidden>
      {Array.from({ length: count }, (_, index) => (
        <span key={index} className="is-dot" />
      ))}
    </span>
  );
}

function SumBox({ value, tone }: { value: number | null; tone: "part" | "gap" | "whole" }) {
  return (
    <span className={`make-total-box is-${tone}`}>
      {value == null ? "?" : value}
    </span>
  );
}

export function PickPair({ question, answer, disabled, reveal, onChange }: PickPairProps) {
  const tiles = pickPairTiles(question);
  const state: PickPairAnswer = isPickPairAnswer(answer) ? answer : emptyPickPairAnswer();
  const requireAll = pickPairRequireAll(question);
  const showDots = pickPairShowDots(question);
  const need = requiredTilePairs(tiles, question.total).length;
  const foundIds = new Set(state.found.flat());

  const first = tiles.find((tile) => tile.id === state.picked[0])?.value ?? null;
  const second = tiles.find((tile) => tile.id === state.picked[1])?.value ?? null;
  const lastFound = state.found[state.found.length - 1];
  const lastLeft = lastFound
    ? (tiles.find((tile) => tile.id === lastFound[0])?.value ?? null)
    : null;
  const lastRight = lastFound
    ? (tiles.find((tile) => tile.id === lastFound[1])?.value ?? null)
    : null;
  const showLast = state.picked.length === 0 && lastFound != null;
  const displayFirst = first ?? (showLast ? lastLeft : null);
  const displaySecond = second ?? (showLast ? lastRight : null);

  function toggle(id: string) {
    if (disabled) return;
    onChange(togglePickPairTile(question, state, id));
  }

  return (
    <div className="pick-pair">
      <div className="pick-pair-grid" role="group" aria-label={copy.pickTwo}>
        {tiles.map((tile, index) => {
          const picked = state.picked.includes(tile.id);
          const found = foundIds.has(tile.id);
          const selected = picked || found;
          const marked =
            reveal === "correct" && selected
              ? "is-correct"
              : reveal === "incorrect" && picked
                ? "is-wrong"
                : "";
          return (
            <button
              key={tile.id}
              type="button"
              className={`pick-pair-tile${selected ? " is-on" : ""}${found ? " is-found" : ""}${
                marked ? ` ${marked}` : ""
              }`}
              disabled={disabled || found}
              aria-pressed={selected}
              aria-label={`${tile.value}${showDots ? `, ${tile.value} dots` : ""}`}
              onPointerDown={(event) => activate(() => toggle(tile.id), event)}
              onClick={(event) => {
                if (event.detail === 0) activate(() => toggle(tile.id), event);
              }}
            >
              <span className="pick-pair-num">{tile.value}</span>
              {showDots ? <QuantityDots count={tile.value} selected={selected} /> : null}
              <span className="visually-hidden">{index + 1}</span>
            </button>
          );
        })}
      </div>

      {requireAll && state.found.length > 0 && state.found.length < need ? (
        <p className="t-meta pick-pair-coach">{copy.findAnotherPair}</p>
      ) : null}

      <div
        className={`make-total-sum pick-pair-sum${reveal === "correct" ? " is-correct" : ""}${
          reveal === "incorrect" ? " is-wrong" : ""
        }`}
        aria-label={`${displayFirst ?? "what"} plus ${displaySecond ?? "what"} equals ${question.total}`}
      >
        <SumBox value={displayFirst} tone={displayFirst == null ? "gap" : "part"} />
        <span className="make-total-sign" aria-hidden>
          +
        </span>
        <SumBox value={displaySecond} tone={displaySecond == null ? "gap" : "part"} />
        <span className="make-total-sign" aria-hidden>
          =
        </span>
        <SumBox value={question.total} tone="whole" />
      </div>
    </div>
  );
}
