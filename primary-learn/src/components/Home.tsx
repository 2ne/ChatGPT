import { copy } from "../data/copy";
import { Sheet, SheetTitle } from "./Sheet";
import { YearChoices } from "./YearChoices";
import { YEAR_GROUP_LABELS } from "../data/labels";
import type { YearGroup } from "../types/curriculum";
import { useMemo, useRef, useState } from "react";
import { Star, Trophy, ChevronDown, X } from "lucide-react";
import { getAvatar } from "../data/avatars";
import { LEVELS_PER_NODE } from "../lib/mastery";
import { buildLevels } from "../lib/path";
import type { LearnerProfile, ProgressState } from "../types/progress";
import { PathMap } from "./PathMap";

type HomeProps = {
  profile: LearnerProfile;
  progress: ProgressState;
  onYearChange: (year: YearGroup) => void;
  onOpenActivity: (activityId: string) => void;
};

export function Home({ profile, progress, onOpenActivity, onYearChange }: HomeProps) {
  const [yearOpen, setYearOpen] = useState(false);
  const [yearVisit, setYearVisit] = useState(0);
  function chooseYear(year: YearGroup) { onYearChange(year); setYearVisit(value => value + 1); }
  const pendingYear = useRef<YearGroup | null>(null);
  const selectedYear = profile.preferredYearGroup as YearGroup | null;
  const avatar = getAvatar(profile.avatarId);
  const levels = useMemo(() => buildLevels(progress), [progress]);

  const questNodes = levels.filter((level) => level.difficulties.some((entry) => entry.activity));
  const starCount = questNodes.reduce((sum, level) => sum + level.cleared, 0);
  const starMax = questNodes.length * LEVELS_PER_NODE;
  const cupCount = questNodes.filter((level) => level.cup).length;

  return (
    <div className="page page-under-header">
      <section className="hero" aria-label={`Welcome back, ${profile.name}`}>
        <div className="hero-inner">
          <div className="hero-copy">
            <h1 className="hero-title">
              Hi, {profile.name}!{" "}
              <span aria-hidden>{avatar.emoji}</span>
            </h1>
            <button type="button" className="hero-year" aria-haspopup="dialog" aria-expanded={yearOpen} onClick={() => setYearOpen(true)}>{YEAR_GROUP_LABELS[selectedYear ?? "Reception"] ?? "Reception"}<ChevronDown size={18} aria-hidden /></button>
            <p className="hero-sub">Follow the path and earn your stars.</p>
            <div className="hero-stats">
              <span className="hero-stat">
                <Star size={15} aria-hidden /> {starCount} of {starMax} stars
              </span>
              <span className="hero-stat">
                <Trophy size={15} aria-hidden /> {cupCount} gold {cupCount === 1 ? "cup" : "cups"}
              </span>
            </div>
          </div>
        </div>
      </section>

      <PathMap
        levels={levels}
        learnerEmoji={avatar.emoji}
        learnerName={profile.name}
        onPlay={onOpenActivity}
        preferredYear={selectedYear}
        yearVisit={yearVisit}
      />
      <Sheet open={yearOpen} onClose={() => setYearOpen(false)} onAfterClose={() => { if (pendingYear.current) {chooseYear(pendingYear.current);pendingYear.current = null;} }}>
        <button className="sheet-close" type="button" aria-label="Close" onClick={() => setYearOpen(false)}><X size={20} aria-hidden /></button>
        <SheetTitle className="sheet-title">{copy.chooseYear}</SheetTitle>
        <YearChoices value={selectedYear ?? "Reception"} onSelect={year => { pendingYear.current = year; setYearOpen(false); }} />
      </Sheet>
    </div>
  );
}
