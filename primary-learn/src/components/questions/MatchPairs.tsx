import { useEffect, useMemo, useRef, useState, type CSSProperties } from "react";
import { copy } from "../../data/copy";
import { matchSideKey, matchSideLabel, matchSideVisual } from "../../lib/matchSide";
import { markForPair, matchPairsMode, seededOrder, type MatchPairMark } from "../../lib/matchPairs";
import { playSound } from "../../lib/sound";
import type { MatchPairsQuestion, MatchSide } from "../../types/activity";
import { usePrefersReducedMotion } from "../../hooks/usePrefersReducedMotion";
import { ObjectGroup } from "./ObjectGroup";
import type { Reveal } from "./choice";
import { ShapePicture } from "./ShapePicture";

export type QuestionPlayControl = {
  canConfirm: boolean;
  confirm: () => void;
};

type MatchPairsProps = {
  question: MatchPairsQuestion;
  answer: unknown;
  disabled?: boolean;
  reveal: Reveal;
  onChange: (value: unknown) => void;
  onPlayControl?: (control: QuestionPlayControl | null) => void;
};

type FlipCard = {
  id: string;
  pairId: string;
  content: MatchSide;
};

function SideView({ side }: { side: MatchSide }) {
  const visual = matchSideVisual(side);
  const label = typeof side === "string" ? side : side.label;
  const layout = typeof side === "string" ? undefined : side.layout;
  const shape = typeof side === "string" ? undefined : side.shape;
  return (
    <span className="option-content">
      {shape ? <ShapePicture shape={shape} compact /> : null}
      {visual ? <ObjectGroup visual={visual} compact pack layout={layout} /> : null}
      {label ? <span>{label}</span> : null}
      {!visual && !shape && !label ? matchSideLabel(side) : null}
    </span>
  );
}

function PairMark({ mark }: { mark: MatchPairMark }) {
  return (
    <span className="match-pair-mark" aria-hidden>
      {mark.id === "star" ? "★" : null}
      {mark.id === "heart" ? "♥" : null}
      {mark.id === "moon" ? "☾" : null}
      {mark.id === "sun" ? "☀" : null}
      {mark.id === "leaf" ? "🍃" : null}
      {mark.id === "drop" ? "💧" : null}
    </span>
  );
}

function answerMap(
  question: MatchPairsQuestion,
  answer: unknown,
): Record<string, string> {
  if (answer && typeof answer === "object") return { ...(answer as Record<string, string>) };
  return Object.fromEntries(question.pairs.map((pair) => [pair.id, ""]));
}

function FlipCardButton({
  card,
  index,
  faceUp,
  found,
  mark,
  disabled,
  onTap,
}: {
  card: FlipCard;
  index: number;
  faceUp: boolean;
  found: boolean;
  mark?: MatchPairMark;
  disabled?: boolean;
  onTap: () => void;
}) {
  const label = matchSideLabel(card.content);
  const number = index + 1;
  const aria = faceUp
    ? found
      ? copy.cardShowsFound(number, label)
      : copy.cardShows(number, label)
    : copy.cardFaceDown(number);
  const style = found && mark
    ? ({ "--pair-tint": mark.tint, "--pair-ink": mark.ink } as CSSProperties)
    : undefined;
  return (
    <button
      type="button"
      className={`match-card${faceUp ? " is-up" : ""}${found ? " is-found" : ""}`}
      style={style}
      disabled={disabled}
      aria-label={aria}
      onClick={onTap}
    >
      <span className="match-card-inner">
        <span className="match-card-face match-card-back">
          <span className="match-card-back-mark" aria-hidden>
            ?
          </span>
        </span>
        <span className="match-card-face match-card-front">
          {found && mark ? <PairMark mark={mark} /> : null}
          <SideView side={card.content} />
        </span>
      </span>
    </button>
  );
}

