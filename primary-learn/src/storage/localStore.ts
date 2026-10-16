import type { LearnerProfile, ProgressState } from "../types/progress";
import { normalizeProgress } from "../lib/mastery";

const PROFILE_KEY = "primary-path:profile:v1";
const PROGRESS_KEY = "primary-path:progress:v1";

function canUseStorage(): boolean {
  try {
    return typeof window !== "undefined" && Boolean(window.localStorage);
  } catch {
    return false;
  }
}

function readJson<T>(key: string): T | null {
  if (!canUseStorage()) return null;
  try {
    const raw = window.localStorage.getItem(key);
    if (!raw) return null;
    return JSON.parse(raw) as T;
  } catch {
    return null;
  }
}

function writeJson(key: string, value: unknown): void {
  if (!canUseStorage()) return;
  window.localStorage.setItem(key, JSON.stringify(value));
}

export function loadProfile(): LearnerProfile | null {
  return readJson<LearnerProfile>(PROFILE_KEY);
}

export function saveProfile(profile: LearnerProfile): void {
  writeJson(PROFILE_KEY, profile);
}

export function clearProfile(): void {
  if (!canUseStorage()) return;
  window.localStorage.removeItem(PROFILE_KEY);
}

export function loadProgress(): ProgressState {
  return normalizeProgress(readJson<ProgressState>(PROGRESS_KEY));
}

export function saveProgress(progress: ProgressState): void {
  writeJson(PROGRESS_KEY, progress);
}

export function clearProgress(): void {
  if (!canUseStorage()) return;
  window.localStorage.removeItem(PROGRESS_KEY);
}
