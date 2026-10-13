import { useMemo } from "react";
import { ArrowRight, PartyPopper, Sparkles, Star } from "lucide-react";
import { activities } from "../data/activities";
import { getAvatar } from "../data/avatars";
import { subjectTheme } from "../data/subjects";
import type { LearnerProfile, ProgressState } from "../types/progress";
import { Pip } from "./mascot/Pip";

type HomeProps = {
  profile: LearnerProfile;
  progress: ProgressState;
  onOpenActivity: (activityId: string) => void;
};

export function Home({ profile, progress, onOpenActivity }: HomeProps) {
  const avatar = getAvatar(profile.avatarId);

  const doneCount = useMemo(
    () => activities.filter((a) => progress.byActivity[a.id]?.mastered).length,
    [progress],
  );
  const starCount = useMemo(
    () =>
      Object.values(progress.byActivity).filter((entry) => entry.mastered).length,
    [progress],
  );

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
            <p className="hero-sub">Pick a maths quest and earn your stars.</p>
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

      <section aria-live="polite">
        <div className="section-head">
          <h2 className="t-title-sm">Quests</h2>
          <span className="t-meta">
            {activities.length} {activities.length === 1 ? "quest" : "quests"}
          </span>
        </div>

        {activities.length === 0 ? (
          <div className="card empty-card">
            <Pip size={72} mood="think" />
            <p className="t-title-sm" style={{ marginTop: 8 }}>
              Nothing here yet
            </p>
            <p className="t-body">New maths quests will show up here.</p>
          </div>
        ) : (
          <ul className="activity-list">
            {activities.map((activity) => {
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
