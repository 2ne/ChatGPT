# Sector Null — Scoring

Design notes for run score, emerald pickups, accuracy, and high score.  
(Music loops live in `score.js`; this document is about points.)

## Goals

- Reward killing, clean shooting, and collecting emeralds.
- Create a clear risk/reward: clear a wave fast from long range for a speed bonus, or close in and vacuum emeralds for higher point value.
- Surface **Score** and **High Score** in the HUD, title, and death screen.
- Persist the best score in `localStorage` (`sector-null-highscore`).

## Core loop tradeoff

1. Enemies die and shed **green emeralds** (Geometry Wars–style diamonds) instead of lasting body-part debris.
2. Emeralds **magnet toward the player** the same way supply drops do, but **expire much faster**.
3. Killing hostiles far away ends the wave sooner → better **wave clear speed** bonus, but emeralds often vanish before you reach them.
4. Closing in to collect emeralds is slower combat but worth more points per kill.

## Point sources

| Source | Points | Notes |
| --- | --- | --- |
| Kill — Patrol | 100 | Awarded on death |
| Kill — Flanker | 125 | |
| Kill — Pulse Gunner | 150 | |
| Kill — Bulwark | 200 | |
| Kill — Boss | 800 + 150 × wave | Wave index at spawn |
| Emerald collect | 40 × chain | Chain steps up while grabs stay within 0.75 s; caps at ×8 |
| Accuracy (wave clear) | `round(hitRate × 400 × wave)` | `hitRate = hits / max(1, shots)` this wave |
| Wave clear speed | `round(max(0, par − elapsed) × 35)` | Par seconds scale lightly with wave |

Missed shots still count against accuracy. Pierce hits can credit multiple hits from one shot. Walls / expiry do not.

## Emeralds

- **Look:** Small upright green diamonds with additive glow (Geometry Wars geoms).
- **Spawn:** On kill, replace thrown armour/limb debris. Keep short spark bursts for impact juice. Bosses drop more gems than regulars.
- **Count:** Regular ≈ 3–5; boss ≈ 8–12 (scaled slightly by type size).
- **Lifetime:** ~2.2 s active play (pauses during picker / pause). Final ~0.6 s blinks.
- **Motion:** Idle bob + spin; within magnet range (~5.5) accelerate toward the player like supply drops.
- **Magnetic Gems ability:** Permanent for the run once picked up. Magnet range jumps to ~72 so gems outside the deck walls also surge in, with a stronger pull. Gems still expire — you still have to play for them.
- **Pickup radius:** ~0.75.
- **Uncollected:** Vanish with no points.

Supply drops (shield / overcharge / cell) are timed or instant. Ability drops (Magnetic Gems) are permanent and separate from emeralds themselves.

## Accuracy tracking

Per wave (reset when a wave starts):

- `shotsFired` — each pulse leaving the rifle (split beams count as multiple).
- `shotsHit` — each time a pulse damages a drone.

On wave clear, apply the accuracy bonus, then reset counters for the next wave. Helper bot shots and equipment explosions do not affect rifle accuracy. Collect all remaining emeralds automatically before opening the upgrade picker. On death, award a partial accuracy bonus for the unfinished wave using the same formula.

## High score

- Key: `sector-null-highscore` → `{ score, wave, kills }`.
- Ranked by **score** only.
- Update on death when `score > stored.score` (and score > 0).
- Title **BEST RUN** line shows high score (and wave). Death screen shows `NEW HIGH SCORE` or previous best.
- Legacy `sector-null-best` (kills-ranked) is no longer the primary record; score takes over the title/death “best” display.

## UI

| Place | Content |
| --- | --- |
| HUD top-right | **Score** (live) and **High** |
| Title menu | Best run uses high score |
| Death / Game Over | Final score, wave, bots down + high-score callout |
| Pause | Wave · score |
| Combat toasts | Milestone notices at 10 / 5 / 3 bots left (not 1 — that clashes with the boss finale / picker) |

No floating “+100” spam required for v1; live Score ticking is enough. Emerald chain can optionally flash the score colour briefly.

## Non-goals (v1)

- Online leaderboards
- Separate accuracy meter widget
- Emeralds surviving across the upgrade picker (remaining gems are automatically collected at victory)

## Tuning knobs

Constants live next to the emerald / scoring code in `game.js` so we can retune without redesign:

- Kill values, emerald base, chain window / cap
- Emerald lifetime and magnet radius
- Wave clear par time and speed points per second
- Accuracy bonus scale
