# Primary Maths — deep agent reference

Deep detail for quests, question kinds, randomisation, narration, SFX, and progress. Start with [AGENTS.md](../../AGENTS.md) and [ADD-ACTIVITY.md](./ADD-ACTIVITY.md). Do not load this file unless you need a section below.

Progress and profile data live in **browser localStorage only** (no auth, no backend).

## How we work

- James is the lead UX engineer and the tastemaker. We agree what to build first, then build it fast and hand it to him to review.
- Keep token use low. Do only what the task needs.
- `npm run build` is the ship check. For JSON-only work, iterate with `npm run check:activities` first. Do not run the app, take screenshots, make videos or screen recordings unless James asks for it in that task.
- Push straight to `main` when the build passes.

When asked to add or change a learning activity, follow [QUALITY.md](../../QUALITY.md) and [ADD-ACTIVITY.md](./ADD-ACTIVITY.md) strictly. Do not invent a parallel activity format.

**Build once.** Each activity must be right first time. The owner will not rewrite your questions. If the ramp, wording, distractors, narration or checklist would fail, do not push.

**UI:** Follow `DESIGN.md`. Do not invent a second visual system.

**Writing:** Follow **Writing for children** below for every child-facing string.

**Curriculum:** This product is a **primary maths pathway**. The only map is `curriculum/maths.md` (England EYFS mathematics + National Curriculum mathematics, Reception → Year 6). It is one path: 45 categories, 124 nodes. Node 1 (`eyfs-count-5`) is the suggested start. Everything is open. The path suggests an order but never blocks. Before adding a quest, follow `curriculum/audit.md`. Do not rename ids or invent a second set of categories.

## Rapid prototype

Agents work directly on `main`. This is a fast vibe / prototype repo.

- **Push straight to `main`.** Do not open pull requests. Do not use long-lived feature branches.
- **No tests. No linting required.** Do not add test suites or lint steps. Do not run lint or tests unless asked.
- **`npm run build` is the check.** Run it in `primary-learn/` after changes. If it fails, fix it before or immediately after pushing.
- Keep learner data in localStorage. Do not add auth, accounts, or remote APIs for learner data.
- Keep changes inside `primary-learn/` unless the deploy workflow needs updating.

## Routes

Client-side `HashRouter` (not `BrowserRouter`). Hash routes work on GitHub Pages under `/ChatGPT/primary-learn/` without a server rewrite. This repo hosts several apps on one Pages site, so a nested `404.html` would not catch `/primary-learn/pathway`. Shareable URLs look like `https://2ne.github.io/ChatGPT/primary-learn/#/activity/count-to-5`.

| Path | Screen |
| --- | --- |
| `/onboarding` | Name and buddy. No profile required. |
| `/pathway` | Path map. Needs a profile. |
| `/activity/:id` | Quest runner. Needs a profile. |
| `/question-bank` | Teacher/agent review of every quest and question. No profile required. Does not save progress. |

Shareable review URL: `https://2ne.github.io/ChatGPT/primary-learn/#/question-bank` (HashRouter path `/question-bank`). Jump-to-activity buttons scroll in place and leave the `#/question-bank` hash alone. Display name is fixed as Teacher Review.

`/` and unknown paths send you to `/pathway` if there is a profile, else `/onboarding`. No profile on a protected route sends you to `/onboarding`. A missing activity sends you to `/pathway` with a short notice.

Do not add generated audio files.

Every path change scrolls to the top so the name and avatar stay in view. PathMap must not auto-scroll on mount.

## Vision

This product is a **primary school maths pathway**. English or other subjects might come later as separate work. Do not add them here until asked.

**Three levels per node is a core concept.** Every path node has Easy / Medium / Hard. Each can earn 0–3 stars (9 stars in total). All 9 awards a gold cup and the node is done.

**Priority now:** nail the foundations and **improve existing activities** (especially missing Medium and Hard levels) **before expanding** to new nodes.

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

Drop the JSON in `src/data/activities/`. The registry auto-loads every `*.json` except `activity.schema.json` through `validateActivity`. Then:

- The node appears as a numbered stop on the road.
- Opening it shows Easy / Medium / Hard rows in `LevelSheet`.
- Your quest sits on the row that matches `difficulty`.

### Open path (actual `buildLevels` behaviour)

Everything is open. The path suggests an order but never blocks. A Year 4 child can jump straight in.

- A node with **no Easy quest** is `soon` (coming soon). The stop is still tappable. Rows without a quest say coming soon.
- You are here (`current`) is the first node, in path order, that has any Easy, Medium or Hard below 1 star (6 or more right out of 10). A 0-star run does not move it on. The highlighted circle follows the same rule.
- Later nodes with a quest are `open` and playable at once. Easy, Medium and Hard on a node are all playable. Stars show progress. They do not gate anything.
- Node status `done` means every existing Easy, Medium and Hard on that node has at least one star. Map stars: one star per Easy / Medium / Hard that has all three stars (max three). 1 or 2 stars on a level stay in the sheet. They do not gate anything.

