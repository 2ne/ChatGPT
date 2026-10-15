import { openItems, settledItems, type DecisionRecord } from "../data/decisions";
import { outputs } from "../data/matter";

type Props = {
  trail: DecisionRecord[];
  onPrepare: () => void;
};

export function ReadinessView({ trail, onPrepare }: Props) {
  const open = openItems(trail);
  const settled = settledItems(trail);

  return (
    <div className="workspace-inner">
      <p className="eyebrow">Towards a pilot</p>
      <h1 className="display text-[1.85rem]">You’re in much better shape for a pilot now.</h1>
      <p className="lede">
        These are drafts for people to use. Nothing here is an approval. Risk, InfoSec and legal
        still decide.
      </p>

      {settled.length > 0 ? (
        <>
          <h2 className="flow-title">Decisions made</h2>
          <ul className="ready-list">
            {settled.map((item) => (
              <li key={item.id}>{item.line}</li>
            ))}
          </ul>
        </>
      ) : null}

      {open.length > 0 ? (
        <>
          <h2 className="flow-title" style={{ marginTop: "1.15rem" }}>
            Still open
          </h2>
          <ul className="ready-list">
            {open.map((item) => (
              <li key={item.id}>
                {item.line}
                {item.owner ? ` — ${item.owner}` : null}
              </li>
            ))}
          </ul>
        </>
      ) : null}

      <div className="outputs" style={{ marginTop: "1.2rem" }}>
        {outputs.map((item) => (
          <article key={item.id} className="output">
            <div>
              <h3>{item.title}</h3>
              <p>{item.note}</p>
            </div>
            <span className={`status status-${item.tone}`}>{item.status}</span>
          </article>
        ))}
      </div>

      <button type="button" className="primary-btn" onClick={onPrepare}>
        Prepare pilot pack
      </button>
    </div>
  );
}
