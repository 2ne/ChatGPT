import type { LearnerAvatarId } from "../types/progress";

export type AvatarOption = {
  id: LearnerAvatarId;
  label: string;
  emoji: string;
  accent: string;
};

export const AVATARS: AvatarOption[] = [
  { id: "fox", label: "Fox", emoji: "🦊", accent: "#e07a3d" },
  { id: "owl", label: "Owl", emoji: "🦉", accent: "#6b7c3d" },
  { id: "otter", label: "Otter", emoji: "🦦", accent: "#4a7c8c" },
  { id: "robin", label: "Robin", emoji: "🐦", accent: "#c45c4a" },
  { id: "hedgehog", label: "Hedgehog", emoji: "🦔", accent: "#8b6b4a" },
  { id: "badger", label: "Badger", emoji: "🦡", accent: "#5a6470" },
];

export function getAvatar(id: LearnerAvatarId): AvatarOption {
  return AVATARS.find((a) => a.id === id) ?? AVATARS[0];
}
