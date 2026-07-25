# Readability Under Pressure

An interactive presentation about treating engineering documentation with the
same care as code.

The presentation uses Apollo 13 as its opening narrative, moves into modern
software complexity, and ends with a practical change to the pull request
review process.

## Status

Complete and deployed:

https://readability-under-pressure.abuzz-pin-8545.chatgpt.site

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
- Next.js App Router through Vinext
- Tailwind CSS
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
npm test
```

## Presentation controls

- Scroll, `Space`, `Page Down` or the right arrow to move forwards.
- `Page Up` or the left arrow to move backwards.
- Press `F` or select **Present** to enter full-screen mode.

## Key decisions

- The experience is a single narrative rather than a collection of slides.
- Apollo gold is the only accent colour.
- Interactions are used to involve the audience, not to decorate the page.
- AI is positioned as a writing aid while humans remain responsible for
  clarity, audience and judgement.