Shipped examples: `count-to-5` / `count-to-5-medium` / `count-to-5-hard` are `pathNode: "eyfs-count-5"` at difficulty 1, 2 and 3. `number-bonds-to-10` is `pathNode: "y1-bonds-10"`, `difficulty: 1` (Easy only).

## Goals

- Build the primary maths pathway (Reception → Year 6).
- Prefer **interactive, mastery-oriented** practice over one-shot quizzes.
- Keep the UI kid-friendly, accessible, and touch-first.
- Track marks per activity in localStorage.

## Stack and layout

```text
primary-learn/
├── AGENTS.md                 ← slim always-on core
├── docs/agent/               ← ADD-ACTIVITY, UI-MAP, this REFERENCE
├── QUALITY.md                ← required quality guide + gold-standard item
├── README.md
├── DESIGN.md
├── curriculum/               ← maths.md path, NEXT.md, audit, coverage
├── src/
│   ├── types/activity.ts     ← Activity + question schema (TS)
│   ├── data/activities/      ← JSON quests (auto-registered) + JSON Schema
│   ├── data/copy.ts          ← shared child-facing phrases (change once)
│   ├── data/objects.ts       ← object-item names (pictures live in UI)
│   ├── components/ActivityRunner.tsx
│   ├── components/questions/ ← one component per question kind
│   └── lib/                  ← validateActivity.ts, realize.ts (optional randomise)
└── ...
```

- Prefer React, TypeScript and Tailwind already used here.

## Content and UI stay separate

Educational content is **pure data**. Presentation is **one generic runner** plus **one component per question kind**. If 124 quests exist and a phrase or a picture style needs changing, we change it once in the UI/copy layer — not in every JSON file.

| Layer | Lives in | May contain | Must not contain |
| --- | --- | --- | --- |
| Content | `src/data/activities/<id>.json` | Metadata, prompts, answers, hints, narration, `visual` assets (`{ item, count }`) | JSX, CSS, React, scoring, shared phrases like “Correct. Nice!” |
| Shared wording | `src/data/copy.ts` | Instructions, feedback titles, buttons | Per-quest stems |
| UI | `ActivityRunner` + `components/questions/*` | Layout, objects pictures, speaker icon, marking | Quest-specific copy or one-off screens |

Do not put emoji strings in JSON. Use `"visual": { "item": "apple", "count": 3 }`. Join stories of the same object add `"added"` (start count plus that many more). Take-away pictures add `"removed"` (how many of the last objects sit on light red tiles). The `ObjectGroup` component draws the picture. To change how apples look, edit that component once.

## Maintainability

Two of us build this whole product. Keep it easy to change.

- **Activities are simple JSON.** No per-activity components, CSS, or scoring. A quest is a data file in `src/data/activities/` (auto-registered).
- **Behaviour lives in a few shared question kinds.** Name them clearly (`count-objects`, `build-set`). Give each kind sensible defaults so JSON stays short. Improving one component upgrades every current and future activity at once.
- **Keep the schema small and readable.** Do not add a field, flag, or kind that only one quest needs. If the existing kinds cannot teach the skill well, upgrade a shared component or add one reusable kind the next node can use too.

## Writing for children

Every string a child (or parent helper) can read on screen must follow this. That means `src/data/copy.ts`, activity JSON (`prompt`, `hint`, `explanation`, `narration`, `summary`, `title`), and any words in components. Agent-only docs may still use dashes.

**UK English.** *maths* not math. *practise* (verb), *metre*, *colour*, *number bonds*, *times tables*, *Year 2* not 2nd grade.

**Full kid sentences.** Write for primary children, especially Reception and Year 1. Everyday words. One idea per sentence. Present tense. The stem must make sense if a parent reads it aloud with no picture context. Prefer a clear short sentence over a clipped fragment.

**No fancy punctuation.** Do not use em dashes (`—`) or en dashes (`–`) as punctuation. Do not use semicolons. Do not use colons to glue two ideas. A full stop or a new sentence is enough. Hyphens in normal words are fine (*one-to-one*, *fill-blank*). Maths minus is the minus sign in an equation, not a dash in a sentence.

**Never say to a child:** mastery, curriculum, ability, emerging, greater depth, distractor, node, percentage (unless the node is percentages).

| Bad | Good |
| --- | --- |
| Hi — I'm Pip. Let's get you on the path! | Hi, I'm Pip! Let's learn together. |
| Correct — nice! | Correct. Nice! |
| Your stars stay on this device — no sign-in. | Your stars stay on this device. |
| Pick a name; then choose a buddy. | Pick a name. Then choose a buddy. |
| How many ducks? | How many ducks can you see? |
| Sam needs 5 ducks. Which group? | Which group has 5 ducks? |
| How many left? | How many are left? |

If a line needs a pause, use a full stop or split it. If two ideas fight in one sentence, make two sentences.

