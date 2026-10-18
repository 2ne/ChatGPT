import type { ComponentType } from "react";
import type { Question, QuestionKind } from "../../types/activity";
import { copy } from "../../data/copy";
import { BuildSet } from "./BuildSet";
import { CountObjects } from "./CountObjects";
import { FillBlank } from "./FillBlank";
import { MakeTotal } from "./MakeTotal";
import { MatchPairs } from "./MatchPairs";
import { PartWhole } from "./PartWhole";
import { PickPair } from "./PickPair";
import { MultiSelect } from "./MultiSelect";
import { MultipleChoice } from "./MultipleChoice";
import { Ordered } from "./Ordered";
import type { Reveal } from "./choice";

type QuestionViewProps = {
  question: Question;
  answer: unknown;
  disabled?: boolean;
  reveal?: Reveal;
  onChange: (value: unknown) => void;
};

type KindView = ComponentType<{
  question: never;
  answer: unknown;
  disabled?: boolean;
  reveal: Reveal;
  onChange: (value: unknown) => void;
}>;

/**
 * Kind → component. Adding a question type means: schema + this map + scoring.
 * Content files never import these.
 */
export const QUESTION_VIEWS: Record<QuestionKind, KindView> = {
  "count-objects": CountObjects as KindView,
  "build-set": BuildSet as KindView,
  "multiple-choice": MultipleChoice as KindView,
  "multi-select": MultiSelect as KindView,
  "fill-blank": FillBlank as KindView,
  ordered: Ordered as KindView,
  "match-pairs": MatchPairs as KindView,
  "make-total": MakeTotal as KindView,
  "pick-pair": PickPair as KindView,
  "part-whole": PartWhole as KindView,
};

export function QuestionView({
  question,
  answer,
  disabled,
  reveal = null,
  onChange,
}: QuestionViewProps) {
  const View = QUESTION_VIEWS[question.kind];
  if (!View) {
    return <p className="t-body">{copy.emptyActivity}</p>;
  }
  return (
    <View
      key={question.id}
      question={question as never}
      answer={answer}
      disabled={disabled}
      reveal={reveal}
      onChange={onChange}
    />
  );
}
