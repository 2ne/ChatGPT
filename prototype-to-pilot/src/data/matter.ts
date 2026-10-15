import type { DecisionRecord } from "./decisions";

export type Citation = {
  id: string;
  n: number;
  document: string;
  locator: string;
  passage: string;
};

export const matter = {
  kicker: "Matter Brief · draft for discussion",
  title: "Northharbour Logistics v Pellam Components",
  meta: "Client update · 15 October 2026 · not for sending",
  citations: [
    {
      id: "c1",
      n: 1,
      document: "Supply agreement",
      locator: "Clause 14.2 · 18 January 2024",
      passage:
        "Time of delivery of tooling lots is of the essence. Failure to deliver within ten business days of the agreed date constitutes a material breach.",
    },
    {
      id: "c2",
      n: 2,
      document: "Letter of claim",
      locator: "12 March 2026 · paragraph 7",
      passage:
        "By reason of the delay, Northharbour has incurred additional hire, storage and wasted staff time amounting to £240,000, which is claimed as damages.",
    },
    {
      id: "c3",
      n: 3,
      document: "Email from Pellam",
      locator: "4 February 2026 · 16:12",
      passage:
        "We accept that the Q3 tooling lot shipped late. We do not accept the loss figure, which appears to include costs unrelated to this delivery.",
    },
  ] satisfies Citation[],
};

export type OutputTone = "ready" | "review" | "owner";

export type ReadinessOutput = {
  id: string;
  title: string;
  note: string;
  status: string;
  tone: OutputTone;
};

export function outputsFromTrail(trail: DecisionRecord[]): ReadinessOutput[] {
  const byId = Object.fromEntries(trail.map((item) => [item.id, item]));
  const named = (id: string) => byId[id]?.status === "settled";

  return [
    {
      id: "architecture",
      title: "Proposed production architecture",
      note: "Approved internal model; external provider marked prototype-only.",
      status: "Draft ready",
      tone: "ready",
    },
    {
      id: "infosec",
      title: "Draft InfoSec summary",
      note: named("infosec")
        ? "Owner named. InfoSec still has to review — this is not an approval."
        : "What data moves, where, and which controls are still missing.",
      status: named("infosec") ? "Needs human review" : "Needs owner",
      tone: named("infosec") ? "review" : "owner",
    },
    {
      id: "risk",
      title: "Draft Risk / data-use assessment",
      note: named("risk")
        ? "Owner named. Risk still has to review the data-use note."
        : "Confidentiality, hallucination and client-ready output. A person still has to own this.",
      status: named("risk") ? "Needs human review" : "Needs owner",
      tone: named("risk") ? "review" : "owner",
    },
    {
      id: "ux",
      title: "UX validation plan",
      note: named("ux")
        ? "Someone will run the three-lawyer test. The result is still outstanding."
        : "Three lawyers, one assumption, a clear stop/go signal.",
      status: named("ux") ? "Draft ready" : "Needs owner",
      tone: named("ux") ? "ready" : "owner",
    },
    {
      id: "checklist",
      title: "Pilot checklist",
      note: "Who uses it, what is measured, and what stops the pilot.",
      status: named("ownership") ? "Draft ready" : "Needs owner",
      tone: named("ownership") ? "ready" : "owner",
    },
  ];
}
