# Primary Maths

Interactive UK primary maths for children. Learners pick a name and avatar, practise maths quests, and build mastery — with marks stored in **localStorage** on this device (no accounts). Other subjects are out of scope.

## Live prototype

https://2ne.github.io/ChatGPT/primary-learn/

## Status

Foundation release: profile onboarding, a single maths quest list (no subject or year filters), shared interactive runner, progress/mastery tracking, and a sample **Year 1 number bonds to 10** quest. Agent instructions in `AGENTS.md` define how to add further maths quests.

## What it does

- Asks for a child’s name and woodland avatar on first visit
- Lists maths quests by title, with stars and a best score
- Runs interactive question kinds (multiple choice, multi-select, fill blank, ordered, match pairs)
- Retries missed questions in a calm mastery loop, without changing the first-try mark
- Saves best score and mastery per activity in localStorage

## Adding activities

Follow **`AGENTS.md`** strictly. In short:

1. Add `src/data/activities/<kebab-id>.ts` exporting a typed `Activity`
2. Register it in `src/data/activities/index.ts`
3. Fill required metadata: year group(s), ability, subject, type, curriculum ref, mastery threshold, skills
4. Prefer 10–16 interactive questions with explanations aimed at mastery

Do not invent a parallel format or hard-code one-off activity screens in `App.tsx`.

## Design

Visual system is documented in **`DESIGN.md`** (Khan Academy / Wonder Blocks–inspired: Lato, blue actions, flat off-white surfaces, strict 8px spacing). Agents must follow it for all UI changes.

## Curriculum map

UK (England) maths pathways and gap tracking live in **`curriculum/`**:

- `curriculum/overview.md` — stages and ages  
- `curriculum/maths.md` — the path: 45 categories and 124 quest nodes, in order  
- `curriculum/audit.md` — how to check that path before adding a quest  
- `curriculum/coverage.md` — how many nodes are still missing  

The next quest to build is the first `missing` node (`eyfs-subitise-5`). Do not skip ahead.

## Stack

- React 19 + TypeScript
- Vite
- Tailwind CSS v4
- Lato / Noto Sans

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

- **No auth** — profile and progress keys are `primary-path:profile:v1` and `primary-path:progress:v1`
- **Maths only** — the quest map is `curriculum/maths.md`: 45 categories and 124 nodes in one locked order, audited with `curriculum/audit.md`
- **UK framing** — year groups Reception–Year 6 stay on each activity for sequencing, British English, National Curriculum / EYFS maths references
- **Shared runner** — new content is data; the runner teaches after misses and re-asks until the set is solid. The saved mark is the first try
- **Pip** — pure-SVG mascot (indigo blob, sprout, star badge) with CSS moods in the header, feedback reactions, and the finish screen. No WebGL. Question cards carry a rainbow ribbon and a numbered prompt badge
- **GitHub Pages** base path `/ChatGPT/primary-learn/` (see repo deploy workflow)

## Limitations

- Only two quests ship so far: `count-to-5` (node 1) and `number-bonds-to-10` (node 13)
- Progress does not sync across devices or browsers
- Match-pairs is tap-to-match (prompt, then partner), not drag-and-drop
- Ordered questions use up/down controls rather than drag
