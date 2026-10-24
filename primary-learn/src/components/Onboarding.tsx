import { useState, type CSSProperties, type FormEvent } from "react";
import { ArrowRight, ShieldCheck } from "lucide-react";
import { BuddyChoices } from "./BuddyChoices";
import { copy } from "../data/copy";
import type { LearnerAvatarId, LearnerProfile } from "../types/progress";
import { Pip } from "./mascot/Pip";
import { welcomeWallpaper } from "./mascot/MathsWallpaper";

type OnboardingProps = {
  onComplete: (profile: LearnerProfile) => void;
};

export function Onboarding({ onComplete }: OnboardingProps) {
  const [name, setName] = useState("");
  const [avatarId, setAvatarId] = useState<LearnerAvatarId>("fox");
  const [error, setError] = useState<string | null>(null);

  function handleSubmit(event: FormEvent) {
    event.preventDefault();
    const trimmed = name.trim();
    if (trimmed.length < 2) {
      setError(copy.nameTooShort);
      return;
    }
    if (trimmed.length > 20) {
      setError(copy.nameTooLong);
      return;
    }

    const now = new Date().toISOString();
    onComplete({
      name: trimmed,
      avatarId,
      preferredYearGroup: null,
      createdAt: now,
      updatedAt: now,
    });
  }

  return (
    <main className="onboard-page">
      <div
        className="onboard-doodles"
        style={{ "--onboard-wallpaper": welcomeWallpaper() } as CSSProperties}
        aria-hidden
      />
      <section className="onboard-hero" aria-label={copy.setupTitle}>
        <div className="onboard-pip">
          <Pip size={220} mood="cheer" followPointer />
        </div>
        <p className="sidekick-bubble onboard-hello">{copy.pipHello}</p>
        <h1 className="t-display onboard-title">{copy.setupTitle}</h1>
      </section>

      <section className="card onboard-panel">
        <form className="onboard-form" onSubmit={handleSubmit}>
          <label className="field">
            <span className="t-title-sm">{copy.firstName}</span>
            <input
              value={name}
              onChange={(event) => {
                setName(event.target.value);
                setError(null);
              }}
              autoComplete="nickname"
              maxLength={20}
              placeholder="e.g. Ava"
              aria-label={copy.firstName}
            />
          </label>

          <BuddyChoices avatarId={avatarId} onChange={setAvatarId} />

          {error ? (
            <p className="feedback is-wrong" role="alert">
              <span className="feedback-title">{copy.checkYourName}</span>
              <span className="t-body" style={{ color: "var(--ink)" }}>
                {error}
              </span>
            </p>
          ) : null}

          <button type="submit" className="btn btn-primary btn-block">
            {copy.letsGo} <ArrowRight size={19} aria-hidden />
          </button>
          <p className="onboard-privacy">
            <ShieldCheck size={15} aria-hidden /> {copy.staysOnDevice}
          </p>
        </form>
      </section>
    </main>
  );
}
