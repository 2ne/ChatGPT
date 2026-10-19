import { useEffect, useState, type ReactNode } from "react";
import { Eye } from "lucide-react";
import { copy } from "../../data/copy";

type FlashRevealProps = {
  /** When set, show children briefly then hide. Omit to always show. */
  flashMs?: number;
  children: ReactNode;
};

const MAX_LOOK_AGAIN = 2;

/**
 * Brief stem reveal for subitising. Auto-hides after flashMs with a 3D flip
 * onto a purple Look again face. Later peeks are shorter. Cap peeks so kids
 * cannot count one by one. Picture stays in the layout so the page does not jump.
 */
export function FlashReveal({ flashMs, children }: FlashRevealProps) {
  const [visible, setVisible] = useState(true);
  const [peeksUsed, setPeeksUsed] = useState(0);

  useEffect(() => {
    if (flashMs == null) {
      setVisible(true);
      return;
    }
    setVisible(true);
    const duration = peeksUsed === 0 ? flashMs : Math.max(400, Math.round(flashMs * 0.65));
    const id = window.setTimeout(() => setVisible(false), duration);
    return () => window.clearTimeout(id);
  }, [flashMs, peeksUsed]);

  if (flashMs == null) return <>{children}</>;

  const canPeek = peeksUsed < MAX_LOOK_AGAIN;
  const covered = !visible;

  return (
    <div className={`flash-reveal${covered ? " is-covered" : " is-open"}`}>
      <div className="flash-card">
        <div className="flash-face flash-face-front">{children}</div>
        <div className="flash-face flash-face-back" aria-hidden={!covered}>
          {canPeek ? (
            <button
              type="button"
              className="flash-look-again"
              tabIndex={covered ? 0 : -1}
              onClick={() => setPeeksUsed((n) => n + 1)}
            >
              <Eye size={20} aria-hidden />
              {copy.lookAgain}
            </button>
          ) : (
            <div className="flash-look-again is-done" aria-hidden />
          )}
        </div>
      </div>
    </div>
  );
}
