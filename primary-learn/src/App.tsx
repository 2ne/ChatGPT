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
      <main className="page page-narrow">
        <p className="t-body" role="status">
          Loading…
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
      <main className="page page-narrow">
        <h1 className="t-heading">Activity not found</h1>
        <p className="t-body" style={{ margin: "8px 0 16px" }}>
          That activity is missing from the catalogue.
        </p>
        <button
          type="button"
          onClick={() => setActiveActivityId(null)}
          className="btn btn-primary"
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
