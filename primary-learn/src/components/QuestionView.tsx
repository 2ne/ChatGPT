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
        <div className="grid gap-3" role="radiogroup" aria-label="Choose one answer">
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
                className={`flex min-h-16 items-center gap-3 rounded-2xl border-2 px-4 py-3 text-left font-bold transition ${
                  selected
                    ? "border-[var(--brand)] bg-[var(--brand-soft)]"
                    : "border-[var(--line)] bg-white hover:border-[var(--sky)]"
                }`}
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
        <div className="grid gap-3" role="group" aria-label="Choose all that apply">
          <p className="text-sm font-semibold text-[var(--muted)]">Choose all that apply</p>
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
                className={`flex min-h-16 items-center gap-3 rounded-2xl border-2 px-4 py-3 text-left font-bold transition ${
                  isOn
                    ? "border-[var(--brand)] bg-[var(--brand-soft)]"
                    : "border-[var(--line)] bg-white hover:border-[var(--sky)]"
                }`}
              >
                <span
                  aria-hidden
                  className={`grid h-6 w-6 place-items-center rounded-md border-2 text-xs ${
                    isOn
                      ? "border-[var(--brand)] bg-[var(--brand)] text-white"
                      : "border-[var(--line)]"
                  }`}
                >
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
        <div className="flex flex-wrap items-center gap-3 rounded-2xl border-2 border-[var(--line)] bg-white px-4 py-5">
          {question.prefix ? <span className="text-2xl font-bold">{question.prefix}</span> : null}
          <input
            value={typeof answer === "string" ? answer : ""}
            disabled={disabled}
            inputMode={question.inputMode === "text" ? "text" : "numeric"}
            aria-label="Your answer"
            onChange={(event) => onChange(event.target.value)}
            className="min-h-14 w-28 rounded-xl border-2 border-[var(--brand)] bg-[var(--sun-soft)] px-3 text-center text-2xl font-extrabold outline-none"
          />
          {question.suffix ? <span className="text-2xl font-bold">{question.suffix}</span> : null}
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
        <ol className="grid gap-3">
          {order.map((id, index) => (
            <li
              key={id}
              className="flex min-h-16 items-center justify-between gap-3 rounded-2xl border-2 border-[var(--line)] bg-white px-4 py-3"
            >
              <span className="font-bold">
                <span className="mr-3 text-[var(--muted)]">{index + 1}.</span>
                {labelFor(id)}
              </span>
              <span className="flex gap-2">
                <button
                  type="button"
                  disabled={disabled || index === 0}
                  aria-label={`Move ${labelFor(id)} up`}
                  onClick={() => move(index, -1)}
                  className="min-h-11 min-w-11 rounded-xl border border-[var(--line)] bg-[var(--paper)] font-bold"
                >
                  ↑
                </button>
                <button
                  type="button"
                  disabled={disabled || index === order.length - 1}
                  aria-label={`Move ${labelFor(id)} down`}
                  onClick={() => move(index, 1)}
                  className="min-h-11 min-w-11 rounded-xl border border-[var(--line)] bg-[var(--paper)] font-bold"
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
        <div className="grid gap-4">
          {question.pairs.map((pair) => (
            <label
              key={pair.id}
              className="grid gap-2 rounded-2xl border-2 border-[var(--line)] bg-white px-4 py-3 sm:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] sm:items-center"
            >
              <span className="font-bold">{pair.left}</span>
              <select
                disabled={disabled}
                value={map[pair.id] ?? ""}
                onChange={(event) => onChange({ ...map, [pair.id]: event.target.value })}
                className="min-h-12 rounded-xl border-2 border-[var(--line)] bg-[var(--paper)] px-3 font-semibold"
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
      return <p>This question type is not supported yet.</p>;
  }
}
