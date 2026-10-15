import { outputs } from "../data/matter";

type Props = {
  onPrepare: () => void;
};

export function ReadinessView({ onPrepare }: Props) {
  return (
    <div className="workspace-inner">
      <p className="eyebrow">Towards a pilot</p>
      <h1 className="display text-[1.85rem]">You’re in much better shape for a pilot now.</h1>
      <p className="lede">
        These are drafts for people to use. Nothing here is an approval. Risk, InfoSec and legal
        still decide.
      </p>

      <div className="outputs">
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
