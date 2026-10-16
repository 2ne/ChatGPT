import type { QuestionKind } from "../types/activity";

/**
 * Shared child-facing wording. Change a phrase here and every quest updates.
 * Do not put these strings in activity JSON.
 */
export const copy = {
  hearIt: "Hear the question",
  stopReadingAria: "Stop reading",
  needHint: "Need a hint?",
  checkIt: "Check it",
  nextQuestion: "Next question",
  seeMyStars: "See my stars",
  startQuest: "Start quest",
  allQuests: "All quests",
  backToQuests: "Back to quests",
  playAgain: "Play again",
  tryAgain: "Try again",
  exitQuest: "Exit quest",
  questComplete: "Quest complete",
  emptyActivity: "This activity has no questions yet.",
  yourAnswer: "Your answer",
  chooseAll: "Choose all that apply.",
  tapThenPartner: "Tap one, then tap its partner.",
  matchChoose: "Choose",
  matchPartners: "Partners",
  anotherGo: " · another go",
  retryNote: "Practising the tricky ones once more",
  questionsFact: (n: number) => `${n} questions`,
  minutesFact: (n: number) => `About ${n} min`,
  starsFact: "Earn up to 3 stars",
  progressLabel: "Quest progress",
  questionOf: (position: number, total: number) => `Question ${position} of ${total}`,
  streak: (n: number) => `${n} in a row!`,
  starsAria: (n: number) => `${n} out of 3 stars`,
  introCheer: (name: string) =>
    `You've got this, ${name}! Miss one and we'll practise it again.`,
  summaryTitle: (name: string, mastered: boolean) =>
    mastered ? `Amazing, ${name}!` : `Good effort, ${name}!`,
  summaryPerfect: "Every single one right first time. Superstar!",
  summaryMastered: "You stuck with the tricky ones until they clicked.",
  summaryAgain: "Every try makes your brain stronger. Have another go!",
  feedbackCorrect: "Correct. Nice!",
  feedbackWrong: "Not quite. Good try!",
  kindFallback: "Question",
  moveUp: (label: string) => `Move ${label} up`,
  moveDown: (label: string) => `Move ${label} down`,
  pickOne: "Choose one answer",
  setupTitle: "Set up your Primary Maths account",
  pipHello: "Hi, I'm Pip! Let's learn together.",
  firstName: "First name",
  chooseBuddy: "Choose your buddy",
  letsGo: "Let's go",
  staysOnDevice: "Stays on this device. Nothing is uploaded.",
  nameTooShort: "Type a name with 2 letters or more.",
  nameTooLong: "Keep your name to 20 letters.",
  checkYourName: "Check your name",
  activityMissing: "That quest is not here. Pick one from the path.",
  activityLocked: "That quest is not open yet. Keep going on the path.",
} as const;

export const KIND_LABELS: Record<QuestionKind, string> = {
  "count-objects": "How many?",
  "multiple-choice": "Pick one",
  "multi-select": "Pick them all",
  "fill-blank": "Type it in",
  ordered: "Put in order",
  "match-pairs": "Match them up",
};
