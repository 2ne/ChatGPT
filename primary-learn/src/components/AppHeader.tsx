import type { ReactNode } from "react";
import { MuteToggle } from "./MuteToggle";
import { Pip } from "./mascot/Pip";
import { usePipMood } from "./PipMood";

type AppHeaderProps = {
  right?: ReactNode;
  learnerName?: string;
  learnerEmoji?: string;
  onHome?: () => void;
};

export function AppHeader({ right, learnerName, learnerEmoji, onHome }: AppHeaderProps) {
  const { mood } = usePipMood();

  const brand = (
    <>
      <span className="brand-pip">
        <Pip size={42} mood={mood} />
      </span>
      <span className="brand-text">
        <span className="brand-name">
          Primary <em>Maths</em>
        </span>
      </span>
    </>
  );

  return (
    <header className="app-header">
      <div className="app-header-inner">
        {onHome ? (
          <button type="button" className="brand-row" onClick={onHome}>
            {brand}
          </button>
        ) : (
          <div className="brand-row">{brand}</div>
        )}
        <div className="app-header-right">
          {learnerName ? (
            <span className="learner-chip" title={`Signed in as ${learnerName}`}>
              <span className="learner-emoji" aria-hidden>
                {learnerEmoji ?? "🦊"}
              </span>
              <span className="learner-name">{learnerName}</span>
            </span>
          ) : null}
          <div className="app-header-actions">
            <MuteToggle />
            {right}
          </div>
        </div>
      </div>
    </header>
  );
}
