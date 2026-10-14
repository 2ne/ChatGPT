import { useEffect, useRef } from "react";
import { Check, Lock, Play, RotateCcw, Star, X } from "lucide-react";
import { DIFFICULTY_LABELS, type LevelState } from "../lib/path";
import { Pip } from "./mascot/Pip";

type LevelSheetProps = {
  level: LevelState | null;
  learnerName: string;
  currentLevel: LevelState;
  onClose: () => void;
  onPlay: (activityId: string) => void;
};

export function LevelSheet({ level, learnerName, currentLevel, onClose, onPlay }: LevelSheetProps) {
  const closeRef = useRef<HTMLButtonElement>(null);
  const returnFocus = useRef<HTMLElement | null>(null);
  const closeHandler = useRef(onClose);
  closeHandler.current = onClose;
  const isOpen = level !== null;

  useEffect(() => {
    if (!isOpen) return;
    returnFocus.current = document.activeElement as HTMLElement | null;
    closeRef.current?.focus();
    function onKey(event: KeyboardEvent) {
      if (event.key === "Escape") closeHandler.current();
    }
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("keydown", onKey);
      returnFocus.current?.focus();
    };
  }, [isOpen]);

  if (!level) return null;

  const { node, category, status, difficulties } = level;

  return (
    <div className="sheet-layer" onClick={onClose}>
      <div
        className="sheet"
        role="dialog"
        aria-modal="true"
        aria-labelledby="sheet-title"
        onClick={(event) => event.stopPropagation()}
      >
        <button
          ref={closeRef}
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
        <h2 id="sheet-title" className="sheet-title">
          <span className="sheet-level">Level {node.number}</span>
          {node.title}
        </h2>

        {status === "soon" ? (
          <div className="sheet-note">
            <Pip size={64} mood="think" />
            <p className="t-body">
              This level is still being made. Keep going on the map and it will be ready soon.
            </p>
          </div>
        ) : status === "locked" ? (
          <div className="sheet-note">
            <span className="sheet-lock" aria-hidden>
              <Lock size={26} />
            </span>
            <p className="t-body">
              Finish level {currentLevel.node.number}, {currentLevel.node.title}, to open this one.
            </p>
          </div>
        ) : (
          <ul className="sheet-rows">
            {difficulties.map((entry) => {
              const label = DIFFICULTY_LABELS[entry.difficulty];
              const previous = entry.difficulty > 1 ? DIFFICULTY_LABELS[(entry.difficulty - 1) as 1 | 2] : "";
              const note = !entry.activity
                ? "Coming soon"
                : entry.done
                  ? "Done!"
                  : entry.playable
                    ? entry.difficulty === 1
                      ? `Ready when you are, ${learnerName}`
                      : "Ready to play"
                    : `Finish ${previous} first`;

              return (
                <li
                  key={entry.difficulty}
                  className={`sheet-row${entry.done ? " is-done" : ""}${entry.playable ? "" : " is-closed"}`}
                >
                  <span className="sheet-star" aria-hidden>
                    <Star size={22} fill={entry.done ? "currentColor" : "none"} />
                  </span>
                  <span className="sheet-row-text">
                    <span className="sheet-row-title">{label}</span>
                    <span className="sheet-row-note">{note}</span>
                  </span>
                  {entry.playable && entry.activity ? (
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
                  ) : entry.done ? (
                    <span className="sheet-tick" aria-hidden>
                      <Check size={16} />
                    </span>
                  ) : null}
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </div>
  );
}
