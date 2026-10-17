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

function QuantityDots({ count }: { count: number }) {
  if (count <= 0) return null;
  const slots = DICE_SLOTS[count];
  if (slots) {
    return (
      <span className="pick-pair-dots is-dice" aria-hidden>
        {Array.from({ length: 9 }, (_, cell) => (
          <span key={cell} className={slots.includes(cell) ? "is-dot" : undefined} />
        ))}
      </span>
    );
  }
  return (
    <span className="pick-pair-dots is-many" aria-hidden>
      {Array.from({ length: count }, (_, index) => (
        <span key={index} className="is-dot" />
      ))}
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
              className={`pick-pair-tile${selected ? " is-selected" : ""}${found ? " is-found" : ""}${
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
              {showDots ? <QuantityDots count={tile.value} /> : null}
              <span className="visually-hidden">{index + 1}</span>
            </button>
          );
        })}
      </div>

      {requireAll && state.found.length > 0 && state.found.length < need ? (
        <p className="t-meta pick-pair-coach">{copy.findAnotherPair}</p>
      ) : null}
    </div>
  );
}
