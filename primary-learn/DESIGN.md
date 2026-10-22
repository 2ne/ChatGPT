# Primary Maths — design system ("Sunny Path")

Playful, warm, premium kids' learning UI. Think Duolingo cheer meets Khan Kids
clarity: big rounded shapes, a sunny paper background, one friendly mascot, and
a quest metaphor everywhere ("quests", "stars", "buddies").

Agents **must** follow this file when changing UI. If a change fights these
rules, change the design — do not invent a second system.

## Design north star

1. **Always know where you are** — every activity screen shows the quest name
   and `Question X of N`. Never a bare question on a blank page.
2. **One job per screen** — `/onboarding` sets up the account; `/pathway`
   follows the path and opens a level; the level sheet picks Easy / Medium /
   Hard; `/activity/:id` asks one question.
3. **Warmth is the design** — cream paper, chunky radii, a mascot sidekick.
   Calm does not mean grey.
4. **Chunky and touch-first** — primary controls ≥ 52px tall; answer options
   ≥ 64px with letter badges (A–D). Pictured join stories are the exception:
   digit answers there are big centred numbers with no A–D.
5. **Celebrate constantly** — stars, confetti pops, cheering Pip.
   Kids should feel progress every 30 seconds.
6. **Colour with meaning** — maths tiles are orange; green = correct,
   red = try again, indigo = earned stars, gold = cups and path nodes.

## Mascot: Pip

Pip is a round indigo "path-berry" blob with a leafy sprout (growth), rosy
cheeks, big sparkle eyes and a sunny star badge. **Pure SVG + CSS motion.**
No WebGL, no Three.js, no lighting rigs — the old 3D header mark is gone.

| Asset | Use |
| --- | --- |
| `Pip` | Header badge (42px in a white tile), **onboarding hero** (large, pointer-follow), feedback reactions, finish screen (112px) |
| Confetti | Short canvas pop on a correct answer; full shower on a mastered summary |
| Moods | `happy` default · `cheer` on correct + mastery · `think` on wrong + empty states |

**Rules**

- `AppHeader` on the home path (hidden during onboarding and during a quest):
  Pip tile + "Primary *Maths*" wordmark. Once a learner has a name, the logo
  and wordmark are a button that returns to the path map.
- **Onboarding** shows a **large** Pip (not the header badge). Eyes, head and
  body tilt toward the pointer (mouse or touch). Idle: gentle bob/breathe plus
  blink. SVG/CSS only — no WebGL. Off under `prefers-reduced-motion`.
- Question cards show a small Pip **only inside feedback** (reaction). Never
  wallpaper Pip around the screen, and do not put Pip on the home greeting
  banner — the learner's own buddy emoji is who they are.
- Motion: blink (5s), sprout sway, star twinkle, one hop on `cheer`, tilt on
  `think`. All disabled under `prefers-reduced-motion`.
- Finish screen: Pip bounces in, then 1–3 stars pop in one by one.

## Colour

CSS variables in `src/index.css`. The maths tile colour lives in
`src/data/subjects.tsx` (orange + calculator icon).

| Token | Hex | Use |
| --- | --- | --- |
| `--paper` / `--paper-deep` | `#FFF6E8` / `#FBEED3` | Page bg / sunken fills, dot texture |
| `--ink` / `--ink-soft` / `--ink-faint` | `#232946` / `#5B5E7A` / `#9AA0B8` | Text tiers |
| `--line` / `--line-strong` | `#ECE2CC` / `#DDCFB2` | Borders |
| `--primary` → `--violet` | `#4F46E5` → `#7C3AED` | Check it, selected states, progress |
| `--sun` / `--sun-soft` | `#FFC93C` / `#FFF1C4` | Highlights, hints |
| `--green` / `--green-soft` | `#0CA678` / `#DCF5E9` | Correct, and Next question / See my stars |
| `--red` / `--red-soft` | `#E03131` / `#FFE3E3` | Try-again only |
| `--gold` | `#FFB100` | Cups and gold path nodes |

Quest tiles use maths orange `#F97316` with a soft tint `#FFEAD7`.

**Rules**

- Page background is warm paper with a subtle dot grid — never flat grey.
  Dots cover the full viewport, including behind the header.
- `Check it` (and Start quest) is the indigo→violet gradient with a 2px
  deep border + bottom `4px` "squishy" shadow (Duolingo-style press).
  Disabled = 55% opacity on that fill, not grey. `Next question` and
  `See my stars` use `--green` (the same success green as correct
  feedback). Sizes, shadow and layout stay identical across both.
