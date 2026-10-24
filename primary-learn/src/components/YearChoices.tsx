import { copy } from "../data/copy";
import { Check } from "lucide-react";
import { YEAR_GROUPS, type YearGroup } from "../types/curriculum";
import { YEAR_GROUP_LABELS } from "../data/labels";
export function YearChoices({ value, onSelect }: { value: string | null; onSelect: (year: YearGroup) => void }) {
  return <div className="year-choices" role="group" aria-label={copy.yearGroup}>
    {YEAR_GROUPS.map(year => <button key={year} type="button" className={`year-choice${value === year ? " is-selected" : ""}`} aria-pressed={value === year} onClick={() => onSelect(year)}>{YEAR_GROUP_LABELS[year]}{value === year && <Check size={18} aria-hidden />}</button>)}
  </div>;
}
