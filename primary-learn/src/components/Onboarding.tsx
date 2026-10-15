import { useState, type FormEvent } from "react";
import { ArrowRight, PartyPopper, ShieldCheck } from "lucide-react";
import { AVATARS } from "../data/avatars";
import { copy } from "../data/copy";
import type { LearnerAvatarId, LearnerProfile } from "../types/progress";
import { Pip } from "./mascot/Pip";

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
      setError("Please type your first name (at least 2 letters).");
      return;
    }
    if (trimmed.length > 20) {
      setError("Keep your name to 20 letters or fewer.");
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
      <section className="onboard-hero" aria-label={copy.setupTitle}>
        <span className="onboard-badge">
          <PartyPopper size={16} aria-hidden /> {copy.setupBadge}
        </span>
        <div className="onboard-pip">
          <Pip size={220} mood="cheer" followPointer />
        </div>
        <p className="sidekick-bubble onboard-hello">{copy.pipHello}</p>
        <h1 className="t-display onboard-title">{copy.setupTitle}</h1>
        <p className="t-body onboard-lead">{copy.setupSub}</p>
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

          <fieldset className="onboard-buddies">
            <legend className="t-title-sm">{copy.chooseBuddy}</legend>
            <div className="avatar-grid">
              {AVATARS.map((avatar) => {
                const selected = avatar.id === avatarId;
                return (
                  <button
                    key={avatar.id}
                    type="button"
                    onClick={() => setAvatarId(avatar.id)}
                    aria-pressed={selected}
                    className={`avatar-pick${selected ? " is-selected" : ""}`}
                  >
                    <span
                      className="avatar-face"
                      style={{ background: `${avatar.accent}26` }}
                      aria-hidden
                    >
                      {avatar.emoji}
                    </span>
                    <span className="t-meta avatar-label">{avatar.label}</span>
                  </button>
                );
              })}
            </div>
          </fieldset>

          {error ? (
            <p className="feedback is-wrong" role="alert">
              <span className="feedback-title">Check your name</span>
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
