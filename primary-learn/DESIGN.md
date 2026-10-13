# Primary Path — design system

Inspired by **Khan Academy / Wonder Blocks**.  
Goal: calm, simple, kid-clear learning UI. Not a colourful playground. Not a dashboard.

Agents **must** follow this file when changing UI. If a change fights these rules, change the design — do not invent a second system.

Reference live examples while building:

- Home / marketing calm: [khanacademy.org](https://www.khanacademy.org/)
- Learning catalogue density: [khanacademy.org/math](https://www.khanacademy.org/math)
- Tokens source: [Khan Wonder Blocks](https://github.com/Khan/wonder-blocks) (`color`, `spacing`)

---

## Design north star

1. **One job per screen** — onboarding asks name; home picks an activity; activity asks one question.
2. **Whitespace is the design** — if it feels cramped, add space; never add another widget.
3. **Flat over fancy** — white / off-white surfaces, 1px borders, almost no shadow.
4. **Obvious hierarchy** — few type sizes, big jumps between levels (not subtle).
5. **One action colour** — blue means “do this”. Green = success. Red = try again. Gold = celebration only.
6. **Touch-first for primary kids** — primary controls ≥ 48px tall; answer options ≥ 56px.
7. **Friendly, not stale** — Pip (our mascot) and a few doodle SVGs add warmth; keep them sparse.

## Mascot: Pip

Inspired by friendly geometric education mascots (big eyes, simple smile, orbit ring) but **original** to Primary Path — blue path-marker shape, not a third-party logo.

| Asset | Use |
| --- | --- |
| `Pip` | Sticky header always; beside greetings / Start / summary |
| `DoodleStar` / `DoodleRocket` / `DoodleShape` | Tiny corner accents on cards; rotate sparingly on questions |
| Moods | `happy` default · `cheer` after correct / celebration · `think` on “not quite” / empty |

**Rules**

- Sticky `AppHeader` on every screen: Pip + “Primary Path” (+ Exit/Reset on the right).
- At most **one** doodle cluster per card.
- Do not cover answer options with decorations.
- No continuous bounce animations on Pip during questions.

---

## Colour (Wonder Blocks–aligned)

Use these CSS variables in `src/index.css`. Do not invent new brand colours per screen.

| Token | Hex | Use |
| --- | --- | --- |
| `--blue` | `#1865f2` | Primary buttons, links, selected answer border |
| `--blue-soft` | `#e7f3ff` | Selected answer fill, soft info chips |
| `--off-black` | `#21242c` | Primary text |
| `--off-black-64` | `#63666f` | Secondary text |
| `--off-black-50` | `#8b8d95` | Meta / captions |
| `--off-black-16` | `#d6d8da` | Borders, dividers |
| `--off-black-8` | `#ebecef` | Hairline / disabled wash |
| `--off-white` | `#f7f8fa` | Page background |
| `--white` | `#ffffff` | Cards, inputs, answer tiles |
| `--green` | `#00a60e` | Correct feedback only |
| `--green-soft` | `#e5f6e5` | Correct feedback background |
| `--red` | `#d92916` | Incorrect feedback only |
| `--red-soft` | `#fde8e5` | Incorrect feedback background |
| `--gold` | `#ffb100` | Rare celebration (mastery badge) |
| `--dark-blue` | `#0b2149` | Brand mark / optional hero band only |
| `--teal` | `#14bf96` | Logo sprout accent (like KA leaf) — not for CTAs |

**Rules**

- Page background is always `--off-white`. Content sits on `--white`.
- Do **not** use multi-stop pastel gradients, floating orbs, or woodland green as the action colour.
- Do **not** colour-code whole subjects on the learning screens (KA moved away from this — it looked like warnings).
- Correct / incorrect colour appears **only after Check**.

---

## Typography

**Font:** `Lato, "Noto Sans", sans-serif`  
Weights: **400** (body), **700** (emphasis / buttons), **900** (rare display).  
Load from Google Fonts. No Fredoka, Nunito, comic fonts, or system UI stacks on learning screens.

### Type scale (keep it tiny)

Kids mostly see **two** sizes. Small is for metadata only.

| Role | Size | Line-height | Weight | When to use |
| --- | --- | --- | --- | --- |
| **Big** (`.t-title-sm`) | 20px | 28px | 700 | Names, activity titles, question prompts |
| **Normal** (`.t-body`) | 16px | 22px | 400 | Summaries, instructions, greetings under a name |
| **Meta** (`.t-meta`) | 12px | 16px | 400 | One short label only — e.g. `Maths · Number bonds · Year 1` |
| Button label | 14px | 20px | 700 | On buttons only |

Avoid 32px titles and extra mid sizes on learning screens unless a rare celebration screen needs them.

**Rules**

- Default pattern: **Big title → Normal sentence → primary button**. Optional single Meta line above the title.
- Do **not** stack multiple Meta lines. One is enough.
- Supporting copy under a name/title must be **Normal (16px)**, not Meta.
- Never show adult/teacher jargon to kids (mastery %, curriculum refs, ability bands, “expected”). Keep that in data for agents — not on the Start screen.
- Body line length ≈ 40–70 characters.
- Brand mark stays small in the header; the activity/question title is the hero.

---

## Spacing (8px system)

Wonder Blocks spacing we use:

| Token | px | Typical use |
| --- | --- | --- |
| `--space-1` | 4 | Icon gaps |
| `--space-2` | 8 | Tight related items |
| `--space-3` | 16 | List item gaps, option gaps |
| `--space-4` | 24 | Inside-card section gaps |
| `--space-5` | 32 | Card padding |
| `--space-6` | 48 | Between major page blocks |
| `--space-7` | 64 | Top/bottom page padding on desktop |

**Rules**

- All padding/margin/gap values must be from this scale (6px/12px only if matching WB secondary — prefer the primary ladder).
- Activity question card: **32px** padding mobile, **32–40px** desktop.
- Gap between answer options: **16px** (never 8px — kids miss-tap).
- Do not nest cards inside cards.
- Progress bar sits in its own quiet row: 8px tall track, 16px below header, 24px above the question card.

---

## Shape & elevation

| Element | Radius | Border | Shadow |
| --- | --- | --- | --- |
| Buttons | 4px | none (filled) or 1px | none |
| Answer options | 8px | 1px `--off-black-16` | none |
| Content cards | 8px | 1px `--off-black-16` | none |
| Inputs | 4px | 1px `--off-black-16` | none |
| Avatar chips | 9999px | 1px | none |
| Modals / onboarding panel | 12px | 1px | optional soft `0 8px 24px rgba(33,36,44,0.08)` |

**Rules**

- Learning UI: **flat**. If you want depth, use background contrast (`off-white` page vs `white` card), not drop shadows.
- No 22–28px “blob” radii on answer tiles.
- No multi-layer coloured shadows.

---

## Components

### Primary button

- Height ≥ 48px (kids), horizontal padding 24px
- Background `--blue`, text white, weight 700, 16px
- Full width on mobile in activities; auto width OK on desktop if right-aligned like KA Check
- Disabled: 40% opacity, not a grey redesign

### Secondary button / exit

- Text or quiet outline; `--off-black-64`
- Never compete with Check

### Answer option (multiple choice)

```
[  16px pad  ]
[  56px+ min height  ]
[  1px border off-black-16, radius 8  ]
[  Body 16/22, weight 700 for the label  ]
Selected: border blue + background blue-soft
Checked correct: border green + green-soft (only after Check)
Checked wrong: border red + red-soft (only after Check)
```

Stack options **vertically** with 16px gap. Prefer one column. Do not use emoji as the main answer — numbers/words are enough; optional small leading visual only if it teaches.

### Feedback panel

- Appears **under** the options after Check, 16px gap
- Correct: green-soft bg, green title “Correct”, body explanation in off-black
- Incorrect: red-soft bg, red title “Not quite”, then explanation
- Keep to 2–4 short sentences. Teach, don’t scold.

### Progress

- Thin bar (8px), track `--off-black-8`, fill `--blue`
- Counter meta on the right: `3 / 10` in 12–14px `--off-black-64`
- No cartoon trophies mid-question

### Home activity row (KA “Get started” pattern)

One row per activity:

- White card, 1px border, 8px radius, 24–32px padding
- Left: title (20/28 bold) + one body line + meta line
- Right: status pill (meta) + chevron
- Entire row is the hit target
- No subject-coloured left rails, no big emoji headers

---

## Screen recipes

### Onboarding

- Off-white page, single centered white panel (max-width ~480px)
- Small teal/leaf brand mark + “Primary Path” in 14px label
- One heading: “What’s your name?” (Title or Heading — pick one)
- One short body line
- Name field, then avatar row (simple circles), then one primary button “Continue”
- No hero gradients, no floating avatar animation required

### Home

- Quiet top bar: avatar circle + “Hi, {name}” + optional reset as text link
- Filters as simple selects or chips — secondary, not a control panel
- Activity list as stacked rows (see above)
- Empty state: one sentence + one hint. No illustrations required.

### Activity intro

Only this, in order:

1. Back text link
2. One Meta line: `Maths · Number bonds · Year 1`
3. Big title
4. One Normal summary sentence
5. Primary button: “Start”

Do **not** show minutes, question counts, mastery %, ability, or curriculum references on this screen.

### Activity question (most important)

```
[ Exit          3 / 10 ]
[ ======progress====== ]
[                      ]
[ Question prompt      ]  ← Heading 24/32
[                      ]
[ Option               ]  ← 16px gaps
[ Option               ]
[ Option               ]
[                      ]
[ (hint text link)     ]
[ [     Check      ]   ]  ← primary, full width mobile
```

- Only the current question on screen
- Hint is a text link, not a banner, until opened
- After Check: feedback block, then button becomes “Continue”
- Summary screen: big percent, one sentence, two actions (Try again / Home) — still flat

---

## Motion

Keep motion rare and purposeful (KA is restrained).

Allowed:

- 150–200ms fade/ease on feedback appear
- Progress bar width transition

Forbidden on learning screens:

- Continuous float/bounce on mascots
- Confetti every correct answer
- Staggered list “rise-in” spam
- Scale-pop on every tap

`prefers-reduced-motion: reduce` disables the rest.

---

## Accessibility (kids + WCAG)

- Text contrast: off-black on white / off-white (≥ 4.5:1)
- Don’t use colour alone for correct/incorrect — include the word “Correct” / “Not quite”
- Focus ring: 2px `--blue` offset 2px
- Hit targets ≥ 48×48px
- British English copy

---

## Anti-patterns (fix these)

| Don’t | Do instead |
| --- | --- |
| Pastel full-page gradients | Flat `--off-white` |
| Fredoka / chunky display fonts | Lato |
| Green woodland CTA theme | `--blue` CTAs |
| 22px+ rounded “pill cards” everywhere | 8px cards, 4px buttons |
| Four stat tiles on activity intro | One meta row |
| Emoji wallpaper answers | Clear text/number options |
| Nested cards + shadows + borders | One surface |
| Tiny 8px gaps between options | 16px |
| Mixing 5+ font sizes on one screen | ≤ 3 roles |

---

## Agent checklist before shipping UI

1. Does the screen have **one** primary action?
2. Are colours only from the table above?
3. Is type only from the scale above (Lato)?
4. Are all spacings on the 8px ladder?
5. Is the activity question calm: prompt → options → check?
6. Would this still look tidy on a phone held by a Year 1 child?

If any answer is no, fix before pushing to `main`.
