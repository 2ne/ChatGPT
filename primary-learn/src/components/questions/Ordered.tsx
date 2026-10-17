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

export function Ordered({ question, answer, disabled, reveal, onChange }: OrderedProps) {
  const order = Array.isArray(answer) ? (answer as string[]) : question.items.map((item) => item.id);
  const itemFor = (id: string) => question.items.find((item) => item.id === id);

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
        const item = itemFor(id);
        const label = item?.label ?? id;
        const inPlace = reveal != null && question.correctOrder[index] === id;
        const marked = reveal == null ? null : inPlace ? "correct" : "wrong";
        return (
          <li key={`${question.id}-${id}`} className={choiceClass(false, marked)}>
            <span>
              <span className="t-meta" style={{ marginRight: 8 }}>
                {index + 1}.
              </span>
              <OptionContent label={item?.label} visual={item?.visual} />
            </span>
            <span className="step-pair">
              <button
                type="button"
                disabled={disabled || index === 0}
                aria-label={copy.moveUp(label)}
                onClick={() => move(index, -1)}
                className="btn btn-secondary step-btn"
              >
                ↑
              </button>
              <button
                type="button"
                disabled={disabled || index === order.length - 1}
                aria-label={copy.moveDown(label)}
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
