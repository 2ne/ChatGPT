import { FractionPicture } from "./FractionPicture";
import { useRef } from "react";
import type { MultiSelectQuestion } from "../../types/activity";
import { ObjectGroup, OptionContent } from "./ObjectGroup";
import { BaseTen } from "./BaseTen";
import { TenFrame } from "./TenFrame";
import { GroupsPicture } from "./GroupsPicture";
import { choiceClass, markChoice, type Reveal } from "./choice";
import { ShapeChoices } from "./ShapeChoices";

type MultiSelectProps = {
  question: MultiSelectQuestion;
  answer: unknown;
  disabled?: boolean;
  reveal: Reveal;
  onChange: (value: unknown) => void;
};

export function MultiSelect({ question, answer, disabled, reveal, onChange }: MultiSelectProps) {
  const selected = Array.isArray(answer) ? (answer as string[]) : [];
  const selectedRef = useRef(selected);
  selectedRef.current = selected;

  function toggle(id: string) {
    const current = selectedRef.current;
    const next = current.includes(id) ? current.filter((item) => item !== id) : [...current, id];
    selectedRef.current = next;
    onChange(next);
  }

  if (question.shape || question.options.some((option) => option.shape)) {
    return <ShapeChoices question={question} answer={answer} disabled={disabled} reveal={reveal} onChange={onChange} />;
  }

  return (
    <div className="option-stack" role="group" aria-label={question.prompt}>
      {question.tenFrame ? <TenFrame frame={question.tenFrame} /> : null}
      {question.baseTen ? <BaseTen model={question.baseTen} /> : null}
      {question.groups ? <GroupsPicture groups={question.groups} /> : null}
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
      {question.options.map((option, slot) => {
        const isOn = selected.includes(option.id);
        const marked = markChoice(reveal, isOn, question.correctIds.includes(option.id));
        return (
          <button
            key={`${question.id}-${option.id}`}
            type="button"
            aria-pressed={isOn}
            disabled={disabled}
            onClick={() => toggle(option.id)}
            className={choiceClass(isOn, marked)}
          >
            <span className="option-letter" aria-hidden>
              {"ABCD"[slot] ?? "✓"}
            </span>
            <OptionContent
              label={option.label}
              visual={option.visual}
              tenFrame={option.tenFrame}
              baseTen={option.baseTen}
              dice={option.dice}
              groups={option.groups}
              array={option.array} fraction={option.fraction}
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
  );
}