- Correct / incorrect colour on answers appears **only after Check**.
- Maths orange appears on quest icon tiles only, never as a full-page theme.

## Typography

**Fonts:** `Baloo 2` (display: titles, buttons, options) + `Nunito` (body).
Loaded from Google Fonts. Rounded letterforms read friendly at kid sizes.
Do not switch back to Lato / Noto Sans.

| Role | Style | When to use |
| --- | --- | --- |
| Display (`.t-display`) | Baloo 800, 30–40px | Celebration screens |
| Title (`.t-title`) | Baloo 800, 24–30px | Quest titles, question prompts (`.q-prompt` 22–27px) |
| Title-sm (`.t-title-sm`) | Baloo 700, 20px | Card titles, names |
| Body (`.t-body`) | Nunito 500–600, 16px | Summaries, explanations |
| Meta (`.t-meta`) | Nunito 800, 12.5px, caps, tracked | Short counts only, such as `1 quest` |

**Rules**

- Question prompts are always Baloo 800 ≥ 22px with a numbered badge (`Q3`).
- Supporting copy under a name/title is Body, not Meta.
- Never show adult jargon to kids (mastery %, curriculum refs, ability bands).
- British English copy. Child-facing words follow **Writing for children** in
  `AGENTS.md`: short sentences, everyday words, one idea per sentence, no em
  dashes or en dashes as punctuation, no semicolons.

## Shape & elevation

| Element | Radius | Border | Shadow |
| --- | --- | --- | --- |
| Cards | 20px (`--radius`) | 2px `--line` | `0 10px 28px rgba(35,41,70,.09)` |
| Hero / score | 28px | 2px deep | same + pattern fills |
| Answer options | 18px | 2.5px `--line` | lift on hover; glow ring when selected |
| CTA buttons | 16px | 2px deep | `0 4px 0` squishy press |
| Pills / chips | 9999px | 1.5–2px | flat or soft |
| Avatar / icon tiles | 18–20px (tiles), circle (faces) | 2px | soft indigo glow on brand tile |

An 8px rainbow strip (sun/coral/mint/sky) sits between the flush header and
the white activity column. It spans the **full viewport width**, edge to edge,
on every screen size. It is the divider, not a card border.

## Components

### Header

72px plus `safe-area-inset-top`, `position: relative` — **scrolls with the
page**, not sticky. **No fill**.
No blur, no bottom bar, no indigo wash — the dotted paper runs behind it.
Left: white Pip tile vertically centred with the "Primary Maths" wordmark in
ink (no tagline, no gradient on *Maths*). Clicking the logo or name returns to
`/pathway`. Right: learner chip (avatar face centred in its circle + name).
Tap the avatar to open Settings (sound on/off, and Start again with a
confirm step). Sound and reset are not shown on the path, onboarding, or
quest screens.

**Hidden on onboarding and during a quest.** Setup is a full-page welcome.
Intro, questions and summary use in-page exits (`All quests` / `Exit quest` /
`Back to quests`) instead of the global header. Quest screens still pad the
top and the sticky dock with `env(safe-area-inset-*)`.

### App feel

Feel like a native app on phones and tablets. No text selection or long-press
callouts except in text fields. No image drag. `touch-action: manipulation`
kills double-tap zoom and the 300ms delay; pinch zoom stays on (never
`user-scalable=no`). Inputs are at least 16px so iOS does not zoom on focus.
`overscroll-behavior: none` stops pull-to-refresh bounce. The cream dotted
paper lives on `html` and `body` on setup, the map and settings so it fills
the whole device (no white status-bar or toolbar bands); yellow and pink
blobs sit on that same layer and can run under the notch. Quest intro,
runner and results set `data-surface="white"` on `html` on mount (cleared
on unmount) so `html`/`body` and `theme-color` go white together: no cream
bleed, no dots, no blobs, including behind the dock. Content wrappers use
`env(safe-area-inset-*)` once, not twice. Home-screen install uses a
standalone manifest (`Primary Maths`, paper background, Pip favicon) under
`/ChatGPT/primary-learn/`. Keep `:focus-visible` and pointerdown sounds as
they are.

### Home

1. **Hero** — indigo→violet gradient panel, very faint dot texture, sun accent:
   `Hi, {name}!` + buddy emoji, subline (`Follow the path and earn your stars.`),
   stat pills (one star per Easy / Medium / Hard with 3 stars on shipped
   quests, gold cups). No mascot on this banner.
