import { ChatPane } from "./components/ChatPane";
import { DecisionDocument } from "./components/DecisionDocument";
import { IntakeView } from "./components/IntakeView";
import { useSession } from "./session";

export function App() {
  const session = useSession();
  const chatReady = session.stage !== "intake";

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
          ) : (
            <DecisionDocument
              stage={session.stage}
              trail={session.trail}
              focusId={session.focusId}
              selectedCitation={session.selectedCitation}
              onSelectCitation={session.setCitation}
              onOpenItem={session.reopenDecision}
              onPrepare={session.preparePack}
              onReturnToPack={session.returnToPack}
              visibleFiles={session.visibleFiles}
              visibleFacts={session.visibleInspect}
            />
          )}
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
