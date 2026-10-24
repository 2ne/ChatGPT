import { useId } from "react";
import type { TurnDiagram } from "../../types/activity";

const directions = ["up", "right", "down", "left"];
export function TurnPicture({ turn }: { turn: TurnDiagram }) {
  const id = useId().replace(/:/g, "");
  const sign = turn.clockwise ? 1 : -1;
  const end = (turn.start + sign * turn.quarters + 8) % 4;
  const point = (q: number) => [140 + 99 * Math.sin(q * Math.PI / 2), 140 - 99 * Math.cos(q * Math.PI / 2)];
  // A small gap keeps the arrowhead clear even for one complete revolution.
  const from = point(turn.start + sign * 0.06);
  const to = point(turn.start + sign * (turn.quarters - 0.06));
  const path = `M ${from} A 99 99 0 ${turn.quarters > 2 ? 1 : 0} ${turn.clockwise ? 1 : 0} ${to}`;
  const label = turn.showEnd
    ? `The dashed arrow starts pointing ${directions[turn.start]}. The orange path goes ${turn.clockwise ? "clockwise" : "anti-clockwise"} to the solid arrow pointing ${directions[end]}. ${turn.quarters === 4 ? "The path goes all the way round." : ""}`
    : `The arrow starts pointing ${directions[turn.start]}.`;
  const arrow = (direction: number, start: boolean) => <path d="M 130 195 L 130 115 L 110 115 L 140 77 L 170 115 L 150 115 L 150 195 Z" transform={`rotate(${direction * 90} 140 140)`} fill={start ? "none" : "var(--primary)"} stroke={start ? "var(--ink-soft)" : "var(--primary)"} strokeWidth="3" strokeDasharray={start ? "6 5" : undefined} />;
  return <figure className="turn-picture">
    <svg viewBox="0 0 280 280" role="img" aria-label={label}>
      <defs><marker id={id} viewBox="0 0 10 10" refX="8" refY="5" markerWidth="4" markerHeight="4" orient="auto-start-reverse"><path d="M 0 0 L 10 5 L 0 10 Z" fill="#b97512" /></marker></defs>
      <circle cx="140" cy="140" r="99" fill="var(--paper)" stroke="var(--line)" strokeWidth="2" />
      {[0,1,2,3].map(q => { const [x,y] = point(q);return <circle key={q} cx={x} cy={y} r="4" fill="var(--line-strong)" />; })}
      {turn.showEnd && <path d={path} fill="none" stroke="#b97512" strokeWidth="5" strokeLinecap="round" markerEnd={`url(#${id})`} />}
      {turn.showEnd && arrow(turn.start, true)}
      {arrow(turn.showEnd ? end : turn.start, false)}
    </svg>
    <figcaption>{turn.showEnd ? "Dashed arrow starts. Solid arrow finishes." : "Starting direction"}</figcaption>
  </figure>;
}