function FlipMatch({
  question,
  map,
  disabled,
  reveal,
  onChange,
}: {
  question: MatchPairsQuestion;
  map: Record<string, string>;
  disabled?: boolean;
  reveal: Reveal;
  onChange: (value: unknown) => void;
}) {
  const reducedMotion = usePrefersReducedMotion();
  const review = Boolean(disabled && reveal);
  const cards = useMemo(
    () =>
      seededOrder(
        question.pairs.flatMap((pair) => [
          { id: `${pair.id}:L`, pairId: pair.id, content: pair.left },
          { id: `${pair.id}:R`, pairId: pair.id, content: pair.right },
        ]),
        question.id,
      ),
    [question],
  );
  const marks = useMemo(
    () => Object.fromEntries(question.pairs.map((pair, index) => [pair.id, markForPair(index)])),
    [question],
  );
  const [preview, setPreview] = useState(!review);
  const [peek, setPeek] = useState(false);
  const [picked, setPicked] = useState<string[]>([]);
  const [locked, setLocked] = useState(false);
  const timers = useRef<number[]>([]);

  function clearTimers() {
    for (const id of timers.current) window.clearTimeout(id);
    timers.current = [];
  }

  useEffect(() => {
    return () => clearTimers();
  }, []);

  useEffect(() => {
    if (review) {
      setPreview(false);
      setPeek(false);
      return;
    }
    setPreview(true);
    setPeek(false);
    setPicked([]);
    setLocked(false);
    clearTimers();
    const wait = reducedMotion ? 400 : 3000;
    const timer = window.setTimeout(() => setPreview(false), wait);
    timers.current.push(timer);
    return () => window.clearTimeout(timer);
  }, [question.id, review, reducedMotion]);

  const foundIds = new Set(
    question.pairs
      .filter((pair) => map[pair.id] === matchSideKey(pair.right))
      .map((pair) => pair.id),
  );

  function showAllAgain() {
    if (preview || locked || disabled) return;
    setPeek(true);
    setPicked([]);
    const wait = reducedMotion ? 400 : 3000;
    const timer = window.setTimeout(() => setPeek(false), wait);
    timers.current.push(timer);
  }

  function tapCard(card: FlipCard) {
    if (disabled || preview || peek || locked) return;
    if (foundIds.has(card.pairId)) return;
    if (picked.includes(card.id)) return;
    playSound("tap");
    const next = [...picked, card.id];
    if (next.length < 2) {
      setPicked(next);
      return;
    }
    setPicked(next);
    const first = cards.find((item) => item.id === next[0]);
    const second = cards.find((item) => item.id === next[1]);
    if (!first || !second) {
      setPicked([]);
      return;
    }
    if (first.pairId === second.pairId) {
      const pair = question.pairs.find((item) => item.id === first.pairId);
      if (pair) {
        const updated = { ...map, [pair.id]: matchSideKey(pair.right) };
        onChange(updated);
      }
      setPicked([]);
      return;
    }
    setLocked(true);
    const wait = reducedMotion ? 350 : 1000;
    const timer = window.setTimeout(() => {
      setPicked([]);
      setLocked(false);
    }, wait);
    timers.current.push(timer);
  }

  const looking = preview || peek;
  return (
    <div className="match-flip">
      <p className="t-body">{looking ? copy.rememberCards : copy.tapTwoCards}</p>
      <div
        className={`match-flip-grid pairs-${question.pairs.length}`}
        role="group"
        aria-label={copy.matchCards}
      >
        {cards.map((card, index) => {
          const found = foundIds.has(card.pairId);
          const faceUp = review || looking || found || picked.includes(card.id);
          return (
            <FlipCardButton
              key={card.id}
              card={card}
              index={index}
              faceUp={faceUp}
              found={found}
              mark={marks[card.pairId]}
              disabled={disabled || preview || peek || locked || found}
              onTap={() => tapCard(card)}
            />
          );
        })}
      </div>
      {review ? null : (
        <button
          type="button"
          className="btn-text match-peek"
          disabled={disabled || preview || peek || locked}
          onClick={showAllAgain}
        >
          {copy.showTheCards}
        </button>
      )}
    </div>
  );
}

function OneAtATime({
  question,
  map,
  disabled,
  reveal,
  onChange,
  onPlayControl,
}: {
  question: MatchPairsQuestion;
  map: Record<string, string>;
  disabled?: boolean;
  reveal: Reveal;
  onChange: (value: unknown) => void;
  onPlayControl?: (control: QuestionPlayControl | null) => void;
}) {
  const reducedMotion = usePrefersReducedMotion();
  const review = Boolean(disabled && reveal);
  const current = question.pairs[0];
  const done = Boolean(current && map[current.id]);
  const [picked, setPicked] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const confirmRef = useRef<() => void>(() => {});

  const choices = useMemo(() => {
    const sides = question.choices ?? [];
    return seededOrder(sides, `${question.id}:choices`);
  }, [question]);

  useEffect(() => {
    setPicked(null);
    setBusy(false);
  }, [question.id]);

  function confirmPick() {
    if (!current || picked == null || busy || disabled || done) return;
    const rightKey = matchSideKey(current.right);
    if (picked === rightKey) {
      playSound("tap");
      onChange({ ...map, [current.id]: picked });
      return;
    }
    setBusy(true);
    playSound("wrong");
    const wait = reducedMotion ? 280 : 800;
    window.setTimeout(() => {
      setPicked(null);
      setBusy(false);
    }, wait);
  }

  confirmRef.current = confirmPick;

  useEffect(() => {
    if (review || disabled || done) {
      onPlayControl?.(null);
      return;
    }
    onPlayControl?.({
      canConfirm: picked != null && !busy,
      confirm: () => confirmRef.current(),
    });
    return () => onPlayControl?.(null);
  }, [review, disabled, done, picked, busy, onPlayControl]);

  if (!current) return null;

  const mark = markForPair(0);

  return (
    <div className="match-turn">
      <div className="match-turn-board">
        <div className="match-turn-target-row">
          <div className="match-turn-target-slot">
            <div
              className="match-card is-up match-card-static"
              aria-label={matchSideLabel(current.left)}
            >
              <span className="match-card-inner">
                <span className="match-card-face match-card-back" aria-hidden>
                  <span className="match-card-back-mark">?</span>
                </span>
                <span className="match-card-face match-card-front">
                  <SideView side={current.left} />
                </span>
              </span>
            </div>
          </div>
        </div>
        <div className="match-turn-choices" role="group" aria-label={copy.matchCards}>
          {choices.map((side, index) => {
            const key = matchSideKey(side);
            const selected = picked === key;
            const found = map[current.id] === key;
            return (
              <FlipCardButton
                key={`${current.id}-${key}-${index}`}
                card={{ id: key, pairId: current.id, content: side }}
                index={index}
                faceUp={review || selected || found}
                found={found}
                mark={found ? mark : undefined}
                disabled={disabled || busy || review}
                onTap={() => {
                  if (disabled || busy || review) return;
                  playSound("tap");
                  setPicked(key === picked ? null : key);
                }}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
}

export function MatchPairs({
  question,
  answer,
  disabled,
  reveal,
  onChange,
  onPlayControl,
}: MatchPairsProps) {
  const map = answerMap(question, answer);
  const mode = matchPairsMode(question);
  if (mode === "one-at-a-time") {
    return (
      <OneAtATime
        question={question}
        map={map}
        disabled={disabled}
        reveal={reveal}
        onChange={onChange}
        onPlayControl={onPlayControl}
      />
    );
  }
  return (
    <FlipMatch question={question} map={map} disabled={disabled} reveal={reveal} onChange={onChange} />
  );
}
