import { Volume2, VolumeX } from "lucide-react";
import { copy } from "../data/copy";
import { tokenizeSpoken, wordIndexAt } from "../lib/speech";

type SpokenWordsProps = {
  display: string;
  spoken: string;
  charIndex: number;
};

export function SpokenWords({ display, spoken, charIndex }: SpokenWordsProps) {
  const spokenWord = wordIndexAt(spoken, charIndex);
  const tokens = tokenizeSpoken(display);
  const highlight = spokenWord >= 0 && spokenWord < tokens.filter((token) => token.kind === "word").length
    ? spokenWord
    : -1;

  return (
    <>
      {tokens.map((token, index) =>
        token.kind === "space" ? (
          token.value
        ) : (
          <span key={`${token.start}-${index}`} className={token.wordIndex === highlight ? "speak-word is-on" : undefined}>
            {token.value}
          </span>
        ),
      )}
    </>
  );
}

type HearButtonProps = {
  playing: boolean;
  onClick: () => void;
  label?: string;
  compact?: boolean;
};

export function HearButton({ playing, onClick, label = copy.hearIt, compact }: HearButtonProps) {
  return (
    <button
      type="button"
      className={`hear-btn${compact ? " is-compact" : ""}${playing ? " is-on" : ""}`}
      onClick={onClick}
      aria-pressed={playing}
      aria-label={playing ? copy.stopReadingAria : label}
    >
      {playing ? <VolumeX size={compact ? 16 : 18} aria-hidden /> : <Volume2 size={compact ? 16 : 18} aria-hidden />}
      <span>{playing ? copy.stopReading : label}</span>
    </button>
  );
}
