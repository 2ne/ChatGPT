import { inspectCards } from "../data/inspection";

type Props = {
  visible: number;
  highlightRisk: boolean;
};

export function InspectionView({ visible, highlightRisk }: Props) {
  const cards = inspectCards.slice(0, visible);

  return (
    <div className="workspace-inner">
      <p className="eyebrow">Matter Brief</p>
      <h1 className="display text-[1.85rem]">How this actually works</h1>
      <p className="lede">
        A fast pass over purpose, people, technology and data — not a questionnaire. The first
        blocker is already visible.
      </p>
      {cards.length === 0 ? (
        <p className="note">Reading the surface…</p>
      ) : (
        <div className="inspect-grid">
          {cards.map((card) => (
            <article
              key={card.id}
              className={`inspect-card${card.span === 2 ? " span-2" : ""}${
                card.risk && highlightRisk ? " risk" : ""
              }`}
            >
              <h3>{card.title}</h3>
              <p>{card.body}</p>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
