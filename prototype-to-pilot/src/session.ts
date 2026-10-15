import { useCallback, useEffect, useReducer, useRef } from "react";
import {
  addCitationsReply,
  citationFinding,
  citationSuggestions,
  dataSuggestions,
  dummyReply,
  firstFinding,
  infosecReopen,
  infosecSuggestions,
  innovationOwnerReply,
  ownershipFinding,
  ownershipSuggestions,
  packReply,
  practiceOwnerReply,
  readinessReply,
  readinessSuggestions,
  recordedGeneric,
  recordedInfosecNamed,
  recordedInfosecQueue,
  recordedRiskNamed,
  recordedRiskQueue,
  recordedUxRunner,
  recordedUxSelf,
  redesignReply,
  remainingReply,
  repoSummary,
  returnedToPack,
  riskReopen,
  riskSuggestions,
  risksReply,
  skipCitationsReply,
  steerGeneric,
  steerInspecting,
  tooEarlyPack,
  undecidedCitationsReply,
  undecidedUxReply,
  unknownOwnerReply,
  unsureReply,
  uxFinding,
  uxOwnerReopen,
  uxOwnerSuggestions,
  uxSuggestions,
  validateReply,
  whyUxReply,
  approvedReply,
  backToPackSuggestions,
  lowConfidenceNote,
} from "./data/copy";
import {
  diffAnalytics,
  diffAuth,
  diffBrief,
  diffConfidence,
  diffSummarise,
} from "./data/code";
import { createTrail, settleTrail, type DecisionId, type DecisionRecord } from "./data/decisions";
import { workItemsSeed } from "./data/inspection";
import { scanFiles } from "./data/scan";
import { uid } from "./lib/ids";
import { interpret, interpretDecision } from "./lib/interpret";
import type {
  CommitRecord,
  CompareMode,
  DiffHunk,
  Intent,
  Message,
  NetCall,
  ProtoFeatures,
  PrototypeId,
  Stage,
  StudioTab,
  Suggestion,
  WorkItem,
} from "./types";

const emptyFeatures: ProtoFeatures = {
  sso: false,
  internalModel: false,
  citations: false,
  lowConfidence: false,
  analytics: false,
};

export type SessionState = {
  stage: Stage;
  prototypeId: PrototypeId | null;
  messages: Message[];
  suggestions: Suggestion[];
  awaiting: boolean;
  typing: boolean;
  work: WorkItem[];
  busy: string | null;
  visibleInspect: number;
  visibleFiles: number;
  selectedCitation: string | null;
  trail: DecisionRecord[];
  focusId: DecisionId | null;
  returnView: "readiness" | "pack" | null;
  tab: StudioTab;
  compare: CompareMode;
  features: ProtoFeatures;
  commits: CommitRecord[];
  activeDiff: DiffHunk | null;
  revealed: number;
  networkLog: NetCall[];
  selectedDocIds: string[];
  sourceMode: "documents" | "matter";
  briefReady: boolean;
  generating: boolean;
  studioReady: boolean;
};

type Action =
  | { type: "RESET" }
  | { type: "TYPING"; value: boolean }
  | { type: "AWAITING"; value: boolean }
  | { type: "USER"; text: string }
  | {
      type: "ASSISTANT";
      text: string;
      stage?: Stage;
      suggestions?: Suggestion[];
      awaiting?: boolean;
    }
  | { type: "STAGE"; stage: Stage }
  | { type: "START" }
  | { type: "FILES"; count: number }
  | { type: "INSPECT"; count: number }
  | { type: "WORK"; id: string; status: WorkItem["status"] }
  | { type: "BUSY"; label: string | null }
  | { type: "CITATION"; id: string | null }
  | {
      type: "SETTLE";
      id: DecisionId;
      status: "settled" | "needs-owner";
      line: string;
      owner?: string;
    }
  | { type: "SUGGESTIONS"; suggestions: Suggestion[] }
  | { type: "FOCUS"; id: DecisionId | null; returnView?: "readiness" | "pack" | null }
  | { type: "TAB"; tab: StudioTab }
  | { type: "COMPARE"; compare: CompareMode }
  | { type: "DIFF"; diff: DiffHunk | null }
  | { type: "REVEAL"; count: number }
  | { type: "COMMIT"; commit: CommitRecord }
  | { type: "FEATURE"; patch: Partial<ProtoFeatures> }
  | { type: "NET"; call: NetCall }
  | { type: "DOCS"; ids: string[] }
  | { type: "SOURCE"; mode: "documents" | "matter" }
  | { type: "GENERATING"; value: boolean }
  | { type: "BRIEF"; ready: boolean }
  | { type: "STUDIO" };

