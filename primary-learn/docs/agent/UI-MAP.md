# UI map (screen → file → CSS)

Line numbers below are approximate. Search for the named CSS selectors or comments first.

Do not read all of `src/index.css`. Jump to the region you need. Design rules: [DESIGN.md](../../DESIGN.md).

## Tokens and global

| Concern | Where |
| --- | --- |
| Colour, type, space, radius, shadows | `src/index.css` `:root` (top of file) |
| Type base | `src/index.css` ~line 237 `/* Type */` |
| Layout / page shell | ~284 `/* Layout */` |
| Buttons | ~372 `/* Buttons */` |
| Header | ~503 `/* Header */` |
| Pip SVG motion | ~633 `/* Pip motion */` |
| Shared phrases | `src/data/copy.ts` |

## Screens

| Screen | Components | CSS region |
| --- | --- | --- |
| Onboarding | `src/components/Onboarding.tsx` (or nearby) | ~2855 `/* Onboarding */` |
| Path map (home) | `src/components/PathMap.tsx` | ~3121 `/* Maths map */` |
| Level sheet | `src/components/LevelSheet.tsx` | ~3579 `/* Level sheet */` |
| Activity intro | `src/components/ActivityRunner.tsx` | ~3023 `/* Intro screen */` |
| Question play | `ActivityRunner` + `src/components/questions/*` | ~1201 `/* Question card */`, ~1297 `/* Answer options */`, ~2505 `/* Hint + feedback */` |
| Object tiles | `src/components/ObjectGroup.tsx` (or similar) | object-group / object-token blocks under Answer options |
| End / stars | `ActivityRunner` summary | ~2670 `/* Summary / stars */` |
| Question bank | `src/components/QuestionBank.tsx` | ~3864 `/* Question bank */` |
| Topic wallpaper | `src/components/mascot/MathsWallpaper.ts` via `PathMap` | `.map-zone`, `.map-zone-art`; no fades |
| Bond demonstration | `src/components/questions/BondDemonstration.tsx` | `.bond-demo` |
| Shape questions | `ShapeChoices.tsx`, `ShapePicture.tsx`, `ShapeSvg.tsx`, `src/lib/solidShapes.ts` | `.shape-picture`, `.shape-choice-grid`; SVG flat shapes, lazy Three.js solids |
| Fraction diagrams | `questions/FractionPicture.tsx`, `lib/fractions.ts` | `.fraction-picture`; exact halves/quarters on stems and choice options |
| Arithmetic choices | `MakeTotal` and `MultipleChoice` | `.make-total-sum`, `.make-total-box`, `.option` |
| Mascot | `src/components/mascot/Pip.tsx`, `PipMood.tsx` | Pip motion + app/quest header |

## App shell

| File | Role |
| --- | --- |
| `src/App.tsx` | Routes (`HashRouter`) |
| `src/main.tsx` | Entry |
| `src/index.css` | Design system (semantic classes; keep it) |

Do not rewrite this UI as utility-only Tailwind. Change shared look in CSS once.
