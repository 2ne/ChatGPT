import { useEffect, useState, type ReactNode } from "react";
import { Eye } from "lucide-react";
import { copy } from "../../data/copy";
import { useFlashPeek } from "./flashPeek";

type FlashRevealProps = {
  /** When set, show children briefly then hide. Omit to always show. */
  flashMs?: number;
  children: ReactNode;
};

/**
 * Brief stem reveal for subitising. Auto-hides after flashMs with a 3D flip
 * onto a purple Look again face. Later peeks are shorter. Look again is
 * unlimited. Picture stays in the layout so the page does not jump.
 */
export function FlashReveal({ flashMs, children }: FlashRevealProps) {
  const { lookAgainCount, recordLookAgain } = useFlashPeek();
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    if (flashMs == null) {
      setVisible(true);
      return;
    }
    setVisible(true);
    const duration =
      lookAgainCount === 0 ? flashMs : Math.max(400, Math.round(flashMs * 0.65));
    const id = window.setTimeout(() => setVisible(false), duration);
    return () => window.clearTimeout(id);
  }, [flashMs, lookAgainCount]);

  if (flashMs == null) return <>{children}</>;

  const covered = !visible;

  return (
    <div className={`flash-reveal${covered ? " is-covered" : " is-open"}`}>
      <div className="flash-card">
        <div className="flash-face flash-face-front">{children}</div>
        <div className="flash-face flash-face-back" aria-hidden={!covered}>
          <button
            type="button"
            className="flash-look-again"
            tabIndex={covered ? 0 : -1}
            onClick={() => recordLookAgain()}
          >
            <Eye size={20} aria-hidden />
            {copy.lookAgain}
          </button>
        </div>
      </div>
    </div>
  );
}
