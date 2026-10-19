import { useEffect, useState, type ReactNode } from "react";
import { copy } from "../../data/copy";

type FlashRevealProps = {
  /** When set, show children briefly then hide. Omit to always show. */
  flashMs?: number;
  /** Cup-style cover copy when hidden. */
  coveredLabel?: string;
  children: ReactNode;
};

/**
 * Brief stem reveal for subitising. Auto-hides after flashMs.
 * Reduced-motion users keep the picture visible.
 */
export function FlashReveal({ flashMs, coveredLabel, children }: FlashRevealProps) {
  const [visible, setVisible] = useState(true);
  const [tick, setTick] = useState(0);

  useEffect(() => {
    if (flashMs == null) {
      setVisible(true);
      return;
    }
    const reduce =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) {
      setVisible(true);
      return;
    }
    setVisible(true);
    const id = window.setTimeout(() => setVisible(false), flashMs);
    return () => window.clearTimeout(id);
  }, [flashMs, tick]);

  if (flashMs == null) return <>{children}</>;

  if (visible) {
    return <div className="flash-reveal is-open">{children}</div>;
  }

  return (
    <div className="flash-reveal is-covered">
      <p className="flash-cover-label" aria-live="polite">
        {coveredLabel ?? copy.pictureHidden}
      </p>
      <button
        type="button"
        className="btn-secondary flash-look-again"
        onClick={() => setTick((n) => n + 1)}
      >
        {copy.lookAgain}
      </button>
    </div>
  );
}
