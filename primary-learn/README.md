# Primary Maths

Rapid prototype of an interactive UK **primary maths** pathway for children. English or other subjects might come later as separate work.

Learners pick a name and avatar, follow a path of levels, and play **Easy / Medium / Hard** on each node. Everything is open. The path suggests an order but never blocks. Mastering all three means the child can do that skill. Marks live in **localStorage** on this device (no accounts). Browser-only storage is intentional while prototyping — reset is easy.

## Live prototype

https://2ne.github.io/ChatGPT/primary-learn/

## Status

15 quests across five complete Easy / Medium / Hard nodes: Count to 5, See numbers to 5, Make numbers to 5, Bonds to 5 and Number bonds to 10. Includes local learner profiles, an open path map, shared question runner and device-only progress. See `curriculum/NEXT.md` for the current content priorities.

**Priority:** improve existing activities (especially the missing Medium / Hard levels) before expanding to new nodes.

Agent instructions in `AGENTS.md` (slim core), playbook `docs/agent/ADD-ACTIVITY.md`, and `QUALITY.md` define how to add quests. Deep detail lives in `docs/agent/REFERENCE.md`. What to build next: `curriculum/NEXT.md`.

## Rapid prototype

Agents work directly on `main`. No pull requests. No test suites. No linting required. `npm run build` in this folder is the ship check. For JSON-only work, iterate with `npm run check:activities` first.

## What it does

- Asks for a child’s name and woodland avatar on first visit
- Welcomes children into each quest with a centred card, Pip, clear question count and time, and one Start quest button. The layout adapts to phones and desktops.
- Shows the maths path as a winding road of numbered levels (not a free-choice list)
- Each map section has a faint repeating maths doodle wallpaper matched to its curriculum topic. Numbers, shapes, fractions, clocks, rulers and graphs use lightweight SVG backgrounds in the existing year colours, behind the road and controls.
- Each level opens a sheet with Easy / Medium / Hard. 6 out of 10 earns a star. Stars show progress. They do not gate the path.
- Runs interactive question kinds (tap-to-count, build a set, part-whole make-total, cherry part-whole, pick-pair tiles, multiple choice, multi-select, fill blank, ordered, match pairs)
- A **speaker** after the question reads the question only (Web Speech API, UK female teacher voice) and highlights words as they are spoken
- Ten questions, then a star result. A miss shows a short correction and moves on. No retry loop
- Incorrect feedback separates the correct answer, number order or matching pairs from the teaching explanation. On addition `make-total` and `part-whole` questions, an optional **Show me** demonstration reveals each part, then the whole. It uses the question's actual numbers and pictures, supports zero, and never changes the score. Children advance it with buttons, with no automatic motion or spoken answers.
- Shared wording uses natural UK English. Quest facts use the actual question count. Hints suggest a strategy instead of stating the answer, and number inputs accept number words as well as digits.
- Feedback explanations state why an answer is correct, including after a miss. Counting instructions belong in hints, not in post-answer feedback.
- Addition and subtraction sums use coloured number tiles and selectable answer buttons. Selecting an answer fills the yellow tile, just like number bonds. Counting and word-entry questions retain their existing inputs.
- Missing-part addition asks “What do you need to add to 4 to make 5?” consistently across question kinds and read-aloud text. Subtraction prompts say “take away”, while the sum tiles keep the minus sign.
- Saves best stars and best score per Easy / Medium / Hard. Nine stars on a node awards a gold cup

## Adding activities

Follow **`docs/agent/ADD-ACTIVITY.md`** and **`QUALITY.md`** strictly. Each activity is built once — write `difficultyRamp` first, climb Easy < Medium < Hard, and run the self-review checklist before you push.

1. Add `src/data/activities/<kebab-id>.json` (pure data — no JSX). See `activity.schema.json`. No hand import; the registry auto-loads and validates.
2. Set `pathNode` to the `curriculum/maths.md` node id and `difficulty` to `1` / `2` / `3` (Easy / Medium / Hard). The map looks up `${pathNode}:${difficulty}` — `curriculumRef` alone will not place the quest
3. Also set `curriculumRef` to that same node id, plus year group(s), ability, subject, type, mastery threshold, `questionCount`, skills, and `difficultyRamp`
4. Default is **10** questions that ramp with no spikes. Longer sets need `extraQuestions.reason`. Pictures are `visual: { item, count }`. Shared phrases live in `src/data/copy.ts`. Optional `randomise` is documented in `docs/agent/REFERENCE.md` — never use it to leave the difficulty band.
5. Run `npm run check:activities`, then `npm run build`.

