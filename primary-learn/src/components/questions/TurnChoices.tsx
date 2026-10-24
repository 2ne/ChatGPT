import { useRef, useState } from "react";
import type { MultipleChoiceQuestion } from "../../types/activity";
import { TurnPicture, ToyCar, directions } from "./TurnPicture";
import { choiceClass, markChoice, type Reveal } from "./choice";
export function TurnChoices({ question, answer, disabled, reveal, onChange }: {question: MultipleChoiceQuestion; answer: unknown; disabled?: boolean; reveal: Reveal; onChange: (value: unknown) => void}) {
  const [steps, setSteps] = useState(0);
  const current = useRef(0);
  const turn = question.turn!;
  if (turn.interactive) {
    const move = (step: number) => {
      const next = Math.max(-4, Math.min(4, current.current + step));
      current.current = next; setSteps(next);
      // IDs encode the performed movement, not just the final orientation.
      onChange(next === 0 ? null : String(next));
    };
    return <div className="option-stack"><TurnPicture turn={turn} steps={steps}/>
      <div className="turn-controls"><button type="button" className="btn btn-secondary" disabled={disabled || steps <= -4} onClick={() => move(-1)}>↶<span>Quarter turn<br/>anti-clockwise</span></button><button type="button" className="btn btn-secondary" disabled={disabled || steps >= 4} onClick={() => move(1)}>↷<span>Quarter turn<br/>clockwise</span></button></div>
      <p className="turn-description" aria-live="polite">{Math.abs(steps)} quarter {Math.abs(steps) === 1 ? "step" : "steps"}{steps ? steps < 0 ? " anti-clockwise" : " clockwise" : ""}</p>
      <button type="button" className="btn btn-ghost" disabled={disabled || !steps} onClick={() => {current.current = 0;setSteps(0);onChange(null);}}>Start again</button>
    </div>;
  }
  const pictures = !turn.showEnd;
  return <div className="option-stack"><TurnPicture turn={turn}/><div role="radiogroup" aria-label={question.prompt} className={pictures ? "shape-choice-grid" : "option-stack"}>
    {question.options.map((option, slot) => {const selected = answer === option.id; const marked = markChoice(reveal,selected,option.id === question.correctId);return <button type="button" key={option.id} role="radio" aria-checked={selected} disabled={disabled} className={choiceClass(selected, marked, pictures ? ["shape-choice", "car-choice"] : [])} onClick={() => onChange(option.id)}>
      <span className="option-letter" aria-hidden>{"ABCD"[slot]}</span>{pictures ? <><ToyCar direction={directions.indexOf(option.label ?? "")}/><span>{option.label}</span></> : <span>{option.label}</span>}{marked && <span className={marked === "correct" ? "option-check" : "option-cross"} aria-hidden>{marked === "correct" ? "✓" : "✕"}</span>}
    </button>;})}
  </div></div>;
}
