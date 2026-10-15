# Prototype to pilot

A working front-end prototype of the missing layer between a vibe-coded demo and something a law firm could actually take to Risk, InfoSec, Technology and users.

It is not a governance dashboard. It behaves like an experienced colleague: inspect a prototype, keep working, interrupt only when a real decision is needed, and **change the prototype itself** as you talk.

## Live prototype

https://2ne.github.io/ChatGPT/prototype-to-pilot/

## Status

Presentable hackathon demo. Scripted Matter Brief walkthrough with a live in-browser mock of the app. No backend.

## Demo path (~3 minutes)

1. **This repository** — click *Analyse this repository*.
2. **Scan, then the app** — Matter Brief boots at `localhost:5173`. Generate a brief; Network shows `api.openai.com` in red.
3. **Data** — *Yes, but only within firm-approved infrastructure.* Watch summarise.ts rewrite, SSO appear, Network flip to `models.internal.firm`.
4. **Ownership** — *The disputes practice.*
5. **Citations** — *Yes. Add citations.* Click a marker in the preview. A thin claim is flagged low-confidence.
6. **UX** — can’t be coded away. *Validate it first.* A source-choice flag appears.
7. **Pack** — *Prepare pilot pack.* Branch `pilot-ready`, Hackathon/Pilot toggle, InfoSec and Risk still need a human.

**Start again** is in the header.

## Stack

- React 19 + TypeScript
- Vite
- Tailwind CSS v4

British English throughout.

## Commands

Requires Node.js 20 or later.

```bash
npm install
npm run dev
npm run build
npm run preview
```

Vite `base` is `./` so the built app works under GitHub Pages at `/ChatGPT/prototype-to-pilot/`.

## Key decisions

- The left pane is the live Matter Brief prototype (Preview / Code / Network), not a document. Conversation stays on the right.
- Each decision lands as a short animated diff and a commit on `pilot-ready`.
- InfoSec and Risk drafts never auto-approve.
- Demo replies are seeded; unmatched free text still advances so a live walkthrough cannot stall.
- Fictional matter: *Northharbour Logistics v Pellam Components*.
