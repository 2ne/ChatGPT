export function ValidationView() {
  return (
    <div className="workspace-inner">
      <p className="eyebrow">Lean validation</p>
      <h1 className="display text-[1.85rem]">The smallest test before a pilot — not a new process.</h1>
      <p className="lede">
        The prototype looks finished. The upload model has not been watched in anyone’s actual
        working day. This is enough to find that out.
      </p>

      <div className="plan">
        <div className="plan-row">
          <div className="plan-label">Key assumption</div>
          <p className="plan-body">
            Lawyers want to select individual documents before generating a brief.
          </p>
        </div>
        <div className="plan-row">
          <div className="plan-label">Test</div>
          <p className="plan-body">Three lawyers performing the task using the prototype.</p>
        </div>
        <div className="plan-row">
          <div className="plan-label">Questions</div>
          <div className="plan-body">
            <ul>
              <li>How do they choose the source material today?</li>
              <li>Do they think in documents, folders or matters?</li>
              <li>What evidence do they need before trusting the summary?</li>
            </ul>
          </div>
        </div>
        <div className="plan-row">
          <div className="plan-label">Success signal</div>
          <p className="plan-body">
            2/3 users can complete the workflow without explanation and trust the source evidence.
          </p>
        </div>
      </div>
    </div>
  );
}