const initialWork: WorkItem[] = workItemsSeed.map((item) => ({
  id: item.id,
  label: item.label,
  status: "pending",
}));

function initial(): SessionState {
  return {
    stage: "intake",
    prototypeId: null,
    messages: [],
    suggestions: [],
    awaiting: false,
    typing: false,
    work: initialWork,
    busy: null,
    visibleInspect: 0,
    visibleFiles: 0,
    selectedCitation: null,
    trail: createTrail(),
    focusId: null,
    returnView: null,
    tab: "preview",
    compare: "live",
    features: emptyFeatures,
    commits: [],
    activeDiff: null,
    revealed: 0,
    networkLog: [],
    selectedDocIds: ["d1", "d2", "d3"],
    sourceMode: "documents",
    briefReady: false,
    generating: false,
    studioReady: false,
  };
}

function reducer(state: SessionState, action: Action): SessionState {
  switch (action.type) {
    case "RESET":
      return initial();
    case "TYPING":
      return { ...state, typing: action.value };
    case "AWAITING":
      return { ...state, awaiting: action.value };
    case "USER":
      return {
        ...state,
        awaiting: false,
        suggestions: [],
        messages: [...state.messages, { id: uid("m"), role: "user", text: action.text }],
      };
    case "ASSISTANT":
      return {
        ...state,
        typing: false,
        stage: action.stage ?? state.stage,
        suggestions: action.suggestions ?? [],
        awaiting: action.awaiting ?? true,
        messages: [...state.messages, { id: uid("m"), role: "assistant", text: action.text }],
      };
    case "STAGE":
      return { ...state, stage: action.stage };
    case "START":
      return {
        ...state,
        prototypeId: "matter-brief",
        stage: "inspecting",
        awaiting: false,
        suggestions: [],
        work: initialWork.map((item, index) =>
          index === 0 ? { ...item, status: "working" } : item,
        ),
      };
    case "FILES":
      return { ...state, visibleFiles: Math.max(state.visibleFiles, action.count) };
    case "INSPECT":
      return { ...state, visibleInspect: Math.max(state.visibleInspect, action.count) };
    case "WORK":
      return {
        ...state,
        work: state.work.map((item) =>
          item.id === action.id ? { ...item, status: action.status } : item,
        ),
      };
    case "BUSY":
      return { ...state, busy: action.label };
    case "CITATION":
      return { ...state, selectedCitation: action.id };
    case "SETTLE":
      return {
        ...state,
        trail: settleTrail(state.trail, action.id, action.status, action.line, action.owner),
      };
    case "FOCUS":
      return {
        ...state,
        focusId: action.id,
        returnView: action.returnView === undefined ? state.returnView : action.returnView,
      };
    case "SUGGESTIONS":
      return { ...state, suggestions: action.suggestions, awaiting: true };
    case "TAB":
      return { ...state, tab: action.tab };
    case "COMPARE":
      return { ...state, compare: action.compare };
    case "DIFF":
      return { ...state, activeDiff: action.diff, revealed: action.diff ? 1 : 0, tab: action.diff ? "code" : state.tab };
    case "REVEAL":
      return { ...state, revealed: action.count };
    case "COMMIT":
      return { ...state, commits: [...state.commits, action.commit] };
    case "FEATURE":
      return { ...state, features: { ...state.features, ...action.patch } };
    case "NET":
      return { ...state, networkLog: [...state.networkLog, action.call] };
    case "DOCS":
      return { ...state, selectedDocIds: action.ids };
    case "SOURCE":
      return { ...state, sourceMode: action.mode };
    case "GENERATING":
      return { ...state, generating: action.value };
    case "BRIEF":
      return { ...state, briefReady: action.ready, generating: false };
    case "STUDIO":
      return { ...state, studioReady: true, tab: "preview" };
    default:
      return state;
  }
}

