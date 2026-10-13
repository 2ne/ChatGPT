export type LearnerAvatarId =
  | "fox"
  | "owl"
  | "otter"
  | "robin"
  | "hedgehog"
  | "badger";

export type LearnerProfile = {
  name: string;
  avatarId: LearnerAvatarId;
  /** Preferred year filter on the home screen; null means show a mixed catalogue. */
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
  mastered: boolean;
  missedQuestionIds: string[];
};

export type ActivityProgress = {
  activityId: string;
  attempts: ActivityAttempt[];
  bestPercent: number;
  mastered: boolean;
  lastAttemptAt: string | null;
};

export type ProgressState = {
  byActivity: Record<string, ActivityProgress>;
};
