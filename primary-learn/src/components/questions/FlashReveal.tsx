import { useEffect, useState, type ReactNode } from "react";
import { Eye } from "lucide-react";
import { copy } from "../../data/copy";

type FlashRevealProps = {
  /** When set, show children briefly then hide. Omit to always show. */
  flashMs?: number;
  children: ReactNode;
};

/**
 * Brief stem reveal for subitising. Auto-hides after flashMs with a 3D flip.
 * Picture stays in the layout so the page does not jump. Reduced-motion
 * users keep the picture visible. Covered face is just Look again.
 */
export function FlashReveal({ flashMs, children }: FlashRevealProps) {
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

  return (
    <div className={`flash-reveal${visible ? " is-open" : " is-covered"}`}>
      <div className="flash-card">
        <div className="flash-face flash-face-front">{children}</div>
        <div className="flash-face flash-face-back" aria-hidden={visible}>
          <button
            type="button"
            className="flash-look-again"
            tabIndex={visible ? -1 : 0}
            onClick={() => setTick((n) => n + 1)}
          >
            <Eye size={18} aria-hidden />
            {copy.lookAgain}
          </button>
        </div>
      </div>
    </div>
  );
}
