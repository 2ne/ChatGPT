import hand1 from "../../assets/hands/hand-1.webp";
import hand2 from "../../assets/hands/hand-2.webp";
import hand3 from "../../assets/hands/hand-3.webp";
import hand4 from "../../assets/hands/hand-4.webp";
import hand5 from "../../assets/hands/hand-5.webp";

const HANDS = [hand1, hand2, hand3, hand4, hand5];

/** Shared transparent hand artwork. The surrounding group supplies its accessible label. */
export function FingerHand({ count }: { count: number }) {
  const n = Math.max(0, Math.min(5, Math.round(count)));
  // The supplied artwork covers 1 to 5. Never depict a raised finger for zero.
  if (n === 0) return <span className="finger-hand-zero" aria-hidden>0</span>;
  return <img className="finger-hand-image" src={HANDS[n - 1]} width={352} height={368}
    alt="" aria-hidden draggable={false} decoding="async" />;
}
