import type { Suggestion } from "../types";

export const repoSummary =
  "Here’s what I’ve found in this repository. Matter Brief lets lawyers upload documents and generates a client-ready summary. It’s a Vite/React app. There’s no authentication, and src/api/summarise.ts sends the full document text to an external model API.";

export const firstFinding =
  "I’ve found the first thing I’d change before this goes any further. That summarise call sends document text directly to an external model provider. If this is intended for real matter data, that will probably be a blocker for InfoSec and confidentiality review.\n\nIs the intention to use client matter data in production?";

export const dataSuggestions: Suggestion[] = [
  {
    id: "approved",
    label: "Yes, but only within firm-approved infrastructure.",
    primary: true,
  },
  { id: "dummy", label: "Not yet — keep it to dummy data." },
  { id: "unsure", label: "I’m not sure." },
];

export const approvedReply =
  "Understood. I’ll treat external model access as prototype-only and redesign the production architecture around an approved internal model.";

export const approvedFollowOn =
  "The important change is the boundary. Document text never leaves the approved environment. The prototype path can stay for the demo, but I wouldn’t put real matter data through it.";

export const dummyReply =
  "Then the external path is less of a confidentiality issue today — but I would still draw the production architecture as if matter data is coming, so you don’t have to unpick it later. I’ll keep the prototype API out of that design.";

export const unsureReply =
  "I’d treat it as matter data until someone senior says otherwise. That keeps InfoSec’s question from arriving as a surprise. I’ll design production around an approved internal model and keep the external provider in the prototype only.";

export const citationFinding =
  "There’s another problem I’d fix before pilot. The generated summary currently gives conclusions without showing where they came from. For legal work, I’d suggest making every material claim traceable to the source document.";

export const citationSuggestions: Suggestion[] = [
  { id: "add", label: "Yes. Add citations.", primary: true },
  { id: "skip", label: "Not for the first pilot." },
  { id: "explain", label: "Show me what you mean." },
];

export const addCitationsReply =
  "Good. Here’s a sketch of how the summary should behave — claims stay in the brief, evidence sits one click away.";

export const skipCitationsReply =
  "You can ship a pilot without them, but I wouldn’t. A single unsupported sentence in a client-ready brief is the sort of thing that ends a trial early. I’ll add citations as a proposed default; you can still drop them if the pilot owner disagrees.";

export const explainCitationsReply =
  "Legal readers need to see the jump from document to sentence. I’ll show a brief with inline evidence so you can decide if the interaction is light enough.";

export const uxFinding =
  "The prototype is visually polished, but I think there’s an untested assumption underneath it. It assumes lawyers want to upload individual documents. They may actually think in terms of matters or document sets. I wouldn’t redesign that yet. I’d validate it first.";

export const uxSuggestions: Suggestion[] = [
  { id: "validate", label: "Validate it first.", primary: true },
  { id: "redesign", label: "Redesign around matters now." },
  { id: "why", label: "Why does this matter for the pilot?" },
];

export const validateReply =
  "This isn’t a research programme. It’s the smallest check that would tell us whether the upload model survives contact with real lawyers.";

export const validationSuggestions: Suggestion[] = [
  { id: "continue", label: "Show me the pilot material.", primary: true },
  { id: "remaining", label: "What still needs a person?" },
];

export const redesignReply =
  "I wouldn’t. We’d be guessing about how lawyers group work. A three-person test will tell us whether the upload model is wrong — that’s cheaper than a redesign based on my hunch.";

export const whyUxReply =
  "If they think in matters, the prototype trains a habit that production will have to undo. Better to learn that on three lawyers than on a pilot cohort.";

export const readinessReply =
  "You’re in much better shape for a pilot now. I’ve drafted the pack Risk, InfoSec and the pilot owner will actually need. None of this is an approval — it’s the material they use to make their own.";

export const readinessSuggestions: Suggestion[] = [
  { id: "pack", label: "Prepare pilot pack.", primary: true },
  { id: "remaining", label: "What still needs a person?" },
  { id: "risks", label: "Walk me through the risks." },
];

export const packReply =
  "Here is a draft pack. Treat it as a starting note for people, not a decision. Risk, InfoSec and legal still have to say yes — or no.";

export const remainingReply =
  "Three things still need a person: InfoSec to accept the internal-model path, Risk to own the data-use note, and someone in the practice to run the three-lawyer test. I can draft; I can’t sign.";

export const risksReply =
  "The live ones are confidentiality (text leaving the firm), unsupported claims in a client-ready document, and an untested upload model. The first two have proposed mitigations. The third needs three lawyers, not another diagram.";

export const steerInspecting =
  "I’ll take that in. Let me finish this first pass on how data leaves the firm — that’s the piece that usually stops these cold.";

export const steerGeneric =
  "Noted. I’ll keep going with the decision in front of us, and fold that in where it changes the design.";

export const tooEarlyPack =
  "I can, but two decisions will make the pack honest: where the model runs, and whether claims are cited. Let’s finish those first.";
