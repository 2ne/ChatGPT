# Primary Maths — design system ("Sunny Path")

Playful, warm, premium kids' learning UI. Think Duolingo cheer meets Khan Kids
clarity: big rounded shapes, a sunny paper background, one friendly mascot, and
a quest metaphor everywhere ("quests", "stars", "buddies").

Agents **must** follow this file when changing UI. If a change fights these
rules, change the design — do not invent a second system.

## Design north star

1. **Always know where you are** — every activity screen shows the quest name
   and `Question X of N`. Never a bare question on a blank page.
2. **One job per screen** — onboarding asks name; home picks a quest; activity
   asks one question.
3. **Warmth is the design** — cream paper, chunky radii, a mascot sidekick.
   Calm does not mean grey.
4. **Chunky and touch-first** — primary controls ≥ 52px tall; answer options
   ≥ 64px with letter badges (A–D).
5. **Celebrate constantly** — stars, streak flames, confetti pops, cheering Pip.
   Kids should feel progress every 30 seconds.
6. **Colour with meaning** — maths tiles are orange; green = correct,
   red = try again, gold = stars only.

## Mascot: Pip

Pip is a round indigo "path-berry" blob with a leafy sprout (growth), rosy
cheeks, big sparkle eyes and a sunny star badge. **Pure SVG + CSS motion.**
No WebGL, no Three.js, no lighting rigs — the old 3D header mark is gone.

| Asset | Use |
| --- | --- |
| `Pip` | Header badge (42px in a white tile), feedback reactions, finish screen (112px) |
| Confetti | Short canvas pop on a correct answer; full shower on a mastered summary |
| Moods | `happy` default · `cheer` on correct + mastery · `think` on wrong + empty states |

**Rules**

- Sticky `AppHeader` on home / onboarding (hidden during a quest): Pip tile + "Primary *Maths*" wordmark.
  Once a learner has a name, the logo and wordmark are a button that returns home.
  (indigo gradient on "Path") + tagline, learner chip on the right, Exit pill
  during activities.
- Question cards show a small Pip **only inside feedback** (reaction). Never
  wallpaper Pip around the screen, and do not put Pip on the home greeting
  banner — the learner's own buddy emoji is who they are.
- Motion: blink (5s), sprout sway, star twinkle, one hop on `cheer`, tilt on
  `think`. All disabled under `prefers-reduced-motion`.
- Finish screen: large Pip + animated 1–3 stars.

## Colour

CSS variables in `src/index.css`. The maths tile colour lives in
`src/data/subjects.tsx` (orange + calculator icon).

| Token | Hex | Use |
| --- | --- | --- |
| `--paper` / `--paper-deep` | `#FFF6E8` / `#FBEED3` | Page bg / sunken fills, dot texture |
| `--ink` / `--ink-soft` / `--ink-faint` | `#232946` / `#5B5E7A` / `#9AA0B8` | Text tiers |
| `--line` / `--line-strong` | `#ECE2CC` / `#DDCFB2` | Borders |
| `--primary` → `--violet` | `#4F46E5` → `#7C3AED` | CTA gradient, selected states, progress |
| `--sun` / `--sun-soft` | `#FFC93C` / `#FFF1C4` | Highlights, hints, star badges |
| `--green` / `--green-soft` | `#0CA678` / `#DCF5E9` | Correct only |
| `--red` / `--red-soft` | `#E03131` / `#FFE3E3` | Try-again only |
| `--gold` | `#FFB100` | Stars only |

Quest tiles use maths orange `#F97316` with a soft tint `#FFEAD7`.

**Rules**

- Page background is warm paper with a subtle dot grid — never flat grey.
- CTAs are the indigo→violet gradient with a 2px deep border + bottom `4px`
  "squishy" shadow (Duolingo-style press). Disabled = 55% opacity, not grey.
- Correct / incorrect colour appears **only after Check**.
- Maths orange appears on quest icon tiles only, never as a full-page theme.

## Typography

**Fonts:** `Baloo 2` (display: titles, buttons, options) + `Nunito` (body).
Loaded from Google Fonts. Rounded letterforms read friendly at kid sizes.

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
- British English copy.

## Shape & elevation

| Element | Radius | Border | Shadow |
| --- | --- | --- | --- |
| Cards | 20px (`--radius`) | 2px `--line` | `0 10px 28px rgba(35,41,70,.09)` |
| Hero / score | 28px | 2px deep | same + pattern fills |
| Answer options | 18px | 2.5px `--line` | lift on hover; glow ring when selected |
| CTA buttons | 16px | 2px deep | `0 4px 0` squishy press |
| Pills / chips | 9999px | 1.5–2px | flat or soft |
| Avatar / icon tiles | 18–20px (tiles), circle (faces) | 2px | soft indigo glow on brand tile |

Question cards carry an 8px rainbow ribbon on top (sun/coral/mint/sky) so
every question feels like part of the quest.

## Components

### Header

