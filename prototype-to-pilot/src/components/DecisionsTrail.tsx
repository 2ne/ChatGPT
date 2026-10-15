import { lockedCount, openItems, settledItems, type DecisionRecord } from "../data/decisions";

type Props = {
  trail: DecisionRecord[];
};

export function DecisionsTrail({ trail }: Props) {
  const settled = settledItems(trail);
  const open = openItems(trail);
  const waiting = lockedCount(trail);

  if (settled.length === 0 && open.length === 0) return null;

  return (
    <aside className="decisions-trail" aria-label="Decisions">
      <div className="trail-head">
        <span>Decisions</span>
        <span>Still open · {open.length}</span>
      </div>
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
          {open.map((item) => (
            <li key={item.id} className={`trail-item open${item.status === "needs-owner" ? " owner" : ""}`}>
              {item.line}
              {item.status === "needs-owner" && item.owner ? ` · ${item.owner}` : null}
            </li>
          ))}
        </ul>
      ) : null}
      {waiting > 0 ? (
        <p className="trail-waiting">
          {waiting} waiting on {waiting === 1 ? "an earlier answer" : "earlier answers"}
        </p>
      ) : null}
    </aside>
  );
}
