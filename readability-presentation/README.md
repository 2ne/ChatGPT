# Readability Under Pressure

An interactive presentation about writing engineering documentation
consciously, so the next person can understand and act on it.

The deck opens with Apollo 13 as a short hook, then connects readability
to Cleary’s research platform, AI agents, MCPs and M&A workflows. It ends
with three writing habits and one documentation check in the pull request.

## Status

Complete. GitHub Pages deployment is configured for the project-specific URL:

https://2ne.github.io/ChatGPT/readability-presentation/

## Experience

- Continuous scroll storytelling with keyboard control for every narrative beat
- Fact-checked Apollo 13 and Mission Control opening
- Cleary-specific examples covering M&A research, agents, permissions and citations
- Animated code and wiki-page comparison
- Interactive agent-diagnosis choice
- One pull-request documentation check
- Fixed presentation viewport and reduced-motion support

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
  - `→` / `↓` / `Page Down` / `Space`: next section
  - `←` / `↑` / `Page Up`: previous section
  - `Home` / `End`: first / last section
- Mouse wheel scrolling still works if you want a slower cinematic pace.
- Use the browser's own full-screen mode (`F11`) if needed.

## Key decisions

- Apollo is only the opening metaphor; the talk exits it early and stays
  on conscious documentation habits for engineers.
- The opening uses NASA’s chronology for the Apollo 13 accident and air-to-ground transcript.
- Cleary green is the accent colour on dark and light surfaces.
- Typography uses self-hosted Inter Variable, with `liga` / `calt` / `kern`
  enabled and letter-spacing derived from Inter Dynamic Metrics
  (`tracking = a + b × e^(c × size)`).
- All assets (fonts and imagery) are served locally so the deck cannot
  break on a flaky network during a live screen share.
- The hero opens on a quiet Apollo 13 air-to-ground transcript; the finale
  Earth remains a NASA photograph so the deck ends back home.
- The examples reflect the team’s legal-tech work rather than generic SaaS documentation.
- The PR mock-up uses one documentation decision rather than a second checklist.
- AI is positioned as a drafting aid; humans still own technical truth,
  missing information and the final edit.
- The production build is fully static and deployed through GitHub Actions.
- Each monorepo project is published beneath its own GitHub Pages path.

## Sources for the Apollo opening

- NASA, “Detailed Chronology of Events Surrounding the Apollo 13 Accident”
- NASA, “Apollo 13: Mission Details”
- NASA, “Houston, We’ve Had a Problem”
