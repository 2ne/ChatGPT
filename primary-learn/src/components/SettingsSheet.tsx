import { useEffect, useRef, useState } from "react";
import { RotateCcw, Volume2, VolumeX, X } from "lucide-react";
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
  onClose: () => void;
  onReset: () => void;
};

export function SettingsSheet({ open, learnerName, onClose, onReset }: SettingsSheetProps) {
  const closeRef = useRef<HTMLButtonElement>(null);
  const returnFocus = useRef<HTMLElement | null>(null);
  const closeHandler = useRef(onClose);
  closeHandler.current = onClose;
  const [confirm, setConfirm] = useState(false);
  const [muted, setMuted] = useState(isSoundMuted);

  useEffect(() => subscribeSoundMuted(setMuted), []);

  useEffect(() => {
    if (!open) {
      setConfirm(false);
      return;
    }
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
  }, [open]);

  if (!open) return null;

  return (
    <div className="sheet-layer" onClick={onClose}>
      <div
        className="sheet"
        role="dialog"
        aria-modal="true"
        aria-labelledby="settings-title"
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

        <h2 id="settings-title" className="sheet-title toc-title">
          {copy.settings}
        </h2>
        <p className="settings-hello">{learnerName}</p>

        {confirm ? (
          <div className="sheet-note">
            <Pip size={64} mood="think" />
            <div>
              <p className="t-body">{copy.resetAsk}</p>
              <p className="t-body">{copy.resetNote}</p>
            </div>
          </div>
        ) : null}

        {confirm ? (
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
      </div>
    </div>
  );
}
