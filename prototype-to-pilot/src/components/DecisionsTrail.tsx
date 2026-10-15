import { lockedCount, openItems, settledItems, type DecisionId, type DecisionRecord } from "../data/decisions";

type Props = {
  trail: DecisionRecord[];
  interactive?: boolean;
  onOpenItem?: (id: DecisionId) => void;
};

export function DecisionsTrail({ trail, interactive = false, onOpenItem }: Props) {
  const settled = settledItems(trail);
  const open = openItems(trail);
  const waiting = lockedCount(trail);

  if (settled.length === 0 && open.length === 0) return null;

  return (
    <aside className="decisions-rail" aria-label="Decisions">
      <div className="trail-head">
        <span>Decisions</span>
        <span>Still open · {open.length}</span>
      </div>
      <div className="trail-scroll">
        {settled.length > 0 ? (
          <ul className="trail-list">
            {settled.map((item) => (
              <li key={item.id} className="trail-item settled">
                {item.line}
              </li>
            ))}
          </ul>
        ) : null}
        {open.length > 0 ? (
          <ul className="trail-list">
            {open.map((item) => {
              const clickable = interactive && onOpenItem;
              const className = `trail-item open${item.status === "needs-owner" ? " owner" : ""}${clickable ? " action" : ""}`;
              const label = `${item.line}${item.status === "needs-owner" && item.owner ? ` · ${item.owner}` : ""}`;
              return (
                <li key={item.id}>
                  {clickable ? (
                    <button type="button" className={className} onClick={() => onOpenItem(item.id)}>
                      {label}
                    </button>
                  ) : (
                    <span className={className}>{label}</span>
                  )}
                </li>
              );
            })}
          </ul>
        ) : null}
        {waiting > 0 ? (
          <p className="trail-waiting">
            {waiting} waiting on {waiting === 1 ? "an earlier answer" : "earlier answers"}
          </p>
        ) : null}
      </div>
    </aside>
  );
}
