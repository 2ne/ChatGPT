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
  return (
    <div className="option-stack">
      {question.visual ? (
        <ObjectGroup
          visual={question.visual}
          extras={question.extras}
          layout={question.layout}
          interactive
        />
      ) : null}
      <div className={`equation ${tone}`.trim()}>
        {question.prefix ? <span className="t-title-sm">{question.prefix}</span> : null}
        <input
          value={typeof answer === "string" ? answer : ""}
          disabled={disabled}
          inputMode={question.inputMode === "text" ? "text" : "numeric"}
          autoComplete="off"
          autoCapitalize="off"
          spellCheck={false}
          aria-label={copy.yourAnswer}
          onChange={(event) => onChange(event.target.value)}
        />
        {question.suffix ? <span className="t-title-sm">{question.suffix}</span> : null}
      </div>
    </div>
  );
}
