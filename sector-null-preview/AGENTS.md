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

Implementation lives in `game.js` (`parseQaWaveTarget`, `roomForWave`,
`applyQaWaveLoadout`, `bootQaWaveStart`). Picks = `N − 1` clears through the live
`pickUpgradeOffers` / `apply()` path. When adding rooms, extend `roomForWave` and
the boot placement. When adding upgrade cards (Stage 6 Tesla Coil id `coil`,
etc.), add them to `UPGRADES` — the sim picks them up automatically; optional lean
weights go in `DEV_CHOICE_LEAN`.

## Bay combat

Room 2 runs waves from 11 onward after the wave-10 handoff. Bay enemies take a
1.5× HP multiplier. Waves 11–12 are calmer counts with gunner/heavy mix; 13
soft-ramps then joins room 1’s curve. The Tesla coil is active at base strength
from wave 11 (2s interval, range 8, 2 targets, damage = bay cyan HP); the Tesla
Coil upgrade card (ranks 1–3) is Stage 6 and must not be added until that stage.
Bay wallBoxes always leave the four door gaps clear (room-1 style); intact doors
block via opening HP, not sealed slabs. Follow James's conventions: matte
materials, merged/instanced static geometry, no extra shadow lights, separate
depth layers for overlapping trim, smooth motion, reduced motion respected,
cheap on phones.
