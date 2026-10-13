import { useEffect, useRef, useState } from "react";
import type { Activity } from "../types/activity";
import type { ActivityAttempt } from "../types/progress";
import { emptyAnswerFor, hasProvidedAnswer, isAnswerCorrect } from "../lib/answers";
import { scoreAttempt } from "../lib/mastery";
import { ACTIVITY_TYPE_LABELS, SUBJECT_LABELS, formatYearGroups } from "../data/labels";
import { ConfettiBurst } from "./ConfettiBurst";
import { PipScene } from "./mascot/PipScene";
import { usePipMood } from "./PipMood";
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
  const queue = activity.questions.map((question) => question.id);
  const [phase, setPhase] = useState<Phase>("intro");
  const [index, setIndex] = useState(0);
  const [answer, setAnswer] = useState<unknown>(null);
  const [startedAt, setStartedAt] = useState(() => new Date().toISOString());
  const [firstResults, setFirstResults] = useState<Record<string, boolean>>({});
  const [missed, setMissed] = useState<string[]>([]);
  const [retryQueue, setRetryQueue] = useState<string[]>([]);
  const [activeQueue, setActiveQueue] = useState<string[]>(queue);
  const [showHint, setShowHint] = useState(false);
  const [lastCorrect, setLastCorrect] = useState<boolean | null>(null);
  const [confettiBurst, setConfettiBurst] = useState(0);
  const [isRetry, setIsRetry] = useState(false);
  const { setMood } = usePipMood();
  const promptRef = useRef<HTMLHeadingElement>(null);

  const currentId = activeQueue[index];
  const question = activity.questions.find((item) => item.id === currentId);
  const total = activity.questions.length;
  const firstCorrect = Object.values(firstResults).filter(Boolean).length;
  const mastered = total > 0 && firstCorrect / total >= activity.masteryThreshold;
  const progressRatio =
    activeQueue.length === 0
      ? 0
      : Math.min(1, (index + (phase === "feedback" ? 1 : 0)) / activeQueue.length);

  const view = useRef({
    phase,
    question,
    answer,
    mastered,
    onExit,
  });
  view.current = { phase, question, answer, mastered, onExit };

  function begin() {
    const first = activity.questions[0];
    setActiveQueue(queue);
    setIndex(0);
    setAnswer(first ? emptyAnswerFor(first) : null);
    setFirstResults({});
    setMissed([]);
    setRetryQueue([]);
    setShowHint(false);
    setLastCorrect(null);
    setConfettiBurst(0);
    setIsRetry(false);
    setStartedAt(new Date().toISOString());
    setPhase("question");
  }

  function checkAnswer() {
    if (!question) return;
    const correct = isAnswerCorrect(question, answer);
    setLastCorrect(correct);
    setFirstResults((prev) =>
      question.id in prev ? prev : { ...prev, [question.id]: correct },
    );
    if (correct) {
      setConfettiBurst((count) => count + 1);
    } else {
      setMissed((prev) => (prev.includes(question.id) ? prev : [...prev, question.id]));
      setRetryQueue((prev) => (prev.includes(question.id) ? prev : [...prev, question.id]));
    }
    setPhase("feedback");
  }

  function goNext() {
    if (!question) return;
    const nextIndex = index + 1;
    if (nextIndex < activeQueue.length) {
      const nextQuestion = activity.questions.find((item) => item.id === activeQueue[nextIndex]);
      setIndex(nextIndex);
      setAnswer(nextQuestion ? emptyAnswerFor(nextQuestion) : null);
      setShowHint(false);
      setLastCorrect(null);
      setPhase("question");
      return;
    }

    if (retryQueue.length > 0) {
      const retryIds = [...retryQueue];
      const firstRetry = activity.questions.find((item) => item.id === retryIds[0]);
      setActiveQueue(retryIds);
      setRetryQueue([]);
      setIndex(0);
      setAnswer(firstRetry ? emptyAnswerFor(firstRetry) : null);
      setShowHint(false);
      setLastCorrect(null);
      setIsRetry(true);
      setPhase("question");
      return;
    }

    const finishedAt = new Date().toISOString();
    const attempt = scoreAttempt(
      activity,
      firstCorrect,
      total,
      missed,
      startedAt,
      finishedAt,
    );
    onComplete(attempt);
    setPhase("summary");
  }

  const actions = useRef({ begin, checkAnswer, goNext });
  actions.current = { begin, checkAnswer, goNext };

  useEffect(() => {
    if (phase === "summary") setMood(mastered ? "cheer" : "happy");
    else if (phase === "feedback" && lastCorrect) setMood("cheer");
    else setMood("happy");
  }, [phase, lastCorrect, mastered, setMood]);

  useEffect(() => {
    return () => setMood("happy");
  }, [setMood]);

  useEffect(() => {
    if (phase === "question") {
      promptRef.current?.focus({ preventScroll: true });
    }
  }, [phase, currentId]);

  useEffect(() => {
    function onKey(event: KeyboardEvent) {
      const target = event.target instanceof HTMLElement ? event.target : null;
      const tag = target?.tagName;
      const typing = tag === "INPUT" || tag === "TEXTAREA" || tag === "SELECT";
      const { phase: currentPhase, question: currentQuestion, answer: currentAnswer } =
        view.current;

      if (event.key === "Enter") {
        if (tag === "BUTTON" || tag === "SELECT" || tag === "TEXTAREA") return;
        if (currentPhase === "intro") {
          event.preventDefault();
          actions.current.begin();
        } else if (
          currentPhase === "question" &&
          currentQuestion &&
          hasProvidedAnswer(currentQuestion, currentAnswer)
        ) {
          event.preventDefault();
          actions.current.checkAnswer();
        } else if (currentPhase === "feedback") {
          event.preventDefault();
          actions.current.goNext();
        } else if (currentPhase === "summary") {
          event.preventDefault();
          if (view.current.mastered) view.current.onExit();
          else actions.current.begin();
        }
        return;
      }

      if (typing || currentPhase !== "question" || currentQuestion?.kind !== "multiple-choice") {
        return;
      }
      const choice = Number(event.key) - 1;
      if (choice >= 0 && choice < currentQuestion.options.length) {
        setAnswer(currentQuestion.options[choice].id);
      }
    }

    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  if (phase === "intro") {
    return (
      <main className="page page-narrow page-under-header">
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
    const perfect = missed.length === 0;
    return (
      <main className="page page-narrow page-under-header">
        {mastered ? <ConfettiBurst burstId={1} intensity="shower" /> : null}
        <section className="card score-block">
          <PipScene size={128} mood={mastered ? "cheer" : "happy"} />
          <h1 className="t-title-sm">
            {mastered ? `Great work, ${learnerName}!` : `Nice try, ${learnerName}`}
          </h1>
          <p className="t-title score-figure">{firstCorrect}</p>
          <p className="t-body">out of {total}</p>
          <p className="t-body">
            {mastered
              ? perfect
                ? "You got every one right the first time."
                : "You sorted the tricky ones too."
              : "Try again to make it stick."}
          </p>
          <div className="score-actions">
            {mastered ? (
              <>
                <button type="button" className="btn btn-secondary btn-block" onClick={begin}>
                  Try again
                </button>
                <button type="button" className="btn btn-primary btn-block" onClick={onExit}>
                  Back home
                </button>
              </>
            ) : (
              <>
                <button type="button" className="btn btn-primary btn-block" onClick={begin}>
                  Try again
                </button>
                <button type="button" className="btn btn-secondary btn-block" onClick={onExit}>
                  Back home
                </button>
              </>
            )}
          </div>
        </section>
      </main>
    );
  }

  if (!question) {
    return (
      <main className="page page-narrow page-under-header">
        <p className="t-body" role="alert">
          This activity has no questions yet.
        </p>
      </main>
    );
  }

  const reveal = phase === "feedback" ? (lastCorrect ? "correct" : "incorrect") : null;

  return (
    <main className="page page-narrow page-under-header">
      <ConfettiBurst burstId={confettiBurst} intensity="pop" />

      <div className="progress-meta">
        <p className="t-meta">
          {Math.min(index + 1, activeQueue.length)} of {activeQueue.length}
          {isRetry ? " · another go" : ""}
        </p>
      </div>

      <div className="progress-wrap">
        <div
          className="progress-track"
          role="progressbar"
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={Math.round(progressRatio * 100)}
          aria-valuetext={`${Math.min(index + 1, activeQueue.length)} of ${activeQueue.length}`}
        >
          <div className="progress-fill" style={{ transform: `scaleX(${progressRatio})` }} />
        </div>
        <span
          className="progress-marker"
          style={{ left: `clamp(7px, ${progressRatio * 100}%, calc(100% - 7px))` }}
        />
      </div>

      {isRetry ? (
        <p className="t-body retry-note" role="status">
          Let’s try this one again.
        </p>
      ) : null}

      <section key={question.id} className="card question-card">
        <h1 ref={promptRef} tabIndex={-1} className="t-title-sm">
          {question.prompt}
        </h1>

        <QuestionView
          question={question}
          answer={answer}
          disabled={phase === "feedback"}
          reveal={reveal}
          onChange={setAnswer}
        />

        {phase === "question" && question.hint ? (
          showHint ? (
            <p className="t-body">{question.hint}</p>
          ) : (
            <button type="button" className="btn-text" onClick={() => setShowHint(true)}>
              Need a hint?
            </button>
          )
        ) : null}

        {phase === "feedback" ? (
          <div
            className={`feedback ${lastCorrect ? "is-correct pop-correct" : "is-wrong"}`}
            role="status"
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