**Missing-part stems.** Every missing-part prompt (any question kind: fill-slots, sum-only, multiple-choice, fill-blank) is `What do you need to add to {n} to make {total}?`. Do not write `5 is 2 and ?`, `5 = ? + 2`, `Which number goes with 6 to make 10?`, or `Which number is missing? 7 + ? = 10`. **Result stems.** If the blank is the answer at the end of a calculation (`a + b = __`, `a − b = __`), or another kind shows that same equation, the prompt is `What is {a} + {b}?` / `What is {a} take away {b}?`. Do not write `What is the missing number?` for that shape. `What is the missing number?` is only for a blank inside the calculation (`2 + __ = 5`, `__ − 2 = 3`) or a gap in a sequence, and even then prefer the bond wording for addition. Fill-blank and bare equation prompts are generated in `applyStemPromptDefaults` from the stem so JSON cannot drift. `validateActivity` fails if a result blank says missing number. Sum-only totals (number boxes, no pictures) use the same `What is {a} + {b}?` rule. Spoken narration uses words: `What is one plus one?` / `What is five take away two?`. JSON may override the stem. Pictured totals: `How many can you see in all?`. Take-away stays take-away.

## How to add an activity (data only)

Follow the short playbook in [ADD-ACTIVITY.md](./ADD-ACTIVITY.md). Summary:

1. Copy `src/data/activities/count-to-5.json` (gold standard) or a sibling on the same node to `src/data/activities/<kebab-id>.json`.
2. Fill metadata + `questions`. Set `questionCount` to `questions.length` (the loader checks they match).
3. Drop the file in `src/data/activities/`. Auto-registry runs `validateActivity`. Invalid JSON fails the build / `npm run check:activities`.
4. Do **not** create a `.tsx` for the quest. Do **not** edit `ActivityRunner` unless you are changing all quests.

Every new activity **must**:

1. Be that JSON file only. No JSX. No hand import.
2. Declare **all** metadata below — no optional gaps for the core fields.
3. Set `pathNode` + `difficulty` so it appears on the correct map stop and Easy / Medium / Hard row.
4. Write **exactly 10 questions** unless the quest is unusually complex. Then set `extraQuestions: { reason }` and you may go up to 20.
5. Use only question kinds in `QUESTION_KINDS` (`src/types/activity.ts`).
6. Target a clear UK year group (and ability band) — not “all ages”.
7. Write `difficultyRamp` first, then a gradual Easy→Hard climb inside the quest (see below).
8. Write a short factual `explanation` of why the answer is correct. It appears after both correct and incorrect answers. Put instructions in hints. After a miss the runner also shows a labelled correct answer. There is **no** retry loop.
9. Write `narration.prompt` wherever the voice would mangle the stem (`+`, `−`). Spoken text is the **question only** — never the answer.
10. Use British English spelling and UK maths wording (e.g. *maths*, *number bonds*, *Year 2*).
11. Run the self-review checklist in `QUALITY.md` before you push.

## How to add a question type

Content never embeds a new UI. Prefer upgrading an existing kind. A new kind must be reusable, with defaults that keep JSON small. Adding a kind is a schema + component change:

1. Add the kind to `QUESTION_KINDS` and the discriminated union in `src/types/activity.ts`.
2. Teach `src/lib/answers.ts` (`isAnswerCorrect`, `emptyAnswerFor`, `hasProvidedAnswer`).
3. Spoken question read-aloud is the prompt only (`spokenPrompt` in `src/lib/narration.ts`). Do not add a path that reads options or answers. After a mark, `spokenExplanation` may be read from the feedback speaker.
4. Add a component in `src/components/questions/<Kind>.tsx` (data in, answers out — no quest-specific copy).
5. Register it in `QUESTION_VIEWS` in `src/components/questions/QuestionView.tsx`.
6. Extend `src/lib/validateActivity.ts` (and `activity.schema.json` if the top-level shape changes).
7. Mention it in `QUALITY.md` stem templates if agents will write that kind.

Until those steps are done, `validateActivity` will reject JSON that uses the new kind.

**What to write next:** see [curriculum/NEXT.md](../../curriculum/NEXT.md). Prefer Medium / Hard on shipped nodes before a brand-new node. When expanding, take the first `missing` node and start with Easy.

## Required activity metadata

