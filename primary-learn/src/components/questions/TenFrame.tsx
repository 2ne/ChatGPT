import { describeTenFrame } from "../../data/objects";
import type { ObjectItem, TenFrameAsset } from "../../types/activity";

const CELLS = 10;
/** Column-wise ranks so pairs sit one above the other. */
const PAIR_RANK = [0, 2, 4, 6, 8, 1, 3, 5, 7, 9];

type TenFrameProps = {
  frame: TenFrameAsset;
  /** Smaller cells for A/B/C/D and match cards. */
  compact?: boolean;
};

function cellClass(rank: number, count: number, partA: number | null): string {
  if (rank >= count) return " is-empty";
  if (partA == null || rank < partA) return " is-filled";
  return " is-part-b";
}

function Frame({
  offset,
  count,
  partA,
  pairs,
}: {
  offset: number;
  count: number;
  partA: number | null;
  pairs: boolean;
}) {
  return (
    <span className="ten-frame" aria-hidden>
      {Array.from({ length: CELLS }, (_, index) => {
        const rank = offset + (pairs ? PAIR_RANK[index] : index);
        return (
          <span
            key={index}
            className={`ten-frame-cell${cellClass(rank, count, partA)}${
              index >= 5 ? " is-lower" : ""
            }`}
          />
        );
      })}
    </span>
  );
}

export function TenFrame({ frame, compact }: TenFrameProps) {
  const count = Math.max(0, Math.min(20, Math.floor(frame.count)));
  const item: ObjectItem = frame.item ?? "apple";
  const partA = frame.parts ? frame.parts[0] : null;
  const pairs = frame.pairs === true;
  const two = count > 10;
  return (
    <span
      className={`ten-frame-board${compact ? " is-compact" : ""}`}
      aria-label={describeTenFrame({ count, item, parts: frame.parts, pairs })}
    >
      <Frame offset={0} count={count} partA={partA} pairs={pairs} />
      <span className={`ten-frame-slot${two ? "" : " is-pad"}`} aria-hidden>
        <Frame offset={10} count={count} partA={partA} pairs={pairs} />
      </span>
    </span>
  );
}
