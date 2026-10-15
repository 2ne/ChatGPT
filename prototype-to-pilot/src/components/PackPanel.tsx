import { openItems, type DecisionId, type DecisionRecord } from "../data/decisions";
import { outputsFromTrail } from "../data/matter";
import type { CommitRecord } from "../types";

type Props = {
  trail: DecisionRecord[];
  commits: CommitRecord[];
  onOpenItem: (id: DecisionId) => void;
  onPrepare: () => void;
  packed: boolean;
};

export function PackPanel({ trail, commits, onOpenItem, onPrepare, packed }: Props) {
  const outputs = outputsFromTrail(trail);
  const open = openItems(trail);

  return (
    <div className="pack-panel">
      <p className="pack-banner">Draft for human review · not an approval</p>
      <h2>Matter Brief · pilot pack</h2>
      <p className="pack-lede">
        {commits.length} commit{commits.length === 1 ? "" : "s"} on <strong>pilot-ready</strong>. Use
        the Hackathon / Pilot toggle to see the prototype before and after.
      </p>

      <ul className="pack-outputs">
        {outputs.map((item) => (
          <li key={item.id}>
            <div>
              <strong>{item.title}</strong>
              <span>{item.note}</span>
            </div>
            <em className={`status status-${item.tone}`}>{item.status}</em>
          </li>
        ))}
      </ul>

      {open.length > 0 ? (
        <div className="pack-open">
          <p className="flow-title">Still open</p>
          <ul>
            {open.map((item) => (
              <li key={item.id}>
                <button type="button" className="open-action" onClick={() => onOpenItem(item.id)}>
                  {item.line}
                  {item.owner ? ` — ${item.owner}` : ""}
                </button>
              </li>
            ))}
          </ul>
        </div>
      ) : (
        <p className="note">Nothing left open in this pass. Approvals remain human.</p>
      )}

      {!packed ? (
        <button type="button" className="primary-btn" onClick={onPrepare}>
          Prepare pilot pack
        </button>
      ) : null}
    </div>
  );
}
