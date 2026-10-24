import { useMemo, useState } from "react";
import { matchSideKey, matchSideLabel, matchSideVisual } from "../../lib/matchSide";
import type { MatchPairsQuestion, MatchSide } from "../../types/activity";
import { ObjectGroup } from "./ObjectGroup";
import { type Reveal } from "./choice";
import { ShapePicture } from "./ShapePicture";

type MatchPairsProps = {
  question: MatchPairsQuestion;
  answer: unknown;
  disabled?: boolean;
  reveal: Reveal;
  onChange: (value: unknown) => void;
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

export function MatchPairs({ question, answer, disabled, reveal, onChange }: MatchPairsProps) {
  const map =
    answer && typeof answer === "object"
      ? (answer as Record<string, string>)
      : Object.fromEntries(question.pairs.map((pair) => [pair.id, ""]));
  const rights = useMemo(
    () => seededOrder(question.pairs.map((pair) => matchSideKey(pair.right)), question.id),
    [question],
  );
  const [activeId, setActiveId] = useState(question.pairs[0]?.id ?? "");
  const rightByKey = new Map(question.pairs.map((pair) => [matchSideKey(pair.right), pair.right]));

  function assign(rightKey: string) {
    const target =
      activeId || question.pairs.find((pair) => !map[pair.id])?.id || question.pairs[0]?.id;
    if (!target) return;
    const next = { ...map };
    if (next[target] === rightKey) {
      next[target] = "";
      onChange(next);
      return;
    }
    for (const id of Object.keys(next)) {
      if (next[id] === rightKey) next[id] = "";
    }
    next[target] = rightKey;
    onChange(next);
    const following = question.pairs.find((pair) => pair.id !== target && !next[pair.id]);
    if (following) setActiveId(following.id);
  }

  const completed = question.pairs.filter(pair => map[pair.id]).length;
  const statusFor = (id: string) => {
    const pair = question.pairs.find(pair => pair.id === id);
    if (!reveal || !pair) return "";
    return map[id] === matchSideKey(pair.right) ? " is-correct" : " is-wrong";
  };
  return (
    <div className="pair-match">
      <p className="t-body">Tap a card on the left, then its partner on the right.</p>
      <div className="pair-match-grid">
        <div className="pair-match-column" role="group" aria-label="Cards to match">
          {question.pairs.map((pair, index) => (
            <button key={pair.id} type="button" disabled={disabled}
              aria-pressed={activeId === pair.id}
              aria-label={`Card ${index + 1}. ${matchSideLabel(pair.left)}.${map[pair.id] ? ` Paired with ${matchSideLabel(rightByKey.get(map[pair.id])!)}. Tap to change.` : " Choose a partner."}`}
              onClick={() => setActiveId(pair.id)}
              className={`pair-match-card${activeId === pair.id ? " is-active" : ""}${map[pair.id] ? " is-paired" : ""}${statusFor(pair.id)}`}>
              <span className="pair-match-badge" aria-hidden>{index + 1}</span>
              <SideView side={pair.left} />
              {reveal ? <span className="pair-match-result" aria-hidden>{statusFor(pair.id) === " is-correct" ? "✓" : "×"}</span> : null}
            </button>
          ))}
        </div>
        <div className="pair-match-column" role="group" aria-label="Partners">
          {rights.map(key => {
            const owner = question.pairs.findIndex(pair => map[pair.id] === key);
            const pair = question.pairs[owner];
            const side = rightByKey.get(key)!;
            return <button key={key} type="button" disabled={disabled}
              aria-pressed={Boolean(pair && pair.id === activeId)}
              aria-label={`${matchSideLabel(side)}.${pair ? ` Paired with card ${owner + 1}.` : " Not paired yet."}`}
              onClick={() => assign(key)}
              className={`pair-match-card${pair ? " is-paired" : ""}${pair?.id === activeId ? " is-active" : ""}${pair ? statusFor(pair.id) : ""}`}>
                <span className="pair-match-badge" aria-hidden style={{ visibility: pair ? "visible" : "hidden" }}>{owner + 1}</span>
                <SideView side={side} />
                {reveal && pair ? <span className="pair-match-result" aria-hidden>{statusFor(pair.id) === " is-correct" ? "✓" : "×"}</span> : null}
              </button>;
          })}
        </div>
      </div>
      <p className="pair-match-status" role="status" aria-live="polite">{completed} of {question.pairs.length} pairs chosen.</p>
    </div>
  );
}

function seededOrder(items: string[], seed: string): string[] {
  let hash = 2166136261;
  for (let i = 0; i < seed.length; i += 1) {
    hash ^= seed.charCodeAt(i);
    hash = Math.imul(hash, 16777619);
  }
  const next = [...items];
  for (let i = next.length - 1; i > 0; i -= 1) {
    hash = Math.imul(hash ^ (hash >>> 16), 2246822507);
    const j = (hash >>> 0) % (i + 1);
    const swap = next[i];
    next[i] = next[j];
    next[j] = swap;
  }
  if (next.length > 1 && next.every((item, index) => item === items[index])) {
    const first = next[0];
    next[0] = next[1];
    next[1] = first;
  }
  return next;
}
