import { matter } from "../data/matter";
import type { ProtoFeatures } from "../types";

const docs = [
  { id: "d1", name: "Supply agreement.pdf", meta: "18 Jan 2024" },
  { id: "d2", name: "Letter of claim.pdf", meta: "12 Mar 2026" },
  { id: "d3", name: "Email from Pellam.pdf", meta: "4 Feb 2026" },
];

type Props = {
  features: ProtoFeatures;
  selectedDocIds: string[];
  sourceMode: "documents" | "matter";
  briefReady: boolean;
  generating: boolean;
  selectedCite: string | null;
  onToggleDoc: (id: string) => void;
  onSourceMode: (mode: "documents" | "matter") => void;
  onGenerate: () => void;
  onSelectCite: (id: string | null) => void;
};

export function MatterPreview({
  features,
  selectedDocIds,
  sourceMode,
  briefReady,
  generating,
  selectedCite,
  onToggleDoc,
  onSourceMode,
  onGenerate,
  onSelectCite,
}: Props) {
  const selected = matter.citations.find((item) => item.id === selectedCite);
  const canGenerate = sourceMode === "matter" || selectedDocIds.length > 0;

  return (
    <div className="chrome">
      <div className="chrome-bar">
        <span className="chrome-dots" aria-hidden>
          <i />
          <i />
          <i />
        </span>
        <div className="chrome-url">localhost:5173</div>
      </div>
      <div className="mb">
        <header className="mb-bar">
          <strong>Matter Brief</strong>
          {features.sso ? (
            <span className="mb-sso">A. Patel · SSO</span>
          ) : (
            <span className="mb-anon">No authentication</span>
          )}
        </header>

        <div className="mb-body">
          <aside className="mb-sources">
            <p className="mb-kicker">Sources</p>
            {features.analytics ? (
              <div className="mb-mode" role="group" aria-label="Source choice">
                <button
                  type="button"
                  className={sourceMode === "documents" ? "is-on" : ""}
                  onClick={() => onSourceMode("documents")}
                >
                  Documents
                </button>
                <button
                  type="button"
                  className={sourceMode === "matter" ? "is-on" : ""}
                  onClick={() => onSourceMode("matter")}
                >
                  Whole matter
                </button>
              </div>
            ) : null}

            {sourceMode === "matter" ? (
              <p className="mb-matter-note">Entire matter · Northharbour / Pellam</p>
            ) : (
              <ul className="mb-docs">
                {docs.map((doc) => (
                  <li key={doc.id}>
                    <label>
                      <input
                        type="checkbox"
                        checked={selectedDocIds.includes(doc.id)}
                        onChange={() => onToggleDoc(doc.id)}
                      />
                      <span>
                        <b>{doc.name}</b>
                        <small>{doc.meta}</small>
                      </span>
                    </label>
                  </li>
                ))}
              </ul>
            )}

            <button
              type="button"
              className="mb-go"
              disabled={!canGenerate || generating}
              onClick={onGenerate}
            >
              {generating ? "Generating…" : "Generate brief"}
            </button>
            {features.analytics ? (
              <p className="mb-flag">Pilot flag · source choice</p>
            ) : null}
          </aside>

          <section className="mb-brief" aria-live="polite">
            {generating ? (
              <p className="mb-empty">Generating a client-ready update…</p>
            ) : !briefReady ? (
              <p className="mb-empty">Select sources, then generate.</p>
            ) : (
              <>
                <p className="mb-kicker">{matter.kicker}</p>
                <h2>{matter.title}</h2>
                <p className="mb-meta">{matter.meta}</p>
                <p className="mb-copy">
                  Pellam’s failure to deliver the Q3 tooling lot is a breach of clause 14.2 of the
                  supply agreement
                  {features.citations ? (
                    <Cite n={1} id="c1" selected={selectedCite} onSelect={onSelectCite} />
                  ) : null}
                  . The letter of claim dated 12 March puts loss at £240,000
                  {features.citations ? (
                    <Cite n={2} id="c2" selected={selectedCite} onSelect={onSelectCite} />
                  ) : null}
                  {features.lowConfidence ? (
                    <span className="mb-low">Low confidence — check source</span>
                  ) : null}
                  . Pellam’s 4 February email accepts the delay but disputes the figure
                  {features.citations ? (
                    <Cite n={3} id="c3" selected={selectedCite} onSelect={onSelectCite} />
                  ) : null}
                  .
                </p>
                {selected ? (
                  <aside className="mb-passage">
                    <p className="mb-kicker">
                      Source {selected.n} · {selected.document}
                    </p>
                    <p className="mb-locator">{selected.locator}</p>
                    <blockquote>“{selected.passage}”</blockquote>
                  </aside>
                ) : features.citations ? (
                  <p className="mb-hint">Select a citation to open the passage.</p>
                ) : null}
              </>
            )}
          </section>
        </div>
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
  onSelect: (id: string | null) => void;
}) {
  return (
    <button
      type="button"
      className="mb-cite"
      aria-label={`Citation ${n}`}
      aria-pressed={selected === id}
      onClick={() => onSelect(selected === id ? null : id)}
    >
      {n}
    </button>
  );
}
