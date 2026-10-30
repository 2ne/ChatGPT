import { useLayoutEffect, useRef, useState, type CSSProperties, type MouseEvent, type PointerEvent } from "react";
import { RotateCw } from "lucide-react";
import { copy } from "../../data/copy";
import { OBJECT_WORDS, objectGlyph } from "../../data/objects";
import type { BuildSetQuestion } from "../../types/activity";
import { isBuildGroupsAnswer, type BuildGroupsAnswer } from "../../lib/answers";
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

function emptyGroups(count: number): string[][] {
  return Array.from({ length: count }, () => [] as string[]);
}

function GroupsBuildSet({ question, answer, disabled, reveal, onChange }: BuildSetProps) {
  const groupCount = question.groupCount ?? 2;
  const groupSize = question.groupSize ?? 2;
  const bank = bankSize(question);
  const ids = Array.from({ length: bank }, (_, index) => String(index));
  const groups = isBuildGroupsAnswer(answer)
    ? answer.groups.map((group) => group.filter((id) => ids.includes(id)))
    : emptyGroups(groupCount);
  const used = new Set(groups.flat());
  const [picked, setPicked] = useState(0);
  const root = useRef<HTMLDivElement>(null);
  const words = OBJECT_WORDS[question.visual.item];
  const glyph = objectGlyph(question.visual.item);
  const allRight = groups.length === groupCount && groups.every((group) => group.length === groupSize);
  const marked = reveal == null ? "" : allRight ? " is-correct" : " is-wrong";

  function setGroups(next: string[][]) {
    onChange({ groups: next } satisfies BuildGroupsAnswer);
  }

  function add(id: string) {
    if (disabled || used.has(id)) return;
    const next = groups.map((group) => [...group]);
    const bucket = next[picked] ?? [];
    bucket.push(id);
    next[picked] = bucket;
    setGroups(next);
  }

  function remove(id: string) {
    if (disabled) return;
    setGroups(groups.map((group) => group.filter((item) => item !== id)));
  }

  return (
    <div className="build-set is-groups" ref={root} style={{ "--build-rows": Math.ceil(bank / 5) } as CSSProperties}>
      <div className="share-groups">
        {groups.map((group, index) => (
          <div key={`g-${index}`} className={`share-group${picked === index ? " is-on" : ""}${marked}`}>
            <p className="share-group-name">{copy.groupLabel(index + 1)}</p>
            <button
              type="button"
              className="share-group-pick"
              disabled={disabled}
              aria-label={copy.groupLabel(index + 1)}
              aria-pressed={picked === index}
              onClick={() => setPicked(index)}
            />
            {group.length === 0 ? <p className="share-group-empty">{copy.tapOntoGroup}</p> : null}
            {group.map((id) => (
              <button
                key={`${question.id}-${id}`}
                type="button"
                className="object-token"
                disabled={disabled}
                aria-label={`${words.singular}. Tap to take it out.`}
                onClick={() => remove(id)}
              >
                <span className="object-glyph" aria-hidden>
                  {glyph}
                </span>
              </button>
            ))}
          </div>
        ))}
      </div>
      <div className="build-source">
        <div className="build-tray" role="group" aria-label={copy.tapToAdd}>
          {ids.map((id) => (
            <button
              key={`${question.id}-${id}`}
              type="button"
              style={{ visibility: used.has(id) ? "hidden" : "visible" }}
              className="object-token"
              disabled={disabled || used.has(id)}
              aria-hidden={used.has(id) || undefined}
              aria-label={`Add a ${words.singular}`}
              onClick={() => add(id)}
            >
              <span className="object-glyph" aria-hidden>
                {glyph}
              </span>
            </button>
          ))}
        </div>
      </div>
      <div className="build-reset">
        <button
          type="button"
          className="btn-text"
          disabled={disabled || used.size === 0}
          style={{ visibility: used.size && !disabled ? "visible" : "hidden" }}
          onClick={() => setGroups(emptyGroups(groupCount))}
        >
          <RotateCw size={18} aria-hidden /> Start again
        </button>
      </div>
    </div>
  );
}

