import { useEffect, useRef, useState } from "react";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  Clock,
  Flame,
  Home,
  Lightbulb,
  ListChecks,
  RotateCcw,
  Star,
  Trophy,
  X,
} from "lucide-react";
import type { Activity, Question } from "../types/activity";
import type { ActivityAttempt } from "../types/progress";
import { emptyAnswerFor, hasProvidedAnswer, isAnswerCorrect } from "../lib/answers";
import { scoreAttempt } from "../lib/mastery";
import { realizeActivity } from "../lib/realize";
import { copy } from "../data/copy";
import { spokenPrompt } from "../lib/narration";
import { subjectTheme } from "../data/subjects";
import { useNarration } from "../hooks/useNarration";
import { ConfettiBurst } from "./ConfettiBurst";
import { HearButton, SpokenWords } from "./ReadAloud";
import { Pip } from "./mascot/Pip";
import { usePipMood } from "./PipMood";
import { QuestionView } from "./questions/QuestionView";

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
  const [playQuestions, setPlayQuestions] = useState<Question[]>(activity.questions);
  const [phase, setPhase] = useState<Phase>("intro");
  const [index, setIndex] = useState(0);
  const [answer, setAnswer] = useState<unknown>(null);
  const [startedAt, setStartedAt] = useState(() => new Date().toISOString());
  const [firstResults, setFirstResults] = useState<Record<string, boolean>>({});
  const [missed, setMissed] = useState<string[]>([]);
  const [retryQueue, setRetryQueue] = useState<string[]>([]);
  const [activeQueue, setActiveQueue] = useState<string[]>(() =>
    activity.questions.map((question) => question.id),
  );
  const [showHint, setShowHint] = useState(false);
  const [lastCorrect, setLastCorrect] = useState<boolean | null>(null);
  const [confettiBurst, setConfettiBurst] = useState(0);
  const [isRetry, setIsRetry] = useState(false);
  const [streak, setStreak] = useState(0);
  const { setMood } = usePipMood();
  const promptRef = useRef<HTMLHeadingElement>(null);

  const theme = subjectTheme(activity.subject);
  const ThemeIcon = theme.icon;

  const currentId = activeQueue[index];
  const question = playQuestions.find((item) => item.id === currentId);
  const speech = useNarration(`${currentId ?? "none"}:${phase}`);
  const total = playQuestions.length;
  const firstCorrect = Object.values(firstResults).filter(Boolean).length;
  const mastered = total > 0 && firstCorrect / total >= activity.masteryThreshold;

  const view = useRef({ phase, question, answer, mastered, onExit });
  view.current = { phase, question, answer, mastered, onExit };

  function begin() {
    const realized = realizeActivity(activity);
    const first = realized.questions[0];
    setPlayQuestions(realized.questions);
    setActiveQueue(realized.questions.map((item) => item.id));
    setIndex(0);
    setAnswer(first ? emptyAnswerFor(first) : null);
    setFirstResults({});
    setMissed([]);
    setRetryQueue([]);
    setShowHint(false);
    setLastCorrect(null);
    setConfettiBurst(0);
    setIsRetry(false);
    setStreak(0);
    setStartedAt(new Date().toISOString());
    setPhase("question");
  }

  function checkAnswer() {
    if (!question) return;
    const correct = isAnswerCorrect(question, answer);
    setLastCorrect(correct);
    setStreak((prev) => (correct ? prev + 1 : 0));
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
      const nextQuestion = playQuestions.find((item) => item.id === activeQueue[nextIndex]);
      setIndex(nextIndex);
      setAnswer(nextQuestion ? emptyAnswerFor(nextQuestion) : null);
      setShowHint(false);
      setLastCorrect(null);
      setPhase("question");
      return;
    }

    if (retryQueue.length > 0) {
      const retryIds = [...retryQueue];
      const firstRetry = playQuestions.find((item) => item.id === retryIds[0]);
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
    else if (phase === "feedback") setMood(lastCorrect ? "cheer" : "think");
    else setMood("happy");
  }, [phase, lastCorrect, mastered, setMood]);

  useEffect(() => {
    return () => setMood("happy");
  }, [setMood]);

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "auto" });
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

      if (
        typing ||
        currentPhase !== "question" ||
        (currentQuestion?.kind !== "multiple-choice" && currentQuestion?.kind !== "count-objects")
      ) {
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

  /* ——— Intro ——— */
  if (phase === "intro") {
    return (
      <main className="page page-quest quest-intro-page">
        <section className="quest-intro">
          <button type="button" className="back-link" onClick={onExit}>
            <ArrowLeft size={17} aria-hidden /> {copy.allQuests}
          </button>
          <div className="intro-tile-row">
            <span
              className="context-tile"
              style={{ background: `linear-gradient(135deg, ${theme.color}, ${theme.color}CC)` }}
              aria-hidden
            >
              <ThemeIcon />
            </span>
            <div>
              <h1 className="t-title">{activity.title}</h1>
            </div>
          </div>
          <p className="t-body quest-intro-summary">{activity.summary}</p>
          <div className="intro-facts">
            <span className="fact-pill">
              <ListChecks size={15} aria-hidden /> {copy.questionsFact(total)}
            </span>
            <span className="fact-pill">
              <Clock size={15} aria-hidden /> {copy.minutesFact(activity.estimatedMinutes)}
            </span>
            <span className="fact-pill">
              <Star size={15} aria-hidden /> {copy.starsFact}
            </span>
          </div>
          <div className="quest-intro-pip">
            <span aria-hidden>
              <Pip size={72} mood="cheer" />
            </span>
            <p className="sidekick-bubble">{copy.introCheer(learnerName)}</p>
          </div>
          <button type="button" className="btn btn-primary btn-block" onClick={begin}>
            {copy.startQuest} <ArrowRight size={19} aria-hidden />
          </button>
        </section>
      </main>
    );
  }

  /* ——— Summary ——— */
  if (phase === "summary") {
    const perfect = missed.length === 0;
    const stars = perfect ? 3 : mastered ? 2 : firstCorrect > 0 ? 1 : 0;
    return (
      <main className="page page-quest">
        {mastered ? <ConfettiBurst burstId={1} intensity="shower" /> : null}
        <section className="card score-block">
          <Pip size={112} mood={mastered ? "cheer" : "happy"} />
          <div className="stars-row" role="img" aria-label={copy.starsAria(stars)}>
            {[0, 1, 2].map((slot) => (
              <span key={slot} className={`star${slot < stars ? " is-lit" : ""}`}>
                <Star size={30} fill={slot < stars ? "currentColor" : "none"} aria-hidden />
              </span>
            ))}
          </div>
          <h1 className="t-title">
            {copy.summaryTitle(learnerName, mastered)}
          </h1>
          <p className="score-figure">
            {firstCorrect}
            <small> / {total}</small>
          </p>
          <p className="t-body">
            {mastered
              ? perfect
                ? copy.summaryPerfect
                : copy.summaryMastered
              : copy.summaryAgain}
          </p>
          {mastered ? (
            <p className="status-pill is-done">
              <Trophy size={14} aria-hidden /> {copy.questComplete}
            </p>
          ) : null}
          <div className="score-actions">
            {mastered ? (
              <>
                <button type="button" className="btn btn-primary btn-block" onClick={onExit}>
                  <Home size={18} aria-hidden /> {copy.backToQuests}
                </button>
                <button type="button" className="btn btn-secondary btn-block" onClick={begin}>
                  <RotateCcw size={17} aria-hidden /> {copy.playAgain}
                </button>
              </>
            ) : (
              <>
                <button type="button" className="btn btn-primary btn-block" onClick={begin}>
                  <RotateCcw size={17} aria-hidden /> {copy.tryAgain}
                </button>
                <button type="button" className="btn btn-secondary btn-block" onClick={onExit}>
                  <Home size={18} aria-hidden /> {copy.backToQuests}
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
      <main className="page page-quest">
        <p className="t-body" role="alert">
          {copy.emptyActivity}
        </p>
      </main>
    );
  }

  /* ——— Question / feedback ——— */
  const reveal = phase === "feedback" ? (lastCorrect ? "correct" : "incorrect") : null;
  const position = Math.min(index + 1, activeQueue.length);
  const primaryAction =
    phase === "question" ? (
      <button
        type="button"
        className="btn btn-primary btn-block"
        disabled={!hasProvidedAnswer(question, answer)}
        onClick={checkAnswer}
      >
        {copy.checkIt} <Check size={19} aria-hidden />
      </button>
    ) : (
      <button type="button" className="btn btn-primary btn-block" onClick={goNext}>
        {position === activeQueue.length && retryQueue.length === 0
          ? copy.seeMyStars
          : copy.nextQuestion}{" "}
        <ArrowRight size={19} aria-hidden />
      </button>
    );

  return (
    <main className="page page-quest page-with-dock">
      <ConfettiBurst burstId={confettiBurst} intensity="pop" />

      {/* Where am I? — activity context + segmented progress */}
      <section className="context-card" aria-label={copy.progressLabel}>
        <div className="quest-inner">
          <div className="context-top">
            <span
              className="context-tile"
              style={{ background: `linear-gradient(135deg, ${theme.color}, ${theme.color}CC)` }}
              aria-hidden
            >
              <ThemeIcon />
            </span>
            <div style={{ minWidth: 0, flex: 1 }}>
              <p className="context-title" style={{ fontSize: 21 }}>
                {activity.title}
              </p>
              <p className="context-sub">
                {copy.questionOf(position, activeQueue.length)}
                {isRetry ? copy.anotherGo : ""}
              </p>
            </div>
            <button type="button" className="exit-btn" onClick={onExit} aria-label={copy.exitQuest}>
              <X size={20} aria-hidden />
            </button>
          </div>

          <div>
            <div
              className="seg-bar"
              role="progressbar"
              aria-valuemin={0}
              aria-valuemax={activeQueue.length}
              aria-valuenow={index + (phase === "feedback" ? 1 : 0)}
              aria-valuetext={copy.questionOf(position, activeQueue.length)}
            >
              {activeQueue.map((id, slot) => {
                const done = slot < index || (slot === index && phase === "feedback");
                const current = slot === index && phase !== "feedback";
                return (
                  <span
                    key={id}
                    className={`seg${done ? " is-done" : ""}${current ? " is-current" : ""}`}
                  >
                    {done ? <span className="seg-fill" /> : null}
                  </span>
                );
              })}
            </div>
          </div>

          {streak >= 2 && phase !== "feedback" ? (
            <div className="streak-row">
              <span className="streak-fire">
                <Flame size={15} aria-hidden /> {copy.streak(streak)}
              </span>
            </div>
          ) : null}
        </div>
      </section>

      <div className="quest-rainbow" aria-hidden />

      {isRetry && phase === "question" ? (
        <p className="retry-note" role="status">
          <RotateCcw size={15} aria-hidden /> {copy.retryNote}
        </p>
      ) : null}

      <div className="play-grid">
        <section key={question.id} className="card question-card" aria-label={`Question ${position}`}>
          <div className="quest-inner">
          <div className="q-head">
            <span className="q-num" aria-hidden>
              {position}
            </span>
            <h1 ref={promptRef} tabIndex={-1} className="q-prompt">
              <SpokenWords
                display={question.prompt}
                spoken={spokenPrompt(question)}
                charIndex={speech.playing ? speech.charIndex : -1}
              />
              {speech.available ? (
                <HearButton
                  playing={speech.playing}
                  onClick={() => {
                    if (speech.playing) {
                      speech.stop();
                      return;
                    }
                    speech.play(spokenPrompt(question));
                  }}
                />
              ) : null}
            </h1>
          </div>

          <QuestionView
            question={question}
            answer={answer}
            disabled={phase === "feedback"}
            reveal={reveal}
            onChange={setAnswer}
          />

          {phase === "question" && question.hint ? (
            <div className="hint-zone">
              {showHint ? (
                <p className="hint-card" role="note">
                  <span className="hint-icon" aria-hidden>
                    <Lightbulb size={17} />
                  </span>
                  <span className="hint-text">{question.hint}</span>
                </p>
              ) : (
                <button type="button" className="btn-text" onClick={() => setShowHint(true)}>
                  <Lightbulb size={16} aria-hidden /> {copy.needHint}
                </button>
              )}
            </div>
          ) : null}

          {phase === "feedback" ? (
            <div
              className={`feedback ${lastCorrect ? "is-correct" : "is-wrong"}`}
              role="status"
            >
              <span className="feedback-icon" aria-hidden>
                {lastCorrect ? <Check size={22} /> : <X size={22} />}
              </span>
              <div style={{ display: "grid", gap: 4, minWidth: 0 }}>
                <p className="feedback-title">
                  {lastCorrect ? copy.feedbackCorrect : copy.feedbackWrong}
                </p>
                <p>{question.explanation}</p>
              </div>
              <span className="feedback-pip" aria-hidden>
                <Pip size={56} mood={lastCorrect ? "cheer" : "think"} />
              </span>
            </div>
          ) : null}

          <div className="quest-actions-inline">{primaryAction}</div>
          </div>
        </section>
      </div>

      <div className="quest-dock" role="region" aria-label="Answer actions">
        <div className="quest-dock-inner">{primaryAction}</div>
      </div>
    </main>
  );
}