A new **question kind** is a new component under `src/components/questions/` plus a schema entry — never UI inside a JSON file. Prefer filling Medium / Hard on shipped nodes before adding a new node. See `curriculum/NEXT.md`.

## Design

Visual system is documented in **`DESIGN.md`** (Baloo 2 + Nunito, indigo actions, warm paper, path-map home). Agents must follow it for all UI changes.

## Curriculum map

UK (England) maths pathways and gap tracking live in **`curriculum/`**:

- `curriculum/NEXT.md` — what agents should build next (keep in sync with coverage)
- `curriculum/overview.md` — stages and ages
- `curriculum/maths.md` — the path: 45 categories and 124 nodes, in order
- `curriculum/audit.md` — how to check that path before adding a quest
- `curriculum/coverage.md` — how many nodes are still missing

Each node can hold three quests (Easy / Medium / Hard). See `curriculum/NEXT.md` for the current next missing Easy.

## Stack

- React 19 + TypeScript
- Vite
- React Router (`HashRouter`, so GitHub Pages deep links work)
- Tailwind CSS v4
- Baloo 2 / Nunito

## Commands

Requires Node.js 20 or later.

```bash
npm install
npm run dev
npm run typecheck
npm run build
npm run preview
```

## Key decisions

- **Rapid prototype** — push to `main`, no PRs, no tests, no lint required; build is the check
- **No auth** — profile and progress keys are `primary-path:profile:v1` and `primary-path:progress:v1`. localStorage only, on purpose
- **Primary maths** — the map is `curriculum/maths.md`: 45 categories and 124 nodes in one suggested order. Everything is open. English or other subjects would be separate work, not this app
- **Three levels** — every node has Easy / Medium / Hard. The map uses `pathNode` + `difficulty`. Mastering all three means the child can do it
- **Right first time** — `QUALITY.md` is required. Activities are not rewritten after they ship
- **Speaker** — Web Speech API only (no generated audio); UK female teacher voice; `narration.prompt` is the question only and must never reveal the answer
- **Improve before expanding** — finish and tighten shipped quests before adding new nodes
- **UK framing** — year groups Reception–Year 6 stay on each activity for sequencing, British English, National Curriculum / EYFS maths references
- **Content ≠ UI** — quests are JSON; one `ActivityRunner`; one component per question kind; shared wording in `copy.ts`. Change a phrase or an apple picture once, not 124 times
- **Optional randomise** — playthroughs can swap objects or shuffle choices (`realize.ts`). Counts stay inside the written band. The draw stays for that play
- **Shared runner** — new content is data; after a miss the runner shows a short correction and moves on. Stars come from the 10-question score
- **Pip** — pure-SVG mascot (indigo blob, sprout, star badge) with CSS moods. No WebGL / Three.js
- **GitHub Pages** base path `/ChatGPT/primary-learn/` (see repo deploy workflow)
- **Routes** — `/onboarding`, `/pathway`, `/activity/:id`, `/question-bank` via `HashRouter` (e.g. `https://2ne.github.io/ChatGPT/primary-learn/#/activity/count-to-5`). Hash routing is the Pages strategy: this repo hosts several apps, so a nested `404.html` would not catch `/primary-learn/pathway`. No profile goes to onboarding. Unknown quests go back to the path with a short notice. Path changes scroll to the top.
- **Question bank** — teacher/agent review at `#/question-bank` (`https://2ne.github.io/ChatGPT/primary-learn/#/question-bank`). Lists every activity with live question UI, answers shown, no progress saved. No onboarding required.

## Limitations

- Count to 5 ships Easy / Medium / Hard on node 1. Number bonds to 10 is Easy only on node 13.
- Progress does not sync across devices or browsers
- Match-pairs is tap-to-match (prompt, then partner), not drag-and-drop
- Ordered questions use up/down controls rather than drag
