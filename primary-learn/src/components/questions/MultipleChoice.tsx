import { TurnChoices } from "./TurnChoices";
import { PositionPicture } from "./PositionPicture";
import { copy } from "../../data/copy";
import { describeVisual } from "../../data/objects";
import type { CountObjectsQuestion, MultipleChoiceQuestion } from "../../types/activity";
import { ObjectGroup, OptionContent } from "./ObjectGroup";
import { choiceClass, markChoice, optionsAreNumerals, type Reveal } from "./choice";
import { ShapeChoices } from "./ShapeChoices";

type MultipleChoiceProps = {
  question: MultipleChoiceQuestion | CountObjectsQuestion;
  answer: unknown;
  disabled?: boolean;
  reveal: Reveal;
  onChange: (value: unknown) => void;
};

export function MultipleChoice({
  question,
  answer,
  disabled,
  reveal,
  onChange,
}: MultipleChoiceProps) {
  if (question.kind === "multiple-choice" && question.turn) return <TurnChoices key={question.id} question={question} answer={answer} disabled={disabled} reveal={reveal} onChange={onChange} />;
  if (question.kind === "multiple-choice" && (question.shape || question.options.some((option) => option.shape))) {
    return <ShapeChoices question={question} answer={answer} disabled={disabled} reveal={reveal} onChange={onChange} />;
  }
  if (question.kind === "multiple-choice" && question.numeral != null) {
    const shown = question.numeralLabel ?? String(question.numeral);
    return (
      <div className="amount-pick">
        <div className={`amount-numeral${question.numeralLabel ? " is-word" : ""}`} aria-hidden>
          {shown}
        </div>
        <div role="radiogroup" aria-label={copy.pickOne} className="amount-grid">
          {question.options.map((option) => {
            const selected = answer === option.id;
            const marked = markChoice(reveal, selected, option.id === question.correctId);
            return (
              <button
                key={`${question.id}-${option.id}`}
                type="button"
                role="radio"
                aria-checked={selected}
                aria-label={option.visual ? describeVisual(option.visual) : undefined}
                disabled={disabled}
                onClick={() => onChange(option.id)}
                className={choiceClass(selected, marked, ["amount-card"])}
              >
                <OptionContent visual={option.visual} layout={option.layout} pack />
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
      </div>
    );
  }

  const showStem = question.kind !== "count-objects" && Boolean(question.visual);
  const sum = !question.visual && optionsAreNumerals(question.options)
    ? question.prompt.match(/^What is (\d+) ([+−-]|take away) (\d+)\?$/)
    : null;
  const selectedLabel = question.options.find((option) => option.id === answer)?.label;
  return (
    <div className="option-stack">
      {question.numberLine ? <svg viewBox="0 0 360 100" role="img" aria-label={`Number line from ${question.numberLine.start} to ${question.numberLine.end}, with a missing label at the marked tick.`} style={{ width: "100%", maxWidth: 440, margin: "0 auto 16px", overflow: "visible" }}>
        <line x1="20" y1="45" x2="340" y2="45" stroke="currentColor" strokeWidth="2" />
        {Array.from({ length: question.numberLine.end - question.numberLine.start + 1 }, (_, i) => {
          const n = question.numberLine!; const value = n.start + i; const x = 20 + i * 320 / (n.end - n.start);
          return <g key={value}><line x1={x} x2={x} y1="39" y2="51" stroke="currentColor" strokeWidth="2" /><text x={x} y="76" textAnchor="middle" fontSize="16" fill="currentColor">{value === n.marked ? "?" : value}</text>{value === n.marked ? <path d={`M ${x-5} 25 L ${x+5} 25 L ${x} 34 Z`} fill="currentColor" /> : null}</g>;
        })}
      </svg> : null}
      {question.position ? <PositionPicture scene={question.position} /> : null}
      {sum ? (
        <div className={`make-total-sum${reveal === "correct" ? " is-correct" : reveal === "incorrect" ? " is-wrong" : ""}`}>
          <span className="make-total-box is-part">{sum[1]}</span>
          <span className="make-total-sign">{sum[2] === "-" || sum[2] === "take away" ? "−" : sum[2]}</span>
          <span className="make-total-box is-part">{sum[3]}</span>
          <span className="make-total-sign">=</span>
          <span className="make-total-box is-gap" aria-label={copy.yourAnswer}>{selectedLabel ?? "?"}</span>
        </div>
      ) : null}
      {showStem && question.visual ? (
        <ObjectGroup
          visual={question.visual}
          extras={question.extras}
          layout={question.layout}
          flashMs={reveal ? undefined : question.flashMs}
        />
      ) : null}
      <div role="radiogroup" aria-label={copy.pickOne} className="option-stack">
        {question.options.map((option, slot) => {
          const selected = answer === option.id;
          const marked = markChoice(reveal, selected, option.id === question.correctId);
          return (
            <button
              key={`${question.id}-${option.id}`}
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
              <OptionContent
                label={option.label}
                visual={option.visual}
                layout={option.layout}
              />
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
    </div>
  );
}
