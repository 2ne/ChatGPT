# Activity quality guide

**Each activity is built once and must be right first time.** The owner will not rework your questions. Follow this file and the playbook in `docs/agent/ADD-ACTIVITY.md` before you write a single stem. Next work: `curriculum/NEXT.md`.

Gold-standard quest to copy: `src/data/activities/count-to-5.json` (Easy, node `eyfs-count-5`). Content is JSON only — no JSX. Drop the file in `src/data/activities/`; it auto-registers.

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
| Representation | Objects / emoji groups the child can touch-count | Mix of pictures and numerals | Numerals or a short story. Number-word reading and spelling only when the node explicitly teaches them. Pictures allowed for stories, not tappable, rows of 10 for totals over 10 |
| Scaffolding | Hint on the first third of items; stem names the strategy (“count each one”) | Hints only on the last third, or none | No hints unless the item is a new representation |
| Question kind | Tap-to-count, build-set, make-total fill-slots, pick-pair with dots, part-whole, multiple-choice or fill-blank | Mix two or three kinds, including make-total fill-slots or sum-only, pick-pair with harder numbers, or part-whole | Include make-total sum-only, pick-pair with harder numbers (still with dots), part-whole with a missing whole, multi-select, ordered, match, or a one-step story if the node supports it |

**Easy < Medium < Hard** on the same node must be obvious if you put the three quests side by side. Medium is not “Easy plus one trick question”. Hard is not a different topic. Hard must add a new kind of thinking, not only bigger numbers. Say that kind of thinking in `difficultyRamp.versus`.

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
| Reception | One clear sentence plus a picture. Present tense. Full question, not a fragment. “How many apples can you see?” |
| Year 1 | One sentence, or two if the second is the equation. No subordinate clauses. |
| Year 2–3 | Still short. One idea. A name is fine (“Sam has 10 apples”). |
| Year 4–6 | Can use a precise maths word the node teaches (*factor*, *multiple*). Still no waffle. |

**Sentences must make sense to kids.** Do not clip the verb or the ask. A parent reading aloud with no extra help should understand the job.

**Never say to a child:** mastery, curriculum, ability, emerging, greater depth, distractor, node, percentage (unless the node is percentages), *fact*, *true* (do not write `Tap every fact that is true`).

Use British English: *maths*, *practise* (verb), *metre*, *colour*, *number bonds*, *times tables*, *Year 2* (not 2nd grade). Follow **Writing for children** in `AGENTS.md`: short sentences, no em or en dashes as punctuation, no semicolons, one idea per sentence.

**Year vocabulary.** *Clockwise* and *anti-clockwise* are Year 2 words. Year 1 uses full, half, quarter and three-quarter turns. Show a clock-hand picture when the child needs a direction. Left and right are fine for Year 1 position.

### Stem templates (copy these)

Keep the same shape inside a quest so the child learns the maths, not a new sentence each time.

