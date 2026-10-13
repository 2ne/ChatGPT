type PipProps = {
  size?: number;
  mood?: "happy" | "cheer" | "think";
  className?: string;
};

/** Pip — Primary Path’s friendly guide (original geometric mascot). */
export function Pip({ size = 40, mood = "happy", className }: PipProps) {
  const lookY = mood === "think" ? 22 : mood === "cheer" ? 20 : 21;
  const smile = mood === "cheer" ? "M26 34c2.2 3.5 9.8 3.5 12 0" : "M28 34c1.6 2.4 6.4 2.4 8 0";

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 64 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden
    >
      {/* soft notebook lines */}
      <path d="M44 18h14M44 24h12M44 30h10" stroke="#d6d8da" strokeWidth="1.5" strokeLinecap="round" />
      {/* cream shard */}
      <path d="M8 40l18-26 6 10-16 22z" fill="#f3e6c8" opacity="0.9" />
      {/* orbit ring */}
      <ellipse
        cx="30"
        cy="34"
        rx="22"
        ry="9"
        transform="rotate(-28 30 34)"
        stroke="#5eb3d4"
        strokeWidth="3.5"
        fill="none"
      />
      {/* body */}
      <path
        d="M30 10l14 8v16l-14 8-14-8V18l14-8z"
        fill="#2f6fed"
      />
      <path
        d="M30 14l10 5.8v12.4L30 38l-10-5.8V19.8L30 14z"
        fill="#1865f2"
      />
      {/* eyes */}
      <circle cx="25" cy={lookY} r="5.2" fill="#fff" />
      <circle cx="35" cy={lookY} r="5.2" fill="#fff" />
      <circle cx="26.2" cy={lookY + 0.6} r="2.1" fill="#21242c" />
      <circle cx="36.2" cy={lookY + 0.6} r="2.1" fill="#21242c" />
      {/* smile */}
      <path d={smile} stroke="#0b2149" strokeWidth="2" strokeLinecap="round" fill="none" />
    </svg>
  );
}
