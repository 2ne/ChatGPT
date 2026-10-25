import { useEffect, useMemo, useRef, useState } from "react";
import { copy } from "../../data/copy";
import { matchSideBaseTen, matchSideDice, matchSideKey, matchSideLabel, matchSideTenFrame, matchSideVisual } from "../../lib/matchSide";
import { seededOrder } from "../../lib/matchPairs";
import { playSound } from "../../lib/sound";
import type { MatchPairsQuestion, MatchSide } from "../../types/activity";
import { usePrefersReducedMotion } from "../../hooks/usePrefersReducedMotion";
import { ObjectGroup } from "./ObjectGroup";
import { choiceClass, markChoice, type Reveal } from "./choice";
import { ShapePicture } from "./ShapePicture";
import { BaseTen } from "./BaseTen";
import { DiceFace } from "./DiceFace";
import { TenFrame } from "./TenFrame";

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
  const tenFrame = matchSideTenFrame(side);
  const baseTen = matchSideBaseTen(side);
  const dice = matchSideDice(side);
  const label = typeof side === "string" ? side : side.label;
  const layout = typeof side === "string" ? undefined : side.layout;
  const shape = typeof side === "string" ? undefined : side.shape;
  return (
    <span className="option-content">
      {shape ? <ShapePicture shape={shape} compact /> : null}
      {tenFrame ? <TenFrame frame={tenFrame} fit="card" /> : null}
      {baseTen ? <BaseTen model={baseTen} compact /> : null}
      {dice ? <DiceFace face={dice} compact /> : null}
      {visual ? <ObjectGroup visual={visual} compact pack layout={layout} /> : null}
      {label ? <span>{label}</span> : null}
      {!visual && !tenFrame && !baseTen && !dice && !shape && !label ? matchSideLabel(side) : null}
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

function ChoiceMark({ marked }: { marked?: "correct" | "wrong" | null }) {
  if (marked === "correct") {
    return (
      <span className="option-check" aria-hidden>
        ✓
      </span>
    );
  }
  if (marked === "wrong") {
    return (
      <span className="option-cross" aria-hidden>
        ✕
      </span>
    );
  }
  return null;
}

const FLIP_FALLBACK_MS = 200;

function FlipCardButton({
  card,
  index,
  faceUp,
  marked,
  disabled,
  onTap,
}: {
  card: FlipCard;
  index: number;
  faceUp: boolean;
  marked?: "correct" | "wrong" | null;
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
  const aria = shownUp ? copy.cardShows(number, label) : copy.cardFaceDown(number);
  return (
    <button
      type="button"
      className={`match-card${shownUp ? " is-up" : ""}${squeezing ? " is-squeeze" : ""}`}
      disabled={disabled}
      aria-label={aria}
      onClick={onTap}
    >
      <span className="match-card-inner" onTransitionEnd={onFlipEnd}>
        {shownUp ? (
          <span
            className={`match-card-face match-card-front${
              marked ? ` ${choiceClass(false, marked)}` : ""
            }`}
          >
            <SideView side={card.content} />
            <ChoiceMark marked={marked} />
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

  const rightKey = matchSideKey(current.right);
  const chosenKey = map[current.id] || picked;
  const result = submitted ? (chosenKey === rightKey ? "correct" : "incorrect") : reveal;
  const pairMark = submitted ? (chosenKey === rightKey ? "correct" : "wrong") : null;

  return (
    <div className="match-turn">
      <div className={`match-turn-board${choices.length === 4 ? " is-four" : ""}`}>
        <div className={`match-turn-target-row${choices.length === 4 ? " is-four" : ""}`}>
          <div className="match-turn-target-slot">
            <div
              className={`match-turn-target${pairMark ? ` ${choiceClass(false, pairMark)}` : ""}`}
              aria-label={matchSideLabel(current.left)}
            >
              <SideView side={current.left} />
              <ChoiceMark marked={pairMark} />
            </div>
          </div>
        </div>
        <div
          className={`match-turn-choices${choices.length === 4 ? " is-four" : ""}`}
          role="group"
          aria-label={copy.matchCards}
        >
          {choices.map((side, index) => {
            const key = matchSideKey(side);
            const selected = !submitted && picked === key;
            const marked = markChoice(result, key === chosenKey, key === rightKey);
            return (
              <FlipCardButton
                key={`${current.id}-${key}-${index}`}
                card={{ id: key, pairId: current.id, content: side }}
                index={index}
                faceUp={review || selected || Boolean(marked)}
                marked={marked}
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