| Kind | Template |
| --- | --- |
| multiple-choice count | `How many {items} can you see?` + picture (`{item}` / `{items}` if the quest randomises objects). Same stem for fill-blank counts. Fingers: `How many fingers can you see?`. Subitise stems may set `flashMs` and `layout` (`dice`, `five-frame`, `fingers`, `hidden`). Picture groups still use the same cream tiles; no empty frame cells. |
| conceptual subitise | `How many can you see in all?` with two pictured parts (`visual` + `extras`, `layout` `row`) and usually `flashMs`. |
| hidden quantity | `How many {items} are under the cup?` with `layout` `hidden` and `flashMs`. |
| pick a group | `Which group has {n} {items}?` (single choice). Multi-select: `Which groups have {n} {items}?` or `Tap every group that has {n} {items}.` Do not write `Which group?` alone. |
| compare groups | Must name what is compared. Tens and ones: `Which group shows the smaller number?` / `Which group shows the bigger number?` / `Which group shows the smallest number?`. Compare the total number, not how many pieces you can see. Ten frames and objects: name the object (`Which group has fewer stars?` / `Which group has more {items}?` / `Which group has fewer than 6 apples?`). Same: `Tap the two groups that have the same number of {items}.` Order: `Put the groups of {items} in order, from fewest to most.` Never `Which group has fewer?` or `Which group has the fewest?` alone. |
| pick an amount | Number shown, tap the matching group: `Tap the {items} that match the number below.` plus `numeral` (digit on the card). Optional `numeralLabel` only when the card must show a number word. Four picture cards, one correct count, three near misses. Do not use match-pairs for this. |
| light story | `{Name} has {n} {items} and {action}. How many are left?` / `How many {items} does he have now?` — one step, same numbers as the node. Pictures must show the object named in the text, with matching counts (one emoji; no mixed `extras`). Join stories set `visual.count` (start) and `visual.added` of the same item. Take-away pictures set `visual.count` (start) and `visual.removed` (last N on light red tiles). |
| build-set | `Make a group of {count} {items}.` |
| multiple-choice next | `What number comes next? 1, 2, 3, ?` Explanation: `{n} comes after {n-1}.` |
| multiple-choice missing | `What do you need to add to {n} to make {total}?` |
| fill-blank result | Blank is the answer at the end (`{a} + {b} =` / `{a} − {b} =`). Prompt: `What is {a} + {b}?` / `What is {a} take away {b}?`. Kind generates this from prefix/suffix so JSON cannot drift. Spoken: `What is five take away two?`. Never `What is the missing number?` when the blank is the final result. Same stem if another kind shows a bare equation (`5 − 3 =`). |
| fill-blank bond | Blank is a part inside the sum (`{a} +` / `= {total}`). Prompt: `What do you need to add to {n} to make {total}?`. |
| fill-blank missing | Blank is a part inside a take-away (`__ − 2 = 3`, `5 − __ = 3`) or a hole in a sequence. Prompt: `Which number is missing?` For a count sequence, put the numbers in the stem: `Which number is missing? 1, 2, _, 4, 5`. Prefer the bond wording above for addition. |
| multiple-choice sequence | `Which number is missing? 1, 2, _, 4, 5` (or `What number comes next? 1, 2, 3, ?`). Do not say gap. |
| make-total | Missing part (fill-slots or sum-only): `What do you need to add to {n} to make {total}?`. Empty slot label is `Add` (no item name). Never `5 is 2 and ?` or `5 = ? + 2`. Sum-only totals: `What is {a} + {b}?` (subtract: `What is {a} take away {b}?`). The kind generates this from the numbers on screen; JSON may override. Spoken: `What is one plus one?` / `What is five take away two?`. Pictured totals: `How many can you see in all?` (only if pictures are shown). Optional `slotCount` on fill-slots (default missing + 2). Never use pick. |
| pick-pair | `What two numbers make {total}?`. Always 4 tiles and exactly one pair. No duplicate distractors. Medium is harder numbers, not more tiles. Set `showDots`. Finding every pair is `match-pairs`. |
| part-whole | Missing part: `What do you need to add to {known} to make {whole}?`. Missing whole: `What do {a} and {b} make?`. Kind generates this from `parts` / `whole` / `missing`; JSON may override. Spoken uses words. Exactly 3 choices (answer plus two nearby misses). JSON may set `choices` of 3 numbers. One cherry per bond. Do not use match-pairs with `a and b` text for Reception bonds. |
| multi-select | Number sentences: `Select every correct sum.` Never `Tap every fact that is true.` Pictures: `Tap every group that has {n} {items}.` Pairs: `Tap every pair that makes {n}.` Two of a set: `Select the two numbers that are more than {n}.` The stem must say what to do and how many where it helps. Do not add a grey helper line under the question. |
| ordered | `Put the numbers in order, from smallest to biggest.` Explanation: `The numbers go 1, 2, 3.` |
| match-pairs | Same thing shown two ways only, and the two sides must never use the same representation. Numeral with ten frame, ten frame with dice, tens-and-ones with numeral, word with number, shape with name. Never picture-to-same-picture. Never next number, missing number, one more or one less. Those are multiple-choice. Prompt `Select the card that matches the {noun}.` Use `number`, `word`, `shape` or `picture`. Number content must say `Select the card that matches the number.` One pair per question. Easy and Medium: 3 choices. Hard: 4 choices in a 2x2 grid. Picture groups use a 5-column grid and shrink tiles so up to 20 objects fit inside the fixed card. Ten frames and tens-and-ones also fit that card. Do not crop the picture. First try only. After Check it, colour the pair with the same `option is-correct` / `option is-wrong` marks as multiple choice. The `numeral` 2x2 amount-pick is still multiple-choice, not matching. Do not write Reception bond items as `5` / `1 and 4`. Use `part-whole`. |
| story (join) | `{Name} has {n} {items}. He gets {m} more. How many {items} does he have now?` One character. Pictures show start + added of the same item. Feedback: `{n} and {m} more makes {total} {items}.` |
| story (take away) | `{Name} has {n} {items} and gives away {m}. How many are left?` Pictures use `visual.count` `{n}` and `visual.removed` `{m}` in one cream strip. The last `{m}` sit on light red tiles with a dashed outline. Colour alone is not enough. Never put an X on removed tiles. |

