import { describeBaseTen } from "../../data/objects";
import type { BaseTenAsset } from "../../types/activity";

const ROD_SEGS = 10;

type BaseTenProps = {
  model: BaseTenAsset;
  compact?: boolean;
};

function Rod({
  segmented,
}: {
  segmented: boolean;
}) {
  if (!segmented) {
    return <span className="base-ten-rod is-plain" aria-hidden />;
  }
  return (
    <span className="base-ten-rod is-segmented" aria-hidden>
      {Array.from({ length: ROD_SEGS }, (_, index) => (
        <span
          key={index}
          className={`base-ten-seg${index >= 5 ? " is-upper" : " is-lower"}`}
        />
      ))}
    </span>
  );
}

export function BaseTen({ model, compact }: BaseTenProps) {
  const tens = Math.max(0, Math.min(9, Math.floor(model.tens)));
  const ones = Math.max(0, Math.min(9, Math.floor(model.ones)));
  const segmented = (model.style ?? "segmented") === "segmented";
  return (
    <span
      className={`base-ten${compact ? " is-compact" : ""}${
        segmented ? " is-segmented" : " is-plain"
      }`}
      aria-label={describeBaseTen({ tens, ones, style: model.style })}
    >
      <span className="base-ten-rods" aria-hidden>
        {Array.from({ length: tens }, (_, index) => (
          <Rod key={index} segmented={segmented} />
        ))}
      </span>
      <span className="base-ten-ones" aria-hidden>
        {Array.from({ length: ones }, (_, index) => (
          <span key={index} className="base-ten-one" />
        ))}
      </span>
    </span>
  );
}
