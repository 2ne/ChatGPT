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
`pickUpgradeOffers` / `apply()` path. The Tesla Coil card is offered in slot 1
from the wave-11 clear; the sim takes it with seeded realistic probability (never
forced). `&coil=` overrides the final rank. When adding rooms, extend
`roomForWave` and the boot placement. Coil combat numbers stay in
`coilStatsForRank` / `COIL_UPGRADE` in `upgrades.js`.

## Bay combat

Room 2 runs waves from 11 onward after the wave-10 handoff. Bay enemies take a
1.5× HP multiplier (bosses excluded — they use `bossHealthMult` only). Waves
11–12 are calmer counts with gunner/heavy mix; door spawns rotate by spawn
progress (fraction emitted), never more than two mouths hot, south from wave 13.
Wave 13 soft-ramps (south door + mortars), then 14→18 = 28/36/44/50/56 so the
old wave-16 jump is gone; 19+ rejoins `5 + n×3`. Boss HP is quadratic through
wave 10, then +8% of the wave-11 baseline per wave. The Tesla coil is live from
wave 11; the Stage 6 upgrade card (`COIL_UPGRADE`) appears in the picker after
wave 11 is cleared, pinned to slot 1 until rank 3. Timed power-ups pause during
picker, intermission, and scripted transitions. Bay wallBoxes always leave the
four door gaps clear (room-1 style); intact doors block via opening HP, not
sealed slabs. Follow James's conventions: matte materials, merged/instanced
static geometry, no extra shadow lights, separate depth layers for overlapping
trim, smooth motion, reduced motion respected, cheap on phones.
