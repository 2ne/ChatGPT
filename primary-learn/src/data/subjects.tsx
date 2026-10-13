import { Calculator, type LucideIcon } from "lucide-react";
import type { Subject } from "../types/curriculum";

export type SubjectTheme = {
  color: string;
  soft: string;
  icon: LucideIcon;
};

export const SUBJECT_THEMES: Record<Subject, SubjectTheme> = {
  maths: { color: "#f97316", soft: "#ffead7", icon: Calculator },
};

export function subjectTheme(subject: Subject): SubjectTheme {
  return SUBJECT_THEMES[subject];
}
