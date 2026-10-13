import { useState } from "react";
import { getActivity } from "./data/activities";
import { ActivityRunner } from "./components/ActivityRunner";
import { Home } from "./components/Home";
import { Onboarding } from "./components/Onboarding";
import { useLearner } from "./hooks/useLearner";

export default function App() {
  const {
    ready,
    profile,
    progress,
    completeOnboarding,
    recordAttempt,
    resetAll,
  } = useLearner();
  const [activeActivityId, setActiveActivityId] = useState<string | null>(null);

  if (!ready) {
    return (
      <main className="grid min-h-screen place-items-center px-5">
        <p className="font-bold text-[var(--brand-deep)]" role="status">
          Loading Primary Path…
        </p>
      </main>
    );
  }

  if (!profile) {
    return <Onboarding onComplete={completeOnboarding} />;
  }

  const activity = activeActivityId ? getActivity(activeActivityId) : undefined;

  if (activeActivityId && !activity) {
    return (
      <main className="mx-auto grid min-h-screen max-w-lg content-center gap-4 px-5 text-center">
        <h1 className="text-3xl text-[var(--brand-deep)]">Activity not found</h1>
        <p className="text-[var(--muted)]">
          That activity is missing from the catalogue. It may have been renamed.
        </p>
        <button
          type="button"
          onClick={() => setActiveActivityId(null)}
          className="mx-auto min-h-12 rounded-2xl bg-[var(--brand)] px-5 font-bold text-white"
        >
          Back home
        </button>
      </main>
    );
  }

  if (activity) {
    return (
      <ActivityRunner
        activity={activity}
        learnerName={profile.name}
        onExit={() => setActiveActivityId(null)}
        onComplete={recordAttempt}
      />
    );
  }

  return (
    <Home
      profile={profile}
      progress={progress}
      onOpenActivity={setActiveActivityId}
      onReset={resetAll}
    />
  );
}
