import { useState } from "react";
import { copy } from "../../data/copy";
import { makeTotalPart } from "../../lib/makeTotal";
import type { Question } from "../../types/activity";
import { ObjectGroup } from "./ObjectGroup";

/** Optional teaching after scoring. Never changes the submitted answer. */
export function BondDemonstration({ question }: { question: Question }) {
  const [step, setStep] = useState(0);
  const bond = question.kind === "part-whole"
    ? { a: question.parts[0], b: question.parts[1], total: question.whole }
    : question.kind === "make-total" && (question.operation ?? "add") === "add"
      ? { a: makeTotalPart(question), b: question.total - makeTotalPart(question), total: question.total }
      : null;
  if (!bond) return null;
  const { a, b, total } = bond;
  const item = question.visual?.item ?? "star";

  return (
    <div className="bond-demo">
      {step === 0 ? (
        <button type="button" className="btn btn-secondary" onClick={() => setStep(1)}>
          {copy.showMe}
        </button>
      ) : (
        <>
          <div className="bond-demo-parts">
            <div>
              <p>{copy.firstPart(a)}</p>
              {a > 0 ? <ObjectGroup visual={{ item, count: a }} /> : <p>{copy.zeroPart}</p>}
            </div>
            {step >= 2 ? (
              <div>
                <p>{copy.secondPart(b)}</p>
                {b > 0 ? <ObjectGroup visual={{ item, count: b }} /> : <p>{copy.zeroPart}</p>}
              </div>
            ) : null}
          </div>
          <p className="bond-demo-status" role="status" aria-live="polite" aria-atomic="true">
            {step === 3 ? copy.bondTogether(a, b, total) : step === 2 ? copy.secondPart(b) : copy.firstPart(a)}
          </p>
          {step < 3 ? (
            <button type="button" className="btn btn-secondary" onClick={() => setStep(step + 1)}>
              {step === 1 ? copy.showNextPart : copy.showWhole}
            </button>
          ) : (
            <>
              <ObjectGroup visual={{ item, count: total }} />
              <button type="button" className="btn btn-secondary" onClick={() => setStep(1)}>{copy.showMe}</button>
            </>
          )}
        </>
      )}
    </div>
  );
}
