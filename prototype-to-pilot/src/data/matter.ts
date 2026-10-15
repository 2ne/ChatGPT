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

export const outputs = [
  {
    id: "architecture",
    title: "Proposed production architecture",
    note: "Approved internal model; external provider marked prototype-only.",
    status: "Draft ready" as const,
    tone: "ready" as const,
  },
  {
    id: "infosec",
    title: "Draft InfoSec summary",
    note: "What data moves, where, and which controls are still missing.",
    status: "Draft ready" as const,
    tone: "ready" as const,
  },
  {
    id: "risk",
    title: "Draft Risk / data-use assessment",
    note: "Confidentiality, hallucination and client-ready output. A person still has to own this.",
    status: "Needs human review" as const,
    tone: "review" as const,
  },
  {
    id: "ux",
    title: "UX validation plan",
    note: "Three lawyers, one assumption, a clear stop/go signal.",
    status: "Needs owner" as const,
    tone: "owner" as const,
  },
  {
    id: "checklist",
    title: "Pilot checklist",
    note: "Who uses it, what is measured, and what stops the pilot.",
    status: "Draft ready" as const,
    tone: "ready" as const,
  },
];