| Field | Rules |
| --- | --- |
| `id` | Stable kebab-case string, unique across the registry. Never reuse an id. |
| `title` | Child-facing, short (e.g. “Number bonds to 10”). The level sheet labels the row Easy / Medium / Hard from `difficulty`, not from this title. |
| `summary` | One sentence for parents/teachers. |
| `subject` | `maths`. |
| `type` | One of the `ActivityType` union values (extend the union if adding a new type). |
| `yearGroups` | Non-empty list of `YearGroup` values (`Reception` … `Year6`). |
| `ability` | `emerging` \| `expected` \| `greater-depth`. Pedagogical band; typically Easy → emerging, Medium → expected, Hard → greater-depth. |
| `estimatedMinutes` | Realistic 3–15 minute range for a child. |
| `masteryThreshold` | Still in the JSON schema. Unlock does **not** read this. Stars come from `STAR_SCORE` in `src/lib/mastery.ts`. |
| `curriculumRef` | The node id from `curriculum/maths.md` (for example `eyfs-count-5`). Same id as `pathNode`. |
| `pathNode` | **Required for the map.** Same node id. `buildLevels` looks this up. |
| `difficulty` | **Required for the map.** `1` Easy, `2` Medium, `3` Hard. |
| `questionCount` | Must equal `questions.length`. Default **10**. |
| `extraQuestions` | **Optional.** `{ reason }` only. Required to ship more than 10 questions. Say why the extra items are needed (e.g. a full times-table set). Never use it to go under 10. |
| `difficultyRamp` | **Required.** `{ within, versus }` — how this quest climbs, and how Easy < Medium < Hard on this node. |
| `skills` | 2–6 concrete skill tags (e.g. `addition-within-10`). |
| `questions` | Interactive items using allowed `Question` variants. Pictures are `visual: { item, count }`, not emoji. |
| `randomise` | **Optional.** Fresh pictures / option order / count-in-band per play. See below. Must not make Easy into Hard. |

### Year groups, ability, and Easy / Medium / Hard

- Map ages roughly: Reception ~4–5, Year 1 ~5–6, … Year 6 ~10–11.
- Prefer a **single** year group. Use two adjacent years only when the same skill is taught across both (document why in `summary`).
- `ability` is metadata. `difficulty` is the playable level on the map. Kids see Easy / Medium / Hard, not ability bands.
- Write Easy first for a new node so the stop has a first quest. Medium and Hard are playable in any order.

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
| Question kind | Tap-to-count, build-set, multiple-choice or fill-blank | Two or three kinds | Include multi-select, ordered, match, build-set, or a one-step story |

**Inside one quest** the list must ramp from easiest to hardest with **no spikes** (no very hard item next to a trivial one, no drop back to “how many? ⭐” after sequence work). First 2–3 items are the easiest legal version of the skill; last 2–3 stretch *within this level*.

Copy the gold-standard ramp and first item in `QUALITY.md` / `count-to-5.json`.

### Activity types

This app is maths only. Do not add another subject until asked.

If you need a new maths **topic** type (`Activity.type`, not a question kind):

1. Add it to `ACTIVITY_TYPES` in `src/types/activity.ts`.
2. Update labels in `src/data/labels.ts`.
3. Mention the addition in the project README “Key decisions” if it is consequential.

Current topic types: `counting`, `number-bonds`, `times-tables`, `fractions`, `place-value`, `reasoning`. Question kinds are separate — see “How to add a question type”.

## Question design rules

Follow `QUALITY.md` for the full wording templates, distractor rules, variety rules and the self-review checklist. The short form:

- Prefer **doing** over reading walls of text. Keep stems short; use visuals/options kids can tap.
- Match the year-group reading age. Reception: one short sentence + a picture. Reuse the stem templates in `QUALITY.md`. Missing-part items always use `What do you need to add to {n} to make {total}?`. The prompt must describe exactly what the child sees and does on that screen.
- One concept per question. Avoid trick questions and ambiguous distractors.
- Wrong answers must be plausible misconceptions (off by one, wrong operation, number from the stem) — not random or joke options.
- Always provide a factual `explanation` that reads naturally after a correct answer. No instructions. Hints teach a strategy and never give the answer. Scaffolding follows the Easy / Medium / Hard table above.
- Mark exactly what is correct in the typed fields (`correctId`, `correctIds`, `acceptedAnswers`, `correctOrder`).
- Use at least three question kinds in a 10-question quest. Do not run the same kind more than three times in a row unless it is fluency practice.
- There is no retry loop. Each question is asked once. A miss shows a short correction, then the child moves on.
- Avoid timers that punish slower readers unless the activity type is explicitly fluency-focused and labelled as such.
- Accessibility: do not rely on colour alone; keep tap targets large; include `ariaLabel` / alt text where images or emoji stand in for meaning.

## Narration (read aloud)

A small **speaker icon** sits inline, immediately after the question text. After a mark, a second 44px speaker sits on the feedback panel and reads the explanation only. Narration is **Web Speech API only** (`speechSynthesis`): free, no paid API, no generated audio files. There are too many questions to record or synthesise offline. The helper in `src/lib/speech.ts` picks a young, warm, happy **UK female** primary-teacher voice: prefer en-GB female natural voices (Microsoft Sonia / Libby / Maisie Online (Natural), Google UK English Female, Apple Serena / Kate / Stephanie / Martha), then other female English, and never prefer known male voices (Daniel, Arthur, George, Ryan, Thomas, Oliver, Google UK English Male). Pitch about 1.1. Rate about 0.95.

**The question speaker is the question only.** It must never reveal or hint the answer. Do not read options, pictured object counts, fill-blank answers, or hints. Teaching feedback is read only from the feedback speaker after the child has answered.

Spoken text is `question.narration.prompt`, falling back to the visible `prompt`. Do not add `audioSrc` files.

Write narration-friendly copy:

