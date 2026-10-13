# Primary Path — agent instructions

This project is an interactive UK primary e-learning app for children. Progress and profile data live in **browser localStorage only** (no auth, no backend).

When asked to add or change a learning activity, follow this document strictly. Do not invent a parallel activity format.

**UI:** Follow `DESIGN.md` for spacing, type, colour and activity layout (Khan Academy / Wonder Blocks–inspired). Do not invent a second visual system.

**Curriculum:** Follow `curriculum/` (England EYFS + National Curriculum pathways). Prefer the earliest missing building block in `curriculum/coverage.md` over skipping ahead. Tag `curriculumRef` / `skills` to nodes in those files.

## Goals

- Cover the UK primary curriculum over time (Reception → Year 6).
- Prefer **interactive, mastery-oriented** practice over one-shot quizzes.
- Keep the UI kid-friendly, accessible, and touch-first.
- Track marks per activity and overall subject progress in localStorage.

## Stack and layout

```text
primary-learn/
├── AGENTS.md                 ← you are here
├── README.md
├── src/
│   ├── types/                ← shared contracts (do not break lightly)
│   ├── data/activities/      ← one file per activity + registry
│   ├── storage/              ← localStorage profile + progress
│   ├── components/           ← UI (onboarding, home, runner)
│   └── lib/                  ← mastery / scoring helpers
└── ...
```

- Prefer React, TypeScript and Tailwind already used here.
- Do not add auth, accounts, or remote APIs for learner data.
- Keep changes inside `primary-learn/` unless the deploy workflow needs updating.

## Activity creation checklist (required)

Every new activity **must**:

1. Live in `src/data/activities/<kebab-id>.ts` as a typed `Activity` export.
2. Be registered in `src/data/activities/index.ts` (alphabetical by `id` is fine).
3. Declare **all** metadata below — no optional gaps for the core fields.
4. Include enough questions for a meaningful practice set (minimum **8**, prefer 10–16).
5. Use only question types defined in `src/types/activity.ts`.
6. Target a clear UK year group (and ability band) — not “all ages”.
7. Encourage mastery: clear feedback, retry of missed items, and a `masteryThreshold`.
8. Use British English spelling and UK curriculum wording (e.g. *maths*, *phonics*, *Year 2*).

Do **not** embed one-off activity UIs in `App.tsx`. New content is data + the shared runner.

## Required activity metadata

| Field | Rules |
| --- | --- |
| `id` | Stable kebab-case string, unique across the registry. Never reuse an id. |
| `title` | Child-facing, short (e.g. “Number bonds to 10”). |
| `summary` | One sentence for parents/teachers on the home screen. |
| `subject` | One of the `Subject` union values. |
| `type` | One of the `ActivityType` union values (extend the union if adding a new type). |
| `yearGroups` | Non-empty list of `YearGroup` values (`Reception` … `Year6`). |
| `ability` | `emerging` \| `expected` \| `greater-depth`. |
| `estimatedMinutes` | Realistic 3–15 minute range for a child. |
| `masteryThreshold` | Fraction `0–1`. Default **0.8** unless there is a strong reason. |
| `curriculumRef` | Short UK National Curriculum / EYFS reference string. |
| `skills` | 2–6 concrete skill tags (e.g. `addition-within-10`). |
| `questions` | Interactive items using allowed `Question` variants. |

### Year groups and ability

- Map ages roughly: Reception ~4–5, Year 1 ~5–6, … Year 6 ~10–11.
- Prefer a **single** year group. Use two adjacent years only when the same skill is taught across both (document why in `summary` or `curriculumRef`).
- `emerging` = supported / earlier in the sequence; `expected` = on track; `greater-depth` = stretch / deeper reasoning.
- Never label difficulty with vague words like “hard mode” instead of year + ability.

### Subjects and activity types

Use existing unions first. If you need a new subject or type:

1. Add it to `src/types/curriculum.ts` or `src/types/activity.ts`.
2. Update labels in `src/data/labels.ts`.
3. Mention the addition in the project README “Key decisions” if it is consequential.

Current activity-type examples (not exhaustive forever): `number-bonds`, `phonics`, `times-tables`, `spelling`, `reading-comprehension`, `fractions`, `place-value`, `grammar`, `science-concepts`, `reasoning`.

## Question design rules

- Prefer **doing** over reading walls of text. Keep stems short; use visuals/options kids can tap.
- One concept per question. Avoid trick questions and ambiguous distractors.
- Wrong answers should be plausible misconceptions for that year group.
- Always provide `explanation` (or `hint` + explanation) so the runner can teach after a miss.
- Mark exactly what is correct in the typed fields (`correctId`, `correctIds`, `answer`, etc.).
- Support mastery loops: the runner may re-ask missed questions until threshold or a calm exit — design stems that still make sense on retry.
- Avoid timers that punish slower readers unless the activity type is explicitly fluency-focused and labelled as such.
- Accessibility: do not rely on colour alone; keep tap targets large; include `ariaLabel` / alt text where images or emoji stand in for meaning.

### Allowed question kinds

Defined in `src/types/activity.ts`:

- `multiple-choice` — single correct option.
- `multi-select` — all correct options required.
- `fill-blank` — exact normalised answer (number or short word).
- `ordered` — put items in the right sequence.
- `match-pairs` — match left prompts to right targets.

If you need a new kind, extend the discriminated union **and** teach `QuestionView` / scoring how to render and mark it before shipping content that uses it.

## Progress and marks

- Profile + progress keys live in `src/storage/localStore.ts`. Do not change key names casually (breaks existing browser data).
- Record attempts with score, percentage, and mastery flag via the shared helpers.
- Mastery = latest qualifying attempt reaches `masteryThreshold` **or** running accuracy across recent attempts meets the same bar (see `src/lib/mastery.ts`).
- Never store personal data beyond the child’s chosen display name and avatar id.

## UI expectations when adding activities

- Home lists activities from the registry; filtering by subject / year is preferred over hard-coded sections.
- Empty, loading, error and success states must remain useful (especially empty progress and “not mastered yet”).
- Keep motion subtle and purposeful; do not add noisy celebration that blocks the next question.
- Match the existing visual language in `src/index.css` (brand tokens, fonts). Do not introduce a second theme.

## Definition of done for a new activity

1. `npm run build` succeeds (skip lint and tests — this repo ships straight to `main`).
2. Activity appears on the home screen with correct subject, year and ability labels.
3. Completing it updates local progress (marks / mastery) and survives a refresh.
4. Missed questions show teaching feedback and can be retried.
5. README activity count / examples updated if the catalogue meaningfully changes.
6. Commit and push to `main` (no PRs).

## Out of scope unless explicitly requested

- Login, cloud sync, teacher dashboards, payments.
- Generating the entire curriculum in one change — add activities in focused batches.
- Changing GitHub Pages base path without updating the deploy workflow.