Do not invent a clever riddle. Do not write “Can you figure out…” or “Look carefully!”. Do not write clipped stems (`How many ducks?`, `Which group?`).

**The prompt must describe exactly what the child sees and does on that screen.** Do not refer to a previous step, a counting-along routine, or tapping when there is nothing to tap. If the screen is a group of bananas and number buttons, write `How many bananas can you see?` not `What number did you get to?` or `Count the bananas.` If the screen is number boxes (`1 + 1 = ?`) with no pictures, write `What is 1 + 1?` not `How many can you see in all?` or `What is the missing number?`. Method belongs in the hint (`Just look.` / `Tap each one.`), not the stem.

## Distractors

Wrong options must be **plausible mistakes**, not random.

For each item, name the misconception (in your head, or in a comment):

- Off by one (counted the start number twice, or missed the last object)
- Used the wrong operation (added instead of subtracted)
- Chose a number that appears in the stem
- Doubled the wrong part
- Counted groups instead of objects (or the reverse)
- Off by one on a ten frame
- Reversed digits on tens and ones (34 vs 43)
- Ignored the ten (18 shown, chose 8)
- Counted the ones only (3 tens and 4 ones, chose 7)

Rules:

- Reception pickers have **3** options. Year 1 pickers have **4**. Never more than 4. (`numeral` 2x2 amount-picks stay at 4.)
- Every wrong option is one named error. At most **one** distractor may copy a number from the stem.
- Do not build 4-option numeric sets as n-1, n+1, n+2. That parks the answer in the middle. Across a quest, the correct number should be the smallest, a middle value, or the largest at roughly equal rates.
- Multi-select: 2 correct, 2 wrong, unless the node needs otherwise. State how many choices to select in the prompt. Use single-choice or pick-pair before introducing multi-select arithmetic. Never “all of them” unless that is the taught idea.
- Do not use joke options, huge outliers, or two options that are both acceptable.
- Fill-blank: put number words in `acceptedAnswers` for Reception and Year 1 (`"4"`, `"four"`).

## Feedback and hints

Every question needs `explanation`. Hints are optional and must follow the scaffolding row above.

