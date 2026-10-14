import { useMemo } from "react";
import { Flag, Star } from "lucide-react";
import { getAvatar } from "../data/avatars";
import { buildLevels } from "../lib/path";
import type { LearnerProfile, ProgressState } from "../types/progress";
import { PathMap } from "./PathMap";

type HomeProps = {
  profile: LearnerProfile;
  progress: ProgressState;
  onOpenActivity: (activityId: string) => void;
};

export function Home({ profile, progress, onOpenActivity }: HomeProps) {
  const avatar = getAvatar(profile.avatarId);
  const levels = useMemo(() => buildLevels(progress), [progress]);

  const starCount = levels.reduce((sum, level) => sum + level.stars, 0);
  const doneCount = levels.filter((level) => level.status === "done").length;

  return (
    <div className="page page-under-header">
      <section className="hero" aria-label={`Welcome back, ${profile.name}`}>
        <div className="hero-inner">
          <div className="hero-copy">
            <h1 className="hero-title">
              Hi, {profile.name}!{" "}
              <span aria-hidden>{avatar.emoji}</span>
            </h1>
            <p className="hero-sub">Follow the path and earn your stars.</p>
            <div className="hero-stats">
              <span className="hero-stat">
                <Star size={15} aria-hidden /> {starCount} of {levels.length * 3} stars
              </span>
              <span className="hero-stat">
                <Flag size={15} aria-hidden /> {doneCount} of {levels.length} levels done
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
      />
    </div>
  );
}
