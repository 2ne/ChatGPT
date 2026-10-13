import { useMemo, useState } from "react";
import { activities } from "../data/activities";
import { getAvatar } from "../data/avatars";
import {
  ABILITY_LABELS,
  ACTIVITY_TYPE_LABELS,
  SUBJECT_LABELS,
  YEAR_GROUP_LABELS,
  formatYearGroups,
} from "../data/labels";
import { masteryLabel } from "../lib/mastery";
import type { Subject, YearGroup } from "../types/curriculum";
import type { LearnerProfile, ProgressState } from "../types/progress";
import { BrandMark } from "./BrandMark";

type HomeProps = {
  profile: LearnerProfile;
  progress: ProgressState;
  onOpenActivity: (activityId: string) => void;
  onReset: () => void;
};

export function Home({ profile, progress, onOpenActivity, onReset }: HomeProps) {
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

  const masteredCount = activities.filter((a) => progress.byActivity[a.id]?.mastered).length;

  return (
    <div className="page">
      <header
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: "var(--space-3)",
          marginBottom: "var(--space-5)",
        }}
      >
        <BrandMark />
        <button
          type="button"
          className="btn-text"
          onClick={() => {
            if (
              window.confirm(
                "Reset your name, avatar and all marks on this device? This cannot be undone.",
              )
            ) {
              onReset();
            }
          }}
        >
          Reset
        </button>
      </header>

      <section
        className="card"
        style={{
          display: "flex",
          alignItems: "center",
          gap: "var(--space-3)",
          marginBottom: "var(--space-5)",
        }}
      >
        <div
          aria-hidden
          style={{
            width: 48,
            height: 48,
            borderRadius: "9999px",
            background: "var(--off-black-8)",
            display: "grid",
            placeItems: "center",
            fontSize: 24,
            flex: "none",
          }}
        >
          {avatar.emoji}
        </div>
        <div>
          <h1 className="t-heading">Hi, {profile.name}</h1>
          <p className="t-meta" style={{ marginTop: 4 }}>
            {masteredCount === 0
              ? "Choose an activity to begin."
              : `${masteredCount} activit${masteredCount === 1 ? "y" : "ies"} mastered`}
          </p>
        </div>
      </section>

      <section className="filters">
        <label className="field">
          <span className="t-meta">Subject</span>
          <select
            className="select"
            value={subjectFilter}
            onChange={(event) => setSubjectFilter(event.target.value as Subject | "all")}
          >
            <option value="all">All subjects</option>
            {Object.entries(SUBJECT_LABELS).map(([value, label]) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </select>
        </label>
        <label className="field">
          <span className="t-meta">Year group</span>
          <select
            className="select"
            value={yearFilter}
            onChange={(event) => setYearFilter(event.target.value as YearGroup | "all")}
          >
            <option value="all">All years</option>
            {Object.entries(YEAR_GROUP_LABELS).map(([value, label]) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </select>
        </label>
      </section>

      <section aria-live="polite">
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "baseline",
            marginBottom: "var(--space-3)",
          }}
        >
          <h2 className="t-title-sm">Activities</h2>
          <p className="t-meta">{filtered.length} shown</p>
        </div>

        {filtered.length === 0 ? (
          <div className="card" style={{ textAlign: "center" }}>
            <p className="t-title-sm">No activities here yet</p>
            <p className="t-body" style={{ marginTop: "var(--space-2)" }}>
              Try another subject or year group.
            </p>
          </div>
        ) : (
          <ul style={{ listStyle: "none", margin: 0, padding: 0, display: "grid", gap: "var(--space-3)" }}>
            {filtered.map((activity) => {
              const activityProgress = progress.byActivity[activity.id];
              const status = masteryLabel(activityProgress, activity.masteryThreshold);
              const pillClass = activityProgress?.mastered
                ? "pill is-mastered"
                : activityProgress
                  ? "pill is-progress"
                  : "pill";

              return (
                <li key={activity.id}>
                  <button
                    type="button"
                    className="activity-row"
                    onClick={() => onOpenActivity(activity.id)}
                  >
                    <div>
                      <p className="t-meta" style={{ marginBottom: 4 }}>
                        {SUBJECT_LABELS[activity.subject]} ·{" "}
                        {ACTIVITY_TYPE_LABELS[activity.type]}
                      </p>
                      <h3 className="t-title-sm">{activity.title}</h3>
                      <p className="t-body" style={{ marginTop: 4 }}>
                        {activity.summary}
                      </p>
                      <p className="t-meta" style={{ marginTop: "var(--space-2)" }}>
                        {formatYearGroups(activity.yearGroups)} ·{" "}
                        {ABILITY_LABELS[activity.ability]} · {activity.estimatedMinutes} min
                      </p>
                    </div>
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "flex-start",
                        gap: "var(--space-2)",
                      }}
                    >
                      <span className={pillClass}>
                        {status}
                        {activityProgress ? ` · ${activityProgress.bestPercent}%` : ""}
                      </span>
                      <span className="t-label" style={{ color: "var(--blue)" }}>
                        Open →
                      </span>
                    </div>
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
