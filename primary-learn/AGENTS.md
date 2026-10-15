# Primary Maths — agent instructions

This project is a rapid prototype of an interactive UK primary learning app for children. The product title is **Primary Maths**. Progress and profile data live in **browser localStorage only** (no auth, no backend). That is intentional during prototyping — reset is a button, not a migration.

When asked to add or change a learning activity, follow this document and `QUALITY.md` strictly. Do not invent a parallel activity format.

**Build once.** Each activity must be right first time. The owner will not rewrite your questions. If the ramp, wording, distractors, narration or checklist would fail, do not push.

**UI:** Follow `DESIGN.md`. Do not invent a second visual system.

**Curriculum (current phase):** The only map is `curriculum/maths.md` (England EYFS mathematics + National Curriculum mathematics, Reception → Year 6). It is one locked path: 45 categories, 124 nodes. Node 1 (`eyfs-count-5`) is the start. Before adding a quest, follow `curriculum/audit.md`. Do not rename ids or invent a second set of categories.

## Rapid prototype

Agents work directly on `main`. This is a fast vibe / prototype repo.

- **Push straight to `main`.** Do not open pull requests. Do not use long-lived feature branches.
- **No tests. No linting required.** Do not add test suites or lint steps. Do not run lint or tests unless asked.
- **`npm run build` is the check.** Run it in `primary-learn/` after changes. If it fails, fix it before or immediately after pushing.
- Keep learner data in localStorage. Do not add auth, accounts, or remote APIs for learner data.
- Keep changes inside `primary-learn/` unless the deploy workflow needs updating.

## Vision

Long term this is a **start-to-finish pathway covering every UK curriculum subject**. Maths is where we started and is the **current phase**, not a permanent product rule. Do not add English, science, or foundation subjects until asked.

**Three levels per activity is a core concept.** Every path node has Easy / Medium / Hard. Mastering all three means the child can do that skill. The map shows up to three stars per node (one per mastered level).

**Priority now:** nail the foundations and **improve existing activities** (especially missing Medium and Hard levels) **before expanding** to new nodes or subjects.

## How a quest appears on the map

Home is the path map (`PathMap` + `LevelSheet`), not a free-choice list. `buildLevels()` in `src/lib/path.ts` places quests by:

```text
`${activity.pathNode}:${activity.difficulty}`
```

An agent that only sets `curriculumRef` will **not** put the quest on the map.

| Field | What the code does with it |
| --- | --- |
| `pathNode` | Node id from `curriculum/maths.md`. This is the map key. |
| `difficulty` | `1` Easy, `2` Medium, `3` Hard. At most one quest per node per difficulty. |
| `curriculumRef` | Same node id, for curriculum audit / coverage. The map does **not** read this field. |

Also register the activity in `src/data/activities/index.ts`. Then:

- The node appears as a numbered stop on the road.
- Opening it shows Easy / Medium / Hard rows in `LevelSheet`.
- Your quest sits on the row that matches `difficulty`.

### Locks (actual `buildLevels` behaviour)

- A node with **no Easy quest** is `soon` (coming soon).
- The first node whose Easy exists but is not mastered is `current`.
- Later nodes with an Easy quest stay `locked` until the **previous node's Easy** is mastered.
- On an open node (`current` or `done`): Easy is playable; Medium needs Easy mastered; Hard needs Medium mastered.
- Node status `done` means Easy is mastered. Medium and Hard can still be unplayed. Stars = how many of the three difficulties are mastered.

Shipped examples: `count-to-5` is `pathNode: "eyfs-count-5"`, `difficulty: 1`. `number-bonds-to-10` is `pathNode: "y1-bonds-10"`, `difficulty: 1`. Neither node has Medium or Hard yet.

## Goals

- Build the maths pathway first (Reception → Year 6). Treat other subjects as later phases.
- Prefer **interactive, mastery-oriented** practice over one-shot quizzes.
- Keep the UI kid-friendly, accessible, and touch-first.
- Track marks per activity in localStorage.

## Stack and layout

```text
primary-learn/
├── AGENTS.md                 ← you are here
├── QUALITY.md                ← required quality guide + gold-standard item
├── README.md
├── DESIGN.md
├── curriculum/               ← maths.md path, audit, coverage
├── src/
│   ├── types/activity.ts     ← Activity + question schema (TS)
│   ├── data/activities/      ← JSON quests + registry + JSON Schema
│   ├── data/copy.ts          ← shared child-facing phrases (change once)
│   ├── data/objects.ts       ← object-item names (pictures live in UI)
│   ├── components/ActivityRunner.tsx
│   ├── components/questions/ ← one component per question kind
│   └── lib/validateActivity.ts
└── ...
```