2. **Path map** (`PathMap`) — a winding road of numbered stops, grouped by
   category signs from `curriculum/maths.md`. No subject chips, year chips, or
   a free-choice quest list. Every stop is open. You are here (buddy face)
   sits on the first stop that still has an Easy, Medium or Hard below 1
   star. Untouched stops are just
   a number. Won
   stars sit in a small indigo cluster hugging the bottom of the node
   (one star per Easy / Medium / Hard that has all three stars, max three;
   1 or 2 stars on a level do not appear on the map). Star
   rows live in the level sheet. When all three levels have three
   stars, the node turns gold and a cup replaces the number.
   Each section uses a repeating outline maths wallpaper selected from its existing
   category id. Counting sections show numbers within the named range. Other
   topics use related shapes, fraction diagrams, operations, clocks, rulers or
   graphs. Keep outlines faint (17% of the year ink) on the existing year tint.
   SVG tiles stay at 340 × 310 CSS pixels on phones and desktops. Decoration
   is hidden from assistive technology and never intercepts touches. The road,
   signs and level buttons remain opaque above it. No unrelated floating doodles.
   Keep each section's tint and doodles within its boundaries. No fade or overlap.
   At each boundary add a 1px black line at 7% opacity with a 1px white highlight
   below at 55% opacity, so neighbouring sections with similar tints stay distinct.
   Centre topic name plates vertically on their section divider. The first plate
   stays inset from the top of the map because it has no preceding section.
3. **Level sheet** (`LevelSheet`) — tap a stop to open Easy / Medium / Hard
   rows, each with three stars and the best mark (`7/10`). Every row with a
   quest is playable. Rows with no quest yet say coming soon.
4. **Topic pill** — a floating pill at the bottom of the path shows the
   section on screen (`Reception · Numbers to 5`), updated live with
   IntersectionObserver. Tap it (menu icon) to open a sheet of every
   topic, grouped by year. The topic on screen is highlighted; a tiny
   star or cup marks progress; the learner's buddy sits on their
   section. Tap a topic to scroll there and close the menu. No
   `Go to my level` button.
   Major screen changes (onboarding, pathway, activity) scroll to the top so
   the name and avatar stay in view. Do not auto-jump down the path on entry.

### Activity intro

Centred quest card, max-width **34rem**, on a white page with a subtle paper glow.
Keep the back link outside the card. A warm paper illustration panel holds Pip
on a simple warm background. Below it, centre the icon and title, readable summary,
star goal, and a two-column row for question count and time. End with a short
personal welcome and the full-width gradient `Start quest` button. Use 28px card
corners and a soft shadow. On narrow screens reduce padding, keep the facts in
two columns, and allow the whole page to scroll on short screens. Do not add a
second mascot or a speech bubble to this screen.

### Activity question (most important)

The quest runner is **full-bleed white**. Kids know they are in an activity
because the dotted sandy paper is gone. Header and activity touch the top and
both sides. Square corners. No card chrome. Keep the header snug to the top
(small top padding). Leave extra space between the title / question-count
row and the segment bar, then more space between the bar and the rainbow,
then more padding above the question. Inner words stay padded and, on wide
screens, centred (`--max-wide`) while the white still goes edge to edge. The
rainbow itself is never inset.

```
┌─────────────────────────────────┐  flush header, no radius
│ 🎨  Count to 5            ✕    │
│ Question 5 of 10                │
│ ▰▰▰▰▰▱▱▱▱▱                      │
├─────────────────────────────────┤  rainbow strip (divider)
│                                 │
│ [3]  Which number…?  🔊         │  number + prompt only; no kind label
│ [A] 2                           │
│ [B] 3                           │
│ [C] 4                      ✓    │
│ 💡 Need a hint?                 │
│ ✅ Correct. Nice! + tip + Pip    │
│                                 │
├─────────────────────────────────┤
│ [ Check it ✓ / Next question → ]│  sticky dock, every width
└─────────────────────────────────┘
```

- Prompt row is the numbered badge plus the question text and speaker. Do
  **not** show a grey uppercase kind label above it (`HOW MANY?`, `TYPE IT IN`,
  `PICK ONE`, and the rest). Kids already see what to do from the question.
- Options carry **letter badges** (A–D), keyboard `1–4` still works. Exception:
  pictured join stories (`visual.added`) with digit-only answers omit the badge
  and show a large centred numeral. Selected = indigo ring + soft fill; correct
  = green + ✓ + wiggle; wrong = red + ✕ + shake. Colour is never the only signal
  (icons + words too).
