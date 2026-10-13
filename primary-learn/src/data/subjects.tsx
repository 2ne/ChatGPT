import {
  BookOpen,
  Calculator,
  Compass,
  Cpu,
  FlaskConical,
  HeartHandshake,
  History,
  Music,
  Palette,
  Trophy,
  type LucideIcon,
} from "lucide-react";
import type { Subject } from "../types/curriculum";

export type SubjectTheme = {
  color: string;
  soft: string;
  icon: LucideIcon;
};

export const SUBJECT_THEMES: Record<Subject, SubjectTheme> = {
  maths: { color: "#f97316", soft: "#ffead7", icon: Calculator },
  english: { color: "#0ea5e9", soft: "#dcf2fd", icon: BookOpen },
  science: { color: "#10b981", soft: "#d9f7e8", icon: FlaskConical },
  computing: { color: "#8b5cf6", soft: "#e9e2ff", icon: Cpu },
  history: { color: "#d97706", soft: "#fbeed3", icon: History },
  geography: { color: "#14b8a6", soft: "#d3f5ef", icon: Compass },
  art: { color: "#ec4899", soft: "#fbdff0", icon: Palette },
  music: { color: "#a855f7", soft: "#efe0ff", icon: Music },
  pe: { color: "#ef4444", soft: "#ffe0e0", icon: Trophy },
  pshe: { color: "#ca8a04", soft: "#fdf3c8", icon: HeartHandshake },
};

export function subjectTheme(subject: Subject): SubjectTheme {
  return SUBJECT_THEMES[subject];
}
