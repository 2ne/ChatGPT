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
        <h2 className="flow-title">Detected</h2>
        {facts.length === 0 ? (
          <p className="note" style={{ margin: 0 }}>
            Waiting on the first files…
          </p>
        ) : (
          <div className="inspect-grid">
            {facts.map((card) => (
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
      </section>
    </div>
  );
}
