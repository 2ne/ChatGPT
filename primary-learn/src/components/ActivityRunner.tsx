import { useEffect, useRef, useState, type CSSProperties } from "react";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  Clock,
  Lightbulb,
  ListChecks,
  RotateCcw,
  Star,
  X,
} from "lucide-react";
import type { Activity, Question } from "../types/activity";
import type { ActivityAttempt } from "../types/progress";
import { correctAnswerLabel, emptyAnswerFor, hasProvidedAnswer, isAnswerCorrect } from "../lib/answers";
import { optionNumber } from "../lib/makeTotal";
import { partWholeChoices } from "../lib/partWhole";
import { emptyPickPairAnswer, isPickPairAnswer, togglePickPairTile } from "../lib/pickPair";
import { attemptStars, passedScore, scoreAttempt } from "../lib/mastery";
import { playSound } from "../lib/sound";
import { usePrefersReducedMotion } from "../hooks/usePrefersReducedMotion";
import { realizeActivity } from "../lib/realize";
import { copy } from "../data/copy";
import { spokenPrompt } from "../lib/narration";
import { splitPromptTail } from "../lib/prompt";
import { categoryForNode, DIFFICULTY_LABELS } from "../lib/path";
import { yearColours } from "../lib/yearColours";
import { useNarration } from "../hooks/useNarration";
import { ConfettiBurst } from "./ConfettiBurst";
import { HearButton, SpokenWords } from "./ReadAloud";
import { Pip } from "./mascot/Pip";
import { usePipMood } from "./PipMood";
import { mathsWallpaper } from "./mascot/MathsWallpaper";
import { FlashPeekProvider } from "./questions/flashPeek";
import { QuestionView } from "./questions/QuestionView";
import { BondDemonstration } from "./questions/BondDemonstration";

function sectionBackdrop(pathNode: string): CSSProperties | undefined {
  const category = categoryForNode(pathNode);
  if (!category) return undefined;
  const colours = yearColours(category.year);
  return {
    backgroundColor: colours.soft,
    backgroundImage: mathsWallpaper(category, colours.ink),
  };
}

type ActivityRunnerProps = {
  activity: Activity;
  learnerName: string;
  onExit: () => void;
  onNext: () => void;
  nextLabel: string;
  onComplete: (attempt: ActivityAttempt) => void;
};

type Phase = "intro" | "question" | "feedback" | "summary";

