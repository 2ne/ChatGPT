import { copy } from "../../data/copy";
import type { FillBlankQuestion } from "../../types/activity";
import { ObjectGroup } from "./ObjectGroup";
import type { Reveal } from "./choice";

type FillBlankProps = {
  question: FillBlankQuestion;
  answer: unknown;
  disabled?: boolean;
  reveal: Reveal;
  onChange: (value: unknown) => void;
};

export function FillBlank({ question, answer, disabled, reveal, onChange }: FillBlankProps) {
  const tone = reveal === "correct" ? "is-correct" : reveal === "incorrect" ? "is-wrong" : "";
  const sum = `${question.prefix ?? ""} ? ${question.suffix ?? ""}`.trim()
    .match(/^(\d+|\?)\s*([+−-])\s*(\d+|\?)\s*=\s*(\d+|\?)$/);
  const input = (
    <input
      className={sum ? "make-total-box is-gap" : undefined}
      placeholder={sum ? "?" : undefined}
      value={typeof answer === "string" ? answer : ""}
      disabled={disabled}
      inputMode={question.inputMode === "text" ? "text" : "numeric"}
      autoComplete="off"
      autoCapitalize="off"
      spellCheck={false}
      aria-label={copy.yourAnswer}
      onChange={(event) => onChange(event.target.value)}
    />
  );
  return (
    <div className="option-stack">
      {question.visual ? (
        <ObjectGroup
          visual={question.visual}
          extras={question.extras}
          layout={question.layout}
          flashMs={reveal ? undefined : question.flashMs}
        />
      ) : null}
      {sum ? (
        <div className={`make-total-sum typed-sum ${tone}`.trim()}>
          {sum[1] === "?" ? input : <span className="make-total-box is-part">{sum[1]}</span>}
          <span className="make-total-sign">{sum[2] === "-" ? "−" : sum[2]}</span>
          {sum[3] === "?" ? input : <span className="make-total-box is-part">{sum[3]}</span>}
          <span className="make-total-sign">=</span>
          {sum[4] === "?" ? input : <span className="make-total-box is-whole">{sum[4]}</span>}
        </div>
      ) : (
      <div className={`equation ${tone}`.trim()}>
        {question.prefix ? <span className="t-title-sm">{question.prefix}</span> : null}
        {input}
        {question.suffix ? <span className="t-title-sm">{question.suffix}</span> : null}
      </div>
      )}
    </div>
  );
}