export function BuildSet({ question, answer, disabled, reveal, onChange }: BuildSetProps) {
  if (question.groupCount && question.groupSize) {
    return <GroupsBuildSet question={question} answer={answer} disabled={disabled} reveal={reveal} onChange={onChange} />;
  }
  const target = question.visual.count;
  const bank = bankSize(question);
  const ids = Array.from({ length: bank }, (_, index) => String(index));
  const selected = Array.isArray(answer) ? (answer as string[]).filter((id) => ids.includes(id)) : [];
  const root = useRef<HTMLDivElement>(null);
  const origins = useRef(new Map<string, DOMRect>());
  const keyboardMove = useRef(false);

  function remember(id: string) {
    const node = root.current?.querySelector<HTMLElement>(`[data-build-id="${id}"]:not([data-in-tray="hidden"])`);
    if (node) origins.current.set(id, node.getBoundingClientRect());
  }

  useLayoutEffect(() => {
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    for (const [id, from] of origins.current) {
      const node = root.current?.querySelector<HTMLElement>(`[data-build-id="${id}"]:not([data-in-tray="hidden"])`);
      if (!node) continue;
      if (keyboardMove.current) node.focus({ preventScroll: true });
      if (reduceMotion || typeof node.animate !== "function") continue;
      const to = node.getBoundingClientRect();
      const dx = from.left - to.left;
      const dy = from.top - to.top;
      node.animate([
        { transform: `translate(${dx}px, ${dy}px)`, offset: 0 },
        { transform: `translate(${dx * .45}px, ${dy * .45 - 20}px)`, offset: .55 },
        { transform: "translate(0, 0)", offset: 1 },
      ], { duration: 420, easing: "cubic-bezier(.22,.61,.36,1)" });
    }
    origins.current.clear();
    keyboardMove.current = false;
  }, [answer]);
  const words = OBJECT_WORDS[question.visual.item];
  const glyph = objectGlyph(question.visual.item);
  const marked =
    reveal == null ? "" : selected.length === target ? " is-correct" : " is-wrong";

  function add(id: string) {
    if (disabled || selected.includes(id)) return;
    remember(id);
    const next = [...selected, id];
    onChange(next);
  }

  function remove(id: string) {
    if (disabled) return;
    remember(id);
    const next = selected.filter((item) => item !== id);
    onChange(next);
  }

  function activateAdd(id: string, event: PointerEvent<HTMLButtonElement> | MouseEvent<HTMLButtonElement>) {
    if (event.type === "pointerdown" && event.button !== 0) return;
    if (event.type === "pointerdown") event.preventDefault();
    keyboardMove.current = event.detail === 0 && event.type === "click";
    add(id);
  }

  function activateRemove(id: string, event: PointerEvent<HTMLButtonElement> | MouseEvent<HTMLButtonElement>) {
    if (event.type === "pointerdown" && event.button !== 0) return;
    if (event.type === "pointerdown") event.preventDefault();
    keyboardMove.current = event.detail === 0 && event.type === "click";
    remove(id);
  }

  return (
    <div className="build-set" ref={root} style={{ "--build-rows": Math.ceil(bank / 5) } as CSSProperties}>
      <div>
        <div
          className={`build-group${selected.length ? " is-filled" : ""}${marked}`}
          role="group"
          aria-label={copy.yourGroup}
        >
          <p className="t-meta build-empty" hidden={selected.length > 0}>{copy.emptyGroup}</p>
          {selected.map((id) => (
              <button
                key={`${question.id}-${id}`}
                type="button"
                data-build-id={id}
                className="object-token"
                disabled={disabled}
                aria-label={`${words.singular}. Tap to take it out.`}
                onPointerDown={(event) => activateRemove(id, event)}
                onClick={(event) => {
                  if (event.detail === 0) activateRemove(id, event);
                }}
              >
                <span className="object-glyph" aria-hidden>
                  {glyph}
                </span>
              </button>
            ))}
        </div>
      </div>
      <div className="build-source">
        <div className="build-tray" role="group" aria-label={copy.tapToAdd}>
          {ids.map((id) => (
            <button
              key={`${question.id}-${id}`}
              type="button"
              data-build-id={id}
              data-in-tray={selected.includes(id) ? "hidden" : "visible"}
              style={{ visibility: selected.includes(id) ? "hidden" : "visible" }}
              className="object-token"
              disabled={disabled || selected.includes(id)}
              aria-hidden={selected.includes(id) || undefined}
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
      <span className="visually-hidden" role="status">{selected.length} {selected.length === 1 ? words.singular : words.plural} in your group.</span>
      <div className="build-reset">
        <button type="button" className="btn-text" disabled={disabled || !selected.length}
          style={{ visibility: selected.length && !disabled ? "visible" : "hidden" }}
          onClick={() => { selected.forEach(remember); onChange([]); }}>
          <RotateCw size={18} aria-hidden /> Start again
        </button>
      </div>
    </div>
  );
}
