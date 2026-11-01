import { RotateCw, RotateCcw } from "lucide-react";
import type { SetClockQuestion } from "../../types/activity";
import { copy } from "../../data/copy";
import { clockLabel, isClockAnswer } from "../../lib/clock";
import { ClockPicture } from "./ClockPicture";
import type { Reveal } from "./choice";

export function SetClock({ question, answer, onChange, disabled, reveal }: {
  question: SetClockQuestion; answer: unknown; onChange: (answer: unknown) => void; disabled?: boolean; reveal: Reveal;
}) {
  const time = isClockAnswer(answer) ? answer : question.initialTime;
  return <div className={`set-clock${reveal ? ` is-${reveal}` : ""}`}>
    <ClockPicture clock={time} />
    <div className="clock-controls">
      <button type="button" className="btn btn-secondary" disabled={disabled} aria-label={copy.clockMoveHour} onClick={() => onChange({ hour: time.hour % 12 + 1, minute: time.minute })}>
        <span className="clock-hand-key is-hour" aria-hidden />{copy.clockShortHand}<RotateCw size={20} aria-hidden />
      </button>
      <button type="button" className="btn btn-secondary" disabled={disabled} aria-label={copy.clockMoveMinute} onClick={() => onChange({ hour: time.minute === 30 ? time.hour % 12 + 1 : time.hour, minute: time.minute === 0 ? 30 : 0 })}>
        <span className="clock-hand-key is-minute" aria-hidden />{copy.clockLongHand}<RotateCw size={20} aria-hidden />
      </button>
    </div>
    <span className="visually-hidden" role="status" aria-live="polite">{clockLabel(time)}</span>
    <button type="button" className="btn-text" disabled={disabled} onClick={() => onChange(null)}><RotateCcw size={18} aria-hidden />{copy.clockStartAgain}</button>
  </div>;
}
