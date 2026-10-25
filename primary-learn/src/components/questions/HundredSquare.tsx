import type { HundredSquareAsset } from "../../types/activity";
import { describeHundredSquare } from "../../data/objects";

export function HundredSquare({ square }: { square: HundredSquareAsset }) {
  const cells = square.rows * 10;
  const values = Array.from({ length: cells }, (_, index) => square.start + index);
  return (
    <div className="hundred-square" role="img" aria-label={describeHundredSquare(square)}>
      {values.map((value) => {
        const missing = value === square.missing;
        const highlight = value === square.highlight;
        return (
          <span
            key={value}
            className={`hundred-square-cell${missing ? " is-missing" : ""}${highlight ? " is-on" : ""}`}
            aria-hidden
          >
            {missing ? "?" : value}
          </span>
        );
      })}
    </div>
  );
}
