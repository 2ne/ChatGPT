import { TurnChoices } from "./TurnChoices";
import { PositionPicture } from "./PositionPicture";
import { copy } from "../../data/copy";
import { describeVisual } from "../../data/objects";
import type { CountObjectsQuestion, MultipleChoiceQuestion } from "../../types/activity";
import { ObjectGroup, OptionContent } from "./ObjectGroup";
import { BaseTen } from "./BaseTen";
import { HundredSquare } from "./HundredSquare";
import { NumberLine } from "./NumberLine";
import { TenFrame } from "./TenFrame";
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
                <OptionContent visual={option.visual} tenFrame={option.tenFrame} baseTen={option.baseTen} dice={option.dice} layout={option.layout} pack />
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

  const showStem = question.kind !== "count-objects" && Boolean(question.visual || question.tenFrame || question.baseTen);
  const sum = !question.visual && optionsAreNumerals(question.options)
    ? question.prompt.match(/^What is (\d+) ([+−-]|take away) (\d+)\?$/)
    : null;
  const selectedLabel = question.options.find((option) => option.id === answer)?.label;
  return (
    <div className="option-stack">
      {question.numberLine ? <NumberLine line={question.numberLine} /> : null}
      {question.hundredSquare ? <HundredSquare square={question.hundredSquare} /> : null}
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
      {showStem && question.tenFrame ? <TenFrame frame={question.tenFrame} /> : null}
      {showStem && question.baseTen ? <BaseTen model={question.baseTen} /> : null}
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
                tenFrame={option.tenFrame}
                baseTen={option.baseTen}
                dice={option.dice}
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
