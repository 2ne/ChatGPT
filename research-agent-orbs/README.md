# Research agent orbs

Six lightweight 3D pixel-wave directions for a research agent. Every concept is shown at its intended 64 × 64 pixel size, responds to light and dark mode, and is built with CSS transforms and a small amount of vanilla JavaScript.

## Live prototype

https://2ne.github.io/ChatGPT/research-agent-orbs/

## Status

Second visual exploration ready for review. The gallery includes theme and motion controls, with all concepts rendered at the intended product size.

## Run locally

No installation or build step is required. Serve this directory with any static web server, for example:

```bash
python3 -m http.server 4173
```

Then open `http://localhost:4173`.

## Implementation

- No runtime dependencies
- No canvas, WebGL or Three.js
- CSS `perspective`, `rotateX`, `rotateY` and `translate3d` for spatial depth
- JavaScript-generated pixel fields with no runtime dependency
- Respects `prefers-reduced-motion`
- Keyboard-visible focus and semantic controls

## GitHub Pages

The project is published at `/ChatGPT/research-agent-orbs/` by the repository's aggregate Pages workflow.

## Key decisions

- The concepts use one green research-agent palette so geometry and motion are easier to compare.
- Light and dark modes alter the surfaces and contrast while preserving the orb identity.
- The animation language is measured rather than playful: scanning, mapping, connecting and resolving.
- Every gallery preview is rendered at exactly 64 × 64 pixels.
