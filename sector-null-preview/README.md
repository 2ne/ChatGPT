# Sector Null — Room 2 preview

An independent preview of the Defence Bay, entered after clearing wave 10.

**Preview:** https://2ne.github.io/ChatGPT/sector-null-preview/?dev=bay

The public game remains in `../sector-null/` at its existing URL. Changes here
build and deploy only to `/sector-null-preview/`; do not copy them into the public
game unless James asks to release them.

## Status and controls

The `?dev=bay` shortcut starts at the wave-10 upgrade picker. Choose an upgrade
to take the existing automatic walk through the doors. On arrival, a brief wider
camera view introduces the bay, then returns to the normal follow camera. WASD,
touch and controller movement work in the room. The room is still an exploration
preview: wave-11 combat and the coil's gameplay are not implemented. `?dev=mapview`
retains the facility overview. With no query string, the preview starts normally.

This visual pass adds reinforced vented walls, double-sided armoured doors,
taller capacitor pylons, a six-winding coil, a layered walkable octagonal surround,
Room 1-matched interior deck plates (same size, panel palette and material) and
restrained cyan/amber service channels. A dark tiled apron extends 22 world units
around the bay, aligned with Room 1's outdoor grid. It fills the former blank
strip beside the walls and joins the existing exterior without overlapping tiles.
The apron uses one indexed mesh with shallow tile bevels to keep it inexpensive
on phones. The existing shadow
light follows the transition into Room 2. The reveal and coil pulse respect
reduced motion. Room 1 keeps its existing visuals and follow view.

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
