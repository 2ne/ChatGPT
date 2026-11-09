# Sector Null

A top-down sci-fi survival shooter and competition remix of [Abandon All Hope by Josh Werner](https://codepen.io/editor/joshwerner/pen/01a18d27-5cbe-77c4-9685-9f3836db15e6). Keep the reactor deck clear as rogue security units breach the bulkheads. After each wave, the operator stands still while you choose an upgrade.

## Status

Playable first build. The wave system, enemy pathing, destructible entrances and character animation are adapted from the supplied original. Sector Null has a new Three.js reactor deck, armoured operator, security drones, interface and procedural Web Audio effects. The Core Zero art direction informed the smoked glass, machined hardware and cyan and amber lighting. Score, high score and settings are saved in the browser.

Scoring, emerald pickups, accuracy and high-score rules are documented in [SCORING.md](./SCORING.md).

## Enemy roles and wave bosses

Each wave ends with one larger red boss after all regular bots are defeated. The boss has a named health bar, extra armour and reduced knockback; the upgrade choice opens only after it dies. Boss health uses a moderated per-wave curve (`6 + 1.3×wave + 0.1×wave²` times the wave's base health), with milestone attack patterns every fifth wave. Wave 1 contains grey patrols. Bosses rotate through four named tricks: Slammer (wide slam melee), Charger (rush and swipe), Cannon / Skirmisher (volley or flank), and Spawner (peels off spawns that later reform into the core). Cannon appears from wave 3 with charged volleys. All bots share the same hunt pathing; locomotion differs by role (walk, wheels, skitter, stomp). Enemy shots stop at cover and are cleared between combat phases.

Early upgrade picks bias toward firepower, and Split Beam is guaranteed among the first two wave-clear offers if you have not taken it yet.

| Bot | First wave | Health multiplier | Movement and attack |
| --- | --- | --- | --- |
| Grey Patrol | 1 | 1× | Walking pursuit and melee strike |
| Cyan Flanker | 2 | 0.7× | Wheeled, faster, smaller |
| Purple Pulse Gunner | 3 | 1.25× | Walking strafe at range, charged bolts |
| Gold Bulwark | 4 | 2.5× | Stomping heavy; wind-up strikes deal 2 shield damage |
| Slammer | Wave 1, 5, 9… | Boss curve | Wide slam strikes |
| Charger | Wave 2, 6, 10… | Boss curve | Charges the operator and swipes |
| Cannon / Skirmisher | Wave 3, 7, 11… | Boss curve | Charged volleys from wave 3, or fast pressure earlier |
| Spawner | Wave 4, 8, 12… | Boss curve | Spawns runners that later return to the core |

Health multipliers apply to the wave's base health and round up. Boss melee and projectiles deal 1 shield damage. Projectile speed stays at 8 units/second and enemy movement caps at 5.5, below the operator's base speed. Colour identifies the role; size, cannon silhouettes, movement and introduction banners provide additional cues.

## Navigation and power-up feedback

Uncollected supplies expire after 6 seconds of active play. During the final 2 seconds they blink twice per second and their ground ring shrinks. Reduced-motion mode keeps them visible and uses only the shrinking ring. Drop timers pause while choosing an upgrade or pausing the game.

Bots plan around both cover and bulkheads using navigation graphs sized to their bodies. Routes refresh as the target moves, with stable corner choices to limit jitter. Movement checks clearance before stepping, turns in place for sharp corners, and limits steps at waypoints. Ranged strafing uses the same navigation; crowd separation avoids pushing bots into obstacles. Melee attacks cannot pass through solid cover.

Power-ups light the operator orange for Overcharge and blue for Infinite Cell with a strong pulsing glow (steady under reduced motion). Peaks flash toward white so the buff feels active. If both are active, the torso and limbs pulse on separate phases. Shield kits produce a short pink glow. Repeat Overcharge pickups add 10 seconds and Infinite Cell pickups add 8 seconds to the remaining duration; damage stays at 2×. Extra stored time strengthens the glow and shows EXTENDED beside the effect description.

## Run locally

Use Node.js 22 or later.

```sh
npm ci
npm run dev
```

`npm run build` writes a static site to `dist/`. Use `npm run preview` to serve that build locally. The browser needs WebGL. The menu track loops across the intro and main menu. If the browser blocks autoplay, use the title screen's Start prompt to enable sound. Selecting Play switches to the gameplay score.

The gameplay score uses the full-length loops in `assets/score/`. Wave-start and wave-clear stingers are disabled to avoid overlapping cues. Clearing a wave crossfades over 0.9 seconds into the upgrade loop at 38% gain with a 1 kHz low-pass filter, giving the break a quieter, softer sound. Combat music fades back in only when the next wave starts. Waves 1–4 use the early loop and wave 5 onward uses the late loop. Wave 4 switches on the next bar with a 0.6-second crossfade if eight drones are alive at once. The late loop has a 0.65 gain trim to compensate for its louder recording; overall gameplay score gain is 3.8, down from 5.5. Pausing freezes the music and wave timing together.

Supply pickup notices appear one at a time. The first pickup of each type in every run shows a short explanation for 4.5 seconds: +1 Shield restores one shield, Overcharge doubles damage for 10 seconds, and Infinite Cell gives unlimited ammo for 8 seconds. Later pickups in the same run show only the name. Learning notices take priority over routine notices without interrupting another explanation. Their reading timer waits until the upgrade picker is fully closed. Lesson history resets each run, so an earlier session cannot suppress a new explanation.

The bottom-right weapon display shows your current magazine and adds visible rifle parts as you pick weapon upgrades.

The pulse rifle uses a low, weighty energy pulse with a short midrange attack and bass impact. The recharge hum is subdued, with a single soft ready tone. Shot pitch gradually drops by up to three semitones as the cell empties. At one remaining charge, a low-energy beep and amber LAST CHARGE label warn you; recharging shows RECHARGING… and a progress bar. A power-down tone leads into a rising charge hum timed to the recharge duration, followed by a ready chirp and cyan CELL READY label. These labels also appear on mobile. Infinite Cell keeps full-energy shot pitch and suppresses low-charge warnings and manual recharging. Pausing freezes the charge audio; interrupted recharges stop their hum.

Destroyed drones burst into sparks and scattered parts. Reduced-motion settings suppress the blast flash and cut the spark count.

| Action | Keyboard and mouse | Touch |
| --- | --- | --- |
| Move | WASD or arrow keys | Plant and drag on the left side (also turns the gun) |
| Aim and fire | Mouse and left click | Plant the right thumb to fire; drag to aim independently |
| Recharge | R | Recharge button |
| Pause | Esc or P | Pause button |
| Choose an upgrade | 1–3 or click | Tap a card |
| Mute | M or volume settings | Volume settings |

Touch sticks are dynamic: each thumb creates a virtual stick where it lands. If a thumb drifts past the rim, the stick base follows so full input is kept. The right stick starts firing as soon as it is held, using the current facing until you drag to steer.

## Engineer and defence paths

Upgrade cards show a visual preview, explicit rank, current build and a larger recommended option. Recommendations favour an urgently needed shield, a first Split Beam, or continuing owned equipment. All three cards remain deliberate choices; nothing is automatically selected. Use 1–3, tap, or Tab and Enter. Offers include an engineer option whenever an eligible one remains, and owned modules receive higher offer weight.

- **Helper Bot (3 ranks):** follows and fires automatically; ranks increase shot damage and firing speed. Specialise in **Twin Guns (2 ranks)** for doubled shots then faster firing, or **Bomb Launcher (2 ranks)** for slower area blasts then a wider blast. These specialisations are mutually exclusive for that run. Bot fire does not affect rifle accuracy bonuses.
- **Trail Mines (3 ranks):** automatically deploy every 4–3 seconds; ranks improve damage and blast radius. Up to six mines last 18 seconds and arm after 0.6 seconds. **Shock Mines** adds a 60% movement slow for three seconds to blast survivors.
- **Shield Regen (2 ranks):** restores one shield after 12/8 seconds without damage, repeating while injured. **Emergency Pulse (3 ranks):** taking damage triggers an area blast and brief slow; ranks increase range and damage.

Equipment uses active combat time and pauses with the game or upgrade selection. Mines, warning zones and effects clear between waves; all equipment resets for a new run. Automated equipment deliberately adds no touch buttons.

## Milestone encounters

Waves 5, 10, 15 and onward in multiples of five replace the regular boss with the Reactor Warden / Null Overseer. Reactor lighting gradually shifts to amber or violet during the encounter. The boss marks three ground zones (four from wave 10) with a 1.4-second warning before striking. Its exposed phase grants 75% bonus incoming damage for 3.2 seconds, followed by pursuit before the next cycle. Move out of the marked rings and use that opening to attack.

Boss base health scaling is now `6 + 1.3×wave + 0.1×wave²` times regular wave health; milestone bosses use 1.2× this value. This reduces health-only attrition while new attack patterns provide pressure. Remaining emeralds are banked automatically at victory, including the final boss drop, before the upgrade screen opens.
