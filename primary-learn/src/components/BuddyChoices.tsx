import { AVATARS } from "../data/avatars";
import { copy } from "../data/copy";
import type { LearnerAvatarId } from "../types/progress";

export function BuddyChoices({ avatarId, onChange }: { avatarId: LearnerAvatarId; onChange: (id: LearnerAvatarId) => void }) {
  return (
          <fieldset className="onboard-buddies">
            <legend className="t-title-sm">{copy.chooseBuddy}</legend>
            <div className="avatar-grid">
              {AVATARS.map((avatar) => {
                const selected = avatar.id === avatarId;
                return (
                  <button
                    key={avatar.id}
                    type="button"
                    onClick={() => onChange(avatar.id)}
                    aria-pressed={selected}
                    className={`avatar-pick${selected ? " is-selected" : ""}`}
                  >
                    <span
                      className="avatar-face"
                      style={{ background: `${avatar.accent}26` }}
                      aria-hidden
                    >
                      {avatar.emoji}
                    </span>
                    <span className="t-meta avatar-label">{avatar.label}</span>
                  </button>
                );
              })}
            </div>
          </fieldset>
  );
}
