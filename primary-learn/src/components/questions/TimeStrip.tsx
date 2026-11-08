import { copy } from "../../data/copy";
import type { DayPart, QuestionOption, TimeStripAsset } from "../../types/activity";

const skies: Record<DayPart, string> = {
  morning: "#ffe5ac",
  afternoon: "#c9efff",
  evening: "#ffd2b8",
  night: "#272b66",
};

export function DayScene({ part }: { part: DayPart }) {
  return (
    <svg className="day-scene" viewBox="0 0 120 80" aria-hidden="true">
      <rect width="120" height="80" fill={skies[part]} />
      {part === "morning" ? (
        <>
          <path d="M14 36h43M20 29l-4-4m33 4 4-4m-17-8v-5" stroke="#a9541a" strokeWidth="2.5" strokeLinecap="round" />
          <path d="M24 36a12 12 0 0 1 24 0z" fill="#f59c24" />
          <path d="M0 58h120v22H0z" fill="#f6bc78" />
          <path d="M48 53c0 13 8 20 20 20s20-7 20-20" fill="#7865d8" />
          <ellipse cx="68" cy="53" rx="20" ry="6" fill="#fff8e8" />
          <path d="m79 52 14-13" stroke="#5b568c" strokeWidth="3" strokeLinecap="round" />
          <path d="M58 53h1m7-2h1m7 3h1" stroke="#b06b2b" strokeWidth="3" strokeLinecap="round" />
        </>
      ) : part === "afternoon" ? (
        <>
          <circle cx="27" cy="21" r="10" fill="#ffb52e" />
          <path d="M27 5V2m0 38v-3M11 21H8m38 0h-3m-4-12 2-2M15 33l-2 2m26-2 2 2M15 9l-2-2" stroke="#ae651a" strokeWidth="2" strokeLinecap="round" />
          <path d="M0 57q35-18 68 0 27 10 52-2v25H0z" fill="#9cd598" />
          <path d="M77 49c-1 10-18 6-17 17" fill="none" stroke="#39376e" strokeWidth="2" strokeLinecap="round" />
          <path d="m81 15 17 14-21 20-12-20z" fill="#7356d7" />
          <path d="m81 15-4 34 21-20z" fill="#f37197" />
        </>
      ) : part === "evening" ? (
        <>
          <circle cx="29" cy="36" r="12" fill="#f78c48" />
          <path d="M0 40q23-8 49 3t71 1v36H0z" fill="#a58cba" />
          <path d="M0 57h120v23H0z" fill="#cf9b88" />
          <ellipse cx="70" cy="59" rx="23" ry="12" fill="#fff6e7" stroke="#685496" strokeWidth="2.5" />
          <path d="M61 61c-3-4 2-8 7-5s7 5 2 8-7 0-9-3z" fill="#d88342" />
          <path d="M77 55h1m3 4h1m-5 3h1" stroke="#5d995f" strokeWidth="3" strokeLinecap="round" />
          <path d="M40 51v16m-3-16v5h6v-5m57 0v16" stroke="#65517a" strokeWidth="2" strokeLinecap="round" />
        </>
      ) : (
        <>
          <path d="M37 11a13 13 0 1 0 10 19 14 14 0 0 1-10-19z" fill="#ffe299" />
          <path d="M61 14h0m25 8h0m16-11h0m-2 24h0m-45-3h0" stroke="#f4e7ff" strokeWidth="3" strokeLinecap="round" />
          <path d="M0 64h120v16H0z" fill="#4b4582" />
          <path d="M43 64V45m54 10v14m-54 0v-9h54" fill="none" stroke="#c1a7eb" strokeWidth="4" strokeLinecap="round" />
          <rect x="45" y="51" width="18" height="9" rx="4.5" fill="#fff5ff" />
          <path d="M63 54q9-11 22-6 10 3 11 12H63z" fill="#8e7def" />
        </>
      )}
    </svg>
  );
}

export function TimeStrip({ strip, fill }: { strip: TimeStripAsset; fill?: QuestionOption }) {
  const title = strip.kind === "calendar" ? strip.title : undefined;
  return (
    <div className="time-strip">
      {title ? <p className="time-strip-title">{title}</p> : null}
      <ol className="time-strip-cells" role="list" aria-label={title ?? copy.timeSequence}>
        {strip.kind === "day-parts" ? strip.cells.map((cell, index) => {
          const part = cell ?? fill?.dayPart;
          return (
            <li key={index} aria-label={part ? undefined : copy.missingTime} className={part ? "time-cell day-cell" : "time-cell is-gap day-cell"}>
              {part ? (
                <>
                  <DayScene part={part} />
                  <span>{part}</span>
                </>
              ) : <span aria-hidden>?</span>}
            </li>
          );
        }) : strip.cells.map((cell, index) => {
          const label = cell ?? fill?.label;
          const marked = strip.marked === index;
          return (
            <li key={index} aria-label={marked && label ? copy.timeSequenceStart(label) : label == null ? copy.missingTime : undefined} className={`time-cell${marked ? " is-start" : ""}${label == null ? " is-gap" : ""}`}>
              {label ?? <span aria-hidden>?</span>}
            </li>
          );
        })}
      </ol>
    </div>
  );
}
