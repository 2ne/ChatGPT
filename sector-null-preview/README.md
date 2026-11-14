# Sector Null — Room 2 preview

An independent preview of the Defence Bay, entered after clearing wave 10.

**Preview:** https://2ne.github.io/ChatGPT/sector-null-preview/?dev=bay

The public game remains in `../sector-null/` at its existing URL. Changes here
build and deploy only to `/sector-null-preview/`; do not copy them into the public
game unless James asks to release them.

## Status and controls

After wave 10 the scripted walk enters the bay; the south door slams shut and
wave 11 starts. Waves continue past 20 with no ending. Restart returns to room 1.
`?dev=mapview` retains the facility overview. With no query string, the preview
starts normally.

### Preview QA wave jump (maintain this)

Permanent preview-only tool for balance checks at wave 20 / 30 / 50+:

| URL | Behaviour |
|-----|-----------|
| `?dev=wave=20` | Start wave 20 in the correct room with a simulated build |
| `?dev=wave&wave=20` | Same |
| `?dev=bay` | Shorthand for wave 11 in the Defence Bay |
| `?dev=bay&wave=30` | Wave 30 in the bay |
| `&build=<seed>` | Repeat a loadout (works with any of the above) |
| `&upgrades=0` | Bare start — skip the simulated picks |
| `&coil=<0-3>` | Override Tesla Coil rank (0 base … 3 max) |

- Picks applied = clears before that wave (`N − 1`), through the real offer pool +
  `apply()`, weighted toward common choices, respecting rank caps / prerequisites.
- Tesla Coil is in the live picker (slot 1 after wave 11 until rank 3). The QA sim
  takes it with seeded realistic probability when offered — never forced. `&coil=`
  still overrides the final rank. Combat numbers: `coilStatsForRank()`.
- Room routing: waves ≤10 → room 1; waves ≥11 → bay. Extend `roomForWave()` when
  later stages add rooms; new upgrade cards enter via the shared `UPGRADES` catalog.
- Build summary logs to the console and a second line on the preview stamp.

Waves 11–12 stay calmer in count (14 / 18) but mix in gunners and heavies
(~3+1 / ~4+2). Bay door spawns stagger so only one or two mouths press at a time
(south joins from wave 13 after a short delay). Wave 13 soft-lands (~22) so its
regular-drone HP stays ≤ ~1.5× wave 12, then ramps (28 / 36) toward room 1’s
curve. Every bay enemy (wave 11+) gets a 1.5× health multiplier. Boss HP is
quadratic through wave 10, then linear from the wave-11 value. Bay doors bash
like room 1. The Tesla coil is live from wave 11 (ranked stats); the upgrade
card appears after wave 11 is cleared. Timed power-ups pause while the picker is
open. Bay wall collision always leaves the four door gaps clear (room-1 style).

This visual pass adds reinforced vented walls, double-sided armoured doors,
taller capacitor pylons, a six-winding coil, a layered walkable octagonal surround,
Room 1-matched interior deck plates (same size, panel palette and material) and
restrained cyan/amber service channels. A dark tiled apron extends 22 world units
around the bay, aligned with Room 1's outdoor grid. It fills the former blank
strip beside the walls and joins the existing exterior without overlapping tiles.
The apron uses one indexed mesh with shallow tile bevels to keep it inexpensive
on phones. Exterior fog leaves the first 3 world units outside Room 2 clear,
then gradually fades to the background by 20 units. Room 1's fade is softened
to 1.5–15 units beyond its walls. Both interiors and the connecting walk remain
clear, with no fog switch on arrival; the map overview remains unfogged.
The existing shadow
light follows the transition into Room 2. The reveal and coil pulse respect
reduced motion. Room 1's architecture and follow view are unchanged.

Door shoulders stand clear of the posts, and crossed braces have separate depth
layers on both faces, preventing overlapping trim from flickering on mobile.
The bay doors slide into hollow side cassettes sized for the entire panels, with
front/back skins, enclosed tops and guide tracks. Walls stop outside those
cassettes. Panels stay present throughout opening and closing; the housing hides
them naturally. Opening accelerates and brakes smoothly, and reversing direction
continues from the current position. The smaller Room 1 exit also keeps its
panels present behind the wall during the handoff, without overshoot or a hide pop.

The four cover positions, small solid coil base, room dimensions, doorway widths
and wave-10 handoff are preserved. Only the small coil base blocks movement;
the surrounding platform remains walkable. Static detail and light strips use
merged geometry, with two local non-shadow lights instead of the previous six.

## Setup and commands

Both room exteriors use sparse factory service runs, small cabinets/crates,
grates and access covers instead of tall freestanding supports. Dressing is
visual only, with no collision or gameplay registration. Shared instanced boxes
and merged six-sided pipes use three draw calls and no additional lights.
Door approaches stay open; existing walls, reactors, orange floor strips and
outskirts fog are preserved. Changes remain exclusive to this preview.

The external reactor sits halfway between the facing room walls (z = -17.5),
with its existing collision footprint moved with it and the door route clear.
Room 1's floor stencil reads `01`. Low ventilation/service islands extend the
factory detail into the outer floor areas, using the same three drawing batches.

Use Node.js 22 or later in this folder:

```sh
npm ci
npm run dev
npm run build
npm run preview
```

Build is the check; do not run lint or test suites. Build output goes to ignored
`dist/`. GitHub Actions builds this project separately and copies that output to
its preview URL. Do not commit generated bundles or dependencies.

The source was recovered from `cursor/defence-bay-staged` at `fb88a74` (b236,
Room 2 implementation `334761a`). This replaces the formerly committed compiled
preview with reproducible source on `main`. The source soundtrack files are
preserved; no new dependencies or backend changes are included.

Every build displays a preview number, source commit and London build time.
`version.json` and the preview service worker refresh stale preview shells.
The worker does not delete caches belonging to other projects. Optional build
overrides: `SECTOR_NULL_BUILD`, `PREVIEW_COMMIT`, `PREVIEW_TIME`, and
`SECTOR_NULL_SCORES_API`. Existing leaderboard integration is inherited from
the staged source; this project does not deploy or modify the leaderboard service.
