import { openItems, type DecisionId, type DecisionRecord } from "../data/decisions";
import type { CommitRecord } from "../types";

type Props = {
  commits: CommitRecord[];
  trail: DecisionRecord[];
  interactive: boolean;
  onOpenItem: (id: DecisionId) => void;
};

export function CommitLog({ commits, trail, interactive, onOpenItem }: Props) {
  const open = openItems(trail);
  const branch = commits.length > 0 ? "pilot-ready" : "main";

  return (
    <footer className="studio-foot">
      <div className="commit-head">
        <span>
          branch: <strong>{branch}</strong>
        </span>
        <span>{commits.length} commit{commits.length === 1 ? "" : "s"}</span>
      </div>
      {commits.length > 0 ? (
        <ol className="commit-list">
          {commits.map((commit) => (
            <li key={commit.id}>
              <code>{commit.hash}</code>
              <span>{commit.message}</span>
            </li>
          ))}
        </ol>
      ) : (
        <p className="commit-empty">Hackathon checkout. Changes land here.</p>
      )}
      {open.length > 0 ? (
        <ul className="open-strip">
          {open.map((item) => {
            const clickable = interactive;
            const label = `${item.line}${item.owner ? ` · ${item.owner}` : ""}`;
            return (
              <li key={item.id}>
                {clickable ? (
                  <button type="button" onClick={() => onOpenItem(item.id)}>
                    {label}
                  </button>
                ) : (
                  <span>{label}</span>
                )}
              </li>
            );
          })}
        </ul>
      ) : null}
    </footer>
  );
}
