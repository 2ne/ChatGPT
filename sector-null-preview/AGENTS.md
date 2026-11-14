# Preview boundary

This is the independent Room 2 preview. Implement preview changes here, build
with `npm run build`, and deploy through the existing Pages workflow to
`/sector-null-preview/`. The public game source is `../sector-null/` and must not
be changed or replaced as part of preview work.

## QA wave jump (keep working)

Preview-only balance tool — do not remove or break these params:

| Param | Meaning |
|-------|---------|
| `?dev=wave=<N>` | Start at wave N in the correct room with a realistic simulated build |
| `?dev=bay` | Shorthand for wave 11 in the Defence Bay |
| `?dev=bay&wave=<N>` | Wave N in the bay (N ≥ 11) |
| `&build=<seed>` | Repeatable loadout |
| `&upgrades=0` | Bare start (no simulated picks) |
| `&coil=<0-3>` | Override Tesla Coil rank |

Implementation lives in `game.js` (`parseQaWaveTarget`, `roomForWave`,
`applyQaWaveLoadout`, `bootQaWaveStart`). Picks = `N − 1` clears through the live
`pickUpgradeOffers` / `apply()` path. Coil ranks 1/2/3 are forced on clears
11/12/13 (count as picks). When adding rooms, extend `roomForWave` and the boot
placement. Stage 6: push `COIL_UPGRADE` from `upgrades.js` into `UPGRADES` — do
not re-implement rank math (`coilStatsForRank`).

## Bay combat

Room 2 runs waves from 11 onward after the wave-10 handoff. Bay enemies take a
1.5× HP multiplier. Waves 11–12 are calmer counts with gunner/heavy mix; 13
soft-ramps then joins room 1’s curve. The Tesla coil is live from wave 11 with
ranked stats (`coilStatsForRank`: rank 0 base → rank 3 max). The upgrade card
itself is Stage 6 and must not join the in-game picker until that stage. Bay
wallBoxes always leave the four door gaps clear (room-1 style); intact doors
block via opening HP, not sealed slabs. Follow James's conventions: matte
materials, merged/instanced static geometry, no extra shadow lights, separate
depth layers for overlapping trim, smooth motion, reduced motion respected,
cheap on phones.