- Prefer React, TypeScript and Tailwind already used here.

## Content and UI stay separate

Educational content is **pure data**. Presentation is **one generic runner** plus **one component per question kind**. If 124 quests exist and a phrase or a picture style needs changing, we change it once in the UI/copy layer — not in every JSON file.

| Layer | Lives in | May contain | Must not contain |
| --- | --- | --- | --- |
| Content | `src/data/activities/<id>.json` | Metadata, prompts, answers, hints, narration, `visual` assets (`{ item, count }`) | JSX, CSS, React, scoring, shared phrases like “Correct — nice!” |
| Shared wording | `src/data/copy.ts` | Instructions, feedback titles, buttons, kind labels | Per-quest stems |
| UI | `ActivityRunner` + `components/questions/*` | Layout, objects pictures, Hear it, marking | Quest-specific copy or one-off screens |

Do not put emoji strings in JSON. Use `"visual": { "item": "apple", "count": 3 }`. The `ObjectGroup` component draws the picture. To change how apples look, edit that component once.

## How to add an activity (data only)

1. Copy `src/data/activities/count-to-5.json` (gold standard) to `src/data/activities/<kebab-id>.json`.
2. Fill metadata + `questions`. Set `questionCount` to `questions.length` (the loader checks they match).
3. Import the JSON in `src/data/activities/index.ts` and pass it through `validateActivity(...)`. Invalid JSON fails the build.
4. Do **not** create a `.tsx` for the quest. Do **not** edit `ActivityRunner` unless you are changing all quests.

Every new activity **must**:

1. Be that JSON file + registry line. No JSX.
2. Declare **all** metadata below — no optional gaps for the core fields.
3. Set `pathNode` + `difficulty` so it appears on the correct map stop and Easy / Medium / Hard row.
4. Include enough questions for a meaningful practice set (minimum **8**, prefer 10–16).
5. Use only question kinds in `QUESTION_KINDS` (`src/types/activity.ts`).
6. Target a clear UK year group (and ability band) — not “all ages”.
7. Write `difficultyRamp` first, then a gradual Easy→Hard climb inside the quest (see below).
8. Encourage mastery: per-question `explanation`, retry of missed items, and a `masteryThreshold`.
9. Write `narration` wherever the voice would mangle the stem (`+`, `−`, pictures).
10. Use British English spelling and UK maths wording (e.g. *maths*, *number bonds*, *Year 2*).
11. Run the self-review checklist in `QUALITY.md` before you push.

## How to add a question type

Content never embeds a new UI. Adding a kind is a schema + component change:

1. Add the kind to `QUESTION_KINDS` and the discriminated union in `src/types/activity.ts`.
2. Teach `src/lib/answers.ts` (`isAnswerCorrect`, `emptyAnswerFor`, `hasProvidedAnswer`).
3. Teach `src/lib/narration.ts` if it has extra spoken parts.
4. Add a component in `src/components/questions/<Kind>.tsx` (data in, answers out — no quest-specific copy).
5. Register it in `QUESTION_VIEWS` in `src/components/questions/QuestionView.tsx`.
6. Add a kind label in `src/data/copy.ts` (`KIND_LABELS`).
7. Extend `src/lib/validateActivity.ts` (and `activity.schema.json` if the top-level shape changes).
8. Mention it in `QUALITY.md` stem templates if agents will write that kind.

Until those steps are done, `validateActivity` will reject JSON that uses the new kind.

**What to write next:** prefer Medium / Hard for a node that already has Easy (`eyfs-count-5` first) over a brand-new node. When expanding the path, take the first `missing` node in `curriculum/maths.md` (`eyfs-subitise-5`) and start with Easy.

## Required activity metadata

