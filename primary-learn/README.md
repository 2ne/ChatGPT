# Primary Maths

Rapid prototype of an interactive UK primary learning pathway for children. The long-term vision is **every UK curriculum subject**, start to finish. **Maths is the current phase** — it is where we started, not a permanent limit.

Learners pick a name and avatar, follow a locked path of levels, and play **Easy / Medium / Hard** on each node. Mastering all three means the child can do that skill. Marks live in **localStorage** on this device (no accounts). Browser-only storage is intentional while prototyping — reset is easy.

## Live prototype

https://2ne.github.io/ChatGPT/primary-learn/

## Status

Foundation release: profile onboarding, a locked path map (`PathMap` + `LevelSheet`), shared interactive runner, progress/mastery tracking, and two Easy quests (`count-to-5` on node 1, `number-bonds-to-10` on node 13). Medium and Hard are not written yet.

**Priority:** improve existing activities (especially the missing Medium / Hard levels) before expanding to new nodes or subjects.

Agent instructions in `AGENTS.md` plus the quality guide in `QUALITY.md` define how to add quests so they appear on the map and are right first time.

## Rapid prototype

Agents work directly on `main`. No pull requests. No test suites. No linting required. `npm run build` in this folder is the check.

## What it does

- Asks for a child’s name and woodland avatar on first visit
- Shows the maths path as a winding road of numbered levels (not a free-choice list)
- Each level opens a sheet with Easy / Medium / Hard; later levels stay locked until the previous Easy is mastered
- Runs interactive question kinds (multiple choice, multi-select, fill blank, ordered, match pairs)
- **Hear it** reads the question, choices and feedback (browser `speechSynthesis`, en-GB) and highlights words as they are spoken
- Retries missed questions in a calm mastery loop, without changing the first-try mark
- Saves best score and mastery per activity in localStorage

## Adding activities

Follow **`AGENTS.md`** and **`QUALITY.md`** strictly. Each activity is built once — write `difficultyRamp` first, climb Easy < Medium < Hard, and run the self-review checklist before you push.

1. Add `src/data/activities/<kebab-id>.json` (pure data — no JSX). See `activity.schema.json`.
2. Import it in `src/data/activities/index.ts` and run `validateActivity` (invalid JSON fails the build).
3. Set `pathNode` to the `curriculum/maths.md` node id and `difficulty` to `1` / `2` / `3` (Easy / Medium / Hard). The map looks up `${pathNode}:${difficulty}` — `curriculumRef` alone will not place the quest
4. Also set `curriculumRef` to that same node id, plus year group(s), ability, subject, type, mastery threshold, `questionCount`, skills, and `difficultyRamp`
5. Prefer 10–16 interactive questions that ramp with no spikes. Pictures are `visual: { item, count }`. Shared phrases live in `src/data/copy.ts`.

A new **question kind** is a new component under `src/components/questions/` plus a schema entry — never UI inside a JSON file. Prefer filling Medium / Hard on shipped nodes before adding a new node.

## Design

Visual system is documented in **`DESIGN.md`** (Baloo 2 + Nunito, indigo actions, warm paper, path-map home). Agents must follow it for all UI changes.

## Curriculum map

UK (England) maths pathways and gap tracking live in **`curriculum/`**:

- `curriculum/overview.md` — stages, ages, and product vision
- `curriculum/maths.md` — the path: 45 categories and 124 nodes, in order
- `curriculum/audit.md` — how to check that path before adding a quest
- `curriculum/coverage.md` — how many nodes are still missing

Each node can hold three quests (Easy / Medium / Hard). The next *new* node is the first `missing` one (`eyfs-subitise-5`), but write Medium / Hard for `eyfs-count-5` first.

## Stack

- React 19 + TypeScript
- Vite
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
- **Maths first** — the current map is `curriculum/maths.md`: 45 categories and 124 nodes in one locked order. Other subjects are a later phase
- **Three levels** — every node has Easy / Medium / Hard. The map uses `pathNode` + `difficulty`. Mastering all three means the child can do it
- **Right first time** — `QUALITY.md` is required. Activities are not rewritten after they ship
- **Hear it** — Web Speech API, en-GB, optional `narration` per question (string or `{ text, audioSrc }`)
- **Improve before expanding** — finish and tighten shipped quests before adding new nodes
- **UK framing** — year groups Reception–Year 6 stay on each activity for sequencing, British English, National Curriculum / EYFS maths references
- **Content ≠ UI** — quests are JSON; one `ActivityRunner`; one component per question kind; shared wording in `copy.ts`. Change a phrase or an apple picture once, not 124 times
- **Shared runner** — new content is data; the runner teaches after misses and re-asks until the set is solid. The saved mark is the first try
- **Pip** — pure-SVG mascot (indigo blob, sprout, star badge) with CSS moods. No WebGL / Three.js
- **GitHub Pages** base path `/ChatGPT/primary-learn/` (see repo deploy workflow)

## Limitations

- Only two Easy quests ship so far: `count-to-5` (node 1) and `number-bonds-to-10` (node 13). No Medium or Hard yet
- Progress does not sync across devices or browsers
- Match-pairs is tap-to-match (prompt, then partner), not drag-and-drop
- Ordered questions use up/down controls rather than drag
