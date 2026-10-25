import type { CSSProperties } from "react";
import { OBJECT_FILL, describeTenFrame } from "../../data/objects";
import type { ObjectItem, TenFrameAsset } from "../../types/activity";

const CELLS = 10;

type TenFrameProps = {
  frame: TenFrameAsset;
  /** Smaller cells for A/B/C/D and match cards. */
  compact?: boolean;
};

function Frame({ filled }: { filled: number }) {
  return (
    <span className="ten-frame" aria-hidden>
      {Array.from({ length: CELLS }, (_, index) => (
        <span
          key={index}
          className={`ten-frame-cell${index < filled ? " is-filled" : " is-empty"}${
            index >= 5 ? " is-lower" : ""
          }`}
        />
      ))}
    </span>
  );
}

export function TenFrame({ frame, compact }: TenFrameProps) {
  const count = Math.max(0, Math.min(20, Math.floor(frame.count)));
  const item: ObjectItem = frame.item ?? "apple";
  const first = Math.min(count, 10);
  const second = Math.max(0, count - 10);
  const two = count > 10;
  return (
    <span
      className={`ten-frame-board${compact ? " is-compact" : ""}`}
      aria-label={describeTenFrame({ count, item })}
      style={{ "--tf-fill": OBJECT_FILL[item] } as CSSProperties}
    >
      <Frame filled={first} />
      <span className={`ten-frame-slot${two ? "" : " is-pad"}`} aria-hidden>
        <Frame filled={second} />
      </span>
    </span>
  );
}
