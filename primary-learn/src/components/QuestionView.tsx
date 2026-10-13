import type { Question } from "../types/activity";

type QuestionViewProps = {
  question: Question;
  answer: unknown;
  disabled?: boolean;
  onChange: (value: unknown) => void;
};

export function QuestionView({ question, answer, disabled, onChange }: QuestionViewProps) {
  switch (question.kind) {
    case "multiple-choice":
      return (
        <div className="option-stack" role="radiogroup" aria-label="Choose one answer">
          {question.options.map((option) => {
            const selected = answer === option.id;
            return (
              <button
                key={option.id}
                type="button"
                role="radio"
                aria-checked={selected}
                disabled={disabled}
                onClick={() => onChange(option.id)}
                className={`option${selected ? " is-selected" : ""}`}
              >
                {option.visual ? <span aria-hidden>{option.visual}</span> : null}
                <span>{option.label}</span>
              </button>
            );
          })}
        </div>
      );

    case "multi-select": {
      const selected = Array.isArray(answer) ? (answer as string[]) : [];
      return (
        <div className="option-stack" role="group" aria-label="Choose all that apply">
          <p className="t-meta">Choose all that apply</p>
          {question.options.map((option) => {
            const isOn = selected.includes(option.id);
            return (
              <button
                key={option.id}
                type="button"
                aria-pressed={isOn}
                disabled={disabled}
                onClick={() => {
                  if (isOn) onChange(selected.filter((id) => id !== option.id));
                  else onChange([...selected, option.id]);
                }}
                className={`option${isOn ? " is-selected" : ""}`}
              >
                <span className="option-check" aria-hidden>
                  {isOn ? "✓" : ""}
                </span>
                <span>{option.label}</span>
              </button>
            );
          })}
        </div>
      );
    }

    case "fill-blank":
      return (
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            alignItems: "center",
            gap: "var(--space-2)",
            padding: "var(--space-4)",
            border: "1px solid var(--off-black-16)",
            borderRadius: "var(--radius-card)",
            background: "var(--white)",
          }}
        >
          {question.prefix ? (
            <span className="t-heading" style={{ fontSize: 20, lineHeight: "28px" }}>
              {question.prefix}
            </span>
          ) : null}
          <input
            value={typeof answer === "string" ? answer : ""}
            disabled={disabled}
            inputMode={question.inputMode === "text" ? "text" : "numeric"}
            aria-label="Your answer"
            onChange={(event) => onChange(event.target.value)}
            style={{
              minHeight: 48,
              width: 96,
              border: "1px solid var(--blue)",
              borderRadius: "var(--radius-btn)",
              background: "var(--blue-soft)",
              textAlign: "center",
              fontSize: 20,
              fontWeight: 700,
              padding: "0 8px",
            }}
          />
          {question.suffix ? (
            <span className="t-heading" style={{ fontSize: 20, lineHeight: "28px" }}>
              {question.suffix}
            </span>
          ) : null}
        </div>
      );

    case "ordered": {
      const order = Array.isArray(answer) ? (answer as string[]) : question.items.map((i) => i.id);
      const labelFor = (id: string) => question.items.find((item) => item.id === id)?.label ?? id;

      function move(index: number, direction: -1 | 1) {
        const next = [...order];
        const target = index + direction;
        if (target < 0 || target >= next.length) return;
        const tmp = next[index];
        next[index] = next[target];
        next[target] = tmp;
        onChange(next);
      }

      return (
        <ol className="option-stack" style={{ listStyle: "none", margin: 0, padding: 0 }}>
          {order.map((id, index) => (
            <li
              key={id}
              className="option"
              style={{ justifyContent: "space-between" }}
            >
              <span>
                <span className="t-meta" style={{ marginRight: 8 }}>
                  {index + 1}.
                </span>
                {labelFor(id)}
              </span>
              <span style={{ display: "flex", gap: 8 }}>
                <button
                  type="button"
                  disabled={disabled || index === 0}
                  aria-label={`Move ${labelFor(id)} up`}
                  onClick={() => move(index, -1)}
                  className="btn btn-secondary"
                  style={{ minHeight: 40, minWidth: 40, padding: 0 }}
                >
                  ↑
                </button>
                <button
                  type="button"
                  disabled={disabled || index === order.length - 1}
                  aria-label={`Move ${labelFor(id)} down`}
                  onClick={() => move(index, 1)}
                  className="btn btn-secondary"
                  style={{ minHeight: 40, minWidth: 40, padding: 0 }}
                >
                  ↓
                </button>
              </span>
            </li>
          ))}
        </ol>
      );
    }

    case "match-pairs": {
      const map =
        answer && typeof answer === "object"
          ? (answer as Record<string, string>)
          : Object.fromEntries(question.pairs.map((pair) => [pair.id, ""]));
      const rights = question.pairs.map((pair) => pair.right);

      return (
        <div className="option-stack">
          {question.pairs.map((pair) => (
            <label
              key={pair.id}
              className="field"
              style={{
                padding: "var(--space-3)",
                border: "1px solid var(--off-black-16)",
                borderRadius: "var(--radius-card)",
                background: "var(--white)",
              }}
            >
              <span className="t-label">{pair.left}</span>
              <select
                disabled={disabled}
                value={map[pair.id] ?? ""}
                onChange={(event) => onChange({ ...map, [pair.id]: event.target.value })}
                className="select"
              >
                <option value="">Choose…</option>
                {rights.map((right) => (
                  <option key={`${pair.id}-${right}`} value={right}>
                    {right}
                  </option>
                ))}
              </select>
            </label>
          ))}
        </div>
      );
    }

    default:
      return <p className="t-body">This question type is not supported yet.</p>;
  }
}
