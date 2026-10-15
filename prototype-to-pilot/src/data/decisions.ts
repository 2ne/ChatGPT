export type DecisionId = "data" | "ownership" | "citations" | "infosec" | "risk" | "ux";

export type DecisionStatus = "locked" | "open" | "settled" | "needs-owner";

export type DecisionRecord = {
  id: DecisionId;
  status: DecisionStatus;
  line: string;
  owner?: string;
};

type Spec = {
  id: DecisionId;
  openLine: string;
  lockedLine: string;
  dependsOn: DecisionId[];
  owner?: string;
};

export const decisionCatalog: Spec[] = [
  {
    id: "data",
    openLine: "Will this see real client matter data?",
    lockedLine: "Production data",
    dependsOn: [],
  },
  {
    id: "ownership",
    openLine: "Who owns this after the hackathon?",
    lockedLine: "Ownership",
    dependsOn: ["data"],
  },
  {
    id: "citations",
    openLine: "Should every material claim cite a source?",
    lockedLine: "Source citations",
    dependsOn: ["data"],
  },
  {
    id: "infosec",
    openLine: "InfoSec review of the production path",
    lockedLine: "InfoSec review",
    dependsOn: ["data"],
    owner: "InfoSec",
  },
  {
    id: "risk",
    openLine: "Risk / data-use assessment",
    lockedLine: "Risk review",
    dependsOn: ["data"],
    owner: "Risk",
  },
  {
    id: "ux",
    openLine: "How lawyers choose source material",
    lockedLine: "Upload assumption",
    dependsOn: ["citations"],
    owner: "Practice",
  },
];

function specFor(id: DecisionId) {
  return decisionCatalog.find((item) => item.id === id)!;
}

export function createTrail(): DecisionRecord[] {
  return decisionCatalog.map((item) => ({
    id: item.id,
    status: item.dependsOn.length === 0 ? "open" : "locked",
    line: item.dependsOn.length === 0 ? item.openLine : item.lockedLine,
    owner: item.owner,
  }));
}

function answered(item: DecisionRecord) {
  return item.status === "settled" || item.status === "needs-owner";
}

export function unlockTrail(trail: DecisionRecord[]): DecisionRecord[] {
  return trail.map((item) => {
    if (item.status !== "locked") return item;
    const spec = specFor(item.id);
    const ready = spec.dependsOn.every((dep) => {
      const record = trail.find((row) => row.id === dep);
      return record ? answered(record) : false;
    });
    if (!ready) return item;
    if (item.id === "infosec" || item.id === "risk") {
      return {
        ...item,
        status: "needs-owner" as const,
        line: spec.openLine,
        owner: spec.owner,
      };
    }
    return { ...item, status: "open" as const, line: spec.openLine, owner: spec.owner };
  });
}

export function settleTrail(
  trail: DecisionRecord[],
  id: DecisionId,
  status: "settled" | "needs-owner",
  line: string,
  owner?: string,
): DecisionRecord[] {
  const next = trail.map((item) =>
    item.id === id ? { ...item, status, line, owner: owner ?? item.owner } : item,
  );
  return unlockTrail(next);
}

export function settledItems(trail: DecisionRecord[]) {
  return trail.filter((item) => item.status === "settled");
}

export function openItems(trail: DecisionRecord[]) {
  return trail.filter((item) => item.status === "open" || item.status === "needs-owner");
}

export function lockedCount(trail: DecisionRecord[]) {
  return trail.filter((item) => item.status === "locked").length;
}
