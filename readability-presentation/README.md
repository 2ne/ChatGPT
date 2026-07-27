# Readability Under Pressure

An interactive presentation about writing engineering documentation
consciously, so the next person can understand and act on it.

The deck opens with Apollo 13 as a short hook, then moves into modern
software complexity, practical habits, concrete examples, and a single
change to the pull request review process.

## Status

Complete. GitHub Pages deployment is configured for the project-specific URL:

https://2ne.github.io/ChatGPT/readability-presentation/

## Experience

- Continuous scroll storytelling with keyboard control for every presentation beat
- Short Apollo / Mission Control opening, then a clear exit into today’s systems
- Animated code and documentation comparison
- Interactive incident-document choice with three plausible options
- Concrete examples of readable docs (playbook, README, ADR)
- Pull request review checklist tied to three writing habits
- Responsive and reduced-motion support

## Stack

- React and TypeScript
- Vite
- Tailwind CSS
- Inter Variable (self-hosted via `@fontsource-variable/inter`), with Dynamic Metrics tracking
- Framer Motion
- GSAP ScrollTrigger
- Lenis smooth scrolling
- Lucide icons

## Setup

Requires Node.js 22.13 or later.

```bash
npm install
npm run dev
```

## Commands

```bash
npm run dev
npm run lint
npm run build
npm run preview
```

## Presentation controls

- Present over screen share.
- Prefer keyboard section jumps while talking:
  - `→` / `↓` / `Page Down` / `Space`: next presentation beat
  - `←` / `↑` / `Page Up`: previous presentation beat
  - `Home` / `End`: first / last presentation beat
- Mouse wheel scrolling still works if you want a slower cinematic pace.
- Use the browser's own full-screen mode (`F11`) if needed.

## Key decisions

- Apollo is only the opening metaphor; the talk exits it early and stays
  on conscious documentation habits for engineers.
- The 2:17 a.m. opening is explicitly framed as an imagined incident call,
  not the historical time of the Apollo 13 explosion.
- Cleary green is the accent colour on dark and light surfaces.
- Typography uses self-hosted Inter Variable, with `liga` / `calt` / `kern`
  enabled and letter-spacing derived from Inter Dynamic Metrics
  (`tracking = a + b × e^(c × size)`).
- All assets (fonts and imagery) are served locally so the deck cannot
  break on a flaky network during a live screen share.
- The hero opens on a quiet Apollo 13 air-to-ground transcript; the finale
  Earth remains a NASA photograph so the deck ends back home.
- Interactions reinforce the ask: write consciously, leave docs better,
  and put readability inside the PR review.
- AI is positioned as a drafting aid; humans still own audience, judgement
  and whether the result is clearer than before.
- The production build is fully static and deployed through GitHub Actions.
- Each monorepo project is published beneath its own GitHub Pages path.
