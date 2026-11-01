import type { ClockAsset } from "../../types/activity";
import { clockLabel } from "../../lib/clock";

/** Both hands use the same time, so half past always moves the hour hand halfway. */
export function ClockPicture({ clock, compact }: { clock: ClockAsset; compact?: boolean }) {
  const hourAngle = clock.hour * 30 + clock.minute / 2;
  const label = clock.showMinute === false ? `Short hour hand showing ${clockLabel(clock)}` : clockLabel(clock);
  return <svg className={`clock-picture${compact ? " is-option" : ""}`} viewBox="0 0 300 300" role="img" aria-label={label} focusable="false">
    <circle cx="150" cy="150" r="142" fill="#fffaf0" stroke="#ded4bb" strokeWidth="5" />
    {Array.from({ length: 12 }, (_, i) => {
      const hour = i + 1;
      const angle = hour * Math.PI / 6;
      return <g key={hour}>
        <line x1={150 + Math.sin(angle) * 131} y1={150 - Math.cos(angle) * 131} x2={150 + Math.sin(angle) * 135} y2={150 - Math.cos(angle) * 135} stroke="#b2a98f" strokeWidth="3" />
        <text x={150 + Math.sin(angle) * 109} y={150 - Math.cos(angle) * 109} textAnchor="middle" dominantBaseline="central" className="clock-number">{hour}</text>
      </g>;
    })}
    <line x1="150" y1="157" x2="150" y2="84" transform={`rotate(${hourAngle} 150 150)`} className="clock-hour" />
    {clock.showMinute !== false ? <line x1="150" y1="158" x2="150" y2="57" transform={`rotate(${clock.minute * 6} 150 150)`} className="clock-minute" /> : null}
    <circle cx="150" cy="150" r="8" fill="#282b49" />
  </svg>;
}
