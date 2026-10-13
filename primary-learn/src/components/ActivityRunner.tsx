import { useMemo, useState } from "react";
import type { Activity } from "../types/activity";
import type { ActivityAttempt } from "../types/progress";
import { emptyAnswerFor, hasProvidedAnswer, isAnswerCorrect } from "../lib/answers";
import { scoreAttempt } from "../lib/mastery";
import { ACTIVITY_TYPE_LABELS, SUBJECT_LABELS, formatYearGroups, ABILITY_LABELS } from "../data/labels";
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
  const answeredCount = Object.keys(results).length;
  const correctCount = Object.values(results).filter(Boolean).length;
  const progressRatio =
    activeQueue.length === 0 ? 0 : Math.min(1, (index + (phase === "feedback" ? 1 : 0)) / activeQueue.length);

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
      <main className="mx-auto grid min-h-screen w-full max-w-3xl content-start gap-6 px-5 py-8">
        <button
          type="button"
          onClick={onExit}
          className="w-fit rounded-full border border-[var(--line)] bg-white px-4 py-2 text-sm font-bold text-[var(--muted)]"
        >
          ← Back home
        </button>
        <section className="rise-in rounded-[28px] border border-[var(--line)] bg-white p-6 shadow-[var(--shadow)] sm:p-8">
          <p className="mb-2 text-sm font-bold tracking-wide text-[var(--sky-deep)] uppercase">
            {SUBJECT_LABELS[activity.subject]} · {ACTIVITY_TYPE_LABELS[activity.type]}
          </p>
          <h1 className="mb-3 text-4xl text-[var(--brand-deep)]">{activity.title}</h1>
          <p className="mb-6 text-[var(--muted)]">{activity.summary}</p>
          <dl className="mb-8 grid gap-3 text-sm sm:grid-cols-2">
            <div className="rounded-2xl bg-[var(--paper)] px-4 py-3">
              <dt className="text-[var(--muted)]">Year</dt>
              <dd className="font-bold">{formatYearGroups(activity.yearGroups)}</dd>
            </div>
            <div className="rounded-2xl bg-[var(--paper)] px-4 py-3">
              <dt className="text-[var(--muted)]">Ability</dt>
              <dd className="font-bold">{ABILITY_LABELS[activity.ability]}</dd>
            </div>
            <div className="rounded-2xl bg-[var(--paper)] px-4 py-3">
              <dt className="text-[var(--muted)]">About</dt>
              <dd className="font-bold">{activity.estimatedMinutes} minutes · {activity.questions.length} questions</dd>
            </div>
            <div className="rounded-2xl bg-[var(--paper)] px-4 py-3">
              <dt className="text-[var(--muted)]">Mastery</dt>
              <dd className="font-bold">{Math.round(activity.masteryThreshold * 100)}% to master</dd>
            </div>
          </dl>
          <p className="mb-6 text-sm text-[var(--muted)]">{activity.curriculumRef}</p>
          <button
            type="button"
            onClick={begin}
            className="min-h-14 w-full rounded-2xl bg-[var(--brand)] px-6 text-lg font-extrabold text-white sm:w-auto"
          >
            Let’s go, {learnerName}!
          </button>
        </section>
      </main>
    );
  }

  if (phase === "summary") {
    const percent = Math.round((correctCount / activity.questions.length) * 100);
    const mastered = percent / 100 >= activity.masteryThreshold;
    return (
      <main className="mx-auto grid min-h-screen w-full max-w-3xl content-center px-5 py-10">
        <section className="rise-in rounded-[28px] border border-[var(--line)] bg-white p-6 text-center shadow-[var(--shadow)] sm:p-10">
          <p className="mb-2 text-sm font-bold tracking-wide text-[var(--brand)] uppercase">
            {mastered ? "Mastered" : "Nice practise"}
          </p>
          <h1 className="mb-3 text-4xl text-[var(--brand-deep)]">
            {mastered ? `Brilliant work, ${learnerName}!` : `Good effort, ${learnerName}`}
          </h1>
          <p className="mb-8 text-[var(--muted)]">
            You got {correctCount} of {activity.questions.length} correct ({percent}%).
          </p>
          <div className="mx-auto mb-8 grid h-36 w-36 place-items-center rounded-full bg-[var(--brand-soft)] text-4xl font-extrabold text-[var(--brand-deep)]">
            {percent}%
          </div>
          <div className="flex flex-wrap justify-center gap-3">
            <button
              type="button"
              onClick={begin}
              className="min-h-12 rounded-2xl border-2 border-[var(--brand)] px-5 font-bold text-[var(--brand-deep)]"
            >
              Try again
            </button>
            <button
              type="button"
              onClick={onExit}
              className="min-h-12 rounded-2xl bg-[var(--brand)] px-5 font-bold text-white"
            >
              Back home
            </button>
          </div>
        </section>
      </main>
    );
  }

  if (!question) {
    return (
      <main className="mx-auto grid min-h-screen place-items-center px-5">
        <p role="alert">This activity has no questions yet.</p>
        <button type="button" onClick={onExit} className="mt-4 font-bold text-[var(--brand)]">
          Back home
        </button>
      </main>
    );
  }

  return (
    <main className="mx-auto grid min-h-screen w-full max-w-3xl content-start gap-5 px-5 py-6">
      <div className="flex items-center justify-between gap-3">
        <button
          type="button"
          onClick={onExit}
          className="rounded-full border border-[var(--line)] bg-white px-4 py-2 text-sm font-bold text-[var(--muted)]"
        >
          ← Exit
        </button>
        <p className="text-sm font-bold text-[var(--muted)]">
          {Math.min(index + 1, activeQueue.length)} / {activeQueue.length}
          {retryQueue.length === 0 && answeredCount >= activity.questions.length ? " · retry" : ""}
        </p>
      </div>

      <div
        className="h-3 overflow-hidden rounded-full bg-white/80"
        role="progressbar"
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={Math.round(progressRatio * 100)}
      >
        <div
          className="h-full origin-left rounded-full bg-[var(--brand)] transition-transform duration-500"
          style={{ transform: `scaleX(${progressRatio})` }}
        />
      </div>

      <section className="rise-in rounded-[28px] border border-[var(--line)] bg-white p-5 shadow-[var(--shadow)] sm:p-8">
        <h1 className="mb-6 text-2xl text-[var(--brand-deep)] sm:text-3xl">{question.prompt}</h1>
        <QuestionView
          question={question}
          answer={answer}
          disabled={phase === "feedback"}
          onChange={setAnswer}
        />

        {phase === "question" && question.hint ? (
          <div className="mt-5">
            {showHint ? (
              <p className="rounded-xl bg-[var(--sun-soft)] px-4 py-3 text-[var(--muted)]">{question.hint}</p>
            ) : (
              <button
                type="button"
                onClick={() => setShowHint(true)}
                className="text-sm font-bold text-[var(--sky-deep)] underline-offset-2 hover:underline"
              >
                Need a hint?
              </button>
            )}
          </div>
        ) : null}

        {phase === "feedback" ? (
          <div
            className={`pop-in mt-6 rounded-2xl px-4 py-4 ${
              lastCorrect ? "bg-[var(--brand-soft)] text-[var(--good)]" : "bg-[#fde8e5] text-[var(--bad)]"
            }`}
            role="status"
          >
            <p className="mb-1 font-extrabold">{lastCorrect ? "Yes!" : "Not quite"}</p>
            <p className="text-[var(--ink)]">{question.explanation}</p>
          </div>
        ) : null}

        <div className="mt-7">
          {phase === "question" ? (
            <button
              type="button"
              disabled={!hasProvidedAnswer(question, answer)}
              onClick={checkAnswer}
              className="min-h-14 w-full rounded-2xl bg-[var(--brand)] px-6 text-lg font-extrabold text-white disabled:opacity-45"
            >
              Check
            </button>
          ) : (
            <button
              type="button"
              onClick={goNext}
              className="min-h-14 w-full rounded-2xl bg-[var(--brand)] px-6 text-lg font-extrabold text-white"
            >
              Continue
            </button>
          )}
        </div>
      </section>
    </main>
  );
}
