import { useCallback, useEffect, useReducer, useRef } from "react";
import {
  addCitationsReply,
  approvedFollowOn,
  approvedReply,
  backToDraftsSuggestions,
  backToPackSuggestions,
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
  validationSuggestions,
  whyUxReply,
} from "./data/copy";
import { createTrail, settleTrail, type DecisionId, type DecisionRecord } from "./data/decisions";
import { workItemsSeed } from "./data/inspection";
import { scanFiles } from "./data/scan";
import { uid } from "./lib/ids";
import { interpret, interpretDecision } from "./lib/interpret";
import type { Intent, Message, PrototypeId, Stage, Suggestion, WorkItem } from "./types";

export type SessionState = {
  stage: Stage;
  prototypeId: PrototypeId | null;
  messages: Message[];
  suggestions: Suggestion[];
  awaiting: boolean;
  typing: boolean;
  work: WorkItem[];
  visibleInspect: number;
  visibleFiles: number;
  selectedCitation: string | null;
  trail: DecisionRecord[];
  focusId: DecisionId | null;
  returnView: "readiness" | "pack" | null;
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
  | { type: "CITATION"; id: string | null }
  | {
      type: "SETTLE";
      id: DecisionId;
      status: "settled" | "needs-owner";
      line: string;
      owner?: string;
    }
  | { type: "SUGGESTIONS"; suggestions: Suggestion[] }
  | { type: "FOCUS"; id: DecisionId | null; returnView?: "readiness" | "pack" | null };

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
    visibleInspect: 0,
    visibleFiles: 0,
    selectedCitation: null,
    trail: createTrail(),
    focusId: null,
    returnView: null,
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

export function useSession() {
  const [state, dispatch] = useReducer(reducer, undefined, initial);
  const timers = useRef<number[]>([]);
  const stageRef = useRef(state.stage);
  const focusRef = useRef<DecisionId | null>(null);
  const returnRef = useRef<"readiness" | "pack" | null>(null);
  stageRef.current = state.stage;
  focusRef.current = state.focusId;
  returnRef.current = state.returnView;

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
      later(options?.wait ?? 320, () => {
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

  const analyseRepository = useCallback(() => {
    if (stageRef.current !== "intake") return;
    dispatch({ type: "START" });

    scanFiles.forEach((_, index) => {
      later(140 + index * 320, () => dispatch({ type: "FILES", count: index + 1 }));
    });

    const inspectAt = [380, 700, 1020, 1340, 1660, 2050];
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

    later(2600, () => {
      dispatch({ type: "TYPING", value: true });
    });
    later(3000, () => {
      dispatch({
        type: "ASSISTANT",
        text: repoSummary,
        stage: "inspecting",
        awaiting: false,
      });
    });
    later(4000, () => {
      dispatch({ type: "TYPING", value: true });
    });
    later(4300, () => {
      dispatch({
        type: "ASSISTANT",
        text: firstFinding,
        stage: "data-leaving",
        suggestions: dataSuggestions,
        awaiting: true,
      });
    });
  }, [later]);

  const afterArchitecture = useCallback(
    (openingText: string) => {
      dispatch({ type: "STAGE", stage: "architecture" });
      speak(openingText, { wait: 280, stage: "architecture", awaiting: false });
      later(1100, () => {
        speak(approvedFollowOn, { wait: 240, stage: "architecture", awaiting: false });
      });
      later(2100, () => {
        speak(ownershipFinding, {
          wait: 260,
          stage: "ownership",
          suggestions: ownershipSuggestions,
        });
      });
    },
    [later, speak],
  );

  const afterOwnership = useCallback(
    (openingText: string) => {
      speak(openingText, { wait: 280, stage: "ownership", awaiting: false });
      later(1100, () => {
        speak(citationFinding, {
          wait: 260,
          stage: "citations",
          suggestions: citationSuggestions,
        });
      });
    },
    [later, speak],
  );

  const afterEvidence = useCallback(
    (openingText: string) => {
      dispatch({ type: "STAGE", stage: "evidence" });
      speak(openingText, { wait: 280, stage: "evidence", awaiting: false });
      later(1400, () => {
        speak(uxFinding, {
          wait: 300,
          stage: "ux-assumption",
          suggestions: uxSuggestions,
        });
      });
    },
    [later, speak],
  );

  const backSuggestions = useCallback(() => {
    return returnRef.current === "readiness" ? backToDraftsSuggestions : backToPackSuggestions;
  }, []);

  const finishFocus = useCallback(
    (text: string) => {
      dispatch({ type: "FOCUS", id: null });
      speak(text, {
        wait: 260,
        stage: returnRef.current ?? undefined,
        suggestions: backSuggestions(),
      });
    },
    [backSuggestions, speak],
  );

  const handleFocusIntent = useCallback(
    (intent: Intent, id: DecisionId) => {
      if (intent === "return-view") {
        dispatch({ type: "FOCUS", id: null });
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
          finishFocus("Still waiting on an InfoSec owner. I’ll leave it open.");
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
          finishFocus("Still waiting on a Risk owner. I’ll leave it open.");
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

  const returnToPack = useCallback(() => {
    if (!focusRef.current) return;
    dispatch({ type: "FOCUS", id: null });
    speak(returnedToPack, {
      wait: 220,
      stage: returnRef.current ?? undefined,
      suggestions: [],
    });
  }, [speak]);

  const reopenDecision = useCallback(
    (id: DecisionId) => {
      const item = state.trail.find((row) => row.id === id);
      if (!item || item.status === "locked") return;
      if (item.status === "settled") return;

      const view =
        stageRef.current === "pack" || stageRef.current === "readiness"
          ? stageRef.current
          : "pack";
      dispatch({ type: "FOCUS", id, returnView: view });
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

      speak(prompt.text, { wait: 240, suggestions: prompt.suggestions });
    },
    [speak, state.trail],
  );

  const afterValidation = useCallback(
    (openingText: string) => {
      dispatch({ type: "STAGE", stage: "validation" });
      speak(openingText, {
        wait: 280,
        stage: "validation",
        suggestions: validationSuggestions,
      });
    },
    [speak],
  );

  const handleIntent = useCallback(
    (intent: Intent, raw: string) => {
      const stage = stageRef.current;

      if (intent === "reset") {
        clearTimers();
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
        speak(returnedToPack, { wait: 220, stage: view, suggestions: [] });
        return;
      }

      if (stage === "inspecting") {
        speak(steerInspecting, { wait: 240, awaiting: false });
        return;
      }

      if (
        intent === "prepare-pack" &&
        (stage === "intake" ||
          stage === "data-leaving" ||
          stage === "ownership" ||
          stage === "citations" ||
          stage === "ux-assumption" ||
          stage === "architecture" ||
          stage === "evidence")
      ) {
        speak(tooEarlyPack, {
          wait: 260,
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
          afterArchitecture(dummyReply);
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
          afterArchitecture(unsureReply);
          return;
        }
        dispatch({
          type: "SETTLE",
          id: "data",
          status: "settled",
          line: "Production uses firm-approved model only",
        });
        afterArchitecture(approvedReply);
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
          afterOwnership(innovationOwnerReply);
          return;
        }
        if (intent === "unknown-owner") {
          dispatch({
            type: "SETTLE",
            id: "ownership",
            status: "needs-owner",
            line: "Pilot owner after the hackathon",
            owner: "Practice",
          });
          afterOwnership(unknownOwnerReply);
          return;
        }
        dispatch({
          type: "SETTLE",
          id: "ownership",
          status: "settled",
          line: "Disputes practice owns the pilot",
        });
        afterOwnership(practiceOwnerReply);
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
          afterEvidence(intent === "skip-citations" ? skipCitationsReply : undecidedCitationsReply);
          return;
        }
        dispatch({
          type: "SETTLE",
          id: "citations",
          status: "settled",
          line: "Every material claim cites a source",
        });
        afterEvidence(addCitationsReply);
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
          afterValidation(redesignReply);
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
          afterValidation(whyUxReply);
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
          afterValidation(undecidedUxReply);
          return;
        }
        dispatch({
          type: "SETTLE",
          id: "ux",
          status: "needs-owner",
          line: "How lawyers choose source material — watch them use it",
          owner: "Practice",
        });
        afterValidation(validateReply);
        return;
      }

      if (stage === "validation") {
        if (intent === "ask-remaining") {
          speak(remainingReply, {
            wait: 260,
            suggestions: validationSuggestions,
          });
          return;
        }
        if (intent === "ask-risks") {
          speak(risksReply, {
            wait: 260,
            suggestions: validationSuggestions,
          });
          return;
        }
        dispatch({ type: "STAGE", stage: "readiness" });
        speak(readinessReply, {
          wait: 280,
          stage: "readiness",
          suggestions: readinessSuggestions,
        });
        return;
      }

      if (stage === "readiness" || stage === "pack") {
        if (intent === "ask-remaining") {
          speak(remainingReply, {
            wait: 260,
            suggestions: readinessSuggestions,
          });
          return;
        }
        if (intent === "ask-risks") {
          speak(risksReply, {
            wait: 260,
            suggestions: readinessSuggestions,
          });
          return;
        }
        dispatch({ type: "STAGE", stage: "pack" });
        speak(packReply, { wait: 280, stage: "pack", suggestions: [] });
        return;
      }

      if (stage === "architecture") {
        speak("That’s the production path I’d take. Next is who owns it after the hackathon — the code can’t tell me.", {
          wait: 260,
          awaiting: false,
        });
        later(900, () => {
          speak(ownershipFinding, {
            wait: 240,
            stage: "ownership",
            suggestions: ownershipSuggestions,
          });
        });
        return;
      }

      if (stage === "evidence") {
        speak(steerGeneric, { wait: 240, awaiting: false });
        later(800, () => {
          speak(uxFinding, {
            wait: 240,
            stage: "ux-assumption",
            suggestions: uxSuggestions,
          });
        });
        return;
      }

      speak(
        raw.length > 80
          ? steerGeneric
          : "I can work with that. The useful move is still the decision in front of us.",
        {
          wait: 260,
          suggestions: stage === "intake" ? [] : state.suggestions,
        },
      );
    },
    [
      afterArchitecture,
      afterEvidence,
      afterOwnership,
      afterValidation,
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
    dispatch({ type: "RESET" });
  }, [clearTimers]);

  const setCitation = useCallback((id: string | null) => {
    dispatch({ type: "CITATION", id });
  }, []);

  const preparePack = useCallback(() => {
    if (stageRef.current === "pack") return;
    dispatch({ type: "USER", text: "Prepare pilot pack." });
    dispatch({ type: "STAGE", stage: "pack" });
    speak(packReply, { wait: 280, stage: "pack", suggestions: [] });
  }, [speak]);

  useEffect(() => () => clearTimers(), [clearTimers]);

  const activeWork = state.work.find((item) => item.status === "working") ?? null;
  const workDone = state.work.every((item) => item.status === "done");

  return {
    ...state,
    send,
    analyseRepository,
    reopenDecision,
    returnToPack,
    reset,
    setCitation,
    preparePack,
    activeWork,
    workDone,
  };
}
