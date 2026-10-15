import { inspectCards } from "../data/inspection";
import { scanFiles } from "../data/scan";

type Props = {
  visibleFiles: number;
  visibleFacts: number;
  highlightRisk: boolean;
  scanning: boolean;
};

export function RepoScanView({ visibleFiles, visibleFacts, highlightRisk, scanning }: Props) {
  const files = scanFiles.slice(0, visibleFiles);
  const facts = inspectCards.slice(0, visibleFacts);
  const notes = facts.filter((card) => !card.risk);
  const risk = facts.find((card) => card.risk);

  return (
    <div className="scan-layout">
      <section aria-label="Files being read">
        <h2 className="flow-title">Files</h2>
        <div className="file-list">
          {files.length === 0 ? (
            <p className="note" style={{ margin: 0 }}>
              Opening the tree…
            </p>
          ) : null}
          {files.map((file, index) => {
            const latest = index === files.length - 1 && scanning && files.length < scanFiles.length;
            return (
              <div
                key={file.id}
                className={`file-row${file.missing ? " missing" : ""}${latest ? " reading" : ""}`}
              >
                <span className="file-path">{file.path}</span>
                <span className="file-status">
                  {latest ? "reading" : file.missing ? "missing" : file.detail}
                </span>
              </div>
            );
          })}
        </div>
      </section>

      <section aria-label="Detected facts">
        <h2 className="flow-title">From the files</h2>
        {notes.length === 0 && !risk ? (
          <p className="note" style={{ margin: 0 }}>
            Waiting on the first files…
          </p>
        ) : (
          <dl className="finding-list">
            {notes.map((card) => (
              <div key={card.id} className="finding-row">
                <dt>{card.title}</dt>
                <dd>{card.body}</dd>
              </div>
            ))}
          </dl>
        )}
        {risk ? (
          <aside className={`finding-risk${highlightRisk ? " is-live" : ""}`}>
            <h3>{risk.title}</h3>
            <p>{risk.body}</p>
          </aside>
        ) : null}
      </section>
    </div>
  );
}
