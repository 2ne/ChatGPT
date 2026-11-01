export type LearnerAvatarId =
  | "fox"
  | "owl"
  | "otter"
  | "robin"
  | "hedgehog"
  | "badger"
  | "squirrel"
  | "rabbit"
  | "mouse"
  | "deer"
  | "frog"
  | "duck";

export type LearnerProfile = {
  name: string;
  avatarId: LearnerAvatarId;
  /** Legacy profile field retained for storage compatibility. Not used by the pathway. */
  preferredYearGroup: string | null;
  createdAt: string;
  updatedAt: string;
};

export type ActivityAttempt = {
  activityId: string;
  startedAt: string;
  finishedAt: string;
  correctCount: number;
  totalCount: number;
  percent: number;
  stars: number;
  mastered: boolean;
  missedQuestionIds: string[];
  /** Denominations to revisit. Stars still describe the whole attempt. */
  moneyPractice?: import("./activity").MoneyAsset[];
};

export type ActivityProgress = {
  activityId: string;
  attempts: ActivityAttempt[];
  bestPercent: number;
  bestCorrectCount: number;
  bestTotalCount: number;
  bestStars: number;
  /** Usually one star. Money attempts additionally require no flagged denominations. */
  mastered: boolean;
  lastAttemptAt: string | null;
};

export type ProgressState = {
  byActivity: Record<string, ActivityProgress>;
};
