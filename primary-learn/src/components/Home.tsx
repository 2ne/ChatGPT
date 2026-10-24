import { copy } from "../data/copy";
import { Sheet, SheetTitle } from "./Sheet";
import { YearChoices } from "./YearChoices";
import { YEAR_GROUP_LABELS } from "../data/labels";
import { YEAR_GROUPS, type YearGroup } from "../types/curriculum";
import { useMemo, useRef, useState } from "react";
import { Star, Trophy, ChevronDown, ChevronUp, X } from "lucide-react";
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
  const [expandedYear, setExpandedYear] = useState<YearGroup | null>(null);
  const pathStart = useRef<HTMLDivElement>(null);
  function chooseYear(year: YearGroup) {
    setExpandedYear(null);
    onYearChange(year);
    requestAnimationFrame(() => window.scrollTo({ top: 0, behavior: "instant" }));
  }
  const pendingYear = useRef<YearGroup | null>(null);
  const selectedYear = YEAR_GROUPS.find(year => year === profile.preferredYearGroup) ?? null;
  const selectedIndex = YEAR_GROUPS.indexOf(selectedYear ?? "Reception");
  const showEarlier = selectedYear !== null && expandedYear === selectedYear;
  const avatar = getAvatar(profile.avatarId);
  const allLevels = useMemo(() => buildLevels(progress), [progress]);
  const levels = useMemo(() => {
    const visible = showEarlier ? allLevels : allLevels.filter(level =>
      YEAR_GROUPS.findIndex(year => YEAR_GROUP_LABELS[year] === level.category.year) >= selectedIndex);
    const firstCategory = visible[0]?.categoryIndex ?? 0;
    return visible.map(level => ({ ...level, categoryIndex: level.categoryIndex - firstCategory }));
  }, [allLevels, selectedIndex, showEarlier]);

  const questNodes = allLevels.filter((level) => level.difficulties.some((entry) => entry.activity));
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

      <div ref={pathStart} className="path-year-start">
        {selectedIndex > 0 ? <button type="button" className="btn btn-secondary path-earlier-toggle" aria-expanded={showEarlier} aria-controls="learner-pathway" onClick={() => {
          setExpandedYear(showEarlier ? null : selectedYear);
          requestAnimationFrame(() => pathStart.current?.scrollIntoView({ block: "start", behavior: "instant" }));
        }}>
          {showEarlier ? <ChevronUp size={20} aria-hidden /> : <ChevronDown size={20} aria-hidden />}
          {showEarlier ? copy.hideEarlierYears : selectedYear === "Year1" ? copy.showReception : copy.showEarlierYears}
        </button> : null}
      </div>
      <div id="learner-pathway">
      <PathMap
        levels={levels}
        learnerEmoji={avatar.emoji}
        learnerName={profile.name}
        onPlay={onOpenActivity}
        preferredYear={selectedYear}
      />
      </div>
      <Sheet open={yearOpen} onClose={() => setYearOpen(false)} onAfterClose={() => { if (pendingYear.current) {chooseYear(pendingYear.current);pendingYear.current = null;} }}>
        <button className="sheet-close" type="button" aria-label="Close" onClick={() => setYearOpen(false)}><X size={20} aria-hidden /></button>
        <SheetTitle className="sheet-title">{copy.chooseYear}</SheetTitle>
        <YearChoices value={selectedYear ?? "Reception"} onSelect={year => { pendingYear.current = year; setYearOpen(false); }} />
      </Sheet>
    </div>
  );
}
