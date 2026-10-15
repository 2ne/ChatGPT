import { useEffect, useRef } from "react";
import {
  lockedCount,
  type DecisionId,
  type DecisionRecord,
  type DecisionStatus,
} from "../data/decisions";
import { outputsFromTrail } from "../data/matter";
import type { Stage } from "../types";
import { ArchitectureView } from "./ArchitectureView";
import { EvidenceView } from "./EvidenceView";
import { PackAddendum } from "./PilotPackView";
import { RepoScanView } from "./RepoScanView";
import { ValidationView } from "./ValidationView";

type Props = {
  stage: Stage;
  trail: DecisionRecord[];
  focusId: DecisionId | null;
  selectedCitation: string | null;
  onSelectCitation: (id: string) => void;
  onOpenItem: (id: DecisionId) => void;
  onPrepare: () => void;
  onReturnToPack: () => void;
  visibleFiles: number;
  visibleFacts: number;
};

function stageToDecision(stage: Stage): DecisionId | null {
  switch (stage) {
    case "inspecting":
    case "data-leaving":
    case "architecture":
      return "data";
    case "ownership":
      return "ownership";
    case "citations":
    case "evidence":
      return "citations";
    case "ux-assumption":
    case "validation":
      return "ux";
    default:
      return null;
  }
}

function copyFor(stage: Stage, focused: boolean) {
  if (focused) {
    return {
      kicker: "Still open",
      lede: "This one is back in the conversation. The rest of the pack stays as it is.",
    };
  }
  switch (stage) {
    case "inspecting":
      return {
        kicker: "Reading",
        lede: "Purpose, people, stack and data — taken from the files, not a questionnaire.",
      };
    case "data-leaving":
      return {
        kicker: "Decisions",
        lede: "The code cannot answer this. What we decide here becomes the pack.",
      };
    case "architecture":
      return {
        kicker: "Decisions",
        lede: "A production path that keeps confidential matter data inside an approved environment.",
      };
    case "readiness":
      return {
        kicker: "Towards a pilot",
        lede: "Drafts for people to use. Nothing here is an approval. Open items can be settled in the conversation.",
      };
    case "pack":
      return {
        kicker: "Pilot pack",
        lede: "Prepared from the prototype and the decisions in this conversation. For the pilot owner, InfoSec and Risk — to accept, amend or stop.",
      };
    default:
      return {
        kicker: "Decisions",
        lede: "Each answer is recorded here. Supporting detail appears only for the question in front of us.",
      };
  }
}

const stageOrder: Stage[] = [
  "intake",
  "inspecting",
  "data-leaving",
  "architecture",
  "ownership",
  "citations",
  "evidence",
  "ux-assumption",
  "validation",
  "readiness",
  "pack",
];

function reached(stage: Stage, target: Stage) {
  return stageOrder.indexOf(stage) >= stageOrder.indexOf(target);
}

function mountedVisual(id: DecisionId, stage: Stage, focusId: DecisionId | null) {
  if (id === "data") {
    if (stage === "inspecting" || stage === "data-leaving") return "scan";
    if (reached(stage, "architecture") || focusId === "data") return "architecture";
  }
  if (id === "citations" && (reached(stage, "evidence") || focusId === "citations")) return "evidence";
  if (id === "ux" && (reached(stage, "validation") || focusId === "ux")) return "validation";
  return null;
}

function statusLabel(status: DecisionStatus, current: boolean, live: boolean) {
  if (status === "locked") return "Waiting";
  if (status === "needs-owner") return "Needs owner";
  if (status === "settled") return current && live ? "Recorded" : null;
  if (current && live) return "This question";
  return "Open";
}

