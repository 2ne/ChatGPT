# Readability

An interactive workshop about making engineering documentation easier for
another person to understand and use.

The presentation opens with Apollo 13, defines readability as the effort
required to understand what somebody has written, introduces Flesch Reading
Ease as one signal, and applies the same quality bar used for code review to
documentation. It then covers AI-assisted writing and review before moving
into three live A/B examples and a human-centred closing.

## Status

Complete. GitHub Pages deployment is configured for:

https://2ne.github.io/ChatGPT/readability-presentation/

Speaker notes open at:

https://2ne.github.io/ChatGPT/readability-presentation/presenter.html

## Experience

- Eighteen sections with twenty speaker beats
- Restrained black and off-white visual system with Cleary green used only for emphasis
- Large type, generous spacing and one main idea per screen
- Fact-checked Apollo 13 opening at 9:08 p.m. on 13 April 1970
- NASA requirements and review guidance with links to the primary sources
- Interactive Flesch Reading Ease comparison
- One pull-request documentation check
- AI readability review with specific, teachable feedback
- Team-owned documentation skill example
- Before-and-after metrics using the text shown on screen
- Three live A/B workshop examples with a B, A, B answer pattern
- Three-part closing that keeps the espresso line and ends on the human test
- Keyboard navigation, reduced-motion support and optional speaker notes

## Stack

- React and TypeScript
- Vite
- Inter Variable, served locally
- Framer Motion
- GSAP ScrollTrigger
- Lenis
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

- `→`, `↓`, `Page Down` or `Space`: next speaker beat
- `←`, `↑` or `Page Up`: previous speaker beat
- `Home` or `End`: first or final beat
- `N`: open or close the script for the current beat
- `Escape`: close speaker notes
- Use the browser's full-screen mode when presenting

The workshop interactions use buttons. Keyboard navigation ignores presentation
shortcuts while a button or link has focus.

## Key decisions

- The supplied script is stored in the presentation as speaker notes and mapped
  to the twenty keyboard-controlled beats.
- The website supports the spoken script rather than placing every sentence on
  screen.
- The cleaner pre-workshop deck is the visual reference: minimal cards, very
  few icons, a limited type scale and no secondary accent colours.
- Cleary green remains the accent, with a darker accessible green for text on
  light surfaces.
- The Apollo material establishes the need for shared understanding, then the
  presentation moves into everyday engineering documentation.
- Flesch Reading Ease is presented as a signal, not a target. The live scores
  are labelled illustrative because syllable counting is calculated locally.
- The PR mock-up keeps one documentation check and removes unnecessary pull
  request chrome around it.
- AI feedback always identifies a problem, explains it and points towards a
  specific edit.
- The three workshop examples use realistic setup, permissions and AI review
  content. The stronger answer changes sides in the second example.
- Images and fonts are local so the presentation does not depend on the network
  during screen sharing.

## Sources

- [NASA: Apollo 13 mission details](https://www.nasa.gov/missions/apollo/apollo-13-mission-details/)
- [NASA Systems Engineering Handbook: Appendix C, How to Write a Good Requirement](https://www.nasa.gov/reference/appendix-c-how-to-write-a-good-requirement/)
- [NASA STI review guidance](https://nodis3.gsfc.nasa.gov/displayCA.cfm?Internal_ID=N_PR_2200_002C_&page_name=Chapter4)
- [Rudolf Flesch: A New Readability Yardstick](https://doi.org/10.1037/h0057532)