function delayForMotion(ms: number) {
  if (typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    return 40;
  }
  return ms;
}

function openaiCall(): NetCall {
  return {
    id: uid("n"),
    method: "POST",
    host: "api.openai.com",
    path: "/v1/chat/completions",
    status: 200,
    ms: 1840,
    external: true,
  };
}

function internalCall(): NetCall {
  return {
    id: uid("n"),
    method: "POST",
    host: "models.internal.firm",
    path: "/v1/summarise",
    status: 200,
    ms: 412,
    external: false,
    auth: true,
    audit: "audit.log  actor=a.patel  action=summarise  boundary=approved",
  };
}

function trackCall(mode: "documents" | "matter"): NetCall {
  return {
    id: uid("n"),
    method: "POST",
    host: "localhost:5173",
    path: "/pilot/track",
    status: 204,
    ms: 18,
    external: false,
    audit: `source_choice=${mode}`,
  };
}

const hashes = ["a3f19c2", "8c2e441", "b71d0e8", "e4a92c1", "19f6bb0"];

export function useSession() {
  const [state, dispatch] = useReducer(reducer, undefined, initial);
  const timers = useRef<number[]>([]);
  const stageRef = useRef(state.stage);
  const focusRef = useRef<DecisionId | null>(null);
  const returnRef = useRef<"readiness" | "pack" | null>(null);
  const featuresRef = useRef(state.features);
  const sourceRef = useRef(state.sourceMode);
  const compareRef = useRef(state.compare);
  const commitCount = useRef(0);
  stageRef.current = state.stage;
  focusRef.current = state.focusId;
  returnRef.current = state.returnView;
  featuresRef.current = state.features;
  sourceRef.current = state.sourceMode;
  compareRef.current = state.compare;

  const clearTimers = useCallback(() => {
    timers.current.forEach((id) => window.clearTimeout(id));
    timers.current = [];
  }, []);

  const later = useCallback((ms: number, fn: () => void) => {
    const id = window.setTimeout(fn, delayForMotion(ms));
    timers.current.push(id);
  }, []);

  const speak = useCallback(
    (
      text: string,
      options?: {
        wait?: number;
        stage?: Stage;
        suggestions?: Suggestion[];
        awaiting?: boolean;
      },
    ) => {
      dispatch({ type: "TYPING", value: true });
      later(options?.wait ?? 280, () => {
        dispatch({
          type: "ASSISTANT",
          text,
          stage: options?.stage,
          suggestions: options?.suggestions,
          awaiting: options?.awaiting,
        });
      });
    },
    [later],
  );

  const playDiff = useCallback(
    (diff: DiffHunk, label: string, commit: { message: string; file: string }, onDone: () => void) => {
      dispatch({ type: "BUSY", label });
      dispatch({ type: "DIFF", diff });
      diff.lines.forEach((_, index) => {
        later(70 + index * 55, () => dispatch({ type: "REVEAL", count: index + 1 }));
      });
      const doneAt = 70 + diff.lines.length * 55 + 280;
      later(doneAt, () => {
        const hash = hashes[commitCount.current] ?? uid("h").slice(0, 7);
        commitCount.current += 1;
        dispatch({
          type: "COMMIT",
          commit: { id: uid("c"), hash, message: commit.message, file: commit.file },
        });
        onDone();
      });
    },
    [later],
  );

  const runGenerate = useCallback(
    (fromSeed = false) => {
      dispatch({ type: "GENERATING", value: true });
      dispatch({ type: "CITATION", id: null });
      later(fromSeed ? 900 : 700, () => {
        const internal =
          compareRef.current !== "hackathon" && featuresRef.current.internalModel;
        dispatch({ type: "NET", call: internal ? internalCall() : openaiCall() });
        if (compareRef.current !== "hackathon" && featuresRef.current.analytics) {
          dispatch({ type: "NET", call: trackCall(sourceRef.current) });
        }
        dispatch({ type: "BRIEF", ready: true });
        if (!fromSeed) dispatch({ type: "TAB", tab: "network" });
      });
    },
    [later],
  );

  const analyseRepository = useCallback(() => {
    if (stageRef.current !== "intake") return;
    dispatch({ type: "START" });
    commitCount.current = 0;

    scanFiles.forEach((_, index) => {
      later(140 + index * 300, () => dispatch({ type: "FILES", count: index + 1 }));
    });

    const inspectAt = [360, 680, 980, 1280, 1580, 1900];
    inspectAt.forEach((ms, index) => {
      later(ms, () => dispatch({ type: "INSPECT", count: index + 1 }));
    });

    workItemsSeed.forEach((item, index) => {
      later(item.delay, () => {
        dispatch({ type: "WORK", id: item.id, status: "working" });
        if (index > 0) {
          dispatch({ type: "WORK", id: workItemsSeed[index - 1].id, status: "done" });
        }
      });
      later(item.delay + 900, () => {
        dispatch({ type: "WORK", id: item.id, status: "done" });
      });
    });

    later(2500, () => dispatch({ type: "TYPING", value: true }));
    later(2900, () => {
      dispatch({
        type: "ASSISTANT",
        text: repoSummary,
        stage: "inspecting",
        awaiting: false,
      });
    });
    later(3800, () => dispatch({ type: "TYPING", value: true }));
    later(4100, () => {
      dispatch({ type: "STUDIO" });
      dispatch({
        type: "ASSISTANT",
        text: firstFinding,
        stage: "data-leaving",
        suggestions: dataSuggestions,
        awaiting: true,
      });
      runGenerate(true);
    });
  }, [later, runGenerate]);

  const applyDataChange = useCallback(
    (openingText: string) => {
      speak(openingText, { wait: 240, awaiting: false });
      later(700, () => {
        playDiff(diffSummarise, "Rewriting summarise.ts", {
          message: "route generation through internal model",
          file: "src/api/summarise.ts",
        }, () => {
          dispatch({ type: "FEATURE", patch: { internalModel: true } });
          later(350, () => {
            playDiff(diffAuth, "Adding SSO middleware", {
              message: "require SSO before summarise",
              file: "src/middleware/auth.ts",
            }, () => {
              dispatch({ type: "FEATURE", patch: { sso: true } });
              dispatch({ type: "NET", call: internalCall() });
              dispatch({ type: "TAB", tab: "network" });
              dispatch({ type: "BUSY", label: null });
              later(900, () => dispatch({ type: "TAB", tab: "preview" }));
              later(1200, () => {
                speak(ownershipFinding, {
                  wait: 240,
                  stage: "ownership",
                  suggestions: ownershipSuggestions,
                });
              });
            });
          });
        });
      });
    },
    [later, playDiff, speak],
  );

  const applyCitations = useCallback(
    (openingText: string, add: boolean) => {
      speak(openingText, { wait: 240, awaiting: false });
      if (!add) {
        later(900, () => {
          speak(uxFinding, { wait: 260, stage: "ux-assumption", suggestions: uxSuggestions });
        });
        return;
      }
      later(600, () => {
        playDiff(diffBrief, "Citing claims in Brief.tsx", {
          message: "cite material claims in the brief",
          file: "src/components/Brief.tsx",
        }, () => {
          dispatch({ type: "FEATURE", patch: { citations: true } });
          dispatch({ type: "TAB", tab: "preview" });
          later(800, () => {
            speak(lowConfidenceNote, { wait: 240, awaiting: false });
            later(500, () => {
              playDiff(diffConfidence, "Flagging a thin claim", {
                message: "surface low-confidence claims",
                file: "src/components/Brief.tsx",
              }, () => {
                dispatch({ type: "FEATURE", patch: { lowConfidence: true } });
                dispatch({ type: "TAB", tab: "preview" });
                dispatch({ type: "BUSY", label: null });
                later(900, () => {
                  speak(uxFinding, {
                    wait: 260,
                    stage: "ux-assumption",
                    suggestions: uxSuggestions,
                  });
                });
              });
            });
          });
        });
      });
    },
    [later, playDiff, speak],
  );

  const applyUx = useCallback(
    (openingText: string) => {
      speak(openingText, { wait: 240, awaiting: false });
      later(600, () => {
        playDiff(diffAnalytics, "Instrumenting source choice", {
          message: "track document vs matter source choice",
          file: "src/lib/pilot.ts",
        }, () => {
          dispatch({ type: "FEATURE", patch: { analytics: true } });
          dispatch({ type: "TAB", tab: "preview" });
          dispatch({ type: "BUSY", label: null });
          later(1000, () => {
            speak(readinessReply, {
              wait: 280,
              stage: "readiness",
              suggestions: readinessSuggestions,
            });
          });
        });
      });
    },
    [later, playDiff, speak],
  );

  const finishFocus = useCallback(
    (text: string) => {
      dispatch({ type: "FOCUS", id: null });
      dispatch({ type: "TAB", tab: "pack" });
      speak(text, {
        wait: 240,
        stage: returnRef.current ?? undefined,
        suggestions: backToPackSuggestions,
      });
    },
    [speak],
  );

  const handleFocusIntent = useCallback(
    (intent: Intent, id: DecisionId) => {
      if (intent === "return-view") {
        dispatch({ type: "FOCUS", id: null });
        dispatch({ type: "TAB", tab: "pack" });
        speak(returnedToPack, {
          wait: 220,
          stage: returnRef.current ?? undefined,
          suggestions: [],
        });
        return;
      }

      if (id === "data") {
        if (intent === "dummy") {
          dispatch({
            type: "SETTLE",
            id: "data",
            status: "settled",
            line: "Pilot stays on dummy data; production still assumes an approved model",
          });
        } else if (intent === "unsure") {
          dispatch({
            type: "SETTLE",
            id: "data",
            status: "needs-owner",
            line: "Whether production uses real matter data",
            owner: "Practice",
          });
        } else {
          dispatch({
            type: "SETTLE",
            id: "data",
            status: "settled",
            line: "Production uses firm-approved model only",
          });
        }
        finishFocus(recordedGeneric);
        return;
      }

      if (id === "ownership") {
        if (intent === "innovation-owner") {
          dispatch({
            type: "SETTLE",
            id: "ownership",
            status: "settled",
            line: "Innovation sponsors; disputes still nominates a pilot owner",
          });
        } else if (intent === "unknown-owner") {
          dispatch({
            type: "SETTLE",
            id: "ownership",
            status: "needs-owner",
            line: "Pilot owner after the hackathon",
            owner: "Practice",
          });
        } else {
          dispatch({
            type: "SETTLE",
            id: "ownership",
            status: "settled",
            line: "Disputes practice owns the pilot",
          });
        }
        finishFocus(practiceOwnerReply);
        return;
      }

      if (id === "citations") {
        if (intent === "skip-citations" || intent === "undecided-citations") {
          dispatch({
            type: "SETTLE",
            id: "citations",
            status: "needs-owner",
            line: "Whether material claims must cite a source",
            owner: "Pilot owner",
          });
        } else {
          dispatch({
            type: "SETTLE",
            id: "citations",
            status: "settled",
            line: "Every material claim cites a source",
          });
        }
        finishFocus(recordedGeneric);
        return;
      }

      if (id === "infosec") {
        if (intent === "infosec-undecided") {
          dispatch({
            type: "SETTLE",
            id: "infosec",
            status: "needs-owner",
            line: "InfoSec review of the production path",
            owner: "InfoSec",
          });
          finishFocus("Still waiting on an InfoSec owner.");
          return;
        }
        if (intent === "infosec-queue") {
          dispatch({
            type: "SETTLE",
            id: "infosec",
            status: "settled",
            line: "InfoSec queue owns the review — still a human decision",
            owner: "InfoSec",
          });
          finishFocus(recordedInfosecQueue);
          return;
        }
        dispatch({
          type: "SETTLE",
          id: "infosec",
          status: "settled",
          line: "InfoSec review owned by Priya Chen — still a human decision",
          owner: "Priya Chen",
        });
        finishFocus(recordedInfosecNamed);
        return;
      }

      if (id === "risk") {
        if (intent === "risk-undecided") {
          dispatch({
            type: "SETTLE",
            id: "risk",
            status: "needs-owner",
            line: "Risk / data-use assessment",
            owner: "Risk",
          });
          finishFocus("Still waiting on a Risk owner.");
          return;
        }
        if (intent === "risk-queue") {
          dispatch({
            type: "SETTLE",
            id: "risk",
            status: "settled",
            line: "Risk queue owns the data-use note — still a human decision",
            owner: "Risk",
          });
          finishFocus(recordedRiskQueue);
          return;
        }
        dispatch({
          type: "SETTLE",
          id: "risk",
          status: "settled",
          line: "Risk review owned by James Okonkwo — still a human decision",
          owner: "James Okonkwo",
        });
        finishFocus(recordedRiskNamed);
        return;
      }

      if (id === "ux") {
        if (intent === "undecided-ux") {
          dispatch({
            type: "SETTLE",
            id: "ux",
            status: "needs-owner",
            line: "How lawyers choose source material — watch them use it",
            owner: "Practice",
          });
          finishFocus("I’ll leave the test without a named owner.");
          return;
        }
        if (intent === "ux-self") {
          dispatch({
            type: "SETTLE",
            id: "ux",
            status: "settled",
            line: "Builder will run the three-lawyer test",
            owner: "Builder",
          });
          finishFocus(recordedUxSelf);
          return;
        }
        dispatch({
          type: "SETTLE",
          id: "ux",
          status: "settled",
          line: "Alex Reed will run the three-lawyer test",
          owner: "Alex Reed",
        });
        finishFocus(recordedUxRunner);
        return;
      }

      finishFocus(recordedGeneric);
    },
    [finishFocus, speak],
  );

  const reopenDecision = useCallback(
    (id: DecisionId) => {
      const item = state.trail.find((row) => row.id === id);
      if (!item || item.status === "locked" || item.status === "settled") return;

      const view =
        stageRef.current === "pack" || stageRef.current === "readiness"
          ? stageRef.current
          : "pack";
      dispatch({ type: "FOCUS", id, returnView: view });
      dispatch({ type: "TAB", tab: "pack" });
      if (stageRef.current !== "readiness" && stageRef.current !== "pack") {
        dispatch({ type: "STAGE", stage: view });
      }

      const prompt =
        id === "infosec"
          ? { text: infosecReopen, suggestions: infosecSuggestions }
          : id === "risk"
            ? { text: riskReopen, suggestions: riskSuggestions }
            : id === "ux"
              ? { text: uxOwnerReopen, suggestions: uxOwnerSuggestions }
              : id === "ownership"
                ? { text: ownershipFinding, suggestions: ownershipSuggestions }
                : id === "citations"
                  ? { text: citationFinding, suggestions: citationSuggestions }
                  : { text: firstFinding, suggestions: dataSuggestions };

      speak(prompt.text, { wait: 220, suggestions: prompt.suggestions });
    },
    [speak, state.trail],
  );

  const handleIntent = useCallback(
    (intent: Intent, raw: string) => {
      const stage = stageRef.current;

      if (intent === "reset") {
        clearTimers();
        commitCount.current = 0;
        dispatch({ type: "RESET" });
        return;
      }

      if (focusRef.current) {
        handleFocusIntent(intent, focusRef.current);
        return;
      }

      if (intent === "return-view") {
        const view = returnRef.current ?? (stage === "readiness" ? "readiness" : "pack");
        dispatch({ type: "STAGE", stage: view });
        dispatch({ type: "TAB", tab: "pack" });
        speak(returnedToPack, { wait: 220, stage: view, suggestions: [] });
        return;
      }

      if (stage === "inspecting") {
        speak(steerInspecting, { wait: 220, awaiting: false });
        return;
      }

      if (
        intent === "prepare-pack" &&
        (stage === "intake" ||
          stage === "data-leaving" ||
          stage === "ownership" ||
          stage === "citations" ||
          stage === "ux-assumption")
      ) {
        speak(tooEarlyPack, {
          wait: 240,
          suggestions:
            stage === "data-leaving"
              ? dataSuggestions
              : stage === "ownership"
                ? ownershipSuggestions
                : stage === "citations"
                  ? citationSuggestions
                  : stage === "ux-assumption"
                    ? uxSuggestions
                    : [],
        });
        return;
      }

      if (stage === "data-leaving") {
        if (intent === "dummy") {
          dispatch({
            type: "SETTLE",
            id: "data",
            status: "settled",
            line: "Pilot stays on dummy data; production still assumes an approved model",
          });
          applyDataChange(dummyReply);
          return;
        }
        if (intent === "unsure") {
          dispatch({
            type: "SETTLE",
            id: "data",
            status: "needs-owner",
            line: "Whether production uses real matter data",
            owner: "Practice",
          });
          applyDataChange(unsureReply);
          return;
        }
        dispatch({
          type: "SETTLE",
          id: "data",
          status: "settled",
          line: "Production uses firm-approved model only",
        });
        applyDataChange(approvedReply);
        return;
      }

      if (stage === "ownership") {
        if (intent === "innovation-owner") {
          dispatch({
            type: "SETTLE",
            id: "ownership",
            status: "settled",
            line: "Innovation sponsors; disputes still nominates a pilot owner",
          });
          speak(innovationOwnerReply, { wait: 240, awaiting: false });
        } else if (intent === "unknown-owner") {
          dispatch({
            type: "SETTLE",
            id: "ownership",
            status: "needs-owner",
            line: "Pilot owner after the hackathon",
            owner: "Practice",
          });
          speak(unknownOwnerReply, { wait: 240, awaiting: false });
        } else {
          dispatch({
            type: "SETTLE",
            id: "ownership",
            status: "settled",
            line: "Disputes practice owns the pilot",
          });
          speak(practiceOwnerReply, { wait: 240, awaiting: false });
        }
        later(900, () => {
          speak(citationFinding, {
            wait: 240,
            stage: "citations",
            suggestions: citationSuggestions,
          });
        });
        return;
      }

      if (stage === "citations") {
        if (intent === "skip-citations" || intent === "undecided-citations") {
          dispatch({
            type: "SETTLE",
            id: "citations",
            status: "needs-owner",
            line: "Whether material claims must cite a source",
            owner: "Pilot owner",
          });
          applyCitations(
            intent === "skip-citations" ? skipCitationsReply : undecidedCitationsReply,
            false,
          );
          return;
        }
        dispatch({
          type: "SETTLE",
          id: "citations",
          status: "settled",
          line: "Every material claim cites a source",
        });
        applyCitations(addCitationsReply, true);
        return;
      }

      if (stage === "ux-assumption") {
        if (intent === "redesign") {
          dispatch({
            type: "SETTLE",
            id: "ux",
            status: "needs-owner",
            line: "How lawyers choose source material — watch them use it",
            owner: "Practice",
          });
          applyUx(redesignReply);
          return;
        }
        if (intent === "why-ux") {
          dispatch({
            type: "SETTLE",
            id: "ux",
            status: "needs-owner",
            line: "How lawyers choose source material — watch them use it",
            owner: "Practice",
          });
          applyUx(whyUxReply);
          return;
        }
        if (intent === "undecided-ux") {
          dispatch({
            type: "SETTLE",
            id: "ux",
            status: "needs-owner",
            line: "How lawyers choose source material — watch them use it",
            owner: "Practice",
          });
          applyUx(undecidedUxReply);
          return;
        }
        dispatch({
          type: "SETTLE",
          id: "ux",
          status: "needs-owner",
          line: "How lawyers choose source material — watch them use it",
          owner: "Practice",
        });
        applyUx(validateReply);
        return;
      }

      if (stage === "readiness" || stage === "pack") {
        if (intent === "ask-remaining") {
          speak(remainingReply, {
            wait: 240,
            suggestions: readinessSuggestions,
          });
          return;
        }
        if (intent === "ask-risks") {
          speak(risksReply, {
            wait: 240,
            suggestions: readinessSuggestions,
          });
          return;
        }
        dispatch({ type: "STAGE", stage: "pack" });
        dispatch({ type: "TAB", tab: "pack" });
        speak(packReply, { wait: 260, stage: "pack", suggestions: [] });
        return;
      }

      speak(
        raw.length > 80
          ? steerGeneric
          : "I can work with that. The useful move is still the decision in front of us.",
        {
          wait: 240,
          suggestions: stage === "intake" ? [] : state.suggestions,
        },
      );
    },
    [
      applyCitations,
      applyDataChange,
      applyUx,
      clearTimers,
      handleFocusIntent,
      later,
      speak,
      state.suggestions,
    ],
  );

  const send = useCallback(
    (text: string) => {
      const trimmed = text.trim();
      if (!trimmed) return;
      const stage = stageRef.current;
      if (stage === "intake") {
        analyseRepository();
        return;
      }
      dispatch({ type: "USER", text: trimmed });
      const focused = focusRef.current;
      handleIntent(focused ? interpretDecision(trimmed, focused) : interpret(trimmed, stage), trimmed);
    },
    [analyseRepository, handleIntent],
  );

  const reset = useCallback(() => {
    clearTimers();
    commitCount.current = 0;
    dispatch({ type: "RESET" });
  }, [clearTimers]);

  const setCitation = useCallback((id: string | null) => {
    dispatch({ type: "CITATION", id });
  }, []);

  const setTab = useCallback((tab: StudioTab) => {
    dispatch({ type: "TAB", tab });
  }, []);

  const setCompare = useCallback((compare: CompareMode) => {
    dispatch({ type: "COMPARE", compare });
  }, []);

  const toggleDoc = useCallback((id: string) => {
    dispatch({
      type: "DOCS",
      ids: state.selectedDocIds.includes(id)
        ? state.selectedDocIds.filter((item) => item !== id)
        : [...state.selectedDocIds, id],
    });
  }, [state.selectedDocIds]);

  const setSourceMode = useCallback((mode: "documents" | "matter") => {
    dispatch({ type: "SOURCE", mode });
  }, []);

  const generateBrief = useCallback(() => {
    if (state.generating) return;
    runGenerate(false);
  }, [runGenerate, state.generating]);

  const preparePack = useCallback(() => {
    if (stageRef.current === "pack") {
      dispatch({ type: "TAB", tab: "pack" });
      return;
    }
    dispatch({ type: "USER", text: "Prepare pilot pack." });
    dispatch({ type: "STAGE", stage: "pack" });
    dispatch({ type: "TAB", tab: "pack" });
    speak(packReply, { wait: 260, stage: "pack", suggestions: [] });
  }, [speak]);

  const returnToPack = useCallback(() => {
    if (!focusRef.current) return;
    dispatch({ type: "FOCUS", id: null });
    dispatch({ type: "TAB", tab: "pack" });
    speak(returnedToPack, {
      wait: 220,
      stage: returnRef.current ?? undefined,
      suggestions: [],
    });
  }, [speak]);

  useEffect(() => () => clearTimers(), [clearTimers]);

  const activeWork = state.busy
    ? { id: "busy", label: state.busy, status: "working" as const }
    : (state.work.find((item) => item.status === "working") ?? null);
  const workDone = state.work.every((item) => item.status === "done") && !state.busy;

  return {
    ...state,
    send,
    analyseRepository,
    reopenDecision,
    returnToPack,
    reset,
    setCitation,
    setTab,
    setCompare,
    toggleDoc,
    setSourceMode,
    generateBrief,
    preparePack,
    activeWork,
    workDone,
  };
}
