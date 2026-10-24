import { Sheet, SheetTitle } from "./Sheet";
import { useRef } from "react";
import { Play, RotateCcw, Star, Trophy, X } from "lucide-react";
import { copy } from "../data/copy";
import { DIFFICULTY_LABELS, type LevelState } from "../lib/path";

type LevelSheetProps = {
  level: LevelState | null;
  learnerName: string;
  onClose: () => void;
  onPlay: (activityId: string) => void;
};

export function LevelSheet({ level, learnerName, onClose, onPlay }: LevelSheetProps) {
  const lastLevel = useRef(level);
  if (level) lastLevel.current = level;
  const shown = level ?? lastLevel.current;
  if (!shown) return null;

  const { node, category, difficulties } = shown;

  return (
    <Sheet open={level !== null} onClose={onClose}>
        <button
          type="button"
          className="sheet-close"
          onClick={onClose}
          aria-label="Close"
        >
          <X size={20} aria-hidden />
        </button>

        <p className="sheet-crumb">
          {category.year} · {category.title}
        </p>
        <SheetTitle className="sheet-title">
          <span className="sheet-level">Level {node.number}</span>
          {node.title}
        </SheetTitle>
        {shown.cup ? (
          <p className="sheet-cup-line is-gold">
            <Trophy size={18} aria-hidden />
            Gold cup!
          </p>
        ) : null}

        <ul className="sheet-rows">
          {difficulties.map((entry) => {
            const label = DIFFICULTY_LABELS[entry.difficulty];
            const hasScore = entry.bestTotalCount > 0;
            const note = !entry.activity
              ? "Coming soon"
              : entry.done
                ? copy.levelPassed
                : hasScore
                  ? copy.levelRetry
                  : entry.difficulty === 1
                    ? `Ready when you are, ${learnerName}`
                    : "Ready to play";

            return (
              <li
                key={entry.difficulty}
                className={`sheet-row${entry.done ? " is-done" : ""}${entry.activity ? "" : " is-closed"}`}
              >
                <span className="sheet-star-row" aria-hidden>
                  {[0, 1, 2].map((slot) => (
                    <Star
                      key={slot}
                      size={18}
                      className={slot < entry.bestStars ? "is-lit" : undefined}
                      fill={slot < entry.bestStars ? "currentColor" : "none"}
                    />
                  ))}
                </span>
                <span className="sheet-row-text">
                  <span className="sheet-row-title">
                    {label}
                    {hasScore ? (
                      <span className="sheet-score">{copy.scoreMark(entry.bestCorrectCount, entry.bestTotalCount)}</span>
                    ) : null}
                  </span>
                  <span className="sheet-row-note">{note}</span>
                </span>
                {entry.activity ? (
                  <button
                    type="button"
                    className="sheet-play"
                    onClick={() => onPlay(entry.activity!.id)}
                  >
                    {entry.done ? (
                      <>
                        <RotateCcw size={15} aria-hidden /> Again
                      </>
                    ) : (
                      <>
                        <Play size={15} aria-hidden fill="currentColor" /> Play
                      </>
                    )}
                  </button>
                ) : null}
              </li>
            );
          })}
        </ul>
    </Sheet>
  );
}
