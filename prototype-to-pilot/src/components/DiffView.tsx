import type { DiffHunk } from "../types";

type Props = {
  diff: DiffHunk;
  revealed: number;
};

export function DiffView({ diff, revealed }: Props) {
  const lines = diff.lines.slice(0, Math.max(revealed, 0));

  return (
    <div className="diff">
      <p className="diff-path">{diff.path}</p>
      <pre className="diff-body">
        {lines.map((line, index) => (
          <span key={`${index}-${line.text}`} className={`diff-line is-${line.kind}`}>
            <i>{line.kind === "add" ? "+" : line.kind === "del" ? "−" : " "}</i>
            {line.text}
          </span>
        ))}
      </pre>
    </div>
  );
}
