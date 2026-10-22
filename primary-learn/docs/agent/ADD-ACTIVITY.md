# Add or edit a quest (one screen)

Build once. Right first time. Do not invent a parallel format.

## Steps

1. Read [curriculum/NEXT.md](../../curriculum/NEXT.md) (or the node James named).
2. Open only that node in [curriculum/maths.md](../../curriculum/maths.md) (search the id). Teach those **Covers** bullets only. Follow [curriculum/audit.md](../../curriculum/audit.md) if unsure.
3. Copy the nearest sibling JSON (same node Easy / Medium / Hard), else gold standard `src/data/activities/count-to-5.json`, to `src/data/activities/<kebab-id>.json`.
4. Write `difficultyRamp.within` and `.versus` **first**. List 10 question jobs in order. Check for spikes. Then write the JSON.
5. Set `pathNode` + `difficulty` (`1`/`2`/`3`) + matching `curriculumRef`. Set `questionCount` to `questions.length`.
6. Drop the file in `src/data/activities/`. **No hand import.** Auto-registry runs `validateActivity`.
7. Run the self-review checklist in [QUALITY.md](../../QUALITY.md).
8. `npm run check:activities`, then `npm run build`. Push to `main` when green.

Do **not** create a `.tsx` for the quest. Do **not** open the app unless James asked. Review URL if needed: `https://2ne.github.io/ChatGPT/primary-learn/#/question-bank`.

## Musts (short)

- Exactly 10 questions unless `extraQuestions.reason` (up to 20).
- Only kinds in `QUESTION_KINDS` (`src/types/activity.ts`). Prefer three or more kinds; no long same-kind streaks unless fluency.
- Every item has teaching `explanation`. Hints never give the answer. No retry loop.
- `narration.prompt` when `+`, `−`, `=`, or `?` would mangle speech. Spoken text is the question only.
- Pictures: `visual: { item, count }` — never emoji in JSON. Shared phrases stay in `src/data/copy.ts`.
- Child-facing wording: [AGENTS.md](../../AGENTS.md) **Writing for children**. Stem templates: [QUALITY.md](../../QUALITY.md).

## After it ships

Update [curriculum/coverage.md](../../curriculum/coverage.md), node status in `maths.md`, and [curriculum/NEXT.md](../../curriculum/NEXT.md) if the catalogue changed. Deep detail: [REFERENCE.md](./REFERENCE.md).