| Field | Rules |
| --- | --- |
| `id` | Stable kebab-case string, unique across the registry. Never reuse an id. |
| `title` | Child-facing, short (e.g. “Number bonds to 10”). The level sheet labels the row Easy / Medium / Hard from `difficulty`, not from this title. |
| `summary` | One sentence for parents/teachers. |
| `subject` | `maths` in the current phase. |
| `type` | One of the `ActivityType` union values (extend the union if adding a new type). |
| `yearGroups` | Non-empty list of `YearGroup` values (`Reception` … `Year6`). |
| `ability` | `emerging` \| `expected` \| `greater-depth`. Pedagogical band; typically Easy → emerging, Medium → expected, Hard → greater-depth. |
| `estimatedMinutes` | Realistic 3–15 minute range for a child. |
| `masteryThreshold` | Fraction `0–1`. Default **0.8** unless there is a strong reason. |
| `curriculumRef` | The node id from `curriculum/maths.md` (for example `eyfs-count-5`). Same id as `pathNode`. |
| `pathNode` | **Required for the map.** Same node id. `buildLevels` looks this up. |
| `difficulty` | **Required for the map.** `1` Easy, `2` Medium, `3` Hard. |
| `questionCount` | Must equal `questions.length`. |
| `difficultyRamp` | **Required.** `{ within, versus }` — how this quest climbs, and how Easy < Medium < Hard on this node. |
| `skills` | 2–6 concrete skill tags (e.g. `addition-within-10`). |
| `questions` | Interactive items using allowed `Question` variants. Pictures are `visual: { item, count }`, not emoji. |

### Year groups, ability, and Easy / Medium / Hard

- Map ages roughly: Reception ~4–5, Year 1 ~5–6, … Year 6 ~10–11.
- Prefer a **single** year group. Use two adjacent years only when the same skill is taught across both (document why in `summary`).
- `ability` is metadata. `difficulty` is the playable level on the map. Kids see Easy / Medium / Hard, not ability bands.
- Easy must exist before Medium or Hard can be played on that node. Write Easy first for a new node.

## Difficulty progression (required)

Easy must be clearly easier than Medium, and Medium clearly easier than Hard. Mastering all three means the child can do the skill.

Write `difficultyRamp` **before** the questions:

```json
"difficultyRamp": {
  "within": "How questions 1…N climb. Name the steps. No spikes.",
  "versus": "How Easy / Medium / Hard differ on this node. Describe levels you have not written yet."
}
```

Use these dimensions. Change one or two at a time, never all at once:

| Dimension | Easy | Medium | Hard |
| --- | --- | --- | --- |
| Number range | Smallest range that still teaches the node | Slightly wider or less tidy numbers | Full range the node allows |
| Steps | One step | One step + a small extra (reversed order, picture then numeral) | Two steps the node actually teaches |
| Representation | Objects / pictures | Mix of pictures and numerals | Numerals, words, or a short story |
| Scaffolding | Hints on the first third; stem names the strategy | Hints only late, or none | No hints unless the representation is new |
| Question kind | Mostly multiple-choice or fill-blank | Two or three kinds | Include multi-select, ordered, match, or a one-step story |

**Inside one quest** the list must ramp from easiest to hardest with **no spikes** (no very hard item next to a trivial one, no drop back to “how many? ⭐” after sequence work). First 2–3 items are the easiest legal version of the skill; last 2–3 stretch *within this level*.

Copy the gold-standard ramp and first item in `QUALITY.md` / `count-to-5.json`.

### Activity types

Current phase is maths only. Do not add another subject until asked.

If you need a new maths **topic** type (`Activity.type`, not a question kind):

1. Add it to `ACTIVITY_TYPES` in `src/types/activity.ts`.
2. Update labels in `src/data/labels.ts`.
3. Mention the addition in the project README “Key decisions” if it is consequential.

Current topic types: `counting`, `number-bonds`, `times-tables`, `fractions`, `place-value`, `reasoning`. Question kinds are separate — see “How to add a question type”.

## Question design rules

Follow `QUALITY.md` for the full wording templates, distractor rules, variety rules and the self-review checklist. The short form:

- Prefer **doing** over reading walls of text. Keep stems short; use visuals/options kids can tap.
- Match the year-group reading age. Reception: one short sentence + a picture. Reuse the stem templates in `QUALITY.md`.
- One concept per question. Avoid trick questions and ambiguous distractors.
- Wrong answers must be plausible misconceptions (off by one, wrong operation, number from the stem) — not random or joke options.
- Always provide `explanation`. Hints teach a strategy and never give the answer. Scaffolding follows the Easy / Medium / Hard table above.
- Mark exactly what is correct in the typed fields (`correctId`, `correctIds`, `acceptedAnswers`, `correctOrder`).
- Use at least three question kinds in a quest of 10+. Do not run the same kind more than three times in a row unless it is fluency practice.
- Support mastery loops: the runner may re-ask missed questions — stems must still make sense on retry.
- Avoid timers that punish slower readers unless the activity type is explicitly fluency-focused and labelled as such.
- Accessibility: do not rely on colour alone; keep tap targets large; include `ariaLabel` / alt text where images or emoji stand in for meaning.

