# Research agent orbs

A lightweight 3D pixel lattice orb for a research agent. It is shown at its intended 64 × 64 pixel size, responds to light and dark mode, and is built with CSS transforms and a small amount of vanilla JavaScript.

## Live prototype

https://2ne.github.io/ChatGPT/research-agent-orbs/

## Status

Selected Lattice direction ready for review. The preview includes theme and motion controls and renders at the intended product size.

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

- The orb uses a restrained green research-agent palette.
- Light and dark modes alter the surfaces and contrast while preserving the orb identity.
- The animation language is measured rather than playful: scanning, mapping, connecting and resolving.
- The preview is rendered at exactly 64 × 64 pixels.
- Rotation is limited to safe viewing angles so the latitude rings never collapse into a flat line.
- Soft volumetric glow replaces the previous circular outlines.
