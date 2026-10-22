import { useRef, useState, type KeyboardEvent, type PointerEvent } from "react";
import { copy } from "../../data/copy";
import type { OrderedQuestion } from "../../types/activity";
import { OptionContent } from "./ObjectGroup";
import { choiceClass, type Reveal } from "./choice";

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
  const order = Array.isArray(answer) ? (answer as string[]) : question.items.map((item) => item.id);
  const itemFor = (id: string) => question.items.find((item) => item.id === id);
  const listRef = useRef<HTMLOListElement>(null);
  const dragRef = useRef<DragState | null>(null);
  const [draggingId, setDraggingId] = useState<string | null>(null);
  const locked = Boolean(disabled || reveal != null);

  function move(from: number, to: number) {
    if (from === to || to < 0 || to >= order.length) return;
    const next = [...order];
    const [item] = next.splice(from, 1);
    if (item == null) return;
    next.splice(to, 0, item);
    onChange(next);
  }

  function indexAtY(clientY: number): number {
    const root = listRef.current;
    if (!root) return 0;
    const tiles = Array.from(root.querySelectorAll<HTMLElement>("[data-ordered-id]"));
    for (let index = 0; index < tiles.length; index += 1) {
      const tile = tiles[index];
      if (!tile) continue;
      const rect = tile.getBoundingClientRect();
      if (clientY < rect.top + rect.height / 2) return index;
    }
    return Math.max(0, tiles.length - 1);
  }

  function onPointerDown(event: PointerEvent<HTMLButtonElement>, id: string) {
    if (locked || event.button !== 0) return;
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
    if (locked) return;
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
        const label = item?.label ?? id;
        const inPlace = reveal != null && question.correctOrder[index] === id;
        const marked = reveal == null ? null : inPlace ? "correct" : "wrong";
        const dragging = draggingId === id;
        return (
          <li key={`${question.id}-${id}`}>
            <button
              type="button"
              data-ordered-id={id}
              disabled={locked}
              aria-label={copy.dragNumber(label)}
              aria-grabbed={dragging}
              className={[choiceClass(dragging, marked), "ordered-tile", dragging ? "is-dragging" : ""]
                .filter(Boolean)
                .join(" ")}
              onPointerDown={(event) => onPointerDown(event, id)}
              onPointerMove={onPointerMove}
              onPointerUp={endDrag}
              onPointerCancel={endDrag}
              onKeyDown={(event) => onKeyDown(event, index)}
            >
              <OptionContent label={item?.label} visual={item?.visual} />
            </button>
          </li>
        );
      })}
    </ol>
  );
}
