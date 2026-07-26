# Readability Under Pressure

An interactive presentation about treating engineering documentation with the
same care as code.

The presentation uses Apollo 13 as its opening narrative, moves into modern
software complexity, and ends with a practical change to the pull request
review process.

## Status

Complete. GitHub Pages deployment is configured for the project-specific URL:

https://2ne.github.io/ChatGPT/readability-presentation/

## Experience

- Continuous scroll-based storytelling
- Apollo and Mission Control opening
- Animated code and documentation comparison
- Interactive audience challenge
- Pull request review and documentation checklist
- Full-screen presentation mode
- Keyboard navigation
- Responsive and reduced-motion support

## Stack

- React and TypeScript
- Vite
- Tailwind CSS
- Inter (from [rsms.me/inter](https://rsms.me/inter/)), with Dynamic Metrics tracking
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

- Scroll, `Space`, `Page Down` or the right arrow to move forwards.
- `Page Up` or the left arrow to move backwards.
- Press `F` or select **Present** to enter full-screen mode.

## Key decisions

- The experience is a single narrative rather than a collection of slides.
- Apollo gold is the only accent colour.
- Typography uses Inter Variable from the official RSMS CDN, with
  `liga` / `calt` / `kern` enabled and letter-spacing derived from Inter
  Dynamic Metrics (`tracking = a + b × e^(c × size)`).
- Section navigation goes through Lenis (`scrollTo`) so keyboard and
  present controls stay in sync with smooth scrolling.
- Interactions are used to involve the audience, not to decorate the page.
- AI is positioned as a writing aid while humans remain responsible for
  clarity, audience and judgement.
- The production build is fully static and deployed through GitHub Actions.
- Each monorepo project is published beneath its own GitHub Pages path.