- Say numbers and symbols in words: “7 plus what equals 10?”, not “7 + ? = 10”.
- Ask the question. Never add “there are three pictures”, option lists, or the explanation.
- Keep the same meaning as the on-screen prompt. Do not hide the answer, and do not give it away.
- Always fill `narration.prompt` when the stem has `+`, `−`, `=`, or `?` the voice would mangle.

While speech plays, the runner highlights words in the prompt as they are read. If you want that highlight to stay lined up, keep the first words of `narration.prompt` the same as the visible `prompt`.

### Elevating written sentences (later)

Shipped now: speaker icon after the question + word highlighting. Later ideas (do not build unless asked): illustrated stems beside the words, stricter shared sentence templates, neater karaoke wrapping. Do not generate audio files. See `QUALITY.md`.

## Sound effects

All SFX are synthesised in `src/lib/sound.ts` with the **Web Audio API**. No audio files. One shared `AudioContext`, unlocked and resumed on the first `pointerdown` / `touchstart`. Play on **pointerdown** (and `touchstart` where pointer events are missing), never on click or touch-up, so iOS is instant. Schedule at `currentTime`. Do not use `setTimeout` for audio. Mute lives in Settings (tap the avatar on the path) and in localStorage (`primary-path:sound-muted:v1`). Do not pause or cancel `speechSynthesis` when playing SFX. Cues: soft tap (buttons and answers), ding (correct), gentle low tone (wrong), short fanfare on the end screen (bigger at 3 stars).

## Allowed question kinds

Defined in `src/types/activity.ts`. Each has one component under `src/components/questions/`:

- `count-objects` — how many pictures? Requires `visual: { item, count }` plus multiple-choice options. Objects are tappable: each tap lights up and says the next number. Optional `extras` (other objects to ignore) and `layout` (`row`, `scatter`, `dice`, `five-frame`, `tens-frame`, `fingers`, or `hidden`). Every stem picture group uses the same cream tiles as count-objects. `dice` / `five-frame` / `tens-frame` are not frames: no empty cells. Multiple-choice stem pictures are look-only so subitising does not turn into tap-counting. Optional `flashMs` briefly shows then hides the stem so the child cannot count one by one.
- `build-set` — tap objects from a tray to build a group of `visual.count`. Tray size defaults to count + 2. Omit `bank` unless you need a different tray. Correct when the group size matches. Teaches cardinality (stop at the right number).
- `multiple-choice` — single correct option. Options may use `visual`, `tenFrame`, `baseTen` or `dice` instead of a label. Number-to-amount picks set `numeral` (and optional `numeralLabel` for a number word). Prompt is `Tap the {items} that match the number below.` The stem is a lavender number card (digit by default). Answers are a 2x2 grid of four picture groups of the same item (correct count plus three near misses). Do not use match-pairs for this. Compare questions use ten frames up to 20 (equal footprint) and `baseTen` above 20 (max 3 options). Do not show 11 to 100 as piles of singles.
- `multi-select` — all correct options required.
- `fill-blank` — exact normalised answer (number or short word). May include `visual`. Stem pictures are the same look-only cream tiles as count-objects (no compact strip or five-frame). Only `count-objects` tiles are tappable. Result blanks (`5 − 2 =` with an empty suffix) default to `What is 5 take away 2?`, generated from prefix/suffix in `applyStemPromptDefaults`. Addition missing-part blanks default to `What do you need to add to {n} to make {total}?`. Spoken uses number words and `plus` / `take away`. JSON may override with any other prompt. `validateActivity` fails if a result blank says `missing number`.
- `ordered` — put items in the right sequence. Big numeral tiles with a left drag handle and up/down arrows (either works).
- `match-pairs` — one pair per question at every level. First try only. Use it only when both sides are the same thing shown two ways, and those ways must differ (word and number, shape and name, numeral and ten frame, ten frame and dice, tens-and-ones and numeral). Never picture-to-same-picture. Never use it for next number, missing number, one more or one less. Those are `multiple-choice`. Required `mode`: `one-at-a-time`. Exactly 1 pair plus `choices` of 3 sides (Easy and Medium) or 4 sides (Hard). The right card must be in `choices`. One face-up target card, face-down answers, Check it once. Hard lays the four answers in a 2x2 grid. After Check it, cards reuse the same `option is-correct` / `option is-wrong` marks as multiple choice. A side is a string or `{ label, visual, tenFrame, baseTen, dice, shape }`. `validateActivity` fails if both sides use the same representation. Do not use match-pairs with `a and b` text for Reception bonds. Use `part-whole`. There is no flip memory game.
- `make-total` — part-whole sum. Required `total` (1–20) and `mode`. Known addend is `part` or `visual.count`. `gap` is `right` (default: `2 + ? = 5`), `left` (`? + 2 = 5`), or `total` (`2 + 3 = ?`). `operation` is `add` (default) or `subtract` (tap to remove later). Modes: `fill-slots` (row 1 = known tiles + large `+`; row 2 = green added tiles and one `Add` button; tap Add to place one more, tap a green tile to clear from that place; overshoot cap is `slotCount` or missing + 2; no empty capacity slots; no sum line; no spoken count), `sum-only` (sum line and number buttons only). Missing-part prompt (fill-slots or sum-only, any gap except total) is always `What do you need to add to {n} to make {total}?`. Sum-only `gap` `total` defaults to `What is {a} + {b}?` (subtract: `What is {a} take away {b}?`), generated in `applyMakeTotalDefaults` from `part`/`other` so JSON cannot drift when numbers change; a different JSON prompt is kept as an override. Spoken defaults to number words and `plus` / `take away`. Pictured totals: `How many can you see in all?`. There is no pick mode. Do not randomise `total` or `part`.
- `pick-pair` — tap two number tiles that add to `total` (1–20). Required `total` plus `tiles` or `tileRange` (`tileCount` default 4, max 4). Always four tiles. Always exactly one valid pair. No duplicate numbers that make a second pair. `showDots` (default true) draws quantity dots on each tile. Medium difficulty is the numbers, not extra tiles. Finding every pair belongs to `match-pairs`. Do not randomise `total`. Shuffle tile order with `shuffleOptions`.
- `part-whole` — cherry number-bond model. Required `whole` (1–20), `parts: [a, b]` (must add to `whole`), and `missing` (`left`, `right`, or `whole`). Optional `choices` of exactly 3 numbers (default is the answer plus two nearby misses, e.g. ±1). One empty circle with `?`. Known circles show small quantity dots under the numeral. Three rounded-square buttons in one row, shuffled so the correct slot varies. Tap drops the number in. Tap another to replace. Nothing auto-checks. Prompt is generated: `What do you need to add to {known} to make {whole}?`, or `What do {a} and {b} make?` when the whole is missing. JSON may override. Spoken uses number words. Do not randomise `whole` or `parts`. Do not use match-pairs with `a and b` text for Reception bonds.

