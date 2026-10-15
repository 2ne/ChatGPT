export type Stage =
  | "intake"
  | "inspecting"
  | "data-leaving"
  | "architecture"
  | "ownership"
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

export type Intent =
  | "reset"
  | "approved"
  | "dummy"
  | "unsure"
  | "practice-owner"
  | "innovation-owner"
  | "unknown-owner"
  | "add-citations"
  | "skip-citations"
  | "explain-citations"
  | "undecided-citations"
  | "validate"
  | "redesign"
  | "why-ux"
  | "undecided-ux"
  | "ux-runner"
  | "ux-self"
  | "infosec-named"
  | "infosec-queue"
  | "infosec-undecided"
  | "risk-named"
  | "risk-queue"
  | "risk-undecided"
  | "continue-readiness"
  | "prepare-pack"
  | "return-view"
  | "ask-remaining"
  | "ask-risks"
  | "steer";
