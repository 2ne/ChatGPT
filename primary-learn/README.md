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
- Retries missed questions in a calm mastery loop
- Saves best score and mastery per activity in localStorage

## Adding activities

Follow **`AGENTS.md`** strictly. In short:

1. Add `src/data/activities/<kebab-id>.ts` exporting a typed `Activity`
2. Register it in `src/data/activities/index.ts`
3. Fill required metadata: year group(s), ability, subject, type, curriculum ref, mastery threshold, skills
4. Prefer 10–16 interactive questions with explanations aimed at mastery

Do not invent a parallel format or hard-code one-off activity screens in `App.tsx`.

## Stack

- React 19 + TypeScript
- Vite
- Tailwind CSS v4
- lucide-react (available for icons as the catalogue grows)

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
- **Shared runner** — new content is data; the runner teaches after misses and re-asks until the set is solid
- **GitHub Pages** base path `/ChatGPT/primary-learn/` (see repo deploy workflow)

## Limitations

- Only one sample activity ships in this foundation
- Progress does not sync across devices or browsers
- Match-pairs uses a simple select UI (fine for now; richer drag-and-drop can come later)
