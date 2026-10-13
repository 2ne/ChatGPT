export type PipMood = "happy" | "cheer" | "think";

type PipProps = {
  size?: number;
  mood?: PipMood;
  className?: string;
};

/**
 * Pip — Primary Maths' friendly guide.
 * A round "path-berry" blob: deep indigo body, sunny spark, sprout of growth.
 * Pure SVG + CSS motion (blink, cheer hop, think tilt). No WebGL.
 */
export function Pip({ size = 44, mood = "happy", className }: PipProps) {
  const gid = `pip-${size}-${mood}`;
  const eyesY = mood === "think" ? 46 : 43;
  const pupilDx = mood === "think" ? 3 : 0.8;
  const pupilDy = mood === "think" ? -1 : 1;
  const mouth =
    mood === "cheer"
      ? "M38 60c3 7 21 7 24 0 1.6-3.6-1.4-7-5-7H43c-3.6 0-6.6 3.4-5 7z"
      : mood === "think"
        ? "M44 62c2.5 1.8 9.5 1.8 12 0"
        : "M40 60c2.6 4.4 13.4 4.4 16 0";
  const mouthFill = mood === "cheer" ? "#3B2E7A" : "none";
  const mouthStroke = mood === "cheer" ? "none" : "#3B2E7A";
  const classes = ["pip", `pip-${mood}`, className].filter(Boolean).join(" ");

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 96 96"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={classes}
      aria-hidden
      role="presentation"
    >
      <defs>
        <linearGradient id={`${gid}-body`} x1="20" y1="12" x2="76" y2="88" gradientUnits="userSpaceOnUse">
          <stop stopColor="#6D5CFF" />
          <stop offset="0.55" stopColor="#4F46E5" />
          <stop offset="1" stopColor="#3B33B8" />
        </linearGradient>
        <linearGradient id={`${gid}-belly`} x1="48" y1="58" x2="48" y2="88" gradientUnits="userSpaceOnUse">
          <stop stopColor="#FFFFFF" stopOpacity="0.32" />
          <stop offset="1" stopColor="#FFFFFF" stopOpacity="0.08" />
        </linearGradient>
      </defs>

      {/* ground shadow */}
      <ellipse cx="48" cy="88" rx="24" ry="5" fill="#232946" opacity="0.12" />

      {/* sprout */}
      <g className="pip-sprout">
        <path d="M48 14c0-4 0-7 0-9" stroke="#10B981" strokeWidth="3.5" strokeLinecap="round" />
        <path d="M48 8C48 4 44 1.5 38.5 2.5c.8 4.5 4.5 6.5 9.5 5.5z" fill="#34D399" />
        <path d="M48 8c0-4 4-6.5 9.5-5.5C56.7 7 53 9 48 8z" fill="#10B981" />
      </g>

      {/* arms */}
      <ellipse className="pip-arm pip-arm-left" cx="15" cy="58" rx="7" ry="10" fill="#4338CA" transform="rotate(18 15 58)" />
      <ellipse className="pip-arm pip-arm-right" cx="81" cy="58" rx="7" ry="10" fill="#4338CA" transform="rotate(-18 81 58)" />

      {/* body */}
      <path
        d="M48 12C67 12 82 28 82 50c0 20-15 34-34 34S14 70 14 50C14 28 29 12 48 12z"
        fill={`url(#${gid}-body)`}
      />
      {/* glossy highlight */}
      <ellipse cx="33" cy="30" rx="10" ry="13" fill="#FFFFFF" opacity="0.22" transform="rotate(-18 33 30)" />
      {/* belly glow */}
      <ellipse cx="48" cy="72" rx="20" ry="11" fill={`url(#${gid}-belly)`} />

      {/* cheeks */}
      <ellipse cx="27" cy="56" rx="6" ry="4.4" fill="#FF9EBB" opacity="0.85" />
      <ellipse cx="69" cy="56" rx="6" ry="4.4" fill="#FF9EBB" opacity="0.85" />

      {/* eyes */}
      <g className="pip-eyes">
        <circle cx="35" cy={eyesY} r="10.5" fill="#fff" />
        <circle cx="61" cy={eyesY} r="10.5" fill="#fff" />
        <circle cx={35 + pupilDx} cy={eyesY + pupilDy} r="4.8" fill="#232946" />
        <circle cx={61 + pupilDx} cy={eyesY + pupilDy} r="4.8" fill="#232946" />
        <circle cx={35 + pupilDx - 1.4} cy={eyesY + pupilDy - 1.6} r="1.6" fill="#fff" />
        <circle cx={61 + pupilDx - 1.4} cy={eyesY + pupilDy - 1.6} r="1.6" fill="#fff" />
      </g>

      {/* mouth */}
      <path
        d={mouth}
        stroke={mouthStroke}
        strokeWidth="2.8"
        strokeLinecap="round"
        fill={mouthFill}
      />
      {mood === "cheer" ? (
        <ellipse cx="50" cy="63.5" rx="4.5" ry="2.8" fill="#FF8FA3" opacity="0.9" />
      ) : null}

      {/* sunny spark badge */}
      <g className="pip-spark" transform="translate(66 68)">
        <path
          d="M0-9l2.2 5.2L7.5-2l-5 2.6L0 6l-2.5-5.4L-7.5-2l5.3-1.8z"
          fill="#FFC93C"
          stroke="#fff"
          strokeWidth="1.4"
          strokeLinejoin="round"
        />
      </g>
    </svg>
  );
}
