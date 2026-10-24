import type { LearnerProfile } from "../types/progress";
import { ProfileEditor } from "./ProfileEditor";
import { Sheet, SheetTitle } from "./Sheet";
import { useEffect, useState } from "react";
import { Pencil, RotateCcw, Volume2, VolumeX, X } from "lucide-react";
import { copy } from "../data/copy";
import {
  isSoundMuted,
  subscribeSoundMuted,
  toggleSoundMuted,
  unlockSound,
} from "../lib/sound";
import { Pip } from "./mascot/Pip";

type SettingsSheetProps = {
  open: boolean;
  learnerName: string;
  profile?: LearnerProfile;
  onUpdateProfile?: (patch: Pick<LearnerProfile, "name" | "avatarId">) => void;
  onClose: () => void;
  onReset: () => void;
};

export function SettingsSheet({ open, learnerName, onClose, onReset, profile, onUpdateProfile }: SettingsSheetProps) {
  const [editing, setEditing] = useState(false);
  const [confirm, setConfirm] = useState(false);
  const [muted, setMuted] = useState(isSoundMuted);

  useEffect(() => subscribeSoundMuted(setMuted), []);

  useEffect(() => { if (!open) { setConfirm(false); setEditing(false); } }, [open]);

  return (
    <Sheet open={open} onClose={onClose}>
        <button
          type="button"
          className="sheet-close"
          onClick={onClose}
          aria-label="Close"
        >
          <X size={20} aria-hidden />
        </button>

        <SheetTitle className="sheet-title toc-title">
          {editing ? copy.editProfile : copy.settings}
        </SheetTitle>
        {!editing ? <p className="settings-hello">{learnerName}</p> : null}

        {confirm ? (
          <div className="sheet-note">
            <Pip size={64} mood="think" />
            <div>
              <p className="t-body">{copy.resetAsk}</p>
              <p className="t-body">{copy.resetNote}</p>
            </div>
          </div>
        ) : null}

        {editing && profile && onUpdateProfile ? (
          <ProfileEditor profile={profile} onCancel={() => setEditing(false)} onSave={patch => {
            onUpdateProfile(patch);
            onClose();
          }} />
        ) : confirm ? (
          <div className="settings-actions">
            <button type="button" className="btn btn-secondary btn-block" onClick={() => setConfirm(false)}>
              {copy.resetNo}
            </button>
            <button type="button" className="btn btn-primary btn-block" onClick={onReset}>
              {copy.resetYes}
            </button>
          </div>
        ) : (
          <ul className="toc-list">
            {profile && onUpdateProfile ? <li>
              <button type="button" className="toc-row" onClick={() => setEditing(true)}>
                <Pencil size={18} aria-hidden />
                <span className="toc-row-title">{copy.editProfile}</span>
              </button>
            </li> : null}
            <li>
              <button
                type="button"
                className="toc-row"
                data-sfx="off"
                aria-pressed={muted}
                onPointerDown={(event) => {
                  if (event.button !== 0) return;
                  unlockSound();
                  toggleSoundMuted();
                }}
                onClick={(event) => {
                  if (event.detail !== 0) return;
                  toggleSoundMuted();
                }}
              >
                {muted ? <VolumeX size={18} aria-hidden /> : <Volume2 size={18} aria-hidden />}
                <span className="toc-row-title">{muted ? copy.soundOff : copy.soundOn}</span>
              </button>
            </li>
            <li>
              <button type="button" className="toc-row" onClick={() => setConfirm(true)}>
                <RotateCcw size={18} aria-hidden />
                <span className="toc-row-title">{copy.startAgain}</span>
              </button>
            </li>
          </ul>
        )}
    </Sheet>
  );
}