72px sticky, blurred paper, 2px bottom border. Left: white Pip tile vertically
centred with the "Primary Maths" wordmark (no tagline). Clicking the logo or
name returns to the quest list. Right: learner chip
(avatar face centred in its circle + name) + Reset text on the home screen.

**Hidden during a quest.** Intro, questions and summary use in-page exits
(`All quests` / `Exit quest` / `Back to quests`) instead of the global header.

### Home

1. **Hero** — indigo→violet gradient panel, very faint dot texture, sun accent:
   `Hi, {name}!` + buddy emoji, subline, stat pills (stars, quests done).
   No mascot on this banner.
2. **Quest list** — one list, no subject chips, year chips, or category pills.
3. **Quest cards** — orange calculator tile · Baloo title · one-line summary ·
   best-score micro-bar · status pill (`New quest` / `Best X of N` / `Done!`) ·
   dark `Play →` button that turns gradient on hover. Whole card is the hit target.

### Activity intro

Back link → icon tile + big title → summary sentence → fact pills
(`10 questions`, `~6 min`, `3 stars`) → Pip + speech bubble
(`You've got this, {name}!`) → gradient `Start quest →`.

### Activity question (most important)

```
[← Exit quest]
[🎨 tile  Number bonds to 10      ]
[Question 3 of 10      Keep going!]
[▰▰▰▱▱▱▱▱▱▱]  segmented progress
[🔥 3 in a row!]           (streak)
┌───────────────────────────────┐
│ [3]  Which number…?  (Pick one)│  ← numbered badge + kind label
│ [A] 2                         │
│ [B] 3                         │
│ [C] 4                    ✓    │
│ 💡 Need a hint?               │
│ ✅ Correct — nice! + tip + Pip │
└───────────────────────────────┘
┌───────────────────────────────┐  ← white dock (fixed on mobile)
│ [ Check it ✓ / Next → ]       │
└───────────────────────────────┘
```

- Options carry **letter badges** (A–D), keyboard `1–4` still works. Selected =
  indigo ring + soft fill; correct = green + ✓ + wiggle; wrong = red + ✕ +
  shake. Colour is never the only signal (icons + words too).
- Hint is a `Need a hint?` button until opened, then a sunny dashed card.
- Feedback appears under options: icon medallion + bold title + 1–2 sentence
  teaching tip + mini Pip reaction.
- Action button lives in a **white dock** below the question card:
  `Check it ✓` (disabled until answered) → `Next question →` → `See my stars`
  on the last one. On mobile the dock is `position: fixed` to the viewport
  bottom (with safe-area padding) so kids never have to scroll to find it.
- Home, quest intro, questions and the stars screen all use the same content
  width (`--max-wide`). Do not narrow the white card on later screens.

### Progress

**Segmented bar** — one capsule per question, 12px tall, paper fill. Done =
gradient fill with pop; current = indigo outline + soft glow; retry rounds
restart the bar with a `Practising the tricky ones` note. Counter reads
`Question 3 of 10` (Baloo, number in indigo) + rotating cheer line. Streaks
≥ 2 earn a `🔥 N in a row!` flame pill.

### Summary

Large Pip + 1–3 stars (pop in sequence: 3 = perfect first try, 2 = mastered,
1 = finished). Big `X / N` figure, one warm sentence, `Quest complete` trophy
pill when mastered, then `Back to quests` (primary) / `Play again` or
`Try again` (primary when not mastered). Confetti shower on mastery.

### Onboarding

Centered card: `Your learning adventure starts here` badge + cheering Pip +
`What's your name?` + one short line → big Baloo name field → `Choose your
buddy` avatar grid (3 cols, soft tinted faces, selected = indigo ring + scale)
→ gradient `Let's go →` → `Stays on this device` reassurance.

## Motion

Cheerful but brief. 120–240ms easings; options lift on hover; cards lift on
hover; stars pop in sequence; progress segments pop; feedback slides up;
Pip blinks/sways/twinkles.

`prefers-reduced-motion: reduce` disables all of it.

## Accessibility (kids + WCAG)

- Ink on paper/white ≥ 4.5:1. Colour never the only signal (✓/✕ + words).
- Focus ring: 3px `--primary`.
- Hit targets ≥ 48px (options 64px, CTAs 52px).
- `role="progressbar"` with `aria-valuetext`; stars have `aria-label`;
  live regions for feedback and quest lists.

## Anti-patterns (fix these)

| Don't | Do instead |
| --- | --- |
| Bare question with no quest name | Context card with tile + title + count on every question |
| Thin lonely progress line | Segmented per-question bar + count + cheer line |
| Flat grey cards, tiny labels | Paper bg, chunky radii, Baloo prompts, letter badges |
| 3D/WebGL mascot with lighting | Pure SVG Pip, CSS motion |
| Subject or year filter chips | One maths quest list |
| Emoji-only tiles | Lucide calculator tile in maths orange |
| Identical Check/Continue | Labelled actions: `Check it` → `Next question` → `See my stars` |
