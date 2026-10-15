import type { PrototypeId } from "../types";

export type PrototypeOption = {
  id: PrototypeId;
  name: string;
  meta: string;
  available: boolean;
};

export const prototypes: PrototypeOption[] = [
  {
    id: "matter-brief",
    name: "Matter Brief",
    meta: "Hackathon prototype · documents in, client-ready summary out",
    available: true,
  },
  {
    id: "clause-lens",
    name: "Clause Lens",
    meta: "Side-by-side clause comparison · not in this walkthrough",
    available: false,
  },
  {
    id: "conflicts-sketch",
    name: "Conflicts sketch",
    meta: "Early conflict check · paused",
    available: false,
  },
];
