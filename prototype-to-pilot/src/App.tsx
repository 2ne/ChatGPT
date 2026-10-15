import { ChatPane } from "./components/ChatPane";
import { IntakeView } from "./components/IntakeView";
import { RepoScanView } from "./components/RepoScanView";
import { Studio } from "./components/Studio";
import { useSession } from "./session";

export function App() {
  const session = useSession();
  const chatReady = session.stage !== "intake";
  const showStudio = session.studioReady;
  const showScan = session.stage === "inspecting" || (session.stage === "data-leaving" && !session.studioReady);

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

      <div className="app-body">
        <main className="workspace" aria-live="polite">
          {session.stage === "intake" ? (
            <IntakeView onAnalyse={session.analyseRepository} />
          ) : null}
          {showScan ? (
            <div className="workspace-inner">
              <RepoScanView
                visibleFiles={session.visibleFiles}
                visibleFacts={session.visibleInspect}
                highlightRisk={session.stage === "data-leaving"}
                scanning={session.stage === "inspecting"}
              />
            </div>
          ) : null}
          {showStudio ? (
            <Studio
              tab={session.tab}
              compare={session.compare}
              features={session.features}
              commits={session.commits}
              activeDiff={session.activeDiff}
              revealed={session.revealed}
              networkLog={session.networkLog}
              trail={session.trail}
              selectedDocIds={session.selectedDocIds}
              sourceMode={session.sourceMode}
              briefReady={session.briefReady}
              generating={session.generating}
              selectedCite={session.selectedCitation}
              stage={session.stage}
              onTab={session.setTab}
              onCompare={session.setCompare}
              onToggleDoc={session.toggleDoc}
              onSourceMode={session.setSourceMode}
              onGenerate={session.generateBrief}
              onSelectCite={session.setCitation}
              onOpenItem={session.reopenDecision}
              onPrepare={session.preparePack}
            />
          ) : null}
        </main>
        <div className={`steer-slot${chatReady ? "" : " idle"}`}>
          {chatReady ? (
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
          ) : (
            <section className="chat-pane chat-idle" aria-hidden="true">
              <header className="chat-head">
                <span>Conversation</span>
              </header>
            </section>
          )}
        </div>
      </div>
    </div>
  );
}
