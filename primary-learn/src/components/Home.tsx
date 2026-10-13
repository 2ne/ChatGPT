import { useEffect, useMemo, useState } from "react";
import { activities } from "../data/activities";
import { getAvatar } from "../data/avatars";
import { ACTIVITY_TYPE_LABELS, SUBJECT_LABELS, YEAR_GROUP_LABELS, formatYearGroups } from "../data/labels";
import type { Subject, YearGroup } from "../types/curriculum";
import type { LearnerProfile, ProgressState } from "../types/progress";
import { usePipMood } from "./PipMood";
import { Pip } from "./mascot/Pip";

type HomeProps = {
  profile: LearnerProfile;
  progress: ProgressState;
  onOpenActivity: (activityId: string) => void;
};

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
            background: "var(--blue-soft)",
            display: "grid",
            placeItems: "center",
            fontSize: 24,
            flex: "none",
          }}
        >
          {avatar.emoji}
        </div>
        <div>
          <h1 className="t-title-sm">Hi, {profile.name}</h1>
          <p className="t-body" style={{ marginTop: 4 }}>
            Pick something to practise.
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
        <h2 className="t-title-sm" style={{ marginBottom: "var(--space-3)" }}>
          Activities
        </h2>

        {filtered.length === 0 ? (
          <div className="card" style={{ textAlign: "center" }}>
            <Pip size={48} mood="think" />
            <p className="t-title-sm" style={{ marginTop: "var(--space-3)" }}>
              No activities here yet
            </p>
            <p className="t-body" style={{ marginTop: "var(--space-2)" }}>
              Try another subject or year group.
            </p>
          </div>
        ) : (
          <ul style={{ listStyle: "none", margin: 0, padding: 0, display: "grid", gap: "var(--space-3)" }}>
            {filtered.map((activity) => {
              const activityProgress = progress.byActivity[activity.id];
              const bestCorrect = activityProgress
                ? Math.round((activityProgress.bestPercent / 100) * activity.questions.length)
                : 0;
              const status = activityProgress?.mastered
                ? "Done"
                : activityProgress
                  ? `Best ${bestCorrect} of ${activity.questions.length}`
                  : null;

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
                        {ACTIVITY_TYPE_LABELS[activity.type]} ·{" "}
                        {formatYearGroups(activity.yearGroups)}
                      </p>
                      <h3 className="t-title-sm">{activity.title}</h3>
                      <p className="t-body" style={{ marginTop: 4 }}>
                        {activity.summary}
                      </p>
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: "var(--space-2)" }}>
                      {status ? (
                        <span
                          className={
                            activityProgress?.mastered ? "pill is-mastered" : "pill is-progress"
                          }
                        >
                          {status}
                        </span>
                      ) : null}
                      <span className="t-body" style={{ color: "var(--blue)", fontWeight: 700 }}>
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
