import type { LearnerProfile } from "../types/progress";
import { useState } from "react";
import { copy } from "../data/copy";
import { Pip } from "./mascot/Pip";
import { usePipMood } from "./PipMood";
import { SettingsSheet } from "./SettingsSheet";

type AppHeaderProps = {
  learnerName?: string;
  learnerEmoji?: string;
  profile?: LearnerProfile;
  onUpdateProfile?: (patch: Pick<LearnerProfile, "name" | "avatarId">) => void;
  onHome?: () => void;
  onReset?: () => void;
};

export function AppHeader({ learnerName, learnerEmoji, onHome, onReset, profile, onUpdateProfile }: AppHeaderProps) {
  const { mood } = usePipMood();
  const [settingsOpen, setSettingsOpen] = useState(false);

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

  const chip = learnerName ? (
    <>
      <span className="learner-emoji" aria-hidden>
        {learnerEmoji ?? "🦊"}
      </span>
      <span className="learner-name">{learnerName}</span>
    </>
  ) : null;

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
          {learnerName && onReset ? (
            <button
              type="button"
              className="learner-chip"
              aria-haspopup="dialog"
              aria-expanded={settingsOpen}
              aria-label={copy.settingsAria(learnerName)}
              onClick={() => setSettingsOpen(true)}
            >
              {chip}
            </button>
          ) : learnerName ? (
            <span className="learner-chip" title={`Signed in as ${learnerName}`}>
              {chip}
            </span>
          ) : null}
        </div>
      </div>
      {onReset ? (
        <SettingsSheet
          open={settingsOpen}
          learnerName={learnerName ?? ""}
          profile={profile}
          onUpdateProfile={onUpdateProfile}
          onClose={() => setSettingsOpen(false)}
          onReset={() => {
            setSettingsOpen(false);
            onReset();
          }}
        />
      ) : null}
    </header>
  );
}
