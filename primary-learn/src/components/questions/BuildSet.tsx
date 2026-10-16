import type { MouseEvent, PointerEvent } from "react";
import { copy } from "../../data/copy";
import { OBJECT_WORDS, objectGlyph } from "../../data/objects";
import { speakCount } from "../../lib/speech";
import type { BuildSetQuestion } from "../../types/activity";
import type { Reveal } from "./choice";

type BuildSetProps = {
  question: BuildSetQuestion;
  answer: unknown;
  disabled?: boolean;
  reveal: Reveal;
  onChange: (value: unknown) => void;
};

function bankSize(question: BuildSetQuestion): number {
  const target = question.visual.count;
  const written = question.bank ?? Math.min(12, target + 2);
  return Math.min(12, Math.max(target, written));
}

export function BuildSet({ question, answer, disabled, reveal, onChange }: BuildSetProps) {
  const target = question.visual.count;
  const bank = bankSize(question);
  const ids = Array.from({ length: bank }, (_, index) => String(index));
  const selected = Array.isArray(answer) ? (answer as string[]).filter((id) => ids.includes(id)) : [];
  const tray = ids.filter((id) => !selected.includes(id));
  const words = OBJECT_WORDS[question.visual.item];
  const glyph = objectGlyph(question.visual.item);
  const marked =
    reveal == null ? "" : selected.length === target ? " is-correct" : " is-wrong";

  function add(id: string) {
    if (disabled || selected.includes(id)) return;
    const next = [...selected, id];
    onChange(next);
    speakCount(next.length);
  }

  function remove(id: string) {
    if (disabled) return;
    const next = selected.filter((item) => item !== id);
    onChange(next);
    if (next.length > 0) speakCount(next.length);
  }

  function activateAdd(id: string, event: PointerEvent<HTMLButtonElement> | MouseEvent<HTMLButtonElement>) {
    if (event.type === "pointerdown" && event.button !== 0) return;
    if (event.type === "pointerdown") event.preventDefault();
    add(id);
  }

  function activateRemove(id: string, event: PointerEvent<HTMLButtonElement> | MouseEvent<HTMLButtonElement>) {
    if (event.type === "pointerdown" && event.button !== 0) return;
    if (event.type === "pointerdown") event.preventDefault();
    remove(id);
  }

  return (
    <div className="build-set">
      <div>
        <p className="build-label">{copy.yourGroup}</p>
        <div
          className={`build-group${selected.length ? " is-filled" : ""}${marked}`}
          role="list"
          aria-label={copy.yourGroup}
        >
          {selected.length === 0 ? (
            <p className="t-meta build-empty">{copy.emptyGroup}</p>
          ) : (
            selected.map((id, index) => (
              <button
                key={id}
                type="button"
                role="listitem"
                className="object-token is-lit"
                disabled={disabled}
                aria-label={`${words.singular} ${index + 1}. Tap to take it out.`}
                onPointerDown={(event) => activateRemove(id, event)}
                onClick={(event) => {
                  if (event.detail === 0) activateRemove(id, event);
                }}
              >
                <span className="object-glyph" aria-hidden>
                  {glyph}
                </span>
                <span className="object-num" aria-hidden>
                  {index + 1}
                </span>
              </button>
            ))
          )}
        </div>
      </div>
      <div>
        <p className="build-label">{copy.tapToAdd}</p>
        <div className="build-tray" role="list" aria-label={copy.tapToAdd}>
          {tray.map((id) => (
            <button
              key={id}
              type="button"
              role="listitem"
              className="object-token"
              disabled={disabled}
              aria-label={`Add a ${words.singular}`}
              onPointerDown={(event) => activateAdd(id, event)}
              onClick={(event) => {
                if (event.detail === 0) activateAdd(id, event);
              }}
            >
              <span className="object-glyph" aria-hidden>
                {glyph}
              </span>
            </button>
          ))}
        </div>
      </div>
      {selected.length > 0 && !disabled ? (
        <button type="button" className="btn-text" onClick={() => onChange([])}>
          {copy.startGroupAgain}
        </button>
      ) : null}
    </div>
  );
}
