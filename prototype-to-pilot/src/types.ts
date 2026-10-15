export type Stage =
  | "intake"
  | "inspecting"
  | "data-leaving"
  | "architecture"
  | "citations"
  | "evidence"
  | "ux-assumption"
  | "validation"
  | "readiness"
  | "pack";

export type Role = "assistant" | "user";

export type Message = {
  id: string;
  role: Role;
  text: string;
};

export type Suggestion = {
  id: string;
  label: string;
  primary?: boolean;
};

export type WorkItem = {
  id: string;
  label: string;
  status: "pending" | "working" | "done";
};

export type PrototypeId = "matter-brief" | "clause-lens" | "conflicts-sketch";

export type DecisionKey = "matterData" | "citations" | "ux";

export type Decisions = {
  matterData: "approved" | "dummy" | "unsure" | null;
  citations: "add" | "skip" | "explain" | null;
  ux: "validate" | "redesign" | "why" | null;
};

export type Intent =
  | "reset"
  | "approved"
  | "dummy"
  | "unsure"
  | "add-citations"
  | "skip-citations"
  | "explain-citations"
  | "validate"
  | "redesign"
  | "why-ux"
  | "continue-readiness"
  | "prepare-pack"
  | "ask-remaining"
  | "ask-risks"
  | "steer";
