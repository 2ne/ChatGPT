# Activity quality guide

**Each activity is built once and must be right first time.** The owner will not rework your questions. Follow this file and `AGENTS.md` before you write a single stem.

Gold-standard quest to copy: `src/data/activities/count-to-5.json` (Easy, node `eyfs-count-5`). Content is JSON only — no JSX.

## Before you write questions

1. Open `curriculum/maths.md` for the node. Teach those **Covers** bullets only.
2. Write `difficultyRamp.within` and `difficultyRamp.versus` **first**. If you cannot say how Easy < Medium < Hard, you are not ready to write items.
3. List the **10** question jobs in order (one line each). Check the list for spikes before you draft stems. Only go longer with `extraQuestions.reason`.
4. Then write the data file.

## Difficulty dimensions (use all of these)

Change **one or two** dimensions at a time. Never jump all of them at once.

| Dimension | Easy | Medium | Hard |
| --- | --- | --- | --- |
| Number range | Smallest range that still teaches the node (e.g. to 5, to 10) | Same idea, slightly wider or less tidy numbers | Full range the node allows; awkward numbers (0, near-doubles, near-tens) |
| Steps | One step, one idea | One step plus a tiny extra (order reversed, picture then numeral) | Two steps the node actually teaches — not a new topic |
| Representation | Objects / emoji groups the child can touch-count | Mix of pictures and numerals | Numerals, words, or a short story. No count-all objects unless the node is counting |
| Scaffolding | Hint on the first third of items; stem names the strategy (“count each one”) | Hints only on the last third, or none | No hints unless the item is a new representation |
| Question kind | Tap-to-count, build-set, multiple-choice or fill-blank | Mix two or three kinds | Include multi-select, ordered, match, build-set, or a one-step story if the node supports it |

**Easy < Medium < Hard** on the same node must be obvious if you put the three quests side by side. Medium is not “Easy plus one trick question”. Hard is not a different topic.

### Ramp inside one quest

Questions must climb **gradually** from first to last.

- First 2–3 items: the easiest legal version of the skill (smallest numbers, objects, one step).
- Middle: typical “expected” items.
- Last 2–3: stretch **within this level** — still Easy if this is the Easy quest.
- **No spikes:** do not put a two-step story next to “how many? ⭐”. Do not drop back to a trivial item after a harder one.
- Change one dimension per step. Example: 3 objects → 1 object → 2 objects is a wobble; 1 → 2 → 3 → 4 → 5 then sequence is a ramp.

Write that plan in `difficultyRamp.within`. A reviewer should be able to tick the question list against that paragraph.

## Child-friendly wording

Reading age follows the year group, not the adult who is coding.

| Year | Sentence rule |
| --- | --- |
| Reception | One short sentence. About 4–8 words plus a picture. Present tense. “How many apples?” |
| Year 1 | One sentence, or two if the second is the equation. No subordinate clauses. |
| Year 2–3 | Still short. One idea. A name is fine (“Sam has 10 apples”). |
| Year 4–6 | Can use a precise maths word the node teaches (*factor*, *multiple*). Still no waffle. |

**Never say to a child:** mastery, curriculum, ability, emerging, greater depth, distractor, node, percentage (unless the node is percentages).

Use British English: *maths*, *practise* (verb), *metre*, *colour*, *number bonds*, *times tables*, *Year 2* (not 2nd grade). Follow **Writing for children** in `AGENTS.md`: short sentences, no em or en dashes as punctuation, no semicolons, one idea per sentence.

### Stem templates (copy these)

Keep the same shape inside a quest so the child learns the maths, not a new sentence each time.

| Kind | Template |
| --- | --- |
| multiple-choice count | `How many {items}?` + picture (`{item}` / `{items}` if the quest randomises objects) |
| build-set | `Make a group of {count} {items}.` |
| multiple-choice next | `What comes next? 1, 2, 3, …` |
| multiple-choice missing | `Which number goes with {n} to make {total}?` |
| fill-blank bond | Prompt: `Complete the number bond.` Prefix/suffix: `{a} +` / `= {total}` |
| multi-select | `Tap every {pair/group} that {rule}.` |
| ordered | `Put the numbers in counting order. Start with the smallest.` |
| match-pairs | `Match each {left} to {right}.` |
| story (Y1+) | `{Name} has {n} {things} and {action}. How many {are left / in all}?` |

Do not invent a clever riddle. Do not write “Can you figure out…” or “Look carefully!”.

## Distractors

Wrong options must be **plausible mistakes**, not random.

For each item, name the misconception (in your head, or in a comment):

- Off by one (counted the start number twice, or missed the last object)
- Used the wrong operation (added instead of subtracted)
- Chose a number that appears in the stem
- Doubled the wrong part
- Counted groups instead of objects (or the reverse)

Rules:

- 3 or 4 options for multiple-choice. One correct.
- Multi-select: 2 correct, 2 wrong, unless the node needs otherwise. Never “all of them” unless that is the taught idea.
- Do not use joke options, huge outliers, or two options that are both acceptable.
- Fill-blank: put number words in `acceptedAnswers` for Reception and Year 1 (`"4"`, `"four"`).

## Feedback and hints

Every question needs `explanation`. Hints are optional and must follow the scaffolding row above.

