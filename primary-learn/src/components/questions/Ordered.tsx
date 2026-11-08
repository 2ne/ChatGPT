import { Moon, Sun, Sunrise, Sunset } from "lucide-react";
import { clockLabel } from "../../lib/clock";
import { describeMoney } from "../../lib/money";
import { useLayoutEffect, useRef, useState, type KeyboardEvent, type PointerEvent } from "react";
import { copy } from "../../data/copy";
import type { DayPart, OrderedQuestion } from "../../types/activity";
import { pinOrderedAnchor } from "../../lib/answers";
import { OptionContent } from "./ObjectGroup";
import { choiceClass, type Reveal } from "./choice";

const dayPartIcons = {
  morning: Sunrise,
  afternoon: Sun,
  evening: Sunset,
  night: Moon,
} satisfies Record<DayPart, typeof Sun>;

type OrderedProps = {
  question: OrderedQuestion;
  answer: unknown;
  disabled?: boolean;
  reveal: Reveal;
  onChange: (value: unknown) => void;
};

type DragState = {
  id: string;
  pointerId: number;
};

export function Ordered({ question, answer, disabled, reveal, onChange }: OrderedProps) {
  const raw = Array.isArray(answer) ? (answer as string[]) : question.items.map((item) => item.id);
  const order = pinOrderedAnchor(question, raw);
  const anchorId = question.anchorId;
  const itemFor = (id: string) => question.items.find((item) => item.id === id);
  const listRef = useRef<HTMLOListElement>(null);
  const dragRef = useRef<DragState | null>(null);
  const [draggingId, setDraggingId] = useState<string | null>(null);
  const locked = Boolean(disabled || reveal != null);

  useLayoutEffect(() => {
    if (!anchorId) return;
    const current = Array.isArray(answer) ? (answer as string[]) : question.items.map((item) => item.id);
    const pinned = pinOrderedAnchor(question, current);
    if (pinned.length !== current.length || pinned.some((id, index) => id !== current[index])) {
      onChange(pinned);
    }
  }, [anchorId, answer, onChange, question]);

  function move(from: number, to: number) {
    if (from === to || to < 0 || to >= order.length) return;
    if (anchorId) {
      if (order[from] === anchorId) return;
      if (to === 0) return;
    }
    const next = [...order];
    const [item] = next.splice(from, 1);
    if (item == null) return;
    next.splice(to, 0, item);
    onChange(pinOrderedAnchor(question, next));
  }

  function indexAtY(clientY: number): number {
    const root = listRef.current;
    if (!root) return anchorId ? 1 : 0;
    const tiles = Array.from(root.querySelectorAll<HTMLElement>("[data-ordered-id]"));
    const floor = anchorId ? 1 : 0;
    for (let index = floor; index < tiles.length; index += 1) {
      const tile = tiles[index];
      if (!tile) continue;
      const rect = tile.getBoundingClientRect();
      if (clientY < rect.top + rect.height / 2) return Math.max(floor, index);
    }
    return Math.max(floor, tiles.length - 1);
  }

  function onPointerDown(event: PointerEvent<HTMLButtonElement>, id: string) {
    if (locked || event.button !== 0 || id === anchorId) return;
    event.preventDefault();
    dragRef.current = { id, pointerId: event.pointerId };
    setDraggingId(id);
    event.currentTarget.setPointerCapture(event.pointerId);
  }

  function onPointerMove(event: PointerEvent<HTMLButtonElement>) {
    const drag = dragRef.current;
    if (!drag || drag.pointerId !== event.pointerId) return;
    const currentIndex = order.indexOf(drag.id);
    if (currentIndex < 0) return;
    const over = indexAtY(event.clientY);
    if (over === currentIndex) return;
    move(currentIndex, over);
  }

  function endDrag(event: PointerEvent<HTMLButtonElement>) {
    const drag = dragRef.current;
    if (!drag || drag.pointerId !== event.pointerId) return;
    dragRef.current = null;
    setDraggingId(null);
    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId);
    }
  }

  function onKeyDown(event: KeyboardEvent<HTMLButtonElement>, index: number) {
    if (locked || order[index] === anchorId) return;
    if (event.key === "ArrowUp" || event.key === "ArrowLeft") {
      event.preventDefault();
      move(index, index - 1);
      return;
    }
    if (event.key === "ArrowDown" || event.key === "ArrowRight") {
      event.preventDefault();
      move(index, index + 1);
    }
  }

  return (
    <ol ref={listRef} className="ordered-list" aria-label={question.prompt}>
      {order.map((id, index) => {
        const item = itemFor(id);
        const label = item?.label ?? (item?.clock ? clockLabel(item.clock) : item?.money ? describeMoney(item.money) : id);
        const DayIcon = item?.dayPart ? dayPartIcons[item.dayPart] : undefined;
        const inPlace = reveal != null && question.correctOrder[index] === id;
        const marked = reveal == null ? null : inPlace ? "correct" : "wrong";
        const dragging = draggingId === id;
        const anchored = Boolean(anchorId && id === anchorId);
        const holdClass = [
          choiceClass(dragging, marked),
          "ordered-tile",
          item?.label && !Number.isFinite(Number(item.label)) ? "has-text" : "",
          dragging ? "is-dragging" : "",
          anchored ? "is-anchor" : "",
        ]
          .filter(Boolean)
          .join(" ");
        const body = (
          <>
            {anchored ? null : (
              <span className="ordered-grip" aria-hidden>
                <span />
                <span />
                <span />
                <span />
                <span />
                <span />
              </span>
            )}
            {DayIcon ? (
              <span className="option-content ordered-day-part">
                <DayIcon size={24} aria-hidden="true" />
                {label}
              </span>
            ) : (
              <OptionContent label={item?.label} visual={item?.visual} tenFrame={item?.tenFrame} baseTen={item?.baseTen} dice={item?.dice} groups={item?.groups} array={item?.array} clock={item?.clock} money={item?.money} />
            )}
          </>
        );
        return (
          <li key={`${question.id}-${id}`} data-ordered-id={id}>
            <div className={holdClass}>
              {anchored ? (
                <div className="ordered-drag is-anchor" aria-label={copy.staysFirst(label)}>
                  {body}
                </div>
              ) : (
                <button
                  type="button"
                  disabled={locked}
                  aria-label={copy.dragNumber(label)}
                  aria-grabbed={dragging}
                  className="ordered-drag"
                  onPointerDown={(event) => onPointerDown(event, id)}
                  onPointerMove={onPointerMove}
                  onPointerUp={endDrag}
                  onPointerCancel={endDrag}
                  onKeyDown={(event) => onKeyDown(event, index)}
                >
                  {body}
                </button>
              )}
              <span className="step-pair">
                <button
                  type="button"
                  disabled={locked || anchored || index === 0 || (Boolean(anchorId) && index === 1)}
                  aria-label={copy.moveUp(label)}
                  onClick={() => move(index, index - 1)}
                  className="btn btn-secondary step-btn"
                >
                  ↑
                </button>
                <button
                  type="button"
                  disabled={locked || anchored || index === order.length - 1}
                  aria-label={copy.moveDown(label)}
                  onClick={() => move(index, index + 1)}
                  className="btn btn-secondary step-btn"
                >
                  ↓
                </button>
              </span>
            </div>
          </li>
        );
      })}
    </ol>
  );
}
