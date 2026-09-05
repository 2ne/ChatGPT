# Treadmill Coach

A programmed treadmill session: pace, music and coaching share one master timeline.

The public prototype is built for a phone. Open it, set Hype, start the session, and the soundtrack should feel written against the workout instead of shuffled beside it.

## Live prototype

https://2ne.github.io/ChatGPT/treadmill-coach/

## Status

Usable first version in the ChatGPT Pages workspace. Continuity is the default for music. A track change needs a reason.

## What it does

- Builds a warm-up → build → hard → recovery → peak → cool-down session from the Hype control
- Keeps one authoritative clock for treadmill speed, coaching and music
- Leaves the current song playing unless the next workout moment needs a different musical state
- Prefers an upcoming build, chorus or drop in the current track before changing songs
- Speaks short, purposeful coaching lines with event-specific voice direction

## Speech: local OpenAI vs public Pages

GitHub Pages is static hosting. It cannot safely run a server-side `/api/speech` route, and this project never puts an OpenAI key in the browser bundle.

| Environment | Voice |
| --- | --- |
| Public GitHub Pages | On-device `speechSynthesis`. No API key. Safe to open on a phone. |
| Local `npm run dev` | Optional OpenAI `gpt-4o-mini-tts` via a Vite `/api/speech` endpoint. The key stays on the local server. If the key is missing or the request fails, the app falls back to the browser voice. |

Do not add `VITE_OPENAI_API_KEY` or any other client-exposed secret.

Local setup:

```bash
cp .env.example .env
# Put OPENAI_API_KEY=... in .env  — server-side only
npm install
npm run dev
```

The `.env` file is gitignored.

Even when OpenAI is used locally, coaching energy comes from generated **voice instructions**, not from the words alone. Debug mode shows the exact instruction string for every line.

## Music continuity

The runtime asks `shouldChangeTrack(...)` before every potential change. The default answer is no.

It will change only for a strong reason:

- the current track is ending
- treadmill speed or intensity is about to change materially and the current song cannot support it
- the current section is clearly unsuitable and no useful later section is coming
- recovery is starting and the current music is far too intense
- a peak is starting and the current music cannot lift

It will not change because:

- an internal workout section began
- another track has a slightly closer BPM
- another track has a slightly better energy score
- the current song has been playing for a fixed number of minutes

Hype changes how often the coach speaks and how sharp the workout contrast is. It does not license random track switching.

## Stack

- React and TypeScript
- Vite
- Tailwind CSS
- Original generated soundtrack in `public/music/`
- Vitest for experience-focused engine tests

## Commands

Requires Node.js 20 or later.

```bash
npm install
npm run dev
npm test
npm run typecheck
npm run build
npm run preview
```

`npm run generate:music` rebuilds the original MP3s. That is only needed if the soundtrack recipe changes.

## GitHub Pages

The app is published at `/ChatGPT/treadmill-coach/` from the existing aggregate Pages workflow. Vite `base` is `/ChatGPT/treadmill-coach/` so JavaScript, CSS and music resolve on that subpath.

The public build always uses browser speech.

## Key decisions

- There was no treadmill folder in this repository, so the prototype was added as a self-contained `treadmill-coach/` app and folded into the existing Pages deploy without replacing Snip or the readability workshop.
- Music metadata includes section type and section energy. BPM is secondary.
- Pause and resume stop the shared clock, the soundtrack and speech together.
- Debug mode records every considered music transition, including `continuity_preferred` rejections, and every coaching line with its OpenAI-style voice instruction.