- **Hint:** a strategy, never the answer. “Point to each apple and say a number.”
- **Explanation:** teach in under 20 words. Name a known confusion where there is one (counted twice, added instead of take away, reversed digits). Never only restate the answer. This text appears after both correct and incorrect answers. For example, “There are 3 apples. Each one counts once.” Never give instructions such as “Count”, “Tap”, “Look”, “See” or “Stop”. Put strategies and instructions in the hint instead. Explain the correct choices rather than listing every wrong option.
- After a miss the child sees the correct answer under its own label, followed by this explanation. Write it so it teaches, not scolds. No “you forgot”. Do not add shared feedback phrases to the explanation.

## Variety

- Use at least **three question kinds** in a 10-question quest.
- Do not run the same kind more than three times in a row unless the ramp is deliberately fluency (times tables).
- No more than 3 questions with the same stem shape in a quest, and never 4 in a row. Same shape means the same sentence with only the numbers changed.
- No two identical stems plus options in one quest.
- Mix pictures and numerals as the ramp says. Do not hide all the pictures at the back as a surprise.
- Names, objects and stories should feel like the same classroom, not a new theme every item.

## No ambiguous answers

- One marked correct answer (or a complete `correctIds` / `correctOrder` / pair list).
- Fill-blank: every reasonable spelling you will accept is in `acceptedAnswers`. Normalise in your head (trim, lower case). Do not accept a sentence.
- Match-pairs: each right-hand target is unique.
- If a child could defend a second option, rewrite the stem.

## Narration (read aloud)

Pre-readers tap the **speaker icon** after the question. Speech uses `question.narration.prompt` and falls back to the visible prompt.

**Question speaker: question only.** Never read the answer, answer options, how many pictures are on screen, or a hint. Those leak the mark to a child who cannot yet read.

**After a mark:** the feedback panel shows the explanation and a 44px speaker that reads that teaching line only. Do not auto-play it.

**Every question needs `narration.prompt`.** Write it whenever the stem has operators or symbols a voice will mangle (`7 + ? = 10`, `10 − 4 =`). Copy the visible prompt when the words already read well.

- Say numbers and signs in words: “7 plus what equals 10?”, “10 take away 4 equals what?”
- Same meaning as the on-screen prompt. Do not add “count the three pictures” or option lists.
- `narration.prompt` is Web Speech text only. Do not add audio files.

## Gold-standard example

Copy the shape of this item from `count-to-5.json`. It is Easy, first third of the ramp, one step, objects as data (not emoji in the prompt), a hint, a teaching explanation, question-only narration, and an off-by-one distractor set.

```json
{
  "kind": "count-objects",
  "id": "c5e-count-1",
  "prompt": "How many {items} can you see?",
  "visual": { "item": "star", "count": 1 },
  "randomise": { "shuffleOptions": true },
  "options": [
    { "id": "a", "label": "1" },
    { "id": "b", "label": "2" },
    { "id": "c", "label": "3" }
  ],
  "correctId": "a",
  "hint": "Tap each picture once as you count.",
  "explanation": "There is 1 {item}. Each one counts once.",
  "narration": { "prompt": "How many {items} can you see?" }
}
```

`randomise` on this Easy item swaps the picture (stars → bananas / apples / cars) from the activity pool and shuffles the tap targets. The **count stays 1**. Do not add `"count": { "min", "max" }` here — that would wobble the 1-2-3-4-5 ramp. Pictures light up and say the next number when tapped. See **Optional randomisation** in `docs/agent/REFERENCE.md`.

The rest of that quest then moves to 2 and 3 objects, types 4, builds a group of 5, then the count sequence, then numerals — see `difficultyRamp.within` at the top of the file.

## Self-review checklist (run before you push)

Work through this on the finished file. If any box fails, fix it. Do not push a “nearly”.

