# Research agent orbs

A lightweight 3D pixel lattice orb for a research agent. It is shown at its intended 64 × 64 pixel size, responds to light and dark mode, and is built with projected DOM dots and vanilla JavaScript.

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
- A single requestAnimationFrame loop projects rotated 3D points into CSS transforms; depth controls size, solid colour and stacking
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
- A continuous 18.5-second turn, gently changing tilt and an occasional inward contraction preserve a spherical silhouette.
- The orb is formed only from solid dots, with no glow, outline, highlight or background gradient.
- Each dot stays circular while the lattice rotates, with 56 evenly distributed particles with a 2 px base size and depth-dependent scaling so the structure reads clearly at 64 pixels.
- A soft travelling meridian scan changes particle size and colour independently of the rotation.
- Pause freezes the exact pose and resumes without jumping. Hidden tabs stop rendering. Reduced motion starts paused, with an explicit Play control available.

- Opaque shades are mixed in OKLab relative to the theme green, with a fixed above-left light direction. No particle opacity is used.
- Every eight seconds, the sphere draws all dots 24% inward over 0.9 seconds, releases over 1.4 seconds to a subtle 1.44% outward overshoot, then settles over 0.5 seconds. Quadratic easing keeps the gesture direct with a gentle bounce.

- A Fibonacci sphere distributes dots evenly instead of leaving gaps between sparse latitude rings.

- Light mode uses pale green rear dots and stronger green front dots; dark mode retains dark rear dots and lighter front dots. Both use opaque colours.
