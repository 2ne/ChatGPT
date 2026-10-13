# Primary Path

Interactive UK primary e-learning for children. Learners pick a name and avatar, practise curriculum activities, and build mastery — with marks stored in **localStorage** on this device (no accounts).

## Live prototype

https://2ne.github.io/ChatGPT/primary-learn/

## Status

Foundation release: profile onboarding, activity catalogue, shared interactive runner, progress/mastery tracking, and a sample **Year 1 number bonds to 10** activity. Agent instructions in `AGENTS.md` define how to add further curriculum activities.

## What it does

- Asks for a child’s name and woodland avatar on first visit
- Lists learning activities with subject, year group, ability band and type
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

UK (England) pathways and gap tracking live in **`curriculum/`**:

- `curriculum/overview.md` — stages and subjects  
- `curriculum/maths.md` / `english.md` / `science.md` — building-block order  
- `curriculum/coverage.md` — what the app already covers vs missing  

Start from the earliest missing prerequisite, not the flashiest topic.

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
- **UK framing** — year groups Reception–Year 6, British English, National Curriculum / EYFS references on each activity
- **Shared runner** — new content is data; the runner teaches after misses and re-asks until the set is solid. The saved mark is the first try
- **Living logo** — Pip in the header (and a larger one on the finish screen) is a small Three.js face with eyes and no ring. The name screen shows the child’s avatar, not Pip. SVG if WebGL or reduced motion is unavailable. Question cards stay flat
- **GitHub Pages** base path `/ChatGPT/primary-learn/` (see repo deploy workflow)

## Limitations

- Only one sample activity ships in this foundation
- Progress does not sync across devices or browsers
- Match-pairs is tap-to-match (prompt, then partner), not drag-and-drop
- Ordered questions use up/down controls rather than drag