## Narration (read aloud)

Every question screen has a **Hear it** button. It uses the browser Web Speech API (`speechSynthesis`): free, no AI service, works offline. The helper in `src/lib/speech.ts` picks the best **en-GB** voice it can find (prefer natural / neural / “Google UK English” / “Microsoft … Online (Natural)”) at a calm child-friendly rate.

Spoken text comes from optional `question.narration`, then falls back to the visible prompt / labels / hint / explanation. A line may be a string or `{ text, audioSrc }` so we can later swap in a pre-generated file. Do not add audio files unless asked.

Write narration-friendly copy:

- Say numbers and symbols in words: “7 plus what equals 10?”, not “7 + ? = 10”.
- Describe pictures: “Count the three apple pictures”, not a string of emoji.
- Keep the same meaning as the screen. Do not hide the answer in the spoken prompt.
- Always fill `narration` when the stem has emoji, `+`, `−`, `=`, `?`, or picture-only options.

While speech plays, the runner highlights words in the prompt (and feedback) as they are read. If you want that highlight to stay lined up, keep the first words of `narration.prompt` the same as the visible `prompt`.

### Elevating written sentences (later)

Shipped now: Hear it + word highlighting. Later ideas (do not build unless asked): illustrated stems beside the words, stricter shared sentence templates, neater karaoke wrapping, `audioSrc` files. See `QUALITY.md`.

### Allowed question kinds

Defined in `src/types/activity.ts`. Each has one component under `src/components/questions/`:

- `count-objects` — how many pictures? Requires `visual: { item, count }` plus multiple-choice options.
- `multiple-choice` — single correct option. Options may use `visual` instead of a label.
- `multi-select` — all correct options required.
- `fill-blank` — exact normalised answer (number or short word). May include `visual`.
- `ordered` — put items in the right sequence.
- `match-pairs` — match left to right. A side is a string or `{ label, visual }`.

Shared phrases (“Choose all that apply.”, “Correct — nice!”) live in `src/data/copy.ts`, not in JSON.

## Progress and marks

- Profile + progress keys live in `src/storage/localStore.ts`. Do not change key names casually (breaks existing browser data). Do not replace localStorage with another store.
- Record attempts with score, percentage, and mastery flag via the shared helpers.
- Mastery = latest qualifying attempt reaches `masteryThreshold` **or** running accuracy across recent attempts meets the same bar (see `src/lib/mastery.ts`).
- The runner scores the **first answer** to each question. Missed questions are practised again before the finish screen, and those retries do not change the mark.
- Never store personal data beyond the child’s chosen display name and avatar id.

## UI expectations when adding activities

- Home **is** the path map. Categories, titles, order and locks come from `curriculum/maths.md` via `src/data/path.generated.ts` and `buildLevels`.
- A learner starts at node 1. Later nodes stay locked until the previous node's Easy is mastered.
- Do not add subject filters or a second set of category names.
- Empty, loading, error and success states must remain useful (especially empty progress, locked nodes, and “coming soon” Medium / Hard).
- Keep motion subtle and purposeful; do not add noisy celebration that blocks the next question.
- Match the existing visual language in `src/index.css` (brand tokens, fonts). Do not introduce a second theme. No Three.js / WebGL.

## Definition of done for a new activity

1. `QUALITY.md` self-review checklist is all ticks.
2. `npm run build` succeeds in `primary-learn/` (no lint, no tests).
3. The quest appears on the path map at the right node, on the right Easy / Medium / Hard row, and is playable when that row should be unlocked.
4. Hear it reads the prompt (and choices). A miss shows teaching feedback.
5. Completing it updates local progress (marks / mastery / stars) and survives a refresh.
6. README / `curriculum/coverage.md` / the node status in `maths.md` updated if the catalogue meaningfully changes.
7. Commit and push to `main` (no PRs).

## Out of scope unless explicitly requested

- Login, cloud sync, teacher dashboards, payments, or changing localStorage.
- Generating the entire maths curriculum in one change — improve what exists, then add focused batches.
- Other subjects (later phase).
- Changing GitHub Pages base path without updating the deploy workflow.
