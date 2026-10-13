import { useState, type FormEvent } from "react";
import { ArrowRight, PartyPopper, ShieldCheck } from "lucide-react";
import { AVATARS } from "../data/avatars";
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
    <main className="page page-narrow page-under-header">
      <section className="card" style={{ display: "grid", gap: "var(--space-4)" }}>
        <div className="onboard-wrap">
          <span className="onboard-badge">
            <PartyPopper size={15} aria-hidden /> Your learning adventure starts here
          </span>
          <Pip size={104} mood="cheer" />
          <div style={{ display: "grid", gap: 6 }}>
            <h1 className="t-title">What’s your name?</h1>
            <p className="t-body">
              Pick a name and a buddy. Your stars stay on this device — no sign-in.
            </p>
          </div>
        </div>

        <form style={{ display: "grid", gap: "var(--space-4)" }} onSubmit={handleSubmit}>
          <label className="field">
            <span className="t-title-sm" style={{ fontSize: 17 }}>
              First name
            </span>
            <input
              value={name}
              onChange={(event) => {
                setName(event.target.value);
                setError(null);
              }}
              autoComplete="nickname"
              maxLength={20}
              placeholder="e.g. Ava"
              aria-label="First name"
            />
          </label>

          <fieldset style={{ border: 0, margin: 0, padding: 0 }}>
            <legend className="t-title-sm" style={{ fontSize: 17, marginBottom: 12 }}>
              Choose your buddy
            </legend>
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
                    <span className="t-meta" style={{ color: "var(--ink)", fontWeight: 800 }}>
                      {avatar.label}
                    </span>
                  </button>
                );
              })}
            </div>
          </fieldset>

          {error ? (
            <p className="feedback is-wrong" role="alert" style={{ margin: 0 }}>
              <span className="feedback-title">Check your name</span>
              <span className="t-body" style={{ color: "var(--ink)" }}>
                {error}
              </span>
            </p>
          ) : null}

          <button type="submit" className="btn btn-primary btn-block">
            Let’s go <ArrowRight size={19} aria-hidden />
          </button>
          <p
            className="t-meta"
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 6,
              textTransform: "none",
              letterSpacing: 0,
              fontSize: 13,
            }}
          >
            <ShieldCheck size={14} aria-hidden /> Stays on this device. Nothing is uploaded.
          </p>
        </form>
      </section>
    </main>
  );
}
