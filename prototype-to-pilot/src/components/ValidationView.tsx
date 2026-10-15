export function ValidationView() {
  return (
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
  );
}
