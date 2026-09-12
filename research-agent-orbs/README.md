# Research agent orbs

A 64 × 64 pixel lattice orb for a research agent, animated only with CSS. Light and dark themes are toggled in the preview.

## Live prototype

https://2ne.github.io/ChatGPT/research-agent-orbs/

## Status

CSS lattice orb ready for review. The page is a centred 64px globe with a light/dark control.

## Run locally

No installation or build step is required. Serve this directory with any static web server, for example:

```bash
python3 -m http.server 4173
```

Then open `http://localhost:4173`.

## Implementation

- No JavaScript, canvas, WebGL or runtime dependencies
- 56 Fibonacci-sphere points authored in HTML
- Registered custom properties animate turn, tilt, contraction and scan
- `sin()`, `cos()` and `pow()` reconstruct projection, lighting and the travelling meridian
- Theme switching uses `:has()` on the light/dark radios
- Orb motion, projection and pixels live in `orb.css`; page theme and the light/dark control live in `styles.css`

## GitHub Pages

The project is published at `/ChatGPT/research-agent-orbs/` by the repository's aggregate Pages workflow.

## Key decisions

- The orb uses a restrained green research-agent palette.
- Light and dark modes alter contrast while preserving the orb identity.
- The preview is rendered at exactly 64 × 64 pixels.
- The orb is formed only from solid dots, with no glow, outline, highlight or background gradient.
- Opaque shades are mixed in OKLab relative to the theme green, with a fixed above-left light direction.
- Every eight seconds the sphere gathers inward, overshoots slightly, then settles.
- CSS keyframes cannot accumulate the extra 24° gather turn the JavaScript prototype used, so the CSS orb keeps the gathering scale without that extra yaw.
- Needs registered custom properties and CSS math functions. Older browsers show a static first pose.
