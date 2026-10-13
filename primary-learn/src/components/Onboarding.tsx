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
    <main className="mx-auto flex min-h-screen w-full max-w-3xl flex-col justify-center px-5 py-10">
      <section className="rise-in relative overflow-hidden rounded-[28px] border border-[var(--line)] bg-[var(--surface)] shadow-[var(--shadow)]">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_85%_15%,rgba(240,200,74,0.35),transparent_40%),linear-gradient(135deg,rgba(26,122,92,0.12),transparent_45%)]"
        />
        <div className="relative grid gap-8 p-6 sm:p-10">
          <header className="grid gap-3">
            <p className="font-[family-name:var(--font-display)] text-sm font-semibold tracking-[0.18em] text-[var(--brand)] uppercase">
              Primary Path
            </p>
            <h1 className="max-w-xl text-4xl text-[var(--brand-deep)] sm:text-5xl">
              Let’s get you ready to learn
            </h1>
            <p className="max-w-lg text-[var(--muted)]">
              Tell us your name and pick a woodland friend. Your progress stays on this
              device — no sign-in needed.
            </p>
          </header>

          <div className="floaty mx-auto grid h-28 w-28 place-items-center rounded-full bg-[var(--brand-soft)] text-5xl shadow-inner sm:h-32 sm:w-32 sm:text-6xl">
            {AVATARS.find((a) => a.id === avatarId)?.emoji}
          </div>

          <form className="grid gap-7" onSubmit={handleSubmit}>
            <label className="grid gap-2">
              <span className="font-bold text-[var(--brand-deep)]">What is your name?</span>
              <input
                value={name}
                onChange={(event) => {
                  setName(event.target.value);
                  setError(null);
                }}
                autoComplete="nickname"
                maxLength={20}
                placeholder="e.g. Ava"
                className="min-h-14 rounded-2xl border-2 border-[var(--line)] bg-[var(--paper)] px-4 text-xl font-semibold outline-none transition focus:border-[var(--brand)]"
              />
            </label>

            <fieldset className="grid gap-3">
              <legend className="font-bold text-[var(--brand-deep)]">Choose your avatar</legend>
              <div className="grid grid-cols-3 gap-3 sm:grid-cols-6">
                {AVATARS.map((avatar) => {
                  const selected = avatar.id === avatarId;
                  return (
                    <button
                      key={avatar.id}
                      type="button"
                      onClick={() => setAvatarId(avatar.id)}
                      aria-pressed={selected}
                      className={`pop-in grid min-h-24 place-items-center gap-1 rounded-2xl border-2 px-2 py-3 transition ${
                        selected
                          ? "border-[var(--brand)] bg-[var(--brand-soft)] shadow-md"
                          : "border-[var(--line)] bg-[var(--paper)] hover:border-[var(--sky)]"
                      }`}
                    >
                      <span className="text-3xl" aria-hidden>
                        {avatar.emoji}
                      </span>
                      <span className="text-sm font-bold">{avatar.label}</span>
                    </button>
                  );
                })}
              </div>
            </fieldset>

            {error ? (
              <p role="alert" className="rounded-xl bg-[#fde8e5] px-4 py-3 text-[var(--bad)]">
                {error}
              </p>
            ) : null}

            <button
              type="submit"
              className="min-h-14 rounded-2xl bg-[var(--brand)] px-6 text-lg font-extrabold text-white shadow-md transition hover:bg-[var(--brand-deep)]"
            >
              Start learning
            </button>
          </form>
        </div>
      </section>
    </main>
  );
}
