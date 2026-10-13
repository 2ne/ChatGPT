import { useState, type FormEvent } from "react";
import { AVATARS } from "../data/avatars";
import type { LearnerAvatarId, LearnerProfile } from "../types/progress";

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
      <section className="panel" style={{ display: "grid", gap: "var(--space-5)" }}>
        <header style={{ display: "grid", gap: "var(--space-2)" }}>
          <h1 className="t-title-sm">What’s your name?</h1>
          <p className="t-body">
            Pick a name and an avatar. Your progress stays on this device — no sign-in.
          </p>
        </header>

        <form style={{ display: "grid", gap: "var(--space-5)" }} onSubmit={handleSubmit}>
          <label className="field">
            <span className="t-label">First name</span>
            <input
              value={name}
              onChange={(event) => {
                setName(event.target.value);
                setError(null);
              }}
              autoComplete="nickname"
              maxLength={20}
              placeholder="e.g. Ava"
            />
          </label>

          <fieldset style={{ border: 0, margin: 0, padding: 0 }}>
            <legend className="t-label" style={{ marginBottom: "var(--space-3)" }}>
              Choose an avatar
            </legend>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
                gap: "var(--space-3)",
              }}
            >
              {AVATARS.map((avatar) => {
                const selected = avatar.id === avatarId;
                return (
                  <button
                    key={avatar.id}
                    type="button"
                    onClick={() => setAvatarId(avatar.id)}
                    aria-pressed={selected}
                    className={`option${selected ? " is-selected" : ""}`}
                    style={{
                      flexDirection: "column",
                      justifyContent: "center",
                      gap: "var(--space-1)",
                      minHeight: 72,
                      padding: "var(--space-2)",
                    }}
                  >
                    <span style={{ fontSize: 28 }} aria-hidden>
                      {avatar.emoji}
                    </span>
                    <span className="t-meta" style={{ color: "var(--off-black)", fontWeight: 700 }}>
                      {avatar.label}
                    </span>
                  </button>
                );
              })}
            </div>
          </fieldset>

          {error ? (
            <p className="feedback is-wrong" role="alert" style={{ marginTop: 0 }}>
              <span className="feedback-title">Check your name</span>
              <span className="t-body" style={{ color: "var(--off-black)" }}>
                {error}
              </span>
            </p>
          ) : null}

          <button type="submit" className="btn btn-primary btn-block">
            Continue
          </button>
        </form>
      </section>
    </main>
  );
}
