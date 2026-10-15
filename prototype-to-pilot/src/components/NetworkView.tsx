import type { NetCall } from "../types";

type Props = {
  calls: NetCall[];
};

export function NetworkView({ calls }: Props) {
  if (calls.length === 0) {
    return <p className="net-empty">No calls yet. Generate a brief in the preview.</p>;
  }

  return (
    <div className="net">
      {calls.map((call) => (
        <article key={call.id} className={`net-row${call.external ? " is-external" : " is-internal"}`}>
          <div className="net-top">
            <span className="net-method">{call.method}</span>
            <span className="net-host">{call.host}</span>
            <span className="net-path">{call.path}</span>
            <span className="net-meta">
              {call.status} · {call.ms}ms
            </span>
          </div>
          <div className="net-flags">
            {call.external ? (
              <span className="net-tag is-risk">External · text leaves the firm</span>
            ) : call.host.includes("internal") ? (
              <span className="net-tag is-ok">Approved boundary</span>
            ) : (
              <span className="net-tag">Local</span>
            )}
            {call.auth ? <span className="net-tag">Authorization · SSO</span> : null}
          </div>
          {call.audit ? <p className="net-audit">{call.audit}</p> : null}
        </article>
      ))}
    </div>
  );
}
