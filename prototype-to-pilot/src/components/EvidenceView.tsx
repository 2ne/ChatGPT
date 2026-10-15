import { matter, type Citation } from "../data/matter";

type Props = {
  selectedId: string | null;
  onSelect: (id: string) => void;
};

export function EvidenceView({ selectedId, onSelect }: Props) {
  const selected: Citation | undefined = matter.citations.find((item) => item.id === selectedId);

  return (
    <div className="workspace-inner">
      <p className="eyebrow">Source reliability</p>
      <h1 className="display text-[1.85rem]">Every material claim, one click from the document.</h1>
      <p className="lede">
        This is a sketch of the brief as it should behave in a pilot — not a redesigned product.
        Select a citation.
      </p>

      <div className="brief">
        <article className="brief-paper">
          <p className="brief-kicker">{matter.kicker}</p>
          <h2 className="brief-title">{matter.title}</h2>
          <p className="brief-meta">{matter.meta}</p>
          <p className="brief-body">
            Pellam’s failure to deliver the Q3 tooling lot is a breach of clause 14.2 of the supply
            agreement<Cite n={1} id="c1" selected={selectedId} onSelect={onSelect} />. The letter of
            claim dated 12 March puts loss at £240,000<Cite n={2} id="c2" selected={selectedId} onSelect={onSelect} />.
            Pellam’s 4 February email accepts the delay but disputes the figure<Cite n={3} id="c3" selected={selectedId} onSelect={onSelect} />.
          </p>
        </article>

        <aside className="source-pane" aria-live="polite">
          {selected ? (
            <>
              <p className="brief-kicker">Source {selected.n}</p>
              <p className="proto-name">{selected.document}</p>
              <p className="proto-meta">{selected.locator}</p>
              <blockquote>“{selected.passage}”</blockquote>
            </>
          ) : (
            <p className="empty-source">Select a citation in the brief to see the passage it rests on.</p>
          )}
        </aside>
      </div>
    </div>
  );
}

function Cite({
  n,
  id,
  selected,
  onSelect,
}: {
  n: number;
  id: string;
  selected: string | null;
  onSelect: (id: string) => void;
}) {
  return (
    <button
      type="button"
      className="cite"
      aria-label={`Citation ${n}`}
      aria-pressed={selected === id}
      onClick={() => onSelect(id)}
    >
      {n}
    </button>
  );
}
