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
 * Brief stem reveal for subitising. Shows the picture, then covers it with a
 * full-size Look again control. Later peeks are shorter. Cap peeks so kids
 * cannot count one by one. Reduced-motion skips the shutter animation but
 * still covers after the flash.
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
      <div className="flash-stage">{children}</div>
      {covered ? (
        canPeek ? (
          <button
            type="button"
            className="flash-cover"
            onClick={() => setPeeksUsed((n) => n + 1)}
          >
            <Eye size={20} aria-hidden />
            {copy.lookAgain}
          </button>
        ) : (
          <div className="flash-cover is-done" aria-hidden />
        )
      ) : null}
    </div>
  );
}
