import { useEffect, useMemo, useState } from "react";
import { ArrowRight, PartyPopper, RotateCcw, Sparkles, Star } from "lucide-react";
import { activities } from "../data/activities";
import { getAvatar } from "../data/avatars";
import { ACTIVITY_TYPE_LABELS, SUBJECT_LABELS, formatYearGroups } from "../data/labels";
import { subjectTheme } from "../data/subjects";
import type { Subject, YearGroup } from "../types/curriculum";
import type { LearnerProfile, ProgressState } from "../types/progress";
import { usePipMood } from "./PipMood";
import { Pip } from "./mascot/Pip";

type HomeProps = {
  profile: LearnerProfile;
  progress: ProgressState;
  onOpenActivity: (activityId: string) => void;
};

const SUBJECT_FILTERS: (Subject | "all")[] = [
  "all",
  "maths",
  "english",
  "science",
  "computing",
  "history",
  "geography",
  "art",
  "music",
  "pe",
  "pshe",
];

export function Home({ profile, progress, onOpenActivity }: HomeProps) {
  const avatar = getAvatar(profile.avatarId);
  const [subjectFilter, setSubjectFilter] = useState<Subject | "all">("all");
  const [yearFilter, setYearFilter] = useState<YearGroup | "all">("all");

  const filtered = useMemo(() => {
    return activities.filter((activity) => {
      const subjectOk = subjectFilter === "all" || activity.subject === subjectFilter;
      const yearOk = yearFilter === "all" || activity.yearGroups.includes(yearFilter);
      return subjectOk && yearOk;
    });
  }, [subjectFilter, yearFilter]);

  const doneCount = useMemo(
    () => activities.filter((a) => progress.byActivity[a.id]?.mastered).length,
    [progress],
  );
  const starCount = useMemo(
    () =>
      Object.values(progress.byActivity).filter((entry) => entry.mastered).length,
    [progress],
  );

  const { setMood } = usePipMood();

  useEffect(() => {
    if (filtered.length === 0) {
      setMood("think");
      return () => setMood("happy");
    }
    setMood("happy");
  }, [filtered.length, setMood]);

  return (
    <div className="page page-under-header">
      {/* Hero greeting */}
      <section className="hero" aria-label={`Welcome back, ${profile.name}`}>
        <div className="hero-inner">
          <div className="hero-copy">
            <span className="hero-kicker">
              <Sparkles size={14} aria-hidden /> Ready when you are
            </span>
            <h1 className="hero-title">
              Hi, {profile.name}!{" "}
              <span aria-hidden>{avatar.emoji}</span>
            </h1>
            <p className="hero-sub">Pick a quest below and earn your stars.</p>
            <div className="hero-stats">
              <span className="hero-stat">
                <Star size={15} aria-hidden /> {starCount} {starCount === 1 ? "star" : "stars"}
              </span>
              <span className="hero-stat">
                <PartyPopper size={15} aria-hidden /> {doneCount} of {activities.length} quests done
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Subject chips */}
      <div className="filter-bar" role="group" aria-label="Filter by subject">
        {SUBJECT_FILTERS.map((subject) => {
          const isOn = subjectFilter === subject;
          const dot =
            subject === "all" ? (
              <span className="chip-dot" style={{ background: "var(--sun)" }} />
            ) : (
              <span
                className="chip-dot"
                style={{ background: subjectTheme(subject).color }}
              />
            );
          return (
            <button
              key={subject}
              type="button"
              className={`chip${isOn ? " is-on" : ""}`}
              aria-pressed={isOn}
              onClick={() => setSubjectFilter(subject)}
            >
              {dot}
              {subject === "all" ? "Everything" : SUBJECT_LABELS[subject]}
            </button>
          );
        })}
      </div>

      {/* Year chips */}
      <div className="filter-bar" role="group" aria-label="Filter by year group">
        {(["all", "Reception", "Year1", "Year2", "Year3", "Year4", "Year5", "Year6"] as const).map(
          (year) => (
            <button
              key={year}
              type="button"
              className={`chip${yearFilter === year ? " is-on" : ""}`}
              aria-pressed={yearFilter === year}
              onClick={() => setYearFilter(year)}
            >
              {year === "all" ? "All years" : yearLabel(year)}
            </button>
          ),
        )}
      </div>

      <section aria-live="polite">
        <div className="section-head">
          <h2 className="t-title-sm">
            {subjectFilter === "all" ? "All quests" : `${SUBJECT_LABELS[subjectFilter]} quests`}
          </h2>
          <span className="t-meta">
            {filtered.length} {filtered.length === 1 ? "quest" : "quests"}
          </span>
        </div>

        {filtered.length === 0 ? (
          <div className="card empty-card">
            <Pip size={72} mood="think" />
            <p className="t-title-sm" style={{ marginTop: 8 }}>
              Nothing here yet
            </p>
            <p className="t-body">Try a different subject or year group.</p>
            <button
              type="button"
              className="btn btn-secondary"
              onClick={() => {
                setSubjectFilter("all");
                setYearFilter("all");
              }}
            >
              <RotateCcw size={17} aria-hidden /> Show everything
            </button>
          </div>
        ) : (
          <ul className="activity-list">
            {filtered.map((activity) => {
              const theme = subjectTheme(activity.subject);
              const Icon = theme.icon;
              const record = progress.byActivity[activity.id];
              const best = record
                ? Math.round((record.bestPercent / 100) * activity.questions.length)
                : 0;
              const status = record?.mastered ? (
                <span className="status-pill is-done">
                  <Star size={13} aria-hidden /> Done!
                </span>
              ) : record ? (
                <span className="status-pill">
                  Best {best} of {activity.questions.length}
                </span>
              ) : (
                <span className="status-pill is-todo">New quest</span>
              );

              return (
                <li key={activity.id}>
                  <button
                    type="button"
                    className="activity-card"
                    onClick={() => onOpenActivity(activity.id)}
                    aria-label={`Start ${activity.title}`}
                  >
                    <span
                      className="activity-tile"
                      style={{ background: `linear-gradient(135deg, ${theme.color}, ${theme.color}CC)` }}
                      aria-hidden
                    >
                      <Icon />
                    </span>
                    <span className="activity-main">
                      <span className="activity-pills">
                        <span
                          className="mini-pill"
                          style={{ background: theme.soft, color: theme.color }}
                        >
                          {SUBJECT_LABELS[activity.subject]}
                        </span>
                        <span className="mini-pill" style={{ background: "var(--paper-deep)", color: "var(--ink-soft)" }}>
                          {ACTIVITY_TYPE_LABELS[activity.type]} · {formatYearGroups(activity.yearGroups)}
                        </span>
                      </span>
                      <span className="activity-title">{activity.title}</span>
                      <span className="activity-desc">{activity.summary}</span>
                      {record ? (
                        <span className="mini-progress" aria-hidden>
                          <span style={{ width: `${Math.min(100, record.bestPercent)}%` }} />
                        </span>
                      ) : null}
                    </span>
                    <span className="activity-side">
                      {status}
                      <span className="go-btn">
                        Play <ArrowRight size={16} aria-hidden />
                      </span>
                    </span>
                  </button>
                </li>
              );
            })}
          </ul>
        )}
      </section>
    </div>
  );
}

function yearLabel(year: YearGroup): string {
  if (year === "Reception") return "Reception";
  return year.replace("Year", "Year ");
}
