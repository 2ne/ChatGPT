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
      const yearOk =
        yearFilter === "all" || activity.yearGroups.includes(yearFilter);
      return subjectOk && yearOk;
    });
  }, [subjectFilter, yearFilter]);

  const masteredCount = activities.filter((a) => progress.byActivity[a.id]?.mastered).length;
  const attemptedCount = activities.filter(
    (a) => (progress.byActivity[a.id]?.attempts.length ?? 0) > 0,
  ).length;

  return (
    <div className="mx-auto min-h-screen w-full max-w-5xl px-5 py-6 sm:py-10">
      <header className="rise-in mb-8 grid gap-6 rounded-[28px] border border-[var(--line)] bg-white/90 p-5 shadow-[var(--shadow)] sm:grid-cols-[1fr_auto] sm:items-center sm:p-7">
        <div className="flex items-center gap-4">
          <div
            className="grid h-20 w-20 shrink-0 place-items-center rounded-full text-4xl shadow-inner"
            style={{ background: `${avatar.accent}22` }}
            aria-hidden
          >
            {avatar.emoji}
          </div>
          <div>
            <p className="font-[family-name:var(--font-display)] text-sm font-semibold tracking-[0.16em] text-[var(--brand)] uppercase">
              Primary Path
            </p>
            <h1 className="text-3xl text-[var(--brand-deep)] sm:text-4xl">
              Hello, {profile.name}!
            </h1>
            <p className="mt-1 text-[var(--muted)]">
              {attemptedCount === 0
                ? "Pick an activity to begin. Marks are saved on this device."
                : `${masteredCount} mastered · ${attemptedCount} started`}
            </p>
          </div>
        </div>
        <button
          type="button"
          onClick={() => {
            if (
              window.confirm(
                "Reset your name, avatar and all marks on this device? This cannot be undone.",
              )
            ) {
              onReset();
            }
          }}
          className="justify-self-start rounded-full border border-[var(--line)] px-4 py-2 text-sm font-bold text-[var(--muted)] sm:justify-self-end"
        >
          Reset profile
        </button>
      </header>

      <section className="mb-6 grid gap-3 sm:grid-cols-2">
        <label className="grid gap-1">
          <span className="text-sm font-bold text-[var(--muted)]">Subject</span>
          <select
            value={subjectFilter}
            onChange={(event) => setSubjectFilter(event.target.value as Subject | "all")}
            className="min-h-12 rounded-2xl border-2 border-[var(--line)] bg-white px-3 font-semibold"
          >
            <option value="all">All subjects</option>
            {Object.entries(SUBJECT_LABELS).map(([value, label]) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </select>
        </label>
        <label className="grid gap-1">
          <span className="text-sm font-bold text-[var(--muted)]">Year group</span>
          <select
            value={yearFilter}
            onChange={(event) => setYearFilter(event.target.value as YearGroup | "all")}
            className="min-h-12 rounded-2xl border-2 border-[var(--line)] bg-white px-3 font-semibold"
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
        <div className="mb-4 flex items-end justify-between gap-3">
          <h2 className="text-2xl text-[var(--brand-deep)]">Learning activities</h2>
          <p className="text-sm font-semibold text-[var(--muted)]">
            {filtered.length} shown
          </p>
        </div>

        {filtered.length === 0 ? (
          <div className="rounded-[24px] border border-dashed border-[var(--line)] bg-white/70 px-6 py-12 text-center">
            <p className="mb-2 text-xl font-bold text-[var(--brand-deep)]">No activities here yet</p>
            <p className="text-[var(--muted)]">
              Try another subject or year, or ask an agent to add one using AGENTS.md.
            </p>
          </div>
        ) : (
          <ul className="grid gap-4">
            {filtered.map((activity, index) => {
              const activityProgress = progress.byActivity[activity.id];
              const status = masteryLabel(activityProgress, activity.masteryThreshold);
              return (
                <li
                  key={activity.id}
                  className="rise-in"
                  style={{ animationDelay: `${Math.min(index, 6) * 40}ms` }}
                >
                  <button
                    type="button"
                    onClick={() => onOpenActivity(activity.id)}
                    className="grid w-full gap-3 rounded-[24px] border border-[var(--line)] bg-white p-5 text-left shadow-sm transition hover:-translate-y-0.5 hover:border-[var(--brand)] hover:shadow-[var(--shadow)] sm:grid-cols-[1fr_auto] sm:items-center"
                  >
                    <div>
                      <p className="mb-1 text-xs font-bold tracking-wide text-[var(--sky-deep)] uppercase">
                        {SUBJECT_LABELS[activity.subject]} ·{" "}
                        {ACTIVITY_TYPE_LABELS[activity.type]}
                      </p>
                      <h3 className="text-xl text-[var(--brand-deep)] sm:text-2xl">
                        {activity.title}
                      </h3>
                      <p className="mt-1 text-[var(--muted)]">{activity.summary}</p>
                      <p className="mt-3 text-sm font-semibold text-[var(--muted)]">
                        {formatYearGroups(activity.yearGroups)} ·{" "}
                        {ABILITY_LABELS[activity.ability]} · {activity.estimatedMinutes} min
                      </p>
                    </div>
                    <div className="flex flex-col items-start gap-2 sm:items-end">
                      <span
                        className={`rounded-full px-3 py-1 text-sm font-extrabold ${
                          activityProgress?.mastered
                            ? "bg-[var(--brand-soft)] text-[var(--good)]"
                            : activityProgress
                              ? "bg-[var(--sun-soft)] text-[var(--warn)]"
                              : "bg-[var(--paper)] text-[var(--muted)]"
                        }`}
                      >
                        {status}
                        {activityProgress ? ` · ${activityProgress.bestPercent}%` : ""}
                      </span>
                      <span className="font-bold text-[var(--brand)]">Open →</span>
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
