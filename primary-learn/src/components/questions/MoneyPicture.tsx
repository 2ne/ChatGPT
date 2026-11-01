import { useId } from "react";
import type { MoneyAsset } from "../../types/activity";
import { describeMoney, moneyLabel } from "../../lib/money";

const coins: Record<number, { diameter: number; sides?: number; metal: "copper" | "silver" | "gold" }> = {
  1: { diameter: 20.3, metal: "copper" },
  2: { diameter: 25.9, metal: "copper" },
  5: { diameter: 18, metal: "silver" },
  10: { diameter: 24.5, metal: "silver" },
  20: { diameter: 21.4, sides: 7, metal: "silver" },
  50: { diameter: 27.3, sides: 7, metal: "silver" },
  100: { diameter: 23.43, sides: 12, metal: "gold" },
  200: { diameter: 28.4, metal: "gold" },
};
const notes: Record<number, { width: number; height: number; fill: string; line: string }> = {
  5: { width: 125, height: 65, fill: "#c7e5df", line: "#518f85" },
  10: { width: 132, height: 69, fill: "#f0d3b5", line: "#a97747" },
  20: { width: 139, height: 73, fill: "#ddd0eb", line: "#86629f" },
  50: { width: 146, height: 77, fill: "#ebc5ca", line: "#ad6673" },
};

function edge(radius: number, sides: number): string {
  const points = Array.from({ length: sides }, (_, i) => {
    const angle = -Math.PI / 2 + i * 2 * Math.PI / sides;
    return [Math.cos(angle) * radius, Math.sin(angle) * radius];
  });
  // The 20p and 50p use gently curved seven-sided edges.
  const segment = (p: number[]) => sides === 7 ? `A${radius * 1.95} ${radius * 1.95} 0 0 1 ${p.join(" ")}` : `L${p.join(" ")}`;
  return `M${points[0]!.join(" ")} ${[...points.slice(1), points[0]!].map(segment).join(" ")} Z`;
}

/** Educational value faces, with denomination shapes, metals and relative coin sizes. */
export function MoneyPicture({ money, compact }: { money: MoneyAsset[]; compact?: boolean }) {
  const id = `money-${useId().replace(/:/g, "")}`;
  return <svg className={`money-picture${compact ? " is-option" : ""}`} viewBox={`0 0 ${money.length * 160} 104`} role="img" aria-label={describeMoney(money)} focusable="false">
    <defs>
      {[['copper', '#f3c19a', '#bd744b'], ['silver', '#f3f4f5', '#bcc3cb'], ['gold', '#f6dfa0', '#c09a48']].map(([metal, light, dark]) => <linearGradient key={metal} id={`${id}-${metal}`} x1="0" y1="0" x2="1" y2="1"><stop stopColor={light} /><stop offset="1" stopColor={dark} /></linearGradient>)}
    </defs>
    {money.map((item, i) => {
      const x = i * 160 + 80;
      if (item.kind === "note") {
        const note = notes[item.value]!;
        return <g key={i} transform={`translate(${x - note.width / 2} ${(104 - note.height) / 2})`}>
          <rect width={note.width} height={note.height} rx="3" fill={note.fill} stroke={note.line} strokeWidth="2" />
          <rect x="5" y="5" width={note.width - 10} height={note.height - 10} rx="2" fill="none" stroke={note.line} strokeOpacity=".3" />
          <path d={`M8 ${note.height - 9} Q${note.width / 2} 8 ${note.width - 8} ${note.height - 9}`} fill="none" stroke={note.line} strokeOpacity=".2" strokeWidth="6" />
          <rect x={note.width - 32} y="12" width="21" height={note.height - 24} rx="9" fill="#fff" fillOpacity=".65" stroke={note.line} strokeOpacity=".4" />
          <text x="13" y="37" className="money-note-value" fill={note.line}>{moneyLabel(item)}</text>
          <text x="14" y="51" className="money-note-word" fill={note.line}>POUNDS</text>
        </g>;
      }
      const coin = coins[item.value]!;
      const radius = coin.diameter * 1.4;
      const rim = coin.metal === "copper" ? "#925b3d" : coin.metal === "gold" ? "#97772f" : "#7c8793";
      return <g key={i} transform={`translate(${x} 52)`}>
        {coin.sides ? <path d={edge(radius, coin.sides)} fill={`url(#${id}-${coin.metal})`} stroke={rim} strokeWidth="2" /> : <circle r={radius} fill={`url(#${id}-${coin.metal})`} stroke={rim} strokeWidth="2" />}
        {item.value >= 100 ? <circle r={radius * .68} fill={`url(#${id}-silver)`} stroke={rim} strokeWidth="1" /> : coin.sides ? <path d={edge(radius - 4, coin.sides)} fill="none" stroke={rim} strokeWidth=".8" strokeOpacity=".5" /> : <circle r={radius - 4} fill="none" stroke={rim} strokeWidth=".8" strokeOpacity=".5" />}
        <text y={item.value >= 100 ? 8 : 3} textAnchor="middle" className="money-coin-value" fontSize={item.value >= 100 ? 28 : Math.max(26, radius * .85)}>{item.value >= 100 ? moneyLabel(item) : item.value}</text>
        {item.value < 100 ? <text y="16" textAnchor="middle" className="money-coin-word">{item.value === 1 ? "PENNY" : "PENCE"}</text> : null}
      </g>;
    })}
  </svg>;
}
