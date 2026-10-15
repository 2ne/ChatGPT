# Prototype to pilot

A working front-end prototype of the missing layer between a vibe-coded demo and something a law firm could actually take to Risk, InfoSec, Technology and users.

It is not a governance dashboard. It behaves like an experienced internal product and technology colleague: inspect a prototype, keep working, interrupt only when a real decision is needed, and change the interface to match the conversation.

## Live prototype

https://2ne.github.io/ChatGPT/prototype-to-pilot/

## Status

Presentable hackathon demo. Scripted Matter Brief walkthrough with working free-text handling. No backend.

## Demo path (~3 minutes)

1. **This repository** — `matter-brief` is already the working tree. Click *Analyse this repository*.
2. **First finding** — after a short scan of the files, the chat opens with what it found. Reply *Yes, but only within firm-approved infrastructure.*
3. **Architecture** — prototype path versus proposed approved production path.
4. **Citations** — reply *Yes. Add citations.* Open a citation in the sample brief.
5. **UX assumption** — reply *Validate it first.* Read the lean validation plan, then *Show me the pilot material.*
6. **Pilot pack** — *Prepare pilot pack.* Drafts only; no automated approval.

Use the filled suggestion to stay on the short path, or type freely. **Start again** is in the header.

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

- Framed as a tool run inside the prototype’s own checkout (`npx prototype-to-pilot` in `matter-brief`). There is no real package.
- After analyse, the conversation stays visible; the workspace changes with the current question (scan, architecture, evidence, validation, readiness, pack).
- The AI continues a quiet analysis in the background and only asks when judgement is required.
- Outputs are drafts for humans. Risk, InfoSec and legal approval remain people.
- Demo replies are seeded; unmatched free text still advances with a sensible recommendation so a live walkthrough cannot stall.
- Fictional matter: *Northharbour Logistics v Pellam Components*.
