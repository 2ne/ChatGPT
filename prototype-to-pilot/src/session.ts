import { useCallback, useEffect, useReducer, useRef } from "react";
import {
  addCitationsReply,
  afterSelect,
  approvedFollowOn,
  approvedReply,
  citationFinding,
  citationSuggestions,
  dataSuggestions,
  dummyReply,
  explainCitationsReply,
  firstFinding,
  opening,
  packReply,
  readinessReply,
  readinessSuggestions,
  redesignReply,
  remainingReply,
  risksReply,
  skipCitationsReply,
  steerGeneric,
  steerInspecting,
  tooEarlyPack,
  unavailablePrototype,
  unsureReply,
  uxFinding,
  uxSuggestions,
  validateReply,
  validationSuggestions,
  whyUxReply,
} from "./data/copy";
import { workItemsSeed } from "./data/inspection";
import { uid } from "./lib/ids";
import { interpret } from "./lib/interpret";
import type {
  Decisions,
  Intent,
  Message,
  PrototypeId,
  Stage,
  Suggestion,
  WorkItem,
} from "./types";

export type SessionState = {
  stage: Stage;
  prototypeId: PrototypeId | null;
  messages: Message[];
  suggestions: Suggestion[];
  awaiting: boolean;
  typing: boolean;
  work: WorkItem[];
  visibleInspect: number;
  selectedCitation: string | null;
  decisions: Decisions;
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
  | { type: "SELECT"; id: PrototypeId }
  | { type: "INSPECT"; count: number }
  | { type: "WORK"; id: string; status: WorkItem["status"] }
  | { type: "CITATION"; id: string | null }
  | { type: "DECISION"; key: keyof Decisions; value: Decisions[keyof Decisions] }
  | { type: "SUGGESTIONS"; suggestions: Suggestion[] };

const initialWork: WorkItem[] = workItemsSeed.map((item) => ({
  id: item.id,
  label: item.label,
  status: "pending",
}));

function initial(): SessionState {
  return {
    stage: "intake",
    prototypeId: null,
    messages: [{ id: uid("m"), role: "assistant", text: opening }],
    suggestions: [],
    awaiting: true,
    typing: false,
    work: initialWork,
    visibleInspect: 0,
    selectedCitation: null,
    decisions: { matterData: null, citations: null, ux: null },
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
    case "SELECT":
      return {
        ...state,
        prototypeId: action.id,
        stage: "inspecting",
        awaiting: false,
        suggestions: [],
        work: initialWork.map((item, index) =>
          index === 0 ? { ...item, status: "working" } : item,
        ),
      };
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
    case "DECISION":
      return { ...state, decisions: { ...state.decisions, [action.key]: action.value } };
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
  stageRef.current = state.stage;

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

  const startInspection = useCallback((userText = "Matter Brief — the hackathon prototype.") => {
    if (stageRef.current !== "intake") return;
    dispatch({
      type: "USER",
      text: userText,
    });
    dispatch({ type: "SELECT", id: "matter-brief" });
    later(220, () => {
      dispatch({
        type: "ASSISTANT",
        text: afterSelect,
        stage: "inspecting",
        awaiting: false,
      });
    });

    const inspectAt = [180, 320, 460, 600, 740, 900];
    inspectAt.forEach((ms, index) => {
      later(ms + 280, () => dispatch({ type: "INSPECT", count: index + 1 }));
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

    later(1480, () => {
      dispatch({ type: "TYPING", value: true });
    });
    later(1760, () => {
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
      later(2400, () => {
        speak(citationFinding, {
          wait: 280,
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

      if (stage === "inspecting") {
        speak(steerInspecting, { wait: 240, awaiting: false });
        return;
      }

      if (intent === "prepare-pack" && (stage === "intake" || stage === "data-leaving" || stage === "citations" || stage === "ux-assumption" || stage === "architecture" || stage === "evidence")) {
        speak(tooEarlyPack, {
          wait: 260,
          suggestions: stage === "data-leaving" ? dataSuggestions : stage === "citations" ? citationSuggestions : stage === "ux-assumption" ? uxSuggestions : [],
        });
        return;
      }

      if (stage === "data-leaving") {
        if (intent === "dummy") {
          dispatch({ type: "DECISION", key: "matterData", value: "dummy" });
          afterArchitecture(dummyReply);
          return;
        }
        if (intent === "unsure") {
          dispatch({ type: "DECISION", key: "matterData", value: "unsure" });
          afterArchitecture(unsureReply);
          return;
        }
        dispatch({ type: "DECISION", key: "matterData", value: "approved" });
        afterArchitecture(approvedReply);
        return;
      }

      if (stage === "citations") {
        if (intent === "skip-citations") {
          dispatch({ type: "DECISION", key: "citations", value: "skip" });
          afterEvidence(skipCitationsReply);
          return;
        }
        if (intent === "explain-citations") {
          dispatch({ type: "DECISION", key: "citations", value: "explain" });
          afterEvidence(explainCitationsReply);
          return;
        }
        dispatch({ type: "DECISION", key: "citations", value: "add" });
        afterEvidence(addCitationsReply);
        return;
      }

      if (stage === "ux-assumption") {
        if (intent === "redesign") {
          dispatch({ type: "DECISION", key: "ux", value: "redesign" });
          afterValidation(redesignReply);
          return;
        }
        if (intent === "why-ux") {
          dispatch({ type: "DECISION", key: "ux", value: "why" });
          afterValidation(whyUxReply);
          return;
        }
        dispatch({ type: "DECISION", key: "ux", value: "validate" });
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
        speak("That’s the production path I’d take. The next problem is the brief itself — claims with no source.", {
          wait: 260,
          awaiting: false,
        });
        later(900, () => {
          speak(citationFinding, {
            wait: 240,
            stage: "citations",
            suggestions: citationSuggestions,
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
          suggestions:
            stage === "intake"
              ? []
              : state.suggestions,
        },
      );
    },
    [afterArchitecture, afterEvidence, afterValidation, clearTimers, later, speak, state.suggestions],
  );

  const send = useCallback(
    (text: string) => {
      const trimmed = text.trim();
      if (!trimmed) return;
      const stage = stageRef.current;
      if (stage === "intake" && /matter brief/i.test(trimmed)) {
        startInspection(trimmed);
        return;
      }
      dispatch({ type: "USER", text: trimmed });
      handleIntent(interpret(trimmed, stage), trimmed);
    },
    [handleIntent, startInspection],
  );

  const selectPrototype = useCallback(
    (id: PrototypeId, available: boolean) => {
      if (!available) {
        dispatch({ type: "USER", text: id === "clause-lens" ? "Clause Lens" : "Conflicts sketch" });
        speak(unavailablePrototype, { wait: 280 });
        return;
      }
      startInspection();
    },
    [speak, startInspection],
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
    selectPrototype,
    reset,
    setCitation,
    preparePack,
    activeWork,
    workDone,
  };
}