- Selection, correct and wrong states are **shared** across every question
  kind (`.option.is-selected` / `.is-correct` / `.is-wrong` and the same
  tokens on pick-pair tiles and part-whole buttons). Never invent a solid indigo fill or a private
  selected look for one kind.
- Focus rings use `:focus-visible` only, so they appear for keyboard
  navigation and never after a tap or on load. That includes answer
  buttons, pick-pair tiles, part-whole number buttons, build-set tray and group tokens, make-total
  slots, and text resets. Do not style `:focus` on answers. No answer is
  auto-focused when a question opens. The selected look comes only from
  the selected answer state, never from focus.
- Never apply `:hover` on touch. Wrap every hover style in
  `@media (hover: hover) and (pointer: fine)`. iOS keeps `:hover` stuck on
  the last tap, which made unselected answers look selected (indigo
  border). Answer buttons remount per question id. Blur
  `document.activeElement` when the question changes. Set
  `-webkit-tap-highlight-color: transparent`. An indigo answer border is
  only `.is-selected` or a keyboard `:focus-visible` outline.
- Build-set “Your group” shows the objects only. No numbered badges and no
  spoken count. Those would give the answer away.
- All answer buttons use the one shared full-width `.option` style (letter
  badge, same height, stretch to the activity column). Never shrink them into
  centred pills per question kind. Number answers on `make-total` use the same
  buttons as multiple-choice. Exceptions: pictured join-story digit answers
  (no A–D, big number), `pick-pair` square tiles, `part-whole` rounded-square
  number buttons (one row of three), and `ordered` big numeral tiles (drag
  handle plus up/down arrows).
- Hint is a `Need a hint?` button until opened, then a sunny dashed card.
  Do not put a speaker on the hint — hints can give the strategy away.
- Feedback appears under options: icon medallion + bold title + 1–2 sentence
  teaching tip + mini Pip reaction. No speaker on feedback (it states the answer).
- **Speaker** (small round icon, 36px) sits **inline right after the question
  text**. It reads **the question only** via Web Speech (`speechSynthesis`).
  Pick a young, warm, happy UK female teacher voice (en-GB female natural
  first). Pitch about 1.1. Rate about 0.95. Never options, pictured counts,
  hints, or explanations. No generated audio files and no paid voice API.
  Words in the prompt highlight as they are spoken (`--sun-soft`). Hide the
  button if the browser has no speech API. Spoken copy is
  `question.narration.prompt` (fallback: visible prompt). Do not add a second
  speaker system.
- **Sound effects** are Web Audio only (`src/lib/sound.ts`). No files. Soft
  tap on buttons and answers, ding on correct, a gentle low tone on wrong,
  a short fanfare on the end screen (bigger at 3 stars). Play on
  `pointerdown` so iOS is instant. Mute lives in Settings behind the
  avatar chip and stays in localStorage. SFX must not stop narration.
- Shared phrases (Check it, Hear the question, Correct. Nice!) live in `src/data/copy.ts`.
- After a miss, show the correct answer under a short label appropriate to the question kind, followed by the teaching explanation. Addition make-total and part-whole questions also offer an optional `Show me` demonstration below feedback. Reveal the first part, the second part, then the whole using existing object tiles. Explicitly describe zero as an empty part. Buttons advance the demonstration without timers, narration or score changes.
  Object pictures are drawn from `visual: { item, count }` by `ObjectGroup`.
  Pictures in a story question must show the object named in the text, with
  matching counts. Do not use `extras` of a second emoji for “n more” of the
  same thing; set `visual.count` (start) and `visual.added` of the same item.
  Join stories show cream start tiles, a purple +, then light-blue added tiles.
  Every picture group in a question stem uses the same tiles; no frame/strip
  variants. Only count-objects tiles are tappable. Do not draw empty
  placeholder boxes that hint at the total. Dice, five-frame, tens-frame,
  compact and parts stems use those same cream tiles, sized and spaced like
  count-objects. Fingers stay a finger pattern. Flash/hidden still cover the
  tiles. Pictures inside A/B/C/D and match-pair cards use smaller tiles so
  they fit.
