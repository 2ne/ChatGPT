import { useMemo, useRef, useState } from "react";
import type { Question } from "../types/activity";

type Reveal = "correct" | "incorrect" | null;

type QuestionViewProps = {
  question: Question;
  answer: unknown;
  disabled?: boolean;
  reveal?: Reveal;
  onChange: (value: unknown) => void;
};

export function QuestionView({
  question,
  answer,
  disabled,
  reveal = null,
  onChange,
}: QuestionViewProps) {
  switch (question.kind) {
    case "multiple-choice":
      return (
        <div className="option-stack" role="radiogroup" aria-label="Choose one answer">
          {question.options.map((option, slot) => {
            const selected = answer === option.id;
            const marked = markChoice(reveal, selected, option.id === question.correctId);
            return (
              <button
                key={option.id}
                type="button"
                role="radio"
                aria-checked={selected}
                disabled={disabled}
                onClick={() => onChange(option.id)}
                className={choiceClass(selected, marked)}
              >
                <span className="option-letter" aria-hidden>
                  {"ABCD"[slot] ?? "•"}
                </span>
                {option.visual ? <span aria-hidden>{option.visual}</span> : null}
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
      );

    case "multi-select": {
      const selected = Array.isArray(answer) ? (answer as string[]) : [];
      return (
        <MultiSelect
          options={question.options}
          correctIds={question.correctIds}
          selected={selected}
          disabled={disabled}
          reveal={reveal}
          onChange={onChange}
        />
      );
    }

    case "fill-blank": {
      const tone = reveal === "correct" ? "is-correct" : reveal === "incorrect" ? "is-wrong" : "";
      return (
        <div className={`equation ${tone}`.trim()}>
          {question.prefix ? <span className="t-title-sm">{question.prefix}</span> : null}
          <input
            value={typeof answer === "string" ? answer : ""}
            disabled={disabled}
            inputMode={question.inputMode === "text" ? "text" : "numeric"}
            autoComplete="off"
            autoCapitalize="off"
            spellCheck={false}
            aria-label="Your answer"
            onChange={(event) => onChange(event.target.value)}
          />
          {question.suffix ? <span className="t-title-sm">{question.suffix}</span> : null}
        </div>
      );
    }

    case "ordered": {
      const order = Array.isArray(answer) ? (answer as string[]) : question.items.map((item) => item.id);
      const labelFor = (id: string) => question.items.find((item) => item.id === id)?.label ?? id;

      function move(index: number, direction: -1 | 1) {
        const next = [...order];
        const target = index + direction;
        if (target < 0 || target >= next.length) return;
        const current = next[index];
        next[index] = next[target];
        next[target] = current;
        onChange(next);
      }

      return (
        <ol className="option-stack" style={{ listStyle: "none", margin: 0, padding: 0 }}>
          {order.map((id, index) => {
            const inPlace = reveal != null && question.correctOrder[index] === id;
            const marked = reveal == null ? null : inPlace ? "correct" : "wrong";
            return (
              <li key={id} className={choiceClass(false, marked)}>
                <span>
                  <span className="t-meta" style={{ marginRight: 8 }}>
                    {index + 1}.
                  </span>
                  {labelFor(id)}
                </span>
                <span className="step-pair">
                  <button
                    type="button"
                    disabled={disabled || index === 0}
                    aria-label={`Move ${labelFor(id)} up`}
                    onClick={() => move(index, -1)}
                    className="btn btn-secondary step-btn"
                  >
                    ↑
                  </button>
                  <button
                    type="button"
                    disabled={disabled || index === order.length - 1}
                    aria-label={`Move ${labelFor(id)} down`}
                    onClick={() => move(index, 1)}
                    className="btn btn-secondary step-btn"
                  >
                    ↓
                  </button>
                </span>
              </li>
            );
          })}
        </ol>
      );
    }

    case "match-pairs":
      return (
        <MatchPairs
          question={question}
          answer={answer}
          disabled={disabled}
          reveal={reveal}
          onChange={onChange}
        />
      );

    default:
      return <p className="t-body">This question type is not supported yet.</p>;
  }
}

function MultiSelect({
  options,
  correctIds,
  selected,
  disabled,
  reveal,
  onChange,
}: {
  options: { id: string; label: string; visual?: string }[];
  correctIds: string[];
  selected: string[];
  disabled?: boolean;
  reveal: Reveal;
  onChange: (value: unknown) => void;
}) {
  const selectedRef = useRef(selected);
  selectedRef.current = selected;

  function toggle(id: string) {
    const current = selectedRef.current;
    const next = current.includes(id) ? current.filter((item) => item !== id) : [...current, id];
    selectedRef.current = next;
    onChange(next);
  }

  return (
    <div className="option-stack" role="group" aria-label="Choose all that apply">
      <p className="t-body">Choose all that apply.</p>
      {options.map((option, slot) => {
        const isOn = selected.includes(option.id);
        const marked = markChoice(reveal, isOn, correctIds.includes(option.id));
        return (
          <button
            key={option.id}
            type="button"
            aria-pressed={isOn}
            disabled={disabled}
            onClick={() => toggle(option.id)}
            className={choiceClass(isOn, marked)}
          >
            <span className="option-letter" aria-hidden>
              {"ABCD"[slot] ?? "✓"}
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
  );
}

function MatchPairs({
  question,
  answer,
  disabled,
  reveal,
  onChange,
}: {
  question: Extract<Question, { kind: "match-pairs" }>;
  answer: unknown;
  disabled?: boolean;
  reveal: Reveal;
  onChange: (value: unknown) => void;
}) {
  const map =
    answer && typeof answer === "object"
      ? (answer as Record<string, string>)
      : Object.fromEntries(question.pairs.map((pair) => [pair.id, ""]));
  const rights = useMemo(
    () => seededOrder(question.pairs.map((pair) => pair.right), question.id),
    [question],
  );
  const [activeId, setActiveId] = useState(question.pairs[0]?.id ?? "");

  function assign(right: string) {
    const target =
      activeId || question.pairs.find((pair) => !map[pair.id])?.id || question.pairs[0]?.id;
    if (!target) return;
    const next = { ...map };
    if (next[target] === right) {
      next[target] = "";
      onChange(next);
      return;
    }
    for (const id of Object.keys(next)) {
      if (next[id] === right) next[id] = "";
    }
    next[target] = right;
    onChange(next);
    const following = question.pairs.find((pair) => pair.id !== target && !next[pair.id]);
    if (following) setActiveId(following.id);
  }

  return (
    <div className="option-stack">
      <p className="t-body">Tap one, then tap its partner.</p>
      <div className="match-board">
        {question.pairs.map((pair) => {
          const chosen = map[pair.id] ?? "";
          const marked =
            reveal == null ? null : chosen === pair.right ? "correct" : "wrong";
          return (
            <button
              key={pair.id}
              type="button"
              disabled={disabled}
              aria-pressed={activeId === pair.id}
              onClick={() => setActiveId(pair.id)}
              className={`match-row ${choiceClass(activeId === pair.id, marked)}`}
            >
              <span>{pair.left}</span>
              <span className={`match-slot${chosen ? " is-filled" : ""}`}>
                {chosen || "Choose"}
              </span>
            </button>
          );
        })}
      </div>
      <div className="match-bank" role="group" aria-label="Partners">
        {rights.map((right, index) => {
          const used = Object.values(map).includes(right);
          return (
            <button
              key={`${right}-${index}`}
              type="button"
              disabled={disabled}
              aria-pressed={used}
              onClick={() => assign(right)}
              className={`match-chip${used ? " is-used" : ""}`}
            >
              {right}
            </button>
          );
        })}
      </div>
    </div>
  );
}

function choiceClass(selected: boolean, marked: "correct" | "wrong" | null) {
  return [
    "option",
    selected ? "is-selected" : "",
    marked === "correct" ? "is-correct" : "",
    marked === "wrong" ? "is-wrong" : "",
  ]
    .filter(Boolean)
    .join(" ");
}

function markChoice(
  reveal: Reveal,
  selected: boolean,
  isCorrectOption: boolean,
): "correct" | "wrong" | null {
  if (!reveal) return null;
  if (isCorrectOption) return "correct";
  if (selected) return "wrong";
  return null;
}

function seededOrder(items: string[], seed: string): string[] {
  let hash = 2166136261;
  for (let i = 0; i < seed.length; i += 1) {
    hash ^= seed.charCodeAt(i);
    hash = Math.imul(hash, 16777619);
  }
  const next = [...items];
  for (let i = next.length - 1; i > 0; i -= 1) {
    hash = Math.imul(hash ^ (hash >>> 16), 2246822507);
    const j = (hash >>> 0) % (i + 1);
    const swap = next[i];
    next[i] = next[j];
    next[j] = swap;
  }
  if (next.length > 1 && next.every((item, index) => item === items[index])) {
    const first = next[0];
    next[0] = next[1];
    next[1] = first;
  }
  return next;
}
