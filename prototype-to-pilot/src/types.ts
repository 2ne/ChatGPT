export type Stage =
  | "intake"
  | "inspecting"
  | "data-leaving"
  | "ownership"
  | "citations"
  | "ux-assumption"
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

export type StudioTab = "preview" | "code" | "network" | "pack";

export type CompareMode = "live" | "hackathon";

export type ProtoFeatures = {
  sso: boolean;
  internalModel: boolean;
  citations: boolean;
  lowConfidence: boolean;
  analytics: boolean;
};

export type DiffLine = {
  kind: "ctx" | "add" | "del";
  text: string;
};

export type DiffHunk = {
  path: string;
  lines: DiffLine[];
};

export type CommitRecord = {
  id: string;
  hash: string;
  message: string;
  file: string;
};

export type NetCall = {
  id: string;
  method: string;
  host: string;
  path: string;
  status: number;
  ms: number;
  external: boolean;
  auth?: boolean;
  audit?: string;
};

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