Structured pictures (look-only, never tappable):

- `tenFrame: { count, item?, parts?, pairs? }` — 0 to 20. One 2×5 frame, or two frames for 11 to 20. Empty cells stay visible. Filled cells use the object colour. `parts: [a, b]` must add to `count`. The second part uses a stripe pattern and an outline. `pairs: true` fills down columns so pairs sit together. Fixed two-frame footprint.
- `baseTen: { tens, ones, style? }` — tens 0 to 9, ones 0 to 9. Neutral rods, not the question objects. `style` is `segmented` (Easy) or `plain` (Medium and Hard). Use for 21 to 99. Numerals only above 20.
- `dice: { count }` — 1 to 6 pips on a dice face.
- `numberLine: { start, end, scale?, marked?, flags? }` — `start` 0 and `end` 10 or 20 with `scale` `ones`, or `end` 100 with `scale` `tens`. A marked tick shows ?. Flags A to D sit on an unmarked line and are not tappable. Answers stay as A/B/C/D rows. Multiple-choice or fill-blank only. Do not mix with other stem pictures.
- `hundredSquare: { start, rows, missing, highlight? }` — a 3 or 4 row window of the 1 to 100 square. `start` is 1, 11, 21... Numerals only. Not tappable. Not scrolling. Multiple-choice or fill-blank only. Do not mix with other stem pictures, including a number line.

Do not mix these with `visual` or `shape` on the same stem, option, or match side. Compare questions use ten frames up to 20 and `baseTen` above 20. Do not use piles of singles for 11 to 100.

Optional on any pictured stem: `extras` (a second kind of object; `extras.item` must differ from `visual.item`) and `layout` (`row` default, `scatter`, `dice`, `five-frame`, `tens-frame`, `fingers`, or `hidden`). For mixed counting, the child counts `visual` and ignores extras. For composition or conceptual subitising (see 2 and 3 inside 5), keep `layout` as `row` so the two kinds stay in groups (first `visual`, then extras) and ask `How many can you see in all?`. A one-object join story (`Mia has 1 {item}. She gets 3 more. How many {items} does she have now?`) uses `visual.count` and `visual.added` of the same item, never extras. Use at least three names and three objects across a node. The stem is look-only: cream start tiles, a purple +, then light-blue added tiles. Take-away pictures (`What is 5 take away 2?` or a give-away story) use `visual.count` (start) and `visual.removed` (last N on light red tiles) in one cream strip. `scatter` shuffles them together. `dice` / `five-frame` / `tens-frame` use the same cream tiles as `row` (no joined frame, no empty boxes that hint at the total). `fingers` shows a cartoon hand with 0–5 raised fingers (index first, then middle, ring, pinky; 5 includes the thumb). Count only; ignore the item glyph. Option and match-pair pictures may use `fingers` too. `hidden` needs `flashMs` (peek under the cup). `flashMs` on look-only stems (300–4000) auto-hides the picture; Look again re-flashes. Option pictures use smaller tiles of the same kind.

Shared phrases (“Choose all that apply.”, “Correct. Nice!”) live in `src/data/copy.ts`, not in JSON. Follow **Writing for children**.

## Optional randomisation

### Shape assets

