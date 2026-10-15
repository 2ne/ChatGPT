import type { Suggestion } from "../types";

export const repoSummary =
  "Here’s what I’ve found in this repository. Matter Brief lets lawyers upload documents and generates a client-ready summary. It’s a Vite/React app. There’s no authentication, and src/api/summarise.ts sends the full document text to an external model API.";

export const firstFinding =
  "The code tells me summarise.ts posts the full document to an external model. It can’t tell me whether this is meant to see real client matter data.\n\nWill this see real client matter data in production?";

export const dataSuggestions: Suggestion[] = [
  {
    id: "approved",
    label: "Yes, but only within firm-approved infrastructure.",
    primary: true,
  },
  { id: "dummy", label: "Not yet — dummy data only." },
  { id: "unsure", label: "Not decided." },
];

export const approvedReply =
  "Understood. I’ll treat external model access as prototype-only and redesign the production architecture around an approved internal model.";

export const approvedFollowOn =
  "The important change is the boundary. Document text never leaves the approved environment. That also unlocks the questions that were waiting on it — who owns this, and what InfoSec and Risk will need.";

export const dummyReply =
  "Then the external path is less of a confidentiality issue today — but I would still draw production as if matter data is coming, so you don’t have to unpick it later. I’ll keep the prototype API out of that design.";

export const unsureReply =
  "I’ll record that as needing an owner rather than guessing. I’ll still design production around an approved internal model, so InfoSec’s question doesn’t arrive as a surprise.";

export const ownershipFinding =
  "The code tells me there’s no owner in this checkout — nothing in package.json, no CODEOWNERS. It can’t tell me who takes this after the hackathon.\n\nWho owns this after the hackathon?";

export const ownershipSuggestions: Suggestion[] = [
  { id: "practice", label: "The disputes practice.", primary: true },
  { id: "undecided", label: "Not decided." },
  { id: "innovation", label: "Keep it in Innovation." },
];

export const practiceOwnerReply =
  "Good. Disputes owns the users and the stop conditions. Innovation can still host the tooling.";

export const unknownOwnerReply =
  "That’s a real answer. I’ll leave a pilot owner as needs someone, and keep drafting as if a practice will take it.";

export const innovationOwnerReply =
  "I wouldn’t park a live pilot in Innovation alone — they can sponsor the tooling, but a practice has to own the users and what stops the trial. I’ll record Innovation as sponsor and still ask disputes to nominate a pilot owner.";

export const citationFinding =
  "The code tells me Brief.tsx renders a summary with no source pointers. It can’t tell me whether a lawyer would send that to a client.\n\nFor legal work, I’d make every material claim traceable. Do we add citations before a pilot?";

export const citationSuggestions: Suggestion[] = [
  { id: "add", label: "Yes. Add citations.", primary: true },
  { id: "skip", label: "Not for the first pilot." },
  { id: "undecided", label: "Not decided." },
];

export const addCitationsReply =
  "Good. Here’s a sketch of how the summary should behave — claims stay in the brief, evidence sits one click away.";

export const skipCitationsReply =
  "You can ship a pilot without them, but I wouldn’t. I’ll leave citations as a proposed default that still needs a pilot owner, and show the sketch so you can judge the weight of it.";

export const undecidedCitationsReply =
  "I’ll mark that as needing an owner rather than dropping it. Here’s the sketch I’d put in front of them — claims in the brief, evidence one click away.";

export const uxFinding =
  "The code tells me the flow is one file at a time. It can’t tell me whether lawyers actually work that way — and this one can’t be settled by talking. We’d need to watch lawyers use it.\n\nI wouldn’t redesign that yet. I’d validate it first.";

export const uxSuggestions: Suggestion[] = [
  { id: "validate", label: "Validate it first.", primary: true },
  { id: "redesign", label: "Redesign around matters now." },
  { id: "undecided", label: "Not decided." },
];

export const validateReply =
  "This isn’t a research programme. It’s the smallest check that would tell us whether the upload model survives contact with real lawyers.";

export const validationSuggestions: Suggestion[] = [
  { id: "continue", label: "Show me the pilot material.", primary: true },
  { id: "remaining", label: "What still needs a person?" },
];

export const redesignReply =
  "I wouldn’t. We’d be guessing about how lawyers group work. A three-person test will tell us whether the upload model is wrong — that’s cheaper than a redesign based on my hunch.";

export const undecidedUxReply =
  "I’ll leave it open. The test is still the smallest way to close it — three lawyers, not another conversation.";

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
  "The leftover questions are the ones a person has to own: InfoSec on the internal-model path, Risk on data-use, and someone in the practice to run the three-lawyer test. I can draft; I can’t sign.";

export const risksReply =
  "The live ones are confidentiality (text leaving the firm), unsupported claims in a client-ready document, and an untested upload model. The first two have proposed mitigations. The third needs three lawyers, not another conversation.";

export const steerInspecting =
  "I’ll take that in. Let me finish this first pass on how data leaves the firm — that’s the piece that usually stops these cold.";

export const steerGeneric =
  "Noted. I’ll keep going with the decision in front of us, and fold that in where it changes the design.";

export const tooEarlyPack =
  "I can, but the pack will be honest only once we’ve settled what the code can’t: data, ownership, and citations. Let’s finish those first.";
