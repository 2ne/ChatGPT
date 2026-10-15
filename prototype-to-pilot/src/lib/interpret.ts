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
    if (/(not sure|unsure|don'?t know|no idea)/.test(t)) return "unsure";
    if (/(yes|internal|approved|infra|firm|production|matter data|only within)/.test(t)) {
      return "approved";
    }
    return "approved";
  }

  if (stage === "citations") {
    if (/(not for|skip|later|without citation|no citation)/.test(t)) return "skip-citations";
    if (/(show me|what you mean|explain|example|how would)/.test(t)) return "explain-citations";
    if (/(yes|add|citation|source|trace|agree)/.test(t)) return "add-citations";
    return "add-citations";
  }

  if (stage === "ux-assumption") {
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
    if (/(what still|needs a person|human|owner)/.test(t)) return "ask-remaining";
    if (/(risk)/.test(t)) return "ask-risks";
    if (/(pack|prepare|generate)/.test(t)) return "prepare-pack";
    if (/(ok|yes|continue|go on|next|show me)/.test(t)) return "prepare-pack";
  }

  if (stage === "pack") {
    if (/(pack|prepare|again)/.test(t)) return "prepare-pack";
    if (/(risk)/.test(t)) return "ask-risks";
    if (/(person|human|owner)/.test(t)) return "ask-remaining";
  }

  return "steer";
}
