import { useEffect, useRef, useState } from "react";
import { RotateCw } from "lucide-react";
import type { CSSProperties } from "react";
import type { TurnDiagram } from "../../types/activity";
import { usePrefersReducedMotion } from "../../hooks/usePrefersReducedMotion";

export const directions = ["Up", "Right", "Down", "Left"];
export function ToyCar({ direction = 0 }: { direction?: number }) {
  return <svg viewBox="0 0 180 180" role="img" aria-label={`Car facing ${directions[((direction % 4) + 4) % 4]?.toLowerCase() ?? "up"}`}>
    <g transform={`rotate(${direction * 90} 90 90)`}>
      <path d="M66 30 L53 3 L89 3 L80 30 Z M100 30 L91 3 L127 3 L114 30 Z" fill="#ffcf45" opacity=".45"/>
      <ellipse cx="92" cy="99" rx="38" ry="62" fill="#232946" opacity=".12" />
      <g fill="#232946"><rect x="48" y="45" width="16" height="29" rx="5"/><rect x="116" y="45" width="16" height="29" rx="5"/><rect x="48" y="111" width="16" height="29" rx="5"/><rect x="116" y="111" width="16" height="29" rx="5"/></g>
      <rect x="59" y="25" width="62" height="132" rx="23" fill="#e9a34c" stroke="#9c601f" strokeWidth="3"/>
      <path d="M68 66 L74 50 H106 L112 66 L107 92 H73 Z" fill="#c9eeff" stroke="#9c601f" strokeWidth="3"/>
      <rect x="72" y="102" width="36" height="29" rx="7" fill="#fff1c4"/>
      <path d="M82 44 L90 36 L98 44" fill="none" stroke="#9c601f" strokeWidth="3" strokeLinecap="round"/>
      <rect x="66" y="144" width="13" height="6" rx="2" fill="#e03131"/><rect x="101" y="144" width="13" height="6" rx="2" fill="#e03131"/>
    </g>
  </svg>;
}
export function TurnPicture({ turn, steps }: { turn: TurnDiagram; steps?: number }) {
  const reduced = usePrefersReducedMotion();
  const car = useRef<HTMLDivElement>(null);
  const [replay, setReplay] = useState(0);
  const delta = turn.showEnd ? (turn.clockwise ? 1 : -1) * turn.quarters : steps ?? 0;
  useEffect(() => {
    if (!turn.showEnd || reduced) return;
    const animation = car.current?.animate([
      { transform: `rotate(${turn.start * 90}deg)` },
      { transform: `rotate(${(turn.start + delta) * 90}deg)` },
    ], { duration: turn.quarters * 650, delay: 450, easing: "ease-in-out", fill: "backwards" });
    return () => animation?.cancel();
  }, [turn.start, turn.quarters, turn.showEnd, delta, reduced, replay]);
  const end = (turn.start + delta + 8) % 4;
  return <figure className="car-turn">
    <div className="car-turn-stage" role="img" aria-label={`The car starts facing ${directions[turn.start].toLowerCase()}.${turn.showEnd || steps != null ? ` It turns ${Math.abs(delta)} quarter steps ${delta < 0 ? "anti-clockwise" : "clockwise"} and finishes facing ${directions[end].toLowerCase()}.` : ""}`}>
      <div className="car-turn-ghost" style={{ transform: `rotate(${turn.start * 90}deg)` }} aria-hidden><ToyCar /></div>
      <div ref={car} className="car-turn-car" style={{ transform: `rotate(${(turn.start + delta) * 90}deg)`, "--turn-duration": steps != null ? "250ms" : "0ms" } as CSSProperties} aria-hidden><ToyCar /></div>
    </div>
    {turn.showEnd ? <button className="btn btn-ghost turn-replay" type="button" onClick={() => setReplay(x => x + 1)}><RotateCw size={20} aria-hidden />Watch again</button> : null}
  </figure>;
}
