import { useMemo, useState } from "react";
import type { Activity } from "../types/activity";
import type { ActivityAttempt } from "../types/progress";
import { emptyAnswerFor, hasProvidedAnswer, isAnswerCorrect } from "../lib/answers";
import { scoreAttempt } from "../lib/mastery";
import { ACTIVITY_TYPE_LABELS, SUBJECT_LABELS, formatYearGroups } from "../data/labels";
import { QuestionView } from "./QuestionView";

type ActivityRunnerProps = {
  activity: Activity;
  learnerName: string;
  onExit: () => void;
  onComplete: (attempt: ActivityAttempt) => void;
};

type Phase = "intro" | "question" | "feedback" | "summary";

export function ActivityRunner({
  activity,
  learnerName,
  onExit,
  onComplete,
}: ActivityRunnerProps) {
  const queue = useMemo(() => activity.questions.map((q) => q.id), [activity]);
  const [phase, setPhase] = useState<Phase>("intro");
  const [index, setIndex] = useState(0);
  const [answer, setAnswer] = useState<unknown>(null);
  const [startedAt] = useState(() => new Date().toISOString());
  const [results, setResults] = useState<Record<string, boolean>>({});
  const [missed, setMissed] = useState<string[]>([]);
  const [retryQueue, setRetryQueue] = useState<string[]>([]);
  const [activeQueue, setActiveQueue] = useState<string[]>(queue);
  const [showHint, setShowHint] = useState(false);
  const [lastCorrect, setLastCorrect] = useState<boolean | null>(null);

  const currentId = activeQueue[index];
  const question = activity.questions.find((q) => q.id === currentId);
  const correctCount = Object.values(results).filter(Boolean).length;
  const progressRatio =
    activeQueue.length === 0
      ? 0
      : Math.min(1, (index + (phase === "feedback" ? 1 : 0)) / activeQueue.length);

  function begin() {
    const first = activity.questions[0];
    setActiveQueue(queue);
    setIndex(0);
    setAnswer(first ? emptyAnswerFor(first) : null);
    setResults({});
    setMissed([]);
    setRetryQueue([]);
    setShowHint(false);
    setLastCorrect(null);
    setPhase("question");
  }

  function checkAnswer() {
    if (!question) return;
    const correct = isAnswerCorrect(question, answer);
    setLastCorrect(correct);
    setResults((prev) => ({ ...prev, [question.id]: correct }));
    if (!correct) {
      setMissed((prev) => (prev.includes(question.id) ? prev : [...prev, question.id]));
      setRetryQueue((prev) => (prev.includes(question.id) ? prev : [...prev, question.id]));
    }
    setPhase("feedback");
  }

  function goNext() {
    if (!question) return;
    const nextIndex = index + 1;
    if (nextIndex < activeQueue.length) {
      const nextQuestion = activity.questions.find((q) => q.id === activeQueue[nextIndex]);
      setIndex(nextIndex);
      setAnswer(nextQuestion ? emptyAnswerFor(nextQuestion) : null);
      setShowHint(false);
      setLastCorrect(null);
      setPhase("question");
      return;
    }

    if (retryQueue.length > 0) {
      const retryIds = [...retryQueue];
      const firstRetry = activity.questions.find((q) => q.id === retryIds[0]);
      setActiveQueue(retryIds);
      setRetryQueue([]);
      setIndex(0);
      setAnswer(firstRetry ? emptyAnswerFor(firstRetry) : null);
      setShowHint(false);
      setLastCorrect(null);
      setPhase("question");
      return;
    }

    const finishedAt = new Date().toISOString();
    const finalCorrect = Object.values(results).filter(Boolean).length;
    const attempt = scoreAttempt(
      activity,
      finalCorrect,
      activity.questions.length,
      missed,
      startedAt,
      finishedAt,
    );
    onComplete(attempt);
    setPhase("summary");
  }

  if (phase === "intro") {
    return (
      <main className="page page-narrow">
        <button type="button" className="btn-text" onClick={onExit} style={{ marginBottom: 16 }}>
          ← Back
        </button>
        <section className="card" style={{ display: "grid", gap: "var(--space-4)" }}>
          <p className="t-meta">
            {SUBJECT_LABELS[activity.subject]} · {ACTIVITY_TYPE_LABELS[activity.type]} ·{" "}
            {formatYearGroups(activity.yearGroups)}
          </p>
          <div style={{ display: "grid", gap: "var(--space-2)" }}>
            <h1 className="t-title-sm">{activity.title}</h1>
            <p className="t-body">{activity.summary}</p>
          </div>
          <button type="button" className="btn btn-primary btn-block" onClick={begin}>
            Start
          </button>
        </section>
      </main>
    );
  }

  if (phase === "summary") {
    const percent = Math.round((correctCount / activity.questions.length) * 100);
    const mastered = percent / 100 >= activity.masteryThreshold;
    return (
      <main className="page page-narrow">
        <section
          className="card"
          style={{ display: "grid", gap: "var(--space-4)", textAlign: "center" }}
        >
          <h1 className="t-title-sm">
            {mastered ? `Great work, ${learnerName}!` : `Nice try, ${learnerName}`}
          </h1>
          <p className="t-body">
            You got {correctCount} out of {activity.questions.length} right.
          </p>
          <div
            aria-hidden
            style={{
              width: 96,
              height: 96,
              margin: "0 auto",
              borderRadius: "9999px",
              background: mastered ? "var(--green-soft)" : "var(--blue-soft)",
              color: mastered ? "var(--green)" : "var(--blue)",
              display: "grid",
              placeItems: "center",
              fontSize: 28,
              fontWeight: 900,
            }}
          >
            {percent}%
          </div>
          <div
            style={{
              display: "grid",
              gap: "var(--space-3)",
              gridTemplateColumns: "1fr",
            }}
          >
            <button type="button" className="btn btn-secondary btn-block" onClick={begin}>
              Try again
            </button>
            <button type="button" className="btn btn-primary btn-block" onClick={onExit}>
              Back home
            </button>
          </div>
        </section>
      </main>
    );
  }

  if (!question) {
    return (
      <main className="page page-narrow">
        <p className="t-body" role="alert">
          This activity has no questions yet.
        </p>
        <button type="button" className="btn-text" onClick={onExit}>
          Back home
        </button>
      </main>
    );
  }

  return (
    <main className="page page-narrow">
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: "var(--space-3)",
        }}
      >
        <button type="button" className="btn-text" onClick={onExit}>
          ← Exit
        </button>
        <p className="t-meta">
          {Math.min(index + 1, activeQueue.length)} / {activeQueue.length}
        </p>
      </div>

      <div
        className="progress-track"
        role="progressbar"
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={Math.round(progressRatio * 100)}
        style={{ marginBottom: "var(--space-4)" }}
      >
        <div className="progress-fill" style={{ transform: `scaleX(${progressRatio})` }} />
      </div>

      <section className="card" style={{ display: "grid", gap: "var(--space-4)" }}>
        <h1 className="t-title-sm">{question.prompt}</h1>

        <QuestionView
          question={question}
          answer={answer}
          disabled={phase === "feedback"}
          onChange={setAnswer}
        />

        {phase === "question" && question.hint ? (
          showHint ? (
            <p className="t-body">{question.hint}</p>
          ) : (
            <button type="button" className="btn-text" onClick={() => setShowHint(true)} style={{ justifySelf: "start" }}>
              Need a hint?
            </button>
          )
        ) : null}

        {phase === "feedback" ? (
          <div
            className={`feedback ${lastCorrect ? "is-correct" : "is-wrong"}`}
            role="status"
            style={{ marginTop: 0 }}
          >
            <p className="feedback-title">{lastCorrect ? "Correct" : "Not quite"}</p>
            <p>{question.explanation}</p>
          </div>
        ) : null}

        {phase === "question" ? (
          <button
            type="button"
            className="btn btn-primary btn-block"
            disabled={!hasProvidedAnswer(question, answer)}
            onClick={checkAnswer}
          >
            Check
          </button>
        ) : (
          <button type="button" className="btn btn-primary btn-block" onClick={goNext}>
            Continue
          </button>
        )}
      </section>
    </main>
  );
}
