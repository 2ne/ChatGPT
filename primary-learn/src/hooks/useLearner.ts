import { useCallback, useState } from "react";
import type { Activity } from "../types/activity";
import type {
  ActivityAttempt,
  LearnerProfile,
  ProgressState,
} from "../types/progress";
import { mergeAttempt } from "../lib/mastery";
import {
  loadProfile,
  loadProgress,
  saveProfile,
  saveProgress,
  clearProfile,
  clearProgress,
} from "../storage/localStore";

export function useLearner() {
  const [profile, setProfile] = useState<LearnerProfile | null>(() => loadProfile());
  const [progress, setProgress] = useState<ProgressState>(() => loadProgress());

  const completeOnboarding = useCallback((next: LearnerProfile) => {
    saveProfile(next);
    setProfile(next);
  }, []);

  const updateProfile = useCallback((patch: Partial<LearnerProfile>) => {
    setProfile((current) => {
      if (!current) return current;
      const next = {
        ...current,
        ...patch,
        updatedAt: new Date().toISOString(),
      };
      saveProfile(next);
      return next;
    });
  }, []);

  const recordAttempt = useCallback((attempt: ActivityAttempt) => {
    setProgress((current) => {
      const existing = current.byActivity[attempt.activityId];
      const next: ProgressState = {
        byActivity: {
          ...current.byActivity,
          [attempt.activityId]: mergeAttempt(existing, attempt),
        },
      };
      saveProgress(next);
      return next;
    });
  }, []);

  const resetAll = useCallback(() => {
    clearProfile();
    clearProgress();
    setProfile(null);
    setProgress({ byActivity: {} });
  }, []);

  const progressFor = useCallback(
    (activity: Activity) => progress.byActivity[activity.id],
    [progress],
  );

  return {
    ready: true,
    profile,
    progress,
    completeOnboarding,
    updateProfile,
    recordAttempt,
    resetAll,
    progressFor,
  };
}
