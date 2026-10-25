# Primary Maths — agent instructions

Rapid prototype of a UK **primary maths** pathway for children. Progress lives in **browser localStorage only** (no auth, no backend).

## How we work

- James is lead UX. Agree what to build, ship fast, hand to him.
- Keep token use low. Do only what the task needs.
- **`npm run build`** is the ship check. For JSON-only work, iterate with `npm run check:activities` first.
- Do **not** run the app, take screenshots, or record video unless James asks in that task.
- Push straight to `main` when the build passes. No PRs. No long-lived feature branches.
- No tests. No linting required. Do not add test suites or lint steps unless asked.
- Keep changes inside `primary-learn/` unless the deploy workflow needs updating.
- Do not add auth, accounts, remote learner APIs, or generated audio files.

## What to open (do not read everything)

| Task | Read these |
| --- | --- |
| Add or edit a quest | [docs/agent/ADD-ACTIVITY.md](docs/agent/ADD-ACTIVITY.md), [QUALITY.md](QUALITY.md), the node in [curriculum/maths.md](curriculum/maths.md), [curriculum/NEXT.md](curriculum/NEXT.md) |
| UI / CSS / components | [DESIGN.md](DESIGN.md), [docs/agent/UI-MAP.md](docs/agent/UI-MAP.md) |
| Deep reference (kinds, randomise, narration, stars, routes) | [docs/agent/REFERENCE.md](docs/agent/REFERENCE.md) |

**Priority:** improve existing activities (especially missing Medium / Hard) before new nodes. See `curriculum/NEXT.md`.

## Content vs UI

Educational content is **pure data**. Presentation is one generic runner plus one component per question kind.

| Layer | Lives in | Must not contain |
| --- | --- | --- |
| Content | `src/data/activities/<id>.json` | JSX, CSS, React, scoring, shared phrases |
| Shared wording | `src/data/copy.ts` | Per-quest stems |
| UI | `ActivityRunner` + `components/questions/*` | Quest-specific copy |

- Drop a JSON file in `src/data/activities/`. The registry auto-loads it (no hand import). Invalid JSON fails the build via `validateActivity`.
- Do **not** create a `.tsx` per quest. Do **not** edit `ActivityRunner` unless changing all quests.
- Pictures: `"visual": { "item": "apple", "count": 3 }` — never emoji strings in JSON.
- Ten frames: `"tenFrame": { "count": 6, "item": "apple" }` for 0 to 20. Empty cells stay visible. The board keeps a two-frame footprint. Two-colour parts: `"parts": [5, 2]` (must add to count). The second part uses stripes and an outline, not colour alone. `"pairs": true` fills down columns for odd and even.
- Tens and ones: `"baseTen": { "tens": 3, "ones": 4, "style": "plain" }` for 21 to 99. Neutral rods, not the question objects. Numerals only above 20.
- Number line: `"numberLine": { "start": 0, "end": 20, "scale": "ones", "marked": 12 }` for 0 to 10 or 0 to 20, or `end` 100 with `scale` `tens`. A marked tick shows ?. Flags A to D sit on an unmarked line and are not tappable. Answers stay as A/B/C/D rows.
- Hundred square window: `"hundredSquare": { "start": 21, "rows": 3, "missing": 25, "highlight": 32 }` shows 3 or 4 rows. Numerals only. Not tappable. Not scrolling.
- Matching sides must use two different representations. Never pair a pile with the same pile. Compare questions use ten frames up to 20 and tens-and-ones above 20, not counting chores.
- Shared phrases (“Correct. Nice!”) live in `copy.ts`, not JSON.

## Map placement (required)

Home is the path map. `buildLevels()` places quests by `` `${pathNode}:${difficulty}` ``.

| Field | Role |
| --- | --- |
| `pathNode` | Node id from `curriculum/maths.md`. **Map key.** |
| `difficulty` | `1` Easy, `2` Medium, `3` Hard. At most one quest per node per difficulty. |
| `curriculumRef` | Same node id (audit only). The map does **not** read this. |

Only setting `curriculumRef` will **not** put the quest on the map. Everything is open; stars do not gate. Three levels per node is a core concept.

Curriculum source of truth: `curriculum/maths.md` (45 categories, 124 nodes). Do not rename ids or invent a second set of categories. Before adding a quest, follow `curriculum/audit.md`.

## Writing for children

Every child-facing string (`copy.ts`, activity JSON, component words) must follow this. Agent-only docs may use dashes.

- **UK English.** *maths*, *practise* (verb), *metre*, *colour*, *number bonds*, *times tables*, *Year 2*.
- **Full kid sentences.** Everyday words. Present tense. One idea per sentence. The stem must make sense if a parent reads it aloud with no picture context. Prefer a clear short sentence over a clipped fragment.
- **No fancy punctuation.** No em dashes (`—`) or en dashes (`–`) as punctuation. No semicolons. No colons to glue two ideas. Full stops only.
- **Never say to a child:** mastery, curriculum, ability, emerging, greater depth, distractor, node, percentage (unless the node is percentages), *fact*, *true*.

| Bad | Good |
| --- | --- |
| Correct — nice! | Correct. Nice! |
| How many ducks? | How many ducks can you see? |
| Sam needs 5 ducks. Which group? | Which group has 5 ducks? |
| How many left? | How many are left? |

**Missing-part stems** (any kind): `What do you need to add to {n} to make {total}?`. **Result stems** (`a + b = __`): `What is {a} + {b}?` / `What is {a} take away {b}?`. Prefer bond wording for addition blanks inside a sum. Pictured totals: `How many can you see in all?`

## Established wording and interactions

- Feedback explains why the answer is correct, after both correct and incorrect answers. Explanations stay under 20 words and name a known mix-up where there is one. Never put counting or tapping instructions in `explanation`. Hints suggest a method without giving the answer.
- Pedagogy rules in `QUALITY.md` fail `npm run check:activities`. Reception pickers have 3 options. Year 1 pickers have 4. Year 1 must not say clockwise or anti-clockwise. Every question needs narration. The question speaker and the feedback speaker are 44px. The feedback speaker reads the explanation only after the child has answered.
- Arithmetic answer choices sit below the coloured sum. Choosing a number fills the yellow tile. Use `make-total` for addition bonds and numeric `multiple-choice` for subtraction results. Number answers for young kids use A/B/C/D (`count-objects` or `multiple-choice`), not typed fill-blank.
- Keep visible subtraction wording as “take away” and the equation symbol as `−`. Update narration and shared prompt defaults together when changing wording.
- Optional `BondDemonstration` appears only after a missed addition make-total or part-whole question. It never changes marks or stars.
- Current intro and pathway design decisions live in `DESIGN.md`. Preserve the simple Pip intro, topic-specific doodle backgrounds, centred name plates and subtle dividers. Section backgrounds do not fade or overlap.

## Hash routes

`HashRouter` (GitHub Pages). Live: `https://2ne.github.io/ChatGPT/primary-learn/`. Review: `#/question-bank`. Paths: `/onboarding`, `/pathway`, `/activity/:id`, `/question-bank`.

## Out of scope unless asked

Login, cloud sync, teacher dashboards, payments, changing localStorage keys, English or other subjects, rewriting the whole curriculum in one change, changing the Pages base path without the deploy workflow.
