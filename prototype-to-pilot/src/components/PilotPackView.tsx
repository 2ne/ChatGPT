import { openItems, settledItems, type DecisionId, type DecisionRecord } from "../data/decisions";

type Props = {
  trail: DecisionRecord[];
  onOpenItem: (id: DecisionId) => void;
};

export function PilotPackView({ trail, onOpenItem }: Props) {
  const settled = settledItems(trail);
  const open = openItems(trail);

  return (
    <div className="workspace-inner">
      <article className="pack">
        <p className="pack-banner">Draft for human review · not an approval</p>
        <h2>Matter Brief · pilot pack</h2>
        <p className="pack-intro">
          Prepared from the prototype and the decisions taken in this conversation. For the pilot
          owner, InfoSec and Risk — to accept, amend or stop.
        </p>

        <section>
          <h3>Decisions made</h3>
          {settled.length > 0 ? (
            <ul>
              {settled.map((item) => (
                <li key={item.id}>{item.line}</li>
              ))}
            </ul>
          ) : (
            <p>None settled in this conversation.</p>
          )}
        </section>

        <section>
          <h3>Open questions / owners</h3>
          {open.length > 0 ? (
            <ul className="pack-actions">
              {open.map((item) => (
                <li key={item.id}>
                  <button type="button" className="open-action" onClick={() => onOpenItem(item.id)}>
                    {item.line}
                    {item.owner ? ` — ${item.owner}` : " — needs an owner"}
                  </button>
                </li>
              ))}
            </ul>
          ) : (
            <p>Nothing left open in this pass. Approvals remain human.</p>
          )}
        </section>

        <section>
          <h3>Product summary</h3>
          <p>
            Matter Brief helps lawyers produce a concise, client-ready update from matter documents.
            The hackathon prototype proved the interaction. Production should keep the same job,
            with an approved model, cited claims, and a short test of how lawyers choose source
            material.
          </p>
        </section>

        <section>
          <h3>Data flow</h3>
          <p>
            Prototype: browser sends full document text to an external LLM API. Proposed production:
            authenticated lawyer → firm application → approved internal model → matter sources.
            Confidential matter data stays inside the approved boundary. External model access is
            prototype-only.
          </p>
        </section>

        <section>
          <h3>Technology</h3>
          <ul>
            <li>Prototype: Vite / React front end calling an external model HTTP API. No authentication.</li>
            <li>
              Proposed production: firm-hosted application, SSO, approved internal model, retrieval
              over matter stores, audit logging. External provider out of the path.
            </li>
          </ul>
        </section>

        <section>
          <h3>Risks identified</h3>
          <ul>
            <li>
              Confidential text leaving the firm — mitigate by keeping generation on approved
              infrastructure.
            </li>
            <li>
              Unsupported claims in a client-facing brief — mitigate with inline citations to source
              passages.
            </li>
            <li>
              No permission model — mitigate with SSO and matter-level access before any live data.
            </li>
            <li>
              Weak error and low-confidence states — mitigate with an explicit “insufficient source”
              outcome before pilot users see a fluent wrong answer.
            </li>
          </ul>
        </section>

        <section>
          <h3>UX assumptions</h3>
          <p>
            The prototype assumes lawyers upload individual documents. That cannot be settled by
            talking. Do not redesign yet. Test with three lawyers. Success: two of three complete
            the task without explanation and trust the cited evidence.
          </p>
        </section>

        <section>
          <h3>Pilot proposal</h3>
          <ul>
            <li>Who uses it: three associates in one disputes team, on non-live or dummy matters until InfoSec agrees otherwise.</li>
            <li>What is measured: time to a sendable update, citation use, and whether they reach for a matter rather than a file.</li>
            <li>
              What stops the pilot: any path that sends matter text outside the approved boundary;
              any client-ready output that cannot show its source; or fewer than two of three users
              completing the task without coaching.
            </li>
          </ul>
        </section>
      </article>
    </div>
  );
}
