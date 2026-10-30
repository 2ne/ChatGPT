import type { CSSProperties } from "react";
import { OBJECT_GLYPH, describeArray, describeGroups } from "../../data/objects";
import type { ArrayAsset, GroupsAsset, ObjectItem } from "../../types/activity";

type GroupsPictureProps = {
  groups?: GroupsAsset;
  array?: ArrayAsset;
  compact?: boolean;
  fit?: "card";
};

function Tokens({ item, count, compact }: { item: ObjectItem; count: number; compact?: boolean }) {
  const glyph = OBJECT_GLYPH[item];
  return (
    <>
      {Array.from({ length: count }, (_, index) => (
        <span key={index} className={`object-token${compact ? " is-group-sm" : ""}`} aria-hidden>
          <span className="object-glyph">{glyph}</span>
        </span>
      ))}
    </>
  );
}

export function GroupsPicture({ groups, array, compact, fit }: GroupsPictureProps) {
  const card = fit === "card";
  const small = compact || card;
  if (array) {
    const item = array.item ?? "star";
    const cells = array.rows * array.columns;
    return (
      <span
        className={`array-grid${card ? " is-card" : ""}${compact ? " is-option" : ""}`}
        style={{ gridTemplateColumns: `repeat(${array.columns}, minmax(0, 1fr))` }}
        role="img"
        aria-label={describeArray(array)}
      >
        <Tokens item={item} count={cells} compact={small} />
      </span>
    );
  }
  if (!groups) return null;
  const item = groups.item ?? "star";
  return (
    <span className={`groups-board${card ? " is-card" : ""}${compact ? " is-option" : ""}`} role="img" aria-label={describeGroups(groups)}>
      {groups.sizes.map((size, index) => (
        <span key={`g-${index}`} className="groups-cluster" style={{ "--group-columns": Math.min(size, 5) } as CSSProperties}>
          <Tokens item={item} count={size} compact={small} />
        </span>
      ))}
    </span>
  );
}
