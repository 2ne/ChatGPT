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
   ≥ 64px with letter badges (A–D).
5. **Celebrate constantly** — stars, streak flames, confetti pops, cheering Pip.
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
| `--primary` → `--violet` | `#4F46E5` → `#7C3AED` | CTA gradient, selected states, progress |
| `--sun` / `--sun-soft` | `#FFC93C` / `#FFF1C4` | Highlights, hints |
| `--green` / `--green-soft` | `#0CA678` / `#DCF5E9` | Correct only |
| `--red` / `--red-soft` | `#E03131` / `#FFE3E3` | Try-again only |
| `--gold` | `#FFB100` | Cups and gold path nodes |

Quest tiles use maths orange `#F97316` with a soft tint `#FFEAD7`.

**Rules**

- Page background is warm paper with a subtle dot grid — never flat grey.
  Dots cover the full viewport, including behind the header.
- CTAs are the indigo→violet gradient with a 2px deep border + bottom `4px`
  "squishy" shadow (Duolingo-style press). Disabled = 55% opacity, not grey.
- Correct / incorrect colour appears **only after Check**.
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

72px, `position: relative` — **scrolls with the page**, not sticky. **No fill**.
No blur, no bottom bar, no indigo wash — the dotted paper runs behind it.
Left: white Pip tile vertically centred with the "Primary Maths" wordmark in
ink (no tagline, no gradient on *Maths*). Clicking the logo or name returns to
`/pathway`. Right: learner chip (avatar face centred in its circle + name) +
Reset text on the home screen.

**Hidden on onboarding and during a quest.** Setup is a full-page welcome.
Intro, questions and summary use in-page exits (`All quests` / `Exit quest` /
`Back to quests`) instead of the global header.

### Home

1. **Hero** — indigo→violet gradient panel, very faint dot texture, sun accent:
   `Hi, {name}!` + buddy emoji, subline (`Follow the path and earn your stars.`),
   stat pills (stars on shipped quests, gold cups). No mascot on this banner.
2. **Path map** (`PathMap`) — a winding road of numbered stops, grouped by
   category signs from `curriculum/maths.md`. No subject chips, year chips, or
   a free-choice quest list. Locked stops show a lock; the current stop carries
   the learner’s buddy face. Untouched stops are just a number. Won
   stars sit in a small indigo cluster hugging the bottom of the node
   (best of Easy / Medium / Hard, up to three, no empty stars). Star
   rows live in the level sheet. When all three levels have three
   stars, the node turns gold and a cup replaces the number.
3. **Level sheet** (`LevelSheet`) — tap a stop to open Easy / Medium / Hard
   rows, each with three stars and the best mark (`7/10`). Play only when that
   row is unlocked. Coming-soon nodes (no Easy quest yet) and locked nodes get
   a calm Pip / lock note instead of play buttons.
4. **Find me** — `Go to my level` scrolls the page to the current stop.
   Major screen changes (onboarding, pathway, activity) scroll to the top so
   the name and avatar stay in view. Do not auto-jump down the path on entry.

### Activity intro

Compact column, max-width **40rem**, centred on a full-bleed white page.
Tight gaps around title, summary and fact pills. Do not stretch this block
across the desktop viewport.

Back link → icon tile + title → summary → fact pills (`10 questions`,
`About 4 min`, `Earn up to 3 stars`) → Pip + **white speech bubble**
(same as onboarding: white card, line border, soft shadow, ink text; not
the sandy tag colour) → gradient `Start quest →`.

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
- Options carry **letter badges** (A–D), keyboard `1–4` still works. Selected =
  indigo ring + soft fill; correct = green + ✓ + wiggle; wrong = red + ✕ +
  shake. Colour is never the only signal (icons + words too).
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
- Shared phrases (Check it, Hear the question, Correct. Nice!) live in `src/data/copy.ts`.
  Object pictures are drawn from `visual: { item, count }` by `ObjectGroup`.
  Do not restyle a single quest.
- Action button: `Check it ✓` (disabled until answered) → `Next question →` →
  `See my stars` on the last one. Sticky white dock at the viewport bottom on
  every width (with safe-area padding) so kids never have to scroll to find it.
  The dock button has **no 2px border** (gradient fill + squishy shadow only).
- Home and onboarding keep the dotted paper. Once a quest is open, the screen
  is white edge to edge. Inner content still uses `--max-wide`.

### Progress

**Segmented bar** — one capsule per question, 12px tall, paper fill. Done =
gradient fill with pop; current = indigo outline + soft glow. Each question
is asked once. Counter reads `Question 3 of 10` (Baloo, number in indigo).
Streaks ≥ 2 earn a `🔥 N in a row!` flame pill. A miss shows a short
correction (`It was 4.` plus the explanation) then **Next question**.

### Summary (end screen)

Joyful result, like a lesson-complete or star-reveal screen. CSS/SVG only.

1. Pip bounces in.
2. Three star tiles sit empty, then the earned ones fill **one by one** with
   a pop (1 star = 6–7, 2 = 8–9, 3 = 10). A small confetti burst on 3 stars.
3. Big text: `You got 7 out of 10!`
4. One short line: `Two stars! Great work.` (or a try-again nudge at 0 stars).
5. Buttons: `Try again` and `Next` (Next goes back to the path).

No percentages. Off under `prefers-reduced-motion` (final stars, no pop,
no confetti). 0 stars does not unlock the next level.

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
| Subject or year filter chips | One maths path map (other subjects are a later phase) |
| Emoji-only tiles | Lucide calculator tile in maths orange |
| Identical Check/Continue | Labelled actions: `Check it` → `Next question` → `See my stars` |
