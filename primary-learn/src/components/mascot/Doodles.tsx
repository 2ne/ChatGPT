type DoodleProps = {
  size?: number;
  className?: string;
};

export function DoodleStar({ size = 20, className }: DoodleProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className} aria-hidden>
      <path
        d="M12 2l2.2 6.4L21 11l-6.2 2.2L12 20l-2.8-6.8L3 11l6.8-2.6L12 2z"
        fill="#ffb100"
      />
    </svg>
  );
}

export function DoodleRocket({ size = 22, className }: DoodleProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className} aria-hidden>
      <path
        d="M14 4c3 2 5 6 5 10l-3 1-2-2-2 2-3-1c0-4 2-8 5-10z"
        stroke="#14bf96"
        strokeWidth="2"
        strokeLinejoin="round"
      />
      <circle cx="14" cy="10" r="1.4" fill="#14bf96" />
      <path d="M9 15l-2 4M13 17l1 3" stroke="#14bf96" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

export function DoodleShape({ size = 16, className }: DoodleProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className} aria-hidden>
      <rect x="3" y="3" width="10" height="10" rx="2" fill="#f071a8" />
      <path d="M14 9l5 3.2-5 3.2V9z" fill="#ff8a3d" />
    </svg>
  );
}

/** Tiny friendly cluster for corners of cards — keep sparse. */
export function DoodleCluster({ variant = "a" }: { variant?: "a" | "b" | "c" }) {
  if (variant === "b") {
    return (
      <span className="doodle-cluster" aria-hidden>
        <DoodleRocket size={18} />
        <DoodleStar size={14} />
      </span>
    );
  }
  if (variant === "c") {
    return (
      <span className="doodle-cluster" aria-hidden>
        <DoodleStar size={16} />
        <DoodleShape size={14} />
      </span>
    );
  }
  return (
    <span className="doodle-cluster" aria-hidden>
      <DoodleStar size={16} />
      <DoodleRocket size={18} />
    </span>
  );
}
