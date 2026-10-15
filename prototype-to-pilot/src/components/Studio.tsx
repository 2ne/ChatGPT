import { type DecisionId, type DecisionRecord } from "../data/decisions";
import type { CommitRecord, CompareMode, DiffHunk, NetCall, ProtoFeatures, StudioTab } from "../types";
import { CommitLog } from "./CommitLog";
import { DiffView } from "./DiffView";
import { MatterPreview } from "./MatterPreview";
import { NetworkView } from "./NetworkView";
import { PackPanel } from "./PackPanel";

const hackathonFeatures: ProtoFeatures = {
  sso: false,
  internalModel: false,
  citations: false,
  lowConfidence: false,
  analytics: false,
};

type Props = {
  tab: StudioTab;
  compare: CompareMode;
  features: ProtoFeatures;
  commits: CommitRecord[];
  activeDiff: DiffHunk | null;
  revealed: number;
  networkLog: NetCall[];
  trail: DecisionRecord[];
  selectedDocIds: string[];
  sourceMode: "documents" | "matter";
  briefReady: boolean;
  generating: boolean;
  selectedCite: string | null;
  stage: string;
  onTab: (tab: StudioTab) => void;
  onCompare: (mode: CompareMode) => void;
  onToggleDoc: (id: string) => void;
  onSourceMode: (mode: "documents" | "matter") => void;
  onGenerate: () => void;
  onSelectCite: (id: string | null) => void;
  onOpenItem: (id: DecisionId) => void;
  onPrepare: () => void;
};

export function Studio({
  tab,
  compare,
  features,
  commits,
  activeDiff,
  revealed,
  networkLog,
  trail,
  selectedDocIds,
  sourceMode,
  briefReady,
  generating,
  selectedCite,
  stage,
  onTab,
  onCompare,
  onToggleDoc,
  onSourceMode,
  onGenerate,
  onSelectCite,
  onOpenItem,
  onPrepare,
}: Props) {
  const showPackTab = stage === "readiness" || stage === "pack";
  const interactive = showPackTab;
  const previewFeatures = compare === "hackathon" ? hackathonFeatures : features;
  const tabs: StudioTab[] = showPackTab
    ? ["preview", "code", "network", "pack"]
    : ["preview", "code", "network"];

  return (
    <div className="studio">
      <div className="studio-toolbar">
        <div className="studio-tabs" role="tablist" aria-label="Workspace">
          {tabs.map((item) => (
            <button
              key={item}
              type="button"
              role="tab"
              aria-selected={tab === item}
              className={tab === item ? "is-on" : ""}
              onClick={() => onTab(item)}
            >
              {item === "preview" ? "Preview" : item === "code" ? "Code" : item === "network" ? "Network" : "Pack"}
            </button>
          ))}
        </div>
        {commits.length > 0 ? (
          <div className="studio-compare" role="group" aria-label="Prototype version">
            <button
              type="button"
              className={compare === "hackathon" ? "is-on" : ""}
              onClick={() => onCompare("hackathon")}
            >
              Hackathon
            </button>
            <button
              type="button"
              className={compare === "live" ? "is-on" : ""}
              onClick={() => onCompare("live")}
            >
              Pilot
            </button>
          </div>
        ) : null}
      </div>

      <div className="studio-main">
        {tab === "preview" ? (
          <MatterPreview
            features={previewFeatures}
            selectedDocIds={selectedDocIds}
            sourceMode={previewFeatures.analytics ? sourceMode : "documents"}
            briefReady={briefReady}
            generating={generating}
            selectedCite={selectedCite}
            onToggleDoc={onToggleDoc}
            onSourceMode={onSourceMode}
            onGenerate={onGenerate}
            onSelectCite={onSelectCite}
          />
        ) : null}
        {tab === "code" ? (
          activeDiff ? (
            <DiffView diff={activeDiff} revealed={revealed} />
          ) : (
            <p className="net-empty">Decisions write here. Watch summarise.ts on the first answer.</p>
          )
        ) : null}
        {tab === "network" ? <NetworkView calls={networkLog} /> : null}
        {tab === "pack" ? (
          <PackPanel
            trail={trail}
            commits={commits}
            onOpenItem={onOpenItem}
            onPrepare={onPrepare}
            packed={stage === "pack"}
          />
        ) : null}
      </div>

      <CommitLog
        commits={commits}
        trail={trail}
        interactive={interactive}
        onOpenItem={onOpenItem}
      />
    </div>
  );
}
