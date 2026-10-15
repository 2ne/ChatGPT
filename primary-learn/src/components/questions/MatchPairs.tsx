import { useMemo, useState } from "react";
import { copy } from "../../data/copy";
import { matchSideKey, matchSideLabel, matchSideVisual } from "../../lib/matchSide";
import type { MatchPairsQuestion, MatchSide } from "../../types/activity";
import { ObjectGroup } from "./ObjectGroup";
import { choiceClass, type Reveal } from "./choice";

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
  return (
    <span className="option-content">
      {visual ? <ObjectGroup visual={visual} compact /> : null}
      {label ? <span>{label}</span> : null}
      {!visual && !label ? matchSideLabel(side) : null}
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

  return (
    <div className="option-stack">
      <p className="t-body">{copy.tapThenPartner}</p>
      <div className="match-board">
        {question.pairs.map((pair) => {
          const chosen = map[pair.id] ?? "";
          const marked =
            reveal == null ? null : chosen === matchSideKey(pair.right) ? "correct" : "wrong";
          const chosenSide = chosen ? rightByKey.get(chosen) : undefined;
          return (
            <button
              key={pair.id}
              type="button"
              disabled={disabled}
              aria-pressed={activeId === pair.id}
              onClick={() => setActiveId(pair.id)}
              className={`match-row ${choiceClass(activeId === pair.id, marked)}`}
            >
              <SideView side={pair.left} />
              <span className={`match-slot${chosen ? " is-filled" : ""}`}>
                {chosenSide ? <SideView side={chosenSide} /> : copy.matchChoose}
              </span>
            </button>
          );
        })}
      </div>
      <div className="match-bank" role="group" aria-label={copy.matchPartners}>
        {rights.map((key, index) => {
          const used = Object.values(map).includes(key);
          const side = rightByKey.get(key);
          return (
            <button
              key={`${key}-${index}`}
              type="button"
              disabled={disabled}
              aria-pressed={used}
              onClick={() => assign(key)}
              className={`match-chip${used ? " is-used" : ""}`}
            >
              {side ? <SideView side={side} /> : key}
            </button>
          );
        })}
      </div>
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
