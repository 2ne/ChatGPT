import type { ReactNode } from "react";
import { Pip } from "./mascot/Pip";
import { usePipMood } from "./PipMood";

type AppHeaderProps = {
  right?: ReactNode;
  learnerName?: string;
  learnerEmoji?: string;
};

export function AppHeader({ right, learnerName, learnerEmoji }: AppHeaderProps) {
  const { mood } = usePipMood();

  return (
    <header className="app-header">
      <div className="app-header-inner">
        <div className="brand-row">
          <span className="brand-pip">
            <Pip size={42} mood={mood} />
          </span>
          <span className="brand-text">
            <span className="brand-name">
              Primary <em>Maths</em>
            </span>
          </span>
        </div>
        <div className="app-header-right">
          {learnerName ? (
            <span className="learner-chip" title={`Signed in as ${learnerName}`}>
              <span className="learner-emoji" aria-hidden>
                {learnerEmoji ?? "🦊"}
              </span>
              <span className="learner-name">{learnerName}</span>
            </span>
          ) : null}
          {right ? <div className="app-header-actions">{right}</div> : null}
        </div>
      </div>
    </header>
  );
}
