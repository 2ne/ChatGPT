import { activities } from "../data/activities";
import { formatYearGroups } from "../data/labels";
import { correctAnswerFor, correctAnswerLabel } from "../lib/answers";
import { DIFFICULTY_LABELS } from "../lib/path";
import type { Question } from "../types/activity";
import { QuestionView } from "./questions/QuestionView";

const TEACHER_NAME = "Teacher Review";

function activityAnchorId(activityId: string): string {
  return `qb-${activityId}`;
}

function jumpToActivity(activityId: string) {
  const node = document.getElementById(activityAnchorId(activityId));
  if (!node) return;
  node.scrollIntoView({ behavior: "smooth", block: "start" });
}

function QuestionBlock({ question, index }: { question: Question; index: number }) {
  const answer = correctAnswerFor(question);
  const keyLabel = correctAnswerLabel(question);

  return (
    <article className="qb-question card" aria-label={`Question ${index + 1}`}>
      <div className="qb-question-head">
        <span className="qb-q-num" aria-hidden>
          {index + 1}
        </span>
        <div className="qb-question-meta">
          <p className="t-meta">
            {question.kind} · {question.id}
          </p>
          <h3 className="qb-prompt">{question.prompt}</h3>
        </div>
      </div>

      <QuestionView
        question={question}
        answer={answer}
        disabled
        reveal="correct"
        onChange={() => {}}
      />

      <dl className="qb-key">
        {keyLabel ? (
          <div>
            <dt>Answer key</dt>
            <dd>{keyLabel}</dd>
          </div>
        ) : null}
        {question.hint ? (
          <div>
            <dt>Hint</dt>
            <dd>{question.hint}</dd>
          </div>
        ) : null}
        <div>
          <dt>Explanation</dt>
          <dd>{question.explanation}</dd>
        </div>
      </dl>
    </article>
  );
}

export function QuestionBank() {
  return (
    <div className="page page-under-header question-bank">
      <header className="qb-intro">
        <p className="t-meta">Teacher tool</p>
        <h1 className="hero-title">Question bank</h1>
        <p className="hero-sub">
          Every quest and every question. Answers are shown. Nothing is saved.
        </p>
        <p className="t-body qb-signed">Signed in as {TEACHER_NAME}</p>
      </header>

      <nav className="qb-nav" aria-label="Jump to activity">
        <p className="t-meta qb-nav-label">Jump to</p>
        <ul className="qb-nav-list">
          {activities.map((activity) => (
            <li key={activity.id}>
              <button
                type="button"
                className="qb-nav-btn"
                onClick={() => jumpToActivity(activity.id)}
              >
                {activity.title}
                <span className="qb-nav-level">{DIFFICULTY_LABELS[activity.difficulty]}</span>
              </button>
            </li>
          ))}
        </ul>
      </nav>

      <div className="qb-list">
        {activities.map((activity) => (
          <section
            key={activity.id}
            id={activityAnchorId(activity.id)}
            className="qb-activity"
            aria-labelledby={`${activityAnchorId(activity.id)}-title`}
          >
            <header className="qb-activity-head">
              <h2 id={`${activityAnchorId(activity.id)}-title`} className="t-title-sm">
                {activity.title}
              </h2>
              <p className="t-body">
                {DIFFICULTY_LABELS[activity.difficulty]} · {formatYearGroups(activity.yearGroups)} ·{" "}
                {activity.id}
              </p>
              <p className="t-body qb-summary">{activity.summary}</p>
            </header>

            <div className="qb-questions">
              {activity.questions.map((question, index) => (
                <QuestionBlock key={question.id} question={question} index={index} />
              ))}
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}
