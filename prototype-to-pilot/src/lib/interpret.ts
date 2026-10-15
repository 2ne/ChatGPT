import type { DecisionId } from "../data/decisions";
import type { Intent, Stage } from "../types";

function norm(input: string) {
  return input.trim().toLowerCase();
}

export function interpret(input: string, stage: Stage): Intent {
  const t = norm(input);

  if (/(start again|begin again|restart|reset|start over)/.test(t)) {
    return "reset";
  }

  if (stage === "data-leaving") {
    if (/(dummy|synthetic|not yet|test data|no matter|sandbox)/.test(t)) return "dummy";
    if (/(not sure|unsure|don'?t know|no idea|not decided)/.test(t)) return "unsure";
    if (/(yes|internal|approved|infra|firm|production|matter data|only within)/.test(t)) {
      return "approved";
    }
    return "approved";
  }

  if (stage === "ownership") {
    if (/(innovat|central|platform|keep it in|sponsor)/.test(t)) return "innovation-owner";
    if (/(not decided|don'?t know|unsure|no idea|not sure)/.test(t)) return "unknown-owner";
    if (/(dispute|practice|yes|we will|our team)/.test(t)) return "practice-owner";
    return "practice-owner";
  }

  if (stage === "citations") {
    if (/(not decided|don'?t know|unsure)/.test(t)) return "undecided-citations";
    if (/(not for|skip|later|without citation|no citation)/.test(t)) return "skip-citations";
    if (/(show me|what you mean|explain|example|how would)/.test(t)) return "explain-citations";
    if (/(yes|add|citation|source|trace|agree)/.test(t)) return "add-citations";
    return "add-citations";
  }

  if (stage === "ux-assumption") {
    if (/(not decided|don'?t know|unsure|leave it open)/.test(t)) return "undecided-ux";
    if (/(redesign|matters now|change (it|the ux|the flow)|rebuild)/.test(t)) return "redesign";
    if (/(why|matter for the pilot|does this matter)/.test(t)) return "why-ux";
    if (/(validate|test first|don'?t redesign|agreed|yes)/.test(t)) return "validate";
    return "validate";
  }

  if (stage === "validation") {
    if (/(what still|needs a person|human|owner)/.test(t)) return "ask-remaining";
    if (/(risk)/.test(t)) return "ask-risks";
    return "continue-readiness";
  }

  if (stage === "readiness") {
    if (/(back to|return to|drafts)/.test(t)) return "return-view";
    if (/(what still|needs a person|human|owner)/.test(t)) return "ask-remaining";
    if (/(risk)/.test(t)) return "ask-risks";
    if (/(pack|prepare|generate)/.test(t)) return "prepare-pack";
    if (/(ok|yes|continue|go on|next|show me)/.test(t)) return "prepare-pack";
  }

  if (stage === "pack") {
    if (/(back to|return to|the pack)/.test(t)) return "return-view";
    if (/(pack|prepare|again)/.test(t)) return "prepare-pack";
    if (/(risk)/.test(t)) return "ask-risks";
    if (/(person|human|owner)/.test(t)) return "ask-remaining";
  }

  return "steer";
}

export function interpretDecision(input: string, id: DecisionId): Intent {
  const t = norm(input);
  if (/(start again|begin again|restart|reset|start over)/.test(t)) return "reset";
  if (/(back to|return to)/.test(t)) return "return-view";

  if (id === "data") return interpret(input, "data-leaving");
  if (id === "ownership") return interpret(input, "ownership");
  if (id === "citations") return interpret(input, "citations");

  if (id === "infosec") {
    if (/(not decided|don'?t know|unsure)/.test(t)) return "infosec-undecided";
    if (/(queue|assign)/.test(t)) return "infosec-queue";
    return "infosec-named";
  }

  if (id === "risk") {
    if (/(not decided|don'?t know|unsure)/.test(t)) return "risk-undecided";
    if (/(queue|assign)/.test(t)) return "risk-queue";
    return "risk-named";
  }

  if (id === "ux") {
    if (/(not decided|don'?t know|unsure|leave it open)/.test(t)) return "undecided-ux";
    if (/(myself|i'?ll run|i will run)/.test(t)) return "ux-self";
    if (/(redesign)/.test(t)) return "redesign";
    if (/(alex|reed|disputes|run the|validate)/.test(t)) return "ux-runner";
    return "ux-runner";
  }

  return "steer";
}
