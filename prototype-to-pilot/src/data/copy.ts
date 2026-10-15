import type { Suggestion } from "../types";

export const repoSummary =
  "Matter Brief: lawyers upload documents, get a client-ready summary. Vite/React, no auth. summarise.ts posts the full text to OpenAI.";

export const firstFinding =
  "That’s the first stop. Will this see real client matter data in production?";

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
  "I’ll pull it off OpenAI and put it on the internal model. SSO and an audit line come with that.";

export const dummyReply =
  "Dummy data today — I’ll still route production through the internal model so you don’t unpick this later.";

export const unsureReply =
  "I’ll mark that as needing an owner, and still move generation inside the approved boundary.";

export const ownershipFinding = "Nothing in the repo says who owns this after the hackathon. Who does?";

export const ownershipSuggestions: Suggestion[] = [
  { id: "practice", label: "The disputes practice.", primary: true },
  { id: "undecided", label: "Not decided." },
  { id: "innovation", label: "Keep it in Innovation." },
];

export const practiceOwnerReply = "Disputes. Next is the brief itself.";

export const unknownOwnerReply = "I’ll leave a pilot owner open and keep going.";

export const innovationOwnerReply =
  "Innovation can sponsor the tooling. A practice still has to own the users. I’ll record that and move on.";

export const citationFinding =
  "Brief.tsx prints a fluent summary with no sources. Add citations before a pilot?";

export const citationSuggestions: Suggestion[] = [
  { id: "add", label: "Yes. Add citations.", primary: true },
  { id: "skip", label: "Not for the first pilot." },
  { id: "undecided", label: "Not decided." },
];

export const addCitationsReply = "Doing it now — markers in the brief, passage one click away.";

export const skipCitationsReply = "I’ll leave it open. I still wouldn’t send that brief as-is.";

export const undecidedCitationsReply = "Needs an owner. I’ll keep going.";

export const lowConfidenceNote =
  "That £240k figure is thinner than it looks. I’ll flag low confidence rather than let it read finished.";

export const uxFinding =
  "Upload is one file at a time. I can’t tell if lawyers work that way — and I can’t code my way out of it. Validate with three lawyers first?";

export const uxSuggestions: Suggestion[] = [
  { id: "validate", label: "Validate it first.", primary: true },
  { id: "redesign", label: "Redesign around matters now." },
  { id: "undecided", label: "Not decided." },
];

export const validateReply =
  "I’ll drop a flag that records whether they pick documents or the whole matter. That’s the test, not a redesign.";

export const redesignReply =
  "I wouldn’t guess. A three-person test is cheaper than a redesign based on my hunch. I’ll still add the flag.";

export const undecidedUxReply = "I’ll leave the test open and still instrument source choice.";

export const whyUxReply =
  "If they think in matters, this trains a habit production will have to undo. Three lawyers, not another conversation.";

export const readinessReply =
  "pilot-ready is up. InfoSec and Risk still have to review — I can’t sign those.";

export const readinessSuggestions: Suggestion[] = [
  { id: "pack", label: "Prepare pilot pack.", primary: true },
  { id: "remaining", label: "What still needs a person?" },
];

export const packReply = "Drafts for people. The branch is the other half of the pack.";

export const remainingReply =
  "InfoSec on the internal-model path, Risk on data-use, and someone to run the three-lawyer test. I can draft; I can’t sign.";

export const risksReply =
  "Confidential text leaving the firm, unsupported claims, untested upload model. The first two are now in the prototype. The third needs three lawyers.";

export const steerInspecting = "Give me a moment — I’m still on how data leaves the firm.";

export const steerGeneric = "Noted. The useful move is still the decision in front of us.";

export const tooEarlyPack = "Not yet — let me finish the things the code can’t answer.";

export const infosecReopen =
  "I can’t close InfoSec. Someone has to own the review of the internal-model path. Who?";

export const infosecSuggestions: Suggestion[] = [
  { id: "priya", label: "Priya Chen, InfoSec.", primary: true },
  { id: "queue", label: "Put it on the InfoSec queue." },
  { id: "undecided", label: "Not decided." },
];

export const riskReopen = "Same for Risk. I can draft the data-use note; I can’t sign it. Who owns it?";

export const riskSuggestions: Suggestion[] = [
  { id: "james", label: "James Okonkwo, Risk.", primary: true },
  { id: "queue", label: "Put it on the Risk queue." },
  { id: "undecided", label: "Not decided." },
];

export const uxOwnerReopen = "Who runs the three-lawyer test?";

export const uxOwnerSuggestions: Suggestion[] = [
  { id: "alex", label: "Alex Reed in disputes.", primary: true },
  { id: "self", label: "I’ll run it myself." },
  { id: "undecided", label: "Not decided." },
];

export const recordedGeneric = "Recorded. Still not an approval.";

export const recordedInfosecNamed = "Priya owns the review. InfoSec still has to say yes or no.";

export const recordedInfosecQueue = "On the InfoSec queue. Still their decision.";

export const recordedRiskNamed = "James owns the data-use note. Risk still reviews it.";

export const recordedRiskQueue = "On the Risk queue. Still a human review.";

export const recordedUxRunner = "Alex will run the three-lawyer test. That’s an owner, not a result.";

export const recordedUxSelf = "You’re on the hook for the three-lawyer test.";

export const backToPackSuggestions: Suggestion[] = [
  { id: "back", label: "Back to the pack.", primary: true },
];

export const returnedToPack = "In front of you. Approvals remain human.";
