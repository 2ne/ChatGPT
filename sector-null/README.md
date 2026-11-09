# Sector Null

A top-down sci-fi survival shooter and competition remix of [Abandon All Hope by Josh Werner](https://codepen.io/editor/joshwerner/pen/01a18d27-5cbe-77c4-9685-9f3836db15e6). Keep the reactor deck clear as rogue security units breach the bulkheads. After each wave, the operator stands still while you choose an upgrade.

## Status

Playable first build. The wave system, enemy pathing, destructible entrances and character animation are adapted from the supplied original. Sector Null has a new Three.js reactor deck, armoured operator, security drones, interface and procedural Web Audio effects. The Core Zero art direction informed the smoked glass, machined hardware and cyan and amber lighting. Best runs and settings are saved in the browser.

## Run locally

Use Node.js 22 or later.

```sh
npm ci
npm run dev
```

`npm run build` writes a static site to `dist/`. Use `npm run preview` to serve that build locally. The browser needs WebGL. The menu track loops across the intro and main menu. If the browser blocks autoplay, use the title screen's Start prompt to enable sound. Selecting Play switches to the gameplay score.

The gameplay score uses the full-length clips in `assets/score/` with one shared gain adjustment. Wave starts land on the cue hit and wave clears lead into the ability loop. Waves 1–4 start with the early loop and wave 5 onward starts with the late loop. Wave 4 switches on the next bar if eight drones are alive at once. Pausing freezes the music and wave timing together.

Supply pickup notices appear one at a time. Each drop type shows a short effect description the first time its notice appears, and the game remembers discovered types in the browser.

The bottom-right weapon display shows your current magazine and adds visible rifle parts as you pick weapon upgrades.

Destroyed drones burst into sparks and scattered parts. Reduced-motion settings suppress the blast flash and cut the spark count.

| Action | Keyboard and mouse | Touch |
| --- | --- | --- |
| Move | WASD or arrow keys | Drag on the left side |
| Aim and fire | Mouse and left click | Drag and hold on the right side |
| Reload | R | Reload button |
| Pause | Esc or P | Pause button |
| Choose an upgrade | 1–3 or click | Tap a card |
| Mute | M or volume settings | Volume settings |