export function ActivityRunner({
  activity,
  learnerName,
  onExit,
  onNext,
  nextLabel,
  onComplete,
}: ActivityRunnerProps) {
  const [playQuestions, setPlayQuestions] = useState<Question[]>(activity.questions);
  const [phase, setPhase] = useState<Phase>("intro");
  const [index, setIndex] = useState(0);
  const [answer, setAnswer] = useState<unknown>(null);
  const [startedAt, setStartedAt] = useState(() => new Date().toISOString());
  const [results, setResults] = useState<Record<string, boolean>>({});
  const [activeQueue, setActiveQueue] = useState<string[]>(() =>
    activity.questions.map((question) => question.id),
  );
  const [showHint, setShowHint] = useState(false);
  const [lastCorrect, setLastCorrect] = useState<boolean | null>(null);
  const [lookAgainCount, setLookAgainCount] = useState(0);
  const [confettiBurst, setConfettiBurst] = useState(0);
  const [, setStreak] = useState(0);
  const { setMood } = usePipMood();
  const promptRef = useRef<HTMLHeadingElement>(null);
  const reducedMotion = usePrefersReducedMotion();

  const currentId = activeQueue[index];
  const question = playQuestions.find((item) => item.id === currentId);
  const backdrop = sectionBackdrop(activity.pathNode);
  const speech = useNarration(`${currentId ?? "none"}:${phase}`);
  const total = playQuestions.length;
  const correctCount = Object.values(results).filter(Boolean).length;
  const mastered = passedScore(correctCount, total);

  const view = useRef({ phase, question, answer, mastered, onExit, onNext });
  view.current = { phase, question, answer, mastered, onExit, onNext };

  function begin() {
    const realized = realizeActivity(activity);
    const first = realized.questions[0];
    setPlayQuestions(realized.questions);
    setActiveQueue(realized.questions.map((item) => item.id));
    setIndex(0);
    setAnswer(first ? emptyAnswerFor(first) : null);
    setResults({});
    setShowHint(false);
    setLastCorrect(null);
    setLookAgainCount(0);
    setConfettiBurst(0);
    setStreak(0);
    setStartedAt(new Date().toISOString());
    setPhase("question");
  }

  function markSound() {
    if (!question || !hasProvidedAnswer(question, answer)) return;
    playSound(isAnswerCorrect(question, answer) ? "correct" : "wrong");
  }

  function checkAnswer() {
    if (!question) return;
    const correct = isAnswerCorrect(question, answer);
    playSound(correct ? "correct" : "wrong");
    setLastCorrect(correct);
    setStreak((prev) => (correct ? prev + 1 : 0));
    setResults((prev) => (question.id in prev ? prev : { ...prev, [question.id]: correct }));
    if (correct) setConfettiBurst((count) => count + 1);
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
      setLookAgainCount(0);
      setPhase("question");
      return;
    }

    const missed = Object.entries(results)
      .filter(([, ok]) => !ok)
      .map(([id]) => id);
    const finishedAt = new Date().toISOString();
    const attempt = scoreAttempt(
      activity.id,
      correctCount,
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
      const active = document.activeElement;
      if (active instanceof HTMLElement && active !== document.body) {
        active.blur();
      }
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
          view.current.onNext();
        }
        return;
      }

      if (
        typing ||
        currentPhase !== "question" ||
        (currentQuestion?.kind !== "multiple-choice" &&
          currentQuestion?.kind !== "count-objects" &&
          currentQuestion?.kind !== "make-total" &&
          currentQuestion?.kind !== "pick-pair" &&
          currentQuestion?.kind !== "part-whole")
      ) {
        return;
      }
      if (currentQuestion.kind === "part-whole") {
        if (event.key < "0" || event.key > "9") return;
        const value = Number(event.key);
        if (!partWholeChoices(currentQuestion).includes(value)) return;
        playSound("tap");
        setAnswer(value);
        return;
      }
      if (currentQuestion.kind === "pick-pair") {
        const tiles = currentQuestion.tiles ?? [];
        const slot = Number(event.key) - 1;
        if (slot < 0 || slot >= tiles.length) return;
        playSound("tap");
        setAnswer((prev: unknown) => {
          const current = isPickPairAnswer(prev) ? prev : emptyPickPairAnswer();
          return togglePickPairTile(current, `t${slot}`);
        });
        return;
      }
      const options = "options" in currentQuestion ? currentQuestion.options : undefined;
      const choice = Number(event.key) - 1;
      if (!options || choice < 0 || choice >= options.length) return;
      playSound("tap");
      if (currentQuestion.kind === "make-total") {
        const value = optionNumber(options[choice]?.label);
        if (value != null) setAnswer(value);
        return;
      }
      setAnswer(options[choice]?.id);
    }

    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  /* ——— Intro ——— */
  if (phase === "intro") {
    return (
      <main className="page page-quest quest-intro-page" style={backdrop}>
        <section className="quest-intro">
          <button type="button" className="back-link" onClick={onExit}>
            <ArrowLeft size={17} aria-hidden /> {copy.allQuests}
          </button>
          <div className="intro-card">
          <div className="intro-scene" aria-hidden>
            <Pip size={144} mood="happy" />
            <span className="intro-scene-floor" />
          </div>
          <div className="intro-card-body">
          <div className="intro-title-block">
            <p className="intro-difficulty">{DIFFICULTY_LABELS[activity.difficulty]}</p>
            <h1 className="t-title">{activity.title}</h1>
          </div>
          <p className="t-body quest-intro-summary">{activity.summary}</p>
          <p className="intro-star-goal"><Star size={18} aria-hidden />{copy.starsFact}</p>
          <div className="intro-facts">
            <span className="fact-pill">
              <ListChecks size={15} aria-hidden /> {copy.questionsFact(total)}
            </span>
            <span className="fact-pill">
              <Clock size={15} aria-hidden /> {copy.minutesFact(activity.estimatedMinutes)}
            </span>
          </div>
          <p className="intro-welcome">{copy.introWelcome(learnerName)}</p>
          <button type="button" className="btn btn-primary btn-block" onClick={begin}>
            {copy.startQuest} <ArrowRight size={19} aria-hidden />
          </button>
          </div>
          </div>
        </section>
      </main>
    );
  }

  /* ——— Summary ——— */
  if (phase === "summary") {
    const stars = attemptStars(correctCount, total);
    return (
      <ResultScreen
        correctCount={correctCount}
        total={total}
        stars={stars}
        reducedMotion={reducedMotion}
        nextLabel={nextLabel}
        backdrop={backdrop}
        onExit={onExit}
        onTryAgain={begin}
        onNext={onNext}
      />
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
  const rightLabel = lastCorrect === false ? correctAnswerLabel(question) : null;
  const reveal = phase === "feedback" ? (lastCorrect ? "correct" : "incorrect") : null;
  const position = Math.min(index + 1, activeQueue.length);
  const promptParts = splitPromptTail(question.prompt);
  const primaryAction =
    phase === "question" ? (
      <button
        type="button"
        className="btn btn-primary btn-block"
        data-sfx="off"
        disabled={!hasProvidedAnswer(question, answer)}
        onPointerDown={(event) => {
          if (event.button !== 0) return;
          markSound();
        }}
        onTouchStart={markSound}
        onClick={checkAnswer}
      >
        {copy.checkIt} <Check size={19} aria-hidden />
      </button>
    ) : (
      <button type="button" className="btn btn-success btn-block" onClick={goNext}>
        {position === activeQueue.length ? copy.seeMyStars : copy.nextQuestion}{" "}
        <ArrowRight size={19} aria-hidden />
      </button>
    );

  return (
    <FlashPeekProvider
      lookAgainCount={lookAgainCount}
      recordLookAgain={() => setLookAgainCount((n) => n + 1)}
    >
    <main className="page page-quest page-with-dock" style={backdrop}>
      <ConfettiBurst burstId={confettiBurst} intensity="pop" />

      <div className="quest-shell">
      {/* Where am I? — quest name + question count */}
      <section className="context-card" aria-label={copy.progressLabel}>
        <div className="quest-inner">
          <div className="context-top">
            <div style={{ minWidth: 0, flex: 1 }}>
              <p className="context-title">{activity.title}</p>
              <p className="context-sub">
                {DIFFICULTY_LABELS[activity.difficulty]} · {copy.questionOf(position, activeQueue.length)}
              </p>
            </div>
            <button type="button" className="exit-btn" onClick={onExit} aria-label={copy.exitQuest}>
              <X size={20} aria-hidden />
            </button>
          </div>
        </div>
      </section>

      <div className="quest-rainbow" aria-hidden />

      <div className="play-grid">
        <section key={question.id} className="card question-card" aria-label={`Question ${position}`}>
          <div className="quest-inner">
          <div className="q-head">
            <span className="q-num" aria-hidden>
              {position}
            </span>
            <h1 ref={promptRef} tabIndex={-1} className="q-prompt">
              <SpokenWords
                display={promptParts.head}
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
              {promptParts.tail ? <span className="q-prompt-tail">{promptParts.tail}</span> : null}
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
                {lastCorrect && lookAgainCount > 0 ? (
                  <p>
                    {lookAgainCount === 1
                      ? copy.lookedAgainOnce
                      : copy.lookedAgainTimes(lookAgainCount)}
                  </p>
                ) : null}
                {lastCorrect ? null : (
                  <>
                    {rightLabel ? (
                      <div className="answer-reveal">
                        <p className="t-body">
                          <strong>
                            {question.kind === "ordered"
                              ? copy.orderLabel
                              : question.kind === "match-pairs"
                                ? copy.pairsLabel
                                : question.kind === "multi-select" || question.kind === "pick-pair"
                                  ? copy.answersLabel
                                  : copy.answerLabel}
                          </strong>
                        </p>
                        <p>{rightLabel}</p>
                      </div>
                    ) : null}
                    <p>{question.explanation}</p>
                  </>
                )}
              </div>
              <span className="feedback-pip" aria-hidden>
                <Pip size={56} mood={lastCorrect ? "cheer" : "think"} />
              </span>
            </div>
          ) : null}

          {phase === "feedback" && lastCorrect === false ? <BondDemonstration key={question.id} question={question} /> : null}

          <div className="quest-actions-inline">{primaryAction}</div>
          </div>
        </section>
      </div>

      <div className="quest-dock" role="region" aria-label="Answer actions">
        <div className="quest-dock-inner">{primaryAction}</div>
      </div>
      </div>
    </main>
    </FlashPeekProvider>
  );
}