- **Hint:** a strategy, never the answer. “Point to each apple and say a number.”
- **Explanation:** state the correct idea in one or two short sentences. Include the count or the bond. “Touch each apple once and count: 1, 2, 3. There are 3 apples.”
- After a miss the child sees this on screen, after “It was 4.” Write it so it teaches, not scolds. No “you forgot”.

## Variety

- Use at least **three question kinds** in a 10-question quest.
- Do not run the same kind more than three times in a row unless the ramp is deliberately fluency (times tables).
- Mix pictures and numerals as the ramp says — do not hide all the pictures at the back as a surprise.
- Names, objects and stories should feel like the same classroom, not a new theme every item.

## No ambiguous answers

- One marked correct answer (or a complete `correctIds` / `correctOrder` / pair list).
- Fill-blank: every reasonable spelling you will accept is in `acceptedAnswers`. Normalise in your head (trim, lower case). Do not accept a sentence.
- Match-pairs: each right-hand target is unique.
- If a child could defend a second option, rewrite the stem.

## Narration (read aloud)

Pre-readers tap the **speaker icon** after the question. Speech uses `question.narration.prompt` and falls back to the visible prompt.

**Question only.** Never read the answer, answer options, how many pictures are on screen, a hint, or the explanation. Those leak the mark to a child who cannot yet read.

Write `narration.prompt` whenever the stem has operators or symbols a voice will mangle (`7 + ? = 10`, `10 − 4 =`).

- Say numbers and signs in words: “7 plus what equals 10?”, “10 take away 4 equals what?”
- Same meaning as the on-screen prompt. Do not add “count the three pictures” or option lists.
- `narration.prompt` is Web Speech text only. Do not add audio files.

## Gold-standard example

Copy the shape of this item from `count-to-5.json`. It is Easy, first third of the ramp, one step, objects as data (not emoji in the prompt), a hint, a teaching explanation, question-only narration, and an off-by-one distractor set.

```json
{
  "kind": "count-objects",
  "id": "c5e-count-1",
  "prompt": "How many {items}?",
  "visual": { "item": "star", "count": 1 },
  "randomise": { "shuffleOptions": true },
  "options": [
    { "id": "a", "label": "1" },
    { "id": "b", "label": "2" },
    { "id": "c", "label": "3" },
    { "id": "d", "label": "4" }
  ],
  "correctId": "a",
  "hint": "Tap the {item} and say one.",
  "explanation": "Tap the {item} once. One thing counts as 1.",
  "narration": { "prompt": "How many {items}?" }
}
```

`randomise` on this Easy item swaps the picture (stars → bananas / apples / cars) from the activity pool and shuffles the tap targets. The **count stays 1**. Do not add `"count": { "min", "max" }` here — that would wobble the 1-2-3-4-5 ramp. Pictures light up and say the next number when tapped. See **Optional randomisation** in `AGENTS.md`.

The rest of that quest then moves to 2 and 3 objects, types 4, builds a group of 5, then the count sequence, then numerals — see `difficultyRamp.within` at the top of the file.

## Self-review checklist (run before you push)

Work through this on the finished file. If any box fails, fix it. Do not push a “nearly”.

- [ ] `pathNode` + `difficulty` place it on the correct map row; `curriculumRef` matches the node id
- [ ] `difficultyRamp.within` and `.versus` are filled and match the actual question order
- [ ] Easy < Medium < Hard is obvious (or the missing levels are described, not faked in this file)
- [ ] Questions climb with no spike and no drop-back to a trivial item
- [ ] Only this node’s **Covers** bullets are taught
- [ ] Year group reading age; British English; stem templates reused
- [ ] Every item has a teaching `explanation`; hints match the scaffolding plan
- [ ] Distractors are named misconceptions, not random
- [ ] No ambiguous correct answer; fill-blank accepts number words where needed
- [ ] At least three question kinds in a 10-question quest; same kind not overused
- [ ] `narration.prompt` written for `+`, `−`, `=`, `?`. Spoken text is the question only — no answer, options, or pictured counts
- [ ] Exactly 10 questions unless `extraQuestions.reason` justifies a longer set. Stars use `STAR_SCORE` (6–7 / 8–9 / 10). No retry loop.
- [ ] JSON only (no JSX). Registered in `src/data/activities/index.ts` via `validateActivity`
- [ ] Pictures use `visual: { item, count }`, not emoji in the prompt
- [ ] If `randomise` is on, stems use `{item}` / `{items}` (and `{count}` if the count can move). The draw stays inside this level — Easy Count to 5 does not randomise how many
- [ ] No shared phrases (“Correct. Nice!”, “Need a hint?”) copied into the JSON. Those live in `src/data/copy.ts`
- [ ] Child-facing wording follows **Writing for children** in `AGENTS.md` (UK English, short sentences, no em/en dashes as punctuation)
- [ ] `npm run build` in `primary-learn/` succeeds
- [ ] You opened the quest in the app: the speaker after the question reads the question only, a miss shows the explanation, the map row is correct

## Elevating written sentences (later)

Already shipped: **speaker icon** after the question and **word highlighting** as it is read.

Ideas to add later — do not build them unless asked:

- Illustrated stems (a picture slot beside the words, not only emoji in the prompt)
- Stronger shared templates so every count / bond / story stem looks the same
- Karaoke highlighting that wraps lines more neatly on small screens
