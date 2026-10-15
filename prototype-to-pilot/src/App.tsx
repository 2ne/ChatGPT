import { ArchitectureView } from "./components/ArchitectureView";
import { ChatPane } from "./components/ChatPane";
import { EvidenceView } from "./components/EvidenceView";
import { InspectionView } from "./components/InspectionView";
import { IntakeView } from "./components/IntakeView";
import { PilotPackView } from "./components/PilotPackView";
import { ReadinessView } from "./components/ReadinessView";
import { ValidationView } from "./components/ValidationView";
import { useSession } from "./session";

export function App() {
  const session = useSession();

  return (
    <div className="app-shell">
      <header className="app-header">
        <div className="mark">
          <span className="mark-title">Prototype to pilot</span>
          <span className="mark-sub">
            {session.prototypeId === "matter-brief" ? "Matter Brief" : "Internal · alongside you"}
          </span>
        </div>
        <div className="header-actions">
          {session.stage !== "intake" ? (
            <button type="button" className="ghost-btn" onClick={session.reset}>
              Start again
            </button>
          ) : null}
        </div>
      </header>

      <div className="app-body">
        <ChatPane
          messages={session.messages}
          suggestions={session.suggestions}
          awaiting={session.awaiting}
          typing={session.typing}
          activeWork={session.activeWork}
          workDone={session.workDone}
          started={session.stage !== "intake"}
          stage={session.stage}
          onSend={session.send}
        />
        <main className="workspace" aria-live="polite">
          {session.stage === "intake" ? (
            <IntakeView onSelect={session.selectPrototype} />
          ) : null}
          {session.stage === "inspecting" || session.stage === "data-leaving" ? (
            <InspectionView
              visible={session.visibleInspect}
              highlightRisk={session.stage === "data-leaving"}
            />
          ) : null}
          {session.stage === "architecture" || session.stage === "citations" ? (
            <ArchitectureView />
          ) : null}
          {session.stage === "evidence" || session.stage === "ux-assumption" ? (
            <EvidenceView selectedId={session.selectedCitation} onSelect={session.setCitation} />
          ) : null}
          {session.stage === "validation" ? <ValidationView /> : null}
          {session.stage === "readiness" ? (
            <ReadinessView onPrepare={session.preparePack} />
          ) : null}
          {session.stage === "pack" ? <PilotPackView /> : null}
        </main>
      </div>
    </div>
  );
}