Multiple-choice and multi-select stems and options, and match-pair sides,
may use `shape: { name, variant?, colour?, rotation?, scale? }`. Shape names
are circle, triangle, square, rectangle, cube, cuboid, pyramid and sphere.
Near misses are kite, pentagon and wonky (curved sides). Real objects are ball,
box, tin, cone-hat and dice. Matching may pair a shape with a name, or a real
object with a shape name, never the same picture with the same picture.
Allowed variants depend on the shape and are validated in `src/lib/shapes.ts`.
Use `squashed` for a very flat rectangle or triangle.
Do not combine a shape with an object picture on the same stem or option.
Do not use shape assets on numeric question kinds or ordered items.

`ShapeChoices` reuses the existing choice marking and scoring. `ShapeSvg`
draws flat shapes. `ShapePicture` lazy-loads Three.js solids, supports direct
drag and keyboard rotation for stems, with no visible control row, and generates cached answer
images through a shared renderer. Offscreen interactive contexts are disposed.
Solids use glossy non-metallic materials with a clear coat, a directional key
light and subdued ambient fill so highlights and face shading reveal depth.
The same material and lighting apply to stems and answer images.
Pyramids start at a corner view showing two clear faces, including on answer
cards. Free dragging remains unrestricted. No automatic spinning and no
static fallback drawings. Preserve family
relationships in content: squares are rectangles and cubes are cuboids.
Avoid putting both a general and a specific defensible name in one naming
question. Multi-select questions explicitly state the number of selections.

Kids learn better when the same skill shows up as slightly different pictures or a shuffled choice list — not a new harder puzzle. Randomisation is **opt-in** and **must stay inside the difficulty band**.

The runner calls `realizeActivity` on **activity entry / Play again / Try again**. The draw stays for that play. There is no miss-retry loop.

### When to use it

| Use | Do not use |
| --- | --- |
| Swap objects on `count-objects`, fill-blank counts, match-amount, “which group”, `build-set` | Randomise the **count** on Easy Count to 5 (the 1→2→3→4→5 ramp is the lesson) |
| `{item}` / `{items}` in stems so “apples” can become bananas, stars, cars | A count range wider than this level (Easy to 5 must not draw 8) |
| `shuffleOptions` on multiple-choice / multi-select / make-total number buttons / pick-pair tiles so the tap target moves | Shuffle `ordered` items or match-pair order (those kinds have their own pedagogy). `part-whole` always shuffles its 3 choices. |
| A **tight** `count: { min, max }` on Medium/Hard counting, still inside the node | Randomise number-bond totals or missing addends (that changes the fact being taught) |

Questions **opt in**. An activity-level pool is only used by questions that set `"randomise": {}` (or their own `items` / `count` / `shuffleOptions`). Sequence and numeral items stay fixed unless you opt them in.

### Activity field

```json
"randomise": {
  "mode": "attempt",
  "items": ["apple", "banana", "star", "balloon", "car", "duck"]
}
```

- `mode: "attempt"` (default) — new draws every Start / Play again.
- `mode: "seeded"` — same draws every time (`seed` or the activity `id`). Use when you need a stable classroom demo.
- `items` — default object pool for questions that opt in without their own `items`.

### Question field

```json
"randomise": {
  "items": ["apple", "banana", "star"],
  "count": { "min": 3, "max": 5 },
  "shuffleOptions": true
}
```

All three keys are optional. `"randomise": {}` means “use the activity pool, keep the written count”.

- `items` — pool for this question (else activity `items`). Distinct original pictures map to distinct picks (`strawberry` + `sparkle` → two different things).
- `count` — inclusive range. Replaces `visual.count`. Nearby numeric options and fill-blank answers (`"4"`, `"four"`) are rebuilt **inside `min`…`max`**. Omit on Easy Count to 5.
- `shuffleOptions` — shuffle multiple-choice / multi-select / count-objects / make-total number-button / pick-pair tile order. `part-whole` always shuffles its 3 choices.

### Templates

Write stems with tokens. The runner fills them after it picks items / count:

| Token | Example |
| --- | --- |
| `{item}` / `{items}` | apple / apples (first mapped picture) |
| `{Item}` / `{Items}` | Apple / Apples |
| `{item2}` / `{items2}` | second distinct picture on the same question |
| `{count}` / `{word}` | `3` / `three` (written count, or the draw if `count` is set) |
| `{seq}` | `1, 2, 3` for that count |

If the question has no picture but sets `items` (a story), `{item}` / `{items}` still resolve from the pool.

### Count to 5 (shipped)

Easy item pool only. Counts stay 1, 2, 3, 4, 5 so the ramp does not wobble. Sequence / numeral questions have no `randomise`. Medium may draw a tight count on fill-blank / build-set inside 3–5. Hard uses `extras` (count only one kind) and does not randomise the mixed counts.