function ResultScreen({
  correctCount,
  total,
  stars,
  reducedMotion,
  nextLabel,
  backdrop,
  onExit,
  onTryAgain,
  onNext,
}: {
  correctCount: number;
  total: number;
  stars: number;
  reducedMotion: boolean;
  nextLabel: string;
  backdrop?: CSSProperties;
  onExit: () => void;
  onTryAgain: () => void;
  onNext: () => void;
}) {
  const [confetti, setConfetti] = useState(0);
  const fanfarePlayed = useRef(false);

  useEffect(() => {
    if (fanfarePlayed.current) return;
    fanfarePlayed.current = true;
    playSound(stars >= 3 ? "fanfareBig" : "fanfare");
  }, [stars]);

  useEffect(() => {
    if (stars < 3 || reducedMotion) return;
    const timer = window.setTimeout(() => setConfetti(1), 1100);
    return () => window.clearTimeout(timer);
  }, [stars, reducedMotion]);

  return (
    <main className="page page-quest quest-intro-page" style={backdrop}>
      <ConfettiBurst burstId={confetti} intensity="pop" />
      <section className="quest-intro">
        <button type="button" className="back-link" onClick={onExit}>
          <ArrowLeft size={17} aria-hidden /> {copy.allQuests}
        </button>
        <div
          className={`intro-card result-card${reducedMotion ? " is-still" : ""}`}
          aria-live="polite"
        >
          <div className="intro-scene" aria-hidden>
            <div className="result-pip">
              <Pip size={144} mood={stars > 0 ? "cheer" : "happy"} />
            </div>
            <span className="intro-scene-floor" />
          </div>
          <div className="intro-card-body">
            <div className="result-stars" role="img" aria-label={copy.starsAria(stars)}>
              {[0, 1, 2].map((slot) => (
                <span
                  key={slot}
                  className={`result-star${slot < stars ? " is-lit" : ""}`}
                  style={{ animationDelay: reducedMotion ? "0s" : `${0.4 + slot * 0.28}s` }}
                >
                  <Star
                    size={slot === 1 ? 44 : 36}
                    fill={slot < stars ? "currentColor" : "none"}
                    aria-hidden
                  />
                </span>
              ))}
            </div>
            <h1 className="result-score">{copy.youGot(correctCount, total)}</h1>
            <p className="result-line">{copy.starLine(stars)}</p>
            <div className="result-actions">
              <button type="button" className="btn btn-secondary btn-block" onClick={onTryAgain}>
                <RotateCcw size={17} aria-hidden /> {copy.tryAgain}
              </button>
              <button type="button" className="btn btn-primary btn-block" onClick={onNext}>
                {nextLabel} <ArrowRight size={19} aria-hidden />
              </button>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
