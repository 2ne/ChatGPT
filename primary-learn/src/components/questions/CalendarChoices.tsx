import { CalendarDays, Check, X } from "lucide-react";
import { copy } from "../../data/copy";
import type { MultipleChoiceQuestion, QuestionOption } from "../../types/activity";
import { choiceClass, markChoice, type Reveal } from "./choice";

const weekdays = ["Mon", "Tue", "Wed", "Thu", "Fri"];

type CalendarChoicesProps = {
  calendar: NonNullable<MultipleChoiceQuestion["calendarPick"]>;
  options: QuestionOption[];
  correctId: string;
  answer: unknown;
  disabled?: boolean;
  reveal: Reveal;
  onChange: (id: string) => void;
};

export function CalendarChoices({ calendar, options, correctId, answer, disabled, reveal, onChange }: CalendarChoicesProps) {
  const { month, referenceDay } = calendar;
  const dates = [
    ...options.map(({ id, label }) => ({ id, day: Number(label) })),
    { id: null, day: referenceDay },
  ].sort((a, b) => a.day - b.day);

  return (
    <div className="calendar-pick">
      <div className="calendar-pick-heading">
        <CalendarDays size={20} aria-hidden="true" />
        {month}
      </div>
      <div className="calendar-pick-week" role="radiogroup" aria-label={`${month}. ${copy.pickOne}`}>
        {dates.map(({ id, day }, index) => {
          const date = `${day} ${month}`;
          const selected = id != null && answer === id;
          const marked = id == null ? null : markChoice(reveal, selected, id === correctId);
          return (
            <div className="calendar-pick-cell" key={day}>
              <span className="calendar-pick-weekday" aria-hidden="true">{weekdays[index]}</span>
              {id == null ? (
                <div className="calendar-pick-date calendar-pick-reference">
                  <span className="visually-hidden">{copy.timeSequenceStart(date)}</span>
                  <span aria-hidden="true">{day}</span>
                </div>
              ) : (
                <button
                  type="button"
                  role="radio"
                  aria-checked={selected}
                  aria-label={date}
                  disabled={disabled}
                  className={choiceClass(selected, marked, ["calendar-pick-date"])}
                  onClick={() => onChange(id)}
                >
                  {day}
                  {marked === "correct" ? <Check className="calendar-pick-mark" size={14} aria-hidden="true" /> : null}
                  {marked === "wrong" ? <X className="calendar-pick-mark" size={14} aria-hidden="true" /> : null}
                </button>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
