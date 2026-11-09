# Sector Null

A top-down sci-fi survival shooter and competition remix of [Abandon All Hope by Josh Werner](https://codepen.io/editor/joshwerner/pen/01a18d27-5cbe-77c4-9685-9f3836db15e6). Keep the reactor deck clear as rogue security units breach the bulkheads. After each wave, the operator stands still while you choose an upgrade.

## Status

Playable first build. The wave system, enemy pathing, destructible entrances and character animation are adapted from the supplied original. Sector Null has a new Three.js reactor deck, armoured operator, security drones, interface and procedural Web Audio effects. The Core Zero art direction informed the smoked glass, machined hardware and cyan and amber lighting. Best runs and settings are saved in the browser.

## Enemy roles and wave bosses

Each wave ends with one larger red boss after all regular bots are defeated. The boss has a named health bar, extra armour and reduced knockback; the upgrade choice opens only after it dies. Wave 1 contains grey patrols and a melee Warden. Wave 2 introduces cyan flankers and a faster Hunter boss. From wave 3, bosses carry visible shoulder cannons and fire three-shot spreads (five from wave 6), preceded by a one-second charge ring and sound. They lock their aim before firing, allowing the player to dodge. Enemy shots stop at cover and are cleared between combat phases.

| Bot | First wave | Health multiplier | Movement and attack |
| --- | --- | --- | --- |
| Grey Patrol | 1 | 1× | Standard pursuit and melee strike |
| Cyan Flanker | 2 | 0.7× | Faster, smaller, approaches from the side |
| Purple Pulse Gunner | 3 | 1.25× | Strafes at range, visible cannon, charged single bolts |
| Gold Bulwark | 4 | 2.5× | Slow, larger, resists knockback; slower wind-up strikes deal 2 shield damage |
| Red Boss | Every wave | 6 + 0.75 × wave | Larger, durable; alternates faster Hunter and slower Warden variants, armed from wave 3 |

Health multipliers apply to the wave's base health and round up. Boss melee and projectiles deal 1 shield damage. Projectile speed stays at 8 units/second and enemy movement caps at 5.5, below the operator's base speed. Colour identifies the role; size, cannon silhouettes, movement and introduction banners provide additional cues.

## Navigation and power-up feedback

Bots plan around both cover and bulkheads using navigation graphs sized to their bodies. Routes refresh as the target moves, with stable corner choices to limit jitter. Movement checks clearance before stepping, turns in place for sharp corners, and limits steps at waypoints. Ranged strafing uses the same navigation; crowd separation avoids pushing bots into obstacles. Melee attacks cannot pass through solid cover.

Power-ups tint the operator orange for Overcharge and blue for Infinite Cell, with a gentle pulse (steady glow under reduced motion). If both are active, the torso and limbs show separate colours. Shield kits produce a one-second pink glow. Repeat Overcharge pickups add 10 seconds and Infinite Cell pickups add 8 seconds to the remaining duration; damage stays at 2×. Extra stored time strengthens the glow and shows EXTENDED beside the effect description. Glow strength is capped to keep it readable.

## Run locally

Use Node.js 22 or later.

```sh
npm ci
npm run dev
```

`npm run build` writes a static site to `dist/`. Use `npm run preview` to serve that build locally. The browser needs WebGL. The menu track loops across the intro and main menu. If the browser blocks autoplay, use the title screen's Start prompt to enable sound. Selecting Play switches to the gameplay score.

The gameplay score uses the full-length loops in `assets/score/`. Wave-start and wave-clear stingers are disabled to avoid overlapping cues. Clearing a wave crossfades over 0.9 seconds into the upgrade loop at 38% gain with a 1 kHz low-pass filter, giving the break a quieter, softer sound. Combat music fades back in only when the next wave starts. Waves 1–4 use the early loop and wave 5 onward uses the late loop. Wave 4 switches on the next bar with a 0.6-second crossfade if eight drones are alive at once. The late loop has a 0.65 gain trim to compensate for its louder recording; overall gameplay score gain is 3.8, down from 5.5. Pausing freezes the music and wave timing together.

Supply pickup notices appear one at a time. The first pickup of each type in every run shows an explanation beneath its name for 4.5 seconds: shields restore 1 shield, Overcharge doubles damage for 10 seconds, and Infinite Cell refills the magazine and allows firing without reloading for 8 seconds. Later pickups in the same run show only the name. Learning notices take priority over routine notices without interrupting another explanation. Their reading timer waits until the upgrade picker is fully closed. Lesson history resets each run, so an earlier session cannot suppress a new explanation.

The bottom-right weapon display shows your current magazine and adds visible rifle parts as you pick weapon upgrades.

The pulse rifle uses a low, weighty energy pulse with a short midrange attack and bass impact. The recharge hum is subdued, with a single soft ready tone. Shot pitch gradually drops by up to three semitones as the cell empties. At one remaining charge, a low-energy beep and amber LAST CHARGE label warn you; recharging shows RECHARGING… and a progress bar. A power-down tone leads into a rising charge hum timed to the recharge duration, followed by a ready chirp and cyan CELL READY label. These labels also appear on mobile. Infinite Cell keeps full-energy shot pitch and suppresses low-charge warnings and manual recharging. Pausing freezes the charge audio; interrupted recharges stop their hum.

Destroyed drones burst into sparks and scattered parts. Reduced-motion settings suppress the blast flash and cut the spark count.

| Action | Keyboard and mouse | Touch |
| --- | --- | --- |
| Move | WASD or arrow keys | Drag on the left side |
| Aim and fire | Mouse and left click | Drag and hold on the right side |
| Recharge | R | Recharge button |
| Pause | Esc or P | Pause button |
| Choose an upgrade | 1–3 or click | Tap a card |
| Mute | M or volume settings | Volume settings |
