import { useState } from "react";
import { LogOut } from "lucide-react";
import { getActivity } from "./data/activities";
import { getAvatar } from "./data/avatars";
import { ActivityRunner } from "./components/ActivityRunner";
import { AppHeader } from "./components/AppHeader";
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
      <>
        <AppHeader />
        <main className="page page-narrow page-under-header">
          <p className="t-body" role="status">
            Loading…
          </p>
        </main>
      </>
    );
  }

  if (!profile) {
    return (
      <>
        <AppHeader />
        <Onboarding onComplete={completeOnboarding} />
      </>
    );
  }

  const avatar = getAvatar(profile.avatarId);
  const activity = activeActivityId ? getActivity(activeActivityId) : undefined;

  if (activeActivityId && !activity) {
    return (
      <>
        <AppHeader
          learnerName={profile.name}
          learnerEmoji={avatar.emoji}
          onHome={() => setActiveActivityId(null)}
        />
        <main className="page page-narrow page-under-header">
          <h1 className="t-title">Activity not found</h1>
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
      </>
    );
  }

  if (activity) {
    return (
      <>
        <AppHeader
          learnerName={profile.name}
          learnerEmoji={avatar.emoji}
          onHome={() => setActiveActivityId(null)}
          right={
            <button
              type="button"
              className="btn-exit"
              onClick={() => setActiveActivityId(null)}
            >
              <LogOut size={15} aria-hidden /> Exit
            </button>
          }
        />
        <ActivityRunner
          activity={activity}
          learnerName={profile.name}
          onExit={() => setActiveActivityId(null)}
          onComplete={recordAttempt}
        />
      </>
    );
  }

  return (
    <>
      <AppHeader
        learnerName={profile.name}
        learnerEmoji={avatar.emoji}
        onHome={() => setActiveActivityId(null)}
        right={
          <button
            type="button"
            className="btn-text"
            onClick={() => {
              if (
                window.confirm(
                  "Reset your name, avatar and all marks on this device? This cannot be undone.",
                )
              ) {
                resetAll();
              }
            }}
          >
            Reset
          </button>
        }
      />
      <Home profile={profile} progress={progress} onOpenActivity={setActiveActivityId} />
    </>
  );
}