- **Part-whole (`make-total`)** stays on the same white activity screen. No
  scenery. Easy (`fill-slots`): row 1 is the known part as filled sun-style
  tiles, then a large `+`. Row 2 is the child’s area. Added objects are
  green-tinted tiles (tap one to take it out). Empty slots are dashed, with
  a `+` and a short `Add` label (never the object name). Every missing-part
  prompt, in any question kind, is `What do you need to add to {n} to make {total}?`.
  Use it on fill-slots, sum-only, multiple-choice and fill-blank. Do not
  write `5 is 2 and ?`, `5 = ? + 2`, `Which number goes with 6 to make 10?`,
  or `Which number is missing? 7 + ? = 10`.   Sum-only totals use
  `What is {a} + {b}?` (subtract: `What is {a} take away {b}?`), generated from
  the numbers on screen. Fill-blank result blanks (`5 − 2 = __`) and bare
  equation prompts use the same stem, not `What is the missing number?`.
  Spoken uses words (`plus` / `take away`).
  Pictured totals use `How many can you see in all?`.
  Known tiles, added tiles and empty slots use one
  identical tile size. Adding
  or removing a tile replaces a slot in place. Always more slots than the
  answer (default missing + 2, or `slotCount` in JSON, cap 12) so the
  child must stop. No “Tap a space to add one.” No sum line (a live `?`
  would give the answer away). Tap sound on `pointerdown`. No spoken count
  on taps. Keep “Start again”, always rendered. Hide and disable it when
  nothing has been added so the layout does not move. Prompt, row 1 and
  row 2 sit as a compact group with tight, even gaps. Extra viewport
  height must not stretch those gaps. Medium may mix `fill-slots` with
  `sum-only`. Hard (`sum-only`): sum line and the same full-width number
  buttons only. No empty object slots that count out the missing amount.
  Sum-only `a + b = ?` items have no object tiles.
  Later the same kind can subtract (tap to take away) and use totals to
  10 or 20 via `total` / `operation` in JSON.
- **Stable question layouts.** The prompt and answer must not jump as the
  child taps. Tiles keep one size across empty, filled and added states.
  Conditional controls (such as “Start again”) reserve their space when
  hidden or disabled. Do not stretch question content to fill the phone.
- **Number pairs (`pick-pair`)** stay on the same white activity screen. A
  two-column grid of big square tiles: large numeral in the centre, optional
  dice-pip dots in the top-right, inset from the edges. Every tile starts the
  same: white, the same soft border as `.option`. Dots use `--primary` (the
  selected indigo) in every state, including selected, correct and wrong.
  Selected tiles use the shared option selected state (indigo border, soft
  indigo fill, ring shadow). Tap again to deselect. At most two tiles are
  selected. No sum line under the tiles. Always four tiles and exactly one
  pair. No duplicate numbers that make a second pair. Finding every pair
  belongs to
  `match-pairs` later. Easy: four tiles with dots. Medium: four tiles, harder
  numbers (0, reverse parts). Hard: four tiles, no dots. Later totals to 10
  or 20 use the same `total` / `tiles` config.
- **Order (`ordered`)** is a vertical stack of big numeral tiles (about 48px
  digits). Left: a grip handle so drag is obvious. Middle: the number. Right:
  up/down arrow buttons. Kids can drag or tap arrows. No position numbers like
  `1.` beside the answer. Arrow keys also move the focused tile.
  Stem: `Put the numbers in order, from smallest to biggest.` Feedback:
  `The numbers go 1, 2, 3.`
- **Cherry bonds (`part-whole`)** stay on the same white activity screen. A
  big whole circle on top (green tint, like the sum-only total), lines down
  to two smaller part circles (blue tint when known). One SVG behind the
  circles draws both joins: they meet at the bottom centre of the whole
  and end at the top of each part, from the circle sizes, with round caps
  and the beige line colour. The empty circle is `?` (dashed beige on a
  part, indigo outline on a missing whole). Circles stay one size in every
  state. Known circles show small quantity dots under the number, in the
  circle’s text colour; the `?` has no dots; a correct fill may show them.
  Three rounded-square buttons in one row: white, soft beige border, shared
  indigo selected state. Exactly one is right; the other two are nearby
  misses. Order is shuffled. Tap drops the number into the empty circle in
  the selected style. Tap another to replace. Nothing auto-checks. Correct
  turns the filled circle green. Wrong shows a labelled correct answer and
  puts the right number in the circle. Prompt is `What do you need to add to {n} to
  make {whole}?`, or `What do {a} and {b} make?` when the whole is empty.
  Do not use match-pairs with `a and b` text for Reception bonds.