- [ ] `pathNode` + `difficulty` place it on the correct map row; `curriculumRef` matches the node id
- [ ] `difficultyRamp.within` and `.versus` are filled and match the actual question order
- [ ] Easy < Medium < Hard is obvious (or the missing levels are described, not faked in this file)
- [ ] Questions climb with no spike and no drop-back to a trivial item
- [ ] Only this node’s **Covers** bullets are taught
- [ ] Year group reading age; British English; stem templates reused
- [ ] The prompt is a full kid sentence that matches the screen (no clipped `How many ducks?` / `Which group?`; no leftover “got to” or “count the” stems)
- [ ] Every `explanation` explains the correct answer without instructions and reads naturally after a correct answer; hints contain strategies and match the scaffolding plan
- [ ] Distractors are named misconceptions, not random
- [ ] No ambiguous correct answer; fill-blank accepts number words where needed
- [ ] At least three question kinds in a 10-question quest; same kind not overused
- [ ] `narration.prompt` written for `+`, `−`, `=`, `?`. Spoken text is the question only — no answer, options, or pictured counts
- [ ] Exactly 10 questions unless `extraQuestions.reason` justifies a longer set. Stars use `STAR_SCORE` (6–7 / 8–9 / 10). No retry loop.
- [ ] JSON only (no JSX, no per-activity component). File is in `src/data/activities/` and passes `validateActivity` (auto-registered). New behaviour went into a shared question kind with defaults, not a one-off field
- [ ] Pictures use `visual: { item, count }`, not emoji in the prompt
- [ ] If `randomise` is on, stems use `{item}` / `{items}` (and `{count}` if the count can move). The draw stays inside this level — Easy Count to 5 does not randomise how many
- [ ] No shared phrases (“Correct. Nice!”, “Need a hint?”) copied into the JSON. Those live in `src/data/copy.ts`
- [ ] Child-facing wording follows **Writing for children** in `AGENTS.md` (UK English, short sentences, no em/en dashes as punctuation)
- [ ] Pedagogy rules below all hold. `npm run check:activities` then `npm run build` in `primary-learn/` succeed

## Pedagogy rules (`check:activities` fails the build)

1. Every wrong option is one named error. At most one distractor may copy a stem number.
2. Across a quest, numeric answers mix smallest, middle and largest. Do not park the answer in the middle by habit.
3. 3 options for Reception pickers, 4 for Year 1, never more than 4.
4. No more than 3 questions with the same stem shape in a quest. Never 4 in a row.
5. No two identical stems plus options in one quest.
6. Hard adds a new kind of thinking, stated in `difficultyRamp`.
7. Explanations teach in under 20 words and name a known confusion where there is one. Never only restate the answer.
8. Every question has `narration.prompt`.
9. Every tappable control is at least 44px, including the speaker button.
10. Year 1 must not say clockwise or anti-clockwise.
11. Take-away removed tiles need a second cue besides colour (dashed outline). Keep the no-X rule.
12. Comparison questions must name what is compared (the object, or the total number for tens and ones).
13. Every BaseTen question shows the tens-and-ones key (mini bar = 10, mini square = 1). One key per question, not per option. Easy and Medium also say `Each tall bar is 10. Each small square is 1.` Hard may use the key only.
14. No separate instruction label under the question when the question already says what to do. Multi-select stems must say the job (`Select`, `Tap`) so they never need a helper line.

Rule 9 is CSS. Rule 11 is CSS. Rule 13 is CSS. Rule 14 is CSS for the helper line. Multi-select wording fails `check:activities`.

TODO later rewrite (temporary allowlist, do not grow it): Show and compare numbers was just rewritten and skips content rules 1 to 5 and 7. Narration and Hard thinking still apply.
- [ ] Do **not** open the app unless James asked. Rely on validate + build. Optional review: `#/question-bank` (speaker = question only; miss shows explanation; map row via `pathNode` + `difficulty`)

## Elevating written sentences (later)

Already shipped: **speaker icon** after the question and **word highlighting** as it is read.

Ideas to add later — do not build them unless asked:

- Illustrated stems (a picture slot beside the words, not only emoji in the prompt)
- Stronger shared templates so every count / bond / story stem looks the same
- Karaoke highlighting that wraps lines more neatly on small screens
