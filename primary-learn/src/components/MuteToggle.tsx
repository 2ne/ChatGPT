import { useEffect, useState } from "react";
import { Volume2, VolumeX } from "lucide-react";
import { copy } from "../data/copy";
import {
  isSoundMuted,
  subscribeSoundMuted,
  toggleSoundMuted,
  unlockSound,
} from "../lib/sound";

type MuteToggleProps = {
  className?: string;
};

export function MuteToggle({ className }: MuteToggleProps) {
  const [muted, setMuted] = useState(isSoundMuted);

  useEffect(() => subscribeSoundMuted(setMuted), []);

  return (
    <button
      type="button"
      className={`mute-btn${className ? ` ${className}` : ""}`}
      data-sfx="off"
      aria-pressed={muted}
      aria-label={muted ? copy.soundOff : copy.soundOn}
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
    </button>
  );
}
