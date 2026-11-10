# Sector Null

A top-down sci-fi survival shooter and competition remix of [Abandon All Hope by Josh Werner](https://codepen.io/editor/joshwerner/pen/01a18d27-5cbe-77c4-9685-9f3836db15e6). Keep the reactor deck clear as rogue security units breach the bulkheads. After each wave, the operator stands still while you choose an upgrade.

## Status

Playable first build. The wave system, enemy pathing, destructible entrances and character animation are adapted from the supplied original. Sector Null has a new Three.js reactor deck, armoured operator, security drones, interface and procedural Web Audio effects. The Core Zero art direction informed the smoked glass, machined hardware and cyan and amber lighting. Score, high score and settings are saved in the browser.

Scoring, emerald pickups, accuracy and high-score rules are documented in [SCORING.md](./SCORING.md).

## Enemy roles and wave bosses

Each wave ends with one larger red boss after all regular bots are defeated. The boss has a named health bar, extra armour and reduced knockback. Outside the deck they sprint toward an opening (~2.8×). Cannon keeps that sprint and only sprays warning bolts through its door/window on the way in — full aimed volleys wait until it is on the deck. On death it plays a short multi-blast sequence (staggered body explosions, a final shockwave burst, light screen shake) while you stay controllable and invulnerable; enemy shots are cleared and nothing new spawns. After a brief hold the upgrade picker fades in. Reduced-motion and the screen-shake setting both shorten or mute the spectacle. Boss health uses a moderated per-wave curve (`6 + 1.3×wave + 0.1×wave²` times the wave's base health), with milestone attack patterns every fifth wave. Wave 1 contains grey patrols. Bosses rotate through four named tricks: Slammer (wide slam melee), Charger (rush and swipe), Cannon / Skirmisher (volley or flank), and Spawner (peels off spawns that later reform into the core). Cannon appears from wave 3 with charged volleys. All bots share the same hunt pathing; locomotion differs by role (walk, wheels, skitter, stomp). Enemy shots stop at cover and are cleared between combat phases.

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

Health multipliers apply to the wave's base health and round up. Boss melee and projectiles deal 1 shield damage. Projectile speed stays at 8 units/second and enemy movement caps at 5.5, below the operator's base speed. Colour identifies the role; size, cannon silhouettes and movement provide additional cues. The boss intro banner shows only the name.

From about wave 12 the game soft-caps debris, enemy bolts and live score gems, trims spark counts, and budgets SFX voices so late runs (wave 25+) stay responsive without changing early-wave feel. Overflow gems still bank their score. After a hitch the loop briefly sheds cosmetic work and caps the player move step so control doesn’t feel stuck then suddenly lunge.

## Navigation and power-up feedback

Uncollected supplies expire after 6 seconds of active play. During the final 2 seconds they blink twice per second and their ground ring shrinks. Reduced-motion mode keeps them visible and uses only the shrinking ring. Drop timers pause while choosing an upgrade or pausing the game.

Bots plan around both cover and bulkheads using navigation graphs sized to their bodies. Routes refresh as the target moves, with stable corner choices to limit jitter. Movement checks clearance before stepping, turns in place for sharp corners, and limits steps at waypoints. Ranged strafing uses the same navigation; crowd separation avoids pushing bots into obstacles. Melee attacks cannot pass through solid cover.

Power-ups light the operator orange for Overcharge and blue for Infinite Cell with a strong pulsing glow (steady under reduced motion). Peaks flash toward white so the buff feels active. If both are active, the torso and limbs pulse on separate phases. Shield kits produce a short pink glow. Repeat Overcharge pickups add 10 seconds and Infinite Cell pickups add 8 seconds to the remaining duration; damage stays at 2×. Extra stored time strengthens the glow and shows EXTENDED beside the active timer. What each power-up does is taught once on first pickup; the HUD timer does not repeat that explanation. Magnetic Gems shows as a soft green circle around the operator once owned — not a timed HUD line.

## Run locally

Use Node.js 22 or later.

```sh
npm ci
npm run dev
```

`npm run build` writes a static site to `dist/`. Use `npm run preview` to serve that build locally. The browser needs WebGL. The menu track loops across the intro and main menu. If the browser blocks autoplay, use the title screen's Start prompt to enable sound. Selecting Play switches to the gameplay score.

The gameplay score uses the full-length loops in `assets/score/`. Wave-start and wave-clear stingers are disabled to avoid overlapping cues. Clearing a wave crossfades over 0.9 seconds into the upgrade loop at 38% gain with a 1 kHz low-pass filter, giving the break a quieter, softer sound. Combat music fades back in only when the next wave starts. Waves 1–4 use the early loop and wave 5 onward uses the late loop. Wave 4 switches on the next bar with a 0.6-second crossfade if eight drones are alive at once. The late loop has a 0.65 gain trim to compensate for its louder recording; overall gameplay score gain is 3.8, down from 5.5. Pausing freezes the music and wave timing together.

Supply pickup notices appear one at a time. The first pickup of each type in every run shows a short explanation for 4.5 seconds: +1 Shield restores one shield, Overcharge doubles damage for 10 seconds, and Infinite Cell gives unlimited ammo for 8 seconds. Later pickups in the same run show only the name. Learning notices take priority over routine notices without interrupting another explanation. Their reading timer waits until the upgrade picker is fully closed. Lesson history resets each run, so an earlier session cannot suppress a new explanation.

**Magnetic Gems** is a permanent green **ability** upgrade. It appears in the normal three-card wave-clear picker as an alternative to firepower / engineer / survival — take it instead of another option when you want the score path. Once picked it stays for the run, marks the operator with a soft green floor circle, and pulls score gems through walls at a readable surge. Timed supplies (Overcharge / Infinite Cell) stay short combat spikes.

The bottom-right weapon display shows your current magazine and adds visible rifle parts as you pick weapon upgrades.

The pulse rifle uses a low, weighty energy pulse with a short midrange attack and bass impact. The recharge hum is subdued, with a single soft ready tone. Shot pitch gradually drops by up to three semitones as the cell empties. At one remaining charge, a low-energy beep and amber LAST CHARGE label warn you; recharging shows RECHARGING… and a progress bar. A power-down tone leads into a rising charge hum timed to the recharge duration, followed by a ready chirp and cyan CELL READY label. These labels also appear on mobile. Infinite Cell keeps full-energy shot pitch and suppresses low-charge warnings and manual recharging. Pausing freezes the charge audio; interrupted recharges stop their hum.

Destroyed drones burst into sparks and scattered parts. Reduced-motion settings suppress the blast flash and cut the spark count.

| Action | Keyboard and mouse | Touch |
| --- | --- | --- |
| Move | WASD or arrow keys | Plant and drag on the left side (also turns the gun) |
| Aim and fire | Mouse and left click | Plant the right thumb to fire; drag to aim independently |
| Recharge | R | Tap the weapon panel |
| Pause | Esc or P | Menu icon in the score panel |
| Choose an upgrade | 1–3 or click | Tap a card |
| Mute | M or volume settings | Volume settings |

Touch sticks are dynamic: each thumb creates a virtual stick where it lands. If a thumb drifts past the rim, the stick base follows so full input is kept. The right stick starts firing as soon as it is held, using the current facing until you drag to steer.

On iPhone, Add to Home Screen keeps the game full-screen (`black-translucent` status bar, `viewport-fit=cover`). HUD, gun panel, boss bar and overlays sit `18px` past `env(safe-area-inset-*)` so they clear the Dynamic Island and home indicator. Safari already lays the page out below its chrome, so those insets are 0 and the layout does not change. If an older home-screen icon still sits under the status bar, remove it and add the page to the home screen again.

The canvas size follows `visualViewport` (not a one-shot `innerHeight`), and the document is `position: fixed` with overflow hidden so iOS standalone cannot scroll the page after the safe-area/visual viewport settles. Layout, renderer size and camera aspect remeasure on `resize`, `visualViewport` resize, `orientationchange` (with a delayed pass), `pageshow`, and at startup. The title menu fades in and accepts taps only after that size has been stable for a couple of frames (or ~1s).

## Engineer and defence paths

Upgrade cards show a visual preview, pip ranks and a larger recommended option. Owned gear is visible on the cards themselves (filled pips / UPGRADE HELPER BOT), so the picker does not repeat a build summary underneath. Recommendations favour an urgently needed shield, a first Split Beam, or continuing owned equipment. All three cards remain deliberate choices; nothing is automatically selected. Use 1–3, tap, or Tab and Enter. Offers include an engineer option whenever an eligible one remains, and owned modules receive higher offer weight. Ability cards such as Magnetic Gems compete in the same three offers — pick them instead of another upgrade when you want the score path.

- **Helper Bot (3 ranks):** a white floating sphere with a small centred gun; orbits the operator at shoulder height and fires automatically. Ranks increase shot damage and firing speed. Specialise in **Twin Guns (2 ranks)** for doubled shots then faster firing, or **Bomb Launcher (2 ranks)** for slower area blasts then a wider blast. Twin barrels sit together in the central socket; the shell stays white with either specialisation. These specialisations are mutually exclusive for that run. Bot fire does not affect rifle accuracy bonuses.
- **Trail Mines (3 ranks):** automatically deploy every 8 seconds at every rank, with at most three active. Ranks increase damage (4/5/6) and blast radius (2/2.2/2.4 units), not deployment frequency. Mines last 18 seconds and arm after 0.6 seconds. **Shock Mines** adds a 60% movement slow for three seconds to blast survivors. This keeps mines as occasional positioning tools rather than a constant source of area damage.
- **Shield Regen (2 ranks):** restores one shield after 12/8 seconds without damage, repeating while injured. **Emergency Pulse (3 ranks):** taking damage triggers an area blast and brief slow; ranks increase range and damage.

Equipment uses active combat time and pauses with the game or upgrade selection. Mines, warning zones and effects clear between waves; all equipment resets for a new run. Automated equipment deliberately adds no touch buttons.

## Milestone encounters

Waves 5, 10, 15 and onward in multiples of five replace the regular boss with the Reactor Warden / Null Overseer. Reactor lighting gradually shifts to amber or violet during the encounter. The boss marks three ground zones (four from wave 10) with a 1.4-second warning, then each ring detonates as a reactor blast (shockwave, sparks, lightning column, 1 shield if you are still inside). Its exposed phase grants 75% bonus incoming damage for 3.2 seconds, followed by pursuit before the next cycle. Move out of the marked rings and use that opening to attack.

Boss base health scaling is now `6 + 1.3×wave + 0.1×wave²` times regular wave health; milestone bosses use 1.2× this value. This reduces health-only attrition while new attack patterns provide pressure. Remaining emeralds are banked automatically at victory, including the final boss drop, before the upgrade screen opens.

Helper Bot repeat offers explicitly say UPGRADE HELPER BOT, show the actual damage/fire interval changes, and confirm the upgrade after selection. Bomb builds show damage improvements only because their firing interval stays fixed.

Movement input is cleared when entering/leaving upgrades, starting a run, pausing or losing window/tab focus. Gameplay focus returns to the canvas after UI choices. Arrow keys suppress browser scrolling during a run; key releases are captured at window level, and switching between keyboard movement and touch clears the previous movement source. These safeguards prevent stale inputs from carrying across UI transitions.

For opposite keyboard directions, the newest press wins on each axis (including mixed WASD/arrow bindings); releasing it restores any still-held opposite direction. OS key-repeat does not change priority. This allows immediate reversals without opposite inputs cancelling movement.
