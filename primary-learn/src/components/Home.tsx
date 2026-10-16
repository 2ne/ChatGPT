import { useMemo } from "react";
import { Star, Trophy } from "lucide-react";
import { getAvatar } from "../data/avatars";
import { LEVELS_PER_NODE } from "../lib/mastery";
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
      />
    </div>
  );
}
