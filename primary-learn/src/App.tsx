import type { ReactNode } from "react";
import { Navigate, Route, Routes, useLocation, useNavigate, useParams } from "react-router-dom";
import { getActivity } from "./data/activities";
import { copy } from "./data/copy";
import { getAvatar } from "./data/avatars";
import { ActivityRunner } from "./components/ActivityRunner";
import { AppHeader } from "./components/AppHeader";
import { Home } from "./components/Home";
import { Onboarding } from "./components/Onboarding";
import { QuestionBank } from "./components/QuestionBank";
import { ScrollToTop } from "./components/ScrollToTop";
import { useLearner } from "./hooks/useLearner";
import { useSafariThemeColor } from "./hooks/useSafariThemeColor";
import { nextPlayableActivity } from "./lib/path";
import type { ActivityAttempt, LearnerProfile, ProgressState } from "./types/progress";

const TEACHER_REVIEW_NAME = "Teacher Review";

export default function App() {
  useSafariThemeColor();
  const learner = useLearner();

  if (!learner.ready) {
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

  return (
    <>
      <ScrollToTop />
      <Routes>
        <Route
          path="/onboarding"
          element={<OnboardingRoute profile={learner.profile} onComplete={learner.completeOnboarding} />}
        />
        <Route
          path="/pathway"
          element={
            <RequireProfile profile={learner.profile}>
              <PathwayRoute
                profile={learner.profile!}
                progress={learner.progress}
                resetAll={learner.resetAll}
              />
            </RequireProfile>
          }
        />
        <Route
          path="/activity/:id"
          element={
            <RequireProfile profile={learner.profile}>
              <ActivityRoute
                profile={learner.profile!}
                onComplete={learner.recordAttempt}
              />
            </RequireProfile>
          }
        />
        <Route
          path="/question-bank"
          element={<QuestionBankRoute hasProfile={Boolean(learner.profile)} />}
        />
        <Route
          path="/"
          element={<Navigate to={learner.profile ? "/pathway" : "/onboarding"} replace />}
        />
        <Route path="*" element={<Navigate to={learner.profile ? "/pathway" : "/onboarding"} replace />} />
      </Routes>
    </>
  );
}

function RequireProfile({
  profile,
  children,
}: {
  profile: LearnerProfile | null;
  children: ReactNode;
}) {
  if (!profile) return <Navigate to="/onboarding" replace />;
  return children;
}

function OnboardingRoute({
  profile,
  onComplete,
}: {
  profile: LearnerProfile | null;
  onComplete: (next: LearnerProfile) => void;
}) {
  const navigate = useNavigate();
  if (profile) return <Navigate to="/pathway" replace />;

  function handleComplete(next: LearnerProfile) {
    onComplete(next);
    navigate("/pathway");
  }

  return <Onboarding onComplete={handleComplete} />;
}

function PathwayRoute({
  profile,
  progress,
  resetAll,
}: {
  profile: LearnerProfile;
  progress: ProgressState;
  resetAll: () => void;
}) {
  const navigate = useNavigate();
  const location = useLocation();
  const avatar = getAvatar(profile.avatarId);
  const notice = (location.state as { notice?: string } | null)?.notice;
  const noticeText = notice === "missing" ? copy.activityMissing : null;

  return (
    <>
      <AppHeader
        learnerName={profile.name}
        learnerEmoji={avatar.emoji}
        onHome={() => navigate("/pathway")}
        onReset={() => {
          resetAll();
          navigate("/onboarding");
        }}
      />
      {noticeText ? (
        <p className="route-notice" role="status">
          {noticeText}
        </p>
      ) : null}
      <Home
        profile={profile}
        progress={progress}
        onOpenActivity={(activityId) => navigate(`/activity/${activityId}`)}
      />
    </>
  );
}

function QuestionBankRoute({ hasProfile }: { hasProfile: boolean }) {
  const navigate = useNavigate();

  return (
    <>
      <AppHeader
        learnerName={TEACHER_REVIEW_NAME}
        onHome={() => navigate(hasProfile ? "/pathway" : "/onboarding")}
      />
      <QuestionBank />
    </>
  );
}

function ActivityRoute({
  profile,
  onComplete,
}: {
  profile: LearnerProfile;
  onComplete: (attempt: ActivityAttempt) => void;
}) {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const activity = id ? getActivity(id) : undefined;

  if (!activity) {
    return <Navigate to="/pathway" replace state={{ notice: "missing" }} />;
  }

  const next = nextPlayableActivity(activity.id);

  return (
    <ActivityRunner
      key={activity.id}
      activity={activity}
      learnerName={profile.name}
      onExit={() => navigate("/pathway")}
      onNext={() => navigate(next ? `/activity/${next.id}` : "/pathway")}
      nextLabel={next ? copy.nextQuest : copy.backToQuests}
      onComplete={onComplete}
    />
  );
}