- Action button: `Check it ✓` (disabled until answered) → `Next question →` →
  `See my stars` on the last one. `Check it` is the indigo to violet
  gradient, including the faded disabled state. `Next question` and
  `See my stars` use `--green`. Sticky white dock at the viewport bottom
  on every width (with safe-area padding) so kids never have to scroll
  to find it. The dock button has **no 2px border** (fill + squishy
  shadow only). Same size, shadow and layout for every dock action so
  nothing shifts.
- Home and onboarding keep the dotted paper. Question play is white edge to edge.
  The intro uses the centred Pip card above. Inner question content uses `--max-wide`.

### Progress

**Segmented bar** — one capsule per question, 12px tall, paper fill. Done =
gradient fill with pop; current = indigo outline + soft glow. Each question
is asked once. Counter reads `Question 3 of 10` (Baloo, number in indigo).
No inline streak badge in the header (it pushed the layout down). A streak
toast may come back later. A miss shows a labelled correct answer and the factual
explanation, then **Next question**.

### Summary (end screen)

Joyful result, like a lesson-complete or star-reveal screen. CSS/SVG only.

1. Pip bounces in.
2. Three star tiles sit empty, then the earned ones fill **one by one** with
   a pop (1 star = 6–7, 2 = 8–9, 3 = 10). A small confetti burst on 3 stars.
3. Big text: `You got 7 out of 10!`
4. One short line: `Two stars! Great work.` (or a try-again nudge at 0 stars).
5. Buttons: `Try again` and `Next` (Next goes back to the path).

No percentages. Off under `prefers-reduced-motion` (final stars, no pop,
no confetti). Stars show progress. They do not gate the path.

### Onboarding

No app header. Full-page setup on the dotted paper:

1. **Hero** — **large Pip** (follows the pointer; idle bob + blink) → speech
   bubble (`Hi, I'm Pip! Let's learn together.`) → display title
   **`Set up your Primary Maths account`**. No top badge. No subtitle.
2. **Card** — big Baloo name field → `Choose your buddy` avatar grid (3 cols,
   soft tinted faces, selected = indigo ring + scale) → gradient `Let's go →`
   → `Stays on this device` reassurance.

Touch-first: name field ≥ 64px, buddy tiles ≥ 108px. Same Sunny Path tokens —
no second visual system.

## Motion

Cheerful but brief. 120–240ms easings; options lift on hover; cards lift on
hover; stars pop in sequence; progress segments pop; feedback slides up;
Pip blinks/sways/twinkles. Onboarding Pip also bobs and looks toward the
pointer (mouse or touch).

`prefers-reduced-motion: reduce` disables all of it (including pointer-follow).

## Accessibility (kids + WCAG)

- Ink on paper/white ≥ 4.5:1. Colour never the only signal (✓/✕ + words).
- Focus ring: 3px `--primary`.
- Hit targets ≥ 48px (options 64px, CTAs 52px). Speaker icon 36px, inline after the prompt.
- `role="progressbar"` with `aria-valuetext`; stars have `aria-label`;
  live regions for feedback and the path map.
- Pre-readers: speaker on the **question only**. Word highlighting on the
  prompt is a reading aid, not decoration — keep it even when motion is reduced.

Later (do not build unless asked): illustrated stems beside the words,
stronger sentence templates, neater karaoke wrapping. Do not generate
audio files. Scale is too large.

## Anti-patterns (fix these)

| Don't | Do instead |
| --- | --- |
| Bare question with no quest name | Context card with tile + title + count on every question |
| Thin lonely progress line | Segmented per-question bar + count + cheer line |
| Flat grey cards, tiny labels | Paper bg, chunky radii, Baloo prompts, letter badges |
| 3D/WebGL mascot with lighting | Pure SVG Pip, CSS motion |
| Subject or year filter chips | One maths path map |
| Emoji-only tiles | Lucide calculator tile in maths orange |
| Identical Check/Continue | Labelled actions: `Check it` → `Next question` → `See my stars` |
| Tiles that change size when filled | One tile size for empty, filled and added |
| Controls that appear and shove the page | Always render them. Hide or disable in place |
| Stretching a question to fill the phone | Pack the prompt and answer as a compact group |
| Empty slots that count out the missing amount | Tap-to-fill with extra slots, or the sum line only |


### Building a missing part

Show the starting objects, a centred plus, and fixed tappable spaces on plain white.
Each empty space shows + and Add. Tapping any empty space adds one object there in
the next available position. Tapping an added object removes one object only.
There is no separate Add button. Use five columns. Keep spare spaces beyond the
correct answer, so filling every space is not the goal. Shared help text explains
adding and removing. Tiles are 56px, or 44px on narrow screens. No extra panels.