```json
"randomise": { "mode": "attempt", "items": ["apple", "banana", "star", "balloon", "car"] },
"questions": [
  {
    "kind": "count-objects",
    "id": "c5e-count-1",
    "prompt": "How many {items} can you see?",
    "visual": { "item": "star", "count": 1 },
    "randomise": { "shuffleOptions": true },
    "hint": "Tap the {item} and say one.",
    "explanation": "Touch the {item} once and count: 1. There is 1 {item}."
  }
]
```

### Number bonds to 10 (shipped, light)

`shuffleOptions` on choice questions. The story uses a small item pool (`apples` → bananas / stars / cars) but the numbers stay 10 and 2.

### Medium counting (pattern)

Vary the count **inside this level** on fill-blank or build-set, and rebuild fill-blank answers. Keep four numeric multiple-choice options on a band wide enough for off-by-one distractors, or leave those counts fixed.

```json
"visual": { "item": "apple", "count": 4 },
"randomise": { "count": { "min": 3, "max": 4 } }
```

Do not set `{ "min": 1, "max": 12 }` on a to-5 node.

## Progress and marks

- Profile + progress keys live in `src/storage/localStore.ts`. Mute is `primary-path:sound-muted:v1`. Do not change key names casually (breaks existing browser data). Do not replace localStorage with another store.
- A quest is **exactly 10 questions** (unless `extraQuestions`). Score = how many were right. No retry of misses.
- After a wrong answer, show a labelled correct answer and the factual `explanation`. Addition make-total and part-whole questions can also offer the optional `BondDemonstration`. It never changes the score.
- Stars live in **one config**: `STAR_SCORE` in `src/lib/mastery.ts`. On a 10-question quest: **6–7 = 1 star**, **8–9 = 2**, **10 = 3**. Below 6 = 0 stars. Longer quests scale to that 10-question ruler.
- Stars show progress. They do not gate the path. Everything is open. The path suggests an order but never blocks.
- Store **best stars** and **best score** per Easy / Medium / Hard in localStorage (`bestStars`, `bestCorrectCount`, `bestTotalCount`).
- Each node can earn **9 stars** (3 per difficulty). Untouched map stops are just a number. The map shows **one star per Easy / Medium / Hard with 3 stars** (max 3). A level with 1 or 2 stars shows nothing on the map; the sheet still shows those stars. All three levels with 3 stars: gold cup replaces the number. Star rows live in the level sheet. The welcome pill counts the same map stars (cleared levels), not the raw 0–9 total.
- Do not show percentages to children. Do not say "mastery".
- Never store personal data beyond the child’s chosen display name and avatar id.

## UI expectations when adding activities

- Home **is** the path map. Categories, titles and order come from `curriculum/maths.md` via `src/data/path.generated.ts` and `buildLevels`.
- A learner is suggested node 1 (You are here). Every node and every Easy / Medium / Hard quest that exists is open.
- Do not add subject filters or a second set of category names.
- Empty, loading, error and success states must remain useful (especially empty progress and “coming soon” Medium / Hard).
- Keep motion subtle and purposeful; do not add noisy celebration that blocks the next question.
- Match the existing visual language in `src/index.css` (brand tokens, fonts). Do not introduce a second theme. No Three.js / WebGL.

## Definition of done for a new activity

1. `QUALITY.md` self-review checklist is all ticks.
2. `npm run check:activities` then `npm run build` succeed in `primary-learn/` (no lint, no tests). Pedagogy rules in `QUALITY.md` fail the activities check.
3. The quest appears on the path map at the right node, on the right Easy / Medium / Hard row, and is playable at once.
4. The speaker reads the question only (no options, counts, or answers). A miss shows teaching feedback on screen.
5. Completing it updates local progress (best score / stars / cup) and survives a refresh.
6. README / `curriculum/coverage.md` / `curriculum/NEXT.md` / the node status in `maths.md` updated if the catalogue meaningfully changes.
7. Commit and push to `main` (no PRs). Do not open the app unless James asked.

## Out of scope unless explicitly requested

- Login, cloud sync, teacher dashboards, payments, or changing localStorage.
- Generating the entire maths curriculum in one change — improve what exists, then add focused batches.
- English or other subjects (separate work, not this app).
- Changing GitHub Pages base path without updating the deploy workflow.

### Turn diagrams

Choice stems may set `position: {object, relation}` for illustrated relationships with Pip, or `turn: {start, quarters, clockwise, showEnd, interactive?}`. `start` is 0 up, 1 right, 2 down or 3 left. `quarters` is 1 to 4. `TurnPicture` uses a top-down toy car with headlights, a faint starting car, and one-shot rotation with replay. Prediction items show only the start and picture choices. Reduced motion disables automatic and transition motion; movement descriptions remain. `TurnChoices` supports signed quarter-step controls on `interactive` items. Those items encode eight possible nonzero net movements as option IDs (-4 to -1 and 1 to 4), validated against the requested movement, with no option shuffling. Reset clears the answer. Controls lock during feedback. Existing choice scoring and labelled correction remain.

Safari tint: the confetti canvas stays 1px inside viewport edges and is hidden after its last particle disappears. Never leave an empty fixed full-viewport canvas painted over intro/result tint surfaces.
