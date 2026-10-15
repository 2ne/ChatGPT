import { repoContext } from "../data/scan";

type Props = {
  onAnalyse: () => void;
};

export function IntakeView({ onAnalyse }: Props) {
  return (
    <div className="workspace-inner repo-start-wrap">
      <div className="repo-start">
        <p className="eyebrow">This repository</p>
        <h1 className="display text-[2.05rem]">{repoContext.name}</h1>
        <p className="repo-meta">
          <span>{repoContext.path}</span>
          <span className="repo-dot" aria-hidden>
            ·
          </span>
          <span>{repoContext.branch}</span>
        </p>
        <p className="repo-cmd">
          <span className="repo-prompt">$</span> {repoContext.command}
        </p>
        <button type="button" className="primary-btn repo-go" onClick={onAnalyse}>
          Analyse this repository
        </button>
      </div>
    </div>
  );
}
