import { ArchitectureView } from "./components/ArchitectureView";
import { ChatPane } from "./components/ChatPane";
import { EvidenceView } from "./components/EvidenceView";
import { IntakeView } from "./components/IntakeView";
import { PilotPackView } from "./components/PilotPackView";
import { ReadinessView } from "./components/ReadinessView";
import { RepoScanView } from "./components/RepoScanView";
import { ValidationView } from "./components/ValidationView";
import { useSession } from "./session";

export function App() {
  const session = useSession();
  const chatOpen = session.messages.length > 0;

  return (
    <div className="app-shell">
      <header className="app-header">
        <div className="mark">
          <span className="mark-title">Prototype to pilot</span>
          <span className="mark-sub">matter-brief</span>
        </div>
        <div className="header-actions">
          {session.stage !== "intake" ? (
            <button type="button" className="ghost-btn" onClick={session.reset}>
              Start again
            </button>
          ) : null}
        </div>
      </header>

      <div className={`app-body${chatOpen ? "" : " app-body-solo"}`}>
        {chatOpen ? (
          <ChatPane
            messages={session.messages}
            suggestions={session.suggestions}
            awaiting={session.awaiting}
            typing={session.typing}
            activeWork={session.activeWork}
            workDone={session.workDone}
            started
            stage={session.stage}
            onSend={session.send}
          />
        ) : null}
        <main className="workspace" aria-live="polite">
          {session.stage === "intake" ? <IntakeView onAnalyse={session.analyseRepository} /> : null}
          {session.stage === "inspecting" || session.stage === "data-leaving" ? (
            <RepoScanView
              visibleFiles={session.visibleFiles}
              visibleFacts={session.visibleInspect}
              highlightRisk={session.stage === "data-leaving"}
              scanning={session.stage === "inspecting"}
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
