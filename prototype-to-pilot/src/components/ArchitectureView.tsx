export function ArchitectureView() {
  return (
    <div className="workspace-inner">
      <p className="eyebrow">Architecture</p>
      <h1 className="display text-[1.85rem]">Keep the prototype. Change the boundary.</h1>
      <p className="lede">
        External model access stays in the hackathon path. Production keeps confidential matter
        data inside an approved environment, with authentication and an audit trail.
      </p>

      <div className="flow">
        <section className="flow-block">
          <h2 className="flow-title">Current prototype</h2>
          <div className="nodes">
            <div className="node">
              <small>Source</small>
              <strong>Browser</strong>
            </div>
            <span className="arrow" aria-hidden>
              →
            </span>
            <div className="node node-risk">
              <small>Risk · text leaves</small>
              <strong>External LLM API</strong>
            </div>
            <span className="arrow" aria-hidden>
              →
            </span>
            <div className="node">
              <small>Output</small>
              <strong>Generated summary</strong>
            </div>
          </div>
        </section>

        <section className="flow-block">
          <h2 className="flow-title">Proposed production</h2>
          <div className="boundary">
            <p className="boundary-label">Approved boundary · confidential matter data</p>
            <div className="nodes">
              <div className="node">
                <small>User</small>
                <strong>Lawyer</strong>
              </div>
              <span className="arrow" aria-hidden>
                →
              </span>
              <div className="node">
                <small>Authenticated</small>
                <strong>Firm application</strong>
              </div>
              <span className="arrow" aria-hidden>
                →
              </span>
              <div className="node">
                <small>Approved model</small>
                <strong>Internal model</strong>
              </div>
              <span className="arrow" aria-hidden>
                →
              </span>
              <div className="node">
                <small>Retrieval</small>
                <strong>Matter sources</strong>
              </div>
            </div>
            <div className="sub-nodes">
              <div className="node">
                <small>Control</small>
                <strong>Authentication</strong>
              </div>
              <div className="node">
                <small>Record</small>
                <strong>Audit / logging</strong>
              </div>
              <div className="node">
                <small>Inside the firm</small>
                <strong>Confidential matter data</strong>
              </div>
            </div>
          </div>
          <p className="note" style={{ marginTop: "0.85rem", marginBottom: 0 }}>
            External model provider — prototype only. Out of the production path.
          </p>
        </section>
      </div>
    </div>
  );
}