export function DecisionDocument({
  stage,
  trail,
  focusId,
  selectedCitation,
  onSelectCitation,
  onOpenItem,
  onPrepare,
  onReturnToPack,
  visibleFiles,
  visibleFacts,
}: Props) {
  const currentId = focusId ?? stageToDecision(stage);
  const questionLive = Boolean(currentId) && stage !== "inspecting";
  const packLike = stage === "readiness" || stage === "pack";
  const interactive = packLike;
  const focused = Boolean(focusId);
  const { kicker, lede } = copyFor(stage, focused);
  const outputs = outputsFromTrail(trail);
  const waiting = lockedCount(trail);
  const currentRef = useRef<HTMLLIElement | null>(null);

  useEffect(() => {
    if (!focusId || !currentRef.current) return;
    currentRef.current.scrollIntoView({ behavior: "smooth", block: "center" });
  }, [focusId]);

  return (
    <div className="workspace-inner">
      <article
        className={`decision-doc${stage === "pack" ? " is-pack" : ""}${focused ? " is-focused" : ""}`}
      >
        <p className={stage === "pack" ? "pack-banner" : "eyebrow"}>
          {stage === "pack" ? "Draft for human review · not an approval" : kicker}
        </p>
        <h1 className="display text-[1.85rem]">Matter Brief</h1>
        <p className="lede">{lede}</p>

        <ol className="spine" aria-label="Decisions">
          {trail.map((item, index) => {
            const current = item.id === currentId;
            const live = current && questionLive;
            const visual = mountedVisual(item.id, stage, focusId);
            const open = current && (visual !== null || focused);
            const clickable = interactive && !current && (item.status === "open" || item.status === "needs-owner");
            const label = statusLabel(item.status, current, live);
            const text = `${item.line}${
              item.status === "needs-owner" && item.owner ? ` — ${item.owner}` : ""
            }`;
            const className = [
              "spine-item",
              item.status,
              current ? "current" : "",
              live ? "live" : "",
              clickable ? "action" : "",
            ]
              .filter(Boolean)
              .join(" ");

            return (
              <li
                key={item.id}
                id={`decision-${item.id}`}
                ref={current ? currentRef : undefined}
                className={className}
                aria-current={current ? "step" : undefined}
                style={{ animationDelay: `${index * 45}ms` }}
              >
                {clickable ? (
                  <button type="button" className="spine-hit" onClick={() => onOpenItem(item.id)}>
                    <span className="spine-question">{text}</span>
                    {label ? <span className="spine-flag">{label}</span> : null}
                  </button>
                ) : (
                  <div className="spine-hit">
                    <span className="spine-question">{text}</span>
                    {label ? <span className="spine-flag">{label}</span> : null}
                  </div>
                )}

                <div className={`spine-detail-wrap${open ? " open" : ""}`}>
                  <div className="spine-detail" {...(!open ? { inert: true } : {})}>
                    {visual === "scan" ? (
                      <RepoScanView
                        visibleFiles={visibleFiles}
                        visibleFacts={visibleFacts}
                        highlightRisk={stage === "data-leaving"}
                        scanning={stage === "inspecting"}
                      />
                    ) : null}
                    {visual === "architecture" ? (
                      <>
                        <p className="spine-caption">Keep the prototype. Change the boundary.</p>
                        <ArchitectureView />
                      </>
                    ) : null}
                    {visual === "evidence" ? (
                      <>
                        <p className="spine-caption">
                          A sketch of the brief in a pilot — select a citation.
                        </p>
                        <EvidenceView selectedId={selectedCitation} onSelect={onSelectCitation} />
                      </>
                    ) : null}
                    {visual === "validation" ? (
                      <>
                        <p className="spine-caption">The smallest test before a pilot.</p>
                        <ValidationView />
                      </>
                    ) : null}
                    {focused && current ? (
                      <button type="button" className="ghost-btn spine-back" onClick={onReturnToPack}>
                        {stage === "readiness" ? "Back to the drafts" : "Back to the pack"}
                      </button>
                    ) : null}
                  </div>
                </div>
              </li>
            );
          })}
        </ol>

        {waiting > 0 && !packLike ? (
          <p className="trail-waiting">
            {waiting} waiting on {waiting === 1 ? "an earlier answer" : "earlier answers"}
          </p>
        ) : null}

        {stage === "readiness" ? (
          <div className="doc-follow">
            <h2 className="flow-title">Drafts in hand</h2>
            <div className="outputs">
              {outputs.map((item) => (
                <article key={item.id} className="output">
                  <div>
                    <h3>{item.title}</h3>
                    <p>{item.note}</p>
                  </div>
                  <span className={`status status-${item.tone}`}>{item.status}</span>
                </article>
              ))}
            </div>
            <button type="button" className="primary-btn" onClick={onPrepare}>
              Prepare pilot pack
            </button>
          </div>
        ) : null}

        {stage === "pack" ? (
          <div className="doc-follow pack-addendum">
            <PackAddendum />
          </div>
        ) : null}
      </article>
    </div>
  );
}
