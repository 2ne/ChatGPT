import { useEffect, useMemo, useRef, useState, type CSSProperties } from "react";
import { copy } from "../../data/copy";
import { matchSideKey, matchSideLabel, matchSideVisual } from "../../lib/matchSide";
import {
  colourForPair,
  isMatchMissed,
  markMatchMissed,
  matchPairsMode,
  seededOrder,
  type MatchPairColour,
} from "../../lib/matchPairs";
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

function answerMap(
  question: MatchPairsQuestion,
  answer: unknown,
): Record<string, string> {
  if (answer && typeof answer === "object") return { ...(answer as Record<string, string>) };
  return Object.fromEntries(question.pairs.map((pair) => [pair.id, ""]));
}

function foundPairIds(question: MatchPairsQuestion, map: Record<string, string>): Set<string> {
  return new Set(
    question.pairs
      .filter((pair) => map[pair.id] === matchSideKey(pair.right))
      .map((pair) => pair.id),
  );
}

const FLIP_FALLBACK_MS = 200;

function FlipCardButton({
  card,
  index,
  faceUp,
  found,
  wrong,
  colour,
  disabled,
  onTap,
}: {
  card: FlipCard;
  index: number;
  faceUp: boolean;
  found: boolean;
  wrong?: boolean;
  colour?: MatchPairColour;
  disabled?: boolean;
  onTap: () => void;
}) {
  const reducedMotion = usePrefersReducedMotion();
  const [shownUp, setShownUp] = useState(faceUp);
  const [squeezing, setSqueezing] = useState(false);
  const wantRef = useRef(faceUp);
  const shownRef = useRef(faceUp);
  const phaseRef = useRef<"idle" | "out" | "in">("idle");
  const timersRef = useRef<number[]>([]);
  wantRef.current = faceUp;
  shownRef.current = shownUp;

  function clearTimers() {
    for (const id of timersRef.current) window.clearTimeout(id);
    timersRef.current = [];
  }

  function showFace(nextUp: boolean) {
    shownRef.current = nextUp;
    setShownUp(nextUp);
    setSqueezing(false);
    phaseRef.current = "in";
    const wait = reducedMotion ? 0 : FLIP_FALLBACK_MS;
    const timer = window.setTimeout(finishIn, wait);
    timersRef.current.push(timer);
  }

  function finishIn() {
    phaseRef.current = "idle";
    setSqueezing(false);
    if (wantRef.current !== shownRef.current) startFlip(wantRef.current);
  }

  function startFlip(nextUp: boolean) {
    clearTimers();
    if (reducedMotion || shownRef.current === nextUp) {
      shownRef.current = nextUp;
      setShownUp(nextUp);
      setSqueezing(false);
      phaseRef.current = "idle";
      return;
    }
    phaseRef.current = "out";
    setSqueezing(true);
    const timer = window.setTimeout(() => {
      if (phaseRef.current === "out") showFace(wantRef.current);
    }, FLIP_FALLBACK_MS);
    timersRef.current.push(timer);
  }

  function onFlipEnd(event: { propertyName: string }) {
    if (event.propertyName !== "transform") return;
    if (phaseRef.current === "out") {
      clearTimers();
      showFace(wantRef.current);
      return;
    }
    if (phaseRef.current === "in") {
      clearTimers();
      finishIn();
    }
  }

  useEffect(() => {
    if (faceUp !== shownRef.current && phaseRef.current === "idle") {
      startFlip(faceUp);
    }
  }, [faceUp, reducedMotion]);

  useEffect(() => {
    return () => clearTimers();
  }, []);

  const label = matchSideLabel(card.content);
  const number = index + 1;
  const aria = shownUp
    ? found
      ? copy.cardShowsFound(number, label)
      : copy.cardShows(number, label)
    : copy.cardFaceDown(number);
  const style = found && colour
    ? ({ "--pair-tint": colour.tint, "--pair-ink": colour.ink } as CSSProperties)
    : undefined;
  return (
    <button
      type="button"
      className={`match-card${shownUp ? " is-up" : ""}${squeezing ? " is-squeeze" : ""}${
        found ? " is-found" : ""
      }${wrong ? " is-wrong" : ""}`}
      style={style}
      disabled={disabled}
      aria-label={aria}
      onClick={onTap}
    >
      <span className="match-card-inner" onTransitionEnd={onFlipEnd}>
        {shownUp ? (
          <span className="match-card-face match-card-front">
            <SideView side={card.content} />
          </span>
        ) : (
          <span className="match-card-face match-card-back">
            <span className="match-card-back-mark" aria-hidden>
              ?
            </span>
          </span>
        )}
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
  const colours = useMemo(
    () => Object.fromEntries(question.pairs.map((pair, index) => [pair.id, colourForPair(index)])),
    [question],
  );
  const [preview, setPreview] = useState(!review);
  const [peek, setPeek] = useState(false);
  const [picked, setPicked] = useState<string[]>([]);
  const [missIds, setMissIds] = useState<string[]>([]);
  const [locked, setLocked] = useState(false);
  const mapRef = useRef(map);
  const previewRef = useRef(preview);
  const peekRef = useRef(peek);
  const pickedRef = useRef(picked);
  const lockedRef = useRef(locked);
  const foundRef = useRef(foundPairIds(question, map));
  const timers = useRef<number[]>([]);
  mapRef.current = map;
  previewRef.current = preview;
  peekRef.current = peek;
  pickedRef.current = picked;
  lockedRef.current = locked;
  foundRef.current = foundPairIds(question, map);

  function clearTimers() {
    for (const id of timers.current) window.clearTimeout(id);
    timers.current = [];
  }

  useEffect(() => {
    return () => clearTimers();
  }, []);

  useEffect(() => {
    clearTimers();
    pickedRef.current = [];
    lockedRef.current = false;
    peekRef.current = false;
    setPicked([]);
    setMissIds([]);
    setLocked(false);
    setPeek(false);
    if (review) {
      previewRef.current = false;
      setPreview(false);
      return;
    }
    previewRef.current = true;
    setPreview(true);
    const wait = reducedMotion ? 400 : 3000;
    const timer = window.setTimeout(() => {
      previewRef.current = false;
      setPreview(false);
    }, wait);
    timers.current.push(timer);
    return () => window.clearTimeout(timer);
    // Reset only when the question changes so a re-render cannot restart the preview.
  }, [question.id]);

  function showAllAgain() {
    if (
      disabled ||
      previewRef.current ||
      peekRef.current ||
      lockedRef.current ||
      isMatchMissed(mapRef.current)
    ) {
      return;
    }
    pickedRef.current = [];
    setPicked([]);
    peekRef.current = true;
    setPeek(true);
    const wait = reducedMotion ? 400 : 3000;
    const timer = window.setTimeout(() => {
      peekRef.current = false;
      setPeek(false);
    }, wait);
    timers.current.push(timer);
  }

  function tapCard(card: FlipCard) {
    if (
      disabled ||
      previewRef.current ||
      peekRef.current ||
      lockedRef.current ||
      isMatchMissed(mapRef.current)
    ) {
      return;
    }
    if (foundRef.current.has(card.pairId)) return;
    if (pickedRef.current.includes(card.id)) return;
    if (pickedRef.current.length >= 2) return;
    playSound("tap");
    const next = [...pickedRef.current, card.id];
    pickedRef.current = next;
    setPicked(next);
    if (next.length < 2) return;
    const first = cards.find((item) => item.id === next[0]);
    const second = cards.find((item) => item.id === next[1]);
    if (!first || !second || first.pairId !== second.pairId) {
      lockedRef.current = true;
      setLocked(true);
      setMissIds(next);
      const wait = reducedMotion ? 350 : 1000;
      const timer = window.setTimeout(() => {
        pickedRef.current = [];
        setPicked([]);
        setMissIds([]);
        onChange(markMatchMissed(mapRef.current));
      }, wait);
      timers.current.push(timer);
      return;
    }
    const pair = question.pairs.find((item) => item.id === first.pairId);
    if (!pair) {
      pickedRef.current = [];
      setPicked([]);
      return;
    }
    const nextFound = new Set(foundRef.current);
    nextFound.add(pair.id);
    foundRef.current = nextFound;
    pickedRef.current = [];
    setPicked([]);
    onChange({ ...mapRef.current, [pair.id]: matchSideKey(pair.right) });
  }

  const looking = preview || peek;
  const foundIds = foundRef.current;
  const missed = isMatchMissed(map);
  const revealAll = review || missed;
  return (
    <div className="match-flip">
      <div
        className={`match-flip-grid pairs-${question.pairs.length}`}
        role="group"
        aria-label={copy.matchCards}
      >
        {cards.map((card, index) => {
          const found = foundIds.has(card.pairId);
          const wrong = missIds.includes(card.id);
          const showPair = found || revealAll;
          const faceUp = revealAll || looking || found || picked.includes(card.id);
          return (
            <FlipCardButton
              key={card.id}
              card={card}
              index={index}
              faceUp={faceUp}
              found={showPair}
              wrong={wrong}
              colour={showPair ? colours[card.pairId] : undefined}
              disabled={disabled || preview || peek || locked || found || missed}
              onTap={() => tapCard(card)}
            />
          );
        })}
      </div>
      {review || missed || locked ? null : (
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
  const review = Boolean(disabled && reveal);
  const current = question.pairs[0];
  const submitted = Boolean(current && map[current.id]);
  const [picked, setPicked] = useState<string | null>(null);
  const pickedRef = useRef<string | null>(null);
  const submittedRef = useRef(submitted);
  const confirmRef = useRef<() => void>(() => {});
  pickedRef.current = picked;
  submittedRef.current = submitted;

  const choices = useMemo(() => {
    const sides = question.choices ?? [];
    return seededOrder(sides, `${question.id}:choices`);
  }, [question]);

  useEffect(() => {
    pickedRef.current = null;
    setPicked(null);
  }, [question.id]);

  function confirmPick() {
    if (!current || pickedRef.current == null || disabled || submittedRef.current) return;
    submittedRef.current = true;
    onChange({ ...map, [current.id]: pickedRef.current });
  }

  confirmRef.current = confirmPick;

  useEffect(() => {
    if (review || disabled || submitted) {
      onPlayControl?.(null);
      return;
    }
    onPlayControl?.({
      canConfirm: picked != null,
      confirm: () => confirmRef.current(),
    });
    return () => onPlayControl?.(null);
  }, [review, disabled, submitted, picked, onPlayControl]);

  if (!current) return null;

  const colour = colourForPair(0);

  return (
    <div className="match-turn">
      <div className="match-turn-board">
        <div className="match-turn-target-row">
          <div className="match-turn-target-slot">
            <div className="match-turn-target" aria-label={matchSideLabel(current.left)}>
              <SideView side={current.left} />
            </div>
          </div>
        </div>
        <div className="match-turn-choices" role="group" aria-label={copy.matchCards}>
          {choices.map((side, index) => {
            const key = matchSideKey(side);
            const rightKey = matchSideKey(current.right);
            const chosenKey = map[current.id] || picked;
            const selected = !submitted && picked === key;
            const found = Boolean(submitted && key === rightKey);
            const wrong = Boolean(submitted && chosenKey !== rightKey && key === chosenKey);
            return (
              <FlipCardButton
                key={`${current.id}-${key}-${index}`}
                card={{ id: key, pairId: current.id, content: side }}
                index={index}
                faceUp={review || selected || found || wrong}
                found={found}
                wrong={wrong}
                colour={found ? colour : undefined}
                disabled={disabled || submitted || review}
                onTap={() => {
                  if (disabled || review || submittedRef.current) return;
                  playSound("tap");
                  const next = key === pickedRef.current ? null : key;
                  pickedRef.current = next;
                  setPicked(next);
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
