export type InspectCard = {
  id: string;
  title: string;
  body: string;
  risk?: boolean;
  span?: 2;
  appearAt: number;
};

export const inspectCards: InspectCard[] = [
  {
    id: "purpose",
    title: "Purpose",
    body: "Lawyers upload matter documents and get a concise, client-ready summary.",
    appearAt: 180,
  },
  {
    id: "users",
    title: "People",
    body: "Associates drafting the update; partners sending it. Nobody has sat with them yet.",
    appearAt: 320,
  },
  {
    id: "tech",
    title: "How it runs",
    body: "Vite and React. src/api/summarise.ts posts raw document text to an external LLM API.",
    appearAt: 460,
  },
  {
    id: "auth",
    title: "Authentication",
    body: "None. Anyone with the URL can upload a file and generate a brief.",
    appearAt: 600,
  },
  {
    id: "ux",
    title: "Current flow",
    body: "Upload a file → generate → copy the summary. No matter grouping, confidence, or recovery states.",
    span: 2,
    appearAt: 740,
  },
  {
    id: "data",
    title: "Data leaving the firm",
    body: "Full document text is sent to a third-party model provider. There is no description of what leaves, and no approved boundary.",
    risk: true,
    span: 2,
    appearAt: 900,
  },
];

export const workItemsSeed = [
  { id: "surface", label: "Reading the prototype surface", delay: 120 },
  { id: "data", label: "Mapping data leaving the firm", delay: 520 },
  { id: "auth", label: "Checking authentication and permissions", delay: 2400 },
  { id: "claims", label: "Reviewing how claims are produced", delay: 5200 },
  { id: "upload", label: "Testing the upload assumption", delay: 9000 },
  { id: "pack", label: "Drafting what Risk and InfoSec will ask for", delay: 12500 },
];
