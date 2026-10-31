import { MeasurePicture } from "./MeasurePicture";
import { FractionPicture } from "./FractionPicture";
import { copy } from "../../data/copy";
import type { FillBlankQuestion } from "../../types/activity";
import { ObjectGroup } from "./ObjectGroup";
import { BaseTen } from "./BaseTen";
import { HundredSquare } from "./HundredSquare";
import { NumberLine } from "./NumberLine";
import { TenFrame } from "./TenFrame";
import { GroupsPicture } from "./GroupsPicture";
import { choiceClass, markChoice, type Reveal } from "./choice";

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
      {question.numberLine ? <NumberLine line={question.numberLine} /> : null}
      {question.hundredSquare ? <HundredSquare square={question.hundredSquare} /> : null}
      {question.tenFrame ? <TenFrame frame={question.tenFrame} /> : null}
      {question.baseTen ? <BaseTen model={question.baseTen} /> : null}
      {question.groups ? <GroupsPicture groups={question.groups} /> : null}
      {question.measure ? <MeasurePicture measure={question.measure} /> : null}
      {question.fraction ? <FractionPicture fraction={question.fraction} /> : null}
      {question.array ? <GroupsPicture array={question.array} /> : null}
      {question.visual ? (
        <ObjectGroup
          visual={question.visual}
          extras={question.extras}
          layout={question.layout}
          flashMs={reveal ? undefined : question.flashMs}
        />
      ) : null}
      {(!question.numericChoices || question.prefix || question.suffix) ? <div className={`equation ${tone}`.trim()}>
        {question.prefix ? <span className="t-title-sm">{question.prefix}</span> : null}
        {question.numericChoices ? <span className="t-title-sm" aria-label={copy.yourAnswer}>{typeof answer === "string" && answer ? answer : "?"}</span> : <input
          value={typeof answer === "string" ? answer : ""}
          disabled={disabled}
          inputMode={question.inputMode === "text" ? "text" : "numeric"}
          autoComplete="off"
          autoCapitalize="off"
          spellCheck={false}
          aria-label={copy.yourAnswer}
          onChange={(event) => onChange(event.target.value)}
        />}
        {question.suffix ? <span className="t-title-sm">{question.suffix}</span> : null}
      </div> : null}
      {question.numericChoices ? (
        <div className="number-answer-grid" role="radiogroup" aria-label={copy.pickOne}>
          {question.numericChoices.map((value, index) => {
            const selected = answer === String(value);
            const correct = question.acceptedAnswers.includes(String(value));
            const marked = markChoice(reveal, selected, correct);
            return <button type="button" key={value} role="radio" aria-checked={selected}
              disabled={disabled} className={choiceClass(selected, marked)}
              onClick={() => onChange(String(value))}>
              <span className="option-letter" aria-hidden>{"ABCD"[index]}</span>
              <span>{value}</span>
              {marked ? <span aria-hidden>{marked === "correct" ? "✓" : "✕"}</span> : null}
            </button>;
          })}
        </div>
      ) : null}
    </div>
  );
}
